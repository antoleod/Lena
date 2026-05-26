export const renforcementSections = Object.freeze([
  {
    id: 'formes',
    title: 'Formes',
    description: 'Reconnaitre des figures et observer leurs elements.',
    icon: '🔷',
    topics: ['shapes'],
    skillTags: ['formes', 'geometrie'],
    activityId: 'renforcement-formes'
  },
  {
    id: 'couleurs',
    title: 'Couleurs',
    description: 'Observer, associer et choisir des couleurs en douceur.',
    icon: '🎨',
    topics: ['colors'],
    skillTags: ['couleurs', 'observation'],
    activityId: 'renforcement-couleurs'
  },
  {
    id: 'tracer',
    title: 'Tracer',
    description: 'Suivre une ligne et tracer calmement.',
    icon: '✏️',
    topics: ['tracing'],
    skillTags: ['tracer', 'motricite'],
    activityId: 'renforcement-tracer'
  },
  {
    id: 'logique',
    title: 'Logique',
    description: 'Trouver des suites et des liens visuels.',
    icon: '🧩',
    topics: ['observation'],
    skillTags: ['logique', 'observation'],
    activityId: 'renforcement-logique'
  },
  {
    id: 'calcul',
    title: 'Calcul',
    description: 'Compter et faire de petits calculs.',
    icon: '🧮',
    topics: ['tables'],
    skillTags: ['calcul', 'tables'],
    activityId: 'renforcement-calcul'
  },
  {
    id: 'lecture',
    title: 'Lecture',
    description: 'Lire, observer et comprendre des consignes simples.',
    icon: '📖',
    topics: [],
    skillTags: ['lecture'],
    activityId: 'renforcement-lecture'
  },
  {
    id: 'observer',
    title: 'Observer',
    description: 'Regarder attentivement et repérer des details.',
    icon: '🔎',
    topics: ['observation'],
    skillTags: ['observer', 'attention'],
    activityId: 'renforcement-observer'
  },
  {
    id: 'ecoute',
    title: 'Ecoute',
    description: 'Ecouter une consigne et repondre tranquillement.',
    icon: '🔊',
    topics: [],
    skillTags: ['ecoute'],
    activityId: 'renforcement-ecoute'
  }
]);

export const renforcementSectionById = Object.freeze(
  renforcementSections.reduce((accumulator, section) => {
    accumulator[section.id] = section;
    return accumulator;
  }, {})
);

export function getRenforcementSection(sectionId) {
  return renforcementSectionById[String(sectionId || '')] || null;
}

