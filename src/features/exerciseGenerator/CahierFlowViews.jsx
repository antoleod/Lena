// ─────────────────────────────────────────────────────────────────────────────
// New "Mon cahier" flow screens:
//   VerificationView   — after the notebook: "As-tu terminé ?" → 2 choices
//   AnswersTableView    — compact Exercice | Réponse table (NO explanations yet)
//   ExplanationsView    — grouped explanations with méthode + "comment réfléchir"
//
// Pedagogy: the child works alone first; answers/explanations only appear AFTER
// she finishes her notebook. We never reveal solutions during solving.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { useCahierT } from './cahierI18n.js';
import { getType } from './exerciseTypes.js';
import { getWeakAreas } from '../../services/storage/errorHistoryStore.js';

function answerLabel(ex) {
  if (ex.inputType === 'true_false') return ex.answer ? 'Vrai' : 'Faux';
  return String(ex.answer ?? ex.correctAnswer ?? '');
}

// ── Étape : "J'ai terminé" → Vérification ────────────────────────────────────
export function VerificationView({ subject, onBack, onSeeAnswers, onSeeExplanations, onDoTest, onPapa, onSeeErrors, errorCount }) {
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
        <button type="button" className="cahier-cta cahier-cta--go" onClick={onDoTest}>{L.t('faireTest')}</button>
        <button type="button" className="cahier-cta" onClick={onPapa} style={{ background: 'linear-gradient(135deg,#5dade2,#2e86c1)' }}>{L.t('corrigerPapa')}</button>
        <button type="button" className="cahier-cta cahier-cta--soft" onClick={onSeeAnswers}>👀 {L.t('voirReponses')}</button>
        <button type="button" className="cahier-cta cahier-cta--soft" onClick={onSeeExplanations}>{L.t('voirExplications')}</button>
        {errorCount > 0 && (
          <button type="button" className="cahier-cta cahier-cta--soft" onClick={onSeeErrors}>🎯 {L.t('mesErreurs')} ({errorCount})</button>
        )}
        <button type="button" className="cahier-cta cahier-cta--soft" onClick={onBack}>{L.t('continuerCahier')}</button>
      </div>
    </div>
  );
}

// ── "À retravailler" — entraînement adaptatif basé sur les erreurs ───────────
export function RetravaillerView({ onBack, onPractice }) {
  const L = useCahierT();
  const areas = getWeakAreas().slice(0, 8);
  return (
    <div className="cahier-page">
      <div className="cahier-header cahier-header--slim">
        <button type="button" className="exam-back-btn" onClick={onBack}>←</button>
        <div><span className="eyebrow">💪 {L.t('aRetravailler')}</span><h1>{L.t('aRetravaillerTitle')}</h1></div>
      </div>

      {areas.length === 0 ? (
        <div className="cahier-empty">
          <span className="cahier-empty__emoji">🌟</span>
          <p>{L.t('rienARetravailler')}</p>
        </div>
      ) : (
        <>
          <p className="cahier-instruction">{L.t('retravaillerIntro')}</p>
          <div className="cahier-choice-grid">
            {areas.map((a) => {
              const tp = getType(a.subject, a.type);
              return (
                <button key={a.key} type="button" className="cahier-chip cahier-chip--big" onClick={() => onPractice(a)}>
                  <span className="cahier-chip__emoji">{tp?.emoji || '✏️'}</span>
                  <span>{tp?.label || a.type}</span>
                  <span className="retravailler-count">{a.count} ✗</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ── Mode "Corriger avec papa" — guidé, une question à la fois ────────────────
export function PapaModeView({ exercises, onBack }) {
  const L = useCahierT();
  const [index, setIndex] = useState(0);
  const ex = exercises[index];
  const total = exercises.length;
  const isLast = index === total - 1;
  return (
    <div className="cahier-page">
      <div className="cahier-header cahier-header--slim">
        <button type="button" className="exam-back-btn" onClick={onBack}>←</button>
        <div><span className="eyebrow">👨‍👧 {L.t('corrigerPapa')}</span><h1>{L.t('papaTitle')}</h1></div>
      </div>
      <div className="cahier-progress"><div className="cahier-progress__fill" style={{ width: `${((index + 1) / total) * 100}%` }} /></div>

      <div className="explain-item" style={{ borderLeftColor: '#2e86c1' }}>
        <p className="explain-item__q"><strong>{L.t('exercice')} {index + 1}</strong> — {ex.testQuestion || ex.question}</p>
        <p className="explain-item__a">{L.t('reponse')} : <strong>{ex.inputType === 'true_false' ? (ex.answer ? 'Vrai' : 'Faux') : String(ex.answer ?? ex.correctAnswer)}</strong></p>
        {ex.method && (
          <div className="explain-item__method">
            <span className="explain-item__method-label">{L.t('methode')}</span>
            {String(ex.method).split('\n').map((line, k) => <span key={k} className="explain-item__step">{line}</span>)}
          </div>
        )}
        {ex.improvementTip && <p className="explain-item__exp">{L.t('conseil')} : {ex.improvementTip}</p>}
        {!ex.method && ex.explanation && <p className="explain-item__exp">{ex.explanation}</p>}
      </div>

      <div className="cahier-actions">
        {!isLast
          ? <button type="button" className="cahier-cta" onClick={() => setIndex((i) => i + 1)}>{L.t('suivant')}</button>
          : <button type="button" className="cahier-cta cahier-cta--soft" onClick={onBack}>← {L.t('verifTitle')}</button>}
      </div>
    </div>
  );
}

// ── Option 1 : table compacte des réponses (sans explications) ───────────────
export function AnswersTableView({ exercises, onBack, onSeeExplanations, onDoTest, onPapa, onContinue }) {
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
        {onDoTest && <button type="button" className="cahier-cta cahier-cta--go" onClick={onDoTest}>{L.t('faireTest')}</button>}
        {onPapa && <button type="button" className="cahier-cta" style={{ background: 'linear-gradient(135deg,#5dade2,#2e86c1)' }} onClick={onPapa}>{L.t('corrigerPapa')}</button>}
        {onContinue && <button type="button" className="cahier-cta cahier-cta--soft" onClick={onContinue}>{L.t('continuerNouvelle')}</button>}
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
