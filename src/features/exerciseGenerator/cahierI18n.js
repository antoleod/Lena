// ─────────────────────────────────────────────────────────────────────────────
// i18n for the "Mon cahier" module (UI chrome, labels, thinking tips) +
// localized math statement builders. Languages: fr · nl · en · es.
//
// Usage:
//   import { useCahierT } from './cahierI18n.js';
//   const L = useCahierT();   // bound to the active app locale
//   L.t('creerCahier')        // → "Créer mon cahier" / "Maak mijn schrift" / …
//
// Note: French-learning content (français, dictée, grammaire…) stays in French
// on purpose — you learn French in French. Only the surrounding UI, the math
// statements and the strategy tips are localized.
// ─────────────────────────────────────────────────────────────────────────────

import { useLocale } from '../../shared/i18n/LocaleContext.jsx';

const UI = {
  fr: {
    monCahier: 'Mon cahier', monCahierTitle: "Mon cahier d'exercices",
    chooseWork: 'Choisis ce que tu veux travailler.',
    ateliers: '⭐ Ateliers de maths', matiere: '1. Matière', typeExercice: "2. Type d'exercice",
    tailleNombres: 'Taille des nombres', niveau: '3. Niveau', combien: "4. Combien d'exercices ?",
    creerCahier: '✏️ Créer mon cahier', mesErreurs: 'Mes erreurs',
    instructionNotebook: '✍️ Fais ces exercices dans ton vrai cahier. Prends ton temps !',
    finishedNotebook: "✅ J'ai terminé mon cahier", ficheTitle: 'Exercices',
    verifTitle: 'Vérification de mon travail', verifEyebrow: '📋 Vérification',
    verifQuestion: 'As-tu terminé tous les exercices dans ton cahier ?',
    voirReponses: '🔍 Voir les réponses', faireTest: "📝 Faire le test dans l'application",
    continuerCahier: '← Continuer dans mon cahier',
    reponsesTitle: 'Les réponses', reponsesEyebrow: '🔍 Réponses',
    compare: 'Compare avec ce que tu as écrit dans ton cahier.',
    exercice: 'Exercice', reponse: 'Réponse', voirExplications: '📖 Voir les explications',
    continuerNouvelle: '➕ Continuer (nouvelle fiche)',
    explicationsTitle: 'Comprendre mes exercices', explicationsEyebrow: '📖 Explications',
    commentReflechir: '🧠 Comment réfléchir ?', methode: 'Méthode :',
    refaire: '🔄 Refaire un cahier', choisirAutres: "🔄 Choisir d'autres exercices",
    question: 'Question', taReponse: 'Ta réponse…', verifier: 'Vérifier',
    suivant: 'Suivant →', terminer: 'Terminer', voirResultat: 'Voir le résultat',
    resultEyebrow: 'Résultat', bravo: 'Bravo, tu as bien essayé !', continueTry: 'Continue comme ça !',
    auto: 'Auto', chiffres: 'chiffres', nombreOperations: 'Nombre d’opérations', nombres: 'nombres',
    errEyebrow: 'Révision', errTitle: 'Mes erreurs', toutEffacer: '🧹 Tout effacer',
    aucuneErreur: 'Aucune erreur à revoir. Bravo !', reessaie: 'Réessaie…',
    notCorrect: 'Ce n’est pas encore correct.', goodAnswer: 'Bonne réponse !',
    felicitations: '🎉 Félicitations !', indice: '💡 Indice', methodeBtn: '🧠 Méthode',
    explicationBtn: '📖 Explication', reessayer: '🔄 Réessayer', voirSolution: '👀 Voir la solution',
    exerciceSuivant: '➡️ Exercice suivant', conseil: '💡 Conseil', solution: 'Solution',
    pasGrave: 'Ce n’est pas grave, on regarde ensemble.', aide: '💡 Aide',
    corrigerPapa: '👨‍👧 Corriger avec papa', papaTitle: 'On corrige ensemble', aRetravailler: 'À retravailler', aRetravaillerTitle: 'Mes points à renforcer', rienARetravailler: 'Rien à retravailler pour l’instant. Bravo !', retravaillerIntro: 'Choisis un point à renforcer : je te prépare des exercices similaires.',
  },
  nl: {
    monCahier: 'Mijn schrift', monCahierTitle: 'Mijn oefenschrift',
    chooseWork: 'Kies wat je wil oefenen.',
    ateliers: '⭐ Reken-ateliers', matiere: '1. Vak', typeExercice: '2. Soort oefening',
    tailleNombres: 'Grootte van de getallen', niveau: '3. Niveau', combien: '4. Hoeveel oefeningen?',
    creerCahier: '✏️ Maak mijn schrift', mesErreurs: 'Mijn fouten',
    instructionNotebook: '✍️ Maak deze oefeningen in je echte schrift. Neem je tijd!',
    finishedNotebook: '✅ Ik ben klaar met mijn schrift', ficheTitle: 'Oefeningen',
    verifTitle: 'Mijn werk nakijken', verifEyebrow: '📋 Nakijken',
    verifQuestion: 'Heb je alle oefeningen in je schrift gemaakt?',
    voirReponses: '🔍 Antwoorden bekijken', faireTest: '📝 De test in de app doen',
    continuerCahier: '← Verder in mijn schrift',
    reponsesTitle: 'De antwoorden', reponsesEyebrow: '🔍 Antwoorden',
    compare: 'Vergelijk met wat je in je schrift schreef.',
    exercice: 'Oefening', reponse: 'Antwoord', voirExplications: '📖 Uitleg bekijken',
    continuerNouvelle: '➕ Doorgaan (nieuw blad)',
    explicationsTitle: 'Mijn oefeningen begrijpen', explicationsEyebrow: '📖 Uitleg',
    commentReflechir: '🧠 Hoe nadenken?', methode: 'Methode:',
    refaire: '🔄 Nieuw schrift', choisirAutres: '🔄 Andere oefeningen kiezen',
    question: 'Vraag', taReponse: 'Jouw antwoord…', verifier: 'Controleren',
    suivant: 'Volgende →', terminer: 'Klaar', voirResultat: 'Resultaat bekijken',
    resultEyebrow: 'Resultaat', bravo: 'Goed geprobeerd!', continueTry: 'Ga zo door!',
    auto: 'Auto', chiffres: 'cijfers', nombreOperations: 'Aantal getallen', nombres: 'getallen',
    errEyebrow: 'Herhaling', errTitle: 'Mijn fouten', toutEffacer: '🧹 Alles wissen',
    aucuneErreur: 'Geen fouten om te herzien. Goed gedaan!', reessaie: 'Probeer opnieuw…',
    notCorrect: 'Dat klopt nog niet.', goodAnswer: 'Goed antwoord!',
    felicitations: '🎉 Proficiat!', indice: '💡 Tip', methodeBtn: '🧠 Methode',
    explicationBtn: '📖 Uitleg', reessayer: '🔄 Opnieuw', voirSolution: '👀 Toon de oplossing',
    exerciceSuivant: '➡️ Volgende oefening', conseil: '💡 Tip', solution: 'Oplossing',
    pasGrave: 'Geen probleem, we kijken samen.', aide: '💡 Hulp',
    corrigerPapa: '👨‍👧 Verbeteren met papa', papaTitle: 'We verbeteren samen', aRetravailler: 'Te oefenen', aRetravaillerTitle: 'Mijn aandachtspunten', rienARetravailler: 'Niets te oefenen voor nu. Goed gedaan!', retravaillerIntro: 'Kies een punt om te versterken: ik maak gelijkaardige oefeningen.',
  },
  en: {
    monCahier: 'My notebook', monCahierTitle: 'My exercise notebook',
    chooseWork: 'Choose what you want to practise.',
    ateliers: '⭐ Maths workshops', matiere: '1. Subject', typeExercice: '2. Type of exercise',
    tailleNombres: 'Number size', niveau: '3. Level', combien: '4. How many exercises?',
    creerCahier: '✏️ Create my notebook', mesErreurs: 'My mistakes',
    instructionNotebook: '✍️ Do these exercises in your real notebook. Take your time!',
    finishedNotebook: '✅ I finished my notebook', ficheTitle: 'Exercises',
    verifTitle: 'Checking my work', verifEyebrow: '📋 Check',
    verifQuestion: 'Did you finish all the exercises in your notebook?',
    voirReponses: '🔍 See the answers', faireTest: '📝 Take the test in the app',
    continuerCahier: '← Keep working in my notebook',
    reponsesTitle: 'The answers', reponsesEyebrow: '🔍 Answers',
    compare: 'Compare with what you wrote in your notebook.',
    exercice: 'Exercise', reponse: 'Answer', voirExplications: '📖 See the explanations',
    continuerNouvelle: '➕ Continue (new sheet)',
    explicationsTitle: 'Understanding my exercises', explicationsEyebrow: '📖 Explanations',
    commentReflechir: '🧠 How to think?', methode: 'Method:',
    refaire: '🔄 New notebook', choisirAutres: '🔄 Choose other exercises',
    question: 'Question', taReponse: 'Your answer…', verifier: 'Check',
    suivant: 'Next →', terminer: 'Finish', voirResultat: 'See the result',
    resultEyebrow: 'Result', bravo: 'Well done, good try!', continueTry: 'Keep it up!',
    auto: 'Auto', chiffres: 'digits', nombreOperations: 'Number of terms', nombres: 'numbers',
    errEyebrow: 'Review', errTitle: 'My mistakes', toutEffacer: '🧹 Clear all',
    aucuneErreur: 'No mistakes to review. Well done!', reessaie: 'Try again…',
    notCorrect: 'Not quite right yet.', goodAnswer: 'Correct answer!',
    felicitations: '🎉 Well done!', indice: '💡 Hint', methodeBtn: '🧠 Method',
    explicationBtn: '📖 Explanation', reessayer: '🔄 Try again', voirSolution: '👀 See the solution',
    exerciceSuivant: '➡️ Next exercise', conseil: '💡 Tip', solution: 'Solution',
    pasGrave: 'It’s okay, let’s look together.', aide: '💡 Help',
    corrigerPapa: '👨‍👧 Correct with dad', papaTitle: 'Let’s correct together', aRetravailler: 'To practise', aRetravaillerTitle: 'My weak points', rienARetravailler: 'Nothing to practise yet. Well done!', retravaillerIntro: 'Pick a point to strengthen: I’ll make similar exercises.',
  },
  es: {
    monCahier: 'Mi cuaderno', monCahierTitle: 'Mi cuaderno de ejercicios',
    chooseWork: 'Elige lo que quieres practicar.',
    ateliers: '⭐ Talleres de mates', matiere: '1. Materia', typeExercice: '2. Tipo de ejercicio',
    tailleNombres: 'Tamaño de los números', niveau: '3. Nivel', combien: '4. ¿Cuántos ejercicios?',
    creerCahier: '✏️ Crear mi cuaderno', mesErreurs: 'Mis errores',
    instructionNotebook: '✍️ Haz estos ejercicios en tu cuaderno de verdad. ¡Tómate tu tiempo!',
    finishedNotebook: '✅ Terminé mi cuaderno', ficheTitle: 'Ejercicios',
    verifTitle: 'Revisar mi trabajo', verifEyebrow: '📋 Revisión',
    verifQuestion: '¿Terminaste todos los ejercicios en tu cuaderno?',
    voirReponses: '🔍 Ver las respuestas', faireTest: '📝 Hacer el test en la app',
    continuerCahier: '← Seguir en mi cuaderno',
    reponsesTitle: 'Las respuestas', reponsesEyebrow: '🔍 Respuestas',
    compare: 'Compara con lo que escribiste en tu cuaderno.',
    exercice: 'Ejercicio', reponse: 'Respuesta', voirExplications: '📖 Ver las explicaciones',
    continuerNouvelle: '➕ Continuar (hoja nueva)',
    explicationsTitle: 'Entender mis ejercicios', explicationsEyebrow: '📖 Explicaciones',
    commentReflechir: '🧠 ¿Cómo pensar?', methode: 'Método:',
    refaire: '🔄 Otro cuaderno', choisirAutres: '🔄 Elegir otros ejercicios',
    question: 'Pregunta', taReponse: 'Tu respuesta…', verifier: 'Comprobar',
    suivant: 'Siguiente →', terminer: 'Terminar', voirResultat: 'Ver el resultado',
    resultEyebrow: 'Resultado', bravo: '¡Bravo, buen intento!', continueTry: '¡Sigue así!',
    auto: 'Auto', chiffres: 'cifras', nombreOperations: 'Número de operaciones', nombres: 'números',
    errEyebrow: 'Repaso', errTitle: 'Mis errores', toutEffacer: '🧹 Borrar todo',
    aucuneErreur: 'No hay errores que repasar. ¡Bravo!', reessaie: 'Inténtalo otra vez…',
    notCorrect: 'Todavía no es correcto.', goodAnswer: '¡Respuesta correcta!',
    felicitations: '🎉 ¡Felicidades!', indice: '💡 Pista', methodeBtn: '🧠 Método',
    explicationBtn: '📖 Explicación', reessayer: '🔄 Reintentar', voirSolution: '👀 Ver la solución',
    exerciceSuivant: '➡️ Siguiente ejercicio', conseil: '💡 Consejo', solution: 'Solución',
    pasGrave: 'No pasa nada, lo miramos juntos.', aide: '💡 Ayuda',
    corrigerPapa: '👨‍👧 Corregir con papá', papaTitle: 'Corregimos juntos', aRetravailler: 'Para repasar', aRetravaillerTitle: 'Mis puntos a reforzar', rienARetravailler: 'Nada que repasar por ahora. ¡Bravo!', retravaillerIntro: 'Elige un punto a reforzar: te preparo ejercicios parecidos.',
  },
};

// Subject / type / level display labels by id, per locale.
const LABELS = {
  fr: { math: 'Mathématiques', french: 'Français', dictee: 'Dictée',
    easy: 'Facile', medium: 'Moyen', hard: 'Difficile' },
  nl: { math: 'Wiskunde', french: 'Frans', dictee: 'Dictee',
    easy: 'Makkelijk', medium: 'Gemiddeld', hard: 'Moeilijk' },
  en: { math: 'Maths', french: 'French', dictee: 'Dictation',
    easy: 'Easy', medium: 'Medium', hard: 'Hard' },
  es: { math: 'Matemáticas', french: 'Francés', dictee: 'Dictado',
    easy: 'Fácil', medium: 'Medio', hard: 'Difícil' },
};

export const THINKING_TIPS_I18N = {
  fr: {
    math: ['Commence par les unités.', 'Regarde les dizaines ensuite.', 'Découpe le calcul en petites étapes.'],
    french: ['Lis toute la phrase d’abord.', 'Cherche le mot qui sonne juste.', 'Relis une deuxième fois.'],
    dictee: ['Écoute bien le mot en entier.', 'Découpe le mot en syllabes.', 'Relis ce que tu as écrit.'],
  },
  nl: {
    math: ['Begin met de eenheden.', 'Kijk daarna naar de tientallen.', 'Verdeel de som in kleine stappen.'],
    french: ['Lees eerst de hele zin.', 'Zoek het woord dat juist klinkt.', 'Lees nog een keer na.'],
    dictee: ['Luister goed naar het hele woord.', 'Verdeel het woord in lettergrepen.', 'Lees na wat je schreef.'],
  },
  en: {
    math: ['Start with the units.', 'Then look at the tens.', 'Break the sum into small steps.'],
    french: ['Read the whole sentence first.', 'Look for the word that sounds right.', 'Read it again to check.'],
    dictee: ['Listen to the whole word.', 'Split the word into syllables.', 'Re-read what you wrote.'],
  },
  es: {
    math: ['Empieza por las unidades.', 'Mira las decenas después.', 'Divide el cálculo en pasos pequeños.'],
    french: ['Lee toda la frase primero.', 'Busca la palabra que suena bien.', 'Relee una segunda vez.'],
    dictee: ['Escucha bien la palabra entera.', 'Separa la palabra en sílabas.', 'Relee lo que escribiste.'],
  },
};

function pickLocale(locale) {
  return UI[locale] ? locale : 'fr';
}

/** Plain (non-hook) translator factory — usable in non-React modules too. */
export function makeCahierT(locale) {
  const lc = pickLocale(locale);
  return {
    locale: lc,
    t: (key) => UI[lc][key] ?? UI.fr[key] ?? key,
    label: (id) => LABELS[lc][id] ?? LABELS.fr[id] ?? id,
    tips: (subject) => THINKING_TIPS_I18N[lc][subject] || THINKING_TIPS_I18N[lc].math,
  };
}

/** React hook bound to the active app locale. */
export function useCahierT() {
  const { locale } = useLocale();
  return makeCahierT(locale);
}
