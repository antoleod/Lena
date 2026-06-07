import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

const LEVEL_CONFIG = [
  { label: 'N1 — Heures exactes',       rounds: 10, choiceCount: 3, gen: genN1 },
  { label: 'N2 — Demi-heures',          rounds: 10, choiceCount: 3, gen: genN2 },
  { label: 'N3 — Quarts d\'heure',      rounds: 12, choiceCount: 3, gen: genN3 },
  { label: 'N4 — Toutes les 5 minutes', rounds: 12, choiceCount: 3, gen: genN4 },
  { label: 'N5 — À la minute',          rounds: 15, choiceCount: 4, gen: genN5 },
];

function genN1() {
  return { hour: Math.floor(Math.random() * 12) + 1, minute: 0 };
}
function genN2() {
  return { hour: Math.floor(Math.random() * 12) + 1, minute: 30 };
}
function genN3() {
  const minutes = [15, 45];
  return { hour: Math.floor(Math.random() * 12) + 1, minute: minutes[Math.floor(Math.random() * minutes.length)] };
}
function genN4() {
  const minute = Math.floor(Math.random() * 12) * 5;
  return { hour: Math.floor(Math.random() * 12) + 1, minute };
}
function genN5() {
  return { hour: Math.floor(Math.random() * 12) + 1, minute: Math.floor(Math.random() * 60) };
}

function timeLabel({ hour, minute }) {
  return `${hour}h${String(minute).padStart(2, '0')}`;
}

function timesEqual(a, b) {
  return a.hour === b.hour && a.minute === b.minute;
}

function generateRound(genFn, choiceCount) {
  const correct = genFn();
  const distractors = [];
  let attempts = 0;
  while (distractors.length < choiceCount - 1 && attempts < 200) {
    attempts++;
    const t = genFn();
    if (!timesEqual(t, correct) && !distractors.some(d => timesEqual(d, t))) {
      distractors.push(t);
    }
  }
  const choices = [correct, ...distractors].sort(() => Math.random() - 0.5);
  return { correct, choices };
}

function buildRounds(cfg) {
  return Array.from({ length: cfg.rounds }, () => generateRound(cfg.gen, cfg.choiceCount));
}

function starsFor(correct, total) {
  if (correct === total) return 3;
  if (correct / total >= 0.75) return 2;
  return 1;
}

// Clock hand degrees — exact position for hours hand between marks
function hourDeg(hour, minute) {
  return (hour % 12) * 30 + minute * 0.5;
}
function minuteDeg(minute) {
  return minute * 6;
}

const MAJOR_NUMBERS = [
  { n: 12, top: '6px',  left: '50%', transform: 'translateX(-50%)' },
  { n: 3,  top: '50%',  right: '6px', transform: 'translateY(-50%)' },
  { n: 6,  bottom: '6px', left: '50%', transform: 'translateX(-50%)' },
  { n: 9,  top: '50%',  left: '6px', transform: 'translateY(-50%)' },
];

function ClockFace({ hour, minute }) {
  const hDeg = hourDeg(hour, minute);
  const mDeg = minuteDeg(minute);
  return (
    <div className="hl-clock">
      {MAJOR_NUMBERS.map(({ n, ...pos }) => (
        <div key={n} className="hl-clock-number" style={{ ...pos }}>{n}</div>
      ))}
      <div className="hl-hand hl-hand--hour" style={{ transform: `rotate(${hDeg}deg)` }} />
      <div className="hl-hand hl-hand--minute" style={{ transform: `rotate(${mDeg}deg)` }} />
      <div className="hl-hand--center" />
    </div>
  );
}

function formatTime(secs) {
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m${secs % 60}s`;
}

export default function HorlogePage() {
  const { progress, saveSession, resetTimer } = useGameSession('horloge');

  const [phase, setPhase] = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [rounds, setRounds] = useState([]);
  const [rIdx, setRIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [sessionResult, setSessionResult] = useState(null);
  const lockRef = useRef(false);
  const scoreRef = useRef(0);

  const cfg = LEVEL_CONFIG[selectedLevel - 1];

  const startGame = () => {
    const c = LEVEL_CONFIG[selectedLevel - 1];
    const newRounds = buildRounds(c);
    scoreRef.current = 0;
    setRounds(newRounds);
    setRIdx(0);
    setScore(0);
    setSelected(null);
    setFeedback('');
    setSessionResult(null);
    lockRef.current = false;
    resetTimer();
    setPhase('play');
  };

  const handleChoice = (choice) => {
    if (lockRef.current) return;
    lockRef.current = true;
    const correct = rounds[rIdx].correct;
    const isCorrect = timesEqual(choice, correct);
    setSelected({ choice, correct });
    setFeedback(isCorrect ? 'Bravo !' : `C'était ${timeLabel(correct)} !`);
    if (isCorrect) {
      scoreRef.current += 1;
      setScore(s => s + 1);
    }
    setTimeout(() => {
      const next = rIdx + 1;
      if (next >= cfg.rounds) {
        const stars = starsFor(scoreRef.current, cfg.rounds);
        const result = saveSession({ score: scoreRef.current, level: selectedLevel, stars });
        setSessionResult(result);
        setPhase('results');
      } else {
        setRIdx(next);
        setSelected(null);
        setFeedback('');
        lockRef.current = false;
      }
    }, 1000);
  };

  if (phase === 'setup') {
    return (
      <div className="hl-page">
        <div className="hl-setup-icon">🕐</div>
        <div className="hl-setup-title">Quelle heure est-il ?</div>
        <div className="hl-setup-sub">Regarde l'horloge et trouve la bonne heure !</div>

        <div className="jeux-level-grid">
          {LEVEL_CONFIG.map((lc, i) => {
            const lvl = i + 1;
            const locked = lvl > progress.unlockedLevel;
            const sel = lvl === selectedLevel;
            return (
              <button
                key={lvl}
                className={`jeux-level-btn${sel ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`}
                onPointerDown={() => !locked && setSelectedLevel(lvl)}
                disabled={locked}
              >
                {locked ? '🔒' : `N${lvl}`}
              </button>
            );
          })}
        </div>

        <div className="hl-setup-sub" style={{ marginBottom: 8 }}>{cfg.label} · {cfg.rounds} questions</div>

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

        <button className="hl-cta" onPointerDown={startGame} style={{ marginBottom: 12 }}>
          Commencer !
        </button>
        <Link to="/jeux" style={{ display: 'block', textAlign: 'center', color: 'rgba(255,255,255,.6)', textDecoration: 'none' }}>
          Retour aux jeux
        </Link>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = starsFor(score, cfg.rounds);
    return (
      <div className="hl-page">
        <div className="hl-result-title">Terminé !</div>
        <div className="jeux-stars">{'★'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
        <div className="jeux-result-stat"><span>Bonnes réponses</span><span>{score}/{cfg.rounds}</span></div>
        {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
        {sessionResult?.newUnlocked && (
          <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} débloqué !</div>
        )}
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="hl-cta" onPointerDown={startGame}>Rejouer</button>
          <button className="hl-cta hl-cta--soft" onPointerDown={() => setPhase('setup')}>Niveaux</button>
          <Link to="/jeux" style={{ display: 'block', textAlign: 'center', color: 'rgba(255,255,255,.6)', textDecoration: 'none', marginTop: 8 }}>
            Retour aux jeux
          </Link>
        </div>
      </div>
    );
  }

  const round = rounds[rIdx];
  if (!round) return null;

  return (
    <div className="hl-page">
      <div className="hl-header">
        <Link to="/jeux" className="hl-back">← Jeux</Link>
        <div className="hl-title">Quelle heure ?</div>
      </div>
      <div className="hl-hud">
        <div className="hl-progress">Question {rIdx + 1}/{cfg.rounds}</div>
        <div className="hl-score">{score} pts</div>
      </div>
      <div className="hl-clock-wrap">
        <ClockFace hour={round.correct.hour} minute={round.correct.minute} />
      </div>
      <div className={`hl-feedback${feedback === 'Bravo !' ? ' hl-feedback--ok' : feedback ? ' hl-feedback--bad' : ''}`}>
        {feedback}
      </div>
      <div className="hl-choices">
        {round.choices.map((c, i) => {
          let cls = 'hl-choice';
          if (selected) {
            if (timesEqual(c, selected.correct)) cls += ' hl-choice--correct';
            else if (timesEqual(c, selected.choice)) cls += ' hl-choice--wrong';
          }
          return (
            <button key={i} className={cls} onPointerDown={() => handleChoice(c)}>
              {timeLabel(c)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
