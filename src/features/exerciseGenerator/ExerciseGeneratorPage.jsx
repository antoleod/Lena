import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SUBJECTS, LEVELS, COUNTS, getSubject } from './exerciseTypes.js';
import { generateExercises, gradeExercises } from './exerciseEngine.js';
import { saveSession, getErrorCount } from './exerciseStorage.js';
import NotebookView from './NotebookView.jsx';
import TestView from './TestView.jsx';
import ResultsView from './ResultsView.jsx';
import ErrorReviewView from './ErrorReviewView.jsx';
import './cahier.css';

// Phases: 'setup' → 'notebook' → 'test' → 'results' ; plus 'errors'
export default function ExerciseGeneratorPage() {
  const [phase, setPhase] = useState('setup');

  const [subject, setSubject] = useState('math');
  const [type, setType] = useState('additions');
  const [level, setLevel] = useState('easy');
  const [count, setCount] = useState(10);

  const [exercises, setExercises] = useState([]);
  const [graded, setGraded] = useState([]);
  const [errorCount, setErrorCount] = useState(() => getErrorCount());

  const currentSubject = useMemo(() => getSubject(subject), [subject]);

  function chooseSubject(id) {
    setSubject(id);
    const first = getSubject(id)?.types[0]?.id;
    if (first) setType(first);
  }

  function startNotebook() {
    const list = generateExercises({ subject, type, level, count });
    if (list.length === 0) return;
    setExercises(list);
    setGraded([]);
    setPhase('notebook');
  }

  function finishTest(answers) {
    const result = gradeExercises(exercises, answers);
    saveSession({ subject, type, level, count }, result);
    setGraded(result);
    setErrorCount(getErrorCount());
    setPhase('results');
  }

  // ── Notebook / Test / Results / Errors phases ──────────────────────────────
  if (phase === 'notebook') {
    return (
      <NotebookView
        exercises={exercises}
        subject={currentSubject}
        level={level}
        onBack={() => setPhase('setup')}
        onStartTest={() => setPhase('test')}
      />
    );
  }
  if (phase === 'test') {
    return (
      <TestView
        exercises={exercises}
        onBack={() => setPhase('notebook')}
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
        errorCount={errorCount}
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
          <span className="eyebrow">Mon cahier</span>
          <h1>Mon cahier d'exercices</h1>
          <p className="cahier-sub">Choisis ce que tu veux travailler.</p>
        </div>
        {errorCount > 0 && (
          <button type="button" className="cahier-errors-cta" onClick={() => setPhase('errors')}>
            ⚠️ Mes erreurs <span className="cahier-badge">{errorCount}</span>
          </button>
        )}
      </div>

      {/* Matière */}
      <section className="cahier-section">
        <h2 className="cahier-section__title">1. Matière</h2>
        <div className="cahier-choice-grid">
          {SUBJECTS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`cahier-chip cahier-chip--big${subject === s.id ? ' is-selected' : ''}`}
              onClick={() => chooseSubject(s.id)}
            >
              <span className="cahier-chip__emoji">{s.emoji}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Type */}
      <section className="cahier-section">
        <h2 className="cahier-section__title">2. Type d'exercice</h2>
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

      {/* Niveau */}
      <section className="cahier-section">
        <h2 className="cahier-section__title">3. Niveau</h2>
        <div className="cahier-choice-row">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              className={`cahier-chip${level === l.id ? ' is-selected' : ''}`}
              onClick={() => setLevel(l.id)}
            >
              <span className="cahier-chip__emoji">{l.emoji}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Nombre */}
      <section className="cahier-section">
        <h2 className="cahier-section__title">4. Combien d'exercices ?</h2>
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
        ✏️ Créer mon cahier
      </button>
    </div>
  );
}
