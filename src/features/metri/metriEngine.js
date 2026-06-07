export const CATEGORIES = {
  longueur:  { label: 'Longueur',  emoji: '📏', color: '#3b82f6', units: ['mm','cm','m','km'] },
  masse:     { label: 'Masse',     emoji: '⚖️', color: '#8b5cf6', units: ['g','kg'] },
  capacite:  { label: 'Capacite',  emoji: '💧', color: '#06b6d4', units: ['ml','cl','dl','l'] },
  duree:     { label: 'Duree',     emoji: '⏱️', color: '#22c55e', units: ['s','min','h'] },
  cout:      { label: 'Cout',      emoji: '💶', color: '#f59e0b', units: ['c','€'] },
};

// All units with their category and typical context
export const UNITS = [
  { unit: 'mm', cat: 'longueur', example: 'epaisseur d\'une feuille' },
  { unit: 'cm', cat: 'longueur', example: 'largeur d\'un doigt' },
  { unit: 'm',  cat: 'longueur', example: 'hauteur d\'une porte' },
  { unit: 'km', cat: 'longueur', example: 'distance entre deux villes' },
  { unit: 'g',  cat: 'masse',    example: 'masse d\'une gomme' },
  { unit: 'kg', cat: 'masse',    example: 'masse d\'un sac' },
  { unit: 'ml', cat: 'capacite', example: 'une cuillere de sirop' },
  { unit: 'cl', cat: 'capacite', example: 'un verre de jus' },
  { unit: 'dl', cat: 'capacite', example: 'un bol de lait' },
  { unit: 'l',  cat: 'capacite', example: 'une bouteille d\'eau' },
  { unit: 's',  cat: 'duree',    example: 'un clin d\'oeil' },
  { unit: 'min',cat: 'duree',    example: 'une chanson' },
  { unit: 'h',  cat: 'duree',    example: 'un cours a l\'ecole' },
  { unit: 'c',  cat: 'cout',     example: 'un bonbon' },
  { unit: '€',  cat: 'cout',     example: 'un livre' },
];

// Unit hunt: show 4 units, one from target category, 3 from others
export function genUnitHunt(targetCat) {
  const correct = pickRandom(CATEGORIES[targetCat].units);
  const otherCats = Object.keys(CATEGORIES).filter(c => c !== targetCat);
  const distractors = otherCats.slice(0, 3).map(c => pickRandom(CATEGORIES[c].units));
  return {
    question: 'Quelle unite mesure la ' + CATEGORIES[targetCat].label.toLowerCase() + ' ?',
    options: [correct, ...distractors].sort(() => Math.random() - .5),
    correct,
    targetCat,
  };
}

// Category matching: given a quantity+unit, what category is it?
export const QUANTITY_EXAMPLES = [
  { text: '75 metres',       unit: 'm',  cat: 'longueur' },
  { text: '5 euros',         unit: '€',  cat: 'cout' },
  { text: '1 kilogramme',    unit: 'kg', cat: 'masse' },
  { text: '1 litre',         unit: 'l',  cat: 'capacite' },
  { text: '30 secondes',     unit: 's',  cat: 'duree' },
  { text: '3 kilometres',    unit: 'km', cat: 'longueur' },
  { text: '500 grammes',     unit: 'g',  cat: 'masse' },
  { text: '2 heures',        unit: 'h',  cat: 'duree' },
  { text: '25 centimetres',  unit: 'cm', cat: 'longueur' },
  { text: '50 centimes',     unit: 'c',  cat: 'cout' },
  { text: '20 minutes',      unit: 'min',cat: 'duree' },
  { text: '25 cl de lait',   unit: 'cl', cat: 'capacite' },
  { text: '3 dl de soupe',   unit: 'dl', cat: 'capacite' },
  { text: '200 ml de sirop', unit: 'ml', cat: 'capacite' },
  { text: '10 euros',        unit: '€',  cat: 'cout' },
  { text: '5 mm de pluie',   unit: 'mm', cat: 'longueur' },
  { text: '2 kg de pommes',  unit: 'kg', cat: 'masse' },
  { text: '45 minutes',      unit: 'min',cat: 'duree' },
  { text: '1 litre d\'eau',  unit: 'l',  cat: 'capacite' },
  { text: '100 grammes',     unit: 'g',  cat: 'masse' },
];

// "Choose the right unit" sentence templates
export const UNIT_SENTENCES = [
  { template: 'Le lapin pese 5 ___.', correct: 'kg', distractors: ['l','h','m'], hint: 'masse' },
  { template: 'La porte mesure 2 ___.', correct: 'm', distractors: ['kg','l','min'], hint: 'longueur' },
  { template: 'L\'arrosoir contient 10 ___.', correct: 'l', distractors: ['kg','m','h'], hint: 'capacite' },
  { template: 'Le film dure 2 ___.', correct: 'h', distractors: ['kg','l','m'], hint: 'duree' },
  { template: 'La pomme coute 1 ___.', correct: '€', distractors: ['kg','l','m'], hint: 'cout' },
  { template: 'Le bebe pese 4 ___.', correct: 'kg', distractors: ['l','m','min'], hint: 'masse' },
  { template: 'La piscine contient 1000 ___.', correct: 'l', distractors: ['kg','h','cm'], hint: 'capacite' },
  { template: 'Le crayon mesure 15 ___.', correct: 'cm', distractors: ['kg','l','h'], hint: 'longueur' },
  { template: 'La recreation dure 15 ___.', correct: 'min', distractors: ['kg','l','m'], hint: 'duree' },
  { template: 'Le bus coute 2 ___.', correct: '€', distractors: ['l','m','kg'], hint: 'cout' },
  { template: 'Le sac d\'ecole pese 3 ___.', correct: 'kg', distractors: ['l','m','h'], hint: 'masse' },
  { template: 'La bouteille contient 50 ___.', correct: 'cl', distractors: ['kg','m','h'], hint: 'capacite' },
  { template: 'La maison mesure 10 ___.', correct: 'm', distractors: ['g','l','min'], hint: 'longueur' },
  { template: 'La course dure 10 ___.', correct: 's', distractors: ['kg','l','m'], hint: 'duree' },
  { template: 'Le chocolat coute 50 ___.', correct: 'c', distractors: ['l','m','kg'], hint: 'cout' },
  { template: 'Le chien pese 800 ___.', correct: 'g', distractors: ['l','km','h'], hint: 'masse' },
  { template: 'La pluie tombe pendant 30 ___.', correct: 'min', distractors: ['kg','l','m'], hint: 'duree' },
  { template: 'La ville est a 5 ___.', correct: 'km', distractors: ['g','l','min'], hint: 'longueur' },
  { template: 'Le pot de confiture contient 35 ___.', correct: 'cl', distractors: ['kg','km','h'], hint: 'cout' },
  { template: 'Le stylo mesure 8 ___.', correct: 'cm', distractors: ['kg','l','h'], hint: 'longueur' },
];

// Estimation challenges
export const ESTIMATIONS = [
  { object: 'une porte', emoji: '🚪', measure: '2 m', options: ['2 m','20 m','20 cm','200 m'], correct: '2 m', cat: 'longueur' },
  { object: 'un banc d\'ecole', emoji: '🪑', measure: '1 m', options: ['1 m','10 m','10 cm','1 km'], correct: '1 m', cat: 'longueur' },
  { object: 'un professeur', emoji: '👩‍🏫', measure: '1 m 70', options: ['1 m 70','17 m','17 cm','170 m'], correct: '1 m 70', cat: 'longueur' },
  { object: 'un livre', emoji: '📚', measure: '500 g', options: ['500 g','5 kg','50 g','5000 g'], correct: '500 g', cat: 'masse' },
  { object: 'un sac de farine', emoji: '🛍️', measure: '1 kg', options: ['1 kg','100 g','10 kg','1 g'], correct: '1 kg', cat: 'masse' },
  { object: 'une bouteille d\'eau', emoji: '💧', measure: '1 l', options: ['1 l','10 l','100 ml','1 cl'], correct: '1 l', cat: 'capacite' },
  { object: 'un verre de jus', emoji: '🧃', measure: '20 cl', options: ['20 cl','2 l','200 l','2 cl'], correct: '20 cl', cat: 'capacite' },
  { object: 'un film de cinema', emoji: '🎬', measure: '2 h', options: ['2 h','2 min','2 s','20 h'], correct: '2 h', cat: 'duree' },
  { object: 'une chanson', emoji: '🎵', measure: '3 min', options: ['3 min','3 h','3 s','30 h'], correct: '3 min', cat: 'duree' },
  { object: 'un cafe au lait', emoji: '☕', measure: '15 cl', options: ['15 cl','15 l','1 ml','150 l'], correct: '15 cl', cat: 'capacite' },
  { object: 'un pain', emoji: '🍞', measure: '500 g', options: ['500 g','5 kg','50 g','50 kg'], correct: '500 g', cat: 'masse' },
  { object: 'une tablette de chocolat', emoji: '🍫', measure: '100 g', options: ['100 g','1 kg','10 g','10 kg'], correct: '100 g', cat: 'masse' },
  { object: 'une piscine olympique', emoji: '🏊', measure: '50 m', options: ['50 m','5 m','500 m','5 cm'], correct: '50 m', cat: 'longueur' },
  { object: 'une cuillere a soupe', emoji: '🥄', measure: '15 ml', options: ['15 ml','15 l','1 cl','150 l'], correct: '15 ml', cat: 'capacite' },
  { object: 'un trajet en voiture', emoji: '🚗', measure: '30 min', options: ['30 min','30 h','3 s','3 h'], correct: '30 min', cat: 'duree' },
];

// Daily missions (word problems)
export const MISSIONS = [
  // Ferme
  { theme: 'ferme', emoji: '🐄', text: 'La vache donne 10 litres de lait le matin et 8 litres le soir. Combien de litres en tout ?', answer: 18, unit: 'l', question: 'Total de lait ?', options: [15, 18, 20, 8] },
  { theme: 'ferme', emoji: '🐑', text: 'Le mouton pese 45 kg. On le tond et il perd 3 kg de laine. Combien pese-t-il apres ?', answer: 42, unit: 'kg', question: 'Masse apres la tonte ?', options: [42, 48, 40, 45] },
  { theme: 'ferme', emoji: '🌾', text: 'Un sac de ble pese 50 kg. On utilise 15 kg. Combien reste-t-il ?', answer: 35, unit: 'kg', question: 'Masse restante ?', options: [35, 65, 30, 40] },
  // Cuisine
  { theme: 'cuisine', emoji: '🍰', text: 'La recette demande 200 g de farine et 100 g de sucre. Combien de grammes en tout ?', answer: 300, unit: 'g', question: 'Total d\'ingredients ?', options: [300, 200, 100, 250] },
  { theme: 'cuisine', emoji: '🍳', text: 'La soupe cuit pendant 20 minutes puis encore 10 minutes. Combien de minutes en tout ?', answer: 30, unit: 'min', question: 'Temps de cuisson total ?', options: [30, 20, 10, 25] },
  { theme: 'cuisine', emoji: '🥛', text: 'On verse 25 cl de lait dans un verre et 25 cl dans un autre. Combien au total ?', answer: 50, unit: 'cl', question: 'Total de lait ?', options: [50, 25, 75, 40] },
  // Magasin
  { theme: 'magasin', emoji: '🛒', text: 'Un pain coute 1 euro 50. Maman achete 2 pains. Combien depense-t-elle ?', answer: 3, unit: '€', question: 'Total a payer ?', options: [3, 2, 4, 150] },
  { theme: 'magasin', emoji: '🍎', text: 'Les pommes content 2 euros le kilo. Papa achete 3 kg. Combien paie-t-il ?', answer: 6, unit: '€', question: 'Total a payer ?', options: [6, 5, 4, 8] },
  { theme: 'magasin', emoji: '🧃', text: 'Une bouteille de jus coute 1 euro 20. Tom a 5 euros. Combien lui reste-t-il apres l\'achat ?', answer: 4, unit: '€', question: 'Monnaie rendue ?', options: [4, 3, 380, 2] },
  // Animaux
  { theme: 'animaux', emoji: '🐘', text: 'Un elephant pese 5000 kg. Un hippo pese 3000 kg. Quelle est la difference de masse ?', answer: 2000, unit: 'kg', question: 'Difference de masse ?', options: [2000, 8000, 1000, 3000] },
  { theme: 'animaux', emoji: '🐍', text: 'Le serpent mesure 150 cm. La ficelle mesure 75 cm de moins. Combien mesure la ficelle ?', answer: 75, unit: 'cm', question: 'Longueur de la ficelle ?', options: [75, 225, 100, 50] },
  // Ecole
  { theme: 'ecole', emoji: '📏', text: 'La table de Lena mesure 60 cm de large. La table de Tom mesure 80 cm. Quelle est la difference ?', answer: 20, unit: 'cm', question: 'Difference de largeur ?', options: [20, 140, 10, 30] },
  { theme: 'ecole', emoji: '⏰', text: 'Le cours commence a 9h et dure 50 minutes. A quelle heure finit-il ?', answer: '9h50', unit: '', question: 'Heure de fin ?', options: ['9h50','10h50','9h05','10h00'] },
  // Maison
  { theme: 'maison', emoji: '🚿', text: 'La douche dure 10 minutes et utilise 60 litres. Combien de litres en 2 douches ?', answer: 120, unit: 'l', question: 'Total d\'eau ?', options: [120, 60, 30, 80] },
  { theme: 'maison', emoji: '🏠', text: 'Le salon mesure 5 m de long et 4 m de large. Quelle est la plus grande mesure ?', answer: '5 m', unit: '', question: 'Quelle est la plus grande mesure ?', options: ['5 m','4 m','9 m','20 m'] },
];

// Detective situations (identify the measurement type from context)
export const DETECTIVE_SITUATIONS = [
  { text: 'Lena court 400 metres pour rentrer chez elle.', answer: 'longueur', options: ['longueur','masse','duree','capacite'], emoji: '🏃' },
  { text: 'Le sac de pommes pese 2 kilogrammes.', answer: 'masse', options: ['longueur','masse','duree','capacite'], emoji: '🛒' },
  { text: 'La baignoire contient 80 litres d\'eau.', answer: 'capacite', options: ['longueur','masse','duree','cout'], emoji: '🛁' },
  { text: 'Le film dure 1 heure et 30 minutes.', answer: 'duree', options: ['longueur','masse','duree','capacite'], emoji: '🎬' },
  { text: 'Le pain coute 1 euro 50 centimes.', answer: 'cout', options: ['longueur','masse','duree','cout'], emoji: '🍞' },
  { text: 'La piscine mesure 25 metres de long.', answer: 'longueur', options: ['longueur','masse','duree','cout'], emoji: '🏊' },
  { text: 'Le bebe boit 20 cl de lait.', answer: 'capacite', options: ['longueur','masse','capacite','cout'], emoji: '🍼' },
  { text: 'Le train met 2 heures pour aller a Paris.', answer: 'duree', options: ['longueur','masse','duree','capacite'], emoji: '🚆' },
  { text: 'Le dictionnaire pese 800 grammes.', answer: 'masse', options: ['longueur','masse','duree','capacite'], emoji: '📖' },
  { text: 'La veste coute 35 euros.', answer: 'cout', options: ['longueur','masse','duree','cout'], emoji: '🧥' },
  { text: 'Le serpent mesure 1 metre 20.', answer: 'longueur', options: ['longueur','masse','duree','capacite'], emoji: '🐍' },
  { text: 'La sieste dure 45 minutes.', answer: 'duree', options: ['longueur','masse','duree','capacite'], emoji: '😴' },
];

export const METRI_BADGES = [
  { id: 'petit-mesureur',  label: 'Petit Mesureur',    emoji: '📏', threshold: 5   },
  { id: 'apprenti-labo',   label: 'Apprenti du Labo',  emoji: '🔬', threshold: 20  },
  { id: 'expert-grandeur', label: 'Expert en Grandeur', emoji: '⚗️', threshold: 50  },
  { id: 'maitre-mesures',  label: 'Maitre des Mesures', emoji: '🏆', threshold: 100 },
  { id: 'roi-grandeurs',   label: 'Roi des Grandeurs',  emoji: '👑', threshold: 200 },
];

export const ENCOURAGEMENTS_METRI = [
  'Essaie encore ! Tu y es presque !',
  'Regarde bien l\'unite !',
  'Tu progressses super bien ! ✨',
  'Presque ! Recommence !',
  'Super effort ! Continue ! 🌟',
  'Tu es un vrai scientifique ! 🔬',
];

// Market (Jeu 5) coin/bill set
export const COINS = [
  { value: 0.01, label: '1 c',  emoji: '🪙' },
  { value: 0.02, label: '2 c',  emoji: '🪙' },
  { value: 0.05, label: '5 c',  emoji: '🪙' },
  { value: 0.10, label: '10 c', emoji: '🪙' },
  { value: 0.20, label: '20 c', emoji: '🪙' },
  { value: 0.50, label: '50 c', emoji: '🪙' },
  { value: 1.00, label: '1 €',  emoji: '💶' },
  { value: 2.00, label: '2 €',  emoji: '💶' },
  { value: 5.00, label: '5 €',  emoji: '💵' },
  { value: 10.00, label: '10 €', emoji: '💵' },
];

export function genMarketQuestion() {
  const price = (Math.floor(Math.random() * 20) + 1) * 0.50; // 0.50 to 10.00 in 0.50 steps
  const paid = price + [0.50, 1, 2, 5][Math.floor(Math.random() * 4)];
  const change = Math.round((paid - price) * 100) / 100;
  const items = ['pain','pomme','jus','gateau','fleur','livre','stylo'];
  const item = items[Math.floor(Math.random() * items.length)];
  return {
    item, price, paid, change,
    priceLabel: price % 1 === 0 ? price + ' €' : price.toFixed(2).replace('.',',') + ' €',
    paidLabel: paid % 1 === 0 ? paid + ' €' : paid.toFixed(2).replace('.',',') + ' €',
    changeLabel: change % 1 === 0 ? change + ' €' : change.toFixed(2).replace('.',',') + ' €',
    options: [change, change + 0.5, Math.max(0.5, change - 0.5), change + 1]
      .map(v => Math.round(v * 100) / 100)
      .filter((v, i, a) => a.indexOf(v) === i && v >= 0)
      .slice(0, 4)
      .sort(() => Math.random() - .5),
  };
}

export function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
