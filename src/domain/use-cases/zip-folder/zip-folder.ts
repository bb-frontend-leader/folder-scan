import { ZipRepository } from "@/domain/repository/zip.repository";


export class ZipFolderUseCase {
    constructor(private readonly zipRepository: ZipRepository) { }

    async execute(folderPath: string): Promise<Buffer> {
        return await this.zipRepository.createZip(folderPath)
    }
}