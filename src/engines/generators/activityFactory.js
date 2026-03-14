import { generateExerciseSet } from './exerciseGenerators.js';
import { assertGeneratedExercise } from '../activity-engine/index.js';
import { describeActivity, describeLesson } from '../activity-engine/activityDescriptor.js';

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
  const generatedLessons = generateExerciseSet({
    grade: sectionConfig.grade || activity.generatorConfig.grade,
    topic: sectionConfig.topic || activity.generatorConfig.topic,
    language: sectionConfig.language || activity.generatorConfig.language || activity.language || 'fr',
    difficulty,
    count: missingCount
  }).map(mapGeneratedExerciseToLesson);

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
  const expectedQuestions = generatorConfig.sections.reduce((sum, section) => sum + section.count, 0);
  const difficulty = normalizeDifficulty(generatorConfig.difficulty, progress, expectedQuestions);

  return {
    ...activityDescriptor,
    sections: generatorConfig.sections.map((section) => buildSection(section, activityDescriptor, difficulty)),
    generated: true,
    resolvedDifficulty: difficulty
  };
}
