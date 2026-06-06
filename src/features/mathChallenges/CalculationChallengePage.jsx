import { useState } from 'react';
import { Link } from 'react-router-dom';
import { generateChallengeSet, CHALLENGE_TYPES } from './calculationEngine.js';
import { saveSession } from '../exerciseGenerator/exerciseStorage.js';
import { LEVELS, COUNTS } from '../exerciseGenerator/exerciseTypes.js';
import '../exerciseGenerator/cahier.css';
import '../mathGeometry/geometry.css';

const POSITIVE = 'Bravo ! Pour vérifier, refais le calcul une deuxième fois.';
const GENTLE = 'Ce n’est pas grave. Regarde les unités d’abord, puis les dizaines.';

function check(ex, value) {
  const v = String(value).trim();
  return [String(ex.correctAnswer), ...(ex.acceptedAnswers || [])].map(String).includes(v);
}

export default function CalculationChallengePage() {
  const [phase, setPhase] = useState('setup');
  const [type, setType] = useState('chained');
  const [difficulty, setDifficulty] = useState('easy');
  const [count, setCount] = useState(5);
  const [exercises, setExercises] = useState([]);
  const [graded, setGraded] = useState([]);

  function start() {
    setExercises(generateChallengeSet({ type, difficulty, count }));
    setGraded([]);
    setPhase('notebook');
  }
  function finish(results) {
    setGraded(results);
    saveSession({ subject: 'calc-challenge', type, level: difficulty, count }, results);
    setPhase('results');
  }

  if (phase === 'notebook') return <ChallengeNotebook exercises={exercises} onBack={() => setPhase('setup')} onStart={() => setPhase('test')} />;
  if (phase === 'test') return <ChallengeTest exercises={exercises} onBack={() => setPhase('notebook')} onFinish={finish} />;
  if (phase === 'results') return <ChallengeResults graded={graded} onRetry={start} onNew={() => setPhase('setup')} />;

  return (
    <div className="cahier-page">
      <div className="cahier-header">
        <Link className="exam-back-btn" to="/cahier">←</Link>
        <div>
          <span className="eyebrow">Mathématiques</span>
          <h1>Défis de calcul</h1>
          <p className="cahier-sub">Des calculs plus malins, expliqués pas à pas.</p>
        </div>
      </div>

      <section className="cahier-section">
        <h2 className="cahier-section__title">1. Type de défi</h2>
        <div className="cahier-choice-grid">
          {CHALLENGE_TYPES.map((t) => (
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
        <h2 className="cahier-section__title">3. Combien de défis ?</h2>
        <div className="cahier-choice-row">
          {COUNTS.map((c) => (
            <button key={c} type="button" className={`cahier-chip cahier-chip--count${count === c ? ' is-selected' : ''}`} onClick={() => setCount(c)}>{c}</button>
          ))}
        </div>
      </section>

      <button type="button" className="cahier-cta" onClick={start}>🧮 Créer mes défis</button>
    </div>
  );
}

function ChallengeNotebook({ exercises, onBack, onStart }) {
  const [done, setDone] = useState(false);
  return (
    <div className="cahier-page">
      <div className="cahier-header cahier-header--slim">
        <button type="button" className="exam-back-btn" onClick={onBack}>←</button>
        <div><span className="eyebrow">🧮 Défis de calcul</span><h1>Ma fiche</h1></div>
      </div>
      <p className="cahier-instruction">✍️ Pose et résous chaque calcul dans ton cahier.</p>
      <div className="notebook-sheet">
        <h2 className="notebook-sheet__title">Défis de calcul</h2>
        <ol className="notebook-list">
          {exercises.map((ex) => (
            <li key={ex.id} className="notebook-item">
              <span className="notebook-item__text">{ex.question.replace('Calcule : ', '')}</span>
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

function ChallengeTest({ exercises, onBack, onFinish }) {
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
        <div><span className="eyebrow">Vérifier mes réponses</span><h1>Défi {index + 1} / {total}</h1></div>
      </div>
      <div className="cahier-progress"><div className="cahier-progress__fill" style={{ width: `${((index + 1) / total) * 100}%` }} /></div>

      <div className="test-card"><p className="test-card__question">{ex.question}</p></div>

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

function ChallengeResults({ graded, onRetry, onNew }) {
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
        <button type="button" className="cahier-cta" onClick={onRetry}>🔄 Refaire des défis</button>
        <button type="button" className="cahier-cta cahier-cta--soft" onClick={onNew}>🧮 Choisir d'autres défis</button>
      </div>
    </div>
  );
}
