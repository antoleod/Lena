import { Link } from 'react-router-dom';
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
    id: 'langage',
    label: '📚 Langage',
    color: '#6366f1',
    games: [
      { to: '/jeux/mots-melanges', emoji: '🔤', name: 'Mots Melanges', desc: 'Remets les lettres dans le bon ordre.', badge: 'Facile' },
      { to: '/jeux/mots-caches',   emoji: '🔍', name: 'Mots Caches',   desc: 'Trouve les mots caches dans la grille.', badge: 'Moyen' },
      { to: '/jeux/devinettes',    emoji: '🤔', name: 'Devinettes',    desc: 'Reponds aux devinettes amusantes !', badge: 'Facile' },
      { to: '/jeux/complete-phrase', emoji: '✍️', name: 'Complete la Phrase', desc: 'Choisis le bon mot pour completer.', badge: 'Facile' },
    ],
  },
  {
    id: 'maths',
    label: '🔢 Mathematiques',
    color: '#f59e0b',
    games: [
      { to: '/jeux/calcul-rapide', emoji: '⚡', name: 'Calcul Rapide', desc: 'Resous le plus de calculs en 60 s !', badge: 'Moyen' },
      { to: '/jeux/course-maths',  emoji: '🏁', name: 'Course Maths',  desc: 'Course contre la montre en maths.', badge: 'Moyen' },
    ],
  },
  {
    id: 'logique',
    label: '🧩 Logique',
    color: '#ec4899',
    games: [
      { to: '/jeux/intrus', emoji: '🕵️', name: 'Trouve l\'Intrus', desc: 'Quel mot ne va pas avec les autres ?', badge: 'Facile' },
    ],
  },
  {
    id: 'memoire',
    label: '🧠 Memoire',
    color: '#22c55e',
    games: [
      { to: '/jeux/memory', emoji: '🃏', name: 'Memory', desc: 'Retrouve les paires de cartes cachees.', badge: 'Facile' },
      { to: '/jeux/detective-histoires', emoji: '📖', name: 'Detective d\'Histoires', desc: 'Lis une histoire et reponds aux questions.', badge: 'Moyen' },
    ],
  },
];

export default function JeuxHubPage() {
  return (
    <div className="jh-page">
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
            {cat.games.map(g => (
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
                </div>
                <div className="jh-card__play" style={{ '--btn-color': cat.color }}>
                  ▶ Jouer
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
