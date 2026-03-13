import { Link, useParams } from 'react-router-dom';
import { getActivitiesBySubjectAndGrade, getModulesBySubjectAndGrade, getSubjectById } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectLabel } from '../../shared/i18n/contentLocalization.js';

export default function GradePage() {
  const { subjectId, gradeId } = useParams();
  const { locale, t } = useLocale();
  const subject = getSubjectById(subjectId);
  const modules = getModulesBySubjectAndGrade(subjectId, gradeId);
  const gradeActivities = getActivitiesBySubjectAndGrade(subjectId, gradeId);

  if (!subject) {
    return (
      <section className="panel panel--tight">
        <h2>{t('subjectNotFound')}</h2>
      </section>
    );
  }

  const groupedModules = modules.reduce((accumulator, module) => {
    const key = module.domainLabel || module.domainId;
    const current = accumulator[key] || [];
    current.push(module);
    accumulator[key] = current;
    return accumulator;
  }, {});

  return (
    <div className="page-stack page-stack--compact">
      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{gradeId}</span>
            <h2>{getSubjectLabel(subject, locale, t)}</h2>
          </div>
          <Link className="text-link" to={`/subjects/${subjectId}`}>{t('back')}</Link>
        </div>
        <p className="panel__copy">
          {modules.length ? `${modules.length} modules jouables` : `${gradeActivities.length} activites jouables`}
        </p>
      </section>

      {modules.length ? Object.entries(groupedModules).map(([domain, domainModules]) => (
        <section key={domain} className="panel panel--tight">
          <div className="panel__header">
            <div>
              <span className="eyebrow">{gradeId}</span>
              <h3>{domain}</h3>
            </div>
          </div>
          <div className="module-grid-compact">
            {domainModules.map((module) => (
              <article key={module.id} className="module-card-compact">
                <strong>{module.title}</strong>
                <p>{module.summary}</p>
                <small>
                  {(module.phases.guidedPractice?.length || 0) + (module.phases.independentPractice?.length || 0)} activities
                </small>
                <Link className="primary-action" to={`/subjects/${subjectId}/grades/${gradeId}/modules/${module.id}`}>
                  {t('launch')}
                </Link>
              </article>
            ))}
          </div>
        </section>
      )) : (
        <section className="panel panel--tight">
          <div className="panel__header">
            <div>
              <span className="eyebrow">{gradeId}</span>
              <h3>{t('generatedLabel')}</h3>
            </div>
          </div>
          <div className="module-grid-compact">
            {gradeActivities.map((activity) => (
              <article key={activity.id} className="module-card-compact">
                <strong>{activity.title}</strong>
                <p>{activity.instructions}</p>
                <small>{activity.estimatedDurationMin} min</small>
                <Link className="primary-action" to={`/activities/${activity.id}`}>
                  {t('launch')}
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
