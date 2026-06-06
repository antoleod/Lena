import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateExercises, normalizeAnswer, checkAnswer } from '../src/features/exerciseGenerator/exerciseEngine.js';
import { SUBJECTS } from '../src/features/exerciseGenerator/exerciseTypes.js';

test('generateExercises returns requested count with full shape', () => {
  const list = generateExercises({ subject: 'math', type: 'additions', level: 'easy', count: 10 });
  assert.equal(list.length, 10);
  for (const ex of list) {
    assert.ok(ex.id && ex.subject === 'math' && ex.type === 'additions');
    assert.ok(ex.question && ex.testQuestion && ex.answer !== undefined && ex.explanation);
    assert.ok(['number', 'text', 'choice'].includes(ex.inputType));
  }
});

test('every catalogued type has a working generator', () => {
  for (const s of SUBJECTS) {
    for (const t of s.types) {
      const list = generateExercises({ subject: s.id, type: t.id, level: 'medium', count: 3 });
      assert.ok(list.length === 3, `${s.id}:${t.id} generated nothing`);
    }
  }
});

test('generated exercises self-check as correct against their own answer', () => {
  for (const s of SUBJECTS) {
    for (const t of s.types) {
      for (const ex of generateExercises({ subject: s.id, type: t.id, level: 'easy', count: 5 })) {
        assert.ok(checkAnswer(ex, ex.answer), `${ex.id} did not validate its own answer`);
      }
    }
  }
});

test('digits option produces up to N-digit additions/subtractions', () => {
  for (const [digits, max] of [[2, 99], [3, 999], [4, 9999]]) {
    for (const type of ['additions', 'soustractions']) {
      for (const ex of generateExercises({ subject: 'math', type, level: 'easy', count: 10, digits })) {
        const nums = ex.testQuestion.match(/\d+/g).map(Number);
        assert.ok(nums.some((n) => n > 9), `${type} d${digits}: should include multi-digit`);
        assert.ok(nums.every((n) => n <= max + 1), `${type} d${digits}: within range`);
        assert.ok(checkAnswer(ex, ex.answer));
      }
    }
  }
});

test('normalizeAnswer + flexible matching', () => {
  assert.equal(normalizeAnswer('  Bonjour. '), 'bonjour');
  assert.equal(normalizeAnswer('ÉCOLE'), 'ecole');
  const ex = { answer: '20', acceptedAnswers: ['20', '20 mm'] };
  assert.ok(checkAnswer(ex, '20mm'));
  assert.ok(checkAnswer(ex, '20 mm'));
  assert.ok(checkAnswer(ex, '20'));
  assert.ok(!checkAnswer(ex, '21'));
});
