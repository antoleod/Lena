import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import { formatDuration } from '../../services/storage/gameProgressStore.js';
import { GameFeedback, useGameFeedback } from './GameFeedback.jsx';
import './jeux.css';

// ── Monsters per level ───────────────────────────────────────────────────────
const MONSTERS_BY_LEVEL = [
  [ // Level 1 – CP
    { name: 'Globlin',   emoji: '👾', hp: 3, attack: 1, reward: '🗡️' },
    { name: 'Slime',     emoji: '🟢', hp: 4, attack: 1, reward: '🛡️' },
    { name: 'Fantôme',   emoji: '👻', hp: 5, attack: 1, reward: '⭐' },
  ],
  [ // Level 2 – CE1
    { name: 'Gobelin',   emoji: '🧌', hp: 5, attack: 1, reward: '🗡️' },
    { name: 'Zombie',    emoji: '🧟', hp: 6, attack: 2, reward: '🛡️' },
    { name: 'Vampire',   emoji: '🧛', hp: 7, attack: 2, reward: '⭐' },
  ],
  [ // Level 3 – CE2
    { name: 'Ogre',      emoji: '👹', hp: 7, attack: 2, reward: '🗡️' },
    { name: 'Sorcière',  emoji: '🧙', hp: 8, attack: 2, reward: '🛡️' },
    { name: 'Démon',     emoji: '😈', hp: 9, attack: 3, reward: '⭐' },
  ],
  [ // Level 4 – CM1
    { name: 'Troll',     emoji: '👺', hp: 9,  attack: 3, reward: '🗡️' },
    { name: 'Cyclope',   emoji: '🫏', hp: 11, attack: 3, reward: '🛡️' },
    { name: 'Dragon',    emoji: '🐲', hp: 12, attack: 4, reward: '⭐' },
  ],
  [ // Level 5 – CM2
    { name: 'Roi Sombre', emoji: '🦹', hp: 12, attack: 4, reward: '🗡️' },
    { name: 'Titan',      emoji: '🗿', hp: 15, attack: 4, reward: '🛡️' },
    { name: 'Léviathan',  emoji: '🐉', hp: 18, attack: 5, reward: '⭐' },
  ],
];

const LEVEL_OPS = [
  { ops: ['+'],              max: 10, label: 'Niveau 1 — CP',  sub: 'Additions simples' },
  { ops: ['+', '-'],         max: 20, label: 'Niveau 2 — CE1', sub: 'Additions & soustractions' },
  { ops: ['+', '-', '×'],    max: 30, label: 'Niveau 3 — CE2', sub: 'Opérations variées' },
  { ops: ['×', '÷'],         max: 10, label: 'Niveau 4 — CM1', sub: 'Multiplications & divisions' },
  { ops: ['+','-','×','÷'],  max: 12, label: 'Niveau 5 — CM2', sub: 'Tout en vitesse !' },
];

const ALL_OPS = ['+', '-', '×', '÷'];
const OP_LABELS = { '+': '+', '-': '−', '×': '×', '÷': '÷' };
const PLAYER_MAX_HP = 10;

const SCENES_BY_LEVEL = [
  ['🌲 Dans la forêt des ombres…', '🏕️ Au camp des aventuriers…', '🌙 Sous la lune de minuit…', '🌫️ Dans le brouillard mystérieux…', '🗺️ Sur la carte au trésor…'],
  ['🏰 Aux portes du donjon…', '🌋 Au pied du volcan maudit…', '⚔️ Dans la salle du conseil…', '🌑 En pleine éclipse noire…', '🕸️ Dans les tunnels obscurs…'],
  ['🔥 Dans la grotte du feu…', '💀 Dans le cimetière hanté…', '🌊 Sur les récifs maudits…', '🌪️ Dans le vortex magique…', '🏚️ Dans la citadelle en ruines…'],
  ['🐉 Dans l\'antre du dragon…', '⚡ Dans la tour de la foudre…', '🌑 Dans le néant cosmique…', '🗡️ Dans l\'arène des champions…', '🧿 Devant le miroir du destin…'],
  ['👁️ Face à l\'œil du chaos…', '🌌 Dans les étoiles maudites…', '🔮 Dans la salle du trône…', '🌑 À l\'heure de la grande bataille…', '🏆 Pour la gloire éternelle…'],
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeQuestion(ops, max) {
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;
  if (op === '+') {
    a = Math.floor(Math.random() * max) + 1;
    b = Math.floor(Math.random() * max) + 1;
    answer = a + b;
  } else if (op === '-') {
    a = Math.floor(Math.random() * max) + 2;
    b = Math.floor(Math.random() * (a - 1)) + 1;
    answer = a - b;
  } else if (op === '×') {
    a = Math.floor(Math.random() * 9) + 2;
    b = Math.floor(Math.random() * 9) + 2;
    answer = a * b;
  } else {
    b = Math.floor(Math.random() * 9) + 2;
    answer = Math.floor(Math.random() * 9) + 2;
    a = b * answer;
  }
  const wrongs = new Set();
  while (wrongs.size < 3) {
    const w = answer + (Math.floor(Math.random() * 9) - 4);
    if (w !== answer && w > 0) wrongs.add(w);
  }
  return { text: `${a} ${op} ${b} = ?`, answer, choices: shuffle([answer, ...[...wrongs]]) };
}

export default function BatailleMonstresPage() {
  const { progress, saveSession, resetTimer, elapsedSecs } = useGameSession('bataille-monstres');
  const { feedbackRef, triggerCorrect, triggerWrong, triggerScore, triggerCombo } = useGameFeedback();

  const [phase, setPhase] = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(Math.min(progress.unlockedLevel ?? 1, 5));
  const [selectedOps, setSelectedOps] = useState(['+', '-', '×', '÷']);
  const selectedOpsRef = useRef(selectedOps);
  useEffect(() => { selectedOpsRef.current = selectedOps; }, [selectedOps]);

  function toggleOp(op) {
    setSelectedOps(prev => {
      if (prev.includes(op)) {
        if (prev.length === 1) return prev;
        return prev.filter(o => o !== op);
      }
      return [...prev, op];
    });
  }
  const [monsterIdx, setMonsterIdx] = useState(0);
  const [monsterHp, setMonsterHp] = useState(0);
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
  const [question, setQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [sessionResult, setSessionResult] = useState(null);
  const [attackAnim, setAttackAnim] = useState(null); // 'player' | 'monster' | null
  const [hitAnim, setHitAnim] = useState(null);       // 'player' | 'monster' | null
  const [locked, setLocked] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [feedbackText, setFeedbackText] = useState(null);

  const levelCfg = LEVEL_OPS[selectedLevel - 1];
  const monsters = MONSTERS_BY_LEVEL[selectedLevel - 1];

  function startGame() {
    setScore(0); setStreak(0); setMonsterIdx(0);
    setPlayerHp(PLAYER_MAX_HP);
    setMonsterHp(monsters[0].hp);
    setRewards([]);
    setSessionResult(null);
    setLocked(false);
    setFeedbackText(null);
    const scenes = SCENES_BY_LEVEL[selectedLevel - 1];
    setSceneIdx(Math.floor(Math.random() * scenes.length));
    resetTimer();
    setQuestion(makeQuestion(selectedOpsRef.current, levelCfg.max));
    setPhase('play');
  }

  function handleAnswer(val) {
    if (locked) return;
    setLocked(true);
    const correct = val === question.answer;

    if (correct) {
      const bonus = streak >= 2 ? 2 : 1;
      const newScore = score + bonus;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      triggerCorrect();
      triggerScore(`+${bonus * 10}`);
      if (newStreak >= 3) triggerCombo(newStreak);
      const txt = newStreak >= 3 ? `Combo ×${newStreak} ! 🔥` : newStreak === 2 ? 'Parfait ! ⚡' : `+${bonus * 10} XP · Bien joué !`;
      setFeedbackText(txt);
      setTimeout(() => setFeedbackText(null), 1000);
      const scenes = SCENES_BY_LEVEL[selectedLevel - 1];
      setSceneIdx(Math.floor(Math.random() * scenes.length));

      setAttackAnim('player');
      setTimeout(() => {
        setAttackAnim(null);
        setHitAnim('monster');
        const newHp = monsterHp - 1;
        setMonsterHp(newHp);
        setTimeout(() => {
          setHitAnim(null);
          if (newHp <= 0) {
            // Monster defeated
            const newRewards = [...rewards, monsters[monsterIdx].reward];
            setRewards(newRewards);
            const nextIdx = monsterIdx + 1;
            if (nextIdx >= monsters.length) {
              // All monsters defeated → victory
              const secs = elapsedSecs();
              const result = saveSession({ score: newScore, level: selectedLevel, stars: 3 });
              setSessionResult({ ...result, timeSecs: secs, stars: 3, victory: true });
              setPhase('results');
            } else {
              setMonsterIdx(nextIdx);
              setMonsterHp(monsters[nextIdx].hp);
              setQuestion(makeQuestion(selectedOpsRef.current, levelCfg.max));
              setLocked(false);
            }
          } else {
            setQuestion(makeQuestion(selectedOpsRef.current, levelCfg.max));
            setLocked(false);
          }
        }, 300);
      }, 400);
    } else {
      setStreak(0);
      triggerWrong();
      const monster = monsters[monsterIdx];
      setAttackAnim('monster');
      setTimeout(() => {
        setAttackAnim(null);
        setHitAnim('player');
        const newPlayerHp = playerHp - monster.attack;
        setPlayerHp(newPlayerHp);
        setTimeout(() => {
          setHitAnim(null);
          if (newPlayerHp <= 0) {
            // Game over
            const secs = elapsedSecs();
            const stars = score >= 10 ? 2 : 1;
            const result = saveSession({ score, level: selectedLevel, stars });
            setSessionResult({ ...result, timeSecs: secs, stars, victory: false });
            setPhase('results');
          } else {
            setQuestion(makeQuestion(selectedOpsRef.current, levelCfg.max));
            setLocked(false);
          }
        }, 300);
      }, 400);
    }
  }

  if (phase === 'setup') {
    return (
      <div className="bm2-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="bm2-title">⚔️ Bataille de Monstres</h1>
        <p className="bm2-subtitle">Réponds aux calculs pour attaquer !</p>

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
          {LEVEL_OPS.map((l, i) => {
            const lvl = i + 1;
            const locked = lvl > (progress.unlockedLevel ?? 1);
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
        <p style={{ textAlign: 'center', opacity: .65, fontSize: '.82rem', color: '#fff', marginBottom: 12 }}>
          {levelCfg.label} — {levelCfg.sub}
        </p>

        <div className="jeux-ops-label">Opérations :</div>
        <div className="jeux-ops-grid">
          {ALL_OPS.map(op => (
            <button
              key={op}
              className={`jeux-ops-btn${selectedOps.includes(op) ? ' is-on' : ''}`}
              onPointerDown={() => toggleOp(op)}
            >
              {OP_LABELS[op]}
            </button>
          ))}
        </div>

        <div className="bm2-monster-preview">
          {MONSTERS_BY_LEVEL[selectedLevel - 1].map((m, i) => (
            <div key={i} className="bm2-monster-chip">
              <span>{m.emoji}</span>
              <span>{m.name}</span>
            </div>
          ))}
        </div>

        <button className="bc-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>⚔️ Combattre !</button>
      </div>
    );
  }

  if (phase === 'results') {
    const { stars, victory, timeSecs } = sessionResult ?? { stars: 1, victory: false, timeSecs: 0 };
    return (
      <div className="bm2-page">
        <GameFeedback ref={feedbackRef} />
        <div className="game-results">
          <div className="game-results__emoji">{victory ? '🏆' : '💀'}</div>
          <div className="game-results__title">{victory ? 'Victoire !' : 'Game Over !'}</div>
          <div className="game-results__stars">{'★'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
          {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
          {sessionResult?.newUnlocked && <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} débloqué !</div>}
          {rewards.length > 0 && (
            <div className="bm2-rewards">
              {rewards.map((r, i) => <span key={i} className="bm2-reward-chip">{r}</span>)}
            </div>
          )}
          <div className="game-results__stats">
            <div className="game-results__stat">
              <span className="game-results__stat-val">{score}</span>
              <span className="game-results__stat-lbl">Score</span>
            </div>
            <div className="game-results__stat">
              <span className="game-results__stat-val">{monsterIdx}/{monsters.length}</span>
              <span className="game-results__stat-lbl">Monstres vaincus</span>
            </div>
            <div className="game-results__stat">
              <span className="game-results__stat-val">{timeSecs}s</span>
              <span className="game-results__stat-lbl">Temps</span>
            </div>
          </div>
          <button className="game-results__btn" onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <button className="game-results__btn game-results__btn--soft" onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}>Niveaux</button>
          <Link to="/jeux" className="game-results__btn game-results__btn--soft" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>← Jeux</Link>
        </div>
      </div>
    );
  }

  const monster = monsters[monsterIdx];
  const monsterHpPct = (monsterHp / monster.hp) * 100;
  const playerHpPct = (playerHp / PLAYER_MAX_HP) * 100;

  return (
    <div className="bm2-page">
      <GameFeedback ref={feedbackRef} />
      <Link to="/jeux" className="exam-back-btn">←</Link>

      {/* Monster area */}
      <div className="bm2-arena">
        <div className={`bm2-monster-area${hitAnim === 'monster' ? ' bm2-hit' : ''}${attackAnim === 'player' ? ' bm2-monster-shake' : ''}`}>
          <div className="bm2-monster-name">{monster.name}</div>
          <div className="bm2-monster-emoji">{monster.emoji}</div>
          <div className="bm2-hp-bar">
            <div className="bm2-hp-fill bm2-hp-fill--monster" style={{ width: `${monsterHpPct}%` }} />
          </div>
          <div className="bm2-hp-label">❤️ {monsterHp} / {monster.hp}</div>
        </div>

        <div className="bm2-vs">⚔️</div>

        {/* Player area */}
        <div className={`bm2-player-area${hitAnim === 'player' ? ' bm2-hit' : ''}${attackAnim === 'monster' ? ' bm2-player-shake' : ''}`}>
          <div className="bm2-monster-name">Léna</div>
          <div className="bm2-monster-emoji">🧝</div>
          <div className="bm2-hp-bar">
            <div className={`bm2-hp-fill bm2-hp-fill--player${playerHpPct < 30 ? ' bm2-hp-fill--low' : ''}`} style={{ width: `${playerHpPct}%` }} />
          </div>
          <div className="bm2-hp-label">💙 {Math.max(playerHp, 0)} / {PLAYER_MAX_HP}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="bm2-progress-row">
        {monsters.map((m, i) => (
          <span key={i} className={`bm2-progress-dot${i < monsterIdx ? ' bm2-progress-dot--done' : i === monsterIdx ? ' bm2-progress-dot--active' : ''}`}>
            {i < monsterIdx ? '✅' : m.emoji}
          </span>
        ))}
        <span className="bm2-score-badge">⭐ {score}</span>
        {streak >= 3 && <span className="bm2-streak">🔥 ×{streak}</span>}
      </div>

      {/* Scene context */}
      <div className="game-scene-header">
        <span className="game-scene-header__emoji">{SCENES_BY_LEVEL[selectedLevel - 1][sceneIdx].split(' ')[0]}</span>
        <span className="game-scene-header__text">{SCENES_BY_LEVEL[selectedLevel - 1][sceneIdx].slice(SCENES_BY_LEVEL[selectedLevel - 1][sceneIdx].indexOf(' ') + 1)}</span>
      </div>

      {/* Question */}
      <div className="bm2-question">
        {question?.text}
      </div>
      {feedbackText && <div className="game-xp-text">{feedbackText}</div>}

      {/* Answer choices */}
      <div className="bm2-choices">
        {question?.choices.map((c, i) => (
          <button
            key={i}
            className="bm2-choice"
            onPointerDown={e => { e.preventDefault(); handleAnswer(c); }}
            disabled={locked}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
