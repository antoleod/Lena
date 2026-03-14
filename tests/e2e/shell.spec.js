import { test, expect } from '@playwright/test';
import { seedProfile } from './helpers.js';

test.beforeEach(async ({ page }) => {
  await seedProfile(page);
});

test('shell buttons open real destinations and logout returns to onboarding', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('shell-wallet').click();
  await expect(page).toHaveURL(/\/shop$/);

  await page.getByTestId('shell-profile').click();
  await expect(page).toHaveURL(/\/settings$/);

  await page.getByTestId('shell-brand').click();
  await expect(page).toHaveURL(/\/settings$/);

  await page.getByTestId('shell-logout').click();
  await expect(page).toHaveURL(/\/onboarding$/);
  await expect(page.getByTestId('onboarding-page')).toBeVisible();
});
