const originRepo = 'generator-engine';

function createGeneratedLogiqueActivity({
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
    subject: 'logique',
    subskill,
    gradeBand,
    language: 'fr',
    difficulty: 'progressive',
    estimatedDurationMin: 10,
    instructions,
    correctionType: 'multiple-choice',
    hints,
    tags: ['generation', subskill, topic],
    accessibility: ['une tache a la fois', 'reponses claires'],
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
          title: 'Entrainement logique',
          kind: 'practice',
          description: 'Observe et complete 10 exercices adaptes a ton niveau.',
          count: 10
        },
        {
          id: 'exam',
          title: 'Mini defi logique',
          kind: 'exam',
          description: '4 exercices supplementaires pour valider le module.',
          count: 4
        }
      ]
    }
  };
}

export const logiqueSubjectMeta = {
  id: 'logique',
  name: 'Logique et Reflexion',
  description: 'Suites, intrus, formes, labyrinthes, deduction et resolution de problemes.',
  icon: '🧠',
  color: '#6366f1',
  gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  particle: '🧠',
  grades: ['P2', 'P3', 'P4', 'P5', 'P6']
};

export const logiqueActivities = [
  // --- SUITES LOGIQUES ---
  createGeneratedLogiqueActivity({
    id: 'generated-logique-suites-p2',
    slug: 'suites-logiques-p2',
    title: 'Suites logiques P2',
    subskill: 'suites-logiques',
    gradeBand: ['P2'],
    topic: 'suites-logiques',
    difficulty: 'beginner',
    instructions: 'Trouve le nombre ou l\'image qui manque dans la suite !',
    hints: [
      'Regarde bien ce qui se repete ou ce qui change.',
      'Compte les differences entre chaque element.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-suites-p3',
    slug: 'suites-logiques-p3',
    title: 'Suites logiques P3',
    subskill: 'suites-logiques',
    gradeBand: ['P3'],
    topic: 'suites-logiques',
    difficulty: 'easy',
    instructions: 'Complete la suite en trouvant la regle cachee avec des nombres jusqu\'a 100 !',
    hints: [
      'Calcule la difference entre deux elements voisins.',
      'La regle peut etre +2, +5 ou un autre nombre.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-suites-p4',
    slug: 'suites-logiques-p4',
    title: 'Suites logiques P4',
    subskill: 'suites-logiques',
    gradeBand: ['P4'],
    topic: 'suites-logiques',
    difficulty: 'medium',
    instructions: 'Decouvre la regle de la suite : addition, soustraction ou multiplication !',
    hints: [
      'Essaie de diviser ou multiplier deux elements consecutifs.',
      'La regle peut etre +2, x2 ou une combinaison.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-suites-p5',
    slug: 'suites-logiques-p5',
    title: 'Suites combinées P5',
    subskill: 'suites-logiques',
    gradeBand: ['P5'],
    topic: 'suites-logiques',
    difficulty: 'hard',
    instructions: 'Ces suites combinent deux regles a la fois. Sauras-tu les demasquer ?',
    hints: [
      'Verifie si la regle alterne entre deux operations.',
      'Note les elements sur du papier brouillon pour mieux voir le motif.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-suites-p6',
    slug: 'suites-logiques-p6',
    title: 'Suites logiques avancees P6',
    subskill: 'suites-logiques',
    gradeBand: ['P6'],
    topic: 'suites-logiques',
    difficulty: 'expert',
    instructions: 'Defi champion ! Resous des suites complexes avec plusieurs regles combinees.',
    hints: [
      'Cherche si la suite suit une progression geometrique ou arithmetique.',
      'Divise la suite en sous-groupes pour trouver la regle.'
    ]
  }),

  // --- TROUVE L'INTRUS ---
  createGeneratedLogiqueActivity({
    id: 'generated-logique-intrus-p2',
    slug: 'trouve-lintrus-p2',
    title: 'Trouve l\'intrus P2',
    subskill: 'trouve-lintrus',
    gradeBand: ['P2'],
    topic: 'trouve-lintrus',
    difficulty: 'beginner',
    instructions: 'Lequel de ces objets n\'est pas comme les autres ? Trouve l\'intrus !',
    hints: [
      'Cherche ce que tous les autres ont en commun.',
      'L\'intrus est different par sa couleur, sa forme ou sa categorie.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-intrus-p3',
    slug: 'trouve-lintrus-p3',
    title: 'Trouve l\'intrus P3',
    subskill: 'trouve-lintrus',
    gradeBand: ['P3'],
    topic: 'trouve-lintrus',
    difficulty: 'easy',
    instructions: 'Trouve l\'element qui ne respecte pas les deux criteres du groupe !',
    hints: [
      'Verifie chaque critere un par un.',
      'Il peut y avoir deux criteres comme la couleur ET la forme.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-intrus-p4',
    slug: 'trouve-lintrus-p4',
    title: 'Trouve l\'intrus P4',
    subskill: 'trouve-lintrus',
    gradeBand: ['P4'],
    topic: 'trouve-lintrus',
    difficulty: 'medium',
    instructions: 'Ces intrus sont bien caches ! Cherche le critere qui les trahit.',
    hints: [
      'Essaie de definir la categorie commune avant de chercher l\'intrus.',
      'Parfois l\'intrus ressemble aux autres mais appartient a une autre famille.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-intrus-p5',
    slug: 'trouve-lintrus-p5',
    title: 'Trouve l\'intrus P5',
    subskill: 'trouve-lintrus',
    gradeBand: ['P5'],
    topic: 'trouve-lintrus',
    difficulty: 'hard',
    instructions: 'Trois criteres se cachent dans ces groupes. Lequel l\'intrus ne respecte pas ?',
    hints: [
      'Liste les proprietes de chaque element.',
      'Compare systematiquement chaque element avec les autres.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-intrus-p6',
    slug: 'trouve-lintrus-p6',
    title: 'Trouve l\'intrus P6',
    subskill: 'trouve-lintrus',
    gradeBand: ['P6'],
    topic: 'trouve-lintrus',
    difficulty: 'expert',
    instructions: 'Defi expert : l\'intrus se cache derriere une logique formelle. A toi de jouer !',
    hints: [
      'Utilise l\'elimination systematique.',
      'Cherche le critere le plus subtil comme la parite ou une propriete mathematique.'
    ]
  }),

  // --- FORMES ET MOTIFS ---
  createGeneratedLogiqueActivity({
    id: 'generated-logique-formes-p2',
    slug: 'formes-et-motifs-p2',
    title: 'Formes et motifs P2',
    subskill: 'formes-et-motifs',
    gradeBand: ['P2'],
    topic: 'formes-et-motifs',
    difficulty: 'beginner',
    instructions: 'Quelle forme vient ensuite dans ce beau motif ? Regarde bien !',
    hints: [
      'Observe l\'ordre dans lequel les formes apparaissent.',
      'Les motifs se repetent toujours de la meme facon.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-formes-p3',
    slug: 'formes-et-motifs-p3',
    title: 'Formes et motifs P3',
    subskill: 'formes-et-motifs',
    gradeBand: ['P3'],
    topic: 'formes-et-motifs',
    difficulty: 'easy',
    instructions: 'Complete ce motif geometrique en choisissant la bonne forme !',
    hints: [
      'Regarde la couleur ET la forme de chaque element.',
      'Le motif peut changer de couleur ou tourner.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-formes-p4',
    slug: 'formes-et-motifs-p4',
    title: 'Formes et motifs P4',
    subskill: 'formes-et-motifs',
    gradeBand: ['P4'],
    topic: 'formes-et-motifs',
    difficulty: 'medium',
    instructions: 'Ces matrices de formes ont une regle cachee dans chaque ligne et colonne !',
    hints: [
      'Observe chaque ligne puis chaque colonne separement.',
      'Cherche ce qui varie : taille, couleur ou orientation.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-formes-p5',
    slug: 'formes-et-motifs-p5',
    title: 'Matrices de formes P5',
    subskill: 'formes-et-motifs',
    gradeBand: ['P5'],
    topic: 'formes-et-motifs',
    difficulty: 'hard',
    instructions: 'Decouvre la regle commune a toutes les lignes et colonnes de la matrice !',
    hints: [
      'Teste ta regle sur toutes les lignes avant de repondre.',
      'Plusieurs proprietes peuvent changer en meme temps.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-formes-p6',
    slug: 'formes-et-motifs-p6',
    title: 'Matrices avancees P6',
    subskill: 'formes-et-motifs',
    gradeBand: ['P6'],
    topic: 'formes-et-motifs',
    difficulty: 'expert',
    instructions: 'Matrices complexes avec trois transformations simultanees. Defi champion !',
    hints: [
      'Identifie une regle a la fois : d\'abord la forme, puis la couleur, puis l\'orientation.',
      'Utilise l\'elimination pour ecarter les mauvaises reponses.'
    ]
  }),

  // --- LABYRINTHES ---
  createGeneratedLogiqueActivity({
    id: 'generated-logique-labyrinthes-p2',
    slug: 'labyrinthes-p2',
    title: 'Labyrinthes P2',
    subskill: 'labyrinthes',
    gradeBand: ['P2'],
    topic: 'labyrinthes',
    difficulty: 'beginner',
    instructions: 'Aide le petit personnage a trouver la sortie du labyrinthe !',
    hints: [
      'Commence par chercher la sortie et remonte vers le depart.',
      'Si tu bloques, essaie un autre chemin.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-labyrinthes-p3',
    slug: 'labyrinthes-p3',
    title: 'Labyrinthes P3',
    subskill: 'labyrinthes',
    gradeBand: ['P3'],
    topic: 'labyrinthes',
    difficulty: 'easy',
    instructions: 'Trouve le chemin le plus court vers la sortie !',
    hints: [
      'Compte le nombre de cases pour chaque chemin possible.',
      'Le chemin le plus court evite les detours inutiles.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-labyrinthes-p4',
    slug: 'labyrinthes-p4',
    title: 'Labyrinthes P4',
    subskill: 'labyrinthes',
    gradeBand: ['P4'],
    topic: 'labyrinthes',
    difficulty: 'medium',
    instructions: 'Traverser le labyrinthe en collectant tous les objets sur le chemin !',
    hints: [
      'Planifie ton itineraire avant de commencer.',
      'Certains chemins permettent de passer par plusieurs objets d\'un coup.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-labyrinthes-p5',
    slug: 'labyrinthes-p5',
    title: 'Labyrinthes complexes P5',
    subskill: 'labyrinthes',
    gradeBand: ['P5'],
    topic: 'labyrinthes',
    difficulty: 'hard',
    instructions: 'Ce labyrinthe a des portes speciales qui s\'ouvrent avec des cles. Sois strategique !',
    hints: [
      'Repere d\'abord toutes les cles et leur emplacement.',
      'Certaines portes ne peuvent etre franchies qu\'apres avoir recupere la bonne cle.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-labyrinthes-p6',
    slug: 'labyrinthes-p6',
    title: 'Labyrinthes logiques P6',
    subskill: 'labyrinthes',
    gradeBand: ['P6'],
    topic: 'labyrinthes',
    difficulty: 'expert',
    instructions: 'Resous ce labyrinthe avec des regles logiques : certains chemins ne s\'ouvrent que si une condition est remplie !',
    hints: [
      'Lis attentivement toutes les regles avant de commencer.',
      'Etablis un plan en listant les conditions a satisfaire dans l\'ordre.'
    ]
  }),

  // --- LOGIQUE VISUELLE ---
  createGeneratedLogiqueActivity({
    id: 'generated-logique-visuelle-p2',
    slug: 'logique-visuelle-p2',
    title: 'Logique visuelle P2',
    subskill: 'logique-visuelle',
    gradeBand: ['P2'],
    topic: 'logique-visuelle',
    difficulty: 'beginner',
    instructions: 'Regarde bien l\'image et reponds a la question logique !',
    hints: [
      'Observe tous les details de l\'image avant de repondre.',
      'Compte les objets ou repere leurs differences.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-visuelle-p3',
    slug: 'logique-visuelle-p3',
    title: 'Logique visuelle P3',
    subskill: 'logique-visuelle',
    gradeBand: ['P3'],
    topic: 'logique-visuelle',
    difficulty: 'easy',
    instructions: 'Deduis la bonne reponse en observant attentivement les images !',
    hints: [
      'Compare les images une par une.',
      'Cherche la transformation cachee entre chaque image.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-visuelle-p4',
    slug: 'logique-visuelle-p4',
    title: 'Logique visuelle P4',
    subskill: 'logique-visuelle',
    gradeBand: ['P4'],
    topic: 'logique-visuelle',
    difficulty: 'medium',
    instructions: 'Ces images cachent une regle logique. Seras-tu capable de la decouvrir ?',
    hints: [
      'Cherche ce qui est commun et ce qui est different.',
      'La regle peut concerner la position, la taille ou la couleur.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-visuelle-p5',
    slug: 'logique-visuelle-p5',
    title: 'Deduction visuelle P5',
    subskill: 'logique-visuelle',
    gradeBand: ['P5'],
    topic: 'logique-visuelle',
    difficulty: 'hard',
    instructions: 'Deduis la bonne image en appliquant plusieurs regles de transformation !',
    hints: [
      'Identifie chaque transformation separement.',
      'Applique les transformations dans le bon ordre.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-visuelle-p6',
    slug: 'logique-visuelle-p6',
    title: 'Raisonnement visuel P6',
    subskill: 'logique-visuelle',
    gradeBand: ['P6'],
    topic: 'logique-visuelle',
    difficulty: 'expert',
    instructions: 'Raisonnement visuel avance : deduis la regle formelle qui relie toutes ces images !',
    hints: [
      'Utilise la methode d\'elimination systematique.',
      'Cherche une propriete invariante presente dans toutes les images de reference.'
    ]
  }),

  // --- COMPARAISON ---
  createGeneratedLogiqueActivity({
    id: 'generated-logique-comparaison-p2',
    slug: 'comparaison-p2',
    title: 'Comparer et ordonner P2',
    subskill: 'comparaison',
    gradeBand: ['P2'],
    topic: 'comparaison',
    difficulty: 'beginner',
    instructions: 'Compare ces objets et mets-les dans le bon ordre !',
    hints: [
      'Commence par trouver le plus petit et le plus grand.',
      'Tu peux utiliser les symboles < et > pour comparer.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-comparaison-p3',
    slug: 'comparaison-p3',
    title: 'Classer et comparer P3',
    subskill: 'comparaison',
    gradeBand: ['P3'],
    topic: 'comparaison',
    difficulty: 'easy',
    instructions: 'Classe ces elements selon deux criteres differents !',
    hints: [
      'Verifie chaque critere l\'un apres l\'autre.',
      'Fais un tableau pour t\'aider a classer.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-comparaison-p4',
    slug: 'comparaison-p4',
    title: 'Comparaison avancee P4',
    subskill: 'comparaison',
    gradeBand: ['P4'],
    topic: 'comparaison',
    difficulty: 'medium',
    instructions: 'Ordonne et classe ces elements selon plusieurs criteres a la fois !',
    hints: [
      'Cree des categories avant de classer.',
      'Pense a utiliser un tableau de tri pour t\'organiser.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-comparaison-p5',
    slug: 'comparaison-p5',
    title: 'Tri et classification P5',
    subskill: 'comparaison',
    gradeBand: ['P5'],
    topic: 'comparaison',
    difficulty: 'hard',
    instructions: 'Trie et classe des series complexes selon des criteres combines !',
    hints: [
      'Etablis d\'abord les criteres principaux et secondaires.',
      'Verifie ton classement en relisant chaque critere.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-comparaison-p6',
    slug: 'comparaison-p6',
    title: 'Classification formelle P6',
    subskill: 'comparaison',
    gradeBand: ['P6'],
    topic: 'comparaison',
    difficulty: 'expert',
    instructions: 'Maitrise l\'art de la classification formelle avec des ensembles et des sous-ensembles !',
    hints: [
      'Represente les groupes par des diagrammes de Venn si besoin.',
      'Verifie que chaque element appartient au bon sous-ensemble.'
    ]
  }),

  // --- DEDUCTION ---
  createGeneratedLogiqueActivity({
    id: 'generated-logique-deduction-p2',
    slug: 'deduction-p2',
    title: 'Petite deduction P2',
    subskill: 'deduction',
    gradeBand: ['P2'],
    topic: 'deduction',
    difficulty: 'beginner',
    instructions: 'Lis bien les indices et trouve la bonne reponse !',
    hints: [
      'Lis chaque indice l\'un apres l\'autre.',
      'Elimine les reponses impossibles au fur et a mesure.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-deduction-p3',
    slug: 'deduction-p3',
    title: 'Deduction simple P3',
    subskill: 'deduction',
    gradeBand: ['P3'],
    topic: 'deduction',
    difficulty: 'easy',
    instructions: 'A partir de deux indices, deduis la bonne reponse !',
    hints: [
      'Commence par l\'indice le plus precis.',
      'Note les possibilites qui restent apres chaque indice.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-deduction-p4',
    slug: 'deduction-p4',
    title: 'Deduction P4',
    subskill: 'deduction',
    gradeBand: ['P4'],
    topic: 'deduction',
    difficulty: 'medium',
    instructions: 'Utilise le raisonnement par elimination pour resoudre ces enigmes !',
    hints: [
      'Fais un tableau avec toutes les possibilites.',
      'Raye les cases impossibles apres chaque indice.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-deduction-p5',
    slug: 'deduction-p5',
    title: 'Raisonnement par elimination P5',
    subskill: 'deduction',
    gradeBand: ['P5'],
    topic: 'deduction',
    difficulty: 'hard',
    instructions: 'Ces enigmes logiques demandent trois etapes de deduction. Patience et methode !',
    hints: [
      'Construis un tableau de deduction avec toutes les variables.',
      'Avance etape par etape et verifie chaque deduction.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-deduction-p6',
    slug: 'deduction-p6',
    title: 'Logique formelle P6',
    subskill: 'deduction',
    gradeBand: ['P6'],
    topic: 'deduction',
    difficulty: 'expert',
    instructions: 'Enigmes de logique formelle avec propositions vraies et fausses. Defi champion !',
    hints: [
      'Traduis chaque indice en proposition logique (si... alors...).',
      'Utilise la contraposee pour deduire de nouvelles informations.'
    ]
  }),

  // --- RESOLUTION DE PROBLEMES ---
  createGeneratedLogiqueActivity({
    id: 'generated-logique-problemes-p2',
    slug: 'resolution-de-problemes-p2',
    title: 'Petits problemes P2',
    subskill: 'resolution-de-problemes',
    gradeBand: ['P2'],
    topic: 'resolution-de-problemes',
    difficulty: 'beginner',
    instructions: 'Resous ce petit probleme de la vie quotidienne etape par etape !',
    hints: [
      'Lis bien la question avant de commencer.',
      'Cherche les informations importantes dans l\'enonce.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-problemes-p3',
    slug: 'resolution-de-problemes-p3',
    title: 'Problemes ouverts P3',
    subskill: 'resolution-de-problemes',
    gradeBand: ['P3'],
    topic: 'resolution-de-problemes',
    difficulty: 'easy',
    instructions: 'Resous ce probleme en suivant les etapes : comprendre, chercher, calculer, verifier !',
    hints: [
      'Dessine ou ecris les informations connues.',
      'Verifie ta reponse en relisant l\'enonce.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-problemes-p4',
    slug: 'resolution-de-problemes-p4',
    title: 'Problemes a etapes P4',
    subskill: 'resolution-de-problemes',
    gradeBand: ['P4'],
    topic: 'resolution-de-problemes',
    difficulty: 'medium',
    instructions: 'Ces problemes se resolvent en plusieurs etapes. Organise-toi bien !',
    hints: [
      'Decompose le probleme en petites questions.',
      'Resous chaque etape avant de passer a la suivante.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-problemes-p5',
    slug: 'resolution-de-problemes-p5',
    title: 'Problemes complexes P5',
    subskill: 'resolution-de-problemes',
    gradeBand: ['P5'],
    topic: 'resolution-de-problemes',
    difficulty: 'hard',
    instructions: 'Ces problemes ouverts demandent creativite et methode. Plusieurs solutions possibles !',
    hints: [
      'Essaie plusieurs strategies differentes.',
      'Justifie ta demarche pour verifier que tu es sur la bonne voie.'
    ]
  }),
  createGeneratedLogiqueActivity({
    id: 'generated-logique-problemes-p6',
    slug: 'resolution-de-problemes-p6',
    title: 'Puzzles combinatoires P6',
    subskill: 'resolution-de-problemes',
    gradeBand: ['P6'],
    topic: 'resolution-de-problemes',
    difficulty: 'expert',
    instructions: 'Puzzles logiques avances combinant deduction, calcul et strategie. Defi ultime !',
    hints: [
      'Commence par etablir toutes les contraintes du probleme.',
      'Utilise une approche systematique : essai, erreur, correction.'
    ]
  })
];
