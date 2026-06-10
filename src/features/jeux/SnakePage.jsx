import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { saveGameSession, getGameProgress } from '../../services/storage/gameProgressStore.js';
import { GameFeedback, useGameFeedback } from './GameFeedback.jsx';
import GameFullScreenWrapper from '../../shared/ui/GameFullScreenWrapper.jsx';
import './jeux.css';

// ─── i18n ────────────────────────────────────────────────────────────────────
const UI = {
  fr: {
    back: '←',
    title: 'Snake Éducatif',
    scoreLabel: 'Score',
    levelLabel: 'Niveau',
    livesLabel: 'Vies',
    questionLabel: 'Trouve la bonne réponse !',
    startBtn: '▶ Jouer',
    pauseBtn: '⏸ Pause',
    resumeBtn: '▶ Reprendre',
    restartBtn: '↺ Rejouer',
    backToMenuBtn: '⌂ Menu',
    gameOver: 'Partie terminée !',
    newBest: '🏆 Nouveau record !',
    paused: 'En pause',
    levelLabel2: 'Niveau',
    levels: ['Facile', 'Moyen', 'Difficile'],
    variants: {
      math:   { name: 'Maths',      icon: '🔢', hint: 'Mange la bonne réponse' },
      word:   { name: 'Lettres',    icon: '🔤', hint: "Recueille les lettres dans l'ordre" },
      phrase: { name: 'Phrase',     icon: '📝', hint: 'Recueille les mots dans l\'ordre' },
      color:  { name: 'Couleurs',   icon: '🎨', hint: 'Mange le bon objet' },
      multi:  { name: 'Tables',     icon: '✖️',  hint: 'Résous la multiplication' },
    },
    correct: ['Bravo !', 'Super !', 'Excellent !', 'Parfait !'],
    wrong:   ['Raté !', 'Essaie encore !', 'Attention !'],
    stars: (n) => '⭐'.repeat(n) + '☆'.repeat(3 - n),
  },
  nl: {
    back: '←',
    title: 'Educatieve Snake',
    scoreLabel: 'Score',
    levelLabel: 'Niveau',
    livesLabel: 'Levens',
    questionLabel: 'Vind het juiste antwoord!',
    startBtn: '▶ Spelen',
    pauseBtn: '⏸ Pauze',
    resumeBtn: '▶ Hervatten',
    restartBtn: '↺ Opnieuw',
    backToMenuBtn: '⌂ Menu',
    gameOver: 'Spel voorbij!',
    newBest: '🏆 Nieuw record!',
    paused: 'Gepauzeerd',
    levelLabel2: 'Niveau',
    levels: ['Makkelijk', 'Gemiddeld', 'Moeilijk'],
    variants: {
      math:   { name: 'Rekenen',   icon: '🔢', hint: 'Eet het juiste antwoord' },
      word:   { name: 'Letters',   icon: '🔤', hint: 'Verzamel de letters op volgorde' },
      phrase: { name: 'Zinnen',    icon: '📝', hint: 'Verzamel de woorden op volgorde' },
      color:  { name: 'Kleuren',   icon: '🎨', hint: 'Eet het juiste object' },
      multi:  { name: 'Tafels',    icon: '✖️',  hint: 'Los de vermenigvuldiging op' },
    },
    correct: ['Goed zo!', 'Super!', 'Uitstekend!', 'Perfect!'],
    wrong:   ['Mis!', 'Probeer opnieuw!', 'Opgelet!'],
    stars: (n) => '⭐'.repeat(n) + '☆'.repeat(3 - n),
  },
  en: {
    back: '←',
    title: 'Educational Snake',
    scoreLabel: 'Score',
    levelLabel: 'Level',
    livesLabel: 'Lives',
    questionLabel: 'Find the right answer!',
    startBtn: '▶ Play',
    pauseBtn: '⏸ Pause',
    resumeBtn: '▶ Resume',
    restartBtn: '↺ Play again',
    backToMenuBtn: '⌂ Menu',
    gameOver: 'Game over!',
    newBest: '🏆 New record!',
    paused: 'Paused',
    levelLabel2: 'Level',
    levels: ['Easy', 'Medium', 'Hard'],
    variants: {
      math:   { name: 'Maths',    icon: '🔢', hint: 'Eat the correct answer' },
      word:   { name: 'Letters',  icon: '🔤', hint: 'Collect letters in order' },
      phrase: { name: 'Phrases',  icon: '📝', hint: 'Collect words in order' },
      color:  { name: 'Colors',   icon: '🎨', hint: 'Eat the right object' },
      multi:  { name: 'Tables',   icon: '✖️',  hint: 'Solve the multiplication' },
    },
    correct: ['Great!', 'Super!', 'Excellent!', 'Perfect!'],
    wrong:   ['Missed!', 'Try again!', 'Watch out!'],
    stars: (n) => '⭐'.repeat(n) + '☆'.repeat(3 - n),
  },
  es: {
    back: '←',
    title: 'Snake Educativo',
    scoreLabel: 'Puntos',
    levelLabel: 'Nivel',
    livesLabel: 'Vidas',
    questionLabel: '¡Encuentra la respuesta correcta!',
    startBtn: '▶ Jugar',
    pauseBtn: '⏸ Pausa',
    resumeBtn: '▶ Continuar',
    restartBtn: '↺ Jugar de nuevo',
    backToMenuBtn: '⌂ Menú',
    gameOver: '¡Fin del juego!',
    newBest: '🏆 ¡Nuevo récord!',
    paused: 'En pausa',
    levelLabel2: 'Nivel',
    levels: ['Fácil', 'Medio', 'Difícil'],
    variants: {
      math:   { name: 'Mates',    icon: '🔢', hint: 'Come la respuesta correcta' },
      word:   { name: 'Letras',   icon: '🔤', hint: 'Recoge las letras en orden' },
      phrase: { name: 'Frases',   icon: '📝', hint: 'Recoge las palabras en orden' },
      color:  { name: 'Colores',  icon: '🎨', hint: 'Come el objeto correcto' },
      multi:  { name: 'Tablas',   icon: '✖️',  hint: 'Resuelve la multiplicación' },
    },
    correct: ['¡Bravo!', '¡Súper!', '¡Excelente!', '¡Perfecto!'],
    wrong:   ['¡Fallaste!', '¡Inténtalo!', '¡Cuidado!'],
    stars: (n) => '⭐'.repeat(n) + '☆'.repeat(3 - n),
  },
};

// ─── Question generators ──────────────────────────────────────────────────────
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - .5);

function genMathQuestion(level) {
  const ops = level === 0 ? ['+', '-'] : level === 1 ? ['+', '-', '×'] : ['+', '-', '×', '÷'];
  const op = pick(ops);
  let a, b, answer, display;
  if (op === '+') { a = rand(1, level === 0 ? 10 : 50); b = rand(1, level === 0 ? 10 : 50); answer = a + b; display = `${a} + ${b}`; }
  else if (op === '-') { a = rand(1, level === 0 ? 15 : 50); b = rand(1, a); answer = a - b; display = `${a} - ${b}`; }
  else if (op === '×') { a = rand(2, level === 1 ? 5 : 9); b = rand(2, level === 1 ? 5 : 9); answer = a * b; display = `${a} × ${b}`; }
  else { a = rand(2, 9); b = rand(2, 9); answer = a * b; display = `${a * b} ÷ ${a}`; answer = b; }
  const wrong = shuffle([...new Set([answer + rand(1,5), answer - rand(1,5), answer + rand(6,12), answer * 2].filter(x => x > 0 && x !== answer))]).slice(0, 3);
  return { display, answer: String(answer), distractors: wrong.map(String), type: 'math' };
}

function genMultiQuestion(level) {
  const tables = level === 0 ? [2,3,4,5] : level === 1 ? [3,4,5,6,7] : [6,7,8,9];
  const a = pick(tables), b = rand(2, 10);
  const answer = a * b;
  const wrong = shuffle([...new Set([answer + a, answer - a, answer + b, answer * 2].filter(x => x > 0 && x !== answer))]).slice(0, 3);
  return { display: `${a} × ${b}`, answer: String(answer), distractors: wrong.map(String), type: 'multi' };
}

const WORD_POOLS = {
  fr: { 0: ['CHAT','CHIEN','LION','LOUP','VACHE'], 1: ['MAISON','SOLEIL','NUAGE','FLEUR','JARDIN'], 2: ['GUITARE','PAPILLON','CHOCOLAT','DINOSAURE','PRINCESSE'] },
  nl: { 0: ['KAT','HOND','LEEUW','WOLF','KOE'], 1: ['HUIS','ZON','WOLK','BLOEM','TUIN'], 2: ['GITAAR','VLINDER','CHOCOLA','DINOSAURUS','PRINSES'] },
  en: { 0: ['CAT','DOG','LION','WOLF','COW'], 1: ['HOUSE','SUN','CLOUD','FLOWER','GARDEN'], 2: ['GUITAR','BUTTERFLY','CHOCOLATE','DINOSAUR','PRINCESS'] },
  es: { 0: ['GATO','PERRO','LEON','LOBO','VACA'], 1: ['CASA','SOL','NUBE','FLOR','JARDIN'], 2: ['GUITARRA','MARIPOSA','CHOCOLATE','DINOSAURIO','PRINCESA'] },
};

function genWordQuestion(level, locale) {
  const pool = WORD_POOLS[locale]?.[level] || WORD_POOLS.fr[level];
  const word = pick(pool);
  return { display: word, letters: word.split(''), currentIndex: 0, type: 'word' };
}

const PHRASE_POOLS = {
  fr: [
    ['Le', 'chat', 'mange', 'du', 'poisson'],
    ['Il', 'fait', 'beau', "aujourd'hui"],
    ["J'aime", 'les', 'mathématiques'],
    ['La', 'maison', 'est', 'grande'],
  ],
  nl: [
    ['De', 'kat', 'eet', 'vis'],
    ['Het', 'is', 'mooi', 'weer'],
    ['Ik', 'hou', 'van', 'wiskunde'],
    ['Het', 'huis', 'is', 'groot'],
  ],
  en: [
    ['The', 'cat', 'eats', 'fish'],
    ['The', 'weather', 'is', 'nice'],
    ['I', 'love', 'mathematics'],
    ['The', 'house', 'is', 'big'],
  ],
  es: [
    ['El', 'gato', 'come', 'pescado'],
    ['Hace', 'buen', 'tiempo'],
    ['Me', 'gustan', 'las', 'matemáticas'],
    ['La', 'casa', 'es', 'grande'],
  ],
};

function genPhraseQuestion(level, locale) {
  const pool = PHRASE_POOLS[locale] || PHRASE_POOLS.fr;
  const words = pick(pool);
  return { display: words.join(' '), words, currentIndex: 0, type: 'phrase' };
}

const COLOR_ITEMS = {
  fr: [
    { question: 'Mange le ROUGE 🔴', answer: '🔴', distractors: ['🔵','🟡','🟢'] },
    { question: 'Mange le BLEU 🔵', answer: '🔵', distractors: ['🔴','🟡','🟢'] },
    { question: 'Mange le VERT 🟢', answer: '🟢', distractors: ['🔴','🔵','🟡'] },
    { question: 'Mange le JAUNE 🟡', answer: '🟡', distractors: ['🔴','🔵','🟢'] },
    { question: 'Mange la POMME 🍎', answer: '🍎', distractors: ['🍌','🍇','🍊'] },
    { question: 'Mange la BANANE 🍌', answer: '🍌', distractors: ['🍎','🍇','🍊'] },
  ],
  nl: [
    { question: 'Eet ROOD 🔴', answer: '🔴', distractors: ['🔵','🟡','🟢'] },
    { question: 'Eet BLAUW 🔵', answer: '🔵', distractors: ['🔴','🟡','🟢'] },
    { question: 'Eet GROEN 🟢', answer: '🟢', distractors: ['🔴','🔵','🟡'] },
    { question: 'Eet GEEL 🟡', answer: '🟡', distractors: ['🔴','🔵','🟢'] },
    { question: 'Eet APPEL 🍎', answer: '🍎', distractors: ['🍌','🍇','🍊'] },
    { question: 'Eet BANAAN 🍌', answer: '🍌', distractors: ['🍎','🍇','🍊'] },
  ],
  en: [
    { question: 'Eat RED 🔴', answer: '🔴', distractors: ['🔵','🟡','🟢'] },
    { question: 'Eat BLUE 🔵', answer: '🔵', distractors: ['🔴','🟡','🟢'] },
    { question: 'Eat GREEN 🟢', answer: '🟢', distractors: ['🔴','🔵','🟡'] },
    { question: 'Eat YELLOW 🟡', answer: '🟡', distractors: ['🔴','🔵','🟢'] },
    { question: 'Eat the APPLE 🍎', answer: '🍎', distractors: ['🍌','🍇','🍊'] },
    { question: 'Eat the BANANA 🍌', answer: '🍌', distractors: ['🍎','🍇','🍊'] },
  ],
  es: [
    { question: 'Come ROJO 🔴', answer: '🔴', distractors: ['🔵','🟡','🟢'] },
    { question: 'Come AZUL 🔵', answer: '🔵', distractors: ['🔴','🟡','🟢'] },
    { question: 'Come VERDE 🟢', answer: '🟢', distractors: ['🔴','🔵','🟡'] },
    { question: 'Come AMARILLO 🟡', answer: '🟡', distractors: ['🔴','🔵','🟢'] },
    { question: 'Come la MANZANA 🍎', answer: '🍎', distractors: ['🍌','🍇','🍊'] },
    { question: 'Come el PLÁTANO 🍌', answer: '🍌', distractors: ['🍎','🍇','🍊'] },
  ],
};

function genColorQuestion(locale) {
  const pool = COLOR_ITEMS[locale] || COLOR_ITEMS.fr;
  return { ...pick(pool), type: 'color' };
}

function generateQuestion(variant, level, locale) {
  switch (variant) {
    case 'math':   return genMathQuestion(level);
    case 'multi':  return genMultiQuestion(level);
    case 'word':   return genWordQuestion(level, locale);
    case 'phrase': return genPhraseQuestion(level, locale);
    case 'color':  return genColorQuestion(locale);
    default:       return genMathQuestion(level);
  }
}

// ─── Canvas renderer ──────────────────────────────────────────────────────────
const CELL = 24;
const COLORS = {
  bg: '#0e0b2a',
  grid: 'rgba(255,255,255,.04)',
  head: '#22c55e',
  headStroke: '#16a34a',
  body: '#4ade80',
  bodyStroke: '#22c55e',
  correct: '#fcd34d',
  wrong: '#ef4444',
  neutral: '#a78bfa',
  text: '#fff',
  textShadow: '#0e0b2a',
};

function drawSnake(ctx, snake, cellSize) {
  snake.forEach((seg, i) => {
    const x = seg.x * cellSize, y = seg.y * cellSize;
    const r = i === 0 ? 8 : 6;
    ctx.fillStyle = i === 0 ? COLORS.head : COLORS.body;
    ctx.strokeStyle = i === 0 ? COLORS.headStroke : COLORS.bodyStroke;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x + 2, y + 2, cellSize - 4, cellSize - 4, r);
    ctx.fill();
    ctx.stroke();
    if (i === 0) {
      const eyeOffset = cellSize * 0.28;
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(x + eyeOffset, y + eyeOffset, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + cellSize - eyeOffset, y + eyeOffset, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0e0b2a';
      ctx.beginPath(); ctx.arc(x + eyeOffset, y + eyeOffset, 1.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + cellSize - eyeOffset, y + eyeOffset, 1.5, 0, Math.PI * 2); ctx.fill();
    }
  });
}

function drawFood(ctx, items, cellSize) {
  items.forEach(item => {
    const x = item.x * cellSize + cellSize / 2;
    const y = item.y * cellSize + cellSize / 2;
    ctx.fillStyle = item.isCorrect ? COLORS.correct : COLORS.wrong;
    if (item.isNeutral) ctx.fillStyle = COLORS.neutral;
    ctx.beginPath();
    ctx.arc(x, y, cellSize * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.text;
    ctx.font = `bold ${Math.max(11, cellSize * 0.45)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const maxLen = 5;
    const label = item.label.length > maxLen ? item.label.slice(0, maxLen - 1) + '…' : item.label;
    ctx.fillText(label, x, y);
  });
}

function drawGrid(ctx, cols, rows, cellSize) {
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  for (let c = 0; c <= cols; c++) {
    ctx.beginPath(); ctx.moveTo(c * cellSize, 0); ctx.lineTo(c * cellSize, rows * cellSize); ctx.stroke();
  }
  for (let r = 0; r <= rows; r++) {
    ctx.beginPath(); ctx.moveTo(0, r * cellSize); ctx.lineTo(cols * cellSize, r * cellSize); ctx.stroke();
  }
}

// ─── Game constants ───────────────────────────────────────────────────────────
const SPEEDS = [220, 160, 110];
const LIVES = 3;
const GRID_COLS = 20;
const GRID_ROWS = 18;

// ─── Main component ───────────────────────────────────────────────────────────
export default function SnakePage() {
  const { locale } = useLocale();
  const ui = UI[locale] || UI.fr;

  const [phase, setPhase] = useState('menu');
  const [variant, setVariant] = useState('math');
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [isNewBest, setIsNewBest] = useState(false);
  const [flashClass, setFlashClass] = useState('');

  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const animRef = useRef(null);
  const lastTickRef = useRef(0);
  const { feedbackRef, triggerCorrect, triggerWrong } = useGameFeedback();

  const progress = getGameProgress('snake');

  const [question, setQuestion] = useState(null);
  const questionRef = useRef(null);

  function nextQuestion() {
    const q = generateQuestion(variant, level, locale);
    setQuestion(q);
    questionRef.current = q;
    return q;
  }

  function spawnFood(q, snake, existing = []) {
    const occupied = new Set([
      ...snake.map(s => `${s.x},${s.y}`),
      ...existing.map(f => `${f.x},${f.y}`),
    ]);

    function freeCell() {
      let cell, tries = 0;
      do {
        cell = { x: rand(0, GRID_COLS - 1), y: rand(0, GRID_ROWS - 1) };
        tries++;
      } while (occupied.has(`${cell.x},${cell.y}`) && tries < 200);
      occupied.add(`${cell.x},${cell.y}`);
      return cell;
    }

    if (q.type === 'math' || q.type === 'multi' || q.type === 'color') {
      const all = shuffle([
        { label: q.answer, isCorrect: true },
        ...q.distractors.map(d => ({ label: d, isCorrect: false })),
      ]);
      return all.map(item => ({ ...freeCell(), ...item }));
    }

    if (q.type === 'word') {
      const nextLetter = q.letters[q.currentIndex];
      const wrongs = shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(l => l !== nextLetter)).slice(0, 3);
      return shuffle([
        { ...freeCell(), label: nextLetter, isCorrect: true },
        ...wrongs.map(w => ({ ...freeCell(), label: w, isCorrect: false })),
      ]);
    }

    if (q.type === 'phrase') {
      const nextWord = q.words[q.currentIndex];
      const others = q.words.filter((_, i) => i !== q.currentIndex);
      const wrongs = shuffle([...others, 'le', 'la', 'et', 'de', 'un'].filter(w => w !== nextWord)).slice(0, 3);
      return shuffle([
        { ...freeCell(), label: nextWord, isCorrect: true },
        ...wrongs.map(w => ({ ...freeCell(), label: w, isCorrect: false })),
      ]);
    }

    return [];
  }

  function initState(q) {
    const snake = [
      { x: 10, y: 9 }, { x: 9, y: 9 }, { x: 8, y: 9 },
    ];
    const food = spawnFood(q, snake);
    stateRef.current = {
      snake,
      dir: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      food,
      score: 0,
      lives: LIVES,
      growing: 0,
      question: q,
    };
  }

  function tick(now) {
    if (!stateRef.current) return;
    const speed = SPEEDS[level];
    if (now - lastTickRef.current < speed) {
      animRef.current = requestAnimationFrame(tick);
      return;
    }
    lastTickRef.current = now;
    const s = stateRef.current;

    s.dir = { ...s.nextDir };
    const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };

    if (head.x < 0 || head.x >= GRID_COLS || head.y < 0 || head.y >= GRID_ROWS) {
      handleDeath();
      return;
    }
    if (s.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      handleDeath();
      return;
    }

    s.snake.unshift(head);
    if (s.growing > 0) { s.growing--; }
    else { s.snake.pop(); }

    const hitIndex = s.food.findIndex(f => f.x === head.x && f.y === head.y);
    if (hitIndex !== -1) {
      const hit = s.food[hitIndex];
      if (hit.isCorrect) {
        handleCorrect(hit);
      } else {
        handleWrong();
      }
    }

    draw();
    animRef.current = requestAnimationFrame(tick);
  }

  function handleCorrect() {
    const s = stateRef.current;
    const q = questionRef.current;
    s.growing += 2;

    if (q.type === 'word' || q.type === 'phrase') {
      const arr = q.type === 'word' ? q.letters : q.words;
      const newIndex = q.currentIndex + 1;
      if (newIndex >= arr.length) {
        const pts = 50 + level * 20;
        s.score += pts;
        setScore(s.score);
        setFlashClass('sn-flash-correct');
        setTimeout(() => setFlashClass(''), 400);
        triggerCorrect();
        const newQ = nextQuestion();
        s.question = newQ;
        questionRef.current = newQ;
        s.food = spawnFood(newQ, s.snake);
      } else {
        q.currentIndex = newIndex;
        questionRef.current = { ...q, currentIndex: newIndex };
        setQuestion({ ...q, currentIndex: newIndex });
        s.food = spawnFood(questionRef.current, s.snake);
        s.score += 10;
        setScore(s.score);
      }
    } else {
      const pts = 20 + level * 10;
      s.score += pts;
      setScore(s.score);
      setFlashClass('sn-flash-correct');
      setTimeout(() => setFlashClass(''), 400);
      triggerCorrect();
      const newQ = nextQuestion();
      s.question = newQ;
      questionRef.current = newQ;
      s.food = spawnFood(newQ, s.snake);
    }
  }

  function handleWrong() {
    const s = stateRef.current;
    setFlashClass('sn-flash-wrong');
    setTimeout(() => setFlashClass(''), 400);
    triggerWrong();
    const newLives = s.lives - 1;
    s.lives = newLives;
    setLives(newLives);
    if (newLives <= 0) {
      handleGameOver();
    }
  }

  function handleDeath() {
    const s = stateRef.current;
    setFlashClass('sn-flash-wrong');
    setTimeout(() => setFlashClass(''), 400);
    const newLives = s.lives - 1;
    s.lives = newLives;
    setLives(newLives);
    if (newLives <= 0) {
      handleGameOver();
      return;
    }
    s.snake = [{ x: 10, y: 9 }, { x: 9, y: 9 }, { x: 8, y: 9 }];
    s.dir = { x: 1, y: 0 };
    s.nextDir = { x: 1, y: 0 };
    s.food = spawnFood(questionRef.current, s.snake);
    animRef.current = requestAnimationFrame(tick);
  }

  function handleGameOver() {
    cancelAnimationFrame(animRef.current);
    const s = stateRef.current;
    const finalScore = s.score;
    const stars = finalScore >= 200 + level * 50 ? 3 : finalScore >= 100 + level * 25 ? 2 : 1;
    const result = saveGameSession('snake', { score: finalScore, level: level + 1, stars, timeSecs: 60 });
    setIsNewBest(result?.isNewBest || false);
    setPhase('over');
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas || !stateRef.current) return;
    const ctx = canvas.getContext('2d');
    const s = stateRef.current;
    const cs = CELL;

    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, GRID_COLS, GRID_ROWS, cs);
    drawFood(ctx, s.food, cs);
    drawSnake(ctx, s.snake, cs);
  }

  useEffect(() => {
    function onKey(e) {
      if (phase !== 'play' || !stateRef.current) return;
      const s = stateRef.current;
      const { dir } = s;
      if ((e.key === 'ArrowUp'    || e.key === 'w') && dir.y !== 1)  s.nextDir = { x: 0, y: -1 };
      if ((e.key === 'ArrowDown'  || e.key === 's') && dir.y !== -1) s.nextDir = { x: 0, y: 1 };
      if ((e.key === 'ArrowLeft'  || e.key === 'a') && dir.x !== 1)  s.nextDir = { x: -1, y: 0 };
      if ((e.key === 'ArrowRight' || e.key === 'd') && dir.x !== -1) s.nextDir = { x: 1, y: 0 };
      if (e.key === ' ' || e.key === 'Escape') togglePause();
      e.preventDefault();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase]);

  const touchRef = useRef(null);
  function onTouchStart(e) {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  }
  function onTouchEnd(e) {
    if (!touchRef.current || phase !== 'play' || !stateRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    const s = stateRef.current;
    const { dir } = s;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 20 && dir.x !== -1) s.nextDir = { x: 1, y: 0 };
      if (dx < -20 && dir.x !== 1) s.nextDir = { x: -1, y: 0 };
    } else {
      if (dy > 20 && dir.y !== -1) s.nextDir = { x: 0, y: 1 };
      if (dy < -20 && dir.y !== 1) s.nextDir = { x: 0, y: -1 };
    }
    touchRef.current = null;
  }

  function dpad(dx, dy) {
    if (phase !== 'play' || !stateRef.current) return;
    const s = stateRef.current;
    const { dir } = s;
    if (dx === 1  && dir.x !== -1) s.nextDir = { x: 1,  y: 0 };
    if (dx === -1 && dir.x !== 1)  s.nextDir = { x: -1, y: 0 };
    if (dy === 1  && dir.y !== -1) s.nextDir = { x: 0,  y: 1 };
    if (dy === -1 && dir.y !== 1)  s.nextDir = { x: 0,  y: -1 };
  }

  function startGame() {
    cancelAnimationFrame(animRef.current);
    const q = nextQuestion();
    initState(q);
    setScore(0);
    setLives(LIVES);
    setIsNewBest(false);
    setFlashClass('');
    setPhase('play');
    lastTickRef.current = 0;
    animRef.current = requestAnimationFrame(tick);
  }

  function togglePause() {
    if (phase === 'play') {
      cancelAnimationFrame(animRef.current);
      setPhase('pause');
    } else if (phase === 'pause') {
      lastTickRef.current = 0;
      setPhase('play');
      animRef.current = requestAnimationFrame(tick);
    }
  }

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  useEffect(() => {
    if (phase === 'pause' || phase === 'over') draw();
  }, [phase]);

  const canvasW = GRID_COLS * CELL;
  const canvasH = GRID_ROWS * CELL;

  function getQuestionText() {
    if (!question) return '';
    if (question.type === 'word')   return `Épelle : ${question.display} (${question.currentIndex}/${question.letters.length})`;
    if (question.type === 'phrase') return `${question.words.slice(0, question.currentIndex).join(' ')} ___`;
    return question.display;
  }

  const variantKeys = ['math', 'multi', 'word', 'phrase', 'color'];
  const stars = score >= 200 + level * 50 ? 3 : score >= 100 + level * 25 ? 2 : 1;

  return (
    <GameFullScreenWrapper>
      <div className="sn-page">
        {/* Header */}
        <div className="sn-header">
          <Link to="/jeux" className="sn-back" aria-label={ui.back}>←</Link>
          <div>
            <h1 className="sn-title">{ui.title}</h1>
            <div className="sn-subtitle">{ui.variants[variant]?.icon} {ui.variants[variant]?.name} · {ui.levels[level]}</div>
          </div>
          {phase === 'play' && (
            <button className="sn-btn sn-btn--secondary" style={{ padding: '6px 14px', fontSize: '.8rem', minWidth: 0 }} onClick={togglePause}>
              {ui.pauseBtn}
            </button>
          )}
        </div>

        {/* HUD */}
        {phase !== 'menu' && (
          <div className="sn-hud">
            <div className="sn-hud-item">
              <span className="sn-hud-val">{score}</span>
              <span className="sn-hud-label">{ui.scoreLabel}</span>
            </div>
            <div className="sn-hud-sep" />
            <div className="sn-hud-item">
              <span className="sn-hud-val">{'❤️'.repeat(lives)}{'🖤'.repeat(Math.max(0, LIVES - lives))}</span>
              <span className="sn-hud-label">{ui.livesLabel}</span>
            </div>
            <div className="sn-hud-sep" />
            <div className="sn-hud-item">
              <span className="sn-hud-val">{progress?.bestScore || 0}</span>
              <span className="sn-hud-label">Best</span>
            </div>
          </div>
        )}

        {/* Question banner */}
        {(phase === 'play' || phase === 'pause') && question && (
          <div className="sn-question" style={{ maxWidth: canvasW, width: '100%', margin: '0 0 8px' }}>
            <div className="sn-question__label">{ui.questionLabel}</div>
            <div className="sn-question__text">{getQuestionText()}</div>
            <div className="sn-question__hint">{ui.variants[variant]?.hint}</div>
          </div>
        )}

        {/* Canvas */}
        {phase !== 'menu' && (
          <div
            className={`sn-canvas-wrap ${flashClass}`}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <canvas
              ref={canvasRef}
              className="sn-canvas"
              width={canvasW}
              height={canvasH}
            />

            {/* Pause overlay */}
            {phase === 'pause' && (
              <div className="sn-overlay">
                <div className="sn-overlay__emoji">⏸</div>
                <h2 className="sn-overlay__title">{ui.paused}</h2>
                <button className="sn-btn sn-btn--primary" onClick={togglePause}>{ui.resumeBtn}</button>
                <button className="sn-btn sn-btn--secondary" onClick={() => { cancelAnimationFrame(animRef.current); setPhase('menu'); }}>{ui.backToMenuBtn}</button>
              </div>
            )}

            {/* Game over overlay */}
            {phase === 'over' && (
              <div className="sn-overlay">
                <div className="sn-overlay__emoji">🐍</div>
                <h2 className="sn-overlay__title">{ui.gameOver}</h2>
                {isNewBest && <p className="sn-overlay__sub">{ui.newBest}</p>}
                <div className="sn-overlay__score">{score}</div>
                <div className="sn-overlay__stars">{ui.stars(stars)}</div>
                <button className="sn-btn sn-btn--primary" onClick={startGame}>{ui.restartBtn}</button>
                <button className="sn-btn sn-btn--secondary" onClick={() => setPhase('menu')}>{ui.backToMenuBtn}</button>
              </div>
            )}
          </div>
        )}

        {/* D-pad */}
        {phase === 'play' && (
          <div className="sn-dpad" aria-label="Contrôles directionnels">
            <div className="sn-dpad-empty" />
            <button className="sn-dpad-btn" onPointerDown={() => dpad(0, -1)} aria-label="Haut">▲</button>
            <div className="sn-dpad-empty" />
            <button className="sn-dpad-btn" onPointerDown={() => dpad(-1, 0)} aria-label="Gauche">◀</button>
            <div className="sn-dpad-empty" />
            <button className="sn-dpad-btn" onPointerDown={() => dpad(1, 0)} aria-label="Droite">▶</button>
            <div className="sn-dpad-empty" />
            <button className="sn-dpad-btn" onPointerDown={() => dpad(0, 1)} aria-label="Bas">▼</button>
            <div className="sn-dpad-empty" />
          </div>
        )}

        {/* MENU */}
        {phase === 'menu' && (
          <div className="sn-overlay" style={{ position: 'relative', inset: 'auto', borderRadius: 20, maxWidth: 480, width: '90%', margin: '16px auto', padding: 28 }}>
            <div className="sn-overlay__emoji">🐍</div>
            <h2 className="sn-overlay__title">{ui.title}</h2>

            <div className="sn-variants">
              {variantKeys.map(k => (
                <button
                  key={k}
                  className={`sn-variant-btn ${variant === k ? 'sn-variant-btn--active' : ''}`}
                  onClick={() => setVariant(k)}
                >
                  <span className="sn-variant-btn__icon">{ui.variants[k].icon}</span>
                  {ui.variants[k].name}
                </button>
              ))}
            </div>

            <div className="sn-levels">
              {ui.levels.map((lbl, i) => (
                <button
                  key={i}
                  className={`sn-level-btn ${level === i ? 'sn-level-btn--active' : ''}`}
                  onClick={() => setLevel(i)}
                >{lbl}</button>
              ))}
            </div>

            {progress?.bestScore > 0 && (
              <p className="sn-overlay__sub">🏆 Best: {progress.bestScore} pts</p>
            )}

            <button className="sn-btn sn-btn--primary" style={{ marginTop: 8 }} onClick={startGame}>
              {ui.startBtn}
            </button>
          </div>
        )}

        <GameFeedback ref={feedbackRef} />
      </div>
    </GameFullScreenWrapper>
  );
}
