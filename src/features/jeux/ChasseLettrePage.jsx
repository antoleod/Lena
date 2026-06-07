import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import { formatDuration } from '../../services/storage/gameProgressStore.js';
import './jeux.css';

// Word pools per level
const WORD_POOLS = [
  // Niveau 1: 3-4 letter words
  [
    { emoji: '🐱', word: 'CHAT',  hint: 'Animal domestique' },
    { emoji: '🐶', word: 'CHIEN', hint: 'Meilleur ami de l\'homme' },
    { emoji: '🌙', word: 'LUNE',  hint: 'Brille la nuit' },
    { emoji: '🌲', word: 'ARBRE', hint: 'Végétal avec des branches' },
    { emoji: '🏠', word: 'MAISON', hint: 'On y habite' },
    { emoji: '🐸', word: 'GRENOUILLE', hint: 'Saute et coasse' },
    { emoji: '🐠', word: 'POISSON', hint: 'Vit dans l\'eau' },
    { emoji: '🍓', word: 'FRAISE', hint: 'Petit fruit rouge' },
    { emoji: '🐦', word: 'OISEAU', hint: 'Vole dans les airs' },
    { emoji: '🦊', word: 'RENARD', hint: 'Animal roux rusé' },
  ],
  // Niveau 2: 4-5 letter words
  [
    { emoji: '☀️', word: 'SOLEIL', hint: 'Brille le jour' },
    { emoji: '✏️', word: 'CRAYON', hint: 'Pour écrire' },
    { emoji: '📚', word: 'LIVRE',  hint: 'Pour lire' },
    { emoji: '🦋', word: 'PAPILLON', hint: 'Insecte coloré' },
    { emoji: '⭐', word: 'ETOILE', hint: 'Dans le ciel la nuit' },
    { emoji: '🌈', word: 'ARCENCIEL', hint: 'Après la pluie' },
    { emoji: '🍎', word: 'POMME',  hint: 'Fruit rouge' },
    { emoji: '🐰', word: 'LAPIN',  hint: 'Animal aux grandes oreilles' },
    { emoji: '🧲', word: 'AIMANT', hint: 'Attire le métal' },
    { emoji: '🌸', word: 'FLEUR',  hint: 'Pousse dans les jardins' },
  ],
  // Niveau 3: 5-6 letter words
  [
    { emoji: '🦁', word: 'GIRAFE',   hint: 'Long cou, grandes taches' },
    { emoji: '🌊', word: 'RIVIERE',  hint: 'Cours d\'eau' },
    { emoji: '🎸', word: 'GUITARE',  hint: 'Instrument à cordes' },
    { emoji: '🦅', word: 'AIGLE',    hint: 'Grand oiseau rapace' },
    { emoji: '🌺', word: 'HIBISCUS', hint: 'Fleur tropicale' },
    { emoji: '🐊', word: 'CROCODILE', hint: 'Reptile aquatique' },
    { emoji: '🎃', word: 'CITROUILLE', hint: 'Légume d\'automne orange' },
    { emoji: '🧊', word: 'GLACIER',  hint: 'Grand bloc de glace' },
    { emoji: '🦜', word: 'PERROQUET', hint: 'Oiseau qui parle' },
    { emoji: '🌵', word: 'CACTUS',   hint: 'Plante du désert' },
  ],
  // Niveau 4: 6-7 letter words
  [
    { emoji: '🔭', word: 'TELESCOPE', hint: 'Pour voir les étoiles' },
    { emoji: '🌋', word: 'VOLCAN',    hint: 'Montagne de feu' },
    { emoji: '🦒', word: 'ELEPHANT',  hint: 'Plus grand animal terrestre' },
    { emoji: '🎭', word: 'THEATRE',   hint: 'On y joue des pièces' },
    { emoji: '🧬', word: 'MOLECULE',  hint: 'Assemblage d\'atomes' },
    { emoji: '🌏', word: 'CONTINENT', hint: 'Grande étendue de terres' },
    { emoji: '🏔️', word: 'MONTAGNE', hint: 'Haute élévation de terrain' },
    { emoji: '🧪', word: 'CHIMISTE',  hint: 'Scientifique des réactions' },
    { emoji: '🦋', word: 'CHRYSALIDE', hint: 'Cocon du papillon' },
    { emoji: '🌞', word: 'PLANETE',   hint: 'Corps céleste' },
  ],
  // Niveau 5: 7-9 letter words, no hint
  [
    { emoji: '🐸', word: 'GRENOUILLE',   hint: '' },
    { emoji: '🦋', word: 'CHRYSALIDE',   hint: '' },
    { emoji: '📚', word: 'BIBLIOTHEQUE', hint: '' },
    { emoji: '🌊', word: 'IMPERMEABL',   hint: '' },
    { emoji: '🔭', word: 'ASTRONOMIE',   hint: '' },
    { emoji: '🌺', word: 'CAMELEON',     hint: '' },
    { emoji: '🧠', word: 'CERVEAU',      hint: '' },
    { emoji: '🌍', word: 'GEOGRAPHIE',   hint: '' },
    { emoji: '🎵', word: 'SYMPHONIE',    hint: '' },
    { emoji: '🦁', word: 'PREDATEUR',    hint: '' },
  ],
];

// Distractor count per level (fewer = harder)
const DISTRACTOR_COUNT = [8, 7, 6, 5, 4];
// Rounds per level
const ROUNDS_PER_LEVEL = [8, 10, 10, 12, 12];

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeTiles(word, distractorCount) {
  const letters = word.replace(/-/g, '').split('');
  const distractors = [];
  while (distractors.length < Math.min(distractorCount, 26 - letters.length)) {
    const l = ALPHA[Math.floor(Math.random() * ALPHA.length)];
    if (!letters.includes(l) && !distractors.includes(l)) distractors.push(l);
  }
  return shuffle([...letters, ...distractors]).map((l, i) => ({ id: i, letter: l, used: false }));
}

export default function ChasseLettrePage() {
  const { progress, saveSession, resetTimer, elapsedSecs } = useGameSession('chasse-lettres');

  const [phase, setPhase]       = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(Math.min(progress.unlockedLevel, 5));
  const [queue, setQueue]       = useState([]);
  const [qIdx, setQIdx]         = useState(0);
  const [tiles, setTiles]       = useState([]);
  const [typed, setTyped]       = useState([]);
  const [score, setScore]       = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [sessionResult, setSessionResult] = useState(null);

  const ROUNDS = ROUNDS_PER_LEVEL[selectedLevel - 1];

  function startGame() {
    const pool = WORD_POOLS[selectedLevel - 1];
    const q = shuffle(pool).slice(0, ROUNDS_PER_LEVEL[selectedLevel - 1]);
    setQueue(q); setQIdx(0); setScore(0); setFeedback(null); setSessionResult(null);
    resetTimer();
    loadQuestion(q, 0);
    setPhase('play');
  }

  function loadQuestion(q, idx) {
    const item = q[idx];
    setTiles(makeTiles(item.word.replace(/-/g, ''), DISTRACTOR_COUNT[selectedLevel - 1]));
    setTyped([]);
    setFeedback(null);
    setShowHint(false);
  }

  function tapTile(tile) {
    if (tile.used || feedback !== null) return;
    const newTyped = [...typed, tile];
    setTyped(newTyped);
    setTiles(ts => ts.map(t => t.id === tile.id ? { ...t, used: true } : t));

    const current = queue[qIdx];
    const target = current.word.replace(/-/g, '');
    const typedStr = newTyped.map(t => t.letter).join('');

    if (typedStr.length === target.length) {
      if (typedStr === target) {
        setFeedback('ok');
        setScore(s => s + (showHint ? 1 : 2));
        setTimeout(() => advance(), 900);
      } else {
        setFeedback('bad');
        setTimeout(() => {
          const item = queue[qIdx];
          setTiles(makeTiles(item.word.replace(/-/g, ''), DISTRACTOR_COUNT[selectedLevel - 1]));
          setTyped([]); setFeedback(null);
        }, 800);
      }
    }
  }

  function deleteLast() {
    if (typed.length === 0 || feedback !== null) return;
    const last = typed[typed.length - 1];
    setTyped(ts => ts.slice(0, -1));
    setTiles(ts => ts.map(t => t.id === last.id ? { ...t, used: false } : t));
  }

  function advance() {
    const next = qIdx + 1;
    const rounds = ROUNDS_PER_LEVEL[selectedLevel - 1];
    if (next >= rounds) {
      const max = rounds * 2;
      const stars = score >= max * 0.85 ? 3 : score >= max * 0.5 ? 2 : 1;
      const secs = elapsedSecs();
      const result = saveSession({ score, level: selectedLevel, stars });
      setSessionResult({ ...result, timeSecs: secs, stars });
      setPhase('results');
      return;
    }
    setQIdx(next);
    loadQuestion(queue, next);
  }

  if (phase === 'setup') {
    return (
      <div className="cl-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="cl-title">🔤 Chasse Lettres</h1>
        <p className="cl-subtitle">Épelle le mot en tapant les bonnes lettres !</p>

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

        <div className="cl-demo">
          <span className="cl-demo-emoji">🐱</span>
          <span className="cl-demo-arrow">→</span>
          <span className="cl-demo-tiles">C H A T</span>
        </div>
        <button className="cl-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>▶ Jouer</button>
      </div>
    );
  }

  if (phase === 'results') {
    const rounds = ROUNDS_PER_LEVEL[selectedLevel - 1];
    const max = rounds * 2;
    const stars = score >= max * 0.85 ? 3 : score >= max * 0.5 ? 2 : 1;
    return (
      <div className="cl-page">
        <h2 className="cl-result-title">{stars === 3 ? '🎉 Parfait !' : stars === 2 ? '👍 Bien !' : '📚 Continue !'}</h2>
        <div className="jeux-stars">{'★'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
        {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
        {sessionResult?.newUnlocked && <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} débloqué !</div>}
        {sessionResult && <div className="jeux-session-time">⏱ {sessionResult.timeSecs}s</div>}
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {max} pts</span></div>
        <div className="jeux-result-stat"><span>Mots trouvés</span><span>{rounds}</span></div>
        <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
          <button className="cl-cta" style={{ flex: 1 }} onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <button className="cl-cta cl-cta--soft" style={{ flex: 1 }} onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}>Niveaux</button>
        </div>
        <Link to="/jeux" className="cl-cta cl-cta--soft" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: 12 }}>← Jeux</Link>
      </div>
    );
  }

  const current = queue[qIdx];
  const target = current?.word.replace(/-/g, '') || '';
  const showHintBtn = selectedLevel < 5 && current?.hint;

  return (
    <div className="cl-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="cl-hud">
        <span className="cl-score">⭐ {score}</span>
        <span className="cl-round">{qIdx + 1} / {ROUNDS_PER_LEVEL[selectedLevel - 1]}</span>
      </div>

      <div className={`cl-emoji-wrap${feedback === 'ok' ? ' cl-flash-ok' : feedback === 'bad' ? ' cl-flash-bad' : ''}`}>
        <span className="cl-emoji">{current?.emoji}</span>
      </div>

      {showHintBtn && showHint && <p className="cl-hint">{current?.hint}</p>}
      {showHintBtn && !showHint && (
        <button className="cl-hint-btn" onPointerDown={e => { e.preventDefault(); setShowHint(true); }}>
          💡 Indice (-1 pt)
        </button>
      )}

      <div className="cl-typed">
        {Array.from({ length: target.length }).map((_, i) => (
          <div key={i} className={`cl-slot${i < typed.length ? ' cl-slot--filled' : ''}`}>
            {typed[i]?.letter || ''}
          </div>
        ))}
      </div>

      <button className="cl-delete" onPointerDown={e => { e.preventDefault(); deleteLast(); }} disabled={typed.length === 0}>
        ⌫
      </button>

      <div className="cl-tiles">
        {tiles.map(tile => (
          <button
            key={tile.id}
            className={`cl-tile${tile.used ? ' cl-tile--used' : ''}`}
            onPointerDown={e => { e.preventDefault(); tapTile(tile); }}
          >
            {tile.letter}
          </button>
        ))}
      </div>
    </div>
  );
}
