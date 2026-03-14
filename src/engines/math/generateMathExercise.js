import { generateExercise, generateExerciseSet } from '../generators/exerciseGenerators.js';
import { resolveGeneratorDefinition } from '../content-generation/generatorCatalog.js';

function buildMathInput(input = {}) {
  const definition = resolveGeneratorDefinition({
    ...input,
    subject: 'math'
  });

  return {
    topic: definition.topic,
    grade: input.grade || definition.gradeBand[0] || 'P2',
    difficulty: input.difficulty || definition.difficulty,
    language: input.locale || input.language || 'fr'
  };
}

export function generateMathExercise(input = {}) {
  return generateExercise(buildMathInput(input));
}

export function generateMathExerciseSet(input = {}) {
  return generateExerciseSet({
    ...buildMathInput(input),
    count: input.count || 1
  });
}
