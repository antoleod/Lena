import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

const QUESTION_TIME = 12;
const TOTAL_QUESTIONS = 15;

const VERBS = {
  etre:    { label: 'etre',    conj: { je: 'suis', tu: 'es', il: 'est', nous: 'sommes', vous: 'etes', ils: 'sont' } },
  avoir:   { label: 'avoir',   conj: { je: 'ai',   tu: 'as', il: 'a',   nous: 'avons',  vous: 'avez', ils: 'ont' } },
  aller:   { label: 'aller',   conj: { je: 'vais', tu: 'vas', il: 'va', nous: 'allons', vous: 'allez', ils: 'vont' } },
  faire:   { label: 'faire',   conj: { je: 'fais', tu: 'fais', il: 'fait', nous: 'faisons', vous: 'faites', ils: 'font' } },
  venir:   { label: 'venir',   conj: { je: 'viens', tu: 'viens', il: 'vient', nous: 'venons', vous: 'venez', ils: 'viennent' } },
  voir:    { label: 'voir',    conj: { je: 'vois', tu: 'vois', il: 'voit', nous: 'voyons', vous: 'voyez', ils: 'voient' } },
  prendre: { label: 'prendre', conj: { je: 'prends', tu: 'prends', il: 'prend', nous: 'prenons', vous: 'prenez', ils: 'prennent' } },
  pouvoir: { label: 'pouvoir', conj: { je: 'peux', tu: 'peux', il: 'peut', nous: 'pouvons', vous: 'pouvez', ils: 'peuvent' } },
};

const PRONOUNS = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];
const VERB_KEYS = Object.keys(VERBS);

function buildAllAnswers() {
  const pool = [];
  VERB_KEYS.forEach(vk => {
    PRONOUNS.forEach(p => pool.push(VERBS[vk].conj[p]));
  });
  return [...new Set(pool)];
}

const ALL_ANSWERS = buildAllAnswers();

function generateQuestion() {
  const vk = VERB_KEYS[Math.floor(Math.random() * VERB_KEYS.length)];
  const pron = PRONOUNS[Math.floor(Math.random() * PRONOUNS.length)];
  const correct = VERBS[vk].conj[pron];
  const distractors = ALL_ANSWERS.filter(a => a !== correct);
  const chosen = [];
  while (chosen.length < 3) {
    const pick = distractors[Math.floor(Math.random() * distractors.length)];
    if (!chosen.includes(pick)) chosen.push(pick);
  }
  const choices = [correct, ...chosen].sort(() => Math.random() - 0.5);
  return { verbKey: vk, pronoun: pron, correct, choices };
}

function buildQuestions() {
  const qs = [];
  for (let i = 0; i < TOTAL_QUESTIONS; i++) qs.push(generateQuestion());
  return qs;
}

function starsFor(correct, total) {
  const ratio = correct / total;
  if (ratio >= 0.8) return '★★★';
  if (ratio >= 0.5) return '★★☆';
  return '★☆☆';
}

export default function ConjugueVitePage() {
  const [phase, setPhase] = useState('setup');
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [selected, setSelected] = useState(null); // { choice, correct }
  const timerRef = useRef(null);
  const lockRef = useRef(false);

  const startGame = () => {
    const qs = buildQuestions();
    setQuestions(qs);
    setQIdx(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(QUESTION_TIME);
    setSelected(null);
    lockRef.current = false;
    setPhase('play');
  };

  const advanceQuestion = () => {
    setQIdx(i => {
      const next = i + 1;
      if (next >= TOTAL_QUESTIONS) {
        setPhase('results');
        return i;
      }
      setTimeLeft(QUESTION_TIME);
      setSelected(null);
      lockRef.current = false;
      return next;
    });
  };

  useEffect(() => {
    if (phase !== 'play') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          if (!lockRef.current) {
            lockRef.current = true;
            setStreak(0);
            setSelected({ choice: null, correct: questions[qIdx]?.correct });
            setTimeout(advanceQuestion, 1000);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, qIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChoice = (choice) => {
    if (lockRef.current) return;
    lockRef.current = true;
    clearInterval(timerRef.current);
    const q = questions[qIdx];
    const isCorrect = choice === q.correct;
    setSelected({ choice, correct: q.correct });
    if (isCorrect) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
    setTimeout(advanceQuestion, 900);
  };

  if (phase === 'setup') {
    return (
      <div className="cv-page">
        <div className="cv-setup-icon">⚡</div>
        <div className="cv-setup-title">Conjugue Vite !</div>
        <div className="cv-setup-sub">15 questions · 12 secondes par question · Present de l'indicatif</div>
        <button className="cv-cta" onPointerDown={startGame} style={{ marginBottom: 12 }}>C'est parti !</button>
        <Link to="/jeux" style={{ display: 'block', textAlign: 'center', color: 'rgba(255,255,255,.6)', textDecoration: 'none' }}>
          Retour aux jeux
        </Link>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = starsFor(score, TOTAL_QUESTIONS);
    return (
      <div className="cv-page">
        <div className="cv-result-title">Termine !</div>
        <div className="jeux-stars">{stars}</div>
        <div className="jeux-result-stat"><span>Bonnes reponses</span><span>{score}/{TOTAL_QUESTIONS}</span></div>
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="cv-cta" onPointerDown={startGame}>Rejouer</button>
          <Link to="/jeux" style={{ display: 'block', textAlign: 'center', color: 'rgba(255,255,255,.6)', textDecoration: 'none', marginTop: 8 }}>
            Retour aux jeux
          </Link>
        </div>
      </div>
    );
  }

  const q = questions[qIdx];
  if (!q) return null;
  const timerPct = (timeLeft / QUESTION_TIME) * 100;
  const urgent = timeLeft <= 4;
  const displayPronoun = q.pronoun === 'je' && ['avoir', 'aller', 'etre'].includes(q.verbKey) ? "j'" : q.pronoun + ' ';

  return (
    <div className="cv-page">
      <div className="cv-header">
        <Link to="/jeux" className="cv-back">← Jeux</Link>
        <div className="cv-title">Conjugue Vite</div>
      </div>
      <div className="cv-hud">
        <div className="cv-progress">{qIdx + 1}/{TOTAL_QUESTIONS}</div>
        <div className="cv-score">{score} pts</div>
        {streak >= 3 && <div className="cv-streak">🔥 x{streak}</div>}
      </div>
      <div className={`cv-timer-bar`}>
        <div className={`cv-timer-fill${urgent ? ' cv-timer-fill--urgent' : ''}`} style={{ width: `${timerPct}%` }} />
      </div>
      <div className="cv-question-card">
        <div className="cv-pronoun">{q.pronoun.charAt(0).toUpperCase() + q.pronoun.slice(1)}</div>
        <div className="cv-verb-hint">
          <span className="cv-blank">___</span> ({VERBS[q.verbKey].label})
        </div>
      </div>
      <div className="cv-choices">
        {q.choices.map((c, i) => {
          let cls = 'cv-choice';
          if (selected) {
            if (c === selected.correct) cls += ' cv-choice--correct';
            else if (c === selected.choice) cls += ' cv-choice--wrong';
          }
          return (
            <button key={i} className={cls} onPointerDown={() => handleChoice(c)}>
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
