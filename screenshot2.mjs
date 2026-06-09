import { chromium } from './node_modules/playwright/index.mjs';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://localhost:5173/exam/library/play?exam=calendrier-temps-08&level=facile');
await page.waitForTimeout(2500);
await page.screenshot({ path: 'screen-config.png', fullPage: false });
console.log('Config done');

// Click "Commencer"
await page.click('button:has-text("Commencer")');
await page.waitForTimeout(2000);
await page.screenshot({ path: 'screen-quiz.png', fullPage: false });
console.log('Quiz done');

await browser.close();
