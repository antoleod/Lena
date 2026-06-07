import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

const ALL_SENTENCES = [
  { text: 'Le soleil se lève le ___.', choices: ['matin', 'soir', 'midi'], answer: 'matin' },
  { text: 'On met un manteau quand il fait ___.', choices: ['froid', 'chaud', 'beau'], answer: 'froid' },
  { text: 'Le poisson vit dans ___.', choices: ["l'eau", "l'air", 'la terre'], answer: "l'eau" },
  { text: 'La nuit, on peut voir les ___.', choices: ['étoiles', 'fleurs', 'oiseaux'], answer: 'étoiles' },
  { text: 'Pour écrire, on utilise un ___.', choices: ['crayon', 'couteau', 'marteau'], answer: 'crayon' },
  { text: 'Les abeilles font du ___.', choices: ['miel', 'lait', 'jus'], answer: 'miel' },
  { text: 'Le médecin soigne les ___.', choices: ['malades', 'voitures', 'maisons'], answer: 'malades' },
  { text: 'On lit des livres dans une ___.', choices: ['bibliothèque', 'piscine', 'forêt'], answer: 'bibliothèque' },
  { text: 'Les oiseaux construisent un ___.', choices: ['nid', 'terrier', 'tanière'], answer: 'nid' },
  { text: 'On utilise un parapluie quand il ___.', choices: ['pleut', 'neige', 'fait beau'], answer: 'pleut' },
  { text: 'Le boulanger fait du ___.', choices: ['pain', 'fromage', 'miel'], answer: 'pain' },
  { text: 'Les enfants vont à l\'école pour ___.', choices: ['apprendre', 'dormir', 'nager'], answer: 'apprendre' },
  { text: 'On se lave les mains avec du ___.', choices: ['savon', 'jus', 'lait'], answer: 'savon' },
  { text: 'Le chat boit du ___.', choices: ['lait', 'café', 'jus'], answer: 'lait' },
  { text: 'La nuit, on dort dans un ___.', choices: ['lit', 'fauteuil', 'garage'], answer: 'lit' },
  { text: 'En hiver, il peut tomber de la ___.', choices: ['neige', 'pluie chaude', 'grêle bleue'], answer: 'neige' },
  { text: 'Le pompier éteint les ___.', choices: ['incendies', 'pluies', 'nuages'], answer: 'incendies' },
  { text: 'Pour voyager loin, on prend l\'___.', choices: ['avion', 'vélo', 'trottinette'], answer: 'avion' },
  { text: 'On plante des graines dans la ___.', choices: ['terre', 'mer', 'rivière'], answer: 'terre' },
  { text: 'Le soir, le soleil ___.', choices: ['se couche', 'se lève', 'disparaît'], answer: 'se couche' },
];

const ROUND_SIZE = 12;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function calcStars(score) {
  if (score >= 10) return 3;
  if (score >= 7) return 2;
  return 1;
}

export default function PhraseMysteryPage() {
  const [phase, setPhase] = useState('play');
  const [round, setRound] = useState(() => shuffle(ALL_SENTENCES).slice(0, ROUND_SIZE));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [shakeIdx, setShakeIdx] = useState(null);

  const sentence = round[idx];

  function startGame() {
    setRound(shuffle(ALL_SENTENCES).slice(0, ROUND_SIZE));
    setIdx(0);
    setScore(0);
    setPicked(null);
    setShakeIdx(null);
    setPhase('play');
  }

  const handleChoice = useCallback((choice, ci) => {
    if (picked !== null) return;
    const correct = choice === sentence.answer;
    setPicked(ci);
    if (correct) {
      setScore(s => s + 1);
    } else {
      setShakeIdx(ci);
      setTimeout(() => setShakeIdx(null), 500);
    }
    setTimeout(() => {
      setPicked(null);
      if (idx + 1 >= round.length) {
        setPhase('results');
      } else {
        setIdx(i => i + 1);
      }
    }, correct ? 700 : 1200);
  }, [picked, sentence, idx, round]);

  if (phase === 'results') {
    const stars = calcStars(score);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    return (
      <div className="pm-page">
        <h2 className="pm-result-title">
          {stars === 3 ? '🎉 Excellent !' : stars === 2 ? '👍 Bien joué !' : '📚 Continue !'}
        </h2>
        <div className="jeux-stars">{starStr}</div>
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {round.length}</span></div>
        <button className="pm-cta" style={{ marginTop: 24 }} onPointerDown={e => { e.preventDefault(); startGame(); }}>
          Rejouer
        </button>
        <Link to="/jeux" className="pm-back-link">← Retour aux jeux</Link>
      </div>
    );
  }

  const parts = sentence.text.split('___');

  return (
    <div className="pm-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="pm-hud">
        <span className="pm-progress">Question {idx + 1} / {round.length}</span>
        <span className="pm-score">⭐ {score}</span>
      </div>

      <div className="pm-sentence-card">
        <div className="pm-sentence-label">Complete la phrase :</div>
        <p className="pm-sentence">
          {parts[0]}
          <span className="pm-blank">{picked !== null ? sentence.answer : '___'}</span>
          {parts[1]}
        </p>
      </div>

      <div className="pm-choices">
        {sentence.choices.map((c, ci) => {
          let cls = 'pm-choice';
          if (picked !== null) {
            if (c === sentence.answer) cls += ' pm-choice--correct';
            else if (picked === ci) cls += ' pm-choice--wrong';
          }
          if (shakeIdx === ci) cls += ' pm-choice--shake';
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
