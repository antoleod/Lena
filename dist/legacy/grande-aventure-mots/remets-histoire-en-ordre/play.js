(function () {
  'use strict';

  const SETTINGS = window.REMETS_HISTOIRE_SETTINGS || { storageKey: 'gam_remets_histoire' };
  const LEVELS = window.REMETS_HISTOIRE_LEVELS || [];

  const elements = {
    title: document.getElementById('levelTitle'),
    description: document.getElementById('levelDescription'),
    counter: document.getElementById('progressCounter'),
    feedback: document.getElementById('feedback'),
    storyTitle: document.getElementById('storyTitle'),
    container: document.getElementById('stepsContainer'),
    replay: document.getElementById('btnReplay'),
    back: document.getElementById('btnBack'),
    checkOrder: document.getElementById('btnCheckOrder')
  };

  const query = new URLSearchParams(window.location.search);
  const levelId = query.get('level') || 'niveau1';
  const level = LEVELS.find(item => item.id === levelId) || LEVELS[0];
  if (!level) {
    elements.description.textContent = 'Aucun niveau disponible pour le moment.';
    return;
  }

  const exercises = level.exercises || [];
  let currentIndex = 0;
  let score = 0;
  let sortable = null;

const sounds = {
    drag: null,
    drop: null,
    correct: null
  };

  function initSounds() {
    if (window.audioManager) {
      sounds.drag = window.audioManager.bind(new Audio('../../assets/sounds/bling.wav'));
      sounds.drop = window.audioManager.bind(new Audio('../../assets/sounds/bling.wav'));
      sounds.correct = window.audioManager.bind(new Audio('../../assets/sounds/correct.wav'));
    }
  }

  function playSound(sound) {
    if (sound && sound.play) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  }

  function updateTitle() {
    if (elements.title) {
      elements.title.innerHTML = `<span>📚</span>${level.title}`;
    }
    if (elements.description) {
      const intro = SETTINGS.introText ? `${SETTINGS.introText}\n` : '';
      elements.description.textContent = `${intro}${level.description || ''}`.trim();
    }
  }

  function speakStory(steps) {
    const story = steps.map(step => step.text).join('. ');
    GAM.speak(story);
  }

  function updateProgress() {
    if (!elements.counter) { return; }
    const total = exercises.length;
    const current = Math.min(currentIndex + 1, total);
    elements.counter.textContent = `Exercice ${current} / ${total}`;
  }

  function setFeedback(message, variant) {
    if (!elements.feedback) { return; }
    elements.feedback.textContent = message;
    elements.feedback.classList.remove('is-success', 'is-error');
    if (variant === 'success') { elements.feedback.classList.add('is-success'); }
    if (variant === 'error') { elements.feedback.classList.add('is-error'); }
  }

  function checkOrder() {
    const exercise = exercises[currentIndex];
    if (!exercise) { return; }

    const orderedSteps = sortable.toArray();
    const correctOrder = exercise.steps.map(step => step.id);
    const isCorrect = JSON.stringify(orderedSteps) === JSON.stringify(correctOrder);

    if (isCorrect) {
      score += 1;
      setFeedback('Bravo, c’est le bon ordre !', 'success');
      playSound(sounds.correct);
      GAM.speak('Bravo !');
    } else {
      setFeedback('Ce n’est pas tout à fait ça. Essaie encore.', 'error');
      GAM.speak('Ce n’est pas le bon ordre.');
    }

    GAM.markExercise(SETTINGS.storageKey, level.id, exercises.length, currentIndex + 1);

    if(isCorrect) {
        setTimeout(() => {
            currentIndex += 1;
            if (currentIndex >= exercises.length) {
                finishLevel();
            } else {
                renderExercise();
            }
        }, 1000);
    }
  }

  function renderExercise() {
    const exercise = exercises[currentIndex];
    if (!exercise) { finishLevel(); return; }

    updateProgress();
    setFeedback('', null);

    if (elements.storyTitle) {
      elements.storyTitle.textContent = exercise.title;
    }

    const steps = GAM.shuffle(exercise.steps || []);
    elements.container.innerHTML = '';
    steps.forEach(step => {
      const stepEl = document.createElement('div');
      stepEl.className = 'story-step';
      stepEl.dataset.id = step.id;
      stepEl.textContent = step.text;
      elements.container.appendChild(stepEl);
    });

    if (sortable) {
      sortable.destroy();
    }
    sortable = new Sortable(elements.container, {
      animation: 150,
      onStart: () => playSound(sounds.drag),
      onEnd: () => playSound(sounds.drop)
    });

    speakStory(exercise.steps);
  }

  function finishLevel() {
    setFeedback(`Niveau terminé ! ${score} / ${exercises.length} bonnes réponses.`, 'success');
    GAM.markCompleted(SETTINGS.storageKey, level.id, exercises.length);
    GAM.playConfetti();
    elements.replay.disabled = true;
    elements.checkOrder.disabled = true;
    elements.container.innerHTML = '🎉';
    elements.storyTitle.textContent = 'Mission accomplie !';
  }

  function initControls() {
    if (elements.back) {
      elements.back.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }
    if (elements.replay) {
      elements.replay.addEventListener('click', () => {
        const exercise = exercises[currentIndex];
        if (exercise) {
          speakStory(exercise.steps);
        }
      });
    }
    if (elements.checkOrder) {
        elements.checkOrder.addEventListener('click', checkOrder);
    }
  }

  function init() {
    initSounds();
    updateTitle();
    initControls();
    renderExercise();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
