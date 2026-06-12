import React from 'react';

/**
 * SubjectIcon — themed "sticker" tiles (app-icon style).
 * Each subject is a rounded tile with its own gradient palette + a bold
 * white symbol. Self-contained: gradient ids are namespaced per id so
 * multiple icons can live on the same page without collisions.
 */

// Per-theme tile palette [light, dark] keyed to each subject's accent.
const PALETTE = {
  math:        ['#8b91ff', '#4f46e5'],
  french:      ['#fb7bb0', '#db2777'],
  dutch:       ['#ffb05c', '#ea7317'],
  english:     ['#ff8a8a', '#e11d48'],
  spanish:     ['#ffc24d', '#f97316'],
  reasoning:   ['#b794ff', '#7c3aed'],
  stories:     ['#3ad6c2', '#0d9488'],
  sciences:    ['#56c8fb', '#0284c7'],
  history:     ['#fbcb4a', '#d97706'],
  logic:       ['#5ce28a', '#16a34a'],
  finance:     ['#48dca6', '#059669'],
  informatics: ['#93a0ff', '#4338ca'],
};

const W = { fill: 'none', stroke: '#fff', strokeWidth: 3.4, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Wf = { fill: '#fff', stroke: 'none' };
const D = 'rgba(22,22,48,0.5)';     // dark detail fill (reads on white)
const Hi = 'rgba(255,255,255,0.5)'; // soft white detail

// Radiating teeth for a gear centred at (cx,cy).
function teeth(cx, cy, r, n, len = 3.4) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i * 2 * Math.PI) / n;
    const x1 = cx + Math.cos(a) * r, y1 = cy + Math.sin(a) * r;
    const x2 = cx + Math.cos(a) * (r + len), y2 = cy + Math.sin(a) * (r + len);
    return <path key={i} d={`M${x1} ${y1}L${x2} ${y2}`} {...W} strokeWidth="3" />;
  });
}

// Themed landmark / object per subject (designed within 0 0 64 64).
const SYMBOL = {
  // Mathematics — calculator
  math: (
    <g>
      <rect x="17" y="12" width="30" height="40" rx="7" {...Wf} />
      <rect x="21" y="17" width="22" height="8" rx="2" fill={D} />
      {[33, 41, 49].map(y => [23.5, 32, 40.5].map((x, j) => (
        <circle key={`${y}-${j}`} cx={x} cy={y} r="2.6" fill={D} />
      )))}
    </g>
  ),
  // French — Eiffel Tower
  french: (
    <g>
      <path d="M22 49C27 35 30 25 31.5 14" {...W} />
      <path d="M42 49C37 35 34 25 32.5 14" {...W} />
      <path d="M32 14V9" {...W} />
      <path d="M23 47Q32 40 41 47" {...W} />
      <path d="M26 31H38" {...W} />
      <path d="M24 40H40" {...W} />
    </g>
  ),
  // Dutch — windmill
  dutch: (
    <g>
      <path d="M27 50L25.5 33H38.5L37 50Z" {...Wf} />
      <rect x="30" y="43" width="4" height="7" rx="1" fill={D} />
      <path d="M32 30L20.5 18.5M32 30L43.5 18.5M32 30L20.5 41.5M32 30L43.5 41.5" {...W} strokeWidth="3" />
      <circle cx="32" cy="30" r="3.2" {...Wf} />
    </g>
  ),
  // English — Big Ben
  english: (
    <g>
      <rect x="26" y="26" width="12" height="24" {...Wf} />
      <rect x="24" y="48" width="16" height="3" rx="1" {...Wf} />
      <rect x="27" y="19" width="10" height="7" {...Wf} />
      <path d="M26 19L32 11L38 19Z" {...Wf} />
      <circle cx="32" cy="32" r="4.4" fill={D} />
      <path d="M32 32V28.5M32 32L34.5 33" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </g>
  ),
  // Spanish — guitar
  spanish: (
    <g>
      <rect x="29.5" y="9" width="5" height="13" rx="1" {...Wf} />
      <rect x="28" y="6" width="8" height="4" rx="1.5" {...Wf} />
      <path d="M32 19c-4.5 0-7 3.4-7 7 0 2 .9 3.6 2 4.7-3 1.8-5 4.8-5 8.6 0 5.7 4.3 9.7 10 9.7s10-4 10-9.7c0-3.8-2-6.8-5-8.6 1.1-1.1 2-2.7 2-4.7 0-3.6-2.5-7-7-7z" {...Wf} />
      <circle cx="32" cy="40" r="3.2" fill={D} />
    </g>
  ),
  // Reasoning — puzzle piece
  reasoning: (
    <g>
      <path d="M22 21h6.6a3.2 3.2 0 1 1 6.8 0H42v6.6a3.2 3.2 0 1 0 0 6.8V41h-6.6a3.2 3.2 0 1 1-6.8 0H22v-6.6a3.2 3.2 0 1 0 0-6.8z" {...Wf} />
      <circle cx="32" cy="31" r="2.4" fill={D} />
    </g>
  ),
  // Stories — open book + sparkle
  stories: (
    <g>
      <path d="M32 24c-4-3-12-3-16-1v22c4-2 12-2 16 1c4-3 12-3 16-1V23c-4-2-12-2-16 1z" {...Wf} />
      <path d="M32 24v22" stroke={D} strokeWidth="1.8" fill="none" />
      <path d="M20 30h8M20 35h8M36 30h8M36 35h8" stroke={D} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M45 13l1.4 3.1L49.5 17.5l-3.1 1.4L45 22l-1.4-3.1L40.5 17.5l3.1-1.4z" {...Wf} />
    </g>
  ),
  // Sciences — bubbling flask
  sciences: (
    <g>
      <path d="M27 14V25L19 44a4 4 0 0 0 4 6h18a4 4 0 0 0 4-6L37 25V14" {...W} strokeWidth="3.2" />
      <path d="M24 14H40" {...W} strokeWidth="3.2" />
      <path d="M21.5 39h21l2.5 6a4 4 0 0 1-4 5H23a4 4 0 0 1-4-5z" {...Wf} />
      <circle cx="30" cy="34" r="2" {...Wf} />
      <circle cx="35.5" cy="30" r="1.5" {...Wf} />
    </g>
  ),
  // History & Geography — globe
  history: (
    <g>
      <circle cx="32" cy="29" r="14" fill="rgba(255,255,255,0.16)" stroke="#fff" strokeWidth="3.2" />
      <path d="M18 29H46" stroke={Hi} strokeWidth="2.2" fill="none" />
      <path d="M32 15a8 14 0 0 0 0 28a8 14 0 0 0 0-28" stroke={Hi} strokeWidth="2.2" fill="none" />
      <path d="M26 22c4 1 8 1 12 0M26 36c4-1 8-1 12 0" stroke={Hi} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M32 43V50M24 51H40" {...W} strokeWidth="3.2" />
    </g>
  ),
  // Logic — interlocking gears
  logic: (
    <g>
      <circle cx="27" cy="28" r="8" {...W} strokeWidth="3.2" />
      {teeth(27, 28, 8, 8)}
      <circle cx="27" cy="28" r="2.6" fill={D} />
      <circle cx="42" cy="40" r="5.5" {...W} strokeWidth="3" />
      {teeth(42, 40, 5.5, 6, 3)}
      <circle cx="42" cy="40" r="2" fill={D} />
    </g>
  ),
  // Finance — piggy bank
  finance: (
    <g>
      <ellipse cx="31" cy="36" rx="14" ry="11" {...Wf} />
      <path d="M36 27l5-4-1 7z" {...Wf} />
      <rect x="42" y="33" width="6" height="7" rx="2.5" {...Wf} />
      <rect x="23" y="45" width="4" height="5" rx="1" {...Wf} />
      <rect x="35" y="45" width="4" height="5" rx="1" {...Wf} />
      <path d="M28 28h8" stroke={D} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="38" cy="34" r="1.4" fill={D} />
      <circle cx="32" cy="19" r="4.5" {...Wf} />
      <path d="M30.5 19h3M32 17.5v3" stroke={D} strokeWidth="1.4" strokeLinecap="round" />
    </g>
  ),
  // Informatics — friendly robot
  informatics: (
    <g>
      <path d="M32 19V13" {...W} strokeWidth="3" />
      <circle cx="32" cy="11" r="2.6" {...Wf} />
      <rect x="18" y="20" width="28" height="26" rx="7" {...Wf} />
      <rect x="14" y="28" width="4" height="9" rx="2" {...Wf} />
      <rect x="46" y="28" width="4" height="9" rx="2" {...Wf} />
      <circle cx="26" cy="31" r="3" fill={D} />
      <circle cx="38" cy="31" r="3" fill={D} />
      <path d="M25 40h14" stroke={D} strokeWidth="2.8" strokeLinecap="round" />
    </g>
  ),
};

const SubjectIcon = ({ id, className = '' }) => {
  const key = SYMBOL[id] ? id : 'stories';
  const [c1, c2] = PALETTE[key] || PALETTE.stories;
  const gid = `subj-tile-${key}`;
  const sid = `subj-sheen-${key}`;

  return (
    <svg
      viewBox="0 0 64 64"
      className={`subject-svg-icon ${className}`}
      style={{ width: '100%', height: '100%', display: 'block' }}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
        <radialGradient id={sid} cx="0.5" cy="0.2" r="0.8">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Tile */}
      <rect x="4" y="4" width="56" height="56" rx="17" fill={`url(#${gid})`} />
      <rect x="4" y="4" width="56" height="56" rx="17" fill={`url(#${sid})`} />
      <rect x="5.5" y="5.5" width="53" height="53" rx="15.5" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="1.5" />

      {/* Symbol */}
      {SYMBOL[key]}
    </svg>
  );
};

export default SubjectIcon;
