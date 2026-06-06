import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SUBJECTS, LEVELS, COUNTS, getSubject } from './exerciseTypes.js';
import { generateExercises, gradeExercises } from './exerciseEngine.js';
import { saveSession, getErrorCount } from './exerciseStorage.js';
import NotebookView from './NotebookView.jsx';
import TestView from './TestView.jsx';
import ResultsView from './ResultsView.jsx';
import ErrorReviewView from './ErrorReviewView.jsx';
import { VerificationView, AnswersTableView, ExplanationsView } from './CahierFlowViews.jsx';
import './cahier.css';

// Flow: setup → notebook → verify → (answers | test) → [results] → explanations
// plus 'errors'. Solutions are revealed ONLY after the child finishes her cahier.
export default function ExerciseGeneratorPage() {
  const navigate = useNavigate();
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
    const list = generateExercises({ subject, type, level, count, digits: isMath ? digits : null });
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
        onBack={() => setPhase('notebook')}
        onSeeAnswers={() => setPhase('answers')}
        onDoTest={() => setPhase('test')}
      />
    );
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
        onBack={() => setPhase(graded.length ? 'results' : 'answers')}
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

      {/* Modules spéciaux de maths */}
      <section className="cahier-section">
        <h2 className="cahier-section__title">⭐ Ateliers de maths</h2>
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

      {/* Taille des nombres — maths uniquement (additions / soustractions) */}
      {isMath && (type === 'additions' || type === 'soustractions') && (
        <section className="cahier-section">
          <h2 className="cahier-section__title">Taille des nombres</h2>
          <div className="cahier-choice-row">
            {[
              { id: null, label: 'Auto' },
              { id: 2, label: '2 chiffres' },
              { id: 3, label: '3 chiffres' },
              { id: 4, label: '4 chiffres' },
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
