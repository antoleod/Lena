const SKILL_BIAS_BY_SECTION = Object.freeze({
  formes: 'formes',
  couleurs: 'couleurs',
  tracer: 'tracing',
  logique: 'observation',
  calcul: 'tables',
  lecture: 'lecture',
  observer: 'observation',
  ecoute: 'ecoute'
});

function normalizeSnapshot(snapshot = {}) {
  const mastery = snapshot.mastery || {};
  return {
    mastery: {
      unseen: Number(mastery.unseen || 0),
      failed: Number(mastery.failed || 0),
      shaky: Number(mastery.shaky || 0),
      mastered: Number(mastery.mastered || 0)
    },
    meta: snapshot.meta || {}
  };
}

export function planNextSession({ sectionId, snapshot } = {}) {
  const safeSectionId = String(sectionId || '').trim();
  const { mastery, meta } = normalizeSnapshot(snapshot);

  const fatigue = mastery.failed + mastery.shaky;
  const mastered = mastery.mastered;
  const total = mastery.unseen + fatigue + mastered || 1;

  // Se considera “dominante” solo cuando une seule tendencia dépasse vraiment l autre.
  // Cela évite de classer “steady” comme “down” dans des cas équilibrés.
  const masteryDominant = mastered / total >= 0.6;
  const fatigueDominant = fatigue / total >= 0.6;

  const difficultyBias = masteryDominant && !fatigueDominant ? 'up' : fatigueDominant ? 'down' : 'steady';

  const streakCurrent = Number(meta.streakCurrent || 0);
  const exerciseCount =
    fatigueDominant || streakCurrent >= 4 ? 4
      : masteryDominant ? 6
      : 5;

  // Slots are not directly consumed by lessonComposer today,
  // but the contract expects them for future integration.
  const slots = difficultyBias === 'down' ? ['opener', 'practice'] : difficultyBias === 'up' ? ['opener', 'practice', 'challenge'] : ['opener', 'practice', 'variation'];

  const skillBias = SKILL_BIAS_BY_SECTION[safeSectionId] || SKILL_BIAS_BY_SECTION.formes;

  return {
    exerciseCount,
    difficultyBias,
    skillBias,
    slots
  };
}

