import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

const COLS = 10;
const ROWS = 20;
const BASE_INTERVAL = 800;

const PIECES = {
  I: { shape: [[1, 1, 1, 1]], color: '#06b6d4' },
  O: { shape: [[1, 1], [1, 1]], color: '#eab308' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#a855f7' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#22c55e' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#ef4444' },
  L: { shape: [[1, 0], [1, 0], [1, 1]], color: '#f97316' },
  J: { shape: [[0, 1], [0, 1], [1, 1]], color: '#3b82f6' },
};

const PIECE_KEYS = Object.keys(PIECES);

function emptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(''));
}

function randomPiece() {
  const key = PIECE_KEYS[Math.floor(Math.random() * PIECE_KEYS.length)];
  const { shape, color } = PIECES[key];
  return {
    key,
    shape: shape.map(r => [...r]),
    color,
    x: Math.floor((COLS - shape[0].length) / 2),
    y: 0,
  };
}

function rotateCW(shape) {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = shape[r][c];
    }
  }
  return rotated;
}

function isValid(board, shape, x, y) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const nx = x + c;
      const ny = y + r;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
      if (ny >= 0 && board[ny][nx]) return false;
    }
  }
  return true;
}

function placePiece(board, piece) {
  const newBoard = board.map(r => [...r]);
  piece.shape.forEach((row, r) => {
    row.forEach((v, c) => {
      if (v) {
        const ny = piece.y + r;
        const nx = piece.x + c;
        if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) {
          newBoard[ny][nx] = piece.color;
        }
      }
    });
  });
  return newBoard;
}

function clearLines(board) {
  const kept = board.filter(row => row.some(cell => !cell));
  const cleared = ROWS - kept.length;
  const empty = Array.from({ length: cleared }, () => Array(COLS).fill(''));
  return { board: [...empty, ...kept], cleared };
}

function ghostY(board, piece) {
  let y = piece.y;
  while (isValid(board, piece.shape, piece.x, y + 1)) y++;
  return y;
}

function starsForScore(score) {
  if (score >= 1000) return '★★★';
  if (score >= 300) return '★★☆';
  if (score >= 50) return '★☆☆';
  return '☆☆☆';
}

function PreviewGrid({ pieceKey }) {
  if (!pieceKey) return null;
  const { shape, color } = PIECES[pieceKey];
  const padded = shape.map(r => [...r]);
  const maxCols = Math.max(...padded.map(r => r.length));
  return (
    <div className="tet-preview-grid">
      {padded.map((row, r) => (
        <div key={r} className="tet-preview-row">
          {Array.from({ length: maxCols }, (_, c) => (
            <div
              key={c}
              className="tet-preview-cell"
              style={{ background: row[c] ? color : 'rgba(255,255,255,.06)' }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function TetrisPage() {
  const [phase, setPhase] = useState('setup'); // setup | play | results
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [tick, setTick] = useState(0); // forces re-render

  // Game state kept in refs — never stale in the interval
  const boardRef = useRef(emptyBoard());
  const currentRef = useRef(null);
  const nextRef = useRef(null);
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  const linesRef = useRef(0);
  const levelRef = useRef(1);
  const intervalRef = useRef(null);

  const repaint = useCallback(() => setTick(t => t + 1), []);

  const spawnPiece = useCallback(() => {
    const piece = nextRef.current || randomPiece();
    nextRef.current = randomPiece();
    if (!isValid(boardRef.current, piece.shape, piece.x, piece.y)) {
      gameOverRef.current = true;
      clearInterval(intervalRef.current);
      setPhase('results');
      setScore(scoreRef.current);
      return false;
    }
    currentRef.current = piece;
    return true;
  }, []);

  const lockAndAdvance = useCallback(() => {
    const piece = currentRef.current;
    if (!piece) return;
    const newBoard = placePiece(boardRef.current, piece);
    const { board: clearedBoard, cleared } = clearLines(newBoard);
    boardRef.current = clearedBoard;
    if (cleared > 0) {
      const pts = [0, 100, 300, 500, 800][Math.min(cleared, 4)] * levelRef.current;
      scoreRef.current += pts;
      linesRef.current += cleared;
      levelRef.current = Math.floor(linesRef.current / 10) + 1;
      setScore(scoreRef.current);
      setLines(linesRef.current);
      setLevel(levelRef.current);
      // Restart interval at new speed
      clearInterval(intervalRef.current);
      const speed = Math.max(100, BASE_INTERVAL - (levelRef.current - 1) * 70);
      intervalRef.current = setInterval(() => stepDownRef.current(), speed);
    }
    currentRef.current = null;
    spawnPiece();
    repaint();
  }, [spawnPiece, repaint]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Keep stepDown stable reference for interval
  const stepDownRef = useRef(stepDown);
  useEffect(() => { stepDownRef.current = stepDown; }, [stepDown]);

  const move = useCallback((dx) => {
    const piece = currentRef.current;
    if (!piece) return;
    if (isValid(boardRef.current, piece.shape, piece.x + dx, piece.y)) {
      currentRef.current = { ...piece, x: piece.x + dx };
      repaint();
    }
  }, [repaint]);

  const rotate = useCallback(() => {
    const piece = currentRef.current;
    if (!piece) return;
    const rotated = rotateCW(piece.shape);
    // Try wall kicks: 0, -1, +1, -2, +2
    for (const kick of [0, -1, 1, -2, 2]) {
      if (isValid(boardRef.current, rotated, piece.x + kick, piece.y)) {
        currentRef.current = { ...piece, shape: rotated, x: piece.x + kick };
        repaint();
        return;
      }
    }
  }, [repaint]);

  const hardDrop = useCallback(() => {
    const piece = currentRef.current;
    if (!piece) return;
    const gy = ghostY(boardRef.current, piece);
    currentRef.current = { ...piece, y: gy };
    lockAndAdvance();
  }, [lockAndAdvance]);

  // Keyboard
  useEffect(() => {
    if (phase !== 'play') return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); move(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); move(1); }
      if (e.key === 'ArrowUp')    { e.preventDefault(); rotate(); }
      if (e.key === 'ArrowDown')  { e.preventDefault(); stepDownRef.current(); }
      if (e.key === ' ')          { e.preventDefault(); hardDrop(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, move, rotate, hardDrop]);

  // Start game loop
  const startGame = useCallback(() => {
    clearInterval(intervalRef.current);
    boardRef.current = emptyBoard();
    scoreRef.current = 0;
    linesRef.current = 0;
    levelRef.current = 1;
    gameOverRef.current = false;
    nextRef.current = randomPiece();
    currentRef.current = null;
    setScore(0);
    setLines(0);
    setLevel(1);
    setPhase('play');
    setTimeout(() => {
      spawnPiece();
      repaint();
      intervalRef.current = setInterval(() => stepDownRef.current(), BASE_INTERVAL);
    }, 0);
  }, [spawnPiece, repaint]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  // Build render board
  const getRenderBoard = () => {
    const board = boardRef.current.map(r => [...r]);
    const piece = currentRef.current;
    if (piece) {
      // Ghost
      const gy = ghostY(board, piece);
      piece.shape.forEach((row, r) => {
        row.forEach((v, c) => {
          if (v) {
            const ny = gy + r;
            const nx = piece.x + c;
            if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS && !board[ny][nx]) {
              board[ny][nx] = '__ghost__';
            }
          }
        });
      });
      // Active piece
      piece.shape.forEach((row, r) => {
        row.forEach((v, c) => {
          if (v) {
            const ny = piece.y + r;
            const nx = piece.x + c;
            if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) {
              board[ny][nx] = piece.color;
            }
          }
        });
      });
    }
    return board;
  };

  if (phase === 'setup') {
    return (
      <div className="tet-page">
        <div className="tet-setup">
          <div style={{ fontSize: '3.5rem', textAlign: 'center', marginBottom: 8 }}>🎮</div>
          <div className="tet-setup-title">Tetris</div>
          <div className="tet-setup-sub" style={{ textAlign: 'center', opacity: .7, marginBottom: 32 }}>
            Empile les pieces et efface les lignes !<br/>Utilise les boutons ou les fleches du clavier.
          </div>
          <button className="tet-cta" onPointerDown={startGame} style={{ marginBottom: 12 }}>
            Jouer !
          </button>
          <Link to="/jeux" style={{ display: 'block', textAlign: 'center', color: 'rgba(255,255,255,.6)', textDecoration: 'none', marginTop: 8 }}>
            Retour aux jeux
          </Link>
        </div>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = starsForScore(score);
    return (
      <div className="tet-page">
        <div className="tet-setup">
          <div className="tet-setup-title">Game Over !</div>
          <div className="jeux-stars">{stars}</div>
          <div className="jeux-result-stat"><span>Score</span><span>{score}</span></div>
          <div className="jeux-result-stat"><span>Lignes</span><span>{lines}</span></div>
          <div className="jeux-result-stat"><span>Niveau</span><span>{level}</span></div>
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="tet-cta" onPointerDown={startGame}>Rejouer</button>
            <Link to="/jeux" style={{ display: 'block', textAlign: 'center', color: 'rgba(255,255,255,.6)', textDecoration: 'none', marginTop: 8 }}>
              Retour aux jeux
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderBoard = getRenderBoard();

  return (
    <div className="tet-page">
      <div className="tet-page-inner">
        <div className="tet-header">
          <Link to="/jeux" className="tet-back">← Jeux</Link>
          <div className="tet-title">Tetris</div>
        </div>
        <div className="tet-hud">
          <div className="tet-stat">
            <div className="tet-stat__label">Score</div>
            <div className="tet-stat__val">{score}</div>
          </div>
          <div className="tet-stat">
            <div className="tet-stat__label">Lignes</div>
            <div className="tet-stat__val">{lines}</div>
          </div>
          <div className="tet-stat">
            <div className="tet-stat__label">Niveau</div>
            <div className="tet-stat__val">{level}</div>
          </div>
        </div>
        <div className="tet-arena">
          <div className="tet-board">
            {renderBoard.map((row, r) => (
              <div key={r} className="tet-row">
                {row.map((cell, c) => {
                  const isGhost = cell === '__ghost__';
                  const bg = isGhost
                    ? 'rgba(255,255,255,.1)'
                    : cell
                    ? cell
                    : 'rgba(255,255,255,.04)';
                  return (
                    <div
                      key={c}
                      className={`tet-cell${cell && !isGhost ? ' tet-cell--filled' : ''}${isGhost ? ' tet-cell--ghost' : ''}`}
                      style={{ background: bg }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="tet-side">
            <div className="tet-preview-box">
              <div className="tet-preview-label">Suivant</div>
              <PreviewGrid pieceKey={nextRef.current?.key} />
            </div>
          </div>
        </div>
        <div className="tet-controls">
          <button className="tet-btn" onPointerDown={() => move(-1)} aria-label="Gauche">←</button>
          <button className="tet-btn" onPointerDown={rotate} aria-label="Pivoter">↻</button>
          <button className="tet-btn" onPointerDown={() => move(1)} aria-label="Droite">→</button>
          <button className="tet-btn" onPointerDown={hardDrop} aria-label="Tomber">↓</button>
        </div>
      </div>
    </div>
  );
}
