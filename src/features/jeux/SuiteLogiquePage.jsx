import { useState } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

// Pattern types: number series, emoji series, shape series
const PATTERNS = [
  // Arithmetic: +2
  () => { const s = Math.floor(Math.random()*5)+1; const d = Math.floor(Math.random()*3)+1; const seq = [s,s+d,s+2*d,s+3*d]; return { seq, answer: s+4*d, hint: `+${d}`, type: 'number' }; },
  // Arithmetic: ×2
  () => { const s = Math.floor(Math.random()*3)+1; const seq = [s,s*2,s*4,s*8]; return { seq, answer: s*16, hint: '×2', type: 'number' }; },
  // Alternating: +1 +2 +1 +2
  () => { const s = Math.floor(Math.random()*5)+1; const seq = [s,s+1,s+3,s+4]; return { seq, answer: s+6, hint: '+1 +2 +1 +2', type: 'number' }; },
  // Emoji repeat 3
  () => { const sets = [['🐱','🐶','🐸'],['⭐','🌙','☀️'],['🍎','🍊','🍋'],['🔴','🔵','🟢']]; const s = sets[Math.floor(Math.random()*sets.length)]; const seq = [s[0],s[1],s[2],s[0]]; return { seq, answer: s[1], hint: 'Répète !', type: 'emoji' }; },
  // Count up
  () => { const s = Math.floor(Math.random()*8)+2; const seq = [s-1,s,s+1,s+2]; return { seq, answer: s+3, hint: '+1', type: 'number' }; },
  // -1 pattern
  () => { const s = Math.floor(Math.random()*8)+10; const seq = [s,s-1,s-2,s-3]; return { seq, answer: s-4, hint: '-1', type: 'number' }; },
  // Even numbers
  () => { const s = (Math.floor(Math.random()*5)+1)*2; const seq = [s,s+2,s+4,s+6]; return { seq, answer: s+8, hint: '+2', type: 'number' }; },
  // Emoji: +1 count
  () => { const emoji = ['⭐','🌟','💫','✨','🌠']; const seq = [emoji[0],emoji[1],emoji[2],emoji[3]]; return { seq, answer: emoji[4], hint: 'Continue !', type: 'emoji' }; },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeRound() {
  const factory = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
  const { seq, answer, hint, type } = factory();
  // Make 3 choices
  const wrongs = new Set();
  if (type === 'number') {
    while (wrongs.size < 2) {
      const delta = Math.floor(Math.random() * 5) + 1;
      const sign = Math.random() < 0.5 ? 1 : -1;
      const w = answer + sign * delta;
      if (w !== answer && w > 0 && !wrongs.has(w)) wrongs.add(w);
    }
  } else {
    // For emoji, pick wrong ones from flat pool
    const pool = ['🌈','🦄','🎸','🏆','🍕','🚀','🐙','🦁','🎯','🔥'];
    while (wrongs.size < 2) {
      const w = pool[Math.floor(Math.random() * pool.length)];
      if (w !== answer && !wrongs.has(w)) wrongs.add(w);
    }
  }
  const choices = shuffle([answer, ...[...wrongs]]);
  return { seq, answer, choices, hint };
}

const ROUNDS = 10;

export default function SuiteLogiquePage() {
  const [phase, setPhase]       = useState('setup');
  const [round, setRound]       = useState(null);
  const [roundNum, setRoundNum] = useState(0);
  const [score, setScore]       = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);

  function startGame() {
    setScore(0); setRoundNum(0); setFeedback(null); setShowHint(false);
    setRound(makeRound());
    setPhase('play');
  }

  function handleAnswer(val) {
    if (feedback !== null) return;
    const correct = val === round.answer || String(val) === String(round.answer);
    setFeedback(correct ? 'ok' : 'bad');
    if (correct) setScore(s => s + (showHint ? 1 : 2));
    setTimeout(() => {
      const next = roundNum + 1;
      if (next >= ROUNDS) { setPhase('results'); return; }
      setRoundNum(next); setRound(makeRound()); setFeedback(null); setShowHint(false);
    }, 900);
  }

  if (phase === 'setup') {
    return (
      <div className="sl-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="sl-title">🔢 Suite Logique</h1>
        <p className="sl-subtitle">Trouve le prochain élément de la suite !</p>
        <div className="sl-demo">
          <span>2</span><span>4</span><span>6</span><span>8</span>
          <span className="sl-demo-q">?</span>
        </div>
        <button className="sl-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>▶ Jouer</button>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = score >= ROUNDS * 1.8 ? 3 : score >= ROUNDS ? 2 : 1;
    return (
      <div className="sl-page">
        <h2 className="sl-result-title">{stars === 3 ? '🎉 Génial !' : stars === 2 ? '👍 Bien !' : '📚 Continue !'}</h2>
        <div className="jeux-stars">{'★'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
        <div className="jeux-result-stat"><span>Score</span><span>{score} pts</span></div>
        <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
          <button className="sl-cta" style={{ flex: 1 }} onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <Link to="/jeux" className="sl-cta sl-cta--soft" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>← Jeux</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`sl-page${feedback === 'ok' ? ' sl-flash-ok' : feedback === 'bad' ? ' sl-flash-bad' : ''}`}>
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="sl-hud">
        <span className="sl-score">⭐ {score}</span>
        <span className="sl-round">{roundNum + 1} / {ROUNDS}</span>
      </div>

      <div className="sl-sequence">
        {round?.seq.map((item, i) => (
          <div key={i} className="sl-seq-item">{item}</div>
        ))}
        <div className="sl-seq-item sl-seq-item--blank">?</div>
      </div>

      {showHint && <p className="sl-hint">Indice : {round?.hint}</p>}
      {!showHint && (
        <button className="sl-hint-btn" onPointerDown={e => { e.preventDefault(); setShowHint(true); }}>
          💡 Indice (-1 pt)
        </button>
      )}

      <div className="sl-choices">
        {round?.choices.map((choice, i) => (
          <button
            key={i}
            className="sl-choice"
            onPointerDown={e => { e.preventDefault(); handleAnswer(choice); }}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
