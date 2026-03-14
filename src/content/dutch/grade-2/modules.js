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
    guidedActivityIds: ['generated-dutch-sentences', 'generated-dutch-vocabulary'],
    independentActivityIds: ['generated-dutch-reading'],
    challengeActivityId: 'generated-dutch-reading',
    examActivityId: 'generated-dutch-sentences',
    suggestedReviewIds: ['dutch-school-words']
  }),
  createModule({
    id: 'dutch-g2-school-life',
    subjectId: 'dutch',
    gradeId: 'P2',
    domainId: 'schoolleven',
    domainLabel: 'Schoolleven',
    title: 'School, acties en routine',
    summary: 'Herkennen wat je op school ziet en doet.',
    goal: 'Meer routinewoorden leren in context.',
    demo: 'Een voorbeeld laat zien hoe woord en situatie samen horen.',
    guidedActivityIds: ['dutch-picture-words', 'generated-dutch-sentences'],
    independentActivityIds: ['generated-dutch-vocabulary'],
    challengeActivityId: 'generated-dutch-vocabulary',
    examActivityId: 'generated-dutch-reading',
    suggestedReviewIds: ['dutch-picture-words']
  }),
  createModule({
    id: 'dutch-g2-routine',
    subjectId: 'dutch',
    gradeId: 'P2',
    domainId: 'routine',
    domainLabel: 'Routine',
    title: 'Dagelijks leven en gevoel',
    summary: 'Woorden over routine, eten, gevoelens en klasmomenten.',
    goal: 'Taal van elke dag sneller herkennen en gebruiken.',
    demo: 'We tonen eerst een kleine routine met de kernwoorden erbij.',
    guidedActivityIds: ['generated-dutch-daily-life', 'generated-dutch-vocabulary'],
    independentActivityIds: ['generated-dutch-sentences'],
    challengeActivityId: 'generated-dutch-stories',
    examActivityId: 'generated-dutch-daily-life',
    suggestedReviewIds: ['dutch-picture-words']
  })
];
