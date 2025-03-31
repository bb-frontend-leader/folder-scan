import { Screenshot } from "@domain/entities/screenshot.entity";

export abstract class ScreenshotRepository {
    abstract takeScreenshot(name: string, url: string): Promise<Screenshot>;
}