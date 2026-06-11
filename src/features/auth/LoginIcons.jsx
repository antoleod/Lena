/**
 * LénaLand — 9 unique hand-built SVG button icons.
 * Each is a small colorful "sticker" glyph that reads well on the login's
 * dark glass, gradient and white (Google) surfaces. 24×24 viewBox, sized via
 * the `login-btn-ico` class. Gradient ids are namespaced per-icon to avoid
 * collisions when several render on the same screen.
 */

const base = { className: 'login-btn-ico', viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false' };

/* 1 — Email: friendly envelope with a heart seal */
export function IconEmail() {
  return (
    <svg {...base}>
      <defs>
        <linearGradient id="ic-mail" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a78bfa" /><stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="5" width="19" height="14" rx="4" fill="url(#ic-mail)" />
      <path d="M3.5 7.5l8.5 6 8.5-6" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 13.2c-1.3-1.2-3-.4-3 1 0 1 1.2 1.9 3 3 1.8-1.1 3-2 3-3 0-1.4-1.7-2.2-3-1z" fill="#fff" opacity="0.92" />
    </svg>
  );
}

/* 2 — Create account: sparkly star burst */
export function IconCreate() {
  return (
    <svg {...base}>
      <defs>
        <linearGradient id="ic-create" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fde68a" /><stop offset="1" stopColor="#fb923c" />
        </linearGradient>
      </defs>
      <path d="M12 2.5l2.4 5.3 5.8.6-4.3 3.9 1.2 5.7L12 21l-5.1 2.0 1.2-5.7-4.3-3.9 5.8-.6z" transform="translate(0 -.5)" fill="url(#ic-create)" stroke="#fff" strokeWidth="1.1" strokeLinejoin="round" />
      <circle cx="19" cy="6" r="1.4" fill="#fff" />
      <circle cx="5" cy="8" r="1" fill="#fff" opacity="0.85" />
    </svg>
  );
}

/* 3 — Guest / play: rounded gamepad */
export function IconPlay() {
  return (
    <svg {...base}>
      <defs>
        <linearGradient id="ic-play" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#34d399" /><stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <rect x="2" y="7" width="20" height="11" rx="5.5" fill="url(#ic-play)" />
      <path d="M7 12.5h3M8.5 11v3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="15.5" cy="11.5" r="1.3" fill="#fff" />
      <circle cx="17.8" cy="13.8" r="1.3" fill="#fff" />
    </svg>
  );
}

/* 4 — Resume: rocket zooming up */
export function IconRocket() {
  return (
    <svg {...base}>
      <defs>
        <linearGradient id="ic-rocket" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#c4b5fd" />
        </linearGradient>
      </defs>
      <path d="M12 2.5c3 1.6 4.6 4.6 4.6 8.4l-1.7 3.4H9.1L7.4 10.9C7.4 7.1 9 4.1 12 2.5z" fill="url(#ic-rocket)" stroke="#7c3aed" strokeWidth="1" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="1.9" fill="#22d3ee" stroke="#7c3aed" strokeWidth="0.8" />
      <path d="M9.1 14.3l-2 1.2.9-3M14.9 14.3l2 1.2-.9-3" fill="#a78bfa" />
      <path d="M10.6 16.5c0 1.4 1.4 3 1.4 3s1.4-1.6 1.4-3z" fill="#fb923c" />
    </svg>
  );
}

/* 5 — Personalize: artist palette */
export function IconPalette() {
  return (
    <svg {...base}>
      <defs>
        <linearGradient id="ic-pal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f9a8d4" /><stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <path d="M12 3.2c5 0 8.8 3.3 8.8 7.4 0 2.5-2 3.6-3.9 3.6h-1.6c-1 0-1.7.8-1.7 1.7 0 .5.3.9.3 1.4 0 1-.9 1.7-2 1.7C7 20.4 3.2 16.3 3.2 11.3 3.2 6.6 7 3.2 12 3.2z" fill="url(#ic-pal)" stroke="#fff" strokeWidth="1" />
      <circle cx="8" cy="10" r="1.3" fill="#f87171" />
      <circle cx="11" cy="7.3" r="1.3" fill="#fbbf24" />
      <circle cx="15" cy="8.2" r="1.3" fill="#34d399" />
      <circle cx="16.6" cy="11.4" r="1.3" fill="#60a5fa" />
    </svg>
  );
}

/* 6 — Parents: two heads + heart */
export function IconParents() {
  return (
    <svg {...base}>
      <defs>
        <linearGradient id="ic-par" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbbf24" /><stop offset="1" stopColor="#fb7185" />
        </linearGradient>
      </defs>
      <circle cx="8" cy="8" r="3" fill="url(#ic-par)" />
      <circle cx="16" cy="8" r="3" fill="url(#ic-par)" />
      <path d="M3 19c0-2.8 2.2-4.8 5-4.8s5 2 5 4.8z" fill="url(#ic-par)" />
      <path d="M11 19c0-2.8 2.2-4.8 5-4.8s5 2 5 4.8z" fill="url(#ic-par)" opacity="0.92" />
      <path d="M12 4.2c-.7-.7-1.8-.2-1.8.6 0 .6.7 1.1 1.8 1.9 1.1-.8 1.8-1.3 1.8-1.9 0-.8-1.1-1.3-1.8-.6z" fill="#fff" />
    </svg>
  );
}

/* 7 — Secret code: magical key */
export function IconKey() {
  return (
    <svg {...base}>
      <defs>
        <linearGradient id="ic-key" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fde68a" /><stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <circle cx="8" cy="8" r="5" fill="none" stroke="url(#ic-key)" strokeWidth="2.6" />
      <circle cx="8" cy="8" r="1.6" fill="#fff" />
      <path d="M11.4 11.4l7 7M16.5 16.5l1.6-1.6M18.4 18.4l1.6-1.6" stroke="url(#ic-key)" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M19 4l.7 1.6L21.4 6l-1.7.4L19 8l-.7-1.6L16.6 6l1.7-.4z" fill="#fff" />
    </svg>
  );
}

/* 8 — Forward arrow in a soft circle (Next / Enter) */
export function IconArrow() {
  return (
    <svg {...base}>
      <defs>
        <linearGradient id="ic-arrow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#e9d5ff" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9.5" fill="rgba(255,255,255,0.18)" stroke="url(#ic-arrow)" strokeWidth="1.4" />
      <path d="M9 12h6.5M12.5 8.5L16 12l-3.5 3.5" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* 9 — Shield: safety / child-safe */
export function IconShield() {
  return (
    <svg {...base}>
      <defs>
        <linearGradient id="ic-shield" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#34d399" /><stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <path d="M12 2.5l7.5 2.6v5.4c0 4.6-3.1 8.3-7.5 9.6-4.4-1.3-7.5-5-7.5-9.6V5.1z" fill="url(#ic-shield)" stroke="#fff" strokeWidth="1" strokeLinejoin="round" />
      <path d="M8.5 12l2.3 2.4 4.2-4.6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
