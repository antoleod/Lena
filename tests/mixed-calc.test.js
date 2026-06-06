import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateMixedSet, evaluateExpression } from '../src/features/mathChallenges/mixedCalcEngine.js';
import { buildDotsVisual, buildArrayVisual } from '../src/features/exerciseGenerator/mathVisualUtils.js';

test('evaluateExpression respects × and ÷ precedence; ÷ exactness', () => {
  assert.equal(evaluateExpression([2, 3, 4, 6], ['×', '−', '+']), 8); // 6-4+6
  assert.equal(evaluateExpression([2, 4, 6], ['+', '+']), 12);
  assert.equal(evaluateExpression([10, 4, 3], ['−', '+']), 9);
  assert.equal(evaluateExpression([8, 2], ['÷']), 4);
  assert.equal(evaluateExpression([8, 3], ['÷']), null); // not exact
  assert.equal(evaluateExpression([6, 2, 1], ['÷', '+']), 4); // 6÷2+1
});

test('division option always produces exact, non-negative results', () => {
  for (const cfg of [
    { terms: 2, operations: ['÷'], digits: 1 },
    { terms: 3, operations: ['+', '÷'], digits: 1 },
    { terms: 4, operations: ['+', '−', '×', '÷'], digits: 2 },
  ]) {
    for (const ex of generateMixedSet({ ...cfg, count: 10 })) {
      assert.ok(Number.isInteger(ex.correctAnswer), `not integer: ${ex.expression}`);
      assert.ok(ex.correctAnswer >= 0, `negative: ${ex.expression}`);
    }
  }
});

test('array visual for multiplication', () => {
  assert.deepEqual(buildArrayVisual(3, 4), { kind: 'array', rows: 3, cols: 4 });
  assert.equal(buildArrayVisual(8, 2), null); // too big
});

test('configurable terms / operations / digits all generate solvable, non-negative results', () => {
  const configs = [
    { terms: 2, operations: ['+'], digits: 1 },
    { terms: 3, operations: ['+'], digits: 1 },
    { terms: 4, operations: ['+'], digits: 1 },
    { terms: 3, operations: ['+', '−'], digits: 2 },
    { terms: 4, operations: ['+', '−'], digits: 2 },
    { terms: 3, operations: ['+', '−', '×'], digits: 1 },
    { terms: 4, operations: ['+', '−', '×'], digits: 3 },
  ];
  for (const cfg of configs) {
    const list = generateMixedSet({ ...cfg, count: 8 });
    assert.equal(list.length, 8);
    for (const ex of list) {
      assert.ok(ex.correctAnswer >= 0, `negative: ${ex.expression}`);
      assert.ok(ex.correctAnswer <= 999);
      assert.ok(ex.question.startsWith('Calcule'));
      assert.ok(ex.explanation && ex.hint && ex.improvementTip);
      // count terms in the expression
      const nums = ex.expression.split(/[+−×-]/).map((s) => s.trim()).filter(Boolean);
      assert.equal(nums.length, cfg.terms);
    }
  }
});

test('dots visual only for small additive expressions', () => {
  assert.ok(buildDotsVisual([2, 4, 6], ['+', '+']));
  assert.equal(buildDotsVisual([12, 4], ['+']), null); // too big
  assert.equal(buildDotsVisual([2, 3], ['×']), null);   // multiplication
});
