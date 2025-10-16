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
    { id: 'symetrie', icon: '🪞', title: 'Symétrie Magique', svg: svgMirror(), playable: true },
    { id: 'cartes-comparatives', icon: '⚖', title: 'Cartes Comparatives', svg: svgScale(), playable: true },
    { id: 'reseaux-chemins', icon: '🔗', title: 'Réseaux de Chemins', svg: svgNet(), playable: true },
    { id: 'logigrammes', icon: '🧩', title: 'Logigrammes (Si… Alors…)', svg: svgFlow(), playable: true },
    { id: 'enigmes', icon: '💡', title: 'Jeu d’énigmes', svg: svgSpy(), playable: true },
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
      title: 'Jeu d’énigmes',
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
      onComplete: () => {
        markCompleted(gameId, level);
        context.markLevelCompleted();
        context.awardReward(reward.stars, reward.coins);
        context.showSuccessMessage('Bravo ! Niveau réussi ✨');
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

  function renderQuiz(context, { gameId, title, questions, reward, onComplete }) {
    let index = 0;
    const total = questions.length;

    context.content.innerHTML = '';
    const heading = document.createElement('div');
    heading.className = 'question-prompt fx-bounce-in-down';
    heading.textContent = title;
    context.content.appendChild(heading);

    const info = document.createElement('p');
    info.className = 'question-detail logic-level-intro';
    info.textContent = `Réponds aux ${total} énigmes pour gagner ${reward.stars} étoiles et ${reward.coins} pièces.`;
    context.content.appendChild(info);

    const card = document.createElement('div');
    card.className = 'puzzle-question-container fx-bounce-in-down';
    context.content.appendChild(card);

    const progressLabel = document.createElement('div');
    progressLabel.className = 'progress-tracker__label is-visible';
    progressLabel.textContent = `Question 1 / ${total}`;
    card.appendChild(progressLabel);

    const questionHolder = document.createElement('div');
    questionHolder.className = 'puzzle-equation fx-pop logic-question-block';
    card.appendChild(questionHolder);

    const optionsGrid = document.createElement('div');
    optionsGrid.className = 'puzzle-options logic-options-grid';
    card.appendChild(optionsGrid);

    context.configureBackButton('Retour aux niveaux', () => showLevelMenu(gameId, context, GAME_CONFIGS[gameId]));

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
        button.textContent = value;
        button.dataset.value = value;
        button.addEventListener('click', () => handleAnswer(button, String(current.answer), value));
        optionsGrid.appendChild(button);
      });
    }

    function handleAnswer(button, answer, candidate) {
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
      setTimeout(() => {
        index += 1;
        if (index >= total) {
          onComplete && onComplete();
        } else {
          Array.from(optionsGrid.children).forEach(btn => btn.classList.remove('is-correct', 'is-wrong'));
          Array.from(optionsGrid.children).forEach(btn => (btn.disabled = false));
          showQuestion();
        }
      }, 600);
    }
  }

  function renderPrompt(holder, question) {
    holder.innerHTML = '';
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

  function buildSymmetryQuestion(level) {
    const axis = randomChoice(['verticale', 'horizontale']);
    const max = 5 + Math.floor(level / 2);
    const x = randomInt(1, max);
    const y = randomInt(1, max);
    let answer;
    let promptLines;

    if (axis === 'verticale') {
      answer = `(${ -x }, ${ y })`;
      promptLines = [
        { text: `Point de départ : A(${x}, ${y}).` },
        { text: 'Symétrie par rapport à l’axe vertical (y).' }
      ];
    } else {
      answer = `(${ x }, ${ -y })`;
      promptLines = [
        { text: `Point de départ : A(${x}, ${y}).` },
        { text: 'Symétrie par rapport à l’axe horizontal (x).' }
      ];
    }

    const options = new Set([answer]);
    while (options.size < 4) {
      options.add(`(${ randomInt(-max, max) }, ${ randomInt(-max, max) })`);
    }

    return {
      promptLines,
      questionText: 'Quelle est l’image du point ?',
      answer,
      options: shuffle(Array.from(options))
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
    const unit = property === 'poids' ? 'kg' : property === 'longueur' ? 'cm' : 'pts';
    const promptLines = cards.map(c => ({ text: `${c.label} : ${c.value} ${unit}` }));
    const answer = cards.reduce((best, card) => (card.value > best.value ? card : best), cards[0]).label;
    const options = shuffle(['Carte A', 'Carte B', 'Carte C', 'Toutes égales']);
    return {
      promptLines,
      questionText: `Laquelle a le plus grand ${property} ?`,
      answer,
      options
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
        rules: ['Si un animal a des rayures, alors c’est un zèbre.', 'Le cheval de Léo a des rayures.'],
        answer: 'Le cheval de Léo est un zèbre.',
        distractors: ['Le cheval de Léo est un cheval blanc.', 'Le cheval de Léo est un tigre.', 'On ne sait rien.']
      },
      {
        rules: ['Si une boîte brille, alors elle contient une clé.', 'La boîte de Léna brille.'],
        answer: 'La boîte de Léna contient une clé.',
        distractors: ['La boîte de Léna est vide.', 'La boîte ne contient pas de clé.', 'La boîte contient un livre.']
      },
      {
        rules: ['Si une forme a quatre côtés égaux, alors c’est un carré.', 'La forme mystérieuse a quatre côtés égaux.'],
        answer: 'La forme mystérieuse est un carré.',
        distractors: ['La forme est un rectangle.', 'La forme est un triangle.', 'On ne peut pas conclure.']
      },
      {
        rules: ['Si un élève termine ses devoirs, alors il peut jouer.', 'Maya a fini ses devoirs.'],
        answer: 'Maya peut jouer.',
        distractors: ['Maya doit encore étudier.', 'Maya ne peut pas jouer.', 'On ne sait pas.']
      }
    ];
    const data = randomChoice(scenarios);
    const promptLines = data.rules.map(text => ({ text }));
    const options = shuffle(uniqueArray([data.answer, ...data.distractors]).slice(0, 4));
    return {
      promptLines,
      questionText: 'Quelle conclusion logique peux-tu faire ?',
      answer: data.answer,
      options
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

  // --- Helpers ---
  function randomInt(min, max) {
    const lower = Math.ceil(Math.min(min, max));
    const upper = Math.floor(Math.max(min, max));
    if (upper <= lower) return lower;
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
  }

  function pickEven() {
    return (randomInt(1, 4) * 2);
  }

  function pickOdd() {
    return (randomInt(0, 4) * 2 + 1);
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

  function rotateRow(row, shift) {
    const copy = row.slice();
    for (let i = 0; i < shift; i++) {
      copy.push(copy.shift());
    }
    return copy;
  }

  function uniqueArray(array) {
    return Array.from(new Set(array));
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

  function svgPath() { return '<path d="M4 12h16M12 4v16" stroke="#6b5bff" stroke-width="2" stroke-linecap="round"/>'; }
  function svgWave() { return '<path d="M2 12c3-6 7 6 10 0s7 6 10 0" fill="none" stroke="#3ac9a8" stroke-width="2" />'; }
  function svgBins() { return '<rect x="4" y="6" width="4" height="12" rx="1" fill="#6b5bff"/><rect x="10" y="3" width="4" height="15" rx="1" fill="#ffd36b"/><rect x="16" y="9" width="4" height="9" rx="1" fill="#3ac9a8"/>'; }
  function svgGrid() { return '<rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="#6b5bff"/><path d="M12 3v18M3 12h18" stroke="#6b5bff"/>'; }
  function svgMirror() { return '<path d="M4 4h16v16H4z" fill="none" stroke="#6b5bff"/><path d="M12 4v16" stroke="#ffd36b"/>'; }
  function svgScale() { return '<path d="M12 4v14M5 10l-3 3h6l-3-3zm14 0l-3 3h6l-3-3z" stroke="#6b5bff" fill="none"/>'; }
  function svgNet() { return '<path d="M4 6h16M4 12h16M4 18h16M8 3v18M16 3v18" stroke="#3ac9a8"/>'; }
  function svgFlow() { return '<circle cx="6" cy="6" r="2" fill="#6b5bff"/><path d="M8 6h8l2 3-2 3h-8" fill="none" stroke="#6b5bff"/><circle cx="18" cy="12" r="2" fill="#ffd36b"/>'; }
  function svgBalance() { return '<path d="M12 5l-6 6h12l-6-6zm0 0v14" stroke="#6b5bff" fill="none"/>'; }
  function svgSpy() { return '<circle cx="12" cy="12" r="7" fill="none" stroke="#6b5bff"/><circle cx="9" cy="11" r="1.5" fill="#6b5bff"/><circle cx="15" cy="11" r="1.5" fill="#6b5bff"/>'; }

  window.logicGames = {
    LOGIC_GAMES,
    renderSection,
    start,
    getCompleted,
    getLevelCount: () => TOTAL_LEVELS
  };
})();
