import { test, expect } from '@playwright/test';
import { clearAppState, completeOnboarding, finishCurrentActivity } from './helpers.js';

test.beforeEach(async ({ page }) => {
  await clearAppState(page);
});

test('onboarding auto-advances and launches the first mission', async ({ page }) => {
  await completeOnboarding(page);

  await expect(page).toHaveURL(/\/activities\//);
  await expect(page.getByTestId('activity-page')).toBeVisible();
});

test('first lesson can be completed and returns a real completion state', async ({ page }) => {
  await completeOnboarding(page);
  await finishCurrentActivity(page);

  await expect(page.getByTestId('activity-complete')).toBeVisible();
  await expect(page.getByTestId('activity-back')).toBeVisible();
});
