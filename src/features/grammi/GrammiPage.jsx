import { useEffect, useRef, useState } from 'react';
import './grammi.css';
import {
  WORD_COLORS, ANNOTATED_SENTENCES, TEXTS, GN_TEMPLATES, PHRASE_TEMPLATES,
  GRAMMI_BADGES, ENCOURAGEMENTS_GRAMMI,
  genClassifyQuestion, genVerbQuestion, pickRandom,
} from './grammiEngine.js';
import { checkNewBadges, loadProgress, recordAnswer } from './grammiProgress.js';

// ── Theory data ────────────────────────────────────────────────────────
const THEORY_STEPS = [
  {
    num: 'Étape 1', color: '#3b82f6',
    title: 'Le Nom Commun 🏠',
    content: 'Un nom commun designe un objet, un animal, une emotion ou une personne. Il commence par une LETTRE MINUSCULE.',
    examples: ['table','chat','ecole','amour','enfant'],
    exColor: '#3b82f6',
  },
  {
    num: 'Étape 2', color: '#ef4444',
    title: 'Le Nom Propre 👑',
    content: 'Un nom propre designe une personne precise, une ville ou un pays. Il commence toujours par une MAJUSCULE !',
    examples: ['Lena','Bruxelles','Belgique','Paris'],
    exColor: '#ef4444',
  },
  {
    num: 'Étape 3', color: '#f97316',
    title: 'L\'Adjectif 🎨',
    content: 'L\'adjectif decrit ou qualifie un nom. Il dit COMMENT est la chose.',
    examples: ['rouge','grand','joyeux','rapide','doux'],
    exColor: '#f97316',
  },
  {
    num: 'Étape 4', color: '#22c55e',
    title: 'Le Verbe ⚡',
    content: 'Le verbe indique une ACTION ou un ETAT. Il change selon qui fait l\'action.',
    examples: ['courir','mange','dormons','est'],
    exColor: '#22c55e',
  },
  {
    num: 'Étape 5', color: '#a855f7',
    title: 'Le Determinant 📦',
    content: 'Le determinant se place DEVANT le nom. Il indique si le nom est masculin, feminin, singulier ou pluriel.',
    examples: ['le','la','un','des','mon','ta'],
    exColor: '#a855f7',
  },
  {
    num: 'Étape 6', color: '#10b981',
    title: 'Le Groupe Nominal',
    content: 'Le groupe nominal = DETERMINANT + NOM (+ adjectif). Exemple: "une belle pomme rouge"',
    examples: ['le chat','une pomme rouge','mon ami fidele'],
    exColor: '#10b981',
  },
  {
    num: 'Étape 7', color: '#06b6d4',
    title: 'Le Coloriage Magique 🎨',
    content: 'Dans les exercices, nous utilisons des couleurs pour chaque type de mot : 🔵 Bleu=nom commun, 🔴 Rouge=nom propre, 🟠 Orange=adjectif, 🟢 Vert=verbe',
    examples: [],
    exColor: '#06b6d4',
  },
];

// ── Color types for coloriage ──────────────────────────────────────────
const COLOR_TYPES = [
  { key: 'nom_commun', label: 'NC', emoji: '🏠', bg: '#3b82f6' },
  { key: 'nom_propre', label: 'NP', emoji: '👑', bg: '#ef4444' },
  { key: 'adjectif', label: 'ADJ', emoji: '🎨', bg: '#f97316' },
  { key: 'verbe', label: 'V', emoji: '⚡', bg: '#22c55e' },
];

// ── Helper: fire confetti ──────────────────────────────────────────────
function fireConfetti() {
  const ID = 'gm-confetti-kf';
  if (!document.getElementById(ID)) {
    const s = document.createElement('style');
    s.id = ID;
    s.textContent = '@keyframes gmFall{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}';
    document.head.appendChild(s);
  }
  const colors = ['#10b981','#34d399','#059669','#fbbf24','#ef4444','#3b82f6','#a855f7'];
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    const size = 5 + Math.random() * 9;
    el.style.cssText = 'position:absolute;top:0;left:' + (Math.random()*100) + '%;width:' + size + 'px;height:' + size + 'px;background:' + colors[Math.floor(Math.random()*colors.length)] + ';border-radius:' + (Math.random()>.5?'50%':'3px') + ';animation:gmFall ' + (2+Math.random()*1.4) + 's ' + (Math.random()*.9) + 's ease-in forwards;';
    wrap.appendChild(el);
  }
  document.body.appendChild(wrap);
  setTimeout(() => { wrap.parentNode && wrap.parentNode.removeChild(wrap); }, 5000);
}

// ── BadgePopup ─────────────────────────────────────────────────────────
function BadgePopup({ badge, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => { closeRef.current?.focus(); }, []);
  return (
    <div className="gm-overlay" role="dialog" aria-modal="true" aria-labelledby="badge-title">
      <div className="gm-badge-popup">
        <div className="gm-badge-popup__emoji">{badge.emoji}</div>
        <div className="gm-badge-popup__title" id="badge-title">{badge.label}</div>
        <div className="gm-badge-popup__sub">Nouveau badge débloqué !</div>
        <button
          ref={closeRef}
          className="gm-badge-popup__close"
          type="button"
          onPointerDown={e => { e.preventDefault(); onClose(); }}
        >
          Super !
        </button>
      </div>
    </div>
  );
}

// ── NumPad ─────────────────────────────────────────────────────────────
function NumPad({ value, onChange, onSubmit }) {
  const keys = ['1','2','3','4','5','6','7','8','9','del','0','ok'];
  return (
    <div className="gm-numpad">
      {keys.map(k => (
        <button
          type="button"
          key={k}
          className={'gm-key' + (k === 'del' ? ' gm-key--del' : '') + (k === 'ok' ? ' gm-key--ok' + (value === '' ? ' is-disabled' : '') : '')}
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

// ── GrammiPage ─────────────────────────────────────────────────────────
export default function GrammiPage() {
  // All hooks at top level
  const [phase, setPhase] = useState('hub');
  const [currentMode, setCurrentMode] = useState('');
  const [progress, setProgress] = useState(() => loadProgress());
  const [badge, setBadge] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('idle');
  const [encourage, setEncourage] = useState('');
  const [tries, setTries] = useState(0);
  const [selectedInput, setSelectedInput] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState('');
  // Coloriage-specific
  const [wordColors, setWordColors] = useState({});
  const [selectedColor, setSelectedColor] = useState('nom_commun');
  const [colorSentenceIdx, setColorSentenceIdx] = useState(0);
  const [colorValidated, setColorValidated] = useState(false);
  const [colorScore, setColorScore] = useState(0);
  // GN builder
  const [gnTapped, setGnTapped] = useState([]);
  const [gnStatus, setGnStatus] = useState('idle');
  // Mega Reto
  const [megaReto, setMegaReto] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef(null);

  function startMode(mode) {
    clearInterval(timerRef.current);
    setTimeLeft(15);
    setCurrentMode(mode);
    setPhase(mode);
    setQIdx(0);
    setScore(0);
    setStatus('idle');
    setTries(0);
    setEncourage('');
    setSelectedInput(null);
    setStepIdx(0);
    setWordColors({});
    setGnTapped([]);
    setGnStatus('idle');
    setColorValidated(false);
    setColorScore(0);
    setColorSentenceIdx(0);
    setTypedAnswer('');

    const qCount = megaReto ? 20 : 10;

    if (mode === 'chasse-noms') {
      setQuestions(Array.from({ length: qCount }, () => genClassifyQuestion('nom_commun')));
    } else if (mode === 'noms-propres') {
      setQuestions(Array.from({ length: qCount }, () => genClassifyQuestion('nom_propre')));
    } else if (mode === 'adjectifs') {
      setQuestions(Array.from({ length: qCount }, () => genClassifyQuestion('adjectif')));
    } else if (mode === 'robot-verbes') {
      setQuestions(Array.from({ length: qCount }, genVerbQuestion));
    } else if (mode === 'gn-builder') {
      setQuestions(GN_TEMPLATES.slice().sort(() => Math.random() - .5).slice(0, qCount));
    } else if (mode === 'coloriage') {
      setQuestions(ANNOTATED_SENTENCES.slice().sort(() => Math.random() - .5).slice(0, megaReto ? 10 : 5));
    } else if (mode === 'complete-phrase') {
      setQuestions(PHRASE_TEMPLATES.slice().sort(() => Math.random() - .5).slice(0, qCount));
    } else if (mode === 'lecture-detective' || mode === 'compte-phrases') {
      setQuestions([...TEXTS]);
    } else if (mode === 'enqueteur') {
      setQuestions([...TEXTS]);
    }
  }

  function handleAnswer(answer, correct) {
    const isCorrect = String(answer) === String(correct);
    const newProg = recordAnswer(isCorrect);
    setProgress(newProg);
    const newBadges = checkNewBadges(newProg, GRAMMI_BADGES);
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
      if (!megaReto) setEncourage(ENCOURAGEMENTS_GRAMMI[Math.floor(Math.random() * ENCOURAGEMENTS_GRAMMI.length)]);
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
      setGnTapped([]);
      setGnStatus('idle');
      setWordColors({});
      setColorValidated(false);
      setColorScore(0);
      setTypedAnswer('');
    }
  }

  const pct = progress.totalAttempts > 0
    ? Math.min(100, Math.round((progress.totalCorrect / progress.totalAttempts) * 100))
    : 0;

  const GM_QUIZ_PHASES = ['chasse-noms','noms-propres','adjectifs','robot-verbes','gn-builder','complete-phrase','lecture-detective','compte-phrases','enqueteur'];

  function handleTimeOut() {
    const newProg = recordAnswer(false);
    setProgress(newProg);
    setStatus('wrong');
    setEncourage('');
    setTimeout(() => {
      if (qIdx + 1 >= questions.length) {
        setPhase('results');
      } else {
        setQIdx(i => i + 1);
        setStatus('idle');
        setSelectedInput(null);
        setTries(0);
        setGnTapped([]);
        setGnStatus('idle');
        setWordColors({});
        setColorValidated(false);
        setColorScore(0);
        setTypedAnswer('');
      }
    }, 800);
  }

  useEffect(() => {
    if (!megaReto) return;
    if (!GM_QUIZ_PHASES.includes(phase)) return;
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

  // ── HUB ─────────────────────────────────────────────────────────────
  if (phase === 'hub') {
    const earnedBadges = GRAMMI_BADGES.filter(b => progress.badges.includes(b.id));

    const theoryCard = { mode: 'theory', emoji: '📖', name: 'Theorie Interactive', desc: 'Apprends les types de mots', color: '#10b981', badge: null };

    const gameCards = [
      { mode: 'chasse-noms', emoji: '🏠', name: 'Chasse aux Noms', desc: 'Trouve les noms communs', color: '#3b82f6', badge: 'Noms' },
      { mode: 'noms-propres', emoji: '👑', name: 'Mission Nom Propre', desc: 'Villes, pays, prenoms', color: '#ef4444', badge: 'Noms Propres' },
      { mode: 'adjectifs', emoji: '🎨', name: 'Attrape l\'Adjectif', desc: 'Capture les adjectifs', color: '#f97316', badge: 'Adjectifs' },
      { mode: 'robot-verbes', emoji: '⚡', name: 'Robot des Verbes', desc: 'Infinitif ou Conjugue ?', color: '#22c55e', badge: 'Verbes' },
      { mode: 'gn-builder', emoji: '📦', name: 'Construis ton GN', desc: 'Groupe nominal', color: '#a855f7', badge: 'GN' },
      { mode: 'coloriage', emoji: '🎨', name: 'Coloriage Magique', desc: 'Colorie chaque type de mot', color: '#06b6d4', badge: 'Coloriage' },
      { mode: 'complete-phrase', emoji: '📝', name: 'Complete la Phrase', desc: 'Trouve le bon mot', color: '#f59e0b', badge: 'Phrases' },
      { mode: 'lecture-detective', emoji: '🔍', name: 'Lecture Detective', desc: 'Analyse le texte', color: '#ec4899', badge: 'Lecture' },
      { mode: 'compte-phrases', emoji: '🔢', name: 'Compte les Phrases', desc: 'Compte et analyse', color: '#14b8a6', badge: 'Comptage' },
      { mode: 'enqueteur', emoji: '🕵️', name: 'Enqueteur de Texte', desc: 'Enquete complete', color: '#8b5cf6', badge: 'Enqueteur' },
    ];

    return (
      <div className="gm-page">
        <div className="gm-hero">
          <div className="gm-hero__mascot">📚</div>
          <div>
            <h1 className="gm-hero__title">GrammiLena</h1>
            <p className="gm-hero__sub">Le royaume magique des mots</p>
          </div>
        </div>

        <div className="gm-global-prog">
          <p className="gm-global-prog__label">Progression globale</p>
          <div className="gm-global-prog__bar">
            <div className="gm-global-prog__fill" style={{ width: pct + '%' }} />
          </div>
          <div className="gm-global-prog__stats">
            <span className="gm-global-prog__stat"><strong>{progress.totalCorrect}</strong> correct</span>
            <span className="gm-global-prog__stat"><strong>{progress.totalAttempts}</strong> tentatives</span>
            <span className="gm-global-prog__stat"><strong>{earnedBadges.length}</strong> badges</span>
          </div>
        </div>

        <div className="gm-body">
          <p className="gm-section-label">Theorie</p>
          <div className="gm-cat-grid">
            <button
              className="gm-cat-card"
              style={{ '--cat-color': theoryCard.color }}
              type="button"
              onPointerDown={e => { e.preventDefault(); startMode(theoryCard.mode); }}
            >
              <div className="gm-cat-card__stripe" />
              <div className="gm-cat-card__body">
                <span className="gm-cat-card__emoji">{theoryCard.emoji}</span>
                <span className="gm-cat-card__name">{theoryCard.name}</span>
                <span className="gm-cat-card__desc">{theoryCard.desc}</span>
              </div>
            </button>
          </div>

          <p className="gm-section-label">Les Jeux</p>
          <div className="gm-cat-grid">
            {gameCards.map(c => (
              <button
                key={c.mode}
                className="gm-cat-card"
                style={{ '--cat-color': c.color }}
                type="button"
                onPointerDown={e => { e.preventDefault(); startMode(c.mode); }}
              >
                <div className="gm-cat-card__stripe" />
                <div className="gm-cat-card__body">
                  <span className="gm-cat-card__emoji">{c.emoji}</span>
                  <span className="gm-cat-card__name">{c.name}</span>
                  <span className="gm-cat-card__desc">{c.desc}</span>
                  {c.badge && <span className="gm-cat-card__badge">{c.badge}</span>}
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`gm-mega-btn${megaReto ? ' is-active' : ''}`}
            onPointerDown={e => { e.preventDefault(); setMegaReto(m => !m); }}
          >
            {megaReto ? '🔥 Mega Reto ACTIF — Touche pour desactiver' : '🔥 Activer le Mega Reto'}
          </button>

          {GRAMMI_BADGES.length > 0 && (
            <>
              <p className="gm-section-label">Badges</p>
              <div className="gm-badges">
                {GRAMMI_BADGES.map(b => {
                  const earned = progress.badges.includes(b.id);
                  return (
                    <div key={b.id} className={'gm-badge-chip' + (earned ? ' is-earned' : ' is-locked')}>
                      <span className="gm-badge-chip__emoji">{b.emoji}</span>
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

  // ── THEORY ──────────────────────────────────────────────────────────
  if (phase === 'theory') {
    const step = THEORY_STEPS[stepIdx];
    const isLast = stepIdx >= THEORY_STEPS.length - 1;
    return (
      <div className="gm-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="gm-quiz-bar">
          <button className="gm-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>←</button>
          <span className="gm-quiz-bar__title">Theorie Interactive</span>
          <span className="gm-quiz-bar__counter">{stepIdx + 1}/{THEORY_STEPS.length}</span>
        </div>
        <div className="gm-theory">
          {THEORY_STEPS.map((s, i) => (
            <div
              key={i}
              className={'gm-step-card' + (i === stepIdx ? ' is-active' : '')}
              style={{ '--step-color': s.color }}
            >
              <p className="gm-step-card__num">{s.num}</p>
              <p className="gm-step-card__content" style={{ fontWeight: 700 }}><strong>{s.title}</strong></p>
              <p className="gm-step-card__content">{s.content}</p>
              {s.examples.length > 0 && (
                <div className="gm-step-card__examples">
                  {s.examples.map(ex => (
                    <span key={ex} className="gm-example-chip" style={{ background: s.exColor }}>{ex}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="gm-step-nav">
          {stepIdx > 0 && (
            <button className="gm-step-btn gm-step-btn--prev" type="button" onPointerDown={e => { e.preventDefault(); setStepIdx(i => i - 1); }}>
              ← Precedent
            </button>
          )}
          {!isLast ? (
            <button className="gm-step-btn gm-step-btn--next" type="button" onPointerDown={e => { e.preventDefault(); setStepIdx(i => i + 1); }}>
              Suivant →
            </button>
          ) : (
            <button className="gm-step-btn gm-step-btn--next" type="button" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>
              Terminer ✓
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── CLASSIFY GAMES (chasse-noms, noms-propres, adjectifs) ────────────
  if (phase === 'chasse-noms' || phase === 'noms-propres' || phase === 'adjectifs') {
    const q = questions[qIdx];
    if (!q) return null;
    const progW = questions.length > 0 ? ((qIdx / questions.length) * 100) : 0;

    const modeLabels = {
      'chasse-noms': 'Chasse aux Noms',
      'noms-propres': 'Mission Nom Propre',
      'adjectifs': 'Attrape l\'Adjectif',
    };
    const modeQuestions = {
      'chasse-noms': 'Tape le NOM COMMUN 🏠',
      'noms-propres': 'Tape le NOM PROPRE 👑',
      'adjectifs': 'Tape l\'ADJECTIF 🎨',
    };

    return (
      <div className="gm-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="gm-quiz-bar">
          <button className="gm-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>←</button>
          <span className="gm-quiz-bar__title">{modeLabels[phase]}</span>
          <span className="gm-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="gm-prog-bar"><div className="gm-prog-bar__fill" style={{ width: progW + '%' }} /></div>
        {megaReto && (
          <div className="gm-timer-bar">
            <div className={`gm-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
            <span className="gm-timer-bar__num">{timeLeft}s</span>
          </div>
        )}

        <div className={'gm-word-display' + (status === 'correct' ? ' is-correct' : status === 'wrong' ? ' is-wrong' : '')}>
          <div className="gm-word-display__word">{q.word}</div>
        </div>

        <div className="gm-question">{modeQuestions[phase]}</div>

        <div className="gm-choices">
          {q.options.map((opt, i) => {
            let cls = 'gm-choice';
            if (selectedInput !== null) {
              if (opt === q.word && status === 'correct') cls += ' is-correct';
              else if (opt === selectedInput && status === 'wrong') cls += ' is-wrong';
              else if (opt === q.word && status === 'wrong') cls += ' is-correct';
            }
            return (
              <button
                key={i}
                className={cls}
                type="button"
                onPointerDown={e => {
                  e.preventDefault();
                  if (status !== 'idle') return;
                  handleAnswer(opt, q.word);
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {encourage !== '' && status === 'wrong' && (
          <div className="gm-encourage">{encourage}</div>
        )}
      </div>
    );
  }

  // ── ROBOT DES VERBES ─────────────────────────────────────────────────
  if (phase === 'robot-verbes') {
    const q = questions[qIdx];
    if (!q) return null;
    const progW = questions.length > 0 ? ((qIdx / questions.length) * 100) : 0;

    return (
      <div className="gm-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="gm-quiz-bar">
          <button className="gm-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>←</button>
          <span className="gm-quiz-bar__title">Robot des Verbes</span>
          <span className="gm-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="gm-prog-bar"><div className="gm-prog-bar__fill" style={{ width: progW + '%' }} /></div>
        {megaReto && (
          <div className="gm-timer-bar">
            <div className={`gm-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
            <span className="gm-timer-bar__num">{timeLeft}s</span>
          </div>
        )}

        <div className={'gm-word-display' + (status === 'correct' ? ' is-correct' : status === 'wrong' ? ' is-wrong' : '')}>
          <div className="gm-word-display__word">{q.word}</div>
          {q.hint && <div className="gm-word-display__hint">Pronom : {q.hint}</div>}
        </div>

        <div className="gm-question">Ce verbe est... Infinitif ou Conjugue ?</div>

        <div className="gm-choices gm-choices--col1">
          {q.options.map((opt, i) => {
            let cls = 'gm-choice';
            if (selectedInput !== null) {
              if (opt === q.correctLabel) cls += ' is-correct';
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
                  handleAnswer(opt, q.correctLabel);
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {encourage !== '' && status === 'wrong' && (
          <div className="gm-encourage">{encourage}</div>
        )}
      </div>
    );
  }

  // ── GN BUILDER ──────────────────────────────────────────────────────
  if (phase === 'gn-builder') {
    const tmpl = questions[qIdx];
    if (!tmpl) return null;
    const progW = questions.length > 0 ? ((qIdx / questions.length) * 100) : 0;

    // The correct order for GN: det, adj (if before noun), noun, adj (if after noun)
    // Simplified: always det first, then noun, then adj
    const correctOrder = [tmpl.det, tmpl.noun, tmpl.adj];
    // Shuffle parts for display
    const shuffledParts = [
      { word: tmpl.det, type: 'determinant', color: WORD_COLORS.determinant.bg },
      { word: tmpl.noun, type: 'nom_commun', color: WORD_COLORS.nom_commun.bg },
      { word: tmpl.adj, type: 'adjectif', color: WORD_COLORS.adjectif.bg },
    ].sort(() => Math.random() - .5);

    // Store shuffled once per question using a simple seed approach — just display in fixed shuffle
    // We'll derive display order from tmpl key
    const displayParts = [
      { word: tmpl.det, type: 'determinant', color: WORD_COLORS.determinant.bg },
      { word: tmpl.noun, type: 'nom_commun', color: WORD_COLORS.nom_commun.bg },
      { word: tmpl.adj, type: 'adjectif', color: WORD_COLORS.adjectif.bg },
    ];

    // Determine if a part is already tapped
    const tappedWords = gnTapped;
    const available = displayParts.filter(p => !tappedWords.includes(p.word));

    function handleGnTap(word) {
      if (gnStatus !== 'idle') return;
      const newTapped = [...tappedWords, word];
      setGnTapped(newTapped);

      if (newTapped.length === 3) {
        // Check order
        const isCorrect = newTapped[0] === correctOrder[0] &&
          newTapped[1] === correctOrder[1] &&
          newTapped[2] === correctOrder[2];

        if (isCorrect) {
          setGnStatus('correct');
          const newProg = recordAnswer(true);
          setProgress(newProg);
          const newBadges = checkNewBadges(newProg, GRAMMI_BADGES);
          if (newBadges.length > 0) setBadge(newBadges[0]);
          setScore(s => s + 1);
          setTimeout(() => {
            advance();
          }, 900);
        } else {
          setGnStatus('wrong');
          const newProg = recordAnswer(false);
          setProgress(newProg);
          setEncourage(ENCOURAGEMENTS_GRAMMI[Math.floor(Math.random() * ENCOURAGEMENTS_GRAMMI.length)]);
          setTimeout(() => {
            setGnTapped([]);
            setGnStatus('idle');
            setEncourage('');
          }, 1200);
        }
      }
    }

    return (
      <div className="gm-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="gm-quiz-bar">
          <button className="gm-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>←</button>
          <span className="gm-quiz-bar__title">Construis ton GN</span>
          <span className="gm-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="gm-prog-bar"><div className="gm-prog-bar__fill" style={{ width: progW + '%' }} /></div>
        {megaReto && (
          <div className="gm-timer-bar">
            <div className={`gm-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
            <span className="gm-timer-bar__num">{timeLeft}s</span>
          </div>
        )}

        <div className="gm-question">Tape les mots dans le bon ordre : DET + NOM + ADJ</div>

        <div className={'gm-gn-result' + (gnStatus === 'correct' ? ' is-correct' : gnStatus === 'wrong' ? ' is-wrong' : '')}
          style={gnStatus === 'correct' ? { borderColor: '#22c55e', background: 'rgba(34,197,94,.12)' } : gnStatus === 'wrong' ? { borderColor: '#f97316', background: 'rgba(249,115,22,.1)' } : {}}>
          {tappedWords.length === 0 ? (
            <span className="gm-gn-result__empty">Tape les mots ici...</span>
          ) : (
            tappedWords.map((w, i) => {
              const part = displayParts.find(p => p.word === w);
              return (
                <span key={i} className="gm-gn-part" style={{ background: part ? part.color : '#6b7280' }}>
                  {w}
                </span>
              );
            })
          )}
        </div>

        <div className="gm-gn-parts">
          {displayParts.map((p, i) => {
            const tapped = tappedWords.includes(p.word);
            return (
              <button
                key={i}
                className="gm-gn-part"
                type="button"
                style={{ background: tapped ? 'rgba(255,255,255,.1)' : p.color, opacity: tapped ? .3 : 1 }}
                onPointerDown={e => { e.preventDefault(); if (!tapped) handleGnTap(p.word); }}
              >
                {p.word}
              </button>
            );
          })}
        </div>

        {encourage !== '' && (
          <div className="gm-encourage">{encourage}</div>
        )}
      </div>
    );
  }

  // ── COLORIAGE MAGIQUE ────────────────────────────────────────────────
  if (phase === 'coloriage') {
    const sentence = questions[qIdx];
    if (!sentence) return null;
    const progW = questions.length > 0 ? ((qIdx / questions.length) * 100) : 0;

    function handleWordTap(idx, token) {
      if (token.type === 'autre' || colorValidated) return;
      setWordColors(prev => ({ ...prev, [idx]: selectedColor }));
    }

    function handleValidate() {
      const nonPunct = sentence.filter(t => t.type !== 'autre');
      let correct = 0;
      nonPunct.forEach((t, rawIdx) => {
        const globalIdx = sentence.indexOf(t);
        if (wordColors[globalIdx] === t.type) correct++;
      });
      const newProg = recordAnswer(correct >= Math.ceil(nonPunct.length * 0.7));
      setProgress(newProg);
      const newBadges = checkNewBadges(newProg, GRAMMI_BADGES);
      if (newBadges.length > 0) setBadge(newBadges[0]);
      if (correct >= Math.ceil(nonPunct.length * 0.7)) setScore(s => s + 1);
      setColorValidated(true);
      setColorScore(correct);
      setTimeout(() => advance(), 2000);
    }

    return (
      <div className="gm-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="gm-quiz-bar">
          <button className="gm-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>←</button>
          <span className="gm-quiz-bar__title">Coloriage Magique</span>
          <span className="gm-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="gm-prog-bar"><div className="gm-prog-bar__fill" style={{ width: progW + '%' }} /></div>

        <div className="gm-question">Choisis une couleur puis tape les mots !</div>

        <div className="gm-color-bar">
          {COLOR_TYPES.map(ct => (
            <button
              key={ct.key}
              className={'gm-color-btn' + (selectedColor === ct.key ? ' is-selected' : '')}
              type="button"
              style={{ background: ct.bg }}
              onPointerDown={e => { e.preventDefault(); setSelectedColor(ct.key); }}
            >
              <span>{ct.emoji}</span>
              <span>{ct.label}</span>
            </button>
          ))}
        </div>

        <div className="gm-sentence-wrap">
          {sentence.map((token, idx) => {
            const isPunct = token.type === 'autre';
            const colored = wordColors[idx];
            const bg = colored ? WORD_COLORS[colored].bg : undefined;
            const showResult = colorValidated && !isPunct;
            const isCorrect = showResult && wordColors[idx] === token.type;
            const isWrong = showResult && wordColors[idx] && wordColors[idx] !== token.type;
            return (
              <button
                key={idx}
                className={'gm-word-chip' + (isPunct ? ' is-punct' : '') + (colored ? ' is-colored' : '')}
                type="button"
                style={bg ? { background: bg, borderColor: isWrong ? '#f97316' : isCorrect ? '#22c55e' : 'rgba(255,255,255,.3)' } : {}}
                onPointerDown={e => { e.preventDefault(); handleWordTap(idx, token); }}
              >
                {token.w}
              </button>
            );
          })}
        </div>

        {!colorValidated && (
          <div style={{ padding: '0 14px 8px', flexShrink: 0 }}>
            <button
              className="gm-step-btn gm-step-btn--next"
              type="button"
              style={{ width: '100%', border: 'none' }}
              onPointerDown={e => { e.preventDefault(); handleValidate(); }}
            >
              Valider ✓
            </button>
          </div>
        )}

        {colorValidated && (
          <div className="gm-encourage">
            {colorScore} mot{colorScore > 1 ? 's' : ''} bien colorie{colorScore > 1 ? 's' : ''} ! 🎨
          </div>
        )}
      </div>
    );
  }

  // ── COMPLETE LA PHRASE ───────────────────────────────────────────────
  if (phase === 'complete-phrase') {
    const q = questions[qIdx];
    if (!q) return null;
    const progW = questions.length > 0 ? ((qIdx / questions.length) * 100) : 0;
    const allOptions = [q.answer, ...q.distractors].sort(() => Math.random() - .5);
    const parts = q.template.split('___');

    return (
      <div className="gm-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="gm-quiz-bar">
          <button className="gm-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>←</button>
          <span className="gm-quiz-bar__title">Complete la Phrase</span>
          <span className="gm-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="gm-prog-bar"><div className="gm-prog-bar__fill" style={{ width: progW + '%' }} /></div>
        {megaReto && (
          <div className="gm-timer-bar">
            <div className={`gm-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
            <span className="gm-timer-bar__num">{timeLeft}s</span>
          </div>
        )}

        <div className="gm-question" style={{ marginBottom: 6 }}>{q.question}</div>

        <div className="gm-phrase-display">
          {parts[0]}
          <span className="gm-phrase-blank">
            {selectedInput !== null ? selectedInput : '___'}
          </span>
          {parts[1]}
        </div>

        <div className="gm-choices">
          {allOptions.map((opt, i) => {
            let cls = 'gm-choice';
            const typeColor = WORD_COLORS[q.blank_type] ? WORD_COLORS[q.blank_type].bg : undefined;
            let extraStyle = typeColor ? { borderColor: typeColor + '66' } : {};
            if (selectedInput !== null) {
              if (opt === q.answer) { cls += ' is-correct'; extraStyle = {}; }
              else if (opt === selectedInput) { cls += ' is-wrong'; extraStyle = {}; }
            }
            return (
              <button
                key={i}
                className={cls}
                type="button"
                style={extraStyle}
                onPointerDown={e => {
                  e.preventDefault();
                  if (status !== 'idle') return;
                  handleAnswer(opt, q.answer);
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {encourage !== '' && status === 'wrong' && (
          <div className="gm-encourage">{encourage}</div>
        )}
      </div>
    );
  }

  // ── LECTURE DETECTIVE ────────────────────────────────────────────────
  if (phase === 'lecture-detective') {
    const text = questions[qIdx];
    if (!text) return null;
    const progW = questions.length > 0 ? ((qIdx / questions.length) * 100) : 0;
    const correctCount = Array.isArray(text.noms_propres) ? text.noms_propres.length : text.noms_propres;

    return (
      <div className="gm-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="gm-quiz-bar">
          <button className="gm-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>←</button>
          <span className="gm-quiz-bar__title">Lecture Detective</span>
          <span className="gm-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="gm-prog-bar"><div className="gm-prog-bar__fill" style={{ width: progW + '%' }} /></div>
        {megaReto && (
          <div className="gm-timer-bar">
            <div className={`gm-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
            <span className="gm-timer-bar__num">{timeLeft}s</span>
          </div>
        )}

        <div className="gm-text-card">
          <div className="gm-text-card__title">{text.title}</div>
          <div className="gm-text-card__scroll">{text.text}</div>
        </div>

        <div className="gm-question">Combien y a-t-il de noms propres 👑 dans ce texte ?</div>

        {encourage !== '' && status === 'wrong' && (
          <div className="gm-encourage">{encourage}</div>
        )}
        <div className={'gm-answer-input' + (typedAnswer ? ' has-input' : '') + (status === 'correct' ? ' is-correct' : status === 'wrong' ? ' is-wrong' : '')}>
          {typedAnswer || '?'}
        </div>
        <NumPad
          value={typedAnswer}
          onChange={setTypedAnswer}
          onSubmit={() => { setSelectedInput(Number(typedAnswer)); handleAnswer(Number(typedAnswer), correctCount); }}
        />
      </div>
    );
  }

  // ── COMPTE LES PHRASES ───────────────────────────────────────────────
  if (phase === 'compte-phrases') {
    const text = questions[qIdx];
    if (!text) return null;
    const progW = questions.length > 0 ? ((qIdx / questions.length) * 100) : 0;
    const n = text.sentences;

    return (
      <div className="gm-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="gm-quiz-bar">
          <button className="gm-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>←</button>
          <span className="gm-quiz-bar__title">Compte les Phrases</span>
          <span className="gm-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="gm-prog-bar"><div className="gm-prog-bar__fill" style={{ width: progW + '%' }} /></div>
        {megaReto && (
          <div className="gm-timer-bar">
            <div className={`gm-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
            <span className="gm-timer-bar__num">{timeLeft}s</span>
          </div>
        )}

        <div className="gm-text-card">
          <div className="gm-text-card__title">{text.title}</div>
          <div className="gm-text-card__scroll">{text.text}</div>
        </div>

        <div className="gm-question">Combien de phrases y a-t-il dans ce texte ?</div>

        {encourage !== '' && status === 'wrong' && (
          <div className="gm-encourage">{encourage}</div>
        )}
        <div className={'gm-answer-input' + (typedAnswer ? ' has-input' : '') + (status === 'correct' ? ' is-correct' : status === 'wrong' ? ' is-wrong' : '')}>
          {typedAnswer || '?'}
        </div>
        <NumPad
          value={typedAnswer}
          onChange={setTypedAnswer}
          onSubmit={() => { setSelectedInput(Number(typedAnswer)); handleAnswer(Number(typedAnswer), n); }}
        />
      </div>
    );
  }

  // ── ENQUETEUR DE TEXTE ───────────────────────────────────────────────
  if (phase === 'enqueteur') {
    // 2 questions per text: one nom_commun, one adjectif
    // Build flat question list: for each text, ask about a nom_commun and an adjectif
    const enqueteurQuestions = questions.flatMap(text => {
      const noms = text.noms_communs;
      const adjs = text.adjectifs;
      const verbs = text.verbes;
      const nomCorr = Array.isArray(noms) ? noms[0] : noms;
      const adjCorr = Array.isArray(adjs) ? adjs[0] : adjs;
      const verbCorr = Array.isArray(verbs) ? verbs[0] : verbs;
      return [
        {
          text, question: 'Quel mot est un NOM COMMUN 🏠 ?',
          answer: nomCorr,
          options: [nomCorr, Array.isArray(adjs) ? adjs[1] || adjs[0] : adjs, Array.isArray(verbs) ? verbs[0] : verbs, 'Paris'].sort(() => Math.random() - .5),
        },
        {
          text, question: 'Quel mot est un ADJECTIF 🎨 ?',
          answer: adjCorr,
          options: [adjCorr, Array.isArray(noms) ? noms[1] || noms[0] : noms, Array.isArray(verbs) ? verbs[1] || verbs[0] : verbs, 'Lena'].sort(() => Math.random() - .5),
        },
      ];
    });

    const eq = enqueteurQuestions[qIdx];
    if (!eq) return null;
    const progW = enqueteurQuestions.length > 0 ? ((qIdx / enqueteurQuestions.length) * 100) : 0;

    return (
      <div className="gm-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="gm-quiz-bar">
          <button className="gm-back" type="button" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>←</button>
          <span className="gm-quiz-bar__title">Enqueteur de Texte</span>
          <span className="gm-quiz-bar__counter">{qIdx + 1}/{enqueteurQuestions.length}</span>
        </div>
        <div className="gm-prog-bar"><div className="gm-prog-bar__fill" style={{ width: progW + '%' }} /></div>
        {megaReto && (
          <div className="gm-timer-bar">
            <div className={`gm-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
            <span className="gm-timer-bar__num">{timeLeft}s</span>
          </div>
        )}

        <div className="gm-text-card">
          <div className="gm-text-card__title">{eq.text.title}</div>
          <div className="gm-text-card__scroll">{eq.text.text}</div>
        </div>

        <div className="gm-question">{eq.question}</div>

        <div className="gm-choices">
          {eq.options.map((opt, i) => {
            let cls = 'gm-choice';
            if (selectedInput !== null) {
              if (opt === eq.answer) cls += ' is-correct';
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
                  // advance uses qIdx + 1 >= questions.length but we have enqueteurQuestions
                  const isCorrect = String(opt) === String(eq.answer);
                  const newProg = recordAnswer(isCorrect);
                  setProgress(newProg);
                  const newBadges = checkNewBadges(newProg, GRAMMI_BADGES);
                  if (newBadges.length > 0) setBadge(newBadges[0]);
                  setSelectedInput(opt);
                  setStatus(isCorrect ? 'correct' : 'wrong');
                  if (isCorrect) {
                    setScore(s => s + 1);
                    setTries(0);
                    setTimeout(() => {
                      if (qIdx + 1 >= enqueteurQuestions.length) {
                        setPhase('results');
                      } else {
                        setQIdx(idx => idx + 1);
                        setStatus('idle');
                        setSelectedInput(null);
                        setEncourage('');
                        setTries(0);
                      }
                    }, 700);
                  } else {
                    const t = tries + 1;
                    setTries(t);
                    setEncourage(ENCOURAGEMENTS_GRAMMI[Math.floor(Math.random() * ENCOURAGEMENTS_GRAMMI.length)]);
                    if (t >= 2) {
                      setTimeout(() => {
                        if (qIdx + 1 >= enqueteurQuestions.length) {
                          setPhase('results');
                        } else {
                          setQIdx(idx => idx + 1);
                          setStatus('idle');
                          setSelectedInput(null);
                          setEncourage('');
                          setTries(0);
                        }
                      }, 1800);
                    } else {
                      setTimeout(() => { setStatus('idle'); setSelectedInput(null); }, 1200);
                    }
                  }
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {encourage !== '' && status === 'wrong' && (
          <div className="gm-encourage">{encourage}</div>
        )}
      </div>
    );
  }

  // ── RESULTS ──────────────────────────────────────────────────────────
  if (phase === 'results') {
    const total = questions.length;
    const pctR = total > 0 ? Math.round((score / total) * 100) : 0;
    const stars = megaReto
      ? (pctR >= 95 ? 3 : pctR >= 80 ? 2 : pctR >= 60 ? 1 : 0)
      : (pctR >= 90 ? 3 : pctR >= 70 ? 2 : pctR >= 50 ? 1 : 0);
    const trophy = pctR >= 90 ? '🏆' : pctR >= 70 ? '🎉' : pctR >= 50 ? '👍' : '💪';
    const title = pctR >= 90 ? 'Bravo ! Tu es fantastique !' : pctR >= 70 ? 'Tres bien fait !' : pctR >= 50 ? 'Bon travail !' : 'Continue, tu progresses !';

    return (
      <div className="gm-quiz-page">
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
        <div className="gm-results">
          <div className="gm-results__trophy">{trophy}</div>
          <h2 className="gm-results__title">{title}</h2>
          <div className="gm-results__score">{score}/{total}</div>
          <div className="gm-results-stars">
            {[1, 2, 3].map(i => (
              <span key={i} className="gm-results-star" style={{ opacity: i <= stars ? undefined : '.2' }}>
                {i <= stars ? '⭐' : '☆'}
              </span>
            ))}
          </div>
          <div className="gm-results-btns">
            <button
              className="gm-results-btn gm-results-btn--primary"
              type="button"
              onPointerDown={e => { e.preventDefault(); startMode(currentMode); }}
            >
              Rejouer
            </button>
            <button
              className="gm-results-btn gm-results-btn--secondary"
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
