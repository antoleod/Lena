import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateExam, LEVEL_KEYS } from '../src/content/exams/schema.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const EXAMS_DIR = join(ROOT, 'src', 'content', 'exams');

function walkJson(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walkJson(full));
    else if (entry.endsWith('.json')) out.push(full);
  }
  return out;
}

const files = walkJson(EXAMS_DIR);

test('exam library has content', () => {
  assert.ok(files.length >= 20, `expected >= 20 exam files, got ${files.length}`);
});

test('every exam JSON is valid and has 3 levels', () => {
  const seenIds = new Set();
  for (const file of files) {
    const exam = JSON.parse(readFileSync(file, 'utf8'));
    const errors = validateExam(exam);
    assert.equal(errors.length, 0, `${file}:\n  ${errors.join('\n  ')}`);
    assert.ok(!seenIds.has(exam.id), `duplicate exam id: ${exam.id}`);
    seenIds.add(exam.id);
    for (const key of LEVEL_KEYS) {
      assert.ok(exam.levels[key].questions.length >= 5, `${exam.id}.${key} needs >= 5 questions`);
    }
  }
});
