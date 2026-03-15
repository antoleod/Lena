import { createModule } from '../../curriculum/moduleTemplate.js';

export const mathematicsGrade4Modules = [

  createModule({
    id: 'math-g4-tables-advanced',
    subjectId: 'mathematics',
    gradeId: 'P4',
    domainId: 'multiplication-division',
    domainLabel: 'Tables 6 a 10',
    title: 'Maitriser les grandes tables',
    summary: 'Consolider les tables de multiplication et de division les plus complexes.',
    goal: 'Acquerir une fluence parfaite en calcul mental avance.',
    demo: 'Demo sur les tables superieures.',
    guidedActivityIds: ['multiplication-table-9', 'division-table-9'],
    independentActivityIds: ['multiplication-table-10', 'division-table-10'],
    challengeActivityId: 'multiplication-table-11',
    examActivityId: 'division-table-11',
    missionTitle: 'Mission Tables Avancees'
  }),
  createModule({
    id: 'math-g4-divisions-fractions',
    subjectId: 'mathematics',
    gradeId: 'P4',
    domainId: 'fractions',
    domainLabel: 'Divisions et Fractions',
    title: 'Decouvrir les fractions',
    summary: 'Lien entre le partage (division) et la representation fractionnaire.',
    goal: 'Visualiser une fraction comme une part d un tout.',
    demo: 'Une demonstration avec des parts de pizza ou de gateau.',
    guidedActivityIds: ['generated-division-p4'],
    independentActivityIds: ['generated-fractions-p4'],
    challengeActivityId: 'generated-division-p4',
    examActivityId: 'generated-fractions-p4',
    missionTitle: 'Mission Fractions'
  })

];
