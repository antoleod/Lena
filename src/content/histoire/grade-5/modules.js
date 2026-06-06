import { createModule } from '../../curriculum/moduleTemplate.js';
export const histoireGrade5Modules = [
  createModule({ id: 'hist-g5-world', subjectId: 'histoire', gradeId: 'P5', domainId: 'world-modern', domainLabel: 'Monde et epoque moderne', title: 'Le monde et l\'epoque moderne', summary: 'Geographie mondiale et grandes decouvertes.', goal: 'Localiser les continents et comprendre l\'epoque des decouvertes.', demo: 'Demo planisphere.', guidedActivityIds: ['hist-world-geo-p5'], independentActivityIds: ['hist-modern-p5'], challengeActivityId: 'hist-world-geo-p5', examActivityId: 'hist-modern-p5', missionTitle: 'Mission Monde P5', levelTitles: { 'hist-world-geo-p5': 'Geographie mondiale', 'hist-modern-p5': 'Epoque moderne' } }),
];
