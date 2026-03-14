import { test, expect } from '@playwright/test';
import { seedProfile } from './helpers.js';

test.beforeEach(async ({ page }) => {
  await seedProfile(page);
});

test('mathematics subject shows real P2 and P3 module previews and grade modules', async ({ page }) => {
  await page.goto('/subjects');
  await page.getByTestId('subject-launch-mathematics').click();

  await expect(page.getByTestId('subject-page-mathematics')).toBeVisible();
  await expect(page.getByTestId('subject-grade-P2')).toContainText('Groupes egaux et partages simples');
  await expect(page.getByTestId('subject-grade-P3')).toContainText('Tables et paquets egaux');
  await expect(page.getByTestId('subject-grade-P3')).toContainText('Partager, verifier et relier aux tables');

  await page.getByTestId('subject-grade-launch-P3').click();
  await expect(page.getByTestId('grade-page-mathematics-P3')).toBeVisible();
  await expect(page.getByTestId('module-card-math-g3-multiplication')).toBeVisible();
  await expect(page.getByTestId('module-card-math-g3-division')).toBeVisible();
  await expect(page.getByTestId('module-card-math-g3-time-geometry')).toBeVisible();

  await page.getByTestId('module-launch-math-g3-multiplication').click();
  await expect(page).toHaveURL(/\/subjects\/mathematics\/grades\/P3\/modules\/math-g3-multiplication$/);
  await expect(page.getByText(/Table de multiplication du 12/i)).toBeVisible();
  await page.getByTestId('module-primary-cta').click();
  await expect(page).toHaveURL(/\/activities\//);
  await expect(page.getByTestId('activity-page')).toBeVisible();
});

test('french subject shows conjugation, sentence and story modules in navigation', async ({ page }) => {
  await page.goto('/subjects');
  await page.getByTestId('subject-launch-french').click();

  await expect(page.getByTestId('subject-page-french')).toBeVisible();
  await expect(page.getByTestId('subject-grade-P2')).toContainText('Petites histoires a lire');
  await expect(page.getByTestId('subject-grade-P3')).toContainText('Les 20 verbes les plus utiles');
  await expect(page.getByTestId('subject-grade-P3')).toContainText('Contes courts et questions');

  await page.getByTestId('subject-grade-launch-P3').click();
  await expect(page.getByTestId('grade-page-french-P3')).toBeVisible();
  await expect(page.getByTestId('module-card-french-g3-conjugation')).toBeVisible();
  await expect(page.getByTestId('module-card-french-g3-stories')).toBeVisible();
});

test('english, spanish and stories expose the richer modules in visible navigation', async ({ page }) => {
  await page.goto('/subjects');

  await page.getByTestId('subject-launch-english').click();
  await expect(page.getByTestId('subject-page-english')).toBeVisible();
  await expect(page.getByTestId('subject-grade-P2')).toContainText('Daily life and school routine');
  await expect(page.getByTestId('subject-grade-P3')).toContainText('Story time and questions');
  await page.getByTestId('subject-grade-launch-P3').click();
  await expect(page.getByTestId('grade-page-english-P3')).toBeVisible();
  await expect(page.getByTestId('module-card-english-g3-stories')).toBeVisible();

  await page.goto('/subjects');
  await page.getByTestId('subject-launch-spanish').click();
  await expect(page.getByTestId('subject-page-spanish')).toBeVisible();
  await expect(page.getByTestId('subject-grade-P2')).toContainText('Rutinas y palabras utiles');
  await expect(page.getByTestId('subject-grade-P3')).toContainText('Historias cortas y comprension');

  await page.goto('/subjects');
  await page.getByTestId('subject-launch-stories').click();
  await expect(page.getByTestId('subject-page-stories')).toBeVisible();
  await expect(page.getByTestId('subject-grade-P2')).toContainText('Amis, ecole et promenade');
  await expect(page.getByTestId('subject-grade-P3')).toContainText('Feu de camp et chateau');
});
