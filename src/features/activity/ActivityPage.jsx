import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getActivityById, getModuleById, getSubjectById } from '../curriculum/catalog.js';
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
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('module');
  const { activityId } = useParams();
  const baseActivity = getActivityById(activityId);
  const progress = baseActivity ? getActivityProgress(baseActivity.id) : null;
  const module = moduleId ? getModuleById(moduleId) : null;
  const [activity, setActivity] = useState(() => (
    baseActivity ? materializeActivity(baseActivity, progress) : null
  ));
  const [lastReward, setLastReward] = useState(0);

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
    const reward = rewardActivityCompletion(activity.id, result);
    setLastReward(reward.awarded);
  }

  return (
    <div className="page-stack">
      <section className="activity-shell activity-shell--focused">
        <header className="activity-header">
          <div className="activity-header__left">
            <Link className="text-link" to={module ? `/subjects/${module.subjectId}/grades/${module.gradeId}/modules/${module.id}` : `/subjects/${activity.subject}`}>
              ← {module ? module.title : t('backSubject')}
            </Link>
            <span className="pill">{subject ? getSubjectLabel(subject, locale, t) : ''}</span>
            <h2>{activity.title}</h2>
            <p>{activity.instructions}</p>
          </div>
          <div className="activity-header__right">
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
                <span>{t('mode')}</span>
                <strong>{activity.generated ? `${t('generatedMode')} ${activity.resolvedDifficulty}` : activity.engineType}</strong>
              </div>
            </div>
          </div>
        </header>
        <div className="activity-engine">
          {renderEngine(activity, progress, handleComplete)}
        </div>
      </section>
      <section className="context-footer">
        <div className="context-footer__item">
          <span>{t('level')}</span>
          <strong>{module?.gradeId || activity.gradeBand[0]}</strong>
        </div>
        <div className="context-footer__item">
          <span>{t('duration')}</span>
          <strong>{activity.estimatedDurationMin} min</strong>
        </div>
        <div className="context-footer__item">
          <span>{t('mode')}</span>
          <strong>{activity.generated ? t('generatedMode') : activity.engineType}</strong>
        </div>
        <div className="context-footer__item">
          <span>{t('hints')}</span>
          <strong>{activity.hints[0]}</strong>
        </div>
        <div className="context-footer__item">
          <span>{t('scoreSaved')}</span>
          <strong>{progress?.bestScore || 0}</strong>
        </div>
        <div className="context-footer__item">
          <span>{t('crystals')}</span>
          <strong>+{lastReward}</strong>
        </div>
        <div className="context-footer__item">
          <span>Bloc</span>
          <strong>{module ? module.title : activity.subskill}</strong>
        </div>
      </section>
    </div>
  );
}
