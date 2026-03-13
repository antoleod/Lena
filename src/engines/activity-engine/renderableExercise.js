import { assertRenderableExercise } from './exerciseValidator.js';

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

export const RENDERABLE_LAYOUTS = Object.freeze({
  CHOICES: 'choices',
  STORY: 'story',
  BUILDER: 'builder',
  GRID: 'grid'
});

export function inferRenderableLayout(type) {
  switch (type) {
    case 'fill-number':
      return RENDERABLE_LAYOUTS.BUILDER;
    case 'story':
      return RENDERABLE_LAYOUTS.STORY;
    case 'grid':
      return RENDERABLE_LAYOUTS.GRID;
    default:
      return RENDERABLE_LAYOUTS.CHOICES;
  }
}

export function createRenderableContextSlot(input) {
  const value = {
    id: '',
    kind: 'text',
    text: '',
    src: '',
    alt: '',
    caption: '',
    ...input
  };
  assertRequiredFields('RenderableContextSlot', value, ['id', 'kind']);
  return Object.freeze(value);
}

export function createRenderableOption(input) {
  const value = {
    id: '',
    value: '',
    label: '',
    description: '',
    media: null,
    accessibilityLabel: '',
    ...input
  };
  assertRequiredFields('RenderableOption', value, ['id', 'value']);
  return Object.freeze(value);
}

export function createTextContextSlots(lines = [], prefix = 'context') {
  return cloneList(lines).map((line, index) => createRenderableContextSlot({
    id: `${prefix}-${index + 1}`,
    kind: 'text',
    text: String(line)
  }));
}

export function createRenderableExercise(input) {
  const feedback = {
    hint: '',
    explanation: '',
    successText: '',
    errorText: '',
    ...(input?.feedback || {})
  };

  const meta = {
    difficulty: '',
    rewardValue: 0,
    tags: [],
    correctionType: 'auto',
    accessibility: [],
    ...(input?.meta || {})
  };

  const value = {
    id: '',
    sourceActivityId: '',
    sourceQuestionId: '',
    subjectId: '',
    gradeId: '',
    renderType: 'multiple-choice',
    layout: '',
    prompt: '',
    instruction: '',
    contextSlots: [],
    options: [],
    correctOptionIds: [],
    acceptedValues: [],
    feedback,
    meta,
    ...input,
    layout: input?.layout || inferRenderableLayout(input?.renderType || 'multiple-choice'),
    contextSlots: cloneList(input?.contextSlots),
    options: cloneList(input?.options),
    correctOptionIds: cloneList(input?.correctOptionIds),
    acceptedValues: cloneList(input?.acceptedValues),
    feedback,
    meta: {
      ...meta,
      tags: cloneList(meta.tags),
      accessibility: cloneList(meta.accessibility)
    }
  };

  assertRequiredFields('RenderableExercise', value, [
    'id',
    'sourceActivityId',
    'subjectId',
    'gradeId',
    'renderType',
    'prompt'
  ]);

  return Object.freeze(assertRenderableExercise(value));
}
