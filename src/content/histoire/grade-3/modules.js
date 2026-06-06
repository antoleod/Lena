import { createModule } from '../../curriculum/moduleTemplate.js';
export const histoireGrade3Modules = [
  createModule({ id: 'hist-g3-europe', subjectId: 'histoire', gradeId: 'P3', domainId: 'europe-timeline', domainLabel: 'Europe et chronologie', title: 'L\'Europe et la frise chronologique', summary: 'Pays voisins de la Belgique et lecture de frises.', goal: 'Localiser les voisins europeens et placer des evenements dans le temps.', demo: 'Demo frise chronologique.', guidedActivityIds: ['hist-europe-p3'], independentActivityIds: ['hist-timeline-p3'], challengeActivityId: 'hist-europe-p3', examActivityId: 'hist-timeline-p3', missionTitle: 'Mission Europe P3', levelTitles: { 'hist-europe-p3': 'Pays voisins', 'hist-timeline-p3': 'Frise chronologique' } }),
];
