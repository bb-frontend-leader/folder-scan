import fs from 'node:fs/promises';

import { envs } from '../../../config/plugins/envs.plugin';
import { OvaEntity } from '../../entities/ova.entity';
import { OvaRepository } from  '../../repository/ova.repository'
import { TakeScreenShot } from '../take-screenshot/take-screenshot';

type FileType = 'Audio' | 'Video' | 'VideoSignLanguage' | 'Subtitles' | 'AudioDescription';

interface ScanFolderUseCase {
    execute: (folderPath: string) => Promise<void>;
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

    public async execute(ovasPath: string): Promise<void> {
        const folders = await this.getFolders(ovasPath);
        let successCount = 0;
        let failureCount = 0;

        console.log(`\n📊 Total folders to process: ${folders.length}`);
        console.log('='.repeat(50) + '\n');

        for (let i = 0; i < folders.length; i++) {
            const folder = folders[i];
            console.log(`\n[${i + 1}/${folders.length}] Processing: ${folder.name}`);
            
            try {
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

        console.log('\n' + '='.repeat(50));
        console.log('📊 Processing Summary:');
        console.log(`   ✅ Success: ${successCount}`);
        console.log(`   ❌ Failures: ${failureCount}`);
        console.log(`   📦 Total: ${folders.length}`);
        console.log('='.repeat(50) + '\n');
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
                        if (file.name.startsWith('ova-') && !folderPaths.has(fullPath)) {
                            const parentPath = (currentPath.match(REGEX) || [''])[0]
                            folders.push({ name: file.name, parentPath, folderPath: fullPath });
                            folderPaths.add(fullPath);
                        }
                        await traverseFolders(fullPath); // Continuamos la búsqueda recursiva en todas las carpetas
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
