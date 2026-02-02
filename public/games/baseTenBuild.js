;(function () {
  'use strict';

  const LEVELS = Array.from({ length: 10 }, (_, i) => ({
    level: i + 1,
    max: i < 3 ? 20 : i < 6 ? 50 : 100,
    reward: { stars: 10 + i * 2, coins: 5 + i }
  }));

  function t(key, fallback) {
    return window.i18n?.t ? window.i18n.t(key) : fallback;
  }

  function getTarget(level) {
    const config = LEVELS[Math.max(0, Math.min(LEVELS.length - 1, level - 1))];
    const max = config.max;
    const min = Math.max(5, Math.floor(max * 0.4));
    return rand(min, max);
  }

  function buildBlock(type) {
    const block = document.createElement('div');
    block.className = `base-ten-block base-ten-block--${type}`;
    block.dataset.value = type === 'ten' ? '10' : '1';
    block.textContent = type === 'ten' ? '10' : '1';
    block.setAttribute('role', 'button');
    block.setAttribute('aria-label', type === 'ten' ? t('baseTenBlockTen', 'Bloc de dix') : t('baseTenBlockOne', 'Bloc d\'une unité'));
    block.draggable = true;
    return block;
  }

  function start(level, context) {
    if (!context?.content) { return; }
    const root = context.content;
    root.innerHTML = '';
    root.classList.remove('stage-controls-visible');

    const levelConfig = LEVELS[Math.max(0, Math.min(LEVELS.length - 1, level - 1))];
    let freeMode = false;
    let target = getTarget(level);
    let counts = { tens: 0, ones: 0 };

    const machineFactory = window.LenaStateMachine?.createStateMachine;
    const throttleAction = window.LenaStateMachine?.throttleAction || ((fn) => fn);
    const machine = machineFactory
      ? machineFactory({ initial: 'IDLE', onRender: renderControls })
      : null;

    const container = document.createElement('div');
    container.className = 'base-ten-game';

    const header = document.createElement('div');
    header.className = 'base-ten-header';
    header.innerHTML = `
      <h2 class="base-ten-title">${t('baseTenBuildTitle', 'Construis le nombre')}</h2>
      <div class="base-ten-target"><span>${t('baseTenBuildGoal', 'Nombre cible')}:</span> <strong data-target></strong></div>
      <div class="base-ten-instructions" data-instructions>${t('baseTenBuildHint', 'Glisse les blocs pour construire le nombre.')}</div>
    `;

    const targetEl = header.querySelector('[data-target]');
    const instructionsEl = header.querySelector('[data-instructions]');

    const bank = document.createElement('div');
    bank.className = 'base-ten-bank';
    bank.setAttribute('aria-label', t('baseTenBankLabel', 'Banque de blocs'));
    const bankLabel = document.createElement('span');
    bankLabel.className = 'base-ten-row__label';
    bankLabel.textContent = '🧰';
    bank.appendChild(bankLabel);
    const bankTen = buildBlock('ten');
    const bankOne = buildBlock('one');
    bank.append(bankTen, bankOne);

    const workspace = document.createElement('div');
    workspace.className = 'base-ten-workspace';

    const buildRow = document.createElement('div');
    buildRow.className = 'base-ten-row';
    buildRow.dataset.dropzone = 'build';
    buildRow.setAttribute('aria-label', t('baseTenBuildZone', 'Zone de construction'));
    const buildLabel = document.createElement('span');
    buildLabel.className = 'base-ten-row__label';
    buildLabel.textContent = '🧱';
    buildRow.appendChild(buildLabel);

    workspace.appendChild(buildRow);

    const controls = document.createElement('div');
    controls.className = 'base-ten-controls';
    const breakBtn = document.createElement('button');
    breakBtn.type = 'button';
    breakBtn.className = 'base-ten-btn base-ten-btn--ghost';
    breakBtn.textContent = t('baseTenBuildBreak', 'Rompre une dizaine');
    const groupBtn = document.createElement('button');
    groupBtn.type = 'button';
    groupBtn.className = 'base-ten-btn base-ten-btn--ghost';
    groupBtn.textContent = t('baseTenBuildGroup', 'Regrouper 10 unités');
    const validateBtn = document.createElement('button');
    validateBtn.type = 'button';
    validateBtn.className = 'base-ten-btn';
    validateBtn.textContent = t('gameValidate', 'Valider');
    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'base-ten-btn';
    nextBtn.textContent = t('gameNext', 'Suite');
    const freeBtn = document.createElement('button');
    freeBtn.type = 'button';
    freeBtn.className = 'base-ten-btn base-ten-btn--ghost';
    freeBtn.textContent = t('baseTenBuildFree', 'Mode libre');
    controls.append(breakBtn, groupBtn, validateBtn, nextBtn, freeBtn);

    const feedback = document.createElement('div');
    feedback.className = 'base-ten-feedback';
    feedback.hidden = true;

    container.append(header, bank, workspace, controls, feedback);
    root.appendChild(container);

    context.configureBackButton(t('menuBackToLevels', 'Retour aux niveaux'), () => context.showLevelMenu());

    function updateTarget() {
      targetEl.textContent = freeMode ? '∞' : String(target);
      targetEl.parentElement?.classList.toggle('is-free', freeMode);
    }

    function updateCounts(next) {
      counts = { ...counts, ...next };
      renderBlocks();
      if (machine) {
        machine.setState('ANSWER_SELECTED');
      }
    }

    function renderBlocks() {
      while (buildRow.children.length > 1) {
        buildRow.removeChild(buildRow.lastChild);
      }
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

    function currentValue() {
      return counts.tens * 10 + counts.ones;
    }

    function showFeedback(message) {
      feedback.textContent = message;
      feedback.hidden = false;
    }

    function hideFeedback() {
      feedback.hidden = true;
      feedback.textContent = '';
    }

    function validate() {
      hideFeedback();
      if (freeMode) {
        showFeedback(t('baseTenBuildFeedback', 'Super ! Il existe plusieurs façons !'));
        return;
      }
      if (currentValue() === target) {
        context.awardReward(levelConfig.reward.stars, levelConfig.reward.coins);
        context.setAnsweredStatus('completed');
        context.markLevelCompleted();
        context.playPositiveSound();
        showFeedback(t('baseTenBuildFeedback', 'Super ! Il existe plusieurs façons !'));
        if (machine) {
          machine.setState('VALIDATED');
        }
      } else {
        showFeedback(t('baseTenBuildEncourage', 'Super essai ! Ajustons encore un peu.'));
        if (machine) {
          machine.setState('PLAYING');
        }
      }
    }

    function nextLevel() {
      hideFeedback();
      target = getTarget(level);
      counts = { tens: 0, ones: 0 };
      renderBlocks();
      updateTarget();
      if (machine) {
        machine.setState('PLAYING');
      }
    }

    function renderControls(snapshot) {
      const state = snapshot.state;
      const canValidate = state === 'ANSWER_SELECTED' || state === 'PLAYING';
      const canNext = state === 'VALIDATED';
      validateBtn.disabled = freeMode ? true : !canValidate;
      nextBtn.disabled = !canNext;
    }

    function handleDrop(event) {
      event.preventDefault();
      const type = event.dataTransfer?.getData('text/plain');
      if (type === 'ten') {
        updateCounts({ tens: counts.tens + 1 });
      } else if (type === 'one') {
        updateCounts({ ones: counts.ones + 1 });
      }
    }

    function enableDrag(block, type) {
      block.addEventListener('dragstart', (event) => {
        event.dataTransfer?.setData('text/plain', type);
      });
    }

    buildRow.addEventListener('dragover', (event) => event.preventDefault());
    buildRow.addEventListener('drop', handleDrop);
    enableDrag(bankTen, 'ten');
    enableDrag(bankOne, 'one');

    bankTen.addEventListener('click', () => updateCounts({ tens: counts.tens + 1 }));
    bankOne.addEventListener('click', () => updateCounts({ ones: counts.ones + 1 }));

    breakBtn.addEventListener('click', throttleAction(() => {
      if (counts.tens > 0) {
        updateCounts({ tens: counts.tens - 1, ones: counts.ones + 10 });
      }
    }));

    groupBtn.addEventListener('click', throttleAction(() => {
      if (counts.ones >= 10) {
        updateCounts({ tens: counts.tens + 1, ones: counts.ones - 10 });
      }
    }));

    validateBtn.addEventListener('click', throttleAction(validate));
    nextBtn.addEventListener('click', throttleAction(nextLevel));

    freeBtn.addEventListener('click', throttleAction(() => {
      freeMode = !freeMode;
      updateTarget();
      freeBtn.classList.toggle('is-active', freeMode);
      hideFeedback();
      if (machine) {
        machine.setState('PLAYING');
      }
    }));

    updateTarget();
    renderBlocks();
    if (machine) {
      machine.setState('PLAYING');
    } else {
      validateBtn.disabled = false;
      nextBtn.disabled = true;
    }
  }

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  window.baseTenBuildGame = {
    start,
    getLevelCount: () => LEVELS.length
  };
})();

