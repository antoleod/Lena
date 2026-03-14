import { generateExercise, generateExerciseSet } from '../generators/exerciseGenerators.js';
import { resolveGeneratorDefinition } from '../content-generation/generatorCatalog.js';

function buildLanguageInput(input = {}) {
  const definition = resolveGeneratorDefinition({
    ...input,
    subject: input.subject || 'language'
  });

  return {
    topic: definition.topic,
    grade: input.grade || definition.gradeBand[0] || 'P2',
    difficulty: input.difficulty || definition.difficulty,
    language: input.locale || input.language || 'fr'
  };
}

export function generateLanguageExercise(input = {}) {
  return generateExercise(buildLanguageInput(input));
}

export function generateLanguageExerciseSet(input = {}) {
  return generateExerciseSet({
    ...buildLanguageInput(input),
    count: input.count || 1
  });
}
