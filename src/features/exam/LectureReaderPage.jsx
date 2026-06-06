import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LECTURE_STORIES } from '../../content/lecture/stories.js';
import { recordError } from '../../services/storage/errorHistoryStore.js';
import { recordStudyTime } from '../../services/storage/progressStore.js';

const PROGRESS_KEY = 'lena:lecture:v1';

function loadAllProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); } catch { return {}; }
}

function saveProgress(storyId, score, total) {
  const all = loadAllProgress();
  all[storyId] = { score, total, ts: Date.now() };
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(all)); } catch {}
}

function highlightKeywords(text, keywords) {
  if (!keywords || keywords.length === 0) return [text];
  const pattern = new RegExp(`(${keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(pattern);
  return parts.map((part, i) => {
    const isKeyword = keywords.some(k => k.toLowerCase() === part.toLowerCase());
    return isKeyword ? <mark key={i}>{part}</mark> : part;
  });
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function starsForScore(score, total) {
  if (total === 0) return 0;
  const pct = score / total;
  if (pct === 1) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.4) return 1;
  return 0;
}

export default function LectureReaderPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const storyId = searchParams.get('story');
  const story = LECTURE_STORIES.find(s => s.id === storyId);

  const [phase, setPhase] = useState('read'); // 'read' | 'exam' | 'end'
  const [pageIndex, setPageIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [score, setScore] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  const startTimeRef = useRef(Date.now());
  const advanceTimerRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
    return () => clearTimeout(advanceTimerRef.current);
  }, []);

  useEffect(() => {
    if (phase === 'exam' && story) {
      const q = story.questions[qIndex];
      if (q.type === 'multiple_choice') {
        setShuffledOptions(shuffleArray(q.options));
      }
    }
  }, [phase, qIndex, story]);

  if (!story) {
    return (
      <div className="reader-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#fff' }}>Histoire introuvable.</p>
        <Link to="/exam/lecture" style={{ color: '#f39c12', marginTop: 16 }}>← Retour</Link>
      </div>
    );
  }

  const currentPage = story.pages[pageIndex];
  const totalPages = story.pages.length;
  const currentQ = story.questions[qIndex];
  const totalQ = story.questions.length;

  function speakPage() {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentPage.text);
    utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
  }

  function goNextPage() {
    if (pageIndex < totalPages - 1) {
      setPageIndex(p => p + 1);
    }
  }

  function goPrevPage() {
    if (pageIndex > 0) {
      setPageIndex(p => p - 1);
    }
  }

  function startExam() {
    setPhase('exam');
    setQIndex(0);
    setSelected(null);
    setFeedback(null);
  }

  function advanceQuestion() {
    const next = qIndex + 1;
    if (next >= totalQ) {
      finishExam();
    } else {
      setQIndex(next);
      setSelected(null);
      setFeedback(null);
    }
  }

  function finishExam() {
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    recordStudyTime(elapsed);
    saveProgress(story.id, score, totalQ);
    setPhase('end');
  }

  function handleAnswer(choice) {
    if (selected !== null) return;
    clearTimeout(advanceTimerRef.current);

    const isCorrect = currentQ.type === 'true_false'
      ? choice === currentQ.answer
      : choice === currentQ.answer;

    setSelected(choice);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setScore(s => s + 1);
      advanceTimerRef.current = setTimeout(advanceQuestion, 1200);
    } else {
      recordError({
        topic: 'lecture',
        question: currentQ.question,
        correctAnswer: String(currentQ.answer),
        userAnswer: String(choice),
        source: 'lecture',
      });
    }
  }

  function handleNext() {
    advanceQuestion();
  }

  function restartRead() {
    setPhase('read');
    setPageIndex(0);
    setQIndex(0);
    setSelected(null);
    setFeedback(null);
    setScore(0);
    startTimeRef.current = Date.now();
  }

  function restartExam() {
    setPhase('exam');
    setQIndex(0);
    setSelected(null);
    setFeedback(null);
    setScore(0);
    startTimeRef.current = Date.now();
  }

  const stars = starsForScore(score, totalQ);

  // ── End screen ────────────────────────────────────────────────────────────
  if (phase === 'end') {
    return (
      <div className="reader-page" style={{ justifyContent: 'center', padding: '40px 16px' }}>
        <div className="reader-card" style={{ textAlign: 'center', gap: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '3rem' }}>{story.emoji}</span>
          <h2 style={{ color: '#fff', margin: 0 }}>Bravo !</h2>
          <p style={{ color: 'rgba(255,255,255,.7)', margin: 0 }}>{story.title}</p>
          <p style={{ fontSize: '1.6rem', color: '#fff', fontWeight: 700 }}>
            {score} / {totalQ}
          </p>
          <p style={{ fontSize: '1.8rem', letterSpacing: 4 }}>
            {[1, 2, 3].map(i => (
              <span key={i} style={{ opacity: i <= stars ? 1 : 0.25 }}>⭐</span>
            ))}
          </p>
          {stars < 2 && (
            <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '.9rem' }}>
              Relis l'histoire pour mieux retenir !
            </p>
          )}
          {stars >= 2 && (
            <p style={{ color: '#27ae60', fontSize: '.95rem', fontWeight: 700 }}>
              Excellent travail ! Continue comme ça !
            </p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', marginTop: 8 }}>
            <button type="button" className="reader-btn reader-btn--prev" style={{ width: '100%' }} onClick={restartRead}>
              📖 Relire l'histoire
            </button>
            <button type="button" className="reader-btn reader-btn--next" style={{ width: '100%', background: '#8e44ad' }} onClick={restartExam}>
              🔄 Refaire les questions
            </button>
            <button type="button" className="reader-btn reader-btn--start" style={{ width: '100%' }} onClick={() => navigate('/exam/lecture')}>
              📚 Choisir une autre histoire
            </button>
            <button type="button" className="reader-btn reader-btn--prev" style={{ width: '100%', background: 'rgba(231,76,60,.3)' }} onClick={() => navigate('/exam/errors')}>
              ⚠️ Révision des erreurs
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Exam phase ────────────────────────────────────────────────────────────
  if (phase === 'exam') {
    return (
      <div className="reader-page">
        <div className="reader-header">
          <button type="button" className="exam-back-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#fff' }} onClick={() => navigate('/exam/lecture')}>←</button>
          <span style={{ color: '#fff', fontWeight: 700 }}>{story.title}</span>
          <span className="reader-page-indicator">Question {qIndex + 1} / {totalQ}</span>
        </div>

        <div className="reader-card" style={{ minHeight: 120 }}>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.8rem', marginBottom: 8 }}>Question {qIndex + 1}</p>
          <p className="reader-text" style={{ fontSize: '1.15rem' }}>{currentQ.question}</p>
        </div>

        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {currentQ.type === 'multiple_choice' && shuffledOptions.map(option => {
            let btnStyle = {};
            if (selected !== null) {
              if (option === currentQ.answer) btnStyle = { background: '#27ae60', color: '#fff' };
              else if (option === selected) btnStyle = { background: '#e74c3c', color: '#fff' };
              else btnStyle = { opacity: 0.45 };
            }
            return (
              <button
                key={option}
                type="button"
                className="exam-choice"
                style={btnStyle}
                disabled={selected !== null}
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            );
          })}

          {currentQ.type === 'true_false' && (
            <div className="tf-buttons">
              {[true, false].map(val => {
                const label = val ? 'Vrai ✓' : 'Faux ✗';
                let extra = '';
                if (selected !== null) {
                  if (val === currentQ.answer) extra = ' tf-btn--vrai';
                  else if (val === selected) extra = ' tf-btn--faux';
                }
                return (
                  <button
                    key={String(val)}
                    type="button"
                    className={`tf-btn ${val ? 'tf-btn--vrai' : 'tf-btn--faux'}${extra}`}
                    disabled={selected !== null}
                    onClick={() => handleAnswer(val)}
                    style={selected !== null && val !== currentQ.answer && val !== selected ? { opacity: 0.45 } : {}}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {feedback && (
          <div style={{ padding: '0 16px' }}>
            <div className={`exam-explanation--${feedback}`} style={{ borderRadius: 14, padding: '14px 16px' }}>
              <p style={{ margin: 0, fontWeight: 700 }}>
                {feedback === 'correct' ? '✅ Bonne réponse !' : '❌ Pas tout à fait…'}
              </p>
              {feedback === 'wrong' && (
                <div className="mc-feedback__correct-answer" style={{ marginTop: 8 }}>
                  Bonne réponse : <strong>{String(currentQ.answer) === 'true' ? 'Vrai' : String(currentQ.answer) === 'false' ? 'Faux' : currentQ.answer}</strong>
                </div>
              )}
              <p style={{ margin: '8px 0 0', fontSize: '.88rem', opacity: 0.85 }}>{currentQ.explanation}</p>
              {feedback === 'wrong' && (
                <button type="button" className="reader-btn reader-btn--next" style={{ marginTop: 12, width: '100%' }} onClick={handleNext}>
                  Suivant →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Read phase ────────────────────────────────────────────────────────────
  return (
    <div className="reader-page">
      <div className="reader-header">
        <button type="button" className="exam-back-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#fff' }} onClick={() => navigate('/exam/lecture')}>←</button>
        <span style={{ color: '#fff', fontWeight: 700 }}>{story.emoji} {story.title}</span>
        <span className="reader-page-indicator">Page {pageIndex + 1} / {totalPages}</span>
      </div>

      <div className="reader-card">
        <p className="reader-text">
          {highlightKeywords(currentPage.text, currentPage.keywords)}
        </p>
      </div>

      <div className="reader-nav">
        <button
          type="button"
          className="reader-btn reader-btn--prev"
          disabled={pageIndex === 0}
          style={pageIndex === 0 ? { opacity: 0.35 } : {}}
          onClick={goPrevPage}
        >
          ← Précédent
        </button>

        <button type="button" className="reader-btn reader-btn--listen" onClick={speakPage}>
          🔊 Écouter
        </button>

        {pageIndex < totalPages - 1 ? (
          <button type="button" className="reader-btn reader-btn--next" onClick={goNextPage}>
            Suivant →
          </button>
        ) : (
          <button type="button" className="reader-btn reader-btn--start" onClick={startExam}>
            Commencer les questions →
          </button>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, paddingBottom: 8 }}>
        {story.pages.map((_, i) => (
          <span
            key={i}
            style={{
              width: 8, height: 8, borderRadius: '50%',
              background: i === pageIndex ? '#f39c12' : 'rgba(255,255,255,.25)',
              display: 'inline-block',
              transition: 'background .2s',
            }}
          />
        ))}
      </div>
    </div>
  );
}
