import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SUBJECTS, LEVELS, COUNTS, getSubject } from './exerciseTypes.js';
import { generateExercises } from './exerciseEngine.js';
import { saveSession, getErrorCount } from './exerciseStorage.js';
import NotebookView from './NotebookView.jsx';
import TestView from './TestView.jsx';
import ResultsView from './ResultsView.jsx';
import ErrorReviewView from './ErrorReviewView.jsx';
import { VerificationView, AnswersTableView, ExplanationsView, PapaModeView, RetravaillerView } from './CahierFlowViews.jsx';
import { useCahierT } from './cahierI18n.js';
import './cahier.css';

// Flow: setup → notebook → verify → (answers | test) → [results] → explanations
// plus 'errors'. Solutions are revealed ONLY after the child finishes her cahier.
export default function ExerciseGeneratorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const L = useCahierT();
  const [phase, setPhase] = useState('setup');

  const [subject, setSubject] = useState('math');
  const [type, setType] = useState('additions');
  const [level, setLevel] = useState('easy');
  const [count, setCount] = useState(10);
  const [digits, setDigits] = useState(null); // null = auto; 1|2|3|4 chiffres
  const [terms, setTerms] = useState(null);   // null = auto; 2|3|4|5 nombres
  const [timerMinutes, setTimerMinutes] = useState(null); // Feature 1: countdown
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minVal, setMinVal] = useState('');   // Feature 2: number range
  const [maxVal, setMaxVal] = useState('');   // Feature 2: number range

  const [exercises, setExercises] = useState([]);
  const [graded, setGraded] = useState([]);
  const [errorCount, setErrorCount] = useState(() => getErrorCount());

  const currentSubject = useMemo(() => getSubject(subject), [subject]);

  useEffect(() => {
    if (location.state?.retake) {
      const s = location.state.retake;
      setSubject(s.subject || 'math');
      setType(s.type || 'additions');
      setLevel(s.level || 'easy');
      setCount(s.total || 10);
      const list = (s.exercises || []).map((e) => ({
        id: e.id,
        subject: e.subject,
        type: e.type,
        question: e.question,
        testQuestion: e.question,
        answer: e.answer,
        correctAnswer: e.answer,
        inputType: 'number',
      }));
      if (list.length > 0) {
        setExercises(list);
        setGraded([]);
        setPhase('notebook');
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function chooseSubject(id) {
    setSubject(id);
    const first = getSubject(id)?.types[0]?.id;
    if (first) setType(first);
  }

  const isMath = subject === 'math';

  function startNotebook() {
    const list = generateExercises({
      subject, type, level, count,
      digits: isMath ? digits : null,
      terms: isMath ? terms : null,
      minVal: isMath && minVal !== '' ? Number(minVal) : null,
      maxVal: isMath && maxVal !== '' ? Number(maxVal) : null,
      locale: L.locale,
    });
    if (list.length === 0) return;
    setExercises(list);
    setGraded([]);
    setPhase('notebook');
  }

  // Adaptive practice: regenerate 5 similar exercises for a weak area.
  function startTargeted(area) {
    setSubject(area.subject); setType(area.type); setLevel(area.level); setDigits(null); setTerms(null); setCount(5);
    const list = generateExercises({ subject: area.subject, type: area.type, level: area.level, count: 5, locale: L.locale });
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
        timerMinutes={timerMinutes}
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
  if (phase === 'retravailler') {
    return <RetravaillerView onBack={() => setPhase('setup')} onPractice={startTargeted} />;
  }
  if (phase === 'answers') {
    return (
      <AnswersTableView
        exercises={exercises}
        onBack={() => setPhase('verify')}
        onSeeExplanations={() => setPhase('explanations')}
        onDoTest={() => setPhase('test')}
        onPapa={() => setPhase('papa')}
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
    <div className="cahier-page cahier-page--setup">
      <div className="cahier-header">
        <Link className="exam-back-btn" to="/">←</Link>
        <div>
          <span className="eyebrow">{L.t('monCahier')}</span>
          <h1>{L.t('monCahierTitle')}</h1>
          <p className="cahier-sub">{L.t('chooseWork')}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Link
            to="/cahier/historique"
            className="cahier-chip"
            style={{ textDecoration: 'none', fontSize: '.82rem', fontWeight: 700, padding: '6px 14px' }}
          >
            📋 Historique
          </Link>
          {errorCount > 0 && (
            <button type="button" className="cahier-errors-cta" onClick={() => setPhase('errors')}>
              ⚠️ {L.t('mesErreurs')} <span className="cahier-badge">{errorCount}</span>
            </button>
          )}
        </div>
      </div>

      {/* Modules spéciaux de maths */}
      <section className="cahier-section">
        <h2 className="cahier-section__title">{L.t('ateliers')}</h2>
        <div className="atelier-grid">
          <button type="button" className="atelier-card" onClick={() => navigate('/cahier/geometrie')}>
            <span className="atelier-card__icon" style={{ background: '#e8f4fd' }}>📐</span>
            <span className="atelier-card__label">Figures géométriques</span>
          </button>
          <button type="button" className="atelier-card" onClick={() => navigate('/cahier/defis-calcul')}>
            <span className="atelier-card__icon" style={{ background: '#fdf3e8' }}>🧮</span>
            <span className="atelier-card__label">Défis de calcul</span>
          </button>
          <button type="button" className="atelier-card" onClick={() => navigate('/cahier/calculs-melanges')}>
            <span className="atelier-card__icon" style={{ background: '#edf8ee' }}>🧩</span>
            <span className="atelier-card__label">Calculs mélangés</span>
          </button>
          <button type="button" className="atelier-card" onClick={() => navigate('/tables')}>
            <span className="atelier-card__icon" style={{ background: '#f3eefe' }}>✖️</span>
            <span className="atelier-card__label">Tables de multiplication</span>
          </button>
          <button type="button" className="atelier-card" onClick={() => setPhase('retravailler')}>
            <span className="atelier-card__icon" style={{ background: '#fdeef0' }}>💪</span>
            <span className="atelier-card__label">{L.t('aRetravailler')}</span>
          </button>
        </div>
      </section>

      {/* Matière — segmented control */}
      <section className="cahier-section">
        <h2 className="cahier-section__title">{L.t('matiere')}</h2>
        <div className="cahier-segmented">
          {SUBJECTS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`cahier-segmented__btn${subject === s.id ? ' is-selected' : ''}`}
              onClick={() => chooseSubject(s.id)}
            >
              <span className="cahier-segmented__emoji">{s.emoji}</span>
              <span>{L.label(s.id)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Type */}
      <section className="cahier-section">
        <h2 className="cahier-section__title">{L.t('typeExercice')}</h2>
        <div className="ex-type-grid">
          {currentSubject?.types.map((tp) => (
            <button
              key={tp.id}
              type="button"
              className={`ex-type-card${type === tp.id ? ' is-selected' : ''}${tp.id === 'mixte' ? ' ex-type-card--mixte' : ''}`}
              style={tp.color ? { '--card-accent': tp.color } : {}}
              onClick={() => setType(tp.id)}
            >
              <span className="ex-type-card__icon-wrap" style={tp.color ? { background: tp.color + '22' } : {}}>
                <span className="ex-type-card__emoji">{tp.emoji}</span>
              </span>
              <span className="ex-type-card__label">{tp.label}</span>
              {tp.desc && <span className="ex-type-card__desc">{tp.desc}</span>}
              {type === tp.id && <span className="ex-type-card__check">✓</span>}
            </button>
          ))}
        </div>
      </section>

      {/* Options avancées — collapsible for add/sous */}
      {isMath && (type === 'additions' || type === 'soustractions') && (
        <section className="cahier-section">
          <button
            type="button"
            className="cahier-advanced-toggle"
            onClick={() => setShowAdvanced((v) => !v)}
          >
            <span>{showAdvanced ? '▲' : '▼'} {L.t('optionsAvancees') || 'Options avancées'}</span>
            {(digits !== null || terms !== null || minVal !== '' || maxVal !== '') && (
              <span className="cahier-advanced-dot" />
            )}
          </button>

          {showAdvanced && (
            <>
              <div className="cahier-advanced-box">
                <h2 className="cahier-section__title">{L.t('tailleNombres')}</h2>
                <div className="cahier-choice-row">
                  {[
                    { id: null, label: L.t('auto') },
                    { id: 1, label: `1 ${L.t('chiffres')}` },
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
              </div>

              <div className="cahier-advanced-box">
                <h2 className="cahier-section__title">{L.t('nombreOperations')}</h2>
                <div className="cahier-choice-row">
                  {[
                    { id: null, label: L.t('auto') },
                    { id: 2, label: `2 ${L.t('nombres')}` },
                    { id: 3, label: `3 ${L.t('nombres')}` },
                    { id: 4, label: `4 ${L.t('nombres')}` },
                    { id: 5, label: `5 ${L.t('nombres')}` },
                  ].map((tcfg) => (
                    <button
                      key={String(tcfg.id)}
                      type="button"
                      className={`cahier-chip${terms === tcfg.id ? ' is-selected' : ''}`}
                      onClick={() => setTerms(tcfg.id)}
                    >
                      {tcfg.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cahier-advanced-box">
                <h2 className="cahier-section__title">{L.t('plage')}</h2>
                <div className="cahier-range-row">
                  <label className="cahier-range-label">{L.t('de')}</label>
                  <input
                    type="number"
                    min={0}
                    value={minVal}
                    onChange={(e) => setMinVal(e.target.value)}
                    placeholder="0"
                    className="cahier-range-input"
                  />
                  <label className="cahier-range-label">{L.t('a')}</label>
                  <input
                    type="number"
                    min={0}
                    value={maxVal}
                    onChange={(e) => setMaxVal(e.target.value)}
                    placeholder="100"
                    className="cahier-range-input"
                  />
                  {(minVal !== '' || maxVal !== '') && (
                    <button type="button" className="cahier-chip" onClick={() => { setMinVal(''); setMaxVal(''); }} style={{ padding: '6px 12px', fontSize: '.85rem' }}>✕</button>
                  )}
                </div>
              </div>
            </>
          )}
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

      {/* Durée — Feature 1 */}
      <section className="cahier-section">
        <h2 className="cahier-section__title">{L.t('duree')}</h2>
        <div className="cahier-choice-row">
          {[
            { val: null, label: L.t('illimite') },
            { val: 5,    label: '5 min' },
            { val: 10,   label: '10 min' },
            { val: 15,   label: '15 min' },
            { val: 20,   label: '20 min' },
            { val: 30,   label: '30 min' },
          ].map((d) => (
            <button
              key={String(d.val)}
              type="button"
              className={`cahier-chip${timerMinutes === d.val ? ' is-selected' : ''}`}
              onClick={() => setTimerMinutes(d.val)}
            >
              {d.label}
            </button>
          ))}
        </div>
      </section>

      <button type="button" className="cahier-cta cahier-cta--sticky" onClick={startNotebook}>
        {L.t('creerCahier')}
      </button>
    </div>
  );
}
