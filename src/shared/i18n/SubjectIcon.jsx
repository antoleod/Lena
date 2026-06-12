import React from 'react';

/**
 * SubjectIcon - Premium Fine-Line SVG Icons.
 * Original designs for LénaLand.
 */
const SubjectIcon = ({ id, className = "" }) => {
  const icons = {
    math: (
      <g>
        <path d="M18 15l-6-6-6 6" />
        <path d="M12 9v12" opacity="0.3" />
        <circle cx="12" cy="5" r="1.5" fill="currentColor" />
      </g>
    ),
    french: (
      <g>
        <path d="M20 4c-4 0-10 4-11 11l-1 5 5-1c7-1 7-11 7-11z" />
        <circle cx="6" cy="18" r="1" fill="currentColor" />
      </g>
    ),
    dutch: (
      <g>
        <path d="M12 22v-9M12 13c-3 0-5-2-5-5s2-5 5-5 5 2 5 5-2 5-5 5z" />
        <path d="M7 6c1 1 2 2 5 2s4-1 5-2" opacity="0.4" />
      </g>
    ),
    english: (
      <g>
        <path d="M3 17h18M6 17v-4c0-3 2-5 6-5s6 2 6 5v4" />
        <circle cx="12" cy="4" r="1" fill="currentColor" />
      </g>
    ),
    spanish: (
      <g>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 5V3M12 19v2M5 12H3M19 12h2" />
        <path d="M18 6l-1 1M7 17l-1 1" opacity="0.5" />
      </g>
    ),
    reasoning: (
      <g>
        <circle cx="12" cy="12" r="2" />
        <path d="M7 7l3.5 3.5M17 7l-3.5 3.5M12 14v4" opacity="0.4" />
        <circle cx="5" cy="5" r="1" fill="currentColor" />
        <circle cx="19" cy="5" r="1" fill="currentColor" />
      </g>
    ),
    stories: (
      <g>
        <path d="M4 19c2-1 5-2 8-2s6 1 8 2V7c-2-1-5-2-8-2s-6 1-8 2v12zM12 5v12" />
      </g>
    ),
    logic: (
      <g>
        <path d="M12 3l7 9-7 9-7-9zM12 7l4 5-4 5-4-5z" opacity="0.5" />
      </g>
    ),
    finance: (
      <g>
        <circle cx="12" cy="12" r="8" />
        <path d="M8 14l3-3 2 2 3-3" />
        <path d="M16 10h-2v-2" strokeWidth="1" />
      </g>
    ),
    informatics: (
      <g>
        <path d="M10 9l-3 3 3 3M14 9l3 3-3 3" />
        <rect x="2" y="6" width="20" height="12" rx="2" opacity="0.2" />
      </g>
    ),
    sciences: (
      <g>
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <ellipse cx="12" cy="12" rx="9" ry="3" transform="rotate(-30 12 12)" />
      </g>
    ),
    history: (
      <g>
        <path d="M7 4h10l-5 8 5 8H7l5-8-5-8z" />
        <path d="M7 4h10M7 20h10" opacity="0.4" />
      </g>
    )
  };

  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1"
      className={`subject-svg-icon ${className}`}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      {icons[id] || icons.stories}
    </svg>
  );
};

export default SubjectIcon;