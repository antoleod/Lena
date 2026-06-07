// Game icon SVG components for Lena — JeuxHubPage
// viewBox 48×48, circular gradient, drop shadow, highlight — matches AppIcons.jsx style
// Unique defs prefixes: gi-mm-, gi-mc-, gi-dv-, gi-cp-, gi-cr-, gi-cm-, gi-ti-, gi-my-, gi-dt-

export function IconGameMotsMelanges({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gi-mm-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#22d3ee"/>
          <stop offset="100%" stopColor="#0e7490"/>
        </radialGradient>
        <filter id="gi-mm-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0c4a6e" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#gi-mm-bg)" filter="url(#gi-mm-sh)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.22"/>
      {/* Letter A circle */}
      <circle cx="14" cy="28" r="8" fill="#0891b2" opacity="0.8"/>
      <text x="10.5" y="32" fontSize="10" fontWeight="900" fill="white" fontFamily="system-ui">A</text>
      {/* Letter B circle */}
      <circle cx="27" cy="20" r="7" fill="#0e7490" opacity="0.9"/>
      <text x="23.5" y="24" fontSize="9" fontWeight="900" fill="white" fontFamily="system-ui">B</text>
      {/* Letter C circle */}
      <circle cx="36" cy="32" r="6" fill="#06b6d4" opacity="0.85"/>
      <text x="33" y="36" fontSize="8" fontWeight="900" fill="white" fontFamily="system-ui">C</text>
      {/* Shuffle arrows */}
      <path d="M10 16 Q16 10 24 14" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M24 14 L22 11 M24 14 L27 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}

export function IconGameMotsCaches({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gi-mc-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#60a5fa"/>
          <stop offset="100%" stopColor="#1d4ed8"/>
        </radialGradient>
        <filter id="gi-mc-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1e3a8a" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#gi-mc-bg)" filter="url(#gi-mc-sh)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.22"/>
      {/* Grid background */}
      <rect x="8" y="14" width="24" height="24" rx="3" fill="#1d4ed8" opacity="0.5"/>
      {/* Grid lines */}
      <line x1="16" y1="14" x2="16" y2="38" stroke="white" strokeWidth="0.5" opacity="0.3"/>
      <line x1="24" y1="14" x2="24" y2="38" stroke="white" strokeWidth="0.5" opacity="0.3"/>
      <line x1="8" y1="22" x2="32" y2="22" stroke="white" strokeWidth="0.5" opacity="0.3"/>
      <line x1="8" y1="30" x2="32" y2="30" stroke="white" strokeWidth="0.5" opacity="0.3"/>
      {/* Letters in grid */}
      <text x="9.5" y="21" fontSize="6" fontWeight="700" fill="white" opacity="0.7" fontFamily="system-ui">M</text>
      <text x="17.5" y="21" fontSize="6" fontWeight="700" fill="white" opacity="0.7" fontFamily="system-ui">O</text>
      <text x="9.5" y="29" fontSize="6" fontWeight="700" fill="white" opacity="0.7" fontFamily="system-ui">T</text>
      <text x="17.5" y="29" fontSize="6" fontWeight="700" fill="white" opacity="0.7" fontFamily="system-ui">S</text>
      {/* Highlighted word */}
      <rect x="8" y="14" width="24" height="8" rx="2" fill="#fde68a" opacity="0.3"/>
      {/* Magnifier */}
      <circle cx="34" cy="30" r="9" fill="none" stroke="white" strokeWidth="2.5" opacity="0.95"/>
      <circle cx="34" cy="30" r="6" fill="#3b82f6" opacity="0.4"/>
      <line x1="40" y1="36" x2="44" y2="40" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconGameDevinettes({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gi-dv-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fde047"/>
          <stop offset="100%" stopColor="#a16207"/>
        </radialGradient>
        <filter id="gi-dv-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#713f12" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#gi-dv-bg)" filter="url(#gi-dv-sh)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.22"/>
      {/* Bulb glass */}
      <path d="M16 26 Q14 20 18 15 Q24 10 30 15 Q34 20 32 26 Q30 30 28 32 L20 32 Q18 30 16 26Z" fill="#fef9c3" opacity="0.9"/>
      <path d="M16 26 Q14 20 18 15 Q24 10 30 15 Q34 20 32 26 Q30 30 28 32 L20 32 Q18 30 16 26Z" fill="white" opacity="0.25"/>
      {/* Bulb base */}
      <rect x="20" y="32" width="8" height="3" rx="1" fill="#d97706" opacity="0.9"/>
      <rect x="21" y="35" width="6" height="2" rx="1" fill="#b45309" opacity="0.9"/>
      <rect x="22" y="37" width="4" height="2" rx="1" fill="#92400e" opacity="0.9"/>
      {/* Filament */}
      <path d="M20 28 Q22 24 24 22 Q26 24 28 28" stroke="#fbbf24" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Question mark */}
      <text x="20" y="27" fontSize="10" fontWeight="900" fill="#d97706" fontFamily="system-ui">?</text>
      {/* Glow rays */}
      <line x1="24" y1="8" x2="24" y2="5" stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
      <line x1="34" y1="12" x2="36" y2="10" stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
      <line x1="14" y1="12" x2="12" y2="10" stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
      <line x1="37" y1="22" x2="40" y2="22" stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
      <line x1="11" y1="22" x2="8" y2="22" stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}

export function IconGameCompletePhrase({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gi-cp-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#4ade80"/>
          <stop offset="100%" stopColor="#14532d"/>
        </radialGradient>
        <filter id="gi-cp-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#052e16" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#gi-cp-bg)" filter="url(#gi-cp-sh)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.22"/>
      {/* Text lines */}
      <rect x="8" y="16" width="20" height="3" rx="1.5" fill="white" opacity="0.8"/>
      <rect x="8" y="22" width="14" height="3" rx="1.5" fill="white" opacity="0.8"/>
      {/* Blank / gap */}
      <rect x="24" y="22" width="16" height="3" rx="1.5" fill="#fbbf24" opacity="0.9"/>
      <rect x="8" y="28" width="32" height="3" rx="1.5" fill="white" opacity="0.6"/>
      {/* Pencil */}
      <rect x="32" y="28" width="4" height="14" rx="1" fill="#fbbf24" transform="rotate(-30 32 28)"/>
      <polygon points="32,28 36,28 34,22" fill="#f87171" transform="rotate(-30 32 28)"/>
      <rect x="32" y="28" width="4" height="3" fill="#d1d5db" transform="rotate(-30 32 28)"/>
      {/* Pencil tip mark */}
      <circle cx="38" cy="36" r="1.5" fill="#22c55e" opacity="0.8"/>
    </svg>
  );
}

export function IconGameCalculRapide({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gi-cr-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fb923c"/>
          <stop offset="100%" stopColor="#9a3412"/>
        </radialGradient>
        <filter id="gi-cr-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#431407" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#gi-cr-bg)" filter="url(#gi-cr-sh)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.22"/>
      {/* Lightning bolt */}
      <path d="M28 8 L16 26 L22 26 L16 40 L32 20 L26 20Z" fill="#fde047" opacity="0.95"/>
      <path d="M28 8 L16 26 L22 26 L16 40 L32 20 L26 20Z" fill="white" opacity="0.2"/>
      {/* Number bubbles */}
      <circle cx="10" cy="14" r="5" fill="white" opacity="0.85"/>
      <text x="7.5" y="17.5" fontSize="7" fontWeight="900" fill="#ea580c" fontFamily="system-ui">1</text>
      <circle cx="38" cy="14" r="5" fill="white" opacity="0.85"/>
      <text x="35.5" y="17.5" fontSize="7" fontWeight="900" fill="#ea580c" fontFamily="system-ui">2</text>
      <circle cx="38" cy="36" r="5" fill="white" opacity="0.85"/>
      <text x="35.5" y="39.5" fontSize="7" fontWeight="900" fill="#ea580c" fontFamily="system-ui">3</text>
    </svg>
  );
}

export function IconGameCourseMaths({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gi-cm-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#f87171"/>
          <stop offset="100%" stopColor="#7f1d1d"/>
        </radialGradient>
        <filter id="gi-cm-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#450a0a" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#gi-cm-bg)" filter="url(#gi-cm-sh)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.22"/>
      {/* Checkered finish flag */}
      <rect x="28" y="8" width="2" height="20" rx="1" fill="white" opacity="0.9"/>
      <rect x="30" y="8" width="10" height="14" rx="2" fill="white" opacity="0.9"/>
      {/* Checkered pattern */}
      <rect x="30" y="8" width="5" height="7" rx="0" fill="#1c1917" opacity="0.8"/>
      <rect x="35" y="15" width="5" height="7" rx="0" fill="#1c1917" opacity="0.8"/>
      <rect x="30" y="15" width="5" height="7" rx="0" fill="white" opacity="0"/>
      {/* Stopwatch circle */}
      <circle cx="18" cy="34" r="12" fill="white" opacity="0.15" stroke="white" strokeWidth="2"/>
      <circle cx="18" cy="34" r="9" fill="#dc2626" opacity="0.7"/>
      {/* Stopwatch hand */}
      <line x1="18" y1="34" x2="18" y2="26" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="18" y1="34" x2="23" y2="36" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="18" cy="34" r="1.5" fill="white"/>
      {/* Crown top */}
      <rect x="15" y="22" width="6" height="2" rx="1" fill="white" opacity="0.7"/>
    </svg>
  );
}

export function IconGameTrouveIntrus({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gi-ti-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#c084fc"/>
          <stop offset="100%" stopColor="#4c1d95"/>
        </radialGradient>
        <filter id="gi-ti-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#2e1065" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#gi-ti-bg)" filter="url(#gi-ti-sh)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.22"/>
      {/* Three matching stars */}
      <path d="M12 20 L13.2 24 L17 24 L14 26.4 L15.2 30 L12 27.6 L8.8 30 L10 26.4 L7 24 L10.8 24Z" fill="#fde68a" opacity="0.9"/>
      <path d="M24 20 L25.2 24 L29 24 L26 26.4 L27.2 30 L24 27.6 L20.8 30 L22 26.4 L19 24 L22.8 24Z" fill="#fde68a" opacity="0.9"/>
      {/* Intruder — different shape (circle) */}
      <circle cx="36" cy="25" r="7" fill="#f43f5e" opacity="0.9"/>
      <path d="M33 25 L35 27 L39 23" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* X mark on intruder */}
      <circle cx="36" cy="14" r="5" fill="#ef4444" opacity="0.3" stroke="#f43f5e" strokeWidth="1.5"/>
      <line x1="33" y1="11" x2="39" y2="17" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="39" y1="11" x2="33" y2="17" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Bottom matching shape */}
      <path d="M12 34 L13.2 38 L17 38 L14 40.4 L15.2 44 L12 41.6 L8.8 44 L10 40.4 L7 38 L10.8 38Z" fill="#fde68a" opacity="0.9" transform="scale(0.8) translate(4,2)"/>
    </svg>
  );
}

export function IconGameMemory({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gi-my-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#f472b6"/>
          <stop offset="100%" stopColor="#831843"/>
        </radialGradient>
        <filter id="gi-my-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#500724" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#gi-my-bg)" filter="url(#gi-my-sh)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.22"/>
      {/* Face-down cards */}
      <rect x="8" y="14" width="14" height="18" rx="3" fill="#9d174d" opacity="0.8"/>
      <rect x="9" y="15" width="12" height="16" rx="2" fill="#be185d"/>
      {/* Card back pattern */}
      <path d="M11 17 Q15 23 19 17 M11 27 Q15 21 19 27" stroke="#f9a8d4" strokeWidth="1" fill="none" opacity="0.6"/>
      <rect x="26" y="14" width="14" height="18" rx="3" fill="#9d174d" opacity="0.8"/>
      <rect x="27" y="15" width="12" height="16" rx="2" fill="#be185d"/>
      <path d="M29 17 Q33 23 37 17 M29 27 Q33 21 37 27" stroke="#f9a8d4" strokeWidth="1" fill="none" opacity="0.6"/>
      {/* Matching face-up cards */}
      <rect x="8" y="36" width="12" height="8" rx="2" fill="white" opacity="0.9"/>
      <text x="11" y="43" fontSize="8" fontFamily="system-ui">⭐</text>
      <rect x="28" y="36" width="12" height="8" rx="2" fill="white" opacity="0.9"/>
      <text x="31" y="43" fontSize="8" fontFamily="system-ui">⭐</text>
    </svg>
  );
}

export function IconGameDetective({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gi-dt-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fbbf24"/>
          <stop offset="100%" stopColor="#78350f"/>
        </radialGradient>
        <filter id="gi-dt-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#451a03" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#gi-dt-bg)" filter="url(#gi-dt-sh)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.22"/>
      {/* Open book */}
      <path d="M8 18 Q8 14 12 14 L22 16 L22 36 Q18 34 12 34 Q8 34 8 30Z" fill="white" opacity="0.9"/>
      <path d="M22 16 L32 14 Q36 14 36 18 L36 30 Q36 34 32 34 L22 36Z" fill="#fef3c7" opacity="0.9"/>
      {/* Book spine */}
      <rect x="21" y="16" width="2" height="20" rx="1" fill="#d97706" opacity="0.7"/>
      {/* Text lines on book */}
      <rect x="10" y="20" width="10" height="1.5" rx="0.75" fill="#6b7280" opacity="0.6"/>
      <rect x="10" y="24" width="8" height="1.5" rx="0.75" fill="#6b7280" opacity="0.6"/>
      <rect x="10" y="28" width="10" height="1.5" rx="0.75" fill="#6b7280" opacity="0.6"/>
      <rect x="24" y="20" width="10" height="1.5" rx="0.75" fill="#6b7280" opacity="0.6"/>
      <rect x="24" y="24" width="8" height="1.5" rx="0.75" fill="#6b7280" opacity="0.6"/>
      {/* Magnifier over book */}
      <circle cx="36" cy="32" r="8" fill="none" stroke="white" strokeWidth="2.5" opacity="0.95"/>
      <circle cx="36" cy="32" r="5" fill="#fbbf24" opacity="0.3"/>
      <line x1="42" y1="38" x2="46" y2="42" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Fingerprint dots */}
      <circle cx="18" cy="40" r="1.5" fill="#92400e" opacity="0.7"/>
      <circle cx="22" cy="42" r="1" fill="#92400e" opacity="0.6"/>
      <circle cx="14" cy="42" r="1" fill="#92400e" opacity="0.6"/>
    </svg>
  );
}
