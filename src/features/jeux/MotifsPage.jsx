import { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

const EMOJI_SETS = {
  shapes: ['⭕', '🔷', '🔺', '🔶'],
  colors: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣'],
  animals: ['🐱', '🐶', '🐰', '🐸'],
  weather: ['☀️', '🌤️', '⛅', '🌧️'],
};

// Pattern rules: given a sequence of elements (0-based indices into a set),
// build a repeating pattern
const RULES = {
  AB: (s) => [s[0], s[1], s[0], s[1], s[0]],
  ABB: (s) => [s[0], s[1], s[1], s[0], s[1]],
  AABB: (s) => [s[0], s[0], s[1], s[1], s[0]],
  ABAC: (s) => [s[0], s[1], s[0], s[2], s[0]],
  ABCABC: (s) => [s[0], s[1], s[2], s[0], s[1]],
};

const LEVELS = [
  { label: 'N1', key: 'n1', emoji: '🔴', rules: ['AB'], sets: ['colors', 'animals'] },
  { label: 'N2', key: 'n2', emoji: '🔷', rules: ['AB', 'ABB', 'AABB'], sets: ['shapes', 'colors', 'animals', 'weather'] },
  { label: 'N3', key: 'n3', emoji: '⭕', rules: ['ABAC', 'ABCABC', 'ABB', 'AABB'], sets: ['shapes', 'colors', 'animals', 'weather'] },
];

const TIMER = 60;
const ROUNDS = 10;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestion(cfg) {
  const ruleName = cfg.rules[Math.floor(Math.random() * cfg.rules.length)];
  const setName = cfg.sets[Math.floor(Math.random() * cfg.sets.length)];
  const set = EMOJI_SETS[setName];
  const shuffledSet = shuffle(set);
  const ruleF = RULES[ruleName];
  const indices = ruleF([0, 1, 2, 3]);
  const pattern = indices.map(i => shuffledSet[i] || shuffledSet[0]);
  // The 5th in pattern is shown, and we ask what comes NEXT (6th)
  const shown = pattern.slice(0, 4);
  // compute next element using the rule
  const fullRule = ruleF([0, 1, 2, 3]);
  const nextIdx = fullRule[5 % fullRule.length] ?? fullRule[0];
  const correct = shuffledSet[nextIdx] || shuffledSet[0];

  // distractors: other emojis from set that are not correct
  const wrong = shuffle(shuffledSet.filter(e => e !== correct));
  // add some from other sets
  const otherSets = Object.values(EMOJI_SETS).flat().filter(e => !shuffledSet.includes(e));
  const combined = shuffle([...wrong, ...shuffle(otherSets)]);
  const choices = shuffle([correct, ...combined.slice(0, 3)]);
  return { shown, correct, choices };
}

function calcStars(score, rounds) {
  const pct = score / rounds;
  if (pct >= 0.9) return 3;
  if (pct >= 0.6) return 2;
  return pct >= 0.3 ? 1 : 0;
}

export default function MotifsPage() {
  const { progress, saveSession, resetTimer } = useGameSession('motifs');
  const [phase, setPhase] = useState('setup');
  const [levelIdx, setLevelIdx] = useState(0);
  const [question, setQuestion] = useState(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIMER);
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);
  const scoreRef = useRef(0);
  const roundRef = useRef(0);

  const endGame = useCallback((finalScore) => {
    clearInterval(timerRef.current);
    const stars = calcStars(finalScore, ROUNDS);
    const res = saveSession({ score: finalScore, level: levelIdx + 1, stars });
    setResult({ score: finalScore, stars, ...res });
    setPhase('results');
  }, [saveSession, levelIdx]);

  const nextQ = useCallback((cfg) => {
    setQuestion(generateQuestion(cfg));
    setChosen(null);
  }, []);

  const startGame = useCallback((idx) => {
    clearInterval(timerRef.current);
    const cfg = LEVELS[idx];
    setLevelIdx(idx);
    setRound(0);
    setScore(0);
    setTimeLeft(TIMER);
    scoreRef.current = 0;
    roundRef.current = 0;
    setQuestion(generateQuestion(cfg));
    resetTimer();
    setPhase('play');

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          endGame(scoreRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [resetTimer, endGame]);

  const handleChoice = useCallback((choice) => {
    if (chosen !== null) return;
    setChosen(choice);
    const isCorrect = choice === question.correct;
    if (isCorrect) { scoreRef.current += 1; setScore(scoreRef.current); }
    roundRef.current += 1;
    setRound(roundRef.current);
    setTimeout(() => {
      if (roundRef.current >= ROUNDS) {
        endGame(scoreRef.current);
      } else {
        nextQ(LEVELS[levelIdx]);
      }
    }, 700);
  }, [chosen, question, levelIdx, nextQ, endGame]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const best = progress?.bestScore ?? 0;
  const cfg = LEVELS[levelIdx];

  if (phase === 'setup') {
    return (
      <div className="sm-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="sm-setup">
          <div className="sm-setup__hero">
            <div className="sm-setup__emoji">🔁</div>
            <h1 className="sm-setup__title">Motifs</h1>
            <p className="sm-setup__sub">Trouve le prochain élément !</p>
            {best > 0 && <p className="sm-setup__sub">Meilleur score : {best}</p>}
          </div>
          <div className="sm-level-section">
            <p className="sm-level-title">Choisir un niveau</p>
            <div className="jeux-level-grid">
              {LEVELS.map((lv, i) => (
                <button key={lv.key} className="jeux-level-btn" onClick={() => startGame(i)}>
                  <span>{lv.emoji}</span>
                  <span>{lv.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'results') {
    return (
      <div className="sm-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="game-results">
          <div className="game-results__emoji">🔁</div>
          <h2 className="game-results__title">Résultat</h2>
          <div className="game-results__stars">{'⭐'.repeat(result.stars)}{'☆'.repeat(3 - result.stars)}</div>
          <div className="game-results__stats">
            <div className="game-results__stat"><span>Score</span><strong>{result.score}/{ROUNDS}</strong></div>
            {result.isNewBest && <div className="jeux-new-best">Nouveau record !</div>}
          </div>
          <button className="game-results__btn" onClick={() => startGame(levelIdx)}>Rejouer</button>
          <button className="game-results__btn" style={{marginTop:8}} onClick={() => { clearInterval(timerRef.current); setPhase('setup'); }}>Menu</button>
        </div>
      </div>
    );
  }

  if (!question) return null;
  return (
    <div className="sm-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="game-hud">
        <span className="game-hud__score">Score : {score}</span>
        <span className="game-hud__round">{round}/{ROUNDS}</span>
      </div>
      <div className="game-timer-bar">
        <div className={`game-timer-fill${timeLeft <= 10 ? ' game-timer-fill--urgent' : ''}`} style={{ width: `${(timeLeft / TIMER) * 100}%` }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px', gap: 20 }}>
        <div className="game-question-card">
          <div className="game-question-sub">{cfg.emoji} Niveau {cfg.label}</div>
          <div className="game-question-text" style={{ letterSpacing: '0.1em', fontSize: '2rem' }}>
            {question.shown.join(' ')} <span style={{ opacity: 0.4 }}>?</span>
          </div>
          <div className="game-question-sub">Quel est le prochain élément ?</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {question.choices.map((c, i) => {
            let cls = 'sm-choice';
            if (chosen !== null) {
              if (c === question.correct) cls += ' is-correct';
              else if (c === chosen) cls += ' is-wrong';
            }
            return (
              <button key={i} className={cls} onClick={() => handleChoice(c)}
                style={{ '--btn-color': '#7c3aed', fontSize: '2rem' }}>{c}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
