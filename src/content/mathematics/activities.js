function buildSections(practice, exam, practiceTitle = 'Pratique guidée', examTitle = 'Mini examen') {
  return [
    {
      id: 'practice',
      title: practiceTitle,
      kind: 'practice',
      description: 'On apprend d’abord avec des exemples clairs et du rythme.',
      lessons: practice
    },
    {
      id: 'exam',
      title: examTitle,
      kind: 'exam',
      description: 'Petit défi final pour vérifier que la notion est bien comprise.',
      lessons: exam
    }
  ];
}

export const mathematicsSubject = {
  id: 'mathematics',
  label: 'Mathématiques',
  description: 'Numération, opérations, logique, calcul mental et problèmes pour 2e et 3e primaire.',
  color: '#ff8a5b',
  accent: '#ffe1cf',
  grades: ['P2', 'P3'],
  roadmap: [
    'Nombres et valeur de position',
    'Additions et soustractions',
    'Multiplication et division',
    'Problèmes et raisonnement'
  ]
};

export const mathematicsActivities = [
  {
    id: 'build-number',
    slug: 'construire-des-nombres',
    title: 'Construire des nombres',
    subject: 'mathematics',
    subskill: 'place-value',
    gradeBand: ['P2'],
    language: 'fr',
    difficulty: 'guided',
    estimatedDurationMin: 8,
    instructions: 'Compose le nombre demandé avec des dizaines et des unités.',
    correctionType: 'exact-match',
    hints: ['Compte les dizaines avant les unités.'],
    tags: ['nombres', 'base-10', 'manipulation'],
    accessibility: ['feedback visuel fort', 'grandes zones tactiles'],
    originRepo: 'Lena',
    engineType: 'base-ten',
    featured: true,
    levels: [
      { target: 14, hint: '1 dizaine et 4 unités.' },
      { target: 26, hint: '2 dizaines et 6 unités.' },
      { target: 38, hint: '3 dizaines et 8 unités.' },
      { target: 42, hint: '4 dizaines et 2 unités.' },
      { target: 57, hint: '5 dizaines et 7 unités.' }
    ]
  },
  {
    id: 'place-value',
    slug: 'valeur-de-position',
    title: 'Valeur de position',
    subject: 'mathematics',
    subskill: 'place-value',
    gradeBand: ['P2', 'P3'],
    language: 'fr',
    difficulty: 'progressive',
    estimatedDurationMin: 10,
    instructions: 'Travaille d’abord la décomposition, puis termine avec un mini examen.',
    correctionType: 'multiple-choice',
    hints: ['Observe le chiffre des dizaines et celui des unités.'],
    tags: ['numération', 'décomposition'],
    accessibility: ['contraste élevé'],
    originRepo: 'Lena',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Quel est le bon découpage pour 34 ?', choices: ['3 dizaines et 4 unités', '4 dizaines et 3 unités', '34 unités et 0 dizaine'], answer: '3 dizaines et 4 unités', explanation: '34 = 30 + 4.' },
        { prompt: 'Quel nombre est formé par 5 dizaines et 2 unités ?', choices: ['25', '52', '502'], answer: '52', explanation: '5 dizaines donnent 50, puis on ajoute 2.' },
        { prompt: 'Dans 68, quelle est la valeur du 6 ?', choices: ['6', '60', '600'], answer: '60', explanation: 'Le 6 est à la place des dizaines.' },
        { prompt: 'Choisis la bonne décomposition de 91.', choices: ['9 dizaines et 1 unité', '1 dizaine et 9 unités', '91 dizaines'], answer: '9 dizaines et 1 unité', explanation: '91 = 90 + 1.' },
        { prompt: 'Quel nombre correspond à 7 dizaines et 4 unités ?', choices: ['47', '74', '704'], answer: '74', explanation: '7 dizaines donnent 70.' },
        { prompt: 'Dans 53, quelle est la valeur du 3 ?', choices: ['3', '30', '300'], answer: '3', explanation: 'Le 3 est à la place des unités.' }
      ],
      [
        { prompt: 'Quel nombre est formé par 8 dizaines et 6 unités ?', choices: ['68', '86', '806'], answer: '86', explanation: '8 dizaines et 6 unités donnent 86.' },
        { prompt: 'Dans 47, quelle est la valeur du 4 ?', choices: ['4', '40', '400'], answer: '40', explanation: 'Le 4 vaut 40.' },
        { prompt: 'Choisis la bonne décomposition de 63.', choices: ['6 dizaines et 3 unités', '3 dizaines et 6 unités', '63 dizaines'], answer: '6 dizaines et 3 unités', explanation: '63 = 60 + 3.' }
      ],
      'Atelier de décomposition',
      'Mini examen de valeur de position'
    )
  },
  {
    id: 'number-line',
    slug: 'ligne-numerique',
    title: 'Ligne numérique',
    subject: 'mathematics',
    subskill: 'mental-calculation',
    gradeBand: ['P2'],
    language: 'fr',
    difficulty: 'guided',
    estimatedDurationMin: 8,
    instructions: 'Avance ou recule sur la ligne numérique avant de passer au mini examen.',
    correctionType: 'multiple-choice',
    hints: ['Compte les bonds un à un.'],
    tags: ['addition', 'soustraction', 'repérage'],
    accessibility: ['consigne courte'],
    originRepo: 'Lena',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Tu pars de 18. Tu avances de 5. Où arrives-tu ?', choices: ['22', '23', '24'], answer: '23', explanation: '18 + 5 = 23.' },
        { prompt: 'Tu pars de 31. Tu recules de 7. Où arrives-tu ?', choices: ['22', '24', '26'], answer: '24', explanation: '31 - 7 = 24.' },
        { prompt: 'Tu pars de 45. Tu avances de 10. Où arrives-tu ?', choices: ['50', '55', '65'], answer: '55', explanation: 'Ajouter 10 change les dizaines.' },
        { prompt: 'Tu pars de 27. Tu avances de 2. Où arrives-tu ?', choices: ['28', '29', '30'], answer: '29', explanation: '27 + 2 = 29.' },
        { prompt: 'Tu pars de 52. Tu recules de 10. Où arrives-tu ?', choices: ['42', '41', '32'], answer: '42', explanation: '52 - 10 = 42.' },
        { prompt: 'Tu pars de 40. Tu avances de 8. Où arrives-tu ?', choices: ['48', '46', '50'], answer: '48', explanation: '40 + 8 = 48.' }
      ],
      [
        { prompt: 'Tu pars de 64. Tu recules de 6. Où arrives-tu ?', choices: ['58', '57', '56'], answer: '58', explanation: '64 - 6 = 58.' },
        { prompt: 'Tu pars de 39. Tu avances de 4. Où arrives-tu ?', choices: ['42', '43', '44'], answer: '43', explanation: '39 + 4 = 43.' },
        { prompt: 'Tu pars de 70. Tu recules de 20. Où arrives-tu ?', choices: ['60', '50', '40'], answer: '50', explanation: '70 - 20 = 50.' }
      ],
      'Promenade sur la ligne',
      'Mini examen de ligne numérique'
    )
  },
  {
    id: 'multiplication-table-2',
    slug: 'table-de-2',
    title: 'Table de multiplication du 2',
    subject: 'mathematics',
    subskill: 'multiplication',
    gradeBand: ['P2', 'P3'],
    language: 'fr',
    difficulty: 'progressive',
    estimatedDurationMin: 12,
    instructions: 'Commence par 10 exercices de la table du 2, puis passe au mini examen.',
    correctionType: 'multiple-choice',
    hints: ['La table du 2 avance de 2 en 2.'],
    tags: ['multiplication', 'table de 2', 'automatismes'],
    accessibility: ['une seule consigne à la fois'],
    originRepo: 'Lena+Val',
    engineType: 'multiple-choice',
    featured: true,
    sections: buildSections(
      [
        { prompt: 'Combien font 2 × 1 ?', choices: ['2', '1', '3'], answer: '2', explanation: '2 × 1 = 2.' },
        { prompt: 'Combien font 2 × 2 ?', choices: ['2', '4', '6'], answer: '4', explanation: '2 × 2 = 4.' },
        { prompt: 'Combien font 2 × 3 ?', choices: ['5', '6', '8'], answer: '6', explanation: '2 × 3 = 6.' },
        { prompt: 'Combien font 2 × 4 ?', choices: ['6', '8', '10'], answer: '8', explanation: '2 × 4 = 8.' },
        { prompt: 'Combien font 2 × 5 ?', choices: ['10', '12', '8'], answer: '10', explanation: '2 × 5 = 10.' },
        { prompt: 'Combien font 2 × 6 ?', choices: ['14', '12', '10'], answer: '12', explanation: '2 × 6 = 12.' },
        { prompt: 'Combien font 2 × 7 ?', choices: ['12', '14', '16'], answer: '14', explanation: '2 × 7 = 14.' },
        { prompt: 'Combien font 2 × 8 ?', choices: ['18', '16', '14'], answer: '16', explanation: '2 × 8 = 16.' },
        { prompt: 'Combien font 2 × 9 ?', choices: ['18', '16', '20'], answer: '18', explanation: '2 × 9 = 18.' },
        { prompt: 'Combien font 2 × 10 ?', choices: ['18', '20', '22'], answer: '20', explanation: '2 × 10 = 20.' }
      ],
      [
        { prompt: 'Quel est le résultat de 2 × 4 ?', choices: ['8', '6', '10'], answer: '8', explanation: '2 × 4 = 8.' },
        { prompt: 'Quel est le résultat de 2 × 8 ?', choices: ['14', '16', '18'], answer: '16', explanation: '2 × 8 = 16.' },
        { prompt: 'Quel est le résultat de 2 × 7 ?', choices: ['12', '14', '18'], answer: '14', explanation: '2 × 7 = 14.' },
        { prompt: 'Si 2 × 5 = ?', choices: ['10', '12', '15'], answer: '10', explanation: '2 × 5 = 10.' }
      ],
      'Entraînement de la table du 2',
      'Mini examen de la table du 2'
    )
  },
  {
    id: 'word-problems',
    slug: 'problemes-quotidiens',
    title: 'Problèmes du quotidien',
    subject: 'mathematics',
    subskill: 'word-problems',
    gradeBand: ['P2', 'P3'],
    language: 'fr',
    difficulty: 'progressive',
    estimatedDurationMin: 12,
    instructions: 'Lis, réfléchis, choisis la bonne réponse, puis termine avec une mini évaluation.',
    correctionType: 'multiple-choice',
    hints: ['Cherche les mots qui montrent si on ajoute, retire, partage ou groupe.'],
    tags: ['raisonnement', 'lecture', 'problèmes'],
    accessibility: ['texte découpé', 'feedback simple'],
    originRepo: 'Lena+Val',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Léna a 18 autocollants. Elle en reçoit 7. Combien en a-t-elle maintenant ?', choices: ['25', '21', '27'], answer: '25', explanation: 'On ajoute 7 à 18.' },
        { prompt: 'Une classe a 6 rangées de 4 chaises. Combien y a-t-il de chaises ?', choices: ['24', '10', '20'], answer: '24', explanation: '6 groupes de 4 font 24.' },
        { prompt: '32 cartes sont partagées entre 4 enfants. Combien de cartes par enfant ?', choices: ['8', '7', '9'], answer: '8', explanation: '32 ÷ 4 = 8.' },
        { prompt: 'Le magasin a 54 crayons et en vend 19. Combien en reste-t-il ?', choices: ['35', '45', '37'], answer: '35', explanation: '54 - 19 = 35.' },
        { prompt: 'Il y a 5 paquets de 3 biscuits. Combien de biscuits ?', choices: ['8', '15', '12'], answer: '15', explanation: '5 × 3 = 15.' },
        { prompt: 'Léna lit 6 pages par jour pendant 4 jours. Combien de pages ?', choices: ['20', '24', '26'], answer: '24', explanation: '6 × 4 = 24.' }
      ],
      [
        { prompt: '24 billes sont partagées entre 3 enfants. Combien chacun reçoit-il ?', choices: ['6', '8', '9'], answer: '8', explanation: '24 ÷ 3 = 8.' },
        { prompt: 'Tom a 47 cartes et en perd 12. Combien lui reste-t-il ?', choices: ['35', '34', '36'], answer: '35', explanation: '47 - 12 = 35.' },
        { prompt: 'Il y a 9 boîtes de 2 feutres. Combien de feutres ?', choices: ['11', '18', '20'], answer: '18', explanation: '9 × 2 = 18.' }
      ],
      'Atelier de problèmes',
      'Mini examen de problèmes'
    )
  },
  {
    id: 'mult-div-families',
    slug: 'familles-multiplication-division',
    title: 'Familles multiplication-division',
    subject: 'mathematics',
    subskill: 'multiplication-division',
    gradeBand: ['P3'],
    language: 'fr',
    difficulty: 'building',
    estimatedDurationMin: 8,
    instructions: 'Retrouve les opérations qui appartiennent à la même famille, puis réussis le mini examen.',
    correctionType: 'multiple-choice',
    hints: ['La multiplication et la division racontent la même histoire.'],
    tags: ['tables', 'familles', 'liens'],
    accessibility: ['réponses courtes'],
    originRepo: 'Lena',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Quelle famille correspond à 4, 6 et 24 ?', choices: ['4 × 6 = 24, 24 ÷ 6 = 4, 24 ÷ 4 = 6', '4 + 6 = 10, 24 - 4 = 20, 24 - 6 = 18', '6 × 6 = 36, 24 ÷ 4 = 5, 24 ÷ 6 = 4'], answer: '4 × 6 = 24, 24 ÷ 6 = 4, 24 ÷ 4 = 6', explanation: 'Les trois opérations utilisent les mêmes nombres.' },
        { prompt: 'Quelle relation est correcte pour 7, 8 et 56 ?', choices: ['56 ÷ 7 = 8', '56 ÷ 8 = 9', '7 + 8 = 56'], answer: '56 ÷ 7 = 8', explanation: '56 se partage en 7 groupes de 8.' },
        { prompt: 'Quelle relation est correcte pour 3, 9 et 27 ?', choices: ['27 ÷ 3 = 9', '27 ÷ 9 = 2', '3 + 9 = 27'], answer: '27 ÷ 3 = 9', explanation: '27 ÷ 3 = 9.' },
        { prompt: 'Quelle famille va avec 5, 4 et 20 ?', choices: ['5 × 4 = 20, 20 ÷ 5 = 4, 20 ÷ 4 = 5', '5 + 4 = 20, 20 - 5 = 15, 20 - 4 = 16', '4 × 4 = 16, 20 ÷ 5 = 4, 20 ÷ 4 = 4'], answer: '5 × 4 = 20, 20 ÷ 5 = 4, 20 ÷ 4 = 5', explanation: 'C’est une vraie famille d’opérations.' }
      ],
      [
        { prompt: 'Pour 6, 7 et 42, quelle égalité est correcte ?', choices: ['42 ÷ 6 = 7', '42 ÷ 7 = 5', '6 + 7 = 42'], answer: '42 ÷ 6 = 7', explanation: '42 ÷ 6 = 7.' },
        { prompt: 'Quelle famille correspond à 8, 3 et 24 ?', choices: ['8 × 3 = 24, 24 ÷ 8 = 3, 24 ÷ 3 = 8', '8 × 8 = 64, 24 ÷ 3 = 8, 24 ÷ 8 = 4', '8 + 3 = 11, 24 - 8 = 16, 24 - 3 = 21'], answer: '8 × 3 = 24, 24 ÷ 8 = 3, 24 ÷ 3 = 8', explanation: 'La bonne famille garde les trois mêmes nombres.' }
      ],
      'Familles d’opérations',
      'Mini examen des familles'
    )
  }
];
