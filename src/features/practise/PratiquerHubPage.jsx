import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getProgressMeta } from '../../services/storage/progressStore.js';

// ── Per-card difficulty & exercise count (persisted in localStorage) ──────────
const PREF_KEY = 'lena:pratiquer:prefs:v1';

function loadPrefs() {
  try { return JSON.parse(localStorage.getItem(PREF_KEY)) || {}; }
  catch { return {}; }
}
function savePrefs(p) {
  try { localStorage.setItem(PREF_KEY, JSON.stringify(p)); } catch {}
}

const DIFFS = ['facile', 'moyen', 'difficile'];
const DIFF_LABEL = { facile: '🟢 Facile', moyen: '🟡 Moyen', difficile: '🔴 Difficile' };
const COUNTS = [5, 10, 15, 20];

// ── Card catalogue ────────────────────────────────────────────────────────────
const CARDS = [
  {
    id: 'mission', to: '/mission-impossible',
    emoji: '🕶️', bg: ['#6d4bff', '#1ac8ff'],
    badge: 'NOUVEAU',
    fr: { title: 'Mission Impossible', desc: 'Des défis qui s\'adaptent à toi' },
    nl: { title: 'Mission Impossible', desc: 'Uitdagingen die zich aanpassen' },
    en: { title: 'Mission Impossible', desc: 'Challenges that adapt to you' },
    es: { title: 'Misión Imposible', desc: 'Retos que se adaptan a ti' },
  },
  {
    id: 'exam', to: '/exam/library',
    emoji: '📚', bg: ['#7c3aed', '#5b21b6'],
    badge: 'POPULAIRE',
    fr: { title: 'Bibliothèque d\'examens', desc: '300+ examens par matière' },
    nl: { title: 'Examenbibliotheek', desc: 'Meer dan 300 examens' },
    en: { title: 'Exam Library', desc: '300+ exams by subject' },
    es: { title: 'Biblioteca de exámenes', desc: 'Más de 300 exámenes' },
  },
  {
    id: 'cahier', to: '/cahier',
    emoji: '📓', bg: ['#2563eb', '#1d4ed8'],
    fr: { title: 'Mon Cahier', desc: 'Exercices personnalisés' },
    nl: { title: 'Mijn Schrift', desc: 'Gepersonaliseerde oefeningen' },
    en: { title: 'My Notebook', desc: 'Personalised exercises' },
    es: { title: 'Mi Cuaderno', desc: 'Ejercicios personalizados' },
  },
  {
    id: 'tables', to: '/tables',
    emoji: '✖️', bg: ['#ea580c', '#c2410c'],
    fr: { title: 'Tables', desc: 'Tables de multiplication' },
    nl: { title: 'Tafels', desc: 'Vermenigvuldigingstafels' },
    en: { title: 'Times Tables', desc: 'Multiplication tables' },
    es: { title: 'Tablas', desc: 'Tablas de multiplicar' },
  },
  {
    id: 'stories', to: '/stories',
    emoji: '📖', bg: ['#0d9488', '#0f766e'],
    fr: { title: 'Contes & Lecture', desc: '19 histoires interactives' },
    nl: { title: 'Verhalen & Lezen', desc: '19 interactieve verhalen' },
    en: { title: 'Stories', desc: '19 interactive stories' },
    es: { title: 'Cuentos', desc: '19 historias interactivas' },
  },
  {
    id: 'jeux', to: '/jeux',
    emoji: '🎮', bg: ['#4f46e5', '#4338ca'],
    badge: 'NOUVEAU',
    fr: { title: 'Jeux Cérébraux', desc: 'Mémoire, calcul, mots…' },
    nl: { title: 'Hersengames', desc: 'Memory, rekenen, woorden…' },
    en: { title: 'Brain Games', desc: 'Memory, math, words…' },
    es: { title: 'Juegos Cerebrales', desc: 'Memoria, cálculo, palabras…' },
  },
  {
    id: 'dudu', to: '/dudu',
    emoji: '🧮', bg: ['#7c3aed', '#6d28d9'],
    fr: { title: 'DUDU', desc: 'Soustractions avec retenue' },
    nl: { title: 'DUDU', desc: 'Aftrekken met overdracht' },
    en: { title: 'DUDU', desc: 'Subtractions with borrowing' },
    es: { title: 'DUDU', desc: 'Restas con llevada' },
  },
  {
    id: 'chrono', to: '/chrono',
    emoji: '⏰', bg: ['#0891b2', '#0e7490'],
    fr: { title: 'ChronoLéna', desc: 'J\'apprends l\'heure en jouant' },
    nl: { title: 'ChronoLéna', desc: 'Leer klokkijken spelenderwijs' },
    en: { title: 'ChronoLéna', desc: 'I learn to tell the time' },
    es: { title: 'ChronoLéna', desc: 'Aprendo a leer el reloj' },
  },
  {
    id: 'grammi', to: '/grammi',
    emoji: '🔤', bg: ['#16a34a', '#15803d'],
    fr: { title: 'GrammiLéna', desc: 'Le royaume magique des mots' },
    nl: { title: 'GrammiLéna', desc: 'Het magische koninkrijk van woorden' },
    en: { title: 'GrammiLéna', desc: 'The magical kingdom of words' },
    es: { title: 'GrammiLéna', desc: 'El reino mágico de las palabras' },
  },
  {
    id: 'metri', to: '/metri',
    emoji: '📏', bg: ['#d97706', '#b45309'],
    fr: { title: 'MetriLéna', desc: 'Le laboratoire des grandeurs' },
    nl: { title: 'MetriLéna', desc: 'Het laboratorium der grootheden' },
    en: { title: 'MetriLéna', desc: 'The measurement laboratory' },
    es: { title: 'MetriLéna', desc: 'El laboratorio de medidas' },
  },
  {
    id: 'lexi', to: '/lexi',
    emoji: '💬', bg: ['#9333ea', '#7e22ce'],
    fr: { title: 'LexiLéna', desc: 'Académie des Mots et Phrases' },
    nl: { title: 'LexiLéna', desc: 'Woorden en Zinnen Academie' },
    en: { title: 'LexiLéna', desc: 'Words & Sentences Academy' },
    es: { title: 'LexiLéna', desc: 'Academia de Palabras y Frases' },
  },
  {
    id: 'verbes', to: '/verbes',
    emoji: '✏️', bg: ['#059669', '#047857'],
    fr: { title: 'Royaume des Verbes', desc: 'Conjugaison magique' },
    nl: { title: 'Rijk der Werkwoorden', desc: 'Magische vervoeging' },
    en: { title: 'Verb Kingdom', desc: 'Magic conjugation' },
    es: { title: 'Reino de los Verbos', desc: 'Conjugación mágica' },
  },
  {
    id: 'dico', to: '/dico',
    emoji: '📕', bg: ['#ca8a04', '#a16207'],
    fr: { title: 'Mon Dictionnaire', desc: '120 mots avec définitions' },
    nl: { title: 'Mijn Woordenboek', desc: '120 woorden met definitie' },
    en: { title: 'My Dictionary', desc: '120 words with definitions' },
    es: { title: 'Mi Diccionario', desc: '120 palabras con definiciones' },
  },
];

const HEADER_UI = {
  fr: { title: 'Pratiquer', sub: 'Choisis ton activité et amuse-toi en apprenant !', streak: 'jours de suite', correct: 'bonnes réponses' },
  nl: { title: 'Oefenen', sub: 'Kies je activiteit en leer spelenderwijs!', streak: 'dagen op rij', correct: 'goede antwoorden' },
  en: { title: 'Practise', sub: 'Choose your activity and have fun learning!', streak: 'day streak', correct: 'correct answers' },
  es: { title: 'Practicar', sub: '¡Elige tu actividad y diviértete aprendiendo!', streak: 'días seguidos', correct: 'respuestas correctas' },
};

// ── Difficulty & Count chip (tap to cycle) ─────────────────────────────────
function CycleChip({ value, options, labelMap, onCycle, color }) {
  return (
    <button
      type="button"
      className="ph-chip"
      style={{ '--chip-color': color }}
      onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); onCycle(); }}
    >
      {labelMap ? labelMap[value] : value}
    </button>
  );
}

// ── Single Activity Card ───────────────────────────────────────────────────
function ActivityCard({ card, locale, diff, count, onCycleDiff, onCycleCount, onClick }) {
  const t = card[locale] || card.fr;
  const [from, to] = card.bg;
  return (
    <div
      className="ph-card"
      style={{ '--ph-from': from, '--ph-to': to }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {card.badge && (
        <span className={`ph-card__badge ph-card__badge--${card.badge.toLowerCase()}`}>{card.badge}</span>
      )}
      <div className="ph-card__art">
        <span className="ph-card__emoji">{card.emoji}</span>
      </div>
      <div className="ph-card__body">
        <p className="ph-card__title">{t.title}</p>
        <p className="ph-card__desc">{t.desc}</p>
        <div className="ph-card__opts" onClick={(e) => e.stopPropagation()}>
          <CycleChip
            value={diff}
            options={DIFFS}
            labelMap={DIFF_LABEL}
            onCycle={onCycleDiff}
            color={diff === 'facile' ? '#22c55e' : diff === 'moyen' ? '#f59e0b' : '#ef4444'}
          />
          <CycleChip
            value={`${count} ex`}
            options={COUNTS}
            onCycle={onCycleCount}
            color="#6366f1"
          />
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function PratiquerHubPage() {
  const { locale } = useLocale();
  const navigate = useNavigate();
  const ui = HEADER_UI[locale] || HEADER_UI.fr;

  const [prefs, setPrefs] = useState(() => loadPrefs());

  const meta = (() => { try { return getProgressMeta(); } catch { return {}; } })();
  const streak = meta.streakCurrent || 0;
  const correct = meta.totalCorrect || 0;

  const getPrefs = (id) => ({
    diff: prefs[id]?.diff || 'facile',
    count: prefs[id]?.count || 10,
  });

  const cycleDiff = useCallback((id) => {
    setPrefs((prev) => {
      const cur = prev[id]?.diff || 'facile';
      const next = DIFFS[(DIFFS.indexOf(cur) + 1) % DIFFS.length];
      const updated = { ...prev, [id]: { ...prev[id], diff: next } };
      savePrefs(updated);
      return updated;
    });
  }, []);

  const cycleCount = useCallback((id) => {
    setPrefs((prev) => {
      const cur = prev[id]?.count || 10;
      const next = COUNTS[(COUNTS.indexOf(cur) + 1) % COUNTS.length];
      const updated = { ...prev, [id]: { ...prev[id], count: next } };
      savePrefs(updated);
      return updated;
    });
  }, []);

  return (
    <div className="ph-page">
      {/* ── Header ── */}
      <header className="ph-header">
        <div className="ph-header__top">
          <div className="ph-header__title-block">
            <h1 className="ph-header__title">🎯 {ui.title}</h1>
            <p className="ph-header__sub">{ui.sub}</p>
          </div>
        </div>
        <div className="ph-stats">
          <div className="ph-stat">
            <span className="ph-stat__icon">🔥</span>
            <span className="ph-stat__val">{streak}</span>
            <span className="ph-stat__lbl">{ui.streak}</span>
          </div>
          <div className="ph-stat">
            <span className="ph-stat__icon">✅</span>
            <span className="ph-stat__val">{correct}</span>
            <span className="ph-stat__lbl">{ui.correct}</span>
          </div>
        </div>
      </header>

      {/* ── Grid ── */}
      <div className="ph-grid">
        {CARDS.map((card) => {
          const { diff, count } = getPrefs(card.id);
          return (
            <ActivityCard
              key={card.id}
              card={card}
              locale={locale}
              diff={diff}
              count={count}
              onCycleDiff={() => cycleDiff(card.id)}
              onCycleCount={() => cycleCount(card.id)}
              onClick={() => navigate(`${card.to}?difficulty=${diff}&count=${count}`)}
            />
          );
        })}
      </div>
    </div>
  );
}
