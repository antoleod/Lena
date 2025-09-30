(function () {
  'use strict';

  const OPTION_ICONS = ['🧠', '🔍', '🌟', '🎯'];

  const LEVELS = [
    {
      level: 1,
      reward: { stars: 9, coins: 6 },
      activities: [
        { type: 'sequence', sequence: ['🐸', '🐸', '🐙', '🐸', '?'], options: ['🐙', '🐸', '🐟'], answer: 0, hint: 'Observe le motif qui revient.', success: 'Bonne suite !' },
        { type: 'odd', prompt: 'Quel élément ne fait pas partie du groupe ?', options: ['🍎', '🍌', '🚗'], answer: 2, hint: 'Deux sont des fruits.', success: 'Exact, la voiture est différente.' },
        { type: 'compare', left: '3', right: '5', options: ['<', '>', '='], answer: 0, hint: 'Compare les nombres.', success: '3 est plus petit que 5.' },
        { type: 'pattern', pattern: ['🔺', '🔵', '🔺', '🔵', '?'], options: ['🔺', '🟢', '⚪'], answer: 0, hint: 'Les formes alternent.', success: 'Triangle puis cercle, bravo !' },
        { type: 'sequence', sequence: ['2', '4', '6', '?'], options: ['7', '8', '9'], answer: 1, hint: 'On ajoute toujours 2.', success: 'Suite numérique parfaite !' },
        { type: 'odd', prompt: 'Trouve l\'intrus.', options: ['🐱', '🐶', '🌧️'], answer: 2, hint: 'Deux sont des animaux.', success: 'La pluie n\'est pas un animal.' }
      ]
    },
    {
      level: 2,
      reward: { stars: 10, coins: 6 },
      activities: [
        { type: 'sequence', sequence: ['🍓', '🍓', '🍍', '🍓', '?'], options: ['🍍', '🍓', '🍎'], answer: 0, hint: 'Un fruit différent revient régulièrement.', success: 'Ananas complète la suite !' },
        { type: 'pattern', pattern: ['⬛', '⬛', '⬜', '⬛', '?'], options: ['⬛', '⬜', '🔶'], answer: 1, hint: 'Deux noirs suivis d\'un blanc.', success: 'Blanc était attendu !' },
        { type: 'compare', left: '7', right: '7', options: ['<', '>', '='], answer: 2, hint: 'Ils sont identiques.', success: 'Égalité parfaite !' },
        { type: 'shadow', base: '🦄', options: ['🦄', '🐴', '🦓'], answer: 0, hint: 'Quelle silhouette correspond ?', success: 'Silhouette magique trouvée.' },
        { type: 'odd', prompt: 'Quel objet est à sa place ?', options: ['🪄', '📚', '🧹'], answer: 1, hint: 'Deux servent à la magie.', success: 'Le livre est spécial !' },
        { type: 'sequence', sequence: ['1', '3', '5', '?'], options: ['6', '7', '8'], answer: 1, hint: 'On ajoute 2 chaque fois.', success: '7 complète la suite !' }
      ]
    },
    {
      level: 3,
      reward: { stars: 11, coins: 7 },
      activities: [
        { type: 'pattern', pattern: ['🔺', '🔺', '🔵', '🔵', '?'], options: ['🔺', '🔵', '🟢'], answer: 0, hint: 'Deux triangles, deux cercles...', success: 'Deux triangles encore !' },
        { type: 'sequence', sequence: ['10', '8', '6', '?'], options: ['4', '5', '7'], answer: 0, hint: 'On retire deux.', success: '4 est correct.' },
        { type: 'odd', prompt: 'Choisis l\'intrus.', options: ['🦊', '🐺', '🐠'], answer: 2, hint: 'Deux vivent dans la forêt.', success: 'Le poisson vit dans l\'eau.' },
        { type: 'shadow', base: '🧁', options: ['🧁', '🍰', '🍪'], answer: 0, hint: 'Même silhouette arrondie.', success: 'Cupcake trouvé !' },
        { type: 'compare', left: '9', right: '11', options: ['<', '>', '='], answer: 0, hint: '9 est plus petit.', success: 'Tu as bien comparé !' },
        { type: 'sequence', sequence: ['⚡', '⚡', '🌟', '⚡', '?'], options: ['⚡', '🌟', '🔥'], answer: 1, hint: 'L\'étoile revient.', success: 'Une nouvelle étoile !' }
      ]
    },
    {
      level: 4,
      reward: { stars: 12, coins: 8 },
      activities: [
        { type: 'sequence', sequence: ['5', '10', '15', '?'], options: ['18', '20', '25'], answer: 1, hint: 'On ajoute 5.', success: '20 est parfait !' },
        { type: 'pattern', pattern: ['🔷', '🔶', '🔷', '🔶', '?'], options: ['🔷', '🔶', '⬛'], answer: 0, hint: 'Les formes alternent.', success: 'Encore un losange bleu !' },
        { type: 'shadow', base: '🐼', options: ['🐼', '🐨', '🐻'], answer: 0, hint: 'Cherche le noir et blanc.', success: 'Panda repéré !' },
        { type: 'odd', prompt: 'Qui est l\'intrus ?', options: ['🎻', '🎷', '🍩'], answer: 2, hint: 'Deux sont des instruments.', success: 'Le donut est gourmand mais pas un instrument !' },
        { type: 'compare', left: '4 + 3', right: '8', options: ['<', '>', '='], answer: 0, hint: 'Calcule le premier côté.', success: '7 est plus petit que 8.' },
        { type: 'sequence', sequence: ['🟢', '🟢', '🟣', '🟢', '?'], options: ['🟢', '🟣', '🟠'], answer: 1, hint: 'Une couleur différente revient.', success: 'Violet brillant !' }
      ]
    },
    {
      level: 5,
      reward: { stars: 13, coins: 8 },
      activities: [
        { type: 'pattern', pattern: ['🐱', '🐱', '🐾', '🐱', '?'], options: ['🐾', '🐱', '🐶'], answer: 0, hint: 'On voit des traces toutes les deux cases.', success: 'Empreinte retrouvée !' },
        { type: 'sequence', sequence: ['12', '15', '18', '?'], options: ['19', '21', '22'], answer: 1, hint: 'On ajoute 3.', success: '21 complète la suite.' },
        { type: 'odd', prompt: 'Quel symbole ne correspond pas ?', options: ['⬜', '⬛', '💧'], answer: 2, hint: 'Deux sont des carrés.', success: 'La goutte est différente.' },
        { type: 'shadow', base: '🦋', options: ['🦋', '🐞', '🪲'], answer: 0, hint: 'Cherche les ailes symétriques.', success: 'Papillon trouvé !' },
        { type: 'compare', left: '14', right: '9 + 6', options: ['<', '>', '='], answer: 2, hint: 'Calcule 9 + 6.', success: 'Les deux valent 15.' },
        { type: 'sequence', sequence: ['🧁', '🍪', '🧁', '?'], options: ['🍪', '🧁', '🍩'], answer: 0, hint: 'Biscuits et cupcakes alternent.', success: 'Encore un biscuit !' }
      ]
    },
    {
      level: 6,
      reward: { stars: 14, coins: 9 },
      activities: [
        { type: 'sequence', sequence: ['30', '25', '20', '?'], options: ['15', '18', '22'], answer: 0, hint: 'On retire 5.', success: '15 est correct.' },
        { type: 'pattern', pattern: ['🔺', '🔺', '🔺', '🔵', '?'], options: ['🔺', '🔵', '🟢'], answer: 0, hint: 'Trois triangles avant le cercle.', success: 'Triangle attendu !' },
        { type: 'shadow', base: '🍄', options: ['🍄', '🍅', '🍋'], answer: 0, hint: 'Forme ronde avec pied fin.', success: 'Champignon repéré.' },
        { type: 'odd', prompt: 'Qui est différent ?', options: ['🚀', '✈️', '🛶'], answer: 2, hint: 'Deux volent dans le ciel.', success: 'Le canoë ne vole pas !' },
        { type: 'compare', left: '18', right: '3 × 6', options: ['<', '>', '='], answer: 2, hint: '3 × 6 = ?', success: '18 égale 18.' },
        { type: 'sequence', sequence: ['🌞', '🌙', '🌞', '?'], options: ['🌙', '⭐', '☁️'], answer: 0, hint: 'Soleil et lune se relaient.', success: 'La lune revient !' }
      ]
    },
    {
      level: 7,
      reward: { stars: 15, coins: 10 },
      activities: [
        { type: 'pattern', pattern: ['🍎', '🍎', '🍎', '🍇', '?'], options: ['🍇', '🍎', '🍊'], answer: 0, hint: 'Trois pommes avant le raisin.', success: 'Encore un raisin !' },
        { type: 'sequence', sequence: ['4', '9', '14', '?'], options: ['18', '19', '20'], answer: 1, hint: 'On ajoute 5.', success: '19 complète la suite.' },
        { type: 'odd', prompt: 'Quel symbole n\'est pas comme les autres ?', options: ['💧', '🌧️', '🔥'], answer: 2, hint: 'Deux sont liés à l\'eau.', success: 'Le feu est différent.' },
        { type: 'shadow', base: '🦔', options: ['🦔', '🐿️', '🐁'], answer: 0, hint: 'Cherche les piques.', success: 'Le hérisson a des piques.' },
        { type: 'compare', left: '25', right: '30 - 4', options: ['<', '>', '='], answer: 0, hint: 'Calcule 30 - 4.', success: '25 est plus petit que 26.' },
        { type: 'sequence', sequence: ['⭐', '⭐', '🌟', '⭐', '?'], options: ['🌟', '⭐', '✨'], answer: 0, hint: 'Une étoile brillante revient.', success: 'Une grande étoile !' }
      ]
    },
    {
      level: 8,
      reward: { stars: 17, coins: 11 },
      activities: [
        { type: 'sequence', sequence: ['6', '12', '18', '?'], options: ['20', '24', '26'], answer: 1, hint: 'On ajoute 6.', success: '24 complète la suite.' },
        { type: 'pattern', pattern: ['⬜', '⬜', '⬛', '⬛', '?'], options: ['⬜', '⬛', '🟦'], answer: 0, hint: 'Deux blancs puis deux noirs.', success: 'Retour aux carrés blancs.' },
        { type: 'shadow', base: '🎠', options: ['🎠', '🦓', '🐴'], answer: 0, hint: 'Cheval de manège.', success: 'Manège trouvé.' },
        { type: 'odd', prompt: 'Qui est l\'intrus ?', options: ['🌳', '🌲', '🌊'], answer: 2, hint: 'Deux sont des arbres.', success: 'L\'eau est différente.' },
        { type: 'compare', left: '4 × 5', right: '18', options: ['<', '>', '='], answer: 1, hint: '4 × 5 = ?', success: '20 est plus grand que 18.' },
        { type: 'sequence', sequence: ['🧙', '🧙', '🧚', '🧙', '?'], options: ['🧚', '🧙', '🧝'], answer: 0, hint: 'Une amie féérique revient.', success: 'La fée revient !' }
      ]
    },
    {
      level: 9,
      reward: { stars: 18, coins: 12 },
      activities: [
        { type: 'sequence', sequence: ['40', '35', '30', '?'], options: ['26', '25', '28'], answer: 1, hint: 'On retire 5.', success: '25 est la bonne réponse.' },
        { type: 'pattern', pattern: ['🎈', '🎁', '🎈', '🎁', '?'], options: ['🎈', '🎁', '🎊'], answer: 0, hint: 'Ballon puis cadeau.', success: 'Encore un ballon.' },
        { type: 'shadow', base: '🚲', options: ['🚲', '🏍️', '🚗'], answer: 0, hint: 'Deux roues fines.', success: 'Vélo choisi.' },
        { type: 'odd', prompt: 'Quel élément n\'appartient pas ?', options: ['🧁', '🍭', '🧃'], answer: 2, hint: 'Deux sont des douceurs solides.', success: 'Le jus est liquide.' },
        { type: 'compare', left: '9 + 12', right: '22', options: ['<', '>', '='], answer: 1, hint: 'Calcule 9 + 12.', success: '21 est plus petit que 22.' },
        { type: 'sequence', sequence: ['✨', '✨', '💫', '✨', '?'], options: ['💫', '✨', '⭐'], answer: 0, hint: 'Une étoile filante revient.', success: '💫 pour gagner !' }
      ]
    },
    {
      level: 10,
      reward: { stars: 20, coins: 13 },
      activities: [
        { type: 'sequence', sequence: ['8', '16', '24', '?'], options: ['30', '32', '36'], answer: 1, hint: 'On ajoute 8.', success: '32 complète la suite.' },
        { type: 'pattern', pattern: ['⚙️', '⚙️', '🔩', '⚙️', '?'], options: ['⚙️', '🔩', '🔧'], answer: 2, hint: 'Une pièce différente apparaît.', success: 'La clé complète la série.' },
        { type: 'shadow', base: '🛸', options: ['🛸', '✈️', '🚀'], answer: 0, hint: 'Forme ovale flottante.', success: 'Ovni détecté !' },
        { type: 'odd', prompt: 'Quel symbole est différent ?', options: ['🪄', '✨', '🍀'], answer: 2, hint: 'Deux sont liés à la magie.', success: 'Le trèfle est particulier.' },
        { type: 'compare', left: '6 × 6', right: '40', options: ['<', '>', '='], answer: 1, hint: '6 × 6 = ?', success: '36 est plus petit que 40.' },
        { type: 'sequence', sequence: ['🧠', '💡', '🧠', '?'], options: ['💡', '🧠', '🪄'], answer: 0, hint: 'Idée lumineuse entre deux cerveaux.', success: 'Encore une ampoule !' }
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

    context.clearGameClasses?.(['raisonnement-magique']);
    renderScene(context, state);
  }

  function renderScene(context, state) {
    const content = context.content;
    content.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'raisonnement-magique fx-bounce-in-down';

    const header = document.createElement('div');
    header.className = 'raisonnement-magique__header';

    const title = document.createElement('h2');
    title.className = 'raisonnement-magique__title';
    title.textContent = `Raisonnement Magique — Niveau ${state.levelData.level}`;
    header.appendChild(title);

    const subtitle = document.createElement('p');
    subtitle.className = 'raisonnement-magique__subtitle';
    subtitle.textContent = 'Observe, réfléchis et sélectionne l\'élément qui complète la logique.';
    header.appendChild(subtitle);

    const progress = document.createElement('div');
    progress.className = 'raisonnement-magique__progress';
    const fill = document.createElement('div');
    fill.className = 'raisonnement-magique__progress-fill';
    progress.appendChild(fill);
    header.appendChild(progress);

    wrapper.appendChild(header);

    const activityZone = document.createElement('div');
    activityZone.className = 'raisonnement-magique__activity';
    wrapper.appendChild(activityZone);

    const feedback = document.createElement('div');
    feedback.className = 'raisonnement-magique__feedback is-hidden';
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    wrapper.appendChild(feedback);

    const controls = document.createElement('div');
    controls.className = 'raisonnement-magique__controls';
    const nextBtn = document.createElement('button');
    nextBtn.className = 'raisonnement-magique__next-btn';
    nextBtn.type = 'button';
    nextBtn.textContent = 'Prochaine énigme';
    nextBtn.disabled = true;
    controls.appendChild(nextBtn);
    wrapper.appendChild(controls);

    content.appendChild(wrapper);

    context.configureBackButton('Retour aux niveaux', () => {
      context.setAnsweredStatus('in-progress');
      context.showLevelMenu('raisonnement');
    });

    context.setAnsweredStatus('in-progress');

    nextBtn.addEventListener('click', () => {
      state.index += 1;
      if (state.index < state.levelData.activities.length) {
        renderActivity(context, state, activityZone, feedback, fill, nextBtn);
      } else {
        finishLevel(context, state, feedback, nextBtn, fill);
      }
    });

    renderActivity(context, state, activityZone, feedback, fill, nextBtn);
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

    const prompt = document.createElement('div');
    prompt.className = 'raisonnement-magique__prompt';
    prompt.textContent = buildPrompt(activity);
    activityZone.appendChild(prompt);

    const visual = buildVisual(activity);
    if (visual) {
      activityZone.appendChild(visual);
    }

    const options = document.createElement('div');
    options.className = 'raisonnement-magique__options';

    activity.options.forEach((value, idx) => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'raisonnement-magique__option fx-bounce-in-down';
      option.style.animationDelay = `${idx * 0.1}s`;

      const icon = document.createElement('span');
      icon.className = 'raisonnement-magique__option-icon';
      icon.textContent = OPTION_ICONS[idx % OPTION_ICONS.length];

      const label = document.createElement('span');
      label.className = 'raisonnement-magique__option-label';
      label.textContent = value;

      option.appendChild(icon);
      option.appendChild(label);

      option.addEventListener('click', () => handleAnswer(context, state, activity, idx, option, options, feedback, nextBtn));
      options.appendChild(option);
    });

    activityZone.appendChild(options);

    const percent = Math.round((current - 1) / total * 100);
    progressFill.style.width = `${percent}%`;

    context.speakText(activity.speak || prompt.textContent);
  }

  function handleAnswer(context, state, activity, selectedIndex, button, optionsContainer, feedback, nextBtn) {
    if (button.disabled) { return; }
    const isCorrect = selectedIndex === activity.answer;

    if (isCorrect) {
      context.playPositiveSound();
      context.awardReward(state.levelData.reward.stars, state.levelData.reward.coins);
      context.updateUI?.();
      button.classList.add('is-correct');
      disableButtons(optionsContainer);
      showFeedback(feedback, 'positive', activity.success || 'Bonne logique !');
      nextBtn.disabled = false;
      nextBtn.focus();
    } else {
      context.playNegativeSound();
      context.awardReward(0, -3);
      context.updateUI?.();
      button.classList.add('is-wrong');
      button.disabled = true;
      showFeedback(feedback, 'negative', activity.hint || 'Observe encore le motif.');
      setTimeout(() => button.classList.remove('is-wrong'), 600);
    }
  }

  function disableButtons(container) {
    Array.from(container.children).forEach(child => { child.disabled = true; });
  }

  function finishLevel(context, state, feedback, nextBtn, progressFill) {
    progressFill.style.width = '100%';
    nextBtn.disabled = true;
    showFeedback(feedback, 'positive', '🧩 Niveau de logique terminé !');
    context.markLevelCompleted();
    context.showSuccessMessage('Formidable logique !');
    context.showConfetti();
    context.setAnsweredStatus('completed');

    state.feedbackTimer = setTimeout(() => {
      context.showLevelMenu('raisonnement');
    }, 1600);
  }

  function buildPrompt(activity) {
    switch (activity.type) {
      case 'sequence':
        return 'Quelle est la pièce qui complète la suite ?';
      case 'pattern':
        return 'Quel élément doit apparaître ensuite ?';
      case 'odd':
        return activity.prompt || 'Trouve l\'intrus.';
      case 'compare':
        return 'Quel signe rend la comparaison vraie ?';
      case 'shadow':
        return 'Quelle silhouette correspond ?';
      default:
        return 'Résous l\'énigme.';
    }
  }

  function buildVisual(activity) {
    if (activity.type === 'sequence' || activity.type === 'pattern') {
      const container = document.createElement('div');
      container.className = 'raisonnement-magique__sequence';
      activity.sequence?.forEach(item => {
        const cell = document.createElement('span');
        cell.className = 'raisonnement-magique__sequence-item';
        cell.textContent = item;
        container.appendChild(cell);
      });
      activity.pattern?.forEach(item => {
        const cell = document.createElement('span');
        cell.className = 'raisonnement-magique__sequence-item';
        cell.textContent = item;
        container.appendChild(cell);
      });
      return container;
    }
    if (activity.type === 'compare') {
      const container = document.createElement('div');
      container.className = 'raisonnement-magique__compare';
      const left = document.createElement('span');
      left.textContent = activity.left;
      const placeholder = document.createElement('span');
      placeholder.textContent = '⬜';
      const right = document.createElement('span');
      right.textContent = activity.right;
      container.append(left, placeholder, right);
      return container;
    }
    if (activity.type === 'shadow') {
      const container = document.createElement('div');
      container.className = 'raisonnement-magique__shadow';
      container.textContent = activity.base;
      return container;
    }
    return null;
  }

  function showFeedback(feedback, variant, message) {
    feedback.classList.remove('is-hidden', 'is-positive', 'is-negative');
    feedback.classList.add(variant === 'positive' ? 'is-positive' : 'is-negative');
    feedback.textContent = message;
  }

  window.raisonnementGame = {
    start
  };
})();
