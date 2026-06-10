import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

const UI = {
  fr: {
    title: 'Calcul Rapide',
    play: 'C\'est parti !',
    score: 'Score',
    timeLeft: 'Temps',
    win: 'Super !',
    playAgain: 'Rejouer',
    settings: 'Niveaux',
    questionsLabel: 'questions',
    streak: 'Serie',
    levelLabel: 'Niveau',
  },
  nl: {
    title: 'Snel Rekenen',
    play: 'Start !',
    score: 'Score',
    timeLeft: 'Tijd',
    win: 'Super !',
    playAgain: 'Opnieuw',
    settings: 'Niveaus',
    questionsLabel: 'vragen',
    streak: 'Reeks',
    levelLabel: 'Niveau',
  },
  en: {
    title: 'Speed Math',
    play: 'Go !',
    score: 'Score',
    timeLeft: 'Time',
    win: 'Great !',
    playAgain: 'Play again',
    settings: 'Levels',
    questionsLabel: 'questions',
    streak: 'Streak',
    levelLabel: 'Level',
  },
  es: {
    title: 'Calculo Rapido',
    play: 'A jugar !',
    score: 'Puntos',
    timeLeft: 'Tiempo',
    win: 'Genial !',
    playAgain: 'Jugar de nuevo',
    settings: 'Niveles',
    questionsLabel: 'preguntas',
    streak: 'Racha',
    levelLabel: 'Nivel',
  },
};

const LEVELS = [
  { id:1,  label:'N1',  ops:['+'],             max:10,  timer:60, bonus:false },
  { id:2,  label:'N2',  ops:['+'],             max:15,  timer:60, bonus:false },
  { id:3,  label:'N3',  ops:['+','-'],         max:10,  timer:60, bonus:false },
  { id:4,  label:'N4',  ops:['+','-'],         max:20,  timer:60, bonus:false },
  { id:5,  label:'N5',  ops:['+','-'],         max:30,  timer:60, bonus:true  },
  { id:6,  label:'N6',  ops:['+','-'],         max:50,  timer:60, bonus:true  },
  { id:7,  label:'N7',  ops:['*'],             max:5,   timer:60, bonus:true  },
  { id:8,  label:'N8',  ops:['*'],             max:10,  timer:60, bonus:true  },
  { id:9,  label:'N9',  ops:['+','-','*'],     max:20,  timer:60, bonus:true  },
  { id:10, label:'N10', ops:['+','-','*'],     max:50,  timer:60, bonus:true  },
  { id:11, label:'N11', ops:['/'],             max:10,  timer:60, bonus:true  },
  { id:12, label:'N12', ops:['/',  '*'],       max:10,  timer:60, bonus:true  },
  { id:13, label:'N13', ops:['+','-','*','/'], max:20,  timer:60, bonus:true  },
  { id:14, label:'N14', ops:['+','-','*','/'], max:50,  timer:60, bonus:true  },
  { id:15, label:'N15', ops:['+','-','*','/'], max:100, timer:90, bonus:true  },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestion(levelCfg) {
  const { ops, max } = levelCfg;
  const op = ops[Math.floor(Math.random() * ops.length)];

  let a, b, answer;
  if (op === '/') {
    // Generate clean division: pick divisor 1-max, multiplier 1-max
    b = Math.floor(Math.random() * max) + 1;
    const multiplier = Math.floor(Math.random() * max) + 1;
    a = b * multiplier;
    answer = multiplier;
  } else {
    a = Math.floor(Math.random() * max) + 1;
    b = Math.floor(Math.random() * max) + 1;
    if (op === '-' && b > a) { const tmp = a; a = b; b = tmp; }
    answer = op === '+' ? a + b : op === '-' ? a - b : a * b;
  }

  const distractors = new Set();
  let attempts = 0;
  while (distractors.size < 3 && attempts < 60) {
    attempts++;
    const d = answer + (Math.floor(Math.random() * 7) - 3);
    if (d !== answer && d > 0) distractors.add(d);
  }
  let offset = 1;
  while (distractors.size < 3) {
    if (answer + offset > 0 && answer + offset !== answer) distractors.add(answer + offset);
    if (distractors.size < 3 && answer - offset > 0 && answer - offset !== answer) distractors.add(answer - offset);
    offset++;
  }

  const choices = shuffle([answer, ...Array.from(distractors)]);
  const opDisplay = op === '*' ? '×' : op === '/' ? '÷' : op;
  return { a, op: opDisplay, b, answer, choices };
}

function calcStars(score) {
  if (score >= 20) return 3;
  if (score >= 12) return 2;
  return 1;
}

export default function SpeedMathPage() {
  const { locale } = useLocale();
  const ui = UI[locale] || UI.fr;
  const { progress, saveSession, resetTimer } = useGameSession('speed-math');

  const [phase, setPhase] = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(Math.min(progress.unlockedLevel, 15));

  const [question, setQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [answeredId, setAnsweredId] = useState(null);
  const [answeredCorrect, setAnsweredCorrect] = useState(null);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [locked, setLocked] = useState(false);
  const [streak, setStreak] = useState(0);
  const [sessionResult, setSessionResult] = useState(null);

  const timerRef = useRef(null);
  const nextRef = useRef(null);
  const scoreRef = useRef(0);
  const streakRef = useRef(0);

  const levelCfg = LEVELS[selectedLevel - 1];

  useEffect(() => {
    if (phase !== 'play') return;
    const cfg = LEVELS[selectedLevel - 1];
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          const stars = calcStars(scoreRef.current);
          const result = saveSession({ score: scoreRef.current, level: selectedLevel, stars });
          setSessionResult(result);
          setPhase('results');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(nextRef.current);
    };
  }, []);

  function startGame() {
    const cfg = LEVELS[selectedLevel - 1];
    scoreRef.current = 0;
    streakRef.current = 0;
    setScore(0);
    setTimeLeft(cfg.timer);
    setTotalAnswered(0);
    setAnsweredId(null);
    setAnsweredCorrect(null);
    setLocked(false);
    setStreak(0);
    setSessionResult(null);
    setQuestion(generateQuestion(cfg));
    resetTimer();
    setPhase('play');
  }

  const handleChoice = useCallback((choice, idx) => {
    if (locked || phase !== 'play') return;
    const cfg = LEVELS[selectedLevel - 1];
    const isCorrect = choice === question.answer;
    setAnsweredId(idx);
    setAnsweredCorrect(isCorrect);
    setLocked(true);
    if (isCorrect) {
      streakRef.current += 1;
      const isBonus = cfg.bonus && streakRef.current >= 3;
      const pts = isBonus ? 2 : 1;
      scoreRef.current += pts;
      setScore(s => s + pts);
      setStreak(streakRef.current);
    } else {
      streakRef.current = 0;
      setStreak(0);
    }
    setTotalAnswered(n => n + 1);

    nextRef.current = setTimeout(() => {
      setAnsweredId(null);
      setAnsweredCorrect(null);
      setLocked(false);
      setQuestion(generateQuestion(cfg));
    }, 300);
  }, [locked, phase, question, selectedLevel]);

  const DECO_OPS = [
    { op: '+', left: '8%',  delay: '0s',   d: '7s',  r0: '-10deg', r1: '20deg' },
    { op: '×', left: '78%', delay: '1.2s', d: '6s',  r0: '15deg',  r1: '-25deg' },
    { op: '−', left: '20%', delay: '2.4s', d: '8s',  r0: '5deg',   r1: '-15deg' },
    { op: '÷', left: '60%', delay: '0.8s', d: '5.5s',r0: '-20deg', r1: '10deg' },
    { op: '=', left: '88%', delay: '3s',   d: '9s',  r0: '0deg',   r1: '30deg' },
  ];

  function renderSetup() {
    const ops = levelCfg.ops.map(o => o === '*' ? '×' : o === '/' ? '÷' : o).join(' ');
    return (
      <div className="sm-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="sm-setup">
          {DECO_OPS.map(({ op, left, delay, d, r0, r1 }) => (
            <span
              key={op}
              className="sm-deco-op"
              style={{ left, '--delay': delay, '--d': d, '--r0': r0, '--r1': r1 }}
            >
              {op}
            </span>
          ))}

          <div className="sm-setup__hero">
            <span className="sm-setup__emoji">⚡</span>
            <h1 className="sm-setup__title">{ui.title}</h1>
            <p className="sm-setup__sub">
              {progress.bestLevel > 1 ? `🏆 Meilleur : niveau ${progress.bestLevel}` : 'Choisis ton niveau'}
            </p>
          </div>

          <div className="sm-level-section">
            <div className="sm-level-title">{ui.levelLabel}</div>
            <div className="jeux-level-grid">
              {LEVELS.map(lc => {
                const isLocked = lc.id > progress.unlockedLevel;
                const sel = lc.id === selectedLevel;
                return (
                  <button
                    key={lc.id}
                    className={`jeux-level-btn${sel ? ' is-selected' : ''}${isLocked ? ' is-locked' : ''}`}
                    onPointerDown={e => { e.preventDefault(); if (!isLocked) setSelectedLevel(lc.id); }}
                    disabled={isLocked}
                  >
                    {isLocked ? '🔒' : lc.label}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="sm-level-desc">
            {ops} · max {levelCfg.max} · {levelCfg.timer}s
            {levelCfg.bonus && ' · 🔥 ×2 série'}
          </p>

          <button className="sm-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>
            ⚡ {ui.play}
          </button>
        </div>
      </div>
    );
  }

  function renderPlay() {
    if (!question) return null;
    const cfg = LEVELS[selectedLevel - 1];
    const pct = (timeLeft / cfg.timer) * 100;
    const urgent = timeLeft <= 10;
    const bonusActive = cfg.bonus && streak >= 3;
    const BTN_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4'];
    return (
      <div className="sm-page" style={{ position: 'relative' }}>
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="sm-play">
          <div className="game-hud">
            <span className="game-hud__score">⚡ {score}</span>
            <span className="game-hud__round">{levelCfg.label} · {totalAnswered} {ui.questionsLabel}</span>
            {streak >= 3 && <span className="game-hud__streak">🔥 ×2</span>}
          </div>

          <div className="game-timer-bar">
            <div
              className={`game-timer-fill${urgent ? ' game-timer-fill--urgent' : ''}`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="game-question-card">
            <div className="game-question-text">
              {question.a} {question.op} {question.b} = ?
            </div>
            <div className="game-question-sub">{ui.timeLeft} : {timeLeft}s</div>
          </div>

          <div className="sm-choices">
            {question.choices.map((c, idx) => {
              let cls = 'sm-choice';
              if (answeredId === idx) cls += answeredCorrect ? ' is-correct' : ' is-wrong';
              return (
                <button
                  key={idx}
                  className={cls}
                  style={{ '--btn-color': BTN_COLORS[idx % BTN_COLORS.length] }}
                  onPointerDown={e => { e.preventDefault(); handleChoice(c, idx); }}
                  disabled={locked}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  function renderResults() {
    const stars = calcStars(score);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    const rankEmoji = stars === 3 ? '🧠' : stars === 2 ? '💪' : '📚';
    return (
      <div className="sm-page">
        <div className="game-results">
          <div className="game-results__emoji">{rankEmoji}</div>
          <div className="game-results__title">{ui.win}</div>
          <div className="game-results__stars">{starStr}</div>

          <div className="game-results__stats">
            <div className="game-results__stat">
              <span className="game-results__stat-val">{score}</span>
              <span className="game-results__stat-lbl">{ui.score}</span>
            </div>
            <div className="game-results__stat">
              <span className="game-results__stat-val">{totalAnswered}</span>
              <span className="game-results__stat-lbl">{ui.questionsLabel}</span>
            </div>
            <div className="game-results__stat">
              <span className="game-results__stat-val">{levelCfg.label}</span>
              <span className="game-results__stat-lbl">{ui.levelLabel}</span>
            </div>
          </div>

          {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
          {sessionResult?.newUnlocked && <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} débloqué !</div>}

          <button
            className="game-results__btn"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 6px 0 #92400e', color: 'var(--on-amber, #3d1f00)' }}
            onPointerDown={e => { e.preventDefault(); startGame(); }}
          >
            ⚡ {ui.playAgain}
          </button>
          <button
            className="game-results__btn game-results__btn--soft"
            onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}
          >
            {ui.settings}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'setup') return renderSetup();
  if (phase === 'play') return renderPlay();
  return renderResults();
}
