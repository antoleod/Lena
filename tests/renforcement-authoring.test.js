import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeRenforcementExercise } from '../src/content/renforcement/authoring.js';

const TYPES = [
  'shape-recognition',
  'count-elements',
  'coloring',
  'trace',
  'grid-complete',
  'spot-difference',
  'matching',
  'visual-logic',
  'count',
  'comparison',
  'complete-drawing',
  'reproduce'
];

function baseAuthored(type) {
  return {
    id: `test-${type}`,
    type,
    level: 'P2',
    instruction: 'Choisis une reponse.',
    difficulty: 2,
    reward: '⭐',
    skills: ['formes', 'observation'],
    payload: {
      options: ['A', 'B', 'C'],
      correctValue: 'A'
    }
  };
}

test('normalizeRenforcementExercise produit un defineExercise valide pour chaque type', () => {
  TYPES.forEach((type) => {
    const exercise = normalizeRenforcementExercise(baseAuthored(type));
    assert.ok(exercise);
    assert.equal(exercise.id, `test-${type}`);
    assert.equal(exercise.subjectId, 'renforcement');
    assert.equal(exercise.gradeId, 'P2');
    assert.equal(exercise.type, type);
    assert.ok(exercise.prompt && exercise.prompt.length > 0);
    assert.ok(exercise.instruction && exercise.instruction.length > 0);
    assert.ok(['easy', 'medium', 'hard'].includes(exercise.difficulty));
    assert.ok(typeof exercise.rewardValue === 'number');
    assert.ok(Array.isArray(exercise.tags));
    assert.ok(exercise.tags.includes('renforcement'));
  });
});

test('normalizeRenforcementExercise mappe options et correctOptionIds quand fournis', () => {
  const exercise = normalizeRenforcementExercise({
    id: 'test-options',
    type: 'shape-recognition',
    level: 'P3',
    instruction: 'Choisis la bonne option.',
    difficulty: 1,
    reward: '⭐',
    skills: ['formes'],
    payload: {
      options: ['triangle', 'carre', 'cercle'],
      correctValue: 'triangle'
    }
  });

  assert.equal(exercise.gradeId, 'P3');
  assert.equal(exercise.options.length, 3);
  assert.ok(exercise.correctOptionIds.length === 1);
  const correctId = exercise.correctOptionIds[0];
  assert.ok(exercise.options.some((opt) => opt.id === correctId));
});

