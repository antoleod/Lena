import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import { GameFeedback, useGameFeedback } from './GameFeedback.jsx';
import './jeux.css';

const LEVEL_CONFIG = [
  { label: 'N1 — 1 chiffre',              fuseTime: 8, rounds: 10 },
  { label: 'N2 — 2 chiffres',             fuseTime: 7, rounds: 10 },
  { label: 'N3 — Tables × ÷',             fuseTime: 6, rounds: 12 },
  { label: 'N4 — 3 chiffres',             fuseTime: 5, rounds: 12 },
  { label: 'N5 — Mixte avancé',           fuseTime: 4, rounds: 15 },
];

const ALL_OPS = ['+', '-', '*', '/'];
const OP_LABELS = { '+': '+', '-': '−', '*': '×', '/': '÷' };

// Number ranges per level (min, max for each operand)
const RANGES = [
  [1, 9],
  [10, 99],
  [2, 9],    // level 3: focused on tables (small numbers for × ÷)
  [100, 999],
  [2, 20],   // level 5: mixed, wider table range
];

function generateQuestion(ops, level) {
  const op = ops[Math.floor(Math.random() * ops.length)];
  const [min, max] = RANGES[level - 1];

  if (op === '+') {
    const a = Math.floor(Math.random() * (max - min + 1)) + min;
    const b = Math.floor(Math.random() * (max - min + 1)) + min;
    return { text: `${a} + ${b}`, answer: a + b };
  }
  if (op === '-') {
    const a = Math.floor(Math.random() * (max - min + 1)) + min + (max - min);
    const b = Math.floor(Math.random() * (max - min + 1)) + min;
    const big = Math.max(a, b);
    const small = Math.min(a, b);
    return { text: `${big} - ${small}`, answer: big - small };
  }
  if (op === '*') {
    const cap = Math.min(max, 12);
    const lo = Math.max(min, 2);
    const a = Math.floor(Math.random() * (cap - lo + 1)) + lo;
    const b = Math.floor(Math.random() * (cap - lo + 1)) + lo;
    return { text: `${a} × ${b}`, answer: a * b };
  }
  // division — always generates clean integer result
  const cap = Math.min(max, 12);
  const lo = Math.max(min, 2);
  const b = Math.floor(Math.random() * (cap - lo + 1)) + lo;
  const q = Math.floor(Math.random() * 9) + 1;
  const a = b * q;
  return { text: `${a} ÷ ${b}`, answer: q };
}

function formatTime(secs) {
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m${secs % 60}s`;
}

export default function BombesMathsPage() {
  const { progress, saveSession, resetTimer, logError } = useGameSession('bombes-maths');
  const { feedbackRef, triggerCorrect, triggerWrong, triggerScore } = useGameFeedback();

  const [phase, setPhase] = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedOps, setSelectedOps] = useState(['+', '-', '*', '/']);
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
  const selectedOpsRef = useRef(selectedOps);
  const selectedLevelRef = useRef(selectedLevel);
  const roundNumRef = useRef(roundNum);

  useEffect(() => { selectedOpsRef.current = selectedOps; }, [selectedOps]);
  useEffect(() => { selectedLevelRef.current = selectedLevel; }, [selectedLevel]);
  useEffect(() => { roundNumRef.current = roundNum; }, [roundNum]);

  const cfg = LEVEL_CONFIG[selectedLevel - 1];

  function toggleOp(op) {
    setSelectedOps(prev => {
      if (prev.includes(op)) {
        if (prev.length === 1) return prev;
        return prev.filter(o => o !== op);
      }
      return [...prev, op];
    });
  }

  function clearTimer() { clearInterval(timerRef.current); }

  function startGame() {
    const c = LEVEL_CONFIG[selectedLevel - 1];
    explosionsRef.current = 0;
    setExplosions(0);
    setRoundNum(0);
    roundNumRef.current = 0;
    setInput('');
    setBombState('idle');
    setFeedback(null);
    setQuestion(generateQuestion(selectedOpsRef.current, selectedLevel));
    setTimeLeft(c.fuseTime);
    setSessionResult(null);
    answeredRef.current = false;
    resetTimer();
    setPhase('play');
  }

  useEffect(() => {
    if (phase !== 'play' || feedback !== null) return;
    answeredRef.current = false;
    const c = LEVEL_CONFIG[selectedLevelRef.current - 1];

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
            setQuestion(q => {
              if (q) {
                logError({
                  label: q.text,
                  correct: String(q.answer),
                  given: 'timeout',
                });
              }
              return q;
            });
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

  useEffect(() => {
    if (phase !== 'results') return;
    const expl = explosionsRef.current;
    const stars = expl === 0 ? 3 : expl <= 2 ? 2 : 1;
    const result = saveSession({ score: cfg.rounds - expl, level: selectedLevel, stars });
    setSessionResult(result);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  function scheduleNextRound() {
    const c = LEVEL_CONFIG[selectedLevelRef.current - 1];
    setTimeout(() => {
      const next = roundNumRef.current + 1;
      if (next >= c.rounds) {
        setPhase('results');
        return;
      }
      setRoundNum(next);
      roundNumRef.current = next;
      setQuestion(generateQuestion(selectedOpsRef.current, selectedLevelRef.current));
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
    if (correct) {
      triggerCorrect();
      triggerScore('+10');
    } else {
      explosionsRef.current += 1;
      setExplosions(e => e + 1);
      triggerWrong();
      logError({
        label: question.text,
        correct: String(question.answer),
        given: input,
      });
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

        <div className="jeux-ops-label">Opérations :</div>
        <div className="jeux-ops-grid">
          {ALL_OPS.map(op => (
            <button
              key={op}
              className={`jeux-ops-btn${selectedOps.includes(op) ? ' is-on' : ''}`}
              onPointerDown={() => toggleOp(op)}
            >
              {OP_LABELS[op]}
            </button>
          ))}
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
    const emoji = stars === 3 ? '🏆' : stars === 2 ? '👍' : '💣';
    const title = stars === 3 ? 'Héros du démineur !' : stars === 2 ? 'Bien joué !' : 'Entraîne-toi encore !';
    return (
      <div className="bm-page">
        <GameFeedback ref={feedbackRef} />
        <div className="game-results">
          <div className="game-results__emoji">{emoji}</div>
          <div className="game-results__title">{title}</div>
          <div className="game-results__stars">{'★'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
          {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
          {sessionResult?.newUnlocked && <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} débloqué !</div>}
          <div className="game-results__stats">
            <div className="game-results__stat">
              <span className="game-results__stat-val">{expl}</span>
              <span className="game-results__stat-lbl">Explosions</span>
            </div>
            <div className="game-results__stat">
              <span className="game-results__stat-val">{cfg.rounds - expl}</span>
              <span className="game-results__stat-lbl">Désamorcées</span>
            </div>
          </div>
          <button className="game-results__btn" onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <button className="game-results__btn game-results__btn--soft" onPointerDown={() => setPhase('setup')}>Niveaux</button>
          <Link to="/jeux" className="game-results__btn game-results__btn--soft" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>← Jeux</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bm-page">
      <GameFeedback ref={feedbackRef} />
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="bm-hud game-hud">
        <span className="bm-score game-hud__score">💥 {explosions}</span>
        <span className="bm-round game-hud__round">Bombe {roundNum + 1} / {cfg.rounds}</span>
      </div>

      <div className="bm-timer-bar game-timer-bar">
        <div
          className={`bm-timer-fill game-timer-fill${timeLeft <= 2 ? ' bm-timer-fill--urgent game-timer-fill--urgent' : ''}`}
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

      <div className="bm-question game-question-card">
        <div className="game-question-text">{question?.text} = ?</div>
      </div>

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
        <button className="bm-key bm-key--ok game-btn" style={{ '--btn-color': '#22c55e' }} onPointerDown={e => { e.preventDefault(); handleConfirm(); }}>✓</button>
      </div>
    </div>
  );
}
