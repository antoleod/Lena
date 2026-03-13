/**
 * Domain contracts for curriculum and journey content.
 * These helpers are intentionally framework-agnostic so the same models can
 * be reused by React web now and React Native later.
 */

function assertRequiredFields(entityName, value, requiredFields) {
  requiredFields.forEach((field) => {
    if (value[field] === undefined || value[field] === null || value[field] === '') {
      throw new Error(`${entityName} is missing required field "${field}".`);
    }
  });
}

function cloneList(list) {
  return Array.isArray(list) ? [...list] : [];
}

/**
 * @typedef {Object} SubjectDefinition
 * @property {string} id
 * @property {string} label
 * @property {string[]} grades
 * @property {string} [description]
 * @property {string} [color]
 * @property {string} [accent]
 * @property {string[]} [roadmap]
 */

/**
 * @typedef {Object} ModuleDefinition
 * @property {string} id
 * @property {string} subjectId
 * @property {string} gradeId
 * @property {string} domainId
 * @property {string} title
 * @property {string} summary
 * @property {string} [domainLabel]
 * @property {string} [goal]
 * @property {string} [demo]
 * @property {string[]} [activityIds]
 * @property {string[]} [levelIds]
 * @property {string[]} [tags]
 */

/**
 * @typedef {Object} WorldDefinition
 * @property {string} id
 * @property {number} order
 * @property {string} title
 * @property {string[]} missionIds
 * @property {string} [theme]
 * @property {string} [description]
 * @property {string[]} [gradeIds]
 * @property {string[]} [subjectIds]
 */

/**
 * @typedef {Object} MissionDefinition
 * @property {string} id
 * @property {string} worldId
 * @property {number} order
 * @property {string} title
 * @property {string[]} levelIds
 * @property {string|null} [challengeLevelId]
 * @property {string|null} [examLevelId]
 * @property {string} [description]
 * @property {string[]} [tags]
 */

/**
 * @typedef {Object} LevelDefinition
 * @property {string} id
 * @property {string} missionId
 * @property {number} order
 * @property {string} title
 * @property {string[]} exerciseIds
 * @property {number} [estimatedDurationMin]
 * @property {string|null} [unlockRule]
 * @property {string|null} [subjectId]
 * @property {string|null} [gradeId]
 * @property {string|null} [moduleId]
 * @property {string|null} [challengeId]
 * @property {string|null} [examId]
 */

export function defineSubject(input) {
  const value = {
    id: '',
    label: '',
    grades: [],
    description: '',
    color: '',
    accent: '',
    roadmap: [],
    ...input,
    grades: cloneList(input?.grades),
    roadmap: cloneList(input?.roadmap)
  };
  assertRequiredFields('SubjectDefinition', value, ['id', 'label']);
  return Object.freeze(value);
}

export function defineModule(input) {
  const value = {
    id: '',
    subjectId: '',
    gradeId: '',
    domainId: '',
    domainLabel: '',
    title: '',
    summary: '',
    goal: '',
    demo: '',
    activityIds: [],
    levelIds: [],
    tags: [],
    ...input,
    activityIds: cloneList(input?.activityIds),
    levelIds: cloneList(input?.levelIds),
    tags: cloneList(input?.tags)
  };
  assertRequiredFields('ModuleDefinition', value, ['id', 'subjectId', 'gradeId', 'domainId', 'title', 'summary']);
  return Object.freeze(value);
}

export function defineWorld(input) {
  const value = {
    id: '',
    order: 0,
    title: '',
    missionIds: [],
    theme: '',
    description: '',
    gradeIds: [],
    subjectIds: [],
    ...input,
    missionIds: cloneList(input?.missionIds),
    gradeIds: cloneList(input?.gradeIds),
    subjectIds: cloneList(input?.subjectIds)
  };
  assertRequiredFields('WorldDefinition', value, ['id', 'order', 'title']);
  return Object.freeze(value);
}

export function defineMission(input) {
  const value = {
    id: '',
    worldId: '',
    order: 0,
    title: '',
    levelIds: [],
    challengeLevelId: null,
    examLevelId: null,
    description: '',
    tags: [],
    ...input,
    levelIds: cloneList(input?.levelIds),
    tags: cloneList(input?.tags)
  };
  assertRequiredFields('MissionDefinition', value, ['id', 'worldId', 'order', 'title']);
  return Object.freeze(value);
}

export function defineLevel(input) {
  const value = {
    id: '',
    missionId: '',
    order: 0,
    title: '',
    exerciseIds: [],
    estimatedDurationMin: 0,
    unlockRule: null,
    subjectId: null,
    gradeId: null,
    moduleId: null,
    challengeId: null,
    examId: null,
    ...input,
    exerciseIds: cloneList(input?.exerciseIds)
  };
  assertRequiredFields('LevelDefinition', value, ['id', 'missionId', 'order', 'title']);
  return Object.freeze(value);
}

