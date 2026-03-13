/**
 * Domain contracts for player progress, mastery and session snapshots.
 */

function assertRequiredFields(entityName, value, requiredFields) {
  requiredFields.forEach((field) => {
    if (value[field] === undefined || value[field] === null || value[field] === '') {
      throw new Error(`${entityName} is missing required field "${field}".`);
    }
  });
}

function cloneObjectMap(value) {
  return value && typeof value === 'object' ? { ...value } : {};
}

function cloneList(list) {
  return Array.isArray(list) ? [...list] : [];
}

/**
 * @typedef {"locked"|"available"|"in_progress"|"completed"|"perfect"} ProgressStatus
 */

/**
 * @typedef {"unseen"|"failed"|"shaky"|"mastered"} MasteryStatus
 */

/**
 * @typedef {Object} QuestionProgress
 * @property {string} exerciseId
 * @property {number} attempts
 * @property {number} failures
 * @property {number} successStreak
 * @property {MasteryStatus} mastery
 * @property {number|null} [lastSeenAt]
 */

/**
 * @typedef {Object} LevelProgress
 * @property {string} levelId
 * @property {ProgressStatus} status
 * @property {number} attempts
 * @property {number} score
 * @property {number} bestScore
 * @property {number|null} [lastPlayedAt]
 * @property {number|null} [completedAt]
 * @property {string[]} [repeatQueue]
 */

/**
 * @typedef {Object} MissionProgress
 * @property {string} missionId
 * @property {ProgressStatus} status
 * @property {number} completedLevels
 * @property {number} perfectLevels
 * @property {number} totalLevels
 */

/**
 * @typedef {Object} WorldProgress
 * @property {string} worldId
 * @property {ProgressStatus} status
 * @property {number} completedMissions
 * @property {number} perfectMissions
 * @property {number} totalMissions
 */

/**
 * @typedef {Object} PlayerProgressSnapshot
 * @property {string} playerId
 * @property {Object.<string, LevelProgress>} levels
 * @property {Object.<string, MissionProgress>} missions
 * @property {Object.<string, WorldProgress>} worlds
 * @property {Object.<string, QuestionProgress>} questions
 * @property {number} totalStudyMinutes
 * @property {number} streakCurrent
 * @property {number} streakBest
 * @property {number} totalCorrect
 * @property {number} totalWrong
 * @property {string[]} [unlockedWorldIds]
 * @property {string[]} [unlockedMissionIds]
 * @property {string|null} [lastLevelId]
 * @property {string|null} [lastActivityId]
 */

export function defineQuestionProgress(input) {
  const value = {
    exerciseId: '',
    attempts: 0,
    failures: 0,
    successStreak: 0,
    mastery: 'unseen',
    lastSeenAt: null,
    ...input
  };
  assertRequiredFields('QuestionProgress', value, ['exerciseId', 'mastery']);
  return Object.freeze(value);
}

export function defineLevelProgress(input) {
  const value = {
    levelId: '',
    status: 'locked',
    attempts: 0,
    score: 0,
    bestScore: 0,
    lastPlayedAt: null,
    completedAt: null,
    repeatQueue: [],
    ...input,
    repeatQueue: cloneList(input?.repeatQueue)
  };
  assertRequiredFields('LevelProgress', value, ['levelId', 'status']);
  return Object.freeze(value);
}

export function defineMissionProgress(input) {
  const value = {
    missionId: '',
    status: 'locked',
    completedLevels: 0,
    perfectLevels: 0,
    totalLevels: 0,
    ...input
  };
  assertRequiredFields('MissionProgress', value, ['missionId', 'status']);
  return Object.freeze(value);
}

export function defineWorldProgress(input) {
  const value = {
    worldId: '',
    status: 'locked',
    completedMissions: 0,
    perfectMissions: 0,
    totalMissions: 0,
    ...input
  };
  assertRequiredFields('WorldProgress', value, ['worldId', 'status']);
  return Object.freeze(value);
}

export function definePlayerProgressSnapshot(input) {
  const value = {
    playerId: 'default',
    levels: {},
    missions: {},
    worlds: {},
    questions: {},
    totalStudyMinutes: 0,
    streakCurrent: 0,
    streakBest: 0,
    totalCorrect: 0,
    totalWrong: 0,
    unlockedWorldIds: [],
    unlockedMissionIds: [],
    lastLevelId: null,
    lastActivityId: null,
    ...input,
    levels: cloneObjectMap(input?.levels),
    missions: cloneObjectMap(input?.missions),
    worlds: cloneObjectMap(input?.worlds),
    questions: cloneObjectMap(input?.questions),
    unlockedWorldIds: cloneList(input?.unlockedWorldIds),
    unlockedMissionIds: cloneList(input?.unlockedMissionIds)
  };
  assertRequiredFields('PlayerProgressSnapshot', value, ['playerId']);
  return Object.freeze(value);
}

