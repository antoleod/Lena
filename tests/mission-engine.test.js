import test from 'node:test';
import assert from 'node:assert/strict';
import {
  nextBand, detectLimit, startingBand, isMissionComplete,
  MAX_BAND, MIN_BAND, MAX_CHALLENGES,
} from '../src/features/missionImpossible/missionEngine.js';

test('nextBand steps up after a correct streak', () => {
  assert.deepEqual(nextBand(2, [true, true]), { band: 3, direction: 'up' });
});

test('nextBand steps down after a wrong streak', () => {
  assert.deepEqual(nextBand(3, [false, false]), { band: 2, direction: 'down' });
});

test('nextBand stays without a streak', () => {
  assert.deepEqual(nextBand(3, [true, false]), { band: 3, direction: 'stay' });
});

test('nextBand cannot exceed MAX_BAND or go below MIN_BAND', () => {
  assert.equal(nextBand(MAX_BAND, [true, true]).band, MAX_BAND);
  assert.equal(nextBand(MIN_BAND, [false, false]).band, MIN_BAND);
});

test('startingBand sits one below the grade index, clamped', () => {
  assert.equal(startingBand(4), 3);
  assert.equal(startingBand(1), MIN_BAND);
  assert.equal(startingBand(null), 2);
});

test('detectLimit returns the highest band answered correctly', () => {
  const log = [
    { band: 2, isCorrect: true }, { band: 3, isCorrect: true },
    { band: 4, isCorrect: false }, { band: 4, isCorrect: false },
  ];
  assert.equal(detectLimit(log), 3);
});

test('detectLimit falls back to lowest attempted when all wrong', () => {
  assert.equal(detectLimit([{ band: 2, isCorrect: false }, { band: 3, isCorrect: false }]), 2);
});

test('isMissionComplete triggers at MAX_CHALLENGES', () => {
  assert.equal(isMissionComplete(new Array(MAX_CHALLENGES).fill({})), true);
  assert.equal(isMissionComplete(new Array(MAX_CHALLENGES - 1).fill({})), false);
});
