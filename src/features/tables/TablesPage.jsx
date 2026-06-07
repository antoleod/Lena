import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './tables.css';
import FeedbackCard from '../../shared/ui/FeedbackCard.jsx';

// ── Audio ─────────────────────────────────────────────────────────────────────
function playChime(ok) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = ok ? [523, 659, 784] : [300, 220];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = ok ? 'sine' : 'square';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.16;
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.start(t); osc.stop(t + 0.24);
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
  const colors = ['#f59e0b','#ef4444','#22c55e','#6366f1','#8b5cf6','#06b6d4','#fbbf24'];
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
  for (let i = 0; i < 90; i++) {
    const el = document.createElement('div');
    const size = 5 + Math.random() * 9;
    el.style.cssText = `position:absolute;top:0;left:${Math.random()*100}%;width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${Math.random()>.5?'50%':'3px'};animation:tpFall ${2+Math.random()*1.4}s ${Math.random()*.9}s ease-in forwards;`;
    wrap.appendChild(el);
  }
  document.body.appendChild(wrap);
  setTimeout(() => { wrap.parentNode?.removeChild(wrap); }, 5000);
}

// ── Constants ─────────────────────────────────────────────────────────────────
const ALL_TABLES = Array.from({ length: 20 }, (_, i) => i + 1);

// Color per table group
function tableColor(t) {
  if (t <= 5)  return { color: '#22c55e', bg: 'rgba(34,197,94,.13)' };
  if (t <= 10) return { color: '#6366f1', bg: 'rgba(99,102,241,.13)' };
  if (t <= 15) return { color: '#f59e0b', bg: 'rgba(245,158,11,.13)' };
  return              { color: '#ef4444', bg: 'rgba(239,68,68,.13)' };
}

const MODES = [
  { id: 'learn',     emoji: '📖', name: 'Apprendre',  desc: 'Voir et memoriser la table',        color: '#06b6d4' },
  { id: 'practice',  emoji: '✏️',  name: 'Pratiquer',  desc: 'Questions sans limite de temps',    color: '#6366f1' },
  { id: 'exam',      emoji: '📝', name: 'Examen',     desc: 'Questions chronometrees',           color: '#f59e0b' },
  { id: 'challenge', emoji: '⚡', name: 'Defi 60s',   desc: 'Maximum de bonnes reponses en 60s', color: '#ef4444' },
];

const DIFFICULTIES = [
  { id: 'easy',   emoji: '🌱', label: 'Facile',    color: '#22c55e', maxTable: 5,  questions: 10,  time: 0   },
  { id: 'medium', emoji: '⭐', label: 'Moyen',     color: '#6366f1', maxTable: 10, questions: 15,  time: 60  },
  { id: 'hard',   emoji: '🔥', label: 'Difficile', color: '#f59e0b', maxTable: 15, questions: 20,  time: 90  },
  { id: 'expert', emoji: '💎', label: 'Expert',    color: '#ef4444', maxTable: 20, questions: 50,  time: 120 },
  { id: 'mega',   emoji: '🔥', label: 'Mega Reto', color: '#f43f5e', tables: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], count: 100, questions: 100, maxTable: 20, time: 45 },
];

// ── Progression ───────────────────────────────────────────────────────────────
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
    for (let a = 1; a <= 20; a++)
      for (let b = 1; b <= 20; b++)
        pool.push({ a, b });
    return shuffle(pool);
  }

  if (table === 'mix') {
    const max = diff.maxTable || 20;
    for (let a = 1; a <= max; a++)
      for (let b = 1; b <= 10; b++)
        pool.push({ a, b });
    return shuffle(pool).slice(0, diff.questions);
  }

  for (let b = 1; b <= 12; b++) pool.push({ a: table, b });
  for (let b = 1; b <= 12; b++) if (b !== table) pool.push({ a: b, b: table });
  return shuffle(pool).slice(0, mode === 'exam' ? 12 : 10);
}

// ── NumPad ────────────────────────────────────────────────────────────────────
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
function LearnMode({ table, onBack, onPractice }) {
  const [highlight, setHighlight] = useState(0);
  const [speed, setSpeed] = useState(() => {
    try { return parseInt(localStorage.getItem('lena:tables-speed') || '8', 10); } catch { return 8; }
  });
  const [showSettings, setShowSettings] = useState(false);
  const facts = Array.from({ length: 12 }, (_, i) => ({ b: i + 1, result: table * (i + 1) }));
  const f = facts[highlight] || facts[0];

  useEffect(() => {
    setHighlight(0);
    const id = setInterval(() => {
      setHighlight(h => (h + 1) % facts.length);
    }, speed * 1000);
    return () => clearInterval(id);
  }, [facts.length, speed]);

  return (
    <div className="tp-page">
      <header className="tp-header">
        <button type="button" className="tp-back" onPointerDown={onBack}>←</button>
        <div>
          <p className="tp-header__title">Table de {table}</p>
          <p className="tp-header__sub">Memoriser</p>
        </div>
        <button type="button" className="tp-back" onPointerDown={(e) => { e.preventDefault(); setShowSettings((s) => !s); }}>⚙️</button>
      </header>

      {showSettings && (
        <div style={{ margin: '0 14px 10px', background: 'rgba(255,255,255,.08)', borderRadius: 14, padding: '12px 14px', border: '1.5px solid rgba(255,255,255,.15)' }}>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '.75rem', fontWeight: 700, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '.6px' }}>
            Vitesse de defilement
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {[5, 8, 10, 15, 20, 30].map((s) => (
              <button
                key={s}
                type="button"
                style={{
                  padding: '10px 4px', borderRadius: 10, border: '2px solid',
                  borderColor: speed === s ? '#6366f1' : 'rgba(255,255,255,.15)',
                  background: speed === s ? '#6366f1' : 'rgba(255,255,255,.07)',
                  color: '#fff', fontWeight: 800, fontSize: '.85rem', cursor: 'pointer',
                }}
                onPointerDown={(e) => {
                  e.preventDefault();
                  setSpeed(s);
                  try { localStorage.setItem('lena:tables-speed', String(s)); } catch {}
                  setShowSettings(false);
                }}
              >
                {s}s
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hero — current highlighted fact */}
      <div className="tp-learn-hero">
        <div className="tp-learn-hero__eq">{table} × {f.b} =</div>
        <div className="tp-learn-hero__result">{f.result}</div>
      </div>

      {/* Full table grid */}
      <div className="tp-learn-body">
        {facts.map((fact, i) => (
          <div key={fact.b} className={`tp-learn-fact${highlight === i ? ' is-highlight' : ''}`}>
            <span className="tp-learn-fact__eq">{table} × {fact.b} =</span>
            <span className="tp-learn-fact__result">{fact.result}</span>
          </div>
        ))}
      </div>

      <div className="tp-learn-actions">
        <button type="button" className="tp-start-btn" onPointerDown={onPractice}>
          Pratiquer cette table →
        </button>
      </div>
    </div>
  );
}

// ── Quiz / Challenge mode ─────────────────────────────────────────────────────
function QuizMode({ table, mode, difficulty, onBack, onDone }) {
  const diff       = DIFFICULTIES.find(d => d.id === difficulty) || DIFFICULTIES[0];
  const isChallenge = mode === 'challenge';
  const hasTimer    = isChallenge || (mode === 'exam' && diff.time > 0) || (table === 'mix' && diff.time > 0);
  const totalTime   = isChallenge ? 60 : diff.time;

  const [questions]     = useState(() => genQuestions(table, mode, difficulty));
  const [qIdx, setQIdx] = useState(0);
  const [input, setInput]  = useState('');
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong'
  const [fbState, setFbState] = useState(null);
  const [score, setScore]       = useState(0);
  const [streak, setStreak]     = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime || 999);
  const [errors, setErrors]     = useState([]);
  const [showExplain, setShowExplain] = useState(false);
  const [challengeScore, setChallengeScore] = useState(0);

  const advanceRef  = useRef(null);
  const timerRef    = useRef(null);
  const feedbackRef = useRef(null);
  const inputRef    = useRef('');
  const scoreRef    = useRef(0);
  const qIdxRef     = useRef(0);
  const challengeScoreRef = useRef(0);

  feedbackRef.current = feedback;
  inputRef.current    = input;
  scoreRef.current    = score;
  qIdxRef.current     = qIdx;
  challengeScoreRef.current = challengeScore;

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
            setTimeout(() => onDone({
              score: challengeScoreRef.current,
              total: qIdxRef.current,
              errors: [],
              mode, table, isChallenge: true,
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

    const answer  = parseInt(inputRef.current, 10);
    const correct = answer === q.a * q.b;

    setFeedback(correct ? 'correct' : 'wrong');

    if (correct) {
      setScore(s => { scoreRef.current = s + 1; return s + 1; });
      setChallengeScore(s => { challengeScoreRef.current = s + 1; return s + 1; });
      setStreak(s => { const n = s + 1; setBestStreak(b => Math.max(b, n)); return n; });
      playChime(true);
    } else {
      setStreak(0);
      setErrors(prev => [...prev, { q, userAnswer: answer, correct: q.a * q.b }]);
      setShowExplain(true);
      playChime(false);
    }

    if (isChallenge) {
      // Challenge mode: auto-advance fast (no pause)
      advanceRef.current = setTimeout(() => {
        setQIdx(qIdxRef.current + 1);
        setInput('');
        setFeedback(null);
        setShowExplain(false);
      }, correct ? 400 : 900);
    } else {
      setFbState({ isCorrect: correct, correctAnswer: String(q.a * q.b) });
    }
  }, [q, errors, totalQ, isChallenge, mode, table, onDone]);

  // Physical keyboard
  useEffect(() => {
    function onKey(e) {
      if (e.key >= '0' && e.key <= '9') { handleDigit(parseInt(e.key)); return; }
      if (e.key === 'Backspace') { handleBackspace(); return; }
      if (e.key === 'Enter')     { handleOk(); return; }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleDigit, handleBackspace, handleOk]);

  useEffect(() => () => {
    clearTimeout(advanceRef.current);
    clearInterval(timerRef.current);
  }, []);

  function handleNext() {
    const nextIdx = qIdxRef.current + 1;
    const isLast = nextIdx >= totalQ;
    if (isLast) {
      clearInterval(timerRef.current);
      const finalErrors = fbState && !fbState.isCorrect
        ? [...errors, { q, userAnswer: parseInt(input, 10), correct: q.a * q.b }]
        : errors;
      updateProg(table, scoreRef.current, totalQ);
      onDone({ score: scoreRef.current, total: totalQ, errors: finalErrors, mode, table });
    } else {
      setQIdx(nextIdx);
      setInput('');
      setFeedback(null);
      setShowExplain(false);
    }
    setFbState(null);
  }

  const progress = isChallenge
    ? ((totalTime - timeLeft) / totalTime) * 100
    : (qIdx / (totalQ || 1)) * 100;
  const urgent = hasTimer && timeLeft <= 10;

  const tableLabel = table === 'mix'
    ? `Melange · ${diff.label}`
    : mode === 'challenge'
      ? 'Defi 60 secondes'
      : `Table de ${table}`;

  // Answer display logic
  const showInput   = feedback === null;
  const showCorrect = feedback === 'correct';
  const showWrong   = feedback === 'wrong';

  let answerClass = 'tp-eq-card__answer';
  if (input && showInput) answerClass += ' has-input';
  if (showCorrect)        answerClass += ' is-correct';
  if (showWrong)          answerClass += ' is-wrong';

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
          <span className="tp-quiz-bar__counter">{qIdx + 1}/{totalQ}</span>
        )}
      </div>

      {/* Progress bar */}
      <div className="tp-quiz-progress">
        <div
          className={`tp-quiz-progress__fill${urgent ? ' tp-quiz-progress__fill--urgent' : ''}`}
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>

      {/* Stats */}
      <div className="tp-stats">
        <div className="tp-stat">
          <span className="tp-stat__emoji">⭐</span>
          <span className="tp-stat__val">{isChallenge ? challengeScore : score}</span>
          <span className="tp-stat__lbl">pts</span>
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

      {/* Equation card — single merged card */}
      <div className={`tp-eq-card${showCorrect ? ' is-correct' : showWrong ? ' is-wrong' : ''}`}>
        <div className="tp-eq-card__line">
          <span className="tp-eq-card__num">{q.a}</span>
          <span className="tp-eq-card__op">×</span>
          <span className="tp-eq-card__num">{q.b}</span>
          <span className="tp-eq-card__op">=</span>
          <span className={answerClass}>
            {showInput && (
              <>
                {input || ''}
                {!input && <span style={{ color: 'rgba(255,255,255,.18)' }}>?</span>}
                {input && <span className="tp-cursor" />}
              </>
            )}
            {showCorrect && input}
            {showWrong && input}
          </span>
        </div>

        {/* Feedback hint */}
        {showCorrect && (
          <div className="tp-eq-card__hint">
            <span>✅</span>
            <span>Bravo !</span>
          </div>
        )}
        {showWrong && (
          <div className="tp-eq-card__hint tp-eq-card__hint--wrong">
            <span>❌</span>
            <span>La reponse etait <strong style={{ color: '#4ade80' }}>{q.a * q.b}</strong></span>
          </div>
        )}
      </div>

      {/* Error explanation */}
      {showExplain && showWrong && (
        <div className="tp-explanation">
          <p className="tp-explanation__title">Comment calculer {q.a} × {q.b} ?</p>
          <p className="tp-explanation__text">
            {q.a} × {q.b} = {Array.from({ length: Math.min(q.b, 12) }, () => q.a).join(' + ')}
            {q.b > 12 ? ' + ...' : ''} = <strong>{q.a * q.b}</strong>
          </p>
        </div>
      )}

      {/* Numpad fills remaining space */}
      <NumPad
        onDigit={handleDigit}
        onBackspace={handleBackspace}
        onOk={handleOk}
        canOk={feedback === null && input !== ''}
      />
      {fbState !== null && (
        <FeedbackCard
          isCorrect={fbState.isCorrect}
          correctAnswer={fbState.isCorrect ? null : fbState.correctAnswer}
          locale="fr"
          onNext={handleNext}
        />
      )}
    </div>
  );
}

// ── Results ───────────────────────────────────────────────────────────────────
function Results({ data, onRetry, onBack }) {
  const { score, total, errors, mode, table, isChallenge } = data;
  const pct   = total > 0 ? Math.round((score / total) * 100) : 0;
  const stars  = isChallenge
    ? (score >= 30 ? 3 : score >= 15 ? 2 : 1)
    : (pct >= 90 ? 3 : pct >= 70 ? 2 : 1);
  const passed = stars >= 2;

  useEffect(() => {
    if (passed) { fireConfetti(); playChime(true); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const tableLabel = table === 'mix'
    ? 'Melange'
    : `Table de ${table}`;

  return (
    <div className="tp-page">
      <header className="tp-header">
        <button type="button" className="tp-back" onPointerDown={onBack}>←</button>
        <div>
          <p className="tp-header__title">{tableLabel}</p>
          <p className="tp-header__sub">{MODES.find(m => m.id === mode)?.name}</p>
        </div>
      </header>

      <div className="tp-results">
        <span className="tp-results__trophy">{passed ? '🏆' : '💪'}</span>

        <h2 className="tp-results__title">
          {isChallenge
            ? `${score} bonnes reponses !`
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
                {score}
                <span style={{ fontSize: '1.4rem', opacity: .5 }}>/{total}</span>
              </div>
              <div className="tp-results-score-card__pct">{pct}% corrects</div>
            </>
          )}
        </div>

        <div className="tp-results-stars">
          {[1, 2, 3].map(i => (
            <span key={i} className="tp-results-star" style={{ opacity: i <= stars ? 1 : 0.15 }}>
              ⭐
            </span>
          ))}
        </div>

        {errors.length > 0 && (
          <div className="tp-errors">
            <p className="tp-errors__title">A retravailler ({errors.length})</p>
            {errors.slice(0, 6).map((err, i) => (
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

// ── Home ──────────────────────────────────────────────────────────────────────
export default function TablesPage() {
  const navigate = useNavigate();

  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedMode, setSelectedMode]   = useState('practice');
  const [selectedDiff, setSelectedDiff]   = useState('easy');
  const [phase, setPhase]     = useState('home');
  const [resultData, setResultData] = useState(null);
  const [prog] = useState(loadProg);

  function startSession() {
    if (!selectedTable) return;
    if (selectedMode === 'learn') { setPhase('learn'); return; }
    setPhase('quiz');
  }

  if (phase === 'learn') {
    return (
      <LearnMode
        table={selectedTable}
        onBack={() => setPhase('home')}
        onPractice={() => { setSelectedMode('practice'); setPhase('quiz'); }}
      />
    );
  }

  if (phase === 'quiz') {
    return (
      <QuizMode
        table={selectedTable}
        mode={selectedMode}
        difficulty={selectedDiff}
        onBack={() => { setPhase('home'); setResultData(null); }}
        onDone={(data) => { setResultData(data); setPhase('results'); }}
      />
    );
  }

  if (phase === 'results' && resultData) {
    return (
      <Results
        data={resultData}
        onRetry={() => setPhase('quiz')}
        onBack={() => { setPhase('home'); setResultData(null); }}
      />
    );
  }

  // HOME
  const canStart   = selectedTable !== null;
  const currentDiff = DIFFICULTIES.find(d => d.id === selectedDiff);

  return (
    <div className="tp-page">
      <header className="tp-header">
        <button type="button" className="tp-back" onPointerDown={() => navigate(-1)}>←</button>
      </header>

      {/* Hero */}
      <div className="tp-hero">
        <div className="tp-hero__icon">✖️</div>
        <div>
          <h1 className="tp-hero__title">Tables de<br />multiplication</h1>
          <p className="tp-hero__sub">Tables 1–20 · progression sauvegardee</p>
        </div>
      </div>

      <div className="tp-home-body">
        {/* Table selector */}
        <p className="tp-section-label">Choisir une table</p>
        <div className="tp-table-grid">
          {ALL_TABLES.map(t => {
            const { color, bg } = tableColor(t);
            const pct = getProgPct(t, prog);
            return (
              <button
                key={t}
                type="button"
                className={`tp-table-btn${selectedTable === t ? ' is-selected' : ''}`}
                style={{ '--tbtn-color': color, '--tbtn-bg': bg }}
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
              <div className="tp-mode-card__stripe" />
              <div className="tp-mode-card__body">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <span className="tp-mode-card__emoji">{m.emoji}</span>
                  <span className="tp-mode-card__check" style={{ color: m.color }}>✓</span>
                </div>
                <span className="tp-mode-card__name">{m.name}</span>
                <span className="tp-mode-card__desc">{m.desc}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Difficulty */}
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
                  {d.time > 0 && <span className="tp-diff-btn__time">{d.time}s</span>}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Session summary */}
        {selectedTable && (
          <div style={{
            background: 'rgba(99,102,241,.1)',
            border: '1.5px solid rgba(99,102,241,.3)',
            borderRadius: 14, padding: '10px 16px', marginTop: 12,
            fontSize: '.82rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.7,
          }}>
            {selectedTable === 'mix'
              ? `🌀 Melange · ${MODES.find(m => m.id === selectedMode)?.name}`
              : `×${selectedTable} · ${MODES.find(m => m.id === selectedMode)?.name}`}
            {selectedMode !== 'learn' && selectedMode !== 'challenge' && currentDiff && (
              <> · {currentDiff.label} · {currentDiff.questions} questions{currentDiff.time > 0 ? ` · ${currentDiff.time}s` : ''}</>
            )}
            {selectedMode === 'challenge' && <> · 60 secondes · toutes les tables</>}
          </div>
        )}
      </div>

      {/* Sticky start button */}
      <div className="tp-start-wrap">
        <button
          type="button"
          className="tp-start-btn"
          disabled={!canStart}
          onPointerDown={(e) => { e.preventDefault(); if (canStart) startSession(); }}
        >
          {!canStart
            ? 'Choisir une table ↑'
            : selectedMode === 'learn'
              ? '📖 Commencer a apprendre'
              : selectedMode === 'challenge'
                ? '⚡ Lancer le defi 60s'
                : '▶ Commencer'}
        </button>
      </div>
    </div>
  );
}
