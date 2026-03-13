const localizedSubjects = {
  mathematics: {
    fr: {
      label: 'Mathematiques',
      description: 'Nombres, operations, logique, calcul mental et problemes pour le primaire.',
      roadmap: [
        'Nombres et valeur de position',
        'Additions et soustractions',
        'Multiplication et division',
        'Problemes et raisonnement'
      ]
    },
    nl: {
      label: 'Wiskunde',
      description: 'Getallen, bewerkingen, logica, hoofdrekenen en vraagstukken voor de lagere school.',
      roadmap: [
        'Getallen en plaatswaarde',
        'Optellen en aftrekken',
        'Vermenigvuldigen en delen',
        'Vraagstukken en redeneren'
      ]
    }
  },
  french: {
    fr: {
      label: 'Francais',
      description: 'Lecture, vocabulaire, orthographe, grammaire et comprehension.',
      roadmap: [
        'Vocabulaire et image mot',
        'Phrases a completer',
        'Grammaire de base',
        'Jeux de lecture'
      ]
    },
    nl: {
      label: 'Frans',
      description: 'Lezen, woordenschat, spelling, grammatica en begrijpend lezen.',
      roadmap: [
        'Woordenschat en beeld',
        'Zinnen aanvullen',
        'Basisgrammatica',
        'Leesspelletjes'
      ]
    }
  },
  dutch: {
    fr: {
      label: 'Neerlandais',
      description: 'Decouverte du neerlandais avec vocabulaire simple et petites lectures.',
      roadmap: [
        'Vocabulaire de l ecole',
        'Association mot image',
        'Mini comprehension'
      ]
    },
    nl: {
      label: 'Nederlands',
      description: 'Kennismaking met Nederlands met eenvoudige woordenschat en korte teksten.',
      roadmap: [
        'Schoolwoordenschat',
        'Woord en beeld',
        'Mini begrijpend lezen'
      ]
    }
  },
  stories: {
    fr: {
      label: 'Histoires',
      description: 'Mini recits, comprehension et lecture guidee.',
      roadmap: [
        'Lecture guidee',
        'Questions de comprehension',
        'Reperage des details'
      ]
    },
    nl: {
      label: 'Verhalen',
      description: 'Kleine verhalen, begrip en begeleid lezen.',
      roadmap: [
        'Begeleid lezen',
        'Begripsvragen',
        'Belangrijke details vinden'
      ]
    }
  }
};

export function getSubjectLabel(subject, locale, t) {
  return localizedSubjects[subject.id]?.[locale]?.label || subject.labelNl || subject.label || t(subject.id);
}

export function getSubjectDescription(subject, locale) {
  return localizedSubjects[subject.id]?.[locale]?.description || subject.descriptionNl || subject.description;
}

export function getSubjectRoadmap(subject, locale) {
  return localizedSubjects[subject.id]?.[locale]?.roadmap || subject.roadmapNl || subject.roadmap;
}
