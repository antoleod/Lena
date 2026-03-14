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
  assert.ok(grade3.includes('Consolider les tables 2 a 5'));
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

test('P2 and P3 focus subjects do not leave hidden standalone activities outside visible module journeys', () => {
  ['mathematics', 'french', 'dutch', 'english', 'spanish', 'reasoning', 'stories'].forEach((subjectId) => {
    ['P2', 'P3'].forEach((gradeId) => {
      const journey = getGradeJourney(subjectId, gradeId);
      const moduleIds = new Set(journey.moduleJourneys.flatMap((entry) => entry.activities.map((activity) => activity.id)));
      const hidden = journey.standaloneActivities.filter((activity) => !moduleIds.has(activity.id)).map((activity) => activity.id);
      assert.deepEqual(hidden, [], `${subjectId} ${gradeId} still hides standalone activities: ${hidden.join(', ')}`);
    });
  });
});
