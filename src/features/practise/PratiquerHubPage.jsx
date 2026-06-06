import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';

const HUB_UI = {
  fr: {
    title: '🎯 Pratiquer',
    subtitle: 'Choisis ton activite',
    cards: [
      { to: '/exam/library', emoji: '📚', title: 'Bibliotheque d\'examens', desc: 'Plus de 300 examens par matiere', color: '#9b59b6' },
      { to: '/cahier', emoji: '✏️', title: 'Mon Cahier', desc: 'Exercices personnalises', color: '#3498db' },
      { to: '/tables', emoji: '✖️', title: 'Tables', desc: 'Tables de multiplication', color: '#e67e22' },
      { to: '/stories', emoji: '📖', title: 'Contes & Lecture', desc: '19 histoires interactives', color: '#1abc9c' },
    ],
  },
  nl: {
    title: '🎯 Oefenen',
    subtitle: 'Kies je activiteit',
    cards: [
      { to: '/exam/library', emoji: '📚', title: 'Examenbibliotheek', desc: 'Meer dan 300 examens', color: '#9b59b6' },
      { to: '/cahier', emoji: '✏️', title: 'Mijn Schrift', desc: 'Gepersonaliseerde oefeningen', color: '#3498db' },
      { to: '/tables', emoji: '✖️', title: 'Tafels', desc: 'Vermenigvuldigingstafels', color: '#e67e22' },
      { to: '/stories', emoji: '📖', title: 'Verhalen', desc: '19 interactieve verhalen', color: '#1abc9c' },
    ],
  },
  en: {
    title: '🎯 Practise',
    subtitle: 'Choose your activity',
    cards: [
      { to: '/exam/library', emoji: '📚', title: 'Exam library', desc: '300+ exams by subject', color: '#9b59b6' },
      { to: '/cahier', emoji: '✏️', title: 'My Notebook', desc: 'Personalised exercises', color: '#3498db' },
      { to: '/tables', emoji: '✖️', title: 'Times tables', desc: 'Multiplication tables', color: '#e67e22' },
      { to: '/stories', emoji: '📖', title: 'Stories', desc: '19 interactive stories', color: '#1abc9c' },
    ],
  },
  es: {
    title: '🎯 Practicar',
    subtitle: 'Elige tu actividad',
    cards: [
      { to: '/exam/library', emoji: '📚', title: 'Biblioteca de examenes', desc: 'Mas de 300 examenes', color: '#9b59b6' },
      { to: '/cahier', emoji: '✏️', title: 'Mi Cuaderno', desc: 'Ejercicios personalizados', color: '#3498db' },
      { to: '/tables', emoji: '✖️', title: 'Tablas', desc: 'Tablas de multiplicar', color: '#e67e22' },
      { to: '/stories', emoji: '📖', title: 'Cuentos', desc: '19 historias interactivas', color: '#1abc9c' },
    ],
  },
};

export default function PratiquerHubPage() {
  const { locale } = useLocale();
  const ui = HUB_UI[locale] || HUB_UI.fr;

  return (
    <div className="pratiquer-hub">
      <header className="hub-header">
        <h1 className="hub-header__title">{ui.title}</h1>
        <p className="hub-header__sub">{ui.subtitle}</p>
      </header>
      <div className="hub-cards">
        {ui.cards.map((card) => (
          <Link key={card.to} to={card.to} className="hub-card" style={{ '--card-color': card.color }}>
            <span className="hub-card__emoji">{card.emoji}</span>
            <div className="hub-card__body">
              <strong className="hub-card__title">{card.title}</strong>
              <span className="hub-card__desc">{card.desc}</span>
            </div>
            <span className="hub-card__arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
