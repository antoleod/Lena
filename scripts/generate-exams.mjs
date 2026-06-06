// ─────────────────────────────────────────────────────────────────────────────
// Exam generator — writes static JSON files under src/content/exams/<cat>/.
//
//   node scripts/generate-exams.mjs
//
// Output is fully deterministic (seeded PRNG), so re-running reproduces the
// exact same library. The generated JSON files are what ships in the app and
// what works offline — this script is a build-time authoring tool only.
//
// Pilot scope (this run):
//   - calcul-mental          : 10 exams × 3 levels  (fully generated)
//   - comprehension-lecture  : 10 exams × 3 levels  (authored data below)
//
// Other categories follow the SAME schema and folder convention; add them by
// extending the `BUILDERS` list — no app code changes needed.
// ─────────────────────────────────────────────────────────────────────────────

import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateExam } from '../src/content/exams/schema.js';
import { LECTURE_DATA } from './data/lecture-data.mjs';
import { buildAllCategories } from './data/exam-builders.mjs';
import { buildExtraCategories } from './data/exam-builders-extra.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'src', 'content', 'exams');

// ── Seeded PRNG (mulberry32) ────────────────────────────────────────────────
function makeRng(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const ri = (rng, min, max) => min + Math.floor(rng() * (max - min + 1));
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];

// Build 3 unique-ish wrong options around a numeric answer.
function numericOptions(rng, answer, spread) {
  const set = new Set([answer]);
  let guard = 0;
  while (set.size < 4 && guard++ < 50) {
    const delta = ri(rng, 1, spread) * (rng() < 0.5 ? -1 : 1);
    const cand = answer + delta;
    if (cand >= 0) set.add(cand);
  }
  const opts = [...set];
  // shuffle
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return opts.map(String);
}

// ── CALCUL MENTAL ───────────────────────────────────────────────────────────
// 10 exams, increasing range. Each level has 10 questions.
const CALCUL_EXAMS = [
  { order: 1,  title: 'Additions jusqu’à 10',        op: 'add', max: 10 },
  { order: 2,  title: 'Additions jusqu’à 20',        op: 'add', max: 20 },
  { order: 3,  title: 'Soustractions jusqu’à 10',    op: 'sub', max: 10 },
  { order: 4,  title: 'Soustractions jusqu’à 20',    op: 'sub', max: 20 },
  { order: 5,  title: 'Additions et soustractions',  op: 'mix', max: 20 },
  { order: 6,  title: 'Compléter à 10',              op: 'complete', max: 10 },
  { order: 7,  title: 'Compléter à 20',              op: 'complete', max: 20 },
  { order: 8,  title: 'Le nombre manquant (+)',      op: 'missing-add', max: 20 },
  { order: 9,  title: 'Le nombre manquant (−)',      op: 'missing-sub', max: 20 },
  { order: 10, title: 'Calcul mental mélangé',       op: 'mix', max: 30 },
];

const LEVEL_RANGE = { facile: 1, moyen: 1.6, difficile: 2.4 };

function makeCalculQuestion(rng, op, max, idx) {
  let a, b, prompt, answer, correction, q_extra = {};
  switch (op) {
    case 'add': {
      a = ri(rng, 0, max); b = ri(rng, 0, max - a < 0 ? 0 : max - a);
      answer = a + b; prompt = `${a} + ${b} = ?`;
      correction = `${a} + ${b} = ${answer}.`;
      break;
    }
    case 'sub': {
      a = ri(rng, 1, max); b = ri(rng, 0, a);
      answer = a - b; prompt = `${a} − ${b} = ?`;
      correction = `${a} − ${b} = ${answer}.`;
      break;
    }
    case 'complete': {
      const total = max; a = ri(rng, 0, total);
      answer = total - a; prompt = `${a} + ___ = ${total}`;
      correction = `Pour aller de ${a} à ${total}, il faut ${answer}.`;
      q_extra = {
        correction_nl: `Van ${a} naar ${total}: ${answer}.`,
        correction_en: `From ${a} to ${total}: ${answer}.`,
        correction_es: `De ${a} a ${total}: ${answer}.`,
      };
      break;
    }
    case 'missing-add': {
      a = ri(rng, 0, max); answer = ri(rng, 0, max);
      const total = a + answer; prompt = `${a} + ___ = ${total}`;
      correction = `${total} − ${a} = ${answer}.`;
      break;
    }
    case 'missing-sub': {
      answer = ri(rng, 0, max); b = ri(rng, 0, answer);
      const res = answer - b; prompt = `___ − ${b} = ${res}`;
      correction = `${res} + ${b} = ${answer}.`;
      break;
    }
    case 'mix':
    default: {
      if (rng() < 0.5) {
        a = ri(rng, 0, max); b = ri(rng, 0, max - a < 0 ? 0 : max - a);
        answer = a + b; prompt = `${a} + ${b} = ?`;
        correction = `${a} + ${b} = ${answer}.`;
      } else {
        a = ri(rng, 1, max); b = ri(rng, 0, a);
        answer = a - b; prompt = `${a} − ${b} = ?`;
        correction = `${a} − ${b} = ${answer}.`;
      }
    }
  }
  // Alternate mcq / fill_blank for variety
  if (idx % 3 === 2) {
    return { id: `q${idx + 1}`, type: 'fill_blank', prompt, answer, correction, ...q_extra };
  }
  return {
    id: `q${idx + 1}`, type: 'mcq', prompt,
    options: numericOptions(rng, answer, Math.max(2, Math.round(max / 4))),
    answer: String(answer), correction, ...q_extra,
  };
}

function buildCalculExams() {
  return CALCUL_EXAMS.map((cfg, i) => {
    const id = `calcul-mental-${String(cfg.order).padStart(2, '0')}`;
    const levels = {};
    for (const [key, factor] of Object.entries(LEVEL_RANGE)) {
      const rng = makeRng(1000 + i * 10 + Math.round(factor * 7));
      const max = Math.round(cfg.max * factor);
      levels[key] = {
        passPercent: 60,
        questions: Array.from({ length: 10 }, (_, q) =>
          makeCalculQuestion(rng, cfg.op, max, q)
        ),
      };
    }
    return {
      id, category: 'calcul-mental', categoryLabel: 'Calcul mental',
      categoryEmoji: '🔢', categoryOrder: 2,
      title: cfg.title, emoji: '🔢', order: cfg.order, levels,
    };
  });
}

// ── COMPRÉHENSION LECTURE ───────────────────────────────────────────────────
// Authored stories + difficulty-tagged question pools (see data/lecture-data).
function buildLectureExams() {
  return LECTURE_DATA.map((story, i) => {
    const levels = {};
    const tiers = {
      facile: ['easy'],
      moyen: ['easy', 'medium'],
      difficile: ['medium', 'hard'],
    };
    const counts = { facile: 6, moyen: 8, difficile: 8 };
    for (const [key, tags] of Object.entries(tiers)) {
      const pool = story.questionPool.filter((q) => tags.includes(q.tag));
      const chosen = pool.slice(0, counts[key]).map((q, qi) => {
        const { tag, ...rest } = q;
        return { ...rest, id: `q${qi + 1}` };
      });
      levels[key] = { passPercent: 60, story: { pages: story.pages }, questions: chosen };
    }
    return {
      id: `comprehension-lecture-${String(i + 1).padStart(2, '0')}`,
      category: 'comprehension-lecture', categoryLabel: 'Compréhension lecture',
      categoryEmoji: '📖', categoryOrder: 1,
      title: story.title, emoji: story.emoji, order: i + 1, levels,
    };
  });
}

// ── WRITE ───────────────────────────────────────────────────────────────────
const BUILDERS = [
  { dir: 'comprehension-lecture', build: buildLectureExams },
  { dir: 'calcul-mental', build: buildCalculExams },
  ...buildAllCategories().map(({ dir, exams }) => ({ dir, build: () => exams })),
  ...buildExtraCategories().map(({ dir, exams }) => ({ dir, build: () => exams })),
];

let total = 0;
let allErrors = [];
for (const { dir, build } of BUILDERS) {
  const target = join(OUT, dir);
  if (existsSync(target)) rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
  for (const exam of build()) {
    const errors = validateExam(exam);
    if (errors.length) allErrors.push(...errors);
    writeFileSync(join(target, `${exam.id}.json`), JSON.stringify(exam, null, 2) + '\n', 'utf8');
    total++;
  }
}

if (allErrors.length) {
  console.error(`\n❌ ${allErrors.length} validation error(s):`);
  allErrors.slice(0, 40).forEach((e) => console.error('  - ' + e));
  process.exit(1);
}
console.log(`✅ Generated ${total} exam files (3 levels each) into ${OUT}`);
