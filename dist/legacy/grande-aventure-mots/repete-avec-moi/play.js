(function () {
  'use strict';

  const SETTINGS = window.REPETE_AVEC_MOI_SETTINGS || { storageKey: 'gam_repete_avec_moi' };
  const LEVELS = window.REPETE_AVEC_MOI_LEVELS || [];

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('La reconnaissance vocale n’est pas disponible sur ce navigateur. Essaie avec Chrome ou Edge.');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = window.i18n?.getSpeechLang?.() || 'fr-FR';
  recognition.continuous = false;
  recognition.interimResults = false;

  const elements = {
    title: document.getElementById('levelTitle'),
    description: document.getElementById('levelDescription'),
    counter: document.getElementById('progressCounter'),
    feedback: document.getElementById('feedback'),
    prompt: document.getElementById('promptSentence'),
    record: document.getElementById('btnRecord'),
    transcript: document.getElementById('transcript'),
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

  function updateTitle() {
    if (elements.title) {
      elements.title.innerHTML = `<span>🗣️</span>${level.title}`;
    }
    if (elements.description) {
      const intro = SETTINGS.introText ? `${SETTINGS.introText}\n` : '';
      elements.description.textContent = `${intro}${level.description || ''}`.trim();
    }
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

  function handleRecognitionResult(event) {
    const transcript = event.results[0][0].transcript;
    elements.transcript.textContent = `Tu as dit : “${transcript}”`;

    const exercise = exercises[currentIndex];
    if (!exercise) { return; }

    const original = exercise.sentence.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
    const spoken = transcript.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");

    if (original === spoken) {
      score += 1;
      setFeedback('Parfait, c’est exactement ça !', 'success');
      GAM.speak('Parfait !');
    } else {
      setFeedback('Ce n’est pas tout à fait ça. Essaie encore.', 'error');
      GAM.speak('Essaie encore.');
    }
    
    GAM.markExercise(SETTINGS.storageKey, level.id, exercises.length, currentIndex + 1);

    setTimeout(() => {
        currentIndex += 1;
        if (currentIndex >= exercises.length) {
            finishLevel();
        } else {
            renderExercise();
        }
    }, 1500);
  }

  function renderExercise() {
    const exercise = exercises[currentIndex];
    if (!exercise) { finishLevel(); return; }

    updateProgress();
    setFeedback('', null);
    elements.transcript.textContent = '';
    elements.prompt.textContent = exercise.sentence;
    GAM.speak(exercise.sentence);
  }

  function finishLevel() {
    setFeedback(`Niveau terminé ! ${score} / ${exercises.length} bonnes réponses.`, 'success');
    GAM.markCompleted(SETTINGS.storageKey, level.id, exercises.length);
    GAM.playConfetti();
    elements.replay.disabled = true;
    elements.record.disabled = true;
    elements.prompt.textContent = '🎉';
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
          GAM.speak(exercise.sentence);
        }
      });
    }
    if (elements.record) {
        elements.record.addEventListener('click', () => {
            try {
                recognition.start();
                elements.record.textContent = 'On t’écoute…';
                elements.record.disabled = true;
            } catch (error) {
                console.error('Speech recognition error', error);
                elements.record.textContent = 'Erreur';
            }
        });
    }
  }

  function init() {
    updateTitle();
    initControls();
    renderExercise();

    recognition.onresult = handleRecognitionResult;
    recognition.onend = () => {
        elements.record.textContent = 'Appuie et parle';
        elements.record.disabled = false;
    };
    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setFeedback(`Erreur de reconnaissance : ${event.error}`, 'error');
    };
  }

  document.addEventListener('DOMContentLoaded', init);
})();
