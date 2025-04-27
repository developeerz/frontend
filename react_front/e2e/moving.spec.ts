import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await expect(page.locator('#root')).toContainText('Register');
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Register' }).click();
  await page.waitForTimeout(2000);

  await page.goto('http://localhost:3000/');

  await expect(page.locator('#root')).toContainText('Login');
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForTimeout(2000);

  await page.goto('http://localhost:3000/');

  await expect(page.locator('#root')).toContainText('Scheme');
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Scheme' }).click();
  await page.waitForTimeout(2000);

  await page.goto('http://localhost:3000/');
});