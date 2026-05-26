import { defineExercise, defineExerciseOption } from '../../shared/types/exerciseModels.js';

const DIFFICULTY_MAP = Object.freeze({
  1: 'easy',
  2: 'medium',
  3: 'hard'
});

const ENGINE_TYPE_BY_EXERCISE_TYPE = Object.freeze({
  'shape-recognition': 'multiple-choice',
  'count-elements': 'multiple-choice',
  count: 'multiple-choice',
  matching: 'matching',
  comparison: 'comparison',
  'visual-logic': 'visual-logic',
  coloring: 'coloring',
  'complete-drawing': 'coloring',
  trace: 'trace',
  'grid-complete': 'grid',
  reproduce: 'grid',
  'spot-difference': 'spot-difference'
});

function normalizeDifficulty(value) {
  if (typeof value === 'string' && value) return value;
  const asNumber = Number(value);
  return DIFFICULTY_MAP[asNumber] || 'easy';
}

function normalizeRewardValue(reward) {
  if (typeof reward === 'number' && Number.isFinite(reward)) return Math.max(0, reward);
  const raw = String(reward || '').trim();
  if (!raw) return 10;
  if (raw === '⭐' || raw.toLowerCase().includes('etoile')) return 10;
  if (raw === '✨') return 12;
  if (raw === '💎') return 14;
  return 10;
}

function normalizeList(list) {
  return Array.isArray(list) ? list.map((entry) => String(entry)).filter(Boolean) : [];
}

function normalizeOptions(payload) {
  const raw = payload?.options || payload?.choices || payload?.answers || [];
  const list = Array.isArray(raw) ? raw : [];
  return list
    .map((value, index) =>
      defineExerciseOption({
        id: `option-${index + 1}`,
        value: String(value)
      })
    )
    .filter((option) => option.value.trim().length > 0);
}

function resolveCorrectOptionIds(payload, options) {
  const explicitIds = normalizeList(payload?.correctOptionIds);
  if (explicitIds.length) return explicitIds;

  const correctValue = payload?.correctValue ?? payload?.correct ?? payload?.answer ?? null;
  if (correctValue === null || correctValue === undefined) return [];

  const needle = String(correctValue);
  const match = options.find((option) => option.value === needle);
  return match ? [match.id] : [];
}

/**
 * JSON auteur (simple) -> ExerciseDefinition (runtime).
 * Conserve aussi `engineType` et `payload` pour les moteurs P3 (contrat §2.2/§3).
 */
export function normalizeRenforcementExercise(authored = {}) {
  const id = String(authored.id || '').trim();
  const type = String(authored.type || '').trim();
  const level = String(authored.level || 'P2').trim() || 'P2';
  const instruction = String(authored.instruction || '').trim();
  const prompt = instruction;
  const skills = normalizeList(authored.skills);
  const payload = authored.payload && typeof authored.payload === 'object' ? authored.payload : {};
  const options = normalizeOptions(payload);
  const correctOptionIds = resolveCorrectOptionIds(payload, options);
  const engineType = ENGINE_TYPE_BY_EXERCISE_TYPE[type] || 'multiple-choice';

  return defineExercise({
    id,
    subjectId: 'renforcement',
    gradeId: level,
    gradeBand: [level],
    type,
    engineType,
    prompt,
    instruction,
    difficulty: normalizeDifficulty(authored.difficulty),
    rewardEmoji: authored.reward || '⭐',
    rewardValue: normalizeRewardValue(authored.reward),
    skillTags: skills,
    tags: [...new Set(['renforcement', type, ...skills].filter(Boolean))],
    payload,
    options,
    correctOptionIds
  });
}

