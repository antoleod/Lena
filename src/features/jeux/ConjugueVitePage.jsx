import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

// ─── Verb data ────────────────────────────────────────────────────────────────
const VERBS = {
  etre: {
    label: 'être',
    present:  { je: 'suis',   tu: 'es',    il: 'est',   nous: 'sommes', vous: 'êtes',  ils: 'sont'    },
    pc:       { je: 'ai été', tu: 'as été', il: 'a été', nous: 'avons été', vous: 'avez été', ils: 'ont été' },
    imparfait:{ je: 'étais',  tu: 'étais', il: 'était', nous: 'étions', vous: 'étiez', ils: 'étaient' },
    futur:    { je: 'serai',  tu: 'seras', il: 'sera',  nous: 'serons', vous: 'serez', ils: 'seront'  },
  },
  avoir: {
    label: 'avoir',
    present:  { je: 'ai',     tu: 'as',    il: 'a',     nous: 'avons',  vous: 'avez',  ils: 'ont'     },
    pc:       { je: 'ai eu',  tu: 'as eu', il: 'a eu',  nous: 'avons eu', vous: 'avez eu', ils: 'ont eu' },
    imparfait:{ je: 'avais',  tu: 'avais', il: 'avait', nous: 'avions', vous: 'aviez', ils: 'avaient' },
    futur:    { je: 'aurai',  tu: 'auras', il: 'aura',  nous: 'aurons', vous: 'aurez', ils: 'auront'  },
  },
  aller: {
    label: 'aller',
    present:  { je: 'vais',   tu: 'vas',   il: 'va',    nous: 'allons', vous: 'allez', ils: 'vont'    },
    pc:       { je: 'suis allé', tu: 'es allé', il: 'est allé', nous: 'sommes allés', vous: 'êtes allés', ils: 'sont allés' },
    imparfait:{ je: 'allais', tu: 'allais',il: 'allait',nous: 'allions',vous: 'alliez',ils: 'allaient'},
    futur:    { je: 'irai',   tu: 'iras',  il: 'ira',   nous: 'irons',  vous: 'irez',  ils: 'iront'   },
  },
  faire: {
    label: 'faire',
    present:  { je: 'fais',   tu: 'fais',  il: 'fait',  nous: 'faisons',vous: 'faites',ils: 'font'    },
    pc:       { je: 'ai fait',tu: 'as fait',il: 'a fait',nous: 'avons fait',vous: 'avez fait',ils: 'ont fait' },
    imparfait:{ je: 'faisais',tu: 'faisais',il: 'faisait',nous: 'faisions',vous: 'faisiez',ils: 'faisaient'},
    futur:    { je: 'ferai',  tu: 'feras', il: 'fera',  nous: 'ferons', vous: 'ferez', ils: 'feront'  },
  },
  venir: {
    label: 'venir',
    present:  { je: 'viens',  tu: 'viens', il: 'vient', nous: 'venons', vous: 'venez', ils: 'viennent'},
    pc:       { je: 'suis venu',tu: 'es venu',il: 'est venu',nous: 'sommes venus',vous: 'êtes venus',ils: 'sont venus'},
    imparfait:{ je: 'venais', tu: 'venais',il: 'venait',nous: 'venions',vous: 'veniez',ils: 'venaient'},
    futur:    { je: 'viendrai',tu: 'viendras',il: 'viendra',nous: 'viendrons',vous: 'viendrez',ils: 'viendront'},
  },
  voir: {
    label: 'voir',
    present:  { je: 'vois',   tu: 'vois',  il: 'voit',  nous: 'voyons', vous: 'voyez', ils: 'voient'  },
    pc:       { je: 'ai vu',  tu: 'as vu', il: 'a vu',  nous: 'avons vu',vous: 'avez vu',ils: 'ont vu'},
    imparfait:{ je: 'voyais', tu: 'voyais',il: 'voyait',nous: 'voyions',vous: 'voyiez',ils: 'voyaient'},
    futur:    { je: 'verrai', tu: 'verras',il: 'verra', nous: 'verrons',vous: 'verrez',ils: 'verront' },
  },
  prendre: {
    label: 'prendre',
    present:  { je: 'prends', tu: 'prends',il: 'prend', nous: 'prenons',vous: 'prenez',ils: 'prennent'},
    pc:       { je: 'ai pris',tu: 'as pris',il: 'a pris',nous: 'avons pris',vous: 'avez pris',ils: 'ont pris'},
    imparfait:{ je: 'prenais',tu: 'prenais',il: 'prenait',nous: 'prenions',vous: 'preniez',ils: 'prenaient'},
    futur:    { je: 'prendrai',tu: 'prendras',il: 'prendra',nous: 'prendrons',vous: 'prendrez',ils: 'prendront'},
  },
  pouvoir: {
    label: 'pouvoir',
    present:  { je: 'peux',   tu: 'peux',  il: 'peut',  nous: 'pouvons',vous: 'pouvez',ils: 'peuvent' },
    pc:       { je: 'ai pu',  tu: 'as pu', il: 'a pu',  nous: 'avons pu',vous: 'avez pu',ils: 'ont pu'},
    imparfait:{ je: 'pouvais',tu: 'pouvais',il: 'pouvait',nous: 'pouvions',vous: 'pouviez',ils: 'pouvaient'},
    futur:    { je: 'pourrai',tu: 'pourras',il: 'pourra',nous: 'pourrons',vous: 'pourrez',ils: 'pourront'},
  },
  vouloir: {
    label: 'vouloir',
    present:  { je: 'veux',   tu: 'veux',  il: 'veut',  nous: 'voulons',vous: 'voulez',ils: 'veulent' },
    pc:       { je: 'ai voulu',tu: 'as voulu',il: 'a voulu',nous: 'avons voulu',vous: 'avez voulu',ils: 'ont voulu'},
    imparfait:{ je: 'voulais',tu: 'voulais',il: 'voulait',nous: 'voulions',vous: 'vouliez',ils: 'voulaient'},
    futur:    { je: 'voudrai',tu: 'voudras',il: 'voudra',nous: 'voudrons',vous: 'voudrez',ils: 'voudront'},
  },
};

const TENSE_LABELS = {
  present: 'présent',
  pc: 'passé composé',
  imparfait: 'imparfait',
  futur: 'futur simple',
};

// ─── Level config ─────────────────────────────────────────────────────────────
const ALL_PRONOUNS = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];
const SHORT_PRONOUNS = ['je', 'tu', 'il'];

const LEVEL_CONFIG = [
  {
    label: 'N1 — être/avoir/aller, présent',
    verbKeys: ['etre', 'avoir', 'aller'],
    tenses: ['present'],
    pronouns: SHORT_PRONOUNS,
    timePerQ: 15,
    questions: 10,
  },
  {
    label: 'N2 — +faire/venir/voir, présent complet',
    verbKeys: ['etre', 'avoir', 'aller', 'faire', 'venir', 'voir'],
    tenses: ['present'],
    pronouns: ALL_PRONOUNS,
    timePerQ: 12,
    questions: 12,
  },
  {
    label: 'N3 — +prendre/pouvoir/vouloir, passé composé',
    verbKeys: ['etre', 'avoir', 'aller', 'faire', 'venir', 'voir', 'prendre', 'pouvoir', 'vouloir'],
    tenses: ['present', 'pc'],
    pronouns: ALL_PRONOUNS,
    timePerQ: 10,
    questions: 12,
  },
  {
    label: 'N4 — Tous les verbes + imparfait',
    verbKeys: Object.keys(VERBS),
    tenses: ['present', 'pc', 'imparfait'],
    pronouns: ALL_PRONOUNS,
    timePerQ: 8,
    questions: 15,
  },
  {
    label: 'N5 — Tous les temps mélangés',
    verbKeys: Object.keys(VERBS),
    tenses: ['present', 'pc', 'imparfait', 'futur'],
    pronouns: ALL_PRONOUNS,
    timePerQ: 6,
    questions: 15,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildAllAnswers(verbKeys, tenses) {
  const pool = new Set();
  verbKeys.forEach(vk => {
    tenses.forEach(tense => {
      ALL_PRONOUNS.forEach(p => {
        const form = VERBS[vk]?.[tense]?.[p];
        if (form) pool.add(form);
      });
    });
  });
  return [...pool];
}

function generateQuestion(cfg) {
  const vk = cfg.verbKeys[Math.floor(Math.random() * cfg.verbKeys.length)];
  const tense = cfg.tenses[Math.floor(Math.random() * cfg.tenses.length)];
  const pron = cfg.pronouns[Math.floor(Math.random() * cfg.pronouns.length)];
  const correct = VERBS[vk][tense][pron];
  const allAnswers = buildAllAnswers(cfg.verbKeys, cfg.tenses);
  const distractors = allAnswers.filter(a => a !== correct);
  const chosen = [];
  while (chosen.length < 3) {
    const pick = distractors[Math.floor(Math.random() * distractors.length)];
    if (!chosen.includes(pick)) chosen.push(pick);
  }
  const choices = [correct, ...chosen].sort(() => Math.random() - 0.5);
  return { verbKey: vk, pronoun: pron, tense, correct, choices };
}

function buildQuestions(cfg) {
  return Array.from({ length: cfg.questions }, () => generateQuestion(cfg));
}

function starsFor(correct, total) {
  const ratio = correct / total;
  if (ratio >= 13 / 15) return 3;
  if (ratio >= 9 / 15) return 2;
  return 1;
}

function formatTime(secs) {
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m${secs % 60}s`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ConjugueVitePage() {
  const { progress, saveSession, resetTimer } = useGameSession('conjugue');

  const [phase, setPhase] = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selected, setSelected] = useState(null);
  const [sessionResult, setSessionResult] = useState(null);
  const timerRef = useRef(null);
  const lockRef = useRef(false);
  const scoreRef = useRef(0);

  const cfg = LEVEL_CONFIG[selectedLevel - 1];

  const startGame = () => {
    const c = LEVEL_CONFIG[selectedLevel - 1];
    const qs = buildQuestions(c);
    scoreRef.current = 0;
    setQuestions(qs);
    setQIdx(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(c.timePerQ);
    setSelected(null);
    setSessionResult(null);
    lockRef.current = false;
    resetTimer();
    setPhase('play');
  };

  const advanceQuestion = (currentQIdx, currentCfg) => {
    const next = currentQIdx + 1;
    if (next >= currentCfg.questions) {
      const stars = starsFor(scoreRef.current, currentCfg.questions);
      const result = saveSession({ score: scoreRef.current, level: selectedLevel, stars });
      setSessionResult(result);
      setPhase('results');
      return;
    }
    setQIdx(next);
    setTimeLeft(currentCfg.timePerQ);
    setSelected(null);
    lockRef.current = false;
  };

  useEffect(() => {
    if (phase !== 'play') return;
    const c = LEVEL_CONFIG[selectedLevel - 1];
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          if (!lockRef.current) {
            lockRef.current = true;
            setStreak(0);
            setSelected({ choice: null, correct: questions[qIdx]?.correct });
            setTimeout(() => advanceQuestion(qIdx, c), 1000);
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
    const c = LEVEL_CONFIG[selectedLevel - 1];
    const q = questions[qIdx];
    const isCorrect = choice === q.correct;
    setSelected({ choice, correct: q.correct });
    if (isCorrect) {
      scoreRef.current += 1;
      setScore(s => s + 1);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
    setTimeout(() => advanceQuestion(qIdx, c), 900);
  };

  if (phase === 'setup') {
    return (
      <div className="cv-page">
        <div className="cv-setup-icon">⚡</div>
        <div className="cv-setup-title">Conjugue Vite !</div>
        <div className="cv-setup-sub">Choisis le bon niveau et conjugue !</div>

        <div className="jeux-level-grid">
          {LEVEL_CONFIG.map((lc, i) => {
            const lvl = i + 1;
            const locked = lvl > progress.unlockedLevel;
            const sel = lvl === selectedLevel;
            return (
              <button
                key={lvl}
                className={`jeux-level-btn${sel ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`}
                onPointerDown={() => !locked && setSelectedLevel(lvl)}
                disabled={locked}
              >
                {locked ? '🔒' : `N${lvl}`}
              </button>
            );
          })}
        </div>

        <div className="cv-setup-sub" style={{ marginBottom: 8 }}>
          {cfg.questions} questions · {cfg.timePerQ}s par question
        </div>

        <div className="jeux-setup-stats">
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{progress.bestScore}</span>
            <span className="jeux-setup-stat__lbl">Meilleur score</span>
          </div>
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{formatTime(progress.totalTimeSecs)}</span>
            <span className="jeux-setup-stat__lbl">Temps total</span>
          </div>
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{progress.sessionsPlayed}</span>
            <span className="jeux-setup-stat__lbl">Parties</span>
          </div>
        </div>

        <button className="cv-cta" onPointerDown={startGame} style={{ marginBottom: 12 }}>C'est parti !</button>
        <Link to="/jeux" style={{ display: 'block', textAlign: 'center', color: 'rgba(255,255,255,.6)', textDecoration: 'none' }}>
          Retour aux jeux
        </Link>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = starsFor(score, cfg.questions);
    return (
      <div className="cv-page">
        <div className="cv-result-title">Terminé !</div>
        <div className="jeux-stars">{'★'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
        <div className="jeux-result-stat"><span>Bonnes réponses</span><span>{score}/{cfg.questions}</span></div>
        {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
        {sessionResult?.newUnlocked && (
          <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} débloqué !</div>
        )}
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="cv-cta" onPointerDown={startGame}>Rejouer</button>
          <button className="cv-cta cv-cta--soft" onPointerDown={() => setPhase('setup')}>Niveaux</button>
          <Link to="/jeux" style={{ display: 'block', textAlign: 'center', color: 'rgba(255,255,255,.6)', textDecoration: 'none', marginTop: 8 }}>
            Retour aux jeux
          </Link>
        </div>
      </div>
    );
  }

  const q = questions[qIdx];
  if (!q) return null;
  const timerPct = (timeLeft / cfg.timePerQ) * 100;
  const urgent = timeLeft <= 4;

  return (
    <div className="cv-page">
      <div className="cv-header">
        <Link to="/jeux" className="cv-back">← Jeux</Link>
        <div className="cv-title">Conjugue Vite</div>
      </div>
      <div className="cv-hud">
        <div className="cv-progress">{qIdx + 1}/{cfg.questions}</div>
        <div className="cv-score">{score} pts</div>
        {streak >= 3 && <div className="cv-streak">🔥 x{streak}</div>}
      </div>
      <div className="cv-timer-bar">
        <div className={`cv-timer-fill${urgent ? ' cv-timer-fill--urgent' : ''}`} style={{ width: `${timerPct}%` }} />
      </div>
      <div className="cv-question-card">
        <div className="cv-tense-label">{TENSE_LABELS[q.tense]}</div>
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
