import fs from 'node:fs';


export class OvasModel {
    static async getAllOvas() {
        const data = fs.readFileSync('data/ovas.json', 'utf-8');
        const ovas = JSON.parse(data);
        return ovas;
    }
}