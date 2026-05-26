import { createExercise, gradeToLabel, randomInt, sample, uniqueOptions } from './generatorUtils.js';

// ─── LIQUID VOLUME ────────────────────────────────────────────────────────────
const LIQUID_EASY = [
  () => {
    const v = randomInt(1, 5) * 100;
    return {
      prompt: `Une bouteille contient ${v} ml. Quelle est sa contenance ?`,
      correct: `${v} ml`,
      wrong: [`${v + 100} ml`, `${v - 100} ml`, `${v * 2} ml`],
      explanation: `La bouteille contient ${v} ml.`
    };
  },
  () => {
    const l = randomInt(1, 4);
    return {
      prompt: `Un pichet contient ${l} litre${l > 1 ? 's' : ''}. Combien de millilitres cela fait-il ?`,
      correct: `${l * 1000} ml`,
      wrong: [`${l * 100} ml`, `${l * 10} ml`, `${(l + 1) * 1000} ml`],
      explanation: `1 litre = 1 000 ml, donc ${l} L = ${l * 1000} ml.`
    };
  },
  () => {
    const cl = randomInt(10, 50);
    return {
      prompt: `Un verre contient ${cl} cl. Quelle valeur correspond ?`,
      correct: `${cl * 10} ml`,
      wrong: [`${cl} ml`, `${cl * 100} ml`, `${cl + 10} ml`],
      explanation: `1 cl = 10 ml, donc ${cl} cl = ${cl * 10} ml.`
    };
  }
];

const LIQUID_MEDIUM = [
  () => {
    const ml = randomInt(1, 9) * 100;
    const rest = 1000 - ml;
    return {
      prompt: `Un litre est presque plein, il reste ${rest} ml vides. Combien y a-t-il de liquide ?`,
      correct: `${ml} ml`,
      wrong: [`${ml + 100} ml`, `${ml - 100} ml`, `${rest} ml`],
      explanation: `1 000 ml - ${rest} ml = ${ml} ml.`
    };
  },
  () => {
    const a = randomInt(2, 5) * 250;
    const b = randomInt(1, 3) * 250;
    const total = a + b;
    return {
      prompt: `On verse ${a} ml puis ${b} ml dans un bol. Quelle est la quantité totale ?`,
      correct: `${total} ml`,
      wrong: [`${total + 250} ml`, `${total - 250} ml`, `${a} ml`],
      explanation: `${a} ml + ${b} ml = ${total} ml.`
    };
  },
  () => {
    const l = randomInt(1, 3);
    const cl = randomInt(1, 9) * 10;
    const ml = l * 1000 + cl * 10;
    return {
      prompt: `Une bouteille contient ${l} L et ${cl} cl. Combien de millilitres au total ?`,
      correct: `${ml} ml`,
      wrong: [`${ml + 100} ml`, `${l * 1000} ml`, `${ml - 200} ml`],
      explanation: `${l} L = ${l * 1000} ml + ${cl} cl = ${cl * 10} ml → total ${ml} ml.`
    };
  }
];

const LIQUID_HARD = [
  () => {
    const total = randomInt(2, 5) * 500;
    const used = randomInt(1, 3) * 250;
    const left = total - used;
    return {
      prompt: `Un récipient de ${total} ml est utilisé à hauteur de ${used} ml. Quelle quantité reste-t-il ?`,
      correct: `${left} ml`,
      wrong: [`${left + 250} ml`, `${left - 250} ml`, `${total} ml`],
      explanation: `${total} ml - ${used} ml = ${left} ml.`
    };
  },
  () => {
    const cups = randomInt(3, 6);
    const perCup = randomInt(1, 4) * 50;
    const total = cups * perCup;
    return {
      prompt: `${cups} verres identiques contiennent chacun ${perCup} ml. Combien de millilitres en tout ?`,
      correct: `${total} ml`,
      wrong: [`${total + perCup} ml`, `${total - perCup} ml`, `${cups + perCup} ml`],
      explanation: `${cups} × ${perCup} ml = ${total} ml.`
    };
  }
];

// ─── LENGTH ───────────────────────────────────────────────────────────────────
const LENGTH_EASY = [
  () => {
    const cm = randomInt(10, 50);
    return {
      prompt: `Une règle mesure ${cm} cm. Quelle est sa longueur ?`,
      correct: `${cm} cm`,
      wrong: [`${cm + 5} cm`, `${cm - 5} cm`, `${cm} mm`],
      explanation: `La règle mesure ${cm} cm.`
    };
  },
  () => {
    const m = randomInt(1, 10);
    return {
      prompt: `Une corde fait ${m} mètre${m > 1 ? 's' : ''}. Combien de centimètres cela fait-il ?`,
      correct: `${m * 100} cm`,
      wrong: [`${m * 10} cm`, `${m * 1000} cm`, `${m + 100} cm`],
      explanation: `1 m = 100 cm, donc ${m} m = ${m * 100} cm.`
    };
  },
  () => {
    const mm = randomInt(10, 50);
    return {
      prompt: `Un clou mesure ${mm} mm. Combien de centimètres ?`,
      correct: `${mm / 10} cm`,
      wrong: [`${mm} cm`, `${mm * 10} cm`, `${mm / 10 + 1} cm`],
      explanation: `10 mm = 1 cm, donc ${mm} mm = ${mm / 10} cm.`
    };
  }
];

const LENGTH_MEDIUM = [
  () => {
    const a = randomInt(30, 80);
    const b = randomInt(10, 40);
    return {
      prompt: `Tom marche ${a} cm, puis encore ${b} cm. Quelle distance totale ?`,
      correct: `${a + b} cm`,
      wrong: [`${a + b + 10} cm`, `${a + b - 10} cm`, `${a} cm`],
      explanation: `${a} cm + ${b} cm = ${a + b} cm.`
    };
  },
  () => {
    const m = randomInt(2, 8);
    const cm = randomInt(10, 90);
    const total = m * 100 + cm;
    return {
      prompt: `Un ruban mesure ${m} m et ${cm} cm. Combien de centimètres en tout ?`,
      correct: `${total} cm`,
      wrong: [`${total + 10} cm`, `${m * 100} cm`, `${total - 10} cm`],
      explanation: `${m} m = ${m * 100} cm + ${cm} cm = ${total} cm.`
    };
  },
  () => {
    const km = randomInt(1, 5);
    return {
      prompt: `La ville est à ${km} km. Combien de mètres doit-on parcourir ?`,
      correct: `${km * 1000} m`,
      wrong: [`${km * 100} m`, `${km * 10} m`, `${(km + 1) * 1000} m`],
      explanation: `1 km = 1 000 m, donc ${km} km = ${km * 1000} m.`
    };
  }
];

const LENGTH_HARD = [
  () => {
    const total = randomInt(3, 8) * 100;
    const cut = randomInt(50, 150);
    const left = total - cut;
    return {
      prompt: `Un fil de ${total} cm. On en coupe ${cut} cm. Combien reste-t-il ?`,
      correct: `${left} cm`,
      wrong: [`${left + 50} cm`, `${left - 50} cm`, `${cut} cm`],
      explanation: `${total} cm - ${cut} cm = ${left} cm.`
    };
  },
  () => {
    const sides = randomInt(3, 6);
    const len = randomInt(4, 12);
    return {
      prompt: `Un polygone régulier à ${sides} côtés mesure ${len} cm de côté. Quel est son périmètre ?`,
      correct: `${sides * len} cm`,
      wrong: [`${sides * len + len} cm`, `${sides * len - len} cm`, `${sides + len} cm`],
      explanation: `Périmètre = ${sides} × ${len} cm = ${sides * len} cm.`
    };
  },
  () => {
    const l = randomInt(5, 15);
    const w = randomInt(3, 9);
    return {
      prompt: `Un rectangle a une longueur de ${l} cm et une largeur de ${w} cm. Quel est son périmètre ?`,
      correct: `${2 * (l + w)} cm`,
      wrong: [`${l + w} cm`, `${l * w} cm`, `${2 * l + w} cm`],
      explanation: `P = 2 × (${l} + ${w}) = 2 × ${l + w} = ${2 * (l + w)} cm.`
    };
  }
];

// ─── MASS ─────────────────────────────────────────────────────────────────────
const MASS_EASY = [
  () => {
    const kg = randomInt(1, 10);
    return {
      prompt: `Un sac de farine pèse ${kg} kg. Combien de grammes ?`,
      correct: `${kg * 1000} g`,
      wrong: [`${kg * 100} g`, `${kg} g`, `${(kg + 1) * 1000} g`],
      explanation: `1 kg = 1 000 g, donc ${kg} kg = ${kg * 1000} g.`
    };
  },
  () => {
    const g = randomInt(2, 9) * 100;
    return {
      prompt: `Un paquet pèse ${g} g. Est-ce plus ou moins que 1 kg ?`,
      correct: `${g < 1000 ? 'Moins' : 'Plus'} que 1 kg`,
      wrong: [`${g < 1000 ? 'Plus' : 'Moins'} que 1 kg`, `Exactement 1 kg`, `${g} kg`],
      explanation: `1 kg = 1 000 g. ${g} g est ${g < 1000 ? 'inférieur' : 'supérieur'} à 1 000 g.`
    };
  }
];

const MASS_MEDIUM = [
  () => {
    const kg = randomInt(1, 3);
    const g = randomInt(1, 9) * 100;
    const total = kg * 1000 + g;
    return {
      prompt: `Un colis pèse ${kg} kg et ${g} g. Combien de grammes au total ?`,
      correct: `${total} g`,
      wrong: [`${total + 100} g`, `${kg * 1000} g`, `${total - 100} g`],
      explanation: `${kg} kg = ${kg * 1000} g + ${g} g = ${total} g.`
    };
  },
  () => {
    const a = randomInt(2, 5) * 200;
    const b = randomInt(1, 4) * 200;
    return {
      prompt: `Un fruit pèse ${a} g et un autre ${b} g. Quel est le poids total ?`,
      correct: `${a + b} g`,
      wrong: [`${a + b + 200} g`, `${a + b - 200} g`, `${a} g`],
      explanation: `${a} g + ${b} g = ${a + b} g.`
    };
  }
];

const MASS_HARD = [
  () => {
    const total = randomInt(2, 5) * 500;
    const taken = randomInt(1, 3) * 200;
    const left = total - taken;
    return {
      prompt: `Un sac contient ${total} g de riz. On en prend ${taken} g. Combien reste-t-il ?`,
      correct: `${left} g`,
      wrong: [`${left + 100} g`, `${left - 100} g`, `${taken} g`],
      explanation: `${total} g - ${taken} g = ${left} g.`
    };
  },
  () => {
    const bags = randomInt(3, 7);
    const perBag = randomInt(2, 5) * 100;
    const total = bags * perBag;
    return {
      prompt: `${bags} sacs identiques pèsent chacun ${perBag} g. Quel est le poids total ?`,
      correct: `${total} g`,
      wrong: [`${total + perBag} g`, `${total - perBag} g`, `${bags * 1000} g`],
      explanation: `${bags} × ${perBag} g = ${total} g.`
    };
  }
];

// ─── MAIN GENERATOR ───────────────────────────────────────────────────────────
const POOL = {
  easy: [...LIQUID_EASY, ...LENGTH_EASY, ...MASS_EASY],
  medium: [...LIQUID_EASY, ...LIQUID_MEDIUM, ...LENGTH_EASY, ...LENGTH_MEDIUM, ...MASS_EASY, ...MASS_MEDIUM],
  hard: [...LIQUID_MEDIUM, ...LIQUID_HARD, ...LENGTH_MEDIUM, ...LENGTH_HARD, ...MASS_MEDIUM, ...MASS_HARD]
};

export function generateMeasurementExercise({ grade, difficulty }) {
  const level = difficulty === 'hard' ? 'hard' : difficulty === 'medium' ? 'medium' : 'easy';
  const pool = POOL[level];
  const template = sample(pool);
  const data = template();

  return createExercise({
    question: data.prompt,
    options: uniqueOptions(data.correct, data.wrong),
    correct: data.correct,
    type: 'math_measurement',
    level: gradeToLabel(grade),
    explanation: data.explanation
  });
}
