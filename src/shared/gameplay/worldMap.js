import { defineLevel } from '../types/index.js';
import { worldJourneyData } from '../../content/worlds/index.js';
import { resolveExistingActivities } from '../utils/contentResolution.js';

function resolveMissionLevels(worldId, mission, activityIds) {
  const resolvedActivities = resolveExistingActivities(activityIds, `world:${worldId}:${mission.id}`);

  if (!resolvedActivities.length) {
    return [];
  }

  return mission.levelIds.map((levelId, index) => {
    const source = resolvedActivities[index % resolvedActivities.length];
    return {
      ...defineLevel({
        id: levelId,
        missionId: mission.id,
        order: index + 1,
        title: source.title,
        exerciseIds: [],
        estimatedDurationMin: source.estimatedDurationMin || 8,
        subjectId: source.subject,
        gradeId: source.gradeBand?.[0] || 'P2',
        challengeId: index === 8 ? source.id : null,
        examId: index === 9 ? source.id : null
      }),
      activityId: source.id
    };
  });
}

export const worldMap = worldJourneyData.map((world) => ({
  ...world,
  missions: world.missions.map((mission) => ({
    ...mission,
    activityIds: resolveExistingActivities(world.missionActivityMap[mission.id] || [], `world:${world.id}:${mission.id}`).map((activity) => activity.id),
    levels: resolveMissionLevels(world.id, mission, world.missionActivityMap[mission.id] || [])
  })).filter((mission) => mission.levels.length > 0)
}));

export function getWorldById(worldId) {
  return worldMap.find((world) => world.id === worldId) || null;
}

export function getMission(worldId, missionId) {
  const world = getWorldById(worldId);
  if (!world) return null;
  return world.missions.find((mission) => mission.id === missionId) || null;
}

export function getLevelProgressRecord(progress, level) {
  return progress?.levels?.[level.id] || progress?.activities?.[level.activityId] || null;
}

export function getNextMissionTarget(worldId, missionId, levelOrder) {
  const world = getWorldById(worldId);
  if (!world) return null;

  const mission = world.missions.find((entry) => entry.id === missionId);
  if (!mission) return null;

  const nextLevel = mission.levels.find((entry) => entry.order === levelOrder + 1);
  if (nextLevel) {
    return {
      worldId: world.id,
      missionId: mission.id,
      levelOrder: nextLevel.order,
      activityId: nextLevel.activityId
    };
  }

  const nextMission = world.missions.find((entry) => entry.order === mission.order + 1);
  if (!nextMission?.levels?.length) {
    return null;
  }

  return {
    worldId: world.id,
    missionId: nextMission.id,
    levelOrder: nextMission.levels[0].order,
    activityId: nextMission.levels[0].activityId
  };
}

export function findPositionForActivity(activityId) {
  for (const world of worldMap) {
    for (const mission of world.missions) {
      const level = mission.levels.find((entry) => entry.activityId === activityId);
      if (level) {
        return {
          worldId: world.id,
          worldOrder: world.order,
          worldName: world.name,
          missionId: mission.id,
          missionOrder: mission.order,
          levelOrder: level.order,
          activityId
        };
      }
    }
  }
  return null;
}

export function findPositionForLevel(levelId) {
  for (const world of worldMap) {
    for (const mission of world.missions) {
      const level = mission.levels.find((entry) => entry.id === levelId);
      if (level) {
        return {
          worldId: world.id,
          worldOrder: world.order,
          worldName: world.name,
          missionId: mission.id,
          missionOrder: mission.order,
          levelId: level.id,
          levelOrder: level.order,
          activityId: level.activityId
        };
      }
    }
  }
  return null;
}

export function isMissionCompleted(mission, progress) {
  return mission.levels.every((level) => getLevelProgressRecord(progress, level)?.completed);
}

export function getMissionProgress(mission, progress) {
  const completed = mission.levels.filter((level) => getLevelProgressRecord(progress, level)?.completed).length;
  const perfect = mission.levels.filter((level) => (getLevelProgressRecord(progress, level)?.bestScore || 0) >= 10).length;
  return {
    completed,
    perfect,
    total: mission.levels.length
  };
}

export function getWorldProgress(world, progress) {
  const levels = world.missions.flatMap((mission) => mission.levels);
  const completed = levels.filter((level) => getLevelProgressRecord(progress, level)?.completed).length;
  const perfect = levels.filter((level) => (getLevelProgressRecord(progress, level)?.bestScore || 0) >= 10).length;
  return {
    completed,
    perfect,
    total: levels.length
  };
}
