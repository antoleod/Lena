import { defineActivity } from '../../shared/types/index.js';

const ACTIVITY_TYPE_BY_ENGINE = Object.freeze({
  'multiple-choice': 'multiple-choice',
  'base-ten': 'builder',
  story: 'story',
  ordering: 'ordering',
  matching: 'matching',
  fill: 'fill-sentence',
  'drag-drop': 'drag-drop',
  'visual-logic': 'visual-logic'
});

const ENGINE_BY_CORRECTION = Object.freeze({
  'multiple-choice': 'multiple-choice',
  'single-choice': 'multiple-choice',
  'story-quiz': 'story',
  'exact-match': 'fill',
  ordering: 'ordering',
  matching: 'matching',
  'drag-drop': 'drag-drop',
  comparison: 'multiple-choice',
  sequence: 'ordering'
});

function unique(list) {
  return [...new Set((list || []).filter(Boolean))];
}

export function inferEngineType(activity) {
  if (activity?.engineType && ACTIVITY_TYPE_BY_ENGINE[activity.engineType]) {
    return activity.engineType;
  }

  const correctionType = activity?.correctionType || '';
  if (ENGINE_BY_CORRECTION[correctionType]) {
    return ENGINE_BY_CORRECTION[correctionType];
  }
  if (correctionType.includes('fill')) return 'fill';
  if (correctionType.includes('match')) return 'matching';
  if (correctionType.includes('order') || correctionType.includes('sequence')) return 'ordering';
  if (correctionType.includes('drag')) return 'drag-drop';
  return 'multiple-choice';
}

export function inferActivityType(activity, engineType = inferEngineType(activity)) {
  if (activity?.activityType) {
    return activity.activityType;
  }
  return ACTIVITY_TYPE_BY_ENGINE[engineType] || 'multiple-choice';
}

export function inferSkillTags(activity) {
  return unique([
    ...(activity?.skillTags || []),
    activity?.subskill,
    ...(activity?.tags || [])
  ]);
}

export function describeActivity(activity) {
  const engineType = inferEngineType(activity);
  const activityType = inferActivityType(activity, engineType);
  const skillTags = inferSkillTags(activity);
  const gradeBand = unique(activity?.gradeBand || []);

  return defineActivity({
    ...activity,
    engineType,
    activityType,
    skillTags,
    gradeBand,
    runtime: {
      engineType,
      activityType,
      skillTags,
      difficulty: activity?.resolvedDifficulty || activity?.difficulty || 'easy',
      gradeBand,
      usesGenerator: Boolean(activity?.generatorConfig)
    }
  });
}

export function describeLesson(lesson, activityDescriptor, section) {
  return {
    ...lesson,
    renderType: lesson.renderType || inferActivityType(activityDescriptor),
    engineType: lesson.engineType || inferEngineType(activityDescriptor),
    skillTags: unique([...(lesson.skillTags || []), ...(activityDescriptor.skillTags || [])]),
    gradeBand: lesson.gradeBand || activityDescriptor.gradeBand,
    difficulty: lesson.difficulty || activityDescriptor.runtime?.difficulty || activityDescriptor.difficulty,
    sectionKind: section?.kind || lesson.sectionKind || 'practice'
  };
}
