import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

const TOTAL_ROUNDS = 10;

// Generate random time: whole hours or half-hours
function randomTime() {
  const hour = Math.floor(Math.random() * 12) + 1; // 1-12
  const minute = Math.random() < 0.5 ? 0 : 30;
  return { hour, minute };
}

function timeLabel({ hour, minute }) {
  return `${hour}h${minute === 0 ? '00' : '30'}`;
}

function timesEqual(a, b) {
  return a.hour === b.hour && a.minute === b.minute;
}

function generateRound() {
  const correct = randomTime();
  const distractors = [];
  while (distractors.length < 2) {
    const t = randomTime();
    if (!timesEqual(t, correct) && !distractors.some(d => timesEqual(d, t))) {
      distractors.push(t);
    }
  }
  const choices = [correct, ...distractors].sort(() => Math.random() - 0.5);
  return { correct, choices };
}

function buildRounds() {
  return Array.from({ length: TOTAL_ROUNDS }, generateRound);
}

function starsFor(correct, total) {
  const r = correct / total;
  if (r >= 0.8) return '★★★';
  if (r >= 0.5) return '★★☆';
  return '★☆☆';
}

// Clock hand degrees
function hourDeg(hour, minute) {
  return (hour % 12) * 30 + minute * 0.5;
}
function minuteDeg(minute) {
  return minute * 6;
}

// Clock numbers: 12, 3, 6, 9 placed around circle
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
      {/* Hour hand */}
      <div
        className="hl-hand hl-hand--hour"
        style={{ transform: `rotate(${hDeg}deg)` }}
      />
      {/* Minute hand */}
      <div
        className="hl-hand hl-hand--minute"
        style={{ transform: `rotate(${mDeg}deg)` }}
      />
      {/* Center dot */}
      <div className="hl-hand--center" />
    </div>
  );
}

export default function HorlogePage() {
  const [phase, setPhase] = useState('setup');
  const [rounds, setRounds] = useState([]);
  const [rIdx, setRIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null); // { choice, correct }
  const [feedback, setFeedback] = useState('');
  const lockRef = useRef(false);

  const startGame = () => {
    setRounds(buildRounds());
    setRIdx(0);
    setScore(0);
    setSelected(null);
    setFeedback('');
    lockRef.current = false;
    setPhase('play');
  };

  const handleChoice = (choice) => {
    if (lockRef.current) return;
    lockRef.current = true;
    const correct = rounds[rIdx].correct;
    const isCorrect = timesEqual(choice, correct);
    setSelected({ choice, correct });
    setFeedback(isCorrect ? 'Bravo !' : `C'etait ${timeLabel(correct)} !`);
    if (isCorrect) setScore(s => s + 1);
    setTimeout(() => {
      const next = rIdx + 1;
      if (next >= TOTAL_ROUNDS) {
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
        <div className="hl-setup-sub">Regarde l'horloge et trouve la bonne heure ! 10 questions.</div>
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
    const stars = starsFor(score, TOTAL_ROUNDS);
    return (
      <div className="hl-page">
        <div className="hl-result-title">Termine !</div>
        <div className="jeux-stars">{stars}</div>
        <div className="jeux-result-stat"><span>Bonnes reponses</span><span>{score}/{TOTAL_ROUNDS}</span></div>
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="hl-cta" onPointerDown={startGame}>Rejouer</button>
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
        <div className="hl-progress">Question {rIdx + 1}/{TOTAL_ROUNDS}</div>
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
