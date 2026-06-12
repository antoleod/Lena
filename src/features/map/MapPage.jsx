import { Link } from 'react-router-dom';
import { worldMap, getWorldProgress } from '../../shared/gameplay/worldMap.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';
import { getAdventureDashboard, getWorldNodeSummary } from '../../shared/gameplay/adventureProgress.js';
import { WORLD_STYLES } from '../../shared/gameplay/worldThemes.js';
import { isWorldBlocked } from '../../services/storage/parentalStore.js';
import IslandPath from '../grade/IslandPath.jsx';

export default function MapPage() {
  const progress = getProgressSnapshot();
  const adventure = getAdventureDashboard(progress);
  const currentWorldId = adventure.nextTarget?.world?.id || null;

  const totalCompleted = adventure.completedNodes;
  const totalNodes = adventure.totalNodes;
  const overallPercent = totalNodes ? Math.round((totalCompleted / totalNodes) * 100) : 0;

  const nodes = worldMap.map((world, index) => {
    const style = WORLD_STYLES[(world.order - 1) % WORLD_STYLES.length];
    const summary = getWorldNodeSummary(world, progress);
    const wp = getWorldProgress(world, progress);
    const progressPct = wp.total ? Math.round((wp.completed / wp.total) * 100) : 0;
    const locked = isWorldBlocked(world.id);
    return {
      id: world.id,
      title: world.title,
      launchTo: `/map/${world.id}`,
      pct: progressPct,
      isActive: world.id === currentWorldId,
      complete: summary.stars === 3,
      glyph: style.emoji,
      locked,
    };
  });

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

      {/* Floating-island world path */}
      <IslandPath
        nodes={nodes}
        badgeColor="#38bdf8"
        endIcon="🏆"
        endLabel="¡Fin del viaje!"
      />
    </div>
  );
}
