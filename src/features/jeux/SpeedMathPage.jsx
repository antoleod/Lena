import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import '../exerciseGenerator/cahier.css';
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

  function renderSetup() {
    return (
      <div className="cahier-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="cahier-title">{ui.title}</h1>

        <div className="cahier-section">
          <div className="cahier-section-title">{ui.levelLabel}</div>
          <div className="jeux-level-grid">
            {LEVELS.map(lc => {
              const locked = lc.id > progress.unlockedLevel;
              const sel = lc.id === selectedLevel;
              return (
                <button
                  key={lc.id}
                  className={`jeux-level-btn${sel ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`}
                  onPointerDown={e => { e.preventDefault(); if (!locked) setSelectedLevel(lc.id); }}
                  disabled={locked}
                >
                  {locked ? '🔒' : lc.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ textAlign: 'center', opacity: .7, fontSize: '.9rem', marginBottom: 12 }}>
          {levelCfg.ops.map(o => o === '*' ? '×' : o === '/' ? '÷' : o).join(' ')} · max {levelCfg.max} · {levelCfg.timer}s
          {levelCfg.bonus && ' · 🔥 ×2 serie'}
        </div>

        <button className="cahier-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>
          {ui.play}
        </button>
      </div>
    );
  }

  function renderPlay() {
    if (!question) return null;
    const cfg = LEVELS[selectedLevel - 1];
    const pct = (timeLeft / cfg.timer) * 100;
    const urgent = timeLeft <= 10;
    const bonusActive = cfg.bonus && streak >= 3;
    return (
      <div className="cahier-page" style={{ position: 'relative' }}>
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="sm-score-badge">{score}</div>

        <h2 style={{ textAlign: 'center', margin: '8px 0 4px', fontSize: '1rem', fontWeight: 700 }}>
          {ui.title} — {levelCfg.label}
        </h2>
        <div style={{ textAlign: 'center', fontSize: '.85rem', opacity: .7, marginBottom: 8 }}>
          {ui.timeLeft}: {timeLeft}s — {totalAnswered} {ui.questionsLabel}
          {bonusActive && <span style={{ marginLeft: 8, color: '#f97316', fontWeight: 700 }}>🔥 ×2</span>}
        </div>

        <div className="sm-timer-bar">
          <div
            className={`sm-timer-fill${urgent ? ' is-urgent' : ''}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="sm-question">
          {question.a} {question.op} {question.b} = ?
        </div>

        <div className="sm-choices">
          {question.choices.map((c, idx) => {
            let cls = 'sm-choice';
            if (answeredId === idx) {
              cls += answeredCorrect ? ' is-correct' : ' is-wrong';
            }
            return (
              <button
                key={idx}
                className={cls}
                onPointerDown={e => { e.preventDefault(); handleChoice(c, idx); }}
                disabled={locked}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  function renderResults() {
    const stars = calcStars(score);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    const rankEmoji = stars === 3 ? '🧠' : stars === 2 ? '💪' : '📚';
    return (
      <div className="cahier-page">
        <h2 style={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 900, margin: '24px 0 8px' }}>
          {rankEmoji} {ui.win}
        </h2>

        <div className="jeux-stars">{starStr}</div>

        <div className="jeux-result-stat">
          <span>{ui.score}</span>
          <span>{score}</span>
        </div>
        <div className="jeux-result-stat">
          <span>{ui.questionsLabel}</span>
          <span>{totalAnswered}</span>
        </div>

        {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
        {sessionResult?.newUnlocked && <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} debloque !</div>}

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button className="cahier-cta" style={{ flex: 1 }} onPointerDown={e => { e.preventDefault(); startGame(); }}>
            {ui.playAgain}
          </button>
          <button className="cahier-cta cahier-cta--soft" style={{ flex: 1 }} onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}>
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
