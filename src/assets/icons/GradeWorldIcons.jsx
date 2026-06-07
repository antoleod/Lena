// Grade World SVG Icons for Lena app
// viewBox="0 0 56 56", radial gradient background, drop shadow, highlight
// Each component uses unique gradient/filter ID prefixes to avoid collisions

// ─── Naturaleza / Plantas ─────────────────────────────────────────────────

export function IconWorldSeed({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-sd-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#86efac"/>
          <stop offset="100%" stopColor="#15803d"/>
        </radialGradient>
        <filter id="gw-sd-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-sd-bg)" filter="url(#gw-sd-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* soil mound */}
      <ellipse cx="28" cy="42" rx="14" ry="5" fill="#92400e" opacity="0.7"/>
      <ellipse cx="28" cy="40" rx="12" ry="4" fill="#b45309" opacity="0.85"/>
      {/* stem */}
      <rect x="26.5" y="24" width="3" height="17" rx="1.5" fill="#16a34a"/>
      {/* left leaf */}
      <ellipse cx="20" cy="30" rx="7" ry="4" fill="#4ade80" transform="rotate(-30 20 30)"/>
      <line x1="20" y1="30" x2="27" y2="33" stroke="#15803d" strokeWidth="1.2"/>
      {/* right leaf */}
      <ellipse cx="36" cy="27" rx="7" ry="4" fill="#86efac" transform="rotate(25 36 27)"/>
      <line x1="36" y1="27" x2="29" y2="30" stroke="#15803d" strokeWidth="1.2"/>
      {/* sprout tip */}
      <ellipse cx="28" cy="22" rx="4" ry="5" fill="#22c55e"/>
      <ellipse cx="28" cy="20" rx="2.5" ry="3" fill="#4ade80"/>
    </svg>
  );
}

export function IconWorldFlower({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-fl-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fbcfe8"/>
          <stop offset="100%" stopColor="#be185d"/>
        </radialGradient>
        <filter id="gw-fl-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-fl-bg)" filter="url(#gw-fl-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* petals */}
      <ellipse cx="28" cy="17" rx="5" ry="8" fill="#f9a8d4"/>
      <ellipse cx="28" cy="39" rx="5" ry="8" fill="#f9a8d4"/>
      <ellipse cx="17" cy="28" rx="8" ry="5" fill="#f472b6"/>
      <ellipse cx="39" cy="28" rx="8" ry="5" fill="#f472b6"/>
      <ellipse cx="20" cy="20" rx="5" ry="8" fill="#f9a8d4" transform="rotate(-45 20 20)"/>
      <ellipse cx="36" cy="20" rx="5" ry="8" fill="#fda4af" transform="rotate(45 36 20)"/>
      <ellipse cx="20" cy="36" rx="5" ry="8" fill="#fda4af" transform="rotate(45 20 36)"/>
      <ellipse cx="36" cy="36" rx="5" ry="8" fill="#f9a8d4" transform="rotate(-45 36 36)"/>
      {/* center */}
      <circle cx="28" cy="28" r="7" fill="#fde047"/>
      <circle cx="28" cy="28" r="4.5" fill="#facc15"/>
      <circle cx="26" cy="26.5" r="1.5" fill="#fbbf24" opacity="0.7"/>
    </svg>
  );
}

export function IconWorldClover({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-cl-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#bbf7d0"/>
          <stop offset="100%" stopColor="#166534"/>
        </radialGradient>
        <filter id="gw-cl-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-cl-bg)" filter="url(#gw-cl-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* stem */}
      <path d="M28 36 Q24 42 22 46" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* four leaves */}
      <circle cx="28" cy="22" r="8" fill="#4ade80"/>
      <circle cx="22" cy="28" r="8" fill="#22c55e"/>
      <circle cx="34" cy="28" r="8" fill="#4ade80"/>
      <circle cx="28" cy="34" r="8" fill="#22c55e"/>
      {/* vein lines */}
      <line x1="28" y1="22" x2="28" y2="16" stroke="#16a34a" strokeWidth="1" opacity="0.6"/>
      <line x1="22" y1="28" x2="16" y2="28" stroke="#16a34a" strokeWidth="1" opacity="0.6"/>
      <line x1="34" y1="28" x2="40" y2="28" stroke="#16a34a" strokeWidth="1" opacity="0.6"/>
      <line x1="28" y1="34" x2="28" y2="40" stroke="#16a34a" strokeWidth="1" opacity="0.6"/>
      {/* center */}
      <circle cx="28" cy="28" r="4" fill="#86efac"/>
      {/* lucky sparkle */}
      <circle cx="40" cy="14" r="2.5" fill="#fde047" opacity="0.9"/>
      <text x="38.2" y="17.5" fontSize="5" fill="#15803d" fontFamily="system-ui" fontWeight="900">✦</text>
    </svg>
  );
}

export function IconWorldLeaf({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-lf-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#a7f3d0"/>
          <stop offset="100%" stopColor="#065f46"/>
        </radialGradient>
        <filter id="gw-lf-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-lf-bg)" filter="url(#gw-lf-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* branch */}
      <path d="M16 44 Q22 32 32 18" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* large leaf */}
      <path d="M32 18 Q50 20 44 36 Q36 44 24 38 Q18 30 32 18Z" fill="#34d399"/>
      <path d="M32 18 Q38 28 34 37" stroke="#059669" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* left veins */}
      <path d="M34 26 Q28 28 26 32" stroke="#059669" strokeWidth="1" fill="none" opacity="0.7"/>
      <path d="M36 31 Q30 32 28 36" stroke="#059669" strokeWidth="1" fill="none" opacity="0.7"/>
      {/* small leaf */}
      <path d="M22 36 Q30 32 28 44 Q22 46 18 40 Q18 34 22 36Z" fill="#6ee7b7"/>
    </svg>
  );
}

export function IconWorldPalm({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-pm-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fde68a"/>
          <stop offset="100%" stopColor="#b45309"/>
        </radialGradient>
        <filter id="gw-pm-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-pm-bg)" filter="url(#gw-pm-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* trunk */}
      <path d="M28 48 Q26 38 27 26" stroke="#92400e" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M27 26 Q29 16 30 12" stroke="#a16207" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      {/* coconuts */}
      <circle cx="30" cy="20" r="3" fill="#92400e"/>
      <circle cx="26" cy="18" r="2.5" fill="#78350f"/>
      {/* fronds */}
      <path d="M30 14 Q18 10 12 18" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M30 14 Q28 6 38 8" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M30 14 Q42 12 44 22" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M30 14 Q20 18 16 28" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M30 14 Q36 20 40 30" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* ground */}
      <ellipse cx="28" cy="48" rx="10" ry="3" fill="#ca8a04" opacity="0.5"/>
    </svg>
  );
}

export function IconWorldHibiscus({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-hb-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fca5a5"/>
          <stop offset="100%" stopColor="#991b1b"/>
        </radialGradient>
        <filter id="gw-hb-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-hb-bg)" filter="url(#gw-hb-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* 5 petals */}
      <ellipse cx="28" cy="16" rx="6" ry="11" fill="#f87171"/>
      <ellipse cx="28" cy="40" rx="6" ry="11" fill="#ef4444"/>
      <ellipse cx="16" cy="28" rx="11" ry="6" fill="#f87171"/>
      <ellipse cx="40" cy="28" rx="11" ry="6" fill="#ef4444"/>
      <ellipse cx="18" cy="18" rx="6" ry="11" fill="#fca5a5" transform="rotate(-45 18 18)"/>
      <ellipse cx="38" cy="18" rx="6" ry="11" fill="#fca5a5" transform="rotate(45 38 18)"/>
      <ellipse cx="18" cy="38" rx="6" ry="11" fill="#fca5a5" transform="rotate(45 18 38)"/>
      <ellipse cx="38" cy="38" rx="6" ry="11" fill="#fca5a5" transform="rotate(-45 38 38)"/>
      {/* stamen */}
      <circle cx="28" cy="28" r="6" fill="#fde047"/>
      <line x1="28" y1="14" x2="28" y2="22" stroke="#dc2626" strokeWidth="2"/>
      <circle cx="28" cy="13" r="2.5" fill="#fbbf24"/>
    </svg>
  );
}

// ─── Elementos / Energía ──────────────────────────────────────────────────

export function IconWorldFire({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-fr-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fed7aa"/>
          <stop offset="100%" stopColor="#9a3412"/>
        </radialGradient>
        <filter id="gw-fr-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-fr-bg)" filter="url(#gw-fr-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* outer flame */}
      <path d="M28 10 C22 18 14 22 16 32 C18 42 24 46 28 46 C32 46 38 42 40 32 C42 22 34 18 28 10Z" fill="#f97316"/>
      {/* mid flame */}
      <path d="M28 16 C24 22 18 26 20 33 C22 40 25 43 28 43 C31 43 34 40 36 33 C38 26 32 22 28 16Z" fill="#fbbf24"/>
      {/* inner flame */}
      <path d="M28 22 C26 26 22 29 24 34 C25 38 27 40 28 40 C29 40 31 38 32 34 C34 29 30 26 28 22Z" fill="#fde047"/>
      {/* core glow */}
      <ellipse cx="28" cy="36" rx="4" ry="5" fill="#fff7ed" opacity="0.8"/>
    </svg>
  );
}

export function IconWorldLightning({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-lt-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fef08a"/>
          <stop offset="100%" stopColor="#713f12"/>
        </radialGradient>
        <filter id="gw-lt-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-lt-bg)" filter="url(#gw-lt-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* bolt shadow */}
      <path d="M32 10 L20 29 L27 29 L24 46 L38 23 L30 23 Z" fill="#92400e" opacity="0.3" transform="translate(1.5 1.5)"/>
      {/* bolt */}
      <path d="M32 10 L20 29 L27 29 L24 46 L38 23 L30 23 Z" fill="#facc15"/>
      {/* highlight */}
      <path d="M32 10 L24 27 L30 27 L27 38 L36 22 L29 22 Z" fill="#fde047" opacity="0.6"/>
      {/* glow dots */}
      <circle cx="14" cy="18" r="2.5" fill="#fde047" opacity="0.7"/>
      <circle cx="42" cy="38" r="2" fill="#fde047" opacity="0.6"/>
    </svg>
  );
}

export function IconWorldWave({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-wv-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#bae6fd"/>
          <stop offset="100%" stopColor="#0369a1"/>
        </radialGradient>
        <filter id="gw-wv-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-wv-bg)" filter="url(#gw-wv-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* back wave */}
      <path d="M6 30 Q13 22 20 30 Q27 38 34 30 Q41 22 50 30 L50 48 L6 48Z" fill="#0ea5e9" opacity="0.5"/>
      {/* main wave */}
      <path d="M4 26 Q11 16 20 26 Q29 36 36 22 Q42 14 52 22" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6"/>
      <path d="M4 26 Q11 16 20 26 Q29 36 36 22 Q42 14 52 22" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" fill="none"/>
      {/* crest foam */}
      <ellipse cx="20" cy="26" rx="5" ry="3" fill="white" opacity="0.7" transform="rotate(-10 20 26)"/>
      <ellipse cx="36" cy="22" rx="4" ry="2.5" fill="white" opacity="0.7" transform="rotate(10 36 22)"/>
      {/* water surface */}
      <path d="M4 34 Q14 30 24 34 Q34 38 50 34 L50 50 L4 50Z" fill="#0284c7" opacity="0.6"/>
    </svg>
  );
}

export function IconWorldDrop({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-dp-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#e0f2fe"/>
          <stop offset="100%" stopColor="#0c4a6e"/>
        </radialGradient>
        <filter id="gw-dp-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-dp-bg)" filter="url(#gw-dp-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* drop shadow */}
      <path d="M28 10 C28 10 14 26 14 34 C14 42 20 48 28 48 C36 48 42 42 42 34 C42 26 28 10 28 10Z" fill="#0369a1" opacity="0.25" transform="translate(1 2)"/>
      {/* drop body */}
      <path d="M28 10 C28 10 14 26 14 34 C14 42 20 48 28 48 C36 48 42 42 42 34 C42 26 28 10 28 10Z" fill="#38bdf8"/>
      {/* inner gradient */}
      <path d="M28 14 C28 14 17 27 17 34 C17 40 22 45 28 45 C34 45 39 40 39 34 C39 27 28 14 28 14Z" fill="#7dd3fc"/>
      {/* highlight */}
      <ellipse cx="22" cy="28" rx="4" ry="7" fill="white" opacity="0.35" transform="rotate(-20 22 28)"/>
      <ellipse cx="20" cy="24" rx="2" ry="3" fill="white" opacity="0.5" transform="rotate(-20 20 24)"/>
    </svg>
  );
}

export function IconWorldGlobe({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-gb-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#bfdbfe"/>
          <stop offset="100%" stopColor="#1e3a8a"/>
        </radialGradient>
        <filter id="gw-gb-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-gb-bg)" filter="url(#gw-gb-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* globe ocean */}
      <circle cx="28" cy="28" r="18" fill="#3b82f6"/>
      {/* continents */}
      <path d="M18 20 Q22 16 28 18 Q32 22 30 28 Q26 32 22 30 Q16 26 18 20Z" fill="#22c55e"/>
      <path d="M30 30 Q36 26 40 30 Q42 36 38 40 Q34 42 30 38 Q28 34 30 30Z" fill="#16a34a"/>
      <path d="M20 34 Q24 32 26 36 Q24 40 20 40 Q16 38 16 34 Q18 32 20 34Z" fill="#4ade80"/>
      {/* latitude lines */}
      <ellipse cx="28" cy="28" rx="18" ry="8" fill="none" stroke="white" strokeWidth="0.8" opacity="0.3"/>
      <line x1="10" y1="28" x2="46" y2="28" stroke="white" strokeWidth="0.8" opacity="0.3"/>
      <ellipse cx="28" cy="28" rx="8" ry="18" fill="none" stroke="white" strokeWidth="0.8" opacity="0.3"/>
      {/* shine */}
      <circle cx="22" cy="20" r="5" fill="white" opacity="0.2"/>
    </svg>
  );
}

export function IconWorldGalaxy({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-gx-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#c4b5fd"/>
          <stop offset="100%" stopColor="#1e1b4b"/>
        </radialGradient>
        <filter id="gw-gx-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-gx-bg)" filter="url(#gw-gx-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* nebula clouds */}
      <ellipse cx="28" cy="28" rx="16" ry="8" fill="#7c3aed" opacity="0.4" transform="rotate(-30 28 28)"/>
      <ellipse cx="28" cy="28" rx="12" ry="6" fill="#8b5cf6" opacity="0.5" transform="rotate(20 28 28)"/>
      {/* spiral arms */}
      <path d="M28 28 Q36 20 42 16 Q44 22 38 28 Q44 34 40 40 Q34 36 28 28Z" fill="#a78bfa" opacity="0.6"/>
      <path d="M28 28 Q20 36 14 40 Q12 34 18 28 Q12 22 16 16 Q22 20 28 28Z" fill="#c4b5fd" opacity="0.6"/>
      {/* center core */}
      <circle cx="28" cy="28" r="5" fill="#fde047" opacity="0.9"/>
      <circle cx="28" cy="28" r="3" fill="white" opacity="0.8"/>
      {/* stars */}
      <circle cx="14" cy="16" r="1.5" fill="white" opacity="0.9"/>
      <circle cx="42" cy="12" r="1" fill="white" opacity="0.8"/>
      <circle cx="44" cy="38" r="1.5" fill="#e9d5ff" opacity="0.9"/>
      <circle cx="12" cy="40" r="1" fill="white" opacity="0.7"/>
      <circle cx="38" cy="44" r="1.2" fill="#c4b5fd" opacity="0.8"/>
    </svg>
  );
}

export function IconWorldMoon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-mn-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#1e1b4b"/>
          <stop offset="100%" stopColor="#0f172a"/>
        </radialGradient>
        <filter id="gw-mn-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-mn-bg)" filter="url(#gw-mn-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.1"/>
      {/* stars */}
      <circle cx="12" cy="14" r="1.5" fill="#fde047" opacity="0.9"/>
      <circle cx="44" cy="12" r="1" fill="white" opacity="0.8"/>
      <circle cx="40" cy="42" r="1.5" fill="#e9d5ff" opacity="0.8"/>
      <circle cx="14" cy="40" r="1" fill="white" opacity="0.7"/>
      <circle cx="46" cy="28" r="1.2" fill="#c4b5fd" opacity="0.8"/>
      <circle cx="18" cy="48" r="1" fill="white" opacity="0.6"/>
      {/* crescent body */}
      <circle cx="30" cy="28" r="16" fill="#fde047"/>
      {/* shadow disc for crescent */}
      <circle cx="38" cy="24" r="14" fill="#1e1b4b"/>
      {/* moon highlights */}
      <circle cx="22" cy="24" r="3" fill="#fef08a" opacity="0.4"/>
      <circle cx="20" cy="32" r="2" fill="#fef08a" opacity="0.3"/>
      {/* craters */}
      <circle cx="24" cy="30" r="2.5" fill="#d97706" opacity="0.4"/>
      <circle cx="18" cy="38" r="1.8" fill="#92400e" opacity="0.3"/>
    </svg>
  );
}

// ─── Objetos / Símbolos ───────────────────────────────────────────────────

export function IconWorldCrystal({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-cr-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#bae6fd"/>
          <stop offset="100%" stopColor="#075985"/>
        </radialGradient>
        <filter id="gw-cr-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-cr-bg)" filter="url(#gw-cr-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* diamond shape */}
      <polygon points="28,10 44,28 28,46 12,28" fill="#38bdf8"/>
      <polygon points="28,10 44,28 28,28" fill="#7dd3fc"/>
      <polygon points="28,10 12,28 28,28" fill="#0ea5e9"/>
      <polygon points="28,46 44,28 28,28" fill="#0284c7"/>
      <polygon points="28,46 12,28 28,28" fill="#0369a1"/>
      {/* facet highlights */}
      <polygon points="28,10 36,28 28,22" fill="white" opacity="0.4"/>
      <polygon points="28,10 20,28 28,22" fill="white" opacity="0.2"/>
      {/* sparkle */}
      <circle cx="34" cy="16" r="2" fill="white" opacity="0.9"/>
      <circle cx="14" cy="24" r="1.5" fill="#bae6fd" opacity="0.8"/>
    </svg>
  );
}

export function IconWorldCrown({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-cw-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fde68a"/>
          <stop offset="100%" stopColor="#92400e"/>
        </radialGradient>
        <filter id="gw-cw-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-cw-bg)" filter="url(#gw-cw-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* crown band */}
      <rect x="10" y="34" width="36" height="10" rx="3" fill="#d97706"/>
      <rect x="10" y="34" width="36" height="5" rx="2" fill="#f59e0b"/>
      {/* crown points */}
      <polygon points="10,34 10,18 18,26" fill="#fbbf24"/>
      <polygon points="28,34 20,16 36,16" fill="#fcd34d"/>
      <polygon points="46,34 46,18 38,26" fill="#fbbf24"/>
      {/* gems */}
      <circle cx="28" cy="20" r="4" fill="#f87171"/>
      <circle cx="14" cy="28" r="3" fill="#34d399"/>
      <circle cx="42" cy="28" r="3" fill="#60a5fa"/>
      {/* jewel shines */}
      <circle cx="27" cy="19" r="1.5" fill="white" opacity="0.6"/>
      {/* band decoration */}
      <circle cx="28" cy="38" r="2.5" fill="#fde047"/>
      <circle cx="20" cy="38" r="2" fill="#fde047"/>
      <circle cx="36" cy="38" r="2" fill="#fde047"/>
    </svg>
  );
}

export function IconWorldStar({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-st-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fef9c3"/>
          <stop offset="100%" stopColor="#854d0e"/>
        </radialGradient>
        <filter id="gw-st-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-st-bg)" filter="url(#gw-st-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* glow */}
      <circle cx="28" cy="28" r="16" fill="#fde047" opacity="0.3"/>
      {/* 5-point star */}
      <polygon points="28,10 31.8,21.2 44,21.2 34.1,27.8 37.9,39 28,32.4 18.1,39 21.9,27.8 12,21.2 24.2,21.2" fill="#facc15"/>
      {/* inner star highlight */}
      <polygon points="28,14 30.8,22.2 40,22.2 32.6,27 35.4,35 28,30 20.6,35 23.4,27 16,22.2 25.2,22.2" fill="#fde047"/>
      {/* sparkles */}
      <circle cx="42" cy="14" r="2.5" fill="#fde047" opacity="0.9"/>
      <circle cx="14" cy="42" r="2" fill="#fde047" opacity="0.7"/>
      <circle cx="44" cy="40" r="1.5" fill="white" opacity="0.8"/>
      {/* shine */}
      <ellipse cx="24" cy="20" rx="4" ry="2.5" fill="white" opacity="0.3" transform="rotate(-30 24 20)"/>
    </svg>
  );
}

export function IconWorldShell({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-sh-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fed7aa"/>
          <stop offset="100%" stopColor="#0c4a6e"/>
        </radialGradient>
        <filter id="gw-sh-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-sh-bg)" filter="url(#gw-sh-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* shell body */}
      <path d="M28 12 C16 12 10 20 10 28 C10 38 18 46 28 46 C38 46 46 38 46 28 C46 16 38 12 28 12Z" fill="#fdba74"/>
      {/* spiral ridges */}
      <path d="M28 18 C20 18 16 22 16 28 C16 34 22 40 28 40" stroke="#c2410c" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M28 22 C22 22 20 26 20 28 C20 32 24 36 28 36" stroke="#ea580c" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M28 26 C25 26 24 27 24 28 C24 30 26 32 28 32" stroke="#f97316" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* center */}
      <circle cx="28" cy="28" r="3" fill="#fb923c"/>
      {/* outer ridges */}
      <path d="M28 12 Q36 14 42 20" stroke="#fed7aa" strokeWidth="2" fill="none" opacity="0.6"/>
      <path d="M42 20 Q46 24 46 30" stroke="#fed7aa" strokeWidth="2" fill="none" opacity="0.6"/>
      {/* highlight */}
      <ellipse cx="20" cy="20" rx="5" ry="3" fill="white" opacity="0.25" transform="rotate(-30 20 20)"/>
    </svg>
  );
}

export function IconWorldBook({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-bk-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ddd6fe"/>
          <stop offset="100%" stopColor="#4c1d95"/>
        </radialGradient>
        <filter id="gw-bk-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-bk-bg)" filter="url(#gw-bk-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* left page */}
      <rect x="10" y="14" width="18" height="28" rx="2" fill="#fef3c7"/>
      {/* right page */}
      <rect x="28" y="14" width="18" height="28" rx="2" fill="white"/>
      {/* spine */}
      <rect x="26" y="14" width="4" height="28" rx="1" fill="#7c3aed"/>
      {/* left lines */}
      <line x1="13" y1="22" x2="25" y2="22" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="13" y1="27" x2="25" y2="27" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="13" y1="32" x2="25" y2="32" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="13" y1="37" x2="25" y2="37" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round"/>
      {/* right lines */}
      <line x1="31" y1="22" x2="43" y2="22" stroke="#6d28d9" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="31" y1="27" x2="43" y2="27" stroke="#6d28d9" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="31" y1="32" x2="43" y2="32" stroke="#6d28d9" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="31" y1="37" x2="43" y2="37" stroke="#6d28d9" strokeWidth="1.2" strokeLinecap="round"/>
      {/* bookmark */}
      <polygon points="42,14 46,14 46,24 44,22 42,24" fill="#f87171"/>
    </svg>
  );
}

export function IconWorldScroll({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-sc-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fde68a"/>
          <stop offset="100%" stopColor="#78350f"/>
        </radialGradient>
        <filter id="gw-sc-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-sc-bg)" filter="url(#gw-sc-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* scroll body */}
      <rect x="12" y="16" width="32" height="26" rx="3" fill="#fef3c7"/>
      {/* top roll */}
      <ellipse cx="28" cy="16" rx="16" ry="5" fill="#fde68a"/>
      <ellipse cx="28" cy="16" rx="12" ry="3" fill="#fef9c3"/>
      {/* bottom roll */}
      <ellipse cx="28" cy="42" rx="16" ry="5" fill="#fde68a"/>
      <ellipse cx="28" cy="42" rx="12" ry="3" fill="#fef9c3"/>
      {/* text lines */}
      <line x1="17" y1="24" x2="39" y2="24" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="17" y1="29" x2="39" y2="29" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="17" y1="34" x2="33" y2="34" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round"/>
      {/* decorative seal */}
      <circle cx="36" cy="34" r="4" fill="#dc2626"/>
      <circle cx="36" cy="34" r="2.5" fill="#ef4444"/>
    </svg>
  );
}

export function IconWorldCrystalBall({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-cb-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#e9d5ff"/>
          <stop offset="100%" stopColor="#4c1d95"/>
        </radialGradient>
        <radialGradient id="gw-cb-ball" cx="38%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ddd6fe"/>
          <stop offset="50%" stopColor="#8b5cf6"/>
          <stop offset="100%" stopColor="#4c1d95"/>
        </radialGradient>
        <filter id="gw-cb-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-cb-bg)" filter="url(#gw-cb-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* stand */}
      <ellipse cx="28" cy="46" rx="10" ry="3" fill="#6d28d9"/>
      <rect x="24" y="40" width="8" height="7" rx="2" fill="#7c3aed"/>
      {/* ball */}
      <circle cx="28" cy="26" r="16" fill="url(#gw-cb-ball)"/>
      {/* inner glow swirls */}
      <path d="M18 22 Q24 16 32 22 Q38 28 30 34" stroke="#c4b5fd" strokeWidth="2" fill="none" opacity="0.7" strokeLinecap="round"/>
      <path d="M22 28 Q28 22 34 28" stroke="#ddd6fe" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round"/>
      {/* stars inside */}
      <circle cx="22" cy="30" r="1.5" fill="#fde047" opacity="0.9"/>
      <circle cx="34" cy="20" r="1" fill="#fde047" opacity="0.8"/>
      {/* specular highlights */}
      <ellipse cx="22" cy="18" rx="5" ry="3" fill="white" opacity="0.4" transform="rotate(-20 22 18)"/>
      <circle cx="20" cy="16" r="2" fill="white" opacity="0.5"/>
    </svg>
  );
}

export function IconWorldTrophy({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-tr-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fef08a"/>
          <stop offset="100%" stopColor="#713f12"/>
        </radialGradient>
        <filter id="gw-tr-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-tr-bg)" filter="url(#gw-tr-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* base */}
      <rect x="18" y="44" width="20" height="4" rx="2" fill="#d97706"/>
      <rect x="22" y="40" width="12" height="5" rx="1.5" fill="#b45309"/>
      {/* stem */}
      <rect x="25" y="34" width="6" height="7" rx="1.5" fill="#ca8a04"/>
      {/* cup */}
      <path d="M14 16 Q14 36 28 36 Q42 36 42 16Z" fill="#facc15"/>
      <path d="M14 16 Q14 34 28 34 Q42 34 42 16Z" fill="#fde047"/>
      {/* handles */}
      <path d="M14 18 Q8 18 8 24 Q8 30 14 30" stroke="#d97706" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M42 18 Q48 18 48 24 Q48 30 42 30" stroke="#d97706" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {/* star on cup */}
      <polygon points="28,20 29.8,25.5 36,25.5 31,28.5 32.8,34 28,31 23.2,34 25,28.5 20,25.5 26.2,25.5" fill="#f59e0b"/>
      {/* shine */}
      <ellipse cx="22" cy="20" rx="4" ry="2" fill="white" opacity="0.35" transform="rotate(-20 22 20)"/>
    </svg>
  );
}

export function IconWorldFlask({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-fk-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#a7f3d0"/>
          <stop offset="100%" stopColor="#064e3b"/>
        </radialGradient>
        <filter id="gw-fk-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-fk-bg)" filter="url(#gw-fk-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* flask neck */}
      <rect x="22" y="10" width="12" height="14" rx="3" fill="#d1fae5"/>
      <rect x="24" y="10" width="8" height="14" rx="2" fill="#ecfdf5"/>
      {/* neck cap */}
      <rect x="20" y="10" width="16" height="4" rx="2" fill="#059669"/>
      {/* flask body */}
      <path d="M20 24 L12 44 Q12 48 28 48 Q44 48 44 44 L36 24Z" fill="#34d399"/>
      <path d="M22 24 L14 43 Q14 46 28 46 Q42 46 42 43 L34 24Z" fill="#6ee7b7"/>
      {/* liquid */}
      <path d="M14 38 Q18 34 28 36 Q38 38 42 34 L42 44 Q42 47 28 47 Q14 47 14 44Z" fill="#10b981"/>
      {/* bubbles */}
      <circle cx="22" cy="40" r="2.5" fill="#a7f3d0" opacity="0.8"/>
      <circle cx="30" cy="38" r="2" fill="#a7f3d0" opacity="0.7"/>
      <circle cx="36" cy="42" r="1.5" fill="#d1fae5" opacity="0.8"/>
      {/* sparkle */}
      <circle cx="40" cy="14" r="2.5" fill="#fde047" opacity="0.9"/>
    </svg>
  );
}

// ─── Lugares / Estructuras ────────────────────────────────────────────────

export function IconWorldCity({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-ct-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#bfdbfe"/>
          <stop offset="100%" stopColor="#1e3a8a"/>
        </radialGradient>
        <filter id="gw-ct-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-ct-bg)" filter="url(#gw-ct-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* ground */}
      <rect x="6" y="44" width="44" height="5" rx="2" fill="#1e40af" opacity="0.6"/>
      {/* left small building */}
      <rect x="8" y="34" width="10" height="11" rx="1" fill="#3b82f6"/>
      <rect x="9" y="36" width="3" height="3" rx="0.5" fill="#bfdbfe"/>
      <rect x="13" y="36" width="3" height="3" rx="0.5" fill="#bfdbfe"/>
      <rect x="9" y="41" width="3" height="3" rx="0.5" fill="#bfdbfe"/>
      {/* center tall building */}
      <rect x="20" y="18" width="16" height="27" rx="1.5" fill="#60a5fa"/>
      <rect x="20" y="18" width="16" height="5" rx="1" fill="#93c5fd"/>
      {/* antenna */}
      <line x1="28" y1="10" x2="28" y2="18" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="28" cy="10" r="2" fill="#f87171"/>
      {/* center windows */}
      <rect x="22" y="26" width="4" height="4" rx="0.5" fill="#bfdbfe"/>
      <rect x="30" y="26" width="4" height="4" rx="0.5" fill="#bfdbfe"/>
      <rect x="22" y="33" width="4" height="4" rx="0.5" fill="#bfdbfe"/>
      <rect x="30" y="33" width="4" height="4" rx="0.5" fill="#bfdbfe"/>
      <rect x="22" y="40" width="4" height="4" rx="0.5" fill="#dbeafe"/>
      <rect x="30" y="40" width="4" height="4" rx="0.5" fill="#dbeafe"/>
      {/* right building */}
      <rect x="38" y="28" width="10" height="17" rx="1" fill="#2563eb"/>
      <rect x="39" y="30" width="3" height="3" rx="0.5" fill="#bfdbfe"/>
      <rect x="43" y="30" width="3" height="3" rx="0.5" fill="#bfdbfe"/>
      <rect x="39" y="36" width="3" height="3" rx="0.5" fill="#bfdbfe"/>
    </svg>
  );
}

export function IconWorldMountain({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-mt-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#e0e7ff"/>
          <stop offset="100%" stopColor="#1e3a8a"/>
        </radialGradient>
        <filter id="gw-mt-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-mt-bg)" filter="url(#gw-mt-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* sky gradient strip */}
      <path d="M6 36 Q10 30 16 36 Q22 42 28 34 Q34 26 40 34 Q46 42 50 36 L50 50 L6 50Z" fill="#1d4ed8" opacity="0.3"/>
      {/* back mountain */}
      <polygon points="14,46 28,18 42,46" fill="#4f46e5" opacity="0.6"/>
      {/* main mountain */}
      <polygon points="6,48 24,14 42,48" fill="#6366f1"/>
      <polygon points="6,48 24,14 24,48" fill="#4f46e5"/>
      {/* snow cap */}
      <polygon points="24,14 18,28 30,28" fill="white" opacity="0.95"/>
      <polygon points="24,14 20,26 28,26" fill="white"/>
      {/* right mountain */}
      <polygon points="28,48 40,22 52,48" fill="#818cf8"/>
      <polygon points="40,22 36,32 44,32" fill="white" opacity="0.8"/>
      {/* snow detail */}
      <path d="M18 28 Q20 26 22 28" stroke="white" strokeWidth="1.5" fill="none" opacity="0.7"/>
    </svg>
  );
}

export function IconWorldCastle({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-cs-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#e0e7ff"/>
          <stop offset="100%" stopColor="#312e81"/>
        </radialGradient>
        <filter id="gw-cs-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-cs-bg)" filter="url(#gw-cs-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* ground */}
      <rect x="6" y="44" width="44" height="5" rx="2" fill="#312e81" opacity="0.5"/>
      {/* main wall */}
      <rect x="12" y="28" width="32" height="17" rx="1.5" fill="#6366f1"/>
      {/* left tower */}
      <rect x="8" y="20" width="12" height="26" rx="1.5" fill="#4f46e5"/>
      {/* battlements left */}
      <rect x="8" y="16" width="3" height="6" rx="1" fill="#4338ca"/>
      <rect x="13" y="16" width="3" height="6" rx="1" fill="#4338ca"/>
      <rect x="18" y="16" width="2" height="6" rx="1" fill="#4338ca"/>
      {/* right tower */}
      <rect x="36" y="20" width="12" height="26" rx="1.5" fill="#4f46e5"/>
      {/* battlements right */}
      <rect x="36" y="16" width="3" height="6" rx="1" fill="#4338ca"/>
      <rect x="41" y="16" width="3" height="6" rx="1" fill="#4338ca"/>
      <rect x="46" y="16" width="2" height="6" rx="1" fill="#4338ca"/>
      {/* center battlements */}
      <rect x="20" y="24" width="3" height="6" rx="1" fill="#4338ca"/>
      <rect x="25" y="24" width="3" height="6" rx="1" fill="#4338ca"/>
      <rect x="30" y="24" width="3" height="6" rx="1" fill="#4338ca"/>
      {/* gate */}
      <path d="M24 45 L24 37 Q28 33 32 37 L32 45Z" fill="#1e1b4b"/>
      {/* windows */}
      <rect x="11" y="26" width="5" height="6" rx="2" fill="#c7d2fe" opacity="0.8"/>
      <rect x="40" y="26" width="5" height="6" rx="2" fill="#c7d2fe" opacity="0.8"/>
      {/* flag */}
      <line x1="14" y1="10" x2="14" y2="18" stroke="#a5b4fc" strokeWidth="1.5"/>
      <polygon points="14,10 20,13 14,16" fill="#f87171"/>
    </svg>
  );
}

export function IconWorldTemple({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-tp-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fef3c7"/>
          <stop offset="100%" stopColor="#78350f"/>
        </radialGradient>
        <filter id="gw-tp-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-tp-bg)" filter="url(#gw-tp-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* base steps */}
      <rect x="6" y="44" width="44" height="5" rx="1.5" fill="#d97706"/>
      <rect x="8" y="40" width="40" height="5" rx="1.5" fill="#f59e0b"/>
      {/* entablature */}
      <rect x="10" y="22" width="36" height="5" rx="1" fill="#fde68a"/>
      <rect x="10" y="22" width="36" height="2.5" rx="1" fill="#fef9c3"/>
      {/* pediment triangle */}
      <polygon points="28,10 44,22 12,22" fill="#fcd34d"/>
      <polygon points="28,12 42,22 14,22" fill="#fde68a"/>
      {/* columns */}
      <rect x="12" y="27" width="5" height="14" rx="2" fill="#fef3c7"/>
      <rect x="21" y="27" width="5" height="14" rx="2" fill="#fef3c7"/>
      <rect x="30" y="27" width="5" height="14" rx="2" fill="#fef3c7"/>
      <rect x="39" y="27" width="5" height="14" rx="2" fill="#fef3c7"/>
      {/* column caps */}
      <rect x="11" y="25" width="7" height="2.5" rx="1" fill="#f59e0b"/>
      <rect x="20" y="25" width="7" height="2.5" rx="1" fill="#f59e0b"/>
      <rect x="29" y="25" width="7" height="2.5" rx="1" fill="#f59e0b"/>
      <rect x="38" y="25" width="7" height="2.5" rx="1" fill="#f59e0b"/>
      {/* column bases */}
      <rect x="11" y="39" width="7" height="2.5" rx="1" fill="#d97706"/>
      <rect x="20" y="39" width="7" height="2.5" rx="1" fill="#d97706"/>
      <rect x="29" y="39" width="7" height="2.5" rx="1" fill="#d97706"/>
      <rect x="38" y="39" width="7" height="2.5" rx="1" fill="#d97706"/>
    </svg>
  );
}

export function IconWorldShip({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-sp-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#bae6fd"/>
          <stop offset="100%" stopColor="#0c4a6e"/>
        </radialGradient>
        <filter id="gw-sp-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-sp-bg)" filter="url(#gw-sp-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* sea */}
      <path d="M6 38 Q13 34 20 38 Q27 42 34 38 Q41 34 50 38 L50 52 L6 52Z" fill="#0369a1" opacity="0.7"/>
      {/* hull */}
      <path d="M10 36 Q14 44 28 44 Q42 44 46 36Z" fill="#7c3aed"/>
      <path d="M12 36 Q16 42 28 42 Q40 42 44 36Z" fill="#8b5cf6"/>
      {/* deck */}
      <rect x="14" y="32" width="28" height="5" rx="1.5" fill="#a78bfa"/>
      {/* mast */}
      <line x1="28" y1="10" x2="28" y2="32" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round"/>
      {/* boom */}
      <line x1="20" y1="20" x2="28" y2="20" stroke="#78350f" strokeWidth="2" strokeLinecap="round"/>
      {/* main sail */}
      <path d="M28 12 Q40 18 38 30 L28 30Z" fill="white" opacity="0.95"/>
      <path d="M28 14 Q38 20 36 29 L28 29Z" fill="#dbeafe"/>
      {/* fore sail */}
      <path d="M28 16 Q18 22 20 30 L28 30Z" fill="#fef3c7" opacity="0.9"/>
      {/* flag */}
      <polygon points="28,10 34,12 28,15" fill="#f87171"/>
      {/* wave */}
      <path d="M6 38 Q13 34 20 38 Q27 42 34 38" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconWorldMap({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-mp-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fde68a"/>
          <stop offset="100%" stopColor="#92400e"/>
        </radialGradient>
        <filter id="gw-mp-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-mp-bg)" filter="url(#gw-mp-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* map parchment with fold */}
      <path d="M10 14 L46 14 L46 44 L10 44 Q8 44 8 42 L8 16 Q8 14 10 14Z" fill="#fef3c7"/>
      <path d="M10 14 L14 20 L10 44" fill="#fde68a"/>
      <path d="M46 14 L42 20 L46 44" fill="#fde68a"/>
      {/* top curl */}
      <path d="M10 14 Q18 10 28 14 Q38 18 46 14" fill="#fef9c3" stroke="#d97706" strokeWidth="0.8"/>
      {/* map content — stylized terrain */}
      <path d="M14 22 Q20 18 26 22 Q32 26 36 20 Q40 24 42 28" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M14 32 Q18 28 22 32 Q28 38 34 32 Q38 28 42 34" stroke="#3b82f6" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* X marks the spot */}
      <line x1="32" y1="26" x2="38" y2="32" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
      <line x1="38" y1="26" x2="32" y2="32" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="35" cy="29" r="4" fill="none" stroke="#dc2626" strokeWidth="1.5"/>
      {/* compass rose hint */}
      <circle cx="18" cy="36" r="4" fill="#d97706" opacity="0.4"/>
      <line x1="18" y1="32" x2="18" y2="40" stroke="#92400e" strokeWidth="1" opacity="0.7"/>
      <line x1="14" y1="36" x2="22" y2="36" stroke="#92400e" strokeWidth="1" opacity="0.7"/>
    </svg>
  );
}

// ─── Seres ────────────────────────────────────────────────────────────────

export function IconWorldWizard({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-wz-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#e9d5ff"/>
          <stop offset="100%" stopColor="#4c1d95"/>
        </radialGradient>
        <filter id="gw-wz-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-wz-bg)" filter="url(#gw-wz-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* hat brim */}
      <ellipse cx="28" cy="38" rx="16" ry="5" fill="#4c1d95"/>
      <ellipse cx="28" cy="37" rx="14" ry="3.5" fill="#6d28d9"/>
      {/* hat body (cone) */}
      <path d="M28 8 L44 38 L12 38Z" fill="#7c3aed"/>
      <path d="M28 8 L40 36 L16 36Z" fill="#8b5cf6"/>
      {/* hat band */}
      <rect x="14" y="34" width="28" height="4" rx="1" fill="#4c1d95"/>
      {/* stars on hat */}
      <polygon points="28,16 29,19 32,19 29.5,21 30.5,24 28,22 25.5,24 26.5,21 24,19 27,19" fill="#fde047"/>
      <circle cx="18" cy="28" r="2" fill="#fde047" opacity="0.8"/>
      <circle cx="38" cy="24" r="1.5" fill="#fde047" opacity="0.8"/>
      <circle cx="34" cy="32" r="1.2" fill="#c4b5fd" opacity="0.9"/>
      {/* sparkles */}
      <circle cx="12" cy="16" r="2" fill="#fde047" opacity="0.7"/>
      <circle cx="44" cy="14" r="1.5" fill="#c4b5fd" opacity="0.8"/>
    </svg>
  );
}

export function IconWorldBrain({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-br-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fce7f3"/>
          <stop offset="100%" stopColor="#831843"/>
        </radialGradient>
        <filter id="gw-br-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-br-bg)" filter="url(#gw-br-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* left hemisphere */}
      <path d="M28 14 C22 14 14 18 12 26 C10 34 14 42 20 44 C22 44 26 42 28 40" fill="#f9a8d4"/>
      <path d="M28 14 C22 14 16 18 14 26 C12 33 16 40 22 42 C24 42 26 41 28 40" fill="#fbcfe8"/>
      {/* right hemisphere */}
      <path d="M28 14 C34 14 42 18 44 26 C46 34 42 42 36 44 C34 44 30 42 28 40" fill="#f472b6"/>
      <path d="M28 14 C33 14 40 18 42 26 C44 33 40 40 34 42 C32 42 30 41 28 40" fill="#f9a8d4"/>
      {/* center divide */}
      <line x1="28" y1="14" x2="28" y2="40" stroke="#be185d" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5"/>
      {/* brain folds left */}
      <path d="M14 26 Q18 22 22 26 Q18 30 14 26" stroke="#ec4899" strokeWidth="1.5" fill="none"/>
      <path d="M12 32 Q16 28 20 32" stroke="#ec4899" strokeWidth="1.5" fill="none"/>
      <path d="M14 38 Q18 34 22 38" stroke="#ec4899" strokeWidth="1.5" fill="none"/>
      {/* brain folds right */}
      <path d="M42 26 Q38 22 34 26 Q38 30 42 26" stroke="#db2777" strokeWidth="1.5" fill="none"/>
      <path d="M44 32 Q40 28 36 32" stroke="#db2777" strokeWidth="1.5" fill="none"/>
      <path d="M42 38 Q38 34 34 38" stroke="#db2777" strokeWidth="1.5" fill="none"/>
      {/* sparkle */}
      <circle cx="28" cy="12" r="3" fill="#fde047" opacity="0.9"/>
    </svg>
  );
}

export function IconWorldParrot({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-pt-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#d1fae5"/>
          <stop offset="100%" stopColor="#064e3b"/>
        </radialGradient>
        <filter id="gw-pt-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-pt-bg)" filter="url(#gw-pt-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* tail feathers */}
      <path d="M22 36 Q16 46 12 50" stroke="#f97316" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M26 38 Q22 50 20 54" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M30 38 Q28 50 28 54" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      {/* body */}
      <ellipse cx="28" cy="32" rx="12" ry="14" fill="#22c55e"/>
      <ellipse cx="28" cy="30" rx="10" ry="12" fill="#4ade80"/>
      {/* wing */}
      <path d="M36 28 Q44 24 42 36 Q40 40 34 38 Z" fill="#16a34a"/>
      <path d="M36 28 Q42 26 40 34" stroke="#15803d" strokeWidth="1.5" fill="none"/>
      {/* head */}
      <circle cx="28" cy="18" r="10" fill="#f97316"/>
      <circle cx="28" cy="18" r="8" fill="#fb923c"/>
      {/* eye */}
      <circle cx="32" cy="16" r="4" fill="white"/>
      <circle cx="33" cy="16" r="2.5" fill="#1e1b4b"/>
      <circle cx="33.8" cy="15" r="1" fill="white"/>
      {/* beak */}
      <path d="M34 20 Q38 22 36 26 Q32 24 34 20Z" fill="#fbbf24"/>
      <path d="M34 20 Q36 22 34 24" stroke="#d97706" strokeWidth="1" fill="none"/>
      {/* cheek patch */}
      <circle cx="30" cy="22" r="3" fill="#fde047" opacity="0.7"/>
    </svg>
  );
}

export function IconWorldEagle({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-eg-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#dbeafe"/>
          <stop offset="100%" stopColor="#1e3a8a"/>
        </radialGradient>
        <filter id="gw-eg-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-eg-bg)" filter="url(#gw-eg-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* wings spread */}
      <path d="M28 28 Q18 20 8 24 Q6 30 14 32 Q20 34 28 28Z" fill="#78350f"/>
      <path d="M28 28 Q38 20 48 24 Q50 30 42 32 Q36 34 28 28Z" fill="#92400e"/>
      {/* wing highlights */}
      <path d="M28 28 Q20 22 10 26" stroke="#b45309" strokeWidth="1.5" fill="none" opacity="0.6"/>
      <path d="M28 28 Q36 22 46 26" stroke="#b45309" strokeWidth="1.5" fill="none" opacity="0.6"/>
      {/* feather tips left */}
      <path d="M8 24 Q6 28 8 32" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M10 22 Q8 26 10 30" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* feather tips right */}
      <path d="M48 24 Q50 28 48 32" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M46 22 Q48 26 46 30" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* body */}
      <ellipse cx="28" cy="30" rx="8" ry="10" fill="#78350f"/>
      {/* white head */}
      <circle cx="28" cy="20" r="8" fill="white"/>
      {/* eye */}
      <circle cx="30" cy="18" r="3" fill="#fbbf24"/>
      <circle cx="30" cy="18" r="1.8" fill="#1e1b4b"/>
      <circle cx="30.7" cy="17.3" r="0.8" fill="white"/>
      {/* beak */}
      <path d="M32 22 Q36 24 34 27 Q30 25 32 22Z" fill="#fbbf24"/>
      {/* tail */}
      <path d="M22 38 Q28 44 34 38" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M22 38 Q28 44 34 38" stroke="#f5f5f4" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

export function IconWorldBelgium({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gw-be-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fde68a"/>
          <stop offset="100%" stopColor="#1e1b4b"/>
        </radialGradient>
        <filter id="gw-be-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033"/></filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#gw-be-bg)" filter="url(#gw-be-sh)"/>
      <ellipse cx="22" cy="15" rx="9" ry="5" fill="white" opacity="0.22"/>
      {/* flag rectangle with rounded corners clipped to circle */}
      <clipPath id="gw-be-clip">
        <circle cx="28" cy="28" r="20"/>
      </clipPath>
      <g clipPath="url(#gw-be-clip)">
        {/* black stripe */}
        <rect x="8" y="8" width="14" height="40" fill="#1f2937"/>
        {/* yellow stripe */}
        <rect x="22" y="8" width="12" height="40" fill="#fbbf24"/>
        {/* red stripe */}
        <rect x="34" y="8" width="14" height="40" fill="#ef4444"/>
      </g>
      {/* circle border */}
      <circle cx="28" cy="28" r="20" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4"/>
      {/* lion emblem (simplified) */}
      <circle cx="28" cy="26" r="5" fill="#d97706" opacity="0.9"/>
      <text x="25.5" y="30" fontSize="8" fill="#1f2937" fontFamily="system-ui" fontWeight="900">♛</text>
    </svg>
  );
}

// ─── Icon Map ─────────────────────────────────────────────────────────────

export const GRADE_WORLD_ICON_MAP = {
  'mathematics_P2': IconWorldSeed,
  'mathematics_P3': IconWorldFire,
  'mathematics_P4': IconWorldLightning,
  'mathematics_P5': IconWorldCrystal,
  'mathematics_P6': IconWorldCrown,
  'french_P2': IconWorldFlower,
  'french_P3': IconWorldClover,
  'french_P4': IconWorldWizard,
  'french_P5': IconWorldWave,
  'french_P6': IconWorldStar,
  'dutch_P2': IconWorldShell,
  'dutch_P3': IconWorldCity,
  'dutch_P4': IconWorldBook,
  'dutch_P5': IconWorldLeaf,
  'dutch_P6': IconWorldMountain,
  'english_P2': IconWorldParrot,
  'english_P3': IconWorldBook,
  'english_P4': IconWorldCastle,
  'english_P5': IconWorldWave,
  'english_P6': IconWorldEagle,
  'spanish_P2': IconWorldPalm,
  'spanish_P3': IconWorldHibiscus,
  'spanish_P4': IconWorldLeaf,
  'spanish_P5': IconWorldCity,
  'spanish_P6': IconWorldEagle,
  'reasoning_P2': IconWorldCrystalBall,
  'reasoning_P3': IconWorldLightning,
  'reasoning_P4': IconWorldBrain,
  'reasoning_P5': IconWorldGalaxy,
  'reasoning_P6': IconWorldTrophy,
  'stories_P2': IconWorldScroll,
  'stories_P3': IconWorldMoon,
  'sciences_P2': IconWorldSeed,
  'sciences_P3': IconWorldDrop,
  'sciences_P4': IconWorldFlask,
  'sciences_P5': IconWorldLightning,
  'sciences_P6': IconWorldGlobe,
  'histoire_P2': IconWorldBelgium,
  'histoire_P3': IconWorldMap,
  'histoire_P4': IconWorldCastle,
  'histoire_P5': IconWorldShip,
  'histoire_P6': IconWorldTemple,
};
