import * as env from 'env-var'

import 'dotenv/config'

export const envs = {
    SCAN_FOLDER_PATH: env.get('SCAN_FOLDER_PATH').required().asString(),
    SCREENSHOTS_STORAGE_PATH: env.get('SCREENSHOTS_STORAGE_PATH').required().asString(),
    SCREENSHOTS_STORAGE_URL: env.get('SCREENSHOT_URL_BASE').required().asString(),
}