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

        <div className="level-grid">
          {mission.levels.map((level) => {
            const state = getLevelState(progress.activities[level.activityId]);
            return (
              <Link
                key={level.id}
                className={`level-card level-card--${state}`}
                to={`/activities/${level.activityId}?world=${world.id}&mission=${mission.id}&level=${level.order}`}
              >
                <span className="level-card__order">{level.order}</span>
                <strong>{level.title}</strong>
                <small>{level.gradeId} · {level.estimatedDurationMin} min</small>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
