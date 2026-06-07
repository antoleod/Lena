// Story cover SVG components for Lena — Contes & Lecture
// viewBox 80×80, circular gradient background, central motif, highlight + shadow
// Each component uses unique defs prefixes to avoid ID collisions.

// ─── CONTES ───────────────────────────────────────────────────────────────────

export function IconCoverBlancheNeige({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sc-bn-bg" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#f87171"/>
          <stop offset="100%" stopColor="#991b1b"/>
        </radialGradient>
        <filter id="sc-bn-sh"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#450a0a" floodOpacity="0.35"/></filter>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#sc-bn-bg)" filter="url(#sc-bn-sh)"/>
      <ellipse cx="33" cy="22" rx="15" ry="8" fill="white" opacity="0.22"/>
      {/* Apple body */}
      <ellipse cx="40" cy="46" rx="16" ry="17" fill="#dc2626"/>
      <ellipse cx="40" cy="46" rx="16" ry="17" fill="url(#sc-bn-bg)" opacity="0.3"/>
      <ellipse cx="40" cy="45" rx="14" ry="15" fill="#ef4444"/>
      {/* Apple shine */}
      <ellipse cx="34" cy="38" rx="4" ry="5" fill="white" opacity="0.35" transform="rotate(-15 34 38)"/>
      {/* Apple stem */}
      <rect x="39" y="27" width="3" height="6" rx="1.5" fill="#713f12"/>
      {/* Leaf */}
      <path d="M42 30 Q50 24 48 34 Q44 30 42 30Z" fill="#16a34a"/>
      {/* Snow dots */}
      <circle cx="18" cy="30" r="3" fill="white" opacity="0.7"/>
      <circle cx="24" cy="22" r="2" fill="white" opacity="0.5"/>
      <circle cx="62" cy="28" r="2.5" fill="white" opacity="0.6"/>
      <circle cx="56" cy="20" r="1.5" fill="white" opacity="0.45"/>
      {/* Heart */}
      <path d="M57 50 C57 47 54 45 52 47 C50 45 47 47 47 50 C47 53 52 57 52 57 C52 57 57 53 57 50Z" fill="#fda4af" opacity="0.9"/>
    </svg>
  );
}

export function IconCoverCendrillon({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sc-cn-bg" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#a78bfa"/>
          <stop offset="100%" stopColor="#4c1d95"/>
        </radialGradient>
        <filter id="sc-cn-sh"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#2e1065" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#sc-cn-bg)" filter="url(#sc-cn-sh)"/>
      <ellipse cx="33" cy="22" rx="15" ry="8" fill="white" opacity="0.22"/>
      {/* Slipper base */}
      <path d="M18 52 Q22 42 34 40 Q50 38 56 46 Q60 50 58 54 Q55 58 48 58 L22 58 Q16 58 18 52Z" fill="#bfdbfe" opacity="0.92"/>
      {/* Slipper shine */}
      <path d="M24 45 Q32 41 42 41 Q38 43 30 46Z" fill="white" opacity="0.45"/>
      {/* Heel */}
      <rect x="21" y="54" width="8" height="8" rx="2" fill="#93c5fd"/>
      {/* Glass shimmer lines */}
      <path d="M30 43 L26 56" stroke="white" strokeWidth="1" opacity="0.4" strokeLinecap="round"/>
      <path d="M37 42 L34 57" stroke="white" strokeWidth="1" opacity="0.3" strokeLinecap="round"/>
      {/* Magic star */}
      <path d="M60 22 L62 28 L68 28 L63 32 L65 38 L60 34 L55 38 L57 32 L52 28 L58 28Z" fill="#fde68a" opacity="0.95"/>
      <path d="M60 22 L62 28 L68 28 L63 32 L65 38 L60 34 L55 38 L57 32 L52 28 L58 28Z" fill="white" opacity="0.25"/>
      {/* Small sparkles */}
      <circle cx="20" cy="30" r="2" fill="#e9d5ff" opacity="0.8"/>
      <circle cx="64" cy="50" r="1.5" fill="#e9d5ff" opacity="0.7"/>
      <circle cx="15" cy="45" r="1.5" fill="#fde68a" opacity="0.6"/>
    </svg>
  );
}

export function IconCoverChaperonRouge({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sc-cr-bg" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#f87171"/>
          <stop offset="100%" stopColor="#7f1d1d"/>
        </radialGradient>
        <filter id="sc-cr-sh"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#3b0000" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#sc-cr-bg)" filter="url(#sc-cr-sh)"/>
      <ellipse cx="33" cy="22" rx="15" ry="8" fill="white" opacity="0.22"/>
      {/* Forest trees */}
      <rect x="10" y="44" width="6" height="18" rx="2" fill="#14532d"/>
      <polygon points="13,26 6,46 20,46" fill="#16a34a"/>
      <rect x="62" y="48" width="6" height="14" rx="2" fill="#14532d"/>
      <polygon points="65,30 58,50 72,50" fill="#15803d"/>
      {/* Cloak */}
      <path d="M30 32 Q40 28 50 32 L54 62 Q40 66 26 62Z" fill="#dc2626"/>
      <path d="M30 32 Q40 28 50 32 L54 62 Q40 66 26 62Z" fill="#b91c1c" opacity="0.3"/>
      {/* Hood */}
      <ellipse cx="40" cy="32" rx="12" ry="10" fill="#dc2626"/>
      <ellipse cx="40" cy="30" rx="9" ry="7" fill="#ef4444"/>
      {/* Face */}
      <circle cx="40" cy="32" r="7" fill="#fde68a"/>
      {/* Basket */}
      <path d="M22 52 Q26 46 34 48 Q36 54 32 58 Q24 58 22 52Z" fill="#92400e"/>
      <path d="M24 49 Q30 46 34 48" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <circle cx="29" cy="53" r="2" fill="#fca5a5"/>
    </svg>
  );
}

export function IconCoverHansel({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sc-hg-bg" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#fb923c"/>
          <stop offset="100%" stopColor="#7c2d12"/>
        </radialGradient>
        <filter id="sc-hg-sh"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#431407" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#sc-hg-bg)" filter="url(#sc-hg-sh)"/>
      <ellipse cx="33" cy="22" rx="15" ry="8" fill="white" opacity="0.22"/>
      {/* House walls */}
      <rect x="22" y="46" width="36" height="22" rx="2" fill="#fde68a"/>
      {/* Roof */}
      <polygon points="18,48 40,28 62,48" fill="#fb7185"/>
      <polygon points="18,48 40,28 62,48" fill="#f43f5e" opacity="0.3"/>
      {/* Candy decorations on roof */}
      <circle cx="29" cy="42" r="3" fill="#a855f7"/>
      <circle cx="40" cy="34" r="3" fill="#22d3ee"/>
      <circle cx="51" cy="42" r="3" fill="#fb923c"/>
      {/* Door */}
      <rect x="35" y="54" width="10" height="14" rx="3" fill="#dc2626"/>
      {/* Window */}
      <rect x="24" y="50" width="10" height="10" rx="2" fill="#bae6fd"/>
      <rect x="24" y="50" width="10" height="10" rx="2" stroke="#fde68a" strokeWidth="1.5" fill="none"/>
      {/* Stars */}
      <circle cx="16" cy="28" r="2.5" fill="#fde68a" opacity="0.9"/>
      <circle cx="64" cy="24" r="2" fill="#fde68a" opacity="0.8"/>
      <circle cx="68" cy="36" r="1.5" fill="white" opacity="0.7"/>
    </svg>
  );
}

export function IconCoverRapunzel({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sc-rp-bg" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#c084fc"/>
          <stop offset="100%" stopColor="#581c87"/>
        </radialGradient>
        <filter id="sc-rp-sh"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#2e1065" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#sc-rp-bg)" filter="url(#sc-rp-sh)"/>
      <ellipse cx="33" cy="22" rx="15" ry="8" fill="white" opacity="0.22"/>
      {/* Tower */}
      <rect x="32" y="36" width="16" height="30" rx="2" fill="#d8b4fe" opacity="0.8"/>
      <rect x="30" y="24" width="20" height="14" rx="3" fill="#a855f7" opacity="0.9"/>
      {/* Tower top */}
      <polygon points="28,26 40,14 52,26" fill="#7c3aed"/>
      {/* Window */}
      <rect x="36" y="28" width="8" height="8" rx="2" fill="#fde68a" opacity="0.9"/>
      {/* Braid flowing down */}
      <path d="M40 38 C36 44 44 50 40 56 C36 62 44 68 40 72" stroke="#fbbf24" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M40 38 C44 44 36 50 40 56 C44 62 36 68 40 72" stroke="#f59e0b" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>
      {/* Braid end */}
      <ellipse cx="40" cy="73" rx="4" ry="2.5" fill="#fbbf24" opacity="0.8"/>
      {/* Stars */}
      <circle cx="18" cy="30" r="2" fill="#e9d5ff" opacity="0.9"/>
      <circle cx="62" cy="22" r="2.5" fill="#fde68a" opacity="0.8"/>
      <circle cx="66" cy="40" r="1.5" fill="#e9d5ff" opacity="0.7"/>
    </svg>
  );
}

export function IconCoverCygne({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sc-cy-bg" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#38bdf8"/>
          <stop offset="100%" stopColor="#0c4a6e"/>
        </radialGradient>
        <filter id="sc-cy-sh"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#082f49" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#sc-cy-bg)" filter="url(#sc-cy-sh)"/>
      <ellipse cx="33" cy="22" rx="15" ry="8" fill="white" opacity="0.22"/>
      {/* Lake reflection */}
      <ellipse cx="40" cy="60" rx="28" ry="10" fill="#0ea5e9" opacity="0.4"/>
      {/* Swan body */}
      <ellipse cx="38" cy="52" rx="18" ry="11" fill="white" opacity="0.95"/>
      {/* Swan neck */}
      <path d="M38 52 C36 44 38 36 42 30 C44 26 46 24 44 22" stroke="white" strokeWidth="7" fill="none" strokeLinecap="round"/>
      {/* Swan head */}
      <circle cx="43" cy="20" r="6" fill="white" opacity="0.97"/>
      {/* Beak */}
      <path d="M47 19 L54 18 L47 22Z" fill="#fb923c"/>
      {/* Eye */}
      <circle cx="45" cy="19" r="1.5" fill="#1e3a5f"/>
      {/* Wing detail */}
      <path d="M22 52 C28 46 38 50 50 52 C46 56 28 58 22 52Z" fill="white" opacity="0.5"/>
      {/* Water ripples */}
      <ellipse cx="40" cy="62" rx="14" ry="3" fill="none" stroke="#7dd3fc" strokeWidth="1.5" opacity="0.6"/>
      <ellipse cx="40" cy="66" rx="20" ry="4" fill="none" stroke="#7dd3fc" strokeWidth="1" opacity="0.4"/>
    </svg>
  );
}

export function IconCoverSirene({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sc-sr-bg" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#2dd4bf"/>
          <stop offset="100%" stopColor="#134e4a"/>
        </radialGradient>
        <filter id="sc-sr-sh"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#042f2e" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#sc-sr-bg)" filter="url(#sc-sr-sh)"/>
      <ellipse cx="33" cy="22" rx="15" ry="8" fill="white" opacity="0.22"/>
      {/* Tail */}
      <path d="M30 50 Q40 62 50 50 Q46 40 40 38 Q34 40 30 50Z" fill="#059669"/>
      <path d="M30 50 Q40 62 50 50 Q46 40 40 38 Q34 40 30 50Z" fill="#10b981" opacity="0.5"/>
      {/* Tail fin */}
      <path d="M30 60 Q40 70 50 60 L50 58 Q40 66 30 58Z" fill="#047857"/>
      {/* Scale lines */}
      <path d="M33 46 Q40 44 47 46" stroke="#34d399" strokeWidth="1" fill="none" opacity="0.6"/>
      <path d="M31 50 Q40 48 49 50" stroke="#34d399" strokeWidth="1" fill="none" opacity="0.6"/>
      {/* Body */}
      <ellipse cx="40" cy="36" rx="10" ry="10" fill="#fde68a"/>
      {/* Hair */}
      <path d="M32 30 C28 36 30 44 32 50 Q36 46 36 38Z" fill="#f59e0b"/>
      <path d="M48 30 C52 36 50 44 48 50 Q44 46 44 38Z" fill="#f59e0b"/>
      {/* Face */}
      <circle cx="37" cy="35" r="1.5" fill="#1e3a5f"/>
      <circle cx="43" cy="35" r="1.5" fill="#1e3a5f"/>
      <path d="M37 39 Q40 41 43 39" stroke="#f43f5e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Bubbles */}
      <circle cx="18" cy="35" r="3" fill="none" stroke="#a7f3d0" strokeWidth="1.5" opacity="0.8"/>
      <circle cx="22" cy="26" r="2" fill="none" stroke="#a7f3d0" strokeWidth="1.5" opacity="0.7"/>
      <circle cx="62" cy="40" r="2.5" fill="none" stroke="#a7f3d0" strokeWidth="1.5" opacity="0.7"/>
      {/* Starfish */}
      <path d="M60 58 L61 62 L65 62 L62 64 L63 68 L60 66 L57 68 L58 64 L55 62 L59 62Z" fill="#fb923c" opacity="0.85" transform="scale(0.7) translate(26,26)"/>
    </svg>
  );
}

export function IconCoverReineDesNeiges({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sc-rn-bg" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#7dd3fc"/>
          <stop offset="100%" stopColor="#1e3a8a"/>
        </radialGradient>
        <filter id="sc-rn-sh"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1e3a8a" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#sc-rn-bg)" filter="url(#sc-rn-sh)"/>
      <ellipse cx="33" cy="22" rx="15" ry="8" fill="white" opacity="0.22"/>
      {/* Snowflake center */}
      <circle cx="40" cy="44" r="5" fill="white" opacity="0.95"/>
      {/* Snowflake arms */}
      <line x1="40" y1="26" x2="40" y2="62" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
      <line x1="22" y1="44" x2="58" y2="44" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
      <line x1="27" y1="31" x2="53" y2="57" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
      <line x1="53" y1="31" x2="27" y2="57" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
      {/* Snowflake tips */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 40 + 18 * Math.cos(rad);
        const y = 44 + 18 * Math.sin(rad);
        return <circle key={i} cx={x} cy={y} r="2.5" fill="white" opacity="0.85"/>;
      })}
      {/* Ice crown */}
      <path d="M26 22 L28 32 L32 26 L36 34 L40 22 L44 34 L48 26 L52 32 L54 22 L50 36 L30 36Z" fill="#bfdbfe" opacity="0.9"/>
      <path d="M26 22 L28 32 L32 26 L36 34 L40 22 L44 34 L48 26 L52 32 L54 22 L50 36 L30 36Z" fill="white" opacity="0.25"/>
    </svg>
  );
}

export function IconCoverChatBotte({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sc-cb-bg" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#fb923c"/>
          <stop offset="100%" stopColor="#7c2d12"/>
        </radialGradient>
        <filter id="sc-cb-sh"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#431407" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#sc-cb-bg)" filter="url(#sc-cb-sh)"/>
      <ellipse cx="33" cy="22" rx="15" ry="8" fill="white" opacity="0.22"/>
      {/* Boot */}
      <path d="M26 42 L26 62 Q26 66 30 66 L50 66 Q54 66 54 62 L54 56 Q54 52 50 52 L36 52 L36 42 Q36 38 31 38 Q26 38 26 42Z" fill="#92400e"/>
      <path d="M26 42 L26 62 Q26 66 30 66 L50 66 Q54 66 54 62 L54 56 Q54 52 50 52 L36 52 L36 42 Q36 38 31 38 Q26 38 26 42Z" fill="#78350f" opacity="0.4"/>
      {/* Boot buckle */}
      <rect x="38" y="58" width="10" height="5" rx="2" fill="#fbbf24"/>
      <rect x="40" y="59" width="6" height="3" rx="1" fill="#b45309"/>
      {/* Hat with feather */}
      <ellipse cx="44" cy="28" rx="14" ry="5" fill="#292524"/>
      <rect x="36" y="14" width="16" height="16" rx="4" fill="#1c1917"/>
      <path d="M50 18 C56 12 62 8 60 16 C58 20 52 20 50 18Z" fill="#86efac"/>
      <path d="M50 18 C54 14 58 12 57 17 C55 20 51 19 50 18Z" fill="#4ade80" opacity="0.7"/>
      {/* Cat face */}
      <circle cx="44" cy="22" r="5" fill="#fde68a"/>
      <circle cx="42" cy="21" r="1" fill="#1c1917"/>
      <circle cx="46" cy="21" r="1" fill="#1c1917"/>
      {/* Whiskers */}
      <line x1="36" y1="23" x2="44" y2="23" stroke="#1c1917" strokeWidth="0.8" opacity="0.6"/>
      <line x1="44" y1="23" x2="52" y2="22" stroke="#1c1917" strokeWidth="0.8" opacity="0.6"/>
    </svg>
  );
}

export function IconCoverPinocchio({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sc-pc-bg" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#4ade80"/>
          <stop offset="100%" stopColor="#14532d"/>
        </radialGradient>
        <filter id="sc-pc-sh"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#052e16" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#sc-pc-bg)" filter="url(#sc-pc-sh)"/>
      <ellipse cx="33" cy="22" rx="15" ry="8" fill="white" opacity="0.22"/>
      {/* Puppet strings */}
      <line x1="32" y1="18" x2="30" y2="40" stroke="#d4a017" strokeWidth="1" opacity="0.7" strokeDasharray="2,2"/>
      <line x1="48" y1="18" x2="50" y2="40" stroke="#d4a017" strokeWidth="1" opacity="0.7" strokeDasharray="2,2"/>
      {/* Cross bar */}
      <rect x="24" y="14" width="32" height="4" rx="2" fill="#92400e"/>
      {/* Head */}
      <circle cx="40" cy="42" r="14" fill="#fde68a"/>
      {/* Hat */}
      <ellipse cx="40" cy="30" rx="11" ry="4" fill="#1d4ed8"/>
      <rect x="34" y="18" width="12" height="14" rx="3" fill="#1d4ed8"/>
      {/* Long nose */}
      <path d="M40 43 L60 41 L40 45Z" fill="#f59e0b"/>
      <path d="M40 43 L60 41" stroke="#b45309" strokeWidth="1" fill="none"/>
      {/* Eyes */}
      <circle cx="35" cy="40" r="2.5" fill="white"/>
      <circle cx="35" cy="40" r="1.5" fill="#1c1917"/>
      <circle cx="45" cy="40" r="2.5" fill="white"/>
      <circle cx="45" cy="40" r="1.5" fill="#1c1917"/>
      {/* Smile */}
      <path d="M34 48 Q40 52 46 48" stroke="#f59e0b" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Star */}
      <path d="M18 26 L19.2 30 L23 30 L20 32.4 L21.2 36 L18 33.6 L14.8 36 L16 32.4 L13 30 L16.8 30Z" fill="#fbbf24" opacity="0.9"/>
    </svg>
  );
}

export function IconCoverPeterPan({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sc-pp-bg" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#34d399"/>
          <stop offset="100%" stopColor="#064e3b"/>
        </radialGradient>
        <filter id="sc-pp-sh"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#022c22" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#sc-pp-bg)" filter="url(#sc-pp-sh)"/>
      <ellipse cx="33" cy="22" rx="15" ry="8" fill="white" opacity="0.22"/>
      {/* Moon */}
      <circle cx="58" cy="26" r="12" fill="#fde68a" opacity="0.9"/>
      <circle cx="62" cy="22" r="10" fill="#059669" opacity="0.8"/>
      {/* Flying silhouette */}
      <ellipse cx="32" cy="42" rx="10" ry="6" fill="#1c1917" opacity="0.85"/>
      {/* Head */}
      <circle cx="32" cy="34" r="6" fill="#1c1917" opacity="0.85"/>
      {/* Hat tip */}
      <polygon points="32,24 29,34 35,34" fill="#1c1917" opacity="0.85"/>
      {/* Arms extended */}
      <path d="M22 40 Q28 38 32 42 Q36 38 42 36" stroke="#1c1917" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.85"/>
      {/* Shadow on ground */}
      <ellipse cx="32" cy="68" rx="12" ry="4" fill="#1c1917" opacity="0.3"/>
      {/* Fairy sparkles */}
      <circle cx="56" cy="46" r="3" fill="#fde68a" opacity="0.9"/>
      <circle cx="60" cy="42" r="2" fill="#fde68a" opacity="0.8"/>
      <circle cx="52" cy="44" r="1.5" fill="#fde68a" opacity="0.7"/>
      {/* Star trail */}
      <circle cx="18" cy="32" r="1.5" fill="#fde68a" opacity="0.8"/>
      <circle cx="14" cy="40" r="1" fill="#fde68a" opacity="0.6"/>
    </svg>
  );
}

export function IconCoverAlice({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sc-al-bg" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#c084fc"/>
          <stop offset="100%" stopColor="#4c1d95"/>
        </radialGradient>
        <filter id="sc-al-sh"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#2e1065" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#sc-al-bg)" filter="url(#sc-al-sh)"/>
      <ellipse cx="33" cy="22" rx="15" ry="8" fill="white" opacity="0.22"/>
      {/* Mad hat */}
      <ellipse cx="44" cy="36" rx="13" ry="5" fill="#1c1917"/>
      <rect x="36" y="14" width="16" height="24" rx="3" fill="#7c3aed"/>
      {/* Hat band */}
      <rect x="36" y="34" width="16" height="4" fill="#fde68a"/>
      {/* Hat label */}
      <rect x="41" y="35" width="8" height="3" rx="1" fill="white" opacity="0.8"/>
      {/* Rabbit */}
      <circle cx="24" cy="48" r="8" fill="white" opacity="0.9"/>
      {/* Rabbit ears */}
      <ellipse cx="20" cy="36" rx="3" ry="8" fill="white" opacity="0.9"/>
      <ellipse cx="20" cy="36" rx="1.5" ry="6" fill="#fda4af" opacity="0.7"/>
      <ellipse cx="28" cy="35" rx="3" ry="8" fill="white" opacity="0.9"/>
      <ellipse cx="28" cy="35" rx="1.5" ry="6" fill="#fda4af" opacity="0.7"/>
      {/* Rabbit eyes */}
      <circle cx="21" cy="47" r="1.5" fill="#f43f5e"/>
      <circle cx="27" cy="47" r="1.5" fill="#f43f5e"/>
      {/* Pocket watch */}
      <circle cx="56" cy="52" r="8" fill="#fbbf24" opacity="0.9"/>
      <circle cx="56" cy="52" r="6" fill="#fde68a"/>
      <line x1="56" y1="52" x2="56" y2="47" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="56" y1="52" x2="60" y2="54" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="56" cy="44" r="1.5" fill="#fbbf24"/>
    </svg>
  );
}

export function IconCoverArcEnCiel({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sc-arc-bg" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#60a5fa"/>
          <stop offset="100%" stopColor="#1e3a8a"/>
        </radialGradient>
        <filter id="sc-arc-sh"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1e3a8a" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#sc-arc-bg)" filter="url(#sc-arc-sh)"/>
      <ellipse cx="33" cy="22" rx="15" ry="8" fill="white" opacity="0.22"/>
      {/* Rainbow arcs */}
      <path d="M10 58 A30 30 0 0 1 70 58" stroke="#ef4444" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M14 58 A26 26 0 0 1 66 58" stroke="#f97316" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M18 58 A22 22 0 0 1 62 58" stroke="#eab308" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M22 58 A18 18 0 0 1 58 58" stroke="#22c55e" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M26 58 A14 14 0 0 1 54 58" stroke="#3b82f6" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M30 58 A10 10 0 0 1 50 58" stroke="#a855f7" strokeWidth="5" fill="none" strokeLinecap="round"/>
      {/* Clouds */}
      <ellipse cx="16" cy="57" rx="8" ry="5" fill="white" opacity="0.9"/>
      <ellipse cx="12" cy="56" rx="5" ry="4" fill="white" opacity="0.9"/>
      <ellipse cx="20" cy="56" rx="5" ry="4" fill="white" opacity="0.9"/>
      <ellipse cx="64" cy="57" rx="8" ry="5" fill="white" opacity="0.9"/>
      <ellipse cx="60" cy="56" rx="5" ry="4" fill="white" opacity="0.9"/>
      <ellipse cx="68" cy="56" rx="5" ry="4" fill="white" opacity="0.9"/>
      {/* Sun */}
      <circle cx="40" cy="28" r="8" fill="#fde68a" opacity="0.95"/>
      <circle cx="40" cy="28" r="6" fill="#fbbf24"/>
      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line key={i}
            x1={40 + 9 * Math.cos(rad)} y1={28 + 9 * Math.sin(rad)}
            x2={40 + 14 * Math.cos(rad)} y2={28 + 14 * Math.sin(rad)}
            stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.8"
          />
        );
      })}
      {/* Smile on sun */}
      <path d="M36 30 Q40 33 44 30" stroke="#b45309" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <circle cx="37" cy="27" r="1" fill="#b45309"/>
      <circle cx="43" cy="27" r="1" fill="#b45309"/>
    </svg>
  );
}

// ─── LECTURE COVERS ───────────────────────────────────────────────────────────

export function IconCoverAnniversaire({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sc-av-bg" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#f472b6"/>
          <stop offset="100%" stopColor="#831843"/>
        </radialGradient>
        <filter id="sc-av-sh"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#500724" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#sc-av-bg)" filter="url(#sc-av-sh)"/>
      <ellipse cx="33" cy="22" rx="15" ry="8" fill="white" opacity="0.22"/>
      {/* Cake base */}
      <rect x="16" y="50" width="48" height="18" rx="4" fill="#fde68a"/>
      <rect x="16" y="50" width="48" height="6" rx="2" fill="#fbbf24"/>
      {/* Cake middle layer */}
      <rect x="20" y="38" width="40" height="14" rx="4" fill="#fda4af"/>
      <rect x="20" y="38" width="40" height="5" rx="2" fill="#f9a8d4"/>
      {/* Frosting drips */}
      <path d="M22 43 Q24 46 26 43 Q28 46 30 43 Q32 46 34 43 Q36 46 38 43 Q40 46 42 43 Q44 46 46 43 Q48 46 50 43 Q52 46 54 43 Q56 46 58 43" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Candle */}
      <rect x="38" y="24" width="4" height="16" rx="2" fill="#a855f7"/>
      {/* Flame */}
      <ellipse cx="40" cy="22" rx="3" ry="4" fill="#fb923c"/>
      <ellipse cx="40" cy="21" rx="2" ry="3" fill="#fde68a"/>
      {/* Confetti */}
      <rect x="18" y="28" width="4" height="4" rx="1" fill="#22c55e" opacity="0.9" transform="rotate(20 18 28)"/>
      <rect x="58" y="26" width="4" height="4" rx="1" fill="#3b82f6" opacity="0.9" transform="rotate(-15 58 26)"/>
      <rect x="64" y="38" width="3" height="3" rx="1" fill="#eab308" opacity="0.9" transform="rotate(30 64 38)"/>
      <rect x="14" y="42" width="3" height="3" rx="1" fill="#ef4444" opacity="0.9" transform="rotate(-20 14 42)"/>
      <circle cx="62" cy="30" r="2" fill="#fda4af" opacity="0.9"/>
      <circle cx="16" cy="36" r="2" fill="#a5f3fc" opacity="0.9"/>
    </svg>
  );
}

export function IconCoverCartable({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sc-ct-bg" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#818cf8"/>
          <stop offset="100%" stopColor="#312e81"/>
        </radialGradient>
        <filter id="sc-ct-sh"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1e1b4b" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#sc-ct-bg)" filter="url(#sc-ct-sh)"/>
      <ellipse cx="33" cy="22" rx="15" ry="8" fill="white" opacity="0.22"/>
      {/* Backpack body */}
      <rect x="18" y="34" width="44" height="34" rx="6" fill="#4f46e5"/>
      <rect x="18" y="34" width="44" height="34" rx="6" fill="#6366f1" opacity="0.5"/>
      {/* Backpack top */}
      <rect x="24" y="28" width="32" height="10" rx="4" fill="#4338ca"/>
      {/* Strap */}
      <path d="M30 28 Q30 20 40 20 Q50 20 50 28" stroke="#312e81" strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* Front pocket */}
      <rect x="24" y="44" width="32" height="16" rx="4" fill="#3730a3"/>
      {/* Zipper */}
      <line x1="26" y1="44" x2="54" y2="44" stroke="#818cf8" strokeWidth="2" strokeDasharray="3,2"/>
      <circle cx="54" cy="44" r="2" fill="#fbbf24"/>
      {/* Pencil sticking out */}
      <rect x="52" y="18" width="4" height="18" rx="1" fill="#fbbf24"/>
      <polygon points="52,18 56,18 54,12" fill="#f87171"/>
      <rect x="52" y="18" width="4" height="3" fill="#d1d5db"/>
      {/* Small star */}
      <circle cx="22" cy="30" r="2.5" fill="#e0e7ff" opacity="0.8"/>
    </svg>
  );
}

export function IconCoverGouter({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sc-gt-bg" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#fb923c"/>
          <stop offset="100%" stopColor="#9a3412"/>
        </radialGradient>
        <filter id="sc-gt-sh"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#431407" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#sc-gt-bg)" filter="url(#sc-gt-sh)"/>
      <ellipse cx="33" cy="22" rx="15" ry="8" fill="white" opacity="0.22"/>
      {/* Cookie left */}
      <circle cx="28" cy="46" r="14" fill="#d97706"/>
      <circle cx="28" cy="46" r="12" fill="#fbbf24"/>
      {/* Chocolate chips */}
      <circle cx="24" cy="42" r="2.5" fill="#92400e"/>
      <circle cx="32" cy="42" r="2.5" fill="#92400e"/>
      <circle cx="28" cy="50" r="2.5" fill="#92400e"/>
      <circle cx="22" cy="50" r="2" fill="#92400e"/>
      <circle cx="34" cy="50" r="2" fill="#92400e"/>
      {/* Hand reaching */}
      <path d="M50 44 Q54 40 58 42 Q62 44 60 52 Q58 58 50 56 Q44 54 44 48 Q44 44 50 44Z" fill="#fde68a" opacity="0.9"/>
      {/* Fingers */}
      <path d="M52 44 Q54 36 56 38 Q58 40 56 44" stroke="#fde68a" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M56 43 Q58 36 60 38 Q62 40 60 44" stroke="#fde68a" strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* Cookie right being shared */}
      <circle cx="58" cy="54" r="8" fill="#d97706" opacity="0.7"/>
      <circle cx="58" cy="54" r="6" fill="#fbbf24" opacity="0.7"/>
    </svg>
  );
}

export function IconCoverChatPerdu({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sc-chp-bg" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#fb923c"/>
          <stop offset="100%" stopColor="#7c2d12"/>
        </radialGradient>
        <filter id="sc-chp-sh"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#431407" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#sc-chp-bg)" filter="url(#sc-chp-sh)"/>
      <ellipse cx="33" cy="22" rx="15" ry="8" fill="white" opacity="0.22"/>
      {/* House simple */}
      <rect x="46" y="46" width="22" height="18" rx="2" fill="#fde68a" opacity="0.9"/>
      <polygon points="44,48 57,34 70,48" fill="#f97316" opacity="0.9"/>
      <rect x="52" y="54" width="8" height="10" rx="2" fill="#dc2626" opacity="0.8"/>
      {/* Cat body */}
      <ellipse cx="26" cy="52" rx="12" ry="10" fill="#f97316"/>
      {/* Cat head */}
      <circle cx="26" cy="36" r="10" fill="#fb923c"/>
      {/* Ears */}
      <polygon points="18,30 16,20 24,28" fill="#f97316"/>
      <polygon points="34,30 36,20 28,28" fill="#f97316"/>
      <polygon points="19,29 17,22 24,28" fill="#fda4af"/>
      <polygon points="33,29 35,22 28,28" fill="#fda4af"/>
      {/* Face */}
      <circle cx="22" cy="35" r="2" fill="#1c1917"/>
      <circle cx="30" cy="35" r="2" fill="#1c1917"/>
      <circle cx="22.8" cy="34.2" r="0.7" fill="white"/>
      <circle cx="30.8" cy="34.2" r="0.7" fill="white"/>
      {/* Sad mouth */}
      <path d="M22 40 Q26 38 30 40" stroke="#1c1917" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Whiskers */}
      <line x1="14" y1="37" x2="23" y2="38" stroke="#1c1917" strokeWidth="0.8" opacity="0.6"/>
      <line x1="14" y1="40" x2="23" y2="39.5" stroke="#1c1917" strokeWidth="0.8" opacity="0.6"/>
      <line x1="29" y1="38" x2="38" y2="37" stroke="#1c1917" strokeWidth="0.8" opacity="0.6"/>
      <line x1="29" y1="39.5" x2="38" y2="40" stroke="#1c1917" strokeWidth="0.8" opacity="0.6"/>
      {/* Paw print */}
      <circle cx="38" cy="64" r="3" fill="#fde68a" opacity="0.7"/>
      <circle cx="33" cy="62" r="1.5" fill="#fde68a" opacity="0.7"/>
      <circle cx="43" cy="62" r="1.5" fill="#fde68a" opacity="0.7"/>
      <circle cx="36" cy="60" r="1.5" fill="#fde68a" opacity="0.7"/>
      <circle cx="40" cy="60" r="1.5" fill="#fde68a" opacity="0.7"/>
    </svg>
  );
}

export function IconCoverParcSortie({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sc-ps-bg" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#4ade80"/>
          <stop offset="100%" stopColor="#14532d"/>
        </radialGradient>
        <filter id="sc-ps-sh"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#052e16" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#sc-ps-bg)" filter="url(#sc-ps-sh)"/>
      <ellipse cx="33" cy="22" rx="15" ry="8" fill="white" opacity="0.22"/>
      {/* Ground */}
      <rect x="4" y="58" width="72" height="16" rx="4" fill="#16a34a" opacity="0.6"/>
      {/* Tree trunk */}
      <rect x="52" y="40" width="6" height="20" rx="2" fill="#92400e"/>
      {/* Tree canopy */}
      <circle cx="55" cy="34" r="14" fill="#22c55e"/>
      <circle cx="55" cy="30" r="10" fill="#4ade80" opacity="0.7"/>
      {/* Ball */}
      <circle cx="22" cy="56" r="9" fill="#ef4444"/>
      <path d="M14 52 Q22 48 30 52" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6"/>
      <path d="M14 56 Q22 60 30 56" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6"/>
      {/* Child silhouette 1 */}
      <circle cx="32" cy="44" r="4" fill="#fde68a"/>
      <rect x="29" y="48" width="6" height="12" rx="3" fill="#3b82f6"/>
      {/* Legs */}
      <rect x="29" y="56" width="2.5" height="6" rx="1" fill="#fde68a"/>
      <rect x="32.5" y="56" width="2.5" height="6" rx="1" fill="#fde68a"/>
      {/* Arm reaching */}
      <line x1="35" y1="50" x2="22" y2="55" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
      {/* Sun */}
      <circle cx="14" cy="22" r="7" fill="#fbbf24" opacity="0.9"/>
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line key={i}
            x1={14 + 8 * Math.cos(rad)} y1={22 + 8 * Math.sin(rad)}
            x2={14 + 12 * Math.cos(rad)} y2={22 + 12 * Math.sin(rad)}
            stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.8"
          />
        );
      })}
    </svg>
  );
}

// ─── MAP: conte.id / story.id → cover component ───────────────────────────────

export const STORY_COVER_MAP = {
  // Contes (keyed by English id from contes.js)
  'snow-white':         IconCoverBlancheNeige,
  'cinderella':         IconCoverCendrillon,
  'little-red-riding-hood': IconCoverChaperonRouge,
  'hansel-and-gretel':  IconCoverHansel,
  'rapunzel':           IconCoverRapunzel,
  'the-ugly-duckling':  IconCoverCygne,
  'the-little-mermaid': IconCoverSirene,
  'the-snow-queen':     IconCoverReineDesNeiges,
  'puss-in-boots':      IconCoverChatBotte,
  'pinocchio':          IconCoverPinocchio,
  'peter-pan':          IconCoverPeterPan,
  'alice-in-wonderland': IconCoverAlice,
  'the-wizard-of-oz':   IconCoverArcEnCiel,
  // Lecture stories (keyed by story.id)
  'lecture_001':        IconCoverAnniversaire,
  'lecture_002':        IconCoverCartable,
  'lecture_003':        IconCoverGouter,
  'lecture_004':        IconCoverChatPerdu,
  'lecture_005':        IconCoverParcSortie,
};
