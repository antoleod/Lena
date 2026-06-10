import { useEffect, useRef, useState } from 'react';
import './metri.css';
import FeedbackCard from '../../shared/ui/FeedbackCard.jsx';
import FunContentCard from '../../shared/ui/FunContentCard.jsx';
import NumPad from '../../shared/ui/NumPad.jsx';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import {
  CATEGORIES, QUANTITY_EXAMPLES, UNIT_SENTENCES, ESTIMATIONS,
  DETECTIVE_SITUATIONS, MISSIONS, METRI_BADGES, ENCOURAGEMENTS_METRI,
  genUnitHunt, genMarketQuestion, filterByLevel,
} from './metriEngine.js';
import { checkNewBadges, loadProgress, recordAnswer } from './metriProgress.js';

// ── Theory data ─────────────────────────────────────────────────────────
const THEORY_STEPS = [
  {
    num: 'Etape 1', color: '#3b82f6',
    title: 'Les Longueurs 📏',
    content: 'On mesure les longueurs en mm, cm, m ou km. Plus la distance est grande, plus l\'unite est grande !',
    examples: ['mm', 'cm', 'm', 'km'],
    exColor: '#3b82f6',
  },
  {
    num: 'Etape 2', color: '#8b5cf6',
    title: 'Les Masses ⚖️',
    content: 'On pese les objets en grammes (g) ou kilogrammes (kg). 1 kg = 1000 g',
    examples: ['g', 'kg'],
    exColor: '#8b5cf6',
  },
  {
    num: 'Etape 3', color: '#06b6d4',
    title: 'Les Capacites 💧',
    content: 'On mesure les liquides en ml, cl, dl ou l. 1 l = 10 dl = 100 cl = 1000 ml',
    examples: ['ml', 'cl', 'dl', 'l'],
    exColor: '#06b6d4',
  },
  {
    num: 'Etape 4', color: '#22c55e',
    title: 'Les Durees ⏱️',
    content: 'Le temps se mesure en secondes (s), minutes (min) ou heures (h). 1 h = 60 min = 3600 s',
    examples: ['s', 'min', 'h'],
    exColor: '#22c55e',
  },
  {
    num: 'Etape 5', color: '#f59e0b',
    title: 'Les Couts 💶',
    content: 'L\'argent se compte en centimes (c) et euros (€). 1 € = 100 c',
    examples: ['c', '€'],
    exColor: '#f59e0b',
  },
  {
    num: 'Etape 6', color: '#ec4899',
    title: 'Comment choisir ? 🤔',
    content: 'Toujours demander : QUE mesure-t-on ? Un objet ? Sa masse. Un liquide ? Sa capacite. Un chemin ? Sa longueur. Un temps ? Sa duree. Un prix ? Son cout.',
    examples: [],
    exColor: '#ec4899',
  },
];

// ── BadgePopup ──────────────────────────────────────────────────────────
function BadgePopup({ badge, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => { closeRef.current?.focus(); }, []);
  return (
    <div className="mt-overlay" role="dialog" aria-modal="true" aria-labelledby="badge-title">
      <div className="mt-badge-popup">
        <div className="mt-badge-popup__emoji">{badge.emoji}</div>
        <div className="mt-badge-popup__title" id="badge-title">{badge.label}</div>
        <div className="mt-badge-popup__sub">Nouveau badge debloque !</div>
        <button
          ref={closeRef}
          className="mt-badge-popup__close"
          type="button"
          onPointerDown={e => { e.preventDefault(); onClose(); }}
        >
          Super !
        </button>
      </div>
    </div>
  );
}


// ── LevelPicker ──────────────────────────────────────────────────────────
function LevelPicker({ modeName, onSelect, onBack, locale }) {
  const labels = {
    fr: { title: 'Choisis ton niveau', back: 'Retour',
          facile: 'Facile 🟢', moyen: 'Moyen 🟡', difficile: 'Difficile 🔴',
          fdesc: 'Moins de questions, categories simples',
          mdesc: 'Toutes les categories, 4 choix',
          ddesc: 'Tout ! Timer 15 secondes' },
    nl: { title: 'Kies je niveau', back: 'Terug',
          facile: 'Makkelijk 🟢', moyen: 'Gemiddeld 🟡', difficile: 'Moeilijk 🔴',
          fdesc: 'Minder vragen, eenvoudige categorieen',
          mdesc: 'Alle categorieen, 4 keuzes',
          ddesc: 'Alles! Timer 15 seconden' },
    en: { title: 'Choose your level', back: 'Back',
          facile: 'Easy 🟢', moyen: 'Medium 🟡', difficile: 'Hard 🔴',
          fdesc: 'Fewer questions, simple categories',
          mdesc: 'All categories, 4 choices',
          ddesc: 'Everything! 15 second timer' },
    es: { title: 'Elige tu nivel', back: 'Volver',
          facile: 'Facil 🟢', moyen: 'Medio 🟡', difficile: 'Dificil 🔴',
          fdesc: 'Menos preguntas, categorias simples',
          mdesc: 'Todas las categorias, 4 opciones',
          ddesc: 'Todo! Temporizador 15 segundos' },
  };
  const t = labels[locale] || labels.fr;
  return (
    <div className="mt-level-picker">
      <button className="mt-back-btn" type="button" onPointerDown={e => { e.preventDefault(); onBack(); }}>← {t.back}</button>
      <h2 className="mt-level-picker__title">{t.title}</h2>
      <p className="mt-level-picker__mode">{modeName}</p>
      {[
        { key: 'facile', label: t.facile, desc: t.fdesc, color: '#22c55e' },
        { key: 'moyen',  label: t.moyen,  desc: t.mdesc, color: '#f59e0b' },
        { key: 'difficile', label: t.difficile, desc: t.ddesc, color: '#ef4444' },
      ].map(lvl => (
        <button
          key={lvl.key}
          className="mt-level-btn"
          style={{ '--lvl-c': lvl.color }}
          type="button"
          onPointerDown={e => { e.preventDefault(); onSelect(lvl.key); }}
        >
          <span className="mt-level-btn__label">{lvl.label}</span>
          <span className="mt-level-btn__desc">{lvl.desc}</span>
        </button>
      ))}
    </div>
  );
}

// ── MetriPage ───────────────────────────────────────────────────────────
export default function MetriPage() {
  // All hooks at top level
  const { locale } = useLocale();
  const [fbState, setFbState] = useState(null);
  const [phase, setPhase] = useState('hub');
  const [currentMode, setCurrentMode] = useState('');
  const [difficulty, setDifficulty] = useState(null);
  const [progress, setProgress] = useState(() => loadProgress());
  const [badge, setBadge] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('idle');
  const [selectedInput, setSelectedInput] = useState(null);
  const [encourage, setEncourage] = useState('');
  const [tries, setTries] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState('');
  // Mega Reto
  const [megaReto, setMegaReto] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef(null);

  const pct = progress.totalAttempts > 0
    ? Math.min(100, Math.round((progress.totalCorrect / progress.totalAttempts) * 100))
    : 0;

  function startMode(mode, diff) {
    const activeDiff = diff !== undefined ? diff : difficulty;
    clearInterval(timerRef.current);
    setTimeLeft(15);
    setCurrentMode(mode);
    setPhase(mode);
    setQIdx(0); setScore(0); setStatus('idle'); setTries(0);
    setEncourage(''); setSelectedInput(null); setStepIdx(0); setTypedAnswer('');

    // Enable mega reto automatically for difficile
    const isHard = activeDiff === 'difficile';
    if (isHard) setMegaReto(true);

    // Question counts per difficulty
    const qCount = activeDiff === 'facile' ? 6 : activeDiff === 'moyen' ? 10 : 12;
    const qCount8 = activeDiff === 'facile' ? 6 : activeDiff === 'moyen' ? 8 : 10;

    const cats = Object.keys(CATEGORIES);
    if (mode === 'unit-hunt') {
      setQuestions(Array.from({ length: qCount }, (_, i) => genUnitHunt(cats[i % cats.length])));
    } else if (mode === 'what-for' || mode === 'match-grandeur') {
      const pool = filterByLevel(QUANTITY_EXAMPLES, activeDiff);
      const shuffled = [...pool].sort(() => Math.random() - .5);
      setQuestions(shuffled.slice(0, qCount).map(q => {
        const otherCats = cats.filter(c => c !== q.cat);
        const allOpts = [q.cat, ...otherCats.slice(0, 3)].sort(() => Math.random() - .5);
        const opts = activeDiff === 'facile' ? allOpts.slice(0, 3) : allOpts;
        return { ...q, options: opts };
      }));
    } else if (mode === 'choose-unit') {
      const pool = filterByLevel(UNIT_SENTENCES, activeDiff);
      setQuestions([...pool].sort(() => Math.random() - .5).slice(0, qCount));
    } else if (mode === 'market') {
      setQuestions(Array.from({ length: qCount8 }, genMarketQuestion));
    } else if (mode === 'estimation') {
      const pool = filterByLevel(ESTIMATIONS, activeDiff);
      setQuestions([...pool].sort(() => Math.random() - .5).slice(0, qCount));
    } else if (mode === 'detective') {
      const pool = filterByLevel(DETECTIVE_SITUATIONS, activeDiff);
      setQuestions([...pool].sort(() => Math.random() - .5).slice(0, qCount));
    } else if (mode === 'missions') {
      const pool = filterByLevel(MISSIONS, activeDiff);
      setQuestions([...pool].sort(() => Math.random() - .5).slice(0, qCount8));
    }
  }

  function handleAnswer(answer, correct) {
    const isCorrect = String(answer) === String(correct);
    const newProg = recordAnswer(isCorrect);
    setProgress(newProg);
    const newBadges = checkNewBadges(newProg, METRI_BADGES);
    if (newBadges.length > 0) setBadge(newBadges[0]);

    setSelectedInput(answer);
    setStatus(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setScore(s => s + 1);
      setTries(0);
      setFbState({ isCorrect: true, correctAnswer: null });
    } else {
      const t = tries + 1;
      setTries(t);
      if (!megaReto) setEncourage(ENCOURAGEMENTS_METRI[Math.floor(Math.random() * ENCOURAGEMENTS_METRI.length)]);
      if (t >= 2) {
        setFbState({ isCorrect: false, correctAnswer: String(correct) });
      } else {
        setTimeout(() => { setStatus('idle'); setSelectedInput(null); }, 1200);
      }
    }
  }

  function handleNext() {
    setFbState(null);
    setStatus('idle');
    advance();
  }

  function advance() {
    if (qIdx + 1 >= questions.length) {
      setPhase('results');
    } else {
      setQIdx(i => i + 1);
      setStatus('idle');
      setSelectedInput(null);
      setEncourage('');
      setTries(0);
      setTypedAnswer('');
    }
  }

  const MT_QUIZ_PHASES = ['unit-hunt','what-for','match-grandeur','choose-unit','market','estimation','detective','missions'];

  function handleTimeOut() {
    const newProg = recordAnswer(false);
    setProgress(newProg);
    setStatus('wrong');
    setEncourage('');
    const q = questions[qIdx];
    const correctAnswer = q ? String(q.answer ?? q.correct ?? '') : '';
    setFbState({ isCorrect: false, correctAnswer });
    setTimeout(() => handleNext(), 2500);
  }

  useEffect(() => {
    if (!megaReto) return;
    if (!MT_QUIZ_PHASES.includes(phase)) return;
    if (status !== 'idle') return;
    clearInterval(timerRef.current);
    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, qIdx, megaReto, status]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── HUB ────────────────────────────────────────────────────────────────
  if (phase === 'hub') {
    const earnedBadges = METRI_BADGES.filter(b => progress.badges.includes(b.id));

    const theoryCard = { mode: 'theory', emoji: '📖', name: 'Theorie Interactive', desc: 'Apprends les grandeurs et unites', color: '#f59e0b' };

    const gameCards = [
      { mode: 'unit-hunt',     emoji: '🎯', name: 'Chasse aux Unites',      desc: 'Trouve la bonne unite',          color: '#3b82f6', badge: 'Unites' },
      { mode: 'what-for',      emoji: '🔗', name: 'A quoi ca sert ?',        desc: 'Quelle grandeur ?',              color: '#8b5cf6', badge: 'Categories' },
      { mode: 'match-grandeur',emoji: '🔄', name: 'Relie les Grandeurs',     desc: 'Associe quantite et grandeur',   color: '#06b6d4', badge: 'Relier' },
      { mode: 'choose-unit',   emoji: '✏️', name: 'Choisis l\'Unite',        desc: 'Complete la phrase',             color: '#22c55e', badge: 'Choisir' },
      { mode: 'market',        emoji: '🛒', name: 'Le Marche Magique',       desc: 'Calcule la monnaie',             color: '#f59e0b', badge: 'Argent' },
      { mode: 'estimation',    emoji: '🎯', name: 'Estimation Intelligente', desc: 'Estime les grandeurs',           color: '#ec4899', badge: 'Estimer' },
      { mode: 'detective',     emoji: '🕵️', name: 'Detectif des Mesures',   desc: 'Identifie le type de grandeur',  color: '#ef4444', badge: 'Detective' },
      { mode: 'missions',      emoji: '🌟', name: 'Missions du Quotidien',   desc: 'Problemes de la vie reelle',     color: '#10b981', badge: 'Missions' },
    ];

    return (
      <div className="mt-page">
        <div className="mt-hero">
          <div className="mt-hero__mascot">📏</div>
          <div>
            <h1 className="mt-hero__title">MetriLena</h1>
            <p className="mt-hero__sub">Le laboratoire des grandeurs</p>
          </div>
        </div>

        <div className="mt-global-prog">
          <p className="mt-global-prog__label">Progression globale</p>
          <div className="mt-global-prog__bar">
            <div className="mt-global-prog__fill" style={{ width: pct + '%' }} />
          </div>
          <div className="mt-global-prog__stats">
            <span className="mt-global-prog__stat"><strong>{progress.totalCorrect}</strong> correct</span>
            <span className="mt-global-prog__stat"><strong>{progress.totalAttempts}</strong> tentatives</span>
            <span className="mt-global-prog__stat"><strong>{earnedBadges.length}</strong> badges</span>
          </div>
        </div>

        <div className="mt-body">
          <p className="mt-section-label">Theorie</p>
          <div className="mt-cat-grid">
            <button
              className="mt-cat-card"
              style={{ '--cat-color': theoryCard.color }}
              type="button"
              onPointerDown={e => { e.preventDefault(); startMode(theoryCard.mode, 'moyen'); }}
            >
              <div className="mt-cat-card__stripe" />
              <div className="mt-cat-card__body">
                <span className="mt-cat-card__emoji">{theoryCard.emoji}</span>
                <span className="mt-cat-card__name">{theoryCard.name}</span>
                <span className="mt-cat-card__desc">{theoryCard.desc}</span>
              </div>
            </button>
          </div>

          <p className="mt-section-label">Les Jeux</p>
          <div className="mt-cat-grid">
            {gameCards.map(c => (
              <button
                key={c.mode}
                className="mt-cat-card"
                style={{ '--cat-color': c.color }}
                type="button"
                onPointerDown={e => { e.preventDefault(); setCurrentMode(c.mode); setPhase('level-pick'); }}
              >
                <div className="mt-cat-card__stripe" />
                <div className="mt-cat-card__body">
                  <span className="mt-cat-card__emoji">{c.emoji}</span>
                  <span className="mt-cat-card__name">{c.name}</span>
                  <span className="mt-cat-card__desc">{c.desc}</span>
                  {c.badge && <span className="mt-cat-card__badge">{c.badge}</span>}
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`mt-mega-btn${megaReto ? ' is-active' : ''}`}
            onPointerDown={e => { e.preventDefault(); setMegaReto(m => !m); }}
          >
            {megaReto ? '🔥 Mega Reto ACTIF — Touche pour desactiver' : '🔥 Activer le Mega Reto'}
          </button>

          {METRI_BADGES.length > 0 && (
            <>
              <p className="mt-section-label">Badges</p>
              <div className="mt-badges">
                {METRI_BADGES.map(b => {
                  const earned = progress.badges.includes(b.id);
                  return (
                    <div key={b.id} className={'mt-badge-chip' + (earned ? ' is-earned' : ' is-locked')}>
                      <span className="mt-badge-chip__emoji">{b.emoji}</span>
                      <span>{b.label}</span>
                      {!earned && <span style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.4)' }}>({b.threshold}✓)</span>}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <div style={{ height: 80 }} />
        </div>
      </div>
    );
  }

  // ── LEVEL PICK ──────────────────────────────────────────────────────────
  if (phase === 'level-pick') {
    const gameNames = {
      'unit-hunt':     'Chasse aux Unites',
      'what-for':      'A quoi ca sert ?',
      'match-grandeur':'Relie les Grandeurs',
      'choose-unit':   'Choisis l\'Unite',
      'market':        'Le Marche Magique',
      'estimation':    'Estimation Intelligente',
      'detective':     'Detectif des Mesures',
      'missions':      'Missions du Quotidien',
    };
    return (
      <LevelPicker
        modeName={gameNames[currentMode] || currentMode}
        onSelect={d => { setDifficulty(d); startMode(currentMode, d); }}
        onBack={() => { setDifficulty(null); setPhase('hub'); }}
        locale={locale}
      />
    );
  }

  // ── THEORY ─────────────────────────────────────────────────────────────
  if (phase === 'theory') {
    const step = THEORY_STEPS[stepIdx];
    const isLast = stepIdx >= THEORY_STEPS.length - 1;
    return (
      <div className="mt-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="mt-quiz-bar">
          <button className="mt-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setDifficulty(null); setPhase('hub'); }}>←</button>
          <span className="mt-quiz-bar__title">Theorie Interactive</span>
          <span className="mt-quiz-bar__counter">{stepIdx + 1}/{THEORY_STEPS.length}</span>
        </div>
        <div className="mt-theory">
          {THEORY_STEPS.map((s, i) => (
            <div
              key={i}
              className={'mt-step-card' + (i === stepIdx ? ' is-active' : '')}
              style={{ '--step-color': s.color }}
            >
              <p className="mt-step-card__num">{s.num}</p>
              <p className="mt-step-card__content"><strong>{s.title}</strong></p>
              <p className="mt-step-card__content">{s.content}</p>
              {s.examples.length > 0 && (
                <div className="mt-step-card__examples">
                  {s.examples.map(ex => (
                    <span key={ex} className="mt-example-chip" style={{ background: s.exColor }}>{ex}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-step-nav">
          {stepIdx > 0 && (
            <button className="mt-step-btn mt-step-btn--prev" type="button" onPointerDown={e => { e.preventDefault(); setStepIdx(i => i - 1); }}>
              ← Precedent
            </button>
          )}
          {!isLast ? (
            <button className="mt-step-btn mt-step-btn--next" type="button" onPointerDown={e => { e.preventDefault(); setStepIdx(i => i + 1); }}>
              Suivant →
            </button>
          ) : (
            <button className="mt-step-btn mt-step-btn--next" type="button" onPointerDown={e => { e.preventDefault(); setDifficulty(null); setPhase('hub'); }}>
              Terminer ✓
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── JEU 1 — Chasse aux Unites ──────────────────────────────────────────
  if (phase === 'unit-hunt') {
    const q = questions[qIdx];
    if (!q) return null;
    const progW = questions.length > 0 ? ((qIdx / questions.length) * 100) : 0;
    return (
      <div className="mt-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="mt-quiz-bar">
          <button className="mt-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setDifficulty(null); setPhase('hub'); }}>←</button>
          <span className="mt-quiz-bar__title">Chasse aux Unites</span>
          <span className="mt-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="mt-prog-bar"><div className="mt-prog-bar__fill" style={{ width: progW + '%' }} /></div>
        {megaReto && (
          <div className="mt-timer-bar">
            <div className={`mt-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
            <span className="mt-timer-bar__num">{timeLeft}s</span>
          </div>
        )}

        <div className={'mt-word-display' + (status === 'correct' ? ' is-correct' : status === 'wrong' ? ' is-wrong' : '')}>
          <div style={{ fontSize: '2.5rem' }}>{CATEGORIES[q.targetCat].emoji}</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginTop: 8 }}>{CATEGORIES[q.targetCat].label}</div>
        </div>

        <div className="mt-question">{q.question}</div>

        <div className="mt-choices">
          {q.options.map((opt, i) => {
            let cls = 'mt-choice';
            if (selectedInput !== null) {
              if (opt === q.correct) cls += ' is-correct';
              else if (opt === selectedInput) cls += ' is-wrong';
            }
            return (
              <button
                key={i}
                className={cls}
                type="button"
                onPointerDown={e => {
                  e.preventDefault();
                  if (status !== 'idle') return;
                  setSelectedInput(opt);
                  handleAnswer(opt, q.correct);
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {encourage !== '' && status === 'wrong' && (
          <div className="mt-encourage">{encourage}</div>
        )}
        {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale={locale} onNext={handleNext} />}
      </div>
    );
  }

  // ── JEU 2 — A quoi ca sert ? ────────────────────────────────────────────
  if (phase === 'what-for') {
    const q = questions[qIdx];
    if (!q) return null;
    const progW = questions.length > 0 ? ((qIdx / questions.length) * 100) : 0;
    return (
      <div className="mt-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="mt-quiz-bar">
          <button className="mt-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setDifficulty(null); setPhase('hub'); }}>←</button>
          <span className="mt-quiz-bar__title">A quoi ca sert ?</span>
          <span className="mt-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="mt-prog-bar"><div className="mt-prog-bar__fill" style={{ width: progW + '%' }} /></div>
        {megaReto && (
          <div className="mt-timer-bar">
            <div className={`mt-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
            <span className="mt-timer-bar__num">{timeLeft}s</span>
          </div>
        )}

        <div className={'mt-word-display' + (status === 'correct' ? ' is-correct' : status === 'wrong' ? ' is-wrong' : '')}>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff' }}>{q.text}</div>
        </div>

        <div className="mt-question">Cette mesure est une...</div>

        <div className="mt-choices mt-choices--col1">
          {q.options.map(opt => (
            <button
              type="button"
              key={opt}
              className={'mt-choice' + (status !== 'idle' ? (opt === q.cat ? ' is-correct' : selectedInput === opt ? ' is-wrong' : '') : '')}
              style={{ borderColor: status !== 'idle' && opt === q.cat ? CATEGORIES[opt]?.color : undefined }}
              onPointerDown={e => { e.preventDefault(); if (status === 'idle') { setSelectedInput(opt); handleAnswer(opt, q.cat); } }}
            >
              {CATEGORIES[opt]?.emoji} {CATEGORIES[opt]?.label}
            </button>
          ))}
        </div>

        {encourage !== '' && status === 'wrong' && (
          <div className="mt-encourage">{encourage}</div>
        )}
        {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale={locale} onNext={handleNext} />}
      </div>
    );
  }

  // ── JEU 3 — Relie les Grandeurs ─────────────────────────────────────────
  if (phase === 'match-grandeur') {
    const q = questions[qIdx];
    if (!q) return null;
    const progW = questions.length > 0 ? ((qIdx / questions.length) * 100) : 0;
    return (
      <div className="mt-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="mt-quiz-bar">
          <button className="mt-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setDifficulty(null); setPhase('hub'); }}>←</button>
          <span className="mt-quiz-bar__title">Relie les Grandeurs</span>
          <span className="mt-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="mt-prog-bar"><div className="mt-prog-bar__fill" style={{ width: progW + '%' }} /></div>
        {megaReto && (
          <div className="mt-timer-bar">
            <div className={`mt-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
            <span className="mt-timer-bar__num">{timeLeft}s</span>
          </div>
        )}

        <div className={'mt-word-display' + (status === 'correct' ? ' is-correct' : status === 'wrong' ? ' is-wrong' : '')}>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff' }}>{q.text}</div>
          <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,.6)', marginTop: 6 }}>unite : <strong style={{ color: '#fbbf24' }}>{q.unit}</strong></div>
        </div>

        <div className="mt-question">Quelle type de grandeur est-ce ?</div>

        <div className="mt-choices mt-choices--col1">
          {q.options.map(opt => (
            <button
              type="button"
              key={opt}
              className={'mt-choice' + (status !== 'idle' ? (opt === q.cat ? ' is-correct' : selectedInput === opt ? ' is-wrong' : '') : '')}
              style={{ borderColor: status !== 'idle' && opt === q.cat ? CATEGORIES[opt]?.color : undefined }}
              onPointerDown={e => { e.preventDefault(); if (status === 'idle') { setSelectedInput(opt); handleAnswer(opt, q.cat); } }}
            >
              {CATEGORIES[opt]?.emoji} {CATEGORIES[opt]?.label}
            </button>
          ))}
        </div>

        {encourage !== '' && status === 'wrong' && (
          <div className="mt-encourage">{encourage}</div>
        )}
        {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale={locale} onNext={handleNext} />}
      </div>
    );
  }

  // ── JEU 4 — Choisis la Bonne Unite ──────────────────────────────────────
  if (phase === 'choose-unit') {
    const q = questions[qIdx];
    if (!q) return null;
    const progW = questions.length > 0 ? ((qIdx / questions.length) * 100) : 0;
    const allOptions = [q.correct, ...q.distractors].sort(() => Math.random() - .5);
    const displayOptions = difficulty === 'facile' ? allOptions.slice(0, 3) : allOptions;
    const parts = q.template.split('___');
    return (
      <div className="mt-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="mt-quiz-bar">
          <button className="mt-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setDifficulty(null); setPhase('hub'); }}>←</button>
          <span className="mt-quiz-bar__title">Choisis la Bonne Unite</span>
          <span className="mt-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="mt-prog-bar"><div className="mt-prog-bar__fill" style={{ width: progW + '%' }} /></div>
        {megaReto && (
          <div className="mt-timer-bar">
            <div className={`mt-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
            <span className="mt-timer-bar__num">{timeLeft}s</span>
          </div>
        )}

        <div className={'mt-phrase-display' + (status === 'correct' ? ' is-correct' : status === 'wrong' ? ' is-wrong' : '')}>
          {parts[0]}
          <span className="mt-phrase-blank">
            {selectedInput !== null ? selectedInput : '___'}
          </span>
          {parts[1]}
        </div>

        <div className="mt-question">Quelle unite complete la phrase ? ({q.hint})</div>

        <div className="mt-choices">
          {displayOptions.map((opt, i) => {
            let cls = 'mt-choice';
            if (selectedInput !== null) {
              if (opt === q.correct) cls += ' is-correct';
              else if (opt === selectedInput) cls += ' is-wrong';
            }
            return (
              <button
                key={i}
                className={cls}
                type="button"
                onPointerDown={e => {
                  e.preventDefault();
                  if (status !== 'idle') return;
                  setSelectedInput(opt);
                  handleAnswer(opt, q.correct);
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {encourage !== '' && status === 'wrong' && (
          <div className="mt-encourage">{encourage}</div>
        )}
        {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale={locale} onNext={handleNext} />}
      </div>
    );
  }

  // ── JEU 5 — Le Marche Magique ────────────────────────────────────────────
  if (phase === 'market') {
    const q = questions[qIdx];
    if (!q) return null;
    const progW = questions.length > 0 ? ((qIdx / questions.length) * 100) : 0;
    return (
      <div className="mt-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="mt-quiz-bar">
          <button className="mt-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setDifficulty(null); setPhase('hub'); }}>←</button>
          <span className="mt-quiz-bar__title">Le Marche Magique</span>
          <span className="mt-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="mt-prog-bar"><div className="mt-prog-bar__fill" style={{ width: progW + '%' }} /></div>
        {megaReto && (
          <div className="mt-timer-bar">
            <div className={`mt-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
            <span className="mt-timer-bar__num">{timeLeft}s</span>
          </div>
        )}

        <div className="mt-market-card">
          <div style={{ fontSize: '2rem' }}>🛒</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: '6px 0' }}>{q.item}</div>
          <div style={{ fontSize: '.9rem', color: 'rgba(255,255,255,.6)' }}>Prix : <strong style={{ color: '#fbbf24' }}>{q.priceLabel}</strong></div>
          <div style={{ fontSize: '.9rem', color: 'rgba(255,255,255,.6)' }}>Tu paies : <strong style={{ color: '#fff' }}>{q.paidLabel}</strong></div>
          <div style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.5)', marginTop: 4 }}>Quelle est la monnaie ?</div>
        </div>

        <div className="mt-choices">
          {q.options.map((opt, i) => {
            const optLabel = opt % 1 === 0 ? opt + ' €' : opt.toFixed(2).replace('.', ',') + ' €';
            let cls = 'mt-choice';
            if (selectedInput !== null) {
              if (opt === q.change) cls += ' is-correct';
              else if (opt === selectedInput) cls += ' is-wrong';
            }
            return (
              <button
                key={i}
                className={cls}
                type="button"
                onPointerDown={e => {
                  e.preventDefault();
                  if (status !== 'idle') return;
                  setSelectedInput(opt);
                  handleAnswer(opt, q.change);
                }}
              >
                {optLabel}
              </button>
            );
          })}
        </div>

        {encourage !== '' && status === 'wrong' && (
          <div className="mt-encourage">{encourage}</div>
        )}
        {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale={locale} onNext={handleNext} />}
      </div>
    );
  }

  // ── JEU 6 — Estimation Intelligente ─────────────────────────────────────
  if (phase === 'estimation') {
    const q = questions[qIdx];
    if (!q) return null;
    const progW = questions.length > 0 ? ((qIdx / questions.length) * 100) : 0;
    const displayOptions = difficulty === 'facile' ? q.options.slice(0, 3) : q.options;
    return (
      <div className="mt-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="mt-quiz-bar">
          <button className="mt-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setDifficulty(null); setPhase('hub'); }}>←</button>
          <span className="mt-quiz-bar__title">Estimation Intelligente</span>
          <span className="mt-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="mt-prog-bar"><div className="mt-prog-bar__fill" style={{ width: progW + '%' }} /></div>
        {megaReto && (
          <div className="mt-timer-bar">
            <div className={`mt-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
            <span className="mt-timer-bar__num">{timeLeft}s</span>
          </div>
        )}

        <div className={'mt-word-display' + (status === 'correct' ? ' is-correct' : status === 'wrong' ? ' is-wrong' : '')}>
          <div style={{ fontSize: '3rem' }}>{q.emoji}</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', marginTop: 8 }}>{q.object}</div>
        </div>

        <div className="mt-question">Combien mesure {q.object} ?</div>

        <div className="mt-choices">
          {displayOptions.map((opt, i) => {
            let cls = 'mt-choice';
            if (selectedInput !== null) {
              if (opt === q.correct) cls += ' is-correct';
              else if (opt === selectedInput) cls += ' is-wrong';
            }
            return (
              <button
                key={i}
                className={cls}
                type="button"
                onPointerDown={e => {
                  e.preventDefault();
                  if (status !== 'idle') return;
                  setSelectedInput(opt);
                  handleAnswer(opt, q.correct);
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {encourage !== '' && status === 'wrong' && (
          <div className="mt-encourage">{encourage}</div>
        )}
        {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale={locale} onNext={handleNext} />}
      </div>
    );
  }

  // ── JEU 7 — Detectif des Mesures ────────────────────────────────────────
  if (phase === 'detective') {
    const q = questions[qIdx];
    if (!q) return null;
    const progW = questions.length > 0 ? ((qIdx / questions.length) * 100) : 0;
    const displayOptions = difficulty === 'facile' ? q.options.slice(0, 3) : q.options;
    return (
      <div className="mt-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="mt-quiz-bar">
          <button className="mt-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setDifficulty(null); setPhase('hub'); }}>←</button>
          <span className="mt-quiz-bar__title">Detectif des Mesures</span>
          <span className="mt-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="mt-prog-bar"><div className="mt-prog-bar__fill" style={{ width: progW + '%' }} /></div>
        {megaReto && (
          <div className="mt-timer-bar">
            <div className={`mt-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
            <span className="mt-timer-bar__num">{timeLeft}s</span>
          </div>
        )}

        <div className={'mt-word-display' + (status === 'correct' ? ' is-correct' : status === 'wrong' ? ' is-wrong' : '')}>
          <div style={{ fontSize: '2.5rem' }}>{q.emoji}</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: 8, lineHeight: 1.5 }}>{q.text}</div>
        </div>

        <div className="mt-question">Quel type de grandeur est-ce ?</div>

        <div className="mt-choices mt-choices--col1">
          {displayOptions.map(opt => (
            <button
              type="button"
              key={opt}
              className={'mt-choice' + (status !== 'idle' ? (opt === q.answer ? ' is-correct' : selectedInput === opt ? ' is-wrong' : '') : '')}
              style={{ borderColor: status !== 'idle' && opt === q.answer ? CATEGORIES[opt]?.color : undefined }}
              onPointerDown={e => { e.preventDefault(); if (status === 'idle') { setSelectedInput(opt); handleAnswer(opt, q.answer); } }}
            >
              {CATEGORIES[opt]?.emoji} {CATEGORIES[opt]?.label}
            </button>
          ))}
        </div>

        {encourage !== '' && status === 'wrong' && (
          <div className="mt-encourage">{encourage}</div>
        )}
        {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale={locale} onNext={handleNext} />}
      </div>
    );
  }

  // ── JEU 8 — Missions du Quotidien ───────────────────────────────────────
  if (phase === 'missions') {
    const q = questions[qIdx];
    if (!q) return null;
    const progW = questions.length > 0 ? ((qIdx / questions.length) * 100) : 0;
    const useNumpad = typeof q.answer === 'number';
    const shuffledOptions = useNumpad ? [] : [...q.options].sort(() => Math.random() - .5);
    const displayOptions = (difficulty === 'facile' && !useNumpad) ? shuffledOptions.slice(0, 3) : shuffledOptions;
    return (
      <div className="mt-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="mt-quiz-bar">
          <button className="mt-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setDifficulty(null); setPhase('hub'); }}>←</button>
          <span className="mt-quiz-bar__title">Missions du Quotidien</span>
          <span className="mt-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="mt-prog-bar"><div className="mt-prog-bar__fill" style={{ width: progW + '%' }} /></div>
        {megaReto && (
          <div className="mt-timer-bar">
            <div className={`mt-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
            <span className="mt-timer-bar__num">{timeLeft}s</span>
          </div>
        )}

        <div className={'mt-word-display' + (status === 'correct' ? ' is-correct' : status === 'wrong' ? ' is-wrong' : '')}>
          <div style={{ fontSize: '2.5rem' }}>{q.emoji}</div>
          <div style={{ fontSize: '.95rem', fontWeight: 700, color: '#fff', marginTop: 8, lineHeight: 1.6 }}>{q.text}</div>
        </div>

        <div className="mt-question">{q.question}{q.unit ? ' (' + q.unit + ')' : ''}</div>

        {useNumpad ? (
          <>
            <div className={'mt-answer-input' + (typedAnswer ? ' has-input' : '') + (status === 'correct' ? ' is-correct' : status === 'wrong' ? ' is-wrong' : '')}>
              {typedAnswer ? typedAnswer + (q.unit ? ' ' + q.unit : '') : '?'}
            </div>
            <NumPad
              value={typedAnswer}
              onChange={setTypedAnswer}
              onSubmit={(v) => { setSelectedInput(v); handleAnswer(Number(v), q.answer); }}
            />
          </>
        ) : (
          <div className="mt-choices">
            {displayOptions.map((opt, i) => {
              let cls = 'mt-choice';
              if (selectedInput !== null) {
                if (String(opt) === String(q.answer)) cls += ' is-correct';
                else if (String(opt) === String(selectedInput)) cls += ' is-wrong';
              }
              return (
                <button
                  key={i}
                  className={cls}
                  type="button"
                  onPointerDown={e => {
                    e.preventDefault();
                    if (status !== 'idle') return;
                    setSelectedInput(opt);
                    handleAnswer(opt, q.answer);
                  }}
                >
                  {opt}{q.unit ? ' ' + q.unit : ''}
                </button>
              );
            })}
          </div>
        )}

        {encourage !== '' && status === 'wrong' && (
          <div className="mt-encourage">{encourage}</div>
        )}
        {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale={locale} onNext={handleNext} />}
      </div>
    );
  }

  // ── RESULTS ────────────────────────────────────────────────────────────
  if (phase === 'results') {
    const total = questions.length;
    const pctR = total > 0 ? Math.round((score / total) * 100) : 0;
    const stars = megaReto
      ? (pctR >= 95 ? 3 : pctR >= 80 ? 2 : pctR >= 60 ? 1 : 0)
      : (pctR >= 90 ? 3 : pctR >= 70 ? 2 : pctR >= 50 ? 1 : 0);
    const trophy = pctR >= 90 ? '🏆' : pctR >= 70 ? '🎉' : pctR >= 50 ? '👍' : '💪';
    const title = pctR >= 90 ? 'Bravo ! Tu es fantastique !' : pctR >= 70 ? 'Tres bien fait !' : pctR >= 50 ? 'Bon travail !' : 'Continue, tu progresses !';
    return (
      <div className="mt-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="mt-results">
          <div className="mt-results__trophy">{trophy}</div>
          <h2 className="mt-results__title">{title}</h2>
          <div className="mt-results__score">{score}/{total}</div>
          <div className="mt-results-stars">
            {[1, 2, 3].map(i => (
              <span key={i} className="mt-results-star" style={{ opacity: i <= stars ? undefined : '.2' }}>
                {i <= stars ? '⭐' : '☆'}
              </span>
            ))}
          </div>
          <FunContentCard />
          <div className="mt-results-btns">
            <button
              className="mt-results-btn mt-results-btn--primary"
              type="button"
              onPointerDown={e => { e.preventDefault(); startMode(currentMode, difficulty); }}
            >
              Rejouer
            </button>
            <button
              className="mt-results-btn mt-results-btn--secondary"
              type="button"
              onPointerDown={e => { e.preventDefault(); setDifficulty(null); setPhase('hub'); }}
            >
              Retour au menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
