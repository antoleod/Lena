import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './Logros.css';

function loadProfile() {
  try {
    const raw = window.localStorage.getItem('mathsLenaUserProfile');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadProgress(userName) {
  if (!userName) return null;
  try {
    const raw = window.localStorage.getItem(`mathsLenaProgress_${userName}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function LogrosPage() {
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    document.body.classList.add('logros-body');
    document.documentElement.lang = 'es';
    document.title = 'Mis logros - Lena';

    const storedProfile = loadProfile();
    setProfile(storedProfile);
    setProgress(loadProgress(storedProfile?.name));

    return () => {
      document.body.classList.remove('logros-body');
    };
  }, []);

  const stars = progress?.userScore?.stars ?? profile?.stars ?? 0;
  const coins = progress?.userScore?.coins ?? profile?.coins ?? 0;
  const levelsCompleted = useMemo(() => {
    const completed = progress?.levelsCompleted || [];
    if (Array.isArray(completed)) return completed.length;
    if (typeof completed === 'object') return Object.keys(completed).length;
    return 0;
  }, [progress]);

  return (
    <main className="logros-shell">
      <header className="logros-hero">
        <div className="logros-hero__card">
          <span className="logros-eyebrow">Progreso personal</span>
          <h1>Mis logros</h1>
          <p>
            Aquí verás tu progreso general y tus recompensas. Seguiremos añadiendo nuevos logros.
          </p>
          <div className="logros-actions">
            <Link className="pill-link" to="/menu">Volver al menú</Link>
            <Link className="pill-link" to="/juegos">Ir a juegos</Link>
          </div>
        </div>
        <div className="logros-hero__stats">
          <div className="logros-stat">
            <span className="logros-stat__label">Estrellas</span>
            <span className="logros-stat__value">{stars}</span>
          </div>
          <div className="logros-stat">
            <span className="logros-stat__label">Monedas</span>
            <span className="logros-stat__value">{coins}</span>
          </div>
          <div className="logros-stat">
            <span className="logros-stat__label">Niveles completados</span>
            <span className="logros-stat__value">{levelsCompleted}</span>
          </div>
        </div>
      </header>

      <section className="logros-list">
        <h2>Logros destacados</h2>
        <div className="logros-cards">
          <article className="logros-card">
            <h3>Primera aventura</h3>
            <p>Completa tu primer nivel en cualquier juego.</p>
          </article>
          <article className="logros-card">
            <h3>Racha brillante</h3>
            <p>Consigue 5 respuestas correctas seguidas.</p>
          </article>
          <article className="logros-card">
            <h3>Explorador curioso</h3>
            <p>Prueba juegos de al menos 3 categorías.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
