import { createModule } from '../../curriculum/moduleTemplate.js';

export const financeGrade4Modules = [
  createModule({
    id: 'finance-g4-budget',
    subjectId: 'finance',
    gradeId: 'P4',
    domainId: 'budget-simple',
    domainLabel: 'Budget simple',
    title: 'Gérer un budget simple',
    summary: 'Apprendre à équilibrer recettes et dépenses dans un budget.',
    goal: 'Comprendre la notion de budget et d\'équilibre financier.',
    demo: 'On présente un budget simple avec revenus et dépenses.',
    guidedActivityIds: ['generated-finance-budget-simple-p4', 'generated-finance-economiser-p4'],
    independentActivityIds: ['generated-finance-defis-du-quotidien-p4'],
    challengeActivityId: 'generated-finance-petit-commercant-p4',
    examActivityId: 'generated-finance-budget-simple-p4',
    suggestedReviewIds: ['generated-finance-petit-commercant-p3'],
    missionTitle: 'Mission budget P4',
    missionSummary: 'Gérer un budget simple et équilibrer recettes et dépenses.'
  }),
  createModule({
    id: 'finance-g4-economiser',
    subjectId: 'finance',
    gradeId: 'P4',
    domainId: 'economiser',
    domainLabel: 'Économiser',
    title: 'Apprendre à économiser',
    summary: 'Comprendre pourquoi et comment mettre de l\'argent de côté.',
    goal: 'Développer la notion d\'épargne et de projet financier.',
    demo: 'La démonstration présente un plan d\'épargne simple pour un objectif.',
    guidedActivityIds: ['generated-finance-economiser-p4', 'generated-finance-budget-simple-p4'],
    independentActivityIds: ['generated-finance-defis-du-quotidien-p4'],
    challengeActivityId: 'generated-finance-petit-commercant-p4',
    examActivityId: 'generated-finance-economiser-p4',
    suggestedReviewIds: ['generated-finance-budget-simple-p4'],
    missionTitle: 'Mission épargne P4',
    missionSummary: 'Planifier une épargne simple pour atteindre un objectif.'
  })
];
