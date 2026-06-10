// Each subject is a universe with its own sky, atmosphere and grade-worlds
export const SUBJECT_UNIVERSES = {
  mathematics: {
    icon: '🔢',
    name: 'Universo Matemático',
    skyTop: '#0f0c29',
    skyBottom: '#302b63',
    accent: '#667eea',
    accentShadow: '#4530c4',
    accentBg: 'linear-gradient(145deg,#b3b8f7,#667eea)',
    particle: '✦',
    // Each grade is a planet/world inside this universe
    gradeWorlds: {
      P2: { name: 'Planeta Números',    emoji: '🌱', color: '#5bc87a', shadow: '#3a9a59', bg: 'linear-gradient(145deg,#a8f0c0,#5bc87a)', sky: 'linear-gradient(180deg,#0a2a0f 0%,#1a5c28 60%,#2d8a3e 100%)' },
      P3: { name: 'Mundo Cálculo',      emoji: '🔥', color: '#ff7e3e', shadow: '#c44f10', bg: 'linear-gradient(145deg,#ffcba8,#ff7e3e)', sky: 'linear-gradient(180deg,#2a0f00 0%,#5c2010 60%,#8a3820 100%)' },
      P4: { name: 'Reino Álgebra',      emoji: '⚡', color: '#ffc34a', shadow: '#cc8c00', bg: 'linear-gradient(145deg,#ffe9a3,#ffc34a)', sky: 'linear-gradient(180deg,#1a1500 0%,#3d3000 60%,#665200 100%)' },
      P5: { name: 'Nebulosa Fracciones',emoji: '💠', color: '#40d4e8', shadow: '#009fba', bg: 'linear-gradient(145deg,#aaeffa,#40d4e8)', sky: 'linear-gradient(180deg,#001a1f 0%,#004a5a 60%,#007a90 100%)' },
      P6: { name: 'Galaxia Élite',      emoji: '👑', color: '#ffe24f', shadow: '#b89500', bg: 'linear-gradient(145deg,#fff4a0,#ffe24f)', sky: 'linear-gradient(180deg,#1a1400 0%,#3d3200 60%,#665600 100%)' },
    },
  },
  french: {
    icon: '✍️',
    name: 'Univers Français',
    skyTop: '#1a0530',
    skyBottom: '#4a1050',
    accent: '#f56ca8',
    accentShadow: '#c43a78',
    accentBg: 'linear-gradient(145deg,#ffc2de,#f56ca8)',
    particle: '❋',
    gradeWorlds: {
      P2: { name: 'Île des Mots',        emoji: '🌸', color: '#ff85a1', shadow: '#c9456b', bg: 'linear-gradient(145deg,#ffc7d5,#ff85a1)', sky: 'linear-gradient(180deg,#1a0020 0%,#4a0040 60%,#7a1060 100%)' },
      P3: { name: 'Forêt des Phrases',   emoji: '🍀', color: '#5bc87a', shadow: '#3a9a59', bg: 'linear-gradient(145deg,#a8f0c0,#5bc87a)', sky: 'linear-gradient(180deg,#001a08 0%,#004a18 60%,#007a28 100%)' },
      P4: { name: 'Château Grammaire',   emoji: '🧙', color: '#8b5cf6', shadow: '#5b21b6', bg: 'linear-gradient(145deg,#c4b5fd,#8b5cf6)', sky: 'linear-gradient(180deg,#0d0020 0%,#2a0060 60%,#4a10a0 100%)' },
      P5: { name: 'Cité Lecture',        emoji: '🌊', color: '#4aa8f2', shadow: '#2878c4', bg: 'linear-gradient(145deg,#a3d8ff,#4aa8f2)', sky: 'linear-gradient(180deg,#001020 0%,#003060 60%,#0060a0 100%)' },
      P6: { name: 'Sommet Éloquence',    emoji: '⭐', color: '#ffe24f', shadow: '#b89500', bg: 'linear-gradient(145deg,#fff4a0,#ffe24f)', sky: 'linear-gradient(180deg,#1a1400 0%,#3d3000 60%,#665000 100%)' },
    },
  },
  dutch: {
    icon: '🗣️',
    name: 'Nederlands Universum',
    skyTop: '#001a2a',
    skyBottom: '#003a5a',
    accent: '#4aa8f2',
    accentShadow: '#2878c4',
    accentBg: 'linear-gradient(145deg,#a3d8ff,#4aa8f2)',
    particle: '◈',
    gradeWorlds: {
      P2: { name: 'Woordeneiland',      emoji: '🐚', color: '#40d4e8', shadow: '#009fba', bg: 'linear-gradient(145deg,#aaeffa,#40d4e8)', sky: 'linear-gradient(180deg,#001520 0%,#004060 60%,#007090 100%)' },
      P3: { name: 'Zinnenstad',         emoji: '🏙️', color: '#4aa8f2', shadow: '#2878c4', bg: 'linear-gradient(145deg,#a3d8ff,#4aa8f2)', sky: 'linear-gradient(180deg,#000f20 0%,#003060 60%,#0060a0 100%)' },
      P4: { name: 'Leespaleis',         emoji: '📖', color: '#a87cf9', shadow: '#7044d4', bg: 'linear-gradient(145deg,#d5b8ff,#a87cf9)', sky: 'linear-gradient(180deg,#0d001a 0%,#300060 60%,#5010a0 100%)' },
      P5: { name: 'Schrijverbos',       emoji: '🌿', color: '#5bc87a', shadow: '#3a9a59', bg: 'linear-gradient(145deg,#a8f0c0,#5bc87a)', sky: 'linear-gradient(180deg,#001508 0%,#004020 60%,#007038 100%)' },
      P6: { name: 'Taalberg',           emoji: '🏔️', color: '#94a3b8', shadow: '#475569', bg: 'linear-gradient(145deg,#e2e8f0,#94a3b8)', sky: 'linear-gradient(180deg,#0a0f18 0%,#1e2a40 60%,#344060 100%)' },
    },
  },
  english: {
    icon: '🌍',
    name: 'English Universe',
    skyTop: '#001a10',
    skyBottom: '#003a20',
    accent: '#43c97b',
    accentShadow: '#1d9454',
    accentBg: 'linear-gradient(145deg,#a3f0c8,#43c97b)',
    particle: '✿',
    gradeWorlds: {
      P2: { name: 'Word Island',         emoji: '🦜', color: '#43c97b', shadow: '#1d9454', bg: 'linear-gradient(145deg,#a3f0c8,#43c97b)', sky: 'linear-gradient(180deg,#001508 0%,#004020 60%,#007038 100%)' },
      P3: { name: 'Story Forest',        emoji: '📚', color: '#ffc34a', shadow: '#cc8c00', bg: 'linear-gradient(145deg,#ffe9a3,#ffc34a)', sky: 'linear-gradient(180deg,#1a1200 0%,#3d2e00 60%,#665000 100%)' },
      P4: { name: 'Grammar Castle',      emoji: '🏰', color: '#f56ca8', shadow: '#c43a78', bg: 'linear-gradient(145deg,#ffc2de,#f56ca8)', sky: 'linear-gradient(180deg,#1a0020 0%,#4a0040 60%,#7a1060 100%)' },
      P5: { name: 'Reading Ocean',       emoji: '🌊', color: '#4aa8f2', shadow: '#2878c4', bg: 'linear-gradient(145deg,#a3d8ff,#4aa8f2)', sky: 'linear-gradient(180deg,#001020 0%,#003060 60%,#0060a0 100%)' },
      P6: { name: 'Expression Peak',     emoji: '🦅', color: '#a87cf9', shadow: '#7044d4', bg: 'linear-gradient(145deg,#d5b8ff,#a87cf9)', sky: 'linear-gradient(180deg,#0d001a 0%,#2a0060 60%,#4a10a0 100%)' },
    },
  },
  spanish: {
    icon: '🌞',
    name: 'Universo Español',
    skyTop: '#2a0800',
    skyBottom: '#5a1800',
    accent: '#fa8c38',
    accentShadow: '#c45810',
    accentBg: 'linear-gradient(145deg,#ffd4a3,#fa8c38)',
    particle: '✵',
    gradeWorlds: {
      P2: { name: 'Isla Palabras',       emoji: '🌴', color: '#fa8c38', shadow: '#c45810', bg: 'linear-gradient(145deg,#ffd4a3,#fa8c38)', sky: 'linear-gradient(180deg,#200800 0%,#602000 60%,#903800 100%)' },
      P3: { name: 'Valle Frases',        emoji: '🌺', color: '#f56ca8', shadow: '#c43a78', bg: 'linear-gradient(145deg,#ffc2de,#f56ca8)', sky: 'linear-gradient(180deg,#1a0020 0%,#4a0040 60%,#7a1060 100%)' },
      P4: { name: 'Bosque Lectura',      emoji: '🌿', color: '#5bc87a', shadow: '#3a9a59', bg: 'linear-gradient(145deg,#a8f0c0,#5bc87a)', sky: 'linear-gradient(180deg,#001508 0%,#004020 60%,#007038 100%)' },
      P5: { name: 'Ciudad Gramática',    emoji: '🏙️', color: '#4aa8f2', shadow: '#2878c4', bg: 'linear-gradient(145deg,#a3d8ff,#4aa8f2)', sky: 'linear-gradient(180deg,#001020 0%,#003060 60%,#0060a0 100%)' },
      P6: { name: 'Cima Expresión',      emoji: '🦅', color: '#ffe24f', shadow: '#b89500', bg: 'linear-gradient(145deg,#fff4a0,#ffe24f)', sky: 'linear-gradient(180deg,#1a1400 0%,#3d3000 60%,#665000 100%)' },
    },
  },
  reasoning: {
    icon: '🧩',
    name: 'Universo Lógica',
    skyTop: '#0d0020',
    skyBottom: '#2a0060',
    accent: '#a87cf9',
    accentShadow: '#7044d4',
    accentBg: 'linear-gradient(145deg,#d5b8ff,#a87cf9)',
    particle: '◇',
    gradeWorlds: {
      P2: { name: 'Laberinto Patrones',  emoji: '🔮', color: '#a87cf9', shadow: '#7044d4', bg: 'linear-gradient(145deg,#d5b8ff,#a87cf9)', sky: 'linear-gradient(180deg,#0d001a 0%,#2a0060 60%,#4a10a0 100%)' },
      P3: { name: 'Torre Secuencias',    emoji: '⚡', color: '#ffc34a', shadow: '#cc8c00', bg: 'linear-gradient(145deg,#ffe9a3,#ffc34a)', sky: 'linear-gradient(180deg,#1a1000 0%,#3d2800 60%,#664800 100%)' },
      P4: { name: 'Caverna Estrategia',  emoji: '🧠', color: '#40d4e8', shadow: '#009fba', bg: 'linear-gradient(145deg,#aaeffa,#40d4e8)', sky: 'linear-gradient(180deg,#001520 0%,#004060 60%,#007090 100%)' },
      P5: { name: 'Nebulosa Deducción',  emoji: '🌌', color: '#6366f1', shadow: '#3730a3', bg: 'linear-gradient(145deg,#c7d2fe,#6366f1)', sky: 'linear-gradient(180deg,#000820 0%,#002060 60%,#0040a0 100%)' },
      P6: { name: 'Cima del Genio',      emoji: '🏆', color: '#ef4444', shadow: '#991b1b', bg: 'linear-gradient(145deg,#fca5a5,#ef4444)', sky: 'linear-gradient(180deg,#200000 0%,#600000 60%,#a00000 100%)' },
    },
  },
  stories: {
    icon: '📖',
    name: 'Univers des Récits',
    skyTop: '#1a0a00',
    skyBottom: '#3a1a00',
    accent: '#fc9d6b',
    accentShadow: '#c45d30',
    accentBg: 'linear-gradient(145deg,#ffd4b8,#fc9d6b)',
    particle: '❧',
    gradeWorlds: {
      P2: { name: 'Île aux Histoires',   emoji: '📜', color: '#fc9d6b', shadow: '#c45d30', bg: 'linear-gradient(145deg,#ffd4b8,#fc9d6b)', sky: 'linear-gradient(180deg,#1a0800 0%,#4a1800 60%,#7a3000 100%)' },
      P3: { name: 'Forêt des Contes',    emoji: '🌙', color: '#6366f1', shadow: '#3730a3', bg: 'linear-gradient(145deg,#c7d2fe,#6366f1)', sky: 'linear-gradient(180deg,#000820 0%,#002060 60%,#0040a0 100%)' },
    },
  },
  sciences: {
    icon: '🔬',
    name: 'Univers Scientifique',
    skyTop: '#052e16',
    skyBottom: '#14532d',
    accent: '#22c55e',
    accentShadow: '#15803d',
    accentBg: 'linear-gradient(145deg,#bbf7d0,#22c55e)',
    particle: '⚗',
    gradeWorlds: {
      P2: { name: 'Jardin des Sens',       emoji: '🌱', color: '#22c55e', shadow: '#15803d', bg: 'linear-gradient(145deg,#bbf7d0,#22c55e)', sky: 'linear-gradient(180deg,#052e16 0%,#14532d 60%,#166534 100%)' },
      P3: { name: 'Lac des Experiences',   emoji: '💧', color: '#06b6d4', shadow: '#0e7490', bg: 'linear-gradient(145deg,#a5f3fc,#06b6d4)', sky: 'linear-gradient(180deg,#001a1f 0%,#004a5a 60%,#007a90 100%)' },
      P4: { name: 'Labo des Etats',        emoji: '🧪', color: '#a855f7', shadow: '#7e22ce', bg: 'linear-gradient(145deg,#e9d5ff,#a855f7)', sky: 'linear-gradient(180deg,#1a0040 0%,#4a0090 60%,#7000c0 100%)' },
      P5: { name: 'Pic des Forces',        emoji: '⚡', color: '#f59e0b', shadow: '#b45309', bg: 'linear-gradient(145deg,#fde68a,#f59e0b)', sky: 'linear-gradient(180deg,#1a1000 0%,#3d2800 60%,#664800 100%)' },
      P6: { name: 'Planete Energie',       emoji: '🌍', color: '#10b981', shadow: '#065f46', bg: 'linear-gradient(145deg,#a7f3d0,#10b981)', sky: 'linear-gradient(180deg,#001a10 0%,#004a30 60%,#007a50 100%)' },
    },
  },
  histoire: {
    icon: '🏛️',
    name: 'Univers Histoire',
    skyTop: '#1c0a00',
    skyBottom: '#431407',
    accent: '#f59e0b',
    accentShadow: '#b45309',
    accentBg: 'linear-gradient(145deg,#fde68a,#f59e0b)',
    particle: '⚔',
    gradeWorlds: {
      P2: { name: 'Village Belge',         emoji: '🇧🇪', color: '#f59e0b', shadow: '#b45309', bg: 'linear-gradient(145deg,#fde68a,#f59e0b)', sky: 'linear-gradient(180deg,#1c0a00 0%,#431407 60%,#6a2010 100%)' },
      P3: { name: 'Carte d\'Europe',       emoji: '🗺️', color: '#3b82f6', shadow: '#1d4ed8', bg: 'linear-gradient(145deg,#bfdbfe,#3b82f6)', sky: 'linear-gradient(180deg,#00061a 0%,#001a4a 60%,#003080 100%)' },
      P4: { name: 'Chateau Medieval',      emoji: '🏰', color: '#8b5cf6', shadow: '#5b21b6', bg: 'linear-gradient(145deg,#ddd6fe,#8b5cf6)', sky: 'linear-gradient(180deg,#0a0020 0%,#200060 60%,#3800a0 100%)' },
      P5: { name: 'Caravelle des Decouvertes', emoji: '⛵', color: '#06b6d4', shadow: '#0e7490', bg: 'linear-gradient(145deg,#a5f3fc,#06b6d4)', sky: 'linear-gradient(180deg,#001520 0%,#004060 60%,#007090 100%)' },
      P6: { name: 'Forum Democratique',    emoji: '🏛️', color: '#ef4444', shadow: '#991b1b', bg: 'linear-gradient(145deg,#fca5a5,#ef4444)', sky: 'linear-gradient(180deg,#200000 0%,#600000 60%,#a00000 100%)' },
    },
  },
  logique: {
    icon: '🧠',
    name: 'Univers Logique',
    skyTop: '#1e1b4b',
    skyBottom: '#3730a3',
    accent: '#6366f1',
    accentShadow: '#3730a3',
    accentBg: 'linear-gradient(145deg,#c7d2fe,#6366f1)',
    particle: '🧠',
    gradeWorlds: {
      P2: { name: 'Île des Suites',        emoji: '🔢', color: '#6366f1', shadow: '#3730a3', bg: 'linear-gradient(145deg,#c7d2fe,#6366f1)', sky: 'linear-gradient(180deg,#1e1b4b 0%,#3730a3 60%,#4338ca 100%)' },
      P3: { name: 'Forêt des Intrus',      emoji: '🔍', color: '#8b5cf6', shadow: '#5b21b6', bg: 'linear-gradient(145deg,#ddd6fe,#8b5cf6)', sky: 'linear-gradient(180deg,#1e0040 0%,#4c1d95 60%,#6d28d9 100%)' },
      P4: { name: 'Château des Formes',    emoji: '🔷', color: '#a78bfa', shadow: '#7c3aed', bg: 'linear-gradient(145deg,#ede9fe,#a78bfa)', sky: 'linear-gradient(180deg,#0d001a 0%,#2e1065 60%,#4c1d95 100%)' },
      P5: { name: 'Nébuleuse Déduction',   emoji: '🧩', color: '#7c3aed', shadow: '#4c1d95', bg: 'linear-gradient(145deg,#ddd6fe,#7c3aed)', sky: 'linear-gradient(180deg,#0a0020 0%,#1e0060 60%,#3700a0 100%)' },
      P6: { name: 'Sommet du Génie',       emoji: '🏆', color: '#4f46e5', shadow: '#3730a3', bg: 'linear-gradient(145deg,#c7d2fe,#4f46e5)', sky: 'linear-gradient(180deg,#010130 0%,#1e1b4b 60%,#3730a3 100%)' },
    },
  },
  finance: {
    icon: '💰',
    name: 'Univers Finance',
    skyTop: '#064e3b',
    skyBottom: '#065f46',
    accent: '#10b981',
    accentShadow: '#065f46',
    accentBg: 'linear-gradient(145deg,#a7f3d0,#10b981)',
    particle: '💰',
    gradeWorlds: {
      P2: { name: 'Marché des Pièces',     emoji: '🪙', color: '#10b981', shadow: '#065f46', bg: 'linear-gradient(145deg,#a7f3d0,#10b981)', sky: 'linear-gradient(180deg,#064e3b 0%,#065f46 60%,#047857 100%)' },
      P3: { name: 'Boutique des Billets',  emoji: '💵', color: '#f59e0b', shadow: '#b45309', bg: 'linear-gradient(145deg,#fde68a,#f59e0b)', sky: 'linear-gradient(180deg,#1a1000 0%,#451a03 60%,#78350f 100%)' },
      P4: { name: 'Ville des Achats',      emoji: '🛒', color: '#34d399', shadow: '#059669', bg: 'linear-gradient(145deg,#bbf7d0,#34d399)', sky: 'linear-gradient(180deg,#022c22 0%,#064e3b 60%,#065f46 100%)' },
      P5: { name: 'Banque du Savoir',      emoji: '🏦', color: '#fbbf24', shadow: '#d97706', bg: 'linear-gradient(145deg,#fef3c7,#fbbf24)', sky: 'linear-gradient(180deg,#1c1400 0%,#3b2200 60%,#6b3600 100%)' },
      P6: { name: 'Sommet Financier',      emoji: '📊', color: '#6ee7b7', shadow: '#10b981', bg: 'linear-gradient(145deg,#d1fae5,#6ee7b7)', sky: 'linear-gradient(180deg,#032014 0%,#064e3b 60%,#065f46 100%)' },
    },
  },
  informatique: {
    icon: '💻',
    name: 'Univers Informatique',
    skyTop: '#0c1a2e',
    skyBottom: '#0f3460',
    accent: '#0ea5e9',
    accentShadow: '#0369a1',
    accentBg: 'linear-gradient(145deg,#bae6fd,#0ea5e9)',
    particle: '💻',
    gradeWorlds: {
      P2: { name: 'Île de l\'Ordinateur',  emoji: '🖥️', color: '#0ea5e9', shadow: '#0369a1', bg: 'linear-gradient(145deg,#bae6fd,#0ea5e9)', sky: 'linear-gradient(180deg,#0c1a2e 0%,#0f3460 60%,#164e8a 100%)' },
      P3: { name: 'Réseau Internet',       emoji: '🌐', color: '#38bdf8', shadow: '#0284c7', bg: 'linear-gradient(145deg,#e0f2fe,#38bdf8)', sky: 'linear-gradient(180deg,#001a2e 0%,#003a60 60%,#005a90 100%)' },
      P4: { name: 'Forêt des Fichiers',    emoji: '📁', color: '#6366f1', shadow: '#3730a3', bg: 'linear-gradient(145deg,#c7d2fe,#6366f1)', sky: 'linear-gradient(180deg,#0d0020 0%,#2a0060 60%,#4a10a0 100%)' },
      P5: { name: 'Cité des Algorithmes',  emoji: '🤖', color: '#22d3ee', shadow: '#0891b2', bg: 'linear-gradient(145deg,#cffafe,#22d3ee)', sky: 'linear-gradient(180deg,#001520 0%,#004060 60%,#007090 100%)' },
      P6: { name: 'Galaxie du Code',       emoji: '📋', color: '#818cf8', shadow: '#4f46e5', bg: 'linear-gradient(145deg,#e0e7ff,#818cf8)', sky: 'linear-gradient(180deg,#010130 0%,#1e1b4b 60%,#3730a3 100%)' },
    },
  },
};

export function getSubjectUniverse(subjectId) {
  return SUBJECT_UNIVERSES[subjectId] || SUBJECT_UNIVERSES.mathematics;
}

export function getGradeWorld(subjectId, gradeId) {
  const universe = getSubjectUniverse(subjectId);
  return universe.gradeWorlds[gradeId] || {
    name: gradeId,
    emoji: '🌍',
    color: universe.accent,
    shadow: universe.accentShadow,
    bg: universe.accentBg,
    sky: 'linear-gradient(180deg,#1a0533 0%,#2d0f5e 60%,#1a3a6e 100%)',
  };
}

// Domain → unique color so modules look distinct within a grade
const DOMAIN_PALETTE = [
  { color: '#5bc87a', shadow: '#3a9a59', bg: 'linear-gradient(145deg,#a8f0c0,#5bc87a)' },
  { color: '#4aa8f2', shadow: '#2878c4', bg: 'linear-gradient(145deg,#a3d8ff,#4aa8f2)' },
  { color: '#f96bbd', shadow: '#c93d90', bg: 'linear-gradient(145deg,#ffc2e8,#f96bbd)' },
  { color: '#ffc34a', shadow: '#cc8c00', bg: 'linear-gradient(145deg,#ffe9a3,#ffc34a)' },
  { color: '#a87cf9', shadow: '#7044d4', bg: 'linear-gradient(145deg,#d5b8ff,#a87cf9)' },
  { color: '#ff7e3e', shadow: '#c44f10', bg: 'linear-gradient(145deg,#ffcba8,#ff7e3e)' },
  { color: '#40d4e8', shadow: '#009fba', bg: 'linear-gradient(145deg,#aaeffa,#40d4e8)' },
  { color: '#ef4444', shadow: '#991b1b', bg: 'linear-gradient(145deg,#fca5a5,#ef4444)' },
];

export function getDomainTheme(domainId, index = 0) {
  // Hash domain string for deterministic color
  let hash = 0;
  for (const ch of (domainId || '')) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff;
  return DOMAIN_PALETTE[(hash + index) % DOMAIN_PALETTE.length];
}
