import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

const LEVELS = [
  { label: 'CP (6-7 ans)',   ops: ['+'],         max: 10, time: 20 },
  { label: 'CE1 (7-8 ans)',  ops: ['+', '-'],    max: 20, time: 18 },
  { label: 'CE2 (8-9 ans)',  ops: ['+', '-', '×'], max: 30, time: 15 },
];

function makeQuestion(ops, max) {
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;
  if (op === '+') {
    a = Math.floor(Math.random() * max) + 1;
    b = Math.floor(Math.random() * (max - a)) + 1;
    answer = a + b;
  } else if (op === '-') {
    a = Math.floor(Math.random() * max) + 2;
    b = Math.floor(Math.random() * (a - 1)) + 1;
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * 9) + 2;
    b = Math.floor(Math.random() * 9) + 2;
    answer = a * b;
  }
  const opChar = op === '×' ? '×' : op;
  const wrongs = new Set();
  while (wrongs.size < 3) {
    const w = answer + (Math.floor(Math.random() * 7) - 3);
    if (w !== answer && w > 0) wrongs.add(w);
  }
  const choices = shuffle([answer, ...[...wrongs]]);
  return { text: `${a} ${opChar} ${b} = ?`, answer, choices };
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const BUBBLE_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899'];
const BUBBLE_POSITIONS = [
  { left: '8%',  top: '30%' },
  { left: '28%', top: '15%' },
  { left: '58%', top: '20%' },
  { left: '76%', top: '38%' },
];

export default function BullesCalculPage() {
  const [phase, setPhase]     = useState('setup');
  const [levelIdx, setLevelIdx] = useState(0);
  const [question, setQuestion] = useState(null);
  const [score, setScore]     = useState(0);
  const [round, setRound]     = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [feedback, setFeedback] = useState(null); // null | 'ok' | 'bad'
  const [streak, setStreak]   = useState(0);
  const ROUNDS = 10;
  const timerRef = useRef(null);

  function startGame() {
    setScore(0); setRound(0); setStreak(0); setFeedback(null);
    nextQuestion(0, LEVELS[levelIdx]);
    setPhase('play');
  }

  function nextQuestion(currentRound, level) {
    if (currentRound >= ROUNDS) { setPhase('results'); return; }
    const q = makeQuestion(level.ops, level.max);
    setQuestion(q);
    setTimeLeft(level.time);
    setRound(currentRound);
  }

  useEffect(() => {
    if (phase !== 'play' || feedback !== null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleAnswer(null);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, question, feedback]);

  function handleAnswer(val) {
    clearInterval(timerRef.current);
    if (feedback !== null) return;
    const correct = val === question?.answer;
    setFeedback(correct ? 'ok' : 'bad');
    if (correct) {
      const bonus = streak >= 2 ? 2 : 1;
      setScore(s => s + bonus);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
    setTimeout(() => {
      setFeedback(null);
      const next = round + 1;
      nextQuestion(next, LEVELS[levelIdx]);
    }, 900);
  }

  const level = LEVELS[levelIdx];

  if (phase === 'setup') {
    return (
      <div className="bc-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="bc-title">🫧 Bulles de Calcul</h1>
        <p className="bc-subtitle">Crève la bonne bulle !</p>
        <div className="bc-levels">
          {LEVELS.map((l, i) => (
            <button key={i} className={`bc-level-btn${levelIdx === i ? ' is-selected' : ''}`}
              onPointerDown={e => { e.preventDefault(); setLevelIdx(i); }}>
              {l.label}
            </button>
          ))}
        </div>
        <button className="bc-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>▶ Jouer</button>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = score >= ROUNDS * 1.8 ? 3 : score >= ROUNDS ? 2 : 1;
    return (
      <div className="bc-page">
        <h2 className="bc-result-title">{stars === 3 ? '🎉 Super !' : stars === 2 ? '👍 Bien !' : '📚 Continue !'}</h2>
        <div className="jeux-stars">{'★'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
        <div className="jeux-result-stat"><span>Score</span><span>{score} pts</span></div>
        <div className="jeux-result-stat"><span>Questions</span><span>{ROUNDS}</span></div>
        <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
          <button className="bc-cta" style={{ flex: 1 }} onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <button className="bc-cta bc-cta--soft" style={{ flex: 1 }} onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}>Niveaux</button>
        </div>
        <Link to="/jeux" className="bc-cta bc-cta--soft" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: 12 }}>← Jeux</Link>
      </div>
    );
  }

  const timerPct = (timeLeft / level.time) * 100;

  return (
    <div className="bc-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="bc-hud">
        <span className="bc-score">⭐ {score}</span>
        {streak >= 2 && <span className="bc-streak">🔥 ×{streak}</span>}
        <span className="bc-round">{round + 1} / {ROUNDS}</span>
      </div>
      <div className="bc-timer-bar">
        <div className="bc-timer-fill" style={{ width: `${timerPct}%`, background: timerPct < 30 ? '#ef4444' : '#22c55e' }} />
      </div>

      <div className="bc-question">{question?.text}</div>

      <div className={`bc-bubbles${feedback === 'ok' ? ' bc-flash-ok' : feedback === 'bad' ? ' bc-flash-bad' : ''}`}>
        {question?.choices.map((choice, i) => (
          <button
            key={choice}
            className={`bc-bubble`}
            style={{
              '--bc-color': BUBBLE_COLORS[i],
              left: BUBBLE_POSITIONS[i].left,
              top:  BUBBLE_POSITIONS[i].top,
              animationDelay: `${i * 0.4}s`,
            }}
            onPointerDown={e => { e.preventDefault(); handleAnswer(choice); }}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
