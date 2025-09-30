(function () {
  'use strict';

  const SETTINGS = window.DEVINE_LE_SON_SETTINGS || { storageKey: 'gam_devine_le_son' };
  const LEVELS = window.DEVINE_LE_SON_LEVELS || [];

  const elements = {
    title: document.getElementById('levelTitle'),
    description: document.getElementById('levelDescription'),
    counter: document.getElementById('progressCounter'),
    feedback: document.getElementById('feedback'),
    container: document.getElementById('optionsContainer'),
    replay: document.getElementById('btnReplay'),
    back: document.getElementById('btnBack')
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
  let audio = null;

  function updateTitle() {
    if (elements.title) {
      elements.title.innerHTML = `<span>🔊</span>${level.title}`;
    }
    if (elements.description) {
      const intro = SETTINGS.introText ? `${SETTINGS.introText}\n` : '';
      elements.description.textContent = `${intro}${level.description || ''}`.trim();
    }
  }

  function playSound(sound) {
    if (audio) {
      audio.pause();
    }
    audio = new Audio(sound);
    audio.play();
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

  function handleAnswer(selectedWord, button) {
    const exercise = exercises[currentIndex];
    if (!exercise) { return; }
    const isCorrect = selectedWord === exercise.correct;

    if (isCorrect) {
      score += 1;
      button.classList.add('correct');
      setFeedback('Bravo, c’est bien ça !', 'success');
      GAM.speak('Bravo !');
    } else {
      button.classList.add('wrong');
      setFeedback(`Dommage ! La bonne réponse était “${exercise.correct}”.`, 'error');
      GAM.speak(`La bonne réponse était ${exercise.correct}`);
    }

    GAM.markExercise(SETTINGS.storageKey, level.id, exercises.length, currentIndex + 1);

    Array.from(elements.container.querySelectorAll('button')).forEach(btn => btn.disabled = true);

    setTimeout(() => {
      currentIndex += 1;
      if (currentIndex >= exercises.length) {
        finishLevel();
      } else {
        renderExercise();
      }
    }, 1200);
  }

  function renderExercise() {
    const exercise = exercises[currentIndex];
    if (!exercise) { finishLevel(); return; }

    updateProgress();
    setFeedback('', null);

    const options = GAM.shuffle(exercise.options || []);
    elements.container.innerHTML = '';
    const template = document.getElementById('optionTemplate');

    options.forEach(option => {
        const optionNode = template.content.firstElementChild.cloneNode(true);
        const btn = optionNode;
        const emojiEl = optionNode.querySelector('.word-option__emoji');
        const labelEl = optionNode.querySelector('.word-option__label');
        emojiEl.textContent = option.emoji;
        labelEl.textContent = option.word;
        btn.dataset.word = option.word;
        btn.addEventListener('click', () => handleAnswer(option.word, btn));
        elements.container.appendChild(optionNode);
    });

    playSound(exercise.sound);
  }

  function finishLevel() {
    setFeedback(`Niveau terminé ! ${score} / ${exercises.length} bonnes réponses.`, 'success');
    GAM.markCompleted(SETTINGS.storageKey, level.id, exercises.length);
    GAM.playConfetti();
    elements.replay.disabled = true;
    elements.container.innerHTML = '🎉';
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
          playSound(exercise.sound);
        }
      });
    }
  }

  function init() {
    updateTitle();
    initControls();
    renderExercise();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
