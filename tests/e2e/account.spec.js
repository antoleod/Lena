import { test, expect } from '@playwright/test';
import { seedProfile } from './helpers.js';

test.beforeEach(async ({ page }) => {
  await seedProfile(page);
});

test('subjects hub exposes direct grade access and topic previews', async ({ page }) => {
  await page.goto('/subjects');
  await expect(page.getByTestId('subjects-page')).toBeVisible();
  await expect(page.getByTestId('subject-tile-mathematics')).toContainText('Tables');
  await page.getByTestId('subject-grade-direct-mathematics-P3').click();
  await expect(page.getByTestId('grade-page-mathematics-P3')).toBeVisible();
});

test('history and settings buttons open real actions', async ({ page }) => {
  await page.goto('/history');
  await expect(page.getByTestId('history-page')).toBeVisible();
  await page.getByTestId('history-open-generated-addition-p2').click();
  await expect(page).toHaveURL(/\/activities\/generated-addition-p2$/);

  await page.goto('/settings');
  await expect(page.getByTestId('settings-page')).toBeVisible();
  await page.getByLabel(/Nom|Name/i).fill('Lena Plus');
  await page.getByTestId('settings-save').click();
  await expect(page.getByRole('heading', { level: 2 })).toContainText('Lena Plus');
});
