import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

// Flat pool with level tags — level 1 = easiest, 5 = hardest
const ALL_PAIRS = [
  // Level 1 — basic, high-frequency
  { word:'grand',       ant:'petit',       level:1 },
  { word:'chaud',       ant:'froid',       level:1 },
  { word:'jour',        ant:'nuit',        level:1 },
  { word:'propre',      ant:'sale',        level:1 },
  { word:'ouvert',      ant:'ferme',       level:1 },
  { word:'rapide',      ant:'lent',        level:1 },
  { word:'fort',        ant:'faible',      level:1 },
  { word:'heureux',     ant:'triste',      level:1 },
  { word:'haut',        ant:'bas',         level:1 },
  { word:'vieux',       ant:'nouveau',     level:1 },
  { word:'premier',     ant:'dernier',     level:1 },
  { word:'entrer',      ant:'sortir',      level:1 },
  // Level 2 — common adjectives + verbs
  { word:'riche',       ant:'pauvre',      level:2 },
  { word:'plein',       ant:'vide',        level:2 },
  { word:'leger',       ant:'lourd',       level:2 },
  { word:'dur',         ant:'mou',         level:2 },
  { word:'mouille',     ant:'sec',         level:2 },
  { word:'beau',        ant:'laid',        level:2 },
  { word:'gentil',      ant:'mechant',     level:2 },
  { word:'monter',      ant:'descendre',   level:2 },
  { word:'accepter',    ant:'refuser',     level:2 },
  { word:'commencer',   ant:'finir',       level:2 },
  { word:'donner',      ant:'prendre',     level:2 },
  { word:'gagner',      ant:'perdre',      level:2 },
  { word:'allumer',     ant:'eteindre',    level:2 },
  { word:'magnifique',  ant:'horrible',    level:2 },
  { word:'blanc',       ant:'noir',        level:2 },
  { word:'ami',         ant:'ennemi',      level:2 },
  // Level 3 — nuanced adjectives + less-common verbs
  { word:'brave',       ant:'lache',       level:3 },
  { word:'calme',       ant:'agite',       level:3 },
  { word:'clair',       ant:'sombre',      level:3 },
  { word:'serieux',     ant:'drole',       level:3 },
  { word:'facile',      ant:'difficile',   level:3 },
  { word:'vivant',      ant:'mort',        level:3 },
  { word:'construire',  ant:'detruire',    level:3 },
  { word:'aimer',       ant:'detester',    level:3 },
  { word:'avancer',     ant:'reculer',     level:3 },
  { word:'cacher',      ant:'montrer',     level:3 },
  { word:'doux',        ant:'dur',         level:3 },
  { word:'frequent',    ant:'rare',        level:3 },
  { word:'courageux',   ant:'lache',       level:3 },
  // Level 4 — advanced vocabulary
  { word:'aigu',        ant:'grave',       level:4 },
  { word:'abondant',    ant:'rare',        level:4 },
  { word:'precis',      ant:'vague',       level:4 },
  { word:'fragile',     ant:'solide',      level:4 },
  { word:'flexible',    ant:'rigide',      level:4 },
  { word:'proteger',    ant:'attaquer',    level:4 },
  { word:'approuver',   ant:'critiquer',   level:4 },
  { word:'amplifier',   ant:'reduire',     level:4 },
  { word:'maintenir',   ant:'abandonner',  level:4 },
  { word:'absent',      ant:'present',     level:4 },
  { word:'ordonné',     ant:'désordonné',  level:4 },
  // Level 5 — rich vocabulary / tricky
  { word:'humble',      ant:'arrogant',    level:5 },
  { word:'patient',     ant:'impatient',   level:5 },
  { word:'genereux',    ant:'avare',       level:5 },
  { word:'optimiste',   ant:'pessimiste',  level:5 },
  { word:'permanent',   ant:'temporaire',  level:5 },
  { word:'acclamer',    ant:'huer',        level:5 },
  { word:'prospere',    ant:'minable',     level:5 },
  { word:'coherent',    ant:'absurde',     level:5 },
  { word:'superficiel', ant:'profond',     level:5 },
  { word:'sincere',     ant:'hypocrite',   level:5 },
  { word:'timide',      ant:'audacieux',   level:5 },
];

const LEVEL_CONFIG = [
  { id:1,  label:'N1',  n:8,  choices:3, timePerQ:null, poolLevel:[1]     },
  { id:2,  label:'N2',  n:8,  choices:3, timePerQ:null, poolLevel:[1]     },
  { id:3,  label:'N3',  n:10, choices:3, timePerQ:null, poolLevel:[1,2]   },
  { id:4,  label:'N4',  n:10, choices:4, timePerQ:null, poolLevel:[1,2]   },
  { id:5,  label:'N5',  n:10, choices:4, timePerQ:null, poolLevel:[1,2]   },
  { id:6,  label:'N6',  n:12, choices:4, timePerQ:20,   poolLevel:[1,2,3] },
  { id:7,  label:'N7',  n:12, choices:4, timePerQ:20,   poolLevel:[1,2,3] },
  { id:8,  label:'N8',  n:12, choices:4, timePerQ:15,   poolLevel:[2,3]   },
  { id:9,  label:'N9',  n:15, choices:4, timePerQ:15,   poolLevel:[2,3]   },
  { id:10, label:'N10', n:15, choices:4, timePerQ:12,   poolLevel:[2,3,4] },
  { id:11, label:'N11', n:15, choices:5, timePerQ:12,   poolLevel:[3,4]   },
  { id:12, label:'N12', n:15, choices:5, timePerQ:10,   poolLevel:[3,4]   },
  { id:13, label:'N13', n:20, choices:5, timePerQ:10,   poolLevel:[3,4,5] },
  { id:14, label:'N14', n:20, choices:5, timePerQ:8,    poolLevel:[4,5]   },
  { id:15, label:'N15', n:20, choices:5, timePerQ:6,    poolLevel:[4,5]   },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRound(cfg) {
  const pool = ALL_PAIRS.filter(p => cfg.poolLevel.includes(p.level));
  return shuffle(pool).slice(0, cfg.n);
}

function buildQuestion(pairs, index, cfg) {
  const { word, ant: correct } = pairs[index];
  const distractors = pairs
    .filter((_, i) => i !== index)
    .map(p => p.ant);
  const wrongs = shuffle(distractors).slice(0, cfg.choices - 1);
  const choices = shuffle([correct, ...wrongs]);
  return { word, correct, choices };
}

function formatTime(secs) {
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m${secs % 60}s`;
}

export default function AntonymesPage() {
  const { progress, saveSession, resetTimer, logError } = useGameSession('antonymes');

  const [phase, setPhase] = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(Math.min(progress.unlockedLevel, 15));
  const [pairs, setPairs] = useState([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [chosenIdx, setChosenIdx] = useState(null);
  const [sessionResult, setSessionResult] = useState(null);
  const [qTimer, setQTimer] = useState(null);
  const [qTimerPct, setQTimerPct] = useState(100);

  const qTimerRef = useRef(null);

  const cfg = LEVEL_CONFIG[selectedLevel - 1];

  const round = useMemo(
    () => (pairs.length > 0 && roundIndex < pairs.length ? buildQuestion(pairs, roundIndex, cfg) : null),
    [pairs, roundIndex, cfg]
  );

  // Per-question countdown
  useEffect(() => {
    if (phase !== 'play' || !cfg.timePerQ) return;
    setQTimer(cfg.timePerQ);
    setQTimerPct(100);
    qTimerRef.current = setInterval(() => {
      setQTimer(t => {
        if (t <= 1) {
          clearInterval(qTimerRef.current);
          // Time out — count as wrong and advance
          if (feedback === null) {
            advance(false, score, roundIndex, cfg);
          }
          return 0;
        }
        setQTimerPct(((t - 1) / cfg.timePerQ) * 100);
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(qTimerRef.current);
  }, [phase, roundIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  function advance(isCorrect, currentScore, currentIndex, currentCfg) {
    const next = currentIndex + 1;
    if (next >= currentCfg.n) {
      const finalScore = isCorrect ? currentScore + 1 : currentScore;
      const stars = finalScore >= Math.ceil(currentCfg.n * 0.86) ? 3
        : finalScore >= Math.ceil(currentCfg.n * 0.6) ? 2 : 1;
      const result = saveSession({ score: finalScore, level: selectedLevel, stars });
      setSessionResult(result);
      setPhase('results');
      return;
    }
    setRoundIndex(next);
    setFeedback(null);
    setChosenIdx(null);
  }

  function startGame() {
    const c = LEVEL_CONFIG[selectedLevel - 1];
    const shuffled = buildRound(c);
    setPairs(shuffled);
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
    clearInterval(qTimerRef.current);
    const correct = choice === round.correct;
    setChosenIdx(idx);
    setFeedback(correct ? 'ok' : 'bad');
    if (correct) {
      setScore(s => {
        const ns = s + 1;
        setTimeout(() => advance(true, ns, roundIndex, cfg), 900);
        return ns;
      });
    } else {
      logError({ label: `Contraire de "${round.word}"`, correct: round.correct, given: choice });
      setTimeout(() => advance(false, score, roundIndex, cfg), 900);
    }
  }

  if (phase === 'setup') {
    return (
      <div className="an-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="an-title">Antonymes</h1>
        <p className="an-subtitle">Trouve le contraire du mot affiche !</p>

        <div className="jeux-level-grid">
          {LEVEL_CONFIG.map(lc => {
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

        <div className="an-info-row">
          <span>📝 {cfg.n} questions</span>
          <span>🎯 {cfg.choices} choix</span>
          {cfg.timePerQ && <span>⏱ {cfg.timePerQ}s/question</span>}
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
    const stars = score >= Math.ceil(cfg.n * 0.86) ? 3
      : score >= Math.ceil(cfg.n * 0.6) ? 2 : 1;
    const msg = stars === 3 ? '🎉 Parfait !' : stars === 2 ? '👍 Bien joue !' : '📚 Encore un effort !';
    return (
      <div className="an-page">
        <h2 className="an-result-title">{msg}</h2>
        <div className="jeux-stars">{'★'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {cfg.n}</span></div>
        {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
        {sessionResult?.newUnlocked && (
          <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} debloque !</div>
        )}
        <div className="an-result-btns">
          <button className="an-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <button className="an-cta an-cta--soft" onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}>Niveaux</button>
          <Link to="/jeux" className="an-cta an-cta--soft">← Jeux</Link>
        </div>
      </div>
    );
  }

  if (!round) return null;

  return (
    <div className={`an-page${feedback === 'ok' ? ' an-flash-ok' : feedback === 'bad' ? ' an-flash-bad' : ''}`}>
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="an-hud">
        <span className="an-score">⭐ {score}</span>
        <span className="an-round">{roundIndex + 1} / {cfg.n}</span>
      </div>

      {cfg.timePerQ && (
        <div className="sm-timer-bar" style={{ marginBottom: 8 }}>
          <div className="sm-timer-fill" style={{ width: `${qTimerPct}%`, background: qTimerPct < 30 ? '#ef4444' : '#22c55e' }} />
        </div>
      )}

      <div className="an-word-card">
        <div className="an-label">Trouve le contraire de</div>
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
