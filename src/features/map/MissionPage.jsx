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

function buildMissionStages(mission, progress, t) {
  const totalLevels = mission.levels.length;
  const examOrder = totalLevels;
  const challengeOrder = totalLevels >= 3 ? totalLevels - 1 : null;
  const practiceLevels = mission.levels.filter((level) =>
    challengeOrder ? level.order < challengeOrder : level.order < examOrder
  );
  const challengeLevel = challengeOrder ? mission.levels.find((level) => level.order === challengeOrder) : null;
  const examLevel = mission.levels.find((level) => level.order === examOrder) || null;

  const stages = [
    {
      id: 'practice',
      title: t('missionPracticeLabel'),
      summary: totalLevels <= 2 ? 'Premiere etape pour entrer dans la mission.' : 'Lecons courtes pour prendre confiance.',
      levels: practiceLevels,
      launchLevel: practiceLevels.find((level) => !getLevelProgressRecord(progress, level)?.completed) || practiceLevels[0] || null
    },
    {
      id: 'challenge',
      title: t('missionChallengeLabel'),
      summary: 'Un defi plus dense avant la verification finale.',
      levels: challengeLevel ? [challengeLevel] : [],
      launchLevel: challengeLevel
    },
    {
      id: 'exam',
      title: t('missionExamLabel'),
      summary: 'Le point de controle qui termine la mission.',
      levels: examLevel ? [examLevel] : [],
      launchLevel: examLevel
    }
  ];

  return stages
    .map((stage) => {
      const total = stage.levels.length;
      const completed = stage.levels.filter((level) => getLevelProgressRecord(progress, level)?.completed).length;
      const status = completed >= total && total > 0 ? 'completed' : completed > 0 ? 'in-progress' : 'available';

      return {
        ...stage,
        total,
        completed,
        status
      };
    })
    .filter((stage) => stage.total > 0);
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
  const nextPlayableLevel =
    mission.levels.find((level) => !getLevelProgressRecord(progress, level)?.completed) || mission.levels[0];
  const stages = buildMissionStages(mission, progress, t);

  return (
    <div className="page-stack page-stack--compact">
      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{world.name}</span>
            <h2>{mission.title}</h2>
          </div>
          <Link className="text-link" to={`/map/${world.id}`}>{t('back')}</Link>
        </div>

        {showCompletionBanner ? (
          <div className="completion-banner completion-banner--compact celebration-shell">
            <div className="celebration-stars" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="pill">{perfectMission ? t('missionPerfectLabel') : t('missionDone')}</span>
            <h3>{perfectMission ? `${t('missionExamLabel')} · ${t('missionPerfectLabel')}` : t('missionCompleteLabel')}</h3>
            <p>+{completionReward} {t('crystals')}</p>
            <div className="dashboard-actions">
              {nextTarget ? (
                <Link
                  className="primary-action"
                  to={`/activities/${nextTarget.activityId}?world=${nextTarget.worldId}&mission=${nextTarget.missionId}&level=${nextTarget.levelOrder}`}
                >
                  <span className="button-icon" aria-hidden="true">▶</span>
                  <span>{t('continue')}</span>
                </Link>
              ) : (
                <Link className="primary-action" to={`/map/${world.id}`}>
                  <span className="button-icon" aria-hidden="true">🗺</span>
                  <span>{t('missions')}</span>
                </Link>
              )}
              <Link className="secondary-action" to={`/map/${world.id}`}>
                <span className="button-icon" aria-hidden="true">↩</span>
                <span>{t('back')}</span>
              </Link>
            </div>
          </div>
        ) : null}

        <div className="detail-list">
          <div className="detail-list__row">
            <span>{t('missionRouteLabel')}</span>
            <strong>{missionProgress.completed}/{missionProgress.total}</strong>
          </div>
          <div className="detail-list__row">
            <span>Recompense</span>
            <strong>+10 {t('crystals')}</strong>
          </div>
          <div className="detail-list__row">
            <span>Derniere etape</span>
            <strong>{completedMission ? t('missionDone') : t('missionExamLabel')}</strong>
          </div>
        </div>

        <div className="dashboard-actions">
          <Link
            className="primary-action"
            to={`/activities/${nextPlayableLevel.activityId}?world=${world.id}&mission=${mission.id}&level=${nextPlayableLevel.order}`}
          >
            <span className="button-icon" aria-hidden="true">{completedMission ? '🔁' : '▶'}</span>
            <span>{completedMission ? t('start') : t('continue')}</span>
          </Link>
        </div>

        <div className="module-lane">
          {stages.map((stage) => (
            <article key={stage.id} className="module-lane__card">
              <div className="module-lane__card-head">
                <div>
                  <strong>{stage.title}</strong>
                  <p>{stage.summary}</p>
                </div>
                <span className="pill">{stage.completed}/{stage.total}</span>
              </div>

              <div className="grade-map__progress">
                <i style={{ width: `${stage.total ? Math.max(Math.round((stage.completed / stage.total) * 100), stage.completed ? 14 : 0) : 0}%` }}></i>
              </div>

              <div className="tag-list">
                <span className="tag-chip tag-chip--static">
                  {stage.levels[0].order}{stage.total > 1 ? `-${stage.levels[stage.levels.length - 1].order}` : ''} · {stage.title}
                </span>
                <span className="tag-chip tag-chip--static">
                  {stage.status === 'completed' ? t('completed') : stage.status === 'in-progress' ? t('continue') : t('start')}
                </span>
              </div>

              {stage.launchLevel ? (
                <div className="module-lane__footer">
                  <small>{stage.total} etape{stage.total > 1 ? 's' : ''} jouable{stage.total > 1 ? 's' : ''}</small>
                  <Link
                    className="primary-action"
                    to={`/activities/${stage.launchLevel.activityId}?world=${world.id}&mission=${mission.id}&level=${stage.launchLevel.order}`}
                  >
                    <span className="button-icon" aria-hidden="true">{stage.status === 'completed' ? '🔁' : '▶'}</span>
                    <span>{stage.status === 'completed' ? t('launch') : stage.title}</span>
                  </Link>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
