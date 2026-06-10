import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import { formatDuration } from '../../services/storage/gameProgressStore.js';
import { GameFeedback, useGameFeedback } from './GameFeedback.jsx';
import './jeux.css';

const LEVELS = [
  { label: 'Niveau 1 — CP',  max: 10, time: 25, twoStep: false },
  { label: 'Niveau 2 — CE1', max: 20, time: 20, twoStep: false },
  { label: 'Niveau 3 — CE2', max: 50, time: 15, twoStep: false },
  { label: 'Niveau 4 — CM1', max: 10, time: 12, twoStep: false },
  { label: 'Niveau 5 — CM2', max: 10, time: 10, twoStep: true  },
];

const ALL_OPS = ['+', '-', '×', '÷'];
const OP_LABELS = { '+': '+', '-': '−', '×': '×', '÷': '÷' };

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeQuestion(ops, max, twoStep) {
  const canTwoStep = twoStep && ops.includes('×');
  if (canTwoStep && Math.random() < 0.5) {
    // Two-step: "a×b+c = ?"
    const a = Math.floor(Math.random() * 9) + 2;
    const b = Math.floor(Math.random() * 9) + 2;
    const c = Math.floor(Math.random() * 9) + 1;
    const answer = a * b + c;
    const wrongs = new Set();
    while (wrongs.size < 3) {
      const w = answer + (Math.floor(Math.random() * 9) - 4);
      if (w !== answer && w > 0) wrongs.add(w);
    }
    return { text: `${a}×${b}+${c} = ?`, answer, choices: shuffle([answer, ...[...wrongs]]) };
  }

  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;

  if (op === '+') {
    a = Math.floor(Math.random() * max) + 1;
    b = Math.floor(Math.random() * (max - a)) + 1;
    answer = a + b;
  } else if (op === '-') {
    a = Math.floor(Math.random() * max) + 2;
    b = Math.floor(Math.random() * (a - 1)) + 1;
    answer = a - b;
  } else if (op === '×') {
    a = Math.floor(Math.random() * max) + 2;
    b = Math.floor(Math.random() * max) + 2;
    answer = a * b;
  } else { // ÷
    b = Math.floor(Math.random() * 9) + 2;
    answer = Math.floor(Math.random() * 9) + 2;
    a = b * answer;
  }

  const opChar = op;
  const wrongs = new Set();
  while (wrongs.size < 3) {
    const w = answer + (Math.floor(Math.random() * 7) - 3);
    if (w !== answer && w > 0) wrongs.add(w);
  }
  return { text: `${a} ${opChar} ${b} = ?`, answer, choices: shuffle([answer, ...[...wrongs]]) };
}

const SCENES_BY_LEVEL = [
  ['🌊 Dans l\'océan, des bulles remontent…', '🌈 Dans le jardin magique…', '🚀 À bord de la fusée…', '🏰 Dans le château enchanté…', '🌿 Dans la forêt des nombres…'],
  ['🌌 Dans la galaxie des chiffres…', '🎪 Au grand cirque des maths…', '🏖️ Sur la plage au soleil…', '🦄 Dans la forêt des licornes…', '🎩 Dans le chapeau du magicien…'],
  ['⚡ Dans le laboratoire secret…', '🌋 Au sommet du volcan…', '🔮 Dans la tour du sorcier…', '🌊 Sur les flots de l\'aventure…', '🛸 Dans la station spatiale…'],
  ['🤖 Dans l\'usine des robots…', '🔬 Dans le labo de chimie…', '🏆 Dans l\'arène des champions…', '🌍 En orbite autour de la Terre…', '⚗️ Dans l\'atelier du savant…'],
  ['🧬 Au cœur du code secret…', '🌠 Aux confins de l\'univers…', '🏛️ Dans le temple de la sagesse…', '⚔️ Dans la bataille des géants…', '🔭 Sous les étoiles du savoir…'],
];

const BUBBLE_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899'];
const BUBBLE_POSITIONS = [
  { left: '8%',  top: '30%' },
  { left: '28%', top: '15%' },
  { left: '58%', top: '20%' },
  { left: '76%', top: '38%' },
];
const ROUNDS = 10;

export default function BullesCalculPage() {
  const { progress, saveSession, resetTimer, elapsedSecs } = useGameSession('bulles-calcul');
  const { feedbackRef, triggerCorrect, triggerWrong, triggerScore, triggerCombo } = useGameFeedback();

  const [phase, setPhase]       = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(Math.min(progress.unlockedLevel, 5));
  const [selectedOps, setSelectedOps] = useState(['+', '-', '×', '÷']);
  const [question, setQuestion] = useState(null);
  const [score, setScore]       = useState(0);
  const [round, setRound]       = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak]     = useState(0);
  const [sessionResult, setSessionResult] = useState(null);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [feedbackText, setFeedbackText] = useState(null);
  const timerRef = useRef(null);
  const selectedOpsRef = useRef(selectedOps);
  useEffect(() => { selectedOpsRef.current = selectedOps; }, [selectedOps]);

  function toggleOp(op) {
    setSelectedOps(prev => {
      if (prev.includes(op)) {
        if (prev.length === 1) return prev;
        return prev.filter(o => o !== op);
      }
      return [...prev, op];
    });
  }

  function startGame() {
    setScore(0); setRound(0); setStreak(0); setFeedback(null); setSessionResult(null); setFeedbackText(null);
    const scenes = SCENES_BY_LEVEL[selectedLevel - 1];
    setSceneIdx(Math.floor(Math.random() * scenes.length));
    resetTimer();
    const lvl = LEVELS[selectedLevel - 1];
    const q = makeQuestion(selectedOpsRef.current, lvl.max, lvl.twoStep);
    setQuestion(q);
    setTimeLeft(lvl.time);
    setPhase('play');
  }

  function nextQuestion(currentRound, currentScore, currentStreak) {
    const lvl = LEVELS[selectedLevel - 1];
    if (currentRound >= ROUNDS) {
      const stars = currentScore >= ROUNDS * 1.8 ? 3 : currentScore >= ROUNDS ? 2 : 1;
      const secs = elapsedSecs();
      const result = saveSession({ score: currentScore, level: selectedLevel, stars });
      setSessionResult({ ...result, timeSecs: secs, stars });
      setPhase('results');
      return;
    }
    setQuestion(makeQuestion(selectedOpsRef.current, lvl.max, lvl.twoStep));
    setTimeLeft(lvl.time);
    setRound(currentRound);
  }

  useEffect(() => {
    if (phase !== 'play' || feedback !== null) return;
    const lvl = LEVELS[selectedLevel - 1];
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleAnswer(null);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, question, feedback]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleAnswer(val) {
    clearInterval(timerRef.current);
    if (feedback !== null) return;
    const correct = val !== null && val === question?.answer;
    setFeedback(correct ? 'ok' : 'bad');
    let newScore = score;
    let newStreak = streak;
    if (correct) {
      const bonus = newStreak >= 2 ? 2 : 1;
      newScore = score + bonus;
      newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      triggerCorrect();
      triggerScore(`+${bonus * 10}`);
      if (newStreak >= 3) triggerCombo(newStreak);
      const txt = newStreak >= 3 ? `Combo ×${newStreak} ! 🔥` : newStreak === 2 ? 'Parfait ! ⚡' : `+${bonus * 10} XP · Bien joué !`;
      setFeedbackText(txt);
      setTimeout(() => setFeedbackText(null), 1000);
    } else {
      newStreak = 0;
      setStreak(0);
      triggerWrong();
    }
    const nextRound = round + 1;
    setTimeout(() => {
      setFeedback(null);
      const scenes = SCENES_BY_LEVEL[selectedLevel - 1];
      setSceneIdx(Math.floor(Math.random() * scenes.length));
      nextQuestion(nextRound, newScore, newStreak);
    }, 900);
  }

  const level = LEVELS[selectedLevel - 1];

  if (phase === 'setup') {
    return (
      <div className="bc-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="bc-title">🫧 Bulles de Calcul</h1>
        <p className="bc-subtitle">Crève la bonne bulle !</p>

        <div className="jeux-setup-stats">
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{progress.bestScore || 0}</span>
            <span className="jeux-setup-stat__lbl">Meilleur score</span>
          </div>
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{progress.sessionsPlayed || 0}</span>
            <span className="jeux-setup-stat__lbl">Parties</span>
          </div>
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{formatDuration(progress.totalTimeSecs || 0)}</span>
            <span className="jeux-setup-stat__lbl">Temps total</span>
          </div>
        </div>

        <div className="jeux-level-grid">
          {LEVELS.map((l, i) => {
            const lvl = i + 1;
            const locked = lvl > progress.unlockedLevel;
            return (
              <button
                key={lvl}
                className={`jeux-level-btn${selectedLevel === lvl ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`}
                onPointerDown={e => { e.preventDefault(); if (!locked) setSelectedLevel(lvl); }}
              >
                {locked ? '🔒' : `Niveau ${lvl}`}
                {!locked && progress.bestLevel >= lvl && <span className="jeux-level-stars">★</span>}
              </button>
            );
          })}
        </div>
        <p style={{ textAlign: 'center', opacity: .65, fontSize: '.82rem', color: '#fff', marginBottom: 12 }}>
          {level.label} — {level.time}s par bulle
        </p>

        <div className="jeux-ops-label">Opérations :</div>
        <div className="jeux-ops-grid">
          {ALL_OPS.map(op => (
            <button
              key={op}
              className={`jeux-ops-btn${selectedOps.includes(op) ? ' is-on' : ''}`}
              onPointerDown={() => toggleOp(op)}
            >
              {OP_LABELS[op]}
            </button>
          ))}
        </div>

        <button className="bc-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>▶ Jouer</button>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = score >= ROUNDS * 1.8 ? 3 : score >= ROUNDS ? 2 : 1;
    const emoji = stars === 3 ? '🏆' : stars === 2 ? '🎉' : '📚';
    const title = stars === 3 ? 'Super !' : stars === 2 ? 'Bien joué !' : 'Continue !';
    return (
      <div className="bc-page">
        <GameFeedback ref={feedbackRef} />
        <div className="game-results">
          <div className="game-results__emoji">{emoji}</div>
          <div className="game-results__title">{title}</div>
          <div className="game-results__stars">{'★'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
          {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
          {sessionResult?.newUnlocked && <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} débloqué !</div>}
          <div className="game-results__stats">
            <div className="game-results__stat">
              <span className="game-results__stat-val">{score}</span>
              <span className="game-results__stat-lbl">Score</span>
            </div>
            <div className="game-results__stat">
              <span className="game-results__stat-val">{ROUNDS}</span>
              <span className="game-results__stat-lbl">Questions</span>
            </div>
            {sessionResult && (
              <div className="game-results__stat">
                <span className="game-results__stat-val">{sessionResult.timeSecs}s</span>
                <span className="game-results__stat-lbl">Temps</span>
              </div>
            )}
          </div>
          <button className="game-results__btn" onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <button className="game-results__btn game-results__btn--soft" onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}>Niveaux</button>
          <Link to="/jeux" className="game-results__btn game-results__btn--soft" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>← Jeux</Link>
        </div>
      </div>
    );
  }

  const timerPct = (timeLeft / level.time) * 100;

  return (
    <div className="bc-page">
      <GameFeedback ref={feedbackRef} />
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="bc-hud game-hud">
        <span className="bc-score game-hud__score">⭐ {score}</span>
        {streak >= 2 && <span className="bc-streak game-hud__streak">🔥 ×{streak}</span>}
        <span className="game-hud__level">Niv.{selectedLevel}</span>
        <span className="bc-round game-hud__round">{round + 1} / {ROUNDS}</span>
      </div>
      <div className="bc-timer-bar game-timer-bar">
        <div
          className={`bc-timer-fill game-timer-fill${timerPct < 30 ? ' game-timer-fill--urgent' : ''}`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      <div className="game-scene-header">
        <span className="game-scene-header__emoji">{SCENES_BY_LEVEL[selectedLevel - 1][sceneIdx].split(' ')[0]}</span>
        <span className="game-scene-header__text">{SCENES_BY_LEVEL[selectedLevel - 1][sceneIdx].slice(SCENES_BY_LEVEL[selectedLevel - 1][sceneIdx].indexOf(' ') + 1)}</span>
      </div>

      <div className="bc-question game-question-card">
        <div className="game-question-text">{question?.text}</div>
      </div>
      {feedbackText && <div className="game-xp-text">{feedbackText}</div>}

      <div className={`bc-bubbles${feedback === 'ok' ? ' bc-flash-ok' : feedback === 'bad' ? ' bc-flash-bad' : ''}`}>
        {question?.choices.map((choice, i) => (
          <button
            key={choice}
            className="bc-bubble bc-bubble--gamefeel"
            style={{
              '--bc-color': BUBBLE_COLORS[i],
              left: BUBBLE_POSITIONS[i].left,
              top:  BUBBLE_POSITIONS[i].top,
              animationDelay: `${i * 0.4}s`,
            }}
            onPointerDown={e => { e.preventDefault(); handleAnswer(choice); }}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
