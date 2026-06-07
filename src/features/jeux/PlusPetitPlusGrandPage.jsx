import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

// ── Level configs ──────────────────────────────────────────────────────────

const LEVEL_CONFIG = [
  { n: 1, label: 'Niveau 1', desc: '3 nombres 1-10, 15 tours',   cardCount: 3, totalRounds: 15, type: 'int10' },
  { n: 2, label: 'Niveau 2', desc: '3 nombres 1-100, 15 tours',  cardCount: 3, totalRounds: 15, type: 'int100' },
  { n: 3, label: 'Niveau 3', desc: '4 nombres 1-100, 12 tours',  cardCount: 4, totalRounds: 12, type: 'int100' },
  { n: 4, label: 'Niveau 4', desc: '4 nombres 1-1000 + decimaux, 12 tours', cardCount: 4, totalRounds: 12, type: 'dec1000' },
  { n: 5, label: 'Niveau 5', desc: '5 nombres dont negatifs et fractions, 10 tours', cardCount: 5, totalRounds: 10, type: 'mixed' },
];

const CE2_POOL = [
  1.5, 2.5, 3.2, 4.7, 5.0, 6.8, 7.3, 8.9, 9.1, 10.4,
  11.6, 12.0, 13.5, 14.2, 15.8, 20.5, 25.0, 30.7, 50.3, 75.9,
  100, 125, 200, 250, 333, 500, 750, 999, 1000, 0.5,
];

// Display labels for special values
const DISPLAY_LABEL = {
  0.5: '½',
  0.25: '¼',
  '-5': '-5',
};

function displayVal(v) {
  if (DISPLAY_LABEL[String(v)]) return DISPLAY_LABEL[String(v)];
  if (DISPLAY_LABEL[v]) return DISPLAY_LABEL[v];
  return String(v);
}

const MIXED_POOL = [
  -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  12, 15, 18, 20, 25, 30, 35, 40, 45, 50,
  0.5, 0.25,
];

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

function generateNumbers(cfg) {
  let pool;
  switch (cfg.type) {
    case 'int10':
      pool = Array.from({ length: 10 }, (_, i) => i + 1);
      break;
    case 'int100':
      pool = Array.from({ length: 100 }, (_, i) => i + 1);
      break;
    case 'dec1000':
      pool = CE2_POOL;
      break;
    case 'mixed':
      pool = MIXED_POOL;
      break;
    default:
      pool = Array.from({ length: 10 }, (_, i) => i + 1);
  }
  return shuffle(pickUnique(pool, cfg.cardCount));
}

function calcStars(score, totalRounds) {
  const pct = score / totalRounds;
  if (pct >= 0.86) return 3;
  if (pct >= 0.6)  return 2;
  return 1;
}

export default function PlusPetitPlusGrandPage() {
  const { progress, saveSession, resetTimer } = useGameSession('comparaison');

  const [phase, setPhase]         = useState('setup');
  const [levelNum, setLevelNum]   = useState(progress.unlockedLevel);
  const [roundNum, setRoundNum]   = useState(0);
  const [score, setScore]         = useState(0);
  const [numbers, setNumbers]     = useState([]);
  const [tapped, setTapped]       = useState([]);
  const [shaking, setShaking]     = useState(false);
  const [flashing, setFlashing]   = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const cfg = LEVEL_CONFIG[levelNum - 1];

  function startGame() {
    resetTimer();
    setRoundNum(1);
    setScore(0);
    setNumbers(generateNumbers(cfg));
    setTapped([]);
    setShaking(false);
    setFlashing(false);
    setLastResult(null);
    setPhase('play');
  }

  function nextRound(newScore) {
    if (roundNum >= cfg.totalRounds) {
      const stars = calcStars(newScore, cfg.totalRounds);
      const result = saveSession({ score: newScore, level: levelNum, stars });
      setScore(newScore);
      setLastResult(result);
      setPhase('results');
    } else {
      setRoundNum(r => r + 1);
      setNumbers(generateNumbers(cfg));
      setTapped([]);
      setScore(newScore);
    }
  }

  const handleTap = useCallback((idx) => {
    if (shaking || flashing) return;
    if (tapped.includes(idx)) return;
    const newTapped = [...tapped, idx];
    setTapped(newTapped);

    if (newTapped.length === cfg.cardCount) {
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
  }, [tapped, numbers, shaking, flashing, score, roundNum, cfg]);

  // ── Setup ──────────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="pp-page" style={{ background: 'linear-gradient(135deg, #1a0533 0%, #0f0a1e 60%)' }}>
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="pp-title">⚡ Plus Vite!</h1>
        <p className="pp-subtitle">Tape les nombres du plus petit au plus grand</p>

        {progress.sessionsPlayed > 0 && (
          <div className="jeux-setup-stats">
            <div className="jeux-setup-stat">
              <span className="jeux-setup-stat__val">⭐ {progress.bestScore}</span>
              <span className="jeux-setup-stat__lbl">Meilleur score</span>
            </div>
            <div className="jeux-setup-stat">
              <span className="jeux-setup-stat__val">Niv.{progress.bestLevel}</span>
              <span className="jeux-setup-stat__lbl">Niveau atteint</span>
            </div>
            <div className="jeux-setup-stat">
              <span className="jeux-setup-stat__val">{progress.sessionsPlayed}</span>
              <span className="jeux-setup-stat__lbl">Parties</span>
            </div>
          </div>
        )}

        <div className="jeux-level-grid">
          {LEVEL_CONFIG.map(lv => {
            const locked = lv.n > progress.unlockedLevel;
            return (
              <button
                key={lv.n}
                className={`jeux-level-btn${levelNum === lv.n ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`}
                onPointerDown={e => { e.preventDefault(); if (!locked) setLevelNum(lv.n); }}
                disabled={locked}
              >
                <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>N{lv.n}</span>
                <span style={{ fontSize: '.72rem', opacity: .8, textAlign: 'center' }}>{lv.desc}</span>
                {locked && <span style={{ fontSize: '.7rem' }}>🔒</span>}
              </button>
            );
          })}
        </div>

        <button
          className="pp-cta"
          style={{ marginTop: 16 }}
          onPointerDown={e => { e.preventDefault(); startGame(); }}
        >
          Jouer !
        </button>
      </div>
    );
  }

  // ── Results ────────────────────────────────────────────────────────────────
  if (phase === 'results') {
    const stars = calcStars(score, cfg.totalRounds);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    return (
      <div className="pp-page" style={{ background: 'linear-gradient(135deg, #1a0533 0%, #0f0a1e 60%)' }}>
        <h2 className="pp-result-title">
          {stars === 3 ? '🎉 Parfait !' : stars === 2 ? '👍 Bien joue !' : '🔢 Continue !'}
        </h2>
        <div className="jeux-stars">{starStr}</div>
        {lastResult?.isNewBest && <div className="jeux-new-best">Nouveau record !</div>}
        {lastResult?.newUnlocked && (
          <div className="jeux-unlocked">Niveau {levelNum + 1} debloque !</div>
        )}
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {cfg.totalRounds}</span></div>
        <div className="jeux-result-stat"><span>Niveau</span><span>N{levelNum}</span></div>
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button className="pp-cta" style={{ flex: 1 }} onPointerDown={e => { e.preventDefault(); startGame(); }}>
            Rejouer
          </button>
          <button className="pp-cta" style={{ flex: 1, background: 'rgba(255,255,255,.12)' }}
            onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}
          >
            Niveaux
          </button>
        </div>
        <Link to="/jeux" className="pp-back-link">← Retour aux jeux</Link>
      </div>
    );
  }

  // ── Play ───────────────────────────────────────────────────────────────────
  const streak = tapped.length;
  return (
    <div className="pp-page" style={{ background: 'linear-gradient(135deg, #1a0533 0%, #0f0a1e 60%)' }}>
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="pp-hud">
        <span className="pp-progress" style={{ fontFamily: 'monospace' }}>Tour {roundNum} / {cfg.totalRounds}</span>
        <span className="pp-score" style={{ fontFamily: 'monospace', color: '#fbbf24' }}>
          {streak > 0 ? `🏎️ ×${streak}` : `⭐ ${score}`}
        </span>
      </div>
      <div className="pp-instruction" style={{ fontWeight: 700, color: '#fbbf24', fontSize: '1rem' }}>
        Tape du plus petit au plus grand ({cfg.cardCount} nombres)
      </div>
      <div className={`pp-cards${shaking ? ' pp-cards--shake' : ''}${flashing ? ' pp-cards--flash' : ''}`}>
        {numbers.map((n, idx) => {
          const tapPos = tapped.indexOf(idx);
          const isTapped = tapPos !== -1;
          return (
            <button
              key={idx}
              className={`pp-card${isTapped ? ' pp-card--tapped' : ''}`}
              style={{
                minHeight: 120,
                borderRadius: 20,
                background: isTapped
                  ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
                  : 'rgba(255,255,255,.09)',
                border: isTapped ? '2px solid #a855f7' : '2px solid rgba(255,255,255,.2)',
                boxShadow: isTapped ? '0 0 20px rgba(168,85,247,.5)' : undefined,
              }}
              onPointerDown={e => { e.preventDefault(); handleTap(idx); }}
            >
              <span className="pp-card-num" style={{ fontSize: '2rem', fontWeight: 900, color: isTapped ? '#fff' : '#fbbf24', textShadow: '0 0 15px rgba(251,191,36,.4)' }}>{displayVal(n)}</span>
              {isTapped && <span className="pp-card-badge">{tapPos + 1}</span>}
            </button>
          );
        })}
      </div>
      {tapped.length > 0 && tapped.length < cfg.cardCount && (
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
