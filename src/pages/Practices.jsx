import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PRACTICES, PRACTICE_CATEGORIES } from '../data/practices.js';
import './Practices.css';

const FEATURED_IDS = ['build-number', 'subtract-transform', 'word-problems'];

export default function PracticesPage() {
  const [query, setQuery] = useState('');

  useEffect(() => {
    document.body.classList.add('practices-body');
    document.documentElement.lang = 'es';
    document.title = 'Practicas - Lena';
    return () => {
      document.body.classList.remove('practices-body');
    };
  }, []);

  const featured = useMemo(
    () => PRACTICES.filter((practice) => FEATURED_IDS.includes(practice.id)),
    []
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return PRACTICES;
    return PRACTICES.filter((practice) => (
      practice.title.toLowerCase().includes(term)
      || practice.category.toLowerCase().includes(term)
      || practice.description.toLowerCase().includes(term)
    ));
  }, [query]);

  return (
    <main className="practices-shell">
      <header className="practices-hero">
        <div className="practices-hero__content">
          <span className="practices-eyebrow">Practicas guiadas</span>
          <h1>Entrena con rutas claras y niveles bien definidos</h1>
          <p>
            Cada practica incluye objetivos, niveles y tiempo estimado. Elige un area
            y avanza con ritmo seguro.
          </p>
          <div className="practices-hero__actions">
            <Link className="pill-link" to="/menu">Volver al menu</Link>
            <Link className="pill-link" to="/juegos">Ver juegos por curso</Link>
          </div>
        </div>
        <div className="practices-hero__panel">
          <div className="practices-hero__stat">
            <span>Practicas</span>
            <strong>{PRACTICES.length}</strong>
          </div>
          <div className="practices-hero__stat">
            <span>Niveles</span>
            <strong>10+</strong>
          </div>
          <div className="practices-hero__stat">
            <span>Tiempo</span>
            <strong>5-12 min</strong>
          </div>
        </div>
      </header>

      <section className="practices-search" aria-label="Buscar practicas">
        <div className="practices-search__field">
          <span className="practices-search__icon">🔎</span>
          <input
            type="search"
            placeholder="Buscar por practica o categoria"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Buscar practicas"
          />
        </div>
        <div className="practices-category-tags">
          {PRACTICE_CATEGORIES.map((category) => (
            <span
              key={category.id}
              className="practices-tag"
              style={{ '--tag-color': category.accent }}
            >
              {category.title}
            </span>
          ))}
        </div>
      </section>

      <section className="practices-featured" aria-label="Practicas destacadas">
        <div className="section-header">
          <div>
            <h2>Destacadas</h2>
            <p>Recomendadas para empezar esta semana.</p>
          </div>
        </div>
        <div className="practices-grid">
          {featured.map((practice) => (
            <Link
              key={practice.id}
              to={`/practicas/${practice.id}`}
              className="practice-card is-featured"
              style={{ '--card-accent': practice.accent }}
            >
              <div className="practice-card__top">
                <span className="practice-card__category">{practice.category}</span>
                <span className="practice-card__level">{practice.levelRange}</span>
              </div>
              <h3>{practice.title}</h3>
              <p>{practice.description}</p>
              <div className="practice-card__meta">
                <span>{practice.duration}</span>
                <span>Entrar</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="practices-all" aria-label="Todas las practicas">
        <div className="section-header">
          <div>
            <h2>Todas las practicas</h2>
            <p>Organizadas por nivel y objetivos.</p>
          </div>
        </div>
        <div className="practices-grid">
          {filtered.map((practice) => (
            <Link
              key={practice.id}
              to={`/practicas/${practice.id}`}
              className="practice-card"
              style={{ '--card-accent': practice.accent }}
            >
              <div className="practice-card__top">
                <span className="practice-card__category">{practice.category}</span>
                <span className="practice-card__level">{practice.levelRange}</span>
              </div>
              <h3>{practice.title}</h3>
              <p>{practice.description}</p>
              <div className="practice-card__meta">
                <span>{practice.duration}</span>
                <span>Ver niveles</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
