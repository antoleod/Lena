import { Link, useSearchParams, useParams } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getLevelProgressRecord, getMission, getMissionProgress, getNextMissionTarget, getWorldById } from '../../shared/gameplay/worldMap.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';

function getLevelState(activityProgress) {
  if (!activityProgress) return 'available';
  if (activityProgress.completed && (activityProgress.bestScore || 0) >= 10) return 'perfect';
  if (activityProgress.completed) return 'completed';
  return 'active';
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
  const nextPlayableLevel = mission.levels.find((level) => !getLevelProgressRecord(progress, level)?.completed) || mission.levels[0];

  return (
    <div className="page-stack page-stack--compact">
      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{world.name}</span>
            <h2>{t('missions')} {mission.order}</h2>
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
                  {t('continue')}
                </Link>
              ) : (
                <Link className="primary-action" to={`/map/${world.id}`}>{t('missions')}</Link>
              )}
              <Link className="secondary-action" to={`/map/${world.id}`}>{t('back')}</Link>
            </div>
          </div>
        ) : null}

        <div className="tag-list">
          <span className="tag-chip tag-chip--static">1-8 {t('missionPracticeLabel')}</span>
          <span className="tag-chip tag-chip--static">9 {t('missionChallengeLabel')}</span>
          <span className="tag-chip tag-chip--static">10 {t('missionExamLabel')}</span>
        </div>

        <div className="dashboard-actions">
          <Link
            className="primary-action"
            to={`/activities/${nextPlayableLevel.activityId}?world=${world.id}&mission=${mission.id}&level=${nextPlayableLevel.order}`}
          >
            {completedMission ? t('start') : t('continue')}
          </Link>
        </div>

        <div className="module-lane">
          <article className="module-lane__card">
            <div className="module-lane__card-head">
              <div>
                <strong>{t('missionRouteLabel')}</strong>
                <p>1-8 {t('missionPracticeLabel')} · 9 {t('missionChallengeLabel')} · 10 {t('missionExamLabel')}</p>
              </div>
              <span className="pill">{missionProgress.completed}/{missionProgress.total}</span>
            </div>
            <div className="module-lane__levels">
              {mission.levels.map((level) => {
                const state = getLevelState(getLevelProgressRecord(progress, level));
                return (
                  <Link
                    key={level.id}
                    className={`module-level-dot module-level-dot--${state}`}
                    to={`/activities/${level.activityId}?world=${world.id}&mission=${mission.id}&level=${level.order}`}
                    title={level.order === 9 ? t('missionChallengeLabel') : level.order === 10 ? t('missionExamLabel') : t('missionPracticeLabel')}
                  >
                    {level.order}
                  </Link>
                );
              })}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
