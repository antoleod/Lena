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
  { text: '75 metres',       unit: 'm',  cat: 'longueur', level: 1 },
  { text: '5 euros',         unit: '€',  cat: 'cout',     level: 1 },
  { text: '1 kilogramme',    unit: 'kg', cat: 'masse',    level: 1 },
  { text: '1 litre',         unit: 'l',  cat: 'capacite', level: 1 },
  { text: '30 secondes',     unit: 's',  cat: 'duree',    level: 1 },
  { text: '3 kilometres',    unit: 'km', cat: 'longueur', level: 1 },
  { text: '500 grammes',     unit: 'g',  cat: 'masse',    level: 1 },
  { text: '2 heures',        unit: 'h',  cat: 'duree',    level: 1 },
  { text: '25 centimetres',  unit: 'cm', cat: 'longueur', level: 2 },
  { text: '50 centimes',     unit: 'c',  cat: 'cout',     level: 1 },
  { text: '20 minutes',      unit: 'min',cat: 'duree',    level: 2 },
  { text: '25 cl de lait',   unit: 'cl', cat: 'capacite', level: 2 },
  { text: '3 dl de soupe',   unit: 'dl', cat: 'capacite', level: 2 },
  { text: '200 ml de sirop', unit: 'ml', cat: 'capacite', level: 2 },
  { text: '10 euros',        unit: '€',  cat: 'cout',     level: 1 },
  { text: '5 mm de pluie',   unit: 'mm', cat: 'longueur', level: 2 },
  { text: '2 kg de pommes',  unit: 'kg', cat: 'masse',    level: 2 },
  { text: '45 minutes',      unit: 'min',cat: 'duree',    level: 2 },
  { text: '1 litre d\'eau',  unit: 'l',  cat: 'capacite', level: 2 },
  { text: '100 grammes',     unit: 'g',  cat: 'masse',    level: 2 },
  { text: '8 millimetres de neige',   unit: 'mm', cat: 'longueur', level: 2 },
  { text: '3 grammes de sel',         unit: 'g',  cat: 'masse',    level: 2 },
  { text: '5 decilitres de jus',      unit: 'dl', cat: 'capacite', level: 2 },
  { text: '90 secondes',              unit: 's',  cat: 'duree',    level: 1 },
  { text: '2 euros 50',               unit: '€',  cat: 'cout',     level: 1 },
  { text: '400 metres',               unit: 'm',  cat: 'longueur', level: 1 },
  { text: '1500 grammes',             unit: 'g',  cat: 'masse',    level: 2 },
  { text: '75 centilitres',           unit: 'cl', cat: 'capacite', level: 2 },
  { text: '4 heures et demie',        unit: 'h',  cat: 'duree',    level: 2 },
  { text: '10 centimes',              unit: 'c',  cat: 'cout',     level: 1 },
  { text: '15 kilometres',            unit: 'km', cat: 'longueur', level: 1 },
  { text: '250 grammes de beurre',    unit: 'g',  cat: 'masse',    level: 1 },
  { text: '500 millilitres de soupe', unit: 'ml', cat: 'capacite', level: 1 },
  { text: '7 minutes de sport',       unit: 'min',cat: 'duree',    level: 1 },
  { text: '3 euros 99',               unit: '€',  cat: 'cout',     level: 2 },
  { text: '35 centimetres de tissu',  unit: 'cm', cat: 'longueur', level: 2 },
  { text: '4 kilogrammes de riz',     unit: 'kg', cat: 'masse',    level: 1 },
  { text: '2 litres de soupe',        unit: 'l',  cat: 'capacite', level: 1 },
  { text: '20 secondes de publicite', unit: 's',  cat: 'duree',    level: 2 },
  { text: '75 centimes de bonbons',   unit: 'c',  cat: 'cout',     level: 2 },
];

// "Choose the right unit" sentence templates
export const UNIT_SENTENCES = [
  { template: 'Le lapin pese 5 ___.', correct: 'kg', distractors: ['l','h','m'],     hint: 'masse',    level: 1 },
  { template: 'La porte mesure 2 ___.', correct: 'm', distractors: ['kg','l','min'], hint: 'longueur', level: 1 },
  { template: 'L\'arrosoir contient 10 ___.', correct: 'l', distractors: ['kg','m','h'], hint: 'capacite', level: 1 },
  { template: 'Le film dure 2 ___.', correct: 'h', distractors: ['kg','l','m'],      hint: 'duree',    level: 1 },
  { template: 'La pomme coute 1 ___.', correct: '€', distractors: ['kg','l','m'],    hint: 'cout',     level: 1 },
  { template: 'Le bebe pese 4 ___.', correct: 'kg', distractors: ['l','m','min'],    hint: 'masse',    level: 1 },
  { template: 'La piscine contient 1000 ___.', correct: 'l', distractors: ['kg','h','cm'], hint: 'capacite', level: 2 },
  { template: 'Le crayon mesure 15 ___.', correct: 'cm', distractors: ['kg','l','h'], hint: 'longueur', level: 1 },
  { template: 'La recreation dure 15 ___.', correct: 'min', distractors: ['kg','l','m'], hint: 'duree', level: 1 },
  { template: 'Le bus coute 2 ___.', correct: '€', distractors: ['l','m','kg'],      hint: 'cout',     level: 1 },
  { template: 'Le sac d\'ecole pese 3 ___.', correct: 'kg', distractors: ['l','m','h'], hint: 'masse', level: 1 },
  { template: 'La bouteille contient 50 ___.', correct: 'cl', distractors: ['kg','m','h'], hint: 'capacite', level: 2 },
  { template: 'La maison mesure 10 ___.', correct: 'm', distractors: ['g','l','min'], hint: 'longueur', level: 1 },
  { template: 'La course dure 10 ___.', correct: 's', distractors: ['kg','l','m'],    hint: 'duree',    level: 2 },
  { template: 'Le chocolat coute 50 ___.', correct: 'c', distractors: ['l','m','kg'], hint: 'cout',    level: 2 },
  { template: 'Le chien pese 800 ___.', correct: 'g', distractors: ['l','km','h'],    hint: 'masse',    level: 2 },
  { template: 'La pluie tombe pendant 30 ___.', correct: 'min', distractors: ['kg','l','m'], hint: 'duree', level: 1 },
  { template: 'La ville est a 5 ___.', correct: 'km', distractors: ['g','l','min'],   hint: 'longueur', level: 2 },
  { template: 'Le pot de confiture contient 35 ___.', correct: 'cl', distractors: ['kg','km','h'], hint: 'cout', level: 2 },
  { template: 'Le stylo mesure 8 ___.', correct: 'cm', distractors: ['kg','l','h'],   hint: 'longueur', level: 1 },
  { template: 'La riviere mesure 200 ___.', correct: 'm',   distractors: ['kg','l','h'],   hint: 'longueur', level: 2 },
  { template: 'Le sac de course pese 2 ___.', correct: 'kg',  distractors: ['l','m','min'],  hint: 'masse',    level: 1 },
  { template: 'Le medicament contient 5 ___.', correct: 'ml',  distractors: ['kg','h','m'],   hint: 'capacite', level: 2 },
  { template: 'L\'avion met 3 ___ pour arriver.', correct: 'h', distractors: ['kg','l','cm'],  hint: 'duree',    level: 1 },
  { template: 'Un bonbon coute 5 ___.', correct: 'c',   distractors: ['kg','l','m'],   hint: 'cout',     level: 1 },
  { template: 'Le pont mesure 100 ___.', correct: 'm',   distractors: ['g','l','h'],    hint: 'longueur', level: 1 },
  { template: 'La pastille pese 2 ___.', correct: 'g',   distractors: ['l','m','min'],  hint: 'masse',    level: 2 },
  { template: 'Le thermos contient 50 ___.', correct: 'cl',  distractors: ['kg','km','h'], hint: 'capacite', level: 2 },
  { template: 'Le clin d\'oeil dure 1 ___.', correct: 's',   distractors: ['kg','l','m'],   hint: 'duree',    level: 2 },
  { template: 'La pizza coute 8 ___.', correct: '€',   distractors: ['l','m','kg'],   hint: 'cout',     level: 1 },
  { template: 'La tour Eiffel mesure 300 ___.', correct: 'm', distractors: ['g','l','s'],  hint: 'longueur', level: 2 },
  { template: 'Le chat pese 4 ___.', correct: 'kg',  distractors: ['l','m','h'],    hint: 'masse',    level: 1 },
  { template: 'Le biberon contient 12 ___.', correct: 'cl',  distractors: ['kg','km','h'], hint: 'capacite', level: 1 },
  { template: 'La pause dejeuner dure 1 ___.', correct: 'h',  distractors: ['kg','l','m'],   hint: 'duree',    level: 1 },
  { template: 'Le timbre coute 90 ___.', correct: 'c',   distractors: ['l','m','kg'],   hint: 'cout',     level: 2 },
  { template: 'Le lit mesure 2 ___.', correct: 'm',   distractors: ['g','l','min'],  hint: 'longueur', level: 1 },
  { template: 'Une miche de pain pese 800 ___.', correct: 'g', distractors: ['l','km','h'], hint: 'masse',   level: 2 },
  { template: 'La gourde contient 75 ___.', correct: 'cl',  distractors: ['kg','km','min'],hint: 'capacite', level: 2 },
  { template: 'La tele dure 30 ___.', correct: 'min', distractors: ['kg','l','m'],   hint: 'duree',    level: 1 },
  { template: 'Le jouet coute 15 ___.', correct: '€',  distractors: ['g','l','km'],   hint: 'cout',     level: 1 },
];

// Estimation challenges
export const ESTIMATIONS = [
  { object: 'une porte', emoji: '🚪', measure: '2 m', options: ['2 m','20 m','20 cm','200 m'], correct: '2 m', cat: 'longueur', level: 1 },
  { object: 'un banc d\'ecole', emoji: '🪑', measure: '1 m', options: ['1 m','10 m','10 cm','1 km'], correct: '1 m', cat: 'longueur', level: 1 },
  { object: 'un professeur', emoji: '👩‍🏫', measure: '1 m 70', options: ['1 m 70','17 m','17 cm','170 m'], correct: '1 m 70', cat: 'longueur', level: 1 },
  { object: 'un livre', emoji: '📚', measure: '500 g', options: ['500 g','5 kg','50 g','5000 g'], correct: '500 g', cat: 'masse', level: 1 },
  { object: 'un sac de farine', emoji: '🛍️', measure: '1 kg', options: ['1 kg','100 g','10 kg','1 g'], correct: '1 kg', cat: 'masse', level: 1 },
  { object: 'une bouteille d\'eau', emoji: '💧', measure: '1 l', options: ['1 l','10 l','100 ml','1 cl'], correct: '1 l', cat: 'capacite', level: 1 },
  { object: 'un verre de jus', emoji: '🧃', measure: '20 cl', options: ['20 cl','2 l','200 l','2 cl'], correct: '20 cl', cat: 'capacite', level: 1 },
  { object: 'un film de cinema', emoji: '🎬', measure: '2 h', options: ['2 h','2 min','2 s','20 h'], correct: '2 h', cat: 'duree', level: 1 },
  { object: 'une chanson', emoji: '🎵', measure: '3 min', options: ['3 min','3 h','3 s','30 h'], correct: '3 min', cat: 'duree', level: 1 },
  { object: 'un cafe au lait', emoji: '☕', measure: '15 cl', options: ['15 cl','15 l','1 ml','150 l'], correct: '15 cl', cat: 'capacite', level: 2 },
  { object: 'un pain', emoji: '🍞', measure: '500 g', options: ['500 g','5 kg','50 g','50 kg'], correct: '500 g', cat: 'masse', level: 1 },
  { object: 'une tablette de chocolat', emoji: '🍫', measure: '100 g', options: ['100 g','1 kg','10 g','10 kg'], correct: '100 g', cat: 'masse', level: 2 },
  { object: 'une piscine olympique', emoji: '🏊', measure: '50 m', options: ['50 m','5 m','500 m','5 cm'], correct: '50 m', cat: 'longueur', level: 2 },
  { object: 'une cuillere a soupe', emoji: '🥄', measure: '15 ml', options: ['15 ml','15 l','1 cl','150 l'], correct: '15 ml', cat: 'capacite', level: 2 },
  { object: 'un trajet en voiture', emoji: '🚗', measure: '30 min', options: ['30 min','30 h','3 s','3 h'], correct: '30 min', cat: 'duree', level: 1 },
  { object: 'un timbre', emoji: '📮', measure: '2 g', options: ['2 g','200 g','20 g','2 kg'], correct: '2 g', cat: 'masse', level: 2 },
  { object: 'un trajet Paris-Lyon en train', emoji: '🚄', measure: '2 h', options: ['2 h','2 min','20 h','2 s'], correct: '2 h', cat: 'duree', level: 2 },
  { object: 'un stylo', emoji: '✏️', measure: '10 cm', options: ['10 cm','1 m','10 m','1 km'], correct: '10 cm', cat: 'longueur', level: 1 },
  { object: 'un eleve de CE1', emoji: '🧒', measure: '1 m 20', options: ['1 m 20','12 m','12 cm','120 m'], correct: '1 m 20', cat: 'longueur', level: 1 },
  { object: 'un oeuf', emoji: '🥚', measure: '60 g', options: ['60 g','600 g','6 g','6 kg'], correct: '60 g', cat: 'masse', level: 2 },
  { object: 'une piscine de jardin', emoji: '🏊', measure: '3000 l', options: ['3000 l','30 l','300 ml','3 cl'], correct: '3000 l', cat: 'capacite', level: 2 },
  { object: 'une recre', emoji: '⛹️', measure: '15 min', options: ['15 min','15 h','15 s','1 h'], correct: '15 min', cat: 'duree', level: 1 },
  { object: 'une bague', emoji: '💍', measure: '3 g', options: ['3 g','300 g','3 kg','30 g'], correct: '3 g', cat: 'masse', level: 2 },
  { object: 'un terrain de foot', emoji: '⚽', measure: '100 m', options: ['100 m','10 m','1 km','100 cm'], correct: '100 m', cat: 'longueur', level: 2 },
  { object: 'un pot de yaourt', emoji: '🥛', measure: '15 cl', options: ['15 cl','15 l','1 ml','150 l'], correct: '15 cl', cat: 'capacite', level: 1 },
  { object: 'un chat adulte', emoji: '🐱', measure: '4 kg', options: ['4 kg','400 g','40 kg','4 g'], correct: '4 kg', cat: 'masse', level: 1 },
  { object: 'un doigt', emoji: '☝️', measure: '7 cm', options: ['7 cm','7 m','70 cm','70 m'], correct: '7 cm', cat: 'longueur', level: 1 },
  { object: 'une cuillere a cafe', emoji: '🥄', measure: '5 ml', options: ['5 ml','50 ml','5 l','50 l'], correct: '5 ml', cat: 'capacite', level: 2 },
  { object: 'une nuit de sommeil', emoji: '😴', measure: '8 h', options: ['8 h','8 min','80 h','8 s'], correct: '8 h', cat: 'duree', level: 1 },
  { object: 'un cartable plein', emoji: '🎒', measure: '5 kg', options: ['5 kg','500 g','50 kg','5 g'], correct: '5 kg', cat: 'masse', level: 1 },
];

// Daily missions (word problems)
export const MISSIONS = [
  // Ferme
  { theme: 'ferme', emoji: '🐄', text: 'La vache donne 10 litres de lait le matin et 8 litres le soir. Combien de litres en tout ?', answer: 18, unit: 'l', question: 'Total de lait ?', options: [15, 18, 20, 8], level: 1 },
  { theme: 'ferme', emoji: '🐑', text: 'Le mouton pese 45 kg. On le tond et il perd 3 kg de laine. Combien pese-t-il apres ?', answer: 42, unit: 'kg', question: 'Masse apres la tonte ?', options: [42, 48, 40, 45], level: 2 },
  { theme: 'ferme', emoji: '🌾', text: 'Un sac de ble pese 50 kg. On utilise 15 kg. Combien reste-t-il ?', answer: 35, unit: 'kg', question: 'Masse restante ?', options: [35, 65, 30, 40], level: 1 },
  // Cuisine
  { theme: 'cuisine', emoji: '🍰', text: 'La recette demande 200 g de farine et 100 g de sucre. Combien de grammes en tout ?', answer: 300, unit: 'g', question: 'Total d\'ingredients ?', options: [300, 200, 100, 250], level: 1 },
  { theme: 'cuisine', emoji: '🍳', text: 'La soupe cuit pendant 20 minutes puis encore 10 minutes. Combien de minutes en tout ?', answer: 30, unit: 'min', question: 'Temps de cuisson total ?', options: [30, 20, 10, 25], level: 1 },
  { theme: 'cuisine', emoji: '🥛', text: 'On verse 25 cl de lait dans un verre et 25 cl dans un autre. Combien au total ?', answer: 50, unit: 'cl', question: 'Total de lait ?', options: [50, 25, 75, 40], level: 1 },
  // Magasin
  { theme: 'magasin', emoji: '🛒', text: 'Un pain coute 1 euro 50. Maman achete 2 pains. Combien depense-t-elle ?', answer: 3, unit: '€', question: 'Total a payer ?', options: [3, 2, 4, 150], level: 2 },
  { theme: 'magasin', emoji: '🍎', text: 'Les pommes content 2 euros le kilo. Papa achete 3 kg. Combien paie-t-il ?', answer: 6, unit: '€', question: 'Total a payer ?', options: [6, 5, 4, 8], level: 2 },
  { theme: 'magasin', emoji: '🧃', text: 'Une bouteille de jus coute 1 euro 20. Tom a 5 euros. Combien lui reste-t-il apres l\'achat ?', answer: 4, unit: '€', question: 'Monnaie rendue ?', options: [4, 3, 380, 2], level: 2 },
  // Animaux
  { theme: 'animaux', emoji: '🐘', text: 'Un elephant pese 5000 kg. Un hippo pese 3000 kg. Quelle est la difference de masse ?', answer: 2000, unit: 'kg', question: 'Difference de masse ?', options: [2000, 8000, 1000, 3000], level: 2 },
  { theme: 'animaux', emoji: '🐍', text: 'Le serpent mesure 150 cm. La ficelle mesure 75 cm de moins. Combien mesure la ficelle ?', answer: 75, unit: 'cm', question: 'Longueur de la ficelle ?', options: [75, 225, 100, 50], level: 2 },
  // Ecole
  { theme: 'ecole', emoji: '📏', text: 'La table de Lena mesure 60 cm de large. La table de Tom mesure 80 cm. Quelle est la difference ?', answer: 20, unit: 'cm', question: 'Difference de largeur ?', options: [20, 140, 10, 30], level: 1 },
  { theme: 'ecole', emoji: '⏰', text: 'Le cours commence a 9h et dure 50 minutes. A quelle heure finit-il ?', answer: '9h50', unit: '', question: 'Heure de fin ?', options: ['9h50','10h50','9h05','10h00'], level: 2 },
  // Maison
  { theme: 'maison', emoji: '🚿', text: 'La douche dure 10 minutes et utilise 60 litres. Combien de litres en 2 douches ?', answer: 120, unit: 'l', question: 'Total d\'eau ?', options: [120, 60, 30, 80], level: 2 },
  { theme: 'maison', emoji: '🏠', text: 'Le salon mesure 5 m de long et 4 m de large. Quelle est la plus grande mesure ?', answer: '5 m', unit: '', question: 'Quelle est la plus grande mesure ?', options: ['5 m','4 m','9 m','20 m'], level: 1 },
  // Niveau 1 (easy, addition/subtraction with obvious units)
  { theme: 'sport', emoji: '⚽', text: 'Emma court 200 metres le matin et 300 metres l\'apres-midi. Combien en tout ?', answer: 500, unit: 'm', question: 'Distance totale ?', options: [500, 400, 600, 100], level: 1 },
  { theme: 'sport', emoji: '🏊', text: 'La piscine ouvre a 9h et ferme a 17h. Combien d\'heures est-elle ouverte ?', answer: 8, unit: 'h', question: 'Heures d\'ouverture ?', options: [8, 7, 9, 6], level: 1 },
  { theme: 'cuisine', emoji: '🥗', text: 'La recette demande 100 g de riz et 150 g de legumes. Combien en tout ?', answer: 250, unit: 'g', question: 'Total d\'ingredients ?', options: [250, 200, 300, 150], level: 1 },
  { theme: 'magasin', emoji: '🛍️', text: 'Tom a 10 euros. Il achete un livre a 6 euros. Combien lui reste-t-il ?', answer: 4, unit: '€', question: 'Monnaie restante ?', options: [4, 6, 16, 3], level: 1 },
  { theme: 'maison', emoji: '🌡️', text: 'La baignoire peut contenir 150 litres. On la remplit a moitie. Combien de litres ?', answer: 75, unit: 'l', question: 'Litres dans la baignoire ?', options: [75, 100, 50, 150], level: 1 },
  { theme: 'nature', emoji: '🌧️', text: 'Il est tombe 5 mm de pluie lundi et 3 mm mardi. Combien de mm en tout ?', answer: 8, unit: 'mm', question: 'Total de pluie ?', options: [8, 6, 10, 2], level: 1 },
  // Niveau 2 (medium, multiplication or conversion hints)
  { theme: 'sport', emoji: '🚴', text: 'Paul roule 15 km par jour pendant 4 jours. Combien de km en tout ?', answer: 60, unit: 'km', question: 'Distance totale ?', options: [60, 45, 75, 19], level: 2 },
  { theme: 'cuisine', emoji: '🎂', text: 'Le gateau cuit 45 minutes. Il reste 15 minutes. Depuis combien de temps cuit-il ?', answer: 30, unit: 'min', question: 'Temps ecoule ?', options: [30, 45, 15, 60], level: 2 },
  { theme: 'magasin', emoji: '🎁', text: 'Un jouet coute 12 euros. Lena a 3 euros de reduction. Combien paie-t-elle ?', answer: 9, unit: '€', question: 'Prix final ?', options: [9, 15, 12, 6], level: 2 },
  { theme: 'ferme', emoji: '🐓', text: 'Chaque poule pond 2 oeufs par jour. La ferme a 5 poules. Combien d\'oeufs en un jour ?', answer: 10, unit: 'oeufs', question: 'Total d\'oeufs ?', options: [10, 7, 5, 15], level: 2 },
  { theme: 'maison', emoji: '💡', text: 'Une ampoule dure 1000 heures. Allumee 5h par jour, combien de jours dure-t-elle ?', answer: 200, unit: 'jours', question: 'Nombre de jours ?', options: [200, 500, 100, 1000], level: 2 },
  { theme: 'science', emoji: '🧪', text: 'On verse 3 fois 25 cl dans un recipient. Combien de cl au total ?', answer: 75, unit: 'cl', question: 'Total dans le recipient ?', options: [75, 50, 100, 25], level: 2 },
  // Niveau 3 (hard, multi-step, mixed units)
  { theme: 'sport', emoji: '🏃', text: 'Un coureur fait 5 tours d\'un circuit de 400 m. En km, combien fait-il ?', answer: 2, unit: 'km', question: 'Distance en km ?', options: [2, 20, 5, 4], level: 3 },
  { theme: 'magasin', emoji: '💰', text: 'Maman achete 2 kg de tomates a 3 euros/kg et 500 g de fromage a 8 euros/kg. Combien depense-t-elle ?', answer: 10, unit: '€', question: 'Total des achats ?', options: [10, 14, 6, 12], level: 3 },
  { theme: 'temps', emoji: '⏰', text: 'Lisa part a 8h15 et arrive 1h45 plus tard. A quelle heure arrive-t-elle ?', answer: '10h00', unit: '', question: 'Heure d\'arrivee ?', options: ['10h00','9h45','10h15','9h00'], level: 3 },
  { theme: 'cuisine', emoji: '🍲', text: 'Une bouteille de 75 cl. On boit 3 verres de 15 cl. Combien reste-t-il ?', answer: 30, unit: 'cl', question: 'Volume restant ?', options: [30, 45, 60, 15], level: 3 },
];

// Detective situations (identify the measurement type from context)
export const DETECTIVE_SITUATIONS = [
  { text: 'Lena court 400 metres pour rentrer chez elle.', answer: 'longueur', options: ['longueur','masse','duree','capacite'], emoji: '🏃', level: 1 },
  { text: 'Le sac de pommes pese 2 kilogrammes.', answer: 'masse', options: ['longueur','masse','duree','capacite'], emoji: '🛒', level: 1 },
  { text: 'La baignoire contient 80 litres d\'eau.', answer: 'capacite', options: ['longueur','masse','duree','cout'], emoji: '🛁', level: 1 },
  { text: 'Le film dure 1 heure et 30 minutes.', answer: 'duree', options: ['longueur','masse','duree','capacite'], emoji: '🎬', level: 1 },
  { text: 'Le pain coute 1 euro 50 centimes.', answer: 'cout', options: ['longueur','masse','duree','cout'], emoji: '🍞', level: 1 },
  { text: 'La piscine mesure 25 metres de long.', answer: 'longueur', options: ['longueur','masse','duree','cout'], emoji: '🏊', level: 1 },
  { text: 'Le bebe boit 20 cl de lait.', answer: 'capacite', options: ['longueur','masse','capacite','cout'], emoji: '🍼', level: 2 },
  { text: 'Le train met 2 heures pour aller a Paris.', answer: 'duree', options: ['longueur','masse','duree','capacite'], emoji: '🚆', level: 2 },
  { text: 'Le dictionnaire pese 800 grammes.', answer: 'masse', options: ['longueur','masse','duree','capacite'], emoji: '📖', level: 2 },
  { text: 'La veste coute 35 euros.', answer: 'cout', options: ['longueur','masse','duree','cout'], emoji: '🧥', level: 2 },
  { text: 'Le serpent mesure 1 metre 20.', answer: 'longueur', options: ['longueur','masse','duree','capacite'], emoji: '🐍', level: 2 },
  { text: 'La sieste dure 45 minutes.', answer: 'duree', options: ['longueur','masse','duree','capacite'], emoji: '😴', level: 2 },
  { text: 'Maman ajoute 200 grammes de farine dans le bol.', answer: 'masse',    options: ['longueur','masse','duree','capacite'],  emoji: '🥣', level: 1 },
  { text: 'Le jardin mesure 12 metres de long.', answer: 'longueur', options: ['longueur','masse','duree','cout'],      emoji: '🏡', level: 1 },
  { text: 'Le biberon contient 25 centilitres de lait.', answer: 'capacite', options: ['longueur','masse','capacite','cout'], emoji: '🍼', level: 2 },
  { text: 'Tom met 5 secondes pour fermer sa fermeture eclair.', answer: 'duree', options: ['longueur','masse','duree','capacite'], emoji: '🤐', level: 2 },
  { text: 'Le velo coute 150 euros.', answer: 'cout',    options: ['longueur','masse','duree','cout'],      emoji: '🚲', level: 1 },
  { text: 'La girafe mesure 5 metres de haut.', answer: 'longueur', options: ['longueur','masse','duree','capacite'], emoji: '🦒', level: 1 },
  { text: 'Le seau contient 8 litres d\'eau.', answer: 'capacite', options: ['longueur','masse','capacite','duree'],  emoji: '🪣', level: 1 },
  { text: 'L\'elephant pese 5 tonnes.', answer: 'masse',    options: ['longueur','masse','duree','capacite'],  emoji: '🐘', level: 2 },
  { text: 'Le trajet en bus dure 20 minutes.', answer: 'duree',    options: ['longueur','masse','duree','cout'],      emoji: '🚌', level: 1 },
  { text: 'La paire de chaussures coute 45 euros.', answer: 'cout', options: ['longueur','masse','duree','cout'],     emoji: '👟', level: 1 },
  { text: 'Le tunnel mesure 3 kilometres.', answer: 'longueur', options: ['longueur','masse','duree','cout'],         emoji: '🚇', level: 2 },
  { text: 'Le sirop en contient 150 millilitres.', answer: 'capacite', options: ['longueur','masse','capacite','duree'], emoji: '💊', level: 2 },
  { text: 'La course dure 45 minutes.', answer: 'duree', options: ['longueur','masse','duree','capacite'],             emoji: '🏅', level: 2 },
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

export function filterByLevel(arr, difficulty) {
  if (difficulty === 'facile')   return arr.filter(x => !x.level || x.level <= 1);
  if (difficulty === 'moyen')    return arr.filter(x => !x.level || x.level <= 2);
  return arr; // 'difficile' = all
}
