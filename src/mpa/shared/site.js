function setupSearch() {
  const input = document.querySelector('[data-search]');
  const cards = Array.from(document.querySelectorAll('[data-card]'));
  if (!input || cards.length === 0) return;

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    cards.forEach((card) => {
      const title = (card.dataset.title || '').toLowerCase();
      const tags = (card.dataset.tags || '').toLowerCase();
      const matches = !query || title.includes(query) || tags.includes(query);
      card.style.display = matches ? '' : 'none';
    });
  });
}

function setupTags() {
  const filter = document.querySelector('[data-filter]');
  if (!filter) return;
  const buttons = Array.from(filter.querySelectorAll('[data-tag]'));
  const cards = Array.from(document.querySelectorAll('[data-card]'));
  if (buttons.length === 0) return;

  function setActive(tag) {
    buttons.forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.tag === tag);
    });
    cards.forEach((card) => {
      const tags = (card.dataset.tags || '').split(',').map((t) => t.trim());
      const matches = tag === 'all' || tags.includes(tag);
      card.style.display = matches ? '' : 'none';
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => setActive(btn.dataset.tag));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupSearch();
  setupTags();
});
