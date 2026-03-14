import { createExercise, gradeToLabel, randomInt, sample, uniqueOptions } from './generatorUtils.js';

// ─── WORD PROBLEMS TEMPLATES ──────────────────────────────────────────────
// Templates for dynamic word problem generation

const TEMPLATES_P2 = [
  // Addition
  {
    generate: () => {
      const a = randomInt(5, 15);
      const b = randomInt(3, 10);
      return {
        prompt: `Léna a ${a} bonbons. Léo lui en donne ${b}. Combien de bonbons a Léna maintenant ?`,
        correct: a + b,
        wrong: [a + b + 1, a + b - 1, a + b + 2],
        explanation: `On fait une addition : ${a} + ${b} = ${a + b}.`
      };
    }
  },
  {
    generate: () => {
      const a = randomInt(10, 20);
      const b = randomInt(5, 12);
      return {
        prompt: `Dans la classe, il y a ${a} garçons et ${b} filles. Combien d'élèves y a-t-il en tout ?`,
        correct: a + b,
        wrong: [a + b - 2, a + b + 1, a + b + 3],
        explanation: `On compte tout le monde : ${a} + ${b} = ${a + b}.`
      };
    }
  },
  // Subtraction
  {
    generate: () => {
      const a = randomInt(15, 25);
      const b = randomInt(4, 12);
      return {
        prompt: `Tom avait ${a} billes. Il en perd ${b} à la récréation. Combien de billes lui reste-t-il ?`,
        correct: a - b,
        wrong: [a - b + 1, a - b - 1, a - b + 2],
        explanation: `On fait une soustraction : ${a} - ${b} = ${a - b}.`
      };
    }
  },
  {
    generate: () => {
      const a = randomInt(12, 18);
      const b = randomInt(3, 8);
      return {
        prompt: `Le boulanger a préparé ${a} croissants. Il en vend ${b} ce matin. Combien de croissants lui reste-t-il ?`,
        correct: a - b,
        wrong: [a - b + 1, a - b - 2, a - b + 3],
        explanation: `On retire les croissants vendus : ${a} - ${b} = ${a - b}.`
      };
    }
  }
];

const TEMPLATES_P3 = [
  // Multiplication
  {
    generate: () => {
      const a = randomInt(3, 6);
      const b = randomInt(4, 8);
      return {
        prompt: `Mia achète ${a} paquets de cartes. Chaque paquet contient ${b} cartes. Combien de cartes a-t-elle en tout ?`,
        correct: a * b,
        wrong: [a * b + 2, a * b - 1, a * b + b],
        explanation: `On fait une multiplication : ${a} × ${b} = ${a * b}.`
      };
    }
  },
  {
    generate: () => {
      const a = randomInt(4, 8);
      const b = randomInt(5, 10);
      return {
        prompt: `Il y a ${a} rangées de chaises dans une salle. Chaque rangée a ${b} chaises. Combien y a-t-il de chaises en tout ?`,
        correct: a * b,
        wrong: [a * b + 1, a * b - 2, a * b - b],
        explanation: `On compte les groupes : ${a} × ${b} = ${a * b}.`
      };
    }
  },
  // Division
  {
    generate: () => {
      const divisor = randomInt(3, 5);
      const quotient = randomInt(4, 8);
      const dividend = divisor * quotient;
      return {
        prompt: `Le pirate a ${dividend} pièces d'or. Il les partage équitablement entre ses ${divisor} amis. Combien de pièces chaque ami reçoit-il ?`,
        correct: quotient,
        wrong: [quotient + 1, quotient - 1, quotient + 2],
        explanation: `On partage en parts égales : ${dividend} ÷ ${divisor} = ${quotient}.`
      };
    }
  },
  {
    generate: () => {
      const divisor = randomInt(4, 6);
      const quotient = randomInt(3, 9);
      const dividend = divisor * quotient;
      return {
        prompt: `La maman de Sam prépare ${dividend} crêpes. Elle les distribue également dans ${divisor} assiettes. Combien y a-t-il de crêpes par assiette ?`,
        correct: quotient,
        wrong: [quotient + 1, quotient - 1, quotient + 2],
        explanation: `On fait une division : ${dividend} ÷ ${divisor} = ${quotient}.`
      };
    }
  },
  // Multi-step (Addition -> Subtraction)
  {
    generate: () => {
      const a = randomInt(20, 30);
      const b = randomInt(10, 15);
      const c = randomInt(15, 25);
      const correct = (a + b) - c;
      return {
        prompt: `Un marchand a ${a} pommes. Un fermier lui en apporte ${b} de plus. Ensuite, il en vend ${c}. Combien lui en reste-t-il ?`,
        correct: correct,
        wrong: [correct + 10, correct - 2, correct + 1],
        explanation: `D'abord ${a} + ${b} = ${a + b}. Ensuite, on enlève ${c} : ${a + b} - ${c} = ${correct}.`
      };
    }
  }
];

export function generateWordProblemExercise({ grade, difficulty }) {
  const isP3 = grade === 'P3' || difficulty === 'hard';
  const pool = isP3 ? [...TEMPLATES_P2.slice(2), ...TEMPLATES_P3] : TEMPLATES_P2;
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
