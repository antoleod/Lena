import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
      sectionMathTitle: 'Matemáticas',
      itemAdditions: 'Sumas',
      itemSubtractions: 'Restas',
      itemMultiplications: 'Multiplicación',
      itemDivisions: 'División',
      sectionWordsTitle: 'Palabras',
      itemReading: 'Lectura',
      itemDictation: 'Dictado',
      sectionLogicTitle: 'Lógica',
      itemSequences: 'Secuencias',
      itemMemory: 'Memoria',
      sectionCreativeTitle: 'Creatividad',
      itemColors: 'Colores',
      itemTime: 'La Hora',
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
    <div className="game-shell">
      <header className="game-header">
        <div className="game-header__primary">
          <div className="game-header__profile">
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {user.avatar && (
                  <div className="btn-icon" style={{ background: user.color || '#eee', fontSize: '1.5rem' }}>
                    {user.avatar.icon}
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '800', color: '#3b2a75', fontSize: '1.1rem' }}>
                    {user.name}
                  </span>
                  <div className="stat-pill stat-pill--stars" style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem', minHeight: 'auto' }}>
                    <span>⭐</span>
                    <span>{user.stars || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="game-header__actions" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select
              value={i18n.resolvedLanguage}
              onChange={changeLanguage}
              aria-label={t('languageSelectAria')}
              style={{
                padding: '0.5rem 0.8rem',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.1)',
                background: 'rgba(255,255,255,0.9)',
                fontFamily: 'inherit',
                fontWeight: '700',
                color: '#3b2a75',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
              }}
            >
              <option value="fr">Français</option>
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>

            <button
              onClick={handleLogout}
              className="btn btn-danger"
              style={{
                border: 'none',
                borderRadius: '12px',
                padding: '0.5rem 1rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>🚪</span>
              <span>{t('navLogout')}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="game-main">
        <div id="stageBottom">
          <h2 style={{ color: '#3b2a75', marginBottom: '1.5rem', fontSize: '1.8rem' }}>{t('menuPrompt')}</h2>

          <div className="mm-sections">
            {/* Section Math */}
            <div className="mm-section-card" style={{ '--section-color': '#5b4fcf', '--section-color-soft': 'rgba(91, 79, 207, 0.15)' }}>
              <div className="mm-section-header">
                <div className="mm-section-title">
                  <span className="mm-emoji">🧮</span>
                  {t('sectionMathTitle')}
                </div>
              </div>
              <div className="mm-chip-grid">
                <Link to="/juegos/math" className="mm-chip">
                  <span className="mm-emoji">➕</span> {t('itemAdditions')}
                </Link>
                <Link to="/juegos/math" className="mm-chip">
                  <span className="mm-emoji">➖</span> {t('itemSubtractions')}
                </Link>
                <Link to="/juegos/tercero" className="mm-chip">
                  <span className="mm-emoji">✖️</span> {t('itemMultiplications')}
                </Link>
                <Link to="/juegos/tercero" className="mm-chip">
                  <span className="mm-emoji">➗</span> {t('itemDivisions')}
                </Link>
              </div>
            </div>

            {/* Section Words */}
            <div className="mm-section-card" style={{ '--section-color': '#ff5b8f', '--section-color-soft': 'rgba(255, 91, 143, 0.15)' }}>
              <div className="mm-section-header">
                <div className="mm-section-title">
                  <span className="mm-emoji">📚</span>
                  {t('sectionWordsTitle')}
                </div>
              </div>
              <div className="mm-chip-grid">
                <Link to="/juegos/segundo" className="mm-chip">
                  <span className="mm-emoji">📖</span> {t('itemReading')}
                </Link>
                <Link to="/juegos/segundo" className="mm-chip">
                  <span className="mm-emoji">✍️</span> {t('itemDictation')}
                </Link>
              </div>
            </div>

            {/* Section Logic */}
            <div className="mm-section-card" style={{ '--section-color': '#00b894', '--section-color-soft': 'rgba(0, 184, 148, 0.15)' }}>
              <div className="mm-section-header">
                <div className="mm-section-title">
                  <span className="mm-emoji">🧩</span>
                  {t('sectionLogicTitle')}
                </div>
              </div>
              <div className="mm-chip-grid">
                <Link to="/juegos/tercero" className="mm-chip">
                  <span className="mm-emoji">🔢</span> {t('itemSequences')}
                </Link>
                <Link to="/juegos/segundo" className="mm-chip">
                  <span className="mm-emoji">🧠</span> {t('itemMemory')}
                </Link>
              </div>
            </div>

            {/* Section Creative */}
            <div className="mm-section-card" style={{ '--section-color': '#fdcb6e', '--section-color-soft': 'rgba(253, 203, 110, 0.15)' }}>
              <div className="mm-section-header">
                <div className="mm-section-title">
                  <span className="mm-emoji">🎨</span>
                  {t('sectionCreativeTitle')}
                </div>
              </div>
              <div className="mm-chip-grid">
                <Link to="/juegos/segundo" className="mm-chip">
                  <span className="mm-emoji">🌈</span> {t('itemColors')}
                </Link>
                <Link to="/juegos/segundo" className="mm-chip">
                  <span className="mm-emoji">⏰</span> {t('itemTime')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}