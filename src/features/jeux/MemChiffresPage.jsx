import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import { GameFeedback, useGameFeedback } from './GameFeedback.jsx';
import NumPad from '../../shared/ui/NumPad.jsx';
import './jeux.css';

const LEVEL_CONFIG = [
  { label: 'N1 — 3 chiffres',      digits: 3, showMs: 3000, rounds: 10, colors: false },
  { label: 'N2 — 4 chiffres',      digits: 4, showMs: 2500, rounds: 10, colors: false },
  { label: 'N3 — 5 chiffres',      digits: 5, showMs: 2000, rounds: 10, colors: false },
  { label: 'N4 — 6 chiffres',      digits: 6, showMs: 2000, rounds: 10, colors: false },
  { label: 'N5 — 7 chiffres + couleurs', digits: 7, showMs: 2500, rounds: 10, colors: true },
];

const DIGIT_COLORS = ['#ef4444','#f59e0b','#22c55e','#3b82f6','#8b5cf6','#ec4899','#06b6d4'];
const COLOR_LABELS = ['🔴','🟡','🟢','🔵','🟣','🩷','🩵'];

function randomDigit() { return Math.floor(Math.random() * 10); }

function generateSequence(len, withColors) {
  const digits = Array.from({ length: len }, randomDigit);
  const colors = withColors ? digits.map(() => Math.floor(Math.random() * DIGIT_COLORS.length)) : null;
  return { digits, colors };
}

function formatTime(secs) {
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m${secs % 60}s`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function DigitDisplay({ digits, colors, visible }) {
  return (
    <div style={{
      display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap',
      minHeight: 80, alignItems: 'center', margin: '8px 0',
    }}>
      {digits.map((d, i) => (
        <div
          key={i}
          style={{
            width: 56, height: 72,
            borderRadius: 12,
            background: visible ? (colors ? DIGIT_COLORS[colors[i]] : '#3b82f6') : '#e5e7eb',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: visible ? '2.4rem' : '1.5rem',
            fontWeight: 800,
            color: visible ? '#fff' : '#9ca3af',
            boxShadow: visible ? '0 4px 16px rgba(0,0,0,0.2)' : 'none',
            transition: 'background 0.3s',
            userSelect: 'none',
          }}
        >
          {visible ? d : '?'}
        </div>
      ))}
    </div>
  );
}

function ColorPicker({ selectedColor, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
      {DIGIT_COLORS.map((c, i) => (
        <button
          key={i}
          onPointerDown={e => { e.preventDefault(); onSelect(i); }}
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: c,
            border: selectedColor === i ? '4px solid #000' : '3px solid rgba(0,0,0,0.15)',
            cursor: 'pointer',
            boxShadow: selectedColor === i ? '0 0 12px 4px rgba(0,0,0,0.25)' : 'none',
            transition: 'border 0.1s, box-shadow 0.1s',
          }}
          aria-label={COLOR_LABELS[i]}
        />
      ))}
    </div>
  );
}


// ─── Main component ───────────────────────────────────────────────────────────
export default function MemChiffresPage() {
  const { progress, saveSession, resetTimer, logError } = useGameSession('memoire-chiffres');
  const { feedbackRef, triggerCorrect, triggerWrong } = useGameFeedback();

  const [phase, setPhase]               = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [round, setRound]               = useState(0);
  const [score, setScore]               = useState(0);
  const [sequence, setSequence]         = useState(null); // { digits, colors }
  const [showPhase, setShowPhase]       = useState(true); // true=show digits, false=input
  const [countdown, setCountdown]       = useState(0);
  const [inputDigits, setInputDigits]   = useState([]);
  const [inputColors, setInputColors]   = useState([]);
  const [pendingColor, setPendingColor] = useState(null); // color chosen for current digit pos (N5)
  const [evalResult, setEvalResult]     = useState(null); // null | 'ok' | 'bad'
  const [sessionResult, setSessionResult] = useState(null);

  const timerRef = useRef(null);

  const cfg = LEVEL_CONFIG[selectedLevel - 1];

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  function startRound(seq) {
    setSequence(seq);
    setShowPhase(true);
    setInputDigits([]);
    setInputColors([]);
    setPendingColor(null);
    setEvalResult(null);
    setCountdown(Math.round(cfg.showMs / 1000));

    // Countdown display
    let remaining = Math.round(cfg.showMs / 1000);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setShowPhase(false);
      }
    }, 1000);
  }

  function startGame() {
    const seq = generateSequence(cfg.digits, cfg.colors);
    setRound(0);
    setScore(0);
    setSessionResult(null);
    resetTimer();
    setPhase('play');
    startRound(seq);
  }

  function handleDigit(d) {
    if (!cfg.colors) {
      setInputDigits(prev => [...prev, d]);
    } else {
      // N5: digit goes in, then user selects color
      setInputDigits(prev => [...prev, d]);
      setPendingColor(null); // wait for color selection
    }
  }

  function handleColorSelect(colorIdx) {
    if (!cfg.colors) return;
    // Assign color to last entered digit
    if (inputDigits.length > inputColors.length) {
      setInputColors(prev => [...prev, colorIdx]);
      setPendingColor(colorIdx);
    }
  }

  function handleDelete() {
    if (inputDigits.length === 0) return;
    if (cfg.colors && inputColors.length === inputDigits.length) {
      setInputColors(prev => prev.slice(0, -1));
    } else {
      setInputDigits(prev => prev.slice(0, -1));
    }
    setPendingColor(null);
  }

  function handleConfirm() {
    if (!sequence) return;
    const { digits, colors } = sequence;
    if (inputDigits.length !== digits.length) return;
    if (cfg.colors && inputColors.length !== digits.length) return;

    const digitMatch = inputDigits.every((d, i) => d === digits[i]);
    const colorMatch = !cfg.colors || inputColors.every((c, i) => c === colors[i]);
    const correct = digitMatch && colorMatch;

    if (correct) {
      triggerCorrect();
      setScore(s => s + 1);
    } else {
      triggerWrong();
      logError({
        label: `Séquence ${digits.join('')}`,
        correct: digits.join('') + (colors ? ` [${colors.join(',')}]` : ''),
        given: inputDigits.join('') + (inputColors.length ? ` [${inputColors.join(',')}]` : ''),
      });
    }

    setEvalResult(correct ? 'ok' : 'bad');

    setTimeout(() => {
      const nextRound = round + 1;
      if (nextRound >= cfg.rounds) {
        const finalScore = correct ? score + 1 : score;
        const stars = finalScore >= Math.ceil(cfg.rounds * 0.86) ? 3
          : finalScore >= Math.ceil(cfg.rounds * 0.6) ? 2 : 1;
        const result = saveSession({ score: finalScore, level: selectedLevel, stars });
        setSessionResult(result);
        setScore(finalScore);
        setPhase('results');
        return;
      }
      setRound(nextRound);
      const seq = generateSequence(cfg.digits, cfg.colors);
      startRound(seq);
    }, 1400);
  }

  // ─── Setup ──────────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="an-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="an-title">🔢 Mémoire Chiffres</h1>
        <p className="an-subtitle">Mémorise la suite, puis réécris-la !</p>

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
          <span>🔢 {cfg.digits} chiffres</span>
          <span>⏱ {cfg.showMs / 1000}s d'affichage</span>
          <span>🔄 {cfg.rounds} manches</span>
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

  // ─── Results ─────────────────────────────────────────────────────────────────
  if (phase === 'results') {
    const stars = score >= Math.ceil(cfg.rounds * 0.86) ? 3
      : score >= Math.ceil(cfg.rounds * 0.6) ? 2 : 1;
    const msg = stars === 3 ? '🎉 Parfait !' : stars === 2 ? '👍 Bien joué !' : '📚 Encore un effort !';
    return (
      <div className="an-page">
        <h2 className="an-result-title">{msg}</h2>
        <div className="jeux-stars">{'★'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {cfg.rounds}</span></div>
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

  // ─── Play ────────────────────────────────────────────────────────────────────
  if (!sequence) return null;

  const evalColor = evalResult === 'ok' ? '#22c55e' : evalResult === 'bad' ? '#ef4444' : 'transparent';

  // For N5: need digit + color for each position; "pending" means digit entered but no color yet
  const needsColor = cfg.colors && inputDigits.length > inputColors.length;
  const canConfirm = inputDigits.length === cfg.digits
    && (!cfg.colors || inputColors.length === cfg.digits)
    && evalResult === null;

  return (
    <div className="an-page">
      <GameFeedback ref={feedbackRef} />
      <Link to="/jeux" className="exam-back-btn">←</Link>

      <div className="an-hud">
        <span className="an-score">⭐ {score}</span>
        <span className="an-round">Manche {round + 1} / {cfg.rounds}</span>
      </div>

      {showPhase ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8, color: '#6b7280' }}>
            Mémorise ! ({countdown}s)
          </div>
          <DigitDisplay digits={sequence.digits} colors={sequence.colors} visible={true} />
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          {evalResult !== null ? (
            <>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4, color: evalColor }}>
                {evalResult === 'ok' ? '✅ Correct !' : '❌ Raté !'}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: 4 }}>Réponse :</div>
              <DigitDisplay digits={sequence.digits} colors={sequence.colors} visible={true} />
            </>
          ) : (
            <>
              <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8, color: '#374151' }}>
                {needsColor ? '🎨 Choisis la couleur du chiffre :' : '🔢 Reproduis la suite :'}
              </div>

              {/* Show what player has typed so far */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', minHeight: 60, marginBottom: 8 }}>
                {Array.from({ length: cfg.digits }, (_, i) => {
                  const hasDigit = i < inputDigits.length;
                  const hasColor = cfg.colors && i < inputColors.length;
                  const bg = hasColor ? DIGIT_COLORS[inputColors[i]] : hasDigit ? '#3b82f6' : '#e5e7eb';
                  return (
                    <div key={i} style={{
                      width: 48, height: 64, borderRadius: 10,
                      background: bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.8rem', fontWeight: 800,
                      color: hasDigit ? '#fff' : '#9ca3af',
                      border: i === inputDigits.length && !needsColor ? '2px dashed #3b82f6' : '2px solid transparent',
                    }}>
                      {hasDigit ? inputDigits[i] : ''}
                    </div>
                  );
                })}
              </div>

              {cfg.colors && needsColor && (
                <ColorPicker selectedColor={pendingColor} onSelect={handleColorSelect} />
              )}

              {!needsColor && (
                <NumPad
                  value={inputDigits.join('')}
                  onChange={(v) => {
                    if (v.length > inputDigits.length) {
                      handleDigit(Number(v[v.length - 1]));
                    } else if (v.length < inputDigits.length) {
                      handleDelete();
                    }
                  }}
                  onSubmit={handleConfirm}
                  disabled={!canConfirm && inputDigits.length >= cfg.digits}
                />
              )}
              {canConfirm && (
                <button className="an-cta" style={{ marginTop: 8 }}
                  onPointerDown={e => { e.preventDefault(); handleConfirm(); }}>
                  ✓ Valider
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
