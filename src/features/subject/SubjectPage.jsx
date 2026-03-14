import { Link, useParams } from 'react-router-dom';
import { activities, getGradeProgression, getSubjectById } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectDescription, getSubjectLabel, getSubjectRoadmap } from '../../shared/i18n/contentLocalization.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';

function getGradeStats(subjectId, grade, progress) {
  const gradeActivities = activities.filter((activity) => activity.subject === subjectId && activity.gradeBand.includes(grade.gradeId));
  const completed = gradeActivities.filter((activity) => progress.activities[activity.id]?.completed).length;
  const percent = gradeActivities.length ? Math.round((completed / gradeActivities.length) * 100) : 0;
  return {
    totalActivities: gradeActivities.length,
    completed,
    percent
  };
}

export default function SubjectPage() {
  const { locale, t } = useLocale();
  const { subjectId } = useParams();
  const subject = getSubjectById(subjectId);
  const gradeProgression = getGradeProgression(subjectId);
  const progress = getProgressSnapshot();

  if (!subject) {
    return (
      <section className="panel panel--tight">
        <h2>{t('subjectNotFound')}</h2>
        <Link className="text-link" to="/">{t('backHome')}</Link>
      </section>
    );
  }

  const grades = subject.grades.map((gradeId) => {
    const activityList = activities.filter((activity) => activity.subject === subjectId && activity.gradeBand.includes(gradeId));
    const gradeEntry = gradeProgression.find((entry) => entry.gradeId === gradeId);
    const grade = {
      gradeId,
      modules: gradeEntry?.modules || [],
      activities: activityList
    };
    return {
      ...grade,
      stats: getGradeStats(subjectId, grade, progress)
    };
  }).filter((entry) => (entry.gradeId === 'P2' || entry.gradeId === 'P3') && (entry.activities.length || entry.modules.length));

  return (
    <div className="page-stack page-stack--compact">
      <section className="panel panel--tight panel--subject-map" style={{ '--subject-accent': subject.accent, '--subject-color': subject.color }}>
        <div className="panel__header">
          <div>
            <span className="eyebrow">P2 / P3</span>
            <h2>{getSubjectLabel(subject, locale, t)}</h2>
          </div>
          <Link className="text-link" to="/subjects">{t('subjectsLabel') || 'Subjects'}</Link>
        </div>
        <p className="panel__copy">{getSubjectDescription(subject, locale)}</p>
        <div className="subject-road-strip">
          {getSubjectRoadmap(subject, locale).map((item, index) => (
            <div key={item} className="subject-road-strip__item" style={{ animationDelay: `${index * 80}ms` }}>
              <span>{index + 1}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{t('classes')}</span>
            <h3>{t('chooseLevel')}</h3>
          </div>
        </div>
        {!grades.length ? (
          <div className="dashboard-actions">
            <Link className="primary-action" to="/map">
              <span className="button-icon" aria-hidden="true">🗺</span>
              <span>{t('startAdventure')}</span>
            </Link>
          </div>
        ) : null}
        <div className="grade-map">
          {grades.map((grade, index) => {
            const launchTo = grade.modules.length
              ? `/subjects/${subjectId}/grades/${grade.gradeId}`
              : `/activities/${grade.activities[0].id}`;

            return (
              <article key={grade.gradeId} className="grade-map__node" style={{ animationDelay: `${index * 90}ms` }}>
                <div className="grade-map__node-head">
                  <strong>{grade.gradeId}</strong>
                  <span>{grade.modules.length ? `${grade.modules.length} modules` : `${grade.activities.length} activities`}</span>
                </div>
                <div className="grade-map__progress">
                  <i style={{ width: `${Math.max(grade.stats.percent, grade.activities.length ? 8 : 0)}%` }}></i>
                </div>
                <div className="grade-map__meta">
                  <small>{grade.stats.completed}/{grade.stats.totalActivities} done</small>
                  <small>{grade.stats.percent}%</small>
                </div>
                <div className="grade-map__preview">
                  {grade.activities.slice(0, 4).map((activity) => (
                    <span key={activity.id} className="tag-chip tag-chip--static">{activity.title}</span>
                  ))}
                </div>
                <Link className="primary-action" to={launchTo}>
                  <span className="button-icon" aria-hidden="true">📘</span>
                  <span>{t('launch')}</span>
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
