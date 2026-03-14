import test from 'node:test';
import assert from 'node:assert/strict';
import { activities, modules } from '../src/features/curriculum/catalog.js';
import { resolveActivity } from '../src/content/registry/activityRegistry.js';
import { getModuleJourney } from '../src/shared/gameplay/moduleJourney.js';

test('activity registry resolves every catalog activity', () => {
  activities.forEach((activity) => {
    assert.ok(resolveActivity(activity.id), `missing activity ${activity.id}`);
  });
});

test('module journeys expose only resolvable activities', () => {
  modules.forEach((module) => {
    const journey = getModuleJourney(module);
    journey.activities.forEach((activity) => {
      assert.ok(resolveActivity(activity.id), `module ${module.id} exposes unresolved activity ${activity.id}`);
    });
  });
});
