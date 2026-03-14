const originRepo = 'generator-engine';

function createGeneratedFrenchActivity({
  id,
  slug,
  title,
  subskill,
  topic,
  gradeBand,
  instructions,
  hints,
  featured = false
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
    subject: 'french',
    subskill,
    gradeBand,
    language: 'fr',
    difficulty: 'progressive',
    estimatedDurationMin: 9,
    instructions,
    correctionType: 'multiple-choice',
    hints,
    tags: ['generation', subskill, topic],
    accessibility: ['texte court', 'choix limites'],
    originRepo,
    engineType: 'multiple-choice',
    featured,
    generatorConfig: {
      grade: generatorGrade,
      topic,
      language: 'fr',
      difficulty: 'adaptive',
      sections: [
        { id: 'practice', title: 'Lecture ou langage', kind: 'practice', description: '10 exercices generes selon le niveau.', count: 10 },
        { id: 'exam', title: 'Mini examen', kind: 'exam', description: '4 nouvelles questions pour verifier la notion.', count: 4 }
      ]
    }
  };
}

export const generatedFrenchActivities = [
  createGeneratedFrenchActivity({
    id: 'generated-french-reading',
    slug: 'lecture-comprehension-dynamique-fr',
    title: 'Lecture et comprehension',
    subskill: 'reading-comprehension',
    topic: 'reading-comprehension',
    gradeBand: ['P2', 'P3'],
    instructions: 'De petits textes et de nouvelles questions a chaque partie.',
    hints: ['Relis les phrases avant de repondre.'],
    featured: true
  }),
  createGeneratedFrenchActivity({
    id: 'generated-french-reading-p2',
    slug: 'lecture-comprehension-fr-p2',
    title: 'Lecture guidee P2',
    subskill: 'reading-comprehension',
    topic: 'reading-comprehension',
    gradeBand: ['P2'],
    instructions: 'Textes tres courts, questions directes et reperes simples.',
    hints: ['Cherche la phrase qui donne la reponse.']
  }),
  createGeneratedFrenchActivity({
    id: 'generated-french-reading-p3-base',
    slug: 'lecture-comprehension-fr-p3',
    title: 'Lecture active P3',
    subskill: 'reading-comprehension',
    topic: 'reading-comprehension',
    gradeBand: ['P3'],
    instructions: 'Textes plus riches avec informations a retrouver et verifier.',
    hints: ['Relis tout le texte avant de choisir.']
  }),
  createGeneratedFrenchActivity({
    id: 'generated-french-sentences',
    slug: 'phrases-dynamiques-fr',
    title: 'Phrases a completer',
    subskill: 'sentence-building',
    topic: 'sentence-completion',
    gradeBand: ['P2', 'P3'],
    instructions: 'Le systeme cree de nouvelles phrases a completer.',
    hints: ['Cherche le mot qui donne du sens a la phrase.']
  }),
  createGeneratedFrenchActivity({
    id: 'generated-french-sentences-p2',
    slug: 'phrases-dynamiques-fr-p2',
    title: 'Phrases simples P2',
    subskill: 'sentence-building',
    topic: 'sentence-completion',
    gradeBand: ['P2'],
    instructions: 'Completer des phrases tres courtes avec le bon mot.',
    hints: ['Lis toute la phrase avant de choisir.']
  }),
  createGeneratedFrenchActivity({
    id: 'generated-french-sentences-p3-base',
    slug: 'phrases-dynamiques-fr-p3',
    title: 'Phrases et structure P3',
    subskill: 'sentence-building',
    topic: 'sentence-completion',
    gradeBand: ['P3'],
    instructions: 'Completer des phrases plus longues et reperer la bonne structure.',
    hints: ['Cherche le mot qui garde la phrase correcte.']
  }),
  createGeneratedFrenchActivity({
    id: 'generated-french-vocabulary',
    slug: 'vocabulaire-dynamique-fr',
    title: 'Vocabulaire du quotidien',
    subskill: 'vocabulary',
    topic: 'vocabulary',
    gradeBand: ['P2', 'P3'],
    instructions: 'Retrouve des mots simples et leurs bons indices.',
    hints: ['Lis toutes les reponses avant de choisir.']
  }),
  createGeneratedFrenchActivity({
    id: 'generated-french-vocabulary-p2',
    slug: 'vocabulaire-dynamique-fr-p2',
    title: 'Vocabulaire de base P2',
    subskill: 'vocabulary',
    topic: 'vocabulary',
    gradeBand: ['P2'],
    instructions: 'Mots du quotidien, categories simples et indices visuels.',
    hints: ['Observe l image ou la categorie avant de repondre.']
  }),
  createGeneratedFrenchActivity({
    id: 'generated-french-vocabulary-p3',
    slug: 'vocabulaire-dynamique-fr-p3',
    title: 'Vocabulaire et categories P3',
    subskill: 'vocabulary',
    topic: 'vocabulary',
    gradeBand: ['P3'],
    instructions: 'Vocabulaire plus precis, categories et tri de mots.',
    hints: ['Cherche d abord ce que les mots ont en commun.']
  }),
  createGeneratedFrenchActivity({
    id: 'generated-french-grammar-p3',
    slug: 'grammaire-dynamique-fr-p3',
    title: 'Grammaire et accords',
    subskill: 'grammar',
    topic: 'sentence-completion',
    gradeBand: ['P3'],
    instructions: 'Accords, nature des mots et phrases utiles.',
    hints: ['Observe la phrase complete avant de choisir.']
  }),
  createGeneratedFrenchActivity({
    id: 'generated-french-word-order-p3',
    slug: 'ordre-des-mots-fr-p3',
    title: 'Ordre des mots P3',
    subskill: 'sentence-building',
    topic: 'sentence-completion',
    gradeBand: ['P3'],
    instructions: 'Reperer l ordre correct des mots dans une phrase simple.',
    hints: ['Commence par le groupe qui peut ouvrir la phrase.']
  }),
  createGeneratedFrenchActivity({
    id: 'generated-french-reading-p4',
    slug: 'lecture-comprehension-dynamique-fr-p4',
    title: 'Lecture active',
    subskill: 'reading-comprehension',
    topic: 'reading-comprehension',
    gradeBand: ['P4', 'P5'],
    instructions: 'Textes courts, indices explicites et implicites.',
    hints: ['Repere ce qui est dit clairement et ce qui doit etre deduit.']
  }),
  createGeneratedFrenchActivity({
    id: 'generated-french-language-p6',
    slug: 'langage-dynamique-fr-p6',
    title: 'Langue et grammaire',
    subskill: 'grammar',
    topic: 'sentence-completion',
    gradeBand: ['P6'],
    instructions: 'Phrases plus riches avec accords et structure.',
    hints: ['Observe le sens global de la phrase avant de choisir.']
  })
];
