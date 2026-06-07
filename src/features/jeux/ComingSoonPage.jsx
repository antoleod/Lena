import { Link, useLocation } from 'react-router-dom';
import './jeux.css';

const SOON_GAMES = {
  '/jeux/casse-briques':    { emoji: '🧱', name: 'Casse Briques',        desc: 'Détruis toutes les briques avec la balle !' },
  '/jeux/snake':            { emoji: '🐍', name: 'Snake',               desc: 'Mange les pommes, ne te mords pas la queue !' },
  '/jeux/ninja-fruits':     { emoji: '🍉', name: 'Ninja Fruits',         desc: 'Coupe les fruits et évite les bombes !' },
  '/jeux/synonymes':        { emoji: '🔄', name: 'Synonymes',            desc: 'Trouve le mot qui veut dire la même chose !' },
  '/jeux/anagrammes':       { emoji: '🔀', name: 'Anagrammes',           desc: 'Forme de nouveaux mots avec les mêmes lettres !' },
  '/jeux/poesie':           { emoji: '📜', name: 'Rimes Rapides',        desc: 'Trouve les mots qui riment !' },
  '/jeux/geometrie':        { emoji: '📐', name: 'Formes Magiques',      desc: 'Reconnais et dessine les formes géométriques !' },
  '/jeux/lecture-vitesse':  { emoji: '🚀', name: 'Lecture Rapide',       desc: 'Lis le texte le plus vite possible !' },
  '/jeux/sudoku-images':    { emoji: '🖼️', name: 'Sudoku Images',        desc: 'Un sudoku adapté avec de jolies images !' },
  '/jeux/labyrinthe':       { emoji: '🗺️', name: 'Labyrinthe Magique',   desc: 'Trouve le chemin de sortie !' },
  '/jeux/motifs':           { emoji: '💠', name: 'Suite de Motifs',      desc: 'Quelle image vient ensuite dans la série ?' },
  '/jeux/objets-caches':    { emoji: '🏠', name: 'Objets Cachés',        desc: 'Mémorise la chambre et retrouve ce qui a disparu !' },
  '/jeux/inventions':       { emoji: '💡', name: 'Grandes Inventions',   desc: 'Découvre qui a inventé quoi !' },
  '/jeux/animaux':          { emoji: '🦁', name: 'Cris des Animaux',     desc: 'Qui fait ce bruit ? Trouve le bon animal !' },
};

export default function ComingSoonPage() {
  const { pathname } = useLocation();
  const game = SOON_GAMES[pathname] || { emoji: '🎮', name: 'Jeu', desc: 'Ce jeu arrive bientôt !' };

  return (
    <div className="an-page" style={{ textAlign: 'center' }}>
      <Link to="/jeux" className="exam-back-btn">←</Link>

      <div style={{
        fontSize: '6rem',
        marginBottom: '1rem',
        animation: 'bounce 1s infinite alternate',
      }}>
        {game.emoji}
      </div>

      <h1 className="an-title">{game.name}</h1>
      <p className="an-subtitle" style={{ marginBottom: '2rem' }}>{game.desc}</p>

      <div style={{
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        color: '#fff',
        borderRadius: 20,
        padding: '24px 32px',
        display: 'inline-block',
        marginBottom: '2rem',
        boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚧</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>Bientôt disponible !</div>
        <div style={{ opacity: 0.85, marginTop: 8, fontSize: '1rem' }}>
          Ce jeu est en cours de création.
          <br />Reviens bientôt pour le découvrir !
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/jeux" className="an-cta">🎮 Voir tous les jeux</Link>
        <Link to="/" className="an-cta an-cta--soft">🏠 Accueil</Link>
      </div>

      <style>{`
        @keyframes bounce {
          from { transform: translateY(0); }
          to   { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}
