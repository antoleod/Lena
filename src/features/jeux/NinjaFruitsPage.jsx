import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import { formatDuration } from '../../services/storage/gameProgressStore.js';
import { GameFeedback, useGameFeedback } from './GameFeedback.jsx';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import './jeux.css';

// ─── Constants ────────────────────────────────────────────────────────────────
const FRUITS_LIST = ['🍎','🍊','🍉','🍍','🍓','🍇','🥝','🍒','🍑','🥭'];
const SPECIAL_TYPES = {
  star:  { emoji: '⭐', color: '#fcd34d', shadowColor: 'rgba(252,211,77,.6)' },
  heart: { emoji: '❤️', color: '#f43f5e', shadowColor: 'rgba(244,63,94,.6)' },
  clock: { emoji: '⏰', color: '#60a5fa', shadowColor: 'rgba(96,165,250,.6)' },
  bomb:  { emoji: '💣', color: '#374151', shadowColor: 'rgba(55,65,81,.6)' },
  coin:  { emoji: '🪙', color: '#f59e0b', shadowColor: 'rgba(245,158,11,.6)' },
};
const SPECIAL_KEYS = Object.keys(SPECIAL_TYPES);
const LEVELS = [
  { label: 'Niveau 1', ops: ['+'],               max: 10,  speed: 60, maxFruits: 5 },
  { label: 'Niveau 2', ops: ['+','-'],            max: 20,  speed: 50, maxFruits: 6 },
  { label: 'Niveau 3', ops: ['+','-','×'],        max: 30,  speed: 45, maxFruits: 6 },
  { label: 'Niveau 4', ops: ['×','÷'],            max: 10,  speed: 40, maxFruits: 7 },
  { label: 'Niveau 5', ops: ['+','-','×','÷'],    max: 12,  speed: 35, maxFruits: 7 },
];

const CUSTOM_LEVEL = 0; // sentinel for custom mode

const MAX_OPTIONS   = [10, 20, 50, 100, 200, 500, 1000];
const SPEED_OPTIONS = [
  { label: '🐢 Lent',    value: 90 },
  { label: '🚶 Normal',  value: 60 },
  { label: '🏃 Rapide',  value: 40 },
  { label: '⚡ Éclair',  value: 20 },
];
const ALL_OPS = ['+', '-', '×', '÷'];

const CUSTOM_STORAGE_KEY = 'lena:ninja-custom:v1';
function loadCustomConfig() {
  try { return JSON.parse(localStorage.getItem(CUSTOM_STORAGE_KEY) || 'null'); } catch { return null; }
}
function saveCustomConfig(cfg) {
  try { localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(cfg)); } catch {}
}
const TOTAL_TIME   = 60;
const MAX_LIVES    = 3;
const SPECIAL_INTERVAL = 12; // seconds between special spawns
const HUD_REFRESH  = 0.15;   // seconds between React HUD updates
const FRUIT_SIZE_PCT = 10;   // % of arena width for collision

const MASCOT_MSGS = {
  correct: ['Bravo ! 🔥','Excellent !','Super ! ⭐','Parfait ! 💫','Incroyable !'],
  wrong:   ['Attention !','Continue !','Tu peux le faire !','Presque !'],
  combo3:  ['🔥 COMBO x3 !'],
  combo5:  ['⭐ BONUS x5 !!'],
  combo10: ['⚡ INCROYABLE !!'],
  star:    ['+50 ⭐'],
  heart:   ['+♥ Extra vie !'],
  clock:   ['+10s ⏰'],
  bomb:    ['💥 Boom !'],
  coin:    ['+20 🪙'],
  start:   ['🥷 Coupe la bonne réponse !','🥷 Mission : trouver le bon nombre !','🥷 Sois rapide !'],
};

const PARTICLE_COLORS_CORRECT = ['#22c55e','#4ade80','#fcd34d','#fb923c','#f9fafb'];
const PARTICLE_COLORS_WRONG    = ['#ef4444','#f97316','#fca5a5'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const rnd = (min, max) => Math.random() * (max - min) + min;
const rndInt = (min, max) => Math.floor(rnd(min, max + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const shuffle = arr => { const a = [...arr]; for (let i = a.length-1; i>0; i--) { const j = rndInt(0,i); [a[i],a[j]]=[a[j],a[i]]; } return a; };

function makeQuestion(ops, max) {
  const op = pick(ops);
  let a, b, answer;
  if (op === '+') { a = rndInt(1,max); b = rndInt(1,max-a+1); answer = a+b; }
  else if (op === '-') { a = rndInt(2,max); b = rndInt(1,a-1); answer = a-b; }
  else if (op === '×') { a = rndInt(2,9); b = rndInt(2,9); answer = a*b; }
  else { b = rndInt(2,9); answer = rndInt(2,9); a = b*answer; }
  return { text: `${a} ${op} ${b} = ?`, answer };
}

function buildWrongValues(correct, count) {
  const set = new Set([correct]);
  const vals = [];
  let attempts = 0;
  while (vals.length < count && attempts < 200) {
    attempts++;
    const delta = rndInt(1, 8) * (Math.random() < 0.5 ? 1 : -1);
    const v = correct + delta;
    if (v > 0 && !set.has(v)) { set.add(v); vals.push(v); }
  }
  // fallback if not enough
  let k = 1;
  while (vals.length < count) {
    if (!set.has(correct + k)) { set.add(correct+k); vals.push(correct+k); }
    k++;
  }
  return vals;
}

function spawnFruit(id, value, isCorrect, arenaW, arenaH) {
  const x = rnd(3, 87);
  const y = rnd(5, 75);
  const angle = rnd(0, Math.PI * 2);
  const speed = rnd(8, 22);
  return {
    id, emoji: pick(FRUITS_LIST), value, isCorrect,
    x, y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    rotation: rnd(0, 360),
    rotSpeed: rnd(-60, 60),
    phase: rnd(0, Math.PI * 2),
    state: 'alive',   // alive | popping | gone
    stateTimer: 0,
    isSpecial: false,
  };
}

function spawnSpecial(id) {
  const type = pick(SPECIAL_KEYS);
  const angle = rnd(0, Math.PI * 2);
  const speed = rnd(10, 20);
  return {
    id, type, isSpecial: true,
    x: rnd(3, 83), y: rnd(10, 70),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    rotation: 0, rotSpeed: rnd(-40, 40),
    phase: rnd(0, Math.PI * 2),
    state: 'alive', stateTimer: 0,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function NinjaFruitsPage() {
  const { progress, saveSession, resetTimer, elapsedSecs } = useGameSession('ninja-fruits');
  const { feedbackRef, triggerCorrect, triggerWrong, triggerScore, triggerCombo } = useGameFeedback();
  const { locale } = useLocale();

  const [phase, setPhase] = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(Math.min(progress.unlockedLevel ?? 1, 5));
  const [showCustom, setShowCustom] = useState(false);
  const [customOps, setCustomOps] = useState(() => loadCustomConfig()?.ops ?? ['+', '-']);
  const [customMax, setCustomMax] = useState(() => loadCustomConfig()?.max ?? 20);
  const [customSpeed, setCustomSpeed] = useState(() => loadCustomConfig()?.speed ?? 60);
  const [hudState, setHudState] = useState({ score: 0, lives: MAX_LIVES, streak: 0, timeLeft: TOTAL_TIME }); // timeLeft updated at startGame with level.speed
  const [question, setQuestion] = useState(null);
  const [mascotMsg, setMascotMsg] = useState(null);
  const [comboMsg, setComboMsg] = useState(null);
  const [sessionResult, setSessionResult] = useState(null);

  // Refs
  const gsRef      = useRef(null);
  const animRef    = useRef(null);
  const arenaRef   = useRef(null);
  const canvasRef  = useRef(null);
  const fruitElsRef  = useRef(new Map());
  const specialElsRef = useRef(new Map());
  const mascotTimerRef = useRef(null);
  const comboTimerRef  = useRef(null);
  const lockedRef  = useRef(false);

  const level = selectedLevel === CUSTOM_LEVEL
    ? { label: '⚙️ Personnalisé', ops: customOps.length ? customOps : ['+'], max: customMax, speed: customSpeed, maxFruits: 6 }
    : LEVELS[selectedLevel - 1];

  // ── Mascot ──────────────────────────────────────────────────────────────────
  function showMascot(key) {
    const msgs = MASCOT_MSGS[key];
    if (!msgs) return;
    setMascotMsg(pick(msgs));
    clearTimeout(mascotTimerRef.current);
    mascotTimerRef.current = setTimeout(() => setMascotMsg(null), 1800);
  }

  function showCombo(msg) {
    setComboMsg(msg);
    clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => setComboMsg(null), 1400);
  }

  // ── Particles (canvas) ──────────────────────────────────────────────────────
  function spawnParticles(px, py, colors, count = 18) {
    const gs = gsRef.current;
    if (!gs) return;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + rnd(-0.3, 0.3);
      const speed = rnd(60, 160);
      gs.particles.push({
        x: px, y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 40,
        r: rnd(3, 8),
        color: pick(colors),
        life: 1,
        decay: rnd(1.5, 2.5),
      });
    }
  }

  // ── Ninja slash (canvas) ─────────────────────────────────────────────────────
  function spawnSlash(px, py, isCorrect) {
    const gs = gsRef.current;
    if (!gs) return;
    // Main slash: bright diagonal line
    const baseAngle = rnd(-0.5, 0.5) + Math.PI / 4; // roughly top-left → bottom-right
    gs.slashes.push({
      x: px, y: py,
      angle: baseAngle,
      length: rnd(70, 110),
      life: 1,
      decay: 5.5,
      color: isCorrect ? '#ffffff' : '#ef4444',
      width: rnd(4, 7),
    });
    // Secondary thinner slash slightly offset
    gs.slashes.push({
      x: px + rnd(-8, 8), y: py + rnd(-8, 8),
      angle: baseAngle + rnd(-0.25, 0.25),
      length: rnd(35, 55),
      life: 0.7,
      decay: 6.5,
      color: isCorrect ? '#fcd34d' : '#fb923c',
      width: rnd(2, 3.5),
    });
  }

  // ── Fruit halves flying apart (DOM) ─────────────────────────────────────────
  function spawnFruitHalves(px, py, emoji) {
    const arena = arenaRef.current;
    if (!arena) return;

    [
      { cls: 'nf-half nf-half--left',  dx: rnd(-90, -40), dy: rnd(-80, -20), rot: rnd(-80, -30) },
      { cls: 'nf-half nf-half--right', dx: rnd( 40,  90), dy: rnd(-80, -20), rot: rnd( 30,  80) },
    ].forEach(({ cls, dx, dy, rot }) => {
      const el = document.createElement('div');
      el.className = cls;
      el.textContent = emoji;
      el.style.cssText = `left:${px}px;top:${py}px;--dx:${dx}px;--dy:${dy}px;--rot:${rot}deg;`;
      arena.appendChild(el);
      setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 700);
    });
  }

  function updateCanvas(dt) {
    const canvas = canvasRef.current;
    const gs = gsRef.current;
    if (!canvas || !gs) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw slash lines
    gs.slashes = gs.slashes.filter(s => s.life > 0);
    for (const s of gs.slashes) {
      const alpha = Math.pow(Math.max(0, s.life), 0.6);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width * Math.max(0.3, s.life);
      ctx.lineCap = 'round';
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 12 * s.life;
      const half = (s.length / 2) * Math.min(1, (1 - s.life) * 4 + 0.2); // grow then stay
      ctx.beginPath();
      ctx.moveTo(s.x - Math.cos(s.angle) * half, s.y - Math.sin(s.angle) * half);
      ctx.lineTo(s.x + Math.cos(s.angle) * half, s.y + Math.sin(s.angle) * half);
      ctx.stroke();
      s.life -= s.decay * dt;
    }
    ctx.shadowBlur = 0;

    // Draw particles
    gs.particles = gs.particles.filter(p => p.life > 0);
    for (const p of gs.particles) {
      p.x  += p.vx * dt;
      p.y  += p.vy * dt;
      p.vy += 200 * dt; // gravity
      p.life -= p.decay * dt;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * Math.max(0.1, p.life), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // ── Build initial fruit pool ─────────────────────────────────────────────────
  function buildFruitPool(q, maxFruits) {
    const wrongs = buildWrongValues(q.answer, maxFruits - 1);
    const all = shuffle([
      { value: q.answer, isCorrect: true },
      ...wrongs.map(v => ({ value: v, isCorrect: false })),
    ]);
    let id = gsRef.current ? gsRef.current.nextId++ : 0;
    return all.map(item => {
      const f = spawnFruit(id++, item.value, item.isCorrect);
      return f;
    });
  }

  // ── End game ────────────────────────────────────────────────────────────────
  function endGame() {
    const gs = gsRef.current;
    if (!gs) return;
    gs.running = false;
    cancelAnimationFrame(animRef.current);
    const finalScore = gs.score;
    const finalLives = gs.lives;
    const stars = finalLives >= MAX_LIVES ? 3 : finalLives >= 1 ? 2 : 1;
    const secs = elapsedSecs();
    // Custom mode (0) counts as level 1 for progression tracking
    const result = saveSession({ score: finalScore, level: selectedLevel || 1, stars });
    setHudState({ score: finalScore, lives: finalLives, streak: gs.streak, timeLeft: 0 });
    setSessionResult({ ...result, timeSecs: secs, stars, finalScore, finalLives });
    setPhase('results');
  }

  // ── Replace a fruit after it's tapped correctly ─────────────────────────────
  function refreshFruitsForNewQuestion(newQ, tappedId) {
    const gs = gsRef.current;
    // Remove tapped fruit
    const tappedFruit = gs.fruits.find(f => f.id === tappedId);
    if (tappedFruit) { tappedFruit.state = 'popping'; tappedFruit.stateTimer = 0.35; }

    // Update living fruits: clear isCorrect, ensure no accidental match
    const living = gs.fruits.filter(f => f.state === 'alive' && f.id !== tappedId);

    // Fix values that accidentally match new answer
    const wrongPool = buildWrongValues(newQ.answer, living.length + 5);
    let wrongIdx = 0;
    living.forEach(f => {
      if (f.value === newQ.answer) {
        f.value = wrongPool[wrongIdx++] ?? (newQ.answer + wrongIdx + 5);
        f.isCorrect = false;
      } else {
        f.isCorrect = false;
      }
    });

    // Assign new correct answer to a random living fruit
    if (living.length > 0) {
      const target = pick(living);
      target.value = newQ.answer;
      target.isCorrect = true;
      // Update its label in DOM
      const el = fruitElsRef.current.get(target.id);
      if (el) {
        const valEl = el.querySelector('.nf-fruit__val');
        if (valEl) valEl.textContent = target.value;
      }
    }

    // Update all other fruit DOM labels
    living.forEach(f => {
      const el = fruitElsRef.current.get(f.id);
      if (el) {
        const valEl = el.querySelector('.nf-fruit__val');
        if (valEl) valEl.textContent = f.value;
      }
    });

    // Spawn replacements only up to the level's fruit limit
    const aliveNow = gs.fruits.filter(f => f.state === 'alive').length;
    const needed = gs.maxFruits - aliveNow;
    for (let i = 0; i < Math.max(0, needed); i++) {
      const v = wrongPool[wrongIdx++] ?? (newQ.answer + wrongIdx + 10);
      gs.fruits.push(spawnFruit(gs.nextId++, v, false));
    }

    setQuestion({ ...newQ });
  }

  // ── Handle tap ──────────────────────────────────────────────────────────────
  const handleTap = useCallback((id, isCorrect, isSpecial, specialType, px, py) => {
    if (lockedRef.current) return;
    const gs = gsRef.current;
    if (!gs || !gs.running) return;

    if (isSpecial) {
      const item = gs.specials.find(s => s.id === id);
      if (!item || item.state !== 'alive') return;
      item.state = 'popping'; item.stateTimer = 0.3;
      spawnSlash(px, py, true);
      spawnParticles(px, py, ['#fcd34d','#f59e0b','#fb923c'], 12);

      if (specialType === 'star')  { gs.score += 50; showMascot('star'); }
      else if (specialType === 'heart') { gs.lives = Math.min(MAX_LIVES + 1, gs.lives + 1); showMascot('heart'); }
      else if (specialType === 'clock') { gs.timeLeft = Math.min(gs.timeLeft + 10, 90); showMascot('clock'); }
      else if (specialType === 'bomb')  { gs.lives -= 1; triggerWrong(); showMascot('bomb'); if (gs.lives <= 0) { endGame(); return; } }
      else if (specialType === 'coin')  { gs.score += 20; showMascot('coin'); }
      return;
    }

    const fruit = gs.fruits.find(f => f.id === id);
    if (!fruit || fruit.state !== 'alive') return;

    if (isCorrect) {
      gs.score += 10 * (gs.streak >= 9 ? 3 : gs.streak >= 4 ? 2 : 1);
      gs.streak++;
      triggerCorrect();
      triggerScore(`+${gs.streak >= 5 ? 30 : gs.streak >= 2 ? 20 : 10}`);
      spawnSlash(px, py, true);
      spawnFruitHalves(px, py, fruit.emoji);
      spawnParticles(px, py, PARTICLE_COLORS_CORRECT, 22);

      if (gs.streak >= 10) { triggerCombo(gs.streak); showCombo('⚡ INCROYABLE ×10 !!'); showMascot('combo10'); }
      else if (gs.streak >= 5) { triggerCombo(gs.streak); showCombo(`⭐ COMBO ×${gs.streak} !`); showMascot('combo5'); }
      else if (gs.streak >= 3) { showCombo(`🔥 COMBO ×${gs.streak} !`); showMascot('combo3'); }
      else { showMascot('correct'); }

      const newQ = makeQuestion(level.ops, level.max);
      gs.question = newQ;
      refreshFruitsForNewQuestion(newQ, id);
    } else {
      gs.streak = 0;
      gs.lives -= 1;
      triggerWrong();
      spawnSlash(px, py, false);
      spawnFruitHalves(px, py, fruit.emoji);
      spawnParticles(px, py, PARTICLE_COLORS_WRONG, 12);
      showMascot('wrong');

      // Flash correct fruit
      const correctFruit = gs.fruits.find(f => f.isCorrect && f.state === 'alive');
      if (correctFruit) {
        const el = fruitElsRef.current.get(correctFruit.id);
        if (el) {
          el.classList.add('nf-fruit--reveal');
          setTimeout(() => el.classList.remove('nf-fruit--reveal'), 800);
        }
      }

      if (gs.lives <= 0) { endGame(); return; }
    }
  }, [level]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Main game loop ───────────────────────────────────────────────────────────
  const gameLoop = useCallback((ts) => {
    const gs = gsRef.current;
    if (!gs || !gs.running) return;

    const rawDt = ts - gs.lastTs;
    gs.lastTs = ts;
    if (rawDt > 200) { animRef.current = requestAnimationFrame(gameLoop); return; } // skip first frame
    const dt = Math.min(rawDt / 1000, 0.05);

    // Timer
    gs.timeLeft = Math.max(0, gs.timeLeft - dt);
    if (gs.timeLeft <= 0) { endGame(); return; }

    // Special item spawn
    gs.specialTimer -= dt;
    if (gs.specialTimer <= 0) {
      gs.specialTimer = SPECIAL_INTERVAL + rnd(-3, 3);
      const s = spawnSpecial(gs.nextId++);
      gs.specials.push(s);
    }

    // Auto-fill fruits up to the level's limit
    const aliveFruits = gs.fruits.filter(f => f.state === 'alive').length;
    if (aliveFruits < gs.maxFruits) {
      const v = pick(buildWrongValues(gs.question.answer, 3));
      gs.fruits.push(spawnFruit(gs.nextId++, v, false));
    }

    const now = ts / 1000;

    // Update fruits
    for (const f of gs.fruits) {
      if (f.state === 'gone') continue;

      if (f.state === 'popping') {
        f.stateTimer -= dt;
        const el = fruitElsRef.current.get(f.id);
        if (el) {
          const p = Math.max(0, f.stateTimer / 0.35);
          el.style.opacity = p;
          el.style.transform = `scale(${1 + (1-p) * 0.6}) rotate(${f.rotation}deg)`;
        }
        if (f.stateTimer <= 0) {
          f.state = 'gone';
          const el2 = fruitElsRef.current.get(f.id);
          if (el2) el2.style.display = 'none';
        }
        continue;
      }

      // Physics
      f.x += f.vx * dt;
      f.y += f.vy * dt;
      f.rotation += f.rotSpeed * dt;

      // Bounce off walls
      if (f.x < 2) { f.x = 2; f.vx = Math.abs(f.vx) * (0.85 + rnd(0,.15)); }
      if (f.x > 88) { f.x = 88; f.vx = -Math.abs(f.vx) * (0.85 + rnd(0,.15)); }
      if (f.y < 2) { f.y = 2; f.vy = Math.abs(f.vy) * (0.85 + rnd(0,.15)); }
      if (f.y > 82) { f.y = 82; f.vy = -Math.abs(f.vy) * (0.85 + rnd(0,.15)); }

      // Bob
      const bob = Math.sin(now * (0.9 + f.phase * 0.3) + f.phase) * 1.5;

      const el = fruitElsRef.current.get(f.id);
      if (el) {
        el.style.left = `${f.x}%`;
        el.style.top = `${f.y + bob}%`;
        el.style.transform = `rotate(${f.rotation}deg)`;
      }
    }

    // Update specials
    for (const s of gs.specials) {
      if (s.state === 'gone') continue;
      if (s.state === 'popping') {
        s.stateTimer -= dt;
        const el = specialElsRef.current.get(s.id);
        if (el) {
          const p = Math.max(0, s.stateTimer / 0.3);
          el.style.opacity = p;
          el.style.transform = `scale(${1.5 - p * 0.5}) rotate(${s.rotation}deg)`;
        }
        if (s.stateTimer <= 0) {
          s.state = 'gone';
          const el2 = specialElsRef.current.get(s.id);
          if (el2) el2.style.display = 'none';
        }
        continue;
      }

      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.rotation += s.rotSpeed * dt;

      if (s.x < 2) { s.x = 2; s.vx = Math.abs(s.vx); }
      if (s.x > 88) { s.x = 88; s.vx = -Math.abs(s.vx); }
      if (s.y < 2) { s.y = 2; s.vy = Math.abs(s.vy); }
      if (s.y > 80) { s.y = 80; s.vy = -Math.abs(s.vy); }

      const bob = Math.sin(now * 1.2 + s.phase) * 2;
      const el = specialElsRef.current.get(s.id);
      if (el) {
        el.style.left = `${s.x}%`;
        el.style.top = `${s.y + bob}%`;
        el.style.transform = `rotate(${s.rotation}deg)`;
      }
    }

    // Clean up gone items
    if (gs.fruits.length > 80)  gs.fruits  = gs.fruits.filter(f => f.state !== 'gone');
    if (gs.specials.length > 20) gs.specials = gs.specials.filter(s => s.state !== 'gone');

    // Canvas particles
    updateCanvas(dt);

    // HUD sync
    gs.hudTimer -= dt;
    if (gs.hudTimer <= 0) {
      gs.hudTimer = HUD_REFRESH;
      setHudState({
        score:    gs.score,
        lives:    gs.lives,
        streak:   gs.streak,
        timeLeft: Math.max(0, Math.ceil(gs.timeLeft)),
      });
    }

    animRef.current = requestAnimationFrame(gameLoop);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Start ────────────────────────────────────────────────────────────────────
  function startGame() {
    if (selectedLevel === CUSTOM_LEVEL) {
      saveCustomConfig({ ops: customOps.length ? customOps : ['+'], max: customMax, speed: customSpeed });
    }
    cancelAnimationFrame(animRef.current);
    fruitElsRef.current.clear();
    specialElsRef.current.clear();

    const q = makeQuestion(level.ops, level.max);
    const fruits = buildFruitPool(q, level.maxFruits);
    let idCounter = fruits.length;

    gsRef.current = {
      running: true,
      fruits,
      specials: [],
      particles: [],
      slashes: [],
      question: q,
      score: 0,
      lives: MAX_LIVES,
      streak: 0,
      timeLeft: level.speed,
      nextId: idCounter,
      lastTs: 0,
      hudTimer: 0,
      specialTimer: SPECIAL_INTERVAL,
      maxFruits: level.maxFruits,
    };

    setQuestion({ ...q });
    setHudState({ score: 0, lives: MAX_LIVES, streak: 0, timeLeft: level.speed });
    setMascotMsg(null);
    setComboMsg(null);
    setSessionResult(null);
    resetTimer();
    showMascot('start');
    setPhase('play');

    // Resize canvas
    requestAnimationFrame(ts => {
      const arena = arenaRef.current;
      const canvas = canvasRef.current;
      if (arena && canvas) {
        canvas.width = arena.offsetWidth;
        canvas.height = arena.offsetHeight;
      }
      gsRef.current.lastTs = ts;
      animRef.current = requestAnimationFrame(gameLoop);
    });
  }

  useEffect(() => () => {
    cancelAnimationFrame(animRef.current);
    clearTimeout(mascotTimerRef.current);
    clearTimeout(comboTimerRef.current);
  }, []);

  // ── Timer color ───────────────────────────────────────────────────────────────
  const timerColor = hudState.timeLeft <= 10 ? '#ef4444' : hudState.timeLeft <= 20 ? '#f97316' : '#fff';

  // ─────────────────────────────────────────────────────────────────────────────
  // SETUP PHASE
  // ─────────────────────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="nf-page nf-page--setup">
        <Link to="/jeux" className="exam-back-btn">←</Link>

        <div className="nf-setup-hero">
          <div className="nf-setup-bg-fruits" aria-hidden="true">
            {['🍉','🍊','🍇','🍓','🥭','🍍','🍒','🥝'].map((e,i) => (
              <span key={i} className="nf-deco-fruit" style={{ '--i': i }}>{e}</span>
            ))}
          </div>
          <div className="nf-setup-ninja">🥷</div>
          <h1 className="nf-setup-title">Ninja Fruits</h1>
          <p className="nf-setup-sub">Tranche la bonne réponse !</p>
        </div>

        <div className="nf-setup-stats">
          <div className="nf-setup-stat"><span className="nf-setup-stat__val">{progress.bestScore||0}</span><span className="nf-setup-stat__lbl">Record</span></div>
          <div className="nf-setup-stat"><span className="nf-setup-stat__val">{progress.sessionsPlayed||0}</span><span className="nf-setup-stat__lbl">Parties</span></div>
          <div className="nf-setup-stat"><span className="nf-setup-stat__val">{formatDuration(progress.totalTimeSecs||0)}</span><span className="nf-setup-stat__lbl">Temps</span></div>
        </div>

        <div className="nf-level-grid">
          {LEVELS.map((l, i) => {
            const lvl = i + 1;
            const locked = lvl > (progress.unlockedLevel ?? 1);
            return (
              <button
                key={lvl}
                className={`nf-level-btn${selectedLevel===lvl?' nf-level-btn--active':''}${locked?' nf-level-btn--locked':''}`}
                onPointerDown={e => { e.preventDefault(); if (!locked) { setSelectedLevel(lvl); setShowCustom(false); } }}
              >
                {locked ? '🔒' : `Niv. ${lvl}`}
                {!locked && progress.bestLevel >= lvl && <span className="nf-level-star">⭐</span>}
              </button>
            );
          })}
          <button
            className={`nf-level-btn nf-level-btn--custom${selectedLevel===CUSTOM_LEVEL?' nf-level-btn--active':''}`}
            onPointerDown={e => { e.preventDefault(); setSelectedLevel(CUSTOM_LEVEL); setShowCustom(true); }}
          >
            ⚙️
          </button>
        </div>

        {/* ── Custom panel ── */}
        {showCustom && (
          <div className="nf-custom-panel">
            <p className="nf-custom-panel__title">⚙️ Personnaliser</p>

            <div className="nf-custom-section">
              <span className="nf-custom-label">Opérations</span>
              <div className="nf-custom-ops">
                {ALL_OPS.map(op => (
                  <button
                    key={op}
                    type="button"
                    className={`nf-custom-op-btn${customOps.includes(op) ? ' nf-custom-op-btn--on' : ''}`}
                    onPointerDown={e => {
                      e.preventDefault();
                      setCustomOps(prev => {
                        const next = prev.includes(op) ? prev.filter(o => o !== op) : [...prev, op];
                        return next.length ? next : [op]; // always keep at least one
                      });
                    }}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            <div className="nf-custom-section">
              <span className="nf-custom-label">Nombres jusqu'à</span>
              <div className="nf-custom-row">
                {MAX_OPTIONS.map(n => (
                  <button
                    key={n}
                    type="button"
                    className={`nf-custom-chip${customMax===n ? ' nf-custom-chip--on' : ''}`}
                    onPointerDown={e => { e.preventDefault(); setCustomMax(n); }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="nf-custom-section">
              <span className="nf-custom-label">Vitesse</span>
              <div className="nf-custom-row">
                {SPEED_OPTIONS.map(s => (
                  <button
                    key={s.value}
                    type="button"
                    className={`nf-custom-chip${customSpeed===s.value ? ' nf-custom-chip--on' : ''}`}
                    onPointerDown={e => { e.preventDefault(); setCustomSpeed(s.value); }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="nf-custom-preview">
              {(customOps.length ? customOps : ['+']).join(' · ')} &nbsp;·&nbsp; max {customMax} &nbsp;·&nbsp; {SPEED_OPTIONS.find(s=>s.value===customSpeed)?.label ?? customSpeed + 's'}
            </p>
          </div>
        )}

        <p className="nf-level-desc">
          {selectedLevel === CUSTOM_LEVEL
            ? `Personnalisé — ${(customOps.length ? customOps : ['+']).join(' ')} — max ${customMax}`
            : `${level.label} — ${level.ops.join(' ')} — ${level.speed}s`}
        </p>

        <button className="nf-start-btn" onPointerDown={e => { e.preventDefault(); startGame(); }}>
          ⚔️ Jouer
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RESULTS PHASE
  // ─────────────────────────────────────────────────────────────────────────────
  if (phase === 'results') {
    const stars = sessionResult?.stars ?? 1;
    const emoji = stars === 3 ? '🏆' : stars === 2 ? '🎉' : '📚';
    const title = stars === 3 ? 'Parfait !' : stars === 2 ? 'Bien joué !' : 'Continue !';
    return (
      <div className="nf-page">
        <GameFeedback ref={feedbackRef} />
        <div className="game-results">
          <div className="game-results__emoji">{emoji}</div>
          <div className="game-results__title">{title}</div>
          <div className="game-results__stars">{'★'.repeat(stars)}{'☆'.repeat(3-stars)}</div>
          {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
          {sessionResult?.newUnlocked && <div className="jeux-unlocked">🔓 Niveau {selectedLevel+1} débloqué !</div>}
          <div className="game-results__stats">
            <div className="game-results__stat">
              <span className="game-results__stat-val">{sessionResult?.finalScore ?? 0}</span>
              <span className="game-results__stat-lbl">Score</span>
            </div>
            <div className="game-results__stat">
              <span className="game-results__stat-val">{sessionResult?.finalLives ?? 0}</span>
              <span className="game-results__stat-lbl">Vies</span>
            </div>
          </div>
          <button className="game-results__btn" onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <button className="game-results__btn game-results__btn--soft" onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}>Niveaux</button>
          <Link to="/jeux" className="game-results__btn game-results__btn--soft" style={{ display:'block',textAlign:'center',textDecoration:'none' }}>← Jeux</Link>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PLAY PHASE
  // ─────────────────────────────────────────────────────────────────────────────
  const gs = gsRef.current;
  const allItems = gs ? [
    ...gs.fruits.filter(f => f.state !== 'gone'),
    ...gs.specials.filter(s => s.state !== 'gone'),
  ] : [];

  return (
    <div className="nf-page">
      <GameFeedback ref={feedbackRef} />

      {/* ── HUD ── */}
      <div className="nf-hud">
        <div className="nf-hud__lives">
          {'❤️'.repeat(Math.max(0, hudState.lives))}
          {'🖤'.repeat(Math.max(0, MAX_LIVES - hudState.lives))}
        </div>
        <div className="nf-hud__center">
          {hudState.streak >= 2 && (
            <span className="nf-hud__streak">🔥 ×{hudState.streak}</span>
          )}
        </div>
        <div className="nf-hud__right">
          <span className="nf-hud__score">⭐ {hudState.score}</span>
          <span className="nf-hud__timer" style={{ color: timerColor }}>
            ⏱ {hudState.timeLeft}s
          </span>
        </div>
      </div>

      {/* ── Question banner ── */}
      <div className="nf-banner">
        <div className="nf-banner__ninja">🥷</div>
        <div className="nf-banner__body">
          <span className="nf-banner__label">Mission</span>
          <span className="nf-banner__question">{question?.text}</span>
        </div>
      </div>

      {/* ── Combo message ── */}
      {comboMsg && (
        <div className="nf-combo-msg" key={comboMsg}>{comboMsg}</div>
      )}

      {/* ── Arena ── */}
      <div className="nf-arena" ref={arenaRef}>
        <canvas className="nf-canvas" ref={canvasRef} />

        {/* Background deco */}
        <div className="nf-arena-bg" aria-hidden="true">
          <span className="nf-cloud nf-cloud--1">☁️</span>
          <span className="nf-cloud nf-cloud--2">⛅</span>
          <span className="nf-cloud nf-cloud--3">☁️</span>
        </div>

        {/* Render all items from gsRef directly on first render, update via DOM after */}
        {allItems.map(item => {
          if (item.isSpecial) {
            const st = SPECIAL_TYPES[item.type];
            return (
              <button
                key={`s-${item.id}`}
                className="nf-special"
                ref={el => {
                  if (el) specialElsRef.current.set(item.id, el);
                  else specialElsRef.current.delete(item.id);
                }}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  '--glow': st.shadowColor,
                }}
                onPointerDown={e => {
                  e.preventDefault();
                  const rect = arenaRef.current?.getBoundingClientRect();
                  const px = e.clientX - (rect?.left ?? 0);
                  const py = e.clientY - (rect?.top ?? 0);
                  handleTap(item.id, false, true, item.type, px, py);
                }}
              >
                <span className="nf-special__emoji">{st.emoji}</span>
              </button>
            );
          }

          return (
            <button
              key={`f-${item.id}`}
              className={`nf-fruit${item.isCorrect ? ' nf-fruit--correct-hint' : ''}`}
              ref={el => {
                if (el) fruitElsRef.current.set(item.id, el);
                else fruitElsRef.current.delete(item.id);
              }}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              onPointerDown={e => {
                e.preventDefault();
                const rect = arenaRef.current?.getBoundingClientRect();
                const px = e.clientX - (rect?.left ?? 0);
                const py = e.clientY - (rect?.top ?? 0);
                handleTap(item.id, item.isCorrect, false, null, px, py);
              }}
            >
              <span className="nf-fruit__emoji">{item.emoji}</span>
              <span className="nf-fruit__val">{item.value}</span>
            </button>
          );
        })}
      </div>

      {/* ── Mascot ── */}
      <div className="nf-mascot">
        <span className="nf-mascot__emoji">🥷</span>
        {mascotMsg && (
          <span className="nf-mascot__bubble" key={mascotMsg}>{mascotMsg}</span>
        )}
      </div>
    </div>
  );
}
