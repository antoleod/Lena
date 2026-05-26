/**
 * SVG shapes for renforcement activities
 * Colorful, child-friendly inline SVGs
 */

export const SHAPE_SVG_MARKUP = {
  triangle: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <polygon points="60,15 105,105 15,105" fill="#FF8FC6" stroke="#f46db1" stroke-width="3" stroke-linejoin="round"/>
  </svg>`,

  square: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="20" width="80" height="80" fill="#78A6FF" stroke="#2c98db" stroke-width="3"/>
  </svg>`,

  rectangle: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="35" width="90" height="50" fill="#8BDCC3" stroke="#56b97f" stroke-width="3"/>
  </svg>`,

  circle: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="45" fill="#FFCF74" stroke="#ffb82f" stroke-width="3"/>
  </svg>`,

  star: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <polygon points="60,15 72,45 105,45 80,65 90,95 60,75 30,95 40,65 15,45 48,45" fill="#A689FF" stroke="#8e63ce" stroke-width="2" stroke-linejoin="round"/>
  </svg>`,

  pentagon: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <polygon points="60,10 100,40 85,95 35,95 20,40" fill="#FF8FC6" stroke="#f46db1" stroke-width="3" stroke-linejoin="round"/>
  </svg>`,

  diamond: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <polygon points="60,15 100,60 60,105 20,60" fill="#78A6FF" stroke="#2c98db" stroke-width="3" stroke-linejoin="round"/>
  </svg>`,

  arrow_right: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="60" x2="90" y2="60" stroke="#ff8fc6" stroke-width="6" stroke-linecap="round"/>
    <polygon points="90,60 70,45 75,60 70,75" fill="#ff8fc6"/>
  </svg>`,

  arrow_up: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <line x1="60" y1="100" x2="60" y2="20" stroke="#78a6ff" stroke-width="6" stroke-linecap="round"/>
    <polygon points="60,20 45,40 60,35 75,40" fill="#78a6ff"/>
  </svg>`,

  line_straight: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="100" x2="100" y2="20" stroke="#8bdcc3" stroke-width="6" stroke-linecap="round"/>
  </svg>`,

  line_zigzag: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <polyline points="20,30 40,80 60,40 80,90 100,30" fill="none" stroke="#a689ff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  line_curve: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <path d="M 20 100 Q 60 20, 100 60" fill="none" stroke="#ffcf74" stroke-width="6" stroke-linecap="round"/>
  </svg>`
};

export function ShapeSvg({ shape = 'triangle', alt = 'shape' }) {
  const markup = SHAPE_SVG_MARKUP[shape];
  if (!markup) return null;

  return (
    <div className="shape-svg" aria-label={alt}>
      <svg
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        className="shape-svg__icon"
        dangerouslySetInnerHTML={{ __html: markup.replace(/^<svg[^>]*>|<\/svg>$/g, '') }}
      />
    </div>
  );
}
