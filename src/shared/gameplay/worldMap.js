import { activities } from '../../features/curriculum/catalog.js';

const WORLD_BLUEPRINTS = [
  { id: 'world-1', order: 1, name: 'Premiers pas', icon: '1', grades: ['P2'], subjects: ['mathematics', 'french'] },
  { id: 'world-2', order: 2, name: 'Nombres et mots', icon: '2', grades: ['P2'], subjects: ['mathematics', 'french', 'dutch'] },
  { id: 'world-3', order: 3, name: 'Vie quotidienne', icon: '3', grades: ['P2'], subjects: ['mathematics', 'english', 'spanish'] },
  { id: 'world-4', order: 4, name: 'Lire et comprendre', icon: '4', grades: ['P2', 'P3'], subjects: ['french', 'stories'] },
  { id: 'world-5', order: 5, name: 'Logique douce', icon: '5', grades: ['P2', 'P3'], subjects: ['reasoning', 'mathematics'] },
  { id: 'world-6', order: 6, name: 'Calcul rapide', icon: '6', grades: ['P3'], subjects: ['mathematics'] },
  { id: 'world-7', order: 7, name: 'Langues du monde', icon: '7', grades: ['P3', 'P4'], subjects: ['dutch', 'english', 'spanish'] },
  { id: 'world-8', order: 8, name: 'Multiplications', icon: '8', grades: ['P3', 'P4'], subjects: ['mathematics'] },
  { id: 'world-9', order: 9, name: 'Problemes et strategie', icon: '9', grades: ['P3', 'P4', 'P5'], subjects: ['mathematics', 'reasoning'] },
  { id: 'world-10', order: 10, name: 'Precision', icon: '10', grades: ['P4', 'P5'], subjects: ['french', 'english', 'spanish'] },
  { id: 'world-11', order: 11, name: 'Maitrise', icon: '11', grades: ['P5', 'P6'], subjects: ['mathematics', 'reasoning', 'stories'] },
  { id: 'world-12', order: 12, name: 'Grand voyage', icon: '12', grades: ['P6', 'P5', 'P4', 'P3', 'P2'], subjects: ['mathematics', 'french', 'dutch', 'english', 'spanish', 'reasoning', 'stories'] }
];

function getGradeRank(gradeId) {
  return Number(String(gradeId).replace('P', '')) || 0;
}

function sortActivitiesByGradeAndSubject(list) {
  return [...list].sort((left, right) => {
    const gradeDelta = getGradeRank(left.gradeBand?.[0]) - getGradeRank(right.gradeBand?.[0]);
    if (gradeDelta !== 0) return gradeDelta;
    return left.subject.localeCompare(right.subject);
  });
}

function getPoolForWorld(world) {
  const filtered = activities.filter((activity) => {
    const activityGrades = activity.gradeBand || [];
    const hasGrade = activityGrades.some((gradeId) => world.grades.includes(gradeId));
    return hasGrade && world.subjects.includes(activity.subject);
  });
  return sortActivitiesByGradeAndSubject(filtered);
}

function createLevelsFromPool(worldId, missionOrder, pool, offset) {
  return Array.from({ length: 10 }, (_, index) => {
    const source = pool[(offset + index) % pool.length];
    return {
      id: `${worldId}-mission-${missionOrder}-level-${index + 1}`,
      order: index + 1,
      activityId: source.id,
      subjectId: source.subject,
      gradeId: source.gradeBand?.[0] || 'P2',
      title: source.title,
      estimatedDurationMin: source.estimatedDurationMin || 8
    };
  });
}

function buildWorld(world) {
  const pool = getPoolForWorld(world);
  if (!pool.length) {
    return { ...world, missions: [] };
  }

  const missions = Array.from({ length: 10 }, (_, index) => ({
    id: `${world.id}-mission-${index + 1}`,
    order: index + 1,
    title: `${world.name} ${index + 1}`,
    levels: createLevelsFromPool(world.id, index + 1, pool, index * 3)
  }));

  return {
    ...world,
    missions
  };
}

export const worldMap = WORLD_BLUEPRINTS.map(buildWorld);

export function getWorldById(worldId) {
  return worldMap.find((world) => world.id === worldId) || null;
}

export function getMission(worldId, missionId) {
  const world = getWorldById(worldId);
  if (!world) return null;
  return world.missions.find((mission) => mission.id === missionId) || null;
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

export function isMissionCompleted(mission, progress) {
  return mission.levels.every((level) => progress.activities[level.activityId]?.completed);
}

export function getMissionProgress(mission, progress) {
  const completed = mission.levels.filter((level) => progress.activities[level.activityId]?.completed).length;
  const perfect = mission.levels.filter((level) => (progress.activities[level.activityId]?.bestScore || 0) >= 10).length;
  return {
    completed,
    perfect,
    total: mission.levels.length
  };
}

export function getWorldProgress(world, progress) {
  const levels = world.missions.flatMap((mission) => mission.levels);
  const completed = levels.filter((level) => progress.activities[level.activityId]?.completed).length;
  const perfect = levels.filter((level) => (progress.activities[level.activityId]?.bestScore || 0) >= 10).length;
  return {
    completed,
    perfect,
    total: levels.length
  };
}
