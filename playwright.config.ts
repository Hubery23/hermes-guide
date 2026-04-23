// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './src/tests/e2e',
	fullyParallel: true,
	reporter: 'list',
	use: {
		baseURL: 'http://localhost:4321',
		trace: 'retain-on-failure',
	},
	webServer: {
		command: 'pnpm preview',
		url: 'http://localhost:4321',
		reuseExistingServer: !process.env.CI,
		timeout: 60_000,
	},
	projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
