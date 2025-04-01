import { ScanFolder } from "@domain/use-cases/scan-folders/scan-folder";
import { TakeScreenShot } from "@domain/use-cases/take-screenshot/take-screenshot";

import { FileSystemDataSource } from "@infrastructure/datasources/file-system.datasource";
import { OvaRepositoryImpl } from "@infrastructure/repositories/ova.repositories.impl";
import { PuppeteerScreenShotService } from '@infrastructure/services/puppeteer-screenshot.service';

import { envs } from "@/config/plugins/envs.plugin";


const fileSystemOvaRepository = new OvaRepositoryImpl(new FileSystemDataSource())
const PuppeteerScreenShot = new TakeScreenShot(new PuppeteerScreenShotService(envs.SCREENSHOTS_STORAGE_PATH))

export class Cli {
    public static execute(): void {
        console.log('\n' + '='.repeat(40));
        console.log('🚀  Folder Scan CLI - Starting');
        console.log('='.repeat(40) + '\n');

        console.log(`📁  Folder to Scan      : ${envs.SCAN_FOLDER_PATH}`);
        console.log(`📷  Screenshot Directory: ${envs.SCREENSHOTS_STORAGE_PATH}`);
        console.log(`📚  Scan data output    : ovas.json\n`);

        console.log('='.repeat(40));
        console.log('🔍  Initiating scan process...');
        console.log('='.repeat(40) + '\n');

        new ScanFolder(
            fileSystemOvaRepository,
            PuppeteerScreenShot
        ).execute(envs.SCAN_FOLDER_PATH).then(() => {
            console.log('✅ Scan process completed successfully! 🎉 All folders have been processed.');
        }).catch((error) => {
            console.error('\n❌  ERROR: Scan process failed! 😥');
            console.error('='.repeat(40));
            console.error(error);
            console.error('='.repeat(40) + '\n');
        })
    }
}