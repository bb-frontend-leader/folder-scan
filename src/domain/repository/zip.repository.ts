

export abstract class ZipRepository {
    abstract createZip(folderPath: string): Promise<Buffer>;
}