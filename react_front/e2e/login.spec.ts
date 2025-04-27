import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForTimeout(2000);

    await page.getByTestId('text-input-outlined').first().click();
    await page.getByTestId('text-input-outlined').first().fill('@sometelegram');
    await page.waitForTimeout(2000);

    await page.locator('input[type="password"]').click();
    await page.locator('input[type="password"]').fill('qwerty123');
    await page.waitForTimeout(2000);

    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForTimeout(2000);
});