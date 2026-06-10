import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import { formatDuration } from '../../services/storage/gameProgressStore.js';
import { GameFeedback, useGameFeedback } from './GameFeedback.jsx';
import './jeux.css';

// ─── Pattern factories by level ───────────────────────────────────────────────
const PATTERN_POOLS = {
  1: [
    () => { const s=Math.floor(Math.random()*8)+1; return { seq:[s,s+1,s+2,s+3], answer:s+4, hint:'+1', type:'number' }; },
    () => { const s=Math.floor(Math.random()*6)+1; return { seq:[s,s+2,s+4,s+6], answer:s+8, hint:'+2', type:'number' }; },
    () => { const s=Math.floor(Math.random()*6)+6; return { seq:[s,s-1,s-2,s-3], answer:s-4, hint:'-1', type:'number' }; },
    () => { const s=(Math.floor(Math.random()*5)+1)*2; return { seq:[s,s+2,s+4,s+6], answer:s+8, hint:'Pairs +2', type:'number' }; },
    () => { const n=Math.floor(Math.random()*5)+2; return { seq:[n,n,n,n], answer:n, hint:'Meme nombre', type:'number' }; },
    () => { const sets=[['🐱','🐶','🐸'],['⭐','🌙','☀️'],['🍎','🍊','🍋']]; const s=sets[Math.floor(Math.random()*sets.length)]; return { seq:[s[0],s[1],s[2],s[0]], answer:s[1], hint:'Repete !', type:'emoji' }; },
  ],
  2: [
    () => { const s=Math.floor(Math.random()*6)+1; return { seq:[s,s+3,s+6,s+9], answer:s+12, hint:'+3', type:'number' }; },
    () => { const s=Math.floor(Math.random()*3)+1; return { seq:[s,s*2,s*4,s*8], answer:s*16, hint:'×2', type:'number' }; },
    () => { const s=(Math.floor(Math.random()*4)+1)*5; return { seq:[s,s+5,s+10,s+15], answer:s+20, hint:'+5', type:'number' }; },
    () => { const s=Math.floor(Math.random()*5)+1; return { seq:[s,s+2,s+4,s+6], answer:s+8, hint:'+2', type:'number' }; },
    () => { const n=(Math.floor(Math.random()*5)+1)*10; return { seq:[n,n-10,n-20,n-30], answer:n-40, hint:'-10', type:'number' }; },
    () => { const sets=[['🔴','🔵','🟢'],['🌞','🌛','🌟']]; const s=sets[Math.floor(Math.random()*sets.length)]; return { seq:[s[0],s[1],s[2],s[0]], answer:s[1], hint:'Repete !', type:'emoji' }; },
  ],
  3: [
    () => { const s=Math.floor(Math.random()*5)+1; const d=Math.floor(Math.random()*3)+2; return { seq:[s,s+d,s+2*d,s+3*d], answer:s+4*d, hint:`+${d}`, type:'number' }; },
    () => { const s=Math.floor(Math.random()*4)+2; return { seq:[s,s*2,s*4,s*8], answer:s*16, hint:'×2', type:'number' }; },
    () => { const s=Math.floor(Math.random()*10)+10; return { seq:[s,s-2,s-4,s-6], answer:s-8, hint:'-2', type:'number' }; },
    () => { const s=Math.floor(Math.random()*5)+1; return { seq:[s,s+1,s+3,s+4], answer:s+6, hint:'+1+2+1+2', type:'number' }; },
    () => { const a=['🔴','🔵']; return { seq:[a[0],a[1],a[0],a[1]], answer:a[0], hint:'Alterne !', type:'emoji' }; },
    () => { const emoji=['⭐','🌟','💫','✨','🌠']; return { seq:[emoji[0],emoji[1],emoji[2],emoji[3]], answer:emoji[4], hint:'Continue !', type:'emoji' }; },
  ],
  4: [
    () => { const s=Math.floor(Math.random()*5)+1; return { seq:[s,s+1,s+3,s+4], answer:s+6, hint:'+1 +2 +1 +2', type:'number' }; },
    () => { const s=Math.floor(Math.random()*10)+20; return { seq:[s,s-3,s-6,s-9], answer:s-12, hint:'-3', type:'number' }; },
    () => { const s=Math.floor(Math.random()*5)+1; return { seq:[s,s+4,s+8,s+12], answer:s+16, hint:'+4', type:'number' }; },
    () => { const a=Math.floor(Math.random()*3)+1,b=a; const c=a+b,d=b+c; return { seq:[a,b,c,d], answer:c+d, hint:'Fibonacci !', type:'number' }; },
    () => { const s=Math.floor(Math.random()*20)+20; return { seq:[s,s-4,s-8,s-12], answer:s-16, hint:'-4', type:'number' }; },
    () => { const emoji=['🌙','⭐','🌙','⭐']; return { seq:emoji, answer:'🌙', hint:'Alterne !', type:'emoji' }; },
  ],
  5: [
    () => { const a=Math.floor(Math.random()*3)+1,b=Math.floor(Math.random()*3)+1; const c=a+b,d=b+c; return { seq:[a,b,c,d], answer:c+d, hint:'Fibonacci !', type:'number' }; },
    () => { const s=Math.floor(Math.random()*2)+1; return { seq:[s,s*3,s*9,s*27], answer:s*81, hint:'×3', type:'number' }; },
    () => { const s=Math.floor(Math.random()*5)+2; return { seq:[s*s,(s+1)*(s+1),(s+2)*(s+2),(s+3)*(s+3)], answer:(s+4)*(s+4), hint:'Carres !', type:'number' }; },
    () => { const s=Math.floor(Math.random()*7)+1; return { seq:[s,s+7,s+14,s+21], answer:s+28, hint:'+7', type:'number' }; },
    () => { const s=Math.floor(Math.random()*5)+1; return { seq:[s,s+6,s+11,s+15], answer:s+18, hint:'+6+5+4...', type:'number' }; },
    () => { const s=Math.floor(Math.random()*3)+1; return { seq:[s*1,s*2,s*4,s*7], answer:s*11, hint:'+1+2+3+4...', type:'number' }; },
  ],
};

// hints:true  → guide is free (no point penalty)
// hints:false → guide costs -2 pts (harder levels)
const LEVEL_CONFIG = [
  { id:1,  label:'N1',  n:6,  poolLvl:[1],   hints:true  },
  { id:2,  label:'N2',  n:6,  poolLvl:[1],   hints:true  },
  { id:3,  label:'N3',  n:8,  poolLvl:[1,2], hints:true  },
  { id:4,  label:'N4',  n:8,  poolLvl:[1,2], hints:true  },
  { id:5,  label:'N5',  n:8,  poolLvl:[2],   hints:true  },
  { id:6,  label:'N6',  n:10, poolLvl:[2],   hints:false },
  { id:7,  label:'N7',  n:10, poolLvl:[2,3], hints:false },
  { id:8,  label:'N8',  n:10, poolLvl:[2,3], hints:false },
  { id:9,  label:'N9',  n:10, poolLvl:[3],   hints:false },
  { id:10, label:'N10', n:12, poolLvl:[3],   hints:false },
  { id:11, label:'N11', n:12, poolLvl:[3,4], hints:false },
  { id:12, label:'N12', n:12, poolLvl:[4],   hints:false },
  { id:13, label:'N13', n:15, poolLvl:[4,5], hints:false },
  { id:14, label:'N14', n:15, poolLvl:[4,5], hints:false },
  { id:15, label:'N15', n:15, poolLvl:[5],   hints:false },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeRound(levelCfg) {
  // Collect factories from all pool levels
  const factories = levelCfg.poolLvl.flatMap(lvl => PATTERN_POOLS[lvl] || []);
  const factory = factories[Math.floor(Math.random() * factories.length)];
  const { seq, answer, hint, type } = factory();
  const wrongs = new Set();
  if (type === 'number') {
    let attempts = 0;
    while (wrongs.size < 2 && attempts < 60) {
      attempts++;
      const delta = Math.floor(Math.random() * 6) + 1;
      const sign = Math.random() < 0.5 ? 1 : -1;
      const w = typeof answer === 'number' ? answer + sign * delta : null;
      if (w !== null && w !== answer && w > 0) wrongs.add(w);
    }
    if (wrongs.size < 2) { wrongs.add(answer + 1); wrongs.add(answer + 2); }
  } else {
    const pool2 = ['🌈','🦄','🎸','🏆','🍕','🚀','🐙','🦁','🎯','🔥'];
    while (wrongs.size < 2) {
      const w = pool2[Math.floor(Math.random() * pool2.length)];
      if (w !== answer) wrongs.add(w);
    }
  }
  return { seq, answer, choices: shuffle([answer, ...[...wrongs]]), hint };
}

const CHOICE_COLORS = ['#6366f1', '#ec4899', '#06b6d4'];

/* ── Visual hint guide ────────────────────────────────────────────────── */
const HINT_EXPLANATIONS = {
  '+1':       { label: 'On ajoute 1 à chaque fois',      color: '#6366f1', icon: '➕' },
  '+2':       { label: 'On ajoute 2 à chaque fois',      color: '#6366f1', icon: '➕' },
  '+3':       { label: 'On ajoute 3 à chaque fois',      color: '#6366f1', icon: '➕' },
  '+4':       { label: 'On ajoute 4 à chaque fois',      color: '#6366f1', icon: '➕' },
  '+5':       { label: 'On ajoute 5 à chaque fois',      color: '#6366f1', icon: '➕' },
  '+6':       { label: 'On ajoute 6 à chaque fois',      color: '#6366f1', icon: '➕' },
  '+7':       { label: 'On ajoute 7 à chaque fois',      color: '#6366f1', icon: '➕' },
  '-1':       { label: 'On enlève 1 à chaque fois',      color: '#f43f5e', icon: '➖' },
  '-2':       { label: 'On enlève 2 à chaque fois',      color: '#f43f5e', icon: '➖' },
  '-3':       { label: 'On enlève 3 à chaque fois',      color: '#f43f5e', icon: '➖' },
  '-4':       { label: 'On enlève 4 à chaque fois',      color: '#f43f5e', icon: '➖' },
  '-10':      { label: 'On enlève 10 à chaque fois',     color: '#f43f5e', icon: '➖' },
  '×2':       { label: 'On multiplie par 2 à chaque fois', color: '#f59e0b', icon: '✖️' },
  '×3':       { label: 'On multiplie par 3 à chaque fois', color: '#f59e0b', icon: '✖️' },
  'Pairs +2': { label: 'Ce sont des nombres pairs (0,2,4…)', color: '#10b981', icon: '🔢' },
  'Fibonacci !': { label: 'Chaque nombre = les 2 précédents additionnés !', color: '#8b5cf6', icon: '🌀' },
  'Carres !': { label: 'Ce sont des carrés parfaits : 2²=4, 3²=9…',        color: '#8b5cf6', icon: '⬜' },
  '+1 +2 +1 +2':   { label: 'On alterne : +1, puis +2, puis +1, puis +2…', color: '#06b6d4', icon: '🔄' },
  '+1+2+1+2':      { label: 'On alterne : +1, puis +2, puis +1, puis +2…', color: '#06b6d4', icon: '🔄' },
  '+6+5+4...':     { label: 'L\'écart diminue de 1 à chaque fois',          color: '#ec4899', icon: '📉' },
  '+1+2+3+4...':   { label: 'L\'écart augmente de 1 à chaque fois',         color: '#ec4899', icon: '📈' },
  'Alterne !':     { label: 'Les éléments se répètent en alternant',        color: '#06b6d4', icon: '🔄' },
  'Repete !':      { label: 'Le motif se répète régulièrement',             color: '#06b6d4', icon: '🔁' },
  'Continue !':    { label: 'Continue dans le même ordre',                  color: '#10b981', icon: '▶️' },
  'Meme nombre':   { label: 'Tous les nombres sont identiques',             color: '#10b981', icon: '🟰' },
};

function SequenceGuide({ seq, hint }) {
  const meta = HINT_EXPLANATIONS[hint] || { label: `Indice : ${hint}`, color: '#6366f1', icon: '💡' };
  const isNumeric = seq.every(v => typeof v === 'number');

  // compute differences between consecutive numbers
  const diffs = isNumeric
    ? seq.slice(1).map((v, i) => v - seq[i])
    : [];

  return (
    <div className="sl-guide">
      <div className="sl-guide__header" style={{ '--g-color': meta.color }}>
        <span className="sl-guide__icon">{meta.icon}</span>
        <span className="sl-guide__label">{meta.label}</span>
      </div>

      {isNumeric && diffs.length > 0 && (
        <div className="sl-guide__steps">
          {seq.map((v, i) => (
            <div key={i} className="sl-guide__step">
              <span className="sl-guide__num" style={{ background: `${meta.color}22`, borderColor: meta.color }}>
                {v}
              </span>
              {i < diffs.length && (
                <span className="sl-guide__arrow" style={{ color: meta.color }}>
                  <span className="sl-guide__diff">{diffs[i] > 0 ? `+${diffs[i]}` : diffs[i]}</span>
                  →
                </span>
              )}
            </div>
          ))}
          <div className="sl-guide__step">
            <span className="sl-guide__num sl-guide__num--unknown" style={{ borderColor: meta.color }}>?</span>
          </div>
        </div>
      )}

      {!isNumeric && (
        <div className="sl-guide__emoji-row">
          {seq.map((v, i) => (
            <span key={i} className="sl-guide__emoji-item">{v}</span>
          ))}
          <span className="sl-guide__emoji-item sl-guide__emoji-item--q">?</span>
        </div>
      )}
    </div>
  );
}

export default function SuiteLogiquePage() {
  const { progress, saveSession, resetTimer, elapsedSecs } = useGameSession('suite-logique');
  const { feedbackRef, triggerCorrect, triggerWrong, triggerScore } = useGameFeedback();

  const [phase, setPhase]         = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(Math.min(progress.unlockedLevel, 15));
  const [round, setRound]         = useState(null);
  const [roundNum, setRoundNum]   = useState(0);
  const [score, setScore]         = useState(0);
  const [feedback, setFeedback]   = useState(null);
  const [showHint, setShowHint]   = useState(false);
  const [sessionResult, setSessionResult] = useState(null);

  const cfg = LEVEL_CONFIG[selectedLevel - 1];

  function startGame() {
    const c = LEVEL_CONFIG[selectedLevel - 1];
    setScore(0); setRoundNum(0); setFeedback(null); setShowHint(false); setSessionResult(null);
    resetTimer();
    setRound(makeRound(c));
    setPhase('play');
  }

  function handleAnswer(val) {
    if (feedback !== null) return;
    const c = LEVEL_CONFIG[selectedLevel - 1];
    const correct = val === round.answer || String(val) === String(round.answer);
    setFeedback(correct ? 'ok' : 'bad');
    let newScore = score;
    if (correct) {
      const pts = showHint ? (cfg.hints ? 1 : 0) : 2;
      newScore = score + pts;
      setScore(newScore);
      triggerCorrect();
      triggerScore(`+${pts}`);
    } else {
      triggerWrong();
    }
    setTimeout(() => {
      const next = roundNum + 1;
      if (next >= c.n) {
        const stars = newScore >= c.n * 1.8 ? 3 : newScore >= c.n * 1.2 ? 2 : 1;
        const secs = elapsedSecs();
        const result = saveSession({ score: newScore, level: selectedLevel, stars });
        setSessionResult({ ...result, timeSecs: secs, stars });
        setPhase('results');
        return;
      }
      setRoundNum(next);
      setRound(makeRound(c));
      setFeedback(null);
      setShowHint(false);
    }, 900);
  }

  if (phase === 'setup') {
    return (
      <div className="sl-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="sl-title">🔢 Suite Logique</h1>
        <p className="sl-subtitle">Trouve le prochain element de la suite !</p>

        <div className="jeux-setup-stats">
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{progress.bestScore || 0}</span>
            <span className="jeux-setup-stat__lbl">Meilleur score</span>
          </div>
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{progress.sessionsPlayed || 0}</span>
            <span className="jeux-setup-stat__lbl">Parties</span>
          </div>
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{formatDuration(progress.totalTimeSecs || 0)}</span>
            <span className="jeux-setup-stat__lbl">Temps total</span>
          </div>
        </div>

        <div className="jeux-level-grid">
          {LEVEL_CONFIG.map(lc => {
            const locked = lc.id > progress.unlockedLevel;
            return (
              <button
                key={lc.id}
                className={`jeux-level-btn${selectedLevel === lc.id ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`}
                onPointerDown={e => { e.preventDefault(); if (!locked) setSelectedLevel(lc.id); }}
              >
                {locked ? '🔒' : lc.label}
                {!locked && progress.bestLevel >= lc.id && <span className="jeux-level-stars">★</span>}
              </button>
            );
          })}
        </div>

        <div className="an-info-row">
          <span>📝 {cfg.n} suites</span>
          {cfg.hints && <span>💡 Indices disponibles</span>}
        </div>

        <div className="sl-demo">
          <span>2</span><span>4</span><span>6</span><span>8</span>
          <span className="sl-demo-q">?</span>
        </div>
        <button className="sl-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>▶ Jouer</button>
      </div>
    );
  }

  if (phase === 'results') {
    const c = LEVEL_CONFIG[selectedLevel - 1];
    const stars = score >= c.n * 1.8 ? 3 : score >= c.n * 1.2 ? 2 : 1;
    const emoji = stars === 3 ? '🏆' : stars === 2 ? '🎉' : '📚';
    const title = stars === 3 ? 'Genial !' : stars === 2 ? 'Bien !' : 'Continue !';
    return (
      <div className="sl-page">
        <GameFeedback ref={feedbackRef} />
        <div className="game-results">
          <div className="game-results__emoji">{emoji}</div>
          <div className="game-results__title">{title}</div>
          <div className="game-results__stars">{'★'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
          {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
          {sessionResult?.newUnlocked && <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} debloque !</div>}
          <div className="game-results__stats">
            <div className="game-results__stat">
              <span className="game-results__stat-val">{score}</span>
              <span className="game-results__stat-lbl">Score</span>
            </div>
            <div className="game-results__stat">
              <span className="game-results__stat-val">{c.n}</span>
              <span className="game-results__stat-lbl">Suites</span>
            </div>
            {sessionResult && (
              <div className="game-results__stat">
                <span className="game-results__stat-val">{sessionResult.timeSecs}s</span>
                <span className="game-results__stat-lbl">Temps</span>
              </div>
            )}
          </div>
          <button className="game-results__btn" onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <button className="game-results__btn game-results__btn--soft" onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}>Niveaux</button>
          <Link to="/jeux" className="game-results__btn game-results__btn--soft" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>← Jeux</Link>
        </div>
      </div>
    );
  }

  const c = LEVEL_CONFIG[selectedLevel - 1];
  return (
    <div className={`sl-page${feedback === 'ok' ? ' sl-flash-ok' : feedback === 'bad' ? ' sl-flash-bad' : ''}`}>
      <GameFeedback ref={feedbackRef} />
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="sl-hud game-hud">
        <span className="sl-score game-hud__score">⭐ {score}</span>
        <span className="sl-round game-hud__round">{roundNum + 1} / {c.n}</span>
      </div>

      <div className="sl-sequence game-question-card">
        {round?.seq.map((item, i) => (
          <div key={i} className="sl-seq-item">{item}</div>
        ))}
        <div className="sl-seq-item sl-seq-item--blank">?</div>
      </div>

      {showHint && round && <SequenceGuide seq={round.seq} hint={round.hint} />}
      {!showHint && (
        <button className="sl-hint-btn" onPointerDown={e => { e.preventDefault(); setShowHint(true); }}>
          💡 Voir le guide {cfg.hints ? <span className="sl-hint-cost">−1 pt</span> : null}
        </button>
      )}

      <div className="sl-choices">
        {round?.choices.map((choice, i) => (
          <button
            key={i}
            className="sl-choice game-btn"
            style={{ '--btn-color': CHOICE_COLORS[i % CHOICE_COLORS.length] }}
            onPointerDown={e => { e.preventDefault(); handleAnswer(choice); }}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
