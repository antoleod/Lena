import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import { formatDuration } from '../../services/storage/gameProgressStore.js';
import { GameFeedback, useGameFeedback } from './GameFeedback.jsx';
import './jeux.css';

const PLAYER_MAX_HP = 10;
const POWER_MAX = 3;

const DIFF = {
  easy:   { label: 'Facile',    timer: 45, badge: '😊', color: '#22c55e' },
  medium: { label: 'Normal',    timer: 30, badge: '😤', color: '#f59e0b' },
  hard:   { label: 'Difficile', timer: 15, badge: '🔥', color: '#ef4444' },
};

const MONSTERS_BY_LEVEL = [
  [
    { name: 'Globlin',      emoji: '👾', hp: 5,  atk: 1, isBoss: false, reward: '🗡️' },
    { name: 'Slime',        emoji: '🟢', hp: 6,  atk: 1, isBoss: false, reward: '🛡️' },
    { name: 'Roi Fantôme',  emoji: '👻', hp: 8,  atk: 2, isBoss: true,  reward: '⭐' },
  ],
  [
    { name: 'Gobelin',      emoji: '🧌', hp: 6,  atk: 1, isBoss: false, reward: '🗡️' },
    { name: 'Zombie',       emoji: '🧟', hp: 7,  atk: 2, isBoss: false, reward: '🛡️' },
    { name: 'Roi Vampire',  emoji: '🧛', hp: 10, atk: 2, isBoss: true,  reward: '⭐' },
  ],
  [
    { name: 'Ogre',         emoji: '👹', hp: 8,  atk: 2, isBoss: false, reward: '🗡️' },
    { name: 'Sorcière',     emoji: '🧙', hp: 9,  atk: 2, isBoss: false, reward: '🛡️' },
    { name: 'Démon Noir',   emoji: '😈', hp: 12, atk: 3, isBoss: true,  reward: '⭐' },
  ],
  [
    { name: 'Troll',        emoji: '👺', hp: 10, atk: 3, isBoss: false, reward: '🗡️' },
    { name: 'Cyclope',      emoji: '🫏', hp: 12, atk: 3, isBoss: false, reward: '🛡️' },
    { name: 'Grand Dragon', emoji: '🐲', hp: 15, atk: 4, isBoss: true,  reward: '⭐' },
  ],
  [
    { name: 'Roi Sombre',   emoji: '🦹', hp: 12, atk: 4, isBoss: false, reward: '🗡️' },
    { name: 'Titan',        emoji: '🗿', hp: 15, atk: 4, isBoss: false, reward: '🛡️' },
    { name: 'Léviathan',    emoji: '🐉', hp: 20, atk: 5, isBoss: true,  reward: '🏆' },
  ],
];

const LEVEL_OPS = [
  { ops: ['+'],              max: 10, label: 'Niveau 1 — CP',  sub: 'Additions simples' },
  { ops: ['+', '-'],         max: 20, label: 'Niveau 2 — CE1', sub: 'Additions & soustractions' },
  { ops: ['+', '-', '×'],    max: 30, label: 'Niveau 3 — CE2', sub: 'Opérations variées' },
  { ops: ['×', '÷'],         max: 10, label: 'Niveau 4 — CM1', sub: 'Multiplications & divisions' },
  { ops: ['+','-','×','÷'],  max: 12, label: 'Niveau 5 — CM2', sub: 'Tout en vitesse !' },
];

const SCENES_BY_LEVEL = [
  ['🌲 Dans la forêt des ombres…', '🏕️ Au camp des aventuriers…', '🌙 Sous la lune de minuit…', '🌫️ Dans le brouillard mystérieux…'],
  ['🏰 Aux portes du donjon…', '🌋 Au pied du volcan maudit…', '⚔️ Dans la salle du conseil…', '🕸️ Dans les tunnels obscurs…'],
  ['🔥 Dans la grotte du feu…', '💀 Dans le cimetière hanté…', '🌊 Sur les récifs maudits…', '🌪️ Dans le vortex magique…'],
  ['🐉 Dans l\'antre du dragon…', '⚡ Dans la tour de la foudre…', '🌑 Dans le néant cosmique…', '🗡️ Dans l\'arène des champions…'],
  ['👁️ Face à l\'œil du chaos…', '🌌 Dans les étoiles maudites…', '🔮 Dans la salle du trône…', '🏆 Pour la gloire éternelle…'],
];

const ALL_OPS = ['+', '-', '×', '÷'];
const OP_LABELS = { '+': '+', '-': '−', '×': '×', '÷': '÷' };

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

  const gsRef = useRef(null);
  const dmgCounter = useRef(0);

  const [phase, setPhase] = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(Math.min(progress.unlockedLevel ?? 1, 5));
  const [selectedDiff, setSelectedDiff] = useState('easy');
  const [selectedOps, setSelectedOps] = useState(['+', '-', '×', '÷']);
  const selectedOpsRef = useRef(selectedOps);
  useEffect(() => { selectedOpsRef.current = selectedOps; }, [selectedOps]);

  const [hudState, setHudState] = useState({
    playerHp: PLAYER_MAX_HP, monsterHp: 0, monsterIdx: 0,
    score: 0, streak: 0, powerBar: 0, timerSecs: 45, locked: false,
  });
  const [question, setQuestion] = useState(null);
  const [anim, setAnim] = useState(null);
  const [timeUpFlash, setTimeUpFlash] = useState(false);
  const [dmgNums, setDmgNums] = useState([]);
  const [feedbackText, setFeedbackText] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [sessionResult, setSessionResult] = useState(null);
  const [bossIntro, setBossIntro] = useState(false);
  const [sceneIdx, setSceneIdx] = useState(0);

  function toggleOp(op) {
    setSelectedOps(prev => {
      if (prev.includes(op)) {
        if (prev.length === 1) return prev;
        return prev.filter(o => o !== op);
      }
      return [...prev, op];
    });
  }

  function syncHud() {
    const g = gsRef.current;
    if (!g) return;
    setHudState({
      playerHp: g.playerHp,
      monsterHp: g.monsterHp,
      monsterIdx: g.monsterIdx,
      score: g.score,
      streak: g.streak,
      powerBar: g.powerBar,
      timerSecs: g.timerSecs,
      locked: g.locked,
    });
  }

  function addDmgNum(label, isPlayer, isCritical = false) {
    const id = dmgCounter.current++;
    setDmgNums(prev => [...prev, { id, label, isPlayer, isCritical }]);
    setTimeout(() => setDmgNums(prev => prev.filter(d => d.id !== id)), 1200);
  }

  function stopTimer() {
    const g = gsRef.current;
    if (g?.timerInterval) {
      clearInterval(g.timerInterval);
      g.timerInterval = null;
    }
  }

  function startTimer() {
    const g = gsRef.current;
    if (!g) return;
    stopTimer();
    g.timerInterval = setInterval(() => {
      const gs = gsRef.current;
      if (!gs) return;
      gs.timerSecs = Math.max(0, gs.timerSecs - 1);
      syncHud();
      if (gs.timerSecs <= 0) {
        stopTimer();
        handleTimeUp();
      }
    }, 1000);
  }

  function handleTimeUp() {
    const g = gsRef.current;
    if (!g || g.locked) return;
    g.locked = true;
    g.streak = 0;
    syncHud();
    setTimeUpFlash(true);
    setTimeout(() => setTimeUpFlash(false), 900);
    doMonsterAttack();
  }

  function doMonsterAttack() {
    const g = gsRef.current;
    if (!g) return;
    const monster = g.monsters[g.monsterIdx];
    setAnim('monster-atk');
    setTimeout(() => {
      setAnim(null);
      const dmg = monster.atk;
      addDmgNum(`-${dmg}`, true, false);
      g.playerHp = Math.max(0, g.playerHp - dmg);
      syncHud();
      setTimeout(() => {
        if (g.playerHp <= 0) {
          stopTimer();
          endGame(false);
        } else {
          advanceQuestion();
        }
      }, 350);
    }, 350);
  }

  function doPlayerAttack(dmg, isSpecial) {
    const g = gsRef.current;
    if (!g) return;
    setAnim(isSpecial ? 'special-atk' : 'player-atk');
    setTimeout(() => {
      setAnim(null);
      addDmgNum(`-${dmg}`, false, isSpecial);
      g.monsterHp = Math.max(0, g.monsterHp - dmg);
      syncHud();
      setTimeout(() => {
        if (g.monsterHp <= 0) {
          handleMonsterDefeated();
        } else {
          advanceQuestion();
        }
      }, 350);
    }, 350);
  }

  function advanceQuestion() {
    const g = gsRef.current;
    if (!g) return;
    const q = makeQuestion(selectedOpsRef.current, g.levelCfg.max);
    g.question = q;
    g.locked = false;
    g.timerSecs = DIFF[g.diff].timer;
    setQuestion(q);
    syncHud();
    startTimer();
  }

  function handleMonsterDefeated() {
    const g = gsRef.current;
    if (!g) return;
    stopTimer();
    const newRewards = [...g.rewards, g.monsters[g.monsterIdx].reward];
    g.rewards = newRewards;
    setRewards([...newRewards]);
    const nextIdx = g.monsterIdx + 1;
    if (nextIdx >= g.monsters.length) {
      endGame(true);
    } else {
      g.monsterIdx = nextIdx;
      g.monsterHp = g.monsters[nextIdx].hp;
      syncHud();
      if (g.monsters[nextIdx].isBoss) {
        g.locked = true;
        setBossIntro(true);
      } else {
        advanceQuestion();
      }
    }
  }

  function dismissBossIntro() {
    setBossIntro(false);
    advanceQuestion();
  }

  function endGame(victory) {
    const g = gsRef.current;
    if (!g) return;
    stopTimer();
    const secs = elapsedSecs();
    const stars = victory ? 3 : (g.score >= 10 ? 2 : 1);
    const result = saveSession({ score: g.score, level: g.level, stars });
    const defeatedCount = victory ? g.monsters.length : g.monsterIdx;
    setSessionResult({ ...result, timeSecs: secs, stars, victory, score: g.score, defeatedCount, monstersTotal: g.monsters.length });
    setPhase('results');
  }

  function handleAnswer(val) {
    const g = gsRef.current;
    if (!g || g.locked) return;
    g.locked = true;
    stopTimer();
    const correct = val === g.question.answer;

    if (correct) {
      const bonus = g.streak >= 2 ? 2 : 1;
      g.score += bonus;
      g.streak += 1;
      g.powerBar = Math.min(POWER_MAX, g.powerBar + 1);
      syncHud();
      triggerCorrect();
      triggerScore(`+${bonus * 10}`);
      if (g.streak >= 3) triggerCombo(g.streak);
      const txt = g.streak >= 3 ? `Combo ×${g.streak} ! 🔥` : g.streak === 2 ? 'Parfait ! ⚡' : `+${bonus * 10} pts !`;
      setFeedbackText(txt);
      setTimeout(() => setFeedbackText(null), 1000);
      setSceneIdx(Math.floor(Math.random() * SCENES_BY_LEVEL[g.level - 1].length));
      doPlayerAttack(1, false);
    } else {
      g.streak = 0;
      syncHud();
      triggerWrong();
      doMonsterAttack();
    }
  }

  function handleSpecial() {
    const g = gsRef.current;
    if (!g || g.locked || g.powerBar < POWER_MAX) return;
    g.locked = true;
    g.powerBar = 0;
    stopTimer();
    syncHud();
    setFeedbackText('⚡ ATTAQUE SPÉCIALE !');
    setTimeout(() => setFeedbackText(null), 1000);
    doPlayerAttack(3, true);
  }

  function startGame() {
    stopTimer();
    const monsters = MONSTERS_BY_LEVEL[selectedLevel - 1];
    const levelCfg = LEVEL_OPS[selectedLevel - 1];
    const diff = selectedDiff;
    const q = makeQuestion(selectedOpsRef.current, levelCfg.max);

    gsRef.current = {
      playerHp: PLAYER_MAX_HP,
      monsterHp: monsters[0].hp,
      monsterIdx: 0,
      score: 0,
      streak: 0,
      powerBar: 0,
      timerSecs: DIFF[diff].timer,
      timerInterval: null,
      locked: false,
      monsters,
      levelCfg,
      diff,
      level: selectedLevel,
      question: q,
      rewards: [],
    };

    setRewards([]);
    setSessionResult(null);
    setFeedbackText(null);
    setDmgNums([]);
    setAnim(null);
    setBossIntro(false);
    setTimeUpFlash(false);
    setSceneIdx(Math.floor(Math.random() * SCENES_BY_LEVEL[selectedLevel - 1].length));
    resetTimer();
    setQuestion(q);
    setHudState({
      playerHp: PLAYER_MAX_HP,
      monsterHp: monsters[0].hp,
      monsterIdx: 0,
      score: 0,
      streak: 0,
      powerBar: 0,
      timerSecs: DIFF[diff].timer,
      locked: false,
    });
    setPhase('play');
    startTimer();
  }

  useEffect(() => () => stopTimer(), []);

  // ─── SETUP ──────────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    const levelCfg = LEVEL_OPS[selectedLevel - 1];
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
            const isLocked = lvl > (progress.unlockedLevel ?? 1);
            return (
              <button
                key={lvl}
                className={`jeux-level-btn${selectedLevel === lvl ? ' is-selected' : ''}${isLocked ? ' is-locked' : ''}`}
                onPointerDown={e => { e.preventDefault(); if (!isLocked) setSelectedLevel(lvl); }}
              >
                {isLocked ? '🔒' : `Niveau ${lvl}`}
                {!isLocked && progress.bestLevel >= lvl && <span className="jeux-level-stars">★</span>}
              </button>
            );
          })}
        </div>
        <p style={{ textAlign: 'center', opacity: .65, fontSize: '.82rem', color: '#fff', marginBottom: 16 }}>
          {levelCfg.label} — {levelCfg.sub}
        </p>

        <div className="bm2-diff-label">Difficulté :</div>
        <div className="bm2-diff-grid">
          {Object.entries(DIFF).map(([key, d]) => (
            <button
              key={key}
              className={`bm2-diff-btn${selectedDiff === key ? ' is-selected' : ''}`}
              onPointerDown={e => { e.preventDefault(); setSelectedDiff(key); }}
            >
              <span className="bm2-diff-badge">{d.badge}</span>
              <span className="bm2-diff-name">{d.label}</span>
              <span className="bm2-diff-timer">⏱ {d.timer}s</span>
            </button>
          ))}
        </div>

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
            <div key={i} className={`bm2-monster-chip${m.isBoss ? ' bm2-monster-chip--boss' : ''}`}>
              <span>{m.emoji}</span>
              <span>{m.isBoss ? '👑 ' : ''}{m.name}</span>
            </div>
          ))}
        </div>

        <button className="bc-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>⚔️ Combattre !</button>
      </div>
    );
  }

  // ─── RESULTS ────────────────────────────────────────────────────────────────
  if (phase === 'results') {
    const { stars, victory, timeSecs, score: finalScore, defeatedCount, monstersTotal } =
      sessionResult ?? { stars: 1, victory: false, timeSecs: 0, score: 0, defeatedCount: 0, monstersTotal: 3 };
    return (
      <div className="bm2-page">
        <GameFeedback ref={feedbackRef} />
        <div className="game-results">
          <div className="game-results__emoji">{victory ? '🏆' : '💀'}</div>
          <div className="game-results__title">{victory ? 'Victoire !' : 'Défaite…'}</div>
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
              <span className="game-results__stat-val">{finalScore}</span>
              <span className="game-results__stat-lbl">Score</span>
            </div>
            <div className="game-results__stat">
              <span className="game-results__stat-val">{defeatedCount}/{monstersTotal}</span>
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

  // ─── PLAY ───────────────────────────────────────────────────────────────────
  const monsters = MONSTERS_BY_LEVEL[selectedLevel - 1];
  const monster = monsters[hudState.monsterIdx];
  const monsterHpPct = monster ? (hudState.monsterHp / monster.hp) * 100 : 0;
  const playerHpPct = (hudState.playerHp / PLAYER_MAX_HP) * 100;
  const timerMax = DIFF[selectedDiff].timer;
  const timerPct = (hudState.timerSecs / timerMax) * 100;
  const timerDanger = hudState.timerSecs <= Math.min(5, Math.floor(timerMax * 0.15));
  const sceneText = SCENES_BY_LEVEL[selectedLevel - 1][sceneIdx] ?? '';
  const playerAtking = anim === 'player-atk' || anim === 'special-atk';
  const monsterAtking = anim === 'monster-atk';
  const isSpecialAnim = anim === 'special-atk';

  return (
    <div className="bm2-page">
      <GameFeedback ref={feedbackRef} />
      <Link to="/jeux" className="exam-back-btn">←</Link>

      {timeUpFlash && <div className="bm2-timeup-overlay">⏰ Temps écoulé !</div>}

      {bossIntro && monster && (
        <div className="bm2-boss-intro">
          <div className="bm2-boss-intro__sprite">{monster.emoji}</div>
          <div className="bm2-boss-intro__crown">👑 BOSS</div>
          <div className="bm2-boss-intro__name">{monster.name}</div>
          <div className="bm2-boss-intro__sub">Un ennemi redoutable approche…</div>
          <button className="bm2-boss-intro__btn" onPointerDown={e => { e.preventDefault(); dismissBossIntro(); }}>
            ⚔️ Je suis prêt !
          </button>
        </div>
      )}

      <div className="bm2-timer-wrap">
        <div
          className={`bm2-timer-fill${timerDanger ? ' bm2-timer-fill--danger' : ''}`}
          style={{ width: `${timerPct}%` }}
        />
        <span className={`bm2-timer-secs${timerDanger ? ' bm2-timer-secs--danger' : ''}`}>
          {hudState.timerSecs}s
        </span>
      </div>

      <div className="bm2-arena">
        <div className={[
          'bm2-combatant bm2-combatant--monster',
          playerAtking ? 'bm2-combatant--hit' : '',
          monsterAtking ? 'bm2-combatant--atk-left' : '',
          isSpecialAnim ? 'bm2-combatant--special-hit' : '',
        ].join(' ').trim()}>
          <div className="bm2-combatant__name">{monster?.name}</div>
          <div className="bm2-combatant__sprite-wrap">
            <div className="bm2-combatant__sprite">{monster?.emoji}</div>
            {dmgNums.filter(d => !d.isPlayer).map(d => (
              <div key={d.id} className={`bm2-dmg-num${d.isCritical ? ' bm2-dmg-num--critical' : ''}`}>
                {d.label}
              </div>
            ))}
          </div>
          <div className="bm2-combatant__hp-bar">
            <div className="bm2-combatant__hp-fill bm2-combatant__hp-fill--monster" style={{ width: `${monsterHpPct}%` }} />
          </div>
          <div className="bm2-hp-label">❤️ {Math.max(hudState.monsterHp, 0)} / {monster?.hp}</div>
        </div>

        <div className="bm2-vs">⚔️</div>

        <div className={[
          'bm2-combatant bm2-combatant--player',
          monsterAtking ? 'bm2-combatant--hit' : '',
          playerAtking ? 'bm2-combatant--atk-right' : '',
        ].join(' ').trim()}>
          <div className="bm2-combatant__name">Léna</div>
          <div className="bm2-combatant__sprite-wrap">
            <div className="bm2-combatant__sprite">🧝</div>
            {dmgNums.filter(d => d.isPlayer).map(d => (
              <div key={d.id} className="bm2-dmg-num bm2-dmg-num--player">{d.label}</div>
            ))}
          </div>
          <div className="bm2-combatant__hp-bar">
            <div
              className={`bm2-combatant__hp-fill bm2-combatant__hp-fill--player${playerHpPct < 30 ? ' bm2-combatant__hp-fill--low' : ''}`}
              style={{ width: `${playerHpPct}%` }}
            />
          </div>
          <div className="bm2-hp-label">💙 {Math.max(hudState.playerHp, 0)} / {PLAYER_MAX_HP}</div>
        </div>
      </div>

      <div className="bm2-progress-row">
        {monsters.map((m, i) => (
          <span
            key={i}
            className={`bm2-progress-dot${i < hudState.monsterIdx ? ' bm2-progress-dot--done' : i === hudState.monsterIdx ? ' bm2-progress-dot--active' : ''}`}
          >
            {i < hudState.monsterIdx ? '✅' : m.emoji}
          </span>
        ))}
        <span className="bm2-score-badge">⭐ {hudState.score}</span>
        {hudState.streak >= 3 && <span className="bm2-streak">🔥 ×{hudState.streak}</span>}
      </div>

      <div className="game-scene-header">
        <span className="game-scene-header__emoji">{sceneText.split(' ')[0]}</span>
        <span className="game-scene-header__text">{sceneText.slice(sceneText.indexOf(' ') + 1)}</span>
      </div>

      <div className="bm2-question">{question?.text}</div>
      {feedbackText && <div className="game-xp-text">{feedbackText}</div>}

      <div className="bm2-choices">
        {question?.choices.map((c, i) => (
          <button
            key={i}
            className="bm2-choice"
            onPointerDown={e => { e.preventDefault(); handleAnswer(c); }}
            disabled={hudState.locked || bossIntro}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="bm2-status-row">
        <div className="bm2-power-pips">
          <span className="bm2-power-label">⚡</span>
          {Array.from({ length: POWER_MAX }).map((_, i) => (
            <div key={i} className={`bm2-power-pip${i < hudState.powerBar ? ' bm2-power-pip--full' : ''}`} />
          ))}
        </div>
        {hudState.powerBar >= POWER_MAX && (
          <button
            className="bm2-special-btn"
            onPointerDown={e => { e.preventDefault(); handleSpecial(); }}
          >
            ⚡ Attaque Spéciale !
          </button>
        )}
      </div>
    </div>
  );
}
