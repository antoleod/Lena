# Lena — Architecture & Navigation Map

> Dernière mise à jour : 2026-06-10  
> Stack : React 18 + React Router 6 + Vite + PWA

---

## Structure des dossiers

```
src/
├── app/
│   ├── App.jsx                        Point d'entrée React
│   ├── ErrorBoundary.jsx              Récupération d'erreur → redirect /
│   ├── layout/
│   │   ├── AppShell.jsx               Shell principal (nav, sidebar, bottom bar)
│   │   └── soundService.js            Sons UI globaux
│   ├── providers/
│   │   └── AppProviders.jsx           Contextes globaux (Locale, Theme, Session)
│   └── routing/
│       └── AppRouter.jsx              Toutes les routes <Route>
│
├── assets/icons/                      Composants SVG d'icônes (AppIcons, NavIcons…)
│
├── content/                           Données statiques (JSON, catalogues)
│   ├── curriculum/                    Template de module pédagogique
│   ├── exam/                          380+ fichiers JSON + registry.js
│   ├── fun/                           Blagues, devinettes, proverbes
│   ├── language-packs/                Vocabulaire visuel
│   ├── lecture/                       Schéma + i18n + stories pour la lecture
│   ├── lessons/                       Catalogue de leçons
│   ├── registry/                      activityRegistry, worldRegistry
│   ├── renforcement/                  Sections de renforcement
│   ├── worlds/                        worldMapData, index
│   ├── [dutch|english|french|spanish|stories|reasoning|mathematics|sciences|histoire|finance|informatique|logique]/
│   │   ├── activities.js              Activités statiques
│   │   ├── generatedActivities.js     Activités générées dynamiquement
│   │   └── grade-2…grade-6.js        Contenu par niveau scolaire
│   └── funContent.js                  Alias legacy → fun/funData.js
│
├── engines/                           Moteurs de génération d'exercices
│   ├── activity-engine/               Descripteurs, validateurs, rendu
│   ├── generators/                    27 générateurs (addition, fractions, géométrie…)
│   ├── learning/                      lessonComposer.js
│   ├── language/                      generateLanguageExercise.js
│   ├── math/                          generateMathExercise.js
│   ├── logic/                         generateLogicExercise.js
│   ├── renforcement/                  Activités visuelles (coloriage, grille, tracer, spot)
│   ├── base-ten/                      BaseTenActivity.jsx
│   ├── multiple-choice/               MultipleChoiceActivity.jsx
│   ├── story/                         StoryActivity.jsx
│   ├── content-generation/            generatorCatalog.js
│   └── engineRegistry.js              Mapping type → moteur
│
├── features/                          Pages et composants par domaine
│   └── [voir détail par section ci-dessous]
│
├── services/                          Couche de persistance
│   ├── session/sessionStore.js        Session utilisateur en cours
│   ├── learning/levelSystem.js        Calcul de niveau global
│   ├── sound/soundService.js          Service son (alias app/layout/soundService)
│   └── storage/
│       ├── errorHistoryStore.js       Historique des erreurs
│       ├── gameProgressStore.js       Progression des jeux
│       ├── parentalStore.js           Contrôle parental + limites
│       ├── profileStore.js            Profil enfant (nom, avatar, langue)
│       ├── progressStore.js           Progression globale matières
│       └── rewardStore.js             Cristaux, récompenses, effets
│
└── shared/
    ├── gameplay/                      adventureProgress, moduleJourney, worldMap, themes
    ├── hooks/                         useFullScreen, useGameSession, useSpeechPlayer, useWebInstallPrompt
    ├── i18n/                          LocaleContext, contentLocalization
    ├── theme/                         ThemeContext, app.css
    ├── types/                         Modèles de données (contentModels, exerciseModels…)
    ├── ui/                            Composants partagés (FeedbackCard, NumPad, Mascot…)
    └── utils/                         contentResolution, assetUrl
```

---

## Navigation principale (AppShell)

La barre de navigation (bottom sur mobile, sidebar sur tablette/desktop) contient **7 entrées** :

| Icône | Label (FR) | Route | Section active si chemin commence par |
|-------|-----------|-------|---------------------------------------|
| 🏠 | Accueil | `/` | `/` exact |
| 📚 | Apprendre | `/apprendre` | `/apprendre`, `/map`, `/subjects`, `/activities`, `/lessons`, `/stories`, `/renforcement` |
| 🎓 | Examens | `/exam/library` | `/exam` |
| 📓 | Cahier | `/cahier` | `/cahier` |
| 🎮 | Pratiquer | `/pratiquer` | `/pratiquer`, `/jeux`, `/tables`, `/practice` |
| 📈 | Progrès | `/history` | `/history` |
| 🎉 | Fun | `/fun` | `/fun` |

---

## Routes par section

### Accueil & Onboarding
| Route | Composant | Fichier |
|-------|-----------|---------|
| `/` | `HomePage` | `features/home/HomePage.jsx` |
| `/onboarding` | `OnboardingFlow` | `features/onboarding/OnboardingFlow.jsx` |
| `/home` | → redirect `/` | — |
| `/continue` | `ContinueRedirect` | AppRouter (composant inline) |

---

### Apprendre — `/apprendre`
| Route | Composant | Fichier |
|-------|-----------|---------|
| `/apprendre` | `ApprendreHubPage` | `features/apprendre/ApprendreHubPage.jsx` |
| `/map` | `MapPage` | `features/map/MapPage.jsx` |
| `/map/:worldId` | `WorldDetailPage` | `features/map/WorldDetailPage.jsx` |
| `/map/:worldId/missions/:missionId` | `MissionPage` | `features/map/MissionPage.jsx` |
| `/subjects` | `SubjectsHubPage` | `features/subject/SubjectsHubPage.jsx` |
| `/subjects/:subjectId` | `SubjectPage` | `features/subject/SubjectPage.jsx` |
| `/subjects/:subjectId/grades/:gradeId` | `GradePage` | `features/grade/GradePage.jsx` |
| `/subjects/:subjectId/grades/:gradeId/modules/:moduleId` | `ModulePage` | `features/module/ModulePage.jsx` |
| `/subjects/:subjectId/grades/:gradeId/modules/:moduleId/:activityId` | redirect → ActivityPage | AppRouter inline |
| `/activities/:activityId` | `ActivityPage` | `features/activity/ActivityPage.jsx` |
| `/lessons` | `LessonsHubPage` | `features/lessons/LessonsHubPage.jsx` |
| `/lessons/:lessonId` | `LessonPlayerPage` | `features/lessons/LessonPlayerPage.jsx` |
| `/stories` | `StoryLibraryPage` | `features/stories/StoryLibraryPage.jsx` |
| `/stories/:id` | `StoryReaderPage` | `features/stories/StoryReaderPage.jsx` |
| `/renforcement` | `RenforcementHubPage` | `features/renforcement/RenforcementHubPage.jsx` |
| `/renforcement/:sectionId` | `RenforcementSectionPage` | `features/renforcement/RenforcementSectionPage.jsx` |
| `/mission/:missionId` | `MissionRedirect` | AppRouter inline |
| `/lesson/:lessonId` | `LessonRedirect` | AppRouter inline |

---

### Examens — `/exam`
| Route | Composant | Fichier |
|-------|-----------|---------|
| `/exam` | `ExamHubPage` | `features/exam/ExamHubPage.jsx` |
| `/exam/library` | `ExamLibraryHubPage` | `features/exam/library/ExamLibraryHubPage.jsx` |
| `/exam/library/:categoryId` | `ExamLibraryCategoryPage` | `features/exam/library/ExamLibraryCategoryPage.jsx` |
| `/exam/library/play` | `ExamRunnerPage` | `features/exam/library/ExamRunnerPage.jsx` |
| `/exam/history` | `ExamHistoryPage` | `features/exam/library/ExamHistoryPage.jsx` |
| `/exam/repaso` | `ExamRepasoPage` | `features/exam/library/ExamRepasoPage.jsx` |
| `/exam/mega` | `ExamMegaBuilderPage` | `features/exam/library/ExamMegaBuilderPage.jsx` |
| `/exam/mega/play` | `ExamMegaRunnerPage` | `features/exam/library/ExamMegaRunnerPage.jsx` |
| `/exam/play` | `ExamPage` | `features/exam/ExamPage.jsx` |
| `/exam/lecture` | `LectureHubPage` | `features/exam/LectureHubPage.jsx` |
| `/exam/lecture/play` | `LectureReaderPage` | `features/exam/LectureReaderPage.jsx` |
| `/exam/errors` | `ErrorReviewPage` | `features/exam/ErrorReviewPage.jsx` |
| `/exam/grade` | `GradeExamHubPage` | `features/exam/grade/GradeExamHubPage.jsx` |
| `/exam/grade/:grade` | `GradeExamPackPage` | `features/exam/grade/GradeExamPackPage.jsx` |

**Stores exam (localStorage) :**
- `examFavoritesStore.js` — favoris + examens récents (`lena:exam-favorites:v1`, `lena:exam-recent:v1`)
- `examHistoryStore.js` — historique des sessions
- `examLibraryProgress.js` — meilleur score par niveau/catégorie

**Contenu exam :**
- `content/exam/manifest.json` — index de toutes les catégories
- `content/exam/[categorie]/[categorie]-[n].json` — fichiers de questions (380+ fichiers)
- `content/exam/registry.js` — chargement dynamique via `import.meta.glob`

---

### Cahier — `/cahier`
| Route | Composant | Fichier |
|-------|-----------|---------|
| `/cahier` | `ExerciseGeneratorPage` | `features/exerciseGenerator/ExerciseGeneratorPage.jsx` |
| `/cahier/historique` | `CahierHistoryPage` | `features/exerciseGenerator/CahierHistoryPage.jsx` |
| `/cahier/geometrie` | `GeometryPage` | `features/mathGeometry/GeometryPage.jsx` |
| `/cahier/defis-calcul` | `CalculationChallengePage` | `features/mathChallenges/CalculationChallengePage.jsx` |
| `/cahier/calculs-melanges` | `MixedModePage` | `features/exerciseGenerator/MixedModePage.jsx` |

---

### Pratiquer — `/pratiquer`
| Route | Composant | Fichier |
|-------|-----------|---------|
| `/pratiquer` | `PratiquerHubPage` | `features/practise/PratiquerHubPage.jsx` |
| `/tables` | `TablesPage` | `features/tables/TablesPage.jsx` |
| `/practice` | `PracticePage` | `features/practice/PracticePage.jsx` |

---

### Jeux — `/jeux`
| Route | Composant | Fichier |
|-------|-----------|---------|
| `/jeux` | `JeuxHubPage` | `features/jeux/JeuxHubPage.jsx` |
| `/jeux/memory` | `MemoryGamePage` | `features/jeux/MemoryGamePage.jsx` |
| `/jeux/calcul-rapide` | `SpeedMathPage` | `features/jeux/SpeedMathPage.jsx` |
| `/jeux/mots-melanges` | `WordScramblePage` | `features/jeux/WordScramblePage.jsx` |
| `/jeux/mots-caches` | `MotsCachesPage` | `features/jeux/MotsCachesPage.jsx` |
| `/jeux/devinettes` | `DevinettesPage` | `features/jeux/DevinettesPage.jsx` |
| `/jeux/complete-phrase` | `CompleteLaPhrasePage` | `features/jeux/CompleteLaPhrasePage.jsx` |
| `/jeux/intrus` | `TrouveIntrusPage` | `features/jeux/TrouveIntrusPage.jsx` |
| `/jeux/course-maths` | `CourseMathsPage` | `features/jeux/CourseMathsPage.jsx` |
| `/jeux/detective-histoires` | `DetectiveHistoiresPage` | `features/jeux/DetectiveHistoiresPage.jsx` |
| `/jeux/bulles-calcul` | `BullesCalculPage` | `features/jeux/BullesCalculPage.jsx` |
| `/jeux/chasse-lettres` | `ChasseLettrePage` | `features/jeux/ChasseLettrePage.jsx` |
| `/jeux/suite-logique` | `SuiteLogiquePage` | `features/jeux/SuiteLogiquePage.jsx` |
| `/jeux/quiz-culture` | `QuizCulturePage` | `features/jeux/QuizCulturePage.jsx` |
| `/jeux/mots-croises` | `MotsCroisesPage` | `features/jeux/MotsCroisesPage.jsx` |
| `/jeux/saute-mouton` | `SauteMoutonPage` | `features/jeux/SauteMoutonPage.jsx` |
| `/jeux/tetris` | `TetrisPage` | `features/jeux/TetrisPage.jsx` |
| `/jeux/taupes` | `TaupesMathsPage` | `features/jeux/TaupesMathsPage.jsx` |
| `/jeux/conjugue` | `ConjugueVitePage` | `features/jeux/ConjugueVitePage.jsx` |
| `/jeux/horloge` | `HorlogePage` | `features/jeux/HorlogePage.jsx` |
| `/jeux/antonymes` | `AntonymesPage` | `features/jeux/AntonymesPage.jsx` |
| `/jeux/trie-express` | `TrieExpressPage` | `features/jeux/TrieExpressPage.jsx` |
| `/jeux/bombes-maths` | `BombesMathsPage` | `features/jeux/BombesMathsPage.jsx` |
| `/jeux/ordre-alpha` | `OrdreAlphaPage` | `features/jeux/OrdreAlphaPage.jsx` |
| `/jeux/phrase-mystere` | `PhraseMysteryPage` | `features/jeux/PhraseMysteryPage.jsx` |
| `/jeux/histoire-ordre` | `SequenceImagePage` | `features/jeux/SequenceImagePage.jsx` |
| `/jeux/nombre-secret` | `NombreSecretPage` | `features/jeux/NombreSecretPage.jsx` |
| `/jeux/comparaison` | `PlusPetitPlusGrandPage` | `features/jeux/PlusPetitPlusGrandPage.jsx` |
| `/jeux/codeur-maths` | `CodeurMathsPage` | `features/jeux/CodeurMathsPage.jsx` |
| `/jeux/synonymes` | `SynonymesPage` | `features/jeux/SynonymesPage.jsx` |
| `/jeux/vrai-faux` | `VraiFauxPage` | `features/jeux/VraiFauxPage.jsx` |
| `/jeux/capitales` | `CapitalesPage` | `features/jeux/CapitalesPage.jsx` |
| `/jeux/pair-impair` | `PairImpairPage` | `features/jeux/PairImpairPage.jsx` |
| `/jeux/pyramide-nombres` | `PyramideNombresPage` | `features/jeux/PyramideNombresPage.jsx` |
| `/jeux/simon` | `SimonDitPage` | `features/jeux/SimonDitPage.jsx` |
| `/jeux/fractions` | `FractionsPage` | `features/jeux/FractionsPage.jsx` |
| `/jeux/multiplications` | `MultiplicationsPage` | `features/jeux/MultiplicationsPage.jsx` |
| `/jeux/mots-intrus-texte` | `MotsIntrusPage` | `features/jeux/MotsIntrusPage.jsx` |
| `/jeux/memoire-chiffres` | `MemChiffresPage` | `features/jeux/MemChiffresPage.jsx` |
| `/jeux/snake` | `SnakePage` | `features/jeux/SnakePage.jsx` |
| `/jeux/ninja-fruits` | `NinjaFruitsPage` | `features/jeux/NinjaFruitsPage.jsx` |
| `/jeux/bataille-monstres` | `BatailleMonstresPage` | `features/jeux/BatailleMonstresPage.jsx` |
| `/jeux/estimation` | `ComingSoonPage` | — |
| `/jeux/casse-briques` | `ComingSoonPage` | — |
| `/jeux/anagrammes` | `ComingSoonPage` | — |
| `/jeux/poesie` | `ComingSoonPage` | — |
| `/jeux/geometrie` | `ComingSoonPage` | — |
| `/jeux/lecture-vitesse` | `ComingSoonPage` | — |
| `/jeux/sudoku-images` | `ComingSoonPage` | — |
| `/jeux/labyrinthe` | `ComingSoonPage` | — |
| `/jeux/motifs` | `ComingSoonPage` | — |
| `/jeux/objets-caches` | `ComingSoonPage` | — |
| `/jeux/inventions` | `ComingSoonPage` | — |
| `/jeux/animaux` | `ComingSoonPage` | — |

**Redirects de compatibilité :**
- `/jeux/chasse-lettre` → `/jeux/chasse-lettres`
- `/jeux/taupe-maths` → `/jeux/taupes`
- `/jeux/conjugue-vite` → `/jeux/conjugue`
- `/jeux/phrase-mystery` → `/jeux/phrase-mystere`
- `/jeux/plus-petit-plus-grand` → `/jeux/comparaison`

---

### Fun — `/fun`
| Route | Composant | Fichier |
|-------|-----------|---------|
| `/fun` | `FunHubPage` | `features/fun/FunHubPage.jsx` |
| `/fun/:type` | `FunReaderPage` | `features/fun/FunReaderPage.jsx` |

Types disponibles : `blagues`, `devinettes`, `proverbes` (définis dans `content/fun/funData.js`)

---

### Outils pédagogiques autonomes
| Route | Composant | Fichier | Description |
|-------|-----------|---------|-------------|
| `/grammi` | `GrammiPage` | `features/grammi/GrammiPage.jsx` | Exercices de grammaire |
| `/metri` | `MetriPage` | `features/metri/MetriPage.jsx` | Mesures & unités |
| `/lexi` | `LexiPage` | `features/lexi/LexiPage.jsx` | Vocabulaire |
| `/verbes` | `VerbPage` | `features/verbes/VerbPage.jsx` | Conjugaison |
| `/dico` | `DicoPage` | `features/dico/DicoPage.jsx` | Dictionnaire |
| `/dudu` | `DuduPage` | `features/dudu/DuduPage.jsx` | Jeu de dictée |
| `/chrono` | `ChronoPage` | `features/chrono/ChronoPage.jsx` | Chronomètre pédagogique |

---

### Compte & Paramètres
| Route | Composant | Fichier |
|-------|-----------|---------|
| `/history` | `HistoryPage` | `features/history/HistoryPage.jsx` |
| `/stats` | `StatsPage` | `features/stats/StatsPage.jsx` |
| `/settings` | `SettingsPage` | `features/settings/SettingsPage.jsx` |
| `/parental` | `ParentalPage` | `features/parental/ParentalPage.jsx` |
| `/shop` | `ShopPage` | `features/shop/ShopPage.jsx` |
| `/profile` | → redirect `/settings` | — |
| `*` | → redirect `/` ou `/onboarding` | ErrorBoundary + catch-all |

---

## Flux de données (localStorage)

Toutes les données sont stockées en localStorage. Clés principales :

| Clé | Store | Contenu |
|-----|-------|---------|
| `lena:profile:v1` | `profileStore.js` | Nom, avatar, langue, grade |
| `lena:progress:v1` | `progressStore.js` | XP, niveau global, matières |
| `lena:rewards:v1` | `rewardStore.js` | Cristaux, effets, inventaire |
| `lena:gameProgress:v1` | `gameProgressStore.js` | Progression jeux (bestLevel, highscore) |
| `lena:exam-favorites:v1` | `examFavoritesStore.js` | IDs d'examens favoris |
| `lena:exam-recent:v1` | `examFavoritesStore.js` | 10 derniers examens consultés |
| `lena:exam-history:v1` | `examHistoryStore.js` | Sessions d'examen complétées |
| `lena:exam-progress:v1` | `examLibraryProgress.js` | Meilleur score par exam/niveau |
| `lena:parental:v1` | `parentalStore.js` | PIN, limites de temps, stats |
| `lena:ninja-custom:v1` | `NinjaFruitsPage.jsx` | Config perso Ninja Fruits |
| `lena:session:v1` | `sessionStore.js` | Session active (XP, streaks) |

---

## Gestion des erreurs

- **`ErrorBoundary`** (`src/app/ErrorBoundary.jsx`) enveloppe toutes les routes dans AppRouter.
  - Capture tout crash React via `getDerivedStateFromError`.
  - Affiche un écran de récupération avec bouton "Retour à l'accueil".
  - Auto-redirect vers `/` après 4 secondes via `window.location.replace('/')`.
- **Route `*` catch-all** dans AppRouter redirige toute URL inconnue vers `/` (ou `/onboarding` si nouveau).

---

## Fichiers CSS par domaine

| Fichier | Domaine |
|---------|---------|
| `shared/theme/app.css` | Thème global, variables CSS |
| `features/jeux/jeux.css` | Tous les jeux (NinjaFruits, Snake, Tetris…) |
| `features/exerciseGenerator/cahier.css` | Cahier d'exercices |
| `features/exerciseGenerator/mixed-mode.css` | Calculs mélangés |
| `features/mathGeometry/geometry.css` | Géométrie |
| `features/stories/stories.css` | Bibliothèque de contes |
| `features/chrono/chrono.css` | Chronomètre |
| `features/dico/dico.css` | Dictionnaire |
| `features/dudu/dudu.css` | Dudu dictée |
| `features/fun/fun.css` | Section Fun |
| `features/grammi/grammi.css` | Grammaire |
| `features/lexi/lexi.css` | Vocabulaire |
| `features/metri/metri.css` | Mesures |
| `features/stats/stats.css` | Statistiques |
| `features/tables/tables.css` | Tables de multiplication |
| `features/verbes/verb.css` | Conjugaison |
| `shared/ui/NumPad.css` | Pavé numérique |
| `shared/ui/NumericAnswerInput.css` | Saisie réponse numérique |
| `shared/ui/DicoSearchOverlay.css` | Overlay recherche dico |
| `engines/story/storyActivity.css` | Activité histoire |
