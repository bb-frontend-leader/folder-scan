import { Request, Response } from "express";

import { ZipFolderUseCase } from "../../../domain/use-cases/zip-folder/zip-folder";
import { JSZipService } from "../../../infrastructure/services/jszip.service";
import { OvasModel } from "../models/loca-file-system/ovas";

export class ZipController {
    static async downloadZip(req: Request, res: Response) {
        const {  id } = req.params;
        const ova = await OvasModel.getOvaById(id);

        if (!ova) {
            return res.status(404).json({ message: "OVA not found" });
        }

        const { ovaPath, name } = ova

        const zipService = new JSZipService();
        const generateZip = new ZipFolderUseCase(zipService);

        const zipBuffer = await generateZip.execute(ovaPath.local);

        res.setHeader("Content-Disposition", `attachment; filename=${name}.zip`);
        res.setHeader("Content-Type", "application/zip");
        res.send(zipBuffer);
    }
}