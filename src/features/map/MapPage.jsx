import { Link } from 'react-router-dom';
import { worldMap } from '../../shared/gameplay/worldMap.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';
import { getAdventureDashboard, getWorldNodeSummary } from '../../shared/gameplay/adventureProgress.js';
import { WORLD_STYLES } from '../../shared/gameplay/worldThemes.js';
import { isWorldBlocked } from '../../services/storage/parentalStore.js';

// Candy Crush winding path: column positions per row index
// 0=left, 1=center, 2=right
const PATH_COLS = [1, 2, 1, 0, 1, 2, 1, 0, 1, 2, 1, 0, 1, 2, 1];

// Node shapes cycle: circle, rounded-square, diamond, hexagon-like, shield
const NODE_SHAPES = ['circle', 'squircle', 'diamond', 'squircle', 'circle'];

function Stars({ count }) {
  return (
    <div className="cc-stars">
      {[1, 2, 3].map(i => (
        <span key={i} className={i <= count ? 'cc-star cc-star--on' : 'cc-star cc-star--off'}>★</span>
      ))}
    </div>
  );
}

function PathSegment({ fromCol, toCol }) {
  // Draws the SVG curved connector between two nodes
  const colToX = (col) => [15, 50, 85][col];
  const x1 = colToX(fromCol);
  const x2 = colToX(toCol);
  const cx = (x1 + x2) / 2;

  return (
    <div className="cc-path-segment" aria-hidden="true">
      <svg viewBox="0 0 100 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d={`M ${x1} 0 C ${cx} 0, ${cx} 60, ${x2} 60`}
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="4 6"
        />
        <path
          d={`M ${x1} 0 C ${cx} 0, ${cx} 60, ${x2} 60`}
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="14"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function WorldNode({ world, summary, style, index, col, isCurrent, isLocked }) {
  const shape = NODE_SHAPES[index % NODE_SHAPES.length];
  const colClass = ['cc-col--left', 'cc-col--center', 'cc-col--right'][col];
  const stateClass = isCurrent ? 'cc-node--current' : isLocked ? 'cc-node--locked' : summary.stars === 3 ? 'cc-node--complete' : '';

  const inner = (
    <div className={`cc-node ${stateClass} cc-node--${shape} ${colClass}`} style={{ '--node-color': style.color, '--node-shadow': style.shadow, '--node-bg': style.bg, animationDelay: `${index * 80}ms` }}>
      {isCurrent && <div className="cc-node__arrow">▼</div>}

      <div className="cc-node__body">
        {isLocked
          ? <span className="cc-node__emoji">🔒</span>
          : <span className="cc-node__emoji">{style.emoji}</span>
        }
        {summary.stars === 3 && !isLocked && (
          <div className="cc-node__emoji-crown">👑</div>
        )}
      </div>

      <div className="cc-node__label">
        <span className="cc-node__num">{world.order}</span>
      </div>

      <Stars count={summary.stars} />

      {!isLocked && (
        <div className="cc-node__deco" aria-hidden="true">{style.deco}</div>
      )}

      {isCurrent && (
        <div className="cc-node__pulse" aria-hidden="true" />
      )}
    </div>
  );

  if (isLocked) {
    return <div className="cc-node-slot">{inner}</div>;
  }

  return (
    <div className="cc-node-slot">
      <Link to={`/map/${world.id}`} className="cc-node-link" title={world.title}>
        {inner}
        <span className="cc-node__title">{world.title}</span>
      </Link>
    </div>
  );
}

export default function MapPage() {
  const progress = getProgressSnapshot();
  const adventure = getAdventureDashboard(progress);
  const currentWorldId = adventure.nextTarget?.world?.id || null;

  const totalCompleted = adventure.completedNodes;
  const totalNodes = adventure.totalNodes;
  const overallPercent = totalNodes ? Math.round((totalCompleted / totalNodes) * 100) : 0;

  // Determine which worlds are locked (past current in sequence)
  const currentWorldOrder = worldMap.find(w => w.id === currentWorldId)?.order ?? 999;

  return (
    <div className="cc-map-page" data-testid="map-page">
      {/* Floating top bar */}
      <div className="cc-topbar">
        <Link className="cc-back-btn" to="/">←</Link>
        <div className="cc-topbar__title">Mapa de Aventura</div>
        <div className="cc-topbar__progress">
          <div className="cc-xp-bar">
            <div className="cc-xp-fill" style={{ width: `${overallPercent}%` }} />
          </div>
          <span className="cc-xp-text">{overallPercent}%</span>
        </div>
      </div>

      {/* Current mission banner */}
      {adventure.nextTarget && (
        <Link to={adventure.nextTarget.route} className="cc-mission-banner">
          <div className="cc-mission-banner__icon">🎯</div>
          <div className="cc-mission-banner__info">
            <span className="cc-mission-banner__label">Misión actual</span>
            <strong className="cc-mission-banner__name">
              {adventure.nextTarget.mission?.title || adventure.nextTarget.world?.title}
            </strong>
          </div>
          <div className="cc-mission-banner__cta">▶ Jugar</div>
        </Link>
      )}

      {/* Candy Crush path */}
      <div className="cc-path-canvas">
        {/* Background decorations */}
        <div className="cc-bg-clouds" aria-hidden="true">
          <span className="cc-cloud" style={{ top: '8%', left: '5%', fontSize: '2rem', animationDelay: '0s' }}>☁️</span>
          <span className="cc-cloud" style={{ top: '20%', right: '8%', fontSize: '1.5rem', animationDelay: '1.2s' }}>☁️</span>
          <span className="cc-cloud" style={{ top: '38%', left: '3%', fontSize: '1.8rem', animationDelay: '2.5s' }}>☁️</span>
          <span className="cc-cloud" style={{ top: '55%', right: '5%', fontSize: '1.4rem', animationDelay: '0.8s' }}>☁️</span>
          <span className="cc-cloud" style={{ top: '72%', left: '6%', fontSize: '2rem', animationDelay: '1.8s' }}>☁️</span>
        </div>

        <div className="cc-grid">
          {worldMap.map((world, index) => {
            const col = PATH_COLS[index % PATH_COLS.length];
            const style = WORLD_STYLES[(world.order - 1) % WORLD_STYLES.length];
            const summary = getWorldNodeSummary(world, progress);
            const isCurrent = world.id === currentWorldId;
            const isLocked = world.order > currentWorldOrder + 1 || isWorldBlocked(world.id);
            const nextCol = index < worldMap.length - 1 ? PATH_COLS[(index + 1) % PATH_COLS.length] : null;

            return (
              <div key={world.id} className="cc-row">
                <WorldNode
                  world={world}
                  summary={summary}
                  style={style}
                  index={index}
                  col={col}
                  isCurrent={isCurrent}
                  isLocked={isLocked}
                />
                {nextCol !== null && (
                  <PathSegment fromCol={col} toCol={nextCol} />
                )}
              </div>
            );
          })}

          {/* End trophy */}
          <div className="cc-row">
            <div className="cc-end-trophy" style={{ '--col': PATH_COLS[worldMap.length % PATH_COLS.length] }}>
              <span>🏆</span>
              <span className="cc-end-trophy__label">¡Fin del viaje!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
