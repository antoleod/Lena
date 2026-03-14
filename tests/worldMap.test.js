import test from 'node:test';
import assert from 'node:assert/strict';
import { worldMap } from '../src/shared/gameplay/worldMap.js';

test('every world mission has at least one playable level', () => {
  worldMap.forEach((world) => {
    world.missions.forEach((mission) => {
      assert.ok(mission.levels.length > 0, `${world.id}/${mission.id} has no levels`);
      mission.levels.forEach((level) => {
        assert.ok(level.activityId, `${world.id}/${mission.id}/${level.id} has no activity`);
      });
    });
  });
});
