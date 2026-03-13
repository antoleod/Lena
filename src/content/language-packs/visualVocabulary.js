const VISUAL_VOCABULARY = {
  apple: {
    asset: '/assets/learning/apple.svg',
    labels: { fr: 'pomme', nl: 'appel', en: 'apple', es: 'manzana' }
  },
  book: {
    asset: '/assets/learning/book.svg',
    labels: { fr: 'livre', nl: 'boek', en: 'book', es: 'libro' }
  },
  cat: {
    asset: '/assets/learning/cat.svg',
    labels: { fr: 'chat', nl: 'kat', en: 'cat', es: 'gato' }
  },
  house: {
    asset: '/assets/learning/house.svg',
    labels: { fr: 'maison', nl: 'huis', en: 'house', es: 'casa' }
  },
  school: {
    asset: '/assets/learning/school.svg',
    labels: { fr: 'ecole', nl: 'school', en: 'school', es: 'escuela' }
  },
  water: {
    asset: '/assets/learning/water.svg',
    labels: { fr: 'eau', nl: 'water', en: 'water', es: 'agua' }
  }
};

export function getVisualVocabularyItem(conceptId) {
  return VISUAL_VOCABULARY[conceptId] || null;
}

export function createVisualWordChoice(conceptId, locale) {
  const item = getVisualVocabularyItem(conceptId);
  if (!item) {
    throw new Error(`Unknown visual vocabulary concept "${conceptId}".`);
  }

  const label = item.labels[locale] || item.labels.fr;
  return {
    value: label,
    label,
    media: {
      src: item.asset,
      alt: label
    }
  };
}

export function createVisualWordQuestion({ locale, prompt, answerConceptId, distractorConceptIds, explanation }) {
  return {
    prompt,
    choices: [answerConceptId, ...distractorConceptIds].map((conceptId) => createVisualWordChoice(conceptId, locale)),
    answer: createVisualWordChoice(answerConceptId, locale).value,
    explanation
  };
}

