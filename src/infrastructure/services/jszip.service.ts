import JSZip from 'jszip';
import fs from 'node:fs/promises';
import path from 'node:path';

export class JSZipService {
    private zip: JSZip;

    constructor() {
        this.zip = new JSZip();
    }

    public async createZip(folderPath: string): Promise<Buffer> {
        // if (files.length === 0) {
        //     throw new Error('No files to zip');
        // }

        // if (files.some(file => !file.name || !file.content)) {
        //     throw new Error('All files must have a name and content');
        // }

        // files.forEach(file => {
        //     this.zip.file(file.name, file.content);
        // });

        await this.addFolderToZip(folderPath, this.zip);
        return await this.zip.generateAsync({ type: 'nodebuffer' });
    }

    private async addFolderToZip(folderPath: string, zipFolder: JSZip): Promise<void> {
        const items = await fs.readdir(folderPath, { withFileTypes: true });
 
        for (const item of items) {
            const fullPath = path.join(folderPath, item.name);
            if (item.isDirectory()) {
                const subZipFolder = zipFolder.folder(item.name)!;
                await this.addFolderToZip(fullPath, subZipFolder);
            } else {
                const fileContent = await fs.readFile(fullPath);
                zipFolder.file(item.name, fileContent);
            }
        }
    }
}
