import { ScanFolder } from "@domain/use-cases/scan-folders/scan-folder";
import { TakeScreenShot } from "@domain/use-cases/take-screenshot/take-screenshot";

import { FileSystemDataSource } from "@infrastructure/datasources/file-system.datasource";
import { OvaRepositoryImpl } from "@infrastructure/repositories/ova.repositories.impl";
import { PuppeteerScreenShotService } from '@infrastructure/services/puppeteer-screenshot.service';

import { envs } from "@/config/plugins/envs.plugin";


const fileSystemOvaRepository = new OvaRepositoryImpl(new FileSystemDataSource())
const PuppeteerScreenShot = new TakeScreenShot(new PuppeteerScreenShotService(envs.SCREENSHOT_PATH))

export class Cli {
    public static execute(): void {
        console.log('CLI started!');

        new ScanFolder(
            fileSystemOvaRepository,
            PuppeteerScreenShot
        ).execute(envs.FOLDER_TO_SCAN_PATH).then(() => {
            console.log('Scan completed!');
        }).catch((error) => {
            console.error('Error during scan:', error);
        })
    }
}