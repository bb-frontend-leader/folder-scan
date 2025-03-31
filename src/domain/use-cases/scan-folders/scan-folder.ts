import fs from 'node:fs/promises';

import { OvaEntity } from '@domain/entities/ova.entity';
import { OvaRepository } from '@domain/repository/ova.repository';
import { TakeScreenShot } from '@domain/use-cases/take-screenshot/take-screenshot';

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
            const screenshot = await this.takeScreenShot.execute(folder.name, `https://demos.booksandbooksdigital.com.co/200-ovas-2025/${folder.name}`);
            if (!screenshot) {
                console.error(`Screenshot failed for ${folder.name}`);
            }

            const ova = new OvaEntity({
                name: folder.name,
                coverPath: screenshot.screenShotBase64,
                filePath: `${folder.folderPath}/${folder.name}.zip`,
            });


            this.ovaRepository.save(ova);
        }
    }

    private async getFolders(folderPath: string): Promise<{ name: string, folderPath: string }[]> {
        try {
            const files = await fs.readdir(folderPath, { withFileTypes: true });
            return files
                .filter(file => file.isDirectory())
                .map(folder => ({
                    name: folder.name,
                    folderPath: `${folderPath}/${folder.name}`,
                }));
        } catch (error) {
            console.error('Error reading directory:', error);
            throw error;
        }
    }
}
