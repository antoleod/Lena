/**
 * Domain contracts for exercises and renderable exercise payloads.
 * The model supports text-only activities today and media-based options later.
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
 * @typedef {"multiple-choice"|"single-choice"|"matching"|"ordering"|"fill-word"|"fill-sentence"|"fill-number"|"story"|"grid"|"drag-drop"} ExerciseType
 */

/**
 * @typedef {"image"|"audio"|"illustration"} ExerciseMediaKind
 */

/**
 * @typedef {Object} ExerciseMediaAsset
 * @property {string} id
 * @property {ExerciseMediaKind} kind
 * @property {string} src
 * @property {string} [alt]
 * @property {string} [caption]
 */

/**
 * @typedef {Object} ExerciseOption
 * @property {string} id
 * @property {string} value
 * @property {string} [label]
 * @property {string} [description]
 * @property {ExerciseMediaAsset|null} [media]
 * @property {string} [accessibilityLabel]
 */

/**
 * @typedef {Object} ExerciseRemediationRule
 * @property {number} afterFailures
 * @property {string} action
 * @property {string} [message]
 */

/**
 * @typedef {Object} ExerciseDefinition
 * @property {string} id
 * @property {string} subjectId
 * @property {string} gradeId
 * @property {ExerciseType} type
 * @property {string} prompt
 * @property {ExerciseOption[]} options
 * @property {string[]} correctOptionIds
 * @property {string} [instruction]
 * @property {ExerciseMediaAsset[]} [media]
 * @property {string[]} [context]
 * @property {string} [hint]
 * @property {string} [explanation]
 * @property {number} [rewardValue]
 * @property {string} [difficulty]
 * @property {string[]} [tags]
 * @property {ExerciseRemediationRule[]} [remediation]
 */

export function defineExerciseMediaAsset(input) {
  const value = {
    id: '',
    kind: 'image',
    src: '',
    alt: '',
    caption: '',
    ...input
  };
  assertRequiredFields('ExerciseMediaAsset', value, ['id', 'kind', 'src']);
  return Object.freeze(value);
}

export function defineExerciseOption(input) {
  const value = {
    id: '',
    value: '',
    label: '',
    description: '',
    media: null,
    accessibilityLabel: '',
    ...input
  };
  assertRequiredFields('ExerciseOption', value, ['id', 'value']);
  return Object.freeze(value);
}

export function defineExerciseRemediationRule(input) {
  const value = {
    afterFailures: 1,
    action: '',
    message: '',
    ...input
  };
  assertRequiredFields('ExerciseRemediationRule', value, ['afterFailures', 'action']);
  return Object.freeze(value);
}

export function defineExercise(input) {
  const value = {
    id: '',
    subjectId: '',
    gradeId: '',
    type: 'multiple-choice',
    prompt: '',
    instruction: '',
    options: [],
    correctOptionIds: [],
    media: [],
    context: [],
    hint: '',
    explanation: '',
    rewardValue: 0,
    difficulty: '',
    tags: [],
    remediation: [],
    ...input,
    options: cloneList(input?.options),
    correctOptionIds: cloneList(input?.correctOptionIds),
    media: cloneList(input?.media),
    context: cloneList(input?.context),
    tags: cloneList(input?.tags),
    remediation: cloneList(input?.remediation)
  };
  assertRequiredFields('ExerciseDefinition', value, ['id', 'subjectId', 'gradeId', 'type', 'prompt']);
  return Object.freeze(value);
}

