// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['src/tests/unit/**/*.test.ts'],
		environment: 'node',
	},
	resolve: {
		alias: {
			'@lib': new URL('./src/lib', import.meta.url).pathname,
			'@': new URL('./src', import.meta.url).pathname,
		},
	},
});
