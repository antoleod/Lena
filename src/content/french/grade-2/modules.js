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
    independentActivityIds: ['generated-french-reading'],
    challengeActivityId: 'intrus-lecture',
    examActivityId: 'generated-french-reading',
    suggestedReviewIds: ['associe-image-mot']
  }),
  createModule({
    id: 'french-g2-vocabulary',
    subjectId: 'french',
    gradeId: 'P2',
    domainId: 'vocabulaire',
    domainLabel: 'Vocabulaire',
    title: 'Image, mot et categorie',
    summary: 'Associer une image, comprendre un mot et repeter une categorie simple.',
    goal: 'Installer des reperes visuels et de lecture.',
    demo: 'Une demonstration montre comment relier image et mot.',
    guidedActivityIds: ['associe-image-mot', 'generated-french-vocabulary'],
    independentActivityIds: ['intrus-lecture'],
    challengeActivityId: 'generated-french-vocabulary',
    examActivityId: 'associe-image-mot',
    suggestedReviewIds: ['associe-image-mot']
  }),
  createModule({
    id: 'french-g2-sounds',
    subjectId: 'french',
    gradeId: 'P2',
    domainId: 'sons',
    domainLabel: 'Sons et phrases',
    title: 'Sons, vocabulaire et ponctuation',
    summary: 'Travailler le sens, les categories et les phrases correctes.',
    goal: 'Installer les bases de lecture et d orthographe.',
    demo: 'Une demonstration montre les indices visuels dans la phrase.',
    guidedActivityIds: ['intrus-lecture', 'generated-french-sentences'],
    independentActivityIds: ['phrase-a-trous'],
    challengeActivityId: 'phrase-a-trous',
    examActivityId: 'generated-french-sentences',
    suggestedReviewIds: ['generated-french-vocabulary']
  })
];
