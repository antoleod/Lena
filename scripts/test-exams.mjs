import { readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { validateExam } from '../src/content/exams/schema.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const examsDir = resolve(__dirname, '../src/content/exams');

// Collect all JSON files, excluding the manifest
function collectJsonFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...collectJsonFiles(full));
    } else if (entry.endsWith('.json') && entry !== 'manifest.json') {
      results.push(full);
    }
  }
  return results;
}

const files = collectJsonFiles(examsDir);
let passed = 0;
let failed = 0;
const failures = [];

for (const file of files) {
  let exam;
  try {
    const raw = readFileSync(file, 'utf8');
    exam = JSON.parse(raw);
  } catch (err) {
    failed++;
    failures.push({ file, errors: ['JSON parse error: ' + err.message] });
    continue;
  }

  const errors = validateExam(exam);
  if (errors.length === 0) {
    passed++;
  } else {
    failed++;
    failures.push({ file, errors });
  }
}

// Report
console.log('');
console.log('Exam validation results');
console.log('=======================');
console.log('Total files : ' + files.length);
console.log('Passed      : ' + passed);
console.log('Failed      : ' + failed);

if (failures.length > 0) {
  console.log('');
  console.log('FAILURES:');
  for (const { file, errors } of failures) {
    // Print path relative to project root for readability
    const rel = file.replace(resolve(__dirname, '..') + '\\', '').replace(resolve(__dirname, '..') + '/', '');
    console.log('');
    console.log('  ' + rel);
    for (const err of errors) {
      console.log('    - ' + err);
    }
  }
  console.log('');
  process.exit(1);
} else {
  console.log('');
  console.log('All exams passed validation.');
  console.log('');
}
