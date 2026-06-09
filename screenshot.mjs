import { chromium } from './node_modules/playwright/index.mjs';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://localhost:5173/exam/library/play?exam=calendrier-temps-08&level=facile');
await page.waitForTimeout(2500);
await page.screenshot({ path: 'screen-config.png', fullPage: false });
console.log('Config screenshot taken');

const buttons = await page.$$('button');
console.log('Buttons found:', buttons.length);
for (const btn of buttons) {
  const txt = await btn.textContent();
  console.log(' -', txt?.trim());
}

if (buttons.length > 0) {
  await buttons[0].click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screen-quiz.png', fullPage: false });
  console.log('Quiz screenshot taken');
}

await browser.close();
