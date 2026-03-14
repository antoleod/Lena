import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getModuleById, getSubjectById } from '../curriculum/catalog.js';
import { getActivityProgress, getLevelProgress, getProgressSnapshot, saveActivityProgress, saveLevelProgress } from '../../services/storage/progressStore.js';
import { rewardActivityCompletion, rewardMissionCompletion } from '../../services/storage/rewardStore.js';
import { materializeActivity } from '../../engines/generators/activityFactory.js';
import MultipleChoiceActivity from '../../engines/multiple-choice/MultipleChoiceActivity.jsx';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectLabel } from '../../shared/i18n/contentLocalization.js';
import { getMission, getMissionProgress, getNextMissionTarget, getWorldById } from '../../shared/gameplay/worldMap.js';
import { trackStudySession, unlockMission, unlockWorld } from '../../services/storage/profileStore.js';
import { getModuleActivityPlan } from '../../shared/gameplay/moduleJourney.js';
import { resolveActivity } from '../../content/registry/activityRegistry.js';
import { getEngineDefinition } from '../../engines/engineRegistry.js';

function resolveEngineKey(activity) {
  if (!activity) return 'multiple-choice';
  if (activity.engineType && getEngineDefinition(activity.engineType)) return activity.engineType;
  const correctionType = activity.correctionType || '';
  if (correctionType.includes('order')) return 'ordering';
  if (correctionType.includes('match')) return 'matching';
  if (correctionType.includes('fill')) return 'fill-sentence';
  if (correctionType.includes('drag')) return 'drag-drop';
  return 'multiple-choice';
}

function renderEngine(activity, progress, onComplete) {
  const engineKey = resolveEngineKey(activity);
  const Component = getEngineDefinition(engineKey)?.component || MultipleChoiceActivity;
  return <Component activity={activity} progress={progress} onComplete={onComplete} />;
}

function buildBackRoute({ moduleId, moduleJourney, world, mission }) {
  if (world && mission) return `/map/${world.id}/missions/${mission.id}`;
  if (moduleId && moduleJourney?.module) {
    return `/subjects/${moduleJourney.module.subjectId}/grades/${moduleJourney.module.gradeId}/modules/${moduleJourney.module.id}`;
  }
  return '/map';
}

function ScoreStars({ score, total }) {
  const percent = total ? (score / total) * 100 : 0;
  const stars = percent >= 90 ? 3 : percent >= 60 ? 2 : 1;
  return (
    <div className="completion-stars" aria-label={`${stars} estrellas`}>
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={`completion-star${n <= stars ? ' completion-star--lit' : ''}`}
          style={{ animationDelay: `${(n - 1) * 200}ms` }}
          aria-hidden="true"
        >
          ⭐
        </span>
      ))}
    </div>
  );
}

function Confetti() {
  return (
    <div className="confetti-burst" aria-hidden="true">
      {Array.from({ length: 16 }, (_, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            '--delay': `${(i * 0.07).toFixed(2)}s`,
            '--angle': `${(i / 16) * 360}deg`,
            '--color': ['#ff8fc6', '#ffcf74', '#78a6ff', '#8bdcc3', '#a689ff'][i % 5],
          }}
        />
      ))}
    </div>
  );
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
    review: t('reinforceLabel'),
  }) : null;
  const moduleActivityIndex = moduleJourney?.activities.findIndex((entry) => entry.id === activityId) ?? -1;
  const resolvedModuleOrder = moduleActivityIndex >= 0 ? moduleActivityIndex + 1 : levelOrder;
  const currentLevelId = missionLevel?.id || (moduleId && resolvedModuleOrder ? `${moduleId}::activity-${resolvedModuleOrder}` : null);
  const baseActivity = resolveActivity(activityId);
  const [activity, setActivity] = useState(null);
  const [completion, setCompletion] = useState(null);
  const [status, setStatus] = useState(baseActivity ? 'loading' : 'not-found');

  useEffect(() => {
    if (!baseActivity) { setActivity(null); setStatus('not-found'); return; }
    try {
      const nextActivity = materializeActivity(baseActivity, getActivityProgress(baseActivity.id));
      setActivity(nextActivity);
      setCompletion(null);
      setStatus('ready');
    } catch { setActivity(null); setStatus('error'); }
  }, [activityId, baseActivity]);

  const progress = useMemo(() => {
    if (!baseActivity) return null;
    const activityProgress = getActivityProgress(baseActivity.id);
    if (!currentLevelId) return activityProgress;
    const levelProgress = getLevelProgress(currentLevelId);
    return {
      ...activityProgress, ...levelProgress,
      bestScore: Math.max(activityProgress.bestScore || 0, levelProgress.bestScore || 0),
      lastScore: levelProgress.lastScore ?? activityProgress.lastScore,
      completed: Boolean(levelProgress.completed || activityProgress.completed),
    };
  }, [baseActivity, currentLevelId, completion?.score]);

  const subject = activity ? getSubjectById(activity.subject) : null;
  const backRoute = buildBackRoute({ moduleId, moduleJourney, world, mission });

  function resolveNextRoute() {
    if (world && mission && levelOrder) {
      const nextTarget = getNextMissionTarget(world.id, mission.id, levelOrder);
      if (nextTarget) return `/activities/${nextTarget.activityId}?world=${nextTarget.worldId}&mission=${nextTarget.missionId}&level=${nextTarget.levelOrder}`;
      return `/map/${world.id}`;
    }
    if (moduleId) {
      const module = getModuleById(moduleId);
      const nextEntry = moduleJourney?.activities[resolvedModuleOrder] || null;
      if (nextEntry) return `/activities/${nextEntry.id}?module=${moduleId}`;
      return module ? `/subjects/${module.subjectId}/grades/${module.gradeId}/modules/${module.id}` : null;
    }
    return null;
  }

  function handleComplete(result) {
    if (!activity) return;
    saveActivityProgress(activity.id, result);
    if (currentLevelId) {
      saveLevelProgress(currentLevelId, {
        ...result, activityId: activity.id, worldId, missionId, moduleId,
        order: world && mission ? levelOrder : resolvedModuleOrder,
      });
    }
    const reward = rewardActivityCompletion(activity.id, result);
    let missionReward = 0;
    let nextRoute = resolveNextRoute();
    if (world && mission && levelOrder === mission.levels.length) {
      const missionSnapshot = getProgressSnapshot();
      const missionProgress = getMissionProgress(mission, missionSnapshot);
      missionReward = rewardMissionCompletion(`${world.id}::${mission.id}`, {
        perfect: missionProgress.perfect === missionProgress.total,
      }).awarded;
      unlockMission(`${world.id}::${mission.id}`);
      const nextTarget = getNextMissionTarget(world.id, mission.id, levelOrder);
      if (nextTarget) {
        unlockMission(`${nextTarget.worldId}::${nextTarget.missionId}`);
        unlockWorld(nextTarget.worldId);
        nextRoute = `/map/${world.id}/missions/${mission.id}?complete=1&reward=${missionReward}`;
      } else {
        nextRoute = `/map/${world.id}/missions/${mission.id}?complete=1&reward=${missionReward}`;
      }
    }
    trackStudySession({
      minutes: activity.estimatedDurationMin || 8,
      activitiesCompleted: 1,
      examsCompleted: activity.engineType === 'story' ? 0 : 1,
    });
    setCompletion({
      score: result.lastScore || 0,
      totalQuestions: result.totalQuestions || 0,
      crystals: reward.awarded,
      missionCrystals: missionReward,
      nextRoute,
      backRoute,
    });
    setStatus('completed');
  }

  // Loading / error states
  if (status === 'loading') {
    return (
      <section className="panel panel--tight activity-loading" data-testid="activity-page">
        <div className="activity-loading__inner">
          <span className="activity-loading__spinner" aria-hidden="true">✨</span>
          <p>{t('continueJourneyLabel') || 'Cargando actividad...'}</p>
        </div>
      </section>
    );
  }

  if (status === 'not-found' || status === 'error') {
    return (
      <section className="panel panel--tight" data-testid="activity-page">
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <span style={{ fontSize: '3rem' }}>😕</span>
          <h2 style={{ margin: '12px 0 8px' }}>{t('activityNotFound')}</h2>
          {status === 'error' && <p style={{ color: 'var(--muted)' }}>{t('reviewTogether')}</p>}
          <Link className="primary-action" to={backRoute} style={{ marginTop: 16, display: 'inline-flex' }}>
            ← {t('back')}
          </Link>
        </div>
      </section>
    );
  }

  if (!activity || !baseActivity || !progress) {
    return (
      <section className="panel panel--tight" data-testid="activity-page">
        <h2>{t('noQuestion')}</h2>
        <Link className="text-link" to={backRoute}>{t('back')}</Link>
      </section>
    );
  }

  // Completion screen
  if (status === 'completed' && completion) {
    const total = completion.totalQuestions || 1;
    const percent = Math.round((completion.score / total) * 100);
    const isPerfect = percent === 100;
    const isGood = percent >= 60;
    const message = isPerfect
      ? '¡Perfecto! ¡Eres increíble! 🌟'
      : isGood
        ? '¡Muy bien hecho! 💪'
        : '¡Buen intento! Sigue practicando 💡';

    return (
      <div className="page-stack page-stack--compact" data-testid="activity-complete">
        <section className="completion-screen">
          <Confetti />
          <div className="completion-screen__inner">
            <ScoreStars score={completion.score} total={total} />
            <h1 className="completion-screen__msg">{message}</h1>
            <p className="completion-screen__activity">{activity.title}</p>

            <div className="completion-rewards">
              <div className="completion-reward">
                <span aria-hidden="true">🏆</span>
                <strong>{completion.score}/{total}</strong>
                <small>Respuestas</small>
              </div>
              <div className="completion-reward">
                <span aria-hidden="true">💎</span>
                <strong>+{completion.crystals}</strong>
                <small>{t('crystals')}</small>
              </div>
              {completion.missionCrystals > 0 && (
                <div className="completion-reward">
                  <span aria-hidden="true">🎯</span>
                  <strong>+{completion.missionCrystals}</strong>
                  <small>Misión</small>
                </div>
              )}
              <div className="completion-reward">
                <span aria-hidden="true">⭐</span>
                <strong>{progress.bestScore || completion.score}</strong>
                <small>{t('bestLabel')}</small>
              </div>
            </div>

            <div className="completion-actions">
              {completion.nextRoute ? (
                <Link className="primary-action" to={completion.nextRoute} data-testid="activity-continue">
                  <span className="button-icon" aria-hidden="true">▶</span>
                  <span>{t('continue')}</span>
                </Link>
              ) : null}
              <Link className="secondary-action" to={completion.backRoute} data-testid="activity-back">
                <span className="button-icon" aria-hidden="true">↩</span>
                <span>{moduleId ? t('back') : t('missions')}</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Activity screen
  return (
    <div className="page-stack page-stack--compact" data-testid="activity-page">
      <section className="activity-screen">
        <header className="activity-header">
          <div className="activity-header__nav">
            <Link className="activity-back-btn" to={backRoute}>
              ← {moduleId ? getModuleById(moduleId)?.title || t('back') : t('missions')}
            </Link>
            <div className="activity-header__pills">
              {subject && (
                <span className="activity-pill activity-pill--subject">
                  {getSubjectLabel(subject, locale, t)}
                </span>
              )}
              <span className="activity-pill">
                {activity.gradeBand.join(' / ')}
              </span>
            </div>
          </div>
          <h1 className="activity-header__title">{activity.title}</h1>
          {activity.instructions && (
            <p className="activity-header__instructions">{activity.instructions}</p>
          )}
        </header>

        <div className="activity-engine activity-engine--full">
          {renderEngine(activity, progress, handleComplete)}
        </div>
      </section>
    </div>
  );
}
