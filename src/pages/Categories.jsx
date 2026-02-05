import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Categories.css';

const CATEGORIES = [
  {
    id: 'segundo',
    title: '2Âº de primaria',
    subtitle: 'MatemÃ¡ticas, lectura, lÃ³gica y mundo para 2Âº de primaria (BÃ©lgica).',
    route: '/juegos/segundo',
    color: '#7bb8ff',
    items: ['CÃ¡lculo y tablas', 'Lectura y dictado', 'LÃ³gica y puzzles']
  },
  {
    id: 'tercero',
    title: '3Âº de primaria',
    subtitle: 'Retos mÃ¡s avanzados: problemas, fracciones, medidas y razonamiento.',
    route: '/juegos/tercero',
    color: '#ff9fb2',
    items: ['Problemas y fracciones', 'Series y medidas', 'ComprensiÃ³n y lÃ³gica']
  },
  {
    id: 'cuarto',
    title: '4Âº de primaria',
    subtitle: 'Consolida operaciones, lÃ³gica y comprensiÃ³n lectora.',
    route: '/juegos/cuarto',
    color: '#7fd0c4',
    items: ['Operaciones y fracciones', 'LÃ³gica y deducciÃ³n', 'Lectura y expresiÃ³n']
  }
];

const QUICK_LINKS = [
  { label: 'Todos los juegos', route: '/juego' },
  { label: 'Logros', route: '/logros' },
  { label: 'Boutique', route: '/boutique' }
];

const USER_PROFILE_KEY = 'mathsLenaUserProfile';

function getPlayerName() {
  try {
    const raw = window.localStorage?.getItem(USER_PROFILE_KEY);
    if (!raw) return 'Aventurera';
    const parsed = JSON.parse(raw);
    return parsed?.name || parsed?.displayName || 'Aventurera';
  } catch (error) {
    return 'Aventurera';
  }
}

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState(() => getPlayerName());

  useEffect(() => {
    document.body.classList.add('categories-body');
    document.documentElement.lang = 'es';
    document.title = 'Juegos por cursos - Lena';

    return () => {
      document.body.classList.remove('categories-body');
    };
  }, []);

  useEffect(() => {
    setPlayerName(getPlayerName());
  }, []);

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/menu');
  }

  return (
    <main className="categories-shell">
      <header className="categories-hero">
        <div className="hero-card">
          <span className="hero-eyebrow">Juegos por curso</span>
          <h1>Elige el curso y entra a jugar</h1>
          <p>
            Cada curso reÃºne todas las materias. AsÃ­ el acceso es mÃ¡s rÃ¡pido y el contenido estÃ¡ mejor ordenado.
          </p>
          <div className="hero-actions">
            {QUICK_LINKS.map((link) => (
              <Link key={link.route} className="pill-link" to={link.route}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="hero-panel">
          <div className="hero-panel__glow"></div>
          <div className="hero-panel__content">
            <div className="hero-stat">
              <span className="hero-stat__label">Cursos</span>
              <span className="hero-stat__value">3</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat__label">Materias</span>
              <span className="hero-stat__value">Todas</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat__label">Dificultad</span>
              <span className="hero-stat__value">2Âº a 4Âº</span>
            </div>
          </div>
        </div>
      </header>

      <section className="categories-grid" aria-label="Cursos">
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            to={category.route}
            className="cat-card"
            style={{ '--card-color': category.color }}
            aria-label={`Abrir ${category.title}`}
          >
            <div className="cat-card__header">
              <h2>{category.title}</h2>
              <span className="cat-card__cta">Entrar</span>
            </div>
            <p className="cat-card__subtitle">{category.subtitle}</p>
            <ul className="cat-card__list">
              {category.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Link>
        ))}
      </section>

      <footer className="categories-footer" aria-label="Estado de juego">
        <div className="categories-footer__player">
          <span className="categories-footer__label">Jugando:</span>
          <span className="categories-footer__name">{playerName}</span>
        </div>
        <button className="categories-footer__back" type="button" onClick={handleBack}>
          <span aria-hidden="true">â†</span>
          <span>Ir atrÃ¡s</span>
        </button>
      </footer>
    </main>
  );
}
