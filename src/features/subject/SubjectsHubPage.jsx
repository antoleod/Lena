import { Link } from 'react-router-dom';
import { getActivitiesBySubject, subjects } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectDescription, getSubjectLabel } from '../../shared/i18n/contentLocalization.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';
import { getSubjectUniverse } from '../../shared/gameplay/subjectThemes.js';

function getSubjectProgress(subjectId, progress) {
  const acts = getActivitiesBySubject(subjectId).filter(a => a.gradeBand?.some(g => g === 'P2' || g === 'P3'));
  const completed = acts.filter(a => progress.activities[a.id]?.completed).length;
  const total = acts.length;
  return { completed, total, percent: total ? Math.round((completed / total) * 100) : 0 };
}

function SubjectPortal({ subject, locale, t, progress, index }) {
  const universe = getSubjectUniverse(subject.id);
  const data = getSubjectProgress(subject.id, progress);
  const grades = subject.grades.filter(g => g === 'P2' || g === 'P3' || g === 'P4' || g === 'P5' || g === 'P6');

  return (
    <Link
      to={`/subjects/${subject.id}`}
      className="sw-portal"
      style={{
        '--uni-accent':  universe.accent,
        '--uni-shadow':  universe.accentShadow,
        '--uni-bg':      universe.accentBg,
        '--uni-sky-top': universe.skyTop,
        '--uni-sky-bot': universe.skyBottom,
        animationDelay: `${index * 70}ms`,
      }}
      data-testid={`subject-tile-${subject.id}`}
    >
      {/* Sky background */}
      <div className="sw-portal__sky" aria-hidden="true">
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <span key={i} className="sw-portal__particle" style={{ '--i': i }}>{universe.particle}</span>
        ))}
      </div>

      {/* Planet / icon orb */}
      <div className="sw-portal__planet">
        <span className="sw-portal__planet-icon">{universe.icon}</span>
        {data.percent === 100 && <div className="sw-portal__crown">👑</div>}
      </div>

      {/* Info */}
      <div className="sw-portal__info">
        <h3 className="sw-portal__name">{getSubjectLabel(subject, locale, t)}</h3>
        <p className="sw-portal__desc">{getSubjectDescription(subject, locale)}</p>

        {/* Grade chips */}
        <div className="sw-portal__grades">
          {grades.map(g => (
            <span key={g} className="sw-portal__grade-chip">{g}</span>
          ))}
        </div>

        {/* Progress bar */}
        <div className="sw-portal__progress">
          <div className="sw-portal__progress-fill" style={{ width: `${data.percent}%` }} />
        </div>
        <span className="sw-portal__progress-label">{data.completed}/{data.total}</span>
      </div>

      {/* CTA */}
      <div className="sw-portal__cta">▶ Entrar</div>
    </Link>
  );
}

export default function SubjectsHubPage() {
  const { locale, t } = useLocale();
  const progress = getProgressSnapshot();
  const activeSubjects = subjects.filter(s => s.grades.some(g => ['P2','P3','P4','P5','P6'].includes(g)));

  return (
    <div className="sw-hub" data-testid="subjects-page">
      {/* Header */}
      <div className="sw-hub__header">
        <Link className="cc-back-btn" to="/">←</Link>
        <div className="sw-hub__header-text">
          <span className="sw-hub__eyebrow">Explorar</span>
          <h1 className="sw-hub__title">Tus Universos</h1>
        </div>
        <span className="sw-hub__count">{activeSubjects.length}</span>
      </div>

      {/* Portal grid */}
      <div className="sw-hub__grid">
        {activeSubjects.map((subject, index) => (
          <SubjectPortal
            key={subject.id}
            subject={subject}
            locale={locale}
            t={t}
            progress={progress}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
