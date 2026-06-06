// Unique SVG icon components for Lena app
// All icons are original designs — no external libraries needed

export function IconMath({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="14" fill="#f59e0b" fillOpacity=".15"/>
      {/* Plus sign */}
      <rect x="7" y="22" width="14" height="4" rx="2" fill="#f59e0b"/>
      <rect x="12" y="17" width="4" height="14" rx="2" fill="#f59e0b"/>
      {/* Equals */}
      <rect x="27" y="20" width="14" height="3.5" rx="1.75" fill="#ef4444"/>
      <rect x="27" y="26" width="14" height="3.5" rx="1.75" fill="#ef4444"/>
      {/* Stars / sparkles */}
      <circle cx="10" cy="10" r="2" fill="#fbbf24" opacity=".6"/>
      <circle cx="38" cy="38" r="2" fill="#fbbf24" opacity=".6"/>
      <circle cx="38" cy="10" r="1.5" fill="#fbbf24" opacity=".4"/>
    </svg>
  );
}

export function IconSciences({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="14" fill="#22c55e" fillOpacity=".15"/>
      {/* Atom nucleus */}
      <circle cx="24" cy="24" r="4" fill="#22c55e"/>
      {/* Orbit 1 */}
      <ellipse cx="24" cy="24" rx="18" ry="7" stroke="#22c55e" strokeWidth="2" fill="none" strokeDasharray="0"/>
      {/* Orbit 2 rotated */}
      <ellipse cx="24" cy="24" rx="18" ry="7" stroke="#4ade80" strokeWidth="1.5" fill="none"
        transform="rotate(60 24 24)"/>
      {/* Orbit 3 rotated */}
      <ellipse cx="24" cy="24" rx="18" ry="7" stroke="#86efac" strokeWidth="1.5" fill="none"
        transform="rotate(-60 24 24)"/>
      {/* Electrons */}
      <circle cx="42" cy="24" r="2.5" fill="#fbbf24"/>
      <circle cx="14" cy="36" r="2.5" fill="#fbbf24"/>
      <circle cx="14" cy="12" r="2.5" fill="#fbbf24"/>
    </svg>
  );
}

export function IconHistoire({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="14" fill="#8b5cf6" fillOpacity=".15"/>
      {/* Castle tower left */}
      <rect x="7" y="22" width="9" height="18" rx="1" fill="#8b5cf6"/>
      <rect x="7" y="18" width="3" height="6" rx="1" fill="#8b5cf6"/>
      <rect x="13" y="18" width="3" height="6" rx="1" fill="#8b5cf6"/>
      {/* Castle main */}
      <rect x="16" y="26" width="16" height="14" rx="1" fill="#7c3aed"/>
      {/* Gate */}
      <path d="M22 40 L22 33 Q24 30 26 33 L26 40" fill="#0d0b1e" opacity=".5"/>
      {/* Castle tower right */}
      <rect x="32" y="22" width="9" height="18" rx="1" fill="#8b5cf6"/>
      <rect x="32" y="18" width="3" height="6" rx="1" fill="#8b5cf6"/>
      <rect x="38" y="18" width="3" height="6" rx="1" fill="#8b5cf6"/>
      {/* Flag */}
      <rect x="23" y="8" width="2" height="10" rx="1" fill="#fbbf24"/>
      <path d="M25 8 L33 11 L25 14 Z" fill="#ef4444"/>
      {/* Windows */}
      <rect x="10" y="27" width="3" height="3" rx=".5" fill="#fbbf24" opacity=".7"/>
      <rect x="35" y="27" width="3" height="3" rx=".5" fill="#fbbf24" opacity=".7"/>
      <rect x="19" y="29" width="3" height="3" rx=".5" fill="#fbbf24" opacity=".7"/>
      <rect x="26" y="29" width="3" height="3" rx=".5" fill="#fbbf24" opacity=".7"/>
    </svg>
  );
}

export function IconLangues({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="14" fill="#06b6d4" fillOpacity=".15"/>
      {/* Main speech bubble */}
      <rect x="5" y="8" width="28" height="22" rx="8" fill="#06b6d4" opacity=".9"/>
      <path d="M10 30 L8 38 L18 32" fill="#06b6d4" opacity=".9"/>
      {/* Letters inside bubble */}
      <text x="12" y="24" fontSize="11" fontWeight="900" fill="white" fontFamily="system-ui">ABC</text>
      {/* Second bubble */}
      <rect x="18" y="24" width="24" height="16" rx="6" fill="#0891b2" opacity=".8"/>
      <path d="M40 40 L44 46 L36 42" fill="#0891b2" opacity=".8"/>
      <text x="22" y="36" fontSize="9" fontWeight="900" fill="white" fontFamily="system-ui">abc</text>
    </svg>
  );
}

export function IconStories({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="14" fill="#f59e0b" fillOpacity=".12"/>
      {/* Open book */}
      <path d="M24 38 C24 38 8 34 8 14 L8 12 C8 12 16 12 24 18 C32 12 40 12 40 12 L40 14 C40 34 24 38 24 38Z" fill="#d97706" opacity=".25"/>
      {/* Left page */}
      <path d="M24 36 C24 36 10 32 10 14 L10 13 C13 13 18 14 24 19 Z" fill="#fef3c7"/>
      {/* Right page */}
      <path d="M24 36 C24 36 38 32 38 14 L38 13 C35 13 30 14 24 19 Z" fill="#fde68a"/>
      {/* Spine */}
      <rect x="23" y="19" width="2" height="18" rx="1" fill="#b45309"/>
      {/* Stars above */}
      <text x="14" y="11" fontSize="8" fill="#fbbf24">✦</text>
      <text x="24" y="8" fontSize="10" fill="#fbbf24">★</text>
      <text x="33" y="11" fontSize="8" fill="#fbbf24">✦</text>
      {/* Lines on pages */}
      <line x1="13" y1="23" x2="21" y2="21" stroke="#b45309" strokeWidth="1" opacity=".4"/>
      <line x1="13" y1="27" x2="21" y2="25" stroke="#b45309" strokeWidth="1" opacity=".4"/>
      <line x1="27" y1="21" x2="35" y2="23" stroke="#b45309" strokeWidth="1" opacity=".4"/>
      <line x1="27" y1="25" x2="35" y2="27" stroke="#b45309" strokeWidth="1" opacity=".4"/>
    </svg>
  );
}

export function IconJeux({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="14" fill="#6366f1" fillOpacity=".15"/>
      {/* Brain outline */}
      <path d="M24 38 C14 38 8 31 8 24 C8 18 12 12 18 10 C18 7 20 6 22 7 C22 5 26 5 26 7 C28 6 30 7 30 10 C36 12 40 18 40 24 C40 31 34 38 24 38Z"
        fill="#6366f1" opacity=".3" stroke="#6366f1" strokeWidth="2"/>
      {/* Brain details */}
      <path d="M18 20 C18 20 20 18 22 20 C24 22 26 18 28 20" stroke="#818cf8" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M16 26 C16 26 19 24 22 26 C25 28 28 24 31 26" stroke="#818cf8" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M20 32 C20 32 22 30 24 32 C26 34 28 30 30 32" stroke="#818cf8" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Lightning bolt */}
      <path d="M27 10 L22 20 L26 20 L21 32 L32 18 L28 18 Z" fill="#fbbf24" opacity=".9"/>
    </svg>
  );
}

export function IconTables({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="14" fill="#f97316" fillOpacity=".15"/>
      {/* Grid */}
      {[0,1,2].map(row =>
        [0,1,2].map(col => (
          <rect key={`${row}-${col}`}
            x={9 + col * 11} y={9 + row * 11}
            width="8" height="8" rx="2"
            fill={row === 0 || col === 0 ? '#f97316' : (row + col) % 2 === 0 ? '#fb923c' : '#fed7aa'}
            opacity={row === 0 || col === 0 ? '0.9' : '0.7'}
          />
        ))
      )}
      {/* Times symbol bottom right */}
      <circle cx="37" cy="37" r="8" fill="#f97316" opacity=".9"/>
      <rect x="33.5" y="36" width="7" height="2" rx="1" fill="white" transform="rotate(45 37 37)"/>
      <rect x="33.5" y="36" width="7" height="2" rx="1" fill="white" transform="rotate(-45 37 37)"/>
    </svg>
  );
}

export function IconCahier({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="14" fill="#3b82f6" fillOpacity=".15"/>
      {/* Notebook */}
      <rect x="10" y="8" width="28" height="34" rx="4" fill="#3b82f6" opacity=".9"/>
      {/* Spiral rings */}
      {[12, 20, 28, 36].map(y => (
        <ellipse key={y} cx="10" cy={y} rx="3" ry="2.5" fill="#1d4ed8" opacity=".9"/>
      ))}
      {/* Pages */}
      <rect x="14" y="8" width="22" height="34" rx="3" fill="#eff6ff"/>
      {/* Ruled lines */}
      {[18, 24, 30, 36].map(y => (
        <line key={y} x1="17" y1={y} x2="33" y2={y} stroke="#bfdbfe" strokeWidth="1.5"/>
      ))}
      {/* Pencil */}
      <rect x="28" y="10" width="5" height="16" rx="1" fill="#fbbf24" transform="rotate(30 31 18)"/>
      <path d="M36 6 L38 8 L34 12 Z" fill="#ef4444" transform="rotate(30 36 9)"/>
      {/* Writing lines */}
      <line x1="17" y1="18" x2="26" y2="18" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round"/>
      <line x1="17" y1="24" x2="30" y2="24" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function IconExamens({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="14" fill="#9b59b6" fillOpacity=".15"/>
      {/* Certificate / scroll */}
      <rect x="9" y="8" width="30" height="36" rx="5" fill="#9b59b6" opacity=".2" stroke="#9b59b6" strokeWidth="2"/>
      {/* Scroll top curl */}
      <path d="M9 14 Q9 8 15 8 L33 8 Q39 8 39 14" fill="#c084fc" opacity=".3"/>
      {/* Seal circle */}
      <circle cx="24" cy="28" r="10" fill="#7c3aed" opacity=".15" stroke="#9b59b6" strokeWidth="1.5"/>
      {/* Star in seal */}
      <path d="M24 20 L25.5 25 L31 25 L26.5 28 L28 33 L24 30 L20 33 L21.5 28 L17 25 L22.5 25 Z" fill="#fbbf24"/>
      {/* Title lines */}
      <line x1="14" y1="13" x2="34" y2="13" stroke="#9b59b6" strokeWidth="2" strokeLinecap="round"/>
      <line x1="17" y1="17" x2="31" y2="17" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Small inline icon for use in text / cards
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

// Lena mascot — a little girl reading a book
export function MascotLena({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="40" cy="62" rx="16" ry="12" fill="#6366f1" opacity=".9"/>
      {/* Dress detail */}
      <path d="M28 58 Q40 70 52 58 L52 62 Q40 74 28 62 Z" fill="#8b5cf6" opacity=".6"/>
      {/* Arms holding book */}
      <ellipse cx="22" cy="58" rx="6" ry="4" fill="#fcd5b5" transform="rotate(-20 22 58)"/>
      <ellipse cx="58" cy="58" rx="6" ry="4" fill="#fcd5b5" transform="rotate(20 58 58)"/>
      {/* Book */}
      <rect x="28" y="54" width="24" height="16" rx="3" fill="#f59e0b"/>
      <rect x="39" y="54" width="2" height="16" fill="#b45309"/>
      <rect x="30" y="57" width="7" height="1.5" rx=".75" fill="#b45309" opacity=".5"/>
      <rect x="30" y="61" width="7" height="1.5" rx=".75" fill="#b45309" opacity=".5"/>
      <rect x="43" y="57" width="7" height="1.5" rx=".75" fill="#92400e" opacity=".5"/>
      <rect x="43" y="61" width="7" height="1.5" rx=".75" fill="#92400e" opacity=".5"/>
      {/* Head */}
      <circle cx="40" cy="34" r="16" fill="#fcd5b5"/>
      {/* Hair */}
      <path d="M24 34 C24 20 56 20 56 34 C56 28 52 22 40 22 C28 22 24 28 24 34Z" fill="#92400e"/>
      <ellipse cx="24" cy="36" rx="3.5" ry="6" fill="#92400e"/>
      <ellipse cx="56" cy="36" rx="3.5" ry="6" fill="#92400e"/>
      {/* Pigtails */}
      <ellipse cx="22" cy="42" rx="3" ry="5" fill="#92400e" transform="rotate(-15 22 42)"/>
      <ellipse cx="58" cy="42" rx="3" ry="5" fill="#92400e" transform="rotate(15 58 42)"/>
      {/* Hair bows */}
      <path d="M18 37 L22 40 L18 43 Z" fill="#ef4444"/>
      <path d="M26 37 L22 40 L26 43 Z" fill="#ef4444"/>
      <path d="M54 37 L58 40 L54 43 Z" fill="#ef4444"/>
      <path d="M62 37 L58 40 L62 43 Z" fill="#ef4444"/>
      <circle cx="22" cy="40" r="2" fill="#ef4444"/>
      <circle cx="58" cy="40" r="2" fill="#ef4444"/>
      {/* Eyes */}
      <circle cx="35" cy="33" r="3.5" fill="white"/>
      <circle cx="45" cy="33" r="3.5" fill="white"/>
      <circle cx="35.5" cy="33.5" r="2" fill="#1a1a2e"/>
      <circle cx="45.5" cy="33.5" r="2" fill="#1a1a2e"/>
      <circle cx="36" cy="32.5" r=".8" fill="white"/>
      <circle cx="46" cy="32.5" r=".8" fill="white"/>
      {/* Smile */}
      <path d="M35 39 Q40 43 45 39" stroke="#c2410c" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Cheeks */}
      <circle cx="31" cy="37" r="3" fill="#f9a8d4" opacity=".5"/>
      <circle cx="49" cy="37" r="3" fill="#f9a8d4" opacity=".5"/>
      {/* Stars around */}
      <text x="5" y="18" fontSize="8" fill="#fbbf24">✦</text>
      <text x="65" y="18" fontSize="10" fill="#fbbf24">★</text>
      <text x="8" y="52" fontSize="7" fill="#c4b5fd">✨</text>
      <text x="64" y="52" fontSize="7" fill="#c4b5fd">✨</text>
    </svg>
  );
}
