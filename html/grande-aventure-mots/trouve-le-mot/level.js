(function () {
  'use strict';

  const DEFAULT_STORAGE_KEY = 'gam_trouve_le_mot';

  const config = window.TROUVE_LE_MOT_CONFIG || {};
  const STORAGE_KEY = typeof config.storageKey === 'string' && config.storageKey.trim()
    ? config.storageKey.trim()
    : DEFAULT_STORAGE_KEY;
  const LEVEL_ID = typeof config.levelId === 'string' && config.levelId.trim()
    ? config.levelId.trim()
    : 'niveau';
  const EXERCISES = Array.isArray(config.exercises) ? config.exercises.slice() : [];

  delete window.TROUVE_LE_MOT_CONFIG;

  let currentIndex = 0;
  let activeCorrectWord = '';
  let hasCompletedLevel = false;

  const optionTemplate = document.getElementById('optionTemplate');
  const optionsContainer = document.getElementById('optionsContainer');
  const feedbackEl = document.getElementById('feedback');
  const progressCounter = document.getElementById('progressCounter');
  const instructionText = document.getElementById('instructionText');
  const repeatBtn = document.getElementById('repeatInstructionBtn');

  function logWarning(message, payload) {
    if (console && typeof console.warn === 'function') {
      console.warn(`[TrouveLeMot] ${message}`, payload || '');
    }
  }

  function speak(text) {
    if (!text) { return; }
    if (window.GAM && typeof window.GAM.speak === 'function') {
      window.GAM.speak(text);
      return;
    }
    const synth = window.speechSynthesis;
    if (!synth || typeof synth.speak !== 'function') { return; }
    try { synth.cancel(); } catch (error) { logWarning('speech cancel error', error); }
    try {
      const utterance = new SpeechSynthesisUtterance(String(text));
      utterance.lang = 'fr-FR';
      utterance.rate = 0.95;
      synth.speak(utterance);
    } catch (error) {
      logWarning('speech synthesis error', error);
    }
  }

  function safeParseProgress(raw) {
    if (!raw) { return {}; }
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
      logWarning('progress parse failed', error);
      return {};
    }
  }

  function loadProgress() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return safeParseProgress(raw);
    } catch (error) {
      logWarning('loadProgress failed', error);
      return {};
    }
  }

  function persistProgress(progress) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      logWarning('persistProgress failed', error);
    }
  }

  function saveProgress(partialData) {
    const progress = loadProgress();
    const existing = progress[LEVEL_ID] || { exercisesDone: 0, total: EXERCISES.length, completed: false };
    const updated = { ...existing, ...partialData, total: EXERCISES.length };
    progress[LEVEL_ID] = updated;
    persistProgress(progress);
  }

  function shuffle(array) {
    const copy = Array.isArray(array) ? array.slice() : [];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  function createOptionNode(option) {
    if (!option) { return null; }
    if (optionTemplate && optionTemplate.content) {
      const fragment = optionTemplate.content.cloneNode(true);
      const btn = fragment.querySelector('.word-option') || fragment.firstElementChild;
      if (btn) {
        const emojiEl = btn.querySelector('.word-option__emoji');
        const labelEl = btn.querySelector('.word-option__label');
        if (emojiEl) { emojiEl.textContent = option.emoji || ''; }
        if (labelEl) { labelEl.textContent = option.word || ''; }
        btn.dataset.word = option.word || '';
        return fragment;
      }
    }

    const fallbackBtn = document.createElement('button');
    fallbackBtn.type = 'button';
    fallbackBtn.className = 'word-option';
    fallbackBtn.dataset.word = option.word || '';

    const emojiSpan = document.createElement('span');
    emojiSpan.className = 'word-option__emoji';
    emojiSpan.setAttribute('aria-hidden', 'true');
    emojiSpan.textContent = option.emoji || '';

    const labelSpan = document.createElement('span');
    labelSpan.className = 'word-option__label';
    labelSpan.textContent = option.word || '';

    fallbackBtn.appendChild(emojiSpan);
    fallbackBtn.appendChild(labelSpan);
    return fallbackBtn;
  }

  function renderExercise(index) {
    if (!optionsContainer) { return; }
    if (index >= EXERCISES.length) {
      showCompletion();
      return;
    }

    const exercise = EXERCISES[index];
    if (!exercise) {
      showCompletion();
      return;
    }

    if (progressCounter) {
      progressCounter.textContent = `Exercice ${index + 1} / ${EXERCISES.length}`;
    }
    if (instructionText) {
      instructionText.textContent = exercise.instruction || '';
    }
    if (feedbackEl) {
      feedbackEl.textContent = '';
    }

    activeCorrectWord = exercise.word || '';
    optionsContainer.innerHTML = '';
    const options = shuffle(exercise.options);
    options.forEach(option => {
      const node = createOptionNode(option);
      if (!node) { return; }
      if (node instanceof DocumentFragment) {
        optionsContainer.appendChild(node);
      } else {
        optionsContainer.appendChild(node);
      }
    });

    speak(exercise.instruction);
  }

  function onOptionClick(event) {
    const target = event.target.closest('.word-option');
    if (!target || target.disabled) {
      return;
    }
    const chosen = target.dataset.word || '';
    handleSelection(target, chosen === activeCorrectWord);
  }

  function setButtonsDisabled(disabled) {
    if (!optionsContainer) { return; }
    const buttons = optionsContainer.querySelectorAll('.word-option');
    buttons.forEach(btn => {
      btn.disabled = disabled;
      if (!disabled) {
        btn.classList.remove('wrong');
      }
    });
  }

  function handleSelection(button, isCorrect) {
    if (hasCompletedLevel || !button) { return; }
    setButtonsDisabled(true);

    if (isCorrect) {
      button.classList.add('correct');
      if (feedbackEl) {
        feedbackEl.textContent = 'Bravo Léna !';
      }
      speak('Bravo Léna !');
      saveProgress({ exercisesDone: currentIndex + 1, completed: currentIndex + 1 === EXERCISES.length });
      window.setTimeout(() => {
        currentIndex += 1;
        renderExercise(currentIndex);
      }, 1000);
    } else {
      button.classList.add('wrong');
      if (feedbackEl) {
        feedbackEl.textContent = 'Essaie encore';
      }
      const retryInstruction = EXERCISES[currentIndex]?.instruction || '';
      speak(`Essaie encore. ${retryInstruction}`.trim());
      window.setTimeout(() => {
        setButtonsDisabled(false);
      }, 700);
    }
  }

  function playConfetti() {
    if (window.GAM && typeof window.GAM.playConfetti === 'function') {
      window.GAM.playConfetti();
      return;
    }
    if (typeof window.confetti === 'function') {
      window.confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 } });
    }
  }

  function showCompletion() {
    hasCompletedLevel = true;
    if (feedbackEl) {
      feedbackEl.textContent = 'Tu as gagné une étoile 🌟';
    }
    speak('Tu as gagné une étoile. Bravo Léna !');
    saveProgress({ exercisesDone: EXERCISES.length, completed: true });
    playConfetti();

    if (!optionsContainer) { return; }
    optionsContainer.innerHTML = '';

    const celebration = document.createElement('div');
    celebration.className = 'section-intro';
    celebration.innerHTML = '<strong>Tu as gagné une étoile 🌟</strong><br/>Tu peux revenir au menu pour choisir un autre niveau.';
    optionsContainer.appendChild(celebration);

    const backButton = document.createElement('button');
    backButton.type = 'button';
    backButton.className = 'action-btn';
    backButton.textContent = 'Retour aux niveaux';
    backButton.addEventListener('click', () => {
      window.location.href = '../index.html';
    });
    optionsContainer.appendChild(backButton);
  }

  function resumeFromProgress() {
    const fullProgress = loadProgress();
    const levelProgress = fullProgress[LEVEL_ID];
    if (!levelProgress) {
      saveProgress({ exercisesDone: 0, completed: false });
      currentIndex = 0;
      renderExercise(currentIndex);
      return;
    }

    if (levelProgress.completed || (levelProgress.exercisesDone || 0) >= EXERCISES.length) {
      currentIndex = EXERCISES.length;
      showCompletion();
      return;
    }

    currentIndex = Math.min(levelProgress.exercisesDone || 0, EXERCISES.length - 1);
    renderExercise(currentIndex);
  }

  function init() {
    if (!Array.isArray(EXERCISES) || EXERCISES.length === 0) {
      logWarning('No exercises provided for this level', config);
      if (instructionText) {
        instructionText.textContent = 'Aucun exercice disponible pour le moment.';
      }
      return;
    }

    if (!optionsContainer) {
      logWarning('Missing options container element');
      return;
    }

    optionsContainer.addEventListener('click', onOptionClick);

    if (repeatBtn) {
      repeatBtn.addEventListener('click', () => {
        const exercise = EXERCISES[Math.min(currentIndex, EXERCISES.length - 1)];
        if (exercise) {
          speak(exercise.instruction);
        }
      });
    }

    resumeFromProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
