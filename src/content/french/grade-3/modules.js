import { createModule } from '../../curriculum/moduleTemplate.js';

export const frenchGrade3Modules = [
  createModule({
    id: 'french-g3-comprehension',
    subjectId: 'french',
    gradeId: 'P3',
    domainId: 'comprehension',
    domainLabel: 'Lecture et comprehension',
    title: 'Textes courts et ordre du recit',
    summary: 'Lire un texte, retrouver l information utile et comprendre l implicite.',
    goal: 'Faire de la comprehension avant l evaluation.',
    demo: 'Une demonstration montre comment relire le texte pour verifier la reponse.',
    guidedActivityIds: ['generated-french-reading', 'phrase-a-trous'],
    independentActivityIds: ['generated-french-vocabulary'],
    challengeActivityId: 'generated-french-reading',
    examActivityId: 'generated-french-reading',
    suggestedReviewIds: ['associe-image-mot']
  }),
  createModule({
    id: 'french-g3-grammar',
    subjectId: 'french',
    gradeId: 'P3',
    domainId: 'grammaire',
    domainLabel: 'Grammaire',
    title: 'Nom, verbe, determinant',
    summary: 'Identifier les mots et completer une phrase correctement.',
    goal: 'Fixer des automatismes simples avant de produire.',
    demo: 'Des exemples guident l enfant pour reperer la nature du mot.',
    guidedActivityIds: ['possessives', 'generated-french-grammar-p3'],
    independentActivityIds: ['generated-french-sentences'],
    challengeActivityId: 'phrase-a-trous',
    examActivityId: 'generated-french-grammar-p3',
    suggestedReviewIds: ['generated-french-sentences']
  }),
  createModule({
    id: 'french-g3-vocabulary',
    subjectId: 'french',
    gradeId: 'P3',
    domainId: 'vocabulaire',
    domainLabel: 'Vocabulaire et orthographe',
    title: 'Vocabulaire, intrus et phrases justes',
    summary: 'Renforcer le sens des mots et la lecture fonctionnelle.',
    goal: 'Lire, trier et choisir avec plus d autonomie.',
    demo: 'Une demonstration montre comment chercher l indice utile.',
    guidedActivityIds: ['intrus-lecture', 'generated-french-vocabulary'],
    independentActivityIds: ['generated-french-sentences'],
    challengeActivityId: 'intrus-lecture',
    examActivityId: 'generated-french-vocabulary',
    suggestedReviewIds: ['associe-image-mot']
  })
];
