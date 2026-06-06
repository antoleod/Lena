import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './tables.css';

// ── Audio helpers ─────────────────────────────────────────────────────────────
function playChime(ok) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = ok ? [523, 659, 784] : [300, 220];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = ok ? 'sine' : 'square';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.16;
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.start(t);
      osc.stop(t + 0.22);
    });
  } catch (_) { /* ignore */ }
}

function fireConfetti() {
  const ID = 'tp-confetti-kf';
  if (!document.getElementById(ID)) {
    const s = document.createElement('style');
    s.id = ID;
    s.textContent = '@keyframes tpFall{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}';
    document.head.appendChild(s);
  }
  const colors = ['#f39c12','#e74c3c','#2ecc71','#3498db','#9b59b6','#1abc9c','#f1c40f'];
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    const size = 6 + Math.random() * 8;
    el.style.cssText = `position:absolute;top:0;left:${Math.random()*100}%;width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${Math.random()>.5?'50%':'2px'};animation:tpFall ${2+Math.random()*1.2}s ${Math.random()*.8}s ease-in forwards;`;
    wrap.appendChild(el);
  }
  document.body.appendChild(wrap);
  setTimeout(() => { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 4500);
}

// ── Constants ─────────────────────────────────────────────────────────────────
const ALL_TABLES = Array.from({ length: 20 }, (_, i) => i + 1);

const MODES = [
  { id: 'learn',     emoji: '📖', name: 'Apprendre',   desc: 'Voir et memoriser la table',         color: '#06b6d4' },
  { id: 'practice',  emoji: '✏️',  name: 'Pratiquer',   desc: 'Questions sans limite de temps',     color: '#6366f1' },
  { id: 'exam',      emoji: '📝', name: 'Examen',      desc: 'Questions chronometrees',            color: '#f59e0b' },
  { id: 'challenge', emoji: '⚡', name: 'Defi 60s',    desc: 'Maximum de bonnes reponses en 60s',  color: '#ef4444' },
];

const DIFFICULTIES = [
  { id: 'easy',   emoji: '🌱', label: 'Facile',   color: '#22c55e', maxTable: 5,  questions: 10, time: 0   },
  { id: 'medium', emoji: '⭐', label: 'Moyen',    color: '#6366f1', maxTable: 10, questions: 15, time: 60  },
  { id: 'hard',   emoji: '🔥', label: 'Difficile', color: '#f59e0b', maxTable: 15, questions: 20, time: 90  },
  { id: 'expert', emoji: '💎', label: 'Expert',   color: '#ef4444', maxTable: 20, questions: 50, time: 120 },
];

// ── Progression localStorage ──────────────────────────────────────────────────
function loadProg() {
  try { return JSON.parse(localStorage.getItem('lena:tables-prog') || '{}'); }
  catch { return {}; }
}
function saveProg(data) {
  try { localStorage.setItem('lena:tables-prog', JSON.stringify(data)); }
  catch { /* ignore */ }
}
function updateProg(table, correct, total) {
  const prev = loadProg();
  const key = String(table);
  const old = prev[key] || { correct: 0, total: 0 };
  prev[key] = { correct: old.correct + correct, total: old.total + total };
  saveProg(prev);
}
function getProgPct(table, prog) {
  const d = prog[String(table)];
  if (!d || d.total === 0) return 0;
  return Math.min(100, Math.round((d.correct / d.total) * 100));
}

// ── Question generator ────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function genQuestions(table, mode, difficulty) {
  const diff = DIFFICULTIES.find(d => d.id === difficulty) || DIFFICULTIES[0];
  let pool = [];

  if (mode === 'challenge') {
    // Infinite pool — regenerate on demand
    for (let a = 1; a <= 20; a++)
      for (let b = 1; b <= 20; b++)
        pool.push({ a, b });
    return shuffle(pool);
  }

  if (table === 'mix') {
    const max = diff.maxTable;
    for (let a = 1; a <= max; a++)
      for (let b = 1; b <= 10; b++)
        pool.push({ a, b });
    return shuffle(pool).slice(0, diff.questions);
  }

  // Specific table
  for (let b = 1; b <= 12; b++) pool.push({ a: table, b });
  // Also reverse
  for (let b = 1; b <= 12; b++) if (b !== table) pool.push({ a: b, b: table });
  return shuffle(pool).slice(0, mode === 'exam' ? 12 : 10);
}

function genMoreQuestions(existing) {
  // For challenge mode — get next batch
  const pool = [];
  for (let a = 1; a <= 20; a++)
    for (let b = 1; b <= 20; b++)
      pool.push({ a, b });
  const shuffled = shuffle(pool);
  // Return a question not recently seen
  return shuffled[0];
}

// ── Number Pad ────────────────────────────────────────────────────────────────
function NumPad({ onDigit, onBackspace, onOk, canOk }) {
  const KEYS = [7, 8, 9, 4, 5, 6, 1, 2, 3, 'del', 0, 'ok'];

  function press(e, k) {
    e.preventDefault();
    e.stopPropagation();
    if (k === 'del') onBackspace();
    else if (k === 'ok') { if (canOk) onOk(); }
    else onDigit(k);
  }

  return (
    <div className="tp-numpad">
      {KEYS.map((k, i) => (
        <button
          key={i}
          type="button"
          className={`tp-key${k === 'del' ? ' tp-key--del' : ''}${k === 'ok' ? ` tp-key--ok${canOk ? '' : ' is-disabled'}` : ''}`}
          onPointerDown={(e) => press(e, k)}
        >
          {k === 'del' ? '⌫' : k === 'ok' ? '✓' : k}
        </button>
      ))}
    </div>
  );
}

// ── Learn mode ────────────────────────────────────────────────────────────────
function LearnMode({ table, onBack }) {
  const [highlight, setHighlight] = useState(null);
  const facts = Array.from({ length: 12 }, (_, i) => ({
    b: i + 1,
    result: table * (i + 1),
  }));

  useEffect(() => {
    setHighlight(0);
    const interval = setInterval(() => {
      setHighlight(h => {
        if (h === null || h >= facts.length - 1) { clearInterval(interval); return null; }
        return h + 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [table]);

  return (
    <div className="tp-page">
      <header className="tp-header">
        <button type="button" className="tp-back" onPointerDown={onBack}>←</button>
        <div>
          <p className="tp-header__title">Table de {table}</p>
          <p className="tp-header__sub">Apprendre par coeur</p>
        </div>
      </header>
      <div className="tp-learn-body">
        {facts.map((f, i) => (
          <div key={f.b} className={`tp-learn-fact${highlight === i ? ' is-highlight' : ''}`}>
            <span className="tp-learn-fact__eq">{table} × {f.b} =</span>
            <span className="tp-learn-fact__result">{f.result}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: '8px 14px 8px', flexShrink: 0 }}>
        <button type="button" className="tp-start-btn" onPointerDown={onBack}>
          Pratiquer →
        </button>
      </div>
    </div>
  );
}

// ── Quiz / Challenge mode ─────────────────────────────────────────────────────
function QuizMode({ table, mode, difficulty, onBack, onDone }) {
  const diff      = DIFFICULTIES.find(d => d.id === difficulty) || DIFFICULTIES[0];
  const isChallenge = mode === 'challenge';
  const hasTimer    = isChallenge || (mode === 'exam' && diff.time > 0) || (table === 'mix' && diff.time > 0);
  const totalTime   = isChallenge ? 60 : diff.time;

  const [questions, setQuestions] = useState(() => genQuestions(table, mode, difficulty));
  const [qIdx, setQIdx]    = useState(0);
  const [input, setInput]  = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore]  = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime || 999);
  const [errors, setErrors] = useState([]);
  const [showExplain, setShowExplain] = useState(false);
  const [challengeTotal, setChallengeTotal] = useState(0);

  const advanceRef  = useRef(null);
  const timerRef    = useRef(null);
  const feedbackRef = useRef(null);
  const inputRef    = useRef('');

  // Keep refs in sync (stale-closure prevention)
  feedbackRef.current = feedback;
  inputRef.current    = input;

  const q = isChallenge
    ? questions[qIdx % questions.length]
    : questions[qIdx];
  const totalQ = isChallenge ? null : questions.length;

  // Timer
  useEffect(() => {
    if (!hasTimer) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          if (isChallenge) {
            // End challenge
            setTimeout(() => onDone({
              score: challengeTotal,
              total: qIdx,
              errors: [],
              mode,
              table,
              isChallenge: true,
            }), 300);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDigit = useCallback((d) => {
    if (feedbackRef.current !== null) return;
    setInput(prev => prev.length >= 4 ? prev : prev + String(d));
  }, []);

  const handleBackspace = useCallback(() => {
    if (feedbackRef.current !== null) return;
    setInput(prev => prev.slice(0, -1));
  }, []);

  const handleOk = useCallback(() => {
    if (feedbackRef.current !== null) return;
    if (inputRef.current === '') return;
    const answer = parseInt(inputRef.current, 10);
    const correct = answer === q.a * q.b;
    setFeedback(correct ? 'correct' : 'wrong');

    if (correct) {
      setScore(s => s + 1);
      setChallengeTotal(t => t + 1);
      setStreak(s => {
        const next = s + 1;
        setBestStreak(b => Math.max(b, next));
        return next;
      });
      playChime(true);
    } else {
      setStreak(0);
      setErrors(prev => [...prev, { q, userAnswer: answer, correct: q.a * q.b }]);
      setShowExplain(true);
      playChime(false);
    }

    advanceRef.current = setTimeout(() => {
      const isLast = !isChallenge && qIdx + 1 >= totalQ;
      if (isLast) {
        clearInterval(timerRef.current);
        const finalScore = correct ? score + 1 : score;
        const errList = correct ? errors : [...errors, { q, userAnswer: answer, correct: q.a * q.b }];
        updateProg(table, finalScore, totalQ);
        onDone({ score: finalScore, total: totalQ, errors: errList, mode, table });
      } else {
        setQIdx(i => i + 1);
        setInput('');
        setFeedback(null);
        setShowExplain(false);
      }
    }, correct ? 700 : 1400);
  }, [q, score, errors, qIdx, totalQ, isChallenge, mode, table, onDone]);

  // Keyboard handler
  useEffect(() => {
    function onKey(e) {
      if (e.key >= '0' && e.key <= '9') { handleDigit(parseInt(e.key)); return; }
      if (e.key === 'Backspace') { handleBackspace(); return; }
      if (e.key === 'Enter') { handleOk(); return; }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleDigit, handleBackspace, handleOk]);

  useEffect(() => () => {
    clearTimeout(advanceRef.current);
    clearInterval(timerRef.current);
  }, []);

  const progress = isChallenge
    ? ((totalTime - timeLeft) / totalTime) * 100
    : (qIdx / (totalQ || 1)) * 100;
  const urgent = hasTimer && timeLeft <= 10;

  const tableLabel = table === 'mix'
    ? `Melange ${diff.label}`
    : mode === 'challenge'
      ? 'Defi 60 secondes'
      : `Table de ${table}`;

  return (
    <div className="tp-quiz-page">
      {/* Top bar */}
      <div className="tp-quiz-bar">
        <button type="button" className="tp-back" onPointerDown={() => {
          clearTimeout(advanceRef.current);
          clearInterval(timerRef.current);
          onBack();
        }}>←</button>
        <span className="tp-quiz-bar__title">{tableLabel}</span>
        {isChallenge ? (
          <span className={`tp-quiz-bar__counter${urgent ? ' tp-timer-urgent' : ''}`}>
            ⏱ {timeLeft}s
          </span>
        ) : (
          <span className="tp-quiz-bar__counter">{qIdx + 1} / {totalQ}</span>
        )}
      </div>

      {/* Progress */}
      <div className="tp-quiz-progress">
        <div
          className={`tp-quiz-progress__fill${urgent ? ' tp-quiz-progress__fill--urgent' : ''}`}
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>

      {/* Stats strip */}
      <div className="tp-stats">
        <div className="tp-stat">
          <span className="tp-stat__emoji">⭐</span>
          <span className="tp-stat__val">{score}</span>
        </div>
        <div className="tp-stat">
          <span className="tp-stat__emoji">🔥</span>
          <span className="tp-stat__val">{streak}</span>
          <span className="tp-stat__lbl">serie</span>
        </div>
        <div className="tp-stat">
          <span className="tp-stat__emoji">🏆</span>
          <span className="tp-stat__val">{bestStreak}</span>
          <span className="tp-stat__lbl">record</span>
        </div>
        {hasTimer && !isChallenge && (
          <div className={`tp-stat${urgent ? ' tp-timer-urgent' : ''}`}>
            <span className="tp-stat__emoji">⏱</span>
            <span className="tp-stat__val">{timeLeft}s</span>
          </div>
        )}
      </div>

      {/* Challenge banner */}
      {isChallenge && (
        <div className="tp-challenge-banner">
          <span className="tp-challenge-banner__text">⚡ Reponds le plus vite possible !</span>
          <span className="tp-challenge-banner__score">{score} pts</span>
        </div>
      )}

      {/* Question card */}
      <div className={`tp-question${feedback === 'correct' ? ' is-correct' : feedback === 'wrong' ? ' is-wrong' : ''}`}>
        <p className="tp-question__text">
          {q.a} × {q.b} = <span style={{ color: 'rgba(255,255,255,.4)' }}>?</span>
        </p>
      </div>

      {/* Answer display */}
      <div className={`tp-answer${input && feedback === null ? ' has-input' : ''}${feedback === 'correct' ? ' is-correct' : feedback === 'wrong' ? ' is-wrong' : ''}`}>
        {feedback === null ? (
          input
            ? <span className="tp-answer__val">{input}</span>
            : <span className="tp-answer__placeholder">?</span>
        ) : (
          <div className="tp-answer__feedback">
            <span className="tp-answer__icon">{feedback === 'correct' ? '✅' : '❌'}</span>
            <span className="tp-answer__right">
              {feedback === 'correct' ? input : q.a * q.b}
            </span>
            {feedback === 'wrong' && (
              <span className="tp-answer__yours">tu as mis {input}</span>
            )}
          </div>
        )}
      </div>

      {/* Error explanation */}
      {showExplain && feedback === 'wrong' && (
        <div className="tp-explanation">
          <p className="tp-explanation__title">Comment calculer {q.a} × {q.b} ?</p>
          <p className="tp-explanation__text">
            {q.a} × {q.b} = {Array.from({ length: q.b }, () => q.a).join(' + ')} = <strong>{q.a * q.b}</strong>
            {q.a !== q.b && (
              <span style={{ marginLeft: 6, opacity: .75 }}>
                (ou {q.b} × {q.a} = {q.a * q.b})
              </span>
            )}
          </p>
        </div>
      )}

      {/* Number pad */}
      <NumPad
        onDigit={handleDigit}
        onBackspace={handleBackspace}
        onOk={handleOk}
        canOk={feedback === null && input !== ''}
      />
    </div>
  );
}

// ── Results screen ────────────────────────────────────────────────────────────
function Results({ data, onRetry, onBack }) {
  const { score, total, errors, mode, table, isChallenge } = data;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const stars = isChallenge ? (score >= 30 ? 3 : score >= 15 ? 2 : 1) : (pct >= 90 ? 3 : pct >= 70 ? 2 : 1);
  const passed = stars >= 2;

  useEffect(() => {
    if (passed) { fireConfetti(); playChime(true); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="tp-page">
      <header className="tp-header" style={{ paddingBottom: 0 }}>
        <button type="button" className="tp-back" onPointerDown={onBack}>←</button>
      </header>
      <div className="tp-results">
        <span className="tp-results__emoji">{passed ? '🏆' : '💪'}</span>
        <h2 className="tp-results__title">
          {isChallenge
            ? `Score : ${score} points !`
            : passed
              ? 'Excellent travail !'
              : 'Continue, tu progresses !'}
        </h2>

        <div className="tp-results-score-card">
          {isChallenge ? (
            <>
              <div className="tp-results-score-card__big">{score}</div>
              <div className="tp-results-score-card__sub">bonnes reponses en 60 secondes</div>
            </>
          ) : (
            <>
              <div className="tp-results-score-card__big">
                {score} <span style={{ fontSize: '1.3rem', opacity: .6 }}>/ {total}</span>
              </div>
              <div className="tp-results-score-card__pct">{pct}% corrects</div>
            </>
          )}
        </div>

        <div className="tp-results-stars">
          {[1, 2, 3].map(i => (
            <span key={i} className="tp-results-star" style={{ opacity: i <= stars ? 1 : 0.2 }}>⭐</span>
          ))}
        </div>

        {errors.length > 0 && (
          <div className="tp-errors">
            <p className="tp-errors__title">A retravailler ({errors.length})</p>
            {errors.slice(0, 5).map((err, i) => (
              <div key={i} className="tp-error-item">
                <span className="tp-error-item__q">{err.q.a} × {err.q.b}</span>
                <span className="tp-error-item__yours">tu : {err.userAnswer}</span>
                <span className="tp-error-item__right">→ {err.correct}</span>
              </div>
            ))}
          </div>
        )}

        <div className="tp-results-actions">
          <button type="button" className="tp-results-btn tp-results-btn--primary" onPointerDown={onRetry}>
            🔄 Recommencer
          </button>
          <button type="button" className="tp-results-btn tp-results-btn--secondary" onPointerDown={onBack}>
            Choisir une autre table
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Home (table + mode + difficulty selector) ─────────────────────────────────
export default function TablesPage() {
  const navigate = useNavigate();

  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedMode, setSelectedMode]   = useState('practice');
  const [selectedDiff, setSelectedDiff]   = useState('easy');
  const [phase, setPhase] = useState('home');   // 'home' | 'learn' | 'quiz' | 'results'
  const [resultData, setResultData] = useState(null);
  const [prog] = useState(loadProg);

  function startSession() {
    if (!selectedTable) return;
    if (selectedMode === 'learn') { setPhase('learn'); return; }
    setPhase('quiz');
  }

  function handleDone(data) {
    setResultData(data);
    setPhase('results');
  }

  function handleRetry() {
    setPhase('quiz');
  }

  function handleBackToHome() {
    setPhase('home');
    setResultData(null);
  }

  if (phase === 'learn') {
    return (
      <LearnMode
        table={selectedTable}
        onBack={() => setPhase('home')}
      />
    );
  }

  if (phase === 'quiz') {
    return (
      <QuizMode
        table={selectedTable}
        mode={selectedMode}
        difficulty={selectedDiff}
        onBack={handleBackToHome}
        onDone={handleDone}
      />
    );
  }

  if (phase === 'results' && resultData) {
    return (
      <Results
        data={resultData}
        onRetry={handleRetry}
        onBack={handleBackToHome}
      />
    );
  }

  // ── HOME ──────────────────────────────────────────────────────────────────
  const canStart = selectedTable !== null;
  const currentDiff = DIFFICULTIES.find(d => d.id === selectedDiff);

  return (
    <div className="tp-page">
      <header className="tp-header">
        <button type="button" className="tp-back" onPointerDown={() => navigate(-1)}>←</button>
        <div>
          <h1 className="tp-header__title">Tables de multiplication</h1>
          <p className="tp-header__sub">Tables 1 a 20 · 4 modes · progression sauvegardee</p>
        </div>
      </header>

      <div className="tp-home-body">
        {/* Table selector */}
        <p className="tp-section-label">Choisir une table</p>
        <div className="tp-table-grid">
          {ALL_TABLES.map(t => {
            const pct = getProgPct(t, prog);
            return (
              <button
                key={t}
                type="button"
                className={`tp-table-btn${selectedTable === t ? ' is-selected' : ''}`}
                style={{ '--table-accent': '#6366f1' }}
                onPointerDown={(e) => { e.preventDefault(); setSelectedTable(t); }}
              >
                <span>×{t}</span>
                {pct > 0 && <span className="tp-table-btn__label">{pct}%</span>}
                {pct > 0 && (
                  <div className="tp-table-btn__prog">
                    <div className="tp-table-btn__prog-fill" style={{ width: `${pct}%` }} />
                  </div>
                )}
              </button>
            );
          })}

          {/* Mix button spans full row */}
          <button
            type="button"
            className={`tp-mix-btn${selectedTable === 'mix' ? ' is-selected' : ''}`}
            onPointerDown={(e) => { e.preventDefault(); setSelectedTable('mix'); }}
          >
            🌀 Melange de toutes les tables
          </button>
        </div>

        {/* Mode */}
        <p className="tp-section-label">Mode</p>
        <div className="tp-mode-grid">
          {MODES.map(m => (
            <button
              key={m.id}
              type="button"
              className={`tp-mode-card${selectedMode === m.id ? ' is-selected' : ''}`}
              style={{ '--mode-color': m.color }}
              onPointerDown={(e) => { e.preventDefault(); setSelectedMode(m.id); }}
            >
              <span className="tp-mode-card__emoji">{m.emoji}</span>
              <span className="tp-mode-card__name">{m.name}</span>
              <span className="tp-mode-card__desc">{m.desc}</span>
            </button>
          ))}
        </div>

        {/* Difficulty (only when not learn mode) */}
        {selectedMode !== 'learn' && selectedMode !== 'challenge' && (
          <>
            <p className="tp-section-label">Difficulte</p>
            <div className="tp-diff-row">
              {DIFFICULTIES.map(d => (
                <button
                  key={d.id}
                  type="button"
                  className={`tp-diff-btn${selectedDiff === d.id ? ' is-selected' : ''}`}
                  style={{ '--diff-color': d.color }}
                  onPointerDown={(e) => { e.preventDefault(); setSelectedDiff(d.id); }}
                >
                  <span className="tp-diff-btn__emoji">{d.emoji}</span>
                  <span>{d.label}</span>
                  {d.time > 0 && <span style={{ opacity: .6, fontSize: '.6rem' }}>{d.time}s</span>}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Summary + Start */}
        {selectedTable && (
          <div style={{
            background: 'rgba(255,255,255,.06)',
            borderRadius: 14, padding: '10px 14px',
            marginTop: 12,
            border: '1px solid rgba(255,255,255,.1)',
            fontSize: '.82rem', color: 'rgba(255,255,255,.65)',
            lineHeight: 1.6,
          }}>
            {selectedTable === 'mix'
              ? `Melange · ${MODES.find(m => m.id === selectedMode)?.name}`
              : `Table de ${selectedTable} · ${MODES.find(m => m.id === selectedMode)?.name}`}
            {selectedMode !== 'learn' && selectedMode !== 'challenge' && currentDiff && (
              <> · {currentDiff.label} · {currentDiff.questions} questions{currentDiff.time > 0 ? ` · ${currentDiff.time}s` : ''}</>
            )}
            {selectedMode === 'challenge' && <> · 60 secondes</>}
          </div>
        )}

        <button
          type="button"
          className="tp-start-btn"
          disabled={!canStart}
          onPointerDown={(e) => { e.preventDefault(); if (canStart) startSession(); }}
        >
          {selectedMode === 'learn' ? '📖 Commencer a apprendre' : '▶ Demarrer'}
        </button>
      </div>
    </div>
  );
}
