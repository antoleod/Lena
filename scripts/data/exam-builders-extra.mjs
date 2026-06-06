// Extra exam builders: expands existing categories to 20 exams and adds 4 new categories.

function makeRng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const ri = (rng, a, b) => a + Math.floor(rng() * (b - a + 1));
function shuffle(rng, arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function numOpts(rng, answer, spread) {
  const set = new Set([answer]);
  let g = 0;
  while (set.size < 4 && g++ < 40) {
    const d = ri(rng, 1, spread) * (rng() < 0.5 ? -1 : 1);
    if (answer + d >= 0) set.add(answer + d);
  }
  return shuffle(rng, [...set]).map(String);
}

let _q = 0;
const Q = () => `q${++_q}`;
const resetQ = () => { _q = 0; };
const mc = (prompt, options, answer, correction, x) => ({ id: Q(), type: 'mcq', prompt, options, answer: String(answer), correction, ...(x||{}) });
const tf = (prompt, answer, correction, x) => ({ id: Q(), type: 'true_false', prompt, answer, correction, ...(x||{}) });
const fb = (prompt, answer, correction, accept, x) => ({ id: Q(), type: 'fill_blank', prompt, answer: String(answer), accept, correction, ...(x||{}) });

function exam(category, meta, order, title, emoji, levelFn) {
  const levels = {};
  for (const key of ['facile', 'moyen', 'difficile']) {
    resetQ();
    levels[key] = { passPercent: 60, questions: levelFn(key) };
  }
  return {
    id: `${category}-${String(order).padStart(2, '0')}`,
    category, categoryLabel: meta.label, categoryEmoji: meta.emoji, categoryOrder: meta.order,
    title, emoji, order, levels,
  };
}

// ── TABLES DE MULTIPLICATION ─────────────────────────────────────────────────
function buildTables() {
  const meta = { label: 'Tables de multiplication', emoji: '✖️', order: 14 };
  const exams = [];
  // One exam per table (×2 through ×10), plus mixed exams
  const tableNums = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  for (let i = 0; i < tableNums.length; i++) {
    const t = tableNums[i];
    exams.push(exam('tables-multiplication', meta, i + 1, `Table de ${t}`, '✖️', (key) => {
      const rng = makeRng(14000 + t * 31 + key.length);
      const maxFactor = key === 'facile' ? 5 : key === 'moyen' ? 8 : 10;
      const qs = [];
      for (let q = 1; q <= 10; q++) {
        const b = ri(rng, 1, maxFactor);
        const answer = t * b;
        if (q % 3 === 2) {
          qs.push(fb(`${t} × ${b} = ___`, answer, `${t} × ${b} = ${answer}.`));
        } else {
          qs.push(mc(`${t} × ${b} = ?`, numOpts(rng, answer, Math.max(2, t)), answer, `${t} × ${b} = ${answer}.`,
            { prompt_nl: `${t} × ${b} = ?`, prompt_en: `${t} × ${b} = ?`, prompt_es: `${t} × ${b} = ?` }));
        }
      }
      return qs;
    }));
  }
  // 11 mixed exams
  for (let n = 10; n <= 20; n++) {
    exams.push(exam('tables-multiplication', meta, n + 1, `Tables mélangées ${n - 9}`, '✖️', (key) => {
      const rng = makeRng(14500 + n * 17 + key.length);
      const tables = key === 'facile' ? [2, 3, 4, 5] : key === 'moyen' ? [2, 3, 4, 5, 6, 7] : [2, 3, 4, 5, 6, 7, 8, 9, 10];
      const maxFactor = key === 'facile' ? 5 : key === 'moyen' ? 8 : 10;
      const qs = [];
      for (let q = 0; q < 10; q++) {
        const t = tables[ri(rng, 0, tables.length - 1)];
        const b = ri(rng, 1, maxFactor);
        const answer = t * b;
        qs.push(mc(`${t} × ${b} = ?`, numOpts(rng, answer, Math.max(2, t)), answer, `${t} × ${b} = ${answer}.`,
          { prompt_nl: `${t} × ${b} = ?`, prompt_en: `${t} × ${b} = ?`, prompt_es: `${t} × ${b} = ?` }));
      }
      return qs;
    }));
  }
  return { dir: 'tables-multiplication', exams };
}

// ── FRACTIONS ────────────────────────────────────────────────────────────────
function buildFractions() {
  const meta = { label: 'Fractions', emoji: '½', order: 15 };
  const bank = [
    () => mc('Quelle fraction représente la moitié ?', ['1/2', '1/3', '2/3', '1/4'], '1/2', 'La moitié = 1/2.',
      { prompt_nl: 'Welk breuk is de helft?', prompt_en: 'Which fraction is one half?', prompt_es: '¿Qué fracción es la mitad?', correction_nl: 'De helft = 1/2.', correction_en: 'One half = 1/2.', correction_es: 'La mitad = 1/2.' }),
    () => mc('Quelle fraction représente un quart ?', ['1/4', '1/2', '3/4', '1/3'], '1/4', 'Un quart = 1/4.',
      { prompt_nl: 'Welk breuk is een kwart?', prompt_en: 'Which fraction is one quarter?', prompt_es: '¿Qué fracción es un cuarto?', correction_nl: 'Een kwart = 1/4.', correction_en: 'One quarter = 1/4.', correction_es: 'Un cuarto = 1/4.' }),
    () => mc('Quelle fraction représente un tiers ?', ['1/3', '1/2', '2/3', '1/4'], '1/3', 'Un tiers = 1/3.',
      { prompt_nl: 'Welk breuk is een derde?', prompt_en: 'Which fraction is one third?', prompt_es: '¿Qué fracción es un tercio?', correction_nl: 'Een derde = 1/3.', correction_en: 'One third = 1/3.', correction_es: 'Un tercio = 1/3.' }),
    () => mc('2/4 est égal à :', ['1/2', '1/4', '3/4', '2/3'], '1/2', '2/4 = 1/2 (simplification).',
      { prompt_nl: '2/4 is gelijk aan:', prompt_en: '2/4 is equal to:', prompt_es: '2/4 es igual a:', correction_nl: '2/4 = 1/2.', correction_en: '2/4 = 1/2.', correction_es: '2/4 = 1/2.' }),
    () => tf('1/2 est plus grand que 1/4.', true, '1/2 > 1/4 : la moitié est plus grande.',
      { prompt_nl: '1/2 is groter dan 1/4.', prompt_en: '1/2 is bigger than 1/4.', prompt_es: '1/2 es mayor que 1/4.', correction_nl: '1/2 > 1/4.', correction_en: '1/2 > 1/4.', correction_es: '1/2 > 1/4.' }),
    () => tf('1/3 est plus grand que 1/2.', false, '1/3 < 1/2 : un tiers est plus petit.',
      { prompt_nl: '1/3 is groter dan 1/2.', prompt_en: '1/3 is bigger than 1/2.', prompt_es: '1/3 es mayor que 1/2.', correction_nl: '1/3 < 1/2.', correction_en: '1/3 < 1/2.', correction_es: '1/3 < 1/2.' }),
    () => mc('La moitié de 10 est :', ['5', '2', '4', '8'], '5', '10 ÷ 2 = 5.',
      { prompt_nl: 'De helft van 10 is:', prompt_en: 'Half of 10 is:', prompt_es: 'La mitad de 10 es:', correction_nl: '10 ÷ 2 = 5.', correction_en: '10 ÷ 2 = 5.', correction_es: '10 ÷ 2 = 5.' }),
    () => mc('Le quart de 8 est :', ['2', '4', '6', '1'], '2', '8 ÷ 4 = 2.',
      { prompt_nl: 'Een kwart van 8 is:', prompt_en: 'One quarter of 8 is:', prompt_es: 'Un cuarto de 8 es:', correction_nl: '8 ÷ 4 = 2.', correction_en: '8 ÷ 4 = 2.', correction_es: '8 ÷ 4 = 2.' }),
    () => mc('Le tiers de 12 est :', ['4', '3', '6', '2'], '4', '12 ÷ 3 = 4.',
      { prompt_nl: 'Een derde van 12 is:', prompt_en: 'One third of 12 is:', prompt_es: 'Un tercio de 12 es:', correction_nl: '12 ÷ 3 = 4.', correction_en: '12 ÷ 3 = 4.', correction_es: '12 ÷ 3 = 4.' }),
    () => mc('La moitié de 20 est :', ['10', '5', '15', '8'], '10', '20 ÷ 2 = 10.',
      { prompt_nl: 'De helft van 20 is:', prompt_en: 'Half of 20 is:', prompt_es: 'La mitad de 20 es:', correction_nl: '20 ÷ 2 = 10.', correction_en: '20 ÷ 2 = 10.', correction_es: '20 ÷ 2 = 10.' }),
    () => mc('3/4 signifie :', ['3 parties sur 4', '4 parties sur 3', '1 partie sur 4', '3 parties sur 3'], '3 parties sur 4', '3/4 = 3 parties sur 4.',
      { prompt_nl: '3/4 betekent:', prompt_en: '3/4 means:', prompt_es: '3/4 significa:', correction_nl: '3 delen van 4.', correction_en: '3 parts out of 4.', correction_es: '3 partes de 4.' }),
    () => mc('Quelle fraction est la plus grande ?', ['3/4', '1/4', '2/4', '1/2'], '3/4', '3/4 est la plus grande.',
      { prompt_nl: 'Welk breuk is het grootst?', prompt_en: 'Which fraction is the largest?', prompt_es: '¿Qué fracción es la mayor?', correction_nl: '3/4 is het grootst.', correction_en: '3/4 is the largest.', correction_es: '3/4 es la mayor.' }),
    () => mc('Quelle fraction est la plus petite ?', ['1/4', '3/4', '1/2', '2/3'], '1/4', '1/4 est la plus petite.',
      { prompt_nl: 'Welk breuk is het kleinst?', prompt_en: 'Which fraction is the smallest?', prompt_es: '¿Qué fracción es la menor?', correction_nl: '1/4 is het kleinst.', correction_en: '1/4 is the smallest.', correction_es: '1/4 es la menor.' }),
    () => fb('La moitié de 16 est ___ .', '8', '16 ÷ 2 = 8.', ['8'],
      { prompt_nl: 'De helft van 16 is ___ .', prompt_en: 'Half of 16 is ___ .', prompt_es: 'La mitad de 16 es ___ .', correction_nl: '16 ÷ 2 = 8.', correction_en: '16 ÷ 2 = 8.', correction_es: '16 ÷ 2 = 8.' }),
    () => fb('Le quart de 12 est ___ .', '3', '12 ÷ 4 = 3.', ['3'],
      { prompt_nl: 'Een kwart van 12 is ___ .', prompt_en: 'One quarter of 12 is ___ .', prompt_es: 'Un cuarto de 12 es ___ .', correction_nl: '12 ÷ 4 = 3.', correction_en: '12 ÷ 4 = 3.', correction_es: '12 ÷ 4 = 3.' }),
    () => mc('1/2 + 1/2 = ?', ['1', '2', '1/4', '1/3'], '1', '1/2 + 1/2 = 1 entier.',
      { prompt_nl: '1/2 + 1/2 = ?', prompt_en: '1/2 + 1/2 = ?', prompt_es: '1/2 + 1/2 = ?', correction_nl: '1/2 + 1/2 = 1 geheel.', correction_en: '1/2 + 1/2 = 1 whole.', correction_es: '1/2 + 1/2 = 1 entero.' }),
    () => mc('1/4 + 1/4 = ?', ['2/4', '2/8', '1/2', '1/4'], '2/4', '1/4 + 1/4 = 2/4.',
      { prompt_nl: '1/4 + 1/4 = ?', prompt_en: '1/4 + 1/4 = ?', prompt_es: '1/4 + 1/4 = ?', correction_nl: '1/4 + 1/4 = 2/4.', correction_en: '1/4 + 1/4 = 2/4.', correction_es: '1/4 + 1/4 = 2/4.' }),
    () => mc('Une pizza est coupée en 4 parts égales. Tu en manges 1. Quelle fraction reste ?', ['3/4', '1/4', '2/4', '1/2'], '3/4', 'Il reste 3/4 de la pizza.'),
    () => mc('Un gâteau est coupé en 2. Paul mange 1 moitié. Quelle fraction reste ?', ['1/2', '1/4', '2/4', '3/4'], '1/2', 'Il reste 1/2 du gâteau.'),
    () => tf('2/4 = 1/2.', true, '2/4 se simplifie en 1/2.',
      { prompt_nl: '2/4 = 1/2.', prompt_en: '2/4 = 1/2.', prompt_es: '2/4 = 1/2.', correction_nl: '2/4 vereenvoudigt tot 1/2.', correction_en: '2/4 simplifies to 1/2.', correction_es: '2/4 se simplifica a 1/2.' }),
  ];

  const exams = [];
  for (let n = 1; n <= 20; n++) {
    exams.push(exam('fractions', meta, n, `Fractions ${n}`, '½', (key) => {
      const rng = makeRng(15000 + n * 23 + key.length);
      const count = key === 'facile' ? 8 : 10;
      return shuffle(rng, bank).slice(0, count).map((f) => { const q = f(); q.id = Q(); return q; });
    }));
  }
  return { dir: 'fractions', exams };
}

// ── SCIENCES ─────────────────────────────────────────────────────────────────
function buildSciences() {
  const meta = { label: 'Sciences', emoji: '🔬', order: 16 };
  const bank = [
    () => mc('Les plantes ont besoin de :', ['lumière, eau et terre', 'chocolat et lait', 'froid et obscurité', 'sable et sel'], 'lumière, eau et terre', 'Les plantes ont besoin de lumière, eau et terre.'),
    () => mc('Quel organe pompe le sang dans le corps ?', ['le cœur', 'le poumon', 'le cerveau', 'l\'estomac'], 'le cœur', 'Le cœur pompe le sang.'),
    () => mc('Avec quoi respire-t-on ?', ['les poumons', 'l\'estomac', 'le foie', 'les reins'], 'les poumons', 'On respire avec les poumons.'),
    () => mc('La photosynthèse est réalisée par :', ['les plantes', 'les animaux', 'les champignons', 'les pierres'], 'les plantes', 'Les plantes font la photosynthèse.'),
    () => mc('Quel animal est un mammifère ?', ['le chien', 'l\'aigle', 'la grenouille', 'le serpent'], 'le chien', 'Le chien est un mammifère.'),
    () => mc('Quel animal pond des oeufs ?', ['la poule', 'le chat', 'le chien', 'la vache'], 'la poule', 'La poule pond des oeufs.'),
    () => mc('Quelle planète est la plus proche du Soleil ?', ['Mercure', 'Vénus', 'Terre', 'Mars'], 'Mercure', 'Mercure est la planète la plus proche du Soleil.'),
    () => mc('De quoi est composé l\'air que l\'on respire surtout ?', ['azote et oxygène', 'dioxyde de carbone', 'vapeur d\'eau', 'hélium'], 'azote et oxygène', 'L\'air est composé d\'azote (~78%) et d\'oxygène (~21%).'),
    () => tf('L\'eau bout à 100°C.', true, 'L\'eau bout à 100 degrés Celsius.'),
    () => tf('Le Soleil tourne autour de la Terre.', false, 'C\'est la Terre qui tourne autour du Soleil.'),
    () => mc('Un insecte a combien de pattes ?', ['6', '4', '8', '2'], '6', 'Les insectes ont 6 pattes.'),
    () => mc('Une araignée a combien de pattes ?', ['8', '6', '4', '10'], '8', 'Les araignées ont 8 pattes.'),
    () => mc('L\'eau en état solide est :', ['la glace', 'la vapeur', 'la pluie', 'la rosée'], 'la glace', 'L\'eau solide = la glace.'),
    () => mc('L\'eau en état gazeux est :', ['la vapeur', 'la glace', 'la neige', 'la grêle'], 'la vapeur', 'L\'eau gazeuse = la vapeur.'),
    () => mc('Quelle énergie vient du Soleil ?', ['l\'énergie solaire', 'l\'énergie éolienne', 'l\'énergie hydraulique', 'l\'énergie nucléaire'], 'l\'énergie solaire', 'Le Soleil donne l\'énergie solaire.'),
    () => mc('Quel sens utilise-t-on pour sentir une fleur ?', ['l\'odorat', 'le goût', 'la vue', 'le toucher'], 'l\'odorat', 'On sent avec l\'odorat (le nez).'),
    () => mc('Quel est le rôle des racines d\'une plante ?', ['absorber l\'eau', 'faire la photosynthèse', 'produire des graines', 'attirer les insectes'], 'absorber l\'eau', 'Les racines absorbent l\'eau du sol.'),
    () => mc('Le cycle de l\'eau commence par :', ['l\'évaporation', 'les précipitations', 'la condensation', 'le ruissellement'], 'l\'évaporation', 'Le cycle de l\'eau commence par l\'évaporation.'),
    () => mc('Quel astre éclaire la nuit ?', ['la Lune', 'le Soleil', 'Mars', 'Jupiter'], 'la Lune', 'La Lune éclaire la nuit (lumière réfléchie).'),
    () => tf('Les plantes produisent de l\'oxygène.', true, 'Les plantes produisent de l\'oxygène grâce à la photosynthèse.'),
    () => mc('Qu\'est-ce qu\'un vertébré ?', ['un animal avec une colonne vertébrale', 'un animal avec 6 pattes', 'un animal qui vole', 'un animal aquatique'], 'un animal avec une colonne vertébrale', 'Un vertébré a une colonne vertébrale.'),
    () => mc('La chaîne alimentaire commence par :', ['les plantes', 'les herbivores', 'les carnivores', 'les décomposeurs'], 'les plantes', 'La chaîne alimentaire commence par les plantes.'),
    () => mc('Quel sens utilise-t-on pour écouter de la musique ?', ['l\'ouïe', 'la vue', 'l\'odorat', 'le toucher'], 'l\'ouïe', 'On écoute avec l\'ouïe (les oreilles).'),
    () => mc('Un herbivore mange :', ['des plantes', 'de la viande', 'des insectes', 'des poissons'], 'des plantes', 'Un herbivore mange uniquement des plantes.'),
    () => mc('Un carnivore mange :', ['de la viande', 'des plantes', 'des fruits', 'des graines'], 'de la viande', 'Un carnivore mange de la viande.'),
  ];

  const exams = [];
  for (let n = 1; n <= 20; n++) {
    exams.push(exam('sciences', meta, n, `Sciences ${n}`, '🔬', (key) => {
      const rng = makeRng(16000 + n * 29 + key.length);
      const count = key === 'facile' ? 8 : 10;
      return shuffle(rng, bank).slice(0, count).map((f) => { const q = f(); q.id = Q(); return q; });
    }));
  }
  return { dir: 'sciences', exams };
}

// ── GÉOGRAPHIE BELGIQUE ───────────────────────────────────────────────────────
function buildGeoBelgique() {
  const meta = { label: 'Géographie & Belgique', emoji: '🇧🇪', order: 17 };
  const bank = [
    () => mc('Quelle est la capitale de la Belgique ?', ['Bruxelles', 'Anvers', 'Liège', 'Gand'], 'Bruxelles', 'Bruxelles est la capitale de la Belgique.'),
    () => mc('Combien de régions compte la Belgique ?', ['3', '2', '4', '5'], '3', 'La Belgique a 3 régions : Wallonie, Flandre, Bruxelles.'),
    () => mc('Quelle est la langue parlée en Flandre ?', ['le néerlandais', 'le français', 'l\'allemand', 'l\'anglais'], 'le néerlandais', 'En Flandre on parle néerlandais.'),
    () => mc('Quelle est la langue parlée en Wallonie ?', ['le français', 'le néerlandais', 'l\'allemand', 'l\'espagnol'], 'le français', 'En Wallonie on parle français.'),
    () => mc('Quel fleuve traverse Liège ?', ['la Meuse', 'l\'Escaut', 'la Sambre', 'la Semois'], 'la Meuse', 'La Meuse traverse Liège.'),
    () => mc('Quelle est la plus grande ville de Belgique ?', ['Bruxelles', 'Anvers', 'Gand', 'Liège'], 'Bruxelles', 'Bruxelles est la plus grande ville.'),
    () => mc('Quel pays borde la Belgique au nord ?', ['les Pays-Bas', 'la France', 'l\'Allemagne', 'le Luxembourg'], 'les Pays-Bas', 'Les Pays-Bas bordent la Belgique au nord.'),
    () => mc('Quel pays borde la Belgique au sud ?', ['la France', 'les Pays-Bas', 'l\'Allemagne', 'l\'Angleterre'], 'la France', 'La France borde la Belgique au sud.'),
    () => tf('La Belgique a une façade sur la mer du Nord.', true, 'La Belgique a 67 km de côte sur la mer du Nord.'),
    () => tf('Bruxelles est en Flandre.', false, 'Bruxelles est une région à part, bilingue.'),
    () => mc('Comment s\'appelle le roi de Belgique ?', ['Philippe', 'Albert', 'Léopold', 'Charles'], 'Philippe', 'Le roi de Belgique est Philippe (depuis 2013).'),
    () => mc('Quel est le symbole national belge ?', ['le lion', 'l\'aigle', 'le coq', 'le taureau'], 'le lion', 'Le lion est le symbole national belge.'),
    () => mc('Quelle ville belge est connue pour ses chocolats ?', ['Bruxelles', 'Namur', 'Dinant', 'Bruges'], 'Bruxelles', 'Bruxelles est très connue pour ses chocolats.'),
    () => mc('Quelle ville belge est surnommée « la Venise du Nord » ?', ['Bruges', 'Gand', 'Anvers', 'Liège'], 'Bruges', 'Bruges est surnommée la Venise du Nord.'),
    () => mc('Dans quelle région se trouve Liège ?', ['Wallonie', 'Flandre', 'Bruxelles', 'Ardenne'], 'Wallonie', 'Liège est en Wallonie.'),
    () => mc('Qu\'est-ce que l\'Atomium ?', ['un monument à Bruxelles', 'un volcan', 'une forêt', 'un château'], 'un monument à Bruxelles', 'L\'Atomium est un monument à Bruxelles (1958).'),
    () => mc('Quel est le continent de la Belgique ?', ['l\'Europe', 'l\'Asie', 'l\'Afrique', 'l\'Amérique'], 'l\'Europe', 'La Belgique est en Europe.'),
    () => mc('La mer du Nord est :', ['à l\'ouest de la Belgique', 'au sud', 'à l\'est', 'au centre'], 'à l\'ouest de la Belgique', 'La mer du Nord est à l\'ouest/nord de la Belgique.'),
    () => tf('Anvers est un grand port maritime.', true, 'Anvers est l\'un des plus grands ports d\'Europe.'),
    () => mc('Quelle forêt belge est très connue ?', ['l\'Ardenne', 'la Forêt-Noire', 'les Vosges', 'la Camargue'], 'l\'Ardenne', 'L\'Ardenne est la grande forêt belge.'),
    () => mc('Dans quelle région se trouve Gand ?', ['Flandre', 'Wallonie', 'Bruxelles', 'Ardenne'], 'Flandre', 'Gand est en Flandre.'),
    () => mc('Quelle est la monnaie de la Belgique ?', ['l\'euro', 'le franc', 'la livre', 'le dollar'], 'l\'euro', 'La Belgique utilise l\'euro depuis 2002.'),
    () => mc('La Belgique fait partie de :', ['l\'Union européenne', 'les États-Unis', 'l\'ASEAN', 'la Ligue arabe'], 'l\'Union européenne', 'La Belgique est membre de l\'UE.'),
    () => mc('Comment s\'appelle la côte belge ?', ['la Côte belge', 'la Côte d\'Azur', 'la Côte atlantique', 'la Costa Brava'], 'la Côte belge', 'La côte maritime s\'appelle la Côte belge.'),
    () => mc('Quelle ville accueille le Grand-Place ?', ['Bruxelles', 'Liège', 'Namur', 'Mons'], 'Bruxelles', 'La Grand-Place est à Bruxelles.'),
  ];

  const exams = [];
  for (let n = 1; n <= 20; n++) {
    exams.push(exam('geographie-belgique', meta, n, `Belgique & Europe ${n}`, '🇧🇪', (key) => {
      const rng = makeRng(17000 + n * 37 + key.length);
      const count = key === 'facile' ? 8 : 10;
      return shuffle(rng, bank).slice(0, count).map((f) => { const q = f(); q.id = Q(); return q; });
    }));
  }
  return { dir: 'geographie-belgique', exams };
}

export function buildExtraCategories() {
  return [
    buildTables(),
    buildFractions(),
    buildSciences(),
    buildGeoBelgique(),
  ];
}
