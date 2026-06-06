import { createModule } from '../../curriculum/moduleTemplate.js';
export const sciencesGrade3Modules = [
  createModule({ id: 'sci-g3-plants', subjectId: 'sciences', gradeId: 'P3', domainId: 'plants-water', domainLabel: 'Plantes et eau', title: 'Les plantes et le cycle de l\'eau', summary: 'Comprendre la vie des plantes et le cycle de l\'eau.', goal: 'Decrire la photosynthese et les etats de l\'eau.', demo: 'Demo cycle de l\'eau.', guidedActivityIds: ['sci-plants-p3'], independentActivityIds: ['sci-water-p3'], challengeActivityId: 'sci-plants-p3', examActivityId: 'sci-water-p3', missionTitle: 'Mission Plantes P3', levelTitles: { 'sci-plants-p3': 'Parties d\'une plante', 'sci-water-p3': 'Cycle de l\'eau' } }),
];
