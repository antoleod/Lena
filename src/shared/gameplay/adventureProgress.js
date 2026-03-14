import { getActivityById } from '../../features/curriculum/catalog.js';
import { getProfile } from '../../services/storage/profileStore.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';
import { getMission, getMissionProgress, getWorldById, worldMap } from './worldMap.js';

function getWorldsForPrimaryAdventure() {
  return worldMap.filter((world) =>
    world.order <= 5 && world.gradeIds.some((gradeId) => gradeId === 'P2' || gradeId === 'P3')
  );
}

function isWorldUnlocked(world, focusWorlds, progress, profile = getProfile()) {
  const firstWorld = focusWorlds[0];
  if (!firstWorld) {
    return false;
  }

  if (profile.worldsUnlocked?.includes(world.id)) {
    return true;
  }

  if (world.id === firstWorld.id) {
    return true;
  }

  const previousWorld = focusWorlds.find((entry) => entry.order === world.order - 1);
  if (!previousWorld) {
    return true;
  }

  const previousWorldLevels = previousWorld.missions.flatMap((mission) => mission.levels);
  const completed = previousWorldLevels.filter((level) => progress.levels[level.id]?.completed || progress.activities[level.activityId]?.completed).length;
  return completed >= Math.max(1, Math.floor(previousWorldLevels.length * 0.4));
}

function isMissionUnlocked(world, mission, progress, profile = getProfile()) {
  if (profile.missionsUnlocked?.includes(`${world.id}::${mission.id}`)) {
    return true;
  }

  if (mission.order === 1) {
    return true;
  }

  const previousMission = world.missions.find((entry) => entry.order === mission.order - 1);
  if (!previousMission) {
    return true;
  }

  const previousProgress = getMissionProgress(previousMission, progress);
  return previousProgress.completed >= Math.max(1, Math.floor(previousProgress.total * 0.4));
}

export function getNextAdventureTarget(progressInput = getProgressSnapshot()) {
  const progress = progressInput;
  const focusWorlds = getWorldsForPrimaryAdventure();
  const profile = getProfile();

  for (const world of focusWorlds) {
    if (!isWorldUnlocked(world, focusWorlds, progress, profile)) {
      continue;
    }

    for (const mission of world.missions) {
      if (!isMissionUnlocked(world, mission, progress, profile)) {
        continue;
      }

      const nextLevel = mission.levels.find((level) => !progress.levels[level.id]?.completed && !progress.activities[level.activityId]?.completed) || mission.levels[0];
      if (!nextLevel) {
        continue;
      }

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
  if (!nextTarget) {
    return {
      nextTarget: null,
      currentWorld: null,
      currentMission: null,
      currentActivity: null,
      completedNodes: 0,
      totalNodes: 0
    };
  }

  const focusWorlds = getWorldsForPrimaryAdventure();
  const allLevels = focusWorlds.flatMap((world) => world.missions.flatMap((mission) => mission.levels));
  const completedNodes = allLevels.filter((level) => progressInput.levels[level.id]?.completed || progressInput.activities[level.activityId]?.completed).length;

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
  const completed = levels.filter((level) => progress.levels[level.id]?.completed || progress.activities[level.activityId]?.completed).length;
  const firstPendingMission = world.missions.find((mission) => {
    const missionProgress = getMissionProgress(mission, progress);
    return missionProgress.completed < missionProgress.total;
  }) || world.missions[world.missions.length - 1] || null;

  return {
    completed,
    total: levels.length,
    rewardPreview: world.missions.some((mission) => mission.nodeType === 'reward' || mission.nodeType === 'checkpoint') ? '+25 crystals' : '+10 crystals',
    checkpointMission: world.missions.find((mission) => mission.nodeType === 'checkpoint' || mission.nodeType === 'reward') || firstPendingMission,
    nextMission: firstPendingMission
  };
}
