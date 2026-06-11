/**
 * LénaLand — secret-code icon set (16 unique hand-built SVGs).
 *
 * These REPLACE the old emoji glyphs as the alphabet of the child's secret
 * code. Each icon has a STABLE `id` — the PIN is hashed from those ids, so the
 * artwork can change without breaking saved codes (the id is the contract).
 *
 * Every icon carries a glossy top highlight + soft inner shading so it reads
 * as a 3D candy sticker on the chunky keypad. 32×32 viewBox. Gradient ids are
 * namespaced per icon to avoid cross-icon bleed when many render at once.
 */

const svg = { viewBox: '0 0 32 32', className: 'pin-ico', 'aria-hidden': 'true', focusable: 'false' };

/* Shared glossy highlight blob — sits top-left on every icon for the 3D look */
function Gloss({ cx = 12, cy = 10, rx = 5, ry = 3.4 }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" opacity="0.4" transform={`rotate(-25 ${cx} ${cy})`} />;
}

const ICONS = {
  star: () => (
    <svg {...svg}>
      <defs><linearGradient id="pi-star" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffe28a" /><stop offset="1" stopColor="#f59e0b" /></linearGradient></defs>
      <path d="M16 2l3.6 7.6 8.4.9-6.3 5.6 1.8 8.2L16 27.8 8.5 24.3l1.8-8.2L4 10.5l8.4-.9z" fill="url(#pi-star)" stroke="#b45309" strokeWidth="1" strokeLinejoin="round" />
      <Gloss cx={13} cy={9} />
    </svg>
  ),
  heart: () => (
    <svg {...svg}>
      <defs><linearGradient id="pi-heart" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fda4d4" /><stop offset="1" stopColor="#ec4899" /></linearGradient></defs>
      <path d="M16 28C6 21 4 15 4 11 4 7 7 5 10 5c2.3 0 4.4 1.4 6 4 1.6-2.6 3.7-4 6-4 3 0 6 2 6 6 0 4-2 10-12 17z" fill="url(#pi-heart)" stroke="#be185d" strokeWidth="1" strokeLinejoin="round" />
      <Gloss cx={11} cy={11} />
    </svg>
  ),
  balloon: () => (
    <svg {...svg}>
      <defs><radialGradient id="pi-balloon" cx="38%" cy="32%" r="70%"><stop offset="0" stopColor="#fca5a5" /><stop offset="1" stopColor="#dc2626" /></radialGradient></defs>
      <path d="M16 20l2 4h-4z" fill="#dc2626" />
      <path d="M16 22c-1 3 1 4 0 7" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <ellipse cx="16" cy="12" rx="8.5" ry="10" fill="url(#pi-balloon)" />
      <Gloss cx={12} cy={8} />
    </svg>
  ),
  flower: () => (
    <svg {...svg}>
      <defs><radialGradient id="pi-flower" cx="50%" cy="50%" r="60%"><stop offset="0" stopColor="#fef08a" /><stop offset="1" stopColor="#f472b6" /></radialGradient></defs>
      {[0, 72, 144, 216, 288].map(a => (
        <ellipse key={a} cx="16" cy="7.5" rx="4" ry="6" fill="#f472b6" stroke="#db2777" strokeWidth="0.8" transform={`rotate(${a} 16 16)`} />
      ))}
      <circle cx="16" cy="16" r="4.5" fill="url(#pi-flower)" stroke="#db2777" strokeWidth="0.8" />
    </svg>
  ),
  sun: () => (
    <svg {...svg}>
      <defs><radialGradient id="pi-sun" cx="40%" cy="35%" r="65%"><stop offset="0" stopColor="#fff7cc" /><stop offset="1" stopColor="#f59e0b" /></radialGradient></defs>
      {Array.from({ length: 8 }, (_, i) => i * 45).map(a => (
        <rect key={a} x="15" y="1.5" width="2" height="6" rx="1" fill="#fbbf24" transform={`rotate(${a} 16 16)`} />
      ))}
      <circle cx="16" cy="16" r="8.5" fill="url(#pi-sun)" stroke="#d97706" strokeWidth="1" />
      <Gloss cx={13} cy={13} />
    </svg>
  ),
  moon: () => (
    <svg {...svg}>
      <defs><linearGradient id="pi-moon" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fde68a" /><stop offset="1" stopColor="#c4b5fd" /></linearGradient></defs>
      <path d="M22 4a12 12 0 1 0 6 18A10 10 0 0 1 22 4z" fill="url(#pi-moon)" stroke="#7c3aed" strokeWidth="1" strokeLinejoin="round" />
      <circle cx="13" cy="9" r="1.2" fill="#fff" />
    </svg>
  ),
  cloud: () => (
    <svg {...svg}>
      <defs><linearGradient id="pi-cloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#bae6fd" /></linearGradient></defs>
      <g fill="url(#pi-cloud)" stroke="#7dd3fc" strokeWidth="1">
        <circle cx="11" cy="18" r="6" /><circle cx="20" cy="16" r="7" /><circle cx="24" cy="20" r="5" />
        <rect x="8" y="19" width="18" height="6" rx="3" stroke="none" />
      </g>
      <Gloss cx={12} cy={15} />
    </svg>
  ),
  rainbow: () => (
    <svg {...svg}>
      <g fill="none" strokeLinecap="round">
        <path d="M4 24a12 12 0 0 1 24 0" stroke="#f87171" strokeWidth="2.6" />
        <path d="M7 24a9 9 0 0 1 18 0" stroke="#fbbf24" strokeWidth="2.6" />
        <path d="M10 24a6 6 0 0 1 12 0" stroke="#34d399" strokeWidth="2.6" />
        <path d="M13 24a3 3 0 0 1 6 0" stroke="#60a5fa" strokeWidth="2.6" />
      </g>
      <circle cx="6" cy="24" r="2.4" fill="#fff" /><circle cx="26" cy="24" r="2.4" fill="#fff" />
    </svg>
  ),
  rocket: () => (
    <svg {...svg}>
      <defs><linearGradient id="pi-rocket" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#c4b5fd" /></linearGradient></defs>
      <path d="M16 3c4 2.2 6 6.2 6 11l-2.4 5h-7.2L10 14C10 9.2 12 5.2 16 3z" fill="url(#pi-rocket)" stroke="#7c3aed" strokeWidth="1" strokeLinejoin="round" />
      <circle cx="16" cy="12" r="2.6" fill="#22d3ee" stroke="#7c3aed" strokeWidth="0.8" />
      <path d="M12.4 19l-3 2 1.2-4M19.6 19l3 2-1.2-4" fill="#a78bfa" />
      <path d="M14 21c0 2 2 5 2 5s2-3 2-5z" fill="#fb923c" />
    </svg>
  ),
  gem: () => (
    <svg {...svg}>
      <defs><linearGradient id="pi-gem" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a5f3fc" /><stop offset="1" stopColor="#0891b2" /></linearGradient></defs>
      <path d="M9 6h14l5 7-12 13L4 13z" fill="url(#pi-gem)" stroke="#0e7490" strokeWidth="1" strokeLinejoin="round" />
      <path d="M9 6l3 7h8l3-7M4 13h24M12 13l4 13 4-13" fill="none" stroke="#0e7490" strokeWidth="0.9" opacity="0.7" />
      <path d="M10 8l2 3" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
    </svg>
  ),
  crown: () => (
    <svg {...svg}>
      <defs><linearGradient id="pi-crown" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fde68a" /><stop offset="1" stopColor="#f59e0b" /></linearGradient></defs>
      <path d="M4 11l5 5 7-9 7 9 5-5-3 14H7z" fill="url(#pi-crown)" stroke="#b45309" strokeWidth="1" strokeLinejoin="round" />
      <circle cx="9" cy="22" r="1.4" fill="#f472b6" /><circle cx="16" cy="22" r="1.4" fill="#60a5fa" /><circle cx="23" cy="22" r="1.4" fill="#34d399" />
    </svg>
  ),
  trophy: () => (
    <svg {...svg}>
      <defs><linearGradient id="pi-trophy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fde68a" /><stop offset="1" stopColor="#d97706" /></linearGradient></defs>
      <path d="M10 4h12v6a6 6 0 0 1-12 0z" fill="url(#pi-trophy)" stroke="#b45309" strokeWidth="1" />
      <path d="M10 6H6v2a4 4 0 0 0 4 4M22 6h4v2a4 4 0 0 1-4 4" fill="none" stroke="#b45309" strokeWidth="1.4" />
      <rect x="14" y="15" width="4" height="5" fill="#d97706" />
      <rect x="10" y="20" width="12" height="3" rx="1.5" fill="url(#pi-trophy)" stroke="#b45309" strokeWidth="1" />
      <Gloss cx={13} cy={8} rx={2.4} ry={1.6} />
    </svg>
  ),
  music: () => (
    <svg {...svg}>
      <defs><linearGradient id="pi-music" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d8b4fe" /><stop offset="1" stopColor="#7c3aed" /></linearGradient></defs>
      <path d="M12 22V7l11-3v15" fill="none" stroke="url(#pi-music)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="22" r="3.4" fill="url(#pi-music)" /><circle cx="20" cy="19" r="3.4" fill="url(#pi-music)" />
    </svg>
  ),
  icecream: () => (
    <svg {...svg}>
      <defs><linearGradient id="pi-ice" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fbcfe8" /><stop offset="1" stopColor="#f472b6" /></linearGradient></defs>
      <path d="M11 14h10l-5 14z" fill="#f0b27a" stroke="#c87f3e" strokeWidth="1" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="5" fill="#fcd34d" /><circle cx="20" cy="11" r="5" fill="#7dd3fc" />
      <circle cx="16" cy="8" r="5.5" fill="url(#pi-ice)" />
      <Gloss cx={13} cy={6} rx={2.4} ry={1.6} />
    </svg>
  ),
  leaf: () => (
    <svg {...svg}>
      <defs><linearGradient id="pi-leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#86efac" /><stop offset="1" stopColor="#16a34a" /></linearGradient></defs>
      <path d="M26 5C12 5 5 13 5 27c14 0 21-8 21-22z" fill="url(#pi-leaf)" stroke="#15803d" strokeWidth="1" strokeLinejoin="round" />
      <path d="M9 24C15 18 19 12 24 8" fill="none" stroke="#15803d" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
    </svg>
  ),
  bolt: () => (
    <svg {...svg}>
      <defs><linearGradient id="pi-bolt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fef08a" /><stop offset="1" stopColor="#f59e0b" /></linearGradient></defs>
      <path d="M18 2L7 18h7l-3 12 14-18h-8z" fill="url(#pi-bolt)" stroke="#d97706" strokeWidth="1" strokeLinejoin="round" />
      <Gloss cx={13} cy={10} rx={2} ry={3} />
    </svg>
  ),
};

/** Ordered alphabet of the secret code (4×4 grid). `id` is the stable hash key. */
export const PIN_ICONS = [
  { id: 'star',     label: 'étoile' },
  { id: 'heart',    label: 'cœur' },
  { id: 'balloon',  label: 'ballon' },
  { id: 'flower',   label: 'fleur' },
  { id: 'sun',      label: 'soleil' },
  { id: 'moon',     label: 'lune' },
  { id: 'cloud',    label: 'nuage' },
  { id: 'rainbow',  label: 'arc-en-ciel' },
  { id: 'rocket',   label: 'fusée' },
  { id: 'gem',      label: 'gemme' },
  { id: 'crown',    label: 'couronne' },
  { id: 'trophy',   label: 'trophée' },
  { id: 'music',    label: 'note de musique' },
  { id: 'icecream', label: 'glace' },
  { id: 'leaf',     label: 'feuille' },
  { id: 'bolt',     label: 'éclair' },
];

const ID_SET = new Set(PIN_ICONS.map(i => i.id));

/** Is this stored code made of the current icon alphabet? (used to retire old emoji codes) */
export function isIconCode(ids) {
  return Array.isArray(ids) && ids.length > 0 && ids.every(id => ID_SET.has(id));
}

/** Render a single secret-code icon by its stable id. */
export function PinIcon({ id }) {
  const Comp = ICONS[id];
  return Comp ? <Comp /> : null;
}
