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
import { playRewardSound } from '../../services/sound/soundService.js';
import Mascot from '../../shared/ui/Mascot.jsx';
import { getWorldTheme } from '../../shared/gameplay/worldThemes.js';

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

function renderEngine(activity, progress, onComplete, onAnswerStateChange) {
  const engineKey = resolveEngineKey(activity);
  const Component = getEngineDefinition(engineKey)?.component || MultipleChoiceActivity;
  return <Component activity={activity} progress={progress} onComplete={onComplete} onAnswerStateChange={onAnswerStateChange} />;
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
    <div className="cc-act-stars" aria-label={`${stars} estrellas`}>
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={`cc-act-star${n <= stars ? ' cc-act-star--lit' : ''}`}
          style={{ animationDelay: `${(n - 1) * 180}ms` }}
          aria-hidden="true"
        >★</span>
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
  const worldId   = searchParams.get('world');
  const missionId = searchParams.get('mission');
  const moduleId  = searchParams.get('module');
  const level     = searchParams.get('level');

  const world      = worldId ? getWorldById(worldId) : null;
  const mission    = worldId && missionId ? getMission(worldId, missionId) : null;
  const levelOrder = Number(level || 0);
  const missionLevel = mission?.levels?.find((e) => e.order === levelOrder) || null;

  const moduleJourney = moduleId ? getModuleActivityPlan(moduleId, {
    guided: t('practiceMode'), independent: t('continueStep'),
    challenge: t('missionChallengeLabel'), exam: t('missionExamLabel'), review: t('reinforceLabel'),
  }) : null;
  const moduleActivityIndex = moduleJourney?.activities.findIndex((e) => e.id === activityId) ?? -1;
  const resolvedModuleOrder = moduleActivityIndex >= 0 ? moduleActivityIndex + 1 : levelOrder;
  const currentLevelId = missionLevel?.id || (moduleId && resolvedModuleOrder ? `${moduleId}::activity-${resolvedModuleOrder}` : null);

  const baseActivity = resolveActivity(activityId);
  const [activity, setActivity]       = useState(null);
  const [completion, setCompletion]   = useState(null);
  const [status, setStatus]           = useState(baseActivity ? 'loading' : 'not-found');
  const [mascotStatus, setMascotStatus] = useState('idle');

  // World theme — falls back to a neutral dark palette when no world context
  const worldTheme = world ? getWorldTheme(world.order) : { color: '#a87cf9', shadow: '#7044d4', bg: 'linear-gradient(145deg,#d5b8ff,#a87cf9)', emoji: '✨', deco: '⭐' };

  useEffect(() => {
    if (!baseActivity) { setActivity(null); setStatus('not-found'); return; }
    try {
      const next = materializeActivity(baseActivity, getActivityProgress(baseActivity.id));
      setActivity(next);
      setCompletion(null);
      setMascotStatus('idle');
      setStatus('ready');
    } catch { setActivity(null); setStatus('error'); }
  }, [activityId, baseActivity]);

  useEffect(() => {
    if (status !== 'completed' || !completion?.missionCrystals) return;
    playRewardSound();
  }, [status, completion?.missionCrystals]);

  const progress = useMemo(() => {
    if (!baseActivity) return null;
    const ap = getActivityProgress(baseActivity.id);
    if (!currentLevelId) return ap;
    const lp = getLevelProgress(currentLevelId);
    return {
      ...ap, ...lp,
      bestScore: Math.max(ap.bestScore || 0, lp.bestScore || 0),
      lastScore: lp.lastScore ?? ap.lastScore,
      completed: Boolean(lp.completed || ap.completed),
    };
  }, [baseActivity, currentLevelId, completion?.score]);

  const subject   = activity ? getSubjectById(activity.subject) : null;
  const backRoute = buildBackRoute({ moduleId, moduleJourney, world, mission });

  function resolveNextRoute() {
    if (world && mission && levelOrder) {
      const next = getNextMissionTarget(world.id, mission.id, levelOrder);
      if (next) return `/activities/${next.activityId}?world=${next.worldId}&mission=${next.missionId}&level=${next.levelOrder}`;
      return `/map/${world.id}`;
    }
    if (moduleId) {
      const mod = getModuleById(moduleId);
      const nextEntry = moduleJourney?.activities[resolvedModuleOrder] || null;
      if (nextEntry) return `/activities/${nextEntry.id}?module=${moduleId}`;
      return mod ? `/subjects/${mod.subjectId}/grades/${mod.gradeId}/modules/${mod.id}` : null;
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
      const snap = getProgressSnapshot();
      const mp   = getMissionProgress(mission, snap);
      missionReward = rewardMissionCompletion(`${world.id}::${mission.id}`, { perfect: mp.perfect === mp.total }).awarded;
      unlockMission(`${world.id}::${mission.id}`);
      const nextTarget = getNextMissionTarget(world.id, mission.id, levelOrder);
      if (nextTarget) { unlockMission(`${nextTarget.worldId}::${nextTarget.missionId}`); unlockWorld(nextTarget.worldId); }
      nextRoute = `/map/${world.id}/missions/${mission.id}?complete=1&reward=${missionReward}`;
    }
    trackStudySession({ minutes: activity.estimatedDurationMin || 8, activitiesCompleted: 1, examsCompleted: activity.engineType === 'story' ? 0 : 1 });
    setMascotStatus('completed');
    setCompletion({ score: result.lastScore || 0, totalQuestions: result.totalQuestions || 0, crystals: reward.awarded, missionCrystals: missionReward, nextRoute, backRoute });
    setStatus('completed');
  }

  // ── Loading / error ──────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="cc-activity-shell" style={{ '--world-color': worldTheme.color, '--world-bg': worldTheme.bg }}>
        <div className="cc-activity-loading">
          <span className="cc-activity-loading__icon">{worldTheme.emoji}</span>
          <p>{t('continueJourneyLabel') || 'Cargando actividad...'}</p>
        </div>
      </div>
    );
  }

  if (status === 'not-found' || status === 'error') {
    return (
      <div className="cc-activity-shell" style={{ '--world-color': worldTheme.color, '--world-bg': worldTheme.bg }}>
        <div className="cc-activity-loading">
          <span className="cc-activity-loading__icon">😕</span>
          <p>{t('activityNotFound')}</p>
          <Link className="cc-mission-banner__cta" to={backRoute} style={{ marginTop: 16 }}>← {t('back')}</Link>
        </div>
      </div>
    );
  }

  if (!activity || !baseActivity || !progress) {
    return (
      <div className="cc-activity-shell" style={{ '--world-color': worldTheme.color, '--world-bg': worldTheme.bg }}>
        <div className="cc-activity-loading">
          <span className="cc-activity-loading__icon">❓</span>
          <p>{t('noQuestion')}</p>
          <Link className="cc-mission-banner__cta" to={backRoute} style={{ marginTop: 16 }}>← {t('back')}</Link>
        </div>
      </div>
    );
  }

  // ── Completion screen ────────────────────────────────────────────────────
  if (status === 'completed' && completion) {
    const total     = completion.totalQuestions || 1;
    const percent   = Math.round((completion.score / total) * 100);
    const isPerfect = percent === 100;
    const isGood    = percent >= 60;
    const isRenforcement = activity?.subject === 'renforcement';
    const message = isRenforcement
      ? (isPerfect ? 'Bravo, tu es vraiment tres fort ! 🌟' : isGood ? 'Tres bien ! On continue ensemble 🌱' : 'Super ! On regarde encore ensemble 💡')
      : (isPerfect ? '¡Perfecto! ¡Eres increíble!' : isGood ? '¡Muy bien hecho!' : '¡Buen intento! Sigue practicando');

    return (
      <div className="cc-activity-shell cc-activity-shell--complete" style={{ '--world-color': worldTheme.color, '--world-bg': worldTheme.bg }}>
        <Confetti />
        <div className="cc-completion">
          {/* World badge */}
          <div className="cc-completion__world-badge" style={{ background: worldTheme.bg, boxShadow: `0 8px 0 ${worldTheme.shadow}` }}>
            <span>{worldTheme.emoji}</span>
          </div>

          <div className="cc-completion__mascot">
            <Mascot status="completed" />
          </div>

          <ScoreStars score={completion.score} total={total} />

          <h1 className="cc-completion__msg">{message}</h1>
          <p className="cc-completion__subtitle">{activity.title}</p>

          {/* Reward chips */}
          <div className="cc-completion__rewards">
            <div className="cc-completion__reward">
              <span>🏆</span>
              <strong>{completion.score}/{total}</strong>
              <small>{isRenforcement ? 'Reponses' : 'Respuestas'}</small>
            </div>
            <div className="cc-completion__reward">
              <span>💎</span>
              <strong>+{completion.crystals}</strong>
              <small>{t('crystals')}</small>
            </div>
            {completion.missionCrystals > 0 && (
              <div className="cc-completion__reward cc-completion__reward--mission">
                <span>🎯</span>
                <strong>+{completion.missionCrystals}</strong>
                <small>Misión</small>
              </div>
            )}
            <div className="cc-completion__reward">
              <span>⭐</span>
              <strong>{progress.bestScore || completion.score}</strong>
              <small>{t('bestLabel')}</small>
            </div>
          </div>

          <div className="cc-completion__actions">
            {completion.nextRoute && (
              <Link className="cc-completion__btn cc-completion__btn--primary" to={completion.nextRoute} data-testid="activity-continue">
                ▶ {t('continue')}
              </Link>
            )}
            <Link className="cc-completion__btn cc-completion__btn--secondary" to={completion.backRoute} data-testid="activity-back">
              ↩ {moduleId ? t('back') : t('missions')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Activity screen ──────────────────────────────────────────────────────
  const missionTitle = mission?.title || (world ? world.title : null);
  const levelLabel   = levelOrder ? `Nivel ${levelOrder}` : null;

  return (
    <div className="cc-activity-shell" style={{ '--world-color': worldTheme.color, '--world-bg': worldTheme.bg }} data-testid="activity-page">
      {/* Top bar */}
      <header className="cc-act-header">
        <Link className="cc-back-btn" to={backRoute} aria-label={t('back')}>←</Link>

        <div className="cc-act-header__center">
          {/* World/mission breadcrumb */}
          <div className="cc-act-header__crumb">
            <span className="cc-act-header__world-dot" style={{ background: worldTheme.bg }} aria-hidden="true">
              {worldTheme.emoji}
            </span>
            <span className="cc-act-header__crumb-text">
              {missionTitle || (subject ? getSubjectLabel(subject, locale, t) : '')}
              {levelLabel && <span className="cc-act-header__level"> · {levelLabel}</span>}
            </span>
          </div>
          <h1 className="cc-act-header__title">{activity.title}</h1>
          {activity.instructions && (
            <p className="cc-act-header__instructions">{activity.instructions}</p>
          )}
        </div>

        <div className="cc-act-header__mascot">
          <Mascot status={mascotStatus} />
        </div>
      </header>

      {/* Engine */}
      <div className="cc-act-engine">
        {renderEngine(activity, progress, handleComplete, setMascotStatus)}
      </div>
    </div>
  );
}
