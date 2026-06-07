/**
 * DifficultyIcons — unique SVG icons for the 3 exam difficulty levels.
 * Same Base pattern as GameIcons / ExamIcons (radial gradient + glass highlight).
 * ID prefix: di-{code}
 */

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

/* ── Facile — green seedling sprouting from soil ─────────────────────── */
export function IconDiffFacile({ size = 32 }) {
  return (
    <Base id="di-fc" c0="#86efac" c1="#16a34a" shadow="#052e16" size={size}>
      {/* soil mound */}
      <ellipse cx="24" cy="37" rx="13" ry="4" fill="#14532d" opacity="0.5" />
      {/* stem */}
      <line x1="24" y1="36" x2="24" y2="24" stroke="#bbf7d0" strokeWidth="2.8" strokeLinecap="round" />
      {/* left leaf */}
      <path
        d="M24 28 C20 24 13 24 13 19 C17 19 22 22 24 26"
        fill="#4ade80"
        opacity="0.9"
      />
      {/* right leaf */}
      <path
        d="M24 24 C28 20 35 20 35 15 C31 15 26 18 24 22"
        fill="#22c55e"
        opacity="0.9"
      />
      {/* top bud */}
      <circle cx="24" cy="21" r="3.5" fill="#bbf7d0" opacity="0.85" />
      <circle cx="24" cy="21" r="2" fill="#4ade80" />
    </Base>
  );
}

/* ── Moyen — orange flame ────────────────────────────────────────────── */
export function IconDiffMoyen({ size = 32 }) {
  return (
    <Base id="di-my" c0="#fdba74" c1="#ea580c" shadow="#431407" size={size}>
      {/* outer flame */}
      <path
        d="M24 10 C24 10 30 16 32 22 C34 28 31 34 24 36 C17 34 14 28 16 22 C18 16 24 10 24 10Z"
        fill="#fed7aa"
        opacity="0.9"
      />
      {/* inner flame */}
      <path
        d="M24 17 C24 17 27 21 28 25 C29 29 27 33 24 34 C21 33 19 29 20 25 C21 21 24 17 24 17Z"
        fill="#fb923c"
        opacity="0.95"
      />
      {/* core */}
      <path
        d="M24 23 C24 23 26 26 26 28.5 C26 30.5 25 32 24 32 C23 32 22 30.5 22 28.5 C22 26 24 23 24 23Z"
        fill="#fef3c7"
        opacity="0.9"
      />
    </Base>
  );
}

/* ── Difficile — red lightning bolt ──────────────────────────────────── */
export function IconDiffDifficile({ size = 32 }) {
  return (
    <Base id="di-df" c0="#f87171" c1="#b91c1c" shadow="#450a0a" size={size}>
      {/* outer glow ring */}
      <circle cx="24" cy="24" r="14" fill="#fca5a5" opacity="0.15" />
      {/* lightning bolt */}
      <path
        d="M28 10 L18 26 H24 L20 38 L34 20 H27 L32 10 Z"
        fill="#fef2f2"
        opacity="0.95"
        stroke="#fca5a5"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      {/* inner highlight on bolt */}
      <path
        d="M27 14 L21 26 H26 L23 34 L31 22 H25.5 L29 14 Z"
        fill="#fecaca"
        opacity="0.5"
      />
    </Base>
  );
}
