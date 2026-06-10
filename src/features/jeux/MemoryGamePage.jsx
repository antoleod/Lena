import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import './jeux.css';

const UI = {
  fr: {
    title: 'Jeu de Memory',
    gridLabel: 'Grille',
    themeLabel: 'Theme',
    small: 'Petite (4x3)',
    large: 'Grande (4x4)',
    animals: 'Animaux',
    fruits: 'Fruits',
    numbers: 'Chiffres',
    play: 'Jouer !',
    moves: 'Coups',
    pairs: 'Paires',
    time: 'Temps',
    win: 'Bravo !',
    stars: (n) => `${n} etoile${n > 1 ? 's' : ''}`,
    playAgain: 'Rejouer',
    settings: 'Parametres',
    seconds: (s) => `${s}s`,
  },
  nl: {
    title: 'Memory Spel',
    gridLabel: 'Raster',
    themeLabel: 'Thema',
    small: 'Klein (4x3)',
    large: 'Groot (4x4)',
    animals: 'Dieren',
    fruits: 'Fruit',
    numbers: 'Cijfers',
    play: 'Spelen !',
    moves: 'Zetten',
    pairs: 'Paren',
    time: 'Tijd',
    win: 'Geweldig !',
    stars: (n) => `${n} ster${n > 1 ? 'ren' : ''}`,
    playAgain: 'Opnieuw',
    settings: 'Instellingen',
    seconds: (s) => `${s}s`,
  },
  en: {
    title: 'Memory Game',
    gridLabel: 'Grid',
    themeLabel: 'Theme',
    small: 'Small (4x3)',
    large: 'Large (4x4)',
    animals: 'Animals',
    fruits: 'Fruits',
    numbers: 'Numbers',
    play: 'Play !',
    moves: 'Moves',
    pairs: 'Pairs',
    time: 'Time',
    win: 'Well done !',
    stars: (n) => `${n} star${n > 1 ? 's' : ''}`,
    playAgain: 'Play again',
    settings: 'Settings',
    seconds: (s) => `${s}s`,
  },
  es: {
    title: 'Juego de Memoria',
    gridLabel: 'Cuadricula',
    themeLabel: 'Tema',
    small: 'Pequena (4x3)',
    large: 'Grande (4x4)',
    animals: 'Animales',
    fruits: 'Frutas',
    numbers: 'Numeros',
    play: 'Jugar !',
    moves: 'Movimientos',
    pairs: 'Parejas',
    time: 'Tiempo',
    win: 'Bien hecho !',
    stars: (n) => `${n} estrella${n > 1 ? 's' : ''}`,
    playAgain: 'Jugar de nuevo',
    settings: 'Ajustes',
    seconds: (s) => `${s}s`,
  },
};

const THEMES = {
  animals: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🦁','🐮','🐷'],
  fruits:  ['🍎','🍊','🍋','🍇','🍓','🍑','🍒','🥝','🍍','🥭','🍈','🫐'],
  numbers: [
    ['1','①'],['2','②'],['3','③'],['4','④'],['5','⑤'],['6','⑥'],
    ['7','⑦'],['8','⑧'],['9','⑨'],['10','⑩'],['11','⑪'],['12','⑫'],
  ],
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildCards(gridSize, theme) {
  const pairCount = gridSize === 'small' ? 6 : 8;
  const raw = THEMES[theme].slice(0, pairCount);
  let pairs = [];

  if (theme === 'numbers') {
    raw.forEach(([a, b], idx) => {
      pairs.push({ pairId: idx, face: a });
      pairs.push({ pairId: idx, face: b });
    });
  } else {
    raw.forEach((emoji, idx) => {
      pairs.push({ pairId: idx, face: emoji });
      pairs.push({ pairId: idx, face: emoji });
    });
  }

  return shuffle(pairs).map((p, i) => ({
    id: i,
    pairId: p.pairId,
    face: p.face,
    isFlipped: false,
    isMatched: false,
  }));
}

function calcStars(moves, pairCount) {
  if (moves <= pairCount * 2.5) return 3;
  if (moves <= pairCount * 3.5) return 2;
  return 1;
}

export default function MemoryGamePage() {
  const { locale } = useLocale();
  const ui = UI[locale] || UI.fr;

  const [phase, setPhase] = useState('setup');
  const [gridSize, setGridSize] = useState('small');
  const [theme, setTheme] = useState('animals');

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [pairsFound, setPairsFound] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [checking, setChecking] = useState(false);

  const checkTimeoutRef = useRef(null);
  const timerRef = useRef(null);

  const pairCount = gridSize === 'small' ? 6 : 8;

  // Timer tick
  useEffect(() => {
    if (phase !== 'play') return;
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 500);
    return () => clearInterval(timerRef.current);
  }, [phase, startTime]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      clearTimeout(checkTimeoutRef.current);
      clearInterval(timerRef.current);
    };
  }, []);

  function startGame() {
    const built = buildCards(gridSize, theme);
    setCards(built);
    setFlipped([]);
    setMoves(0);
    setPairsFound(0);
    setElapsed(0);
    setChecking(false);
    setStartTime(Date.now());
    setPhase('play');
  }

  const handleCardClick = useCallback((cardId) => {
    if (checking) return;

    setCards(prev => {
      const card = prev.find(c => c.id === cardId);
      if (!card || card.isFlipped || card.isMatched) return prev;
      return prev.map(c => c.id === cardId ? { ...c, isFlipped: true } : c);
    });

    setFlipped(prev => {
      const card = cards.find(c => c.id === cardId);
      if (!card || card.isFlipped || card.isMatched) return prev;
      if (prev.length === 1 && prev[0] === cardId) return prev;

      const next = [...prev, cardId];

      if (next.length === 2) {
        setMoves(m => m + 1);
        setChecking(true);

        checkTimeoutRef.current = setTimeout(() => {
          setCards(prevCards => {
            const [idA, idB] = next;
            const a = prevCards.find(c => c.id === idA);
            const b = prevCards.find(c => c.id === idB);
            if (a && b && a.pairId === b.pairId) {
              const updated = prevCards.map(c =>
                c.id === idA || c.id === idB ? { ...c, isMatched: true } : c
              );
              const newPairsFound = updated.filter(c => c.isMatched).length / 2;
              setPairsFound(newPairsFound);
              if (newPairsFound >= pairCount) {
                clearInterval(timerRef.current);
                setElapsed(Math.floor((Date.now() - startTime) / 1000));
                setTimeout(() => setPhase('results'), 400);
              }
              return updated;
            } else {
              return prevCards.map(c =>
                c.id === idA || c.id === idB ? { ...c, isFlipped: false } : c
              );
            }
          });
          setFlipped([]);
          setChecking(false);
        }, 800);

        return next;
      }

      return next;
    });
  }, [checking, cards, pairCount, startTime]);

  function renderSetup() {
    return (
      <div className="cahier-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="cahier-title">{ui.title}</h1>

        <div className="cahier-section">
          <div className="cahier-section-title">{ui.gridLabel}</div>
          <div className="cahier-chips">
            <button
              className={`cahier-chip${gridSize === 'small' ? ' is-selected' : ''}`}
              onClick={() => setGridSize('small')}
            >
              {ui.small}
            </button>
            <button
              className={`cahier-chip${gridSize === 'large' ? ' is-selected' : ''}`}
              onClick={() => setGridSize('large')}
            >
              {ui.large}
            </button>
          </div>
        </div>

        <div className="cahier-section">
          <div className="cahier-section-title">{ui.themeLabel}</div>
          <div className="cahier-chips">
            {['animals', 'fruits', 'numbers'].map(t => (
              <button
                key={t}
                className={`cahier-chip${theme === t ? ' is-selected' : ''}`}
                onClick={() => setTheme(t)}
              >
                {ui[t]}
              </button>
            ))}
          </div>
        </div>

        <button className="cahier-cta" onClick={startGame}>
          {ui.play}
        </button>
      </div>
    );
  }

  function renderPlay() {
    const gridClass = gridSize === 'small' ? 'memory-grid--sm' : 'memory-grid--lg';
    return (
      <div className="cahier-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h2 style={{ textAlign: 'center', margin: '8px 0 0', fontSize: '1.1rem', fontWeight: 700 }}>
          {ui.title}
        </h2>

        <div className="memory-stats">
          <div className="memory-stat">
            <span>{moves}</span>
            <span className="memory-stat__label">{ui.moves}</span>
          </div>
          <div className="memory-stat">
            <span>{pairsFound}/{pairCount}</span>
            <span className="memory-stat__label">{ui.pairs}</span>
          </div>
          <div className="memory-stat">
            <span>{ui.seconds(elapsed)}</span>
            <span className="memory-stat__label">{ui.time}</span>
          </div>
        </div>

        <div className={`memory-grid ${gridClass}`}>
          {cards.map(card => {
            let cls = 'memory-card';
            if (card.isMatched) cls += ' is-matched';
            else if (card.isFlipped) cls += ' is-flipped';
            return (
              <button
                key={card.id}
                className={cls}
                onClick={() => handleCardClick(card.id)}
                disabled={card.isMatched || card.isFlipped || checking}
              >
                {card.isFlipped || card.isMatched ? card.face : '?'}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  function renderResults() {
    const stars = calcStars(moves, pairCount);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    return (
      <div className="cahier-page">
        <h2 style={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 900, margin: '24px 0 8px' }}>
          {ui.win}
        </h2>

        <div className="jeux-stars">{starStr}</div>
        <div style={{ textAlign: 'center', fontSize: '1rem', opacity: .8, marginBottom: 16 }}>
          {ui.stars(stars)}
        </div>

        <div className="jeux-result-stat">
          <span>{ui.moves}</span>
          <span>{moves}</span>
        </div>
        <div className="jeux-result-stat">
          <span>{ui.time}</span>
          <span>{ui.seconds(elapsed)}</span>
        </div>
        <div className="jeux-result-stat">
          <span>{ui.pairs}</span>
          <span>{pairCount}/{pairCount}</span>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button className="cahier-cta" style={{ flex: 1 }} onClick={startGame}>
            {ui.playAgain}
          </button>
          <button className="cahier-cta cahier-cta--soft" style={{ flex: 1 }} onClick={() => setPhase('setup')}>
            {ui.settings}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'setup') return renderSetup();
  if (phase === 'play') return renderPlay();
  return renderResults();
}
