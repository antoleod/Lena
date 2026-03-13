import { Link, useParams } from 'react-router-dom';
import { getActivitiesBySubject, getSubjectById } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectDescription, getSubjectLabel, getSubjectRoadmap } from '../../shared/i18n/contentLocalization.js';

export default function SubjectPage() {
  const { locale, t } = useLocale();
  const { subjectId } = useParams();
  const subject = getSubjectById(subjectId);
  const activities = getActivitiesBySubject(subjectId);

  if (!subject) {
    return (
      <section className="section-block">
        <h2>{t('subjectNotFound')}</h2>
        <Link className="text-link" to="/">{t('backHome')}</Link>
      </section>
    );
  }

  return (
    <div className="page-stack">
      <section
        className="subject-hero"
        style={{ '--subject-color': subject.color, '--subject-accent': subject.accent }}
      >
        <div>
          <span className="eyebrow">{subject.grades.join(' • ')}</span>
          <h2>{getSubjectLabel(subject, locale, t)}</h2>
          <p>{getSubjectDescription(subject, locale)}</p>
        </div>
        <div className="subject-hero__panel">
          <span className="pill">{t('subjectJourney')}</span>
          <ul className="roadmap-list">
            {getSubjectRoadmap(subject, locale).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{t('missions')}</span>
            <h3>{t('chooseLevel')}</h3>
          </div>
        </div>
        <div className="activity-list">
          {activities.map((activity) => (
            <article key={activity.id} className="activity-row">
              <div>
                <div className="preview-meta">
                  <span>{activity.subskill}</span>
                  <span>{activity.gradeBand.join(' • ')}</span>
                  <span>{activity.originRepo}</span>
                </div>
                <h4>{activity.title}</h4>
                <p>{activity.instructions}</p>
              </div>
              <div className="activity-row__meta">
                <span>{activity.estimatedDurationMin} min</span>
                <Link className="primary-action" to={`/activities/${activity.id}`}>{t('launch')}</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
