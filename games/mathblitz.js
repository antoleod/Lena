(function () {
  'use strict';

  const DEFAULT_OPTION_ICONS = ['🌟', '💎', '🪄', '🎈', '🔮', '🌈'];
  const DEFAULT_QUESTION_COUNT = 6;
  let cachedLevels = null;

  function themeFor(operationKey) {
    const globalThemes = window.LENA_MATH_THEMES || {};
    const fallback = {
      id: operationKey || 'magie',
      label: 'Défi magique',
      icon: '✨',
      accent: '#8c5bff',
      accentSoft: '#e5dcff',
      stickers: ['✨', '💫', '🪄'],
      encouragement: '✨ Respire, tu vas y arriver !',
      success: '🌟 Magie réussie !',
      optionIcons: DEFAULT_OPTION_ICONS,
      storylines: ['Relève le défi mathématique pour gagner des étoiles !']
    };

    if (globalThemes[operationKey]) {
      return Object.assign({}, fallback, globalThemes[operationKey]);
    }
    return fallback;
  }

  function computeRewardForLevel(operationKey, levelRef) {
    const base = {
      additions: { stars: 10, coins: 5 },
      soustractions: { stars: 10, coins: 5 },
      multiplications: { stars: 12, coins: 6 },
      divisions: { stars: 13, coins: 7 }
    }[operationKey] || { stars: 10, coins: 5 };

    return {
      stars: base.stars + levelRef * 2,
      coins: base.coins + Math.max(2, Math.floor(levelRef * 1.3))
    };
  }

  function createLevelBlueprints() {
    const additions = Array.from({ length: 6 }, (_, index) => ({
      operationKey: 'additions',
      levelRef: index + 1,
      description: `Sommes jusqu'à ${(index + 1) * 10}`
    }));

    const soustractions = Array.from({ length: 6 }, (_, index) => ({
      operationKey: 'soustractions',
      levelRef: index + 1,
      description: `Restes jusqu'à ${(index + 1) * 10}`
    }));

    const multiplications = Array.from({ length: 12 }, (_, index) => ({
      operationKey: 'multiplications',
      levelRef: index + 1,
      description: `Table de ${index + 1}`
    }));

    const divisions = Array.from({ length: 10 }, (_, index) => ({
      operationKey: 'divisions',
      levelRef: index + 1,
      description: `Divisions par ${index + 1}`
    }));

    const segments = [
      { entries: additions, questionCount: 6 },
      { entries: soustractions, questionCount: 6 },
      { entries: multiplications, questionCount: 7 },
      { entries: divisions, questionCount: 7 }
    ];

    const levels = [];
    let counter = 1;

    segments.forEach(segment => {
      segment.entries.forEach((entry, index) => {
        const theme = themeFor(entry.operationKey);
        const storyline = theme.storylines
          ? theme.storylines[index % theme.storylines.length]
          : '';
        const sticker = theme.stickers
          ? theme.stickers[index % theme.stickers.length]
          : null;
        levels.push({
          level: counter,
          operationKey: entry.operationKey,
          levelRef: entry.levelRef,
          questionCount: segment.questionCount || DEFAULT_QUESTION_COUNT,
          subtitle: entry.description,
          storyline,
          sticker,
          reward: computeRewardForLevel(entry.operationKey, entry.levelRef),
          theme
        });
        counter += 1;
      });
    });

    return levels;
  }

  function getLevels() {
    if (!cachedLevels) {
      cachedLevels = createLevelBlueprints();
    }
    return cachedLevels;
  }

  function start(context) {
    const levels = getLevels();
    const levelIndex = Math.max(0, Math.min(levels.length, context.currentLevel) - 1);
    const levelData = levels[levelIndex] || levels[0];
    const questions = buildQuestions(levelData);
    const state = {
      levels,
      levelData,
      questions,
      index: 0,
      feedbackTimer: null
    };

    context.clearGameClasses?.(['math-blitz']);
    renderScene(context, state);
  }

  function buildQuestions(levelData) {
    const questions = [];
    for (let i = 0; i < levelData.questionCount; i++) {
      questions.push(createQuestion(levelData));
    }
    return questions;
  }

  function createQuestion(levelData) {
    let payload = null;
    if (typeof window.generateMathQuestion === 'function') {
      try {
        payload = window.generateMathQuestion(levelData.operationKey, levelData.levelRef);
      } catch (error) {
        console.warn('generateMathQuestion failed in Math Blitz, falling back', error);
      }
    }

    if (!payload || !Array.isArray(payload.options) || typeof payload.correct !== 'number') {
      payload = legacyQuestion(levelData);
    }

    const choices = payload.options.slice();
    const answerIndex = Math.max(0, Math.min(choices.length - 1, payload.correct));

    return {
      prompt: payload.questionText || 'Résous cette opération magique ✨',
      detail: payload.operationMeta?.storyline || payload.detail || levelData.storyline,
      choices,
      answerIndex,
      hint: payload.encouragement || levelData.theme.encouragement,
      successMessage: payload.successMessage || levelData.theme.success,
      explanation: payload.explanation || '',
      optionIcons: payload.optionIcons || levelData.theme.optionIcons || DEFAULT_OPTION_ICONS,
      sticker: payload.operationMeta?.sticker || levelData.sticker,
      theme: levelData.theme
    };
  }

  function legacyQuestion(levelData) {
    const { operationKey, levelRef, storyline, theme } = levelData;
    let a;
    let b;
    let prompt;
    let answer;

    if (operationKey === 'soustractions') {
      const maxStart = (levelRef + 1) * 10;
      a = randomInt(Math.floor(maxStart * 0.4), maxStart);
      b = randomInt(0, a);
      answer = a - b;
      prompt = `${a} − ${b} = ?`;
    } else if (operationKey === 'multiplications') {
      const table = Math.max(1, levelRef);
      const factor = randomInt(1, 12);
      a = table;
      b = factor;
      answer = a * b;
      prompt = `${a} × ${b} = ?`;
    } else if (operationKey === 'divisions') {
      const divisor = Math.max(1, levelRef);
      const quotient = randomInt(1, Math.max(4, 12 - Math.max(0, divisor - 6)));
      a = divisor * quotient;
      b = divisor;
      answer = quotient;
      prompt = `${a} ÷ ${b} = ?`;
    } else {
      const maxSum = (levelRef + 1) * 10;
      a = randomInt(0, Math.floor(maxSum * 0.6));
      b = randomInt(0, maxSum - a);
      answer = a + b;
      prompt = `${a} + ${b} = ?`;
    }

    const options = new Set([answer]);
    while (options.size < 3) {
      const candidate = answer + randomInt(-5, 5);
      if (candidate >= 0) {
        options.add(candidate);
      }
    }
    const ordered = shuffle(Array.from(options));

    return {
      questionText: prompt,
      options: ordered,
      correct: ordered.indexOf(answer),
      encouragement: theme.encouragement,
      successMessage: theme.success,
      explanation: `${prompt.replace(' = ?', '')} = ${answer}`,
      optionIcons: theme.optionIcons,
      operationMeta: { storyline, sticker: levelData.sticker }
    };
  }

  function renderScene(context, state) {
    const { levelData, questions } = state;
    const theme = levelData.theme;
    const content = context.content;
    content.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = `math-blitz fx-bounce-in-down math-blitz--${theme.id}`;
    if (theme.accent) {
      wrapper.style.setProperty('--math-blitz-accent', theme.accent);
    }
    if (theme.accentSoft) {
      wrapper.style.setProperty('--math-blitz-accent-soft', theme.accentSoft);
    }

    const header = document.createElement('div');
    header.className = 'math-blitz__header';

    const title = document.createElement('h2');
    title.className = 'math-blitz__title';
    title.textContent = `${theme.icon || '✨'} Niveau ${levelData.level} — ${theme.label}`;
    header.appendChild(title);

    const subtitle = document.createElement('p');
    subtitle.className = 'math-blitz__subtitle';
    subtitle.textContent = levelData.subtitle || 'Résous chaque opération pour récolter des étoiles.';
    header.appendChild(subtitle);

    if (levelData.storyline) {
      const storyline = document.createElement('p');
      storyline.className = 'math-blitz__storyline';
      storyline.textContent = levelData.storyline;
      header.appendChild(storyline);
    }

    if (levelData.sticker) {
      const badge = document.createElement('div');
      badge.className = 'math-blitz__sticker';
      badge.textContent = levelData.sticker;
      badge.setAttribute('aria-hidden', 'true');
      header.appendChild(badge);
    }

    const progressBar = document.createElement('div');
    progressBar.className = 'math-blitz__progress';
    const progressFill = document.createElement('div');
    progressFill.className = 'math-blitz__progress-fill';
    progressBar.appendChild(progressFill);
    header.appendChild(progressBar);

    wrapper.appendChild(header);

    const questionWrapper = document.createElement('div');
    questionWrapper.className = `math-blitz__question-wrapper math-blitz__question-wrapper--${theme.id}`;
    wrapper.appendChild(questionWrapper);

    const feedback = document.createElement('div');
    feedback.className = 'math-blitz__feedback is-hidden';
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    wrapper.appendChild(feedback);

    const controls = document.createElement('div');
    controls.className = 'math-blitz__controls';

    const nextButton = document.createElement('button');
    nextButton.className = 'math-blitz__next-btn';
    nextButton.type = 'button';
    nextButton.textContent = 'Question suivante';
    nextButton.disabled = true;
    controls.appendChild(nextButton);
    wrapper.appendChild(controls);

    content.appendChild(wrapper);

    context.setAnsweredStatus('in-progress');
    context.configureBackButton('Retour aux niveaux', () => {
      context.setAnsweredStatus('in-progress');
      context.showLevelMenu('math-blitz');
    });

    nextButton.addEventListener('click', () => {
      state.index += 1;
      if (state.index < questions.length) {
        renderQuestion(context, state, questionWrapper, feedback, progressFill, nextButton);
      } else {
        finishLevel(context, state, progressFill, feedback, nextButton);
      }
    });

    renderQuestion(context, state, questionWrapper, feedback, progressFill, nextButton);
  }

  function renderQuestion(context, state, questionWrapper, feedback, progressFill, nextButton) {
    clearTimeout(state.feedbackTimer);
    feedback.classList.add('is-hidden');
    feedback.textContent = '';
    nextButton.disabled = true;

    const question = state.questions[state.index];
    const total = state.questions.length;
    const current = state.index + 1;

    questionWrapper.innerHTML = '';
    questionWrapper.dataset.operation = question.theme?.id || '';

    const prompt = document.createElement('div');
    prompt.className = 'math-blitz__prompt';

    if (question.theme?.icon) {
      const icon = document.createElement('span');
      icon.className = 'math-blitz__prompt-icon';
      icon.textContent = question.theme.icon;
      prompt.appendChild(icon);
    }

    const promptText = document.createElement('span');
    promptText.className = 'math-blitz__prompt-text';
    promptText.textContent = question.prompt;
    prompt.appendChild(promptText);

    questionWrapper.appendChild(prompt);

    if (question.detail) {
      const detail = document.createElement('p');
      detail.className = 'math-blitz__detail';
      detail.textContent = question.detail;
      questionWrapper.appendChild(detail);
    }

    context.speakText(question.prompt);

    const optionsGrid = document.createElement('div');
    optionsGrid.className = 'math-blitz__options';
    if (question.theme?.id) {
      optionsGrid.classList.add(`math-blitz__options--${question.theme.id}`);
    }

    const iconSet = Array.isArray(question.optionIcons) && question.optionIcons.length
      ? question.optionIcons
      : DEFAULT_OPTION_ICONS;

    question.choices.forEach((choice, idx) => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'math-blitz__option fx-bounce-in-down';
      if (question.theme?.id) {
        option.classList.add(`math-blitz__option--${question.theme.id}`);
      }
      option.style.animationDelay = `${0.12 * idx}s`;

      const icon = document.createElement('span');
      icon.className = 'math-blitz__option-icon';
      icon.textContent = iconSet[idx % iconSet.length];

      const label = document.createElement('span');
      label.className = 'math-blitz__option-label';
      label.textContent = String(choice);

      option.appendChild(icon);
      option.appendChild(label);
      option.addEventListener('click', () => handleAnswer(context, state, question, idx, option, optionsGrid, feedback, nextButton));
      optionsGrid.appendChild(option);
    });

    questionWrapper.appendChild(optionsGrid);

    const percent = Math.round(((current - 1) / total) * 100);
    progressFill.style.width = `${percent}%`;
  }

  function handleAnswer(context, state, question, selectedIndex, button, optionsGrid, feedback, nextButton) {
    if (button.disabled) {
      return;
    }

    const isCorrect = selectedIndex === question.answerIndex;

    if (isCorrect) {
      context.playPositiveSound();
      context.awardReward(state.levelData.reward.stars, state.levelData.reward.coins);
      context.updateUI?.();
      button.classList.add('is-correct');
      Array.from(optionsGrid.children).forEach(child => { child.disabled = true; });
      showFeedback(feedback, 'positive', question.successMessage || 'Bravo !');
      nextButton.disabled = false;
      nextButton.focus();
    } else {
      context.playNegativeSound();
      context.awardReward(0, -3);
      context.updateUI?.();
      button.classList.add('is-wrong');
      button.disabled = true;
      showFeedback(feedback, 'negative', question.hint || 'Essaie une autre réponse.');
      setTimeout(() => button.classList.remove('is-wrong'), 600);
    }
  }

  function finishLevel(context, state, progressFill, feedback, nextButton) {
    const theme = state.levelData.theme;
    progressFill.style.width = '100%';
    feedback.classList.remove('is-hidden', 'is-negative');
    feedback.classList.add('is-positive');
    const sticker = state.levelData.sticker ? ` ${state.levelData.sticker}` : '';
    feedback.textContent = `${theme.success || '✨ Niveau terminé !'}${sticker}`;
    nextButton.disabled = true;

    context.markLevelCompleted();
    context.showSuccessMessage(`${theme.icon || '✨'} ${theme.success || 'Niveau complété !'}`);
    context.showConfetti();
    context.setAnsweredStatus('completed');

    state.feedbackTimer = setTimeout(() => {
      context.showLevelMenu('math-blitz');
    }, 1600);
  }

  function showFeedback(feedback, variant, message) {
    feedback.classList.remove('is-hidden', 'is-positive', 'is-negative');
    feedback.classList.add(variant === 'positive' ? 'is-positive' : 'is-negative');
    feedback.textContent = message;
  }

  function randomInt(min, max) {
    const lower = Math.ceil(Math.min(min, max));
    const upper = Math.floor(Math.max(min, max));
    if (upper <= lower) {
      return lower;
    }
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
  }

  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  window.mathBlitzGame = {
    start,
    getLevelCount() {
      return getLevels().length;
    },
    refreshLevels() {
      cachedLevels = null;
    }
  };
})();
