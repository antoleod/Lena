import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

// ─── Category data ────────────────────────────────────────────────────────────

// N1 — 2 very distinct categories: Animaux vs Nourriture
const SET_N1 = {
  left: 'Animaux', right: 'Nourriture', center: null,
  words: [
    { text: 'chien', side: 'left' }, { text: 'pizza', side: 'right' },
    { text: 'chat', side: 'left' }, { text: 'soupe', side: 'right' },
    { text: 'lapin', side: 'left' }, { text: 'pomme', side: 'right' },
    { text: 'vache', side: 'left' }, { text: 'pain', side: 'right' },
    { text: 'oiseau', side: 'left' }, { text: 'fromage', side: 'right' },
    { text: 'cochon', side: 'left' }, { text: 'carotte', side: 'right' },
    { text: 'serpent', side: 'left' }, { text: 'gâteau', side: 'right' },
    { text: 'lion', side: 'left' },
  ],
};

// N2 — 2 categories: Verbes vs Noms
const SET_N2 = {
  left: 'Verbes', right: 'Noms', center: null,
  words: [
    { text: 'courir', side: 'left' }, { text: 'maison', side: 'right' },
    { text: 'manger', side: 'left' }, { text: 'soleil', side: 'right' },
    { text: 'dormir', side: 'left' }, { text: 'école', side: 'right' },
    { text: 'sauter', side: 'left' }, { text: 'jardin', side: 'right' },
    { text: 'jouer', side: 'left' }, { text: 'livre', side: 'right' },
    { text: 'chanter', side: 'left' }, { text: 'porte', side: 'right' },
    { text: 'dessiner', side: 'left' }, { text: 'fenêtre', side: 'right' },
    { text: 'lire', side: 'left' }, { text: 'table', side: 'right' },
    { text: 'écrire', side: 'left' }, { text: 'nuage', side: 'right' },
  ],
};

// N3 — 2 trickier categories: Vivant vs Non-vivant
const SET_N3 = {
  left: 'Vivant', right: 'Non-vivant', center: null,
  words: [
    { text: 'arbre', side: 'left' }, { text: 'rocher', side: 'right' },
    { text: 'champignon', side: 'left' }, { text: 'nuage', side: 'right' },
    { text: 'bactérie', side: 'left' }, { text: 'montagne', side: 'right' },
    { text: 'algue', side: 'left' }, { text: 'sable', side: 'right' },
    { text: 'insecte', side: 'left' }, { text: 'étoile', side: 'right' },
    { text: 'mousse', side: 'left' }, { text: 'rivière', side: 'right' },
    { text: 'baleine', side: 'left' }, { text: 'volcan', side: 'right' },
    { text: 'virus', side: 'left' }, { text: 'feu', side: 'right' },
    { text: 'cactus', side: 'left' }, { text: 'vent', side: 'right' },
    { text: 'fourmi', side: 'left' }, { text: 'lune', side: 'right' },
  ],
};

// N4 — 3 categories: Animaux / Plantes / Objets
const SET_N4 = {
  left: 'Animaux', right: 'Objets', center: 'Plantes',
  words: [
    { text: 'aigle', side: 'left' }, { text: 'stylo', side: 'right' }, { text: 'rose', side: 'center' },
    { text: 'grenouille', side: 'left' }, { text: 'chaise', side: 'right' }, { text: 'chêne', side: 'center' },
    { text: 'renard', side: 'left' }, { text: 'lampe', side: 'right' }, { text: 'cactus', side: 'center' },
    { text: 'dauphin', side: 'left' }, { text: 'table', side: 'right' }, { text: 'fougère', side: 'center' },
    { text: 'lièvre', side: 'left' }, { text: 'horloge', side: 'right' }, { text: 'tulipe', side: 'center' },
    { text: 'perroquet', side: 'left' }, { text: 'fenêtre', side: 'right' }, { text: 'bambou', side: 'center' },
    { text: 'requin', side: 'left' }, { text: 'sac', side: 'right' },
  ],
};

// N5 — 3 difficult categories: Solide / Liquide / Gaz
const SET_N5 = {
  left: 'Solide', right: 'Liquide', center: 'Gaz',
  words: [
    { text: 'glace', side: 'left' }, { text: 'eau', side: 'right' }, { text: 'vapeur', side: 'center' },
    { text: 'bois', side: 'left' }, { text: 'lait', side: 'right' }, { text: 'oxygène', side: 'center' },
    { text: 'pierre', side: 'left' }, { text: 'huile', side: 'right' }, { text: 'azote', side: 'center' },
    { text: 'sel', side: 'left' }, { text: 'jus', side: 'right' }, { text: 'CO2', side: 'center' },
    { text: 'sable', side: 'left' }, { text: 'vinaigre', side: 'right' }, { text: 'hélium', side: 'center' },
    { text: 'fer', side: 'left' }, { text: 'mercure', side: 'right' }, { text: 'argon', side: 'center' },
    { text: 'sucre', side: 'left' }, { text: 'sirop', side: 'right' }, { text: 'propane', side: 'center' },
    { text: 'craie', side: 'left' }, { text: 'alcool', side: 'right' },
  ],
};

const LEVEL_CONFIG = [
  { label: 'N1 — Animaux vs Nourriture', set: SET_N1, fallMs: 4000, words: 15 },
  { label: 'N2 — Verbes vs Noms',        set: SET_N2, fallMs: 3500, words: 18 },
  { label: 'N3 — Vivant vs Non-vivant',  set: SET_N3, fallMs: 3000, words: 20 },
  { label: 'N4 — 3 catégories',          set: SET_N4, fallMs: 2500, words: 20 },
  { label: 'N5 — Solide/Liquide/Gaz',    set: SET_N5, fallMs: 2000, words: 25 },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(secs) {
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m${secs % 60}s`;
}

export default function TrieExpressPage() {
  const { progress, saveSession, resetTimer } = useGameSession('trie-express');

  const [phase, setPhase] = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [words, setWords] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [missed, setMissed] = useState(false);
  const [sessionResult, setSessionResult] = useState(null);
  const timeoutRef = useRef(null);
  const wrongRef = useRef(0);

  const cfg = LEVEL_CONFIG[selectedLevel - 1];
  const cat = cfg.set;
  const hasThree = cat.center !== null;
  const currentWord = words[wordIndex] || null;

  function startGame() {
    const c = LEVEL_CONFIG[selectedLevel - 1];
    const pool = shuffle(c.set.words).slice(0, c.words);
    wrongRef.current = 0;
    setWords(pool);
    setWordIndex(0);
    setWrongCount(0);
    setFeedback(null);
    setMissed(false);
    setSessionResult(null);
    resetTimer();
    setPhase('play');
  }

  useEffect(() => {
    if (phase !== 'play' || !currentWord) return;
    setFeedback(null);
    setMissed(false);

    const c = LEVEL_CONFIG[selectedLevel - 1];
    timeoutRef.current = setTimeout(() => {
      wrongRef.current += 1;
      setWrongCount(w => w + 1);
      setMissed(true);
      setFeedback('bad');
      timeoutRef.current = setTimeout(() => advance(), 800);
    }, c.fallMs);

    return () => clearTimeout(timeoutRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordIndex, phase]);

  function advance() {
    const c = LEVEL_CONFIG[selectedLevel - 1];
    const next = wordIndex + 1;
    if (next >= c.words) {
      const wrong = wrongRef.current;
      const stars = wrong <= 2 ? 3 : wrong <= 5 ? 2 : 1;
      const result = saveSession({ score: c.words - wrong, level: selectedLevel, stars });
      setSessionResult(result);
      setPhase('results');
    } else {
      setWordIndex(next);
    }
  }

  function handleSort(side) {
    if (feedback !== null) return;
    clearTimeout(timeoutRef.current);
    const correct = side === currentWord.side;
    if (!correct) {
      wrongRef.current += 1;
      setWrongCount(w => w + 1);
    }
    setFeedback(correct ? 'ok' : 'bad');
    timeoutRef.current = setTimeout(() => advance(), 700);
  }

  if (phase === 'setup') {
    return (
      <div className="te-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="te-title">⚡ Trie Express</h1>
        <p className="te-subtitle">Trie les mots dans la bonne catégorie avant qu'ils tombent !</p>

        <div className="jeux-level-grid">
          {LEVEL_CONFIG.map((lc, i) => {
            const lvl = i + 1;
            const locked = lvl > progress.unlockedLevel;
            const sel = lvl === selectedLevel;
            return (
              <button
                key={lvl}
                className={`jeux-level-btn${sel ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`}
                onPointerDown={e => { e.preventDefault(); if (!locked) setSelectedLevel(lvl); }}
                disabled={locked}
              >
                {locked ? '🔒' : `N${lvl}`}
              </button>
            );
          })}
        </div>

        <div className="te-info-row">
          <span>📦 {cfg.words} mots</span>
          <span>⏱ {cfg.fallMs / 1000}s par mot</span>
        </div>

        <div className="jeux-setup-stats">
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{progress.bestScore}</span>
            <span className="jeux-setup-stat__lbl">Meilleur score</span>
          </div>
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{formatTime(progress.totalTimeSecs)}</span>
            <span className="jeux-setup-stat__lbl">Temps total</span>
          </div>
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{progress.sessionsPlayed}</span>
            <span className="jeux-setup-stat__lbl">Parties</span>
          </div>
        </div>

        <button className="te-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>
          ▶ Jouer
        </button>
      </div>
    );
  }

  if (phase === 'results') {
    const wrong = wrongCount;
    const stars = wrong <= 2 ? 3 : wrong <= 5 ? 2 : 1;
    const msg = stars === 3 ? '🎉 Champion !' : stars === 2 ? '👍 Bien joué !' : '📚 Continue !';
    return (
      <div className="te-page">
        <h2 className="te-result-title">{msg}</h2>
        <div className="jeux-stars">{'★'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
        <div className="jeux-result-stat"><span>Erreurs</span><span>{wrong} / {cfg.words}</span></div>
        {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
        {sessionResult?.newUnlocked && (
          <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} débloqué !</div>
        )}
        <div className="te-result-btns">
          <button className="te-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <button className="te-cta te-cta--soft" onPointerDown={() => setPhase('setup')}>Niveaux</button>
          <Link to="/jeux" className="te-cta te-cta--soft">← Jeux</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="te-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="te-hud">
        <span className="te-score">❌ {wrongCount}</span>
        <span className="te-round">{wordIndex + 1} / {cfg.words}</span>
      </div>

      {/* Category labels */}
      <div className={`te-cats${hasThree ? ' te-cats--three' : ''}`}>
        <div className="te-cat-label te-cat-label--left">{cat.left}</div>
        {hasThree && <div className="te-cat-label te-cat-label--center">{cat.center}</div>}
        <div className="te-cat-label te-cat-label--right">{cat.right}</div>
      </div>

      {/* Falling word arena */}
      <div className="te-arena">
        {currentWord && (
          <div
            key={wordIndex}
            className={`te-falling-word${feedback === 'ok' ? ' te-falling-ok' : feedback === 'bad' ? ' te-falling-bad' : ''}`}
            style={{ animationDuration: `${cfg.fallMs}ms` }}
          >
            {currentWord.text}
          </div>
        )}
        {feedback && (
          <div className={`te-feedback-icon${feedback === 'ok' ? ' te-fb-ok' : ' te-fb-bad'}`}>
            {feedback === 'ok' ? '✓' : missed ? '⏱' : '✗'}
          </div>
        )}
      </div>

      {/* Sort buttons */}
      <div className={`te-buttons${hasThree ? ' te-buttons--three' : ''}`}>
        <button
          className="te-btn te-btn--left"
          onPointerDown={e => { e.preventDefault(); handleSort('left'); }}
        >
          ← {cat.left}
        </button>
        {hasThree && (
          <button
            className="te-btn te-btn--center"
            onPointerDown={e => { e.preventDefault(); handleSort('center'); }}
          >
            {cat.center}
          </button>
        )}
        <button
          className="te-btn te-btn--right"
          onPointerDown={e => { e.preventDefault(); handleSort('right'); }}
        >
          {cat.right} →
        </button>
      </div>
    </div>
  );
}
