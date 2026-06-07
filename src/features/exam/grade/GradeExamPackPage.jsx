import { useNavigate, useParams, Link } from 'react-router-dom';
import { GRADE_PACKS } from './gradeExamPacks.js';
import { getResult, starsFor } from '../library/examLibraryProgress.js';
import { IconDiffFacile, IconDiffMoyen, IconDiffDifficile } from '../../../assets/icons/DifficultyIcons.jsx';

const LEVELS = [
  { key: 'facile',    label: 'Facile',    Icon: IconDiffFacile },
  { key: 'moyen',     label: 'Moyen',     Icon: IconDiffMoyen },
  { key: 'difficile', label: 'Difficile', Icon: IconDiffDifficile },
];

function Stars({ examId }) {
  const best = LEVELS.reduce((max, { key }) => {
    const res = getResult(examId, key);
    if (!res) return max;
    return Math.max(max, starsFor(res.bestScore, res.total));
  }, 0);
  if (!best) return null;
  return (
    <span className="grade-pack-card__stars">
      {[1, 2, 3].map((i) => (
        <span key={i} style={{ opacity: i <= best ? 1 : 0.25 }}>⭐</span>
      ))}
    </span>
  );
}

export default function GradeExamPackPage() {
  const { grade } = useParams();
  const navigate = useNavigate();
  const pack = GRADE_PACKS[grade];

  if (!pack) {
    return (
      <div className="exam-hub-page">
        <div className="exam-hub-header">
          <Link className="exam-back-btn" to="/exam/grade">←</Link>
          <div><h1>Classe introuvable</h1></div>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-hub-page">
      <div className="exam-hub-header">
        <Link className="exam-back-btn" to="/exam/grade">←</Link>
        <div>
          <span className="eyebrow" style={{ color: pack.color }}>
            {pack.emoji} {pack.subtitle}
          </span>
          <h1>Examens {pack.label}</h1>
          <p className="exam-hub-sub">{pack.description}</p>
        </div>
      </div>

      <div className="exam-subject-grid">
        {pack.subjects.map((s) => (
          <div key={s.examId} className="exam-subject-card">
            <div className="exam-subject-card__top">
              <span className="exam-subject-card__emoji">{s.emoji}</span>
              <div className="exam-subject-card__info">
                <span className="exam-subject-card__name">{s.label}</span>
                <Stars examId={s.examId} />
              </div>
            </div>
            <div className="exam-subject-card__modes">
              {LEVELS.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  type="button"
                  className="exam-mode-btn"
                  style={{ flexDirection: 'column', gap: 2 }}
                  onClick={() =>
                    navigate(`/exam/library/play?exam=${s.examId}&level=${key}`)
                  }
                >
                  <Icon size={28} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
