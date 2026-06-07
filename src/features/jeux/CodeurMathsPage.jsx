import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

const SYMBOLS = ['★', '●', '▲', '♦'];
const TOTAL_ROUNDS = 12;

// Build all 12 rounds
function buildRounds() {
  const rounds = [];

  // Rounds 1-4: addition, 1 unknown
  for (let i = 0; i < 4; i++) {
    const [s1, s2] = pick2Symbols();
    const a = randInt(1, 8);
    const b = randInt(1, 8);
    const sum = a + b;
    // Show: s1 + s2 = sum, s1 = a, s2 = ?
    const wrong1 = b + randNonZero(-3, 3, 0);
    const wrong2 = b + randNonZero(-3, 3, wrong1 - b);
    rounds.push({
      equations: [`${s1} + ${s2} = ${sum}`, `${s1} = ${a}`],
      question: `${s2} = ?`,
      answer: b,
      choices: shuffle([b, safeWrong(wrong1, b), safeWrong(wrong2, b)]),
    });
  }

  // Rounds 5-8: subtraction, 1 unknown
  for (let i = 0; i < 4; i++) {
    const [s1, s2] = pick2Symbols();
    const result = randInt(1, 7);
    const a = randInt(result + 1, 14);
    const b = a - result; // a - b = result => b = a - result
    const wrong1 = b + randNonZero(-3, 3, 0);
    const wrong2 = b + randNonZero(-3, 3, wrong1 - b);
    rounds.push({
      equations: [`${s1} − ${s2} = ${result}`, `${s1} = ${a}`],
      question: `${s2} = ?`,
      answer: b,
      choices: shuffle([b, safeWrong(wrong1, b), safeWrong(wrong2, b)]),
    });
  }

  // Rounds 9-12: two equations, deduce one unknown
  for (let i = 0; i < 4; i++) {
    const [s1, s2, s3] = pick3Symbols();
    const a = randInt(1, 6);
    const b = randInt(1, 6);
    const c = randInt(1, 6);
    // eq1: s1 + s2 = a+b, eq2: s2 + s3 = b+c, question: s1 = ?
    const wrong1 = a + randNonZero(-2, 2, 0);
    const wrong2 = a + randNonZero(-2, 2, wrong1 - a);
    rounds.push({
      equations: [
        `${s1} + ${s2} = ${a + b}`,
        `${s2} + ${s3} = ${b + c}`,
        `${s3} = ${c}`,
      ],
      question: `${s1} = ?`,
      answer: a,
      choices: shuffle([a, safeWrong(wrong1, a), safeWrong(wrong2, a)]),
    });
  }

  return rounds;
}

function pick2Symbols() {
  const s = shuffle([...SYMBOLS]);
  return [s[0], s[1]];
}

function pick3Symbols() {
  const s = shuffle([...SYMBOLS]);
  return [s[0], s[1], s[2]];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randNonZero(min, max, exclude) {
  let v;
  let tries = 0;
  do {
    v = randInt(min, max);
    tries++;
  } while ((v === 0 || v === exclude) && tries < 20);
  return v === 0 ? (min < 0 ? min : max) : v;
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function safeWrong(v, answer) {
  const c = clamp(v, 1, 15);
  if (c === answer) return c < 8 ? c + 1 : c - 1;
  return c;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function calcStars(score) {
  if (score >= 10) return 3;
  if (score >= 7) return 2;
  return 1;
}

export default function CodeurMathsPage() {
  const [phase, setPhase] = useState('play');
  const [rounds, setRounds] = useState(() => buildRounds());
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null); // chosen answer value
  const [shakeVal, setShakeVal] = useState(null);

  const round = rounds[idx];

  function startGame() {
    setRounds(buildRounds());
    setIdx(0);
    setScore(0);
    setPicked(null);
    setShakeVal(null);
    setPhase('play');
  }

  const handleChoice = useCallback((val) => {
    if (picked !== null) return;
    const correct = val === round.answer;
    setPicked(val);
    if (correct) {
      setScore(s => s + 1);
    } else {
      setShakeVal(val);
      setTimeout(() => setShakeVal(null), 500);
    }
    setTimeout(() => {
      setPicked(null);
      if (idx + 1 >= rounds.length) {
        setPhase('results');
      } else {
        setIdx(i => i + 1);
      }
    }, correct ? 700 : 1300);
  }, [picked, round, idx, rounds]);

  if (phase === 'results') {
    const stars = calcStars(score);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    return (
      <div className="cm2-page">
        <h2 className="cm2-result-title">
          {stars === 3 ? '🎉 Génie des maths !' : stars === 2 ? '👍 Bien joué !' : '🔢 Continue !'}
        </h2>
        <div className="jeux-stars">{starStr}</div>
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {rounds.length}</span></div>
        <button className="cm2-cta" style={{ marginTop: 24 }} onPointerDown={e => { e.preventDefault(); startGame(); }}>
          Rejouer
        </button>
        <Link to="/jeux" className="cm2-back-link">← Retour aux jeux</Link>
      </div>
    );
  }

  const phaseLabel = idx < 4 ? 'Addition' : idx < 8 ? 'Soustraction' : 'Deux équations';

  return (
    <div className="cm2-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="cm2-hud">
        <span className="cm2-progress">Défi {idx + 1} / {rounds.length}</span>
        <span className="cm2-score">⭐ {score}</span>
      </div>
      <div className="cm2-phase-label">{phaseLabel}</div>

      <div className="cm2-equation-card">
        {round.equations.map((eq, i) => (
          <div key={i} className="cm2-equation">{eq}</div>
        ))}
        <div className="cm2-question">{round.question}</div>
      </div>

      <div className="cm2-choices">
        {round.choices.map((val, ci) => {
          let cls = 'cm2-choice';
          if (picked !== null) {
            if (val === round.answer) cls += ' cm2-choice--correct';
            else if (picked === val) cls += ' cm2-choice--wrong';
          }
          if (shakeVal === val) cls += ' cm2-choice--shake';
          return (
            <button
              key={ci}
              className={cls}
              onPointerDown={e => { e.preventDefault(); handleChoice(val); }}
              disabled={picked !== null}
            >
              {val}
            </button>
          );
        })}
      </div>
    </div>
  );
}
