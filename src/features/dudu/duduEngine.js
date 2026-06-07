// Generate a subtraction-with-borrowing problem
// borrowing = top units digit < bottom units digit
export function needsBorrowing(a, b) {
  return (a % 10) < (b % 10);
}

export function genSubtraction(forceCarry = false) {
  let a, b;
  let attempts = 0;
  do {
    a = 20 + Math.floor(Math.random() * 79); // 20-98
    b = 10 + Math.floor(Math.random() * (a - 11)); // b < a, b >= 10
    attempts++;
  } while (forceCarry && !needsBorrowing(a, b) && attempts < 100);
  return { a, b, result: a - b, borrow: needsBorrowing(a, b) };
}

export function decomposeNumber(n) {
  return { tens: Math.floor(n / 10), units: n % 10 };
}

// Explain borrowing step by step
export function explainBorrowing(a, b) {
  const aD = decomposeNumber(a);
  const bD = decomposeNumber(b);
  const needsBorrow = aD.units < bD.units;
  if (needsBorrow) {
    return {
      step1: { aUnits: aD.units, bUnits: bD.units, canSubtract: false },
      step2: { newATens: aD.tens - 1, newAUnits: aD.units + 10 },
      step3: { unitsResult: (aD.units + 10) - bD.units },
      step4: { tensResult: (aD.tens - 1) - bD.tens },
      result: a - b,
    };
  }
  return {
    step1: { aUnits: aD.units, bUnits: bD.units, canSubtract: true },
    step2: null,
    step3: { unitsResult: aD.units - bD.units },
    step4: { tensResult: aD.tens - bD.tens },
    result: a - b,
  };
}

// Level configs
export const LEVELS = [
  { id: 1,  label: 'Niveau 1',  desc: 'Soustractions simples',    color: '#22c55e', forceCarry: false, range: [20, 50] },
  { id: 2,  label: 'Niveau 2',  desc: 'Melange simple',           color: '#4ade80', forceCarry: false, range: [20, 60] },
  { id: 3,  label: 'Niveau 3',  desc: 'Passage facile',           color: '#facc15', forceCarry: true,  range: [20, 60] },
  { id: 4,  label: 'Niveau 4',  desc: 'Passage frequent',         color: '#fb923c', forceCarry: true,  range: [20, 70] },
  { id: 5,  label: 'Niveau 5',  desc: 'Passage systematique',     color: '#f97316', forceCarry: true,  range: [30, 90] },
  { id: 6,  label: 'Niveau 6',  desc: 'Melanges rapides',         color: '#ef4444', forceCarry: false, range: [20, 99] },
  { id: 7,  label: 'Niveau 7',  desc: 'Calcul mental',            color: '#dc2626', forceCarry: true,  range: [30, 99] },
  { id: 8,  label: 'Niveau 8',  desc: 'Problemes ecrits',         color: '#9333ea', forceCarry: true,  range: [30, 99] },
  { id: 9,  label: 'Niveau 9',  desc: 'Problemes complexes',      color: '#7c3aed', forceCarry: true,  range: [40, 99] },
  { id: 10, label: 'Niveau 10', desc: 'Master DUDU !',            color: '#6366f1', forceCarry: true,  range: [20, 99] },
];

// Badge system
export const BADGES = [
  { id: 'petit-dudu', label: 'Petit DUDU',  emoji: '🌱', threshold: 5   },
  { id: 'bronze',     label: 'DUDU Bronze', emoji: '🥉', threshold: 20  },
  { id: 'argent',     label: 'DUDU Argent', emoji: '🥈', threshold: 50  },
  { id: 'or',         label: 'DUDU Or',     emoji: '🥇', threshold: 100 },
  { id: 'super',      label: 'Super DUDU',  emoji: '🏆', threshold: 200 },
  { id: 'maitre',     label: 'Maitre DUDU', emoji: '💎', threshold: 500 },
];

// Word problem templates (10 themes, 30+ templates)
export const PROBLEM_TEMPLATES = [
  // ecole
  { theme: 'ecole',    template: 'Il y avait {a} livres dans la bibliotheque. On en a enleve {b}. Combien reste-t-il de livres ?',         emoji: '📚' },
  { theme: 'ecole',    template: 'La maitresse avait {a} crayons. Elle en a distribue {b}. Combien lui en reste-t-il ?',                    emoji: '✏️' },
  { theme: 'ecole',    template: 'Il y a {a} eleves dans l\'ecole. {b} sont partis en voyage. Combien restent-ils ?',                       emoji: '🏫' },
  { theme: 'ecole',    template: 'Lucie avait {a} autocollants. Elle en a donne {b} a ses amis. Combien lui en reste-t-il ?',               emoji: '⭐' },
  // animaux
  { theme: 'animaux',  template: 'Il y avait {a} oiseaux sur l\'arbre. {b} se sont envoles. Combien en reste-t-il ?',                       emoji: '🐦' },
  { theme: 'animaux',  template: 'La ferme avait {a} poules. {b} se sont echappees. Combien en reste-t-il ?',                               emoji: '🐔' },
  { theme: 'animaux',  template: 'Il y avait {a} poissons dans l\'aquarium. {b} ont ete vendus. Combien reste-t-il de poissons ?',          emoji: '🐟' },
  { theme: 'animaux',  template: 'Un berger avait {a} moutons. {b} se sont perdus dans la foret. Combien en reste-t-il ?',                  emoji: '🐑' },
  // jouets
  { theme: 'jouets',   template: 'Tom avait {a} billes. Il en a perdu {b}. Combien lui en reste-t-il ?',                                   emoji: '🔮' },
  { theme: 'jouets',   template: 'Emma avait {a} peluches. Elle en a donne {b} a sa cousine. Combien lui en reste-t-il ?',                  emoji: '🧸' },
  { theme: 'jouets',   template: 'Il y avait {a} Legos dans la boite. {b} ont ete perdus. Combien en reste-t-il ?',                        emoji: '🧱' },
  // pokemon
  { theme: 'pokemon',  template: 'Sacha avait {a} cartes Pokemon. Il en a echange {b}. Combien lui en reste-t-il ?',                        emoji: '🎴' },
  { theme: 'pokemon',  template: 'Lucas avait {a} badges. Il en a offert {b}. Combien lui en reste-t-il ?',                                emoji: '🏅' },
  // nourriture
  { theme: 'nourriture', template: 'La boulangerie avait {a} pains. Elle en a vendu {b}. Combien en reste-t-il ?',                         emoji: '🍞' },
  { theme: 'nourriture', template: 'Il y avait {a} bonbons dans le sachet. On en a mange {b}. Combien en reste-t-il ?',                    emoji: '🍬' },
  { theme: 'nourriture', template: 'La fermiere avait cueilli {a} pommes. Elle en a vendues {b}. Combien lui en reste-t-il ?',             emoji: '🍎' },
  // sport
  { theme: 'sport',    template: 'L\'equipe avait {a} points. Elle en a perdu {b}. Combien de points a-t-elle maintenant ?',               emoji: '⚽' },
  { theme: 'sport',    template: 'Le coureur devait faire {a} km. Il en a deja couru {b}. Combien lui reste-t-il ?',                       emoji: '🏃' },
  // espace
  { theme: 'espace',   template: 'La fusee avait {a} fusees de secours. Elle en a utilise {b}. Combien lui en reste-t-il ?',               emoji: '🚀' },
  { theme: 'espace',   template: 'L\'astronaute avait {a} reserves d\'oxygene. Il en a consomme {b}. Combien lui en reste-t-il ?',         emoji: '👨‍🚀' },
  // pirates
  { theme: 'pirates',  template: 'Le pirate avait {a} pieces d\'or. Il en a depense {b}. Combien lui en reste-t-il ?',                     emoji: '🏴‍☠️' },
  { theme: 'pirates',  template: 'Le coffre contenait {a} bijoux. Les pirates en ont pris {b}. Combien en reste-t-il ?',                   emoji: '💎' },
  // dinosaures
  { theme: 'dino',     template: 'Le musee avait {a} os de dinosaures. {b} ont ete casses. Combien en reste-t-il ?',                       emoji: '🦕' },
  // magie
  { theme: 'magie',    template: 'La sorciere avait {a} potions. Elle en a utilise {b} pour ses sorts. Combien lui en reste-t-il ?',       emoji: '🧪' },
  { theme: 'magie',    template: 'Le magicien avait {a} baguettes magiques. Il en a offert {b}. Combien lui en reste-t-il ?',              emoji: '🪄' },
];

export function generateProblem(forceCarry = true) {
  const tmpl = PROBLEM_TEMPLATES[Math.floor(Math.random() * PROBLEM_TEMPLATES.length)];
  const eq = genSubtraction(forceCarry);
  const text = tmpl.template.replace('{a}', eq.a).replace('{b}', eq.b);
  return { ...eq, text, emoji: tmpl.emoji, theme: tmpl.theme };
}

// Hardcoded exercises from the pedagogical sheet
export const GUIDED_EXERCISES = [
  { a: 44, b: 27 }, { a: 55, b: 28 }, { a: 32, b: 27 }, { a: 68, b: 19 },
  { a: 54, b: 26 }, { a: 84, b: 49 }, { a: 63, b: 57 }, { a: 31, b: 18 },
  { a: 91, b: 64 }, { a: 84, b: 19 }, { a: 63, b: 18 }, { a: 42, b: 25 },
  { a: 28, b: 19 }, { a: 94, b: 56 }, { a: 62, b: 38 }, { a: 81, b: 29 },
  { a: 85, b: 37 }, { a: 56, b: 29 }, { a: 45, b: 18 }, { a: 93, b: 65 },
  { a: 38, b: 19 },
].map(e => ({ ...e, result: e.a - e.b, borrow: needsBorrowing(e.a, e.b) }));
