/**
 * NavIcons — 5 unique SVG icons for the main navigation bar.
 * All use currentColor so CSS can theme active/inactive states.
 * ViewBox 24×24; designed to look crisp at 22–28 px.
 */

/* ── shared helper ─────────────────────────────────────────────────────── */
function Nav({ size = 24, children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

/* ── 1. Apprendre — open book with a tiny world arc ───────────────────── */
export function IconNavApprendre({ size = 24 }) {
  return (
    <Nav size={size}>
      {/* book spine */}
      <line x1="12" y1="7" x2="12" y2="20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      {/* left page */}
      <path
        d="M12 7C10 6 6.5 6 4 7V19.5C6.5 18.5 10 18.5 12 19.5V7Z"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* right page */}
      <path
        d="M12 7C14 6 17.5 6 20 7V19.5C17.5 18.5 14 18.5 12 19.5V7Z"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* globe above — partial arc + equator */}
      <circle cx="12" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 3.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M12 1.5c-.7.7-1.1 1.3-1.1 2s.4 1.3 1.1 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </Nav>
  );
}

/* ── 2. Pratiquer — game controller ───────────────────────────────────── */
export function IconNavPratiquer({ size = 24 }) {
  return (
    <Nav size={size}>
      {/* controller body */}
      <path
        d="M6 9h12l1.5 5.5A2 2 0 0 1 17.6 17H6.4a2 2 0 0 1-1.9-2.5L6 9Z"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* left d-pad cross */}
      <line x1="8.5" y1="11.5" x2="8.5" y2="14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="7" y1="13" x2="10" y2="13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {/* right buttons — 2 dots */}
      <circle cx="15" cy="12" r=".9" fill="currentColor" />
      <circle cx="17" cy="13.5" r=".9" fill="currentColor" />
      {/* grips */}
      <path d="M8 17c-.8 1-1.5 1.5-2.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M16 17c.8 1 1.5 1.5 2.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </Nav>
  );
}

/* ── 3. Examens — shield with star ────────────────────────────────────── */
export function IconNavExamens({ size = 24 }) {
  return (
    <Nav size={size}>
      {/* shield */}
      <path
        d="M12 2L4 5.5V12c0 4.5 3.5 7.5 8 9 4.5-1.5 8-4.5 8-9V5.5L12 2Z"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* star inside */}
      <path
        d="M12 7.5l1.1 2.2 2.4.35-1.75 1.7.41 2.4L12 13l-2.16 1.15.41-2.4L8.5 10.05l2.4-.35L12 7.5Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth=".6"
        strokeLinejoin="round"
      />
    </Nav>
  );
}

/* ── 4. Progrès — bar chart with rising arrow ─────────────────────────── */
export function IconNavProgres({ size = 24 }) {
  return (
    <Nav size={size}>
      {/* baseline */}
      <line x1="3" y1="19" x2="21" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* bars */}
      <rect x="4" y="14" width="3.5" height="5" rx="1" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.2" />
      <rect x="10.25" y="10" width="3.5" height="9" rx="1" fill="currentColor" fillOpacity="0.55" stroke="currentColor" strokeWidth="1.2" />
      <rect x="16.5" y="6" width="3.5" height="13" rx="1" fill="currentColor" fillOpacity="0.7" stroke="currentColor" strokeWidth="1.2" />
      {/* rising arrow */}
      <path
        d="M4 16L9 11.5L13 13.5L20 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M17 6h3v3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Nav>
  );
}

/* ── 5. Réglages — gear with sparkle center ───────────────────────────── */
export function IconNavReglages({ size = 24 }) {
  return (
    <Nav size={size}>
      {/* gear ring */}
      <path
        d="M12 2.5A9.5 9.5 0 1 0 12 21.5A9.5 9.5 0 0 0 12 2.5Z"
        stroke="currentColor"
        strokeWidth="0"
        fill="none"
      />
      <path
        d={[
          'M12 2',
          'L13.2 4.4 15.8 3.8 16.2 6.5 18.8 7.3 17.8 9.8',
          '20 11.2 18.6 13.5 20.5 15.2 18.5 16.8',
          '19.2 19.5 16.5 19.8 15.8 22.5 13.2 21.5',
          '12 22 10.8 21.5 8.2 22.5 7.5 19.8 4.8 19.5',
          '5.5 16.8 3.5 15.2 5.4 13.5 4 11.2 6.2 9.8',
          '5.2 7.3 7.8 6.5 8.2 3.8 10.8 4.4 12 2Z',
        ].join(' ')}
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      {/* inner circle */}
      <circle cx="12" cy="12" r="3.2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.4" />
      {/* sparkle dot */}
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </Nav>
  );
}
