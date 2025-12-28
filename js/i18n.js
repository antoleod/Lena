(function () {
  'use strict';

  const STORAGE_KEY = 'mathsLenaLanguage';
  const DEFAULT_LANGUAGE = 'fr';
  const LANGUAGE_LABELS = {
    fr: 'Français',
    nl: 'Nederlands',
    es: 'Español'
  };
  const LANGUAGE_LOCALES = {
    fr: 'fr-FR',
    nl: 'nl-NL',
    es: 'es-ES'
  };

  const STRINGS = {
    fr: {
      languageLabel: 'Langue',
      languageSelectAria: 'Choisir la langue',
      confirmLogout: 'Veux-tu vraiment te déconnecter ?',
      navHome: 'Accueil',
      navShop: 'Boutique',
      navAchievements: 'Succès',
      navLibrary: 'Bibliothèque',
      navBack: 'Retour',
      navLogout: 'Sortir',
      audioOn: 'Son actif',
      audioOff: 'Son coupé',
      notifications: 'Notifications',
      levelLabel: 'Niveau',
      fallbackName: 'Ami Magique',
      loginBadge: '✨ Choisis ton avatar ✨',
      loginTitle: 'Bienvenue dans ton aventure magique',
      loginSteps: 'Sélectionne un avatar, choisis ta couleur préférée et écris ton prénom.',
      selectedAvatarLabel: 'Avatar choisi',
      selectedAvatarPlaceholder: 'Choisis ton avatar',
      selectedNameLabel: 'Ton prénom',
      selectedNamePlaceholder: 'Écris ton prénom',
      avatarSectionTitle: 'Avatars délicieux',
      avatarListLabel: 'Choisis ton avatar préféré',
      namePlaceholder: 'Écris ton prénom ici...',
      nameAria: 'Écris ton prénom',
      colorSectionTitle: 'Choisis ta couleur préférée',
      colorListLabel: 'Choisis ta couleur préférée',
      loginButton: 'Entrer dans le monde de Léna',
      loginError: 'Écris ton prénom et choisis un avatar ✨',
      gameBack: 'Retour',
      gameWorld: 'Monde Magique',
      gameReady: 'Prêt à jouer',
      gameHint: 'Indice',
      gameStart: 'Démarrer',
      gameValidate: 'Valider',
      gameNext: 'Suite',
      gameCalm: 'Calme',
      shopTitle: 'Boutique de récompenses',
      shopClose: 'Fermer la boutique',
      shopSubtitle: 'Échange tes pièces contre des cadeaux magiques ✨',
      shopAvailable: 'Articles disponibles',
      shopInventory: 'Mes trésors',
      sectionMathTitle: 'Mathématiques',
      sectionLogicTitle: 'Logique & Raisonnement',
      sectionWordsTitle: 'Mots & Lecture',
      sectionCreativeTitle: 'Créatif & Monde',
      sectionEmotionsTitle: 'Cœur & Émotions',
      itemAdditions: 'Additions',
      itemSubtractions: 'Soustractions',
      itemMultiplications: 'Multiplications',
      itemDivisions: 'Divisions',
      itemMathSprint: 'Maths Sprint',
      itemAbacus: 'Abaque Magique',
      itemNumberHouses: 'Maisons des Nombres',
      itemTime: 'Temps & Horloges',
      itemMeasures: 'Mesures Magiques',
      itemFractions: 'Fractions Fantastiques',
      itemLabyrinth: 'Labyrinthe Logique',
      itemSequences: 'Jeu des Séquences',
      itemSorting: 'Tri & Classement',
      itemSudoku: 'Sudoku Junior',
      itemSymmetry: 'Symétrie Magique',
      itemComparisonCards: 'Cartes Comparatives',
      itemPathNetworks: 'Réseaux de Chemins',
      itemLogicgrams: 'Logigrammes (Si… Alors…) ',
      itemRiddles: 'Jeu d’Énigmes',
      itemRepartis: 'Répartis & Multiplie',
      itemReading: 'Lecture Magique',
      itemBigAdventure: 'La Grande Aventure des Mots',
      itemToolWords: 'Mots-Outils',
      itemVowels: 'Jeu des Voyelles',
      itemWitches: 'Les Sorcières — Jeu de Mémoire Magique',
      itemDictation: 'Dictée Magique',
      itemColors: 'Les Couleurs / Atelier d’Art',
      itemPuzzle: 'Puzzle Magique',
      itemWorldMap: 'Carte du Monde Interactive',
      itemNature: 'Découvre la Nature',
      itemCursive: 'J’écris en cursive',
      itemTales: 'Contes Magiques',
      itemEmotions: 'Émotions Magiques',
      itemDailyMissions: 'Missions du Jour',
      itemDailyQuiz: 'Quiz du Jour',
      itemBreath: 'Respire & Repose-toi',
      itemSelfExpression: 'Expression de Soi / Mon Journal'
    },
    es: {
      languageLabel: 'Idioma',
      languageSelectAria: 'Elegir idioma',
      confirmLogout: '¿Quieres cerrar sesión?',
      navHome: 'Inicio',
      navShop: 'Tienda',
      navAchievements: 'Logros',
      navLibrary: 'Biblioteca',
      navBack: 'Volver',
      navLogout: 'Salir',
      audioOn: 'Sonido activo',
      audioOff: 'Sonido silenciado',
      notifications: 'Notificaciones',
      levelLabel: 'Nivel',
      fallbackName: 'Amigo mágico',
      loginBadge: '✨ Elige tu avatar ✨',
      loginTitle: 'Bienvenida a tu aventura mágica',
      loginSteps: 'Selecciona un avatar, elige tu color favorito y escribe tu nombre.',
      selectedAvatarLabel: 'Avatar elegido',
      selectedAvatarPlaceholder: 'Elige tu avatar',
      selectedNameLabel: 'Tu nombre',
      selectedNamePlaceholder: 'Escribe tu nombre',
      avatarSectionTitle: 'Avatares deliciosos',
      avatarListLabel: 'Elige tu avatar favorito',
      namePlaceholder: 'Escribe tu nombre aquí...',
      nameAria: 'Escribe tu nombre',
      colorSectionTitle: 'Elige tu color favorito',
      colorListLabel: 'Elige tu color favorito',
      loginButton: 'Entrar en el mundo de Lena',
      loginError: 'Escribe tu nombre y elige un avatar ✨',
      gameBack: 'Volver',
      gameWorld: 'Mundo Mágico',
      gameReady: 'Lista para jugar',
      gameHint: 'Pista',
      gameStart: 'Empezar',
      gameValidate: 'Validar',
      gameNext: 'Siguiente',
      gameCalm: 'Calma',
      shopTitle: 'Tienda de recompensas',
      shopClose: 'Cerrar la tienda',
      shopSubtitle: 'Cambia tus monedas por regalos mágicos ✨',
      shopAvailable: 'Artículos disponibles',
      shopInventory: 'Mis tesoros',
      sectionMathTitle: 'Matemáticas',
      sectionLogicTitle: 'Lógica y razonamiento',
      sectionWordsTitle: 'Palabras y lectura',
      sectionCreativeTitle: 'Creativo y mundo',
      sectionEmotionsTitle: 'Corazón y emociones',
      itemAdditions: 'Sumas',
      itemSubtractions: 'Restas',
      itemMultiplications: 'Multiplicaciones',
      itemDivisions: 'Divisiones',
      itemMathSprint: 'Sprint Matemático',
      itemAbacus: 'Ábaco mágico',
      itemNumberHouses: 'Casas de números',
      itemTime: 'Tiempo y relojes',
      itemMeasures: 'Medidas mágicas',
      itemFractions: 'Fracciones fantásticas',
      itemLabyrinth: 'Laberinto lógico',
      itemSequences: 'Juego de secuencias',
      itemSorting: 'Clasificar y ordenar',
      itemSudoku: 'Sudoku junior',
      itemSymmetry: 'Simetría mágica',
      itemComparisonCards: 'Cartas comparativas',
      itemPathNetworks: 'Redes de caminos',
      itemLogicgrams: 'Logigramas (Si… Entonces…)',
      itemRiddles: 'Juego de enigmas',
      itemRepartis: 'Reparte y multiplica',
      itemReading: 'Lectura mágica',
      itemBigAdventure: 'La gran aventura de las palabras',
      itemToolWords: 'Palabras herramienta',
      itemVowels: 'Juego de vocales',
      itemWitches: 'Las brujas — Juego de memoria mágico',
      itemDictation: 'Dictado mágico',
      itemColors: 'Colores / Taller de arte',
      itemPuzzle: 'Puzzle mágico',
      itemWorldMap: 'Mapa del mundo interactivo',
      itemNature: 'Descubre la naturaleza',
      itemCursive: 'Escribo en cursiva',
      itemTales: 'Cuentos mágicos',
      itemEmotions: 'Emociones mágicas',
      itemDailyMissions: 'Misiones del día',
      itemDailyQuiz: 'Quiz del día',
      itemBreath: 'Respira y descansa',
      itemSelfExpression: 'Expresión personal / Mi diario'
    },
    nl: {
      languageLabel: 'Taal',
      languageSelectAria: 'Taal kiezen',
      confirmLogout: 'Wil je echt uitloggen?',
      navHome: 'Start',
      navShop: 'Winkel',
      navAchievements: 'Prestaties',
      navLibrary: 'Bibliotheek',
      navBack: 'Terug',
      navLogout: 'Uitloggen',
      audioOn: 'Geluid aan',
      audioOff: 'Geluid uit',
      notifications: 'Meldingen',
      levelLabel: 'Niveau',
      fallbackName: 'Magische vriend',
      loginBadge: '✨ Kies je avatar ✨',
      loginTitle: 'Welkom in je magische avontuur',
      loginSteps: 'Kies een avatar, je favoriete kleur en schrijf je naam.',
      selectedAvatarLabel: 'Gekozen avatar',
      selectedAvatarPlaceholder: 'Kies je avatar',
      selectedNameLabel: 'Je naam',
      selectedNamePlaceholder: 'Schrijf je naam',
      avatarSectionTitle: 'Heerlijke avatars',
      avatarListLabel: 'Kies je favoriete avatar',
      namePlaceholder: 'Schrijf je naam hier...',
      nameAria: 'Schrijf je naam',
      colorSectionTitle: 'Kies je favoriete kleur',
      colorListLabel: 'Kies je favoriete kleur',
      loginButton: 'Ga naar de wereld van Lena',
      loginError: 'Schrijf je naam en kies een avatar ✨',
      gameBack: 'Terug',
      gameWorld: 'Magische Wereld',
      gameReady: 'Klaar om te spelen',
      gameHint: 'Hint',
      gameStart: 'Start',
      gameValidate: 'Bevestigen',
      gameNext: 'Volgende',
      gameCalm: 'Rust',
      shopTitle: 'Beloningswinkel',
      shopClose: 'Winkel sluiten',
      shopSubtitle: 'Ruil je munten voor magische cadeaus ✨',
      shopAvailable: 'Beschikbare items',
      shopInventory: 'Mijn schatten',
      sectionMathTitle: 'Wiskunde',
      sectionLogicTitle: 'Logica en redeneren',
      sectionWordsTitle: 'Woorden en lezen',
      sectionCreativeTitle: 'Creatief en wereld',
      sectionEmotionsTitle: 'Hart en emoties',
      itemAdditions: 'Optellen',
      itemSubtractions: 'Aftrekken',
      itemMultiplications: 'Vermenigvuldigen',
      itemDivisions: 'Delen',
      itemMathSprint: 'Maths Sprint',
      itemAbacus: 'Magisch telraam',
      itemNumberHouses: 'Getallenhuizen',
      itemTime: 'Tijd en klokken',
      itemMeasures: 'Magische maten',
      itemFractions: 'Fantastische breuken',
      itemLabyrinth: 'Logisch labyrint',
      itemSequences: 'Volgorde spel',
      itemSorting: 'Sorteren en rangschikken',
      itemSudoku: 'Sudoku junior',
      itemSymmetry: 'Magische symmetrie',
      itemComparisonCards: 'Vergelijkingskaarten',
      itemPathNetworks: 'Netwerken van paden',
      itemLogicgrams: 'Logigrammen (Als… Dan…)',
      itemRiddles: 'Raadselspel',
      itemRepartis: 'Verdelen en vermenigvuldigen',
      itemReading: 'Magisch lezen',
      itemBigAdventure: 'Het grote woordenavontuur',
      itemToolWords: 'Hulwoorden',
      itemVowels: 'Klinkerspel',
      itemWitches: 'De heksen — magisch geheugenspel',
      itemDictation: 'Magische dictee',
      itemColors: 'Kleuren / Atelier',
      itemPuzzle: 'Magische puzzel',
      itemWorldMap: 'Interactieve wereldkaart',
      itemNature: 'Ontdek de natuur',
      itemCursive: 'Ik schrijf cursief',
      itemTales: 'Magische verhalen',
      itemEmotions: 'Magische emoties',
      itemDailyMissions: 'Missies van de dag',
      itemDailyQuiz: 'Quiz van de dag',
      itemBreath: 'Adem en rust',
      itemSelfExpression: 'Zelfexpressie / Mijn dagboek'
    }
  };

  function readStoredLanguage() {
    try {
      if (window.storage?.getLanguage) {
        return window.storage.getLanguage();
      }
    } catch (error) {
      console.warn('[i18n] storage.getLanguage failed', error);
    }
    try {
      return window.localStorage?.getItem(STORAGE_KEY);
    } catch (error) {
      console.warn('[i18n] localStorage read failed', error);
      return null;
    }
  }

  function normalizeLanguage(lang) {
    if (!lang || typeof lang !== 'string') {
      return DEFAULT_LANGUAGE;
    }
    const trimmed = lang.trim().toLowerCase();
    return STRINGS[trimmed] ? trimmed : DEFAULT_LANGUAGE;
  }

  function getLanguage() {
    return normalizeLanguage(readStoredLanguage() || DEFAULT_LANGUAGE);
  }

  function getSpeechLang() {
    const lang = getLanguage();
    return LANGUAGE_LOCALES[lang] || LANGUAGE_LOCALES[DEFAULT_LANGUAGE];
  }

  function setLanguage(lang) {
    const normalized = normalizeLanguage(lang);
    try {
      if (window.storage?.setLanguage) {
        window.storage.setLanguage(normalized);
      } else {
        window.localStorage?.setItem(STORAGE_KEY, normalized);
      }
    } catch (error) {
      console.warn('[i18n] Failed to save language', error);
    }
    applyDocumentLang(normalized);
    updateAll();
    document.dispatchEvent(new CustomEvent('lena:language:change', { detail: { lang: normalized } }));
  }

  function t(key) {
    if (!key) { return ''; }
    const lang = getLanguage();
    return STRINGS[lang]?.[key] || STRINGS[DEFAULT_LANGUAGE]?.[key] || key;
  }

  function applyDocumentLang(lang = getLanguage()) {
    document.documentElement.setAttribute('lang', lang);
  }

  function applyTo(root = document) {
    if (!root) { return; }
    root.querySelectorAll('[data-i18n]').forEach(node => {
      const key = node.getAttribute('data-i18n');
      if (!key) { return; }
      node.textContent = t(key);
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach(node => {
      const key = node.getAttribute('data-i18n-placeholder');
      if (!key) { return; }
      node.setAttribute('placeholder', t(key));
    });
    root.querySelectorAll('[data-i18n-aria]').forEach(node => {
      const key = node.getAttribute('data-i18n-aria');
      if (!key) { return; }
      node.setAttribute('aria-label', t(key));
    });
    root.querySelectorAll('[data-i18n-title]').forEach(node => {
      const key = node.getAttribute('data-i18n-title');
      if (!key) { return; }
      node.setAttribute('title', t(key));
    });
  }

  function bindLanguageSelect(selectEl) {
    if (!selectEl) { return; }
    selectEl.innerHTML = '';
    Object.entries(LANGUAGE_LABELS).forEach(([code, label]) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = label;
      selectEl.appendChild(option);
    });
    selectEl.value = getLanguage();
    selectEl.addEventListener('change', event => {
      setLanguage(event.target.value);
    });
  }

  function initLanguageControls(root = document) {
    root.querySelectorAll('[data-language-select]').forEach(selectEl => {
      bindLanguageSelect(selectEl);
    });
  }

  function updateAll() {
    applyDocumentLang();
    applyTo(document);
    initLanguageControls(document);
  }

  function init() {
    updateAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.i18n = {
    t,
    getLanguage,
    setLanguage,
    getSpeechLang,
    apply: applyTo,
    bindLanguageSelect
  };
})();
