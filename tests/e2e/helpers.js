export async function clearAppState(page) {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
}

export async function seedProfile(page, { name = 'Lina', age = 8, language = 'fr' } = {}) {
  await page.addInitScript(({ seededName, seededAge, seededLanguage }) => {
    window.localStorage.clear();
    window.sessionStorage.clear();

    window.localStorage.setItem('lena:profile:v1', JSON.stringify({
      id: 'default',
      name: seededName,
      age: seededAge,
      identity: 'child',
      avatarId: 'avatar-unicorn',
      themeId: 'theme-candy',
      visualTheme: 'fantasy',
      language: seededLanguage,
      sessionActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      worldsUnlocked: ['world-1'],
      missionsUnlocked: [],
      lastVisitedRoute: '/',
      totalStudyMinutes: 12,
      totalActivitiesCompleted: 1,
      totalExamsCompleted: 1,
      streakCurrent: 2,
      streakBest: 2
    }));

    window.localStorage.setItem('lena:rewards:v1', JSON.stringify({
      balance: 120,
      inventory: [],
      purchases: [],
      rewardsByActivity: {},
      missionRewards: {},
      equippedThemeId: 'theme-candy',
      equippedEffectId: 'effect-rainbow',
      equippedWallpaperId: 'wallpaper-dreamy-sky'
    }));

    window.localStorage.setItem('lena:migration:progress:v3', JSON.stringify({
      activities: {
        'generated-addition-p2': {
          attempts: 1,
          completed: true,
          bestScore: 8,
          lastScore: 8,
          updatedAt: Date.now()
        }
      },
      levels: {},
      questions: {},
      meta: {
        lastActivityId: 'generated-addition-p2',
        lastLevelId: null,
        lastPlayedAt: Date.now(),
        streakCurrent: 2,
        streakBest: 2,
        totalCorrect: 8,
        totalWrong: 2
      }
    }));
  }, { seededName: name, seededAge: age, seededLanguage: language });
}

export async function completeOnboarding(page) {
  await page.goto('/onboarding');
  await page.getByTestId('onboarding-language-fr').click();
  await page.getByTestId('onboarding-step-profile').waitFor();
  await page.getByTestId('onboarding-name').fill('Lina');
  await page.getByTestId('onboarding-age-8').click();
  await page.getByTestId('onboarding-step-theme').waitFor();
  await page.getByTestId('onboarding-theme-fantasy').click();
  await page.getByTestId('onboarding-step-summary').waitFor();
  await page.getByTestId('onboarding-finish').click();
  await page.getByTestId('onboarding-step-mission').waitFor();
  await page.getByTestId('onboarding-start').click();
}

export async function finishCurrentActivity(page, maxSteps = 16) {
  for (let index = 0; index < maxSteps; index += 1) {
    const completeState = page.getByTestId('activity-complete');
    if (await completeState.isVisible().catch(() => false)) {
      return;
    }

    const baseTenPrompt = page.locator('.engine-prompt');
    if (await baseTenPrompt.isVisible().catch(() => false)) {
      const promptText = (await baseTenPrompt.textContent()) || '';
      const targetMatch = promptText.match(/(\d+)/);
      const target = targetMatch ? Number(targetMatch[1]) : 0;
      const tens = Math.floor(target / 10);
      const ones = target % 10;

      for (let tensIndex = 0; tensIndex < tens; tensIndex += 1) {
        await page.getByRole('button', { name: '+10', exact: true }).click({ force: true });
      }

      for (let onesIndex = 0; onesIndex < ones; onesIndex += 1) {
        await page.getByRole('button', { name: '+1', exact: true }).click({ force: true });
      }

      await page.getByRole('button', { name: /Verifier|Verify/ }).click({ force: true });
      await page.waitForTimeout(850);
      continue;
    }

    const choice = page.locator('button[data-testid^="choice-"]:not(:disabled)').first();
    await choice.waitFor();
    await choice.click();

    if (await completeState.isVisible().catch(() => false)) {
      return;
    }

    await page.waitForTimeout(900);
  }
}
