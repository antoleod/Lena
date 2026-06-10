import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

const QUESTIONS = [
  { q: 'Dans quel continent vit le lion ?', a: 'Afrique', choices: ['Afrique', 'Asie', 'Amérique', 'Europe'] },
  { q: 'Le lion est un...', a: 'Mammifère', choices: ['Mammifère', 'Reptile', 'Oiseau', 'Insecte'] },
  { q: 'Quel est le régime alimentaire du lion ?', a: 'Carnivore', choices: ['Carnivore', 'Herbivore', 'Omnivore', 'Frugivore'] },
  { q: 'Le dauphin est un...', a: 'Mammifère', choices: ['Mammifère', 'Poisson', 'Reptile', 'Oiseau'] },
  { q: 'Où vit le pingouin ?', a: 'Antarctique', choices: ['Antarctique', 'Arctique', 'Afrique', 'Australie'] },
  { q: "L'aigle est un...", a: 'Oiseau', choices: ['Oiseau', 'Mammifère', 'Reptile', 'Insecte'] },
  { q: 'Le cobra est un...', a: 'Reptile', choices: ['Reptile', 'Mammifère', 'Oiseau', 'Amphibien'] },
  { q: 'La grenouille est un...', a: 'Amphibien', choices: ['Amphibien', 'Reptile', 'Insecte', 'Mammifère'] },
  { q: 'La pieuvre possède combien de bras ?', a: '8', choices: ['8', '6', '10', '4'] },
  { q: 'Dans quel continent vit le chameau ?', a: 'Asie / Afrique', choices: ['Asie / Afrique', 'Amérique', 'Europe', 'Océanie'] },
  { q: 'Le koala vit en...', a: 'Australie', choices: ['Australie', 'Afrique', 'Asie', 'Europe'] },
  { q: 'Que mange le panda ?', a: 'Bambou', choices: ['Bambou', 'Viande', 'Poisson', 'Insectes'] },
  { q: 'Le flamant est un...', a: 'Oiseau', choices: ['Oiseau', 'Reptile', 'Mammifère', 'Insecte'] },
  { q: 'Le requin est un...', a: 'Poisson', choices: ['Poisson', 'Mammifère', 'Reptile', 'Amphibien'] },
  { q: 'Que mange la loutre ?', a: 'Poissons et crustacés', choices: ['Poissons et crustacés', 'Herbe', 'Insectes', 'Fruits'] },
  { q: 'Le perroquet est un...', a: 'Oiseau', choices: ['Oiseau', 'Reptile', 'Mammifère', 'Insecte'] },
  { q: 'Dans quel continent vit la girafe ?', a: 'Afrique', choices: ['Afrique', 'Asie', 'Amérique', 'Europe'] },
  { q: 'Le guépard est le plus rapide des...', a: 'Mammifères terrestres', choices: ['Mammifères terrestres', 'Reptiles', 'Oiseaux', 'Poissons'] },
  { q: 'Le crocodile est un...', a: 'Reptile', choices: ['Reptile', 'Amphibien', 'Mammifère', 'Insecte'] },
  { q: 'La tortue peut vivre...', a: 'Plus de 100 ans', choices: ['Plus de 100 ans', 'Moins de 10 ans', 'Environ 20 ans', 'Environ 50 ans'] },
  { q: 'La libellule est un...', a: 'Insecte', choices: ['Insecte', 'Oiseau', 'Reptile', 'Amphibien'] },
  { q: 'Le castor construit des...', a: 'Barrages', choices: ['Barrages', 'Nids', 'Terriers', 'Toiles'] },
  { q: 'Le dauphin communique par...', a: 'Ultrasons', choices: ['Ultrasons', 'Couleurs', 'Odeurs', 'Lumière'] },
  { q: 'Quel animal peut cracher du venin ?', a: 'Cobra', choices: ['Cobra', 'Grenouille', 'Loutre', 'Flamant'] },
  { q: 'La girafe a un cou long pour...', a: 'Atteindre les feuilles hautes', choices: ['Atteindre les feuilles hautes', 'Nager', 'Courir vite', 'Se défendre'] },
  // Difficile questions
  { q: 'Combien de chambres a le cœur d\'un dauphin ?', a: '4', choices: ['4', '2', '3', '1'] },
  { q: 'Le guépard atteint quelle vitesse max ?', a: '120 km/h', choices: ['120 km/h', '80 km/h', '200 km/h', '60 km/h'] },
  { q: 'Combien d\'yeux possède la libellule ?', a: '2 yeux composés', choices: ['2 yeux composés', '4 yeux', '1 seul œil', '6 yeux'] },
  { q: 'Le castor ronge les arbres avec ses...', a: 'Incisives', choices: ['Incisives', 'Molaires', 'Griffes', 'Cornes'] },
  { q: 'La tortue luth est le plus grand des...', a: 'Reptiles marins', choices: ['Reptiles marins', 'Mammifères', 'Poissons', 'Oiseaux'] },
  { q: 'Le panda géant vit dans quel pays ?', a: 'Chine', choices: ['Chine', 'Japon', 'Inde', 'Corée'] },
  { q: 'Le flamant rose doit sa couleur à...', a: 'Son alimentation', choices: ['Son alimentation', 'Ses gènes', 'Le soleil', 'L\'eau'] },
  { q: 'Combien de dents a un requin blanc adulte ?', a: 'Environ 300', choices: ['Environ 300', 'Environ 50', 'Environ 100', 'Environ 500'] },
  { q: 'La pieuvre peut changer de...', a: 'Couleur', choices: ['Couleur', 'Taille', 'Nombre de bras', 'Poids'] },
  { q: 'Le cobra royal est le plus long des...', a: 'Serpents venimeux', choices: ['Serpents venimeux', 'Reptiles', 'Reptiles marins', 'Reptiles volants'] },
  { q: 'Le dauphin respire par...', a: 'Un évent (narine)', choices: ['Un évent (narine)', 'Des branchies', 'La peau', 'La bouche uniquement'] },
  { q: 'L\'aigle peut repérer une proie à...', a: '3 km de distance', choices: ['3 km de distance', '100 m', '500 m', '10 km'] },
  { q: 'Le chameau stocke de la graisse dans...', a: 'Ses bosses', choices: ['Ses bosses', 'Son ventre', 'Ses pattes', 'Sa queue'] },
  { q: 'La grenouille a une langue...', a: 'Collante et extensible', choices: ['Collante et extensible', 'Courte et rigide', 'Inexistante', 'Très longue et fine'] },
  { q: 'Le guépard ne peut pas...', a: 'Rugir', choices: ['Rugir', 'Courir', 'Ronronner', 'Sauter'] },
];

const LEVELS = [
  { label: 'Facile', key: 'facile', emoji: '🐾', count: 10, pool: QUESTIONS.slice(0, 25) },
  { label: 'Difficile', key: 'difficile', emoji: '🦁', count: 10, pool: QUESTIONS.slice(15) },
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
  if (pct >= 0.3) return 1;
  return 0;
}

export default function AnimauxPage() {
  const { progress, saveSession, resetTimer } = useGameSession('animaux');
  const [phase, setPhase] = useState('setup');
  const [levelIdx, setLevelIdx] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [result, setResult] = useState(null);

  const startGame = useCallback((idx) => {
    setLevelIdx(idx);
    const cfg = LEVELS[idx];
    setQuestions(shuffle(cfg.pool).slice(0, cfg.count));
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
            <div className="sm-setup__emoji">🦁</div>
            <h1 className="sm-setup__title">Quiz Animaux</h1>
            <p className="sm-setup__sub">Teste tes connaissances sur les animaux !</p>
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
          <div className="game-results__emoji">🦁</div>
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
                style={{ '--btn-color': '#7c3aed' }}>{c}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
