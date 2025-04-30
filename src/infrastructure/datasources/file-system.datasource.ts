import fs from 'node:fs'

import { envs } from '../../config/plugins/envs.plugin';
import { OvaDataSource } from "../../domain/datasources/ova.datasource";
import { OvaEntity } from "../../domain/entities/ova.entity";

export class FileSystemDataSource implements OvaDataSource {

    private readonly ovaDir = envs.DATA_STORAGE_URL;
    private readonly ovaPath = envs.DATA_STORAGE_URL + '/' + envs.DATA_STORAGE_FILE;

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
            
            // Verificar si ya existe una OVA con el mismo nombre
            const exists = (ovas as OvaEntity[]).some(existingOva => existingOva.ovaPath.local === ova.ovaPath.local);
            
            if (!exists) {
                ovas.push(ova);
                fs.writeFileSync(this.ovaPath, JSON.stringify(ovas, null, 2));
            } else {
                console.log(`OVA with name ${ova.name} already exists, skipping.`);
            }
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