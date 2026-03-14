import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { worldMap } from '../../shared/gameplay/worldMap.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';
import { getAdventureDashboard, getWorldNodeSummary } from '../../shared/gameplay/adventureProgress.js';

const WORLD_VISUALS = [
  { emoji: '🌱', theme: 'linear-gradient(135deg, #a8edea, #fed6e3)' },
  { emoji: '🌊', theme: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  { emoji: '🔥', theme: 'linear-gradient(135deg, #fa709a, #fee140)' },
  { emoji: '⚡', theme: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { emoji: '🌟', theme: 'linear-gradient(135deg, #ffecd2, #fcb69f)' },
  { emoji: '🚀', theme: 'linear-gradient(135deg, #d4fc79, #96e6a1)' },
  { emoji: '💎', theme: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)' },
  { emoji: '👑', theme: 'linear-gradient(135deg, #ff9a9e, #fecbef)' },
  { emoji: '🧙‍♂️', theme: 'linear-gradient(135deg, #c2e9fb, #a1c4fd)' },
];

function WorldNode({ world, summary, visual, index, currentWorldId }) {
  const isCurrent = world.id === currentWorldId;
  const isCompleted = summary.stars === 3;
  const alignment = index % 2 === 0 ? 'left' : 'right';

  return (
    <div className={`duo-node-wrapper duo-node-wrapper--${alignment}`} style={{ animationDelay: `${index * 100}ms` }}>
      {/* Decorative path line to the next node */}
      <div className="duo-path-line" aria-hidden="true" />
      
      <Link 
        to={`/map/${world.id}`} 
        className={`duo-world-node ${isCurrent ? 'is-current' : ''} ${isCompleted ? 'is-completed' : ''}`}
        title={world.title}
      >
        <div className="duo-world-core" style={{ background: visual.theme }}>
          <span className="duo-emoji" aria-hidden="true">{visual.emoji}</span>
          
          {/* Target floating badge */}
          {isCurrent && (
            <div className="duo-current-target">
              <span>🔰 Misión Actual</span>
            </div>
          )}

          {/* Stars indicator */}
          <div className="duo-stars">
            <span className={summary.stars >= 1 ? 'star-on' : 'star-off'}>★</span>
            <span className={summary.stars >= 2 ? 'star-on' : 'star-off'}>★</span>
            <span className={summary.stars >= 3 ? 'star-on' : 'star-off'}>★</span>
          </div>
        </div>
        
        <div className="duo-world-info">
          <h3>Mundo {world.order}: {world.title}</h3>
          <div className="duo-progress-pill">
            <div className="duo-progress-fill" style={{ width: `${Math.max(5, (summary.completed / summary.total) * 100)}%` }}></div>
          </div>
          <span className="duo-progress-text">{summary.completed} / {summary.total} ejercicios</span>
        </div>
      </Link>
    </div>
  );
}

export default function MapPage() {
  const { t } = useLocale();
  const progress = getProgressSnapshot();
  const focusWorlds = worldMap; // Show all worlds now
  const adventure = getAdventureDashboard(progress);
  const currentWorldId = adventure.nextTarget?.world?.id || null;

  const totalCompleted = adventure.completedNodes;
  const totalNodes = adventure.totalNodes;
  const overallPercent = totalNodes ? Math.round((totalCompleted / totalNodes) * 100) : 0;

  return (
    <div className="page-stack page-stack--compact" data-testid="map-page">
      {/* Hero Section */}
      <section className="panel panel--tight map-hero duo-map-hero">
        <div className="panel__header">
          <div>
            <span className="eyebrow">Gran Viaje</span>
            <h1 style={{ margin: '4px 0 8px', fontFamily: "'Fredoka', sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
              Mapa de la Aventura
            </h1>
          </div>
          <Link className="text-link" to="/">← Volver</Link>
        </div>

        {adventure.nextTarget && (
          <div className="map-hero__current">
            <div className="map-hero__current-info">
              <span className="eyebrow">Siguiente paso</span>
              <strong>{adventure.nextTarget.mission?.title || adventure.nextTarget.world?.title}</strong>
            </div>
            <Link className="map-hero__cta" to={adventure.nextTarget.route}>
              <span>▶ Explorar</span>
            </Link>
          </div>
        )}

        {/* Overall progress */}
        <div className="map-hero__overall">
          <div className="map-hero__progress-bar">
            <div className="map-hero__progress-fill" style={{ width: `${Math.max(overallPercent, overallPercent > 0 ? 3 : 0)}%` }} />
          </div>
          <span className="map-hero__progress-text">
            {totalCompleted} / {totalNodes} nodos superados ({overallPercent}%)
          </span>
        </div>
      </section>

      {/* Duolingo style vertical path */}
      <div className="duo-path-container">
        {focusWorlds.map((world, index) => {
          const summary = getWorldNodeSummary(world, progress);
          const visual = WORLD_VISUALS[(world.order - 1) % WORLD_VISUALS.length];

          return (
            <WorldNode
              key={world.id}
              world={world}
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
