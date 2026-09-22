import { envs } from "../../config/plugins/envs.plugin";
import { ScanFolder } from "../../domain/use-cases/scan-folders/scan-folder";
import { TakeScreenShot } from "../../domain/use-cases/take-screenshot/take-screenshot";
import { FileSystemDataSource } from "../../infrastructure/datasources/file-system.datasource";
import { OvaRepositoryImpl } from "../../infrastructure/repositories/ova.repositories.impl";
import { EmailService } from "../../infrastructure/services/email.service";
import { PuppeteerScreenShotService } from '../../infrastructure/services/puppeteer-screenshot.service';


const fileSystemOvaRepository = new OvaRepositoryImpl(new FileSystemDataSource())
const PuppeteerScreenShot = new TakeScreenShot(new PuppeteerScreenShotService(envs.SCREENSHOTS_STORAGE_PATH))

export class Cli {
    public static execute(): void {
        // Email service
        const emailService = new EmailService()

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
        ).execute(envs.SCAN_FOLDER_PATH).then((result) => {
            console.log(`✅ Scan process completed successfully! 🎉 All folders have been processed (${result.successCount} processed, ${result.skippedCount} unchanged, ${result.failureCount} failed).`);
            emailService.sendEmail({
                to: envs.NOTIFICATION_EMAIL,
                subject: `✅ Scan completed successfully for ${envs.OVA_URL} 🎉`,
                htmlBody: `
                    <h1>✅ Scan Process Completed Successfully! 🎉</h1>
                    <p>📂 All folders have been successfully processed and analyzed.</p>
                    <p>📚 Scan results saved to: <strong>ovas.json</strong></p>
                    <p>🌐 Project: <a href="${envs.OVA_URL}">${envs.OVA_URL}</a></p>
                    <p>📁 Scanned directory: ${envs.SCAN_FOLDER_PATH}</p>
                    <p>📷 Screenshots saved to: ${envs.SCREENSHOTS_STORAGE_PATH}</p>
                `,
            })

        }).catch((error) => {
            console.error('\n❌  ERROR: Scan process failed! 😥');
            console.error('='.repeat(40));
            console.error(error);
            console.error('='.repeat(40) + '\n');
        })
    }
}