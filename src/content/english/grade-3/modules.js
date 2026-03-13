import { createModule } from '../../curriculum/moduleTemplate.js';

export const englishGrade3Modules = [
  createModule({
    id: 'english-g3-sentences',
    subjectId: 'english',
    gradeId: 'P3',
    domainId: 'sentence-building',
    domainLabel: 'Sentence building',
    title: 'Simple grammar and sentence meaning',
    summary: 'Build confidence with simple English patterns and choices.',
    goal: 'Move from isolated vocabulary to sentence understanding.',
    demo: 'The demo shows how to read the whole sentence before choosing.',
    guidedActivityIds: ['generated-english-vocabulary'],
    independentActivityIds: ['generated-english-reading'],
    challengeActivityId: 'generated-english-reading',
    examActivityId: 'generated-english-vocabulary',
    suggestedReviewIds: ['generated-english-vocabulary']
  }),
  createModule({
    id: 'english-g3-dialogues',
    subjectId: 'english',
    gradeId: 'P3',
    domainId: 'dialogues',
    domainLabel: 'Dialogues',
    title: 'Short dialogues and mini checks',
    summary: 'Read a short scene, understand it, then answer.',
    goal: 'Prepare for later listening and dictation modules.',
    demo: 'The demo isolates who speaks and what each sentence means.',
    guidedActivityIds: ['generated-english-reading'],
    independentActivityIds: ['generated-english-vocabulary'],
    challengeActivityId: 'generated-english-reading',
    examActivityId: 'generated-english-reading',
    suggestedReviewIds: ['generated-english-vocabulary']
  })
];
