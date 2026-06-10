import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { playCorrectSound, playWrongSound, playRewardSound, playTapSound } from '../../services/sound/soundService.js';
import { saveGameSession, getGameProgress } from '../../services/storage/gameProgressStore.js';
import './jeux.css';

// ─── Constants ────────────────────────────────────────────────────────────────
const COLS = 10;
const ROWS = 20;

const DIFFICULTY_CFG = {
  facile: { label: 'Facile', emoji: '🐢', base: 1200, step: 40,  color: '#22c55e', desc: 'Vitesse lente, idéal pour débutants' },
  normal: { label: 'Normal', emoji: '🎮', base: 800,  step: 70,  color: '#6366f1', desc: 'Vitesse classique du Tetris' },
  defi:   { label: 'Défi',   emoji: '🔥', base: 600,  step: 100, color: '#ef4444', desc: 'Vitesse progressive — pour champions !' },
};

const PIECES = {
  I: { shape: [[1,1,1,1]],         color: '#06b6d4' },
  O: { shape: [[1,1],[1,1]],       color: '#eab308' },
  T: { shape: [[0,1,0],[1,1,1]],   color: '#a855f7' },
  S: { shape: [[0,1,1],[1,1,0]],   color: '#22c55e' },
  Z: { shape: [[1,1,0],[0,1,1]],   color: '#ef4444' },
  L: { shape: [[1,0],[1,0],[1,1]], color: '#f97316' },
  J: { shape: [[0,1],[0,1],[1,1]], color: '#3b82f6' },
};
const PIECE_KEYS = Object.keys(PIECES);

const LINE_POINTS = [0, 100, 300, 500, 800];

const MSGS = {
  1: ['Bien !', 'Cool !', 'Super !', 'Bonne ligne !'],
  2: ['Bravo !', 'Double ligne !', 'Excellent !', 'Super réflexe !'],
  3: ['Incroyable !', 'Triple ligne !', 'Fantastique !'],
  4: ['TETRIS !', '4 lignes ! 🏆', 'Légendaire !', 'PARFAIT !'],
};

// ─── Pure helpers ─────────────────────────────────────────────────────────────
function emptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(''));
}

function randomPiece() {
  const key = PIECE_KEYS[Math.floor(Math.random() * PIECE_KEYS.length)];
  const { shape, color } = PIECES[key];
  return { key, shape: shape.map(r => [...r]), color, x: Math.floor((COLS - shape[0].length) / 2), y: 0 };
}

function rotateCW(shape) {
  const rows = shape.length, cols = shape[0].length;
  const out = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      out[c][rows - 1 - r] = shape[r][c];
  return out;
}

function isValid(board, shape, x, y) {
  for (let r = 0; r < shape.length; r++)
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const nx = x + c, ny = y + r;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
      if (ny >= 0 && board[ny][nx]) return false;
    }
  return true;
}

function placePiece(board, piece) {
  const nb = board.map(r => [...r]);
  piece.shape.forEach((row, r) =>
    row.forEach((v, c) => {
      if (v) {
        const ny = piece.y + r, nx = piece.x + c;
        if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) nb[ny][nx] = piece.color;
      }
    })
  );
  return nb;
}

function clearLines(board) {
  const kept = board.filter(row => row.some(cell => !cell));
  const cleared = ROWS - kept.length;
  return { board: [...Array.from({ length: cleared }, () => Array(COLS).fill('')), ...kept], cleared };
}

function ghostY(board, piece) {
  let y = piece.y;
  while (isValid(board, piece.shape, piece.x, y + 1)) y++;
  return y;
}

function starsForScore(score) {
  if (score >= 2000) return 3;
  if (score >= 500)  return 2;
  if (score >= 100)  return 1;
  return 0;
}

function medalForScore(score) {
  if (score >= 5000) return { label: 'Or',     emoji: '🥇', color: '#f59e0b' };
  if (score >= 2000) return { label: 'Argent', emoji: '🥈', color: '#94a3b8' };
  if (score >= 500)  return { label: 'Bronze', emoji: '🥉', color: '#b45309' };
  return null;
}

function pickMsg(cleared, combo) {
  if (combo >= 3) return `🔥 COMBO x${combo} !`;
  const pool = MSGS[Math.min(cleared, 4)];
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── Math question generator ─────────────────────────────────────────────────
function generateMath() {
  const type = Math.floor(Math.random() * 3);
  let a, b, answer, expr;
  if (type === 0) {
    a = Math.floor(Math.random() * 12) + 1;
    b = Math.floor(Math.random() * 12) + 1;
    answer = a + b; expr = `${a} + ${b}`;
  } else if (type === 1) {
    a = Math.floor(Math.random() * 15) + 5;
    b = Math.floor(Math.random() * (a - 1)) + 1;
    answer = a - b; expr = `${a} − ${b}`;
  } else {
    a = Math.floor(Math.random() * 5) + 2;
    b = Math.floor(Math.random() * 5) + 2;
    answer = a * b; expr = `${a} × ${b}`;
  }
  const choices = new Set([answer]);
  let tries = 0;
  while (choices.size < 3 && tries < 50) {
    const d = Math.floor(Math.random() * 8) - 4;
    const w = answer + (d === 0 ? 1 : d);
    if (w > 0) choices.add(w);
    tries++;
  }
  return { expr, answer, choices: [...choices].sort(() => Math.random() - 0.5) };
}

// ─── Small reusable components ────────────────────────────────────────────────
function PreviewGrid({ pieceKey, size = 20 }) {
  if (!pieceKey) return <div style={{ width: size * 4, height: size * 4 }} />;
  const { shape, color } = PIECES[pieceKey];
  const maxCols = Math.max(...shape.map(r => r.length));
  return (
    <div className="tet-preview-grid">
      {shape.map((row, r) => (
        <div key={r} className="tet-preview-row">
          {Array.from({ length: maxCols }, (_, c) => (
            <div
              key={c}
              className="tet-preview-cell"
              style={{
                width: size, height: size,
                background: row[c] ? color : 'rgba(255,255,255,.05)',
                boxShadow: row[c] ? `inset 0 2px 4px rgba(255,255,255,.35), inset 0 -2px 4px rgba(0,0,0,.3)` : 'none',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function PauseOverlay({ onResume, onQuit }) {
  return (
    <div className="tet-overlay">
      <div className="tet-overlay__card">
        <div style={{ fontSize: '3rem', marginBottom: 8 }}>⏸</div>
        <div className="tet-overlay__title">Pause</div>
        <button className="tet-overlay__btn" onClick={onResume}>▶ Reprendre</button>
        <button className="tet-overlay__btn tet-overlay__btn--soft" onClick={onQuit}>Quitter</button>
      </div>
    </div>
  );
}

function MathOverlay({ question, feedback, onAnswer }) {
  const { expr, answer, choices } = question;
  return (
    <div className="tet-overlay tet-overlay--math">
      <div className="tet-overlay__card">
        <div style={{ fontSize: '1.1rem', opacity: .7, marginBottom: 6, fontWeight: 700 }}>Ligne effacée ! Calcule vite :</div>
        <div className="tet-math__expr">{expr} = ?</div>
        <div className="tet-math__choices">
          {choices.map(c => (
            <button
              key={c}
              className={`tet-math__btn${
                feedback === 'ok'    && c === answer ? ' tet-math__btn--correct' :
                feedback === 'wrong' && c === answer ? ' tet-math__btn--reveal'  :
                feedback === 'wrong'                 ? ' tet-math__btn--disabled': ''
              }`}
              onClick={() => onAnswer(c)}
              disabled={!!feedback}
            >
              {c}
            </button>
          ))}
        </div>
        {feedback === 'ok'    && <div className="tet-math__msg tet-math__msg--ok">✓ +50 pts ! Bravo !</div>}
        {feedback === 'wrong' && <div className="tet-math__msg tet-math__msg--bad">Réponse : {answer}</div>}
      </div>
    </div>
  );
}

// ─── Cell-size computation ────────────────────────────────────────────────────
// Derives the optimal cell px size so the board + all UI fits in one screen.
// Accounts for AppShell sidebar (desktop) and bottom-nav (mobile).
function computeCellSize() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isMobile = vw < 768;
  const isDesktop = vw >= 1200;

  // ── Vertical overhead (px) ─────────────────────────────────────────────
  // AppShell contributions:
  //   mobile: 12px top padding from app-main + 64px bottom-nav + ~34px safe-area
  //   desktop/tablet: 0 (sidebar is horizontal, no top/bottom offset)
  const shellV = isMobile ? (12 + 64 + 34) : 0;
  // Game-UI contributions (topbar, gaps, hint, page-padding, controls):
  //   topbar 40 + flex gaps 24 + hint 16 + page v-pad 16 + ctrl rows 100 = 196
  const gameV = 196;
  const totalV = shellV + gameV;

  // ── Horizontal overhead (px) ───────────────────────────────────────────
  // AppShell: sidebar 220px (tablet) or 240px (desktop); mobile: 24px (12+12 pad)
  const shellH = isMobile ? 24 : (isDesktop ? 240 : 220);
  // Game-UI: 2 panels × 70px + 2 × 8px gaps = 156px; page h-pad 12px = 168
  const gameH = 168;
  const totalH = shellH + gameH;

  const availH = vh - totalV;
  const availW = vw - totalH;

  // board height = ROWS*cell + (ROWS-1)*1gap; width = COLS*cell + (COLS-1)*1gap
  const cellFromH = Math.floor((availH - (ROWS - 1)) / ROWS);
  const cellFromW = Math.floor((availW - (COLS - 1)) / COLS);

  return Math.max(16, Math.min(36, cellFromH, cellFromW));
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function TetrisPage() {
  // ── Phase & settings ──
  const [phase, setPhase]         = useState('setup'); // setup|play|paused|math|results
  const [difficulty, setDifficulty] = useState('normal');
  const [mathMode, setMathMode]   = useState(false);
  const [soundOn, setSoundOn]     = useState(true);
  const [cellSize, setCellSize]   = useState(24);

  // ── Display state ──
  const [score, setScore]         = useState(0);
  const [lines, setLines]         = useState(0);
  const [level, setLevel]         = useState(1);
  const [combo, setCombo]         = useState(0);
  const [message, setMessage]     = useState(null);
  const [mathQ, setMathQ]         = useState(null);
  const [mathFeedback, setMathFeedback] = useState(null);
  const [bestScore, setBestScore] = useState(0);
  const [tick, setTick]           = useState(0);

  // ── Game refs (never stale in intervals) ──
  const boardRef      = useRef(emptyBoard());
  const currentRef    = useRef(null);
  const nextRef       = useRef(null);
  const holdRef       = useRef(null);
  const canHoldRef    = useRef(true);
  const gameOverRef   = useRef(false);
  const scoreRef      = useRef(0);
  const linesRef      = useRef(0);
  const levelRef      = useRef(1);
  const comboRef      = useRef(0);
  const intervalRef   = useRef(null);
  const startTimeRef  = useRef(null);
  const diffRef       = useRef(difficulty);
  const mathModeRef   = useRef(mathMode);
  const soundOnRef    = useRef(soundOn);
  const stepDownRef   = useRef(null);
  const msgTimerRef   = useRef(null);

  // ── Dynamic cell size ──
  useEffect(() => {
    const update = () => setCellSize(computeCellSize());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Keep refs in sync
  useEffect(() => { diffRef.current = difficulty; }, [difficulty]);
  useEffect(() => { mathModeRef.current = mathMode; }, [mathMode]);
  useEffect(() => { soundOnRef.current = soundOn; }, [soundOn]);

  // Load best score
  useEffect(() => {
    const prog = getGameProgress('tetris');
    setBestScore(prog.bestScore || 0);
  }, []);

  const repaint = useCallback(() => setTick(t => t + 1), []);

  const sound = useCallback((fn) => { if (soundOnRef.current) fn(); }, []);

  const showMsg = useCallback((msg) => {
    setMessage(msg);
    clearTimeout(msgTimerRef.current);
    msgTimerRef.current = setTimeout(() => setMessage(null), 1600);
  }, []);

  const getSpeed = useCallback((lvl) => {
    const cfg = DIFFICULTY_CFG[diffRef.current] || DIFFICULTY_CFG.normal;
    return Math.max(80, cfg.base - (lvl - 1) * cfg.step);
  }, []);

  const restartInterval = useCallback((lvl) => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => stepDownRef.current?.(), getSpeed(lvl));
  }, [getSpeed]);

  // ── spawnPiece ──
  const spawnPiece = useCallback(() => {
    const piece = nextRef.current || randomPiece();
    nextRef.current = randomPiece();
    canHoldRef.current = true;
    if (!isValid(boardRef.current, piece.shape, piece.x, piece.y)) {
      gameOverRef.current = true;
      clearInterval(intervalRef.current);
      const timeSecs = Math.round((Date.now() - (startTimeRef.current || Date.now())) / 1000);
      const stars = starsForScore(scoreRef.current);
      saveGameSession('tetris', { score: scoreRef.current, level: levelRef.current, stars, timeSecs });
      setBestScore(prev => Math.max(prev, scoreRef.current));
      sound(playWrongSound);
      setPhase('results');
      setScore(scoreRef.current);
      return false;
    }
    currentRef.current = piece;
    return true;
  }, [sound]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── lockAndAdvance ──
  const lockAndAdvance = useCallback(() => {
    const piece = currentRef.current;
    if (!piece) return;
    const newBoard = placePiece(boardRef.current, piece);
    const { board: cleared, cleared: count } = clearLines(newBoard);
    boardRef.current = cleared;
    currentRef.current = null;

    if (count > 0) {
      const prevCombo = comboRef.current;
      comboRef.current = prevCombo + 1;
      const comboMult  = 1 + Math.max(0, comboRef.current - 1) * 0.5;
      const pts = Math.round(LINE_POINTS[Math.min(count, 4)] * levelRef.current * comboMult);
      scoreRef.current += pts;
      linesRef.current += count;
      levelRef.current  = Math.floor(linesRef.current / 10) + 1;
      setScore(scoreRef.current);
      setLines(linesRef.current);
      setLevel(levelRef.current);
      setCombo(comboRef.current);
      showMsg(pickMsg(count, comboRef.current));
      if (count >= 2) sound(playRewardSound);
      else sound(playCorrectSound);

      if (mathModeRef.current) {
        clearInterval(intervalRef.current);
        setMathQ(generateMath());
        setPhase('math');
        repaint();
        return;
      }
      restartInterval(levelRef.current);
    } else {
      comboRef.current = 0;
      setCombo(0);
    }

    spawnPiece();
    repaint();
  }, [spawnPiece, repaint, showMsg, sound, restartInterval]);

  // ── stepDown ──
  const stepDown = useCallback(() => {
    const piece = currentRef.current;
    if (!piece) return;
    if (isValid(boardRef.current, piece.shape, piece.x, piece.y + 1)) {
      currentRef.current = { ...piece, y: piece.y + 1 };
    } else {
      lockAndAdvance();
    }
    repaint();
  }, [lockAndAdvance, repaint]);

  useEffect(() => { stepDownRef.current = stepDown; }, [stepDown]);

  // ── move / rotate / hardDrop / hold ──
  const move = useCallback((dx) => {
    const piece = currentRef.current;
    if (!piece) return;
    if (isValid(boardRef.current, piece.shape, piece.x + dx, piece.y)) {
      currentRef.current = { ...piece, x: piece.x + dx };
      sound(playTapSound);
      repaint();
    }
  }, [repaint, sound]);

  const rotate = useCallback(() => {
    const piece = currentRef.current;
    if (!piece) return;
    const rotated = rotateCW(piece.shape);
    for (const kick of [0, -1, 1, -2, 2]) {
      if (isValid(boardRef.current, rotated, piece.x + kick, piece.y)) {
        currentRef.current = { ...piece, shape: rotated, x: piece.x + kick };
        sound(playTapSound);
        repaint();
        return;
      }
    }
  }, [repaint, sound]);

  const hardDrop = useCallback(() => {
    const piece = currentRef.current;
    if (!piece) return;
    const gy = ghostY(boardRef.current, piece);
    currentRef.current = { ...piece, y: gy };
    sound(playTapSound);
    lockAndAdvance();
  }, [lockAndAdvance, sound]);

  const holdPiece = useCallback(() => {
    if (!canHoldRef.current) return;
    const piece = currentRef.current;
    if (!piece) return;
    canHoldRef.current = false;
    sound(playTapSound);
    const held = holdRef.current;
    if (held) {
      holdRef.current   = { key: piece.key, shape: PIECES[piece.key].shape.map(r => [...r]), color: piece.color };
      const np          = { ...held, shape: PIECES[held.key].shape.map(r => [...r]), x: Math.floor((COLS - PIECES[held.key].shape[0].length) / 2), y: 0 };
      currentRef.current = np;
    } else {
      holdRef.current    = { key: piece.key, shape: PIECES[piece.key].shape.map(r => [...r]), color: piece.color };
      currentRef.current = null;
      spawnPiece();
    }
    repaint();
  }, [spawnPiece, repaint, sound]);

  // ── togglePause ──
  const togglePause = useCallback(() => {
    setPhase(prev => {
      if (prev === 'play') {
        clearInterval(intervalRef.current);
        return 'paused';
      }
      if (prev === 'paused') {
        restartInterval(levelRef.current);
        return 'play';
      }
      return prev;
    });
  }, [restartInterval]);

  // ── Math answer ──
  const answerMath = useCallback((choice) => {
    if (!mathQ) return;
    if (choice === mathQ.answer) {
      scoreRef.current += 50;
      setScore(scoreRef.current);
      setMathFeedback('ok');
      sound(playCorrectSound);
      setTimeout(() => {
        setMathQ(null);
        setMathFeedback(null);
        if (!spawnPiece()) return;
        repaint();
        restartInterval(levelRef.current);
        setPhase('play');
      }, 900);
    } else {
      setMathFeedback('wrong');
      sound(playWrongSound);
      setTimeout(() => {
        setMathQ(null);
        setMathFeedback(null);
        if (!spawnPiece()) return;
        repaint();
        restartInterval(levelRef.current);
        setPhase('play');
      }, 1600);
    }
  }, [mathQ, spawnPiece, repaint, restartInterval, sound]);

  // ── Keyboard ──
  useEffect(() => {
    if (phase !== 'play' && phase !== 'paused') return;
    const onKey = (e) => {
      if (e.key === 'p' || e.key === 'P') { e.preventDefault(); togglePause(); return; }
      if (phase === 'paused') return;
      if (e.key === 'ArrowLeft')  { e.preventDefault(); move(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); move(1); }
      if (e.key === 'ArrowUp')    { e.preventDefault(); rotate(); }
      if (e.key === 'ArrowDown')  { e.preventDefault(); stepDownRef.current?.(); }
      if (e.key === ' ')          { e.preventDefault(); hardDrop(); }
      if (e.key === 'h' || e.key === 'H') { e.preventDefault(); holdPiece(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, move, rotate, hardDrop, holdPiece, togglePause]);

  // ── startGame ──
  const startGame = useCallback((diff) => {
    const d = diff || diffRef.current;
    diffRef.current = d;
    clearInterval(intervalRef.current);
    clearTimeout(msgTimerRef.current);
    boardRef.current   = emptyBoard();
    scoreRef.current   = 0;
    linesRef.current   = 0;
    levelRef.current   = 1;
    comboRef.current   = 0;
    gameOverRef.current = false;
    nextRef.current    = randomPiece();
    currentRef.current = null;
    holdRef.current    = null;
    canHoldRef.current = true;
    startTimeRef.current = Date.now();
    setScore(0); setLines(0); setLevel(1); setCombo(0);
    setMessage(null); setMathQ(null); setMathFeedback(null);
    setPhase('play');
    setTimeout(() => {
      spawnPiece();
      repaint();
      restartInterval(1);
    }, 0);
  }, [spawnPiece, repaint, restartInterval]);

  // ── Cleanup ──
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(msgTimerRef.current);
    };
  }, []);

  // ── Build render board ──
  const getRenderBoard = () => {
    const board = boardRef.current.map(r => [...r]);
    const piece = currentRef.current;
    if (piece) {
      const gy = ghostY(board, piece);
      piece.shape.forEach((row, r) =>
        row.forEach((v, c) => {
          if (v) {
            const ny = gy + r, nx = piece.x + c;
            if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS && !board[ny][nx])
              board[ny][nx] = '__ghost__';
          }
        })
      );
      piece.shape.forEach((row, r) =>
        row.forEach((v, c) => {
          if (v) {
            const ny = piece.y + r, nx = piece.x + c;
            if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS)
              board[ny][nx] = piece.color;
          }
        })
      );
    }
    return board;
  };

  // ── SETUP SCREEN ──
  if (phase === 'setup') {
    const prog = getGameProgress('tetris');
    return (
      <div className="tet-page">
        <div className="tet-setup-card">
          <div className="tet-setup__icon">🎮</div>
          <div className="tet-setup__title">Tetris</div>
          <div className="tet-setup__sub">Empile les pièces, efface les lignes !</div>

          {prog.bestScore > 0 && (
            <div className="tet-setup__best">🏆 Meilleur score : {prog.bestScore}</div>
          )}

          <div className="tet-setup__section">Difficulté</div>
          <div className="tet-diff-row">
            {Object.entries(DIFFICULTY_CFG).map(([key, cfg]) => (
              <button
                key={key}
                className={`tet-diff-btn${difficulty === key ? ' tet-diff-btn--active' : ''}`}
                style={{ '--diff-color': cfg.color }}
                onClick={() => setDifficulty(key)}
              >
                <span className="tet-diff-btn__emoji">{cfg.emoji}</span>
                <span className="tet-diff-btn__label">{cfg.label}</span>
              </button>
            ))}
          </div>
          <div className="tet-setup__diff-desc">{DIFFICULTY_CFG[difficulty].desc}</div>

          <div className="tet-setup__section">Mode éducatif</div>
          <button
            className={`tet-mode-toggle${mathMode ? ' tet-mode-toggle--on' : ''}`}
            onClick={() => setMathMode(m => !m)}
          >
            <span className="tet-mode-toggle__icon">🧮</span>
            <div className="tet-mode-toggle__text">
              <strong>Mode Calcul Rapide</strong>
              <span>Une mini question maths après chaque ligne</span>
            </div>
            <span className="tet-mode-toggle__state">{mathMode ? 'ON' : 'OFF'}</span>
          </button>

          <button className="tet-cta" onClick={() => startGame(difficulty)}>
            Jouer !
          </button>
          <Link to="/jeux" className="tet-back-link">← Retour aux jeux</Link>
        </div>
      </div>
    );
  }

  // ── RESULTS SCREEN ──
  if (phase === 'results') {
    const stars    = starsForScore(score);
    const medal    = medalForScore(score);
    const starStr  = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    const isNew    = score > bestScore - (score === bestScore ? 0 : 0);
    const displayBest = Math.max(bestScore, score);
    return (
      <div className="tet-page">
        <div className="tet-results">
          <div className="tet-results__emoji">
            {medal ? medal.emoji : stars >= 2 ? '🎉' : '😅'}
          </div>
          <div className="tet-results__title">
            {stars >= 3 ? 'Incroyable !' : stars >= 2 ? 'Bravo !' : stars >= 1 ? 'Bien joué !' : 'Courage !'}
          </div>
          <div className="tet-results__stars">{starStr}</div>
          {medal && (
            <div className="tet-results__medal" style={{ color: medal.color }}>
              {medal.emoji} Médaille {medal.label}
            </div>
          )}
          <div className="tet-results__stats">
            <div className="tet-results__stat">
              <span className="tet-results__stat-val">{score}</span>
              <span className="tet-results__stat-lbl">Score</span>
            </div>
            <div className="tet-results__stat">
              <span className="tet-results__stat-val">{lines}</span>
              <span className="tet-results__stat-lbl">Lignes</span>
            </div>
            <div className="tet-results__stat">
              <span className="tet-results__stat-val">{level}</span>
              <span className="tet-results__stat-lbl">Niveau</span>
            </div>
            <div className="tet-results__stat">
              <span className="tet-results__stat-val">{displayBest}</span>
              <span className="tet-results__stat-lbl">Meilleur</span>
            </div>
          </div>
          {score >= bestScore && bestScore > 0 && score > 0 && (
            <div className="tet-results__newbest">🌟 Nouveau record !</div>
          )}
          <div className="tet-results__btns">
            <button className="tet-cta" onClick={() => startGame(difficulty)}>
              🔁 Rejouer
            </button>
            <button
              className="tet-cta tet-cta--soft"
              onClick={() => setPhase('setup')}
            >
              Changer de mode
            </button>
            <Link to="/jeux" className="tet-back-link">← Retour aux jeux</Link>
          </div>
        </div>
      </div>
    );
  }

  // ── GAME SCREEN ──
  const renderBoard = getRenderBoard();
  const previewSz = Math.max(12, Math.min(18, Math.floor(cellSize * 0.68)));

  return (
    <div className="tet-page">
      <div className="tet-arcade" style={{ '--tet-cell': `${cellSize}px` }}>

        {/* Header bar */}
        <div className="tet-topbar">
          <Link to="/jeux" className="tet-back">← Jeux</Link>
          <div className="tet-title">Tetris</div>
          <div className="tet-topbar__right">
            {mathMode && <span className="tet-math-badge">🧮</span>}
            <button
              className="tet-icon-btn"
              onClick={() => setSoundOn(s => !s)}
              aria-label={soundOn ? 'Couper le son' : 'Activer le son'}
            >{soundOn ? '🔊' : '🔇'}</button>
            <button
              className="tet-icon-btn"
              onClick={togglePause}
              aria-label={phase === 'paused' ? 'Reprendre' : 'Pause'}
            >{phase === 'paused' ? '▶' : '⏸'}</button>
          </div>
        </div>

        {/* Game layout */}
        <div className="tet-layout">

          {/* Left panel */}
          <div className="tet-panel">
            <div className="tet-stat-box">
              <div className="tet-stat__lbl">Score</div>
              <div className="tet-stat__val">{score}</div>
            </div>
            <div className="tet-stat-box tet-stat-box--muted">
              <div className="tet-stat__lbl">Best</div>
              <div className="tet-stat__val">{Math.max(bestScore, score)}</div>
            </div>
            <div className="tet-hold-box">
              <div className="tet-box-label">Hold <span style={{opacity:.5, fontSize:'.7em'}}>[H]</span></div>
              <div className="tet-preview-inner">
                {holdRef.current
                  ? <PreviewGrid pieceKey={holdRef.current.key} size={previewSz} />
                  : <div className="tet-empty-slot" />
                }
              </div>
            </div>
          </div>

          {/* Board area */}
          <div className="tet-board-wrap" style={{ position: 'relative' }}>
            {message && <div className="tet-message">{message}</div>}
            {phase === 'paused' && (
              <PauseOverlay
                onResume={togglePause}
                onQuit={() => { clearInterval(intervalRef.current); setPhase('setup'); }}
              />
            )}
            {phase === 'math' && mathQ && (
              <MathOverlay question={mathQ} feedback={mathFeedback} onAnswer={answerMath} />
            )}
            <div className="tet-board">
              {renderBoard.map((row, r) => (
                <div key={r} className="tet-row">
                  {row.map((cell, c) => {
                    const isGhost = cell === '__ghost__';
                    const bg = isGhost
                      ? 'rgba(255,255,255,.08)'
                      : cell
                      ? cell
                      : 'rgba(255,255,255,.03)';
                    return (
                      <div
                        key={c}
                        className={`tet-cell${cell && !isGhost ? ' tet-cell--filled' : ''}${isGhost ? ' tet-cell--ghost' : ''}`}
                        style={{ background: bg, '--c': cell && !isGhost ? cell : 'transparent' }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <div className="tet-panel">
            <div className="tet-next-box">
              <div className="tet-box-label">Suivant</div>
              <div className="tet-preview-inner">
                <PreviewGrid pieceKey={nextRef.current?.key} size={previewSz} />
              </div>
            </div>
            <div className="tet-stat-box">
              <div className="tet-stat__lbl">Lignes</div>
              <div className="tet-stat__val">{lines}</div>
            </div>
            <div className="tet-stat-box">
              <div className="tet-stat__lbl">Niveau</div>
              <div className="tet-stat__val">{level}</div>
            </div>
            {combo > 1 && (
              <div className="tet-combo-badge">🔥 x{combo}</div>
            )}
            <div className="tet-diff-indicator" style={{ '--diff-color': DIFFICULTY_CFG[difficulty]?.color }}>
              {DIFFICULTY_CFG[difficulty]?.emoji} {DIFFICULTY_CFG[difficulty]?.label}
            </div>
          </div>
        </div>

        {/* Touch controls */}
        <div className="tet-controls">
          <div className="tet-ctrl-row tet-ctrl-row--top">
            <button
              className="tet-ctrl-btn tet-ctrl-btn--hold"
              onPointerDown={e => { e.preventDefault(); holdPiece(); }}
              aria-label="Hold"
            >🔒</button>
            <button
              className="tet-ctrl-btn tet-ctrl-btn--rotate"
              onPointerDown={e => { e.preventDefault(); rotate(); }}
              aria-label="Pivoter"
            >↻</button>
            <button
              className="tet-ctrl-btn tet-ctrl-btn--drop"
              onPointerDown={e => { e.preventDefault(); hardDrop(); }}
              aria-label="Chute rapide"
            >⬇</button>
          </div>
          <div className="tet-ctrl-row tet-ctrl-row--bottom">
            <button
              className="tet-ctrl-btn tet-ctrl-btn--move"
              onPointerDown={e => { e.preventDefault(); move(-1); }}
              aria-label="Gauche"
            >◀</button>
            <button
              className="tet-ctrl-btn tet-ctrl-btn--soft"
              onPointerDown={e => { e.preventDefault(); stepDownRef.current?.(); }}
              aria-label="Bas"
            >▼</button>
            <button
              className="tet-ctrl-btn tet-ctrl-btn--move"
              onPointerDown={e => { e.preventDefault(); move(1); }}
              aria-label="Droite"
            >▶</button>
          </div>
        </div>

        <div className="tet-hint">← → ↓ | ↑=Pivot | Espace=Chute | H=Hold | P=Pause</div>
      </div>
    </div>
  );
}
