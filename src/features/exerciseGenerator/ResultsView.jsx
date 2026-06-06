// Results phase — gentle, positive correction. Never harsh.
const POSITIVE = [
  'Bravo, tu as bien essayé !',
  'Très bien, continue comme ça !',
  'Super travail ! 🌟',
];
const ENCOURAGE = [
  'Regarde encore une fois, tu y es presque.',
  'Continue à t’entraîner, tu progresses !',
];

export default function ResultsView({ graded, onRetryAll, onNewBatch, onSeeErrors, onSeeExplanations, errorCount }) {
  const total = graded.length;
  const correct = graded.filter((g) => g.correct).length;
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const headline = pct >= 70 ? POSITIVE[Math.min(2, Math.floor(pct / 34))] : ENCOURAGE[0];

  return (
    <div className="cahier-page">
      <div className="cahier-header cahier-header--slim">
        <button type="button" className="exam-back-btn" onClick={onNewBatch} aria-label="Retour">←</button>
        <div>
          <span className="eyebrow">Résultat</span>
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
          <button type="button" className="cahier-cta cahier-cta--go" onClick={onSeeExplanations}>📖 Voir les explications</button>
        )}
        <button type="button" className="cahier-cta" onClick={onRetryAll}>🔄 Refaire un cahier</button>
        {errorCount > 0 && (
          <button type="button" className="cahier-cta cahier-cta--soft" onClick={onSeeErrors}>
            ⚠️ Mes erreurs ({errorCount})
          </button>
        )}
        <button type="button" className="cahier-cta cahier-cta--soft" onClick={onNewBatch}>
          ✏️ Choisir d'autres exercices
        </button>
      </div>
    </div>
  );
}
