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

test('locale localizes math statements (fr/nl/en/es)', () => {
  const wrappers = {
    fr: /Combien font/, nl: /Hoeveel is/, en: /How much is/, es: /Cuánto es/,
  };
  for (const [locale, re] of Object.entries(wrappers)) {
    const [ex] = generateExercises({ subject: 'math', type: 'additions', level: 'easy', count: 1, locale });
    assert.match(ex.testQuestion, re, `additions ${locale}`);
  }
  // measurements convert phrasing
  const [m] = generateExercises({ subject: 'math', type: 'measurements', level: 'easy', count: 1, locale: 'en' });
  assert.match(m.testQuestion, /Convert/);
});

test('no duplicate questions on a sheet; math has progressive hints + method', () => {
  for (const type of ['additions', 'soustractions']) {
    const list = generateExercises({ subject: 'math', type, level: 'medium', count: 12 });
    const qs = list.map((e) => e.question);
    assert.equal(new Set(qs).size, qs.length, `${type} produced duplicates`);
    for (const ex of list) {
      assert.ok(Array.isArray(ex.hints) && ex.hints.length === 3, `${type} needs 3 hints`);
      assert.ok(ex.method && ex.improvementTip);
    }
  }
  // french "complete" carries 3 contextual hints and avoids duplicates
  const fr = generateExercises({ subject: 'french', type: 'completer', level: 'easy', count: 8 });
  assert.equal(new Set(fr.map((e) => e.question)).size, fr.length);
  assert.ok(fr.every((e) => Array.isArray(e.hints) && e.hints.length === 3));
});

test('every exercise type carries hints + improvementTip (teacher support)', () => {
  for (const s of SUBJECTS) {
    for (const t of s.types) {
      for (const ex of generateExercises({ subject: s.id, type: t.id, level: 'medium', count: 3 })) {
        assert.ok(Array.isArray(ex.hints) && ex.hints.length >= 1, `${s.id}:${t.id} missing hints`);
        assert.ok(ex.improvementTip, `${s.id}:${t.id} missing improvementTip`);
      }
    }
  }
});

test('number size and number of operands are independent', () => {
  for (const terms of [2, 3, 4, 5]) {
    for (const digits of [1, 2, 3]) {
      const [ex] = generateExercises({ subject: 'math', type: 'additions', level: 'easy', count: 1, digits, terms });
      const nums = ex.question.match(/\d+/g).map(Number);
      // operand count = terms (last number in `question` is part of "= ……", not a number)
      assert.equal(nums.length, terms, `add terms=${terms} digits=${digits}`);
      const max = digits === 1 ? 9 : digits === 2 ? 99 : 999;
      assert.ok(nums.every((n) => n >= (digits === 1 ? 1 : 10) && n <= max), `range d=${digits}`);
      assert.ok(checkAnswer(ex, ex.answer));
    }
  }
  // subtraction stays non-negative with many operands
  for (const terms of [3, 4, 5]) {
    const [ex] = generateExercises({ subject: 'math', type: 'soustractions', level: 'hard', count: 1, digits: 2, terms });
    assert.ok(Number(ex.answer) >= 0, `sub non-negative terms=${terms}`);
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
