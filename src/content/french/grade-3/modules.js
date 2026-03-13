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
    guidedActivityIds: ['generated-french-reading', 'magic-library'],
    independentActivityIds: ['phrase-a-trous'],
    challengeActivityId: 'magic-library',
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
    demo: 'Des exemples guident l enfant pour repere la nature du mot.',
    guidedActivityIds: ['possessives', 'generated-french-sentences'],
    independentActivityIds: ['intrus-lecture'],
    challengeActivityId: 'phrase-a-trous',
    examActivityId: 'possessives',
    suggestedReviewIds: ['generated-french-sentences']
  })
];
