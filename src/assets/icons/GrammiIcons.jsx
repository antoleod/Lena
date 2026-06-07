// Grammi category SVG icon components — inline 32×32 use in GrammiPage
// Style: flat fill + subtle highlight, no drop shadow (inline text context)
// Unique defs prefixes: grm-nc-, grm-np-, grm-adj-, grm-vb-, grm-det-

export function IconGrammiNomCommun({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* House — bleu #3b82f6 */}
      <rect x="6" y="16" width="20" height="13" rx="2" fill="#3b82f6"/>
      <rect x="6" y="16" width="20" height="5" rx="0" fill="#2563eb"/>
      <polygon points="4,18 16,6 28,18" fill="#60a5fa"/>
      <polygon points="4,18 16,6 28,18" fill="white" opacity="0.18"/>
      <rect x="13" y="21" width="6" height="8" rx="2" fill="#1d4ed8"/>
      <rect x="9" y="19" width="5" height="5" rx="1" fill="#bfdbfe" opacity="0.8"/>
      <rect x="18" y="19" width="5" height="5" rx="1" fill="#bfdbfe" opacity="0.8"/>
    </svg>
  );
}

export function IconGrammiNomPropre({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Crown — dorado #fbbf24 */}
      <path d="M4 22 L4 26 L28 26 L28 22 L4 22Z" fill="#d97706"/>
      <path d="M4 22 L8 10 L16 18 L24 10 L28 22Z" fill="#fbbf24"/>
      <path d="M4 22 L8 10 L16 18 L24 10 L28 22Z" fill="white" opacity="0.18"/>
      <circle cx="8" cy="10" r="3" fill="#fbbf24"/>
      <circle cx="16" cy="18" r="3" fill="#fde68a"/>
      <circle cx="24" cy="10" r="3" fill="#fbbf24"/>
      <circle cx="8" cy="10" r="1.5" fill="#b45309"/>
      <circle cx="16" cy="18" r="1.5" fill="#d97706"/>
      <circle cx="24" cy="10" r="1.5" fill="#b45309"/>
    </svg>
  );
}

export function IconGrammiAdjectif({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Color palette — rose #ec4899 */}
      <ellipse cx="16" cy="18" rx="12" ry="10" fill="#ec4899"/>
      <ellipse cx="16" cy="18" rx="12" ry="10" fill="white" opacity="0.15"/>
      <ellipse cx="16" cy="20" rx="5" ry="4" fill="#fce7f3"/>
      {/* Color dots */}
      <circle cx="9" cy="14" r="3" fill="#ef4444"/>
      <circle cx="16" cy="10" r="3" fill="#eab308"/>
      <circle cx="23" cy="14" r="3" fill="#3b82f6"/>
      <circle cx="22" cy="22" r="3" fill="#22c55e"/>
      <circle cx="10" cy="22" r="3" fill="#a855f7"/>
      {/* Palette hole */}
      <circle cx="20" cy="18" r="2.5" fill="#be185d"/>
    </svg>
  );
}

export function IconGrammiVerbe({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Lightning bolt — orange #f97316 */}
      <path d="M20 4 L10 18 L16 18 L12 28 L24 14 L18 14Z" fill="#f97316"/>
      <path d="M20 4 L10 18 L16 18 L12 28 L24 14 L18 14Z" fill="white" opacity="0.25"/>
      <path d="M20 4 L10 18 L16 18 L12 28" fill="none" stroke="#ea580c" strokeWidth="0.5" opacity="0.4"/>
    </svg>
  );
}

export function IconGrammiDeterminant({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Box/container — vert #22c55e */}
      <rect x="5" y="12" width="22" height="16" rx="3" fill="#22c55e"/>
      <rect x="5" y="12" width="22" height="6" rx="2" fill="#16a34a"/>
      {/* Lid */}
      <rect x="3" y="8" width="26" height="6" rx="3" fill="#4ade80"/>
      <rect x="3" y="8" width="26" height="6" rx="3" fill="white" opacity="0.15"/>
      {/* Handle */}
      <rect x="13" y="6" width="6" height="4" rx="2" fill="#16a34a"/>
      {/* Article label */}
      <rect x="9" y="16" width="14" height="7" rx="2" fill="white" opacity="0.85"/>
      <text x="11" y="22" fontSize="6" fontWeight="900" fill="#15803d" fontFamily="system-ui">le/la</text>
    </svg>
  );
}
