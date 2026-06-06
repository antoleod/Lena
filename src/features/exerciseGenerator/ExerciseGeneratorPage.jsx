import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SUBJECTS, LEVELS, COUNTS, getSubject } from './exerciseTypes.js';
import { generateExercises } from './exerciseEngine.js';
import { saveSession, getErrorCount } from './exerciseStorage.js';
import NotebookView from './NotebookView.jsx';
import TestView from './TestView.jsx';
import ResultsView from './ResultsView.jsx';
import ErrorReviewView from './ErrorReviewView.jsx';
import { VerificationView, AnswersTableView, ExplanationsView, PapaModeView } from './CahierFlowViews.jsx';
import { useCahierT } from './cahierI18n.js';
import './cahier.css';

// Flow: setup → notebook → verify → (answers | test) → [results] → explanations
// plus 'errors'. Solutions are revealed ONLY after the child finishes her cahier.
export default function ExerciseGeneratorPage() {
  const navigate = useNavigate();
  const L = useCahierT();
  const [phase, setPhase] = useState('setup');

  const [subject, setSubject] = useState('math');
  const [type, setType] = useState('additions');
  const [level, setLevel] = useState('easy');
  const [count, setCount] = useState(10);
  const [digits, setDigits] = useState(null); // null = auto (par niveau); 2|3|4 chiffres

  const [exercises, setExercises] = useState([]);
  const [graded, setGraded] = useState([]);
  const [errorCount, setErrorCount] = useState(() => getErrorCount());

  const currentSubject = useMemo(() => getSubject(subject), [subject]);

  function chooseSubject(id) {
    setSubject(id);
    const first = getSubject(id)?.types[0]?.id;
    if (first) setType(first);
  }

  const isMath = subject === 'math';

  function startNotebook() {
    const list = generateExercises({ subject, type, level, count, digits: isMath ? digits : null, locale: L.locale });
    if (list.length === 0) return;
    setExercises(list);
    setGraded([]);
    setPhase('notebook');
  }

  // TestView now returns { [id]: { correct } } (first-try correctness).
  function finishTest(resultMap) {
    const graded = exercises.map((ex) => ({
      exercise: ex,
      userAnswer: resultMap[ex.id]?.correct ? String(ex.answer ?? ex.correctAnswer) : '—',
      correct: !!resultMap[ex.id]?.correct,
    }));
    saveSession({ subject, type, level, count }, graded);
    setGraded(graded);
    setErrorCount(getErrorCount());
    setPhase('results');
  }

  // ── Notebook → Vérification → (réponses | test) → explications ─────────────
  if (phase === 'notebook') {
    return (
      <NotebookView
        exercises={exercises}
        subject={currentSubject}
        level={level}
        onBack={() => setPhase('setup')}
        onDone={() => setPhase('verify')}
      />
    );
  }
  if (phase === 'verify') {
    return (
      <VerificationView
        subject={subject}
        errorCount={errorCount}
        onBack={() => setPhase('notebook')}
        onSeeAnswers={() => setPhase('answers')}
        onSeeExplanations={() => setPhase('explanations')}
        onDoTest={() => setPhase('test')}
        onPapa={() => setPhase('papa')}
        onSeeErrors={() => setPhase('errors')}
      />
    );
  }
  if (phase === 'papa') {
    return <PapaModeView exercises={exercises} onBack={() => setPhase('verify')} />;
  }
  if (phase === 'answers') {
    return (
      <AnswersTableView
        exercises={exercises}
        onBack={() => setPhase('verify')}
        onSeeExplanations={() => setPhase('explanations')}
        onContinue={startNotebook}
      />
    );
  }
  if (phase === 'test') {
    return (
      <TestView
        exercises={exercises}
        onBack={() => setPhase('verify')}
        onFinish={finishTest}
      />
    );
  }
  if (phase === 'results') {
    return (
      <ResultsView
        graded={graded}
        onRetryAll={startNotebook}
        onNewBatch={() => setPhase('setup')}
        onSeeErrors={() => setPhase('errors')}
        onSeeExplanations={() => setPhase('explanations')}
        errorCount={errorCount}
      />
    );
  }
  if (phase === 'explanations') {
    return (
      <ExplanationsView
        exercises={exercises}
        subject={subject}
        onBack={() => setPhase(graded.length ? 'results' : 'verify')}
        onRestart={() => setPhase('setup')}
        onContinue={startNotebook}
      />
    );
  }
  if (phase === 'errors') {
    return (
      <ErrorReviewView
        onBack={() => setPhase('setup')}
        onCountChange={setErrorCount}
      />
    );
  }

  // ── Setup phase ────────────────────────────────────────────────────────────
  return (
    <div className="cahier-page">
      <div className="cahier-header">
        <Link className="exam-back-btn" to="/">←</Link>
        <div>
          <span className="eyebrow">{L.t('monCahier')}</span>
          <h1>{L.t('monCahierTitle')}</h1>
          <p className="cahier-sub">{L.t('chooseWork')}</p>
        </div>
        {errorCount > 0 && (
          <button type="button" className="cahier-errors-cta" onClick={() => setPhase('errors')}>
            ⚠️ {L.t('mesErreurs')} <span className="cahier-badge">{errorCount}</span>
          </button>
        )}
      </div>

      {/* Modules spéciaux de maths */}
      <section className="cahier-section">
        <h2 className="cahier-section__title">{L.t('ateliers')}</h2>
        <div className="cahier-choice-row">
          <button type="button" className="cahier-chip cahier-chip--big" onClick={() => navigate('/cahier/geometrie')}>
            <span className="cahier-chip__emoji">📐</span><span>Les figures géométriques</span>
          </button>
          <button type="button" className="cahier-chip cahier-chip--big" onClick={() => navigate('/cahier/defis-calcul')}>
            <span className="cahier-chip__emoji">🧮</span><span>Défis de calcul</span>
          </button>
          <button type="button" className="cahier-chip cahier-chip--big" onClick={() => navigate('/cahier/calculs-melanges')}>
            <span className="cahier-chip__emoji">🧩</span><span>Calculs à composer</span>
          </button>
        </div>
      </section>

      {/* Matière */}
      <section className="cahier-section">
        <h2 className="cahier-section__title">{L.t('matiere')}</h2>
        <div className="cahier-choice-grid">
          {SUBJECTS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`cahier-chip cahier-chip--big${subject === s.id ? ' is-selected' : ''}`}
              onClick={() => chooseSubject(s.id)}
            >
              <span className="cahier-chip__emoji">{s.emoji}</span>
              <span>{L.label(s.id)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Type */}
      <section className="cahier-section">
        <h2 className="cahier-section__title">{L.t('typeExercice')}</h2>
        <div className="cahier-choice-grid">
          {currentSubject?.types.map((tp) => (
            <button
              key={tp.id}
              type="button"
              className={`cahier-chip${type === tp.id ? ' is-selected' : ''}`}
              onClick={() => setType(tp.id)}
            >
              <span className="cahier-chip__emoji">{tp.emoji}</span>
              <span>{tp.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Taille des nombres — maths uniquement (additions / soustractions) */}
      {isMath && (type === 'additions' || type === 'soustractions') && (
        <section className="cahier-section">
          <h2 className="cahier-section__title">{L.t('tailleNombres')}</h2>
          <div className="cahier-choice-row">
            {[
              { id: null, label: L.t('auto') },
              { id: 2, label: `2 ${L.t('chiffres')}` },
              { id: 3, label: `3 ${L.t('chiffres')}` },
              { id: 4, label: `4 ${L.t('chiffres')}` },
            ].map((d) => (
              <button
                key={String(d.id)}
                type="button"
                className={`cahier-chip${digits === d.id ? ' is-selected' : ''}`}
                onClick={() => setDigits(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Niveau */}
      <section className="cahier-section">
        <h2 className="cahier-section__title">{L.t('niveau')}</h2>
        <div className="cahier-choice-row">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              className={`cahier-chip${level === l.id ? ' is-selected' : ''}`}
              onClick={() => setLevel(l.id)}
            >
              <span className="cahier-chip__emoji">{l.emoji}</span>
              <span>{L.label(l.id)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Nombre */}
      <section className="cahier-section">
        <h2 className="cahier-section__title">{L.t('combien')}</h2>
        <div className="cahier-choice-row">
          {COUNTS.map((c) => (
            <button
              key={c}
              type="button"
              className={`cahier-chip cahier-chip--count${count === c ? ' is-selected' : ''}`}
              onClick={() => setCount(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <button type="button" className="cahier-cta" onClick={startNotebook}>
        {L.t('creerCahier')}
      </button>
    </div>
  );
}
