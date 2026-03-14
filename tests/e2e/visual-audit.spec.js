import { test, expect } from '@playwright/test';
import { seedProfile, finishCurrentActivity } from './helpers.js';

const viewports = [
  { name: 'desktop', width: 1440, height: 1024 },
  { name: 'ipad-11', width: 1194, height: 834 },
  { name: 'ipad-13', width: 1366, height: 1024 }
];

const routes = [
  { name: 'home', path: '/' },
  { name: 'map', path: '/map' },
  { name: 'subjects', path: '/subjects' },
  { name: 'shop', path: '/shop' },
  { name: 'history', path: '/history' },
  { name: 'settings', path: '/settings' }
];

for (const viewport of viewports) {
  test.describe(`visual audit ${viewport.name}`, () => {
    test.use({ viewport });

    test.beforeEach(async ({ page }) => {
      await seedProfile(page);
    });

    test(`capture main routes for ${viewport.name}`, async ({ page }, testInfo) => {
      const consoleErrors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      page.on('pageerror', (error) => {
        consoleErrors.push(error.message);
      });

      for (const route of routes) {
        await page.goto(route.path);
        await page.waitForLoadState('networkidle');
        await expect(page.locator('body')).toBeVisible();
        await page.screenshot({
          path: testInfo.outputPath(`${viewport.name}-${route.name}.png`),
          fullPage: true
        });
      }

      await page.goto('/subjects/mathematics/grades/P3/modules/math-g3-multiplication');
      await page.waitForLoadState('networkidle');
      await page.screenshot({
        path: testInfo.outputPath(`${viewport.name}-module.png`),
        fullPage: true
      });

      await page.getByTestId('module-primary-cta').click();
      await expect(page).toHaveURL(/\/activities\//);
      await page.waitForLoadState('networkidle');
      await page.screenshot({
        path: testInfo.outputPath(`${viewport.name}-activity-start.png`),
        fullPage: true
      });

      await finishCurrentActivity(page, 4);
      await page.waitForTimeout(500);
      await page.screenshot({
        path: testInfo.outputPath(`${viewport.name}-activity-progress.png`),
        fullPage: true
      });

      expect(consoleErrors, `console errors for ${viewport.name}`).toEqual([]);
    });

    test(`theme switch applies root attributes on ${viewport.name}`, async ({ page }) => {
      await page.goto('/shop');
      await page.waitForLoadState('networkidle');

      const before = await page.locator(':root').evaluate((root) => ({
        theme: root.getAttribute('data-theme'),
        effect: root.getAttribute('data-effect'),
        wallpaper: root.getAttribute('data-wallpaper')
      }));

      const themeAction = page.getByTestId('shop-action-theme-ocean');
      await themeAction.click();
      await page.waitForTimeout(250);
      await themeAction.click();
      await page.waitForTimeout(250);

      const after = await page.locator(':root').evaluate((root) => ({
        theme: root.getAttribute('data-theme'),
        effect: root.getAttribute('data-effect'),
        wallpaper: root.getAttribute('data-wallpaper')
      }));

      expect(after.theme || after.effect || after.wallpaper).toBeTruthy();
      expect(after).not.toEqual(before);
    });
  });
}
