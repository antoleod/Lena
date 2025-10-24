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
    const levelDefinitions = [
      { level: 1, title: 'Premiers Pas', subtitle: 'Additions et soustractions simples', operations: { additions: { levelRef: 1 }, soustractions: { levelRef: 1 } }, icon: '✨' },
      { level: 2, title: 'Jardin des Nombres', subtitle: 'Additions et soustractions jusqu\'à 20', operations: { additions: { levelRef: 2 }, soustractions: { levelRef: 2 } }, icon: '🍎' },
      { level: 3, title: 'Tour des Briques', subtitle: 'Additions et soustractions jusqu\'à 30', operations: { additions: { levelRef: 3 }, soustractions: { levelRef: 3 } }, icon: '🧱' },
      { level: 4, title: 'Étoiles Multipliées', subtitle: 'Mélange avec multiplications (tables de 1, 2)', operations: { additions: { levelRef: 4 }, soustractions: { levelRef: 4 }, multiplications: { levelRef: 2 } }, icon: '🌟' },
      { level: 5, title: 'Aventure Fruitée', subtitle: 'Mélange avec multiplications (tables de 3, 4)', operations: { additions: { levelRef: 5 }, soustractions: { levelRef: 5 }, multiplications: { levelRef: 4 } }, icon: '🍓' },
      { level: 6, title: 'Trésors Partagés', subtitle: 'Mélange avec divisions simples', operations: { additions: { levelRef: 6 }, multiplications: { levelRef: 5 }, divisions: { levelRef: 2 } }, icon: '🪙' },
      { level: 7, title: 'Défi Cosmique', subtitle: 'Les quatre opérations magiques', operations: { additions: { levelRef: 7 }, soustractions: { levelRef: 6 }, multiplications: { levelRef: 6 }, divisions: { levelRef: 3 } }, icon: '🪐' },
      { level: 8, title: 'Énigmes du Pirate', subtitle: 'Calculs pour ouvrir les coffres', operations: { additions: { levelRef: 8 }, soustractions: { levelRef: 7 }, multiplications: { levelRef: 7 }, divisions: { levelRef: 4 } }, icon: '🏴‍☠️' },
      { level: 9, title: 'Forêt Enchantée', subtitle: 'Opérations complexes pour les esprits vifs', operations: { additions: { levelRef: 9 }, soustractions: { levelRef: 8 }, multiplications: { levelRef: 8 }, divisions: { levelRef: 5 } }, icon: '🌳' },
      { level: 10, title: 'Volcan de Nombres', subtitle: 'Calculs avancés pour les experts', operations: { additions: { levelRef: 10 }, soustractions: { levelRef: 9 }, multiplications: { levelRef: 9 }, divisions: { levelRef: 6 } }, icon: '🌋' },
      { level: 11, title: 'Galaxie des Calculs', subtitle: 'Maîtrise des multiplications et divisions', operations: { additions: { levelRef: 11 }, soustractions: { levelRef: 10 }, multiplications: { levelRef: 10 }, divisions: { levelRef: 8 } }, icon: '🌌' },
      { level: 12, title: 'Le Grand Tournoi', subtitle: 'Le défi ultime des quatre opérations', operations: { additions: { levelRef: 12 }, soustractions: { levelRef: 12 }, multiplications: { levelRef: 12 }, divisions: { levelRef: 10 } }, icon: '🏆' }
    ];

    const levels = [];

    levelDefinitions.forEach(def => {
      const availableOps = Object.keys(def.operations);
      const primaryOp = availableOps[0] || 'additions';
      const theme = themeFor(primaryOp);

      levels.push({
        level: def.level,
        operations: def.operations,
        questionCount: 5,
        title: def.title,
        subtitle: def.subtitle,
        storyline: def.subtitle,
        sticker: def.icon,
        reward: computeRewardForLevel(primaryOp, def.level),
        theme: { ...theme, label: def.title, icon: def.icon }
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

    const getPositiveMessage = (() => {
      let messages = shuffle(window.positiveMessages || ['Bravo !', 'Super !', 'Génial !']);
      return () => {
        if (messages.length === 0) {
          messages = shuffle(window.positiveMessages || ['Bravo !', 'Super !', 'Génial !']);
        }
        return messages.pop() || 'Bravo !';
      };
    })();

    const state = {
      levels,
      levelData,
      questions,
      getPositiveMessage,
      index: 0,
      feedbackTimer: null,
      comboFailures: new Map(),
      timeRecords: [],
      questionStart: null,
      correctCount: 0,
      incorrectCount: 0,
      streak: 0,
      bestStreak: 0
    };

    context.clearGameClasses?.(['math-blitz']);
    renderScene(context, state);
  }

  function buildQuestions(levelData) {
    const { operations, questionCount } = levelData;
    const availableOps = Object.keys(operations);
    const questions = [];
    for (let i = 0; i < questionCount; i++) {
      const useRandomMix = Math.random() < 0.2 && availableOps.length > 1;
      const operationKey = useRandomMix
        ? availableOps[randomInt(0, availableOps.length - 1)]
        : availableOps[i % availableOps.length];
      const levelRef = operations[operationKey].levelRef;
      questions.push(createQuestion(operationKey, levelRef, levelData));
    }
    return questions;
  }

  function createQuestion(operationKey, levelRef, levelData) {
    let payload = null;
    if (typeof window.generateMathQuestion === 'function') {
      try {
        payload = window.generateMathQuestion(operationKey, levelRef);
      } catch (error) {
        console.warn('generateMathQuestion failed in Math Blitz, falling back', error);
      }
    }

    if (!payload || !Array.isArray(payload.options) || typeof payload.correct !== 'number') {
      payload = legacyQuestion(operationKey, levelRef, levelData);
    }

    // Forzar solo 2 opciones: la correcta y una incorrecta.
    const correctChoice = payload.options[payload.correct];
    const distractors = payload.options.filter((opt, i) => i !== payload.correct);
    let finalChoices = [correctChoice];
    if (distractors.length > 0) {
        finalChoices.push(distractors[0]);
    }
    finalChoices = shuffle(finalChoices);
    const choices = finalChoices;
    const answerIndex = choices.indexOf(correctChoice);

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
      hints: Array.isArray(payload.hints) ? payload.hints : [],
      metaSkill: payload.metaSkill || null,
      operationKey,
      levelRef,
      theme: levelData.theme
    };
  }

  function legacyQuestion(operationKey, levelRef, levelData) {
    const { storyline, theme } = levelData;
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
    title.textContent = `${theme.icon || '✨'} Niveau ${levelData.level} — ${levelData.title}`;
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

    const bgAnimation = document.createElement('div');
    bgAnimation.className = 'math-blitz__bg-animation';
    const symbols = ['+', '−', '×', '÷'];
    for (let i = 0; i < 20; i++) {
      const symbol = document.createElement('span');
      symbol.className = 'math-blitz__bg-symbol';
      symbol.textContent = symbols[i % symbols.length];
      symbol.style.left = `${Math.random() * 100}%`;
      symbol.style.fontSize = `${1 + Math.random() * 1.5}rem`;
      symbol.style.animationDuration = `${5 + Math.random() * 5}s`;
      symbol.style.animationDelay = `${Math.random() * 10}s`;
      bgAnimation.appendChild(symbol);
    }
    wrapper.appendChild(bgAnimation);

    content.appendChild(wrapper);

    context.setAnsweredStatus('in-progress');
    context.configureBackButton('Retour aux niveaux', () => {
      context.setAnsweredStatus('in-progress');
      context.showLevelMenu('math-blitz');
    });

    renderQuestion(context, state, questionWrapper, feedback, progressFill);
  }

  function renderQuestion(context, state, questionWrapper, feedback, progressFill) {
    clearTimeout(state.feedbackTimer);
    feedback.classList.add('is-hidden');
    feedback.textContent = '';

    const question = state.questions[state.index];
    const total = state.questions.length;
    const current = state.index + 1;

    state.questionStart = typeof performance !== 'undefined' ? performance.now() : Date.now();

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
      option.addEventListener('click', () => handleAnswer(context, state, question, idx, option, optionsGrid, feedback, questionWrapper, progressFill));
      optionsGrid.appendChild(option);
    });

    questionWrapper.appendChild(optionsGrid);

    const percent = Math.round(((current - 1) / total) * 100);
    progressFill.style.width = `${percent}%`;
  }

  function handleAnswer(context, state, question, selectedIndex, button, optionsGrid, feedback, questionWrapper, progressFill) {
    if (button.disabled) {
      return;
    }

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (state.questionStart) {
      const elapsed = Math.max(0, now - state.questionStart);
      state.timeRecords.push(elapsed);
    }

    const key = question.metaSkill || question.prompt;
    const previousFailures = state.comboFailures.get(key) || 0;
    const isCorrect = selectedIndex === question.answerIndex;

    Array.from(optionsGrid.children).forEach(child => { child.disabled = true; });

    if (isCorrect) {
      state.comboFailures.set(key, 0);
      state.correctCount += 1;
      state.streak += 1;
      state.bestStreak = Math.max(state.bestStreak, state.streak);

      context.playPositiveSound();
      context.awardReward(state.levelData.reward.stars, state.levelData.reward.coins);
      context.updateUI?.();
      button.classList.add('is-correct');
      showFeedback(feedback, 'positive', state.getPositiveMessage(), 1200);
      setTimeout(() => proceedToNextStep(context, state, questionWrapper, feedback, progressFill), 1200);
    } else {
      state.streak = 0;
      state.incorrectCount += 1;

      const newFailures = previousFailures + 1;
      state.comboFailures.set(key, newFailures);

      context.playNegativeSound();
      context.awardReward(0, -3);
      context.updateUI?.();
      button.classList.add('is-wrong');

      let hintMessage = question.hint || 'Essaie une autre réponse.';
      if (newFailures >= 2) {
        const hintIndex = Math.min(newFailures - 2, (question.hints || []).length - 1);
        if (Array.isArray(question.hints) && question.hints.length) {
          const hintEntry = question.hints[Math.max(0, hintIndex)];
          if (typeof hintEntry === 'string') {
            hintMessage = hintEntry;
          } else if (hintEntry && typeof hintEntry.text === 'string') {
            hintMessage = hintEntry.text;
          }
        } else if (question.explanation) {
          hintMessage = question.explanation;
        }
        enqueueRemedialQuestion(state, question);
      }

      showFeedback(feedback, 'negative', hintMessage, newFailures >= 2 ? 1800 : 1200);
      const delay = newFailures >= 2 ? 1600 : 1200;
      setTimeout(() => proceedToNextStep(context, state, questionWrapper, feedback, progressFill), delay);
    }
  }
  function enqueueRemedialQuestion(state, referenceQuestion) {
    if (!referenceQuestion || referenceQuestion.isRemedial) {
      return;
    }
    if (!referenceQuestion.operationKey) {
      return;
    }
    const targetLevel = Math.max(1, (referenceQuestion.levelRef || 1) - 1);
    if (targetLevel === referenceQuestion.levelRef) {
      return;
    }
    const remedialQuestion = createQuestion(referenceQuestion.operationKey, targetLevel, state.levelData);
    remedialQuestion.isRemedial = true;
    remedialQuestion.metaSkill = remedialQuestion.metaSkill || referenceQuestion.metaSkill || null;
    remedialQuestion.operationKey = referenceQuestion.operationKey;
    remedialQuestion.levelRef = targetLevel;
    state.questions.splice(Math.min(state.questions.length, state.index + 1), 0, remedialQuestion);
  }
  function proceedToNextStep(context, state, questionWrapper, feedback, progressFill) {
    state.index += 1;
    if (state.index < state.questions.length) {
      renderQuestion(context, state, questionWrapper, feedback, progressFill);
    } else {
      finishLevel(context, state, progressFill, feedback);
    }
  }

  function finishLevel(context, state, progressFill, feedback) {
    const theme = state.levelData.theme;
    progressFill.style.width = '100%';
    const sticker = state.levelData.sticker ? ` ${state.levelData.sticker}` : '';
    showFeedback(feedback, 'positive', `${theme.success || '✨ Niveau terminé !'}${sticker}`);

    context.markLevelCompleted();
    context.showSuccessMessage(`${theme.icon || '✨'} ${theme.success || 'Niveau complété !'}`);
    context.showConfetti();
    context.setAnsweredStatus('completed');

    state.feedbackTimer = setTimeout(() => {
      const currentLevelNumber = state.levelData.level;
      const totalLevels = state.levels.length;
      if (currentLevelNumber < totalLevels) {
        context.setCurrentLevel(currentLevelNumber + 1);
        start(context);
      } else {
        context.showLevelMenu('math-blitz');
      }
    }, 1600);
  }

  function showFeedback(feedback, variant, message, duration = 2600) {
    feedback.classList.remove('is-hidden', 'is-positive', 'is-negative');
    feedback.classList.add(variant === 'positive' ? 'is-positive' : 'is-negative');
    feedback.textContent = message;
    if (duration > 0) {
      clearTimeout(feedback._timer);
      feedback._timer = setTimeout(() => feedback.classList.add('is-hidden'), duration);
    }
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
