import { useState, useMemo } from 'react';
import './dico.css';
import { DICO_WORDS, DICO_THEMES } from './dicoData.js';
import { loadDicoProgress, toggleFavorite, addRecent } from './dicoProgress.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';

const UI = {
  fr: {
    title: 'Mon Dictionnaire', sub: '120 mots pour apprendre', wod: 'Mot du jour',
    search: 'Chercher un mot...', themes: 'Themes', allWords: 'Tous les mots',
    favorites: 'Mes Favoris', recent: 'Recemment vus', definition: 'Definition',
    example: 'Exemple', synonyms: 'Synonymes', antonym: 'Contraire',
    family: 'Famille de mots', listen: 'Ecouter', fav: 'Favori',
    noResults: 'Aucun mot trouve.', back: '←',
    results: (n) => `${n} mot${n > 1 ? 's' : ''}`,
    classMap: { nom: 'nom', verbe: 'verbe', adjectif: 'adjectif', adverbe: 'adverbe' },
    genreMap: { m: 'masculin', f: 'feminin' },
  },
  nl: {
    title: 'Mijn Woordenboek', sub: '120 woorden om te leren', wod: 'Woord van de dag',
    search: 'Zoek een woord...', themes: 'Themas', allWords: 'Alle woorden',
    favorites: 'Mijn favorieten', recent: 'Recent bekeken', definition: 'Definitie',
    example: 'Voorbeeld', synonyms: 'Synoniemen', antonym: 'Tegendeel',
    family: 'Woordfamilie', listen: 'Luisteren', fav: 'Favoriet',
    noResults: 'Geen woord gevonden.', back: '←',
    results: (n) => `${n} woord${n > 1 ? 'en' : ''}`,
    classMap: { nom: 'zelfstandig nw', verbe: 'werkwoord', adjectif: 'bijvoeglijk nw', adverbe: 'bijwoord' },
    genreMap: { m: 'mannelijk', f: 'vrouwelijk' },
  },
  en: {
    title: 'My Dictionary', sub: '120 words to learn', wod: 'Word of the day',
    search: 'Search a word...', themes: 'Themes', allWords: 'All words',
    favorites: 'My Favourites', recent: 'Recently viewed', definition: 'Definition',
    example: 'Example', synonyms: 'Synonyms', antonym: 'Opposite',
    family: 'Word family', listen: 'Listen', fav: 'Favourite',
    noResults: 'No word found.', back: '←',
    results: (n) => `${n} word${n > 1 ? 's' : ''}`,
    classMap: { nom: 'noun', verbe: 'verb', adjectif: 'adjective', adverbe: 'adverb' },
    genreMap: { m: 'masculine', f: 'feminine' },
  },
  es: {
    title: 'Mi Diccionario', sub: '120 palabras para aprender', wod: 'Palabra del dia',
    search: 'Buscar una palabra...', themes: 'Temas', allWords: 'Todas las palabras',
    favorites: 'Mis Favoritos', recent: 'Vistos recientemente', definition: 'Definicion',
    example: 'Ejemplo', synonyms: 'Sinonimos', antonym: 'Contrario',
    family: 'Familia de palabras', listen: 'Escuchar', fav: 'Favorito',
    noResults: 'Ninguna palabra encontrada.', back: '←',
    results: (n) => `${n} palabra${n > 1 ? 's' : ''}`,
    classMap: { nom: 'sustantivo', verbe: 'verbo', adjectif: 'adjetivo', adverbe: 'adverbio' },
    genreMap: { m: 'masculino', f: 'femenino' },
  },
};

function speak(text) {
  if (typeof speechSynthesis === 'undefined') return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'fr-FR'; u.rate = 0.85; u.pitch = 1.1;
  speechSynthesis.speak(u);
}

function getWordDef(word, locale) {
  return word.i18n?.[locale]?.definition || word.definition;
}
function getWordEx(word, locale) {
  return word.i18n?.[locale]?.example || word.example;
}

// ── Helper components (top-level) ───────────────────────────

function WordRow({ word, isFav, onSelect, onToggleFav, locale }) {
  return (
    <div
      className="dc-word-row"
      onPointerDown={(e) => { e.preventDefault(); onSelect(word.id); }}
    >
      <span className="dc-word-row__emoji">{word.emoji}</span>
      <div className="dc-word-row__main">
        <div className="dc-word-row__word">{word.word}</div>
        <div className="dc-word-row__def">{getWordDef(word, locale)}</div>
      </div>
      <span
        className={`dc-word-row__star${isFav ? ' is-fav' : ''}`}
        onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFav(word.id); }}
      >
        {isFav ? '★' : '☆'}
      </span>
    </div>
  );
}

function ThemeBtn({ theme, isActive, onSelect }) {
  return (
    <button
      className={`dc-theme-btn${isActive ? ' is-active' : ''}`}
      onPointerDown={(e) => { e.preventDefault(); onSelect(theme.id); }}
      type="button"
    >
      <span className="dc-theme-btn__emoji">{theme.emoji}</span>
      <span className="dc-theme-btn__label">{theme.label}</span>
    </button>
  );
}

function WordDetail({ word, ui, locale, isFav, onBack, onToggleFav, onChipNav }) {
  return (
    <div className="dc-detail">
      <div className="dc-detail-header">
        <button
          className="dc-back"
          onPointerDown={(e) => { e.preventDefault(); onBack(); }}
          type="button"
        >
          {ui.back}
        </button>
        <span style={{ flex: 1 }} />
      </div>

      <div className="dc-detail-hero">
        <div className="dc-detail-emoji">{word.emoji}</div>
        <div className="dc-detail-word">{word.word}</div>
        <div className="dc-detail-meta">
          <span className="dc-detail-badge dc-detail-badge--class">
            {ui.classMap[word.class] || word.class}
          </span>
          {word.genre && (
            <span className="dc-detail-badge dc-detail-badge--genre">
              {ui.genreMap[word.genre] || word.genre}
            </span>
          )}
          {word.plural && (
            <span className="dc-detail-badge dc-detail-badge--plural">
              pl. {word.plural}
            </span>
          )}
        </div>
      </div>

      <div className="dc-detail-actions">
        <button
          className="dc-action-btn dc-action-btn--audio"
          onPointerDown={(e) => { e.preventDefault(); speak(word.word); }}
          type="button"
        >
          🔊 {ui.listen}
        </button>
        <button
          className={`dc-action-btn dc-action-btn--fav${isFav ? ' is-active' : ''}`}
          onPointerDown={(e) => { e.preventDefault(); onToggleFav(word.id); }}
          type="button"
        >
          {isFav ? '★' : '☆'} {ui.fav}
        </button>
      </div>

      <div className="dc-card">
        <div className="dc-card__label">{ui.definition}</div>
        <p className="dc-card__text">{getWordDef(word, locale)}</p>
      </div>

      <div className="dc-card">
        <div className="dc-card__label">{ui.example}</div>
        <p className="dc-card__example">{getWordEx(word, locale)}</p>
      </div>

      {word.synonyms && word.synonyms.length > 0 && (
        <div className="dc-card">
          <div className="dc-card__label">{ui.synonyms}</div>
          <div className="dc-chips">
            {word.synonyms.map((s) => (
              <button
                key={s}
                className="dc-chip"
                onPointerDown={(e) => { e.preventDefault(); onChipNav(s); }}
                type="button"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {word.antonym && (
        <div className="dc-card">
          <div className="dc-card__label">{ui.antonym}</div>
          <div className="dc-chips">
            <button
              className="dc-chip dc-chip--antonym"
              onPointerDown={(e) => { e.preventDefault(); onChipNav(word.antonym); }}
              type="button"
            >
              {word.antonym}
            </button>
          </div>
        </div>
      )}

      {word.family && word.family.length > 0 && (
        <div className="dc-card">
          <div className="dc-card__label">{ui.family}</div>
          <div className="dc-chips">
            {word.family.map((f) => (
              <button
                key={f}
                className="dc-chip"
                onPointerDown={(e) => { e.preventDefault(); onChipNav(f); }}
                type="button"
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────

export default function DicoPage() {
  const { locale } = useLocale();
  const ui = UI[locale] || UI.fr;

  // All state at top level
  const [phase, setPhase] = useState('home'); // 'home' | 'browse' | 'word'
  const [prevPhase, setPrevPhase] = useState('home');
  const [selectedWordId, setSelectedWordId] = useState(null);
  const [activeTheme, setActiveTheme] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [progress, setProgress] = useState(() => loadDicoProgress());

  const wod = useMemo(
    () => DICO_WORDS[new Date().getDay() * 17 % DICO_WORDS.length],
    []
  );

  const selectedWord = useMemo(
    () => DICO_WORDS.find((w) => w.id === selectedWordId) || null,
    [selectedWordId]
  );

  const filteredWords = useMemo(() => {
    let list = DICO_WORDS;
    if (activeTheme) list = list.filter((w) => w.theme === activeTheme);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          w.definition.toLowerCase().includes(q) ||
          (w.i18n?.[locale]?.definition || '').toLowerCase().includes(q) ||
          w.synonyms.some((s) => s.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeTheme, searchQuery, locale]);

  const favWords = useMemo(
    () => DICO_WORDS.filter((w) => progress.favorites.includes(w.id)),
    [progress.favorites]
  );

  const recentWords = useMemo(
    () => progress.recentIds.map((id) => DICO_WORDS.find((w) => w.id === id)).filter(Boolean),
    [progress.recentIds]
  );

  function goWord(wordId, from) {
    setPrevPhase(from || phase);
    const newProgress = addRecent(wordId);
    setProgress(newProgress);
    setSelectedWordId(wordId);
    setPhase('word');
  }

  function goBack() {
    if (phase === 'word') {
      setPhase(prevPhase);
    } else {
      setPhase('home');
      setActiveTheme(null);
      setSearchQuery('');
    }
  }

  function goHome() {
    setPhase('home');
    setActiveTheme(null);
    setSearchQuery('');
  }

  function handleToggleFav(wordId) {
    const newProgress = toggleFavorite(wordId);
    setProgress({ ...newProgress });
  }

  function handleThemeSelect(themeId) {
    if (phase === 'home') {
      setActiveTheme(themeId === activeTheme ? null : themeId);
      setSearchQuery('');
      setPhase('browse');
    } else {
      setActiveTheme(themeId === activeTheme ? null : themeId);
    }
  }

  function handleChipNav(term) {
    const found = DICO_WORDS.find(
      (w) => w.word.toLowerCase() === term.toLowerCase() || w.id === term.toLowerCase()
    );
    if (found) {
      goWord(found.id, 'word');
    }
  }

  function handleBrowseAll() {
    setActiveTheme(null);
    setSearchQuery('');
    setPhase('browse');
  }

  // ── RENDER: word detail ──────────────────────────────────
  if (phase === 'word' && selectedWord) {
    return (
      <div className="dc-page">
        <WordDetail
          word={selectedWord}
          ui={ui}
          locale={locale}
          isFav={progress.favorites.includes(selectedWord.id)}
          onBack={goBack}
          onToggleFav={handleToggleFav}
          onChipNav={handleChipNav}
        />
      </div>
    );
  }

  // ── RENDER: browse ───────────────────────────────────────
  if (phase === 'browse') {
    return (
      <div className="dc-page">
        <div className="dc-browse">
          <div className="dc-browse-header">
            <button
              className="dc-back"
              onPointerDown={(e) => { e.preventDefault(); goHome(); }}
              type="button"
            >
              {ui.back}
            </button>
            <span className="dc-browse-title">{ui.allWords}</span>
          </div>

          <div className="dc-browse-body">
            <div className="dc-search">
              <input
                className="dc-search-input"
                type="text"
                placeholder={ui.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="dc-section" style={{ marginBottom: 12 }}>
              <div className="dc-theme-grid">
                {DICO_THEMES.map((t) => (
                  <ThemeBtn
                    key={t.id}
                    theme={t}
                    isActive={activeTheme === t.id}
                    onSelect={handleThemeSelect}
                  />
                ))}
              </div>
            </div>

            <div className="dc-count">{ui.results(filteredWords.length)}</div>

            {filteredWords.length === 0 ? (
              <div className="dc-empty">{ui.noResults}</div>
            ) : (
              <div className="dc-word-list">
                {filteredWords.map((w) => (
                  <WordRow
                    key={w.id}
                    word={w}
                    isFav={progress.favorites.includes(w.id)}
                    onSelect={(id) => goWord(id, 'browse')}
                    onToggleFav={handleToggleFav}
                    locale={locale}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER: home ─────────────────────────────────────────
  return (
    <div className="dc-page">
      <div className="dc-home">
        <div className="dc-hero">
          <h1 className="dc-hero__title">{ui.title}</h1>
          <p className="dc-hero__sub">{ui.sub}</p>
        </div>

        {/* Word of the day */}
        <div
          className="dc-wod"
          onPointerDown={(e) => { e.preventDefault(); goWord(wod.id, 'home'); }}
        >
          <div className="dc-wod__label">{ui.wod}</div>
          <div className="dc-wod__row">
            <span className="dc-wod__emoji">{wod.emoji}</span>
            <div>
              <div className="dc-wod__word">{wod.word}</div>
              <span className="dc-wod__class">{(UI.fr.classMap[wod.class] || wod.class)}</span>
            </div>
          </div>
          <div className="dc-wod__def">{getWordDef(wod, locale)}</div>
        </div>

        {/* Theme grid */}
        <div className="dc-section">
          <div className="dc-section-label">{ui.themes}</div>
          <div className="dc-theme-grid">
            {DICO_THEMES.map((t) => (
              <ThemeBtn
                key={t.id}
                theme={t}
                isActive={false}
                onSelect={(id) => { setActiveTheme(id); setSearchQuery(''); setPhase('browse'); }}
              />
            ))}
          </div>
        </div>

        {/* All words button */}
        <div className="dc-section">
          <button
            className="dc-all-btn"
            onPointerDown={(e) => { e.preventDefault(); handleBrowseAll(); }}
            type="button"
          >
            📖 {ui.allWords}
          </button>
        </div>

        {/* Favorites */}
        {favWords.length > 0 && (
          <div className="dc-section">
            <div className="dc-section-label">{ui.favorites}</div>
            <div className="dc-word-list">
              {favWords.slice(0, 5).map((w) => (
                <WordRow
                  key={w.id}
                  word={w}
                  isFav={true}
                  onSelect={(id) => goWord(id, 'home')}
                  onToggleFav={handleToggleFav}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recently viewed */}
        {recentWords.length > 0 && (
          <div className="dc-section">
            <div className="dc-section-label">{ui.recent}</div>
            <div className="dc-word-list">
              {recentWords.map((w) => (
                <WordRow
                  key={w.id}
                  word={w}
                  isFav={progress.favorites.includes(w.id)}
                  onSelect={(id) => goWord(id, 'home')}
                  onToggleFav={handleToggleFav}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
