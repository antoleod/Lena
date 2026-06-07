import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

// Build a round: 12 questions mixing ×2, ×5, ×10
// Each question: a 5-number sequence, one position is the blank
function buildQuestion() {
  const type = Math.floor(Math.random() * 3); // 0=×2, 1=×5, 2=×10
  const step = type === 0 ? 2 : type === 1 ? 5 : 10;
  const maxStart = type === 0 ? 2 : type === 1 ? 5 : 10;
  const start = (Math.floor(Math.random() * maxStart) + 1) * step;
  const seq = [start, start + step, start + 2 * step, start + 3 * step, start + 4 * step];
  const blankPos = Math.floor(Math.random() * 5);
  const answer = seq[blankPos];

  // Generate 2 wrong choices close to the answer
  const wrongs = new Set();
  while (wrongs.size < 2) {
    const delta = (Math.floor(Math.random() * 3) + 1) * (Math.random() < 0.5 ? step : 1);
    const sign = Math.random() < 0.5 ? 1 : -1;
    const w = answer + sign * delta;
    if (w > 0 && w !== answer && !wrongs.has(w)) wrongs.add(w);
  }

  const choices = shuffle([answer, ...[...wrongs]]);
  const label = type === 0 ? 'par 2' : type === 1 ? 'par 5' : 'par 10';
  return { seq, blankPos, answer, choices, step, label };
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function calcStars(score, total) {
  const r = score / total;
  if (r >= 0.9) return 3;
  if (r >= 0.6) return 2;
  return 1;
}

function buildRound(n = 12) {
  return Array.from({ length: n }, buildQuestion);
}

const TOTAL = 12;

export default function SauteMoutonPage() {
  const [phase, setPhase] = useState('setup');
  const [round, setRound] = useState(() => buildRound());
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null); // null | 'correct' | 'wrong'
  const [shakeIdx, setShakeIdx] = useState(null);

  const q = round[idx];

  function startGame() {
    setRound(buildRound());
    setIdx(0);
    setScore(0);
    setPicked(null);
    setShakeIdx(null);
    setPhase('play');
  }

  const handleChoice = useCallback((choice, ci) => {
    if (picked !== null) return;
    const correct = choice === q.answer;
    setPicked(ci);
    if (correct) {
      setScore(s => s + 1);
    } else {
      setShakeIdx(ci);
      setTimeout(() => setShakeIdx(null), 500);
    }
    setTimeout(() => {
      setPicked(null);
      if (idx + 1 >= TOTAL) {
        setPhase('results');
      } else {
        setIdx(i => i + 1);
      }
    }, correct ? 700 : 1300);
  }, [picked, q, idx]);

  if (phase === 'setup') {
    return (
      <div className="mp-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="mp-setup-hero">
          <div className="mp-setup-icon">🐑</div>
          <h1 className="mp-setup-title">Saute Mouton</h1>
          <p className="mp-setup-desc">
            Le mouton saute de pierre en pierre en comptant !<br />
            Trouve le nombre manquant dans la séquence.
          </p>
        </div>
        <div className="mp-setup-examples">
          <div className="mp-example-row">
            <span className="mp-stone">2</span>
            <span className="mp-stone">4</span>
            <span className="mp-stone mp-stone--blank">?</span>
            <span className="mp-stone">8</span>
            <span className="mp-stone">10</span>
          </div>
          <p className="mp-example-hint">Compte par 2 !</p>
        </div>
        <div className="mp-setup-badges">
          <span className="mp-badge">Compte par 2</span>
          <span className="mp-badge">Compte par 5</span>
          <span className="mp-badge">Compte par 10</span>
        </div>
        <button className="mp-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>
          Sauter !
        </button>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = calcStars(score, TOTAL);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    const msg = stars === 3 ? '🎉 Champion !' : stars === 2 ? '👍 Bien joué !' : '🐑 Encore !';
    return (
      <div className="mp-page">
        <h2 className="mp-result-title">{msg}</h2>
        <div className="jeux-stars">{starStr}</div>
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {TOTAL}</span></div>
        <div className="jeux-result-stat"><span>Réussite</span><span>{Math.round((score / TOTAL) * 100)} %</span></div>
        <button
          className="mp-cta"
          style={{ marginTop: 28 }}
          onPointerDown={e => { e.preventDefault(); startGame(); }}
        >
          Rejouer
        </button>
        <Link to="/jeux" className="mp-back-link">← Retour aux jeux</Link>
      </div>
    );
  }

  // play phase
  return (
    <div className="mp-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="mp-hud">
        <span className="mp-progress">Saut {idx + 1} / {TOTAL}</span>
        <span className="mp-score">⭐ {score}</span>
      </div>

      <div className="mp-step-badge">Compte {q.label}</div>

      <div className="mp-stones-wrap">
        <div className="mp-sheep-row">
          {q.seq.map((n, i) => (
            <div key={i} className={`mp-stone-col${i === q.blankPos ? ' mp-stone-col--blank' : ''}`}>
              <div className="mp-stone-emoji">
                {i === q.blankPos ? '🐑' : ''}
              </div>
              <div className={`mp-stone${i === q.blankPos ? ' mp-stone--blank' : ''}`}>
                {i === q.blankPos ? '?' : n}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mp-prompt">Quel est le nombre manquant ?</p>

      <div className="mp-choices">
        {q.choices.map((c, ci) => {
          let cls = 'mp-choice';
          if (picked !== null) {
            if (c === q.answer) cls += ' mp-choice--correct';
            else if (picked === ci) cls += ' mp-choice--wrong';
          }
          if (shakeIdx === ci) cls += ' mp-choice--shake';
          return (
            <button
              key={ci}
              className={cls}
              onPointerDown={e => { e.preventDefault(); handleChoice(c, ci); }}
              disabled={picked !== null}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
