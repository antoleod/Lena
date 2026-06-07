import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './dudu.css';
import FeedbackCard from '../../shared/ui/FeedbackCard.jsx';
import {
  BADGES, GUIDED_EXERCISES, LEVELS, generateProblem, genSubtraction,
  decomposeNumber, explainBorrowing, needsBorrowing,
} from './duduEngine.js';
import { checkNewBadges, loadProgress, recordAnswer } from './duduProgress.js';

// ── Audio ─────────────────────────────────────────────────────────────────────
function playChime(ok) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = ok ? [523, 659, 784] : [300, 220];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = ok ? 'sine' : 'square';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.16;
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.start(t); osc.stop(t + 0.24);
    });
  } catch (_) { /* ignore */ }
}

function fireConfetti() {
  const ID = 'dd-confetti-kf';
  if (!document.getElementById(ID)) {
    const s = document.createElement('style');
    s.id = ID;
    s.textContent = '@keyframes ddFall{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}';
    document.head.appendChild(s);
  }
  const colors = ['#f59e0b','#ef4444','#22c55e','#6366f1','#8b5cf6','#06b6d4','#fbbf24'];
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
  for (let i = 0; i < 90; i++) {
    const el = document.createElement('div');
    const size = 5 + Math.random() * 9;
    el.style.cssText = `position:absolute;top:0;left:${Math.random()*100}%;width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${Math.random()>.5?'50%':'3px'};animation:ddFall ${2+Math.random()*1.4}s ${Math.random()*.9}s ease-in forwards;`;
    wrap.appendChild(el);
  }
  document.body.appendChild(wrap);
  setTimeout(() => { wrap.parentNode?.removeChild(wrap); }, 5000);
}

const ENCOURAGEMENTS = [
  'Essaie encore ! Tu es presque arrive !',
  'Regarde bien les unites !',
  'Tu peux le faire ! ✨',
  'Presque ! Regarde la methode !',
  'Super effort ! Recommence !',
];

function randEncouragement() {
  return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── NumPad ────────────────────────────────────────────────────────────────────
function NumPad({ value, onChange, onSubmit, disabled }) {
  function press(e, digit) {
    e.preventDefault();
    if (disabled) return;
    if (digit === 'del') { onChange(value.slice(0, -1)); return; }
    if (digit === 'ok')  { onSubmit(); return; }
    if (value.length >= 3) return;
    onChange(value + digit);
  }

  const keys = ['7','8','9','4','5','6','1','2','3'];
  const hasVal = value.length > 0;

  return (
    <div className="dd-numpad">
      {keys.map(k => (
        <button key={k} className="dd-key" onPointerDown={e => press(e, k)} type="button">{k}</button>
      ))}
      <button className="dd-key dd-key--del" onPointerDown={e => press(e, 'del')} type="button">⌫</button>
      <button className="dd-key" onPointerDown={e => press(e, '0')} type="button">0</button>
      <button
        className={`dd-key dd-key--ok${!hasVal ? ' is-disabled' : ''}`}
        onPointerDown={e => press(e, 'ok')}
        type="button"
      >✓</button>
    </div>
  );
}

// ── BadgePopup ────────────────────────────────────────────────────────────────
function BadgePopup({ badge, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => { closeRef.current?.focus(); }, []);
  return (
    <div className="dd-overlay" role="dialog" aria-modal="true" aria-labelledby="badge-title">
      <div className="dd-badge-popup">
        <div className="dd-badge-popup__emoji">{badge.emoji}</div>
        <div className="dd-badge-popup__title" id="badge-title">{badge.label}</div>
        <div className="dd-badge-popup__sub">Nouveau badge débloqué !</div>
        <button ref={closeRef} className="dd-badge-popup__close" onPointerDown={e => { e.preventDefault(); onClose(); }} type="button">
          Super !
        </button>
      </div>
    </div>
  );
}

// ── ResultsPhase ──────────────────────────────────────────────────────────────
function ResultsPhase({ correct, total, onRetry, onHub, megaReto }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const stars = megaReto
    ? (pct >= 95 ? 3 : pct >= 80 ? 2 : pct >= 60 ? 1 : 0)
    : (pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 50 ? 1 : 0);
  const trophy = pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '👍' : '💪';

  useEffect(() => {
    if (pct >= 70) fireConfetti();
  }, [pct]);

  return (
    <div className="dd-results">
      <div className="dd-results__trophy">{trophy}</div>
      <h2 className="dd-results__title">
        {pct >= 90 ? 'Bravo ! Tu es fantastique !' : pct >= 70 ? 'Tres bien fait !' : pct >= 50 ? 'Bon travail !' : 'Continue, tu progresses !'}
      </h2>
      <div className="dd-results__score">{correct}/{total}</div>
      <div className="dd-results__pct">{pct}%</div>
      <div className="dd-results-stars">
        {[1,2,3].map(i => (
          <span key={i} className="dd-results-star" style={{ opacity: i <= stars ? undefined : '.2' }}>
            {i <= stars ? '⭐' : '☆'}
          </span>
        ))}
      </div>
      <div className="dd-results-btns">
        <button className="dd-results-btn dd-results-btn--primary" onPointerDown={e => { e.preventDefault(); onRetry(); }} type="button">
          Rejouer
        </button>
        <button className="dd-results-btn dd-results-btn--secondary" onPointerDown={e => { e.preventDefault(); onHub(); }} type="button">
          Retour au menu
        </button>
      </div>
    </div>
  );
}

// ── TheoryPhase ───────────────────────────────────────────────────────────────
const THEORY_STEPS = [
  {
    num: 'Étape 1', color: '#06b6d4',
    content: 'Regardons 44 − 27',
    visual: () => <><span style={{fontSize:'2.5rem',fontWeight:900,color:'#fff'}}>44</span><span style={{fontSize:'2rem',color:'rgba(255,255,255,.5)'}}>−</span><span style={{fontSize:'2.5rem',fontWeight:900,color:'#fff'}}>27</span></>,
  },
  {
    num: 'Étape 2', color: '#f97316',
    content: 'Je regarde les unites : 4 et 7',
    visual: () => (
      <>
        <span style={{color:'rgba(255,255,255,.6)'}}>Unites :</span>
        <span className="dd-units-block">4</span>
        <span style={{color:'rgba(255,255,255,.4)'}}>et</span>
        <span className="dd-units-block">7</span>
      </>
    ),
  },
  {
    num: 'Étape 3', color: '#ef4444',
    content: '4 < 7 — Je ne peux pas faire 4 − 7 !',
    visual: () => <><span className="dd-units-block">4</span><span style={{color:'rgba(255,255,255,.6)'}}>{'<'}</span><span className="dd-units-block">7</span><span style={{fontSize:'1.8rem'}}>🛑</span><span style={{fontSize:'.85rem', color:'rgba(255,255,255,.6)', marginLeft:4}}>Pas de panique !</span></>,
  },
  {
    num: 'Étape 4', color: '#fbbf24',
    content: 'J\'emprunte une dizaine ! 4 dizaines devient 3 dizaines, et 4 unites devient 14 unites.',
    visual: () => (
      <>
        <span className="dd-tens-block" style={{opacity:.4,textDecoration:'line-through'}}>4D</span>
        <span style={{color:'rgba(255,255,255,.5)'}}>→</span>
        <span className="dd-tens-block">3D</span>
        <span style={{margin:'0 4px',color:'rgba(255,255,255,.5)'}}>et</span>
        <span className="dd-units-block" style={{opacity:.4,textDecoration:'line-through'}}>4u</span>
        <span style={{color:'rgba(255,255,255,.5)'}}>→</span>
        <span className="dd-units-block" style={{background:'#ea580c',width:32,height:32,fontSize:'.75rem'}}>14u</span>
      </>
    ),
  },
  {
    num: 'Étape 5', color: '#22c55e',
    content: 'Maintenant : 14 − 7 = 7 (unites)',
    visual: () => (
      <>
        <span className="dd-units-block" style={{background:'#ea580c',width:32,height:32,fontSize:'.75rem'}}>14u</span>
        <span style={{color:'rgba(255,255,255,.5)'}}>−</span>
        <span className="dd-units-block">7u</span>
        <span style={{color:'rgba(255,255,255,.5)'}}>{'='}</span>
        <span className="dd-units-block" style={{background:'#22c55e',width:32,height:32,fontSize:'.75rem'}}>7u</span>
      </>
    ),
  },
  {
    num: 'Étape 6', color: '#6366f1',
    content: 'Les dizaines : 3 − 2 = 1 (dizaine)',
    visual: () => (
      <>
        <span className="dd-tens-block">3D</span>
        <span style={{color:'rgba(255,255,255,.5)'}}>−</span>
        <span className="dd-tens-block" style={{background:'#7c3aed'}}>2D</span>
        <span style={{color:'rgba(255,255,255,.5)'}}>{'='}</span>
        <span className="dd-tens-block" style={{background:'#22c55e'}}>1D</span>
      </>
    ),
  },
  {
    num: 'Étape 7', color: '#4ade80',
    content: 'Resultat : 17 !',
    visual: () => <><span style={{fontSize:'3rem',fontWeight:900,color:'#4ade80'}}>17</span><span style={{fontSize:'2rem'}}>🎉</span></>,
  },
];

function TheoryPhase({ onPractice, onBack }) {
  const [current, setCurrent] = useState(0);
  const seen = current >= THEORY_STEPS.length - 1;

  return (
    <div className="dd-quiz-page">
      <div className="dd-quiz-bar">
        <button className="dd-back" aria-label="Retour" onPointerDown={e => { e.preventDefault(); onBack(); }} type="button">←</button>
        <span className="dd-quiz-bar__title">Comprendre la methode</span>
        <span className="dd-quiz-bar__counter">{current + 1}/{THEORY_STEPS.length}</span>
      </div>
      <div className="dd-theory">
        {THEORY_STEPS.map((step, i) => {
          const Visual = step.visual;
          return (
            <div
              key={i}
              className={`dd-step-card${i === current ? ' is-active' : ''}`}
              style={{ '--step-color': step.color }}
            >
              <p className="dd-step-card__num">{step.num}</p>
              <p className="dd-step-card__content">{step.content}</p>
              <div className="dd-step-card__visual"><Visual /></div>
            </div>
          );
        })}
      </div>
      <div className="dd-step-nav">
        {current > 0 && (
          <button className="dd-step-btn dd-step-btn--prev" onPointerDown={e => { e.preventDefault(); setCurrent(c => c - 1); }} type="button">← Precedent</button>
        )}
        {!seen ? (
          <button className="dd-step-btn dd-step-btn--next" onPointerDown={e => { e.preventDefault(); setCurrent(c => c + 1); }} type="button">Suivant →</button>
        ) : (
          <button className="dd-step-btn dd-step-btn--next" onPointerDown={e => { e.preventDefault(); onPractice(); }} type="button">Pratiquer maintenant →</button>
        )}
      </div>
    </div>
  );
}

// ── EquationDisplay ───────────────────────────────────────────────────────────
function EquationDisplay({ a, b, input, state }) {
  const ansClass = state === 'correct' ? 'is-correct' : state === 'wrong' ? 'is-wrong' : input ? 'has-input' : '';
  const eqClass = state === 'correct' ? 'is-correct' : state === 'wrong' ? 'is-wrong' : '';

  return (
    <div className={`dd-equation${eqClass ? ' ' + eqClass : ''}`}>
      <div className="dd-equation__nums">
        <span className="dd-equation__big">{a}</span>
        <span className="dd-equation__op">−</span>
        <span className="dd-equation__big">{b}</span>
        <span className="dd-equation__op">=</span>
        <span className={`dd-equation__answer${ansClass ? ' ' + ansClass : ''}`}>
          {input || (state === 'correct' ? a - b : state === 'wrong' ? input : '?')}
        </span>
      </div>
    </div>
  );
}

// ── Decomposition hint ────────────────────────────────────────────────────────
function DecompHint({ a, b }) {
  const exp = explainBorrowing(a, b);
  const aD = decomposeNumber(a);
  const bD = decomposeNumber(b);
  return (
    <div className="dd-explain">
      <p className="dd-explain__title">Methode Saucisse</p>
      {exp.step2 && (
        <div className="dd-explain__decomp">
          <span className="dd-explain__box dd-explain__box--tens">{aD.tens}D → {exp.step2.newATens}D</span>
          <span className="dd-explain__box dd-explain__box--units">{aD.units}u → {exp.step2.newAUnits}u</span>
          <span style={{color:'rgba(255,255,255,.5)'}}>puis</span>
          <span className="dd-explain__box dd-explain__box--units">{exp.step2.newAUnits} − {bD.units} = {exp.step3.unitsResult}u</span>
          <span className="dd-explain__box dd-explain__box--tens">{exp.step2.newATens} − {bD.tens} = {exp.step4.tensResult}D</span>
          <span className="dd-explain__box dd-explain__box--result">= {exp.result}</span>
        </div>
      )}
      {!exp.step2 && (
        <div className="dd-explain__decomp">
          <span className="dd-explain__box dd-explain__box--units">{aD.units} − {bD.units} = {exp.step3.unitsResult}u</span>
          <span className="dd-explain__box dd-explain__box--tens">{aD.tens} − {bD.tens} = {exp.step4.tensResult}D</span>
          <span className="dd-explain__box dd-explain__box--result">= {exp.result}</span>
        </div>
      )}
    </div>
  );
}

// ── GuidedPhase ───────────────────────────────────────────────────────────────
function GuidedPhase({ onFinish, onBack, megaReto, timerRef, timeLeft, setTimeLeft }) {
  const qCount = megaReto ? 20 : GUIDED_EXERCISES.length;
  const exercises = useRef(shuffle(GUIDED_EXERCISES).slice(0, qCount));
  const [idx, setIdx]         = useState(0);
  const [input, setInput]     = useState('');
  const [state, setState]     = useState('borrow-q'); // 'borrow-q' | 'input' | 'correct' | 'wrong'
  const [borrowWrong, setBorrowWrong] = useState(false);
  const [showDecomp, setShowDecomp]   = useState(false);
  const [encouragement, setEncouragement] = useState('');
  const [correct, setCorrect] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [badge, setBadge]     = useState(null);
  const [tryCount, setTryCount] = useState(0);
  const [fbState, setFbState] = useState(null);

  const ex = exercises.current[idx];
  if (!ex) return null;

  const total = exercises.current.length;
  const progress = total > 0 ? (idx / total) * 100 : 0;

  function handleNext() {
    setFbState(null);
    setState('borrow-q');
    setInput('');
    setBorrowWrong(false);
    setTryCount(0);
    setEncouragement('');
    if (idx + 1 >= total) {
      onFinish({ correct, total });
    } else {
      setIdx(i => i + 1);
    }
  }

  useEffect(() => {
    if (!megaReto) return;
    if (state !== 'input') return;
    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setState('wrong');
          setEncouragement('');
          setFbState({ isCorrect: false, correctAnswer: String(ex.result) });
          setTimeout(() => handleNext(), 2500);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [idx, megaReto, state]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleBorrowAnswer(e, answer) {
    e.preventDefault();
    const shouldBorrow = ex.borrow;
    if (answer === shouldBorrow) {
      // correct
      setBorrowWrong(false);
      setState('input');
    } else {
      setBorrowWrong(true);
    }
  }

  function handleSubmit() {
    if (!input) return;
    const val = parseInt(input, 10);
    const isCorrect = val === ex.result;
    setAttempts(a => a + 1);

    const prog = recordAnswer('guided', isCorrect);
    const newB = checkNewBadges(prog, BADGES);
    if (newB.length > 0) setBadge(newB[0]);

    if (isCorrect) {
      setCorrect(c => c + 1);
      setState('correct');
      playChime(true);
      setShowDecomp(false);
      setFbState({ isCorrect: true, correctAnswer: null });
    } else {
      playChime(false);
      setTryCount(t => t + 1);
      setState('wrong');
      if (!megaReto) setEncouragement(randEncouragement());
      setShowDecomp(true);
      setTimeout(() => {
        setInput('');
        setState('input');
      }, 1200);
    }
  }

  return (
    <div className="dd-quiz-page">
      {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
      <div className="dd-quiz-bar">
        <button className="dd-back" aria-label="Retour" onPointerDown={e => { e.preventDefault(); onBack(); }} type="button">←</button>
        <span className="dd-quiz-bar__title">Pratique guidee</span>
        <span className="dd-quiz-bar__counter">{idx + 1}/{total}</span>
      </div>
      <div className="dd-prog-bar"><div className="dd-prog-bar__fill" style={{width: progress + '%'}} /></div>
      {megaReto && (
        <div className="dd-timer-bar">
          <div className={`dd-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
          <span className="dd-timer-bar__num">{timeLeft}s</span>
        </div>
      )}

      <div className="dd-stats">
        <div className="dd-stat"><span className="dd-stat__emoji">✅</span><span className="dd-stat__val">{correct}</span><span className="dd-stat__lbl">Correct</span></div>
        <div className="dd-stat"><span className="dd-stat__emoji">🔢</span><span className="dd-stat__val">{idx + 1}</span><span className="dd-stat__lbl">Question</span></div>
      </div>

      <EquationDisplay a={ex.a} b={ex.b} input={input} state={state} />

      {state === 'borrow-q' && (
        <>
          <div className="dd-encourage">
            Regarde les unites : <strong>{ex.a % 10}</strong> et <strong>{ex.b % 10}</strong> — Peux-tu faire <strong>{ex.a % 10} − {ex.b % 10}</strong> ?
          </div>
          {borrowWrong && (
            <div className="dd-encourage" style={{borderColor:'rgba(249,115,22,.4)',background:'rgba(249,115,22,.1)'}}>
              Regarde bien... {ex.a % 10} est {ex.borrow ? 'plus petit que' : 'plus grand que'} {ex.b % 10} !
            </div>
          )}
          <div className="dd-borrow-q">
            <button className="dd-borrow-btn" onPointerDown={e => handleBorrowAnswer(e, false)} type="button">❌ Non</button>
            <button className="dd-borrow-btn" onPointerDown={e => handleBorrowAnswer(e, true)} type="button">✅ Oui</button>
          </div>
        </>
      )}

      {(state === 'input' || state === 'wrong') && showDecomp && (
        <DecompHint a={ex.a} b={ex.b} />
      )}

      {state === 'wrong' && encouragement && (
        <div className="dd-encourage" style={{borderColor:'rgba(249,115,22,.4)',background:'rgba(249,115,22,.1)'}}>
          {encouragement}
        </div>
      )}

      {(state === 'input' || state === 'wrong' || state === 'correct') && (
        <NumPad
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          disabled={state === 'correct'}
        />
      )}
      {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale="fr" onNext={handleNext} />}
    </div>
  );
}

// ── AutonomousPhase ───────────────────────────────────────────────────────────
function AutonomousPhase({ onFinish, onBack, megaReto, timerRef, timeLeft, setTimeLeft }) {
  const qCount = megaReto ? 20 : 10;
  const questions = useRef(Array.from({length: qCount}, () => genSubtraction(true)));
  const [idx, setIdx]         = useState(0);
  const [input, setInput]     = useState('');
  const [state, setState]     = useState('input');
  const [correct, setCorrect] = useState(0);
  const [tryCount, setTryCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [encouragement, setEncouragement] = useState('');
  const [badge, setBadge]     = useState(null);
  const [fbState, setFbState] = useState(null);

  const q = questions.current[idx];
  if (!q) return null;
  const total = questions.current.length;
  const progress = (idx / total) * 100;

  function handleNext() {
    setFbState(null);
    setState('input');
    setInput('');
    setTryCount(0);
    setShowHint(false);
    setEncouragement('');
    if (idx + 1 >= total) {
      onFinish({ correct, total });
    } else {
      setIdx(i => i + 1);
    }
  }

  useEffect(() => {
    if (!megaReto) return;
    if (state !== 'input') return;
    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setState('wrong');
          setFbState({ isCorrect: false, correctAnswer: String(q.result) });
          setTimeout(() => handleNext(), 2500);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [idx, megaReto, state]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit() {
    if (!input) return;
    const val = parseInt(input, 10);
    const isCorrect = val === q.result;

    const prog = recordAnswer('autonomous', isCorrect);
    const newB = checkNewBadges(prog, BADGES);
    if (newB.length > 0) setBadge(newB[0]);

    if (isCorrect) {
      setCorrect(c => c + 1);
      setState('correct');
      playChime(true);
      setFbState({ isCorrect: true, correctAnswer: null });
    } else {
      playChime(false);
      const newTry = tryCount + 1;
      setTryCount(newTry);
      setState('wrong');
      if (!megaReto) setEncouragement(randEncouragement());
      if (newTry >= 2) {
        setShowHint(true);
        setFbState({ isCorrect: false, correctAnswer: String(q.result) });
      } else {
        setTimeout(() => {
          setInput('');
          setState('input');
          setShowHint(q.borrow);
        }, 1200);
      }
    }
  }

  return (
    <div className="dd-quiz-page">
      {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
      <div className="dd-quiz-bar">
        <button className="dd-back" aria-label="Retour" onPointerDown={e => { e.preventDefault(); onBack(); }} type="button">←</button>
        <span className="dd-quiz-bar__title">Mode autonome</span>
        <span className="dd-quiz-bar__counter">{idx + 1}/{total}</span>
      </div>
      <div className="dd-prog-bar"><div className="dd-prog-bar__fill" style={{width: progress + '%'}} /></div>
      {megaReto && (
        <div className="dd-timer-bar">
          <div className={`dd-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
          <span className="dd-timer-bar__num">{timeLeft}s</span>
        </div>
      )}

      <div className="dd-stats">
        <div className="dd-stat"><span className="dd-stat__emoji">✅</span><span className="dd-stat__val">{correct}</span><span className="dd-stat__lbl">Correct</span></div>
        <div className="dd-stat"><span className="dd-stat__emoji">🔥</span><span className="dd-stat__val">{idx + 1}</span><span className="dd-stat__lbl">Question</span></div>
      </div>

      <EquationDisplay a={q.a} b={q.b} input={input} state={state} />

      {state === 'wrong' && encouragement && (
        <div className="dd-encourage" style={{borderColor:'rgba(249,115,22,.4)',background:'rgba(249,115,22,.1)'}}>
          {encouragement}
        </div>
      )}

      {showHint && <DecompHint a={q.a} b={q.b} />}

      <NumPad
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        disabled={state === 'correct' || (tryCount >= 2 && state === 'wrong')}
      />
      {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale="fr" onNext={handleNext} />}
    </div>
  );
}

// ── ProblemsPhase ─────────────────────────────────────────────────────────────
function ProblemsPhase({ onFinish, onBack, megaReto, timerRef, timeLeft, setTimeLeft }) {
  const qCount = megaReto ? 20 : 8;
  const problems = useRef(Array.from({length: qCount}, () => generateProblem(true)));
  const [idx, setIdx]         = useState(0);
  const [input, setInput]     = useState('');
  const [state, setState]     = useState('input');
  const [correct, setCorrect] = useState(0);
  const [badge, setBadge]     = useState(null);
  const [encouragement, setEncouragement] = useState('');
  const [fbState, setFbState] = useState(null);

  const p = problems.current[idx];
  if (!p) return null;
  const total = problems.current.length;
  const progress = (idx / total) * 100;

  function handleNext() {
    setFbState(null);
    setState('input');
    setInput('');
    setEncouragement('');
    if (idx + 1 >= total) {
      onFinish({ correct, total });
    } else {
      setIdx(i => i + 1);
    }
  }

  useEffect(() => {
    if (!megaReto) return;
    if (state !== 'input') return;
    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setState('wrong');
          setFbState({ isCorrect: false, correctAnswer: String(p.result) });
          setTimeout(() => handleNext(), 2500);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [idx, megaReto, state]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit() {
    if (!input) return;
    const val = parseInt(input, 10);
    const isCorrect = val === p.result;

    const prog = recordAnswer('problems', isCorrect);
    const newB = checkNewBadges(prog, BADGES);
    if (newB.length > 0) setBadge(newB[0]);

    if (isCorrect) {
      setCorrect(c => c + 1);
      setState('correct');
      playChime(true);
      setFbState({ isCorrect: true, correctAnswer: null });
    } else {
      playChime(false);
      setState('wrong');
      if (!megaReto) setEncouragement(randEncouragement());
      setFbState({ isCorrect: false, correctAnswer: String(p.result) });
    }
  }

  return (
    <div className="dd-quiz-page">
      {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
      <div className="dd-quiz-bar">
        <button className="dd-back" aria-label="Retour" onPointerDown={e => { e.preventDefault(); onBack(); }} type="button">←</button>
        <span className="dd-quiz-bar__title">Problemes DUDU</span>
        <span className="dd-quiz-bar__counter">{idx + 1}/{total}</span>
      </div>
      <div className="dd-prog-bar"><div className="dd-prog-bar__fill" style={{width: progress + '%'}} /></div>
      {megaReto && (
        <div className="dd-timer-bar">
          <div className={`dd-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
          <span className="dd-timer-bar__num">{timeLeft}s</span>
        </div>
      )}

      <div className="dd-stats">
        <div className="dd-stat"><span className="dd-stat__emoji">✅</span><span className="dd-stat__val">{correct}</span><span className="dd-stat__lbl">Correct</span></div>
        <div className="dd-stat"><span className="dd-stat__emoji">📖</span><span className="dd-stat__val">{idx + 1}</span><span className="dd-stat__lbl">Probleme</span></div>
      </div>

      <div className="dd-problem-card">
        <span className="dd-problem-card__emoji">{p.emoji}</span>
        <p className="dd-problem-card__text">{p.text}</p>
        <p className="dd-problem-card__question">Quelle est la reponse ?</p>
      </div>

      <EquationDisplay a={p.a} b={p.b} input={input} state={state} />

      {state === 'wrong' && encouragement && (
        <div className="dd-encourage" style={{borderColor:'rgba(249,115,22,.4)',background:'rgba(249,115,22,.1)'}}>
          {encouragement}
        </div>
      )}

      <NumPad
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        disabled={state === 'correct'}
      />
      {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale="fr" onNext={handleNext} />}
    </div>
  );
}

// ── TensUnitsPhase ────────────────────────────────────────────────────────────
function TensUnitsPhase({ onFinish, onBack, megaReto, timerRef, timeLeft, setTimeLeft }) {
  const qCount = megaReto ? 20 : 10;
  const numbers = useRef(Array.from({length: qCount}, () => 10 + Math.floor(Math.random() * 90)));
  const [idx, setIdx]         = useState(0);
  const [subPhase, setSubPhase] = useState('tens'); // 'tens' | 'units'
  const [input, setInput]     = useState('');
  const [state, setState]     = useState('input');
  const [correct, setCorrect] = useState(0);
  const [encouragement, setEncouragement] = useState('');
  const [fbState, setFbState] = useState(null);

  const n = numbers.current[idx];
  if (n === undefined) return null;
  const total = numbers.current.length;
  const progress = (idx / total) * 100;
  const d = decomposeNumber(n);

  function handleNext() {
    setFbState(null);
    setState('input');
    setInput('');
    setSubPhase('tens');
    setEncouragement('');
    if (idx + 1 >= total) {
      onFinish({ correct, total });
    } else {
      setIdx(i => i + 1);
    }
  }

  useEffect(() => {
    if (!megaReto) return;
    if (state !== 'input') return;
    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setState('wrong');
          if (subPhase === 'tens') {
            setTimeout(() => {
              setSubPhase('units');
              setInput('');
              setState('input');
              setEncouragement('');
            }, 800);
          } else {
            const expected = d.units;
            setFbState({ isCorrect: false, correctAnswer: String(expected) });
            setTimeout(() => handleNext(), 2500);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [idx, subPhase, megaReto, state]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit() {
    if (!input) return;
    const val = parseInt(input, 10);
    const expected = subPhase === 'tens' ? d.tens : d.units;
    const isCorrect = val === expected;

    recordAnswer('tens-units', isCorrect);

    if (isCorrect) {
      playChime(true);
      setState('correct');
      if (subPhase === 'tens') {
        setTimeout(() => {
          setSubPhase('units');
          setInput('');
          setState('input');
          setEncouragement('');
        }, 700);
      } else {
        setCorrect(c => c + 1);
        setFbState({ isCorrect: true, correctAnswer: null });
      }
    } else {
      playChime(false);
      setState('wrong');
      if (!megaReto) setEncouragement(randEncouragement());
      setTimeout(() => {
        setInput('');
        setState('input');
      }, 1000);
    }
  }

  return (
    <div className="dd-quiz-page">
      <div className="dd-quiz-bar">
        <button className="dd-back" aria-label="Retour" onPointerDown={e => { e.preventDefault(); onBack(); }} type="button">←</button>
        <span className="dd-quiz-bar__title">Dizaines et Unites</span>
        <span className="dd-quiz-bar__counter">{idx + 1}/{total}</span>
      </div>
      <div className="dd-prog-bar"><div className="dd-prog-bar__fill" style={{width: progress + '%'}} /></div>
      {megaReto && (
        <div className="dd-timer-bar">
          <div className={`dd-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
          <span className="dd-timer-bar__num">{timeLeft}s</span>
        </div>
      )}

      <div className="dd-stats">
        <div className="dd-stat"><span className="dd-stat__emoji">✅</span><span className="dd-stat__val">{correct}</span><span className="dd-stat__lbl">Correct</span></div>
        <div className="dd-stat"><span className="dd-stat__emoji">🔟</span><span className="dd-stat__val">{idx + 1}</span><span className="dd-stat__lbl">Nombre</span></div>
      </div>

      <div className="dd-tu-number">
        <div className="dd-tu-number__big">{n}</div>
        <div className="dd-tu-number__q">
          {subPhase === 'tens' ? 'Combien de dizaines ?' : 'Combien d\'unites ?'}
        </div>
      </div>

      <div className={`dd-equation${state === 'correct' ? ' is-correct' : state === 'wrong' ? ' is-wrong' : ''}`}>
        <div className="dd-equation__nums">
          <span className="dd-equation__big" style={{fontSize:'2rem'}}>{subPhase === 'tens' ? 'Dizaines' : 'Unites'} =</span>
          <span className={`dd-equation__answer${input ? ' has-input' : ''}${state === 'correct' ? ' is-correct' : state === 'wrong' ? ' is-wrong' : ''}`}>
            {input || '?'}
          </span>
        </div>
      </div>

      {state === 'wrong' && encouragement && (
        <div className="dd-encourage" style={{borderColor:'rgba(249,115,22,.4)',background:'rgba(249,115,22,.1)'}}>
          {encouragement}
        </div>
      )}

      <NumPad
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        disabled={state === 'correct'}
      />
      {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale="fr" onNext={handleNext} />}
    </div>
  );
}

// ── TeacherPhase ──────────────────────────────────────────────────────────────
function buildTeacherQuestion(idx) {
  const forceCarry = idx % 4 !== 0;
  const eq = genSubtraction(forceCarry);
  const needsBorrow = eq.borrow;
  const aD = decomposeNumber(eq.a);
  const bD = decomposeNumber(eq.b);

  if (needsBorrow) {
    const options = [
      `Parce que ${aD.units} < ${bD.units}`,
      `Parce que ${aD.tens} > ${bD.tens}`,
      `Parce que c'est difficile`,
      `Parce que ${eq.a} est grand`,
    ].sort(() => Math.random() - .5);
    return {
      eq,
      question: `${eq.a} - ${eq.b} : Pourquoi faut-il emprunter ?`,
      options,
      correct: `Parce que ${aD.units} < ${bD.units}`,
    };
  } else {
    const options = [
      `Je n'ai pas besoin d'emprunter !`,
      `Parce que ${aD.units} < ${bD.tens}`,
      `Parce que c'est facile`,
      `Parce que ${eq.a} est petit`,
    ].sort(() => Math.random() - .5);
    return {
      eq,
      question: `${eq.a} - ${eq.b} : Faut-il emprunter une dizaine ?`,
      options,
      correct: `Je n'ai pas besoin d'emprunter !`,
    };
  }
}

function TeacherPhase({ onFinish, onBack, megaReto, timerRef, timeLeft, setTimeLeft }) {
  const qCount = megaReto ? 20 : 8;
  const questions = useRef(Array.from({length: qCount}, (_, i) => buildTeacherQuestion(i)));
  const [idx, setIdx]         = useState(0);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [fbState, setFbState] = useState(null);

  const q = questions.current[idx];
  if (!q) return null;
  const total = questions.current.length;
  const progress = (idx / total) * 100;
  const aD = decomposeNumber(q.eq.a);
  const bD = decomposeNumber(q.eq.b);

  function handleNext() {
    setFbState(null);
    setSelected(null);
    if (idx + 1 >= total) {
      onFinish({ correct, total });
    } else {
      setIdx(i => i + 1);
    }
  }

  useEffect(() => {
    if (!megaReto) return;
    if (selected !== null) return;
    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setSelected('__timeout__');
          setFbState({ isCorrect: false, correctAnswer: q.correct });
          setTimeout(() => handleNext(), 2500);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [idx, megaReto, selected]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleOpt(e, opt) {
    e.preventDefault();
    if (selected !== null) return;
    setSelected(opt);
    const isCorrect = opt === q.correct;
    recordAnswer('teacher', isCorrect);
    if (isCorrect) {
      setCorrect(c => c + 1);
      playChime(true);
    } else {
      playChime(false);
    }
    setFbState({ isCorrect, correctAnswer: isCorrect ? null : q.correct });
  }

  return (
    <div className="dd-quiz-page">
      <div className="dd-quiz-bar">
        <button className="dd-back" aria-label="Retour" onPointerDown={e => { e.preventDefault(); onBack(); }} type="button">←</button>
        <span className="dd-quiz-bar__title">Deviens le Prof</span>
        <span className="dd-quiz-bar__counter">{idx + 1}/{total}</span>
      </div>
      <div className="dd-prog-bar"><div className="dd-prog-bar__fill" style={{width: progress + '%'}} /></div>
      {megaReto && (
        <div className="dd-timer-bar">
          <div className={`dd-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
          <span className="dd-timer-bar__num">{timeLeft}s</span>
        </div>
      )}

      <div className="dd-stats">
        <div className="dd-stat"><span className="dd-stat__emoji">✅</span><span className="dd-stat__val">{correct}</span><span className="dd-stat__lbl">Correct</span></div>
        <div className="dd-stat"><span className="dd-stat__emoji">🎓</span><span className="dd-stat__val">{idx + 1}</span><span className="dd-stat__lbl">Question</span></div>
      </div>

      <div className="dd-teacher-card" style={{margin:'0 14px 10px'}}>
        <p className="dd-teacher-card__q">{q.question}</p>
        <div style={{display:'flex',gap:12,justifyContent:'center',fontSize:'2.5rem',marginBottom:4}}>
          <span style={{color:'#6366f1',fontWeight:900}}>{q.eq.a}</span>
          <span style={{color:'rgba(255,255,255,.4)'}}>−</span>
          <span style={{color:'#f97316',fontWeight:900}}>{q.eq.b}</span>
        </div>
        <div style={{display:'flex',gap:8,justifyContent:'center',flexWrap:'wrap',marginTop:6}}>
          <span className="dd-tens-block">{aD.tens}D</span>
          <span className="dd-units-block">{aD.units}u</span>
          <span style={{color:'rgba(255,255,255,.4)'}}>−</span>
          <span className="dd-tens-block" style={{background:'#7c3aed'}}>{bD.tens}D</span>
          <span className="dd-units-block">{bD.units}u</span>
        </div>
      </div>

      <div className="dd-teacher-options">
        {q.options.map((opt, i) => {
          let cls = 'dd-teacher-opt';
          if (selected !== null) {
            if (opt === q.correct) cls += ' is-correct';
            else if (opt === selected) cls += ' is-wrong';
          }
          return (
            <button key={i} className={cls} onPointerDown={e => handleOpt(e, opt)} type="button">
              {opt}
            </button>
          );
        })}
      </div>
      {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale="fr" onNext={handleNext} />}
    </div>
  );
}

// ── SaucissePhase (Methode Saucisse — same as Guided but forced carry always shown) ──
function SaucissePhase({ onFinish, onBack, megaReto, timerRef, timeLeft, setTimeLeft }) {
  const qCount = megaReto ? 20 : 10;
  const questions = useRef(Array.from({length: qCount}, () => genSubtraction(true)));
  const [idx, setIdx]         = useState(0);
  const [input, setInput]     = useState('');
  const [state, setState]     = useState('input');
  const [correct, setCorrect] = useState(0);
  const [badge, setBadge]     = useState(null);
  const [encouragement, setEncouragement] = useState('');
  const [fbState, setFbState] = useState(null);

  const q = questions.current[idx];
  if (!q) return null;
  const total = questions.current.length;
  const progress = (idx / total) * 100;

  function handleNext() {
    setFbState(null);
    setState('input');
    setInput('');
    setEncouragement('');
    if (idx + 1 >= total) {
      onFinish({ correct, total });
    } else {
      setIdx(i => i + 1);
    }
  }

  useEffect(() => {
    if (!megaReto) return;
    if (state !== 'input') return;
    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setState('wrong');
          setFbState({ isCorrect: false, correctAnswer: String(q.result) });
          setTimeout(() => handleNext(), 2500);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [idx, megaReto, state]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit() {
    if (!input) return;
    const val = parseInt(input, 10);
    const isCorrect = val === q.result;

    const prog = recordAnswer('saucisse', isCorrect);
    const newB = checkNewBadges(prog, BADGES);
    if (newB.length > 0) setBadge(newB[0]);

    if (isCorrect) {
      setCorrect(c => c + 1);
      setState('correct');
      playChime(true);
      setFbState({ isCorrect: true, correctAnswer: null });
    } else {
      playChime(false);
      setState('wrong');
      if (!megaReto) setEncouragement(randEncouragement());
      setTimeout(() => {
        setInput('');
        setState('input');
      }, 1200);
    }
  }

  return (
    <div className="dd-quiz-page">
      {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
      <div className="dd-quiz-bar">
        <button className="dd-back" aria-label="Retour" onPointerDown={e => { e.preventDefault(); onBack(); }} type="button">←</button>
        <span className="dd-quiz-bar__title">Methode Saucisse</span>
        <span className="dd-quiz-bar__counter">{idx + 1}/{total}</span>
      </div>
      <div className="dd-prog-bar"><div className="dd-prog-bar__fill" style={{width: progress + '%'}} /></div>
      {megaReto && (
        <div className="dd-timer-bar">
          <div className={`dd-timer-bar__fill${timeLeft <= 5 ? ' is-urgent' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
          <span className="dd-timer-bar__num">{timeLeft}s</span>
        </div>
      )}

      <div className="dd-stats">
        <div className="dd-stat"><span className="dd-stat__emoji">✅</span><span className="dd-stat__val">{correct}</span><span className="dd-stat__lbl">Correct</span></div>
        <div className="dd-stat"><span className="dd-stat__emoji">🌭</span><span className="dd-stat__val">{idx + 1}</span><span className="dd-stat__lbl">Exercice</span></div>
      </div>

      <EquationDisplay a={q.a} b={q.b} input={input} state={state} />

      {/* Always show decomp hint in saucisse mode */}
      <DecompHint a={q.a} b={q.b} />

      {state === 'wrong' && encouragement && (
        <div className="dd-encourage" style={{borderColor:'rgba(249,115,22,.4)',background:'rgba(249,115,22,.1)'}}>
          {encouragement}
        </div>
      )}

      <NumPad
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        disabled={state === 'correct'}
      />
      {fbState !== null && <FeedbackCard isCorrect={fbState.isCorrect} correctAnswer={fbState.correctAnswer} locale="fr" onNext={handleNext} />}
    </div>
  );
}

// ── Hub ───────────────────────────────────────────────────────────────────────
function HubPhase({ onMode, progress, megaReto, setMegaReto }) {
  const navigate = useNavigate();
  const pct = progress.totalAttempts > 0
    ? Math.min(100, Math.round((progress.totalCorrect / progress.totalAttempts) * 100))
    : 0;
  const earnedBadges = BADGES.filter(b => progress.badges.includes(b.id));

  const learningCards = [
    { mode: 'theory',    emoji: '📖', name: 'Theorie',        desc: 'Comprends la methode etape par etape', color: '#06b6d4' },
    { mode: 'guided',    emoji: '🤝', name: 'Pratique guidee', desc: 'L\'application t\'aide a chaque etape', color: '#6366f1' },
    { mode: 'autonomous',emoji: '🧠', name: 'Autonome',        desc: 'Reponds seul, tu peux le faire !',     color: '#f59e0b' },
  ];

  const activityCards = [
    { mode: 'guided',   emoji: '🔢', name: 'Calculs guides',    desc: '21 exercices des fiches de classe', color: '#22c55e' },
    { mode: 'saucisse', emoji: '🌭', name: 'Methode Saucisse',  desc: 'La technique pas-a-pas',            color: '#f97316' },
    { mode: 'problems', emoji: '📖', name: 'Problemes DUDU',    desc: 'Histoires avec calculs',            color: '#8b5cf6' },
    { mode: 'tens-units', emoji: '🔟', name: 'Dizaines et Unites', desc: 'Comprendre les chiffres',        color: '#06b6d4' },
    { mode: 'teacher',  emoji: '🎓', name: 'Deviens le Prof',   desc: 'Explique la methode',               color: '#ef4444' },
  ];

  return (
    <div className="dd-page">
      <div className="dd-hero">
        <div className="dd-hero__mascot">🧮</div>
        <div>
          <h1 className="dd-hero__title">DUDU</h1>
          <p className="dd-hero__sub">Soustractions avec passage a la dizaine</p>
        </div>
      </div>

      <div className="dd-global-prog">
        <p className="dd-global-prog__label">Progression globale</p>
        <div className="dd-global-prog__bar">
          <div className="dd-global-prog__fill" style={{width: pct + '%'}} />
        </div>
        <div className="dd-global-prog__stats">
          <span className="dd-global-prog__stat"><strong>{progress.totalCorrect}</strong> correct</span>
          <span className="dd-global-prog__stat"><strong>{progress.totalAttempts}</strong> tentatives</span>
          <span className="dd-global-prog__stat"><strong>{earnedBadges.length}</strong> badges</span>
        </div>
      </div>

      <div className="dd-body">
        <p className="dd-section-label">Mode d\'apprentissage</p>
        <div className="dd-cat-grid">
          {learningCards.map(c => (
            <button
              key={c.mode}
              className="dd-cat-card"
              style={{ '--cat-color': c.color }}
              onPointerDown={e => { e.preventDefault(); onMode(c.mode); }}
              type="button"
            >
              <div className="dd-cat-card__stripe" />
              <div className="dd-cat-card__body">
                <span className="dd-cat-card__emoji">{c.emoji}</span>
                <span className="dd-cat-card__name">{c.name}</span>
                <span className="dd-cat-card__desc">{c.desc}</span>
              </div>
            </button>
          ))}
        </div>

        <p className="dd-section-label">Activites</p>
        <div className="dd-cat-grid">
          {activityCards.map(c => (
            <button
              key={c.mode + c.name}
              className="dd-cat-card"
              style={{ '--cat-color': c.color }}
              onPointerDown={e => { e.preventDefault(); onMode(c.mode); }}
              type="button"
            >
              <div className="dd-cat-card__stripe" />
              <div className="dd-cat-card__body">
                <span className="dd-cat-card__emoji">{c.emoji}</span>
                <span className="dd-cat-card__name">{c.name}</span>
                <span className="dd-cat-card__desc">{c.desc}</span>
              </div>
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`dd-mega-btn${megaReto ? ' is-active' : ''}`}
          onPointerDown={e => { e.preventDefault(); setMegaReto(m => !m); }}
        >
          {megaReto ? '🔥 Mega Reto ACTIF — Touche pour desactiver' : '🔥 Activer le Mega Reto'}
        </button>

        {BADGES.length > 0 && (
          <>
            <p className="dd-section-label">Badges</p>
            <div className="dd-badges">
              {BADGES.map(b => {
                const earned = progress.badges.includes(b.id);
                return (
                  <div key={b.id} className={`dd-badge-chip${earned ? ' is-earned' : ' is-locked'}`}>
                    <span className="dd-badge-chip__emoji">{b.emoji}</span>
                    <span>{b.label}</span>
                    {!earned && <span style={{fontSize:'.65rem',color:'rgba(255,255,255,.4)'}}>({b.threshold}✓)</span>}
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div style={{height:80}} />
      </div>
    </div>
  );
}

// ── DuduPage (root) ───────────────────────────────────────────────────────────
export default function DuduPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('hub');
  const [resultData, setResultData] = useState(null);
  const [lastMode, setLastMode] = useState(null);
  const [progress, setProgress] = useState(() => loadProgress());
  const [megaReto, setMegaReto] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef(null);

  function refreshProgress() {
    setProgress(loadProgress());
  }

  function handleMode(mode) {
    setLastMode(mode);
    setPhase(mode);
  }

  function handleFinish(data) {
    clearInterval(timerRef.current);
    setResultData(data);
    setPhase('results');
    refreshProgress();
  }

  function goHub() {
    clearInterval(timerRef.current);
    setPhase('hub');
    setTimeLeft(15);
    refreshProgress();
  }

  if (phase === 'hub') {
    return (
      <HubPhase
        progress={progress}
        onMode={handleMode}
        megaReto={megaReto}
        setMegaReto={setMegaReto}
      />
    );
  }

  const megaProps = { megaReto, timerRef, timeLeft, setTimeLeft };

  if (phase === 'theory') {
    return (
      <TheoryPhase
        onPractice={() => handleMode('guided')}
        onBack={goHub}
      />
    );
  }

  if (phase === 'guided') {
    return (
      <GuidedPhase
        onFinish={handleFinish}
        onBack={goHub}
        {...megaProps}
      />
    );
  }

  if (phase === 'autonomous') {
    return (
      <AutonomousPhase
        onFinish={handleFinish}
        onBack={goHub}
        {...megaProps}
      />
    );
  }

  if (phase === 'problems') {
    return (
      <ProblemsPhase
        onFinish={handleFinish}
        onBack={goHub}
        {...megaProps}
      />
    );
  }

  if (phase === 'tens-units') {
    return (
      <TensUnitsPhase
        onFinish={handleFinish}
        onBack={goHub}
        {...megaProps}
      />
    );
  }

  if (phase === 'teacher') {
    return (
      <TeacherPhase
        onFinish={handleFinish}
        onBack={goHub}
        {...megaProps}
      />
    );
  }

  if (phase === 'saucisse') {
    return (
      <SaucissePhase
        onFinish={handleFinish}
        onBack={goHub}
        {...megaProps}
      />
    );
  }

  if (phase === 'results') {
    return (
      <div className="dd-quiz-page">
        <ResultsPhase
          correct={resultData?.correct ?? 0}
          total={resultData?.total ?? 0}
          megaReto={megaReto}
          onRetry={() => handleMode(lastMode)}
          onHub={goHub}
        />
      </div>
    );
  }

  return null;
}
