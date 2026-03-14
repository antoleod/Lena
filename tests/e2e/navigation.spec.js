import { test, expect } from '@playwright/test';
import { seedProfile } from './helpers.js';

test.beforeEach(async ({ page }) => {
  await seedProfile(page);
});

test('home quick links and shell navigation open real screens', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('home-page')).toBeVisible();

  await page.getByTestId('home-link-map').click();
  await expect(page).toHaveURL(/\/map$/);
  await expect(page.getByTestId('map-page')).toBeVisible();

  await page.getByTestId('nav-subjects').click();
  await expect(page).toHaveURL(/\/subjects$/);

  await page.getByTestId('nav-history').click();
  await expect(page).toHaveURL(/\/history$/);

  await page.getByTestId('nav-settings').click();
  await expect(page).toHaveURL(/\/settings$/);

  await page.getByTestId('shell-shop').click();
  await expect(page).toHaveURL(/\/shop$/);
  await expect(page.getByTestId('shop-page')).toBeVisible();
});

test('map worlds and shop sections render actionable content', async ({ page }) => {
  await page.goto('/map');
  await expect(page.getByTestId('map-page')).toBeVisible();
  await expect(page.getByTestId('world-world-1')).toBeVisible();
  await page.getByTestId('world-world-1').click();
  await expect(page).toHaveURL(/\/map\/world-1$/);

  await page.goto('/shop');
  await expect(page.getByTestId('shop-page')).toBeVisible();
  await expect(page.getByTestId('shop-section-theme')).toBeVisible();
  await expect(page.getByTestId('shop-section-avatar')).toBeVisible();
  const firstAction = page.locator('[data-testid^="shop-action-"]').first();
  await expect(firstAction).toBeVisible();
  await expect(firstAction.locator('.button-icon')).not.toHaveText('');
});

test('module buttons and shop actions stay functional', async ({ page }) => {
  await page.goto('/subjects/mathematics/grades/P3/modules/math-g3-multiplication');
  await expect(page.getByTestId('module-primary-cta')).toBeVisible();
  await page.getByTestId('module-primary-cta').click();
  await expect(page).toHaveURL(/\/activities\//);
  await expect(page.getByTestId('activity-page')).toBeVisible();

  await page.goto('/shop');
  await expect(page.getByTestId('shop-section-badge')).toBeVisible();
  await expect(page.getByTestId('shop-section-frame')).toBeVisible();
  const buyButton = page.getByTestId('shop-action-badge-kind-heart');
  await expect(buyButton).toBeVisible();
  await buyButton.click();
  await expect(page.getByTestId('shop-action-badge-kind-heart')).toContainText(/Deja|Al in|Already|Ya|Equip|Appli|Acti|🎁/i);
});
