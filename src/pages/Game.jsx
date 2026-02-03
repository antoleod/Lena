import { useEffect, useRef, useState } from 'react';
import './Game.css';

const BASE_URL = import.meta.env.BASE_URL;

const HEAD_LINKS = [
  `${BASE_URL}css/style.css`,
  `${BASE_URL}css/juego.css`,
  `${BASE_URL}css/base-ten.css`,
  `${BASE_URL}css/new-games.css`
];

const SCRIPT_SOURCES = [
  `${BASE_URL}js/i18n.js`,
  `${BASE_URL}js/appShell.js`,
  `${BASE_URL}js/new-games/registry.js`,
  `${BASE_URL}js/new-games/qa.js`,
  `${BASE_URL}js/new-games/engine.js`
];

const LANGUAGE_OPTIONS = [
  { code: 'fr', label: 'FR' },
  { code: 'es', label: 'ES' },
  { code: 'nl', label: 'NL' }
];

function useHeadLinks() {
  useEffect(() => {
    const added = [];
    HEAD_LINKS.forEach((href) => {
      const existing = Array.from(document.head.querySelectorAll('link[rel="stylesheet"]'))
        .find((link) => link.href.endsWith(href));
      if (existing) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
      added.push(link);
    });

    return () => {
      added.forEach((link) => link.remove());
    };
  }, []);
}

function ensureScript(src) {
  return new Promise((resolve, reject) => {
    const existing = Array.from(document.scripts).find((script) => script.src.endsWith(src));
    if (existing) {
      resolve(existing);
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

export default function GamePage() {
  useHeadLinks();
  const [lang, setLang] = useState('fr');
  const scriptsRef = useRef([]);

  useEffect(() => {
    document.title = 'Jeu - Lena';
    document.body.classList.add('game-react-body');
    return () => {
      document.body.classList.remove('game-react-body');
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function init() {
      try {
        for (const src of SCRIPT_SOURCES) {
          // eslint-disable-next-line no-await-in-loop
          const script = await ensureScript(src);
          scriptsRef.current.push(script);
        }
      } catch (error) {
        console.warn('[game] Failed to load scripts', error);
      }

      if (!active) return;
      const current = window.i18n?.getLanguage?.() || 'fr';
      setLang(current);

      if (document.readyState !== 'loading') {
        document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
        window.dispatchEvent(new Event('load'));
      }
    }

    init();

    function handleLanguageChange(event) {
      if (!event?.detail?.lang) return;
      setLang(event.detail.lang);
    }

    document.addEventListener('lena:language:change', handleLanguageChange);

    return () => {
      active = false;
      document.removeEventListener('lena:language:change', handleLanguageChange);
      scriptsRef.current.forEach((script) => {
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
      scriptsRef.current = [];
    };
  }, []);

  useEffect(() => {
    const handleClick = (event) => {
      const button = event.target.closest('[data-action="back"]');
      if (!button) return;
      event.preventDefault();
      window.location.href = `${BASE_URL}juegos`;
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  function handleLanguageSelect(code) {
    if (!code) return;
    if (window.i18n?.setLanguage) {
      window.i18n.setLanguage(code);
    }
    document.documentElement.lang = code;
    setLang(code);
  }

  return (
    <div className="game-react-shell">
      <section className="game-hero" aria-labelledby="game-hero-title">
        <div className="game-hero__card">
          <span className="game-hero__eyebrow">Juego rápido</span>
          <h1 id="game-hero-title">Elige un reto y empieza a jugar</h1>
          <p>
            Acceso directo a los mini‑juegos con progreso automático, pistas y niveles dinámicos.
          </p>
          <div className="game-hero__actions">
            <div className="game-language">
              <span className="game-language__label">Idioma</span>
              <div className="game-language__buttons" role="group" aria-label="Cambiar idioma">
                {LANGUAGE_OPTIONS.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    className={`game-language__btn${lang === option.code ? ' is-active' : ''}`}
                    aria-pressed={lang === option.code}
                    onClick={() => handleLanguageSelect(option.code)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="game-hero__tip">
              <span className="game-hero__tip-label">Tip</span>
              <span>Activa el modo automático para avanzar sin pausas.</span>
            </div>
          </div>
        </div>
        <div className="game-hero__panel">
          <div className="game-hero__panel-row">
            <span className="game-hero__panel-label">Niveles</span>
            <span className="game-hero__panel-value">10+</span>
          </div>
          <div className="game-hero__panel-row">
            <span className="game-hero__panel-label">Modalidad</span>
            <span className="game-hero__panel-value">Auto / Manual</span>
          </div>
          <div className="game-hero__panel-row">
            <span className="game-hero__panel-label">Progreso</span>
            <span className="game-hero__panel-value">Guardado</span>
          </div>
        </div>
      </section>

      <main className="ng-shell">
        <section className="ng-header">
          <div className="ng-header__title">
            <button
              className="ng-back"
              type="button"
              data-action="back"
              data-i18n-attr="aria-label"
              data-i18n-key="gameBackToMenu"
            >
              <span aria-hidden="true">⬅️</span>
              <span data-i18n="gameBackToMenu"></span>
            </button>
            <div>
              <h2 className="ng-title" data-game-title></h2>
              <p className="ng-subtitle" data-game-subtitle></p>
            </div>
          </div>
          <div className="ng-header__meta">
            <div className="ng-level" data-i18n="levelLabel"></div>
            <div className="ng-level-value" data-level>1</div>
            <label className="ng-auto">
              <input type="checkbox" data-auto-toggle />
              <span data-i18n="gameAutoMode">Auto</span>
            </label>
          </div>
        </section>

        <section className="ng-level-grid" data-level-grid></section>

        <section id="game-shell-root" className="gs-shell" data-game-id="new-game">
          <main className="gs-main">
            <div className="gs-question">
              <div className="gs-question__label" data-question></div>
              <p className="gs-hint" data-hint hidden></p>
              <div className="ng-progress" data-progress-text></div>
            </div>
            <div className="gs-options" data-options></div>
            <div className="gs-order" data-order-area hidden></div>
          </main>
          <footer className="gs-footer">
            <button className="gs-action gs-action--ghost" data-action="hint" data-i18n-attr="aria-label" data-i18n-key="gameHint">
              <span aria-hidden="true">💡</span>
              <span data-i18n="gameHint"></span>
            </button>
          </footer>
        </section>
      </main>
    </div>
  );
}
