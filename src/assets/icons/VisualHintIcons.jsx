export function EyeOpenIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Outer glow ring */}
      <ellipse cx="18" cy="19" rx="14" ry="8" fill="url(#eyeGlow)" opacity="0.18" />

      {/* Eyelid arc top */}
      <path
        d="M4 19 C8 10 28 10 32 19"
        stroke="url(#lidGrad)" strokeWidth="2.2" strokeLinecap="round" fill="none"
      />
      {/* Eyelid arc bottom */}
      <path
        d="M4 19 C8 27 28 27 32 19"
        stroke="url(#lidGrad)" strokeWidth="2.2" strokeLinecap="round" fill="none"
      />

      {/* Iris */}
      <circle cx="18" cy="19" r="6.5" fill="url(#irisGrad)" />

      {/* Pupil */}
      <circle cx="18" cy="19" r="3.4" fill="#1a1a2e" />

      {/* Catchlight top-right */}
      <circle cx="20.4" cy="16.8" r="1.4" fill="white" opacity="0.9" />
      {/* Catchlight small */}
      <circle cx="16.2" cy="20.6" r="0.7" fill="white" opacity="0.5" />

      {/* Lashes top */}
      <line x1="10" y1="13.5" x2="9" y2="10.5" stroke="url(#lidGrad)" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="14" y1="11.2" x2="13.4" y2="8" stroke="url(#lidGrad)" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="18" y1="10.4" x2="18" y2="7" stroke="url(#lidGrad)" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="22" y1="11.2" x2="22.6" y2="8" stroke="url(#lidGrad)" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="26" y1="13.5" x2="27" y2="10.5" stroke="url(#lidGrad)" strokeWidth="1.6" strokeLinecap="round" />

      <defs>
        <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7ec8f7" />
          <stop offset="100%" stopColor="#7ec8f7" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lidGrad" x1="4" y1="14" x2="32" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8e54e9" />
          <stop offset="100%" stopColor="#4776e6" />
        </linearGradient>
        <radialGradient id="irisGrad" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#56ccf2" />
          <stop offset="50%" stopColor="#2f80ed" />
          <stop offset="100%" stopColor="#1a237e" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function EyeHiddenIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">

      {/* Sleepy closed eye curve */}
      <path
        d="M5 18 C9 13 27 13 31 18"
        stroke="url(#sleepLid)" strokeWidth="2.4" strokeLinecap="round" fill="none"
      />
      {/* Bottom flat line */}
      <path
        d="M7 19.5 C11 22 25 22 29 19.5"
        stroke="url(#sleepLid)" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.5"
      />

      {/* Lashes top — drooping */}
      <line x1="10" y1="15.5" x2="8.5" y2="12.5" stroke="url(#sleepLid)" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="14.5" y1="13.6" x2="13.8" y2="10.4" stroke="url(#sleepLid)" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="18" y1="13" x2="18" y2="9.6" stroke="url(#sleepLid)" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="21.5" y1="13.6" x2="22.2" y2="10.4" stroke="url(#sleepLid)" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="26" y1="15.5" x2="27.5" y2="12.5" stroke="url(#sleepLid)" strokeWidth="1.6" strokeLinecap="round" />

      {/* Z Z Z sleep bubbles */}
      <text x="24" y="11" fontSize="5" fontWeight="800" fill="url(#zGrad)" fontFamily="Fredoka, sans-serif" opacity="0.9">z</text>
      <text x="27.5" y="7.5" fontSize="4" fontWeight="800" fill="url(#zGrad)" fontFamily="Fredoka, sans-serif" opacity="0.7">z</text>
      <text x="30" y="4.5" fontSize="3" fontWeight="800" fill="url(#zGrad)" fontFamily="Fredoka, sans-serif" opacity="0.5">z</text>

      {/* Blush cheeks */}
      <ellipse cx="9" cy="22" rx="3" ry="1.6" fill="#ffb3c6" opacity="0.55" />
      <ellipse cx="27" cy="22" rx="3" ry="1.6" fill="#ffb3c6" opacity="0.55" />

      <defs>
        <linearGradient id="sleepLid" x1="5" y1="13" x2="31" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f093fb" />
          <stop offset="100%" stopColor="#f5576c" />
        </linearGradient>
        <linearGradient id="zGrad" x1="24" y1="4" x2="32" y2="11" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
    </svg>
  );
}
