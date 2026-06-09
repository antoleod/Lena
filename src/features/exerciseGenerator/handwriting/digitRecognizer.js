const GRID_SIZE = 28;
const STROKE_THICKNESS = 2.2;
const TEMPLATE_PADDING = 4;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getBounds(strokes) {
  const points = strokes.flatMap((stroke) => stroke.points || []);
  if (!points.length) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const point of points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  return { minX, minY, maxX, maxY };
}

function normalizeStrokes(strokes, size = GRID_SIZE, padding = TEMPLATE_PADDING) {
  const bounds = getBounds(strokes);
  if (!bounds) return [];

  const width = Math.max(1, bounds.maxX - bounds.minX);
  const height = Math.max(1, bounds.maxY - bounds.minY);
  const inner = size - padding * 2;
  const scale = inner / Math.max(width, height);
  const offsetX = (size - width * scale) / 2;
  const offsetY = (size - height * scale) / 2;

  return strokes
    .filter((stroke) => (stroke.points || []).length > 0)
    .map((stroke) => ({
      points: stroke.points.map((point) => ({
        x: (point.x - bounds.minX) * scale + offsetX,
        y: (point.y - bounds.minY) * scale + offsetY,
      })),
    }));
}

function stamp(grid, x, y, radius) {
  const minX = Math.floor(x - radius);
  const maxX = Math.ceil(x + radius);
  const minY = Math.floor(y - radius);
  const maxY = Math.ceil(y + radius);

  for (let gy = minY; gy <= maxY; gy += 1) {
    for (let gx = minX; gx <= maxX; gx += 1) {
      if (gx < 0 || gy < 0 || gx >= GRID_SIZE || gy >= GRID_SIZE) continue;
      if (Math.hypot(gx - x, gy - y) <= radius) {
        grid[gy * GRID_SIZE + gx] = 1;
      }
    }
  }
}

function rasterizeNormalizedStrokes(strokes, thickness = STROKE_THICKNESS) {
  const grid = new Float32Array(GRID_SIZE * GRID_SIZE);

  for (const stroke of strokes) {
    const points = stroke.points || [];
    if (points.length === 1) {
      stamp(grid, points[0].x, points[0].y, thickness);
      continue;
    }

    for (let i = 1; i < points.length; i += 1) {
      const prev = points[i - 1];
      const next = points[i];
      const steps = Math.max(1, Math.ceil(distance(prev, next) * 1.8));
      for (let step = 0; step <= steps; step += 1) {
        const t = step / steps;
        const x = prev.x + (next.x - prev.x) * t;
        const y = prev.y + (next.y - prev.y) * t;
        stamp(grid, x, y, thickness);
      }
    }
  }

  return grid;
}

function path(points) {
  return { points };
}

function digitTemplates() {
  return {
    '0': [
      [path([{ x: 30, y: 10 }, { x: 18, y: 28 }, { x: 18, y: 72 }, { x: 30, y: 90 }, { x: 70, y: 90 }, { x: 82, y: 72 }, { x: 82, y: 28 }, { x: 70, y: 10 }, { x: 30, y: 10 }])],
    ],
    '1': [
      [path([{ x: 48, y: 18 }, { x: 58, y: 10 }, { x: 58, y: 90 }])],
      [path([{ x: 36, y: 28 }, { x: 56, y: 10 }, { x: 56, y: 90 }])],
    ],
    '2': [
      [path([{ x: 22, y: 28 }, { x: 34, y: 12 }, { x: 68, y: 12 }, { x: 80, y: 28 }, { x: 26, y: 86 }, { x: 82, y: 86 }])],
    ],
    '3': [
      [path([{ x: 24, y: 18 }, { x: 72, y: 18 }, { x: 58, y: 50 }, { x: 76, y: 50 }, { x: 58, y: 86 }, { x: 24, y: 82 }])],
    ],
    '4': [
      [path([{ x: 70, y: 10 }, { x: 70, y: 90 }]), path([{ x: 18, y: 58 }, { x: 82, y: 58 }]), path([{ x: 22, y: 58 }, { x: 64, y: 12 }])],
    ],
    '5': [
      [path([{ x: 76, y: 12 }, { x: 30, y: 12 }, { x: 24, y: 48 }, { x: 62, y: 48 }, { x: 78, y: 62 }, { x: 66, y: 86 }, { x: 26, y: 82 }])],
    ],
    '6': [
      [path([{ x: 72, y: 16 }, { x: 34, y: 38 }, { x: 24, y: 62 }, { x: 34, y: 86 }, { x: 66, y: 86 }, { x: 78, y: 64 }, { x: 62, y: 44 }, { x: 30, y: 52 }])],
    ],
    '7': [
      [path([{ x: 20, y: 14 }, { x: 82, y: 14 }, { x: 42, y: 90 }])],
    ],
    '8': [
      [path([{ x: 36, y: 12 }, { x: 24, y: 28 }, { x: 34, y: 46 }, { x: 64, y: 46 }, { x: 76, y: 28 }, { x: 64, y: 12 }, { x: 36, y: 12 }]), path([{ x: 34, y: 48 }, { x: 24, y: 68 }, { x: 36, y: 88 }, { x: 64, y: 88 }, { x: 76, y: 68 }, { x: 64, y: 48 }, { x: 34, y: 48 }])],
      [path([{ x: 36, y: 12 }, { x: 24, y: 28 }, { x: 34, y: 50 }, { x: 24, y: 70 }, { x: 38, y: 88 }, { x: 64, y: 88 }, { x: 76, y: 70 }, { x: 66, y: 50 }, { x: 76, y: 28 }, { x: 64, y: 12 }, { x: 36, y: 12 }])],
    ],
    '9': [
      [path([{ x: 70, y: 48 }, { x: 34, y: 48 }, { x: 22, y: 30 }, { x: 34, y: 12 }, { x: 66, y: 12 }, { x: 80, y: 32 }, { x: 72, y: 72 }, { x: 48, y: 88 }, { x: 24, y: 88 }])],
    ],
  };
}

const TEMPLATE_LIBRARY = Object.entries(digitTemplates()).flatMap(([digit, variants]) =>
  variants.map((variant) => {
    const normalized = normalizeStrokes(variant, GRID_SIZE, TEMPLATE_PADDING);
    return { digit, grid: rasterizeNormalizedStrokes(normalized) };
  }),
);

function compareGrid(a, b) {
  let overlap = 0;
  let inkA = 0;
  let inkB = 0;

  for (let i = 0; i < a.length; i += 1) {
    if (a[i] > 0) inkA += 1;
    if (b[i] > 0) inkB += 1;
    if (a[i] > 0 && b[i] > 0) overlap += 1;
  }

  if (!inkA || !inkB) return 0;
  return (2 * overlap) / (inkA + inkB);
}

function countInk(grid) {
  let count = 0;
  for (const cell of grid) {
    if (cell > 0) count += 1;
  }
  return count;
}

function getFeatureRatios(grid) {
  let top = 0;
  let bottom = 0;
  let left = 0;
  let right = 0;
  let center = 0;
  let total = 0;

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const cell = grid[y * GRID_SIZE + x];
      if (!cell) continue;
      total += 1;
      if (y < GRID_SIZE / 2) top += 1; else bottom += 1;
      if (x < GRID_SIZE / 2) left += 1; else right += 1;
      if (x > GRID_SIZE * 0.28 && x < GRID_SIZE * 0.72 && y > GRID_SIZE * 0.28 && y < GRID_SIZE * 0.72) {
        center += 1;
      }
    }
  }

  if (!total) {
    return { topRatio: 0, bottomRatio: 0, leftRatio: 0, rightRatio: 0, centerRatio: 0 };
  }

  return {
    topRatio: top / total,
    bottomRatio: bottom / total,
    leftRatio: left / total,
    rightRatio: right / total,
    centerRatio: center / total,
  };
}

function countInteriorHoles(grid) {
  const visited = new Uint8Array(GRID_SIZE * GRID_SIZE);
  const index = (x, y) => y * GRID_SIZE + x;
  const queue = [];

  function flood(sx, sy) {
    let touchesBorder = false;
    let head = 0;
    queue.length = 0;
    queue.push([sx, sy]);
    visited[index(sx, sy)] = 1;

    while (head < queue.length) {
      const [x, y] = queue[head++];
      if (x === 0 || y === 0 || x === GRID_SIZE - 1 || y === GRID_SIZE - 1) {
        touchesBorder = true;
      }
      const neighbors = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
      for (const [nx, ny] of neighbors) {
        if (nx < 0 || ny < 0 || nx >= GRID_SIZE || ny >= GRID_SIZE) continue;
        const idx = index(nx, ny);
        if (visited[idx] || grid[idx] > 0) continue;
        visited[idx] = 1;
        queue.push([nx, ny]);
      }
    }

    return touchesBorder ? 0 : 1;
  }

  let holes = 0;
  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const idx = index(x, y);
      if (visited[idx] || grid[idx] > 0) continue;
      holes += flood(x, y);
    }
  }
  return holes;
}

function analyzeGeometry(strokes, grid) {
  const bounds = getBounds(strokes);
  const points = strokes.flatMap((stroke) => stroke.points || []);
  const width = Math.max(1, (bounds?.maxX || 0) - (bounds?.minX || 0));
  const height = Math.max(1, (bounds?.maxY || 0) - (bounds?.minY || 0));
  const strokeCount = strokes.length;
  const aspectRatio = width / height;
  const first = points[0];
  const last = points[points.length - 1];
  const endpointDistance = first && last ? distance(first, last) / Math.max(width, height) : 1;
  const { topRatio, bottomRatio, leftRatio, rightRatio, centerRatio } = getFeatureRatios(grid);
  const holes = countInteriorHoles(grid);

  return {
    strokeCount,
    aspectRatio,
    endpointDistance,
    topRatio,
    bottomRatio,
    leftRatio,
    rightRatio,
    centerRatio,
    holes,
  };
}

function heuristicBonus(digit, features) {
  let bonus = 0;

  if (digit === '0') {
    if (features.holes >= 1) bonus += 0.18;
    if (features.endpointDistance < 0.28) bonus += 0.12;
    if (features.aspectRatio > 0.55 && features.aspectRatio < 1.1) bonus += 0.08;
  }

  if (digit === '1') {
    if (features.strokeCount <= 2) bonus += 0.12;
    if (features.aspectRatio < 0.55) bonus += 0.18;
    if (features.centerRatio > 0.36) bonus += 0.06;
  }

  if (digit === '2') {
    if (features.topRatio > features.bottomRatio * 0.9) bonus += 0.06;
    if (features.rightRatio > 0.48) bonus += 0.08;
    if (features.holes === 0) bonus += 0.05;
  }

  if (digit === '3') {
    if (features.rightRatio > 0.55) bonus += 0.14;
    if (features.leftRatio < 0.48) bonus += 0.06;
    if (features.holes === 0) bonus += 0.04;
  }

  if (digit === '4') {
    if (features.strokeCount >= 2) bonus += 0.16;
    if (features.rightRatio > 0.5) bonus += 0.08;
    if (features.centerRatio > 0.28) bonus += 0.05;
  }

  if (digit === '5') {
    if (features.leftRatio > 0.5) bonus += 0.1;
    if (features.topRatio > 0.5) bonus += 0.08;
    if (features.holes === 0) bonus += 0.04;
  }

  if (digit === '6') {
    if (features.holes >= 1) bonus += 0.14;
    if (features.leftRatio > 0.5) bonus += 0.08;
    if (features.bottomRatio > 0.5) bonus += 0.08;
  }

  if (digit === '7') {
    if (features.topRatio > 0.38) bonus += 0.08;
    if (features.rightRatio > 0.46) bonus += 0.06;
    if (features.aspectRatio > 0.55) bonus += 0.04;
  }

  if (digit === '8') {
    if (features.holes >= 2) bonus += 0.24;
    else if (features.holes === 1) bonus += 0.1;
    if (features.centerRatio > 0.22) bonus += 0.06;
    if (features.aspectRatio > 0.55 && features.aspectRatio < 1.05) bonus += 0.06;
  }

  if (digit === '9') {
    if (features.holes >= 1) bonus += 0.14;
    if (features.topRatio > 0.5) bonus += 0.1;
    if (features.rightRatio > 0.5) bonus += 0.08;
  }

  return bonus;
}

function geometricPenalty(digit, features) {
  let penalty = 0;

  if (digit === '1' && features.aspectRatio > 0.72) penalty += 0.12;
  if (digit === '0' && features.holes === 0 && features.endpointDistance > 0.45) penalty += 0.18;
  if (digit === '8' && features.holes === 0) penalty += 0.12;
  if (digit === '4' && features.strokeCount === 1 && features.aspectRatio < 0.45) penalty += 0.08;
  if (digit === '7' && features.leftRatio > 0.56) penalty += 0.08;
  if (digit === '5' && features.rightRatio > 0.62) penalty += 0.06;

  return penalty;
}

export function recognizeDigit(strokes) {
  if (!strokes || !strokes.length) {
    return { value: null, confidence: 0, candidates: [] };
  }

  const normalized = normalizeStrokes(strokes);
  const grid = rasterizeNormalizedStrokes(normalized);
  if (countInk(grid) < 18) {
    return { value: null, confidence: 0, candidates: [] };
  }

  const features = analyzeGeometry(normalized, grid);
  const bestByDigit = new Map();

  for (const template of TEMPLATE_LIBRARY) {
    const templateScore = compareGrid(grid, template.grid);
    const score = clamp(templateScore + heuristicBonus(template.digit, features) - geometricPenalty(template.digit, features), 0, 1.4);
    const current = bestByDigit.get(template.digit);
    if (!current || score > current.score) {
      bestByDigit.set(template.digit, { digit: template.digit, score, templateScore });
    }
  }

  const candidates = [...bestByDigit.values()].sort((a, b) => b.score - a.score);
  const best = candidates[0];
  const second = candidates[1];
  const confidence = clamp((best.score - (second?.score || 0)) + best.templateScore * 0.28, 0, 1);
  const value = confidence >= 0.24 && best.templateScore >= 0.34 ? best.digit : null;

  return {
    value,
    confidence,
    candidates: candidates.slice(0, 3).map(({ digit, score }) => ({ digit, score })),
  };
}

export function buildStroke(points) {
  return { points: (points || []).map((point) => ({ x: point.x, y: point.y })) };
}

export function createNoisyStroke(points, dx = 0, dy = 0) {
  return buildStroke(points.map((point, index) => ({
    x: point.x + dx + Math.sin(index) * 0.8,
    y: point.y + dy + Math.cos(index) * 0.8,
  })));
}
