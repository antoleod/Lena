import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

// Word groups of 4-5 words each
const WORD_GROUPS = [
  ['âne', 'chat', 'lion', 'ours', 'vache'],
  ['ballon', 'cahier', 'gomme', 'livre', 'règle'],
  ['arbre', 'fleur', 'herbe', 'mousse', 'racine'],
  ['avion', 'bateau', 'bus', 'train', 'vélo'],
  ['bras', 'dos', 'main', 'nez', 'pied'],
  ['beurre', 'farine', 'lait', 'oeuf', 'sucre'],
  ['août', 'juin', 'mai', 'mars', 'novembre'],
  ['bleu', 'gris', 'noir', 'rouge', 'vert'],
  ['chaise', 'lampe', 'porte', 'table', 'fenêtre'],
  ['ciel', 'lune', 'nuage', 'pluie', 'soleil'],
];

const ROUNDS = 10;
const ROUND_TIME = 30;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Sort words alphabetically (French locale)
function sortAlpha(words) {
  return [...words].sort((a, b) => a.localeCompare(b, 'fr'));
}

export default function OrdreAlphaPage() {
  const [phase, setPhase] = useState('setup');
  const [groups, setGroups] = useState([]);
  const [roundNum, setRoundNum] = useState(0);
  const [displayWords, setDisplayWords] = useState([]); // shuffled for display
  const [sortedWords, setSortedWords] = useState([]);   // correct order
  const [selected, setSelected] = useState([]);          // tapped in order
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [score, setScore] = useState(0);
  const [shakeIdx, setShakeIdx] = useState(null);       // index in displayWords to shake
  const [roundOver, setRoundOver] = useState(false);
  const timerRef = useRef(null);

  function startGame() {
    // Shuffle group order so each play is different
    const shuffledGroups = shuffle(WORD_GROUPS);
    setGroups(shuffledGroups);
    setScore(0);
    setRoundNum(0);
    setPhase('play');
    initRound(shuffledGroups, 0);
  }

  function initRound(grps, idx) {
    const words = grps[idx];
    const sorted = sortAlpha(words);
    const display = shuffle(words);
    setSortedWords(sorted);
    setDisplayWords(display);
    setSelected([]);
    setTimeLeft(ROUND_TIME);
    setShakeIdx(null);
    setRoundOver(false);
  }

  // Timer
  useEffect(() => {
    if (phase !== 'play' || roundOver) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setRoundOver(true);
          setTimeout(() => advanceRound(), 1000);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundNum, phase, roundOver]);

  function advanceRound() {
    const next = roundNum + 1;
    if (next >= ROUNDS) {
      setPhase('results');
      return;
    }
    setRoundNum(next);
    initRound(groups, next);
  }

  function handleTap(word) {
    if (roundOver) return;
    // Already selected
    if (selected.includes(word)) return;

    const position = selected.length; // next slot
    if (word === sortedWords[position]) {
      // Correct tap
      const newSelected = [...selected, word];
      setSelected(newSelected);
      setShakeIdx(null);

      if (newSelected.length === sortedWords.length) {
        // Round complete
        clearInterval(timerRef.current);
        setRoundOver(true);
        setScore(s => s + 1);
        setTimeout(() => advanceRound(), 900);
      }
    } else {
      // Wrong tap — shake and reset selection
      const wordIdx = displayWords.indexOf(word);
      setShakeIdx(wordIdx);
      setSelected([]);
      setTimeout(() => setShakeIdx(null), 500);
    }
  }

  const timerPct = (timeLeft / ROUND_TIME) * 100;

  if (phase === 'setup') {
    return (
      <div className="oa-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="oa-title">🔤 Ordre Alpha</h1>
        <p className="oa-subtitle">Tape les mots dans l'ordre alphabétique !</p>
        <div className="oa-demo">
          {['chat', 'âne', 'lion'].map((w, i) => (
            <div key={i} className="oa-demo-word">{w}</div>
          ))}
          <div className="oa-demo-arrow">→</div>
          {['âne', 'chat', 'lion'].map((w, i) => (
            <div key={i} className="oa-demo-word oa-demo-word--sorted">{w}</div>
          ))}
        </div>
        <div className="oa-info-row">
          <span>📝 {ROUNDS} séries</span>
          <span>⏱ {ROUND_TIME}s par série</span>
        </div>
        <button className="oa-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>
          ▶ Jouer
        </button>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = score >= 9 ? 3 : score >= 6 ? 2 : 1;
    const msg = stars === 3 ? '🎉 Excellent !' : stars === 2 ? '👍 Bien !' : '📚 Continue !';
    return (
      <div className="oa-page">
        <h2 className="oa-result-title">{msg}</h2>
        <div className="jeux-stars">{'★'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
        <div className="jeux-result-stat"><span>Séries réussies</span><span>{score} / {ROUNDS}</span></div>
        <div className="oa-result-btns">
          <button className="oa-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <Link to="/jeux" className="oa-cta oa-cta--soft">← Jeux</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="oa-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="oa-hud">
        <span className="oa-score">✅ {score}</span>
        <span className="oa-round">{roundNum + 1} / {ROUNDS}</span>
        <span className={`oa-timer${timeLeft <= 10 ? ' oa-timer--urgent' : ''}`}>⏱ {timeLeft}s</span>
      </div>

      <div className="oa-timer-bar">
        <div
          className={`oa-timer-fill${timeLeft <= 10 ? ' oa-timer-fill--urgent' : ''}`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      <p className="oa-instruction">Tape les mots dans l'ordre alphabétique</p>

      {/* Selected order display */}
      <div className="oa-order-slots">
        {sortedWords.map((_, i) => (
          <div key={i} className={`oa-slot${i < selected.length ? ' oa-slot--filled' : ''}`}>
            {i < selected.length ? selected[i] : (i + 1)}
          </div>
        ))}
      </div>

      {/* Tappable words */}
      <div className="oa-words">
        {displayWords.map((word, i) => {
          const isSelected = selected.includes(word);
          const isCorrect = isSelected;
          const isShaking = shakeIdx === i;
          let cls = 'oa-word-btn';
          if (isCorrect) cls += ' oa-word-btn--correct';
          if (isShaking) cls += ' oa-word-btn--shake';
          return (
            <button
              key={i}
              className={cls}
              onPointerDown={e => { e.preventDefault(); handleTap(word); }}
              disabled={isSelected}
            >
              {word}
            </button>
          );
        })}
      </div>

      {roundOver && timeLeft === 0 && (
        <div className="oa-timeout-msg">⏱ Temps écoulé !</div>
      )}
    </div>
  );
}
