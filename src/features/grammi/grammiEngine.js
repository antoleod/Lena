export const WORD_COLORS = {
  nom_commun:  { bg: '#3b82f6', label: 'Nom commun',  emoji: '🏠', short: 'NC' },
  nom_propre:  { bg: '#ef4444', label: 'Nom propre',  emoji: '👑', short: 'NP' },
  adjectif:    { bg: '#f97316', label: 'Adjectif',    emoji: '🎨', short: 'ADJ' },
  verbe:       { bg: '#22c55e', label: 'Verbe',       emoji: '⚡', short: 'V' },
  determinant: { bg: '#a855f7', label: 'Determinant', emoji: '📦', short: 'DET' },
  autre:       { bg: '#6b7280', label: 'Autre',       emoji: '•',  short: '?' },
};

// ── WORD BANKS ──────────────────────────────────────────────────────────

export const NOMS_COMMUNS = [
  'table','chaise','maison','voiture','arbre','fleur','chien','chat','oiseau','poisson',
  'ecole','livre','stylo','crayon','cahier','sac','cartable','fenetre','porte','jardin',
  'soleil','lune','etoile','nuage','pluie','neige','feu','eau','pain','gateau',
  'pomme','banane','orange','fraise','cerise','carotte','tomate','salade','fromage','lait',
  'balle','jouet','poupee','robot','voile','bateau','avion','train','bus','velo',
  'ami','enfant','garcon','fille','bebe','maman','papa','frere','soeur','grand-mere',
  'medecin','boulanger','professeur','facteur','pompier','policier','jardinier','cuisinier',
  'lion','tigre','elephant','girafe','zebre','singe','lapin','souris','vache','cochon',
  'riviere','montagne','foret','prairie','plage','ile','desert','vallee','colline','champ',
  'couleur','forme','taille','odeur','saveur','bruit','lumiere','ombre','chaleur','froid',
];

export const NOMS_PROPRES = [
  'Bruxelles','Paris','Londres','Madrid','Berlin','Rome','Amsterdam','Lisbonne',
  'Belgique','France','Espagne','Italie','Allemagne','Portugal','Pays-Bas',
  'Lena','Emma','Lucas','Hugo','Lea','Jade','Noah','Mia','Tom','Zoe',
  'Tintin','Milou','Asterix','Obelix','Pikachu','Mario','Elsa','Simba',
  'Noel','Paques','Halloween','Carnaval',
  'Amazon','Lego','Nintendo','Disney','Netflix',
  'Afrique','Asie','Europe','Amerique','Australie',
  'Atlantique','Pacifique','Mediterranee','Amazone','Nil',
];

export const ADJECTIFS = [
  'grand','petit','gros','mince','long','court','large','etroit','haut','bas',
  'rouge','bleu','vert','jaune','orange','violet','rose','blanc','noir','gris','marron',
  'rond','carre','triangulaire','ovale','plat','courbe','droit','tordu',
  'doux','dur','lisse','rugueux','chaud','froid','lourd','leger','mouille','sec',
  'beau','joli','laid','propre','sale','neuf','vieux','moderne','ancien',
  'gentil','mechant','timide','courageux','drole','triste','content','fache','fatigue',
  'rapide','lent','fort','faible','intelligent','stupide','sage','fou','calme','agite',
  'delicieux','amer','sucre','sale','acide','parfume','malodorant',
  'brillant','terne','transparent','opaque','solide','liquide','gazeux',
];

export const VERBES_INFINITIF = [
  'manger','boire','courir','sauter','dormir','jouer','chanter','danser','lire','ecrire',
  'parler','ecouter','regarder','toucher','sentir','gouter','voir','entendre',
  'aimer','detester','vouloir','pouvoir','devoir','savoir','avoir','etre','faire','aller',
  'venir','partir','arriver','entrer','sortir','monter','descendre','tomber','lever',
  'prendre','donner','mettre','enlever','ouvrir','fermer','chercher','trouver','perdre','gagner',
  'apprendre','enseigner','travailler','aider','jouer','construire','peindre','dessiner',
  'nager','voler','ramper','glisser','pousser','tirer','porter','lancer','attraper',
];

export const VERBES_CONJUGUES = [
  { word: 'mange', base: 'manger', pronoun: 'je' },
  { word: 'manges', base: 'manger', pronoun: 'tu' },
  { word: 'mange', base: 'manger', pronoun: 'il/elle' },
  { word: 'mangeons', base: 'manger', pronoun: 'nous' },
  { word: 'mangez', base: 'manger', pronoun: 'vous' },
  { word: 'mangent', base: 'manger', pronoun: 'ils/elles' },
  { word: 'cours', base: 'courir', pronoun: 'je' },
  { word: 'courons', base: 'courir', pronoun: 'nous' },
  { word: 'joue', base: 'jouer', pronoun: 'il/elle' },
  { word: 'jouons', base: 'jouer', pronoun: 'nous' },
  { word: 'chante', base: 'chanter', pronoun: 'je' },
  { word: 'chantons', base: 'chanter', pronoun: 'nous' },
  { word: 'lit', base: 'lire', pronoun: 'il/elle' },
  { word: 'lisent', base: 'lire', pronoun: 'ils/elles' },
  { word: 'ecrit', base: 'ecrire', pronoun: 'il/elle' },
  { word: 'ecrivons', base: 'ecrire', pronoun: 'nous' },
  { word: 'dort', base: 'dormir', pronoun: 'il/elle' },
  { word: 'dormons', base: 'dormir', pronoun: 'nous' },
  { word: 'suis', base: 'etre', pronoun: 'je' },
  { word: 'est', base: 'etre', pronoun: 'il/elle' },
  { word: 'sommes', base: 'etre', pronoun: 'nous' },
  { word: 'ai', base: 'avoir', pronoun: 'j\'ai' },
  { word: 'a', base: 'avoir', pronoun: 'il/elle' },
  { word: 'avons', base: 'avoir', pronoun: 'nous' },
  { word: 'vas', base: 'aller', pronoun: 'tu' },
  { word: 'allons', base: 'aller', pronoun: 'nous' },
  { word: 'vient', base: 'venir', pronoun: 'il/elle' },
  { word: 'venons', base: 'venir', pronoun: 'nous' },
  { word: 'prend', base: 'prendre', pronoun: 'il/elle' },
  { word: 'prenons', base: 'prendre', pronoun: 'nous' },
];

export const DETERMINANTS = ['le','la','les','un','une','des','mon','ma','mes','ton','ta','tes','son','sa','ses','notre','votre','leur','leurs','ce','cet','cette','ces'];

// ── ANNOTATED SENTENCES ─────────────────────────────────────────────────

export const ANNOTATED_SENTENCES = [
  [{ w:'Le',type:'determinant' },{ w:'chat',type:'nom_commun' },{ w:'noir',type:'adjectif' },{ w:'dort',type:'verbe' },{ w:'.',type:'autre' }],
  [{ w:'Lena',type:'nom_propre' },{ w:'mange',type:'verbe' },{ w:'une',type:'determinant' },{ w:'pomme',type:'nom_commun' },{ w:'rouge',type:'adjectif' },{ w:'.',type:'autre' }],
  [{ w:'Le',type:'determinant' },{ w:'petit',type:'adjectif' },{ w:'chien',type:'nom_commun' },{ w:'court',type:'verbe' },{ w:'vite',type:'autre' },{ w:'.',type:'autre' }],
  [{ w:'Emma',type:'nom_propre' },{ w:'et',type:'autre' },{ w:'Lucas',type:'nom_propre' },{ w:'jouent',type:'verbe' },{ w:'dans',type:'autre' },{ w:'le',type:'determinant' },{ w:'jardin',type:'nom_commun' },{ w:'.',type:'autre' }],
  [{ w:'La',type:'determinant' },{ w:'grosse',type:'adjectif' },{ w:'tortue',type:'nom_commun' },{ w:'mange',type:'verbe' },{ w:'des',type:'determinant' },{ w:'feuilles',type:'nom_commun' },{ w:'vertes',type:'adjectif' },{ w:'.',type:'autre' }],
  [{ w:'Mon',type:'determinant' },{ w:'frere',type:'nom_commun' },{ w:'lit',type:'verbe' },{ w:'un',type:'determinant' },{ w:'grand',type:'adjectif' },{ w:'livre',type:'nom_commun' },{ w:'.',type:'autre' }],
  [{ w:'Paris',type:'nom_propre' },{ w:'est',type:'verbe' },{ w:'une',type:'determinant' },{ w:'belle',type:'adjectif' },{ w:'ville',type:'nom_commun' },{ w:'.',type:'autre' }],
  [{ w:'Les',type:'determinant' },{ w:'enfants',type:'nom_commun' },{ w:'joyeux',type:'adjectif' },{ w:'chantent',type:'verbe' },{ w:'.',type:'autre' }],
  [{ w:'La',type:'determinant' },{ w:'vieille',type:'adjectif' },{ w:'maison',type:'nom_commun' },{ w:'est',type:'verbe' },{ w:'grande',type:'adjectif' },{ w:'.',type:'autre' }],
  [{ w:'Hugo',type:'nom_propre' },{ w:'dessine',type:'verbe' },{ w:'un',type:'determinant' },{ w:'beau',type:'adjectif' },{ w:'dragon',type:'nom_commun' },{ w:'.',type:'autre' }],
  [{ w:'La',type:'determinant' },{ w:'Belgique',type:'nom_propre' },{ w:'est',type:'verbe' },{ w:'un',type:'determinant' },{ w:'beau',type:'adjectif' },{ w:'pays',type:'nom_commun' },{ w:'.',type:'autre' }],
  [{ w:'Le',type:'determinant' },{ w:'robot',type:'nom_commun' },{ w:'rapide',type:'adjectif' },{ w:'saute',type:'verbe' },{ w:'haut',type:'autre' },{ w:'.',type:'autre' }],
  [{ w:'Jade',type:'nom_propre' },{ w:'trouve',type:'verbe' },{ w:'son',type:'determinant' },{ w:'petit',type:'adjectif' },{ w:'chat',type:'nom_commun' },{ w:'.',type:'autre' }],
  [{ w:'Les',type:'determinant' },{ w:'grandes',type:'adjectif' },{ w:'vagues',type:'nom_commun' },{ w:'arrivent',type:'verbe' },{ w:'.',type:'autre' }],
  [{ w:'Mon',type:'determinant' },{ w:'ami',type:'nom_commun' },{ w:'Tom',type:'nom_propre' },{ w:'court',type:'verbe' },{ w:'vite',type:'autre' },{ w:'.',type:'autre' }],
];

export const TEXTS = [
  {
    title: 'Le renard et le corbeau',
    text: 'Un renard ruse vit un corbeau noir perche sur un arbre. Le corbeau tenait un fromage delicieux dans son bec. Le renard astucieux dit : "Comme tu es beau ! Chante pour moi !" Le corbeau ouvrit le bec et perdit son fromage.',
    sentences: 4,
    words: 43,
    noms_propres: 0,
    noms_communs: ['renard','corbeau','arbre','fromage','bec'],
    adjectifs: ['ruse','noir','perche','delicieux','astucieux','beau'],
    verbes: ['vit','tenait','dit','ouvrit','perdit'],
  },
  {
    title: 'Lena et son chien',
    text: 'Lena a un petit chien blanc. Elle l\'appelle Milou. Chaque matin, Lena et Milou courent dans le grand jardin vert. Milou aime attraper les balles rouges.',
    sentences: 4,
    words: 32,
    noms_propres: ['Lena','Milou'],
    noms_communs: ['chien','matin','jardin','balles'],
    adjectifs: ['petit','blanc','grand','vert','rouges'],
    verbes: ['a','appelle','courent','aime','attraper'],
  },
  {
    title: 'La classe de Bruxelles',
    text: 'Dans la belle ville de Bruxelles, il y a une grande ecole. Les enfants joyeux apprennent a lire et a ecrire. La maitresse gentille s\'appelle Madame Martin. Elle aime ses eleves curieux.',
    sentences: 4,
    words: 38,
    noms_propres: ['Bruxelles','Martin'],
    noms_communs: ['ville','ecole','enfants','maitresse','eleves'],
    adjectifs: ['belle','grande','joyeux','gentille','curieux'],
    verbes: ['apprennent','lire','ecrire','appelle','aime'],
  },
];

export const GN_TEMPLATES = [
  { det: 'un', noun: 'chien', adj: 'petit', full: 'un petit chien' },
  { det: 'une', noun: 'pomme', adj: 'rouge', full: 'une pomme rouge' },
  { det: 'le', noun: 'chat', adj: 'noir', full: 'le chat noir' },
  { det: 'la', noun: 'voiture', adj: 'rapide', full: 'la voiture rapide' },
  { det: 'des', noun: 'enfants', adj: 'joyeux', full: 'des enfants joyeux' },
  { det: 'un', noun: 'livre', adj: 'grand', full: 'un grand livre' },
  { det: 'une', noun: 'fleur', adj: 'belle', full: 'une belle fleur' },
  { det: 'les', noun: 'oiseaux', adj: 'bleus', full: 'les oiseaux bleus' },
  { det: 'mon', noun: 'ami', adj: 'fidele', full: 'mon ami fidele' },
  { det: 'sa', noun: 'maison', adj: 'vieille', full: 'sa vieille maison' },
  { det: 'un', noun: 'robot', adj: 'intelligent', full: 'un robot intelligent' },
  { det: 'les', noun: 'etoiles', adj: 'brillantes', full: 'les etoiles brillantes' },
  { det: 'une', noun: 'sorciere', adj: 'mechante', full: 'une sorciere mechante' },
  { det: 'le', noun: 'dragon', adj: 'rouge', full: 'le dragon rouge' },
  { det: 'un', noun: 'gateau', adj: 'delicieux', full: 'un gateau delicieux' },
];

export const PHRASE_TEMPLATES = [
  { template: 'Mon ecole est un ___ batiment.', blank_type: 'adjectif', answer: 'grand', distractors: ['manger','Bruxelles','rapidement'] },
  { template: 'La ___ fille joue dans le jardin.', blank_type: 'adjectif', answer: 'petite', distractors: ['courir','Paris','souvent'] },
  { template: '___ est la capitale de la Belgique.', blank_type: 'nom_propre', answer: 'Bruxelles', distractors: ['belle','ville','courons'] },
  { template: 'Le chien ___ tres vite.', blank_type: 'verbe', answer: 'court', distractors: ['grand','Paris','maison'] },
  { template: 'Emma mange une ___ pomme.', blank_type: 'adjectif', answer: 'grande', distractors: ['manger','Paris','courons'] },
  { template: 'Les enfants ___ dans la cour.', blank_type: 'verbe', answer: 'jouent', distractors: ['joyeux','ecole','Lena'] },
  { template: 'Mon ___ est jaune et bleu.', blank_type: 'nom_commun', answer: 'cartable', distractors: ['courir','Paris','grand'] },
  { template: '___ a un petit chien blanc.', blank_type: 'nom_propre', answer: 'Lena', distractors: ['belle','maison','dormir'] },
  { template: 'Le renard ___ tres intelligent.', blank_type: 'verbe', answer: 'est', distractors: ['rouge','arbre','Paris'] },
  { template: 'La ___ vache mange de l\'herbe.', blank_type: 'adjectif', answer: 'grosse', distractors: ['manger','Bruxelles','vache'] },
  { template: 'Nous ___ dans la grande piscine.', blank_type: 'verbe', answer: 'nageons', distractors: ['bleu','Paris','poisson'] },
  { template: 'Le ___ dragon crache du feu.', blank_type: 'adjectif', answer: 'mechant', distractors: ['courir','Lucas','souvent'] },
];

export const GRAMMI_BADGES = [
  { id: 'petit-lecteur',    label: 'Petit Lecteur',         emoji: '📚', threshold: 5  },
  { id: 'chasseur-mots',   label: 'Chasseur de Mots',      emoji: '🔍', threshold: 20 },
  { id: 'detective-gram',  label: 'Detective Grammatical',  emoji: '🕵️', threshold: 50 },
  { id: 'maitre-verbes',   label: 'Maitre des Verbes',      emoji: '⚡', threshold: 100 },
  { id: 'roi-mots',        label: 'Roi des Mots',           emoji: '👑', threshold: 200 },
];

export const ENCOURAGEMENTS_GRAMMI = [
  'Essaie encore ! Tu y es presque !',
  'Regarde bien la couleur du mot !',
  'Tu progresses super bien ! ✨',
  'Presque ! Recommence !',
  'Super effort ! Continue ! 🌟',
  'Tu es un vrai detective des mots ! 🔍',
];

export function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export function genClassifyQuestion(targetType) {
  let correctWord;
  if (targetType === 'nom_commun') correctWord = pickRandom(NOMS_COMMUNS);
  else if (targetType === 'nom_propre') correctWord = pickRandom(NOMS_PROPRES);
  else if (targetType === 'adjectif') correctWord = pickRandom(ADJECTIFS);
  else if (targetType === 'verbe') correctWord = pickRandom(VERBES_INFINITIF);
  else correctWord = pickRandom(DETERMINANTS);

  const distractorPools = {
    nom_commun: NOMS_COMMUNS,
    nom_propre: NOMS_PROPRES,
    adjectif: ADJECTIFS,
    verbe: VERBES_INFINITIF,
  };
  const otherTypes = Object.keys(distractorPools).filter(t => t !== targetType);
  const distractors = otherTypes.map(t => pickRandom(distractorPools[t]));
  const options = [correctWord, ...distractors].sort(() => Math.random() - .5);

  return { word: correctWord, correctType: targetType, options };
}

export function genVerbQuestion() {
  const isInf = Math.random() < .5;
  if (isInf) {
    const word = pickRandom(VERBES_INFINITIF);
    return { word, correctLabel: 'Infinitif', options: ['Infinitif', 'Conjugue'].sort(() => Math.random() - .5) };
  }
  const vc = pickRandom(VERBES_CONJUGUES);
  return { word: vc.word, correctLabel: 'Conjugue', hint: vc.pronoun, options: ['Infinitif', 'Conjugue'].sort(() => Math.random() - .5) };
}
