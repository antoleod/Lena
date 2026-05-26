import test from 'node:test';
import assert from 'node:assert/strict';

import { generateShapeExercise } from '../src/engines/generators/shapeGenerator.js';
import { generateColoringExercise } from '../src/engines/generators/coloringGenerator.js';
import { generateObservationExercise } from '../src/engines/generators/observationGenerator.js';
import { generateTableExercise } from '../src/engines/generators/tableGenerator.js';

function assertGeneratedExercise(exercise) {
  assert.ok(exercise);
  assert.ok(String(exercise.question || '').trim().length > 0);
  assert.ok(Array.isArray(exercise.options));
  assert.ok(exercise.options.length >= 2);
  assert.ok(String(exercise.correct ?? '').trim().length > 0);
  assert.ok(exercise.options.some((option) => String(option) === String(exercise.correct)));
}

test('shapeGenerator renvoie un exercice avec reponse correcte', () => {
  assertGeneratedExercise(generateShapeExercise({ grade: 'P2', difficulty: 'easy' }));
  assertGeneratedExercise(generateShapeExercise({ grade: 'P3', difficulty: 'medium' }));
  assertGeneratedExercise(generateShapeExercise({ grade: 'P3', difficulty: 'hard' }));
});

test('coloringGenerator renvoie un exercice avec reponse correcte', () => {
  assertGeneratedExercise(generateColoringExercise({ grade: 'P2' }));
});

test('observationGenerator renvoie un exercice avec reponse correcte', () => {
  assertGeneratedExercise(generateObservationExercise({ grade: 'P2' }));
});

test('tableGenerator renvoie un exercice avec reponse correcte', () => {
  assertGeneratedExercise(generateTableExercise({ grade: 'P3' }));
});

