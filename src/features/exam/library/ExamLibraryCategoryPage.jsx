import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCategories, getExamsByCategory } from '../../../content/exams/registry.js';
import { getCategoryLabel, getCategoryEmoji, getDifficultyLevels, getExamUi } from '../../../content/exams/examI18n.js';
import { useLocale } from '../../../shared/i18n/LocaleContext.jsx';
import { getResult, starsFor } from './examLibraryProgress.js';

function Stars({ count }) {
  return (
    <span className="lecture-card__stars">
      {[1, 2, 3].map((i) => (
        <span key={i} style={{ opacity: i <= count ? 1 : 0.25 }}>⭐</span>
      ))}
    </span>
  );
}

export default function ExamLibraryCategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { locale } = useLocale();

  const cat = getCategories().find((c) => c.id === categoryId);
  const exams = getExamsByCategory(categoryId);
  const difficultyLevels = getDifficultyLevels(locale);
  const ui = getExamUi(locale);

  if (!cat) {
    return (
      <div className="exam-hub-page">
        <div className="exam-hub-header">
          <Link className="exam-back-btn" to="/exam/library">←</Link>
          <div><h1>{ui.notFound}</h1></div>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-hub-page">
      <div className="exam-hub-header">
        <Link className="exam-back-btn" to="/exam/library">←</Link>
        <div>
          <span className="eyebrow">{getCategoryEmoji(cat.id)} {getCategoryLabel(cat.id, locale)}</span>
          <h1>{ui.exams(exams.length)}</h1>
          <p className="exam-hub-sub">{ui.categoryHint}</p>
        </div>
      </div>

      <div className="exam-subject-grid">
        {exams.map((exam) => (
          <div key={exam.id} className="exam-subject-card">
            <div className="exam-subject-card__top">
              <span className="exam-subject-card__emoji">{exam.emoji}</span>
              <div className="exam-subject-card__info">
                <span className="exam-subject-card__name">{exam.title}</span>
              </div>
            </div>
            <div className="exam-subject-card__modes">
              {difficultyLevels.map((lvl) => {
                const res = getResult(exam.id, lvl.key);
                const stars = res ? starsFor(res.bestScore, res.total, exam.levels[lvl.key]?.passPercent) : 0;
                return (
                  <button
                    key={lvl.key}
                    type="button"
                    className="exam-mode-btn"
                    style={{ flexDirection: 'column', gap: 2 }}
                    onClick={() => navigate(`/exam/library/play?exam=${exam.id}&level=${lvl.key}`)}
                  >
                    <span>{lvl.emoji} {lvl.label}</span>
                    {res && <Stars count={stars} />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
