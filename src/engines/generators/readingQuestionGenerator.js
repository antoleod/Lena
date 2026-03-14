import { createExercise, gradeToLabel, sample, uniqueOptions } from './generatorUtils.js';

// ─── READING PASSAGES ────────────────────────────────────────────────────────
// 12+ passages per language, with passage text + multiple questions per passage
// Each entry = { id, lines[], questions: [{ question, answer, wrong[] }] }

const PASSAGES_FR = [
  {
    id: 'fr-mila-sac',
    lines: ['Mila prépare son sac avant d école.', 'Elle prend un livre, une pomme et sa gourde.', 'Puis elle ferme la porte en souriant.'],
    questions: [
      { question: 'Que prend Mila dans son sac ?', answer: 'Un livre, une pomme et sa gourde', wrong: ['Un ballon et un manteau', 'Une lampe et un chat', 'Un vélo et des fleurs'] },
      { question: 'Que fait Mila avant de partir ?', answer: 'Elle ferme la porte', wrong: ['Elle mange une banane', 'Elle court dans la rue', 'Elle appelle ses amis'] },
      { question: 'Comment Mila ferme-t-elle la porte ?', answer: 'En souriant', wrong: ['En pleurant', 'En criant', 'En courant'] },
    ]
  },
  {
    id: 'fr-leo-marche',
    lines: ['Leo marche avec sa classe jusqu au marché.', 'Il voit des pommes, des fleurs et du pain chaud.', 'Il achète une petite brioche avec ses pièces.'],
    questions: [
      { question: 'Où va Leo ?', answer: 'Au marché', wrong: ['A la plage', 'Au cinéma', 'Au musée'] },
      { question: 'Avec qui Leo marche-t-il ?', answer: 'Sa classe', wrong: ['Son chien', 'Sa famille', 'Ses voisins'] },
      { question: 'Qu achète Leo ?', answer: 'Une petite brioche', wrong: ['Des pommes', 'Des fleurs', 'Du pain complet'] },
    ]
  },
  {
    id: 'fr-zoo',
    lines: ['La classe de Pierre visite le zoo samedi.', 'Pierre voit des lions, des singes et un grand éléphant.', 'Son animal préféré est le singe qui mange des bananes.'],
    questions: [
      { question: 'Quand Pierre visite-t-il le zoo ?', answer: 'Samedi', wrong: ['Dimanche', 'Vendredi', 'Lundi'] },
      { question: 'Quel est l animal préféré de Pierre ?', answer: 'Le singe', wrong: ['Le lion', 'L éléphant', 'Le tigre'] },
      { question: 'Que mange le singe ?', answer: 'Des bananes', wrong: ['De la viande', 'Des carottes', 'Du poisson'] },
    ]
  },
  {
    id: 'fr-pluie',
    lines: ['Ce matin, il pleut beaucoup.', 'Emma prend son imperméable vert et ses bottes rouges.', 'Elle saute dans les flaques d eau en riant avec son frère.'],
    questions: [
      { question: 'Quel temps fait-il ce matin ?', answer: 'Il pleut', wrong: ['Il neige', 'Il fait soleil', 'Il y a du vent'] },
      { question: 'Quelle couleur est l imperméable d Emma ?', answer: 'Vert', wrong: ['Rouge', 'Bleu', 'Jaune'] },
      { question: 'Que fait Emma avec son frère ?', answer: 'Elle saute dans les flaques', wrong: ['Elle regarde la télé', 'Elle lit un livre', 'Elle fait ses devoirs'] },
    ]
  },
  {
    id: 'fr-cuisine',
    lines: ['Le mercredi, Tom aide sa maman à cuisiner.', 'Ils font une tarte aux pommes pour le goûter.', 'Tom mélange la farine, les œufs et le beurre.'],
    questions: [
      { question: 'Quel jour Tom aide-t-il sa maman ?', answer: 'Le mercredi', wrong: ['Le samedi', 'Le lundi', 'Le vendredi'] },
      { question: 'Que font-ils pour le goûter ?', answer: 'Une tarte aux pommes', wrong: ['Un gâteau au chocolat', 'Une salade', 'Une soupe'] },
      { question: 'Que mélange Tom ?', answer: 'La farine, les œufs et le beurre', wrong: ['Le sucre, le lait et le sel', 'La confiture, le miel et la crème', 'Le sel, le poivre et l huile'] },
    ]
  },
  {
    id: 'fr-bibliotheque',
    lines: ['Chaque vendredi, Lucie va à la bibliothèque avec son père.', 'Elle choisit toujours deux livres : un livre d aventure et un livre de recettes.', 'Elle lit dans son lit avant de dormir.'],
    questions: [
      { question: 'Quand Lucie va-t-elle à la bibliothèque ?', answer: 'Le vendredi', wrong: ['Le samedi', 'Le jeudi', 'Le dimanche'] },
      { question: 'Combien de livres Lucie choisit-elle ?', answer: 'Deux', wrong: ['Un', 'Trois', 'Quatre'] },
      { question: 'Quand Lucie lit-elle ?', answer: 'Avant de dormir', wrong: ['Après le déjeuner', 'Pendant la récréation', 'Le matin'] },
    ]
  },
  // P3 level — longer and more complex
  {
    id: 'fr-rondeau-forêt',
    lines: [
      'Ce week-end, la famille de Camille explore la forêt.',
      'Ils observent des insectes, des champignons et des traces d animaux.',
      'Camille note tout dans son carnet avec soin.',
      'Elle veut devenir scientifique quand elle sera grande.'
    ],
    questions: [
      { question: 'Où la famille de Camille part-elle ce week-end ?', answer: 'Dans la forêt', wrong: ['A la mer', 'A la montagne', 'En ville'] },
      { question: 'Que note Camille dans son carnet ?', answer: 'Les insectes, champignons et traces d animaux', wrong: ['Les noms des arbres', 'Les fleurs du jardin', 'Les étoiles du ciel'] },
      { question: 'Quel métier Camille veut-elle faire ?', answer: 'Scientifique', wrong: ['Boulangère', 'Chauffeuse de bus', 'Professeure'] },
    ]
  },
];

const PASSAGES_EN = [
  {
    id: 'en-ava-park',
    lines: ['Ava goes to the park after school.', 'She brings water and a red ball.', 'Her brother joins her near the slide.'],
    questions: [
      { question: 'What colour is the ball ?', answer: 'Red', wrong: ['Blue', 'Green', 'Yellow'] },
      { question: 'Where does Ava go after school ?', answer: 'To the park', wrong: ['To the library', 'To the shops', 'To her friend s house'] },
      { question: 'Who joins Ava at the park ?', answer: 'Her brother', wrong: ['Her sister', 'Her teacher', 'Her dog'] },
    ]
  },
  {
    id: 'en-jake-rain',
    lines: ['It rains a lot this morning.', 'Jake puts on his yellow raincoat and green boots.', 'He jumps in puddles with his little sister and laughs.'],
    questions: [
      { question: 'What colour is Jake s raincoat ?', answer: 'Yellow', wrong: ['Green', 'Blue', 'Red'] },
      { question: 'What does Jake do in the rain ?', answer: 'Jumps in puddles', wrong: ['Stays inside', 'Reads a book', 'Watches TV'] },
      { question: 'Who is with Jake ?', answer: 'His little sister', wrong: ['His best friend', 'His dad', 'His teacher'] },
    ]
  },
  {
    id: 'en-library',
    lines: ['Every Friday, Sam goes to the library with his mum.', 'He always picks two books: one about animals and one about space.', 'He reads in bed before sleeping.'],
    questions: [
      { question: 'When does Sam go to the library ?', answer: 'On Fridays', wrong: ['On Saturdays', 'On Thursdays', 'On Sundays'] },
      { question: 'How many books does Sam pick ?', answer: 'Two', wrong: ['One', 'Three', 'Five'] },
      { question: 'When does Sam read ?', answer: 'Before sleeping', wrong: ['After breakfast', 'During lunch', 'In the morning'] },
    ]
  },
  {
    id: 'en-zoo',
    lines: ['The class visits the zoo on Monday.', 'Tom sees lions, monkeys, and a big elephant.', 'His favourite animal is the monkey eating bananas.'],
    questions: [
      { question: 'When does the class visit the zoo ?', answer: 'On Monday', wrong: ['On Friday', 'On Saturday', 'On Wednesday'] },
      { question: 'What is Tom s favourite animal ?', answer: 'The monkey', wrong: ['The lion', 'The elephant', 'The giraffe'] },
      { question: 'What does the monkey eat ?', answer: 'Bananas', wrong: ['Apples', 'Carrots', 'Meat'] },
    ]
  },
];

const PASSAGES_NL = [
  {
    id: 'nl-noor-bibliotheek',
    lines: ['Noor gaat naar de bibliotheek met haar papa.', 'Ze kiest een boek over dieren.', 'Daarna leest ze rustig aan tafel.'],
    questions: [
      { question: 'Welk boek kiest Noor ?', answer: 'Een boek over dieren', wrong: ['Een kookboek', 'Een boek over de maan', 'Een boek over auto s'] },
      { question: 'Met wie gaat Noor ?', answer: 'Haar papa', wrong: ['Haar mama', 'Haar broer', 'Haar juf'] },
      { question: 'Waar leest Noor ?', answer: 'Aan tafel', wrong: ['In bed', 'Op de bank', 'In de tuin'] },
    ]
  },
  {
    id: 'nl-regen',
    lines: ['Het regent veel vanmorgen.', 'Lars trekt zijn gele regenjas en groene laarzen aan.', 'Hij springt in de plassen met zijn kleine zus en lacht.'],
    questions: [
      { question: 'Welke kleur heeft de regenjas van Lars ?', answer: 'Geel', wrong: ['Groen', 'Blauw', 'Rood'] },
      { question: 'Wat doet Lars in de regen ?', answer: 'Springt in de plassen', wrong: ['Blijft binnen', 'Leest een boek', 'Kijkt tv'] },
      { question: 'Met wie springt Lars ?', answer: 'Zijn kleine zus', wrong: ['Zijn beste vriend', 'Zijn papa', 'Zijn juf'] },
    ]
  },
  {
    id: 'nl-dierentuin',
    lines: ['De klas bezoekt de dierentuin op maandag.', 'Tom ziet leeuwen, apen en een grote olifant.', 'Zijn lievelingsdier is de aap die bananen eet.'],
    questions: [
      { question: 'Wanneer bezoekt de klas de dierentuin ?', answer: 'Op maandag', wrong: ['Op vrijdag', 'Op zaterdag', 'Op woensdag'] },
      { question: 'Wat is het lievelingsdier van Tom ?', answer: 'De aap', wrong: ['De leeuw', 'De olifant', 'De giraf'] },
      { question: 'Wat eet de aap ?', answer: 'Bananen', wrong: ['Appels', 'Wortels', 'Vlees'] },
    ]
  },
];

const PASSAGES_ES = [
  {
    id: 'es-luna-picnic',
    lines: ['Luna prepara un picnic con su familia.', 'Lleva pan, queso y jugo.', 'Todos comen debajo de un árbol.'],
    questions: [
      { question: '¿Dónde comen ?', answer: 'Debajo de un árbol', wrong: ['En la cocina', 'En el autobús', 'En la clase'] },
      { question: '¿Qué lleva Luna ?', answer: 'Pan, queso y jugo', wrong: ['Arroz, sopa y agua', 'Pasteles y helados', 'Frutas y verduras'] },
      { question: '¿Con quién prepara el picnic Luna ?', answer: 'Su familia', wrong: ['Sus amigos', 'Su maestra', 'Sus vecinos'] },
    ]
  },
  {
    id: 'es-zoo',
    lines: ['La clase visita el zoo el lunes.', 'Carlos ve leones, monos y un gran elefante.', 'Su animal favorito es el mono que come plátanos.'],
    questions: [
      { question: '¿Cuándo visita la clase el zoo ?', answer: 'El lunes', wrong: ['El viernes', 'El sábado', 'El miércoles'] },
      { question: '¿Cuál es el animal favorito de Carlos ?', answer: 'El mono', wrong: ['El león', 'El elefante', 'La jirafa'] },
      { question: '¿Qué come el mono ?', answer: 'Plátanos', wrong: ['Manzanas', 'Zanahorias', 'Carne'] },
    ]
  },
];

const PASSAGES = { fr: PASSAGES_FR, en: PASSAGES_EN, nl: PASSAGES_NL, es: PASSAGES_ES };

export function generateReadingQuestionExercise({ grade, language }) {
  const pack = PASSAGES[language] || PASSAGES.fr;

  // P3: prefer longer passages (more lines)
  let pool = pack;
  if (grade === 'P3') {
    const longOnes = pack.filter((p) => p.lines.length >= 4);
    if (longOnes.length >= 2) pool = longOnes;
  }

  const passage = sample(pool);
  const qEntry = sample(passage.questions);

  return createExercise({
    question: qEntry.question,
    options: uniqueOptions(qEntry.answer, qEntry.wrong),
    correct: qEntry.answer,
    type: 'reading_comprehension',
    level: gradeToLabel(grade),
    context: passage.lines,
    explanation: `La bonne réponse est : ${qEntry.answer}.`
  });
}
