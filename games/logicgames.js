;(function () {
  'use strict';

  const STORAGE_KEY = 'logicGamesProgress_v2';
  const TOTAL_LEVELS = 12;
  const QUESTIONS_PER_LEVEL = 7;

  const LOGIC_GAMES = [
    { id: 'labyrinthe', icon: '🧭', title: 'Labyrinthe Logique', svg: svgPath(), playable: true },
    { id: 'series-motifs', icon: '🔷', title: 'Séries & Motifs', svg: svgWave(), playable: true },
    { id: 'tri-classement', icon: '🗂', title: 'Tri & Classement', svg: svgBins(), playable: true },
    { id: 'sudoku-junior', icon: '🔢', title: 'Sudoku Junior', svg: svgGrid(), playable: true },
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
      generateLevel(level) {
        return Array.from({ length: QUESTIONS_PER_LEVEL }, () => buildLabyrinthQuestion(level));
      }
    },
    'series-motifs': {
      title: 'Séries & Motifs',
      generateLevel(level) {
        return Array.from({ length: QUESTIONS_PER_LEVEL }, () => buildSeriesQuestion(level));
      }
    },
    'tri-classement': {
      title: 'Tri & Classement',
      generateLevel(level) {
        return Array.from({ length: QUESTIONS_PER_LEVEL }, () => buildSortingQuestion(level));
      }
    },
    'sudoku-junior': {
      title: 'Sudoku Junior',
      generateLevel(level) {
        return Array.from({ length: QUESTIONS_PER_LEVEL }, () => buildMiniSudokuQuestion(level));
      }
    },
    'symetrie': {
      title: 'Symétrie Magique',
      generateLevel(level) {
        return Array.from({ length: QUESTIONS_PER_LEVEL }, () => buildSymmetryQuestion(level));
      }
    },
    'orbes-lumiere': {
      title: 'Les Orbes de Lumière',
      generateLevel(level) {
        return Array.from({ length: QUESTIONS_PER_LEVEL }, () => buildOrbesDeLumiereQuestion(level));
      }
    },
    'cartes-comparatives': {
      title: 'Cartes Comparatives',
      generateLevel(level) {
        return Array.from({ length: QUESTIONS_PER_LEVEL }, () => buildComparisonQuestion(level));
      }
    },
    'reseaux-chemins': {
      title: 'Réseaux de Chemins',
      generateLevel(level) {
        return Array.from({ length: QUESTIONS_PER_LEVEL }, () => buildNetworkQuestion(level));
      }
    },
    'logigrammes': {
      title: 'Logigrammes (Si… Alors…)',
      generateLevel(level) {
        return Array.from({ length: QUESTIONS_PER_LEVEL }, () => buildLogicChainQuestion(level));
      }
    },
    'enigmes': {
      title: "Jeu d’énigmes",
      generateLevel(level) {
        return Array.from({ length: QUESTIONS_PER_LEVEL }, () => buildRiddleQuestion(level));
      }
    },
    'repartis-multiplie': {
      title: 'Répartis & Multiplie',
      generateLevel(level) {
        return Array.from({ length: QUESTIONS_PER_LEVEL }, () => buildDistributionQuestion(level));
      }
    }
  };

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
    return Math.max(0, Math.min(TOTAL_LEVELS, progress[gameId]?.completed || 0));
  }

  function markCompleted(gameId, nextLevel) {
    const progress = loadProgress();
    progress[gameId] = { completed: Math.max(getCompleted(gameId), nextLevel) };
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
      const progress = Math.round((getCompleted(game.id) / TOTAL_LEVELS) * 100);
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
    const completed = getCompleted(gameId);
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
    for (let level = 1; level <= TOTAL_LEVELS; level++) {
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
    const questions = config.generateLevel(level).slice(0, QUESTIONS_PER_LEVEL);
    const reward = computeReward(level);
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
    const clamped = Math.max(1, Math.min(level, TOTAL_LEVELS));
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
      const current = questions[index];
      renderPrompt(questionHolder, current);
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

  function renderPrompt(holder, question) {
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

  function renderPrompt(holder, question) {
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
  function buildLabyrinthQuestion(level) {
    const size = Math.min(6, 4 + Math.floor(level / 3));
    let row = size - 1;
    let col = 0;
    const steps = 3 + Math.min(6, Math.floor(level / 2) + 2);
    const numbers = [];

    for (let i = 0; i < steps; i++) {
      const atTop = row === 0;
      const atRight = col === size - 1;
      let even = Math.random() < 0.5;
      if (atRight) even = false;
      if (atTop) even = true;

      if (even) {
        col += 1;
        numbers.push(pickEven());
      } else {
        row -= 1;
        numbers.push(pickOdd());
      }
    }

    const answer = `L${row + 1} C${col + 1}`;
    const options = new Set([answer]);
    while (options.size < 4) {
      const r = clamp(row + randomInt(-1, 1), 0, size - 1);
      const c = clamp(col + randomInt(-1, 1), 0, size - 1);
      options.add(`L${r + 1} C${c + 1}`);
    }

    const promptLines = [
      { text: 'Règle : nombre pair ⇒ avance à droite, impair ⇒ monte.' },
      { text: `Départ : bas gauche (L${size} C1).` },
      { text: `Suite de nombres : ${numbers.join(', ')}` }
    ];
    return {
      promptLines,
      questionText: 'Quelle case atteins-tu ?',
      answer,
      options: shuffle(Array.from(options))
    };
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

  function pickEven() {
    return (randomInt(1, 4) * 2);
  }

  function pickOdd() {
    return (randomInt(0, 4) * 2 + 1);
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
    getLevelCount: () => TOTAL_LEVELS
  };
})();
