import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

const TOTAL_ROUNDS = 5;
const MAX_ATTEMPTS = 6;

function generateSecret() {
  let tens, units;
  do {
    tens = Math.floor(Math.random() * 9) + 1; // 1-9
    units = Math.floor(Math.random() * 10);   // 0-9
  } while (tens === units);
  return [tens, units];
}

// Returns array of {color: 'green'|'yellow'|'black'} per digit
function computeFeedback(secret, guess) {
  const result = ['black', 'black'];
  // First pass: exact matches
  for (let i = 0; i < 2; i++) {
    if (guess[i] === secret[i]) result[i] = 'green';
  }
  // Second pass: wrong position — only for digits not already matched green
  for (let i = 0; i < 2; i++) {
    if (result[i] === 'green') continue;
    for (let j = 0; j < 2; j++) {
      if (j === i) continue;
      if (guess[i] === secret[j] && result[j] !== 'green') {
        result[i] = 'yellow';
        break;
      }
    }
  }
  return result;
}

function calcStars(wins) {
  if (wins >= 5) return 3;
  if (wins >= 3) return 2;
  return 1;
}

const EMOJI = { green: '🟢', yellow: '🟡', black: '⬛' };

export default function NombreSecretPage() {
  const [phase, setPhase] = useState('play');
  const [roundNum, setRoundNum] = useState(1);
  const [wins, setWins] = useState(0);
  const [secret, setSecret] = useState(() => generateSecret());
  const [attempts, setAttempts] = useState([]); // [{guess:[d,d], feedback:[c,c]}]
  const [currentInput, setCurrentInput] = useState([]); // max 2 digits
  const [roundOver, setRoundOver] = useState(false);
  const [roundResult, setRoundResult] = useState(null); // 'win'|'lose'

  function startGame() {
    setRoundNum(1);
    setWins(0);
    setSecret(generateSecret());
    setAttempts([]);
    setCurrentInput([]);
    setRoundOver(false);
    setRoundResult(null);
    setPhase('play');
  }

  function nextRound(newWins) {
    if (roundNum >= TOTAL_ROUNDS) {
      setWins(newWins);
      setPhase('results');
    } else {
      setRoundNum(r => r + 1);
      setSecret(generateSecret());
      setAttempts([]);
      setCurrentInput([]);
      setRoundOver(false);
      setRoundResult(null);
      setWins(newWins);
    }
  }

  const handleDigit = useCallback((d) => {
    if (roundOver) return;
    if (currentInput.length >= 2) return;
    setCurrentInput(prev => [...prev, d]);
  }, [currentInput, roundOver]);

  const handleBackspace = useCallback(() => {
    if (roundOver) return;
    setCurrentInput(prev => prev.slice(0, -1));
  }, [roundOver]);

  const handleSubmit = useCallback(() => {
    if (roundOver) return;
    if (currentInput.length !== 2) return;
    const feedback = computeFeedback(secret, currentInput);
    const newAttempts = [...attempts, { guess: currentInput, feedback }];
    setAttempts(newAttempts);
    setCurrentInput([]);
    const won = feedback[0] === 'green' && feedback[1] === 'green';
    if (won) {
      setRoundOver(true);
      setRoundResult('win');
    } else if (newAttempts.length >= MAX_ATTEMPTS) {
      setRoundOver(true);
      setRoundResult('lose');
    }
  }, [currentInput, secret, attempts, roundOver]);

  if (phase === 'results') {
    const stars = calcStars(wins);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    return (
      <div className="ns-page">
        <h2 className="ns-result-title">
          {stars === 3 ? '🎉 Génial !' : stars === 2 ? '👍 Bien joué !' : '🔢 Continue !'}
        </h2>
        <div className="jeux-stars">{starStr}</div>
        <div className="jeux-result-stat"><span>Victoires</span><span>{wins} / {TOTAL_ROUNDS}</span></div>
        <button className="ns-cta" style={{ marginTop: 24 }} onPointerDown={e => { e.preventDefault(); startGame(); }}>
          Rejouer
        </button>
        <Link to="/jeux" className="ns-back-link">← Retour aux jeux</Link>
      </div>
    );
  }

  return (
    <div className="ns-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="ns-hud">
        <span className="ns-progress">Manche {roundNum} / {TOTAL_ROUNDS}</span>
        <span className="ns-score">🏆 {wins}</span>
      </div>

      <div className="ns-info-card">
        <p className="ns-info-text">Trouve le nombre secret à 2 chiffres (pas de chiffres répétés) !</p>
        <div className="ns-legend">
          <span>🟢 Bien placé</span>
          <span>🟡 Mal placé</span>
          <span>⬛ Absent</span>
        </div>
      </div>

      <div className="ns-attempts">
        {attempts.map((a, i) => (
          <div key={i} className="ns-attempt-row">
            <div className="ns-guess-digits">
              {a.guess.map((d, j) => (
                <span key={j} className="ns-digit-box">{d}</span>
              ))}
            </div>
            <div className="ns-feedback">
              {a.feedback.map((c, j) => (
                <span key={j}>{EMOJI[c]}</span>
              ))}
            </div>
          </div>
        ))}
        {/* Empty rows */}
        {!roundOver && Array.from({ length: MAX_ATTEMPTS - attempts.length }).map((_, i) => (
          <div key={'e' + i} className={`ns-attempt-row ns-attempt-row--empty${i === 0 ? ' ns-attempt-row--current' : ''}`}>
            <div className="ns-guess-digits">
              {[0, 1].map(j => (
                <span key={j} className={`ns-digit-box${i === 0 && currentInput[j] !== undefined ? ' ns-digit-box--active' : ' ns-digit-box--empty'}`}>
                  {i === 0 ? (currentInput[j] !== undefined ? currentInput[j] : '') : ''}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {roundOver ? (
        <div className={`ns-round-banner ${roundResult === 'win' ? 'ns-round-banner--win' : 'ns-round-banner--lose'}`}>
          {roundResult === 'win'
            ? `✅ Trouvé en ${attempts.length} essai${attempts.length > 1 ? 's' : ''} !`
            : `❌ C'était ${secret[0]}${secret[1]}`}
          <button
            className="ns-cta ns-cta--next"
            onPointerDown={e => { e.preventDefault(); nextRound(roundResult === 'win' ? wins + 1 : wins); }}
          >
            {roundNum >= TOTAL_ROUNDS ? 'Voir résultats' : 'Manche suivante →'}
          </button>
        </div>
      ) : (
        <div className="ns-numpad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '←', 0, 'OK'].map((key) => (
            <button
              key={key}
              className={`ns-key${key === 'OK' ? ' ns-key--ok' : key === '←' ? ' ns-key--back' : ''}`}
              onPointerDown={e => {
                e.preventDefault();
                if (key === '←') handleBackspace();
                else if (key === 'OK') handleSubmit();
                else handleDigit(key);
              }}
            >
              {key}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
