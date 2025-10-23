/* global localStorage */
(function () {
  'use strict';

  const KEYS = {
    progress: 'lena:progress',
    coins: 'lena:coins',
    stars: 'lena:stars',
    badges: 'lena:badges',
    hints: 'lena:hints',
    calm: 'lena:calm-mode'
  };
  const LIMITS = {
    coins: { min: 0, max: 9999 },
    stars: { min: 0, max: 9999 }
  };
  const XP_REWARD = 10;
  const BONUS_STREAK = 3;

  const MESSAGES = {
    correct: [
      'Bravo ! \u{1F31F} Tu as bien compris.',
      'Super ! Tu apprends tr\u00E8s vite ! \u{1F680}',
      'G\u00E9nial ! Tu es un vrai champion ! \u{1F3C5}',
      'Formidable ! Continue comme \u00E7a !'
    ],
    retryWin: [
      'Tu vois ! Tu as r\u00E9ussi ! \u{1F389}',
      'C\u2019est bien, tu t\u2019am\u00E9liore vite ! \u{1F31F}'
    ],
    gentle: [
      'Presque ! Regarde bien la consigne \u{1F440}.',
      'Tu y es presque, essaie encore une fois ! \u{1F31F}'
    ],
    example: [
      'Regarde : 7 + 3 = 10, donc 7 + 5 = 12 \u270F\uFE0F'
    ],
    consolation: [
      'Ce n\u2019est pas grave, tu vas r\u00E9ussir la prochaine fois \u{1F308}',
      'Chaque essai te rend plus fort \u{1F331}',
      'Apprendre, c\u2019est essayer encore \u{1F308}',
      'M\u00EAme les magiciens se trompent parfois \u{1F9D9}\u200D\u2642\uFE0F'
    ],
    levelPerfect: [
      'Magnifique ! Niveau parfait \u{1F31F}',
      'Fantastique ! Z\u00E9ro faute \u{1F389}'
    ],
    levelOk: [
      'Tr\u00E8s bien ! Veux-tu t\u2019entra\u00EEner encore pour le badge parfait ? \u{1F4AB}',
      'Super mission ! Tu peux rejouer pour le badge parfait. \u2728'
    ]
  };

  const HINTS = {
    1: 'Indice : regarde les dizaines \u{1F440}.',
    2: 'Astuce : 7 + 3 = 10, alors 7 + 5 = 12 !',
    3: 'On y va ensemble : observe les couleurs et les formes.'
  };

  const BADGES = [
    {
      id: 'apprenti-curieux',
      name: 'Apprenti curieux',
      icon: '\u{1F423}',
      title: '\u{1F423} Apprenti curieux',
      headline: 'Ton aventure commence !',
      message: 'Bienvenue petit explorateur \u272F',
      unlocked: (data) => data.totals.levels >= 1
    },
    {
      id: 'concentre-magique',
      name: 'Concentr\u00E9 magique',
      icon: '\u{1F3AF}',
      title: '\u{1F3AF} Concentr\u00E9 magique',
      headline: 'Quelle pr\u00E9cision !',
      message: 'Tu ma\u00EEtrises l\u2019art de la concentration \u{1F9E0}',
      unlocked: (data) => data.totals.perfect >= 3
    },
    {
      id: 'semeur-etoiles',
      name: 'Semeur d\u2019\u00E9toiles',
      icon: '\u{1F33B}',
      title: '\u{1F33B} Semeur d\u2019\u00E9toiles',
      headline: 'Tu fais pousser des \u00E9toiles partout \u{1F33B}',
      message: 'Continue d\u2019illuminer ton univers !',
      unlocked: (data) => data.stars >= 50
    },
    {
      id: 'maitre-couleurs',
      name: 'Ma\u00EEtre des couleurs',
      icon: '\u{1F984}',
      title: '\u{1F984} Ma\u00EEtre des couleurs',
      headline: 'Tu es un vrai Ma\u00EEtre des jeux \u{1F984}',
      message: 'Tu inspires L\u00E9na et tous ses amis \u2728',
      unlocked: (data) => data.totals.flawless >= 5
    },
    {
      id: 'sage-savoir',
      name: 'Sage du savoir',
      icon: '\u{1F9D9}',
      title: '\u{1F9D9} Sage du savoir',
      headline: 'Le grand Sage est arriv\u00E9 !',
      message: 'Tu connais maintenant la magie des nombres \u{1F3A9}',
      unlocked: (data) => data.badges.length >= 10
    }
  ];

  const DEFAULT_STATE = {
    coins: 50,
    stars: 0,
    xp: 0,
    badges: [],
    games: {},
    totals: { answers: 0, successes: 0, hints: 0, levels: 0, perfect: 0, flawless: 0 },
    streaks: { correct: 0, retry: 0, noHint: 0, withHint: 0 },
    flags: { calmMode: false }
  };

  let state = mergeState(loadStored());
  let current = { game: 'global', level: 'freeplay' };
  let ui = { toasts: null, badges: null, confetti: null, hud: null };
  let hudCreationTimeout = null;
  let audioCtx;

  const api = {
    onAnswer,
    showHint,
    addCoins,
    removeCoins,
    awardBadge,
    saveProgress,
    loadProgress,
    showFeedbackToast,
    setCurrentExercise,
    onLevelComplete,
    toggleCalmMode,
    getState,
    refreshHud
  };

  window.feedbackSystem = Object.assign(window.feedbackSystem || {}, api);

  ready(init);
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  function init() {
    ensureUi();
    applyCalmMode(state.flags.calmMode);
    syncHud();
    checkBadges();
    emitUpdate();
  }

  function onAnswer(event) {
    const data = normalizeAnswer(event);
    current = { game: data.gameId, level: data.levelId };
    const level = ensureLevel(data.gameId, data.levelId);
    level.attempts += 1;
    level.lastPlayed = Date.now();
    state.totals.answers += 1;

    if (data.correct) {
      state.totals.successes += 1;
      state.streaks.correct += 1;
      state.streaks.retry = data.attempt > 1 ? state.streaks.retry + 1 : 0;
      state.streaks.noHint = data.usedHint ? 0 : state.streaks.noHint + 1;
      state.streaks.withHint = data.usedHint ? state.streaks.withHint + 1 : 0;

      level.completed = true;
      if (data.attempt === 1 && level.errors === 0 && !data.usedHint) {
        level.perfect = true;
      }
      level.needsReview = false;

      const coinReward = data.rewardCoins ?? randomInt(3, 5);
      const starReward = data.rewardStars ?? 1;
      addCoins(coinReward);
      addStars(starReward);
      addXp(data.rewardXp ?? XP_REWARD);

      const message = data.attempt > 1 ? pick(MESSAGES.retryWin) : pick(MESSAGES.correct);
      showFeedbackToast(message, 'success', {
        icon: data.attempt > 1 ? '\u{1F31F}' : '\u{1F389}'
      });

      if (data.attempt > 1) {
        grantRetryBonus();
      }

      if (data.perfectLevel) {
        state.totals.flawless += 1;
      }

      playTone('success');
      animateSuccess(data.targetElement);
      persist();
      emitUpdate();
      return getSuggestion(data.gameId);
    }

    state.streaks.correct = 0;
    state.streaks.retry = 0;
    state.streaks.noHint = 0;
    state.streaks.withHint += 1;

    level.errors = Math.max(level.errors, data.attempt);
    if (data.attempt >= 3) {
      level.needsReview = true;
    }

    if (state.coins > 5 && data.attempt <= 2) {
      removeCoins(1);
    }

    const toastMessage = data.attempt === 1
      ? pick(MESSAGES.gentle)
      : (data.attempt === 2 ? pick(MESSAGES.example) : pick(MESSAGES.consolation));

    const actions = [];
    actions.push({
      label: 'R\u00E9essayer',
      onClick: () => dispatch('lena:feedback:retry', {
        gameId: data.gameId,
        levelId: data.levelId
      })
    });
    if (data.attempt <= 2) {
      actions.push({
        label: 'Indice \u{1F4A1}',
        onClick: () => showHint(data.attempt, {
          gameId: data.gameId,
          levelId: data.levelId
        })
      });
    }
    if (data.attempt >= 2) {
      actions.push({
        label: data.attempt === 2 ? 'Exemple guid\u00E9' : 'Solution pas \u00E0 pas',
        onClick: () => dispatch('lena:feedback:guided-example', {
          gameId: data.gameId,
          levelId: data.levelId,
          attempt: data.attempt
        })
      });
    }

    showFeedbackToast(toastMessage, data.attempt >= 3 ? 'info' : 'gentle', {
      icon: data.attempt >= 3 ? '\u{1F308}' : '\u{1F4A1}',
      actions
    });

    playTone('error');
    animateError(data.targetElement);

    if (data.autoHint && data.attempt <= 2) {
      showHint(data.attempt, { gameId: data.gameId, levelId: data.levelId });
    }
    if (data.attempt >= 3) {
      showGuidedToast(data);
    }

    persist();
    emitUpdate();
    return getSuggestion(data.gameId);
  }

  function normalizeAnswer(input) {
    const data = input && typeof input === 'object' ? input : {};
    const gameId = data.gameId || current.game || 'global';
    const levelId = data.levelId || current.level || 'freeplay';
    const attempt = clamp(Number(data.attempt) || 1, 1, 3);
    return {
      gameId,
      levelId,
      correct: Boolean(data.correct),
      attempt,
      usedHint: Boolean(data.usedHint),
      rewardCoins: typeof data.rewardCoins === 'number' ? data.rewardCoins : undefined,
      rewardStars: typeof data.rewardStars === 'number' ? data.rewardStars : undefined,
      rewardXp: typeof data.rewardXp === 'number' ? data.rewardXp : undefined,
      targetElement: data.targetElement || null,
      autoHint: data.autoHint !== false,
      perfectLevel: Boolean(data.perfectLevel)
    };
  }

  function setCurrentExercise(ctx) {
    if (!ctx || typeof ctx !== 'object') {
      return;
    }
    current = {
      game: ctx.gameId || current.game,
      level: ctx.levelId || current.level
    };
    ensureLevel(current.game, current.level);
  }

  function ensureLevel(gameId, levelId) {
    const game = state.games[gameId] || (state.games[gameId] = { levels: {} });
    const key = levelId || 'freeplay';
    if (!game.levels[key]) {
      game.levels[key] = {
        attempts: 0,
        errors: 0,
        hints: 0,
        completed: false,
        perfect: false,
        needsReview: false,
        lastPlayed: Date.now()
      };
    }
    return game.levels[key];
  }

  function showHint(level, options) {
    const ctx = options && typeof options === 'object' ? options : {};
    const gameId = ctx.gameId || current.game;
    const levelId = ctx.levelId || current.level;
    const levelNumber = clamp(Number(level) || 1, 1, 3);
    const message = ctx.message || HINTS[levelNumber] || HINTS[1];

    const record = ensureLevel(gameId, levelId);
    record.hints = (record.hints || 0) + 1;
    state.totals.hints += 1;
    state.streaks.noHint = 0;
    state.streaks.withHint += 1;

    showFeedbackToast(message, 'hint', {
      icon: '\u{1F4A1}',
      duration: state.flags.calmMode ? 6000 : 4500
    });
    persist();
    emitUpdate();
    dispatch('lena:feedback:hint', { gameId, levelId, level: levelNumber });
    return message;
  }
  function addCoins(amount) {
    const delta = Number(amount) || 0;
    if (!delta) {
      return state.coins;
    }
    const next = clamp(state.coins + delta, LIMITS.coins.min, LIMITS.coins.max);
    if (next === state.coins) {
      return state.coins;
    }
    state.coins = next;
    syncHud();
    persist();
    emitUpdate();
    return state.coins;
  }

  function removeCoins(amount) {
    const delta = Math.abs(Number(amount) || 0);
    return addCoins(-delta);
  }

  function addStars(amount) {
    const delta = Number(amount) || 0;
    if (!delta) {
      return state.stars;
    }
    const next = clamp(state.stars + delta, LIMITS.stars.min, LIMITS.stars.max);
    if (next === state.stars) {
      return state.stars;
    }
    state.stars = next;
    syncHud();
    persist();
    emitUpdate();
    return state.stars;
  }

  function addXp(amount) {
    const delta = Number(amount) || 0;
    if (!delta) {
      return state.xp;
    }
    state.xp = Math.max(0, state.xp + delta);
    persist();
    emitUpdate();
    return state.xp;
  }

  function awardBadge(name) {
    if (!name || state.badges.includes(name)) {
      return name || null;
    }
    state.badges.push(name);
    persist();
    emitUpdate();

    const badge = BADGES.find((item) => item.name === name) || {};
    showBadgeCard({
      icon: badge.icon || '\u2728',
      title: badge.title || `Badge ${name}`,
      headline: badge.headline || 'Badge d\u00E9bloqu\u00E9 !',
      message: badge.message || 'Bravo pour ce nouveau succ\u00E8s !'
    });
    playTone('badge');
    launchConfetti();
    dispatch('lena:feedback:badge', { name });
    return name;
  }

  function onLevelComplete(summary) {
    const info = summary && typeof summary === 'object' ? summary : {};
    const gameId = info.gameId || current.game;
    const levelId = info.levelId || current.level;
    const errors = Math.max(0, Number(info.errors) || 0);
    const perfect = errors === 0;
    const level = ensureLevel(gameId, levelId);

    level.completed = true;
    level.errors = errors;
    level.perfect = perfect;
    level.needsReview = !perfect;
    level.lastPlayed = Date.now();

    state.totals.levels += 1;
    if (perfect) {
      state.totals.perfect += 1;
      state.totals.flawless += 1;
      addCoins(10);
      addStars(2);
      showFeedbackToast(pick(MESSAGES.levelPerfect), 'bonus', { icon: '\u{1F31F}' });
      launchConfetti();
    } else {
      showFeedbackToast(pick(MESSAGES.levelOk), 'info', {
        icon: '\u{1F680}',
        actions: [
          {
            label: 'Re-essayer le niveau',
            onClick: () => dispatch('lena:feedback:replay-level', { gameId, levelId })
          },
          {
            label: 'Retour au menu',
            onClick: () => dispatch('lena:feedback:go-menu', { gameId })
          }
        ]
      });
    }

    checkBadges();
    persist();
    emitUpdate();
  }

  function toggleCalmMode(force) {
    const value = typeof force === 'boolean' ? force : !state.flags.calmMode;
    state.flags.calmMode = value;
    applyCalmMode(value);
    persist();
    emitUpdate();
    return value;
  }

  function applyCalmMode(enabled) {
    document.documentElement.classList.toggle('lena-mode-calm', Boolean(enabled));
  }

  function showFeedbackToast(message, type, options) {
    ensureUi();
    const toast = document.createElement('div');
    toast.className = `toast-feedback toast-feedback--${type || 'info'}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', options?.ariaLive || 'polite');

    const icon = document.createElement('span');
    icon.className = 'toast-feedback__icon';
    icon.textContent = options?.icon || pickIcon(type);

    const body = document.createElement('div');
    body.className = 'toast-feedback__content';

    const text = document.createElement('p');
    text.className = 'toast-feedback__message';
    text.textContent = message;
    body.appendChild(text);

    if (Array.isArray(options?.actions) && options.actions.length) {
      const actions = document.createElement('div');
      actions.className = 'toast-feedback__actions';
      options.actions.forEach((action) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'toast-feedback__btn';
        btn.textContent = action.label || 'OK';
        btn.addEventListener('click', () => {
          if (typeof action.onClick === 'function') {
            action.onClick();
          }
          fadeToast(toast);
        });
        actions.appendChild(btn);
      });
      body.appendChild(actions);
    }

    toast.appendChild(icon);
    toast.appendChild(body);
    ui.toasts.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('is-visible'));
    const duration = options?.duration ?? (state.flags.calmMode ? 6500 : 4500);
    window.setTimeout(() => fadeToast(toast), duration);
    return toast;
  }

  function pickIcon(type) {
    switch (type) {
      case 'success':
        return '\u{1F389}';
      case 'gentle':
        return '\u{1F4AC}';
      case 'bonus':
        return '\u{1F3C6}';
      case 'hint':
        return '\u{1F4A1}';
      default:
        return '\u2728';
    }
  }

  function fadeToast(toast) {
    if (!toast) {
      return;
    }
    toast.classList.remove('is-visible');
    toast.classList.add('is-leaving');
    window.setTimeout(() => toast.remove(), 320);
  }

  function showGuidedToast(data) {
    showFeedbackToast('Ce n\u2019est pas grave, tu vas r\u00E9ussir la prochaine fois \u{1F308}', 'info', {
      icon: '\u{1F308}',
      duration: 6000,
      actions: [
        {
          label: 'Mode guid\u00E9',
          onClick: () => dispatch('lena:feedback:guided-mode', {
            gameId: data.gameId,
            levelId: data.levelId
          })
        }
      ]
    });
  }

  function grantRetryBonus() {
    if (state.streaks.retry >= BONUS_STREAK) {
      state.streaks.retry = 0;
      addCoins(5);
      showFeedbackToast('Bonus pers\u00E9v\u00E9rance +5 \u{1FA99}', 'bonus', {
        icon: '\u{1F3C6}'
      });
      playTone('bonus');
    }
  }

  function getSuggestion(gameId) {
    const game = state.games[gameId] || { levels: {} };
    const hintPressure = Math.min(3, state.streaks.withHint);
    const challenge = Math.min(3, state.streaks.noHint);
    const delta = challenge - hintPressure;
    return {
      difficultyBias: delta * 0.2,
      shouldEase: delta < -1,
      shouldChallenge: delta > 1,
      stats: {
        streak: state.streaks.correct,
        hintsInRow: state.streaks.withHint
      },
      game
    };
  }
  function ensureUi() {
    ensureToastContainer();
    ensureBadgeContainer();
    ensureConfettiContainer();
    ensureHud();
  }

  function ensureToastContainer() {
    if (ui.toasts && document.body.contains(ui.toasts)) {
      return;
    }
    ui.toasts = document.createElement('div');
    ui.toasts.id = 'feedback-toast-container';
    ui.toasts.className = 'toast-feedback__container';
    ui.toasts.setAttribute('aria-live', 'polite');
    document.body.appendChild(ui.toasts);
  }

  function ensureBadgeContainer() {
    if (ui.badges && document.body.contains(ui.badges)) {
      return;
    }
    ui.badges = document.createElement('div');
    ui.badges.id = 'badge-popup-container';
    ui.badges.className = 'badge-popup__container';
    document.body.appendChild(ui.badges);
  }

  function ensureConfettiContainer() {
    if (ui.confetti && document.body.contains(ui.confetti)) {
      return;
    }
    ui.confetti = document.createElement('div');
    ui.confetti.id = 'confetti-container';
    ui.confetti.className = 'confetti-container';
    ui.confetti.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ui.confetti);
  }

  function ensureHud() {
    const headerStats = document.querySelector('.lena-header-single');
    ui.hud = document.getElementById('scoreHUD');

    if (headerStats) {
      if (hudCreationTimeout) {
        window.clearTimeout(hudCreationTimeout);
        hudCreationTimeout = null;
      }
      if (ui.hud && !headerStats.contains(ui.hud)) {
        ui.hud.remove();
        ui.hud = null;
      }
      syncHud();
      return;
    }

    if (ui.hud) {
      syncHud();
      return;
    }

    if (hudCreationTimeout) {
      return;
    }

    hudCreationTimeout = window.setTimeout(() => {
      hudCreationTimeout = null;
      const refreshedHeader = document.querySelector('.lena-header-single');
      if (refreshedHeader) {
        syncHud();
        return;
      }

      ui.hud = document.createElement('div');
      ui.hud.id = 'scoreHUD';
      ui.hud.className = 'hud-score';

      const starSpan = document.createElement('span');
      starSpan.id = 'scoreStars';
      starSpan.className = 'hud-score__item';
      starSpan.textContent = `${String.fromCodePoint(0x2B50)} 0`;

      const coinSpan = document.createElement('span');
      coinSpan.id = 'scoreCoins';
      coinSpan.className = 'hud-score__item';
      coinSpan.textContent = `${String.fromCodePoint(0x1FA99)} 50`;

      ui.hud.append(starSpan, coinSpan);
      document.body.appendChild(ui.hud);
      syncHud();
    }, 160);
  }

  function refreshHud() {
    ensureHud();
  }

  function syncHud() {
    const starSymbol = String.fromCodePoint(0x2B50);
    const coinSymbol = String.fromCodePoint(0x1FA99);
    const starTargets = [document.getElementById('scoreStars'), document.getElementById('stars')];
    const coinTargets = [document.getElementById('scoreCoins'), document.getElementById('coins')];
    starTargets.filter(Boolean).forEach((el) => {
      el.textContent = el.id === 'scoreStars' ? `${starSymbol} ${state.stars}` : `${state.stars}`;
    });
    coinTargets.filter(Boolean).forEach((el) => {
      el.textContent = el.id === 'scoreCoins' ? `${coinSymbol} ${state.coins}` : `${state.coins}`;
    });

    if (window.lenaShell && typeof window.lenaShell.updateUser === 'function') {
      window.lenaShell.updateUser({
        userScore: { coins: state.coins, stars: state.stars },
        progress: { xp: state.xp }
      });
    }
  }

  function animateSuccess(target) {
    if (target && target.classList) {
      target.classList.add('fx-pop');
      window.setTimeout(() => target.classList.remove('fx-pop'), 500);
    } else {
      document.body.classList.add('fx-body-success');
      window.setTimeout(() => document.body.classList.remove('fx-body-success'), 400);
    }
  }

  function animateError(target) {
    if (!target || !target.classList) {
      document.body.classList.add('fx-body-error');
      window.setTimeout(() => document.body.classList.remove('fx-body-error'), 400);
      return;
    }
    target.classList.add('fx-shake');
    window.setTimeout(() => target.classList.remove('fx-shake'), 550);
  }

  function showBadgeCard(data) {
    ensureBadgeContainer();
    const card = document.createElement('article');
    card.className = 'badge-popup';
    card.setAttribute('role', 'status');
    card.innerHTML = `
      <div class="badge-popup__icon">${data.icon || '\u2728'}</div>
      <div class="badge-popup__body">
        <h3 class="badge-popup__title">${data.title || 'Nouveau badge !'}</h3>
        <p class="badge-popup__headline">${data.headline || ''}</p>
        <p class="badge-popup__message">${data.message || ''}</p>
      </div>
    `;
    ui.badges.appendChild(card);
    requestAnimationFrame(() => card.classList.add('is-visible'));
    window.setTimeout(() => {
      card.classList.remove('is-visible');
      window.setTimeout(() => card.remove(), 400);
    }, 4200);
  }

  function launchConfetti(multiplier) {
    ensureConfettiContainer();
    const pieces = Math.round((multiplier || 1) * (state.flags.calmMode ? 20 : 40));
    for (let i = 0; i < pieces; i += 1) {
      const fragment = document.createElement('span');
      fragment.className = 'confetti-piece';
      fragment.style.setProperty('--confetti-left', `${Math.random() * 100}%`);
      fragment.style.setProperty('--confetti-delay', `${Math.random() * 0.4}s`);
      fragment.style.setProperty('--confetti-duration', `${2.4 + Math.random()}s`);
      ui.confetti.appendChild(fragment);
      window.setTimeout(() => fragment.remove(), 3200);
    }
  }

  function playTone(mode) {
    if (window.audioManager && window.audioManager.isMuted) {
      return;
    }
    const frequencies = {
      success: 880,
      bonus: 1046,
      badge: 659,
      error: 220
    };
    const freq = frequencies[mode] || frequencies.success;
    const contextClass = window.AudioContext || window.webkitAudioContext;
    if (!contextClass) {
      return;
    }
    try {
      audioCtx = audioCtx || new contextClass();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = 0.12;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      window.setTimeout(() => {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      }, 250);
    } catch (error) {
      console.warn('[feedbackSystem] Audio error', error);
    }
  }

  function saveProgress() {
    persist();
  }

  function loadProgress() {
    state = mergeState(loadStored());
    applyCalmMode(state.flags.calmMode);
    syncHud();
    checkBadges();
    emitUpdate();
    return getState();
  }

  function getState() {
    return JSON.parse(JSON.stringify(state));
  }

  function emitUpdate() {
    dispatch('feedbackSystem:update', getState());
  }

  function dispatch(name, detail) {
    document.dispatchEvent(new CustomEvent(name, { detail }));
  }

  function persist() {
    try {
      localStorage.setItem(KEYS.progress, JSON.stringify(state));
      localStorage.setItem(KEYS.coins, String(state.coins));
      localStorage.setItem(KEYS.stars, String(state.stars));
      localStorage.setItem(KEYS.badges, JSON.stringify(state.badges));
      localStorage.setItem(KEYS.hints, String(state.totals.hints));
      localStorage.setItem(KEYS.calm, state.flags.calmMode ? 'true' : 'false');
    } catch (error) {
      console.warn('[feedbackSystem] Impossible de sauvegarder la progression', error);
    }

    try {
      if (window.storage && typeof window.storage.loadUserProfile === 'function' && typeof window.storage.saveUserProgress === 'function') {
        const profile = window.storage.loadUserProfile();
        const userName = profile && profile.name;
        if (userName) {
          const existingProgress = window.storage.loadUserProgress(userName);
          const newProgress = {
            ...existingProgress,
            userScore: {
                ...existingProgress.userScore,
                coins: state.coins,
                stars: state.stars
            },
            motivation: {
              xp: state.xp,
              badges: state.badges,
              totals: state.totals,
              streaks: state.streaks
            }
          };
          window.storage.saveUserProgress(userName, newProgress);
        }
      }
    } catch (error) {
      console.warn('[feedbackSystem] Sauvegarde storage.js impossible', error);
    }
  }

  function loadStored() {
    try {
      const raw = localStorage.getItem(KEYS.progress);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn('[feedbackSystem] Lecture stockage impossible', error);
      return null;
    }
  }

  function mergeState(raw) {
    if (!raw || typeof raw !== 'object') {
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
    const next = JSON.parse(JSON.stringify(DEFAULT_STATE));
    next.coins = clamp(Number(raw.coins) || next.coins, LIMITS.coins.min, LIMITS.coins.max);
    next.stars = clamp(Number(raw.stars) || next.stars, LIMITS.stars.min, LIMITS.stars.max);
    next.xp = Math.max(0, Number(raw.xp) || 0);
    next.badges = Array.isArray(raw.badges) ? Array.from(new Set(raw.badges)) : [];
    next.games = raw.games && typeof raw.games === 'object' ? raw.games : {};
    if (raw.totals && typeof raw.totals === 'object') {
      Object.assign(next.totals, raw.totals);
    }
    if (raw.streaks && typeof raw.streaks === 'object') {
      Object.assign(next.streaks, raw.streaks);
    }
    if (raw.flags && typeof raw.flags === 'object') {
      Object.assign(next.flags, raw.flags);
    }
    return next;
  }

  function checkBadges() {
    BADGES.forEach((badge) => {
      if (!state.badges.includes(badge.name) && badge.unlocked(state)) {
        awardBadge(badge.name);
      }
    });

    const habitCount = Math.floor(state.coins / 50);
    const existing = state.badges.filter((badge) => badge === 'Bonne Habitude').length;
    if (habitCount > existing) {
      awardBadge('Bonne Habitude');
    }
  }

  function clamp(value, min, max) {
    if (!Number.isFinite(value)) {
      return min;
    }
    return Math.max(min, Math.min(max, value));
  }

  function randomInt(min, max) {
    const lower = Math.ceil(Math.min(min, max));
    const upper = Math.floor(Math.max(min, max));
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
  }

  function pick(list) {
    if (!Array.isArray(list) || list.length === 0) {
      return '';
    }
    return list[Math.floor(Math.random() * list.length)];
  }
})();