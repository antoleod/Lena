import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getActivityById, getSubjectById } from '../curriculum/catalog.js';
import { getActivityProgress, saveActivityProgress } from '../../services/storage/progressStore.js';
import { rewardActivityCompletion } from '../../services/storage/rewardStore.js';
import { materializeActivity } from '../../engines/generators/activityFactory.js';
import MultipleChoiceActivity from '../../engines/multiple-choice/MultipleChoiceActivity.jsx';
import BaseTenActivity from '../../engines/base-ten/BaseTenActivity.jsx';
import StoryActivity from '../../engines/story/StoryActivity.jsx';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectLabel } from '../../shared/i18n/contentLocalization.js';
import { getMission, getWorldById } from '../../shared/gameplay/worldMap.js';
import { trackStudySession } from '../../services/storage/profileStore.js';

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
  const { activityId } = useParams();
  const worldId = searchParams.get('world');
  const missionId = searchParams.get('mission');
  const level = searchParams.get('level');
  const world = worldId ? getWorldById(worldId) : null;
  const mission = worldId && missionId ? getMission(worldId, missionId) : null;

  const baseActivity = getActivityById(activityId);
  const storedProgress = baseActivity ? getActivityProgress(baseActivity.id) : null;
  const [activity, setActivity] = useState(() => (
    baseActivity ? materializeActivity(baseActivity, storedProgress) : null
  ));
  const [resultState, setResultState] = useState({ crystals: 0, score: 0 });

  useEffect(() => {
    if (!baseActivity) {
      setActivity(null);
      return;
    }
    setActivity(materializeActivity(baseActivity, getActivityProgress(baseActivity.id)));
  }, [activityId, baseActivity]);

  const progress = useMemo(() => (baseActivity ? getActivityProgress(baseActivity.id) : null), [baseActivity, resultState.score]);

  if (!activity || !baseActivity) {
    return (
      <section className="panel panel--tight">
        <h2>{t('activityNotFound')}</h2>
        <Link className="text-link" to="/map">{t('backHome')}</Link>
      </section>
    );
  }

  const subject = getSubjectById(activity.subject);

  function handleComplete(result) {
    saveActivityProgress(activity.id, result);
    const reward = rewardActivityCompletion(activity.id, result);
    trackStudySession({
      minutes: activity.estimatedDurationMin || 8,
      activitiesCompleted: 1,
      examsCompleted: activity.engineType === 'story' ? 0 : 1
    });
    setResultState({
      crystals: reward.awarded,
      score: result.lastScore || 0
    });
  }

  return (
    <div className="page-stack page-stack--compact">
      <section className="activity-screen">
        <header className="activity-topline">
          <div className="activity-topline__copy">
            <div className="activity-breadcrumbs">
              <Link className="text-link" to="/map">{t('missions')}</Link>
              {world ? <span>/ {world.name}</span> : null}
              {mission ? <span>/ {t('missions')} {mission.order}</span> : null}
              {level ? <span>/ {t('level')} {level}</span> : null}
            </div>
            <h2>{activity.title}</h2>
            <p>{activity.instructions}</p>
          </div>
          <div className="activity-topline__meta">
            <span className="pill">{subject ? getSubjectLabel(subject, locale, t) : activity.subject}</span>
            <span className="pill">{activity.gradeBand.join(' / ')}</span>
          </div>
        </header>

        <div className="activity-engine activity-engine--full">
          {renderEngine(activity, progress, handleComplete)}
        </div>
      </section>

      <section className="context-footer context-footer--compact">
        <div className="context-footer__item">
          <span>{t('level')}</span>
          <strong>{level || activity.gradeBand[0]}</strong>
        </div>
        <div className="context-footer__item">
          <span>{t('mode')}</span>
          <strong>{activity.generated ? t('generatedMode') : activity.engineType}</strong>
        </div>
        <div className="context-footer__item">
          <span>{t('hint')}</span>
          <strong>{activity.hints?.[0]}</strong>
        </div>
        <div className="context-footer__item">
          <span>Score</span>
          <strong>{resultState.score || progress?.bestScore || 0}</strong>
        </div>
        <div className="context-footer__item">
          <span>{t('crystals')}</span>
          <strong>+{resultState.crystals}</strong>
        </div>
        <div className="context-footer__item">
          <span>Bloc</span>
          <strong>{mission ? `${t('missions')} ${mission.order}` : activity.subskill}</strong>
        </div>
        <div className="context-footer__item">
          <span>{t('progression')}</span>
          <strong>{progress?.completed ? 'Done' : 'Play'}</strong>
        </div>
      </section>
    </div>
  );
}
