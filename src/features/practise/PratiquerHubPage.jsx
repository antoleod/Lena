import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import {
  IconExamens, IconCahier, IconTables, IconStories, IconJeux,
  IconDudu, IconChrono, IconGrammi, IconMetri,
} from '../../assets/icons/AppIcons.jsx';

const HUB_UI = {
  fr: {
    title: '🎯 Pratiquer',
    subtitle: 'Choisis ton activite',
    cards: [
      { to: '/exam/library', icon: 'examens', title: 'Bibliotheque d\'examens', desc: 'Plus de 300 examens par matiere', color: '#9b59b6', featured: true },
      { to: '/cahier', icon: 'cahier', title: 'Mon Cahier', desc: 'Exercices personnalises', color: '#3498db' },
      { to: '/tables', icon: 'tables', title: 'Tables', desc: 'Tables de multiplication', color: '#e67e22' },
      { to: '/stories', icon: 'stories', title: 'Contes & Lecture', desc: '19 histoires interactives', color: '#1abc9c' },
      { to: '/jeux', icon: 'jeux', title: 'Jeux Cerebraux', desc: 'Memory, calcul, mots...', color: '#6366f1' },
      { to: '/dudu', icon: 'dudu', title: 'DUDU', desc: 'Soustractions avec passage a la dizaine', color: '#6366f1' },
      { to: '/chrono', icon: 'chrono', title: 'ChronoLena', desc: 'J\'apprends l\'heure en jouant', color: '#0891b2' },
      { to: '/grammi', icon: 'grammi', title: 'GrammiLena', desc: 'Le royaume magique des mots', color: '#10b981' },
      { to: '/metri', icon: 'metri', title: 'MetriLena', desc: 'Le laboratoire des grandeurs', color: '#f59e0b' },
    ],
  },
  nl: {
    title: '🎯 Oefenen',
    subtitle: 'Kies je activiteit',
    cards: [
      { to: '/exam/library', icon: 'examens', title: 'Examenbibliotheek', desc: 'Meer dan 300 examens', color: '#9b59b6', featured: true },
      { to: '/cahier', icon: 'cahier', title: 'Mijn Schrift', desc: 'Gepersonaliseerde oefeningen', color: '#3498db' },
      { to: '/tables', icon: 'tables', title: 'Tafels', desc: 'Vermenigvuldigingstafels', color: '#e67e22' },
      { to: '/stories', icon: 'stories', title: 'Verhalen', desc: '19 interactieve verhalen', color: '#1abc9c' },
      { to: '/jeux', icon: 'jeux', title: 'Hersengames', desc: 'Memory, rekenen, woorden...', color: '#6366f1' },
      { to: '/dudu', icon: 'dudu', title: 'DUDU', desc: 'Aftrekken met overdracht', color: '#6366f1' },
      { to: '/chrono', icon: 'chrono', title: 'ChronoLena', desc: 'Leer klokkijken spelenderwijs', color: '#0891b2' },
      { to: '/grammi', icon: 'grammi', title: 'GrammiLena', desc: 'Het magische koninkrijk van woorden', color: '#10b981' },
      { to: '/metri', icon: 'metri', title: 'MetriLena', desc: 'Het laboratorium der grootheden', color: '#f59e0b' },
    ],
  },
  en: {
    title: '🎯 Practise',
    subtitle: 'Choose your activity',
    cards: [
      { to: '/exam/library', icon: 'examens', title: 'Exam library', desc: '300+ exams by subject', color: '#9b59b6', featured: true },
      { to: '/cahier', icon: 'cahier', title: 'My Notebook', desc: 'Personalised exercises', color: '#3498db' },
      { to: '/tables', icon: 'tables', title: 'Times tables', desc: 'Multiplication tables', color: '#e67e22' },
      { to: '/stories', icon: 'stories', title: 'Stories', desc: '19 interactive stories', color: '#1abc9c' },
      { to: '/jeux', icon: 'jeux', title: 'Brain Games', desc: 'Memory, speed math, words...', color: '#6366f1' },
      { to: '/dudu', icon: 'dudu', title: 'DUDU', desc: 'Subtractions with borrowing', color: '#6366f1' },
      { to: '/chrono', icon: 'chrono', title: 'ChronoLena', desc: 'I learn to tell the time', color: '#0891b2' },
      { to: '/grammi', icon: 'grammi', title: 'GrammiLena', desc: 'The magical kingdom of words', color: '#10b981' },
      { to: '/metri', icon: 'metri', title: 'MetriLena', desc: 'The measurement laboratory', color: '#f59e0b' },
    ],
  },
  es: {
    title: '🎯 Practicar',
    subtitle: 'Elige tu actividad',
    cards: [
      { to: '/exam/library', icon: 'examens', title: 'Biblioteca de examenes', desc: 'Mas de 300 examenes', color: '#9b59b6', featured: true },
      { to: '/cahier', icon: 'cahier', title: 'Mi Cuaderno', desc: 'Ejercicios personalizados', color: '#3498db' },
      { to: '/tables', icon: 'tables', title: 'Tablas', desc: 'Tablas de multiplicar', color: '#e67e22' },
      { to: '/stories', icon: 'stories', title: 'Cuentos', desc: '19 historias interactivas', color: '#1abc9c' },
      { to: '/jeux', icon: 'jeux', title: 'Juegos Cerebrales', desc: 'Memoria, calculo, palabras...', color: '#6366f1' },
      { to: '/dudu', icon: 'dudu', title: 'DUDU', desc: 'Restas con llevada', color: '#6366f1' },
      { to: '/chrono', icon: 'chrono', title: 'ChronoLena', desc: 'Aprendo a leer el reloj jugando', color: '#0891b2' },
      { to: '/grammi', icon: 'grammi', title: 'GrammiLena', desc: 'El reino magico de las palabras', color: '#10b981' },
      { to: '/metri', icon: 'metri', title: 'MetriLena', desc: 'El laboratorio de medidas', color: '#f59e0b' },
    ],
  },
};

const ICON_MAP = {
  examens: IconExamens,
  cahier: IconCahier,
  tables: IconTables,
  stories: IconStories,
  jeux: IconJeux,
  dudu: IconDudu,
  chrono: IconChrono,
  grammi: IconGrammi,
  metri: IconMetri,
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
        {ui.cards.map((card) => {
          const IconComponent = ICON_MAP[card.icon];
          return (
            <Link
              key={card.to}
              to={card.to}
              className={`hub-card${card.featured ? ' hub-card--featured' : ''}`}
              style={{ '--card-color': card.color }}
            >
              <div className="hub-card__icon-bg">
                {IconComponent && <IconComponent size={52} />}
              </div>
              <div className="hub-card__body">
                <strong className="hub-card__title">{card.title}</strong>
                <span className="hub-card__desc">{card.desc}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
