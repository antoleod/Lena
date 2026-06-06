// ─────────────────────────────────────────────────────────────────────────────
// New "Mon cahier" flow screens:
//   VerificationView   — after the notebook: "As-tu terminé ?" → 2 choices
//   AnswersTableView    — compact Exercice | Réponse table (NO explanations yet)
//   ExplanationsView    — grouped explanations with méthode + "comment réfléchir"
//
// Pedagogy: the child works alone first; answers/explanations only appear AFTER
// she finishes her notebook. We never reveal solutions during solving.
// ─────────────────────────────────────────────────────────────────────────────

import { useCahierT } from './cahierI18n.js';

function answerLabel(ex) {
  if (ex.inputType === 'true_false') return ex.answer ? 'Vrai' : 'Faux';
  return String(ex.answer ?? ex.correctAnswer ?? '');
}

// ── Étape : "J'ai terminé" → Vérification ────────────────────────────────────
export function VerificationView({ subject, onBack, onSeeAnswers, onDoTest }) {
  const L = useCahierT();
  return (
    <div className="cahier-page">
      <div className="cahier-header cahier-header--slim">
        <button type="button" className="exam-back-btn" onClick={onBack}>←</button>
        <div><span className="eyebrow">{L.t('verifEyebrow')}</span><h1>{L.t('verifTitle')}</h1></div>
      </div>

      <div className="test-card" style={{ textAlign: 'center' }}>
        <p className="test-card__question">{L.t('verifQuestion')}</p>
      </div>

      <div className="cahier-actions">
        <button type="button" className="cahier-cta" onClick={onSeeAnswers}>{L.t('voirReponses')}</button>
        <button type="button" className="cahier-cta cahier-cta--go" onClick={onDoTest}>{L.t('faireTest')}</button>
        <button type="button" className="cahier-cta cahier-cta--soft" onClick={onBack}>{L.t('continuerCahier')}</button>
      </div>
    </div>
  );
}

// ── Option 1 : table compacte des réponses (sans explications) ───────────────
export function AnswersTableView({ exercises, onBack, onSeeExplanations, onContinue }) {
  const L = useCahierT();
  return (
    <div className="cahier-page">
      <div className="cahier-header cahier-header--slim">
        <button type="button" className="exam-back-btn" onClick={onBack}>←</button>
        <div><span className="eyebrow">{L.t('reponsesEyebrow')}</span><h1>{L.t('reponsesTitle')}</h1></div>
      </div>
      <p className="cahier-instruction">{L.t('compare')}</p>

      <div className="answers-table">
        <div className="answers-table__head">
          <span>{L.t('exercice')}</span><span>{L.t('reponse')}</span>
        </div>
        {exercises.map((ex, i) => (
          <div className="answers-table__row" key={ex.id}>
            <span className="answers-table__num">{i + 1}</span>
            <span className="answers-table__ans">{answerLabel(ex)}</span>
          </div>
        ))}
      </div>

      <div className="cahier-actions">
        <button type="button" className="cahier-cta" onClick={onSeeExplanations}>{L.t('voirExplications')}</button>
        {onContinue && <button type="button" className="cahier-cta cahier-cta--go" onClick={onContinue}>{L.t('continuerNouvelle')}</button>}
      </div>
    </div>
  );
}

// ── Explications groupées + "Comment réfléchir ?" ────────────────────────────
export function ExplanationsView({ exercises, subject, onBack, onRestart, onContinue }) {
  const L = useCahierT();
  const tips = L.tips(subject);
  return (
    <div className="cahier-page">
      <div className="cahier-header cahier-header--slim">
        <button type="button" className="exam-back-btn" onClick={onBack}>←</button>
        <div><span className="eyebrow">{L.t('explicationsEyebrow')}</span><h1>{L.t('explicationsTitle')}</h1></div>
      </div>

      <div className="think-card">
        <p className="think-card__title">{L.t('commentReflechir')}</p>
        <ul className="think-card__list">
          {tips.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      </div>

      <ol className="explain-list">
        {exercises.map((ex, i) => (
          <li className="explain-item" key={ex.id}>
            <p className="explain-item__q">
              <strong>{L.t('exercice')} {i + 1}</strong> — {ex.testQuestion || ex.question}
            </p>
            <p className="explain-item__a">{L.t('reponse')} : <strong>{answerLabel(ex)}</strong></p>
            {ex.method && (
              <div className="explain-item__method">
                <span className="explain-item__method-label">{L.t('methode')}</span>
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

      <div className="cahier-actions">
        {onContinue && <button type="button" className="cahier-cta cahier-cta--go" onClick={onContinue}>{L.t('continuerNouvelle')}</button>}
        <button type="button" className="cahier-cta cahier-cta--soft" onClick={onRestart}>{L.t('choisirAutres')}</button>
      </div>
    </div>
  );
}
