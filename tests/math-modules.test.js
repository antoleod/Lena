import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateGeometrySet, GEOMETRY_TYPES } from '../src/features/mathGeometry/geometryExerciseEngine.js';
import { generateChallengeSet, CHALLENGE_TYPES } from '../src/features/mathChallenges/calculationEngine.js';
import { explainSubtraction, needsBorrow } from '../src/features/mathChallenges/subtractionStrategies.js';

test('geometry: every type generates valid exercises with a figure spec', () => {
  for (const t of GEOMETRY_TYPES) {
    for (const diff of ['easy', 'medium', 'hard']) {
      const list = generateGeometrySet({ type: t.id, difficulty: diff, count: 4 });
      assert.equal(list.length, 4, `${t.id}/${diff} count`);
      for (const ex of list) {
        assert.ok(ex.question && ex.spec && ex.hint && ex.explanation, `${t.id} fields`);
        assert.ok(['number', 'choice', 'color'].includes(ex.inputType));
        if (ex.inputType === 'color') {
          assert.ok(ex.target && ex.target.count >= 1);
          // there must be at least `count` shapes of the target type available
          const avail = ex.spec.shapes.filter((s) => s.type === ex.target.shapeType).length;
          assert.ok(avail >= ex.target.count, `${t.id}: not enough target shapes`);
        } else {
          assert.ok(ex.correctAnswer !== undefined && ex.correctAnswer !== null);
        }
      }
    }
  }
});

test('geometry: count compositions have correct known answers', () => {
  // hard count exercises rely on hand-crafted compositions
  for (let i = 0; i < 20; i++) {
    const [ex] = generateGeometrySet({ type: 'count_shapes', difficulty: 'hard', count: 1 });
    assert.ok(Number.isInteger(Number(ex.correctAnswer)));
    assert.ok(Number(ex.correctAnswer) >= 3);
  }
});

test('challenges: every type generates solvable exercises', () => {
  for (const t of CHALLENGE_TYPES) {
    for (const diff of ['easy', 'medium', 'hard']) {
      const list = generateChallengeSet({ type: t.id, difficulty: diff, count: 5 });
      assert.equal(list.length, 5);
      for (const ex of list) {
        assert.ok(ex.question && ex.hint && ex.explanation && ex.improvementTip);
        assert.ok(Number.isInteger(ex.correctAnswer));
      }
    }
  }
});

test('subtraction explanation: borrow detection and no impossible primary subtractions', () => {
  assert.equal(needsBorrow(72, 45), true);
  assert.equal(needsBorrow(59, 38), false);
  assert.match(explainSubtraction(72, 45), /dizaine/);
  assert.match(explainSubtraction(59, 38), /unités/);
  // negative is explained, not crashed
  assert.match(explainSubtraction(38, 59), /négatif/);

  // No generated hard_subtraction should be negative (primary-safe)
  for (let i = 0; i < 50; i++) {
    const [ex] = generateChallengeSet({ type: 'hard_subtraction', difficulty: 'hard', count: 1 });
    assert.ok(ex.correctAnswer >= 0, `negative result: ${ex.question}`);
  }
});
