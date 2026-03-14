import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { worldMap } from '../../shared/gameplay/worldMap.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';
import { getAdventureDashboard, getWorldNodeSummary } from '../../shared/gameplay/adventureProgress.js';

const WORLD_VISUALS = [
  { emoji: '🌱', theme: 'linear-gradient(135deg, #a8edea, #fed6e3)', label: 'Mundo 1' },
  { emoji: '🌊', theme: 'linear-gradient(135deg, #4facfe, #00f2fe)', label: 'Mundo 2' },
  { emoji: '🔥', theme: 'linear-gradient(135deg, #fa709a, #fee140)', label: 'Mundo 3' },
  { emoji: '⚡', theme: 'linear-gradient(135deg, #667eea, #764ba2)', label: 'Mundo 4' },
  { emoji: '🌟', theme: 'linear-gradient(135deg, #ffecd2, #fcb69f)', label: 'Mundo 5' },
];

const SKILL_LABELS = {
  mathematics: '🔢 Mates',
  reasoning: '🧩 Lógica',
  french: '✍️ Francés',
  dutch: '🗣️ Holandés',
  english: '🌍 Inglés',
  spanish: '🌞 Español',
  stories: '📖 Lectura',
};

function getWorldState(world, focusWorlds, progress, currentWorldId) {
  const summary = getWorldNodeSummary(world, progress);
  const previousWorld = focusWorlds.find((entry) => entry.order === world.order - 1);
  const previousSummary = previousWorld ? getWorldNodeSummary(previousWorld, progress) : null;
  const unlocked =
    world.order === focusWorlds[0]?.order ||
    !previousSummary ||
    previousSummary.completed >= Math.max(1, Math.floor(previousSummary.total * 0.4));

  if (!unlocked) return 'locked';
  if (world.id === currentWorldId) return summary.completed === 0 ? 'active' : 'in-progress';
  if (summary.completed >= summary.total) return 'completed';
  if (summary.completed > 0) return 'in-progress';
  return 'available';
}

function WorldCard({ world, state, summary, visual, index, currentWorldId }) {
  const isLocked = state === 'locked';
  const isCurrent = world.id === currentWorldId;
  const skills = [...new Set((world.subjectIds || []).map((id) => SKILL_LABELS[id]).filter(Boolean))];

  const stateConfig = {
    locked:      { label: 'Bloqueado', badge: '🔒', badgeClass: 'badge--locked' },
    active:      { label: 'Tu turno!',  badge: '✨', badgeClass: 'badge--active' },
    'in-progress': { label: 'En curso', badge: '▶', badgeClass: 'badge--progress' },
    completed:   { label: 'Completado', badge: '🏆', badgeClass: 'badge--done' },
    available:   { label: 'Disponible', badge: '🟢', badgeClass: 'badge--open' },
  };
  const cfg = stateConfig[state] || stateConfig.available;
  const percent = summary.total ? Math.round((summary.completed / summary.total) * 100) : 0;

  const body = (
    <div
      className={`world-card${isLocked ? ' world-card--locked' : ''}${isCurrent ? ' world-card--current' : ''}`}
      style={{ '--world-gradient': visual.theme, animationDelay: `${index * 70}ms` }}
    >
      {/* Gradient accent corner */}
      <div className="world-card__accent" aria-hidden="true" />

      <div className="world-card__top">
        <span className="world-card__num">{world.order}</span>
        <span className="world-card__emoji" aria-hidden="true">{visual.emoji}</span>
        <span className={`world-card__badge ${cfg.badgeClass}`}>
          <span aria-hidden="true">{cfg.badge}</span> {cfg.label}
        </span>
      </div>

      <h3 className="world-card__title">{world.title || visual.label}</h3>

      {/* Progress bar */}
      <div className="world-card__progress">
        <div className="world-card__progress-bar">
          <div
            className="world-card__progress-fill"
            style={{ width: `${Math.max(percent, summary.completed > 0 ? 6 : 0)}%` }}
          />
        </div>
        <span className="world-card__progress-label">{summary.completed}/{summary.total}</span>
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="world-card__skills">
          {skills.slice(0, 3).map((skill) => (
            <span key={skill} className="world-card__skill">{skill}</span>
          ))}
        </div>
      )}

      {isLocked && (
        <div className="world-card__lock-overlay" aria-hidden="true">
          <span>🔒</span>
          <small>Completa el mundo anterior</small>
        </div>
      )}
    </div>
  );

  if (isLocked) {
    return <div key={world.id} data-testid={`world-${world.id}-locked`}>{body}</div>;
  }

  return (
    <Link key={world.id} to={`/map/${world.id}`} data-testid={`world-${world.id}`}>
      {body}
    </Link>
  );
}

export default function MapPage() {
  const { t } = useLocale();
  const progress = getProgressSnapshot();
  const focusWorlds = worldMap.filter((world) =>
    world.order <= 5 && world.gradeIds.some((gradeId) => gradeId === 'P2' || gradeId === 'P3')
  );
  const adventure = getAdventureDashboard(progress);
  const currentWorldId = adventure.nextTarget?.world?.id || null;

  const totalCompleted = focusWorlds.reduce((sum, world) => {
    const s = getWorldNodeSummary(world, progress);
    return sum + s.completed;
  }, 0);
  const totalNodes = focusWorlds.reduce((sum, world) => {
    const s = getWorldNodeSummary(world, progress);
    return sum + s.total;
  }, 0);
  const overallPercent = totalNodes ? Math.round((totalCompleted / totalNodes) * 100) : 0;

  return (
    <div className="page-stack page-stack--compact" data-testid="map-page">
      {/* Hero */}
      <section className="panel panel--tight map-hero">
        <div className="panel__header">
          <div>
            <span className="eyebrow">Gran Aventura</span>
            <h1 style={{ margin: '4px 0 8px', fontFamily: "'Fredoka', sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
              {t('worldMapTitle') || 'Mapa de la Aventura'}
            </h1>
          </div>
          <Link className="text-link" to="/">← Volver</Link>
        </div>

        {adventure.nextTarget && (
          <div className="map-hero__current">
            <div className="map-hero__current-info">
              <span className="eyebrow">Próxima misión</span>
              <strong>{adventure.nextTarget.mission?.title || adventure.nextTarget.world?.title}</strong>
            </div>
            <Link
              className="map-hero__cta"
              to={adventure.nextTarget.route}
            >
              <span>▶ Continuar</span>
            </Link>
          </div>
        )}

        {/* Overall progress */}
        <div className="map-hero__overall">
          <div className="map-hero__progress-bar">
            <div className="map-hero__progress-fill" style={{ width: `${Math.max(overallPercent, overallPercent > 0 ? 3 : 0)}%` }} />
          </div>
          <span className="map-hero__progress-text">
            {totalCompleted}/{totalNodes} nodos · {overallPercent}% completado
          </span>
        </div>
      </section>

      {/* World grid */}
      <div className="map-worlds-grid">
        {focusWorlds.map((world, index) => {
          const summary = getWorldNodeSummary(world, progress);
          const state = getWorldState(world, focusWorlds, progress, currentWorldId);
          const visual = WORLD_VISUALS[(world.order - 1) % WORLD_VISUALS.length];

          return (
            <WorldCard
              key={world.id}
              world={world}
              state={state}
              summary={summary}
              visual={visual}
              index={index}
              currentWorldId={currentWorldId}
            />
          );
        })}
      </div>
    </div>
  );
}
