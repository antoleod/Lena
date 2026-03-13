import { generateExerciseSet } from './exerciseGenerators.js';

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
  return {
    id: `${exercise.type}-${index + 1}`,
    prompt: exercise.question,
    choices: exercise.options,
    answer: exercise.correct,
    explanation: exercise.explanation,
    type: exercise.type,
    level: exercise.level,
    context: exercise.context || []
  };
}

function buildSection(sectionConfig, activity, difficulty) {
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
    lessons: [...seedLessons, ...generatedLessons]
  };
}

export function materializeActivity(baseActivity, progressInput) {
  if (!baseActivity?.generatorConfig) {
    return baseActivity;
  }

  const progress = progressInput || fallbackProgress();
  const generatorConfig = baseActivity.generatorConfig;
  const expectedQuestions = generatorConfig.sections.reduce((sum, section) => sum + section.count, 0);
  const difficulty = normalizeDifficulty(generatorConfig.difficulty, progress, expectedQuestions);

  return {
    ...baseActivity,
    sections: generatorConfig.sections.map((section) => buildSection(section, baseActivity, difficulty)),
    generated: true,
    resolvedDifficulty: difficulty
  };
}
