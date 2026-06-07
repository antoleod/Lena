import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import { GameFeedback, useGameFeedback } from './GameFeedback.jsx';
import './jeux.css';

const TOTAL_TIME = 60;

const LEVEL_CONFIG = [
  { label: 'N1 — 0 à 20',          id: 1 },
  { label: 'N2 — 0 à 100',         id: 2 },
  { label: 'N3 — 0 à 999',         id: 3 },
  { label: 'N4 — Multiplications',  id: 4 },
  { label: 'N5 — Nombres négatifs', id: 5 },
];

// Star thresholds per level (correct answers in 60s)
const STAR_THRESHOLDS = [
  { three: 20, two: 12 }, // N1
  { three: 18, two: 10 }, // N2
  { three: 15, two: 8  }, // N3
  { three: 12, two: 7  }, // N4
  { three: 15, two: 9  }, // N5
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion(level) {
  switch (level) {
    case 1: {
      const n = randInt(0, 20);
      return { display: String(n), value: n };
    }
    case 2: {
      const n = randInt(0, 100);
      return { display: String(n), value: n };
    }
    case 3: {
      const n = randInt(0, 999);
      return { display: String(n), value: n };
    }
    case 4: {
      const a = randInt(2, 12);
      const b = randInt(2, 12);
      const result = a * b;
      return { display: `${a} × ${b} = ?`, value: result };
    }
    case 5: {
      const n = randInt(-50, 50);
      return { display: String(n), value: n };
    }
    default: {
      const n = randInt(0, 20);
      return { display: String(n), value: n };
    }
  }
}

function isPair(value) {
  return Math.abs(value) % 2 === 0;
}

function calcStars(score, level) {
  const t = STAR_THRESHOLDS[level - 1];
  if (score >= t.three) return 3;
  if (score >= t.two) return 2;
  return 1;
}

function formatTime(secs) {
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m${secs % 60}s`;
}

export default function PairImpairPage() {
  const { progress, saveSession, resetTimer, logError } = useGameSession('pair-impair');
  const { feedbackRef, triggerCorrect, triggerWrong, triggerCombo } = useGameFeedback();

  const [phase, setPhase] = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [question, setQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [feedback, setFeedback] = useState(null); // null | 'ok' | 'bad'
  const [sessionResult, setSessionResult] = useState(null);
  const [locked, setLocked] = useState(false);

  const timerRef = useRef(null);
  const nextRef = useRef(null);

  // 60-second countdown while playing
  useEffect(() => {
    if (phase !== 'play') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  // When time runs out, go to results
  useEffect(() => {
    if (phase === 'play' && timeLeft === 0) {
      clearTimeout(nextRef.current);
      // Collect final score via state update
      setPhase('ending');
    }
  }, [phase, timeLeft]);

  // Transition ending → results with current score
  useEffect(() => {
    if (phase !== 'ending') return;
    // Use functional update pattern to grab latest score
    setScore(finalScore => {
      const stars = calcStars(finalScore, selectedLevel);
      const result = saveSession({ score: finalScore, level: selectedLevel, stars });
      setSessionResult(result);
      setPhase('results');
      return finalScore;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(nextRef.current);
    };
  }, []);

  function startGame() {
    clearInterval(timerRef.current);
    clearTimeout(nextRef.current);
    setScore(0);
    setCombo(0);
    setTimeLeft(TOTAL_TIME);
    setFeedback(null);
    setLocked(false);
    setSessionResult(null);
    setQuestion(generateQuestion(selectedLevel));
    resetTimer();
    setPhase('play');
  }

  function handleAnswer(playerSaysPair) {
    if (locked || phase !== 'play' || !question) return;
    setLocked(true);
    const correct = isPair(question.value) === playerSaysPair;
    setFeedback(correct ? 'ok' : 'bad');

    if (correct) {
      setScore(s => s + 1);
      setCombo(c => {
        const next = c + 1;
        triggerCorrect();
        if (next >= 3) triggerCombo(next);
        return next;
      });
    } else {
      setCombo(0);
      triggerWrong();
      logError({
        label: `Parité de ${question.display}`,
        correct: isPair(question.value) ? 'PAIR' : 'IMPAIR',
        given: playerSaysPair ? 'PAIR' : 'IMPAIR',
      });
    }

    nextRef.current = setTimeout(() => {
      setFeedback(null);
      setLocked(false);
      setQuestion(generateQuestion(selectedLevel));
    }, 350);
  }

  if (phase === 'setup') {
    return (
      <div className="an-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="an-title">🎲 Pair ou Impair</h1>
        <p className="an-subtitle">Touche vite la bonne catégorie !</p>

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
          <span>⏱️ 60 secondes</span>
          <span>🎯 {LEVEL_CONFIG[selectedLevel - 1].label}</span>
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
    const stars = calcStars(score, selectedLevel);
    const msg = stars === 3 ? '🎉 Excellent !' : stars === 2 ? '👍 Bien joué !' : '📚 Encore un effort !';
    return (
      <div className="an-page">
        <h2 className="an-result-title">{msg}</h2>
        <div className="jeux-stars">{'★'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
        <div className="jeux-result-stat"><span>Bonnes réponses</span><span>{score}</span></div>
        {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
        {sessionResult?.newUnlocked && (
          <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} débloqué !</div>
        )}
        <div className="an-result-btns">
          <button className="an-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <button className="an-cta an-cta--soft" onPointerDown={() => setPhase('setup')}>Niveaux</button>
          <Link to="/jeux" className="an-cta an-cta--soft">← Jeux</Link>
        </div>
      </div>
    );
  }

  if (!question || phase === 'ending') return null;

  const timePct = (timeLeft / TOTAL_TIME) * 100;
  const urgent = timeLeft <= 10;

  return (
    <div className="an-page pi-page">
      <GameFeedback ref={feedbackRef} />
      <Link to="/jeux" className="exam-back-btn">←</Link>

      {/* HUD */}
      <div className="an-hud">
        <span className="an-score">⭐ {score}</span>
        {combo >= 3 && <span className="pi-combo">🔥 Combo ×{combo}</span>}
        <span className="pi-timer-label">⏱️ {timeLeft}s</span>
      </div>

      {/* Timer bar */}
      <div className="pi-timer-track">
        <div
          className={`pi-timer-fill${urgent ? ' pi-timer-fill--urgent' : ''}`}
          style={{ width: `${timePct}%` }}
        />
      </div>

      {/* Number display */}
      <div className={`pi-number${feedback === 'ok' ? ' pi-number--correct' : feedback === 'bad' ? ' pi-number--wrong' : ''}`}>
        {question.display}
      </div>

      {/* Answer buttons */}
      <div className="pi-answer-row">
        <button
          className="pi-btn pi-btn--pair"
          onPointerDown={e => { e.preventDefault(); handleAnswer(true); }}
          disabled={locked}
        >
          🟦<br />PAIR
        </button>
        <button
          className="pi-btn pi-btn--impair"
          onPointerDown={e => { e.preventDefault(); handleAnswer(false); }}
          disabled={locked}
        >
          🔴<br />IMPAIR
        </button>
      </div>

      <style>{`
        .pi-page { gap: 12px; }
        .pi-combo {
          font-size: .95rem;
          font-weight: 900;
          color: #f97316;
          animation: pi-combo-pop .3s ease;
        }
        @keyframes pi-combo-pop { from { transform: scale(1.4); } to { transform: scale(1); } }
        .pi-timer-label { font-size: .9rem; font-weight: 700; }
        .pi-timer-track {
          width: 100%;
          max-width: 400px;
          height: 10px;
          background: #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }
        .pi-timer-fill {
          height: 100%;
          background: #22c55e;
          border-radius: 8px;
          transition: width .9s linear, background .3s;
        }
        .pi-timer-fill--urgent { background: #ef4444; }
        .pi-number {
          font-size: 4rem;
          font-weight: 900;
          text-align: center;
          min-height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          padding: 12px 32px;
          background: var(--color-surface, #fff);
          box-shadow: 0 4px 16px rgba(0,0,0,0.10);
          transition: background .15s;
          width: 100%;
          max-width: 380px;
        }
        .pi-number--correct { background: #bbf7d0; }
        .pi-number--wrong   { background: #fecaca; }
        .pi-answer-row {
          display: flex;
          gap: 16px;
          width: 100%;
          max-width: 380px;
          margin-top: 8px;
        }
        .pi-btn {
          flex: 1;
          min-height: 100px;
          border: none;
          border-radius: 20px;
          font-size: 1.4rem;
          font-weight: 900;
          cursor: pointer;
          line-height: 1.3;
          transition: transform .1s, opacity .1s;
          touch-action: manipulation;
        }
        .pi-btn:active:not(:disabled) { transform: scale(.93); }
        .pi-btn:disabled { opacity: .5; }
        .pi-btn--pair   { background: #3b82f6; color: #fff; }
        .pi-btn--impair { background: #ef4444; color: #fff; }
      `}</style>
    </div>
  );
}
