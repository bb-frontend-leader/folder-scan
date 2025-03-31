import { Screenshot } from "@domain/entities/screenshot.entity";
import { ScreenshotRepository } from "@domain/repository/screenshot.repository";

interface TakeScreenShotUseCase {
    execute: (name: string, url: string) => Promise<Screenshot>;
}

export class TakeScreenShot implements TakeScreenShotUseCase {
    constructor(private readonly takeScreenShotRepository: ScreenshotRepository) { }

    async execute(name: string, url: string): Promise<Screenshot> {
        return await this.takeScreenShotRepository.takeScreenshot(name, url)
    }
}