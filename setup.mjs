import fs from 'fs';
import path from 'path';

const SRC = 'c:/Users/X1/Documents/Lena/src/content';
const CATALOG = 'c:/Users/X1/Documents/Lena/src/features/curriculum/catalog.js';

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function writeModuleFile(subject, grade, variableName, modulesCode) {
  const dir = path.join(SRC, subject, `grade-${grade}`);
  ensureDir(dir);
  const file = path.join(dir, 'modules.js');
  const code = `import { createModule } from '../../curriculum/moduleTemplate.js';\n\nexport const ${variableName} = [\n${modulesCode}\n];\n`;
  fs.writeFileSync(file, code);
}

// 1. MATHEMATICS
writeModuleFile('mathematics', 4, 'mathematicsGrade4Modules', `
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
`);

writeModuleFile('mathematics', 5, 'mathematicsGrade5Modules', `
  createModule({
    id: 'math-g5-decimals',
    subjectId: 'mathematics',
    gradeId: 'P5',
    domainId: 'decimals',
    domainLabel: 'Nombres decimaux',
    title: 'Les nombres decimaux',
    summary: 'Calculer et comprendre les nombres a virgule.',
    goal: 'Etendre la numeration au dela de l unite.',
    demo: 'Demo sur les dixiemes et centiemes.',
    guidedActivityIds: ['generated-decimals-p5'],
    independentActivityIds: ['generated-decimals-p5'],
    challengeActivityId: 'generated-decimals-p5',
    examActivityId: 'generated-decimals-p5',
    missionTitle: 'Mission Decimaux'
  })
`);

writeModuleFile('mathematics', 6, 'mathematicsGrade6Modules', `
  createModule({
    id: 'math-g6-mixed',
    subjectId: 'mathematics',
    gradeId: 'P6',
    domainId: 'mixed-operations',
    domainLabel: 'Operations mixtes',
    title: 'Operations mixtes',
    summary: 'Combiner toutes les operations dans des defis.',
    goal: 'Respecter l ordre des operations.',
    demo: 'Demo calculs chaines.',
    guidedActivityIds: ['generated-mixed-operations-p6'],
    independentActivityIds: ['generated-mixed-operations-p6'],
    challengeActivityId: 'generated-mixed-operations-p6',
    examActivityId: 'generated-mixed-operations-p6',
    missionTitle: 'Mission Operations Mixtes'
  })
`);

// 2. FRENCH
writeModuleFile('french', 4, 'frenchGrade4Modules', `
  createModule({
    id: 'french-g4-reading',
    subjectId: 'french',
    gradeId: 'P4',
    domainId: 'reading',
    domainLabel: 'Lecture active',
    title: 'Lecture et comprehension',
    summary: 'Lire des textes informatifs et repondre aux questions.',
    goal: 'Extraire l information.',
    demo: 'Demo avec un texte de decouverte.',
    guidedActivityIds: ['generated-french-reading-p4'],
    independentActivityIds: ['generated-french-reading-p4'],
    challengeActivityId: 'generated-french-reading-p4',
    examActivityId: 'generated-french-reading-p4',
    missionTitle: 'Mission Lecture Active'
  })
`);
writeModuleFile('french', 5, 'frenchGrade5Modules', `
  createModule({
    id: 'french-g5-grammar',
    subjectId: 'french',
    gradeId: 'P5',
    domainId: 'grammar',
    domainLabel: 'Grammaire+',
    title: 'Avancees en grammaire',
    summary: 'Preparation a la langue.',
    goal: 'Maitriser les regles.',
    demo: 'Demo grammaticale.',
    guidedActivityIds: ['generated-french-reading-p4'],
    independentActivityIds: ['generated-french-reading-p4'],
    challengeActivityId: 'generated-french-reading-p4',
    examActivityId: 'generated-french-reading-p4',
    missionTitle: 'Mission Grammaire'
  })
`);
writeModuleFile('french', 6, 'frenchGrade6Modules', `
  createModule({
    id: 'french-g6-language',
    subjectId: 'french',
    gradeId: 'P6',
    domainId: 'language',
    domainLabel: 'Langue P6',
    title: 'Maitrise de la langue',
    summary: 'Langue et orthographe avancees.',
    goal: 'Parfaite maitrise en vue du CEB.',
    demo: 'Demo analyse de phrase.',
    guidedActivityIds: ['generated-french-language-p6'],
    independentActivityIds: ['generated-french-language-p6'],
    challengeActivityId: 'generated-french-language-p6',
    examActivityId: 'generated-french-language-p6',
    missionTitle: 'Mission Langue CEB'
  })
`);

// 3. DUTCH
writeModuleFile('dutch', 4, 'dutchGrade4Modules', `
  createModule({
    id: 'dutch-g4-sentences',
    subjectId: 'dutch',
    gradeId: 'P4',
    domainId: 'sentences',
    domainLabel: 'Zinnen+',
    title: 'Complexe zinnen',
    summary: 'Bouw langere zinnen in het Nederlands.',
    goal: 'Vloeiender worden in spreken en schrijven.',
    demo: 'Demo kalimat.',
    guidedActivityIds: ['generated-dutch-sentences-p4'],
    independentActivityIds: ['generated-dutch-sentences-p4'],
    challengeActivityId: 'generated-dutch-sentences-p4',
    examActivityId: 'generated-dutch-sentences-p4',
    missionTitle: 'Missie Zinnen Maken'
  })
`);
writeModuleFile('dutch', 5, 'dutchGrade5Modules', `
  createModule({
    id: 'dutch-g5-sentences',
    subjectId: 'dutch',
    gradeId: 'P5',
    domainId: 'sentences',
    domainLabel: 'Zinnen+',
    title: 'Complexe zinnen (vervolg)',
    summary: 'Bouw langere zinnen in het Nederlands.',
    goal: 'Vloeiender worden in spreken en schrijven.',
    demo: 'Demo kalimat 2.',
    guidedActivityIds: ['generated-dutch-sentences-p4'],
    independentActivityIds: ['generated-dutch-sentences-p4'],
    challengeActivityId: 'generated-dutch-sentences-p4',
    examActivityId: 'generated-dutch-sentences-p4',
    missionTitle: 'Missie Zinnen Maken 2'
  })
`);
writeModuleFile('dutch', 6, 'dutchGrade6Modules', `
  createModule({
    id: 'dutch-g6-reading',
    subjectId: 'dutch',
    gradeId: 'P6',
    domainId: 'reading',
    domainLabel: 'Leesbegrip',
    title: 'Begrijpend lezen',
    summary: 'Lees teksten en beantwoord vragen.',
    goal: 'Tekstbegrip optimaliseren.',
    demo: 'Demo tekst.',
    guidedActivityIds: ['generated-dutch-reading-p6'],
    independentActivityIds: ['generated-dutch-reading-p6'],
    challengeActivityId: 'generated-dutch-reading-p6',
    examActivityId: 'generated-dutch-reading-p6',
    missionTitle: 'Missie Leesbegrip'
  })
`);

// 4. ENGLISH
writeModuleFile('english', 4, 'englishGrade4Modules', `
  createModule({
    id: 'english-g4-sentences',
    subjectId: 'english',
    gradeId: 'P4',
    domainId: 'sentences',
    domainLabel: 'Sentence Builder+',
    title: 'Building better sentences',
    summary: 'Combine words for fluid sentences.',
    goal: 'Improve writing fluency.',
    demo: 'Demo builder.',
    guidedActivityIds: ['generated-english-sentences-p4'],
    independentActivityIds: ['generated-english-sentences-p4'],
    challengeActivityId: 'generated-english-sentences-p4',
    examActivityId: 'generated-english-sentences-p4',
    missionTitle: 'Mission Sentence Builder'
  })
`);
writeModuleFile('english', 5, 'englishGrade5Modules', `
  createModule({
    id: 'english-g5-sentences',
    subjectId: 'english',
    gradeId: 'P5',
    domainId: 'sentences',
    domainLabel: 'Sentence Builder++',
    title: 'Building advanced sentences',
    summary: 'Combine words for fluid sentences.',
    goal: 'Improve writing fluency further.',
    demo: 'Demo builder 2.',
    guidedActivityIds: ['generated-english-sentences-p4'],
    independentActivityIds: ['generated-english-sentences-p4'],
    challengeActivityId: 'generated-english-sentences-p4',
    examActivityId: 'generated-english-sentences-p4',
    missionTitle: 'Mission Sentence Builder Plus'
  })
`);
writeModuleFile('english', 6, 'englishGrade6Modules', `
  createModule({
    id: 'english-g6-reading',
    subjectId: 'english',
    gradeId: 'P6',
    domainId: 'reading',
    domainLabel: 'Reading Challenge',
    title: 'Reading comprehension',
    summary: 'Read and understand texts.',
    goal: 'Deep comprehension.',
    demo: 'Demo Reading.',
    guidedActivityIds: ['generated-english-reading-p6'],
    independentActivityIds: ['generated-english-reading-p6'],
    challengeActivityId: 'generated-english-reading-p6',
    examActivityId: 'generated-english-reading-p6',
    missionTitle: 'Mission Reading'
  })
`);

// 5. SPANISH
writeModuleFile('spanish', 4, 'spanishGrade4Modules', `
  createModule({
    id: 'spanish-g4-sentences',
    subjectId: 'spanish',
    gradeId: 'P4',
    domainId: 'sentences',
    domainLabel: 'Frases',
    title: 'Frases utiles',
    summary: 'Formar frases completas.',
    goal: 'Comprar, hablar y jugar.',
    demo: 'Demo frases.',
    guidedActivityIds: ['generated-spanish-sentences-p4'],
    independentActivityIds: ['generated-spanish-sentences-p4'],
    challengeActivityId: 'generated-spanish-sentences-p4',
    examActivityId: 'generated-spanish-sentences-p4',
    missionTitle: 'Mission Frases'
  })
`);

writeModuleFile('spanish', 5, 'spanishGrade5Modules', `
  createModule({
    id: 'spanish-g5-sentences',
    subjectId: 'spanish',
    gradeId: 'P5',
    domainId: 'sentences',
    domainLabel: 'Frases',
    title: 'Frases divertidas',
    summary: 'Formar frases completas.',
    goal: 'Comprar, hablar y jugar.',
    demo: 'Demo frases 2.',
    guidedActivityIds: ['generated-spanish-sentences-p4'],
    independentActivityIds: ['generated-spanish-sentences-p4'],
    challengeActivityId: 'generated-spanish-sentences-p4',
    examActivityId: 'generated-spanish-sentences-p4',
    missionTitle: 'Mission Frases Plus'
  })
`);

writeModuleFile('spanish', 6, 'spanishGrade6Modules', `
  createModule({
    id: 'spanish-g6-reading',
    subjectId: 'spanish',
    gradeId: 'P6',
    domainId: 'reading',
    domainLabel: 'Lectura',
    title: 'Lectura y comprension',
    summary: 'Leer textos en espanol.',
    goal: 'Entender el idioma.',
    demo: 'Demo lectura.',
    guidedActivityIds: ['generated-spanish-reading-p6'],
    independentActivityIds: ['generated-spanish-reading-p6'],
    challengeActivityId: 'generated-spanish-reading-p6',
    examActivityId: 'generated-spanish-reading-p6',
    missionTitle: 'Mission Lectura'
  })
`);

// 6. REASONING
writeModuleFile('reasoning', 4, 'reasoningGrade4Modules', `
  createModule({
    id: 'reasoning-g4-matrices',
    subjectId: 'reasoning',
    gradeId: 'P4',
    domainId: 'matrices',
    domainLabel: 'Matrices et Suites',
    title: 'Matrices et deductions',
    summary: 'Resoudre des grilles.',
    goal: 'Logique visuo spatiale.',
    demo: 'Demo matrices.',
    guidedActivityIds: ['generated-reasoning-p4'],
    independentActivityIds: ['generated-reasoning-p4'],
    challengeActivityId: 'generated-reasoning-p4',
    examActivityId: 'generated-reasoning-p4',
    missionTitle: 'Mission Logique P4'
  })
`);
writeModuleFile('reasoning', 5, 'reasoningGrade5Modules', `
  createModule({
    id: 'reasoning-g5-matrices',
    subjectId: 'reasoning',
    gradeId: 'P5',
    domainId: 'matrices',
    domainLabel: 'Matrices et Suites',
    title: 'Matrices et deductions',
    summary: 'Resoudre des grilles complexes.',
    goal: 'Logique visuo spatiale avancee.',
    demo: 'Demo matrices.',
    guidedActivityIds: ['generated-reasoning-p4'],
    independentActivityIds: ['generated-reasoning-p4'],
    challengeActivityId: 'generated-reasoning-p4',
    examActivityId: 'generated-reasoning-p4',
    missionTitle: 'Mission Logique P5'
  })
`);

writeModuleFile('reasoning', 6, 'reasoningGrade6Modules', `
  createModule({
    id: 'reasoning-g6-strategy',
    subjectId: 'reasoning',
    gradeId: 'P6',
    domainId: 'strategy',
    domainLabel: 'Strategie',
    title: 'Strategie logique',
    summary: 'Resoudre des defis a etapes.',
    goal: 'Anticipation.',
    demo: 'Demo defi.',
    guidedActivityIds: ['generated-reasoning-p6'],
    independentActivityIds: ['generated-reasoning-p6'],
    challengeActivityId: 'generated-reasoning-p6',
    examActivityId: 'generated-reasoning-p6',
    missionTitle: 'Mission Strategie'
  })
`);


// Now update catalog.js to include these modules.
let catalog = fs.readFileSync(CATALOG, 'utf8');

// We need to inject the imports
const importsToInject = \`
import { mathematicsGrade4Modules } from '../../content/mathematics/grade-4/modules.js';
import { mathematicsGrade5Modules } from '../../content/mathematics/grade-5/modules.js';
import { mathematicsGrade6Modules } from '../../content/mathematics/grade-6/modules.js';

import { frenchGrade4Modules } from '../../content/french/grade-4/modules.js';
import { frenchGrade5Modules } from '../../content/french/grade-5/modules.js';
import { frenchGrade6Modules } from '../../content/french/grade-6/modules.js';

import { dutchGrade4Modules } from '../../content/dutch/grade-4/modules.js';
import { dutchGrade5Modules } from '../../content/dutch/grade-5/modules.js';
import { dutchGrade6Modules } from '../../content/dutch/grade-6/modules.js';

import { englishGrade4Modules } from '../../content/english/grade-4/modules.js';
import { englishGrade5Modules } from '../../content/english/grade-5/modules.js';
import { englishGrade6Modules } from '../../content/english/grade-6/modules.js';

import { spanishGrade4Modules } from '../../content/spanish/grade-4/modules.js';
import { spanishGrade5Modules } from '../../content/spanish/grade-5/modules.js';
import { spanishGrade6Modules } from '../../content/spanish/grade-6/modules.js';

import { reasoningGrade4Modules } from '../../content/reasoning/grade-4/modules.js';
import { reasoningGrade5Modules } from '../../content/reasoning/grade-5/modules.js';
import { reasoningGrade6Modules } from '../../content/reasoning/grade-6/modules.js';
\`;

function insertAfterLastImport(source, injection) {
  const lines = source.split('\\n');
  let lastImportIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) {
      lastImportIdx = i;
    }
  }
  lines.splice(lastImportIdx + 1, 0, injection);
  return lines.join('\\n');
}

catalog = insertAfterLastImport(catalog, importsToInject);

// And we need to inject them into the \`export const modules\` array.
const additions = \`
  ...mathematicsGrade4Modules,
  ...mathematicsGrade5Modules,
  ...mathematicsGrade6Modules,
  ...frenchGrade4Modules,  
  ...frenchGrade5Modules,
  ...frenchGrade6Modules,
  ...dutchGrade4Modules,
  ...dutchGrade5Modules,
  ...dutchGrade6Modules,
  ...englishGrade4Modules,
  ...englishGrade5Modules,
  ...englishGrade6Modules,
  ...spanishGrade4Modules,
  ...spanishGrade5Modules,
  ...spanishGrade6Modules,
  ...reasoningGrade4Modules,
  ...reasoningGrade5Modules,
  ...reasoningGrade6Modules,
\`;

catalog = catalog.replace('export const modules = [', 'export const modules = [' + additions);

fs.writeFileSync(CATALOG, catalog);
console.log('Catalog updated successfully!');
