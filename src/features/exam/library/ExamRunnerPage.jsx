import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getExamLevel, DIFFICULTY_LEVELS } from '../../../content/exams/registry.js';
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
  const examId = params.get('exam');
  const levelKey = params.get('level') || 'facile';

  const data = useMemo(() => getExamLevel(examId, levelKey), [examId, levelKey]);
  const levelMeta = DIFFICULTY_LEVELS.find((l) => l.key === levelKey);

  const hasStory = !!data?.level?.story;
  const [phase, setPhase] = useState(hasStory ? 'read' : 'quiz'); // read | quiz | end
  const [pageIndex, setPageIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState([]);

  const startRef = useRef(Date.now());

  const questions = data?.level?.questions || [];
  const currentQ = questions[qIndex];
  const totalQ = questions.length;

  useEffect(() => { startRef.current = Date.now(); }, []);

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
    setPhase(hasStory ? 'read' : 'quiz');
    setPageIndex(0);
    setQIndex(0);
    setSelected(null);
    setInput('');
    setFeedback(null);
    setScore(0);
    startRef.current = Date.now();
  }

  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR';
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
          <h2 style={{ color: '#fff', margin: 0 }}>{passed ? 'Réussi !' : 'Continue à t’entraîner !'}</h2>
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
            ? <button type="button" className="reader-btn reader-btn--next" onClick={() => setPageIndex((p) => p + 1)}>Suivant →</button>
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

      <div className="reader-card" style={{ minHeight: 90 }}>
        <p className="reader-text" style={{ fontSize: '1.15rem' }}>{currentQ.prompt}</p>
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
              value={selected !== null ? String(selected) : input}
              onChange={(e) => setInput(e.target.value)}
              disabled={selected !== null}
              placeholder="Ta réponse…"
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
            <p style={{ margin: 0, fontWeight: 700 }}>{feedback === 'correct' ? '✅ Bonne réponse !' : '❌ Pas tout à fait…'}</p>
            {feedback === 'wrong' && (
              <div className="mc-feedback__correct-answer" style={{ marginTop: 8 }}>
                Bonne réponse : <strong>{currentQ.type === 'true_false' ? (currentQ.answer ? 'Vrai' : 'Faux') : String(currentQ.answer)}</strong>
              </div>
            )}
            {currentQ.correction && <p style={{ margin: '8px 0 0', fontSize: '.88rem', opacity: 0.85 }}>{currentQ.correction}</p>}
            <button type="button" className="reader-btn reader-btn--next" style={{ marginTop: 12, width: '100%' }} onClick={next}>
              {qIndex + 1 < totalQ ? 'Suivant →' : 'Voir le résultat'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
