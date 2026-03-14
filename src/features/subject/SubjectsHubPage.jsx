import { Link } from 'react-router-dom';
import { getActivitiesBySubject, subjects } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectDescription, getSubjectLabel } from '../../shared/i18n/contentLocalization.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';

export default function SubjectsHubPage() {
  const { locale, t } = useLocale();
  const progress = getProgressSnapshot();

  return (
    <div className="page-stack page-stack--compact">
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
              const activities = getActivitiesBySubject(subject.id).filter((activity) =>
                activity.gradeBand?.some((gradeId) => gradeId === 'P2' || gradeId === 'P3')
              );
              const completed = activities.filter((activity) => progress.activities[activity.id]?.completed).length;
              const total = activities.length;
              const percent = total ? Math.round((completed / total) * 100) : 0;

              return (
                <article
                  key={subject.id}
                  className="subject-tile"
                  style={{ '--subject-accent': subject.accent }}
                >
                  <strong>{getSubjectLabel(subject, locale, t)}</strong>
                  <span>{getSubjectDescription(subject, locale)}</span>
                  <small>{subject.grades.filter((gradeId) => gradeId === 'P2' || gradeId === 'P3').join(' - ')}</small>

                  <div className="grade-map__progress">
                    <i style={{ width: `${Math.max(percent, completed ? 10 : 0)}%`, background: subject.color }}></i>
                  </div>

                  <div className="detail-list">
                    <div className="detail-list__row">
                      <span>{t('progression')}</span>
                      <strong>{completed}/{total || 0}</strong>
                    </div>
                  </div>

                  <Link className="primary-action" to={`/subjects/${subject.id}`}>
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
