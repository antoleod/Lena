const SUBJECT_ALIASES = Object.freeze({
  mathematics: 'math',
  math: 'math',
  french: 'language',
  language: 'language',
  english: 'language',
  spanish: 'language',
  reading: 'language',
  vocabulary: 'language',
  reasoning: 'logic',
  logic: 'logic'
});

const TOPIC_DEFINITIONS = Object.freeze({
  addition: {
    domain: 'math',
    activityType: 'multiple-choice',
    engineType: 'multiple-choice',
    skillTags: ['addition', 'mental-math']
  },
  subtraction: {
    domain: 'math',
    activityType: 'multiple-choice',
    engineType: 'multiple-choice',
    skillTags: ['subtraction', 'mental-math']
  },
  multiplication: {
    domain: 'math',
    activityType: 'multiple-choice',
    engineType: 'multiple-choice',
    skillTags: ['multiplication', 'groups']
  },
  division: {
    domain: 'math',
    activityType: 'multiple-choice',
    engineType: 'multiple-choice',
    skillTags: ['division', 'sharing']
  },
  comparison: {
    domain: 'math',
    activityType: 'multiple-choice',
    engineType: 'multiple-choice',
    skillTags: ['comparison', 'numbers']
  },
  'mixed-operations': {
    domain: 'math',
    activityType: 'multiple-choice',
    engineType: 'multiple-choice',
    skillTags: ['mixed-operations', 'mental-math']
  },
  'word-problem': {
    domain: 'math',
    activityType: 'multiple-choice',
    engineType: 'multiple-choice',
    skillTags: ['word-problem', 'reasoning']
  },
  'logic-sequence': {
    domain: 'logic',
    activityType: 'ordering',
    engineType: 'ordering',
    skillTags: ['sequence', 'patterns']
  },
  vocabulary: {
    domain: 'language',
    activityType: 'matching',
    engineType: 'matching',
    skillTags: ['vocabulary', 'word-picture']
  },
  'sentence-completion': {
    domain: 'language',
    activityType: 'fill-sentence',
    engineType: 'fill',
    skillTags: ['sentence', 'completion']
  },
  'reading-comprehension': {
    domain: 'language',
    activityType: 'story',
    engineType: 'story',
    skillTags: ['reading', 'comprehension']
  },
  fractions: {
    domain: 'math',
    activityType: 'multiple-choice',
    engineType: 'multiple-choice',
    skillTags: ['fractions']
  },
  decimals: {
    domain: 'math',
    activityType: 'multiple-choice',
    engineType: 'multiple-choice',
    skillTags: ['decimals']
  }
});

const SKILL_TO_TOPIC = Object.freeze({
  counting: 'comparison',
  numbers: 'comparison',
  'number-recognition': 'comparison',
  addition: 'addition',
  subtraction: 'subtraction',
  multiplication: 'multiplication',
  division: 'division',
  'mental-math': 'mixed-operations',
  'word-problems': 'word-problem',
  'word-problem': 'word-problem',
  sequence: 'logic-sequence',
  sequences: 'logic-sequence',
  patterns: 'logic-sequence',
  classification: 'logic-sequence',
  vocabulary: 'vocabulary',
  reading: 'reading-comprehension',
  comprehension: 'reading-comprehension',
  sentences: 'sentence-completion',
  'sentence-building': 'sentence-completion',
  'fill-in': 'sentence-completion'
});

function normalizeKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
}

function normalizeGradeBand(gradeBand, grade) {
  if (Array.isArray(gradeBand) && gradeBand.length) {
    return gradeBand;
  }
  if (grade) {
    return [grade];
  }
  return ['P2'];
}

export function resolveGeneratorDefinition(input = {}) {
  const subjectKey = SUBJECT_ALIASES[normalizeKey(input.subject)] || normalizeKey(input.subject) || 'math';
  const skillKey = normalizeKey(input.skill || input.subskill);
  const topicKey = normalizeKey(input.topic) || SKILL_TO_TOPIC[skillKey] || 'addition';
  const definition = TOPIC_DEFINITIONS[topicKey] || TOPIC_DEFINITIONS.addition;

  return {
    domain: definition.domain || subjectKey,
    topic: topicKey,
    skill: input.skill || skillKey || topicKey,
    activityType: input.activityType || definition.activityType,
    engineType: input.engineType || definition.engineType,
    skillTags: [...new Set([...(input.skillTags || []), ...definition.skillTags, skillKey].filter(Boolean))],
    difficulty: input.difficulty || 'adaptive',
    gradeBand: normalizeGradeBand(input.gradeBand, input.grade)
  };
}

export function getGeneratorCatalog() {
  return {
    subjects: SUBJECT_ALIASES,
    topics: TOPIC_DEFINITIONS,
    skills: SKILL_TO_TOPIC
  };
}
