// Premium SVG icon components for Lena app
// Style: soft 3D, vibrant gradients, child-friendly, Duolingo-inspired

// ─── Subject icons (Apprendre hub) ────────────────────────────────────────

export function IconMathematics({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sm-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#818cf8"/>
          <stop offset="100%" stopColor="#3730a3"/>
        </radialGradient>
        <filter id="sm-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1e1b4b" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#sm-bg)" filter="url(#sm-sh)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.22"/>
      {/* Large + block */}
      <rect x="8" y="20" width="14" height="8" rx="2.5" fill="#fbbf24"/>
      <rect x="12" y="16" width="6" height="16" rx="2.5" fill="#fbbf24"/>
      {/* Shadow on + */}
      <rect x="8" y="24" width="14" height="4" rx="2.5" fill="#b45309" opacity="0.25"/>
      <rect x="12" y="24" width="6" height="8" rx="2.5" fill="#b45309" opacity="0.25"/>
      {/* = block */}
      <rect x="26" y="19" width="14" height="4" rx="2" fill="white" opacity="0.9"/>
      <rect x="26" y="25" width="14" height="4" rx="2" fill="white" opacity="0.9"/>
      {/* Small floating numbers */}
      <circle cx="39" cy="11" r="4.5" fill="#c7d2fe" opacity="0.9"/>
      <text x="36.8" y="14.5" fontSize="6.5" fontWeight="900" fill="#3730a3" fontFamily="system-ui">7</text>
      <circle cx="9" cy="38" r="4" fill="#a5b4fc" opacity="0.8"/>
      <text x="7" y="41.5" fontSize="6" fontWeight="900" fill="#3730a3" fontFamily="system-ui">×</text>
      <circle cx="39" cy="37" r="3.5" fill="#fde68a" opacity="0.9"/>
      <text x="37" y="40.5" fontSize="5.5" fontWeight="900" fill="#92400e" fontFamily="system-ui">2</text>
    </svg>
  );
}

export function IconFrench({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sf-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#f472b6"/>
          <stop offset="100%" stopColor="#9d174d"/>
        </radialGradient>
        <filter id="sf-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#500724" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#sf-bg)" filter="url(#sf-sh)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.22"/>
      {/* Quill / plume */}
      <path d="M38 8 C30 14 20 24 18 38 C22 30 28 22 38 8Z" fill="white" opacity="0.95"/>
      <path d="M38 8 C34 16 26 24 20 38 C24 30 30 20 38 8Z" fill="#fce7f3" opacity="0.7"/>
      <path d="M38 8 L20 38 L18 38 C22 30 32 18 38 8Z" fill="#f9a8d4" opacity="0.5"/>
      {/* Ink tip */}
      <path d="M18 38 L16 42 L21 39 Z" fill="#831843"/>
      {/* Ink line */}
      <path d="M10 36 Q14 33 18 38" stroke="#fce7f3" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* French flag stripes */}
      <rect x="8" y="10" width="5" height="14" rx="1.5" fill="#2563eb" opacity="0.85"/>
      <rect x="13" y="10" width="5" height="14" rx="0" fill="white" opacity="0.9"/>
      <rect x="18" y="10" width="5" height="14" rx="1.5" fill="#dc2626" opacity="0.85"/>
      {/* Stars */}
      <path d="M38 30 L39 33 L42 33 L39.5 35 L40.5 38 L38 36.5 L35.5 38 L36.5 35 L34 33 L37 33 Z" fill="#fbbf24" opacity="0.9"/>
      <circle cx="10" cy="39" r="2.5" fill="#fde68a" opacity="0.8"/>
    </svg>
  );
}

export function IconDutch({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sd-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#38bdf8"/>
          <stop offset="100%" stopColor="#0369a1"/>
        </radialGradient>
        <filter id="sd-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#082f49" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#sd-bg)" filter="url(#sd-sh)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.22"/>
      {/* Speech bubble main */}
      <rect x="8" y="12" width="24" height="18" rx="6" fill="white" opacity="0.95"/>
      <path d="M14 30 L12 38 L20 32" fill="white" opacity="0.95"/>
      {/* "NL" text */}
      <text x="12" y="25" fontSize="11" fontWeight="900" fill="#0369a1" fontFamily="system-ui">NL</text>
      {/* Windmill silhouette */}
      <rect x="35" y="28" width="3" height="10" rx="1" fill="white" opacity="0.85"/>
      <rect x="33.5" y="22" width="6" height="2" rx="1" fill="white" opacity="0.85" transform="rotate(45 36.5 23)"/>
      <rect x="33.5" y="22" width="6" height="2" rx="1" fill="white" opacity="0.85" transform="rotate(-45 36.5 23)"/>
      <rect x="33.5" y="22" width="6" height="2" rx="1" fill="white" opacity="0.85"/>
      <rect x="33.5" y="22" width="6" height="2" rx="1" fill="white" opacity="0.85" transform="rotate(90 36.5 23)"/>
      <circle cx="36.5" cy="23" r="2" fill="#bae6fd"/>
      {/* Stars */}
      <circle cx="38" cy="38" r="3" fill="#fbbf24" opacity="0.9"/>
      <path d="M38 35.5 L38.5 37.2 L40.5 37.2 L38.9 38.2 L39.4 40 L38 39 L36.6 40 L37.1 38.2 L35.5 37.2 L37.5 37.2 Z" fill="white" opacity="0.9"/>
      <circle cx="9" cy="10" r="2.5" fill="#e0f2fe" opacity="0.8"/>
    </svg>
  );
}

export function IconEnglish({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="se-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#4ade80"/>
          <stop offset="100%" stopColor="#14532d"/>
        </radialGradient>
        <filter id="se-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#052e16" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#se-bg)" filter="url(#se-sh)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.22"/>
      {/* Globe */}
      <circle cx="24" cy="26" r="14" fill="#bbf7d0" opacity="0.25" stroke="white" strokeWidth="1.2"/>
      {/* Meridians */}
      <ellipse cx="24" cy="26" rx="6" ry="14" stroke="white" strokeWidth="1" fill="none" opacity="0.6"/>
      <line x1="10" y1="26" x2="38" y2="26" stroke="white" strokeWidth="1" opacity="0.6"/>
      <line x1="11" y1="20" x2="37" y2="20" stroke="white" strokeWidth="0.8" opacity="0.4"/>
      <line x1="11" y1="32" x2="37" y2="32" stroke="white" strokeWidth="0.8" opacity="0.4"/>
      {/* UK flag cross simplified */}
      <line x1="10" y1="26" x2="38" y2="26" stroke="white" strokeWidth="2" opacity="0.7"/>
      <line x1="24" y1="12" x2="24" y2="40" stroke="white" strokeWidth="2" opacity="0.7"/>
      {/* EN badge */}
      <rect x="17" y="19" width="14" height="14" rx="3" fill="#166534" opacity="0.85"/>
      <text x="18.5" y="30" fontSize="9" fontWeight="900" fill="white" fontFamily="system-ui">EN</text>
      {/* Stars */}
      <path d="M40 11 L40.8 13.5 L43.5 13.5 L41.4 15 L42.2 17.5 L40 16 L37.8 17.5 L38.6 15 L36.5 13.5 L39.2 13.5 Z" fill="#fbbf24" opacity="0.9"/>
      <circle cx="9" cy="38" r="2.5" fill="#d1fae5" opacity="0.8"/>
    </svg>
  );
}

export function IconSpanish({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ss-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fb923c"/>
          <stop offset="100%" stopColor="#9a3412"/>
        </radialGradient>
        <filter id="ss-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#431407" floodOpacity="0.4"/></filter>
        <radialGradient id="ss-sun" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#fde68a"/>
          <stop offset="100%" stopColor="#fbbf24"/>
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#ss-bg)" filter="url(#ss-sh)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.22"/>
      {/* Sun */}
      <circle cx="24" cy="25" r="10" fill="url(#ss-sun)"/>
      {/* Sun rays */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
        <line key={a}
          x1={24 + 12*Math.cos(a*Math.PI/180)} y1={25 + 12*Math.sin(a*Math.PI/180)}
          x2={24 + 15*Math.cos(a*Math.PI/180)} y2={25 + 15*Math.sin(a*Math.PI/180)}
          stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
      ))}
      {/* Sun face */}
      <circle cx="21" cy="24" r="1.5" fill="#92400e"/>
      <circle cx="27" cy="24" r="1.5" fill="#92400e"/>
      <path d="M20 28 Q24 31 28 28" stroke="#92400e" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* Spanish flag stripe at top */}
      <rect x="8" y="9" width="32" height="4" rx="1.5" fill="#dc2626" opacity="0.85"/>
      <rect x="8" y="13" width="32" height="4" rx="0" fill="#fbbf24" opacity="0.7"/>
      <rect x="8" y="17" width="32" height="4" rx="1.5" fill="#dc2626" opacity="0.85"/>
      {/* Stars */}
      <circle cx="40" cy="36" r="3" fill="#fde68a" opacity="0.9"/>
      <circle cx="8" cy="36" r="2.5" fill="#fed7aa" opacity="0.8"/>
    </svg>
  );
}

export function IconReasoning({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sr-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#a78bfa"/>
          <stop offset="100%" stopColor="#5b21b6"/>
        </radialGradient>
        <filter id="sr-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#2e1065" floodOpacity="0.45"/></filter>
        <filter id="sr-glow"><feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#fbbf24" floodOpacity="0.7"/></filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#sr-bg)" filter="url(#sr-sh)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.22"/>
      {/* Puzzle piece top-left */}
      <path d="M8 14 L18 14 L18 18 Q21 18 21 21 Q21 24 18 24 L18 28 L8 28 L8 24 Q5 24 5 21 Q5 18 8 18 Z" fill="#34d399" opacity="0.9"/>
      {/* Puzzle piece bottom-right */}
      <path d="M30 20 L40 20 L40 24 Q43 24 43 27 Q43 30 40 30 L40 34 L30 34 L30 30 Q27 30 27 27 Q27 24 30 24 Z" fill="#60a5fa" opacity="0.9"/>
      {/* Connecting arc */}
      <path d="M18 21 Q24 14 30 27" stroke="white" strokeWidth="1.5" fill="none" strokeDasharray="2.5 2" strokeLinecap="round" opacity="0.7"/>
      {/* Lightbulb */}
      <circle cx="36" cy="12" r="5" fill="#fde68a" filter="url(#sr-glow)"/>
      <path d="M34 16 L34 18 L38 18 L38 16" stroke="#f59e0b" strokeWidth="1" fill="none"/>
      <line x1="36" y1="18" x2="36" y2="20" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round"/>
      {/* Question mark */}
      <circle cx="11" cy="37" r="5.5" fill="#fbbf24" opacity="0.9"/>
      <text x="8.5" y="40.5" fontSize="8" fontWeight="900" fill="white" fontFamily="system-ui">?</text>
    </svg>
  );
}

export function IconStoriesSubject({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sst-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fb923c"/>
          <stop offset="100%" stopColor="#9a3412"/>
        </radialGradient>
        <linearGradient id="sst-pg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff7ed"/>
          <stop offset="100%" stopColor="#fed7aa"/>
        </linearGradient>
        <filter id="sst-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#431407" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#sst-bg)" filter="url(#sst-sh)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.22"/>
      {/* Open scroll / book */}
      <path d="M24 37 C24 37 9 32 9 16 L9 14 C12 14 17 16 24 21 Z" fill="url(#sst-pg)"/>
      <path d="M24 37 C24 37 39 32 39 16 L39 14 C36 14 31 16 24 21 Z" fill="url(#sst-pg)" opacity="0.8"/>
      <rect x="23" y="21" width="2" height="17" rx="1" fill="#c2410c"/>
      {/* Scroll top curls */}
      <ellipse cx="9" cy="14" rx="3.5" ry="2" fill="#fdba74"/>
      <ellipse cx="39" cy="14" rx="3.5" ry="2" fill="#fdba74"/>
      {/* Text lines on left page */}
      <line x1="12" y1="24" x2="21" y2="22" stroke="#fed7aa" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="12" y1="27" x2="21" y2="25" stroke="#fed7aa" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="12" y1="30" x2="18" y2="28.5" stroke="#fed7aa" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Moon + stars (night story) */}
      <path d="M36 10 C33 7 30 8 29 11 C32 10 35 12 36 10Z" fill="#e0f2fe" opacity="0.9"/>
      <path d="M40 18 L40.6 20 L42.5 20 L41 21.2 L41.6 23 L40 22 L38.4 23 L39 21.2 L37.5 20 L39.4 20 Z" fill="#fbbf24" opacity="0.9"/>
      <circle cx="9" cy="38" r="2.5" fill="#fde68a" opacity="0.8"/>
      <circle cx="38" cy="35" r="1.5" fill="#fde68a" opacity="0.6"/>
    </svg>
  );
}

export function IconSciences({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sc-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#4ade80"/>
          <stop offset="100%" stopColor="#14532d"/>
        </radialGradient>
        <filter id="sc-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#052e16" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#sc-bg)" filter="url(#sc-sh)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.22"/>
      {/* Microscope body */}
      <rect x="20" y="30" width="10" height="6" rx="2" fill="white" opacity="0.9"/>
      <rect x="22" y="24" width="6" height="8" rx="1.5" fill="#bbf7d0" opacity="0.9"/>
      <rect x="23" y="14" width="4" height="12" rx="1.5" fill="white" opacity="0.9"/>
      <circle cx="25" cy="13" r="3.5" fill="#6ee7b7"/>
      <circle cx="25" cy="13" r="2" fill="white" opacity="0.8"/>
      <rect x="17" y="35" width="16" height="3" rx="1.5" fill="white" opacity="0.8"/>
      {/* Bubbles / molecules */}
      <circle cx="37" cy="16" r="5" fill="#a7f3d0" opacity="0.8" stroke="#059669" strokeWidth="1"/>
      <circle cx="39" cy="13" r="2.5" fill="#6ee7b7" opacity="0.7" stroke="#059669" strokeWidth="0.8"/>
      <line x1="37" y1="16" x2="39" y2="13" stroke="#059669" strokeWidth="1"/>
      <circle cx="10" cy="20" r="4" fill="#86efac" opacity="0.7" stroke="#16a34a" strokeWidth="0.8"/>
      <circle cx="7" cy="16" r="2.5" fill="#4ade80" opacity="0.7" stroke="#16a34a" strokeWidth="0.8"/>
      <line x1="10" y1="20" x2="7" y2="16" stroke="#16a34a" strokeWidth="1"/>
      {/* Star */}
      <path d="M40 34 L40.7 36.5 L43.5 36.5 L41.3 38 L42 40.5 L40 39 L38 40.5 L38.7 38 L36.5 36.5 L39.3 36.5 Z" fill="#fbbf24" opacity="0.9"/>
    </svg>
  );
}

export function IconHistoire({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sh-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fbbf24"/>
          <stop offset="100%" stopColor="#92400e"/>
        </radialGradient>
        <filter id="sh-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#451a03" floodOpacity="0.4"/></filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#sh-bg)" filter="url(#sh-sh)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.22"/>
      {/* Columns */}
      <rect x="9" y="16" width="5" height="18" rx="1" fill="white" opacity="0.9"/>
      <rect x="16" y="16" width="5" height="18" rx="1" fill="#fde68a" opacity="0.9"/>
      <rect x="27" y="16" width="5" height="18" rx="1" fill="#fde68a" opacity="0.9"/>
      <rect x="34" y="16" width="5" height="18" rx="1" fill="white" opacity="0.9"/>
      {/* Entablature / roof */}
      <rect x="7" y="12" width="34" height="5" rx="1.5" fill="white" opacity="0.95"/>
      <rect x="6" y="33" width="36" height="4" rx="1.5" fill="white" opacity="0.95"/>
      {/* Pediment triangle */}
      <path d="M7 12 L24 4 L41 12 Z" fill="#fde68a" opacity="0.9"/>
      <path d="M7 12 L24 4 L41 12 Z" fill="none" stroke="white" strokeWidth="1"/>
      {/* Door */}
      <rect x="20" y="26" width="8" height="11" rx="2" fill="#92400e" opacity="0.6"/>
      <path d="M20 26 Q24 22 28 26" fill="#78350f" opacity="0.8"/>
      {/* Stars */}
      <path d="M41 20 L41.6 22 L43.5 22 L42 23.2 L42.5 25 L41 24 L39.5 25 L40 23.2 L38.5 22 L40.4 22 Z" fill="#fbbf24" opacity="0.9"/>
      <circle cx="8" cy="38" r="2.5" fill="#fde68a" opacity="0.8"/>
    </svg>
  );
}

export const SUBJECT_ICONS = {
  mathematics: IconMathematics,
  french: IconFrench,
  dutch: IconDutch,
  english: IconEnglish,
  spanish: IconSpanish,
  reasoning: IconReasoning,
  stories: IconStoriesSubject,
  sciences: IconSciences,
  histoire: IconHistoire,
};

export function IconExamens({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ex-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#c084fc"/>
          <stop offset="100%" stopColor="#7c3aed"/>
        </radialGradient>
        <linearGradient id="ex-book" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3e8ff"/>
          <stop offset="100%" stopColor="#ddd6fe"/>
        </linearGradient>
        <filter id="ex-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#4c1d95" floodOpacity="0.35"/>
        </filter>
      </defs>
      {/* Background circle */}
      <circle cx="24" cy="24" r="23" fill="url(#ex-bg)" filter="url(#ex-shadow)"/>
      {/* Highlight */}
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.25"/>
      {/* Book body */}
      <rect x="11" y="13" width="26" height="22" rx="3" fill="url(#ex-book)" filter="url(#ex-shadow)"/>
      {/* Spine */}
      <rect x="11" y="13" width="4" height="22" rx="2" fill="#a855f7"/>
      {/* Pages lines */}
      <line x1="18" y1="19" x2="34" y2="19" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="18" y1="23" x2="34" y2="23" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="18" y1="27" x2="28" y2="27" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Floating letters */}
      <circle cx="34" cy="11" r="5" fill="#fbbf24"/>
      <text x="31.5" y="14.5" fontSize="7" fontWeight="900" fill="#7c3aed" fontFamily="system-ui">A</text>
      <circle cx="11" cy="10" r="3.5" fill="#34d399"/>
      <text x="9" y="13" fontSize="5.5" fontWeight="900" fill="white" fontFamily="system-ui">B</text>
      {/* Stars */}
      <path d="M39 32 L40 35 L43 35 L40.5 37 L41.5 40 L39 38 L36.5 40 L37.5 37 L35 35 L38 35 Z" fill="#fbbf24" opacity="0.9"/>
      <circle cx="7" cy="35" r="2" fill="#f472b6" opacity="0.8"/>
    </svg>
  );
}

export function IconCahier({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ca-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#60a5fa"/>
          <stop offset="100%" stopColor="#1d4ed8"/>
        </radialGradient>
        <linearGradient id="ca-page" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="100%" stopColor="#eff6ff"/>
        </linearGradient>
        <filter id="ca-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1e3a8a" floodOpacity="0.35"/>
        </filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#ca-bg)" filter="url(#ca-shadow)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.25"/>
      {/* Notebook */}
      <rect x="13" y="11" width="22" height="28" rx="3" fill="#2563eb"/>
      <rect x="16" y="11" width="19" height="28" rx="2" fill="url(#ca-page)"/>
      {/* Red margin line */}
      <line x1="21" y1="13" x2="21" y2="37" stroke="#fca5a5" strokeWidth="1.2"/>
      {/* Ruled lines */}
      <line x1="23" y1="18" x2="33" y2="18" stroke="#bfdbfe" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="23" y1="22" x2="33" y2="22" stroke="#bfdbfe" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="23" y1="26" x2="33" y2="26" stroke="#bfdbfe" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="23" y1="30" x2="30" y2="30" stroke="#bfdbfe" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Spiral rings */}
      {[16, 22, 28, 34].map(y => (
        <ellipse key={y} cx="13" cy={y} rx="2.5" ry="2" fill="#93c5fd" stroke="#1d4ed8" strokeWidth="0.8"/>
      ))}
      {/* Pencil */}
      <g transform="rotate(35, 36, 14)">
        <rect x="33" y="8" width="4" height="13" rx="1" fill="#fcd34d"/>
        <rect x="33" y="8" width="4" height="3" rx="1" fill="#fbbf24"/>
        <path d="M33 21 L35 25 L37 21 Z" fill="#f5f5dc"/>
        <path d="M34 23 L35 25 L36 23 Z" fill="#7c3aed" opacity="0.6"/>
        <rect x="33" y="18" width="4" height="1.5" fill="#f87171"/>
      </g>
      {/* Star sticker */}
      <circle cx="39" cy="37" r="5" fill="#fbbf24"/>
      <path d="M39 33.5 L39.7 36 L42.5 36 L40.3 37.5 L41 40 L39 38.5 L37 40 L37.7 37.5 L35.5 36 L38.3 36 Z" fill="white" opacity="0.9"/>
    </svg>
  );
}

export function IconTables({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="tb-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fb923c"/>
          <stop offset="100%" stopColor="#c2410c"/>
        </radialGradient>
        <filter id="tb-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#7c2d12" floodOpacity="0.35"/>
        </filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#tb-bg)" filter="url(#tb-shadow)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.25"/>
      {/* Block 2 */}
      <rect x="8" y="14" width="13" height="13" rx="3" fill="#fef3c7"/>
      <text x="11" y="25" fontSize="10" fontWeight="900" fill="#ea580c" fontFamily="system-ui">2</text>
      {/* × sign */}
      <text x="22.5" y="25" fontSize="9" fontWeight="900" fill="white" fontFamily="system-ui">×</text>
      {/* Block 3 */}
      <rect x="29" y="14" width="13" height="13" rx="3" fill="#fef3c7"/>
      <text x="32" y="25" fontSize="10" fontWeight="900" fill="#ea580c" fontFamily="system-ui">3</text>
      {/* = line */}
      <line x1="10" y1="32" x2="38" y2="32" stroke="white" strokeWidth="1.5" strokeDasharray="3 2" strokeLinecap="round"/>
      {/* Block 6 */}
      <rect x="17" y="34" width="14" height="10" rx="3" fill="#fef3c7"/>
      <text x="20.5" y="43" fontSize="10" fontWeight="900" fill="#ea580c" fontFamily="system-ui">6</text>
      {/* Stars */}
      <path d="M6 9 L6.8 11.5 L9.5 11.5 L7.4 13 L8.2 15.5 L6 14 L3.8 15.5 L4.6 13 L2.5 11.5 L5.2 11.5 Z" fill="#fbbf24" opacity="0.9"/>
      <circle cx="42" cy="38" r="2.5" fill="#fde68a" opacity="0.8"/>
    </svg>
  );
}

export function IconStories({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="st-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#4ade80"/>
          <stop offset="100%" stopColor="#15803d"/>
        </radialGradient>
        <linearGradient id="st-page-l" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0fdf4"/>
          <stop offset="100%" stopColor="#dcfce7"/>
        </linearGradient>
        <linearGradient id="st-page-r" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#dcfce7"/>
          <stop offset="100%" stopColor="#bbf7d0"/>
        </linearGradient>
        <filter id="st-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#14532d" floodOpacity="0.35"/>
        </filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#st-bg)" filter="url(#st-shadow)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.25"/>
      {/* Open book */}
      <path d="M24 36 C24 36 9 31 9 17 L9 15 C12 15 18 16 24 22 Z" fill="url(#st-page-l)"/>
      <path d="M24 36 C24 36 39 31 39 17 L39 15 C36 15 30 16 24 22 Z" fill="url(#st-page-r)"/>
      <rect x="23" y="22" width="2" height="15" rx="1" fill="#16a34a"/>
      {/* Castle on right page */}
      <rect x="29" y="24" width="5" height="8" rx="0.5" fill="#86efac" opacity="0.8"/>
      <rect x="28" y="22" width="2" height="4" rx="0.3" fill="#86efac" opacity="0.8"/>
      <rect x="32" y="22" width="2" height="4" rx="0.3" fill="#86efac" opacity="0.8"/>
      {/* Lines on left page */}
      <line x1="12" y1="25" x2="21" y2="23" stroke="#86efac" strokeWidth="1" strokeLinecap="round"/>
      <line x1="12" y1="28" x2="21" y2="26" stroke="#86efac" strokeWidth="1" strokeLinecap="round"/>
      {/* Crown above */}
      <path d="M18 12 L20 16 L24 13 L28 16 L30 12 L30 17 L18 17 Z" fill="#fbbf24"/>
      <circle cx="18" cy="12" r="1.5" fill="#fbbf24"/>
      <circle cx="24" cy="11" r="1.5" fill="#fbbf24"/>
      <circle cx="30" cy="12" r="1.5" fill="#fbbf24"/>
      {/* Magic stars */}
      <path d="M8 22 L8.6 24 L10.5 24 L9 25.2 L9.6 27 L8 26 L6.4 27 L7 25.2 L5.5 24 L7.4 24 Z" fill="#fbbf24" opacity="0.9"/>
      <path d="M41 20 L41.5 21.8 L43.5 21.8 L41.8 23 L42.3 24.8 L41 23.8 L39.7 24.8 L40.2 23 L38.5 21.8 L40.5 21.8 Z" fill="#fbbf24" opacity="0.9"/>
    </svg>
  );
}

export function IconJeux({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="jx-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#c084fc"/>
          <stop offset="100%" stopColor="#7e22ce"/>
        </radialGradient>
        <filter id="jx-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3b0764" floodOpacity="0.4"/>
        </filter>
        <filter id="jx-glow">
          <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#fbbf24" floodOpacity="0.8"/>
        </filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#jx-bg)" filter="url(#jx-shadow)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.25"/>
      {/* Brain */}
      <path d="M24 38 C15 38 9 32 9 25 C9 19 13 14 19 12 C19 9 21 8 23 9 C23 7 25 7 25 9 C27 8 29 9 29 12 C35 14 39 19 39 25 C39 32 33 38 24 38Z"
        fill="#a855f7" opacity="0.9"/>
      {/* Brain folds */}
      <path d="M17 21 C19 19 21 21 23 19" stroke="#e879f9" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M15 27 C18 25 21 27 24 25 C27 23 30 25 33 27" stroke="#e879f9" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M18 33 C21 31 24 33 27 31" stroke="#e879f9" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Eyes */}
      <circle cx="20" cy="23" r="2.5" fill="white"/>
      <circle cx="28" cy="23" r="2.5" fill="white"/>
      <circle cx="20.5" cy="23.5" r="1.3" fill="#3b0764"/>
      <circle cx="28.5" cy="23.5" r="1.3" fill="#3b0764"/>
      <circle cx="20" cy="22.8" r="0.5" fill="white"/>
      <circle cx="28" cy="22.8" r="0.5" fill="white"/>
      {/* Smile */}
      <path d="M20 29 Q24 32 28 29" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Lightning bolt */}
      <path d="M26 9 L22 19 L25.5 19 L21 31 L31 17 L27.5 17 Z" fill="#fbbf24" filter="url(#jx-glow)"/>
      {/* Puzzle pieces */}
      <rect x="5" y="8" width="6" height="6" rx="1.5" fill="#34d399" opacity="0.9"/>
      <rect x="37" y="8" width="6" height="6" rx="1.5" fill="#60a5fa" opacity="0.9"/>
      <rect x="5" y="36" width="6" height="6" rx="1.5" fill="#f472b6" opacity="0.9"/>
    </svg>
  );
}

export function IconDudu({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="dd-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#f9a8d4"/>
          <stop offset="100%" stopColor="#be185d"/>
        </radialGradient>
        <filter id="dd-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#831843" floodOpacity="0.35"/>
        </filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#dd-bg)" filter="url(#dd-shadow)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.25"/>
      {/* Big block 10 (decena) */}
      <rect x="7" y="18" width="16" height="14" rx="3" fill="#3b82f6"/>
      <rect x="7" y="18" width="16" height="14" rx="3" stroke="#1d4ed8" strokeWidth="1"/>
      {/* Grid inside decena */}
      <line x1="12.3" y1="18" x2="12.3" y2="32" stroke="#93c5fd" strokeWidth="0.8"/>
      <line x1="17.7" y1="18" x2="17.7" y2="32" stroke="#93c5fd" strokeWidth="0.8"/>
      <line x1="7" y1="23" x2="23" y2="23" stroke="#93c5fd" strokeWidth="0.8"/>
      <line x1="7" y1="27" x2="23" y2="27" stroke="#93c5fd" strokeWidth="0.8"/>
      <text x="9.5" y="27.5" fontSize="7" fontWeight="900" fill="white" fontFamily="system-ui">10</text>
      {/* Minus sign */}
      <rect x="24.5" y="23.5" width="5" height="3" rx="1.5" fill="white"/>
      {/* Small block 1 (unidad) */}
      <rect x="31" y="20" width="10" height="10" rx="2.5" fill="#34d399"/>
      <rect x="31" y="20" width="10" height="10" rx="2.5" stroke="#059669" strokeWidth="1"/>
      <text x="33.5" y="28.5" fontSize="8" fontWeight="900" fill="white" fontFamily="system-ui">1</text>
      {/* Result */}
      <rect x="15" y="35" width="18" height="8" rx="2.5" fill="white" opacity="0.9"/>
      <text x="20" y="42" fontSize="7.5" fontWeight="900" fill="#be185d" fontFamily="system-ui">= 9</text>
      {/* Floating numbers */}
      <text x="5" y="13" fontSize="8" fontWeight="700" fill="#fde68a" opacity="0.9">7</text>
      <text x="38" y="12" fontSize="7" fontWeight="700" fill="#fde68a" opacity="0.9">5</text>
    </svg>
  );
}

export function IconChrono({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ch-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#22d3ee"/>
          <stop offset="100%" stopColor="#0e7490"/>
        </radialGradient>
        <linearGradient id="ch-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0fdff"/>
          <stop offset="100%" stopColor="#cffafe"/>
        </linearGradient>
        <filter id="ch-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#164e63" floodOpacity="0.4"/>
        </filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#ch-bg)" filter="url(#ch-shadow)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.25"/>
      {/* Alarm clock body */}
      <circle cx="24" cy="26" r="13" fill="url(#ch-face)" stroke="#0891b2" strokeWidth="1.5"/>
      {/* Bells */}
      <ellipse cx="14" cy="16" rx="3.5" ry="3" fill="#22d3ee" stroke="#0891b2" strokeWidth="1"/>
      <ellipse cx="34" cy="16" rx="3.5" ry="3" fill="#22d3ee" stroke="#0891b2" strokeWidth="1"/>
      {/* Bell hammers */}
      <line x1="14" y1="13.5" x2="14" y2="11" stroke="#0e7490" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="34" y1="13.5" x2="34" y2="11" stroke="#0e7490" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Hour markers */}
      <line x1="24" y1="14.5" x2="24" y2="16.5" stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="24" y1="35.5" x2="24" y2="37.5" stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="12.5" y1="26" x2="14.5" y2="26" stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="33.5" y1="26" x2="35.5" y2="26" stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Numbers */}
      <text x="22" y="18.5" fontSize="4.5" fontWeight="900" fill="#0e7490" fontFamily="system-ui">12</text>
      <text x="33" y="28" fontSize="4.5" fontWeight="900" fill="#0e7490" fontFamily="system-ui">3</text>
      <text x="22.5" y="37" fontSize="4.5" fontWeight="900" fill="#0e7490" fontFamily="system-ui">6</text>
      <text x="13" y="28" fontSize="4.5" fontWeight="900" fill="#0e7490" fontFamily="system-ui">9</text>
      {/* Hour hand */}
      <line x1="24" y1="26" x2="24" y2="20" stroke="#0e7490" strokeWidth="2" strokeLinecap="round"/>
      {/* Minute hand */}
      <line x1="24" y1="26" x2="30" y2="26" stroke="#0e7490" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Center dot */}
      <circle cx="24" cy="26" r="1.5" fill="#0e7490"/>
      {/* Sun */}
      <circle cx="40" cy="10" r="4" fill="#fbbf24"/>
      {[0,45,90,135,180,225,270,315].map(a => (
        <line key={a}
          x1={40 + 5*Math.cos(a*Math.PI/180)} y1={10 + 5*Math.sin(a*Math.PI/180)}
          x2={40 + 7*Math.cos(a*Math.PI/180)} y2={10 + 7*Math.sin(a*Math.PI/180)}
          stroke="#fbbf24" strokeWidth="1.2" strokeLinecap="round"/>
      ))}
      {/* Moon */}
      <path d="M8 38 C6 33 9 27 14 27 C11 30 10 34 12 38 Z" fill="#e0f2fe" opacity="0.9"/>
    </svg>
  );
}

export function IconGrammi({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gr-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#34d399"/>
          <stop offset="100%" stopColor="#065f46"/>
        </radialGradient>
        <filter id="gr-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#022c22" floodOpacity="0.4"/>
        </filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#gr-bg)" filter="url(#gr-shadow)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.25"/>
      {/* Speech bubble */}
      <rect x="9" y="15" width="30" height="20" rx="6" fill="white" opacity="0.95"/>
      <path d="M16 35 L14 42 L22 37" fill="white" opacity="0.95"/>
      {/* Letter circles */}
      <circle cx="17" cy="25" r="5.5" fill="#059669"/>
      <text x="14.5" y="28.5" fontSize="7.5" fontWeight="900" fill="white" fontFamily="system-ui">A</text>
      <circle cx="28" cy="25" r="4.5" fill="#fbbf24"/>
      <text x="25.8" y="28.5" fontSize="7" fontWeight="900" fill="white" fontFamily="system-ui">!</text>
      <circle cx="37" cy="21" r="3.5" fill="#818cf8"/>
      <text x="35.2" y="24" fontSize="5.5" fontWeight="900" fill="white" fontFamily="system-ui">?</text>
      {/* Crown */}
      <path d="M14 13 L17 17 L21 14 L24 17 L28 14 L31 17 L34 13 L34 18 L14 18 Z" fill="#fbbf24"/>
      <circle cx="14" cy="13" r="1.5" fill="#fbbf24"/>
      <circle cx="24" cy="12" r="1.8" fill="#fbbf24"/>
      <circle cx="34" cy="13" r="1.5" fill="#fbbf24"/>
      <circle cx="19" cy="15.5" r="1" fill="#ef4444"/>
      <circle cx="24" cy="14.5" r="1" fill="#3b82f6"/>
      <circle cx="29" cy="15.5" r="1" fill="#22c55e"/>
    </svg>
  );
}

export function IconMetri({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mt-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fcd34d"/>
          <stop offset="100%" stopColor="#b45309"/>
        </radialGradient>
        <filter id="mt-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#78350f" floodOpacity="0.4"/>
        </filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#mt-bg)" filter="url(#mt-shadow)"/>
      <ellipse cx="20" cy="13" rx="10" ry="6" fill="white" opacity="0.25"/>
      {/* Ruler */}
      <rect x="7" y="20" width="34" height="9" rx="2" fill="white" opacity="0.95"/>
      <rect x="7" y="20" width="34" height="9" rx="2" stroke="#d97706" strokeWidth="1"/>
      {/* Ruler marks */}
      {[0,1,2,3,4,5,6].map(i => (
        <line key={i} x1={10 + i*4.6} y1="20" x2={10 + i*4.6} y2={i%2===0 ? 26 : 24} stroke="#b45309" strokeWidth="0.8"/>
      ))}
      <text x="8" y="28.5" fontSize="3.5" fill="#b45309" fontFamily="system-ui">0</text>
      <text x="17" y="28.5" fontSize="3.5" fill="#b45309" fontFamily="system-ui">5</text>
      <text x="27" y="28.5" fontSize="3.5" fill="#b45309" fontFamily="system-ui">10</text>
      {/* Test tube */}
      <rect x="36" y="10" width="6" height="16" rx="3" fill="#a7f3d0" stroke="#059669" strokeWidth="1" transform="rotate(15, 39, 18)"/>
      <rect x="36" y="18" width="6" height="8" rx="3" fill="#34d399" opacity="0.8" transform="rotate(15, 39, 22)"/>
      <circle cx="39" cy="13" r="1" fill="#6ee7b7" opacity="0.6" transform="rotate(15, 39, 13)"/>
      <circle cx="38" cy="15.5" r="0.7" fill="#6ee7b7" opacity="0.6" transform="rotate(15, 38, 15)"/>
      {/* Tape measure */}
      <circle cx="12" cy="38" r="7" fill="#fb923c" stroke="#ea580c" strokeWidth="1"/>
      <circle cx="12" cy="38" r="4" fill="#fed7aa"/>
      <circle cx="12" cy="38" r="1.5" fill="#ea580c"/>
      {/* Tape strip */}
      <path d="M18 35 C22 30 30 28 38 30" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M18 35 C22 30 30 28 38 30" stroke="#ea580c" strokeWidth="1" strokeDasharray="2 1.5" fill="none" strokeLinecap="round"/>
      {/* Measurement arrow */}
      <line x1="9" y1="17" x2="26" y2="17" stroke="white" strokeWidth="1" strokeDasharray="2 1"/>
      <path d="M8 17 L10 15.5 L10 18.5 Z" fill="white"/>
      <path d="M27 17 L25 15.5 L25 18.5 Z" fill="white"/>
    </svg>
  );
}

// ─── Legacy / shared icons (kept for other uses) ───────────────────────────

export function IconMath({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="14" fill="#f59e0b" fillOpacity=".15"/>
      <rect x="7" y="22" width="14" height="4" rx="2" fill="#f59e0b"/>
      <rect x="12" y="17" width="4" height="14" rx="2" fill="#f59e0b"/>
      <rect x="27" y="20" width="14" height="3.5" rx="1.75" fill="#ef4444"/>
      <rect x="27" y="26" width="14" height="3.5" rx="1.75" fill="#ef4444"/>
      <circle cx="10" cy="10" r="2" fill="#fbbf24" opacity=".6"/>
      <circle cx="38" cy="38" r="2" fill="#fbbf24" opacity=".6"/>
    </svg>
  );
}

export function IconLangues({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="14" fill="#06b6d4" fillOpacity=".15"/>
      <rect x="5" y="8" width="28" height="22" rx="8" fill="#06b6d4" opacity=".9"/>
      <path d="M10 30 L8 38 L18 32" fill="#06b6d4" opacity=".9"/>
      <text x="12" y="24" fontSize="11" fontWeight="900" fill="white" fontFamily="system-ui">ABC</text>
      <rect x="18" y="24" width="24" height="16" rx="6" fill="#0891b2" opacity=".8"/>
      <path d="M40 40 L44 46 L36 42" fill="#0891b2" opacity=".8"/>
      <text x="22" y="36" fontSize="9" fontWeight="900" fill="white" fontFamily="system-ui">abc</text>
    </svg>
  );
}

export function IconStar({ size = 20, color = '#fbbf24' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2 L12 8 L18 8 L13 12 L15 18 L10 14 L5 18 L7 12 L2 8 L8 8 Z" fill={color}/>
    </svg>
  );
}

export function IconCheck({ size = 20, color = '#22c55e' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="9" fill={color} fillOpacity=".15" stroke={color} strokeWidth="1.5"/>
      <path d="M6 10 L9 13 L14 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function MascotLena({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="62" rx="16" ry="12" fill="#6366f1" opacity=".9"/>
      <path d="M28 58 Q40 70 52 58 L52 62 Q40 74 28 62 Z" fill="#8b5cf6" opacity=".6"/>
      <ellipse cx="22" cy="58" rx="6" ry="4" fill="#fcd5b5" transform="rotate(-20 22 58)"/>
      <ellipse cx="58" cy="58" rx="6" ry="4" fill="#fcd5b5" transform="rotate(20 58 58)"/>
      <rect x="28" y="54" width="24" height="16" rx="3" fill="#f59e0b"/>
      <rect x="39" y="54" width="2" height="16" fill="#b45309"/>
      <rect x="30" y="57" width="7" height="1.5" rx=".75" fill="#b45309" opacity=".5"/>
      <rect x="30" y="61" width="7" height="1.5" rx=".75" fill="#b45309" opacity=".5"/>
      <rect x="43" y="57" width="7" height="1.5" rx=".75" fill="#92400e" opacity=".5"/>
      <rect x="43" y="61" width="7" height="1.5" rx=".75" fill="#92400e" opacity=".5"/>
      <circle cx="40" cy="34" r="16" fill="#fcd5b5"/>
      <path d="M24 34 C24 20 56 20 56 34 C56 28 52 22 40 22 C28 22 24 28 24 34Z" fill="#92400e"/>
      <ellipse cx="24" cy="36" rx="3.5" ry="6" fill="#92400e"/>
      <ellipse cx="56" cy="36" rx="3.5" ry="6" fill="#92400e"/>
      <ellipse cx="22" cy="42" rx="3" ry="5" fill="#92400e" transform="rotate(-15 22 42)"/>
      <ellipse cx="58" cy="42" rx="3" ry="5" fill="#92400e" transform="rotate(15 58 42)"/>
      <path d="M18 37 L22 40 L18 43 Z" fill="#ef4444"/>
      <path d="M26 37 L22 40 L26 43 Z" fill="#ef4444"/>
      <path d="M54 37 L58 40 L54 43 Z" fill="#ef4444"/>
      <path d="M62 37 L58 40 L62 43 Z" fill="#ef4444"/>
      <circle cx="22" cy="40" r="2" fill="#ef4444"/>
      <circle cx="58" cy="40" r="2" fill="#ef4444"/>
      <circle cx="35" cy="33" r="3.5" fill="white"/>
      <circle cx="45" cy="33" r="3.5" fill="white"/>
      <circle cx="35.5" cy="33.5" r="2" fill="#1a1a2e"/>
      <circle cx="45.5" cy="33.5" r="2" fill="#1a1a2e"/>
      <circle cx="36" cy="32.5" r=".8" fill="white"/>
      <circle cx="46" cy="32.5" r=".8" fill="white"/>
      <path d="M35 39 Q40 43 45 39" stroke="#c2410c" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <circle cx="31" cy="37" r="3" fill="#f9a8d4" opacity=".5"/>
      <circle cx="49" cy="37" r="3" fill="#f9a8d4" opacity=".5"/>
      <text x="5" y="18" fontSize="8" fill="#fbbf24">✦</text>
      <text x="65" y="18" fontSize="10" fill="#fbbf24">★</text>
      <text x="8" y="52" fontSize="7" fill="#c4b5fd">✨</text>
      <text x="64" y="52" fontSize="7" fill="#c4b5fd">✨</text>
    </svg>
  );
}
