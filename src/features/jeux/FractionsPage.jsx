import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import { GameFeedback, useGameFeedback } from './GameFeedback.jsx';
import './jeux.css';

// ─── SVG Pizza ────────────────────────────────────────────────────────────────
function PizzaSVG({ numerator, denominator, size = 200 }) {
  const slices = [];
  const cx = size / 2, cy = size / 2, r = size * 0.45;
  for (let i = 0; i < denominator; i++) {
    const startAngle = (i / denominator) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((i + 1) / denominator) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = (1 / denominator) > 0.5 ? 1 : 0;
    const filled = i < numerator;
    slices.push(
      <path key={i}
        d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
        fill={filled ? '#dc2626' : '#fef9c3'}
        stroke="#92400e" strokeWidth="2"
      />
    );
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#92400e" strokeWidth="3" />
    </svg>
  );
}

// ─── Fraction data by level ───────────────────────────────────────────────────
const FRACS_N1 = [
  [1,2],[1,4],[2,4],[3,4],
];
const FRACS_N2 = [
  [1,3],[2,3],[1,6],[2,6],[3,6],[4,6],[5,6],
];
const FRACS_N3 = [
  [1,5],[2,5],[3,5],[4,5],[1,8],[3,8],[5,8],[7,8],
];
const FRACS_N4_BASE = [
  ...FRACS_N1,...FRACS_N2,...FRACS_N3,
];
// Simplification pairs: [num, den] → simplified label
const SIMPLIFICATIONS = [
  { num: 2, den: 4, choices: ['1/2','2/3','1/4','3/4'], correct: '1/2' },
  { num: 2, den: 6, choices: ['1/3','2/3','1/2','3/6'], correct: '1/3' },
  { num: 4, den: 6, choices: ['2/3','1/3','3/4','1/2'], correct: '2/3' },
  { num: 3, den: 6, choices: ['1/2','1/3','2/3','3/4'], correct: '1/2' },
  { num: 2, den: 8, choices: ['1/4','1/2','3/8','1/8'], correct: '1/4' },
  { num: 4, den: 8, choices: ['1/2','1/4','3/4','2/3'], correct: '1/2' },
  { num: 6, den: 8, choices: ['3/4','2/3','1/2','5/8'], correct: '3/4' },
];
const FRACS_N5 = [
  ...FRACS_N4_BASE,
  [1,10],[3,10],[7,10],[9,10],
  [1,12],[5,12],[7,12],[11,12],
];

function fracLabel(n, d) { return `${n}/${d}`; }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildChoices(num, den, allFracs) {
  const correct = fracLabel(num, den);
  const pool = allFracs
    .map(([n, d]) => fracLabel(n, d))
    .filter(f => f !== correct);
  const wrongs = shuffle(pool).slice(0, 3);
  return shuffle([correct, ...wrongs]);
}

function buildQuestion(fracs, allFracs, isN4Simplification) {
  if (isN4Simplification && Math.random() < 0.3) {
    const s = SIMPLIFICATIONS[Math.floor(Math.random() * SIMPLIFICATIONS.length)];
    return {
      num: s.num, den: s.den,
      choices: shuffle(s.choices),
      correct: s.correct,
      simplify: true,
    };
  }
  const [num, den] = fracs[Math.floor(Math.random() * fracs.length)];
  return {
    num, den,
    choices: buildChoices(num, den, allFracs),
    correct: fracLabel(num, den),
    simplify: false,
  };
}

const LEVEL_CONFIG = [
  { label: 'N1 — Demis et quarts',    questions: 15, fracs: FRACS_N1, allFracs: FRACS_N1, n4Simp: false },
  { label: 'N2 — Tiers et sixièmes',  questions: 15, fracs: FRACS_N2, allFracs: [...FRACS_N1,...FRACS_N2], n4Simp: false },
  { label: 'N3 — Cinquièmes·huitièmes', questions: 15, fracs: FRACS_N3, allFracs: [...FRACS_N1,...FRACS_N2,...FRACS_N3], n4Simp: false },
  { label: 'N4 — Mélange + simplif.', questions: 15, fracs: FRACS_N4_BASE, allFracs: FRACS_N4_BASE, n4Simp: true },
  { label: 'N5 — Dixièmes·douzièmes', questions: 15, fracs: FRACS_N5, allFracs: FRACS_N5, n4Simp: true },
];

function formatTime(secs) {
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m${secs % 60}s`;
}

export default function FractionsPage() {
  const { progress, saveSession, resetTimer, logError } = useGameSession('fractions');
  const { feedbackRef, triggerCorrect, triggerWrong } = useGameFeedback();

  const [phase, setPhase] = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [questionList, setQuestionList] = useState([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [chosenIdx, setChosenIdx] = useState(null);
  const [sessionResult, setSessionResult] = useState(null);

  const cfg = LEVEL_CONFIG[selectedLevel - 1];
  const question = questionList[roundIndex] ?? null;

  function startGame() {
    const c = LEVEL_CONFIG[selectedLevel - 1];
    const qs = Array.from({ length: c.questions }, () =>
      buildQuestion(c.fracs, c.allFracs, c.n4Simp)
    );
    setQuestionList(qs);
    setRoundIndex(0);
    setScore(0);
    setFeedback(null);
    setChosenIdx(null);
    setSessionResult(null);
    resetTimer();
    setPhase('play');
  }

  function handleChoice(choice, idx) {
    if (feedback !== null || !question) return;
    const correct = choice === question.correct;
    setChosenIdx(idx);
    setFeedback(correct ? 'ok' : 'bad');
    if (correct) {
      triggerCorrect();
      setScore(s => s + 1);
    } else {
      triggerWrong();
      logError({
        label: question.simplify
          ? `Simplifie ${question.num}/${question.den}`
          : `Fraction de la pizza`,
        correct: question.correct,
        given: choice,
      });
    }
    setTimeout(() => {
      const next = roundIndex + 1;
      if (next >= cfg.questions) {
        const finalScore = correct ? score + 1 : score;
        const stars = finalScore >= Math.ceil(cfg.questions * 0.86) ? 3
          : finalScore >= Math.ceil(cfg.questions * 0.6) ? 2 : 1;
        const result = saveSession({ score: finalScore, level: selectedLevel, stars });
        setSessionResult(result);
        setScore(finalScore);
        setPhase('results');
        return;
      }
      setRoundIndex(next);
      setFeedback(null);
      setChosenIdx(null);
    }, 900);
  }

  if (phase === 'setup') {
    return (
      <div className="an-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="an-title">🍕 Part de Pizza</h1>
        <p className="an-subtitle">Quelle fraction est représentée ?</p>

        <div className="jeux-level-grid">
          {LEVEL_CONFIG.map((lc, i) => {
            const lvl = i + 1;
            const locked = lvl > progress.unlockedLevel;
            const sel = lvl === selectedLevel;
            return (
              <button
                key={lvl}
                className={`jeux-level-btn${sel ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`}
                onPointerDown={e => { e.preventDefault(); if (!locked) setSelectedLevel(lvl); }}
                disabled={locked}
              >
                {locked ? '🔒' : `N${lvl}`}
              </button>
            );
          })}
        </div>

        <div className="an-info-row">
          <span>📝 {cfg.questions} questions</span>
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

        <button className="an-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>
          ▶ Jouer
        </button>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = score >= Math.ceil(cfg.questions * 0.86) ? 3
      : score >= Math.ceil(cfg.questions * 0.6) ? 2 : 1;
    const msg = stars === 3 ? '🎉 Parfait !' : stars === 2 ? '👍 Bien joué !' : '📚 Encore un effort !';
    return (
      <div className="an-page">
        <h2 className="an-result-title">{msg}</h2>
        <div className="jeux-stars">{'★'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {cfg.questions}</span></div>
        {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
        {sessionResult?.newUnlocked && (
          <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} débloqué !</div>
        )}
        <div className="an-result-btns">
          <button className="an-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <button className="an-cta an-cta--soft" onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}>Niveaux</button>
          <Link to="/jeux" className="an-cta an-cta--soft">← Jeux</Link>
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className={`an-page${feedback === 'ok' ? ' an-flash-ok' : feedback === 'bad' ? ' an-flash-bad' : ''}`}>
      <GameFeedback ref={feedbackRef} />
      <Link to="/jeux" className="exam-back-btn">←</Link>

      <div className="an-hud">
        <span className="an-score">⭐ {score}</span>
        <span className="an-round">{roundIndex + 1} / {cfg.questions}</span>
      </div>

      <div className="an-word-card" style={{ background: 'transparent', boxShadow: 'none', padding: '8px 0' }}>
        {question.simplify ? (
          <div style={{ textAlign: 'center' }}>
            <div className="an-label">Simplifie cette fraction :</div>
            <div className="an-word" style={{ fontSize: '2.5rem' }}>
              {question.num}/{question.den} = ?
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div className="an-label">Quelle fraction est coloriée ?</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
              <PizzaSVG numerator={question.num} denominator={question.den} size={180} />
            </div>
          </div>
        )}
      </div>

      <div className="an-choices">
        {question.choices.map((choice, i) => {
          let cls = 'an-choice';
          if (feedback !== null && i === chosenIdx) {
            cls += feedback === 'ok' ? ' an-choice--correct' : ' an-choice--wrong an-choice--shake';
          }
          if (feedback !== null && choice === question.correct && i !== chosenIdx) {
            cls += ' an-choice--correct';
          }
          return (
            <button
              key={i}
              className={cls}
              style={{ fontSize: '1.4rem', fontWeight: 700 }}
              onPointerDown={e => { e.preventDefault(); handleChoice(choice, i); }}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}
