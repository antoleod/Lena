import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Categories.css';

const CATEGORIES = [
  {
    id: 'novedades',
    title: 'Novedades 3º primaria',
    subtitle: 'Nuevos retos para 3º de primaria (Bélgica): problemas, fracciones y series.',
    route: '/juegos/novedades',
    color: '#ff9fb2',
    items: ['Problemas mágicos', 'Fracciones fantásticas', 'Series numéricas']
  },
  {
    id: 'matematicas',
    title: 'Matemáticas',
    subtitle: 'Cálculo, medidas, tiempo y tablas para 3º de primaria.',
    route: '/juegos/matematicas',
    color: '#5b9dff',
    items: ['Multiplicaciones y divisiones', 'Medidas y reloj', 'Tablas y problemas']
  },
  {
    id: 'logica',
    title: 'Lógica y Razonamiento',
    subtitle: 'Secuencias, laberintos y pensamiento lógico.',
    route: '/juegos/logica',
    color: '#7f58ff',
    items: ['Secuencias', 'Laberinto lógico', 'Logigramas']
  },
  {
    id: 'lectura',
    title: 'Lectura y Palabras',
    subtitle: 'Lectura, dictado, vocabulario y gramática.',
    route: '/juegos/lectura',
    color: '#f6a04d',
    items: ['Lectura mágica', 'Dictado', 'Gramática y vocabulario']
  },
  {
    id: 'creativo',
    title: 'Creativo y Mundo',
    subtitle: 'Arte, puzzles y exploración del mundo.',
    route: '/juegos/creativo',
    color: '#43c9a3',
    items: ['Puzzle mágico', 'Colores', 'Mapa del mundo']
  },
  {
    id: 'emociones',
    title: 'Emociones y Bienestar',
    subtitle: 'Respirar, reflexionar y misiones diarias.',
    route: '/juegos/emociones',
    color: '#f383b3',
    items: ['Emociones mágicas', 'Misiones del día', 'Respira y relájate']
  }
];

const QUICK_LINKS = [
  { label: 'Todos los juegos', route: '/juego' },
  { label: 'Logros', route: '/logros' },
  { label: 'Boutique', route: '/boutique' }
];

export default function CategoriesPage() {
  useEffect(() => {
    const previousBodyClass = document.body.className;
    document.body.className = 'categories-body';
    document.documentElement.lang = 'es';
    document.title = 'Juegos por categorías - Lena';

    return () => {
      document.body.className = previousBodyClass;
    };
  }, []);

  return (
    <main className="categories-shell">
      <header className="categories-hero">
        <div className="hero-card">
          <span className="hero-eyebrow">Tu aventura en secciones</span>
          <h1>Elige una categoría y empieza a jugar</h1>
          <p>
            Cada página está pensada para concentrarse en un tipo de reto. Así todo se siente más ligero y ordenado.
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
              <span className="hero-stat__label">Categorías</span>
              <span className="hero-stat__value">6</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat__label">Experiencias</span>
              <span className="hero-stat__value">30+</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat__label">Modos</span>
              <span className="hero-stat__value">Calma y Rápido</span>
            </div>
          </div>
        </div>
      </header>

      <section className="categories-grid" aria-label="Categorías de juegos">
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            to={category.route}
            className="cat-card"
            style={{ '--card-color': category.color }}
            aria-label={`Abrir categoría ${category.title}`}
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
    </main>
  );
}
