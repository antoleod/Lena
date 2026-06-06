import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { logoutProfile } from '../../services/storage/profileStore.js';
import { getSessionSnapshot, rememberLastVisitedRoute, subscribeToSessionChanges } from '../../services/session/sessionStore.js';
import CustomizerDrawer from '../../shared/ui/CustomizerDrawer.jsx';
import { playTapSound } from '../../services/sound/soundService.js';
import { computeGlobalLevel } from '../../services/learning/levelSystem.js';


export default function AppShell() {
  const { t } = useLocale();
  const [session, setSession] = useState(() => getSessionSnapshot());
  const navigate = useNavigate();
  const location = useLocation();
  const [customizerOpen, setCustomizerOpen] = useState(false);


  // Dynamic branding: use saved name or fallback to default
  const displayName = session.profile?.name || t('defaultChildName') || 'Kid';
  const displayInitial = displayName.charAt(0).toUpperCase();
  const notificationsEnabled = session.profile?.settings?.notificationsEnabled ?? true;
  const globalLevel = computeGlobalLevel(session.profile?.totalActivitiesCompleted || 0);

  const navItems = useMemo(() => ([
    { to: '/map',      label: t('startAdventure') || 'Aventure',   icon: 'icon-home' },
    { to: '/subjects', label: t('subjectsLabel')  || 'Matières',   icon: 'icon-book' },
    { to: '/exam',     label: 'Examens',                           icon: 'icon-trophy' },
    { to: '/cahier',   label: 'Mon cahier',                        icon: 'icon-book' },
    { to: '/history',  label: t('historyTitle')   || 'Historique', icon: 'icon-star' },
    { to: '/settings', label: t('settingsLabel')  || 'Réglages',   icon: 'icon-settings' },
  ]), [t]);

  useEffect(() => {
    function handleLogout() {
      navigate('/onboarding');
    }

    const unsubscribe = subscribeToSessionChanges(setSession);
    window.addEventListener('lena-profile-logout', handleLogout);
    return () => {
      unsubscribe();
      window.removeEventListener('lena-profile-logout', handleLogout);
    };
  }, [navigate]);

  useEffect(() => {
    document.documentElement.dataset.effect = session.rewards.equippedEffectId || 'effect-rainbow';
  }, [session.rewards.equippedEffectId]);

  useEffect(() => {
    document.documentElement.dataset.wallpaper = session.rewards.equippedWallpaperId || 'wallpaper-dreamy-sky';
  }, [session.rewards.equippedWallpaperId]);

  useEffect(() => {
    rememberLastVisitedRoute(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  return (
    <div className="app-shell app-shell--game">
      <div className="scene-effects" aria-hidden="true">
        <span className="scene-effects__rain"></span>
        <span className="scene-effects__rain scene-effects__rain--b"></span>
        <span className="scene-effects__snow"></span>
        <span className="scene-effects__snow scene-effects__snow--b"></span>
        <span className="scene-effects__rainbow"></span>
      </div>

      {/* Sidebar nav — visible on tablet/desktop (≥768px) via CSS */}
      <aside className="app-sidebar" aria-label="Navigation principale">
        <button type="button" className="brand-inline app-sidebar__brand" onClick={() => { playTapSound(); navigate('/'); }} data-testid="shell-brand-sidebar">
          <span className="brand-inline__mark">{displayInitial}</span>
          <span className="brand-inline__name">{displayName}</span>
        </button>

        <nav className="sidebar-nav" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) => `sidebar-link${isActive ? ' is-active' : ''}`}
              to={item.to}
              onClick={playTapSound}
              data-testid={`nav-sidebar-${item.to.replace('/', '') || 'home'}`}
            >
              <img src={`/assets/icons/${item.icon}.svg`} alt="" className="sidebar-link__icon" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-tools">
          <div className="level-pill" aria-label={`Niveau ${globalLevel}`}>
            <img src="/assets/icons/icon-star.svg" alt="" className="level-pill__icon" />
            <span>Niv. {globalLevel}</span>
          </div>

          <button type="button" className="wallet-compact sidebar-wallet" onClick={() => { playTapSound(); navigate('/shop'); }} data-testid="shell-wallet-sidebar" title={t('shop')}>
            <img src="/assets/icons/icon-gem.svg" alt="" className="wallet-compact__icon" />
            <span>{session.rewards.balance}</span>
            <small>{t('crystals')}</small>
            {session.rewards.balance > 50 && (
              <span className={`notification-badge ${notificationsEnabled ? '' : 'no-blink'}`} />
            )}
          </button>

          <button
            type="button"
            className="icon-link icon-link--customizer"
            onClick={() => { playTapSound(); setCustomizerOpen(true); }}
            title="Personalizar mundo"
          >
            <img src="/assets/icons/icon-settings.svg" alt="" className="icon-link__icon" />
            <span>Personalizar</span>
          </button>

          <button
            type="button"
            className="icon-link icon-link--logout"
            data-testid="shell-logout-sidebar"
            onClick={() => {
              playTapSound();
              logoutProfile();
              navigate('/onboarding', { replace: true, state: { from: location.pathname } });
            }}
          >
            <img src="/assets/icons/icon-close.svg" alt="" className="icon-link__icon" />
            <span>{t('logoutLabel') || 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Topbar — visible on mobile (<768px) via CSS */}
      <header className="app-topbar" data-testid="app-shell">
        <button type="button" className="brand-inline" onClick={() => { playTapSound(); navigate('/'); }} data-testid="shell-brand">
          <span className="brand-inline__mark">{displayInitial}</span>
          <span className="brand-inline__name">{displayName}</span>
        </button>

        <nav className="topbar-nav" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) => `topbar-link${isActive ? ' is-active' : ''}`}
              to={item.to}
              onClick={playTapSound}
              data-testid={`nav-${item.to.replace('/', '') || 'home'}`}
            >
              <img src={`/assets/icons/${item.icon}.svg`} alt={item.label} className="topbar-link__icon" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="topbar-tools">
          <div className="level-pill" aria-label={`Niveau ${globalLevel}`}>
            <img src="/assets/icons/icon-star.svg" alt="" className="level-pill__icon" />
            <span>Niv. {globalLevel}</span>
          </div>

          <button type="button" className="wallet-compact" onClick={() => { playTapSound(); navigate('/shop'); }} data-testid="shell-wallet" title={t('shop')}>
            <img src="/assets/icons/icon-gem.svg" alt="" className="wallet-compact__icon" />
            <span>{session.rewards.balance}</span>
            <small>{t('crystals')}</small>
            {session.rewards.balance > 50 && (
              <span className={`notification-badge ${notificationsEnabled ? '' : 'no-blink'}`} />
            )}
          </button>
          <button
            type="button"
            className="icon-link icon-link--customizer"
            onClick={() => { playTapSound(); setCustomizerOpen(true); }}
            title="Personalizar mundo"
          >
            <img src="/assets/icons/icon-settings.svg" alt="" className="icon-link__icon" />
            <span>Personalizar</span>
          </button>

          <button
            type="button"
            className="icon-link icon-link--logout"
            data-testid="shell-logout"
            onClick={() => {
              playTapSound();
              logoutProfile();
              navigate('/onboarding', { replace: true, state: { from: location.pathname } });
            }}
          >
            <img src="/assets/icons/icon-close.svg" alt="" className="icon-link__icon" />
            <span>{t('logoutLabel') || 'Logout'}</span>
          </button>
        </div>
      </header>

      <CustomizerDrawer isOpen={customizerOpen} onClose={() => setCustomizerOpen(false)} />

      <main className="app-main app-main--game">
        <Outlet />
      </main>
    </div>
  );
}
