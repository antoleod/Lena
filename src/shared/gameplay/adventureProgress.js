import { getActivityById } from '../../features/curriculum/catalog.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';
import { getMission, getMissionProgress, getWorldById, worldMap } from './worldMap.js';

// All worlds and missions are ALWAYS unlocked — no gates.
// Progress is tracked and displayed, but never blocks access.

function getWorldsForPrimaryAdventure() {
  return worldMap.filter((world) =>
    world.order <= 5 && world.gradeIds.some((gradeId) => gradeId === 'P2' || gradeId === 'P3')
  );
}

// Always returns true — every world is accessible from day 1
function isWorldUnlocked() {
  return true;
}

// Always returns true — every mission is accessible from day 1
function isMissionUnlocked() {
  return true;
}

export function getNextAdventureTarget(progressInput = getProgressSnapshot()) {
  const progress = progressInput;
  const focusWorlds = getWorldsForPrimaryAdventure();

  for (const world of focusWorlds) {
    for (const mission of world.missions) {
      const nextLevel =
        mission.levels.find(
          (level) =>
            !progress.levels[level.id]?.completed &&
            !progress.activities[level.activityId]?.completed
        ) || null;

      if (!nextLevel) continue;

      return {
        world,
        mission,
        level: nextLevel,
        activity: getActivityById(nextLevel.activityId),
        route: `/activities/${nextLevel.activityId}?world=${world.id}&mission=${mission.id}&level=${nextLevel.order}`
      };
    }
  }

  return null;
}

export function getAdventureDashboard(progressInput = getProgressSnapshot()) {
  const nextTarget = getNextAdventureTarget(progressInput);
  const focusWorlds = getWorldsForPrimaryAdventure();
  const allLevels = focusWorlds.flatMap((world) =>
    world.missions.flatMap((mission) => mission.levels)
  );
  const completedNodes = allLevels.filter(
    (level) =>
      progressInput.levels[level.id]?.completed ||
      progressInput.activities[level.activityId]?.completed
  ).length;

  if (!nextTarget) {
    return {
      nextTarget: null,
      currentWorld: null,
      currentMission: null,
      currentActivity: null,
      completedNodes,
      totalNodes: allLevels.length
    };
  }

  return {
    nextTarget,
    currentWorld: getWorldById(nextTarget.world.id),
    currentMission: getMission(nextTarget.world.id, nextTarget.mission.id),
    currentActivity: nextTarget.activity,
    completedNodes,
    totalNodes: allLevels.length
  };
}

export function getWorldNodeSummary(world, progressInput = getProgressSnapshot()) {
  const progress = progressInput;
  const levels = world.missions.flatMap((mission) => mission.levels);
  const completed = levels.filter(
    (level) =>
      progress.levels[level.id]?.completed ||
      progress.activities[level.activityId]?.completed
  ).length;

  // Stars: 0-2 completed = 0★, up to 50% = 1★, up to 99% = 2★, 100% = 3★
  const pct = levels.length ? completed / levels.length : 0;
  const stars = pct === 1 ? 3 : pct >= 0.5 ? 2 : pct > 0 ? 1 : 0;

  const firstPendingMission =
    world.missions.find((mission) => {
      const mp = getMissionProgress(mission, progress);
      return mp.completed < mp.total;
    }) ||
    world.missions[world.missions.length - 1] ||
    null;

  return {
    completed,
    total: levels.length,
    stars,
    rewardPreview:
      world.missions.some(
        (mission) => mission.nodeType === 'reward' || mission.nodeType === 'checkpoint'
      )
        ? '+25 💎'
        : '+10 💎',
    checkpointMission:
      world.missions.find(
        (mission) => mission.nodeType === 'checkpoint' || mission.nodeType === 'reward'
      ) || firstPendingMission,
    nextMission: firstPendingMission
  };
}

// Export unlocked checks so other components can use them
export { isWorldUnlocked, isMissionUnlocked };
