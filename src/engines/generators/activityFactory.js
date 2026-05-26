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

  // Determine child's global difficulty bias based on recent achievements
  let globalDifficultyBias = 'easy';
  try {
    const storeSnapshot = window.localStorage.getItem('lena:migration:progress:v3');
    if (storeSnapshot) {
      const store = JSON.parse(storeSnapshot);
      const activities = Object.values(store.activities || {});
      
      if (activities.length > 0) {
        // Filter activities that have been played
        const played = activities.filter(act => act.completed || act.attempts > 0);
        if (played.length > 0) {
          // Sort by last updated to analyze the 3 most recent
          played.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
          const recent = played.slice(0, 3);
          const totalRecentRatio = recent.reduce((sum, act) => {
            const actRatio = (act.bestScore || 0) / (act.totalQuestions || 10);
            return sum + actRatio;
          }, 0) / recent.length;
          
          if (totalRecentRatio >= 0.82) {
            globalDifficultyBias = 'hard';
          } else if (totalRecentRatio >= 0.58) {
            globalDifficultyBias = 'medium';
          }
        }
      }
    }
  } catch (e) {
    // Fail silently, fallback to 'easy'
  }

  // If this specific activity has never been attempted, default to global adaptive level instead of resetting to easy
  if (!progress || progress.attempts === 0) {
    return globalDifficultyBias;
  }

  const score = progress.bestScore || progress.lastScore || 0;
  const ratio = expectedQuestions > 0 ? score / expectedQuestions : 0;

  // Granular scaling rules based on current node performance
  if (ratio >= 0.85) {
    return 'hard';
  }
  if (ratio >= 0.55) {
    return 'medium';
  }

  // Preserve global bias if they do okay, otherwise fall back to easy
  return ratio >= 0.25 ? globalDifficultyBias : 'easy';
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
