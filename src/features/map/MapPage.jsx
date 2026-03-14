import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { worldMap, getWorldProgress } from '../../shared/gameplay/worldMap.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';

const SKILL_LABELS = {
  mathematics: 'Matematicas',
  reasoning: 'Logica',
  french: 'Lenguaje',
  dutch: 'Vocabulario',
  english: 'Vocabulario',
  spanish: 'Vocabulario',
  stories: 'Lenguaje'
};

function getWorldState(world, focusWorlds, progress) {
  const worldProgress = getWorldProgress(world, progress);
  const previousWorld = focusWorlds.find((entry) => entry.order === world.order - 1);
  const previousProgress = previousWorld ? getWorldProgress(previousWorld, progress) : null;
  const unlocked = world.order === focusWorlds[0]?.order || !previousProgress || previousProgress.completed >= Math.max(1, Math.floor(previousProgress.total * 0.4));

  if (!unlocked) return 'locked';
  if (worldProgress.completed === 0) return 'active';
  if (worldProgress.completed >= worldProgress.total) return 'completed';
  return 'in-progress';
}

function getWorldSkills(world) {
  return [...new Set((world.subjectIds || []).map((subjectId) => SKILL_LABELS[subjectId]).filter(Boolean))];
}

export default function MapPage() {
  const { t } = useLocale();
  const progress = getProgressSnapshot();
  const focusWorlds = worldMap.filter((world) => world.gradeIds.some((gradeId) => gradeId === 'P2' || gradeId === 'P3'));

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

        <div className="tag-list">
          <span className="tag-chip tag-chip--static">P2</span>
          <span className="tag-chip tag-chip--static">P3</span>
          <span className="tag-chip tag-chip--static">{t('missions')}</span>
        </div>

        <div className="world-map-track">
          {focusWorlds.map((world, index) => {
            const progressInfo = getWorldProgress(world, progress);
            const state = getWorldState(world, focusWorlds, progress);
            const skills = getWorldSkills(world);
            const stateLabel = state === 'locked'
              ? 'Bloqueado'
              : state === 'active'
                ? 'Activo'
                : state === 'completed'
                  ? 'Completado'
                  : 'En progreso';
            const stateIcon = state === 'locked'
              ? '🔒'
              : state === 'active'
                ? '✨'
                : state === 'completed'
                  ? '🏁'
                  : '▶';

            const content = (
              <>
                <span className="world-map-track__number">{world.order}</span>
                <strong>{world.name}</strong>
                <small>{stateIcon} {stateLabel}</small>
                <small>{progressInfo.completed}/{progressInfo.total}</small>
                {skills.length ? (
                  <span className="tag-list">
                    {skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="tag-chip tag-chip--static">{skill}</span>
                    ))}
                  </span>
                ) : null}
              </>
            );

            if (state === 'locked') {
              return (
                <article
                  key={world.id}
                  className={`world-map-track__node world-map-track__node--${state}`}
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  {content}
                </article>
              );
            }

            return (
              <Link
                key={world.id}
                className={`world-map-track__node world-map-track__node--${state}`}
                to={`/map/${world.id}`}
                style={{ animationDelay: `${index * 70}ms` }}
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
