import { createModule } from '../../curriculum/moduleTemplate.js';

export const reasoningGrade2Modules = [
  createModule({
    id: 'reasoning-g2-sequences',
    subjectId: 'reasoning',
    gradeId: 'P2',
    domainId: 'sequences',
    domainLabel: 'Suites',
    title: 'Suites visuelles et regles simples',
    summary: 'Observer une suite, chercher une regle et continuer.',
    goal: 'Construire une attention visuelle stable.',
    demo: 'On montre comment comparer chaque element avant de choisir.',
    guidedActivityIds: ['generated-sequences-p2', 'generated-reasoning-p2'],
    independentActivityIds: ['generated-logic-sequences'],
    challengeActivityId: 'generated-patterns-p2',
    examActivityId: 'generated-sequences-p2',
    suggestedReviewIds: ['generated-reasoning-p2'],
    missionTitle: 'Mission suites P2',
    missionSummary: 'Repeter une regle simple dans des suites et des motifs.'
  }),
  createModule({
    id: 'reasoning-g2-classification',
    subjectId: 'reasoning',
    gradeId: 'P2',
    domainId: 'classification',
    domainLabel: 'Classification',
    title: 'Classer, comparer et trouver l intrus',
    summary: 'Trier, comparer et chercher ce qui ne va pas ensemble.',
    goal: 'Mieux preparer les mini defis de raisonnement.',
    demo: 'La demonstration decoupe la tache en petites etapes.',
    guidedActivityIds: ['generated-classification-reasoning-p2', 'generated-reasoning-p2'],
    independentActivityIds: ['generated-classification-p2'],
    challengeActivityId: 'generated-reasoning-p2',
    examActivityId: 'generated-classification-reasoning-p2',
    suggestedReviewIds: ['generated-sequences-p2'],
    missionTitle: 'Mission tri P2',
    missionSummary: 'Classer des objets ou des nombres et reperer un intrus simple.'
  }),
  createModule({
    id: 'reasoning-g2-soft-logic',
    subjectId: 'reasoning',
    gradeId: 'P2',
    domainId: 'soft-logic',
    domainLabel: 'Logique douce',
    title: 'Intrus, categories et petites deductions',
    summary: 'Un vrai bloc de logique douce pour completer les suites et les tris.',
    goal: 'Faire de la logique une matiere vivante et non un simple bonus.',
    demo: 'La demonstration montre comment comparer deux groupes avant de choisir.',
    guidedActivityIds: ['generated-logic-p2', 'generated-reasoning-p2'],
    independentActivityIds: ['generated-classification-reasoning-p2'],
    challengeActivityId: 'generated-logic-sequences',
    examActivityId: 'generated-logic-p2',
    suggestedReviewIds: ['generated-sequences-p2'],
    missionTitle: 'Mission logique douce P2',
    missionSummary: 'Intrus, categories et petites deductions tres lisibles.'
  })
];
