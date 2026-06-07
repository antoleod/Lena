import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGameSession } from '../../shared/hooks/useGameSession.js';
import './jeux.css';

// ── Sentence pools by level ────────────────────────────────────────────────

const POOL_N1 = [
  { text: 'Le ___ est rouge.', choices: ['soleil', 'ciel', 'herbe'], answer: 'soleil' },
  { text: 'Le chat boit du ___.', choices: ['lait', 'café', 'jus'], answer: 'lait' },
  { text: 'Le chien aboie et le chat ___.', choices: ['miaule', 'vole', 'nage'], answer: 'miaule' },
  { text: 'La pomme est un ___.', choices: ['fruit', 'légume', 'gâteau'], answer: 'fruit' },
  { text: 'On dort dans un ___.', choices: ['lit', 'garage', 'couloir'], answer: 'lit' },
  { text: 'Le soleil se lève le ___.', choices: ['matin', 'soir', 'midi'], answer: 'matin' },
  { text: 'On met un manteau quand il fait ___.', choices: ['froid', 'chaud', 'beau'], answer: 'froid' },
  { text: 'Le poisson vit dans ___.', choices: ["l'eau", "l'air", 'la terre'], answer: "l'eau" },
  { text: 'Les abeilles font du ___.', choices: ['miel', 'lait', 'jus'], answer: 'miel' },
  { text: 'On utilise un parapluie quand il ___.', choices: ['pleut', 'neige', 'fait beau'], answer: 'pleut' },
  { text: 'Le boulanger fait du ___.', choices: ['pain', 'fromage', 'miel'], answer: 'pain' },
  { text: 'On se lave les mains avec du ___.', choices: ['savon', 'jus', 'lait'], answer: 'savon' },
  { text: 'La nuit, on peut voir les ___.', choices: ['étoiles', 'fleurs', 'oiseaux'], answer: 'étoiles' },
  { text: 'Les oiseaux construisent un ___.', choices: ['nid', 'terrier', 'gîte'], answer: 'nid' },
  { text: 'Pour écrire, on utilise un ___.', choices: ['crayon', 'couteau', 'marteau'], answer: 'crayon' },
];

const POOL_N2 = [
  { text: 'En hiver, il peut tomber de la ___.', choices: ['neige', 'pluie chaude', 'grêle bleue'], answer: 'neige' },
  { text: 'Le pompier éteint les ___.', choices: ['incendies', 'pluies', 'nuages'], answer: 'incendies' },
  { text: 'Pour voyager loin, on prend l\'___.', choices: ['avion', 'vélo', 'trottinette'], answer: 'avion' },
  { text: 'On plante des graines dans la ___.', choices: ['terre', 'mer', 'rivière'], answer: 'terre' },
  { text: 'Le soir, le soleil ___.', choices: ['se couche', 'se lève', 'disparaît'], answer: 'se couche' },
  { text: 'Le médecin soigne les ___.', choices: ['malades', 'voitures', 'maisons'], answer: 'malades' },
  { text: 'On lit des livres dans une ___.', choices: ['bibliothèque', 'piscine', 'forêt'], answer: 'bibliothèque' },
  { text: 'Les enfants vont à l\'école pour ___.', choices: ['apprendre', 'dormir', 'nager'], answer: 'apprendre' },
  { text: 'Le lion est le roi des ___.', choices: ['animaux', 'insectes', 'poissons'], answer: 'animaux' },
  { text: 'Les fleurs poussent au ___.', choices: ['printemps', 'hiver', 'automne'], answer: 'printemps' },
  { text: 'La lune brille la ___.', choices: ['nuit', 'journée', 'matinée'], answer: 'nuit' },
  { text: 'On met du sel pour ___ les plats.', choices: ['assaisonner', 'refroidir', 'colorer'], answer: 'assaisonner' },
  { text: 'Le facteur apporte du ___.', choices: ['courrier', 'pain', 'lait'], answer: 'courrier' },
  { text: 'La tortue marche très ___.', choices: ['lentement', 'vitement', 'bruyamment'], answer: 'lentement' },
  { text: 'La nuit, on utilise une ___ pour voir.', choices: ['lampe', 'fenêtre', 'porte'], answer: 'lampe' },
  { text: 'Le jardinier plante des ___.', choices: ['fleurs', 'voitures', 'livres'], answer: 'fleurs' },
  { text: 'Pour traverser la rue, on regarde ___.', choices: ['des deux côtés', 'en l\'air', 'par terre'], answer: 'des deux côtés' },
  { text: 'Le bébé ___ quand il a faim.', choices: ['pleure', 'court', 'chante'], answer: 'pleure' },
  { text: 'Les fourmis vivent dans une ___.', choices: ['fourmilière', 'ruche', 'tanière'], answer: 'fourmilière' },
  { text: 'La mer est ___ que la piscine.', choices: ['plus grande', 'moins grande', 'aussi grande'], answer: 'plus grande' },
];

const POOL_N3 = [
  { text: 'Elle a mis ___ robe bleue.', choices: ['une', 'un', 'des'], answer: 'une' },
  { text: 'Les chats ___ leurs pattes.', choices: ['lèchent', 'lèche', 'liche'], answer: 'lèchent' },
  { text: 'Il mange ___ pommes chaque jour.', choices: ['des', 'un', 'une'], answer: 'des' },
  { text: 'La maîtresse ___ les copies.', choices: ['corrige', 'corrigent', 'corrigeons'], answer: 'corrige' },
  { text: 'Nous ___ à la bibliothèque hier.', choices: ['sommes allés', 'est allé', 'aller'], answer: 'sommes allés' },
  { text: 'Le cheval ___ dans le pré.', choices: ['galope', 'galopent', 'galopes'], answer: 'galope' },
  { text: 'Elle a trouvé ___ clé dans le jardin.', choices: ['une', 'un', 'de'], answer: 'une' },
  { text: 'Les oiseaux ___ vers le sud en automne.', choices: ['migrent', 'migre', 'migrons'], answer: 'migrent' },
  { text: 'Mon père ___ une nouvelle voiture.', choices: ['a acheté', 'achète hier', 'achetait demain'], answer: 'a acheté' },
  { text: 'Le soleil ___ de l\'est.', choices: ['se lève', 'se lève pas', 'se couchait'], answer: 'se lève' },
  { text: 'Les enfants ___ dans la cour.', choices: ['jouent', 'joue', 'jouons'], answer: 'jouent' },
  { text: 'Elle ___ sa chambre chaque matin.', choices: ['range', 'rangent', 'rangeons'], answer: 'range' },
  { text: 'Nous ___ notre repas en famille.', choices: ['prenons', 'prennent', 'prenez'], answer: 'prenons' },
  { text: 'Le chat ___ une souris.', choices: ['a attrapé', 'attrape demain', 'attrapaient hier'], answer: 'a attrapé' },
  { text: 'Les fleurs ___ quand il fait beau.', choices: ['éclosent', 'éclose', 'éclosons'], answer: 'éclosent' },
  { text: 'Il ___ très froid ce matin.', choices: ['faisait', 'font', 'faisons'], answer: 'faisait' },
  { text: 'Ma sœur ___ bien en maths.', choices: ['réussit', 'réussissent', 'réussir'], answer: 'réussit' },
  { text: 'Nous ___ partir tôt demain.', choices: ['devons', 'doivent', 'doit'], answer: 'devons' },
  { text: 'Le vent ___ les feuilles des arbres.', choices: ['arrache', 'arrachent', 'arrachez'], answer: 'arrache' },
  { text: 'Les écoliers ___ leur cartable.', choices: ['portent', 'porte', 'portons'], answer: 'portent' },
  { text: 'Elle ___ très belle aujourd\'hui.', choices: ['est', 'sont', 'sommes'], answer: 'est' },
  { text: 'Ils ___ à la mer chaque été.', choices: ['vont', 'va', 'allons'], answer: 'vont' },
  { text: 'Le professeur ___ la leçon.', choices: ['explique', 'expliquent', 'expliques'], answer: 'explique' },
  { text: 'Nous ___ contents de te voir.', choices: ['sommes', 'est', 'sont'], answer: 'sommes' },
  { text: 'La rivière ___ vers la mer.', choices: ['coule', 'coulent', 'coulons'], answer: 'coule' },
];

const POOL_N4 = [
  { text: 'Il avait le cœur ___ de joie.', choices: ['débordant', 'plein', 'rempli', 'chargé'], answer: 'débordant' },
  { text: 'Cette idée ne tient pas ___.', choices: ['la route', 'le cap', 'le coup', 'debout'], answer: 'debout' },
  { text: 'Elle a le vent ___ dans ses projets.', choices: ['en poupe', 'en face', 'de dos', 'derrière'], answer: 'en poupe' },
  { text: 'Il n\'a pas ___ un seul mot.', choices: ['soufflé', 'dit', 'parlé', 'crié'], answer: 'soufflé' },
  { text: 'Malgré la pluie, il est sorti ___ chapeau.', choices: ['sans', 'avec un', 'avec son', 'à son'], answer: 'sans' },
  { text: 'Le silence régnait, ___ dans la forêt.', choices: ['maître', 'souverain', 'absolu', 'grand'], answer: 'absolu' },
  { text: 'Il était blanc comme ___.', choices: ['un linge', 'la neige', 'du lait', 'la craie'], answer: 'un linge' },
  { text: 'Ce travail lui a coûté ___ d\'efforts.', choices: ['beaucoup', 'peu', 'trop', 'moins'], answer: 'beaucoup' },
  { text: 'Elle nage comme ___.', choices: ['un poisson', 'une grenouille', 'une otarie', 'un dauphin'], answer: 'un poisson' },
  { text: 'Ce projet est une vraie ___ d\'esprit.', choices: ['tranquillité', 'paix', 'sérénité', 'liberté'], answer: 'tranquillité' },
  { text: 'Il a mordu la ___ quand il a échoué.', choices: ['poussière', 'terre', 'pierre', 'poudre'], answer: 'poussière' },
  { text: 'La nouvelle a fait l\'___ d\'une bombe.', choices: ['effet', 'impact', 'explosion', 'bruit'], answer: 'effet' },
  { text: 'Elle est passée à côté du ___ sans le voir.', choices: ['problème', 'sujet', 'but', 'point'], answer: 'sujet' },
  { text: 'Le temps ___ toutes les blessures.', choices: ['guérit', 'efface', 'cicatrise', 'répare'], answer: 'guérit' },
  { text: 'Il a trouvé ___ dans la tempête.', choices: ['refuge', 'abri', 'shelter', 'couvert'], answer: 'refuge' },
  { text: 'Cette décision est le fruit ___ réflexion.', choices: ["d'une longue", "d'une courte", "d'une rapide", "d'une bonne"], answer: "d'une longue" },
  { text: 'Ils ont travaillé ___ d\'un seul homme.', choices: ['comme', 'à la force', 'en tant', 'à la manière'], answer: 'comme' },
  { text: 'Elle a ___ le feu vert pour partir.', choices: ['obtenu', 'reçu', 'eu', 'pris'], answer: 'obtenu' },
  { text: 'Son discours était ___ de sens.', choices: ['vide', 'plein', 'riche', 'chargé'], answer: 'vide' },
  { text: 'Il faut ___ les apparences.', choices: ['se méfier des', 'croire aux', 'juger les', 'ignorer les'], answer: 'se méfier des' },
  { text: 'Elle a gardé la tête ___ malgré tout.', choices: ['haute', 'droite', 'froide', 'libre'], answer: 'haute' },
  { text: 'Ce résultat ___ toutes les espérances.', choices: ['dépasse', 'déçoit', 'confirme', 'détruit'], answer: 'dépasse' },
  { text: 'Il a pris la décision ___ son cœur.', choices: ['du fond de', 'avec tout son', 'au fond de', 'en suivant'], answer: 'du fond de' },
  { text: 'La situation ___ de main de maître.', choices: ['était gérée', 'se gérait', 'fut gérée', 'est gérée'], answer: 'était gérée' },
  { text: 'Il faut battre le fer ___ qu\'il est chaud.', choices: ["pendant", "tant", "alors", "quand"], answer: "pendant" },
  { text: 'Cette erreur lui a servi de ___.', choices: ['leçon', 'punition', 'exemple', 'avertissement'], answer: 'leçon' },
  { text: 'Mieux vaut ___ que jamais.', choices: ['tard', 'lentement', 'prudemment', 'sûrement'], answer: 'tard' },
  { text: 'Il a réussi ___ d\'achoppement.', choices: ['malgré les pierres', 'sans les obstacles', 'après les défis', 'contre les vents'], answer: 'malgré les pierres' },
  { text: 'La curiosité est ___ du savoir.', choices: ['le moteur', 'la porte', 'la clé', 'le début'], answer: 'le moteur' },
  { text: 'Elle a vu le bout ___ tunnel.', choices: ['du', 'de ce', 'd\'un', 'au bout du'], answer: 'du' },
];

const POOL_N5 = [
  { text: 'Il mange ___ pommes.', choices: ['des', 'de', "d'", 'les'], answer: 'des' },
  { text: 'Elle parle ___ ses amis.', choices: ['avec', 'pour', 'chez', 'à'], answer: 'avec' },
  { text: 'Nous partons ___ Paris demain.', choices: ['pour', 'à', 'vers', 'en'], answer: 'pour' },
  { text: 'Il pense ___ son avenir.', choices: ['à', 'de', 'pour', 'sur'], answer: 'à' },
  { text: 'Elle rêve ___ voyage parfait.', choices: ["d'un", "d'une", 'de son', 'au'], answer: "d'un" },
  { text: 'Ils jouent ___ foot le mercredi.', choices: ['au', 'du', 'le', 'en'], answer: 'au' },
  { text: 'Ce tableau est ___ peintre célèbre.', choices: ["d'un", 'de un', 'un', 'du'], answer: "d'un" },
  { text: 'Nous avons besoin ___ aide.', choices: ["d'", 'de', 'du', 'des'], answer: "d'" },
  { text: 'Il vient ___ France.', choices: ['de', 'du', 'depuis', 'en'], answer: 'de' },
  { text: 'Elle s\'occupe ___ enfants.', choices: ['des', 'les', 'de', 'aux'], answer: 'des' },
  { text: 'Ce livre parle ___ courage.', choices: ['du', 'de', "d'un", 'le'], answer: 'du' },
  { text: 'Ils ont confiance ___ eux.', choices: ['en', 'de', 'à', 'dans'], answer: 'en' },
  { text: 'Elle est fière ___ résultats.', choices: ['de ses', 'de les', 'des', 'à ses'], answer: 'de ses' },
  { text: 'Il réussit ___ qu\'il entreprend.', choices: ['tout ce', 'tout que', 'ce tout', 'chaque que'], answer: 'tout ce' },
  { text: 'Nous avons ___ raison de douter.', choices: ['toutes les', 'toute la', 'tout la', 'tous les'], answer: 'toutes les' },
  { text: 'Elle lit ___ roman en une soirée.', choices: ['un', 'une', 'le', "l'"], answer: 'un' },
  { text: 'Il est ___ professeur compétent.', choices: ['un', 'une', 'le', 'de'], answer: 'un' },
  { text: 'Elles ont ___ projets ambitieux.', choices: ['des', 'de', 'les', 'leurs'], answer: 'des' },
  { text: 'Ce sont ___ bonnes nouvelles.', choices: ['de', 'des', 'les', 'ces'], answer: 'de' },
  { text: 'Il ne mange pas ___ viande.', choices: ['de', 'des', 'la', "d'"], answer: 'de' },
  { text: 'Nous n\'avons plus ___ pain.', choices: ['de', 'du', 'le', 'des'], answer: 'de' },
  { text: 'Elle boit beaucoup ___ café.', choices: ['de', 'du', "d'", 'le'], answer: 'de' },
  { text: 'Il parle trop ___ voix basse.', choices: ['à', 'en', 'de', 'avec'], answer: 'à' },
  { text: 'Ils habitent près ___ école.', choices: ["de l'", "de la", "du", "d'une"], answer: "de l'" },
  { text: 'Elle pense souvent ___ vacances.', choices: ['aux', 'des', 'les', 'pour'], answer: 'aux' },
  { text: 'Ce médicament sert ___ guérir.', choices: ['à', 'de', 'pour', 'en'], answer: 'à' },
  { text: 'Il s\'est trompé ___ calcul.', choices: ['de', 'dans', 'en', 'sur'], answer: 'de' },
  { text: 'Nous profitons ___ beau temps.', choices: ['du', 'de', 'les', "d'un"], answer: 'du' },
  { text: 'Elle s\'adapte bien ___ nouvelles situations.', choices: ['aux', 'des', 'les', 'à des'], answer: 'aux' },
  { text: 'Ils dépendent ___ leurs parents.', choices: ['de', 'des', 'à', 'sur'], answer: 'de' },
  { text: 'Ce roman est ___ plus beau que j\'ai lu.', choices: ['le', "l'un des", 'un des', 'des'], answer: 'le' },
  { text: 'Il s\'est souvenu ___ rendez-vous.', choices: ['du', 'de', "d'un", "d'"], answer: 'du' },
  { text: 'Elle manque ___ sommeil.', choices: ['de', 'du', "d'un", 'des'], answer: 'de' },
  { text: 'Nous tenons compte ___ avis de tous.', choices: ["de l'", 'du', 'des', "d'un"], answer: "de l'" },
  { text: 'Il insiste ___ ce point.', choices: ['sur', 'à', 'de', 'en'], answer: 'sur' },
];

const LEVEL_CONFIG = [
  { n: 1, label: 'Niveau 1', desc: 'Phrases simples, 3 choix', pool: POOL_N1, poolSize: 15, roundSize: 12, numChoices: 3 },
  { n: 2, label: 'Niveau 2', desc: 'Phrases moyennes, 3 choix', pool: POOL_N2, poolSize: 20, roundSize: 12, numChoices: 3 },
  { n: 3, label: 'Niveau 3', desc: 'Grammaire (genre, pluriel)', pool: POOL_N3, poolSize: 25, roundSize: 12, numChoices: 3 },
  { n: 4, label: 'Niveau 4', desc: 'Langage figuré, 4 choix', pool: POOL_N4, poolSize: 30, roundSize: 12, numChoices: 4 },
  { n: 5, label: 'Niveau 5', desc: 'Nuances fines, 4 choix', pool: POOL_N5, poolSize: 35, roundSize: 12, numChoices: 4 },
];

function calcStars(score, level) {
  const high = level <= 3 ? 11 : 10;
  const mid  = level <= 3 ? 8  : 7;
  if (score >= high) return 3;
  if (score >= mid)  return 2;
  return 1;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRound(cfg) {
  return shuffle(cfg.pool).slice(0, cfg.roundSize);
}

function HangmanSVG({ errors }) {
  return (
    <svg viewBox="0 0 120 140" width="120" height="140" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round">
      {/* Gallows — always visible */}
      <line x1="10" y1="135" x2="110" y2="135" />
      <line x1="30" y1="135" x2="30" y2="10" />
      <line x1="30" y1="10" x2="80" y2="10" />
      <line x1="80" y1="10" x2="80" y2="30" />
      {errors >= 1 && <circle cx="80" cy="42" r="12" />}
      {errors >= 2 && <line x1="80" y1="54" x2="80" y2="95" />}
      {errors >= 3 && <line x1="80" y1="65" x2="55" y2="82" />}
      {errors >= 4 && <line x1="80" y1="65" x2="105" y2="82" />}
      {errors >= 5 && <line x1="80" y1="95" x2="55" y2="118" />}
      {errors >= 6 && <line x1="80" y1="95" x2="105" y2="118" />}
    </svg>
  );
}

export default function PhraseMysteryPage() {
  const { progress, saveSession, resetTimer } = useGameSession('phrase-mystere');

  const [phase, setPhase]       = useState('setup');
  const [levelNum, setLevelNum] = useState(progress.unlockedLevel);
  const [round, setRound]       = useState([]);
  const [idx, setIdx]           = useState(0);
  const [score, setScore]       = useState(0);
  const [picked, setPicked]     = useState(null);
  const [shakeIdx, setShakeIdx] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [wrongCount, setWrongCount] = useState(0);

  const cfg = LEVEL_CONFIG[levelNum - 1];

  function startGame() {
    resetTimer();
    setRound(buildRound(cfg));
    setIdx(0);
    setScore(0);
    setPicked(null);
    setShakeIdx(null);
    setWrongCount(0);
    setPhase('play');
  }

  const handleChoice = useCallback((choice, ci) => {
    if (picked !== null) return;
    const correct = choice === round[idx].answer;
    setPicked(ci);
    if (correct) {
      setScore(s => s + 1);
    } else {
      setShakeIdx(ci);
      setWrongCount(w => Math.min(w + 1, 6));
      setTimeout(() => setShakeIdx(null), 500);
    }
    setTimeout(() => {
      setPicked(null);
      const nextIdx = idx + 1;
      if (nextIdx >= round.length) {
        const finalScore = correct ? score + 1 : score;
        const stars = calcStars(finalScore, levelNum);
        const result = saveSession({ score: finalScore, level: levelNum, stars });
        setScore(finalScore);
        setLastResult(result);
        setPhase('results');
      } else {
        setIdx(nextIdx);
      }
    }, correct ? 700 : 1200);
  }, [picked, round, idx, score, levelNum, saveSession]);

  // ── Setup ──────────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="pm-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, textAlign: 'center', margin: '16px 0 4px' }}>
          Phrase Mystere
        </h1>
        <p style={{ textAlign: 'center', opacity: .7, fontSize: '.9rem', marginBottom: 8 }}>
          Choisis le bon mot pour completer la phrase
        </p>

        {(progress.sessionsPlayed > 0) && (
          <div className="jeux-setup-stats">
            <div className="jeux-setup-stat">
              <span className="jeux-setup-stat__val">⭐ {progress.bestScore}</span>
              <span className="jeux-setup-stat__lbl">Meilleur score</span>
            </div>
            <div className="jeux-setup-stat">
              <span className="jeux-setup-stat__val">Niv.{progress.bestLevel}</span>
              <span className="jeux-setup-stat__lbl">Niveau atteint</span>
            </div>
            <div className="jeux-setup-stat">
              <span className="jeux-setup-stat__val">{progress.sessionsPlayed}</span>
              <span className="jeux-setup-stat__lbl">Parties</span>
            </div>
          </div>
        )}

        <div className="jeux-level-grid">
          {LEVEL_CONFIG.map(lv => {
            const locked = lv.n > progress.unlockedLevel;
            const stars  = progress.bestLevel >= lv.n ? '★★★' : '';
            return (
              <button
                key={lv.n}
                className={`jeux-level-btn${levelNum === lv.n ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`}
                onPointerDown={e => { e.preventDefault(); if (!locked) setLevelNum(lv.n); }}
                disabled={locked}
              >
                <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>N{lv.n}</span>
                <span style={{ fontSize: '.75rem', opacity: .8 }}>{lv.desc}</span>
                {locked && <span style={{ fontSize: '.7rem' }}>🔒</span>}
                {stars && <span className="jeux-level-stars">{stars}</span>}
              </button>
            );
          })}
        </div>

        <button
          className="pm-cta"
          style={{ marginTop: 16 }}
          onPointerDown={e => { e.preventDefault(); startGame(); }}
        >
          Jouer !
        </button>
      </div>
    );
  }

  // ── Results ────────────────────────────────────────────────────────────────
  if (phase === 'results') {
    const stars = calcStars(score, levelNum);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    return (
      <div className="pm-page">
        <h2 className="pm-result-title">
          {stars === 3 ? '🎉 Excellent !' : stars === 2 ? '👍 Bien joue !' : '📚 Continue !'}
        </h2>
        <div className="jeux-stars">{starStr}</div>
        {lastResult?.isNewBest && <div className="jeux-new-best">Nouveau record !</div>}
        {lastResult?.newUnlocked && (
          <div className="jeux-unlocked">Niveau {levelNum + 1} debloque !</div>
        )}
        <div className="jeux-result-stat"><span>Score</span><span>{score} / {round.length}</span></div>
        <div className="jeux-result-stat"><span>Niveau</span><span>N{levelNum}</span></div>
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button className="pm-cta" style={{ flex: 1 }} onPointerDown={e => { e.preventDefault(); startGame(); }}>
            Rejouer
          </button>
          <button className="pm-cta" style={{ flex: 1, background: 'rgba(255,255,255,.12)' }}
            onPointerDown={e => { e.preventDefault(); setPhase('setup'); }}
          >
            Niveaux
          </button>
        </div>
        <Link to="/jeux" className="pm-back-link">← Retour aux jeux</Link>
      </div>
    );
  }

  // ── Play ───────────────────────────────────────────────────────────────────
  const sentence = round[idx];
  const parts = sentence.text.split('___');

  return (
    <div className="pm-page" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' }}>
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="pm-hud">
        <span className="pm-progress">Question {idx + 1} / {round.length}</span>
        <span className="pm-score">⭐ {score}  N{levelNum}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <HangmanSVG errors={wrongCount} />
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
              style={{ minHeight: 44, padding: '10px 8px' }}
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
