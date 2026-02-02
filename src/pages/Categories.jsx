import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Categories.css';

const CATEGORIES = [
  {
    id: 'segundo',
    title: '2º de primaria',
    subtitle: 'Matemáticas, lectura, lógica y mundo para 2º de primaria (Bélgica).',
    route: '/juegos/segundo',
    color: '#7bb8ff',
    items: ['Cálculo y tablas', 'Lectura y dictado', 'Lógica y puzzles']
  },
  {
    id: 'tercero',
    title: '3º de primaria',
    subtitle: 'Retos más avanzados: problemas, fracciones, medidas y razonamiento.',
    route: '/juegos/tercero',
    color: '#ff9fb2',
    items: ['Problemas y fracciones', 'Series y medidas', 'Comprensión y lógica']
  },
  {
    id: 'cuarto',
    title: '4º de primaria',
    subtitle: 'Autonomía y precisión: textos largos, corrección y explicación simple.',
    route: '/juegos/cuarto',
    color: '#8bdba2',
    items: ['Possessifs en contexte', 'Razonamiento avanzado', 'Corrección de errores']
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
    document.title = 'Juegos por cursos - Lena';

    return () => {
      document.body.className = previousBodyClass;
    };
  }, []);

  return (
    <main className="categories-shell">
      <header className="categories-hero">
        <div className="hero-card">
          <span className="hero-eyebrow">Juegos por curso</span>
          <h1>Elige el curso y entra a jugar</h1>
          <p>
            Cada curso reúne todas las materias. Así el acceso es más rápido y el contenido está mejor ordenado.
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
              <span className="hero-stat__value">2º a 4º</span>
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
    </main>
  );
}
