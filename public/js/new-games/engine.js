;(function () {
  'use strict';

  const t = (key, params) => (window.i18n?.t ? window.i18n.t(key, params) : '');
  const registry = window.newGamesRegistry;
  if (!registry) { return; }

  const root = document.getElementById('game-shell-root');
  if (!root) { return; }

  const query = new URLSearchParams(window.location.search);
  const gameId = query.get('game') || '';
  const initialLevel = Math.max(1, Number(query.get('level')) || 1);
  const game = registry.getGame(gameId) || registry.games[0];

  const PROGRESS_KEY = 'lena:new-games:progress';
  const SETTINGS_KEY = 'lena:new-games:settings';

  const ui = {
    title: root.querySelector('[data-game-title]'),
    subtitle: root.querySelector('[data-game-subtitle]'),
    level: root.querySelector('[data-level]'),
    question: root.querySelector('[data-question]'),
    hint: root.querySelector('[data-hint]'),
    options: root.querySelector('[data-options]'),
    orderArea: root.querySelector('[data-order-area]'),
    progressText: root.querySelector('[data-progress-text]'),
    feedback: root.querySelector('[data-feedback]'),
    feedbackIcon: root.querySelector('[data-feedback-icon]'),
    feedbackSummary: root.querySelector('[data-feedback-summary]'),
    levelGrid: root.querySelector('[data-level-grid]'),
    autoToggle: root.querySelector('[data-auto-toggle]'),
    validateBtn: root.querySelector('[data-action="validate"]'),
    nextBtn: root.querySelector('[data-action="next"]'),
    hintBtn: root.querySelector('[data-action="hint"]')
  };

  const state = {
    level: initialLevel,
    index: 0,
    answer: null,
    ready: false,
    wrongStreak: 0,
    auto: false
  };

  const renderers = {
    chips: renderChips,
    build: renderBuildNumber,
    subtract: renderSubtractTransform,
    'number-line': renderNumberLine
  };

  function loadProgress() {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function saveProgress(data) {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('[new-games] progress save failed', error);
    }
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function saveSettings(data) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('[new-games] settings save failed', error);
    }
  }

  function hydrateState() {
    const progress = loadProgress();
    const gameProgress = progress[game.id] || {};
    state.level = Math.min(10, Math.max(1, gameProgress.level || initialLevel));
    state.index = Math.max(0, gameProgress.index || 0);
    const settings = loadSettings();
    state.auto = Boolean(settings.auto);
    if (ui.autoToggle) {
      ui.autoToggle.checked = state.auto;
    }
  }

  function persistState() {
    const progress = loadProgress();
    progress[game.id] = { level: state.level, index: state.index, updatedAt: Date.now() };
    saveProgress(progress);
  }

  function updateHeader() {
    if (ui.title) ui.title.textContent = t(game.titleKey);
    if (ui.subtitle) ui.subtitle.textContent = t(game.subtitleKey);
  }

  function formatOption(option) {
    if (option && typeof option === 'object' && option.key) {
      return t(option.key, option.params || {});
    }
    return String(option);
  }

  function setAnswer(answer, ready = true, autoReady = ready) {
    state.answer = answer;
    state.ready = ready;
    if (ui.validateBtn) ui.validateBtn.disabled = !ready;
    if (state.auto && autoReady) {
      setTimeout(validateAnswer, 180);
    }
  }

  function renderLevelGrid() {
    if (!ui.levelGrid) { return; }
    ui.levelGrid.innerHTML = '';
    const progress = loadProgress()[game.id] || {};
    const completed = progress.completedLevels || {};
    for (let i = 1; i <= 10; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ng-level-chip';
      btn.textContent = String(i);
      btn.dataset.completed = completed[i] ? 'true' : 'false';
      if (i === state.level) btn.dataset.active = 'true';
      btn.addEventListener('click', () => {
        state.level = i;
        state.index = 0;
        persistState();
        renderExercise();
        renderLevelGrid();
      });
      ui.levelGrid.appendChild(btn);
    }
  }

  function currentLevelData() {
    return game.levels.find(lvl => lvl.level === state.level) || game.levels[0];
  }

  function renderExercise() {
    const levelData = currentLevelData();
    const exercise = levelData.exercises[state.index];
    state.answer = null;
    state.ready = false;
    if (ui.question) {
      const params = Object.assign({}, exercise.promptParams || {});
      if (params.itemKey) {
        params.item = t(params.itemKey);
      }
      ui.question.textContent = t(exercise.promptKey, params);
    }
    if (ui.hint) {
      ui.hint.textContent = '';
      ui.hint.hidden = true;
    }
    if (ui.options) ui.options.innerHTML = '';
    if (ui.orderArea) ui.orderArea.innerHTML = '';
    if (ui.feedback) ui.feedback.hidden = true;
    if (ui.feedbackSummary) ui.feedbackSummary.textContent = '';
    if (ui.progressText) {
      ui.progressText.textContent = t('gameProgressText', { current: state.index + 1, total: levelData.exercises.length });
    }
    if (ui.level) ui.level.textContent = String(state.level);
    if (ui.hintBtn) ui.hintBtn.hidden = !exercise.hintKey;
    updateHeader();
    renderLevelGrid();

    const renderer = renderers[exercise.type];
    if (!renderer) { return; }
    renderer(ui.options, exercise, setAnswer, onHelpRequest);
    if (ui.validateBtn) ui.validateBtn.disabled = true;
    if (ui.nextBtn) ui.nextBtn.disabled = true;
  }

  function onHelpRequest(messageKey) {
    if (!ui.hint) { return; }
    ui.hint.textContent = t(messageKey);
    ui.hint.hidden = false;
  }

  function markCompleted() {
    const progress = loadProgress();
    const gameProgress = progress[game.id] || {};
    gameProgress.completedLevels = gameProgress.completedLevels || {};
    gameProgress.completedLevels[state.level] = true;
    progress[game.id] = gameProgress;
    saveProgress(progress);
  }

  function validateAnswer() {
    const levelData = currentLevelData();
    const exercise = levelData.exercises[state.index];
    if (!state.ready) { return; }
    const isCorrect = checkAnswer(exercise, state.answer);
    ui.feedback.hidden = false;
    if (ui.feedbackIcon) ui.feedbackIcon.textContent = isCorrect ? '✨' : '💡';
    if (ui.feedbackSummary) {
      ui.feedbackSummary.textContent = isCorrect ? t('gameFeedbackCorrect') : t('gameFeedbackRetry');
    }
    if (isCorrect) {
      state.wrongStreak = 0;
      if (ui.nextBtn) ui.nextBtn.disabled = false;
      if (ui.validateBtn) ui.validateBtn.disabled = true;
    } else {
      state.wrongStreak += 1;
      if (game.id === 'subtract-transform' && state.wrongStreak >= 2) {
        onHelpRequest('subtractTransformHelp');
      } else if (exercise.hintKey) {
        onHelpRequest(exercise.hintKey);
      }
    }
  }

  function nextExercise() {
    const levelData = currentLevelData();
    if (state.index + 1 < levelData.exercises.length) {
      state.index += 1;
    } else {
      markCompleted();
      if (state.level < 10) {
        state.level += 1;
        state.index = 0;
      } else {
        state.index = levelData.exercises.length - 1;
      }
    }
    persistState();
    renderExercise();
  }

  function checkAnswer(exercise, answer) {
    if (exercise.type === 'build' || exercise.type === 'subtract') {
      return Boolean(answer && answer.isCorrect);
    }
    if (exercise.type === 'number-line') {
      return Number(answer) === Number(exercise.answer);
    }
    if (exercise.type === 'chips') {
      const expected = exercise.answer;
      if (expected && typeof expected === 'object' && expected.key) {
        return formatOption(expected) === formatOption(answer);
      }
      return String(answer) === String(expected);
    }
    return false;
  }

  function renderChips(container, exercise, onSelect) {
    const options = (exercise.options || []).map(formatOption);
    options.forEach(option => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ng-chip';
      btn.textContent = option;
      btn.addEventListener('click', () => {
        container.querySelectorAll('.ng-chip').forEach(el => el.dataset.selected = 'false');
        btn.dataset.selected = 'true';
        onSelect(option, true);
      });
      container.appendChild(btn);
    });
  }

  function renderNumberLine(container, exercise, onSelect) {
    const wrapper = document.createElement('div');
    wrapper.className = 'ng-number-line';
    const line = document.createElement('div');
    line.className = 'ng-number-line__track';
    const values = [];
    const min = Math.min(exercise.line.start, exercise.line.end) - 2 * exercise.line.step;
    const max = Math.max(exercise.line.start, exercise.line.end) + 2 * exercise.line.step;
    for (let v = min; v <= max; v += exercise.line.step) values.push(v);
    values.forEach(val => {
      const mark = document.createElement('div');
      mark.className = 'ng-number-line__mark';
      mark.textContent = String(val);
      if (val === exercise.line.start) mark.dataset.start = 'true';
      if (val === exercise.line.end) mark.dataset.end = 'true';
      line.appendChild(mark);
    });
    wrapper.appendChild(line);
    container.appendChild(wrapper);
    renderChips(container, exercise, onSelect);
  }

  function renderBuildNumber(container, exercise, onSelect) {
    const wrapper = document.createElement('div');
    wrapper.className = 'ng-build';
    if (exercise.tutorial) {
      const tutorial = document.createElement('div');
      tutorial.className = 'ng-tutorial';
      tutorial.innerHTML = `
        <div class="ng-tutorial__title">${t('buildNumberTutorialTitle')}</div>
        <p>${t('buildNumberTutorialStep1')}</p>
        <p>${t('buildNumberTutorialStep2')}</p>
      `;
      wrapper.appendChild(tutorial);
    }

    let counts = { tens: 0, ones: 0 };

    const bank = document.createElement('div');
    bank.className = 'base-ten-bank';
    bank.setAttribute('aria-label', t('baseTenBankLabel'));
    const bankTen = buildBlock('ten');
    const bankOne = buildBlock('one');
    bank.append(bankTen, bankOne);

    const buildRow = document.createElement('div');
    buildRow.className = 'base-ten-row';
    buildRow.dataset.dropzone = 'build';
    buildRow.setAttribute('aria-label', t('baseTenBuildZone'));

    const info = document.createElement('div');
    info.className = 'ng-build__info';
    info.textContent = t('buildNumberTargetLabel', { target: exercise.target });

    const controls = document.createElement('div');
    controls.className = 'ng-build__controls';
    const breakBtn = document.createElement('button');
    breakBtn.type = 'button';
    breakBtn.className = 'ng-btn-ghost';
    breakBtn.textContent = t('baseTenBuildBreak');
    const groupBtn = document.createElement('button');
    groupBtn.type = 'button';
    groupBtn.className = 'ng-btn-ghost';
    groupBtn.textContent = t('baseTenBuildGroup');
    controls.append(breakBtn, groupBtn);

    wrapper.append(info, bank, buildRow, controls);
    container.appendChild(wrapper);

    function renderBlocks() {
      buildRow.innerHTML = '';
      for (let i = 0; i < counts.tens; i++) {
        const block = buildBlock('ten');
        block.classList.add('is-live');
        block.addEventListener('click', () => updateCounts({ tens: Math.max(0, counts.tens - 1) }));
        buildRow.appendChild(block);
      }
      for (let i = 0; i < counts.ones; i++) {
        const block = buildBlock('one');
        block.classList.add('is-live');
        block.addEventListener('click', () => updateCounts({ ones: Math.max(0, counts.ones - 1) }));
        buildRow.appendChild(block);
      }
    }

    function updateCounts(next) {
      counts = { ...counts, ...next };
      renderBlocks();
      const current = counts.tens * 10 + counts.ones;
      const correct = current === exercise.target;
      const ready = counts.tens + counts.ones > 0;
      onSelect({ isCorrect: correct, value: current }, ready, correct);
    }

    bankTen.addEventListener('click', () => updateCounts({ tens: counts.tens + 1 }));
    bankOne.addEventListener('click', () => updateCounts({ ones: counts.ones + 1 }));

    breakBtn.addEventListener('click', () => {
      if (counts.tens > 0) updateCounts({ tens: counts.tens - 1, ones: counts.ones + 10 });
    });
    groupBtn.addEventListener('click', () => {
      if (counts.ones >= 10) updateCounts({ tens: counts.tens + 1, ones: counts.ones - 10 });
    });

    renderBlocks();
  }

  function renderSubtractTransform(container, exercise, onSelect, onHelp) {
    const wrapper = document.createElement('div');
    wrapper.className = 'ng-subtract';
    let counts = {
      tens: Math.floor(exercise.minuend / 10),
      ones: exercise.minuend % 10
    };
    let removed = { tens: 0, ones: 0 };

    const info = document.createElement('div');
    info.className = 'ng-subtract__info';
    info.textContent = t('subtractTransformTarget', { minuend: exercise.minuend, subtrahend: exercise.subtrahend });

    const buildRow = document.createElement('div');
    buildRow.className = 'base-ten-row';
    buildRow.dataset.dropzone = 'subtract';

    const removedRow = document.createElement('div');
    removedRow.className = 'ng-subtract__removed';

    const controls = document.createElement('div');
    controls.className = 'ng-build__controls';
    const transformBtn = document.createElement('button');
    transformBtn.type = 'button';
    transformBtn.className = 'ng-btn-ghost';
    transformBtn.textContent = t('subtractTransformTransform');
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'ng-btn-ghost';
    resetBtn.textContent = t('subtractTransformReset');
    controls.append(transformBtn, resetBtn);

    wrapper.append(info, buildRow, removedRow, controls);
    container.appendChild(wrapper);

    function renderBlocks() {
      buildRow.innerHTML = '';
      removedRow.textContent = t('subtractTransformRemoved', { count: removed.tens * 10 + removed.ones });
      for (let i = 0; i < counts.tens; i++) {
        const block = buildBlock('ten');
        block.classList.add('is-live');
        block.addEventListener('click', () => removeBlock('ten'));
        buildRow.appendChild(block);
      }
      for (let i = 0; i < counts.ones; i++) {
        const block = buildBlock('one');
        block.classList.add('is-live');
        block.addEventListener('click', () => removeBlock('one'));
        buildRow.appendChild(block);
      }
    }

    function removeBlock(type) {
      if (type === 'ten' && counts.tens > 0) {
        counts.tens -= 1;
        removed.tens += 1;
      }
      if (type === 'one' && counts.ones > 0) {
        counts.ones -= 1;
        removed.ones += 1;
      }
      renderBlocks();
      const removedTotal = removed.tens * 10 + removed.ones;
      const remaining = counts.tens * 10 + counts.ones;
      const correct = removedTotal === exercise.subtrahend && remaining === exercise.target;
      const ready = removedTotal > 0;
      onSelect({ isCorrect: correct, removed: removedTotal, remaining }, ready, correct);
    }

    transformBtn.addEventListener('click', () => {
      if (counts.tens > 0) {
        counts.tens -= 1;
        counts.ones += 10;
        renderBlocks();
      } else {
        onHelp('subtractTransformNoTen');
      }
    });
    resetBtn.addEventListener('click', () => {
      counts = {
        tens: Math.floor(exercise.minuend / 10),
        ones: exercise.minuend % 10
      };
      removed = { tens: 0, ones: 0 };
      renderBlocks();
      onSelect({ isCorrect: false }, false, false);
    });

    renderBlocks();
  }

  function buildBlock(type) {
    const block = document.createElement('div');
    block.className = `base-ten-block base-ten-block--${type}`;
    block.textContent = type === 'ten' ? '10' : '1';
    block.setAttribute('role', 'button');
    block.setAttribute('aria-label', type === 'ten' ? t('baseTenBlockTen') : t('baseTenBlockOne'));
    return block;
  }

  function bindControls() {
    if (ui.validateBtn) ui.validateBtn.addEventListener('click', validateAnswer);
    if (ui.nextBtn) ui.nextBtn.addEventListener('click', nextExercise);
    if (ui.hintBtn) ui.hintBtn.addEventListener('click', () => {
      const levelData = currentLevelData();
      const exercise = levelData.exercises[state.index];
      if (exercise?.hintKey) {
        onHelpRequest(exercise.hintKey);
      }
    });
    if (ui.autoToggle) {
      ui.autoToggle.addEventListener('change', (event) => {
        state.auto = Boolean(event.target.checked);
        const settings = loadSettings();
        settings.auto = state.auto;
        saveSettings(settings);
      });
    }
  }

  hydrateState();
  bindControls();
  renderExercise();
  document.addEventListener('lena:language:change', () => {
    renderExercise();
  });
})();
