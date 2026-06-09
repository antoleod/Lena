// ─────────────────────────────────────────────────────────────────────────────
// MixedModePage — "Mode mixte intelligent"
// Lets the child pick age/level, difficulty, exercise type, count and format,
// then generates, displays and grades a personalised set of mixed-operation
// arithmetic exercises.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCahierT } from './cahierI18n.js';
import { generateMixedExercises, generateRandomMixed, CONFIGS, AGE_TO_LEVEL } from './mixedEngine.js';
import NumPad from '../../shared/ui/NumPad.jsx';
import './cahier.css';
import './mixed-mode.css';

// ── Constants ─────────────────────────────────────────────────────────────────

const AGES = [6, 7, 8, 9];
const LEVELS = ['CP', 'CE1', 'CE2', 'CM1'];
const DIFFICULTIES = [
  { id: 'facile', emoji: '🟢' },
  { id: 'moyen',  emoji: '🟡' },
  { id: 'difficile', emoji: '🔴' },
];
const COUNTS = [5, 10, 15, 20];
const FORMATS = ['avecImages', 'sansImages', 'modeCahier', 'modeExamen'];
const FORMAT_EMOJIS = { avecImages: '🖼️', sansImages: '📝', modeCahier: '📓', modeExamen: '📋' };

const LEVEL_TO_AGE = { CP: 6, CE1: 7, CE2: 8, CM1: 9 };

const EXERCISE_TYPES = [
  { id: 1,  emoji: '➕',    labelFr: 'Addition simple' },
  { id: 2,  emoji: '➖',    labelFr: 'Soustraction simple' },
  { id: 3,  emoji: '✖️',   labelFr: 'Multiplication simple' },
  { id: 4,  emoji: '➗',   labelFr: 'Division simple' },
  { id: 5,  emoji: '➕➖', labelFr: 'Addition + soustraction' },
  { id: 6,  emoji: '✖️➕', labelFr: 'Multiplication + addition' },
  { id: 7,  emoji: '✖️➖', labelFr: 'Multiplication + soustraction' },
  { id: 8,  emoji: '➗➕', labelFr: 'Division + addition' },
  { id: 9,  emoji: '➗➖', labelFr: 'Division + soustraction' },
  { id: 10, emoji: '🔀',   labelFr: 'Mélange complet' },
];

function typeAvailable(typeId, level) {
  const cfg = CONFIGS[level];
  if (!cfg) return false;
  if (typeId === 1 || typeId === 2 || typeId === 5) return true;
  if (typeId === 3 || typeId === 6 || typeId === 7) return cfg.ops.includes('×');
  if (typeId === 4 || typeId === 8 || typeId === 9) return cfg.allowDiv;
  if (typeId === 10) return true;
  return false;
}

function scoreBadge(score20, L) {
  if (score20 >= 18) return L.t('excellent');
  if (score20 >= 16) return L.t('tresBien');
  if (score20 >= 14) return L.t('bien');
  if (score20 >= 10) return L.t('aRevoir');
  return '✏️ Continue à t\'entraîner !';
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function MixedModePage() {
  const L = useCahierT();

  // Setup state
  const [age, setAge]               = useState(8);
  const [level, setLevel]           = useState('CE2');
  const [difficulty, setDifficulty] = useState('moyen');
  const [exType, setExType]         = useState(10);
  const [count, setCount]           = useState(10);
  const [format, setFormat]         = useState('avecImages');
  const [showVisual, setShowVisual] = useState(true);

  // Phase: 'setup' | 'exercises'
  const [phase, setPhase]           = useState('setup');
  const [exercises, setExercises]   = useState([]);

  function handleAgeSelect(a) {
    setAge(a);
    setLevel(AGE_TO_LEVEL[a] || 'CE2');
    // if current type is now unavailable, reset to mélange complet
    if (!typeAvailable(exType, AGE_TO_LEVEL[a] || 'CE2')) setExType(10);
  }

  function handleLevelSelect(lv) {
    setLevel(lv);
    setAge(LEVEL_TO_AGE[lv] || 8);
    if (!typeAvailable(exType, lv)) setExType(10);
  }

  function handleTypeSelect(id) {
    if (!typeAvailable(id, level)) return;
    setExType(id);
  }

  const generate = useCallback(() => {
    const exs = generateMixedExercises({
      age, schoolLevel: level, difficulty,
      exerciseType: exType, count,
      showVisual: showVisual && format !== 'modeExamen',
      locale: L.locale,
    });
    setExercises(exs);
    setPhase('exercises');
  }, [age, level, difficulty, exType, count, format, showVisual, L.locale]);

  const randomise = useCallback(() => {
    // Pick random settings constrained by current level
    const cfg = CONFIGS[level];
    const diffs = ['facile', 'moyen', 'difficile'];
    const rDiff = diffs[Math.floor(Math.random() * diffs.length)];
    const validTypes = EXERCISE_TYPES.filter((t) => typeAvailable(t.id, level)).map((t) => t.id);
    const rType = validTypes[Math.floor(Math.random() * validTypes.length)];
    const rCount = COUNTS[Math.floor(Math.random() * COUNTS.length)];
    const rFormat = FORMATS[Math.floor(Math.random() * FORMATS.length)];
    setDifficulty(rDiff);
    setExType(rType);
    setCount(rCount);
    setFormat(rFormat);
    setShowVisual(rDiff !== 'difficile');

    const exs = generateRandomMixed({
      age, schoolLevel: level, difficulty: rDiff,
      count: rCount,
      showVisual: rDiff !== 'difficile' && rFormat !== 'modeExamen',
      locale: L.locale,
    });
    setExercises(exs);
    setPhase('exercises');
  }, [age, level, L.locale]);

  const cfg = CONFIGS[level] || CONFIGS.CE2;

  if (phase === 'exercises') {
    if (format === 'modeCahier') {
      return (
        <NotebookMode
          exercises={exercises}
          L={L}
          onBack={() => setPhase('setup')}
        />
      );
    }
    if (format === 'modeExamen') {
      return (
        <ExamMode
          exercises={exercises}
          L={L}
          onBack={() => setPhase('setup')}
          onRetry={generate}
        />
      );
    }
    // avecImages or sansImages → training mode
    return (
      <TrainingMode
        exercises={exercises}
        showVisual={format === 'avecImages'}
        L={L}
        onBack={() => setPhase('setup')}
        onRetry={generate}
      />
    );
  }

  // ── Setup screen ─────────────────────────────────────────────────────────────
  return (
    <div className="cahier-page mixed-page">
      {/* Header */}
      <div className="cahier-header">
        <Link className="exam-back-btn" to="/cahier">←</Link>
        <div>
          <span className="eyebrow">Mathématiques</span>
          <h1>{L.t('modeMixteTitle')}</h1>
          <p className="cahier-sub">{L.t('modeMixteSubtitle')}</p>
        </div>
      </div>

      {/* Section 1 — Age & Level */}
      <section className="cahier-section">
        <h2 className="cahier-section__title">{L.t('age')} &amp; {L.t('niveauScolaire')}</h2>
        <div className="cahier-choice-row">
          {AGES.map((a) => (
            <button
              key={a}
              type="button"
              className={`cahier-chip${age === a ? ' is-selected' : ''}`}
              onClick={() => handleAgeSelect(a)}
            >
              {a} ans
            </button>
          ))}
        </div>
        <div className="cahier-choice-row" style={{ marginTop: 8 }}>
          {LEVELS.map((lv) => (
            <button
              key={lv}
              type="button"
              className={`cahier-chip${level === lv ? ' is-selected' : ''}`}
              onClick={() => handleLevelSelect(lv)}
            >
              {lv}
            </button>
          ))}
        </div>
        <p className="mixed-info-badge">
          {L.t('nombresJusqua')} {cfg.maxNum}
          {!cfg.ops.includes('×') && ' · '}
          {!cfg.ops.includes('×') && 'Addition & soustraction uniquement'}
        </p>
      </section>

      {/* Section 2 — Difficulty */}
      <section className="cahier-section">
        <h2 className="cahier-section__title">Difficulté</h2>
        <div className="cahier-choice-row">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.id}
              type="button"
              className={`cahier-chip${difficulty === d.id ? ' is-selected' : ''}`}
              onClick={() => { setDifficulty(d.id); setShowVisual(d.id !== 'difficile'); }}
            >
              {d.emoji} {d.id.charAt(0).toUpperCase() + d.id.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Section 3 — Exercise type */}
      <section className="cahier-section">
        <h2 className="cahier-section__title">{L.t('typeExercices')}</h2>
        <div className="mixed-type-grid">
          {EXERCISE_TYPES.map((t) => {
            const avail = typeAvailable(t.id, level);
            return (
              <button
                key={t.id}
                type="button"
                disabled={!avail}
                className={`cahier-chip mixed-type-chip${exType === t.id ? ' is-selected' : ''}${!avail ? ' is-disabled' : ''}`}
                onClick={() => handleTypeSelect(t.id)}
              >
                <span className="cahier-chip__emoji">{t.emoji}</span>
                <span>{t.labelFr}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 4 — Count */}
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

      {/* Section 5 — Format */}
      <section className="cahier-section">
        <h2 className="cahier-section__title">{L.t('format')}</h2>
        <div className="cahier-choice-row" style={{ flexWrap: 'wrap' }}>
          {FORMATS.map((f) => (
            <button
              key={f}
              type="button"
              className={`cahier-chip${format === f ? ' is-selected' : ''}`}
              onClick={() => setFormat(f)}
            >
              {FORMAT_EMOJIS[f]} {L.t(f)}
            </button>
          ))}
        </div>
      </section>

      {/* Section 6 — Visual toggle */}
      {format !== 'modeExamen' && (
        <section className="cahier-section">
          <label className="mixed-toggle-row">
            <span>{L.t('aideVisuelle')}</span>
            <button
              type="button"
              role="switch"
              aria-checked={showVisual}
              className={`mixed-toggle${showVisual ? ' mixed-toggle--on' : ''}`}
              onClick={() => setShowVisual((v) => !v)}
            >
              <span className="mixed-toggle__thumb" />
            </button>
          </label>
        </section>
      )}

      {/* Buttons */}
      <div className="cahier-actions">
        <button type="button" className="cahier-cta cahier-cta--soft" onClick={randomise}>
          {L.t('genererHasard')}
        </button>
        <button type="button" className="cahier-cta" onClick={generate}>
          {L.t('creerExercices')} →
        </button>
      </div>
    </div>
  );
}

// ── Training mode (avecImages / sansImages) ───────────────────────────────────

function TrainingMode({ exercises, showVisual, L, onBack, onRetry }) {
  const [index, setIndex]     = useState(0);
  const [draft, setDraft]     = useState('');
  const [feedback, setFeedback] = useState(null);
  const [done, setDone]       = useState(false);
  const [score, setScore]     = useState(0);

  const ex = exercises[index];
  const total = exercises.length;

  function submit(val) {
    const v = (val ?? draft).trim();
    if (feedback || !v) return;
    const correct = String(v) === ex.answer;
    setFeedback({ correct });
    if (correct) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 >= total) { setDone(true); return; }
    setIndex((i) => i + 1);
    setDraft('');
    setFeedback(null);
  }

  if (done) {
    const score20 = Math.round((score / total) * 20);
    return (
      <div className="cahier-page">
        <div className="cahier-header cahier-header--slim">
          <button type="button" className="exam-back-btn" onClick={onBack}>←</button>
          <div><span className="eyebrow">{L.t('resultEyebrow')}</span><h1>{L.t('noteFinale')}</h1></div>
        </div>
        <div className="results-score">
          <span className="results-score__emoji">{score20 >= 14 ? '🏆' : '💪'}</span>
          <span className="results-score__num">{score} / {total}</span>
          <span className="results-score__pct">{score20} / 20</span>
        </div>
        <p style={{ textAlign: 'center', color: '#fff', fontWeight: 700, fontSize: '1.2rem', margin: 0 }}>
          {scoreBadge(score20, L)}
        </p>
        <div className="cahier-actions">
          <button type="button" className="cahier-cta" onClick={onRetry}>{L.t('refaire')}</button>
          <button type="button" className="cahier-cta cahier-cta--soft" onClick={onBack}>{L.t('choisirAutres')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cahier-page">
      <div className="cahier-header cahier-header--slim">
        <button type="button" className="exam-back-btn" onClick={onBack}>←</button>
        <div>
          <span className="eyebrow">🔀 {L.t('modeMixteTitle')}</span>
          <h1>{L.t('exercice')} {index + 1} / {total}</h1>
        </div>
      </div>
      <div className="cahier-progress">
        <div className="cahier-progress__fill" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      <div className="test-card">
        <p className="test-card__question" style={{ fontSize: '1.6rem' }}>{ex.testQuestion}</p>
        {showVisual && ex.visual && (
          <p className="mixed-visual">{ex.visual}</p>
        )}
      </div>

      {!feedback && (
        <NumPad
          value={draft}
          onChange={setDraft}
          onSubmit={(v) => submit(v)}
          placeholder={L.t('taReponse')}
        />
      )}

      {feedback && (
        <div className={`exam-explanation--${feedback.correct ? 'correct' : 'wrong'}`} style={{ borderRadius: 14, padding: '14px 16px' }}>
          <p style={{ margin: 0, fontWeight: 700 }}>
            {feedback.correct ? '✅ ' + L.t('goodAnswer') : '❌ ' + L.t('notCorrect')}
          </p>
          {!feedback.correct && (
            <p style={{ margin: '6px 0 0' }}>
              {L.t('reponse')} : <strong>{ex.answer}</strong>
            </p>
          )}
          <p style={{ margin: '8px 0 0', fontSize: '.9rem', opacity: .88, fontWeight: 600 }}>{L.t('etapeLabel')}</p>
          {ex.steps && ex.steps.map((s, i) => (
            <p key={i} style={{ margin: '2px 0', fontSize: '.9rem', opacity: .9 }}>{s}</p>
          ))}
          <button
            type="button"
            className="cahier-cta cahier-cta--inline"
            style={{ marginTop: 12 }}
            onClick={next}
          >
            {index + 1 < total ? L.t('suivant') : L.t('voirResultat')}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Notebook mode ─────────────────────────────────────────────────────────────

function NotebookMode({ exercises, L, onBack }) {
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <div className="cahier-page">
      <div className="cahier-header cahier-header--slim">
        <button type="button" className="exam-back-btn" onClick={onBack}>←</button>
        <div>
          <span className="eyebrow">🔀 Mode mixte</span>
          <h1>{L.t('modeCahier')}</h1>
        </div>
      </div>
      <p className="cahier-instruction">{L.t('instructionNotebook')}</p>

      <div className="notebook-sheet">
        <h2 className="notebook-sheet__title">{L.t('ficheTitle')} · Calculs mélangés</h2>
        <ol className="notebook-list">
          {exercises.map((ex, i) => (
            <li key={ex.id} className="notebook-item">
              <span className="notebook-item__text">{ex.question}</span>
              {showAnswers && (
                <span className="mixed-notebook-answer"> → {ex.answer}</span>
              )}
              <span className="notebook-item__blank" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>

      {!showAnswers ? (
        <button type="button" className="cahier-cta" onClick={() => setShowAnswers(true)}>
          {L.t('voirCorrections')}
        </button>
      ) : (
        <div className="cahier-actions">
          <button type="button" className="cahier-cta cahier-cta--soft" onClick={onBack}>
            {L.t('choisirAutres')}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Exam mode ─────────────────────────────────────────────────────────────────

function ExamMode({ exercises, L, onBack, onRetry }) {
  const [answers, setAnswers]     = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults]     = useState([]);
  const [activeId, setActiveId]   = useState(exercises[0]?.id ?? null);
  const [padDraft, setPadDraft]   = useState('');

  function focusItem(id) {
    setActiveId(id);
    setPadDraft(answers[id] || '');
  }

  function confirmPad(val) {
    if (!activeId) return;
    const trimmed = val.trim();
    setAnswers((prev) => ({ ...prev, [activeId]: trimmed }));
    // Auto-advance to next unanswered question
    const ids = exercises.map((e) => e.id);
    const cur = ids.indexOf(activeId);
    const next = ids.slice(cur + 1).find((id) => !answers[id] && id !== activeId)
      ?? ids.find((id) => !answers[id] && id !== activeId)
      ?? null;
    if (next) {
      setActiveId(next);
      setPadDraft('');
    } else {
      setActiveId(null);
      setPadDraft('');
    }
  }

  function submitAll() {
    const r = exercises.map((ex) => {
      const userAnswer = String(answers[ex.id] ?? '').trim();
      const correct = userAnswer === ex.answer;
      return { exercise: ex, userAnswer, correct };
    });
    setResults(r);
    setSubmitted(true);
  }

  const correctCount = results.filter((r) => r.correct).length;
  const total = exercises.length;
  const score20 = submitted ? Math.round((correctCount / total) * 20) : 0;
  const allAnswered = exercises.every((ex) => (answers[ex.id] || '').trim() !== '');

  return (
    <div className="cahier-page">
      <div className="cahier-header cahier-header--slim">
        <button type="button" className="exam-back-btn" onClick={onBack}>←</button>
        <div>
          <span className="eyebrow">🔀 Mode mixte</span>
          <h1>{L.t('modeExamen')}</h1>
        </div>
      </div>

      {submitted && (
        <div className="results-score">
          <span className="results-score__emoji">{score20 >= 14 ? '🏆' : '💪'}</span>
          <span className="results-score__num">{correctCount} / {total}</span>
          <span className="results-score__pct">{score20} / 20 — {scoreBadge(score20, L)}</span>
        </div>
      )}

      <div className="mixed-exam-list">
        {exercises.map((ex, i) => {
          const res = submitted ? results[i] : null;
          const isActive = !submitted && activeId === ex.id;
          const val = answers[ex.id] || '';
          return (
            <div
              key={ex.id}
              className={`mixed-exam-item${res ? (res.correct ? ' mixed-exam-item--ok' : ' mixed-exam-item--ko') : ''}${isActive ? ' mixed-exam-item--active' : ''}`}
            >
              <div className="mixed-exam-item__row">
                <span className="mixed-exam-item__num">{i + 1}.</span>
                <span className="mixed-exam-item__q">{ex.testQuestion}</span>
              </div>
              {!submitted ? (
                <button
                  type="button"
                  className={`mixed-exam-answer-btn${val ? ' mixed-exam-answer-btn--filled' : ''}${isActive ? ' mixed-exam-answer-btn--active' : ''}`}
                  onClick={() => focusItem(ex.id)}
                >
                  {val || '?'}
                </button>
              ) : (
                <div className="mixed-exam-item__result">
                  <span>{res.correct ? '✅' : '❌'}</span>
                  <span>{L.t('taReponse')} <strong>{res.userAnswer || '—'}</strong></span>
                  {!res.correct && (
                    <span>{L.t('reponse')} <strong>{ex.answer}</strong></span>
                  )}
                  {submitted && ex.steps && !res.correct && (
                    <div className="mixed-exam-steps">
                      {ex.steps.map((s, si) => <p key={si} style={{ margin: '2px 0', fontSize: '.85rem' }}>{s}</p>)}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && activeId && (
        <div className="mixed-exam-numpad-dock">
          <NumPad
            value={padDraft}
            onChange={setPadDraft}
            onSubmit={confirmPad}
            placeholder="?"
          />
        </div>
      )}

      {!submitted ? (
        <button type="button" className="cahier-cta" onClick={submitAll} disabled={!allAnswered} style={!allAnswered ? { opacity: 0.5 } : {}}>
          {L.t('terminer')}
        </button>
      ) : (
        <div className="cahier-actions">
          <button type="button" className="cahier-cta" onClick={onRetry}>{L.t('refaire')}</button>
          <button type="button" className="cahier-cta cahier-cta--soft" onClick={onBack}>{L.t('choisirAutres')}</button>
        </div>
      )}
    </div>
  );
}
