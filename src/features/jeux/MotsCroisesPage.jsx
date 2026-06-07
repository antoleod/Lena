import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

// 5×5 grid. Each puzzle defines words with positions.
// cell [row][col]. '#' = blocked, '' = fillable, letter = pre-filled (intersections).
// Words: { id, clue, answer, row, col, dir: 'across'|'down', label }

const PUZZLES = [
  {
    title: 'Puzzle 1',
    // CHAT across r0 c0-c3 | CIEL down c0 r0-r3 | LUNE across r3 c0-c3
    words: [
      { id: 'w1', clue: 'Animal qui dit Miaou', answer: 'CHAT', row: 0, col: 0, dir: 'across', label: '1→' },
      { id: 'w2', clue: 'Couleur du ciel (abrégé)', answer: 'CIEL', row: 0, col: 0, dir: 'down',   label: '1↓' },
      { id: 'w3', clue: 'Elle brille la nuit', answer: 'LUNE', row: 3, col: 0, dir: 'across', label: '3→' },
    ],
  },
  {
    title: 'Puzzle 2',
    // NOIX across r0 c0-c3 | NUIT down c0 r0-r3 | TOUR across r3 c0-c3
    words: [
      { id: 'w1', clue: 'Petit fruit à coque dur', answer: 'NOIX', row: 0, col: 0, dir: 'across', label: '1→' },
      { id: 'w2', clue: 'Quand le soleil dort', answer: 'NUIT', row: 0, col: 0, dir: 'down',   label: '1↓' },
      { id: 'w3', clue: 'Grande construction ronde', answer: 'TOUR', row: 3, col: 0, dir: 'across', label: '3→' },
    ],
  },
  {
    title: 'Puzzle 3',
    // VERT across r0 c0-c3 | VELO down c0 r0-r3 | OURS across r3 c0-c3
    words: [
      { id: 'w1', clue: 'Couleur de l\'herbe', answer: 'VERT', row: 0, col: 0, dir: 'across', label: '1→' },
      { id: 'w2', clue: 'On le roule avec des pédales', answer: 'VELO', row: 0, col: 0, dir: 'down',   label: '1↓' },
      { id: 'w3', clue: 'Grand animal des forêts', answer: 'OURS', row: 3, col: 0, dir: 'across', label: '3→' },
    ],
  },
  {
    title: 'Puzzle 4',
    // PAIN across r0 c0-c3 | PARC down c0 r0-r3 | RIVE across r2 c0-c3
    words: [
      { id: 'w1', clue: 'On le mange avec du beurre', answer: 'PAIN', row: 0, col: 0, dir: 'across', label: '1→' },
      { id: 'w2', clue: 'Jardin public avec des arbres', answer: 'PARC', row: 0, col: 0, dir: 'down',   label: '1↓' },
      { id: 'w3', clue: 'Bord d\'une rivière', answer: 'RIVE', row: 2, col: 0, dir: 'across', label: '3→' },
    ],
  },
  {
    title: 'Puzzle 5',
    // DENT across r0 c0-c3 | DAME down c0 r0-r3 | ELAN across r3 c0-c3
    words: [
      { id: 'w1', clue: 'Petite chose blanche dans la bouche', answer: 'DENT', row: 0, col: 0, dir: 'across', label: '1→' },
      { id: 'w2', clue: 'Femme adulte (titre poli)', answer: 'DAME', row: 0, col: 0, dir: 'down',   label: '1↓' },
      { id: 'w3', clue: 'Grand cerf des forêts du nord', answer: 'ELAN', row: 3, col: 0, dir: 'across', label: '3→' },
    ],
  },
];

// Build the cell matrix from a puzzle definition
function buildGrid(puzzle) {
  // 5×5, all blocked by default
  const grid = Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => ({ type: 'blocked', letter: '', answer: '' }))
  );

  puzzle.words.forEach(word => {
    for (let i = 0; i < word.answer.length; i++) {
      const r = word.dir === 'across' ? word.row : word.row + i;
      const c = word.dir === 'across' ? word.col + i : word.col;
      if (r < 5 && c < 5) {
        grid[r][c] = { type: 'fillable', letter: '', answer: word.answer[i] };
      }
    }
  });

  return grid;
}

// Returns set of word IDs that are fully and correctly filled
function getCompletedWords(puzzle, grid) {
  const completed = new Set();
  puzzle.words.forEach(word => {
    let ok = true;
    for (let i = 0; i < word.answer.length; i++) {
      const r = word.dir === 'across' ? word.row : word.row + i;
      const c = word.dir === 'across' ? word.col + i : word.col;
      if (!grid[r] || !grid[r][c] || grid[r][c].letter !== word.answer[i]) {
        ok = false;
        break;
      }
    }
    if (ok) completed.add(word.id);
  });
  return completed;
}

// Collect the unique letters needed for a puzzle (for on-screen keyboard)
function puzzleLetters(puzzle) {
  const letters = new Set();
  puzzle.words.forEach(w => w.answer.split('').forEach(l => letters.add(l)));
  return [...letters].sort();
}

function calcStars(completed, total) {
  const r = completed / total;
  if (r >= 1) return 3;
  if (r >= 0.5) return 2;
  return 1;
}

export default function MotsCroisesPage() {
  const [phase, setPhase] = useState('setup');
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [grid, setGrid] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null); // [r, c]
  const [selectedWord, setSelectedWord] = useState(null); // word object
  const [completed, setCompleted] = useState(new Set());
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [totalWords, setTotalWords] = useState(0);

  const puzzle = PUZZLES[puzzleIdx];

  function startGame(pIdx) {
    const p = PUZZLES[pIdx];
    const g = buildGrid(p);
    setPuzzleIdx(pIdx);
    setGrid(g);
    setSelectedCell(null);
    setSelectedWord(null);
    setCompleted(new Set());
    setTotalCompleted(0);
    setTotalWords(p.words.length);
    setPhase('play');
  }

  function handleCellPress(r, c) {
    if (!grid[r][c] || grid[r][c].type === 'blocked') return;
    setSelectedCell([r, c]);
    // Find which word(s) pass through this cell; cycle through them
    const words = puzzle.words.filter(w => {
      for (let i = 0; i < w.answer.length; i++) {
        const wr = w.dir === 'across' ? w.row : w.row + i;
        const wc = w.dir === 'across' ? w.col + i : w.col;
        if (wr === r && wc === c) return true;
      }
      return false;
    });
    if (words.length === 0) return;
    // If the cell belongs to more than one word, cycle
    if (selectedWord && words.length > 1) {
      const curIdx = words.findIndex(w => w.id === selectedWord.id);
      setSelectedWord(words[(curIdx + 1) % words.length]);
    } else {
      setSelectedWord(words[0]);
    }
  }

  const handleLetter = useCallback((letter) => {
    if (!selectedCell || !selectedWord) return;
    const [r, c] = selectedCell;
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    newGrid[r][c].letter = letter;
    setGrid(newGrid);

    // Check completions
    const nowCompleted = getCompletedWords(puzzle, newGrid);
    setCompleted(nowCompleted);
    setTotalCompleted(nowCompleted.size);

    // Check if whole puzzle done
    if (nowCompleted.size === puzzle.words.length) {
      setTimeout(() => setPhase('results'), 800);
      return;
    }

    // Advance cursor within the selected word
    if (selectedWord) {
      const cells = [];
      for (let i = 0; i < selectedWord.answer.length; i++) {
        const wr = selectedWord.dir === 'across' ? selectedWord.row : selectedWord.row + i;
        const wc = selectedWord.dir === 'across' ? selectedWord.col + i : selectedWord.col;
        cells.push([wr, wc]);
      }
      const curPos = cells.findIndex(([wr, wc]) => wr === r && wc === c);
      if (curPos < cells.length - 1) {
        setSelectedCell(cells[curPos + 1]);
      }
    }
  }, [selectedCell, selectedWord, grid, puzzle]);

  const handleDelete = useCallback(() => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    newGrid[r][c].letter = '';
    setGrid(newGrid);
    setCompleted(getCompletedWords(puzzle, newGrid));

    // Move cursor back
    if (selectedWord) {
      const cells = [];
      for (let i = 0; i < selectedWord.answer.length; i++) {
        const wr = selectedWord.dir === 'across' ? selectedWord.row : selectedWord.row + i;
        const wc = selectedWord.dir === 'across' ? selectedWord.col + i : selectedWord.col;
        cells.push([wr, wc]);
      }
      const curPos = cells.findIndex(([wr, wc]) => wr === r && wc === c);
      if (curPos > 0) {
        setSelectedCell(cells[curPos - 1]);
      }
    }
  }, [selectedCell, selectedWord, grid, puzzle]);

  // Determine cell highlight state
  function getCellClass(r, c) {
    if (!grid) return '';
    const cell = grid[r][c];
    if (cell.type === 'blocked') return 'mx-cell mx-cell--blocked';

    let cls = 'mx-cell mx-cell--fillable';

    // Belongs to a completed word?
    const inCompleted = puzzle.words.some(w => {
      if (!completed.has(w.id)) return false;
      for (let i = 0; i < w.answer.length; i++) {
        const wr = w.dir === 'across' ? w.row : w.row + i;
        const wc = w.dir === 'across' ? w.col + i : w.col;
        if (wr === r && wc === c) return true;
      }
      return false;
    });
    if (inCompleted) return cls + ' mx-cell--done';

    // Belongs to selected word?
    if (selectedWord) {
      const inWord = (() => {
        for (let i = 0; i < selectedWord.answer.length; i++) {
          const wr = selectedWord.dir === 'across' ? selectedWord.row : selectedWord.row + i;
          const wc = selectedWord.dir === 'across' ? selectedWord.col + i : selectedWord.col;
          if (wr === r && wc === c) return true;
        }
        return false;
      })();
      if (inWord) cls += ' mx-cell--word';
    }

    // Is selected cell?
    if (selectedCell && selectedCell[0] === r && selectedCell[1] === c) {
      cls += ' mx-cell--active';
    }

    return cls;
  }

  if (phase === 'setup') {
    return (
      <div className="mx-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="mx-setup-hero">
          <div className="mx-setup-icon">🔤</div>
          <h1 className="mx-setup-title">Mots Croisés</h1>
          <p className="mx-setup-desc">
            Lis les indices et remplis la grille !<br />
            Tape sur une case puis choisis une lettre.
          </p>
        </div>
        <p className="mx-setup-choose">Choisis un puzzle :</p>
        <div className="mx-puzzle-list">
          {PUZZLES.map((p, i) => (
            <button
              key={i}
              className="mx-puzzle-btn"
              onPointerDown={e => { e.preventDefault(); startGame(i); }}
            >
              <span className="mx-puzzle-num">#{i + 1}</span>
              <span className="mx-puzzle-words">{p.words.map(w => w.answer).join(' · ')}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = calcStars(totalCompleted, totalWords);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    return (
      <div className="mx-page">
        <h2 className="mx-result-title">
          {stars === 3 ? '🎉 Grille complète !' : stars === 2 ? '👍 Bien joué !' : '📝 Continue !'}
        </h2>
        <div className="jeux-stars">{starStr}</div>
        <div className="jeux-result-stat"><span>Mots trouvés</span><span>{totalCompleted} / {totalWords}</span></div>
        <div className="mx-result-btns">
          <button
            className="mx-cta"
            onPointerDown={e => { e.preventDefault(); startGame(puzzleIdx); }}
          >
            Recommencer
          </button>
          <button
            className="mx-cta mx-cta--soft"
            onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}
          >
            Autre puzzle
          </button>
        </div>
        <Link to="/jeux" className="mx-back-link">← Retour aux jeux</Link>
      </div>
    );
  }

  // play phase
  const letters = puzzleLetters(puzzle);

  return (
    <div className="mx-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="mx-hud">
        <span className="mx-progress">Mots trouvés : {completed.size} / {puzzle.words.length}</span>
        <span className="mx-puzzle-label">{puzzle.title}</span>
      </div>

      {/* Clues */}
      <div className="mx-clues">
        {puzzle.words.map(w => (
          <button
            key={w.id}
            className={`mx-clue${selectedWord && selectedWord.id === w.id ? ' mx-clue--active' : ''}${completed.has(w.id) ? ' mx-clue--done' : ''}`}
            onPointerDown={e => { e.preventDefault(); setSelectedWord(w); setSelectedCell([w.row, w.col]); }}
          >
            <span className="mx-clue-label">{w.label}</span>
            <span className="mx-clue-text">{w.clue}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mx-grid-wrap">
        <div className="mx-grid">
          {Array.from({ length: 5 }, (_, r) =>
            Array.from({ length: 5 }, (_, c) => {
              const cell = grid[r][c];
              return (
                <div
                  key={`${r}-${c}`}
                  className={getCellClass(r, c)}
                  onPointerDown={e => { e.preventDefault(); handleCellPress(r, c); }}
                >
                  {cell.type === 'fillable' ? (cell.letter || '') : ''}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* On-screen keyboard — only letters in this puzzle */}
      <div className="mx-keyboard">
        <div className="mx-keys">
          {letters.map(l => (
            <button
              key={l}
              className="mx-key"
              onPointerDown={e => { e.preventDefault(); handleLetter(l); }}
            >
              {l}
            </button>
          ))}
          <button
            className="mx-key mx-key--del"
            onPointerDown={e => { e.preventDefault(); handleDelete(); }}
          >
            ⌫
          </button>
        </div>
      </div>
    </div>
  );
}
