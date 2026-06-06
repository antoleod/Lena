import { useState } from 'react';
import { Link } from 'react-router-dom';
import { generateMixedSet, OPERATIONS, TERM_CHOICES, DIGIT_CHOICES } from './mixedCalcEngine.js';
import { saveSession } from '../exerciseGenerator/exerciseStorage.js';
import { COUNTS } from '../exerciseGenerator/exerciseTypes.js';
import MathVisualSvg from '../exerciseGenerator/MathVisualSvg.jsx';
import '../exerciseGenerator/cahier.css';
import '../mathGeometry/geometry.css';

const POSITIVE = 'Bravo ! Pour vérifier, refais le calcul une deuxième fois.';
const GENTLE = 'Ce n’est pas grave. Calcule de gauche à droite, étape par étape.';

function check(ex, value) {
  return [String(ex.correctAnswer), ...(ex.acceptedAnswers || [])].map(String).includes(String(value).trim());
}

export default function MixedCalcPage() {
  const [phase, setPhase] = useState('setup');
  const [terms, setTerms] = useState(3);
  const [ops, setOps] = useState(['+']);
  const [digits, setDigits] = useState(1);
  const [count, setCount] = useState(5);
  const [exercises, setExercises] = useState([]);
  const [graded, setGraded] = useState([]);

  function toggleOp(id) {
    setOps((cur) => (cur.includes(id) ? (cur.length > 1 ? cur.filter((o) => o !== id) : cur) : [...cur, id]));
  }

  function start() {
    setExercises(generateMixedSet({ terms, operations: ops, digits, count }));
    setGraded([]);
    setPhase('notebook');
  }
  function finish(results) {
    setGraded(results);
    saveSession({ subject: 'mixed-calc', type: ops.join(''), level: `t${terms}d${digits}`, count }, results);
    setPhase('results');
  }

  if (phase === 'notebook') return <Notebook exercises={exercises} onBack={() => setPhase('setup')} onStart={() => setPhase('test')} />;
  if (phase === 'test') return <Test exercises={exercises} onBack={() => setPhase('notebook')} onFinish={finish} />;
  if (phase === 'results') return <Results graded={graded} onRetry={start} onNew={() => setPhase('setup')} />;

  const preview = generatePreview(terms, ops, digits);

  return (
    <div className="cahier-page">
      <div className="cahier-header">
        <Link className="exam-back-btn" to="/cahier">←</Link>
        <div>
          <span className="eyebrow">Mathématiques</span>
          <h1>Calculs à composer</h1>
          <p className="cahier-sub">Choisis toi-même tes calculs : 2+4+6, 4+5+6+7, 2×3−4+6…</p>
        </div>
      </div>

      <section className="cahier-section">
        <h2 className="cahier-section__title">1. Quelles opérations ?</h2>
        <div className="cahier-choice-row">
          {OPERATIONS.map((o) => (
            <button key={o.id} type="button" className={`cahier-chip${ops.includes(o.id) ? ' is-selected' : ''}`} onClick={() => toggleOp(o.id)}>
              <span className="cahier-chip__emoji">{o.emoji}</span><span>{o.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="cahier-section">
        <h2 className="cahier-section__title">2. Combien de nombres ?</h2>
        <div className="cahier-choice-row">
          {TERM_CHOICES.map((t) => (
            <button key={t} type="button" className={`cahier-chip cahier-chip--count${terms === t ? ' is-selected' : ''}`} onClick={() => setTerms(t)}>{t}</button>
          ))}
        </div>
      </section>

      <section className="cahier-section">
        <h2 className="cahier-section__title">3. Taille des nombres</h2>
        <div className="cahier-choice-row">
          {DIGIT_CHOICES.map((d) => (
            <button key={d.id} type="button" className={`cahier-chip${digits === d.id ? ' is-selected' : ''}`} onClick={() => setDigits(d.id)}>{d.label}</button>
          ))}
        </div>
      </section>

      <section className="cahier-section">
        <h2 className="cahier-section__title">4. Combien d'exercices ?</h2>
        <div className="cahier-choice-row">
          {COUNTS.map((c) => (
            <button key={c} type="button" className={`cahier-chip cahier-chip--count${count === c ? ' is-selected' : ''}`} onClick={() => setCount(c)}>{c}</button>
          ))}
        </div>
      </section>

      <div className="test-card" style={{ padding: 16 }}>
        <p style={{ margin: 0, color: '#7f8c8d', fontWeight: 700 }}>Aperçu :</p>
        <p className="test-card__question" style={{ margin: '4px 0 0' }}>{preview}</p>
      </div>

      <button type="button" className="cahier-cta" onClick={start}>🧩 Créer mes calculs</button>
    </div>
  );
}

function generatePreview(terms, ops, digits) {
  const ex = generateMixedSet({ terms, operations: ops, digits, count: 1 })[0];
  return ex ? `${ex.expression} = ?` : '';
}

function Notebook({ exercises, onBack, onStart }) {
  const [done, setDone] = useState(false);
  return (
    <div className="cahier-page">
      <div className="cahier-header cahier-header--slim">
        <button type="button" className="exam-back-btn" onClick={onBack}>←</button>
        <div><span className="eyebrow">🧩 Calculs à composer</span><h1>Ma fiche</h1></div>
      </div>
      <p className="cahier-instruction">✍️ Résous chaque calcul dans ton cahier. Les images t'aident à compter.</p>
      <div className="notebook-sheet">
        <h2 className="notebook-sheet__title">Calculs à composer</h2>
        <ol className="notebook-list">
          {exercises.map((ex) => (
            <li key={ex.id} className="notebook-item">
              <span className="notebook-item__text">{ex.expression} =</span>
              {ex.visual && <MathVisualSvg visual={ex.visual} />}
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

function Test({ exercises, onBack, onFinish }) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [draft, setDraft] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const ex = exercises[index];
  const total = exercises.length;

  function submit() {
    if (feedback || !draft.trim()) return;
    const correct = check(ex, draft.trim());
    setFeedback({ correct });
    setResults((r) => [...r, { exercise: ex, userAnswer: draft.trim(), correct }]);
  }
  function next() {
    if (index + 1 >= total) { onFinish(results); return; }
    setIndex((i) => i + 1); setDraft(''); setShowHint(false); setFeedback(null);
  }

  return (
    <div className="cahier-page">
      <div className="cahier-header cahier-header--slim">
        <button type="button" className="exam-back-btn" onClick={onBack}>←</button>
        <div><span className="eyebrow">Vérifier mes réponses</span><h1>Calcul {index + 1} / {total}</h1></div>
      </div>
      <div className="cahier-progress"><div className="cahier-progress__fill" style={{ width: `${((index + 1) / total) * 100}%` }} /></div>

      <div className="test-card">
        <p className="test-card__question">{ex.question}</p>
        {ex.visual && <MathVisualSvg visual={ex.visual} />}
      </div>

      {!feedback && (
        <>
          {!showHint
            ? <button type="button" className="geo-hint-btn" onClick={() => setShowHint(true)}>💡 J'ai besoin d'aide</button>
            : <p className="geo-hint">💡 {ex.hint}</p>}
          <div className="test-answer">
            <form className="test-input-row" onSubmit={(e) => { e.preventDefault(); submit(); }}>
              <input className="test-input" inputMode="numeric" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ta réponse…" autoFocus />
              <button type="submit" className="cahier-cta cahier-cta--inline" disabled={!draft.trim()}>Vérifier</button>
            </form>
          </div>
        </>
      )}

      {feedback && (
        <div style={{ padding: '0 4px' }}>
          <div className={`exam-explanation--${feedback.correct ? 'correct' : 'wrong'}`} style={{ borderRadius: 14, padding: '14px 16px' }}>
            <p style={{ margin: 0, fontWeight: 700 }}>{feedback.correct ? '✅ Bonne réponse !' : '❌ Pas tout à fait…'}</p>
            {!feedback.correct && <p style={{ margin: '6px 0 0' }}>Bonne réponse : <strong>{String(ex.correctAnswer)}</strong></p>}
            <p style={{ margin: '6px 0 0', fontSize: '.9rem', opacity: .9 }}>{ex.explanation}</p>
            <p className="geo-tip">💪 {ex.improvementTip}</p>
            <p className="geo-tip" style={{ fontStyle: 'normal' }}>{feedback.correct ? POSITIVE : GENTLE}</p>
            <button type="button" className="cahier-cta cahier-cta--inline" style={{ marginTop: 10 }} onClick={next}>
              {index + 1 < total ? 'Suivant →' : 'Voir le résultat'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Results({ graded, onRetry, onNew }) {
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
              <span className="results-item__q">{g.exercise.expression} =</span>
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
        <button type="button" className="cahier-cta" onClick={onRetry}>🔄 Refaire des calculs</button>
        <button type="button" className="cahier-cta cahier-cta--soft" onClick={onNew}>🧩 Changer les réglages</button>
      </div>
    </div>
  );
}
