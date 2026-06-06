// Results phase — gentle, positive correction. Never harsh.
import { useCahierT } from './cahierI18n.js';

export default function ResultsView({ graded, onRetryAll, onNewBatch, onSeeErrors, onSeeExplanations, errorCount }) {
  const L = useCahierT();
  const total = graded.length;
  const correct = graded.filter((g) => g.correct).length;
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const headline = pct >= 70 ? L.t('bravo') : L.t('continueTry');

  return (
    <div className="cahier-page">
      <div className="cahier-header cahier-header--slim">
        <button type="button" className="exam-back-btn" onClick={onNewBatch} aria-label="Retour">←</button>
        <div>
          <span className="eyebrow">{L.t('resultEyebrow')}</span>
          <h1>{headline}</h1>
        </div>
      </div>

      <div className="results-score">
        <span className="results-score__emoji">{pct >= 70 ? '🏆' : '💪'}</span>
        <span className="results-score__num">{correct} / {total}</span>
        <span className="results-score__pct">{pct}%</span>
      </div>

      <ul className="results-list">
        {graded.map((g) => (
          <li key={g.exercise.id} className={`results-item results-item--${g.correct ? 'ok' : 'ko'}`}>
            <div className="results-item__head">
              <span className="results-item__mark">{g.correct ? '✅' : '❌'}</span>
              <span className="results-item__q">{g.exercise.testQuestion || g.exercise.question}</span>
            </div>
            <div className="results-item__body">
              <span>Ta réponse : <strong>{String(g.userAnswer) || '—'}</strong></span>
              {!g.correct && <span>Bonne réponse : <strong>{g.exercise.answer}</strong></span>}
              {/* Explication détaillée réservée à l'écran « Voir les explications » */}
            </div>
          </li>
        ))}
      </ul>

      <div className="cahier-actions">
        {onSeeExplanations && (
          <button type="button" className="cahier-cta cahier-cta--go" onClick={onSeeExplanations}>{L.t('voirExplications')}</button>
        )}
        <button type="button" className="cahier-cta" onClick={onRetryAll}>{L.t('refaire')}</button>
        {errorCount > 0 && (
          <button type="button" className="cahier-cta cahier-cta--soft" onClick={onSeeErrors}>
            ⚠️ {L.t('mesErreurs')} ({errorCount})
          </button>
        )}
        <button type="button" className="cahier-cta cahier-cta--soft" onClick={onNewBatch}>
          {L.t('choisirAutres')}
        </button>
      </div>
    </div>
  );
}
