import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
  const navigate = useNavigate();
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
  const currentLevelId = missionLevel?.id || (moduleId && levelOrder ? `${moduleId}::level-${levelOrder}` : null);

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
  }, [baseActivity, currentLevelId, resultState.score]);

  if (!activity || !baseActivity) {
    return (
      <section className="panel panel--tight">
        <h2>{t('activityNotFound')}</h2>
        <Link className="text-link" to="/map">{t('backHome')}</Link>
      </section>
    );
  }

  const subject = getSubjectById(activity.subject);

  function buildModuleLevelPlan(module) {
    if (!module) {
      return [];
    }

    const phaseActivityIds = [
      ...(module.phases.guidedPractice || []),
      ...(module.phases.independentPractice || []),
      ...(module.phases.miniChallenge ? [module.phases.miniChallenge] : []),
      ...(module.phases.miniExam ? [module.phases.miniExam] : []),
      ...(module.phases.suggestedReview || [])
    ].filter(Boolean);

    const moduleActivities = phaseActivityIds
      .map((id) => getActivityById(id))
      .filter(Boolean);

    if (!moduleActivities.length) {
      return [];
    }

    return Array.from({ length: 10 }, (_, index) => {
      const entry = moduleActivities[index % moduleActivities.length];
      return {
        order: index + 1,
        activityId: entry.id
      };
    });
  }

  function resolveNextRoute() {
    const parsedLevel = Number(level || 0);

    if (world && mission && parsedLevel) {
      const nextTarget = getNextMissionTarget(world.id, mission.id, parsedLevel);
      if (nextTarget) {
        return `/activities/${nextTarget.activityId}?world=${nextTarget.worldId}&mission=${nextTarget.missionId}&level=${nextTarget.levelOrder}`;
      }
      return `/map/${world.id}`;
    }

    if (moduleId && parsedLevel) {
      const module = getModuleById(moduleId);
      const plan = buildModuleLevelPlan(module);
      const nextEntry = plan.find((entry) => entry.order === parsedLevel + 1);
      if (nextEntry) {
        return `/activities/${nextEntry.activityId}?module=${moduleId}&level=${nextEntry.order}`;
      }
      return module ? `/subjects/${module.subjectId}/grades/${module.gradeId}/modules/${module.id}` : null;
    }

    return null;
  }

  function handleComplete(result) {
    saveActivityProgress(activity.id, result);
    if (currentLevelId) {
      saveLevelProgress(currentLevelId, {
        ...result,
        activityId: activity.id,
        worldId,
        missionId,
        moduleId,
        order: levelOrder
      });
    }
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

    if (world && mission && levelOrder === mission.levels.length) {
      const missionSnapshot = getProgressSnapshot();
      const missionProgress = getMissionProgress(mission, missionSnapshot);
      const missionReward = rewardMissionCompletion(`${world.id}::${mission.id}`, {
        perfect: missionProgress.perfect === missionProgress.total
      });
      const rewardQuery = [
        'complete=1',
        `reward=${missionReward.awarded}`,
        `perfect=${missionProgress.perfect === missionProgress.total ? 1 : 0}`
      ].join('&');

      window.setTimeout(() => {
        navigate(`/map/${world.id}/missions/${mission.id}?${rewardQuery}`);
      }, 900);
      return;
    }

    const nextRoute = resolveNextRoute();
    if (nextRoute) {
      window.setTimeout(() => {
        navigate(nextRoute);
      }, 900);
    }
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
    </div>
  );
}
