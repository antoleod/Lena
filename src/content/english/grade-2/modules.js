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
    guidedActivityIds: ['generated-english-vocabulary'],
    independentActivityIds: ['generated-english-vocabulary'],
    challengeActivityId: 'generated-english-vocabulary',
    examActivityId: 'generated-english-vocabulary',
    suggestedReviewIds: ['generated-english-vocabulary']
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
    guidedActivityIds: ['generated-english-reading'],
    independentActivityIds: ['generated-english-vocabulary'],
    challengeActivityId: 'generated-english-reading',
    examActivityId: 'generated-english-reading',
    suggestedReviewIds: ['generated-english-vocabulary']
  })
];
