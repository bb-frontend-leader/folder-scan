import fs from 'node:fs'

import { OvaDataSource } from "../../domain/datasources/ova.datasource";
import { OvaEntity } from "../../domain/entities/ova.entity";

export class FileSystemDataSource implements OvaDataSource {

    private readonly ovaDir = 'data/';
    private readonly ovaPath = 'data/ovas.json';

    constructor() {
        this.initializeOvaDir();
        this.initializeBaseOvaFile();
        
    }

    private async initializeOvaDir() {
        if (!fs.existsSync(this.ovaDir)) {
            fs.mkdirSync(this.ovaDir, { recursive: true });
        }
    }

    private async initializeBaseOvaFile() {
        fs.writeFileSync(this.ovaPath, '[]')
    }

    public async save(ova: OvaEntity): Promise<void> {
        try {
            const data = fs.readFileSync(this.ovaPath, 'utf-8');
            const ovas = JSON.parse(data);
            ovas.push(ova);
            fs.writeFileSync(this.ovaPath, JSON.stringify(ovas, null, 2));
        } catch (error) {
            console.error('Error saving OVA:', error);
        }
    }

    public async get(): Promise<OvaEntity[]> {
        try {
            const data = fs.readFileSync(this.ovaPath, 'utf-8');
            return JSON.parse(data) as OvaEntity[];
        } catch (error) {
            console.error('Error reading OVA:', error);
            return [];
        }
    }
}