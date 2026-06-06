import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

const ALL_QUESTIONS = [
  { items: ['Pomme', 'Banane', 'Poire', 'Voiture'],    intrus: 3, expl: 'Voiture n\'est pas un fruit' },
  { items: ['Chat', 'Chien', 'Lapin', 'Table'],         intrus: 3, expl: 'Table n\'est pas un animal' },
  { items: ['Rouge', 'Bleu', 'Vert', 'Maison'],         intrus: 3, expl: 'Maison n\'est pas une couleur' },
  { items: ['Crayon', 'Stylo', 'Gomme', 'Soleil'],      intrus: 3, expl: 'Soleil n\'est pas une fourniture scolaire' },
  { items: ['Lion', 'Tigre', 'Elephant', 'Avion'],      intrus: 3, expl: 'Avion n\'est pas un animal' },
  { items: ['Piano', 'Guitare', 'Violon', 'Marteau'],   intrus: 3, expl: 'Marteau n\'est pas un instrument de musique' },
  { items: ['Natation', 'Football', 'Tennis', 'Cuisine'], intrus: 3, expl: 'Cuisine n\'est pas un sport' },
  { items: ['Lundi', 'Mardi', 'Mercredi', 'Janvier'],   intrus: 3, expl: 'Janvier est un mois, pas un jour' },
  { items: ['Paris', 'Lyon', 'Marseille', 'France'],    intrus: 3, expl: 'France est un pays, pas une ville' },
  { items: ['Voiture', 'Velo', 'Camion', 'Lit'],        intrus: 3, expl: 'Lit n\'est pas un moyen de transport' },
  { items: ['Bras', 'Jambe', 'Dos', 'Chapeau'],         intrus: 3, expl: 'Chapeau n\'est pas une partie du corps' },
  { items: ['Chanter', 'Danser', 'Courir', 'Table'],    intrus: 3, expl: 'Table n\'est pas une action' },
  { items: ['Rose', 'Tulipe', 'Jonquille', 'Carotte'],  intrus: 3, expl: 'Carotte n\'est pas une fleur' },
  { items: ['Mars', 'Juin', 'Aout', 'Dimanche'],        intrus: 3, expl: 'Dimanche est un jour, pas un mois' },
  { items: ['Pluie', 'Neige', 'Vent', 'Chaise'],        intrus: 3, expl: 'Chaise n\'est pas un phenomene meteo' },
  { items: ['Chocolat', 'Caramel', 'Vanille', 'Moutarde'], intrus: 3, expl: 'Moutarde n\'est pas une saveur sucree' },
  { items: ['Requin', 'Baleine', 'Dauphin', 'Aigle'],   intrus: 3, expl: 'Aigle n\'est pas un animal marin' },
  { items: ['Toit', 'Mur', 'Porte', 'Nuage'],           intrus: 3, expl: 'Nuage ne fait pas partie d\'une maison' },
  { items: ['Ecole', 'Hopital', 'Banque', 'Foret'],     intrus: 3, expl: 'Foret n\'est pas un batiment' },
  { items: ['Lire', 'Ecrire', 'Compter', 'Voler'],      intrus: 3, expl: 'Voler n\'est pas une activite scolaire' },
];

const ROUND_SIZE = 15;

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

export default function TrouveIntrusPage() {
  const [round] = useState(() => shuffle(ALL_QUESTIONS).slice(0, ROUND_SIZE));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState('play');
  const [picked, setPicked] = useState(null);
  const [shakeIdx, setShakeIdx] = useState(null);
  const [showExpl, setShowExpl] = useState(false);

  const q = round[idx];

  const handleChoice = useCallback((ci) => {
    if (picked !== null) return;
    const correct = ci === q.intrus;
    setPicked(ci);
    setShowExpl(true);
    if (correct) {
      setScore(s => s + 1);
    } else {
      setShakeIdx(ci);
      setTimeout(() => setShakeIdx(null), 500);
    }
    setTimeout(() => {
      setPicked(null);
      setShowExpl(false);
      if (idx + 1 >= round.length) {
        setPhase('results');
      } else {
        setIdx(i => i + 1);
      }
    }, 1400);
  }, [picked, q, idx, round]);

  if (phase === 'results') {
    const stars = calcStars(score, round.length);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    return (
      <div className="ti-page">
        <h2 className="ti-result-title">{stars === 3 ? '🎉 Parfait !' : stars === 2 ? '👍 Bien joue !' : '📚 Continue !'}</h2>
        <div className="jeux-stars">{starStr}</div>
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {round.length}</span></div>
        <button className="ti-cta" style={{ marginTop: 24 }} onPointerDown={e => { e.preventDefault(); window.location.reload(); }}>
          Rejouer
        </button>
        <Link to="/jeux" className="ti-back-link">← Retour aux jeux</Link>
      </div>
    );
  }

  return (
    <div className="ti-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="ti-hud">
        <span className="ti-progress">Question {idx + 1} / {round.length}</span>
        <span className="ti-score">⭐ {score}</span>
      </div>

      <div className="ti-prompt-card">
        <p className="ti-prompt">🕵️ Quel mot ne va pas avec les autres ?</p>
      </div>

      <div className="ti-choices">
        {q.items.map((item, ci) => {
          let cls = 'ti-choice';
          if (picked !== null) {
            if (ci === q.intrus) cls += ' ti-choice--correct';
            else if (picked === ci) cls += ' ti-choice--wrong';
          }
          if (shakeIdx === ci) cls += ' ti-choice--shake';
          return (
            <button
              key={ci}
              className={cls}
              onPointerDown={e => { e.preventDefault(); handleChoice(ci); }}
              disabled={picked !== null}
            >
              {item}
            </button>
          );
        })}
      </div>

      {showExpl && (
        <div className={`ti-expl${picked === q.intrus ? ' ti-expl--ok' : ' ti-expl--bad'}`}>
          {q.expl}
        </div>
      )}
    </div>
  );
}
