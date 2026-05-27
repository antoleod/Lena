import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { generateExercise } from '../../engines/generators/exerciseGenerators.js';
import { recordStudyTime } from '../../services/storage/progressStore.js';

// ── Config per mode ──────────────────────────────────────────────────────────

const MODE_CONFIG = {
  relax: {
    label: 'Relax',
    emoji: '😌',
    questionCount: 15,
    perQuestionSeconds: null,
    globalSeconds: null,
    lives: null,
    showExplanation: true,
  },
  time: {
    label: 'Chronométré',
    emoji: '⏱️',
    questionCount: 15,
    perQuestionSeconds: 20,
    globalSeconds: null,
    lives: null,
    showExplanation: false,
  },
  challenge: {
    label: 'Défi',
    emoji: '🏆',
    questionCount: 20,
    perQuestionSeconds: null,
    globalSeconds: 180,
    lives: 3,
    showExplanation: false,
  },
};

const TOPIC_LABELS = {
  addition: 'Addition',
  subtraction: 'Soustraction',
  multiplication: 'Multiplication',
  division: 'Division',
  fractions: 'Fractions',
  'mixed-operations': 'Opérations mixtes',
  logic: 'Logique',
  'word-problems': 'Problèmes',
};

const TOPIC_GRADES = {
  addition: 'P3',
  subtraction: 'P3',
  multiplication: 'P3',
  division: 'P4',
  fractions: 'P4',
  'mixed-operations': 'P5',
  logic: 'P3',
  'word-problems': 'P3',
};

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ── Per-question countdown circle ────────────────────────────────────────────

function TimerCircle({ seconds, total }) {
  const R = 22;
  const circ = 2 * Math.PI * R;
  const pct = seconds / total;
  const offset = circ - pct * circ;
  const color = pct > 0.4 ? 'var(--gold)' : '#e74c3c';

  return (
    <div className="exam-timer-circle">
      <svg viewBox="0 0 56 56" width="56" height="56">
        <circle cx="28" cy="28" r={R} fill="none" stroke="var(--line)" strokeWidth="5" />
        <circle
          cx="28" cy="28" r={R}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <span className="exam-timer-circle__num">{seconds}</span>
    </div>
  );
}

// ── Lives display ─────────────────────────────────────────────────────────────

function LivesDisplay({ lives, maxLives }) {
  return (
    <div className="exam-lives">
      {Array.from({ length: maxLives }, (_, i) => (
        <span key={i} className={i < lives ? 'exam-heart exam-heart--on' : 'exam-heart exam-heart--off'}>
          {i < lives ? '❤️' : '🖤'}
        </span>
      ))}
    </div>
  );
}

// ── Global countdown bar ──────────────────────────────────────────────────────

function GlobalTimerBar({ seconds, total }) {
  const pct = Math.max(0, (seconds / total) * 100);
  const color = pct > 33 ? 'var(--gold)' : '#e74c3c';
  return (
    <div className="exam-timer-bar-wrap">
      <div className="exam-timer-bar" style={{ width: `${pct}%`, background: color }} />
      <span className="exam-timer-bar__label">{formatTime(seconds)}</span>
    </div>
  );
}

// ── Main ExamPage ─────────────────────────────────────────────────────────────

export default function ExamPage() {
  const [searchParams] = useSearchParams();
  const topic = searchParams.get('topic') || 'addition';
  const mode = searchParams.get('mode') || 'relax';
  const config = MODE_CONFIG[mode] || MODE_CONFIG.relax;
  const grade = TOPIC_GRADES[topic] || 'P3';

  // ── State ──────────────────────────────────────────────────────────────────
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);      // chosen option string
  const [feedback, setFeedback] = useState(null);      // 'correct' | 'wrong'
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.lives ?? 0);
  const [globalTime, setGlobalTime] = useState(config.globalSeconds ?? 0);
  const [perQTime, setPerQTime] = useState(config.perQuestionSeconds ?? 20);
  const [done, setDone] = useState(false);
  const [doneReason, setDoneReason] = useState('');    // 'finished' | 'lives' | 'timeout'

  const startTimeRef = useRef(Date.now());
  const globalTimerRef = useRef(null);
  const perQTimerRef = useRef(null);

  // ── Build questions on mount ───────────────────────────────────────────────
  useEffect(() => {
    const generated = Array.from({ length: config.questionCount }, () =>
      generateExercise({ topic, grade, difficulty: 'medium' })
    );
    setQuestions(generated);
    startTimeRef.current = Date.now();
  }, [topic, grade, config.questionCount]);

  // ── Global timer (challenge mode) ─────────────────────────────────────────
  useEffect(() => {
    if (!config.globalSeconds || done) return;
    globalTimerRef.current = setInterval(() => {
      setGlobalTime((t) => {
        if (t <= 1) {
          clearInterval(globalTimerRef.current);
          endExam('timeout');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(globalTimerRef.current);
  }, [config.globalSeconds, done]);

  // ── Per-question timer (time mode) ─────────────────────────────────────────
  useEffect(() => {
    if (!config.perQuestionSeconds || done || feedback !== null) return;
    setPerQTime(config.perQuestionSeconds);
    perQTimerRef.current = setInterval(() => {
      setPerQTime((t) => {
        if (t <= 1) {
          clearInterval(perQTimerRef.current);
          handleAutoAdvance();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(perQTimerRef.current);
  }, [qIndex, config.perQuestionSeconds, done, feedback]);

  function endExam(reason) {
    clearInterval(globalTimerRef.current);
    clearInterval(perQTimerRef.current);
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    recordStudyTime(elapsed);
    setDone(true);
    setDoneReason(reason || 'finished');
  }

  function handleAutoAdvance() {
    // Time ran out — counts as wrong
    if (config.lives !== null) {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) { endExam('lives'); return; }
    }
    advanceQuestion();
  }

  function advanceQuestion() {
    const nextIndex = qIndex + 1;
    if (nextIndex >= questions.length) {
      endExam('finished');
    } else {
      setQIndex(nextIndex);
      setSelected(null);
      setFeedback(null);
    }
  }

  function handleChoice(option) {
    if (selected !== null || done) return;
    clearInterval(perQTimerRef.current);

    const q = questions[qIndex];
    const isCorrect = option === q.correct;

    setSelected(option);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setScore((s) => s + 1);
    } else if (config.lives !== null) {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setTimeout(() => endExam('lives'), 900);
        return;
      }
    }

    // Auto-advance delay: relax waits for user click; time/challenge auto-advance
    if (mode !== 'relax') {
      setTimeout(advanceQuestion, 900);
    }
  }

  function handleNextRelax() {
    advanceQuestion();
  }

  function handleReplay() {
    const generated = Array.from({ length: config.questionCount }, () =>
      generateExercise({ topic, grade, difficulty: 'medium' })
    );
    setQuestions(generated);
    setQIndex(0);
    setSelected(null);
    setFeedback(null);
    setScore(0);
    setLives(config.lives ?? 0);
    setGlobalTime(config.globalSeconds ?? 0);
    setPerQTime(config.perQuestionSeconds ?? 20);
    setDone(false);
    setDoneReason('');
    startTimeRef.current = Date.now();
  }

  // ── End screen ─────────────────────────────────────────────────────────────
  if (done) {
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    const total = config.questionCount;
    const pct = Math.round((score / total) * 100);
    let resultEmoji = pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪';
    let resultMsg =
      doneReason === 'lives' ? 'Plus de vies — game over !'
      : doneReason === 'timeout' ? 'Temps écoulé !'
      : pct >= 80 ? 'Excellent travail !'
      : pct >= 50 ? 'Bonne performance !'
      : 'Continue à t\'entraîner !';

    return (
      <div className="exam-page">
        <div className="exam-end">
          <div className="exam-end__emoji">{resultEmoji}</div>
          <h2 className="exam-end__title">{resultMsg}</h2>
          <div className="exam-end__score">
            <span className="exam-end__score-num">{score}<span>/{total}</span></span>
            <span className="exam-end__pct">{pct}%</span>
          </div>
          <div className="exam-end__meta">
            <span>Matière : {TOPIC_LABELS[topic] || topic}</span>
            <span>Mode : {config.emoji} {config.label}</span>
          </div>
          <div className="exam-end__actions">
            <button className="primary-action" type="button" onClick={handleReplay}>
              Rejouer
            </button>
            <Link className="secondary-action" to="/exam">
              Choisir un autre sujet
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="exam-page exam-page--loading"><span>Chargement…</span></div>;
  }

  const q = questions[qIndex];

  return (
    <div className="exam-page">
      {/* Header */}
      <div className="exam-header">
        <Link className="exam-back-btn" to="/exam">←</Link>
        <div className="exam-header__info">
          <span className="exam-header__mode">{config.emoji} {config.label}</span>
          <span className="exam-header__topic">{TOPIC_LABELS[topic] || topic}</span>
        </div>
        <div className="exam-header__score">
          {score}/{config.questionCount}
        </div>
        {config.lives !== null && (
          <LivesDisplay lives={lives} maxLives={config.lives} />
        )}
      </div>

      {/* Global timer bar (challenge) */}
      {config.globalSeconds && (
        <GlobalTimerBar seconds={globalTime} total={config.globalSeconds} />
      )}

      {/* Progress indicator */}
      <div className="exam-progress-row">
        <div className="exam-progress-bar">
          <div className="exam-progress-fill" style={{ width: `${((qIndex) / config.questionCount) * 100}%` }} />
        </div>
        <span className="exam-progress-label">{qIndex + 1} / {config.questionCount}</span>
      </div>

      {/* Question card */}
      <div className="exam-question-card">
        {config.perQuestionSeconds && (
          <TimerCircle seconds={perQTime} total={config.perQuestionSeconds} />
        )}
        <p className="exam-question-text">{q.question}</p>
      </div>

      {/* Choices */}
      <div className="exam-choices">
        {(q.options || []).map((option) => {
          let modifier = '';
          if (selected !== null) {
            if (option === q.correct) modifier = 'exam-choice--correct';
            else if (option === selected && option !== q.correct) modifier = 'exam-choice--wrong';
          }
          return (
            <button
              key={option}
              type="button"
              className={`exam-choice ${modifier}`}
              onClick={() => handleChoice(option)}
              disabled={selected !== null}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Feedback / explanation (relax mode) */}
      {feedback && config.showExplanation && q.explanation && (
        <div className={`exam-explanation exam-explanation--${feedback}`}>
          <strong>{feedback === 'correct' ? '✓ Correct !' : '✗ Incorrect'}</strong>
          <p>{q.explanation}</p>
          <button className="primary-action" type="button" onClick={handleNextRelax}>
            {qIndex + 1 < config.questionCount ? 'Question suivante →' : 'Voir le résultat'}
          </button>
        </div>
      )}

      {/* Relax: next button even without explanation */}
      {feedback && mode === 'relax' && !q.explanation && (
        <div className={`exam-explanation exam-explanation--${feedback}`}>
          <strong>{feedback === 'correct' ? '✓ Correct !' : `✗ Incorrect — réponse : ${q.correct}`}</strong>
          <button className="primary-action" type="button" onClick={handleNextRelax}>
            {qIndex + 1 < config.questionCount ? 'Question suivante →' : 'Voir le résultat'}
          </button>
        </div>
      )}
    </div>
  );
}
