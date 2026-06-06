import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import '../exerciseGenerator/cahier.css';
import './jeux.css';

const UI = {
  fr: {
    title: 'Calcul Rapide',
    level: 'Niveau',
    ops: 'Operations',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
    addOnly: 'Additions',
    addSub: '+ et -',
    mulOnly: 'Multiplications',
    all: 'Tout melange',
    play: 'C\'est parti !',
    score: 'Score',
    timeLeft: 'Temps',
    win: 'Super !',
    playAgain: 'Rejouer',
    settings: 'Parametres',
    correct: 'Correct !',
    wrong: 'Rate !',
    questionsLabel: 'questions',
  },
  nl: {
    title: 'Snel Rekenen',
    level: 'Niveau',
    ops: 'Bewerkingen',
    easy: 'Makkelijk',
    medium: 'Gemiddeld',
    hard: 'Moeilijk',
    addOnly: 'Optelling',
    addSub: '+ en -',
    mulOnly: 'Vermenigvuldiging',
    all: 'Alles gemengd',
    play: 'Start !',
    score: 'Score',
    timeLeft: 'Tijd',
    win: 'Super !',
    playAgain: 'Opnieuw',
    settings: 'Instellingen',
    correct: 'Goed !',
    wrong: 'Fout !',
    questionsLabel: 'vragen',
  },
  en: {
    title: 'Speed Math',
    level: 'Level',
    ops: 'Operations',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    addOnly: 'Addition',
    addSub: '+ and -',
    mulOnly: 'Multiplication',
    all: 'Mixed',
    play: 'Go !',
    score: 'Score',
    timeLeft: 'Time',
    win: 'Great !',
    playAgain: 'Play again',
    settings: 'Settings',
    correct: 'Correct !',
    wrong: 'Wrong !',
    questionsLabel: 'questions',
  },
  es: {
    title: 'Calculo Rapido',
    level: 'Nivel',
    ops: 'Operaciones',
    easy: 'Facil',
    medium: 'Medio',
    hard: 'Dificil',
    addOnly: 'Sumas',
    addSub: '+ y -',
    mulOnly: 'Multiplicaciones',
    all: 'Todo mezclado',
    play: 'A jugar !',
    score: 'Puntos',
    timeLeft: 'Tiempo',
    win: 'Genial !',
    playAgain: 'Jugar de nuevo',
    settings: 'Ajustes',
    correct: 'Correcto !',
    wrong: 'Fallo !',
    questionsLabel: 'preguntas',
  },
};

const OPS_MAP = {
  addOnly: ['+'],
  addSub:  ['+', '-'],
  mulOnly: ['*'],
  all:     ['+', '-', '*'],
};

const TOTAL_TIME = 60;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestion(opsKey, level) {
  const ops = OPS_MAP[opsKey];
  const max = level === 'easy' ? 10 : level === 'medium' ? 20 : 50;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a = Math.floor(Math.random() * max) + 1;
  let b = Math.floor(Math.random() * max) + 1;
  if (op === '-' && b > a) { const tmp = a; a = b; b = tmp; }
  const answer = op === '+' ? a + b : op === '-' ? a - b : a * b;

  const distractors = new Set();
  let attempts = 0;
  while (distractors.size < 3 && attempts < 50) {
    attempts++;
    const d = answer + (Math.floor(Math.random() * 7) - 3);
    if (d !== answer && d >= 0) distractors.add(d);
  }
  // Fallback if not enough distractors
  let offset = 1;
  while (distractors.size < 3) {
    if (answer + offset >= 0 && answer + offset !== answer) distractors.add(answer + offset);
    if (distractors.size < 3 && answer - offset >= 0 && answer - offset !== answer) distractors.add(answer - offset);
    offset++;
  }

  const choices = shuffle([answer, ...Array.from(distractors)]);
  const opDisplay = op === '*' ? '×' : op;
  return { a, op: opDisplay, b, answer, choices };
}

function calcStars(score) {
  if (score >= 15) return 3;
  if (score >= 8) return 2;
  return 1;
}

export default function SpeedMathPage() {
  const { locale } = useLocale();
  const ui = UI[locale] || UI.fr;

  const [phase, setPhase] = useState('setup');
  const [opsKey, setOpsKey] = useState('addOnly');
  const [level, setLevel] = useState('easy');

  const [question, setQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [answeredId, setAnsweredId] = useState(null);
  const [answeredCorrect, setAnsweredCorrect] = useState(null);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [locked, setLocked] = useState(false);

  const timerRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    if (phase !== 'play') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setPhase('results');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(nextRef.current);
    };
  }, []);

  function startGame() {
    setScore(0);
    setTimeLeft(TOTAL_TIME);
    setTotalAnswered(0);
    setAnsweredId(null);
    setAnsweredCorrect(null);
    setLocked(false);
    setQuestion(generateQuestion(opsKey, level));
    setPhase('play');
  }

  const handleChoice = useCallback((choice, idx) => {
    if (locked || phase !== 'play') return;
    const isCorrect = choice === question.answer;
    setAnsweredId(idx);
    setAnsweredCorrect(isCorrect);
    setLocked(true);
    if (isCorrect) setScore(s => s + 1);
    setTotalAnswered(n => n + 1);

    nextRef.current = setTimeout(() => {
      setAnsweredId(null);
      setAnsweredCorrect(null);
      setLocked(false);
      setQuestion(generateQuestion(opsKey, level));
    }, 300);
  }, [locked, phase, question, opsKey, level]);

  function renderSetup() {
    return (
      <div className="cahier-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="cahier-title">{ui.title}</h1>

        <div className="cahier-section">
          <div className="cahier-section-title">{ui.level}</div>
          <div className="cahier-chips">
            {['easy', 'medium', 'hard'].map(l => (
              <button
                key={l}
                className={`cahier-chip${level === l ? ' is-selected' : ''}`}
                onClick={() => setLevel(l)}
              >
                {ui[l]}
              </button>
            ))}
          </div>
        </div>

        <div className="cahier-section">
          <div className="cahier-section-title">{ui.ops}</div>
          <div className="cahier-chips">
            {['addOnly', 'addSub', 'mulOnly', 'all'].map(o => (
              <button
                key={o}
                className={`cahier-chip${opsKey === o ? ' is-selected' : ''}`}
                onClick={() => setOpsKey(o)}
              >
                {ui[o]}
              </button>
            ))}
          </div>
        </div>

        <button className="cahier-cta" onClick={startGame}>
          {ui.play}
        </button>
      </div>
    );
  }

  function renderPlay() {
    if (!question) return null;
    const pct = (timeLeft / TOTAL_TIME) * 100;
    const urgent = timeLeft <= 10;
    return (
      <div className="cahier-page" style={{ position: 'relative' }}>
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="sm-score-badge">{score}</div>

        <h2 style={{ textAlign: 'center', margin: '8px 0 4px', fontSize: '1rem', fontWeight: 700 }}>
          {ui.title}
        </h2>
        <div style={{ textAlign: 'center', fontSize: '.85rem', opacity: .7, marginBottom: 8 }}>
          {ui.timeLeft}: {timeLeft}s — {totalAnswered} {ui.questionsLabel}
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
                onClick={() => handleChoice(c, idx)}
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

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button className="cahier-cta" style={{ flex: 1 }} onClick={startGame}>
            {ui.playAgain}
          </button>
          <button className="cahier-cta cahier-cta--soft" style={{ flex: 1 }} onClick={() => setPhase('setup')}>
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
