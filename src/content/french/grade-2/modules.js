import { createModule } from '../../curriculum/moduleTemplate.js';

export const frenchGrade2Modules = [
  createModule({
    id: 'french-g2-reading',
    subjectId: 'french',
    gradeId: 'P2',
    domainId: 'lecture',
    domainLabel: 'Lecture',
    title: 'Mots frequents et phrases courtes',
    summary: 'Lire des mots frequents, associer et completer une phrase.',
    goal: 'Comprendre d abord, repondre ensuite.',
    demo: 'Un modele montre comment lire la phrase entiere avant de choisir.',
    guidedActivityIds: ['associe-image-mot', 'phrase-a-trous'],
    independentActivityIds: ['generated-french-sentences'],
    challengeActivityId: 'intrus-lecture',
    examActivityId: 'generated-french-reading',
    suggestedReviewIds: ['associe-image-mot']
  }),
  createModule({
    id: 'french-g2-sounds',
    subjectId: 'french',
    gradeId: 'P2',
    domainId: 'sons',
    domainLabel: 'Sons et vocabulaire',
    title: 'Sons, vocabulaire et ponctuation',
    summary: 'Travailler le sens, les categories et les phrases correctes.',
    goal: 'Installer les bases de lecture et d orthographe.',
    demo: 'Une demonstration montre les indices visuels dans la phrase.',
    guidedActivityIds: ['intrus-lecture', 'generated-french-sentences'],
    independentActivityIds: ['generated-french-reading'],
    challengeActivityId: 'phrase-a-trous',
    examActivityId: 'intrus-lecture',
    suggestedReviewIds: ['phrase-a-trous']
  })
];
