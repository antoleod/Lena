import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import { GameFeedback, useGameFeedback } from './GameFeedback.jsx';
import './jeux.css';

// { flag, country, capital }
const COUNTRIES_N1 = [
  { flag: '🇫🇷', country: 'France',        capital: 'Paris'      },
  { flag: '🇧🇪', country: 'Belgique',       capital: 'Bruxelles'  },
  { flag: '🇩🇪', country: 'Allemagne',      capital: 'Berlin'     },
  { flag: '🇮🇹', country: 'Italie',         capital: 'Rome'       },
  { flag: '🇪🇸', country: 'Espagne',        capital: 'Madrid'     },
  { flag: '🇳🇱', country: 'Pays-Bas',       capital: 'Amsterdam'  },
  { flag: '🇵🇹', country: 'Portugal',       capital: 'Lisbonne'   },
  { flag: '🇨🇭', country: 'Suisse',         capital: 'Berne'      },
  { flag: '🇬🇧', country: 'Royaume-Uni',    capital: 'Londres'    },
  { flag: '🇦🇹', country: 'Autriche',       capital: 'Vienne'     },
];

const COUNTRIES_N2 = [
  ...COUNTRIES_N1,
  { flag: '🇺🇸', country: 'États-Unis',     capital: 'Washington' },
  { flag: '🇨🇦', country: 'Canada',         capital: 'Ottawa'     },
  { flag: '🇧🇷', country: 'Brésil',         capital: 'Brasília'   },
  { flag: '🇦🇷', country: 'Argentine',      capital: 'Buenos Aires'},
  { flag: '🇲🇽', country: 'Mexique',        capital: 'Mexico'     },
  { flag: '🇯🇵', country: 'Japon',          capital: 'Tokyo'      },
  { flag: '🇨🇳', country: 'Chine',          capital: 'Pékin'      },
  { flag: '🇮🇳', country: 'Inde',           capital: 'New Delhi'  },
  { flag: '🇷🇺', country: 'Russie',         capital: 'Moscou'     },
  { flag: '🇦🇺', country: 'Australie',      capital: 'Canberra'   },
];

const COUNTRIES_N3 = [
  ...COUNTRIES_N2,
  { flag: '🇵🇱', country: 'Pologne',        capital: 'Varsovie'   },
  { flag: '🇸🇪', country: 'Suède',          capital: 'Stockholm'  },
  { flag: '🇳🇴', country: 'Norvège',        capital: 'Oslo'       },
  { flag: '🇩🇰', country: 'Danemark',       capital: 'Copenhague' },
  { flag: '🇬🇷', country: 'Grèce',          capital: 'Athènes'    },
  { flag: '🇹🇷', country: 'Turquie',        capital: 'Ankara'     },
  { flag: '🇨🇿', country: 'Tchéquie',       capital: 'Prague'     },
  { flag: '🇭🇺', country: 'Hongrie',        capital: 'Budapest'   },
];

const COUNTRIES_N4 = [
  ...COUNTRIES_N3,
  { flag: '🇸🇦', country: 'Arabie saoudite',capital: 'Riyad'      },
  { flag: '🇵🇰', country: 'Pakistan',       capital: 'Islamabad'  },
  { flag: '🇮🇩', country: 'Indonésie',      capital: 'Jakarta'    },
  { flag: '🇰🇷', country: 'Corée du Sud',   capital: 'Séoul'      },
  { flag: '🇿🇦', country: 'Afrique du Sud', capital: 'Pretoria'   },
  { flag: '🇳🇬', country: 'Nigeria',        capital: 'Abuja'      },
  { flag: '🇪🇬', country: 'Égypte',         capital: 'Le Caire'   },
  { flag: '🇦🇪', country: 'Émirats arabes', capital: 'Abou Dabi'  },
];

const COUNTRIES_N5 = [
  ...COUNTRIES_N4,
  { flag: '🇹🇭', country: 'Thaïlande',     capital: 'Bangkok'    },
  { flag: '🇻🇳', country: 'Viêt Nam',       capital: 'Hanoï'      },
  { flag: '🇦🇿', country: 'Azerbaïdjan',    capital: 'Bakou'      },
  { flag: '🇰🇿', country: 'Kazakhstan',     capital: 'Astana'     },
  { flag: '🇺🇦', country: 'Ukraine',        capital: 'Kiev'       },
  { flag: '🇮🇷', country: 'Iran',           capital: 'Téhéran'    },
  { flag: '🇲🇦', country: 'Maroc',          capital: 'Rabat'      },
  { flag: '🇹🇳', country: 'Tunisie',        capital: 'Tunis'      },
];

const LEVEL_CONFIG = [
  { label: 'N1 — Europe facile',   pool: COUNTRIES_N1, questions: 15 },
  { label: 'N2 — Le monde',        pool: COUNTRIES_N2, questions: 15 },
  { label: 'N3 — Europe avancé',   pool: COUNTRIES_N3, questions: 15 },
  { label: 'N4 — Continents',      pool: COUNTRIES_N4, questions: 15 },
  { label: 'N5 — Expert mondial',  pool: COUNTRIES_N5, questions: 15 },
];

const CHOICES = 4;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build a deck of 15 questions from the pool (allowing repeats if pool < 15)
function buildDeck(pool, questions) {
  if (pool.length >= questions) return shuffle(pool).slice(0, questions);
  // Repeat the pool until we have enough
  const deck = [];
  while (deck.length < questions) {
    deck.push(...shuffle(pool));
  }
  return deck.slice(0, questions);
}

function buildRound(deck, index, pool) {
  const entry = deck[index];
  const { capital } = entry;
  // Distractors from pool, excluding the correct capital
  const others = pool.filter(c => c.capital !== capital).map(c => c.capital);
  const wrongs = shuffle(others).slice(0, CHOICES - 1);
  const choices = shuffle([capital, ...wrongs]);
  return { entry, capital, choices };
}

function formatTime(secs) {
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m${secs % 60}s`;
}

export default function CapitalesPage() {
  const { progress, saveSession, resetTimer, logError } = useGameSession('capitales');
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

  const round = useMemo(
    () => (deck.length > 0 ? buildRound(deck, roundIndex, cfg.pool) : null),
    [deck, roundIndex, cfg]
  );

  function startGame() {
    const c = LEVEL_CONFIG[selectedLevel - 1];
    const d = buildDeck(c.pool, c.questions);
    setDeck(d);
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
    const correct = choice === round.capital;
    setChosenIdx(idx);
    setFeedback(correct ? 'ok' : 'bad');
    if (correct) {
      setScore(s => s + 1);
      triggerCorrect();
    } else {
      triggerWrong();
      logError({
        label: `Capitale de ${round.entry.flag} ${round.entry.country}`,
        correct: round.capital,
        given: choice,
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
      setFeedback(null);
      setChosenIdx(null);
    }, 900);
  }

  if (phase === 'setup') {
    return (
      <div className="an-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="an-title">🗺️ Drapeaux et Capitales</h1>
        <p className="an-subtitle">Quelle est la capitale de ce pays ?</p>

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
          <span>🌍 {cfg.pool.length} pays</span>
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

  if (!round) return null;

  return (
    <div className={`an-page${feedback === 'ok' ? ' an-flash-ok' : feedback === 'bad' ? ' an-flash-bad' : ''}`}>
      <GameFeedback ref={feedbackRef} />
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="an-hud">
        <span className="an-score">⭐ {score}</span>
        <span className="an-round">{roundIndex + 1} / {cfg.questions}</span>
      </div>

      <div className="cap-country-card">
        <div className="cap-flag">{round.entry.flag}</div>
        <div className="cap-country-name">{round.entry.country}</div>
        <div className="cap-question">Quelle est sa capitale ?</div>
      </div>

      <div className="an-choices">
        {round.choices.map((choice, i) => {
          let cls = 'an-choice';
          if (feedback !== null && i === chosenIdx) {
            cls += feedback === 'ok' ? ' an-choice--correct' : ' an-choice--wrong an-choice--shake';
          }
          if (feedback !== null && choice === round.capital && i !== chosenIdx) {
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

      <style>{`
        .cap-country-card {
          background: var(--color-surface, #fff);
          border-radius: 20px;
          padding: 24px 20px;
          margin: 16px 0 20px;
          text-align: center;
          box-shadow: 0 4px 16px rgba(0,0,0,0.10);
        }
        .cap-flag { font-size: 4rem; line-height: 1.1; }
        .cap-country-name { font-size: 1.5rem; font-weight: 900; margin-top: 8px; }
        .cap-question { font-size: 0.95rem; opacity: .7; margin-top: 6px; }
      `}</style>
    </div>
  );
}
