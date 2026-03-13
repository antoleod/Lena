import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { worldMap, getWorldProgress } from '../../shared/gameplay/worldMap.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';

function getWorldState(world, progress) {
  const worldProgress = getWorldProgress(world, progress);
  if (world.order === 1) {
    return worldProgress.completed ? 'in-progress' : 'active';
  }

  const previousWorld = worldMap.find((entry) => entry.order === world.order - 1);
  const previousProgress = previousWorld ? getWorldProgress(previousWorld, progress) : null;
  const unlocked = !previousProgress || previousProgress.completed >= 40;

  if (!unlocked) return 'locked';
  if (worldProgress.completed === 0) return 'active';
  if (worldProgress.completed === worldProgress.total) return 'perfect';
  return 'in-progress';
}

export default function MapPage() {
  const { t } = useLocale();
  const progress = getProgressSnapshot();

  return (
    <div className="page-stack page-stack--compact">
      <section className="panel panel--tight panel--subject-map">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{t('missions')}</span>
            <h2>{t('worldMapTitle') || 'Adventure map'}</h2>
          </div>
          <Link className="text-link" to="/">{t('backHome')}</Link>
        </div>
        <div className="world-map-track">
          {worldMap.map((world, index) => {
            const progressInfo = getWorldProgress(world, progress);
            const state = getWorldState(world, progress);
            return (
              <Link
                key={world.id}
                className={`world-map-track__node world-map-track__node--${state}`}
                to={`/map/${world.id}`}
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <span className="world-map-track__number">{world.order}</span>
                <strong>{world.name}</strong>
                <small>{progressInfo.completed}/{progressInfo.total}</small>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
