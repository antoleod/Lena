import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

const CATEGORIES = [
  { name: 'Animaux', emoji: '🐾', words: ['CHAT', 'CHIEN', 'LION', 'OURS', 'LAPIN', 'TIGRE'] },
  { name: 'Fruits', emoji: '🍎', words: ['POMME', 'CITRON', 'RAISIN', 'MANGUE', 'CERISE'] },
  { name: 'Pays', emoji: '🌍', words: ['FRANCE', 'ITALIE', 'ESPAGNE', 'BELGIQUE', 'SUISSE'] },
  { name: 'Couleurs', emoji: '🎨', words: ['ROUGE', 'BLEU', 'VERT', 'JAUNE', 'VIOLET', 'ORANGE'] },
  { name: 'Corps', emoji: '🦷', words: ['BOUCHE', 'OREILLE', 'JAMBE', 'DOIGT', 'GENOU'] },
];

const ALL_WORDS = CATEGORIES.flatMap(cat =>
  cat.words.map(w => ({ word: w, category: cat.name, emoji: cat.emoji }))
);

const LEVELS = [
  { label: 'N1 — Court', key: 'n1', emoji: '🔤', minLen: 3, maxLen: 4 },
  { label: 'N2 — Moyen', key: 'n2', emoji: '🔡', minLen: 5, maxLen: 6 },
  { label: 'N3 — Long', key: 'n3', emoji: '📝', minLen: 7, maxLen: 20 },
];

const GAME_SIZE = 10;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function scramble(word) {
  let arr = word.split('');
  let shuffled;
  let attempts = 0;
  do {
    shuffled = shuffle(arr);
    attempts++;
  } while (shuffled.join('') === word && attempts < 20);
  return shuffled;
}

function calcStars(score, total) {
  const pct = score / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.6) return 2;
  return pct >= 0.3 ? 1 : 0;
}

export default function AnagrammesPage() {
  const { progress, saveSession, resetTimer } = useGameSession('anagrammes');
  const [phase, setPhase] = useState('setup');
  const [levelIdx, setLevelIdx] = useState(0);
  const [words, setWords] = useState([]);
  const [wIdx, setWIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [tiles, setTiles] = useState([]); // { letter, used: bool }
  const [slots, setSlots] = useState([]); // { letter | null }
  const [tries, setTries] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct'|'wrong'|null
  const [result, setResult] = useState(null);

  const startGame = useCallback((idx) => {
    const cfg = LEVELS[idx];
    setLevelIdx(idx);
    const pool = ALL_WORDS.filter(w => w.word.length >= cfg.minLen && w.word.length <= cfg.maxLen);
    const selected = shuffle(pool).slice(0, Math.min(GAME_SIZE, pool.length));
    setWords(selected);
    setWIdx(0);
    setScore(0);
    setTries(0);
    setFeedback(null);
    resetTimer();
    // init first word
    const first = selected[0];
    if (first) {
      const sc = scramble(first.word);
      setTiles(sc.map(l => ({ letter: l, used: false })));
      setSlots(Array(first.word.length).fill(null));
    }
    setPhase('play');
  }, [resetTimer]);

  // Load a word onto the board
  const loadWord = useCallback((entry) => {
    const sc = scramble(entry.word);
    setTiles(sc.map(l => ({ letter: l, used: false })));
    setSlots(Array(entry.word.length).fill(null));
    setTries(0);
    setFeedback(null);
  }, []);

  const tapTile = useCallback((tileIdx) => {
    if (feedback) return;
    setTiles(prev => {
      if (prev[tileIdx].used) return prev;
      const next = prev.map((t, i) => i === tileIdx ? { ...t, used: true } : t);
      setSlots(s => {
        const emptyIdx = s.findIndex(v => v === null);
        if (emptyIdx === -1) return s;
        const ns = [...s];
        ns[emptyIdx] = { letter: prev[tileIdx].letter, tileIdx };
        return ns;
      });
      return next;
    });
  }, [feedback]);

  const tapSlot = useCallback((slotIdx) => {
    if (feedback) return;
    setSlots(prev => {
      const slot = prev[slotIdx];
      if (!slot) return prev;
      setTiles(t => t.map((tile, i) => i === slot.tileIdx ? { ...tile, used: false } : tile));
      const ns = [...prev];
      ns[slotIdx] = null;
      return ns;
    });
  }, [feedback]);

  // Auto-check when all slots filled
  useEffect(() => {
    if (phase !== 'play' || words.length === 0) return;
    const current = words[wIdx];
    if (!current) return;
    if (slots.some(s => s === null)) return;

    const built = slots.map(s => s.letter).join('');
    const isCorrect = built === current.word;
    const newTries = tries + 1;
    setTries(newTries);

    if (isCorrect) {
      const pts = newTries === 1 ? 2 : newTries === 2 ? 1 : 0;
      setFeedback('correct');
      setScore(s => s + pts);
      setTimeout(() => {
        const nextIdx = wIdx + 1;
        if (nextIdx >= words.length) {
          const finalScore = score + pts;
          const stars = calcStars(finalScore, words.length * 2);
          const res = saveSession({ score: finalScore, level: levelIdx + 1, stars });
          setResult({ score: finalScore, stars, ...res });
          setPhase('results');
        } else {
          setWIdx(nextIdx);
          loadWord(words[nextIdx]);
        }
      }, 900);
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        // reset slots and tiles
        const entry = words[wIdx];
        const sc = scramble(entry.word);
        setTiles(sc.map(l => ({ letter: l, used: false })));
        setSlots(Array(entry.word.length).fill(null));
        if (newTries >= 3) {
          // auto advance
          setTimeout(() => {
            const nextIdx = wIdx + 1;
            if (nextIdx >= words.length) {
              const stars = calcStars(score, words.length * 2);
              const res = saveSession({ score, level: levelIdx + 1, stars });
              setResult({ score, stars, ...res });
              setPhase('results');
            } else {
              setWIdx(nextIdx);
              loadWord(words[nextIdx]);
            }
          }, 800);
        } else {
          setFeedback(null);
        }
      }, 700);
    }
  }, [slots]); // eslint-disable-line react-hooks/exhaustive-deps

  const best = progress?.bestScore ?? 0;
  const cfg = LEVELS[levelIdx];

  if (phase === 'setup') {
    return (
      <div className="sm-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="sm-setup">
          <div className="sm-setup__hero">
            <div className="sm-setup__emoji">🔤</div>
            <h1 className="sm-setup__title">Anagrammes</h1>
            <p className="sm-setup__sub">Remets les lettres dans le bon ordre !</p>
            {best > 0 && <p className="sm-setup__sub">Meilleur score : {best}</p>}
          </div>
          <div className="sm-level-section">
            <p className="sm-level-title">Choisir un niveau</p>
            <div className="jeux-level-grid">
              {LEVELS.map((lv, i) => (
                <button key={lv.key} className="jeux-level-btn" onClick={() => startGame(i)}>
                  <span>{lv.emoji}</span>
                  <span>{lv.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'results') {
    return (
      <div className="sm-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="game-results">
          <div className="game-results__emoji">🔤</div>
          <h2 className="game-results__title">Résultat</h2>
          <div className="game-results__stars">{'⭐'.repeat(result.stars)}{'☆'.repeat(3 - result.stars)}</div>
          <div className="game-results__stats">
            <div className="game-results__stat"><span>Points</span><strong>{result.score}</strong></div>
            {result.isNewBest && <div className="jeux-new-best">Nouveau record !</div>}
          </div>
          <button className="game-results__btn" onClick={() => startGame(levelIdx)}>Rejouer</button>
          <button className="game-results__btn" style={{marginTop:8}} onClick={() => setPhase('setup')}>Menu</button>
        </div>
      </div>
    );
  }

  const current = words[wIdx];
  return (
    <div className="sm-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="game-hud">
        <span className="game-hud__score">Points : {score}</span>
        <span className="game-hud__round">{wIdx + 1}/{words.length}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px', gap: 16, alignItems: 'center' }}>
        <div className="game-question-card" style={{ width: '100%', textAlign: 'center' }}>
          <div className="game-question-sub">{current.emoji} {current.category}</div>
          <div className="game-question-text" style={{ fontSize: '1rem', opacity: 0.7 }}>
            {cfg.emoji} {cfg.label} — essai {tries + 1}/3
          </div>
        </div>

        {/* Slots */}
        <div className="ws-slots" style={{ width: '100%' }}>
          {slots.map((s, i) => (
            <div key={i} className={`ws-slot${s ? ' is-filled' : ''}${feedback === 'correct' ? ' is-correct' : ''}${feedback === 'wrong' && s ? ' is-wrong' : ''}`}
              onClick={() => tapSlot(i)}>
              {s ? s.letter : ''}
            </div>
          ))}
        </div>

        {/* Tiles */}
        <div className="ws-tiles">
          {tiles.map((t, i) => (
            <button key={i} className={`ws-tile${t.used ? ' is-used' : ''}`}
              onClick={() => tapTile(i)} disabled={t.used}>
              {t.letter}
            </button>
          ))}
        </div>

        {feedback === 'wrong' && tries < 3 && (
          <p style={{ color: '#f87171', fontWeight: 700, fontSize: '0.9rem' }}>
            Pas tout à fait ! Réessaie.
          </p>
        )}
        {feedback === 'wrong' && tries >= 3 && (
          <p style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.9rem' }}>
            La réponse était : {current.word}
          </p>
        )}
      </div>
    </div>
  );
}
