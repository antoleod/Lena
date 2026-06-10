import { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

const LEVELS = [
  { label: 'N1', key: 'n1', emoji: '➕', desc: 'Addition jusqu\'à 50', ops: ['+'], max: 50 },
  { label: 'N2', key: 'n2', emoji: '➕➖', desc: 'Addition/Soustraction jusqu\'à 100', ops: ['+', '-'], max: 100 },
  { label: 'N3', key: 'n3', emoji: '✖️', desc: 'Multiplication jusqu\'à 10×10', ops: ['×'], max: 10 },
  { label: 'N4', key: 'n4', emoji: '🔢', desc: 'Mélange jusqu\'à 500', ops: ['+', '-', '×'], max: 500 },
];

const TIMER = 45;
const ROUNDS = 10;

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion(cfg) {
  const op = cfg.ops[Math.floor(Math.random() * cfg.ops.length)];
  let a, b, exact;
  if (op === '×') {
    a = rnd(2, cfg.max <= 10 ? 10 : 12);
    b = rnd(2, 10);
    exact = a * b;
  } else if (op === '+') {
    a = rnd(1, cfg.max);
    b = rnd(1, cfg.max - a);
    exact = a + b;
  } else {
    a = rnd(10, cfg.max);
    b = rnd(1, a);
    exact = a - b;
  }

  // Generate 4 estimates close to exact
  const offsets = [-15, -8, 8, 15];
  let distractors = offsets.map(d => {
    const v = exact + Math.round(d + rnd(-5, 5));
    return Math.max(0, Math.round(v / 5) * 5);
  });

  const correct = Math.round(exact / 5) * 5;
  distractors = distractors.filter(d => d !== correct && d > 0);
  // unique
  const seen = new Set([correct]);
  const unique = [];
  for (const d of distractors) {
    if (!seen.has(d)) { seen.add(d); unique.push(d); }
    if (unique.length === 3) break;
  }
  while (unique.length < 3) {
    const v = correct + (unique.length + 1) * 10;
    if (!seen.has(v)) { seen.add(v); unique.push(v); }
  }

  const choices = shuffle([correct, ...unique.slice(0, 3)]);
  return { text: `${a} ${op} ${b}`, exact, correct, choices };
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function calcStars(score, rounds) {
  const pct = score / rounds;
  if (pct >= 0.9) return 3;
  if (pct >= 0.6) return 2;
  return pct >= 0.3 ? 1 : 0;
}

export default function EstimationPage() {
  const { progress, saveSession, resetTimer } = useGameSession('estimation');
  const [phase, setPhase] = useState('setup');
  const [levelIdx, setLevelIdx] = useState(0);
  const [question, setQuestion] = useState(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIMER);
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);
  const scoreRef = useRef(0);
  const roundRef = useRef(0);
  const streakRef = useRef(0);

  const endGame = useCallback((finalScore) => {
    clearInterval(timerRef.current);
    const stars = calcStars(finalScore, ROUNDS);
    const res = saveSession({ score: finalScore, level: levelIdx + 1, stars });
    setResult({ score: finalScore, stars, ...res });
    setPhase('results');
  }, [saveSession, levelIdx]);

  const nextQuestion = useCallback((cfg) => {
    setQuestion(generateQuestion(cfg));
    setChosen(null);
  }, []);

  const startGame = useCallback((idx) => {
    clearInterval(timerRef.current);
    const cfg = LEVELS[idx];
    setLevelIdx(idx);
    setRound(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(TIMER);
    setChosen(null);
    scoreRef.current = 0;
    roundRef.current = 0;
    streakRef.current = 0;
    setQuestion(generateQuestion(cfg));
    resetTimer();
    setPhase('play');

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          endGame(scoreRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [resetTimer, endGame]);

  const handleChoice = useCallback((choice) => {
    if (chosen !== null) return;
    setChosen(choice);
    const cfg = LEVELS[levelIdx];
    const isCorrect = choice === question.correct;
    let pts = 0;
    if (isCorrect) {
      streakRef.current += 1;
      pts = streakRef.current >= 4 ? 2 : 1;
      scoreRef.current += pts;
      setStreak(streakRef.current);
      setScore(scoreRef.current);
    } else {
      streakRef.current = 0;
      setStreak(0);
    }

    roundRef.current += 1;
    setRound(roundRef.current);

    setTimeout(() => {
      if (roundRef.current >= ROUNDS) {
        endGame(scoreRef.current);
      } else {
        nextQuestion(cfg);
      }
    }, 700);
  }, [chosen, question, levelIdx, nextQuestion, endGame]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const best = progress?.bestScore ?? 0;
  const cfg = LEVELS[levelIdx];

  if (phase === 'setup') {
    return (
      <div className="sm-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="sm-setup">
          <div className="sm-setup__hero">
            <div className="sm-setup__emoji">🧮</div>
            <h1 className="sm-setup__title">Estimation</h1>
            <p className="sm-setup__sub">Choisis l'estimation la plus proche !</p>
            {best > 0 && <p className="sm-setup__sub">Meilleur score : {best}</p>}
          </div>
          <div className="sm-level-section">
            <p className="sm-level-title">Choisir un niveau</p>
            <div className="jeux-level-grid">
              {LEVELS.map((lv, i) => (
                <button key={lv.key} className="jeux-level-btn" onClick={() => startGame(i)}>
                  <span>{lv.emoji}</span>
                  <span>{lv.label}</span>
                  <span style={{fontSize:'0.75rem', opacity:0.7}}>{lv.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'results') {
    return (
      <div className="sm-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="game-results">
          <div className="game-results__emoji">🧮</div>
          <h2 className="game-results__title">Résultat</h2>
          <div className="game-results__stars">{'⭐'.repeat(result.stars)}{'☆'.repeat(3 - result.stars)}</div>
          <div className="game-results__stats">
            <div className="game-results__stat"><span>Score</span><strong>{result.score}</strong></div>
            {result.isNewBest && <div className="jeux-new-best">Nouveau record !</div>}
          </div>
          <button className="game-results__btn" onClick={() => startGame(levelIdx)}>Rejouer</button>
          <button className="game-results__btn" style={{marginTop:8}} onClick={() => { clearInterval(timerRef.current); setPhase('setup'); }}>Menu</button>
        </div>
      </div>
    );
  }

  if (!question) return null;
  return (
    <div className="sm-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="game-hud">
        <span className="game-hud__score">Score : {score}</span>
        <span className="game-hud__round">{round}/{ROUNDS}</span>
        {streak >= 4 && <span className="game-hud__streak">🔥×2</span>}
      </div>
      <div className="game-timer-bar">
        <div className="game-timer-fill" style={{ width: `${(timeLeft / TIMER) * 100}%` }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px', gap: 16 }}>
        <div className="game-question-card">
          <div className="game-question-sub">{cfg.emoji} Niveau {cfg.label} — {timeLeft}s</div>
          <div className="game-question-text" style={{ fontSize: '2.5rem', letterSpacing: '0.05em' }}>
            {question.text}
          </div>
          <div className="game-question-sub">≈ ?</div>
        </div>
        <div className="sm-choices">
          {question.choices.map((c) => {
            let cls = 'sm-choice';
            if (chosen !== null) {
              if (c === question.correct) cls += ' is-correct';
              else if (c === chosen) cls += ' is-wrong';
            }
            return (
              <button key={c} className={cls} onClick={() => handleChoice(c)}
                style={{ '--btn-color': '#d97706' }}>{c}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
