function buildSections(practice, exam, practiceTitle = 'Pratique guidee', examTitle = 'Mini examen') {
  return [
    {
      id: 'practice',
      title: practiceTitle,
      kind: 'practice',
      description: 'On apprend d abord avec des exemples clairs et du rythme.',
      lessons: practice
    },
    {
      id: 'exam',
      title: examTitle,
      kind: 'exam',
      description: 'Petit defi final pour verifier que la notion est bien comprise.',
      lessons: exam
    }
  ];
}

function createChoices(correct, extras) {
  const seen = new Set([String(correct)]);
  const values = [correct];

  extras.forEach((value) => {
    const key = String(value);
    if (!seen.has(key) && value >= 0) {
      seen.add(key);
      values.push(value);
    }
  });

  while (values.length < 3) {
    values.push(correct + values.length);
  }

  return values.slice(0, 4);
}

function createTableLesson(table, factor) {
  const correct = table * factor;
  return {
    prompt: `Combien font ${table} x ${factor} ?`,
    choices: createChoices(correct, [correct + table, Math.max(0, correct - table), correct + factor]),
    answer: correct,
    explanation: `${table} x ${factor} = ${correct}.`
  };
}

function createDivisionTableLesson(table, multiplier) {
  const dividend = table * multiplier;
  return {
    prompt: `Combien font ${dividend} / ${table} ?`,
    choices: createChoices(multiplier, [multiplier + 1, Math.max(0, multiplier - 1), table]),
    answer: multiplier,
    explanation: `${dividend} / ${table} = ${multiplier}.`
  };
}

function createTableActivity(table) {
  const gradeBand = table <= 5 ? ['P2', 'P3'] : ['P3', 'P4', 'P5', 'P6'];
  const practice = Array.from({ length: 10 }, (_, index) => createTableLesson(table, index + 1));
  const examFactors = [2, 4, 7, 10];
  const exam = examFactors.map((factor) => createTableLesson(table, factor));

  return {
    id: `multiplication-table-${table}`,
    slug: `table-de-${table}`,
    title: `Table de multiplication du ${table}`,
    subject: 'mathematics',
    subskill: 'multiplication',
    gradeBand,
    language: 'fr',
    difficulty: 'progressive',
    estimatedDurationMin: 12,
    instructions: `Commence par 10 exercices de la table du ${table}, puis passe au mini examen.`,
    correctionType: 'multiple-choice',
    hints: [`La table du ${table} suit une suite reguliere.`],
    tags: ['multiplication', `table-${table}`, 'automatismes'],
    accessibility: ['une seule consigne a la fois'],
    originRepo: 'Lena+Val',
    engineType: 'multiple-choice',
    featured: table === 2 || table === 10,
    sections: buildSections(
      practice,
      exam,
      `Entrainement de la table du ${table}`,
      `Mini examen de la table du ${table}`
    )
  };
}

function createDivisionTableActivity(table) {
  const gradeBand = table <= 5 ? ['P2', 'P3'] : ['P3', 'P4', 'P5', 'P6'];
  const practice = Array.from({ length: 10 }, (_, index) => createDivisionTableLesson(table, index + 1));
  const examMultipliers = [2, 4, 7, 10];
  const exam = examMultipliers.map((multiplier) => createDivisionTableLesson(table, multiplier));

  return {
    id: `division-table-${table}`,
    slug: `table-de-division-${table}`,
    title: `Table de division par ${table}`,
    subject: 'mathematics',
    subskill: 'division',
    gradeBand,
    language: 'fr',
    difficulty: 'progressive',
    estimatedDurationMin: 12,
    instructions: `Commence par 10 exercices de division par ${table}, puis passe au mini examen.`,
    correctionType: 'multiple-choice',
    hints: [`La division par ${table} suit la meme famille que la table de ${table}.`],
    tags: ['division', `table-${table}`, 'automatismes'],
    accessibility: ['une seule consigne a la fois'],
    originRepo: 'Lena+Val',
    engineType: 'multiple-choice',
    featured: table === 2 || table === 10,
    sections: buildSections(
      practice,
      exam,
      `Entrainement de la division par ${table}`,
      `Mini examen de la division par ${table}`
    )
  };
}

export const mathematicsSubject = {
  id: 'mathematics',
  label: 'Mathematiques',
  description: 'Numeration, operations, logique, calcul mental et problemes pour le primaire.',
  color: '#ff8a5b',
  accent: '#ffe1cf',
  grades: ['P2', 'P3', 'P4', 'P5', 'P6'],
  roadmap: [
    'Nombres et valeur de position',
    'Additions, soustractions et calcul mental',
    'Tables, multiplication et division',
    'Problemes, monnaie, heure et geometrie'
  ]
};

const coreActivities = [
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
    instructions: 'Compose le nombre demande avec des dizaines et des unites.',
    correctionType: 'exact-match',
    hints: ['Compte les dizaines avant les unites.'],
    tags: ['nombres', 'base-10', 'manipulation'],
    accessibility: ['feedback visuel fort', 'grandes zones tactiles'],
    originRepo: 'Lena',
    engineType: 'base-ten',
    featured: true,
    levels: [
      { target: 14, hint: '1 dizaine et 4 unites.' },
      { target: 26, hint: '2 dizaines et 6 unites.' },
      { target: 38, hint: '3 dizaines et 8 unites.' },
      { target: 42, hint: '4 dizaines et 2 unites.' },
      { target: 57, hint: '5 dizaines et 7 unites.' }
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
    instructions: 'Travaille la decomposition, puis termine avec un mini examen.',
    correctionType: 'multiple-choice',
    hints: ['Observe le chiffre des dizaines et celui des unites.'],
    tags: ['numeration', 'decomposition'],
    accessibility: ['contraste eleve'],
    originRepo: 'Lena',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Quel est le bon decoupage pour 34 ?', choices: ['3 dizaines et 4 unites', '4 dizaines et 3 unites', '34 unites et 0 dizaine'], answer: '3 dizaines et 4 unites', explanation: '34 = 30 + 4.' },
        { prompt: 'Quel nombre est forme par 5 dizaines et 2 unites ?', choices: ['25', '52', '502'], answer: '52', explanation: '5 dizaines donnent 50, puis on ajoute 2.' },
        { prompt: 'Dans 68, quelle est la valeur du 6 ?', choices: ['6', '60', '600'], answer: '60', explanation: 'Le 6 est a la place des dizaines.' },
        { prompt: 'Choisis la bonne decomposition de 91.', choices: ['9 dizaines et 1 unite', '1 dizaine et 9 unites', '91 dizaines'], answer: '9 dizaines et 1 unite', explanation: '91 = 90 + 1.' },
        { prompt: 'Quel nombre correspond a 7 dizaines et 4 unites ?', choices: ['47', '74', '704'], answer: '74', explanation: '7 dizaines donnent 70.' },
        { prompt: 'Dans 53, quelle est la valeur du 3 ?', choices: ['3', '30', '300'], answer: '3', explanation: 'Le 3 est a la place des unites.' }
      ],
      [
        { prompt: 'Quel nombre est forme par 8 dizaines et 6 unites ?', choices: ['68', '86', '806'], answer: '86', explanation: '8 dizaines et 6 unites donnent 86.' },
        { prompt: 'Dans 47, quelle est la valeur du 4 ?', choices: ['4', '40', '400'], answer: '40', explanation: 'Le 4 vaut 40.' },
        { prompt: 'Choisis la bonne decomposition de 63.', choices: ['6 dizaines et 3 unites', '3 dizaines et 6 unites', '63 dizaines'], answer: '6 dizaines et 3 unites', explanation: '63 = 60 + 3.' }
      ],
      'Atelier de decomposition',
      'Mini examen de valeur de position'
    )
  },
  {
    id: 'number-line',
    slug: 'ligne-numerique',
    title: 'Ligne numerique',
    subject: 'mathematics',
    subskill: 'mental-calculation',
    gradeBand: ['P2', 'P3'],
    language: 'fr',
    difficulty: 'guided',
    estimatedDurationMin: 8,
    instructions: 'Avance ou recule sur la ligne numerique avant le mini examen.',
    correctionType: 'multiple-choice',
    hints: ['Compte les bonds un a un.'],
    tags: ['addition', 'soustraction', 'reperage'],
    accessibility: ['consigne courte'],
    originRepo: 'Lena',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Tu pars de 18. Tu avances de 5. Ou arrives tu ?', choices: ['22', '23', '24'], answer: '23', explanation: '18 + 5 = 23.' },
        { prompt: 'Tu pars de 31. Tu recules de 7. Ou arrives tu ?', choices: ['22', '24', '26'], answer: '24', explanation: '31 - 7 = 24.' },
        { prompt: 'Tu pars de 45. Tu avances de 10. Ou arrives tu ?', choices: ['50', '55', '65'], answer: '55', explanation: 'Ajouter 10 change les dizaines.' },
        { prompt: 'Tu pars de 27. Tu avances de 2. Ou arrives tu ?', choices: ['28', '29', '30'], answer: '29', explanation: '27 + 2 = 29.' },
        { prompt: 'Tu pars de 52. Tu recules de 10. Ou arrives tu ?', choices: ['42', '41', '32'], answer: '42', explanation: '52 - 10 = 42.' },
        { prompt: 'Tu pars de 40. Tu avances de 8. Ou arrives tu ?', choices: ['48', '46', '50'], answer: '48', explanation: '40 + 8 = 48.' }
      ],
      [
        { prompt: 'Tu pars de 64. Tu recules de 6. Ou arrives tu ?', choices: ['58', '57', '56'], answer: '58', explanation: '64 - 6 = 58.' },
        { prompt: 'Tu pars de 39. Tu avances de 4. Ou arrives tu ?', choices: ['42', '43', '44'], answer: '43', explanation: '39 + 4 = 43.' },
        { prompt: 'Tu pars de 70. Tu recules de 20. Ou arrives tu ?', choices: ['60', '50', '40'], answer: '50', explanation: '70 - 20 = 50.' }
      ],
      'Promenade sur la ligne',
      'Mini examen de ligne numerique'
    )
  },
  {
    id: 'money-simple',
    slug: 'monnaie-simple',
    title: 'Monnaie et petits achats',
    subject: 'mathematics',
    subskill: 'money',
    gradeBand: ['P2', 'P3'],
    language: 'fr',
    difficulty: 'guided',
    estimatedDurationMin: 9,
    instructions: 'Observe les pieces, les prix et choisis la bonne reponse.',
    correctionType: 'multiple-choice',
    hints: ['Additionne les pieces ou retire le prix de depart.'],
    tags: ['monnaie', 'prix', 'change'],
    accessibility: ['situations concretes'],
    originRepo: 'Lena',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Un crayon coute 4 EUR. Tu donnes 5 EUR. Combien recois tu ?', choices: ['1 EUR', '2 EUR', '3 EUR'], answer: '1 EUR', explanation: '5 - 4 = 1.' },
        { prompt: 'Tu as une piece de 2 EUR et trois pieces de 1 EUR. Combien as tu ?', choices: ['4 EUR', '5 EUR', '6 EUR'], answer: '5 EUR', explanation: '2 + 1 + 1 + 1 = 5.' },
        { prompt: 'Un livre coute 7 EUR. Tu donnes 10 EUR. Quel est le change ?', choices: ['2 EUR', '3 EUR', '4 EUR'], answer: '3 EUR', explanation: '10 - 7 = 3.' },
        { prompt: 'Deux jus coutent 3 EUR chacun. Combien faut il payer ?', choices: ['5 EUR', '6 EUR', '7 EUR'], answer: '6 EUR', explanation: '2 fois 3 EUR = 6 EUR.' }
      ],
      [
        { prompt: 'Tu as 8 EUR et tu depenses 5 EUR. Combien reste t il ?', choices: ['2 EUR', '3 EUR', '4 EUR'], answer: '3 EUR', explanation: '8 - 5 = 3.' },
        { prompt: 'Un jeu coute 9 EUR. Tu donnes 10 EUR. Quel change recois tu ?', choices: ['1 EUR', '2 EUR', '3 EUR'], answer: '1 EUR', explanation: '10 - 9 = 1.' }
      ],
      'Atelier monnaie',
      'Mini examen monnaie'
    )
  },
  {
    id: 'read-time-p2',
    slug: 'lire-l-heure',
    title: 'Lire l heure',
    subject: 'mathematics',
    subskill: 'time',
    gradeBand: ['P2', 'P3'],
    language: 'fr',
    difficulty: 'guided',
    estimatedDurationMin: 8,
    instructions: 'Lis l heure annoncee et choisis la bonne reponse.',
    correctionType: 'multiple-choice',
    hints: ['Commence par l heure entiere, puis regarde les minutes.'],
    tags: ['heure', 'temps'],
    accessibility: ['phrases courtes'],
    originRepo: 'Lena',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Quelle heure vient juste apres 3 h ?', choices: ['4 h', '2 h', '5 h'], answer: '4 h', explanation: 'Apres 3 h vient 4 h.' },
        { prompt: 'Quelle heure indique midi ?', choices: ['12 h', '10 h', '8 h'], answer: '12 h', explanation: 'Midi correspond a 12 h.' },
        { prompt: 'Quelle heure indique minuit ?', choices: ['12 h', '6 h', '9 h'], answer: '12 h', explanation: 'Minuit correspond aussi a 12 h sur la pendule.' },
        { prompt: 'Une demi heure apres 4 h, quelle heure est il ?', choices: ['4 h 30', '5 h', '3 h 30'], answer: '4 h 30', explanation: 'Une demi heure apres 4 h donne 4 h 30.' }
      ],
      [
        { prompt: 'Un quart d heure apres 6 h, quelle heure est il ?', choices: ['6 h 15', '6 h 45', '7 h 15'], answer: '6 h 15', explanation: 'Un quart d heure correspond a 15 minutes.' },
        { prompt: 'A 7 h 30, quelle heure lit on ?', choices: ['7 h et demie', '8 h', '6 h et demie'], answer: '7 h et demie', explanation: '30 minutes apres 7 h donnent 7 h et demie.' }
      ],
      'Atelier heure',
      'Mini examen heure'
    )
  },
  {
    id: 'shapes-symmetry-p2',
    slug: 'formes-et-symetrie',
    title: 'Figures et symetrie',
    subject: 'mathematics',
    subskill: 'geometry',
    gradeBand: ['P2', 'P3'],
    language: 'fr',
    difficulty: 'guided',
    estimatedDurationMin: 8,
    instructions: 'Observe les formes et choisis la bonne reponse.',
    correctionType: 'multiple-choice',
    hints: ['Compte les cotes ou cherche si les deux moities se ressemblent.'],
    tags: ['formes', 'symetrie', 'geometrie'],
    accessibility: ['questions courtes'],
    originRepo: 'Lena',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Quelle figure a 3 cotes ?', choices: ['triangle', 'carre', 'cercle'], answer: 'triangle', explanation: 'Un triangle a 3 cotes.' },
        { prompt: 'Quelle figure roule facilement ?', choices: ['cercle', 'rectangle', 'triangle'], answer: 'cercle', explanation: 'Le cercle roule.' },
        { prompt: 'Quelle figure a 4 cotes egaux ?', choices: ['carre', 'triangle', 'ovale'], answer: 'carre', explanation: 'Le carre a 4 cotes egaux.' },
        { prompt: 'Si une figure a deux moities pareilles, on parle de ...', choices: ['symetrie', 'addition', 'monnaie'], answer: 'symetrie', explanation: 'Deux moities pareilles montrent une symetrie.' }
      ],
      [
        { prompt: 'Quelle figure a un angle droit ?', choices: ['rectangle', 'cercle', 'ovale'], answer: 'rectangle', explanation: 'Le rectangle a des angles droits.' },
        { prompt: 'Quelle figure n a pas de cote ?', choices: ['cercle', 'triangle', 'carre'], answer: 'cercle', explanation: 'Le cercle n a pas de cote.' }
      ],
      'Atelier figures',
      'Mini examen geometrie'
    )
  },
  {
    id: 'large-numbers-p3',
    slug: 'grands-nombres-p3',
    title: 'Grands nombres',
    subject: 'mathematics',
    subskill: 'large-numbers',
    gradeBand: ['P3'],
    language: 'fr',
    difficulty: 'progressive',
    estimatedDurationMin: 10,
    instructions: 'Lis, decompose et compare des nombres plus grands.',
    correctionType: 'multiple-choice',
    hints: ['Commence par les centaines, puis les dizaines et les unites.'],
    tags: ['grands-nombres', 'decomposition'],
    accessibility: ['etapes courtes'],
    originRepo: 'Val',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Quelle decomposition correspond a 347 ?', choices: ['3 centaines 4 dizaines 7 unites', '34 centaines 7 unites', '3 dizaines 4 centaines 7 unites'], answer: '3 centaines 4 dizaines 7 unites', explanation: '347 = 300 + 40 + 7.' },
        { prompt: 'Quel nombre est le plus grand ?', choices: ['482', '428', '248'], answer: '482', explanation: '4 centaines, 8 dizaines et 2 unites est le plus grand.' },
        { prompt: 'Quel nombre vient juste apres 599 ?', choices: ['600', '590', '610'], answer: '600', explanation: 'Apres 599 vient 600.' },
        { prompt: 'Combien y a t il de centaines dans 726 ?', choices: ['7', '2', '6'], answer: '7', explanation: '726 contient 7 centaines.' }
      ],
      [
        { prompt: 'Choisis le nombre le plus petit.', choices: ['631', '613', '361'], answer: '361', explanation: '3 centaines est plus petit que 6 centaines.' },
        { prompt: 'Quelle decomposition correspond a 508 ?', choices: ['5 centaines 0 dizaine 8 unites', '50 centaines 8 unites', '5 dizaines 8 unites'], answer: '5 centaines 0 dizaine 8 unites', explanation: '508 = 500 + 0 + 8.' }
      ],
      'Atelier grands nombres',
      'Mini examen grands nombres'
    )
  },
  {
    id: 'geometry-p3',
    slug: 'geometrie-p3',
    title: 'Polygones et angle droit',
    subject: 'mathematics',
    subskill: 'geometry',
    gradeBand: ['P3'],
    language: 'fr',
    difficulty: 'progressive',
    estimatedDurationMin: 9,
    instructions: 'Observe les proprietes des figures et choisis la bonne reponse.',
    correctionType: 'multiple-choice',
    hints: ['Compte les cotes et regarde les angles.'],
    tags: ['polygones', 'angle-droit', 'symetrie'],
    accessibility: ['questions courtes'],
    originRepo: 'Val',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Quel polygone a 5 cotes ?', choices: ['pentagone', 'triangle', 'rectangle'], answer: 'pentagone', explanation: 'Un pentagone a 5 cotes.' },
        { prompt: 'Quelle figure a au moins un angle droit ?', choices: ['rectangle', 'cercle', 'ovale'], answer: 'rectangle', explanation: 'Le rectangle a des angles droits.' },
        { prompt: 'Une demi droite a ...', choices: ['un point de depart et pas de fin', 'deux points de fin', 'aucun point de depart'], answer: 'un point de depart et pas de fin', explanation: 'Une demi droite commence et continue.' },
        { prompt: 'Quel mot convient a une figure qui se replie pareil des deux cotes ?', choices: ['symetrique', 'melangee', 'rapide'], answer: 'symetrique', explanation: 'On dit qu elle est symetrique.' }
      ],
      [
        { prompt: 'Quel polygone a 4 cotes ?', choices: ['quadrilatere', 'triangle', 'cercle'], answer: 'quadrilatere', explanation: 'Un quadrilatere a 4 cotes.' },
        { prompt: 'Quel objet ressemble le plus a un segment ?', choices: ['une regle droite', 'un ballon', 'une assiette'], answer: 'une regle droite', explanation: 'Un segment est droit et limite.' }
      ],
      'Atelier geometrie P3',
      'Mini examen geometrie P3'
    )
  },
  {
    id: 'word-problems',
    slug: 'problemes-quotidiens',
    title: 'Problemes du quotidien',
    subject: 'mathematics',
    subskill: 'word-problems',
    gradeBand: ['P2', 'P3'],
    language: 'fr',
    difficulty: 'progressive',
    estimatedDurationMin: 12,
    instructions: 'Lis, reflechis, choisis la bonne reponse, puis termine avec une mini evaluation.',
    correctionType: 'multiple-choice',
    hints: ['Cherche les mots qui montrent si on ajoute, retire, partage ou groupe.'],
    tags: ['raisonnement', 'lecture', 'problemes'],
    accessibility: ['texte decoupe', 'feedback simple'],
    originRepo: 'Lena+Val',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Lena a 18 autocollants. Elle en recoit 7. Combien en a t elle maintenant ?', choices: ['25', '21', '27'], answer: '25', explanation: 'On ajoute 7 a 18.' },
        { prompt: 'Une classe a 6 rangees de 4 chaises. Combien y a t il de chaises ?', choices: ['24', '10', '20'], answer: '24', explanation: '6 groupes de 4 font 24.' },
        { prompt: '32 cartes sont partagees entre 4 enfants. Combien de cartes par enfant ?', choices: ['8', '7', '9'], answer: '8', explanation: '32 / 4 = 8.' },
        { prompt: 'Le magasin a 54 crayons et en vend 19. Combien en reste t il ?', choices: ['35', '45', '37'], answer: '35', explanation: '54 - 19 = 35.' },
        { prompt: 'Il y a 5 paquets de 3 biscuits. Combien de biscuits ?', choices: ['8', '15', '12'], answer: '15', explanation: '5 x 3 = 15.' },
        { prompt: 'Lena lit 6 pages par jour pendant 4 jours. Combien de pages ?', choices: ['20', '24', '26'], answer: '24', explanation: '6 x 4 = 24.' }
      ],
      [
        { prompt: '24 billes sont partagees entre 3 enfants. Combien chacun recoit il ?', choices: ['6', '8', '9'], answer: '8', explanation: '24 / 3 = 8.' },
        { prompt: 'Tom a 47 cartes et en perd 12. Combien lui reste t il ?', choices: ['35', '34', '36'], answer: '35', explanation: '47 - 12 = 35.' },
        { prompt: 'Il y a 9 boites de 2 feutres. Combien de feutres ?', choices: ['11', '18', '20'], answer: '18', explanation: '9 x 2 = 18.' }
      ],
      'Atelier de problemes',
      'Mini examen de problemes'
    )
  },
  {
    id: 'mult-div-families',
    slug: 'familles-multiplication-division',
    title: 'Familles multiplication division',
    subject: 'mathematics',
    subskill: 'multiplication-division',
    gradeBand: ['P3'],
    language: 'fr',
    difficulty: 'building',
    estimatedDurationMin: 8,
    instructions: 'Retrouve les operations qui appartiennent a la meme famille, puis reussis le mini examen.',
    correctionType: 'multiple-choice',
    hints: ['La multiplication et la division racontent la meme histoire.'],
    tags: ['tables', 'familles', 'liens'],
    accessibility: ['reponses courtes'],
    originRepo: 'Lena',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Quelle famille correspond a 4, 6 et 24 ?', choices: ['4 x 6 = 24, 24 / 6 = 4, 24 / 4 = 6', '4 + 6 = 10, 24 - 4 = 20, 24 - 6 = 18', '6 x 6 = 36, 24 / 4 = 5, 24 / 6 = 4'], answer: '4 x 6 = 24, 24 / 6 = 4, 24 / 4 = 6', explanation: 'Les trois operations utilisent les memes nombres.' },
        { prompt: 'Quelle relation est correcte pour 7, 8 et 56 ?', choices: ['56 / 7 = 8', '56 / 8 = 9', '7 + 8 = 56'], answer: '56 / 7 = 8', explanation: '56 se partage en 7 groupes de 8.' },
        { prompt: 'Quelle relation est correcte pour 3, 9 et 27 ?', choices: ['27 / 3 = 9', '27 / 9 = 2', '3 + 9 = 27'], answer: '27 / 3 = 9', explanation: '27 / 3 = 9.' },
        { prompt: 'Quelle famille va avec 5, 4 et 20 ?', choices: ['5 x 4 = 20, 20 / 5 = 4, 20 / 4 = 5', '5 + 4 = 20, 20 - 5 = 15, 20 - 4 = 16', '4 x 4 = 16, 20 / 5 = 4, 20 / 4 = 4'], answer: '5 x 4 = 20, 20 / 5 = 4, 20 / 4 = 5', explanation: 'C est une vraie famille d operations.' }
      ],
      [
        { prompt: 'Pour 6, 7 et 42, quelle egalite est correcte ?', choices: ['42 / 6 = 7', '42 / 7 = 5', '6 + 7 = 42'], answer: '42 / 6 = 7', explanation: '42 / 6 = 7.' },
        { prompt: 'Quelle famille correspond a 8, 3 et 24 ?', choices: ['8 x 3 = 24, 24 / 8 = 3, 24 / 3 = 8', '8 x 8 = 64, 24 / 3 = 8, 24 / 8 = 4', '8 + 3 = 11, 24 - 8 = 16, 24 - 3 = 21'], answer: '8 x 3 = 24, 24 / 8 = 3, 24 / 3 = 8', explanation: 'La bonne famille garde les trois memes nombres.' }
      ],
      'Familles d operations',
      'Mini examen des familles'
    )
  }
];

const measurementGeometryActivities = [
  {
    id: 'mesures-longueur-p2',
    slug: 'mesures-longueur-p2',
    title: 'Mesures de longueur',
    subject: 'mathematics',
    subskill: 'measurement',
    gradeBand: ['P2', 'P3'],
    language: 'fr',
    difficulty: 'guided',
    estimatedDurationMin: 10,
    instructions: 'Apprends a mesurer des longueurs en cm, dm et m, puis reussis le mini examen.',
    correctionType: 'multiple-choice',
    hints: ['1 m = 100 cm. 1 dm = 10 cm.'],
    tags: ['mesure', 'longueur', 'cm', 'm'],
    accessibility: ['situations concretes'],
    originRepo: 'Lena',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Une regle mesure 30 cm. Combien de millimetres ?', choices: ['300 mm', '30 mm', '3 mm'], answer: '300 mm', explanation: '1 cm = 10 mm, donc 30 cm = 300 mm.' },
        { prompt: 'Une porte mesure 2 m. Combien de centimetres ?', choices: ['200 cm', '20 cm', '2 000 cm'], answer: '200 cm', explanation: '1 m = 100 cm, donc 2 m = 200 cm.' },
        { prompt: 'Un crayon mesure 15 cm et une gomme 5 cm. Quelle longueur totale ?', choices: ['20 cm', '10 cm', '25 cm'], answer: '20 cm', explanation: '15 + 5 = 20 cm.' },
        { prompt: 'Un ruban de 50 cm est coupe en 2 parts egales. Quelle longueur chaque part ?', choices: ['25 cm', '20 cm', '30 cm'], answer: '25 cm', explanation: '50 / 2 = 25 cm.' },
        { prompt: '1 km vaut combien de metres ?', choices: ['1 000 m', '100 m', '10 000 m'], answer: '1 000 m', explanation: '1 km = 1 000 m.' },
        { prompt: 'Un fil mesure 3 m. On en coupe 80 cm. Combien reste-t-il en cm ?', choices: ['220 cm', '200 cm', '230 cm'], answer: '220 cm', explanation: '300 cm - 80 cm = 220 cm.' }
      ],
      [
        { prompt: 'Un couloir mesure 4 m. Combien de cm ?', choices: ['400 cm', '40 cm', '4 000 cm'], answer: '400 cm', explanation: '4 m = 400 cm.' },
        { prompt: 'Tom marche 250 m. Quelle fraction de km a-t-il parcouru ?', choices: ['1/4 de km', '1/2 km', '3/4 de km'], answer: '1/4 de km', explanation: '250 m = 1/4 de 1 000 m.' },
        { prompt: 'Une corde de 6 m est coupee en morceaux de 2 m. Combien de morceaux ?', choices: ['3', '4', '2'], answer: '3', explanation: '6 / 2 = 3 morceaux.' }
      ],
      'Atelier longueurs',
      'Mini examen longueurs'
    )
  },
  {
    id: 'mesures-contenance-p2',
    slug: 'mesures-contenance-p2',
    title: 'Contenances : ml, cl et L',
    subject: 'mathematics',
    subskill: 'measurement',
    gradeBand: ['P2', 'P3'],
    language: 'fr',
    difficulty: 'guided',
    estimatedDurationMin: 9,
    instructions: 'Decouvre les unites de contenance et choisis les bonnes reponses.',
    correctionType: 'multiple-choice',
    hints: ['1 L = 100 cl = 1 000 ml.'],
    tags: ['mesure', 'contenance', 'ml', 'cl', 'litre'],
    accessibility: ['contexte quotidien'],
    originRepo: 'Lena',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Un grand verre contient 250 ml. Combien de ml dans 4 verres ?', choices: ['1 000 ml', '500 ml', '750 ml'], answer: '1 000 ml', explanation: '4 x 250 = 1 000 ml = 1 L.' },
        { prompt: '1 litre vaut combien de millilitres ?', choices: ['1 000 ml', '100 ml', '10 ml'], answer: '1 000 ml', explanation: '1 L = 1 000 ml.' },
        { prompt: 'Une bouteille a 500 ml. On en boit 200 ml. Combien reste-t-il ?', choices: ['300 ml', '250 ml', '350 ml'], answer: '300 ml', explanation: '500 - 200 = 300 ml.' },
        { prompt: '1 L est-il plus grand ou plus petit que 750 ml ?', choices: ['Plus grand', 'Plus petit', 'Egal'], answer: 'Plus grand', explanation: '1 L = 1 000 ml > 750 ml.' },
        { prompt: '2 L font combien de millilitres ?', choices: ['2 000 ml', '200 ml', '20 000 ml'], answer: '2 000 ml', explanation: '2 x 1 000 ml = 2 000 ml.' }
      ],
      [
        { prompt: 'Un bol contient 150 ml. Combien de ml dans 3 bols ?', choices: ['450 ml', '300 ml', '600 ml'], answer: '450 ml', explanation: '3 x 150 = 450 ml.' },
        { prompt: 'Une bouteille de 1,5 L vaut combien de ml ?', choices: ['1 500 ml', '150 ml', '15 000 ml'], answer: '1 500 ml', explanation: '1,5 x 1 000 = 1 500 ml.' }
      ],
      'Atelier contenances',
      'Mini examen contenances'
    )
  },
  {
    id: 'geometrie-figures-p3',
    slug: 'geometrie-figures-p3',
    title: 'Figures et perimetres',
    subject: 'mathematics',
    subskill: 'geometry',
    gradeBand: ['P3', 'P4'],
    language: 'fr',
    difficulty: 'progressive',
    estimatedDurationMin: 11,
    instructions: 'Identifie les figures, calcule les perimetres et reussis le mini examen.',
    correctionType: 'multiple-choice',
    hints: ['Perimetre = somme de tous les cotes.'],
    tags: ['geometrie', 'perimetre', 'polygone'],
    accessibility: ['calculs simples'],
    originRepo: 'Lena',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Un carre a un cote de 5 cm. Quel est son perimetre ?', choices: ['20 cm', '25 cm', '10 cm'], answer: '20 cm', explanation: '4 x 5 = 20 cm.' },
        { prompt: 'Un rectangle mesure 8 cm x 3 cm. Quel est son perimetre ?', choices: ['22 cm', '24 cm', '11 cm'], answer: '22 cm', explanation: 'P = 2 x (8 + 3) = 22 cm.' },
        { prompt: 'Un triangle equilateral a un cote de 6 cm. Quel est son perimetre ?', choices: ['18 cm', '12 cm', '24 cm'], answer: '18 cm', explanation: '3 x 6 = 18 cm.' },
        { prompt: 'La somme des angles d\'un triangle est ?', choices: ['180 degres', '360 degres', '90 degres'], answer: '180 degres', explanation: 'La somme des angles interieurs d\'un triangle est toujours 180 degres.' },
        { prompt: 'Un hexagone regulier a 6 cotes de 3 cm. Quel perimetre ?', choices: ['18 cm', '12 cm', '24 cm'], answer: '18 cm', explanation: '6 x 3 = 18 cm.' },
        { prompt: 'Un carre a un perimetre de 36 cm. Quelle est la longueur d\'un cote ?', choices: ['9 cm', '6 cm', '12 cm'], answer: '9 cm', explanation: '36 / 4 = 9 cm.' }
      ],
      [
        { prompt: 'Un rectangle a un perimetre de 28 cm et une longueur de 9 cm. Quelle est sa largeur ?', choices: ['5 cm', '10 cm', '7 cm'], answer: '5 cm', explanation: '28 = 2 x (9 + L) => L = 5 cm.' },
        { prompt: 'Un triangle a des angles de 60 et 80 degres. Quel est le troisieme angle ?', choices: ['40 degres', '50 degres', '60 degres'], answer: '40 degres', explanation: '180 - 60 - 80 = 40 degres.' },
        { prompt: 'Un pentagone regulier a des cotes de 7 cm. Quel est son perimetre ?', choices: ['35 cm', '28 cm', '42 cm'], answer: '35 cm', explanation: '5 x 7 = 35 cm.' }
      ],
      'Atelier perimetres',
      'Mini examen perimetres'
    )
  },
  {
    id: 'geometrie-aires-p4',
    slug: 'geometrie-aires-p4',
    title: 'Aires et angles',
    subject: 'mathematics',
    subskill: 'geometry',
    gradeBand: ['P4', 'P5', 'P6'],
    language: 'fr',
    difficulty: 'progressive',
    estimatedDurationMin: 12,
    instructions: 'Calcule des aires, identifie des angles et reussis le mini examen.',
    correctionType: 'multiple-choice',
    hints: ['Aire carre = cote2. Aire rectangle = longueur x largeur. Aire triangle = (base x hauteur) / 2.'],
    tags: ['geometrie', 'aire', 'angle', 'cm2'],
    accessibility: ['formules rappelees'],
    originRepo: 'Lena',
    engineType: 'multiple-choice',
    sections: buildSections(
      [
        { prompt: 'Quelle est l\'aire d\'un carre de 7 cm de cote ?', choices: ['49 cm2', '28 cm2', '14 cm2'], answer: '49 cm2', explanation: '7 x 7 = 49 cm2.' },
        { prompt: 'Un rectangle de 10 cm x 4 cm. Quelle est son aire ?', choices: ['40 cm2', '28 cm2', '20 cm2'], answer: '40 cm2', explanation: '10 x 4 = 40 cm2.' },
        { prompt: 'Un triangle a une base de 8 cm et une hauteur de 6 cm. Quelle est son aire ?', choices: ['24 cm2', '48 cm2', '14 cm2'], answer: '24 cm2', explanation: '(8 x 6) / 2 = 24 cm2.' },
        { prompt: 'Quelle est la somme des angles interieurs d\'un quadrilatere ?', choices: ['360 degres', '180 degres', '270 degres'], answer: '360 degres', explanation: 'Tout quadrilatere a une somme d\'angles de 360 degres.' },
        { prompt: 'Un cercle a un diametre de 10 cm. Quel est son rayon ?', choices: ['5 cm', '10 cm', '20 cm'], answer: '5 cm', explanation: 'Rayon = diametre / 2 = 10 / 2 = 5 cm.' },
        { prompt: 'Quelle est l\'aire d\'un carre de 9 cm ?', choices: ['81 cm2', '36 cm2', '18 cm2'], answer: '81 cm2', explanation: '9 x 9 = 81 cm2.' }
      ],
      [
        { prompt: 'Un triangle a des angles de 90 et 45 degres. Quel est le troisieme ?', choices: ['45 degres', '90 degres', '60 degres'], answer: '45 degres', explanation: '180 - 90 - 45 = 45 degres.' },
        { prompt: 'Un rectangle a une aire de 60 cm2 et une largeur de 5 cm. Quelle est sa longueur ?', choices: ['12 cm', '10 cm', '15 cm'], answer: '12 cm', explanation: '60 / 5 = 12 cm.' },
        { prompt: 'Un carre a un perimetre de 48 cm. Quelle est son aire ?', choices: ['144 cm2', '96 cm2', '48 cm2'], answer: '144 cm2', explanation: 'Cote = 48 / 4 = 12 cm => 12 x 12 = 144 cm2.' }
      ],
      'Atelier aires et angles',
      'Mini examen aires et angles'
    )
  }
];

const multiplicationTableActivities = Array.from({ length: 11 }, (_, index) => createTableActivity(index + 2));
const divisionTableActivities = Array.from({ length: 11 }, (_, index) => createDivisionTableActivity(index + 2));

export const mathematicsActivities = [...coreActivities, ...measurementGeometryActivities, ...multiplicationTableActivities, ...divisionTableActivities];
