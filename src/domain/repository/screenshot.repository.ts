import { Screenshot } from "../entities/screenshot.entity"; 

export abstract class ScreenshotRepository {
    abstract init(): Promise<void>;
    abstract dispose(): Promise<void>;
    abstract takeScreenshot(name: string, url: string): Promise<Screenshot>;
}