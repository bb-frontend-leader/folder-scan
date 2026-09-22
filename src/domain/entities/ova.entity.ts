import { randomUUID } from "node:crypto";

interface OvaEntityOptions {
    id?: string;
    name: string;
    coverPath: string;
    ovaPath: {
        server: string;
        local: string;
    };
    hasAudio: boolean;
    hasAudioDescription: boolean;
    parentFolder?: string;
    hasVideo: boolean;
    hasSubtitles: boolean;
    hasVideoSignLanguage: boolean;
    contentSignature: string;
}

export class OvaEntity {
    // Properties of the OvaEntity class
    public id: string;
    public name: string;
    public coverPath: string;
    public ovaPath: {
        server: string;
        local: string;
    };
    public hasAudio: boolean = false;
    public hasAudioDescription: boolean = false;
    public hasVideo: boolean = false;
    public hasSubtitles: boolean = false;
    public hasVideoSignLanguage: boolean = false;
    public parentFolder: string = 'root'; // Default value for parentFolder
    public contentSignature: string;

    constructor(
        options: OvaEntityOptions
    ) {
        const { id, name, coverPath, hasAudio, ovaPath, hasAudioDescription, hasSubtitles, parentFolder, hasVideo, hasVideoSignLanguage, contentSignature } = options;

        // Assigning values to properties
        this.id = id ?? randomUUID(); // Reuses the existing id when reprocessing an OVA, otherwise generates a new one
        this.name = name;
        this.ovaPath = ovaPath; // Constructing the ovaPath using parentFolder and name
        this.parentFolder = parentFolder || 'root'; // Default to 'root' if parentFolder is not provided
        this.coverPath = coverPath;
        this.hasAudio = hasAudio;
        this.hasAudioDescription = hasAudioDescription;
        this.hasVideo = hasVideo;
        this.hasSubtitles = hasSubtitles;
        this.hasVideoSignLanguage = hasVideoSignLanguage;
        this.contentSignature = contentSignature;
    }
}