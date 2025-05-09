import * as env from 'env-var'

import 'dotenv/config'

export const envs = {
    SCAN_FOLDER_PATH: env.get('SCAN_FOLDER_PATH').required().asString(),
    SCREENSHOTS_STORAGE_PATH: env.get('SCREENSHOTS_STORAGE_PATH').required().asString(),
    SCREENSHOTS_STORAGE_URL: env.get('SCREENSHOT_URL_BASE').required().asString(),
    OVA_URL: env.get('OVA_URL').required().asString(),
    DATA_STORAGE_URL: env.get('DATA_STORAGE_PATH').required().asString(),
    DATA_STORAGE_FILE: env.get('DATA_STORAGE_FILE').required().asString(),
    MAILER_SERVICE: env.get('MAILER_SERVICE').required().asString(),
    MAILER_EMAIL: env.get('MAILER_EMAIL').required().asEmailString(),
    MAILER_SECRET_KEY: env.get('MAILER_SECRET_KEY').required().asString(),
    SERVER_PORT: env.get('SERVER_PORT').required().asPortNumber(),
}