import { createModule } from '../../curriculum/moduleTemplate.js';
export const sciencesGrade6Modules = [
  createModule({ id: 'sci-g6-energy', subjectId: 'sciences', gradeId: 'P6', domainId: 'energy-environment', domainLabel: 'Energie et environnement', title: 'Energie et developpement durable', summary: 'Formes d\'energie, pollution et solutions ecologiques.', goal: 'Expliquer les enjeux energetiques et environnementaux.', demo: 'Demo energies renouvelables.', guidedActivityIds: ['sci-energy-p6'], independentActivityIds: ['sci-environment-p6'], challengeActivityId: 'sci-energy-p6', examActivityId: 'sci-environment-p6', missionTitle: 'Mission Energie P6', levelTitles: { 'sci-energy-p6': 'Formes d\'energie', 'sci-environment-p6': 'Ecologie' } }),
];
