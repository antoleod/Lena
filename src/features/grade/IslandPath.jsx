import { Link } from 'react-router-dom';
import { FloatingIsland, getStateIsland, SpaceBackdrop } from '../../assets/icons/BiomeIslands.jsx';

// Winding column pattern: center → right → center → left → repeat
const PATH_COLS = [1, 2, 1, 0, 1, 2, 1, 0, 1, 2, 1, 0];
const ROW_CLASS = ['sw-island-row--left', 'sw-island-row--center', 'sw-island-row--right'];

// Glowing cyan→pink energy bridge between two islands with a flowing-light feel.
let bridgeSeq = 0;
function IslandConnector({ fromCol, toCol }) {
  const colToX = c => [22, 50, 78][c];
  const x1 = colToX(fromCol), x2 = colToX(toCol), cx = (x1 + x2) / 2;
  const d = `M ${x1} 4 C ${cx} 4, ${cx} 56, ${x2} 56`;
  const gid = `bridge-grad-${bridgeSeq++}`;
  return (
    <div className="sw-island-link" aria-hidden="true">
      <svg viewBox="0 0 100 60" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#33e0ff" />
            <stop offset="100%" stopColor="#ff4fb6" />
          </linearGradient>
        </defs>
        <path d={d} fill="none" stroke={`url(#${gid})`} strokeWidth="9" strokeLinecap="round" opacity="0.28" />
        <path d={d} fill="none" stroke={`url(#${gid})`} strokeWidth="4" strokeLinecap="round" opacity="0.65" />
        <path className="sw-bridge-flow" d={d} fill="none" stroke="#ffffff" strokeWidth="1.6"
          strokeLinecap="round" strokeDasharray="2 7" opacity="0.95" />
      </svg>
    </div>
  );
}

/**
 * Shared floating-island adventure path (full-screen, Nintendo-style).
 * Island color is driven by progress STATE (gold/cyan/slate). No padlocks.
 *
 * @param {object} props
 * @param {Array}  props.nodes      [{ id, title, launchTo, pct, isActive, complete, glyph }]
 * @param {string} props.badgeColor Accent for the number badge (grade world color).
 * @param {*}      [props.endIcon]  Node/emoji shown at the finish trophy.
 * @param {string} [props.endLabel] Finish caption.
 * @param {object} [props.emptyFallback] { icon, label, to } when there are no nodes.
 */
export default function IslandPath({ nodes = [], badgeColor, endIcon, endLabel, emptyFallback }) {
  return (
    <div className="sw-island-map">
      <SpaceBackdrop />

      {nodes.length === 0 && emptyFallback && (
        <div className="sw-island-end">
          <span className="sw-island-end__icon">{emptyFallback.icon}</span>
          <Link to={emptyFallback.to} className="cc-end-trophy__label" style={{ color: 'inherit', textDecoration: 'none' }}>
            {emptyFallback.label}
          </Link>
        </div>
      )}

      <div className="sw-island-grid">
        {nodes.map((node, index) => {
          const col     = PATH_COLS[index % PATH_COLS.length];
          const nextCol = index < nodes.length - 1 ? PATH_COLS[(index + 1) % PATH_COLS.length] : null;
          const state   = node.locked ? 'locked' : node.complete ? 'complete' : node.isActive ? 'active' : 'pending';
          const island  = getStateIsland(node.locked ? 'pending' : state, index);

          const visual = (
            <>
              <div className="sw-island__visual">
                <div className="sw-island__float">
                  <span className="sw-island__halo" />
                  <span className="sw-island__book">
                    <span className="sw-island__book-glyph">{node.locked ? '🔒' : node.complete ? '🏆' : node.glyph}</span>
                  </span>
                </div>
                <FloatingIsland
                  biome={island}
                  size={200}
                  glow={node.isActive && !node.locked}
                  dim={state === 'pending' || node.locked}
                  sparkle={node.complete}
                />
                <span className={`sw-island__pct sw-island__pct--${state}`}>
                  {node.locked ? '🔒' : node.complete ? '100%' : node.isActive ? `${node.pct}% ✦` : `${node.pct}%`}
                </span>
                <span className="sw-island__num">{index + 1}</span>
              </div>
              <span className="sw-island__title">{node.title}</span>
              <span className="sw-island__stars">
                {[33, 66, 100].map((thr, i) => (
                  <span key={i} className={`sw-island__star ${!node.locked && node.pct >= thr ? 'sw-island__star--on' : ''}`}>★</span>
                ))}
              </span>
            </>
          );

          return (
            <div key={node.id} style={{ width: '100%' }}>
              <div className={`sw-island-row ${ROW_CLASS[col]}`}>
                {node.locked ? (
                  <div
                    className="sw-island-node sw-island-node--locked"
                    style={{ animationDelay: `${index * 70}ms`, '--isl-badge': badgeColor }}
                    title={node.title}
                  >
                    {visual}
                  </div>
                ) : (
                  <Link
                    to={node.launchTo}
                    className={`sw-island-node sw-island-node--${state}`}
                    style={{ animationDelay: `${index * 70}ms`, '--isl-badge': badgeColor }}
                    title={node.title}
                  >
                    {visual}
                  </Link>
                )}
              </div>
              {nextCol !== null && <IslandConnector fromCol={col} toCol={nextCol} />}
            </div>
          );
        })}

        {nodes.length > 0 && (
          <div className="sw-island-end">
            <span className="sw-island-end__icon" style={badgeColor ? { filter: `drop-shadow(0 4px 12px ${badgeColor}88)` } : undefined}>{endIcon}</span>
            <span>{endLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
