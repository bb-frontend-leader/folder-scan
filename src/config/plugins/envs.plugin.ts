import * as env from 'env-var'

import 'dotenv/config'

export const envs = {
    FOLDER_TO_SCAN_PATH: env.get('FOLDER_TO_SCAN_PATH').required().asString(),
    SCREENSHOT_PATH: env.get('SCREENSHOT_PATH').required().asString(),
}