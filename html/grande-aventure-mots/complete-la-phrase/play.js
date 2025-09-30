(function () {
  'use strict';

  const SETTINGS = window.COMPLETE_PHRASE_SETTINGS || { storageKey: 'gam_complete_phrase' };
  const LEVELS = window.COMPLETE_PHRASE_LEVELS || [];

  const query = new URLSearchParams(window.location.search);
  const levelId = query.get('level') || 'niveau1';
  const level = LEVELS.find(item => item.id === levelId) || LEVELS[0];
  if (!level) { return; }

  const refs = {
    title: document.getElementById('levelTitle'),
    description: document.getElementById('levelDescription'),
    counter: document.getElementById('progressCounter'),
    feedback: document.getElementById('feedback'),
    sentence: document.getElementById('sentenceDisplay'),
    options: document.getElementById('optionsContainer'),
    replay: document.getElementById('btnReplay'),
    back: document.getElementById('btnBack')
  };

  const exercises = level.exercises || [];
  let index = 0;
  let score = 0;

  function formatSentence(sentence, word) {
    const replacement = word
      ? `<span class="phrase-board__blank is-filled">${word}</span>`
      : '<span class="phrase-board__blank">_____</span>';
    return sentence.replace('___', replacement);
  }

  function speakSentence(sentence, highlightWord) {
    const clean = sentence.replace('___', highlightWord || 'trou');
    GAM.speak(clean);
  }

  function updateHeader() {
    if (refs.title) {
      refs.title.innerHTML = `<span>🧩</span>${level.title}`;
    }
    if (refs.description) {
      const intro = SETTINGS.introText ? `${SETTINGS.introText}\n` : '';
      refs.description.textContent = `${intro}${level.description || ''}`.trim();
    }
  }

  function updateProgress() {
    if (!refs.counter) { return; }
    const total = exercises.length;
    const current = Math.min(index + 1, total);
    refs.counter.textContent = `Exercice ${current} / ${total}`;
  }

  function setFeedback(message, variant) {
    if (!refs.feedback) { return; }
    refs.feedback.textContent = message;
    refs.feedback.classList.remove('is-success', 'is-error');
    if (variant === 'success') { refs.feedback.classList.add('is-success'); }
    if (variant === 'error') { refs.feedback.classList.add('is-error'); }
  }

  function handleAnswer(choice, button) {
    const exercise = exercises[index];
    if (!exercise) { return; }
    const isCorrect = choice === exercise.correct;
    const total = exercises.length;

    if (isCorrect) {
      score += 1;
      setFeedback('Parfait ! La phrase est complète.', 'success');
      if (refs.sentence) {
        refs.sentence.innerHTML = formatSentence(exercise.sentence, exercise.correct);
      }
      button.classList.add('is-correct');
      GAM.speak('Super !');
    } else {
      setFeedback(`Presque ! La bonne réponse était “${exercise.correct}”.`, 'error');
      button.classList.add('is-error');
      GAM.speak(`La bonne réponse était ${exercise.correct}`);
      if (refs.sentence) {
        refs.sentence.innerHTML = formatSentence(exercise.sentence, exercise.correct);
      }
    }

    GAM.markExercise(SETTINGS.storageKey, level.id, total, index + 1);

    Array.from(refs.options.querySelectorAll('button')).forEach(btn => btn.disabled = true);

    setTimeout(() => {
      index += 1;
      if (index >= total) {
        finishLevel();
      } else {
        renderExercise();
      }
    }, isCorrect ? 750 : 1200);
  }

  function renderExercise() {
    const exercise = exercises[index];
    if (!exercise) { finishLevel(); return; }

    updateProgress();
    setFeedback('', null);

    if (refs.sentence) {
      refs.sentence.innerHTML = formatSentence(exercise.sentence);
    }

    const options = GAM.shuffle(exercise.options || []);
    refs.options.innerHTML = '';
    options.forEach(option => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'phrase-option';
      button.textContent = option;
      button.addEventListener('click', () => handleAnswer(option, button));
      refs.options.appendChild(button);
    });

    speakSentence(exercise.sentence, 'mot manquant');
  }

  function finishLevel() {
    setFeedback(`Niveau terminé ! ${score} / ${exercises.length} bonnes réponses.`, 'success');
    GAM.markCompleted(SETTINGS.storageKey, level.id, exercises.length);
    GAM.playConfetti();
    if (refs.options) {
      refs.options.innerHTML = '';
      const restart = document.createElement('button');
      restart.type = 'button';
      restart.className = 'action-btn';
      restart.textContent = 'Rejouer ce niveau';
      restart.addEventListener('click', () => {
        index = 0;
        score = 0;
        renderExercise();
      });
      refs.options.appendChild(restart);
    }
    if (refs.sentence) {
      refs.sentence.innerHTML = '🎉 Bravo !';
    }
    if (refs.replay) {
      refs.replay.disabled = true;
    }
  }

  function initControls() {
    if (refs.back) {
      refs.back.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }
    if (refs.replay) {
      refs.replay.addEventListener('click', () => {
        const exercise = exercises[index];
        if (exercise) {
          speakSentence(exercise.sentence, 'mot manquant');
        }
      });
    }
  }

  function init() {
    updateHeader();
    initControls();
    renderExercise();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
