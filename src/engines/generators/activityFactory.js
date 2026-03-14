import { assertGeneratedExercise } from '../activity-engine/index.js';
import { describeActivity, describeLesson } from '../activity-engine/activityDescriptor.js';
import { composeLesson } from '../learning/lessonComposer.js';

function fallbackProgress() {
  return {
    attempts: 0,
    completed: false,
    bestScore: 0,
    lastScore: 0
  };
}

function normalizeDifficulty(difficulty, progress, expectedQuestions) {
  if (difficulty && difficulty !== 'adaptive') {
    return difficulty;
  }

  if (!progress || progress.attempts === 0) {
    return 'easy';
  }

  const score = progress.bestScore || progress.lastScore || 0;
  const ratio = expectedQuestions > 0 ? score / expectedQuestions : 0;

  if (ratio >= 0.85) {
    return 'hard';
  }

  if (ratio >= 0.5) {
    return 'medium';
  }

  return 'easy';
}

function normalizeSectionCounts(sections = [], targetCount = 10) {
  const safeTarget = Math.max(1, targetCount || 10);
  const sourceCounts = sections.map((section) => Math.max(section.count || 0, (section.seedLessons || []).length || 0));
  const totalSource = sourceCounts.reduce((sum, count) => sum + count, 0);

  if (!totalSource || totalSource === safeTarget) {
    return sourceCounts;
  }

  const scaled = sourceCounts.map((count, index) => {
    const seedFloor = (sections[index].seedLessons || []).length;
    const proportional = Math.round((count / totalSource) * safeTarget);
    return Math.max(seedFloor, proportional);
  });

  let totalScaled = scaled.reduce((sum, count) => sum + count, 0);

  while (totalScaled > safeTarget) {
    const index = scaled.findIndex((count, position) => count > ((sections[position].seedLessons || []).length || 0));
    if (index === -1) {
      break;
    }
    scaled[index] -= 1;
    totalScaled -= 1;
  }

  while (totalScaled < safeTarget) {
    const index = scaled.findIndex(() => true);
    if (index === -1) {
      break;
    }
    scaled[index] += 1;
    totalScaled += 1;
  }

  return scaled;
}

function mapGeneratedExerciseToLesson(exercise, index) {
  assertGeneratedExercise(exercise);
  return {
    id: `${exercise.type}-${index + 1}`,
    prompt: exercise.question,
    choices: exercise.options,
    answer: exercise.correct,
    explanation: exercise.explanation,
    type: exercise.type,
    renderType: exercise.renderType || exercise.type,
    engineType: exercise.engineType || 'multiple-choice',
    level: exercise.level,
    context: exercise.context || []
  };
}

function buildSection(sectionConfig, activity, difficulty) {
  const activityDescriptor = describeActivity(activity);
  const seedLessons = sectionConfig.seedLessons || [];
  const targetCount = sectionConfig.count || seedLessons.length;
  const missingCount = Math.max(0, targetCount - seedLessons.length);
  const composedLesson = missingCount > 0
    ? composeLesson({
        subject: activity.subject,
        skill: activity.subskill,
        skillTags: activity.skillTags,
        topic: sectionConfig.topic || activity.generatorConfig.topic,
        grade: sectionConfig.grade || activity.generatorConfig.grade,
        locale: sectionConfig.language || activity.generatorConfig.language || activity.language || 'fr',
        difficulty,
        exerciseCount: missingCount,
        lessonId: `${activity.id}:${sectionConfig.id}`
      })
    : null;
  const generatedLessons = (composedLesson?.exercises || []).map(mapGeneratedExerciseToLesson);

  return {
    id: sectionConfig.id,
    title: sectionConfig.title,
    kind: sectionConfig.kind,
    description: sectionConfig.description,
    lessons: [...seedLessons, ...generatedLessons].map((lesson) => describeLesson(lesson, activityDescriptor, sectionConfig))
  };
}

export function materializeActivity(baseActivity, progressInput) {
  const activityDescriptor = describeActivity(baseActivity);
  if (!baseActivity?.generatorConfig) {
    return {
      ...activityDescriptor,
      sections: (baseActivity.sections || []).map((section) => ({
        ...section,
        lessons: (section.lessons || []).map((lesson) => describeLesson(lesson, activityDescriptor, section))
      }))
    };
  }

  const progress = progressInput || fallbackProgress();
  const generatorConfig = baseActivity.generatorConfig;
  const sectionPlan = generatorConfig.sections || [];
  const targetQuestionCount = generatorConfig.targetQuestionCount || 10;
  const normalizedCounts = normalizeSectionCounts(sectionPlan, targetQuestionCount);
  const normalizedSections = sectionPlan.map((section, index) => ({
    ...section,
    count: normalizedCounts[index]
  }));
  const expectedQuestions = normalizedSections.reduce((sum, section) => sum + section.count, 0);
  const difficulty = normalizeDifficulty(generatorConfig.difficulty, progress, expectedQuestions);

  return {
    ...activityDescriptor,
    sections: normalizedSections.map((section) => buildSection(section, activityDescriptor, difficulty)),
    generated: true,
    resolvedDifficulty: difficulty
  };
}
