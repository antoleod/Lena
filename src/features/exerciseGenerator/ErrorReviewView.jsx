import { useState } from 'react';
import NumericAnswerInput, { isNumericAnswerValue } from '../../shared/ui/NumericAnswerInput.jsx';
import { getErrors, clearError, clearAllErrors } from './exerciseStorage.js';
import { checkAnswer } from './exerciseEngine.js';

export default function ErrorReviewView({ onBack, onCountChange }) {
  const [errors, setErrors] = useState(() => getErrors());

  function refresh() {
    const next = getErrors();
    setErrors(next);
    onCountChange?.(next.length);
  }

  function handleSolved(id) {
    clearError(id);
    refresh();
  }

  function handleClearAll() {
    if (!window.confirm('Effacer toutes tes erreurs ?')) return;
    clearAllErrors();
    refresh();
  }

  return (
    <div className="cahier-page">
      <div className="cahier-header cahier-header--slim">
        <button type="button" className="exam-back-btn" onClick={onBack}>←</button>
        <div>
          <span className="eyebrow">Révision</span>
          <h1>Mes erreurs</h1>
        </div>
        {errors.length > 0 && (
          <button type="button" className="cahier-errors-cta" onClick={handleClearAll}>🧹 Tout effacer</button>
        )}
      </div>

      {errors.length === 0 ? (
        <div className="cahier-empty">
          <span className="cahier-empty__emoji">🎉</span>
          <p>Aucune erreur à revoir. Bravo !</p>
        </div>
      ) : (
        <ul className="results-list">
          {errors.map((err) => (
            <ErrorCard key={err.id + err.ts} err={err} onSolved={() => handleSolved(err.id)} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ErrorCard({ err, onSolved }) {
  const [draft, setDraft] = useState('');
  const [feedback, setFeedback] = useState(null);
  const expectedAnswer = String(err.answer ?? err.correctAnswer ?? '').trim();
  const isNumeric = err.inputType === 'number' || isNumericAnswerValue(expectedAnswer);

  function tryAnswer(value) {
    const ok = checkAnswer(err, value);
    setFeedback(ok ? 'ok' : 'ko');
    if (ok) setTimeout(onSolved, 1100);
  }

  return (
    <li className="results-item results-item--ko">
      <div className="results-item__head">
        <span className="results-item__mark">📝</span>
        <span className="results-item__q">{err.question}</span>
      </div>
      <div className="results-item__body">
        <span>Avant, tu avais écrit : <strong>{err.userAnswer || '—'}</strong></span>
      </div>

      {feedback !== 'ok' && (
        <div className="error-retry">
          {err.inputType === 'choice' && (err.options || []).map((opt) => (
            <button key={opt} type="button" className="test-choice test-choice--sm" onClick={() => tryAnswer(opt)}>
              {opt}
            </button>
          ))}
          {err.inputType !== 'choice' && isNumeric && (
            <NumericAnswerInput
              value={draft}
              onChange={setDraft}
              onSubmit={(value) => {
                const text = String(value).trim();
                if (text) tryAnswer(text);
              }}
              expectedAnswer={expectedAnswer}
              placeholder="Réessaie..."
              allowNegative={expectedAnswer.startsWith('-')}
              valueLabel="Ta réponse"
              readLabel="J'ai lu"
              handwritingLabel="Écrire la réponse"
              keypadLabel="Clavier numérique"
            />
          )}
          {err.inputType !== 'choice' && !isNumeric && (
            <form onSubmit={(e) => { e.preventDefault(); if (draft.trim()) tryAnswer(draft.trim()); }} className="test-input-row">
              <input className="test-input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Réessaie..." />
              <button type="submit" className="cahier-cta cahier-cta--inline" disabled={!draft.trim()}>OK</button>
            </form>
          )}
        </div>
      )}

      {feedback === 'ko' && (
        <p className="error-feedback error-feedback--ko">
          Presque ! Bonne réponse : <strong>{err.answer}</strong>. {err.explanation}
        </p>
      )}
      {feedback === 'ok' && (
        <p className="error-feedback error-feedback--ok">✅ Bravo ! Tu as réussi cette fois ! 🌟</p>
      )}
    </li>
  );
}
