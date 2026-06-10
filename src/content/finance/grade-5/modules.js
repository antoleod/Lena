import { createModule } from '../../curriculum/moduleTemplate.js';

export const financeGrade5Modules = [
  createModule({
    id: 'finance-g5-budget',
    subjectId: 'finance',
    gradeId: 'P5',
    domainId: 'budget-simple',
    domainLabel: 'Budget avancé',
    title: 'Budget familial et choix financiers',
    summary: 'Analyser un budget plus complexe et faire des choix éclairés.',
    goal: 'Comprendre les compromis financiers et les priorités.',
    demo: 'On présente un budget familial simplifié avec plusieurs postes de dépenses.',
    guidedActivityIds: ['generated-finance-budget-simple-p5', 'generated-finance-economiser-p5'],
    independentActivityIds: ['generated-finance-defis-du-quotidien-p5'],
    challengeActivityId: 'generated-finance-petit-commercant-p5',
    examActivityId: 'generated-finance-budget-simple-p5',
    suggestedReviewIds: ['generated-finance-economiser-p4'],
    missionTitle: 'Mission budget P5',
    missionSummary: 'Analyser un budget familial et faire des choix financiers.'
  }),
  createModule({
    id: 'finance-g5-defis',
    subjectId: 'finance',
    gradeId: 'P5',
    domainId: 'defis-du-quotidien',
    domainLabel: 'Défis du quotidien',
    title: 'Défis financiers de la vie réelle',
    summary: 'Résoudre des problèmes financiers inspirés de situations réelles.',
    goal: 'Appliquer toutes les compétences financières dans des contextes variés.',
    demo: 'La démonstration présente des scénarios réels et comment les analyser.',
    guidedActivityIds: ['generated-finance-defis-du-quotidien-p5', 'generated-finance-budget-simple-p5'],
    independentActivityIds: ['generated-finance-economiser-p5'],
    challengeActivityId: 'generated-finance-rendre-la-monnaie-p5',
    examActivityId: 'generated-finance-defis-du-quotidien-p5',
    suggestedReviewIds: ['generated-finance-budget-simple-p5'],
    missionTitle: 'Mission défis P5',
    missionSummary: 'Résoudre des défis financiers de la vie quotidienne.'
  })
];
