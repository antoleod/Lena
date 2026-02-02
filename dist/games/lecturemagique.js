(function () {
  'use strict';

  const OPTION_ICONS = ['📘', '📗', '📙', '📕'];

  const LEVELS = [
{
level: 1,
reward: { stars: 8, coins: 5 },
activities: [
{ type: 'word-image', illustration: '🦊', prompt: 'Quel mot représente cet animal rusé ?', options: ['renard', 'lion', 'éléphant'], answer: 0, hint: 'Il a une queue rousse et vit dans les forêts.', success: 'Bravo, renard est correct !' },
{ type: 'word-image', illustration: '🍎', prompt: 'Quel fruit croquant est ici représenté ?', options: ['poire', 'banane', 'pomme'], answer: 2, hint: 'Ce fruit est souvent rouge ou vert.', success: 'Oui, c\'est la pomme !' },
{ type: 'fill', sentence: 'La ___ boit du lait.', options: ['chatte', 'voiture', 'chaise'], answer: 0, hint: 'Cherche un animal domestique.', success: 'Bien vu !' },
{ type: 'rhyme', base: 'chat', options: ['rat', 'nez', 'pied'], answer: 0, hint: 'Quel mot se termine par le même son ?', success: 'Rat rime avec chat !' },
{ type: 'start-sound', letter: 'p', options: ['pomme', 'tomate', 'cerise'], answer: 0, hint: 'Quel mot commence par le son P ?', success: 'Pomme commence par P !' },
{ type: 'fill', sentence: 'Le soleil brille dans le ___ bleu.', options: ['ciel', 'sol', 'bois'], answer: 0, hint: 'Regarde en haut pendant la journée.', success: 'Exactement, c\'est le ciel !' }
]
},
{
level: 2,
reward: { stars: 9, coins: 6 },
activities: [
{ type: 'word-image', illustration: '🐱', prompt: 'Quel animal miaule ?', options: ['chien', 'chat', 'lapin'], answer: 1, hint: 'Il aime les souris.', success: 'Bonne réponse, le chat miaule !' },
{ type: 'fill', sentence: 'Le pain est dans la ___.', options: ['boîte', 'poubelle', 'corbeille'], answer: 2, hint: 'On y met souvent les fruits ou le pain.', success: 'Oui, dans la corbeille !' },
{ type: 'rhyme', base: 'chien', options: ['bien', 'fleur', 'lien'], answer: 0, hint: 'Quel mot rime avec chien ?', success: 'Bien rime avec chien !' },
{ type: 'start-sound', letter: 't', options: ['tigre', 'zèbre', 'oiseau'], answer: 0, hint: 'Quel mot commence par le son T ?', success: 'Tigre commence par T !' },
{ type: 'fill', sentence: 'La mer est pleine d\'___.', options: ['eau', 'arbres', 'sable'], answer: 0, hint: 'C\'est un liquide.', success: 'Oui, elle est pleine d\'eau !' },
{ type: 'word-image', illustration: '🌕', prompt: 'Quel mot correspond à cette image céleste ?', options: ['lune', 'soleil', 'terre'], answer: 0, hint: 'Elle brille la nuit.', success: 'C\'est bien la lune !' }
]
},
{
level: 3,
reward: { stars: 10, coins: 7 },
activities: [
{ type: 'word-image', illustration: '🦉', prompt: 'Quel oiseau voit dans le noir ?', options: ['hibou', 'colombe', 'canard'], answer: 0, hint: 'Il hulule la nuit.', success: 'Exactement, le hibou !' },
{ type: 'fill', sentence: 'Le ___ tourne autour du soleil.', options: ['planète', 'rocher', 'sapin'], answer: 0, hint: 'La Terre est une.', success: 'Planète est la bonne réponse !' },
{ type: 'rhyme', base: 'nuit', options: ['fruit', 'jour', 'matin'], answer: 0, hint: 'Quel mot finit comme nuit ?', success: 'Fruit rime avec nuit !' },
{ type: 'start-sound', letter: 'cl', options: ['cloche', 'lampe', 'poule'], answer: 0, hint: 'Quel mot commence par cl ?', success: 'Cloche commence par cl !' },
{ type: 'word-image', illustration: '🌲', prompt: 'Quel mot correspond à cet arbre ?', options: ['pin', 'rose', 'citrouille'], answer: 0, hint: 'Un arbre vert et pointu.', success: 'Pin est le bon mot !' },
{ type: 'fill', sentence: 'Le magicien utilise une ___.', options: ['baguette', 'assiette', 'télécommande'], answer: 0, hint: 'Objet magique et fin.', success: 'Bravo, une baguette magique !' }
]
},
{
level: 4,
reward: { stars: 11, coins: 8 },
activities: [
{ type: 'fill', sentence: 'L\'enfant monte sur une ___ pour voir plus haut.', options: ['chaise', 'échelle', 'table'], answer: 1, hint: 'Elle a des barreaux.', success: 'Bonne réponse, une échelle !' },
{ type: 'word-image', illustration: '🐢', prompt: 'Quel animal porte une carapace ?', options: ['tortue', 'chien', 'singe'], answer: 0, hint: 'Elle est lente.', success: 'Tortue est correct !' },
{ type: 'rhyme', base: 'beau', options: ['chaud', 'chien', 'fleur'], answer: 0, hint: 'Quel mot se termine pareil ?', success: 'Chaud rime avec beau !' },
{ type: 'start-sound', letter: 'tr', options: ['train', 'lune', 'livre'], answer: 0, hint: 'Quel mot commence par tr ?', success: 'Train commence par tr !' },
{ type: 'word-image', illustration: '🖼️', prompt: 'Quel mot représente cet objet accroché au mur ?', options: ['tableau', 'canapé', 'lampe'], answer: 0, hint: 'On y voit souvent des images.', success: 'Oui, un tableau !' },
{ type: 'fill', sentence: 'L\'avion vole dans le ___.', options: ['vent', 'ciel', 'jardin'], answer: 1, hint: 'Au-dessus de nous.', success: 'Dans le ciel !' }
]
},

  ];

  function start(context) {
    const levelIndex = Math.max(0, Math.min(LEVELS.length, context.currentLevel) - 1);
    const levelData = LEVELS[levelIndex] || LEVELS[0];
    const state = {
      levelData,
      index: 0,
      feedbackTimer: null
    };

    context.clearGameClasses?.(['lecture-magique']);
    renderScene(context, state);
  }

  function renderScene(context, state) {
    const content = context.content;
    content.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'lecture-magique fx-bounce-in-down';

    const header = document.createElement('div');
    header.className = 'lecture-magique__header';

    const title = document.createElement('h2');
    title.className = 'lecture-magique__title';
    title.textContent = `Lecture Magique — Niveau ${state.levelData.level}`;
    header.appendChild(title);

    const subtitle = document.createElement('p');
    subtitle.className = 'lecture-magique__subtitle';
    subtitle.textContent = 'Lis, écoute et choisis la bonne réponse pour illuminer ton histoire !';
    header.appendChild(subtitle);

    const progress = document.createElement('div');
    progress.className = 'lecture-magique__progress';
    const progressFill = document.createElement('div');
    progressFill.className = 'lecture-magique__progress-fill';
    progress.appendChild(progressFill);
    header.appendChild(progress);

    wrapper.appendChild(header);

    const activityZone = document.createElement('div');
    activityZone.className = 'lecture-magique__activity';
    wrapper.appendChild(activityZone);

    const feedback = document.createElement('div');
    feedback.className = 'lecture-magique__feedback is-hidden';
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    wrapper.appendChild(feedback);

    content.appendChild(wrapper);

    context.configureBackButton('Retour aux niveaux', () => {
      context.setAnsweredStatus('in-progress');
      context.showLevelMenu('lecture-magique');
    });

    context.setAnsweredStatus('in-progress');

    renderActivity(context, state, activityZone, feedback, progressFill, null);
  }

  function renderActivity(context, state, activityZone, feedback, progressFill, nextBtn) {
    clearTimeout(state.feedbackTimer);
    feedback.classList.add('is-hidden');
    feedback.textContent = '';
    if (nextBtn) nextBtn.disabled = true;

    const activity = state.levelData.activities[state.index];
    const total = state.levelData.activities.length;
    const current = state.index + 1;

    activityZone.innerHTML = '';

    const question = document.createElement('div');
    question.className = 'lecture-magique__prompt';
    question.textContent = activity.prompt || buildPrompt(activity);
    activityZone.appendChild(question);

    const illustration = buildIllustration(activity);
    if (illustration) activityZone.appendChild(illustration);

    const options = document.createElement('div');
    options.className = 'lecture-magique__options';

    activity.options.forEach((optionText, idx) => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'lecture-magique__option fx-bounce-in-down';
      option.style.animationDelay = `${idx * 0.1}s`;

      const icon = document.createElement('span');
      icon.className = 'lecture-magique__option-icon';
      icon.textContent = OPTION_ICONS[idx % OPTION_ICONS.length];

      const label = document.createElement('span');
      label.className = 'lecture-magique__option-label';
      label.textContent = optionText;

      option.appendChild(icon);
      option.appendChild(label);

      option.addEventListener('click', () =>
        handleReadingAnswer(context, state, activity, idx, option, options, feedback, activityZone, progressFill)
      );
      options.appendChild(option);
    });

    activityZone.appendChild(options);

    const percent = Math.round((current - 1) / total * 100);
    progressFill.style.width = `${percent}%`;

    context.speakText(activity.speak || question.textContent);
  }

  function handleReadingAnswer(context, state, activity, selectedIndex, button, optionsContainer, feedback, activityZone, progressFill) {
    if (button.disabled) return;

    const isCorrect = selectedIndex === activity.answer;

    if (isCorrect) {
      context.playPositiveSound();
      context.awardReward(state.levelData.reward.stars, state.levelData.reward.coins);
      context.updateUI?.();
      button.classList.add('is-correct');
      disableOptions(optionsContainer);
      showReadingFeedback(feedback, 'positive', activity.success || 'Super lecture !');

      setTimeout(() => {
        state.index += 1;
        if (state.index < state.levelData.activities.length) {
          renderActivity(context, state, activityZone, feedback, progressFill, null);
        } else {
          finishLevel(context, state, feedback, null, progressFill);
        }
      }, 1200);
    } else {
      context.playNegativeSound();
      context.awardReward(0, -2);
      context.updateUI?.();
      button.classList.add('is-wrong');
      button.disabled = true;
      showReadingFeedback(feedback, 'negative', activity.hint || 'Regarde bien les indices.');
      setTimeout(() => button.classList.remove('is-wrong'), 600);
    }
  }

  function disableOptions(container) {
    Array.from(container.children).forEach(child => {
      child.disabled = true;
    });
  }

  function finishLevel(context, state, feedback, nextBtn, progressFill) {
    progressFill.style.width = '100%';
    if (nextBtn) nextBtn.disabled = true;
    showReadingFeedback(feedback, '✨ Tu as lu toute l\'histoire !');

    context.markLevelCompleted();
    context.showSuccessMessage('Lecture réussie !');
    context.showConfetti();
    context.setAnsweredStatus('completed');

    state.feedbackTimer = setTimeout(() => {
      context.showLevelMenu('lecture-magique');
    }, 1600);
  }

  function showReadingFeedback(feedback, variant, message) {
    feedback.classList.remove('is-hidden', 'is-positive', 'is-negative');
    feedback.classList.add(variant === 'positive' ? 'is-positive' : 'is-negative');
    feedback.textContent = message;
  }

  function buildPrompt(activity) {
    if (activity.type === 'fill') {
      return activity.sentence.replace('___', '____');
    }
    if (activity.type === 'rhyme') {
      return `Quel mot rime avec \"${activity.base}\" ?`;
    }
    if (activity.type === 'start-sound') {
      return `Quel mot commence par le son \"${activity.letter}\" ?`;
    }
    return 'Lis et choisis la bonne réponse.';
  }

  function buildIllustration(activity) {
    if (activity.type === 'word-image' && activity.illustration) {
      const figure = document.createElement('div');
      figure.className = 'lecture-magique__illustration';
      figure.textContent = activity.illustration;
      return figure;
    }
    if (activity.type === 'fill') {
      const sentence = document.createElement('p');
      sentence.className = 'lecture-magique__sentence';
      sentence.innerHTML = highlightBlank(activity.sentence);
      return sentence;
    }
    if (activity.type === 'rhyme') {
      const base = document.createElement('p');
      base.className = 'lecture-magique__base-word';
      base.textContent = activity.base;
      return base;
    }
    if (activity.type === 'start-sound') {
      const letter = document.createElement('p');
      letter.className = 'lecture-magique__base-word';
      letter.textContent = activity.letter.toUpperCase();
      return letter;
    }
    return null;
  }

  function highlightBlank(sentence) {
    return sentence.replace('___', '<span class=\"lecture-magique__blank\">___</span>');
  }

  window.lectureMagiqueGame = {
    start
  };
})();
