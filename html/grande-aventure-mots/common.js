(function () {
  'use strict';

  const storageCache = new Map();

  function ensureSpeech() {
    if (!('speechSynthesis' in window)) {
      return null;
    }
    return window.speechSynthesis;
  }

  function speak(text, options = {}) {
    const synth = ensureSpeech();
    if (!synth || !text) { return; }
    try { synth.cancel(); } catch (error) { console.warn('speech cancel error', error); }

    const utterance = new SpeechSynthesisUtterance(String(text));
    utterance.lang = options.lang || 'fr-FR';
    if (typeof options.rate === 'number') { utterance.rate = options.rate; }
    else { utterance.rate = 0.95; }
    if (typeof options.pitch === 'number') { utterance.pitch = options.pitch; }
    if (typeof options.volume === 'number') { utterance.volume = options.volume; }
    synth.speak(utterance);
  }

  function shuffle(input) {
    const array = Array.isArray(input) ? input.slice() : [];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function loadProgress(storageKey) {
    if (!storageKey) { return {}; }
    if (storageCache.has(storageKey)) {
      return storageCache.get(storageKey);
    }
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : {};
      const safe = parsed && typeof parsed === 'object' ? parsed : {};
      storageCache.set(storageKey, safe);
      return safe;
    } catch (error) {
      console.warn('GAM.loadProgress error', error);
      return {};
    }
  }

  function persist(storageKey, payload) {
    if (!storageKey) { return; }
    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
      storageCache.set(storageKey, payload);
    } catch (error) {
      console.warn('GAM.persist error', error);
    }
  }

  function saveProgress(storageKey, levelId, partialData) {
    if (!storageKey || !levelId) { return; }
    const progress = loadProgress(storageKey);
    const current = progress[levelId] || {};
    const updated = { ...current, ...partialData };
    progress[levelId] = updated;
    persist(storageKey, progress);
  }

  function markExercise(storageKey, levelId, totalExercises, completedExercises) {
    saveProgress(storageKey, levelId, {
      total: totalExercises,
      exercisesDone: Math.max(0, Math.min(totalExercises, completedExercises || 0))
    });
  }

  function markCompleted(storageKey, levelId, totalExercises) {
    saveProgress(storageKey, levelId, {
      total: totalExercises,
      exercisesDone: totalExercises,
      completed: true,
      completedAt: Date.now()
    });
  }

  function playConfetti() {
    try {
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (error) {
      console.warn('confetti error', error);
    }
  }

  function createLevelCard(level, options) {
    const { baseHref, storageKey, previousCompleted } = options;
    const progress = storageKey ? loadProgress(storageKey) : {};
    const data = progress[level.id] || {};
    const isCompleted = !!data.completed;
    const exercisesDone = data.exercisesDone || 0;
    const total = data.total || level.exercises || 1;
    const ratio = Math.max(0, Math.min(1, exercisesDone / total));
    const unlocked = level.locked ? false : (level.unlock === 'always' || previousCompleted || isCompleted || !options.requireCompletion);

    const card = document.createElement('a');
    card.className = 'level-card';
    card.href = unlocked ? `${baseHref}?level=${encodeURIComponent(level.id)}` : '#';
    card.dataset.level = level.id;
    if (!unlocked) { card.classList.add('is-locked'); card.setAttribute('aria-disabled', 'true'); }
    if (isCompleted) { card.classList.add('is-completed'); }

    const badge = document.createElement('span');
    badge.className = 'level-card__badge';
    badge.textContent = level.badge || '⭐';
    card.appendChild(badge);

    const title = document.createElement('h2');
    title.className = 'level-card__title';
    title.textContent = level.title;
    card.appendChild(title);

    const status = document.createElement('p');
    status.className = 'level-card__status';
    status.textContent = isCompleted ? 'Terminé ✔' : (level.subtitle || 'Nouveau défi');
    card.appendChild(status);

    const progressWrapper = document.createElement('div');
    progressWrapper.className = 'progress-wrapper';
    const fill = document.createElement('div');
    fill.className = 'progress-fill';
    fill.style.width = `${Math.round(ratio * 100)}%`;
    progressWrapper.appendChild(fill);
    card.appendChild(progressWrapper);

    if (!unlocked) {
      card.addEventListener('click', event => {
        event.preventDefault();
        const message = level.lockMessage || "Termine le niveau précédent pour le débloquer.";
        alert(message);
      });
    }

    return card;
  }

  function renderLevelCards(config) {
    const {
      levels = [],
      containerSelector = '.grid',
      baseHref = 'play.html',
      storageKey,
      requireCompletion = true
    } = config || {};

    const container = document.querySelector(containerSelector);
    if (!container) { return; }
    container.innerHTML = '';
    let previousCompleted = true;
    levels.forEach((level, index) => {
      const card = createLevelCard(level, {
        baseHref,
        storageKey,
        requireCompletion,
        previousCompleted
      });
      container.appendChild(card);
      const progress = storageKey ? loadProgress(storageKey) : {};
      const data = progress[level.id] || {};
      previousCompleted = !!data.completed;
      if (!requireCompletion) {
        previousCompleted = true;
      }
      if (level.unlock === 'always') {
        previousCompleted = true;
      }
      if (!data.completed && index === 0) {
        previousCompleted = false;
      }
    });
  }

  window.GAM = {
    speak,
    shuffle,
    loadProgress,
    saveProgress,
    markExercise,
    markCompleted,
    playConfetti,
    renderLevelCards
  };

  // Ensure global footer is present across all GAM pages
  function ensureGlobalFooter() {
    try {
      // 1) Ensure footer mount element exists
      let mount = document.querySelector('[data-app-footer]');
      if (!mount) {
        mount = document.createElement('footer');
        mount.className = 'global-footer';
        mount.setAttribute('data-app-footer', '');
        document.body.appendChild(mount);
      }

      // 2) Compute absolute base at /html/
      const path = window.location.pathname || '';
      const htmlIdx = path.indexOf('/html/');
      const base = htmlIdx >= 0 ? path.slice(0, htmlIdx + '/html/'.length) : '/html/';

      // 3) Ensure audioManager is present first (for footer audio button)
      const audioLoaded = Array.from(document.scripts).some(s => /\/js\/audioManager\.js($|\?)/.test(s.src || ''));
      if (!audioLoaded) {
        const audioScript = document.createElement('script');
        audioScript.src = base + '../js/audioManager.js';
        audioScript.async = true;
        document.head.appendChild(audioScript);
      }

      // 4) If footer.js is not yet loaded, inject it with a robust path
      const footerLoaded = Array.from(document.scripts).some(s => /\/js\/footer\.js($|\?)/.test(s.src || ''));
      if (!footerLoaded) {
        const footerScript = document.createElement('script');
        footerScript.src = base + '../js/footer.js';
        footerScript.async = true;
        document.body.appendChild(footerScript);
      }
    } catch (err) {
      console.warn('ensureGlobalFooter error', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureGlobalFooter);
  } else {
    ensureGlobalFooter();
  }
})();
