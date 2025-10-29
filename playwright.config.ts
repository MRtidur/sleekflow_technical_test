import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  /* ✅ Global timeout per test (default = 30s) */
  timeout: 90 * 1000, // 90 seconds per test

  /* ✅ Timeout for auto-waiting expect() assertions */
  expect: {
    timeout: 60 * 1000, // 15 seconds
  },

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',

  /* Shared settings for all projects below. */
  use: {
    /* Base URL for navigation helpers like page.goto('/') */
    // baseURL: 'https://sleekflow.io',

    /* ✅ Optional: action timeout (click, fill, etc.) */
    actionTimeout: 60 * 1000, // 20 seconds max per action

    /* ✅ Capture trace for retries */
    trace: 'on-first-retry',

    /* You can also auto-record video or screenshot for debugging */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },

  /* Configure browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
