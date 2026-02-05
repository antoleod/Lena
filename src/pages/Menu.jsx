import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PRACTICES } from '../data/practices.js';
import './Menu.css';

// Mock useTranslation to avoid react-i18next dependency which causes build errors
function useTranslation() {
  const [lang, setLang] = useState(
    localStorage.getItem('i18nextLng') || document.documentElement.lang || 'es'
  );

  const t = (key) => {
    if (window.i18n && typeof window.i18n.t === 'function') {
      return window.i18n.t(key);
    }
    const defaults = {
      confirmLogout: '¿Cerrar sesión?',
      navLogout: 'Salir',
      menuPrompt: '¿Qué quieres practicar hoy?',
      languageSelectAria: 'Idioma'
    };
    return defaults[key] || key;
  };

  const i18n = {
    language: lang,
    resolvedLanguage: lang,
    changeLanguage: (newLang) => {
      if (window.i18n && typeof window.i18n.setLanguage === 'function') {
        window.i18n.setLanguage(newLang);
      }
      document.documentElement.lang = newLang;
      setLang(newLang);
      localStorage.setItem('i18nextLng', newLang);
    }
  };

  return { t, i18n };
}

export default function MenuPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.body.classList.add('menu-body');
    document.title = 'Menu - Lena';
    return () => {
      document.body.classList.remove('menu-body');
    };
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('userProfile');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        // ignore error
      }
    }
  }, []);

  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng');
    if (savedLang && i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const featuredPractices = useMemo(() => PRACTICES.slice(0, 4), []);

  const handleLogout = () => {
    if (window.confirm(t('confirmLogout'))) {
      localStorage.removeItem('userProfile');
      navigate('/login');
    }
  };

  const changeLanguage = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  return (
    <div className="menu-shell">
      <header className="menu-hero">
        <div className="menu-hero__intro">
          <span className="menu-eyebrow">{t('menuPrompt')}</span>
          <h1>Menu principal</h1>
          <p>
            Selecciona una ruta de practica o entra directamente a los juegos
            por curso. Todo esta organizado para avanzar sin fricciones.
          </p>
          <div className="menu-actions">
            <Link className="pill-link" to="/practicas">Ir a practicas</Link>
            <Link className="pill-link" to="/juegos">Juegos por curso</Link>
            <Link className="pill-link" to="/juego">Todos los juegos</Link>
          </div>
        </div>

        <div className="menu-hero__panel">
          {user ? (
            <div className="menu-profile">
              <div className="menu-profile__avatar" style={{ background: user.color || '#e2e8f0' }}>
                {user.avatar?.icon || '👩‍🚀'}
              </div>
              <div>
                <strong>{user.name}</strong>
                <span>Estrellas: {user.stars || 0}</span>
              </div>
            </div>
          ) : (
            <div className="menu-profile">
              <div className="menu-profile__avatar">✨</div>
              <div>
                <strong>Invitada</strong>
                <span>Configura tu perfil</span>
              </div>
            </div>
          )}

          <div className="menu-panel__controls">
            <label className="menu-lang">
              <span>{t('languageSelectAria')}</span>
              <select value={i18n.resolvedLanguage} onChange={changeLanguage}>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </label>
            <button className="menu-logout" type="button" onClick={handleLogout}>
              {t('navLogout')}
            </button>
          </div>
        </div>
      </header>

      <section className="menu-featured" aria-label="Practicas destacadas">
        <div className="section-header">
          <div>
            <h2>Practicas destacadas</h2>
            <p>Rutas recomendadas para empezar.</p>
          </div>
        </div>
        <div className="menu-grid">
          {featuredPractices.map((practice) => (
            <Link
              key={practice.id}
              className="menu-card"
              to={`/practicas/${practice.id}`}
              style={{ '--card-accent': practice.accent }}
            >
              <div className="menu-card__top">
                <span className="menu-card__tag">{practice.category}</span>
                <span className="menu-card__meta">{practice.levelRange}</span>
              </div>
              <h3>{practice.title}</h3>
              <p>{practice.description}</p>
              <span className="menu-card__cta">Ver niveles</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="menu-links" aria-label="Accesos directos">
        <div className="menu-link-card">
          <div>
            <h3>Practicas guiadas</h3>
            <p>Planes claros con niveles y tiempos estimados.</p>
          </div>
          <Link to="/practicas">Explorar practicas</Link>
        </div>
        <div className="menu-link-card">
          <div>
            <h3>Juegos por curso</h3>
            <p>Ordenados por nivel escolar para encontrar rapido.</p>
          </div>
          <Link to="/juegos">Abrir catalogo</Link>
        </div>
        <div className="menu-link-card">
          <div>
            <h3>Logros y boutique</h3>
            <p>Revisa tus avances y personaliza la experiencia.</p>
          </div>
          <Link to="/logros">Ver logros</Link>
        </div>
      </section>
    </div>
  );
}
