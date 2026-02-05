import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GAMES, YEARS, getGamesByYear, getYearById } from '../src/data/games.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const siteTitle = 'Lena';
const baseUrl = '%BASE_URL%';

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderNav(active) {
  const items = [
    { key: 'home', label: 'Home', href: `${baseUrl}` },
    { key: 'juegos', label: 'Juegos', href: `${baseUrl}juegos/` },
    { key: 'segundo', label: '2o ano', href: `${baseUrl}juegos/segundo/` },
    { key: 'tercero', label: '3o ano', href: `${baseUrl}juegos/tercero/` }
  ];

  const links = items.map((item) => (
    `<a class="nav-link${active === item.key ? ' is-active' : ''}" href="${item.href}">${item.label}</a>`
  )).join('');

  return `
    <header class="site-header">
      <div class="site-brand">
        <span class="brand-mark">L</span>
        <div>
          <strong>${siteTitle}</strong>
          <span>Aprender jugando</span>
        </div>
      </div>
      <nav class="site-nav" aria-label="Principal">
        ${links}
      </nav>
    </header>
  `;
}

function renderBreadcrumbs(crumbs) {
  if (!crumbs || !crumbs.length) return '';
  const items = crumbs.map((crumb, index) => {
    const label = escapeHtml(crumb.label);
    if (crumb.href && index < crumbs.length - 1) {
      return `<a href="${crumb.href}">${label}</a>`;
    }
    return `<span>${label}</span>`;
  }).join('<span class="crumb-sep">/</span>');

  return `<nav class="breadcrumbs" aria-label="Breadcrumbs">${items}</nav>`;
}

function renderLayout({ title, description, bodyClass, navKey, content, extraHead = '', extraBody = '' }) {
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDescription = description || 'Juegos educativos para primaria.';

  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(fullTitle)}</title>
    <meta name="description" content="${escapeHtml(metaDescription)}" />
    <base href="${baseUrl}" />
    <link rel="manifest" href="${baseUrl}manifest.json" />
    <link rel="icon" href="${baseUrl}assets/iconos/icon-32.png" sizes="32x32" />
    <link rel="shortcut icon" href="${baseUrl}assets/iconos/icon-32.png" />
    <link rel="apple-touch-icon" href="${baseUrl}assets/iconos/icon-180.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700;900&family=Nunito:wght@600;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="${baseUrl}src/mpa/shared/site.css" />
    ${extraHead}
  </head>
  <body class="${bodyClass || ''}" data-nav="${navKey || ''}">
    <div class="site-shell">
      ${renderNav(navKey)}
      ${content}
      <footer class="site-footer">
        <span>Hecho con cuidado para aprender en casa y en clase.</span>
      </footer>
    </div>
    <script type="module" src="${baseUrl}src/mpa/shared/site.js"></script>
    ${extraBody}
  </body>
</html>`;
}

function renderHome() {
  const content = `
    <main class="home-hero">
      <section class="hero-card">
        <span class="eyebrow">Bienvenida</span>
        <h1>Explora practicas y juegos por nivel</h1>
        <p>
          Accede a rutas claras por ano y a juegos individuales con niveles
          para practicar cada dia.
        </p>
        <div class="hero-actions">
          <a class="btn-primary" href="${baseUrl}juegos/">Explorar juegos</a>
          <a class="btn-secondary" href="${baseUrl}juegos/segundo/">Ver 2o ano</a>
        </div>
      </section>
      <section class="hero-panel">
        <div>
          <span>Juegos</span>
          <strong>${GAMES.length}</strong>
        </div>
        <div>
          <span>Niveles</span>
          <strong>10+</strong>
        </div>
        <div>
          <span>Anos</span>
          <strong>${YEARS.length}</strong>
        </div>
      </section>
    </main>
    <section class="home-years">
      <h2>Accesos por ano</h2>
      <div class="card-grid">
        ${YEARS.map((year) => `
          <a class="year-card" href="${baseUrl}juegos/${year.slug}/">
            <span>${escapeHtml(year.title)}</span>
            <p>${escapeHtml(year.description)}</p>
            <strong>Entrar</strong>
          </a>
        `).join('')}
      </div>
    </section>
  `;

  return renderLayout({
    title: 'Home',
    description: 'Home principal de Lena',
    bodyClass: 'page-home',
    navKey: 'home',
    content
  });
}

function renderHub() {
  const content = `
    <main class="page-head">
      <div>
        <span class="eyebrow">Juegos</span>
        <h1>Hub de juegos por ano</h1>
        <p>Busca por titulo o filtra por tags para entrar directo.</p>
      </div>
      <div class="search-box">
        <input type="search" placeholder="Buscar juegos o tags" data-search />
      </div>
    </main>
    <section class="card-grid" data-card-list>
      ${YEARS.map((year) => `
        <a class="year-card" href="${baseUrl}juegos/${year.slug}/">
          <span>${escapeHtml(year.title)}</span>
          <p>${escapeHtml(year.description)}</p>
          <strong>Ver ${escapeHtml(year.label)}</strong>
        </a>
      `).join('')}
      ${GAMES.map((game) => `
        <a class="game-card" href="${baseUrl}juegos/${game.slug}/" data-card data-title="${escapeHtml(game.title)}" data-tags="${escapeHtml(game.tags.join(','))}">
          <div class="card-top">
            <span>${escapeHtml(game.title)}</span>
            <em>${escapeHtml(getYearById(game.year)?.label || '')}</em>
          </div>
          <p>${escapeHtml(game.description)}</p>
          <strong>Ver juego</strong>
        </a>
      `).join('')}
    </section>
  `;

  return renderLayout({
    title: 'Juegos',
    description: 'Hub de juegos por ano',
    bodyClass: 'page-hub',
    navKey: 'juegos',
    content
  });
}

function renderYear(year) {
  const games = getGamesByYear(year.id);
  const tags = Array.from(new Set(games.flatMap((game) => game.tags))).sort();
  const content = `
    <main class="page-head">
      <div>
        <span class="eyebrow">${escapeHtml(year.label)}</span>
        <h1>${escapeHtml(year.title)}</h1>
        <p>${escapeHtml(year.description)}</p>
      </div>
      <div class="search-box">
        <input type="search" placeholder="Buscar en ${escapeHtml(year.label)}" data-search />
      </div>
    </main>
    <section class="tag-filter" data-filter>
      <button type="button" data-tag="all" class="tag is-active">Todas</button>
      ${tags.map((tag) => `<button type="button" data-tag="${escapeHtml(tag)}" class="tag">${escapeHtml(tag)}</button>`).join('')}
    </section>
    <section class="card-grid" data-card-list>
      ${games.map((game) => `
        <a class="game-card" href="${baseUrl}juegos/${game.slug}/" data-card data-title="${escapeHtml(game.title)}" data-tags="${escapeHtml(game.tags.join(','))}">
          <div class="card-top">
            <span>${escapeHtml(game.title)}</span>
            <em>${escapeHtml(year.label)}</em>
          </div>
          <p>${escapeHtml(game.description)}</p>
          <strong>Entrar</strong>
        </a>
      `).join('')}
    </section>
  `;

  return renderLayout({
    title: year.title,
    description: year.description,
    bodyClass: 'page-year',
    navKey: year.slug,
    content
  });
}

function renderGamePage(game) {
  const year = YEARS.find((y) => y.id === game.year);
  const breadcrumbs = renderBreadcrumbs([
    { label: 'Home', href: `${baseUrl}` },
    { label: 'Juegos', href: `${baseUrl}juegos/` },
    { label: year?.title || 'Ano', href: `${baseUrl}juegos/${year?.slug || ''}/` },
    { label: game.title }
  ]);

  const levelLinks = Array.from({ length: 10 }, (_, i) => (
    `<a class="level-chip" href="${baseUrl}juegos/${game.slug}/?game=${game.id}&level=${i + 1}">Nivel ${i + 1}</a>`
  )).join('');

  const extraHead = `
    <link rel="stylesheet" href="${baseUrl}css/style.css" />
    <link rel="stylesheet" href="${baseUrl}css/juego.css" />
    <link rel="stylesheet" href="${baseUrl}css/base-ten.css" />
    <link rel="stylesheet" href="${baseUrl}css/new-games.css" />
  `;

  const setupScript = `
    <script>
      (function () {
        var id = '${game.id}';
        var url = new URL(window.location.href);
        if (!url.searchParams.get('game')) {
          url.searchParams.set('game', id);
          if (!url.searchParams.get('level')) url.searchParams.set('level', '1');
          window.history.replaceState(null, '', url.toString());
        }
      })();
    </script>
  `;

  const engineScripts = `
    <script src="${baseUrl}js/i18n.js"></script>
    <script src="${baseUrl}js/appShell.js"></script>
    <script src="${baseUrl}js/new-games/registry.js"></script>
    <script src="${baseUrl}js/new-games/qa.js"></script>
    <script src="${baseUrl}js/new-games/engine.js"></script>
  `;

  const content = `
    <main class="page-game">
      ${breadcrumbs}
      <section class="game-hero">
        <div class="game-hero__info">
          <span class="eyebrow">${escapeHtml(year?.label || '')}</span>
          <h1>${escapeHtml(game.title)}</h1>
          <p>${escapeHtml(game.description)}</p>
          <div class="game-actions">
            <a class="btn-primary" href="${baseUrl}juegos/${game.slug}/?game=${game.id}&level=1">Empezar nivel 1</a>
            <a class="btn-secondary" href="${baseUrl}juegos/">Volver al hub</a>
          </div>
        </div>
        <div class="game-hero__panel">
          <span>Tags</span>
          <div class="chip-row">
            ${game.tags.map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join('')}
          </div>
        </div>
      </section>
      <section class="level-grid">
        ${levelLinks}
      </section>

      <section class="game-shell">
        <section class="ng-header">
          <div class="ng-header__title">
            <a class="ng-back" href="${baseUrl}juegos/${year?.slug || ''}/">Volver a ${escapeHtml(year?.label || '')}</a>
            <div>
              <h2 class="ng-title" data-game-title></h2>
              <p class="ng-subtitle" data-game-subtitle></p>
            </div>
          </div>
          <div class="ng-header__meta">
            <div class="ng-level" data-i18n="levelLabel"></div>
            <div class="ng-level-value" data-level>1</div>
            <label class="ng-auto">
              <input type="checkbox" data-auto-toggle />
              <span data-i18n="gameAutoMode">Auto</span>
            </label>
          </div>
        </section>
        <section class="ng-level-grid" data-level-grid></section>
        <section id="game-shell-root" class="gs-shell" data-game-id="${escapeHtml(game.id)}">
          <main class="gs-main">
            <div class="gs-question">
              <div class="gs-question__label" data-question></div>
              <p class="gs-hint" data-hint hidden></p>
              <div class="ng-progress" data-progress-text></div>
            </div>
            <div class="gs-options" data-options></div>
            <div class="gs-order" data-order-area hidden></div>
          </main>
          <footer class="gs-footer">
            <button class="gs-action gs-action--ghost" data-action="hint" data-i18n-attr="aria-label" data-i18n-key="gameHint">
              <span aria-hidden="true">💡</span>
              <span data-i18n="gameHint"></span>
            </button>
          </footer>
        </section>
      </section>
    </main>
  `;

  return renderLayout({
    title: game.title,
    description: game.description,
    bodyClass: 'page-game',
    navKey: year?.slug || 'juegos',
    content,
    extraHead,
    extraBody: `${setupScript}${engineScripts}`
  });
}

function renderAll() {
  const indexPath = path.join(repoRoot, 'index.html');
  writeFile(indexPath, renderHome());

  writeFile(path.join(repoRoot, 'juegos', 'index.html'), renderHub());

  YEARS.forEach((year) => {
    writeFile(path.join(repoRoot, 'juegos', year.slug, 'index.html'), renderYear(year));
  });

  GAMES.forEach((game) => {
    writeFile(path.join(repoRoot, 'juegos', game.slug, 'index.html'), renderGamePage(game));
  });
}

renderAll();
console.log('[mpa] pages generated');
