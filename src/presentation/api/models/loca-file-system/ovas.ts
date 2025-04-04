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

    static async getOvaById(id: string) {
        const data = fs.readFileSync('data/ovas.json', 'utf-8');
        const ovas = JSON.parse(data) as OvaEntity[];
        // Buscar el OVA por ID
        const ova = ovas.find(ova => ova.id === id);
        return ova;
    }
}