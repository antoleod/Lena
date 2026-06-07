import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

// ── Story pools ────────────────────────────────────────────────────────────

const STORIES_4 = [
  {
    frames: [
      { emoji: '🌱', label: 'Planter une graine' },
      { emoji: '💧', label: 'Arroser' },
      { emoji: '🌿', label: 'Pousser' },
      { emoji: '🌸', label: 'Fleurir' },
    ],
  },
  {
    frames: [
      { emoji: '🥚', label: 'Un oeuf' },
      { emoji: '🐣', label: 'Eclosion' },
      { emoji: '🐥', label: 'Poussin' },
      { emoji: '🐓', label: 'Poulet adulte' },
    ],
  },
  {
    frames: [
      { emoji: '😴', label: 'Se reveiller' },
      { emoji: '🧼', label: 'Se laver' },
      { emoji: '🥣', label: 'Petit-dejeuner' },
      { emoji: '🎒', label: "Aller a l'ecole" },
    ],
  },
  {
    frames: [
      { emoji: '🌧️', label: 'Pluie' },
      { emoji: '💧', label: 'Flaque' },
      { emoji: '☀️', label: 'Soleil' },
      { emoji: '🌈', label: 'Arc-en-ciel' },
    ],
  },
  {
    frames: [
      { emoji: '🍎', label: 'Manger' },
      { emoji: '🍽️', label: 'Assiette vide' },
      { emoji: '🙂', label: 'Content' },
      { emoji: '💪', label: "Plein d'energie" },
    ],
  },
  {
    frames: [
      { emoji: '🌑', label: 'Nuit' },
      { emoji: '🌅', label: 'Aube' },
      { emoji: '☀️', label: 'Jour' },
      { emoji: '🌇', label: 'Coucher de soleil' },
    ],
  },
  {
    frames: [
      { emoji: '🐛', label: 'Chenille' },
      { emoji: '🍃', label: 'Mange les feuilles' },
      { emoji: '🫘', label: 'Chrysalide' },
      { emoji: '🦋', label: 'Papillon' },
    ],
  },
  {
    frames: [
      { emoji: '☁️', label: 'Nuage' },
      { emoji: '🌧️', label: 'Pluie' },
      { emoji: '🏞️', label: 'Riviere' },
      { emoji: '🌊', label: 'Mer' },
    ],
  },
  {
    frames: [
      { emoji: '🎂', label: 'Anniversaire prepare' },
      { emoji: '🎉', label: 'Fete' },
      { emoji: '🎁', label: 'Cadeau ouvert' },
      { emoji: '😄', label: 'Heureux' },
    ],
  },
  {
    frames: [
      { emoji: '🛒', label: 'Courses' },
      { emoji: '🍳', label: 'Cuisiner' },
      { emoji: '🍽️', label: 'Servir' },
      { emoji: '😋', label: 'Manger' },
    ],
  },
  // Extra for N3 (more abstract)
  {
    frames: [
      { emoji: '🌰', label: 'Gland' },
      { emoji: '🌱', label: 'Pousse' },
      { emoji: '🌳', label: 'Grand chene' },
      { emoji: '🍂', label: 'Feuilles tombent' },
    ],
  },
  {
    frames: [
      { emoji: '📝', label: 'Ecrire' },
      { emoji: '✉️', label: 'Enveloppe' },
      { emoji: '📮', label: 'Boite aux lettres' },
      { emoji: '😊', label: 'Recevoir' },
    ],
  },
];

const STORIES_5 = [
  {
    frames: [
      { emoji: '🌱', label: 'Planter' },
      { emoji: '🌿', label: 'Pousser' },
      { emoji: '🌳', label: 'Grand arbre' },
      { emoji: '🪓', label: 'Couper' },
      { emoji: '🪵', label: 'Bois' },
    ],
  },
  {
    frames: [
      { emoji: '☁️', label: 'Nuage' },
      { emoji: '🌧️', label: 'Pluie' },
      { emoji: '💧', label: 'Gouttes' },
      { emoji: '🌊', label: 'Riviere' },
      { emoji: '🏊', label: 'Nager' },
    ],
  },
  {
    frames: [
      { emoji: '🥚', label: 'Oeuf' },
      { emoji: '🐣', label: 'Eclosion' },
      { emoji: '🐥', label: 'Poussin' },
      { emoji: '🐔', label: 'Poule' },
      { emoji: '🍳', label: 'Omelette' },
    ],
  },
  {
    frames: [
      { emoji: '🌾', label: 'Ble pousse' },
      { emoji: '🌾🚜', label: 'Recolte' },
      { emoji: '⚙️', label: 'Moulin' },
      { emoji: '🌾', label: 'Farine' },
      { emoji: '🍞', label: 'Pain' },
    ],
  },
  {
    frames: [
      { emoji: '🐛', label: 'Chenille' },
      { emoji: '🍃', label: 'Mange' },
      { emoji: '🫘', label: 'Chrysalide' },
      { emoji: '🦋', label: 'Papillon' },
      { emoji: '🌸', label: 'Butine' },
    ],
  },
  {
    frames: [
      { emoji: '🧑‍🎓', label: 'Etudier' },
      { emoji: '📚', label: 'Lire' },
      { emoji: '✍️', label: 'Ecrire' },
      { emoji: '📝', label: 'Passer examen' },
      { emoji: '🎓', label: 'Diplome' },
    ],
  },
  {
    frames: [
      { emoji: '🌑', label: 'Nouvelle lune' },
      { emoji: '🌒', label: 'Croissant' },
      { emoji: '🌕', label: 'Pleine lune' },
      { emoji: '🌘', label: 'Decroissant' },
      { emoji: '🌑', label: 'Nuit noire' },
    ],
  },
  {
    frames: [
      { emoji: '💡', label: 'Idee' },
      { emoji: '📐', label: 'Planifier' },
      { emoji: '🔨', label: 'Construire' },
      { emoji: '🏠', label: 'Maison' },
      { emoji: '👨‍👩‍👧', label: 'Famille heureuse' },
    ],
  },
  {
    frames: [
      { emoji: '🌧️', label: 'Pluie' },
      { emoji: '💧', label: 'Flaque' },
      { emoji: '☀️', label: 'Soleil' },
      { emoji: '💨', label: 'Vent' },
      { emoji: '🌈', label: 'Arc-en-ciel' },
    ],
  },
  {
    frames: [
      { emoji: '🎄', label: 'Sapin' },
      { emoji: '⭐', label: 'Etoile' },
      { emoji: '🎁', label: 'Cadeaux' },
      { emoji: '🎅', label: 'Pere Noel' },
      { emoji: '😄', label: 'Joie' },
    ],
  },
  {
    frames: [
      { emoji: '🏃', label: 'Courir' },
      { emoji: '😓', label: 'Fatiguer' },
      { emoji: '💧', label: 'Boire' },
      { emoji: '😤', label: 'Reprendre souffle' },
      { emoji: '🏅', label: 'Medaille' },
    ],
  },
  {
    frames: [
      { emoji: '🐠', label: 'Poisson' },
      { emoji: '🎣', label: 'Peche' },
      { emoji: '🍳', label: 'Cuisiner' },
      { emoji: '🍽️', label: 'Servir' },
      { emoji: '😋', label: 'Deguster' },
    ],
  },
  {
    frames: [
      { emoji: '☀️', label: 'Soleil' },
      { emoji: '🌡️', label: 'Chaleur' },
      { emoji: '😰', label: 'Transpirer' },
      { emoji: '🌊', label: 'Plage' },
      { emoji: '🏖️', label: 'Vacances' },
    ],
  },
  {
    frames: [
      { emoji: '🌰', label: 'Gland tombe' },
      { emoji: '🐿️', label: 'Ecureuil ramasse' },
      { emoji: '❄️', label: 'Hiver' },
      { emoji: '🐿️😴', label: 'Hiberner' },
      { emoji: '🌱', label: 'Printemps' },
    ],
  },
  {
    frames: [
      { emoji: '📧', label: 'Email recu' },
      { emoji: '📖', label: 'Lire' },
      { emoji: '💭', label: 'Reflechir' },
      { emoji: '✍️', label: 'Repondre' },
      { emoji: '📨', label: 'Envoyer' },
    ],
  },
];

const LEVEL_CONFIG = [
  { n: 1, label: 'Niveau 1', desc: '3 images, 10 histoires', stories: STORIES_4.slice(0, 10), frameCount: 3, roundSize: 10 },
  { n: 2, label: 'Niveau 2', desc: '4 images, 10 histoires', stories: STORIES_4.slice(0, 10), frameCount: 4, roundSize: 10 },
  { n: 3, label: 'Niveau 3', desc: '4 images, 12 histoires (abstrait)', stories: STORIES_4, frameCount: 4, roundSize: 12 },
  { n: 4, label: 'Niveau 4', desc: '5 images, 12 histoires', stories: STORIES_5, frameCount: 5, roundSize: 12 },
  { n: 5, label: 'Niveau 5', desc: '5 images, 15 histoires', stories: STORIES_5, frameCount: 5, roundSize: 15 },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffledOrder(n) {
  return shuffle(Array.from({ length: n }, (_, i) => i));
}

function buildRound(cfg) {
  return shuffle(cfg.stories).slice(0, cfg.roundSize);
}

function calcStars(score, total) {
  const pct = score / total;
  if (pct >= 0.83) return 3;
  if (pct >= 0.7)  return 2;
  return 1;
}

export default function SequenceImagePage() {
  const { progress, saveSession, resetTimer } = useGameSession('histoire-ordre');

  const [phase, setPhase]       = useState('setup');
  const [levelNum, setLevelNum] = useState(progress.unlockedLevel);
  const [stories, setStories]   = useState([]);
  const [storyIdx, setStoryIdx] = useState(0);
  const [score, setScore]       = useState(0);
  const [displayOrder, setDisplayOrder] = useState([]);
  const [tappedOrder, setTappedOrder]   = useState([]);
  const [shaking, setShaking]   = useState(false);
  const [flashing, setFlashing] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const cfg = LEVEL_CONFIG[levelNum - 1];

  function startGame() {
    resetTimer();
    const round = buildRound(cfg);
    setStories(round);
    setStoryIdx(0);
    setScore(0);
    setDisplayOrder(shuffledOrder(cfg.frameCount));
    setTappedOrder([]);
    setShaking(false);
    setFlashing(false);
    setPhase('play');
  }

  const frameCount = cfg.frameCount;

  const handleTap = useCallback((displayPos) => {
    if (shaking || flashing) return;
    if (tappedOrder.includes(displayPos)) return;
    const newTapped = [...tappedOrder, displayPos];
    setTappedOrder(newTapped);

    if (newTapped.length === frameCount) {
      // displayOrder maps displayPos -> originalIdx; we want originalIdx == tapIdx
      const correct = newTapped.every((dPos, tapIdx) => displayOrder[dPos] === tapIdx);
      if (correct) {
        setFlashing(true);
        setScore(s => s + 1);
        setTimeout(() => {
          setFlashing(false);
          const nextIdx = storyIdx + 1;
          if (nextIdx >= stories.length) {
            const finalScore = score + 1;
            const stars = calcStars(finalScore, stories.length);
            const result = saveSession({ score: finalScore, level: levelNum, stars });
            setScore(finalScore);
            setLastResult(result);
            setPhase('results');
          } else {
            setStoryIdx(nextIdx);
            setDisplayOrder(shuffledOrder(frameCount));
            setTappedOrder([]);
          }
        }, 900);
      } else {
        setShaking(true);
        setTimeout(() => {
          setShaking(false);
          setTappedOrder([]);
        }, 700);
      }
    }
  }, [tappedOrder, displayOrder, storyIdx, stories, shaking, flashing, score, frameCount, levelNum, saveSession]);

  // ── Setup ──────────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="hi-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, textAlign: 'center', margin: '16px 0 4px' }}>
          Histoire en Ordre
        </h1>
        <p style={{ textAlign: 'center', opacity: .7, fontSize: '.9rem', marginBottom: 8 }}>
          Remets les images dans le bon ordre
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
                <span style={{ fontSize: '.75rem', opacity: .8 }}>{lv.desc}</span>
                {locked && <span style={{ fontSize: '.7rem' }}>🔒</span>}
              </button>
            );
          })}
        </div>

        <button
          className="hi-cta"
          style={{ marginTop: 16 }}
          onPointerDown={e => { e.preventDefault(); startGame(); }}
        >
          Jouer !
        </button>
      </div>
    );
  }

  // ── Results ────────────────────────────────────────────────────────────────
  if (phase === 'results') {
    const stars = calcStars(score, stories.length);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    return (
      <div className="hi-page">
        <h2 className="hi-result-title">
          {stars === 3 ? '🎉 Parfait !' : stars === 2 ? '👍 Bien joue !' : '📖 Continue !'}
        </h2>
        <div className="jeux-stars">{starStr}</div>
        {lastResult?.isNewBest && <div className="jeux-new-best">Nouveau record !</div>}
        {lastResult?.newUnlocked && (
          <div className="jeux-unlocked">Niveau {levelNum + 1} debloque !</div>
        )}
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {stories.length}</span></div>
        <div className="jeux-result-stat"><span>Niveau</span><span>N{levelNum}</span></div>
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button className="hi-cta" style={{ flex: 1 }} onPointerDown={e => { e.preventDefault(); startGame(); }}>
            Rejouer
          </button>
          <button className="hi-cta" style={{ flex: 1, background: 'rgba(255,255,255,.12)' }}
            onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}
          >
            Niveaux
          </button>
        </div>
        <Link to="/jeux" className="hi-back-link">← Retour aux jeux</Link>
      </div>
    );
  }

  // ── Play ───────────────────────────────────────────────────────────────────
  const story = stories[storyIdx];
  const usedFrames = story.frames.slice(0, frameCount);

  return (
    <div className="hi-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="hi-hud">
        <span className="hi-progress">Histoire {storyIdx + 1} / {stories.length}</span>
        <span className="hi-score">⭐ {score}  N{levelNum}</span>
      </div>

      <div className="hi-instruction">
        Tape les images dans le bon ordre (1 → {frameCount})
      </div>

      <div className={`hi-grid${shaking ? ' hi-grid--shake' : ''}${flashing ? ' hi-grid--flash' : ''}`}
        style={{ gridTemplateColumns: frameCount <= 4 ? `repeat(${frameCount}, 1fr)` : 'repeat(3, 1fr)' }}
      >
        {displayOrder.map((originalIdx, displayPos) => {
          const frame = usedFrames[originalIdx];
          const tapPos = tappedOrder.indexOf(displayPos);
          const isTapped = tapPos !== -1;
          return (
            <button
              key={displayPos}
              className={`hi-frame${isTapped ? ' hi-frame--tapped' : ''}`}
              onPointerDown={e => { e.preventDefault(); handleTap(displayPos); }}
            >
              <span className="hi-frame-emoji">{frame.emoji}</span>
              <span className="hi-frame-label">{frame.label}</span>
              {isTapped && <span className="hi-frame-badge">{tapPos + 1}</span>}
            </button>
          );
        })}
      </div>

      {tappedOrder.length > 0 && tappedOrder.length < frameCount && (
        <button
          className="hi-reset-btn"
          onPointerDown={e => { e.preventDefault(); setTappedOrder([]); }}
        >
          ↺ Recommencer
        </button>
      )}
    </div>
  );
}
