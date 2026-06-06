// ─────────────────────────────────────────────────────────────────────────────
// Pure figure-spec builders (NO JSX) — safe to import from the engine and tests.
// The <GeometryFigure> React renderer lives in geometrySvgFactory.jsx and only
// consumes these specs.
//
// Spec/shape contract: see geometrySvgFactory.jsx header.
// ─────────────────────────────────────────────────────────────────────────────

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
    spec: collection([triangle([A, B, M]), triangle([A, M, C]), triangle([A, B, C])]),
    triangles: 3,
  };
}

/** Triforce: 4 small + 1 big = 5 triangles. */
export function triangleTriforce() {
  const A = [50, 12], B = [14, 86], C = [86, 86];
  const mAB = [32, 49], mAC = [68, 49], mBC = [50, 86];
  return {
    spec: collection([
      triangle([A, mAB, mAC]), triangle([mAB, B, mBC]), triangle([mAC, mBC, C]),
      triangle([mAB, mAC, mBC]), triangle([A, B, C]),
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
