import { test, expect } from '@playwright/test';

test('zh homepage renders H visual markers', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle(/Hermes Agent/);
	await expect(page.locator('.hero .big').first()).toContainText('H/01');
	await expect(page.locator('.day-grid a')).toHaveCount(8);
});

test('en homepage renders translated content', async ({ page }) => {
	await page.goto('/en/');
	await expect(page.locator('.hero h1')).toContainText('Messaging Agent');
	await expect(page.locator('.day-grid a')).toHaveCount(8);
});

test('migrate page has compatibility chart with 10 list items', async ({ page }) => {
	await page.goto('/migrate/');
	await expect(page.locator('.migration-grid')).toBeVisible();
	await expect(page.locator('.migration-grid li')).toHaveCount(10); // 5 pairs × 2 sides
});

test('7-days index lists all 8 chapters with 1 milestone', async ({ page }) => {
	await page.goto('/7-days/');
	await expect(page.locator('.day-grid a')).toHaveCount(8);
	await expect(page.locator('.day.highlight')).toHaveCount(1); // only Day 05
});
