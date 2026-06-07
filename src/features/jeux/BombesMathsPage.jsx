import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

const LEVEL_CONFIG = [
  { label: 'N1 — 1+1 chiffre',           fuseTime: 8,  rounds: 10, gen: genN1 },
  { label: 'N2 — 2+1 chiffre, soustraction', fuseTime: 7, rounds: 10, gen: genN2 },
  { label: 'N3 — Multiplication, division', fuseTime: 6, rounds: 12, gen: genN3 },
  { label: 'N4 — 3 chiffres, 2×2',        fuseTime: 5,  rounds: 12, gen: genN4 },
  { label: 'N5 — Mixte avancé',            fuseTime: 4,  rounds: 15, gen: genN5 },
];

function genN1() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  const op = Math.random() < 0.5 ? '+' : '-';
  if (op === '+') return { text: `${a} + ${b}`, answer: a + b };
  const [big, small] = a >= b ? [a, b] : [b, a];
  return { text: `${big} - ${small}`, answer: big - small };
}

function genN2() {
  const op = Math.random() < 0.5 ? '+' : '-';
  if (op === '+') {
    const a = Math.floor(Math.random() * 90) + 10;
    const b = Math.floor(Math.random() * 9) + 1;
    return { text: `${a} + ${b}`, answer: a + b };
  }
  const a = Math.floor(Math.random() * 90) + 15;
  const b = Math.floor(Math.random() * 9) + 1;
  return { text: `${a} - ${b}`, answer: a - b };
}

function genN3() {
  if (Math.random() < 0.5) {
    const a = Math.floor(Math.random() * 9) + 2;
    const b = Math.floor(Math.random() * 9) + 2;
    return { text: `${a} × ${b}`, answer: a * b };
  }
  // clean division
  const divisors = [2, 3, 4, 5, 6];
  const b = divisors[Math.floor(Math.random() * divisors.length)];
  const q = Math.floor(Math.random() * 8) + 2;
  const a = b * q;
  return { text: `${a} ÷ ${b}`, answer: q };
}

function genN4() {
  const r = Math.random();
  if (r < 0.4) {
    const a = Math.floor(Math.random() * 900) + 100;
    const b = Math.floor(Math.random() * 90) + 10;
    return { text: `${a} + ${b}`, answer: a + b };
  }
  if (r < 0.7) {
    const a = Math.floor(Math.random() * 900) + 200;
    const b = Math.floor(Math.random() * 90) + 10;
    return { text: `${a} - ${b}`, answer: a - b };
  }
  // 2-digit × 2-digit easy (one operand ≤ 15)
  const a = Math.floor(Math.random() * 9) + 11;
  const b = Math.floor(Math.random() * 9) + 2;
  return { text: `${a} × ${b}`, answer: a * b };
}

function genN5() {
  const r = Math.random();
  if (r < 0.33) {
    // (A×B)+C
    const a = Math.floor(Math.random() * 9) + 2;
    const b = Math.floor(Math.random() * 9) + 2;
    const c = Math.floor(Math.random() * 20) + 1;
    return { text: `(${a}×${b})+${c}`, answer: a * b + c };
  }
  if (r < 0.66) {
    // easy squares: 2²–9²
    const a = Math.floor(Math.random() * 8) + 2;
    return { text: `${a}²`, answer: a * a };
  }
  // A×B – C
  const a = Math.floor(Math.random() * 9) + 2;
  const b = Math.floor(Math.random() * 9) + 2;
  const c = Math.floor(Math.random() * 10) + 1;
  return { text: `${a}×${b}−${c}`, answer: a * b - c };
}

function formatTime(secs) {
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m${secs % 60}s`;
}

export default function BombesMathsPage() {
  const { progress, saveSession, resetTimer } = useGameSession('bombes-maths');

  const [phase, setPhase] = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [roundNum, setRoundNum] = useState(0);
  const [question, setQuestion] = useState(null);
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(8);
  const [explosions, setExplosions] = useState(0);
  const [bombState, setBombState] = useState('idle');
  const [feedback, setFeedback] = useState(null);
  const [sessionResult, setSessionResult] = useState(null);

  const timerRef = useRef(null);
  const answeredRef = useRef(false);
  const explosionsRef = useRef(0);

  const cfg = LEVEL_CONFIG[selectedLevel - 1];

  function clearTimer() { clearInterval(timerRef.current); }

  function startGame() {
    const c = LEVEL_CONFIG[selectedLevel - 1];
    explosionsRef.current = 0;
    setExplosions(0);
    setRoundNum(0);
    setInput('');
    setBombState('idle');
    setFeedback(null);
    setQuestion(c.gen());
    setTimeLeft(c.fuseTime);
    setSessionResult(null);
    answeredRef.current = false;
    resetTimer();
    setPhase('play');
  }

  useEffect(() => {
    if (phase !== 'play' || feedback !== null) return;
    answeredRef.current = false;
    const c = LEVEL_CONFIG[selectedLevel - 1];

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          if (!answeredRef.current) {
            answeredRef.current = true;
            explosionsRef.current += 1;
            setExplosions(e => e + 1);
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

  // Save session when results appear
  useEffect(() => {
    if (phase !== 'results') return;
    const expl = explosionsRef.current;
    const stars = expl === 0 ? 3 : expl <= 2 ? 2 : 1;
    const result = saveSession({ score: cfg.rounds - expl, level: selectedLevel, stars });
    setSessionResult(result);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  function scheduleNextRound() {
    const c = LEVEL_CONFIG[selectedLevel - 1];
    setTimeout(() => {
      const next = roundNum + 1;
      if (next >= c.rounds) {
        setPhase('results');
        return;
      }
      setRoundNum(next);
      setQuestion(c.gen());
      setInput('');
      setTimeLeft(c.fuseTime);
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
    if (!correct) {
      explosionsRef.current += 1;
      setExplosions(e => e + 1);
    }
    scheduleNextRound();
  }

  function handleDigit(d) {
    if (feedback !== null) return;
    if (input.length >= 5) return;
    setInput(prev => prev + d);
  }

  function handleDelete() {
    if (feedback !== null) return;
    setInput(prev => prev.slice(0, -1));
  }

  const timerPct = (timeLeft / cfg.fuseTime) * 100;

  if (phase === 'setup') {
    return (
      <div className="bm-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="bm-title">💣 Bombes Maths</h1>
        <p className="bm-subtitle">Résous le calcul avant que la bombe explose !</p>

        <div className="jeux-level-grid">
          {LEVEL_CONFIG.map((lc, i) => {
            const lvl = i + 1;
            const locked = lvl > progress.unlockedLevel;
            const sel = lvl === selectedLevel;
            return (
              <button
                key={lvl}
                className={`jeux-level-btn${sel ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`}
                onPointerDown={() => !locked && setSelectedLevel(lvl)}
                disabled={locked}
              >
                {locked ? '🔒' : `N${lvl}`}
              </button>
            );
          })}
        </div>

        <div className="bm-info-row">
          <span>🔢 {cfg.rounds} bombes</span>
          <span>⏱ {cfg.fuseTime}s par bombe</span>
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

        <button className="bm-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>
          ▶ Désamorcer !
        </button>
      </div>
    );
  }

  if (phase === 'results') {
    const expl = explosions;
    const stars = expl === 0 ? 3 : expl <= 2 ? 2 : 1;
    const msg = stars === 3 ? '🎉 Héros du démineur !' : stars === 2 ? '👍 Bien joué !' : '📚 Entraîne-toi encore !';
    return (
      <div className="bm-page">
        <h2 className="bm-result-title">{msg}</h2>
        <div className="jeux-stars">{'★'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
        <div className="jeux-result-stat"><span>Explosions</span><span>{expl} / {cfg.rounds}</span></div>
        {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
        {sessionResult?.newUnlocked && (
          <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} débloqué !</div>
        )}
        <div className="bm-result-btns">
          <button className="bm-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <button className="bm-cta bm-cta--soft" onPointerDown={() => setPhase('setup')}>Niveaux</button>
          <Link to="/jeux" className="bm-cta bm-cta--soft">← Jeux</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bm-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="bm-hud">
        <span className="bm-score">💥 {explosions}</span>
        <span className="bm-round">Bombe {roundNum + 1} / {cfg.rounds}</span>
      </div>

      <div className="bm-timer-bar">
        <div
          className={`bm-timer-fill${timeLeft <= 2 ? ' bm-timer-fill--urgent' : ''}`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

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

      <div className="bm-question">{question?.text} = ?</div>

      <div className="bm-input-display">
        {input || <span className="bm-input-placeholder">_</span>}
      </div>

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
        <button className="bm-key bm-key--del" onPointerDown={e => { e.preventDefault(); handleDelete(); }}>⌫</button>
        <button className="bm-key" onPointerDown={e => { e.preventDefault(); handleDigit('0'); }}>0</button>
        <button className="bm-key bm-key--ok" onPointerDown={e => { e.preventDefault(); handleConfirm(); }}>✓</button>
      </div>
    </div>
  );
}
