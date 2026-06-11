import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzePerformance,
  classifySkills,
  recommendDifficulty,
  decideNext,
  THRESHOLDS,
} from '../src/services/learning/adaptiveEngine.js';

function correct(skill, ms = 3000) {
  return { flavor: 'question', skill, isCorrect: true, responseTimeMs: ms, sessionId: 's1' };
}
function wrong(skill, ms = 4000) {
  return { flavor: 'question', skill, isCorrect: false, responseTimeMs: ms, sessionId: 's1' };
}

test('analyzePerformance aggregates accuracy and ignores session-summary events', () => {
  const events = [
    correct('add'), correct('add'), wrong('add'), correct('add'),
    { flavor: 'session', skill: 'jeux', sessionId: 's1' },
  ];
  const perf = analyzePerformance(events);
  assert.equal(perf.totalAnswered, 4);
  assert.equal(perf.sessionsPlayed, 1);
  assert.equal(perf.bySkill.add.attempts, 4);
  assert.equal(perf.bySkill.add.correct, 3);
  assert.equal(perf.bySkill.add.accuracy, 0.75);
});

test('classifySkills marks a fast, accurate skill as mastered', () => {
  const events = Array.from({ length: 6 }, () => correct('mult', 2000));
  const { mastered, struggling } = classifySkills(analyzePerformance(events));
  assert.deepEqual(mastered, ['mult']);
  assert.deepEqual(struggling, []);
});

test('classifySkills marks a low-accuracy skill as struggling', () => {
  const events = [wrong('sub'), wrong('sub'), wrong('sub'), correct('sub')];
  const { struggling } = classifySkills(analyzePerformance(events));
  assert.deepEqual(struggling, ['sub']);
});

test('classifySkills leaves under-sampled skills as learning (undecided)', () => {
  const events = [correct('geo'), correct('geo')]; // < MIN_ATTEMPTS
  const { learning, mastered, struggling } = classifySkills(analyzePerformance(events));
  assert.deepEqual(learning, ['geo']);
  assert.deepEqual(mastered, []);
  assert.deepEqual(struggling, []);
});

test('recommendDifficulty: performance is the deciding signal (mastering raises)', () => {
  const base = recommendDifficulty({ profile: { age: 8, schoolGrade: 'P3' }, accuracy: 0.7 });
  const up = recommendDifficulty({ profile: { age: 8, schoolGrade: 'P3' }, accuracy: 0.95 });
  assert.ok(up.difficulty > base.difficulty, 'high accuracy should raise difficulty');
});

test('recommendDifficulty: struggling lowers difficulty', () => {
  const base = recommendDifficulty({ profile: { age: 8, schoolGrade: 'P3' }, accuracy: 0.7 });
  const down = recommendDifficulty({ profile: { age: 8, schoolGrade: 'P3' }, accuracy: 0.3 });
  assert.ok(down.difficulty < base.difficulty, 'low accuracy should lower difficulty');
});

test('decideNext respects adaptiveModeEnabled = false', () => {
  const out = decideNext({ profile: { age: 8, schoolGrade: 'P3', adaptiveModeEnabled: false }, events: [] });
  assert.equal(out.adaptive, false);
  assert.deepEqual(out.masteredSkills, []);
});

test('decideNext folds weak areas into reviewTopics', () => {
  const events = [wrong('sub'), wrong('sub'), wrong('sub'), wrong('sub')];
  const weakAreas = [{ key: 'math:subtraction', count: 5 }];
  const out = decideNext({ profile: { age: 8, schoolGrade: 'P3' }, events, weakAreas });
  assert.ok(out.reviewTopics.includes('sub'));
  assert.ok(out.reviewTopics.includes('math:subtraction'));
});

test('THRESHOLDS are sane', () => {
  assert.ok(THRESHOLDS.MASTERY_ACCURACY > THRESHOLDS.STRUGGLE_ACCURACY);
  assert.ok(THRESHOLDS.SLOW_MS > THRESHOLDS.FAST_MS);
});
