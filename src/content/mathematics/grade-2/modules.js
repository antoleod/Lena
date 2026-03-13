import { createModule } from '../../curriculum/moduleTemplate.js';

export const mathematicsGrade2Modules = [
  createModule({
    id: 'math-g2-numbers',
    subjectId: 'mathematics',
    gradeId: 'P2',
    domainId: 'numbers',
    domainLabel: 'Nombres',
    title: 'Nombres, dizaines et unites',
    summary: 'Compter, lire, construire et comparer des nombres simples.',
    goal: 'Comprendre la valeur de position avant de calculer.',
    demo: 'Une demonstration visuelle montre comment on construit un nombre avec dizaines et unites.',
    guidedActivityIds: ['build-number', 'place-value'],
    independentActivityIds: ['generated-comparison-p2'],
    challengeActivityId: 'number-line',
    examActivityId: 'place-value',
    suggestedReviewIds: ['build-number']
  }),
  createModule({
    id: 'math-g2-operations',
    subjectId: 'mathematics',
    gradeId: 'P2',
    domainId: 'operations',
    domainLabel: 'Operations',
    title: 'Additions et soustractions',
    summary: 'Apprendre a additionner, soustraire puis choisir la bonne operation.',
    goal: 'Passer de la manipulation a la reponse autonome.',
    demo: 'On montre d abord comment faire des bonds et comment relire le calcul.',
    guidedActivityIds: ['generated-addition-p2', 'generated-subtraction-p2'],
    independentActivityIds: ['number-line'],
    challengeActivityId: 'generated-word-problems',
    examActivityId: 'generated-subtraction-p2',
    suggestedReviewIds: ['generated-addition-p2']
  }),
  createModule({
    id: 'math-g2-patterns',
    subjectId: 'mathematics',
    gradeId: 'P2',
    domainId: 'reasoning',
    domainLabel: 'Raisonnement mathematique',
    title: 'Suites et mini problemes',
    summary: 'Observer une regle, la poursuivre et l utiliser dans un petit defi.',
    goal: 'Developper le raisonnement avec des motifs simples.',
    demo: 'Une serie visuelle explique comment detecter une regle.',
    guidedActivityIds: ['generated-logic-sequences'],
    independentActivityIds: ['generated-word-problems'],
    challengeActivityId: 'multiplication-table-2',
    examActivityId: 'generated-logic-sequences',
    suggestedReviewIds: ['generated-comparison-p2']
  })
];
