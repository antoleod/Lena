import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearErrors, getErrors } from '../../services/storage/errorHistoryStore.js';

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuestions(errors) {
  return errors.slice(0, 20).map(err => {
    // Determine type: if correctAnswer is 'true' or 'false', treat as true_false
    if (err.correctAnswer === 'true' || err.correctAnswer === 'false') {
      return {
        ...err,
        type: 'true_false',
        correctAnswerBool: err.correctAnswer === 'true',
      };
    }
    // Otherwise multiple choice: show correct + 2 dummy distractors from other errors
    const distractors = errors
      .filter(e => e.correctAnswer !== err.correctAnswer && e.correctAnswer !== 'true' && e.correctAnswer !== 'false')
      .map(e => e.correctAnswer);
    const uniqueDistractors = [...new Set(distractors)].filter(d => d !== err.correctAnswer);
    const picked = shuffleArray(uniqueDistractors).slice(0, 2);
    const options = shuffleArray([err.correctAnswer, ...picked]);
    return { ...err, type: 'multiple_choice', options };
  });
}

function topicCounts(errors) {
  const counts = {};
  for (const e of errors) {
    counts[e.topic] = (counts[e.topic] || 0) + 1;
  }
  return counts;
}

function TopicTags({ counts }) {
  return (
    <div className="error-topic-list">
      {Object.entries(counts).map(([topic, count]) => (
        <span key={topic} className="error-topic-tag">
          {topic} ({count})
        </span>
      ))}
    </div>
  );
}

export default function ErrorReviewPage() {
  const navigate = useNavigate();
  const [allErrors, setAllErrors] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [phase, setPhase] = useState('intro'); // 'intro' | 'exam' | 'end'
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [reviewScore, setReviewScore] = useState(0);
  const [confirmClear, setConfirmClear] = useState(false);
  const advanceTimer = useRef(null);

  useEffect(() => {
    const errors = shuffleArray(getErrors());
    setAllErrors(errors);
    setQuestions(buildQuestions(errors));
    return () => clearTimeout(advanceTimer.current);
  }, []);

  function startReview() {
    setPhase('exam');
    setQIndex(0);
    setSelected(null);
    setFeedback(null);
    setReviewScore(0);
  }

  function advanceQuestion() {
    const next = qIndex + 1;
    if (next >= questions.length) {
      setPhase('end');
    } else {
      setQIndex(next);
      setSelected(null);
      setFeedback(null);
    }
  }

  function handleAnswer(choice) {
    if (selected !== null) return;
    clearTimeout(advanceTimer.current);
    const q = questions[qIndex];

    let isCorrect;
    if (q.type === 'true_false') {
      isCorrect = choice === q.correctAnswerBool;
    } else {
      isCorrect = choice === q.correctAnswer;
    }

    setSelected(choice);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      setReviewScore(s => s + 1);
      advanceTimer.current = setTimeout(advanceQuestion, 1200);
    }
  }

  function handleClear() {
    if (confirmClear) {
      clearErrors();
      setAllErrors([]);
      setQuestions([]);
      setPhase('intro');
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
    }
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (allErrors.length === 0) {
    return (
      <div className="error-review-page">
        <div className="reader-header" style={{ paddingLeft: 0 }}>
          <Link className="exam-back-btn" to="/exam">←</Link>
          <span style={{ color: '#fff', fontWeight: 700 }}>Révision des erreurs</span>
        </div>
        <div className="error-empty">
          <p style={{ fontSize: '2rem' }}>🌟</p>
          <p>Aucune erreur ! Continue comme ça !</p>
          <Link to="/exam" style={{ display: 'inline-block', marginTop: 20, color: '#f39c12', fontWeight: 700 }}>
            Retour aux examens
          </Link>
        </div>
      </div>
    );
  }

  // ── End screen ────────────────────────────────────────────────────────────
  if (phase === 'end') {
    const pct = reviewScore / questions.length;
    return (
      <div className="error-review-page">
        <div className="reader-header" style={{ paddingLeft: 0 }}>
          <Link className="exam-back-btn" to="/exam">←</Link>
          <span style={{ color: '#fff', fontWeight: 700 }}>Révision terminée !</span>
        </div>
        <div className="reader-card" style={{ textAlign: 'center', marginTop: 24 }}>
          <p style={{ fontSize: '2.5rem' }}>🎯</p>
          <p style={{ fontSize: '1.6rem', color: '#fff', fontWeight: 700, margin: '8px 0' }}>
            {reviewScore} / {questions.length}
          </p>
          {pct >= 0.8 && <p style={{ color: '#27ae60', fontWeight: 700 }}>Excellent ! Tu progresses vraiment !</p>}
          {pct >= 0.5 && pct < 0.8 && <p style={{ color: '#f39c12', fontWeight: 700 }}>Bien joué ! Continue la révision !</p>}
          {pct < 0.5 && <p style={{ color: 'rgba(255,255,255,.7)' }}>Continue à pratiquer, tu y arriveras !</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
            <button type="button" className="reader-btn reader-btn--start" style={{ width: '100%' }} onClick={startReview}>
              🔄 Recommencer la révision
            </button>
            <button type="button" className="reader-btn reader-btn--prev" style={{ width: '100%' }} onClick={() => navigate('/exam')}>
              ← Retour aux examens
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Exam phase ────────────────────────────────────────────────────────────
  if (phase === 'exam') {
    const q = questions[qIndex];
    return (
      <div className="error-review-page">
        <div className="reader-header" style={{ paddingLeft: 0 }}>
          <button type="button" className="exam-back-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#fff' }} onClick={() => setPhase('intro')}>←</button>
          <span style={{ color: '#fff', fontWeight: 700 }}>Révision</span>
          <span className="reader-page-indicator">Q {qIndex + 1} / {questions.length}</span>
        </div>

        <div className="reader-card" style={{ marginBottom: 16 }}>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.75rem', margin: '0 0 6px' }}>
            Sujet : {q.topic}
          </p>
          <p className="reader-text" style={{ fontSize: '1.1rem' }}>{q.question}</p>
        </div>

        <div style={{ padding: '0 0 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.type === 'multiple_choice' && (q.options || []).map(option => {
            let btnStyle = {};
            if (selected !== null) {
              if (option === q.correctAnswer) btnStyle = { background: '#27ae60', color: '#fff' };
              else if (option === selected) btnStyle = { background: '#e74c3c', color: '#fff' };
              else btnStyle = { opacity: 0.4 };
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

          {q.type === 'true_false' && (
            <div className="tf-buttons">
              {[true, false].map(val => {
                const label = val ? 'Vrai ✓' : 'Faux ✗';
                return (
                  <button
                    key={String(val)}
                    type="button"
                    className={`tf-btn ${val ? 'tf-btn--vrai' : 'tf-btn--faux'}`}
                    disabled={selected !== null}
                    style={selected !== null && val !== q.correctAnswerBool && val !== selected ? { opacity: 0.4 } : {}}
                    onClick={() => handleAnswer(val)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {feedback && (
          <div className={`exam-explanation--${feedback}`} style={{ borderRadius: 14, padding: '14px 16px' }}>
            <p style={{ margin: 0, fontWeight: 700 }}>
              {feedback === 'correct' ? '✅ Bonne réponse !' : '❌ Pas tout à fait…'}
            </p>
            {feedback === 'wrong' && (
              <>
                <div className="mc-feedback__correct-answer" style={{ marginTop: 8 }}>
                  Bonne réponse : <strong>
                    {q.type === 'true_false'
                      ? (q.correctAnswerBool ? 'Vrai' : 'Faux')
                      : q.correctAnswer}
                  </strong>
                </div>
                <button type="button" className="reader-btn reader-btn--next" style={{ marginTop: 12, width: '100%' }} onClick={advanceQuestion}>
                  Suivant →
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── Intro / overview ──────────────────────────────────────────────────────
  const counts = topicCounts(allErrors);
  return (
    <div className="error-review-page">
      <div className="reader-header" style={{ paddingLeft: 0 }}>
        <Link className="exam-back-btn" to="/exam">←</Link>
        <div>
          <span className="eyebrow">Erreurs à réviser</span>
          <h2 style={{ margin: 0, color: '#fff' }}>Révision des erreurs</h2>
        </div>
      </div>

      <p style={{ color: 'rgba(255,255,255,.7)', marginBottom: 12 }}>
        {allErrors.length} erreur{allErrors.length > 1 ? 's' : ''} enregistrée{allErrors.length > 1 ? 's' : ''}.
        {questions.length < allErrors.length && ` On va réviser ${questions.length} questions.`}
      </p>

      <TopicTags counts={counts} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
        <button type="button" className="reader-btn reader-btn--start" style={{ width: '100%' }} onClick={startReview}>
          Commencer la révision ({questions.length} questions)
        </button>

        <button
          type="button"
          className="reader-btn reader-btn--prev"
          style={{ width: '100%', background: confirmClear ? '#e74c3c' : 'rgba(231,76,60,.2)', border: '1px solid rgba(231,76,60,.4)', color: '#fff' }}
          onClick={handleClear}
        >
          {confirmClear ? '⚠️ Confirmer : vider l'historique' : '🗑️ Vider l'historique'}
        </button>
        {confirmClear && (
          <button type="button" className="reader-btn reader-btn--prev" style={{ width: '100%' }} onClick={() => setConfirmClear(false)}>
            Annuler
          </button>
        )}
      </div>
    </div>
  );
}
