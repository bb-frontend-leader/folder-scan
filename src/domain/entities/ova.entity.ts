import { randomUUID } from "node:crypto";

interface OvaEntityOptions {
    name: string;
    coverPath: string;
    ovaPath: string;
    hasAudio: boolean;
    hasAudioDescription: boolean;
    parentFolder?: string;
    hasVideo: boolean;
    hasSubtitles: boolean;
    hasVideoSignLanguage: boolean;
}

export class OvaEntity {
    // Properties of the OvaEntity class
    public id: string;
    public name: string;
    public coverPath: string;
    public ovaPath: string;
    public hasAudio: boolean = false;
    public hasAudioDescription: boolean = false;
    public hasVideo: boolean = false;
    public hasSubtitles: boolean = false;
    public hasVideoSignLanguage: boolean = false;
    public parentFolder: string = 'root'; // Default value for parentFolder

    constructor(
        options: OvaEntityOptions
    ) {
        const { name, coverPath, hasAudio, ovaPath, hasAudioDescription, hasSubtitles, parentFolder, hasVideo, hasVideoSignLanguage } = options;

        // Assigning values to properties
        this.id = randomUUID(); // Generates a unique identifier for the OvaEntity instance
        this.name = name;
        this.ovaPath = ovaPath; // Constructing the ovaPath using parentFolder and name
        this.parentFolder = parentFolder || 'root'; // Default to 'root' if parentFolder is not provided
        this.coverPath = coverPath;
        this.hasAudio = hasAudio;
        this.hasAudioDescription = hasAudioDescription;
        this.hasVideo = hasVideo;
        this.hasSubtitles = hasSubtitles;
        this.hasVideoSignLanguage = hasVideoSignLanguage;
    }
}