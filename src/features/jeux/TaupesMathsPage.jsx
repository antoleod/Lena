import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

const LEVEL_CONFIG = [
  { label: 'N1 — Addition ≤10',        max: 10, visibleMs: 2500, intervalMs: 3000, duration: 60,  holeCount: 9  },
  { label: 'N2 — Addition ≤20',         max: 20, visibleMs: 2000, intervalMs: 2500, duration: 60,  holeCount: 9  },
  { label: 'N3 — Calculs ≤20',          max: 20, visibleMs: 1800, intervalMs: 2000, duration: 90,  holeCount: 9  },
  { label: 'N4 — Tables',               max: 9,  visibleMs: 1500, intervalMs: 1800, duration: 90,  holeCount: 9  },
  { label: 'N5 — Rapide (4×4)',         max: 9,  visibleMs: 1200, intervalMs: 1500, duration: 120, holeCount: 16 },
];

const ALL_OPS = ['+', '-', '*', '/'];
const OP_LABELS = { '+': '+', '-': '−', '*': '×', '/': '÷' };

function generateProblem(max, selectedOps) {
  const op = selectedOps[Math.floor(Math.random() * selectedOps.length)];
  let a, b, answer;
  if (op === '+') {
    a = Math.floor(Math.random() * max) + 1;
    b = Math.floor(Math.random() * (max - a)) + 1;
    answer = a + b;
  } else if (op === '-') {
    a = Math.floor(Math.random() * max) + 2;
    b = Math.floor(Math.random() * (a - 1)) + 1;
    answer = a - b;
  } else if (op === '*') {
    const cap = Math.min(max, 9);
    a = Math.floor(Math.random() * cap) + 1;
    b = Math.floor(Math.random() * cap) + 1;
    answer = a * b;
  } else {
    const cap = Math.min(max, 8);
    b = Math.floor(Math.random() * (cap - 1)) + 2;
    answer = Math.floor(Math.random() * 8) + 1;
    a = b * answer;
  }
  const sym = op === '*' ? '×' : op === '/' ? '÷' : op;
  return { text: `${a}${sym}${b}`, answer };
}

function generateChoices(answer) {
  const choices = new Set([answer]);
  while (choices.size < 3) {
    const delta = Math.floor(Math.random() * 5) + 1;
    const v = Math.random() < 0.5 ? answer + delta : Math.max(1, answer - delta);
    choices.add(v);
  }
  return [...choices].sort(() => Math.random() - 0.5);
}

function calcStars(score, level) {
  if (score >= level * 200) return 3;
  if (score >= level * 100) return 2;
  return 1;
}

function formatTime(secs) {
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m${secs % 60}s`;
}

export default function TaupesMathsPage() {
  const { progress, saveSession, resetTimer } = useGameSession('taupes');

  const [phase, setPhase] = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedOps, setSelectedOps] = useState(['+', '-', '*', '/']);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [moles, setMoles] = useState(Array(9).fill(null));
  const [choices, setChoices] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [activeMole, setActiveMole] = useState(null);
  const [sessionResult, setSessionResult] = useState(null);

  const feedbackTimer = useRef(null);
  const moleHideTimer = useRef(null);
  const moleShowInterval = useRef(null);
  const clockInterval = useRef(null);
  const scoreRef = useRef(0);
  const selectedOpsRef = useRef(selectedOps);

  useEffect(() => { selectedOpsRef.current = selectedOps; }, [selectedOps]);

  const cfg = LEVEL_CONFIG[selectedLevel - 1];

  function toggleOp(op) {
    setSelectedOps(prev => {
      if (prev.includes(op)) {
        if (prev.length === 1) return prev; // keep at least one
        return prev.filter(o => o !== op);
      }
      return [...prev, op];
    });
  }

  const spawnMole = useCallback(() => {
    const levelCfg = LEVEL_CONFIG[selectedLevel - 1];
    const problem = generateProblem(levelCfg.max, selectedOpsRef.current);
    const idx = Math.floor(Math.random() * levelCfg.holeCount);
    setMoles(prev => {
      const next = [...prev];
      next[idx] = problem;
      return next;
    });
    setActiveMole(idx);
    setChoices(generateChoices(problem.answer));

    if (moleHideTimer.current) clearTimeout(moleHideTimer.current);
    moleHideTimer.current = setTimeout(() => {
      setMoles(prev => {
        const next = [...prev];
        next[idx] = null;
        return next;
      });
      setActiveMole(null);
    }, levelCfg.visibleMs);
  }, [selectedLevel]);

  const startGame = () => {
    const levelCfg = LEVEL_CONFIG[selectedLevel - 1];
    scoreRef.current = 0;
    setScore(0);
    setTimeLeft(levelCfg.duration);
    setMoles(Array(levelCfg.holeCount).fill(null));
    setActiveMole(null);
    setFeedback('');
    setSessionResult(null);
    resetTimer();
    setPhase('play');
  };

  useEffect(() => {
    if (phase !== 'play') return;
    spawnMole();
    moleShowInterval.current = setInterval(spawnMole, cfg.intervalMs);
    clockInterval.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(moleShowInterval.current);
          clearInterval(clockInterval.current);
          clearTimeout(moleHideTimer.current);
          setPhase('results');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      clearInterval(moleShowInterval.current);
      clearInterval(clockInterval.current);
      clearTimeout(moleHideTimer.current);
    };
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase !== 'results') return;
    const stars = calcStars(scoreRef.current, selectedLevel);
    const result = saveSession({ score: scoreRef.current, level: selectedLevel, stars });
    setSessionResult(result);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChoice = (choice) => {
    if (activeMole === null) return;
    const mole = moles[activeMole];
    if (!mole) return;
    if (choice === mole.answer) {
      const gain = 10 * selectedLevel;
      scoreRef.current += gain;
      setScore(s => s + gain);
      setFeedback(`+${gain} ! Bravo !`);
      setMoles(prev => { const n = [...prev]; n[activeMole] = null; return n; });
      setActiveMole(null);
      clearTimeout(moleHideTimer.current);
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      feedbackTimer.current = setTimeout(() => setFeedback(''), 800);
    } else {
      setFeedback('-5 ! Essaie encore !');
      scoreRef.current = Math.max(0, scoreRef.current - 5);
      setScore(s => Math.max(0, s - 5));
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      feedbackTimer.current = setTimeout(() => setFeedback(''), 800);
    }
  };

  const gridCols = cfg.holeCount === 16 ? 4 : 3;

  if (phase === 'setup') {
    return (
      <div className="tm-page">
        <div className="tm-setup-icon">🦔</div>
        <div className="tm-setup-title">Taupes Maths</div>
        <div className="tm-setup-sub">Tape la bonne réponse avant que la taupe disparaisse !</div>

        <div className="jeux-level-grid">
          {LEVEL_CONFIG.map((lc, i) => {
            const lvl = i + 1;
            const locked = lvl > progress.unlockedLevel;
            const selected = lvl === selectedLevel;
            const stars = progress.bestScore > 0 && !locked ? calcStars(progress.bestScore, lvl) : 0;
            return (
              <button
                key={lvl}
                className={`jeux-level-btn${selected ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`}
                onPointerDown={() => !locked && setSelectedLevel(lvl)}
                disabled={locked}
              >
                {locked ? '🔒' : `N${lvl}`}
                {!locked && stars > 0 && (
                  <span className="jeux-level-stars">{'★'.repeat(stars)}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="tm-setup-sub" style={{ marginBottom: 8 }}>{cfg.label}</div>

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

        <button className="tm-cta" onPointerDown={startGame}>C'est parti !</button>
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <Link to="/jeux" style={{ color: 'rgba(255,255,255,.6)', textDecoration: 'none' }}>Retour aux jeux</Link>
        </div>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = calcStars(score, selectedLevel);
    return (
      <div className="tm-page">
        <div className="tm-result-title">Temps écoulé !</div>
        <div className="jeux-stars">{'★'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
        <div className="jeux-result-stat"><span>Score</span><span>{score} pts</span></div>
        {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
        {sessionResult?.newUnlocked && (
          <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} débloqué !</div>
        )}
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="tm-cta" onPointerDown={startGame}>Rejouer</button>
          <button className="tm-cta tm-cta--soft" onPointerDown={() => setPhase('setup')}>Changer de niveau</button>
          <Link to="/jeux" style={{ display: 'block', textAlign: 'center', color: 'rgba(255,255,255,.6)', textDecoration: 'none', marginTop: 8 }}>
            Retour aux jeux
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="tm-page">
      <div className="tm-header">
        <Link to="/jeux" className="tm-back">← Jeux</Link>
        <div className="tm-title">Taupes Maths</div>
      </div>
      <div className="tm-hud">
        <div className="tm-score">Score : {score}</div>
        <div className={`tm-timer${timeLeft <= 10 ? ' tm-timer--urgent' : ''}`}>{timeLeft}s</div>
      </div>
      <div className="tm-grid" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
        {moles.map((mole, idx) => (
          <div key={idx} className="tm-hole" onPointerDown={() => {}}>
            {mole && (
              <div className="tm-mole">
                <span className="tm-mole-emoji">🦔</span>
                <span className="tm-mole-problem">{mole.text}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={`tm-feedback${feedback.startsWith('+') ? ' tm-feedback--ok' : feedback ? ' tm-feedback--bad' : ''}`}>
        {feedback}
      </div>
      <div className="tm-choices">
        {choices.map((c, i) => (
          <button key={i} className="tm-choice" onPointerDown={() => handleChoice(c)}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
