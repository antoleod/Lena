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
import { generateMeasurementExercise } from './measurementGenerator.js';
import { generateVocabularyExercise } from './vocabularyGenerator.js';
import { generateSentenceBuilderExercise } from './sentenceBuilderGenerator.js';
import { generateReadingQuestionExercise } from './readingQuestionGenerator.js';
import { generateLogicExercise } from './logicGenerator.js';
import { generateWordProblemExercise } from './wordProblemGenerator.js';
import { generateFractionsExercise } from './fractionsGenerator.js';
import { generateDecimalsExercise } from './decimalsGenerator.js';
import { generateMixedOperationsExercise } from './mixedOperationsGenerator.js';

function resolveDifficulty(grade, difficulty) {
  if (difficulty && difficulty !== 'adaptive') {
    return difficulty;
  }

  // Calculate dynamic adaptive difficulty from global profile achievements
  try {
    const raw = window.localStorage.getItem('lena:migration:progress:v3');
    if (raw) {
      const store = JSON.parse(raw);
      const activities = Object.values(store.activities || {});
      if (activities.length > 0) {
        const played = activities.filter(act => act.completed || act.attempts > 0);
        if (played.length > 0) {
          played.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
          const recent = played.slice(0, 3);
          const avgRatio = recent.reduce((sum, act) => {
            const actRatio = (act.bestScore || 0) / (act.totalQuestions || 10);
            return sum + actRatio;
          }, 0) / recent.length;
          
          if (avgRatio >= 0.82) return 'hard';
          if (avgRatio >= 0.58) return 'medium';
          return 'easy';
        }
      }
    }
  } catch (e) {
    // Fall back to grade-based logic on storage failures
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
    case 'measurement':
      exercise = generateMeasurementExercise(params);
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
    case 'word-problems':
      exercise = generateWordProblemExercise(params);
      break;
    case 'fractions':
      exercise = generateFractionsExercise(params);
      break;
    case 'decimals':
      exercise = generateDecimalsExercise(params);
      break;
    case 'mixed-operations':
      exercise = generateMixedOperationsExercise(params);
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
