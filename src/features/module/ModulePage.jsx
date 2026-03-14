import { Link, useParams } from 'react-router-dom';
import { getModuleById, getSubjectById } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectLabel } from '../../shared/i18n/contentLocalization.js';
import { getModuleJourney } from '../../shared/gameplay/moduleJourney.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';

function getStageStatus(stage, progress) {
  const total = stage.activities.length;
  const completed = stage.activities.filter((activity) => progress.activities[activity.id]?.completed).length;

  if (!completed) {
    return { total, completed, state: 'available' };
  }
  if (completed >= total) {
    return { total, completed, state: 'completed' };
  }
  return { total, completed, state: 'in-progress' };
}

function getResumeActivity(activities, progress) {
  return activities.find((activity) => !progress.activities[activity.id]?.completed) || activities[0] || null;
}

export default function ModulePage() {
  const { locale, t } = useLocale();
  const { subjectId, gradeId, moduleId } = useParams();
  const subject = getSubjectById(subjectId);
  const module = getModuleById(moduleId);
  const progress = getProgressSnapshot();

  if (!subject || !module) {
    return (
      <section className="panel panel--tight">
        <h2>{t('activityNotFound')}</h2>
      </section>
    );
  }

  const journey = getModuleJourney(module, {
    guided: t('practiceMode'),
    independent: t('continueStep'),
    challenge: t('missionChallengeLabel'),
    exam: t('missionExamLabel'),
    review: t('reinforceLabel')
  });

  const totalActivities = journey.activities.length;
  const completedActivities = journey.activities.filter((activity) => progress.activities[activity.id]?.completed).length;
  const progressPercent = totalActivities ? Math.round((completedActivities / totalActivities) * 100) : 0;
  const resumeActivity = getResumeActivity(journey.activities, progress);
  const primaryLabel = completedActivities > 0 ? t('continue') : t('startAdventure');

  return (
    <div className="page-stack page-stack--compact">
      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{gradeId} / {module.domainLabel}</span>
            <h2>{module.title}</h2>
          </div>
          <span className="pill">{getSubjectLabel(subject, locale, t)}</span>
        </div>

        <p className="panel__copy">{module.summary}</p>

        <div className="detail-list">
          <div className="detail-list__row">
            <span>{t('goalLabel')}</span>
            <strong>{module.phases.introduction}</strong>
          </div>
          <div className="detail-list__row">
            <span>{t('progression')}</span>
            <strong>{completedActivities}/{totalActivities || 0}</strong>
          </div>
        </div>

        {module.phases.demonstration ? (
          <div className="feedback-strip">
            <strong>{t('hint')}</strong>
            <span>{module.phases.demonstration}</span>
          </div>
        ) : null}

        <div className="grade-map__progress">
          <i style={{ width: `${Math.max(progressPercent, completedActivities ? 12 : 0)}%` }}></i>
        </div>

        <div className="dashboard-actions">
          {resumeActivity ? (
            <Link className="primary-action" to={`/activities/${resumeActivity.id}?module=${module.id}`}>
              <span className="button-icon" aria-hidden="true">{completedActivities > 0 ? '▶' : '✨'}</span>
              <span>{primaryLabel}</span>
            </Link>
          ) : null}
          <Link className="secondary-action" to={`/subjects/${subjectId}/grades/${gradeId}`}>
            <span className="button-icon" aria-hidden="true">↩</span>
            <span>{t('back')}</span>
          </Link>
        </div>
      </section>

      {journey.stages.map((stage) => {
        const status = getStageStatus(stage, progress);
        const nextActivity = getResumeActivity(stage.activities, progress);
        const stateLabel = status.state === 'completed'
          ? t('completed')
          : status.state === 'in-progress'
            ? t('continue')
            : t('start');

        return (
          <section key={stage.id} className="panel panel--tight">
            <div className="panel__header">
              <div>
                <span className="eyebrow">{module.domainLabel}</span>
                <h3>{stage.title}</h3>
              </div>
              <span className="pill">{status.completed}/{status.total}</span>
            </div>

            <div className="detail-list">
              <div className="detail-list__row">
                <span>{t('exercise')}</span>
                <strong>{stage.activities.map((activity) => activity.title).join(' · ')}</strong>
              </div>
              <div className="detail-list__row">
                <span>{t('progression')}</span>
                <strong>{stateLabel}</strong>
              </div>
            </div>

            <div className="grade-map__progress">
              <i style={{ width: `${status.total ? Math.max(Math.round((status.completed / status.total) * 100), status.completed ? 14 : 0) : 0}%` }}></i>
            </div>

            {nextActivity ? (
              <div className="module-lane__footer">
                <small>{nextActivity.estimatedDurationMin} min</small>
                <Link className="primary-action" to={`/activities/${nextActivity.id}?module=${module.id}`}>
                  <span className="button-icon" aria-hidden="true">{status.completed >= status.total ? '🔁' : '▶'}</span>
                  <span>{status.completed >= status.total ? t('launch') : stateLabel}</span>
                </Link>
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
