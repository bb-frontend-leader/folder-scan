import fs from 'node:fs/promises';

import { envs } from '../../../config/plugins/envs.plugin';
import { OvaEntity } from '../../entities/ova.entity';
import { OvaRepository } from  '../../repository/ova.repository'
import { TakeScreenShot } from '../take-screenshot/take-screenshot';

type FileType = 'Audio' | 'Video' | 'VideoSignLanguage' | 'Subtitles' | 'AudioDescription';

export type ScanFolderResult = { successCount: number, failureCount: number, skippedCount: number };

interface ScanFolderUseCase {
    execute: (folderPath: string) => Promise<ScanFolderResult>;
}

export class ScanFolder implements ScanFolderUseCase {
    constructor(
        private readonly ovaRepository: OvaRepository,
        private readonly takeScreenShot: TakeScreenShot,
    ) { }

    private cleanPath(path: string): string {
        const CLEAN_REGEX = /(\.\.\/)+/g
        return path.replace(CLEAN_REGEX, '');
    }

    public async execute(ovasPath: string): Promise<ScanFolderResult> {
        const folders = await this.getFolders(ovasPath);
        const existingOvas = await this.ovaRepository.get();
        const existingByPath = new Map(existingOvas.map(ova => [ova.ovaPath.local, ova]));
        let successCount = 0;
        let failureCount = 0;
        let skippedCount = 0;

        console.log(`\n📊 Total folders to process: ${folders.length}`);
        console.log('='.repeat(50) + '\n');

        try {
            for (let i = 0; i < folders.length; i++) {
                const folder = folders[i];

                try {
                    const signature = await this.getFolderSignature(folder.folderPath);
                    const existing = existingByPath.get(folder.folderPath);

                    if (existing && existing.contentSignature === signature) {
                        skippedCount++;
                        console.log(`⏭️  [${i + 1}/${folders.length}] Sin cambios, se omite: ${folder.name}`);
                        continue;
                    }

                    console.log(`\n[${i + 1}/${folders.length}] Processing: ${folder.name}`);

                    await this.takeScreenShot.init();

                    let screenshot;
                    try {
                        screenshot = await this.takeScreenShot.execute(
                            `${folder.name}-${folder.parentPath}`,
                            this.cleanPath(`${envs.SCREENSHOTS_STORAGE_URL}${folder.folderPath}`)
                        );
                    } catch (screenshotError) {
                        console.error(`⚠️  Screenshot failed for ${folder.name}, using placeholder`);
                        console.error(`   Error: ${screenshotError instanceof Error ? screenshotError.message : screenshotError}`);

                        // Continuar sin screenshot válido
                        screenshot = { screenShotPath: 'placeholder.png' };
                    }

                    if (!screenshot) {
                        console.error(`❌ Screenshot failed for ${folder.name}`);
                        screenshot = { screenShotPath: 'placeholder.png' };
                    }

                    const ova = new OvaEntity({
                        id: existing?.id,
                        name: folder.name,
                        coverPath: screenshot.screenShotPath,
                        ovaPath: {
                            server: this.cleanPath(`${envs.OVA_URL}${folder.folderPath}`),
                            local: folder.folderPath,
                        },
                        hasAudio: await this.hasFileType(folder.folderPath, 'Audio'),
                        hasAudioDescription: await this.hasFileType(folder.folderPath, 'AudioDescription'),
                        hasSubtitles: await this.hasFileType(folder.folderPath, 'Subtitles'),
                        parentFolder: folder.parentPath,
                        hasVideo: await this.hasFileType(folder.folderPath, 'Video'),
                        hasVideoSignLanguage: await this.hasFileType(folder.folderPath, 'VideoSignLanguage'),
                        contentSignature: signature,
                    });

                    this.ovaRepository.save(ova);
                    successCount++;
                    console.log(`✅ [${i + 1}/${folders.length}] Successfully processed: ${folder.name}`);
                } catch (error) {
                    failureCount++;
                    console.error(`❌ [${i + 1}/${folders.length}] Failed to process ${folder.name}:`, error instanceof Error ? error.message : error);
                    // Continuar con el siguiente folder en caso de error
                }
            }
        } finally {
            await this.takeScreenShot.dispose();
        }

        console.log('\n' + '='.repeat(50));
        console.log('📊 Processing Summary:');
        console.log(`   ✅ Success: ${successCount}`);
        console.log(`   ⏭️  Skipped (unchanged): ${skippedCount}`);
        console.log(`   ❌ Failures: ${failureCount}`);
        console.log(`   📦 Total: ${folders.length}`);
        console.log('='.repeat(50) + '\n');

        return { successCount, failureCount, skippedCount };
    }

    private async getFolderSignature(folderPath: string): Promise<string> {
        let maxMtimeMs = 0;
        let fileCount = 0;

        const walk = async (currentPath: string): Promise<void> => {
            const entries = await fs.readdir(currentPath, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = `${currentPath}/${entry.name}`;
                const stats = await fs.stat(fullPath);
                maxMtimeMs = Math.max(maxMtimeMs, stats.mtimeMs);
                if (entry.isDirectory()) {
                    await walk(fullPath);
                } else {
                    fileCount++;
                }
            }
        };

        await walk(folderPath);
        return `${fileCount}:${maxMtimeMs}`;
    }

    private async hasFileType(folderPath: string, fileType: FileType): Promise<boolean> {
        const filePaths: Record<FileType, string> = {
            Audio: 'assets/audios',
            Video: 'assets/videos',
            AudioDescription: 'assets/audios',
            VideoSignLanguage: 'assets/videos/interprete',
            Subtitles: 'assets/videos',
        };

        const targetPath = `${folderPath}/${filePaths[fileType]}`;
        try {
            const files = await fs.readdir(targetPath);
            switch (fileType) {
                case 'Audio':
                    return files.some(file => file.endsWith('.mp3'));
                case 'AudioDescription':
                    return files.some(file => file.includes('_des_') && file.endsWith('.mp3'));
                case 'Video':
                case 'VideoSignLanguage':
                    return files.some(file => file.endsWith('.mp4'));
                case 'Subtitles':
                    return files.some(file => file.endsWith('.vtt'));
                default:
                    return false;
            }
        } catch {
            return false;
        }
    }

    private async isOvaFolder(folderPath: string): Promise<boolean> {
        try {
            const [assetsStat, indexStat] = await Promise.all([
                fs.stat(`${folderPath}/assets`),
                fs.stat(`${folderPath}/index.html`),
            ]);
            return assetsStat.isDirectory() && indexStat.isFile();
        } catch {
            return false;
        }
    }

    private async getFolders(folderPath: string): Promise<{ name: string, parentPath: string, folderPath: string }[]> {
        const folders: { name: string, parentPath: string, folderPath: string }[] = [];
        const folderPaths = new Set<string>(); // Para rastrear las rutas ya añadidas
        const REGEX = /[^/]+\/?$/; // Regular expression to match folder names

        const traverseFolders = async (currentPath: string): Promise<void> => {
            try {
                const files = await fs.readdir(currentPath, { withFileTypes: true });
                for (const file of files) {
                    if (file.isDirectory()) {
                        const fullPath = `${currentPath}/${file.name}`
                        if (!folderPaths.has(fullPath) && await this.isOvaFolder(fullPath)) {
                            const parentPath = (currentPath.match(REGEX) || [''])[0]
                            folders.push({ name: file.name, parentPath, folderPath: fullPath });
                            folderPaths.add(fullPath);
                            continue; // Es una OVA: no seguir bajando dentro de su propia estructura interna
                        }
                        await traverseFolders(fullPath); // Continuamos la búsqueda recursiva en las carpetas que no son OVAs
                    }
                }
            } catch (error) {
                console.error('Error reading directory:', error);
                throw error;
            }
        };

        await traverseFolders(folderPath);
        return folders;
    }
}
