import { useCallback, useEffect, useRef, useState } from 'react';
import FeedbackCard from '../../shared/ui/FeedbackCard.jsx';
import FunContentCard from '../../shared/ui/FunContentCard.jsx';
import NumPad from '../../shared/ui/NumPad.jsx';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import {
  genClockExercise, genChoices, formatDigital,
  genDurationProblem, DAILY_EVENTS, DETECTIVE_TEMPLATES, CHRONO_BADGES, ENCOURAGEMENTS,
} from './chronoEngine.js';
import { loadProgress, recordAnswer, checkNewBadges, saveWatchDesign } from './chronoProgress.js';
import './chrono.css';

// ── AnalogClock ───────────────────────────────────────────────────────────────
function AnalogClock({ hours, minutes, size = 240 }) {
  const cx = 50, cy = 50;
  const hourAngle = ((hours % 12) + minutes / 60) * 30 - 90;
  const minAngle = minutes * 6 - 90;
  const hourX2 = cx + 28 * Math.cos(hourAngle * Math.PI / 180);
  const hourY2 = cy + 28 * Math.sin(hourAngle * Math.PI / 180);
  const minX2  = cx + 38 * Math.cos(minAngle  * Math.PI / 180);
  const minY2  = cy + 38 * Math.sin(minAngle  * Math.PI / 180);

  const nums = Array.from({ length: 12 }, (_, i) => {
    const n = i + 1;
    const a = (n * 30 - 90) * Math.PI / 180;
    return { n, x: cx + 38 * Math.cos(a), y: cy + 38 * Math.sin(a) };
  });

  const ticks = Array.from({ length: 60 }, (_, i) => {
    const a = (i * 6 - 90) * Math.PI / 180;
    const isMajor = i % 5 === 0;
    const r1 = isMajor ? 42 : 44;
    const r2 = 46;
    return {
      x1: cx + r1 * Math.cos(a), y1: cy + r1 * Math.sin(a),
      x2: cx + r2 * Math.cos(a), y2: cy + r2 * Math.sin(a),
      major: isMajor,
    };
  });

  const clockLabel = `Horloge affichant ${hours % 12 || 12}h${String(minutes).padStart(2, '0')}`;
  return (
    <svg viewBox="0 0 100 100" className="ch-clock-svg" style={{ width: size, height: size }} role="img" aria-label={clockLabel}>
      <title>{clockLabel}</title>
      <circle cx={cx} cy={cy} r={46} className="ch-clock-face" />
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          className={t.major ? 'ch-clock-tick ch-clock-tick--major' : 'ch-clock-tick'} />
      ))}
      {nums.map(({ n, x, y }) => (
        <text key={n} x={x} y={y} className="ch-clock-num">{n}</text>
      ))}
      <line x1={cx} y1={cy} x2={hourX2} y2={hourY2} className="ch-hand-hour" />
      <line x1={cx} y1={cy} x2={minX2} y2={minY2} className="ch-hand-min" />
      <circle cx={cx} cy={cy} r={3} className="ch-clock-center" />
    </svg>
  );
}

// ── BadgePopup ────────────────────────────────────────────────────────────────
function BadgePopup({ badge, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => { closeRef.current?.focus(); }, []);
  return (
    <div className="ch-overlay" role="dialog" aria-modal="true" aria-labelledby="badge-title">
      <div className="ch-badge-popup">
        <div className="ch-badge-popup__emoji">{badge.emoji}</div>
        <div className="ch-badge-popup__title" id="badge-title">{badge.label}</div>
        <div className="ch-badge-popup__sub">Nouveau badge obtenu !</div>
        <button ref={closeRef} className="ch-badge-popup__close" onPointerDown={e => { e.preventDefault(); onClose(); }}>Super !</button>
      </div>
    </div>
  );
}

// ── Theory steps ──────────────────────────────────────────────────────────────
const THEORY_STEPS = [
  { color: '#0891b2', num: 'Étape 1', content: 'Une montre a deux types d\'aiguilles : la petite aiguille et la grande aiguille.' },
  { color: '#06b6d4', num: 'Étape 2', content: 'La petite aiguille montre les HEURES. Elle tourne lentement.' },
  { color: '#f59e0b', num: 'Étape 3', content: 'La grande aiguille montre les MINUTES. Elle tourne plus vite.' },
  { color: '#22c55e', num: 'Étape 4', content: 'Quand la grande aiguille est en haut (sur le 12), il est pile. Ex: 3 heures pile.' },
  { color: '#8b5cf6', num: 'Étape 5', content: 'Quand la grande aiguille est en bas (sur le 6), c\'est et demie. Ex: 3 heures et demie.' },
  { color: '#f97316', num: 'Étape 6', content: 'Une journée = 24 heures. Matin (6h-12h), Après-midi (12h-18h), Soir (18h-21h), Nuit (21h-6h).' },
  { color: '#ef4444', num: 'Étape 7', content: 'La montre digitale affiche l\'heure en chiffres, comme 08:30. C\'est la meme heure !' },
];

// ── Mode definitions ──────────────────────────────────────────────────────────
const MODES = [
  { id: 'discover',    emoji: '📖', name: 'Je Decouvre',             desc: 'Apprends les aiguilles etape par etape',  color: '#0891b2', badge: 'Theorie' },
  { id: 'builder',    emoji: '⌚', name: 'Construis Ma Montre',      desc: 'Cree ta propre montre',                   color: '#8b5cf6', badge: 'Creatif' },
  { id: 'full-hours', emoji: '🕐', name: 'Heures Piles',             desc: '10 exercices - heures rondes',            color: '#22c55e', badge: 'Facile',      label: 'Heures Piles' },
  { id: 'analog',     emoji: '🕐', name: 'Montre Analogique',        desc: 'Lis les aiguilles',                       color: '#06b6d4', badge: 'Moyen',       label: 'Analogique' },
  { id: 'digital',    emoji: '🔢', name: 'Heure Digitale',           desc: 'Lis les chiffres',                        color: '#6366f1', badge: 'Digital',     label: 'Digitale' },
  { id: 'convert',    emoji: '🔄', name: 'Analogique <> Digitale',   desc: 'Convertis les heures',                    color: '#f59e0b', badge: 'Conversion',  label: 'Conversion' },
  { id: 'daily',      emoji: '🌅', name: 'La Journee de Lena',       desc: 'La ligne du temps',                       color: '#ef4444', badge: 'Vie Quotidienne' },
  { id: 'detective',  emoji: '🔍', name: 'Detectif du Temps',        desc: 'Trouve le bon moment',                    color: '#ec4899', badge: 'Logique',     label: 'Detectif' },
  { id: 'duration',   emoji: '⏱️', name: 'Les Durees',               desc: 'Calcule les durees',                      color: '#14b8a6', badge: 'Calcul',      label: 'Durees' },
  { id: 'missions',   emoji: '🎯', name: 'Missions du Quotidien',    desc: 'Resous des problemes',                    color: '#f97316', badge: 'Expert',      label: 'Missions' },
];


// ── ChronoPage ────────────────────────────────────────────────────────────────
export default function ChronoPage() {
  const { locale } = useLocale();
  const [fbState, setFbState] = useState(null);
  const [phase, setPhase] = useState('hub');
  const [progress, setProgress] = useState(() => loadProgress());
  const [badge, setBadge] = useState(null);

  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle'); // idle | correct | wrong
  const [score, setScore] = useState(0);
  const [encourage, setEncourage] = useState('');
  const [tries, setTries] = useState(0);
  const [currentMode, setCurrentMode] = useState('analog');
  const [modeLabel, setModeLabel] = useState('');
  const [typedAnswer, setTypedAnswer] = useState('');

  // Mega Reto state
  const [megaReto, setMegaReto] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef(null);

  // Theory state
  const [stepIdx, setStepIdx] = useState(0);

  // Watch builder state
  const [watchBracelet, setWatchBracelet] = useState(() => loadProgress().watchDesign?.bracelet || 'Classique');
  const [watchColor, setWatchColor] = useState(() => loadProgress().watchDesign?.color || '#0891b2');

  function buildQuestions(mode, isMega) {
    const qCount = isMega ? 20 : 10;
    const qCount8 = isMega ? 20 : 8;
    if (mode === 'full-hours') return Array.from({ length: qCount }, () => genClockExercise(1));
    if (mode === 'analog')     return Array.from({ length: qCount }, () => genClockExercise(4));
    if (mode === 'digital')    return Array.from({ length: qCount }, () => genClockExercise(5));
    if (mode === 'convert')    return Array.from({ length: qCount }, () => genClockExercise(4));
    if (mode === 'place-hands')return Array.from({ length: qCount }, () => genClockExercise(3));
    if (mode === 'detective')  return [...DETECTIVE_TEMPLATES].sort(() => Math.random() - .5).slice(0, qCount8);
    if (mode === 'duration')   return Array.from({ length: qCount8 }, genDurationProblem);
    if (mode === 'missions')   return Array.from({ length: qCount8 }, genDurationProblem);
    return [];
  }

  function startMode(mode, label) {
    clearInterval(timerRef.current);
    setTimeLeft(15);
    const qs = buildQuestions(mode, megaReto);
    setCurrentMode(mode);
    setModeLabel(label || mode);
    setQuestions(qs);
    setQIdx(0);
    setScore(0);
    setInput('');
    setStatus('idle');
    setTries(0);
    setEncourage('');
    setTypedAnswer('');
    setPhase(mode);
  }

  function handleAnswer(answer) {
    const q = questions[qIdx];
    let correct = false;

    if (phase === 'full-hours' || phase === 'analog' || phase === 'digital' || phase === 'convert') {
      correct = answer === q.digital || answer === formatDigital(q.h, q.m);
    } else if (phase === 'detective') {
      correct = answer === q.answer;
    } else if (phase === 'duration' || phase === 'missions') {
      correct = String(answer).replace(/\s/g, '') === String(q.durationMins);
    } else if (phase === 'place-hands') {
      correct = answer === q.digital;
    }

    const newProgress = recordAnswer(correct);
    setProgress(newProgress);
    const newBadges = checkNewBadges(newProgress, CHRONO_BADGES);
    if (newBadges.length > 0) setBadge(newBadges[0]);

    const correctAnswer = q.digital || formatDigital(q.h, q.m) || String(q.durationMins) || String(q.answer) || '';
    if (correct) {
      setStatus('correct');
      setScore(s => s + 1);
      setTries(0);
      setFbState({ isCorrect: true, correctAnswer: null });
    } else {
      setStatus('wrong');
      const t = tries + 1;
      setTries(t);
      if (!megaReto) setEncourage(ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]);
      if (t >= 2) {
        setFbState({ isCorrect: false, correctAnswer: String(correctAnswer) });
      } else {
        setTimeout(() => { setStatus('idle'); setInput(''); setTypedAnswer(''); }, 1200);
      }
    }
  }

  function handleNext() {
    setFbState(null);
    setStatus('idle');
    if (qIdx + 1 >= questions.length) {
      setPhase('results');
    } else {
      setQIdx(i => i + 1);
      setInput('');
      setTypedAnswer('');
      setEncourage('');
      setTries(0);
    }
  }

  const pct = questions.length > 0 ? Math.round(score / questions.length * 100) : 0;
  const stars = megaReto
    ? (pct >= 95 ? 3 : pct >= 80 ? 2 : pct >= 60 ? 1 : 0)
    : (pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 50 ? 1 : 0);

  const QUIZ_PHASES = ['full-hours','analog','digital','convert','detective','duration','missions'];

  function handleTimeOut() {
    setStatus('wrong');
    setEncourage('');
    const q = questions[qIdx];
    const correctAnswer = q ? (q.digital || (q.h !== undefined ? formatDigital(q.h, q.m) : '') || String(q.durationMins || q.answer || '')) : '';
    setFbState({ isCorrect: false, correctAnswer: String(correctAnswer) });
    setTimeout(() => handleNext(), 2500);
  }

  useEffect(() => {
    if (!megaReto) return;
    if (!QUIZ_PHASES.includes(phase)) return;
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

  // ── Discover phase ────────────────────────────────────────────────────────
  if (phase === 'discover') {
    return (
      <div className="ch-quiz-page">
        <div className="ch-quiz-bar">
          <button type="button" className="ch-back" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>
            &larr;
          </button>
          <span className="ch-quiz-bar__title">Je Decouvre</span>
          <span className="ch-quiz-bar__counter">{stepIdx + 1}/{THEORY_STEPS.length}</span>
        </div>
        <div className="ch-theory">
          {THEORY_STEPS.map((step, i) => (
            <div
              key={i}
              className={'ch-step-card' + (i === stepIdx ? ' is-active' : '')}
              style={{ '--step-color': step.color }}
            >
              <p className="ch-step-card__num">{step.num}</p>
              <p className="ch-step-card__content">{step.content}</p>
            </div>
          ))}
        </div>
        <div className="ch-step-nav">
          {stepIdx > 0 && (
            <button type="button" className="ch-step-btn ch-step-btn--prev" onPointerDown={e => { e.preventDefault(); setStepIdx(s => s - 1); }}>
              &larr; Precedent
            </button>
          )}
          {stepIdx < THEORY_STEPS.length - 1 ? (
            <button type="button" className="ch-step-btn ch-step-btn--next" onPointerDown={e => { e.preventDefault(); setStepIdx(s => s + 1); }}>
              Suivant &rarr;
            </button>
          ) : (
            <button type="button" className="ch-step-btn ch-step-btn--next" onPointerDown={e => { e.preventDefault(); startMode('full-hours', 'Heures Piles'); }}>
              Pratiquer maintenant &rarr;
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Analog quiz (full-hours, analog) ─────────────────────────────────────
  if (phase === 'full-hours' || phase === 'analog') {
    if (questions.length === 0) return null;
    const q = questions[qIdx];
    const choices = genChoices(q.digital, 4);
    return (
      <div className="ch-quiz-page">
        <div className="ch-quiz-bar">
          <button type="button" className="ch-back" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>&larr;</button>
          <span className="ch-quiz-bar__title">{modeLabel}</span>
          <span className="ch-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="ch-prog-bar">
          <div className="ch-prog-bar__fill" style={{ width: (qIdx / questions.length * 100) + '%' }} />
        </div>
        {megaReto && (
          <div className="ch-timer-bar">
            <div className={`ch-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
            <span className="ch-timer-bar__num">{timeLeft}s</span>
          </div>
        )}
        <div className="ch-clock-wrap">
          <AnalogClock hours={q.h} minutes={q.m} size={220} />
        </div>
        <p className="ch-time-label">Quelle heure est-il ?</p>
        {encourage ? <div className="ch-encourage">{encourage}</div> : null}
        <div className="ch-choices">
          {choices.map(c => (
            <button
              key={c}
              type="button"
              className={'ch-choice' + (status !== 'idle' ? (c === q.digital ? ' is-correct' : (status === 'wrong' && c === input ? ' is-wrong' : '')) : '')}
              onPointerDown={e => { e.preventDefault(); if (status === 'idle') { setInput(c); handleAnswer(c); } }}
            >
              {c}
            </button>
          ))}
        </div>
        {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale={locale} onNext={handleNext} />}
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
      </div>
    );
  }

  // ── Digital quiz ──────────────────────────────────────────────────────────
  if (phase === 'digital') {
    if (questions.length === 0) return null;
    const q = questions[qIdx];
    const choices = genChoices(q.digital, 4);
    return (
      <div className="ch-quiz-page">
        <div className="ch-quiz-bar">
          <button type="button" className="ch-back" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>&larr;</button>
          <span className="ch-quiz-bar__title">Heure Digitale</span>
          <span className="ch-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="ch-prog-bar">
          <div className="ch-prog-bar__fill" style={{ width: (qIdx / questions.length * 100) + '%' }} />
        </div>
        {megaReto && (
          <div className="ch-timer-bar">
            <div className={`ch-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
            <span className="ch-timer-bar__num">{timeLeft}s</span>
          </div>
        )}
        <div className="ch-clock-wrap">
          <AnalogClock hours={q.h} minutes={q.m} size={200} />
        </div>
        <p className="ch-time-label">Ecris l'heure en chiffres :</p>
        {encourage ? <div className="ch-encourage">{encourage}</div> : null}
        <div className="ch-choices">
          {choices.map(c => (
            <button
              key={c}
              type="button"
              className={'ch-choice' + (status !== 'idle' ? (c === q.digital ? ' is-correct' : (status === 'wrong' && c === input ? ' is-wrong' : '')) : '')}
              onPointerDown={e => { e.preventDefault(); if (status === 'idle') { setInput(c); handleAnswer(c); } }}
            >
              {c}
            </button>
          ))}
        </div>
        {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale={locale} onNext={handleNext} />}
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
      </div>
    );
  }

  // ── Convert mode ──────────────────────────────────────────────────────────
  if (phase === 'convert') {
    if (questions.length === 0) return null;
    const q = questions[qIdx];
    const choices = genChoices(q.digital, 4);
    return (
      <div className="ch-quiz-page">
        <div className="ch-quiz-bar">
          <button type="button" className="ch-back" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>&larr;</button>
          <span className="ch-quiz-bar__title">Analogique &harr; Digitale</span>
          <span className="ch-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="ch-prog-bar">
          <div className="ch-prog-bar__fill" style={{ width: (qIdx / questions.length * 100) + '%' }} />
        </div>
        {megaReto && (
          <div className="ch-timer-bar">
            <div className={`ch-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
            <span className="ch-timer-bar__num">{timeLeft}s</span>
          </div>
        )}
        <div className="ch-digital">{q.digital}</div>
        <p className="ch-time-label">Heure correspondante :</p>
        {encourage ? <div className="ch-encourage">{encourage}</div> : null}
        <div className="ch-choices">
          {choices.map(c => (
            <button
              key={c}
              type="button"
              className={'ch-choice' + (status !== 'idle' ? (c === q.digital ? ' is-correct' : (status === 'wrong' && c === input ? ' is-wrong' : '')) : '')}
              onPointerDown={e => { e.preventDefault(); if (status === 'idle') { setInput(c); handleAnswer(c); } }}
            >
              {c}
            </button>
          ))}
        </div>
        {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale={locale} onNext={handleNext} />}
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
      </div>
    );
  }

  // ── Detective mode ────────────────────────────────────────────────────────
  if (phase === 'detective') {
    if (questions.length === 0) return null;
    const q = questions[qIdx];
    return (
      <div className="ch-quiz-page">
        <div className="ch-quiz-bar">
          <button type="button" className="ch-back" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>&larr;</button>
          <span className="ch-quiz-bar__title">Detectif du Temps</span>
          <span className="ch-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="ch-prog-bar">
          <div className="ch-prog-bar__fill" style={{ width: (qIdx / questions.length * 100) + '%' }} />
        </div>
        {megaReto && (
          <div className="ch-timer-bar">
            <div className={`ch-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
            <span className="ch-timer-bar__num">{timeLeft}s</span>
          </div>
        )}
        <div className="ch-duration-card" style={{ marginBottom: 8 }}>
          <p className="ch-duration-card__question" style={{ fontSize: '1.2rem', textAlign: 'center' }}>
            {q.emoji} {q.text}
          </p>
          <p style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.55)', textAlign: 'center', margin: 0 }}>
            Quelle heure est-il ?
          </p>
        </div>
        {encourage ? <div className="ch-encourage">{encourage}</div> : null}
        <div className="ch-choices">
          {q.choices.map(c => (
            <button
              key={c}
              type="button"
              className={'ch-choice' + (status !== 'idle' ? (c === q.answer ? ' is-correct' : (status === 'wrong' && c === input ? ' is-wrong' : '')) : '')}
              onPointerDown={e => { e.preventDefault(); if (status === 'idle') { setInput(c); handleAnswer(c); } }}
            >
              {c}
            </button>
          ))}
        </div>
        {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale={locale} onNext={handleNext} />}
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
      </div>
    );
  }

  // ── Duration / missions ───────────────────────────────────────────────────
  if (phase === 'duration' || phase === 'missions') {
    if (questions.length === 0) return null;
    const q = questions[qIdx];
    return (
      <div className="ch-quiz-page">
        <div className="ch-quiz-bar">
          <button type="button" className="ch-back" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>&larr;</button>
          <span className="ch-quiz-bar__title">{phase === 'missions' ? 'Missions du Quotidien' : 'Durees'}</span>
          <span className="ch-quiz-bar__counter">{qIdx + 1}/{questions.length}</span>
        </div>
        <div className="ch-prog-bar">
          <div className="ch-prog-bar__fill" style={{ width: (qIdx / questions.length * 100) + '%' }} />
        </div>
        {megaReto && (
          <div className="ch-timer-bar">
            <div className={`ch-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
            <span className="ch-timer-bar__num">{timeLeft}s</span>
          </div>
        )}
        <div className="ch-duration-card">
          <p className="ch-duration-card__question">
            {phase === 'missions'
              ? 'Le cours commence a ' + q.startDigital + ' et finit a ' + q.endDigital + '. Combien de minutes dure-t-il ?'
              : 'Debut : ' + q.startDigital + ' -> Fin : ' + q.endDigital + '. Quelle est la duree ?'}
          </p>
          <div className="ch-duration-card__times">
            <span>{q.startDigital}</span>
            <span className="ch-duration-card__arrow">&rarr;</span>
            <span>{q.endDigital}</span>
          </div>
        </div>
        {encourage ? <div className="ch-encourage">{encourage}</div> : null}
        <div className={'ch-answer-input' + (typedAnswer ? ' has-input' : '') + (status === 'correct' ? ' is-correct' : status === 'wrong' ? ' is-wrong' : '')}>
          {typedAnswer ? typedAnswer + ' min' : '?'}
        </div>
        <NumPad
          value={typedAnswer}
          onChange={setTypedAnswer}
          onSubmit={(v) => handleAnswer(v)}
        />
        {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale={locale} onNext={handleNext} />}
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
      </div>
    );
  }

  // ── Daily timeline ────────────────────────────────────────────────────────
  if (phase === 'daily') {
    return (
      <div className="ch-quiz-page">
        <div className="ch-quiz-bar">
          <button type="button" className="ch-back" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>&larr;</button>
          <span className="ch-quiz-bar__title">La Journee de Lena</span>
        </div>
        <div className="ch-timeline">
          {DAILY_EVENTS.map((ev, i) => (
            <div key={i} className="ch-timeline-event">
              <span className="ch-timeline-event__emoji">{ev.emoji}</span>
              <span className="ch-timeline-event__label">{ev.label}</span>
              <span className="ch-timeline-event__time">{formatDigital(ev.defaultH, ev.defaultM)}</span>
            </div>
          ))}
        </div>
        <div className="ch-step-nav">
          <button className="ch-step-btn ch-step-btn--prev" type="button" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>&#8592; Retour</button>
          <button className="ch-step-btn ch-step-btn--next" type="button" onPointerDown={e => { e.preventDefault(); startMode('detective', 'Detectif du Temps'); }}>Jouer &#8594;</button>
        </div>
      </div>
    );
  }

  // ── Watch builder ─────────────────────────────────────────────────────────
  if (phase === 'builder') {
    const BRACELETS = ['Classique', 'Sport', 'Metal', 'Cuir', 'Arc-en-ciel'];
    const COLORS = [
      { label: 'Bleu',   value: '#0891b2' },
      { label: 'Violet', value: '#8b5cf6' },
      { label: 'Rose',   value: '#ec4899' },
      { label: 'Vert',   value: '#22c55e' },
      { label: 'Or',     value: '#f59e0b' },
      { label: 'Rouge',  value: '#ef4444' },
    ];
    const now = new Date();
    return (
      <div className="ch-quiz-page">
        <div className="ch-quiz-bar">
          <button type="button" className="ch-back" aria-label="Retour" onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}>&larr;</button>
          <span className="ch-quiz-bar__title">Construis Ma Montre</span>
        </div>
        <div className="ch-watch-builder">
          <div className="ch-watch-builder__preview" style={{ '--ch-clock-accent': watchColor }}>
            <AnalogClock hours={now.getHours()} minutes={now.getMinutes()} size={200} />
          </div>
          <p className="ch-section-label" style={{ padding: '4px 2px 8px' }}>Bracelet</p>
          <div className="ch-option-row">
            {BRACELETS.map(b => (
              <button
                key={b}
                type="button"
                className={'ch-option-pill' + (watchBracelet === b ? ' is-selected' : '')}
                style={{ '--opt-color': '#0891b2' }}
                onPointerDown={e => { e.preventDefault(); setWatchBracelet(b); }}
              >
                {b}
              </button>
            ))}
          </div>
          <p className="ch-section-label" style={{ padding: '4px 2px 8px' }}>Couleur du cadran</p>
          <div className="ch-option-row">
            {COLORS.map(c => (
              <button
                key={c.value}
                type="button"
                className={'ch-option-pill' + (watchColor === c.value ? ' is-selected' : '')}
                style={{ '--opt-color': c.value }}
                onPointerDown={e => { e.preventDefault(); setWatchColor(c.value); }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div className="ch-step-nav">
          <button
            type="button"
            className="ch-step-btn ch-step-btn--next"
            onPointerDown={e => {
              e.preventDefault();
              saveWatchDesign({ bracelet: watchBracelet, color: watchColor });
              setPhase('hub');
            }}
          >
            Sauvegarder ma montre &#10003;
          </button>
        </div>
      </div>
    );
  }

  // ── Results ───────────────────────────────────────────────────────────────
  if (phase === 'results') {
    return (
      <div className="ch-quiz-page">
        <div className="ch-results">
          <div className="ch-results__trophy">{stars === 3 ? '🏆' : stars === 2 ? '🌟' : '⏰'}</div>
          <h2 className="ch-results__title">Bravo !</h2>
          <div className="ch-results__score">{score} / {questions.length}</div>
          <div className="ch-results-stars">
            {[1, 2, 3].map(s => (
              <span key={s} className="ch-results-star">{s <= stars ? '⭐' : '☆'}</span>
            ))}
          </div>
          <FunContentCard />
          <div className="ch-results-btns">
            <button
              type="button"
              className="ch-results-btn ch-results-btn--primary"
              onPointerDown={e => { e.preventDefault(); startMode(currentMode, modeLabel); }}
            >
              Rejouer
            </button>
            <button
              type="button"
              className="ch-results-btn ch-results-btn--secondary"
              onPointerDown={e => { e.preventDefault(); setPhase('hub'); }}
            >
              Retour
            </button>
          </div>
        </div>
        {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale={locale} onNext={handleNext} />}
        {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
      </div>
    );
  }

  // ── Hub (default) ─────────────────────────────────────────────────────────
  const progPct = progress.totalAttempts > 0
    ? Math.round(progress.totalCorrect / progress.totalAttempts * 100)
    : 0;
  const earnedBadges = CHRONO_BADGES.filter(b => progress.badges.includes(b.id));

  return (
    <div className="ch-page">
      <header className="ch-hero">
        <div className="ch-hero__mascot">⏰</div>
        <div>
          <h1 className="ch-hero__title">ChronoLena</h1>
          <p className="ch-hero__sub">J'apprends l'heure en jouant</p>
        </div>
      </header>

      <div className="ch-global-prog">
        <p className="ch-global-prog__label">Ma progression</p>
        <div className="ch-global-prog__bar">
          <div className="ch-global-prog__fill" style={{ width: Math.min(progPct, 100) + '%' }} />
        </div>
        <div className="ch-global-prog__stats">
          <span className="ch-global-prog__stat"><strong>{progress.totalCorrect}</strong> bonnes reponses</span>
          {earnedBadges.length > 0 && (
            <span className="ch-global-prog__stat">{earnedBadges.map(b => b.emoji).join(' ')}</span>
          )}
        </div>
      </div>

      <div className="ch-body">
        <p className="ch-section-label">Modes d'apprentissage</p>
        <div className="ch-cat-grid">
          {MODES.map(m => (
            <button
              key={m.id}
              type="button"
              className="ch-cat-card"
              style={{ '--cat-color': m.color }}
              onPointerDown={e => {
                e.preventDefault();
                setStepIdx(0);
                startMode(m.id, m.label || m.name);
              }}
            >
              <div className="ch-cat-card__stripe" />
              <div className="ch-cat-card__body">
                <span className="ch-cat-card__emoji">{m.emoji}</span>
                <span className="ch-cat-card__name">{m.name}</span>
                <span className="ch-cat-card__desc">{m.desc}</span>
                <span className="ch-cat-card__badge">{m.badge}</span>
              </div>
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`ch-mega-btn${megaReto ? ' is-active' : ''}`}
          onPointerDown={e => { e.preventDefault(); setMegaReto(m => !m); }}
        >
          {megaReto ? '🔥 Mega Reto ACTIF — Touche pour desactiver' : '🔥 Activer le Mega Reto'}
        </button>

        {earnedBadges.length > 0 && (
          <>
            <p className="ch-section-label">Mes badges</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingBottom: 'calc(var(--nav-height-mobile,64px) + 16px)' }}>
              {earnedBadges.map(b => (
                <div
                  key={b.id}
                  style={{ background: 'rgba(255,255,255,.08)', borderRadius: 16, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{b.emoji}</span>
                  <span style={{ fontSize: '.82rem', fontWeight: 700, color: '#fff' }}>{b.label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
    </div>
  );
}
