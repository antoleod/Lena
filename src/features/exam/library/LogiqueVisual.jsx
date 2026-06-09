/**
 * LogiqueVisual — renders inline SVG illustrations for logique exam questions.
 *
 * Supported visual types:
 *   shape-sequence  — row of shapes, last one is usually "?"
 *   shape-grid      — 2D grid of shapes (latin-square puzzles)
 *   color-sequence  — row of colored circles
 *   equation        — left side = right side with a missing "?"
 *   number-sequence — row of numbers with one missing
 */

const SHAPE_SIZE = 34;
const GAP = 10;

/* ── palette ───────────────────────────────────────────────────── */
const SHAPE_COLOR  = '#3b82f6'; // blue-500
const FILL_COLOR   = '#3b82f6';
const EMPTY_FILL   = 'none';
const MISSING_CLR  = '#94a3b8'; // slate-400
const STROKE_W     = 2.5;

const COLOR_MAP = {
  '🔴': '#ef4444',
  '🟡': '#eab308',
  '🔵': '#3b82f6',
  '🟢': '#22c55e',
  '🟠': '#f97316',
  '🟣': '#a855f7',
  R: '#ef4444',
  B: '#3b82f6',
  G: '#22c55e',
  J: '#eab308',
};

/* ── single shape ──────────────────────────────────────────────── */
function Shape({ symbol, x, y, size = SHAPE_SIZE }) {
  const s = String(symbol).trim();
  const isMissing = s === '?';
  const color = isMissing ? MISSING_CLR : SHAPE_COLOR;
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size / 2 - 3;
  const pad = 4;

  if (isMissing) {
    return (
      <>
        <rect x={x + 1} y={y + 1} width={size - 2} height={size - 2} rx={6}
          fill="#f1f5f9" stroke={MISSING_CLR} strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={cx} y={cy + 6} textAnchor="middle" fontSize={size * 0.65}
          fill={MISSING_CLR} fontWeight="700">?</text>
      </>
    );
  }

  switch (s) {
    case '○':
      return <circle cx={cx} cy={cy} r={r} fill={EMPTY_FILL} stroke={color} strokeWidth={STROKE_W} />;
    case '□':
      return <rect x={x + pad} y={y + pad} width={size - pad * 2} height={size - pad * 2}
        fill={EMPTY_FILL} stroke={color} strokeWidth={STROKE_W} />;
    case '■':
      return <rect x={x + pad} y={y + pad} width={size - pad * 2} height={size - pad * 2}
        fill={FILL_COLOR} stroke={color} strokeWidth={STROKE_W} />;
    case '△': {
      const pts = `${cx},${y + pad} ${x + pad},${y + size - pad} ${x + size - pad},${y + size - pad}`;
      return <polygon points={pts} fill={EMPTY_FILL} stroke={color} strokeWidth={STROKE_W} />;
    }
    case '▲': {
      const pts = `${cx},${y + pad} ${x + pad},${y + size - pad} ${x + size - pad},${y + size - pad}`;
      return <polygon points={pts} fill={FILL_COLOR} stroke={color} strokeWidth={STROKE_W} />;
    }
    case '◇': {
      const pts = `${cx},${y + pad} ${x + size - pad},${cy} ${cx},${y + size - pad} ${x + pad},${cy}`;
      return <polygon points={pts} fill={EMPTY_FILL} stroke={color} strokeWidth={STROKE_W} />;
    }
    case '★': {
      // 5-pointed star
      const pts = Array.from({ length: 10 }, (_, i) => {
        const ang = (Math.PI / 5) * i - Math.PI / 2;
        const rr = i % 2 === 0 ? r : r * 0.42;
        return `${cx + rr * Math.cos(ang)},${cy + rr * Math.sin(ang)}`;
      }).join(' ');
      return <polygon points={pts} fill={FILL_COLOR} stroke={color} strokeWidth={1} />;
    }
    case '☆': {
      const pts = Array.from({ length: 10 }, (_, i) => {
        const ang = (Math.PI / 5) * i - Math.PI / 2;
        const rr = i % 2 === 0 ? r : r * 0.42;
        return `${cx + rr * Math.cos(ang)},${cy + rr * Math.sin(ang)}`;
      }).join(' ');
      return <polygon points={pts} fill={EMPTY_FILL} stroke={color} strokeWidth={STROKE_W} />;
    }
    default: {
      // Emoji color circles
      if (COLOR_MAP[s]) {
        return <circle cx={cx} cy={cy} r={r} fill={COLOR_MAP[s]} />;
      }
      // Fallback: text label
      return (
        <>
          <rect x={x + 1} y={y + 1} width={size - 2} height={size - 2} rx={4}
            fill="#eff6ff" stroke={color} strokeWidth={1.5} />
          <text x={cx} y={cy + 5} textAnchor="middle"
            fontSize={Math.min(size * 0.5, 14)} fill={color} fontWeight="600">
            {s.length > 3 ? s.slice(0, 3) : s}
          </text>
        </>
      );
    }
  }
}

/* ── shape-sequence ────────────────────────────────────────────── */
function ShapeSequence({ items, groups }) {
  // groups: array of arrays (grouped display like [["▲","▲"],["▲","▲","▲"]])
  const list = groups ? groups : [items];

  // Calculate total width
  const groupWidths = list.map((g) => g.length * (SHAPE_SIZE + GAP) - GAP);
  const totalWidth = groupWidths.reduce((s, w) => s + w, 0) + (list.length - 1) * (GAP * 3);
  const height = SHAPE_SIZE;

  let offsetX = 0;
  return (
    <svg
      width={Math.min(totalWidth, 520)}
      height={height + 4}
      viewBox={`0 0 ${totalWidth} ${height + 4}`}
      style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }}
      aria-hidden="true"
    >
      {list.map((group, gi) => {
        const gx = offsetX;
        offsetX += groupWidths[gi] + GAP * 3;
        return (
          <g key={gi}>
            {/* Group separator dot */}
            {gi > 0 && (
              <circle cx={gx - GAP * 1.5} cy={height / 2 + 2} r={2.5} fill="#cbd5e1" />
            )}
            {group.map((sym, si) => (
              <Shape key={si} symbol={sym} x={gx + si * (SHAPE_SIZE + GAP)} y={2} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

/* ── shape-grid ────────────────────────────────────────────────── */
function ShapeGrid({ rows, highlight }) {
  const cols = Math.max(...rows.map((r) => r.length));
  const cellSize = SHAPE_SIZE + 6;
  const gap = 4;
  const totalW = cols * cellSize + (cols - 1) * gap;
  const totalH = rows.length * cellSize + (rows.length - 1) * gap;

  return (
    <svg
      width={totalW + 4}
      height={totalH + 4}
      viewBox={`0 0 ${totalW + 4} ${totalH + 4}`}
      style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }}
      aria-hidden="true"
    >
      {rows.map((row, ri) =>
        row.map((sym, ci) => {
          const x = 2 + ci * (cellSize + gap);
          const y = 2 + ri * (cellSize + gap);
          const isHL = highlight && highlight[ri] === ci;
          return (
            <g key={`${ri}-${ci}`}>
              <rect x={x} y={y} width={cellSize} height={cellSize} rx={6}
                fill={isHL ? '#eff6ff' : '#f8fafc'}
                stroke={isHL ? '#3b82f6' : '#e2e8f0'}
                strokeWidth={isHL ? 2 : 1.5} />
              <Shape symbol={sym} x={x + 3} y={y + 3} size={SHAPE_SIZE} />
            </g>
          );
        })
      )}
    </svg>
  );
}

/* ── color-grid (sudoku style) ─────────────────────────────────── */
function ColorGrid({ rows, labels }) {
  const cols = Math.max(...rows.map((r) => r.length));
  const cell = 38;
  const gap = 4;
  const totalW = cols * cell + (cols - 1) * gap;
  const totalH = rows.length * cell + (rows.length - 1) * gap;

  return (
    <svg
      width={totalW + 4}
      height={totalH + 4}
      viewBox={`0 0 ${totalW + 4} ${totalH + 4}`}
      style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }}
      aria-hidden="true"
    >
      {rows.map((row, ri) =>
        row.map((sym, ci) => {
          const x = 2 + ci * (cell + gap);
          const y = 2 + ri * (cell + gap);
          const isMissing = sym === '?';
          const clr = COLOR_MAP[sym] || '#94a3b8';
          return (
            <g key={`${ri}-${ci}`}>
              <rect x={x} y={y} width={cell} height={cell} rx={7}
                fill={isMissing ? '#f1f5f9' : clr + '33'}
                stroke={isMissing ? '#94a3b8' : clr}
                strokeWidth={2}
                strokeDasharray={isMissing ? '4 3' : undefined} />
              {isMissing
                ? <text x={x + cell / 2} y={y + cell / 2 + 6} textAnchor="middle"
                    fontSize={20} fill="#94a3b8" fontWeight="700">?</text>
                : <circle cx={x + cell / 2} cy={y + cell / 2} r={cell / 2 - 8} fill={clr} />
              }
              {labels && <text x={x + cell / 2} y={y + cell - 5} textAnchor="middle"
                fontSize={9} fill={isMissing ? '#94a3b8' : clr} fontWeight="600">{sym}</text>}
            </g>
          );
        })
      )}
    </svg>
  );
}

/* ── equation ──────────────────────────────────────────────────── */
function EquationVisual({ left, right }) {
  const W = 260;
  const H = 60;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }}
      aria-hidden="true">
      {/* left box */}
      <rect x={8} y={10} width={100} height={40} rx={8}
        fill="#eff6ff" stroke="#3b82f6" strokeWidth={2} />
      <text x={58} y={36} textAnchor="middle" fontSize={18}
        fill="#1d4ed8" fontWeight="700">{left}</text>
      {/* equals */}
      <text x={138} y={38} textAnchor="middle" fontSize={22}
        fill="#475569" fontWeight="700">=</text>
      {/* right box */}
      <rect x={152} y={10} width={100} height={40} rx={8}
        fill="#f0fdf4" stroke="#22c55e" strokeWidth={2} />
      <text x={202} y={36} textAnchor="middle" fontSize={18}
        fill="#15803d" fontWeight="700">{right}</text>
    </svg>
  );
}

/* ── number-sequence ───────────────────────────────────────────── */
function NumberSequence({ items }) {
  const cellW = 46;
  const cellH = 44;
  const gap = 8;
  const totalW = items.length * cellW + (items.length - 1) * gap;

  return (
    <svg width={totalW} height={cellH + 4}
      viewBox={`0 0 ${totalW} ${cellH + 4}`}
      style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }}
      aria-hidden="true">
      {items.map((n, i) => {
        const x = i * (cellW + gap);
        const isMissing = String(n) === '?';
        return (
          <g key={i}>
            <rect x={x} y={2} width={cellW} height={cellH} rx={8}
              fill={isMissing ? '#f1f5f9' : '#eff6ff'}
              stroke={isMissing ? '#94a3b8' : '#3b82f6'}
              strokeWidth={2}
              strokeDasharray={isMissing ? '4 3' : undefined} />
            <text x={x + cellW / 2} y={cellH / 2 + 8} textAnchor="middle"
              fontSize={isMissing ? 22 : 18}
              fill={isMissing ? '#94a3b8' : '#1d4ed8'}
              fontWeight="700">{n}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── rotation-arrow ────────────────────────────────────────────── */
function RotationArrow({ steps, degreesPerStep }) {
  const total = (steps * degreesPerStep) % 360;
  const rad = (total - 90) * (Math.PI / 180);
  const R = 28;
  const cx = 40;
  const cy = 40;
  const ex = cx + R * Math.cos(rad);
  const ey = cy + R * Math.sin(rad);

  return (
    <svg width={80} height={80} viewBox="0 0 80 80"
      style={{ display: 'block', margin: '0 auto' }}
      aria-hidden="true">
      <circle cx={cx} cy={cy} r={R + 4} fill="#eff6ff" stroke="#3b82f6" strokeWidth={1.5} />
      {/* degree markings */}
      {[0, 90, 180, 270].map((deg) => {
        const a = (deg - 90) * (Math.PI / 180);
        return <line key={deg} x1={cx + (R - 4) * Math.cos(a)} y1={cy + (R - 4) * Math.sin(a)}
          x2={cx + (R + 2) * Math.cos(a)} y2={cy + (R + 2) * Math.sin(a)}
          stroke="#cbd5e1" strokeWidth={1.5} />;
      })}
      {/* arrow */}
      <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="#3b82f6" strokeWidth={3} strokeLinecap="round" />
      <circle cx={ex} cy={ey} r={4} fill="#3b82f6" />
      <circle cx={cx} cy={cy} r={4} fill="#1d4ed8" />
      <text x={cx} y={cy + R + 16} textAnchor="middle" fontSize={10} fill="#64748b">{total}°</text>
    </svg>
  );
}

/* ── main export ───────────────────────────────────────────────── */
export default function LogiqueVisual({ visual }) {
  if (!visual) return null;
  const { type } = visual;

  let content = null;
  switch (type) {
    case 'shape-sequence':
      content = <ShapeSequence items={visual.items} groups={visual.groups} />;
      break;
    case 'shape-grid':
      content = <ShapeGrid rows={visual.rows} highlight={visual.highlight} />;
      break;
    case 'color-grid':
      content = <ColorGrid rows={visual.rows} labels={visual.labels} />;
      break;
    case 'equation':
      content = <EquationVisual left={visual.left} right={visual.right} />;
      break;
    case 'number-sequence':
      content = <NumberSequence items={visual.items} />;
      break;
    case 'rotation':
      content = <RotationArrow steps={visual.steps} degreesPerStep={visual.degreesPerStep} />;
      break;
    default:
      return null;
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '12px 8px 4px',
      overflowX: 'auto',
    }}>
      {content}
    </div>
  );
}
