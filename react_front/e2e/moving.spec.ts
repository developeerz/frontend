import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await expect(page.locator('#root')).toContainText('Registration');
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Registration' }).click();
  await page.waitForTimeout(2000);

  await page.goto('http://localhost:3000/');

  await expect(page.locator('#root')).toContainText('Login');
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForTimeout(2000);

  await page.goto('http://localhost:3000/');

  await expect(page.locator('#root')).toContainText('Book');
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Book' }).click();
  await page.waitForTimeout(2000);

  await page.goto('http://localhost:3000/');
});