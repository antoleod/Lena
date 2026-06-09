import LogiqueVisualImpl from './LogiqueVisual.jsx';

/**
 * ExamVisual — auto-generates SVG/visual illustrations for all exam categories.
 *
 * Usage:
 *   import ExamVisual, { autoVisual } from './ExamVisual.jsx';
 *   const vis = autoVisual(exam.category, currentQ);
 *   <ExamVisual visual={vis} />
 */

/* ─────────────────────────────────────────────────────────────
   AUTO-DETECT: derive a visual from category + question
───────────────────────────────────────────────────────────── */
export function autoVisual(category, question) {
  if (!question) return null;
  // Explicit field always wins (used by logique-11/12/13)
  if (question.visual) return question.visual;

  const p = (question.prompt || '').toLowerCase();
  const raw = question.prompt || '';

  switch (category) {

    /* ── Multiplication tables ─────────────────────────────── */
    case 'tables-multiplication': {
      const m = raw.match(/(\d+)\s*[×x]\s*(\d+)/);
      if (m) return { type: 'mult-dots', a: +m[1], b: +m[2] };
      break;
    }

    /* ── Mental arithmetic ────────────────────────────────── */
    case 'calcul-mental': {
      const m = raw.match(/^(\d+)\s*([\+\-×÷])\s*(\d+)/);
      if (m) return { type: 'calc-boxes', a: m[1], op: m[2], b: m[3] };
      break;
    }

    /* ── Fractions ────────────────────────────────────────── */
    case 'fractions': {
      const m = raw.match(/(\d+)\/(\d+)/);
      if (m) return { type: 'fraction-bar', num: +m[1], den: +m[2] };
      if (/moitié|demie?/.test(p)) return { type: 'fraction-bar', num: 1, den: 2 };
      if (/tiers/.test(p))         return { type: 'fraction-bar', num: 1, den: 3 };
      if (/quart/.test(p))         return { type: 'fraction-bar', num: 1, den: 4 };
      return { type: 'theme-icon', icon: '½', text: true, color: '#6366f1' };
    }

    /* ── Mesures ──────────────────────────────────────────── */
    case 'mesures': {
      const m = raw.match(/(\d+(?:[.,]\d+)?)\s*(cm|mm|m\b|km|kg|g\b|L\b|mL|h\b|min|s\b|€)/i);
      const toM = raw.match(/en\s*(cm|mm|m\b|km|kg|g\b|L\b|mL|h\b|min|s\b|centimes|€)/i);
      if (m) return { type: 'unit-arrow', value: m[1], from: m[2], to: toM?.[1] || '?' };
      break;
    }

    /* ── Géométrie ────────────────────────────────────────── */
    case 'geometrie': {
      const shapes = [
        [/triangle/, 'triangle'],
        [/carré|carre/, 'square'],
        [/rectangle/, 'rectangle'],
        [/cercle|disque/, 'circle'],
        [/hexagone/, 'hexagon'],
        [/pentagone/, 'pentagon'],
        [/losange/, 'diamond'],
        [/trapèze|trapeze/, 'trapezoid'],
      ];
      for (const [re, shape] of shapes) {
        if (re.test(p)) return { type: 'geo-shape', shape };
      }
      return { type: 'theme-icon', icon: '📐', color: '#8b5cf6' };
    }

    /* ── Word problems ───────────────────────────────────── */
    case 'problemes-mathematiques': {
      const nums = raw.match(/\d+/g);
      const ops = raw.match(/\+|\-|fois|donne|partage|enlève/gi);
      const op = ops ? ops[0] : null;
      if (nums) return { type: 'word-problem', numbers: nums.slice(0, 2).map(Number), op };
      break;
    }

    /* ── Sciences ────────────────────────────────────────── */
    case 'sciences': {
      const themes = [
        [/lune|nuit|étoile|astre/,            '🌙', '#1e3a5f'],
        [/soleil|jour|lumière|chaleur/,        '☀️', '#f59e0b'],
        [/plante|fleur|arbre|feuille|photosyn/,'🌿', '#22c55e'],
        [/carnivore|herbivore|chaîne|proie/,   '🦁', '#f97316'],
        [/eau|rivière|nuage|pluie|cycle/,      '💧', '#3b82f6'],
        [/corps|muscle|os|coeur|poumon|sang/,  '🫀', '#ef4444'],
        [/planète|terre|mars|jupiter|système/, '🪐', '#8b5cf6'],
        [/insecte|abeille|papillon|fourmi/,    '🦋', '#eab308'],
        [/matière|solide|liquide|gazeux|gaz/,  '🧪', '#06b6d4'],
        [/électricité|circuit|ampoule/,        '⚡', '#facc15'],
        [/force|vitesse|énergie|travail/,      '⚙️', '#64748b'],
        [/animal|mammifère|poisson|oiseau/,    '🐾', '#84cc16'],
      ];
      for (const [re, icon, color] of themes) {
        if (re.test(p)) return { type: 'theme-icon', icon, color };
      }
      return { type: 'theme-icon', icon: '🔬', color: '#6366f1' };
    }

    /* ── Calendrier & temps ──────────────────────────────── */
    case 'calendrier-temps': {
      const tM = raw.match(/(\d{1,2})\s*h\s*(\d{0,2})/);
      if (tM) return { type: 'clock-face', h: +tM[1] % 12, m: +(tM[2] || 0) };
      if (/saison|printemps|été|automne|hiver/.test(p)) {
        const s = /printemps/.test(p) ? '🌸' : /été/.test(p) ? '☀️' : /automne/.test(p) ? '🍂' : '❄️';
        const c = /printemps/.test(p) ? '#22c55e' : /été/.test(p) ? '#f59e0b' : /automne/.test(p) ? '#f97316' : '#3b82f6';
        return { type: 'theme-icon', icon: s, color: c };
      }
      return { type: 'theme-icon', icon: '📅', color: '#0ea5e9' };
    }

    /* ── Conjugaison ─────────────────────────────────────── */
    case 'conjugaison': {
      const m = raw.match(/«\s*([^»]+)\s*»/) || raw.match(/verbe\s+(\w+)/i);
      if (m) return { type: 'verb-card', verb: m[1].trim() };
      return { type: 'theme-icon', icon: '✏️', color: '#10b981' };
    }

    /* ── Orthographe ─────────────────────────────────────── */
    case 'orthographe': {
      const m = raw.match(/«\s*(\w+)\s*»/) || raw.match(/:\s*([\w,\s]+ou[\w\s]+)\?/);
      if (m) return { type: 'word-spotlight', word: m[1].trim().split(',')[0] };
      // pick shortest option (likely the correct word)
      const opts = (question.options || []).filter(Boolean);
      if (opts.length) {
        const shortest = opts.reduce((a, b) => a.length <= b.length ? a : b);
        return { type: 'word-spotlight', word: shortest };
      }
      return { type: 'theme-icon', icon: '🔡', color: '#f43f5e' };
    }

    /* ── Grammaire ───────────────────────────────────────── */
    case 'grammaire': {
      const themes = [
        [/nom\b/, '🏷️', '#3b82f6'],
        [/verbe/, '⚡', '#f59e0b'],
        [/adjectif/, '🎨', '#8b5cf6'],
        [/article/, '📌', '#ef4444'],
        [/pluriel|singulier/, '1️⃣', '#06b6d4'],
        [/féminin|masculin/, '⚖️', '#22c55e'],
        [/sujet|complément/, '🔍', '#f97316'],
        [/phrase|ponctuation/, '💬', '#10b981'],
      ];
      for (const [re, icon, color] of themes) {
        if (re.test(p)) return { type: 'theme-icon', icon, color };
      }
      return { type: 'theme-icon', icon: '🧩', color: '#10b981' };
    }

    /* ── Vocabulaire ─────────────────────────────────────── */
    case 'vocabulaire': {
      const m = raw.match(/«\s*([^»]+)\s*»/);
      if (m) return { type: 'word-spotlight', word: m[1].trim() };
      return { type: 'theme-icon', icon: '💬', color: '#8b5cf6' };
    }

    /* ── Dictée ──────────────────────────────────────────── */
    case 'dictee': {
      const m = raw.match(/«\s*(\w+)\s*»/);
      if (m) return { type: 'word-spotlight', word: m[1] };
      return { type: 'theme-icon', icon: '🎧', color: '#6366f1' };
    }

    /* ── Découverte du monde ─────────────────────────────── */
    case 'decouverte-monde': {
      const t = [
        [/vue|yeux|voir/,            '👁️',  '#06b6d4'],
        [/ouïe|oreilles|entendre/,   '👂',  '#f97316'],
        [/odorat|nez|sentir/,        '👃',  '#22c55e'],
        [/toucher|peau|main/,        '🤚',  '#f59e0b'],
        [/goût|bouche|manger/,       '👅',  '#ef4444'],
        [/animal|mammifère|insecte/, '🐾',  '#84cc16'],
        [/continent|pays|carte/,     '🗺️',  '#3b82f6'],
        [/famille|parents|enfant/,   '👨‍👩‍👧', '#f43f5e'],
        [/métier|pompier|médecin/,   '🏥',  '#f97316'],
        [/plante|forêt|nature/,      '🌿',  '#22c55e'],
        [/soleil|lune|étoile/,       '🌟',  '#f59e0b'],
      ];
      for (const [re, icon, color] of t) {
        if (re.test(p)) return { type: 'theme-icon', icon, color };
      }
      return { type: 'theme-icon', icon: '🌍', color: '#22d3ee' };
    }

    /* ── Géographie Belgique ─────────────────────────────── */
    case 'geographie-belgique':
      return { type: 'theme-icon', icon: '🇧🇪', color: '#f59e0b' };

    /* ── Compréhension lecture ───────────────────────────── */
    case 'comprehension-lecture':
    case 'comprehension-orale':
      return { type: 'theme-icon', icon: '📚', color: '#14b8a6' };

    /* ── Logique (fallback) ──────────────────────────────── */
    case 'logique':
      return question.visual || null;

    /* ── Grand défi ──────────────────────────────────────── */
    case 'grand-defi':
      return { type: 'theme-icon', icon: '🏆', color: '#f59e0b' };

    default:
      return null;
  }
  return null;
}

/* ─────────────────────────────────────────────────────────────
   VISUAL RENDERERS
───────────────────────────────────────────────────────────── */

/* Dot array for multiplication: a rows × b cols */
function MultDots({ a, b }) {
  const cap = 10;
  const ra = Math.min(a, cap);
  const rb = Math.min(b, cap);
  const dot = 11;
  const gap = 5;
  const W = rb * (dot + gap) - gap;
  const H = ra * (dot + gap) - gap;
  const truncA = a > cap;
  const truncB = b > cap;

  return (
    <svg width={Math.min(W + 32, 300)} height={H + 28}
      viewBox={`0 0 ${W + 4} ${H + 28}`}
      style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }}
      aria-hidden="true">
      {Array.from({ length: ra }, (_, ri) =>
        Array.from({ length: rb }, (_, ci) => (
          <circle
            key={`${ri}-${ci}`}
            cx={ci * (dot + gap) + dot / 2 + 2}
            cy={ri * (dot + gap) + dot / 2 + 2}
            r={dot / 2}
            fill="#3b82f6"
            opacity={0.85}
          />
        ))
      )}
      <text x={(W + 4) / 2} y={H + 20} textAnchor="middle"
        fontSize={12} fill="#64748b" fontWeight="600">
        {a} × {b} = {truncA || truncB ? '…' : a * b}
      </text>
    </svg>
  );
}

/* Equation boxes: A op B = ? */
function CalcBoxes({ a, op, b }) {
  const opColor = { '+': '#22c55e', '-': '#ef4444', '×': '#6366f1', '÷': '#f97316' }[op] || '#64748b';
  return (
    <svg width={260} height={56} viewBox="0 0 260 56"
      style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }}
      aria-hidden="true">
      {/* A */}
      <rect x={4} y={8} width={56} height={40} rx={8} fill="#eff6ff" stroke="#3b82f6" strokeWidth={2} />
      <text x={32} y={34} textAnchor="middle" fontSize={20} fill="#1d4ed8" fontWeight="700">{a}</text>
      {/* op */}
      <text x={76} y={36} textAnchor="middle" fontSize={22} fill={opColor} fontWeight="700">{op}</text>
      {/* B */}
      <rect x={92} y={8} width={56} height={40} rx={8} fill="#eff6ff" stroke="#3b82f6" strokeWidth={2} />
      <text x={120} y={34} textAnchor="middle" fontSize={20} fill="#1d4ed8" fontWeight="700">{b}</text>
      {/* = */}
      <text x={162} y={36} textAnchor="middle" fontSize={22} fill="#475569" fontWeight="700">=</text>
      {/* ? */}
      <rect x={178} y={8} width={56} height={40} rx={8} fill="#f1f5f9" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 3" />
      <text x={206} y={36} textAnchor="middle" fontSize={22} fill="#94a3b8" fontWeight="700">?</text>
    </svg>
  );
}

/* Fraction bar: num/den */
function FractionBar({ num, den }) {
  const safeDen = Math.min(Math.max(den, 1), 20);
  const safeNum = Math.min(num, safeDen);
  const W = 220;
  const H = 36;
  const segW = W / safeDen;

  return (
    <svg width={W + 4} height={H + 28} viewBox={`0 0 ${W + 4} ${H + 28}`}
      style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }}
      aria-hidden="true">
      {/* background bar */}
      <rect x={2} y={2} width={W} height={H} rx={6} fill="#e2e8f0" />
      {/* filled segments */}
      {Array.from({ length: safeNum }, (_, i) => (
        <rect key={i} x={2 + i * segW} y={2} width={segW - 1} height={H} rx={i === 0 ? 6 : 0}
          fill="#3b82f6" opacity={0.85} />
      ))}
      {/* segment dividers */}
      {Array.from({ length: safeDen - 1 }, (_, i) => (
        <line key={i} x1={2 + (i + 1) * segW} y1={2} x2={2 + (i + 1) * segW} y2={H + 2}
          stroke="white" strokeWidth={2} />
      ))}
      {/* outline */}
      <rect x={2} y={2} width={W} height={H} rx={6} fill="none" stroke="#94a3b8" strokeWidth={1.5} />
      {/* label */}
      <text x={(W + 4) / 2} y={H + 22} textAnchor="middle" fontSize={13} fill="#64748b" fontWeight="600">
        {safeNum}/{safeDen}
      </text>
    </svg>
  );
}

/* Unit conversion: FROM → TO with icons */
const UNIT_META = {
  cm:  { icon: '📏', color: '#3b82f6' },
  mm:  { icon: '📏', color: '#60a5fa' },
  m:   { icon: '📐', color: '#6366f1' },
  km:  { icon: '🛣️', color: '#8b5cf6' },
  kg:  { icon: '⚖️', color: '#f59e0b' },
  g:   { icon: '⚖️', color: '#fbbf24' },
  L:   { icon: '🧴', color: '#06b6d4' },
  mL:  { icon: '💧', color: '#38bdf8' },
  h:   { icon: '🕐', color: '#10b981' },
  min: { icon: '⏱️', color: '#34d399' },
  s:   { icon: '⏱️', color: '#6ee7b7' },
  '€': { icon: '💶', color: '#f97316' },
  centimes: { icon: '🪙', color: '#fb923c' },
};

function UnitArrow({ value, from, to }) {
  const fromMeta = UNIT_META[from] || { icon: '📦', color: '#64748b' };
  const toMeta   = UNIT_META[to]   || { icon: '📦', color: '#64748b' };
  return (
    <svg width={290} height={70} viewBox="0 0 290 70"
      style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }}
      aria-hidden="true">
      {/* FROM box */}
      <rect x={4} y={12} width={100} height={46} rx={10}
        fill={fromMeta.color + '18'} stroke={fromMeta.color} strokeWidth={2} />
      <text x={28} y={38} textAnchor="middle" fontSize={20}>{fromMeta.icon}</text>
      <text x={28} y={52} textAnchor="middle" fontSize={10} fill={fromMeta.color} fontWeight="700">{from}</text>
      <text x={76} y={40} textAnchor="middle" fontSize={16} fill="#1e293b" fontWeight="700">{value}</text>
      {/* arrow */}
      <line x1={108} y1={35} x2={142} y2={35} stroke="#94a3b8" strokeWidth={2.5} strokeLinecap="round" />
      <polygon points="142,30 150,35 142,40" fill="#94a3b8" />
      {/* TO box */}
      <rect x={154} y={12} width={132} height={46} rx={10}
        fill={toMeta.color + '18'} stroke={toMeta.color} strokeWidth={2} />
      <text x={178} y={38} textAnchor="middle" fontSize={20}>{toMeta.icon}</text>
      <text x={178} y={52} textAnchor="middle" fontSize={10} fill={toMeta.color} fontWeight="700">{to}</text>
      <rect x={196} y={20} width={84} height={30} rx={6}
        fill="#f1f5f9" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 2" />
      <text x={238} y={41} textAnchor="middle" fontSize={18} fill="#94a3b8" fontWeight="700">?</text>
    </svg>
  );
}

/* Geometry shape */
function GeoShape({ shape }) {
  const W = 90;
  const H = 90;
  const cx = W / 2;
  const cy = H / 2;
  const r = 34;
  const color = '#3b82f6';
  const fill = '#eff6ff';

  let shapeEl;
  switch (shape) {
    case 'circle':
      shapeEl = <circle cx={cx} cy={cy} r={r} fill={fill} stroke={color} strokeWidth={3} />;
      break;
    case 'square':
      shapeEl = <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2}
        fill={fill} stroke={color} strokeWidth={3} />;
      break;
    case 'rectangle':
      shapeEl = <rect x={cx - r} y={cy - r * 0.65} width={r * 2} height={r * 1.3}
        fill={fill} stroke={color} strokeWidth={3} />;
      break;
    case 'triangle': {
      const pts = `${cx},${cy - r} ${cx - r},${cy + r * 0.7} ${cx + r},${cy + r * 0.7}`;
      shapeEl = <polygon points={pts} fill={fill} stroke={color} strokeWidth={3} />;
      break;
    }
    case 'diamond': {
      const pts = `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;
      shapeEl = <polygon points={pts} fill={fill} stroke={color} strokeWidth={3} />;
      break;
    }
    case 'hexagon': {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
      }).join(' ');
      shapeEl = <polygon points={pts} fill={fill} stroke={color} strokeWidth={3} />;
      break;
    }
    case 'pentagon': {
      const pts = Array.from({ length: 5 }, (_, i) => {
        const a = (2 * Math.PI / 5) * i - Math.PI / 2;
        return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
      }).join(' ');
      shapeEl = <polygon points={pts} fill={fill} stroke={color} strokeWidth={3} />;
      break;
    }
    case 'trapezoid': {
      const pts = `${cx - r * 0.5},${cy - r * 0.5} ${cx + r * 0.5},${cy - r * 0.5} ${cx + r},${cy + r * 0.5} ${cx - r},${cy + r * 0.5}`;
      shapeEl = <polygon points={pts} fill={fill} stroke={color} strokeWidth={3} />;
      break;
    }
    default:
      shapeEl = <circle cx={cx} cy={cy} r={r} fill={fill} stroke={color} strokeWidth={3} />;
  }

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      style={{ display: 'block', margin: '0 auto' }}
      aria-hidden="true">
      {shapeEl}
    </svg>
  );
}

/* Word problem: number blocks with icon */
function WordProblemVis({ numbers, op }) {
  const [a, b] = numbers;
  const opSymbol = op
    ? (op.toLowerCase().includes('donne') || op === '+') ? '+'
    : (op.toLowerCase().includes('enlève') || op === '-') ? '-'
    : op
    : '+';
  const opColor = opSymbol === '+' ? '#22c55e' : opSymbol === '-' ? '#ef4444' : '#6366f1';

  return (
    <svg width={230} height={60} viewBox="0 0 230 60"
      style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }}
      aria-hidden="true">
      <rect x={4} y={10} width={64} height={40} rx={8} fill="#eff6ff" stroke="#3b82f6" strokeWidth={2} />
      <text x={36} y={36} textAnchor="middle" fontSize={22} fill="#1d4ed8" fontWeight="700">{a}</text>
      <text x={82} y={38} textAnchor="middle" fontSize={22} fill={opColor} fontWeight="700">{opSymbol}</text>
      <rect x={96} y={10} width={64} height={40} rx={8} fill="#eff6ff" stroke="#3b82f6" strokeWidth={2} />
      <text x={128} y={36} textAnchor="middle" fontSize={22} fill="#1d4ed8" fontWeight="700">{b}</text>
      <text x={172} y={38} textAnchor="middle" fontSize={22} fill="#475569" fontWeight="700">=</text>
      <rect x={186} y={10} width={40} height={40} rx={8} fill="#f1f5f9" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 3" />
      <text x={206} y={36} textAnchor="middle" fontSize={20} fill="#94a3b8" fontWeight="700">?</text>
    </svg>
  );
}

/* Analog clock face */
function ClockFace({ h, m }) {
  const R = 38;
  const cx = 44;
  const cy = 44;
  const toRad = (deg) => (deg - 90) * (Math.PI / 180);
  const hAngle = toRad((h % 12) * 30 + m * 0.5);
  const mAngle = toRad(m * 6);
  const hLen = R * 0.55;
  const mLen = R * 0.78;

  return (
    <svg width={88} height={88} viewBox="0 0 88 88"
      style={{ display: 'block', margin: '0 auto' }}
      aria-hidden="true">
      {/* face */}
      <circle cx={cx} cy={cy} r={R} fill="#f8fafc" stroke="#3b82f6" strokeWidth={3} />
      {/* hour ticks */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = toRad(i * 30);
        const inner = i % 3 === 0 ? R - 10 : R - 7;
        return (
          <line key={i}
            x1={cx + inner * Math.cos(a)} y1={cy + inner * Math.sin(a)}
            x2={cx + (R - 2) * Math.cos(a)} y2={cy + (R - 2) * Math.sin(a)}
            stroke={i % 3 === 0 ? '#334155' : '#cbd5e1'} strokeWidth={i % 3 === 0 ? 2.5 : 1.5} />
        );
      })}
      {/* hour hand */}
      <line x1={cx} y1={cy} x2={cx + hLen * Math.cos(hAngle)} y2={cy + hLen * Math.sin(hAngle)}
        stroke="#1e40af" strokeWidth={4} strokeLinecap="round" />
      {/* minute hand */}
      <line x1={cx} y1={cy} x2={cx + mLen * Math.cos(mAngle)} y2={cy + mLen * Math.sin(mAngle)}
        stroke="#3b82f6" strokeWidth={2.5} strokeLinecap="round" />
      {/* center dot */}
      <circle cx={cx} cy={cy} r={3.5} fill="#1e40af" />
    </svg>
  );
}

/* Word spotlight: big styled word */
function WordSpotlight({ word }) {
  if (!word || word.length > 20) return <ThemeIcon icon="🔤" color="#6366f1" />;
  const W = Math.max(word.length * 14 + 40, 120);
  return (
    <svg width={W} height={56} viewBox={`0 0 ${W} 56`}
      style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }}
      aria-hidden="true">
      <rect x={4} y={4} width={W - 8} height={48} rx={10}
        fill="#faf5ff" stroke="#8b5cf6" strokeWidth={2} />
      <text x={W / 2} y={34} textAnchor="middle" fontSize={22}
        fill="#7c3aed" fontWeight="700" fontFamily="Georgia, serif">
        {word}
      </text>
    </svg>
  );
}

/* Verb card */
function VerbCard({ verb }) {
  if (!verb) return null;
  const W = Math.max(verb.length * 13 + 50, 140);
  return (
    <svg width={W} height={60} viewBox={`0 0 ${W} 60`}
      style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }}
      aria-hidden="true">
      <rect x={4} y={4} width={W - 8} height={52} rx={12}
        fill="#f0fdf4" stroke="#22c55e" strokeWidth={2} />
      <text x={20} y={20} fontSize={10} fill="#16a34a" fontWeight="600" opacity={0.7}>verbe</text>
      <text x={W / 2} y={40} textAnchor="middle" fontSize={22}
        fill="#15803d" fontWeight="700" fontStyle="italic">
        {verb}
      </text>
    </svg>
  );
}

/* Theme icon: emoji in colored gradient bubble */
function ThemeIcon({ icon, color, text }) {
  const isText = text;
  return (
    <svg width={72} height={72} viewBox="0 0 72 72"
      style={{ display: 'block', margin: '0 auto' }}
      aria-hidden="true">
      <defs>
        <radialGradient id={`tg-${color?.replace('#', '')}`} cx="40%" cy="35%">
          <stop offset="0%" stopColor={color || '#6366f1'} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color || '#6366f1'} stopOpacity="0.08" />
        </radialGradient>
      </defs>
      <circle cx={36} cy={36} r={32} fill={`url(#tg-${color?.replace('#', '')})`}
        stroke={color || '#6366f1'} strokeWidth={2} />
      {isText
        ? <text x={36} y={46} textAnchor="middle" fontSize={28}
            fill={color || '#6366f1'} fontWeight="800">{icon}</text>
        : <text x={36} y={48} textAnchor="middle" fontSize={32}>{icon}</text>
      }
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────── */
export default function ExamVisual({ visual }) {
  if (!visual) return null;
  const { type } = visual;

  let content = null;
  switch (type) {
    case 'mult-dots':
      content = <MultDots a={visual.a} b={visual.b} />;
      break;
    case 'calc-boxes':
      content = <CalcBoxes a={visual.a} op={visual.op} b={visual.b} />;
      break;
    case 'fraction-bar':
      content = <FractionBar num={visual.num} den={visual.den} />;
      break;
    case 'unit-arrow':
      content = <UnitArrow value={visual.value} from={visual.from} to={visual.to} />;
      break;
    case 'geo-shape':
      content = <GeoShape shape={visual.shape} />;
      break;
    case 'word-problem':
      content = <WordProblemVis numbers={visual.numbers} op={visual.op} />;
      break;
    case 'clock-face':
      content = <ClockFace h={visual.h} m={visual.m} />;
      break;
    case 'word-spotlight':
      content = <WordSpotlight word={visual.word} />;
      break;
    case 'verb-card':
      content = <VerbCard verb={visual.verb} />;
      break;
    case 'theme-icon':
      content = <ThemeIcon icon={visual.icon} color={visual.color} text={visual.text} />;
      break;
    // logique-specific types
    case 'shape-sequence':
    case 'shape-grid':
    case 'color-grid':
    case 'equation':
    case 'number-sequence':
    case 'rotation':
      content = <LogiqueVisualImpl visual={visual} />;
      break;
    default:
      return null;
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '10px 8px 2px',
      overflowX: 'auto',
    }}>
      {content}
    </div>
  );
}
