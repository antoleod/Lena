import { worldMap, getMission, getWorldById } from '../../shared/gameplay/worldMap.js';

function warnMissing(type, key) {
  if (import.meta.env.DEV) {
    console.warn(`[registry:${type}] Missing key: ${key}`);
  }
}

export function getWorldRegistry() {
  return worldMap.reduce((registry, world) => {
    registry[world.id] = world;
    return registry;
  }, {});
}

export function resolveWorld(worldId) {
  const world = getWorldById(worldId);
  if (!world && worldId) {
    warnMissing('world', worldId);
  }
  return world || null;
}

export function resolveMission(worldId, missionId) {
  const mission = getMission(worldId, missionId);
  if (!mission && worldId && missionId) {
    warnMissing('mission', `${worldId}:${missionId}`);
  }
  return mission || null;
}

export function resolveMissionById(missionId) {
  for (const world of worldMap) {
    const mission = world.missions.find((entry) => entry.id === missionId);
    if (mission) {
      return {
        world,
        mission
      };
    }
  }

  if (missionId) {
    warnMissing('mission', missionId);
  }
  return null;
}

export function resolveFirstPlayableMission() {
  const firstWorld = worldMap[0];
  const firstMission = firstWorld?.missions?.[0];
  const firstLevel = firstMission?.levels?.[0];

  if (!firstWorld || !firstMission || !firstLevel) {
    warnMissing('world', 'first-playable-mission');
    return null;
  }

  return {
    world: firstWorld,
    mission: firstMission,
    level: firstLevel,
    route: `/activities/${firstLevel.activityId}?world=${firstWorld.id}&mission=${firstMission.id}&level=${firstLevel.order}`
  };
}
