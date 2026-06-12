import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import {
  getLevelProgressRecord,
  getMission,
  getMissionProgress,
  getNextMissionTarget,
  getWorldById
} from '../../shared/gameplay/worldMap.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';
import IslandPath from '../grade/IslandPath.jsx';

const STAGE_GLYPH = { practice: '📖', challenge: '⚡', exam: '🏁' };

function buildMissionStages(mission, progress, t) {
  const totalLevels = mission.levels.length;
  const examOrder = totalLevels;
  const challengeOrder = totalLevels >= 3 ? totalLevels - 1 : null;
  const practiceLevels = mission.levels.filter(l => challengeOrder ? l.order < challengeOrder : l.order < examOrder);
  const challengeLevel = challengeOrder ? mission.levels.find(l => l.order === challengeOrder) : null;
  const examLevel = mission.levels.find(l => l.order === examOrder) || null;

  return [
    { id: 'practice',  title: t('missionPracticeLabel'),   levels: practiceLevels,             launchLevel: practiceLevels.find(l => !getLevelProgressRecord(progress, l)?.completed) || practiceLevels[0] || null },
    { id: 'challenge', title: t('missionChallengeLabel'),  levels: challengeLevel ? [challengeLevel] : [], launchLevel: challengeLevel },
    { id: 'exam',      title: t('missionExamLabel'),       levels: examLevel ? [examLevel] : [], launchLevel: examLevel },
  ].map(stage => {
    const total = stage.levels.length;
    const completed = stage.levels.filter(l => getLevelProgressRecord(progress, l)?.completed).length;
    return { ...stage, total, completed, status: completed >= total && total > 0 ? 'completed' : completed > 0 ? 'in-progress' : 'available' };
  }).filter(s => s.total > 0);
}

export default function MissionPage() {
  const { t } = useLocale();
  const [searchParams] = useSearchParams();
  const { worldId, missionId } = useParams();
  const world = getWorldById(worldId);
  const mission = getMission(worldId, missionId);
  const progress = getProgressSnapshot();

  if (!world || !mission) {
    return (
      <section className="panel panel--tight">
        <h2>{t('activityNotFound')}</h2>
        <Link className="text-link" to="/map">{t('backHome')}</Link>
      </section>
    );
  }

  const missionProgress = getMissionProgress(mission, progress);
  const completedMission = missionProgress.completed >= missionProgress.total;
  const perfectMission = completedMission && missionProgress.perfect >= missionProgress.total;
  const completionReward = Number(searchParams.get('reward') || 0);
  const showCompletionBanner = searchParams.get('complete') === '1' && completedMission;
  const nextTarget = getNextMissionTarget(world.id, mission.id, mission.levels.length);
  const nextPlayableLevel = mission.levels.find(l => !getLevelProgressRecord(progress, l)?.completed) || mission.levels[0];
  const stages = buildMissionStages(mission, progress, t);

  const missionPct = missionProgress.total ? Math.round((missionProgress.completed / missionProgress.total) * 100) : 0;
  const activeStageId = stages.find(s => s.status !== 'completed')?.id || null;

  const stageNodes = stages.map(stage => {
    const pct = stage.total ? Math.round((stage.completed / stage.total) * 100) : 0;
    return {
      id: stage.id,
      title: stage.title,
      launchTo: stage.launchLevel
        ? `/activities/${stage.launchLevel.activityId}?world=${world.id}&mission=${mission.id}&level=${stage.launchLevel.order}`
        : `/map/${world.id}`,
      pct,
      isActive: stage.id === activeStageId,
      complete: stage.status === 'completed',
      glyph: STAGE_GLYPH[stage.id] || '📖',
    };
  });

  return (
    <div className="cc-map-page" data-testid={`mission-page-${missionId}`}>
      <div className="cc-topbar">
        <Link className="cc-back-btn" to={`/map/${world.id}`}>←</Link>
        <div className="cc-topbar__title">{mission.title}</div>
        <div className="cc-topbar__progress">
          <div className="cc-xp-bar"><div className="cc-xp-fill" style={{ width: `${missionPct}%` }} /></div>
          <span className="cc-xp-text">{missionPct}%</span>
        </div>
      </div>

      {/* Completion banner */}
      {showCompletionBanner && (
        <div className="cc-completion-banner">
          <div className="cc-completion-banner__stars">
            {[1,2,3].map(i => <span key={i} className="cc-completion-banner__star">⭐</span>)}
          </div>
          <div className="cc-completion-banner__title">
            {perfectMission ? `${t('missionExamLabel')} · ${t('missionPerfectLabel')}` : t('missionCompleteLabel')}
          </div>
          <div className="cc-completion-banner__reward">+{completionReward} {t('crystals')} 💎</div>
          <div className="cc-completion-banner__actions">
            {nextTarget ? (
              <Link className="cc-mission-banner__cta" to={`/activities/${nextTarget.activityId}?world=${nextTarget.worldId}&mission=${nextTarget.missionId}&level=${nextTarget.levelOrder}`}>
                ▶ {t('continue')}
              </Link>
            ) : (
              <Link className="cc-mission-banner__cta" to={`/map/${world.id}`}>🗺 {t('missions')}</Link>
            )}
          </div>
        </div>
      )}

      {/* Mission info banner */}
      <div className="cc-world-banner">
        <div className="cc-world-banner__left">
          <span className="cc-world-banner__eyebrow">Mundo {world.order} · {world.title}</span>
          <p className="cc-world-banner__desc">{mission.description || `Misión ${mission.order}`}</p>
        </div>
        <div className="cc-world-banner__stats">
          <div className="cc-world-banner__stat">
            <span className="cc-world-banner__stat-val">{missionProgress.completed}</span>
            <span className="cc-world-banner__stat-lbl">listos</span>
          </div>
          <div className="cc-world-banner__divider" />
          <div className="cc-world-banner__stat">
            <span className="cc-world-banner__stat-val">{missionProgress.total}</span>
            <span className="cc-world-banner__stat-lbl">total</span>
          </div>
        </div>
      </div>

      {/* Quick play CTA */}
      <Link
        to={`/activities/${nextPlayableLevel.activityId}?world=${world.id}&mission=${mission.id}&level=${nextPlayableLevel.order}`}
        className="cc-mission-banner"
      >
        <div className="cc-mission-banner__icon">{completedMission ? '🔁' : '▶'}</div>
        <div className="cc-mission-banner__info">
          <span className="cc-mission-banner__label">{completedMission ? 'Repetir misión' : 'Continuar'}</span>
          <strong className="cc-mission-banner__name">{mission.title}</strong>
        </div>
        <div className="cc-mission-banner__cta">{completedMission ? '🔁' : '▶ Jugar'}</div>
      </Link>

      {/* Stages path */}
      <IslandPath
        nodes={stageNodes}
        badgeColor="#38bdf8"
        endIcon={completedMission ? '🏆' : '🎯'}
        endLabel={completedMission ? '¡Misión completada!' : 'Meta final'}
        emptyFallback={{ icon: '🎯', label: 'Retour à la carte', to: `/map/${world.id}` }}
      />
    </div>
  );
}
