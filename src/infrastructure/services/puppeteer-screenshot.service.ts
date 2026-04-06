
import fs from 'node:fs';
import puppeteer from 'puppeteer';

import { envs } from '../../config/plugins/envs.plugin'
import { Screenshot } from '../../domain/entities/screenshot.entity';
import { ScreenshotRepository } from '../../domain/repository/screenshot.repository';


export class PuppeteerScreenShotService implements ScreenshotRepository {
    private readonly maxRetries = 3;
    private readonly timeout = 60000; // 60 segundos

    constructor(public readonly path: string) { }

    public async takeScreenshot(name: string, url: string): Promise<Screenshot> {
        const screenShotPath = `${this.path}/${name}.png`;

        if (!fs.existsSync(this.path)) {
            fs.mkdirSync(this.path, { recursive: true });
        }

        console.log('\n📸 Starting screenshot process...');
        console.log('-----------------------------------');
        console.log(`📝 Target: ${name}`);

        let lastError: Error | null = null;

        // Intentar hasta 3 veces
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            let browser = null;
            try {
                console.log(`🔄 Attempt ${attempt}/${this.maxRetries}`);
                console.log('🖥️  Launching browser...');

                browser = await puppeteer.launch({
                    headless: true,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--disable-gpu'
                    ]
                });

                const page = await browser.newPage();

                // Configurar timeout y viewport
                page.setDefaultNavigationTimeout(this.timeout);
                page.setDefaultTimeout(this.timeout);
                await page.setViewport({ width: 1280, height: 720 });

                console.log('🌐 Navigating to URL...');
                console.log(`   URL: ${url}`);

                // Intentar con diferentes estrategias de espera
                try {
                    await page.goto(url, {
                        waitUntil: 'networkidle2',
                        timeout: this.timeout
                    });
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (navError) {
                    console.log('⚠️  networkidle2 timeout, trying with domcontentloaded...');
                    await page.goto(url, {
                        waitUntil: 'domcontentloaded',
                        timeout: this.timeout
                    });
                    // Esperar un poco más para que cargue contenido
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }

                console.log('🤳 Capturing screenshot...');
                console.log(`   Saving to: ${screenShotPath}`);

                await page.screenshot({
                    path: screenShotPath,
                    fullPage: false
                });

                console.log('✅ Screenshot process completed!');
                console.log('-----------------------------------\n');

                const cleanPath = screenShotPath.replace(/(\.\.\/)+/g, '');
                const screenShotImagePath = `${envs.SCREENSHOTS_STORAGE_URL}${cleanPath}`

                return new Screenshot(screenShotImagePath);

            } catch (error) {
                lastError = error as Error;
                console.error(`❌ Attempt ${attempt} failed:`, error instanceof Error ? error.message : error);

                if (attempt < this.maxRetries) {
                    const waitTime = attempt * 2000; // Espera incremental: 2s, 4s
                    console.log(`⏳ Waiting ${waitTime / 1000}s before retry...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
            } finally {
                if (browser) {
                    await browser.close().catch(() => {});
                }
            }
        }

        // Si llegamos aquí, todos los intentos fallaron
        console.error('❌ All retry attempts failed!');
        console.error('-----------------------------------\n');

        throw new Error(`Failed to take screenshot after ${this.maxRetries} attempts: ${lastError?.message}`);
    }
}