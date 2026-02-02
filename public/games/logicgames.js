;(function () {
  'use strict';

  const STORAGE_KEY = 'logicGamesProgress_v2';
  const DEFAULT_TOTAL_LEVELS = 12;
  const DEFAULT_QUESTIONS_PER_LEVEL = 8;
  const LEVEL_OVERRIDES = {
    labyrinthe: 10
  };

  const LOGIC_GAMES = [
    { id: 'labyrinthe', icon: '🧭', title: 'Labyrinthe Logique', svg: svgPath(), playable: true },
    { id: 'series-motifs', icon: '🔷', title: 'Séries & Motifs', svg: svgWave(), playable: true },
    { id: 'tri-classement', icon: '🗂', title: 'Tri & Classement', svg: svgBins(), playable: true },
    { id: 'sudoku-junior', icon: '🔢', title: 'Sudoku Junior', svg: svgGrid(), playable: true },
    { id: 'symetrie', icon: '🪞', title: 'Symétrie Magique', svg: svgMirror(), playable: true },
    { id: 'orbes-lumiere', icon: '\u2728', title: 'Les Orbes de Lumi\u00e8re', svg: svgMirror(), playable: true },
    { id: 'cartes-comparatives', icon: '⚖', title: 'Cartes Comparatives', svg: svgScale(), playable: true },
    { id: 'reseaux-chemins', icon: '🔗', title: 'Réseaux de Chemins', svg: svgNet(), playable: true },
    { id: 'logigrammes', icon: '🧩', title: 'Logigrammes (Si… Alors…)', svg: svgFlow(), playable: true },
    { id: 'enigmes', icon: '💡', title: "Jeu d’énigmes", svg: svgSpy(), playable: true },
    { id: 'repartis-multiplie', icon: '🍎', title: 'Répartis & Multiplie', svg: svgBalance(), playable: true }
  ];

  const GAME_CONFIGS = {
    'labyrinthe': {
      title: 'Labyrinthe Logique',
      levels: LEVEL_OVERRIDES.labyrinthe,
      generateLevel(level) {
        return buildLabyrinthAdventureLevel(level);
      }
    },
    'series-motifs': {
      title: 'Séries & Motifs',
      generateLevel(level) {
        return Array.from({ length: DEFAULT_QUESTIONS_PER_LEVEL }, () => buildSeriesQuestion(level));
      }
    },
    'tri-classement': {
      title: 'Tri & Classement',
      generateLevel(level) {
        return Array.from({ length: DEFAULT_QUESTIONS_PER_LEVEL }, () => buildSortingQuestion(level));
      }
    },
    'sudoku-junior': {
      title: 'Sudoku Junior',
      generateLevel(level) {
        return Array.from({ length: DEFAULT_QUESTIONS_PER_LEVEL }, () => buildMiniSudokuQuestion(level));
      }
    },
    'symetrie': {
      title: 'Symétrie Magique',
      generateLevel(level) {
        return Array.from({ length: DEFAULT_QUESTIONS_PER_LEVEL }, () => buildSymmetryQuestion(level));
      }
    },
    'orbes-lumiere': {
      title: 'Les Orbes de Lumière',
      generateLevel(level) {
        return Array.from({ length: DEFAULT_QUESTIONS_PER_LEVEL }, () => buildOrbesDeLumiereQuestion(level));
      }
    },
    'cartes-comparatives': {
      title: 'Cartes Comparatives',
      generateLevel(level) {
        return Array.from({ length: DEFAULT_QUESTIONS_PER_LEVEL }, () => buildComparisonQuestion(level));
      }
    },
    'reseaux-chemins': {
      title: 'Réseaux de Chemins',
      generateLevel(level) {
        return Array.from({ length: DEFAULT_QUESTIONS_PER_LEVEL }, () => buildNetworkQuestion(level));
      }
    },
    'logigrammes': {
      title: 'Logigrammes (Si… Alors…)',
      generateLevel(level) {
        return Array.from({ length: DEFAULT_QUESTIONS_PER_LEVEL }, () => buildLogicChainQuestion(level));
      }
    },
    'enigmes': {
      title: "Jeu d’énigmes",
      generateLevel(level) {
        return Array.from({ length: DEFAULT_QUESTIONS_PER_LEVEL }, () => buildRiddleQuestion(level));
      }
    },
    'repartis-multiplie': {
      title: 'Répartis & Multiplie',
      generateLevel(level) {
        return Array.from({ length: DEFAULT_QUESTIONS_PER_LEVEL }, () => buildDistributionQuestion(level));
      }
    }
  };

  function getTotalLevelsFor(gameId) {
    return LEVEL_OVERRIDES[gameId] || DEFAULT_TOTAL_LEVELS;
  }

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveProgress(progress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  function getCompleted(gameId) {
    const progress = loadProgress();
    const totalLevels = getTotalLevelsFor(gameId);
    return Math.max(0, Math.min(totalLevels, progress[gameId]?.completed || 0));
  }

  function markCompleted(gameId, nextLevel) {
    const progress = loadProgress();
    const totalLevels = getTotalLevelsFor(gameId);
    const safeLevel = Math.max(0, Math.min(totalLevels, nextLevel));
    progress[gameId] = { completed: Math.max(getCompleted(gameId), safeLevel) };
    saveProgress(progress);
  }

  function renderSection(container, onStart) {
    const section = document.createElement('section');
    section.id = 'logic-games';
    section.className = 'category fx-bounce-in-down';
    section.innerHTML = `<h2>🧠 Jeux de Logique & Raisonnement</h2>`;
    const grid = document.createElement('div');
    grid.className = 'game-grid';

    LOGIC_GAMES.forEach(game => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'game-card fx-bounce-in-down';
      card.id = `logic-${game.id}`;
      card.setAttribute('aria-label', game.title);
      card.tabIndex = 0;
      const totalLevels = Math.max(1, getTotalLevelsFor(game.id));
      const progress = Math.round((getCompleted(game.id) / totalLevels) * 100);
      card.innerHTML = `
        <span class="icon" aria-hidden="true">${game.icon}</span>
        <svg class="svg" viewBox="0 0 24 24" aria-hidden="true">${game.svg}</svg>
        <span class="title">${game.title}</span>
        <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><span style="width:${progress}%"></span></div>
      `;
      card.addEventListener('click', () => onStart && onStart(game));
      grid.appendChild(card);
    });

    section.appendChild(grid);
    container.appendChild(section);
  }

  function start(gameId, context) {
    const config = GAME_CONFIGS[gameId];
    if (!config) {
      showSoon(context, gameId);
      return;
    }
    showLevelMenu(gameId, context, config);
  }

  function showLevelMenu(gameId, context, config) {
    context.topic = gameId;
    const totalLevels = config.levels || getTotalLevelsFor(gameId);
    const completed = Math.min(getCompleted(gameId), totalLevels);
    context.content.innerHTML = '';

    const heading = document.createElement('div');
    heading.className = 'question-prompt fx-bounce-in-down';
    heading.textContent = `${config.title} - Choisis un niveau`;
    context.content.appendChild(heading);

    if (context.speakText) {
      context.speakText(`Choisis un niveau pour ${config.title}`);
    }

    const container = document.createElement('div');
    container.className = 'level-container';
    for (let level = 1; level <= totalLevels; level++) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'level-button fx-bounce-in-down';
      button.style.animationDelay = `${Math.random() * 0.45}s`;
      
      if (gameId === 'orbes-lumiere') {
        button.style.borderRadius = '50%';
        button.style.width = '80px';
        button.style.height = '80px';
        button.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        if (level <= completed) {
          button.style.backgroundColor = 'rgba(40, 200, 140, 0.5)';
        }
      }
      if (level <= completed) {
        button.classList.add('correct', 'is-completed');
        button.dataset.status = 'completed';
      }
      button.textContent = `Niveau ${level}`;
      button.setAttribute('aria-label', `Niveau ${level}`);
      button.addEventListener('click', () => runLevel(gameId, context, config, level));
      container.appendChild(button);
    }

    context.content.appendChild(container);
    context.configureBackButton('Retour aux sujets', context.goToTopics);
  }

  function runLevel(gameId, context, config, level) {
    context.setCurrentLevel(level);
    const reward = computeReward(level);
    const generated = config.generateLevel(level);
    const rawQuestions = Array.isArray(generated) ? generated : [];

    if (gameId === 'labyrinthe') {
      runLabyrinthAdventure(context, {
        gameId,
        title: `${config.title} - Niveau ${level}`,
        questions: rawQuestions,
        reward,
        level,
        onRetry: () => runLabyrinthAdventure(context, {
          gameId,
          title: `${config.title} - Niveau ${level}`,
          questions: buildLabyrinthAdventureLevel(level),
          reward,
          level
        }),
        onReturn: () => showLevelMenu(gameId, context, config)
      });
      return;
    }

    const questions = rawQuestions.slice(0, DEFAULT_QUESTIONS_PER_LEVEL);
    renderQuiz(context, {
      gameId,
      title: `${config.title} - Niveau ${level}`,
      questions,
      reward,
      level,
      onComplete: () => {
        markCompleted(gameId, level);
        context.markLevelCompleted();
        context.awardReward(reward.stars, reward.coins);
        const message = gameId === 'orbes-lumiere'
          ? 'La lumière revient ! Fragment de constellation décroché ✨'
          : 'Bravo ! Niveau réussi ✨';
        context.showSuccessMessage(message);
        context.showConfetti();
        setTimeout(() => showLevelMenu(gameId, context, config), 1200);
      }
    });
  }

  function computeReward(level) {
    return {
      stars: 14 + level,
      coins: 6 + Math.floor(level / 2)
    };
  }

  function computeTimeLimit(level) {
    const clamped = Math.max(1, Math.min(level, DEFAULT_TOTAL_LEVELS));
    const base = 14 - Math.floor(clamped * 0.9);
    return Math.max(6, base);
  }

  function renderQuiz(context, { gameId, title, questions, reward, level = 1, onComplete }) {
    let index = 0;
    const total = questions.length;
    const timedMode = gameId === 'tri-classement';
    const baseTimePerQuestion = timedMode ? computeTimeLimit(level) : 0;
    let timerInterval = null;
    let timeRemaining = baseTimePerQuestion;

    context.content.innerHTML = '';
    const heading = document.createElement('div');
    heading.className = 'question-prompt fx-bounce-in-down';
    heading.textContent = title;
    context.content.appendChild(heading);

    const info = document.createElement('p');
    info.className = 'question-detail logic-level-intro';
    info.textContent = `Réponds aux ${total} énigmes pour gagner ${reward.stars} étoiles et ${reward.coins} pièces.`;
    context.content.appendChild(info);
    if (timedMode) {
      info.textContent += ` Tu as ${baseTimePerQuestion} secondes par question, sois rapide !`;
    }

    const card = document.createElement('div');
    card.className = 'puzzle-question-container fx-bounce-in-down';
    context.content.appendChild(card);

    const progressLabel = document.createElement('div');
    progressLabel.className = 'progress-tracker__label is-visible';
    progressLabel.textContent = `Question 1 / ${total}`;
    card.appendChild(progressLabel);

    let timerLabel = null;
    if (timedMode) {
      timerLabel = document.createElement('div');
      timerLabel.className = 'logic-timer';
      timerLabel.textContent = `Temps restant : ${baseTimePerQuestion}s`;
      card.appendChild(timerLabel);
    }

    const questionHolder = document.createElement('div');
    questionHolder.className = 'puzzle-equation fx-pop logic-question-block';
    card.appendChild(questionHolder);

    const optionsGrid = document.createElement('div');
    optionsGrid.className = 'puzzle-options logic-options-grid';
    card.appendChild(optionsGrid);

    context.configureBackButton('Retour aux niveaux', () => {
      if (timedMode) {
        stopTimer();
      }
      showLevelMenu(gameId, context, GAME_CONFIGS[gameId]);
    });

    showQuestion();

    function showQuestion() {
      const current = questions[index];      renderLogicPrompt(questionHolder, current);
      optionsGrid.innerHTML = '';
      progressLabel.textContent = `Question ${index + 1} / ${total}`;

      current.options.forEach(option => {
        const value = String(option);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'puzzle-option-btn';
        if (current.kind === 'comparison') {
          button.classList.add('comparison-option-btn');
          const visuals = buildComparisonOptionVisual(value, current.context);
          button.innerHTML = visuals.html;
          button.setAttribute('aria-label', visuals.label);
        } else {
          button.textContent = value;
        }
        button.dataset.value = value;
        button.addEventListener('click', () => handleAnswer(button, String(current.answer), value));
        optionsGrid.appendChild(button);
      });

      if (timedMode) {
        startTimer(String(current.answer));
      }
    }

    function handleAnswer(button, answer, candidate) {
      if (timedMode) {
        stopTimer();
      }
      Array.from(optionsGrid.children).forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.value === answer) {
          btn.classList.add('is-correct');
        }
      });
      if (candidate === answer) {
        context.playPositiveSound();
      } else {
        button.classList.add('is-wrong');
        context.playNegativeSound();
      }
      advanceAfter(600);
    }

    function handleTimeout(answer) {
      Array.from(optionsGrid.children).forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.value === answer) {
          btn.classList.add('is-correct');
        }
      });
      if (timerLabel) {
        timerLabel.classList.add('is-expired');
      }
      context.playNegativeSound();
      advanceAfter(750);
    }

    function advanceAfter(delay) {
      setTimeout(() => {
        index += 1;
        if (index >= total) {
          if (timedMode) {
            stopTimer();
          }
          onComplete && onComplete();
        } else {
          Array.from(optionsGrid.children).forEach(btn => btn.classList.remove('is-correct', 'is-wrong'));
          Array.from(optionsGrid.children).forEach(btn => (btn.disabled = false));
          if (timedMode && timerLabel) {
            timerLabel.classList.remove('is-warning', 'is-danger', 'is-expired');
          }
          showQuestion();
        }
      }, delay);
    }

    function startTimer(answer) {
      stopTimer();
      timeRemaining = baseTimePerQuestion;
      updateTimerLabel();
      timerInterval = setInterval(() => {
        timeRemaining -= 1;
        updateTimerLabel();
        if (timeRemaining <= 0) {
          stopTimer();
          handleTimeout(answer);
        }
      }, 1000);
    }

    function stopTimer() {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }

    function updateTimerLabel() {
      if (!timerLabel) return;
      timerLabel.textContent = `Temps restant : ${Math.max(0, timeRemaining)}s`;
      timerLabel.classList.toggle('is-warning', timeRemaining <= 5 && timeRemaining > 2);
      timerLabel.classList.toggle('is-danger', timeRemaining <= 2 && timeRemaining > 0);
    }
  }

  function renderLogicPrompt(holder, question) {
    holder.innerHTML = '';
    if (question.promptHTML) {
      const block = document.createElement('div');
      block.className = 'logic-visual-block';
      block.innerHTML = question.promptHTML;
      holder.appendChild(block);
    }
    const lines = normalizePromptLines(question);
    lines.forEach(line => {
      const element = document.createElement(line.type === 'code' ? 'pre' : 'p');
      element.className = line.type === 'code' ? 'logic-question-code' : 'logic-question-detail';
      element.textContent = line.text;
      holder.appendChild(element);
    });
    const questionText = question.questionText || question.question || null;
    if (questionText) {
      const main = document.createElement('p');
      main.className = 'logic-question-main';
      main.textContent = questionText;
      holder.appendChild(main);
    }
  }

  function normalizePromptLines(question) {
    const raw = question.promptLines || (question.prompt ? [question.prompt] : []);
    return raw.map(line => {
      if (typeof line === 'string') {
        return { text: line.trim(), type: 'text' };
      }
      const text = typeof line.text === 'string' ? line.text.trim() : '';
      return { text, type: line.type || 'text' };
    }).filter(entry => entry.text.length);
  }

  function buildComparisonOptionVisual(option, context) {
    const safeOption = escapeHtml(option);
    const meta = (context && context.meta) || { icon: '✨', accent: 'comparison-card--default' };
    const cards = (context && context.cards) || [];
    const unit = (context && context.unit) || '';
    const cardData = cards.find(card => card.label === option);

    if (cardData) {
      const html = `<span class="comparison-option-card ${meta.accent}">
          <span class="comparison-option-card__icon">${meta.icon}</span>
          <span class="comparison-option-card__label">${escapeHtml(cardData.label)}</span>
          <span class="comparison-option-card__value">${cardData.value} ${escapeHtml(unit)}</span>
        </span>`;
      const label = `${cardData.label}, ${cardData.value} ${unit}`.trim();
      return { html, label };
    }

    const html = `<span class="comparison-option-card comparison-option-card--all">
        <span class="comparison-option-card__icon">🎲</span>
        <span class="comparison-option-card__label">${safeOption}</span>
        <span class="comparison-option-card__value">Comparer toutes les cartes</span>
      </span>`;
    return { html, label: option };
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, ch => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[ch] || ch);
  }

  function showSoon(context, gameId) {
    context.content.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'coming-soon-wrapper fx-bounce-in-down';
    wrapper.innerHTML = `<h2>✨ Bientôt disponible</h2><p>${LOGIC_GAMES.find(g => g.id === gameId)?.title || 'Jeu logique'}</p>`;
    context.content.appendChild(wrapper);
    context.configureBackButton('Retour aux sujets', context.goToTopics);
  }

  // --- Question builders ---
  const LABYRINTH_DEFAULT_SUCCESS = 'Bravo ! Tu es un vrai détective des nombres !';
  const LABYRINTH_DEFAULT_HINT = 'Essaie encore ! Voici un petit indice…';

  const LABYRINTH_SCENARIOS = [
    {
      id: 'roses',
      emoji: '🌹',
      title: 'Les pétales de lune',
      operation: 'soustraction',
      build(level) {
        const total = randomInt(12, 16 + Math.min(level, 4));
        const wilted = randomInt(3, Math.min(total - 2, 5 + Math.floor(level / 2)));
        const answer = total - wilted;
        return {
          story: `Un rosier magique a fait éclore ${total} pétales de lune. Le vent en a emporté ${wilted}.`,
          details: ['Seuls les pétales restants brillent encore.'],
          questionText: 'Combien de pétales de lune brillent encore sur le rosier ?',
          calculation: `${total} - ${wilted}`,
          answer,
          hint: 'Retire les pétales que le vent a emportés.',
          explanation: `Il reste ${total} - ${wilted} = ${answer} pétales.`
        };
      }
    },
    {
      id: 'labubu',
      emoji: '🧸',
      title: 'Les Labubu d’anniversaire',
      operation: 'addition',
      build(level) {
        const fromMom = randomInt(2 + Math.floor(level / 3), 4 + Math.floor(level / 2));
        const fromFriends = randomInt(4, 6 + Math.floor(level / 2));
        const answer = fromMom + fromFriends;
        return {
          story: `Pour son anniversaire, Léa reçoit ${fromMom} figurines Labubu de sa maman et ${fromFriends} de ses amis.`,
          details: ['Elle les collectionne sur son étagère enchantée.'],
          questionText: 'Combien de Labubu a-t-elle en tout ?',
          calculation: `${fromMom} + ${fromFriends}`,
          answer,
          hint: 'Additionne les cadeaux de maman et ceux des copines.',
          explanation: `${fromMom} + ${fromFriends} = ${answer} Labubu.`,
          successMessage: 'Bravo ! Tu comptes les doudous comme un pro !'
        };
      }
    },
    {
      id: 'parachutistes',
      emoji: '🪂',
      title: 'Les parachutistes',
      operation: 'addition',
      build(level) {
        const waveOne = randomInt(2, 3 + Math.floor(level / 2));
        const waveTwo = randomInt(3, 4 + Math.floor(level / 2));
        const waveThree = randomInt(1, 2 + Math.floor(level / 3));
        const answer = waveOne + waveTwo + waveThree;
        return {
          story: `${waveOne} amis sautent en parachute, puis ${waveTwo} les rejoignent, et enfin ${waveThree} décident de sauter aussi !`,
          details: ['Tous se retrouvent dans le ciel pour une figure magique.'],
          questionText: 'Combien de parachutistes ont sauté en tout ?',
          calculation: `${waveOne} + ${waveTwo} + ${waveThree}`,
          answer,
          hint: 'Additionne les trois groupes de sauteurs.',
          explanation: `${waveOne} + ${waveTwo} + ${waveThree} = ${answer} amis dans le ciel.`
        };
      }
    },
    {
      id: 'macarons',
      emoji: '🧁',
      title: 'Les gâteaux des fées',
      operation: 'multiplication',
      build(level) {
        const sachets = randomInt(3, 4 + Math.floor(level / 3));
        const perSachet = randomInt(3, 4 + Math.floor(level / 3));
        const answer = sachets * perSachet;
        return {
          story: `Nadia prépare ${sachets} boîtes de gâteaux pour le bal des fées.`,
          details: [`Chaque sachet contient ${perSachet} macarons aux mille couleurs.`],
          questionText: 'Combien de macarons Nadia rapporte-t-elle ?',
          calculation: `${sachets} × ${perSachet}`,
          answer,
          hint: 'Multiplie le nombre de sachets par le nombre de macarons dans chaque sachet.',
          explanation: `${sachets} × ${perSachet} = ${answer} macarons.`
        };
      }
    },
    {
      id: 'pralines',
      emoji: '🍫',
      title: 'Les chocolats des gnomes',
      operation: 'division',
      build(level) {
        const friends = randomInt(3, 4 + Math.floor(level / 4));
        const eachGets = randomInt(5, 6 + Math.floor(level / 2));
        const total = friends * eachGets;
        return {
          story: `Un groupe de ${friends} gnomes a trouvé un trésor de ${total} chocolats magiques.`,
          details: ['Chaque ami reçoit exactement la même quantité.'],
          questionText: 'Combien de pralines reçoit chaque ami ?',
          calculation: `${total} ÷ ${friends}`,
          answer: eachGets,
          hint: 'Divise le nombre total de pralines par le nombre d’amis.',
          explanation: `${total} ÷ ${friends} = ${eachGets} pralines par ami.`
        };
      }
    },
    {
      id: 'cartes',
      emoji: '🎴',
      title: 'Les cartes du destin',
      operation: 'division',
      build(level) {
        const kids = randomInt(4, 5 + Math.floor(level / 3));
        const eachGets = randomInt(5, 6 + Math.floor(level / 2));
        const total = kids * eachGets;
        return {
          story: `Le gardien du temps distribue ${total} cartes du destin à ${kids} apprentis.`,
          details: ['Il veut que la distribution soit parfaitement équitable.'],
          questionText: 'Combien de cartes reçoit chaque enfant ?',
          calculation: `${total} ÷ ${kids}`,
          answer: eachGets,
          hint: 'Partage le nombre total de cartes entre les enfants.',
          explanation: `Chaque enfant reçoit ${total} ÷ ${kids} = ${eachGets} cartes.`
        };
      }
    },
    {
      id: 'bonbons',
      emoji: '🍬',
      title: 'Les bonbons colorés',
      operation: 'division',
      build(level) {
        const kids = randomInt(3, 5 + Math.floor(level / 3));
        const eachGets = randomInt(4, 6 + Math.floor(level / 2));
        const total = kids * eachGets;
        return {
          story: `On partage ${total} bonbons colorés entre ${kids} enfants.`,
          details: ['Chaque enfant reçoit une poignée colorée identique.'],
          questionText: 'Combien de bonbons reçoit chaque enfant ?',
          calculation: `${total} ÷ ${kids}`,
          answer: eachGets,
          hint: 'Divise le nombre de bonbons par le nombre d’enfants.',
          explanation: `${total} ÷ ${kids} = ${eachGets} bonbons chacun.`
        };
      }
    },
    {
      id: 'fleurs',
      emoji: '🌸',
      title: 'Les fleurs de lumière',
      operation: 'division',
      build(level) {
        const vases = randomInt(3, 4 + Math.floor(level / 3));
        const perVase = randomInt(4, 6 + Math.floor(level / 2));
        const total = vases * perVase;
        return {
          story: `On répartit ${total} fleurs de lumière dans ${vases} vases en cristal.`,
          details: ['Chaque vase doit avoir exactement le même nombre de fleurs.'],
          questionText: 'Combien de fleurs place-t-on dans chaque vase ?',
          calculation: `${total} ÷ ${vases}`,
          answer: perVase,
          hint: 'Partage les fleurs équitablement entre les vases.',
          explanation: `${total} ÷ ${vases} = ${perVase} fleurs par vase.`
        };
      }
    },
    {
      id: 'cerfs-volants',
      emoji: '🪁',
      title: 'Les cerfs-volants enchantés',
      operation: 'soustraction',
      build(level) {
        const total = randomInt(20, 26 + Math.floor(level / 2));
        const lost = randomInt(6, Math.min(total - 4, 9 + Math.floor(level / 2)));
        const answer = total - lost;
        return {
          story: `Au festival du vent, ${total} cerfs-volants enchantés dansent dans le ciel.`,
          details: [`Mais ${lost} s’envolent trop loin et disparaissent.`],
          questionText: 'Combien de cerfs-volants restent sur la plage ?',
          calculation: `${total} - ${lost}`,
          answer,
          hint: 'Retire les cerfs-volants qui se sont envolés trop loin.',
          explanation: `${total} - ${lost} = ${answer} cerfs-volants restants.`
        };
      }
    },
    {
      id: 'lanternes',
      emoji: '🏮',
      title: 'Les lanternes au festival',
      operation: 'multiplication',
      build(level) {
        const rows = randomInt(2 + Math.floor(level / 4), 4 + Math.floor(level / 3));
        const perRow = randomInt(4, 6 + Math.floor(level / 2));
        const answer = rows * perRow;
        return {
          story: `Pour le festival, on accroche ${rows} rangées de lanternes.`,
          details: [`Chaque rangée contient ${perRow} lanternes lumineuses.`],
          questionText: 'Combien de lanternes illuminent le ciel ?',
          calculation: `${rows} × ${perRow}`,
          answer,
          hint: 'Multiplie le nombre de rangées par le nombre de lanternes par rangée.',
          explanation: `${rows} × ${perRow} = ${answer} lanternes.`
        };
      }
    },
    {
      id: 'coquillages',
      emoji: '🐚',
      title: 'La collection de coquillages',
      operation: 'combinaison',
      build(level) {
        const start = randomInt(10, 15 + Math.floor(level / 2));
        const found = randomInt(3, 5 + Math.floor(level / 2));
        const gifted = randomInt(2, Math.min(start, 4 + Math.floor(level / 3)));
        const answer = start + found - gifted;
        return {
          story: `Léo a ${start} coquillages dans sa collection.`,
          details: [`On en trouve ${found} de plus, mais on en offre ${gifted} à un ami.`],
          questionText: 'Combien de coquillages reste-t-il pour la collection ?',
          calculation: `${start} + ${found} - ${gifted}`,
          answer,
          hint: 'Ajoute les coquillages trouvés puis enlève ceux offerts.',
          explanation: `${start} + ${found} - ${gifted} = ${answer} coquillages.`
        };
      }
    },
    {
      id: 'pastels',
      emoji: '🖍️',
      title: 'Les pastels de l’atelier',
      operation: 'multiplication',
      build(level) {
        const boites = randomInt(3, 4 + Math.floor(level / 3));
        const crayons = randomInt(4, 6 + Math.floor(level / 2));
        const answer = boites * crayons;
        return {
          story: `L’atelier de peinture reçoit ${boites} boîtes de pastels.`,
          details: [`Chaque boîte contient ${crayons} couleurs pétillantes.`],
          questionText: 'Combien de pastels les artistes peuvent-ils utiliser ?',
          calculation: `${boites} × ${crayons}`,
          answer,
          hint: 'Multiplie le nombre de boîtes par le nombre de pastels dans chaque boîte.',
          explanation: `${boites} × ${crayons} = ${answer} pastels.`
        };
      }
    },
    {
      id: 'glaces',
      emoji: '🍨',
      title: 'Les glaces givrés',
      operation: 'division',
      build(level) {
        const enfants = randomInt(4, 5 + Math.floor(level / 3));
        const parfums = randomInt(3, 4 + Math.floor(level / 3));
        const total = enfants * parfums;
        return {
          story: `Un glacier prépare ${total} boules de glace pour ${enfants} enfants.`,
          details: ['Il veut servir exactement le même nombre de boules à chacun.'],
          questionText: 'Combien de boules de glace reçoit chaque enfant ?',
          calculation: `${total} ÷ ${enfants}`,
          answer: parfums,
          hint: 'Partage le nombre total de boules par les enfants.',
          explanation: `${total} ÷ ${enfants} = ${parfums} boules par enfant.`
        };
      }
    },
    {
      id: 'dragon-tresor',
      emoji: '🐉',
      title: 'Le trésor du dragon',
      operation: 'combinaison',
      build(level) {
        const start = randomInt(20, 30 + level * 2);
        const added = randomInt(5, 10 + level);
        const lost = randomInt(3, 8 + Math.floor(level / 2));
        const answer = start + added - lost;
        return {
          story: `Un dragon garde un trésor de ${start} pièces d'or. Il y ajoute ${added} nouvelles pièces.`,
          details: [`Plus tard, un voleur réussit à lui dérober ${lost} pièces.`],
          questionText: 'Combien de pièces d\'or reste-t-il dans le trésor ?',
          calculation: `${start} + ${added} - ${lost}`,
          answer,
          hint: 'Commence par ajouter les nouvelles pièces, puis retire celles qui ont été volées.',
          explanation: `Le trésor a d'abord ${start} + ${added} = ${start + added} pièces. Puis, ${start + added} - ${lost} = ${answer} pièces restantes.`
        };
      }
    },
    {
      id: 'potion-magique',
      emoji: '🧪',
      title: 'La potion magique',
      operation: 'addition',
      build(level) {
        const ing1 = randomInt(5, 8 + level);
        const ing2 = randomInt(4, 7 + level);
        const extraInfo = randomInt(2, 4); // Info inutile
        const answer = ing1 + ing2;
        return {
          story: `Pour une potion, il faut ${ing1} gouttes de rosée et ${ing2} feuilles de menthe.`,
          details: [`La recette mentionne aussi ${extraInfo} champignons, mais ils ne sont pas pour cette potion.`],
          questionText: 'De combien d\'ingrédients (gouttes et feuilles) a-t-on besoin au total ?',
          calculation: `${ing1} + ${ing2}`,
          answer,
          hint: 'Ignore les champignons, ils ne font pas partie de cette recette !',
          explanation: `On a besoin de ${ing1} gouttes + ${ing2} feuilles = ${answer} ingrédients.`
        };
      }
    },
    {
      id: 'course-escargots',
      emoji: '🐌',
      title: 'La course des escargots',
      operation: 'difference',
      build(level) {
        const dist1 = randomInt(15, 25 + level);
        const dist2 = randomInt(8, Math.min(dist1 - 2, 18 + level));
        const answer = dist1 - dist2;
        return {
          story: `L'escargot A a parcouru ${dist1} cm. L'escargot B a parcouru ${dist2} cm.`,
          details: ['Ils font une course pour savoir qui est le plus rapide.'],
          questionText: 'De combien de centimètres l\'escargot A devance-t-il l\'escargot B ?',
          calculation: `${dist1} - ${dist2}`,
          answer,
          hint: 'Calcule la différence entre la distance de A et celle de B.',
          explanation: `La différence est de ${dist1} - ${dist2} = ${answer} cm.`
        };
      }
    },
    {
      id: 'chemin-ecolier',
      emoji: '🎒',
      title: 'Le chemin de l\'écolier',
      operation: 'addition',
      build(level) {
        const part1 = randomInt(10, 20 + level * 2);
        const part2 = randomInt(8, 15 + level);
        const part3 = randomInt(5, 10 + level);
        const answer = part1 + part2 + part3;
        return {
          story: `Pour aller à l'école, un écolier parcourt ${part1} mètres, tourne, marche ${part2} mètres, puis termine par ${part3} mètres.`,
          details: ['Il suit un chemin magique qui change chaque jour.'],
          questionText: 'Quelle est la distance totale du chemin ?',
          calculation: `${part1} + ${part2} + ${part3}`,
          answer,
          hint: 'Additionne la longueur de chaque partie du chemin.',
          explanation: `La distance totale est de ${part1} + ${part2} + ${part3} = ${answer} mètres.`
        };
      }
    },
    {
      id: 'livres-bibliotheque',
      emoji: '📚',
      title: 'La bibliothèque mystérieuse',
      operation: 'inverse',
      build(level) {
        const remaining = randomInt(15, 25 + level * 2);
        const borrowed = randomInt(5, 10 + level);
        const added = randomInt(3, 8 + level);
        const answer = remaining - added + borrowed;
        return {
          story: `Dans la bibliothèque, il reste ${remaining} livres sur l'étagère.`,
          details: [`Ceci est après que ${added} nouveaux livres aient été ajoutés et que ${borrowed} livres aient été empruntés.`],
          questionText: 'Combien de livres y avait-il au tout début ?',
          calculation: `${remaining} - ${added} + ${borrowed}`,
          answer,
          hint: 'Pense à l\'envers : pars des livres restants, retire ceux qui ont été ajoutés et rajoute ceux empruntés.',
          explanation: `Au début, il y avait ${remaining} - ${added} (nouveaux) + ${borrowed} (empruntés) = ${answer} livres.`
        };
      }
    },
    {
      id: 'gateau-anniversaire',
      emoji: '🎂',
      title: 'Le gâteau d\'anniversaire',
      operation: 'division-reste',
      build(level) {
        const totalSlices = randomInt(15, 25 + level);
        const friends = randomInt(4, 6 + Math.floor(level / 2));
        const answer = totalSlices % friends;
        return {
          story: `Un gâteau a ${totalSlices} parts. On le partage équitablement entre ${friends} amis.`,
          details: ['Chacun prend le même nombre de parts entières.'],
          questionText: 'Combien de parts de gâteau reste-t-il après le partage ?',
          calculation: `${totalSlices} % ${friends}`,
          answer,
          hint: 'Divise les parts par le nombre d\'amis et regarde ce qu\'il reste.',
          explanation: `${totalSlices} divisé par ${friends} donne ${Math.floor(totalSlices / friends)} parts chacun, et il reste ${answer} parts.`
        };
      }
    },
    {
      id: 'course-relais',
      emoji: '🏃',
      title: 'La course de relais',
      operation: 'addition-temps',
      build(level) {
        const time1 = randomInt(10, 15 + level);
        const time2 = randomInt(8, 12 + level);
        const time3 = randomInt(9, 14 + level);
        const answer = time1 + time2 + time3;
        return {
          story: `Dans une course de relais, le premier coureur met ${time1} secondes, le deuxième ${time2} secondes, et le troisième ${time3} secondes.`,
          questionText: 'Quel est le temps total de l\'équipe en secondes ?',
          calculation: `${time1} + ${time2} + ${time3}`,
          answer,
          hint: 'Additionne les temps de chaque coureur pour trouver le total.',
          explanation: `Le temps total est de ${time1} + ${time2} + ${time3} = ${answer} secondes.`
        };
      }
    }
  ];

  function runLabyrinthAdventure(context, { gameId, title, questions, reward, level, onRetry, onReturn }) {
    const state = {
      gameId,
      title,
      reward,
      level,
      onRetry,
      onReturn,
      stage: 'initial',
      queue: [],
      reviewQueue: [],
      currentQuestion: null,
      completedCount: 0,
      totalQuestions: 0,
    };

    const goBack = () => {
      if (typeof onReturn === 'function') onReturn();
      else showLevelMenu(gameId, context, GAME_CONFIGS[gameId]);
    };

    const preparedQuestions = (Array.isArray(questions) && questions.length ? questions : buildLabyrinthAdventureLevel(level))
      .map((q, i) => normalizeLabyrinthQuestion(LABYRINTH_SCENARIOS.find(s => s.id === (q.scenarioId || q.id)), q, level, i))
      .filter(Boolean);

    if (!preparedQuestions.length) {
      context.content.innerHTML = '<p class="question-prompt">Aucune aventure disponible pour le moment.</p>';
      context.configureBackButton('Retour aux niveaux', goBack);
      return;
    }

    state.queue = preparedQuestions.map(q => ({ ...q }));
    state.totalQuestions = preparedQuestions.length;

    context.setAnsweredStatus?.('in-progress');
    context.content.innerHTML = '';
    context.configureBackButton('Retour aux niveaux', goBack);

    const heading = document.createElement('div');
    heading.className = 'question-prompt fx-bounce-in-down';
    heading.textContent = title;
    context.content.appendChild(heading);

    const ui = renderLabyrinthUI(context.content, state);

    loadNextQuestion(state, context, ui);
  }

  function renderLabyrinthUI(container, state) {
    const shell = document.createElement('div');
    shell.className = 'labyrinth-shell fx-bounce-in-down';
    shell.innerHTML = `
      <div class="labyrinth-progress">
        <span class="labyrinth-stage-chip"></span>
        <div class="labyrinth-progress__track"><div class="labyrinth-progress__fill"></div></div>
        <div class="labyrinth-progress__info">
          <span class="labyrinth-progress__label"></span>
          <span class="labyrinth-progress__reward">⭐ ${state.reward.stars} • 🪙 ${state.reward.coins}</span>
        </div>
      </div>
      <article class="labyrinth-story-card">
        <span class="labyrinth-story-card__emoji"></span>
        <div class="labyrinth-story-card__content">
          <h3 class="labyrinth-story-card__title"></h3>
          <div class="labyrinth-story-card__text"></div>
        </div>
      </article>
      <div class="labyrinth-calculation is-hidden">
        <span class="labyrinth-calculation__label">Calcul magique :</span>
        <span class="labyrinth-calculation__value"></span>
      </div>
      <p class="labyrinth-question"></p>
      <div class="labyrinth-options"></div>
      <div class="labyrinth-feedback"></div>
    `;
    container.appendChild(shell);

    return {
      shell,
      stageChip: shell.querySelector('.labyrinth-stage-chip'),
      progressFill: shell.querySelector('.labyrinth-progress__fill'),
      progressLabel: shell.querySelector('.labyrinth-progress__label'),
      storyBadge: shell.querySelector('.labyrinth-story-card__emoji'),
      storyTitle: shell.querySelector('.labyrinth-story-card__title'),
      storyText: shell.querySelector('.labyrinth-story-card__text'),
      calcBox: shell.querySelector('.labyrinth-calculation'),
      calcValue: shell.querySelector('.labyrinth-calculation__value'),
      questionPrompt: shell.querySelector('.labyrinth-question'),
      optionsContainer: shell.querySelector('.labyrinth-options'),
      feedbackArea: shell.querySelector('.labyrinth-feedback'),
    };
  }

  function renderLabyrinthQuestion(ui, question, state, context) {
    ui.storyBadge.textContent = question.emoji || '🧩';
    ui.storyTitle.textContent = question.title || 'Défi logique';
    ui.storyText.innerHTML = [...toLineArray(question.storyLines), ...toLineArray(question.detailLines)]
      .map(line => `<p>${escapeHtml(line)}</p>`).join('');

    const hasCalc = Boolean(question.calculation);
    ui.calcBox.classList.toggle('is-hidden', !hasCalc);
    ui.calcValue.textContent = hasCalc ? question.calculation : '';

    ui.questionPrompt.textContent = question.questionText || 'Choisis le bon résultat.';
    ui.optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'labyrinth-option-btn';
      btn.dataset.value = option;
      btn.textContent = option;
      btn.style.animationDelay = `${index * 0.08 + 0.2}s`;
      btn.addEventListener('click', () => handleLabyrinthAnswer(question, btn, state, context, ui));
      ui.optionsContainer.appendChild(btn);
    });
    setLabyrinthFeedback(ui.feedbackArea, null, []);
  }

  function handleLabyrinthAnswer(question, button, state, context, ui) {
    const optionButtons = Array.from(ui.optionsContainer.querySelectorAll('button'));
    optionButtons.forEach(btn => (btn.disabled = true));

    const isCorrect = button.dataset.value === question.answer;

    if (isCorrect) {
      button.classList.add('is-correct');
      if (!question.solved) {
        question.solved = true;
        state.completedCount++;
      }
      context.playPositiveSound();
      setLabyrinthFeedback(ui.feedbackArea, 'success', [question.successMessage || LABYRINTH_DEFAULT_SUCCESS]);
      updateLabyrinthProgress(state, ui);
      setTimeout(() => {
        setLabyrinthFeedback(ui.feedbackArea, null, []);
        loadNextQuestion(state, context, ui);
      }, 900);
    } else {
      button.classList.add('is-wrong');
      const correctButton = optionButtons.find(btn => btn.dataset.value === question.answer);
      if (correctButton) correctButton.classList.add('is-correct');
      context.playNegativeSound();
      context.awardReward(0, -1);
      const messages = [question.failureMessage || LABYRINTH_DEFAULT_HINT, question.hint, question.explanation].filter(Boolean);
      setLabyrinthFeedback(ui.feedbackArea, 'error', messages);
      if (!state.reviewQueue.includes(question)) {
        state.reviewQueue.push(question);
      }
      setTimeout(() => {
        setLabyrinthFeedback(ui.feedbackArea, null, []);
        loadNextQuestion(state, context, ui);
      }, 1500);
    }
  }

  function loadNextQuestion(state, context, ui) {
    if (!state.queue.length) {
      if (state.reviewQueue.length) {
        state.queue = state.reviewQueue.splice(0);
        if (state.stage === 'initial') state.stage = 'review';
      } else {
        finishLabyrinthLevel(state, context, ui);
        return;
      }
    }
    state.currentQuestion = state.queue.shift();
    updateLabyrinthProgress(state, ui);
    renderLabyrinthQuestion(ui, state.currentQuestion, state, context);
  }

  function finishLabyrinthLevel(state, context, ui) {
    state.stage = 'completed';
    updateLabyrinthProgress(state, ui);
    markCompleted(state.gameId, state.level);
    context.markLevelCompleted();
    context.awardReward(state.reward.stars, state.reward.coins);
    context.setAnsweredStatus?.('completed');
    context.showConfetti();

    ui.shell.innerHTML = `
      <div class="labyrinth-summary fx-pop">
        <h3>${LABYRINTH_DEFAULT_SUCCESS}</h3>
        <p>Tu gagnes <strong>${state.reward.stars}</strong> étoiles et <strong>${state.reward.coins}</strong> pièces.</p>
        <p>Tu y es presque ! Essaie encore 🌟</p>
        <div class="labyrinth-summary__actions">
          <button type="button" class="labyrinth-cta" id="labyrinth-retry-btn">Réessayer 🌟</button>
          <button type="button" class="labyrinth-cta labyrinth-cta--ghost" id="labyrinth-back-btn">Retour aux niveaux</button>
        </div>
      </div>
    `;

    ui.shell.querySelector('#labyrinth-retry-btn').addEventListener('click', () => {
      if (typeof state.onRetry === 'function') state.onRetry();
      else runLabyrinthAdventure(context, { ...state, questions: buildLabyrinthAdventureLevel(state.level) });
    });

    ui.shell.querySelector('#labyrinth-back-btn').addEventListener('click', () => {
      if (typeof state.onReturn === 'function') state.onReturn();
      else showLevelMenu(state.gameId, context, GAME_CONFIGS[state.gameId]);
    });
  }

  function updateLabyrinthProgress(state, ui) {
    const percent = Math.round((state.completedCount / state.totalQuestions) * 100);
    ui.progressFill.style.width = `${percent}%`;
    ui.progressLabel.textContent = `Défis résolus : ${state.completedCount} / ${state.totalQuestions}`;
    ui.stageChip.textContent = state.stage === 'review' ? 'Mission repaso' : 'Mission découverte';
  }

  function setLabyrinthFeedback(feedbackArea, type, lines) {
    feedbackArea.className = 'labyrinth-feedback';
    if (type) feedbackArea.classList.add(`is-${type}`);
    feedbackArea.innerHTML = (Array.isArray(lines) ? lines : [])
      .filter(Boolean)
      .map(line => `<p>${escapeHtml(line)}</p>`)
      .join('');
  }

  function buildLabyrinthAdventureLevel(level) {
    const desired = clamp(randomInt(5, 5 + Math.min(3, Math.floor(level / 2))), 5, 8);
    const pool = shuffle(LABYRINTH_SCENARIOS.slice());
    const selected = [];

    for (let i = 0; i < pool.length && selected.length < desired; i++) {
      const scenario = pool[i];
      const normalized = normalizeLabyrinthQuestion(scenario, scenario.build(level), level, i);
      if (!normalized) { continue; }
      selected.push(normalized);
    }

    if (selected.length < desired) {
      const remaining = LABYRINTH_SCENARIOS.filter(s => !selected.some(q => q.scenarioId === s.id));
      const fallbackPool = shuffle(remaining.length ? remaining : LABYRINTH_SCENARIOS.slice());
      for (let i = 0; i < fallbackPool.length && selected.length < desired; i++) {
        const scenario = fallbackPool[i];
        const normalized = normalizeLabyrinthQuestion(scenario, scenario.build(level), level, selected.length);
        if (!normalized) { continue; }
        if (selected.some(item => item.scenarioId === scenario.id && item.calculation === normalized.calculation)) {
          continue;
        }
        selected.push(normalized);
      }
    }

    return selected.slice(0, desired);
  }

  function normalizeLabyrinthQuestion(scenario, raw, level, index = 0) {
    if (!raw || typeof raw.answer === 'undefined') { return null; }
    const reference = scenario || LABYRINTH_SCENARIOS.find(item => item.id === raw.scenarioId) || null;
    const numericAnswer = Number(raw.answer);
    if (!Number.isFinite(numericAnswer)) { return null; }
    const optionNumbers = ensureLabyrinthOptions(raw.options, numericAnswer, level);
    const scenarioId = reference ? reference.id : (raw.scenarioId || 'labyrinth');

    return {
      id: raw.id || `${scenarioId}-${Date.now()}-${index}-${randomInt(0, 9999)}`,
      scenarioId,
      emoji: raw.emoji || (reference && reference.emoji) || '🧩',
      title: raw.title || (reference && reference.title) || 'Défi logique',
      operation: raw.operation || (reference && reference.operation) || '',
      storyLines: raw.storyLines ? toLineArray(raw.storyLines) : toLineArray(raw.story),
      detailLines: raw.detailLines ? toLineArray(raw.detailLines) : (Array.isArray(raw.details) ? raw.details.map(String) : []),
      questionText: raw.questionText || 'Quel est le bon résultat ?',
      calculation: raw.calculation || '',
      answer: String(numericAnswer),
      options: optionNumbers.map(String),
      hint: raw.hint || LABYRINTH_DEFAULT_HINT,
      explanation: raw.explanation || '',
      successMessage: raw.successMessage || LABYRINTH_DEFAULT_SUCCESS,
      failureMessage: raw.failureMessage || LABYRINTH_DEFAULT_HINT,
      solved: false,
      attempts: 0
    };
  }

  function ensureLabyrinthOptions(options, answer, level) {
    const pool = new Set();
    if (Array.isArray(options)) {
      options.forEach(value => {
        const num = Number(value);
        if (Number.isFinite(num)) {
          pool.add(num);
        }
      });
    }
    pool.add(answer);
    const needed = 2;
    let guard = 0;
    while (pool.size < needed && guard < 40) {
      generateLabyrinthOptions(answer, level).forEach(value => {
        if (pool.size < needed) {
          pool.add(value);
        }
      });
      guard += 1;
    }
    return shuffle(Array.from(pool)).slice(0, needed);
  }

  function generateLabyrinthOptions(answer, level) {
    const variance = Math.max(2, Math.min(10, Math.round(answer * 0.3) + Math.floor(level / 2)));
    const results = new Set();
    while (results.size < 4) {
      const delta = randomInt(1, variance);
      const plus = answer + delta;
      const minus = answer - delta;
      if (plus !== answer) {
        results.add(plus);
      }
      if (minus >= 0 && minus !== answer) {
        results.add(minus);
      }
      if (answer > 5) {
        results.add(answer + delta + 1);
      }
      if (results.size > 6) {
        break;
      }
    }
    return Array.from(results).filter(value => value >= 0);
  }

  function toLineArray(value) {
    if (!value) { return []; }
    if (Array.isArray(value)) {
      return value.map(String);
    }
    return [String(value)];
  }

  function buildSeriesQuestion(level) {
    const type = randomChoice(['arith', 'geometric', 'alternance', 'emoji']);
    let answer = '';
    let options = [];
    let promptLines = [];

    if (type === 'arith') {
      const start = randomInt(2, 8 + level);
      const step = randomInt(1, 2 + Math.floor(level / 4));
      const sequence = [start, start + step, start + 2 * step, start + 3 * step];
      answer = String(start + 4 * step);
      options = shuffle([answer, String(start + 3 * step), String(start + 4 * step + step), String(start + 4 * step + 2)]);
      promptLines = [{ text: `Suite arithmétique : ${sequence.join(', ')}, ...` }];
    } else if (type === 'geometric') {
      const start = randomInt(2, 5);
      const ratio = randomChoice([2, 3]);
      const sequence = [start, start * ratio, start * ratio * ratio];
      answer = String(sequence[2] * ratio);
      options = shuffle([answer, String(sequence[2] + ratio), String(sequence[2] * ratio + ratio), String(sequence[2] * ratio - ratio)]);
      promptLines = [{ text: `Suite multiplicative : ${sequence.join(', ')}, ...` }];
    } else if (type === 'alternance') {
      const first = randomChoice(['A', 'B', 'C']);
      const second = randomChoice(['▲', '●', '◼']);
      const sequence = [first, second, first, second, first];
      answer = second;
      const pool = ['▲', '●', '◼', '◆', '◯'];
      options = shuffle(uniqueArray([answer, ...shuffle(pool).slice(0, 3)]));
      promptLines = [{ text: `Motif alterné : ${sequence.join(' ')} ...` }];
    } else {
      const emojis = shuffle(['🍓', '🍋', '🍇', '🍉', '🍒']);
      const pattern = [emojis[0], emojis[1], emojis[0], emojis[1], emojis[0]];
      answer = emojis[1];
      options = shuffle(uniqueArray([answer, emojis[2], emojis[3], emojis[4]]));
      promptLines = [{ text: `Suite de symboles : ${pattern.join(' ')} ...` }];
    }

    return {
      promptLines,
      questionText: 'Quelle est la prochaine valeur ?',
      answer,
      options: options.map(String)
    };
  }

  function generateNumericOptions(answer, step = 1) {
    const options = new Set([String(answer)]);
    const safeStep = Math.max(1, Math.round(step));
    while (options.size < 4) {
      const direction = randomChoice([-2, -1, 1, 2, 3]);
      const candidate = answer + direction * safeStep;
      if (candidate >= 0) {
        options.add(String(candidate));
      }
    }
    return shuffle(Array.from(options));
  }

  function buildSortingQuestion(level) {
    const categories = [
      {
        title: 'animaux de la ferme',
        ok: ['🐄', '🐖', '🐓'],
        intruders: ['🐬', '🦁']
      },
      {
        title: 'fruits',
        ok: ['🍎', '🍌', '🍐'],
        intruders: ['🥕', '🍞']
      },
      {
        title: 'objets qui roulent',
        ok: ['🚲', '🛵', '🚗'],
        intruders: ['🛶', '✈️']
      },
      {
        title: 'formes géométriques',
        ok: ['▲', '■', '●'],
        intruders: ['⭐', '🏠']
      },
      {
        title: 'animaux marins',
        ok: ['🐟', '🐙', '🐬'],
        intruders: ['🐅', '🐘']
      }
    ];

    const data = randomChoice(categories);
    const includeIntruder = level > 4;
    const baseChoices = [...data.ok];
    const intruder = randomChoice(data.intruders);
    if (includeIntruder) {
      baseChoices.push(intruder);
    }
    const displayItems = shuffle(baseChoices).join('  ');

    const answer = includeIntruder ? intruder : data.ok.join(' ');
    const optionSet = new Set();

    if (includeIntruder) {
      optionSet.add(intruder);
      baseChoices.forEach(item => optionSet.add(item));
      while (optionSet.size < 4) {
        optionSet.add(randomChoice([...data.ok, ...data.intruders]));
      }
    } else {
      optionSet.add(answer);
      optionSet.add([...data.ok.slice(0, 2), intruder].join(' '));
      optionSet.add([intruder, ...data.ok.slice(0, 2)].join(' '));
      optionSet.add(data.ok.slice(0, 2).join(' '));
      while (optionSet.size < 4) {
        optionSet.add(shuffle(data.ok).slice(0, 3).join(' '));
      }
    }

    const promptLines = [
      { text: `Catégorie : ${data.title}.` },
      { text: `Observations : ${displayItems}` }
    ];
    const questionText = includeIntruder
      ? 'Quel symbole est l’intrus ?'
      : 'Quelle combinaison contient uniquement des éléments corrects ?';

    return {
      promptLines,
      questionText,
      answer,
      options: shuffle(Array.from(optionSet)).slice(0, 4).map(String)
    };
  }

  function buildMiniSudokuQuestion(level) {
    const base = [
      [1, 2, 3],
      [2, 3, 1],
      [3, 1, 2]
    ];
    const rotation = level % 3;
    const grid = base.map(row => rotateRow(row, rotation));
    const row = randomInt(0, 2);
    const col = randomInt(0, 2);
    const answer = String(grid[row][col]);
    const display = grid.map((rowValues, rIdx) =>
      rowValues
        .map((value, cIdx) => (rIdx === row && cIdx === col ? '?' : String(value)))
        .join(' ')
    ).join('\n');

    const promptLines = [
      { text: 'Mini Sudoku : chiffres 1 à 3, sans répétition par ligne/colonne.' },
      { text: display, type: 'code' },
      { text: `Case à compléter : ligne ${row + 1}, colonne ${col + 1}.` }
    ];

    const options = shuffle(['1', '2', '3', String(randomInt(1, 3))]).slice(0, 4);
    if (!options.includes(answer)) {
      options[0] = answer;
    }

    return {
      promptLines,
      questionText: 'Quelle valeur complète la grille ?',
      answer,
      options: shuffle(options)
    };
  }

  function buildOrbesDeLumiereQuestion(level) {
    const SYMMETRY_SCENES = {
    symmetric: [
      { title: 'Miroir enchanté', description: 'Le dessin semble se refléter parfaitement. A-t-il une vraie symétrie ?' },
      { title: 'Rosace magique', description: 'Chaque côté paraît identique. Confirme si c’est bien symétrique.' },
      { title: 'Bouclier mystique', description: 'Le motif doit être le même à gauche et à droite. Est-ce le cas ?' }
    ],
    asymmetric: [
      { title: 'Miroir brisé', description: 'Quelque chose cloche dans ce reflet. Le motif est-il vraiment symétrique ?' },
      { title: 'Pattern étrange', description: 'Un côté est légèrement différent. Découvre s’il manque la symétrie.' },
      { title: 'Reflet imparfait', description: 'Observe bien les deux côtés : se correspondent-ils ?' }
    ]
  };

  const ORB_BLUEPRINTS = [
      {
        level: 1,
        title: 'Les Orbes du Vent \u{1F32C}',
        guardian: 'Nemiri, le colibri des brises douces',
        ambiance: 'Bleu ciel et filaments argent\u00e9s',
        mechanic: 'Toucher les orbes dans l’ordre des couleurs : bleu, vert puis blanc.',
        innerLogic: 'S\u00e9quence lin\u00e9aire : toute erreur renvoie au d\u00e9but.',
        learning: 'M\u00e9morisation visuelle et patience.',
        answer: 'Toucher les orbes dans l’ordre Bleu \u2192 Vert \u2192 Blanc.',
        options: [
          'Toucher les orbes dans l’ordre Bleu \u2192 Vert \u2192 Blanc.',
          'Les toucher tous en m\u00eame temps pour aller plus vite.',
          'Commencer par le blanc puis passer au vert.',
          'Attendre que Nemiri les active seul.'
        ]
      },
      {
        level: 2,
        title: 'Les Orbes de l\'Eau \u{1F4A7}',
        guardian: 'Lirio, le poisson de cristal',
        ambiance: 'Vert jade et reflets ondul\u00e9s',
        mechanic: 'Relier chaque goutte \u00e0 celle de m\u00eame couleur pour former un ruisseau.',
        innerLogic: 'Connexions par couleur et continuit\u00e9 du flux.',
        learning: 'Classification visuelle et rep\u00e9rage spatial.',
        answer: 'Relier chaque goutte \u00e0 sa jumelle de m\u00eame couleur.',
        options: [
          'Relier chaque goutte \u00e0 sa jumelle de m\u00eame couleur.',
          'Tracer une ligne droite qui coupe toutes les gouttes.',
          'Ne garder que les gouttes les plus grosses.',
          'Laisser l\'eau couler sans intervenir.'
        ]
      },
      {
        level: 3,
        title: 'Les Orbes du Feu \u{1F525}',
        guardian: 'S\u00e9lyr, le petit dragon des braises',
        ambiance: 'Rouge corail et lueurs dor\u00e9es',
        mechanic: 'Maintenir chaque orbe press\u00e9 1 s, 2 s puis 3 s selon sa vibration.',
        innerLogic: 'Gestion du tempo et contr\u00f4le fin du geste.',
        learning: 'Coordination main-oeil et attention soutenue.',
        answer: 'Maintenir chaque orbe appuy\u00e9 exactement le temps indiqu\u00e9.',
        options: [
          'Maintenir chaque orbe appuy\u00e9 exactement le temps indiqu\u00e9.',
          'Tapoter tr\u00e8s vite plusieurs fois de suite.',
          'Souffler sur l\'orbe pour le refroidir.',
          'Le secouer jusqu\'\u00e0 ce qu\'il s\'allume.'
        ]
      },
      {
        level: 4,
        title: 'Les Orbes du Son \u{1F3B5}',
        guardian: 'Lyra, la luciole musicienne',
        ambiance: 'Violet doux et ondes lumineuses',
        mechanic: '\u00c9couter puis reproduire une m\u00e9lodie de trois sons.',
        innerLogic: 'Comparaison et reproduction d\'un motif auditif.',
        learning: 'M\u00e9moire auditive et coordination.',
        answer: 'Rejouer la m\u00eame m\u00e9lodie dans l\'ordre exact.',
        options: [
          'Rejouer la m\u00eame m\u00e9lodie dans l\'ordre exact.',
          'Inventer une nouvelle chanson.',
          'Tapoter un seul orbe en rythme.',
          'Attendre que Lyra recommence trois fois.'
        ]
      },
      {
        level: 5,
        title: 'Les Orbes de la Terre \u{1F333}',
        guardian: 'Eilan, le renard mousse',
        ambiance: 'Bruns terreux et feuilles lumineuses',
        mechanic: 'Retourner deux feuilles \u00e0 la fois pour trouver des orbes jumeaux.',
        innerLogic: 'Jeu de memory classique.',
        learning: 'Observation et association visuelle.',
        answer: 'Retrouver chaque paire d\'orbes identiques cach\u00e9e sous les feuilles.',
        options: [
          'Retrouver chaque paire d\'orbes identiques cach\u00e9e sous les feuilles.',
          'Ramasser toutes les feuilles sans regarder.',
          'Chercher uniquement le renard.',
          'Choisir la feuille la plus brillante.'
        ]
      },
      {
        level: 6,
        title: 'Les Orbes du Temps \u23F1',
        guardian: 'Noctelle, l\'horloge lunaire',
        ambiance: 'Dor\u00e9 et reflets nocturnes',
        mechanic: 'Placer matin, cr\u00e9puscule et nuit dans l\'ordre chronologique.',
        innerLogic: 'Rep\u00e8res temporels et cause \u2192 effet.',
        learning: 'Compr\u00e9hension de la frise du temps.',
        answer: 'Organiser les sc\u00e8nes du matin vers la nuit.',
        options: [
          'Organiser les sc\u00e8nes du matin vers la nuit.',
          'Commencer par la nuit puis aller vers le matin.',
          'Classer selon la couleur dominante.',
          'Choisir la sc\u00e8ne la plus lumineuse.'
        ]
      },
      {
        level: 7,
        title: 'L\'Orbe \u00c9ternelle \u2728',
        guardian: 'L\u00e9na, porteuse de lumi\u00e8re',
        ambiance: 'Blanc opalin et particules iris\u00e9es',
        mechanic: 'Associer simultan\u00e9ment couleur, forme et son correspondants.',
        innerLogic: 'Combinaison multisensorielle finale.',
        learning: 'Synth\u00e8se des comp\u00e9tences mobilis\u00e9es.',
        answer: 'Choisir la combinaison couleur + forme + son qui s\'accordent.',
        options: [
          'Choisir la combinaison couleur + forme + son qui s\'accordent.',
          'Laisser l\'orbe choisir sa couleur pr\u00e9f\u00e9r\u00e9e.',
          'Utiliser uniquement le son le plus grave.',
          'Tapoter chaque orbe dans le d\u00e9sordre.'
        ]
      }
    ];

    const blueprint = ORB_BLUEPRINTS[(level - 1) % ORB_BLUEPRINTS.length];

    if (level > ORB_BLUEPRINTS.length) {
      const echoes = shuffle(ORB_BLUEPRINTS)
        .slice(0, 2)
        .map(entry => `${entry.title} : ${entry.mechanic}`);
      return {
        promptLines: [
          { text: `${blueprint.title}` },
          { text: 'Les orbes scintillent plus vite – souviens-toi de leurs voix.' },
          ...echoes.map(line => ({ text: line }))
        ],
        questionText: "Quelle règle dois-tu appliquer pour réveiller cette lueur ?",
        answer: blueprint.answer,
        options: shuffle(blueprint.options)
      };
    }

    const promptLines = [
      { text: `Niveau ${blueprint.level} : ${blueprint.title}` },
      { text: `Gardien : ${blueprint.guardian}` },
      { text: `Ambiance : ${blueprint.ambiance}` },
      { text: `Règle : ${blueprint.mechanic}` },
      { text: `Logique : ${blueprint.innerLogic}` },
      { text: `Ce que tu travailles : ${blueprint.learning}` }
    ];

    return {
      promptLines,
      questionText: "Quelle est la bonne action pour réveiller l'orbe ?",
      answer: blueprint.answer,
      options: shuffle(blueprint.options)
    };
  }

  function buildMirrorRow(leftSide, size) {
    const row = leftSide.slice();
    const mirror = size % 2 === 0
      ? leftSide.slice().reverse()
      : leftSide.slice(0, leftSide.length - 1).reverse();
    return row.concat(mirror);
  }

  function buildSymmetryQuestion(level) {
    const size = Math.min(5, 3 + Math.floor(level / 3));
    const palette = level >= 7 ? ['🟦', '🟧', '🟪', '🟩', '⬜'] : ['🟦', '⬜'];
    const symmetric = Math.random() < 0.5;
    const grid = [];
    const half = Math.ceil(size / 2);

    for (let r = 0; r < size; r++) {
      const left = [];
      for (let c = 0; c < half; c++) {
        left.push(randomChoice(palette));
      }
      const row = buildMirrorRow(left, size);
      grid.push(row);
    }

    if (!symmetric) {
      const rowIndex = rand(0, size - 1);
      const colIndex = rand(Math.floor(size / 2), size - 1);
      let replacement = grid[rowIndex][colIndex];
      let guard = 0;
      while (replacement === grid[rowIndex][colIndex] && guard < 10) {
        replacement = randomChoice(palette);
        guard++;
      }
      grid[rowIndex][colIndex] = replacement;
    }

    const scenePool = symmetric ? SYMMETRY_SCENES.symmetric : SYMMETRY_SCENES.asymmetric;
    const scene = scenePool[rand(0, scenePool.length - 1)];

    const rowsHTML = grid.map(row => `
        <div class="symmetry-scene__row">${row.map(cell => `<span class="symmetry-scene__cell">${cell}</span>`).join('')}</div>
      `).join('');

    const promptHTML = `
      <div class="symmetry-card ${symmetric ? 'symmetry-card--balanced' : 'symmetry-card--broken'}">
        <div class="symmetry-card__badge"><span>🪞 Symétrie</span></div>
        <p class="symmetry-card__title">${escapeHtml(scene.title)}</p>
        <p class="symmetry-card__detail">${escapeHtml(scene.description)}</p>
        <div class="symmetry-scene">${rowsHTML}</div>
      </div>
    `;

    const options = symmetric ? ['Symétrique', 'Pas symétrique'] : ['Pas symétrique', 'Symétrique'];
    const answer = symmetric ? 'Symétrique' : 'Pas symétrique';

    return {
      promptHTML,
      questionText: 'Ce motif est-il symétrique ?',
      answer,
      options,
      kind: 'symmetry',
      context: { symmetric }
    };
  }

  function buildComparisonQuestion(level) {
    const baseValue = 10 + level * 2;
    const cards = [
      { label: 'Carte A', value: baseValue + randomInt(-3, 4) },
      { label: 'Carte B', value: baseValue + randomInt(0, 6) },
      { label: 'Carte C', value: baseValue + randomInt(-5, 8) }
    ];
    const property = randomChoice(['poids', 'longueur', 'score']);
    const propertyMeta = {
      poids: {
        icon: '⚖️',
        accent: 'comparison-card--weight',
        title: 'Balance magique',
        subtitle: 'Compare les poids pour trouver le plus lourd.',
        hint: 'Poids mesuré',
        question: 'Quelle carte est la plus lourde ?',
        unit: 'kg'
      },
      longueur: {
        icon: '📏',
        accent: 'comparison-card--length',
        title: 'Règle lumineuse',
        subtitle: 'Compare les longueurs pour trouver la plus grande.',
        hint: 'Longueur mesurée',
        question: 'Quelle carte est la plus longue ?',
        unit: 'cm'
      },
      score: {
        icon: '⭐',
        accent: 'comparison-card--score',
        title: 'Défi des scores',
        subtitle: 'Compare les points pour trouver le meilleur score.',
        hint: 'Score total',
        question: 'Quel score est le plus élevé ?',
        unit: 'pts'
      }
    };
    const meta = propertyMeta[property] || propertyMeta.score;
    const unit = meta.unit;
    const answerCard = cards.reduce((best, card) => (card.value > best.value ? card : best), cards[0]);
    const answer = answerCard.label;
    const promptHTML = `
      <div class="comparison-prompt ${meta.accent}">
        <div class="comparison-prompt__emblem"><span>${meta.icon}</span></div>
        <div class="comparison-prompt__text">
          <span class="comparison-prompt__title">${meta.title}</span>
          <span class="comparison-prompt__subtitle">${meta.subtitle}</span>
        </div>
      </div>
      <div class="comparison-card-grid">
        ${cards.map(card => `
          <article class="comparison-card ${meta.accent}">
            <header class="comparison-card__header">
              <span class="comparison-card__letter">${card.label}</span>
              <span class="comparison-card__icon">${meta.icon}</span>
            </header>
            <div class="comparison-card__value">${card.value} ${unit}</div>
            <footer class="comparison-card__hint">${meta.hint}</footer>
          </article>
        `).join('')}
      </div>
    `;
    const options = shuffle(['Carte A', 'Carte B', 'Carte C', 'Toutes égales']);
    return {
      promptHTML,
      questionText: meta.question,
      answer,
      options,
      kind: 'comparison',
      context: {
        property,
        unit,
        meta,
        cards
      }
    };
  }

function buildNetworkQuestion(level) {
    const rows = 1 + Math.floor((level + 1) / 4);
    const cols = 1 + Math.floor((level + 2) / 4);
    const paths = binomial(rows + cols, rows);
    const distractors = uniqueArray([
      paths,
      paths + randomInt(-2, 2),
      paths + randomInt(3, 5),
      Math.max(1, paths - randomInt(1, 3))
    ]);
    const promptLines = [
      { text: `Quadrillage : ${rows + 1} lignes et ${cols + 1} colonnes.` },
      { text: 'On ne peut aller que vers la droite ou vers le haut.' }
    ];
    return {
      promptLines,
      questionText: 'Combien de chemins mènent du départ à l’arrivée ?',
      answer: String(paths),
      options: shuffle(distractors.map(String)).slice(0, 4)
    };
  }


  function buildLogicChainQuestion(level) {
    const scenarios = [
      {
        badge: "🧠 Déduction",
        icon: "🧠",
        title: "Boîte brillante",
        premises: [
          'Si une boîte brille, alors elle contient une clé.',
          'La boîte de Léna brille.'
        ],
        answer: 'Oui, la boîte contient la clé.',
        alternatives: ['Non, on ne peut pas être sûrs.', 'Non, la boîte n’a pas de clé.'],
        question: 'Quelle conclusion choisis-tu ?'
      },
      {
        badge: "🧠 Déduction",
        icon: "🔍",
        title: "Animal rayé",
        premises: [
          'Si un animal a des rayures, alors c’est un zèbre.',
          'L’animal mystère a des rayures.'
        ],
        answer: 'C’est un zèbre.',
        alternatives: ['Ce n’est pas forcément un zèbre.', 'C’est sûrement un tigre.'],
        question: 'Quelle conclusion choisis-tu ?'
      },
      {
        badge: "🧠 Déduction",
        icon: "📦",
        title: "Cadeau surprise",
        premises: [
          'Si une boîte est rouge, alors elle contient un jouet.',
          'Cette boîte est rouge.'
        ],
        answer: 'La boîte cache un jouet.',
        alternatives: ['La boîte ne contient rien.', 'On ne sait pas ce qu’il y a.'],
        question: 'Que peux-tu dire ?'
      },
      {
        badge: "🧠 Déduction",
        icon: "🌧️",
        title: "Prévision météo",
        premises: [
          'S’il pleut, le sol est mouillé.',
          'Il pleut maintenant.'
        ],
        answer: 'Le sol devient mouillé.',
        alternatives: ['Le sol reste sec.', 'On ne peut pas savoir.'],
        question: 'Que se passe-t-il ?'
      }
    ];
    const data = randomChoice(scenarios);
    const promptHTML = `
      <div class="logic-chain-card">
        <div class="logic-chain-card__badge"><span>${data.badge}</span></div>
        <div class="logic-chain-card__header">
          <span class="logic-chain-card__icon">${data.icon}</span>
          <span class="logic-chain-card__title">${escapeHtml(data.title)}</span>
        </div>
        <ul class="logic-chain-card__premises">
          ${data.premises.map(line => `<li>${escapeHtml(line)}</li>`).join('')}
        </ul>
      </div>
    `;
    const distractor = randomChoice(data.alternatives);
    const options = shuffle([data.answer, distractor]);
    return {
      promptHTML,
      questionText: data.question || 'Quelle conclusion peux-tu faire ?',
      answer: data.answer,
      options,
      kind: 'logic-chain',
      context: data
    };
  }

function buildRiddleQuestion(level) {
    const riddles = [
      { text: 'Je grandis quand on me nourrit, mais je meurs si on me donne de l’eau.', answer: 'Le feu', options: ['Le feu', 'Une fleur', 'Une fourmi', 'Un nuage'] },
      { text: 'Je commence par E, je finis par E, mais je ne contiens qu’une lettre.', answer: 'Une enveloppe', options: ['Une enveloppe', 'Une étagère', 'Une étoile', 'Une école'] },
      { text: 'Je peux voler sans ailes, pleurer sans yeux.', answer: 'Un nuage', options: ['Un nuage', 'Une abeille', 'Le vent', 'Une goutte'] },
      { text: 'Plus je prends, plus je laisse derrière moi.', answer: 'Des pas', options: ['Des pas', 'Des cadeaux', 'Des miettes', 'Des mots'] },
      { text: 'Je suis rempli de trous mais je retiens l’eau.', answer: 'Une éponge', options: ['Une éponge', 'Un seau', 'Un nuage', 'Un verre'] }
    ];
    const data = randomChoice(riddles);
    return {
      promptLines: [{ text: data.text }],
      questionText: 'Qui suis-je ?',
      answer: data.answer,
      options: shuffle(data.options)
    };
  }

  function buildDistributionQuestion(level) {
    const baseGroups = 2 + Math.floor(level / 3);
    const groups = Math.min(6, baseGroups);
    const itemsPerGroup = 2 + Math.floor((level + 1) / 3);
    const total = groups * itemsPerGroup;
    const item = randomChoice(['🍎', '🍪', '🍇', '🍒', '🥕']);
    const char = randomChoice(['amis', 'boîtes', 'paniers', 'équipes']);
    const promptLines = [
      { text: `${groups} ${char} reçoivent chacun ${itemsPerGroup} ${item}.` }
    ];
    const options = shuffle([total - randomInt(1, 4), total, total + randomInt(1, 4), total + itemsPerGroup]);
    return {
      promptLines,
      questionText: `Combien de ${item} en tout ?`,
      answer: String(total),
      options: options.map(String)
    };
  }

  function randomInt(min, max) {
    const lower = Math.ceil(Math.min(min, max));
    const upper = Math.floor(Math.max(min, max));
    if (upper <= lower) return lower;
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
  }

  function randomChoice(array) {
    return array[randomInt(0, array.length - 1)];
  }

  function shuffle(array) {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function uniqueArray(array) {
    return Array.from(new Set(array));
  }

  function rotateRow(row, shift) {
    const copy = row.slice();
    for (let i = 0; i < shift; i++) {
      copy.push(copy.shift());
    }
    return copy;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function binomial(n, k) {
    if (k < 0 || k > n) return 0;
    k = Math.min(k, n - k);
    let result = 1;
    for (let i = 1; i <= k; i++) {
      result = (result * (n - k + i)) / i;
    }
    return Math.round(result);
  }

  function svgPath() {
    return [
      '<path d="M5 5h14v14H5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
      '<path d="M9 9h6v6H13V11H9z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>'
    ].join('');
  }

  function svgWave() {
    return '<path d="M3 14c1.8-3.6 3.6 3.6 5.4 0s3.6-3.6 5.4 0 3.6 3.6 5.4 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  function svgBins() {
    return [
      '<rect x="4" y="9" width="4" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/>',
      '<rect x="10" y="5" width="4" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/>',
      '<rect x="16" y="11" width="4" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/>'
    ].join('');
  }

  function svgGrid() {
    return [
      '<rect x="4" y="4" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"/>',
      '<path d="M12 4v16M4 12h16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>'
    ].join('');
  }

  function svgMirror() {
    return [
      '<path d="M8 6l4 4-4 4M16 6l-4 4 4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      '<path d="M4 20h16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
    ].join('');
  }

  function svgScale() {
    return [
      '<path d="M12 5v14M6 9l-3 5h6l-3-5zm12 0l-3 5h6l-3-5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      '<path d="M8 19h8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
    ].join('');
  }

  function svgNet() {
    return [
      '<circle cx="6" cy="6" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/>',
      '<circle cx="18" cy="6" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/>',
      '<circle cx="6" cy="18" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/>',
      '<circle cx="18" cy="18" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/>',
      '<path d="M8 6h8M6 8v8M18 8v8M8 18h8" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>'
    ].join('');
  }

  function svgFlow() {
    return [
      '<rect x="5" y="5" width="6" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.4"/>',
      '<rect x="13" y="9" width="6" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.4"/>',
      '<rect x="9" y="15" width="6" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.4"/>',
      '<path d="M11 9v2M11 13l2 2M15 13v2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>'
    ].join('');
  }

  function svgSpy() {
    return [
      '<circle cx="10" cy="10" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/>',
      '<path d="M13 13l5 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
    ].join('');
  }

  function svgBalance() {
    return [
      '<path d="M4 12h16M12 4v16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
      '<circle cx="8" cy="8" r="2" fill="none" stroke="currentColor" stroke-width="1.3"/>',
      '<circle cx="16" cy="16" r="2" fill="none" stroke="currentColor" stroke-width="1.3"/>'
    ].join('');
  }

  window.logicGames = {
    LOGIC_GAMES,
    renderSection,
    start,
    getCompleted,
    getLevelCount: (gameId) => getTotalLevelsFor(gameId)
  };
})();
