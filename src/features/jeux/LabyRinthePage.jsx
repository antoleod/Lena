import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

// Maze generation: recursive backtracking DFS
// Cells are stored as 1D array of size W*H
// Each cell has walls: {top, right, bottom, left}

function createMaze(W, H) {
  const cells = Array.from({ length: W * H }, () => ({
    walls: { top: true, right: true, bottom: true, left: true },
    visited: false,
  }));

  function idx(x, y) { return y * W + x; }

  function neighbors(x, y) {
    const dirs = [];
    if (y > 0) dirs.push({ dx: 0, dy: -1, wall: 'top', opp: 'bottom' });
    if (x < W - 1) dirs.push({ dx: 1, dy: 0, wall: 'right', opp: 'left' });
    if (y < H - 1) dirs.push({ dx: 0, dy: 1, wall: 'bottom', opp: 'top' });
    if (x > 0) dirs.push({ dx: -1, dy: 0, wall: 'left', opp: 'right' });
    return dirs.filter(d => !cells[idx(x + d.dx, y + d.dy)].visited);
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function visit(x, y) {
    cells[idx(x, y)].visited = true;
    const ns = shuffle(neighbors(x, y));
    for (const d of ns) {
      if (!cells[idx(x + d.dx, y + d.dy)].visited) {
        cells[idx(x, y)].walls[d.wall] = false;
        cells[idx(x + d.dx, y + d.dy)].walls[d.opp] = false;
        visit(x + d.dx, y + d.dy);
      }
    }
  }

  visit(0, 0);
  return cells;
}

const LEVELS = [
  { label: 'N1', key: 'n1', emoji: '🗺️', W: 7, H: 7 },
  { label: 'N2', key: 'n2', emoji: '🧭', W: 9, H: 9 },
  { label: 'N3', key: 'n3', emoji: '🏔️', W: 11, H: 11 },
];

function generateMathQ(level) {
  const a = Math.floor(Math.random() * (10 + level * 5)) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const op = level >= 2 && Math.random() > 0.5 ? '-' : '+';
  const answer = op === '+' ? a + b : a - b;
  const wrongs = [answer + 2, answer - 2, answer + 5].filter(v => v !== answer && v > 0);
  const choices = shuffle([answer, ...wrongs.slice(0, 3)]);
  return { text: `${a} ${op} ${b} = ?`, answer, choices };
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function calcStars(moves, W, H) {
  const min = (W + H) * 2;
  if (moves < min * 1.5) return 3;
  if (moves < min * 2.5) return 2;
  return 1;
}

export default function LabyRinthePage() {
  const { progress, saveSession, resetTimer, elapsedSecs } = useGameSession('labyrinthe');
  const [phase, setPhase] = useState('setup');
  const [levelIdx, setLevelIdx] = useState(0);
  const [maze, setMaze] = useState([]);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [moves, setMoves] = useState(0);
  const [mathQ, setMathQ] = useState(null);
  const [result, setResult] = useState(null);
  const moveCountRef = useRef(0);
  const pendingMoveRef = useRef(null);

  const startGame = useCallback((idx) => {
    const cfg = LEVELS[idx];
    setLevelIdx(idx);
    setMaze(createMaze(cfg.W, cfg.H));
    setPos({ x: 0, y: 0 });
    setMoves(0);
    moveCountRef.current = 0;
    setMathQ(null);
    resetTimer();
    setPhase('play');
  }, [resetTimer]);

  const cfg = LEVELS[levelIdx];

  const tryMove = useCallback((dx, dy) => {
    if (mathQ) return; // question open
    setPos(prev => {
      const cell = maze[prev.y * cfg.W + prev.x];
      const dir = dx === 1 ? 'right' : dx === -1 ? 'left' : dy === 1 ? 'bottom' : 'top';
      if (cell.walls[dir]) return prev; // wall

      const nx = prev.x + dx;
      const ny = prev.y + dy;
      if (nx < 0 || nx >= cfg.W || ny < 0 || ny >= cfg.H) return prev;

      moveCountRef.current += 1;
      setMoves(moveCountRef.current);

      // Every 4 moves: show a math question
      if (moveCountRef.current % 4 === 0) {
        pendingMoveRef.current = { x: nx, y: ny };
        setMathQ(generateMathQ(levelIdx));
        return prev; // stay at prev until answered
      }

      // Check win
      if (nx === cfg.W - 1 && ny === cfg.H - 1) {
        const timeSecs = elapsedSecs();
        const stars = calcStars(moveCountRef.current, cfg.W, cfg.H);
        const res = saveSession({ score: moveCountRef.current, level: levelIdx + 1, stars });
        setResult({ moves: moveCountRef.current, stars, timeSecs, ...res });
        setTimeout(() => setPhase('results'), 300);
      }

      return { x: nx, y: ny };
    });
  }, [mathQ, maze, cfg, levelIdx, elapsedSecs, saveSession]);

  const answerMath = useCallback((choice) => {
    if (!mathQ) return;
    if (choice === mathQ.answer) {
      // Correct: proceed
      const np = pendingMoveRef.current;
      setMathQ(null);
      if (np) {
        setPos(np);
        if (np.x === cfg.W - 1 && np.y === cfg.H - 1) {
          const timeSecs = elapsedSecs();
          const stars = calcStars(moveCountRef.current, cfg.W, cfg.H);
          const res = saveSession({ score: moveCountRef.current, level: levelIdx + 1, stars });
          setResult({ moves: moveCountRef.current, stars, timeSecs, ...res });
          setTimeout(() => setPhase('results'), 300);
        }
      }
    } else {
      // Wrong: pushed back, stay at current pos
      setMathQ(null);
      pendingMoveRef.current = null;
    }
  }, [mathQ, cfg, elapsedSecs, saveSession, levelIdx]);

  const best = progress?.bestScore ?? 0;

  if (phase === 'setup') {
    return (
      <div className="sm-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="sm-setup">
          <div className="sm-setup__hero">
            <div className="sm-setup__emoji">🗺️</div>
            <h1 className="sm-setup__title">Labyrinthe</h1>
            <p className="sm-setup__sub">Guide le personnage jusqu'à l'étoile !</p>
            {best > 0 && <p className="sm-setup__sub">Meilleur : {best} mouvements</p>}
          </div>
          <div className="sm-level-section">
            <p className="sm-level-title">Choisir un niveau</p>
            <div className="jeux-level-grid">
              {LEVELS.map((lv, i) => (
                <button key={lv.key} className="jeux-level-btn" onClick={() => startGame(i)}>
                  <span>{lv.emoji}</span>
                  <span>{lv.label} ({lv.W}×{lv.H})</span>
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
          <div className="game-results__emoji">⭐</div>
          <h2 className="game-results__title">Sortie !</h2>
          <div className="game-results__stars">{'⭐'.repeat(result.stars)}{'☆'.repeat(3 - result.stars)}</div>
          <div className="game-results__stats">
            <div className="game-results__stat"><span>Mouvements</span><strong>{result.moves}</strong></div>
            <div className="game-results__stat"><span>Temps</span><strong>{result.timeSecs}s</strong></div>
            {result.isNewBest && <div className="jeux-new-best">Nouveau record !</div>}
          </div>
          <button className="game-results__btn" onClick={() => startGame(levelIdx)}>Rejouer</button>
          <button className="game-results__btn" style={{marginTop:8}} onClick={() => setPhase('setup')}>Menu</button>
        </div>
      </div>
    );
  }

  const CELL_SIZE = Math.min(34, Math.floor(330 / cfg.W));

  return (
    <div className="sm-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="game-hud">
        <span className="game-hud__score">Moves : {moves}</span>
        <span className="game-hud__round">{cfg.label}</span>
      </div>

      {mathQ && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div className="game-question-card" style={{ maxWidth: 340, width: '90%' }}>
            <div className="game-question-sub">🔢 Question mathématique</div>
            <div className="game-question-text" style={{ fontSize: '1.8rem' }}>{mathQ.text}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
              {mathQ.choices.map(c => (
                <button key={c} className="sm-choice" onClick={() => answerMath(c)}
                  style={{ '--btn-color': '#7c3aed' }}>{c}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '12px 8px' }}>
        {/* Maze SVG */}
        <div style={{ overflow: 'auto', maxWidth: '100%' }}>
          <svg width={cfg.W * CELL_SIZE} height={cfg.H * CELL_SIZE}
            style={{ display: 'block', borderRadius: 8, border: '2px solid rgba(255,255,255,0.2)' }}>
            {maze.map((cell, i) => {
              const x = (i % cfg.W) * CELL_SIZE;
              const y = Math.floor(i / cfg.W) * CELL_SIZE;
              const cx = i % cfg.W;
              const cy = Math.floor(i / cfg.W);
              const isGoal = cx === cfg.W - 1 && cy === cfg.H - 1;
              const isPlayer = cx === pos.x && cy === pos.y;
              return (
                <g key={i}>
                  <rect x={x} y={y} width={CELL_SIZE} height={CELL_SIZE}
                    fill={isGoal ? 'rgba(251,191,36,0.2)' : isPlayer ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.04)'} />
                  {cell.walls.top && <line x1={x} y1={y} x2={x+CELL_SIZE} y2={y} stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />}
                  {cell.walls.right && <line x1={x+CELL_SIZE} y1={y} x2={x+CELL_SIZE} y2={y+CELL_SIZE} stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />}
                  {cell.walls.bottom && <line x1={x} y1={y+CELL_SIZE} x2={x+CELL_SIZE} y2={y+CELL_SIZE} stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />}
                  {cell.walls.left && <line x1={x} y1={y} x2={x} y2={y+CELL_SIZE} stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />}
                  {isGoal && <text x={x+CELL_SIZE/2} y={y+CELL_SIZE/2+5} textAnchor="middle" fontSize={CELL_SIZE*0.6}>⭐</text>}
                  {isPlayer && <text x={x+CELL_SIZE/2} y={y+CELL_SIZE/2+5} textAnchor="middle" fontSize={CELL_SIZE*0.65}>🧒</text>}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Arrow controls */}
        <div style={{ display: 'grid', gridTemplateAreas: '". up ." "left . right" ". down ."', gridTemplateColumns: 'repeat(3, 56px)', gap: 6 }}>
          {[
            { area: 'up', label: '↑', dx: 0, dy: -1 },
            { area: 'left', label: '←', dx: -1, dy: 0 },
            { area: 'right', label: '→', dx: 1, dy: 0 },
            { area: 'down', label: '↓', dx: 0, dy: 1 },
          ].map(({ area, label, dx, dy }) => (
            <button key={area} onClick={() => tryMove(dx, dy)}
              style={{
                gridArea: area,
                width: 56, height: 56, fontSize: '1.5rem', fontWeight: 900,
                background: 'rgba(168,85,247,0.3)', border: '2px solid rgba(168,85,247,0.5)',
                borderRadius: 12, color: '#fff', cursor: 'pointer',
              }}>{label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
