import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getActivityById, getSubjectById } from '../curriculum/catalog.js';
import { getActivityProgress, saveActivityProgress } from '../../services/storage/progressStore.js';
import { rewardActivityCompletion } from '../../services/storage/rewardStore.js';
import { materializeActivity } from '../../engines/generators/activityFactory.js';
import MultipleChoiceActivity from '../../engines/multiple-choice/MultipleChoiceActivity.jsx';
import BaseTenActivity from '../../engines/base-ten/BaseTenActivity.jsx';
import StoryActivity from '../../engines/story/StoryActivity.jsx';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectLabel } from '../../shared/i18n/contentLocalization.js';

function renderEngine(activity, progress, onComplete) {
  if (activity.engineType === 'base-ten') {
    return <BaseTenActivity activity={activity} progress={progress} onComplete={onComplete} />;
  }

  if (activity.engineType === 'story') {
    return <StoryActivity activity={activity} progress={progress} onComplete={onComplete} />;
  }

  return <MultipleChoiceActivity activity={activity} progress={progress} onComplete={onComplete} />;
}

export default function ActivityPage() {
  const { locale, t } = useLocale();
  const { activityId } = useParams();
  const baseActivity = getActivityById(activityId);
  const progress = baseActivity ? getActivityProgress(baseActivity.id) : null;
  const [activity, setActivity] = useState(() => (
    baseActivity ? materializeActivity(baseActivity, progress) : null
  ));

  useEffect(() => {
    if (!baseActivity) {
      setActivity(null);
      return;
    }

    setActivity(materializeActivity(baseActivity, getActivityProgress(baseActivity.id)));
  }, [activityId]);

  if (!activity || !baseActivity) {
    return (
      <section className="section-block">
        <h2>{t('activityNotFound')}</h2>
        <Link className="text-link" to="/">{t('backHome')}</Link>
      </section>
    );
  }

  const subject = getSubjectById(activity.subject);

  function handleComplete(result) {
    saveActivityProgress(activity.id, result);
    rewardActivityCompletion(activity.id, result);
  }

  return (
    <div className="page-stack">
      <section className="activity-shell">
        <aside className="activity-sidebar">
          <Link className="text-link" to={`/subjects/${activity.subject}`}>← {t('backSubject')}</Link>
          <span className="pill">{subject ? getSubjectLabel(subject, locale, t) : ''}</span>
          <h2>{activity.title}</h2>
          <p>{activity.instructions}</p>
          <div className="meta-stack">
            <div className="meta-card">
              <span>{t('level')}</span>
              <strong>{activity.gradeBand.join(' • ')}</strong>
            </div>
            <div className="meta-card">
              <span>{t('duration')}</span>
              <strong>{activity.estimatedDurationMin} min</strong>
            </div>
            <div className="meta-card">
              <span>{t('origin')}</span>
              <strong>{activity.originRepo}</strong>
            </div>
            <div className="meta-card">
              <span>{t('progression')}</span>
              <strong>{progress?.completed ? t('completed') : t('inProgress')}</strong>
            </div>
            {activity.generated ? (
              <div className="meta-card">
                <span>{t('mode')}</span>
                <strong>{t('generatedMode')} {activity.resolvedDifficulty}</strong>
              </div>
            ) : null}
          </div>
          <div className="tips-panel">
            <strong>{t('hints')}</strong>
            <ul className="roadmap-list">
              {activity.hints.map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ul>
          </div>
        </aside>
        <div className="activity-engine">
          {renderEngine(activity, progress, handleComplete)}
        </div>
      </section>
    </div>
  );
}
