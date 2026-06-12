// Floating biome islands for the adventure map (Nintendo-style).
// One parametric SVG island, recolored + redecorated per biome so every node
// in a path looks like a distinct floating world. Pure SVG/CSS — no PNG assets.

// ── Biome palettes ──────────────────────────────────────────────────────────
// Cycled deterministically by node index so consecutive islands differ.
export const BIOMES = [
  { id: 'grass',   topA: '#7ed957', topB: '#46a832', rockA: '#9c6b43', rockB: '#5e3d24', deco: 'flower', accent: '#ffd24a' },
  { id: 'sand',    topA: '#f0c277', topB: '#c8843a', rockA: '#a9743f', rockB: '#6c4623', deco: 'palm',   accent: '#3fae5e' },
  { id: 'ice',     topA: '#bdebff', topB: '#5cb6ec', rockA: '#5d7d9c', rockB: '#374f64', deco: 'crystal',accent: '#dff4ff' },
  { id: 'crystal', topA: '#c79bf2', topB: '#8a52d6', rockA: '#5d3d80', rockB: '#382153', deco: 'crystal',accent: '#eab6ff' },
  { id: 'lava',    topA: '#ff9d5c', topB: '#d44e16', rockA: '#5e2c1c', rockB: '#3a1810', deco: 'rock',   accent: '#ffd24a' },
  { id: 'meadow',  topA: '#86e8a8', topB: '#3aa86a', rockA: '#83613c', rockB: '#503820', deco: 'flower', accent: '#ff8fb0' },
  { id: 'ocean',   topA: '#7fdce8', topB: '#2c9fc4', rockA: '#3f6f86', rockB: '#264858', deco: 'rock',   accent: '#d6f5ff' },
  { id: 'gold',    topA: '#ffe06a', topB: '#e0a91e', rockA: '#9a7022', rockB: '#634615', deco: 'crystal',accent: '#fff3b0' },
];

export function getBiome(index = 0) {
  return BIOMES[index % BIOMES.length];
}

// ── Biome-specific decorations sitting on the island top ─────────────────────
function Decoration({ deco, accent }) {
  switch (deco) {
    case 'palm':
      return (
        <g>
          <path d="M138 86 Q140 70 137 56" stroke="#7a4a1e" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M137 56 Q124 50 116 56" stroke="#2f8f4e" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M137 56 Q150 49 158 56" stroke="#3aae5e" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M137 56 Q133 44 124 42" stroke="#2f8f4e" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M137 56 Q142 44 150 42" stroke="#3aae5e" strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
      );
    case 'crystal':
      return (
        <g>
          <polygon points="60,96 66,74 72,96" fill={accent} opacity="0.95" />
          <polygon points="60,96 66,74 66,96" fill="#ffffff" opacity="0.3" />
          <polygon points="150,100 156,84 162,100" fill={accent} opacity="0.9" />
          <polygon points="150,100 156,84 156,100" fill="#ffffff" opacity="0.3" />
        </g>
      );
    case 'rock':
      return (
        <g>
          <ellipse cx="62" cy="94" rx="9" ry="6" fill="#000" opacity="0.18" />
          <path d="M53 92 Q56 80 65 82 Q72 84 71 92 Z" fill="#9aa3ad" />
          <path d="M53 92 Q56 82 62 83" stroke="#cfd6dd" strokeWidth="2" fill="none" opacity="0.6" />
        </g>
      );
    case 'flower':
    default:
      return (
        <g>
          {[[58, 92], [150, 98], [104, 86]].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="3.4" fill={accent} />
              <circle cx={x} cy={y} r="1.4" fill="#fff7c2" />
              <line x1={x} y1={y + 3} x2={x} y2={y + 9} stroke="#2f8f4e" strokeWidth="1.6" />
            </g>
          ))}
        </g>
      );
  }
}

/**
 * A single floating island.
 * @param {object} props
 * @param {object} props.biome   One of BIOMES.
 * @param {number} [props.size]  Width in px (height scales 0.9×).
 * @param {boolean}[props.glow]  Add a top glow ring (active node).
 */
export function FloatingIsland({ biome = BIOMES[0], size = 200, glow = false }) {
  const uid = biome.id;
  const w = size;
  const h = size * 0.9;
  return (
    <svg width={w} height={h} viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="sw-island__svg">
      <defs>
        <radialGradient id={`isl-top-${uid}`} cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor={biome.topA} />
          <stop offset="100%" stopColor={biome.topB} />
        </radialGradient>
        <linearGradient id={`isl-rock-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={biome.rockA} />
          <stop offset="100%" stopColor={biome.rockB} />
        </linearGradient>
        <filter id={`isl-sh-${uid}`}><feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#000" floodOpacity="0.35" /></filter>
      </defs>

      {/* rock underside — narrowing chunk */}
      <g filter={`url(#isl-sh-${uid})`}>
        <path d="M44 84 L156 84 L132 132 Q116 156 100 156 Q84 156 68 132 Z" fill={`url(#isl-rock-${uid})`} />
        {/* floating debris rocks */}
        <path d="M70 150 Q66 162 76 164 Q84 162 80 150 Z" fill={biome.rockB} opacity="0.9" />
        <path d="M126 138 Q132 150 122 152 Q116 148 120 138 Z" fill={biome.rockB} opacity="0.85" />
        {/* rock striations */}
        <path d="M58 100 Q90 108 142 100" stroke="#000" strokeOpacity="0.12" strokeWidth="3" fill="none" />
        <path d="M66 116 Q98 124 134 116" stroke="#000" strokeOpacity="0.1" strokeWidth="2.5" fill="none" />
      </g>

      {/* grass / biome top surface */}
      <ellipse cx="100" cy="84" rx="60" ry="20" fill={`url(#isl-top-${uid})`} />
      {/* overhang lumps on the rim */}
      <path d="M44 84 Q52 96 64 90 Q74 98 86 90 Q98 100 110 90 Q122 98 136 90 Q150 96 156 84 Q140 94 100 94 Q60 94 44 84 Z" fill={biome.topB} opacity="0.85" />
      {/* top highlight */}
      <ellipse cx="86" cy="78" rx="34" ry="9" fill="#ffffff" opacity="0.22" />

      {glow && <ellipse cx="100" cy="84" rx="66" ry="24" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" />}

      <Decoration deco={biome.deco} accent={biome.accent} />
    </svg>
  );
}

// ── Space backdrop (starfield + planets + rocket) ────────────────────────────
// Rendered once behind the whole map. Deterministic stars (no layout shift).
const STARS = Array.from({ length: 60 }, (_, i) => {
  const r = ((i * 9301 + 49297) % 233280) / 233280;
  const r2 = ((i * 4099 + 7919) % 233280) / 233280;
  const r3 = ((i * 2749 + 1933) % 233280) / 233280;
  return { x: r * 100, y: r2 * 100, s: 0.6 + r3 * 1.6, o: 0.3 + r3 * 0.6, d: r * 4 };
});

export function SpaceBackdrop() {
  return (
    <div className="sw-space-bg" aria-hidden="true">
      <svg className="sw-space-bg__stars" viewBox="0 0 100 100" preserveAspectRatio="none">
        {STARS.map((st, i) => (
          <circle key={i} cx={st.x} cy={st.y} r={st.s / 6} fill="#fff" opacity={st.o}
            style={{ animation: `sw-twinkle ${2 + st.d}s ease-in-out ${st.d}s infinite` }} />
        ))}
      </svg>
      {/* ringed planet */}
      <svg className="sw-space-bg__planet sw-space-bg__planet--ring" viewBox="0 0 120 90">
        <ellipse cx="60" cy="45" rx="52" ry="14" fill="none" stroke="#6b5ca8" strokeWidth="5" opacity="0.45" transform="rotate(-18 60 45)" />
        <circle cx="60" cy="45" r="26" fill="#4b3f7a" />
        <circle cx="52" cy="38" r="9" fill="#5d4f93" opacity="0.7" />
      </svg>
      {/* small planet */}
      <svg className="sw-space-bg__planet sw-space-bg__planet--small" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="22" fill="#3a4a8a" />
        <circle cx="22" cy="24" r="6" fill="#4f63b0" opacity="0.7" />
      </svg>
      {/* rocket */}
      <svg className="sw-space-bg__rocket" viewBox="0 0 60 90">
        <path d="M30 6 Q44 26 44 56 L16 56 Q16 26 30 6 Z" fill="#e8edf5" />
        <path d="M30 6 Q44 26 44 56 L30 56 Z" fill="#c2ccdc" />
        <circle cx="30" cy="34" r="7" fill="#5fa8e0" stroke="#2c6fa8" strokeWidth="2" />
        <path d="M16 50 L6 68 L20 60 Z" fill="#ef4444" />
        <path d="M44 50 L54 68 L40 60 Z" fill="#ef4444" />
        <path d="M24 56 L36 56 L32 82 Q30 88 28 82 Z" fill="#ff9d3c" />
        <path d="M27 58 L33 58 L31 74 Q30 78 29 74 Z" fill="#ffe06a" />
      </svg>
      {/* moon */}
      <svg className="sw-space-bg__moon" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="44" fill="#3b3556" />
        <circle cx="38" cy="40" r="8" fill="#332e4c" />
        <circle cx="60" cy="58" r="11" fill="#332e4c" />
        <circle cx="66" cy="34" r="5" fill="#332e4c" />
      </svg>
    </div>
  );
}
