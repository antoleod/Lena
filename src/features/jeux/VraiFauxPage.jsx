import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import { GameFeedback, useGameFeedback } from './GameFeedback.jsx';
import './jeux.css';

const STATEMENTS = [
  // N1 — faits simples
  { text: "La Belgique est en Europe.", answer: true, level: 1 },
  { text: "Le chat est un oiseau.", answer: false, level: 1 },
  { text: "2 + 2 = 4", answer: true, level: 1 },
  { text: "Paris est la capitale de l'Espagne.", answer: false, level: 1 },
  { text: "Le soleil se lève à l'est.", answer: true, level: 1 },
  { text: "Il y a 7 jours dans une semaine.", answer: true, level: 1 },
  { text: "Les dauphins sont des poissons.", answer: false, level: 1 },
  { text: "La Lune tourne autour de la Terre.", answer: true, level: 1 },
  { text: "3 × 5 = 20", answer: false, level: 1 },
  { text: "Un triangle a 4 côtés.", answer: false, level: 1 },
  // N2 — sciences & nature
  { text: "Les plantes fabriquent leur nourriture grâce au soleil.", answer: true, level: 2 },
  { text: "L'eau bout à 80°C au niveau de la mer.", answer: false, level: 2 },
  { text: "Les baleines sont des mammifères.", answer: true, level: 2 },
  { text: "La Terre a deux satellites naturels.", answer: false, level: 2 },
  { text: "Les abeilles produisent du miel.", answer: true, level: 2 },
  { text: "Les champignons sont des plantes.", answer: false, level: 2 },
  { text: "La lumière voyage plus vite que le son.", answer: true, level: 2 },
  { text: "Le cœur d'un humain bat environ 1000 fois par minute.", answer: false, level: 2 },
  { text: "L'oxygène représente 21% de l'air.", answer: true, level: 2 },
  { text: "Les dinosaures ont vécu avec les premiers humains.", answer: false, level: 2 },
  // N3 — histoire & géographie
  { text: "Charlemagne était un roi franc.", answer: true, level: 3 },
  { text: "L'Amazone est le plus long fleuve du monde.", answer: false, level: 3 },
  { text: "La Révolution française a eu lieu en 1789.", answer: true, level: 3 },
  { text: "Le Mont Everest est en Europe.", answer: false, level: 3 },
  { text: "L'Afrique est le plus grand continent.", answer: false, level: 3 },
  { text: "Jules César était un général romain.", answer: true, level: 3 },
  { text: "La première Guerre mondiale a commencé en 1914.", answer: true, level: 3 },
  { text: "Le Sahara est un désert froid.", answer: false, level: 3 },
  // N4 — sciences avancées
  { text: "L'ADN contient l'information génétique.", answer: true, level: 4 },
  { text: "La photosynthèse produit de l'oxygène.", answer: true, level: 4 },
  { text: "Les atomes sont constitués de protons, neutrons et électrons.", answer: true, level: 4 },
  { text: "La vitesse du son est plus rapide dans l'air que dans l'eau.", answer: false, level: 4 },
  { text: "Le pH de l'eau pure est de 7.", answer: true, level: 4 },
  // N5 — questions piège
  { text: "Le zéro est un nombre pair.", answer: true, level: 5 },
  { text: "Un carré est un cas particulier de rectangle.", answer: true, level: 5 },
  { text: "Les virus sont des êtres vivants.", answer: false, level: 5 },
  { text: "Pi vaut exactement 3,14.", answer: false, level: 5 },
  { text: "L'Antarctique est le continent le plus froid.", answer: true, level: 5 },
];

const LEVEL_CONFIG = [
  { label: 'N1 — Faits simples',     level: 1, questions: 10 },
  { label: 'N2 — Sciences & nature', level: 2, questions: 10 },
  { label: 'N3 — Histoire & géo',    level: 3, questions: 8  },
  { label: 'N4 — Sciences avancées', level: 4, questions: 5  },
  { label: 'N5 — Questions pièges',  level: 5, questions: 5  },
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

export default function VraiFauxPage() {
  const { progress, saveSession, resetTimer, logError } = useGameSession('vrai-faux');
  const { feedbackRef, triggerCorrect, triggerWrong } = useGameFeedback();

  const [phase, setPhase] = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [deck, setDeck] = useState([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedbackState, setFeedbackState] = useState(null); // null | 'correct' | 'wrong'
  const [sessionResult, setSessionResult] = useState(null);

  const cfg = LEVEL_CONFIG[selectedLevel - 1];
  const current = deck[roundIndex] ?? null;

  function startGame() {
    const c = LEVEL_CONFIG[selectedLevel - 1];
    const pool = STATEMENTS.filter(s => s.level === c.level);
    const shuffled = shuffle(pool).slice(0, c.questions);
    setDeck(shuffled);
    setRoundIndex(0);
    setScore(0);
    setFeedbackState(null);
    setSessionResult(null);
    resetTimer();
    setPhase('play');
  }

  function handleAnswer(playerAnswer) {
    if (feedbackState !== null || !current) return;
    const correct = playerAnswer === current.answer;
    setFeedbackState(correct ? 'correct' : 'wrong');
    if (correct) {
      setScore(s => s + 1);
      triggerCorrect();
    } else {
      triggerWrong();
      logError({
        label: current.text,
        correct: current.answer ? 'VRAI' : 'FAUX',
        given: playerAnswer ? 'VRAI' : 'FAUX',
      });
    }
    setTimeout(() => {
      const next = roundIndex + 1;
      if (next >= cfg.questions) {
        const finalScore = correct ? score + 1 : score;
        const stars = finalScore >= Math.ceil(cfg.questions * 0.86) ? 3
          : finalScore >= Math.ceil(cfg.questions * 0.6) ? 2 : 1;
        const result = saveSession({ score: finalScore, level: selectedLevel, stars });
        setSessionResult(result);
        setPhase('results');
        return;
      }
      setRoundIndex(next);
      setFeedbackState(null);
    }, 1100);
  }

  if (phase === 'setup') {
    return (
      <div className="an-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="an-title">✅ Vrai ou Faux ?</h1>
        <p className="an-subtitle">Lis la phrase — est-ce vrai ou faux ?</p>

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
          <button className="an-cta an-cta--soft" onPointerDown={() => setPhase('setup')}>Niveaux</button>
          <Link to="/jeux" className="an-cta an-cta--soft">← Jeux</Link>
        </div>
      </div>
    );
  }

  if (!current) return null;

  const flashCls = feedbackState === 'correct' ? ' an-flash-ok' : feedbackState === 'wrong' ? ' an-flash-bad' : '';

  return (
    <div className={`an-page${flashCls}`}>
      <GameFeedback ref={feedbackRef} />
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="an-hud">
        <span className="an-score">⭐ {score}</span>
        <span className="an-round">{roundIndex + 1} / {cfg.questions}</span>
      </div>

      <div className="vf-card">
        <p className="vf-statement">{current.text}</p>
        {feedbackState === 'wrong' && (
          <p className="vf-correct-reveal">
            Bonne réponse : {current.answer ? '✅ VRAI' : '❌ FAUX'}
          </p>
        )}
      </div>

      <div className="vf-btns">
        <button
          className={`vf-btn vf-btn--true${feedbackState !== null ? ' vf-btn--disabled' : ''}`}
          onPointerDown={e => { e.preventDefault(); handleAnswer(true); }}
          disabled={feedbackState !== null}
        >
          ✅ VRAI
        </button>
        <button
          className={`vf-btn vf-btn--false${feedbackState !== null ? ' vf-btn--disabled' : ''}`}
          onPointerDown={e => { e.preventDefault(); handleAnswer(false); }}
          disabled={feedbackState !== null}
        >
          ❌ FAUX
        </button>
      </div>

      <style>{`
        .vf-card {
          background: var(--color-surface, #fff);
          border-radius: 16px;
          padding: 28px 20px;
          margin: 16px 0 24px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.10);
          min-height: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .vf-statement {
          font-size: 1.25rem;
          font-weight: 700;
          text-align: center;
          line-height: 1.4;
          margin: 0;
        }
        .vf-correct-reveal {
          font-size: 1rem;
          font-weight: 600;
          color: #22c55e;
          margin: 0;
          animation: vf-reveal-in .2s ease;
        }
        @keyframes vf-reveal-in { from { opacity:0; transform:translateY(6px);} to {opacity:1;transform:none;} }
        .vf-btns {
          display: flex;
          gap: 16px;
          width: 100%;
          max-width: 380px;
        }
        .vf-btn {
          flex: 1;
          min-height: 70px;
          border: none;
          border-radius: 16px;
          font-size: 1.3rem;
          font-weight: 900;
          cursor: pointer;
          transition: transform .1s, opacity .1s;
          touch-action: manipulation;
        }
        .vf-btn:active { transform: scale(.95); }
        .vf-btn--true  { background: #22c55e; color: #fff; }
        .vf-btn--false { background: #ef4444; color: #fff; }
        .vf-btn--disabled { opacity: .55; pointer-events: none; }
      `}</style>
    </div>
  );
}
