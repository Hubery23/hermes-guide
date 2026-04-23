import { test, expect } from '@playwright/test';

test('switch zh → en from /', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('group', { name: 'Language switcher' }).getByText('EN').click();
	await expect(page).toHaveURL(/\/en\/?$/);
});

test('switch zh → en from /migrate/', async ({ page }) => {
	await page.goto('/migrate/');
	await page.getByRole('group', { name: 'Language switcher' }).getByText('EN').click();
	await expect(page).toHaveURL(/\/en\/migrate\/?$/);
});

test('switch zh → en from /7-days/', async ({ page }) => {
	await page.goto('/7-days/');
	await page.getByRole('group', { name: 'Language switcher' }).getByText('EN').click();
	await expect(page).toHaveURL(/\/en\/7-days\/?$/);
});

test('switch en → zh from /en/migrate/', async ({ page }) => {
	await page.goto('/en/migrate/');
	await page.getByRole('group', { name: 'Language switcher' }).getByText('中').click();
	await expect(page).toHaveURL(/\/migrate\/?$/);
});
