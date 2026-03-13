import { createModule } from '../../curriculum/moduleTemplate.js';

export const mathematicsGrade3Modules = [
  createModule({
    id: 'math-g3-large-numbers',
    subjectId: 'mathematics',
    gradeId: 'P3',
    domainId: 'large-numbers',
    domainLabel: 'Grands nombres',
    title: 'Decomposer et comparer',
    summary: 'Lire, decomposer et ordonner des nombres plus grands.',
    goal: 'Stabiliser les centaines et les milliers dans des exercices progressifs.',
    demo: 'Une demonstration montre comment casser un nombre en centaines, dizaines et unites.',
    guidedActivityIds: ['place-value'],
    independentActivityIds: ['generated-comparison-p2'],
    challengeActivityId: 'mult-div-families',
    examActivityId: 'place-value',
    suggestedReviewIds: ['build-number']
  }),
  createModule({
    id: 'math-g3-tables-division',
    subjectId: 'mathematics',
    gradeId: 'P3',
    domainId: 'tables',
    domainLabel: 'Tables et division',
    title: 'Multiplication progressive',
    summary: 'Apprendre les tables, les familles d operations et les problemes simples.',
    goal: 'Passer de la table de 2 a des multiplications plus larges.',
    demo: 'On montre les paquets egaux puis le lien avec la division.',
    guidedActivityIds: ['multiplication-table-2', 'generated-multiplication-p3'],
    independentActivityIds: ['mult-div-families'],
    challengeActivityId: 'generated-word-problems',
    examActivityId: 'generated-multiplication-p3',
    suggestedReviewIds: ['multiplication-table-2']
  }),
  createModule({
    id: 'math-g3-problems',
    subjectId: 'mathematics',
    gradeId: 'P3',
    domainId: 'problems',
    domainLabel: 'Problemes',
    title: 'Problemes en une ou plusieurs etapes',
    summary: 'Lire, trier les informations et choisir la bonne question.',
    goal: 'Rendre les problemes lisibles et strategiques.',
    demo: 'Une demonstration visuelle isole les informations utiles avant de calculer.',
    guidedActivityIds: ['word-problems', 'generated-word-problems'],
    independentActivityIds: ['generated-logic-sequences'],
    challengeActivityId: 'generated-word-problems',
    examActivityId: 'word-problems',
    suggestedReviewIds: ['generated-subtraction-p2']
  })
];
