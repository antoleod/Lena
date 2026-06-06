import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

const TOTAL_QUESTIONS = 20;
const TIME_PER_Q = 5;

const LEVELS = [
  { id: 'ce1', label: 'CE1', desc: 'Nombres 1-20' },
  { id: 'ce2', label: 'CE2', desc: 'Nombres 1-50' },
  { id: 'cm1', label: 'CM1', desc: 'Nombres 1-100' },
];

const OPS = [
  { id: 'add', label: 'Addition', symbol: '+' },
  { id: 'sub', label: 'Soustraction', symbol: '-' },
  { id: 'mul', label: 'Multiplication', symbol: '×' },
  { id: 'div', label: 'Division', symbol: '÷' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestion(opId, levelId) {
  const max = levelId === 'ce1' ? 20 : levelId === 'ce2' ? 50 : 100;
  let a, b, answer, opSym;

  if (opId === 'add') {
    a = Math.floor(Math.random() * max) + 1;
    b = Math.floor(Math.random() * max) + 1;
    answer = a + b;
    opSym = '+';
  } else if (opId === 'sub') {
    a = Math.floor(Math.random() * max) + 1;
    b = Math.floor(Math.random() * a) + 1;
    answer = a - b;
    opSym = '-';
  } else if (opId === 'mul') {
    const tableMax = levelId === 'ce1' ? 5 : levelId === 'ce2' ? 5 : 10;
    a = Math.floor(Math.random() * tableMax) + 2;
    b = Math.floor(Math.random() * 10) + 1;
    answer = a * b;
    opSym = '×';
  } else {
    // division: generate clean result
    b = Math.floor(Math.random() * 9) + 2;
    answer = Math.floor(Math.random() * 10) + 1;
    a = b * answer;
    opSym = '÷';
  }

  const distractors = new Set();
  let off = 1;
  while (distractors.size < 3) {
    if (answer + off !== answer) distractors.add(answer + off);
    if (distractors.size < 3 && answer - off >= 0 && answer - off !== answer) distractors.add(answer - off);
    off++;
  }

  const choices = shuffle([answer, ...Array.from(distractors)]);
  return { a, b, opSym, answer, choices };
}

function calcStars(correct, total) {
  const r = correct / total;
  if (r >= 0.85) return 3;
  if (r >= 0.6) return 2;
  return 1;
}

export default function CourseMathsPage() {
  const [phase, setPhase] = useState('setup');
  const [level, setLevel] = useState('ce1');
  const [opId, setOpId] = useState('add');

  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const [picked, setPicked] = useState(null);
  const [locked, setLocked] = useState(false);

  const timerRef = useRef(null);
  const nextRef = useRef(null);

  function startGame() {
    const qs = Array.from({ length: TOTAL_QUESTIONS }, () => generateQuestion(opId, level));
    setQuestions(qs);
    setQIdx(0);
    setCorrect(0);
    setTimeLeft(TIME_PER_Q);
    setPicked(null);
    setLocked(false);
    setPhase('play');
  }

  function advanceQuestion(wasCorrect) {
    clearInterval(timerRef.current);
    if (wasCorrect) setCorrect(c => c + 1);
    setLocked(true);
    nextRef.current = setTimeout(() => {
      const next = qIdx + 1;
      if (next >= TOTAL_QUESTIONS) {
        setPhase('results');
      } else {
        setQIdx(next);
        setTimeLeft(TIME_PER_Q);
        setPicked(null);
        setLocked(false);
      }
    }, 500);
  }

  useEffect(() => {
    if (phase !== 'play' || locked) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          advanceQuestion(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, qIdx, locked]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => {
    clearInterval(timerRef.current);
    clearTimeout(nextRef.current);
  }, []);

  const handleChoice = useCallback((choice, ci) => {
    if (locked || picked !== null) return;
    const isCorrect = choice === questions[qIdx]?.answer;
    setPicked(ci);
    advanceQuestion(isCorrect);
  }, [locked, picked, questions, qIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'setup') {
    return (
      <div className="cm-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="cm-title">🏁 Course Maths</h1>
        <p className="cm-subtitle">20 questions, 5 secondes chacune !</p>

        <div className="cm-section">
          <div className="cm-section-label">Niveau</div>
          <div className="cm-chips">
            {LEVELS.map(lv => (
              <button
                key={lv.id}
                className={`cm-chip${level === lv.id ? ' is-selected' : ''}`}
                onPointerDown={e => { e.preventDefault(); setLevel(lv.id); }}
              >
                <span className="cm-chip__name">{lv.label}</span>
                <span className="cm-chip__desc">{lv.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="cm-section">
          <div className="cm-section-label">Operation</div>
          <div className="cm-chips cm-chips--2col">
            {OPS.map(op => (
              <button
                key={op.id}
                className={`cm-chip${opId === op.id ? ' is-selected' : ''}`}
                onPointerDown={e => { e.preventDefault(); setOpId(op.id); }}
              >
                <span className="cm-chip__sym">{op.symbol}</span>
                <span className="cm-chip__name">{op.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button className="cm-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>
          🏁 Partir !
        </button>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = calcStars(correct, TOTAL_QUESTIONS);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    return (
      <div className="cm-page">
        <h2 className="cm-result-title">{stars === 3 ? '🏆 Champion !' : stars === 2 ? '🎉 Bravo !' : '💪 Continue !'}</h2>
        <div className="jeux-stars">{starStr}</div>
        <div className="jeux-result-stat"><span>Bonnes reponses</span><span>{correct} / {TOTAL_QUESTIONS}</span></div>
        <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
          <button className="cm-cta" style={{ flex: 1 }} onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <button className="cm-cta cm-cta--soft" style={{ flex: 1 }} onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}>Reglages</button>
        </div>
        <Link to="/jeux" className="cm-back-link" style={{ marginTop: 16, display: 'block', textAlign: 'center' }}>← Retour aux jeux</Link>
      </div>
    );
  }

  const q = questions[qIdx];
  if (!q) return null;
  const pct = (timeLeft / TIME_PER_Q) * 100;
  const racePct = (qIdx / TOTAL_QUESTIONS) * 100;

  return (
    <div className="cm-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>

      <div className="cm-race-bar-wrap">
        <span className="cm-race-emoji" style={{ left: `calc(${racePct}% - 12px)` }}>🏎️</span>
        <div className="cm-race-track">
          <div className="cm-race-progress" style={{ width: `${racePct}%` }} />
        </div>
        <span className="cm-race-flag">🏁</span>
      </div>

      <div className="cm-hud">
        <span className="cm-q-count">Q {qIdx + 1}/{TOTAL_QUESTIONS}</span>
        <span className="cm-score-badge">✅ {correct}</span>
      </div>

      <div className="cm-timer-bar">
        <div className={`cm-timer-fill${timeLeft <= 2 ? ' cm-timer-fill--urgent' : ''}`} style={{ width: `${pct}%` }} />
      </div>

      <div className="cm-question">{q.a} {q.opSym} {q.b} = ?</div>

      <div className="cm-choices">
        {q.choices.map((c, ci) => {
          let cls = 'cm-choice';
          if (picked !== null) {
            if (c === q.answer) cls += ' cm-choice--correct';
            else if (picked === ci) cls += ' cm-choice--wrong';
          }
          return (
            <button
              key={ci}
              className={cls}
              onPointerDown={e => { e.preventDefault(); handleChoice(c, ci); }}
              disabled={locked}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
