// ─────────────────────────────────────────────────────────────────────────────
// Builders for the remaining 11 exam-library categories.
// Each builder returns { dir, exams[] }. 10 exams × 3 levels each.
// Deterministic (seeded) so re-running reproduces the same library.
// ─────────────────────────────────────────────────────────────────────────────

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
const pickIdx = (rng, n) => Math.floor(rng() * n);
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

// question helpers
let _q = 0;
const Q = () => `q${++_q}`;
const resetQ = () => { _q = 0; };
const mc = (prompt, options, answer, correction) => ({ id: Q(), type: 'mcq', prompt, options, answer: String(answer), correction });
const tf = (prompt, answer, correction) => ({ id: Q(), type: 'true_false', prompt, answer, correction });
const fb = (prompt, answer, correction, accept) => ({ id: Q(), type: 'fill_blank', prompt, answer: String(answer), accept, correction });

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

// ── 3. PROBLÈMES MATHÉMATIQUES ──────────────────────────────────────────────
function buildProblemes() {
  const meta = { label: 'Problèmes mathématiques', emoji: '📖', order: 3 };
  const names = ['Léa', 'Tom', 'Maya', 'Hugo', 'Nina', 'Sami', 'Emma', 'Théo'];
  const items = ['billes', 'bonbons', 'images', 'pommes', 'crayons', 'fleurs', 'livres', 'autocollants'];
  const themes = items;
  const exams = [];
  for (let n = 1; n <= 10; n++) {
    const item = themes[(n - 1) % themes.length];
    exams.push(exam('problemes-mathematiques', meta, n, `Problèmes : les ${item}`, '📖', (key) => {
      const rng = makeRng(3000 + n * 13 + key.length);
      const qs = [];
      for (let i = 0; i < 10; i++) {
        const name = names[ri(rng, 0, names.length - 1)];
        const f = key === 'facile' ? 1 : key === 'moyen' ? 2 : 3;
        let answer, prompt, correction;
        const mode = key === 'facile' ? ri(rng, 0, 1) : ri(rng, 0, 2);
        if (mode === 0) {
          const a = ri(rng, 2, 9 * f), b = ri(rng, 1, 9 * f);
          answer = a + b; prompt = `${name} a ${a} ${item}. On lui en donne ${b}. Combien en a-t-${name} maintenant ?`;
          correction = `${a} + ${b} = ${answer} ${item}.`;
        } else if (mode === 1) {
          const a = ri(rng, 10, 12 * f), b = ri(rng, 1, 9);
          answer = a - b; prompt = `${name} a ${a} ${item}. ${name} en perd ${b}. Combien en reste-t-il ?`;
          correction = `${a} − ${b} = ${answer} ${item}.`;
        } else {
          const g = ri(rng, 2, 5), e = ri(rng, 2, 6);
          answer = g * e; prompt = `${name} a ${g} boîtes de ${e} ${item}. Combien de ${item} en tout ?`;
          correction = `${g} × ${e} = ${answer} ${item}.`;
        }
        qs.push(i % 3 === 2 ? fb(prompt, answer, correction) : mc(prompt, numOpts(rng, answer, 5 * f), answer, correction));
      }
      return qs;
    }));
  }
  return { dir: 'problemes-mathematiques', exams };
}

// ── 4. CALENDRIER & TEMPS ───────────────────────────────────────────────────
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const SEASONS = ['printemps', 'été', 'automne', 'hiver'];
function buildCalendrier() {
  const meta = { label: 'Calendrier & temps', emoji: '📅', order: 4 };
  const exams = [];
  const banks = [
    () => mc('Quel mois vient après janvier ?', shuffleStatic(['février', 'mars', 'décembre']), 'février', 'Après janvier vient février.'),
    () => mc('Combien de jours dans une semaine ?', ['7', '5', '10'], '7', 'Une semaine = 7 jours.'),
    () => mc('Quel jour vient après lundi ?', ['mardi', 'dimanche', 'jeudi'], 'mardi', 'Après lundi vient mardi.'),
    () => mc('En quelle saison neige-t-il souvent ?', ['hiver', 'été', 'printemps'], 'hiver', 'Il neige en hiver.'),
    () => mc('Combien de mois dans une année ?', ['12', '10', '7'], '12', 'Une année = 12 mois.'),
    () => mc('Quelle saison vient après le printemps ?', ['été', 'hiver', 'automne'], 'été', 'Après le printemps vient l’été.'),
    () => tf('Le mois de décembre est en hiver.', true, 'Décembre est un mois d’hiver.'),
    () => mc('Le dernier mois de l’année est :', ['décembre', 'janvier', 'juin'], 'décembre', 'Décembre est le 12e mois.'),
    () => mc('Combien de saisons y a-t-il ?', ['4', '2', '6'], '4', 'Il y a 4 saisons.'),
    () => mc('Noël est au mois de :', ['décembre', 'juillet', 'mars'], 'décembre', 'Noël est le 25 décembre.'),
    () => mc('Le jour avant samedi est :', ['vendredi', 'dimanche', 'lundi'], 'vendredi', 'Avant samedi : vendredi.'),
    () => mc('Les vacances d’été sont en :', ['juillet', 'janvier', 'novembre'], 'juillet', 'L’été : juillet-août.'),
    () => fb('Le premier mois de l’année est ___ .', 'janvier', 'L’année commence en janvier.'),
    () => mc('Le week-end, ce sont les jours :', ['samedi et dimanche', 'lundi et mardi', 'jeudi et vendredi'], 'samedi et dimanche', 'Le week-end : samedi et dimanche.'),
    () => mc('Au printemps, les fleurs :', ['poussent', 'tombent', 'gèlent'], 'poussent', 'Au printemps les fleurs poussent.'),
  ];
  for (let n = 1; n <= 10; n++) {
    exams.push(exam('calendrier-temps', meta, n, `Le temps qui passe ${n}`, '📅', (key) => {
      const rng = makeRng(4000 + n * 17 + key.length);
      const count = key === 'facile' ? 8 : 10;
      return shuffle(rng, banks).slice(0, count).map((f) => { const q = f(); q.id = Q(); return q; });
    }));
  }
  return { dir: 'calendrier-temps', exams };
}
function shuffleStatic(a) { return a; }

// ── Generic authored-bank category builder ──────────────────────────────────
function bankCategory(category, meta, titles, defEmoji, bank) {
  const exams = [];
  for (let n = 1; n <= 10; n++) {
    exams.push(exam(category, meta, n, titles[(n - 1) % titles.length] + ` ${n}`, defEmoji, (key) => {
      const rng = makeRng(category.length * 100 + n * 19 + key.length);
      const count = key === 'facile' ? 8 : 10;
      return shuffle(rng, bank).slice(0, count).map((f) => { const q = f(); q.id = Q(); return q; });
    }));
  }
  return { dir: category, exams };
}

// 5. VOCABULAIRE
function buildVocabulaire() {
  const meta = { label: 'Vocabulaire', emoji: '💬', order: 5 };
  const bank = [
    () => mc('Le contraire de « grand » :', ['petit', 'gros', 'haut'], 'petit', 'grand ↔ petit.'),
    () => mc('Le contraire de « chaud » :', ['froid', 'tiède', 'doux'], 'froid', 'chaud ↔ froid.'),
    () => mc('Un synonyme de « content » :', ['heureux', 'triste', 'fâché'], 'heureux', 'content = heureux.'),
    () => mc('Le contraire de « jour » :', ['nuit', 'soir', 'matin'], 'nuit', 'jour ↔ nuit.'),
    () => mc('Un fruit :', ['banane', 'carotte', 'chaise'], 'banane', 'La banane est un fruit.'),
    () => mc('Un animal de la ferme :', ['vache', 'lion', 'requin'], 'vache', 'La vache vit à la ferme.'),
    () => mc('Le contraire de « rapide » :', ['lent', 'vite', 'fort'], 'lent', 'rapide ↔ lent.'),
    () => mc('Un synonyme de « joli » :', ['beau', 'laid', 'vieux'], 'beau', 'joli = beau.'),
    () => mc('Le contraire de « ouvert » :', ['fermé', 'grand', 'vide'], 'fermé', 'ouvert ↔ fermé.'),
    () => mc('Une couleur :', ['rouge', 'pomme', 'table'], 'rouge', 'Le rouge est une couleur.'),
    () => mc('Le contraire de « propre » :', ['sale', 'mouillé', 'neuf'], 'sale', 'propre ↔ sale.'),
    () => fb('Le contraire de « monter » est de ___ .', 'descendre', 'monter ↔ descendre.', ['descendre']),
    () => mc('Un légume :', ['carotte', 'fraise', 'banane'], 'carotte', 'La carotte est un légume.'),
    () => mc('Un synonyme de « regarder » :', ['observer', 'manger', 'courir'], 'observer', 'regarder = observer.'),
    () => mc('Le contraire de « plein » :', ['vide', 'lourd', 'grand'], 'vide', 'plein ↔ vide.'),
  ];
  return bankCategory('vocabulaire', meta, ['Les mots'], '💬', bank);
}

// 6. ORTHOGRAPHE
function buildOrthographe() {
  const meta = { label: 'Orthographe', emoji: '✏️', order: 6 };
  const words = [['maison', 'm_ison', 'a'], ['école', 'éc_le', 'o'], ['chat', 'ch_t', 'a'], ['fleur', 'fl_ur', 'e'], ['oiseau', 'ois_au', 'e'], ['table', 'ta_le', 'b'], ['livre', 'li_re', 'v'], ['soleil', 'sol_il', 'e'], ['jardin', 'jar_in', 'd'], ['voiture', 'voit_re', 'u']];
  const bank = [
    ...words.map(([w, masked, letter]) => () => fb(`Complète le mot : ${masked}`, letter, `On écrit « ${w} » (lettre « ${letter} »).`, [letter])),
    () => mc('Quel mot est bien écrit ?', ['maman', 'mamen', 'momen'], 'maman', 'On écrit « maman ».'),
    () => mc('Quel mot est bien écrit ?', ['bateau', 'batau', 'bato'], 'bateau', 'On écrit « bateau ».'),
    () => mc('Quel mot est bien écrit ?', ['école', 'ékole', 'écolle'], 'école', 'On écrit « école ».'),
    () => mc('Quel mot est bien écrit ?', ['oiseau', 'oizeau', 'oisau'], 'oiseau', 'On écrit « oiseau ».'),
    () => mc('Quel mot est bien écrit ?', ['maison', 'mayson', 'mèson'], 'maison', 'On écrit « maison ».'),
  ];
  return bankCategory('orthographe', meta, ['Bien écrire'], '✏️', bank);
}

// 7. DICTÉE (self-contained: choose correct spelling / write from definition)
function buildDictee() {
  const meta = { label: 'Dictée', emoji: '🎧', order: 7 };
  const bank = [
    () => mc('On entend « chat ». On écrit :', ['chat', 'cha', 'chate'], 'chat', 'Le mot « chat ».'),
    () => mc('On entend « maman ». On écrit :', ['maman', 'mamen', 'mama'], 'maman', 'Le mot « maman ».'),
    () => fb('Écris le mot qui désigne l’astre du jour (le ___).', 'soleil', 'C’est le soleil.', ['soleil']),
    () => fb('Écris le contraire de « grand ».', 'petit', 'Le mot « petit ».', ['petit']),
    () => mc('On entend « bateau ». On écrit :', ['bateau', 'bato', 'batau'], 'bateau', 'Le mot « bateau ».'),
    () => mc('On entend « fleur ». On écrit :', ['fleur', 'fleure', 'flèr'], 'fleur', 'Le mot « fleur ».'),
    () => fb('Écris le mot : l’animal qui aboie est le ___ .', 'chien', 'C’est le chien.', ['chien']),
    () => mc('La phrase correcte :', ['Le chat dort.', 'Le chat dor.', 'Le chate dort.'], 'Le chat dort.', 'On écrit « Le chat dort. ».'),
    () => mc('La phrase correcte :', ['Maman cuisine.', 'Maman cuisin.', 'Mamen cuisine.'], 'Maman cuisine.', 'On écrit « Maman cuisine. ».'),
    () => fb('Écris le mot : on lit un ___ à la bibliothèque.', 'livre', 'C’est un livre.', ['livre']),
    () => mc('On entend « voiture ». On écrit :', ['voiture', 'voitur', 'voature'], 'voiture', 'Le mot « voiture ».'),
    () => mc('On entend « jardin ». On écrit :', ['jardin', 'jardain', 'jardun'], 'jardin', 'Le mot « jardin ».'),
  ];
  return bankCategory('dictee', meta, ['Dictée'], '🎧', bank);
}

// 8. GRAMMAIRE
function buildGrammaire() {
  const meta = { label: 'Grammaire', emoji: '🧩', order: 8 };
  const bank = [
    () => mc('« chat » est un :', ['nom', 'verbe', 'adjectif'], 'nom', '« chat » est un nom.'),
    () => mc('« courir » est un :', ['verbe', 'nom', 'adjectif'], 'verbe', '« courir » est un verbe.'),
    () => mc('« rouge » est un :', ['adjectif', 'nom', 'verbe'], 'adjectif', '« rouge » décrit : adjectif.'),
    () => mc('Le pluriel de « un chat » :', ['des chats', 'des chat', 'un chats'], 'des chats', 'Pluriel : des chats.'),
    () => mc('« une fleur » est :', ['féminin', 'masculin', 'pluriel'], 'féminin', '« une » → féminin.'),
    () => mc('« un livre » est :', ['masculin', 'féminin', 'pluriel'], 'masculin', '« un » → masculin.'),
    () => tf('« maison » est un nom.', true, '« maison » est un nom.'),
    () => tf('« manger » est un adjectif.', false, '« manger » est un verbe.'),
    () => mc('Le pluriel de « une maison » :', ['des maisons', 'des maison', 'une maisons'], 'des maisons', 'Pluriel : des maisons.'),
    () => fb('Le pluriel de « un chien » est « des ___ ».', 'chiens', 'On ajoute un « s ».', ['chiens']),
    () => mc('Dans « le grand chien », l’adjectif est :', ['grand', 'chien', 'le'], 'grand', '« grand » est l’adjectif.'),
    () => mc('« sauter » est un :', ['verbe', 'nom', 'adjectif'], 'verbe', '« sauter » est un verbe.'),
    () => mc('« une école » est :', ['féminin', 'masculin', 'pluriel'], 'féminin', '« une » → féminin.'),
    () => mc('Le pluriel de « le jardin » :', ['les jardins', 'le jardins', 'les jardin'], 'les jardins', 'Pluriel : les jardins.'),
  ];
  return bankCategory('grammaire', meta, ['Les mots et les phrases'], '🧩', bank);
}

// 9. CONJUGAISON
function buildConjugaison() {
  const meta = { label: 'Conjugaison', emoji: '🔁', order: 9 };
  const bank = [
    () => mc('Je ___ (être) content.', ['suis', 'es', 'est'], 'suis', 'Je suis.'),
    () => mc('Tu ___ (avoir) un chien.', ['as', 'ai', 'a'], 'as', 'Tu as.'),
    () => mc('Il ___ (manger) une pomme.', ['mange', 'manges', 'mangent'], 'mange', 'Il mange.'),
    () => mc('Nous ___ (être) à l’école.', ['sommes', 'êtes', 'est'], 'sommes', 'Nous sommes.'),
    () => mc('Demain, je ___ au parc. (aller, futur)', ['irai', 'vais', 'allé'], 'irai', 'Futur : j’irai.'),
    () => mc('Hier, j’ ___ mangé. (avoir, passé composé)', ['ai', 'suis', 'as'], 'ai', 'Passé composé : j’ai mangé.'),
    () => fb('Je ___ (avoir) faim. (présent)', 'ai', 'J’ai faim.', ['ai']),
    () => mc('Elles ___ (chanter) bien.', ['chantent', 'chante', 'chantes'], 'chantent', 'Elles chantent.'),
    () => mc('Vous ___ (être) gentils.', ['êtes', 'sommes', 'est'], 'êtes', 'Vous êtes.'),
    () => mc('Demain, tu ___ (être) en vacances.', ['seras', 'es', 'étais'], 'seras', 'Futur : tu seras.'),
    () => mc('Hier, il a ___ (jouer).', ['joué', 'joue', 'jouer'], 'joué', 'Passé : il a joué.'),
    () => fb('Nous ___ (aimer) la lecture. (présent)', 'aimons', 'Nous aimons.', ['aimons']),
    () => mc('Je ___ (faire) mes devoirs.', ['fais', 'fait', 'font'], 'fais', 'Je fais.'),
    () => mc('Plus tard, je ___ (manger). (futur)', ['mangerai', 'mange', 'mangé'], 'mangerai', 'Futur : je mangerai.'),
  ];
  return bankCategory('conjugaison', meta, ['Les verbes'], '🔁', bank);
}

// 10. LOGIQUE
function buildLogique() {
  const meta = { label: 'Logique', emoji: '🧠', order: 10 };
  const exams = [];
  const intrus = [
    () => mc('Trouve l’intrus : chat, chien, table, lapin', ['table', 'chat', 'lapin'], 'table', 'La table n’est pas un animal.'),
    () => mc('Trouve l’intrus : pomme, banane, voiture, fraise', ['voiture', 'pomme', 'fraise'], 'voiture', 'La voiture n’est pas un fruit.'),
    () => mc('Trouve l’intrus : rouge, bleu, chien, vert', ['chien', 'rouge', 'vert'], 'chien', 'Le chien n’est pas une couleur.'),
    () => mc('Trouve l’intrus : lundi, mardi, pomme, jeudi', ['pomme', 'lundi', 'jeudi'], 'pomme', 'La pomme n’est pas un jour.'),
  ];
  const classif = [
    () => mc('Range du plus petit au plus grand : 5, 2, 8', ['2, 5, 8', '8, 5, 2', '5, 2, 8'], '2, 5, 8', 'Ordre croissant : 2, 5, 8.'),
    () => mc('Quel nombre est le plus grand ?', ['9', '4', '7'], '9', '9 est le plus grand.'),
    () => mc('Quel nombre est le plus petit ?', ['3', '6', '8'], '3', '3 est le plus petit.'),
  ];
  for (let n = 1; n <= 10; n++) {
    exams.push(exam('logique', meta, n, `Réfléchis bien ${n}`, '🧠', (key) => {
      const rng = makeRng(7000 + n * 23 + key.length);
      const qs = [];
      const f = key === 'facile' ? 2 : key === 'moyen' ? 3 : 5;
      // number sequences (+step)
      const seqCount = key === 'facile' ? 5 : 6;
      for (let i = 0; i < seqCount; i++) {
        const start = ri(rng, 1, 5 * f), step = ri(rng, 1, f + 1);
        const s = [start, start + step, start + 2 * step, start + 3 * step];
        const answer = start + 4 * step;
        qs.push(mc(`Continue la suite : ${s.join(', ')}, …`, numOpts(rng, answer, step + 2), answer, `On ajoute ${step} à chaque fois : ${answer}.`));
      }
      const extra = shuffle(rng, [...intrus, ...classif]).slice(0, (key === 'facile' ? 3 : 4));
      for (const f2 of extra) { const q = f2(); qs.push(q); }
      return qs.map((q) => { q.id = Q(); return q; });
    }));
  }
  return { dir: 'logique', exams };
}

// 11. GÉOMÉTRIE
function buildGeometrie() {
  const meta = { label: 'Géométrie', emoji: '📐', order: 11 };
  const bank = [
    () => mc('Combien de côtés a un carré ?', ['4', '3', '5'], '4', 'Le carré a 4 côtés égaux.'),
    () => mc('Combien de côtés a un triangle ?', ['3', '4', '5'], '3', 'Le triangle a 3 côtés.'),
    () => mc('Quelle forme n’a pas de coin ?', ['le cercle', 'le carré', 'le triangle'], 'le cercle', 'Le cercle est rond, sans coin.'),
    () => mc('Un rectangle a combien de côtés ?', ['4', '3', '6'], '4', 'Le rectangle a 4 côtés.'),
    () => tf('Un carré a tous ses côtés égaux.', true, 'Oui, 4 côtés égaux.'),
    () => tf('Un triangle a 4 côtés.', false, 'Le triangle a 3 côtés.'),
    () => mc('Une balle a la forme d’un :', ['cercle', 'carré', 'triangle'], 'cercle', 'La balle est ronde.'),
    () => mc('Une fenêtre a souvent la forme d’un :', ['rectangle', 'cercle', 'triangle'], 'rectangle', 'Souvent un rectangle.'),
    () => mc('Combien de coins a un carré ?', ['4', '3', '0'], '4', 'Le carré a 4 coins.'),
    () => fb('La forme ronde s’appelle le ___ .', 'cercle', 'C’est le cercle.', ['cercle']),
    () => mc('Quelle forme a 3 coins ?', ['le triangle', 'le carré', 'le cercle'], 'le triangle', 'Le triangle a 3 coins.'),
    () => mc('Le rectangle a :', ['des côtés longs et courts', 'tous les côtés égaux', 'aucun côté'], 'des côtés longs et courts', 'Rectangle : longs et courts.'),
  ];
  return bankCategory('geometrie', meta, ['Les formes'], '📐', bank);
}

// 12. MESURES
function buildMesures() {
  const meta = { label: 'Mesures', emoji: '📏', order: 12 };
  const exams = [];
  for (let n = 1; n <= 10; n++) {
    exams.push(exam('mesures', meta, n, `Mesurer ${n}`, '📏', (key) => {
      const rng = makeRng(8000 + n * 29 + key.length);
      const kinds = key === 'facile' ? ['cm-mm'] : key === 'moyen' ? ['cm-mm', 'm-cm', 'euro'] : ['cm-mm', 'm-cm', 'euro', 'kg-g', 'temps'];
      const count = key === 'facile' ? 8 : 10;
      const qs = [];
      for (let i = 0; i < count; i++) {
        const kind = kinds[ri(rng, 0, kinds.length - 1)];
        const x = ri(rng, 1, 9);
        let prompt, answer, accept, corr;
        if (kind === 'cm-mm') { answer = x * 10; prompt = `Convertis ${x} cm en mm.`; accept = [`${answer}`, `${answer} mm`]; corr = `1 cm = 10 mm → ${answer} mm.`; }
        else if (kind === 'm-cm') { answer = x * 100; prompt = `Convertis ${x} m en cm.`; accept = [`${answer}`, `${answer} cm`]; corr = `1 m = 100 cm → ${answer} cm.`; }
        else if (kind === 'kg-g') { answer = x * 1000; prompt = `Convertis ${x} kg en g.`; accept = [`${answer}`, `${answer} g`]; corr = `1 kg = 1000 g → ${answer} g.`; }
        else if (kind === 'euro') { answer = x * 100; prompt = `Convertis ${x} € en centimes.`; accept = [`${answer}`, `${answer} centimes`, `${answer} c`]; corr = `1 € = 100 c → ${answer} centimes.`; }
        else { answer = x * 60; prompt = `Convertis ${x} heure(s) en minutes.`; accept = [`${answer}`, `${answer} min`]; corr = `1 h = 60 min → ${answer} min.`; }
        qs.push(i % 3 === 1
          ? fb(prompt, String(answer), corr, accept)
          : mc(prompt, numOpts(rng, answer, Math.max(2, Math.round(answer / 5))), answer, corr));
      }
      return qs;
    }));
  }
  return { dir: 'mesures', exams };
}

// 13. DÉCOUVERTE DU MONDE
function buildDecouverte() {
  const meta = { label: 'Découverte du monde', emoji: '🌍', order: 13 };
  const bank = [
    () => mc('La vache nous donne :', ['du lait', 'des œufs', 'de la laine'], 'du lait', 'La vache donne du lait.'),
    () => mc('La poule pond des :', ['œufs', 'plumes', 'fruits'], 'œufs', 'La poule pond des œufs.'),
    () => mc('En automne, les feuilles :', ['tombent', 'poussent', 'gèlent'], 'tombent', 'En automne, les feuilles tombent.'),
    () => mc('Quand il pleut, on prend un :', ['parapluie', 'ballon', 'livre'], 'parapluie', 'Contre la pluie : le parapluie.'),
    () => mc('On respire avec les :', ['poumons', 'mains', 'pieds'], 'poumons', 'On respire avec les poumons.'),
    () => mc('On met le papier dans la poubelle :', ['de recyclage', 'normale', 'à compost'], 'de recyclage', 'Le papier se recycle.'),
    () => mc('Le pompier éteint :', ['le feu', 'la pluie', 'le vent'], 'le feu', 'Le pompier éteint le feu.'),
    () => mc('Le docteur soigne les :', ['malades', 'voitures', 'maisons'], 'malades', 'Le docteur soigne les malades.'),
    () => tf('Le soleil se lève le matin.', true, 'Oui, le matin.'),
    () => mc('En hiver, il fait :', ['froid', 'très chaud', 'lourd'], 'froid', 'En hiver il fait froid.'),
    () => mc('On voit avec les :', ['yeux', 'oreilles', 'genoux'], 'yeux', 'On voit avec les yeux.'),
    () => mc('Le boulanger fait le :', ['pain', 'lait', 'bois'], 'pain', 'Le boulanger fait le pain.'),
    () => fb('L’abeille fabrique le ___ .', 'miel', 'L’abeille fait le miel.', ['miel']),
    () => mc('Pour grandir, les plantes ont besoin de :', ['soleil et eau', 'chocolat', 'jouets'], 'soleil et eau', 'Soleil + eau.'),
    () => mc('On entend avec les :', ['oreilles', 'yeux', 'mains'], 'oreilles', 'On entend avec les oreilles.'),
  ];
  return bankCategory('decouverte-monde', meta, ['Le monde autour de moi'], '🌍', bank);
}

export function buildAllCategories() {
  return [
    buildProblemes(),
    buildCalendrier(),
    buildVocabulaire(),
    buildOrthographe(),
    buildDictee(),
    buildGrammaire(),
    buildConjugaison(),
    buildLogique(),
    buildGeometrie(),
    buildMesures(),
    buildDecouverte(),
  ];
}
