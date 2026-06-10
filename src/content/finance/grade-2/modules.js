import { createModule } from '../../curriculum/moduleTemplate.js';

export const financeGrade2Modules = [
  createModule({
    id: 'finance-g2-pieces',
    subjectId: 'finance',
    gradeId: 'P2',
    domainId: 'reconnaitre-les-pieces',
    domainLabel: 'Les pièces',
    title: 'Reconnaître les pièces de monnaie',
    summary: 'Apprendre à identifier les pièces de 1 centime à 2 euros.',
    goal: 'Mémoriser la valeur et l\'apparence de chaque pièce.',
    demo: 'On présente chaque pièce avec sa couleur, sa taille et sa valeur.',
    guidedActivityIds: ['generated-finance-reconnaitre-les-pieces-p2', 'generated-finance-reconnaitre-les-billets-p2'],
    independentActivityIds: ['generated-finance-comparaison-p2'],
    challengeActivityId: 'generated-finance-calculer-un-achat-p2',
    examActivityId: 'generated-finance-reconnaitre-les-pieces-p2',
    suggestedReviewIds: ['generated-finance-reconnaitre-les-billets-p2'],
    missionTitle: 'Mission pièces P2',
    missionSummary: 'Reconnaître et nommer les pièces de monnaie.'
  }),
  createModule({
    id: 'finance-g2-achats',
    subjectId: 'finance',
    gradeId: 'P2',
    domainId: 'calculer-un-achat',
    domainLabel: 'Calculer un achat',
    title: 'Calculer le prix d\'un achat simple',
    summary: 'Additionner des prix pour calculer le total d\'un achat.',
    goal: 'Relier les mathématiques à des situations réelles.',
    demo: 'La démonstration montre comment additionner deux prix simples.',
    guidedActivityIds: ['generated-finance-calculer-un-achat-p2', 'generated-finance-reconnaitre-les-pieces-p2'],
    independentActivityIds: ['generated-finance-reconnaitre-les-billets-p2'],
    challengeActivityId: 'generated-finance-rendre-la-monnaie-p2',
    examActivityId: 'generated-finance-calculer-un-achat-p2',
    suggestedReviewIds: ['generated-finance-reconnaitre-les-pieces-p2'],
    missionTitle: 'Mission achats P2',
    missionSummary: 'Calculer le total d\'un achat avec des petits prix.'
  })
];
