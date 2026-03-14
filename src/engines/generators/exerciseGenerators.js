import { assertGeneratedExercise } from '../activity-engine/index.js';
import { generateAdditionExercise } from './additionGenerator.js';
import { generateSubtractionExercise } from './subtractionGenerator.js';
import { generateMultiplicationExercise } from './multiplicationGenerator.js';
import { generateDivisionExercise } from './divisionGenerator.js';
import { generateComparisonExercise } from './comparisonGenerator.js';
import { generateSequenceExercise } from './sequenceGenerator.js';
import { generatePlaceValueExercise } from './placeValueGenerator.js';
import { generateTimeExercise } from './timeGenerator.js';
import { generateMoneyExercise } from './moneyGenerator.js';
import { generateGeometryExercise } from './geometryGenerator.js';
import { generateVocabularyExercise } from './vocabularyGenerator.js';
import { generateSentenceBuilderExercise } from './sentenceBuilderGenerator.js';
import { generateReadingQuestionExercise } from './readingQuestionGenerator.js';
import { generateLogicExercise } from './logicGenerator.js';

function resolveDifficulty(grade, difficulty) {
  if (difficulty && difficulty !== 'adaptive') {
    return difficulty;
  }

  if (grade === 'P2') {
    return 'easy';
  }
  if (grade === 'P3' || grade === 'P4') {
    return 'medium';
  }
  return 'hard';
}

function resolveParams(input) {
  const grade = input.grade || 'P2';
  const language = input.language || 'fr';
  const difficulty = resolveDifficulty(grade, input.difficulty);
  return { grade, language, difficulty };
}

export function generateExercise(input) {
  const params = resolveParams(input);
  let exercise;

  switch (input.topic) {
    case 'addition':
      exercise = generateAdditionExercise(params);
      break;
    case 'subtraction':
      exercise = generateSubtractionExercise(params);
      break;
    case 'multiplication':
      exercise = generateMultiplicationExercise(params);
      break;
    case 'division':
      exercise = generateDivisionExercise(params);
      break;
    case 'comparison':
      exercise = generateComparisonExercise(params);
      break;
    case 'logic-sequence':
      exercise = generateSequenceExercise(params);
      break;
    case 'place-value':
      exercise = generatePlaceValueExercise(params);
      break;
    case 'time':
      exercise = generateTimeExercise(params);
      break;
    case 'money':
      exercise = generateMoneyExercise(params);
      break;
    case 'geometry':
      exercise = generateGeometryExercise(params);
      break;
    case 'reading-comprehension':
      exercise = generateReadingQuestionExercise(params);
      break;
    case 'sentence-completion':
      exercise = generateSentenceBuilderExercise(params);
      break;
    case 'vocabulary':
      exercise = generateVocabularyExercise(params);
      break;
    case 'logic':
      exercise = generateLogicExercise(params);
      break;
    default:
      exercise = generateAdditionExercise(params);
      break;
  }

  return assertGeneratedExercise(exercise);
}

export function generateExerciseSet(input) {
  const count = input.count || 1;
  return Array.from({ length: count }, () => generateExercise(input));
}
