const originRepo = 'generator-engine';

function createGeneratedInformatiqueActivity({
  id,
  slug,
  title,
  subskill,
  gradeBand,
  topic,
  difficulty = 'adaptive',
  instructions,
  hints
}) {
  const generatorGrade = gradeBand.includes('P6')
    ? 'P6'
    : gradeBand.includes('P5')
      ? 'P5'
      : gradeBand.includes('P4')
        ? 'P4'
        : gradeBand.includes('P3') && !gradeBand.includes('P2')
          ? 'P3'
          : 'P2';

  return {
    id,
    slug,
    title,
    subject: 'informatique',
    subskill,
    gradeBand,
    language: 'fr',
    difficulty: 'progressive',
    estimatedDurationMin: 10,
    instructions,
    correctionType: 'multiple-choice',
    hints,
    tags: ['generation', subskill, topic],
    accessibility: ['une tache a la fois', 'exemples visuels'],
    originRepo,
    engineType: 'multiple-choice',
    generatorConfig: {
      grade: generatorGrade,
      topic,
      language: 'fr',
      difficulty,
      sections: [
        {
          id: 'practice',
          title: 'Atelier numerique',
          kind: 'practice',
          description: 'Decouvre et pratique 10 notions informatiques adaptes a ton niveau.',
          count: 10
        },
        {
          id: 'exam',
          title: 'Mini defi numerique',
          kind: 'exam',
          description: '4 questions pour valider tes connaissances en informatique.',
          count: 4
        }
      ]
    }
  };
}

export const informatiqueSubjectMeta = {
  id: 'informatique',
  name: 'Informatique',
  description: 'Ordinateur, clavier, internet, securite, fichiers et premiers algorithmes.',
  icon: '💻',
  color: '#0ea5e9',
  gradient: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
  particle: '💻',
  grades: ['P2', 'P3', 'P4', 'P5', 'P6']
};

export const informatiqueActivities = [
  // --- PARTIES DE L'ORDINATEUR ---
  createGeneratedInformatiqueActivity({
    id: 'generated-info-ordinateur-p2',
    slug: 'parties-ordinateur-p2',
    title: 'Les parties de l\'ordinateur P2',
    subskill: 'parties-de-lordinateur',
    gradeBand: ['P2'],
    topic: 'parties-de-lordinateur',
    difficulty: 'beginner',
    instructions: 'Reconnais les parties de l\'ordinateur et sais-tu a quoi elles servent ?',
    hints: [
      'L\'ecran affiche les images, le clavier permet d\'ecrire.',
      'La souris sert a pointer et cliquer sur l\'ecran.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-ordinateur-p3',
    slug: 'parties-ordinateur-p3',
    title: 'Les composants de l\'ordinateur P3',
    subskill: 'parties-de-lordinateur',
    gradeBand: ['P3'],
    topic: 'parties-de-lordinateur',
    difficulty: 'easy',
    instructions: 'Associe chaque composant de l\'ordinateur a sa fonction !',
    hints: [
      'Le processeur est le cerveau de l\'ordinateur.',
      'La memoire RAM garde les informations utilisees en ce moment.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-ordinateur-p4',
    slug: 'parties-ordinateur-p4',
    title: 'Entrees et sorties P4',
    subskill: 'parties-de-lordinateur',
    gradeBand: ['P4'],
    topic: 'parties-de-lordinateur',
    difficulty: 'medium',
    instructions: 'Classe ces composants en peripheriques d\'entree ou de sortie !',
    hints: [
      'Un peripherique d\'entree envoie des informations a l\'ordinateur (ex: clavier).',
      'Un peripherique de sortie recoit des informations de l\'ordinateur (ex: imprimante).'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-ordinateur-p5',
    slug: 'parties-ordinateur-p5',
    title: 'Architecture de l\'ordinateur P5',
    subskill: 'parties-de-lordinateur',
    gradeBand: ['P5'],
    topic: 'parties-de-lordinateur',
    difficulty: 'hard',
    instructions: 'Explique comment les differents composants de l\'ordinateur communiquent entre eux !',
    hints: [
      'Les donnees voyagent entre composants via le bus systeme.',
      'Le processeur coordonne le travail de tous les autres composants.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-ordinateur-p6',
    slug: 'parties-ordinateur-p6',
    title: 'Choisir son ordinateur P6',
    subskill: 'parties-de-lordinateur',
    gradeBand: ['P6'],
    topic: 'parties-de-lordinateur',
    difficulty: 'expert',
    instructions: 'Analyse les caracteristiques techniques d\'un ordinateur et conseille un acheteur !',
    hints: [
      'Compare la RAM, le processeur et le stockage.',
      'Adapte les caracteristiques a l\'usage prevu (jeu, travail, ecole).'
    ]
  }),

  // --- LE CLAVIER ---
  createGeneratedInformatiqueActivity({
    id: 'generated-info-clavier-p2',
    slug: 'clavier-p2',
    title: 'Decouvrir le clavier P2',
    subskill: 'le-clavier',
    gradeBand: ['P2'],
    topic: 'le-clavier',
    difficulty: 'beginner',
    instructions: 'Repere les touches importantes du clavier : lettres, chiffres et touches speciales !',
    hints: [
      'La touche Entree valide ce que tu as ecrit.',
      'La touche Supprimer efface la derniere lettre.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-clavier-p3',
    slug: 'clavier-p3',
    title: 'Saisir du texte P3',
    subskill: 'le-clavier',
    gradeBand: ['P3'],
    topic: 'le-clavier',
    difficulty: 'easy',
    instructions: 'Apprends a utiliser les majuscules et les signes de ponctuation au clavier !',
    hints: [
      'Maintiens la touche Maj pour ecrire une majuscule.',
      'La barre d\'espace cree un espace entre les mots.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-clavier-p4',
    slug: 'clavier-p4',
    title: 'Raccourcis clavier P4',
    subskill: 'le-clavier',
    gradeBand: ['P4'],
    topic: 'le-clavier',
    difficulty: 'medium',
    instructions: 'Apprends les raccourcis clavier les plus utiles pour aller plus vite !',
    hints: [
      'Ctrl + C copie le texte selectionne.',
      'Ctrl + V colle ce qui a ete copie.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-clavier-p5',
    slug: 'clavier-p5',
    title: 'Raccourcis avances P5',
    subskill: 'le-clavier',
    gradeBand: ['P5'],
    topic: 'le-clavier',
    difficulty: 'hard',
    instructions: 'Maitrise les raccourcis avances pour etre plus efficace au travail !',
    hints: [
      'Ctrl + Z annule la derniere action.',
      'Ctrl + F permet de chercher un mot dans un document.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-clavier-p6',
    slug: 'clavier-p6',
    title: 'Efficacite au clavier P6',
    subskill: 'le-clavier',
    gradeBand: ['P6'],
    topic: 'le-clavier',
    difficulty: 'expert',
    instructions: 'Choisis le bon raccourci clavier pour chaque situation professionnelle !',
    hints: [
      'Les raccourcis clavier varient selon le logiciel utilise.',
      'Apprends les raccourcis les plus frequents pour gagner du temps.'
    ]
  }),

  // --- LA SOURIS ---
  createGeneratedInformatiqueActivity({
    id: 'generated-info-souris-p2',
    slug: 'la-souris-p2',
    title: 'Utiliser la souris P2',
    subskill: 'la-souris',
    gradeBand: ['P2'],
    topic: 'la-souris',
    difficulty: 'beginner',
    instructions: 'Apprends les gestes de base de la souris : clic, double-clic et deplacement !',
    hints: [
      'Un clic selectionne, un double-clic ouvre.',
      'Deplace la souris lentement pour bien viser.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-souris-p3',
    slug: 'la-souris-p3',
    title: 'Clic gauche et clic droit P3',
    subskill: 'la-souris',
    gradeBand: ['P3'],
    topic: 'la-souris',
    difficulty: 'easy',
    instructions: 'Sais-tu quand utiliser le clic gauche et quand utiliser le clic droit ?',
    hints: [
      'Le clic gauche selectionne ou ouvre un element.',
      'Le clic droit affiche un menu avec des options supplementaires.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-souris-p4',
    slug: 'la-souris-p4',
    title: 'Glisser-deposer P4',
    subskill: 'la-souris',
    gradeBand: ['P4'],
    topic: 'la-souris',
    difficulty: 'medium',
    instructions: 'Apprends a deplacer des elements en utilisant le glisser-deposer !',
    hints: [
      'Maintiens le clic gauche enfonce pendant le deplacement.',
      'Relache le bouton quand tu es a l\'endroit voulu.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-souris-p5',
    slug: 'la-souris-p5',
    title: 'Gestes avances P5',
    subskill: 'la-souris',
    gradeBand: ['P5'],
    topic: 'la-souris',
    difficulty: 'hard',
    instructions: 'Combine les gestes de la souris avec les touches du clavier pour plus de precision !',
    hints: [
      'Shift + clic selectionne plusieurs elements d\'un coup.',
      'Ctrl + clic ajoute ou retire un element de la selection.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-souris-p6',
    slug: 'la-souris-p6',
    title: 'Precision et ergonomie P6',
    subskill: 'la-souris',
    gradeBand: ['P6'],
    topic: 'la-souris',
    difficulty: 'expert',
    instructions: 'Optimise ton utilisation de la souris pour travailler efficacement et sans fatigue !',
    hints: [
      'Reglez la vitesse du curseur selon tes besoins.',
      'Une bonne posture reduit la fatigue lors de longues sessions.'
    ]
  }),

  // --- INTERNET ---
  createGeneratedInformatiqueActivity({
    id: 'generated-info-internet-p2',
    slug: 'internet-p2',
    title: 'Decouvrir internet P2',
    subskill: 'internet',
    gradeBand: ['P2'],
    topic: 'internet',
    difficulty: 'beginner',
    instructions: 'Qu\'est-ce qu\'internet ? Decouvre les bases de la navigation en ligne !',
    hints: [
      'Internet est un reseau mondial d\'ordinateurs connectes.',
      'Un navigateur comme Firefox ou Chrome permet d\'acceder aux sites web.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-internet-p3',
    slug: 'internet-p3',
    title: 'Naviguer sur internet P3',
    subskill: 'internet',
    gradeBand: ['P3'],
    topic: 'internet',
    difficulty: 'easy',
    instructions: 'Apprends a utiliser la barre d\'adresse et le moteur de recherche !',
    hints: [
      'Une URL commence toujours par https:// ou http://.',
      'Tape des mots-cles precis pour trouver ce que tu cherches.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-internet-p4',
    slug: 'internet-p4',
    title: 'Rechercher efficacement P4',
    subskill: 'internet',
    gradeBand: ['P4'],
    topic: 'internet',
    difficulty: 'medium',
    instructions: 'Apprends a faire des recherches efficaces et a evaluer les resultats !',
    hints: [
      'Utilise des guillemets pour chercher une expression exacte.',
      'Verifie la fiabilite des sources avant de croire une information.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-internet-p5',
    slug: 'internet-p5',
    title: 'Evaluer les sources P5',
    subskill: 'internet',
    gradeBand: ['P5'],
    topic: 'internet',
    difficulty: 'hard',
    instructions: 'Apprends a distinguer les sources fiables des fausses informations sur internet !',
    hints: [
      'Verifie l\'auteur, la date et les sources citees.',
      'Croise les informations sur plusieurs sites de confiance.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-internet-p6',
    slug: 'internet-p6',
    title: 'Citoyen numerique P6',
    subskill: 'internet',
    gradeBand: ['P6'],
    topic: 'internet',
    difficulty: 'expert',
    instructions: 'Comprends le fonctionnement d\'internet et tes droits en tant qu\'utilisateur !',
    hints: [
      'Internet fonctionne grace a des protocoles comme TCP/IP et HTTP.',
      'Tes donnees personnelles sont protegees par des lois (RGPD en Europe).'
    ]
  }),

  // --- SECURITE NUMERIQUE ---
  createGeneratedInformatiqueActivity({
    id: 'generated-info-securite-p2',
    slug: 'securite-numerique-p2',
    title: 'Ma securite en ligne P2',
    subskill: 'securite-numerique',
    gradeBand: ['P2'],
    topic: 'securite-numerique',
    difficulty: 'beginner',
    instructions: 'Apprends les regles de base pour etre en securite sur internet !',
    hints: [
      'Ne donne jamais ton vrai nom ou ton adresse a des inconnus.',
      'Parle toujours a un adulte si quelque chose te fait peur en ligne.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-securite-p3',
    slug: 'securite-numerique-p3',
    title: 'Mots de passe solides P3',
    subskill: 'securite-numerique',
    gradeBand: ['P3'],
    topic: 'securite-numerique',
    difficulty: 'easy',
    instructions: 'Apprends a creer un mot de passe fort et a le garder secret !',
    hints: [
      'Un bon mot de passe contient lettres, chiffres et symboles.',
      'Ne partage ton mot de passe avec personne, meme un ami.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-securite-p4',
    slug: 'securite-numerique-p4',
    title: 'Proteger ses donnees P4',
    subskill: 'securite-numerique',
    gradeBand: ['P4'],
    topic: 'securite-numerique',
    difficulty: 'medium',
    instructions: 'Quelles informations personnelles peut-on partager en ligne ? Apprends a te proteger !',
    hints: [
      'Ne partage jamais ton adresse, numero de telephone ou mot de passe.',
      'Verifie toujours les parametres de confidentialite de tes comptes.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-securite-p5',
    slug: 'securite-numerique-p5',
    title: 'Cyberharcelement P5',
    subskill: 'securite-numerique',
    gradeBand: ['P5'],
    topic: 'securite-numerique',
    difficulty: 'hard',
    instructions: 'Reconnais les situations de cyberharcelement et sache comment reagir !',
    hints: [
      'Garde les preuves (copies d\'ecran) et parle-en a un adulte.',
      'Bloque la personne et signale son comportement a la plateforme.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-securite-p6',
    slug: 'securite-numerique-p6',
    title: 'Securite avancee P6',
    subskill: 'securite-numerique',
    gradeBand: ['P6'],
    topic: 'securite-numerique',
    difficulty: 'expert',
    instructions: 'Comprends les menaces numeriques comme le phishing et les virus, et comment s\'en proteger !',
    hints: [
      'Un email de phishing imite un site de confiance pour voler tes donnees.',
      'Un antivirus et les mises a jour regulieres protegent ton ordinateur.'
    ]
  }),

  // --- FICHIERS ET DOSSIERS ---
  createGeneratedInformatiqueActivity({
    id: 'generated-info-fichiers-p2',
    slug: 'fichiers-dossiers-p2',
    title: 'Fichiers et dossiers P2',
    subskill: 'fichiers-et-dossiers',
    gradeBand: ['P2'],
    topic: 'fichiers-et-dossiers',
    difficulty: 'beginner',
    instructions: 'Comprends ce qu\'est un fichier et comment les ranger dans des dossiers !',
    hints: [
      'Un dossier est comme une pochette pour ranger des fichiers.',
      'Donne des noms clairs a tes fichiers pour les retrouver facilement.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-fichiers-p3',
    slug: 'fichiers-dossiers-p3',
    title: 'Organiser ses fichiers P3',
    subskill: 'fichiers-et-dossiers',
    gradeBand: ['P3'],
    topic: 'fichiers-et-dossiers',
    difficulty: 'easy',
    instructions: 'Apprends a copier, couper et coller des fichiers pour les organiser !',
    hints: [
      'Copier garde l\'original, couper le deplace.',
      'Utilise des noms de dossiers logiques par categorie ou date.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-fichiers-p4',
    slug: 'fichiers-dossiers-p4',
    title: 'Extensions de fichiers P4',
    subskill: 'fichiers-et-dossiers',
    gradeBand: ['P4'],
    topic: 'fichiers-et-dossiers',
    difficulty: 'medium',
    instructions: 'A quoi sert l\'extension d\'un fichier ? Reconnais les types de fichiers courants !',
    hints: [
      '.jpg ou .png pour les images, .mp3 pour la musique.',
      '.docx pour les documents Word, .pdf pour les documents a lire.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-fichiers-p5',
    slug: 'fichiers-dossiers-p5',
    title: 'Arborescence de fichiers P5',
    subskill: 'fichiers-et-dossiers',
    gradeBand: ['P5'],
    topic: 'fichiers-et-dossiers',
    difficulty: 'hard',
    instructions: 'Comprends et represente l\'arborescence d\'un systeme de fichiers !',
    hints: [
      'L\'arborescence ressemble a un arbre avec un dossier racine et des branches.',
      'Chaque dossier peut contenir d\'autres dossiers (sous-dossiers) et des fichiers.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-fichiers-p6',
    slug: 'fichiers-dossiers-p6',
    title: 'Gestion avancee P6',
    subskill: 'fichiers-et-dossiers',
    gradeBand: ['P6'],
    topic: 'fichiers-et-dossiers',
    difficulty: 'expert',
    instructions: 'Organise un systeme de fichiers complet et optimise pour une ecole !',
    hints: [
      'Cree une hierarchie logique : par annee, par matiere, par type.',
      'Pense aux droits d\'acces pour proteger certains fichiers sensibles.'
    ]
  }),

  // --- LOGIQUE INFORMATIQUE ---
  createGeneratedInformatiqueActivity({
    id: 'generated-info-logique-p2',
    slug: 'logique-informatique-p2',
    title: 'Les etapes en ordre P2',
    subskill: 'logique-informatique',
    gradeBand: ['P2'],
    topic: 'logique-informatique',
    difficulty: 'beginner',
    instructions: 'Mets ces etapes dans le bon ordre pour realiser une tache !',
    hints: [
      'Une machine suit toujours les etapes dans l\'ordre.',
      'Si une etape est dans le mauvais ordre, la tache ne marche pas.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-logique-p3',
    slug: 'logique-informatique-p3',
    title: 'Si... alors... P3',
    subskill: 'logique-informatique',
    gradeBand: ['P3'],
    topic: 'logique-informatique',
    difficulty: 'easy',
    instructions: 'Comprends les conditions : si... alors... dans des situations de la vie !',
    hints: [
      'Une condition verifie si quelque chose est vrai ou faux.',
      'Exemple : SI il pleut ALORS prends un parapluie.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-logique-p4',
    slug: 'logique-informatique-p4',
    title: 'Les boucles P4',
    subskill: 'logique-informatique',
    gradeBand: ['P4'],
    topic: 'logique-informatique',
    difficulty: 'medium',
    instructions: 'Comprends le concept de boucle : repeter une action plusieurs fois !',
    hints: [
      'Une boucle evite de repeter la meme instruction de nombreuses fois.',
      'Exemple : REPETE 10 fois : avance d\'un pas.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-logique-p5',
    slug: 'logique-informatique-p5',
    title: 'Conditions et boucles P5',
    subskill: 'logique-informatique',
    gradeBand: ['P5'],
    topic: 'logique-informatique',
    difficulty: 'hard',
    instructions: 'Combine conditions et boucles pour resoudre des problemes logiques !',
    hints: [
      'Une boucle peut contenir une condition a l\'interieur.',
      'Trace le deroulement etape par etape pour verifier ta reponse.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-logique-p6',
    slug: 'logique-informatique-p6',
    title: 'Logique booleenne P6',
    subskill: 'logique-informatique',
    gradeBand: ['P6'],
    topic: 'logique-informatique',
    difficulty: 'expert',
    instructions: 'Maitrise la logique booleenne : ET, OU, NON pour resoudre des problemes complexes !',
    hints: [
      'ET : les deux conditions doivent etre vraies.',
      'OU : au moins une des conditions doit etre vraie.',
      'NON inverse la valeur d\'une condition.'
    ]
  }),

  // --- PREMIERS ALGORITHMES ---
  createGeneratedInformatiqueActivity({
    id: 'generated-info-algos-p2',
    slug: 'premiers-algorithmes-p2',
    title: 'Ma premiere recette P2',
    subskill: 'premiers-algorithmes',
    gradeBand: ['P2'],
    topic: 'premiers-algorithmes',
    difficulty: 'beginner',
    instructions: 'Un algorithme c\'est comme une recette ! Ordonne ces etapes pour faire un gateau.',
    hints: [
      'Les etapes d\'une recette doivent toujours etre dans le bon ordre.',
      'Si tu changes l\'ordre, le gateau ne sera pas bon !'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-algos-p3',
    slug: 'premiers-algorithmes-p3',
    title: 'Instructions pour un robot P3',
    subskill: 'premiers-algorithmes',
    gradeBand: ['P3'],
    topic: 'premiers-algorithmes',
    difficulty: 'easy',
    instructions: 'Ecris les instructions pour qu\'un robot puisse realiser une tache simple !',
    hints: [
      'Sois tres precis : un robot suit les instructions a la lettre.',
      'Decompose chaque action en petites etapes claires.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-algos-p4',
    slug: 'premiers-algorithmes-p4',
    title: 'Algorithme en langage naturel P4',
    subskill: 'premiers-algorithmes',
    gradeBand: ['P4'],
    topic: 'premiers-algorithmes',
    difficulty: 'medium',
    instructions: 'Ecris un algorithme en langage naturel pour resoudre un probleme quotidien !',
    hints: [
      'Utilise des mots simples : DEBUT, FIN, SI, SINON, REPETE.',
      'Verifie que ton algorithme fonctionne en le suivant etape par etape.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-algos-p5',
    slug: 'premiers-algorithmes-p5',
    title: 'Debogage d\'algorithmes P5',
    subskill: 'premiers-algorithmes',
    gradeBand: ['P5'],
    topic: 'premiers-algorithmes',
    difficulty: 'hard',
    instructions: 'Cet algorithme contient une erreur ! Trouve-la et corrige-la.',
    hints: [
      'Suit l\'algorithme etape par etape en notant chaque valeur.',
      'Compare le resultat obtenu avec le resultat attendu pour trouver l\'erreur.'
    ]
  }),
  createGeneratedInformatiqueActivity({
    id: 'generated-info-algos-p6',
    slug: 'premiers-algorithmes-p6',
    title: 'Algorithmes avec conditions P6',
    subskill: 'premiers-algorithmes',
    gradeBand: ['P6'],
    topic: 'premiers-algorithmes',
    difficulty: 'expert',
    instructions: 'Cree des algorithmes complexes avec conditions, boucles et sous-programmes !',
    hints: [
      'Un sous-programme est un algorithme a l\'interieur d\'un autre.',
      'Teste ton algorithme avec des cas limites pour verifier qu\'il fonctionne toujours.'
    ]
  })
];
