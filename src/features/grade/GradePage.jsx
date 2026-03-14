import { Link, useParams } from 'react-router-dom';
import { getSubjectById } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectLabel } from '../../shared/i18n/contentLocalization.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';
import { getGradeJourney } from '../../shared/gameplay/moduleJourney.js';

export default function GradePage() {
  const { subjectId, gradeId } = useParams();
  const { locale, t } = useLocale();
  const subject = getSubjectById(subjectId);
  const progress = getProgressSnapshot();
  const gradeOptions = ['P2', 'P3'].filter((entry) => subject?.grades?.includes(entry));
  const gradeJourney = getGradeJourney(subjectId, gradeId, {
    guided: t('practiceMode'),
    independent: t('continueStep'),
    challenge: t('missionChallengeLabel'),
    exam: t('missionExamLabel'),
    review: t('reinforceLabel')
  });
  const modules = gradeJourney.modules;
  const gradeActivities = gradeJourney.standaloneActivities;

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

  const moduleActivityIds = new Set(
    gradeJourney.moduleJourneys.flatMap((journey) => journey.activities.map((activity) => activity.id))
  );
  const bonusActivities = gradeActivities.filter((activity) => !moduleActivityIds.has(activity.id));

  const totalJourneyActivities = gradeJourney.moduleJourneys.reduce((sum, journey) => sum + journey.activities.length, 0);
  const completedModules = gradeJourney.moduleJourneys.filter((journey) => {
    const total = journey.activities.length;
    const done = journey.activities.filter((activity) => progress.activities[activity.id]?.completed).length;
    return total > 0 && done >= total;
  }).length;

  return (
    <div className="page-stack page-stack--compact" data-testid={`grade-page-${subjectId}-${gradeId}`}>
      <section className="panel panel--tight panel--subject-map">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{gradeId}</span>
            <h2>{getSubjectLabel(subject, locale, t)}</h2>
          </div>
          <Link className="text-link" to={`/subjects/${subjectId}`}>{t('back')}</Link>
        </div>

        <div className="tag-list">
          {gradeOptions.map((entry) => (
            entry === gradeId ? (
              <span key={entry} className="tag-chip tag-chip--static">
                {entry}
              </span>
            ) : (
              <Link
                key={entry}
                className="tag-chip"
                to={`/subjects/${subjectId}/grades/${entry}`}
              >
                {entry}
              </Link>
            )
          ))}
        </div>

        <p className="panel__copy">
          {modules.length
            ? `${modules.length} ${t('playableModulesLabel')}`
            : `${gradeActivities.length} ${t('generatedLabel').toLowerCase()}`}
        </p>

        <div className="mini-metrics">
          <div><span>{t('completed')}</span><strong>{completedModules}/{modules.length || 0}</strong></div>
          <div><span>{t('exercise')}</span><strong>{totalJourneyActivities || gradeActivities.length}</strong></div>
          <div><span>{t('classes')}</span><strong>{gradeId}</strong></div>
        </div>
      </section>

      {modules.length ? Object.entries(groupedModules).map(([domain, domainModules], domainIndex) => (
        <section key={domain} className="panel panel--tight" data-testid={`grade-domain-${domainIndex}`}>
          <div className="panel__header">
            <div>
              <span className="eyebrow">{gradeId}</span>
              <h3>{domain}</h3>
            </div>
          </div>
          <div className="module-lane">
            {domainModules.map((module, index) => {
              const journey = gradeJourney.moduleJourneys.find((entry) => entry.module.id === module.id);
              const totalActivities = journey?.activities.length || 0;
              const relatedDone = (journey?.activities || []).filter((activity) => progress.activities[activity.id]?.completed).length;
              const progressPercent = totalActivities ? Math.round((relatedDone / totalActivities) * 100) : 0;

              return (
                <article key={module.id} className="module-lane__card" style={{ animationDelay: `${(domainIndex * 2 + index) * 80}ms` }} data-testid={`module-card-${module.id}`}>
                  <div className="module-lane__card-head">
                    <div>
                      <small>{module.domainLabel || domain}</small>
                      <strong>{module.title}</strong>
                      <p>{module.summary}</p>
                    </div>
                    <span className="pill">{relatedDone}/{totalActivities || 0}</span>
                  </div>

                  <div className="grade-map__progress">
                    <i style={{ width: `${Math.max(progressPercent, relatedDone ? 12 : 0)}%` }}></i>
                  </div>

                  <div className="tag-list">
                    {(journey?.stages || []).map((stage) => (
                      <span key={stage.id} className="tag-chip tag-chip--static">
                        {stage.title} · {stage.activities.length}
                      </span>
                    ))}
                  </div>

                  <div className="module-lane__footer">
                    <small>{progressPercent}% · {totalActivities} {t('exercise').toLowerCase()}</small>
                    <Link className="primary-action" to={`/subjects/${subjectId}/grades/${gradeId}/modules/${module.id}`} data-testid={`module-launch-${module.id}`}>
                      <span className="button-icon" aria-hidden="true">🎯</span>
                      <span>{t('launch')}</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )) : null}

      {bonusActivities.length ? (
        <section className="panel panel--tight" data-testid={`bonus-activities-${subjectId}-${gradeId}`}>
          <div className="panel__header">
            <div>
              <span className="eyebrow">{gradeId}</span>
              <h3>Ateliers bonus</h3>
            </div>
          </div>
          <div className="module-lane">
            {bonusActivities.map((activity, index) => (
              <article key={activity.id} className="module-lane__card" style={{ animationDelay: `${index * 60}ms` }} data-testid={`bonus-activity-${activity.id}`}>
                <div className="module-lane__card-head">
                  <div>
                    <strong>{activity.title}</strong>
                    <p>{activity.instructions}</p>
                  </div>
                  <span className="pill">{activity.estimatedDurationMin} min</span>
                </div>
                <div className="module-lane__footer">
                  <small>{activity.subskill || activity.subject}</small>
                  <Link className="primary-action" to={`/activities/${activity.id}`} data-testid={`bonus-launch-${activity.id}`}>
                    <span className="button-icon" aria-hidden="true">▶</span>
                    <span>{t('launch')}</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {!modules.length && gradeActivities.length ? (
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
                <div className="module-lane__footer">
                  <small>{t('generatedExercisesLabel')}</small>
                  <Link className="primary-action" to={`/activities/${activity.id}`}>
                    <span className="button-icon" aria-hidden="true">🎯</span>
                    <span>{t('launch')}</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {!modules.length && !gradeActivities.length ? (
        <section className="panel panel--tight">
          <div className="panel__header">
            <div>
              <span className="eyebrow">{gradeId}</span>
              <h3>{t('startAdventure')}</h3>
            </div>
          </div>
          <div className="dashboard-actions">
            <Link className="primary-action" to="/map">
              <span className="button-icon" aria-hidden="true">🗺</span>
              <span>{t('startAdventure')}</span>
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
