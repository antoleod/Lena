import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedbackCard from '../../../shared/ui/FeedbackCard.jsx';
import NumericAnswerInput, { isNumericAnswerValue } from '../../../shared/ui/NumericAnswerInput.jsx';
import { getExamsByCategory, getExam } from '../../../content/exams/registry.js';
import { getLocalizedField } from '../../../content/exams/examI18n.js';
import { useLocale } from '../../../shared/i18n/LocaleContext.jsx';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalize(v) {
  return String(v).trim().toLowerCase().replace(/\s+/g, ' ');
}

function buildOptions(q) {
  if (q.type !== 'mcq' || !q.options) return q.options;
  const opts = [...q.options];
  const trap = q._userWrongAnswer;
  if (trap && !opts.some((o) => normalize(o) === normalize(trap))) {
    opts[opts.length - 1] = trap;
  }
  return shuffle(opts);
}

const UI = {
  fr: {
    title: 'Repas & Pratique',
    subtitle: 'Revois tes erreurs avec des pièges !',
    loading: 'Préparation du repas...',
    result: (c, t) => `${c} / ${t} corrects`,
    great: 'Bravo ! Tu progresses !',
    ok: 'Continue comme ça !',
    retry: 'Recommencer',
    back: 'Retour aux examens',
    trap: 'Attention, piège !',
    similar: 'Exercices similaires',
    wrongWas: 'Tu avais répondu :',
  },
  nl: {
    title: 'Herhaling & Oefening',
    subtitle: 'Oefen je fouten met valkuilen!',
    loading: 'Voorbereiding...',
    result: (c, t) => `${c} / ${t} correct`,
    great: 'Goed zo! Je maakt vooruitgang!',
    ok: 'Blijf zo doorgaan!',
    retry: 'Opnieuw',
    back: 'Terug naar examens',
    trap: 'Let op, valstrik!',
    similar: 'Vergelijkbare oefeningen',
    wrongWas: 'Je antwoordde:',
  },
  en: {
    title: 'Review & Practice',
    subtitle: 'Redo your mistakes with traps!',
    loading: 'Preparing review...',
    result: (c, t) => `${c} / ${t} correct`,
    great: 'Great job! You are improving!',
    ok: 'Keep it up!',
    retry: 'Try Again',
    back: 'Back to Exams',
    trap: 'Careful, trap!',
    similar: 'Similar exercises',
    wrongWas: 'You answered:',
  },
  es: {
    title: 'Repaso y Práctica',
    subtitle: 'Repasa tus errores con trampas!',
    loading: 'Preparando repaso...',
    result: (c, t) => `${c} / ${t} correctos`,
    great: 'Muy bien! Estás progresando!',
    ok: 'Sigue así!',
    retry: 'Repetir',
    back: 'Volver a exámenes',
    trap: 'Cuidado, trampa!',
    similar: 'Ejercicios similares',
    wrongWas: 'Respondiste:',
  },
};

function FillBlankInput({ onSubmit, question }) {
  const [val, setVal] = useState('');
  const answer = String(question?.answer ?? '').trim();
  const isNumeric = isNumericAnswerValue(answer);

  if (isNumeric) {
    return (
      <NumericAnswerInput
        value={val}
        onChange={setVal}
        onSubmit={onSubmit}
        expectedAnswer={answer}
        placeholder="..."
        allowNegative={answer.startsWith('-')}
        valueLabel="Ta réponse"
        readLabel="J'ai lu"
        handwritingLabel="Écrire la réponse"
        keypadLabel="Clavier numérique"
      />
    );
  }

  return (
    <div className="repaso-fill">
      <input
        type="text"
        className="repaso-fill__input"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && val.trim()) onSubmit(val.trim()); }}
        autoFocus
        placeholder="..."
      />
      <button
        type="button"
        className="repaso-fill__submit"
        onPointerDown={(e) => { e.preventDefault(); if (val.trim()) onSubmit(val.trim()); }}
      >
        →
      </button>
    </div>
  );
}

export default function ExamRepasoPage() {
  const { locale } = useLocale();
  const navigate = useNavigate();
  const ui = UI[locale] || UI.fr;

  const [phase, setPhase] = useState('loading');
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const raw = sessionStorage.getItem('lena:repaso:questions');
    const metaRaw = sessionStorage.getItem('lena:repaso:meta');
    if (!raw) {
      navigate('/exam/library');
      return;
    }

    const wrongQs = JSON.parse(raw);
    const meta = metaRaw ? JSON.parse(metaRaw) : {};

    async function load() {
      const repasoQs = wrongQs.map((q) => ({
        ...q,
        _builtOptions: buildOptions(q),
        _isTrap: true,
      }));

      let similar = [];
      if (meta.category && meta.levelKey) {
        try {
          const stubs = await getExamsByCategory(meta.category);
          for (const stub of stubs) {
            if (similar.length >= 5) break;
            if (stub.id === meta.examId) continue;
            const exam = await getExam(stub.id);
            const level = exam?.levels?.[meta.levelKey];
            if (!level?.questions?.length) continue;
            const freshQs = shuffle(level.questions).slice(0, 2).map((q) => ({
              ...q,
              _builtOptions: q.type === 'mcq' ? shuffle(q.options) : null,
              _isTrap: false,
            }));
            similar.push(...freshQs);
          }
        } catch (_) {
          // Similar questions are a bonus.
        }
      }

      setQuestions(shuffle([...repasoQs, ...similar.slice(0, 5)]));
      setPhase('quiz');
    }

    load();
  }, [navigate]);

  function handleAnswer(opt) {
    if (showFeedback) return;
    const q = questions[qIndex];
    const correct = normalize(opt) === normalize(q.answer);
    setSelected(opt);
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) setScore((s) => s + 1);
  }

  function handleNext() {
    setShowFeedback(false);
    setSelected(null);
    if (qIndex + 1 >= questions.length) setPhase('result');
    else setQIndex((i) => i + 1);
  }

  if (phase === 'loading') return <div className="repaso-loading">⏳ {ui.loading}</div>;

  if (phase === 'result') {
    const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
    return (
      <div className="repaso-page">
        <div className="repaso-result">
          <div className="repaso-result__emoji">{pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪'}</div>
          <h1 className="repaso-result__score">{ui.result(score, questions.length)}</h1>
          <p className="repaso-result__msg">{pct >= 70 ? ui.great : ui.ok}</p>
          <div className="repaso-result__actions">
            <button
              type="button"
              className="repaso-result__btn repaso-result__btn--primary"
              onPointerDown={(e) => {
                e.preventDefault();
                setQuestions(shuffle([...questions]));
                setQIndex(0);
                setScore(0);
                setSelected(null);
                setShowFeedback(false);
                setIsCorrect(false);
                setPhase('quiz');
              }}
            >
              🔄 {ui.retry}
            </button>
            <button
              type="button"
              className="repaso-result__btn"
              onPointerDown={(e) => { e.preventDefault(); navigate('/exam/library'); }}
            >
              📚 {ui.back}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[qIndex];
  const promptText = getLocalizedField(q, 'prompt', locale);
  const opts = q._builtOptions || q.options;

  return (
    <div className="repaso-page">
      <div className="repaso-progress">
        <div className="repaso-progress__fill" style={{ width: `${(qIndex / questions.length) * 100}%` }} />
      </div>

      <div className="repaso-header">
        <button type="button" className="exam-back-btn" onPointerDown={(e) => { e.preventDefault(); navigate('/exam/library'); }}>←</button>
        <div className="repaso-header__center">
          <span className="repaso-header__title">📚 {ui.title}</span>
          <span className="repaso-header__counter">{qIndex + 1} / {questions.length}</span>
        </div>
        <span className="repaso-header__score">✅ {score}</span>
      </div>

      {q._isTrap && (
        <div className="repaso-trap-badge">
          ⚠️ {ui.trap}
          {q._userWrongAnswer && (
            <span className="repaso-trap-badge__prev"> — {ui.wrongWas} <strong>{q._userWrongAnswer}</strong></span>
          )}
        </div>
      )}
      {!q._isTrap && <div className="repaso-similar-badge">✨ {ui.similar}</div>}

      <div className="repaso-question">
        <p className="repaso-prompt">{promptText}</p>
      </div>

      {q.type === 'mcq' && opts && (
        <div className="repaso-options">
          {opts.map((opt, i) => {
            const isTrapOpt = q._isTrap && q._userWrongAnswer && normalize(opt) === normalize(q._userWrongAnswer);
            let cls = 'repaso-opt';
            if (showFeedback) {
              if (normalize(opt) === normalize(q.answer)) cls += ' repaso-opt--correct';
              else if (opt === selected) cls += ' repaso-opt--wrong';
            } else if (opt === selected) {
              cls += ' repaso-opt--chosen';
            }
            return (
              <button
                key={i}
                type="button"
                className={cls}
                onPointerDown={(e) => { e.preventDefault(); if (!showFeedback) handleAnswer(opt); }}
              >
                <span className="repaso-opt__letter">{String.fromCharCode(65 + i)}</span>
                <span className="repaso-opt__text">{opt}</span>
                {!showFeedback && isTrapOpt && <span className="repaso-opt__trap-hint">⚠️</span>}
              </button>
            );
          })}
        </div>
      )}

      {q.type === 'fill_blank' && !showFeedback && (
        <FillBlankInput onSubmit={handleAnswer} question={q} />
      )}

      {showFeedback && (
        <FeedbackCard
          isCorrect={isCorrect}
          correctAnswer={String(q.answer)}
          locale={locale}
          onNext={handleNext}
          explanation={q.correction}
        />
      )}
    </div>
  );
}
