# Folder Scan

A Node.js application that scans folders and catalogs files not present in the database. It uses Puppeteer to automatically take screenshots of files and provides both CLI and API interfaces.

## Features

- 📁 **Folder Scanning**: Recursively scans specified directories
- 📸 **Screenshot Capture**: Uses Puppeteer to take screenshots of files
- 🗄️ **Database Integration**: Tracks files and compares against existing records
- ⏰ **Scheduled Scans**: Automated daily scans using cron jobs (default: 5:30 AM)
- 🌐 **REST API**: Express server for programmatic access
- 📧 **Email Notifications**: Sends completion reports via email
- 📦 **ZIP Support**: Handles ZIP file operations with JSZip

## Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/bb-frontend-leader/folder-scan.git
cd folder-scan
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.template .env
```

Edit the `.env` file with your configuration (see [Configuration](#configuration) section).

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Path to the folder to scan
SCAN_FOLDER_PATH='/path/to/scan'

# Path where the data will be stored
DATA_STORAGE_PATH='/path/to/data'

# Name of the file where the data will be stored
DATA_STORAGE_FILE='ovas.json'

# Path where screenshots will be stored
SCREENSHOTS_STORAGE_PATH='/path/to/screenshots'

# Base URL for the screenshots
SCREENSHOT_URL_BASE='http://example.com/screenshots'

# URL for the OVA files
OVA_URL='http://example.com/ova'
```

## Usage

### Development Mode

Run the application in development mode with hot-reload:

```bash
npm run dev
```

### Production Mode

1. Build the TypeScript project:
```bash
npm run build
```

2. Start the application:
```bash
npm start
```

### CLI Mode

The CLI automatically executes when the application starts and performs the following:
- Scans the configured folder path
- Takes screenshots of discovered files
- Saves results to `ovas.json`
- Sends an email notification upon completion

### API Server

The Express server starts automatically on the configured port and provides REST endpoints for interacting with the application.

## Project Structure

```
folder-scan/
├── src/
│   ├── app.ts                    # Application entry point
│   ├── config/                   # Configuration files
│   ├── domain/                   # Domain layer (business logic)
│   │   ├── datasources/          # Data source interfaces
│   │   ├── entities/             # Domain entities
│   │   ├── repository/           # Repository interfaces
│   │   └── use-cases/            # Business use cases
│   ├── infrastructure/           # Infrastructure layer
│   │   ├── datasources/          # Data source implementations
│   │   ├── repositories/         # Repository implementations
│   │   └── services/             # External services (Puppeteer, Email, Cron)
│   └── presentation/             # Presentation layer
│       ├── api/                  # REST API (Express server)
│       └── cli/                  # Command-line interface
├── dist/                         # Compiled JavaScript output
├── .env.template                 # Environment variable template
├── package.json                  # Project dependencies and scripts
└── tsconfig.json                 # TypeScript configuration
```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Build and run the application
- `npm run dev` - Run in development mode with auto-reload

## Technologies Used

- **TypeScript** - Type-safe JavaScript
- **Express** - Web server framework
- **Puppeteer** - Browser automation for screenshots
- **Cron** - Scheduled task execution
- **Nodemailer** - Email notifications
- **JSZip** - ZIP file handling
- **dotenv** - Environment variable management

## Cron Schedule

The application runs an automatic scan every day at **5:30 AM** by default. This can be modified in `src/app.ts`.

## Author

**Alejandro Repizo**

## License

ISC

## Keywords

folder, scan, files, database, puppeteer, screenshot
