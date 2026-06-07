import { useState, useCallback, forwardRef, useImperativeHandle, useRef } from 'react';

// ─── GameFeedback component ───────────────────────────────────────────────────
// Usage:
//   import { GameFeedback, useGameFeedback } from './GameFeedback.jsx';
//   const { feedbackRef, triggerCorrect, triggerWrong, triggerScore, triggerCombo } = useGameFeedback();
//   <GameFeedback ref={feedbackRef} />
//   triggerCorrect(); triggerScore('+10'); triggerCombo(3);

const CONFETTI_COLORS = ['#fbbf24', '#22c55e', '#6366f1', '#ec4899', '#06b6d4', '#f97316'];

export const GameFeedback = forwardRef(function GameFeedback(_props, ref) {
  const [correctWave, setCorrectWave] = useState(0);
  const [wrongWave, setWrongWave]     = useState(0);
  const [scorePopup, setScorePopup]   = useState(null); // { text, id }
  const [comboPopup, setComboPopup]   = useState(null); // { text, id }
  const scoreIdRef = useRef(0);
  const comboIdRef = useRef(0);

  useImperativeHandle(ref, () => ({
    correct() {
      setCorrectWave(w => w + 1);
    },
    wrong() {
      setWrongWave(w => w + 1);
    },
    score(text) {
      scoreIdRef.current += 1;
      const id = scoreIdRef.current;
      setScorePopup({ text, id });
      // auto-clear after animation
      setTimeout(() => setScorePopup(p => (p?.id === id ? null : p)), 900);
    },
    combo(n) {
      if (n < 3) return;
      comboIdRef.current += 1;
      const id = comboIdRef.current;
      setComboPopup({ text: `🔥 COMBO ×${n}`, id });
      setTimeout(() => setComboPopup(p => (p?.id === id ? null : p)), 1300);
    },
  }), []);

  // Build 12 confetti particles for the current wave
  const confettiParticles = correctWave > 0
    ? Array.from({ length: 12 }, (_, i) => ({
        key: `${correctWave}-${i}`,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        left: `${5 + Math.floor((i / 12) * 90)}%`,
        top: `${Math.floor(Math.random() * 40)}%`,
        delay: `${(i * 0.07).toFixed(2)}s`,
        dur: `${(0.8 + Math.random() * 0.5).toFixed(2)}s`,
      }))
    : [];

  return (
    <div className="gfb-wrap">
      {/* Correct flash */}
      {correctWave > 0 && (
        <div key={`cf-${correctWave}`} className="gfb-flash-correct" />
      )}
      {/* Wrong flash */}
      {wrongWave > 0 && (
        <div key={`wf-${wrongWave}`} className="gfb-flash-wrong" />
      )}
      {/* Confetti particles */}
      {confettiParticles.map(p => (
        <div
          key={p.key}
          className="gfb-confetti"
          style={{
            backgroundColor: p.color,
            left: p.left,
            top: p.top,
            '--fall-delay': p.delay,
            '--fall-dur': p.dur,
          }}
        />
      ))}
      {/* Score popup */}
      {scorePopup && (
        <div key={scorePopup.id} className="gfb-score-popup">
          {scorePopup.text}
        </div>
      )}
      {/* Combo popup */}
      {comboPopup && (
        <div key={comboPopup.id} className="gfb-combo">
          {comboPopup.text}
        </div>
      )}
    </div>
  );
});

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useGameFeedback() {
  const feedbackRef = useRef(null);
  const triggerCorrect = useCallback(() => feedbackRef.current?.correct(), []);
  const triggerWrong   = useCallback(() => feedbackRef.current?.wrong(),   []);
  const triggerScore   = useCallback((text) => feedbackRef.current?.score(text), []);
  const triggerCombo   = useCallback((n)    => feedbackRef.current?.combo(n),    []);
  return { feedbackRef, triggerCorrect, triggerWrong, triggerScore, triggerCombo };
}
