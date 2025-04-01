import fs from 'node:fs/promises';

import { OvaEntity } from '@domain/entities/ova.entity';
import { OvaRepository } from '@domain/repository/ova.repository';
import { TakeScreenShot } from '@domain/use-cases/take-screenshot/take-screenshot';

import { envs } from '@/config/plugins/envs.plugin';

type FileType = 'Audio' | 'Video' | 'VideoSignLanguage' | 'Subtitles' | 'AudioDescription';

interface ScanFolderUseCase {
    execute: (folderPath: string) => Promise<void>;
}

export class ScanFolder implements ScanFolderUseCase {
    constructor(
        private readonly ovaRepository: OvaRepository,
        private readonly takeScreenShot: TakeScreenShot,
    ) { }

    public async execute(ovasPath: string): Promise<void> {
        const folders = await this.getFolders(ovasPath);
        for (const folder of folders) {
            const screenshot = await this.takeScreenShot.execute(`${folder.name}-${folder.parentPath}`, `${envs.SCREENSHOTS_STORAGE_URL}${folder.name}`);
         
            if (!screenshot) {
                console.error(`Screenshot failed for ${folder.name}`);
            }

            const ova = new OvaEntity({
                name: folder.name,
                coverPath: screenshot.screenShotPath,
                hasAudio: await this.hasFileType(folder.folderPath, 'Audio'),
                hasAudioDescription: await this.hasFileType(folder.folderPath, 'AudioDescription'),
                hasSubtitles: await this.hasFileType(folder.folderPath, 'Subtitles'),
                parentFolder: folder.parentPath,
                hasVideo: await this.hasFileType(folder.folderPath, 'Video'),
                hasVideoSignLanguage: await this.hasFileType(folder.folderPath, 'VideoSignLanguage'),
            });


            this.ovaRepository.save(ova);
        }
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
        const REGEX = /[^/]+\/?$/; // Regular expression to match folder names

        const traverseFolders = async (currentPath: string): Promise<void> => {
            try {
                const files = await fs.readdir(currentPath, { withFileTypes: true });
                for (const file of files) {
                    if (file.isDirectory()) {
                        const fullPath = `${currentPath}/${file.name}`
                        if (file.name.startsWith('ova-')) {
                            const parentPath = (currentPath.match(REGEX) || [''])[0]
                            folders.push({ name: file.name, parentPath, folderPath: fullPath });
                        }
                        await traverseFolders(fullPath); // Recursively search subfolders
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
