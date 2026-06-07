import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

const ALL_PAIRS = [
  ['grand', 'petit'],
  ['chaud', 'froid'],
  ['rapide', 'lent'],
  ['fort', 'faible'],
  ['jour', 'nuit'],
  ['ami', 'ennemi'],
  ['propre', 'sale'],
  ['riche', 'pauvre'],
  ['vieux', 'nouveau'],
  ['heureux', 'triste'],
  ['ouvert', 'fermé'],
  ['lourd', 'léger'],
  ['haut', 'bas'],
  ['doux', 'dur'],
  ['blanc', 'noir'],
];

const ROUNDS = 12;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build a round: given the current word, pick 3 wrong antonyms from other pairs
function buildRound(pairs, index) {
  const [word, correct] = pairs[index];
  // Collect distractor words — use the antonym side of other pairs
  const distractors = pairs
    .filter((_, i) => i !== index)
    .map(([, ant]) => ant);
  const wrongs = shuffle(distractors).slice(0, 3);
  const choices = shuffle([correct, ...wrongs]);
  return { word, correct, choices };
}

export default function AntonymesPage() {
  const [phase, setPhase] = useState('setup');
  const [pairs, setPairs] = useState([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null); // null | 'ok' | 'bad'
  const [chosenIdx, setChosenIdx] = useState(null);

  // Memoised: choices must not re-shuffle on feedback/chosenIdx re-renders or
  // chosenIdx would highlight the wrong button after state updates.
  const round = useMemo(
    () => (pairs.length > 0 ? buildRound(pairs, roundIndex) : null),
    [pairs, roundIndex]
  );

  function startGame() {
    const shuffled = shuffle(ALL_PAIRS).slice(0, ROUNDS);
    setPairs(shuffled);
    setRoundIndex(0);
    setScore(0);
    setFeedback(null);
    setChosenIdx(null);
    setPhase('play');
  }

  function handleChoice(choice, idx) {
    if (feedback !== null || !round) return;
    const correct = choice === round.correct;
    setChosenIdx(idx);
    setFeedback(correct ? 'ok' : 'bad');
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      const next = roundIndex + 1;
      if (next >= ROUNDS) {
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
        <div className="an-demo-card">
          <div className="an-demo-word">grand</div>
          <div className="an-demo-arrow">↕</div>
          <div className="an-demo-ant">petit</div>
        </div>
        <div className="an-info-row">
          <span>📝 {ROUNDS} questions</span>
          <span>⭐ 1 pt / bonne réponse</span>
        </div>
        <button className="an-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>
          ▶ Jouer
        </button>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = score >= 11 ? 3 : score >= 8 ? 2 : 1;
    const msg = stars === 3 ? '🎉 Parfait !' : stars === 2 ? '👍 Bien joué !' : '📚 Encore un effort !';
    return (
      <div className="an-page">
        <h2 className="an-result-title">{msg}</h2>
        <div className="jeux-stars">{'★'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {ROUNDS}</span></div>
        <div className="an-result-btns">
          <button className="an-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
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
        <span className="an-round">{roundIndex + 1} / {ROUNDS}</span>
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
