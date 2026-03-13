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
      <section className="panel panel--tight">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{t('missions')}</span>
            <h2>{t('worldMapTitle') || 'Adventure map'}</h2>
          </div>
          <Link className="text-link" to="/">{t('backHome')}</Link>
        </div>

        <div className="world-ribbon">
          {worldMap.map((world, index) => {
            const progressInfo = getWorldProgress(world, progress);
            const state = getWorldState(world, progress);
            return (
              <Link key={world.id} className={`world-compact world-compact--${state}`} to={`/map/${world.id}`}>
                <span className="world-compact__order">{index + 1}</span>
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
