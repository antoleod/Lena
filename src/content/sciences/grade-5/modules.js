import { createModule } from '../../curriculum/moduleTemplate.js';
export const sciencesGrade5Modules = [
  createModule({ id: 'sci-g5-forces', subjectId: 'sciences', gradeId: 'P5', domainId: 'forces-body', domainLabel: 'Forces et corps', title: 'Forces et systemes du corps', summary: 'Gravite, frottement et grands systemes biologiques.', goal: 'Expliquer les forces simples et les systemes digestif et circulatoire.', demo: 'Demo experience gravite.', guidedActivityIds: ['sci-forces-p5'], independentActivityIds: ['sci-human-body-p5'], challengeActivityId: 'sci-forces-p5', examActivityId: 'sci-human-body-p5', missionTitle: 'Mission Forces P5', levelTitles: { 'sci-forces-p5': 'Forces et mouvements', 'sci-human-body-p5': 'Systemes du corps' } }),
];
