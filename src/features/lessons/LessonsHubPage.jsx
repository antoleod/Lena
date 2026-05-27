import { Link } from 'react-router-dom';
import { LESSONS_CATALOG } from '../../content/lessons/lessonsCatalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';

const SUBJECT_LABELS = {
  mathematics: 'Mathématiques',
  french: 'Français',
  dutch: 'Néerlandais',
  english: 'Anglais',
  spanish: 'Espagnol',
};

export default function LessonsHubPage() {
  const { t } = useLocale();

  return (
    <div className="lp-hub" data-testid="lessons-hub-page">
      <div className="lp-hub__header">
        <Link className="cc-back-btn" to="/">←</Link>
        <div className="lp-hub__header-text">
          <span className="lp-hub__eyebrow">Explorer</span>
          <h1 className="lp-hub__title">Mini-leçons 📚</h1>
        </div>
      </div>

      <p className="lp-hub__intro">
        Des explications claires, simples et amusantes pour apprendre à ton rythme ! 😊
      </p>

      <div className="lp-hub__grid">
        {LESSONS_CATALOG.map((lesson, i) => (
          <Link
            key={lesson.id}
            to={`/lessons/${lesson.id}`}
            className="lp-card"
            style={{
              '--lp-color': lesson.color,
              '--lp-shadow': lesson.shadow,
              '--lp-bg': lesson.bg,
              animationDelay: `${i * 80}ms`,
            }}
            data-testid={`lesson-card-${lesson.id}`}
          >
            <div className="lp-card__sky">
              <span className="lp-card__emoji">{lesson.emoji}</span>
              <div className="lp-card__grade-chips">
                {lesson.grade.map(g => (
                  <span key={g} className="lp-card__grade-chip">{g}</span>
                ))}
              </div>
            </div>
            <div className="lp-card__body">
              <div className="lp-card__subject">{SUBJECT_LABELS[lesson.subject] || lesson.subject}</div>
              <h3 className="lp-card__title">{lesson.title}</h3>
              <p className="lp-card__sub">{lesson.subtitle}</p>
              <div className="lp-card__meta">
                <span>🕐 {lesson.duration}</span>
                <span>· {lesson.slides.length} étapes</span>
              </div>
            </div>
            <div className="lp-card__cta">▶ Commencer</div>
          </Link>
        ))}
      </div>

      {LESSONS_CATALOG.length === 0 && (
        <div className="lp-hub__empty">
          <span>🔭</span>
          <p>Bientôt de nouvelles leçons !</p>
        </div>
      )}
    </div>
  );
}
