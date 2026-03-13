import { Link, useParams } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { worldMap, getWorldById } from '../../shared/gameplay/worldMap.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';
import { getProfile } from '../../services/storage/profileStore.js';
import { getModuleById } from '../curriculum/catalog.js';

function levelState(level, progress) {
  const activity = progress.activities[level.moduleId];
  if (!activity) return 'available';
  if (activity.completed && activity.bestScore >= 0.9 * 10) {
    return 'perfect';
  }
  if (activity.completed) {
    return 'completed';
  }
  return 'in_progress';
}

export default function WorldDetailPage() {
  const { t } = useLocale();
  const { worldId } = useParams();
  const world = getWorldById(worldId);
  const profile = getProfile();
  const progress = getProgressSnapshot();

  if (!world || !world.missions.length) {
    return (
      <section className="section-block">
        <h2>{t('activityNotFound')}</h2>
        <Link className="text-link" to="/map">{t('backHome')}</Link>
      </section>
    );
  }

  const unlocked = profile.worldsUnlocked.includes(world.id);
  if (!unlocked) {
    return (
      <section className="section-block">
        <h2>{world.name}</h2>
        <p>🔒 {t('activityNotFound')}</p>
        <Link className="text-link" to="/map">{t('backHome')}</Link>
      </section>
    );
  }

  return (
    <div className="page-stack">
      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{world.order} / 12</span>
            <h3>{world.name}</h3>
          </div>
        </div>
        <div className="mission-path">
          {world.missions.map((mission) => (
            <div key={mission.id} className="mission-strip">
              <h4>{t('missions')} {mission.order}</h4>
              <div className="level-strip">
                {mission.levels.map((level) => {
                  const module = getModuleById(level.moduleId);
                  const state = levelState(level, progress);
                  const nodeClass = `level-node level-node--${state}`;
                  return (
                    <Link
                      key={level.id}
                      to={`/subjects/${module.subjectId}/grades/${module.gradeId}/modules/${module.id}`}
                      className={nodeClass}
                    >
                      <span aria-hidden="true">●</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

