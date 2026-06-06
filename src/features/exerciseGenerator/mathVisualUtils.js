// Pure helper (no JSX) to build a dots-visual descriptor for small maths
// expressions. Returns null when the numbers are too big to help visually.
//
// values: [n0, n1, …]; ops: ['+', '−', …] (length values.length - 1)
export function buildDotsVisual(values, ops) {
  if (!Array.isArray(values) || values.length > 4) return null;
  if (values.some((v) => v > 10)) return null;
  if (ops.some((o) => o === '×' || o === 'x' || o === '÷')) return null;
  const groups = values.map((n, i) => ({ n, op: i === 0 ? null : ops[i - 1] }));
  return { kind: 'dots', groups };
}

/** A rows×cols dot matrix — the classic "array" model for multiplication. */
export function buildArrayVisual(rows, cols) {
  if (!Number.isInteger(rows) || !Number.isInteger(cols)) return null;
  if (rows < 1 || cols < 1 || rows > 6 || cols > 6) return null;
  return { kind: 'array', rows, cols };
}
