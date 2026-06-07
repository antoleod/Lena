import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

const ALL_QUESTIONS = [
  {
    q: 'Quelle est la capitale de la Belgique ?',
    a: 'Bruxelles',
    choices: ['Bruxelles', 'Paris', 'Amsterdam', 'Berlin'],
    fact: 'Bruxelles est aussi la capitale de l\'Europe !',
  },
  {
    q: 'De quelle couleur est le ciel par beau temps ?',
    a: 'Bleu',
    choices: ['Bleu', 'Vert', 'Rouge', 'Jaune'],
    fact: 'Le ciel est bleu à cause de la lumière du soleil.',
  },
  {
    q: 'Combien de jours y a-t-il dans une semaine ?',
    a: '7',
    choices: ['7', '5', '6', '8'],
    fact: 'Lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche — 7 jours !',
  },
  {
    q: 'Quel animal fait "Miaou" ?',
    a: 'Chat',
    choices: ['Chat', 'Chien', 'Vache', 'Canard'],
    fact: 'Les chats ronronnent aussi quand ils sont contents.',
  },
  {
    q: 'Quelle est la saison après l\'hiver ?',
    a: 'Printemps',
    choices: ['Printemps', 'Été', 'Automne', 'Décembre'],
    fact: 'Au printemps, les fleurs s\'épanouissent et les oiseaux chantent !',
  },
  {
    q: 'Combien font 5 × 5 ?',
    a: '25',
    choices: ['25', '20', '30', '15'],
    fact: 'La table de 5 est facile : elle finit toujours par 0 ou 5 !',
  },
  {
    q: 'Quel est le plus grand océan du monde ?',
    a: 'Pacifique',
    choices: ['Pacifique', 'Atlantique', 'Indien', 'Arctique'],
    fact: 'L\'océan Pacifique est si grand qu\'on pourrait y mettre tous les continents !',
  },
  {
    q: 'De quelle couleur est une banane mûre ?',
    a: 'Jaune',
    choices: ['Jaune', 'Rouge', 'Bleue', 'Verte'],
    fact: 'Une banane verte n\'est pas encore mûre. Attends qu\'elle soit jaune !',
  },
  {
    q: 'Combien y a-t-il de mois dans une année ?',
    a: '12',
    choices: ['12', '10', '11', '13'],
    fact: 'Janvier, février, mars… jusqu\'à décembre — 12 mois !',
  },
  {
    q: 'Quelle planète est la plus proche du soleil ?',
    a: 'Mercure',
    choices: ['Mercure', 'Vénus', 'Terre', 'Mars'],
    fact: 'Mercure est si proche du soleil qu\'une journée y dure 59 jours sur Terre !',
  },
  {
    q: 'Dans quel pays se trouve la Tour Eiffel ?',
    a: 'France',
    choices: ['France', 'Belgique', 'Espagne', 'Italie'],
    fact: 'La Tour Eiffel est à Paris. Elle a été construite en 1889 !',
  },
  {
    q: 'Combien de pattes a une araignée ?',
    a: '8',
    choices: ['8', '6', '4', '10'],
    fact: 'Les araignées ont 8 pattes. Les insectes, eux, en ont seulement 6 !',
  },
  {
    q: 'Quel est l\'animal le plus grand du monde ?',
    a: 'Baleine bleue',
    choices: ['Baleine bleue', 'Éléphant', 'Girafe', 'Rhinocéros'],
    fact: 'La baleine bleue peut mesurer jusqu\'à 30 mètres — autant qu\'un immeuble !',
  },
  {
    q: 'De quelle couleur est l\'herbe ?',
    a: 'Verte',
    choices: ['Verte', 'Bleue', 'Rouge', 'Jaune'],
    fact: 'L\'herbe est verte grâce à la chlorophylle qui absorbe la lumière du soleil.',
  },
  {
    q: 'Combien font 10 + 7 ?',
    a: '17',
    choices: ['17', '16', '18', '15'],
    fact: 'Pour ajouter 7 à 10, compte : 11, 12, 13, 14, 15, 16, 17 !',
  },
  {
    q: 'Quel animal est le plus rapide sur terre ?',
    a: 'Guépard',
    choices: ['Guépard', 'Lion', 'Cheval', 'Autruche'],
    fact: 'Le guépard peut courir à 110 km/h — aussi vite qu\'une voiture sur l\'autoroute !',
  },
  {
    q: 'Combien de côtés a un triangle ?',
    a: '3',
    choices: ['3', '4', '5', '6'],
    fact: 'Tri veut dire trois en latin. Un triangle a 3 côtés et 3 angles !',
  },
  {
    q: 'Quel est le fleuve qui traverse Paris ?',
    a: 'La Seine',
    choices: ['La Seine', 'Le Rhin', 'La Loire', 'Le Rhône'],
    fact: 'La Seine traverse Paris et mesure 775 km de long !',
  },
  {
    q: 'De quelle couleur est le soleil ?',
    a: 'Jaune',
    choices: ['Jaune', 'Rouge', 'Blanc', 'Orange'],
    fact: 'Le soleil semble jaune depuis la Terre, mais il est en réalité blanc dans l\'espace !',
  },
  {
    q: 'Combien de jours y a-t-il en février (année normale) ?',
    a: '28',
    choices: ['28', '29', '30', '31'],
    fact: 'Février est le mois le plus court. Tous les 4 ans, il a 29 jours — on appelle ça une année bissextile !',
  },
];

const ROUND_SIZE = 10;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function calcStars(score, total) {
  const r = score / total;
  if (r >= 0.9) return 3;
  if (r >= 0.6) return 2;
  return 1;
}

function buildRound() {
  return shuffle(ALL_QUESTIONS).slice(0, ROUND_SIZE);
}

export default function QuizCulturePage() {
  const [phase, setPhase] = useState('setup');
  const [round, setRound] = useState(() => buildRound());
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [shakeIdx, setShakeIdx] = useState(null);
  const [showFact, setShowFact] = useState(false);

  const q = round[idx];

  function startGame() {
    setRound(buildRound());
    setIdx(0);
    setScore(0);
    setPicked(null);
    setShakeIdx(null);
    setShowFact(false);
    setPhase('play');
  }

  const handleChoice = useCallback((choice, ci) => {
    if (picked !== null) return;
    const correct = choice === q.a;
    setPicked(ci);
    if (correct) {
      setScore(s => s + 1);
      setShowFact(true);
    } else {
      setShakeIdx(ci);
      setTimeout(() => setShakeIdx(null), 500);
    }
    setTimeout(() => {
      setPicked(null);
      setShowFact(false);
      if (idx + 1 >= round.length) {
        setPhase('results');
      } else {
        setIdx(i => i + 1);
      }
    }, correct ? 1400 : 1200);
  }, [picked, q, idx, round.length]);

  if (phase === 'setup') {
    return (
      <div className="qc-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="qc-setup-hero">
          <div className="qc-setup-icon">🌍</div>
          <h1 className="qc-setup-title">Quiz Culture</h1>
          <p className="qc-setup-desc">
            10 questions sur la Belgique, la France et le monde entier !<br />
            Prends ton temps — pas de minuterie.
          </p>
        </div>
        <div className="qc-setup-preview">
          <div className="qc-preview-item">🗺️ Géographie</div>
          <div className="qc-preview-item">🔢 Maths</div>
          <div className="qc-preview-item">🐾 Animaux</div>
          <div className="qc-preview-item">🌱 Nature</div>
        </div>
        <button className="qc-cta" onPointerDown={e => { e.preventDefault(); startGame(); }}>
          Commencer le quiz !
        </button>
      </div>
    );
  }

  if (phase === 'results') {
    const stars = calcStars(score, round.length);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    const msg = stars === 3 ? '🎉 Parfait !' : stars === 2 ? '👍 Très bien !' : '📚 Continue !';
    return (
      <div className="qc-page">
        <h2 className="qc-result-title">{msg}</h2>
        <div className="jeux-stars">{starStr}</div>
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {round.length}</span></div>
        <div className="jeux-result-stat"><span>Bonnes réponses</span><span>{Math.round((score / round.length) * 100)} %</span></div>
        <button
          className="qc-cta"
          style={{ marginTop: 28 }}
          onPointerDown={e => { e.preventDefault(); startGame(); }}
        >
          Rejouer
        </button>
        <Link to="/jeux" className="qc-back-link">← Retour aux jeux</Link>
      </div>
    );
  }

  // play phase
  return (
    <div className="qc-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="qc-hud">
        <span className="qc-progress">Question {idx + 1} / {round.length}</span>
        <span className="qc-score">⭐ {score}</span>
      </div>

      <div className="qc-question-card">
        <div className="qc-question-emoji">🤔</div>
        <p className="qc-question-text">{q.q}</p>
      </div>

      {showFact && q.fact && (
        <div className="qc-fact-box">
          💡 {q.fact}
        </div>
      )}

      <div className="qc-choices">
        {q.choices.map((c, ci) => {
          let cls = 'qc-choice';
          if (picked !== null) {
            if (c === q.a) cls += ' qc-choice--correct';
            else if (picked === ci) cls += ' qc-choice--wrong';
          }
          if (shakeIdx === ci) cls += ' qc-choice--shake';
          return (
            <button
              key={ci}
              className={cls}
              onPointerDown={e => { e.preventDefault(); handleChoice(c, ci); }}
              disabled={picked !== null}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
