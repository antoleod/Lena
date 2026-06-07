import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

const ALL_STORIES = [
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
      { emoji: '🥚', label: 'Un œuf' },
      { emoji: '🐣', label: 'Éclosion' },
      { emoji: '🐥', label: 'Poussin' },
      { emoji: '🐓', label: 'Poulet adulte' },
    ],
  },
  {
    frames: [
      { emoji: '😴', label: 'Se réveiller' },
      { emoji: '🧼', label: 'Se laver' },
      { emoji: '🥣', label: 'Petit-déjeuner' },
      { emoji: '🎒', label: "Aller à l'école" },
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
      { emoji: '💪', label: "Plein d'énergie" },
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
      { emoji: '🏞️', label: 'Rivière' },
      { emoji: '🌊', label: 'Mer' },
    ],
  },
  {
    frames: [
      { emoji: '🎂', label: 'Anniversaire préparé' },
      { emoji: '🎉', label: 'Fête' },
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
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Returns shuffled indices relative to original order
function shuffledOrder() {
  const order = [0, 1, 2, 3];
  return shuffle(order);
}

function calcStars(score) {
  if (score >= 10) return 3;
  if (score >= 7) return 2;
  return 1;
}

export default function SequenceImagePage() {
  const [phase, setPhase] = useState('play');
  const [storyIdx, setStoryIdx] = useState(0);
  const [score, setScore] = useState(0);
  // displayOrder: array of 4 original-indices, showing frames in this shuffled order
  const [displayOrder, setDisplayOrder] = useState(() => shuffledOrder());
  // tappedOrder: array of displayOrder positions in tap sequence
  const [tappedOrder, setTappedOrder] = useState([]);
  const [shaking, setShaking] = useState(false);
  const [flashing, setFlashing] = useState(false);

  const story = ALL_STORIES[storyIdx];

  function startGame() {
    setStoryIdx(0);
    setScore(0);
    setDisplayOrder(shuffledOrder());
    setTappedOrder([]);
    setShaking(false);
    setFlashing(false);
    setPhase('play');
  }

  const handleTap = useCallback((displayPos) => {
    if (shaking || flashing) return;
    // Already tapped this position?
    if (tappedOrder.includes(displayPos)) return;
    const newTapped = [...tappedOrder, displayPos];
    setTappedOrder(newTapped);

    if (newTapped.length === 4) {
      // Validate: displayOrder[displayPos] should equal tap position (0-indexed)
      const correct = newTapped.every((dPos, tapIdx) => displayOrder[dPos] === tapIdx);
      if (correct) {
        setFlashing(true);
        setScore(s => s + 1);
        setTimeout(() => {
          setFlashing(false);
          if (storyIdx + 1 >= ALL_STORIES.length) {
            setPhase('results');
          } else {
            setStoryIdx(i => i + 1);
            setDisplayOrder(shuffledOrder());
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
  }, [tappedOrder, displayOrder, storyIdx, shaking, flashing]);

  if (phase === 'results') {
    const stars = calcStars(score);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    return (
      <div className="hi-page">
        <h2 className="hi-result-title">
          {stars === 3 ? '🎉 Parfait !' : stars === 2 ? '👍 Bien joué !' : '📖 Continue !'}
        </h2>
        <div className="jeux-stars">{starStr}</div>
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {ALL_STORIES.length}</span></div>
        <button className="hi-cta" style={{ marginTop: 24 }} onPointerDown={e => { e.preventDefault(); startGame(); }}>
          Rejouer
        </button>
        <Link to="/jeux" className="hi-back-link">← Retour aux jeux</Link>
      </div>
    );
  }

  return (
    <div className="hi-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="hi-hud">
        <span className="hi-progress">Histoire {storyIdx + 1} / {ALL_STORIES.length}</span>
        <span className="hi-score">⭐ {score}</span>
      </div>

      <div className="hi-instruction">Tape les images dans le bon ordre (1 → 4)</div>

      <div className={`hi-grid${shaking ? ' hi-grid--shake' : ''}${flashing ? ' hi-grid--flash' : ''}`}>
        {displayOrder.map((originalIdx, displayPos) => {
          const frame = story.frames[originalIdx];
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

      {tappedOrder.length > 0 && tappedOrder.length < 4 && (
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
