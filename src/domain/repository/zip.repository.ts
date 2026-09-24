import { Readable } from 'node:stream';

export abstract class ZipRepository {
    abstract createZipStream(folderPath: string): Readable;
}
