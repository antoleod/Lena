function hasDuplicateValues(list) {
  return new Set(list).size !== list.length;
}

export function validateRenderableExercise(exercise) {
  const issues = [];
  const optionIds = (exercise.options || []).map((option) => option.id);
  const correctIds = exercise.correctOptionIds || [];
  const renderType = exercise.renderType || 'multiple-choice';

  if (!exercise.id) issues.push('missing-id');
  if (!exercise.sourceActivityId) issues.push('missing-source-activity-id');
  if (!exercise.subjectId) issues.push('missing-subject-id');
  if (!exercise.gradeId) issues.push('missing-grade-id');
  if (!exercise.prompt) issues.push('missing-prompt');
  if (hasDuplicateValues(optionIds)) issues.push('duplicate-option-ids');

  if (renderType === 'multiple-choice' || renderType === 'single-choice' || renderType === 'story') {
    if ((exercise.options || []).length < 2) issues.push('not-enough-options');
    if (!correctIds.length) issues.push('missing-correct-option');
    if (correctIds.some((id) => !optionIds.includes(id))) issues.push('unknown-correct-option-id');
  }

  if (renderType === 'fill-number' || renderType === 'fill-word' || renderType === 'fill-sentence') {
    const hasAcceptedValues = (exercise.acceptedValues || []).length > 0;
    const hasCorrectOptionIds = correctIds.length > 0;
    if (!hasAcceptedValues && !hasCorrectOptionIds) {
      issues.push('missing-expected-answer');
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

export function assertRenderableExercise(exercise) {
  const result = validateRenderableExercise(exercise);
  if (!result.valid) {
    throw new Error(`RenderableExercise validation failed: ${result.issues.join(', ')}`);
  }
  return exercise;
}

export function validateGeneratedExercise(exercise) {
  const issues = [];
  const options = exercise.options || [];

  if (!exercise.question) issues.push('missing-question');
  if (!exercise.type) issues.push('missing-type');
  if (!exercise.level) issues.push('missing-level');
  if (options.length < 2) issues.push('not-enough-options');
  if (!options.some((option) => String(option) === String(exercise.correct))) {
    issues.push('correct-answer-not-in-options');
  }
  if (hasDuplicateValues(options.map((option) => String(option)))) {
    issues.push('duplicate-options');
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

export function assertGeneratedExercise(exercise) {
  const result = validateGeneratedExercise(exercise);
  if (!result.valid) {
    throw new Error(`GeneratedExercise validation failed: ${result.issues.join(', ')}`);
  }
  return exercise;
}

