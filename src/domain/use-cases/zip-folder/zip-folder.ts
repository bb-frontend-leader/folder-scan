import { Readable } from "node:stream";

import { ZipRepository } from "../../repository/zip.repository";


export class ZipFolderUseCase {
    constructor(private readonly zipRepository: ZipRepository) { }

    execute(folderPath: string): Readable {
        return this.zipRepository.createZipStream(folderPath)
    }
}
