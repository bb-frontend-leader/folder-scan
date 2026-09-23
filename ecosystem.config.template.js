// Copy to ecosystem.config.js and adjust the values for your environment:
//   cp ecosystem.config.template.js ecosystem.config.js
//   pm2 start ecosystem.config.js
module.exports = {
  apps: [
    {
      // Unique PM2 process name (e.g., folder-scan-120-ovas-2024)
      name: 'folder-scan',
      script: './dist/app.js',
      // Absolute path to this project on the server. Must be the folder that
      // contains the .env file, since dotenv loads it from the working directory.
      cwd: '/media/azadmin/data/www/public/demos/120-ovas-2023/script',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
