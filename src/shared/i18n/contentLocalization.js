const localizedSubjects = {
  mathematics: {
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
  stories: {
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
  }
};

export function getSubjectLabel(subject, locale, t) {
  return localizedSubjects[subject.id]?.[locale]?.label || subject.label || subject.labelNl || t(subject.id);
}

export function getSubjectDescription(subject, locale) {
  return localizedSubjects[subject.id]?.[locale]?.description || subject.description || subject.descriptionNl;
}

export function getSubjectRoadmap(subject, locale) {
  return localizedSubjects[subject.id]?.[locale]?.roadmap || subject.roadmap || subject.roadmapNl;
}
