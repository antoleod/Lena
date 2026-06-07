import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

const ROUNDS = 10;
const TIME_LIMIT = 5; // seconds

function generateQuestion(roundNum) {
  // Adaptive: rounds 0-3 = add/sub easy, 4-6 = add/sub harder, 7-9 = multiply
  if (roundNum <= 3) {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const op = Math.random() < 0.5 ? '+' : '-';
    if (op === '+') return { text: `${a} + ${b}`, answer: a + b };
    const [big, small] = a >= b ? [a, b] : [b, a];
    return { text: `${big} - ${small}`, answer: big - small };
  }
  if (roundNum <= 6) {
    const a = Math.floor(Math.random() * 20) + 5;
    const b = Math.floor(Math.random() * 15) + 5;
    const op = Math.random() < 0.5 ? '+' : '-';
    if (op === '+') return { text: `${a} + ${b}`, answer: a + b };
    const [big, small] = a >= b ? [a, b] : [b, a];
    return { text: `${big} - ${small}`, answer: big - small };
  }
  // Multiply
  const a = Math.floor(Math.random() * 9) + 2;
  const b = Math.floor(Math.random() * 9) + 2;
  return { text: `${a} × ${b}`, answer: a * b };
}

export default function BombesMathsPage() {
  const [phase, setPhase] = useState('setup');
  const [roundNum, setRoundNum] = useState(0);
  const [question, setQuestion] = useState(null);
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [score, setScore] = useState(0);
  const [bombState, setBombState] = useState('idle'); // idle | explode | defused
  const [feedback, setFeedback] = useState(null); // null | 'ok' | 'bad'
  const timerRef = useRef(null);
  const answeredRef = useRef(false);

  function clearTimer() {
    clearInterval(timerRef.current);
  }

  function startGame() {
    setScore(0);
    setRoundNum(0);
    setInput('');
    setBombState('idle');
    setFeedback(null);
    setQuestion(generateQuestion(0));
    setTimeLeft(TIME_LIMIT);
    answeredRef.current = false;
    setPhase('play');
  }

  // Timer countdown
  useEffect(() => {
    if (phase !== 'play' || feedback !== null) return;
    answeredRef.current = false;

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          if (!answeredRef.current) {
            answeredRef.current = true;
            setBombState('explode');
            setFeedback('bad');
            scheduleNextRound();
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundNum, phase]);

  function scheduleNextRound() {
    setTimeout(() => {
      const next = roundNum + 1;
      if (next >= ROUNDS) {
        setPhase('results');
        return;
      }
      setRoundNum(next);
      setQuestion(generateQuestion(next));
      setInput('');
      setTimeLeft(TIME_LIMIT);
      setBombState('idle');
      setFeedback(null);
      answeredRef.current = false;
    }, 1200);
  }

  function handleConfirm() {
    if (feedback !== null || answeredRef.current) return;
    if (!input) return;
    clearTimer();
    answeredRef.current = true;
    const correct = parseInt(input, 10) === question.answer;
    setFeedback(correct ? 'ok' : 'bad');
    setBombState(correct ? 'defused' : 'explode');
    if (correct) setScore(s => s + 1);
    scheduleNextRound();
  }

  function handleDigit(d) {
    if (feedback !== null) return;
    if (input.length >= 4) return;
    setInput(prev => prev + d);
  }

  function handleDelete() {
    if (feedback !== null) return;
    setInput(prev => prev.slice(0, -1));
  }

  const timerPct = (timeLeft / TIME_LIMIT) * 100;

  if (phase === 'setup') {
    return (
      <div className="bm-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="bm-title">💣 Bombes Maths</h1>
        <p className="bm-subtitle">Résous le calcul avant que la bombe explose !</p>
        <div className="bm-demo-bomb">💣</div>
        <div className="bm-demo-timer-bar">
          <div className="bm-demo-timer-fill" />
        </div>
        <div className="bm-info-row">
          <span>🔢 {ROUNDS} bombes</span>
          <span>⏱ {TIME_LIMIT}s par bombe</span>
        </div>
        <button className="bm-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>
          ▶ Désamorcer !
        </button>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = score >= 9 ? 3 : score >= 6 ? 2 : 1;
    const msg = stars === 3 ? '🎉 Héros du démineur !' : stars === 2 ? '👍 Bien joué !' : '📚 Entraîne-toi encore !';
    return (
      <div className="bm-page">
        <h2 className="bm-result-title">{msg}</h2>
        <div className="jeux-stars">{'★'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
        <div className="jeux-result-stat"><span>Bombes désamorcées</span><span>{score} / {ROUNDS}</span></div>
        <div className="bm-result-btns">
          <button className="bm-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <Link to="/jeux" className="bm-cta bm-cta--soft">← Jeux</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bm-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="bm-hud">
        <span className="bm-score">✅ {score}</span>
        <span className="bm-round">Bombe {roundNum + 1} / {ROUNDS}</span>
      </div>

      {/* Timer bar */}
      <div className="bm-timer-bar">
        <div
          className={`bm-timer-fill${timeLeft <= 2 ? ' bm-timer-fill--urgent' : ''}`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      {/* Bomb display */}
      <div className={`bm-bomb-wrap${bombState === 'explode' ? ' bm-bomb-explode' : bombState === 'defused' ? ' bm-bomb-defused' : ''}`}>
        <div className="bm-bomb-emoji">
          {bombState === 'explode' ? '💥' : bombState === 'defused' ? '✅' : '💣'}
        </div>
        <div className="bm-timer-ring-wrap">
          <svg className="bm-ring-svg" viewBox="0 0 64 64">
            <circle className="bm-ring-bg" cx="32" cy="32" r="28" />
            <circle
              className={`bm-ring-progress${timeLeft <= 2 ? ' bm-ring-urgent' : ''}`}
              cx="32" cy="32" r="28"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - timerPct / 100)}`}
            />
          </svg>
          <span className="bm-ring-countdown">{timeLeft}</span>
        </div>
      </div>

      {/* Question */}
      <div className="bm-question">{question?.text} = ?</div>

      {/* Input display */}
      <div className="bm-input-display">
        {input || <span className="bm-input-placeholder">_</span>}
      </div>

      {/* Numpad */}
      <div className="bm-numpad">
        {[1,2,3,4,5,6,7,8,9].map(d => (
          <button
            key={d}
            className="bm-key"
            onPointerDown={e => { e.preventDefault(); handleDigit(String(d)); }}
          >
            {d}
          </button>
        ))}
        <button
          className="bm-key bm-key--del"
          onPointerDown={e => { e.preventDefault(); handleDelete(); }}
        >
          ⌫
        </button>
        <button
          className="bm-key"
          onPointerDown={e => { e.preventDefault(); handleDigit('0'); }}
        >
          0
        </button>
        <button
          className="bm-key bm-key--ok"
          onPointerDown={e => { e.preventDefault(); handleConfirm(); }}
        >
          ✓
        </button>
      </div>
    </div>
  );
}
