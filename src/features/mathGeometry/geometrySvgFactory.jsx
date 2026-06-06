// ─────────────────────────────────────────────────────────────────────────────
// Geometry SVG factory.
//
// Figures are described by plain JS "specs" (no raw SVG strings stored), and a
// single <GeometryFigure> component renders any spec as real inline SVG — so
// everything is offline, crisp at any size, and interactive (tap to colour).
//
// Spec kinds:
//   { kind:'grid', segments:[{x1,y1,x2,y2,color}] }          → grid completion
//   { kind:'collection', shapes:[Shape] }                    → count / colour
//
// Shape:
//   { id, type:'square'|'rect'|'triangle'|'disc', ...geometry, fill? }
//   square:   { x, y, size, rotation? }
//   rect:     { x, y, w, h, rotation? }
//   triangle: { points:[[x,y],[x,y],[x,y]] }
//   disc:     { cx, cy, r }
//
// All coordinates are in a 0–100 viewBox.
// ─────────────────────────────────────────────────────────────────────────────

const STROKE = '#34495e';

function shapeElement(shape, { selectable, fill, onTap }) {
  const common = {
    stroke: STROKE,
    strokeWidth: 1.6,
    fill: fill || 'transparent',
    style: selectable ? { cursor: 'pointer' } : undefined,
    onClick: onTap ? () => onTap(shape) : undefined,
  };
  switch (shape.type) {
    case 'square':
      return (
        <rect
          key={shape.id}
          x={shape.x} y={shape.y} width={shape.size} height={shape.size}
          transform={shape.rotation ? `rotate(${shape.rotation} ${shape.x + shape.size / 2} ${shape.y + shape.size / 2})` : undefined}
          {...common}
        />
      );
    case 'rect':
      return (
        <rect
          key={shape.id}
          x={shape.x} y={shape.y} width={shape.w} height={shape.h}
          transform={shape.rotation ? `rotate(${shape.rotation} ${shape.x + shape.w / 2} ${shape.y + shape.h / 2})` : undefined}
          {...common}
        />
      );
    case 'triangle':
      return (
        <polygon key={shape.id} points={shape.points.map((p) => p.join(',')).join(' ')} {...common} />
      );
    case 'disc':
      return <circle key={shape.id} cx={shape.cx} cy={shape.cy} r={shape.r} {...common} />;
    default:
      return null;
  }
}

/**
 * Renders any geometry spec.
 * @param selectedColors map { [shapeId]: cssColor } for interactive colouring
 * @param onTapShape (shape) => void
 * @param showCorrection draws the full/answer overlay when available
 */
export function GeometryFigure({ spec, selectable = false, selectedColors = {}, onTapShape, showCorrection = false }) {
  return (
    <svg viewBox="0 0 100 100" className="geo-svg" role="img" aria-label="figure géométrique">
      {spec.kind === 'grid' && <GridBackground />}
      {spec.kind === 'grid' && spec.segments.map((s, i) => (
        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
          stroke={s.color || '#e74c3c'} strokeWidth={2.4} strokeLinecap="round" />
      ))}
      {spec.kind === 'grid' && showCorrection && spec.correction?.map((s, i) => (
        <line key={`c${i}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
          stroke="#27ae60" strokeWidth={2.4} strokeDasharray="4 3" strokeLinecap="round" />
      ))}

      {spec.kind === 'collection' && spec.shapes.map((shape) =>
        shapeElement(shape, {
          selectable,
          fill: selectedColors[shape.id] || shape.fill,
          onTap: onTapShape,
        })
      )}
    </svg>
  );
}

function GridBackground() {
  const lines = [];
  for (let i = 10; i <= 90; i += 10) {
    lines.push(<line key={`v${i}`} x1={i} y1={10} x2={i} y2={90} stroke="#dfe6ef" strokeWidth={0.6} />);
    lines.push(<line key={`h${i}`} x1={10} y1={i} x2={90} y2={i} stroke="#dfe6ef" strokeWidth={0.6} />);
  }
  return <g>{lines}</g>;
}

// ── Spec builders (used by the exercise engine) ──────────────────────────────

let _sid = 0;
const sid = () => `s${++_sid}`;

export function square(x, y, size, rotation = 0) { return { id: sid(), type: 'square', x, y, size, rotation }; }
export function rect(x, y, w, h, rotation = 0) { return { id: sid(), type: 'rect', x, y, w, h, rotation }; }
export function triangle(points) { return { id: sid(), type: 'triangle', points }; }
export function disc(cx, cy, r) { return { id: sid(), type: 'disc', cx, cy, r }; }

export function collection(shapes) { return { kind: 'collection', shapes }; }
export function grid(segments, correction) { return { kind: 'grid', segments, correction }; }

// Reference figures used in the properties table.
export function referenceShape(type) {
  switch (type) {
    case 'carre': return collection([square(25, 25, 50)]);
    case 'rectangle': return collection([rect(15, 32, 70, 36)]);
    case 'triangle': return collection([triangle([[50, 18], [18, 82], [82, 82]])]);
    case 'disque': return collection([disc(50, 50, 32)]);
    default: return collection([]);
  }
}

// ── Hand-crafted compositions with KNOWN counts (for "compter") ──────────────

/** Big triangle split by a median: 2 small + 1 big = 3 triangles. */
export function triangleDivided() {
  const A = [50, 14], B = [16, 84], C = [84, 84], M = [50, 84];
  return {
    spec: collection([
      triangle([A, B, M]),
      triangle([A, M, C]),
      triangle([A, B, C]),
    ]),
    triangles: 3,
  };
}

/** Triforce: 4 small + 1 big = 5 triangles. */
export function triangleTriforce() {
  const A = [50, 12], B = [14, 86], C = [86, 86];
  const mAB = [32, 49], mAC = [68, 49], mBC = [50, 86];
  return {
    spec: collection([
      triangle([A, mAB, mAC]),
      triangle([mAB, B, mBC]),
      triangle([mAC, mBC, C]),
      triangle([mAB, mAC, mBC]),
      triangle([A, B, C]),
    ]),
    triangles: 5,
  };
}

/** Nested squares: 3 squares (one inside another). */
export function nestedSquares() {
  return {
    spec: collection([square(12, 12, 76), square(28, 28, 44), square(42, 42, 16)]),
    squares: 3,
  };
}
