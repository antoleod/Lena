import { createModule } from '../../curriculum/moduleTemplate.js';

export const financeGrade6Modules = [
  createModule({
    id: 'finance-g6-budget',
    subjectId: 'finance',
    gradeId: 'P6',
    domainId: 'budget-simple',
    domainLabel: 'Budget expert',
    title: 'Gestion financière experte',
    summary: 'Maîtriser la gestion d\'un budget complexe avec revenus variables.',
    goal: 'Préparer à une vraie autonomie financière.',
    demo: 'On analyse un budget annuel avec dépenses imprévues et épargne.',
    guidedActivityIds: ['generated-finance-budget-simple-p6', 'generated-finance-economiser-p6'],
    independentActivityIds: ['generated-finance-defis-du-quotidien-p6'],
    challengeActivityId: 'generated-finance-petit-commercant-p6',
    examActivityId: 'generated-finance-budget-simple-p6',
    suggestedReviewIds: ['generated-finance-defis-du-quotidien-p5'],
    missionTitle: 'Mission budget P6',
    missionSummary: 'Gestion financière experte avec budget complexe.'
  }),
  createModule({
    id: 'finance-g6-defis',
    subjectId: 'finance',
    gradeId: 'P6',
    domainId: 'defis-du-quotidien',
    domainLabel: 'Défis experts',
    title: 'Défis financiers experts',
    summary: 'Relever des défis financiers complexes inspirés du monde réel.',
    goal: 'Consolider toutes les compétences en éducation financière.',
    demo: 'La démonstration présente des scénarios de la vie adulte simplifiés.',
    guidedActivityIds: ['generated-finance-defis-du-quotidien-p6', 'generated-finance-budget-simple-p6'],
    independentActivityIds: ['generated-finance-economiser-p6'],
    challengeActivityId: 'generated-finance-petit-commercant-p6',
    examActivityId: 'generated-finance-defis-du-quotidien-p6',
    suggestedReviewIds: ['generated-finance-budget-simple-p6'],
    missionTitle: 'Mission défis P6',
    missionSummary: 'Défis financiers experts et scénarios de vie réelle.'
  })
];
