import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedbackCard from '../../../shared/ui/FeedbackCard.jsx';
import { getCategories, getExamsByCategory, getExam } from '../../../content/exams/registry.js';
import { getCategoryLabel, getLocalizedField } from '../../../content/exams/examI18n.js';
import { useLocale } from '../../../shared/i18n/LocaleContext.jsx';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalize(v) {
  return String(v).trim().toLowerCase().replace(/\s+/g, ' ');
}

function FillBlankInput({ onSubmit }) {
  const [val, setVal] = useState('');

  return (
    <div className="mega-runner__fill">
      <input
        type="text"
        className="mega-runner__fill-input"
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && val.trim()) onSubmit(val.trim()); }}
        autoFocus
        placeholder="Ta reponse..."
      />
      <button
        type="button"
        className="mega-runner__fill-submit"
        onPointerDown={e => { e.preventDefault(); if (val.trim()) onSubmit(val.trim()); }}
      >
        →
      </button>
    </div>
  );
}

export default function ExamMegaRunnerPage() {
  const { locale } = useLocale();
  const navigate = useNavigate();

  const [phase, setPhase] = useState('loading');
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState([]);
  const [catResults, setCatResults] = useState({});
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('lena:mega:config');
    if (!raw) { navigate('/exam/mega'); return; }

    const cfg = JSON.parse(raw);
    setConfig(cfg);

    async function load() {
      const allQuestions = [];

      for (const catId of cfg.categoryIds) {
        const stubs = await getExamsByCategory(catId);
        const allExamQs = [];
        for (const stub of stubs) {
          const exam = await getExam(stub.id);
          if (!exam) continue;
          const level = exam.levels?.[cfg.difficulty];
          if (!level?.questions?.length) continue;
          for (const q of level.questions) {
            allExamQs.push({ ...q, _catId: catId, _examTitle: exam.title });
          }
        }
        const sample = shuffle(allExamQs).slice(0, cfg.maxPerCategory);
        allQuestions.push(...sample);
      }

      setQuestions(shuffle(allQuestions));
      setPhase('quiz');
    }

    load();
  }, []); // intentionally empty — runs once on mount

  function handleAnswer(opt) {
    if (showFeedback) return;
    const q = questions[qIndex];
    const isCorrect = normalize(opt) === normalize(q.answer);
    setSelected(opt);
    setCorrect(isCorrect);
    setShowFeedback(true);

    if (isCorrect) {
      setScore(s => s + 1);
    } else {
      setErrors(e => [...e, q]);
    }

    setCatResults(prev => {
      const cat = q._catId;
      const cur = prev[cat] || { correct: 0, total: 0 };
      return {
        ...prev,
        [cat]: {
          correct: cur.correct + (isCorrect ? 1 : 0),
          total: cur.total + 1,
        },
      };
    });
  }

  function handleNext() {
    setShowFeedback(false);
    setSelected(null);
    if (qIndex + 1 >= questions.length) {
      setPhase('result');
    } else {
      setQIndex(i => i + 1);
    }
  }

  if (phase === 'loading') {
    return <div className="mega-runner__loading">⏳ Chargement...</div>;
  }

  if (phase === 'result') {
    const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
    const cats = getCategories();

    return (
      <div className="mega-runner">
        <div className="mega-result">
          <div className="mega-result__emoji">{pct >= 80 ? '🏆' : pct >= 60 ? '🌟' : '💪'}</div>
          <h1 className="mega-result__score">{score} / {questions.length}</h1>
          <p className="mega-result__pct">{pct}%</p>

          <div className="mega-result__cats">
            {config?.categoryIds.map(catId => {
              const res = catResults[catId] || { correct: 0, total: 0 };
              const catLabel = getCategoryLabel(catId, locale);
              const catPct = res.total ? Math.round((res.correct / res.total) * 100) : 0;
              const catDef = cats.find(c => c.id === catId);
              return (
                <div key={catId} className="mega-result__cat-row">
                  <span className="mega-result__cat-emoji">{catDef?.emoji || '📚'}</span>
                  <div className="mega-result__cat-info">
                    <span className="mega-result__cat-name">{catLabel}</span>
                    <div className="mega-result__cat-bar">
                      <div
                        className="mega-result__cat-fill"
                        style={{
                          width: `${catPct}%`,
                          background: catPct >= 70 ? '#34d399' : catPct >= 50 ? '#f59e0b' : '#f43f5e',
                        }}
                      />
                    </div>
                  </div>
                  <span className="mega-result__cat-score">{res.correct}/{res.total}</span>
                </div>
              );
            })}
          </div>

          <div className="mega-result__actions">
            <button
              type="button"
              className="mega-result__btn mega-result__btn--retry"
              onPointerDown={e => { e.preventDefault(); navigate('/exam/mega'); }}
            >
              🔄 {locale === 'nl' ? 'Opnieuw' : locale === 'en' ? 'Try Again' : locale === 'es' ? 'Repetir' : 'Recommencer'}
            </button>
            <button
              type="button"
              className="mega-result__btn"
              onPointerDown={e => { e.preventDefault(); navigate('/exam/library'); }}
            >
              📚 {locale === 'nl' ? 'Bibliotheek' : locale === 'en' ? 'Library' : locale === 'es' ? 'Biblioteca' : 'Bibliotheque'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[qIndex];
  const promptText = getLocalizedField(q, 'prompt', locale);
  const cats = getCategories();
  const catDef = cats.find(c => c.id === q._catId);

  return (
    <div className="mega-runner">
      <div className="mega-runner__progress-bar">
        <div
          className="mega-runner__progress-fill"
          style={{ width: `${(qIndex / questions.length) * 100}%` }}
        />
      </div>

      <div className="mega-runner__header">
        <button
          type="button"
          className="exam-back-btn"
          onPointerDown={e => { e.preventDefault(); navigate('/exam/mega'); }}
        >
          ←
        </button>
        <span className="mega-runner__counter">{qIndex + 1} / {questions.length}</span>
        <span className="mega-runner__score">✅ {score}</span>
      </div>

      <div className="mega-runner__cat-badge">
        <span>{catDef?.emoji || '📚'}</span>
        <span>{getCategoryLabel(q._catId, locale)}</span>
      </div>

      <div className="mega-runner__question">
        <p className="mega-runner__prompt">{promptText}</p>
      </div>

      {q.type === 'mcq' && (
        <div className="mega-runner__options">
          {q.options.map((opt, i) => {
            let cls = 'mega-runner__opt';
            if (showFeedback) {
              if (normalize(opt) === normalize(q.answer)) cls += ' mega-runner__opt--correct';
              else if (opt === selected) cls += ' mega-runner__opt--wrong';
            } else if (opt === selected) {
              cls += ' mega-runner__opt--chosen';
            }
            return (
              <button
                key={i}
                type="button"
                className={cls}
                onPointerDown={e => { e.preventDefault(); if (!showFeedback) handleAnswer(opt); }}
              >
                <span className="mega-runner__opt-letter">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {q.type === 'fill_blank' && !showFeedback && (
        <FillBlankInput onSubmit={handleAnswer} />
      )}

      {showFeedback && (
        <FeedbackCard
          isCorrect={correct}
          correctAnswer={String(q.answer)}
          locale={locale}
          onNext={handleNext}
          explanation={q.correction}
        />
      )}
    </div>
  );
}
