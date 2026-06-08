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
    <Base id="ei-lcm" c0="#fbbf24" c1="#92400e" shadow="#451a03" size={size}>
      {/* Large lightning bolt centered */}
      <path d="M28 6 L14 26 L22 26 L18 42 L34 22 L26 22Z" fill="#fef9c3" opacity="0.97" />
      {/* Number bubbles at corners */}
      <circle cx="9" cy="11" r="6" fill="white" opacity="0.92" />
      <text x="6" y="15" fontSize="8" fontWeight="900" fill="#b45309" fontFamily="system-ui,sans-serif">7</text>
      <circle cx="39" cy="11" r="6" fill="white" opacity="0.92" />
      <text x="36.5" y="15" fontSize="8" fontWeight="900" fill="#b45309" fontFamily="system-ui,sans-serif">+</text>
      <circle cx="39" cy="39" r="6" fill="white" opacity="0.92" />
      <text x="36.5" y="43" fontSize="8" fontWeight="900" fill="#b45309" fontFamily="system-ui,sans-serif">9</text>
    </Base>
  );
}

export function IconLibProblemesMaths({ size = 48 }) {
  return (
    <Base id="ei-lpm" c0="#10b981" c1="#064e3b" shadow="#022c22" size={size}>
      {/* Notebook page */}
      <rect x="8" y="7" width="32" height="30" rx="4" fill="white" opacity="0.92" />
      {/* Text lines */}
      <rect x="12" y="12" width="24" height="2.5" rx="1.25" fill="#6b7280" opacity="0.35" />
      <rect x="12" y="17" width="18" height="2.5" rx="1.25" fill="#6b7280" opacity="0.35" />
      <rect x="12" y="22" width="24" height="2.5" rx="1.25" fill="#6b7280" opacity="0.35" />
      {/* Highlighted answer box */}
      <rect x="12" y="27" width="16" height="7" rx="2.5" fill="#fbbf24" opacity="0.9" />
      <text x="14" y="33" fontSize="6.5" fontWeight="800" fill="#78350f" fontFamily="system-ui,sans-serif">15 €  ?</text>
      {/* Pencil */}
      <rect x="33" y="28" width="3" height="11" rx="1.5" fill="#fbbf24" transform="rotate(-30 35 33)" />
      <polygon points="33,28 36,28 34.5,24" fill="#f87171" transform="rotate(-30 35 33)" />
      {/* Question mark badge */}
      <circle cx="38" cy="8" r="6" fill="#fbbf24" opacity="0.95" />
      <text x="35.5" y="12" fontSize="8" fontWeight="900" fill="#78350f" fontFamily="system-ui,sans-serif">?</text>
    </Base>
  );
}

export function IconLibMesures({ size = 48 }) {
  return (
    <Base id="ei-lme" c0="#f97316" c1="#7c2d12" shadow="#431407" size={size}>
      {/* Ruler */}
      <rect x="6" y="9" width="36" height="12" rx="3" fill="white" opacity="0.92" />
      <rect x="6" y="9" width="36" height="4" rx="2" fill="#fde68a" opacity="0.6" />
      {[9,13,17,21,25,29,33,37].map((x, i) => (
        <line key={x} x1={x} y1="9" x2={x} y2={i % 2 === 0 ? "14" : "12"} stroke="#9a3412" strokeWidth="1.2" />
      ))}
      {/* cm labels */}
      <text x="7" y="19" fontSize="4.5" fontWeight="700" fill="#7c2d12" fontFamily="system-ui,sans-serif">1</text>
      <text x="11" y="19" fontSize="4.5" fontWeight="700" fill="#7c2d12" fontFamily="system-ui,sans-serif">2</text>
      <text x="15" y="19" fontSize="4.5" fontWeight="700" fill="#7c2d12" fontFamily="system-ui,sans-serif">3</text>
      {/* Scale */}
      <rect x="17" y="24" width="3" height="14" rx="1.5" fill="white" opacity="0.85" />
      <rect x="6" y="24" width="25" height="3" rx="1.5" fill="white" opacity="0.85" />
      <path d="M6 27 L6 36 Q6 38 9 38 L13 38" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M31 27 L31 36 Q31 38 28 38 L24 38" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* kg / m badges */}
      <rect x="6" y="36" width="10" height="6" rx="2" fill="#fde68a" opacity="0.9" />
      <text x="8" y="41" fontSize="5.5" fontWeight="800" fill="#7c2d12" fontFamily="system-ui,sans-serif">kg</text>
      <rect x="31" y="36" width="9" height="6" rx="2" fill="#fde68a" opacity="0.9" />
      <text x="33" y="41" fontSize="5.5" fontWeight="800" fill="#7c2d12" fontFamily="system-ui,sans-serif">m</text>
    </Base>
  );
}

export function IconLibGeometrie({ size = 48 }) {
  return (
    <Base id="ei-lge" c0="#818cf8" c1="#1e1b4b" shadow="#0e0b2e" size={size}>
      {/* Equilateral triangle */}
      <polygon points="24,7 42,38 6,38" fill="none" stroke="white" strokeWidth="2.5" opacity="0.85" />
      {/* Circle inscribed */}
      <circle cx="24" cy="28" r="9" fill="none" stroke="#fde68a" strokeWidth="2" opacity="0.8" />
      {/* Compass pivot */}
      <circle cx="24" cy="7" r="3" fill="#fde68a" opacity="0.95" />
      {/* Right angle mark */}
      <polyline points="10,34 10,38 6,38" fill="none" stroke="#fde68a" strokeWidth="1.8" opacity="0.8" />
      {/* Grid dots */}
      {[0,1,2].map(r => [0,1,2].map(c => (
        <circle key={`${r}${c}`} cx={14+c*10} cy={16+r*8} r="1" fill="white" opacity="0.15" />
      )))}
    </Base>
  );
}

export function IconLibLogique({ size = 48 }) {
  return (
    <Base id="ei-llo" c0="#a855f7" c1="#3b0764" shadow="#1e0447" size={size}>
      {/* Two condition blocks */}
      <rect x="5" y="10" width="16" height="11" rx="3" fill="white" opacity="0.9" />
      <text x="7" y="19" fontSize="7.5" fontWeight="900" fill="#7c3aed" fontFamily="system-ui,sans-serif">SI</text>
      {/* Arrow */}
      <path d="M21 15.5 L27 15.5" stroke="#fde68a" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="25,13 29,15.5 25,18" fill="#fde68a" />
      {/* Then block */}
      <rect x="27" y="10" width="16" height="11" rx="3" fill="#fde68a" opacity="0.95" />
      <text x="28" y="19" fontSize="5.5" fontWeight="900" fill="#78350f" fontFamily="system-ui,sans-serif">ALORS</text>
      {/* Conclusion block */}
      <rect x="12" y="28" width="24" height="11" rx="3" fill="white" opacity="0.85" />
      <text x="15" y="37" fontSize="7" fontWeight="900" fill="#6d28d9" fontFamily="system-ui,sans-serif">∴ VRAI</text>
      {/* Connection line */}
      <line x1="35" y1="21" x2="30" y2="28" stroke="white" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      <line x1="13" y1="21" x2="18" y2="28" stroke="white" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
    </Base>
  );
}

export function IconLibCalendrierTemps({ size = 48 }) {
  return (
    <Base id="ei-lct" c0="#38bdf8" c1="#075985" shadow="#082f49" size={size}>
      {/* Calendar left */}
      <rect x="5" y="11" width="20" height="20" rx="3" fill="white" opacity="0.92" />
      <rect x="5" y="11" width="20" height="6.5" rx="3" fill="#0284c7" opacity="0.9" />
      <circle cx="10" cy="9.5" r="2" fill="white" opacity="0.75" />
      <circle cx="20" cy="9.5" r="2" fill="white" opacity="0.75" />
      {/* Day number highlighted */}
      <text x="12" y="26" fontSize="11" fontWeight="900" fill="#0369a1" fontFamily="system-ui,sans-serif">15</text>
      {/* Day labels */}
      {['L','M','M','J'].map((d, i) => (
        <text key={i} x={7+i*5} y="20" fontSize="3.5" fontWeight="700" fill="#7dd3fc" fontFamily="system-ui,sans-serif">{d}</text>
      ))}
      {/* Clock right */}
      <circle cx="35" cy="32" r="12" fill="white" opacity="0.88" />
      <circle cx="35" cy="32" r="10" fill="none" stroke="#0284c7" strokeWidth="1.5" opacity="0.4" />
      <line x1="35" y1="32" x2="35" y2="24" stroke="#0369a1" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="35" y1="32" x2="42" y2="34" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" />
      <circle cx="35" cy="32" r="2" fill="#0369a1" />
    </Base>
  );
}

export function IconLibDecouverteMonde({ size = 48 }) {
  return (
    <Base id="ei-ldm" c0="#22c55e" c1="#14532d" shadow="#052e16" size={size}>
      {/* Globe sphere */}
      <circle cx="24" cy="24" r="17" fill="#2563eb" opacity="0.75" />
      {/* Continents simplified */}
      <path d="M14 15 Q19 11 25 13 Q31 11 35 17 Q38 23 35 29 Q31 35 25 33 Q19 35 14 29 Q10 23 14 15Z" fill="#16a34a" opacity="0.82" />
      <path d="M8 23 Q10 21 13 23 Q13 28 10 27Z" fill="#16a34a" opacity="0.65" />
      {/* Globe lines */}
      <ellipse cx="24" cy="24" rx="17" ry="6" fill="none" stroke="white" strokeWidth="1" opacity="0.25" />
      <line x1="7" y1="24" x2="41" y2="24" stroke="white" strokeWidth="0.8" opacity="0.25" />
      <line x1="24" y1="7" x2="24" y2="41" stroke="white" strokeWidth="0.8" opacity="0.25" />
      {/* Magnifying glass */}
      <circle cx="38" cy="12" r="7" fill="none" stroke="white" strokeWidth="3" opacity="0.95" />
      <line x1="43" y1="17" x2="46" y2="20" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </Base>
  );
}

export function IconLibComprehensionLecture({ size = 48 }) {
  return (
    <Base id="ei-lcl" c0="#059669" c1="#064e3b" shadow="#022c22" size={size}>
      {/* Open book */}
      <path d="M5 13 Q5 9 9 9 L22 11 L22 39 Q17 37 9 37 Q5 37 5 33Z" fill="white" opacity="0.9" />
      <path d="M22 11 L35 9 Q39 9 39 13 L39 33 Q39 37 35 37 L22 39Z" fill="#d1fae5" opacity="0.9" />
      <rect x="21" y="11" width="2" height="28" rx="1" fill="#d97706" opacity="0.6" />
      {/* Left page lines */}
      {[17,21,25,29].map(y => (
        <rect key={y} x="8" y={y} width="12" height="2" rx="1" fill="#6b7280" opacity="0.45" />
      ))}
      {/* Right page — eye reading */}
      <path d="M24 26 Q31 20 38 26 Q31 32 24 26Z" fill="white" opacity="0.9" />
      <circle cx="31" cy="26" r="4" fill="#059669" />
      <circle cx="31" cy="26" r="2.2" fill="#1c1917" />
      <circle cx="32" cy="24.5" r="0.8" fill="white" opacity="0.7" />
    </Base>
  );
}

export function IconLibVocabulaire({ size = 48 }) {
  return (
    <Base id="ei-lvoc" c0="#ec4899" c1="#831843" shadow="#500724" size={size}>
      {/* Speech bubble */}
      <path d="M5 9 Q5 5 9 5 L39 5 Q43 5 43 9 L43 28 Q43 32 39 32 L28 32 L24 39 L20 32 L9 32 Q5 32 5 28Z" fill="white" opacity="0.92" />
      {/* Large ABC */}
      <text x="9" y="26" fontSize="16" fontWeight="900" fill="#be185d" fontFamily="system-ui,sans-serif">ABC</text>
      {/* Sparkle dots */}
      <circle cx="6" cy="43" r="2.5" fill="#fde68a" opacity="0.9" />
      <circle cx="14" cy="46" r="1.5" fill="#fde68a" opacity="0.7" />
      <circle cx="34" cy="43" r="2.5" fill="#fde68a" opacity="0.9" />
      <circle cx="42" cy="46" r="1.5" fill="#fde68a" opacity="0.7" />
    </Base>
  );
}

export function IconLibOrthographe({ size = 48 }) {
  return (
    <Base id="ei-lor" c0="#6366f1" c1="#2e1065" shadow="#1e1b4b" size={size}>
      {/* Wrong word row */}
      <rect x="5" y="10" width="38" height="13" rx="3" fill="white" opacity="0.9" />
      <text x="8" y="20.5" fontSize="8.5" fontWeight="700" fill="#4338ca" fontFamily="system-ui,sans-serif">bonjour</text>
      {/* Wavy underline */}
      <path d="M8 22.5 Q11 24.5 14 22.5 Q17 24.5 20 22.5 Q23 24.5 26 22.5 Q29 24.5 32 22.5 Q35 24.5 38 22.5" stroke="#ef4444" strokeWidth="1.8" fill="none" />
      {/* Corrected word row */}
      <rect x="5" y="27" width="38" height="13" rx="3" fill="#d1fae5" opacity="0.95" />
      <text x="8" y="37" fontSize="8.5" fontWeight="700" fill="#065f46" fontFamily="system-ui,sans-serif">bonjour</text>
      <circle cx="37" cy="33.5" r="4.5" fill="#22c55e" opacity="0.9" />
      <path d="M34.5 33.5 L36.5 36 L40 31" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Base>
  );
}

export function IconLibDictee({ size = 48 }) {
  return (
    <Base id="ei-ldi" c0="#3b82f6" c1="#1e3a8a" shadow="#172554" size={size}>
      {/* Headphones arc */}
      <path d="M9 26 Q9 12 24 10 Q39 12 39 26" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      {/* Ear cups */}
      <rect x="5" y="22" width="9" height="13" rx="4.5" fill="white" opacity="0.92" />
      <rect x="34" y="22" width="9" height="13" rx="4.5" fill="white" opacity="0.92" />
      {/* Speaker waves */}
      <path d="M21 36 Q24 32 27 36" stroke="#fde68a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M17.5 39 Q24 29 30.5 39" stroke="#fde68a" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.65" />
      {/* Writing line */}
      <line x1="10" y1="45" x2="38" y2="45" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="14" y1="41" x2="34" y2="41" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
    </Base>
  );
}

export function IconLibGrammaire({ size = 48 }) {
  return (
    <Base id="ei-lgr" c0="#16a34a" c1="#052e16" shadow="#031a0d" size={size}>
      {/* Root node */}
      <rect x="16" y="5" width="16" height="8" rx="3" fill="white" opacity="0.92" />
      <text x="18" y="12" fontSize="7" fontWeight="900" fill="#15803d" fontFamily="system-ui,sans-serif">P</text>
      {/* Branch lines */}
      <line x1="20" y1="13" x2="13" y2="22" stroke="white" strokeWidth="1.8" opacity="0.7" strokeLinecap="round" />
      <line x1="28" y1="13" x2="35" y2="22" stroke="white" strokeWidth="1.8" opacity="0.7" strokeLinecap="round" />
      {/* Child nodes */}
      <rect x="5" y="22" width="17" height="8" rx="3" fill="white" opacity="0.88" />
      <text x="7" y="29" fontSize="5.5" fontWeight="800" fill="#15803d" fontFamily="system-ui,sans-serif">Sujet</text>
      <rect x="26" y="22" width="17" height="8" rx="3" fill="white" opacity="0.88" />
      <text x="28" y="29" fontSize="5.5" fontWeight="800" fill="#15803d" fontFamily="system-ui,sans-serif">Verbe</text>
      {/* Sentence below */}
      <rect x="5" y="35" width="38" height="9" rx="3" fill="white" opacity="0.2" />
      <text x="7" y="42.5" fontSize="6.5" fontWeight="700" fill="white" opacity="0.9" fontFamily="system-ui,sans-serif">Le chat dort.</text>
    </Base>
  );
}

export function IconLibConjugaison({ size = 48 }) {
  return (
    <Base id="ei-lcj" c0="#0d9488" c1="#042f2e" shadow="#011a19" size={size}>
      {/* Verb banner */}
      <rect x="9" y="5" width="30" height="12" rx="3.5" fill="white" opacity="0.92" />
      <text x="12" y="14" fontSize="10" fontWeight="900" fill="#0f766e" fontFamily="system-ui,sans-serif">AVOIR</text>
      {/* Timeline */}
      <line x1="6" y1="28" x2="42" y2="28" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <polygon points="41,25 45,28 41,31" fill="white" opacity="0.7" />
      {/* Tense circles */}
      <circle cx="11" cy="28" r="5.5" fill="#fca5a5" opacity="0.95" />
      <text x="8" y="39" fontSize="4.5" fontWeight="700" fill="white" fontFamily="system-ui,sans-serif">passé</text>
      <circle cx="24" cy="28" r="6.5" fill="#fde68a" opacity="0.95" />
      <text x="19" y="39" fontSize="4.5" fontWeight="700" fill="white" fontFamily="system-ui,sans-serif">présent</text>
      <circle cx="37" cy="28" r="5.5" fill="#86efac" opacity="0.95" />
      <text x="34" y="39" fontSize="4.5" fontWeight="700" fill="white" fontFamily="system-ui,sans-serif">futur</text>
      {/* Tick on présent */}
      <text x="21" y="31" fontSize="7" fontWeight="900" fill="#0f766e" fontFamily="system-ui,sans-serif">✓</text>
    </Base>
  );
}

export function IconLibTablesMult({ size = 48 }) {
  return (
    <Base id="ei-ltm" c0="#f97316" c1="#7c2d12" shadow="#431407" size={size}>
      {/* Grid background */}
      <rect x="5" y="5" width="38" height="38" rx="4" fill="white" opacity="0.1" />
      {/* Header row numbers */}
      {[1,2,3,4,5].map((n,i) => (
        <text key={`h${n}`} x={8+i*7} y="14" fontSize="5.5" fontWeight="800" fill="#fde68a" fontFamily="system-ui,sans-serif">{n}</text>
      ))}
      {/* Header col numbers */}
      {[1,2,3,4,5].map((n,i) => (
        <text key={`v${n}`} x="7" y={22+i*6} fontSize="5.5" fontWeight="800" fill="#fde68a" fontFamily="system-ui,sans-serif">{n}</text>
      ))}
      {/* Divider lines */}
      <line x1="5" y1="16" x2="43" y2="16" stroke="white" strokeWidth="1" opacity="0.2" />
      <line x1="16" y1="5" x2="16" y2="43" stroke="white" strokeWidth="1" opacity="0.2" />
      {/* Highlighted result 3×4=12 */}
      <rect x="27" y="27" width="12" height="9" rx="2.5" fill="#fbbf24" opacity="0.95" />
      <text x="29" y="34" fontSize="7" fontWeight="900" fill="#7c2d12" fontFamily="system-ui,sans-serif">= 12</text>
      {/* × large */}
      <text x="33" y="9" fontSize="12" fontWeight="900" fill="white" opacity="0.85" fontFamily="system-ui,sans-serif">×</text>
    </Base>
  );
}

export function IconLibFractions({ size = 48 }) {
  return (
    <Base id="ei-lfr" c0="#d97706" c1="#78350f" shadow="#451a03" size={size}>
      {/* Pie chart circle */}
      <circle cx="24" cy="26" r="17" fill="#fef3c7" opacity="0.92" stroke="#d97706" strokeWidth="1.5" />
      {/* Slice lines */}
      {[0,45,90,135,180,225,270,315].map(deg => {
        const r = deg * Math.PI / 180;
        return <line key={deg} x1="24" y1="26" x2={24+17*Math.cos(r)} y2={26+17*Math.sin(r)} stroke="#d97706" strokeWidth="1.2" opacity="0.6" />;
      })}
      {/* 3 highlighted slices */}
      <path d="M24 26 L41 26 A17 17 0 0 0 36.0 13.0Z" fill="#ef4444" opacity="0.82" />
      <path d="M24 26 L36.0 13.0 A17 17 0 0 0 24 9Z" fill="#ef4444" opacity="0.82" />
      <path d="M24 26 L24 9 A17 17 0 0 0 12.0 13.0Z" fill="#f97316" opacity="0.72" />
      {/* Fraction label */}
      <rect x="5" y="38" width="14" height="10" rx="3" fill="white" opacity="0.92" />
      <text x="7" y="46" fontSize="8.5" fontWeight="900" fill="#92400e" fontFamily="system-ui,sans-serif">3/8</text>
    </Base>
  );
}

export function IconLibSciences({ size = 48 }) {
  return (
    <Base id="ei-lsc" c0="#0d9488" c1="#022c22" shadow="#011a19" size={size}>
      {/* Flask */}
      <path d="M18 6 L18 22 L10 38 Q9 42 13 42 L35 42 Q39 42 38 38 L30 22 L30 6Z" fill="white" opacity="0.88" />
      <path d="M18 6 L30 6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      {/* Liquid in flask */}
      <path d="M13 34 L12 38 Q11 42 13 42 L35 42 Q37 42 36 38 L33 32 Q28 28 22 30 Q16 32 13 34Z" fill="#2dd4bf" opacity="0.85" />
      {/* Bubbles */}
      <circle cx="18" cy="36" r="2.5" fill="white" opacity="0.7" />
      <circle cx="26" cy="34" r="1.8" fill="white" opacity="0.55" />
      <circle cx="31" cy="38" r="1.5" fill="white" opacity="0.65" />
      {/* Atom */}
      <circle cx="38" cy="12" r="4.5" fill="none" stroke="#fde68a" strokeWidth="1.8" opacity="0.85" />
      <ellipse cx="38" cy="12" rx="4.5" ry="2" fill="none" stroke="#fde68a" strokeWidth="1.2" opacity="0.65" transform="rotate(60 38 12)" />
      <circle cx="38" cy="12" r="2" fill="#fde68a" opacity="0.95" />
    </Base>
  );
}

export function IconLibGeographieBelgique({ size = 48 }) {
  return (
    <Base id="ei-lgb" c0="#2563eb" c1="#172554" shadow="#0d1a42" size={size}>
      {/* Belgian flag stripes */}
      <rect x="7" y="8" width="11" height="32" rx="3" fill="#1c1917" opacity="0.93" />
      <rect x="18" y="8" width="12" height="32" fill="#f59e0b" opacity="0.95" />
      <rect x="30" y="8" width="11" height="32" rx="3" fill="#ef4444" opacity="0.93" />
      {/* Belgium silhouette overlay */}
      <path d="M9 17 L39 15 L41 26 L34 36 L20 38 L8 31Z" fill="white" opacity="0.22" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      {/* EU star ring */}
      {[0,60,120,180,240,300].map((deg, i) => {
        const a = (deg - 90) * Math.PI / 180;
        return <text key={i} x={24 + 12*Math.cos(a) - 3} y={24 + 12*Math.sin(a) + 3} fontSize="5" fill="#fde68a" opacity="0.9" fontFamily="system-ui,sans-serif">★</text>;
      })}
    </Base>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GÉOGRAPHIE BELGIQUE — 20 unique exam icons
// ═══════════════════════════════════════════════════════════════════════════════

// 1 — Drapeau belge / symboles nationaux
export function IconGeoB01({ size = 48 }) {
  return (
    <Base id="ei-gb01" c0="#3b82f6" c1="#1e3a8a" shadow="#172554" size={size}>
      <rect x="8" y="10" width="10" height="28" rx="2" fill="#1c1917" opacity="0.95" />
      <rect x="18" y="10" width="12" height="28" fill="#f59e0b" opacity="0.95" />
      <rect x="30" y="10" width="10" height="28" rx="2" fill="#ef4444" opacity="0.95" />
      <ellipse cx="24" cy="13" rx="10" ry="5" fill="white" opacity="0.15" />
    </Base>
  );
}

// 2 — Bruxelles / capitale
export function IconGeoB02({ size = 48 }) {
  return (
    <Base id="ei-gb02" c0="#7c3aed" c1="#4c1d95" shadow="#2e1065" size={size}>
      {/* Grand-Place building */}
      <rect x="14" y="22" width="20" height="18" rx="2" fill="white" opacity="0.9" />
      <polygon points="24,8 12,22 36,22" fill="#fde68a" opacity="0.95" />
      <rect x="21" y="30" width="6" height="10" rx="1" fill="#7c3aed" opacity="0.7" />
      <rect x="16" y="26" width="4" height="4" rx="1" fill="#7c3aed" opacity="0.6" />
      <rect x="28" y="26" width="4" height="4" rx="1" fill="#7c3aed" opacity="0.6" />
      <rect x="22" y="6" width="4" height="4" rx="1" fill="#fde68a" opacity="0.9" />
    </Base>
  );
}

// 3 — Rivières (Meuse & Escaut)
export function IconGeoB03({ size = 48 }) {
  return (
    <Base id="ei-gb03" c0="#0ea5e9" c1="#0c4a6e" shadow="#082f49" size={size}>
      <path d="M8 14 Q16 18 20 24 Q24 30 32 34 Q38 38 40 42" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.85" />
      <path d="M40 10 Q34 16 30 22 Q26 28 20 32 Q14 36 8 38" stroke="#7dd3fc" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.75" />
      <circle cx="20" cy="24" r="4" fill="white" opacity="0.3" />
      <circle cx="30" cy="22" r="3" fill="white" opacity="0.3" />
    </Base>
  );
}

// 4 — Trois régions (Wallonie, Flandre, BXL)
export function IconGeoB04({ size = 48 }) {
  return (
    <Base id="ei-gb04" c0="#059669" c1="#064e3b" shadow="#022c22" size={size}>
      <path d="M8 10 L24 10 L24 26 L8 26Z" fill="#fde68a" opacity="0.9" rx="2" />
      <path d="M24 10 L40 10 L40 26 L24 26Z" fill="#ef4444" opacity="0.85" />
      <path d="M10 26 L38 26 L32 40 L16 40Z" fill="#f59e0b" opacity="0.9" />
      <text x="10" y="22" fontSize="8" fontWeight="900" fill="#064e3b" fontFamily="system-ui">FL</text>
      <text x="26" y="22" fontSize="8" fontWeight="900" fill="white" fontFamily="system-ui">WA</text>
      <text x="18" y="36" fontSize="8" fontWeight="900" fill="white" fontFamily="system-ui">BXL</text>
    </Base>
  );
}

// 5 — Ardennes / reliefs
export function IconGeoB05({ size = 48 }) {
  return (
    <Base id="ei-gb05" c0="#16a34a" c1="#14532d" shadow="#052e16" size={size}>
      <polygon points="24,8 10,36 38,36" fill="#86efac" opacity="0.85" />
      <polygon points="34,14 22,36 46,36" fill="#4ade80" opacity="0.7" />
      <polygon points="14,18 4,36 28,36" fill="#22c55e" opacity="0.6" />
      <rect x="8" y="36" width="32" height="6" rx="2" fill="#166534" opacity="0.8" />
      <circle cx="24" cy="10" r="3" fill="white" opacity="0.7" />
    </Base>
  );
}

// 6 — Mer du Nord / côte
export function IconGeoB06({ size = 48 }) {
  return (
    <Base id="ei-gb06" c0="#0284c7" c1="#0c4a6e" shadow="#082f49" size={size}>
      <rect x="6" y="28" width="36" height="14" rx="3" fill="#0ea5e9" opacity="0.7" />
      <path d="M6 28 Q12 24 18 28 Q24 32 30 28 Q36 24 42 28" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M6 34 Q12 30 18 34 Q24 38 30 34 Q36 30 42 34" stroke="white" strokeWidth="2" fill="none" opacity="0.6" strokeLinecap="round" />
      <rect x="14" y="10" width="4" height="20" rx="1" fill="#fde68a" opacity="0.9" />
      <polygon points="18,10 18,20 28,15" fill="#fde68a" opacity="0.9" />
    </Base>
  );
}

// 7 — Carte d'Europe
export function IconGeoB07({ size = 48 }) {
  return (
    <Base id="ei-gb07" c0="#2563eb" c1="#1e3a8a" shadow="#172554" size={size}>
      <ellipse cx="24" cy="26" rx="18" ry="14" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5" />
      <path d="M14 14 Q18 10 22 12 L26 10 Q32 12 36 18 Q38 24 34 30 Q28 38 22 36 Q14 34 12 26 Q10 20 14 14Z" fill="white" opacity="0.8" />
      <circle cx="22" cy="22" r="3" fill="#3b82f6" opacity="0.9" />
      <path d="M6 26 Q24 20 42 26" stroke="white" strokeWidth="1" fill="none" strokeDasharray="2,2" opacity="0.4" />
    </Base>
  );
}

// 8 — Union Européenne / étoiles EU
export function IconGeoB08({ size = 48 }) {
  return (
    <Base id="ei-gb08" c0="#1d4ed8" c1="#1e3a8a" shadow="#172554" size={size}>
      {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => {
        const a = (i * 30 - 90) * Math.PI / 180;
        const x = 24 + 15 * Math.cos(a);
        const y = 24 + 15 * Math.sin(a);
        return <text key={i} x={x-4} y={y+4} fontSize="7" fontFamily="system-ui" fill="#fde68a" opacity="0.95">★</text>;
      })}
    </Base>
  );
}

// 9 — Provinces de Belgique
export function IconGeoB09({ size = 48 }) {
  return (
    <Base id="ei-gb09" c0="#9333ea" c1="#581c87" shadow="#3b0764" size={size}>
      <rect x="8" y="10" width="14" height="12" rx="2" fill="white" opacity="0.85" />
      <rect x="24" y="10" width="16" height="12" rx="2" fill="#f0abfc" opacity="0.85" />
      <rect x="8" y="24" width="10" height="14" rx="2" fill="#e879f9" opacity="0.85" />
      <rect x="20" y="24" width="10" height="14" rx="2" fill="white" opacity="0.7" />
      <rect x="32" y="24" width="8" height="14" rx="2" fill="#f0abfc" opacity="0.85" />
      <line x1="8" y1="22" x2="40" y2="22" stroke="white" strokeWidth="1" opacity="0.5" />
      <line x1="22" y1="10" x2="22" y2="38" stroke="white" strokeWidth="1" opacity="0.5" />
    </Base>
  );
}

// 10 — Langues / communautés
export function IconGeoB10({ size = 48 }) {
  return (
    <Base id="ei-gb10" c0="#dc2626" c1="#7f1d1d" shadow="#450a0a" size={size}>
      <rect x="6" y="12" width="18" height="14" rx="3" fill="white" opacity="0.9" />
      <text x="9" y="23" fontSize="9" fontWeight="900" fill="#dc2626" fontFamily="system-ui">FR</text>
      <rect x="26" y="12" width="16" height="14" rx="3" fill="#fde68a" opacity="0.9" />
      <text x="29" y="23" fontSize="9" fontWeight="900" fill="#92400e" fontFamily="system-ui">NL</text>
      <rect x="14" y="28" width="14" height="12" rx="3" fill="#86efac" opacity="0.9" />
      <text x="17" y="38" fontSize="8" fontWeight="900" fill="#14532d" fontFamily="system-ui">DE</text>
    </Base>
  );
}

// 11 — Villes (Bruges, Gand, Liège, Anvers)
export function IconGeoB11({ size = 48 }) {
  return (
    <Base id="ei-gb11" c0="#0f766e" c1="#134e4a" shadow="#042f2e" size={size}>
      {[
        { x: 8,  y: 22, h: 16, w: 8 },
        { x: 18, y: 16, h: 22, w: 8 },
        { x: 28, y: 20, h: 18, w: 8 },
        { x: 38, y: 14, h: 24, w: 6 },
      ].map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="1" fill="white" opacity={0.7 + i * 0.07} />
      ))}
      <polygon points="8,22 12,14 16,22" fill="#fde68a" opacity="0.9" />
      <polygon points="18,16 22,8 26,16" fill="#fde68a" opacity="0.9" />
      <polygon points="28,20 32,12 36,20" fill="#fde68a" opacity="0.9" />
      <polygon points="38,14 41,7 44,14" fill="#fde68a" opacity="0.9" />
      <rect x="6" y="38" width="36" height="3" rx="1" fill="white" opacity="0.5" />
    </Base>
  );
}

// 12 — Climat / météo
export function IconGeoB12({ size = 48 }) {
  return (
    <Base id="ei-gb12" c0="#64748b" c1="#1e293b" shadow="#0f172a" size={size}>
      <circle cx="28" cy="18" r="9" fill="#fde68a" opacity="0.9" />
      <ellipse cx="16" cy="26" rx="12" ry="8" fill="white" opacity="0.85" />
      <ellipse cx="26" cy="28" rx="14" ry="9" fill="white" opacity="0.9" />
      {[14, 20, 26, 32, 38].map((x, i) => (
        <line key={i} x1={x} y1="38" x2={x - 2} y2="44" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      ))}
    </Base>
  );
}

// 13 — Monuments (Atomium)
export function IconGeoB13({ size = 48 }) {
  return (
    <Base id="ei-gb13" c0="#475569" c1="#0f172a" shadow="#020617" size={size}>
      <circle cx="24" cy="12" r="6" fill="#94a3b8" opacity="0.95" stroke="#cbd5e1" strokeWidth="1.5" />
      <circle cx="10" cy="24" r="5" fill="#94a3b8" opacity="0.9" stroke="#cbd5e1" strokeWidth="1.5" />
      <circle cx="38" cy="24" r="5" fill="#94a3b8" opacity="0.9" stroke="#cbd5e1" strokeWidth="1.5" />
      <circle cx="16" cy="36" r="5" fill="#94a3b8" opacity="0.9" stroke="#cbd5e1" strokeWidth="1.5" />
      <circle cx="32" cy="36" r="5" fill="#94a3b8" opacity="0.9" stroke="#cbd5e1" strokeWidth="1.5" />
      <line x1="24" y1="18" x2="10" y2="24" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="24" y1="18" x2="38" y2="24" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="10" y1="29" x2="16" y2="36" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="38" y1="29" x2="32" y2="36" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="14" y1="26" x2="22" y2="36" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.6" />
      <line x1="34" y1="26" x2="26" y2="36" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.6" />
    </Base>
  );
}

// 14 — Transport / réseaux
export function IconGeoB14({ size = 48 }) {
  return (
    <Base id="ei-gb14" c0="#b45309" c1="#78350f" shadow="#451a03" size={size}>
      <rect x="8" y="20" width="32" height="10" rx="5" fill="white" opacity="0.9" />
      <path d="M8 24 Q20 12 32 16 Q38 18 40 24" stroke="#fde68a" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.9" />
      <circle cx="12" cy="25" r="4" fill="#b45309" stroke="white" strokeWidth="2" />
      <circle cx="36" cy="25" r="4" fill="#b45309" stroke="white" strokeWidth="2" />
      <circle cx="24" cy="16" r="3" fill="#fde68a" opacity="0.95" />
      <rect x="22" y="30" width="4" height="10" rx="1" fill="white" opacity="0.7" />
    </Base>
  );
}

// 15 — Agriculture / campagne
export function IconGeoB15({ size = 48 }) {
  return (
    <Base id="ei-gb15" c0="#65a30d" c1="#365314" shadow="#1a2e05" size={size}>
      <rect x="6" y="30" width="36" height="12" rx="3" fill="#4ade80" opacity="0.6" />
      {[8, 16, 24, 32, 40].map((x, i) => (
        <ellipse key={i} cx={x} cy={28} rx="4" ry="10" fill="#86efac" opacity={0.6 + (i % 2) * 0.2} />
      ))}
      <rect x="18" y="16" width="12" height="16" rx="2" fill="#fde68a" opacity="0.9" />
      <polygon points="18,16 24,8 30,16" fill="#ef4444" opacity="0.9" />
      <circle cx="36" cy="14" r="7" fill="#fde68a" opacity="0.85" />
    </Base>
  );
}

// 16 — Industrie / économie
export function IconGeoB16({ size = 48 }) {
  return (
    <Base id="ei-gb16" c0="#374151" c1="#111827" shadow="#030712" size={size}>
      <rect x="8" y="28" width="10" height="14" rx="2" fill="#9ca3af" opacity="0.9" />
      <rect x="20" y="22" width="10" height="20" rx="2" fill="#d1d5db" opacity="0.9" />
      <rect x="32" y="18" width="10" height="24" rx="2" fill="#9ca3af" opacity="0.9" />
      <rect x="6" y="24" width="4" height="8" rx="2" fill="#6b7280" opacity="0.9" />
      <rect x="16" y="18" width="4" height="10" rx="2" fill="#6b7280" opacity="0.9" />
      <rect x="28" y="14" width="4" height="10" rx="2" fill="#6b7280" opacity="0.9" />
      <path d="M8 22 Q14 14 22 18 Q30 12 38 16" stroke="#fde68a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </Base>
  );
}

// 17 — Capitales européennes
export function IconGeoB17({ size = 48 }) {
  return (
    <Base id="ei-gb17" c0="#7c3aed" c1="#3b0764" shadow="#1e0447" size={size}>
      {[
        { x: 16, y: 12, label: 'P' },
        { x: 26, y: 10, label: 'B' },
        { x: 34, y: 16, label: 'A' },
        { x: 10, y: 22, label: 'L' },
        { x: 30, y: 26, label: 'R' },
        { x: 18, y: 30, label: 'M' },
        { x: 24, y: 38, label: 'R' },
      ].map(({ x, y, label }, i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="5" fill="#c4b5fd" opacity="0.85" />
          <text x={x - 3} y={y + 4} fontSize="6" fontWeight="900" fill="#3b0764" fontFamily="system-ui">{label}</text>
        </g>
      ))}
    </Base>
  );
}

// 18 — Pays frontaliers
export function IconGeoB18({ size = 48 }) {
  return (
    <Base id="ei-gb18" c0="#0f766e" c1="#042f2e" shadow="#011a19" size={size}>
      <path d="M20 14 L28 14 L34 20 L36 28 L30 36 L18 36 L12 28 L14 20Z" fill="white" opacity="0.9" stroke="white" strokeWidth="1.5" />
      <text x="18" y="27" fontSize="8" fontWeight="900" fill="#0f766e" fontFamily="system-ui">BE</text>
      <rect x="30" y="10" width="10" height="8" rx="2" fill="#fde68a" opacity="0.8" />
      <text x="32" y="17" fontSize="6" fontWeight="700" fill="#92400e" fontFamily="system-ui">DE</text>
      <rect x="32" y="20" width="10" height="8" rx="2" fill="#fde68a" opacity="0.8" />
      <text x="34" y="27" fontSize="6" fontWeight="700" fill="#92400e" fontFamily="system-ui">LU</text>
      <rect x="30" y="30" width="10" height="8" rx="2" fill="#86efac" opacity="0.8" />
      <text x="32" y="37" fontSize="6" fontWeight="700" fill="#14532d" fontFamily="system-ui">FR</text>
      <rect x="8" y="16" width="10" height="8" rx="2" fill="#7dd3fc" opacity="0.8" />
      <text x="10" y="23" fontSize="6" fontWeight="700" fill="#0c4a6e" fontFamily="system-ui">NL</text>
    </Base>
  );
}

// 19 — Mers & côtes d'Europe
export function IconGeoB19({ size = 48 }) {
  return (
    <Base id="ei-gb19" c0="#0369a1" c1="#0c4a6e" shadow="#082f49" size={size}>
      <path d="M6 18 Q14 10 22 16 Q30 22 38 14 Q44 10 46 18" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.9" />
      <ellipse cx="24" cy="30" rx="18" ry="10" fill="#38bdf8" opacity="0.5" />
      <path d="M6 30 Q12 26 18 30 Q24 34 30 30 Q36 26 42 30" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="16" cy="18" r="3" fill="#fde68a" opacity="0.9" />
      <circle cx="32" cy="20" r="3" fill="#fde68a" opacity="0.9" />
      <circle cx="24" cy="14" r="2.5" fill="white" opacity="0.8" />
    </Base>
  );
}

// 20 — Grand tour / carte complète
export function IconGeoB20({ size = 48 }) {
  return (
    <Base id="ei-gb20" c0="#d97706" c1="#78350f" shadow="#451a03" size={size}>
      <circle cx="24" cy="24" r="16" fill="none" stroke="#fde68a" strokeWidth="2" opacity="0.7" />
      <path d="M10 18 Q16 12 24 14 Q32 16 36 24 Q38 32 30 36 Q22 40 16 34 Q10 28 10 18Z" fill="white" opacity="0.8" />
      <path d="M14 20 Q20 16 26 20 Q30 24 26 30 Q20 34 16 30 Q12 26 14 20Z" fill="#fde68a" opacity="0.7" />
      <circle cx="24" cy="24" r="3" fill="#d97706" opacity="0.9" />
      <line x1="24" y1="8" x2="24" y2="40" stroke="#fde68a" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
      <line x1="8" y1="24" x2="40" y2="24" stroke="#fde68a" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
      <circle cx="24" cy="8" r="2" fill="#fde68a" opacity="0.9" />
      <polygon points="20,4 24,0 28,4 24,3" fill="#ef4444" opacity="0.9" />
    </Base>
  );
}

export function IconLibGrandDefi({ size = 48 }) {
  return (
    <Base id="ei-lgd" c0="#f59e0b" c1="#78350f" shadow="#451a03" size={size}>
      {/* Trophy cup body */}
      <path d="M13 8 L13 25 Q13 35 24 37 Q35 35 35 25 L35 8Z" fill="#fef9c3" opacity="0.95" />
      {/* Handles */}
      <path d="M13 12 Q4 12 4 21 Q4 28 13 26" fill="none" stroke="#fef9c3" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M35 12 Q44 12 44 21 Q44 28 35 26" fill="none" stroke="#fef9c3" strokeWidth="3.5" strokeLinecap="round" />
      {/* Stem + base */}
      <rect x="21" y="37" width="6" height="5" rx="1.5" fill="#fbbf24" opacity="0.9" />
      <rect x="15" y="42" width="18" height="4.5" rx="2.5" fill="#fbbf24" opacity="0.9" />
      {/* Star on cup */}
      <text x="17.5" y="28" fontSize="12" fontFamily="system-ui,sans-serif">⭐</text>
      {/* Crown rays */}
      {[0,60,120,180,240,300].map((deg, i) => {
        const a = (deg - 90) * Math.PI / 180;
        const x1 = 24 + 20 * Math.cos(a);
        const y1 = 20 + 20 * Math.sin(a);
        const x2 = 24 + 26 * Math.cos(a);
        const y2 = 20 + 26 * Math.sin(a);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fde68a" strokeWidth="2" opacity="0.35" />;
      })}
      {/* Shine */}
      <ellipse cx="19" cy="14" rx="5" ry="3" fill="white" opacity="0.22" />
    </Base>
  );
}
