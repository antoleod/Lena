(function () {
  'use strict';

  const OPTION_ICONS = ['🌟', '💎', '🪄', '🎈'];

  const LEVELS = [
    { level: 1, types: ['add', 'add', 'compare', 'missing', 'add', 'double'], reward: { stars: 10, coins: 6 } },
    { level: 2, types: ['add', 'sub', 'missing', 'compare', 'add', 'double'], reward: { stars: 12, coins: 7 } },
    { level: 3, types: ['add', 'sub', 'mix', 'missing', 'double', 'compare'], reward: { stars: 14, coins: 8 } },
    { level: 4, types: ['add', 'sub', 'mix', 'missing', 'double', 'triple'], reward: { stars: 16, coins: 9 } },
    { level: 5, types: ['add', 'sub', 'mul', 'mix', 'missing', 'compare'], reward: { stars: 18, coins: 10 } },
    { level: 6, types: ['add', 'sub', 'mul', 'mix', 'missing', 'double'], reward: { stars: 20, coins: 11 } },
    { level: 7, types: ['mul', 'mul', 'mix', 'missing', 'double', 'compare'], reward: { stars: 22, coins: 12 } },
    { level: 8, types: ['mul', 'mix', 'missing', 'double', 'compare', 'triple'], reward: { stars: 24, coins: 13 } },
    { level: 9, types: ['mul', 'mix', 'missing', 'compare', 'double', 'bonus'], reward: { stars: 26, coins: 14 } },
    { level: 10, types: ['mul', 'mix', 'missing', 'bonus', 'compare', 'triple'], reward: { stars: 28, coins: 16 } }
  ];

  function start(context) {
    const levelIndex = Math.max(0, Math.min(LEVELS.length, context.currentLevel) - 1);
    const levelData = LEVELS[levelIndex] || LEVELS[0];
    const questions = buildQuestions(levelData);
    const state = {
      levelData,
      questions,
      index: 0,
      feedbackTimer: null
    };

    context.clearGameClasses?.(['math-blitz']);
    renderScene(context, state);
  }

  function renderScene(context, state) {
    const { questions, levelData } = state;
    const content = context.content;
    content.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'math-blitz fx-bounce-in-down';

    const header = document.createElement('div');
    header.className = 'math-blitz__header';

    const title = document.createElement('h2');
    title.className = 'math-blitz__title';
    title.textContent = `Niveau ${levelData.level} — Maths Magiques`;
    header.appendChild(title);

    const subtitle = document.createElement('p');
    subtitle.className = 'math-blitz__subtitle';
    subtitle.textContent = 'Résous chaque opération et gagne des éclats d\'étoiles ✨';
    header.appendChild(subtitle);

    const progressBar = document.createElement('div');
    progressBar.className = 'math-blitz__progress';
    const progressFill = document.createElement('div');
    progressFill.className = 'math-blitz__progress-fill';
    progressBar.appendChild(progressFill);
    header.appendChild(progressBar);

    wrapper.appendChild(header);

    const questionWrapper = document.createElement('div');
    questionWrapper.className = 'math-blitz__question-wrapper';
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

    const prompt = document.createElement('div');
    prompt.className = 'math-blitz__prompt';
    prompt.textContent = question.prompt;
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

    question.choices.forEach((choice, idx) => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'math-blitz__option fx-bounce-in-down';
      option.style.animationDelay = `${0.15 * idx}s`;

      const icon = document.createElement('span');
      icon.className = 'math-blitz__option-icon';
      icon.textContent = OPTION_ICONS[idx % OPTION_ICONS.length];

      const label = document.createElement('span');
      label.className = 'math-blitz__option-label';
      label.textContent = String(choice);

      option.appendChild(icon);
      option.appendChild(label);
      option.addEventListener('click', () => handleAnswer(context, state, question, idx, option, optionsGrid, feedback, nextButton));
      optionsGrid.appendChild(option);
    });

    questionWrapper.appendChild(optionsGrid);

    const percent = Math.round((current - 1) / total * 100);
    progressFill.style.width = `${percent}%`;
  }

  function handleAnswer(context, state, question, selectedIndex, button, optionsGrid, feedback, nextButton) {
    if (button.disabled) { return; }

    const isCorrect = selectedIndex === question.answerIndex;

    if (isCorrect) {
      context.playPositiveSound();
      context.awardReward(state.levelData.reward.stars, state.levelData.reward.coins);
      context.updateUI?.();
      button.classList.add('is-correct');
      Array.from(optionsGrid.children).forEach(child => child.disabled = true);
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
    progressFill.style.width = '100%';
    feedback.classList.remove('is-hidden', 'is-negative');
    feedback.classList.add('is-positive');
    feedback.textContent = '✨ Niveau terminé !';
    nextButton.disabled = true;

    context.markLevelCompleted();
    context.showSuccessMessage('Niveau complété !');
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

  function buildQuestions(levelData) {
    const level = levelData.level;
    return levelData.types.map(type => createQuestion(type, level));
  }

  function createQuestion(type, level) {
    switch (type) {
      case 'add':
        return buildAddition(level);
      case 'sub':
        return buildSubtraction(level);
      case 'mul':
        return buildMultiplication(level);
      case 'missing':
        return buildMissing(level);
      case 'compare':
        return buildCompare(level);
      case 'double':
        return buildDouble(level);
      case 'triple':
        return buildTriple(level);
      case 'bonus':
        return buildCombo(level);
      case 'mix':
      default:
        return buildMix(level);
    }
  }

  function buildAddition(level) {
    const max = 10 + level * 8;
    const a = randomInt(2, Math.floor(max * 0.6));
    const b = randomInt(2, Math.floor(max * 0.6));
    const correct = a + b;
    return buildNumericQuestion(`${a} + ${b} = ?`, correct, level, {
      hint: 'Additionne les deux nombres.',
      success: 'Addition réussie !'
    });
  }

  function buildSubtraction(level) {
    const max = 12 + level * 6;
    const a = randomInt(Math.floor(max * 0.4), max);
    const b = randomInt(1, Math.min(a, Math.floor(max * 0.6)));
    const correct = a - b;
    return buildNumericQuestion(`${a} − ${b} = ?`, correct, level, {
      hint: 'Soustrais le deuxième nombre au premier.',
      success: 'Bonne soustraction !'
    });
  }

  function buildMultiplication(level) {
    const max = level <= 6 ? 8 : 12;
    const a = randomInt(2, Math.min(max, 3 + level));
    const b = randomInt(2, Math.min(max, 3 + level));
    const correct = a * b;
    return buildNumericQuestion(`${a} × ${b} = ?`, correct, level, {
      hint: `Ajoute ${b} autant de fois que nécessaire.`,
      success: 'Multiplication réussie !'
    });
  }

  function buildMissing(level) {
    const base = randomInt(10, 18 + level * 3);
    const known = randomInt(2, Math.floor(base * 0.7));
    const missing = base - known;
    const position = Math.random() < 0.5 ? 'left' : 'right';
    const prompt = position === 'left'
      ? `? + ${known} = ${base}`
      : `${known} + ? = ${base}`;
    return buildNumericQuestion(prompt, missing, level, {
      hint: 'Cherche le nombre qui complèterait l\'addition.',
      success: 'Nombre magique trouvé !'
    });
  }

  function buildCompare(level) {
    const values = [randomInt(4, 20 + level * 4), randomInt(3, 20 + level * 4), randomInt(5, 20 + level * 4)];
    const correct = Math.max(...values);
    return buildNumericQuestion('Quel nombre est le plus grand ?', correct, level, {
      hint: 'Observe bien chaque nombre.',
      success: 'Tu as trouvé le plus grand numéro !'
    }, values);
  }

  function buildDouble(level) {
    const base = randomInt(3, 10 + level * 2);
    const correct = base * 2;
    return buildNumericQuestion(`Quel est le double de ${base} ?`, correct, level, {
      hint: 'Additionne le nombre deux fois.',
      success: 'Double parfait !'
    });
  }

  function buildTriple(level) {
    const base = randomInt(2, 6 + level);
    const correct = base * 3;
    return buildNumericQuestion(`Quel est le triple de ${base} ?`, correct, level, {
      hint: 'Additionne le nombre trois fois.',
      success: 'Triple magique !'
    });
  }

  function buildCombo(level) {
    const a = randomInt(4, 8 + level);
    const b = randomInt(2, 6 + level);
    const c = randomInt(1, 6);
    const correct = a * b + c;
    return buildNumericQuestion(`${a} × ${b} + ${c} = ?`, correct, level, {
      hint: 'Commence par la multiplication, puis ajoute.',
      success: 'Quelle combinaison de champion !'
    });
  }

  function buildMix(level) {
    const choice = Math.random();
    if (choice < 0.33) { return buildAddition(level); }
    if (choice < 0.66) { return buildSubtraction(level); }
    return buildDouble(level);
  }

  function buildNumericQuestion(prompt, correct, level, messages, presetOptions) {
    const choices = presetOptions ? shuffle([...presetOptions]) : buildOptions(correct, level);
    const answerIndex = choices.indexOf(correct);
    return {
      prompt,
      detail: messages.detail || null,
      choices,
      answerIndex: answerIndex < 0 ? 0 : answerIndex,
      hint: messages.hint,
      successMessage: messages.success
    };
  }

  function buildOptions(correct, level) {
    const spread = Math.max(3, Math.round(4 + level * 0.8));
    const options = new Set([correct]);
    while (options.size < 3) {
      const offset = randomInt(-spread, spread);
      const candidate = correct + offset;
      if (candidate >= 0) {
        options.add(candidate);
      }
    }
    return shuffle(Array.from(options));
  }

  function randomInt(min, max) {
    const floorMin = Math.ceil(min);
    const floorMax = Math.floor(max);
    return Math.floor(Math.random() * (floorMax - floorMin + 1)) + floorMin;
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
    start
  };
})();
