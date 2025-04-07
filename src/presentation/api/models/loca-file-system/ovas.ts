import fs from 'node:fs';
import { env } from 'node:process';

import { OvaEntity } from '../../../../domain/entities/ova.entity';


export class OvasModel {
    private static readonly ovaPath = env.DATA_STORAGE_URL + '/' + env.DATA_STORAGE_FILE;

    static async getAllOvas() {
        const data = fs.readFileSync(this.ovaPath, 'utf-8');
        const ovas = JSON.parse(data);
        return ovas;
    }

    static async getAllOvaGroups() {
        const data = fs.readFileSync(this.ovaPath, 'utf-8');
        const ovas = JSON.parse(data) as OvaEntity[];
        // Extraer los grupos de OVA únicos
        return Array.from(new Set(ovas.map(ova => ova.parentFolder)));
    }

    static async getOvaById(id: string) {
        const data = fs.readFileSync(this.ovaPath, 'utf-8');
        const ovas = JSON.parse(data) as OvaEntity[];
        // Buscar el OVA por ID
        const ova = ovas.find(ova => ova.id === id);
        return ova;
    }
}