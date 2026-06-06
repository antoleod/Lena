// ─────────────────────────────────────────────────────────────────────────────
// Small SVG visual aids for maths — school-worksheet style.
//
// A "visual" descriptor (attached to some exercises) looks like:
//   { kind: 'dots', groups: [ { n: 2, op: null }, { n: 4, op: '+' }, ... ] }
//
// Each group is drawn as a real SVG cluster of countable dots, with the
// operator drawn between groups. Only attached when numbers are small enough
// to be helpful (otherwise the exercise has no `visual`).
// ─────────────────────────────────────────────────────────────────────────────

export { buildDotsVisual } from './mathVisualUtils.js';

const COLORS = ['#ff8fc6', '#5dade2', '#58d68d', '#f5b041', '#bb8fce'];

function DotGroup({ n, color, faded }) {
  const perRow = 5;
  const rows = Math.max(1, Math.ceil(n / perRow));
  const cols = Math.min(n, perRow);
  const cell = 14;
  const w = Math.max(1, cols) * cell;
  const h = rows * cell;
  const dots = [];
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / perRow);
    const c = i % perRow;
    dots.push(
      <circle
        key={i}
        cx={c * cell + cell / 2}
        cy={r * cell + cell / 2}
        r={5}
        fill={faded ? 'transparent' : color}
        stroke={color}
        strokeWidth={faded ? 1.6 : 1}
        strokeDasharray={faded ? '2 2' : undefined}
      />
    );
  }
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w * 1.6} height={h * 1.6} role="img" aria-label={`${n}`}>
      {dots}
    </svg>
  );
}

function ArrayDots({ rows, cols }) {
  const cell = 14;
  const w = cols * cell;
  const h = rows * cell;
  const dots = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    dots.push(
      <circle key={`${r}-${c}`} cx={c * cell + cell / 2} cy={r * cell + cell / 2} r={5}
        fill={COLORS[r % COLORS.length]} stroke={COLORS[r % COLORS.length]} strokeWidth={1} />
    );
  }
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w * 1.6} height={h * 1.6} role="img" aria-label={`${rows} × ${cols}`}>
      {dots}
    </svg>
  );
}

export default function MathVisualSvg({ visual }) {
  if (!visual) return null;
  if (visual.kind === 'array') {
    return (
      <div className="math-visual" aria-hidden="false">
        <span className="math-visual__group">
          <ArrayDots rows={visual.rows} cols={visual.cols} />
          <span className="math-visual__caption">{visual.rows} rangées × {visual.cols}</span>
        </span>
      </div>
    );
  }
  if (visual.kind !== 'dots' || !Array.isArray(visual.groups)) return null;
  return (
    <div className="math-visual" aria-hidden="false">
      {visual.groups.map((g, i) => (
        <span className="math-visual__group" key={i}>
          {i > 0 && <span className="math-visual__op">{g.op}</span>}
          <DotGroup n={g.n} color={COLORS[i % COLORS.length]} faded={g.op === '−' || g.op === '-'} />
        </span>
      ))}
    </div>
  );
}
