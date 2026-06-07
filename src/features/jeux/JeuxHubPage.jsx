import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllGameProgress, getTotalStats, formatDuration } from '../../services/storage/gameProgressStore.js';
import {
  IconGameMotsMelanges,
  IconGameMotsCaches,
  IconGameDevinettes,
  IconGameCompletePhrase,
  IconGameCalculRapide,
  IconGameCourseMaths,
  IconGameTrouveIntrus,
  IconGameMemory,
  IconGameDetective,
} from '../../assets/icons/GameIcons.jsx';
import './jeux.css';

const GAME_ICON_MAP = {
  '/jeux/mots-melanges':      IconGameMotsMelanges,
  '/jeux/mots-caches':        IconGameMotsCaches,
  '/jeux/devinettes':         IconGameDevinettes,
  '/jeux/complete-phrase':    IconGameCompletePhrase,
  '/jeux/calcul-rapide':      IconGameCalculRapide,
  '/jeux/course-maths':       IconGameCourseMaths,
  '/jeux/intrus':             IconGameTrouveIntrus,
  '/jeux/memory':             IconGameMemory,
  '/jeux/detective-histoires': IconGameDetective,
};

const CATEGORIES = [
  {
    id: 'arcade',
    label: '🕹️ Arcade',
    color: '#a855f7',
    games: [
      { to: '/jeux/tetris',       emoji: '🟦', name: 'Tetris',          desc: 'Le classique ! Empile les pieces.', badge: 'Moyen' },
      { to: '/jeux/taupes',       emoji: '🦔', name: 'Taupes Maths',    desc: 'Frappe la taupe avec la bonne reponse !', badge: 'Facile' },
      { to: '/jeux/bombes-maths', emoji: '💣', name: 'Bombes Maths',    desc: 'Desamorce la bombe en calculant vite !', badge: 'Moyen' },
    ],
  },
  {
    id: 'langage',
    label: '📚 Langage',
    color: '#6366f1',
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
    ],
  },
  {
    id: 'maths',
    label: '🔢 Mathematiques',
    color: '#f59e0b',
    games: [
      { to: '/jeux/calcul-rapide',  emoji: '⚡', name: 'Calcul Rapide',    desc: 'Resous le plus de calculs en 60 s !', badge: 'Moyen' },
      { to: '/jeux/course-maths',   emoji: '🏁', name: 'Course Maths',     desc: 'Course contre la montre en maths.', badge: 'Moyen' },
      { to: '/jeux/bulles-calcul',  emoji: '🫧', name: 'Bulles de Calcul', desc: 'Creve la bulle avec la bonne reponse !', badge: 'Facile' },
      { to: '/jeux/saute-mouton',   emoji: '🐑', name: 'Saute Mouton',     desc: 'Compte par 2, 5 et 10 avec le mouton !', badge: 'Facile' },
      { to: '/jeux/horloge',        emoji: '🕐', name: 'Lis l\'Heure',     desc: 'Quelle heure est-il ? Trouve la bonne !', badge: 'Facile' },
    ],
  },
  {
    id: 'logique-lecture',
    label: '📖 Logique Lecture',
    color: '#10b981',
    games: [
      { to: '/jeux/phrase-mystere',  emoji: '🔍', name: 'Phrase Mystere',    desc: 'Quel mot complete cette phrase ?', badge: 'Facile' },
      { to: '/jeux/histoire-ordre',  emoji: '📚', name: 'Histoire en Ordre', desc: 'Remets les images de l\'histoire en ordre !', badge: 'Facile' },
      { to: '/jeux/detective-histoires', emoji: '📖', name: 'Detective d\'Histoires', desc: 'Lis une histoire et reponds aux questions.', badge: 'Moyen' },
    ],
  },
  {
    id: 'logique-nombre',
    label: '🔢 Logique Nombres',
    color: '#f43f5e',
    games: [
      { to: '/jeux/nombre-secret', emoji: '🔐', name: 'Nombre Secret',       desc: 'Devine le nombre en 6 essais !', badge: 'Moyen' },
      { to: '/jeux/comparaison',   emoji: '📊', name: 'Plus Petit Plus Grand', desc: 'Range les nombres du plus petit au plus grand !', badge: 'Facile' },
      { to: '/jeux/codeur-maths',  emoji: '🔣', name: 'Codeur de Maths',     desc: 'Decouvre la valeur de chaque symbole !', badge: 'Moyen' },
      { to: '/jeux/suite-logique', emoji: '🔢', name: 'Suite Logique',       desc: 'Trouve le prochain nombre ou emoji !', badge: 'Facile' },
    ],
  },
  {
    id: 'logique',
    label: '🧩 Logique',
    color: '#ec4899',
    games: [
      { to: '/jeux/intrus',       emoji: '🕵️', name: 'Trouve l\'Intrus', desc: 'Quel mot ne va pas avec les autres ?', badge: 'Facile' },
      { to: '/jeux/trie-express', emoji: '🗂️', name: 'Trie Express',     desc: 'Trie les mots dans les bonnes categories !', badge: 'Facile' },
    ],
  },
  {
    id: 'memoire',
    label: '🧠 Memoire',
    color: '#22c55e',
    games: [
      { to: '/jeux/memory', emoji: '🃏', name: 'Memory', desc: 'Retrouve les paires de cartes cachees.', badge: 'Facile' },
    ],
  },
  {
    id: 'culture',
    label: '🌍 Culture Generale',
    color: '#f97316',
    games: [
      { to: '/jeux/quiz-culture', emoji: '🌍', name: 'Quiz Culture', desc: 'Belgique, France, monde — 10 questions !', badge: 'Facile' },
    ],
  },
];

function routeToGameId(to) {
  return to.replace('/jeux/', '');
}

export default function JeuxHubPage() {
  const [allProgress, setAllProgress] = useState(() => getAllGameProgress());

  useEffect(() => {
    function refresh() { setAllProgress(getAllGameProgress()); }
    window.addEventListener('lena-game-progress-change', refresh);
    return () => window.removeEventListener('lena-game-progress-change', refresh);
  }, []);

  const stats = getTotalStats();

  return (
    <div className="jh-page">
      {/* Total stats bar */}
      {stats.totalSessions > 0 && (
        <div className="jh-total-stats">
          <div className="jh-total-stat">
            🎮 <span className="jh-total-stat__val">{stats.totalSessions}</span> parties
          </div>
          <div className="jh-total-stat">
            ⏱️ <span className="jh-total-stat__val">{formatDuration(stats.totalGameSecs)}</span> joues
          </div>
          <div className="jh-total-stat">
            🎯 <span className="jh-total-stat__val">{stats.gamesPlayed}</span> jeux essayes
          </div>
        </div>
      )}

      <div className="jh-hero">
        <div className="jh-hero__icon">🧠</div>
        <h1 className="jh-hero__title">Jeux Cerebraux</h1>
        <p className="jh-hero__subtitle">Joue, reflechis et apprends en t'amusant !</p>
      </div>

      {CATEGORIES.map(cat => (
        <section key={cat.id} className="jh-category">
          <div className="jh-category__label" style={{ '--cat-color': cat.color }}>
            {cat.label}
          </div>
          <div className="jh-grid">
            {cat.games.map(g => {
              const gp = allProgress[routeToGameId(g.to)];
              return (
                <Link
                  key={g.to}
                  to={g.to}
                  className="jh-card"
                  style={{ '--card-accent': cat.color }}
                >
                  <div className="jh-card__icon" style={{ '--icon-bg': cat.color + '33' }}>
                    {GAME_ICON_MAP[g.to]
                      ? (() => { const Icon = GAME_ICON_MAP[g.to]; return <Icon size={36} />; })()
                      : g.emoji}
                  </div>
                  <div className="jh-card__body">
                    <div className="jh-card__top">
                      <span className="jh-card__name">{g.name}</span>
                      <span className={`jh-card__badge jh-card__badge--${g.badge === 'Facile' ? 'easy' : 'medium'}`}>
                        {g.badge}
                      </span>
                    </div>
                    <p className="jh-card__desc">{g.desc}</p>
                    {gp?.bestScore > 0 && (
                      <div className="jh-card__prog">
                        ⭐ {gp.bestScore} · Niv.{gp.bestLevel}
                      </div>
                    )}
                  </div>
                  <div className="jh-card__play" style={{ '--btn-color': cat.color }}>
                    ▶ Jouer
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
