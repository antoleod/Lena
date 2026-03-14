import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getActivityById, getModuleById, getSubjectById } from '../curriculum/catalog.js';
import { getActivityProgress, getLevelProgress, getProgressSnapshot, saveActivityProgress, saveLevelProgress } from '../../services/storage/progressStore.js';
import { rewardActivityCompletion, rewardMissionCompletion } from '../../services/storage/rewardStore.js';
import { materializeActivity } from '../../engines/generators/activityFactory.js';
import MultipleChoiceActivity from '../../engines/multiple-choice/MultipleChoiceActivity.jsx';
import BaseTenActivity from '../../engines/base-ten/BaseTenActivity.jsx';
import StoryActivity from '../../engines/story/StoryActivity.jsx';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectLabel } from '../../shared/i18n/contentLocalization.js';
import { getMission, getMissionProgress, getNextMissionTarget, getWorldById } from '../../shared/gameplay/worldMap.js';
import { trackStudySession } from '../../services/storage/profileStore.js';
import { getModuleActivityPlan } from '../../shared/gameplay/moduleJourney.js';

const ENGINE_COMPONENTS = {
  'base-ten': BaseTenActivity,
  story: StoryActivity,
  'multiple-choice': MultipleChoiceActivity,
  ordering: MultipleChoiceActivity,
  matching: MultipleChoiceActivity,
  'fill-sentence': MultipleChoiceActivity,
  'fill-word': MultipleChoiceActivity,
  comparison: MultipleChoiceActivity,
  sequence: MultipleChoiceActivity,
  'visual-logic': MultipleChoiceActivity,
  'drag-drop': MultipleChoiceActivity
};

function resolveEngineKey(activity) {
  if (!activity) {
    return 'multiple-choice';
  }

  if (activity.engineType && ENGINE_COMPONENTS[activity.engineType]) {
    return activity.engineType;
  }

  const correctionType = activity.correctionType || '';
  if (correctionType.includes('order')) return 'ordering';
  if (correctionType.includes('match')) return 'matching';
  if (correctionType.includes('fill')) return 'fill-sentence';
  if (correctionType.includes('drag')) return 'drag-drop';

  return 'multiple-choice';
}

function renderEngine(activity, progress, onComplete) {
  const engineKey = resolveEngineKey(activity);
  const Component = ENGINE_COMPONENTS[engineKey] || MultipleChoiceActivity;
  return <Component activity={activity} progress={progress} onComplete={onComplete} />;
}

function buildBackRoute({ moduleId, moduleJourney, world, mission }) {
  if (world && mission) {
    return `/map/${world.id}/missions/${mission.id}`;
  }
  if (moduleId && moduleJourney?.module) {
    return `/subjects/${moduleJourney.module.subjectId}/grades/${moduleJourney.module.gradeId}/modules/${moduleJourney.module.id}`;
  }
  return '/map';
}

export default function ActivityPage() {
  const { locale, t } = useLocale();
  const [searchParams] = useSearchParams();
  const { activityId } = useParams();
  const worldId = searchParams.get('world');
  const missionId = searchParams.get('mission');
  const moduleId = searchParams.get('module');
  const level = searchParams.get('level');
  const world = worldId ? getWorldById(worldId) : null;
  const mission = worldId && missionId ? getMission(worldId, missionId) : null;
  const levelOrder = Number(level || 0);
  const missionLevel = mission?.levels?.find((entry) => entry.order === levelOrder) || null;
  const moduleJourney = moduleId ? getModuleActivityPlan(moduleId, {
    guided: t('practiceMode'),
    independent: t('continueStep'),
    challenge: t('missionChallengeLabel'),
    exam: t('missionExamLabel'),
    review: t('reinforceLabel')
  }) : null;
  const moduleActivityIndex = moduleJourney?.activities.findIndex((entry) => entry.id === activityId) ?? -1;
  const resolvedModuleOrder = moduleActivityIndex >= 0 ? moduleActivityIndex + 1 : levelOrder;
  const currentLevelId = missionLevel?.id || (moduleId && resolvedModuleOrder ? `${moduleId}::activity-${resolvedModuleOrder}` : null);
  const baseActivity = getActivityById(activityId);
  const [activity, setActivity] = useState(null);
  const [completion, setCompletion] = useState(null);
  const [status, setStatus] = useState(baseActivity ? 'loading' : 'not-found');

  useEffect(() => {
    if (!baseActivity) {
      setActivity(null);
      setStatus('not-found');
      return;
    }

    try {
      const nextActivity = materializeActivity(baseActivity, getActivityProgress(baseActivity.id));
      setActivity(nextActivity);
      setCompletion(null);
      setStatus('ready');
    } catch {
      setActivity(null);
      setStatus('error');
    }
  }, [activityId, baseActivity]);

  const progress = useMemo(() => {
    if (!baseActivity) {
      return null;
    }
    const activityProgress = getActivityProgress(baseActivity.id);
    if (!currentLevelId) {
      return activityProgress;
    }
    const levelProgress = getLevelProgress(currentLevelId);
    return {
      ...activityProgress,
      ...levelProgress,
      bestScore: Math.max(activityProgress.bestScore || 0, levelProgress.bestScore || 0),
      lastScore: levelProgress.lastScore ?? activityProgress.lastScore,
      completed: Boolean(levelProgress.completed || activityProgress.completed)
    };
  }, [baseActivity, currentLevelId, completion?.score]);

  const subject = activity ? getSubjectById(activity.subject) : null;
  const backRoute = buildBackRoute({ moduleId, moduleJourney, world, mission });

  function resolveNextRoute() {
    if (world && mission && levelOrder) {
      const nextTarget = getNextMissionTarget(world.id, mission.id, levelOrder);
      if (nextTarget) {
        return `/activities/${nextTarget.activityId}?world=${nextTarget.worldId}&mission=${nextTarget.missionId}&level=${nextTarget.levelOrder}`;
      }
      return `/map/${world.id}`;
    }

    if (moduleId) {
      const module = getModuleById(moduleId);
      const nextEntry = moduleJourney?.activities[resolvedModuleOrder] || null;
      if (nextEntry) {
        return `/activities/${nextEntry.id}?module=${moduleId}`;
      }
      return module ? `/subjects/${module.subjectId}/grades/${module.gradeId}/modules/${module.id}` : null;
    }

    return null;
  }

  function handleComplete(result) {
    if (!activity) {
      return;
    }

    saveActivityProgress(activity.id, result);
    if (currentLevelId) {
      saveLevelProgress(currentLevelId, {
        ...result,
        activityId: activity.id,
        worldId,
        missionId,
        moduleId,
        order: world && mission ? levelOrder : resolvedModuleOrder
      });
    }

    const reward = rewardActivityCompletion(activity.id, result);
    let missionReward = 0;

    if (world && mission && levelOrder === mission.levels.length) {
      const missionSnapshot = getProgressSnapshot();
      const missionProgress = getMissionProgress(mission, missionSnapshot);
      missionReward = rewardMissionCompletion(`${world.id}::${mission.id}`, {
        perfect: missionProgress.perfect === missionProgress.total
      }).awarded;
    }

    trackStudySession({
      minutes: activity.estimatedDurationMin || 8,
      activitiesCompleted: 1,
      examsCompleted: activity.engineType === 'story' ? 0 : 1
    });

    setCompletion({
      score: result.lastScore || 0,
      crystals: reward.awarded,
      missionCrystals: missionReward,
      nextRoute: resolveNextRoute(),
      backRoute
    });
    setStatus('completed');
  }

  if (status === 'loading') {
    return (
      <section className="panel panel--tight">
        <h2>{t('continueJourneyLabel') || 'Loading activity'}</h2>
      </section>
    );
  }

  if (status === 'not-found') {
    return (
      <section className="panel panel--tight">
        <h2>{t('activityNotFound')}</h2>
        <Link className="text-link" to={backRoute}>{t('back')}</Link>
      </section>
    );
  }

  if (status === 'error') {
    return (
      <section className="panel panel--tight">
        <h2>{t('activityNotFound')}</h2>
        <p>{t('reviewTogether')}</p>
        <Link className="text-link" to={backRoute}>{t('back')}</Link>
      </section>
    );
  }

  if (!activity || !baseActivity || !progress) {
    return (
      <section className="panel panel--tight">
        <h2>{t('noQuestion')}</h2>
        <Link className="text-link" to={backRoute}>{t('back')}</Link>
      </section>
    );
  }

  if (status === 'completed' && completion) {
    return (
      <div className="page-stack page-stack--compact">
        <section className="panel panel--tight">
          <div className="panel__header">
            <div>
              <span className="eyebrow">{t('activityDone')}</span>
              <h2>{activity.title}</h2>
            </div>
            <span className="pill">{completion.score}</span>
          </div>

          <div className="mini-metrics">
            <div><span>{t('crystals')}</span><strong>+{completion.crystals}</strong></div>
            {completion.missionCrystals ? <div><span>{t('missions')}</span><strong>+{completion.missionCrystals}</strong></div> : null}
            <div><span>{t('bestLabel')}</span><strong>{progress.bestScore || completion.score}</strong></div>
          </div>

          <div className="dashboard-actions">
            {completion.nextRoute ? (
              <Link className="primary-action" to={completion.nextRoute}>
                <span className="button-icon" aria-hidden="true">▶</span>
                <span>{t('continue')}</span>
              </Link>
            ) : null}
            <Link className="secondary-action" to={completion.backRoute}>
              <span className="button-icon" aria-hidden="true">↩</span>
              <span>{moduleId ? t('back') : t('missions')}</span>
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack page-stack--compact">
      <section className="activity-screen">
        <header className="activity-topline">
          <div className="activity-topline__copy">
            <div className="activity-breadcrumbs">
              <Link className="text-link" to={backRoute}>{moduleId ? getModuleById(moduleId)?.title || t('back') : t('missions')}</Link>
              {world ? <span>/ {world.name}</span> : null}
              {mission ? <span>/ {t('missions')} {mission.order}</span> : null}
              {!world && moduleJourney?.module ? <span>/ {moduleJourney.module.title}</span> : null}
              {world && level ? <span>/ {t('level')} {level}</span> : null}
            </div>
            <h2>{activity.title}</h2>
            <p>{activity.instructions}</p>
          </div>
          <div className="activity-topline__meta">
            <span className="pill">{subject ? getSubjectLabel(subject, locale, t) : activity.subject}</span>
            <span className="pill">{activity.gradeBand.join(' / ')}</span>
            <span className="pill">{resolveEngineKey(activity)}</span>
          </div>
        </header>

        <div className="activity-engine activity-engine--full">
          {renderEngine(activity, progress, handleComplete)}
        </div>
      </section>
    </div>
  );
}
