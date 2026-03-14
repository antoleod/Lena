import { createExercise, gradeToLabel, sample, uniqueOptions } from './generatorUtils.js';

// ─── SENTENCE COMPLETION BANKS ──────────────────────────────────────────────
// 20+ sentences per language with blanks and options
// Format: { prompt, blank, answer, wrong[], explanation }

const SENTENCES_FR = [
  // Basic verb conjugation P2
  { prompt: 'Je ___ à l école tous les matins.', answer: 'vais', wrong: ['va', 'allez', 'allons'], explanation: 'Avec "je", on dit "je vais".' },
  { prompt: 'Elle ___ une belle robe rouge.', answer: 'porte', wrong: ['portent', 'portons', 'portez'], explanation: 'Avec "elle", on dit "elle porte".' },
  { prompt: 'Nous ___ dans la cour de récréation.', answer: 'jouons', wrong: ['jouez', 'joue', 'jouent'], explanation: 'Avec "nous", on dit "nous jouons".' },
  { prompt: 'Les enfants ___ une chanson.', answer: 'chantent', wrong: ['chante', 'chantons', 'chantez'], explanation: 'Avec "les enfants", on dit "ils chantent".' },
  { prompt: 'Tu ___ ton goûter dans ton sac.', answer: 'mets', wrong: ['met', 'mettez', 'mettons'], explanation: 'Avec "tu", on dit "tu mets".' },
  { prompt: 'Il ___ ses devoirs le soir.', answer: 'fait', wrong: ['faites', 'fais', 'font'], explanation: 'Avec "il", on dit "il fait".' },
  { prompt: 'Vous ___ la soupe à la cantine.', answer: 'mangez', wrong: ['mangeons', 'mange', 'mangent'], explanation: 'Avec "vous", on dit "vous mangez".' },
  { prompt: 'Ma sœur ___ le piano chaque jour.', answer: 'joue', wrong: ['jouons', 'jouez', 'jouent'], explanation: 'Avec "ma sœur", on dit "elle joue".' },

  // Articles and agreement P2-P3
  { prompt: 'Je lis ___ livre passionnant.', answer: 'un', wrong: ['une', 'des', 'le'], explanation: '"livre" est masculin → on dit "un livre".' },
  { prompt: 'Elle mange ___ pomme verte.', answer: 'une', wrong: ['un', 'des', 'la'], explanation: '"pomme" est féminin → on dit "une pomme".' },
  { prompt: 'Nous avons ___ crayons de couleur.', answer: 'des', wrong: ['un', 'une', 'le'], explanation: 'Au pluriel, on dit "des crayons".' },
  { prompt: 'Le chat est ___ animal domestique.', answer: 'un', wrong: ['une', 'des', 'de'], explanation: '"animal" est masculin → "un animal".' },

  // Prepositions P2-P3
  { prompt: 'Le livre est ___ la table.', answer: 'sur', wrong: ['sous', 'dans', 'devant'], explanation: '"Sur la table" = en dessus de la table.' },
  { prompt: 'Le chat se cache ___ le lit.', answer: 'sous', wrong: ['sur', 'dans', 'derrière'], explanation: '"Sous le lit" = plus bas que le lit.' },
  { prompt: 'L école est ___ notre maison.', answer: 'près de', wrong: ['loin de', 'dans', 'sur'], explanation: '"Près de" exprime la proximité.' },
  { prompt: 'Les enfants courent ___ la maison.', answer: 'autour de', wrong: ['sous', 'sur', 'dans'], explanation: '"Autour de" veut dire en faisant le tour.' },

  // Sentence structure P3
  { prompt: 'Choisis la phrase correcte.', answer: 'Le chien aboie fort dans le jardin.', wrong: ['Fort aboie le chien jardin dans le.', 'Le jardin aboie dans le chien fort.', 'Dans fort le jardin aboie chien.'], explanation: 'La phrase correcte respecte l ordre sujet-verbe-complément.' },
  { prompt: 'Laquelle est une question ?', answer: 'Où vas-tu ce soir ?', wrong: ['Je vais au parc.', 'Il fait beau aujourd hui.', 'Nous mangeons ensemble.'], explanation: 'Une question se termine par "?" et on inverse sujet et verbe.' },
  { prompt: 'Quelle phrase décrit une action au passé ?', answer: 'Hier, nous sommes allés à la bibliothèque.', wrong: ['Demain, nous irons à la bibliothèque.', 'Nous allons à la bibliothèque.', 'La bibliothèque est grande et belle.'], explanation: '"Hier" et "sommes allés" indiquent le passé.' },
  { prompt: 'Quel mot complète le mieux : Le soleil ___ derrière les nuages.', answer: 'disparaît', wrong: ['mange', 'court', 'parle'], explanation: 'Le soleil peut disparaître derrière les nuages.' },
  { prompt: 'Complete : Les fleurs ___ au printemps.', answer: 'fleurissent', wrong: ['tombent', 'mangent', 'courent'], explanation: 'Les fleurs fleurissent au printemps.' },

  // P3 grammar
  { prompt: 'Choisis le bon accord : Les filles ___ contentes.', answer: 'sont', wrong: ['est', 'suis', 'sommes'], explanation: '"Les filles" = elles → "sont".' },
  { prompt: 'Choisis le bon accord : Mon chien ___ très joueur.', answer: 'est', wrong: ['sont', 'sommes', 'êtes'], explanation: '"Mon chien" = il → "est".' },
];

const SENTENCES_EN = [
  { prompt: 'I ___ to school every day.', answer: 'go', wrong: ['goes', 'going', 'gone'], explanation: 'With "I", we use the base form: "I go".' },
  { prompt: 'She ___ a beautiful drawing.', answer: 'makes', wrong: ['make', 'making', 'made'], explanation: 'With "she/he", we add -s: "she makes".' },
  { prompt: 'We ___ football in the playground.', answer: 'play', wrong: ['plays', 'playing', 'played'], explanation: 'With "we", we use the base form: "we play".' },
  { prompt: 'The children ___ a song.', answer: 'sing', wrong: ['sings', 'singing', 'sang'], explanation: 'With "the children" (they), we use: "they sing".' },
  { prompt: 'He ___ his homework in the evening.', answer: 'does', wrong: ['do', 'doing', 'done'], explanation: 'With "he", we add -es: "he does".' },
  { prompt: 'The cat is ___ the table.', answer: 'on', wrong: ['under', 'in', 'behind'], explanation: '"On the table" means on top of it.' },
  { prompt: 'The ball is ___ the chair.', answer: 'under', wrong: ['on', 'in', 'over'], explanation: '"Under the chair" means below it.' },
  { prompt: 'Choose the correct sentence.', answer: 'The dog is barking loudly.', wrong: ['Loudly barking the dog is.', 'Is the dog loud barking.', 'Barking the loudly dog is.'], explanation: 'Correct order: subject + verb + adverb.' },
  { prompt: 'Which sentence is a question ?', answer: 'Where are you going ?', wrong: ['I am going to the park.', 'It is sunny today.', 'We are eating together.'], explanation: 'A question ends with "?" and uses inversion.' },
  { prompt: 'I need ___ apple.', answer: 'an', wrong: ['a', 'the', 'some'], explanation: '"An" is used before vowel sounds (a, e, i, o, u).' },
  { prompt: 'She has ___ dog.', answer: 'a', wrong: ['an', 'the', 'some'], explanation: '"A" is used before consonant sounds.' },
  { prompt: 'The flowers ___ in spring.', answer: 'bloom', wrong: ['run', 'eat', 'sleep'], explanation: 'Flowers bloom in spring.' },
  { prompt: 'Yesterday, we ___ to the library.', answer: 'went', wrong: ['go', 'goes', 'going'], explanation: '"Went" is the past tense of "go".' },
];

const SENTENCES_NL = [
  { prompt: 'Ik ___ elke dag naar school.', answer: 'ga', wrong: ['gaat', 'gaan', 'gingen'], explanation: 'Met "ik" zeg je "ik ga".' },
  { prompt: 'Ze ___ een mooie tekening.', answer: 'maakt', wrong: ['maak', 'maken', 'gemaakt'], explanation: 'Met "ze/hij" voeg je -t toe: "ze maakt".' },
  { prompt: 'Wij ___ voetbal op het plein.', answer: 'spelen', wrong: ['speelt', 'speelde', 'speel'], explanation: 'Met "wij" zeg je "wij spelen".' },
  { prompt: 'De kinderen ___ een liedje.', answer: 'zingen', wrong: ['zingt', 'zong', 'gezongen'], explanation: 'Met "de kinderen" (zij) zeg je "zij zingen".' },
  { prompt: 'De kat zit ___ de tafel.', answer: 'op', wrong: ['onder', 'in', 'achter'], explanation: '"Op de tafel" = bovenop de tafel.' },
  { prompt: 'De bal ligt ___ de stoel.', answer: 'onder', wrong: ['op', 'in', 'naast'], explanation: '"Onder de stoel" = eronder.' },
  { prompt: 'Kies de juiste zin.', answer: 'De hond blaft luid in de tuin.', wrong: ['Luid de hond blaft tuin in de.', 'In de tuin blaft luid de hond.', 'Blaft de luid hond tuin in.'], explanation: 'De juiste volgorde is: onderwerp + werkwoord + bijwoord.' },
  { prompt: 'Welke zin is een vraag ?', answer: 'Waar ga je naartoe ?', wrong: ['Ik ga naar het park.', 'Het is mooi weer.', 'We eten samen.'], explanation: 'Een vraag eindigt met "?" en begint met een vraagwoord.' },
  { prompt: 'De bloemen ___ in de lente.', answer: 'bloeien', wrong: ['lopen', 'eten', 'slapen'], explanation: 'Bloemen bloeien in de lente.' },
  { prompt: 'Gisteren ___ we naar de bibliotheek.', answer: 'gingen', wrong: ['gaan', 'gaat', 'ga'], explanation: '"Gingen" is de verleden tijd van "gaan".' },
];

const SENTENCES_ES = [
  { prompt: 'Yo ___ a la escuela todos los días.', answer: 'voy', wrong: ['va', 'vais', 'vamos'], explanation: 'Con "yo" se dice "yo voy".' },
  { prompt: 'Ella ___ un dibujo bonito.', answer: 'hace', wrong: ['hago', 'hacemos', 'hacen'], explanation: 'Con "ella" se dice "ella hace".' },
  { prompt: 'Nosotros ___ al fútbol en el patio.', answer: 'jugamos', wrong: ['juegas', 'juega', 'juegan'], explanation: 'Con "nosotros" se dice "jugamos".' },
  { prompt: 'El libro está ___ la mesa.', answer: 'sobre', wrong: ['bajo', 'dentro de', 'detrás de'], explanation: '"Sobre la mesa" significa encima de ella.' },
  { prompt: 'El gato se esconde ___ la silla.', answer: 'debajo de', wrong: ['sobre', 'dentro de', 'delante de'], explanation: '"Debajo de" significa que está más abajo.' },
  { prompt: 'Elige la oración correcta.', answer: 'El perro ladra fuerte en el jardín.', wrong: ['Fuerte el perro jardín ladra en el.', 'Ladra el jardín fuerte en el perro.', 'En el jardín fuerte el perro.'], explanation: 'El orden correcto es: sujeto + verbo + complemento.' },
  { prompt: '¿Cuál es una pregunta ?', answer: '¿Adónde vas esta noche ?', wrong: ['Voy al parque.', 'Hoy hace buen tiempo.', 'Comemos juntos.'], explanation: 'Una pregunta termina con "?" y empieza con signo de interrogación.' },
  { prompt: 'Las flores ___ en primavera.', answer: 'florecen', wrong: ['corren', 'comen', 'duermen'], explanation: 'Las flores florecen en primavera.' },
  { prompt: 'Ayer, nosotros ___ a la biblioteca.', answer: 'fuimos', wrong: ['vamos', 'va', 'ir'], explanation: '"Fuimos" es el pasado de "ir".' },
];

const PACKS = { fr: SENTENCES_FR, en: SENTENCES_EN, nl: SENTENCES_NL, es: SENTENCES_ES };

export function generateSentenceBuilderExercise({ grade, language }) {
  const pack = PACKS[language] || PACKS.fr;

  // P3 = harder exercises (grammar, past tense, agreement)
  let pool = pack;
  if (grade === 'P3') {
    pool = pack.slice(Math.floor(pack.length * 0.4));
  } else {
    pool = pack.slice(0, Math.ceil(pack.length * 0.7));
  }
  if (pool.length === 0) pool = pack;

  const item = sample(pool);
  const question = item.prompt;

  return createExercise({
    question,
    options: uniqueOptions(item.answer, item.wrong),
    correct: item.answer,
    type: 'language_sentence_completion',
    level: gradeToLabel(grade),
    explanation: item.explanation
  });
}
