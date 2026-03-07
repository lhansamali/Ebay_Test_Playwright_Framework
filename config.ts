import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './test',
    timeout: 30000,
    retries: 0,
    reporter: [
        ['html', { outputFolder: 'reports', open: 'never' }],
        ['list']
    ],
    use: {
        baseURL: 'https://automationexercise.com/api',
        trace: 'on-first-retry'
    },
    outputDir: 'reports'
});
