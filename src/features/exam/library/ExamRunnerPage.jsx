import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getExamLevel } from '../../../content/exams/registry.js';
import { getDifficultyLevels, getLocalizedField, getExamUi } from '../../../content/exams/examI18n.js';
import { useLocale } from '../../../shared/i18n/LocaleContext.jsx';
import { recordError } from '../../../services/storage/errorHistoryStore.js';
import { recordStudyTime } from '../../../services/storage/progressStore.js';
import { saveResult, starsFor } from './examLibraryProgress.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function highlight(text, keywords) {
  if (!keywords || !keywords.length) return text;
  const pattern = new RegExp(`(${keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return text.split(pattern).map((part, i) =>
    keywords.some((k) => k.toLowerCase() === part.toLowerCase())
      ? <mark key={i}>{part}</mark>
      : part
  );
}

function normalize(v) {
  return String(v).trim().toLowerCase().replace(/\s+/g, ' ');
}

function isCorrect(q, value) {
  if (q.type === 'true_false') return value === q.answer;
  if (q.type === 'fill_blank') {
    const accepted = [q.answer, ...(q.accept || [])].map(normalize);
    return accepted.includes(normalize(value));
  }
  return normalize(value) === normalize(q.answer);
}

export default function ExamRunnerPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { locale } = useLocale();
  const examId = params.get('exam');
  const levelKey = params.get('level') || 'facile';

  const data = useMemo(() => getExamLevel(examId, levelKey), [examId, levelKey]);
  const levelMeta = getDifficultyLevels(locale).find((l) => l.key === levelKey);
  const ui = getExamUi(locale);

  const hasStory = !!data?.level?.story;
  const [phase, setPhase] = useState('config'); // config | read | quiz | end
  const [pageIndex, setPageIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState([]);

  // Config state — Feature 3
  const [configQuestionCount, setConfigQuestionCount] = useState(null); // null = all
  const [configTimerMinutes, setConfigTimerMinutes] = useState(null);   // null = unlimited
  const [activeQuestions, setActiveQuestions] = useState(null); // sliced/shuffled questions
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(null);

  const startRef = useRef(Date.now());

  const allQuestions = data?.level?.questions || [];
  const questions = activeQuestions || allQuestions;
  const currentQ = questions[qIndex];
  const totalQ = questions.length;

  useEffect(() => { startRef.current = Date.now(); }, []);

  // Timer countdown — Feature 3
  const endExamRef = useRef(null);
  useEffect(() => {
    if (phase !== 'quiz' || !configTimerMinutes) { setTimerSecondsLeft(null); return; }
    const total = configTimerMinutes * 60;
    setTimerSecondsLeft(total);
    const id = setInterval(() => {
      setTimerSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          if (endExamRef.current) endExamRef.current();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, configTimerMinutes]);

  useEffect(() => {
    if (phase === 'quiz' && currentQ?.type === 'mcq') {
      setOptions(shuffle(currentQ.options));
    }
  }, [phase, qIndex, currentQ]);

  if (!data) {
    return (
      <div className="reader-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#fff' }}>Examen introuvable.</p>
        <Link to="/exam/library" style={{ color: '#f39c12', marginTop: 16 }}>← Retour</Link>
      </div>
    );
  }

  const { exam, level } = data;
  const pages = level.story?.pages || [];

  // ── CONFIG ────────────────────────────────────────────────────────────────
  if (phase === 'config') {
    const qCountOptions = [null, 5, 10, 15];
    const timerOptions = [null, 5, 10, 15, 20];
    return (
      <div className="reader-page" style={{ justifyContent: 'center', padding: '32px 16px' }}>
        <div className="reader-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '1.3rem' }}>{exam.emoji} {exam.title}</h2>
          <p style={{ color: 'rgba(255,255,255,.75)', margin: 0 }}>{ui.configTitle}</p>

          <div>
            <p style={{ color: '#fff', fontWeight: 700, marginBottom: 8 }}>{ui.questionsCount}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {qCountOptions.map((n) => (
                <button
                  key={String(n)}
                  type="button"
                  className="exam-choice"
                  style={configQuestionCount === n ? { background: 'var(--primary)', color: '#fff', border: '2px solid var(--primary)' } : {}}
                  onClick={() => setConfigQuestionCount(n)}
                >
                  {n === null ? ui.allQuestions : n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p style={{ color: '#fff', fontWeight: 700, marginBottom: 8 }}>{ui.duree}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {timerOptions.map((n) => (
                <button
                  key={String(n)}
                  type="button"
                  className="exam-choice"
                  style={configTimerMinutes === n ? { background: 'var(--primary)', color: '#fff', border: '2px solid var(--primary)' } : {}}
                  onClick={() => setConfigTimerMinutes(n)}
                >
                  {n === null ? ui.illimitee : `${n} min`}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="reader-btn reader-btn--start"
            onClick={() => {
              let qs = allQuestions;
              if (configQuestionCount && configQuestionCount < qs.length) {
                qs = shuffle(qs).slice(0, configQuestionCount);
              }
              setActiveQuestions(qs);
              setQIndex(0);
              setScore(0);
              setSelected(null);
              setInput('');
              setFeedback(null);
              startRef.current = Date.now();
              setPhase(hasStory ? 'read' : 'quiz');
            }}
          >
            {ui.start}
          </button>
        </div>
      </div>
    );
  }

  function answer(value) {
    if (selected !== null) return;
    const ok = isCorrect(currentQ, value);
    setSelected(value);
    setFeedback(ok ? 'correct' : 'wrong');
    if (ok) setScore((s) => s + 1);
    else {
      recordError({
        topic: exam.category,
        question: currentQ.prompt,
        correctAnswer: String(currentQ.answer),
        userAnswer: String(value),
        source: 'exam-library',
      });
    }
  }

  // Keep endExamRef in sync with latest score/totalQ so the timer can call it.
  endExamRef.current = () => {
    const elapsed = Math.round((Date.now() - startRef.current) / 1000);
    recordStudyTime(elapsed);
    saveResult(exam?.id, levelKey, score, totalQ);
    setPhase('end');
  };

  function next() {
    if (qIndex + 1 >= totalQ) {
      const elapsed = Math.round((Date.now() - startRef.current) / 1000);
      recordStudyTime(elapsed);
      saveResult(exam.id, levelKey, score, totalQ);
      setPhase('end');
    } else {
      setQIndex((i) => i + 1);
      setSelected(null);
      setInput('');
      setFeedback(null);
    }
  }

  function restart() {
    setPhase('config');
    setPageIndex(0);
    setQIndex(0);
    setSelected(null);
    setInput('');
    setFeedback(null);
    setScore(0);
    setActiveQuestions(null);
    setTimerSecondsLeft(null);
    startRef.current = Date.now();
  }

  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = ui.speechLang;
    window.speechSynthesis.speak(u);
  }

  // ── END ──────────────────────────────────────────────────────────────────
  if (phase === 'end') {
    const pct = Math.round((score / totalQ) * 100);
    const passed = pct >= (level.passPercent ?? 60);
    const stars = starsFor(score, totalQ, level.passPercent);
    return (
      <div className="reader-page" style={{ justifyContent: 'center', padding: '40px 16px' }}>
        <div className="reader-card" style={{ textAlign: 'center', gap: 14, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '3rem' }}>{passed ? '🏆' : '💪'}</span>
          <h2 style={{ color: '#fff', margin: 0 }}>{passed ? ui.passed : ui.keepPractising}</h2>
          <p style={{ color: 'rgba(255,255,255,.7)', margin: 0 }}>{exam.emoji} {exam.title} · {levelMeta?.label}</p>
          <p style={{ fontSize: '1.6rem', color: '#fff', fontWeight: 700 }}>{score} / {totalQ} <span style={{ fontSize: '1rem', opacity: .7 }}>({pct}%)</span></p>
          <p style={{ fontSize: '1.8rem', letterSpacing: 4 }}>
            {[1, 2, 3].map((i) => <span key={i} style={{ opacity: i <= stars ? 1 : 0.25 }}>⭐</span>)}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', marginTop: 8 }}>
            <button type="button" className="reader-btn reader-btn--next" style={{ width: '100%' }} onClick={restart}>🔄 Recommencer</button>
            <button type="button" className="reader-btn reader-btn--start" style={{ width: '100%' }} onClick={() => navigate(`/exam/library/${exam.category}`)}>📚 Autres examens</button>
          </div>
        </div>
      </div>
    );
  }

  // ── READ ─────────────────────────────────────────────────────────────────
  if (phase === 'read') {
    const page = pages[pageIndex];
    const last = pageIndex >= pages.length - 1;
    return (
      <div className="reader-page">
        <div className="reader-header">
          <button type="button" className="exam-back-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#fff' }} onClick={() => navigate(`/exam/library/${exam.category}`)}>←</button>
          <span style={{ color: '#fff', fontWeight: 700 }}>{exam.emoji} {exam.title}</span>
          <span className="reader-page-indicator">Page {pageIndex + 1} / {pages.length}</span>
        </div>
        <div className="reader-card">
          <p className="reader-text">{highlight(page.text, page.keywords)}</p>
        </div>
        <div className="reader-nav">
          <button type="button" className="reader-btn reader-btn--prev" disabled={pageIndex === 0} style={pageIndex === 0 ? { opacity: 0.35 } : {}} onClick={() => setPageIndex((p) => p - 1)}>← Précédent</button>
          <button type="button" className="reader-btn reader-btn--listen" onClick={() => speak(page.text)}>🔊 Écouter</button>
          {!last
            ? <button type="button" className="reader-btn reader-btn--next" onClick={() => setPageIndex((p) => p + 1)}>{ui.next}</button>
            : <button type="button" className="reader-btn reader-btn--start" onClick={() => setPhase('quiz')}>Commencer les questions →</button>}
        </div>
      </div>
    );
  }

  // ── QUIZ ─────────────────────────────────────────────────────────────────
  return (
    <div className="reader-page">
      <div className="reader-header">
        <button type="button" className="exam-back-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#fff' }} onClick={() => navigate(`/exam/library/${exam.category}`)}>←</button>
        <span style={{ color: '#fff', fontWeight: 700 }}>{exam.title} · {levelMeta?.emoji}</span>
        <span className="reader-page-indicator">Q {qIndex + 1} / {totalQ}</span>
      </div>

      <div className="exam-progress-row" style={{ padding: '0 16px' }}>
        <div className="exam-progress-bar"><div className="exam-progress-fill" style={{ width: `${(qIndex / totalQ) * 100}%` }} /></div>
        <span className="exam-progress-label">{score} pt</span>
      </div>

      {configTimerMinutes && timerSecondsLeft !== null && (() => {
        const total = configTimerMinutes * 60;
        const pct = (timerSecondsLeft / total) * 100;
        const fillColor = timerSecondsLeft <= 30 ? '#e74c3c' : timerSecondsLeft <= 120 ? '#f39c12' : '#2ecc71';
        const mm = String(Math.floor(timerSecondsLeft / 60)).padStart(2, '0');
        const ss = String(timerSecondsLeft % 60).padStart(2, '0');
        return (
          <div className="exam-progress-row" style={{ padding: '4px 16px 0' }}>
            <div className="exam-progress-bar" style={{ height: 8 }}>
              <div className="exam-progress-fill" style={{ width: `${pct}%`, background: fillColor, transition: 'width 1s linear, background .5s' }} />
            </div>
            <span className="exam-progress-label" style={{ color: timerSecondsLeft <= 30 ? '#e74c3c' : 'var(--muted)', fontWeight: timerSecondsLeft <= 30 ? 700 : 400 }}>
              {ui.tempsRestant} {mm}:{ss}
            </span>
          </div>
        );
      })()}

      <div className="reader-card" style={{ minHeight: 90 }}>
        <p className="reader-text" style={{ fontSize: '1.15rem' }}>{getLocalizedField(currentQ, 'prompt', locale)}</p>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {currentQ.type === 'mcq' && options.map((opt) => {
          let style = {};
          if (selected !== null) {
            if (normalize(opt) === normalize(currentQ.answer)) style = { background: '#27ae60', color: '#fff' };
            else if (opt === selected) style = { background: '#e74c3c', color: '#fff' };
            else style = { opacity: 0.45 };
          }
          return (
            <button key={opt} type="button" className="exam-choice" style={style} disabled={selected !== null} onClick={() => answer(opt)}>{opt}</button>
          );
        })}

        {currentQ.type === 'true_false' && (
          <div className="tf-buttons">
            {[true, false].map((val) => {
              let extra = '';
              if (selected !== null) {
                if (val === currentQ.answer) extra = ' tf-btn--vrai';
                else if (val === selected) extra = ' tf-btn--faux';
              }
              return (
                <button key={String(val)} type="button" className={`tf-btn ${val ? 'tf-btn--vrai' : 'tf-btn--faux'}${extra}`} disabled={selected !== null} onClick={() => answer(val)} style={selected !== null && val !== currentQ.answer && val !== selected ? { opacity: 0.45 } : {}}>
                  {val ? 'Vrai ✓' : 'Faux ✗'}
                </button>
              );
            })}
          </div>
        )}

        {currentQ.type === 'fill_blank' && (
          <form onSubmit={(e) => { e.preventDefault(); if (selected === null && input.trim() !== '') answer(input.trim()); }} style={{ display: 'flex', gap: 8 }}>
            <input
              className="exam-choice"
              style={{ flex: 1, textAlign: 'center' }}
              inputMode={/^-?\d+([.,]\d+)?$/.test(String(currentQ.answer ?? '').trim()) ? 'numeric' : 'text'}
              value={selected !== null ? String(selected) : input}
              onChange={(e) => setInput(e.target.value)}
              disabled={selected !== null}
              placeholder={ui.placeholder}
              autoFocus
            />
            {selected === null && (
              <button type="submit" className="reader-btn reader-btn--next" disabled={input.trim() === ''}>OK</button>
            )}
          </form>
        )}
      </div>

      {feedback && (
        <div style={{ padding: '0 16px' }}>
          <div className={`exam-explanation--${feedback}`} style={{ borderRadius: 14, padding: '14px 16px' }}>
            <p style={{ margin: 0, fontWeight: 700 }}>{feedback === 'correct' ? ui.correct : ui.wrong}</p>
            {feedback === 'wrong' && (
              <div className="mc-feedback__correct-answer" style={{ marginTop: 8 }}>
                {ui.correctAnswer} <strong>{currentQ.type === 'true_false' ? (currentQ.answer ? ui.vrai : ui.faux) : String(currentQ.answer)}</strong>
              </div>
            )}
            {currentQ.correction && <p style={{ margin: '8px 0 0', fontSize: '.88rem', opacity: 0.85 }}>{getLocalizedField(currentQ, 'correction', locale)}</p>}
            <button type="button" className="reader-btn reader-btn--next" style={{ marginTop: 12, width: '100%' }} onClick={next}>
              {qIndex + 1 < totalQ ? ui.next : ui.seeResult}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
