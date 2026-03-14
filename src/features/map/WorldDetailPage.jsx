import { Link, useParams } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getWorldById, getMissionProgress, getWorldProgress, worldMap } from '../../shared/gameplay/worldMap.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';

function isMissionUnlocked(world, missionOrder, progress) {
  if (world.order === 1 && missionOrder === 1) {
    return true;
  }
  if (missionOrder === 1) {
    const previousWorld = worldMap.find((entry) => entry.order === world.order - 1);
    const previousWorldProgress = previousWorld ? getWorldProgress(previousWorld, progress) : null;
    return !previousWorldProgress || previousWorldProgress.completed >= 40;
  }

  const previousMission = world.missions.find((entry) => entry.order === missionOrder - 1);
  const previousMissionProgress = previousMission ? getMissionProgress(previousMission, progress) : null;
  return !previousMissionProgress || previousMissionProgress.completed >= 7;
}

export default function WorldDetailPage() {
  const { t } = useLocale();
  const { worldId } = useParams();
  const world = getWorldById(worldId);
  const progress = getProgressSnapshot();

  if (!world) {
    return (
      <section className="panel panel--tight">
        <h2>{t('activityNotFound')}</h2>
        <Link className="text-link" to="/map">{t('backHome')}</Link>
      </section>
    );
  }

  const worldProgress = getWorldProgress(world, progress);

  return (
    <div className="page-stack page-stack--compact">
      <section className="panel panel--tight panel--subject-map">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{t('missions')}</span>
            <h2>{world.name}</h2>
          </div>
          <span className="pill">{worldProgress.completed}/{worldProgress.total}</span>
        </div>
        <div className="world-map-track world-map-track--missions">
          {world.missions.map((mission, index) => {
            const missionProgress = getMissionProgress(mission, progress);
            const unlocked = isMissionUnlocked(world, mission.order, progress);
            const content = (
              <>
                <span className="world-map-track__number">{mission.order}</span>
                <strong>{t('missions')} {mission.order}</strong>
                <small>{missionProgress.completed}/{missionProgress.total}</small>
              </>
            );

            if (!unlocked) {
              return (
                <article
                  key={mission.id}
                  className="world-map-track__node world-map-track__node--locked"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {content}
                </article>
              );
            }

            return (
              <Link
                key={mission.id}
                className="world-map-track__node"
                to={`/map/${world.id}/missions/${mission.id}`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
