import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCategories, getExamsByCategory, DIFFICULTY_LEVELS } from '../../../content/exams/registry.js';
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

  const cat = getCategories().find((c) => c.id === categoryId);
  const exams = getExamsByCategory(categoryId);

  if (!cat) {
    return (
      <div className="exam-hub-page">
        <div className="exam-hub-header">
          <Link className="exam-back-btn" to="/exam/library">←</Link>
          <div><h1>Matière introuvable</h1></div>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-hub-page">
      <div className="exam-hub-header">
        <Link className="exam-back-btn" to="/exam/library">←</Link>
        <div>
          <span className="eyebrow">{cat.emoji} {cat.label}</span>
          <h1>{exams.length} examens</h1>
          <p className="exam-hub-sub">Choisis un examen, puis un niveau.</p>
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
              {DIFFICULTY_LEVELS.map((lvl) => {
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
