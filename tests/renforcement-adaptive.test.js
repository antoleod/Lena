import test from 'node:test';
import assert from 'node:assert/strict';

import { encourage, FORBIDDEN_WORDS } from '../src/engines/learning/confidenceEngine.js';
import { planNextSession } from '../src/engines/learning/renforcementAdaptive.js';

test('confidenceEngine.encourage never emits forbidden words', () => {
  ['success', 'retry', 'transition'].forEach((outcome) => {
    for (let i = 0; i < 10; i += 1) {
      const message = encourage({ outcome, prenom: 'Lena', streak: i });
      const lower = String(message).toLowerCase();
      FORBIDDEN_WORDS.forEach((word) => {
        assert.ok(!lower.includes(word.toLowerCase()), `found forbidden word "${word}" in "${message}"`);
      });
    }
  });
});

test('renforcementAdaptive.planNextSession chooses difficultyBias based on mastery', () => {
  const snapshotBase = { mastery: { unseen: 0, failed: 0, shaky: 0, mastered: 0 }, meta: { streakCurrent: 0 } };

  const up = planNextSession({
    sectionId: 'formes',
    snapshot: { ...snapshotBase, mastery: { unseen: 1, failed: 0, shaky: 0, mastered: 10 } }
  });
  assert.equal(up.difficultyBias, 'up');
  assert.ok(up.exerciseCount >= 5);

  const down = planNextSession({
    sectionId: 'formes',
    snapshot: { ...snapshotBase, mastery: { unseen: 0, failed: 10, shaky: 6, mastered: 1 } }
  });
  assert.equal(down.difficultyBias, 'down');
  assert.ok(down.exerciseCount <= 4);

  const steady = planNextSession({
    sectionId: 'formes',
    snapshot: { ...snapshotBase, mastery: { unseen: 2, failed: 2, shaky: 2, mastered: 2 } }
  });
  assert.equal(steady.difficultyBias, 'steady');
});

