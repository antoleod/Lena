import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import '../exerciseGenerator/cahier.css';
import './jeux.css';

const UI = {
  fr: {
    title: 'Mots Melanges',
    category: 'Categorie',
    difficulty: 'Difficulte',
    animals: 'Animaux',
    colors: 'Couleurs',
    numbers: 'Chiffres',
    school: 'Ecole',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
    play: 'Jouer !',
    score: 'Score',
    word: 'Mot',
    of: 'sur',
    win: 'Excellent !',
    playAgain: 'Rejouer',
    settings: 'Parametres',
    hint: 'Indice',
    hintUsed: 'Indice utilise',
  },
  nl: {
    title: 'Woorden Mengen',
    category: 'Categorie',
    difficulty: 'Moeilijkheid',
    animals: 'Dieren',
    colors: 'Kleuren',
    numbers: 'Cijfers',
    school: 'School',
    easy: 'Makkelijk',
    medium: 'Gemiddeld',
    hard: 'Moeilijk',
    play: 'Spelen !',
    score: 'Score',
    word: 'Woord',
    of: 'van',
    win: 'Uitstekend !',
    playAgain: 'Opnieuw',
    settings: 'Instellingen',
    hint: 'Hint',
    hintUsed: 'Hint gebruikt',
  },
  en: {
    title: 'Word Scramble',
    category: 'Category',
    difficulty: 'Difficulty',
    animals: 'Animals',
    colors: 'Colors',
    numbers: 'Numbers',
    school: 'School',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    play: 'Play !',
    score: 'Score',
    word: 'Word',
    of: 'of',
    win: 'Excellent !',
    playAgain: 'Play again',
    settings: 'Settings',
    hint: 'Hint',
    hintUsed: 'Hint used',
  },
  es: {
    title: 'Letras Revueltas',
    category: 'Categoria',
    difficulty: 'Dificultad',
    animals: 'Animales',
    colors: 'Colores',
    numbers: 'Numeros',
    school: 'Escuela',
    easy: 'Facil',
    medium: 'Medio',
    hard: 'Dificil',
    play: 'Jugar !',
    score: 'Puntos',
    word: 'Palabra',
    of: 'de',
    win: 'Excelente !',
    playAgain: 'Jugar de nuevo',
    settings: 'Ajustes',
    hint: 'Pista',
    hintUsed: 'Pista usada',
  },
};

const WORDS = {
  fr: {
    animals:  ['chat','chien','lapin','ours','lion','tigre','girafe','elephant','dauphin','papillon','grenouille','hirondelle'],
    colors:   ['rouge','bleu','vert','jaune','blanc','noir','rose','violet','orange','gris','marron','turquoise'],
    numbers:  ['un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze'],
    school:   ['livre','crayon','cahier','gomme','regle','stylo','classe','bureau','tableau','cartable','professeur','bibliotheque'],
  },
  nl: {
    animals:  ['hond','kat','konijn','beer','leeuw','tijger','giraf','olifant','dolfijn','vlinder','kikker','zwaluw'],
    colors:   ['rood','blauw','groen','geel','wit','zwart','roze','paars','oranje','grijs','bruin','turquoise'],
    numbers:  ['een','twee','drie','vier','vijf','zes','zeven','acht','negen','tien','elf','twaalf'],
    school:   ['boek','potlood','schrift','gum','liniaal','pen','klas','bureau','bord','rugzak','leraar','bibliotheek'],
  },
  en: {
    animals:  ['dog','cat','rabbit','bear','lion','tiger','giraffe','elephant','dolphin','butterfly','frog','swallow'],
    colors:   ['red','blue','green','yellow','white','black','pink','purple','orange','grey','brown','turquoise'],
    numbers:  ['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'],
    school:   ['book','pencil','notebook','eraser','ruler','pen','class','desk','board','backpack','teacher','library'],
  },
  es: {
    animals:  ['perro','gato','conejo','oso','leon','tigre','jirafa','elefante','delfin','mariposa','rana','golondrina'],
    colors:   ['rojo','azul','verde','amarillo','blanco','negro','rosa','violeta','naranja','gris','marron','turquesa'],
    numbers:  ['uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce'],
    school:   ['libro','lapiz','cuaderno','goma','regla','boligrafo','clase','mesa','pizarra','mochila','profesor','biblioteca'],
  },
};

const TOTAL_WORDS = 10;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function filterByDifficulty(words, difficulty) {
  if (difficulty === 'easy')   return words.filter(w => w.length <= 5);
  if (difficulty === 'medium') return words.filter(w => w.length >= 6 && w.length <= 7);
  return words.filter(w => w.length >= 8);
}

function buildWordList(locale, category, difficulty) {
  const pool = WORDS[locale] || WORDS.fr;
  const raw = pool[category] || pool.animals;
  const filtered = filterByDifficulty(raw, difficulty);
  const usable = filtered.length > 0 ? filtered : raw;
  const repeated = [];
  while (repeated.length < TOTAL_WORDS) {
    repeated.push(...shuffle(usable));
  }
  return repeated.slice(0, TOTAL_WORDS);
}

function scrambleWord(word) {
  const letters = word.toUpperCase().split('');
  let scrambled = shuffle(letters);
  // ensure it differs from original if length > 1
  let attempts = 0;
  while (scrambled.join('') === word.toUpperCase() && attempts < 20) {
    scrambled = shuffle(letters);
    attempts++;
  }
  return scrambled.map((l, i) => ({ id: i, letter: l, used: false }));
}

function calcStars(score) {
  if (score === TOTAL_WORDS) return 3;
  if (score >= 7) return 2;
  return 1;
}

export default function WordScramblePage() {
  const { locale } = useLocale();
  const ui = UI[locale] || UI.fr;

  const [phase, setPhase] = useState('setup');
  const [category, setCategory] = useState('animals');
  const [difficulty, setDifficulty] = useState('easy');

  const [wordList, setWordList] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [tiles, setTiles] = useState([]);
  const [slots, setSlots] = useState([]);
  const [score, setScore] = useState(0);
  const [slotState, setSlotState] = useState('idle'); // idle | correct | wrong
  const [hintUsed, setHintUsed] = useState(false);

  const feedbackRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(feedbackRef.current);
  }, []);

  function startGame() {
    const list = buildWordList(locale, category, difficulty);
    setWordList(list);
    setWordIndex(0);
    setScore(0);
    setHintUsed(false);
    loadWord(list[0]);
    setPhase('play');
  }

  function loadWord(word) {
    const scrambled = scrambleWord(word);
    setTiles(scrambled);
    setSlots(Array(word.length).fill(null));
    setSlotState('idle');
    setHintUsed(false);
  }

  // Auto-check when all slots filled
  useEffect(() => {
    if (phase !== 'play' || slotState !== 'idle') return;
    const allFilled = slots.length > 0 && slots.every(s => s !== null);
    if (!allFilled) return;

    const word = wordList[wordIndex];
    const guess = slots.map(s => s.letter).join('').toLowerCase();
    const correct = guess === word.toLowerCase();

    if (correct) {
      setSlotState('correct');
      feedbackRef.current = setTimeout(() => {
        const newScore = score + 1;
        setScore(newScore);
        advanceWord(newScore);
      }, 800);
    } else {
      setSlotState('wrong');
      feedbackRef.current = setTimeout(() => {
        // return letters to tiles
        setTiles(prev => prev.map(t => ({ ...t, used: false })));
        setSlots(Array(wordList[wordIndex].length).fill(null));
        setSlotState('idle');
      }, 600);
    }
  }, [slots, phase, slotState, wordList, wordIndex, score]);

  function advanceWord(currentScore) {
    const nextIndex = wordIndex + 1;
    if (nextIndex >= TOTAL_WORDS) {
      setPhase('results');
    } else {
      setWordIndex(nextIndex);
      loadWord(wordList[nextIndex]);
    }
  }

  const handleTileClick = useCallback((tileId) => {
    if (slotState !== 'idle') return;
    const tile = tiles.find(t => t.id === tileId);
    if (!tile || tile.used) return;

    const nextSlotIdx = slots.findIndex(s => s === null);
    if (nextSlotIdx === -1) return;

    setTiles(prev => prev.map(t => t.id === tileId ? { ...t, used: true } : t));
    setSlots(prev => {
      const next = [...prev];
      next[nextSlotIdx] = { tileId, letter: tile.letter };
      return next;
    });
  }, [tiles, slots, slotState]);

  const handleSlotClick = useCallback((slotIdx) => {
    if (slotState !== 'idle') return;
    const slot = slots[slotIdx];
    if (!slot) return;

    setTiles(prev => prev.map(t => t.id === slot.tileId ? { ...t, used: false } : t));
    setSlots(prev => {
      const next = [...prev];
      next[slotIdx] = null;
      return next;
    });
  }, [slots, slotState]);

  function handleHint() {
    if (hintUsed || slotState !== 'idle') return;
    const word = wordList[wordIndex].toUpperCase();
    // Find first empty slot
    const firstEmpty = slots.findIndex(s => s === null);
    if (firstEmpty === -1) return;

    const correctLetter = word[firstEmpty];
    // Find a tile with that letter that isn't used
    const matchTile = tiles.find(t => t.letter === correctLetter && !t.used);
    if (!matchTile) return;

    setHintUsed(true);
    setTiles(prev => prev.map(t => t.id === matchTile.id ? { ...t, used: true } : t));
    setSlots(prev => {
      const next = [...prev];
      next[firstEmpty] = { tileId: matchTile.id, letter: matchTile.letter };
      return next;
    });
  }

  function renderSetup() {
    return (
      <div className="cahier-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="cahier-title">{ui.title}</h1>

        <div className="cahier-section">
          <div className="cahier-section-title">{ui.category}</div>
          <div className="cahier-chips">
            {['animals', 'colors', 'numbers', 'school'].map(c => (
              <button
                key={c}
                className={`cahier-chip${category === c ? ' is-selected' : ''}`}
                onClick={() => setCategory(c)}
              >
                {ui[c]}
              </button>
            ))}
          </div>
        </div>

        <div className="cahier-section">
          <div className="cahier-section-title">{ui.difficulty}</div>
          <div className="cahier-chips">
            {['easy', 'medium', 'hard'].map(d => (
              <button
                key={d}
                className={`cahier-chip${difficulty === d ? ' is-selected' : ''}`}
                onClick={() => setDifficulty(d)}
              >
                {ui[d]}
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
    const word = wordList[wordIndex] || '';
    return (
      <div className="cahier-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h2 style={{ textAlign: 'center', margin: '8px 0 4px', fontSize: '1.1rem', fontWeight: 700 }}>
          {ui.title}
        </h2>

        <div className="ws-word-progress">
          {ui.word} {wordIndex + 1} {ui.of} {TOTAL_WORDS} — {ui.score}: {score}
        </div>

        <div className={`ws-slots${slotState === 'correct' ? ' is-correct-group' : ''}`}>
          {slots.map((slot, idx) => {
            let cls = 'ws-slot';
            if (slot) cls += ' is-filled';
            if (slotState === 'correct') cls += ' is-correct';
            if (slotState === 'wrong')   cls += ' is-wrong';
            return (
              <div
                key={idx}
                className={cls}
                onClick={() => handleSlotClick(idx)}
              >
                {slot ? slot.letter : ''}
              </div>
            );
          })}
        </div>

        <div className="ws-tiles">
          {tiles.map(tile => (
            <button
              key={tile.id}
              className={`ws-tile${tile.used ? ' is-used' : ''}`}
              onClick={() => handleTileClick(tile.id)}
              disabled={tile.used || slotState !== 'idle'}
            >
              {tile.letter}
            </button>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <button
            className="cahier-cta cahier-cta--soft"
            onClick={handleHint}
            disabled={hintUsed || slotState !== 'idle'}
          >
            {hintUsed ? ui.hintUsed : ui.hint}
          </button>
        </div>
      </div>
    );
  }

  function renderResults() {
    const stars = calcStars(score);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    const showConfetti = stars === 3;
    return (
      <div className="cahier-page" style={{ position: 'relative', overflow: 'hidden' }}>
        {showConfetti && (
          <div className="confetti-container" aria-hidden="true">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 1.5}s`,
                  background: ['#6366f1','#f59e0b','#22c55e','#ec4899','#06b6d4'][i % 5],
                }}
              />
            ))}
          </div>
        )}

        <h2 style={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 900, margin: '24px 0 8px' }}>
          {ui.win}
        </h2>

        <div className="jeux-stars">{starStr}</div>

        <div className="jeux-result-stat">
          <span>{ui.score}</span>
          <span>{score} / {TOTAL_WORDS}</span>
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
