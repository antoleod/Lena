import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { mathematicsActivities } from '../src/content/mathematics/activities.js';
import { modules } from '../src/features/curriculum/catalog.js';
import { getRewardCatalog } from '../src/services/storage/rewardStore.js';

const rootDir = process.cwd();

function findActivity(id) {
  return mathematicsActivities.find((activity) => activity.id === id);
}

test('multiplication tables 2 to 12 exist', () => {
  for (let table = 2; table <= 12; table += 1) {
    assert.ok(findActivity(`multiplication-table-${table}`), `missing multiplication table ${table}`);
  }
});

test('division tables 2 to 12 exist', () => {
  for (let table = 2; table <= 12; table += 1) {
    assert.ok(findActivity(`division-table-${table}`), `missing division table ${table}`);
  }
});

test('all focus math modules for P2 and P3 have playable levels', () => {
  const focusModules = modules.filter((module) =>
    module.subjectId === 'mathematics' && (module.gradeId === 'P2' || module.gradeId === 'P3')
  );

  focusModules.forEach((module) => {
    assert.ok(module.mission?.levels?.length > 0, `module ${module.id} has no mission levels`);
  });
});

test('reward catalog asset paths exist and icon rewards are populated', () => {
  getRewardCatalog().forEach((item) => {
    if (item.assetPath) {
      const assetPath = path.join(rootDir, 'public', item.assetPath);
      assert.ok(fs.existsSync(assetPath), `missing asset for ${item.id}: ${item.assetPath}`);
    } else {
      assert.ok(item.icon && String(item.icon).trim().length > 0, `missing icon for ${item.id}`);
    }
  });
});

test('shop catalog has inventory for visible sections', () => {
  const catalog = getRewardCatalog();
  ['avatar', 'theme', 'wallpaper', 'effect', 'sticker', 'pet'].forEach((type) => {
    assert.ok(catalog.some((item) => item.type === type), `shop category empty: ${type}`);
  });
});
