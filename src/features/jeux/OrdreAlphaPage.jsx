import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import { formatDuration } from '../../services/storage/gameProgressStore.js';
import './jeux.css';

// Word groups per level
const WORD_POOLS = [
  // Niveau 1: 3 simple common nouns, 45s
  [
    ['âne', 'chat', 'lion'],
    ['bal', 'cerf', 'duc'],
    ['ami', 'bec', 'cap'],
    ['art', 'bus', 'cin'],
    ['feu', 'loup', 'nez'],
    ['bol', 'eau', 'gui'],
    ['air', 'buf', 'sol'],
    ['arc', 'dos', 'fil'],
    ['ban', 'coq', 'dé'],
    ['ans', 'cou', 'gaz'],
    ['axe', 'cri', 'fer'],
    ['bain', 'cake', 'dent'],
  ],
  // Niveau 2: 4 words, 35s
  [
    ['ballon', 'cahier', 'gomme', 'livre'],
    ['avion', 'bateau', 'bus', 'train'],
    ['bras', 'dos', 'main', 'nez'],
    ['beurre', 'farine', 'lait', 'sucre'],
    ['bleu', 'gris', 'noir', 'rouge'],
    ['arbre', 'fleur', 'herbe', 'mousse'],
    ['ciel', 'lune', 'nuage', 'soleil'],
    ['chat', 'chien', 'lapin', 'oiseau'],
    ['crayon', 'règle', 'stylo', 'trousse'],
    ['cerise', 'fraise', 'pomme', 'poire'],
    ['chaise', 'lampe', 'porte', 'table'],
    ['août', 'juin', 'mai', 'mars'],
  ],
  // Niveau 3: 5 words, 25s
  [
    ['âne', 'chat', 'lion', 'ours', 'vache'],
    ['avion', 'bateau', 'bus', 'train', 'vélo'],
    ['bras', 'dos', 'main', 'nez', 'pied'],
    ['beurre', 'farine', 'lait', 'oeuf', 'sucre'],
    ['bleu', 'gris', 'noir', 'rouge', 'vert'],
    ['arbre', 'fleur', 'herbe', 'mousse', 'racine'],
    ['chaise', 'lampe', 'porte', 'table', 'fenêtre'],
    ['ciel', 'lune', 'nuage', 'pluie', 'soleil'],
    ['chat', 'chien', 'lapin', 'lion', 'oiseau'],
    ['crayon', 'gomme', 'règle', 'stylo', 'trousse'],
  ],
  // Niveau 4: 5 words with accents, 20s
  [
    ['été', 'être', 'étude', 'étoile', 'étang'],
    ['âge', 'âme', 'âne', 'âpre', 'âtre'],
    ['île', 'image', 'ici', 'idée', 'iglou'],
    ['œuf', 'oeil', 'ours', 'orage', 'orge'],
    ['école', 'écran', 'égal', 'élève', 'épée'],
    ['châle', 'château', 'chêne', 'chèvre', 'chômer'],
    ['fête', 'fièvre', 'flèche', 'forêt', 'frère'],
    ['grève', 'guêpe', 'guêtre', 'gêne', 'génie'],
    ['hôtel', 'hôpital', 'honnête', 'huître', 'hélice'],
    ['île', 'îlot', 'ître', 'ïambe', 'îcone'],
  ],
  // Niveau 5: 6 words including compound words, 15s
  [
    ['arc-en-ciel', 'arrêt', 'arriver', 'artiste', 'ascenseur', 'aspirer'],
    ['bonbon', 'bonjour', 'bonne', 'bonnet', 'bonsoir', 'bord'],
    ['chapeau', 'char', 'charbon', 'charcuterie', 'charme', 'charpente'],
    ['grand-père', 'grande', 'grandir', 'grange', 'gratter', 'gravité'],
    ['porte-monnaie', 'portée', 'portefeuille', 'portail', 'porter', 'portrait'],
    ['sous-marin', 'souple', 'source', 'souris', 'sourire', 'sous-sol'],
    ['tire-bouchon', 'tirade', 'tiroir', 'titre', 'tirer', 'tissu'],
    ['main-d\'oeuvre', 'maintenant', 'maintenir', 'maison', 'mairie', 'maître'],
    ['chef-d\'oeuvre', 'cheval', 'chevalier', 'chemin', 'cheminée', 'chêne'],
    ['arc-boutant', 'archive', 'ardoise', 'armoire', 'arme', 'armée'],
  ],
];

const LEVEL_CONFIG = [
  { wordCount: 3, roundTime: 45, rounds: 10 },
  { wordCount: 4, roundTime: 35, rounds: 10 },
  { wordCount: 5, roundTime: 25, rounds: 10 },
  { wordCount: 5, roundTime: 20, rounds: 10 },
  { wordCount: 6, roundTime: 15, rounds: 10 },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sortAlpha(words) {
  return [...words].sort((a, b) => a.localeCompare(b, 'fr'));
}

export default function OrdreAlphaPage() {
  const { progress, saveSession, resetTimer, elapsedSecs } = useGameSession('ordre-alpha');

  const [phase, setPhase]         = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(Math.min(progress.unlockedLevel, 5));
  const [groups, setGroups]       = useState([]);
  const [roundNum, setRoundNum]   = useState(0);
  const [displayWords, setDisplayWords] = useState([]);
  const [sortedWords, setSortedWords]   = useState([]);
  const [selected, setSelected]   = useState([]);
  const [timeLeft, setTimeLeft]   = useState(30);
  const [score, setScore]         = useState(0);
  const [shakeIdx, setShakeIdx]   = useState(null);
  const [roundOver, setRoundOver] = useState(false);
  const [sessionResult, setSessionResult] = useState(null);
  const timerRef = useRef(null);

  const cfg = LEVEL_CONFIG[selectedLevel - 1];

  function startGame() {
    const pool = WORD_POOLS[selectedLevel - 1];
    const shuffledGroups = shuffle(pool);
    setGroups(shuffledGroups);
    setScore(0);
    setRoundNum(0);
    setSessionResult(null);
    resetTimer();
    setPhase('play');
    initRound(shuffledGroups, 0, cfg.roundTime);
  }

  function initRound(grps, idx, roundTime) {
    const words = grps[idx];
    const sorted = sortAlpha(words);
    const display = shuffle(words);
    setSortedWords(sorted);
    setDisplayWords(display);
    setSelected([]);
    setTimeLeft(roundTime);
    setShakeIdx(null);
    setRoundOver(false);
  }

  useEffect(() => {
    if (phase !== 'play' || roundOver) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setRoundOver(true);
          setTimeout(() => advanceRound(), 1000);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundNum, phase, roundOver]);

  function advanceRound(currentScore) {
    const next = roundNum + 1;
    if (next >= cfg.rounds) {
      const sc = currentScore !== undefined ? currentScore : score;
      const stars = sc >= cfg.rounds * 0.9 ? 3 : sc >= cfg.rounds * 0.6 ? 2 : 1;
      const secs = elapsedSecs();
      const result = saveSession({ score: sc, level: selectedLevel, stars });
      setSessionResult({ ...result, timeSecs: secs, stars });
      setPhase('results');
      return;
    }
    setRoundNum(next);
    initRound(groups, next, cfg.roundTime);
  }

  function handleTap(word) {
    if (roundOver) return;
    if (selected.includes(word)) return;

    const position = selected.length;
    if (word === sortedWords[position]) {
      const newSelected = [...selected, word];
      setSelected(newSelected);
      setShakeIdx(null);

      if (newSelected.length === sortedWords.length) {
        clearInterval(timerRef.current);
        setRoundOver(true);
        const newScore = score + 1;
        setScore(newScore);
        setTimeout(() => advanceRound(newScore), 900);
      }
    } else {
      const wordIdx = displayWords.indexOf(word);
      setShakeIdx(wordIdx);
      setSelected([]);
      setTimeout(() => setShakeIdx(null), 500);
    }
  }

  const timerPct = (timeLeft / cfg.roundTime) * 100;

  if (phase === 'setup') {
    return (
      <div className="oa-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="oa-title">🔤 Ordre Alpha</h1>
        <p className="oa-subtitle">Tape les mots dans l'ordre alphabétique !</p>

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
          {LEVEL_CONFIG.map((_, i) => {
            const lvl = i + 1;
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

        <div className="oa-demo">
          {['chat', 'âne', 'lion'].map((w, i) => (
            <div key={i} className="oa-demo-word">{w}</div>
          ))}
          <div className="oa-demo-arrow">→</div>
          {['âne', 'chat', 'lion'].map((w, i) => (
            <div key={i} className="oa-demo-word oa-demo-word--sorted">{w}</div>
          ))}
        </div>
        <div className="oa-info-row">
          <span>📝 {cfg.rounds} séries</span>
          <span>⏱ {cfg.roundTime}s par série</span>
        </div>
        <button className="oa-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>
          ▶ Jouer
        </button>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = score >= cfg.rounds * 0.9 ? 3 : score >= cfg.rounds * 0.6 ? 2 : 1;
    const msg = stars === 3 ? '🎉 Excellent !' : stars === 2 ? '👍 Bien !' : '📚 Continue !';
    return (
      <div className="oa-page">
        <h2 className="oa-result-title">{msg}</h2>
        <div className="jeux-stars">{'★'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
        {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
        {sessionResult?.newUnlocked && <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} débloqué !</div>}
        {sessionResult && <div className="jeux-session-time">⏱ {sessionResult.timeSecs}s</div>}
        <div className="jeux-result-stat"><span>Séries réussies</span><span>{score} / {cfg.rounds}</span></div>
        <div className="oa-result-btns">
          <button className="oa-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <button className="oa-cta oa-cta--soft" onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}>Niveaux</button>
          <Link to="/jeux" className="oa-cta oa-cta--soft">← Jeux</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="oa-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="oa-hud">
        <span className="oa-score">✅ {score}</span>
        <span className="oa-round">{roundNum + 1} / {cfg.rounds}</span>
        <span className={`oa-timer${timeLeft <= 10 ? ' oa-timer--urgent' : ''}`}>⏱ {timeLeft}s</span>
      </div>

      <div className="oa-timer-bar">
        <div
          className={`oa-timer-fill${timeLeft <= 10 ? ' oa-timer-fill--urgent' : ''}`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      <p className="oa-instruction">Tape les mots dans l'ordre alphabétique</p>

      <div className="oa-order-slots">
        {sortedWords.map((_, i) => (
          <div key={i} className={`oa-slot${i < selected.length ? ' oa-slot--filled' : ''}`}>
            {i < selected.length ? selected[i] : (i + 1)}
          </div>
        ))}
      </div>

      <div className="oa-words">
        {displayWords.map((word, i) => {
          const isSelected = selected.includes(word);
          const isShaking = shakeIdx === i;
          let cls = 'oa-word-btn';
          if (isSelected) cls += ' oa-word-btn--correct';
          if (isShaking) cls += ' oa-word-btn--shake';
          return (
            <button
              key={i}
              className={cls}
              onPointerDown={e => { e.preventDefault(); handleTap(word); }}
              disabled={isSelected}
            >
              {word}
            </button>
          );
        })}
      </div>

      {roundOver && timeLeft === 0 && (
        <div className="oa-timeout-msg">⏱ Temps écoulé !</div>
      )}
    </div>
  );
}
