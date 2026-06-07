import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import { formatDuration } from '../../services/storage/gameProgressStore.js';
import './jeux.css';

// Patterns by level
const PATTERN_POOLS = [
  // Niveau 1: simple +1, +2, numbers 1-20
  [
    () => { const s = Math.floor(Math.random()*10)+1; const seq = [s,s+1,s+2,s+3]; return { seq, answer: s+4, hint: '+1', type: 'number' }; },
    () => { const s = Math.floor(Math.random()*8)+1; const seq = [s,s+2,s+4,s+6]; return { seq, answer: s+8, hint: '+2', type: 'number' }; },
    () => { const s = Math.floor(Math.random()*6)+2; const seq = [s,s-1,s-2,s-3]; return { seq, answer: s-4, hint: '-1', type: 'number' }; },
    () => { const s = (Math.floor(Math.random()*5)+1)*2; const seq = [s,s+2,s+4,s+6]; return { seq, answer: s+8, hint: 'Pairs +2', type: 'number' }; },
    () => { const sets = [['🐱','🐶','🐸'],['⭐','🌙','☀️'],['🍎','🍊','🍋']]; const s = sets[Math.floor(Math.random()*sets.length)]; const seq = [s[0],s[1],s[2],s[0]]; return { seq, answer: s[1], hint: 'Répète !', type: 'emoji' }; },
  ],
  // Niveau 2: +2, +3, ×2
  [
    () => { const s = Math.floor(Math.random()*6)+1; const seq = [s,s+3,s+6,s+9]; return { seq, answer: s+12, hint: '+3', type: 'number' }; },
    () => { const s = Math.floor(Math.random()*3)+1; const seq = [s,s*2,s*4,s*8]; return { seq, answer: s*16, hint: '×2', type: 'number' }; },
    () => { const s = Math.floor(Math.random()*4)+1; const seq = [s,s+2,s+4,s+6]; return { seq, answer: s+8, hint: '+2', type: 'number' }; },
    () => { const s = (Math.floor(Math.random()*4)+1)*5; const seq = [s,s+5,s+10,s+15]; return { seq, answer: s+20, hint: '+5', type: 'number' }; },
    () => { const sets = [['🔴','🔵','🟢'],['🌞','🌛','🌟'],['🐱','🐶','🐰','🐱']]; const s = sets[Math.floor(Math.random()*sets.length)]; const seq = [s[0],s[1],s[2],s[0]]; return { seq, answer: s[1], hint: 'Répète !', type: 'emoji' }; },
  ],
  // Niveau 3: mixed arithmetic + emoji alternating
  [
    () => { const s = Math.floor(Math.random()*5)+1; const d = Math.floor(Math.random()*3)+2; const seq = [s,s+d,s+2*d,s+3*d]; return { seq, answer: s+4*d, hint: `+${d}`, type: 'number' }; },
    () => { const s = Math.floor(Math.random()*4)+2; const seq = [s,s*2,s*4,s*8]; return { seq, answer: s*16, hint: '×2', type: 'number' }; },
    () => { const emoji = ['⭐','🌟','💫','✨','🌠']; const seq = [emoji[0],emoji[1],emoji[2],emoji[3]]; return { seq, answer: emoji[4], hint: 'Continue !', type: 'emoji' }; },
    () => { const a = ['🔴','🔵'], b = [1,2,1,2]; const seq = [a[0],a[1],a[0],a[1]]; return { seq, answer: a[0], hint: 'Alterne !', type: 'emoji' }; },
    () => { const s = Math.floor(Math.random()*5)+1; const seq = [s,s+1,s+3,s+4]; return { seq, answer: s+6, hint: '+1+2+1+2', type: 'number' }; },
    () => { const s = Math.floor(Math.random()*10)+10; const seq = [s,s-2,s-4,s-6]; return { seq, answer: s-8, hint: '-2', type: 'number' }; },
  ],
  // Niveau 4: two-step +1+2, decreasing, alternating
  [
    () => { const s = Math.floor(Math.random()*5)+1; const seq = [s,s+1,s+3,s+4]; return { seq, answer: s+6, hint: '+1 +2 +1 +2', type: 'number' }; },
    () => { const s = Math.floor(Math.random()*10)+15; const seq = [s,s-3,s-6,s-9]; return { seq, answer: s-12, hint: '-3', type: 'number' }; },
    () => { const s = Math.floor(Math.random()*5)+1; const seq = [s,s+4,s+8,s+12]; return { seq, answer: s+16, hint: '+4', type: 'number' }; },
    () => { const s = Math.floor(Math.random()*3)+1; const seq = [s,s+2,s+6,s+14]; return { seq, answer: s+30, hint: '×2+...', type: 'number' }; },
    () => { const s = Math.floor(Math.random()*20)+20; const seq = [s,s-4,s-8,s-12]; return { seq, answer: s-16, hint: '-4', type: 'number' }; },
    () => { const emoji = ['🌙','⭐','🌙','⭐']; return { seq: emoji, answer: '🌙', hint: 'Alterne !', type: 'emoji' }; },
  ],
  // Niveau 5: Fibonacci-like, skip 7, geometry
  [
    () => { const a = Math.floor(Math.random()*3)+1, b = Math.floor(Math.random()*3)+1; const c=a+b,d=b+c; const seq=[a,b,c,d]; return { seq, answer: c+d, hint: 'Fibonacci !', type: 'number' }; },
    () => { const s = Math.floor(Math.random()*7)+1; const seq=[s,s+7,s+14,s+21]; return { seq, answer: s+28, hint: '+7', type: 'number' }; },
    () => { const s = Math.floor(Math.random()*2)+1; const seq=[s,s*3,s*9,s*27]; return { seq, answer: s*81, hint: '×3', type: 'number' }; },
    () => { const s = Math.floor(Math.random()*5)+2; const seq=[s*s,(s+1)*(s+1),(s+2)*(s+2),(s+3)*(s+3)]; return { seq, answer: (s+4)*(s+4), hint: 'Carrés !', type: 'number' }; },
    () => { const s = Math.floor(Math.random()*3)+1; const seq=[s,s+6,s+11,s+15]; return { seq, answer: s+18, hint: '+6+5+4...', type: 'number' }; },
    () => { const s = Math.floor(Math.random()*5)+1; const seq=[s,s+8,s+15,s+21]; return { seq, answer: s+26, hint: '+8+7+6...', type: 'number' }; },
  ],
];

const ROUNDS = 10;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeRound(levelIdx) {
  const pool = PATTERN_POOLS[levelIdx];
  const factory = pool[Math.floor(Math.random() * pool.length)];
  const { seq, answer, hint, type } = factory();
  const wrongs = new Set();
  if (type === 'number') {
    while (wrongs.size < 2) {
      const delta = Math.floor(Math.random() * 6) + 1;
      const sign = Math.random() < 0.5 ? 1 : -1;
      const w = answer + sign * delta;
      if (w !== answer && w > 0 && !wrongs.has(w)) wrongs.add(w);
    }
  } else {
    const pool2 = ['🌈','🦄','🎸','🏆','🍕','🚀','🐙','🦁','🎯','🔥'];
    while (wrongs.size < 2) {
      const w = pool2[Math.floor(Math.random() * pool2.length)];
      if (w !== answer && !wrongs.has(w)) wrongs.add(w);
    }
  }
  return { seq, answer, choices: shuffle([answer, ...[...wrongs]]), hint };
}

export default function SuiteLogiquePage() {
  const { progress, saveSession, resetTimer, elapsedSecs } = useGameSession('suite-logique');

  const [phase, setPhase]         = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(Math.min(progress.unlockedLevel, 5));
  const [round, setRound]         = useState(null);
  const [roundNum, setRoundNum]   = useState(0);
  const [score, setScore]         = useState(0);
  const [feedback, setFeedback]   = useState(null);
  const [showHint, setShowHint]   = useState(false);
  const [sessionResult, setSessionResult] = useState(null);

  function startGame() {
    setScore(0); setRoundNum(0); setFeedback(null); setShowHint(false); setSessionResult(null);
    resetTimer();
    setRound(makeRound(selectedLevel - 1));
    setPhase('play');
  }

  function handleAnswer(val) {
    if (feedback !== null) return;
    const correct = val === round.answer || String(val) === String(round.answer);
    setFeedback(correct ? 'ok' : 'bad');
    let newScore = score;
    if (correct) {
      newScore = score + (showHint ? 1 : 2);
      setScore(newScore);
    }
    setTimeout(() => {
      const next = roundNum + 1;
      if (next >= ROUNDS) {
        const stars = newScore >= ROUNDS * 1.8 ? 3 : newScore >= ROUNDS * 1.2 ? 2 : 1;
        const secs = elapsedSecs();
        const result = saveSession({ score: newScore, level: selectedLevel, stars });
        setSessionResult({ ...result, timeSecs: secs, stars });
        setPhase('results');
        return;
      }
      setRoundNum(next);
      setRound(makeRound(selectedLevel - 1));
      setFeedback(null);
      setShowHint(false);
    }, 900);
  }

  if (phase === 'setup') {
    return (
      <div className="sl-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="sl-title">🔢 Suite Logique</h1>
        <p className="sl-subtitle">Trouve le prochain élément de la suite !</p>

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
          {[1, 2, 3, 4, 5].map(lvl => {
            const locked = lvl > progress.unlockedLevel;
            return (
              <button
                key={lvl}
                className={`jeux-level-btn${selectedLevel === lvl ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`}
                onPointerDown={e => { e.preventDefault(); if (!locked) setSelectedLevel(lvl); }}
              >
                {locked ? '🔒' : `Niveau ${lvl}`}
                {!locked && progress.bestLevel >= lvl && <span className="jeux-level-stars">★</span>}
              </button>
            );
          })}
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
    const stars = score >= ROUNDS * 1.8 ? 3 : score >= ROUNDS * 1.2 ? 2 : 1;
    return (
      <div className="sl-page">
        <h2 className="sl-result-title">{stars === 3 ? '🎉 Génial !' : stars === 2 ? '👍 Bien !' : '📚 Continue !'}</h2>
        <div className="jeux-stars">{'★'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
        {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
        {sessionResult?.newUnlocked && <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} débloqué !</div>}
        {sessionResult && <div className="jeux-session-time">⏱ {sessionResult.timeSecs}s</div>}
        <div className="jeux-result-stat"><span>Score</span><span>{score} pts</span></div>
        <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
          <button className="sl-cta" style={{ flex: 1 }} onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <button className="sl-cta sl-cta--soft" style={{ flex: 1 }} onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}>Niveaux</button>
        </div>
        <Link to="/jeux" className="sl-cta sl-cta--soft" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: 12 }}>← Jeux</Link>
      </div>
    );
  }

  return (
    <div className={`sl-page${feedback === 'ok' ? ' sl-flash-ok' : feedback === 'bad' ? ' sl-flash-bad' : ''}`}>
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="sl-hud">
        <span className="sl-score">⭐ {score}</span>
        <span className="sl-round">{roundNum + 1} / {ROUNDS}</span>
      </div>

      <div className="sl-sequence">
        {round?.seq.map((item, i) => (
          <div key={i} className="sl-seq-item">{item}</div>
        ))}
        <div className="sl-seq-item sl-seq-item--blank">?</div>
      </div>

      {showHint && <p className="sl-hint">Indice : {round?.hint}</p>}
      {!showHint && (
        <button className="sl-hint-btn" onPointerDown={e => { e.preventDefault(); setShowHint(true); }}>
          💡 Indice (-1 pt)
        </button>
      )}

      <div className="sl-choices">
        {round?.choices.map((choice, i) => (
          <button
            key={i}
            className="sl-choice"
            onPointerDown={e => { e.preventDefault(); handleAnswer(choice); }}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
