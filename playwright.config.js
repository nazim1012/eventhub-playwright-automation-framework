// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();
const authFile = '.auth/user.json'
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    trace: 'on-first-retry',
    baseURL:process.env.BASE_URL,
    headless: !!process.env.CI,
    screenshot:'only-on-failure',
    video:'retain-on-failure'

  },

  /* Configure projects for major browsers */
  projects: [
    // authentication setup
    {
      name: 'setup',
      testMatch: 'auth.setup.js',
    },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] ,storageState: authFile},
      dependencies: ['setup'],
    }
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

