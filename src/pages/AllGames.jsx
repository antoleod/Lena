import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './AllGames.css';

const BASE_URL = import.meta.env.BASE_URL;

const GAME_SECTIONS = [
  {
    title: 'Matemáticas esenciales',
    description: 'Cálculo mental, fracciones, medidas y problemas con apoyo visual.',
    items: [
      { id: 'build-number', title: 'Construir números', level: '2º-3º', desc: 'Decenas y unidades con bloques base 10.', href: `${BASE_URL}game?game=build-number&level=1` },
      { id: 'subtract-transform', title: 'Transformar y restar', level: '3º', desc: 'Restas con cambios de decenas y unidades.', href: `${BASE_URL}game?game=subtract-transform&level=1` },
      { id: 'half-game', title: 'Mitades rápidas', level: '3º-4º', desc: 'Mitades y dobles con ejemplos guiados.', href: `${BASE_URL}game?game=half-game&level=1` },
      { id: 'place-value', title: 'Valor posicional', level: '3º', desc: 'Componer y descomponer números con apoyo visual.', href: `${BASE_URL}game?game=place-value&level=1` },
      { id: 'number-line', title: 'Recta numérica', level: '2º-3º', desc: 'Avanza o retrocede según la operación.', href: `${BASE_URL}game?game=number-line&level=1` },
      { id: 'mult-div-families', title: 'Familias de multiplicar', level: '3º-4º', desc: 'Relaciona multiplicaciones y divisiones.', href: `${BASE_URL}game?game=mult-div-families&level=1` },
      { id: 'word-problems', title: 'Problemas en texto', level: '3º-4º', desc: 'Lee y elige la operación correcta.', href: `${BASE_URL}game?game=word-problems&level=1` }
    ]
  },
  {
    title: 'Lengua y gramática',
    description: 'Comprensión, dictado y uso correcto de determinantes.',
    items: [
      { id: 'possessives', title: 'Possessifs en contexte', level: '2º-4º', desc: 'Elige el determinante correcto según el contexto.', href: `${BASE_URL}game?game=possessives&level=1` }
    ]
  }
];

export default function AllGamesPage() {
  useEffect(() => {
    const previousBodyClass = document.body.className;
    document.body.className = 'allgames-body';
    document.documentElement.lang = 'es';
    document.title = 'Todos los juegos - Lena';
    return () => {
      document.body.className = previousBodyClass;
    };
  }, []);

  const totalGames = useMemo(() => GAME_SECTIONS.reduce((acc, section) => acc + section.items.length, 0), []);

  return (
    <main className="allgames-shell">
      <header className="allgames-hero">
        <div className="allgames-hero__card">
          <span className="allgames-eyebrow">Catálogo completo</span>
          <h1>Todos los juegos</h1>
          <p>
            Selecciona un juego específico o entra por curso. Todo está ordenado para avanzar con seguridad.
          </p>
          <div className="allgames-actions">
            <Link className="pill-link" to="/juegos">Ver por curso</Link>
            <Link className="pill-link" to="/menu">Volver al menú</Link>
          </div>
        </div>
        <div className="allgames-hero__stats">
          <div className="allgames-stat">
            <span className="allgames-stat__label">Juegos</span>
            <span className="allgames-stat__value">{totalGames}</span>
          </div>
          <div className="allgames-stat">
            <span className="allgames-stat__label">Niveles</span>
            <span className="allgames-stat__value">10+</span>
          </div>
          <div className="allgames-stat">
            <span className="allgames-stat__label">Cursos</span>
            <span className="allgames-stat__value">2º a 4º</span>
          </div>
        </div>
      </header>

      <div className="allgames-grid">
        {GAME_SECTIONS.map((section) => (
          <section key={section.title} className="allgames-section">
            <div className="allgames-section__header">
              <div>
                <h2>{section.title}</h2>
                <p>{section.description}</p>
              </div>
            </div>
            <div className="allgames-cards">
              {section.items.map((item) => (
                <a key={item.id} className="allgames-card" href={item.href}>
                  <div className="allgames-card__top">
                    <span className="allgames-card__title">{item.title}</span>
                    <span className="allgames-card__badge">{item.level}</span>
                  </div>
                  <p className="allgames-card__desc">{item.desc}</p>
                  <span className="allgames-card__cta">Entrar</span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
