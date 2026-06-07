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
  'chapeau','manteau','robe','pantalon','chaussure','chaussette','echarpe','gant','chemise','jupe',
  'guitare','piano','tambour','violon','flute','chanson','musique','concert','danse','theatre',
  'roi','reine','prince','princesse','chevalier','sorciere','fee','dragon','geant','lutin',
  'fusee','planete','etoile','astronaute','telescope','cosmos','satellite','comete','galaxie','lune',
  'ocean','vague','sable','coquillage','dauphin','baleine','pieuvre','requin','crabe','meduse',
  'cuisine','assiette','fourchette','couteau','cuillere','verre','bol','casserole','four','frigidaire',
  'football','basketball','tennis','natation','ski','velo','course','match','stade','equipe',
  'printemps','ete','automne','hiver','saison','soleil','pluie','vent','orage','arc-en-ciel',
  'ville','rue','pont','tour','eglise','supermarche','bibliotheque','cinema','hopital','gare',
  'papillon','abeille','coccinelle','fourmi','araignee','libellule','grenouille','serpent','tortue','herisson',
];

export const NOMS_PROPRES = [
  'Bruxelles','Paris','Londres','Madrid','Berlin','Rome','Amsterdam','Lisbonne',
  'Lyon','Marseille','Nice','Toulouse','Bordeaux','Strasbourg','Nantes','Lille',
  'Liege','Gand','Anvers','Namur','Mons','Charleroi','Bruges','Louvain',
  'Belgique','France','Espagne','Italie','Allemagne','Portugal','Pays-Bas','Suisse',
  'Lena','Emma','Lucas','Hugo','Lea','Jade','Noah','Mia','Tom','Zoe',
  'Sofia','Axel','Chloe','Nathan','Camille','Mathis','Lucie','Antoine','Inès','Remi',
  'Tintin','Milou','Asterix','Obelix','Pikachu','Mario','Elsa','Simba','Nemo','Dumbo',
  'Noel','Paques','Halloween','Carnaval',
  'Amazon','Lego','Nintendo','Disney','Netflix',
  'Afrique','Asie','Europe','Amerique','Australie',
  'Atlantique','Pacifique','Mediterranee','Amazone','Nil',
  'Terre','Mars','Jupiter','Saturne','Venus',
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
  'apprendre','enseigner','travailler','aider','construire','peindre','dessiner',
  'nager','voler','ramper','glisser','pousser','tirer','porter','lancer','attraper',
  'finir','partir','venir','jouer','trouver','ouvrir',
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
  { word: 'courent', base: 'courir', pronoun: 'ils/elles' },
  { word: 'joue', base: 'jouer', pronoun: 'il/elle' },
  { word: 'joues', base: 'jouer', pronoun: 'tu' },
  { word: 'jouons', base: 'jouer', pronoun: 'nous' },
  { word: 'jouez', base: 'jouer', pronoun: 'vous' },
  { word: 'jouent', base: 'jouer', pronoun: 'ils/elles' },
  { word: 'chante', base: 'chanter', pronoun: 'je' },
  { word: 'chantons', base: 'chanter', pronoun: 'nous' },
  { word: 'chantent', base: 'chanter', pronoun: 'ils/elles' },
  { word: 'lit', base: 'lire', pronoun: 'il/elle' },
  { word: 'lisent', base: 'lire', pronoun: 'ils/elles' },
  { word: 'lisons', base: 'lire', pronoun: 'nous' },
  { word: 'ecrit', base: 'ecrire', pronoun: 'il/elle' },
  { word: 'ecrivons', base: 'ecrire', pronoun: 'nous' },
  { word: 'ecrivent', base: 'ecrire', pronoun: 'ils/elles' },
  { word: 'dort', base: 'dormir', pronoun: 'il/elle' },
  { word: 'dormons', base: 'dormir', pronoun: 'nous' },
  { word: 'dorment', base: 'dormir', pronoun: 'ils/elles' },
  { word: 'suis', base: 'etre', pronoun: 'je' },
  { word: 'est', base: 'etre', pronoun: 'il/elle' },
  { word: 'sommes', base: 'etre', pronoun: 'nous' },
  { word: 'etes', base: 'etre', pronoun: 'vous' },
  { word: 'sont', base: 'etre', pronoun: 'ils/elles' },
  { word: 'ai', base: 'avoir', pronoun: "j'ai" },
  { word: 'a', base: 'avoir', pronoun: 'il/elle' },
  { word: 'avons', base: 'avoir', pronoun: 'nous' },
  { word: 'avez', base: 'avoir', pronoun: 'vous' },
  { word: 'ont', base: 'avoir', pronoun: 'ils/elles' },
  { word: 'vas', base: 'aller', pronoun: 'tu' },
  { word: 'va', base: 'aller', pronoun: 'il/elle' },
  { word: 'allons', base: 'aller', pronoun: 'nous' },
  { word: 'allez', base: 'aller', pronoun: 'vous' },
  { word: 'vont', base: 'aller', pronoun: 'ils/elles' },
  { word: 'vient', base: 'venir', pronoun: 'il/elle' },
  { word: 'venons', base: 'venir', pronoun: 'nous' },
  { word: 'viennent', base: 'venir', pronoun: 'ils/elles' },
  { word: 'prend', base: 'prendre', pronoun: 'il/elle' },
  { word: 'prenons', base: 'prendre', pronoun: 'nous' },
  { word: 'prennent', base: 'prendre', pronoun: 'ils/elles' },
  { word: 'finis', base: 'finir', pronoun: 'je' },
  { word: 'finit', base: 'finir', pronoun: 'il/elle' },
  { word: 'finissons', base: 'finir', pronoun: 'nous' },
  { word: 'finissent', base: 'finir', pronoun: 'ils/elles' },
  { word: 'pars', base: 'partir', pronoun: 'je' },
  { word: 'part', base: 'partir', pronoun: 'il/elle' },
  { word: 'partons', base: 'partir', pronoun: 'nous' },
  { word: 'partent', base: 'partir', pronoun: 'ils/elles' },
  { word: 'trouve', base: 'trouver', pronoun: 'il/elle' },
  { word: 'trouvons', base: 'trouver', pronoun: 'nous' },
  { word: 'trouvent', base: 'trouver', pronoun: 'ils/elles' },
  { word: 'ouvre', base: 'ouvrir', pronoun: 'il/elle' },
  { word: 'ouvrons', base: 'ouvrir', pronoun: 'nous' },
  { word: 'ouvrent', base: 'ouvrir', pronoun: 'ils/elles' },
];

export const DETERMINANTS = ['le','la','les','un','une','des','mon','ma','mes','ton','ta','tes','son','sa','ses','notre','votre','leur','leurs','ce','cet','cette','ces'];

// ── ANNOTATED SENTENCES ─────────────────────────────────────────────────

export const ANNOTATED_SENTENCES = [
  // Original 15
  [{w:'Le',type:'determinant'},{w:'chat',type:'nom_commun'},{w:'noir',type:'adjectif'},{w:'dort',type:'verbe'},{w:'.',type:'autre'}],
  [{w:'Lena',type:'nom_propre'},{w:'mange',type:'verbe'},{w:'une',type:'determinant'},{w:'pomme',type:'nom_commun'},{w:'rouge',type:'adjectif'},{w:'.',type:'autre'}],
  [{w:'Le',type:'determinant'},{w:'petit',type:'adjectif'},{w:'chien',type:'nom_commun'},{w:'court',type:'verbe'},{w:'vite',type:'autre'},{w:'.',type:'autre'}],
  [{w:'Emma',type:'nom_propre'},{w:'et',type:'autre'},{w:'Lucas',type:'nom_propre'},{w:'jouent',type:'verbe'},{w:'dans',type:'autre'},{w:'le',type:'determinant'},{w:'jardin',type:'nom_commun'},{w:'.',type:'autre'}],
  [{w:'La',type:'determinant'},{w:'grosse',type:'adjectif'},{w:'tortue',type:'nom_commun'},{w:'mange',type:'verbe'},{w:'des',type:'determinant'},{w:'feuilles',type:'nom_commun'},{w:'vertes',type:'adjectif'},{w:'.',type:'autre'}],
  [{w:'Mon',type:'determinant'},{w:'frere',type:'nom_commun'},{w:'lit',type:'verbe'},{w:'un',type:'determinant'},{w:'grand',type:'adjectif'},{w:'livre',type:'nom_commun'},{w:'.',type:'autre'}],
  [{w:'Paris',type:'nom_propre'},{w:'est',type:'verbe'},{w:'une',type:'determinant'},{w:'belle',type:'adjectif'},{w:'ville',type:'nom_commun'},{w:'.',type:'autre'}],
  [{w:'Les',type:'determinant'},{w:'enfants',type:'nom_commun'},{w:'joyeux',type:'adjectif'},{w:'chantent',type:'verbe'},{w:'.',type:'autre'}],
  [{w:'La',type:'determinant'},{w:'vieille',type:'adjectif'},{w:'maison',type:'nom_commun'},{w:'est',type:'verbe'},{w:'grande',type:'adjectif'},{w:'.',type:'autre'}],
  [{w:'Hugo',type:'nom_propre'},{w:'dessine',type:'verbe'},{w:'un',type:'determinant'},{w:'beau',type:'adjectif'},{w:'dragon',type:'nom_commun'},{w:'.',type:'autre'}],
  [{w:'La',type:'determinant'},{w:'Belgique',type:'nom_propre'},{w:'est',type:'verbe'},{w:'un',type:'determinant'},{w:'beau',type:'adjectif'},{w:'pays',type:'nom_commun'},{w:'.',type:'autre'}],
  [{w:'Le',type:'determinant'},{w:'robot',type:'nom_commun'},{w:'rapide',type:'adjectif'},{w:'saute',type:'verbe'},{w:'haut',type:'autre'},{w:'.',type:'autre'}],
  [{w:'Jade',type:'nom_propre'},{w:'trouve',type:'verbe'},{w:'son',type:'determinant'},{w:'petit',type:'adjectif'},{w:'chat',type:'nom_commun'},{w:'.',type:'autre'}],
  [{w:'Les',type:'determinant'},{w:'grandes',type:'adjectif'},{w:'vagues',type:'nom_commun'},{w:'arrivent',type:'verbe'},{w:'.',type:'autre'}],
  [{w:'Mon',type:'determinant'},{w:'ami',type:'nom_commun'},{w:'Tom',type:'nom_propre'},{w:'court',type:'verbe'},{w:'vite',type:'autre'},{w:'.',type:'autre'}],

  // 25 new sentences
  // Nom propre sentences (5+)
  [{w:'Jade',type:'nom_propre'},{w:'chante',type:'verbe'},{w:'une',type:'determinant'},{w:'belle',type:'adjectif'},{w:'chanson',type:'nom_commun'},{w:'.',type:'autre'}],
  [{w:'Sofia',type:'nom_propre'},{w:'nage',type:'verbe'},{w:'dans',type:'autre'},{w:'la',type:'determinant'},{w:'piscine',type:'nom_commun'},{w:'bleue',type:'adjectif'},{w:'.',type:'autre'}],
  [{w:'Bruxelles',type:'nom_propre'},{w:'est',type:'verbe'},{w:'une',type:'determinant'},{w:'grande',type:'adjectif'},{w:'ville',type:'nom_commun'},{w:'.',type:'autre'}],
  [{w:'Noah',type:'nom_propre'},{w:'joue',type:'verbe'},{w:'avec',type:'autre'},{w:'son',type:'determinant'},{w:'chien',type:'nom_commun'},{w:'blanc',type:'adjectif'},{w:'.',type:'autre'}],
  [{w:'Mia',type:'nom_propre'},{w:'et',type:'autre'},{w:'Zoe',type:'nom_propre'},{w:'lisent',type:'verbe'},{w:'un',type:'determinant'},{w:'livre',type:'nom_commun'},{w:'.',type:'autre'}],
  [{w:'Lyon',type:'nom_propre'},{w:'est',type:'verbe'},{w:'une',type:'determinant'},{w:'ville',type:'nom_commun'},{w:'francaise',type:'adjectif'},{w:'.',type:'autre'}],

  // Imperative sentences (5+)
  [{w:'Mange',type:'verbe'},{w:'ta',type:'determinant'},{w:'soupe',type:'nom_commun'},{w:'chaude',type:'adjectif'},{w:'!',type:'autre'}],
  [{w:'Lis',type:'verbe'},{w:'ce',type:'determinant'},{w:'beau',type:'adjectif'},{w:'livre',type:'nom_commun'},{w:'!',type:'autre'}],
  [{w:'Regarde',type:'verbe'},{w:'le',type:'determinant'},{w:'petit',type:'adjectif'},{w:'oiseau',type:'nom_commun'},{w:'.',type:'autre'}],
  [{w:'Ecoute',type:'verbe'},{w:'la',type:'determinant'},{w:'belle',type:'adjectif'},{w:'musique',type:'nom_commun'},{w:'.',type:'autre'}],
  [{w:'Prends',type:'verbe'},{w:'ton',type:'determinant'},{w:'cartable',type:'nom_commun'},{w:'.',type:'autre'}],

  // 2+ adjectives (5+)
  [{w:'Le',type:'determinant'},{w:'soleil',type:'nom_commun'},{w:'brille',type:'verbe'},{w:'.',type:'autre'}],
  [{w:'Les',type:'determinant'},{w:'petits',type:'adjectif'},{w:'lapins',type:'nom_commun'},{w:'sautent',type:'verbe'},{w:'.',type:'autre'}],
  [{w:'Un',type:'determinant'},{w:'grand',type:'adjectif'},{w:'lion',type:'nom_commun'},{w:'fort',type:'adjectif'},{w:'dort',type:'verbe'},{w:'.',type:'autre'}],
  [{w:'La',type:'determinant'},{w:'jolie',type:'adjectif'},{w:'fee',type:'nom_commun'},{w:'porte',type:'verbe'},{w:'une',type:'determinant'},{w:'robe',type:'nom_commun'},{w:'bleue',type:'adjectif'},{w:'.',type:'autre'}],
  [{w:'Le',type:'determinant'},{w:'vieux',type:'adjectif'},{w:'chat',type:'nom_commun'},{w:'gris',type:'adjectif'},{w:'ronronne',type:'verbe'},{w:'.',type:'autre'}],

  // Short sentences (4-5 tokens)
  [{w:'Les',type:'determinant'},{w:'oiseaux',type:'nom_commun'},{w:'volent',type:'verbe'},{w:'.',type:'autre'}],
  [{w:'Un',type:'determinant'},{w:'lapin',type:'nom_commun'},{w:'saute',type:'verbe'},{w:'.',type:'autre'}],
  [{w:'Ma',type:'determinant'},{w:'soeur',type:'nom_commun'},{w:'chante',type:'verbe'},{w:'.',type:'autre'}],

  // Thematic variety
  [{w:'Le',type:'determinant'},{w:'cuisinier',type:'nom_commun'},{w:'prepare',type:'verbe'},{w:'un',type:'determinant'},{w:'delicieux',type:'adjectif'},{w:'gateau',type:'nom_commun'},{w:'.',type:'autre'}],
  [{w:'Les',type:'determinant'},{w:'joueurs',type:'nom_commun'},{w:'courent',type:'verbe'},{w:'sur',type:'autre'},{w:'le',type:'determinant'},{w:'grand',type:'adjectif'},{w:'stade',type:'nom_commun'},{w:'.',type:'autre'}],
  [{w:'La',type:'determinant'},{w:'petite',type:'adjectif'},{w:'grenouille',type:'nom_commun'},{w:'verte',type:'adjectif'},{w:'saute',type:'verbe'},{w:'.',type:'autre'}],
  [{w:'Papa',type:'nom_commun'},{w:'lit',type:'verbe'},{w:'une',type:'determinant'},{w:'histoire',type:'nom_commun'},{w:'drole',type:'adjectif'},{w:'.',type:'autre'}],
  [{w:'Le',type:'determinant'},{w:'dauphin',type:'nom_commun'},{w:'rapide',type:'adjectif'},{w:'nage',type:'verbe'},{w:'dans',type:'autre'},{w:'l\'',type:'determinant'},{w:'ocean',type:'nom_commun'},{w:'.',type:'autre'}],
];

export const TEXTS = [
  {
    title: 'Le renard et le corbeau',
    text: 'Un renard ruse vit un corbeau noir perche sur un arbre. Le corbeau tenait un fromage delicieux dans son bec. Le renard astucieux dit : "Comme tu es beau ! Chante pour moi !" Le corbeau ouvrit le bec et perdit son fromage.',
    sentences: 4,
    words: 43,
    noms_propres: 0,
    noms_communs: ['renard','corbeau','arbre','fromage','bec'],
    adjectifs: ['ruse','noir','delicieux','astucieux','beau'],
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
  {
    title: "L'astronaute courageuse",
    text: "Sofia est une astronaute courageuse. Elle vole dans l'espace a bord d'une grande fusee bleue. Elle observe les etoiles brillantes et la belle planete Terre. Sofia ecrit tout dans son journal de bord.",
    sentences: 4,
    words: 37,
    noms_propres: ['Sofia','Terre'],
    noms_communs: ['astronaute','espace','fusee','etoiles','planete','journal'],
    adjectifs: ['courageuse','grande','bleue','brillantes','belle'],
    verbes: ['est','vole','observe','ecrit'],
  },
  {
    title: 'Les animaux de la foret',
    text: 'Dans la grande foret verte, un renard roux court entre les arbres. Un lapin blanc mange des carottes fraiches. Un hibou sage observe tout depuis son arbre. Les animaux sont heureux dans leur foret.',
    sentences: 4,
    words: 42,
    noms_propres: 0,
    noms_communs: ['foret','renard','arbres','lapin','carottes','hibou','arbre','animaux'],
    adjectifs: ['grande','verte','roux','blanc','fraiches','sage','heureux'],
    verbes: ['court','mange','observe','sont'],
  },
  {
    title: 'Le printemps arrive',
    text: 'Au printemps, les fleurs colorees poussent partout. Les oiseaux chantent des chansons joyeuses dans les arbres. Les enfants jouent dehors sous le soleil chaud. La nature se reveille apres le long hiver froid.',
    sentences: 4,
    words: 40,
    noms_propres: 0,
    noms_communs: ['printemps','fleurs','oiseaux','chansons','arbres','enfants','soleil','nature','hiver'],
    adjectifs: ['colorees','joyeuses','chaud','long','froid'],
    verbes: ['poussent','chantent','jouent','reveille'],
  },
  {
    title: 'La recette du gateau',
    text: 'Maman prepare un delicieux gateau au chocolat. Elle met de la farine, des oeufs et du sucre dans un grand bol. Elle melange tout avec une cuillere en bois. Le gateau cuit longtemps dans le four chaud.',
    sentences: 4,
    words: 41,
    noms_propres: 0,
    noms_communs: ['gateau','chocolat','farine','oeufs','sucre','bol','cuillere','four'],
    adjectifs: ['delicieux','grand','chaud'],
    verbes: ['prepare','met','melange','cuit'],
  },
  {
    title: 'Le match de football',
    text: 'Ce samedi, Hugo joue un important match de football avec son equipe. Les joueurs courent vite sur le grand terrain vert. Hugo marque un beau but et tout le stade applaudit. Son equipe gagne le match !',
    sentences: 4,
    words: 41,
    noms_propres: ['Hugo'],
    noms_communs: ['match','football','equipe','joueurs','terrain','but','stade'],
    adjectifs: ['important','grand','vert','beau'],
    verbes: ['joue','courent','marque','applaudit','gagne'],
  },
  {
    title: 'La fee et le dragon',
    text: 'Dans un royaume lointain vivait une gentille fee aux ailes brillantes. Un mechant dragon crachait du feu sur le village. La fee courageuse vola vers le dragon et lui parla doucement. Le dragon triste devint un ami fidele.',
    sentences: 4,
    words: 44,
    noms_propres: 0,
    noms_communs: ['royaume','fee','ailes','dragon','feu','village','ami'],
    adjectifs: ['lointain','gentille','brillantes','mechant','courageuse','triste','fidele'],
    verbes: ['vivait','crachait','vola','parla','devint'],
  },
  {
    title: 'La famille en vacances',
    text: "Cet ete, la famille de Lea part en vacances au bord de la mer. Papa conduit la grande voiture bleue. Maman chante des chansons joyeuses. Lea et son frere Jules regardent les vagues enormes depuis la plage.",
    sentences: 4,
    words: 43,
    noms_propres: ['Lea','Jules'],
    noms_communs: ['famille','vacances','mer','voiture','chansons','frere','vagues','plage'],
    adjectifs: ['grande','bleue','joyeuses','enormes'],
    verbes: ['part','conduit','chante','regardent'],
  },
  {
    title: "L'ocean mysterieux",
    text: "Au fond de l'ocean bleu vivent des poissons multicolores. Un grand dauphin gris nage pres d'un recif de corail. Une pieuvre intelligente se cache entre les rochers. Les plongeurs admirent ce monde sous-marin magnifique.",
    sentences: 4,
    words: 38,
    noms_propres: 0,
    noms_communs: ['ocean','poissons','dauphin','recif','corail','pieuvre','rochers','plongeurs','monde'],
    adjectifs: ['bleu','multicolores','grand','gris','intelligente','magnifique'],
    verbes: ['vivent','nage','cache','admirent'],
  },
  {
    title: 'La musique de Camille',
    text: 'Camille apprend a jouer de la guitare depuis un an. Chaque soir, elle joue une belle melodie dans sa chambre. Ses parents ecoutent la musique douce avec plaisir. Camille reve de donner un grand concert un jour.',
    sentences: 4,
    words: 40,
    noms_propres: ['Camille'],
    noms_communs: ['guitare','soir','melodie','chambre','parents','musique','concert'],
    adjectifs: ['belle','douce','grand'],
    verbes: ['apprend','jouer','joue','ecoutent','reve','donner'],
  },
  {
    title: 'La ville de Liege',
    text: "Liege est une grande ville belge au bord de la riviere Meuse. Les habitants sont chaleureux et accueillants. On peut visiter le vieux marche et gouter des gaufres chaudes. Liege est aussi connue pour son joyeux carnaval.",
    sentences: 4,
    words: 41,
    noms_propres: ['Liege','Meuse'],
    noms_communs: ['ville','riviere','habitants','marche','gaufres','carnaval'],
    adjectifs: ['grande','belge','chaleureux','accueillants','vieux','chaudes','joyeux'],
    verbes: ['est','sont','visiter','gouter'],
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
  // 10 new templates
  { det: 'une', noun: 'fusee', adj: 'rapide', full: 'une fusee rapide' },
  { det: 'le', noun: 'lion', adj: 'fort', full: 'le lion fort' },
  { det: 'des', noun: 'vagues', adj: 'grandes', full: 'des grandes vagues' },
  { det: 'un', noun: 'chapeau', adj: 'vieux', full: 'un vieux chapeau' },
  { det: 'la', noun: 'fee', adj: 'gentille', full: 'la fee gentille' },
  { det: 'mon', noun: 'velo', adj: 'rouge', full: 'mon velo rouge' },
  { det: 'les', noun: 'lapins', adj: 'petits', full: 'les petits lapins' },
  { det: 'une', noun: 'chanson', adj: 'douce', full: 'une chanson douce' },
  { det: 'ce', noun: 'gateau', adj: 'sucre', full: 'ce gateau sucre' },
  { det: 'des', noun: 'fleurs', adj: 'colorees', full: 'des fleurs colorees' },
];

// ── PHRASE TEMPLATES (30 total, same-type distractors) ───────────────────

export const PHRASE_TEMPLATES = [
  // ADJECTIFS (10 templates) — all 4 choices are adjectives, vary agreement
  { template: 'La ___ fille court dans le jardin.', blank_type: 'adjectif', question: 'Quel adjectif complete la phrase ?', answer: 'petite', distractors: ['petit','petits','grande'] },
  { template: 'Le ___ chien aboie fort.', blank_type: 'adjectif', question: 'Quel adjectif complete la phrase ?', answer: 'gros', distractors: ['grosse','grand','petite'] },
  { template: 'Lena porte une robe ___.', blank_type: 'adjectif', question: 'Quel adjectif complete la phrase ?', answer: 'rouge', distractors: ['rouges','bleu','verte'] },
  { template: 'Mon ecole est un batiment ___.', blank_type: 'adjectif', question: 'Quel adjectif complete la phrase ?', answer: 'grand', distractors: ['grande','grands','petit'] },
  { template: 'Les fleurs ___ poussent au printemps.', blank_type: 'adjectif', question: 'Quel adjectif complete la phrase ?', answer: 'colorees', distractors: ['colore','colores','belle'] },
  { template: 'Il mange une soupe ___.', blank_type: 'adjectif', question: 'Quel adjectif complete la phrase ?', answer: 'chaude', distractors: ['chaud','chauds','froide'] },
  { template: 'Le ___ dragon crache du feu.', blank_type: 'adjectif', question: 'Quel adjectif complete la phrase ?', answer: 'mechant', distractors: ['mechante','mechants','gentil'] },
  { template: 'Emma mange une ___ pomme.', blank_type: 'adjectif', question: 'Quel adjectif complete la phrase ?', answer: 'grande', distractors: ['grand','grands','petite'] },
  { template: 'Les enfants sont ___ a la fete.', blank_type: 'adjectif', question: 'Quel adjectif complete la phrase ?', answer: 'joyeux', distractors: ['joyeuse','joyeuses','triste'] },
  { template: 'La fee porte des ailes ___.', blank_type: 'adjectif', question: 'Quel adjectif complete la phrase ?', answer: 'brillantes', distractors: ['brillant','brillants','belle'] },

  // VERBES (8 templates) — all 4 choices are conjugated verb forms
  { template: 'Les enfants ___ dans la cour.', blank_type: 'verbe', question: 'Quel verbe complete la phrase ?', answer: 'jouent', distractors: ['joue','joues','jouons'] },
  { template: 'Mon papa ___ le journal chaque matin.', blank_type: 'verbe', question: 'Quel verbe complete la phrase ?', answer: 'lit', distractors: ['lisons','lisent','lisez'] },
  { template: 'Le chien ___ tres vite dans le jardin.', blank_type: 'verbe', question: 'Quel verbe complete la phrase ?', answer: 'court', distractors: ['courons','courent','cours'] },
  { template: 'Le renard ___ tres intelligent.', blank_type: 'verbe', question: 'Quel verbe complete la phrase ?', answer: 'est', distractors: ['sommes','sont','etes'] },
  { template: 'Nous ___ dans la grande piscine.', blank_type: 'verbe', question: 'Quel verbe complete la phrase ?', answer: 'nageons', distractors: ['nage','nagent','nagez'] },
  { template: 'Sofia ___ une belle chanson.', blank_type: 'verbe', question: 'Quel verbe complete la phrase ?', answer: 'chante', distractors: ['chantons','chantent','chantez'] },
  { template: 'Les oiseaux ___ dans le ciel bleu.', blank_type: 'verbe', question: 'Quel verbe complete la phrase ?', answer: 'volent', distractors: ['vole','voles','volons'] },
  { template: 'Tu ___ ton cahier tous les jours.', blank_type: 'verbe', question: 'Quel verbe complete la phrase ?', answer: 'ouvres', distractors: ['ouvre','ouvrons','ouvrent'] },

  // NOMS COMMUNS (8 templates) — all 4 choices are plausible nouns
  { template: 'Lena met son ___ dans son sac.', blank_type: 'nom_commun', question: 'Quel nom commun complete la phrase ?', answer: 'cahier', distractors: ['stylo','livre','crayon'] },
  { template: 'Le boulanger prepare un bon ___.', blank_type: 'nom_commun', question: 'Quel nom commun complete la phrase ?', answer: 'pain', distractors: ['gateau','biscuit','fromage'] },
  { template: 'La ___ mange de l\'herbe dans le champ.', blank_type: 'nom_commun', question: 'Quel nom commun complete la phrase ?', answer: 'vache', distractors: ['chevre','brebis','jument'] },
  { template: 'Mon ___ est jaune et bleu.', blank_type: 'nom_commun', question: 'Quel nom commun complete la phrase ?', answer: 'cartable', distractors: ['sac','etui','panier'] },
  { template: 'Le ___ brille dans le ciel la nuit.', blank_type: 'nom_commun', question: 'Quel nom commun complete la phrase ?', answer: 'lune', distractors: ['soleil','etoile','nuage'] },
  { template: 'Le ___ saute tres haut.', blank_type: 'nom_commun', question: 'Quel nom commun complete la phrase ?', answer: 'lapin', distractors: ['herisson','souris','ecureuil'] },
  { template: 'La maitresse ecrit sur le ___.', blank_type: 'nom_commun', question: 'Quel nom commun complete la phrase ?', answer: 'tableau', distractors: ['mur','sol','plafond'] },
  { template: 'Papa conduit sa ___ rouge.', blank_type: 'nom_commun', question: 'Quel nom commun complete la phrase ?', answer: 'voiture', distractors: ['moto','camion','velo'] },

  // NOMS PROPRES (4 templates) — all 4 choices are proper nouns
  { template: '___ est la capitale de la Belgique.', blank_type: 'nom_propre', question: 'Quel nom propre complete la phrase ?', answer: 'Bruxelles', distractors: ['Paris','Liege','Namur'] },
  { template: '___ a un petit chien blanc appele Milou.', blank_type: 'nom_propre', question: 'Quel nom propre complete la phrase ?', answer: 'Lena', distractors: ['Emma','Jade','Sofia'] },
  { template: '___ est la capitale de la France.', blank_type: 'nom_propre', question: 'Quel nom propre complete la phrase ?', answer: 'Paris', distractors: ['Lyon','Marseille','Toulouse'] },
  { template: '___ joue de la guitare avec talent.', blank_type: 'nom_propre', question: 'Quel nom propre complete la phrase ?', answer: 'Camille', distractors: ['Hugo','Noah','Mia'] },
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

// ── CONFUSABLE DISTRACTORS ───────────────────────────────────────────────
// Words that LOOK like they could be a given type but aren't — used in
// genClassifyQuestion to make distractors genuinely challenging.

export const CONFUSABLE_DISTRACTORS = {
  // Words that look like nouns (often used as nouns in context) but are adjectifs or verbes
  nom_commun: ['doux','calme','triste','rapide','nager','sauter','jouer','courir','fort','libre'],
  // Words that look like adjectives but are nouns or infinitifs
  adjectif: ['rose','orange','lait','pain','courir','avoir','tomber','cerise','marron','citron'],
  // Words that end in -er/-ier and look like verbe infinitifs but are nouns
  verbe: ['hiver','boulanger','cahier','papier','voilier','couloir','escalier','calendrier','tablier','grenier'],
  // Common nouns written without capital — look like they could be proper (places/names)
  nom_propre: ['table','maison','chien','enfant','jardin','soleil','ecole','pont','etoile','riviere'],
};

export function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export function genClassifyQuestion(targetType) {
  let correctWord;
  if (targetType === 'nom_commun') correctWord = pickRandom(NOMS_COMMUNS);
  else if (targetType === 'nom_propre') correctWord = pickRandom(NOMS_PROPRES);
  else if (targetType === 'adjectif') correctWord = pickRandom(ADJECTIFS);
  else if (targetType === 'verbe') correctWord = pickRandom(VERBES_INFINITIF);
  else correctWord = pickRandom(DETERMINANTS);

  // Use confusable distractors for the target type — these look plausibly like
  // they could be the target type, forcing the child to think harder.
  const confusablePool = CONFUSABLE_DISTRACTORS[targetType] || [];

  // Build distractor pool: prefer confusable words, fall back to other-type pools
  const fallbackPools = {
    nom_commun: NOMS_COMMUNS,
    nom_propre: NOMS_PROPRES,
    adjectif: ADJECTIFS,
    verbe: VERBES_INFINITIF,
  };
  const otherTypes = Object.keys(fallbackPools).filter(t => t !== targetType);

  const distractors = [];
  // First pick from confusable pool (up to 2)
  const shuffledConfusable = confusablePool.filter(w => w !== correctWord).sort(() => Math.random() - .5);
  distractors.push(...shuffledConfusable.slice(0, 2));
  // Fill remaining from other-type pools
  while (distractors.length < 3) {
    const t = pickRandom(otherTypes);
    const w = pickRandom(fallbackPools[t]);
    if (!distractors.includes(w) && w !== correctWord) distractors.push(w);
  }

  const options = [correctWord, ...distractors.slice(0, 3)].sort(() => Math.random() - .5);
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
