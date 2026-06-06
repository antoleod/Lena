import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const base = 'src/content/exams';
const files = [];

function walk(dir) {
  readdirSync(dir).forEach((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.json') && f !== 'manifest.json') files.push(p);
  });
}
walk(base);

const categories = new Map();

for (const f of files) {
  const exam = JSON.parse(readFileSync(f, 'utf8'));
  // relative path from the exams dir, e.g. './calcul-mental/calcul-mental-01.json'
  const relPath = './' + f.replace(/\\/g, '/').replace('src/content/exams/', '');

  if (!categories.has(exam.category)) {
    categories.set(exam.category, {
      id: exam.category,
      label: exam.categoryLabel || exam.category,
      emoji: exam.categoryEmoji || exam.emoji || '📚',
      order: exam.categoryOrder ?? 999,
      exams: [],
    });
  }

  const levelPassPercent = {};
  for (const [k, v] of Object.entries(exam.levels || {})) {
    levelPassPercent[k] = v.passPercent;
  }

  categories.get(exam.category).exams.push({
    id: exam.id,
    title: exam.title,
    emoji: exam.emoji || '📚',
    order: exam.order ?? 999,
    levelKeys: Object.keys(exam.levels || {}),
    levelPassPercent,
    _path: relPath,
  });
}

const cats = [...categories.values()].sort((a, b) => {
  if (a.order !== b.order) return a.order - b.order;
  return a.label.localeCompare(b.label);
});

for (const cat of cats) {
  cat.exams.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });
}

const manifest = { categories: cats };
writeFileSync('src/content/exams/manifest.json', JSON.stringify(manifest, null, 2));
console.log(
  'manifest.json written:',
  cats.length,
  'categories,',
  cats.reduce((s, c) => s + c.exams.length, 0),
  'exams'
);
