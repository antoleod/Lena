import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

const EMOJI_SETS = [
  { name: 'Nourriture', emojis: ['🍕', '🍔', '🌮', '🍜'] },
  { name: 'Animaux', emojis: ['🐱', '🐶', '🐰', '🐸'] },
  { name: 'Sports', emojis: ['⚽', '🏀', '🎾', '🏈'] },
  { name: 'Météo', emojis: ['☀️', '🌧️', '❄️', '🌈'] },
];

const LEVELS = [
  { label: 'Facile', key: 'easy', emoji: '😊', prefilled: 8 },
  { label: 'Moyen', key: 'medium', emoji: '😐', prefilled: 6 },
  { label: 'Difficile', key: 'hard', emoji: '😤', prefilled: 4 },
];

// Valid 4x4 sudoku base solutions (rows × cols, values 1-4)
const BASE_SOLUTIONS = [
  [1,2,3,4, 3,4,1,2, 2,1,4,3, 4,3,2,1],
  [1,2,3,4, 3,4,1,2, 4,3,2,1, 2,1,4,3],
  [2,1,4,3, 4,3,2,1, 1,2,3,4, 3,4,1,2],
  [1,3,2,4, 2,4,1,3, 3,1,4,2, 4,2,3,1],
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generatePuzzle(prefilled) {
  const base = BASE_SOLUTIONS[Math.floor(Math.random() * BASE_SOLUTIONS.length)];
  // Shuffle digit mapping 1-4 → 1-4
  const mapping = shuffle([1, 2, 3, 4]);
  const solution = base.map(v => mapping[v - 1]);

  // Determine which cells to reveal
  const indices = shuffle([...Array(16).keys()]).slice(0, prefilled);
  const revealSet = new Set(indices);
  const cells = solution.map((val, i) => ({
    value: val,
    revealed: revealSet.has(i),
    userValue: revealSet.has(i) ? val : null,
    locked: revealSet.has(i),
  }));
  return { cells, solution };
}

function getConflicts(cells) {
  const conflicts = new Set();
  // Check rows
  for (let r = 0; r < 4; r++) {
    const row = [0,1,2,3].map(c => ({ idx: r*4+c, val: cells[r*4+c].userValue }));
    markDups(row, conflicts);
  }
  // Check cols
  for (let c = 0; c < 4; c++) {
    const col = [0,1,2,3].map(r => ({ idx: r*4+c, val: cells[r*4+c].userValue }));
    markDups(col, conflicts);
  }
  // Check 2x2 boxes
  for (let br = 0; br < 2; br++) {
    for (let bc = 0; bc < 2; bc++) {
      const box = [];
      for (let r = 0; r < 2; r++)
        for (let c = 0; c < 2; c++)
          box.push({ idx: (br*2+r)*4 + (bc*2+c), val: cells[(br*2+r)*4 + (bc*2+c)].userValue });
      markDups(box, conflicts);
    }
  }
  return conflicts;
}

function markDups(group, set) {
  const seen = {};
  for (const { idx, val } of group) {
    if (val === null) continue;
    if (seen[val] !== undefined) { set.add(idx); set.add(seen[val]); }
    else seen[val] = idx;
  }
}

function isSolved(cells, solution) {
  return cells.every((c, i) => c.userValue === solution[i]);
}

function calcStars(timeSecs) {
  if (timeSecs < 60) return 3;
  if (timeSecs < 180) return 2;
  return 1;
}

export default function SudokuImagesPage() {
  const { progress, saveSession, resetTimer, elapsedSecs } = useGameSession('sudoku-images');
  const [phase, setPhase] = useState('setup');
  const [levelIdx, setLevelIdx] = useState(0);
  const [setIdx, setSetIdx] = useState(0);
  const [cells, setCells] = useState([]);
  const [solution, setSolution] = useState([]);
  const [selected, setSelected] = useState(null); // cell index
  const [solved, setSolved] = useState(false);
  const [result, setResult] = useState(null);

  const startGame = useCallback((lIdx, sIdx) => {
    const cfg = LEVELS[lIdx];
    const { cells: c, solution: s } = generatePuzzle(cfg.prefilled);
    setCells(c);
    setSolution(s);
    setLevelIdx(lIdx);
    setSetIdx(sIdx);
    setSelected(null);
    setSolved(false);
    resetTimer();
    setPhase('play');
  }, [resetTimer]);

  const handleCellClick = useCallback((idx) => {
    if (cells[idx].locked) return;
    setSelected(idx);
  }, [cells]);

  const handleEmojiPick = useCallback((emojiIdx) => {
    if (selected === null) return;
    const val = emojiIdx + 1; // 1-4
    setCells(prev => {
      const next = prev.map((c, i) => i === selected ? { ...c, userValue: val } : c);
      if (isSolved(next, solution)) {
        const timeSecs = elapsedSecs();
        const stars = calcStars(timeSecs);
        const res = saveSession({ score: timeSecs, level: levelIdx + 1, stars });
        setResult({ stars, timeSecs, ...res });
        setSolved(true);
        setTimeout(() => setPhase('results'), 800);
      }
      return next;
    });
    setSelected(null);
  }, [selected, solution, elapsedSecs, saveSession, levelIdx]);

  const clearCell = useCallback(() => {
    if (selected === null) return;
    if (cells[selected].locked) return;
    setCells(prev => prev.map((c, i) => i === selected ? { ...c, userValue: null } : c));
  }, [selected, cells]);

  const best = progress?.bestScore ?? 0;
  const emojiSet = EMOJI_SETS[setIdx];
  const conflicts = getConflicts(cells);

  if (phase === 'setup') {
    return (
      <div className="sm-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="sm-setup">
          <div className="sm-setup__hero">
            <div className="sm-setup__emoji">🧩</div>
            <h1 className="sm-setup__title">Sudoku Images</h1>
            <p className="sm-setup__sub">Chaque emoji une seule fois par ligne, colonne et carré !</p>
            {best > 0 && <p className="sm-setup__sub">Meilleur temps : {best}s</p>}
          </div>
          <div className="sm-level-section">
            <p className="sm-level-title">Choisir un niveau</p>
            <div className="jeux-level-grid">
              {LEVELS.map((lv, i) => (
                <button key={lv.key} className="jeux-level-btn" onClick={() => startGame(i, Math.floor(Math.random() * EMOJI_SETS.length))}>
                  <span>{lv.emoji}</span>
                  <span>{lv.label}</span>
                </button>
              ))}
            </div>
            <p className="sm-level-title" style={{marginTop:16}}>Thème</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {EMOJI_SETS.map((es, i) => (
                <button key={i} className="jeux-level-btn" style={{ minWidth: 80 }}
                  onClick={() => startGame(levelIdx, i)}>
                  {es.emojis.join(' ')}<br/><span style={{fontSize:'0.75rem'}}>{es.name}</span>
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
          <div className="game-results__emoji">🧩</div>
          <h2 className="game-results__title">Résolu !</h2>
          <div className="game-results__stars">{'⭐'.repeat(result.stars)}{'☆'.repeat(3 - result.stars)}</div>
          <div className="game-results__stats">
            <div className="game-results__stat"><span>Temps</span><strong>{result.timeSecs}s</strong></div>
            {result.isNewBest && <div className="jeux-new-best">Nouveau record !</div>}
          </div>
          <button className="game-results__btn" onClick={() => startGame(levelIdx, setIdx)}>Rejouer</button>
          <button className="game-results__btn" style={{marginTop:8}} onClick={() => setPhase('setup')}>Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="sm-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="game-hud">
        <span className="game-hud__score">{emojiSet.name}</span>
        <span className="game-hud__round">{LEVELS[levelIdx].label}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 16px', gap: 20 }}>
        {/* 4x4 grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 3, width: '100%', maxWidth: 320,
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: 12, overflow: 'hidden',
        }}>
          {cells.map((cell, i) => {
            const row = Math.floor(i / 4);
            const col = i % 4;
            const isSelected = selected === i;
            const hasConflict = conflicts.has(i) && cell.userValue !== null;
            const isLocked = cell.locked;
            return (
              <button key={i} onClick={() => handleCellClick(i)}
                style={{
                  aspectRatio: '1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.8rem',
                  background: isSelected ? 'rgba(168,85,247,0.4)'
                    : hasConflict ? 'rgba(239,68,68,0.25)'
                    : isLocked ? 'rgba(255,255,255,0.12)'
                    : 'rgba(255,255,255,0.06)',
                  border: 'none',
                  borderRight: (col === 1) ? '2px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
                  borderBottom: (row === 1) ? '2px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
                  cursor: isLocked ? 'default' : 'pointer',
                  transition: 'background 0.15s',
                  opacity: isLocked ? 1 : cell.userValue ? 1 : 0.4,
                }}>
                {cell.userValue ? emojiSet.emojis[cell.userValue - 1] : ''}
              </button>
            );
          })}
        </div>

        {/* Emoji picker */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {emojiSet.emojis.map((e, i) => (
            <button key={i} onClick={() => handleEmojiPick(i)}
              style={{
                width: 56, height: 56, fontSize: '2rem',
                background: 'rgba(255,255,255,0.1)',
                border: '2px solid rgba(255,255,255,0.2)',
                borderRadius: 12, cursor: 'pointer',
                transition: 'transform 0.1s',
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
              onMouseUp={e => e.currentTarget.style.transform = ''}
            >
              {e}
            </button>
          ))}
          <button onClick={clearCell}
            style={{
              width: 56, height: 56, fontSize: '1.3rem',
              background: 'rgba(239,68,68,0.2)',
              border: '2px solid rgba(239,68,68,0.4)',
              borderRadius: 12, cursor: 'pointer', color: '#fca5a5',
            }}>✕</button>
        </div>
        <p style={{ fontSize: '0.8rem', opacity: 0.5, textAlign: 'center' }}>
          Appuie sur une case, puis sur un emoji pour le placer.
        </p>
      </div>
    </div>
  );
}
