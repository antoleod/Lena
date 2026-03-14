import { createExercise, gradeToLabel, sample, uniqueOptions } from './generatorUtils.js';

// ─── VOCABULARY BANKS ───────────────────────────────────────────────────────
// Each entry: { prompt, answer, wrong[], category }
// We have 60+ entries per language so the generator can produce varied exercises

const VOCAB_FR = [
  // Animals
  { prompt: 'Quel animal dit "miaou" ?', answer: 'chat', wrong: ['chien', 'vache', 'lapin'], cat: 'animaux' },
  { prompt: 'Quel animal pond des œufs et a des plumes ?', answer: 'poule', wrong: ['cheval', 'mouton', 'cochon'], cat: 'animaux' },
  { prompt: 'Quel animal vit dans la mer et a des nageoires ?', answer: 'poisson', wrong: ['chat', 'oiseau', 'lapin'], cat: 'animaux' },
  { prompt: 'Quel animal garde souvent les maisons ?', answer: 'chien', wrong: ['chat', 'vache', 'poule'], cat: 'animaux' },
  { prompt: 'Quel animal fait du miel ?', answer: 'abeille', wrong: ['fourmi', 'papillon', 'mouche'], cat: 'animaux' },
  { prompt: 'Quel animal a une longue trompe ?', answer: 'éléphant', wrong: ['girafe', 'lion', 'zèbre'], cat: 'animaux' },
  { prompt: 'Quel animal est le roi de la savane ?', answer: 'lion', wrong: ['tigre', 'ours', 'loup'], cat: 'animaux' },
  { prompt: 'Quel animal a des rayures noires et blanches ?', answer: 'zèbre', wrong: ['girafe', 'éléphant', 'hippopotame'], cat: 'animaux' },

  // School
  { prompt: 'Avec quoi écrit-on sur le tableau ?', answer: 'craie', wrong: ['crayon', 'stylo', 'pinceau'], cat: 'école' },
  { prompt: 'Quel objet sert à effacer ?', answer: 'gomme', wrong: ['règle', 'cahier', 'taille-crayon'], cat: 'école' },
  { prompt: 'Dans quoi range-t-on ses affaires d école ?', answer: 'cartable', wrong: ['valise', 'sac de sport', 'boîte'], cat: 'école' },
  { prompt: 'Quel objet mesure les longueurs ?', answer: 'règle', wrong: ['gomme', 'cahier', 'ciseau'], cat: 'école' },
  { prompt: 'Où écrit-on ses leçons ?', answer: 'cahier', wrong: ['livre', 'journal', 'affiche'], cat: 'école' },
  { prompt: 'Quel objet coupe le papier ?', answer: 'ciseaux', wrong: ['colle', 'crayon', 'règle'], cat: 'école' },
  { prompt: 'Avec quoi colorie-t-on ?', answer: 'crayons de couleur', wrong: ['stylo', 'craie', 'règle'], cat: 'école' },

  // Food
  { prompt: 'Quel fruit est jaune et courbé ?', answer: 'banane', wrong: ['pomme', 'raisin', 'poire'], cat: 'nourriture' },
  { prompt: 'Quel fruit est rouge et rond ?', answer: 'pomme', wrong: ['banane', 'citron', 'poire'], cat: 'nourriture' },
  { prompt: 'Quel légume est orange et pousse dans la terre ?', answer: 'carotte', wrong: ['tomate', 'salade', 'courgette'], cat: 'nourriture' },
  { prompt: 'Quel aliment boit-on au petit-déjeuner ?', answer: 'lait', wrong: ['soupe', 'jus de viande', 'eau gazeuse'], cat: 'nourriture' },
  { prompt: 'Avec quel aliment fait-on des frites ?', answer: 'pomme de terre', wrong: ['carotte', 'navet', 'betterave'], cat: 'nourriture' },
  { prompt: 'Quel fruit donne-t-on souvent dans une boîte de jus ?', answer: 'orange', wrong: ['prune', 'cerise', 'abricot'], cat: 'nourriture' },

  // Emotions
  { prompt: 'Comment appelle-t-on le sentiment quand on est content ?', answer: 'joie', wrong: ['tristesse', 'peur', 'colère'], cat: 'émotions' },
  { prompt: 'Quel mot décrit quelqu un qui a perdu ?', answer: 'triste', wrong: ['joyeux', 'fier', 'calme'], cat: 'émotions' },
  { prompt: 'Quel sentiment ressent-on devant quelque chose d effrayant ?', answer: 'peur', wrong: ['joie', 'surprise', 'calme'], cat: 'émotions' },
  { prompt: 'Comment dit-on quand on n est pas content ?', answer: 'fâché', wrong: ['heureux', 'fatigué', 'surpris'], cat: 'émotions' },

  // Family
  { prompt: 'Comment appelle-t-on la sœur de ta mère ?', answer: 'tante', wrong: ['cousine', 'grand-mère', 'marraine'], cat: 'famille' },
  { prompt: 'Comment appelle-t-on le frère de ton père ?', answer: 'oncle', wrong: ['cousin', 'grand-père', 'parrain'], cat: 'famille' },
  { prompt: 'Comment appelle-t-on les parents de tes parents ?', answer: 'grands-parents', wrong: ['oncles', 'cousins', 'voisins'], cat: 'famille' },
  { prompt: 'Quel mot désigne un enfant de la même famille que toi ?', answer: 'frère ou sœur', wrong: ['ami', 'voisin', 'cousin'], cat: 'famille' },

  // Colors & Shapes
  { prompt: 'Quelle est la couleur du ciel par beau temps ?', answer: 'bleu', wrong: ['rouge', 'vert', 'jaune'], cat: 'couleurs' },
  { prompt: 'Quelle couleur obtient-on en mélangeant rouge et blanc ?', answer: 'rose', wrong: ['violet', 'orange', 'brun'], cat: 'couleurs' },
  { prompt: 'Combien de côtés a un triangle ?', answer: '3', wrong: ['4', '5', '6'], cat: 'formes' },
  { prompt: 'Comment appelle-t-on une figure ronde sans coin ?', answer: 'cercle', wrong: ['carré', 'triangle', 'rectangle'], cat: 'formes' },

  // Verbs & Grammar
  { prompt: 'Quel mot montre une action (comme courir, chanter) ?', answer: 'verbe', wrong: ['nom', 'adjectif', 'article'], cat: 'grammaire' },
  { prompt: 'Quel mot décrit une chose ou une personne (comme grand, rouge) ?', answer: 'adjectif', wrong: ['verbe', 'nom', 'pronom'], cat: 'grammaire' },
  { prompt: 'Le contraire de "grand" est ...', answer: 'petit', wrong: ['gros', 'long', 'lourd'], cat: 'contraires' },
  { prompt: 'Le contraire de "rapide" est ...', answer: 'lent', wrong: ['fort', 'silencieux', 'calme'], cat: 'contraires' },
  { prompt: 'Le contraire de "chaud" est ...', answer: 'froid', wrong: ['tiède', 'brûlant', 'humide'], cat: 'contraires' },
  { prompt: 'Le contraire de "jour" est ...', answer: 'nuit', wrong: ['soir', 'matin', 'après-midi'], cat: 'contraires' },

  // P3 level — harder vocabulary
  { prompt: 'Quel mot veut dire "très heureux" ?', answer: 'radieux', wrong: ['pensif', 'distrait', 'inquiet'], cat: 'nuances' },
  { prompt: 'Quel mot est synonyme de "maison" ?', answer: 'demeure', wrong: ['forêt', 'rivière', 'montagne'], cat: 'synonymes' },
  { prompt: 'Quel mot est synonyme de "rapide" ?', answer: 'vite', wrong: ['fort', 'haut', 'froid'], cat: 'synonymes' },
  { prompt: 'Quel mot est antonyme de "monter" ?', answer: 'descendre', wrong: ['avancer', 'tourner', 'rouler'], cat: 'contraires' },
  { prompt: 'Un "parapluie" sert à ...', answer: 'se protéger de la pluie', wrong: ['se protéger du vent', 'nager', 'voyager'], cat: 'utilité' },
  { prompt: 'Un "boulanger" fabrique ...', answer: 'du pain', wrong: ['des médicaments', 'des vêtements', 'des jouets'], cat: 'métiers' },
  { prompt: 'Un "médecin" soigne ...', answer: 'les malades', wrong: ['les voitures', 'les animaux uniquement', 'les maisons'], cat: 'métiers' },
  { prompt: 'Un "pompier" lutte contre ...', answer: 'les incendies', wrong: ['les inondations uniquement', 'le vent', 'la neige'], cat: 'métiers' },
];

const VOCAB_NL = [
  { prompt: 'Welk dier zegt "miauw" ?', answer: 'kat', wrong: ['hond', 'konijn', 'vogel'], cat: 'dieren' },
  { prompt: 'Welk dier legt eieren ?', answer: 'kip', wrong: ['koe', 'schaap', 'varken'], cat: 'dieren' },
  { prompt: 'Welk dier heeft een lange slurf ?', answer: 'olifant', wrong: ['giraf', 'leeuw', 'zebra'], cat: 'dieren' },
  { prompt: 'Waarmee schrijf je op het bord ?', answer: 'krijt', wrong: ['pen', 'potlood', 'stift'], cat: 'school' },
  { prompt: 'Waarmee wis je fouten uit ?', answer: 'gom', wrong: ['liniaal', 'schrift', 'schaar'], cat: 'school' },
  { prompt: 'Waar stop je je schoolspullen in ?', answer: 'boekentas', wrong: ['koffer', 'doos', 'emmer'], cat: 'school' },
  { prompt: 'Welk fruit is geel en gebogen ?', answer: 'banaan', wrong: ['appel', 'peer', 'druif'], cat: 'eten' },
  { prompt: 'Welk groente is oranje ?', answer: 'wortel', wrong: ['tomaat', 'sla', 'ui'], cat: 'eten' },
  { prompt: 'Hoe noem je het gevoel als je blij bent ?', answer: 'vreugde', wrong: ['verdriet', 'angst', 'woede'], cat: 'gevoelens' },
  { prompt: 'Wat is het tegenovergestelde van "groot" ?', answer: 'klein', wrong: ['dik', 'lang', 'zwaar'], cat: 'tegenstellingen' },
  { prompt: 'Wat is het tegenovergestelde van "snel" ?', answer: 'langzaam', wrong: ['stil', 'zwak', 'koud'], cat: 'tegenstellingen' },
  { prompt: 'Hoe heet het tegenovergestelde van "dag" ?', answer: 'nacht', wrong: ['ochtend', 'avond', 'middag'], cat: 'tegenstellingen' },
  { prompt: 'Wat maakt een bakker ?', answer: 'brood', wrong: ['kleren', 'medicijnen', 'speelgoed'], cat: 'beroepen' },
  { prompt: 'Wat doet een dokter ?', answer: 'zieken helpen', wrong: ['huizen bouwen', 'brood bakken', 'auto repareren'], cat: 'beroepen' },
  { prompt: 'Hoeveel zijden heeft een driehoek ?', answer: '3', wrong: ['4', '5', '6'], cat: 'vormen' },
  { prompt: 'Welke kleur heeft de lucht op een mooie dag ?', answer: 'blauw', wrong: ['rood', 'geel', 'groen'], cat: 'kleuren' },
  { prompt: 'Wat is een synoniem voor "huis" ?', answer: 'woning', wrong: ['tuin', 'straat', 'winkel'], cat: 'synoniemen' },
  { prompt: 'Wat is een synoniem voor "blij" ?', answer: 'vrolijk', wrong: ['verdrietig', 'bang', 'moe'], cat: 'synoniemen' },
];

const VOCAB_EN = [
  { prompt: 'Which animal says "meow" ?', answer: 'cat', wrong: ['dog', 'rabbit', 'bird'], cat: 'animals' },
  { prompt: 'Which animal lays eggs ?', answer: 'chicken', wrong: ['cow', 'sheep', 'pig'], cat: 'animals' },
  { prompt: 'Which animal has a long trunk ?', answer: 'elephant', wrong: ['giraffe', 'lion', 'zebra'], cat: 'animals' },
  { prompt: 'What do you write with at school ?', answer: 'pencil', wrong: ['ruler', 'eraser', 'notebook'], cat: 'school' },
  { prompt: 'What do you carry your school things in ?', answer: 'school bag', wrong: ['suitcase', 'box', 'basket'], cat: 'school' },
  { prompt: 'Which fruit is yellow and curved ?', answer: 'banana', wrong: ['apple', 'pear', 'grape'], cat: 'food' },
  { prompt: 'Which vegetable is orange ?', answer: 'carrot', wrong: ['tomato', 'lettuce', 'onion'], cat: 'food' },
  { prompt: 'What do you feel when you are happy ?', answer: 'joy', wrong: ['sadness', 'fear', 'anger'], cat: 'emotions' },
  { prompt: 'What is the opposite of "big" ?', answer: 'small', wrong: ['tall', 'heavy', 'round'], cat: 'opposites' },
  { prompt: 'What is the opposite of "fast" ?', answer: 'slow', wrong: ['loud', 'cold', 'strong'], cat: 'opposites' },
  { prompt: 'What is the opposite of "day" ?', answer: 'night', wrong: ['morning', 'evening', 'afternoon'], cat: 'opposites' },
  { prompt: 'What does a baker make ?', answer: 'bread', wrong: ['clothes', 'medicine', 'toys'], cat: 'jobs' },
  { prompt: 'How many sides does a triangle have ?', answer: '3', wrong: ['4', '5', '6'], cat: 'shapes' },
  { prompt: 'What colour is the sky on a sunny day ?', answer: 'blue', wrong: ['red', 'green', 'yellow'], cat: 'colours' },
  { prompt: 'What is a synonym for "happy" ?', answer: 'joyful', wrong: ['sad', 'angry', 'tired'], cat: 'synonyms' },
  { prompt: 'What is a synonym for "big" ?', answer: 'large', wrong: ['small', 'thin', 'cold'], cat: 'synonyms' },
  { prompt: 'Which word means "to speak" ?', answer: 'talk', wrong: ['run', 'eat', 'sleep'], cat: 'verbs' },
  { prompt: 'Which word means "to move very fast" ?', answer: 'run', wrong: ['walk', 'sit', 'stand'], cat: 'verbs' },
];

const VOCAB_ES = [
  { prompt: '¿Qué animal dice "miau" ?', answer: 'gato', wrong: ['perro', 'conejo', 'pájaro'], cat: 'animales' },
  { prompt: '¿Qué animal pone huevos ?', answer: 'gallina', wrong: ['vaca', 'oveja', 'cerdo'], cat: 'animales' },
  { prompt: '¿Qué animal tiene una trompa larga ?', answer: 'elefante', wrong: ['jirafa', 'león', 'cebra'], cat: 'animales' },
  { prompt: '¿Con qué escribes en el colegio ?', answer: 'lápiz', wrong: ['goma', 'tijeras', 'pegamento'], cat: 'escuela' },
  { prompt: '¿Dónde guardas tus cosas del colegio ?', answer: 'mochila', wrong: ['maleta', 'caja', 'bolsa'], cat: 'escuela' },
  { prompt: '¿Qué fruta es amarilla y curva ?', answer: 'plátano', wrong: ['manzana', 'pera', 'naranja'], cat: 'comida' },
  { prompt: '¿Qué verdura es naranja ?', answer: 'zanahoria', wrong: ['tomate', 'lechuga', 'cebolla'], cat: 'comida' },
  { prompt: '¿Cómo se llama el sentimiento cuando estás contento ?', answer: 'alegría', wrong: ['tristeza', 'miedo', 'enfado'], cat: 'emociones' },
  { prompt: '¿Cuál es el contrario de "grande" ?', answer: 'pequeño', wrong: ['gordo', 'alto', 'fuerte'], cat: 'contrarios' },
  { prompt: '¿Cuál es el contrario de "rápido" ?', answer: 'lento', wrong: ['tranquilo', 'frío', 'silencioso'], cat: 'contrarios' },
  { prompt: '¿Cuántos lados tiene un triángulo ?', answer: '3', wrong: ['4', '5', '6'], cat: 'formas' },
  { prompt: '¿De qué color es el cielo en un día soleado ?', answer: 'azul', wrong: ['rojo', 'verde', 'amarillo'], cat: 'colores' },
  { prompt: '¿Qué hace un panadero ?', answer: 'pan', wrong: ['ropa', 'medicinas', 'juguetes'], cat: 'profesiones' },
  { prompt: '¿Cuál es el sinónimo de "contento" ?', answer: 'feliz', wrong: ['triste', 'enfadado', 'cansado'], cat: 'sinónimos' },
];

const PACKS = { fr: VOCAB_FR, nl: VOCAB_NL, en: VOCAB_EN, es: VOCAB_ES };

export function generateVocabularyExercise({ grade, language, difficulty }) {
  const pack = PACKS[language] || PACKS.fr;

  // For P3/hard: prefer harder categories
  let pool = pack;
  if (grade === 'P3' || difficulty === 'hard') {
    const hardCats = ['synonymes', 'contraires', 'nuances', 'synoniemen', 'synonyms', 'contrarios'];
    const hardPool = pack.filter((entry) => hardCats.includes(entry.cat));
    if (hardPool.length >= 3) pool = hardPool;
  } else if (difficulty === 'easy') {
    const easyCats = ['animaux', 'école', 'nourriture', 'animales', 'escuela', 'comida', 'animals', 'school', 'food', 'dieren', 'eten'];
    const easyPool = pack.filter((entry) => easyCats.includes(entry.cat));
    if (easyPool.length >= 3) pool = easyPool;
  }

  const item = sample(pool);

  return createExercise({
    question: item.prompt,
    options: uniqueOptions(item.answer, item.wrong),
    correct: item.answer,
    type: 'language_vocabulary',
    level: gradeToLabel(grade),
    explanation: `La bonne réponse est : ${item.answer}.`
  });
}
