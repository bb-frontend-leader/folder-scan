
import fs from 'node:fs';
import puppeteer from 'puppeteer';

import { envs } from '../../config/plugins/envs.plugin'
import { Screenshot } from '../../domain/entities/screenshot.entity';
import { ScreenshotRepository } from '../../domain/repository/screenshot.repository';


export class PuppeteerScreenShotService implements ScreenshotRepository {
    constructor (public readonly path: string){}

    public async takeScreenshot(name: string, url: string): Promise<Screenshot> {
        const screenShotPath = `${this.path}/${name}.png`;

        if (!fs.existsSync(this.path)) {
            fs.mkdirSync(this.path, { recursive: true });
        }

        console.log('\n📸 Starting screenshot process...');
        console.log('-----------------------------------');
        console.log('🖥️  Launching browser...');

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        console.log('🌐 Navigating to URL...');
        console.log(`   URL: ${url}`);

        await page.goto(url, { waitUntil: 'networkidle2' });

        console.log('🤳 Capturing screenshot...');
        console.log(`   Saving to: ${screenShotPath}`);

        await page.screenshot({ path: screenShotPath });
        await browser.close();

        console.log('✅ Screenshot process completed!');
        console.log('-----------------------------------\n');

        const cleanPath = screenShotPath.replace(/(\.\.\/)+/g, '');
        const screenShotImagePath = `${envs.SCREENSHOTS_STORAGE_URL}${cleanPath}`

        return new Screenshot(screenShotImagePath);
    }
}