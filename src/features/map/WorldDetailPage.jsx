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

  return (
    <div className="page-stack page-stack--compact">
      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{t('missions')}</span>
            <h2>{world.name}</h2>
          </div>
          <Link className="text-link" to="/map">{t('missions')}</Link>
        </div>

        <div className="mission-list">
          {world.missions.map((mission) => {
            const missionProgress = getMissionProgress(mission, progress);
            const unlocked = isMissionUnlocked(world, mission.order, progress);
            return (
              <Link
                key={mission.id}
                className={`mission-row${unlocked ? '' : ' is-locked'}`}
                to={unlocked ? `/map/${world.id}/missions/${mission.id}` : '/map'}
              >
                <strong>{t('missions')} {mission.order}</strong>
                <span>{missionProgress.completed}/{missionProgress.total}</span>
                <small>{mission.title}</small>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
