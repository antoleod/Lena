import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './jeux.css';

const STORIES = [
  {
    id: 'chien',
    title: 'Le Chien Perdu',
    emoji: '🐕',
    text: 'Max est un petit chien blanc. Un jour, il s\'echappe du jardin. Il court dans la rue et renifle partout. Une fille gentille le trouve pres de l\'ecole. Elle le ramene a son maitre qui est tres content.',
    questions: [
      { q: 'Comment s\'appelle le chien ?', a: 'Max', choices: ['Rex', 'Max', 'Filou', 'Oscar'] },
      { q: 'De quelle couleur est le chien ?', a: 'blanc', choices: ['noir', 'blanc', 'roux', 'gris'] },
      { q: 'Ou la fille trouve-t-elle le chien ?', a: 'pres de l\'ecole', choices: ['dans le parc', 'pres de l\'ecole', 'dans la foret', 'chez elle'] },
      { q: 'Le maitre est content a la fin.', a: 'Vrai', choices: ['Vrai', 'Faux'] },
    ],
  },
  {
    id: 'grenouille',
    title: 'La Petite Grenouille',
    emoji: '🐸',
    text: 'Lila est une petite grenouille verte. Elle habite au bord d\'un etang. Chaque matin, elle saute sur les nenuphars. Un jour, il pleut tres fort et l\'etang monte. Lila grimpe sur une grosse pierre pour rester au sec.',
    questions: [
      { q: 'Comment s\'appelle la grenouille ?', a: 'Lila', choices: ['Nina', 'Lila', 'Lola', 'Lena'] },
      { q: 'Ou habite Lila ?', a: 'au bord d\'un etang', choices: ['dans la foret', 'au bord d\'un etang', 'dans un jardin', 'sur un arbre'] },
      { q: 'Que fait Lila le matin ?', a: 'elle saute sur les nenuphars', choices: ['elle chante', 'elle dort', 'elle saute sur les nenuphars', 'elle nage'] },
      { q: 'Lila grimpe sur une grosse pierre.', a: 'Vrai', choices: ['Vrai', 'Faux'] },
    ],
  },
  {
    id: 'gateau',
    title: 'Le Gateau de Mamie',
    emoji: '🎂',
    text: 'Aujourd\'hui, c\'est l\'anniversaire de Lucie. Sa mamie prepare un beau gateau au chocolat. Elle met huit bougies dessus. Lucie souffle toutes les bougies d\'un seul coup. Tout le monde applaudit et mange du gateau.',
    questions: [
      { q: 'Qui prepare le gateau ?', a: 'la mamie de Lucie', choices: ['la maman', 'la mamie de Lucie', 'la soeur', 'la maitresse'] },
      { q: 'De quelle saveur est le gateau ?', a: 'chocolat', choices: ['vanille', 'fraise', 'chocolat', 'citron'] },
      { q: 'Combien de bougies y a-t-il ?', a: '8', choices: ['6', '7', '8', '9'] },
      { q: 'Lucie ne reussit pas a souffler toutes les bougies.', a: 'Faux', choices: ['Vrai', 'Faux'] },
    ],
  },
  {
    id: 'astronaute',
    title: 'Le Petit Astronaute',
    emoji: '🚀',
    text: 'Tom reve de voyager dans l\'espace. Il construit une fusee avec des boites en carton. Il met un casque de cycliste sur la tete. Il compte: cinq, quatre, trois, deux, un, decollage! Il fait semblant de voler dans sa chambre.',
    questions: [
      { q: 'Comment s\'appelle le garcon ?', a: 'Tom', choices: ['Tim', 'Tom', 'Leo', 'Sam'] },
      { q: 'Avec quoi Tom construit-il sa fusee ?', a: 'des boites en carton', choices: ['du bois', 'des boites en carton', 'du metal', 'des journaux'] },
      { q: 'Que met Tom sur la tete ?', a: 'un casque de cycliste', choices: ['un chapeau', 'un casque de cycliste', 'une couronne', 'un chapeau de cowboy'] },
      { q: 'Tom voyage vraiment dans l\'espace.', a: 'Faux', choices: ['Vrai', 'Faux'] },
    ],
  },
  {
    id: 'biblio',
    title: 'La Bibliotheque Magique',
    emoji: '📚',
    text: 'Emma decouvre une vieille bibliotheque au fond du grenier. Les livres ont des couvertures colorees et sentent bon. Elle en ouvre un et des images apparaissent dans les airs. Un dragon bleu sort des pages et lui dit bonjour. Emma n\'a plus peur car le dragon est tres gentil.',
    questions: [
      { q: 'Ou Emma trouve-t-elle la bibliotheque ?', a: 'au fond du grenier', choices: ['dans le jardin', 'au fond du grenier', 'dans la cave', 'dans sa chambre'] },
      { q: 'De quelle couleur est le dragon ?', a: 'bleu', choices: ['rouge', 'vert', 'bleu', 'dore'] },
      { q: 'Emma a tres peur du dragon.', a: 'Faux', choices: ['Vrai', 'Faux'] },
      { q: 'Les livres apparaissent dans les airs.', a: 'Faux', choices: ['Vrai', 'Faux'] },
    ],
  },
];

function calcStars(score, total) {
  const r = score / total;
  if (r >= 0.9) return 3;
  if (r >= 0.6) return 2;
  return 1;
}

export default function DetectiveHistoiresPage() {
  const [storyIdx, setStoryIdx] = useState(0);
  const [phase, setPhase] = useState('read'); // read | questions | results | final
  const [qIdx, setQIdx] = useState(0);
  const [scores, setScores] = useState(Array(STORIES.length).fill(0));
  const [picked, setPicked] = useState(null);
  const [shakeIdx, setShakeIdx] = useState(null);

  const story = STORIES[storyIdx];
  const question = story.questions[qIdx];

  const totalQ = STORIES.reduce((acc, s) => acc + s.questions.length, 0);
  const totalScore = scores.reduce((a, b) => a + b, 0);

  const handleChoice = useCallback((c, ci) => {
    if (picked !== null) return;
    const correct = c === question.a;
    setPicked(ci);
    if (correct) {
      setScores(sc => { const n = [...sc]; n[storyIdx] += 1; return n; });
    } else {
      setShakeIdx(ci);
      setTimeout(() => setShakeIdx(null), 500);
    }
    setTimeout(() => {
      setPicked(null);
      const nextQ = qIdx + 1;
      if (nextQ >= story.questions.length) {
        const nextStory = storyIdx + 1;
        if (nextStory >= STORIES.length) {
          setPhase('final');
        } else {
          setStoryIdx(nextStory);
          setQIdx(0);
          setPhase('read');
        }
      } else {
        setQIdx(nextQ);
      }
    }, correct ? 600 : 1200);
  }, [picked, question, qIdx, story, storyIdx]);

  if (phase === 'final') {
    const stars = calcStars(totalScore, totalQ);
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    return (
      <div className="dh-page">
        <h2 className="dh-result-title">{stars === 3 ? '🕵️ Super detective !' : stars === 2 ? '🎉 Bravo !' : '📖 Continue !'}</h2>
        <div className="jeux-stars">{starStr}</div>
        <div className="jeux-result-stat"><span>Score total</span><span>{totalScore} / {totalQ}</span></div>
        {STORIES.map((s, i) => (
          <div key={s.id} className="jeux-result-stat">
            <span>{s.emoji} {s.title}</span>
            <span>{scores[i]} / {s.questions.length}</span>
          </div>
        ))}
        <button
          className="dh-cta"
          style={{ marginTop: 24 }}
          onPointerDown={e => { e.preventDefault(); window.location.reload(); }}
        >
          Recommencer
        </button>
        <Link to="/jeux" className="dh-back-link">← Retour aux jeux</Link>
      </div>
    );
  }

  if (phase === 'read') {
    return (
      <div className="dh-page">
        <Link to="/jeux" className="exam-back-btn">←</Link>
        <div className="dh-story-num">Histoire {storyIdx + 1} / {STORIES.length}</div>
        <div className="dh-story-card">
          <div className="dh-story-emoji">{story.emoji}</div>
          <h2 className="dh-story-title">{story.title}</h2>
          <p className="dh-story-text">{story.text}</p>
        </div>
        <button
          className="dh-cta"
          onPointerDown={e => { e.preventDefault(); setPhase('questions'); setQIdx(0); }}
        >
          J\'ai lu ! → Questions
        </button>
      </div>
    );
  }

  return (
    <div className="dh-page">
      <Link to="/jeux" className="exam-back-btn">←</Link>
      <div className="dh-hud">
        <span>{story.emoji} {story.title}</span>
        <span>Q {qIdx + 1}/{story.questions.length}</span>
      </div>

      <div className="dh-q-card">
        <p className="dh-q-text">🔎 {question.q}</p>
      </div>

      <div className="dh-choices">
        {question.choices.map((c, ci) => {
          let cls = 'dh-choice';
          if (picked !== null) {
            if (c === question.a) cls += ' dh-choice--correct';
            else if (picked === ci) cls += ' dh-choice--wrong';
          }
          if (shakeIdx === ci) cls += ' dh-choice--shake';
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
