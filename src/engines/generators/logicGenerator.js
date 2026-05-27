import { createExercise, gradeToLabel, randomInt, sample, uniqueOptions } from './generatorUtils.js';

// ─── RICH LOGIC TASKS ────────────────────────────────────────────────────────
// 100+ tasks covering: intrus, sequence, classification, analogy, deduction, spatial, probability

const LOGIC_P2 = [
  // ── Intrus / odd-one-out ──
  { prompt: 'Quel mot ne va PAS avec les autres ?', answer: 'triangle', wrong: ['rouge', 'bleu', 'vert'], explanation: 'Triangle est une forme, les autres sont des couleurs.' },
  { prompt: 'Quel mot ne va PAS avec les autres ?', answer: 'guitare', wrong: ['chat', 'chien', 'lapin'], explanation: 'Guitare est un instrument, les autres sont des animaux.' },
  { prompt: 'Quel mot ne va PAS avec les autres ?', answer: 'cuillère', wrong: ['pomme', 'banane', 'raisin'], explanation: 'Cuillère est un ustensile, les autres sont des fruits.' },
  { prompt: 'Quel mot ne va PAS avec les autres ?', answer: 'voiture', wrong: ['crayon', 'stylo', 'cahier'], explanation: 'Voiture ne fait pas partie du matériel scolaire.' },
  { prompt: 'Quel mot ne va PAS avec les autres ?', answer: 'médecin', wrong: ['lundi', 'mardi', 'jeudi'], explanation: 'Médecin est un métier, les autres sont des jours.' },
  { prompt: 'Quel élément ne va pas avec les autres ?', answer: 'nuit', wrong: ['matin', 'midi', 'après-midi'], explanation: 'Nuit est la période sombre, les autres sont dans la journée.' },
  { prompt: 'Quel mot ne va PAS avec les autres ?', answer: 'table', wrong: ['chien', 'chat', 'lapin'], explanation: 'Table est un meuble, les autres sont des animaux.' },
  { prompt: 'Lequel n\'est pas un fruit ?', answer: 'carotte', wrong: ['pomme', 'poire', 'fraise'], explanation: 'La carotte est un légume, les autres sont des fruits.' },
  { prompt: 'Lequel n\'est pas un vêtement ?', answer: 'assiette', wrong: ['manteau', 'chaussure', 'chapeau'], explanation: 'Assiette est de la vaisselle, les autres sont des vêtements.' },
  { prompt: 'Lequel n\'est pas un instrument de musique ?', answer: 'marteau', wrong: ['flûte', 'tambour', 'violon'], explanation: 'Marteau est un outil, les autres sont des instruments.' },
  { prompt: 'Lequel n\'est pas un animal domestique ?', answer: 'lion', wrong: ['chien', 'chat', 'lapin'], explanation: 'Le lion est sauvage, les autres sont des animaux de compagnie.' },
  { prompt: 'Lequel n\'est pas un moyen de transport ?', answer: 'boulangerie', wrong: ['vélo', 'bus', 'avion'], explanation: 'Boulangerie est un commerce, les autres sont des transports.' },
  { prompt: 'Lequel ne peut pas voler ?', answer: 'poule', wrong: ['aigle', 'hirondelle', 'papillon'], explanation: 'La poule ne vole pas malgré ses ailes.' },
  { prompt: 'Lequel ne vit pas dans l\'eau ?', answer: 'chameau', wrong: ['poisson', 'dauphin', 'grenouille'], explanation: 'Le chameau vit dans le désert, pas dans l\'eau.' },
  { prompt: 'Lequel n\'est pas une couleur ?', answer: 'sucre', wrong: ['rouge', 'vert', 'bleu'], explanation: 'Sucre est un aliment, les autres sont des couleurs.' },

  // ── Patterns / sequences ──
  { prompt: 'Complète la série : 🔵 🔴 🔵 🔴 … quel vient ensuite ?', answer: '🔵', wrong: ['🔴', '🟡', '🟢'], explanation: 'Le motif alterne bleu et rouge → bleu est le suivant.' },
  { prompt: 'Complète la série : ⭐ ⭐ 🌙 ⭐ ⭐ 🌙 … quel vient ensuite ?', answer: '⭐', wrong: ['🌙', '☀️', '🌟'], explanation: 'Le motif est 2 étoiles puis 1 lune → étoile est la suivante.' },
  { prompt: 'Complète la série : 1 3 5 7 … quel nombre vient ensuite ?', answer: '9', wrong: ['8', '10', '6'], explanation: 'On ajoute 2 à chaque fois → après 7, on obtient 9.' },
  { prompt: 'Complète la série : 2 4 6 8 … quel nombre vient ensuite ?', answer: '10', wrong: ['9', '12', '7'], explanation: 'On ajoute 2 à chaque fois → après 8, on obtient 10.' },
  { prompt: 'Complète la série : 10 20 30 40 … quel nombre vient ensuite ?', answer: '50', wrong: ['45', '35', '60'], explanation: 'On ajoute 10 à chaque fois → après 40, on obtient 50.' },
  { prompt: 'Complète la série : 🟦 🟥 🟦 🟥 🟦 … quel vient ensuite ?', answer: '🟥', wrong: ['🟦', '🟨', '🟩'], explanation: 'Le motif alterne carré bleu / rouge → rouge est le suivant.' },
  { prompt: 'Complète la série : 5 10 15 20 25 … quel nombre vient ensuite ?', answer: '30', wrong: ['28', '35', '27'], explanation: 'On ajoute 5 à chaque fois → après 25, on obtient 30.' },
  { prompt: 'Complète la série : 1 2 3 4 5 … quel nombre vient ensuite ?', answer: '6', wrong: ['7', '8', '9'], explanation: 'On ajoute 1 à chaque fois → après 5, on obtient 6.' },
  { prompt: 'Complète la série : 3 6 9 12 … quel nombre vient ensuite ?', answer: '15', wrong: ['14', '16', '18'], explanation: 'On ajoute 3 à chaque fois → après 12, on obtient 15.' },
  { prompt: 'Complète la série : 🔴 🔴 🔵 🔴 🔴 🔵 … quel vient ensuite ?', answer: '🔴', wrong: ['🔵', '🟡', '🟢'], explanation: 'Le motif est 2 rouges puis 1 bleu → rouge est le suivant.' },

  // ── Classification ──
  { prompt: 'Quel objet peut aller dans la catégorie « école » ?', answer: 'crayon', wrong: ['banane', 'oreiller', 'savon'], explanation: 'Crayon appartient à la catégorie école.' },
  { prompt: 'Quel animal vit dans la mer ?', answer: 'dauphin', wrong: ['lion', 'vache', 'lapin'], explanation: 'Le dauphin vit dans la mer.' },
  { prompt: 'Quel aliment est un légume ?', answer: 'carotte', wrong: ['banane', 'pomme', 'poire'], explanation: 'La carotte est un légume.' },
  { prompt: 'Lequel de ces mots est un moyen de transport ?', answer: 'train', wrong: ['chaise', 'manteau', 'maison'], explanation: 'Le train est un moyen de transport.' },
  { prompt: 'Lequel de ces animaux est un oiseau ?', answer: 'pingouin', wrong: ['lion', 'dauphin', 'grenouille'], explanation: 'Le pingouin est un oiseau (même s\'il ne vole pas).' },
  { prompt: 'Lequel de ces aliments est sucré ?', answer: 'chocolat', wrong: ['sel', 'vinaigre', 'moutarde'], explanation: 'Le chocolat est sucré, les autres sont salés ou acides.' },
  { prompt: 'Lequel est un outil ?', answer: 'marteau', wrong: ['pomme', 'nuage', 'rivière'], explanation: 'Le marteau est un outil de bricolage.' },
  { prompt: 'Lequel de ces mots est un prénom ?', answer: 'Emma', wrong: ['table', 'courir', 'rouge'], explanation: 'Emma est un prénom, les autres sont un objet, un verbe et une couleur.' },

  // ── Simple deduction ──
  { prompt: 'Tom a 5 bonbons. Il en donne 2. Lui en reste-t-il plus ou moins de 4 ?', answer: 'Moins de 4', wrong: ['Plus de 4', 'Exactement 4', 'Autant'], explanation: '5 - 2 = 3, qui est moins que 4.' },
  { prompt: 'Mia est plus grande que Luc. Luc est plus grand que Sam. Qui est le plus petit ?', answer: 'Sam', wrong: ['Luc', 'Mia', 'C\'est pareil'], explanation: 'Sam est le plus petit car Luc est plus grand que lui et Mia encore plus grande.' },
  { prompt: 'J\'ai 3 crayons. Mon ami en a 2 de plus que moi. Combien en a-t-il ?', answer: '5', wrong: ['4', '6', '3'], explanation: '3 + 2 = 5 crayons.' },
  { prompt: 'Une boîte a 4 balles rouges et 2 bleues. Il y a plus de balles de quelle couleur ?', answer: 'Rouges', wrong: ['Bleues', 'Autant des deux', 'Vertes'], explanation: '4 > 2, donc il y a plus de balles rouges.' },
  { prompt: 'Si aujourd\'hui c\'est lundi, quel jour sera-t-il dans 2 jours ?', answer: 'Mercredi', wrong: ['Mardi', 'Jeudi', 'Dimanche'], explanation: 'Lundi → Mardi → Mercredi.' },
  { prompt: 'Léa a 10 autocollants. Elle en colle 4. Combien lui en reste-t-il ?', answer: '6', wrong: ['5', '7', '4'], explanation: '10 - 4 = 6 autocollants.' },
];

const LOGIC_P3 = [
  // ── Patterns P3 ──
  { prompt: 'Complète la série : 5 10 15 20 … quel nombre vient ensuite ?', answer: '25', wrong: ['22', '30', '24'], explanation: 'On ajoute 5 à chaque fois → après 20, on obtient 25.' },
  { prompt: 'Complète la série : 100 90 80 70 … quel nombre vient ensuite ?', answer: '60', wrong: ['65', '55', '50'], explanation: 'On enlève 10 à chaque fois → après 70, on obtient 60.' },
  { prompt: 'Complète la série : 1 2 4 8 16 … quel nombre vient ensuite ?', answer: '32', wrong: ['18', '24', '20'], explanation: 'On multiplie par 2 à chaque fois → après 16, on obtient 32.' },
  { prompt: 'Complète la série : 7 14 21 28 … quel nombre vient ensuite ?', answer: '35', wrong: ['32', '42', '30'], explanation: 'La table de 7 : +7 à chaque étape → 28 + 7 = 35.' },
  { prompt: 'Complète la série : 1 4 9 16 25 … quel nombre vient ensuite ?', answer: '36', wrong: ['30', '49', '32'], explanation: 'Ce sont les carrés : 1², 2², 3², 4², 5², 6² = 36.' },
  { prompt: 'Complète la série : 50 45 40 35 … quel nombre vient ensuite ?', answer: '30', wrong: ['25', '32', '28'], explanation: 'On enlève 5 à chaque fois → 35 - 5 = 30.' },
  { prompt: 'Complète la série : 2 6 18 54 … quel nombre vient ensuite ?', answer: '162', wrong: ['108', '81', '200'], explanation: 'On multiplie par 3 à chaque fois → 54 × 3 = 162.' },
  { prompt: 'Complète la série : 64 32 16 8 … quel nombre vient ensuite ?', answer: '4', wrong: ['2', '6', '3'], explanation: 'On divise par 2 à chaque fois → 8 ÷ 2 = 4.' },

  // ── Analogy ──
  { prompt: 'Chaud est à Froid ce que Grand est à … ?', answer: 'Petit', wrong: ['Rapide', 'Bleu', 'Lourd'], explanation: 'Chaud/Froid et Grand/Petit sont des paires de contraires.' },
  { prompt: 'Un stylo sert à écrire. Une fourchette sert à … ?', answer: 'Manger', wrong: ['Dessiner', 'Couper', 'Coller'], explanation: 'Une fourchette est un ustensile pour manger.' },
  { prompt: 'La pluie tombe du ciel. Le poisson nage dans … ?', answer: 'L\'eau', wrong: ['L\'air', 'La forêt', 'Le sable'], explanation: 'Le poisson nage dans l\'eau.' },
  { prompt: 'Chien est à aboyer ce que chat est à … ?', answer: 'Miauler', wrong: ['Bêler', 'Rugir', 'Siffler'], explanation: 'Le chien aboie et le chat miaule.' },
  { prompt: 'Lundi est au début de la semaine. Décembre est … l\'année.', answer: 'À la fin de', wrong: ['Au début de', 'Au milieu de', 'Au cœur de'], explanation: 'Décembre est le 12ème mois, donc à la fin de l\'année.' },
  { prompt: 'L\'oiseau a des plumes. Le poisson a … ?', answer: 'Des écailles', wrong: ['Des poils', 'Des plumes', 'Des cornes'], explanation: 'Les poissons ont des écailles pour se protéger.' },
  { prompt: 'Pied est à chaussure ce que main est à … ?', answer: 'Gant', wrong: ['Manteau', 'Chapeau', 'Chaussette'], explanation: 'On met une chaussure au pied et un gant à la main.' },
  { prompt: 'Le médecin soigne les gens. L\'enseignant … les élèves.', answer: 'Instruit', wrong: ['Guérit', 'Construit', 'Nourrit'], explanation: 'L\'enseignant instruit et éduque les élèves.' },

  // ── Deduction P3 ──
  { prompt: 'Alice, Bob et Clara ont 3 couleurs : rouge, bleu, vert. Alice a le rouge. Bob n\'a pas le vert. Quelle couleur a Clara ?', answer: 'Le vert', wrong: ['Le rouge', 'Le bleu', 'L\'orange'], explanation: 'Alice a rouge, Bob a bleu (pas vert), donc Clara a le vert.' },
  { prompt: 'Un nombre est supérieur à 20 et inférieur à 25. Il est pair. Lequel ?', answer: '22 ou 24', wrong: ['21', '23', '20'], explanation: '22 et 24 sont les seuls nombres pairs entre 20 et 25 (exclus).' },
  { prompt: 'Si j\'ai 4 groupes de 3 objets, combien d\'objets en tout ?', answer: '12', wrong: ['7', '14', '10'], explanation: '4 × 3 = 12.' },
  { prompt: 'Dans une course, Zoé finit avant Lina mais après Tom. Qui est deuxième ?', answer: 'Zoé', wrong: ['Lina', 'Tom', 'On ne sait pas'], explanation: 'Tom (1er) → Zoé (2e) → Lina (3e).' },
  { prompt: 'Léo a plus de 10 billes mais moins de 15. Son nombre est impair. Lequel ?', answer: '11 ou 13', wrong: ['12', '14', '10'], explanation: 'Les nombres impairs entre 10 et 15 exclus sont 11 et 13.' },
  { prompt: 'Si toutes les fleurs ont des pétales, et une rose est une fleur, alors une rose a … ?', answer: 'Des pétales', wrong: ['Des racines seulement', 'Rien', 'Des épines seulement'], explanation: 'Toutes les fleurs ont des pétales, une rose est une fleur, donc une rose a des pétales.' },
  { prompt: 'Paul a 3 ans de plus que Marie. Marie a 8 ans. Quel âge a Paul ?', answer: '11 ans', wrong: ['5 ans', '10 ans', '9 ans'], explanation: '8 + 3 = 11 ans.' },

  // ── Category P3 ──
  { prompt: 'Lequel n\'est pas un type d\'énergie ?', answer: 'Chaise', wrong: ['Soleil', 'Vent', 'Eau'], explanation: 'Une chaise n\'est pas une source d\'énergie.' },
  { prompt: 'Lequel de ces pays n\'est pas en Europe ?', answer: 'Mexique', wrong: ['France', 'Espagne', 'Belgique'], explanation: 'Le Mexique est en Amérique du Nord, pas en Europe.' },
  { prompt: 'Lequel n\'est pas un nombre premier ?', answer: '9', wrong: ['2', '5', '7'], explanation: '9 = 3 × 3, donc ce n\'est pas un nombre premier. 2, 5, 7 sont premiers.' },
  { prompt: 'Lequel est un quadrilatère ?', answer: 'Rectangle', wrong: ['Triangle', 'Cercle', 'Pentagone'], explanation: 'Un rectangle a 4 côtés, c\'est donc un quadrilatère.' },

  // ── Spatial reasoning ──
  { prompt: 'Un carré a 4 côtés. Combien de côtés ont 3 carrés ?', answer: '12', wrong: ['8', '10', '16'], explanation: '3 × 4 = 12 côtés au total.' },
  { prompt: 'Si on tourne un carré de 90°, quelle forme obtient-on ?', answer: 'Un carré', wrong: ['Un rectangle', 'Un losange', 'Un triangle'], explanation: 'Un carré reste un carré après une rotation de 90°.' },
  { prompt: 'Combien y a-t-il de sommets dans un triangle ?', answer: '3', wrong: ['4', '2', '5'], explanation: 'Un triangle a 3 angles = 3 sommets.' },
];

const LOGIC_P4 = [
  // ── Hard sequences ──
  { prompt: 'Complète la série : 2 3 5 8 13 21 … quel nombre vient ensuite ?', answer: '34', wrong: ['30', '42', '28'], explanation: 'Suite de Fibonacci : chaque nombre = somme des deux précédents. 21 + 13 = 34.' },
  { prompt: 'Complète la série : 1 1 2 3 5 8 … quel nombre vient ensuite ?', answer: '13', wrong: ['11', '16', '10'], explanation: 'Suite de Fibonacci : 5 + 8 = 13.' },
  { prompt: 'Complète la série : 2 4 8 16 32 … quel nombre vient ensuite ?', answer: '64', wrong: ['48', '56', '60'], explanation: 'On double à chaque fois → 32 × 2 = 64.' },
  { prompt: 'Complète la série : 81 27 9 3 … quel nombre vient ensuite ?', answer: '1', wrong: ['2', '0', '3'], explanation: 'On divise par 3 à chaque fois → 3 ÷ 3 = 1.' },

  // ── Complex deduction ──
  { prompt: 'Dans une famille, il y a 2 parents et 3 enfants. Combien de mains y a-t-il en tout ?', answer: '10', wrong: ['8', '6', '12'], explanation: '5 personnes × 2 mains = 10 mains.' },
  { prompt: 'Si A > B et B > C, alors quelle relation y a-t-il entre A et C ?', answer: 'A > C', wrong: ['A < C', 'A = C', 'On ne sait pas'], explanation: 'Si A > B et B > C, par transitivité A > C.' },
  { prompt: 'Un train part à 9h et arrive à 11h30. Combien de temps dure le trajet ?', answer: '2h30', wrong: ['1h30', '3h', '2h'], explanation: 'De 9h à 11h30 = 2 heures et 30 minutes.' },
  { prompt: 'Si 5 crayons coûtent 10€, combien coûtent 3 crayons ?', answer: '6€', wrong: ['5€', '8€', '15€'], explanation: '1 crayon = 2€, donc 3 × 2 = 6€.' },

  // ── Probability & logic ──
  { prompt: 'Dans un sac : 3 billes rouges, 1 bleue. Quelle couleur a-t-on le plus de chance de tirer ?', answer: 'Rouge', wrong: ['Bleue', 'Autant de chance', 'Aucune idée'], explanation: '3 rouges contre 1 bleue → plus de chance de tirer rouge.' },
  { prompt: 'Si on lance un dé, quelle est la probabilité d\'obtenir un 6 ?', answer: '1 chance sur 6', wrong: ['1 sur 2', '1 sur 3', '2 sur 6'], explanation: 'Un dé a 6 faces numérotées 1 à 6, donc 1 chance sur 6 d\'avoir un 6.' },
];

function generateNumberSequence(params) {
  const { difficulty, grade } = params;
  const isHard = grade === 'P4' || difficulty === 'hard';
  const isMedium = grade === 'P3' || difficulty === 'medium';

  if (isHard) {
    const type = randomInt(0, 2);
    if (type === 0) {
      // Geometric sequence ×2 or ×3
      const mult = [2, 3][randomInt(0, 1)];
      const start = randomInt(2, 6);
      const seq = [start, start * mult, start * mult ** 2, start * mult ** 3];
      const next = start * mult ** 4;
      return {
        prompt: `Complète la suite : ${seq.join(' – ')} – ?`,
        answer: String(next),
        wrong: [String(next + mult), String(next - 2), String(next * 2)],
        explanation: `On multiplie par ${mult} à chaque fois → ${seq[3]} × ${mult} = ${next}.`
      };
    }
    if (type === 1) {
      // Fibonacci-style
      const a = randomInt(1, 4), b = randomInt(2, 5);
      const c = a + b, d = b + c, e = c + d;
      return {
        prompt: `Complète la suite : ${a} – ${b} – ${c} – ${d} – ?`,
        answer: String(e),
        wrong: [String(e + 1), String(e - 1), String(d + a)],
        explanation: `Chaque terme = somme des deux précédents. ${c} + ${d} = ${e}.`
      };
    }
    // Alternating +/×
    const base = randomInt(5, 15);
    const seq2 = [base, base + 3, (base + 3) * 2, (base + 3) * 2 + 3];
    const next2 = seq2[3] * 2;
    return {
      prompt: `Complète la suite : ${seq2.join(' – ')} – ?`,
      answer: String(next2),
      wrong: [String(next2 + 3), String(next2 - 2), String(seq2[3] + 6)],
      explanation: `Règle : +3 puis ×2, alternativement. ${seq2[3]} × 2 = ${next2}.`
    };
  }

  if (isMedium) {
    const step = [3, 4, 5, 6, 7, 10][randomInt(0, 5)];
    const isDesc = Math.random() > 0.5;
    const start = isDesc ? randomInt(40, 80) : randomInt(1, 20);
    const seq = isDesc
      ? [start, start - step, start - step * 2, start - step * 3]
      : [start, start + step, start + step * 2, start + step * 3];
    const next = isDesc ? start - step * 4 : start + step * 4;
    return {
      prompt: `Complète la suite : ${seq.join(' – ')} – ?`,
      answer: String(next),
      wrong: [String(next + 1), String(next - 1), String(next + step)],
      explanation: `On ${isDesc ? 'enlève' : 'ajoute'} ${step} à chaque étape → ${seq[3]} ${isDesc ? '-' : '+'} ${step} = ${next}.`
    };
  }

  // Easy: simple +2, +5, +10
  const step = [2, 5, 10][randomInt(0, 2)];
  const start = randomInt(1, 20);
  const seq = [start, start + step, start + step * 2, start + step * 3];
  const next = start + step * 4;
  return {
    prompt: `Complète la suite : ${seq.join(' – ')} – ?`,
    answer: String(next),
    wrong: [String(next + 1), String(next - 1), String(next + step)],
    explanation: `On ajoute ${step} à chaque étape → ${seq[3]} + ${step} = ${next}.`
  };
}

export function generateLogicExercise({ grade, difficulty }) {
  const useGenerated = Math.random() < 0.45;

  if (useGenerated) {
    const seq = generateNumberSequence({ difficulty, grade });
    return createExercise({
      question: seq.prompt,
      options: uniqueOptions(seq.answer, seq.wrong),
      correct: seq.answer,
      type: 'logic_reasoning',
      level: gradeToLabel(grade),
      explanation: seq.explanation
    });
  }

  let pool;
  if (grade === 'P4' || difficulty === 'hard') {
    pool = [...LOGIC_P3, ...LOGIC_P4];
  } else if (grade === 'P3' || difficulty === 'medium') {
    pool = [...LOGIC_P2.slice(10), ...LOGIC_P3];
  } else {
    pool = LOGIC_P2;
  }

  const item = sample(pool);
  return createExercise({
    question: item.prompt,
    options: uniqueOptions(item.answer, item.wrong),
    correct: item.answer,
    type: 'logic_reasoning',
    level: gradeToLabel(grade),
    explanation: item.explanation
  });
}
