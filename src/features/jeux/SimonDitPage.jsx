import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

const COLORS = [
  { id: 'rouge', emoji: '🔴', label: 'Rouge', bg: '#ef4444', glow: '#ff6b6b' },
  { id: 'bleu',  emoji: '🔵', label: 'Bleu',  bg: '#3b82f6', glow: '#60a5fa' },
  { id: 'jaune', emoji: '🟡', label: 'Jaune', bg: '#f59e0b', glow: '#fcd34d' },
  { id: 'vert',  emoji: '🟢', label: 'Vert',  bg: '#22c55e', glow: '#4ade80' },
];

const LEVEL_CONFIG = [
  { label: 'N1 — Longueur 2', startLen: 2 },
  { label: 'N2 — Longueur 3', startLen: 3 },
  { label: 'N3 — Longueur 4', startLen: 4 },
  { label: 'N4 — Longueur 5', startLen: 5 },
  { label: 'N5 — Longueur 6', startLen: 6 },
];

const MAX_MISTAKES = 3;

function formatTime(secs) {
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m${secs % 60}s`;
}

function randomColorId() {
  return COLORS[Math.floor(Math.random() * COLORS.length)].id;
}

export default function SimonDitPage() {
  const { progress, saveSession, resetTimer, logError } = useGameSession('simon');

  const [phase, setPhase]               = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [gameState, setGameState]       = useState('showing'); // 'showing'|'input'|'success'|'fail'
  const [sequence, setSequence]         = useState([]);
  const [lit, setLit]                   = useState(null);    // color id that is currently lit
  const [mistakes, setMistakes]         = useState(0);
  const [rounds, setRounds]             = useState(0);       // completed rounds = score
  const [sessionResult, setSessionResult] = useState(null);

  // Refs to avoid stale closures in timeout chains
  const sequenceRef  = useRef([]);
  const inputRef     = useRef([]);   // player's current input
  const mistakesRef  = useRef(0);
  const roundsRef    = useRef(0);
  const timeoutsRef  = useRef([]);

  // Clear all pending timeouts on unmount
  useEffect(() => {
    return () => timeoutsRef.current.forEach(clearTimeout);
  }, []);

  function schedTimeout(fn, ms) {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  }

  function clearAllTimeouts() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }

  const playSequence = useCallback((seq) => {
    clearAllTimeouts();
    setGameState('showing');
    setLit(null);
    let delay = 400;
    seq.forEach((colorId, i) => {
      schedTimeout(() => setLit(colorId), delay);
      delay += 600;
      schedTimeout(() => setLit(null), delay);
      delay += 200;
    });
    // After showing, switch to input mode
    schedTimeout(() => {
      setLit(null);
      inputRef.current = [];
      setGameState('input');
    }, delay);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function startGame() {
    clearAllTimeouts();
    const startLen = LEVEL_CONFIG[selectedLevel - 1].startLen;
    const initial = Array.from({ length: startLen }, randomColorId);
    sequenceRef.current  = initial;
    inputRef.current     = [];
    mistakesRef.current  = 0;
    roundsRef.current    = 0;
    setSequence(initial);
    setMistakes(0);
    setRounds(0);
    setLit(null);
    setSessionResult(null);
    resetTimer();
    setPhase('play');
    schedTimeout(() => playSequence(initial), 600);
  }

  function endGame() {
    clearAllTimeouts();
    const score  = roundsRef.current;
    const stars  = score >= 10 ? 3 : score >= 5 ? 2 : 1;
    const result = saveSession({ score, level: selectedLevel, stars });
    setSessionResult(result);
    setGameState('fail');
    setPhase('results');
  }

  function handleColorPress(colorId) {
    if (gameState !== 'input') return;
    const seq = sequenceRef.current;
    const pos = inputRef.current.length;

    if (pos >= seq.length) return; // safety guard

    if (colorId !== seq[pos]) {
      // Wrong tap
      mistakesRef.current += 1;
      setMistakes(mistakesRef.current);
      logError({ label: `Simon position ${pos + 1}`, correct: seq[pos], given: colorId });

      if (mistakesRef.current >= MAX_MISTAKES) {
        endGame();
        return;
      }
      // Replay sequence from start after a short delay
      inputRef.current = [];
      setGameState('success'); // brief pause visual
      schedTimeout(() => playSequence(seq), 1000);
      return;
    }

    // Correct tap
    inputRef.current = [...inputRef.current, colorId];

    if (inputRef.current.length === seq.length) {
      // Round complete
      roundsRef.current += 1;
      setRounds(roundsRef.current);
      setGameState('success');

      // Extend sequence by 1
      const next = [...seq, randomColorId()];
      sequenceRef.current = next;
      setSequence(next);

      schedTimeout(() => playSequence(next), 1000);
    }
  }

  if (phase === 'setup') {
    return (
      <div className="an-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="an-title">🔔 Simon Dit</h1>
        <p className="an-subtitle">Répète la séquence de couleurs !</p>

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
          <span>🔴 4 couleurs</span>
          <span>❌ 3 erreurs max</span>
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
    const score = roundsRef.current;
    const stars = score >= 10 ? 3 : score >= 5 ? 2 : 1;
    const msg = stars === 3 ? '🎉 Parfait !' : stars === 2 ? '👍 Bien joué !' : '📚 Encore un effort !';
    return (
      <div className="an-page">
        <h2 className="an-result-title">{msg}</h2>
        <div className="jeux-stars">{'★'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
        <div className="jeux-result-stat"><span>Tours réussis</span><span>{score}</span></div>
        {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
        {sessionResult?.newUnlocked && (
          <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} débloqué !</div>
        )}
        <div className="an-result-btns">
          <button className="an-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <button className="an-cta an-cta--soft" onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}>Niveaux</button>
          <Link to="/jeux" className="an-cta an-cta--soft">← Jeux</Link>
        </div>
      </div>
    );
  }

  const isShowing = gameState === 'showing';
  const statusMsg = isShowing
    ? '👀 Regarde bien...'
    : gameState === 'success'
    ? '✅ Bien joué !'
    : `🎮 Répète ! (${inputRef.current.length}/${sequence.length})`;

  return (
    <div className="an-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>

      <div className="an-hud">
        <span className="an-score">🏅 {rounds}</span>
        <span className="an-round">❌ {mistakes}/{MAX_MISTAKES}</span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 16, fontSize: '1.1rem', fontWeight: 600, minHeight: 28 }}>
        {statusMsg}
      </div>

      {/* 2×2 Simon grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        maxWidth: 360,
        margin: '0 auto',
        padding: '0 8px',
      }}>
        {COLORS.map(color => {
          const isLit = lit === color.id;
          return (
            <button
              key={color.id}
              disabled={isShowing}
              onPointerDown={e => { e.preventDefault(); handleColorPress(color.id); }}
              style={{
                width: '100%',
                aspectRatio: '1',
                minHeight: 140,
                borderRadius: 20,
                border: '4px solid rgba(0,0,0,0.2)',
                background: isLit ? color.glow : color.bg,
                boxShadow: isLit
                  ? `0 0 32px 12px ${color.glow}, 0 4px 16px rgba(0,0,0,0.3)`
                  : '0 4px 12px rgba(0,0,0,0.2)',
                transform: isLit ? 'scale(1.07)' : 'scale(1)',
                transition: 'transform 0.1s, box-shadow 0.1s, background 0.1s',
                cursor: isShowing ? 'default' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.4rem',
                gap: 4,
              }}
            >
              <span>{color.emoji}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                {color.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sequence length indicator */}
      <div style={{ textAlign: 'center', marginTop: 20, color: '#6b7280', fontSize: '0.9rem' }}>
        Séquence actuelle : {sequence.length} couleur{sequence.length > 1 ? 's' : ''}
      </div>
    </div>
  );
}
