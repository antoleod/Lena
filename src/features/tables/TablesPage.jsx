import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Confetti burst (pure JS/CSS, no npm) ──────────────────────────────────────
function fireConfetti() {
  const STYLE_ID = 'confetti-keyframes';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
@keyframes confettiFall {
  0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}`;
    document.head.appendChild(style);
  }
  const colors = ['#f39c12', '#e74c3c', '#2ecc71', '#3498db', '#9b59b6', '#1abc9c', '#e67e22', '#f1c40f'];
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    const size = 6 + Math.random() * 8;
    const left = Math.random() * 100;
    const delay = Math.random() * 0.8;
    const duration = 2 + Math.random() * 1.2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    el.style.cssText = `position:absolute;top:0;left:${left}%;width:${size}px;height:${size}px;background:${color};border-radius:${Math.random() > 0.5 ? '50%' : '2px'};animation:confettiFall ${duration}s ${delay}s ease-in forwards;`;
    container.appendChild(el);
  }
  document.body.appendChild(container);
  setTimeout(() => { if (container.parentNode) container.parentNode.removeChild(container); }, 4500);
}

// ── Reward chime (Web Audio API, no audio files) ───────────────────────────────
function playRewardChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523, 659, 784]; // C5 E5 G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const start = ctx.currentTime + i * 0.18;
      const end = start + 0.15;
      gain.gain.setValueAtTime(0.4, start);
      gain.gain.exponentialRampToValueAtTime(0.001, end);
      osc.start(start);
      osc.stop(end + 0.05);
    });
  } catch (_) {
    // Web Audio not available
  }
}

// ── Question generation ───────────────────────────────────────────────────────
const TABLES = [2, 3, 4, 5, 6, 7, 8, 9, 10];
const SESSION_LENGTH = 10;

function generateQuestions(table) {
  const pool = [];
  if (table === 'mixte') {
    TABLES.forEach((t) => {
      for (let n = 1; n <= 10; n++) pool.push({ a: t, b: n });
    });
  } else {
    for (let n = 1; n <= 10; n++) pool.push({ a: table, b: n });
  }
  // Fisher-Yates shuffle with Math.random
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, SESSION_LENGTH);
}

// ── Number pad ───────────────────────────────────────────────────────────────
function NumberPad({ onDigit, onDelete, onSubmit, disabled }) {
  const KEYS = [7, 8, 9, 4, 5, 6, 1, 2, 3, null, 0, 'del'];
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 10, maxWidth: 260, margin: '0 auto',
    }}>
      {KEYS.map((k, i) => {
        if (k === null) {
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={onSubmit}
              style={{
                padding: '18px 0', borderRadius: 16, fontSize: '1.2rem', fontWeight: 700,
                background: disabled ? 'rgba(255,255,255,.1)' : 'linear-gradient(135deg,#2ecc71,#27ae60)',
                color: '#fff', border: 'none', cursor: disabled ? 'default' : 'pointer',
              }}
            >
              OK
            </button>
          );
        }
        if (k === 'del') {
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={onDelete}
              style={{
                padding: '18px 0', borderRadius: 16, fontSize: '1.3rem',
                background: 'rgba(255,255,255,.15)',
                color: '#fff', border: '2px solid rgba(255,255,255,.3)',
                cursor: disabled ? 'default' : 'pointer',
              }}
            >
              ⌫
            </button>
          );
        }
        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => onDigit(k)}
            style={{
              padding: '18px 0', borderRadius: 16, fontSize: '1.4rem', fontWeight: 700,
              background: 'rgba(255,255,255,.18)',
              color: '#fff', border: '2px solid rgba(255,255,255,.35)',
              cursor: disabled ? 'default' : 'pointer',
              transition: 'background .1s',
            }}
          >
            {k}
          </button>
        );
      })}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function TablesPage() {
  const navigate = useNavigate();

  // 'select' | 'quiz' | 'results'
  const [phase, setPhase] = useState('select');
  const [selectedTable, setSelectedTable] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong'
  const [score, setScore] = useState(0);
  const advanceTimer = useRef(null);

  // Clean up auto-advance timer on unmount
  useEffect(() => {
    return () => { if (advanceTimer.current) clearTimeout(advanceTimer.current); };
  }, []);

  // Fire confetti + chime when reaching results with high score
  useEffect(() => {
    if (phase !== 'results') return;
    if (score >= 8) {
      fireConfetti();
      playRewardChime();
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  function startQuiz(table) {
    setSelectedTable(table);
    setQuestions(generateQuestions(table));
    setQIndex(0);
    setInput('');
    setFeedback(null);
    setScore(0);
    setPhase('quiz');
  }

  function handleDigit(d) {
    if (feedback !== null) return;
    setInput((prev) => (prev.length >= 3 ? prev : prev + String(d)));
  }

  function handleDelete() {
    if (feedback !== null) return;
    setInput((prev) => prev.slice(0, -1));
  }

  function handleSubmit() {
    if (feedback !== null || input === '') return;
    const q = questions[qIndex];
    const correct = parseInt(input, 10) === q.a * q.b;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) setScore((s) => s + 1);

    advanceTimer.current = setTimeout(() => {
      if (qIndex + 1 >= SESSION_LENGTH) {
        setPhase('results');
      } else {
        setQIndex((i) => i + 1);
        setInput('');
        setFeedback(null);
      }
    }, 1000);
  }

  // ── SELECT ────────────────────────────────────────────────────────────────
  if (phase === 'select') {
    return (
      <div style={{
        maxWidth: 600, margin: '0 auto', minHeight: '100vh',
        padding: '24px 18px 56px',
        background: 'linear-gradient(160deg,#1a1a2e,#16213e,#0f3460)',
        borderRadius: 22,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button
            type="button"
            className="exam-back-btn"
            onClick={() => navigate(-1)}
            style={{ flexShrink: 0 }}
          >
            ←
          </button>
          <div>
            <span style={{ color: '#ffd166', fontWeight: 700, fontSize: '.8rem', letterSpacing: '.04em' }}>
              MON CAHIER
            </span>
            <h1 style={{ margin: '2px 0 0', fontSize: '1.5rem', color: '#fff' }}>
              Tables de multiplication
            </h1>
            <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,.7)', fontSize: '.95rem' }}>
              Choisis une table pour t'entrainer
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: 12, marginBottom: 16,
        }}>
          {TABLES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => startQuiz(t)}
              style={{
                padding: '20px 0', borderRadius: 18, fontSize: '1.3rem', fontWeight: 700,
                background: 'rgba(255,255,255,.15)',
                border: '2px solid rgba(255,255,255,.35)',
                color: '#fff', cursor: 'pointer',
                transition: 'background .15s, transform .1s',
              }}
            >
              &times;{t}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => startQuiz('mixte')}
          style={{
            width: '100%', padding: '18px 0', borderRadius: 18,
            fontSize: '1.15rem', fontWeight: 700,
            background: 'linear-gradient(135deg,#f39c12,#e67e22)',
            border: 'none', color: '#fff', cursor: 'pointer',
          }}
        >
          Mixte (toutes les tables)
        </button>
      </div>
    );
  }

  // ── QUIZ ──────────────────────────────────────────────────────────────────
  if (phase === 'quiz') {
    const q = questions[qIndex];
    const feedbackBg = feedback === 'correct'
      ? 'rgba(46,204,113,.25)'
      : feedback === 'wrong'
        ? 'rgba(231,76,60,.25)'
        : 'transparent';

    return (
      <div style={{
        maxWidth: 480, margin: '0 auto', minHeight: '100vh',
        padding: '24px 18px 56px',
        background: 'linear-gradient(160deg,#1a1a2e,#16213e,#0f3460)',
        borderRadius: 22, display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            type="button"
            className="exam-back-btn"
            onClick={() => {
              if (advanceTimer.current) clearTimeout(advanceTimer.current);
              setPhase('select');
            }}
          >
            ←
          </button>
          <span style={{ color: 'rgba(255,255,255,.75)', fontWeight: 600 }}>
            {selectedTable === 'mixte' ? 'Mixte' : `Table de ${selectedTable}`}
          </span>
          <span style={{
            background: 'rgba(255,255,255,.15)', borderRadius: 20,
            padding: '4px 14px', color: '#fff', fontWeight: 700, fontSize: '.9rem',
          }}>
            {qIndex + 1} / {SESSION_LENGTH}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ height: 8, background: 'rgba(255,255,255,.1)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 4,
            background: 'linear-gradient(90deg,#3498db,#9b59b6)',
            width: `${((qIndex) / SESSION_LENGTH) * 100}%`,
            transition: 'width .3s',
          }} />
        </div>

        {/* Score */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ color: '#f1c40f', fontWeight: 700, fontSize: '1rem' }}>
            {score} bonne{score !== 1 ? 's' : ''} reponse{score !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Question card */}
        <div style={{
          background: 'rgba(255,255,255,.1)', borderRadius: 20,
          padding: '32px 24px', textAlign: 'center',
          border: `2px solid ${feedback === 'correct' ? '#2ecc71' : feedback === 'wrong' ? '#e74c3c' : 'rgba(255,255,255,.2)'}`,
          transition: 'border-color .2s',
        }}>
          <p style={{ margin: 0, fontSize: '2.2rem', fontWeight: 700, color: '#fff' }}>
            {q.a} &times; {q.b} = ?
          </p>
        </div>

        {/* Answer display */}
        <div style={{
          background: feedbackBg,
          border: `2px solid ${feedback === 'correct' ? '#2ecc71' : feedback === 'wrong' ? '#e74c3c' : 'rgba(255,255,255,.3)'}`,
          borderRadius: 16, padding: '16px 24px', textAlign: 'center',
          minHeight: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .2s, border-color .2s',
        }}>
          {feedback === null ? (
            <span style={{ fontSize: '2rem', color: input ? '#fff' : 'rgba(255,255,255,.35)', fontWeight: 700 }}>
              {input || '?'}
            </span>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '1.8rem' }}>{feedback === 'correct' ? '✅' : '❌'}</span>
              <span style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 700 }}>
                {feedback === 'correct' ? input : `${q.a * q.b}`}
              </span>
              {feedback === 'wrong' && (
                <span style={{ fontSize: '.9rem', color: 'rgba(255,255,255,.7)' }}>
                  (tu as mis {input})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Number pad */}
        <NumberPad
          onDigit={handleDigit}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
          disabled={feedback !== null || input === ''}
        />
      </div>
    );
  }

  // ── RESULTS ───────────────────────────────────────────────────────────────
  const passed = score >= 8;
  return (
    <div style={{
      maxWidth: 480, margin: '0 auto', minHeight: '100vh',
      padding: '40px 18px 56px',
      background: 'linear-gradient(160deg,#1a1a2e,#16213e,#0f3460)',
      borderRadius: 22, display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 20,
    }}>
      <span style={{ fontSize: '4rem' }}>{passed ? '🏆' : '💪'}</span>
      <h2 style={{ color: '#fff', margin: 0, textAlign: 'center', fontSize: '1.6rem' }}>
        {passed ? 'Bravo ! Excellent travail !' : 'Continue, tu y arrives !'}
      </h2>
      <p style={{ color: 'rgba(255,255,255,.75)', margin: 0, fontSize: '1.1rem' }}>
        {selectedTable === 'mixte' ? 'Table mixte' : `Table de ${selectedTable}`}
      </p>
      <div style={{
        background: 'rgba(255,255,255,.1)', borderRadius: 20,
        padding: '28px 40px', textAlign: 'center',
      }}>
        <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700, color: '#fff' }}>
          {score} <span style={{ fontSize: '1.4rem', opacity: .7 }}>/ {SESSION_LENGTH}</span>
        </p>
        <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,.7)' }}>
          {Math.round((score / SESSION_LENGTH) * 100)}% de bonnes reponses
        </p>
        <p style={{ fontSize: '1.8rem', letterSpacing: 4, margin: '12px 0 0' }}>
          {[1, 2, 3].map((i) => (
            <span key={i} style={{ opacity: i <= (score >= 9 ? 3 : score >= 7 ? 2 : score >= 5 ? 1 : 0) ? 1 : 0.25 }}>
              &#11088;
            </span>
          ))}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 320 }}>
        <button
          type="button"
          className="reader-btn reader-btn--next"
          style={{ width: '100%' }}
          onClick={() => startQuiz(selectedTable)}
        >
          Recommencer
        </button>
        <button
          type="button"
          className="reader-btn reader-btn--start"
          style={{ width: '100%' }}
          onClick={() => setPhase('select')}
        >
          Choisir une autre table
        </button>
        <button
          type="button"
          className="exam-back-btn"
          style={{ width: '100%', textAlign: 'center' }}
          onClick={() => navigate('/cahier')}
        >
          ← Retour au cahier
        </button>
      </div>
    </div>
  );
}
