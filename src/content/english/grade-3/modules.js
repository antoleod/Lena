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
    guidedActivityIds: ['english-sentence-choices', 'generated-english-sentences'],
    independentActivityIds: ['generated-english-reading'],
    challengeActivityId: 'generated-english-sentences',
    examActivityId: 'generated-english-sentences',
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
    goal: 'Build confidence with short dialogues and clear answers.',
    demo: 'The demo isolates who speaks and what each sentence means.',
    guidedActivityIds: ['generated-english-reading', 'generated-english-sentences'],
    independentActivityIds: ['generated-english-vocabulary'],
    challengeActivityId: 'generated-english-reading',
    examActivityId: 'generated-english-reading',
    suggestedReviewIds: ['english-sentence-choices']
  }),
  createModule({
    id: 'english-g3-questions',
    subjectId: 'english',
    gradeId: 'P3',
    domainId: 'questions',
    domainLabel: 'Question and answer',
    title: 'Question, answer and review',
    summary: 'Recognise simple answers and return to key vocabulary.',
    goal: 'Make reading and answering feel automatic.',
    demo: 'The demo shows how to spot the important answer word.',
    guidedActivityIds: ['generated-english-vocabulary', 'generated-english-reading'],
    independentActivityIds: ['english-sentence-choices'],
    challengeActivityId: 'generated-english-reading',
    examActivityId: 'generated-english-vocabulary',
    suggestedReviewIds: ['english-visual-words']
  })
];
