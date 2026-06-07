import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import { formatDuration } from '../../services/storage/gameProgressStore.js';
import './jeux.css';

const WORD_BANKS = {
  animaux:        ['CHAT', 'CHIEN', 'LAPIN', 'OISEAU', 'LION', 'TIGRE', 'OURS', 'LOUP', 'CERF', 'RENARD'],
  ecole:          ['LIVRE', 'STYLO', 'CRAYON', 'CAHIER', 'ECOLE', 'CLASSE', 'ELEVE', 'TABLE', 'CHAISE', 'GOMME'],
  couleurs:       ['ROUGE', 'BLEU', 'VERT', 'NOIR', 'BLANC', 'ROSE', 'JAUNE', 'VIOLET', 'ORANGE', 'GRIS'],
  nourriture:     ['POMME', 'PAIN', 'LAIT', 'OEUF', 'SOUPE', 'GATEAU', 'PIZZA', 'SALADE', 'BEURRE', 'FROMAGE'],
  corps:          ['MAIN', 'PIED', 'TETE', 'BRAS', 'DOS', 'NEZ', 'OREILLE', 'BOUCHE', 'GENOU', 'EPAULE'],
  'animaux-savane': ['LION', 'TIGRE', 'ZEBRE', 'GIRAFE', 'ELEPHANT', 'GUEPARD', 'HYENE', 'GORILLE', 'GAZELLE', 'RHINOCEROS'],
};

const THEME_LABELS = {
  animaux: '🐾 Animaux',
  ecole: '📚 Ecole',
  couleurs: '🎨 Couleurs',
  nourriture: '🍎 Nourriture',
  corps: '🫀 Corps',
  'animaux-savane': '🦁 Savane',
};

// Per-level config: wordCount, gridSize, timerSecs, allowDiagonal, allowReverse
const LEVEL_CONFIG = [
  { wordCount: 4, gridSize: 6,  timerSecs: 180, allowDiagonal: false, allowReverse: false },
  { wordCount: 5, gridSize: 8,  timerSecs: 150, allowDiagonal: false, allowReverse: false },
  { wordCount: 6, gridSize: 8,  timerSecs: 120, allowDiagonal: true,  allowReverse: true  },
  { wordCount: 7, gridSize: 10, timerSecs: 90,  allowDiagonal: true,  allowReverse: true  },
  { wordCount: 8, gridSize: 10, timerSecs: 60,  allowDiagonal: true,  allowReverse: true  },
];

// Level 5 extra themes
const HARD_THEMES = ['corps', 'animaux-savane'];

const DIRECTIONS_STRAIGHT = [[0,1],[1,0],[0,-1],[-1,0]];
const DIRECTIONS_ALL = [[0,1],[1,0],[1,1],[-1,1],[0,-1],[-1,0],[-1,-1],[1,-1]];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildGrid(words, gridSize, allowDiagonal, allowReverse) {
  const dirs = allowDiagonal ? DIRECTIONS_ALL : DIRECTIONS_STRAIGHT;
  const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
  const placed = [];

  for (const word of words) {
    let wordToPlace = word;
    if (allowReverse && Math.random() < 0.4) {
      wordToPlace = word.split('').reverse().join('');
    }
    let success = false;
    for (let attempt = 0; attempt < 300 && !success; attempt++) {
      const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)];
      const r = Math.floor(Math.random() * gridSize);
      const c = Math.floor(Math.random() * gridSize);
      const cells = [];
      let ok = true;
      for (let i = 0; i < wordToPlace.length; i++) {
        const nr = r + dr * i, nc = c + dc * i;
        if (nr < 0 || nr >= gridSize || nc < 0 || nc >= gridSize) { ok = false; break; }
        if (grid[nr][nc] !== '' && grid[nr][nc] !== wordToPlace[i]) { ok = false; break; }
        cells.push([nr, nc]);
      }
      if (ok) {
        cells.forEach(([nr, nc], i) => { grid[nr][nc] = wordToPlace[i]; });
        // Always record cells matching the canonical (un-reversed) word
        placed.push({ word, cells: wordToPlace !== word ? [...cells].reverse() : cells });
        success = true;
      }
    }
  }

  const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < gridSize; r++)
    for (let c = 0; c < gridSize; c++)
      if (grid[r][c] === '') grid[r][c] = ALPHA[Math.floor(Math.random() * ALPHA.length)];

  return { grid, placed };
}

function cellKey(r, c) { return `${r},${c}`; }

function getCellsBetween(r1, c1, r2, c2) {
  const dr = r2 - r1, dc = c2 - c1;
  const len = Math.max(Math.abs(dr), Math.abs(dc));
  if (len === 0) return [[r1, c1]];
  const sr = Math.sign(dr), sc = Math.sign(dc);
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;
  const cells = [];
  for (let i = 0; i <= len; i++) cells.push([r1 + sr * i, c1 + sc * i]);
  return cells;
}

function calcStars(found, total) {
  const ratio = found / total;
  if (ratio === 1) return 3;
  if (ratio >= 0.6) return 2;
  return 1;
}

function pointerToCell(e, gridEl, gridSize) {
  const rect = gridEl.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const r = Math.floor((y / rect.height) * gridSize);
  const c = Math.floor((x / rect.width) * gridSize);
  if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return null;
  return [r, c];
}

export default function MotsCachesPage() {
  const { progress, saveSession, resetTimer, elapsedSecs } = useGameSession('mots-caches');

  const [phase, setPhase]             = useState('setup');
  const [theme, setTheme]             = useState('animaux');
  const [selectedLevel, setSelectedLevel] = useState(Math.min(progress.unlockedLevel, 5));
  const [grid, setGrid]               = useState([]);
  const [words, setWords]             = useState([]);
  const [placedWords, setPlacedWords] = useState([]);
  const [foundWords, setFoundWords]   = useState(new Set());
  const [foundCells, setFoundCells]   = useState(new Map());
  const [selStart, setSelStart]       = useState(null);
  const [selEnd, setSelEnd]           = useState(null);
  const [timeLeft, setTimeLeft]       = useState(180);
  const [flash, setFlash]             = useState(null);
  const [sessionResult, setSessionResult] = useState(null);
  const [activeGridSize, setActiveGridSize] = useState(8);

  const timerRef     = useRef(null);
  const gridRef      = useRef(null);
  const isSelecting  = useRef(false);
  const selStartRef  = useRef(null);
  const selEndRef    = useRef(null);

  // Timer effect — depends on timeLeft hitting 0
  const runTimer = useCallback((duration) => {
    clearInterval(timerRef.current);
    setTimeLeft(duration);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setPhase('results'); return 0; }
        return t - 1;
      });
    }, 1000);
  }, []);

  function startGame() {
    const cfg = LEVEL_CONFIG[selectedLevel - 1];
    const pool = selectedLevel === 5
      ? WORD_BANKS[HARD_THEMES[Math.floor(Math.random() * HARD_THEMES.length)]]
      : WORD_BANKS[theme];
    const bank = shuffle(pool).slice(0, cfg.wordCount);
    const { grid: g, placed } = buildGrid(bank, cfg.gridSize, cfg.allowDiagonal, cfg.allowReverse);

    setGrid(g);
    setWords(bank);
    setPlacedWords(placed);
    setActiveGridSize(cfg.gridSize);
    setFoundWords(new Set());
    setFoundCells(new Map());
    setSelStart(null);
    setSelEnd(null);
    isSelecting.current = false;
    selStartRef.current = null;
    selEndRef.current = null;
    setSessionResult(null);
    resetTimer();
    setPhase('play');
    runTimer(cfg.timerSecs);
  }

  // End game — called when all words found or timer ends
  function endGame(finalFound, finalWords) {
    clearInterval(timerRef.current);
    const stars = calcStars(finalFound.size, finalWords.length);
    const secs = elapsedSecs();
    const result = saveSession({ score: finalFound.size * 10 * selectedLevel, level: selectedLevel, stars });
    setSessionResult({ ...result, timeSecs: secs, stars });
    setPhase('results');
  }

  const handleGridPointerDown = useCallback((e) => {
    e.preventDefault();
    if (!gridRef.current) return;
    const cell = pointerToCell(e, gridRef.current, activeGridSize);
    if (!cell) return;
    isSelecting.current = true;
    selStartRef.current = cell;
    selEndRef.current = cell;
    setSelStart(cell);
    setSelEnd(cell);
  }, [activeGridSize]);

  const handleGridPointerMove = useCallback((e) => {
    if (!isSelecting.current || !gridRef.current) return;
    const cell = pointerToCell(e, gridRef.current, activeGridSize);
    if (!cell) return;
    const prev = selEndRef.current;
    if (prev && prev[0] === cell[0] && prev[1] === cell[1]) return;
    selEndRef.current = cell;
    setSelEnd(cell);
  }, [activeGridSize]);

  const handleGridPointerUp = useCallback((e, currentGrid, currentPlaced, currentFound, currentFoundCells, currentWords) => {
    if (!isSelecting.current) return;
    isSelecting.current = false;

    const start = selStartRef.current;
    const end   = selEndRef.current;
    setSelStart(null);
    setSelEnd(null);
    selStartRef.current = null;
    selEndRef.current = null;

    if (!start || !end) return;
    const cells = getCellsBetween(start[0], start[1], end[0], end[1]);
    if (!cells) return;

    const selectedWord    = cells.map(([r, c]) => currentGrid[r][c]).join('');
    const selectedWordRev = selectedWord.split('').reverse().join('');

    const match = currentPlaced.find(pw =>
      !currentFound.has(pw.word) && (pw.word === selectedWord || pw.word === selectedWordRev)
    );

    if (match) {
      const colors = ['#22c55e', '#6366f1', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#f97316', '#0ea5e9'];
      const color = colors[currentFound.size % colors.length];
      const newFoundCells = new Map(currentFoundCells);
      match.cells.forEach(([r, c]) => newFoundCells.set(cellKey(r, c), color));
      setFoundCells(newFoundCells);
      const newFound = new Set(currentFound);
      newFound.add(match.word);
      setFoundWords(newFound);
      setFlash('ok');
      setTimeout(() => setFlash(null), 400);
      if (newFound.size === currentWords.length) {
        endGame(newFound, currentWords);
      }
    } else {
      setFlash('bad');
      setTimeout(() => setFlash(null), 400);
    }
  }, [selectedLevel]); // eslint-disable-line react-hooks/exhaustive-deps

  const selCells = selStart && selEnd
    ? (getCellsBetween(selStart[0], selStart[1], selEnd[0], selEnd[1]) || [])
    : (selStart ? [selStart] : []);
  const selKeys = new Set(selCells.map(([r, c]) => cellKey(r, c)));

  // ── Setup phase ───────────────────────────────────────────────────────────
  if (phase === 'setup') {
    const themes = selectedLevel === 5 ? HARD_THEMES : Object.keys(WORD_BANKS).filter(k => !HARD_THEMES.includes(k));
    return (
      <div className="mc-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="mc-title">🔍 Mots Cachés</h1>
        <p className="mc-subtitle">Trouve les mots cachés dans la grille !</p>

        {/* Progress stats */}
        <div className="jeux-setup-stats">
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{progress.bestScore || 0}</span>
            <span className="jeux-setup-stat__lbl">Meilleur score</span>
          </div>
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{progress.sessionsPlayed || 0}</span>
            <span className="jeux-setup-stat__lbl">Parties jouées</span>
          </div>
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{formatDuration(progress.totalTimeSecs || 0)}</span>
            <span className="jeux-setup-stat__lbl">Temps total</span>
          </div>
        </div>

        {/* Level selector */}
        <div className="jeux-level-grid">
          {LEVEL_CONFIG.map((_, i) => {
            const lvl = i + 1;
            const locked = lvl > progress.unlockedLevel;
            return (
              <button
                key={lvl}
                className={`jeux-level-btn${selectedLevel === lvl ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`}
                onPointerDown={e => { e.preventDefault(); if (!locked) setSelectedLevel(lvl); }}
              >
                {locked ? '🔒' : `Niveau ${lvl}`}
                {!locked && progress.bestLevel >= lvl && <span className="jeux-level-stars">★</span>}
              </button>
            );
          })}
        </div>

        {/* Theme selector (not shown at level 5 — theme auto-picked) */}
        {selectedLevel < 5 && (
          <div className="mc-themes">
            {themes.map(k => (
              <button
                key={k}
                className={`mc-theme-btn${theme === k ? ' is-selected' : ''}`}
                onPointerDown={e => { e.preventDefault(); setTheme(k); }}
              >
                {THEME_LABELS[k]}
              </button>
            ))}
          </div>
        )}
        {selectedLevel === 5 && (
          <p style={{ textAlign: 'center', opacity: .7, fontSize: '.85rem', color: '#fff', marginBottom: 12 }}>
            Thème difficile choisi aléatoirement
          </p>
        )}

        <button className="mc-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>
          ▶ Jouer
        </button>
      </div>
    );
  }

  // ── Results phase ─────────────────────────────────────────────────────────
  if (phase === 'results') {
    const stars = calcStars(foundWords.size, words.length);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    return (
      <div className="mc-page">
        <h2 className="mc-result-title">
          {stars === 3 ? '🎉 Bravo !' : stars === 2 ? '👍 Bien joué !' : '📚 Continue !'}
        </h2>
        <div className="jeux-stars">{starStr}</div>
        {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
        {sessionResult?.newUnlocked && <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} débloqué !</div>}
        {sessionResult && <div className="jeux-session-time">⏱ {sessionResult.timeSecs}s</div>}
        <div className="jeux-result-stat"><span>Mots trouvés</span><span>{foundWords.size} / {words.length}</span></div>
        <div className="jeux-result-stat"><span>Temps restant</span><span>{timeLeft}s</span></div>
        <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
          <button className="mc-cta" style={{ flex: 1 }} onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <button className="mc-cta mc-cta--soft" style={{ flex: 1 }} onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}>Thèmes</button>
        </div>
        <div style={{ marginTop: 12 }}>
          <Link to="/jeux" className="mc-cta mc-cta--soft" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>← Jeux</Link>
        </div>
      </div>
    );
  }

  // ── Play phase ────────────────────────────────────────────────────────────
  const minutes  = Math.floor(timeLeft / 60);
  const seconds  = timeLeft % 60;
  const timerStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const urgent   = timeLeft <= 30;

  return (
    <div className="mc-page" style={{ touchAction: 'none', userSelect: 'none' }}>
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="mc-hud">
        <span className={`mc-timer${urgent ? ' mc-timer--urgent' : ''}`}>⏱ {timerStr}</span>
        <span className="mc-progress">{foundWords.size} / {words.length} mots</span>
      </div>

      <div className={`mc-grid-wrap${flash === 'ok' ? ' flash-ok' : flash === 'bad' ? ' flash-bad' : ''}`}>
        <div
          ref={gridRef}
          className="mc-grid"
          style={{ gridTemplateColumns: `repeat(${activeGridSize}, 1fr)` }}
          onPointerDown={handleGridPointerDown}
          onPointerMove={handleGridPointerMove}
          onPointerUp={(e) => handleGridPointerUp(e, grid, placedWords, foundWords, foundCells, words)}
          onPointerLeave={(e) => { if (isSelecting.current) handleGridPointerUp(e, grid, placedWords, foundWords, foundCells, words); }}
        >
          {grid.map((row, r) =>
            row.map((letter, c) => {
              const key = cellKey(r, c);
              const foundColor = foundCells.get(key);
              const inSel = selKeys.has(key);
              return (
                <div
                  key={key}
                  className={`mc-cell${inSel ? ' mc-cell--sel' : ''}`}
                  style={foundColor ? { background: foundColor, color: '#fff', boxShadow: `0 0 8px ${foundColor}88` } : undefined}
                >
                  {letter}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mc-word-list">
        {words.map(w => (
          <span key={w} className={`mc-word${foundWords.has(w) ? ' mc-word--found' : ''}`}>{w}</span>
        ))}
      </div>
    </div>
  );
}
