import { NavLink, Outlet } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getRewardState } from '../../services/storage/rewardStore.js';
import { useEffect, useState } from 'react';

export default function AppShell() {
  const { locale, setLocale, t } = useLocale();
  const [rewardState, setRewardState] = useState(() => getRewardState());
  const unicornIcon = `${import.meta.env.BASE_URL}assets/avatars/licorne.svg`;
  const navItems = [
    { to: '/', label: t('home'), end: true },
    { to: '/subjects/mathematics', label: t('mathematics') },
    { to: '/subjects/french', label: t('french') },
    { to: '/subjects/dutch', label: t('dutch') },
    { to: '/subjects/english', label: t('english') },
    { to: '/subjects/spanish', label: t('spanish') },
    { to: '/subjects/reasoning', label: locale === 'nl' ? 'Redeneren' : 'Raisonnement' },
    { to: '/subjects/stories', label: t('stories') },
    { to: '/shop', label: t('shop') }
  ];

  useEffect(() => {
    function syncRewards() {
      setRewardState(getRewardState());
    }

    window.addEventListener('lena-rewards-change', syncRewards);
    return () => window.removeEventListener('lena-rewards-change', syncRewards);
  }, []);

  return (
    <div className="app-shell">
      <div className="fantasy-bg" aria-hidden="true">
        <span className="fantasy-orb fantasy-orb--a"></span>
        <span className="fantasy-orb fantasy-orb--b"></span>
        <span className="fantasy-orb fantasy-orb--c"></span>
        <span className="fantasy-ribbon fantasy-ribbon--a"></span>
        <span className="fantasy-ribbon fantasy-ribbon--b"></span>
        <span className="fantasy-spark fantasy-spark--a">*</span>
        <span className="fantasy-spark fantasy-spark--b">*</span>
        <span className="fantasy-spark fantasy-spark--c">*</span>
        <span className="fantasy-spark fantasy-spark--d">*</span>
      </div>
      <header className="app-header">
        <div className="brand-block">
          <div className="brand-mark">L</div>
          <div>
            <p className="brand-kicker">{t('learningAdventure')}</p>
            <h1>Lena</h1>
          </div>
        </div>
        <div className="header-controls">
          <div className="wallet-pill">
            <span>{t('crystals')}</span>
            <strong>{rewardState.balance}</strong>
          </div>
          <div className="header-mascot" aria-hidden="true">
            <img src={unicornIcon} alt="" />
          </div>
          <label className="locale-switch">
            <span>{t('uiLanguage')}</span>
            <select value={locale} onChange={(event) => setLocale(event.target.value)}>
              <option value="fr">FR</option>
              <option value="nl">NL</option>
            </select>
          </label>
        </div>
        <nav className="main-nav" aria-label="Navigation principale">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) => `nav-chip${isActive ? ' is-active' : ''}`}
              end={item.end}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <span>{t('footer')}</span>
      </footer>
    </div>
  );
}
