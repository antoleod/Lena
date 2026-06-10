import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

const ALL_QUESTIONS = [
  // Facile
  { q: "Qui a inventé le téléphone ?", a: "Graham Bell", choices: ["Graham Bell", "Thomas Edison", "Nikola Tesla", "Marie Curie"], level: 1 },
  { q: "Qui a inventé l'ampoule électrique ?", a: "Thomas Edison", choices: ["Thomas Edison", "Graham Bell", "James Watt", "Albert Einstein"], level: 1 },
  { q: "En quelle année a-t-on marché sur la Lune ?", a: "1969", choices: ["1969", "1957", "1975", "1961"], level: 1 },
  { q: "Qui a inventé l'imprimerie ?", a: "Gutenberg", choices: ["Gutenberg", "Darwin", "Newton", "Galilée"], level: 1 },
  { q: "À quoi sert le thermomètre ?", a: "Mesurer la température", choices: ["Mesurer la température", "Mesurer la pression", "Mesurer le temps", "Mesurer la vitesse"], level: 1 },
  { q: "Qui a inventé l'avion ?", a: "Les frères Wright", choices: ["Les frères Wright", "Jules Verne", "Louis Blériot", "Clément Ader"], level: 1 },
  { q: "Quel instrument mesure le temps ?", a: "L'horloge", choices: ["L'horloge", "Le thermomètre", "La boussole", "Le baromètre"], level: 1 },
  { q: "Qui a découvert la pénicilline ?", a: "Alexander Fleming", choices: ["Alexander Fleming", "Louis Pasteur", "Marie Curie", "Albert Einstein"], level: 1 },
  { q: "À quoi sert la boussole ?", a: "Trouver le nord", choices: ["Trouver le nord", "Mesurer la vitesse", "Voir loin", "Mesurer le temps"], level: 1 },
  { q: "Qui a inventé le vaccin contre la variole ?", a: "Edward Jenner", choices: ["Edward Jenner", "Louis Pasteur", "Alexander Fleming", "Joseph Lister"], level: 1 },
  // Normal
  { q: "Qui a inventé le moteur à vapeur moderne ?", a: "James Watt", choices: ["James Watt", "George Stephenson", "Thomas Newcomen", "James Hargreaves"], level: 2 },
  { q: "En quelle année fut lancé le premier Spoutnik ?", a: "1957", choices: ["1957", "1961", "1969", "1945"], level: 2 },
  { q: "Qui a découvert la radioactivité ?", a: "Henri Becquerel", choices: ["Henri Becquerel", "Marie Curie", "Pierre Curie", "Ernest Rutherford"], level: 2 },
  { q: "Qui a inventé Internet ?", a: "Tim Berners-Lee", choices: ["Tim Berners-Lee", "Bill Gates", "Steve Jobs", "Vint Cerf"], level: 2 },
  { q: "À quoi sert le microscope ?", a: "Observer des objets très petits", choices: ["Observer des objets très petits", "Observer les étoiles", "Mesurer la pression", "Écouter les sons"], level: 2 },
  { q: "Qui a inventé le télescope ?", a: "Galilée", choices: ["Galilée", "Copernic", "Kepler", "Newton"], level: 2 },
  { q: "En quelle année a été inventée la radio ?", a: "1895", choices: ["1895", "1920", "1876", "1910"], level: 2 },
  { q: "Qui a inventé la dynamite ?", a: "Alfred Nobel", choices: ["Alfred Nobel", "James Watt", "Thomas Edison", "Antoine Lavoisier"], level: 2 },
  { q: "Quel scientifique a formulé la loi de la gravitation ?", a: "Isaac Newton", choices: ["Isaac Newton", "Albert Einstein", "Galilée", "Copernic"], level: 2 },
  { q: "Qui a peint la Joconde ?", a: "Léonard de Vinci", choices: ["Léonard de Vinci", "Michel-Ange", "Raphaël", "Titien"], level: 2 },
  // Expert
  { q: "En quelle année fut construite la première voiture à moteur ?", a: "1885", choices: ["1885", "1900", "1870", "1905"], level: 3 },
  { q: "Qui a découvert la structure de l'ADN ?", a: "Watson et Crick", choices: ["Watson et Crick", "Mendel", "Darwin", "Pasteur"], level: 3 },
  { q: "Quel est le nom du premier satellite artificiel de la Terre ?", a: "Spoutnik 1", choices: ["Spoutnik 1", "Explorer 1", "Luna 1", "Vostok 1"], level: 3 },
  { q: "Qui a inventé le papier ?", a: "Les Chinois", choices: ["Les Chinois", "Les Égyptiens", "Les Romains", "Les Grecs"], level: 3 },
  { q: "En quelle année fut construit le premier ordinateur programmable ?", a: "1945", choices: ["1945", "1960", "1936", "1955"], level: 3 },
  { q: "Qui a développé la théorie de la relativité ?", a: "Albert Einstein", choices: ["Albert Einstein", "Isaac Newton", "Max Planck", "Niels Bohr"], level: 3 },
  { q: "Qui a inventé le phonographe ?", a: "Thomas Edison", choices: ["Thomas Edison", "Alexander Graham Bell", "Émile Berliner", "Leon Scott"], level: 3 },
  { q: "Quelle civilisation a inventé la roue ?", a: "Les Sumériens", choices: ["Les Sumériens", "Les Égyptiens", "Les Romains", "Les Chinois"], level: 3 },
  { q: "Qui a inventé le béton armé ?", a: "Joseph Monier", choices: ["Joseph Monier", "Gustave Eiffel", "Eugène Freyssinet", "François Hennebique"], level: 3 },
  { q: "En quelle année fut inaugurée la Tour Eiffel ?", a: "1889", choices: ["1889", "1900", "1876", "1895"], level: 3 },
];

const LEVELS = [
  { label: 'Facile', key: 'facile', emoji: '💡', count: 5, levelNum: 1 },
  { label: 'Normal', key: 'normal', emoji: '🔬', count: 10, levelNum: 2 },
  { label: 'Expert', key: 'expert', emoji: '🚀', count: 10, levelNum: 3 },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function calcStars(correct, total) {
  const pct = correct / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.6) return 2;
  return pct >= 0.3 ? 1 : 0;
}

export default function InventionsPage() {
  const { progress, saveSession, resetTimer } = useGameSession('inventions');
  const [phase, setPhase] = useState('setup');
  const [levelIdx, setLevelIdx] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [result, setResult] = useState(null);

  const startGame = useCallback((idx) => {
    const cfg = LEVELS[idx];
    setLevelIdx(idx);
    const pool = ALL_QUESTIONS.filter(q => q.level <= cfg.levelNum);
    setQuestions(shuffle(pool).slice(0, cfg.count));
    setQIdx(0);
    setScore(0);
    setChosen(null);
    resetTimer();
    setPhase('play');
  }, [resetTimer]);

  const handleChoice = useCallback((choice) => {
    if (chosen !== null) return;
    setChosen(choice);
    const correct = questions[qIdx].a;
    const isCorrect = choice === correct;
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (qIdx + 1 >= questions.length) {
        const finalScore = score + (isCorrect ? 1 : 0);
        const stars = calcStars(finalScore, questions.length);
        const res = saveSession({ score: finalScore, level: levelIdx + 1, stars });
        setResult({ score: finalScore, stars, ...res });
        setPhase('results');
      } else {
        setQIdx(i => i + 1);
        setChosen(null);
      }
    }, 900);
  }, [chosen, qIdx, questions, score, saveSession, levelIdx]);

  const best = progress?.bestScore ?? 0;
  const cfg = LEVELS[levelIdx];

  if (phase === 'setup') {
    return (
      <div className="sm-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="sm-setup">
          <div className="sm-setup__hero">
            <div className="sm-setup__emoji">💡</div>
            <h1 className="sm-setup__title">Inventions</h1>
            <p className="sm-setup__sub">Connais-tu les grandes découvertes ?</p>
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
          <div className="game-results__emoji">💡</div>
          <h2 className="game-results__title">Résultat</h2>
          <div className="game-results__stars">{'⭐'.repeat(result.stars)}{'☆'.repeat(3 - result.stars)}</div>
          <div className="game-results__stats">
            <div className="game-results__stat"><span>Score</span><strong>{result.score}/{questions.length}</strong></div>
            {result.isNewBest && <div className="jeux-new-best">Nouveau record !</div>}
          </div>
          <button className="game-results__btn" onClick={() => startGame(levelIdx)}>Rejouer</button>
          <button className="game-results__btn" style={{marginTop:8}} onClick={() => setPhase('setup')}>Menu</button>
        </div>
      </div>
    );
  }

  const q = questions[qIdx];
  return (
    <div className="sm-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="game-hud">
        <span className="game-hud__score">Score : {score}</span>
        <span className="game-hud__round">{qIdx + 1}/{questions.length}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px', gap: 16 }}>
        <div className="game-question-card">
          <div className="game-question-sub">{cfg.emoji} Niveau {cfg.label}</div>
          <div className="game-question-text">{q.q}</div>
        </div>
        <div className="sm-choices">
          {q.choices.map((c) => {
            let cls = 'sm-choice';
            if (chosen !== null) {
              if (c === q.a) cls += ' is-correct';
              else if (c === chosen) cls += ' is-wrong';
            }
            return (
              <button key={c} className={cls} onClick={() => handleChoice(c)}
                style={{ '--btn-color': '#0891b2', fontSize: '0.95rem' }}>{c}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
