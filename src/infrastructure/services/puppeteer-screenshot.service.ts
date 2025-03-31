
import fs from 'node:fs';
import puppeteer from 'puppeteer';

import { Screenshot } from '@domain/entities/screenshot.entity';
import { ScreenshotRepository } from '@domain/repository/screenshot.repository';


export class PuppeteerScreenShotService implements ScreenshotRepository {
    constructor (public readonly path: string){}

    public async takeScreenshot(name: string, url: string): Promise<Screenshot> {
        const screenShotPath = `${this.path}/${name}.png`;

        if (!fs.existsSync(this.path)) {
            fs.mkdirSync(this.path, { recursive: true });
        }

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' });

        await page.screenshot({ path: screenShotPath });
        await browser.close();
        
        return new Screenshot(screenShotPath)
    }
}