(function () {
  'use strict';

  const OPTION_ICONS = ['📘', '📗', '📙', '📕'];

  const LEVELS = [
    {
      level: 1,
      reward: { stars: 8, coins: 5 },
      activities: [
        { type: 'word-image', illustration: '🦊', prompt: 'Quel mot correspond à ce dessin ?', options: ['renard', 'lion', 'éléphant'], answer: 0, hint: 'Il a une queue rousse.', success: 'Bravo, renard est correct !' },
        { type: 'word-image', illustration: '🍎', prompt: 'Quel mot correspond à ce dessin ?', options: ['poire', 'banane', 'pomme'], answer: 2, hint: 'Ce fruit est rouge.', success: 'Oui, c\'est la pomme !' },
        { type: 'fill', sentence: 'La ___ boit du lait.', options: ['chatte', 'voiture', 'chaise'], answer: 0, hint: 'Cherche un animal.', success: 'Bien vu !' },
        { type: 'rhyme', base: 'chat', options: ['rat', 'nez', 'pied'], answer: 0, hint: 'Quel mot a le même son final ?', success: 'Rat rime avec chat !' },
        { type: 'start-sound', letter: 'p', options: ['pomme', 'tomate', 'cerise'], answer: 0, hint: 'Quel mot commence par le son P ?', success: 'Pomme commence par P !' }
      ]
    },
    {
      level: 2,
      reward: { stars: 9, coins: 6 },
      activities: [
        { type: 'word-image', illustration: '🐸', prompt: 'Quel mot correspond à ce dessin ?', options: ['grenouille', 'requin', 'girafe'], answer: 0, hint: 'Elle saute dans les étangs.', success: 'Grenouille réussi !' },
        { type: 'fill', sentence: 'La fée agite sa ___ magique.', options: ['baguette', 'chaussure', 'maison'], answer: 0, hint: 'Elle brille et lance des étincelles.', success: 'Tu as trouvé la baguette !' },
        { type: 'rhyme', base: 'montagne', options: ['campagne', 'écureuil', 'nuage'], answer: 0, hint: 'Quel mot termine presque pareil ?', success: 'Campagne rime avec montagne.' },
        { type: 'start-sound', letter: 'b', options: ['robe', 'ballon', 'lune'], answer: 1, hint: 'Quel mot commence par b ?', success: 'Ballon commence par b !' }
      ]
    },
    {
      level: 3,
      reward: { stars: 10, coins: 6 },
      activities: [
        { type: 'rhyme', base: 'glace', options: ['place', 'souris', 'lapin'], answer: 0, hint: 'Quel mot finit comme glace ?', success: 'Place rime avec glace.' },
        { type: 'fill', sentence: 'La licorne traverse la ___ enchantée.', options: ['forêt', 'chaise', 'fourchette'], answer: 0, hint: 'Un lieu magique avec des arbres.', success: 'Forêt enchantée !' },
        { type: 'word-image', illustration: '🦉', prompt: 'Quel mot correspond à ce dessin ?', options: ['hibou', 'dauphin', 'requin'], answer: 0, hint: 'Il veille la nuit.', success: 'Hibou bien joué !' },
        { type: 'start-sound', letter: 'm', options: ['montagne', 'banane', 'rue'], answer: 0, hint: 'Quel mot commence par le son M ?', success: 'Montagne commence par M.' }
      ]
    },
    {
      level: 4,
      reward: { stars: 12, coins: 7 },
      activities: [
        { type: 'word-image', illustration: '🪄', prompt: 'Quel mot correspond à ce dessin ?', options: ['baguette', 'camion', 'piano'], answer: 0, hint: 'Elle jette des étincelles.', success: 'Baguette magique !' },
        { type: 'fill', sentence: 'Le dragon garde un coffret plein de ___.', options: ['trésors', 'nuages', 'sandwichs'], answer: 0, hint: 'Des bijoux brillants.', success: 'Trésors scintillants !' },
        { type: 'rhyme', base: 'fée', options: ['clé', 'pied', 'nez'], answer: 0, hint: 'Quel mot a le même son final ?', success: 'Clé rime avec fée.' },
        { type: 'start-sound', letter: 'v', options: ['violette', 'lampe', 'orange'], answer: 0, hint: 'Quel mot commence par le son V ?', success: 'Violette commence par V.' }
      ]
    },
    {
      level: 5,
      reward: { stars: 13, coins: 8 },
      activities: [
        { type: 'fill', sentence: 'Les enfants décorent une ___ en papier.', options: ['lanterne', 'glace', 'chaussette'], answer: 0, hint: 'Elle s\'illumine le soir.', success: 'Lanterne bien décorée !' },
        { type: 'word-image', illustration: '🐧', prompt: 'Quel mot correspond à ce dessin ?', options: ['pingouin', 'pigeon', 'panda'], answer: 0, hint: 'Il glisse sur la glace.', success: 'Pingouin adorable !' },
        { type: 'rhyme', base: 'magie', options: ['vie', 'vent', 'son'], answer: 0, hint: 'Quel mot finit comme magie ?', success: 'Vie rime avec magie.' },
        { type: 'start-sound', letter: 'ch', options: ['chapeau', 'sapin', 'table'], answer: 0, hint: 'Quel mot commence par le son ch ?', success: 'Chapeau commence par ch.' }
      ]
    },
    {
      level: 6,
      reward: { stars: 14, coins: 9 },
      activities: [
        { type: 'fill', sentence: 'La princesse lit une histoire sur un ___ de velours.', options: ['trône', 'table', 'rideau'], answer: 0, hint: 'Elle est assise dessus.', success: 'Trône confortable !' },
        { type: 'rhyme', base: 'souris', options: ['paradis', 'soleil', 'poisson'], answer: 0, hint: 'Cherche un mot qui sonne pareil.', success: 'Paradis rime avec souris.' },
        { type: 'start-sound', letter: 'gr', options: ['grenouille', 'avion', 'citron'], answer: 0, hint: 'Quel mot commence par gr ?', success: 'Grenouille commence par gr.' },
        { type: 'word-image', illustration: '🕯️', prompt: 'Quel mot correspond à ce dessin ?', options: ['bougie', 'planète', 'rideau'], answer: 0, hint: 'Elle éclaire doucement.', success: 'Bougie brillante !' }
      ]
    },
    {
      level: 7,
      reward: { stars: 15, coins: 10 },
      activities: [
        { type: 'rhyme', base: 'cloche', options: ['poche', 'nez', 'biche'], answer: 0, hint: 'Quel mot finit comme cloche ?', success: 'Poche rime avec cloche.' },
        { type: 'fill', sentence: 'Le chevalier trouve un ___ secret.', options: ['passage', 'chocolat', 'doigt'], answer: 0, hint: 'Un chemin caché.', success: 'Passage secret découvert !' },
        { type: 'start-sound', letter: 'pl', options: ['plume', 'bateau', 'soldat'], answer: 0, hint: 'Quel mot commence par pl ?', success: 'Plume magique !' },
        { type: 'word-image', illustration: '🧁', prompt: 'Quel mot correspond à ce dessin ?', options: ['cupcake', 'sandwich', 'soupe'], answer: 0, hint: 'Un petit gâteau décoré.', success: 'Cupcake gourmand !' }
      ]
    },
    {
      level: 8,
      reward: { stars: 16, coins: 11 },
      activities: [
        { type: 'fill', sentence: 'Les étoiles brillent comme des ___ en sucre.', options: ['perles', 'pieds', 'fleurs'], answer: 0, hint: 'De petites boules brillantes.', success: 'Perles scintillantes !' },
        { type: 'rhyme', base: 'glisser', options: ['danser', 'regarder', 'chanter'], answer: 0, hint: 'Quel mot se termine comme glisser ?', success: 'Danser rime avec glisser.' },
        { type: 'start-sound', letter: 'fr', options: ['fraise', 'maison', 'feu'], answer: 0, hint: 'Quel mot commence par fr ?', success: 'Fraise commence par fr.' },
        { type: 'word-image', illustration: '🧚', prompt: 'Quel mot correspond à ce dessin ?', options: ['fée', 'chien', 'poule'], answer: 0, hint: 'Elle a des ailes.', success: 'Fée radieuse !' }
      ]
    },
    {
      level: 9,
      reward: { stars: 18, coins: 12 },
      activities: [
        { type: 'rhyme', base: 'coquille', options: ['fille', 'bateau', 'drap'], answer: 0, hint: 'Quel mot finit comme coquille ?', success: 'Fille rime avec coquille.' },
        { type: 'fill', sentence: 'Le vent murmure une ___ secrète.', options: ['chanson', 'fourche', 'pluie'], answer: 0, hint: 'On l\'entend et on peut la chanter.', success: 'Chanson secrète !' },
        { type: 'start-sound', letter: 'cr', options: ['crayon', 'lampe', 'tour'], answer: 0, hint: 'Quel mot commence par cr ?', success: 'Crayon commence par cr.' },
        { type: 'word-image', illustration: '🦋', prompt: 'Quel mot correspond à ce dessin ?', options: ['papillon', 'mouche', 'grenouille'], answer: 0, hint: 'Ses ailes sont colorées.', success: 'Papillon léger !' }
      ]
    },
    {
      level: 10,
      reward: { stars: 20, coins: 13 },
      activities: [
        { type: 'fill', sentence: 'Les amis inventent une ___ étincelante.', options: ['histoire', 'chaise', 'loupe'], answer: 0, hint: 'On la lit avec plaisir.', success: 'Histoire étincelante !' },
        { type: 'rhyme', base: 'diamant', options: ['géant', 'nez', 'pépin'], answer: 0, hint: 'Quel mot finit comme diamant ?', success: 'Géant rime avec diamant.' },
        { type: 'start-sound', letter: 'sc', options: ['scintille', 'melon', 'tomate'], answer: 0, hint: 'Quel mot commence par sc ?', success: 'Scintille commence par sc.' },
        { type: 'word-image', illustration: '🪐', prompt: 'Quel mot correspond à ce dessin ?', options: ['planète', 'casserole', 'cactus'], answer: 0, hint: 'Elle tourne autour du soleil.', success: 'Planète brillante !' }
      ]
    }
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

    const controls = document.createElement('div');
    controls.className = 'lecture-magique__controls';
    const nextBtn = document.createElement('button');
    nextBtn.className = 'lecture-magique__next-btn';
    nextBtn.type = 'button';
    nextBtn.textContent = 'Continuer l\'histoire';
    nextBtn.disabled = true;
    controls.appendChild(nextBtn);
    wrapper.appendChild(controls);

    content.appendChild(wrapper);

    context.configureBackButton('Retour aux niveaux', () => {
      context.setAnsweredStatus('in-progress');
      context.showLevelMenu('lecture-magique');
    });

    context.setAnsweredStatus('in-progress');

    nextBtn.addEventListener('click', () => {
      state.index += 1;
      if (state.index < state.levelData.activities.length) {
        renderActivity(context, state, activityZone, feedback, progressFill, nextBtn);
      } else {
        finishLevel(context, state, feedback, nextBtn, progressFill);
      }
    });

    renderActivity(context, state, activityZone, feedback, progressFill, nextBtn);
  }

  function renderActivity(context, state, activityZone, feedback, progressFill, nextBtn) {
    clearTimeout(state.feedbackTimer);
    feedback.classList.add('is-hidden');
    feedback.textContent = '';
    nextBtn.disabled = true;

    const activity = state.levelData.activities[state.index];
    const total = state.levelData.activities.length;
    const current = state.index + 1;

    activityZone.innerHTML = '';

    const question = document.createElement('div');
    question.className = 'lecture-magique__prompt';
    question.textContent = activity.prompt || buildPrompt(activity);
    activityZone.appendChild(question);

    const illustration = buildIllustration(activity);
    if (illustration) {
      activityZone.appendChild(illustration);
    }

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

      option.addEventListener('click', () => handleReadingAnswer(context, state, activity, idx, option, options, feedback, nextBtn));
      options.appendChild(option);
    });

    activityZone.appendChild(options);

    const percent = Math.round((current - 1) / total * 100);
    progressFill.style.width = `${percent}%`;

    context.speakText(activity.speak || question.textContent);
  }

  function handleReadingAnswer(context, state, activity, selectedIndex, button, optionsContainer, feedback, nextBtn) {
    if (button.disabled) { return; }
    const isCorrect = selectedIndex === activity.answer;

    if (isCorrect) {
      context.playPositiveSound();
      context.awardReward(state.levelData.reward.stars, state.levelData.reward.coins);
      context.updateUI?.();
      button.classList.add('is-correct');
      disableOptions(optionsContainer);
      showReadingFeedback(feedback, 'positive', activity.success || 'Super lecture !');
      nextBtn.disabled = false;
      nextBtn.focus();
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
    nextBtn.disabled = true;
    showReadingFeedback(feedback, 'positive', '✨ Tu as lu toute l\'histoire !');

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
      return `Quel mot rime avec "${activity.base}" ?`;
    }
    if (activity.type === 'start-sound') {
      return `Quel mot commence par le son "${activity.letter}" ?`;
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
    return sentence.replace('___', '<span class="lecture-magique__blank">___</span>');
  }

  window.lectureMagiqueGame = {
    start
  };
})();
