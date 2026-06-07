import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

const GRID_SIZE = 8;
const WORDS_PER_ROUND = 5;
const TIMER_MAX = 180;

const WORD_BANKS = {
  animaux:    ['CHAT', 'CHIEN', 'LAPIN', 'OISEAU', 'LION', 'TIGRE', 'OURS', 'LOUP', 'CERF', 'RENARD'],
  ecole:      ['LIVRE', 'STYLO', 'CRAYON', 'CAHIER', 'ECOLE', 'CLASSE', 'ELEVE', 'TABLE', 'CHAISE', 'GOMME'],
  couleurs:   ['ROUGE', 'BLEU', 'VERT', 'NOIR', 'BLANC', 'ROSE', 'JAUNE', 'VIOLET', 'ORANGE', 'GRIS'],
  nourriture: ['POMME', 'PAIN', 'LAIT', 'OEUF', 'SOUPE', 'GATEAU', 'PIZZA', 'SALADE', 'BEURRE', 'FROMAGE'],
};

const THEME_LABELS = {
  animaux: '🐾 Animaux', ecole: '📚 Ecole',
  couleurs: '🎨 Couleurs', nourriture: '🍎 Nourriture',
};

const DIRECTIONS = [
  [0,1],[1,0],[1,1],[-1,1],[0,-1],[-1,0],[-1,-1],[1,-1],
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildGrid(words) {
  const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(''));
  const placed = [];
  for (const word of words) {
    let success = false;
    for (let attempt = 0; attempt < 300 && !success; attempt++) {
      const [dr, dc] = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const r = Math.floor(Math.random() * GRID_SIZE);
      const c = Math.floor(Math.random() * GRID_SIZE);
      const cells = [];
      let ok = true;
      for (let i = 0; i < word.length; i++) {
        const nr = r + dr * i, nc = c + dc * i;
        if (nr < 0 || nr >= GRID_SIZE || nc < 0 || nc >= GRID_SIZE) { ok = false; break; }
        if (grid[nr][nc] !== '' && grid[nr][nc] !== word[i]) { ok = false; break; }
        cells.push([nr, nc]);
      }
      if (ok) {
        cells.forEach(([nr, nc], i) => { grid[nr][nc] = word[i]; });
        placed.push({ word, cells });
        success = true;
      }
    }
  }
  const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < GRID_SIZE; r++)
    for (let c = 0; c < GRID_SIZE; c++)
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

// Convert pointer position to grid cell — works on mouse AND touch
function pointerToCell(e, gridEl) {
  const rect = gridEl.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const r = Math.floor((y / rect.height) * GRID_SIZE);
  const c = Math.floor((x / rect.width) * GRID_SIZE);
  if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return null;
  return [r, c];
}

export default function MotsCachesPage() {
  const [phase, setPhase]               = useState('setup');
  const [theme, setTheme]               = useState('animaux');
  const [grid, setGrid]                 = useState([]);
  const [words, setWords]               = useState([]);
  const [placedWords, setPlacedWords]   = useState([]);
  const [foundWords, setFoundWords]     = useState(new Set());
  const [foundCells, setFoundCells]     = useState(new Map());
  const [selStart, setSelStart]         = useState(null);
  const [selEnd, setSelEnd]             = useState(null);
  const [timeLeft, setTimeLeft]         = useState(TIMER_MAX);
  const [flash, setFlash]               = useState(null);
  const timerRef  = useRef(null);
  const gridRef   = useRef(null);
  // Refs for interaction state — avoids stale closures in event handlers
  const isSelecting  = useRef(false);
  const selStartRef  = useRef(null);
  const selEndRef    = useRef(null);

  useEffect(() => {
    if (phase !== 'play') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setPhase('results'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  function startGame() {
    const bank = shuffle(WORD_BANKS[theme]).slice(0, WORDS_PER_ROUND);
    const { grid: g, placed } = buildGrid(bank);
    setGrid(g); setWords(bank); setPlacedWords(placed);
    setFoundWords(new Set()); setFoundCells(new Map());
    setSelStart(null); setSelEnd(null);
    isSelecting.current = false; selStartRef.current = null; selEndRef.current = null;
    setTimeLeft(TIMER_MAX);
    setPhase('play');
  }

  // ── Grid-level pointer handlers (fix for mobile pointer capture bug) ──────
  const handleGridPointerDown = useCallback((e) => {
    e.preventDefault();
    if (!gridRef.current) return;
    const cell = pointerToCell(e, gridRef.current);
    if (!cell) return;
    isSelecting.current = true;
    selStartRef.current = cell;
    selEndRef.current = cell;
    setSelStart(cell);
    setSelEnd(cell);
  }, []);

  const handleGridPointerMove = useCallback((e) => {
    if (!isSelecting.current || !gridRef.current) return;
    const cell = pointerToCell(e, gridRef.current);
    if (!cell) return;
    const prev = selEndRef.current;
    if (prev && prev[0] === cell[0] && prev[1] === cell[1]) return; // no change
    selEndRef.current = cell;
    setSelEnd(cell);
  }, []);

  const handleGridPointerUp = useCallback((e, currentGrid, currentPlaced, currentFound, currentFoundCells, currentWords) => {
    if (!isSelecting.current) return;
    isSelecting.current = false;

    const start = selStartRef.current;
    const end   = selEndRef.current;
    setSelStart(null); setSelEnd(null);
    selStartRef.current = null; selEndRef.current = null;

    if (!start || !end) return;
    const cells = getCellsBetween(start[0], start[1], end[0], end[1]);
    if (!cells) return;

    const selectedWord    = cells.map(([r, c]) => currentGrid[r][c]).join('');
    const selectedWordRev = selectedWord.split('').reverse().join('');

    const match = currentPlaced.find(pw =>
      !currentFound.has(pw.word) && (pw.word === selectedWord || pw.word === selectedWordRev)
    );

    if (match) {
      const colors = ['#22c55e', '#6366f1', '#f59e0b', '#ec4899', '#06b6d4'];
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
        clearInterval(timerRef.current);
        setTimeout(() => setPhase('results'), 600);
      }
    } else {
      setFlash('bad');
      setTimeout(() => setFlash(null), 400);
    }
  }, []);

  // Compute selected cells for rendering
  const selCells = selStart && selEnd
    ? (getCellsBetween(selStart[0], selStart[1], selEnd[0], selEnd[1]) || [])
    : (selStart ? [selStart] : []);
  const selKeys = new Set(selCells.map(([r, c]) => cellKey(r, c)));

  // ── Setup phase ───────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="mc-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="mc-title">🔍 Mots Cachés</h1>
        <p className="mc-subtitle">Trouve les mots cachés dans la grille !</p>
        <div className="mc-themes">
          {Object.keys(WORD_BANKS).map(k => (
            <button
              key={k}
              className={`mc-theme-btn${theme === k ? ' is-selected' : ''}`}
              onPointerDown={e => { e.preventDefault(); setTheme(k); }}
            >
              {THEME_LABELS[k]}
            </button>
          ))}
        </div>
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
        {/* Single pointer target — no per-cell capture issues */}
        <div
          ref={gridRef}
          className="mc-grid"
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
