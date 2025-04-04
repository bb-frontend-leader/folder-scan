import fs from 'node:fs';

import { OvaEntity } from '@/domain/entities/ova.entity';


export class OvasModel {
    static async getAllOvas() {
        const data = fs.readFileSync('data/ovas.json', 'utf-8');
        const ovas = JSON.parse(data);
        return ovas;
    }

    static async getAllOvaGroups() {
        const data = fs.readFileSync('data/ovas.json', 'utf-8');
        const ovas = JSON.parse(data) as OvaEntity[];
        // Extraer los grupos de OVA únicos
        return Array.from(new Set(ovas.map(ova => ova.parentFolder)));
    }
}