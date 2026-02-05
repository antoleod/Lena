import { useEffect, useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { PRACTICE_BY_ID } from '../data/practices.js';
import './PracticeDetail.css';

const LEVELS = Array.from({ length: 10 }, (_, index) => index + 1);

export default function PracticeDetailPage() {
  const { practiceId } = useParams();
  const practice = useMemo(() => PRACTICE_BY_ID[practiceId], [practiceId]);

  useEffect(() => {
    if (!practice) return;
    document.body.classList.add('practice-detail-body');
    document.documentElement.lang = 'es';
    document.title = `${practice.title} - Practicas Lena`;
    return () => {
      document.body.classList.remove('practice-detail-body');
    };
  }, [practice]);

  if (!practice) {
    return <Navigate to="/practicas" replace />;
  }

  return (
    <main className="practice-detail">
      <header className="practice-detail__hero" style={{ '--accent': practice.accent }}>
        <div className="practice-detail__info">
          <Link className="practice-detail__back" to="/practicas">Volver a practicas</Link>
          <span className="practice-detail__category">{practice.category}</span>
          <h1>{practice.title}</h1>
          <p>{practice.description}</p>
          <div className="practice-detail__meta">
            <div>
              <span>Niveles</span>
              <strong>{practice.levelRange}</strong>
            </div>
            <div>
              <span>Tiempo</span>
              <strong>{practice.duration}</strong>
            </div>
          </div>
          <div className="practice-detail__actions">
            <Link className="cta-primary" to={`/game?game=${practice.id}&level=1`}>
              Empezar en nivel 1
            </Link>
            <Link className="cta-secondary" to="/menu">
              Volver al menu
            </Link>
          </div>
        </div>
        <div className="practice-detail__panel">
          <h3>Objetivos</h3>
          <div className="practice-detail__focus">
            {practice.focus.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="practice-detail__note">
            Progreso automatico y recomendaciones por nivel.
          </div>
        </div>
      </header>

      <section className="practice-levels" aria-label="Niveles">
        <div className="section-header">
          <div>
            <h2>Selecciona un nivel</h2>
            <p>Empieza por el nivel recomendado o salta al que necesites.</p>
          </div>
        </div>
        <div className="practice-levels__grid">
          {LEVELS.map((level) => (
            <Link
              key={level}
              className={`practice-level${level <= 3 ? ' is-recommended' : ''}`}
              to={`/game?game=${practice.id}&level=${level}`}
            >
              <div className="practice-level__badge">Nivel {level}</div>
              <div className="practice-level__text">
                {level <= 3 ? 'Recomendado' : 'Entrenamiento'}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
