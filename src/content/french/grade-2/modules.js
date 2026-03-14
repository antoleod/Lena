import { createModule } from '../../curriculum/moduleTemplate.js';

export const frenchGrade2Modules = [
  createModule({
    id: 'french-g2-vocabulary',
    subjectId: 'french',
    gradeId: 'P2',
    domainId: 'vocabulary',
    domainLabel: 'Vocabulaire',
    title: 'Mot, image et categorie',
    summary: 'Associer des mots frequents, des images et des categories simples.',
    goal: 'Installer des reperes visuels et lexicaux stables.',
    demo: 'Une demonstration montre comment relier image, mot et categorie.',
    guidedActivityIds: ['associe-image-mot', 'generated-french-vocabulary-p2'],
    independentActivityIds: ['generated-french-vocabulary'],
    challengeActivityId: 'intrus-lecture',
    examActivityId: 'associe-image-mot',
    suggestedReviewIds: ['associe-image-mot'],
    missionTitle: 'Mission vocabulaire P2',
    missionSummary: 'Nommer, associer et classer des mots tres frequents.'
  }),
  createModule({
    id: 'french-g2-sentences',
    subjectId: 'french',
    gradeId: 'P2',
    domainId: 'sentences',
    domainLabel: 'Phrases simples',
    title: 'Construire et completer une phrase',
    summary: 'Lire des phrases tres courtes et choisir le mot qui convient.',
    goal: 'Comprendre d abord, completer ensuite.',
    demo: 'Un modele montre comment lire la phrase entiere avant de choisir.',
    guidedActivityIds: ['phrase-a-trous', 'generated-french-sentences-p2'],
    independentActivityIds: ['generated-french-sentences'],
    challengeActivityId: 'phrase-a-trous',
    examActivityId: 'generated-french-sentences-p2',
    suggestedReviewIds: ['generated-french-vocabulary-p2'],
    missionTitle: 'Mission phrases P2',
    missionSummary: 'Choisir le bon mot et garder une phrase simple correcte.'
  }),
  createModule({
    id: 'french-g2-reading',
    subjectId: 'french',
    gradeId: 'P2',
    domainId: 'reading',
    domainLabel: 'Lecture',
    title: 'Lecture guidee et comprehension de base',
    summary: 'Lire des mots puis de tres petits textes avec questions directes.',
    goal: 'Faire grandir la lecture sans surcharger la comprehension.',
    demo: 'Une demonstration montre comment retrouver la phrase qui repond a la question.',
    guidedActivityIds: ['generated-french-reading-p2', 'associe-image-mot'],
    independentActivityIds: ['intrus-lecture'],
    challengeActivityId: 'generated-french-reading',
    examActivityId: 'generated-french-reading-p2',
    suggestedReviewIds: ['phrase-a-trous'],
    missionTitle: 'Mission lecture P2',
    missionSummary: 'Lire des mots et des phrases courtes pour comprendre une idee simple.'
  })
];
