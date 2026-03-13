import { createModule } from '../../curriculum/moduleTemplate.js';

export const dutchGrade2Modules = [
  createModule({
    id: 'dutch-g2-vocabulary',
    subjectId: 'dutch',
    gradeId: 'P2',
    domainId: 'woordenschat',
    domainLabel: 'Woordenschat',
    title: 'Schoolwoorden en beeld',
    summary: 'Leren begroeten, schoolwoorden herkennen en beeld met woord koppelen.',
    goal: 'Rustig woorden leren voor kleine zinnen.',
    demo: 'Een korte demonstratie leest het woord en toont het beeld.',
    guidedActivityIds: ['dutch-school-words', 'dutch-picture-words'],
    independentActivityIds: ['generated-dutch-vocabulary'],
    challengeActivityId: 'generated-dutch-vocabulary',
    examActivityId: 'dutch-school-words',
    suggestedReviewIds: ['dutch-picture-words']
  }),
  createModule({
    id: 'dutch-g2-sentences',
    subjectId: 'dutch',
    gradeId: 'P2',
    domainId: 'eenvoudige-zinnen',
    domainLabel: 'Eenvoudige zinnen',
    title: 'Kleine zinnen begrijpen',
    summary: 'Kies het juiste woord en lees heel korte teksten.',
    goal: 'Van losse woorden naar begrip gaan.',
    demo: 'We tonen eerst hoe je naar sleutelwoorden zoekt.',
    guidedActivityIds: ['generated-dutch-vocabulary'],
    independentActivityIds: ['generated-dutch-reading'],
    challengeActivityId: 'generated-dutch-reading',
    examActivityId: 'generated-dutch-vocabulary',
    suggestedReviewIds: ['dutch-school-words']
  })
];
