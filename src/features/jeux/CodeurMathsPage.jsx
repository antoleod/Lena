import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

const SYMBOLS = ['★', '●', '▲', '♦', '◆'];

// ── Helpers ────────────────────────────────────────────────────────────────

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randNonZero(min, max, exclude) {
  let v;
  let tries = 0;
  do {
    v = randInt(min, max);
    tries++;
  } while ((v === 0 || v === exclude) && tries < 20);
  return v === 0 ? (min < 0 ? min : max) : v;
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function safeWrong(v, answer, min = 1, max = 20) {
  const c = clamp(v, min, max);
  if (c === answer) return c < (min + max) / 2 ? c + 1 : c - 1;
  return c;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick2Symbols() { const s = shuffle([...SYMBOLS]); return [s[0], s[1]]; }
function pick3Symbols() { const s = shuffle([...SYMBOLS]); return [s[0], s[1], s[2]]; }

// ── Round builders per level ───────────────────────────────────────────────

function buildRoundsN1(count) {
  // ★ + ● = X, given ★ = A, find ●  — addition only
  const rounds = [];
  for (let i = 0; i < count; i++) {
    const [s1, s2] = pick2Symbols();
    const a = randInt(1, 8);
    const b = randInt(1, 8);
    const sum = a + b;
    const w1 = b + randNonZero(-3, 3, 0);
    const w2 = b + randNonZero(-3, 3, w1 - b);
    rounds.push({
      equations: [`${s1} + ${s2} = ${sum}`, `${s1} = ${a}`],
      question: `${s2} = ?`,
      answer: b,
      choices: shuffle([b, safeWrong(w1, b), safeWrong(w2, b)]),
      label: 'Addition',
    });
  }
  return rounds;
}

function buildRoundsN2(count) {
  const rounds = [];
  const half = Math.floor(count / 2);
  // Subtraction
  for (let i = 0; i < half; i++) {
    const [s1, s2] = pick2Symbols();
    const result = randInt(1, 7);
    const a = randInt(result + 1, 14);
    const b = a - result;
    const w1 = b + randNonZero(-3, 3, 0);
    const w2 = b + randNonZero(-3, 3, w1 - b);
    rounds.push({
      equations: [`${s1} − ${s2} = ${result}`, `${s1} = ${a}`],
      question: `${s2} = ?`,
      answer: b,
      choices: shuffle([b, safeWrong(w1, b), safeWrong(w2, b)]),
      label: 'Soustraction',
    });
  }
  // Multiplication
  for (let i = 0; i < count - half; i++) {
    const [s1, s2] = pick2Symbols();
    const a = randInt(2, 5);
    const b = randInt(2, 5);
    const prod = a * b;
    const w1 = b + randNonZero(-2, 2, 0);
    const w2 = b + randNonZero(-2, 2, w1 - b);
    rounds.push({
      equations: [`${s1} × ${s2} = ${prod}`, `${s1} = ${a}`],
      question: `${s2} = ?`,
      answer: b,
      choices: shuffle([b, safeWrong(w1, b, 1, 10), safeWrong(w2, b, 1, 10)]),
      label: 'Multiplication',
    });
  }
  return shuffle(rounds);
}

function buildRoundsN3(count) {
  // Two-equation system: ★ + ● = A, ★ = B, find ●
  const rounds = [];
  for (let i = 0; i < count; i++) {
    const [s1, s2] = pick2Symbols();
    const a = randInt(1, 8);
    const b = randInt(1, 8);
    const sum = a + b;
    const w1 = b + randNonZero(-3, 3, 0);
    const w2 = b + randNonZero(-3, 3, w1 - b);
    rounds.push({
      equations: [`${s1} + ${s2} = ${sum}`, `${s1} = ${a}`],
      question: `${s2} = ?`,
      answer: b,
      choices: shuffle([b, safeWrong(w1, b), safeWrong(w2, b)]),
      label: 'Systeme',
    });
  }
  return rounds;
}

function buildRoundsN4(count) {
  // Three symbols, two equations, values up to 20
  const rounds = [];
  for (let i = 0; i < count; i++) {
    const [s1, s2, s3] = pick3Symbols();
    const a = randInt(1, 8);
    const b = randInt(1, 8);
    const c = randInt(1, 8);
    const w1 = a + randNonZero(-3, 3, 0);
    const w2 = a + randNonZero(-3, 3, w1 - a);
    rounds.push({
      equations: [
        `${s1} + ${s2} = ${a + b}`,
        `${s2} + ${s3} = ${b + c}`,
        `${s3} = ${c}`,
      ],
      question: `${s1} = ?`,
      answer: a,
      choices: shuffle([a, safeWrong(w1, a, 1, 20), safeWrong(w2, a, 1, 20)]),
      label: 'Trois symboles',
    });
  }
  return rounds;
}

function buildRoundsN5(count) {
  // Include division, larger values
  const rounds = [];
  const third = Math.floor(count / 3);
  // Division rounds
  for (let i = 0; i < third; i++) {
    const [s1, s2] = pick2Symbols();
    const b = randInt(2, 6);
    const quotient = randInt(2, 5);
    const a = b * quotient;
    const w1 = quotient + randNonZero(-2, 2, 0);
    const w2 = quotient + randNonZero(-2, 2, w1 - quotient);
    rounds.push({
      equations: [`${s1} ÷ ${s2} = ${quotient}`, `${s1} = ${a}`],
      question: `${s2} = ?`,
      answer: b,
      choices: shuffle([b, safeWrong(w1, b, 1, 15), safeWrong(w2, b, 1, 15)]),
      label: 'Division',
    });
  }
  // Three-symbol rounds with larger values
  for (let i = 0; i < count - third; i++) {
    const [s1, s2, s3] = pick3Symbols();
    const a = randInt(3, 12);
    const b = randInt(3, 12);
    const c = randInt(3, 12);
    const w1 = a + randNonZero(-4, 4, 0);
    const w2 = a + randNonZero(-4, 4, w1 - a);
    rounds.push({
      equations: [
        `${s1} + ${s2} = ${a + b}`,
        `${s2} + ${s3} = ${b + c}`,
        `${s3} = ${c}`,
      ],
      question: `${s1} = ?`,
      answer: a,
      choices: shuffle([a, safeWrong(w1, a, 1, 25), safeWrong(w2, a, 1, 25)]),
      label: 'Systeme avance',
    });
  }
  return shuffle(rounds);
}

const LEVEL_CONFIG = [
  { n: 1, label: 'Niveau 1', desc: 'Addition, 8 defis',        rounds: 8,  build: buildRoundsN1 },
  { n: 2, label: 'Niveau 2', desc: 'Soustraction × ÷, 10 defis', rounds: 10, build: buildRoundsN2 },
  { n: 3, label: 'Niveau 3', desc: 'Systeme 2 equations, 10 defis', rounds: 10, build: buildRoundsN3 },
  { n: 4, label: 'Niveau 4', desc: '3 symboles, 2 equations, 12 defis', rounds: 12, build: buildRoundsN4 },
  { n: 5, label: 'Niveau 5', desc: 'Division + grands nombres, 12 defis', rounds: 12, build: buildRoundsN5 },
];

function calcStars(score, total) {
  const pct = score / total;
  if (pct >= 0.83) return 3;
  if (pct >= 0.58) return 2;
  return 1;
}

export default function CodeurMathsPage() {
  const { progress, saveSession, resetTimer } = useGameSession('codeur-maths');

  const [phase, setPhase]       = useState('setup');
  const [levelNum, setLevelNum] = useState(progress.unlockedLevel);
  const [rounds, setRounds]     = useState([]);
  const [idx, setIdx]           = useState(0);
  const [score, setScore]       = useState(0);
  const [picked, setPicked]     = useState(null);
  const [shakeVal, setShakeVal] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const cfg = LEVEL_CONFIG[levelNum - 1];

  function startGame() {
    resetTimer();
    setRounds(cfg.build(cfg.rounds));
    setIdx(0);
    setScore(0);
    setPicked(null);
    setShakeVal(null);
    setLastResult(null);
    setPhase('play');
  }

  const handleChoice = useCallback((val) => {
    if (picked !== null) return;
    const round = rounds[idx];
    const correct = val === round.answer;
    setPicked(val);
    if (correct) {
      setScore(s => s + 1);
    } else {
      setShakeVal(val);
      setTimeout(() => setShakeVal(null), 500);
    }
    setTimeout(() => {
      setPicked(null);
      const nextIdx = idx + 1;
      if (nextIdx >= rounds.length) {
        const finalScore = correct ? score + 1 : score;
        const stars = calcStars(finalScore, rounds.length);
        const result = saveSession({ score: finalScore, level: levelNum, stars });
        setScore(finalScore);
        setLastResult(result);
        setPhase('results');
      } else {
        setIdx(nextIdx);
      }
    }, correct ? 700 : 1300);
  }, [picked, rounds, idx, score, levelNum, saveSession]);

  // ── Setup ──────────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="cm2-page" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #0d1117 60%, #001a0e 100%)' }}>
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, textAlign: 'center', margin: '16px 0 4px' }}>
          Codeur de Maths
        </h1>
        <p style={{ textAlign: 'center', opacity: .7, fontSize: '.9rem', marginBottom: 8 }}>
          Decouvre la valeur de chaque symbole
        </p>

        {progress.sessionsPlayed > 0 && (
          <div className="jeux-setup-stats">
            <div className="jeux-setup-stat">
              <span className="jeux-setup-stat__val">⭐ {progress.bestScore}</span>
              <span className="jeux-setup-stat__lbl">Meilleur score</span>
            </div>
            <div className="jeux-setup-stat">
              <span className="jeux-setup-stat__val">Niv.{progress.bestLevel}</span>
              <span className="jeux-setup-stat__lbl">Niveau atteint</span>
            </div>
            <div className="jeux-setup-stat">
              <span className="jeux-setup-stat__val">{progress.sessionsPlayed}</span>
              <span className="jeux-setup-stat__lbl">Parties</span>
            </div>
          </div>
        )}

        <div className="jeux-level-grid">
          {LEVEL_CONFIG.map(lv => {
            const locked = lv.n > progress.unlockedLevel;
            return (
              <button
                key={lv.n}
                className={`jeux-level-btn${levelNum === lv.n ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`}
                onPointerDown={e => { e.preventDefault(); if (!locked) setLevelNum(lv.n); }}
                disabled={locked}
              >
                <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>N{lv.n}</span>
                <span style={{ fontSize: '.72rem', opacity: .8, textAlign: 'center' }}>{lv.desc}</span>
                {locked && <span style={{ fontSize: '.7rem' }}>🔒</span>}
              </button>
            );
          })}
        </div>

        <button
          className="cm2-cta"
          style={{ marginTop: 16, background: 'linear-gradient(135deg, #00cc66, #00ff88)', color: '#000', fontWeight: 900 }}
          onPointerDown={e => { e.preventDefault(); startGame(); }}
        >
          Jouer !
        </button>
      </div>
    );
  }

  // ── Results ────────────────────────────────────────────────────────────────
  if (phase === 'results') {
    const stars = calcStars(score, rounds.length);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    return (
      <div className="cm2-page" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #0d1117 60%, #001a0e 100%)' }}>
        <h2 className="cm2-result-title">
          {stars === 3 ? '🎉 Genie des maths !' : stars === 2 ? '👍 Bien joue !' : '🔢 Continue !'}
        </h2>
        <div className="jeux-stars">{starStr}</div>
        {lastResult?.isNewBest && <div className="jeux-new-best">Nouveau record !</div>}
        {lastResult?.newUnlocked && (
          <div className="jeux-unlocked">Niveau {levelNum + 1} debloque !</div>
        )}
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {rounds.length}</span></div>
        <div className="jeux-result-stat"><span>Niveau</span><span>N{levelNum}</span></div>
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button className="cm2-cta" style={{ flex: 1 }} onPointerDown={e => { e.preventDefault(); startGame(); }}>
            Rejouer
          </button>
          <button className="cm2-cta" style={{ flex: 1, background: 'rgba(255,255,255,.12)' }}
            onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}
          >
            Niveaux
          </button>
        </div>
        <Link to="/jeux" className="cm2-back-link">← Retour aux jeux</Link>
      </div>
    );
  }

  // ── Play ───────────────────────────────────────────────────────────────────
  const round = rounds[idx];

  return (
    <div className="cm2-page" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #0d1117 60%, #001a0e 100%)' }}>
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="cm2-hud" style={{ fontFamily: 'monospace', color: '#00ff88' }}>
        <span className="cm2-progress" style={{ color: 'rgba(0,255,136,.7)' }}>[SCORE: {score}] [LVL: {levelNum}]</span>
        <span style={{ color: 'rgba(0,255,136,.4)', fontSize: '.8rem' }}>Defi {idx + 1}/{rounds.length}</span>
      </div>
      <div className="cm2-phase-label" style={{ color: 'rgba(0,255,136,.4)', fontFamily: 'monospace' }}>
        // DECODING SECTOR_{levelNum} — {round.label}
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
      <div className="cm2-equation-card" style={{ background: 'rgba(0,200,80,.06)', border: '1px solid rgba(0,200,80,.3)', borderRadius: 12, padding: 16, fontFamily: 'monospace' }}>
        {round.equations.map((eq, i) => (
          <div key={i} className="cm2-equation" style={{ color: '#00ff88', fontSize: '1.8rem', letterSpacing: 4, textShadow: '0 0 10px rgba(0,255,136,.5)' }}>{eq}</div>
        ))}
        <div className="cm2-question" style={{ color: '#00ff88', textShadow: '0 0 10px rgba(0,255,136,.5)' }}>{round.question}</div>
      </div>

      <div className="cm2-choices">
        {round.choices.map((val, ci) => {
          let cls = 'cm2-choice';
          if (picked !== null) {
            if (val === round.answer) cls += ' cm2-choice--correct';
            else if (picked === val) cls += ' cm2-choice--wrong';
          }
          if (shakeVal === val) cls += ' cm2-choice--shake';
          const isCorrectShown = picked !== null && val === round.answer;
          const isWrongShown = picked !== null && picked === val && val !== round.answer;
          return (
            <button
              key={ci}
              className={cls}
              style={!isCorrectShown && !isWrongShown ? { background: 'rgba(0,0,0,.6)', border: '1.5px solid #00cc66', color: '#00ff88', fontFamily: 'monospace', borderRadius: 8, padding: 12, fontSize: '1.2rem' } : undefined}
              onPointerDown={e => { e.preventDefault(); handleChoice(val); }}
              disabled={picked !== null}
            >
              {val}
            </button>
          );
        })}
      </div>
      </div>
    </div>
  );
}
