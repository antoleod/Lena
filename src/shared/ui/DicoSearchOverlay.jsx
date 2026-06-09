import { useEffect, useRef, useState } from 'react';
import { DICO_WORDS } from '../../features/dico/dicoData.js';
import './DicoSearchOverlay.css';

const UI = {
  fr: { placeholder: 'Cherche un mot…', hint: '✨ Tape un mot pour voir sa définition !', notFound: 'Aucun mot trouvé.', definition: 'Définition', example: 'Exemple', synonyms: 'Synonymes', family: 'Famille de mots', close: 'Fermer' },
  nl: { placeholder: 'Zoek een woord…', hint: '✨ Typ een woord om de definitie te zien!', notFound: 'Geen woord gevonden.', definition: 'Definitie', example: 'Voorbeeld', synonyms: 'Synoniemen', family: 'Woordfamilie', close: 'Sluiten' },
  en: { placeholder: 'Search a word…', hint: '✨ Type a word to see its definition!', notFound: 'No word found.', definition: 'Definition', example: 'Example', synonyms: 'Synonyms', family: 'Word family', close: 'Close' },
  es: { placeholder: 'Busca una palabra…', hint: '✨ Escribe una palabra para ver su definición!', notFound: 'Ninguna palabra encontrada.', definition: 'Definición', example: 'Ejemplo', synonyms: 'Sinónimos', family: 'Familia de palabras', close: 'Cerrar' },
};

const GENRE_LOCALES = new Set(['fr', 'es']);

function normalize(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function getWord(w, locale) {
  return w.i18n?.[locale]?.word || w.word;
}
function getDefinition(w, locale) {
  return w.i18n?.[locale]?.definition || w.definition;
}
function getExample(w, locale) {
  return w.i18n?.[locale]?.example || w.example;
}

export default function DicoSearchOverlay({ locale = 'fr', onClose }) {
  const ui = UI[locale] || UI.fr;
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function handleSearch(q) {
    setQuery(q);
    if (!q.trim()) { setResult(null); return; }
    const needle = normalize(q.trim());
    const wordOf = (w) => normalize(getWord(w, locale));
    const match = DICO_WORDS.find(
      (w) => wordOf(w).startsWith(needle) || wordOf(w) === needle
    ) || DICO_WORDS.find(
      (w) => wordOf(w).includes(needle)
    );
    setResult(match || 'not-found');
  }

  return (
    <div className="dso-backdrop" onPointerDown={onClose}>
      <div className="dso-panel" onPointerDown={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="dso-header">
          <span className="dso-header__icon">🔍</span>
          <input
            ref={inputRef}
            className="dso-input"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={ui.placeholder}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            className="dso-close"
            onPointerDown={(e) => { e.preventDefault(); onClose(); }}
            aria-label={ui.close}
          >
            ✕
          </button>
        </div>

        {/* Result */}
        <div className="dso-body">
          {!query.trim() && (
            <div className="dso-hint">{ui.hint}</div>
          )}

          {query.trim() && result === 'not-found' && (
            <div className="dso-not-found">{ui.notFound}</div>
          )}

          {result && result !== 'not-found' && (
            <div className="dso-card">
              <div className="dso-card__head">
                <span className="dso-card__emoji">{result.emoji}</span>
                <div>
                  <span className="dso-card__word">{getWord(result, locale)}</span>
                  {result.plural && locale === 'fr' && <span className="dso-card__meta"> · pl. {result.plural}</span>}
                  {result.genre && GENRE_LOCALES.has(locale) && <span className="dso-card__meta"> · {result.genre}.</span>}
                  {result.class && <span className="dso-card__meta"> · {result.class}</span>}
                </div>
              </div>

              <p className="dso-card__def">
                <span className="dso-card__label">{ui.definition} : </span>
                {getDefinition(result, locale)}
              </p>

              {getExample(result, locale) && (
                <p className="dso-card__ex">
                  <span className="dso-card__label">{ui.example} : </span>
                  <em>{getExample(result, locale)}</em>
                </p>
              )}

              {result.synonyms?.length > 0 && (
                <p className="dso-card__synonyms">
                  <span className="dso-card__label">{ui.synonyms} : </span>
                  {result.synonyms.join(', ')}
                </p>
              )}

              {result.family?.length > 0 && (
                <div className="dso-card__family">
                  <span className="dso-card__label">{ui.family} : </span>
                  {result.family.map((f) => (
                    <span key={f} className="dso-card__family-tag">{f}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
