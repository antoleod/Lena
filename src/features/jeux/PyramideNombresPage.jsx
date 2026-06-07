import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import { GameFeedback, useGameFeedback } from './GameFeedback.jsx';
import './jeux.css';

/**
 * Pyramid cell indexing:
 *
 * 3-row pyramid (6 cells):
 *   Index:    5
 *             3  4
 *             0  1  2
 *   Rules: cells[3]=cells[0]+cells[1], cells[4]=cells[1]+cells[2], cells[5]=cells[3]+cells[4]
 *
 * 4-row pyramid (10 cells):
 *   Index:       9
 *              7   8
 *            4  5   6
 *           0  1  2   3
 *   Rules: cells[4]=cells[0]+cells[1], cells[5]=cells[1]+cells[2], cells[6]=cells[2]+cells[3]
 *          cells[7]=cells[4]+cells[5], cells[8]=cells[5]+cells[6]
 *          cells[9]=cells[7]+cells[8]
 */

const TOTAL_PYRAMIDS = 8;

const LEVEL_CONFIG = [
  { label: 'N1 — Petits nombres',    rows: 3, bottomMax: 9,   hiddenCount: 1 },
  { label: 'N2 — Jusqu\'à 20',       rows: 3, bottomMax: 20,  hiddenCount: 2 },
  { label: 'N3 — Jusqu\'à 50',       rows: 3, bottomMax: 50,  hiddenCount: 3 },
  { label: 'N4 — Jusqu\'à 100',      rows: 3, bottomMax: 100, hiddenCount: 4 },
  { label: 'N5 — 4 rangées',         rows: 4, bottomMax: 20,  hiddenCount: 5 },
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generatePyramid3(bottomMax, hiddenCount) {
  const b0 = randInt(1, bottomMax);
  const b1 = randInt(1, bottomMax);
  const b2 = randInt(1, bottomMax);
  const m0 = b0 + b1;
  const m1 = b1 + b2;
  const top = m0 + m1;
  const cells = [b0, b1, b2, m0, m1, top];
  // Candidate hidden indices: prefer top/middle cells first
  const candidates = shuffle([3, 4, 5, 0, 1, 2]);
  const hidden = candidates.slice(0, Math.min(hiddenCount, 5)); // never hide all bottom
  return { cells, hidden, rows: 3 };
}

function generatePyramid4(bottomMax, hiddenCount) {
  const b0 = randInt(1, bottomMax);
  const b1 = randInt(1, bottomMax);
  const b2 = randInt(1, bottomMax);
  const b3 = randInt(1, bottomMax);
  const m0 = b0 + b1;
  const m1 = b1 + b2;
  const m2 = b2 + b3;
  const u0 = m0 + m1;
  const u1 = m1 + m2;
  const top = u0 + u1;
  const cells = [b0, b1, b2, b3, m0, m1, m2, u0, u1, top];
  // Prefer top/upper/middle over bottom
  const candidates = shuffle([9, 7, 8, 4, 5, 6, 0, 1, 2, 3]);
  const hidden = candidates.slice(0, Math.min(hiddenCount, 8));
  return { cells, hidden, rows: 4 };
}

function generatePyramid(cfg) {
  if (cfg.rows === 4) return generatePyramid4(cfg.bottomMax, cfg.hiddenCount);
  return generatePyramid3(cfg.bottomMax, cfg.hiddenCount);
}

function buildChoices(correctValue) {
  const offsets = shuffle([-3, -2, -1, 1, 2, 3, 4, -4, 5, -5]);
  const choices = new Set();
  choices.add(correctValue);
  for (const o of offsets) {
    if (choices.size >= 4) break;
    const v = correctValue + o;
    if (v > 0 && v !== correctValue) choices.add(v);
  }
  // Fallback: add sequential values if not enough
  let offset = 1;
  while (choices.size < 4) {
    choices.add(correctValue + offset * (choices.size % 2 === 0 ? 1 : -1));
    offset++;
  }
  return shuffle([...choices]);
}

function formatTime(secs) {
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m${secs % 60}s`;
}

// ─── Pyramid renderer ──────────────────────────────────────────────────────────
// Layout: rows from bottom to top, each row centered with flex.
// Cells are squares. Hidden cells shown as "?" with special styling.
// The active hidden cell is highlighted.

function PyramidView({ pyramid, hiddenIdx, filledValues, chosenFeedback }) {
  const { cells, hidden, rows } = pyramid;

  // Build rows bottom→top
  const rowLayouts = [];
  if (rows === 3) {
    rowLayouts.push([0, 1, 2]); // bottom
    rowLayouts.push([3, 4]);    // middle
    rowLayouts.push([5]);       // top
  } else {
    rowLayouts.push([0, 1, 2, 3]); // bottom
    rowLayouts.push([4, 5, 6]);    // middle
    rowLayouts.push([7, 8]);       // upper
    rowLayouts.push([9]);          // top
  }

  const activeHiddenIndex = hidden[hiddenIdx] ?? -1;

  return (
    <div className="pyr-pyramid">
      {[...rowLayouts].reverse().map((row, ri) => (
        <div key={ri} className="pyr-row">
          {row.map(cellIdx => {
            const isHidden = hidden.includes(cellIdx);
            const isFilled = cellIdx in filledValues;
            const isActive = cellIdx === activeHiddenIndex;
            const feedback = isActive ? chosenFeedback : (isFilled ? (filledValues[cellIdx].correct ? 'ok' : 'bad') : null);

            let cls = 'pyr-cell';
            if (isHidden && !isFilled && !isActive) cls += ' pyr-cell--hidden';
            if (isActive) cls += ' pyr-cell--active';
            if (feedback === 'ok') cls += ' pyr-cell--correct';
            if (feedback === 'bad') cls += ' pyr-cell--wrong';

            const display = isFilled
              ? filledValues[cellIdx].value
              : isActive
                ? '?'
                : isHidden
                  ? '?'
                  : cells[cellIdx];

            return (
              <div key={cellIdx} className={cls}>
                {display}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function PyramideNombresPage() {
  const { progress, saveSession, resetTimer, logError } = useGameSession('pyramide-nombres');
  const { feedbackRef, triggerCorrect, triggerWrong } = useGameFeedback();

  const [phase, setPhase] = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(1);

  // Game state
  const [pyramids, setPyramids] = useState([]); // pre-generated list of pyramids
  const [pyramidIdx, setPyramidIdx] = useState(0);
  const [hiddenIdx, setHiddenIdx] = useState(0); // which hidden cell we're on
  const [filledValues, setFilledValues] = useState({}); // { cellIndex: { value, correct } }
  const [score, setScore] = useState(0); // correct cells
  const [totalCells, setTotalCells] = useState(0); // total hidden cells across all pyramids
  const [chosenFeedback, setChosenFeedback] = useState(null); // null | 'ok' | 'bad'
  const [sessionResult, setSessionResult] = useState(null);

  const cfg = LEVEL_CONFIG[selectedLevel - 1];

  const currentPyramid = pyramids[pyramidIdx] ?? null;

  const choices = useMemo(() => {
    if (!currentPyramid) return [];
    const activeCell = currentPyramid.hidden[hiddenIdx];
    if (activeCell === undefined) return [];
    return buildChoices(currentPyramid.cells[activeCell]);
  }, [currentPyramid, hiddenIdx]);

  function startGame() {
    const c = LEVEL_CONFIG[selectedLevel - 1];
    const generated = Array.from({ length: TOTAL_PYRAMIDS }, () => generatePyramid(c));
    const total = generated.reduce((s, p) => s + p.hidden.length, 0);
    setPyramids(generated);
    setPyramidIdx(0);
    setHiddenIdx(0);
    setFilledValues({});
    setScore(0);
    setTotalCells(total);
    setChosenFeedback(null);
    setSessionResult(null);
    resetTimer();
    setPhase('play');
  }

  function handleChoice(choiceValue) {
    if (chosenFeedback !== null || !currentPyramid) return;
    const activeCell = currentPyramid.hidden[hiddenIdx];
    if (activeCell === undefined) return;
    const correct = choiceValue === currentPyramid.cells[activeCell];
    setChosenFeedback(correct ? 'ok' : 'bad');

    if (correct) {
      setScore(s => s + 1);
      triggerCorrect();
    } else {
      triggerWrong();
      logError({
        label: `Pyramide — case ${activeCell}`,
        correct: String(currentPyramid.cells[activeCell]),
        given: String(choiceValue),
      });
    }

    setFilledValues(prev => ({
      ...prev,
      [activeCell]: { value: choiceValue, correct },
    }));

    setTimeout(() => {
      const nextHidden = hiddenIdx + 1;
      if (nextHidden < currentPyramid.hidden.length) {
        // More hidden cells in this pyramid
        setHiddenIdx(nextHidden);
        setChosenFeedback(null);
        return;
      }
      // Done with this pyramid
      const nextPyramid = pyramidIdx + 1;
      if (nextPyramid >= TOTAL_PYRAMIDS) {
        // All done
        const finalScore = correct ? score + 1 : score;
        const stars = finalScore >= Math.ceil(totalCells * 0.86) ? 3
          : finalScore >= Math.ceil(totalCells * 0.6) ? 2 : 1;
        const result = saveSession({ score: finalScore, level: selectedLevel, stars });
        setSessionResult(result);
        setPhase('results');
        return;
      }
      // Next pyramid
      setPyramidIdx(nextPyramid);
      setHiddenIdx(0);
      setFilledValues({});
      setChosenFeedback(null);
    }, 800);
  }

  if (phase === 'setup') {
    return (
      <div className="an-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 className="an-title">🔺 Pyramide Additive</h1>
        <p className="an-subtitle">Remplis la pyramide en additionnant les briques !</p>

        <div className="jeux-level-grid">
          {LEVEL_CONFIG.map((lc, i) => {
            const lvl = i + 1;
            const locked = lvl > progress.unlockedLevel;
            const sel = lvl === selectedLevel;
            return (
              <button
                key={lvl}
                className={`jeux-level-btn${sel ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`}
                onPointerDown={e => { e.preventDefault(); if (!locked) setSelectedLevel(lvl); }}
                disabled={locked}
              >
                {locked ? '🔒' : `N${lvl}`}
              </button>
            );
          })}
        </div>

        <div className="an-info-row">
          <span>🔺 {TOTAL_PYRAMIDS} pyramides</span>
          <span>❓ {cfg.hiddenCount} case{cfg.hiddenCount > 1 ? 's' : ''} cachée{cfg.hiddenCount > 1 ? 's' : ''}</span>
        </div>

        <div className="jeux-setup-stats">
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{progress.bestScore}</span>
            <span className="jeux-setup-stat__lbl">Meilleur score</span>
          </div>
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{formatTime(progress.totalTimeSecs)}</span>
            <span className="jeux-setup-stat__lbl">Temps total</span>
          </div>
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{progress.sessionsPlayed}</span>
            <span className="jeux-setup-stat__lbl">Parties</span>
          </div>
        </div>

        <button className="an-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>
          ▶ Jouer
        </button>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = score >= Math.ceil(totalCells * 0.86) ? 3
      : score >= Math.ceil(totalCells * 0.6) ? 2 : 1;
    const msg = stars === 3 ? '🎉 Parfait !' : stars === 2 ? '👍 Bien joué !' : '📚 Encore un effort !';
    return (
      <div className="an-page">
        <h2 className="an-result-title">{msg}</h2>
        <div className="jeux-stars">{'★'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
        <div className="jeux-result-stat"><span>Cases correctes</span><span>{score} / {totalCells}</span></div>
        {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
        {sessionResult?.newUnlocked && (
          <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} débloqué !</div>
        )}
        <div className="an-result-btns">
          <button className="an-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>Rejouer</button>
          <button className="an-cta an-cta--soft" onPointerDown={() => setPhase('setup')}>Niveaux</button>
          <Link to="/jeux" className="an-cta an-cta--soft">← Jeux</Link>
        </div>
      </div>
    );
  }

  if (!currentPyramid) return null;

  return (
    <div className="an-page">
      <GameFeedback ref={feedbackRef} />
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="an-hud">
        <span className="an-score">⭐ {score}</span>
        <span className="an-round">Pyramide {pyramidIdx + 1} / {TOTAL_PYRAMIDS}</span>
      </div>

      <p className="pyr-instruction">
        Chaque brique = somme des deux briques en dessous. Trouve les <strong>?</strong> !
      </p>

      <PyramidView
        pyramid={currentPyramid}
        hiddenIdx={hiddenIdx}
        filledValues={filledValues}
        chosenFeedback={chosenFeedback}
      />

      <div className="pyr-choices">
        {choices.map((val, i) => (
          <button
            key={i}
            className="pyr-choice"
            onPointerDown={e => { e.preventDefault(); handleChoice(val); }}
            disabled={chosenFeedback !== null}
          >
            {val}
          </button>
        ))}
      </div>

      <style>{`
        .pyr-instruction {
          font-size: .9rem;
          text-align: center;
          opacity: .75;
          margin: 4px 0 12px;
        }
        .pyr-pyramid {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin: 8px 0 20px;
        }
        .pyr-row {
          display: flex;
          gap: 6px;
          justify-content: center;
        }
        .pyr-cell {
          width: 58px;
          height: 58px;
          border-radius: 10px;
          background: #6366f1;
          color: #fff;
          font-size: 1.15rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 8px rgba(0,0,0,.18);
          transition: background .2s, transform .15s;
        }
        .pyr-cell--hidden {
          background: #d1d5db;
          color: #6b7280;
        }
        .pyr-cell--active {
          background: #f59e0b;
          color: #fff;
          transform: scale(1.12);
          box-shadow: 0 4px 14px rgba(245,158,11,.5);
          animation: pyr-pulse .6s ease infinite alternate;
        }
        @keyframes pyr-pulse {
          from { box-shadow: 0 4px 14px rgba(245,158,11,.5); }
          to   { box-shadow: 0 4px 20px rgba(245,158,11,.9); }
        }
        .pyr-cell--correct {
          background: #22c55e !important;
          transform: scale(1.08);
        }
        .pyr-cell--wrong {
          background: #ef4444 !important;
          animation: pyr-shake .3s ease;
        }
        @keyframes pyr-shake {
          0%,100% { transform: translateX(0); }
          25%      { transform: translateX(-5px); }
          75%      { transform: translateX(5px); }
        }
        .pyr-choices {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          width: 100%;
          max-width: 320px;
        }
        .pyr-choice {
          min-height: 64px;
          border: none;
          border-radius: 14px;
          background: var(--color-surface, #fff);
          box-shadow: 0 3px 10px rgba(0,0,0,.12);
          font-size: 1.4rem;
          font-weight: 900;
          cursor: pointer;
          transition: transform .1s, background .15s;
          touch-action: manipulation;
        }
        .pyr-choice:active:not(:disabled) {
          transform: scale(.93);
          background: #ede9fe;
        }
        .pyr-choice:disabled { opacity: .5; }
      `}</style>
    </div>
  );
}
