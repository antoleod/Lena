import { Link, useParams } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getMissionProgress, getWorldById, getWorldProgress, worldMap } from '../../shared/gameplay/worldMap.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';

const NODE_TYPE_LABELS = {
  lesson: 'Lecon',
  checkpoint: 'Checkpoint',
  reward: 'Coffre',
  revision: 'Revision',
  boss: 'Defi final'
};

function isMissionUnlocked(world, missionOrder, progress) {
  if (world.order === 1 && missionOrder === 1) {
    return true;
  }
  if (missionOrder === 1) {
    const previousWorld = worldMap.find((entry) => entry.order === world.order - 1);
    const previousWorldProgress = previousWorld ? getWorldProgress(previousWorld, progress) : null;
    return !previousWorldProgress || previousWorldProgress.completed >= Math.max(1, Math.floor(previousWorldProgress.total * 0.4));
  }

  const previousMission = world.missions.find((entry) => entry.order === missionOrder - 1);
  const previousMissionProgress = previousMission ? getMissionProgress(previousMission, progress) : null;
  return !previousMissionProgress || previousMissionProgress.completed >= Math.max(1, Math.floor(previousMissionProgress.total * 0.4));
}

export default function WorldDetailPage() {
  const { worldId } = useParams();
  const { t } = useLocale();
  const world = getWorldById(worldId);
  const progress = getProgressSnapshot();

  if (!world) {
    return (
      <section className="panel panel--tight">
        <h2>{t('activityNotFound')}</h2>
        <Link className="text-link" to="/map">Retour</Link>
      </section>
    );
  }

  const worldProgress = getWorldProgress(world, progress);
  const checkpointMission = world.missions.find((mission) => mission.nodeType === 'checkpoint') || world.missions[4] || null;

  return (
    <div className="page-stack page-stack--compact">
      <section className="panel panel--tight panel--subject-map">
        <div className="panel__header">
          <div>
            <span className="eyebrow">Monde</span>
            <h2>{world.title}</h2>
          </div>
          <Link className="text-link" to="/map">Retour a la carte</Link>
        </div>

        <div className="detail-list">
          <div className="detail-list__row">
            <span>Progression</span>
            <strong>{worldProgress.completed}/{worldProgress.total}</strong>
          </div>
          <div className="detail-list__row">
            <span>Checkpoint</span>
            <strong>{checkpointMission?.title || 'Mission 5'}</strong>
          </div>
          <div className="detail-list__row">
            <span>Coffre</span>
            <strong>+25 {t('crystals')}</strong>
          </div>
        </div>

        <div className="world-map-track world-map-track--missions">
          {world.missions.map((mission, index) => {
            const missionProgress = getMissionProgress(mission, progress);
            const unlocked = isMissionUnlocked(world, mission.order, progress);
            const completed = missionProgress.completed >= missionProgress.total;
            const active = unlocked && !completed && missionProgress.completed > 0;
            const stateLabel = !unlocked ? 'Bloquee' : completed ? 'Terminee' : active ? 'En cours' : 'A jouer';
            const reward = mission.nodeType === 'checkpoint' || mission.nodeType === 'reward' ? '+25 crystals' : mission.nodeType === 'boss' ? '+1 etoile' : '+10 crystals';

            const content = (
              <>
                <span className="world-map-track__number">{mission.order}</span>
                <strong>{mission.title}</strong>
                <small>{NODE_TYPE_LABELS[mission.nodeType] || 'Lecon'}</small>
                <small>{stateLabel}</small>
                <small>{missionProgress.completed}/{missionProgress.total}</small>
                <small>{reward}</small>
              </>
            );

            if (!unlocked) {
              return (
                <article
                  key={mission.id}
                  className="world-map-track__node world-map-track__node--locked"
                  style={{ animationDelay: `${index * 60}ms` }}
                  title="Termine la mission precedente pour ouvrir celle-ci."
                >
                  {content}
                </article>
              );
            }

            return (
              <Link
                key={mission.id}
                className={`world-map-track__node${active ? ' world-map-track__node--in-progress' : completed ? ' world-map-track__node--completed' : ''}`}
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
