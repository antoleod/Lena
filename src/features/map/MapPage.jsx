import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { worldMap } from '../../shared/gameplay/worldMap.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';
import { getAdventureDashboard, getWorldNodeSummary } from '../../shared/gameplay/adventureProgress.js';

const SKILL_LABELS = {
  mathematics: 'Mathematiques',
  reasoning: 'Logique',
  french: 'Langage',
  dutch: 'Vocabulaire',
  english: 'Vocabulaire',
  spanish: 'Vocabulaire',
  stories: 'Lecture'
};

const NODE_TYPE_LABELS = {
  lesson: 'Lecons',
  checkpoint: 'Checkpoint',
  reward: 'Coffre',
  revision: 'Revision',
  boss: 'Defi final'
};

function getWorldState(world, focusWorlds, progress, currentWorldId) {
  const summary = getWorldNodeSummary(world, progress);
  const previousWorld = focusWorlds.find((entry) => entry.order === world.order - 1);
  const previousSummary = previousWorld ? getWorldNodeSummary(previousWorld, progress) : null;
  const unlocked = world.order === focusWorlds[0]?.order || !previousSummary || previousSummary.completed >= Math.max(1, Math.floor(previousSummary.total * 0.4));

  if (!unlocked) return 'locked';
  if (world.id === currentWorldId) return summary.completed === 0 ? 'active' : 'in-progress';
  if (summary.completed >= summary.total) return 'completed';
  if (summary.completed > 0) return 'in-progress';
  return 'available';
}

function getWorldSkills(world) {
  return [...new Set((world.subjectIds || []).map((subjectId) => SKILL_LABELS[subjectId]).filter(Boolean))];
}

function getWorldStateMeta(state) {
  if (state === 'locked') return { label: 'Bloque', icon: '🔒' };
  if (state === 'active') return { label: 'Actuel', icon: '✨' };
  if (state === 'completed') return { label: 'Termine', icon: '🏁' };
  if (state === 'in-progress') return { label: 'En cours', icon: '▶' };
  return { label: 'Disponible', icon: '🟢' };
}

export default function MapPage() {
  const { t } = useLocale();
  const progress = getProgressSnapshot();
  const focusWorlds = worldMap.filter((world) =>
    world.order <= 5 && world.gradeIds.some((gradeId) => gradeId === 'P2' || gradeId === 'P3')
  );
  const adventure = getAdventureDashboard(progress);
  const currentWorldId = adventure.nextTarget?.world?.id || null;

  return (
    <div className="page-stack page-stack--compact" data-testid="map-page">
      <section className="panel panel--tight panel--subject-map">
        <div className="panel__header">
          <div>
            <span className="eyebrow">Grand Voyage</span>
            <h2>{t('worldMapTitle') || 'Adventure map'}</h2>
          </div>
          <Link className="text-link" to="/">Retour</Link>
        </div>

        <div className="detail-list">
          <div className="detail-list__row">
            <span>Monde actuel</span>
            <strong>{adventure.nextTarget?.world?.title || '-'}</strong>
          </div>
          <div className="detail-list__row">
            <span>Mission suivante</span>
            <strong>{adventure.nextTarget?.mission?.title || '-'}</strong>
          </div>
          <div className="detail-list__row">
            <span>Recompense</span>
            <strong>+10 {t('crystals')}</strong>
          </div>
        </div>

        <div className="world-map-track">
          {focusWorlds.map((world, index) => {
            const summary = getWorldNodeSummary(world, progress);
            const state = getWorldState(world, focusWorlds, progress, currentWorldId);
            const skills = getWorldSkills(world);
            const checkpoint = summary.checkpointMission;
            const stateMeta = getWorldStateMeta(state);

            const body = (
              <>
                <span className="world-map-track__number">{world.order}</span>
                <strong>{world.title}</strong>
                <small>{stateMeta.icon} {stateMeta.label}</small>
                <small>{summary.completed}/{summary.total} noeuds</small>
                <small>{NODE_TYPE_LABELS[checkpoint?.nodeType] || 'Checkpoint'}: {checkpoint?.title || `mission ${checkpoint?.order || 1}`}</small>
                <small>Coffre: {summary.rewardPreview}</small>
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
                  title="Termine le monde precedent pour debloquer celui-ci."
                  data-testid={`world-${world.id}-locked`}
                >
                  {body}
                </article>
              );
            }

            return (
              <Link
                key={world.id}
                className={`world-map-track__node world-map-track__node--${state}`}
                to={`/map/${world.id}`}
                style={{ animationDelay: `${index * 70}ms` }}
                data-testid={`world-${world.id}`}
              >
                {body}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
