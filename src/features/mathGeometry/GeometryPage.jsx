import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { GeometryFigure } from './geometrySvgFactory.jsx';
import {
  generateGeometrySet, GEOMETRY_TYPES, COLORS,
} from './geometryExerciseEngine.js';
import { saveSession } from '../exerciseGenerator/exerciseStorage.js';
import { LEVELS, COUNTS } from '../exerciseGenerator/exerciseTypes.js';
import '../exerciseGenerator/cahier.css';
import './geometry.css';

const POSITIVE = 'Bravo ! Pour vérifier, recompte doucement une deuxième fois.';
const GENTLE = 'Ce n’est pas grave. Regarde bien la figure, puis recompte tranquillement.';

function normalize(v) {
  return String(v ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function checkExercise(ex, value) {
  if (ex.inputType === 'color') {
    // value = array of selected shape ids
    const ids = value || [];
    if (ids.length !== ex.target.count) return false;
    const byId = Object.fromEntries(ex.spec.shapes.map((s) => [s.id, s.type]));
    return ids.every((id) => byId[id] === ex.target.shapeType);
  }
  const candidates = [ex.correctAnswer, ...(ex.acceptedAnswers || [])].map(normalize);
  return candidates.includes(normalize(value));
}

export default function GeometryPage() {
  const [phase, setPhase] = useState('setup'); // setup | notebook | test | results
  const [type, setType] = useState('count_shapes');
  const [difficulty, setDifficulty] = useState('easy');
  const [count, setCount] = useState(5);
  const [exercises, setExercises] = useState([]);
  const [graded, setGraded] = useState([]);

  function start() {
    const list = generateGeometrySet({ type, difficulty, count });
    setExercises(list);
    setGraded([]);
    setPhase('notebook');
  }

  function finish(results) {
    setGraded(results);
    saveSession({ subject: 'geometry', type, level: difficulty, count }, results);
    setPhase('results');
  }

  if (phase === 'notebook') {
    return <GeometryNotebook exercises={exercises} onBack={() => setPhase('setup')} onStart={() => setPhase('test')} />;
  }
  if (phase === 'test') {
    return <GeometryTest exercises={exercises} onBack={() => setPhase('notebook')} onFinish={finish} />;
  }
  if (phase === 'results') {
    return <GeometryResults graded={graded} onRetry={start} onNew={() => setPhase('setup')} />;
  }

  // ── Setup ──────────────────────────────────────────────────────────────────
  return (
    <div className="cahier-page">
      <div className="cahier-header">
        <Link className="exam-back-btn" to="/cahier">←</Link>
        <div>
          <span className="eyebrow">Mathématiques</span>
          <h1>Les figures géométriques</h1>
          <p className="cahier-sub">Observe bien les figures, puis réponds comme sur une fiche.</p>
        </div>
      </div>

      <section className="cahier-section">
        <h2 className="cahier-section__title">1. Type d'exercice</h2>
        <div className="cahier-choice-grid">
          {GEOMETRY_TYPES.map((t) => (
            <button key={t.id} type="button" className={`cahier-chip${type === t.id ? ' is-selected' : ''}`} onClick={() => setType(t.id)}>
              <span className="cahier-chip__emoji">{t.emoji}</span><span>{t.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="cahier-section">
        <h2 className="cahier-section__title">2. Niveau</h2>
        <div className="cahier-choice-row">
          {LEVELS.map((l) => (
            <button key={l.id} type="button" className={`cahier-chip${difficulty === l.id ? ' is-selected' : ''}`} onClick={() => setDifficulty(l.id)}>
              <span className="cahier-chip__emoji">{l.emoji}</span><span>{l.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="cahier-section">
        <h2 className="cahier-section__title">3. Combien d'exercices ?</h2>
        <div className="cahier-choice-row">
          {COUNTS.map((c) => (
            <button key={c} type="button" className={`cahier-chip cahier-chip--count${count === c ? ' is-selected' : ''}`} onClick={() => setCount(c)}>{c}</button>
          ))}
        </div>
      </section>

      <button type="button" className="cahier-cta" onClick={start}>📐 Créer ma fiche</button>
    </div>
  );
}

// ── Notebook phase (observe + solve by hand, no answers) ─────────────────────
function GeometryNotebook({ exercises, onBack, onStart }) {
  const [done, setDone] = useState(false);
  return (
    <div className="cahier-page">
      <div className="cahier-header cahier-header--slim">
        <button type="button" className="exam-back-btn" onClick={onBack}>←</button>
        <div><span className="eyebrow">📐 Géométrie</span><h1>Ma fiche</h1></div>
      </div>
      <p className="cahier-instruction">👀 Observe chaque figure et résous dans ton cahier. Prends ton temps !</p>

      <div className="notebook-sheet">
        <h2 className="notebook-sheet__title">Figures géométriques</h2>
        <ol className="notebook-list">
          {exercises.map((ex) => (
            <li key={ex.id} className="notebook-item">
              <span className="notebook-item__text">{ex.question}</span>
              <div className="geo-figure-card" style={{ margin: '8px 0' }}>
                <GeometryFigure spec={ex.spec} />
              </div>
              <span className="notebook-item__blank" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>

      {!done ? (
        <button type="button" className="cahier-cta" onClick={() => setDone(true)}>✅ J'ai terminé dans mon cahier</button>
      ) : (
        <div className="cahier-ready">
          <p className="cahier-ready__msg">Super ! Vérifions tes réponses. 🌟</p>
          <button type="button" className="cahier-cta cahier-cta--go" onClick={onStart}>▶️ Commencer le test</button>
        </div>
      )}
    </div>
  );
}

// ── Test phase ───────────────────────────────────────────────────────────────
function GeometryTest({ exercises, onBack, onFinish }) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [draft, setDraft] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);
  const [feedback, setFeedback] = useState(null); // {correct, ex}

  const ex = exercises[index];
  const total = exercises.length;

  const colorValue = ex?.target?.colorValue;
  const selectedColors = useMemo(() => {
    if (ex?.inputType !== 'color') return {};
    return Object.fromEntries(selectedIds.map((id) => [id, colorValue]));
  }, [ex, selectedIds, colorValue]);

  function submit(value) {
    if (feedback) return;
    const correct = checkExercise(ex, value);
    setFeedback({ correct, ex });
    setResults((r) => [...r, { exercise: ex, userAnswer: ex.inputType === 'color' ? `${(value || []).length} figure(s)` : String(value), correct }]);
  }

  function next() {
    if (index + 1 >= total) { onFinish(results); return; }
    setIndex((i) => i + 1);
    setDraft(''); setSelectedIds([]); setShowHint(false); setShowCorrection(false); setFeedback(null);
  }

  function toggleShape(shape) {
    if (feedback) return;
    setSelectedIds((ids) => ids.includes(shape.id) ? ids.filter((x) => x !== shape.id) : [...ids, shape.id]);
  }

  return (
    <div className="cahier-page">
      <div className="cahier-header cahier-header--slim">
        <button type="button" className="exam-back-btn" onClick={onBack}>←</button>
        <div><span className="eyebrow">Vérifier mes réponses</span><h1>Question {index + 1} / {total}</h1></div>
      </div>
      <div className="cahier-progress"><div className="cahier-progress__fill" style={{ width: `${((index + 1) / total) * 100}%` }} /></div>

      <div className="test-card">
        <p className="test-card__question">{ex.question}</p>
        <div className="geo-figure-card">
          <GeometryFigure
            spec={ex.spec}
            selectable={ex.inputType === 'color' && !feedback}
            selectedColors={selectedColors}
            onTapShape={toggleShape}
            showCorrection={showCorrection}
          />
        </div>
        {ex.hasCorrectionDraw && (
          <button type="button" className="geo-hint-btn" onClick={() => setShowCorrection((s) => !s)}>
            {showCorrection ? 'Cacher la correction' : '👁️ Voir la correction'}
          </button>
        )}
      </div>

      {!feedback && (
        <>
          {!showHint
            ? <button type="button" className="geo-hint-btn" onClick={() => setShowHint(true)}>💡 J'ai besoin d'aide</button>
            : <p className="geo-hint">💡 {ex.hint}</p>}

          <div className="test-answer">
            {ex.inputType === 'choice' && (ex.options || []).map((opt) => (
              <button key={opt} type="button" className="test-choice" onClick={() => submit(opt)}>{opt}</button>
            ))}
            {ex.inputType === 'number' && (
              <form className="test-input-row" onSubmit={(e) => { e.preventDefault(); if (draft.trim()) submit(draft.trim()); }}>
                <input className="test-input" inputMode="numeric" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ta réponse…" autoFocus />
                <button type="submit" className="cahier-cta cahier-cta--inline" disabled={!draft.trim()}>Vérifier</button>
              </form>
            )}
            {ex.inputType === 'color' && (
              <button type="button" className="cahier-cta cahier-cta--go" onClick={() => submit(selectedIds)} disabled={selectedIds.length === 0}>
                Vérifier ({selectedIds.length} touchée{selectedIds.length > 1 ? 's' : ''})
              </button>
            )}
          </div>
        </>
      )}

      {feedback && (
        <div style={{ padding: '0 4px' }}>
          <div className={`exam-explanation--${feedback.correct ? 'correct' : 'wrong'}`} style={{ borderRadius: 14, padding: '14px 16px' }}>
            <p style={{ margin: 0, fontWeight: 700 }}>{feedback.correct ? '✅ Bonne réponse !' : '❌ Pas tout à fait…'}</p>
            {!feedback.correct && <p style={{ margin: '6px 0 0' }}>Bonne réponse : <strong>{String(ex.correctAnswer)}</strong></p>}
            <p style={{ margin: '6px 0 0', fontSize: '.9rem', opacity: .9 }}>{ex.explanation}</p>
            <p className="geo-tip">{feedback.correct ? POSITIVE : GENTLE}</p>
            <button type="button" className="cahier-cta cahier-cta--inline" style={{ marginTop: 10 }} onClick={next}>
              {index + 1 < total ? 'Suivant →' : 'Voir le résultat'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Results ──────────────────────────────────────────────────────────────────
function GeometryResults({ graded, onRetry, onNew }) {
  const total = graded.length;
  const correct = graded.filter((g) => g.correct).length;
  const pct = total ? Math.round((correct / total) * 100) : 0;
  return (
    <div className="cahier-page">
      <div className="cahier-header cahier-header--slim">
        <button type="button" className="exam-back-btn" onClick={onNew}>←</button>
        <div><span className="eyebrow">Résultat</span><h1>{pct >= 70 ? 'Bravo, beau travail !' : 'Continue, tu progresses !'}</h1></div>
      </div>
      <div className="results-score">
        <span className="results-score__emoji">{pct >= 70 ? '🏆' : '💪'}</span>
        <span className="results-score__num">{correct} / {total}</span>
        <span className="results-score__pct">{pct}%</span>
      </div>
      <ul className="results-list">
        {graded.map((g, i) => (
          <li key={i} className={`results-item results-item--${g.correct ? 'ok' : 'ko'}`}>
            <div className="results-item__head">
              <span className="results-item__mark">{g.correct ? '✅' : '❌'}</span>
              <span className="results-item__q">{g.exercise.question}</span>
            </div>
            <div className="results-item__body">
              <span>Ta réponse : <strong>{g.userAnswer || '—'}</strong></span>
              {!g.correct && <span>Bonne réponse : <strong>{String(g.exercise.correctAnswer)}</strong></span>}
              {!g.correct && <span className="results-item__exp">{g.exercise.explanation}</span>}
            </div>
          </li>
        ))}
      </ul>
      <div className="cahier-actions">
        <button type="button" className="cahier-cta" onClick={onRetry}>🔄 Refaire une fiche</button>
        <button type="button" className="cahier-cta cahier-cta--soft" onClick={onNew}>📐 Choisir d'autres exercices</button>
      </div>
    </div>
  );
}
