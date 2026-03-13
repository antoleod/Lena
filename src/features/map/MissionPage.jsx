import { Link, useParams } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getMission, getWorldById } from '../../shared/gameplay/worldMap.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';

function getLevelState(activityProgress) {
  if (!activityProgress) return 'available';
  if (activityProgress.completed && (activityProgress.bestScore || 0) >= 10) return 'perfect';
  if (activityProgress.completed) return 'completed';
  return 'active';
}

export default function MissionPage() {
  const { t } = useLocale();
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

        <div className="module-lane">
          <article className="module-lane__card">
            <div className="module-lane__card-head">
              <div>
                <strong>Route</strong>
                <p>10 levels to clear this mission.</p>
              </div>
            </div>
            <div className="module-lane__levels">
              {mission.levels.map((level) => {
                const state = getLevelState(progress.activities[level.activityId]);
                return (
                  <Link
                    key={level.id}
                    className={`module-level-dot module-level-dot--${state}`}
                    to={`/activities/${level.activityId}?world=${world.id}&mission=${mission.id}&level=${level.order}`}
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
