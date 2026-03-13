import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'lena:ui-locale:v1';

const messages = {
  fr: {
    home: 'Accueil',
    mathematics: 'Mathematiques',
    french: 'Francais',
    dutch: 'Neerlandais',
    english: 'Anglais',
    spanish: 'Espagnol',
    stories: 'Histoires',
    shop: 'Boutique',
    learningAdventure: "Aventure d'apprentissage",
    footer: 'Des petits pas, des couleurs douces et une victoire a chaque mission.',
    heroEyebrow: 'Parcours magique',
    heroTitle: 'Apprendre avec douceur, couleurs et petits defis bien penses.',
    heroText: "Chaque matiere propose des missions courtes, claires et rassurantes: on s'entraine d'abord, puis on termine par un mini defi.",
    heroBadge1: '10 exercices guides',
    heroBadge2: 'Mini examen final',
    heroBadge3: 'Progression visible',
    enterMath: 'Entrer en mathematiques',
    seeFrench: 'Voir le francais',
    universes: 'Univers',
    missions: 'Missions',
    classes: 'Classes',
    rhythm: 'Rythme',
    practiceExam: 'Pratique + defi',
    byDomain: 'Par domaine',
    chooseUniverse: 'Choisir un univers',
    favoriteMissions: 'Missions preferees',
    startAdventure: 'Commencer une aventure',
    openActivity: "Ouvrir l'activite",
    subjectJourney: 'Parcours du sujet',
    chooseLevel: 'Choisir un niveau',
    launch: 'Lancer',
    subjectNotFound: 'Sujet introuvable',
    activityNotFound: 'Activite introuvable',
    backHome: "Retour a l'accueil",
    backSubject: 'Retour au sujet',
    level: 'Niveau',
    duration: 'Duree',
    origin: 'Origine',
    progression: 'Progression',
    completed: 'Terminee',
    inProgress: 'En cours',
    mode: 'Mode',
    hints: 'Indices',
    generatedMode: 'Generation',
    exercise: 'Exercice',
    examMode: 'Mode examen',
    practiceMode: 'Mode pratique',
    hint: 'Indice',
    noQuestion: 'Aucune question disponible.',
    noStory: 'Aucune histoire disponible.',
    noLevel: 'Aucun niveau disponible.',
    activityDone: 'Activite terminee',
    readingDone: 'Lecture terminee',
    missionDone: 'Mission terminee',
    newLevel: 'Nouveau niveau',
    miniExam: 'Mini examen',
    continueStep: 'Tu continues avec une nouvelle etape.',
    start: 'Commencer',
    correctAnswer: 'Bonne reponse',
    reviewTogether: 'On corrige ensemble',
    answer: 'Repondre',
    validate: 'Valider',
    finish: 'Terminer',
    continue: 'Continuer',
    nextQuestion: 'Question suivante',
    verify: 'Verifier',
    groupTen: 'Grouper 10 unites',
    breakTen: 'Casser 1 dizaine',
    tens: 'Dizaines',
    ones: 'Unites',
    buildNumber: 'Construis le nombre',
    story: 'Histoire',
    validateAnswer: 'Valider la reponse',
    scoreSaved: 'Score enregistre',
    uiLanguage: 'Langue',
    generatedLabel: 'Activites dynamiques',
    readingAndUnderstanding: 'Lecture et comprehension',
    smartTraining: 'Entrainement intelligent'
    ,
    crystals: 'cristaux',
    shopTitle: 'Recompenses a debloquer',
    shopText: 'Chaque exercice reussi rapporte des cristaux. Utilise les pour acheter des stickers et des avatars.',
    shopOwnedItems: 'objets',
    shopChooseReward: 'Choisir une recompense',
    shopBuy: 'Acheter',
    shopBought: 'Recompense achetee',
    shopOwned: 'Deja obtenu',
    shopNeedMore: 'Il faut plus de cristaux'
    ,
    theme: 'theme',
    shopEquip: 'Appliquer',
    shopEquipped: 'Actif',
    shopThemes: 'Themes',
    shopThemeApplied: 'Theme applique'
  },
  nl: {
    home: 'Start',
    mathematics: 'Wiskunde',
    french: 'Frans',
    dutch: 'Nederlands',
    english: 'Engels',
    spanish: 'Spaans',
    stories: 'Verhalen',
    shop: 'Winkel',
    learningAdventure: 'Leeravontuur',
    footer: 'Kleine stapjes, zachte kleuren en een overwinning bij elke missie.',
    heroEyebrow: 'Magisch parcours',
    heroTitle: 'Leren met rust, kleur en kleine doordachte uitdagingen.',
    heroText: 'Elk vak heeft korte, duidelijke en geruststellende missies: eerst oefenen, daarna een kleine toets.',
    heroBadge1: '10 begeleide oefeningen',
    heroBadge2: 'Kleine eindtoets',
    heroBadge3: 'Zichtbare vooruitgang',
    enterMath: 'Naar wiskunde',
    seeFrench: 'Bekijk frans',
    universes: 'Werelden',
    missions: 'Missies',
    classes: 'Leerjaren',
    rhythm: 'Ritme',
    practiceExam: 'Oefenen + toets',
    byDomain: 'Per domein',
    chooseUniverse: 'Kies een wereld',
    favoriteMissions: 'Favoriete missies',
    startAdventure: 'Start een avontuur',
    openActivity: 'Open activiteit',
    subjectJourney: 'Leerpad',
    chooseLevel: 'Kies een niveau',
    launch: 'Start',
    subjectNotFound: 'Vak niet gevonden',
    activityNotFound: 'Activiteit niet gevonden',
    backHome: 'Terug naar start',
    backSubject: 'Terug naar vak',
    level: 'Niveau',
    duration: 'Duur',
    origin: 'Bron',
    progression: 'Voortgang',
    completed: 'Klaar',
    inProgress: 'Bezig',
    mode: 'Modus',
    hints: 'Hints',
    generatedMode: 'Generator',
    exercise: 'Oefening',
    examMode: 'Toetsmodus',
    practiceMode: 'Oefenmodus',
    hint: 'Hint',
    noQuestion: 'Geen vraag beschikbaar.',
    noStory: 'Geen verhaal beschikbaar.',
    noLevel: 'Geen niveau beschikbaar.',
    activityDone: 'Activiteit klaar',
    readingDone: 'Lezen klaar',
    missionDone: 'Missie klaar',
    newLevel: 'Nieuw niveau',
    miniExam: 'Mini toets',
    continueStep: 'Je gaat verder met een nieuwe stap.',
    start: 'Beginnen',
    correctAnswer: 'Goed antwoord',
    reviewTogether: 'We bekijken het samen',
    answer: 'Antwoorden',
    validate: 'Controleren',
    finish: 'Afronden',
    continue: 'Verder',
    nextQuestion: 'Volgende vraag',
    verify: 'Controleren',
    groupTen: '10 eenheden groeperen',
    breakTen: '1 tiental splitsen',
    tens: 'Tientallen',
    ones: 'Eenheden',
    buildNumber: 'Maak het getal',
    story: 'Verhaal',
    validateAnswer: 'Controleer antwoord',
    scoreSaved: 'Score opgeslagen',
    uiLanguage: 'Taal',
    generatedLabel: 'Dynamische activiteiten',
    readingAndUnderstanding: 'Lezen en begrijpen',
    smartTraining: 'Slim oefenen'
    ,
    crystals: 'kristallen',
    shopTitle: 'Beloningen om vrij te spelen',
    shopText: 'Elke geslaagde oefening geeft kristallen. Gebruik ze om stickers en avatars te kopen.',
    shopOwnedItems: 'items',
    shopChooseReward: 'Kies een beloning',
    shopBuy: 'Kopen',
    shopBought: 'Beloning gekocht',
    shopOwned: 'Al in bezit',
    shopNeedMore: 'Je hebt meer kristallen nodig'
    ,
    theme: 'thema',
    shopEquip: 'Toepassen',
    shopEquipped: 'Actief',
    shopThemes: 'Themas',
    shopThemeApplied: 'Thema toegepast'
  }
};

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    try {
      return window.localStorage.getItem(STORAGE_KEY) || 'fr';
    } catch {
      return 'fr';
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore persistence failures
    }
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    setLocale,
    t: (key) => messages[locale]?.[key] || messages.fr[key] || key
  }), [locale]);

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}
