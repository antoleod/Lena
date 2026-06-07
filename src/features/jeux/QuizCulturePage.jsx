import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import { formatDuration } from '../../services/storage/gameProgressStore.js';
import './jeux.css';

// Question pools per level
const QUESTION_POOLS = [
  // Niveau 1: colors, animals, counting, simple geography
  [
    { q: 'De quelle couleur est le ciel par beau temps ?', a: 'Bleu', choices: ['Bleu', 'Vert', 'Rouge', 'Jaune'], fact: 'Le ciel est bleu à cause de la lumière du soleil.' },
    { q: 'Quel animal fait "Miaou" ?', a: 'Chat', choices: ['Chat', 'Chien', 'Vache', 'Canard'], fact: 'Les chats ronronnent aussi quand ils sont contents.' },
    { q: 'De quelle couleur est une banane mûre ?', a: 'Jaune', choices: ['Jaune', 'Rouge', 'Bleue', 'Verte'], fact: 'Une banane verte n\'est pas encore mûre !' },
    { q: 'Combien de jours y a-t-il dans une semaine ?', a: '7', choices: ['7', '5', '6', '8'], fact: 'Lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche — 7 jours !' },
    { q: 'De quelle couleur est l\'herbe ?', a: 'Verte', choices: ['Verte', 'Bleue', 'Rouge', 'Jaune'], fact: 'L\'herbe est verte grâce à la chlorophylle.' },
    { q: 'Combien font 2 + 3 ?', a: '5', choices: ['5', '4', '6', '7'], fact: 'Deux plus trois, c\'est cinq !' },
    { q: 'Quel animal est le plus grand ?', a: 'Éléphant', choices: ['Éléphant', 'Cheval', 'Vache', 'Cochon'], fact: 'L\'éléphant est le plus grand animal terrestre !' },
    { q: 'De quelle couleur est le soleil ?', a: 'Jaune', choices: ['Jaune', 'Rouge', 'Blanc', 'Orange'], fact: 'Le soleil semble jaune depuis la Terre, mais il est blanc dans l\'espace !' },
    { q: 'Combien y a-t-il de mois dans une année ?', a: '12', choices: ['12', '10', '11', '13'], fact: 'Janvier à décembre — 12 mois !' },
    { q: 'Quelle couleur obtient-on en mélangeant bleu et jaune ?', a: 'Vert', choices: ['Vert', 'Orange', 'Violet', 'Rouge'], fact: 'Bleu + Jaune = Vert !' },
    { q: 'Quel animal fait "Meuh" ?', a: 'Vache', choices: ['Vache', 'Mouton', 'Chèvre', 'Cochon'], fact: 'La vache fait "Meuh" et nous donne le lait !' },
    { q: 'Combien font 5 + 5 ?', a: '10', choices: ['10', '9', '11', '8'], fact: 'Cinq plus cinq font dix !' },
    { q: 'De quelle couleur est le feu ?', a: 'Rouge-orange', choices: ['Rouge-orange', 'Bleu', 'Vert', 'Violet'], fact: 'Les flammes sont rouge-orange, mais peuvent être bleues !' },
    { q: 'Quel est le bébé de la vache ?', a: 'Veau', choices: ['Veau', 'Agneau', 'Poulain', 'Chaton'], fact: 'Le bébé vache s\'appelle un veau !' },
    { q: 'Combien font 10 - 4 ?', a: '6', choices: ['6', '5', '7', '4'], fact: 'Dix moins quatre font six !' },
    { q: 'Quelle couleur obtient-on en mélangeant rouge et bleu ?', a: 'Violet', choices: ['Violet', 'Orange', 'Vert', 'Rose'], fact: 'Rouge + Bleu = Violet !' },
  ],
  // Niveau 2: Belgium/France facts, seasons, months, basic science
  [
    { q: 'Quelle est la capitale de la Belgique ?', a: 'Bruxelles', choices: ['Bruxelles', 'Paris', 'Amsterdam', 'Berlin'], fact: 'Bruxelles est aussi la capitale de l\'Europe !' },
    { q: 'Quelle est la saison après l\'hiver ?', a: 'Printemps', choices: ['Printemps', 'Été', 'Automne', 'Décembre'], fact: 'Au printemps, les fleurs s\'épanouissent !' },
    { q: 'Dans quel pays se trouve la Tour Eiffel ?', a: 'France', choices: ['France', 'Belgique', 'Espagne', 'Italie'], fact: 'La Tour Eiffel est à Paris, construite en 1889 !' },
    { q: 'Quel mois vient après mars ?', a: 'Avril', choices: ['Avril', 'Mai', 'Février', 'Juin'], fact: 'Mars, avril, mai — les mois du printemps !' },
    { q: 'Combien font 5 × 5 ?', a: '25', choices: ['25', '20', '30', '15'], fact: 'La table de 5 finit toujours par 0 ou 5 !' },
    { q: 'Quelle est la capitale de la France ?', a: 'Paris', choices: ['Paris', 'Lyon', 'Marseille', 'Bordeaux'], fact: 'Paris est appelée "la Ville Lumière" !' },
    { q: 'Combien de saisons y a-t-il dans une année ?', a: '4', choices: ['4', '3', '5', '2'], fact: 'Printemps, été, automne, hiver — 4 saisons !' },
    { q: 'Que mange un lapin ?', a: 'Carottes et herbe', choices: ['Carottes et herbe', 'Viande', 'Poisson', 'Graines seulement'], fact: 'Les lapins adorent les légumes et l\'herbe !' },
    { q: 'Quel est le fleuve qui traverse Paris ?', a: 'La Seine', choices: ['La Seine', 'Le Rhin', 'La Loire', 'Le Rhône'], fact: 'La Seine mesure 775 km de long !' },
    { q: 'Combien de jours y a-t-il en février (année normale) ?', a: '28', choices: ['28', '29', '30', '31'], fact: 'Tous les 4 ans, il a 29 jours — une année bissextile !' },
    { q: 'Quelle plante produit les glands ?', a: 'Le chêne', choices: ['Le chêne', 'Le sapin', 'Le bouleau', 'L\'érable'], fact: 'Les glands sont les fruits du chêne, adorés des écureuils !' },
    { q: 'Quel mois est le dernier de l\'année ?', a: 'Décembre', choices: ['Décembre', 'Novembre', 'Janvier', 'Octobre'], fact: 'Décembre est le 12e et dernier mois !' },
    { q: 'Quel est le sport national de la Belgique ?', a: 'Cyclisme', choices: ['Cyclisme', 'Football', 'Tennis', 'Rugby'], fact: 'La Belgique est célèbre pour ses grands cyclistes !' },
    { q: 'Qu\'est-ce que la photosynthèse ?', a: 'Les plantes fabriquent leur nourriture', choices: ['Les plantes fabriquent leur nourriture', 'Les animaux respirent', 'La pluie tombe', 'Le soleil brille'], fact: 'Les plantes utilisent la lumière pour faire leur propre nourriture !' },
    { q: 'Combien font 8 × 3 ?', a: '24', choices: ['24', '21', '27', '18'], fact: 'Huit fois trois font vingt-quatre !' },
  ],
  // Niveau 3: world capitals, animal facts, history for kids
  [
    { q: 'Quelle est la capitale du Royaume-Uni ?', a: 'Londres', choices: ['Londres', 'Dublin', 'Édimbourg', 'Cardiff'], fact: 'Londres est sur la Tamise et accueille Big Ben !' },
    { q: 'Quel est le plus grand océan du monde ?', a: 'Pacifique', choices: ['Pacifique', 'Atlantique', 'Indien', 'Arctique'], fact: 'L\'océan Pacifique est plus grand que tous les continents réunis !' },
    { q: 'Combien de pattes a une araignée ?', a: '8', choices: ['8', '6', '4', '10'], fact: 'Les araignées ont 8 pattes, les insectes 6 !' },
    { q: 'Quelle planète est la plus proche du soleil ?', a: 'Mercure', choices: ['Mercure', 'Vénus', 'Terre', 'Mars'], fact: 'Mercure est si proche du soleil qu\'une journée y dure 59 jours terres !' },
    { q: 'Quel animal est le plus rapide sur terre ?', a: 'Guépard', choices: ['Guépard', 'Lion', 'Cheval', 'Autruche'], fact: 'Le guépard peut courir à 110 km/h !' },
    { q: 'Quelle est la capitale de l\'Italie ?', a: 'Rome', choices: ['Rome', 'Milan', 'Venise', 'Florence'], fact: 'Rome est appelée "la Ville Éternelle" !' },
    { q: 'Quel est l\'animal le plus grand du monde ?', a: 'Baleine bleue', choices: ['Baleine bleue', 'Éléphant', 'Girafe', 'Rhinocéros'], fact: 'La baleine bleue peut mesurer jusqu\'à 30 mètres !' },
    { q: 'Quand a été construite la Tour Eiffel ?', a: '1889', choices: ['1889', '1776', '1905', '1850'], fact: 'La Tour Eiffel a été construite pour l\'Exposition Universelle de 1889 !' },
    { q: 'Combien de côtés a un hexagone ?', a: '6', choices: ['6', '5', '7', '8'], fact: 'Hexa signifie six en grec !' },
    { q: 'Quelle est la capitale de l\'Espagne ?', a: 'Madrid', choices: ['Madrid', 'Barcelone', 'Séville', 'Valence'], fact: 'Madrid est la plus grande ville d\'Espagne !' },
    { q: 'Quel oiseau ne peut pas voler mais court très vite ?', a: 'Autruche', choices: ['Autruche', 'Pingouin', 'Aigle', 'Perroquet'], fact: 'L\'autruche peut courir à 70 km/h !' },
    { q: 'De quoi se nourrit le panda géant ?', a: 'Bambou', choices: ['Bambou', 'Viande', 'Poisson', 'Fruits'], fact: 'Le panda mange jusqu\'à 38 kg de bambou par jour !' },
    { q: 'Quelle est la capitale de l\'Allemagne ?', a: 'Berlin', choices: ['Berlin', 'Munich', 'Hambourg', 'Cologne'], fact: 'Berlin est la plus grande ville d\'Allemagne !' },
    { q: 'Combien de planètes y a-t-il dans notre système solaire ?', a: '8', choices: ['8', '9', '7', '10'], fact: 'Depuis 2006, Pluton n\'est plus considérée comme une planète !' },
    { q: 'Quel insecte produit le miel ?', a: 'Abeille', choices: ['Abeille', 'Guêpe', 'Bourdon', 'Mouche'], fact: 'Une abeille visite jusqu\'à 1500 fleurs pour faire une cuillère de miel !' },
  ],
  // Niveau 4: harder geography, science, famous people
  [
    { q: 'Quelle est la plus haute montagne du monde ?', a: 'Everest', choices: ['Everest', 'Kilimandjaro', 'Mont Blanc', 'Aconcagua'], fact: 'L\'Everest culmine à 8 849 mètres !' },
    { q: 'Combien d\'os y a-t-il dans le corps humain adulte ?', a: '206', choices: ['206', '180', '250', '220'], fact: 'Les bébés naissent avec 270 os, qui fusionnent ensuite !' },
    { q: 'Qui a inventé le téléphone ?', a: 'Alexander Graham Bell', choices: ['Alexander Graham Bell', 'Thomas Edison', 'Nikola Tesla', 'Marie Curie'], fact: 'Graham Bell a breveté le téléphone en 1876 !' },
    { q: 'Quel est le pays le plus grand du monde ?', a: 'Russie', choices: ['Russie', 'Canada', 'Chine', 'USA'], fact: 'La Russie fait 17 millions de km² — deux fois le Canada !' },
    { q: 'Quelle est la vitesse de la lumière ?', a: '300 000 km/s', choices: ['300 000 km/s', '150 000 km/s', '1 000 km/s', '30 000 km/s'], fact: 'La lumière fait le tour de la Terre 7 fois en une seconde !' },
    { q: 'Qui a peint la Joconde ?', a: 'Léonard de Vinci', choices: ['Léonard de Vinci', 'Michel-Ange', 'Raphaël', 'Botticelli'], fact: 'Léonard de Vinci a peint la Joconde vers 1503 !' },
    { q: 'Quel gaz respirons-nous pour vivre ?', a: 'Oxygène', choices: ['Oxygène', 'Azote', 'CO2', 'Hydrogène'], fact: 'L\'air contient 21% d\'oxygène et 78% d\'azote !' },
    { q: 'Quelle est la capitale du Japon ?', a: 'Tokyo', choices: ['Tokyo', 'Osaka', 'Kyoto', 'Hiroshima'], fact: 'Tokyo est la plus grande métropole du monde !' },
    { q: 'Combien font 12 × 12 ?', a: '144', choices: ['144', '132', '156', '148'], fact: '12 × 12 = 144 — c\'est la douzaine de douzaines !' },
    { q: 'Quel scientifique a découvert la gravité ?', a: 'Isaac Newton', choices: ['Isaac Newton', 'Albert Einstein', 'Galilée', 'Darwin'], fact: 'Newton observa une pomme tomber et formula la loi de la gravité !' },
    { q: 'Quel est le continent le plus chaud ?', a: 'Afrique', choices: ['Afrique', 'Amérique du Sud', 'Asie', 'Australie'], fact: 'Le Sahara, plus grand désert chaud, couvre une grande partie de l\'Afrique !' },
    { q: 'Combien de secondes y a-t-il dans une heure ?', a: '3600', choices: ['3600', '60', '600', '1200'], fact: '60 secondes × 60 minutes = 3 600 secondes !' },
    { q: 'Quelle planète a des anneaux visibles ?', a: 'Saturne', choices: ['Saturne', 'Jupiter', 'Uranus', 'Mars'], fact: 'Les anneaux de Saturne sont faits de glace et de roches !' },
    { q: 'Quel est l\'animal le plus venimeux du monde ?', a: 'Méduse boîte', choices: ['Méduse boîte', 'Cobra royal', 'Araignée veuve noire', 'Scorpion'], fact: 'La méduse boîte peut tuer un humain en quelques minutes !' },
    { q: 'Qui a composé la "Lettre à Élise" ?', a: 'Beethoven', choices: ['Beethoven', 'Mozart', 'Bach', 'Chopin'], fact: 'Beethoven composa cette pièce vers 1810, et il était presque sourd !' },
  ],
  // Niveau 5: harder trivia, logic questions mixed with culture
  [
    { q: 'Quelle est la formule de l\'eau ?', a: 'H₂O', choices: ['H₂O', 'CO₂', 'NaCl', 'O₂'], fact: '2 atomes d\'hydrogène + 1 atome d\'oxygène = eau !' },
    { q: 'Qui a découvert l\'Amérique en 1492 ?', a: 'Christophe Colomb', choices: ['Christophe Colomb', 'Vasco de Gama', 'Magellan', 'Amerigo Vespucci'], fact: 'Colomb cherchait les Indes et a découvert les Amériques !' },
    { q: 'Combien d\'étoiles y a-t-il dans la Voie Lactée ?', a: '200 milliards', choices: ['200 milliards', '1 million', '1 milliard', '1 billion'], fact: 'Notre galaxie contient entre 100 et 400 milliards d\'étoiles !' },
    { q: 'Si un train part à 9h et arrive à 11h30, combien de temps dure le trajet ?', a: '2h30', choices: ['2h30', '2h', '3h', '1h30'], fact: '11h30 - 9h00 = 2 heures et 30 minutes !' },
    { q: 'Quel est le symbole chimique du fer ?', a: 'Fe', choices: ['Fe', 'Fr', 'Ir', 'Au'], fact: 'Fe vient du latin "ferrum" qui signifie fer !' },
    { q: 'Quelle est la plus longue rivière du monde ?', a: 'Le Nil', choices: ['Le Nil', 'L\'Amazone', 'Le Mississippi', 'Le Yangtsé'], fact: 'Le Nil mesure environ 6 650 km, légèrement plus que l\'Amazone !' },
    { q: 'Si j\'ai 48 bonbons à partager en 6 parts égales, combien chacun reçoit-il ?', a: '8', choices: ['8', '6', '7', '9'], fact: '48 ÷ 6 = 8 bonbons chacun !' },
    { q: 'Qui a écrit "Astérix" ?', a: 'Goscinny et Uderzo', choices: ['Goscinny et Uderzo', 'Hergé', 'Franquin', 'Peyo'], fact: 'René Goscinny (texte) et Albert Uderzo (dessin) ont créé Astérix en 1959 !' },
    { q: 'Quel est l\'ADN ?', a: 'Le code génétique de la vie', choices: ['Le code génétique de la vie', 'Un médicament', 'Un type d\'os', 'Une vitamine'], fact: 'L\'ADN contient toutes les instructions pour construire un organisme !' },
    { q: 'Combien de zéros y a-t-il dans un million ?', a: '6', choices: ['6', '5', '7', '9'], fact: '1 000 000 — c\'est bien 6 zéros !' },
    { q: 'Quel pays a le plus grand nombre de langues officielles ?', a: 'Suisse', choices: ['Suisse', 'Belgique', 'Canada', 'Luxembourg'], fact: 'La Suisse a 4 langues officielles : allemand, français, italien, romanche !' },
    { q: 'Qu\'est-ce qu\'un palindrome ?', a: 'Un mot qui se lit pareil à l\'envers', choices: ['Un mot qui se lit pareil à l\'envers', 'Un très grand nombre', 'Une figure géométrique', 'Une espèce d\'oiseau'], fact: '"Radar", "elle", "kayak" sont des palindromes !' },
    { q: 'Si un carré a un côté de 5cm, quel est son périmètre ?', a: '20 cm', choices: ['20 cm', '10 cm', '25 cm', '15 cm'], fact: 'Périmètre = 4 × côté = 4 × 5 = 20 cm !' },
    { q: 'Quel est le plus petit nombre premier supérieur à 10 ?', a: '11', choices: ['11', '12', '13', '10'], fact: '11 n\'est divisible que par 1 et lui-même !' },
    { q: 'Qui est l\'auteur de "Harry Potter" ?', a: 'J.K. Rowling', choices: ['J.K. Rowling', 'Roald Dahl', 'C.S. Lewis', 'Tolkien'], fact: 'J.K. Rowling a écrit les 7 livres Harry Potter entre 1997 et 2007 !' },
    { q: 'Combien de degrés dans un triangle quelconque ?', a: '180°', choices: ['180°', '90°', '360°', '270°'], fact: 'La somme des angles d\'un triangle est toujours 180° !' },
  ],
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

function buildRound(levelIdx) {
  return shuffle(QUESTION_POOLS[levelIdx]).slice(0, ROUND_SIZE);
}

export default function QuizCulturePage() {
  const { progress, saveSession, resetTimer, elapsedSecs, logError } = useGameSession('quiz-culture');

  const [phase, setPhase]         = useState('setup');
  const [selectedLevel, setSelectedLevel] = useState(Math.min(progress.unlockedLevel, 5));
  const [round, setRound]         = useState(() => buildRound(0));
  const [idx, setIdx]             = useState(0);
  const [score, setScore]         = useState(0);
  const [picked, setPicked]       = useState(null);
  const [shakeIdx, setShakeIdx]   = useState(null);
  const [showFact, setShowFact]   = useState(false);
  const [sessionResult, setSessionResult] = useState(null);

  const q = round[idx];

  function startGame() {
    setRound(buildRound(selectedLevel - 1));
    setIdx(0);
    setScore(0);
    setPicked(null);
    setShakeIdx(null);
    setShowFact(false);
    setSessionResult(null);
    resetTimer();
    setPhase('play');
  }

  const handleChoice = useCallback((choice, ci) => {
    if (picked !== null) return;
    const correct = choice === q.a;
    setPicked(ci);
    let newScore = score;
    if (correct) {
      newScore = score + 1;
      setScore(newScore);
      setShowFact(true);
    } else {
      setShakeIdx(ci);
      setTimeout(() => setShakeIdx(null), 500);
      logError({
        label: q.q,
        correct: q.a,
        given: choice,
      });
    }
    setTimeout(() => {
      setPicked(null);
      setShowFact(false);
      if (idx + 1 >= round.length) {
        const stars = calcStars(newScore, round.length);
        const secs = elapsedSecs();
        const result = saveSession({ score: newScore, level: selectedLevel, stars });
        setSessionResult({ ...result, timeSecs: secs, stars });
        setPhase('results');
      } else {
        setIdx(i => i + 1);
      }
    }, correct ? 1400 : 1200);
  }, [picked, q, idx, round, score, selectedLevel]); // eslint-disable-line react-hooks/exhaustive-deps

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

        <div className="jeux-setup-stats">
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{progress.bestScore || 0}</span>
            <span className="jeux-setup-stat__lbl">Meilleur score</span>
          </div>
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{progress.sessionsPlayed || 0}</span>
            <span className="jeux-setup-stat__lbl">Parties</span>
          </div>
          <div className="jeux-setup-stat">
            <span className="jeux-setup-stat__val">{formatDuration(progress.totalTimeSecs || 0)}</span>
            <span className="jeux-setup-stat__lbl">Temps total</span>
          </div>
        </div>

        <div className="jeux-level-grid">
          {[1, 2, 3, 4, 5].map(lvl => {
            const locked = lvl > progress.unlockedLevel;
            return (
              <button
                key={lvl}
                className={`jeux-level-btn${selectedLevel === lvl ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`}
                onPointerDown={e => { e.preventDefault(); if (!locked) setSelectedLevel(lvl); }}
              >
                {locked ? '🔒' : `Niveau ${lvl}`}
                {!locked && progress.bestLevel >= lvl && <span className="jeux-level-stars">★</span>}
              </button>
            );
          })}
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
        {sessionResult?.isNewBest && <div className="jeux-new-best">🏆 Nouveau record !</div>}
        {sessionResult?.newUnlocked && <div className="jeux-unlocked">🔓 Niveau {selectedLevel + 1} débloqué !</div>}
        {sessionResult && <div className="jeux-session-time">⏱ {sessionResult.timeSecs}s</div>}
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {round.length}</span></div>
        <div className="jeux-result-stat"><span>Bonnes réponses</span><span>{Math.round((score / round.length) * 100)} %</span></div>
        <button
          className="qc-cta"
          style={{ marginTop: 28 }}
          onPointerDown={e => { e.preventDefault(); startGame(); }}
        >
          Rejouer
        </button>
        <button
          className="qc-cta"
          style={{ marginTop: 8, background: 'rgba(255,255,255,.1)' }}
          onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}
        >
          Changer de niveau
        </button>
        <Link to="/jeux" className="qc-back-link">← Retour aux jeux</Link>
      </div>
    );
  }

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
