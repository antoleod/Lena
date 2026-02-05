import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './AllGames.css';

const GAME_SECTIONS = [
  {
    title: 'Juegos rápidos',
    description: 'Retos cortos y dinámicos con progreso automático y feedback inmediato.',
    items: [
      { id: 'build-number', title: 'Construir números', level: '2º-3º', desc: 'Decenas y unidades con bloques base 10.', to: '/game?game=build-number&level=1', kind: 'new', group: 'matematicas' },
      { id: 'subtract-transform', title: 'Transformar y restar', level: '3º', desc: 'Restas con cambios de decenas y unidades.', to: '/game?game=subtract-transform&level=1', kind: 'new', group: 'matematicas' },
      { id: 'half-game', title: 'Mitades rápidas', level: '3º-4º', desc: 'Mitades y dobles con ejemplos guiados.', to: '/game?game=half-game&level=1', kind: 'new', group: 'matematicas' },
      { id: 'place-value', title: 'Valor posicional', level: '3º', desc: 'Componer y descomponer números con apoyo visual.', to: '/game?game=place-value&level=1', kind: 'new', group: 'matematicas' },
      { id: 'number-line', title: 'Recta numérica', level: '2º-3º', desc: 'Avanza o retrocede según la operación.', to: '/game?game=number-line&level=1', kind: 'new', group: 'matematicas' },
      { id: 'mult-div-families', title: 'Familias de multiplicar', level: '3º-4º', desc: 'Relaciona multiplicaciones y divisiones.', to: '/game?game=mult-div-families&level=1', kind: 'new', group: 'matematicas' },
      { id: 'word-problems', title: 'Problemas en texto', level: '3º-4º', desc: 'Lee y elige la operación correcta.', to: '/game?game=word-problems&level=1', kind: 'new', group: 'matematicas' },
      { id: 'possessives', title: 'Determinantes posesivos', level: '2º-4º', desc: 'Elige el determinante correcto según el contexto.', to: '/game?game=possessives&level=1', kind: 'new', group: 'lengua' }
    ]
  },
  {
    title: 'Clásicos Lena',
    description: 'Acceso directo a los juegos clásicos del mundo mágico.',
    items: [
      { id: 'math-blitz', title: 'Maths Sprint', level: '2º-4º', desc: 'Velocidad de cálculo con preguntas rápidas.', to: '/legacy?topic=math-blitz', kind: 'legacy', group: 'matematicas' },
      { id: 'additions', title: 'Additions', level: '2º-3º', desc: 'Sumas con apoyo visual y recompensas.', to: '/legacy?topic=additions', kind: 'legacy', group: 'matematicas' },
      { id: 'soustractions', title: 'Soustractions', level: '2º-3º', desc: 'Restas guiadas para ganar soltura.', to: '/legacy?topic=soustractions', kind: 'legacy', group: 'matematicas' },
      { id: 'multiplications', title: 'Multiplications', level: '2º-4º', desc: 'Practica multiplicaciones con ritmo.', to: '/legacy?topic=multiplications', kind: 'legacy', group: 'matematicas' },
      { id: 'divisions', title: 'Divisions', level: '3º-4º', desc: 'Divisiones con pistas visuales.', to: '/legacy?topic=divisions', kind: 'legacy', group: 'matematicas' },
      { id: 'base-ten-build', title: 'Construis le nombre', level: '2º', desc: 'Bloques base 10 para componer números.', to: '/legacy?topic=base-ten-build', kind: 'legacy', group: 'matematicas' },
      { id: 'base-ten-subtract', title: 'Soustraire, c’est transformer', level: '2º-3º', desc: 'Restas con transformaciones guiadas.', to: '/legacy?topic=base-ten-subtract', kind: 'legacy', group: 'matematicas' },
      { id: 'repartis', title: 'Répartis & Multiplie', level: '2º-4º', desc: 'Distribuye y multiplica con lógica.', to: '/legacy?topic=repartis', kind: 'legacy', group: 'matematicas' },
      { id: 'problems-magiques', title: 'Problèmes magiques', level: '3º-4º', desc: 'Problemas cortos con narrativa.', to: '/legacy?topic=problems-magiques', kind: 'legacy', group: 'matematicas' },
      { id: 'fractions-fantastiques', title: 'Fractions fantastiques', level: '3º-4º', desc: 'Fracciones con ejemplos mágicos.', to: '/legacy?topic=fractions-fantastiques', kind: 'legacy', group: 'matematicas' },
      { id: 'temps-horloges', title: 'Temps & horloges', level: '3º-4º', desc: 'Lectura de la hora con ejercicios.', to: '/legacy?topic=temps-horloges', kind: 'legacy', group: 'matematicas' },
      { id: 'tables-defi', title: 'Tables défi', level: '3º-4º', desc: 'Tablas rápidas con retos crecientes.', to: '/legacy?topic=tables-defi', kind: 'legacy', group: 'matematicas' },
      { id: 'series-numeriques', title: 'Séries numériques', level: '3º-4º', desc: 'Completa series con patrones.', to: '/legacy?topic=series-numeriques', kind: 'legacy', group: 'matematicas' },
      { id: 'mesures-magiques', title: 'Mesures magiques', level: '3º-4º', desc: 'Medidas y magnitudes en contextos.', to: '/legacy?topic=mesures-magiques', kind: 'legacy', group: 'matematicas' },
      { id: 'lecture-magique', title: 'Lecture magique', level: '2º-4º', desc: 'Lectura guiada con comprensión.', to: '/legacy?topic=lecture-magique', kind: 'legacy', group: 'lengua' },
      { id: 'dictee', title: 'Dictée magique', level: '2º-4º', desc: 'Dictado con apoyo visual y audio.', to: '/legacy?topic=dictee', kind: 'legacy', group: 'lengua' },
      { id: 'mots-outils', title: 'Mots-outils', level: '2º-4º', desc: 'Palabras frecuentes y ortografía.', to: '/legacy?topic=mots-outils', kind: 'legacy', group: 'lengua' },
      { id: 'stories', title: 'Contes magiques', level: '2º-4º', desc: 'Historias para escuchar y leer.', to: '/legacy?topic=stories', kind: 'legacy', group: 'lengua' },
      { id: 'grande-aventure-mots', title: 'La grande aventure des mots', level: '2º-4º', desc: 'Aventura narrativa interactiva.', to: '/grande-aventure-mots', kind: 'legacy', group: 'lengua' },
      { id: 'ecriture-cursive', title: 'Écriture cursive', level: '2º-4º', desc: 'Traza letras y palabras en cursiva.', to: '/legacy?topic=ecriture-cursive', kind: 'legacy', group: 'lengua' },
      { id: 'grammaire-magique', title: 'Grammaire magique', level: '3º-4º', desc: 'Gramática en situaciones cotidianas.', to: '/legacy?topic=grammaire-magique', kind: 'legacy', group: 'lengua' },
      { id: 'conjugaison-magique', title: 'Conjugaison magique', level: '3º-4º', desc: 'Conjugación con apoyo visual.', to: '/legacy?topic=conjugaison-magique', kind: 'legacy', group: 'lengua' },
      { id: 'genres-accords', title: 'Genres & accords', level: '3º-4º', desc: 'Género y concordancia en frases.', to: '/legacy?topic=genres-accords', kind: 'legacy', group: 'lengua' },
      { id: 'lecture-voix-haute', title: 'Lecture à voix haute', level: '3º-4º', desc: 'Lectura en voz alta con guía.', to: '/legacy?topic=lecture-voix-haute', kind: 'legacy', group: 'lengua' },
      { id: 'vocabulaire-thematique', title: 'Vocabulaire thématique', level: '3º-4º', desc: 'Vocabulario por temas.', to: '/legacy?topic=vocabulaire-thematique', kind: 'legacy', group: 'lengua' },
      { id: 'raisonnement', title: 'Raisonnement', level: '2º-4º', desc: 'Retos de lógica y razonamiento.', to: '/legacy?topic=raisonnement', kind: 'legacy', group: 'logica' },
      { id: 'sorting', title: 'Tri & classement', level: '2º-4º', desc: 'Clasifica y ordena con criterio.', to: '/legacy?topic=sorting', kind: 'legacy', group: 'logica' },
      { id: 'memory', title: 'Mémoire magique', level: '2º-4º', desc: 'Memoria visual con niveles cortos.', to: '/legacy?topic=memory', kind: 'legacy', group: 'logica' },
      { id: 'riddles', title: "Jeu d'énigmes", level: '2º-4º', desc: 'Adivinanzas para pensar en voz alta.', to: '/legacy?topic=riddles', kind: 'legacy', group: 'logica' },
      { id: 'sequences', title: 'Jeu des séquences', level: '2º-4º', desc: 'Secuencias para descubrir patrones.', to: '/legacy?topic=sequences', kind: 'legacy', group: 'logica' },
      { id: 'logigrammes', title: 'Logigrammes', level: '3º-4º', desc: 'Pistas y deducción paso a paso.', to: '/legacy?topic=logigrammes', kind: 'legacy', group: 'logica' },
      { id: 'puzzle-magique', title: 'Puzzle magique', level: '2º-4º', desc: 'Rompecabezas mágicos para resolver.', to: '/legacy?topic=puzzle-magique', kind: 'legacy', group: 'logica' },
      { id: 'labyrinthe-logique', title: 'Labyrinthe logique', level: '3º-4º', desc: 'Resuelve laberintos con lógica.', to: '/legacy?topic=labyrinthe-logique', kind: 'legacy', group: 'logica' },
      { id: 'sudoku-junior', title: 'Sudoku junior', level: '3º-4º', desc: 'Sudoku adaptado para primaria.', to: '/legacy?topic=sudoku-junior', kind: 'legacy', group: 'logica' },
      { id: 'decouvre-nature', title: 'Découvre la nature', level: '2º-4º', desc: 'Explora animales y naturaleza.', to: '/legacy?topic=decouvre-nature', kind: 'legacy', group: 'mundo' },
      { id: 'carte-monde', title: 'Carte du monde', level: '2º-4º', desc: 'Mapa interactivo para descubrir países.', to: '/legacy?topic=carte-monde', kind: 'legacy', group: 'mundo' },
      { id: 'emotions-magiques', title: 'Émotions magiques', level: '2º-4º', desc: 'Reconoce y expresa emociones.', to: '/legacy?topic=emotions-magiques', kind: 'legacy', group: 'bienestar' },
      { id: 'missions-jour', title: 'Missions du jour', level: '2º-4º', desc: 'Retos diarios con recompensas.', to: '/legacy?topic=missions-jour', kind: 'legacy', group: 'bienestar' },
      { id: 'quiz-jour', title: 'Quiz du jour', level: '2º-4º', desc: 'Preguntas cortas para el día.', to: '/legacy?topic=quiz-jour', kind: 'legacy', group: 'bienestar' },
      { id: 'respire-repose', title: 'Respire & repose-toi', level: '2º-4º', desc: 'Pausas de respiración y calma.', to: '/legacy?topic=respire-repose', kind: 'legacy', group: 'bienestar' },
      { id: 'expression-soi', title: 'Expression de soi', level: '2º-4º', desc: 'Expresa ideas y sentimientos.', to: '/legacy?topic=expression-soi', kind: 'legacy', group: 'bienestar' }
    ]
  }
];

const FILTERS = [
  { id: 'todas', label: 'Todos' },
  { id: 'nuevos', label: 'Nuevos' },
  { id: 'clasicos', label: 'Clásicos' },
  { id: 'matematicas', label: 'Matemáticas' },
  { id: 'lengua', label: 'Lengua' },
  { id: 'logica', label: 'Lógica' },
  { id: 'mundo', label: 'Mundo' },
  { id: 'bienestar', label: 'Bienestar' }
];

function matchesFilter(item, filterId) {
  if (filterId === 'todas') return true;
  if (filterId === 'nuevos') return item.kind === 'new';
  if (filterId === 'clasicos') return item.kind === 'legacy';
  return item.group === filterId;
}

function groupLabel(group) {
  if (group === 'matematicas') return 'Matemáticas';
  if (group === 'lengua') return 'Lengua';
  if (group === 'logica') return 'Lógica';
  if (group === 'mundo') return 'Mundo';
  return 'Bienestar';
}

export default function AllGamesPage() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('todas');

  useEffect(() => {
    document.body.classList.add('allgames-body');
    document.documentElement.lang = 'es';
    document.title = 'Todos los juegos - Lena';
    return () => {
      document.body.classList.remove('allgames-body');
    };
  }, []);

  const totalGames = useMemo(() => GAME_SECTIONS.reduce((acc, section) => acc + section.items.length, 0), []);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredSections = useMemo(() => {
    return GAME_SECTIONS.map((section) => {
      const items = section.items.filter((item) => {
        if (!matchesFilter(item, activeFilter)) return false;
        if (!normalizedQuery) return true;
        const target = `${item.title} ${item.desc} ${item.level}`.toLowerCase();
        return target.includes(normalizedQuery);
      });
      return { ...section, items };
    });
  }, [activeFilter, normalizedQuery]);
  const filteredGames = useMemo(() => filteredSections.reduce((acc, section) => acc + section.items.length, 0), [filteredSections]);
  const hasFilters = activeFilter !== 'todas' || normalizedQuery.length > 0;
  const gamesLabel = hasFilters ? 'Resultados' : 'Juegos';
  const gamesValue = hasFilters ? filteredGames : totalGames;

  return (
    <main className="allgames-shell">
      <header className="allgames-hero">
        <div className="allgames-hero__card">
          <span className="allgames-eyebrow">Catálogo completo</span>
          <h1>Todos los juegos</h1>
          <p>
            Selecciona un juego específico o entra por curso. Todo está ordenado para avanzar con seguridad.
          </p>
          <div className="allgames-toolbar" role="search">
            <label className="allgames-search">
              <span className="allgames-search__label">Buscar juego</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ej. fracciones, lectura, sudoku..."
                aria-label="Buscar juego"
              />
            </label>
            <div className="allgames-filters" role="group" aria-label="Filtrar juegos">
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={`filter-pill${activeFilter === filter.id ? ' is-active' : ''}`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          <div className="allgames-actions">
            <Link className="pill-link" to="/juegos">Ver por curso</Link>
            <Link className="pill-link" to="/menu">Volver al menú</Link>
          </div>
        </div>
        <div className="allgames-hero__stats">
          <div className="allgames-stat">
            <span className="allgames-stat__label">{gamesLabel}</span>
            <span className="allgames-stat__value">{gamesValue}</span>
          </div>
          <div className="allgames-stat">
            <span className="allgames-stat__label">Niveles</span>
            <span className="allgames-stat__value">10+</span>
          </div>
          <div className="allgames-stat">
            <span className="allgames-stat__label">Cursos</span>
            <span className="allgames-stat__value">2º a 4º</span>
          </div>
          {hasFilters && (
            <div className="allgames-stat allgames-stat--hint">
              <span className="allgames-stat__label">Mostrando</span>
              <span className="allgames-stat__value">{filteredGames} de {totalGames}</span>
            </div>
          )}
        </div>
      </header>

      <div className="allgames-grid">
        {filteredSections.map((section) => (
          section.items.length ? (
            <section key={section.title} className="allgames-section">
              <div className="allgames-section__header">
                <div>
                  <h2>{section.title}</h2>
                  <p>{section.description}</p>
                </div>
              </div>
              <div className="allgames-cards">
                {section.items.map((item) => (
                  <Link key={item.id} className={`allgames-card allgames-card--${item.kind}`} to={item.to}>
                    <div className="allgames-card__top">
                      <span className="allgames-card__title">{item.title}</span>
                      <span className="allgames-card__badge">{item.level}</span>
                    </div>
                    <div className="allgames-card__meta">
                      <span className={`allgames-card__tag allgames-card__tag--${item.kind}`}>
                        {item.kind === 'new' ? 'Nuevo' : 'Clásico'}
                      </span>
                      <span className="allgames-card__tag allgames-card__tag--group">
                        {groupLabel(item.group)}
                      </span>
                    </div>
                    <p className="allgames-card__desc">{item.desc}</p>
                    <span className="allgames-card__cta">Entrar</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null
        ))}
        {!filteredGames && (
          <div className="allgames-empty" role="status">
            <h3>No encontramos juegos con ese filtro.</h3>
            <p>Prueba otra palabra o vuelve a "Todos" para ver el catálogo completo.</p>
          </div>
        )}
      </div>
    </main>
  );
}
