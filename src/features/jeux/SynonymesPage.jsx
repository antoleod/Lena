import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import { GameFeedback, useGameFeedback } from './GameFeedback.jsx';
import './jeux.css';

// Each entry: { word, correct }
const WORDS_N1 = [
  { word: 'rapide',     correct: 'vite'      },
  { word: 'content',    correct: 'heureux'   },
  { word: 'beau',       correct: 'joli'      },
  { word: 'grand',      correct: 'immense'   },
  { word: 'petit',      correct: 'minuscule' },
  { word: 'fort',       correct: 'puissant'  },
  { word: 'gentil',     correct: 'aimable'   },
  { word: 'facile',     correct: 'simple'    },
  { word: 'difficile',  correct: 'dur'       },
  { word: 'triste',     correct: 'malheureux'},
  { word: 'commencer',  correct: 'débuter'   },
  { word: 'finir',      correct: 'terminer'  },
];

const WORDS_N2 = [
  ...WORDS_N1,
  { word: 'courageux',  correct: 'brave'     },
  { word: 'intelligent',correct: 'malin'     },
  { word: 'fatigué',    correct: 'épuisé'    },
  { word: 'tranquille', correct: 'calme'     },
  { word: 'chercher',   correct: 'rechercher'},
  { word: 'aider',      correct: 'assister'  },
];

const WORDS_N3 = [
  ...WORDS_N2,
  { word: 'magnifique', correct: 'splendide' },
  { word: 'bizarre',    correct: 'étrange'   },
  { word: 'rapide',     correct: 'prompt'    }, // intentional duplicate word, different correct
  { word: 'ancien',     correct: 'vieux'     },
  { word: 'résoudre',   correct: 'régler'    },
  { word: 'plonger',    correct: "s'immerger"},
];

const WORDS_N4 = [
  ...WORDS_N3,
  { word: 'prolixe',     correct: 'verbeux'      },
  { word: 'pragmatique', correct: 'pratique'     },
  { word: 'austère',     correct: 'sévère'       },
  { word: 'bénin',       correct: 'inoffensif'   },
  { word: 'éphémère',    correct: 'passager'     },
  { word: 'altruiste',   correct: 'généreux'     },
];

const WORDS_N5 = [
  ...WORDS_N4,
  { word: 'acrimonie',      correct: 'aigreur'       },
  { word: 'fastidieux',     correct: 'ennuyeux'      },
  { word: 'perspicace',     correct: 'clairvoyant'   },
  { word: 'intransigeant',  correct: 'inflexible'    },
  { word: 'délétère',       correct: 'nuisible'      },
  { word: 'épicurien',      correct: 'hédoniste'     },
];

const LEVEL_CONFIG = [
  { label: 'N1 — Basique',   pool: WORDS_N1, choiceCount: 4 },
  { label: 'N2 — Intermédiaire', pool: WORDS_N2, choiceCount: 4 },
  { label: 'N3 — Avancé',    pool: WORDS_N3, choiceCount: 4 },
  { label: 'N4 — Expert',    pool: WORDS_N4, choiceCount: 4 },
  { label: 'N5 — Champion',  pool: WORDS_N5, choiceCount: 4 },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRound(deck, index, cfg) {
  const entry = deck[index];
  const { word, correct } = entry;
  // Distractors: other synonyms (correct values) from the pool, excluding this entry's correct
  const allSynonyms = cfg.pool.map(e => e.correct).filter(s => s !== correct);
  const wrongs = shuffle(allSynonyms).slice(0, cfg.choiceCount - 1);
  const choices = shuffle([correct, ...wrongs]);
  return { word, correct, choices };
}

function formatTime(secs) {
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m${secs % 60}s`;
}

export default function SynonymesPage() {
  const { progress, saveSession, resetTimer, logError } = useGameSession('synonymes');
  const { feedbackRef, triggerCorrect, triggerWrong } = useGameFeedback();

  const [phase, setPhase] = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [deck, setDeck] = useState([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null); // null | 'ok' | 'bad'
  const [chosenIdx, setChosenIdx] = useState(null);
  const [sessionResult, setSessionResult] = useState(null);

  const cfg = LEVEL_CONFIG[selectedLevel - 1];
  const questions = cfg.pool.length;

  const round = useMemo(
    () => (deck.length > 0 ? buildRound(deck, roundIndex, cfg) : null),
    [deck, roundIndex, cfg]
  );

  function startGame() {
    const c = LEVEL_CONFIG[selectedLevel - 1];
    const shuffled = shuffle(c.pool);
    setDeck(shuffled);
    setRoundIndex(0);
    setScore(0);
    setFeedback(null);
    setChosenIdx(null);
    setSessionResult(null);
    resetTimer();
    setPhase('play');
  }

  function handleChoice(choice, idx) {
    if (feedback !== null || !round) return;
    const correct = choice === round.correct;
    setChosenIdx(idx);
    setFeedback(correct ? 'ok' : 'bad');
    if (correct) {
      setScore(s => s + 1);
      triggerCorrect();
    } else {
      triggerWrong();
      logError({
        label: `Synonyme de "${round.word}"`,
        correct: round.correct,
        given: choice,
      });
    }
    setTimeout(() => {
      const next = roundIndex + 1;
      if (next >= questions) {
        const finalScore = correct ? score + 1 : score;
        const stars = finalScore >= Math.ceil(questions * 0.86) ? 3
          : finalScore >= Math.ceil(questions * 0.6) ? 2 : 1;
        const result = saveSession({ score: finalScore, level: selectedLevel, stars });
        setSessionResult(result);
        setPhase('results');
        return;
      }
      setRoundIndex(next);
      setFeedback(null);
      setChosenIdx(null);
    }, 900);
  }

  if (phase === 'setup') {
    return (
      <div className="an-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="an-title">🔄 Synonymes</h1>
        <p className="an-subtitle">Trouve le mot qui veut dire la même chose !</p>

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
          <span>📝 {questions} questions</span>
          <span>🎯 {cfg.choiceCount} choix</span>
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
    const stars = score >= Math.ceil(questions * 0.86) ? 3
      : score >= Math.ceil(questions * 0.6) ? 2 : 1;
    const msg = stars === 3 ? '🎉 Parfait !' : stars === 2 ? '👍 Bien joué !' : '📚 Encore un effort !';
    return (
      <div className="an-page">
        <h2 className="an-result-title">{msg}</h2>
        <div className="jeux-stars">{'★'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {questions}</span></div>
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

  if (!round) return null;

  return (
    <div className={`an-page${feedback === 'ok' ? ' an-flash-ok' : feedback === 'bad' ? ' an-flash-bad' : ''}`}>
      <GameFeedback ref={feedbackRef} />
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="an-hud">
        <span className="an-score">⭐ {score}</span>
        <span className="an-round">{roundIndex + 1} / {questions}</span>
      </div>

      <div className="an-word-card">
        <div className="an-label">Synonyme de</div>
        <div className="an-word">{round.word}</div>
      </div>

      <div className="an-choices">
        {round.choices.map((choice, i) => {
          let cls = 'an-choice';
          if (feedback !== null && i === chosenIdx) {
            cls += feedback === 'ok' ? ' an-choice--correct' : ' an-choice--wrong an-choice--shake';
          }
          if (feedback !== null && choice === round.correct && i !== chosenIdx) {
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
