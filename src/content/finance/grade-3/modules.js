import { createModule } from '../../curriculum/moduleTemplate.js';

export const financeGrade3Modules = [
  createModule({
    id: 'finance-g3-monnaie',
    subjectId: 'finance',
    gradeId: 'P3',
    domainId: 'rendre-la-monnaie',
    domainLabel: 'Rendre la monnaie',
    title: 'Rendre la monnaie correctement',
    summary: 'Calculer la monnaie à rendre après un achat.',
    goal: 'Comprendre la soustraction dans un contexte réel.',
    demo: 'On montre comment calculer la différence entre ce qu\'on donne et le prix.',
    guidedActivityIds: ['generated-finance-rendre-la-monnaie-p3', 'generated-finance-calculer-un-achat-p3'],
    independentActivityIds: ['generated-finance-reconnaitre-les-billets-p3'],
    challengeActivityId: 'generated-finance-petit-commercant-p3',
    examActivityId: 'generated-finance-rendre-la-monnaie-p3',
    suggestedReviewIds: ['generated-finance-calculer-un-achat-p2'],
    missionTitle: 'Mission monnaie P3',
    missionSummary: 'Calculer et rendre la monnaie dans des situations réelles.'
  }),
  createModule({
    id: 'finance-g3-commercant',
    subjectId: 'finance',
    gradeId: 'P3',
    domainId: 'petit-commercant',
    domainLabel: 'Petit commerçant',
    title: 'Jouer au petit commerçant',
    summary: 'Simuler des transactions simples en jouant le rôle du commerçant.',
    goal: 'Appliquer le calcul d\'achats et de monnaie dans un jeu de rôle.',
    demo: 'La démonstration présente une transaction complète de bout en bout.',
    guidedActivityIds: ['generated-finance-petit-commercant-p3', 'generated-finance-rendre-la-monnaie-p3'],
    independentActivityIds: ['generated-finance-calculer-un-achat-p3'],
    challengeActivityId: 'generated-finance-budget-simple-p3',
    examActivityId: 'generated-finance-petit-commercant-p3',
    suggestedReviewIds: ['generated-finance-rendre-la-monnaie-p3'],
    missionTitle: 'Mission commerçant P3',
    missionSummary: 'Simuler des achats et rendre la monnaie comme un vrai commerçant.'
  })
];
