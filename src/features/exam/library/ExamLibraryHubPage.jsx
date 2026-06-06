import { Link } from 'react-router-dom';
import { getCategories } from '../../../content/exams/registry.js';
import { getCategoryLabel, getCategoryEmoji, getExamUi } from '../../../content/exams/examI18n.js';
import { useLocale } from '../../../shared/i18n/LocaleContext.jsx';

export default function ExamLibraryHubPage() {
  const { locale } = useLocale();
  const categories = getCategories();
  const ui = getExamUi(locale);

  return (
    <div className="exam-hub-page">
      <div className="exam-hub-header">
        <Link className="exam-back-btn" to="/exam">←</Link>
        <div>
          <span className="eyebrow">{ui.libraryTitle}</span>
          <h1>{ui.librarySubtitle}</h1>
          <p className="exam-hub-sub">{ui.libraryHint}</p>
        </div>
      </div>

      <div className="lecture-grid">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/exam/library/${cat.id}`}
            className="lecture-card"
          >
            <span className="lecture-card__emoji">{getCategoryEmoji(cat.id) || cat.emoji}</span>
            <span className="lecture-card__title">{getCategoryLabel(cat.id, locale) || cat.label}</span>
            <span className="lecture-card__meta">
              {ui.exams(cat.exams.length)} · {ui.levels(Object.keys(cat.exams[0]?.levels ?? {}).length)}
            </span>
          </Link>
        ))}
        {categories.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,.6)' }}>Aucun examen disponible.</p>
        )}
      </div>
    </div>
  );
}
