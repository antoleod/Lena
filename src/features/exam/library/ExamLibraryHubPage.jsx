import { Link } from 'react-router-dom';
import { getCategories } from '../../../content/exams/registry.js';

export default function ExamLibraryHubPage() {
  const categories = getCategories();

  return (
    <div className="exam-hub-page">
      <div className="exam-hub-header">
        <Link className="exam-back-btn" to="/exam">←</Link>
        <div>
          <span className="eyebrow">Bibliothèque d'examens</span>
          <h1>Examens par matière</h1>
          <p className="exam-hub-sub">Choisis une matière, puis un examen et un niveau.</p>
        </div>
      </div>

      <div className="lecture-grid">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/exam/library/${cat.id}`}
            className="lecture-card"
          >
            <span className="lecture-card__emoji">{cat.emoji}</span>
            <span className="lecture-card__title">{cat.label}</span>
            <span className="lecture-card__meta">{cat.exams.length} examens · {Object.keys(cat.exams[0]?.levels ?? {}).length} niveaux</span>
          </Link>
        ))}
        {categories.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,.6)' }}>Aucun examen disponible.</p>
        )}
      </div>
    </div>
  );
}
