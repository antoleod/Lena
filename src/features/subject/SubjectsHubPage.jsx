import { Link } from 'react-router-dom';
import { getActivitiesBySubject, getGradeProgression, subjects } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectDescription, getSubjectLabel, getSubjectRoadmap } from '../../shared/i18n/contentLocalization.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';

const SUBJECT_VISUALS = {
  mathematics: { icon: '🔢', accent: 'Nombres · Operations · Tables' },
  french: { icon: '✍️', accent: 'Vocabulaire · Phrases · Recits' },
  dutch: { icon: '🗣️', accent: 'Mots · Phrases · Lecture' },
  english: { icon: '🌍', accent: 'Words · Sentences · Reading' },
  spanish: { icon: '🌞', accent: 'Palabras · Frases · Lectura' },
  reasoning: { icon: '🧩', accent: 'Suites · Logique · Strategie' },
  stories: { icon: '📖', accent: 'Mini recits · Questions · Lecture' }
};

function getSubjectTileData(subject, progress) {
  const activities = getActivitiesBySubject(subject.id).filter((activity) =>
    activity.gradeBand?.some((gradeId) => gradeId === 'P2' || gradeId === 'P3')
  );
  const completed = activities.filter((activity) => progress.activities[activity.id]?.completed).length;
  const total = activities.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const grades = getGradeProgression(subject.id).filter((entry) => entry.gradeId === 'P2' || entry.gradeId === 'P3');
  const previewModules = grades.flatMap((grade) => grade.modules.map((module) => module.title)).slice(0, 4);

  return {
    completed,
    total,
    percent,
    grades,
    previewModules
  };
}

export default function SubjectsHubPage() {
  const { locale, t } = useLocale();
  const progress = getProgressSnapshot();

  return (
    <div className="page-stack page-stack--compact" data-testid="subjects-page">
      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{t('subjectsLabel') || 'Subjects'}</span>
            <h2>{t('chooseUniverse')}</h2>
          </div>
        </div>

        <div className="subject-grid subject-grid--compact">
          {subjects
            .filter((subject) => subject.grades.includes('P2') || subject.grades.includes('P3'))
            .map((subject) => {
              const tileData = getSubjectTileData(subject, progress);
              const visual = SUBJECT_VISUALS[subject.id] || { icon: '🎮', accent: getSubjectRoadmap(subject, locale)[0] || '' };

              return (
                <article
                  key={subject.id}
                  className="subject-tile subject-tile--rich"
                  style={{ '--subject-accent': subject.accent }}
                  data-testid={`subject-tile-${subject.id}`}
                >
                  <div className="subject-tile__hero">
                    <span className="subject-tile__icon" aria-hidden="true">{visual.icon}</span>
                    <div>
                      <strong>{getSubjectLabel(subject, locale, t)}</strong>
                      <small>{visual.accent}</small>
                    </div>
                  </div>

                  <span>{getSubjectDescription(subject, locale)}</span>
                  <small>{subject.grades.filter((gradeId) => gradeId === 'P2' || gradeId === 'P3').join(' - ')}</small>

                  <div className="grade-map__progress">
                    <i style={{ width: `${Math.max(tileData.percent, tileData.completed ? 10 : 0)}%`, background: subject.color }}></i>
                  </div>

                  <div className="detail-list">
                    <div className="detail-list__row">
                      <span>{t('progression')}</span>
                      <strong>{tileData.completed}/{tileData.total || 0}</strong>
                    </div>
                    <div className="detail-list__row">
                      <span>Modules visibles</span>
                      <strong>{tileData.grades.reduce((sum, grade) => sum + grade.modules.length, 0)}</strong>
                    </div>
                  </div>

                  {tileData.previewModules.length ? (
                    <div className="grade-map__preview">
                      {tileData.previewModules.map((title) => (
                        <span key={title} className="tag-chip tag-chip--static">{title}</span>
                      ))}
                    </div>
                  ) : null}

                  <div className="dashboard-actions">
                    <Link className="primary-action" to={`/subjects/${subject.id}`} data-testid={`subject-launch-${subject.id}`}>
                      <span className="button-icon" aria-hidden="true">📘</span>
                      <span>{t('launch')}</span>
                    </Link>
                    {tileData.grades.map((grade) => (
                      <Link
                        key={grade.gradeId}
                        className="secondary-action"
                        to={`/subjects/${subject.id}/grades/${grade.gradeId}`}
                        data-testid={`subject-grade-direct-${subject.id}-${grade.gradeId}`}
                      >
                        <span className="button-icon" aria-hidden="true">🎯</span>
                        <span>{grade.gradeId}</span>
                      </Link>
                    ))}
                  </div>
                </article>
              );
            })}
        </div>
      </section>
    </div>
  );
}
