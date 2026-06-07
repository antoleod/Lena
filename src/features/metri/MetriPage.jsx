import { useEffect, useRef, useState } from 'react';
import './metri.css';
import {
  CATEGORIES, QUANTITY_EXAMPLES, UNIT_SENTENCES, ESTIMATIONS,
  DETECTIVE_SITUATIONS, MISSIONS, METRI_BADGES, ENCOURAGEMENTS_METRI,
  genUnitHunt, genMarketQuestion,
} from './metriEngine.js';
import { checkNewBadges, loadProgress, recordAnswer } from './metriProgress.js';

// ── Theory data ─────────────────────────────────────────────────────────
const THEORY_STEPS = [
  {
    num: 'Étape 1', color: '#3b82f6',
    title: 'Les Longueurs 📏',
    content: 'On mesure les longueurs en mm, cm, m ou km. Plus la distance est grande, plus l\'unite est grande !',
    examples: ['mm', 'cm', 'm', 'km'],
    exColor: '#3b82f6',
  },
  {
    num: 'Étape 2', color: '#8b5cf6',
    title: 'Les Masses ⚖️',
    content: 'On pese les objets en grammes (g) ou kilogrammes (kg). 1 kg = 1000 g',
    examples: ['g', 'kg'],
    exColor: '#8b5cf6',
  },
  {
    num: 'Étape 3', color: '#06b6d4',
    title: 'Les Capacites 💧',
    content: 'On mesure les liquides en ml, cl, dl ou l. 1 l = 10 dl = 100 cl = 1000 ml',
    examples: ['ml', 'cl', 'dl', 'l'],
    exColor: '#06b6d4',
  },
  {
    num: 'Étape 4', color: '#22c55e',
    title: 'Les Durees ⏱️',
    content: 'Le temps se mesure en secondes (s), minutes (min) ou heures (h). 1 h = 60 min = 3600 s',
    examples: ['s', 'min', 'h'],
    exColor: '#22c55e',
  },
  {
    num: 'Étape 5', color: '#f59e0b',
    title: 'Les Couts 💶',
    content: 'L\'argent se compte en centimes (c) et euros (€). 1 € = 100 c',
    examples: ['c', '€'],
    exColor: '#f59e0b',
  },
  {
    num: 'Étape 6', color: '#ec4899',
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
        <div className="mt-badge-popup__sub">Nouveau badge débloqué !</div>
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

// ── NumPad ───────────────────────────────────────────────────────────────
function NumPad({ value, onChange, onSubmit }) {
  const keys = ['1','2','3','4','5','6','7','8','9','del','0','ok'];
  return (
    <div className="mt-numpad">
      {keys.map(k => (
        <button
          type="button"
          key={k}
          className={'mt-key' + (k === 'del' ? ' mt-key--del' : '') + (k === 'ok' ? ' mt-key--ok' + (value === '' ? ' is-disabled' : '') : '')}
          onPointerDown={e => {
            e.preventDefault();
            if (k === 'del') { onChange(value.slice(0, -1)); return; }
            if (k === 'ok') { if (value !== '') onSubmit(); return; }
            if (value.length < 6) onChange(value + k);
          }}
        >
          {k === 'del' ? '⌫' : k === 'ok' ? '✓' : k}
        </button>
      ))}
    </div>
  );
}

// ── MetriPage ───────────────────────────────────────────────────────────
export default function MetriPage() {
  // All hooks at top level
  const [phase, setPhase] = useState('hub');
  const [currentMode, setCurrentMode] = useState('');
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

  const pct = progress.totalAttempts > 0
    ? Math.min(100, Math.round((progress.totalCorrect / progress.totalAttempts) * 100))
    : 0;

  function startMode(mode) {
    setCurrentMode(mode);
    setPhase(mode);
    setQIdx(0); setScore(0); setStatus('idle'); setTries(0);
    setEncourage(''); setSelectedInput(null); setStepIdx(0); setTypedAnswer('');
    const cats = Object.keys(CATEGORIES);
    if (mode === 'unit-hunt') {
      setQuestions(Array.from({ length: 10 }, (_, i) => genUnitHunt(cats[i % cats.length])));
    } else if (mode === 'what-for' || mode === 'match-grandeur') {
      const shuffled = [...QUANTITY_EXAMPLES].sort(() => Math.random() - .5);
      setQuestions(shuffled.slice(0, 10).map(q => {
        const otherCats = cats.filter(c => c !== q.cat);
        const opts = [q.cat, ...otherCats.slice(0, 3)].sort(() => Math.random() - .5);
        return { ...q, options: opts };
      }));
    } else if (mode === 'choose-unit') {
      setQuestions([...UNIT_SENTENCES].sort(() => Math.random() - .5).slice(0, 10));
    } else if (mode === 'market') {
      setQuestions(Array.from({ length: 8 }, genMarketQuestion));
    } else if (mode === 'estimation') {
      setQuestions([...ESTIMATIONS].sort(() => Math.random() - .5).slice(0, 10));
    } else if (mode === 'detective') {
      setQuestions([...DETECTIVE_SITUATIONS].sort(() => Math.random() - .5).slice(0, 10));
    } else if (mode === 'missions') {
      setQuestions([...MISSIONS].sort(() => Math.random() - .5).slice(0, 8));
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
      setTimeout(() => advance(), 700);
    } else {
      const t = tries + 1;
      setTries(t);
      setEncourage(ENCOURAGEMENTS_METRI[Math.floor(Math.random() * ENCOURAGEMENTS_METRI.length)]);
      if (t >= 2) {
        setTimeout(() => advance(), 1800);
      } else {
        setTimeout(() => { setStatus('idle'); setSelectedInput(null); }, 1200);
      }
    }
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
              onPointerDown={e => { e.preventDefault(); startMode(theoryCard.mode); }}
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
                onPointerDown={e => { e.preventDefault(); startMode(c.mode); }}
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

  // ── THEORY ─────────────────────────────────────────────────────────────
  if (phase === 'theory') {
    const step = THEORY_STEPS[stepIdx];
    const isLast = stepIdx >= THEORY_STEPS.length - 1;
    return (
      <div className="mt-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="mt-quiz-bar">
          <button className="mt-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>←</button>
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
            <button className="mt-step-btn mt-step-btn--next" type="button" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>
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
          <button className="mt-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>←</button>
          <span className="mt-quiz-bar__title">Chasse aux Unites</span>
          <span className="mt-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="mt-prog-bar"><div className="mt-prog-bar__fill" style={{ width: progW + '%' }} /></div>

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
          <button className="mt-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>←</button>
          <span className="mt-quiz-bar__title">A quoi ca sert ?</span>
          <span className="mt-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="mt-prog-bar"><div className="mt-prog-bar__fill" style={{ width: progW + '%' }} /></div>

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
          <button className="mt-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>←</button>
          <span className="mt-quiz-bar__title">Relie les Grandeurs</span>
          <span className="mt-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="mt-prog-bar"><div className="mt-prog-bar__fill" style={{ width: progW + '%' }} /></div>

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
      </div>
    );
  }

  // ── JEU 4 — Choisis la Bonne Unite ──────────────────────────────────────
  if (phase === 'choose-unit') {
    const q = questions[qIdx];
    if (!q) return null;
    const progW = questions.length > 0 ? ((qIdx / questions.length) * 100) : 0;
    const allOptions = [q.correct, ...q.distractors].sort(() => Math.random() - .5);
    const parts = q.template.split('___');
    return (
      <div className="mt-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="mt-quiz-bar">
          <button className="mt-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>←</button>
          <span className="mt-quiz-bar__title">Choisis la Bonne Unite</span>
          <span className="mt-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="mt-prog-bar"><div className="mt-prog-bar__fill" style={{ width: progW + '%' }} /></div>

        <div className={'mt-phrase-display' + (status === 'correct' ? ' is-correct' : status === 'wrong' ? ' is-wrong' : '')}>
          {parts[0]}
          <span className="mt-phrase-blank">
            {selectedInput !== null ? selectedInput : '___'}
          </span>
          {parts[1]}
        </div>

        <div className="mt-question">Quelle unite complète la phrase ? ({q.hint})</div>

        <div className="mt-choices">
          {allOptions.map((opt, i) => {
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
          <button className="mt-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>←</button>
          <span className="mt-quiz-bar__title">Le Marche Magique</span>
          <span className="mt-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="mt-prog-bar"><div className="mt-prog-bar__fill" style={{ width: progW + '%' }} /></div>

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
      </div>
    );
  }

  // ── JEU 6 — Estimation Intelligente ─────────────────────────────────────
  if (phase === 'estimation') {
    const q = questions[qIdx];
    if (!q) return null;
    const progW = questions.length > 0 ? ((qIdx / questions.length) * 100) : 0;
    return (
      <div className="mt-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="mt-quiz-bar">
          <button className="mt-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>←</button>
          <span className="mt-quiz-bar__title">Estimation Intelligente</span>
          <span className="mt-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="mt-prog-bar"><div className="mt-prog-bar__fill" style={{ width: progW + '%' }} /></div>

        <div className={'mt-word-display' + (status === 'correct' ? ' is-correct' : status === 'wrong' ? ' is-wrong' : '')}>
          <div style={{ fontSize: '3rem' }}>{q.emoji}</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', marginTop: 8 }}>{q.object}</div>
        </div>

        <div className="mt-question">Combien mesure {q.object} ?</div>

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
      </div>
    );
  }

  // ── JEU 7 — Detectif des Mesures ────────────────────────────────────────
  if (phase === 'detective') {
    const q = questions[qIdx];
    if (!q) return null;
    const progW = questions.length > 0 ? ((qIdx / questions.length) * 100) : 0;
    return (
      <div className="mt-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="mt-quiz-bar">
          <button className="mt-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>←</button>
          <span className="mt-quiz-bar__title">Detectif des Mesures</span>
          <span className="mt-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="mt-prog-bar"><div className="mt-prog-bar__fill" style={{ width: progW + '%' }} /></div>

        <div className={'mt-word-display' + (status === 'correct' ? ' is-correct' : status === 'wrong' ? ' is-wrong' : '')}>
          <div style={{ fontSize: '2.5rem' }}>{q.emoji}</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: 8, lineHeight: 1.5 }}>{q.text}</div>
        </div>

        <div className="mt-question">Quel type de grandeur est-ce ?</div>

        <div className="mt-choices mt-choices--col1">
          {q.options.map(opt => (
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
    return (
      <div className="mt-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="mt-quiz-bar">
          <button className="mt-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>←</button>
          <span className="mt-quiz-bar__title">Missions du Quotidien</span>
          <span className="mt-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="mt-prog-bar"><div className="mt-prog-bar__fill" style={{ width: progW + '%' }} /></div>

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
              onSubmit={() => { setSelectedInput(typedAnswer); handleAnswer(Number(typedAnswer), q.answer); }}
            />
          </>
        ) : (
          <div className="mt-choices">
            {shuffledOptions.map((opt, i) => {
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
      </div>
    );
  }

  // ── RESULTS ────────────────────────────────────────────────────────────
  if (phase === 'results') {
    const total = questions.length;
    const pctR = total > 0 ? Math.round((score / total) * 100) : 0;
    const stars = pctR >= 90 ? 3 : pctR >= 70 ? 2 : pctR >= 50 ? 1 : 0;
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
          <div className="mt-results-btns">
            <button
              className="mt-results-btn mt-results-btn--primary"
              type="button"
              onPointerDown={e => { e.preventDefault(); startMode(currentMode); }}
            >
              Rejouer
            </button>
            <button
              className="mt-results-btn mt-results-btn--secondary"
              type="button"
              onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}
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
