import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

// N1: 10 basic pairs, 3 choices
const PAIRS_N1 = [
  ['grand', 'petit'], ['chaud', 'froid'], ['rapide', 'lent'], ['fort', 'faible'],
  ['jour', 'nuit'], ['propre', 'sale'], ['riche', 'pauvre'], ['vieux', 'nouveau'],
  ['heureux', 'triste'], ['haut', 'bas'],
];

// N2: 15 pairs including verbs, 4 choices
const PAIRS_N2 = [
  ...PAIRS_N1,
  ['ouvrir', 'fermer'], ['monter', 'descendre'], ['entrer', 'sortir'],
  ['acheter', 'vendre'], ['allumer', 'éteindre'],
];

// N3: 20 pairs including nuanced adjectives, 4 choices
const PAIRS_N3 = [
  ...PAIRS_N2,
  ['magnifique', 'horrible'], ['doux', 'dur'], ['lourd', 'léger'],
  ['blanc', 'noir'], ['ami', 'ennemi'],
];

// N4: 25 pairs with less common words, 4 choices
const PAIRS_N4 = [
  ...PAIRS_N3,
  ['fréquent', 'rare'], ['précis', 'vague'], ['courageux', 'lâche'],
  ['généreux', 'avare'], ['absent', 'présent'],
];

// N5: 30 pairs — synonyms mixed as decoys (identified by side:'synonym')
const PAIRS_N5 = [
  ...PAIRS_N4,
  ['ordonné', 'désordonné'], ['patient', 'impatient'],
  ['sincère', 'hypocrite'], ['timide', 'audacieux'], ['fragile', 'solide'],
];

// Synonyms pool used as N5 decoys
const SYNONYMS_N5 = {
  'grand': 'immense', 'petit': 'minuscule', 'chaud': 'brûlant', 'rapide': 'vif',
  'fort': 'puissant', 'heureux': 'joyeux', 'propre': 'net', 'riche': 'aisé',
  'vieux': 'ancien', 'dur': 'ferme', 'lourd': 'pesant', 'doux': 'tendre',
  'magnifique': 'splendide', 'courageux': 'brave', 'généreux': 'charitable',
  'sincère': 'honnête', 'fragile': 'délicat', 'patient': 'calme',
  'timide': 'réservé', 'ordonné': 'rangé',
};

const LEVEL_CONFIG = [
  { label: 'N1 — Contraires basiques', pairs: PAIRS_N1, questions: 10, choiceCount: 3, n5Decoy: false },
  { label: 'N2 — Verbes inclus',       pairs: PAIRS_N2, questions: 15, choiceCount: 4, n5Decoy: false },
  { label: 'N3 — Adjectifs nuancés',   pairs: PAIRS_N3, questions: 20, choiceCount: 4, n5Decoy: false },
  { label: 'N4 — Vocabulaire avancé',  pairs: PAIRS_N4, questions: 25, choiceCount: 4, n5Decoy: false },
  { label: 'N5 — Synonymes pièges',    pairs: PAIRS_N5, questions: 30, choiceCount: 4, n5Decoy: true  },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRound(pairs, index, cfg) {
  const [word, correct] = pairs[index];
  // Collect distractor antonyms from other pairs
  const distractors = pairs
    .filter((_, i) => i !== index)
    .map(([, ant]) => ant);
  const wrongs = shuffle(distractors).slice(0, cfg.choiceCount - 1);

  // N5: replace one wrong with a synonym of the word (a trap)
  if (cfg.n5Decoy && SYNONYMS_N5[word] && wrongs.length >= 2) {
    wrongs[wrongs.length - 1] = SYNONYMS_N5[word];
  }

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
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [pairs, setPairs] = useState([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [chosenIdx, setChosenIdx] = useState(null);
  const [sessionResult, setSessionResult] = useState(null);

  const cfg = LEVEL_CONFIG[selectedLevel - 1];

  const round = useMemo(
    () => (pairs.length > 0 ? buildRound(pairs, roundIndex, cfg) : null),
    [pairs, roundIndex, cfg]
  );

  function startGame() {
    const c = LEVEL_CONFIG[selectedLevel - 1];
    const shuffled = shuffle(c.pairs).slice(0, c.questions);
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
    const correct = choice === round.correct;
    setChosenIdx(idx);
    setFeedback(correct ? 'ok' : 'bad');
    if (correct) {
      setScore(s => s + 1);
    } else {
      logError({
        label: `Contraire de "${round.word}"`,
        correct: round.correct,
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
        <h1 className="an-title">🔄 Antonymes</h1>
        <p className="an-subtitle">Trouve le contraire du mot affiché !</p>

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
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="an-hud">
        <span className="an-score">⭐ {score}</span>
        <span className="an-round">{roundIndex + 1} / {cfg.questions}</span>
      </div>

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
