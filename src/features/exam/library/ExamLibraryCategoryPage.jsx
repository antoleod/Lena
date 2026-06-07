import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCategories, getExamsByCategory } from '../../../content/exams/registry.js';
import { getCategoryLabel, getCategoryEmoji, getDifficultyLevels, getExamUi } from '../../../content/exams/examI18n.js';
import { useLocale } from '../../../shared/i18n/LocaleContext.jsx';
import { getResult, starsFor } from './examLibraryProgress.js';
import { IconDiffFacile, IconDiffMoyen, IconDiffDifficile, IconDiffGuide } from '../../../assets/icons/DifficultyIcons.jsx';

const DIFF_ICON = {
  facile:    IconDiffFacile,
  moyen:     IconDiffMoyen,
  difficile: IconDiffDifficile,
  guide:     IconDiffGuide,
};

function Stars({ count }) {
  return (
    <span className="lecture-card__stars">
      {[1, 2, 3].map((i) => (
        <span key={i} style={{ opacity: i <= count ? 1 : 0.25 }}>&#11088;</span>
      ))}
    </span>
  );
}

const NEW_EXAM_IDS = new Set([
  'calcul-mental-11','calcul-mental-12',
  'problemes-mathematiques-21','problemes-mathematiques-22',
  'conjugaison-24','conjugaison-25',
  'grammaire-24','grammaire-25',
  'orthographe-21','orthographe-22',
  'geometrie-21','geometrie-22',
  'mesures-21','mesures-22',
]);

const NEW_BADGE_LABEL = {
  fr: { ce1: 'Nouveau · CE1', ce2: 'Nouveau · CE2' },
  nl: { ce1: 'Nieuw · CE1',   ce2: 'Nieuw · CE2'   },
  en: { ce1: 'New · Year 2',  ce2: 'New · Year 3'  },
  es: { ce1: 'Nuevo · CE1',   ce2: 'Nuevo · CE2'   },
};

/** Returns the best star count across all 3 difficulty levels for an exam stub. */
function bestStarsForExam(exam) {
  const levelKeys = exam.levelKeys ?? ['facile', 'moyen', 'difficile'];
  let best = 0;
  for (const lk of levelKeys) {
    const res = getResult(exam.id, lk);
    if (!res) continue;
    const passPercent = exam.levelPassPercent?.[lk];
    const s = starsFor(res.bestScore, res.total, passPercent);
    if (s > best) best = s;
  }
  return best;
}

/** Returns count of exams in list that have at least 1 star on any level. */
function countPassedExams(exams) {
  let count = 0;
  for (const exam of exams) {
    if (bestStarsForExam(exam) >= 1) count++;
  }
  return count;
}

export default function ExamLibraryCategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { locale } = useLocale();

  // getCategories() is still sync (reads the manifest)
  const cat = getCategories().find((c) => c.id === categoryId);
  const difficultyLevels = getDifficultyLevels(locale);
  const ui = getExamUi(locale);

  const [exams, setExams] = useState(null); // null = loading

  useEffect(() => {
    let cancelled = false;
    getExamsByCategory(categoryId).then((list) => {
      if (!cancelled) setExams(list);
    });
    return () => { cancelled = true; };
  }, [categoryId]);

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

  if (exams === null) {
    return (
      <div className="exam-hub-page">
        <div className="exam-hub-header">
          <Link className="exam-back-btn" to="/exam/library">←</Link>
          <div>
            <span className="eyebrow">{getCategoryEmoji(cat.id)} {getCategoryLabel(cat.id, locale)}</span>
            <h1>Chargement…</h1>
          </div>
        </div>
      </div>
    );
  }

  const passed = countPassedExams(exams);
  const total = exams.length;

  return (
    <div className="exam-hub-page">
      <div className="exam-hub-header">
        <Link className="exam-back-btn" to="/exam/library">←</Link>
        <div>
          <span className="eyebrow">{getCategoryEmoji(cat.id)} {getCategoryLabel(cat.id, locale)}</span>
          <h1>{ui.exams(exams.length)}</h1>
          <p className="exam-hub-sub">{ui.categoryHint}</p>
          {total > 0 && (
            <p className="exam-category-progress-summary">
              {ui.progress(passed, total)}
            </p>
          )}
        </div>
      </div>

      <div className="exam-subject-grid">
        {exams.map((exam) => {
          const best = bestStarsForExam(exam);
          const isNew = NEW_EXAM_IDS.has(exam.id);
          const isCE1 = isNew && exam.id.endsWith('1') || (isNew && !exam.id.endsWith('2'));
          const badgeLabels = NEW_BADGE_LABEL[locale] || NEW_BADGE_LABEL.fr;
          const badgeLabel = isNew ? (exam.title.includes('CE2') ? badgeLabels.ce2 : badgeLabels.ce1) : null;
          return (
            <div key={exam.id} className={`exam-subject-card${isNew ? ' exam-subject-card--new' : ''}`}>
              <div className="exam-subject-card__top">
                <span className="exam-subject-card__emoji">{exam.emoji}</span>
                <div className="exam-subject-card__info">
                  <span className="exam-subject-card__name">{exam.title}</span>
                  {isNew && (
                    <span className="exam-subject-card__new-badge">✨ {badgeLabel}</span>
                  )}
                  {best > 0 && (
                    <span className="exam-subject-card__best-badge">
                      <Stars count={best} />
                    </span>
                  )}
                </div>
              </div>
              <div className="exam-subject-card__modes">
                {/* guided mode button */}
                <button
                  type="button"
                  className="exam-mode-btn exam-mode-btn--guide"
                  style={{ flexDirection: 'column', gap: 2 }}
                  onClick={() => navigate(`/exam/library/play?exam=${exam.id}&level=guide`)}
                >
                  <IconDiffGuide size={28} />
                  <span>Guidé</span>
                </button>
                {difficultyLevels.map((lvl) => {
                  const res = getResult(exam.id, lvl.key);
                  // stubs carry levelPassPercent instead of the full levels object
                  const passPercent = exam.levelPassPercent?.[lvl.key];
                  const stars = res ? starsFor(res.bestScore, res.total, passPercent) : 0;
                  return (
                    <button
                      key={lvl.key}
                      type="button"
                      className="exam-mode-btn"
                      style={{ flexDirection: 'column', gap: 2 }}
                      onClick={() => navigate(`/exam/library/play?exam=${exam.id}&level=${lvl.key}`)}
                    >
                      {(() => { const DIcon = DIFF_ICON[lvl.key]; return DIcon ? <DIcon size={28} /> : lvl.emoji; })()}
                      <span>{lvl.label}</span>
                      {res && <Stars count={stars} />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
