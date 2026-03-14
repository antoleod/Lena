import { generateExercise, generateExerciseSet } from '../generators/exerciseGenerators.js';
import { resolveGeneratorDefinition } from '../content-generation/generatorCatalog.js';

function buildLogicInput(input = {}) {
  const definition = resolveGeneratorDefinition({
    ...input,
    subject: 'logic'
  });

  return {
    topic: definition.topic,
    grade: input.grade || definition.gradeBand[0] || 'P2',
    difficulty: input.difficulty || definition.difficulty,
    language: input.locale || input.language || 'fr'
  };
}

export function generateLogicExercise(input = {}) {
  return generateExercise(buildLogicInput(input));
}

export function generateLogicExerciseSet(input = {}) {
  return generateExerciseSet({
    ...buildLogicInput(input),
    count: input.count || 1
  });
}
