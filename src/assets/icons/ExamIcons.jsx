// Lena — unique SVG icons for Exam and Library sections
// viewBox 48×48, radial gradient circle + drop-shadow + glass highlight
// ID prefix: ei-{code}-bg / ei-{code}-sh

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
// EXAM HUB SUBJECTS
// ═══════════════════════════════════════════════════════════════════════════════

export function IconExamAddition({ size = 48 }) {
  return (
    <Base id="ei-add" c0="#4ade80" c1="#14532d" shadow="#052e16" size={size}>
      {/* Two number blocks coming together */}
      <rect x="5" y="18" width="13" height="13" rx="3" fill="white" opacity="0.88" />
      <text x="8.5" y="28.5" fontSize="10" fontWeight="900" fill="#15803d" fontFamily="system-ui">3</text>
      <rect x="30" y="18" width="13" height="13" rx="3" fill="white" opacity="0.88" />
      <text x="33.5" y="28.5" fontSize="10" fontWeight="900" fill="#15803d" fontFamily="system-ui">5</text>
      {/* Plus sign */}
      <rect x="22" y="21" width="4" height="7" rx="2" fill="white" opacity="0.95" />
      <rect x="20" y="23" width="8" height="3" rx="1.5" fill="white" opacity="0.95" />
      {/* Result */}
      <rect x="13" y="34" width="22" height="10" rx="3" fill="#fde68a" opacity="0.9" />
      <text x="19" y="42" fontSize="10" fontWeight="900" fill="#92400e" fontFamily="system-ui">= 8</text>
    </Base>
  );
}

export function IconExamSoustraction({ size = 48 }) {
  return (
    <Base id="ei-sub" c0="#f87171" c1="#7f1d1d" shadow="#450a0a" size={size}>
      {/* 9 blocks, 4 crossed out */}
      {[0,1,2].map(r => [0,1,2].map(c => (
        <rect key={`${r}${c}`} x={8+c*11} y={10+r*10} width="9" height="8" rx="2"
          fill="white" opacity={r===2&&c>=1 ? 0.3 : 0.85} />
      )))}
      {/* Cross out lines on last 4 */}
      <line x1="19" y1="30" x2="27" y2="38" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      <line x1="27" y1="30" x2="19" y2="38" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="30" x2="38" y2="38" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      <line x1="38" y1="30" x2="30" y2="38" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      {/* Minus */}
      <rect x="18" y="22" width="12" height="3" rx="1.5" fill="#fde68a" opacity="0.95" />
    </Base>
  );
}

export function IconExamMultiplication({ size = 48 }) {
  return (
    <Base id="ei-mul" c0="#fb923c" c1="#9a3412" shadow="#431407" size={size}>
      {/* Array of dots 3×4 */}
      {[0,1,2].map(r => [0,1,2,3].map(c => (
        <circle key={`${r}${c}`} cx={10+c*9} cy={12+r*9} r="3.5" fill="white" opacity="0.8" />
      )))}
      {/* × */}
      <text x="8" y="44" fontSize="9" fontWeight="900" fill="#fde68a" fontFamily="system-ui">3×4 = 12</text>
    </Base>
  );
}

export function IconExamDivision({ size = 48 }) {
  return (
    <Base id="ei-div" c0="#818cf8" c1="#3730a3" shadow="#1e1b4b" size={size}>
      {/* ÷ symbol large */}
      <circle cx="24" cy="13" r="4" fill="white" opacity="0.9" />
      <rect x="10" y="22" width="28" height="4" rx="2" fill="white" opacity="0.9" />
      <circle cx="24" cy="35" r="4" fill="white" opacity="0.9" />
      {/* Sharing groups */}
      <rect x="6" y="40" width="8" height="5" rx="2" fill="#fde68a" opacity="0.8" />
      <rect x="16" y="40" width="8" height="5" rx="2" fill="#fde68a" opacity="0.8" />
      <rect x="26" y="40" width="8" height="5" rx="2" fill="#fde68a" opacity="0.8" />
      <text x="8.5" y="44.5" fontSize="5" fontWeight="700" fill="#3730a3" fontFamily="system-ui">4</text>
      <text x="18.5" y="44.5" fontSize="5" fontWeight="700" fill="#3730a3" fontFamily="system-ui">4</text>
      <text x="28.5" y="44.5" fontSize="5" fontWeight="700" fill="#3730a3" fontFamily="system-ui">4</text>
    </Base>
  );
}

export function IconExamCalculMental({ size = 48 }) {
  return (
    <Base id="ei-cm" c0="#fbbf24" c1="#78350f" shadow="#451a03" size={size}>
      {/* Brain silhouette */}
      <path d="M16 30 Q10 28 10 22 Q10 14 18 12 Q22 10 26 14 Q30 10 34 14 Q40 16 38 24 Q36 30 30 32 Q28 34 26 32 Q24 34 22 32 Q18 34 16 30Z"
        fill="white" opacity="0.85" />
      {/* Brain fold lines */}
      <path d="M18 20 Q22 18 24 22 Q26 18 30 20" stroke="#d97706" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M16 26 Q20 24 24 28 Q28 24 32 26" stroke="#d97706" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Numbers floating out */}
      <text x="7" y="12" fontSize="7" fontWeight="900" fill="#fde68a" fontFamily="system-ui">7</text>
      <text x="36" y="10" fontSize="7" fontWeight="900" fill="#fde68a" fontFamily="system-ui">+</text>
      <text x="38" y="18" fontSize="7" fontWeight="900" fill="#fde68a" fontFamily="system-ui">5</text>
      <text x="7" y="42" fontSize="6" fontWeight="700" fill="#fde68a" fontFamily="system-ui">=12</text>
    </Base>
  );
}

export function IconExamFractions({ size = 48 }) {
  return (
    <Base id="ei-frac" c0="#f59e0b" c1="#78350f" shadow="#451a03" size={size}>
      {/* Fraction bar */}
      <text x="17" y="20" fontSize="14" fontWeight="900" fill="white" fontFamily="system-ui">3</text>
      <rect x="10" y="24" width="28" height="3.5" rx="1.75" fill="white" opacity="0.9" />
      <text x="17" y="40" fontSize="14" fontWeight="900" fill="white" fontFamily="system-ui">4</text>
      {/* Bar chart showing 3/4 */}
      <rect x="6" y="10" width="4" height="12" rx="1" fill="#fde68a" opacity="0.7" />
      <rect x="6" y="13" width="4" height="9" rx="1" fill="#fde68a" opacity="0.9" />
    </Base>
  );
}

export function IconExamLogique({ size = 48 }) {
  return (
    <Base id="ei-log" c0="#a78bfa" c1="#4c1d95" shadow="#2e1065" size={size}>
      {/* Venn diagram */}
      <circle cx="18" cy="24" r="13" fill="#7c3aed" opacity="0.5" stroke="white" strokeWidth="1.5" />
      <circle cx="30" cy="24" r="13" fill="#4c1d95" opacity="0.5" stroke="white" strokeWidth="1.5" />
      {/* Intersection */}
      <text x="20" y="27" fontSize="8" fontWeight="900" fill="white" fontFamily="system-ui">∩</text>
      {/* A and B labels */}
      <text x="10" y="20" fontSize="7" fontWeight="700" fill="white" opacity="0.8" fontFamily="system-ui">A</text>
      <text x="35" y="20" fontSize="7" fontWeight="700" fill="white" opacity="0.8" fontFamily="system-ui">B</text>
    </Base>
  );
}

export function IconExamProblemes({ size = 48 }) {
  return (
    <Base id="ei-pb" c0="#34d399" c1="#065f46" shadow="#022c22" size={size}>
      {/* Text block */}
      <rect x="6" y="10" width="36" height="24" rx="3" fill="white" opacity="0.88" />
      <rect x="10" y="14" width="28" height="2.5" rx="1" fill="#6b7280" opacity="0.5" />
      <rect x="10" y="19" width="22" height="2.5" rx="1" fill="#6b7280" opacity="0.5" />
      <rect x="10" y="24" width="28" height="2.5" rx="1" fill="#6b7280" opacity="0.5" />
      {/* Key maths element highlighted */}
      <rect x="22" y="19" width="10" height="7" rx="1.5" fill="#fde68a" opacity="0.8" />
      <text x="24" y="24.5" fontSize="5" fontWeight="700" fill="#92400e" fontFamily="system-ui">3×8?</text>
      {/* Answer box */}
      <rect x="10" y="37" width="28" height="9" rx="3" fill="#22c55e" opacity="0.85" />
      <text x="16" y="44" fontSize="6.5" fontWeight="700" fill="white" fontFamily="system-ui">= 24 apples</text>
    </Base>
  );
}

export function IconExamCultureGenerale({ size = 48 }) {
  return (
    <Base id="ei-cg" c0="#38bdf8" c1="#0c4a6e" shadow="#082f49" size={size}>
      {/* Globe */}
      <circle cx="24" cy="24" r="16" fill="#1d4ed8" opacity="0.7" />
      <path d="M14 18 Q18 12 24 14 Q30 12 34 18 Q38 24 34 30 Q30 36 24 34 Q18 36 14 30 Q10 24 14 18Z"
        fill="#22c55e" opacity="0.75" />
      <path d="M10 22 Q12 20 16 22 Q16 28 12 28 Q10 26 10 22Z" fill="#22c55e" opacity="0.6" />
      <ellipse cx="24" cy="24" rx="16" ry="6" fill="none" stroke="white" strokeWidth="0.8" opacity="0.3" />
      <line x1="8" y1="24" x2="40" y2="24" stroke="white" strokeWidth="0.8" opacity="0.3" />
      {/* Stars around */}
      <text x="5" y="13" fontSize="7" fontFamily="system-ui">⭐</text>
      <text x="36" y="10" fontSize="7" fontFamily="system-ui">⭐</text>
    </Base>
  );
}

export function IconExamDecimaux({ size = 48 }) {
  return (
    <Base id="ei-dec" c0="#60a5fa" c1="#1d4ed8" shadow="#1e3a8a" size={size}>
      {/* Number with decimal */}
      <text x="5" y="28" fontSize="16" fontWeight="900" fill="white" opacity="0.9" fontFamily="system-ui">3.7</text>
      {/* Decimal point highlighted */}
      <circle cx="24" cy="26" r="3" fill="#fbbf24" opacity="0.9" />
      {/* Number line */}
      <line x1="6" y1="36" x2="42" y2="36" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      {[6,12,18,24,30,36,42].map(x => (
        <line key={x} x1={x} y1="33" x2={x} y2="39" stroke="white" strokeWidth="1.5" opacity="0.6" />
      ))}
      {/* Marker */}
      <polygon points="24,30 21,34 27,34" fill="#fbbf24" opacity="0.9" />
    </Base>
  );
}

export function IconExamGeometrie({ size = 48 }) {
  return (
    <Base id="ei-geo" c0="#818cf8" c1="#3730a3" shadow="#1e1b4b" size={size}>
      <polygon points="24,8 10,36 38,36" fill="#fde68a" opacity="0.85" stroke="white" strokeWidth="1.5" />
      <circle cx="10" cy="42" r="6" fill="#f9a8d4" opacity="0.85" stroke="white" strokeWidth="1.5" />
      <rect x="30" y="36" width="12" height="12" rx="1.5" fill="#86efac" opacity="0.85" stroke="white" strokeWidth="1.5" />
      {/* Angle arc on triangle */}
      <path d="M13 36 Q16 30 18 36" fill="none" stroke="white" strokeWidth="1.2" opacity="0.6" />
    </Base>
  );
}

export function IconExamMesures({ size = 48 }) {
  return (
    <Base id="ei-mes" c0="#f59e0b" c1="#78350f" shadow="#451a03" size={size}>
      {/* Ruler */}
      <rect x="4" y="18" width="40" height="12" rx="3" fill="white" opacity="0.9" />
      {/* Tick marks */}
      {[8,12,16,20,24,28,32,36,40].map((x,i) => (
        <line key={x} x1={x} y1="18" x2={x} y2={i%2===0?22:24} stroke="#92400e" strokeWidth="1.5" />
      ))}
      {/* Numbers */}
      {[0,1,2,3,4].map(n => (
        <text key={n} x={6+n*8} y="28" fontSize="4" fill="#92400e" fontFamily="system-ui">{n}</text>
      ))}
      {/* Measuring tape curl */}
      <path d="M34 6 Q42 6 42 14 Q42 18 38 18" stroke="#d97706" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="34" cy="6" r="4" fill="#d97706" opacity="0.8" />
      <circle cx="34" cy="6" r="2" fill="white" opacity="0.6" />
      {/* Unit label */}
      <text x="16" y="40" fontSize="7" fontWeight="700" fill="white" fontFamily="system-ui">cm / m / km</text>
    </Base>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LIBRARY CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════

export function IconLibCalculMental({ size = 48 }) {
  return (
    <Base id="ei-lcm" c0="#fbbf24" c1="#78350f" shadow="#451a03" size={size}>
      {/* Lightning bolt + numbers */}
      <path d="M26 7 L14 25 L21 25 L16 41 L32 21 L25 21Z" fill="#fde047" opacity="0.95" />
      <circle cx="10" cy="12" r="5.5" fill="white" opacity="0.85" />
      <text x="7.5" y="15.5" fontSize="7" fontWeight="900" fill="#d97706" fontFamily="system-ui">7</text>
      <circle cx="38" cy="12" r="5.5" fill="white" opacity="0.85" />
      <text x="36" y="15.5" fontSize="7" fontWeight="900" fill="#d97706" fontFamily="system-ui">+</text>
      <circle cx="38" cy="36" r="5.5" fill="white" opacity="0.85" />
      <text x="35.5" y="39.5" fontSize="7" fontWeight="900" fill="#d97706" fontFamily="system-ui">9</text>
    </Base>
  );
}

export function IconLibProblemesMaths({ size = 48 }) {
  return (
    <Base id="ei-lpm" c0="#34d399" c1="#065f46" shadow="#022c22" size={size}>
      {/* Story problem text */}
      <rect x="6" y="8" width="36" height="26" rx="3" fill="white" opacity="0.88" />
      <rect x="10" y="12" width="28" height="2" rx="1" fill="#374151" opacity="0.4" />
      <rect x="10" y="16" width="22" height="2" rx="1" fill="#374151" opacity="0.4" />
      <rect x="10" y="20" width="28" height="2" rx="1" fill="#374151" opacity="0.4" />
      <rect x="10" y="24" width="16" height="2" rx="1" fill="#374151" opacity="0.4" />
      {/* Highlight */}
      <rect x="28" y="24" width="12" height="6" rx="2" fill="#fbbf24" opacity="0.8" />
      <text x="29.5" y="29" fontSize="5.5" fontWeight="700" fill="#92400e" fontFamily="system-ui">? €</text>
      {/* Pencil */}
      <g transform="rotate(-35 36 38)">
        <rect x="34" y="30" width="3.5" height="13" rx="1" fill="#fbbf24" />
        <polygon points="34,30 37.5,30 35.75,25" fill="#f87171" />
      </g>
    </Base>
  );
}

export function IconLibMesures({ size = 48 }) {
  return (
    <Base id="ei-lme" c0="#f97316" c1="#9a3412" shadow="#431407" size={size}>
      {/* Scale balance */}
      <rect x="22" y="10" width="4" height="24" rx="2" fill="white" opacity="0.85" />
      <rect x="8" y="10" width="32" height="4" rx="2" fill="white" opacity="0.85" />
      <circle cx="24" cy="9" r="3" fill="#fbbf24" opacity="0.9" />
      <line x1="8" y1="14" x2="8" y2="32" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <ellipse cx="8" cy="32" rx="8" ry="3" fill="white" opacity="0.7" />
      <text x="5" y="32" fontSize="5.5" fontWeight="700" fill="#9a3412" fontFamily="system-ui">kg</text>
      <line x1="40" y1="14" x2="40" y2="32" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <ellipse cx="40" cy="32" rx="8" ry="3" fill="white" opacity="0.7" />
      <text x="37.5" y="32" fontSize="5.5" fontWeight="700" fill="#9a3412" fontFamily="system-ui">m</text>
      {/* Ruler below */}
      <rect x="6" y="38" width="36" height="6" rx="2" fill="white" opacity="0.6" />
      {[10,16,22,28,34,40].map(x => (
        <line key={x} x1={x} y1="38" x2={x} y2="41" stroke="#9a3412" strokeWidth="1" />
      ))}
    </Base>
  );
}

export function IconLibGeometrie({ size = 48 }) {
  return (
    <Base id="ei-lge" c0="#6366f1" c1="#3730a3" shadow="#1e1b4b" size={size}>
      {/* Compass */}
      <line x1="24" y1="10" x2="16" y2="36" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <line x1="24" y1="10" x2="32" y2="36" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <circle cx="24" cy="10" r="3.5" fill="#fde68a" opacity="0.9" />
      {/* Arc drawn by compass */}
      <path d="M12 30 Q24 42 36 30" stroke="#fde68a" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Grid dots */}
      {[0,1,2,3].map(r => [0,1,2,3].map(c => (
        <circle key={`${r}${c}`} cx={6+c*12} cy={6+r*12} r="1" fill="white" opacity="0.2" />
      )))}
    </Base>
  );
}

export function IconLibLogique({ size = 48 }) {
  return (
    <Base id="ei-llo" c0="#c084fc" c1="#4c1d95" shadow="#2e1065" size={size}>
      {/* Puzzle piece */}
      <path d="M10 16 L10 32 L22 32 L22 28 Q22 24 26 24 Q30 24 30 28 L30 32 L38 32 L38 16 L34 16 Q30 16 30 12 Q30 8 34 8 L38 8 L38 16"
        fill="white" opacity="0.85" stroke="none" />
      <path d="M10 16 L10 12 Q10 8 14 8 Q18 8 18 12 Q18 16 14 16 L10 16"
        fill="#a78bfa" opacity="0.7" />
      {/* IF→THEN arrows */}
      <text x="7" y="42" fontSize="5.5" fontWeight="700" fill="#fde68a" fontFamily="system-ui">SI → ALORS</text>
    </Base>
  );
}

export function IconLibCalendrierTemps({ size = 48 }) {
  return (
    <Base id="ei-lct" c0="#38bdf8" c1="#0c4a6e" shadow="#082f49" size={size}>
      {/* Calendar */}
      <rect x="6" y="12" width="22" height="22" rx="3" fill="white" opacity="0.9" />
      <rect x="6" y="12" width="22" height="7" rx="3" fill="#0369a1" opacity="0.85" />
      {/* Calendar tabs */}
      <circle cx="11" cy="10" r="2" fill="white" opacity="0.7" />
      <circle cx="23" cy="10" r="2" fill="white" opacity="0.7" />
      {/* Day grid */}
      {[0,1,2].map(r => [0,1,2].map(c => (
        <rect key={`${r}${c}`} x={8+c*6} y={21+r*5} width="5" height="4" rx="1"
          fill="#0c4a6e" opacity={r===1&&c===1?0.9:0.25} />
      )))}
      <text x="10" y="25" fontSize="4" fontWeight="700" fill="#e0f2fe" fontFamily="system-ui">15</text>
      {/* Clock */}
      <circle cx="34" cy="30" r="12" fill="white" opacity="0.85" stroke="#0369a1" strokeWidth="2" />
      <line x1="34" y1="30" x2="34" y2="22" stroke="#0c4a6e" strokeWidth="2" strokeLinecap="round" />
      <line x1="34" y1="30" x2="40" y2="32" stroke="#0c4a6e" strokeWidth="2" strokeLinecap="round" />
      <circle cx="34" cy="30" r="1.5" fill="#0c4a6e" />
    </Base>
  );
}

export function IconLibDecouverteMonde({ size = 48 }) {
  return (
    <Base id="ei-ldm" c0="#22c55e" c1="#14532d" shadow="#052e16" size={size}>
      {/* Globe */}
      <circle cx="22" cy="24" r="15" fill="#2563eb" opacity="0.7" />
      <path d="M12 18 Q16 12 22 14 Q28 12 32 18 Q36 24 32 30 Q28 36 22 34 Q16 36 12 30 Q8 24 12 18Z"
        fill="#16a34a" opacity="0.8" />
      <path d="M8 24 Q10 22 12 24 Q12 28 10 28 Q8 26 8 24Z" fill="#16a34a" opacity="0.6" />
      {/* Lines */}
      <ellipse cx="22" cy="24" rx="15" ry="5" fill="none" stroke="white" strokeWidth="0.8" opacity="0.3" />
      <line x1="7" y1="24" x2="37" y2="24" stroke="white" strokeWidth="0.8" opacity="0.3" />
      {/* Magnifier */}
      <circle cx="38" cy="16" r="8" fill="none" stroke="white" strokeWidth="2.5" opacity="0.95" />
      <line x1="44" y1="22" x2="47" y2="25" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </Base>
  );
}

export function IconLibComprehensionLecture({ size = 48 }) {
  return (
    <Base id="ei-lcl" c0="#10b981" c1="#064e3b" shadow="#022c22" size={size}>
      {/* Open book */}
      <path d="M6 14 Q6 10 10 10 L22 12 L22 38 Q18 36 10 36 Q6 36 6 32Z" fill="white" opacity="0.88" />
      <path d="M22 12 L34 10 Q38 10 38 14 L38 32 Q38 36 34 36 L22 38Z" fill="#d1fae5" opacity="0.88" />
      <rect x="21.5" y="12" width="1.5" height="26" rx="0.75" fill="#d97706" opacity="0.7" />
      <rect x="9" y="16" width="11" height="1.5" rx="0.75" fill="#6b7280" opacity="0.5" />
      <rect x="9" y="20" width="9" height="1.5" rx="0.75" fill="#6b7280" opacity="0.5" />
      <rect x="9" y="24" width="11" height="1.5" rx="0.75" fill="#6b7280" opacity="0.5" />
      <rect x="9" y="28" width="7" height="1.5" rx="0.75" fill="#6b7280" opacity="0.5" />
      {/* Eye */}
      <path d="M24 28 Q31 22 38 28 Q31 34 24 28Z" fill="white" opacity="0.85" />
      <circle cx="31" cy="28" r="3.5" fill="#22c55e" />
      <circle cx="31" cy="28" r="2" fill="#1c1917" />
    </Base>
  );
}

export function IconLibVocabulaire({ size = 48 }) {
  return (
    <Base id="ei-lvoc" c0="#f472b6" c1="#831843" shadow="#500724" size={size}>
      {/* Big speech bubble */}
      <path d="M6 10 Q6 6 10 6 L38 6 Q42 6 42 10 L42 28 Q42 32 38 32 L30 32 L24 40 L18 32 L10 32 Q6 32 6 28Z"
        fill="white" opacity="0.9" />
      {/* ABC letters */}
      <text x="12" y="24" fontSize="14" fontWeight="900" fill="#831843" fontFamily="system-ui">ABC</text>
      {/* Stars / sparkles */}
      <text x="8" y="45" fontSize="8" fontFamily="system-ui">✨</text>
      <text x="32" y="45" fontSize="8" fontFamily="system-ui">✨</text>
    </Base>
  );
}

export function IconLibOrthographe({ size = 48 }) {
  return (
    <Base id="ei-lor" c0="#818cf8" c1="#3730a3" shadow="#1e1b4b" size={size}>
      {/* Word with correction */}
      <rect x="6" y="12" width="36" height="12" rx="3" fill="white" opacity="0.88" />
      <text x="9" y="22" fontSize="8" fontWeight="700" fill="#3730a3" fontFamily="system-ui">bonjour</text>
      {/* Red underline on "bonjour" */}
      <path d="M9 23 Q13 25 17 23 Q21 25 25 23 Q29 25 33 23" stroke="#ef4444" strokeWidth="1.5" fill="none" />
      {/* Correction with check */}
      <rect x="6" y="28" width="36" height="10" rx="3" fill="#22c55e" opacity="0.3" />
      <text x="9" y="36" fontSize="8" fontWeight="700" fill="white" fontFamily="system-ui">bonjour ✓</text>
      {/* Pencil */}
      <g transform="rotate(-35 42 10)">
        <rect x="40" y="4" width="3" height="10" rx="1" fill="#fbbf24" />
        <polygon points="40,4 43,4 41.5,0" fill="#f87171" />
      </g>
    </Base>
  );
}

export function IconLibDictee({ size = 48 }) {
  return (
    <Base id="ei-ldi" c0="#60a5fa" c1="#1d4ed8" shadow="#1e3a8a" size={size}>
      {/* Headphones */}
      <path d="M10 26 Q10 14 24 12 Q38 14 38 26" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <rect x="6" y="22" width="8" height="12" rx="4" fill="white" opacity="0.9" />
      <rect x="34" y="22" width="8" height="12" rx="4" fill="white" opacity="0.9" />
      {/* Sound waves */}
      <path d="M22 36 Q24 32 26 36" stroke="#fde68a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M18 38 Q24 28 30 38" stroke="#fde68a" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* Pencil writing */}
      <text x="10" y="46" fontSize="6" fontWeight="700" fill="white" opacity="0.8" fontFamily="system-ui">___________</text>
    </Base>
  );
}

export function IconLibGrammaire({ size = 48 }) {
  return (
    <Base id="ei-lgr" c0="#4ade80" c1="#14532d" shadow="#052e16" size={size}>
      {/* Sentence tree */}
      <rect x="18" y="6" width="12" height="7" rx="2" fill="white" opacity="0.85" />
      <text x="20" y="12" fontSize="6" fontWeight="700" fill="#065f46" fontFamily="system-ui">GN</text>
      {/* Branch lines */}
      <line x1="24" y1="13" x2="14" y2="22" stroke="white" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
      <line x1="24" y1="13" x2="34" y2="22" stroke="white" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
      {/* Child nodes */}
      <rect x="6" y="22" width="16" height="7" rx="2" fill="white" opacity="0.8" />
      <text x="8" y="28" fontSize="5.5" fontWeight="700" fill="#065f46" fontFamily="system-ui">Sujet</text>
      <rect x="26" y="22" width="16" height="7" rx="2" fill="white" opacity="0.8" />
      <text x="27" y="28" fontSize="5.5" fontWeight="700" fill="#065f46" fontFamily="system-ui">Verbe</text>
      {/* Example sentence */}
      <text x="7" y="40" fontSize="6" fontWeight="700" fill="white" opacity="0.85" fontFamily="system-ui">Le chat dort.</text>
    </Base>
  );
}

export function IconLibConjugaison({ size = 48 }) {
  return (
    <Base id="ei-lcj" c0="#22c55e" c1="#14532d" shadow="#052e16" size={size}>
      {/* Timeline with tenses */}
      <line x1="6" y1="24" x2="42" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      {/* Past */}
      <circle cx="10" cy="24" r="4" fill="#fca5a5" opacity="0.9" />
      <text x="6" y="36" fontSize="5" fontWeight="700" fill="white" opacity="0.8" fontFamily="system-ui">passé</text>
      {/* Present */}
      <circle cx="24" cy="24" r="5.5" fill="#fde68a" opacity="0.95" />
      <text x="20" y="36" fontSize="5" fontWeight="700" fill="white" opacity="0.8" fontFamily="system-ui">présent</text>
      {/* Future */}
      <circle cx="38" cy="24" r="4" fill="#86efac" opacity="0.9" />
      <text x="34" y="36" fontSize="5" fontWeight="700" fill="white" opacity="0.8" fontFamily="system-ui">futur</text>
      {/* Verb card */}
      <rect x="10" y="6" width="28" height="12" rx="3" fill="white" opacity="0.88" />
      <text x="14" y="15" fontSize="9" fontWeight="900" fill="#065f46" fontFamily="system-ui">AVOIR</text>
    </Base>
  );
}

export function IconLibTablesMult({ size = 48 }) {
  return (
    <Base id="ei-ltm" c0="#fb923c" c1="#9a3412" shadow="#431407" size={size}>
      {/* Multiplication grid hint */}
      <rect x="6" y="6" width="36" height="36" rx="3" fill="white" opacity="0.12" />
      {/* Header row */}
      {[1,2,3,4,5].map((n,i) => (
        <text key={n} x={8+i*7} y="14" fontSize="5.5" fontWeight="700" fill="#fde68a" fontFamily="system-ui">{n}</text>
      ))}
      {/* Header col */}
      {[1,2,3,4,5].map((n,i) => (
        <text key={n} x="8" y={22+i*6} fontSize="5.5" fontWeight="700" fill="#fde68a" fontFamily="system-ui">{n}</text>
      ))}
      {/* Highlighted cell 3×4=12 */}
      <rect x="26" y="26" width="9" height="7" rx="1.5" fill="#fbbf24" opacity="0.9" />
      <text x="28" y="32" fontSize="5.5" fontWeight="900" fill="#92400e" fontFamily="system-ui">12</text>
      {/* × symbol */}
      <text x="34" y="8" fontSize="10" fontWeight="900" fill="white" opacity="0.9" fontFamily="system-ui">×</text>
    </Base>
  );
}

export function IconLibFractions({ size = 48 }) {
  return (
    <Base id="ei-lfr" c0="#f59e0b" c1="#b45309" shadow="#78350f" size={size}>
      {/* Pizza divided into 8 slices */}
      <circle cx="24" cy="26" r="16" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
      {/* Slice dividers */}
      {[0,45,90,135,180,225,270,315].map(deg => {
        const r = deg * Math.PI / 180;
        return <line key={deg} x1="24" y1="26" x2={24+16*Math.cos(r)} y2={26+16*Math.sin(r)}
          stroke="#d97706" strokeWidth="1" opacity="0.7" />;
      })}
      {/* 3 filled slices */}
      <path d="M24 26 L40 26 A16 16 0 0 0 35.3 12.7Z" fill="#ef4444" opacity="0.8" />
      <path d="M24 26 L35.3 12.7 A16 16 0 0 0 24 10Z" fill="#ef4444" opacity="0.8" />
      <path d="M24 26 L24 10 A16 16 0 0 0 12.7 12.7Z" fill="#ef4444" opacity="0.65" />
      {/* Fraction */}
      <text x="8" y="47" fontSize="8" fontWeight="900" fill="white" fontFamily="system-ui">3/8</text>
    </Base>
  );
}

export function IconLibSciences({ size = 48 }) {
  return (
    <Base id="ei-lsc" c0="#34d399" c1="#065f46" shadow="#022c22" size={size}>
      {/* Microscope */}
      <rect x="18" y="6" width="4" height="18" rx="2" fill="white" opacity="0.85" />
      <rect x="14" y="4" width="12" height="5" rx="2" fill="white" opacity="0.85" />
      <rect x="20" y="20" width="8" height="4" rx="2" fill="white" opacity="0.75" />
      <rect x="20" y="24" width="8" height="8" rx="3" fill="white" opacity="0.9" />
      {/* Base */}
      <rect x="12" y="34" width="24" height="4" rx="2" fill="white" opacity="0.85" />
      <rect x="14" y="38" width="6" height="4" rx="1" fill="white" opacity="0.7" />
      <rect x="28" y="38" width="6" height="4" rx="1" fill="white" opacity="0.7" />
      {/* Lens highlight */}
      <circle cx="24" cy="26.5" r="3.5" fill="#22c55e" opacity="0.7" />
      <circle cx="23" cy="25" r="1.5" fill="white" opacity="0.5" />
      {/* Atom symbol */}
      <circle cx="38" cy="14" r="5" fill="none" stroke="#fde68a" strokeWidth="1.5" opacity="0.8" />
      <ellipse cx="38" cy="14" rx="5" ry="2.5" fill="none" stroke="#fde68a" strokeWidth="1" opacity="0.6" transform="rotate(60 38 14)" />
      <circle cx="38" cy="14" r="2" fill="#fde68a" opacity="0.9" />
    </Base>
  );
}

export function IconLibGeographieBelgique({ size = 48 }) {
  return (
    <Base id="ei-lgb" c0="#1d4ed8" c1="#1e3a8a" shadow="#172554" size={size}>
      {/* Belgian flag colors stripe */}
      <rect x="6" y="6" width="12" height="36" rx="3" fill="#1c1917" opacity="0.9" />
      <rect x="18" y="6" width="12" height="36" fill="#f59e0b" opacity="0.9" />
      <rect x="30" y="6" width="12" height="36" rx="3" fill="#ef4444" opacity="0.9" />
      {/* Belgium outline simplified */}
      <path d="M8 16 L40 14 L42 28 L30 38 L16 40 L6 32 L8 16Z"
        fill="white" opacity="0.25" stroke="white" strokeWidth="1.5" />
      {/* Star */}
      <text x="20" y="28" fontSize="12" fontFamily="system-ui">⭐</text>
    </Base>
  );
}

export function IconLibGrandDefi({ size = 48 }) {
  return (
    <Base id="ei-lgd" c0="#fbbf24" c1="#78350f" shadow="#451a03" size={size}>
      {/* Trophy */}
      <path d="M14 10 L14 26 Q14 34 24 36 Q34 34 34 26 L34 10Z" fill="#fde68a" opacity="0.95" />
      {/* Cup handles */}
      <path d="M14 14 Q6 14 6 22 Q6 28 14 26" fill="none" stroke="#fde68a" strokeWidth="3" strokeLinecap="round" />
      <path d="M34 14 Q42 14 42 22 Q42 28 34 26" fill="none" stroke="#fde68a" strokeWidth="3" strokeLinecap="round" />
      {/* Cup base */}
      <rect x="20" y="36" width="8" height="5" rx="1" fill="#d97706" opacity="0.9" />
      <rect x="15" y="41" width="18" height="4" rx="2" fill="#d97706" opacity="0.9" />
      {/* Stars on cup */}
      <text x="19.5" y="26" fontSize="10" fontFamily="system-ui">⭐</text>
      {/* Shine */}
      <ellipse cx="18" cy="15" rx="4" ry="3" fill="white" opacity="0.25" />
    </Base>
  );
}
