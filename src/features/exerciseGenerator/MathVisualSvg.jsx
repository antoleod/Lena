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

function PlaceValueBlocks({ tens, units }) {
  const cell = 7, gap = 6;
  const rodW = cell, rodH = cell * 10;
  const rods = [];
  for (let t = 0; t < tens; t++) {
    const x = t * (rodW + 3);
    const cubes = [];
    for (let k = 0; k < 10; k++) cubes.push(
      <rect key={k} x={x} y={k * cell} width={cell - 1} height={cell - 1} rx={1} fill="#5dade2" stroke="#2e86c1" strokeWidth={0.5} />
    );
    rods.push(<g key={`r${t}`}>{cubes}</g>);
  }
  const unitsX = tens * (rodW + 3) + gap;
  const cubes = [];
  for (let u = 0; u < units; u++) {
    const col = u % 1, row = u; // single column of unit cubes
    cubes.push(<rect key={u} x={unitsX} y={row * cell} width={cell - 1} height={cell - 1} rx={1} fill="#f5b041" stroke="#d68910" strokeWidth={0.5} />);
  }
  const w = unitsX + cell + 2;
  return (
    <span className="math-visual__group">
      <svg viewBox={`0 0 ${w} ${rodH}`} width={Math.min(220, w * 2.2)} height={rodH * 2.2} role="img" aria-label={`${tens} dizaines et ${units} unités`}>
        {rods}{cubes}
      </svg>
      <span className="math-visual__caption">{tens} dizaine(s) + {units} unité(s)</span>
    </span>
  );
}

export default function MathVisualSvg({ visual }) {
  if (!visual) return null;
  if (visual.kind === 'placevalue') {
    return <div className="math-visual"><PlaceValueBlocks tens={visual.tens} units={visual.units} /></div>;
  }
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
