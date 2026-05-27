import { Link, useParams } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getMissionProgress, getWorldById, getWorldProgress, worldMap } from '../../shared/gameplay/worldMap.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';

// Per-nodeType visual config
const NODE_TYPE_CONFIG = {
  lesson:     { emoji: '📖', color: '#4aa8f2', shadow: '#2878c4', bg: 'linear-gradient(145deg,#a3d8ff,#4aa8f2)', label: 'Lección' },
  checkpoint: { emoji: '🏁', color: '#f96bbd', shadow: '#c93d90', bg: 'linear-gradient(145deg,#ffc2e8,#f96bbd)', label: 'Checkpoint' },
  reward:     { emoji: '🎁', color: '#ffc34a', shadow: '#cc8c00', bg: 'linear-gradient(145deg,#ffe9a3,#ffc34a)', label: 'Recompensa' },
  revision:   { emoji: '🔄', color: '#8b5cf6', shadow: '#5b21b6', bg: 'linear-gradient(145deg,#c4b5fd,#8b5cf6)', label: 'Revisión' },
  boss:       { emoji: '⚔️', color: '#ef4444', shadow: '#991b1b', bg: 'linear-gradient(145deg,#fca5a5,#ef4444)', label: 'Desafío' },
};

const PATH_COLS = [1, 2, 1, 0, 1, 2, 1, 0, 1, 2];
const NODE_SHAPES = ['circle', 'squircle', 'diamond', 'squircle', 'circle'];

function isMissionUnlocked(world, missionOrder, progress) {
  if (world.order === 1 && missionOrder === 1) return true;
  if (missionOrder === 1) {
    const previousWorld = worldMap.find(e => e.order === world.order - 1);
    const prev = previousWorld ? getWorldProgress(previousWorld, progress) : null;
    return !prev || prev.completed >= Math.max(1, Math.floor(prev.total * 0.4));
  }
  const previousMission = world.missions.find(e => e.order === missionOrder - 1);
  const prev = previousMission ? getMissionProgress(previousMission, progress) : null;
  return !prev || prev.completed >= Math.max(1, Math.floor(prev.total * 0.4));
}

function Stars({ completed, total }) {
  const pct = total ? completed / total : 0;
  const stars = pct >= 1 ? 3 : pct >= 0.6 ? 2 : pct > 0 ? 1 : 0;
  return (
    <div className="cc-stars">
      {[1, 2, 3].map(i => (
        <span key={i} className={i <= stars ? 'cc-star cc-star--on' : 'cc-star cc-star--off'}>★</span>
      ))}
    </div>
  );
}

function PathSegment({ fromCol, toCol }) {
  const colToX = col => [15, 50, 85][col];
  const x1 = colToX(fromCol);
  const x2 = colToX(toCol);
  const cx = (x1 + x2) / 2;
  return (
    <div className="cc-path-segment" aria-hidden="true">
      <svg viewBox="0 0 100 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d={`M ${x1} 0 C ${cx} 0, ${cx} 60, ${x2} 60`}
          fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="14" strokeLinecap="round" />
        <path d={`M ${x1} 0 C ${cx} 0, ${cx} 60, ${x2} 60`}
          fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray="4 6" />
      </svg>
    </div>
  );
}

function MissionNode({ mission, missionProg, unlocked, index, col, isActive }) {
  const cfg = NODE_TYPE_CONFIG[mission.nodeType] || NODE_TYPE_CONFIG.lesson;
  const shape = NODE_SHAPES[index % NODE_SHAPES.length];
  const colClass = ['cc-col--left', 'cc-col--center', 'cc-col--right'][col];
  const completed = missionProg.completed >= missionProg.total && missionProg.total > 0;
  const isLocked = !unlocked;

  const stateClass = isActive ? 'cc-node--current' : isLocked ? 'cc-node--locked' : completed ? 'cc-node--complete' : '';

  const body = (
    <div
      className={`cc-node ${stateClass} cc-node--${shape} ${colClass}`}
      style={{ '--node-color': cfg.color, '--node-shadow': cfg.shadow, '--node-bg': cfg.bg, animationDelay: `${index * 80}ms` }}
    >
      {isActive && <div className="cc-node__arrow">▼</div>}

      <div className="cc-node__body">
        {isLocked
          ? <span className="cc-node__emoji">🔒</span>
          : <span className="cc-node__emoji">{cfg.emoji}</span>
        }
        {completed && !isLocked && <div className="cc-node__crown">✓</div>}
      </div>

      <div className="cc-node__label">
        <span className="cc-node__num">{mission.order}</span>
      </div>

      <Stars completed={missionProg.completed} total={missionProg.total} />

      {!isLocked && (
        <div className="cc-node__type-badge" style={{ background: cfg.color }}>{cfg.label}</div>
      )}

      {isActive && <div className="cc-node__pulse" />}
    </div>
  );

  return (
    <div className="cc-node-slot">
      <Link to={`/map/${mission._worldId}/missions/${mission.id}`} className="cc-node-link" title={mission.title}>
        {body}
        <span className="cc-node__title">{mission.title}</span>
      </Link>
    </div>
  );
}

export default function WorldDetailPage() {
  const { worldId } = useParams();
  const { t } = useLocale();
  const world = getWorldById(worldId);
  const progress = getProgressSnapshot();

  if (!world) {
    return (
      <section className="panel panel--tight">
        <h2>{t('activityNotFound')}</h2>
        <Link className="text-link" to="/map">Retour</Link>
      </section>
    );
  }

  const worldProgress = getWorldProgress(world, progress);
  const overallPct = worldProgress.total
    ? Math.round((worldProgress.completed / worldProgress.total) * 100)
    : 0;

  // Find the first incomplete unlocked mission = active
  const activeMissionOrder = (() => {
    for (const m of world.missions) {
      const mp = getMissionProgress(m, progress);
      const unlocked = isMissionUnlocked(world, m.order, progress);
      if (unlocked && mp.completed < mp.total) return m.order;
    }
    return null;
  })();

  // Inject worldId into missions for routing
  const missions = world.missions.map(m => ({ ...m, _worldId: world.id }));

  return (
    <div className="cc-map-page" data-testid="world-detail-page">
      {/* Top bar */}
      <div className="cc-topbar">
        <Link className="cc-back-btn" to="/map">←</Link>
        <div className="cc-topbar__title">{world.title}</div>
        <div className="cc-topbar__progress">
          <div className="cc-xp-bar">
            <div className="cc-xp-fill" style={{ width: `${overallPct}%` }} />
          </div>
          <span className="cc-xp-text">{overallPct}%</span>
        </div>
      </div>

      {/* World info banner */}
      <div className="cc-world-banner">
        <div className="cc-world-banner__left">
          <span className="cc-world-banner__eyebrow">Mundo {world.order}</span>
          <p className="cc-world-banner__desc">{world.description}</p>
        </div>
        <div className="cc-world-banner__stats">
          <div className="cc-world-banner__stat">
            <span className="cc-world-banner__stat-val">{worldProgress.completed}</span>
            <span className="cc-world-banner__stat-lbl">superados</span>
          </div>
          <div className="cc-world-banner__divider" />
          <div className="cc-world-banner__stat">
            <span className="cc-world-banner__stat-val">{worldProgress.total}</span>
            <span className="cc-world-banner__stat-lbl">total</span>
          </div>
        </div>
      </div>

      {/* Candy Crush mission path */}
      <div className="cc-path-canvas">
        <div className="cc-bg-clouds" aria-hidden="true">
          <span className="cc-cloud" style={{ top: '6%',  left: '4%',  fontSize: '1.8rem', animationDelay: '0s' }}>☁️</span>
          <span className="cc-cloud" style={{ top: '22%', right: '6%', fontSize: '1.4rem', animationDelay: '1.5s' }}>☁️</span>
          <span className="cc-cloud" style={{ top: '45%', left: '3%',  fontSize: '2rem',   animationDelay: '2.8s' }}>☁️</span>
          <span className="cc-cloud" style={{ top: '68%', right: '5%', fontSize: '1.5rem', animationDelay: '0.7s' }}>☁️</span>
        </div>

        <div className="cc-grid">
          {missions.map((mission, index) => {
            const mp = getMissionProgress(mission, progress);
            const unlocked = isMissionUnlocked(world, mission.order, progress);
            const isActive = mission.order === activeMissionOrder;
            const col = PATH_COLS[index % PATH_COLS.length];
            const nextCol = index < missions.length - 1 ? PATH_COLS[(index + 1) % PATH_COLS.length] : null;

            return (
              <div key={mission.id} className="cc-row">
                <MissionNode
                  mission={mission}
                  missionProg={mp}
                  unlocked={unlocked}
                  index={index}
                  col={col}
                  isActive={isActive}
                />
                {nextCol !== null && <PathSegment fromCol={col} toCol={nextCol} />}
              </div>
            );
          })}

          <div className="cc-row">
            <div className="cc-end-trophy" style={{ '--col': PATH_COLS[missions.length % PATH_COLS.length] }}>
              <span>🌟</span>
              <span className="cc-end-trophy__label">¡Mundo completado!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
