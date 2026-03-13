// World, mission and level definition for the global adventure map.
// Each level links to a concrete module/activity so there are no empty nodes.
import { modules } from '../../features/curriculum/catalog.js';

const WORLDS = [
  {
    id: 'world-1',
    order: 1,
    name: 'Découvrir',
    theme: 'forest-soft',
    subjectBias: ['mathematics', 'french'],
    grades: ['P2'],
    icon: '🌱'
  },
  {
    id: 'world-2',
    order: 2,
    name: 'Construire',
    theme: 'village',
    subjectBias: ['mathematics'],
    grades: ['P2'],
    icon: '🧱'
  },
  {
    id: 'world-3',
    order: 3,
    name: 'Vie quotidienne',
    theme: 'city',
    subjectBias: ['mathematics', 'dutch', 'english', 'spanish'],
    grades: ['P2'],
    icon: '🏙️'
  },
  {
    id: 'world-4',
    order: 4,
    name: 'Explorateurs',
    theme: 'maps',
    subjectBias: ['stories', 'french'],
    grades: ['P2', 'P3'],
    icon: '🗺️'
  },
  {
    id: 'world-5',
    order: 5,
    name: 'Penser',
    theme: 'lab',
    subjectBias: ['reasoning'],
    grades: ['P2', 'P3'],
    icon: '🧠'
  },
  {
    id: 'world-6',
    order: 6,
    name: 'Scientifiques',
    theme: 'space',
    subjectBias: ['mathematics', 'reasoning'],
    grades: ['P3'],
    icon: '🧪'
  },
  {
    id: 'world-7',
    order: 7,
    name: 'Aventuriers',
    theme: 'islands',
    subjectBias: ['stories', 'french'],
    grades: ['P3'],
    icon: '🏝️'
  },
  {
    id: 'world-8',
    order: 8,
    name: 'Défis',
    theme: 'mountain',
    subjectBias: ['mathematics', 'reasoning'],
    grades: ['P3'],
    icon: '⛰️'
  },
  {
    id: 'world-9',
    order: 9,
    name: 'Grands problèmes',
    theme: 'big-city',
    subjectBias: ['mathematics'],
    grades: ['P3'],
    icon: '🏗️'
  },
  {
    id: 'world-10',
    order: 10,
    name: 'Stratégie',
    theme: 'puzzle',
    subjectBias: ['reasoning'],
    grades: ['P3'],
    icon: '♟️'
  },
  {
    id: 'world-11',
    order: 11,
    name: 'Maîtrise',
    theme: 'sky',
    subjectBias: ['mathematics', 'french', 'reasoning'],
    grades: ['P2', 'P3'],
    icon: '🌌'
  },
  {
    id: 'world-12',
    order: 12,
    name: 'Grand final',
    theme: 'castle',
    subjectBias: ['mathematics', 'french', 'dutch', 'english', 'spanish', 'reasoning', 'stories'],
    grades: ['P2', 'P3'],
    icon: '🏰'
  }
];

function pickModulesForWorld(world) {
  const filtered = modules.filter((module) => {
    return world.subjectBias.includes(module.subjectId) && world.grades.includes(module.gradeId);
  });
  return filtered;
}

function buildWorldNodes(world) {
  const sourceModules = pickModulesForWorld(world);
  // Ensure we always have some real modules; if not, world will be hidden in the map UI.
  if (!sourceModules.length) {
    return { ...world, missions: [] };
  }

  // Build 10 missions per world, each mission cycles through existing modules.
  const missions = Array.from({ length: 10 }, (_, missionIndex) => {
    const missionId = `${world.id}-mission-${missionIndex + 1}`;
    const missionModules = [];
    for (let index = 0; index < 10; index += 1) {
      const module = sourceModules[(missionIndex * 10 + index) % sourceModules.length];
      missionModules.push({
        id: `${missionId}-level-${index + 1}`,
        moduleId: module.id,
        subjectId: module.subjectId,
        gradeId: module.gradeId
      });
    }
    return {
      id: missionId,
      order: missionIndex + 1,
      levels: missionModules
    };
  });

  return {
    ...world,
    missions
  };
}

export const worldMap = WORLDS.map(buildWorldNodes);

export function getWorldById(worldId) {
  return worldMap.find((world) => world.id === worldId) || null;
}

export function getMission(worldId, missionId) {
  const world = getWorldById(worldId);
  if (!world) return null;
  return world.missions.find((mission) => mission.id === missionId) || null;
}

export function findPositionForModule(moduleId) {
  for (const world of worldMap) {
    for (const mission of world.missions) {
      const index = mission.levels.findIndex((level) => level.moduleId === moduleId);
      if (index !== -1) {
        return {
          worldId: world.id,
          worldOrder: world.order,
          worldName: world.name,
          missionId: mission.id,
          missionOrder: mission.order,
          levelIndex: index
        };
      }
    }
  }
  return null;
}


