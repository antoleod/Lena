import { createModule } from '../../curriculum/moduleTemplate.js';

export const frenchGrade3Modules = [
  createModule({
    id: 'french-g3-comprehension',
    subjectId: 'french',
    gradeId: 'P3',
    domainId: 'comprehension',
    domainLabel: 'Compréhension',
    title: 'Textes courts et informations utiles',
    summary: 'Lire des textes courts, retrouver une information et verifier une reponse.',
    goal: 'Passer dune lecture guidee a une lecture active.',
    demo: 'Une demonstration montre comment relire le texte pour justifier un choix.',
    guidedActivityIds: ['generated-french-reading-p3-base', 'generated-french-reading'],
    independentActivityIds: ['generated-french-vocabulary-p3'],
    challengeActivityId: 'generated-french-reading-p3-base',
    examActivityId: 'generated-french-reading',
    suggestedReviewIds: ['generated-french-reading-p2'],
    missionTitle: 'Mission comprehension P3',
    missionSummary: 'Lire un texte, retrouver un indice et verifier une interpretation simple.'
  }),
  createModule({
    id: 'french-g3-sentence-building',
    subjectId: 'french',
    gradeId: 'P3',
    domainId: 'sentence-building',
    domainLabel: 'Construction de phrase',
    title: 'Phrase correcte, ordre et structure',
    summary: 'Choisir une phrase correcte, completer une structure et travailler l ordre des mots.',
    goal: 'Construire des phrases plus solides et mieux organisees.',
    demo: 'Des exemples guident l enfant pour verifier si la phrase reste correcte.',
    guidedActivityIds: ['generated-french-sentences-p3-base', 'generated-french-word-order-p3'],
    independentActivityIds: ['phrase-a-trous'],
    challengeActivityId: 'generated-french-sentences',
    examActivityId: 'generated-french-word-order-p3',
    suggestedReviewIds: ['generated-french-sentences-p2'],
    missionTitle: 'Mission phrases P3',
    missionSummary: 'Ordonner, completer et verifier la construction d une phrase simple.'
  }),
  createModule({
    id: 'french-g3-language',
    subjectId: 'french',
    gradeId: 'P3',
    domainId: 'language',
    domainLabel: 'Langue et vocabulaire',
    title: 'Vocabulaire, types de phrase et accords simples',
    summary: 'Renforcer le sens des mots, les categories et les accords de base.',
    goal: 'Lire, trier et choisir avec plus d autonomie.',
    demo: 'Une demonstration montre comment chercher l indice utile dans la phrase.',
    guidedActivityIds: ['generated-french-vocabulary-p3', 'generated-french-grammar-p3'],
    independentActivityIds: ['intrus-lecture'],
    challengeActivityId: 'possessives',
    examActivityId: 'generated-french-grammar-p3',
    suggestedReviewIds: ['generated-french-vocabulary-p2'],
    missionTitle: 'Mission langue P3',
    missionSummary: 'Mieux comprendre les mots, les accords et les types de phrases simples.'
  })
];
