;(function () {
  'use strict';

  const LEVELS = Array.from({ length: 10 }, (_, i) => ({
    level: i + 1,
    max: i < 3 ? 20 : i < 6 ? 50 : 100,
    needsTransform: i >= 3,
    reward: { stars: 12 + i * 2, coins: 6 + i }
  }));

  function t(key, fallback) {
    return window.i18n?.t ? window.i18n.t(key) : fallback;
  }

  function buildProblem(level) {
    const config = LEVELS[Math.max(0, Math.min(LEVELS.length - 1, level - 1))];
    const max = config.max;
    const min = Math.max(10, Math.floor(max * 0.4));

    let a = 0;
    let b = 0;
    let attempts = 0;
    while (attempts < 200) {
      attempts += 1;
      a = rand(min, max);
      b = rand(5, a - 1);
      const onesA = a % 10;
      const onesB = b % 10;
      if (config.needsTransform && onesA < onesB) {
        break;
      }
      if (!config.needsTransform && onesA >= onesB) {
        break;
      }
    }
    return { a, b };
  }

  function buildBlock(type, muted = false) {
    const block = document.createElement('div');
    block.className = `base-ten-block base-ten-block--${type}`;
    if (muted) {
      block.classList.add('is-removed');
    }
    block.textContent = type === 'ten' ? '10' : '1';
    block.setAttribute('aria-label', type === 'ten' ? t('baseTenBlockTen', 'Bloc de dix') : t('baseTenBlockOne', 'Bloc d\'une unité'));
    return block;
  }

  function start(level, context) {
    if (!context?.content) { return; }
    const root = context.content;
    root.innerHTML = '';
    root.classList.remove('stage-controls-visible');

    const levelConfig = LEVELS[Math.max(0, Math.min(LEVELS.length - 1, level - 1))];
    let { a, b } = buildProblem(level);
    let transformed = false;
    let tensA = Math.floor(a / 10);
    let onesA = a % 10;

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
      <h2 class="base-ten-title">${t('baseTenSubtractTitle', 'Soustraire, c'est transformer')}</h2>
      <div class="base-ten-target"><span>${t('baseTenSubtractGoal', 'On transforme pour retirer')}</span></div>
      <div class="base-ten-instructions" data-instructions></div>
    `;
    const instructionsEl = header.querySelector('[data-instructions]');

    const workspace = document.createElement('div');
    workspace.className = 'base-ten-subtract-grid';

    const minuendRow = document.createElement('div');
    minuendRow.className = 'base-ten-subtract-row';
    minuendRow.innerHTML = `<span class="base-ten-subtract-row__label">${a}</span>`;
    const minuendBlocks = document.createElement('div');
    minuendRow.appendChild(minuendBlocks);

    const subRow = document.createElement('div');
    subRow.className = 'base-ten-subtract-row';
    subRow.innerHTML = `<span class="base-ten-subtract-row__label">− ${b}</span>`;
    const subBlocks = document.createElement('div');
    subRow.appendChild(subBlocks);

    const resultRow = document.createElement('div');
    resultRow.className = 'base-ten-subtract-row';
    resultRow.innerHTML = `<span class="base-ten-subtract-row__label">=</span>`;
    const resultBox = document.createElement('div');
    resultBox.className = 'base-ten-result';
    resultRow.appendChild(resultBox);

    workspace.append(minuendRow, subRow, resultRow);

    const controls = document.createElement('div');
    controls.className = 'base-ten-controls';
    const transformBtn = document.createElement('button');
    transformBtn.type = 'button';
    transformBtn.className = 'base-ten-btn base-ten-btn--ghost';
    transformBtn.textContent = t('baseTenSubtractTransformBtn', 'Transformer une dizaine');
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'base-ten-btn';
    removeBtn.textContent = t('baseTenSubtractRemoveBtn', 'Retirer maintenant');
    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'base-ten-btn';
    nextBtn.textContent = t('baseTenSubtractNextBtn', 'Suite');
    controls.append(transformBtn, removeBtn, nextBtn);

    const feedback = document.createElement('div');
    feedback.className = 'base-ten-feedback';
    feedback.hidden = true;

    container.append(header, workspace, controls, feedback);
    root.appendChild(container);

    context.configureBackButton(t('menuBackToLevels', 'Retour aux niveaux'), () => context.showLevelMenu());

    function renderBlocks() {
      minuendBlocks.innerHTML = '';
      subBlocks.innerHTML = '';
      const tensB = Math.floor(b / 10);
      const onesB = b % 10;
      for (let i = 0; i < tensA; i++) {
        minuendBlocks.appendChild(buildBlock('ten'));
      }
      for (let i = 0; i < onesA; i++) {
        minuendBlocks.appendChild(buildBlock('one'));
      }
      for (let i = 0; i < tensB; i++) {
        subBlocks.appendChild(buildBlock('ten', true));
      }
      for (let i = 0; i < onesB; i++) {
        subBlocks.appendChild(buildBlock('one', true));
      }
    }

    function updateInstructions() {
      const onesB = b % 10;
      if (onesA < onesB && !transformed) {
        instructionsEl.textContent = t('baseTenSubtractStepTransform', 'Transformons une dizaine.');
      } else if (transformed) {
        instructionsEl.textContent = t('baseTenSubtractStepEasier', 'Maintenant, c'est plus facile à retirer.');
      } else {
        instructionsEl.textContent = t('baseTenSubtractStepRemove', 'Retire les blocs demandés.');
      }
    }

    function showFeedback(message) {
      feedback.textContent = message;
      feedback.hidden = false;
    }

    function hideFeedback() {
      feedback.hidden = true;
      feedback.textContent = '';
    }

    function doTransform() {
      if (transformed) { return; }
      if (tensA <= 0) { return; }
      tensA -= 1;
      onesA += 10;
      transformed = true;
      renderBlocks();
      updateInstructions();
      if (machine) {
        machine.setState('ANSWER_SELECTED');
      }
    }

    function doRemove() {
      hideFeedback();
      const result = (tensA * 10 + onesA) - b;
      resultBox.textContent = String(result);
      context.awardReward(levelConfig.reward.stars, levelConfig.reward.coins);
      context.setAnsweredStatus('completed');
      context.markLevelCompleted();
      context.playPositiveSound();
      showFeedback(t('baseTenSubtractFeedback', 'Bien joué ! Tu as transformé et retiré.'));
      if (machine) {
        machine.setState('VALIDATED');
      }
    }

    function nextLevel() {
      hideFeedback();
      ({ a, b } = buildProblem(level));
      transformed = false;
      tensA = Math.floor(a / 10);
      onesA = a % 10;
      resultBox.textContent = '';
      renderBlocks();
      updateInstructions();
      if (machine) {
        machine.setState('PLAYING');
      }
    }

    function renderControls(snapshot) {
      const state = snapshot.state;
      const onesB = b % 10;
      const needsTransform = onesA < onesB && !transformed;
      transformBtn.disabled = !needsTransform;
      removeBtn.disabled = needsTransform || state === 'VALIDATED';
      nextBtn.disabled = state !== 'VALIDATED';
    }

    transformBtn.addEventListener('click', throttleAction(doTransform));
    removeBtn.addEventListener('click', throttleAction(doRemove));
    nextBtn.addEventListener('click', throttleAction(nextLevel));

    renderBlocks();
    updateInstructions();
    if (machine) {
      machine.setState('PLAYING');
    }
  }

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  window.baseTenSubtractGame = {
    start,
    getLevelCount: () => LEVELS.length
  };
})();

