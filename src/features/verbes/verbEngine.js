// ── VERBES PRIORITAIRES ─────────────────────────────────────────────────
export const VERBES = {
  jouer:    { infinitif: 'jouer',   groupe: 1, emoji: '⚽',
    present:  { je:'joue',   tu:'joues',   il:'joue',   nous:'jouons',  vous:'jouez',  ils:'jouent'  },
    futur:    { je:'jouerai',tu:'joueras',  il:'jouera', nous:'jouerons',vous:'jouerez',ils:'joueront'},
    imparfait:{ je:'jouais', tu:'jouais',   il:'jouait', nous:'jouions', vous:'jouiez', ils:'jouaient'},
  },
  manger:   { infinitif: 'manger',  groupe: 1, emoji: '🍕',
    present:  { je:'mange',  tu:'manges',  il:'mange',  nous:'mangeons',vous:'mangez', ils:'mangent' },
    futur:    { je:'mangerai',tu:'mangeras',il:'mangera',nous:'mangerons',vous:'mangerez',ils:'mangeront'},
    imparfait:{ je:'mangeais',tu:'mangeais',il:'mangeait',nous:'mangions',vous:'mangiez',ils:'mangeaient'},
  },
  aimer:    { infinitif: 'aimer',   groupe: 1, emoji: '❤️',
    present:  { je:'aime',   tu:'aimes',   il:'aime',   nous:'aimons',  vous:'aimez',  ils:'aiment'  },
    futur:    { je:'aimerai',tu:'aimeras',  il:'aimera', nous:'aimerons',vous:'aimerez',ils:'aimeront'},
    imparfait:{ je:'aimais', tu:'aimais',   il:'aimait', nous:'aimions', vous:'aimiez', ils:'aimaient'},
  },
  parler:   { infinitif: 'parler',  groupe: 1, emoji: '💬',
    present:  { je:'parle',  tu:'parles',  il:'parle',  nous:'parlons', vous:'parlez', ils:'parlent' },
    futur:    { je:'parlerai',tu:'parleras',il:'parlera',nous:'parlerons',vous:'parlerez',ils:'parleront'},
    imparfait:{ je:'parlais',tu:'parlais',  il:'parlait',nous:'parlions',vous:'parliez',ils:'parlaient'},
  },
  chanter:  { infinitif: 'chanter', groupe: 1, emoji: '🎵',
    present:  { je:'chante', tu:'chantes', il:'chante', nous:'chantons',vous:'chantez',ils:'chantent' },
    futur:    { je:'chanterai',tu:'chanteras',il:'chantera',nous:'chanterons',vous:'chanterez',ils:'chanteront'},
    imparfait:{ je:'chantais',tu:'chantais',il:'chantait',nous:'chantions',vous:'chantiez',ils:'chantaient'},
  },
  regarder: { infinitif: 'regarder',groupe: 1, emoji: '👀',
    present:  { je:'regarde',tu:'regardes',il:'regarde',nous:'regardons',vous:'regardez',ils:'regardent'},
    futur:    { je:'regarderai',tu:'regarderas',il:'regardera',nous:'regarderons',vous:'regarderez',ils:'regarderont'},
    imparfait:{ je:'regardais',tu:'regardais',il:'regardait',nous:'regardions',vous:'regardiez',ils:'regardaient'},
  },
  danser:   { infinitif: 'danser',  groupe: 1, emoji: '💃',
    present:  { je:'danse',  tu:'danses',  il:'danse',  nous:'dansons', vous:'dansez', ils:'dansent' },
    futur:    { je:'danserai',tu:'danseras',il:'dansera',nous:'danserons',vous:'danserez',ils:'danseront'},
    imparfait:{ je:'dansais',tu:'dansais',  il:'dansait',nous:'dansions',vous:'dansiez',ils:'dansaient'},
  },
  finir:    { infinitif: 'finir',   groupe: 2, emoji: '🏁',
    present:  { je:'finis',  tu:'finis',   il:'finit',  nous:'finissons',vous:'finissez',ils:'finissent'},
    futur:    { je:'finirai',tu:'finiras',  il:'finira', nous:'finirons',vous:'finirez', ils:'finiront' },
    imparfait:{ je:'finissais',tu:'finissais',il:'finissait',nous:'finissions',vous:'finissiez',ils:'finissaient'},
  },
  etre:     { infinitif: 'etre',    groupe: 3, emoji: '✨',
    present:  { je:'suis',   tu:'es',      il:'est',    nous:'sommes',  vous:'etes',   ils:'sont'    },
    futur:    { je:'serai',  tu:'seras',   il:'sera',   nous:'serons',  vous:'serez',  ils:'seront'  },
    imparfait:{ je:'etais',  tu:'etais',   il:'etait',  nous:'etions',  vous:'etiez',  ils:'etaient' },
  },
  avoir:    { infinitif: 'avoir',   groupe: 3, emoji: '💎',
    present:  { je:'ai',     tu:'as',      il:'a',      nous:'avons',   vous:'avez',   ils:'ont'     },
    futur:    { je:'aurai',  tu:'auras',   il:'aura',   nous:'aurons',  vous:'aurez',  ils:'auront'  },
    imparfait:{ je:'avais',  tu:'avais',   il:'avait',  nous:'avions',  vous:'aviez',  ils:'avaient' },
  },
  aller:    { infinitif: 'aller',   groupe: 3, emoji: '🏃',
    present:  { je:'vais',   tu:'vas',     il:'va',     nous:'allons',  vous:'allez',  ils:'vont'    },
    futur:    { je:'irai',   tu:'iras',    il:'ira',    nous:'irons',   vous:'irez',   ils:'iront'   },
    imparfait:{ je:'allais', tu:'allais',  il:'allait', nous:'allions', vous:'alliez', ils:'allaient'},
  },
  faire:    { infinitif: 'faire',   groupe: 3, emoji: '🔨',
    present:  { je:'fais',   tu:'fais',    il:'fait',   nous:'faisons', vous:'faites', ils:'font'    },
    futur:    { je:'ferai',  tu:'feras',   il:'fera',   nous:'ferons',  vous:'ferez',  ils:'feront'  },
    imparfait:{ je:'faisais',tu:'faisais', il:'faisait',nous:'faisions',vous:'faisiez',ils:'faisaient'},
  },
  venir:    { infinitif: 'venir',   groupe: 3, emoji: '🚪',
    present:  { je:'viens',  tu:'viens',   il:'vient',  nous:'venons',  vous:'venez',  ils:'viennent'},
    futur:    { je:'viendrai',tu:'viendras',il:'viendra',nous:'viendrons',vous:'viendrez',ils:'viendront'},
    imparfait:{ je:'venais', tu:'venais',  il:'venait', nous:'venions', vous:'veniez', ils:'venaient'},
  },
};

export const SUJETS = ['je','tu','il','elle','nous','vous','ils','elles'];
export const SUJETS_DISPLAY = {
  je:'Je', tu:'Tu', il:'Il', elle:'Elle', nous:'Nous', vous:'Vous', ils:'Ils', elles:'Elles'
};
export const SUJET_EMOJI = {
  je:'🧒', tu:'👦', il:'🧑', elle:'👧', nous:'👨‍👩‍👧', vous:'👥', ils:'👦👦', elles:'👧👧'
};
export const TEMPS_LABEL = {
  present:'Present', futur:'Futur simple', imparfait:'Imparfait'
};

// ── PHRASES D'HISTOIRE (Jeu 9) ──────────────────────────────────────────
export const HISTOIRES = [
  {
    title: 'La Fete d\'Anniversaire',
    emoji: '🎂',
    sentences: [
      { text: 'Aujourd\'hui, Lena ___ son anniversaire.', verb: 'feter', sujet: 'elle', temps: 'present', answer: 'fete', options: ['fete','fetes','fetez'] },
      { text: 'Ses amis ___ des jeux dans le jardin.', verb: 'jouer', sujet: 'ils', temps: 'present', answer: 'jouent', options: ['joue','joues','jouent'] },
      { text: 'La maman ___ un gateau au chocolat.', verb: 'faire', sujet: 'elle', temps: 'present', answer: 'fait', options: ['fait','fais','faite'] },
      { text: 'Tout le monde ___ et danse.', verb: 'chanter', sujet: 'ils', temps: 'present', answer: 'chante', options: ['chantent','chante','chantes'] },
      { text: 'Lena ___ tres heureuse ce soir.', verb: 'etre', sujet: 'elle', temps: 'present', answer: 'est', options: ['est','es','suis'] },
    ],
  },
  {
    title: 'La Grande Aventure',
    emoji: '🗺️',
    sentences: [
      { text: 'Hugo ___ son sac a dos.', verb: 'prendre', sujet: 'il', temps: 'present', answer: 'prend', options: ['prend','prends','prendre'] },
      { text: 'Il ___ vers la foret magique.', verb: 'aller', sujet: 'il', temps: 'present', answer: 'va', options: ['va','vas','vais'] },
      { text: 'Les oiseaux ___ de belles chansons.', verb: 'chanter', sujet: 'ils', temps: 'present', answer: 'chantent', options: ['chante','chantes','chantent'] },
      { text: 'Hugo ___ un tresor.', verb: 'trouver', sujet: 'il', temps: 'present', answer: 'trouve', options: ['trouve','trouves','trouvent'] },
      { text: 'Il ___ tres fier de lui.', verb: 'etre', sujet: 'il', temps: 'present', answer: 'est', options: ['est','es','sont'] },
    ],
  },
  {
    title: 'A l\'Ecole',
    emoji: '🏫',
    sentences: [
      { text: 'Je ___ mon cartable le matin.', verb: 'prendre', sujet: 'je', temps: 'present', answer: 'prends', options: ['prend','prends','prenons'] },
      { text: 'Ma maitresse ___ la lecon au tableau.', verb: 'ecrire', sujet: 'elle', temps: 'present', answer: 'ecrit', options: ['ecrit','ecris','ecrivent'] },
      { text: 'Nous ___ attentivement.', verb: 'ecouter', sujet: 'nous', temps: 'present', answer: 'ecoutons', options: ['ecoute','ecoutons','ecoutent'] },
      { text: 'Mes amis ___ dans la cour.', verb: 'jouer', sujet: 'ils', temps: 'present', answer: 'jouent', options: ['joue','joues','jouent'] },
      { text: 'J\'___ l\'ecole.', verb: 'aimer', sujet: 'je', temps: 'present', answer: 'aime', options: ['aime','aimes','aimez'] },
    ],
  },
];

// ── MINI-LECONS VISUELLES ────────────────────────────────────────────────
export const MINI_LECONS = {
  'decouverte': {
    title: 'Qu\'est-ce qu\'un verbe ?',
    emoji: '✨',
    content: 'Un verbe exprime une ACTION ou un ETAT.',
    examples: [
      { sujet: 'Le chat', verbe: 'dort', color: '#10b981' },
      { sujet: 'Lena', verbe: 'joue', color: '#f59e0b' },
      { sujet: 'Hugo', verbe: 'mange', color: '#8b5cf6' },
    ],
    rule: 'Le verbe change selon QUI fait l\'action !',
  },
  'present-je-tu-il': {
    title: 'Le present : je / tu / il',
    emoji: '⚡',
    content: 'Pour les verbes en -ER :',
    paradigm: [
      { sujet: 'Je', terminaison: 'e', exemple: 'joue', color: '#10b981' },
      { sujet: 'Tu', terminaison: 'es', exemple: 'joues', color: '#f59e0b' },
      { sujet: 'Il / Elle', terminaison: 'e', exemple: 'joue', color: '#8b5cf6' },
    ],
    rule: 'Je → -e, Tu → -es, Il/Elle → -e',
  },
  'present-nous-vous-ils': {
    title: 'Le present : nous / vous / ils',
    emoji: '👥',
    content: 'Pour les verbes en -ER :',
    paradigm: [
      { sujet: 'Nous', terminaison: 'ons', exemple: 'jouons', color: '#ec4899' },
      { sujet: 'Vous', terminaison: 'ez', exemple: 'jouez', color: '#06b6d4' },
      { sujet: 'Ils / Elles', terminaison: 'ent', exemple: 'jouent', color: '#f97316' },
    ],
    rule: 'Nous → -ons, Vous → -ez, Ils → -ent',
  },
  'etre-avoir': {
    title: 'Etre et Avoir : les verbes magiques !',
    emoji: '💎',
    content: 'Ces deux verbes sont irreguliers — il faut les memoriser !',
    paradigm: [
      { sujet: 'Je suis / J\'ai', terminaison: '', exemple: '', color: '#10b981' },
      { sujet: 'Tu es / Tu as', terminaison: '', exemple: '', color: '#f59e0b' },
      { sujet: 'Il est / Il a', terminaison: '', exemple: '', color: '#8b5cf6' },
      { sujet: 'Nous sommes / Nous avons', terminaison: '', exemple: '', color: '#ec4899' },
    ],
    rule: 'Etre et Avoir ne suivent pas la regle normale !',
  },
  'futur': {
    title: 'Le futur simple',
    emoji: '🚀',
    content: 'Le futur = infinitif + terminaison',
    paradigm: [
      { sujet: 'Je', terminaison: 'ai', exemple: 'jouerai', color: '#10b981' },
      { sujet: 'Tu', terminaison: 'as', exemple: 'joueras', color: '#f59e0b' },
      { sujet: 'Il', terminaison: 'a', exemple: 'jouera', color: '#8b5cf6' },
      { sujet: 'Nous', terminaison: 'ons', exemple: 'jouerons', color: '#ec4899' },
      { sujet: 'Vous', terminaison: 'ez', exemple: 'jouerez', color: '#06b6d4' },
      { sujet: 'Ils', terminaison: 'ont', exemple: 'joueront', color: '#f97316' },
    ],
    rule: 'Au futur : jouer + ai/as/a/ons/ez/ont',
  },
  'imparfait': {
    title: 'L\'imparfait',
    emoji: '📜',
    content: 'L\'imparfait parle d\'une action passee qui durait.',
    paradigm: [
      { sujet: 'Je', terminaison: 'ais', exemple: 'jouais', color: '#10b981' },
      { sujet: 'Tu', terminaison: 'ais', exemple: 'jouais', color: '#f59e0b' },
      { sujet: 'Il', terminaison: 'ait', exemple: 'jouait', color: '#8b5cf6' },
      { sujet: 'Nous', terminaison: 'ions', exemple: 'jouions', color: '#ec4899' },
      { sujet: 'Vous', terminaison: 'iez', exemple: 'jouiez', color: '#06b6d4' },
      { sujet: 'Ils', terminaison: 'aient', exemple: 'jouaient', color: '#f97316' },
    ],
    rule: 'A l\'imparfait : joue + ais/ais/ait/ions/iez/aient',
  },
};

// ── PHRASES POUR CHASSE AUX VERBES ───────────────────────────────────────
export const PHRASES_VERBES = [
  { phrase: 'Le chat dort sur le canape.', verbe: 'dort', pos: 2 },
  { phrase: 'Lena mange une pomme rouge.', verbe: 'mange', pos: 1 },
  { phrase: 'Les enfants jouent dans le jardin.', verbe: 'jouent', pos: 2 },
  { phrase: 'Hugo chante une belle chanson.', verbe: 'chante', pos: 1 },
  { phrase: 'Ma maman prepare le diner.', verbe: 'prepare', pos: 2 },
  { phrase: 'Le soleil brille dans le ciel.', verbe: 'brille', pos: 2 },
  { phrase: 'Les oiseaux volent tres haut.', verbe: 'volent', pos: 2 },
  { phrase: 'Je lis un livre interessant.', verbe: 'lis', pos: 1 },
  { phrase: 'Tu dessines un beau chateau.', verbe: 'dessines', pos: 1 },
  { phrase: 'Nous regardons un film ce soir.', verbe: 'regardons', pos: 1 },
  { phrase: 'La pluie tombe sur les toits.', verbe: 'tombe', pos: 2 },
  { phrase: 'Les fourmis travaillent tout l\'ete.', verbe: 'travaillent', pos: 2 },
  { phrase: 'Papa conduit la voiture rouge.', verbe: 'conduit', pos: 1 },
  { phrase: 'Emma danse avec ses amies.', verbe: 'danse', pos: 1 },
  { phrase: 'Le vent souffle tres fort.', verbe: 'souffle', pos: 2 },
  { phrase: 'Nous apprenons les verbes a l\'ecole.', verbe: 'apprenons', pos: 1 },
  { phrase: 'La grenouille saute dans la mare.', verbe: 'saute', pos: 2 },
  { phrase: 'Tu joues au ballon dans la cour.', verbe: 'joues', pos: 1 },
  { phrase: 'Les elephants boivent au bord du lac.', verbe: 'boivent', pos: 2 },
  { phrase: 'Je vais a l\'ecole a pied.', verbe: 'vais', pos: 1 },
];

// ── MEMORY SUJET-VERBE ────────────────────────────────────────────────────
export function genMemoryPairs(verbKey, temps) {
  const v = VERBES[verbKey];
  if (!v) return [];
  return Object.entries(v[temps] || v.present).map(([sujet, forme]) => ({
    sujet, forme, verbKey, sujetDisplay: SUJETS_DISPLAY[sujet] || sujet,
    sujetEmoji: SUJET_EMOJI[sujet] || '👤',
  }));
}

// ── TERMINAISONS VERBE ER ────────────────────────────────────────────────
export const TERMINAISONS_ER = {
  present:   { je:'e',    tu:'es',   il:'e',   nous:'ons', vous:'ez',  ils:'ent'   },
  futur:     { je:'ai',   tu:'as',   il:'a',   nous:'ons', vous:'ez',  ils:'ont'   },
  imparfait: { je:'ais',  tu:'ais',  il:'ait', nous:'ions',vous:'iez', ils:'aient' },
};

// ── NIVEAUX STRUCTURE ─────────────────────────────────────────────────────
export const NIVEAUX = [
  { id: 1,  label: 'Je decouvre les verbes',    emoji: '🌱', color: '#10b981', xpMax: 100, verbes: ['jouer','manger'],             temps: ['present'],              miniJeux: ['chasse','terminaison','puzzle'] },
  { id: 2,  label: 'Je trouve le sujet',         emoji: '🔍', color: '#06b6d4', xpMax: 150, verbes: ['aimer','parler','chanter'],   temps: ['present'],              miniJeux: ['sujet','memory','terminaison'] },
  { id: 3,  label: 'Je conjugue au present',     emoji: '⚡', color: '#f59e0b', xpMax: 200, verbes: ['jouer','manger','parler'],    temps: ['present'],              miniJeux: ['dragon','course','terminaison','puzzle','histoire'] },
  { id: 4,  label: 'Les verbes du quotidien',    emoji: '🌟', color: '#8b5cf6', xpMax: 200, verbes: ['regarder','danser','finir'],  temps: ['present'],              miniJeux: ['dragon','chasse','memory','combat','histoire'] },
  { id: 5,  label: 'Etre et Avoir',              emoji: '💎', color: '#ec4899', xpMax: 250, verbes: ['etre','avoir'],               temps: ['present'],              miniJeux: ['dragon','terminaison','memory','combat','puzzle'] },
  { id: 6,  label: 'Present avance',             emoji: '🔥', color: '#f97316', xpMax: 250, verbes: ['aller','faire','venir'],      temps: ['present'],              miniJeux: ['dragon','course','histoire','combat','boss'] },
  { id: 7,  label: 'Le futur simple',            emoji: '🚀', color: '#3b82f6', xpMax: 300, verbes: ['jouer','aller','faire'],      temps: ['futur'],                miniJeux: ['dragon','terminaison','memory','puzzle','boss'] },
  { id: 8,  label: 'L\'imparfait',               emoji: '📜', color: '#6366f1', xpMax: 300, verbes: ['jouer','etre','avoir'],       temps: ['imparfait'],            miniJeux: ['dragon','chasse','memory','combat','boss'] },
  { id: 9,  label: 'Mission melange des temps',  emoji: '⚔️', color: '#dc2626', xpMax: 400, verbes: ['jouer','etre','avoir','aller'],temps: ['present','futur','imparfait'], miniJeux: ['dragon','combat','histoire','boss'] },
  { id: 10, label: 'Maitre des Verbes',          emoji: '🏆', color: '#f59e0b', xpMax: 500, verbes: Object.keys(VERBES),            temps: ['present','futur','imparfait'], miniJeux: ['dragon','combat','course','histoire','boss'] },
];

export const VERB_BADGES = [
  { id: 'apprenti',    label: 'Apprenti Magicien', emoji: '🌱', threshold: 50  },
  { id: 'chevalier',   label: 'Chevalier des Verbes', emoji: '⚔️', threshold: 200 },
  { id: 'enchanteur',  label: 'Enchanteur',        emoji: '🔮', threshold: 500 },
  { id: 'gardien',     label: 'Gardien du Temps',  emoji: '⏳', threshold: 1000},
  { id: 'maitre',      label: 'Maitre des Verbes', emoji: '🏆', threshold: 2000},
];

export const ENCOURAGEMENTS_VERB = [
  'Tu progresses, continue ! ⚡',
  'Presque ! Regarde bien la terminaison.',
  'Bravo pour l\'effort ! 💪',
  'Le Royaume des Verbes compte sur toi !',
  'Super ! Tu deviens un vrai magicien ! 🔮',
  'Encore un effort !',
];

export function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export function genDragonQuestion(verbKey, sujet, temps) {
  const v = VERBES[verbKey];
  if (!v) return null;
  const conj = v[temps] || v.present;
  const answer = conj[sujet];
  if (!answer) return null;
  const allForms = Object.values(conj);
  const distractors = [...new Set(allForms.filter(f => f !== answer))].sort(() => Math.random() - .5).slice(0, 3);
  while (distractors.length < 3) distractors.push(answer + 's');
  const options = [answer, ...distractors.slice(0, 3)].sort(() => Math.random() - .5);
  return { verbKey, sujet, temps, answer, options, infinitif: v.infinitif, emoji: v.emoji };
}

// ── PUZZLE PHRASES ────────────────────────────────────────────────────────
export const PUZZLE_PHRASES = [
  { words: ['Je','mange','une','pomme','.'], answer: 'Je mange une pomme .' },
  { words: ['Tu','joues','dans','le','jardin','.'], answer: 'Tu joues dans le jardin .' },
  { words: ['Il','chante','une','belle','chanson','.'], answer: 'Il chante une belle chanson .' },
  { words: ['Nous','aimons','les','animaux','.'], answer: 'Nous aimons les animaux .' },
  { words: ['Elle','danse','avec','ses','amies','.'], answer: 'Elle danse avec ses amies .' },
  { words: ['Ils','jouent','au','football','ensemble','.'], answer: 'Ils jouent au football ensemble .' },
  { words: ['Vous','regardez','un','beau','film','.'], answer: 'Vous regardez un beau film .' },
  { words: ['Les','enfants','chantent','en','choeur','.'], answer: 'Les enfants chantent en choeur .' },
  { words: ['Mon','chat','dort','sur','le','canape','.'], answer: 'Mon chat dort sur le canape .' },
  { words: ['Tu','as','un','beau','sourire','.'], answer: 'Tu as un beau sourire .' },
];
