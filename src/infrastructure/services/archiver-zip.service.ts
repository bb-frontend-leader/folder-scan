import archiver, { ZipEntryData } from 'archiver';
import path from 'node:path';
import { Readable } from 'node:stream';

import { ZipRepository } from '../../domain/repository/zip.repository';

// Formatos que ya vienen comprimidos: pasarlos por DEFLATE gasta CPU sin reducir el tamaño.
const STORE_EXTENSIONS = new Set([
    '.mp3', '.mp4', '.m4a', '.webm', '.ogg', '.mov',
    '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif',
    '.woff', '.woff2',
    '.zip', '.gz',
]);

export class ArchiverZipService implements ZipRepository {
    public createZipStream(folderPath: string): Readable {
        const archive = archiver('zip', { zlib: { level: 1 } });

        archive.on('warning', (error) => {
            console.warn(`⚠️  Zip warning for ${folderPath}: ${error.message}`);
        });

        archive.directory(folderPath, false, (entry) => {
            if (STORE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
                // directory() tipa el callback con EntryData, pero zip-stream sí lee `store` en cada entrada
                (entry as ZipEntryData).store = true;
            }
            return entry;
        });

        void archive.finalize();
        return archive;
    }
}
