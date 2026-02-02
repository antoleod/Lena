;(function () {
  'use strict';

  const translate = (key, fallback) => (window.i18n?.t ? window.i18n.t(key) : fallback);
  const t = (key, fallback) => translate(key, fallback);

  const normalize = (text) => (text || '').replace(/\s+/g, ' ').trim();

  function getSectionsData() {
    return [
      {
        id: 'segundo',
        title: '2º primaria',
        emoji: 0x1f4da,
        color: '#7bb8ff',
        items: [
          { label: t('gameBuildNumberTitle', 'Construye el número'), emoji: 0x1f9f1, href: '/game?game=build-number&level=1' },
          { label: t('gameSubtractTransformTitle', 'Restar es transformar'), emoji: 0x1f501, href: '/game?game=subtract-transform&level=1' },
          { label: t('gamePlaceValueTitle', 'Decenas y unidades'), emoji: 0x1f522, href: '/game?game=place-value&level=1' },
          { label: t('gameNumberLineTitle', 'Recta numérica'), emoji: 0x1f4c8, href: '/game?game=number-line&level=1' },
          { label: t('gameHalfTitle', 'La mitad'), emoji: 0x1f35a, href: '/game?game=half-game&level=1' },
          { label: t('gamePossessivesTitle', 'Possessifs en contexte'), emoji: 0x1f4ac, href: '/game?game=possessives&level=1' },
          { label: t('itemMathSprint', 'Maths Sprint'), emoji: 0x26a1, aliases: [t('itemMathSprint', 'Maths Sprint')] },
          { label: t('itemAdditions', 'Additions'), emoji: 0x2795 },
          { label: t('itemSubtractions', 'Soustractions'), emoji: 0x2796 },
          { label: t('itemMultiplications', 'Multiplications'), emoji: 0x2716 },
          { label: t('itemDivisions', 'Divisions'), emoji: 0x2797 },
          { label: t('itemTime', 'Temps & Horloges'), emoji: 0x23f0 },
          { label: t('itemRepartis', 'Répartis & Multiplie'), emoji: 0x1f34e, aliases: [t('itemRepartis', 'Répartis & Multiplie')] },
          { label: 'Tables Défi', emoji: 0x2716, aliases: ['Tables Défi'] },
          { label: t('itemReading', 'Lecture Magique'), emoji: 0x1f4d8 },
          { label: t('itemDictation', 'Dictée Magique'), emoji: 0x270d },
          { label: t('itemToolWords', 'Mots-Outils'), emoji: 0x1f5e3, aliases: [t('itemToolWords', 'Mots-Outils')] },
          { label: t('itemTales', 'Contes Magiques'), emoji: 0x1f4d6 },
          { label: t('itemBigAdventure', 'La Grande Aventure des Mots'), emoji: 0x1f524, aliases: [t('itemBigAdventure', 'La Grande Aventure des Mots'), 'Grande Aventure des Mots'] },
          { label: t('itemMemory', 'Mémoire Magique'), emoji: 0x1f9e0, aliases: [t('itemMemory', 'Mémoire Magique')] },
          { label: t('itemSorting', 'Tri & Classement'), emoji: 0x1f5c2, aliases: [t('itemSorting', 'Tri & Classement'), 'Jeu de Tri'] },
          { label: t('itemSequences', 'Jeu des Séquences'), emoji: 0x1f537, aliases: [t('itemSequences', 'Jeu des Séquences')] },
          { label: t('itemRiddles', "Jeu d'Énigmes"), emoji: 0x1f4a1 },
          { label: t('itemLogicgrams', 'Logigrammes'), emoji: 0x1f9e9, aliases: [t('itemLogicgrams', 'Logigrammes')] },
          { label: t('itemPuzzle', 'Puzzle Magique'), emoji: 0x1f9e9 },
          { label: t('itemNature', 'Découvre la Nature'), emoji: 0x1f333, aliases: [t('itemNature', 'Découvre la Nature')] },
          { label: t('itemWorldMap', 'Carte du Monde Interactive'), emoji: 0x1f30d, aliases: [t('itemWorldMap', 'Carte du Monde Interactive'), 'Carte du Monde'] },
          { label: t('itemEmotions', 'Émotions Magiques'), emoji: 0x1f60a },
          { label: t('itemDailyMissions', 'Missions du Jour'), emoji: 0x2705 },
          { label: t('itemDailyQuiz', 'Quiz du Jour'), emoji: 0x1f31e, aliases: [t('itemDailyQuiz', 'Quiz du Jour')] },
          { label: t('itemBreath', 'Respire & Repose-toi'), emoji: 0x1f9d8 },
          { label: t('itemSelfExpression', 'Expression de Soi / Mon Journal'), emoji: 0x1f4ac }
        ]
      },
      {
        id: 'tercero',
        title: '3º primaria',
        emoji: 0x1f4d8,
        color: '#ff9fb2',
        items: [
          { label: t('gamePlaceValueTitle', 'Decenas y unidades'), emoji: 0x1f522, href: '/game?game=place-value&level=1' },
          { label: t('gameNumberLineTitle', 'Recta numérica'), emoji: 0x1f4c8, href: '/game?game=number-line&level=1' },
          { label: t('gameMultDivTitle', 'Familias × ÷'), emoji: 0x2716, href: '/game?game=mult-div-families&level=1' },
          { label: t('gameWordProblemsTitle', 'Problemas cortos'), emoji: 0x1f4a1, href: '/game?game=word-problems&level=1' },
          { label: t('gamePossessivesTitle', 'Possessifs en contexte'), emoji: 0x1f4ac, href: '/game?game=possessives&level=5' },
          { label: t('itemMultiplications', 'Multiplications'), emoji: 0x2716 },
          { label: t('itemDivisions', 'Divisions'), emoji: 0x2797 },
          { label: t('itemMathSprint', 'Maths Sprint'), emoji: 0x26a1, aliases: [t('itemMathSprint', 'Maths Sprint')] },
          { label: 'Problèmes Magiques', emoji: 0x1f4a1 },
          { label: 'Fractions Fantastiques', emoji: 0x1f370 },
          { label: t('itemTime', 'Temps & Horloges'), emoji: 0x23f0 },
          { label: 'Tables Défi', emoji: 0x2716, aliases: ['Tables Défi'] },
          { label: 'Séries Numériques', emoji: 0x1f522 },
          { label: 'Mesures Magiques', emoji: 0x1f4cf },
          { label: t('itemRepartis', 'Répartis & Multiplie'), emoji: 0x1f34e, aliases: [t('itemRepartis', 'Répartis & Multiplie')] },
          { label: t('itemReading', 'Lecture Magique'), emoji: 0x1f4d8 },
          { label: t('itemDictation', 'Dictée Magique'), emoji: 0x270d },
          { label: t('itemToolWords', 'Mots-Outils'), emoji: 0x1f5e3, aliases: [t('itemToolWords', 'Mots-Outils')] },
          { label: t('itemTales', 'Contes Magiques'), emoji: 0x1f4d6 },
          { label: t('itemBigAdventure', 'La Grande Aventure des Mots'), emoji: 0x1f524, aliases: [t('itemBigAdventure', 'La Grande Aventure des Mots'), 'Grande Aventure des Mots'] },
          { label: t('itemLogicgrams', 'Logigrammes'), emoji: 0x1f9e9, aliases: [t('itemLogicgrams', 'Logigrammes')] },
          { label: 'Labyrinthe Logique', emoji: 0x1f9ed },
          { label: 'Sudoku Junior', emoji: 0x1f522 },
          { label: t('itemPuzzle', 'Puzzle Magique'), emoji: 0x1f9e9 },
          { label: t('itemEmotions', 'Émotions Magiques'), emoji: 0x1f60a },
          { label: t('itemDailyMissions', 'Missions du Jour'), emoji: 0x2705 },
          { label: t('itemDailyQuiz', 'Quiz du Jour'), emoji: 0x1f31e, aliases: [t('itemDailyQuiz', 'Quiz du Jour')] },
          { label: t('itemBreath', 'Respire & Repose-toi'), emoji: 0x1f9d8 },
          { label: t('itemSelfExpression', 'Expression de Soi / Mon Journal'), emoji: 0x1f4ac }
        ]
      },
      {
        id: 'cuarto',
        title: '4º primaria',
        emoji: 0x1f4d7,
        color: '#8bdba2',
        items: [
          { label: t('gameMultDivTitle', 'Familias × ÷'), emoji: 0x2716, href: '/game?game=mult-div-families&level=6' },
          { label: t('gameWordProblemsTitle', 'Problemas cortos'), emoji: 0x1f4a1, href: '/game?game=word-problems&level=7' },
          { label: t('gamePossessivesTitle', 'Possessifs en contexte'), emoji: 0x1f4ac, href: '/game?game=possessives&level=9' },
          { label: 'Fractions Fantastiques', emoji: 0x1f370 },
          { label: 'Problèmes Magiques', emoji: 0x1f4a1 },
          { label: 'Mesures Magiques', emoji: 0x1f4cf },
          { label: 'Séries Numériques', emoji: 0x1f522 },
          { label: 'Tables Défi', emoji: 0x2716, aliases: ['Tables Défi'] },
          { label: t('itemDivisions', 'Divisions'), emoji: 0x2797 },
          { label: t('itemMathSprint', 'Maths Sprint'), emoji: 0x26a1, aliases: [t('itemMathSprint', 'Maths Sprint')] },
          { label: t('itemLogicgrams', 'Logigrammes'), emoji: 0x1f9e9, aliases: [t('itemLogicgrams', 'Logigrammes')] },
          { label: 'Labyrinthe Logique', emoji: 0x1f9ed },
          { label: 'Sudoku Junior', emoji: 0x1f522 },
          { label: t('itemPuzzle', 'Puzzle Magique'), emoji: 0x1f9e9 },
          { label: t('itemReading', 'Lecture Magique'), emoji: 0x1f4d8 },
          { label: t('itemDictation', 'Dictée Magique'), emoji: 0x270d },
          { label: t('itemToolWords', 'Mots-Outils'), emoji: 0x1f5e3, aliases: [t('itemToolWords', 'Mots-Outils')] },
          { label: t('itemTales', 'Contes Magiques'), emoji: 0x1f4d6 },
          { label: t('itemBigAdventure', 'La Grande Aventure des Mots'), emoji: 0x1f524, aliases: [t('itemBigAdventure', 'La Grande Aventure des Mots'), 'Grande Aventure des Mots'] },
          { label: t('itemEmotions', 'Émotions Magiques'), emoji: 0x1f60a }
        ]
      }
    ];
  }

  const CATEGORY_FILTERS = {
    segundo: ['segundo'],
    tercero: ['tercero'],
    cuarto: ['cuarto']
  };

  const CATEGORY_TITLES = {
    segundo: '2º primaria',
    tercero: '3º primaria',
    cuarto: '4º primaria'
  };

  function collectSources() {
    const map = new Map();
    document.querySelectorAll('#content .topic-btn, #content #logic-games .game-card').forEach((node) => {
      const labelEl = node.querySelector('.topic-btn__text, .title, .game-title');
      const text = normalize(labelEl ? labelEl.textContent : node.textContent);
      if (text && !map.has(text)) {
        map.set(text, node);
      }
    });
    return map;
  }

  function findSource(item, sources) {
    const aliases = item.aliases || [item.label];
    for (const alias of aliases) {
      const key = normalize(alias);
      if (sources.has(key)) return sources.get(key);
    }
    return null;
  }

  function buildSections() {
    const container = document.getElementById('mm-sections');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const activeCategory = params.get('cat');

    const sources = collectSources();
    const hasMenu = sources.size > 0;
    container.classList.toggle('mm-hide', !hasMenu);
    if (!hasMenu) {
      container.innerHTML = '';
      return;
    }

    document.querySelectorAll('#content .options-grid, #content #logic-games').forEach((el) => {
      if (el.querySelector('.topic-btn, .game-card')) {
        el.classList.add('mm-hide');
      }
    });

    container.innerHTML = '';
    let sectionsData = getSectionsData();
    if (activeCategory && CATEGORY_FILTERS[activeCategory]) {
      sectionsData = sectionsData.filter((section) => CATEGORY_FILTERS[activeCategory].includes(section.id));
      if (CATEGORY_TITLES[activeCategory]) {
        document.title = `Juegos · ${CATEGORY_TITLES[activeCategory]} - Lena`;
      }
    }

    sectionsData.forEach((section, index) => {
      const card = document.createElement('article');
      card.className = 'mm-section-card';
      card.style.setProperty('--card-index', index);
      if (section.color) {
        card.style.setProperty('--section-color', section.color);
        card.style.setProperty('--section-color-soft', `${section.color}40`);
      }
      const header = document.createElement('div');
      header.className = 'mm-section-header';
      const title = document.createElement('h3');
      title.className = 'mm-section-title';
      const emojiSpan = document.createElement('span');
      emojiSpan.className = 'mm-emoji';
      if (section.emoji) {
        emojiSpan.textContent = typeof section.emoji === 'number' ? String.fromCodePoint(section.emoji) : section.emoji;
      } else {
        emojiSpan.textContent = String.fromCodePoint(0x2728);
      }
      title.appendChild(emojiSpan);
      title.appendChild(document.createTextNode(' ' + section.title));
      header.appendChild(title);
      card.appendChild(header);
      const grid = document.createElement('div');
      grid.className = 'mm-chip-grid';

      section.items.forEach((item) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'mm-chip';
        const emojiSpanChip = document.createElement('span');
        emojiSpanChip.className = 'mm-emoji';
        if (item.emoji) {
          emojiSpanChip.textContent = typeof item.emoji === 'number' ? String.fromCodePoint(item.emoji) : item.emoji;
        } else {
          emojiSpanChip.textContent = String.fromCodePoint(0x1f3af);
        }
        chip.appendChild(emojiSpanChip);
        const labelSpan = document.createElement('span');
        labelSpan.textContent = item.label;
        chip.appendChild(labelSpan);

        if (item.href) {
          chip.addEventListener('click', () => {
            window.location.href = item.href;
          });
        } else {
          const target = findSource(item, sources);
          if (target) {
            chip.addEventListener('click', () => {
              if (typeof target.focus === 'function') {
                target.focus();
              }
              target.click();
            });
          } else {
            chip.disabled = true;
          }
        }

        grid.appendChild(chip);
      });

      card.appendChild(grid);
      container.appendChild(card);
    });
  }

  const contentEl = document.getElementById('content');
  if (!contentEl) return;

  const observer = new MutationObserver(() => buildSections());
  observer.observe(contentEl, { childList: true, subtree: true });

  document.addEventListener('DOMContentLoaded', buildSections);
  window.addEventListener('load', buildSections);
  document.addEventListener('lena:language:change', buildSections);
})();
