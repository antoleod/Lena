import { Link } from 'react-router-dom';
import { GRADE_PACKS, GRADES } from './gradeExamPacks.js';
import { getResult, starsFor } from '../library/examLibraryProgress.js';

function gradeProgress(grade) {
  const pack = GRADE_PACKS[grade];
  let done = 0;
  for (const s of pack.subjects) {
    const levels = ['facile', 'moyen', 'difficile'];
    const any = levels.some((lk) => {
      const res = getResult(s.examId, lk);
      return res && starsFor(res.bestScore, res.total) >= 1;
    });
    if (any) done++;
  }
  return { done, total: pack.subjects.length };
}

export default function GradeExamHubPage() {
  return (
    <div className="exam-hub-page">
      <div className="exam-hub-header">
        <Link className="exam-back-btn" to="/exam">←</Link>
        <div>
          <span className="eyebrow">📚 Prépare ton année</span>
          <h1>Examens par classe</h1>
          <p className="exam-hub-sub">
            Choisis ton niveau et entraîne-toi avec les examens les plus difficiles de chaque matière.
          </p>
        </div>
      </div>

      <div className="grade-hub-grid">
        {GRADES.map((g) => {
          const pack = GRADE_PACKS[g];
          const { done, total } = gradeProgress(g);
          const pct = Math.round((done / total) * 100);
          return (
            <Link
              key={g}
              to={`/exam/grade/${g}`}
              className="grade-hub-card"
              style={{ '--grade-color': pack.color, background: pack.gradient }}
            >
              <span className="grade-hub-card__emoji">{pack.emoji}</span>
              <div className="grade-hub-card__body">
                <strong className="grade-hub-card__label">{pack.label}</strong>
                <span className="grade-hub-card__sub">{pack.subtitle}</span>
                <span className="grade-hub-card__desc">{pack.description}</span>
              </div>
              <div className="grade-hub-card__footer">
                <div className="grade-hub-card__track">
                  <div className="grade-hub-card__fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="grade-hub-card__count">{done}/{total}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
