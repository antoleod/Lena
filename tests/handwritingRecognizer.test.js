import test from 'node:test';
import assert from 'node:assert/strict';
import { buildStroke, createNoisyStroke, recognizeDigit } from '../src/features/exerciseGenerator/handwriting/digitRecognizer.js';

test('recognizes a template-like zero', () => {
  const result = recognizeDigit([
    buildStroke([
      { x: 30, y: 10 },
      { x: 18, y: 28 },
      { x: 18, y: 72 },
      { x: 30, y: 90 },
      { x: 70, y: 90 },
      { x: 82, y: 72 },
      { x: 82, y: 28 },
      { x: 70, y: 10 },
      { x: 30, y: 10 },
    ]),
  ]);

  assert.equal(result.value, '0');
  assert.ok(result.confidence > 0.45);
});

test('recognizes a noisy one', () => {
  const result = recognizeDigit([
    createNoisyStroke([
      { x: 38, y: 26 },
      { x: 56, y: 10 },
      { x: 56, y: 90 },
    ], 3, -2),
  ]);

  assert.equal(result.value, '1');
});

test('recognizes a seven', () => {
  const result = recognizeDigit([
    buildStroke([
      { x: 20, y: 14 },
      { x: 82, y: 14 },
      { x: 42, y: 90 },
    ]),
  ]);

  assert.equal(result.value, '7');
});

test('recognizes a five', () => {
  const result = recognizeDigit([
    buildStroke([
      { x: 76, y: 12 },
      { x: 30, y: 12 },
      { x: 24, y: 48 },
      { x: 62, y: 48 },
      { x: 78, y: 62 },
      { x: 66, y: 86 },
      { x: 26, y: 82 },
    ]),
  ]);

  assert.equal(result.value, '5');
});

test('recognizes an eight', () => {
  const result = recognizeDigit([
    buildStroke([
      { x: 36, y: 12 },
      { x: 24, y: 28 },
      { x: 34, y: 50 },
      { x: 24, y: 70 },
      { x: 38, y: 88 },
      { x: 64, y: 88 },
      { x: 76, y: 70 },
      { x: 66, y: 50 },
      { x: 76, y: 28 },
      { x: 64, y: 12 },
      { x: 36, y: 12 },
    ]),
  ]);

  assert.equal(result.value, '8');
});

test('recognizes a nine', () => {
  const result = recognizeDigit([
    buildStroke([
      { x: 70, y: 48 },
      { x: 34, y: 48 },
      { x: 22, y: 30 },
      { x: 34, y: 12 },
      { x: 66, y: 12 },
      { x: 80, y: 32 },
      { x: 72, y: 72 },
      { x: 48, y: 88 },
      { x: 24, y: 88 },
    ]),
  ]);

  assert.equal(result.value, '9');
});

test('rejects tiny marks', () => {
  const result = recognizeDigit([
    buildStroke([
      { x: 50, y: 50 },
      { x: 52, y: 52 },
    ]),
  ]);

  assert.equal(result.value, null);
});
