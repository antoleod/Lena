import { createModule } from '../../curriculum/moduleTemplate.js';

export const englishGrade2Modules = [
  createModule({
    id: 'english-g2-vocabulary',
    subjectId: 'english',
    gradeId: 'P2',
    domainId: 'vocabulary',
    domainLabel: 'Vocabulary',
    title: 'Greetings, colors and school words',
    summary: 'Discover simple English words with image and choice tasks.',
    goal: 'Learn first words before reading longer sentences.',
    demo: 'A small visual demo reads and shows each word first.',
    guidedActivityIds: ['english-visual-words', 'generated-english-vocabulary'],
    independentActivityIds: ['english-visual-words', 'generated-english-vocabulary'],
    challengeActivityId: 'generated-english-vocabulary',
    examActivityId: 'generated-english-vocabulary',
    suggestedReviewIds: ['english-visual-words']
  }),
  createModule({
    id: 'english-g2-sentences',
    subjectId: 'english',
    gradeId: 'P2',
    domainId: 'sentences',
    domainLabel: 'Sentences',
    title: 'Simple sentences and meaning',
    summary: 'Read short sentences and choose the correct word.',
    goal: 'Move from isolated vocabulary to sentence meaning.',
    demo: 'The demo shows how to read the whole sentence before choosing.',
    guidedActivityIds: ['english-sentence-choices', 'generated-english-sentences'],
    independentActivityIds: ['generated-english-vocabulary'],
    challengeActivityId: 'english-sentence-choices',
    examActivityId: 'generated-english-sentences',
    suggestedReviewIds: ['english-visual-words']
  }),
  createModule({
    id: 'english-g2-reading',
    subjectId: 'english',
    gradeId: 'P2',
    domainId: 'reading',
    domainLabel: 'Reading',
    title: 'Short reading and understanding',
    summary: 'Read short texts and answer a clear question.',
    goal: 'Connect word learning to simple understanding.',
    demo: 'The demo highlights the useful sentence before answering.',
    guidedActivityIds: ['generated-english-reading', 'generated-english-sentences'],
    independentActivityIds: ['english-sentence-choices'],
    challengeActivityId: 'generated-english-reading',
    examActivityId: 'generated-english-reading',
    suggestedReviewIds: ['generated-english-vocabulary']
  }),
  createModule({
    id: 'english-g2-daily-life',
    subjectId: 'english',
    gradeId: 'P2',
    domainId: 'daily-life',
    domainLabel: 'Daily life',
    title: 'Daily life and school routine',
    summary: 'Use English for routine, emotions, food and school moments.',
    goal: 'Make English useful and visible in familiar situations.',
    demo: 'The demo groups words by theme before starting the questions.',
    guidedActivityIds: ['generated-english-daily-life', 'generated-english-vocabulary'],
    independentActivityIds: ['english-sentence-choices'],
    challengeActivityId: 'generated-english-stories',
    examActivityId: 'generated-english-daily-life',
    suggestedReviewIds: ['english-visual-words']
  })
];
