import { resolveGeneratorDefinition } from '../content-generation/generatorCatalog.js';
import { generateMathExerciseSet } from '../math/generateMathExercise.js';
import { generateLanguageExerciseSet } from '../language/generateLanguageExercise.js';
import { generateLogicExerciseSet } from '../logic/generateLogicExercise.js';

const DEFAULT_PATTERNS = Object.freeze({
  1: ['challenge'],
  2: ['practice', 'challenge'],
  3: ['opener', 'practice', 'challenge'],
  4: ['opener', 'practice', 'practice', 'challenge'],
  5: ['opener', 'practice', 'practice', 'variation', 'challenge'],
  6: ['opener', 'practice', 'practice', 'variation', 'practice', 'challenge'],
  7: ['opener', 'practice', 'practice', 'variation', 'practice', 'practice', 'challenge']
});

function getPattern(count) {
  return DEFAULT_PATTERNS[count] || DEFAULT_PATTERNS[5];
}

function adjustDifficulty(baseDifficulty, slot, index) {
  if (slot === 'opener') {
    return 'easy';
  }
  if (slot === 'challenge') {
    return baseDifficulty === 'easy' ? 'medium' : 'hard';
  }
  if (slot === 'variation' && baseDifficulty === 'hard') {
    return 'medium';
  }
  if (!baseDifficulty || baseDifficulty === 'adaptive') {
    return index >= 3 ? 'medium' : 'easy';
  }
  return baseDifficulty;
}

function pickGenerator(domain) {
  if (domain === 'language') {
    return generateLanguageExerciseSet;
  }
  if (domain === 'logic') {
    return generateLogicExerciseSet;
  }
  return generateMathExerciseSet;
}

function dedupeByPrompt(exercises) {
  const seen = new Set();
  return exercises.filter((exercise) => {
    const key = `${exercise.question}::${exercise.correct}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function buildExercises(pattern, definition, input, grade, locale) {
  const generator = pickGenerator(definition.domain);
  const exercises = [];
  let attempts = 0;

  while (exercises.length < pattern.length && attempts < pattern.length * 4) {
    const slotIndex = exercises.length;
    const slot = pattern[slotIndex] || 'practice';
    const candidate = generator({
      subject: input.subject,
      skill: definition.skill,
      topic: definition.topic,
      grade,
      locale,
      difficulty: adjustDifficulty(input.difficulty || definition.difficulty, slot, slotIndex),
      count: 1
    })[0];

    if (candidate) {
      const alreadyExists = exercises.some(
        (exercise) => `${exercise.question}::${exercise.correct}` === `${candidate.question}::${candidate.correct}`
      );

      if (!alreadyExists) {
        exercises.push({
          ...candidate,
          lessonSlot: slot,
          order: slotIndex + 1
        });
      }
    }

    attempts += 1;
  }

  return exercises;
}

export function composeLesson(input = {}) {
  const exerciseCount = Math.min(Math.max(input.exerciseCount || 5, 1), 7);
  const definition = resolveGeneratorDefinition(input);
  const grade = input.grade || definition.gradeBand[0] || 'P2';
  const locale = input.locale || input.language || 'fr';
  const pattern = getPattern(exerciseCount);
  const exercises = dedupeByPrompt(buildExercises(pattern, definition, input, grade, locale)).slice(0, exerciseCount);

  return {
    id: input.lessonId || `${definition.domain}:${definition.topic}:${grade}:${exerciseCount}`,
    subject: definition.domain,
    skill: definition.skill,
    topic: definition.topic,
    title: input.title || `${definition.skill} · ${grade}`,
    locale,
    gradeBand: definition.gradeBand,
    activityType: definition.activityType,
    engineType: definition.engineType,
    skillTags: definition.skillTags,
    difficulty: input.difficulty || definition.difficulty,
    exercises,
    rewardPreview: {
      crystals: 10 + exercises.length,
      stars: exercises.length >= 5 ? 1 : 0
    },
    summary: {
      opener: exercises.find((exercise) => exercise.lessonSlot === 'opener')?.question || '',
      challenge: exercises.find((exercise) => exercise.lessonSlot === 'challenge')?.question || '',
      exerciseCount: exercises.length
    }
  };
}
