import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

const TOTAL_ROUNDS = 15;

const LEVELS = [
  { id: 'cp', label: 'CP', desc: 'Nombres 1–20', color: '#22c55e' },
  { id: 'ce1', label: 'CE1', desc: 'Nombres 1–100', color: '#f59e0b' },
  { id: 'ce2', label: 'CE2', desc: 'Nombres 1–1000 + décimaux', color: '#ec4899' },
];

const CE2_POOL = [
  1.5, 2.5, 3.2, 4.7, 5.0, 6.8, 7.3, 8.9, 9.1, 10.4,
  11.6, 12.0, 13.5, 14.2, 15.8, 20.5, 25.0, 30.7, 50.3, 75.9,
  100, 125, 200, 250, 333, 500, 750, 999, 1000, 0.5,
];

function generateNumbers(levelId) {
  let nums;
  if (levelId === 'cp') {
    const pool = Array.from({ length: 20 }, (_, i) => i + 1);
    nums = pickUnique(pool, 3);
  } else if (levelId === 'ce1') {
    const pool = Array.from({ length: 100 }, (_, i) => i + 1);
    nums = pickUnique(pool, 3);
  } else {
    nums = pickUnique(CE2_POOL, 3);
  }
  // Shuffle so they're not in order
  return shuffle(nums);
}

function pickUnique(pool, count) {
  const copy = [...pool];
  const result = [];
  for (let i = 0; i < count; i++) {
    const j = Math.floor(Math.random() * copy.length);
    result.push(copy[j]);
    copy.splice(j, 1);
  }
  return result;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function calcStars(score) {
  if (score >= 13) return 3;
  if (score >= 9) return 2;
  return 1;
}

export default function PlusPetitPlusGrandPage() {
  const [phase, setPhase] = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [roundNum, setRoundNum] = useState(0);
  const [score, setScore] = useState(0);
  const [numbers, setNumbers] = useState([]);
  const [tapped, setTapped] = useState([]); // indices into numbers array, in tap order
  const [shaking, setShaking] = useState(false);
  const [flashing, setFlashing] = useState(false);

  function startGame(levelId) {
    setSelectedLevel(levelId);
    setRoundNum(1);
    setScore(0);
    setNumbers(generateNumbers(levelId));
    setTapped([]);
    setShaking(false);
    setFlashing(false);
    setPhase('play');
  }

  function nextRound(newScore) {
    if (roundNum >= TOTAL_ROUNDS) {
      setScore(newScore);
      setPhase('results');
    } else {
      setRoundNum(r => r + 1);
      setNumbers(generateNumbers(selectedLevel));
      setTapped([]);
      setScore(newScore);
    }
  }

  const handleTap = useCallback((idx) => {
    if (shaking || flashing) return;
    if (tapped.includes(idx)) return;
    const newTapped = [...tapped, idx];
    setTapped(newTapped);

    if (newTapped.length === 3) {
      const sorted = [...numbers].sort((a, b) => a - b);
      const correct = newTapped.every((ni, pos) => numbers[ni] === sorted[pos]);
      if (correct) {
        setFlashing(true);
        const ns = score + 1;
        setTimeout(() => {
          setFlashing(false);
          nextRound(ns);
        }, 800);
      } else {
        setShaking(true);
        setTimeout(() => {
          setShaking(false);
          setTapped([]);
        }, 700);
      }
    }
  }, [tapped, numbers, shaking, flashing, score, roundNum, selectedLevel]);

  if (phase === 'setup') {
    return (
      <div className="pp-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="pp-title">Plus Petit ou Plus Grand ?</h1>
        <p className="pp-subtitle">Tape les 3 nombres du plus petit au plus grand</p>
        <div className="pp-levels">
          {LEVELS.map(lv => (
            <button
              key={lv.id}
              className={`pp-level-btn${selectedLevel === lv.id ? ' is-selected' : ''}`}
              style={{ '--lv-color': lv.color }}
              onPointerDown={e => { e.preventDefault(); setSelectedLevel(lv.id); }}
            >
              <span className="pp-level-badge">{lv.label}</span>
              <span className="pp-level-desc">{lv.desc}</span>
            </button>
          ))}
        </div>
        <button
          className="pp-cta"
          disabled={!selectedLevel}
          onPointerDown={e => { e.preventDefault(); if (selectedLevel) startGame(selectedLevel); }}
        >
          Jouer !
        </button>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = calcStars(score);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    return (
      <div className="pp-page">
        <h2 className="pp-result-title">
          {stars === 3 ? '🎉 Parfait !' : stars === 2 ? '👍 Bien joué !' : '🔢 Continue !'}
        </h2>
        <div className="jeux-stars">{starStr}</div>
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {TOTAL_ROUNDS}</span></div>
        <button className="pp-cta" style={{ marginTop: 24 }} onPointerDown={e => { e.preventDefault(); setPhase('setup'); setSelectedLevel(null); }}>
          Rejouer
        </button>
        <Link to="/jeux" className="pp-back-link">← Retour aux jeux</Link>
      </div>
    );
  }

  return (
    <div className="pp-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="pp-hud">
        <span className="pp-progress">Tour {roundNum} / {TOTAL_ROUNDS}</span>
        <span className="pp-score">⭐ {score}</span>
      </div>
      <div className="pp-instruction">Tape du plus petit au plus grand</div>
      <div className={`pp-cards${shaking ? ' pp-cards--shake' : ''}${flashing ? ' pp-cards--flash' : ''}`}>
        {numbers.map((n, idx) => {
          const tapPos = tapped.indexOf(idx);
          const isTapped = tapPos !== -1;
          return (
            <button
              key={idx}
              className={`pp-card${isTapped ? ' pp-card--tapped' : ''}`}
              onPointerDown={e => { e.preventDefault(); handleTap(idx); }}
            >
              <span className="pp-card-num">{n}</span>
              {isTapped && <span className="pp-card-badge">{tapPos + 1}</span>}
            </button>
          );
        })}
      </div>
      {tapped.length > 0 && tapped.length < 3 && (
        <button
          className="pp-reset-btn"
          onPointerDown={e => { e.preventDefault(); setTapped([]); }}
        >
          ↺ Recommencer
        </button>
      )}
    </div>
  );
}
