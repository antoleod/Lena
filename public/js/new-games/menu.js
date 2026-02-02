;(function () {
  'use strict';

  const registry = window.newGamesRegistry;
  const container = document.getElementById('mm-sections');
  if (!registry || !container) { return; }

  function openGame(gameId) {
    if (!registry.getGame(gameId) && window.inlineGameRouter?.open) {
      window.inlineGameRouter.open(gameId);
      return;
    }
    window.location.href = `/game?game=${encodeURIComponent(gameId)}&level=1`;
  }

  function buildCard() {
    container.innerHTML = '';
    const card = document.createElement('article');
    card.className = 'mm-section-card';
    card.style.setProperty('--section-color', '#FF8FAB');
    card.style.setProperty('--section-color-soft', '#FF8FAB40');

    const header = document.createElement('div');
    header.className = 'mm-section-header';
    const title = document.createElement('h3');
    title.className = 'mm-section-title';
    const emojiSpan = document.createElement('span');
    emojiSpan.className = 'mm-emoji';
    emojiSpan.textContent = '🚀';
    const titleText = document.createElement('span');
    titleText.setAttribute('data-i18n', 'sectionNewGamesTitle');
    title.appendChild(emojiSpan);
    title.appendChild(titleText);
    header.appendChild(title);
    card.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'mm-chip-grid';
    registry.games.forEach((game) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'mm-chip';
      chip.dataset.game = game.id;
      chip.setAttribute('data-i18n-attr', 'aria-label');
      chip.setAttribute('data-i18n-key', game.titleKey);
      const icon = document.createElement('span');
      icon.className = 'mm-emoji';
      icon.textContent = '🎯';
      const label = document.createElement('span');
      label.setAttribute('data-i18n', game.titleKey);
      chip.append(icon, label);
      chip.addEventListener('click', () => openGame(game.id));
      grid.appendChild(chip);
    });

    card.appendChild(grid);
    container.appendChild(card);
    if (window.i18n?.apply) {
      window.i18n.apply(container);
    }
  }

  buildCard();
  document.addEventListener('lena:language:change', buildCard);
})();
