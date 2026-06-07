import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { subjects } from '../curriculum/catalog.js';
import { getSubjectUniverse } from '../../shared/gameplay/subjectThemes.js';
import { getSubjectLabel } from '../../shared/i18n/contentLocalization.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';
import { getActivitiesBySubject } from '../curriculum/catalog.js';
import { SUBJECT_ICONS } from '../../assets/icons/AppIcons.jsx';

const HUB_UI = {
  fr: {
    title: 'Apprendre',
    mapTitle: 'Grand Voyage',
    mapDesc: 'Suis ta carte d\'aventure',
    subjectsTitle: 'Mes Matieres',
    subjectsDesc: 'Choisis une matiere a explorer',
    progress: (c, t) => `${c} / ${t} activites`,
    langTitle: 'Academies de Langue',
    mathTitle: 'Academies des Maths',
    gamesTitle: 'Jeux et Defis',
    langCards: [
      { to: '/lexi', emoji: '📚', title: 'LexiLena', desc: 'L\'Academie des Mots et des Phrases', color: '#7c3aed', badge: '9 modes' },
      { to: '/grammi', emoji: '🏰', title: 'GrammiLena', desc: 'Le Royaume Magique des Mots', color: '#10b981', badge: '8 niveaux' },
      { to: '/verbes', emoji: '🧙', title: 'Royaume des Verbes', desc: 'Conjugaison et mini-jeux', color: '#059669', badge: '10 niveaux' },
    ],
    mathCards: [
      { to: '/chrono', emoji: '🕐', title: 'ChronoLena', desc: 'J\'apprends l\'heure en jouant', color: '#0891b2', badge: '6 modes' },
      { to: '/metri', emoji: '📏', title: 'MetriLena', desc: 'Mesures, poids et grandeurs', color: '#f59e0b', badge: '5 univers' },
      { to: '/tables', emoji: '✖️', title: 'Tables', desc: 'Tables de multiplication', color: '#e67e22', badge: '10 tables' },
      { to: '/dudu', emoji: '🎯', title: 'DUDU', desc: 'Soustractions avec passage a la dizaine', color: '#6366f1', badge: 'Entrainement' },
    ],
    gamesCards: [
      { to: '/jeux', emoji: '🎮', title: 'Jeux Cerebraux', desc: 'Memory, calcul rapide, mots...', color: '#8b5cf6', badge: '6 jeux' },
      { to: '/exam/library', emoji: '🏆', title: 'Grand Defi', desc: 'Melange toutes les matieres', color: '#f59e0b', badge: '5 defis' },
      { to: '/stories', emoji: '📖', title: 'Contes et Lecture', desc: '19 histoires interactives', color: '#1abc9c', badge: '19 contes' },
    ],
  },
  nl: {
    title: 'Leren',
    mapTitle: 'Groot Avontuur',
    mapDesc: 'Volg je avonturenkaart',
    subjectsTitle: 'Mijn Vakken',
    subjectsDesc: 'Kies een vak om te verkennen',
    progress: (c, t) => `${c} / ${t} activiteiten`,
    langTitle: 'Taal Academies',
    mathTitle: 'Wiskunde Academies',
    gamesTitle: 'Spellen en Uitdagingen',
    langCards: [
      { to: '/lexi', emoji: '📚', title: 'LexiLena', desc: 'Woorden en Zinnen Academie', color: '#7c3aed', badge: '9 modi' },
      { to: '/grammi', emoji: '🏰', title: 'GrammiLena', desc: 'Het Magische Woordenkoninkrijk', color: '#10b981', badge: '8 niveaus' },
      { to: '/verbes', emoji: '🧙', title: 'Werkwoordenrijk', desc: 'Vervoeging en mini-spellen', color: '#059669', badge: '10 niveaus' },
    ],
    mathCards: [
      { to: '/chrono', emoji: '🕐', title: 'ChronoLena', desc: 'Leer klokkijken spelenderwijs', color: '#0891b2', badge: '6 modi' },
      { to: '/metri', emoji: '📏', title: 'MetriLena', desc: 'Maten, gewichten en grootheden', color: '#f59e0b', badge: '5 werelden' },
      { to: '/tables', emoji: '✖️', title: 'Tafels', desc: 'Vermenigvuldigingstafels', color: '#e67e22', badge: '10 tafels' },
      { to: '/dudu', emoji: '🎯', title: 'DUDU', desc: 'Aftrekken met overdracht', color: '#6366f1', badge: 'Oefening' },
    ],
    gamesCards: [
      { to: '/jeux', emoji: '🎮', title: 'Hersengames', desc: 'Memory, snel rekenen, woorden...', color: '#8b5cf6', badge: '6 spellen' },
      { to: '/exam/library', emoji: '🏆', title: 'Grote Uitdaging', desc: 'Alles door elkaar', color: '#f59e0b', badge: '5 defis' },
      { to: '/stories', emoji: '📖', title: 'Verhalen', desc: '19 interactieve verhalen', color: '#1abc9c', badge: '19 verhalen' },
    ],
  },
  en: {
    title: 'Learn',
    mapTitle: 'Grand Adventure',
    mapDesc: 'Follow your adventure map',
    subjectsTitle: 'My Subjects',
    subjectsDesc: 'Choose a subject to explore',
    progress: (c, t) => `${c} / ${t} activities`,
    langTitle: 'Language Academies',
    mathTitle: 'Maths Academies',
    gamesTitle: 'Games and Challenges',
    langCards: [
      { to: '/lexi', emoji: '📚', title: 'LexiLena', desc: 'Words and Sentences Academy', color: '#7c3aed', badge: '9 modes' },
      { to: '/grammi', emoji: '🏰', title: 'GrammiLena', desc: 'The Magical Kingdom of Words', color: '#10b981', badge: '8 levels' },
      { to: '/verbes', emoji: '🧙', title: 'Verb Kingdom', desc: 'Conjugation and mini-games', color: '#059669', badge: '10 levels' },
    ],
    mathCards: [
      { to: '/chrono', emoji: '🕐', title: 'ChronoLena', desc: 'Learn to tell the time', color: '#0891b2', badge: '6 modes' },
      { to: '/metri', emoji: '📏', title: 'MetriLena', desc: 'Measurements and units', color: '#f59e0b', badge: '5 worlds' },
      { to: '/tables', emoji: '✖️', title: 'Times Tables', desc: 'Multiplication tables', color: '#e67e22', badge: '10 tables' },
      { to: '/dudu', emoji: '🎯', title: 'DUDU', desc: 'Subtractions with borrowing', color: '#6366f1', badge: 'Practice' },
    ],
    gamesCards: [
      { to: '/jeux', emoji: '🎮', title: 'Brain Games', desc: 'Memory, speed maths, words...', color: '#8b5cf6', badge: '6 games' },
      { to: '/exam/library', emoji: '🏆', title: 'Grand Challenge', desc: 'Mix all subjects', color: '#f59e0b', badge: '5 challenges' },
      { to: '/stories', emoji: '📖', title: 'Stories', desc: '19 interactive stories', color: '#1abc9c', badge: '19 stories' },
    ],
  },
  es: {
    title: 'Aprender',
    mapTitle: 'Gran Aventura',
    mapDesc: 'Sigue tu mapa de aventura',
    subjectsTitle: 'Mis Materias',
    subjectsDesc: 'Elige una materia para explorar',
    progress: (c, t) => `${c} / ${t} actividades`,
    langTitle: 'Academias de Lengua',
    mathTitle: 'Academias de Matematicas',
    gamesTitle: 'Juegos y Desafios',
    langCards: [
      { to: '/lexi', emoji: '📚', title: 'LexiLena', desc: 'Academia de Palabras y Frases', color: '#7c3aed', badge: '9 modos' },
      { to: '/grammi', emoji: '🏰', title: 'GrammiLena', desc: 'El Reino Magico de las Palabras', color: '#10b981', badge: '8 niveles' },
      { to: '/verbes', emoji: '🧙', title: 'Reino de los Verbos', desc: 'Conjugacion y mini-juegos', color: '#059669', badge: '10 niveles' },
    ],
    mathCards: [
      { to: '/chrono', emoji: '🕐', title: 'ChronoLena', desc: 'Aprendo a leer el reloj jugando', color: '#0891b2', badge: '6 modos' },
      { to: '/metri', emoji: '📏', title: 'MetriLena', desc: 'Medidas, pesos y magnitudes', color: '#f59e0b', badge: '5 mundos' },
      { to: '/tables', emoji: '✖️', title: 'Tablas', desc: 'Tablas de multiplicar', color: '#e67e22', badge: '10 tablas' },
      { to: '/dudu', emoji: '🎯', title: 'DUDU', desc: 'Restas con llevada', color: '#6366f1', badge: 'Entrenamiento' },
    ],
    gamesCards: [
      { to: '/jeux', emoji: '🎮', title: 'Juegos Cerebrales', desc: 'Memoria, calculo rapido, palabras...', color: '#8b5cf6', badge: '6 juegos' },
      { to: '/exam/library', emoji: '🏆', title: 'Gran Desafio', desc: 'Mezcla todas las materias', color: '#f59e0b', badge: '5 desafios' },
      { to: '/stories', emoji: '📖', title: 'Cuentos', desc: '19 historias interactivas', color: '#1abc9c', badge: '19 cuentos' },
    ],
  },
};

function AcademyCard({ to, emoji, title, desc, color, badge }) {
  return (
    <Link to={to} className="al-ac-card" style={{ '--ac-c': color }}>
      <div className="al-ac-card__icon">{emoji}</div>
      <div className="al-ac-card__body">
        <strong className="al-ac-card__title">{title}</strong>
        <span className="al-ac-card__desc">{desc}</span>
      </div>
      {badge && <span className="al-ac-card__badge">{badge}</span>}
    </Link>
  );
}

function GroupSection({ emoji, title, color, children }) {
  return (
    <div className="al-group" style={{ '--g-c': color }}>
      <div className="al-group__header">
        <span className="al-group__emoji">{emoji}</span>
        <h2 className="al-group__title">{title}</h2>
      </div>
      <div className="al-group__grid">
        {children}
      </div>
    </div>
  );
}

function SubjectCard({ subject, locale, t, progress }) {
  const universe = getSubjectUniverse(subject.id);
  const acts = getActivitiesBySubject(subject.id);
  const completed = acts.filter(a => progress.activities?.[a.id]?.completed).length;
  const pct = acts.length ? Math.round((completed / acts.length) * 100) : 0;

  return (
    <Link
      to={`/subjects/${subject.id}`}
      className="al-subject-card"
      style={{
        '--s-sky-top': universe.skyTop,
        '--s-sky-bot': universe.skyBottom,
        '--s-accent':  universe.accent,
        '--s-shadow':  universe.accentShadow,
        '--s-bg':      universe.accentBg,
      }}
    >
      <div className="al-subject-card__sky">
        {(() => { const Icon = SUBJECT_ICONS[subject.id]; return Icon ? <Icon size={52} /> : <span className="al-subject-card__icon">{universe.icon}</span>; })()}
        {pct === 100 && <span className="al-subject-card__crown">👑</span>}
      </div>
      <div className="al-subject-card__body">
        <strong className="al-subject-card__name">{getSubjectLabel(subject, locale, t)}</strong>
        {acts.length > 0 && (
          <div className="al-subject-card__bar">
            <div className="al-subject-card__bar-fill" style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>
    </Link>
  );
}

export default function ApprendreHubPage() {
  const { locale, t } = useLocale();
  const ui = HUB_UI[locale] || HUB_UI.fr;
  const progress = getProgressSnapshot();
  const activeSubjects = subjects.filter(s =>
    s.grades?.some(g => ['P2','P3','P4','P5','P6'].includes(g))
  );

  return (
    <div className="al-hub">
      {/* Adventure map shortcut */}
      <Link to="/map" className="al-map-banner">
        <div className="al-map-banner__bg" aria-hidden="true">
          {['☁️','🌟','✨','☁️','⭐'].map((e, i) => (
            <span key={i} className="al-map-banner__deco" style={{ '--i': i }}>{e}</span>
          ))}
        </div>
        <div className="al-map-banner__content">
          <span className="al-map-banner__emoji">🗺️</span>
          <div>
            <strong className="al-map-banner__title">{ui.mapTitle}</strong>
            <span className="al-map-banner__desc">{ui.mapDesc}</span>
          </div>
          <span className="al-map-banner__arrow">→</span>
        </div>
      </Link>

      {/* Language Academies */}
      <GroupSection emoji="🗣️" title={ui.langTitle} color="#7c3aed">
        {ui.langCards.map(c => <AcademyCard key={c.to} {...c} />)}
      </GroupSection>

      {/* Maths Academies */}
      <GroupSection emoji="🔢" title={ui.mathTitle} color="#0891b2">
        {ui.mathCards.map(c => <AcademyCard key={c.to} {...c} />)}
      </GroupSection>

      {/* Games & Challenges */}
      <GroupSection emoji="🎮" title={ui.gamesTitle} color="#f59e0b">
        {ui.gamesCards.map(c => <AcademyCard key={c.to} {...c} />)}
      </GroupSection>

      {/* Subjects grid */}
      <div className="al-section">
        <h2 className="al-section__title">{ui.subjectsTitle}</h2>
        <p className="al-section__sub">{ui.subjectsDesc}</p>
        <div className="al-subjects-grid">
          {activeSubjects.map(s => (
            <SubjectCard
              key={s.id}
              subject={s}
              locale={locale}
              t={t}
              progress={progress}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
