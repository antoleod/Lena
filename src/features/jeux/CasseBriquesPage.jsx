import { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

const CANVAS_W = 360;
const CANVAS_H = 480;
const PADDLE_W = 80;
const PADDLE_H = 12;
const BALL_R = 8;
const BRICK_COLS = 6;
const BRICK_ROWS = 5;
const BRICK_W = Math.floor((CANVAS_W - 20) / BRICK_COLS);
const BRICK_H = 28;
const BRICK_PAD_X = 10;
const BRICK_PAD_Y = 50;
const MAX_LIVES = 3;

const LEVELS = [
  { label: 'N1', key: 'n1', emoji: '➕', desc: 'Addition ≤ 20', speed: 3.5 },
  { label: 'N2', key: 'n2', emoji: '➕➖', desc: 'Addition/Soustraction ≤ 50', speed: 4 },
  { label: 'N3', key: 'n3', emoji: '✖️', desc: 'Tables de multiplication', speed: 4.5 },
];

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateEquation(levelIdx) {
  if (levelIdx === 0) {
    const a = rnd(1, 10), b = rnd(1, 10);
    return { text: `${a} + ${b}`, answer: a + b };
  }
  if (levelIdx === 1) {
    const op = Math.random() > 0.5 ? '+' : '-';
    const a = rnd(10, 50), b = rnd(1, a);
    return { text: `${a} ${op} ${b}`, answer: op === '+' ? a + b : a - b };
  }
  const a = rnd(2, 10), b = rnd(2, 10);
  return { text: `${a} × ${b}`, answer: a * b };
}

function generateBrickValues(answer, levelIdx) {
  const values = [answer];
  const seen = new Set([answer]);
  while (values.length < BRICK_COLS * BRICK_ROWS) {
    let v;
    if (levelIdx === 0) v = rnd(2, 20);
    else if (levelIdx === 1) v = rnd(2, 60);
    else v = rnd(2, 100);
    if (!seen.has(v)) { seen.add(v); values.push(v); }
  }
  // Shuffle so the answer(s) are scattered
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
}

function initBricks(answer, levelIdx) {
  const values = generateBrickValues(answer, levelIdx);
  return values.map((v, i) => ({
    col: i % BRICK_COLS,
    row: Math.floor(i / BRICK_COLS),
    value: v,
    alive: true,
    isAnswer: v === answer,
  }));
}

function calcStars(score) {
  if (score >= 20) return 3;
  if (score >= 10) return 2;
  if (score >= 5) return 1;
  return 0;
}

export default function CasseBriquesPage() {
  const { progress, saveSession, resetTimer } = useGameSession('casse-briques');
  const [phase, setPhase] = useState('setup');
  const [levelIdx, setLevelIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [equation, setEquation] = useState(null);
  const [result, setResult] = useState(null);
  const canvasRef = useRef(null);

  // Game state in refs (avoids stale closures in animation loop)
  const stateRef = useRef({
    running: false,
    paddle: { x: CANVAS_W / 2 - PADDLE_W / 2, y: CANVAS_H - 30 },
    ball: { x: CANVAS_W / 2, y: CANVAS_H / 2, vx: 2.5, vy: -3 },
    bricks: [],
    score: 0,
    lives: MAX_LIVES,
    equation: null,
    levelIdx: 0,
    baseSpeed: 3.5,
    speedMul: 1,
    touchX: null,
    animId: null,
  });

  const endGame = useCallback((finalScore) => {
    const s = stateRef.current;
    s.running = false;
    if (s.animId) cancelAnimationFrame(s.animId);
    const stars = calcStars(finalScore);
    const res = saveSession({ score: finalScore, level: levelIdx + 1, stars });
    setResult({ score: finalScore, stars, ...res });
    setPhase('results');
  }, [saveSession, levelIdx]);

  const reloadEquation = useCallback(() => {
    const s = stateRef.current;
    const eq = generateEquation(s.levelIdx);
    s.equation = eq;
    s.bricks = initBricks(eq.answer, s.levelIdx);
    setEquation(eq);
  }, []);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s = stateRef.current;
    if (!s.running) return;

    // Clear
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Background
    ctx.fillStyle = 'rgba(13,10,46,0.95)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Move ball
    const speed = s.baseSpeed * s.speedMul;
    const norm = Math.hypot(s.ball.vx, s.ball.vy);
    s.ball.vx = (s.ball.vx / norm) * speed;
    s.ball.vy = (s.ball.vy / norm) * speed;
    s.ball.x += s.ball.vx;
    s.ball.y += s.ball.vy;

    // Wall bounces
    if (s.ball.x - BALL_R < 0) { s.ball.x = BALL_R; s.ball.vx = Math.abs(s.ball.vx); }
    if (s.ball.x + BALL_R > CANVAS_W) { s.ball.x = CANVAS_W - BALL_R; s.ball.vx = -Math.abs(s.ball.vx); }
    if (s.ball.y - BALL_R < 0) { s.ball.y = BALL_R; s.ball.vy = Math.abs(s.ball.vy); }

    // Paddle bounce
    const py = s.paddle.y;
    if (
      s.ball.y + BALL_R >= py &&
      s.ball.y - BALL_R <= py + PADDLE_H &&
      s.ball.x >= s.paddle.x &&
      s.ball.x <= s.paddle.x + PADDLE_W
    ) {
      const relX = (s.ball.x - (s.paddle.x + PADDLE_W / 2)) / (PADDLE_W / 2);
      s.ball.vx = relX * speed * 1.2;
      s.ball.vy = -Math.abs(s.ball.vy);
      s.ball.y = py - BALL_R - 1;
    }

    // Ball falls off
    if (s.ball.y > CANVAS_H + 20) {
      s.lives -= 1;
      setLives(s.lives);
      if (s.lives <= 0) {
        s.running = false;
        endGame(s.score);
        return;
      }
      s.ball.x = CANVAS_W / 2;
      s.ball.y = CANVAS_H / 2;
      s.ball.vx = 2.5;
      s.ball.vy = -speed;
    }

    // Brick collision
    for (const b of s.bricks) {
      if (!b.alive) continue;
      const bx = BRICK_PAD_X + b.col * BRICK_W;
      const by = BRICK_PAD_Y + b.row * BRICK_H;
      if (
        s.ball.x + BALL_R > bx + 2 &&
        s.ball.x - BALL_R < bx + BRICK_W - 2 &&
        s.ball.y + BALL_R > by + 2 &&
        s.ball.y - BALL_R < by + BRICK_H - 2
      ) {
        b.alive = false;
        // Determine collision side for reflection
        const overlapX = Math.min(s.ball.x + BALL_R - bx, bx + BRICK_W - (s.ball.x - BALL_R));
        const overlapY = Math.min(s.ball.y + BALL_R - by, by + BRICK_H - (s.ball.y - BALL_R));
        if (overlapX < overlapY) s.ball.vx *= -1;
        else s.ball.vy *= -1;

        if (b.isAnswer) {
          s.score += 2;
          setScore(s.score);
          s.speedMul = Math.min(2, s.speedMul + 0.05);
          // Reload when all answer bricks gone or none alive
          const anyAnswer = s.bricks.some(brick => brick.alive && brick.isAnswer);
          if (!anyAnswer) {
            reloadEquation();
          }
        } else {
          s.lives -= 1;
          setLives(s.lives);
          if (s.lives <= 0) {
            s.running = false;
            endGame(s.score);
            return;
          }
        }
        break; // one brick per frame
      }
    }

    // Check all bricks gone
    if (s.bricks.every(b => !b.alive)) {
      reloadEquation();
    }

    // Draw bricks
    for (const b of s.bricks) {
      if (!b.alive) continue;
      const bx = BRICK_PAD_X + b.col * BRICK_W;
      const by = BRICK_PAD_Y + b.row * BRICK_H;
      ctx.fillStyle = b.isAnswer
        ? `rgba(34,197,94,0.8)`
        : `hsl(${(b.value * 37) % 360}, 60%, 45%)`;
      ctx.beginPath();
      ctx.roundRect(bx + 2, by + 2, BRICK_W - 4, BRICK_H - 4, 5);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.value, bx + BRICK_W / 2, by + BRICK_H / 2);
    }

    // Draw paddle
    ctx.fillStyle = 'rgba(168,85,247,0.9)';
    ctx.beginPath();
    ctx.roundRect(s.paddle.x, s.paddle.y, PADDLE_W, PADDLE_H, 6);
    ctx.fill();

    // Draw ball
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(s.ball.x, s.ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();

    // Lives
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('❤️'.repeat(s.lives), 8, 8);

    // Score
    ctx.textAlign = 'right';
    ctx.fillText(`⭐ ${s.score}`, CANVAS_W - 8, 8);

    s.animId = requestAnimationFrame(drawFrame);
  }, [endGame, reloadEquation]);

  const startGame = useCallback((idx) => {
    const cfg = LEVELS[idx];
    const eq = generateEquation(idx);
    const s = stateRef.current;
    if (s.animId) cancelAnimationFrame(s.animId);
    s.running = false;
    s.levelIdx = idx;
    s.baseSpeed = cfg.speed;
    s.speedMul = 1;
    s.score = 0;
    s.lives = MAX_LIVES;
    s.paddle = { x: CANVAS_W / 2 - PADDLE_W / 2, y: CANVAS_H - 30 };
    s.ball = { x: CANVAS_W / 2, y: CANVAS_H / 2, vx: 2.5, vy: -cfg.speed };
    s.equation = eq;
    s.bricks = initBricks(eq.answer, idx);
    s.animId = null;

    setLevelIdx(idx);
    setScore(0);
    setLives(MAX_LIVES);
    setEquation(eq);
    resetTimer();
    setPhase('play');

    s.running = true;
    requestAnimationFrame(drawFrame);
  }, [resetTimer, drawFrame]);

  // Keyboard controls
  useEffect(() => {
    if (phase !== 'play') return;
    const s = stateRef.current;

    function onKey(e) {
      if (!s.running) return;
      if (e.key === 'ArrowLeft') s.paddle.x = Math.max(0, s.paddle.x - 20);
      if (e.key === 'ArrowRight') s.paddle.x = Math.min(CANVAS_W - PADDLE_W, s.paddle.x + 20);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase]);

  // Touch/mouse controls on canvas
  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    stateRef.current.paddle.x = Math.max(0, Math.min(CANVAS_W - PADDLE_W, x - PADDLE_W / 2));
  }, []);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    stateRef.current.paddle.x = Math.max(0, Math.min(CANVAS_W - PADDLE_W, x - PADDLE_W / 2));
  }, []);

  useEffect(() => {
    return () => {
      const s = stateRef.current;
      if (s.animId) cancelAnimationFrame(s.animId);
      s.running = false;
    };
  }, []);

  const best = progress?.bestScore ?? 0;
  const cfg = LEVELS[levelIdx];

  if (phase === 'setup') {
    return (
      <div className="sm-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="sm-setup">
          <div className="sm-setup__hero">
            <div className="sm-setup__emoji">🧱</div>
            <h1 className="sm-setup__title">Casse-Briques</h1>
            <p className="sm-setup__sub">Casse les briques avec la bonne réponse !</p>
            <p className="sm-setup__sub" style={{fontSize:'0.75rem', opacity:0.7}}>Brique verte = bonne réponse (+2pts) | Autre brique = -1 vie</p>
            {best > 0 && <p className="sm-setup__sub">Meilleur score : {best}</p>}
          </div>
          <div className="sm-level-section">
            <p className="sm-level-title">Choisir un niveau</p>
            <div className="jeux-level-grid">
              {LEVELS.map((lv, i) => (
                <button key={lv.key} className="jeux-level-btn" onClick={() => startGame(i)}>
                  <span>{lv.emoji}</span>
                  <span>{lv.label}</span>
                  <span style={{fontSize:'0.75rem', opacity:0.7}}>{lv.desc}</span>
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
          <div className="game-results__emoji">🧱</div>
          <h2 className="game-results__title">Game Over</h2>
          <div className="game-results__stars">{'⭐'.repeat(result.stars)}{'☆'.repeat(3 - result.stars)}</div>
          <div className="game-results__stats">
            <div className="game-results__stat"><span>Score</span><strong>{result.score}</strong></div>
            {result.isNewBest && <div className="jeux-new-best">Nouveau record !</div>}
          </div>
          <button className="game-results__btn" onClick={() => startGame(levelIdx)}>Rejouer</button>
          <button className="game-results__btn" style={{marginTop:8}} onClick={() => setPhase('setup')}>Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="sm-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 8px', gap: 8 }}>
        {equation && (
          <div style={{
            background: 'rgba(255,255,255,0.12)', borderRadius: 12,
            padding: '8px 20px', fontSize: '1.4rem', fontWeight: 900, color: '#fbbf24',
            letterSpacing: '0.08em',
          }}>
            {equation.text} = ?
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={CANVAS_W} height={CANVAS_H}
          style={{ borderRadius: 12, border: '2px solid rgba(255,255,255,0.15)', cursor: 'none', maxWidth: '100%', touchAction: 'none' }}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        />
        <p style={{ fontSize: '0.75rem', opacity: 0.5, textAlign: 'center' }}>
          Déplace la souris ou le doigt pour bouger la raquette — ← → sur clavier
        </p>
      </div>
    </div>
  );
}
