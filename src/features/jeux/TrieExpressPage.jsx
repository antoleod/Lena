import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

// Each category set: { left, right, words: [{text, side:'left'|'right'}] }
const CATEGORY_SETS = [
  {
    left: 'Animaux',
    right: 'Nourriture',
    words: [
      { text: 'chien', side: 'left' },
      { text: 'pizza', side: 'right' },
      { text: 'chat', side: 'left' },
      { text: 'soupe', side: 'right' },
      { text: 'lapin', side: 'left' },
      { text: 'pomme', side: 'right' },
      { text: 'vache', side: 'left' },
      { text: 'pain', side: 'right' },
      { text: 'oiseau', side: 'left' },
      { text: 'fromage', side: 'right' },
      { text: 'cochon', side: 'left' },
      { text: 'carotte', side: 'right' },
      { text: 'serpent', side: 'left' },
      { text: 'gâteau', side: 'right' },
      { text: 'lion', side: 'left' },
      { text: 'yaourt', side: 'right' },
      { text: 'tigre', side: 'left' },
      { text: 'banane', side: 'right' },
      { text: 'renard', side: 'left' },
      { text: 'lait', side: 'right' },
    ],
  },
  {
    left: 'Nombres',
    right: 'Couleurs',
    words: [
      { text: 'cinq', side: 'left' },
      { text: 'rouge', side: 'right' },
      { text: 'douze', side: 'left' },
      { text: 'bleu', side: 'right' },
      { text: 'sept', side: 'left' },
      { text: 'vert', side: 'right' },
      { text: 'vingt', side: 'left' },
      { text: 'jaune', side: 'right' },
      { text: 'trois', side: 'left' },
      { text: 'violet', side: 'right' },
      { text: 'neuf', side: 'left' },
      { text: 'orange', side: 'right' },
      { text: 'onze', side: 'left' },
      { text: 'rose', side: 'right' },
      { text: 'seize', side: 'left' },
      { text: 'blanc', side: 'right' },
      { text: 'deux', side: 'left' },
      { text: 'gris', side: 'right' },
      { text: 'huit', side: 'left' },
      { text: 'noir', side: 'right' },
    ],
  },
  {
    left: 'Verbes',
    right: 'Noms',
    words: [
      { text: 'courir', side: 'left' },
      { text: 'maison', side: 'right' },
      { text: 'manger', side: 'left' },
      { text: 'soleil', side: 'right' },
      { text: 'dormir', side: 'left' },
      { text: 'école', side: 'right' },
      { text: 'sauter', side: 'left' },
      { text: 'jardin', side: 'right' },
      { text: 'jouer', side: 'left' },
      { text: 'livre', side: 'right' },
      { text: 'chanter', side: 'left' },
      { text: 'porte', side: 'right' },
      { text: 'dessiner', side: 'left' },
      { text: 'fenêtre', side: 'right' },
      { text: 'lire', side: 'left' },
      { text: 'table', side: 'right' },
      { text: 'écrire', side: 'left' },
      { text: 'nuage', side: 'right' },
      { text: 'nager', side: 'left' },
      { text: 'chemin', side: 'right' },
    ],
  },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const FALL_DURATION = 4000; // ms

export default function TrieExpressPage() {
  const [phase, setPhase] = useState('setup');
  const [catIndex, setCatIndex] = useState(0);
  const [words, setWords] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null); // null | 'ok' | 'bad'
  const [missed, setMissed] = useState(false); // timed out
  const timeoutRef = useRef(null);

  const cat = CATEGORY_SETS[catIndex];
  const currentWord = words[wordIndex] || null;
  const TOTAL = 20;

  function startGame() {
    const idx = Math.floor(Math.random() * CATEGORY_SETS.length);
    setCatIndex(idx);
    setWords(shuffle(CATEGORY_SETS[idx].words));
    setWordIndex(0);
    setScore(0);
    setFeedback(null);
    setMissed(false);
    setPhase('play');
  }

  // Start the fall timer whenever a new word appears
  useEffect(() => {
    if (phase !== 'play' || !currentWord) return;
    setFeedback(null);
    setMissed(false);

    timeoutRef.current = setTimeout(() => {
      // Time ran out — wrong
      setMissed(true);
      setFeedback('bad');
      setScore(s => Math.max(0, s - 1));
      timeoutRef.current = setTimeout(() => advance(), 800);
    }, FALL_DURATION);

    return () => clearTimeout(timeoutRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordIndex, phase]);

  function advance() {
    const next = wordIndex + 1;
    if (next >= TOTAL) {
      setPhase('results');
    } else {
      setWordIndex(next);
    }
  }

  function handleSort(side) {
    if (feedback !== null) return;
    clearTimeout(timeoutRef.current);
    const correct = side === currentWord.side;
    setFeedback(correct ? 'ok' : 'bad');
    setScore(s => correct ? s + 2 : Math.max(0, s - 1));
    timeoutRef.current = setTimeout(() => advance(), 700);
  }

  if (phase === 'setup') {
    return (
      <div className="te-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="te-title">⚡ Trie Express</h1>
        <p className="te-subtitle">Trie les mots dans la bonne catégorie avant qu'ils tombent !</p>
        <div className="te-demo-row">
          <div className="te-demo-cat te-demo-cat--left">Animaux</div>
          <div className="te-demo-word-fall">🐱 chat</div>
          <div className="te-demo-cat te-demo-cat--right">Nourriture</div>
        </div>
        <div className="te-info-row">
          <span>📦 {TOTAL} mots</span>
          <span>✅ +2 pts / ❌ -1 pt</span>
        </div>
        <button className="te-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>
          ▶ Jouer
        </button>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = score >= 32 ? 3 : score >= 20 ? 2 : 1;
    const msg = stars === 3 ? '🎉 Champion !' : stars === 2 ? '👍 Bien joué !' : '📚 Continue !';
    return (
      <div className="te-page">
        <h2 className="te-result-title">{msg}</h2>
        <div className="jeux-stars">{'★'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
        <div className="jeux-result-stat"><span>Score</span><span>{score} pts</span></div>
        <div className="te-result-btns">
          <button className="te-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <Link to="/jeux" className="te-cta te-cta--soft">← Jeux</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="te-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="te-hud">
        <span className="te-score">⭐ {score}</span>
        <span className="te-round">{wordIndex + 1} / {TOTAL}</span>
      </div>

      {/* Category labels */}
      <div className="te-cats">
        <div className="te-cat-label te-cat-label--left">{cat.left}</div>
        <div className="te-cat-label te-cat-label--right">{cat.right}</div>
      </div>

      {/* Falling word arena */}
      <div className="te-arena">
        {currentWord && (
          <div
            key={wordIndex}
            className={`te-falling-word${feedback === 'ok' ? ' te-falling-ok' : feedback === 'bad' ? ' te-falling-bad' : ''}`}
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
      <div className="te-buttons">
        <button
          className="te-btn te-btn--left"
          onPointerDown={e => { e.preventDefault(); handleSort('left'); }}
        >
          ← {cat.left}
        </button>
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
