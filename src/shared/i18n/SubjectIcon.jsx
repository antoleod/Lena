import React from 'react';

/**
 * SubjectIcon - SVG Icons for educational subjects.
 * Uses currentColor to adapt to the parent's text color or CSS variables.
 */
const SubjectIcon = ({ id, className = "" }) => {
  const icons = {
    math: (
      <g strokeLinecap="round" strokeJoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" strokeWidth="2" />
        <path d="M8 6h8M8 10h8M8 14h3M14 14l2 2m0-2l-2 2M9 18h6" />
      </g>
    ),
    french: (
      <g strokeLinecap="round" strokeJoin="round">
        <path d="M4 20h16M7 14l-1 4h2l7-10-1-1-7 7zM15 4l3 3" />
        <path d="M17.5 2.5a2.121 2.121 0 0 1 3 3L11 15l-4 1 1-4L17.5 2.5z" fill="currentColor" fillOpacity="0.2" />
      </g>
    ),
    dutch: (
      <g strokeLinecap="round" strokeJoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" />
        <path d="M8 8h5M8 12h8" strokeWidth="1.5" opacity="0.6" />
      </g>
    ),
    english: (
      <g strokeLinecap="round" strokeJoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" opacity="0.5" />
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1" />
      </g>
    ),
    spanish: (
      <g strokeLinecap="round" strokeJoin="round">
        <circle cx="12" cy="12" r="5" fill="currentColor" fillOpacity="0.3" />
        <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
      </g>
    ),
    reasoning: (
      <g strokeLinecap="round" strokeJoin="round">
        <path d="M10 20l4-16m4 4l2 2-2 2M4 8l-2 2 2 2" />
        <rect x="7" y="7" width="10" height="10" rx="1" fill="currentColor" fillOpacity="0.2" />
      </g>
    ),
    stories: (
      <g strokeLinecap="round" strokeJoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5v-15z" />
        <path d="M9 7h6M9 11h6" opacity="0.5" />
        <path d="M19 2l2 2-2 2" strokeWidth="1" />
      </g>
    ),
    logic: (
      <g strokeLinecap="round" strokeJoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1 0-4.88 2.5 2.5 0 0 1 0-4.88A2.5 2.5 0 0 1 9.5 2z" fill="currentColor" fillOpacity="0.2" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 0-4.88 2.5 2.5 0 0 0 0-4.88A2.5 2.5 0 0 0 14.5 2z" />
      </g>
    ),
    finance: (
      <g strokeLinecap="round" strokeJoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v10M9 9h4.5a2.25 2.25 0 1 1 0 4.5H10.5a2.25 2.25 0 1 0 0 4.5H15" />
      </g>
    ),
    informatics: (
      <g strokeLinecap="round" strokeJoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4M7 8l-2 2 2 2M17 8l2 2-2 2" />
      </g>
    ),
    sciences: (
      <g strokeLinecap="round" strokeJoin="round">
        <path d="M7 2h10M10 2v10l-4 8h12l-4-8V2" />
        <path d="M8.5 15h7" opacity="0.5" />
      </g>
    ),
    history: (
      <g strokeLinecap="round" strokeJoin="round">
        <path d="M3 21h18M3 7h18M6 7v14M10 7v14M14 7v14M18 7v14M3 3l9-2 9 2v4H3V3z" />
      </g>
    )
  };

  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      className={`subject-svg-icon ${className}`}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      {icons[id] || icons.stories}
    </svg>
  );
};

export default SubjectIcon;