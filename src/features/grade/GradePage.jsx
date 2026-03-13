import { Link, useParams } from 'react-router-dom';
import { getActivitiesBySubjectAndGrade, getModulesBySubjectAndGrade, getSubjectById } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectLabel } from '../../shared/i18n/contentLocalization.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';

function buildLevelPreview(module, subjectId, gradeId) {
  return Array.from({ length: 10 }, (_, index) => ({
    id: `${module.id}-${index + 1}`,
    label: index + 1,
    to: `/subjects/${subjectId}/grades/${gradeId}/modules/${module.id}`,
    status: index === 0 ? 'active' : 'available'
  }));
}

export default function GradePage() {
  const { subjectId, gradeId } = useParams();
  const { locale, t } = useLocale();
  const subject = getSubjectById(subjectId);
  const modules = getModulesBySubjectAndGrade(subjectId, gradeId);
  const gradeActivities = getActivitiesBySubjectAndGrade(subjectId, gradeId);
  const progress = getProgressSnapshot();

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
      <section className="panel panel--tight panel--subject-map">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{gradeId}</span>
            <h2>{getSubjectLabel(subject, locale, t)}</h2>
          </div>
          <Link className="text-link" to={`/subjects/${subjectId}`}>{t('back')}</Link>
        </div>
        <p className="panel__copy">
          {modules.length ? `${modules.length} ${t('playableModulesLabel')}` : `${gradeActivities.length} ${t('generatedLabel').toLowerCase()}`}
        </p>
      </section>

      {modules.length ? Object.entries(groupedModules).map(([domain, domainModules], domainIndex) => (
        <section key={domain} className="panel panel--tight">
          <div className="panel__header">
            <div>
              <span className="eyebrow">{gradeId}</span>
              <h3>{domain}</h3>
            </div>
          </div>
          <div className="module-lane">
            {domainModules.map((module, index) => {
              const relatedDone = (module.phases.guidedPractice || [])
                .concat(module.phases.independentPractice || [])
                .filter((activityId) => progress.activities[activityId]?.completed).length;
              const preview = buildLevelPreview(module, subjectId, gradeId);

              return (
                <article key={module.id} className="module-lane__card" style={{ animationDelay: `${(domainIndex * 2 + index) * 80}ms` }}>
                  <div className="module-lane__card-head">
                    <div>
                      <strong>{module.title}</strong>
                      <p>{module.summary}</p>
                    </div>
                    <span className="pill">{relatedDone} {t('completed').toLowerCase()}</span>
                  </div>
                  <div className="module-lane__levels">
                    {preview.map((level) => (
                      <Link key={level.id} className={`module-level-dot module-level-dot--${level.status}`} to={level.to}>
                        {level.label}
                      </Link>
                    ))}
                  </div>
                  <div className="module-lane__footer">
                    <small>{t('levelsSummaryLabel')}</small>
                    <Link className="primary-action" to={`/subjects/${subjectId}/grades/${gradeId}/modules/${module.id}`}>
                      {t('launch')}
                    </Link>
                  </div>
                </article>
              );
            })}
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
          <div className="module-lane">
            {gradeActivities.map((activity, index) => (
              <article key={activity.id} className="module-lane__card" style={{ animationDelay: `${index * 80}ms` }}>
                <div className="module-lane__card-head">
                  <div>
                    <strong>{activity.title}</strong>
                    <p>{activity.instructions}</p>
                  </div>
                  <span className="pill">{activity.estimatedDurationMin} min</span>
                </div>
                <div className="module-lane__levels">
                  {Array.from({ length: 10 }, (_, levelIndex) => (
                    <Link key={`${activity.id}-${levelIndex + 1}`} className="module-level-dot module-level-dot--available" to={`/activities/${activity.id}`}>
                      {levelIndex + 1}
                    </Link>
                  ))}
                </div>
                <div className="module-lane__footer">
                  <small>{t('generatedExercisesLabel')}</small>
                  <Link className="primary-action" to={`/activities/${activity.id}`}>
                    {t('launch')}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
