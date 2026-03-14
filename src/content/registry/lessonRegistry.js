import { modules } from '../../features/curriculum/catalog.js';
import { getModuleJourney } from '../../shared/gameplay/moduleJourney.js';
import { resolveMission, resolveWorld } from './worldRegistry.js';

function warnMissing(type, key) {
  if (import.meta.env.DEV) {
    console.warn(`[registry:${type}] Missing key: ${key}`);
  }
}

export function getLessonRegistry() {
  return modules.reduce((registry, module) => {
    registry[module.id] = getModuleJourney(module);
    return registry;
  }, {});
}

export function resolveModuleLesson(moduleId) {
  const module = modules.find((entry) => entry.id === moduleId) || null;
  if (!module) {
    warnMissing('lesson', moduleId);
    return null;
  }
  return getModuleJourney(module);
}

export function resolveMissionLesson(worldId, missionId) {
  const world = resolveWorld(worldId);
  const mission = resolveMission(worldId, missionId);

  if (!world || !mission) {
    return null;
  }

  return {
    id: `${world.id}:${mission.id}`,
    world,
    mission,
    activities: mission.levels.map((level) => level.activityId)
  };
}

