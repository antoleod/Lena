import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import { GameFeedback, useGameFeedback } from './GameFeedback.jsx';
import './jeux.css';

const QUESTION_TIME = 10; // seconds per question

const LEVEL_CONFIG = [
  { label: 'N1 — Tables 1·2·3',       questions: 20, tables: [1,2,3],       maxB: 10, twoDigit: false },
  { label: 'N2 — Tables 4·5·6',       questions: 20, tables: [4,5,6],       maxB: 10, twoDigit: false },
  { label: 'N3 — Tables 7·8·9',       questions: 20, tables: [7,8,9],       maxB: 10, twoDigit: false },
  { label: 'N4 — Toutes les tables',  questions: 20, tables: [2,3,4,5,6,7,8,9], maxB: 12, twoDigit: false },
  { label: 'N5 — Grand mélange',      questions: 20, tables: [2,3,4,5,6,7,8,9], maxB: 12, twoDigit: true  },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(secs) {
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m${secs % 60}s`;
}

function generateQuestion(cfg) {
  const a = cfg.tables[Math.floor(Math.random() * cfg.tables.length)];
  let b;
  if (cfg.twoDigit && Math.random() < 0.4) {
    b = 11 + Math.floor(Math.random() * 14); // 11–24
  } else {
    b = 1 + Math.floor(Math.random() * cfg.maxB);
  }
  const correct = a * b;
  // Generate 3 wrong answers nearby
  const wrongs = new Set();
  while (wrongs.size < 3) {
    const offset = (Math.floor(Math.random() * 5) + 1) * (Math.random() < 0.5 ? 1 : -1);
    const candidate = correct + offset;
    if (candidate > 0 && candidate !== correct) wrongs.add(candidate);
  }
  const choices = shuffle([correct, ...wrongs]);
  return { a, b, correct, choices };
}

function buildQuestions(cfg) {
  return Array.from({ length: cfg.questions }, () => generateQuestion(cfg));
}

export default function MultiplicationsPage() {
  const { progress, saveSession, resetTimer, logError } = useGameSession('multiplications');
  const { feedbackRef, triggerCorrect, triggerWrong } = useGameFeedback();

  const [phase, setPhase] = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null); // null | 'ok' | 'bad'
  const [chosenIdx, setChosenIdx] = useState(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [sessionResult, setSessionResult] = useState(null);

  const lockedRef = useRef(false);
  const cfg = LEVEL_CONFIG[selectedLevel - 1];
  const question = questions[roundIndex] ?? null;

  // Timer per question — restarts when roundIndex changes
  useEffect(() => {
    if (phase !== 'play') return;
    setTimeLeft(QUESTION_TIME);
    lockedRef.current = false;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          if (!lockedRef.current) {
            lockedRef.current = true;
            handleTimeout();
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIndex, phase]);

  function handleTimeout() {
    triggerWrong();
    setFeedback('bad');
    setChosenIdx(-1); // sentinel — no button chosen
    if (question) {
      logError({ label: `${question.a} × ${question.b}`, correct: question.correct, given: 'timeout' });
    }
    setTimeout(() => advance(false), 900);
  }

  function advance(wasCorrect) {
    const next = roundIndex + 1;
    const currentScore = wasCorrect ? score + 1 : score;
    if (next >= cfg.questions) {
      const stars = currentScore >= Math.ceil(cfg.questions * 0.86) ? 3
        : currentScore >= Math.ceil(cfg.questions * 0.6) ? 2 : 1;
      const result = saveSession({ score: currentScore, level: selectedLevel, stars });
      setSessionResult(result);
      setScore(currentScore);
      setPhase('results');
      return;
    }
    setFeedback(null);
    setChosenIdx(null);
    setRoundIndex(next);
  }

  function handleChoice(choice, idx) {
    if (lockedRef.current || feedback !== null || !question) return;
    lockedRef.current = true;
    const correct = choice === question.correct;
    setChosenIdx(idx);
    setFeedback(correct ? 'ok' : 'bad');
    if (correct) {
      triggerCorrect();
      setScore(s => s + 1);
    } else {
      triggerWrong();
      logError({ label: `${question.a} × ${question.b}`, correct: question.correct, given: choice });
    }
    setTimeout(() => advance(correct), 900);
  }

  function startGame() {
    const c = LEVEL_CONFIG[selectedLevel - 1];
    setQuestions(buildQuestions(c));
    setRoundIndex(0);
    setScore(0);
    setFeedback(null);
    setChosenIdx(null);
    setSessionResult(null);
    lockedRef.current = false;
    resetTimer();
    setPhase('play');
  }

  if (phase === 'setup') {
    return (
      <div className="an-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="an-title">✖️ Table Express</h1>
        <p className="an-subtitle">Réponds le plus vite possible !</p>

        <div className="jeux-level-grid">
          {LEVEL_CONFIG.map((lc, i) => {
            const lvl = i + 1;
            const locked = lvl > progress.unlockedLevel;
            const sel = lvl === selectedLevel;
            return (
              <button
                key={lvl}
                className={`jeux-level-btn${sel ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`}
                onPointerDown={e => { e.preventDefault(); if (!locked) setSelectedLevel(lvl); }}
                disabled={locked}
              >
                {locked ? '🔒' : `N${lvl}`}
              </button>
            );
          })}
        </div>

        <div className="an-info-row">
          <span>📝 {cfg.questions} questions</span>
          <span>⏱ {QUESTION_TIME}s par question</span>
        </div>

        <div className="jeux-setup-stats">
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{progress.bestScore}</span>
            <span className="jeux-setup-stat__lbl">Meilleur score</span>
          </div>
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{formatTime(progress.totalTimeSecs)}</span>
            <span className="jeux-setup-stat__lbl">Temps total</span>
          </div>
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{progress.sessionsPlayed}</span>
            <span className="jeux-setup-stat__lbl">Parties</span>
          </div>
        </div>

        <button className="an-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>
          ▶ Jouer
        </button>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = score >= Math.ceil(cfg.questions * 0.86) ? 3
      : score >= Math.ceil(cfg.questions * 0.6) ? 2 : 1;
    const msg = stars === 3 ? '🎉 Parfait !' : stars === 2 ? '👍 Bien joué !' : '📚 Encore un effort !';
    return (
      <div className="an-page">
        <h2 className="an-result-title">{msg}</h2>
        <div className="jeux-stars">{'★'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {cfg.questions}</span></div>
        {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
        {sessionResult?.newUnlocked && (
          <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} débloqué !</div>
        )}
        <div className="an-result-btns">
          <button className="an-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <button className="an-cta an-cta--soft" onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}>Niveaux</button>
          <Link to="/jeux" className="an-cta an-cta--soft">← Jeux</Link>
        </div>
      </div>
    );
  }

  if (!question) return null;

  const timerPct = (timeLeft / QUESTION_TIME) * 100;
  const timerColor = timerPct > 50 ? '#22c55e' : timerPct > 25 ? '#f59e0b' : '#ef4444';

  return (
    <div className={`an-page${feedback === 'ok' ? ' an-flash-ok' : feedback === 'bad' ? ' an-flash-bad' : ''}`}>
      <GameFeedback ref={feedbackRef} />
      <Link to="/jeux" className="exam-back-btn">←</Link>

      <div className="an-hud">
        <span className="an-score">⭐ {score}</span>
        <span className="an-round">{roundIndex + 1} / {cfg.questions}</span>
      </div>

      {/* Timer bar */}
      <div style={{ width: '100%', height: 8, background: '#e5e7eb', borderRadius: 4, marginBottom: 16 }}>
        <div style={{
          height: '100%',
          width: `${timerPct}%`,
          background: timerColor,
          borderRadius: 4,
          transition: 'width 1s linear, background 0.3s',
        }} />
      </div>

      <div className="an-word-card">
        <div className="an-word" style={{ fontSize: '2.2rem', letterSpacing: 2 }}>
          {question.a} × {question.b} = ?
        </div>
      </div>

      <div className="an-choices">
        {question.choices.map((choice, i) => {
          let cls = 'an-choice';
          if (feedback !== null && i === chosenIdx && chosenIdx !== -1) {
            cls += feedback === 'ok' ? ' an-choice--correct' : ' an-choice--wrong an-choice--shake';
          }
          if (feedback !== null && choice === question.correct && i !== chosenIdx) {
            cls += ' an-choice--correct';
          }
          return (
            <button
              key={i}
              className={cls}
              onPointerDown={e => { e.preventDefault(); handleChoice(choice, i); }}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}
