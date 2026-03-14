import test from 'node:test';
import assert from 'node:assert/strict';
import { materializeActivity } from '../src/engines/generators/activityFactory.js';
import { generatedMathematicsActivities } from '../src/content/mathematics/generatedActivities.js';
import { generatedFrenchActivities } from '../src/content/french/generatedActivities.js';

function countLessons(activity) {
  return (activity.sections || []).reduce((sum, section) => sum + (section.lessons || []).length, 0);
}

test('generated mathematics activity materializes to 10 lessons', () => {
  const activity = materializeActivity(generatedMathematicsActivities.find((entry) => entry.id === 'generated-addition-p2'));
  assert.equal(countLessons(activity), 10);
});

test('generated french activity materializes to 10 lessons', () => {
  const activity = materializeActivity(generatedFrenchActivities.find((entry) => entry.id === 'generated-french-conjugation-p3'));
  assert.equal(countLessons(activity), 10);
});
