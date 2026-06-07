// Lena — unique SVG game icons, viewBox 48×48
// Each icon: radial-gradient circle + drop-shadow + glass highlight + themed illustration
// ID prefix scheme: gi-{code}-bg / gi-{code}-sh  (codes are 2-4 chars, globally unique)

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Base({ id, c0, c1, shadow, children, size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`${id}-bg`} cx="50%" cy="35%" r="62%">
          <stop offset="0%" stopColor={c0} />
          <stop offset="100%" stopColor={c1} />
        </radialGradient>
        <filter id={`${id}-sh`}>
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor={shadow} floodOpacity="0.45" />
        </filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill={`url(#${id}-bg)`} filter={`url(#${id}-sh)`} />
      <ellipse cx="20" cy="13" rx="11" ry="6" fill="white" opacity="0.18" />
      {children}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ARCADE — purple
// ═══════════════════════════════════════════════════════════════════════════════

export function IconGameTetris({ size = 48 }) {
  return (
    <Base id="gi-tt" c0="#c084fc" c1="#6d28d9" shadow="#3b0764" size={size}>
      {/* T-tetromino */}
      <rect x="14" y="12" width="8" height="8" rx="2" fill="#e9d5ff" opacity="0.9" />
      <rect x="22" y="12" width="8" height="8" rx="2" fill="#e9d5ff" opacity="0.9" />
      <rect x="30" y="12" width="8" height="8" rx="2" fill="#e9d5ff" opacity="0.7" />
      <rect x="22" y="20" width="8" height="8" rx="2" fill="#e9d5ff" opacity="0.9" />
      {/* L-tetromino */}
      <rect x="10" y="28" width="8" height="8" rx="2" fill="#f9a8d4" opacity="0.85" />
      <rect x="10" y="36" width="8" height="8" rx="2" fill="#f9a8d4" opacity="0.85" />
      <rect x="18" y="36" width="8" height="8" rx="2" fill="#f9a8d4" opacity="0.85" />
      {/* S-tetromino */}
      <rect x="28" y="28" width="8" height="8" rx="2" fill="#fde68a" opacity="0.85" />
      <rect x="36" y="28" width="6" height="8" rx="2" fill="#fde68a" opacity="0.85" />
      <rect x="22" y="36" width="8" height="8" rx="2" fill="#fde68a" opacity="0.85" />
      <rect x="28" y="36" width="8" height="8" rx="2" fill="#fde68a" opacity="0.85" />
    </Base>
  );
}

export function IconGameTaupesMaths({ size = 48 }) {
  return (
    <Base id="gi-tp" c0="#a78bfa" c1="#5b21b6" shadow="#2e1065" size={size}>
      {/* Hole */}
      <ellipse cx="24" cy="38" rx="14" ry="5" fill="#1c1917" opacity="0.5" />
      {/* Mole body */}
      <ellipse cx="24" cy="28" rx="11" ry="10" fill="#a8756a" />
      {/* Face */}
      <ellipse cx="24" cy="25" rx="8" ry="7" fill="#c49a8a" />
      {/* Eyes */}
      <circle cx="20" cy="22" r="2" fill="#1c1917" />
      <circle cx="28" cy="22" r="2" fill="#1c1917" />
      <circle cx="20.7" cy="21.3" r="0.7" fill="white" />
      <circle cx="28.7" cy="21.3" r="0.7" fill="white" />
      {/* Nose */}
      <ellipse cx="24" cy="26" rx="2" ry="1.2" fill="#1c1917" opacity="0.8" />
      {/* Hammer with + */}
      <rect x="32" y="8" width="4" height="12" rx="2" fill="#fbbf24" />
      <rect x="29" y="6" width="10" height="6" rx="2" fill="#d97706" />
      <text x="31.5" y="11" fontSize="5" fontWeight="900" fill="white" fontFamily="system-ui">+</text>
    </Base>
  );
}

export function IconGameBombesMaths({ size = 48 }) {
  return (
    <Base id="gi-bm" c0="#f87171" c1="#7f1d1d" shadow="#450a0a" size={size}>
      {/* Bomb body */}
      <circle cx="24" cy="28" r="15" fill="#1c1917" />
      <circle cx="24" cy="28" r="15" fill="white" opacity="0.05" />
      {/* Shine */}
      <ellipse cx="18" cy="21" rx="5" ry="3" fill="white" opacity="0.2" />
      {/* Fuse */}
      <path d="M24 13 Q28 9 32 10 Q36 11 34 7" stroke="#d97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Spark */}
      <circle cx="34" cy="7" r="3" fill="#fbbf24" opacity="0.95" />
      <line x1="34" y1="4" x2="34" y2="1" stroke="#fde68a" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="37" y1="5" x2="39" y2="3" stroke="#fde68a" strokeWidth="1.5" strokeLinecap="round" />
      {/* Math symbols on bomb */}
      <text x="17" y="31" fontSize="11" fontWeight="900" fill="#ef4444" fontFamily="system-ui">×</text>
      <text x="27" y="31" fontSize="8" fontWeight="900" fill="#fca5a5" fontFamily="system-ui">2</text>
    </Base>
  );
}

export function IconGameCasseBriques({ size = 48 }) {
  return (
    <Base id="gi-cb" c0="#e879f9" c1="#701a75" shadow="#3b0764" size={size}>
      {/* Bricks rows */}
      <rect x="6" y="10" width="16" height="6" rx="2" fill="#fbbf24" opacity="0.9" />
      <rect x="24" y="10" width="18" height="6" rx="2" fill="#f97316" opacity="0.9" />
      <rect x="6" y="18" width="12" height="6" rx="2" fill="#f43f5e" opacity="0.9" />
      <rect x="20" y="18" width="14" height="6" rx="2" fill="#a855f7" opacity="0.9" />
      <rect x="36" y="18" width="6" height="6" rx="2" fill="#3b82f6" opacity="0.9" />
      {/* Broken brick */}
      <path d="M6 26 L14 26 L14 30 L10 32 L6 30Z" fill="#fbbf24" opacity="0.5" />
      {/* Ball */}
      <circle cx="26" cy="34" r="5" fill="white" opacity="0.95" />
      <ellipse cx="24" cy="32" rx="2" ry="1.2" fill="white" opacity="0.5" />
      {/* Paddle */}
      <rect x="12" y="40" width="24" height="5" rx="2.5" fill="white" opacity="0.85" />
    </Base>
  );
}

export function IconGameSnake({ size = 48 }) {
  return (
    <Base id="gi-sk" c0="#4ade80" c1="#14532d" shadow="#052e16" size={size}>
      {/* Snake body segments */}
      <rect x="8" y="22" width="10" height="10" rx="5" fill="#86efac" opacity="0.9" />
      <rect x="16" y="22" width="10" height="10" rx="5" fill="#4ade80" opacity="0.9" />
      <rect x="24" y="22" width="10" height="10" rx="5" fill="#22c55e" opacity="0.9" />
      <rect x="24" y="12" width="10" height="12" rx="5" fill="#22c55e" opacity="0.9" />
      <rect x="32" y="12" width="8" height="10" rx="4" fill="#16a34a" opacity="0.9" />
      {/* Head */}
      <ellipse cx="38" cy="26" rx="7" ry="6" fill="#15803d" />
      {/* Eyes */}
      <circle cx="36" cy="23" r="2" fill="white" />
      <circle cx="40" cy="23" r="2" fill="white" />
      <circle cx="36.5" cy="23.5" r="1" fill="#1c1917" />
      <circle cx="40.5" cy="23.5" r="1" fill="#1c1917" />
      {/* Tongue */}
      <path d="M44 27 L47 25 M44 27 L47 29" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Apple */}
      <circle cx="12" cy="14" r="5" fill="#ef4444" />
      <path d="M12 9 Q14 6 15 8" stroke="#65a30d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </Base>
  );
}

export function IconGameNinjaFruits({ size = 48 }) {
  return (
    <Base id="gi-nf" c0="#fb923c" c1="#9a3412" shadow="#431407" size={size}>
      {/* Watermelon half */}
      <path d="M8 26 Q8 14 20 12 Q26 11 30 16 L8 26Z" fill="#22c55e" />
      <path d="M8 26 Q8 16 20 14 Q25 13 28 17 L8 26Z" fill="#f43f5e" />
      {/* Seeds */}
      <ellipse cx="14" cy="21" rx="1.5" ry="2" fill="#1c1917" opacity="0.7" transform="rotate(-20 14 21)" />
      <ellipse cx="20" cy="19" rx="1.5" ry="2" fill="#1c1917" opacity="0.7" transform="rotate(-10 20 19)" />
      {/* Orange */}
      <circle cx="35" cy="20" r="8" fill="#f97316" />
      <ellipse cx="33" cy="17" rx="3" ry="2" fill="white" opacity="0.25" />
      <path d="M35 12 Q37 10 36 13" stroke="#65a30d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Slash lines */}
      <line x1="6" y1="38" x2="42" y2="10" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
      <line x1="6" y1="42" x2="42" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </Base>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LANGAGE — indigo
// ═══════════════════════════════════════════════════════════════════════════════

export function IconGameMotsMelanges({ size = 48 }) {
  return (
    <Base id="gi-mm" c0="#818cf8" c1="#3730a3" shadow="#1e1b4b" size={size}>
      {/* Three letter tiles shuffled */}
      <rect x="8" y="18" width="12" height="14" rx="3" fill="#e0e7ff" opacity="0.9" />
      <text x="11" y="29" fontSize="12" fontWeight="900" fill="#4338ca" fontFamily="system-ui">A</text>
      <rect x="18" y="12" width="12" height="14" rx="3" fill="#c7d2fe" opacity="0.9" />
      <text x="21.5" y="23" fontSize="12" fontWeight="900" fill="#3730a3" fontFamily="system-ui">B</text>
      <rect x="28" y="22" width="12" height="14" rx="3" fill="#a5b4fc" opacity="0.9" />
      <text x="31.5" y="33" fontSize="12" fontWeight="900" fill="#312e81" fontFamily="system-ui">C</text>
      {/* Shuffle arrow */}
      <path d="M10 38 Q20 42 30 38" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M28 36 L30 38 L28 40" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    </Base>
  );
}

export function IconGameMotsCaches({ size = 48 }) {
  return (
    <Base id="gi-mc" c0="#60a5fa" c1="#1d4ed8" shadow="#1e3a8a" size={size}>
      {/* Letter grid */}
      <rect x="6" y="12" width="26" height="26" rx="3" fill="#1e3a8a" opacity="0.5" />
      {[0, 1, 2].map(r => [0, 1, 2].map(c => (
        <rect key={`${r}${c}`} x={7 + c * 8.5} y={13 + r * 8.5} width={7} height={7} rx="1" fill="white" opacity="0.12" />
      )))}
      {/* Highlighted row */}
      <rect x="7" y="21.5" width="24" height="7" rx="1.5" fill="#fde68a" opacity="0.35" />
      <text x="8.5" y="27" fontSize="6" fontWeight="700" fill="white" opacity="0.9" fontFamily="system-ui">M O T</text>
      <text x="8.5" y="18" fontSize="6" fontWeight="700" fill="white" opacity="0.5" fontFamily="system-ui">A R S</text>
      <text x="8.5" y="35" fontSize="6" fontWeight="700" fill="white" opacity="0.5" fontFamily="system-ui">L E X</text>
      {/* Magnifier */}
      <circle cx="36" cy="34" r="9" fill="none" stroke="white" strokeWidth="2.5" opacity="0.95" />
      <line x1="42.5" y1="40.5" x2="46" y2="44" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </Base>
  );
}

export function IconGameDevinettes({ size = 48 }) {
  return (
    <Base id="gi-dv" c0="#fde047" c1="#a16207" shadow="#713f12" size={size}>
      {/* Bulb shape */}
      <path d="M16 27 Q14 20 18 15 Q24 9 30 15 Q34 20 32 27 Q30 31 28 33 L20 33 Q18 31 16 27Z" fill="#fef9c3" opacity="0.92" />
      {/* Base */}
      <rect x="20" y="33" width="8" height="3" rx="1" fill="#d97706" opacity="0.9" />
      <rect x="21" y="36" width="6" height="2.5" rx="1" fill="#b45309" />
      <rect x="22.5" y="38.5" width="3" height="2" rx="0.5" fill="#92400e" />
      {/* ? inside */}
      <text x="20.5" y="29" fontSize="12" fontWeight="900" fill="#d97706" fontFamily="system-ui">?</text>
      {/* Glow rays */}
      <line x1="24" y1="7" x2="24" y2="4" stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <line x1="33" y1="10" x2="35" y2="7" stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <line x1="15" y1="10" x2="13" y2="7" stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <line x1="38" y1="21" x2="41" y2="21" stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <line x1="10" y1="21" x2="7" y2="21" stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    </Base>
  );
}

export function IconGameCompletePhrase({ size = 48 }) {
  return (
    <Base id="gi-cp" c0="#4ade80" c1="#14532d" shadow="#052e16" size={size}>
      {/* Text lines */}
      <rect x="8" y="14" width="22" height="3.5" rx="1.75" fill="white" opacity="0.8" />
      <rect x="8" y="21" width="14" height="3.5" rx="1.75" fill="white" opacity="0.8" />
      {/* Gap / fill-in */}
      <rect x="24" y="21" width="16" height="3.5" rx="1.75" fill="#fbbf24" opacity="0.9" />
      <text x="26" y="24.5" fontSize="4.5" fontWeight="700" fill="#92400e" fontFamily="system-ui">___</text>
      <rect x="8" y="28" width="32" height="3.5" rx="1.75" fill="white" opacity="0.6" />
      {/* Pencil */}
      <g transform="rotate(-35 34 36)">
        <rect x="32" y="28" width="4" height="16" rx="1" fill="#fbbf24" />
        <polygon points="32,28 36,28 34,23" fill="#f87171" />
        <rect x="32" y="40" width="4" height="4" rx="1" fill="#d1d5db" />
      </g>
    </Base>
  );
}

export function IconGameChasseLettres({ size = 48 }) {
  return (
    <Base id="gi-cl" c0="#a78bfa" c1="#4c1d95" shadow="#2e1065" size={size}>
      {/* Target rings */}
      <circle cx="24" cy="26" r="16" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3" />
      <circle cx="24" cy="26" r="10" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" />
      <circle cx="24" cy="26" r="5" fill="#f43f5e" opacity="0.85" />
      {/* Letter A in center */}
      <text x="20.5" y="30" fontSize="8" fontWeight="900" fill="white" fontFamily="system-ui">A</text>
      {/* Crosshairs */}
      <line x1="24" y1="8" x2="24" y2="14" stroke="white" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
      <line x1="24" y1="38" x2="24" y2="44" stroke="white" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
      <line x1="6" y1="26" x2="12" y2="26" stroke="white" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
      <line x1="36" y1="26" x2="42" y2="26" stroke="white" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
    </Base>
  );
}

export function IconGameAtonymes({ size = 48 }) {
  return (
    <Base id="gi-at" c0="#818cf8" c1="#3730a3" shadow="#1e1b4b" size={size}>
      {/* Word chip left */}
      <rect x="4" y="18" width="14" height="8" rx="3" fill="#e0e7ff" opacity="0.85" />
      <text x="6.5" y="25" fontSize="6.5" fontWeight="800" fill="#3730a3" fontFamily="system-ui">CHAUD</text>
      {/* Word chip right */}
      <rect x="30" y="22" width="14" height="8" rx="3" fill="#fecaca" opacity="0.85" />
      <text x="31.5" y="29" fontSize="6.5" fontWeight="800" fill="#991b1b" fontFamily="system-ui">FROID</text>
      {/* Double arrow */}
      <path d="M20 20 L28 20" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M25 17 L28 20 L25 23" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 28 L20 28" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M23 25 L20 28 L23 31" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Base>
  );
}

export function IconGameOrdreAlpha({ size = 48 }) {
  return (
    <Base id="gi-oa" c0="#6366f1" c1="#3730a3" shadow="#1e1b4b" size={size}>
      {/* A → Z staircase */}
      <rect x="6" y="34" width="10" height="8" rx="2" fill="#a5b4fc" opacity="0.9" />
      <text x="9" y="41" fontSize="8" fontWeight="900" fill="#1e1b4b" fontFamily="system-ui">A</text>
      <rect x="18" y="26" width="10" height="16" rx="2" fill="#818cf8" opacity="0.9" />
      <text x="21" y="38" fontSize="8" fontWeight="900" fill="white" fontFamily="system-ui">M</text>
      <rect x="30" y="16" width="12" height="26" rx="2" fill="#6366f1" opacity="0.9" />
      <text x="34" y="33" fontSize="8" fontWeight="900" fill="white" fontFamily="system-ui">Z</text>
      {/* Arrow going up-right */}
      <path d="M8 14 L24 10 L38 8" stroke="#fde68a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M35 6 L38 8 L36 11" stroke="#fde68a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Base>
  );
}

export function IconGameConjugue({ size = 48 }) {
  return (
    <Base id="gi-cj" c0="#34d399" c1="#065f46" shadow="#022c22" size={size}>
      {/* Verb card */}
      <rect x="8" y="10" width="32" height="28" rx="4" fill="white" opacity="0.9" />
      {/* Verb "PARLER" */}
      <text x="13" y="22" fontSize="7" fontWeight="900" fill="#065f46" fontFamily="system-ui">PARLER</text>
      {/* Forms */}
      <text x="10" y="30" fontSize="5.5" fill="#374151" fontFamily="system-ui">je parle</text>
      <text x="26" y="30" fontSize="5.5" fill="#374151" fontFamily="system-ui">tu parles</text>
      <text x="10" y="36" fontSize="5.5" fill="#374151" fontFamily="system-ui">il parle</text>
      {/* Highlight one form */}
      <rect x="9" y="31.5" width="14" height="6" rx="2" fill="#fbbf24" opacity="0.35" />
      {/* Check */}
      <circle cx="38" cy="38" r="6" fill="#22c55e" opacity="0.9" />
      <path d="M35 38 L37 40 L41 36" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Base>
  );
}

export function IconGameMotsCroises({ size = 48 }) {
  return (
    <Base id="gi-mx" c0="#38bdf8" c1="#0c4a6e" shadow="#082f49" size={size}>
      {/* Crossword grid 5×5 */}
      {[0,1,2,3,4].map(r => [0,1,2,3,4].map(c => {
        const black = (r===0&&c===1)||(r===1&&c===3)||(r===2&&c===0)||(r===3&&c===2)||(r===4&&c===4);
        return <rect key={`${r}${c}`} x={7+c*7} y={9+r*7} width="6" height="6" rx="0.5"
          fill={black ? '#0c4a6e' : 'white'} opacity={black ? 0.9 : 0.85} />;
      }))}
      {/* A few letters */}
      <text x="8.5" y="14" fontSize="4.5" fontWeight="700" fill="#0369a1" fontFamily="system-ui">M</text>
      <text x="22" y="14" fontSize="4.5" fontWeight="700" fill="#0369a1" fontFamily="system-ui">T</text>
      <text x="8.5" y="21" fontSize="4.5" fontWeight="700" fill="#0369a1" fontFamily="system-ui">O</text>
      <text x="29" y="28" fontSize="4.5" fontWeight="700" fill="#0369a1" fontFamily="system-ui">S</text>
      {/* Pencil */}
      <g transform="rotate(-40 38 40)">
        <rect x="36" y="32" width="3.5" height="12" rx="1" fill="#fbbf24" />
        <polygon points="36,32 39.5,32 37.75,27" fill="#f87171" />
      </g>
    </Base>
  );
}

export function IconGameSynonymes({ size = 48 }) {
  return (
    <Base id="gi-sy" c0="#818cf8" c1="#3730a3" shadow="#1e1b4b" size={size}>
      {/* = sign (big) */}
      <rect x="12" y="18" width="24" height="4" rx="2" fill="white" opacity="0.9" />
      <rect x="12" y="26" width="24" height="4" rx="2" fill="white" opacity="0.9" />
      {/* Word chips */}
      <rect x="6" y="10" width="16" height="7" rx="3" fill="#e0e7ff" opacity="0.85" />
      <text x="9" y="16" fontSize="5.5" fontWeight="800" fill="#3730a3" fontFamily="system-ui">BEAU</text>
      <rect x="26" y="10" width="16" height="7" rx="3" fill="#c7d2fe" opacity="0.85" />
      <text x="28" y="16" fontSize="5.5" fontWeight="800" fill="#312e81" fontFamily="system-ui">JOLI</text>
      <rect x="6" y="33" width="16" height="7" rx="3" fill="#c7d2fe" opacity="0.75" />
      <text x="8" y="39" fontSize="5" fontWeight="800" fill="#4338ca" fontFamily="system-ui">GRAND</text>
      <rect x="26" y="33" width="16" height="7" rx="3" fill="#a5b4fc" opacity="0.75" />
      <text x="28" y="39" fontSize="5" fontWeight="800" fill="#3730a3" fontFamily="system-ui">HAUT</text>
    </Base>
  );
}

export function IconGameAnagrammes({ size = 48 }) {
  return (
    <Base id="gi-ag" c0="#f472b6" c1="#831843" shadow="#500724" size={size}>
      {/* Letter tiles scrambled */}
      <rect x="7" y="14" width="9" height="9" rx="2" fill="#fce7f3" opacity="0.9" />
      <text x="9.5" y="21.5" fontSize="8" fontWeight="900" fill="#9d174d" fontFamily="system-ui">C</text>
      <rect x="18" y="10" width="9" height="9" rx="2" fill="#fbcfe8" opacity="0.9" />
      <text x="20.5" y="17.5" fontSize="8" fontWeight="900" fill="#831843" fontFamily="system-ui">A</text>
      <rect x="30" y="16" width="9" height="9" rx="2" fill="#f9a8d4" opacity="0.9" />
      <text x="32.5" y="23.5" fontSize="8" fontWeight="900" fill="#9d174d" fontFamily="system-ui">H</text>
      <rect x="10" y="28" width="9" height="9" rx="2" fill="#fbcfe8" opacity="0.9" />
      <text x="12.5" y="35.5" fontSize="8" fontWeight="900" fill="#831843" fontFamily="system-ui">T</text>
      <rect x="22" y="32" width="9" height="9" rx="2" fill="#fce7f3" opacity="0.9" />
      <text x="24.5" y="39.5" fontSize="8" fontWeight="900" fill="#9d174d" fontFamily="system-ui">E</text>
      {/* Arrow  */}
      <path d="M36 34 Q42 28 38 22" stroke="#fde68a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M35 23 L38 22 L38 25" stroke="#fde68a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Base>
  );
}

export function IconGamePoesie({ size = 48 }) {
  return (
    <Base id="gi-po" c0="#c084fc" c1="#4c1d95" shadow="#2e1065" size={size}>
      {/* Scroll */}
      <rect x="10" y="12" width="28" height="28" rx="3" fill="#fef3c7" opacity="0.9" />
      <ellipse cx="10" cy="26" rx="4" ry="14" fill="#fde68a" opacity="0.9" />
      <ellipse cx="38" cy="26" rx="4" ry="14" fill="#fde68a" opacity="0.9" />
      {/* Lines / verses */}
      <rect x="14" y="17" width="20" height="2.5" rx="1" fill="#7c3aed" opacity="0.5" />
      <rect x="14" y="22" width="16" height="2.5" rx="1" fill="#7c3aed" opacity="0.5" />
      <rect x="14" y="27" width="20" height="2.5" rx="1" fill="#7c3aed" opacity="0.5" />
      <rect x="14" y="32" width="14" height="2.5" rx="1" fill="#7c3aed" opacity="0.4" />
      {/* Music note (rhyme) */}
      <text x="30" y="35" fontSize="10" fontFamily="system-ui">♪</text>
    </Base>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MATHS — amber
// ═══════════════════════════════════════════════════════════════════════════════

export function IconGameCalculRapide({ size = 48 }) {
  return (
    <Base id="gi-cr" c0="#fb923c" c1="#9a3412" shadow="#431407" size={size}>
      {/* Lightning bolt */}
      <path d="M27 7 L14 27 L21 27 L15 41 L33 19 L26 19Z" fill="#fde047" opacity="0.95" />
      <path d="M27 7 L14 27 L21 27 L15 41 L33 19 L26 19Z" fill="white" opacity="0.15" />
      {/* Number bubbles */}
      <circle cx="9" cy="14" r="5.5" fill="white" opacity="0.85" />
      <text x="6.5" y="17.5" fontSize="7" fontWeight="900" fill="#ea580c" fontFamily="system-ui">3</text>
      <circle cx="39" cy="14" r="5.5" fill="white" opacity="0.85" />
      <text x="36.5" y="17.5" fontSize="7" fontWeight="900" fill="#ea580c" fontFamily="system-ui">7</text>
      <circle cx="39" cy="36" r="5.5" fill="white" opacity="0.85" />
      <text x="36.5" y="39.5" fontSize="7" fontWeight="900" fill="#ea580c" fontFamily="system-ui">+</text>
    </Base>
  );
}

export function IconGameCourseMaths({ size = 48 }) {
  return (
    <Base id="gi-cm" c0="#f87171" c1="#7f1d1d" shadow="#450a0a" size={size}>
      {/* Finish flag */}
      <rect x="30" y="7" width="2" height="22" rx="1" fill="white" opacity="0.9" />
      <rect x="32" y="7" width="12" height="14" rx="2" fill="white" opacity="0.9" />
      {[0,1].map(r => [0,1].map(c => (
        <rect key={`f${r}${c}`} x={32+c*6} y={7+r*7} width="6" height="7"
          fill={((r+c)%2===0) ? '#1c1917' : 'white'} opacity="0.85" />
      )))}
      {/* Stopwatch */}
      <circle cx="17" cy="33" r="13" stroke="white" strokeWidth="2" fill="#dc2626" opacity="0.7" />
      <line x1="17" y1="33" x2="17" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="33" x2="23" y2="36" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="17" cy="33" r="2" fill="white" />
      <rect x="14" y="20" width="6" height="2" rx="1" fill="white" opacity="0.7" />
    </Base>
  );
}

export function IconGameBullesCalcul({ size = 48 }) {
  return (
    <Base id="gi-bc" c0="#38bdf8" c1="#075985" shadow="#082f49" size={size}>
      {/* Large bubble */}
      <circle cx="24" cy="26" r="13" fill="white" opacity="0.15" stroke="white" strokeWidth="1.5" />
      <text x="19.5" y="31" fontSize="11" fontWeight="900" fill="white" fontFamily="system-ui">8</text>
      {/* Small bubbles with numbers */}
      <circle cx="10" cy="14" r="7" fill="white" opacity="0.2" stroke="white" strokeWidth="1.5" />
      <text x="7.5" y="18" fontSize="8" fontWeight="900" fill="white" fontFamily="system-ui">3</text>
      <circle cx="38" cy="16" r="6" fill="white" opacity="0.2" stroke="white" strokeWidth="1.5" />
      <text x="35.5" y="20" fontSize="8" fontWeight="900" fill="white" fontFamily="system-ui">5</text>
      {/* Shine on big bubble */}
      <ellipse cx="18" cy="19" rx="4" ry="2.5" fill="white" opacity="0.3" />
    </Base>
  );
}

export function IconGameSauteMouton({ size = 48 }) {
  return (
    <Base id="gi-sm" c0="#86efac" c1="#14532d" shadow="#052e16" size={size}>
      {/* Ground / hill */}
      <path d="M4 38 Q20 28 44 38" fill="#16a34a" opacity="0.4" />
      {/* Fence */}
      <rect x="28" y="28" width="2" height="12" rx="1" fill="#d97706" opacity="0.8" />
      <rect x="36" y="28" width="2" height="12" rx="1" fill="#d97706" opacity="0.8" />
      <rect x="27" y="31" width="12" height="2" rx="1" fill="#d97706" opacity="0.8" />
      <rect x="27" y="35" width="12" height="2" rx="1" fill="#d97706" opacity="0.8" />
      {/* Sheep (jumping arc) */}
      <path d="M10 32 Q20 12 36 26" stroke="#fde68a" strokeWidth="1.5" strokeDasharray="3 2" fill="none" opacity="0.6" />
      {/* Sheep body */}
      <ellipse cx="20" cy="20" rx="8" ry="6" fill="white" opacity="0.95" />
      <circle cx="14" cy="18" r="4" fill="white" opacity="0.9" />
      <circle cx="26" cy="17" r="4" fill="white" opacity="0.9" />
      <circle cx="20" cy="15" r="4" fill="white" opacity="0.9" />
      {/* Face */}
      <ellipse cx="20" cy="22" rx="4" ry="3.5" fill="#e5e7eb" />
      <circle cx="18.5" cy="21" r="1" fill="#374151" />
      <circle cx="21.5" cy="21" r="1" fill="#374151" />
      {/* Legs */}
      <rect x="15" y="24" width="2" height="5" rx="1" fill="#9ca3af" />
      <rect x="23" y="24" width="2" height="5" rx="1" fill="#9ca3af" />
      {/* Number */}
      <text x="6" y="44" fontSize="6" fontWeight="900" fill="white" opacity="0.9" fontFamily="system-ui">+2 +5</text>
    </Base>
  );
}

export function IconGameHorloge({ size = 48 }) {
  return (
    <Base id="gi-hr" c0="#fbbf24" c1="#78350f" shadow="#451a03" size={size}>
      {/* Clock face */}
      <circle cx="24" cy="26" r="18" fill="white" opacity="0.9" />
      <circle cx="24" cy="26" r="18" stroke="#d97706" strokeWidth="2" fill="none" />
      {/* Hour marks */}
      {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => {
        const a = (i * 30 - 90) * Math.PI / 180;
        const r1 = i%3===0 ? 13 : 15, r2 = 17;
        return <line key={i} x1={24+r1*Math.cos(a)} y1={26+r1*Math.sin(a)}
          x2={24+r2*Math.cos(a)} y2={26+r2*Math.sin(a)}
          stroke="#92400e" strokeWidth={i%3===0?2:1} strokeLinecap="round" />;
      })}
      {/* Hour hand (10 o'clock) */}
      <line x1="24" y1="26" x2="17" y2="16" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
      {/* Minute hand (2 o'clock) */}
      <line x1="24" y1="26" x2="31" y2="14" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" />
      {/* Center dot */}
      <circle cx="24" cy="26" r="2" fill="#d97706" />
      {/* 12 marker */}
      <text x="21" y="14" fontSize="5" fontWeight="900" fill="#92400e" fontFamily="system-ui">12</text>
    </Base>
  );
}

export function IconGameFractions({ size = 48 }) {
  return (
    <Base id="gi-fr" c0="#fb923c" c1="#9a3412" shadow="#431407" size={size}>
      {/* Pizza circle */}
      <circle cx="24" cy="26" r="16" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
      {/* Slice lines */}
      <line x1="24" y1="10" x2="24" y2="42" stroke="#d97706" strokeWidth="1.5" />
      <line x1="8" y1="26" x2="40" y2="26" stroke="#d97706" strokeWidth="1.5" />
      {/* One filled quarter */}
      <path d="M24 26 L24 10 A16 16 0 0 1 40 26Z" fill="#ef4444" opacity="0.8" />
      {/* Fraction text */}
      <text x="9" y="22" fontSize="8" fontWeight="900" fill="#d97706" fontFamily="system-ui">1</text>
      <line x1="7" y1="23" x2="17" y2="23" stroke="#d97706" strokeWidth="1.5" />
      <text x="9" y="31" fontSize="8" fontWeight="900" fill="#d97706" fontFamily="system-ui">4</text>
    </Base>
  );
}

export function IconGameGeometrie({ size = 48 }) {
  return (
    <Base id="gi-ge" c0="#60a5fa" c1="#1d4ed8" shadow="#1e3a8a" size={size}>
      {/* Triangle */}
      <polygon points="24,8 10,34 38,34" fill="#fde68a" opacity="0.85" stroke="white" strokeWidth="1.5" />
      {/* Circle */}
      <circle cx="12" cy="40" r="7" fill="#f9a8d4" opacity="0.85" stroke="white" strokeWidth="1.5" />
      {/* Square */}
      <rect x="29" y="33" width="14" height="14" rx="1.5" fill="#86efac" opacity="0.85" stroke="white" strokeWidth="1.5" />
      {/* Ruler hint */}
      <line x1="6" y1="6" x2="42" y2="6" stroke="white" strokeWidth="1.5" opacity="0.4" strokeDasharray="3 2" />
    </Base>
  );
}

export function IconGameMultiplications({ size = 48 }) {
  return (
    <Base id="gi-ml" c0="#f59e0b" c1="#78350f" shadow="#451a03" size={size}>
      {/* Big × symbol */}
      <line x1="12" y1="12" x2="36" y2="36" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
      <line x1="36" y1="12" x2="12" y2="36" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
      {/* Corner number chips */}
      <circle cx="9" cy="9" r="7" fill="#fde68a" opacity="0.9" />
      <text x="6.5" y="12.5" fontSize="8" fontWeight="900" fill="#92400e" fontFamily="system-ui">7</text>
      <circle cx="39" cy="9" r="7" fill="#fde68a" opacity="0.9" />
      <text x="36.5" y="12.5" fontSize="8" fontWeight="900" fill="#92400e" fontFamily="system-ui">8</text>
      <circle cx="24" cy="42" r="7" fill="#f97316" opacity="0.9" />
      <text x="19" y="45.5" fontSize="7" fontWeight="900" fill="white" fontFamily="system-ui">56</text>
    </Base>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LECTURE — emerald
// ═══════════════════════════════════════════════════════════════════════════════

export function IconGamePhraseMystere({ size = 48 }) {
  return (
    <Base id="gi-pm" c0="#34d399" c1="#065f46" shadow="#022c22" size={size}>
      {/* Speech bubble */}
      <path d="M6 12 Q6 8 10 8 L38 8 Q42 8 42 12 L42 30 Q42 34 38 34 L28 34 L24 40 L20 34 L10 34 Q6 34 6 30Z"
        fill="white" opacity="0.9" />
      {/* Text lines */}
      <rect x="10" y="14" width="28" height="3" rx="1.5" fill="#6b7280" opacity="0.4" />
      <rect x="10" y="20" width="20" height="3" rx="1.5" fill="#6b7280" opacity="0.4" />
      {/* Mystery word (dashes) */}
      <rect x="32" y="20" width="8" height="3" rx="1.5" fill="#fbbf24" opacity="0.8" />
      <rect x="10" y="26" width="28" height="3" rx="1.5" fill="#6b7280" opacity="0.4" />
      {/* ? mark */}
      <text x="33" y="24" fontSize="4" fontWeight="900" fill="#92400e" fontFamily="system-ui">?</text>
    </Base>
  );
}

export function IconGameHistoireOrdre({ size = 48 }) {
  return (
    <Base id="gi-ho" c0="#10b981" c1="#064e3b" shadow="#022c22" size={size}>
      {/* Three numbered cards in staircase */}
      <rect x="6" y="28" width="14" height="14" rx="3" fill="white" opacity="0.9" />
      <text x="10" y="37" fontSize="6" fontWeight="900" fill="#065f46" fontFamily="system-ui">① 🌅</text>
      <rect x="17" y="18" width="14" height="14" rx="3" fill="white" opacity="0.85" />
      <text x="20" y="27" fontSize="6" fontWeight="900" fill="#065f46" fontFamily="system-ui">② 🌤</text>
      <rect x="28" y="8" width="14" height="14" rx="3" fill="white" opacity="0.8" />
      <text x="30" y="17" fontSize="6" fontWeight="900" fill="#065f46" fontFamily="system-ui">③ 🌙</text>
      {/* Arrow */}
      <path d="M10 26 Q20 20 30 14" stroke="#fde68a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M28 12 L30 14 L28 16" stroke="#fde68a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Base>
  );
}

export function IconGameDetective({ size = 48 }) {
  return (
    <Base id="gi-dt" c0="#fbbf24" c1="#78350f" shadow="#451a03" size={size}>
      {/* Open book */}
      <path d="M8 18 Q8 14 12 14 L22 16 L22 36 Q18 34 12 34 Q8 34 8 30Z" fill="white" opacity="0.9" />
      <path d="M22 16 L32 14 Q36 14 36 18 L36 30 Q36 34 32 34 L22 36Z" fill="#fef3c7" opacity="0.9" />
      <rect x="21" y="16" width="2" height="20" rx="1" fill="#d97706" opacity="0.7" />
      <rect x="10" y="20" width="10" height="1.5" rx="0.75" fill="#6b7280" opacity="0.5" />
      <rect x="10" y="24" width="8" height="1.5" rx="0.75" fill="#6b7280" opacity="0.5" />
      <rect x="10" y="28" width="10" height="1.5" rx="0.75" fill="#6b7280" opacity="0.5" />
      <rect x="24" y="20" width="10" height="1.5" rx="0.75" fill="#6b7280" opacity="0.5" />
      <rect x="24" y="24" width="8" height="1.5" rx="0.75" fill="#6b7280" opacity="0.5" />
      {/* Magnifier */}
      <circle cx="36" cy="32" r="8" fill="none" stroke="white" strokeWidth="2.5" opacity="0.95" />
      <line x1="42.5" y1="38.5" x2="46" y2="42" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </Base>
  );
}

export function IconGameLectureVitesse({ size = 48 }) {
  return (
    <Base id="gi-lv" c0="#4ade80" c1="#14532d" shadow="#052e16" size={size}>
      {/* Speed lines */}
      <line x1="4" y1="20" x2="20" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="4" y1="26" x2="28" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="4" y1="32" x2="16" y2="32" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      {/* Text block (book) */}
      <rect x="22" y="14" width="22" height="22" rx="3" fill="white" opacity="0.85" />
      <rect x="25" y="18" width="16" height="2" rx="1" fill="#065f46" opacity="0.5" />
      <rect x="25" y="22" width="14" height="2" rx="1" fill="#065f46" opacity="0.5" />
      <rect x="25" y="26" width="16" height="2" rx="1" fill="#065f46" opacity="0.5" />
      <rect x="25" y="30" width="10" height="2" rx="1" fill="#065f46" opacity="0.5" />
      {/* Eye scanning */}
      <path d="M23 38 Q34 30 44 38 Q34 46 23 38Z" fill="white" opacity="0.9" />
      <circle cx="34" cy="38" r="4" fill="#22c55e" />
      <circle cx="34" cy="38" r="2" fill="#1c1917" />
    </Base>
  );
}

export function IconGameVraiFaux({ size = 48 }) {
  return (
    <Base id="gi-vf" c0="#34d399" c1="#065f46" shadow="#022c22" size={size}>
      {/* True side */}
      <rect x="4" y="14" width="18" height="24" rx="4" fill="#22c55e" opacity="0.9" />
      <text x="7" y="26" fontSize="8" fontWeight="900" fill="white" fontFamily="system-ui">VRAI</text>
      {/* Checkmark */}
      <path d="M8 31 L11 35 L18 27" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* False side */}
      <rect x="26" y="14" width="18" height="24" rx="4" fill="#ef4444" opacity="0.9" />
      <text x="28" y="26" fontSize="7.5" fontWeight="900" fill="white" fontFamily="system-ui">FAUX</text>
      {/* X mark */}
      <line x1="30" y1="28" x2="40" y2="36" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="40" y1="28" x2="30" y2="36" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </Base>
  );
}

export function IconGameMotsIntrus({ size = 48 }) {
  return (
    <Base id="gi-mi" c0="#10b981" c1="#064e3b" shadow="#022c22" size={size}>
      {/* Text block */}
      <rect x="6" y="10" width="36" height="30" rx="3" fill="white" opacity="0.1" />
      {/* Word tokens */}
      <rect x="8" y="14" width="12" height="6" rx="2" fill="white" opacity="0.7" />
      <text x="10" y="19.5" fontSize="5" fill="#065f46" fontFamily="system-ui">Le chat</text>
      <rect x="22" y="14" width="10" height="6" rx="2" fill="white" opacity="0.7" />
      <text x="24" y="19.5" fontSize="5" fill="#065f46" fontFamily="system-ui">mange</text>
      <rect x="34" y="14" width="8" height="6" rx="2" fill="white" opacity="0.7" />
      <text x="35.5" y="19.5" fontSize="5" fill="#065f46" fontFamily="system-ui">vite</text>
      {/* Intrus word highlighted red */}
      <rect x="8" y="22" width="14" height="6" rx="2" fill="#fca5a5" opacity="0.9" />
      <text x="9.5" y="27.5" fontSize="5" fontWeight="700" fill="#991b1b" fontFamily="system-ui">AVION</text>
      {/* Tap cursor */}
      <text x="22" y="32" fontSize="14" fontFamily="system-ui">👆</text>
      {/* X badge */}
      <circle cx="22" cy="25" r="5" fill="#ef4444" opacity="0.9" />
      <line x1="19.5" y1="22.5" x2="24.5" y2="27.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24.5" y1="22.5" x2="19.5" y2="27.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </Base>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOMBRES — rose
// ═══════════════════════════════════════════════════════════════════════════════

export function IconGameNombreSecret({ size = 48 }) {
  return (
    <Base id="gi-ns" c0="#fb7185" c1="#881337" shadow="#4c0519" size={size}>
      {/* Padlock body */}
      <rect x="10" y="24" width="28" height="20" rx="4" fill="white" opacity="0.9" />
      {/* Shackle */}
      <path d="M16 24 L16 16 Q16 8 24 8 Q32 8 32 16 L32 24" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* ? in lock */}
      <text x="19.5" y="38" fontSize="12" fontWeight="900" fill="#881337" fontFamily="system-ui">?</text>
      {/* Number hints */}
      <text x="7" y="18" fontSize="7" fontWeight="700" fill="white" opacity="0.6" fontFamily="system-ui">1</text>
      <text x="36" y="18" fontSize="7" fontWeight="700" fill="white" opacity="0.6" fontFamily="system-ui">9</text>
    </Base>
  );
}

export function IconGameComparaison({ size = 48 }) {
  return (
    <Base id="gi-cmp" c0="#f43f5e" c1="#9f1239" shadow="#4c0519" size={size}>
      {/* Numbers */}
      <text x="6" y="30" fontSize="16" fontWeight="900" fill="white" opacity="0.9" fontFamily="system-ui">3</text>
      <text x="34" y="30" fontSize="16" fontWeight="900" fill="white" opacity="0.9" fontFamily="system-ui">7</text>
      {/* < symbol */}
      <path d="M22 16 L28 24 L22 32" stroke="#fde68a" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Decorative dots */}
      <circle cx="14" cy="38" r="2.5" fill="#fda4af" opacity="0.7" />
      <circle cx="34" cy="10" r="2.5" fill="#fda4af" opacity="0.7" />
    </Base>
  );
}

export function IconGameCodeurMaths({ size = 48 }) {
  return (
    <Base id="gi-cod" c0="#fb7185" c1="#881337" shadow="#4c0519" size={size}>
      {/* Symbol-value rows */}
      <circle cx="14" cy="16" r="5" fill="#fde68a" opacity="0.9" />
      <text x="11.5" y="19.5" fontSize="7" fontWeight="900" fill="#92400e" fontFamily="system-ui">★</text>
      <text x="21" y="19" fontSize="6" fontWeight="700" fill="white" opacity="0.8" fontFamily="system-ui">= 5</text>
      <rect x="9" y="24" width="10" height="10" rx="2" fill="#86efac" opacity="0.9" />
      <text x="11.5" y="31" fontSize="7" fontWeight="900" fill="#065f46" fontFamily="system-ui">▲</text>
      <text x="21" y="31" fontSize="6" fontWeight="700" fill="white" opacity="0.8" fontFamily="system-ui">= 3</text>
      {/* Question */}
      <text x="8" y="43" fontSize="6" fontWeight="700" fill="#fde68a" opacity="0.9" fontFamily="system-ui">★+▲=?</text>
      {/* = 8 answer chip */}
      <rect x="32" y="36" width="12" height="8" rx="3" fill="#fde68a" opacity="0.9" />
      <text x="35" y="42" fontSize="7" fontWeight="900" fill="#92400e" fontFamily="system-ui">8</text>
    </Base>
  );
}

export function IconGameSuiteLogique({ size = 48 }) {
  return (
    <Base id="gi-sl" c0="#fb7185" c1="#881337" shadow="#4c0519" size={size}>
      {/* Number bubbles in sequence */}
      {[{n:'2',x:6},{n:'4',x:16},{n:'6',x:26}].map(({n,x}) => (
        <g key={n}>
          <circle cx={x+4} cy="22" r="7" fill="white" opacity="0.85" />
          <text x={x+1.5} y={25.5} fontSize="9" fontWeight="900" fill="#9f1239" fontFamily="system-ui">{n}</text>
        </g>
      ))}
      {/* Question bubble */}
      <circle cx="40" cy="22" r="7" fill="#fbbf24" opacity="0.9" />
      <text x="37.5" y="25.5" fontSize="9" fontWeight="900" fill="#92400e" fontFamily="system-ui">?</text>
      {/* Arrows */}
      {[13,23,33].map(x => (
        <path key={x} d={`M${x} 22 L${x+1} 22`} stroke="white" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
      ))}
      <text x="8" y="38" fontSize="6" fontWeight="700" fill="white" opacity="0.8" fontFamily="system-ui">+2 +2 +2 …</text>
    </Base>
  );
}

export function IconGamePairImpair({ size = 48 }) {
  return (
    <Base id="gi-pi" c0="#f43f5e" c1="#9f1239" shadow="#4c0519" size={size}>
      {/* Two columns */}
      <rect x="4" y="10" width="18" height="30" rx="4" fill="#22c55e" opacity="0.3" />
      <rect x="26" y="10" width="18" height="30" rx="4" fill="#ef4444" opacity="0.3" />
      <text x="6" y="20" fontSize="6" fontWeight="700" fill="white" opacity="0.9" fontFamily="system-ui">PAIR</text>
      <text x="26" y="20" fontSize="6" fontWeight="700" fill="white" opacity="0.9" fontFamily="system-ui">IMPAIR</text>
      {/* Even numbers */}
      <text x="9" y="30" fontSize="9" fontWeight="900" fill="#86efac" fontFamily="system-ui">2</text>
      <text x="9" y="38" fontSize="9" fontWeight="900" fill="#86efac" fontFamily="system-ui">6</text>
      {/* Odd numbers */}
      <text x="31" y="30" fontSize="9" fontWeight="900" fill="#fca5a5" fontFamily="system-ui">3</text>
      <text x="31" y="38" fontSize="9" fontWeight="900" fill="#fca5a5" fontFamily="system-ui">7</text>
    </Base>
  );
}

export function IconGamePyramideNombres({ size = 48 }) {
  return (
    <Base id="gi-pyr" c0="#fb7185" c1="#881337" shadow="#4c0519" size={size}>
      {/* Bottom row — 3 bricks */}
      {[6,17,28].map(x => (
        <rect key={x} x={x} y={34} width="11" height="9" rx="2" fill="white" opacity="0.8" />
      ))}
      <text x="8.5" y="41" fontSize="7" fontWeight="900" fill="#9f1239" fontFamily="system-ui">3</text>
      <text x="19.5" y="41" fontSize="7" fontWeight="900" fill="#9f1239" fontFamily="system-ui">5</text>
      <text x="30.5" y="41" fontSize="7" fontWeight="900" fill="#9f1239" fontFamily="system-ui">2</text>
      {/* Middle row — 2 bricks */}
      {[11,22].map(x => (
        <rect key={x} x={x} y={22} width="11" height="9" rx="2" fill="#fda4af" opacity="0.9" />
      ))}
      <text x="13.5" y="29" fontSize="7" fontWeight="900" fill="white" fontFamily="system-ui">8</text>
      <text x="24.5" y="29" fontSize="7" fontWeight="900" fill="white" fontFamily="system-ui">7</text>
      {/* Top brick */}
      <rect x="17" y="10" width="14" height="9" rx="2" fill="#f43f5e" opacity="0.9" />
      <text x="20.5" y="17" fontSize="7" fontWeight="900" fill="white" fontFamily="system-ui">15</text>
    </Base>
  );
}

export function IconGameEstimation({ size = 48 }) {
  return (
    <Base id="gi-est" c0="#fb923c" c1="#9a3412" shadow="#431407" size={size}>
      {/* Scale beam */}
      <rect x="22" y="14" width="4" height="22" rx="2" fill="white" opacity="0.85" />
      <rect x="8" y="13" width="32" height="3.5" rx="1.75" fill="white" opacity="0.85" />
      <circle cx="24" cy="12" r="3" fill="#fbbf24" opacity="0.9" />
      {/* Left pan */}
      <path d="M8 16 Q8 28 14 30 Q20 32 14 30 Q8 28 8 16" fill="none" />
      <line x1="8" y1="16" x2="8" y2="30" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <ellipse cx="8" cy="30" rx="7" ry="2.5" fill="white" opacity="0.7" />
      <text x="4.5" y="30" fontSize="6.5" fontWeight="900" fill="#9a3412" fontFamily="system-ui">≈</text>
      {/* Right pan */}
      <line x1="40" y1="16" x2="40" y2="30" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <ellipse cx="40" cy="30" rx="7" ry="2.5" fill="white" opacity="0.7" />
      <text x="36.5" y="30" fontSize="6.5" fontWeight="900" fill="#9a3412" fontFamily="system-ui">99</text>
      {/* Question */}
      <text x="20" y="44" fontSize="8" fontWeight="900" fill="#fde68a" fontFamily="system-ui">~?</text>
    </Base>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIQUE — pink
// ═══════════════════════════════════════════════════════════════════════════════

export function IconGameTrouveIntrus({ size = 48 }) {
  return (
    <Base id="gi-ti" c0="#c084fc" c1="#4c1d95" shadow="#2e1065" size={size}>
      {/* Three matching stars */}
      <path d="M10 19 L11.5 23.5 L16 23.5 L12.5 26.5 L14 31 L10 28 L6 31 L7.5 26.5 L4 23.5 L8.5 23.5Z" fill="#fde68a" opacity="0.9" />
      <path d="M24 19 L25.5 23.5 L30 23.5 L26.5 26.5 L28 31 L24 28 L20 31 L21.5 26.5 L18 23.5 L22.5 23.5Z" fill="#fde68a" opacity="0.9" />
      {/* Intruder — red circle */}
      <circle cx="38" cy="25" r="8" fill="#f43f5e" opacity="0.9" />
      <line x1="34.5" y1="21.5" x2="41.5" y2="28.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="41.5" y1="21.5" x2="34.5" y2="28.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      {/* Detective hat hint */}
      <path d="M12 14 Q16 8 24 10 Q32 8 36 14" stroke="white" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round" />
    </Base>
  );
}

export function IconGameTrieExpress({ size = 48 }) {
  return (
    <Base id="gi-te" c0="#f472b6" c1="#831843" shadow="#500724" size={size}>
      {/* Two category boxes */}
      <rect x="4" y="12" width="18" height="28" rx="3" fill="white" opacity="0.15" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
      <rect x="26" y="12" width="18" height="28" rx="3" fill="white" opacity="0.15" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
      <text x="6.5" y="20" fontSize="5.5" fontWeight="700" fill="white" opacity="0.9" fontFamily="system-ui">Animaux</text>
      <text x="28" y="20" fontSize="5.5" fontWeight="700" fill="white" opacity="0.9" fontFamily="system-ui">Fruits</text>
      {/* Items in boxes */}
      <text x="9" y="28" fontSize="7" fontFamily="system-ui">🐱</text>
      <text x="9" y="36" fontSize="7" fontFamily="system-ui">🐶</text>
      <text x="30" y="28" fontSize="7" fontFamily="system-ui">🍎</text>
      <text x="30" y="36" fontSize="7" fontFamily="system-ui">🍌</text>
      {/* Flying word card */}
      <rect x="14" y="5" width="20" height="8" rx="2" fill="#fde68a" opacity="0.95" />
      <text x="17" y="11" fontSize="6" fontWeight="700" fill="#92400e" fontFamily="system-ui">CHAT ?</text>
    </Base>
  );
}

export function IconGameSudokuImages({ size = 48 }) {
  return (
    <Base id="gi-sud" c0="#e879f9" c1="#701a75" shadow="#3b0764" size={size}>
      {/* 3×3 sudoku grid */}
      {[0,1,2].map(r => [0,1,2].map(c => (
        <rect key={`${r}${c}`} x={7+c*12} y={10+r*12} width="10" height="10" rx="1"
          fill="white" opacity={r===1&&c===1 ? 0 : 0.15} stroke="white" strokeWidth="0.8" strokeOpacity="0.5" />
      )))}
      {/* Bold 3×3 grid lines */}
      <rect x="6" y="9" width="36" height="36" rx="2" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
      <line x1="18" y1="9" x2="18" y2="45" stroke="white" strokeWidth="1.5" opacity="0.5" />
      <line x1="30" y1="9" x2="30" y2="45" stroke="white" strokeWidth="1.5" opacity="0.5" />
      <line x1="6" y1="21" x2="42" y2="21" stroke="white" strokeWidth="1.5" opacity="0.5" />
      <line x1="6" y1="33" x2="42" y2="33" stroke="white" strokeWidth="1.5" opacity="0.5" />
      {/* Some emoji icons */}
      <text x="7.5" y="19" fontSize="8" fontFamily="system-ui">⭐</text>
      <text x="20" y="19" fontSize="8" fontFamily="system-ui">❤️</text>
      <text x="19.5" y="31" fontSize="8" fontFamily="system-ui">⭐</text>
      <text x="31.5" y="31" fontSize="8" fontFamily="system-ui">❤️</text>
      {/* Center ? */}
      <text x="20.5" y="30" fontSize="10" fontWeight="900" fill="#fde68a" fontFamily="system-ui">?</text>
    </Base>
  );
}

export function IconGameLabyrinthe({ size = 48 }) {
  return (
    <Base id="gi-lab" c0="#ec4899" c1="#831843" shadow="#500724" size={size}>
      {/* Maze walls */}
      <rect x="6" y="6" width="36" height="36" rx="2" fill="none" stroke="white" strokeWidth="2" opacity="0.7" />
      {/* Inner walls */}
      <line x1="6" y1="15" x2="22" y2="15" stroke="white" strokeWidth="2" opacity="0.7" />
      <line x1="22" y1="15" x2="22" y2="24" stroke="white" strokeWidth="2" opacity="0.7" />
      <line x1="14" y1="24" x2="32" y2="24" stroke="white" strokeWidth="2" opacity="0.7" />
      <line x1="32" y1="15" x2="32" y2="33" stroke="white" strokeWidth="2" opacity="0.7" />
      <line x1="14" y1="33" x2="32" y2="33" stroke="white" strokeWidth="2" opacity="0.7" />
      <line x1="14" y1="24" x2="14" y2="42" stroke="white" strokeWidth="2" opacity="0.7" />
      {/* Path dots */}
      <circle cx="10" cy="10" r="2.5" fill="#fde68a" opacity="0.9" />
      <circle cx="10" cy="19" r="2" fill="#fde68a" opacity="0.6" />
      <circle cx="28" cy="19" r="2" fill="#fde68a" opacity="0.6" />
      <circle cx="28" cy="28" r="2" fill="#fde68a" opacity="0.6" />
      {/* Exit star */}
      <text x="36" y="43" fontSize="8" fontFamily="system-ui">⭐</text>
    </Base>
  );
}

export function IconGameMotifs({ size = 48 }) {
  return (
    <Base id="gi-mot" c0="#db2777" c1="#831843" shadow="#500724" size={size}>
      {/* Pattern sequence: ● ■ ▲ ● ■ ? */}
      <circle cx="9" cy="20" r="5" fill="#fde68a" opacity="0.9" />
      <rect x="17" y="15" width="10" height="10" rx="1.5" fill="#86efac" opacity="0.9" />
      <polygon points="32,15 37,25 27,25" fill="#fda4af" opacity="0.9" />
      <circle cx="9" cy="36" r="5" fill="#fde68a" opacity="0.7" />
      <rect x="17" y="31" width="10" height="10" rx="1.5" fill="#86efac" opacity="0.7" />
      {/* ? last */}
      <circle cx="37" cy="36" r="6" fill="#fbbf24" opacity="0.9" />
      <text x="34.5" y="39.5" fontSize="8" fontWeight="900" fill="#92400e" fontFamily="system-ui">?</text>
    </Base>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MEMOIRE — green
// ═══════════════════════════════════════════════════════════════════════════════

export function IconGameMemory({ size = 48 }) {
  return (
    <Base id="gi-my" c0="#4ade80" c1="#14532d" shadow="#052e16" size={size}>
      {/* Face-down cards */}
      <rect x="6" y="12" width="16" height="20" rx="3" fill="#15803d" opacity="0.85" />
      <rect x="7" y="13" width="14" height="18" rx="2" fill="#16a34a" />
      <path d="M9 15 Q14 21 19 15 M9 27 Q14 21 19 27" stroke="#86efac" strokeWidth="1" fill="none" opacity="0.6" />
      <rect x="26" y="12" width="16" height="20" rx="3" fill="#15803d" opacity="0.85" />
      <rect x="27" y="13" width="14" height="18" rx="2" fill="#16a34a" />
      <path d="M29 15 Q34 21 39 15 M29 27 Q34 21 39 27" stroke="#86efac" strokeWidth="1" fill="none" opacity="0.6" />
      {/* Matching revealed pair */}
      <rect x="6" y="36" width="14" height="8" rx="2" fill="white" opacity="0.9" />
      <text x="10" y="43" fontSize="8" fontFamily="system-ui">⭐</text>
      <rect x="28" y="36" width="14" height="8" rx="2" fill="white" opacity="0.9" />
      <text x="32" y="43" fontSize="8" fontFamily="system-ui">⭐</text>
    </Base>
  );
}

export function IconGameSimon({ size = 48 }) {
  return (
    <Base id="gi-si" c0="#22c55e" c1="#14532d" shadow="#052e16" size={size}>
      {/* Simon 4 quadrants */}
      <path d="M24 24 L6 6 Q6 6 24 6Z" fill="#ef4444" opacity="0.9" />
      <path d="M24 24 L42 6 Q42 6 42 24Z" fill="#3b82f6" opacity="0.9" />
      <path d="M24 24 L42 42 Q42 42 24 42Z" fill="#f59e0b" opacity="0.9" />
      <path d="M24 24 L6 42 Q6 42 6 24Z" fill="#22c55e" opacity="0.9" />
      {/* Center circle */}
      <circle cx="24" cy="24" r="8" fill="#1c1917" opacity="0.85" />
      {/* Lit glow on top-left */}
      <path d="M24 24 L6 6 Q6 6 24 6Z" fill="#ff6b6b" opacity="0.5" />
      <circle cx="15" cy="15" r="3" fill="white" opacity="0.35" />
    </Base>
  );
}

export function IconGameObjetsCache({ size = 48 }) {
  return (
    <Base id="gi-oc" c0="#4ade80" c1="#14532d" shadow="#052e16" size={size}>
      {/* Room outline */}
      <rect x="6" y="12" width="36" height="28" rx="3" fill="white" opacity="0.1" stroke="white" strokeWidth="1.5" opacity2="0.5" />
      {/* Furniture silhouettes */}
      <rect x="8" y="30" width="12" height="8" rx="2" fill="white" opacity="0.4" />
      <rect x="28" y="24" width="12" height="14" rx="2" fill="white" opacity="0.4" />
      <rect x="16" y="14" width="16" height="10" rx="2" fill="white" opacity="0.3" />
      {/* Hidden object (question mark silhouette) */}
      <circle cx="34" cy="16" r="6" fill="#fbbf24" opacity="0.85" />
      <text x="31.5" y="19.5" fontSize="8" fontWeight="900" fill="#92400e" fontFamily="system-ui">?</text>
      {/* Eye */}
      <path d="M8 20 Q16 14 24 20 Q16 26 8 20Z" fill="white" opacity="0.7" />
      <circle cx="16" cy="20" r="3.5" fill="#22c55e" />
      <circle cx="16" cy="20" r="2" fill="#1c1917" />
    </Base>
  );
}

export function IconGameMemoireChiffres({ size = 48 }) {
  return (
    <Base id="gi-mch" c0="#34d399" c1="#065f46" shadow="#022c22" size={size}>
      {/* Display screen */}
      <rect x="6" y="10" width="36" height="18" rx="4" fill="#1c1917" opacity="0.7" />
      {/* Digit cells */}
      {[8,17,26,35].map((x,i) => (
        <rect key={x} x={x} y={13} width="9" height="12" rx="2" fill={i===2?'#fbbf24':'#374151'} opacity="0.9" />
      ))}
      <text x="9.5" y="22" fontSize="9" fontWeight="900" fill="white" fontFamily="system-ui">4</text>
      <text x="18.5" y="22" fontSize="9" fontWeight="900" fill="white" fontFamily="system-ui">7</text>
      <text x="27.5" y="22" fontSize="9" fontWeight="900" fill="#92400e" fontFamily="system-ui">?</text>
      <text x="36.5" y="22" fontSize="9" fontWeight="900" fill="white" fontFamily="system-ui">2</text>
      {/* Numpad hint */}
      {[0,1,2].map(r => [0,1,2].map(c => (
        <rect key={`${r}${c}`} x={12+c*10} y={32+r*5} width="8" height="4" rx="1"
          fill="white" opacity="0.25" />
      )))}
      <text x="10" y="44" fontSize="5" fill="white" opacity="0.7" fontFamily="system-ui">Tape les chiffres</text>
    </Base>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CULTURE — orange
// ═══════════════════════════════════════════════════════════════════════════════

export function IconGameQuizCulture({ size = 48 }) {
  return (
    <Base id="gi-qc" c0="#fb923c" c1="#9a3412" shadow="#431407" size={size}>
      {/* Globe */}
      <circle cx="22" cy="26" r="16" fill="#3b82f6" opacity="0.85" />
      {/* Land masses */}
      <path d="M14 18 Q16 14 22 16 Q28 14 30 18 Q32 22 28 26 Q24 28 20 26 Q14 24 14 18Z" fill="#22c55e" opacity="0.85" />
      <path d="M10 28 Q12 26 14 28 Q14 32 12 32 Q10 30 10 28Z" fill="#22c55e" opacity="0.7" />
      {/* Latitude lines */}
      <ellipse cx="22" cy="26" rx="16" ry="6" fill="none" stroke="white" strokeWidth="0.8" opacity="0.3" />
      <line x1="6" y1="26" x2="38" y2="26" stroke="white" strokeWidth="0.8" opacity="0.3" />
      {/* ? badge */}
      <circle cx="36" cy="14" r="8" fill="#fde68a" opacity="0.95" />
      <text x="33.5" y="18" fontSize="10" fontWeight="900" fill="#92400e" fontFamily="system-ui">?</text>
    </Base>
  );
}

export function IconGameCapitales({ size = 48 }) {
  return (
    <Base id="gi-cap" c0="#f97316" c1="#9a3412" shadow="#431407" size={size}>
      {/* Map pin */}
      <path d="M24 8 Q32 8 32 18 Q32 26 24 36 Q16 26 16 18 Q16 8 24 8Z" fill="#ef4444" opacity="0.9" />
      <circle cx="24" cy="18" r="5" fill="white" opacity="0.9" />
      {/* Flag on top of pin area */}
      <rect x="26" y="8" width="1.5" height="10" fill="white" opacity="0.7" />
      <rect x="27.5" y="8" width="9" height="6" rx="1" fill="#3b82f6" opacity="0.9" />
      {/* Stars on flag */}
      <text x="28.5" y="13" fontSize="5" fontFamily="system-ui">⭐</text>
      {/* Country name */}
      <rect x="6" y="38" width="36" height="8" rx="3" fill="white" opacity="0.2" />
      <text x="10" y="44" fontSize="6" fontWeight="700" fill="white" fontFamily="system-ui">PARIS → ?</text>
    </Base>
  );
}

export function IconGameAnimaux({ size = 48 }) {
  return (
    <Base id="gi-ani" c0="#fb923c" c1="#9a3412" shadow="#431407" size={size}>
      {/* Lion face */}
      {/* Mane */}
      {[0,1,2,3,4,5,6,7].map(i => {
        const a = (i * 45 - 22) * Math.PI / 180;
        return <line key={i} x1={24+14*Math.cos(a)} y1={24+14*Math.sin(a)}
          x2={24+18*Math.cos(a)} y2={24+18*Math.sin(a)}
          stroke="#d97706" strokeWidth="3" strokeLinecap="round" opacity="0.8" />;
      })}
      {/* Face */}
      <circle cx="24" cy="24" r="12" fill="#fbbf24" opacity="0.95" />
      {/* Eyes */}
      <circle cx="20" cy="21" r="2.5" fill="white" />
      <circle cx="28" cy="21" r="2.5" fill="white" />
      <circle cx="20.5" cy="21.5" r="1.5" fill="#1c1917" />
      <circle cx="28.5" cy="21.5" r="1.5" fill="#1c1917" />
      {/* Nose */}
      <ellipse cx="24" cy="27" rx="3" ry="2" fill="#d97706" />
      {/* Sound waves */}
      <text x="34" y="14" fontSize="10" fontFamily="system-ui">🔊</text>
    </Base>
  );
}

export function IconGameInventions({ size = 48 }) {
  return (
    <Base id="gi-inv" c0="#f59e0b" c1="#78350f" shadow="#451a03" size={size}>
      {/* Gear */}
      <path d="M24 8 L26 12 L30 10 L32 14 L36 14 L36 18 L40 20 L38 24 L40 28 L36 30 L36 34 L32 34 L30 38 L26 36 L24 40 L22 36 L18 38 L16 34 L12 34 L12 30 L8 28 L10 24 L8 20 L12 18 L12 14 L16 14 L18 10 L22 12Z"
        fill="white" opacity="0.2" />
      <circle cx="24" cy="24" r="10" fill="#d97706" opacity="0.85" />
      <circle cx="24" cy="24" r="6" fill="#1c1917" opacity="0.6" />
      {/* Light bulb overlay */}
      <path d="M20 21 Q19 17 22 14 Q24 12 26 14 Q29 17 28 21 Q27 23.5 26 24.5 L22 24.5 Q21 23.5 20 21Z" fill="#fde68a" opacity="0.95" />
      <rect x="22" y="24.5" width="4" height="2" rx="0.5" fill="#d97706" opacity="0.9" />
      <rect x="22.5" y="26.5" width="3" height="1.5" rx="0.5" fill="#b45309" opacity="0.9" />
    </Base>
  );
}
