(function () {
  'use strict';

  const LEVELS = [
    { level: 1, title: "Qui suis-je ?", reward: { stars: 8, coins: 5 }, activities: [
        { sentence: '___ une fille.', blank: 'Je suis', options: ['Je suis', 'Je vais', 'Je fais'], answer: 0 },
        { sentence: '___ à l\'école.', blank: 'Je vais', options: ['Je suis', 'Je vais', 'Il y a'], answer: 1 },
        { sentence: '___ mes devoirs.', blank: 'Je fais', options: ['Je suis', 'Il faut', 'Je fais'], answer: 2 },
        { sentence: '___ un livre.', blank: 'Je lis', options: ['Je lis', 'Je suis', 'Je vais'], answer: 0 },
        { sentence: '___ contente.', blank: 'Je suis', options: ['Je fais', 'Je suis', 'Il y a'], answer: 1 }
    ]},
    { level: 2, title: "Actions du jour", reward: { stars: 10, coins: 6 }, activities: [
        { sentence: 'Le matin, ___ mon petit-déjeuner.', blank: 'je prends', options: ['je suis', 'je prends', 'je vais'], answer: 1 },
        { sentence: '___ jouer dehors.', blank: 'Je vais', options: ['Je suis', 'Je vais', 'Il faut'], answer: 1 },
        { sentence: '___ un dessin pour maman.', blank: 'Je fais', options: ['Il y a', 'Je fais', 'Je suis'], answer: 1 },
        { sentence: '___ un grand château de sable.', blank: 'Je construis', options: ['Je lis', 'Je construis', 'Je suis'], answer: 1 },
        { sentence: 'Le soir, ___ au lit.', blank: 'je vais', options: ['je fais', 'il faut', 'je vais'], answer: 2 }
    ]},
    { level: 3, title: "Il et Elle", reward: { stars: 12, coins: 7 }, activities: [
        { sentence: '___ est mon ami.', blank: 'Il', options: ['Il', 'Elle', 'Je'], answer: 0 },
        { sentence: '___ aime danser.', blank: 'Elle', options: ['Il', 'Elle', 'Tu'], answer: 1 },
        { sentence: '___ court très vite.', blank: 'Il', options: ['Je', 'Il', 'Elle'], answer: 1 },
        { sentence: '___ a une jolie robe.', blank: 'Elle', options: ['Elle', 'Il', 'Tu'], answer: 0 },
        { sentence: '___ joue au ballon.', blank: 'Il', options: ['Elle', 'Il', 'Je'], answer: 1 }
    ]},
    { level: 4, title: "Besoins et Présence", reward: { stars: 14, coins: 8 }, activities: [
        { sentence: 'Pour dessiner, ___ un crayon.', blank: 'il faut', options: ['il y a', 'il faut', 'je suis'], answer: 1 },
        { sentence: 'Dans le jardin, ___ des fleurs.', blank: 'il y a', options: ['il faut', 'il y a', 'je vais'], answer: 1 },
        { sentence: 'Pour dormir, ___ un lit.', blank: 'il faut', options: ['je suis', 'il faut', 'il y a'], answer: 1 },
        { sentence: 'Sur la table, ___ un gâteau.', blank: 'il y a', options: ['il y a', 'il faut', 'je fais'], answer: 0 },
        { sentence: 'Pour boire, ___ de l\'eau.', blank: 'il faut', options: ['il faut', 'je suis', 'il y a'], answer: 0 }
    ]},
    { level: 5, title: "Petites prépositions", reward: { stars: 15, coins: 9 }, activities: [
        { sentence: 'Je vais ___ la mamie.', blank: 'chez', options: ['chez', 'avec', 'pour'], answer: 0 },
        { sentence: 'Je joue ___ mon frère.', blank: 'avec', options: ['pour', 'dans', 'avec'], answer: 2 },
        { sentence: 'Le chat est ___ la boîte.', blank: 'dans', options: ['avec', 'dans', 'chez'], answer: 1 },
        { sentence: 'C\'est un cadeau ___ toi.', blank: 'pour', options: ['pour', 'chez', 'avec'], answer: 0 },
        { sentence: 'Je me promène ___ le parc.', blank: 'dans', options: ['chez', 'dans', 'pour'], answer: 1 }
    ]},
    { level: 6, title: "Dessus ou dessous ?", reward: { stars: 16, coins: 10 }, activities: [
        { sentence: 'Le livre est ___ la table.', blank: 'sur', options: ['sur', 'sous', 'dans'], answer: 0 },
        { sentence: 'Le chat dort ___ le lit.', blank: 'sous', options: ['sur', 'avec', 'sous'], answer: 2 },
        { sentence: 'Le crayon est ___ la trousse.', blank: 'dans', options: ['dans', 'sur', 'sous'], answer: 0 },
        { sentence: 'L\'oiseau chante ___ la branche.', blank: 'sur', options: ['sous', 'sur', 'chez'], answer: 1 },
        { sentence: 'Mes chaussures sont ___ le canapé.', blank: 'sous', options: ['sur', 'sous', 'dans'], answer: 1 }
    ]},
    { level: 7, title: "Devant ou derrière ?", reward: { stars: 17, coins: 11 }, activities: [
        { sentence: 'La voiture est garée ___ la maison.', blank: 'devant', options: ['devant', 'derrière', 'sous'], answer: 0 },
        { sentence: 'Le jardin est ___ la maison.', blank: 'derrière', options: ['devant', 'derrière', 'sur'], answer: 1 },
        { sentence: 'Je me cache ___ le rideau.', blank: 'derrière', options: ['devant', 'sur', 'derrière'], answer: 2 },
        { sentence: 'Le chien attend ___ la porte.', blank: 'devant', options: ['devant', 'sous', 'derrière'], answer: 0 },
        { sentence: 'Le trésor est caché ___ l\'arbre.', blank: 'derrière', options: ['devant', 'derrière', 'sur'], answer: 1 }
    ]},
    { level: 8, title: "Nous et Vous", reward: { stars: 18, coins: 12 }, activities: [
        { sentence: '___ allons à la plage.', blank: 'Nous', options: ['Nous', 'Vous', 'Ils'], answer: 0 },
        { sentence: '___ êtes très gentils.', blank: 'Vous', options: ['Nous', 'Vous', 'Elles'], answer: 1 },
        { sentence: '___ aimons le chocolat.', blank: 'Nous', options: ['Vous', 'Ils', 'Nous'], answer: 2 },
        { sentence: '___ jouez bien ensemble.', blank: 'Vous', options: ['Nous', 'Vous', 'Elles'], answer: 1 },
        { sentence: '___ partons en vacances.', blank: 'Nous', options: ['Vous', 'Nous', 'Ils'], answer: 1 }
    ]},
    { level: 9, title: "Ils et Elles", reward: { stars: 19, coins: 13 }, activities: [
        { sentence: '___ regardent un film.', blank: 'Ils', options: ['Ils', 'Elles', 'Nous'], answer: 0 },
        { sentence: '___ sont de bonnes amies.', blank: 'Elles', options: ['Ils', 'Elles', 'Vous'], answer: 1 },
        { sentence: '___ mangent des gâteaux.', blank: 'Ils', options: ['Elles', 'Nous', 'Ils'], answer: 2 },
        { sentence: '___ dansent dans le salon.', blank: 'Elles', options: ['Ils', 'Elles', 'Vous'], answer: 1 },
        { sentence: '___ construisent une cabane.', blank: 'Ils', options: ['Ils', 'Elles', 'Nous'], answer: 0 }
    ]},
    { level: 10, title: "Grand mélange !", reward: { stars: 20, coins: 15 }, activities: [
        { sentence: '___ faut être sage.', blank: 'Il', options: ['Il', 'Je', 'Nous'], answer: 0 },
        { sentence: '___ y a du soleil dehors.', blank: 'Il', options: ['Elle', 'Il', 'Vous'], answer: 1 },
        { sentence: 'Je joue ___ mes amis.', blank: 'avec', options: ['pour', 'avec', 'chez'], answer: 1 },
        { sentence: '___ allons au cinéma.', blank: 'Nous', options: ['Ils', 'Vous', 'Nous'], answer: 2 },
        { sentence: 'Le chat est ___ la table.', blank: 'sous', options: ['sur', 'sous', 'dans'], answer: 1 }
    ]}
  ];

  function start(context) {
    const levelIndex = Math.max(0, Math.min(LEVELS.length - 1, context.currentLevel - 1));
    const levelData = LEVELS[levelIndex];
    const state = { levelData, index: 0, correctStreak: 0 };

    context.clearGameClasses?.(['mots-outils']);
    renderScene(context, state);
  }

  function renderScene(context, state) {
    const content = context.content;
    content.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'mots-outils fx-bounce-in-down';

    const header = document.createElement('div');
    header.className = 'mots-outils__header';
    header.innerHTML = `<h2 class="mots-outils__title">Mots‑outils — Niveau ${state.levelData.level}</h2>`;
    const progress = document.createElement('div'); progress.className = 'mots-outils__progress';
    const progressFill = document.createElement('div'); progressFill.className = 'mots-outils__progress-fill';
    progress.appendChild(progressFill); header.appendChild(progress); wrapper.appendChild(header);

    const zone = document.createElement('div'); zone.className = 'mots-outils__zone'; wrapper.appendChild(zone);
    const feedback = document.createElement('div'); feedback.className = 'mots-outils__feedback is-hidden'; feedback.setAttribute('role','status'); feedback.setAttribute('aria-live','polite'); wrapper.appendChild(feedback);

    content.appendChild(wrapper);
    context.configureBackButton('Retour aux niveaux', () => context.showLevelMenu('mots-outils'));
    context.setAnsweredStatus('in-progress');

    renderActivity(context, state, zone, feedback, progressFill);
  }

  function renderActivity(context, state, activityZone, feedback, progressFill) {
    clearTimeout(state.feedbackTimer);
    activityZone.innerHTML = '';
    feedback.classList.add('is-hidden');
    feedback.textContent = '';

    const activity = state.levelData.activities[state.index];
    const total = state.levelData.activities.length;
    const current = state.index + 1;
    progressFill.style.width = `${Math.round(((current-1)/total)*100)}%`;

    const sentenceEl = document.createElement('div');
    sentenceEl.className = 'mots-outils__sentence';
    sentenceEl.innerHTML = activity.sentence.replace('___', '<span class="mots-outils__blank">___</span>');
    activityZone.appendChild(sentenceEl);

    const options = document.createElement('div');
    options.className = 'mots-outils__options';
    activityZone.appendChild(options);

    activity.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mots-outils__option fx-bounce-in-down';
      btn.style.animationDelay = `${idx * 0.1}s`;
      const icon = document.createElement('span');
      icon.className = 'mots-outils__option-icon';
      icon.textContent = OPTION_ICONS[idx % OPTION_ICONS.length];
      btn.appendChild(icon);
      const label = document.createElement('span');
      label.className = 'mots-outils__option-label';
      label.textContent = opt;
      btn.appendChild(label);
      btn.addEventListener('click', () => handleAnswer(context, state, activity, idx, btn, options, feedback, sentenceEl));
      options.appendChild(btn);
    });

    context.speakText(activity.speak || activity.sentence.replace('___', 'blanc'));
  }

  function handleAnswer(context, state, activity, selectedIndex, button, optionsContainer, feedback, sentenceEl) {
    if (button.disabled) { return; }
    const isCorrect = selectedIndex === activity.answer;

    disableOptions(optionsContainer);

    if (isCorrect) {
      context.playPositiveSound();
      context.awardReward(state.levelData.reward.stars, state.levelData.reward.coins);
      context.updateUI?.();
      button.classList.add('is-correct');
      showFeedback(feedback, 'positive', activity.success || 'Très bien !');
      sentenceEl.innerHTML = activity.sentence.replace('___', `<span class="mots-outils__blank--filled">${activity.blank}</span>`);
      setTimeout(() => nextActivity(context, state), 1500);
    } else {
      context.playNegativeSound();
      context.awardReward(0, -2);
      context.updateUI?.();
      button.classList.add('is-wrong');
      const correctButton = Array.from(optionsContainer.children)[activity.answer];
      if (correctButton) correctButton.classList.add('is-correct');
      showFeedback(feedback, 'negative', activity.hint || 'Essaie une autre option.');
      setTimeout(() => nextActivity(context, state), 2000);
    }
  }

  function disableOptions(container) {
    Array.from(container.children).forEach(child => { child.disabled = true; });
  }
  
  function nextActivity(context, state) {
    state.index++;
    if (state.index < state.levelData.activities.length) {
      renderActivity(context, state, context.content.querySelector('.mots-outils__zone'), context.content.querySelector('.mots-outils__feedback'), context.content.querySelector('.mots-outils__progress-fill'));
    } else {
      finishLevel(context, state);
    }
  }

  function finishLevel(context, state) {
    context.content.querySelector('.mots-outils__progress-fill').style.width = '100%';
    showFeedback(context.content.querySelector('.mots-outils__feedback'), 'positive', '💬 Niveau terminé ! Bravo !');
    context.markLevelCompleted();
    context.showSuccessMessage('Excellent travail !');
    context.showConfetti();
    context.setAnsweredStatus('completed');

    state.feedbackTimer = setTimeout(() => {
      context.showLevelMenu('mots-outils');
    }, 1600);
  }

  function showFeedback(el, variant, msg) {
    el.classList.remove('is-hidden','is-positive','is-negative');
    el.classList.add(variant==='positive'?'is-positive':'is-negative');
    el.textContent = msg;
  }

  window.motsOutilsGame = { start };
})();
