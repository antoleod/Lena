const originRepo = 'generator-engine';

function createGeneratedFinanceActivity({
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
    subject: 'finance',
    subskill,
    gradeBand,
    language: 'fr',
    difficulty: 'progressive',
    estimatedDurationMin: 10,
    instructions,
    correctionType: 'multiple-choice',
    hints,
    tags: ['generation', subskill, topic],
    accessibility: ['une tache a la fois', 'contexte du quotidien'],
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
          title: 'Entrainement financier',
          kind: 'practice',
          description: 'Pratique 10 exercices sur l\'argent et les achats.',
          count: 10
        },
        {
          id: 'exam',
          title: 'Mini defi financier',
          kind: 'exam',
          description: '4 exercices pour valider tes connaissances financieres.',
          count: 4
        }
      ]
    }
  };
}

export const financeSubjectMeta = {
  id: 'finance',
  name: 'Education Financiere',
  description: 'Pieces, billets, achats, monnaie, budget et epargne pour les jeunes citoyens.',
  icon: '💰',
  color: '#10b981',
  gradient: 'linear-gradient(135deg, #10b981 0%, #f59e0b 100%)',
  particle: '💰',
  grades: ['P2', 'P3', 'P4', 'P5', 'P6']
};

export const financeActivities = [
  // --- RECONNAITRE LES PIECES ---
  createGeneratedFinanceActivity({
    id: 'generated-finance-pieces-p2',
    slug: 'reconnaitre-pieces-p2',
    title: 'Les pieces en euros P2',
    subskill: 'reconnaitre-les-pieces',
    gradeBand: ['P2'],
    topic: 'reconnaitre-les-pieces',
    difficulty: 'beginner',
    instructions: 'Reconnais les pieces en euros et compte leur valeur totale !',
    hints: [
      'Les pieces les plus petites valent 1 centime, les plus grandes 2 euros.',
      'Commence par les pieces de plus grande valeur pour compter plus vite.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-pieces-p3',
    slug: 'reconnaitre-pieces-p3',
    title: 'Les pieces en euros P3',
    subskill: 'reconnaitre-les-pieces',
    gradeBand: ['P3'],
    topic: 'reconnaitre-les-pieces',
    difficulty: 'easy',
    instructions: 'Additionne ces pieces pour trouver la somme exacte !',
    hints: [
      'Commence par les pieces de 1 euro et 2 euros.',
      'Groupe les centimes pour obtenir des euros complets.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-pieces-p4',
    slug: 'reconnaitre-pieces-p4',
    title: 'Compter les pieces P4',
    subskill: 'reconnaitre-les-pieces',
    gradeBand: ['P4'],
    topic: 'reconnaitre-les-pieces',
    difficulty: 'medium',
    instructions: 'Trouve la combinaison de pieces qui forme exactement le montant demande !',
    hints: [
      'Cherche d\'abord combien d\'euros entiers tu peux former.',
      'Utilise le moins de pieces possible.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-pieces-p5',
    slug: 'reconnaitre-pieces-p5',
    title: 'Optimiser les pieces P5',
    subskill: 'reconnaitre-les-pieces',
    gradeBand: ['P5'],
    topic: 'reconnaitre-les-pieces',
    difficulty: 'hard',
    instructions: 'Trouve la combinaison de pieces la plus efficace pour payer !',
    hints: [
      'Cherche la combinaison avec le moins de pieces possible.',
      'Commence par la piece de plus grande valeur inferieure ou egale au montant.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-pieces-p6',
    slug: 'reconnaitre-pieces-p6',
    title: 'Problemes avec pieces P6',
    subskill: 'reconnaitre-les-pieces',
    gradeBand: ['P6'],
    topic: 'reconnaitre-les-pieces',
    difficulty: 'expert',
    instructions: 'Resous ces problemes complexes impliquant differentes combinaisons de pieces !',
    hints: [
      'Represente le probleme sous forme de tableau.',
      'Verifie que le total correspond exactement au montant attendu.'
    ]
  }),

  // --- RECONNAITRE LES BILLETS ---
  createGeneratedFinanceActivity({
    id: 'generated-finance-billets-p2',
    slug: 'reconnaitre-billets-p2',
    title: 'Les billets en euros P2',
    subskill: 'reconnaitre-les-billets',
    gradeBand: ['P2'],
    topic: 'reconnaitre-les-billets',
    difficulty: 'beginner',
    instructions: 'Reconnais les billets en euros et dis combien ils valent !',
    hints: [
      'Le plus petit billet vaut 5 euros, le plus courant 10 ou 20 euros.',
      'La couleur du billet t\'aide a l\'identifier.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-billets-p3',
    slug: 'reconnaitre-billets-p3',
    title: 'Additionner les billets P3',
    subskill: 'reconnaitre-les-billets',
    gradeBand: ['P3'],
    topic: 'reconnaitre-les-billets',
    difficulty: 'easy',
    instructions: 'Additionne ces billets pour trouver le total dans le portefeuille !',
    hints: [
      'Commence par additionner les plus grands billets.',
      'Verifie ton calcul en recomptant depuis le debut.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-billets-p4',
    slug: 'reconnaitre-billets-p4',
    title: 'Billets et pieces P4',
    subskill: 'reconnaitre-les-billets',
    gradeBand: ['P4'],
    topic: 'reconnaitre-les-billets',
    difficulty: 'medium',
    instructions: 'Combine billets et pieces pour atteindre exactement le montant indique !',
    hints: [
      'Commence par choisir les billets puis complete avec les pieces.',
      'Verifie que tu n\'as pas trop ou pas assez.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-billets-p5',
    slug: 'reconnaitre-billets-p5',
    title: 'Gerer un portefeuille P5',
    subskill: 'reconnaitre-les-billets',
    gradeBand: ['P5'],
    topic: 'reconnaitre-les-billets',
    difficulty: 'hard',
    instructions: 'Gere le contenu d\'un portefeuille pour regler plusieurs achats !',
    hints: [
      'Calcule le total de tes achats avant de payer.',
      'Verifie si tu as assez et combien il te reste.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-billets-p6',
    slug: 'reconnaitre-billets-p6',
    title: 'Billet optimal P6',
    subskill: 'reconnaitre-les-billets',
    gradeBand: ['P6'],
    topic: 'reconnaitre-les-billets',
    difficulty: 'expert',
    instructions: 'Choisis la meilleure combinaison de billets et pieces pour minimiser le rendu de monnaie !',
    hints: [
      'Cherche une somme proche du montant exact.',
      'Considere les combinaisons qui minimisent le nombre de billets et pieces echanges.'
    ]
  }),

  // --- CALCULER UN ACHAT ---
  createGeneratedFinanceActivity({
    id: 'generated-finance-achat-p2',
    slug: 'calculer-achat-p2',
    title: 'Calculer un achat P2',
    subskill: 'calculer-un-achat',
    gradeBand: ['P2'],
    topic: 'calculer-un-achat',
    difficulty: 'beginner',
    instructions: 'Combien ca coute en tout ? Additionne les prix de ces articles !',
    hints: [
      'Additionne les prix un par un.',
      'Commence par les euros, puis les centimes.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-achat-p3',
    slug: 'calculer-achat-p3',
    title: 'Faire les courses P3',
    subskill: 'calculer-un-achat',
    gradeBand: ['P3'],
    topic: 'calculer-un-achat',
    difficulty: 'easy',
    instructions: 'Calcule le total de ton panier de courses !',
    hints: [
      'Additionne d\'abord les euros, puis les centimes.',
      'N\'oublie pas de convertir les centimes en euros quand tu en as plus de 100.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-achat-p4',
    slug: 'calculer-achat-p4',
    title: 'Budget de courses P4',
    subskill: 'calculer-un-achat',
    gradeBand: ['P4'],
    topic: 'calculer-un-achat',
    difficulty: 'medium',
    instructions: 'Tu as un budget limite ! Verifie si tu peux tout acheter.',
    hints: [
      'Calcule le total avant de verifier le budget.',
      'Si le total depasse le budget, cherche quel article enlever.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-achat-p5',
    slug: 'calculer-achat-p5',
    title: 'Achats avec reductions P5',
    subskill: 'calculer-un-achat',
    gradeBand: ['P5'],
    topic: 'calculer-un-achat',
    difficulty: 'hard',
    instructions: 'Ces articles ont des promotions ! Calcule le prix reduit a payer.',
    hints: [
      '10% de reduction = prix divise par 10.',
      '50% de reduction = prix divise par 2.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-achat-p6',
    slug: 'calculer-achat-p6',
    title: 'Achats et TVA P6',
    subskill: 'calculer-un-achat',
    gradeBand: ['P6'],
    topic: 'calculer-un-achat',
    difficulty: 'expert',
    instructions: 'Calcule le prix final en tenant compte des taxes et remises !',
    hints: [
      'Applique d\'abord la remise, puis ajoute les taxes.',
      'La TVA s\'applique sur le prix hors taxes.'
    ]
  }),

  // --- RENDRE LA MONNAIE ---
  createGeneratedFinanceActivity({
    id: 'generated-finance-monnaie-p2',
    slug: 'rendre-monnaie-p2',
    title: 'Rendre la monnaie P2',
    subskill: 'rendre-la-monnaie',
    gradeBand: ['P2'],
    topic: 'rendre-la-monnaie',
    difficulty: 'beginner',
    instructions: 'Combien doit-on te rendre ? Calcule la monnaie !',
    hints: [
      'Monnaie = somme donnee - prix a payer.',
      'Compte depuis le prix jusqu\'a la somme donnee.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-monnaie-p3',
    slug: 'rendre-monnaie-p3',
    title: 'Rendre la monnaie P3',
    subskill: 'rendre-la-monnaie',
    gradeBand: ['P3'],
    topic: 'rendre-la-monnaie',
    difficulty: 'easy',
    instructions: 'Le caissier te rend la monnaie. Verifie si c\'est le bon montant !',
    hints: [
      'Calcule ce que tu devrais recevoir puis compare.',
      'Compte en avancant depuis le prix paye jusqu\'a la somme donnee.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-monnaie-p4',
    slug: 'rendre-monnaie-p4',
    title: 'Rendre la monnaie exacte P4',
    subskill: 'rendre-la-monnaie',
    gradeBand: ['P4'],
    topic: 'rendre-la-monnaie',
    difficulty: 'medium',
    instructions: 'Choisis les bonnes pieces et billets pour rendre la monnaie exacte !',
    hints: [
      'Commence par les plus grands billets ou pieces.',
      'Utilise le moins de pieces possibles.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-monnaie-p5',
    slug: 'rendre-monnaie-p5',
    title: 'Monnaie avec reductions P5',
    subskill: 'rendre-la-monnaie',
    gradeBand: ['P5'],
    topic: 'rendre-la-monnaie',
    difficulty: 'hard',
    instructions: 'Apres une promotion, calcule le nouveau montant a payer et la monnaie a rendre !',
    hints: [
      'Calcule d\'abord le prix apres reduction.',
      'Puis calcule la monnaie sur ce nouveau prix.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-monnaie-p6',
    slug: 'rendre-monnaie-p6',
    title: 'Transactions complexes P6',
    subskill: 'rendre-la-monnaie',
    gradeBand: ['P6'],
    topic: 'rendre-la-monnaie',
    difficulty: 'expert',
    instructions: 'Gere plusieurs transactions a la suite et calcule la monnaie optimale !',
    hints: [
      'Note chaque transaction pour ne pas te perdre.',
      'Cherche la combinaison de pieces et billets la plus pratique.'
    ]
  }),

  // --- PETIT COMMERCANT ---
  createGeneratedFinanceActivity({
    id: 'generated-finance-commercant-p2',
    slug: 'petit-commercant-p2',
    title: 'Je joue au commercant P2',
    subskill: 'petit-commercant',
    gradeBand: ['P2'],
    topic: 'petit-commercant',
    difficulty: 'beginner',
    instructions: 'Tu es commercant pour un jour ! Aide ton client a regler ses achats.',
    hints: [
      'Calcule le total de la commande.',
      'N\'oublie pas de rendre la monnaie si necessaire.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-commercant-p3',
    slug: 'petit-commercant-p3',
    title: 'Ma petite boutique P3',
    subskill: 'petit-commercant',
    gradeBand: ['P3'],
    topic: 'petit-commercant',
    difficulty: 'easy',
    instructions: 'Sers tes clients et gere ta caisse correctement !',
    hints: [
      'Additionne les articles commandes.',
      'Verifie que la monnaie rendue est correcte.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-commercant-p4',
    slug: 'petit-commercant-p4',
    title: 'Simuler une vente P4',
    subskill: 'petit-commercant',
    gradeBand: ['P4'],
    topic: 'petit-commercant',
    difficulty: 'medium',
    instructions: 'Gere ta boutique : ventes, monnaie et recettes de la journee !',
    hints: [
      'Note le total de chaque vente.',
      'Additionne toutes les ventes pour calculer la recette.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-commercant-p5',
    slug: 'petit-commercant-p5',
    title: 'Gerer une boutique P5',
    subskill: 'petit-commercant',
    gradeBand: ['P5'],
    topic: 'petit-commercant',
    difficulty: 'hard',
    instructions: 'Gere les prix, les promotions et les recettes de ta boutique !',
    hints: [
      'Calcule les prix apres promotion avant de servir les clients.',
      'Tiens un bilan de tes recettes pour la journee.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-commercant-p6',
    slug: 'petit-commercant-p6',
    title: 'Bilan commercial P6',
    subskill: 'petit-commercant',
    gradeBand: ['P6'],
    topic: 'petit-commercant',
    difficulty: 'expert',
    instructions: 'Analyse les ventes de ta boutique et calcule le benefice net !',
    hints: [
      'Benefice = recettes - couts.',
      'Pense a soustraire le cout d\'achat des marchandises.'
    ]
  }),

  // --- BUDGET SIMPLE ---
  createGeneratedFinanceActivity({
    id: 'generated-finance-budget-p2',
    slug: 'budget-simple-p2',
    title: 'Mon argent de poche P2',
    subskill: 'budget-simple',
    gradeBand: ['P2'],
    topic: 'budget-simple',
    difficulty: 'beginner',
    instructions: 'Tu as de l\'argent de poche ! Decide comment le depenser sagement.',
    hints: [
      'Ne depense pas plus que ce que tu as.',
      'Additionne tes achats pour verifier ton solde.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-budget-p3',
    slug: 'budget-simple-p3',
    title: 'Budget de la semaine P3',
    subskill: 'budget-simple',
    gradeBand: ['P3'],
    topic: 'budget-simple',
    difficulty: 'easy',
    instructions: 'Repartis ton budget de la semaine entre tes differentes depenses !',
    hints: [
      'Commence par les depenses obligatoires.',
      'Verifie qu\'il te reste quelque chose pour les imprévus.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-budget-p4',
    slug: 'budget-simple-p4',
    title: 'Budget familial P4',
    subskill: 'budget-simple',
    gradeBand: ['P4'],
    topic: 'budget-simple',
    difficulty: 'medium',
    instructions: 'Aide la famille a repartir son budget entre alimentation, loyer et loisirs !',
    hints: [
      'Classe les depenses par ordre de priorite.',
      'Verifie que le total ne depasse pas les revenus.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-budget-p5',
    slug: 'budget-simple-p5',
    title: 'Budget avec pourcentages P5',
    subskill: 'budget-simple',
    gradeBand: ['P5'],
    topic: 'budget-simple',
    difficulty: 'hard',
    instructions: 'Repartis le budget selon des pourcentages : 50% nourriture, 30% loisirs, 20% epargne !',
    hints: [
      '10% d\'un nombre = ce nombre divise par 10.',
      'Calcule chaque pourcentage separement puis verifie le total.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-budget-p6',
    slug: 'budget-simple-p6',
    title: 'Budget mensuel P6',
    subskill: 'budget-simple',
    gradeBand: ['P6'],
    topic: 'budget-simple',
    difficulty: 'expert',
    instructions: 'Planifie un budget mensuel complet avec recettes, depenses fixes et variables !',
    hints: [
      'Distingue les depenses fixes (loyer, abonnements) des depenses variables.',
      'Prevois une reserve pour les imprévus.'
    ]
  }),

  // --- ECONOMISER ---
  createGeneratedFinanceActivity({
    id: 'generated-finance-epargne-p2',
    slug: 'economiser-p2',
    title: 'Ma tirelire P2',
    subskill: 'economiser',
    gradeBand: ['P2'],
    topic: 'economiser',
    difficulty: 'beginner',
    instructions: 'Tu mets de l\'argent dans ta tirelire chaque semaine. Combien auras-tu apres ?',
    hints: [
      'Additionne les sommes mises de cote chaque semaine.',
      'Combien de semaines faudra-t-il pour atteindre ton objectif ?'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-epargne-p3',
    slug: 'economiser-p3',
    title: 'Objectif jouet P3',
    subskill: 'economiser',
    gradeBand: ['P3'],
    topic: 'economiser',
    difficulty: 'easy',
    instructions: 'Combien de semaines faut-il economiser pour acheter ce jouet ?',
    hints: [
      'Divise le prix du jouet par la somme economisee chaque semaine.',
      'Arrondi au nombre entier de semaines superieur.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-epargne-p4',
    slug: 'economiser-p4',
    title: 'Plan d\'epargne P4',
    subskill: 'economiser',
    gradeBand: ['P4'],
    topic: 'economiser',
    difficulty: 'medium',
    instructions: 'Cree un plan d\'epargne sur 4 semaines pour realiser ton projet !',
    hints: [
      'Calcule combien tu dois mettre de cote chaque semaine.',
      'Tiens compte de ce que tu depenses en plus.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-epargne-p5',
    slug: 'economiser-p5',
    title: 'Epargne et interets P5',
    subskill: 'economiser',
    gradeBand: ['P5'],
    topic: 'economiser',
    difficulty: 'hard',
    instructions: 'Si tu places ton argent a la banque, il grossit ! Calcule les interets simples.',
    hints: [
      'Interets = capital x taux (%) / 100.',
      '5% de 100 euros = 5 euros d\'interets par an.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-epargne-p6',
    slug: 'economiser-p6',
    title: 'Investissement de base P6',
    subskill: 'economiser',
    gradeBand: ['P6'],
    topic: 'economiser',
    difficulty: 'expert',
    instructions: 'Compare differentes options d\'epargne et choisis la plus avantageuse !',
    hints: [
      'Calcule les interets produits par chaque option.',
      'Tiens compte de la duree de placement pour comparer.'
    ]
  }),

  // --- DEFIS DU QUOTIDIEN ---
  createGeneratedFinanceActivity({
    id: 'generated-finance-defis-p2',
    slug: 'defis-quotidien-p2',
    title: 'Defis du quotidien P2',
    subskill: 'defis-du-quotidien',
    gradeBand: ['P2'],
    topic: 'defis-du-quotidien',
    difficulty: 'beginner',
    instructions: 'Resous ces petits problemes de la vie reelle avec l\'argent !',
    hints: [
      'Lis bien la situation et repere les sommes importantes.',
      'Decide s\'il faut additionner ou soustraire.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-defis-p3',
    slug: 'defis-quotidien-p3',
    title: 'Defis du quotidien P3',
    subskill: 'defis-du-quotidien',
    gradeBand: ['P3'],
    topic: 'defis-du-quotidien',
    difficulty: 'easy',
    instructions: 'Resous ces situations de la vie courante qui font appel a tes connaissances financieres !',
    hints: [
      'Identifie ce que tu dois calculer.',
      'Utilise les strategies que tu connais : compter, additionner, rendre la monnaie.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-defis-p4',
    slug: 'defis-quotidien-p4',
    title: 'Defis du quotidien P4',
    subskill: 'defis-du-quotidien',
    gradeBand: ['P4'],
    topic: 'defis-du-quotidien',
    difficulty: 'medium',
    instructions: 'Ces defis melangent achats, monnaie et budget. Es-tu pret ?',
    hints: [
      'Decompose le probleme en etapes simples.',
      'Verifie ta reponse en relisant l\'enonce.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-defis-p5',
    slug: 'defis-quotidien-p5',
    title: 'Defis du quotidien P5',
    subskill: 'defis-du-quotidien',
    gradeBand: ['P5'],
    topic: 'defis-du-quotidien',
    difficulty: 'hard',
    instructions: 'Des situations reelles complexes : promotions, budgets, comparaisons de prix !',
    hints: [
      'Calcule toujours le prix unitaire pour comparer.',
      'Represente le probleme avec un schema ou un tableau.'
    ]
  }),
  createGeneratedFinanceActivity({
    id: 'generated-finance-defis-p6',
    slug: 'defis-quotidien-p6',
    title: 'Defis du quotidien P6',
    subskill: 'defis-du-quotidien',
    gradeBand: ['P6'],
    topic: 'defis-du-quotidien',
    difficulty: 'expert',
    instructions: 'Defi ultime : problemes financiers complexes de la vie reelle a resoudre en equipe !',
    hints: [
      'Identifie toutes les variables du probleme.',
      'Utilise un tableau ou un schema pour organiser les informations.'
    ]
  })
];
