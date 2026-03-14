import test from 'node:test';
import assert from 'node:assert/strict';

import { getModulesBySubjectAndGrade } from '../src/features/curriculum/catalog.js';
import { getGradeJourney } from '../src/shared/gameplay/moduleJourney.js';

test('mathematics P2 and P3 expose multiplication and division modules in the catalog', () => {
  const grade2 = getModulesBySubjectAndGrade('mathematics', 'P2').map((module) => module.title);
  const grade3 = getModulesBySubjectAndGrade('mathematics', 'P3').map((module) => module.title);

  assert.ok(grade2.includes('Groupes egaux et partages simples'));
  assert.ok(grade3.includes('Tables et paquets egaux'));
  assert.ok(grade3.includes('Partager, verifier et relier aux tables'));
});

test('french P2 and P3 expose vocabulary, sentence, reading, conjugation and stories modules', () => {
  const grade2 = getModulesBySubjectAndGrade('french', 'P2').map((module) => module.title);
  const grade3 = getModulesBySubjectAndGrade('french', 'P3').map((module) => module.title);

  assert.ok(grade2.includes('Mot, image et categorie'));
  assert.ok(grade2.includes('Construire et completer une phrase'));
  assert.ok(grade2.includes('Lecture guidee et comprehension de base'));
  assert.ok(grade2.includes('Petites histoires a lire'));

  assert.ok(grade3.includes('Textes courts et informations utiles'));
  assert.ok(grade3.includes('Phrase correcte, ordre et structure'));
  assert.ok(grade3.includes('Les 20 verbes les plus utiles'));
  assert.ok(grade3.includes('Contes courts et questions'));
});

test('visible standalone activities remain explicitly reachable in grade journeys', () => {
  const mathP2 = getGradeJourney('mathematics', 'P2');
  const mathP2ModuleIds = new Set(mathP2.moduleJourneys.flatMap((journey) => journey.activities.map((activity) => activity.id)));
  const mathP2Bonus = mathP2.standaloneActivities.filter((activity) => !mathP2ModuleIds.has(activity.id)).map((activity) => activity.id);

  assert.deepEqual(mathP2Bonus, []);

  const mathP3 = getGradeJourney('mathematics', 'P3');
  const mathP3ModuleIds = new Set(mathP3.moduleJourneys.flatMap((journey) => journey.activities.map((activity) => activity.id)));
  const mathP3Bonus = mathP3.standaloneActivities.filter((activity) => !mathP3ModuleIds.has(activity.id)).map((activity) => activity.id);

  assert.ok(mathP3Bonus.includes('multiplication-table-5'));
  assert.ok(mathP3Bonus.includes('division-table-5'));
});
