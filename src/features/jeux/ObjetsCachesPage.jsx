import { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

const EMOJI_POOL = [
  '🍎','🍊','🍋','🍇','🍓','🫐','🍒','🍑','🥭','🍍',
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯',
  '🚗','🚕','🚙','🚌','🚎','🏎','🚓','🚑','🚒','🚐',
  '⭐','🌟','💫','✨','🌙','☀️','🌈','❄️','🌊','🔥',
  '🎮','🎯','🎲','🎸','🎺','🎻','🥁','🎤','🎧','🎨',
  '🌺','🌸','🌼','🌻','🌹','🌷','🍀','🌿','🍁','🍂',
];

const TARGETS = [
  '🍕','🍔','🌮','🍜','🍣','🍩','🎃','🦄','🐉','🦋',
  '🌵','🎄','🏆','💎','🔮','🧩','🎭','🚀','🛸','🎪',
];

const GRID_COLS = 6;
const GRID_ROWS = 8;
const GRID_SIZE = GRID_COLS * GRID_ROWS;
const GAME_ROUNDS = 10;

const LEVELS = [
  { label: 'N1', key: 'n1', emoji: '🐢', timer: 30 },
  { label: 'N2', key: 'n2', emoji: '🐇', timer: 20 },
  { label: 'N3', key: 'n3', emoji: '⚡', timer: 12 },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildGrid(target) {
  // Place target 1-3 times at random indices
  const count = Math.floor(Math.random() * 3) + 1;
  const positions = shuffle([...Array(GRID_SIZE).keys()]).slice(0, count);
  const posSet = new Set(positions);
  const fillers = shuffle([...EMOJI_POOL]).slice(0, GRID_SIZE - count);
  const grid = [];
  let fillerIdx = 0;
  for (let i = 0; i < GRID_SIZE; i++) {
    if (posSet.has(i)) {
      grid.push({ emoji: target, isTarget: true });
    } else {
      grid.push({ emoji: fillers[fillerIdx++ % fillers.length], isTarget: false });
    }
  }
  return grid;
}

function calcStars(score, total) {
  const pct = score / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.6) return 2;
  return pct >= 0.3 ? 1 : 0;
}

export default function ObjetsCachesPage() {
  const { progress, saveSession, resetTimer } = useGameSession('objets-caches');
  const [phase, setPhase] = useState('setup');
  const [levelIdx, setLevelIdx] = useState(0);
  const [targetsQueue, setTargetsQueue] = useState([]);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [grid, setGrid] = useState([]);
  const [target, setTarget] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [feedback, setFeedback] = useState(null);
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);
  const scoreRef = useRef(0);
  const roundRef = useRef(0);

  const endGame = useCallback((finalScore) => {
    clearInterval(timerRef.current);
    const stars = calcStars(finalScore, GAME_ROUNDS);
    const res = saveSession({ score: finalScore, level: levelIdx + 1, stars });
    setResult({ score: finalScore, stars, ...res });
    setPhase('results');
  }, [saveSession, levelIdx]);

  const loadRound = useCallback((queue, idx, cfg) => {
    const t = queue[idx];
    setTarget(t);
    setGrid(buildGrid(t));
    setFeedback(null);
    setTimeLeft(cfg.timer);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Missed — go next
          const nextIdx = roundRef.current + 1;
          roundRef.current = nextIdx;
          setRound(nextIdx);
          if (nextIdx >= GAME_ROUNDS) {
            endGame(scoreRef.current);
          } else {
            setFeedback('miss');
            setTimeout(() => loadRound(queue, nextIdx, cfg), 700);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [endGame]);

  const startGame = useCallback((idx) => {
    clearInterval(timerRef.current);
    const cfg = LEVELS[idx];
    setLevelIdx(idx);
    setScore(0);
    setRound(0);
    scoreRef.current = 0;
    roundRef.current = 0;
    const queue = shuffle([...TARGETS]).slice(0, GAME_ROUNDS);
    setTargetsQueue(queue);
    resetTimer();
    setPhase('play');
    setTimeout(() => loadRound(queue, 0, cfg), 50);
  }, [resetTimer, loadRound]);

  const handleTap = useCallback((cell) => {
    if (feedback) return;
    clearInterval(timerRef.current);
    if (cell.isTarget) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }
    const nextIdx = roundRef.current + 1;
    roundRef.current = nextIdx;
    setRound(nextIdx);
    setTimeout(() => {
      if (nextIdx >= GAME_ROUNDS) {
        endGame(scoreRef.current);
      } else {
        loadRound(targetsQueue, nextIdx, LEVELS[levelIdx]);
      }
    }, 600);
  }, [feedback, targetsQueue, levelIdx, loadRound, endGame]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const best = progress?.bestScore ?? 0;
  const cfg = LEVELS[levelIdx];

  if (phase === 'setup') {
    return (
      <div className="sm-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="sm-setup">
          <div className="sm-setup__hero">
            <div className="sm-setup__emoji">🔍</div>
            <h1 className="sm-setup__title">Objets Cachés</h1>
            <p className="sm-setup__sub">Trouve l'emoji cible dans la grille !</p>
            {best > 0 && <p className="sm-setup__sub">Meilleur score : {best}</p>}
          </div>
          <div className="sm-level-section">
            <p className="sm-level-title">Choisir un niveau</p>
            <div className="jeux-level-grid">
              {LEVELS.map((lv, i) => (
                <button key={lv.key} className="jeux-level-btn" onClick={() => startGame(i)}>
                  <span>{lv.emoji}</span>
                  <span>{lv.label}</span>
                  <span style={{fontSize:'0.75rem', opacity:0.7}}>{lv.timer}s</span>
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
          <div className="game-results__emoji">🔍</div>
          <h2 className="game-results__title">Résultat</h2>
          <div className="game-results__stars">{'⭐'.repeat(result.stars)}{'☆'.repeat(3 - result.stars)}</div>
          <div className="game-results__stats">
            <div className="game-results__stat"><span>Trouvés</span><strong>{result.score}/{GAME_ROUNDS}</strong></div>
            {result.isNewBest && <div className="jeux-new-best">Nouveau record !</div>}
          </div>
          <button className="game-results__btn" onClick={() => startGame(levelIdx)}>Rejouer</button>
          <button className="game-results__btn" style={{marginTop:8}} onClick={() => { clearInterval(timerRef.current); setPhase('setup'); }}>Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="sm-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="game-hud">
        <span className="game-hud__score">Score : {score}</span>
        <span className="game-hud__round">{round}/{GAME_ROUNDS}</span>
      </div>
      <div className="game-timer-bar">
        <div className={`game-timer-fill${timeLeft <= 5 ? ' game-timer-fill--urgent' : ''}`}
          style={{ width: `${(timeLeft / cfg.timer) * 100}%` }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 16px', gap: 12 }}>
        <div style={{ fontSize: '0.9rem', opacity: 0.8, fontWeight: 700 }}>Trouve :</div>
        <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 2px 8px rgba(255,255,255,0.3))' }}>{target}</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
          gap: 4,
          width: '100%',
          maxWidth: 380,
        }}>
          {grid.map((cell, i) => (
            <button key={i} onClick={() => handleTap(cell)}
              style={{
                background: feedback === 'correct' && cell.isTarget ? 'rgba(74,222,128,0.4)'
                  : feedback === 'wrong' && !cell.isTarget ? 'rgba(248,113,113,0.1)'
                  : 'rgba(255,255,255,0.07)',
                border: 'none',
                borderRadius: 6,
                fontSize: '1.4rem',
                padding: '6px 0',
                cursor: 'pointer',
                transition: 'background 0.15s',
                lineHeight: 1,
              }}>
              {cell.emoji}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>{timeLeft}s restants</div>
      </div>
    </div>
  );
}
