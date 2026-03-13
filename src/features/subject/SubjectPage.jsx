import { Link, useParams } from 'react-router-dom';
import { activities, getGradeProgression, getSubjectById } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectDescription, getSubjectLabel, getSubjectRoadmap } from '../../shared/i18n/contentLocalization.js';

export default function SubjectPage() {
  const { locale, t } = useLocale();
  const { subjectId } = useParams();
  const subject = getSubjectById(subjectId);
  const gradeProgression = getGradeProgression(subjectId);

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
    return {
      gradeId,
      modules: gradeEntry?.modules || [],
      activities: activityList
    };
  }).filter((entry) => entry.activities.length || entry.modules.length);

  return (
    <div className="page-stack page-stack--compact">
      <section className="panel panel--tight" style={{ '--subject-accent': subject.accent }}>
        <div className="panel__header">
          <div>
            <span className="eyebrow">{subject.grades.join(' / ')}</span>
            <h2>{getSubjectLabel(subject, locale, t)}</h2>
          </div>
          <Link className="text-link" to="/subjects">{t('subjectsLabel') || 'Subjects'}</Link>
        </div>
        <p className="panel__copy">{getSubjectDescription(subject, locale)}</p>
        <div className="tag-list">
          {getSubjectRoadmap(subject, locale).map((item) => (
            <span key={item} className="tag-chip tag-chip--static">{item}</span>
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
        <div className="grade-row-list">
          {grades.map((grade) => {
            const launchTo = grade.modules.length
              ? `/subjects/${subjectId}/grades/${grade.gradeId}`
              : `/activities/${grade.activities[0].id}`;

            return (
              <article key={grade.gradeId} className="grade-row-card">
                <div>
                  <strong>{grade.gradeId}</strong>
                  <span>{grade.modules.length ? `${grade.modules.length} modules` : `${grade.activities.length} activities`}</span>
                </div>
                <small>{grade.activities.slice(0, 3).map((activity) => activity.title).join(' · ')}</small>
                <Link className="primary-action" to={launchTo}>{t('launch')}</Link>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
