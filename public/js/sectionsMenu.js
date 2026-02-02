;(function () {
  'use strict';

  const translate = (key, fallback) => (window.i18n?.t ? window.i18n.t(key) : fallback);
  const t = (key, fallback) => translate(key, fallback);

  const normalize = (text) => (text || '').replace(/\s+/g, ' ').trim();

  function getSectionsData() {
    return [
      {
        title: t('sectionNewGamesTitle', 'Nouveaux Jeux'),
        emoji: 0x1f680,
        color: '#FF8FAB',
        items: [
          {
            label: t('baseTenBuildTitle', 'Construis le nombre'),
            emoji: 0x1f9f1,
            aliases: [t('baseTenBuildTitle', 'Construis le nombre')]
          },
          {
            label: t('baseTenSubtractTitle', 'Soustraire, c\u0027est transformer'),
            emoji: 0x1f501,
            aliases: [t('baseTenSubtractTitle', 'Soustraire, c\u0027est transformer')]
          }
        ]
      },
      {
        title: t('sectionMathTitle', 'Math\u00e9matiques'),
        emoji: 0x1f9ee,
        color: '#4A90E2',
        items: [
          { label: t('itemAdditions', 'Additions'), emoji: 0x2795 },
          { label: t('itemSubtractions', 'Soustractions'), emoji: 0x2796 },
          { label: t('itemMultiplications', 'Multiplications'), emoji: 0x2716 },
          { label: t('itemDivisions', 'Divisions'), emoji: 0x2797 },
          { label: t('itemMathSprint', 'Maths Sprint'), emoji: 0x26a1, aliases: [t('itemMathSprint', 'Maths Sprint')] },
          { label: t('itemAbacus', 'Abaque Magique'), emoji: 0x1f9ee, aliases: [t('itemAbacus', 'Abaque Magique')] },
          { label: t('itemNumberHouses', 'Maisons des Nombres'), emoji: 0x1f3e0, aliases: [t('itemNumberHouses', 'Maisons des Nombres')] },
          { label: t('itemTime', 'Temps & Horloges'), emoji: 0x23f0 },
          { label: t('itemMeasures', 'Mesures Magiques'), emoji: 0x1f4cf, aliases: [t('itemMeasures', 'Mesures Magiques')] },
          { label: t('itemFractions', 'Fractions Fantastiques'), emoji: 0x1f355 }
        ]
      },
      {
        title: t('sectionLogicTitle', 'Logique & Raisonnement'),
        emoji: 0x1f9e0,
        color: '#7B2CBF',
        items: [
          { label: t('itemLabyrinth', 'Labyrinthe Logique'), emoji: 0x1f9ed },
          { label: t('itemSequences', 'Jeu des S\u00e9quences'), emoji: 0x1f537, aliases: [t('itemSequences', 'Jeu des S\u00e9quences')] },
          { label: t('itemSorting', 'Tri & Classement'), emoji: 0x1f5c2, aliases: [t('itemSorting', 'Tri & Classement'), 'Jeu de Tri'] },
          { label: t('itemMemory', 'M\u00e9moire Magique'), emoji: 0x1f9e0, aliases: [t('itemMemory', 'M\u00e9moire Magique')] },
          { label: t('itemSudoku', 'Sudoku Junior'), emoji: 0x1f522 },
          { label: t('itemSymmetry', 'Sym\u00e9trie Magique'), emoji: 0x1fa9e },
          { label: t('itemComparisonCards', 'Cartes Comparatives'), emoji: 0x2696, aliases: [t('itemComparisonCards', 'Cartes Comparatives')] },
          { label: t('itemPathNetworks', 'R\u00e9seaux de Chemins'), emoji: 0x1f517 },
          { label: t('itemLogicgrams', 'Logigrammes (Si... Alors...)'), emoji: 0x1f9e9, aliases: [t('itemLogicgrams', 'Logigrammes (Si... Alors...)'), 'Logigrammes'] },
          { label: t('itemRiddles', 'Jeu d\u0027\u00c9nigmes'), emoji: 0x1f4a1 },
          { label: t('itemRepartis', 'R\u00e9partis & Multiplie'), emoji: 0x1f34e }
        ]
      },
      {
        title: t('sectionWordsTitle', 'Mots & Lecture'),
        emoji: 0x1f4d6,
        color: '#F5A623',
        items: [
          { label: t('itemReading', 'Lecture Magique'), emoji: 0x1f4d8 },
          { label: t('itemBigAdventure', 'La Grande Aventure des Mots'), emoji: 0x1f524, aliases: [t('itemBigAdventure', 'La Grande Aventure des Mots'), 'Grande Aventure des Mots'] },
          { label: t('itemToolWords', 'Mots-Outils'), emoji: 0x1f5e3, aliases: [t('itemToolWords', 'Mots-Outils')] },
          { label: t('itemVowels', 'Jeu des Voyelles'), emoji: 0x1f170, aliases: [t('itemVowels', 'Jeu des Voyelles')] },
          { label: t('itemWitches', 'Les Sorci\u00e8res - Jeu de M\u00e9moire Magique'), emoji: 0x1f9d9, aliases: [t('itemWitches', 'Les Sorci\u00e8res - Jeu de M\u00e9moire Magique'), 'Les Sorci\u00e8res'] },
          { label: t('itemDictation', 'Dict\u00e9e Magique'), emoji: 0x270d }
        ]
      },
      {
        title: t('sectionCreativeTitle', 'Cr\u00e9atif & Monde'),
        emoji: 0x1f308,
        color: '#50E3C2',
        items: [
          { label: t('itemColors', 'Les Couleurs / Atelier d\u0027Art'), emoji: 0x1f3a8, aliases: [t('itemColors', 'Les Couleurs / Atelier d\u0027Art'), 'Les Couleurs'] },
          { label: t('itemPuzzle', 'Puzzle Magique'), emoji: 0x1f9e9 },
          { label: t('itemWorldMap', 'Carte du Monde Interactive'), emoji: 0x1f30d, aliases: [t('itemWorldMap', 'Carte du Monde Interactive'), 'Carte du Monde'] },
          { label: t('itemNature', 'D\u00e9couvre la Nature'), emoji: 0x1f333, aliases: [t('itemNature', 'D\u00e9couvre la Nature')] },
          { label: t('itemCursive', 'J\u0027\u00e9cris en cursive'), emoji: 0x270f },
          { label: t('itemTales', 'Contes Magiques'), emoji: 0x1f4d6 }
        ]
      },
      {
        title: t('sectionEmotionsTitle', 'C\u0153ur & \u00c9motions'),
        emoji: 0x1f496,
        color: '#F783AC',
        items: [
          { label: t('itemEmotions', '\u00c9motions Magiques'), emoji: 0x1f60a },
          { label: t('itemDailyMissions', 'Missions du Jour'), emoji: 0x2705 },
          { label: t('itemDailyQuiz', 'Quiz du Jour'), emoji: 0x1f31e, aliases: [t('itemDailyQuiz', 'Quiz du Jour')] },
          { label: t('itemBreath', 'Respire & Repose-toi'), emoji: 0x1f9d8 },
          { label: t('itemSelfExpression', 'Expression de Soi / Mon Journal'), emoji: 0x1f4ac }
        ]
      }
    ];
  }

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
    const sectionsData = getSectionsData();
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
