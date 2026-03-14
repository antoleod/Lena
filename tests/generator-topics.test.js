import test from 'node:test';
import assert from 'node:assert/strict';

import { generateExercise } from '../src/engines/generators/exerciseGenerators.js';

test('generator supports key math enrichment topics', () => {
  ['place-value', 'time', 'money', 'geometry'].forEach((topic) => {
    const exercise = generateExercise({ topic, grade: 'P3', language: 'fr' });
    assert.ok(exercise.question);
    assert.ok(Array.isArray(exercise.options));
    assert.ok(exercise.options.length >= 2);
    assert.ok(exercise.correct !== undefined);
  });
});

test('generator supports key language and logic enrichment topics', () => {
  [
    { topic: 'vocabulary', language: 'en' },
    { topic: 'sentence-completion', language: 'es' },
    { topic: 'reading-comprehension', language: 'nl' },
    { topic: 'logic', language: 'fr' }
  ].forEach((input) => {
    const exercise = generateExercise({ ...input, grade: 'P2' });
    assert.ok(exercise.question);
    assert.ok(Array.isArray(exercise.options));
    assert.ok(exercise.options.length >= 2);
    assert.ok(exercise.correct !== undefined);
  });
});
