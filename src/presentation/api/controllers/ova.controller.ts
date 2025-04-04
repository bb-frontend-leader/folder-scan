import { Request, Response } from "express";

import { OvasModel } from "../models/loca-file-system/ovas";


export class OvaController {
    static async getAllOvas(req: Request, res: Response) {
        const ovas = await OvasModel.getAllOvas();
        if (!ovas) {
            return res.status(404).json({ message: "No OVAs found" });
        }
        res.json(ovas);
    }
    
    static async getAllOvaGroups(req: Request, res: Response) {
        const groups = await OvasModel.getAllOvaGroups();
        if (groups.length < 0) {
            return res.status(404).json({ message: "No OVAs found" });
        }
        res.json(groups);
    }

    static async getOvaById(req: Request, res: Response) {
        const { id } = req.params;
        const ova = await OvasModel.getOvaById(id);
        if (!ova) {
            return res.status(404).json({ message: "OVA not found" });
        }
        res.json(ova);
    }
}