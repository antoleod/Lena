// i18n labels for the static exam library (categories + difficulty levels).
// Language-neutral categories have translations; French-specific ones stay in FR.

export const CATEGORY_LABELS = {
  'calcul-mental': {
    fr: 'Calcul mental', nl: 'Hoofdrekenen', en: 'Mental maths', es: 'Cálculo mental',
    emoji: '🔢',
  },
  'problemes-mathematiques': {
    fr: 'Problèmes mathématiques', nl: 'Rekenproblemen', en: 'Maths problems', es: 'Problemas matemáticos',
    emoji: '🧮',
  },
  'mesures': {
    fr: 'Mesures', nl: 'Meten', en: 'Measurements', es: 'Medidas',
    emoji: '📏',
  },
  'geometrie': {
    fr: 'Géométrie', nl: 'Meetkunde', en: 'Geometry', es: 'Geometría',
    emoji: '📐',
  },
  'logique': {
    fr: 'Logique', nl: 'Logica', en: 'Logic', es: 'Lógica',
    emoji: '🧩',
  },
  'calendrier-temps': {
    fr: 'Calendrier & temps', nl: 'Kalender & tijd', en: 'Calendar & time', es: 'Calendario y tiempo',
    emoji: '📅',
  },
  'decouverte-monde': {
    fr: 'Découverte du monde', nl: 'Wereldoriëntatie', en: 'World discovery', es: 'Descubrimiento del mundo',
    emoji: '🌍',
  },
  // French-specific — intentionally stay in French
  'comprehension-lecture': {
    fr: 'Compréhension lecture', nl: 'Compréhension lecture', en: 'Compréhension lecture', es: 'Compréhension lecture',
    emoji: '📖',
  },
  'vocabulaire': {
    fr: 'Vocabulaire', nl: 'Vocabulaire', en: 'Vocabulaire', es: 'Vocabulaire',
    emoji: '💬',
  },
  'orthographe': {
    fr: 'Orthographe', nl: 'Orthographe', en: 'Orthographe', es: 'Orthographe',
    emoji: '✏️',
  },
  'dictee': {
    fr: 'Dictée', nl: 'Dictée', en: 'Dictée', es: 'Dictée',
    emoji: '🎧',
  },
  'grammaire': {
    fr: 'Grammaire', nl: 'Grammaire', en: 'Grammaire', es: 'Grammaire',
    emoji: '📝',
  },
  'conjugaison': {
    fr: 'Conjugaison', nl: 'Conjugaison', en: 'Conjugaison', es: 'Conjugaison',
    emoji: '🔤',
  },
};

export const DIFFICULTY_LABELS = {
  facile:    { fr: 'Facile',    nl: 'Makkelijk', en: 'Easy',   es: 'Fácil',   emoji: '🟢' },
  moyen:     { fr: 'Moyen',     nl: 'Gemiddeld', en: 'Medium', es: 'Medio',   emoji: '🟠' },
  difficile: { fr: 'Difficile', nl: 'Moeilijk',  en: 'Hard',   es: 'Difícil', emoji: '🔴' },
};

export const EXAM_UI = {
  fr: {
    libraryTitle: "Bibliothèque d'examens",
    librarySubtitle: 'Examens par matière',
    libraryHint: 'Choisis une matière, puis un examen et un niveau.',
    categoryHint: 'Choisis un examen, puis un niveau.',
    exams: (n) => `${n} examen${n > 1 ? 's' : ''}`,
    levels: (n) => `${n} niveaux`,
    notFound: 'Matière introuvable',
    next: 'Suivant →',
    seeResult: 'Voir le résultat',
    correct: '✅ Bonne réponse !',
    wrong: '❌ Pas tout à fait…',
    correctAnswer: 'Bonne réponse :',
    vrai: 'Vrai', faux: 'Faux',
    placeholder: 'Ta réponse…',
    speechLang: 'fr-FR',
    passed: 'Réussi !',
    keepPractising: "Continue à t'entraîner !",
    score: (s, t) => `${s} / ${t}`,
    notFound2: 'Examen introuvable.',
    back: '← Retour',
    configTitle: "Personnaliser l'examen",
    questionsCount: 'Nombre de questions',
    allQuestions: 'Toutes',
    duree: 'Durée',
    illimitee: 'Illimitée',
    start: 'Commencer →',
    tempsRestant: 'Temps restant',
  },
  nl: {
    libraryTitle: 'Examenbibliotheek',
    librarySubtitle: 'Examens per vak',
    libraryHint: 'Kies een vak, dan een examen en een niveau.',
    categoryHint: 'Kies een examen en dan een niveau.',
    exams: (n) => `${n} examen${n > 1 ? 's' : ''}`,
    levels: (n) => `${n} niveaus`,
    notFound: 'Vak niet gevonden',
    next: 'Volgende →',
    seeResult: 'Bekijk resultaat',
    correct: '✅ Goed gedaan!',
    wrong: '❌ Bijna…',
    correctAnswer: 'Juist antwoord:',
    vrai: 'Waar', faux: 'Niet waar',
    placeholder: 'Jouw antwoord…',
    speechLang: 'nl-NL',
    passed: 'Geslaagd!',
    keepPractising: 'Blijf oefenen!',
    score: (s, t) => `${s} / ${t}`,
    notFound2: 'Examen niet gevonden.',
    back: '← Terug',
    configTitle: 'Examen aanpassen',
    questionsCount: 'Aantal vragen',
    allQuestions: 'Alle',
    duree: 'Duur',
    illimitee: 'Onbeperkt',
    start: 'Starten →',
    tempsRestant: 'Resterende tijd',
  },
  en: {
    libraryTitle: 'Exam library',
    librarySubtitle: 'Exams by subject',
    libraryHint: 'Choose a subject, then an exam and a level.',
    categoryHint: 'Choose an exam, then a level.',
    exams: (n) => `${n} exam${n > 1 ? 's' : ''}`,
    levels: (n) => `${n} levels`,
    notFound: 'Subject not found',
    next: 'Next →',
    seeResult: 'See result',
    correct: '✅ Correct!',
    wrong: '❌ Not quite…',
    correctAnswer: 'Correct answer:',
    vrai: 'True', faux: 'False',
    placeholder: 'Your answer…',
    speechLang: 'en-US',
    passed: 'Well done!',
    keepPractising: 'Keep practising!',
    score: (s, t) => `${s} / ${t}`,
    notFound2: 'Exam not found.',
    back: '← Back',
    configTitle: 'Customise exam',
    questionsCount: 'Number of questions',
    allQuestions: 'All',
    duree: 'Duration',
    illimitee: 'Unlimited',
    start: 'Start →',
    tempsRestant: 'Time left',
  },
  es: {
    libraryTitle: 'Biblioteca de exámenes',
    librarySubtitle: 'Exámenes por materia',
    libraryHint: 'Elige una materia, luego un examen y un nivel.',
    categoryHint: 'Elige un examen y luego un nivel.',
    exams: (n) => `${n} examen${n > 1 ? 'es' : ''}`,
    levels: (n) => `${n} niveles`,
    notFound: 'Materia no encontrada',
    next: 'Siguiente →',
    seeResult: 'Ver resultado',
    correct: '✅ ¡Correcto!',
    wrong: '❌ Casi…',
    correctAnswer: 'Respuesta correcta:',
    vrai: 'Verdadero', faux: 'Falso',
    placeholder: 'Tu respuesta…',
    speechLang: 'es-ES',
    passed: '¡Aprobado!',
    keepPractising: '¡Sigue practicando!',
    score: (s, t) => `${s} / ${t}`,
    notFound2: 'Examen no encontrado.',
    back: '← Volver',
    configTitle: 'Personalizar examen',
    questionsCount: 'Número de preguntas',
    allQuestions: 'Todas',
    duree: 'Duración',
    illimitee: 'Ilimitada',
    start: 'Empezar →',
    tempsRestant: 'Tiempo restante',
  },
};

/** Read a locale-specific field from a question object, falling back to the base field. */
export function getLocalizedField(question, field, locale = 'fr') {
  if (!question) return '';
  if (locale !== 'fr' && question[`${field}_${locale}`]) return question[`${field}_${locale}`];
  return question[field] ?? '';
}

export function getCategoryLabel(categoryId, locale = 'fr') {
  const entry = CATEGORY_LABELS[categoryId];
  if (!entry) return categoryId;
  return entry[locale] || entry.fr;
}

export function getCategoryEmoji(categoryId) {
  return CATEGORY_LABELS[categoryId]?.emoji || '📚';
}

export function getDifficultyLevels(locale = 'fr') {
  return Object.entries(DIFFICULTY_LABELS).map(([key, labels]) => ({
    key,
    label: labels[locale] || labels.fr,
    emoji: labels.emoji,
  }));
}

export function getExamUi(locale = 'fr') {
  return EXAM_UI[locale] || EXAM_UI.fr;
}
