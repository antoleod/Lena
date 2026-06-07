import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

const WORD_SETS = [
  { emoji: '🐱', word: 'CHAT',    hint: 'Animal domestique' },
  { emoji: '🐶', word: 'CHIEN',   hint: 'Meilleur ami de l\'homme' },
  { emoji: '🍎', word: 'POMME',   hint: 'Fruit rouge' },
  { emoji: '🌙', word: 'LUNE',    hint: 'Brille la nuit' },
  { emoji: '☀️', word: 'SOLEIL',  hint: 'Brille le jour' },
  { emoji: '🌲', word: 'ARBRE',   hint: 'Végétal avec des branches' },
  { emoji: '🏠', word: 'MAISON',  hint: 'On y habite' },
  { emoji: '✏️', word: 'CRAYON',  hint: 'Pour écrire' },
  { emoji: '📚', word: 'LIVRE',   hint: 'Pour lire' },
  { emoji: '🐸', word: 'GRENOUILLE', hint: 'Saute et coasse' },
  { emoji: '🦋', word: 'PAPILLON', hint: 'Insecte coloré' },
  { emoji: '⭐', word: 'ETOILE',  hint: 'Dans le ciel la nuit' },
  { emoji: '🌈', word: 'ARC-EN-CIEL', hint: 'Après la pluie' },
  { emoji: '🐠', word: 'POISSON', hint: 'Vit dans l\'eau' },
  { emoji: '🍓', word: 'FRAISE',  hint: 'Petit fruit rouge' },
];

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeTiles(word) {
  const letters = word.replace(/-/g, '').split('');
  const distractors = [];
  while (distractors.length < Math.min(8, 26 - letters.length)) {
    const l = ALPHA[Math.floor(Math.random() * ALPHA.length)];
    if (!distractors.includes(l)) distractors.push(l);
  }
  return shuffle([...letters, ...distractors]).map((l, i) => ({ id: i, letter: l, used: false }));
}

const ROUNDS = 8;

export default function ChasseLettrePage() {
  const [phase, setPhase]     = useState('setup');
  const [queue, setQueue]     = useState([]);
  const [qIdx, setQIdx]       = useState(0);
  const [tiles, setTiles]     = useState([]);
  const [typed, setTyped]     = useState([]);
  const [score, setScore]     = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);

  function startGame() {
    const q = shuffle(WORD_SETS).slice(0, ROUNDS);
    setQueue(q); setQIdx(0); setScore(0); setFeedback(null);
    loadQuestion(q, 0);
    setPhase('play');
  }

  function loadQuestion(q, idx) {
    const item = q[idx];
    setTiles(makeTiles(item.word.replace(/-/g, '')));
    setTyped([]);
    setFeedback(null);
    setShowHint(false);
  }

  function tapTile(tile) {
    if (tile.used || feedback !== null) return;
    const newTyped = [...typed, tile];
    setTyped(newTyped);
    setTiles(ts => ts.map(t => t.id === tile.id ? { ...t, used: true } : t));

    const current = queue[qIdx];
    const target = current.word.replace(/-/g, '');
    const typedStr = newTyped.map(t => t.letter).join('');

    if (typedStr.length === target.length) {
      if (typedStr === target) {
        setFeedback('ok');
        setScore(s => s + (showHint ? 1 : 2));
        setTimeout(() => advance(), 900);
      } else {
        setFeedback('bad');
        setTimeout(() => {
          const item = queue[qIdx];
          setTiles(makeTiles(item.word.replace(/-/g, '')));
          setTyped([]); setFeedback(null);
        }, 800);
      }
    }
  }

  function deleteLast() {
    if (typed.length === 0 || feedback !== null) return;
    const last = typed[typed.length - 1];
    setTyped(ts => ts.slice(0, -1));
    setTiles(ts => ts.map(t => t.id === last.id ? { ...t, used: false } : t));
  }

  function advance() {
    const next = qIdx + 1;
    if (next >= ROUNDS) { setPhase('results'); return; }
    setQIdx(next);
    loadQuestion(queue, next);
  }

  if (phase === 'setup') {
    return (
      <div className="cl-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="cl-title">🔤 Chasse Lettres</h1>
        <p className="cl-subtitle">Épelle le mot en tapant les bonnes lettres !</p>
        <div className="cl-demo">
          <span className="cl-demo-emoji">🐱</span>
          <span className="cl-demo-arrow">→</span>
          <span className="cl-demo-tiles">C H A T</span>
        </div>
        <button className="cl-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>▶ Jouer</button>
      </div>
    );
  }

  if (phase === 'results') {
    const max = ROUNDS * 2;
    const stars = score >= max * 0.85 ? 3 : score >= max * 0.5 ? 2 : 1;
    return (
      <div className="cl-page">
        <h2 className="cl-result-title">{stars === 3 ? '🎉 Parfait !' : stars === 2 ? '👍 Bien !' : '📚 Continue !'}</h2>
        <div className="jeux-stars">{'★'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {max} pts</span></div>
        <div className="jeux-result-stat"><span>Mots trouvés</span><span>{ROUNDS}</span></div>
        <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
          <button className="cl-cta" style={{ flex: 1 }} onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <Link to="/jeux" className="cl-cta cl-cta--soft" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>← Jeux</Link>
        </div>
      </div>
    );
  }

  const current = queue[qIdx];
  const target = current?.word.replace(/-/g, '') || '';

  return (
    <div className="cl-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="cl-hud">
        <span className="cl-score">⭐ {score}</span>
        <span className="cl-round">{qIdx + 1} / {ROUNDS}</span>
      </div>

      <div className={`cl-emoji-wrap${feedback === 'ok' ? ' cl-flash-ok' : feedback === 'bad' ? ' cl-flash-bad' : ''}`}>
        <span className="cl-emoji">{current?.emoji}</span>
      </div>

      {showHint && <p className="cl-hint">{current?.hint}</p>}
      {!showHint && <button className="cl-hint-btn" onPointerDown={e => { e.preventDefault(); setShowHint(true); }}>💡 Indice (-1 pt)</button>}

      {/* Typed letters display */}
      <div className="cl-typed">
        {Array.from({ length: target.length }).map((_, i) => (
          <div key={i} className={`cl-slot${i < typed.length ? ' cl-slot--filled' : ''}`}>
            {typed[i]?.letter || ''}
          </div>
        ))}
      </div>

      <button className="cl-delete" onPointerDown={e => { e.preventDefault(); deleteLast(); }} disabled={typed.length === 0}>
        ⌫
      </button>

      {/* Letter tiles */}
      <div className="cl-tiles">
        {tiles.map(tile => (
          <button
            key={tile.id}
            className={`cl-tile${tile.used ? ' cl-tile--used' : ''}`}
            onPointerDown={e => { e.preventDefault(); tapTile(tile); }}
          >
            {tile.letter}
          </button>
        ))}
      </div>
    </div>
  );
}
