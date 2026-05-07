import fs from 'node:fs';

import { envs } from '../../../../config/plugins/envs.plugin'
import { OvaEntity } from '../../../../domain/entities/ova.entity';


export class OvasModel {
    private static readonly ovaPath = envs.DATA_STORAGE_URL + '/' + envs.DATA_STORAGE_FILE;

    static async getAllOvas() {
        const data = fs.readFileSync(this.ovaPath, 'utf-8');
        const ovas = JSON.parse(data) as OvaEntity[];
        return ovas.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
    }

    static async getAllOvaGroups() {
        const data = fs.readFileSync(this.ovaPath, 'utf-8');
        const ovas = JSON.parse(data) as OvaEntity[];
        // Extraer los grupos de OVA únicos
        return Array.from(new Set(ovas.map(ova => ova.parentFolder)))
            .sort((a, b) => (a ?? '').localeCompare(b ?? '', undefined, { numeric: true, sensitivity: 'base' }));
    }

    static async getOvaById(id: string) {
        const data = fs.readFileSync(this.ovaPath, 'utf-8');
        const ovas = JSON.parse(data) as OvaEntity[];
        // Buscar el OVA por ID
        const ova = ovas.find(ova => ova.id === id);
        return ova;
    }
}