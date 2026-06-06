import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import './jeux.css';

const HUB_UI = {
  fr: {
    title: 'Jeux Cerebraux',
    memory: 'Jeu de Memory',
    memoryDesc: 'Retrouve les paires de cartes cachees.',
    speed: 'Calcul Rapide',
    speedDesc: 'Resous le plus de calculs en 60 secondes !',
    scramble: 'Mots Melanges',
    scrambleDesc: 'Remets les lettres dans le bon ordre.',
  },
  nl: {
    title: 'Hersengames',
    memory: 'Memory Spel',
    memoryDesc: 'Vind de verborgen kaartparen.',
    speed: 'Snel Rekenen',
    speedDesc: 'Los zo veel mogelijk sommen op in 60 seconden !',
    scramble: 'Woorden Mengen',
    scrambleDesc: 'Zet de letters in de juiste volgorde.',
  },
  en: {
    title: 'Brain Games',
    memory: 'Memory Game',
    memoryDesc: 'Find the hidden card pairs.',
    speed: 'Speed Math',
    speedDesc: 'Solve as many sums as you can in 60 seconds !',
    scramble: 'Word Scramble',
    scrambleDesc: 'Put the letters back in the right order.',
  },
  es: {
    title: 'Juegos Cerebrales',
    memory: 'Juego de Memoria',
    memoryDesc: 'Encuentra las parejas de cartas ocultas.',
    speed: 'Calculo Rapido',
    speedDesc: 'Resuelve el mayor numero de calculos en 60 segundos !',
    scramble: 'Letras Revueltas',
    scrambleDesc: 'Ordena las letras correctamente.',
  },
};

const CARDS = [
  { to: '/jeux/memory',        emoji: '🃏', color: '#6366f1', key: 'memory',   descKey: 'memoryDesc' },
  { to: '/jeux/calcul-rapide', emoji: '⚡', color: '#f59e0b', key: 'speed',    descKey: 'speedDesc' },
  { to: '/jeux/mots-melanges', emoji: '🔤', color: '#22c55e', key: 'scramble', descKey: 'scrambleDesc' },
];

export default function JeuxHubPage() {
  const { locale } = useLocale();
  const ui = HUB_UI[locale] || HUB_UI.fr;

  return (
    <div className="jeux-hub">
      <h1 className="jeux-hub__title">🧠 {ui.title}</h1>
      <div className="jeux-hub__grid">
        {CARDS.map(c => (
          <Link
            key={c.key}
            to={c.to}
            className="jeux-hub-card"
            style={{ '--card-color': c.color }}
          >
            <span className="jeux-hub-card__emoji">{c.emoji}</span>
            <div className="jeux-hub-card__body">
              <div className="jeux-hub-card__title">{ui[c.key]}</div>
              <div className="jeux-hub-card__desc">{ui[c.descKey]}</div>
            </div>
            <span style={{ opacity: .5 }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
