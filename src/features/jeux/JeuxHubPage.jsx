import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllGameProgress, getTotalStats, formatDuration } from '../../services/storage/gameProgressStore.js';
import {
  IconGameTetris, IconGameTaupesMaths, IconGameBombesMaths,
  IconGameCasseBriques, IconGameSnake, IconGameNinjaFruits,
  IconGameMotsMelanges, IconGameMotsCaches, IconGameDevinettes,
  IconGameCompletePhrase, IconGameChasseLettres, IconGameAtonymes,
  IconGameOrdreAlpha, IconGameConjugue, IconGameMotsCroises,
  IconGameSynonymes, IconGameAnagrammes, IconGamePoesie,
  IconGameCalculRapide, IconGameCourseMaths, IconGameBullesCalcul,
  IconGameSauteMouton, IconGameHorloge, IconGameFractions,
  IconGameGeometrie, IconGameMultiplications,
  IconGamePhraseMystere, IconGameHistoireOrdre, IconGameDetective,
  IconGameLectureVitesse, IconGameVraiFaux, IconGameMotsIntrus,
  IconGameNombreSecret, IconGameComparaison, IconGameCodeurMaths,
  IconGameSuiteLogique, IconGamePairImpair, IconGamePyramideNombres,
  IconGameEstimation,
  IconGameTrouveIntrus, IconGameTrieExpress, IconGameSudokuImages,
  IconGameLabyrinthe, IconGameMotifs,
  IconGameMemory, IconGameSimon, IconGameObjetsCache, IconGameMemoireChiffres,
  IconGameQuizCulture, IconGameCapitales, IconGameAnimaux, IconGameInventions,
} from '../../assets/icons/GameIcons.jsx';
import './jeux.css';

const GAME_ICON_MAP = {
  '/jeux/tetris':              IconGameTetris,
  '/jeux/taupes':              IconGameTaupesMaths,
  '/jeux/bombes-maths':        IconGameBombesMaths,
  '/jeux/casse-briques':       IconGameCasseBriques,
  '/jeux/snake':               IconGameSnake,
  '/jeux/ninja-fruits':        IconGameNinjaFruits,
  '/jeux/mots-melanges':       IconGameMotsMelanges,
  '/jeux/mots-caches':         IconGameMotsCaches,
  '/jeux/devinettes':          IconGameDevinettes,
  '/jeux/complete-phrase':     IconGameCompletePhrase,
  '/jeux/chasse-lettres':      IconGameChasseLettres,
  '/jeux/antonymes':           IconGameAtonymes,
  '/jeux/ordre-alpha':         IconGameOrdreAlpha,
  '/jeux/conjugue':            IconGameConjugue,
  '/jeux/mots-croises':        IconGameMotsCroises,
  '/jeux/synonymes':           IconGameSynonymes,
  '/jeux/anagrammes':          IconGameAnagrammes,
  '/jeux/poesie':              IconGamePoesie,
  '/jeux/calcul-rapide':       IconGameCalculRapide,
  '/jeux/course-maths':        IconGameCourseMaths,
  '/jeux/bulles-calcul':       IconGameBullesCalcul,
  '/jeux/saute-mouton':        IconGameSauteMouton,
  '/jeux/horloge':             IconGameHorloge,
  '/jeux/fractions':           IconGameFractions,
  '/jeux/geometrie':           IconGameGeometrie,
  '/jeux/multiplications':     IconGameMultiplications,
  '/jeux/phrase-mystere':      IconGamePhraseMystere,
  '/jeux/histoire-ordre':      IconGameHistoireOrdre,
  '/jeux/detective-histoires': IconGameDetective,
  '/jeux/lecture-vitesse':     IconGameLectureVitesse,
  '/jeux/vrai-faux':           IconGameVraiFaux,
  '/jeux/mots-intrus-texte':   IconGameMotsIntrus,
  '/jeux/nombre-secret':       IconGameNombreSecret,
  '/jeux/comparaison':         IconGameComparaison,
  '/jeux/codeur-maths':        IconGameCodeurMaths,
  '/jeux/suite-logique':       IconGameSuiteLogique,
  '/jeux/pair-impair':         IconGamePairImpair,
  '/jeux/pyramide-nombres':    IconGamePyramideNombres,
  '/jeux/estimation':          IconGameEstimation,
  '/jeux/intrus':              IconGameTrouveIntrus,
  '/jeux/trie-express':        IconGameTrieExpress,
  '/jeux/sudoku-images':       IconGameSudokuImages,
  '/jeux/labyrinthe':          IconGameLabyrinthe,
  '/jeux/motifs':              IconGameMotifs,
  '/jeux/memory':              IconGameMemory,
  '/jeux/simon':               IconGameSimon,
  '/jeux/objets-caches':       IconGameObjetsCache,
  '/jeux/memoire-chiffres':    IconGameMemoireChiffres,
  '/jeux/quiz-culture':        IconGameQuizCulture,
  '/jeux/capitales':           IconGameCapitales,
  '/jeux/animaux':             IconGameAnimaux,
  '/jeux/inventions':          IconGameInventions,
};

const CATEGORIES = [
  {
    id: 'arcade',
    label: 'Arcade',
    emoji: '🕹️',
    color: '#a855f7',
    gradient: 'linear-gradient(135deg,#a855f7,#7c3aed)',
    games: [
      { to: '/jeux/tetris',       emoji: '🟦', name: 'Tetris',          desc: 'Le classique ! Empile les pieces.', badge: 'Moyen' },
      { to: '/jeux/taupes',       emoji: '🦔', name: 'Taupes Maths',    desc: 'Frappe la taupe avec la bonne reponse !', badge: 'Facile' },
      { to: '/jeux/bombes-maths', emoji: '💣', name: 'Bombes Maths',    desc: 'Desamorce la bombe en calculant vite !', badge: 'Moyen' },
      { to: '/jeux/casse-briques', emoji: '🧱', name: 'Casse Briques', desc: 'Détruis toutes les briques sans faire tomber la balle !', badge: 'Moyen' },
      { to: '/jeux/snake', emoji: '🐍', name: 'Snake', desc: 'Mange les pommes pour grandir, mais ne te mords pas la queue !', badge: 'Facile' },
      { to: '/jeux/ninja-fruits', emoji: '🍉', name: 'Ninja Fruits', desc: 'Coupe les fruits mais évite les bombes !', badge: 'Moyen' },
    ],
  },
  {
    id: 'langage',
    label: 'Langage',
    emoji: '📚',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)',
    games: [
      { to: '/jeux/mots-melanges',   emoji: '🔤', name: 'Mots Melanges',     desc: 'Remets les lettres dans le bon ordre.', badge: 'Facile' },
      { to: '/jeux/mots-caches',     emoji: '🔍', name: 'Mots Caches',       desc: 'Trouve les mots caches dans la grille.', badge: 'Moyen' },
      { to: '/jeux/devinettes',      emoji: '🤔', name: 'Devinettes',        desc: 'Reponds aux devinettes amusantes !', badge: 'Facile' },
      { to: '/jeux/complete-phrase', emoji: '✍️', name: 'Complete la Phrase', desc: 'Choisis le bon mot pour completer.', badge: 'Facile' },
      { to: '/jeux/chasse-lettres',  emoji: '🔤', name: 'Chasse Lettres',    desc: 'Epelle le mot lettre par lettre !', badge: 'Facile' },
      { to: '/jeux/antonymes',       emoji: '↔️', name: 'Antonymes',         desc: 'Trouve le contraire de chaque mot !', badge: 'Facile' },
      { to: '/jeux/ordre-alpha',     emoji: '🔡', name: 'Ordre Alphabetique', desc: 'Range les mots dans l\'ordre A→Z !', badge: 'Facile' },
      { to: '/jeux/conjugue',        emoji: '📝', name: 'Conjugue Vite',     desc: 'Conjugue les verbes en un clin d\'oeil !', badge: 'Moyen' },
      { to: '/jeux/mots-croises',    emoji: '📐', name: 'Mots Croises',      desc: 'Remplis la grille avec les bons mots.', badge: 'Moyen' },
      { to: '/jeux/synonymes', emoji: '🔄', name: 'Synonymes', desc: 'Trouve les mots qui veulent dire la même chose.', badge: 'Facile' },
      { to: '/jeux/anagrammes', emoji: '🔀', name: 'Anagrammes', desc: 'Forme de nouveaux mots avec les mêmes lettres.', badge: 'Moyen' },
      { to: '/jeux/poesie', emoji: '📜', name: 'Rimes Rapides', desc: 'Trouve les mots qui riment ensemble !', badge: 'Facile' },
    ],
  },
  {
    id: 'maths',
    label: 'Maths',
    emoji: '🔢',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg,#f59e0b,#d97706)',
    games: [
      { to: '/jeux/calcul-rapide',  emoji: '⚡', name: 'Calcul Rapide',    desc: 'Resous le plus de calculs en 60 s !', badge: 'Moyen' },
      { to: '/jeux/course-maths',   emoji: '🏁', name: 'Course Maths',     desc: 'Course contre la montre en maths.', badge: 'Moyen' },
      { to: '/jeux/bulles-calcul',  emoji: '🫧', name: 'Bulles de Calcul', desc: 'Creve la bulle avec la bonne reponse !', badge: 'Facile' },
      { to: '/jeux/saute-mouton',   emoji: '🐑', name: 'Saute Mouton',     desc: 'Compte par 2, 5 et 10 avec le mouton !', badge: 'Facile' },
      { to: '/jeux/horloge',        emoji: '🕐', name: 'Lis l\'Heure',     desc: 'Quelle heure est-il ? Trouve la bonne !', badge: 'Facile' },
      { to: '/jeux/fractions', emoji: '🍕', name: 'Part de Pizza', desc: 'Apprends les fractions en partageant des pizzas.', badge: 'Moyen' },
      { to: '/jeux/geometrie', emoji: '📐', name: 'Formes Magiques', desc: 'Reconnais et dessine les formes géométriques.', badge: 'Facile' },
      { to: '/jeux/multiplications', emoji: '✖️', name: 'Table Express', desc: 'Révise tes tables de multiplication à toute vitesse !', badge: 'Moyen' },
    ],
  },
  {
    id: 'logique-lecture',
    label: 'Lecture',
    emoji: '📖',
    color: '#10b981',
    gradient: 'linear-gradient(135deg,#10b981,#059669)',
    games: [
      { to: '/jeux/phrase-mystere',  emoji: '🔍', name: 'Phrase Mystere',    desc: 'Quel mot complete cette phrase ?', badge: 'Facile' },
      { to: '/jeux/histoire-ordre',  emoji: '📚', name: 'Histoire en Ordre', desc: 'Remets les images de l\'histoire en ordre !', badge: 'Facile' },
      { to: '/jeux/detective-histoires', emoji: '📖', name: 'Detective d\'Histoires', desc: 'Lis une histoire et reponds aux questions.', badge: 'Moyen' },
      { to: '/jeux/lecture-vitesse', emoji: '🚀', name: 'Lecture Rapide', desc: 'Lis le texte le plus vite possible sans te tromper.', badge: 'Moyen' },
      { to: '/jeux/vrai-faux', emoji: '✅', name: 'Vrai ou Faux ?', desc: 'Lis le paragraphe et décide si c\'est vrai ou faux.', badge: 'Facile' },
      { to: '/jeux/mots-intrus-texte', emoji: '❌', name: 'Intrus dans le Texte', desc: 'Trouve le mot qui ne devrait pas être là.', badge: 'Facile' },
    ],
  },
  {
    id: 'logique-nombre',
    label: 'Nombres',
    emoji: '🧮',
    color: '#f43f5e',
    gradient: 'linear-gradient(135deg,#f43f5e,#e11d48)',
    games: [
      { to: '/jeux/nombre-secret', emoji: '🔐', name: 'Nombre Secret',       desc: 'Devine le nombre en 6 essais !', badge: 'Moyen' },
      { to: '/jeux/comparaison',   emoji: '📊', name: 'Plus Petit Plus Grand', desc: 'Range les nombres du plus petit au plus grand !', badge: 'Facile' },
      { to: '/jeux/codeur-maths',  emoji: '🔣', name: 'Codeur de Maths',     desc: 'Decouvre la valeur de chaque symbole !', badge: 'Moyen' },
      { to: '/jeux/suite-logique', emoji: '🔢', name: 'Suite Logique',       desc: 'Trouve le prochain nombre ou emoji !', badge: 'Facile' },
      { to: '/jeux/pair-impair', emoji: '🎲', name: 'Pair ou Impair', desc: 'Trie les nombres en pair ou impair très vite.', badge: 'Facile' },
      { to: '/jeux/pyramide-nombres', emoji: '🔺', name: 'Pyramide Additive', desc: 'Complète la pyramide en additionnant les briques.', badge: 'Moyen' },
      { to: '/jeux/estimation', emoji: '⚖️', name: 'Juste Prix', desc: 'Estime le résultat du calcul sans le résoudre.', badge: 'Moyen' },
    ],
  },
  {
    id: 'logique',
    label: 'Logique',
    emoji: '🧩',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg,#ec4899,#db2777)',
    games: [
      { to: '/jeux/intrus',       emoji: '🕵️', name: 'Trouve l\'Intrus', desc: 'Quel mot ne va pas avec les autres ?', badge: 'Facile' },
      { to: '/jeux/trie-express', emoji: '🗂️', name: 'Trie Express',     desc: 'Trie les mots dans les bonnes categories !', badge: 'Facile' },
      { to: '/jeux/sudoku-images', emoji: '🖼️', name: 'Sudoku Images', desc: 'Un sudoku adapté avec de jolies images !', badge: 'Moyen' },
      { to: '/jeux/labyrinthe', emoji: '🗺️', name: 'Labyrinthe Magique', desc: 'Trouve le chemin de sortie sans te bloquer.', badge: 'Facile' },
      { to: '/jeux/motifs', emoji: '💠', name: 'Suite de Motifs', desc: 'Quelle image vient ensuite dans la série ?', badge: 'Facile' },
    ],
  },
  {
    id: 'memoire',
    label: 'Memoire',
    emoji: '🧠',
    color: '#22c55e',
    gradient: 'linear-gradient(135deg,#22c55e,#16a34a)',
    games: [
      { to: '/jeux/memory', emoji: '🃏', name: 'Memory', desc: 'Retrouve les paires de cartes cachees.', badge: 'Facile' },
      { to: '/jeux/simon', emoji: '🔔', name: 'Simon Dit', desc: 'Répète la séquence de couleurs et de sons !', badge: 'Moyen' },
      { to: '/jeux/objets-caches', emoji: '🏠', name: 'Objets Cachés', desc: 'Mémorise la chambre et retrouve ce qui a disparu.', badge: 'Facile' },
      { to: '/jeux/memoire-chiffres', emoji: '🔢', name: 'Mémoire Chiffres', desc: 'Mémorise la suite de chiffres et réécris-la.', badge: 'Moyen' },
    ],
  },
  {
    id: 'culture',
    label: 'Culture',
    emoji: '🌍',
    color: '#f97316',
    gradient: 'linear-gradient(135deg,#f97316,#ea580c)',
    games: [
      { to: '/jeux/quiz-culture', emoji: '🌍', name: 'Quiz Culture', desc: 'Belgique, France, monde — 10 questions !', badge: 'Facile' },
      { to: '/jeux/capitales', emoji: '🗼', name: 'Drapeaux et Capitales', desc: 'Associe le bon pays à sa capitale.', badge: 'Moyen' },
      { to: '/jeux/animaux', emoji: '🦁', name: 'Cris des Animaux', desc: 'Qui fait ce bruit ? Trouve le bon animal !', badge: 'Facile' },
      { to: '/jeux/inventions', emoji: '💡', name: 'Grandes Inventions', desc: 'Découvre qui a inventé quoi à travers l\'histoire.', badge: 'Moyen' },
    ],
  },
];

const ALL_GAMES = CATEGORIES.flatMap(cat =>
  cat.games.map(g => ({ ...g, catId: cat.id, catColor: cat.color, catGradient: cat.gradient }))
);

const FEATURED = {
  to: '/jeux/quiz-culture',
  emoji: '🌍',
  name: 'Quiz Culture Generale',
  desc: 'Teste tes connaissances sur la Belgique, la France et le monde ! 10 questions variees t\'attendent.',
  badge: 'Facile',
  catColor: '#f97316',
  gradient: 'linear-gradient(135deg,#f97316 0%,#ec4899 50%,#8b5cf6 100%)',
};

function routeToGameId(to) {
  return to.replace('/jeux/', '');
}

export default function JeuxHubPage() {
  const [allProgress, setAllProgress] = useState(() => getAllGameProgress());
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    function refresh() { setAllProgress(getAllGameProgress()); }
    window.addEventListener('lena-game-progress-change', refresh);
    return () => window.removeEventListener('lena-game-progress-change', refresh);
  }, []);

  const stats = getTotalStats();

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (activeCategory === 'all' && !q) return CATEGORIES;

    return CATEGORIES
      .filter(cat => activeCategory === 'all' || cat.id === activeCategory)
      .map(cat => ({
        ...cat,
        games: q
          ? cat.games.filter(g =>
              g.name.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q)
            )
          : cat.games,
      }))
      .filter(cat => cat.games.length > 0);
  }, [activeCategory, searchQuery]);

  const totalGames = ALL_GAMES.length;
  const playedCount = Object.keys(allProgress).length;

  return (
    <div className="jh-page">

      {/* Hero */}
      <div className="jh-hero">
        <div className="jh-hero__badge">🧠 Zone de jeux</div>
        <h1 className="jh-hero__title">Jeux Cerebraux</h1>
        <p className="jh-hero__subtitle">Joue, reflechis et apprends en t&rsquo;amusant !</p>

        {/* Stats strip */}
        {stats.totalSessions > 0 && (
          <div className="jh-stats-strip">
            <div className="jh-stat-item">
              <span className="jh-stat-item__icon">🎮</span>
              <span className="jh-stat-item__val">{stats.totalSessions}</span>
              <span className="jh-stat-item__label">parties</span>
            </div>
            <div className="jh-stat-divider" />
            <div className="jh-stat-item">
              <span className="jh-stat-item__icon">⏱️</span>
              <span className="jh-stat-item__val">{formatDuration(stats.totalGameSecs)}</span>
              <span className="jh-stat-item__label">joues</span>
            </div>
            <div className="jh-stat-divider" />
            <div className="jh-stat-item">
              <span className="jh-stat-item__icon">🎯</span>
              <span className="jh-stat-item__val">{playedCount}/{totalGames}</span>
              <span className="jh-stat-item__label">jeux</span>
            </div>
          </div>
        )}
      </div>

      {/* Featured card */}
      <Link to={FEATURED.to} className="jh-featured" style={{ '--feat-gradient': FEATURED.gradient }}>
        <div className="jh-featured__glow" />
        <div className="jh-featured__content">
          <div className="jh-featured__tag">✨ Jeu du moment</div>
          <div className="jh-featured__emoji">{FEATURED.emoji}</div>
          <h2 className="jh-featured__name">{FEATURED.name}</h2>
          <p className="jh-featured__desc">{FEATURED.desc}</p>
          <div className="jh-featured__cta">▶ Jouer maintenant</div>
        </div>
        <div className="jh-featured__deco" aria-hidden="true">🌍🗺️🏆</div>
      </Link>

      {/* Search */}
      <div className="jh-search-wrap">
        <span className="jh-search-icon">🔍</span>
        <input
          type="search"
          className="jh-search"
          placeholder="Rechercher un jeu..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          aria-label="Rechercher un jeu"
        />
        {searchQuery && (
          <button className="jh-search-clear" onClick={() => setSearchQuery('')} aria-label="Effacer">✕</button>
        )}
      </div>

      {/* Category filter tabs */}
      <div className="jh-tabs" role="tablist" aria-label="Filtrer par categorie">
        <button
          role="tab"
          aria-selected={activeCategory === 'all'}
          className={`jh-tab ${activeCategory === 'all' ? 'jh-tab--active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          🎮 Tous
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={activeCategory === cat.id}
            className={`jh-tab ${activeCategory === cat.id ? 'jh-tab--active' : ''}`}
            style={activeCategory === cat.id ? { '--tab-color': cat.color } : {}}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filteredCategories.length === 0 && (
        <div className="jh-empty">
          <div className="jh-empty__icon">🔍</div>
          <p className="jh-empty__text">Aucun jeu ne correspond a ta recherche</p>
          <button className="jh-empty__btn" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
            Voir tous les jeux
          </button>
        </div>
      )}

      {/* Game categories */}
      {filteredCategories.map(cat => (
        <section key={cat.id} className="jh-category">
          <div
            className="jh-category__label"
            style={{ '--cat-color': cat.color, '--cat-gradient': cat.gradient }}
          >
            <span className="jh-category__emoji">{cat.emoji}</span>
            {cat.label}
            <span className="jh-category__count">{cat.games.length}</span>
          </div>
          <div className="jh-grid">
            {cat.games.map(g => {
              const gp = allProgress[routeToGameId(g.to)];
              const played = !!gp?.bestScore;
              return (
                <Link
                  key={g.to}
                  to={g.to}
                  className={`jh-card ${played ? 'jh-card--played' : ''}`}
                  style={{ '--card-accent': cat.color, '--card-gradient': cat.gradient }}
                >
                  <div className="jh-card__icon" style={{ '--icon-bg': cat.color + '22' }}>
                    {GAME_ICON_MAP[g.to]
                      ? (() => { const Icon = GAME_ICON_MAP[g.to]; return <Icon size={24} />; })()
                      : g.emoji}
                    {played && <span className="jh-card__played-badge">✓</span>}
                  </div>
                  <div className="jh-card__body">
                    <div className="jh-card__top">
                      <span className="jh-card__name">{g.name}</span>
                    </div>
                    {gp?.bestScore > 0 && (
                      <div className="jh-card__prog">
                        ⭐ {gp.bestScore} pts · Niv.{gp.bestLevel}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      {/* Bottom spacer for mobile nav */}
      <div className="jh-bottom-spacer" />
    </div>
  );
}
