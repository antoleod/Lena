export const financeSubject = {
  id: 'finance',
  label: 'Éducation Financière',
  labelNl: 'Financiële Educatie',
  description: 'Reconnaître les pièces et billets, calculer des achats, rendre la monnaie et gérer un budget simple.',
  descriptionNl: 'Munten en biljetten herkennen, aankopen berekenen, wisselgeld geven en een eenvoudig budget beheren.',
  color: '#10b981',
  accent: '#d1fae5',
  grades: ['P2', 'P3', 'P4', 'P5', 'P6'],
  roadmap: [
    'Reconnaître les pièces et billets',
    'Calculer un achat',
    'Rendre la monnaie',
    'Gérer un budget'
  ],
  roadmapNl: [
    'Munten en biljetten herkennen',
    'Aankoop berekenen',
    'Wisselgeld geven',
    'Budget beheren'
  ]
};

const categories = [
  { slug: 'reconnaitre-les-pieces',  icon: '🪙', label: 'Reconnaître les pièces' },
  { slug: 'reconnaitre-les-billets', icon: '💵', label: 'Reconnaître les billets' },
  { slug: 'calculer-un-achat',       icon: '🛒', label: 'Calculer un achat' },
  { slug: 'rendre-la-monnaie',       icon: '💰', label: 'Rendre la monnaie' },
  { slug: 'petit-commercant',        icon: '🏪', label: 'Petit commerçant' },
  { slug: 'budget-simple',           icon: '📊', label: 'Budget simple' },
  { slug: 'economiser',              icon: '🏦', label: 'Économiser' },
  { slug: 'defis-du-quotidien',      icon: '🎯', label: 'Défis du quotidien' },
];

const grades = [
  { id: 'p2', label: 'CP',  difficulty: 'beginner',      band: 'P2' },
  { id: 'p3', label: 'CE1', difficulty: 'beginner',      band: 'P3' },
  { id: 'p4', label: 'CE2', difficulty: 'intermediate',  band: 'P4' },
  { id: 'p5', label: 'CM1', difficulty: 'intermediate',  band: 'P5' },
  { id: 'p6', label: 'CM2', difficulty: 'advanced',      band: 'P6' },
];

const instructions = {
  'reconnaitre-les-pieces':  'Observe les pièces et identifie leur valeur.',
  'reconnaitre-les-billets': 'Observe les billets et identifie leur valeur.',
  'calculer-un-achat':       'Calcule le prix total de tes achats.',
  'rendre-la-monnaie':       'Calcule combien de monnaie il faut rendre.',
  'petit-commercant':        'Tu es le commerçant : calcule les prix et la monnaie.',
  'budget-simple':           'Gère ton budget sans dépenser plus que tu n\'as.',
  'economiser':              'Trouve comment économiser pour atteindre ton objectif.',
  'defis-du-quotidien':      'Résous des situations de la vie réelle avec de l\'argent.',
};

const hints = {
  'reconnaitre-les-pieces':  ['Regarde bien la couleur et la taille de la pièce.', 'Le chiffre sur la pièce indique sa valeur.'],
  'reconnaitre-les-billets': ['Les billets ont des couleurs différentes selon leur valeur.', 'Le chiffre sur le billet indique combien il vaut.'],
  'calculer-un-achat':       ['Additionne tous les prix un par un.', 'Vérifie ton calcul en recomptant.'],
  'rendre-la-monnaie':       ['Calcule la différence entre ce qu\'on donne et le prix.', 'Tu peux utiliser des pièces et des billets.'],
  'petit-commercant':        ['Calcule d\'abord le total, puis la monnaie à rendre.', 'Pense à utiliser les pièces les plus simples.'],
  'budget-simple':           ['Note ce que tu dépenses pour ne pas oublier.', 'Vérifie que tu n\'as pas dépassé ton budget.'],
  'economiser':              ['Calcule combien il te manque pour ton objectif.', 'Pense à mettre de côté un peu chaque semaine.'],
  'defis-du-quotidien':      ['Lis bien le problème avant de calculer.', 'Dessine ou note les informations importantes.'],
};

export const financeActivities = categories.flatMap((cat) =>
  grades.map((grade) => ({
    id: `generated-finance-${cat.slug}-${grade.id}`,
    subjectId: 'finance',
    subject: 'finance',
    gradeId: grade.id,
    gradeBand: [grade.band],
    type: 'generated',
    engineType: 'multiple-choice',
    title: `${cat.label} - ${grade.label}`,
    description: `Exercices de ${cat.label.toLowerCase()} pour le niveau ${grade.label}.`,
    instructions: instructions[cat.slug],
    icon: cat.icon,
    color: '#10b981',
    difficulty: grade.difficulty,
    estimatedTime: 15,
    estimatedDurationMin: 8,
    language: 'fr',
    topic: cat.slug,
    hints: hints[cat.slug],
    tags: ['generation', 'finance', cat.slug],
    generatorConfig: {
      grade: grade.band,
      topic: cat.slug,
      language: 'fr',
      difficulty: 'adaptive',
      sections: [
        {
          id: 'practice',
          title: 'Atelier finance',
          kind: 'practice',
          description: 'Pratique 10 exercices sur la gestion de l\'argent.',
          count: 10
        },
        {
          id: 'exam',
          title: 'Mini examen finance',
          kind: 'exam',
          description: '4 exercices supplémentaires pour valider le module.',
          count: 4
        }
      ]
    }
  }))
);
