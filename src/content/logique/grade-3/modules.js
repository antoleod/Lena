import { createModule } from '../../curriculum/moduleTemplate.js';

export const logiqueGrade3Modules = [
  createModule({
    id: 'logique-g3-suites',
    subjectId: 'logique',
    gradeId: 'P3',
    domainId: 'suites-logiques',
    domainLabel: 'Suites logiques',
    title: 'Suites logiques plus complexes',
    summary: 'Observer des suites avec des règles à plusieurs critères.',
    goal: 'Passer à une logique plus abstraite et stratégique.',
    demo: 'On explique comment tester une hypothèse et éliminer les mauvaises réponses.',
    guidedActivityIds: ['generated-logique-suites-logiques-p3', 'generated-logique-formes-et-motifs-p3'],
    independentActivityIds: ['generated-logique-logique-visuelle-p3'],
    challengeActivityId: 'generated-logique-comparaison-p3',
    examActivityId: 'generated-logique-suites-logiques-p3',
    suggestedReviewIds: ['generated-logique-suites-logiques-p2'],
    missionTitle: 'Mission suites P3',
    missionSummary: 'Suites à plusieurs critères et règles plus riches.'
  }),
  createModule({
    id: 'logique-g3-deduction',
    subjectId: 'logique',
    gradeId: 'P3',
    domainId: 'deduction',
    domainLabel: 'Déduction',
    title: 'Déduire avec des indices',
    summary: 'Lire les indices et éliminer les impossibilités pour trouver la réponse.',
    goal: 'Installer une vraie démarche de raisonnement logique.',
    demo: 'La démonstration montre comment utiliser chaque indice pour réduire les possibilités.',
    guidedActivityIds: ['generated-logique-deduction-p3', 'generated-logique-comparaison-p3'],
    independentActivityIds: ['generated-logique-trouve-lintrus-p3'],
    challengeActivityId: 'generated-logique-resolution-de-problemes-p3',
    examActivityId: 'generated-logique-deduction-p3',
    suggestedReviewIds: ['generated-logique-trouve-lintrus-p2'],
    missionTitle: 'Mission déduction P3',
    missionSummary: 'Déduire la bonne réponse à partir d\'indices.'
  }),
  createModule({
    id: 'logique-g3-labyrinthes',
    subjectId: 'logique',
    gradeId: 'P3',
    domainId: 'labyrinthes',
    domainLabel: 'Labyrinthes',
    title: 'Résoudre des labyrinthes logiques',
    summary: 'Trouver le chemin correct dans des labyrinthes avec des règles.',
    goal: 'Développer la pensée spatiale et la planification.',
    demo: 'On montre comment explorer un labyrinthe en évitant les impasses.',
    guidedActivityIds: ['generated-logique-labyrinthes-p3', 'generated-logique-logique-visuelle-p3'],
    independentActivityIds: ['generated-logique-formes-et-motifs-p3'],
    challengeActivityId: 'generated-logique-deduction-p3',
    examActivityId: 'generated-logique-labyrinthes-p3',
    suggestedReviewIds: ['generated-logique-formes-et-motifs-p2'],
    missionTitle: 'Mission labyrinthes P3',
    missionSummary: 'Trouver le bon chemin dans des labyrinthes logiques.'
  })
];
