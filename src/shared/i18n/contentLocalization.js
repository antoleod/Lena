const localizedSubjects = {
  mathematics: {
    iconId: 'math',
    difficulty: 'FACILE',
    fr: {
      label: 'Mathematiques',
      description: 'Nombres, operations, logique, calcul mental et problemes pour le primaire.',
      roadmap: ['Nombres et valeur de position', 'Additions et soustractions', 'Multiplication et division', 'Problemes et raisonnement']
    },
    nl: {
      label: 'Wiskunde',
      description: 'Getallen, bewerkingen, logica, hoofdrekenen en vraagstukken voor de lagere school.',
      roadmap: ['Getallen en plaatswaarde', 'Optellen en aftrekken', 'Vermenigvuldigen en delen', 'Vraagstukken en redeneren']
    },
    en: {
      label: 'Mathematics',
      description: 'Numbers, operations, logic, mental math and problem solving for primary school.',
      roadmap: ['Numbers and place value', 'Addition and subtraction', 'Multiplication and division', 'Problem solving']
    },
    es: {
      label: 'Matematicas',
      description: 'Numeros, operaciones, logica, calculo mental y problemas para primaria.',
      roadmap: ['Numeros y valor posicional', 'Sumas y restas', 'Multiplicacion y division', 'Problemas y razonamiento']
    }
  },
  french: {
    iconId: 'french',
    difficulty: 'MOYEN',
    fr: {
      label: 'Francais',
      description: 'Lecture, vocabulaire, orthographe, grammaire et comprehension.',
      roadmap: ['Vocabulaire et image mot', 'Phrases a completer', 'Grammaire de base', 'Jeux de lecture']
    },
    nl: {
      label: 'Frans',
      description: 'Lezen, woordenschat, spelling, grammatica en begrijpend lezen.',
      roadmap: ['Woordenschat en beeld', 'Zinnen aanvullen', 'Basisgrammatica', 'Leesspelletjes']
    },
    en: {
      label: 'French',
      description: 'Reading, vocabulary, spelling, grammar and comprehension.',
      roadmap: ['Vocabulary and image-word', 'Complete the sentence', 'Basic grammar', 'Reading games']
    },
    es: {
      label: 'Frances',
      description: 'Lectura, vocabulario, ortografia, gramatica y comprension.',
      roadmap: ['Vocabulario e imagen-palabra', 'Completar frases', 'Gramatica basica', 'Juegos de lectura']
    }
  },
  dutch: {
    iconId: 'dutch',
    difficulty: 'FACILE',
    fr: {
      label: 'Neerlandais',
      description: 'Decouverte du neerlandais avec vocabulaire simple et petites lectures.',
      roadmap: ['Vocabulaire de l ecole', 'Association mot image', 'Mini comprehension']
    },
    nl: {
      label: 'Nederlands',
      description: 'Kennismaking met Nederlands met eenvoudige woordenschat en korte teksten.',
      roadmap: ['Schoolwoordenschat', 'Woord en beeld', 'Mini begrijpend lezen']
    },
    en: {
      label: 'Dutch',
      description: 'Discover Dutch with simple vocabulary and short reading.',
      roadmap: ['School vocabulary', 'Word and picture', 'Mini comprehension']
    },
    es: {
      label: 'Neerlandes',
      description: 'Descubre neerlandes con vocabulario simple y lecturas cortas.',
      roadmap: ['Vocabulario escolar', 'Palabra e imagen', 'Mini comprension']
    }
  },
  english: {
    iconId: 'english',
    difficulty: 'MOYEN',
    fr: {
      label: 'Anglais',
      description: 'Vocabulaire, phrases, lecture simple et comprehension en anglais.',
      roadmap: ['Premiers mots', 'Phrases simples', 'Lecture courte']
    },
    nl: {
      label: 'Engels',
      description: 'Woordenschat, zinnen, eenvoudig lezen en begrijpen in het Engels.',
      roadmap: ['Eerste woorden', 'Eenvoudige zinnen', 'Kort lezen']
    },
    en: {
      label: 'English',
      description: 'Vocabulary, sentence building, simple reading and comprehension.',
      roadmap: ['First words', 'Simple sentences', 'Short reading']
    },
    es: {
      label: 'Ingles',
      description: 'Vocabulario, frases, lectura simple y comprension en ingles.',
      roadmap: ['Primeras palabras', 'Frases simples', 'Lectura corta']
    }
  },
  spanish: {
    iconId: 'spanish',
    difficulty: 'MOYEN',
    fr: {
      label: 'Espagnol',
      description: 'Vocabulaire, phrases et lecture simple en espagnol.',
      roadmap: ['Mots du quotidien', 'Phrases simples', 'Mini lecture']
    },
    nl: {
      label: 'Spaans',
      description: 'Woordenschat, zinnen en eenvoudig lezen in het Spaans.',
      roadmap: ['Dagelijkse woorden', 'Eenvoudige zinnen', 'Mini lezen']
    },
    en: {
      label: 'Spanish',
      description: 'Vocabulary, sentence building and simple reading in Spanish.',
      roadmap: ['Daily words', 'Simple sentences', 'Mini reading']
    },
    es: {
      label: 'Espanol',
      description: 'Vocabulario, frases y lectura simple en espanol.',
      roadmap: ['Palabras cotidianas', 'Frases simples', 'Mini lectura']
    }
  },
  reasoning: {
    iconId: 'reasoning',
    difficulty: 'MOYEN',
    fr: {
      label: 'Raisonnement',
      description: 'Suites, logique visuelle, intrus, deduction et strategie.',
      roadmap: ['Suites', 'Intrus et classification', 'Logique visuelle', 'Strategie']
    },
    nl: {
      label: 'Redeneren',
      description: 'Reeksen, visuele logica, vreemde eend, deductie en strategie.',
      roadmap: ['Reeksen', 'Classificeren', 'Visuele logica', 'Strategie']
    },
    en: {
      label: 'Reasoning',
      description: 'Sequences, visual logic, odd one out, deduction and strategy.',
      roadmap: ['Sequences', 'Classification', 'Visual logic', 'Strategy']
    },
    es: {
      label: 'Razonamiento',
      description: 'Series, logica visual, intruso, deduccion y estrategia.',
      roadmap: ['Series', 'Clasificacion', 'Logica visual', 'Estrategia']
    }
  },
  logique: {
    iconId: 'logic',
    difficulty: 'MOYEN',
    fr: {
      label: 'Logique & Reflexion',
      description: 'Suites logiques, intrus, formes, labyrinthes et deduction pour developper la pensee critique.',
      roadmap: ['Suites logiques', 'Trouver l intrus', 'Formes et motifs', 'Deduction et resolution']
    },
    nl: {
      label: 'Logica & Redeneren',
      description: 'Logische reeksen, vreemde eend, vormen, labyrinten en deductie om kritisch denken te ontwikkelen.',
      roadmap: ['Logische reeksen', 'Vreemde eend zoeken', 'Vormen en patronen', 'Deductie en oplossing']
    },
    en: {
      label: 'Logic & Reasoning',
      description: 'Logical sequences, odd one out, patterns, mazes and deduction to develop critical thinking.',
      roadmap: ['Logical sequences', 'Find the odd one out', 'Shapes and patterns', 'Deduction and problem solving']
    },
    es: {
      label: 'Logica & Reflexion',
      description: 'Series logicas, intruso, formas, laberintos y deduccion para desarrollar el pensamiento critico.',
      roadmap: ['Series logicas', 'Encontrar el intruso', 'Formas y patrones', 'Deduccion y resolucion']
    }
  },
  finance: {
    iconId: 'finance',
    difficulty: 'MOYEN',
    fr: {
      label: 'Education Financiere',
      description: 'Reconnaitre les pieces et billets, calculer des achats, rendre la monnaie et gerer un budget simple.',
      roadmap: ['Pieces et billets', 'Calculer un achat', 'Rendre la monnaie', 'Budget et epargne']
    },
    nl: {
      label: 'Financiele Educatie',
      description: 'Munten en biljetten herkennen, aankopen berekenen, wisselgeld geven en een eenvoudig budget beheren.',
      roadmap: ['Munten en biljetten', 'Aankopen berekenen', 'Wisselgeld geven', 'Budget en sparen']
    },
    en: {
      label: 'Financial Education',
      description: 'Recognise coins and notes, calculate purchases, give change and manage a simple budget.',
      roadmap: ['Coins and notes', 'Calculate a purchase', 'Give change', 'Budget and saving']
    },
    es: {
      label: 'Educacion Financiera',
      description: 'Reconocer monedas y billetes, calcular compras, dar cambio y gestionar un presupuesto basico.',
      roadmap: ['Monedas y billetes', 'Calcular una compra', 'Dar el cambio', 'Presupuesto y ahorro']
    }
  },
  informatique: {
    iconId: 'informatics',
    difficulty: 'DIFFICILE',
    fr: {
      label: 'Informatique',
      description: 'Parties de l ordinateur, clavier, souris, internet, securite numerique et premiers algorithmes.',
      roadmap: ['Parties de l ordinateur', 'Clavier et souris', 'Internet et securite', 'Logique et algorithmes']
    },
    nl: {
      label: 'Informatica',
      description: 'Onderdelen van de computer, toetsenbord, muis, internet, digitale veiligheid en eerste algoritmen.',
      roadmap: ['Onderdelen van de computer', 'Toetsenbord en muis', 'Internet en veiligheid', 'Logica en algoritmen']
    },
    en: {
      label: 'Computer Science',
      description: 'Parts of a computer, keyboard, mouse, internet, digital safety and first algorithms.',
      roadmap: ['Parts of a computer', 'Keyboard and mouse', 'Internet and safety', 'Logic and algorithms']
    },
    es: {
      label: 'Informatica',
      description: 'Partes del ordenador, teclado, raton, internet, seguridad digital y primeros algoritmos.',
      roadmap: ['Partes del ordenador', 'Teclado y raton', 'Internet y seguridad', 'Logica y algoritmos']
    }
  },
  stories: {
    iconId: 'stories',
    difficulty: 'FACILE',
    fr: {
      label: 'Histoires',
      description: 'Mini recits, comprehension et lecture guidee.',
      roadmap: ['Lecture guidee', 'Questions de comprehension', 'Reperage des details']
    },
    nl: {
      label: 'Verhalen',
      description: 'Kleine verhalen, begrip en begeleid lezen.',
      roadmap: ['Begeleid lezen', 'Begripsvragen', 'Belangrijke details vinden']
    },
    en: {
      label: 'Stories',
      description: 'Short stories, comprehension and guided reading.',
      roadmap: ['Guided reading', 'Comprehension questions', 'Important details']
    },
    es: {
      label: 'Historias',
      description: 'Historias cortas, comprension y lectura guiada.',
      roadmap: ['Lectura guiada', 'Preguntas de comprension', 'Detalles importantes']
    }
  },
  sciences: {
    iconId: 'sciences',
    difficulty: 'MOYEN',
  },
  histoire: {
    iconId: 'history',
    difficulty: 'MOYEN',
  }
};

export function getSubjectDifficulty(subjectId) {
  return localizedSubjects[subjectId]?.difficulty || 'FACILE';
}

export function getSubjectLabel(subject, locale, t) {
  return localizedSubjects[subject.id]?.[locale]?.label || subject.label || subject.labelNl || t(subject.id);
}

export function getSubjectDescription(subject, locale) {
  return localizedSubjects[subject.id]?.[locale]?.description || subject.description || subject.descriptionNl;
}

export function getSubjectRoadmap(subject, locale) {
  return localizedSubjects[subject.id]?.[locale]?.roadmap || subject.roadmap || subject.roadmapNl;
}

export function getSubjectIconId(subjectId) {
  return localizedSubjects[subjectId]?.iconId || subjectId;
}
