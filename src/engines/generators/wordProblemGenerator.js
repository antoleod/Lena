import { createExercise, gradeToLabel, randomInt, sample, uniqueOptions } from './generatorUtils.js';

// ─── WORD PROBLEMS TEMPLATES ──────────────────────────────────────────────
// 40+ dynamic templates covering: shopping, school, nature, sports, family, time, sharing

const TEMPLATES_P2 = [
  // ── Addition ──
  {
    generate: () => {
      const a = randomInt(5, 15), b = randomInt(3, 10);
      return { prompt: `Léna a ${a} bonbons. Léo lui en donne ${b}. Combien de bonbons a Léna maintenant ?`, correct: a + b, wrong: [a + b + 1, a + b - 1, a + b + 2], explanation: `Addition : ${a} + ${b} = ${a + b}.` };
    }
  },
  {
    generate: () => {
      const a = randomInt(10, 20), b = randomInt(5, 12);
      return { prompt: `Dans la classe, il y a ${a} garçons et ${b} filles. Combien d'élèves y a-t-il en tout ?`, correct: a + b, wrong: [a + b - 2, a + b + 1, a + b + 3], explanation: `On additionne : ${a} + ${b} = ${a + b}.` };
    }
  },
  {
    generate: () => {
      const a = randomInt(4, 10), b = randomInt(3, 8);
      return { prompt: `Il y a ${a} poules et ${b} lapins dans la ferme. Combien d'animaux y a-t-il en tout ?`, correct: a + b, wrong: [a + b - 1, a + b + 2, a + b + 1], explanation: `${a} + ${b} = ${a + b} animaux.` };
    }
  },
  {
    generate: () => {
      const a = randomInt(6, 12), b = randomInt(4, 9);
      return { prompt: `Le matin, ${a} oiseaux sont sur l'arbre. L'après-midi, ${b} autres arrivent. Combien y en a-t-il en tout ?`, correct: a + b, wrong: [a + b - 1, a + b + 1, a - b], explanation: `${a} + ${b} = ${a + b} oiseaux.` };
    }
  },
  {
    generate: () => {
      const a = randomInt(8, 15), b = randomInt(5, 10);
      return { prompt: `Maman achète ${a} pommes et ${b} poires. Combien de fruits a-t-elle en tout ?`, correct: a + b, wrong: [a + b + 1, a + b - 2, a * b], explanation: `${a} + ${b} = ${a + b} fruits.` };
    }
  },
  // ── Subtraction ──
  {
    generate: () => {
      const a = randomInt(15, 25), b = randomInt(4, 12);
      return { prompt: `Tom avait ${a} billes. Il en perd ${b} à la récréation. Combien de billes lui reste-t-il ?`, correct: a - b, wrong: [a - b + 1, a - b - 1, a - b + 2], explanation: `Soustraction : ${a} - ${b} = ${a - b}.` };
    }
  },
  {
    generate: () => {
      const a = randomInt(12, 18), b = randomInt(3, 8);
      return { prompt: `Le boulanger a préparé ${a} croissants. Il en vend ${b}. Combien lui en reste-t-il ?`, correct: a - b, wrong: [a - b + 1, a - b - 2, a - b + 3], explanation: `${a} - ${b} = ${a - b} croissants.` };
    }
  },
  {
    generate: () => {
      const a = randomInt(10, 20), b = randomInt(3, 7);
      return { prompt: `Clara a ${a} autocollants. Elle en offre ${b} à sa copine. Combien lui en reste-t-il ?`, correct: a - b, wrong: [a - b + 2, a - b - 1, a + b], explanation: `${a} - ${b} = ${a - b} autocollants.` };
    }
  },
  {
    generate: () => {
      const a = randomInt(20, 30), b = randomInt(8, 15);
      return { prompt: `Il y a ${a} enfants dans le parc. ${b} rentrent à la maison. Combien d'enfants restent ?`, correct: a - b, wrong: [a - b + 1, a + b, a - b - 1], explanation: `${a} - ${b} = ${a - b} enfants.` };
    }
  },
];

const TEMPLATES_P3 = [
  // ── Multiplication ──
  {
    generate: () => {
      const a = randomInt(3, 6), b = randomInt(4, 8);
      return { prompt: `Mia achète ${a} paquets de cartes. Chaque paquet contient ${b} cartes. Combien de cartes a-t-elle en tout ?`, correct: a * b, wrong: [a * b + 2, a * b - 1, a * b + b], explanation: `${a} × ${b} = ${a * b}.` };
    }
  },
  {
    generate: () => {
      const a = randomInt(4, 8), b = randomInt(5, 10);
      return { prompt: `Il y a ${a} rangées de chaises. Chaque rangée a ${b} chaises. Combien y en a-t-il en tout ?`, correct: a * b, wrong: [a * b + 1, a * b - 2, a * b - b], explanation: `${a} × ${b} = ${a * b}.` };
    }
  },
  {
    generate: () => {
      const a = randomInt(5, 9), b = randomInt(3, 7);
      return { prompt: `Un bouquet contient ${b} fleurs. Sam prépare ${a} bouquets. Combien de fleurs en tout ?`, correct: a * b, wrong: [a * b - b, a * b + b, a + b], explanation: `${a} × ${b} = ${a * b} fleurs.` };
    }
  },
  {
    generate: () => {
      const a = randomInt(3, 5), b = randomInt(6, 10);
      return { prompt: `Chaque élève a ${b} crayons. Il y a ${a} élèves dans le groupe. Combien de crayons en tout ?`, correct: a * b, wrong: [a * b + a, a * b - b, a + b], explanation: `${a} × ${b} = ${a * b} crayons.` };
    }
  },
  {
    generate: () => {
      const a = randomInt(4, 7), b = randomInt(4, 8);
      return { prompt: `Un carton contient ${b} œufs. Il y a ${a} cartons. Combien d'œufs en tout ?`, correct: a * b, wrong: [a * b + 2, a * b - 4, a + b], explanation: `${a} × ${b} = ${a * b} œufs.` };
    }
  },
  // ── Division ──
  {
    generate: () => {
      const d = randomInt(3, 5), q = randomInt(4, 8);
      return { prompt: `Le pirate a ${d * q} pièces d'or. Il les partage entre ses ${d} amis. Combien chacun reçoit-il ?`, correct: q, wrong: [q + 1, q - 1, q + 2], explanation: `${d * q} ÷ ${d} = ${q}.` };
    }
  },
  {
    generate: () => {
      const d = randomInt(4, 6), q = randomInt(3, 9);
      return { prompt: `La maman prépare ${d * q} crêpes distribuées en ${d} assiettes égales. Combien par assiette ?`, correct: q, wrong: [q + 1, q - 1, q + 2], explanation: `${d * q} ÷ ${d} = ${q}.` };
    }
  },
  {
    generate: () => {
      const d = randomInt(3, 6), q = randomInt(5, 10);
      return { prompt: `${d * q} élèves sont répartis en ${d} groupes égaux. Combien d'élèves par groupe ?`, correct: q, wrong: [q + 2, q - 1, q * 2], explanation: `${d * q} ÷ ${d} = ${q} élèves par groupe.` };
    }
  },
  {
    generate: () => {
      const d = randomInt(2, 4), q = randomInt(6, 12);
      return { prompt: `Une boîte de ${d * q} bonbons est partagée entre ${d} enfants. Combien chaque enfant reçoit-il ?`, correct: q, wrong: [q + 1, q - 2, d * q], explanation: `${d * q} ÷ ${d} = ${q} bonbons.` };
    }
  },
  // ── Two-step problems ──
  {
    generate: () => {
      const a = randomInt(20, 30), b = randomInt(10, 15), c = randomInt(15, 25);
      const correct = (a + b) - c;
      return { prompt: `Un marchand a ${a} pommes. Un fermier lui en apporte ${b}. Il en vend ensuite ${c}. Combien lui en reste-t-il ?`, correct, wrong: [correct + 10, correct - 2, correct + 1], explanation: `(${a} + ${b}) - ${c} = ${a + b} - ${c} = ${correct}.` };
    }
  },
  {
    generate: () => {
      const a = randomInt(5, 8), b = randomInt(4, 7), c = randomInt(2, 4);
      const step1 = a * b, correct = step1 - c;
      return { prompt: `Emma cueille ${b} fraises dans chacun des ${a} carrés du jardin. Elle en mange ${c}. Combien de fraises lui reste-t-il ?`, correct, wrong: [correct + b, correct + c, correct - 2], explanation: `${a} × ${b} = ${step1}, puis ${step1} - ${c} = ${correct}.` };
    }
  },
  // ── Comparison ──
  {
    generate: () => {
      const a = randomInt(18, 30), b = randomInt(10, 17);
      const diff = a - b;
      return { prompt: `Alex a ${a} livres et Zoé en a ${b}. Combien de livres de plus a Alex ?`, correct: diff, wrong: [diff + 1, diff - 1, a + b], explanation: `${a} - ${b} = ${diff} livres de plus.` };
    }
  },
  {
    generate: () => {
      const b = randomInt(8, 15), diff = randomInt(3, 8), a = b + diff;
      return { prompt: `Sam a ${diff} billes de plus que Lena. Lena a ${b} billes. Combien en a Sam ?`, correct: a, wrong: [a + 1, a - 1, b - diff], explanation: `${b} + ${diff} = ${a} billes.` };
    }
  },
  // ── Money problems ──
  {
    generate: () => {
      const price = randomInt(3, 8), qty = randomInt(2, 5);
      return { prompt: `Un stylo coûte ${price}€. Paul en achète ${qty}. Combien paie-t-il en tout ?`, correct: price * qty, wrong: [price * qty + price, price * qty - 1, price + qty], explanation: `${price} × ${qty} = ${price * qty}€.` };
    }
  },
  {
    generate: () => {
      const total = randomInt(10, 20), spent = randomInt(4, 9), change = total - spent;
      return { prompt: `Nina a ${total}€. Elle achète un livre à ${spent}€. Combien lui reste-t-il ?`, correct: change, wrong: [change + 1, change - 1, total + spent], explanation: `${total} - ${spent} = ${change}€.` };
    }
  },
  // ── Time problems ──
  {
    generate: () => {
      const h1 = randomInt(8, 10), m1 = [0, 15, 30][randomInt(0, 2)];
      const dur = randomInt(1, 3);
      const h2 = h1 + dur, m2 = m1;
      return { prompt: `Le film commence à ${h1}h${m1 === 0 ? '' : m1} et dure ${dur} heure(s). À quelle heure se termine-t-il ?`, correct: `${h2}h${m2 === 0 ? '' : m2}`, wrong: [`${h2 + 1}h`, `${h2 - 1}h`, `${h1}h`], explanation: `${h1}h + ${dur}h = ${h2}h.` };
    }
  },
];

const TEMPLATES_P4 = [
  // ── Percentage basics ──
  {
    generate: () => {
      const total = randomInt(4, 10) * 10, pct = [10, 20, 25, 50][randomInt(0, 3)];
      const correct = total * pct / 100;
      return { prompt: `Dans une classe de ${total} élèves, ${pct}% ont un animal de compagnie. Combien d'élèves est-ce ?`, correct, wrong: [correct + 5, correct - 5, total - correct], explanation: `${total} × ${pct}/100 = ${correct} élèves.` };
    }
  },
  {
    generate: () => {
      const price = randomInt(10, 30) * 2, reduction = [10, 20, 25, 50][randomInt(0, 3)];
      const discount = price * reduction / 100, newPrice = price - discount;
      return { prompt: `Un jouet coûte ${price}€ avec une réduction de ${reduction}%. Quel est le nouveau prix ?`, correct: newPrice, wrong: [newPrice + 5, newPrice - 5, discount], explanation: `Réduction = ${price} × ${reduction}% = ${discount}€. Nouveau prix : ${price} - ${discount} = ${newPrice}€.` };
    }
  },
  // ── Perimeter/area basics ──
  {
    generate: () => {
      const l = randomInt(4, 10), w = randomInt(3, 8);
      return { prompt: `Un rectangle a une longueur de ${l} cm et une largeur de ${w} cm. Quel est son périmètre ?`, correct: 2 * (l + w), wrong: [l * w, 2 * l + w, l + w], explanation: `Périmètre = 2 × (${l} + ${w}) = 2 × ${l + w} = ${2 * (l + w)} cm.` };
    }
  },
  {
    generate: () => {
      const s = randomInt(3, 8);
      return { prompt: `Un carré a un côté de ${s} cm. Quelle est son aire ?`, correct: s * s, wrong: [s * 4, s + s, s * s + s], explanation: `Aire = côté² = ${s} × ${s} = ${s * s} cm².` };
    }
  },
  // ── Rate problems ──
  {
    generate: () => {
      const speed = randomInt(50, 80), time = randomInt(2, 4);
      return { prompt: `Un train roule à ${speed} km/h pendant ${time} heures. Quelle distance parcourt-il ?`, correct: speed * time, wrong: [speed * time + speed, speed + time, speed * time - 10], explanation: `Distance = vitesse × temps = ${speed} × ${time} = ${speed * time} km.` };
    }
  },
  {
    generate: () => {
      const rate = randomInt(3, 8), days = randomInt(4, 7);
      return { prompt: `Un escargot avance de ${rate} cm par jour. En ${days} jours, quelle distance parcourt-il ?`, correct: rate * days, wrong: [rate * days + rate, rate + days, rate * days - rate], explanation: `${rate} × ${days} = ${rate * days} cm.` };
    }
  },
  // ── Multi-step P4 ──
  {
    generate: () => {
      const priceEach = randomInt(4, 7), qty = randomInt(5, 9), paidWith = (Math.ceil(priceEach * qty / 10) + 1) * 10;
      const total = priceEach * qty, change = paidWith - total;
      return { prompt: `Des cahiers coûtent ${priceEach}€ chacun. Sophie en achète ${qty} et paie avec un billet de ${paidWith}€. Quelle est la monnaie ?`, correct: change, wrong: [change + 1, change - 1, total], explanation: `Total = ${priceEach} × ${qty} = ${total}€. Monnaie = ${paidWith} - ${total} = ${change}€.` };
    }
  },
];

export function generateWordProblemExercise({ grade, difficulty }) {
  let pool;
  if (grade === 'P4' || grade === 'P5' || grade === 'P6' || difficulty === 'hard') {
    pool = [...TEMPLATES_P3.slice(5), ...TEMPLATES_P4];
  } else if (grade === 'P3' || difficulty === 'medium') {
    pool = [...TEMPLATES_P2.slice(3), ...TEMPLATES_P3];
  } else {
    pool = TEMPLATES_P2;
  }

  const template = sample(pool);
  const data = template.generate();

  return createExercise({
    question: data.prompt,
    options: uniqueOptions(String(data.correct), data.wrong.map(String)),
    correct: String(data.correct),
    type: 'math_word_problem',
    level: gradeToLabel(grade),
    explanation: data.explanation
  });
}
