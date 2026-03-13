import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { worldMap } from '../../shared/gameplay/worldMap.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';
import { getProfile } from '../../services/storage/profileStore.js';

function computeWorldState(world, progress, profile) {
  const unlocked = profile.worldsUnlocked.includes(world.id);
  if (!world.missions.length) {
    return 'locked';
  }

  const allLevels = world.missions.flatMap((mission) => mission.levels);
  const completedCount = allLevels.filter((level) => {
    const activity = progress.activities[level.moduleId];
    return activity?.completed;
  }).length;

  if (!unlocked) {
    return 'locked';
  }
  if (completedCount === 0) {
    return 'available';
  }
  if (completedCount === allLevels.length) {
    return 'perfect';
  }
  return 'in_progress';
}

export default function MapPage() {
  const { t } = useLocale();
  const progress = getProgressSnapshot();
  const profile = getProfile();

  const visibleWorlds = worldMap.filter((world) => world.missions.length > 0);

  return (
    <div className="page-stack">
      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{t('missions')}</span>
            <h3>{t('chooseUniverse')}</h3>
          </div>
        </div>
        <div className="world-map-grid">
          {visibleWorlds.map((world) => {
            const state = computeWorldState(world, progress, profile);
            const className = `world-node world-node--${state}`;

            return (
              <Link
                key={world.id}
                to={`/map/${world.id}`}
                className={className}
              >
                <span className="world-node__icon" aria-hidden="true">{world.icon}</span>
                <h4>{world.name}</h4>
                <p>{state === 'locked' ? '🔒' : ''}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

