import { Request, Response } from "express";
import fs from "node:fs/promises";
import { pipeline } from "node:stream/promises";

import { ZipFolderUseCase } from "../../../domain/use-cases/zip-folder/zip-folder";
import { ArchiverZipService } from "../../../infrastructure/services/archiver-zip.service";
import { OvasModel } from "../models/loca-file-system/ovas";

export class ZipController {
    static async downloadZip(req: Request<{ id: string }>, res: Response) {
        const {  id } = req.params;
        const ova = await OvasModel.getOvaById(id);

        if (!ova) {
            return res.status(404).json({ message: "OVA not found" });
        }

        const { ovaPath, name } = ova

        const folderExists = await fs.stat(ovaPath.local).then(stats => stats.isDirectory(), () => false);
        if (!folderExists) {
            return res.status(404).json({ message: "OVA folder not found on disk" });
        }

        const zipService = new ArchiverZipService();
        const generateZip = new ZipFolderUseCase(zipService);

        const zipStream = generateZip.execute(ovaPath.local);

        // Fallback ASCII para clientes antiguos + filename* (RFC 5987) con el nombre real codificado
        const asciiName = name.replace(/[^\x20-\x7E]|["\\]/g, "_");
        const encodedName = encodeURIComponent(name).replace(/['()*]/g, char => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${asciiName}.zip"; filename*=UTF-8''${encodedName}.zip`
        );
        res.setHeader("Content-Type", "application/zip");

        try {
            await pipeline(zipStream, res);
        } catch (error) {
            // El cliente canceló la descarga: pipeline ya destruyó el stream, no es un fallo del servidor
            if ((error as NodeJS.ErrnoException).code === "ERR_STREAM_PREMATURE_CLOSE") return;
            throw error;
        }
    }
}
