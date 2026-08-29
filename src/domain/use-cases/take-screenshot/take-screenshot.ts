import { Screenshot } from "../../entities/screenshot.entity";
import { ScreenshotRepository } from "../../repository/screenshot.repository";

interface TakeScreenShotUseCase {
    execute: (name: string, url: string) => Promise<Screenshot>;
    init: () => Promise<void>;
    dispose: () => Promise<void>;
}

export class TakeScreenShot implements TakeScreenShotUseCase {
    constructor(private readonly takeScreenShotRepository: ScreenshotRepository) { }

    async execute(name: string, url: string): Promise<Screenshot> {
        return await this.takeScreenShotRepository.takeScreenshot(name, url)
    }

    async init(): Promise<void> {
        await this.takeScreenShotRepository.init();
    }

    async dispose(): Promise<void> {
        await this.takeScreenShotRepository.dispose();
    }
}