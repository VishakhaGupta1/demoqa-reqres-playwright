const path = require('path');

process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(__dirname, '.browsers');

require('dotenv').config();

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  timeout: 30000,
  reporter: 'html',
  use: {
    headless: false,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
