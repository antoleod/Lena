// ─────────────────────────────────────────────────────────────────────────────
// New "Mon cahier" flow screens:
//   VerificationView   — after the notebook: "As-tu terminé ?" → 2 choices
//   AnswersTableView    — compact Exercice | Réponse table (NO explanations yet)
//   ExplanationsView    — grouped explanations with méthode + "comment réfléchir"
//
// Pedagogy: the child works alone first; answers/explanations only appear AFTER
// she finishes her notebook. We never reveal solutions during solving.
// ─────────────────────────────────────────────────────────────────────────────

import { THINKING_TIPS } from './exerciseTypes.js';

function answerLabel(ex) {
  if (ex.inputType === 'true_false') return ex.answer ? 'Vrai' : 'Faux';
  return String(ex.answer ?? ex.correctAnswer ?? '');
}

// ── Étape : "J'ai terminé" → Vérification ────────────────────────────────────
export function VerificationView({ subject, onBack, onSeeAnswers, onDoTest }) {
  return (
    <div className="cahier-page">
      <div className="cahier-header cahier-header--slim">
        <button type="button" className="exam-back-btn" onClick={onBack}>←</button>
        <div><span className="eyebrow">📋 Vérification</span><h1>Vérification de mon travail</h1></div>
      </div>

      <div className="test-card" style={{ textAlign: 'center' }}>
        <p className="test-card__question">As-tu terminé tous les exercices dans ton cahier ?</p>
      </div>

      <div className="cahier-actions">
        <button type="button" className="cahier-cta" onClick={onSeeAnswers}>🔍 Voir les réponses</button>
        <button type="button" className="cahier-cta cahier-cta--go" onClick={onDoTest}>📝 Faire le test dans l'application</button>
      </div>
    </div>
  );
}

// ── Option 1 : table compacte des réponses (sans explications) ───────────────
export function AnswersTableView({ exercises, onBack, onSeeExplanations }) {
  return (
    <div className="cahier-page">
      <div className="cahier-header cahier-header--slim">
        <button type="button" className="exam-back-btn" onClick={onBack}>←</button>
        <div><span className="eyebrow">🔍 Réponses</span><h1>Les réponses</h1></div>
      </div>
      <p className="cahier-instruction">Compare avec ce que tu as écrit dans ton cahier.</p>

      <div className="answers-table">
        <div className="answers-table__head">
          <span>Exercice</span><span>Réponse</span>
        </div>
        {exercises.map((ex, i) => (
          <div className="answers-table__row" key={ex.id}>
            <span className="answers-table__num">{i + 1}</span>
            <span className="answers-table__ans">{answerLabel(ex)}</span>
          </div>
        ))}
      </div>

      <button type="button" className="cahier-cta" onClick={onSeeExplanations}>📖 Voir les explications</button>
    </div>
  );
}

// ── Explications groupées + "Comment réfléchir ?" ────────────────────────────
export function ExplanationsView({ exercises, subject, onBack, onRestart }) {
  const tips = THINKING_TIPS[subject] || THINKING_TIPS.math;
  return (
    <div className="cahier-page">
      <div className="cahier-header cahier-header--slim">
        <button type="button" className="exam-back-btn" onClick={onBack}>←</button>
        <div><span className="eyebrow">📖 Explications</span><h1>Comprendre mes exercices</h1></div>
      </div>

      <div className="think-card">
        <p className="think-card__title">🧠 Comment réfléchir ?</p>
        <ul className="think-card__list">
          {tips.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      </div>

      <ol className="explain-list">
        {exercises.map((ex, i) => (
          <li className="explain-item" key={ex.id}>
            <p className="explain-item__q">
              <strong>Exercice {i + 1}</strong> — {ex.testQuestion || ex.question}
            </p>
            <p className="explain-item__a">Réponse : <strong>{answerLabel(ex)}</strong></p>
            {ex.method && (
              <div className="explain-item__method">
                <span className="explain-item__method-label">Méthode :</span>
                {String(ex.method).split('\n').map((line, k) => (
                  <span className="explain-item__step" key={k}>{line}</span>
                ))}
              </div>
            )}
            {!ex.method && ex.explanation && (
              <p className="explain-item__exp">{ex.explanation}</p>
            )}
          </li>
        ))}
      </ol>

      <button type="button" className="cahier-cta" onClick={onRestart}>🔄 Refaire un cahier</button>
    </div>
  );
}
