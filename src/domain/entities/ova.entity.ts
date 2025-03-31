import { randomUUID } from "node:crypto";

interface OvaEntityOptions {
    name: string;
    coverPath: string;
    filePath: string;
}

export class OvaEntity {
    // Properties of the OvaEntity class
    public id: string;
    public name: string;
    public coverPath: string;
    public filePath: string;

    constructor(
        options: OvaEntityOptions
    ) {
        const { name, coverPath, filePath } = options;

        // Assigning values to properties
        this.id = randomUUID(); // Generates a unique identifier for the OvaEntity instance
        this.name = name;
        this.coverPath = coverPath;
        this.filePath = filePath;
    }
}