import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { subjects } from '../curriculum/catalog.js';
import { getSubjectUniverse } from '../../shared/gameplay/subjectThemes.js';
import { getSubjectLabel } from '../../shared/i18n/contentLocalization.js';
import { getProgressSnapshot, getStudyStats } from '../../services/storage/progressStore.js';
import { getActivitiesBySubject } from '../curriculum/catalog.js';
import { SUBJECT_ICONS } from '../../assets/icons/AppIcons.jsx';
import { getProfile } from '../../services/storage/profileStore.js';
import { getLevelProgress } from '../../services/learning/levelSystem.js';
import { assetUrl } from '../../shared/assets/assetUrl.js';

const MASCOT_HERO = 'assets/characters/mascot-happy.svg';

// ── Hero / gamification strings ─────────────────────────────────────────────
const HERO_UI = {
  fr: {
    greet: n => `Bonjour ${n} !`,
    greetSub: 'Prête pour une nouvelle aventure ? ✨',
    levelLabel: 'Niveau',
    actsLabel: 'activités',
    streakLabel: n => `Série de ${n} jour${n > 1 ? 's' : ''}`,
    rewardLabel: 'Prochaine récompense',
    starsLabel: 'étoiles',
    voyageProgress: 'Ta progression',
    voyageCta: "Continuer l'aventure",
    rewardsTitle: 'Récompenses',
    rewards: [
      { icon: '🎁', title: 'Récompense du jour', sub: 'À réclamer !', c: '#f59e0b' },
      { icon: '🏆', title: 'Nouveau succès', sub: 'Bravo, continue !', c: '#7c3aed' },
      { icon: '⭐', title: 'Nouvel accessoire', sub: 'À débloquer', c: '#22d3ee' },
      { icon: '💎', title: 'Cristal magique', sub: 'Collecte-les', c: '#10b981' },
    ],
  },
  nl: {
    greet: n => `Hallo ${n}!`,
    greetSub: 'Klaar voor een nieuw avontuur? ✨',
    levelLabel: 'Niveau', actsLabel: 'activiteiten',
    streakLabel: n => `${n} dag${n > 1 ? 'en' : ''} reeks`,
    rewardLabel: 'Volgende beloning', starsLabel: 'sterren',
    voyageProgress: 'Jouw voortgang', voyageCta: 'Ga verder',
    rewardsTitle: 'Beloningen',
    rewards: [
      { icon: '🎁', title: 'Dagbeloning', sub: 'Te claimen!', c: '#f59e0b' },
      { icon: '🏆', title: 'Nieuwe prestatie', sub: 'Goed bezig!', c: '#7c3aed' },
      { icon: '⭐', title: 'Nieuw accessoire', sub: 'Ontgrendelen', c: '#22d3ee' },
      { icon: '💎', title: 'Magisch kristal', sub: 'Verzamel ze', c: '#10b981' },
    ],
  },
  en: {
    greet: n => `Hi ${n}!`,
    greetSub: 'Ready for a new adventure? ✨',
    levelLabel: 'Level', actsLabel: 'activities',
    streakLabel: n => `${n}-day streak`,
    rewardLabel: 'Next reward', starsLabel: 'stars',
    voyageProgress: 'Your progress', voyageCta: 'Continue the adventure',
    rewardsTitle: 'Rewards',
    rewards: [
      { icon: '🎁', title: 'Daily reward', sub: 'Claim it!', c: '#f59e0b' },
      { icon: '🏆', title: 'New achievement', sub: 'Well done!', c: '#7c3aed' },
      { icon: '⭐', title: 'New accessory', sub: 'Unlock it', c: '#22d3ee' },
      { icon: '💎', title: 'Magic crystal', sub: 'Collect them', c: '#10b981' },
    ],
  },
  es: {
    greet: n => `¡Hola ${n}!`,
    greetSub: '¿Listo para una nueva aventura? ✨',
    levelLabel: 'Nivel', actsLabel: 'actividades',
    streakLabel: n => `Racha de ${n} día${n > 1 ? 's' : ''}`,
    rewardLabel: 'Próxima recompensa', starsLabel: 'estrellas',
    voyageProgress: 'Tu progreso', voyageCta: 'Continuar la aventura',
    rewardsTitle: 'Recompensas',
    rewards: [
      { icon: '🎁', title: 'Recompensa diaria', sub: '¡A reclamar!', c: '#f59e0b' },
      { icon: '🏆', title: 'Nuevo logro', sub: '¡Bravo!', c: '#7c3aed' },
      { icon: '⭐', title: 'Nuevo accesorio', sub: 'Desbloquear', c: '#22d3ee' },
      { icon: '💎', title: 'Cristal mágico', sub: 'Coléccionalos', c: '#10b981' },
    ],
  },
};

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
      { to: '/dico', emoji: '📖', title: 'Mon Dictionnaire', desc: '120 mots avec definitions', color: '#f59e0b', badge: '120 mots' },
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
      { to: '/dico', emoji: '📖', title: 'Mijn Woordenboek', desc: '120 woorden', color: '#f59e0b', badge: '120 woorden' },
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
      { to: '/dico', emoji: '📖', title: 'My Dictionary', desc: '120 words', color: '#f59e0b', badge: '120 words' },
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
      { to: '/dico', emoji: '📖', title: 'Mi Diccionario', desc: '120 palabras', color: '#f59e0b', badge: '120 palabras' },
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

// ── Premium hero: mascot + greeting + level + XP + streak + reward ──────────
function Hero({ hero, name, level, levelInfo, done, streak, stars }) {
  const pct = Math.round(levelInfo.progress * 100);
  const next = levelInfo.nextLevelAt ?? done;
  return (
    <div className="al-hero">
      <div className="al-hero__stars" aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => <span key={i} className="al-hero__star" style={{ '--i': i }} />)}
      </div>

      <div className="al-hero__mascot-wrap" aria-hidden="true">
        <img src={assetUrl(MASCOT_HERO)} className="al-hero__mascot" alt="" draggable="false" />
        <div className="al-hero__mascot-glow" />
      </div>

      <div className="al-hero__main">
        <h1 className="al-hero__greet">{hero.greet(name)}</h1>
        <p className="al-hero__sub">{hero.greetSub}</p>

        <div className="al-hero__levelrow">
          <span className="al-hero__level-badge">⚡ {hero.levelLabel} {level}</span>
          <span className="al-hero__xp">{done} / {next} {hero.actsLabel}</span>
        </div>
        <div className="al-hero__bar">
          <div className="al-hero__bar-fill" style={{ width: `${pct}%` }} />
        </div>

        <div className="al-hero__chips">
          <span className="al-hero__chip al-hero__chip--fire">🔥 {hero.streakLabel(streak)}</span>
          <span className="al-hero__chip al-hero__chip--star">⭐ {stars} {hero.starsLabel}</span>
          <span className="al-hero__chip al-hero__chip--gift">🎁 {hero.rewardLabel}</span>
        </div>
      </div>
    </div>
  );
}

// ── Reward cards (architecture prepared for future store) ───────────────────
function RewardCard({ icon, title, sub, c }) {
  return (
    <div className="al-reward" style={{ '--rw-c': c }}>
      <span className="al-reward__icon">{icon}</span>
      <div className="al-reward__body">
        <strong className="al-reward__title">{title}</strong>
        <span className="al-reward__sub">{sub}</span>
      </div>
      <span className="al-reward__plus">+</span>
    </div>
  );
}

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
  const hero = HERO_UI[locale] || HERO_UI.fr;
  const progress = getProgressSnapshot();
  const profile = getProfile();
  const stats = getStudyStats();
  const activeSubjects = subjects.filter(s =>
    s.grades?.some(g => ['P2','P3','P4','P5','P6'].includes(g))
  );

  const totalActs = activeSubjects.reduce((sum, s) => sum + getActivitiesBySubject(s.id).length, 0);
  const doneActs  = activeSubjects.reduce((sum, s) => {
    const acts = getActivitiesBySubject(s.id);
    return sum + acts.filter(a => progress.activities?.[a.id]?.completed).length;
  }, 0);
  const globalPct = totalActs > 0 ? Math.round((doneActs / totalActs) * 100) : 0;

  const levelInfo = getLevelProgress(doneActs);
  const name      = profile.name || 'toi';
  const streak    = stats.streakCurrent || profile.streakCurrent || 0;
  const stars     = stats.totalCorrect || 0;

  return (
    <div className="al-hub">

      {/* ── Premium hero ──────────────────────────────────────── */}
      <Hero
        hero={hero}
        name={name}
        level={levelInfo.level}
        levelInfo={levelInfo}
        done={doneActs}
        streak={streak}
        stars={stars}
      />

      {/* ── Mes Matières ──────────────────────────────────────── */}
      <div className="al-subjects-header">
        <div className="al-subjects-header__top">
          <h2 className="al-subjects-header__title">{ui.subjectsTitle}</h2>
          <span className="al-subjects-header__pct">{globalPct}%</span>
        </div>
        <div className="al-subjects-header__bar">
          <div className="al-subjects-header__bar-fill" style={{ width: `${globalPct}%` }} />
        </div>
        <p className="al-subjects-header__sub">{ui.subjectsDesc}</p>
      </div>

      <div className="al-subjects-grid al-subjects-grid--top">
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

      {/* ── Grand Voyage — main adventure system ──────────────── */}
      <Link to="/map" className="al-voyage">
        <div className="al-voyage__sky" aria-hidden="true">
          {['🌟','✨','⭐','💫','🌠','✨'].map((e, i) => (
            <span key={i} className="al-voyage__deco" style={{ '--i': i }}>{e}</span>
          ))}
        </div>
        <div className="al-voyage__castle" aria-hidden="true">🏰</div>
        <div className="al-voyage__content">
          <div className="al-voyage__head">
            <span className="al-voyage__map-emoji">🗺️</span>
            <div>
              <strong className="al-voyage__title">{ui.mapTitle}</strong>
              <span className="al-voyage__desc">{ui.mapDesc}</span>
            </div>
          </div>
          <div className="al-voyage__progress">
            <div className="al-voyage__prog-row">
              <span className="al-voyage__prog-label">{hero.voyageProgress}</span>
              <span className="al-voyage__prog-pct">{globalPct}%</span>
            </div>
            <div className="al-voyage__bar">
              <div className="al-voyage__bar-fill" style={{ width: `${globalPct}%` }} />
            </div>
          </div>
          <span className="al-voyage__cta">{hero.voyageCta} →</span>
        </div>
      </Link>

      {/* ── Rewards row ───────────────────────────────────────── */}
      <div className="al-rewards-section">
        <div className="al-rewards-head">
          <span className="al-group__emoji">🎁</span>
          <h2 className="al-group__title">{hero.rewardsTitle}</h2>
        </div>
        <div className="al-rewards-grid">
          {hero.rewards.map((r, i) => <RewardCard key={i} {...r} />)}
        </div>
      </div>

      {/* ── Academies ─────────────────────────────────────────── */}
      <GroupSection emoji="🗣️" title={ui.langTitle} color="#7c3aed">
        {ui.langCards.map(c => <AcademyCard key={c.to} {...c} />)}
      </GroupSection>

      <GroupSection emoji="🔢" title={ui.mathTitle} color="#0891b2">
        {ui.mathCards.map(c => <AcademyCard key={c.to} {...c} />)}
      </GroupSection>

      <GroupSection emoji="🎮" title={ui.gamesTitle} color="#f59e0b">
        {ui.gamesCards.map(c => <AcademyCard key={c.to} {...c} />)}
      </GroupSection>

    </div>
  );
}
