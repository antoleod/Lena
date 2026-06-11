import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { logoutProfile } from '../../services/storage/profileStore.js';
import { getSessionSnapshot, rememberLastVisitedRoute, subscribeToSessionChanges } from '../../services/session/sessionStore.js';
import CustomizerDrawer from '../../shared/ui/CustomizerDrawer.jsx';
import PetMascot from '../../shared/ui/PetMascot.jsx';
import { playTapSound } from '../../services/sound/soundService.js';
import { computeGlobalLevel, getLevelProgress } from '../../services/learning/levelSystem.js';
import { assetUrl } from '../../shared/assets/assetUrl.js';
import {
  IconNavApprendre, IconNavPratiquer, IconNavExamens,
  IconNavProgres, IconNavCahier, IconNavFun,
} from '../../assets/icons/NavIcons.jsx';
import { getParentalState, verifyPin } from '../../services/storage/parentalStore.js';
import { getTodayStudySeconds, getStudyStats } from '../../services/storage/progressStore.js';
import { addAppTime } from '../../services/storage/gameProgressStore.js';

const PARENTAL_OVERRIDE_KEY = 'lena:parental-override';

const BREAK_LABELS = {
  fr: "C'est l'heure de faire une pause !",
  nl: 'Tijd voor een pauze!',
  en: 'Time for a break!',
  es: '¡Es hora de descansar!',
};

function ParentalLimitOverlay({ locale, onUnlock }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const navigate = useNavigate();
  const label = BREAK_LABELS[locale] || BREAK_LABELS.fr;

  function handleSubmit(e) {
    e.preventDefault();
    if (verifyPin(pin)) {
      sessionStorage.setItem(PARENTAL_OVERRIDE_KEY, '1');
      setUnlocked(true);
    } else {
      setError(true);
      setPin('');
    }
  }

  // After PIN confirmed — show action choices
  if (unlocked) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'linear-gradient(160deg,#5a36a8,#743fb0,#9a4fa6)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 20, padding: 32,
      }}>
        <span style={{ fontSize: '3rem' }}>🔓</span>
        <h2 style={{ color: '#fff', textAlign: 'center', margin: 0, fontSize: '1.4rem' }}>
          {locale === 'nl' ? 'Wat wil je doen?' : locale === 'en' ? 'What would you like to do?' : locale === 'es' ? 'Que quieres hacer?' : 'Que voulez-vous faire ?'}
        </h2>
        <button
          type="button"
          onClick={onUnlock}
          style={{
            padding: '14px 32px', borderRadius: 16, fontSize: '1rem', fontWeight: 700,
            background: 'linear-gradient(135deg,#ff8fc6,#ffcf74)',
            color: '#fff', border: 'none', cursor: 'pointer', width: 260,
          }}
        >
          {locale === 'nl' ? 'Doorgaan met spelen' : locale === 'en' ? 'Continue playing' : locale === 'es' ? 'Continuar jugando' : 'Continuer a jouer'}
        </button>
        <button
          type="button"
          onClick={() => { onUnlock(); navigate('/parental'); }}
          style={{
            padding: '14px 32px', borderRadius: 16, fontSize: '1rem', fontWeight: 700,
            background: 'rgba(255,255,255,.2)',
            color: '#fff', border: '2px solid rgba(255,255,255,.5)', cursor: 'pointer', width: 260,
          }}
        >
          {locale === 'nl' ? 'Ouderlijk dashboard' : locale === 'en' ? 'Parental dashboard' : locale === 'es' ? 'Panel de control' : 'Tableau de bord'}
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'linear-gradient(160deg,#5a36a8,#743fb0,#9a4fa6)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 24, padding: 32,
    }}>
      <span style={{ fontSize: '4rem' }}>⏰</span>
      <h1 style={{ color: '#fff', textAlign: 'center', margin: 0, fontSize: '1.6rem' }}>{label}</h1>
      <p style={{ color: 'rgba(255,255,255,.75)', textAlign: 'center', margin: 0 }}>
        {locale === 'nl' ? 'Vraag aan een volwassene om de PIN in te voeren.'
          : locale === 'en' ? 'Ask a grown-up to enter the PIN to continue.'
          : locale === 'es' ? 'Pide a un adulto que introduzca el PIN para continuar.'
          : "Demande a un adulte d'entrer le code PIN pour continuer."}
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <input
          type="password"
          inputMode="numeric"
          pattern="[0-9]{4}"
          maxLength={4}
          value={pin}
          onChange={(e) => { setPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setError(false); }}
          placeholder="• • • •"
          style={{
            fontSize: '1.5rem', letterSpacing: '0.4em', textAlign: 'center',
            padding: '12px 20px', borderRadius: 16, border: error ? '2px solid #e74c3c' : '2px solid rgba(255,255,255,.5)',
            background: 'rgba(255,255,255,.15)', color: '#fff', width: 160, outline: 'none',
          }}
          autoFocus
        />
        {error && <span style={{ color: '#e74c3c', fontWeight: 700 }}>PIN incorrect</span>}
        <button type="submit" disabled={pin.length !== 4} style={{
          padding: '12px 32px', borderRadius: 16, fontSize: '1rem', fontWeight: 700,
          background: pin.length === 4 ? 'linear-gradient(135deg,#ff8fc6,#ffcf74)' : 'rgba(255,255,255,.2)',
          color: '#fff', border: 'none', cursor: pin.length === 4 ? 'pointer' : 'default',
        }}>
          {locale === 'nl' ? 'Ontgrendelen' : locale === 'en' ? 'Unlock' : locale === 'es' ? 'Desbloquear' : 'Deverrouiller'}
        </button>
      </form>
    </div>
  );
}


export default function AppShell() {
  const { t, locale } = useLocale();
  const [session, setSession] = useState(() => getSessionSnapshot());
  const navigate = useNavigate();
  const location = useLocation();
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [limitBlocked, setLimitBlocked] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const handleLogout = () => setLogoutConfirm(true);
  const confirmLogout = () => {
    setLogoutConfirm(false);
    playTapSound();
    logoutProfile();
    navigate('/onboarding', { replace: true, state: { from: location.pathname } });
  };


  // Dynamic branding: use saved name or fallback to default
  const displayName = session.profile?.name || t('defaultChildName') || 'Kid';
  const displayInitial = displayName.charAt(0).toUpperCase();
  const notificationsEnabled = session.profile?.settings?.notificationsEnabled ?? true;
  const totalDone = session.profile?.totalActivitiesCompleted || 0;
  const globalLevel = computeGlobalLevel(totalDone);
  const levelProgress = getLevelProgress(totalDone);
  const xpPct = Math.round(levelProgress.progress * 100);
  const streakCurrent = session.profile?.streakCurrent || 0;
  const starsCount = getStudyStats().totalCorrect || 0;
  const crystals = session.rewards?.balance || 0;

  const NAV_LABELS = {
    fr: { learn: 'Apprendre', practise: 'Jouer', cahier: 'Cahier', progress: 'Mes Étoiles', settings: 'Reglages', exams: 'Quiz', fun: 'Le Coin' },
    nl: { learn: 'Leren', practise: 'Spelen', cahier: 'Schrift', progress: 'Mijn Sterren', settings: 'Instellingen', exams: 'Quiz', fun: 'Hoekje' },
    en: { learn: 'Learn', practise: 'Play', cahier: 'Notebook', progress: 'My Stars', settings: 'Settings', exams: 'Quiz', fun: 'Fun Corner' },
    es: { learn: 'Aprender', practise: 'Jugar', cahier: 'Cuaderno', progress: 'Mis Estrellas', settings: 'Ajustes', exams: 'Quiz', fun: 'Rincón' },
  };
  const nl = NAV_LABELS[locale] || NAV_LABELS.fr;

  const navItems = useMemo(() => {
    const LEARN_PREFIXES = ['/apprendre', '/map', '/subjects', '/activities', '/lessons', '/stories', '/renforcement'];
    const PRACTISE_PREFIXES = ['/pratiquer', '/jeux', '/tables', '/practice'];
    const EXAM_PREFIXES = ['/exam'];
    const CAHIER_PREFIXES = ['/cahier'];
    const FUN_PREFIXES = ['/fun'];
    function matchPrefix(prefixes, path) {
      return prefixes.some((p) => path === p || path.startsWith(p + '/'));
    }
    return [
      {
        to: '/apprendre',
        label: nl.learn,
        Icon: IconNavApprendre,
        isActive: (path) => matchPrefix(LEARN_PREFIXES, path) || path === '/apprendre',
      },
      {
        to: '/exam/library',
        label: nl.exams,
        Icon: IconNavExamens,
        isActive: (path) => matchPrefix(EXAM_PREFIXES, path),
      },
      {
        to: '/cahier',
        label: nl.cahier,
        Icon: IconNavCahier,
        isActive: (path) => matchPrefix(CAHIER_PREFIXES, path),
      },
      {
        to: '/',
        label: { fr: 'Accueil', nl: 'Thuis', en: 'Home', es: 'Inicio' }[locale] || 'Accueil',
        Icon: null,
        isHome: true,
        isActive: (path) => path === '/',
      },
      {
        to: '/pratiquer',
        label: nl.practise,
        Icon: IconNavPratiquer,
        isActive: (path) => matchPrefix(PRACTISE_PREFIXES, path),
      },
      {
        to: '/history',
        label: nl.progress,
        Icon: IconNavProgres,
        isActive: (path) => path === '/history' || path.startsWith('/history/'),
      },
      {
        to: '/fun',
        label: nl.fun,
        Icon: IconNavFun,
        isActive: (path) => matchPrefix(FUN_PREFIXES, path),
      },
    ];
  }, [locale]); // nl is derived from locale, stable reference not needed

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
    if (session.profile?.settings?.effectsEnabled === false) {
      document.documentElement.dataset.effectsOff = '';
    } else {
      delete document.documentElement.dataset.effectsOff;
    }
  }, [session.profile?.settings?.effectsEnabled]);

  useEffect(() => {
    document.documentElement.dataset.wallpaper = session.rewards.equippedWallpaperId || 'wallpaper-dreamy-sky';
  }, [session.rewards.equippedWallpaperId]);

  useEffect(() => {
    rememberLastVisitedRoute(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  // Global app-time tracking: accumulate time on hide/unmount
  useEffect(() => {
    const sessionStart = Date.now();
    function flush() {
      const secs = Math.round((Date.now() - sessionStart) / 1000);
      addAppTime(secs);
    }
    function handleVisibility() {
      if (document.visibilityState === 'hidden') flush();
    }
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('beforeunload', flush);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('beforeunload', flush);
      flush();
    };
  }, []);

  // Feature 4: daily limit check
  useEffect(() => {
    if (sessionStorage.getItem(PARENTAL_OVERRIDE_KEY) === '1') {
      setLimitBlocked(false);
      return;
    }
    const { dailyLimitMinutes } = getParentalState();
    if (!dailyLimitMinutes) { setLimitBlocked(false); return; }
    const todaySeconds = getTodayStudySeconds();
    setLimitBlocked(todaySeconds >= dailyLimitMinutes * 60);
  }, [location.pathname]);

  return (
    <div className="app-shell app-shell--game">
      <div className="scene-effects" aria-hidden="true">
        <span className="scene-effects__rain"></span>
        <span className="scene-effects__rain scene-effects__rain--b"></span>
        <span className="scene-effects__snow"></span>
        <span className="scene-effects__snow scene-effects__snow--b"></span>
        <span className="scene-effects__rainbow"></span>
        <span className="scene-effects__fireflies"></span>
        <span className="scene-effects__petals"></span>
        <span className="scene-effects__petals scene-effects__petals--b"></span>
        <span className="scene-effects__aurora"></span>
      </div>

      {/* Sidebar nav — visible on tablet/desktop (≥768px) via CSS */}
      <aside className="app-sidebar" aria-label="Navigation principale">
        <button type="button" className="brand-inline app-sidebar__brand app-sidebar__profile" onClick={() => { playTapSound(); navigate('/'); }} data-testid="shell-brand-sidebar">
          <span className="app-sidebar__avatar-wrap">
            <img src={assetUrl('assets/characters/mascot-happy.svg')} alt="" className="app-sidebar__avatar" draggable="false" />
          </span>
          <span className="app-sidebar__profile-info">
            <span className="brand-inline__name app-sidebar__profile-name">{displayName}</span>
            <span className="app-sidebar__profile-level">Niveau {globalLevel}</span>
            <span className="app-sidebar__xpbar" aria-label={`${xpPct}% XP`}>
              <span className="app-sidebar__xpbar-fill" style={{ width: `${xpPct}%` }} />
            </span>
          </span>
        </button>

        <div className="app-sidebar__stats" aria-label="Statistiques">
          <span className="app-sidebar__stat app-sidebar__stat--fire" title="Série">🔥 {streakCurrent}</span>
          <span className="app-sidebar__stat app-sidebar__stat--star" title="Étoiles">⭐ {starsCount}</span>
          <span className="app-sidebar__stat app-sidebar__stat--gem" title="Cristaux">💎 {crystals}</span>
        </div>

        <nav className="sidebar-nav" aria-label="Primary">
          {navItems.filter(item => !item.isHome).map((item) => (
            <NavLink
              key={item.to}
              className={() => `sidebar-link${item.isActive(location.pathname) ? ' is-active' : ''}`}
              to={item.to}
              onClick={playTapSound}
              data-testid={`nav-sidebar-${item.to.replace('/', '') || 'home'}`}
            >
              {item.Icon && <item.Icon size={22} className="sidebar-link__icon" />}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-tools">
          <button type="button" className="wallet-compact sidebar-wallet" onClick={() => { playTapSound(); navigate('/shop'); }} data-testid="shell-wallet-sidebar" title={t('shop')}>
            <img src={assetUrl('assets/icons/icon-gem.svg')} alt="" className="wallet-compact__icon" />
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
            title="Personnaliser mon monde"
          >
            <img src={assetUrl('assets/icons/icon-settings.svg')} alt="" className="icon-link__icon" />
            <span>Personnaliser</span>
          </button>

          <button
            type="button"
            className="icon-link icon-link--logout"
            data-testid="shell-logout-sidebar"
            onClick={handleLogout}
          >
            <img src={assetUrl('assets/icons/icon-close.svg')} alt="" className="icon-link__icon" />
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
          {navItems.filter(item => !item.isHome).map((item) => (
            <NavLink
              key={item.to}
              className={() => `topbar-link${item.isActive(location.pathname) ? ' is-active' : ''}`}
              to={item.to}
              onClick={playTapSound}
              data-testid={`nav-${item.to.replace('/', '') || 'home'}`}
            >
              {item.Icon && <item.Icon size={22} className="topbar-link__icon" />}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="topbar-tools">
          <div className="level-pill" aria-label={`Niveau ${globalLevel}`}>
            <img src={assetUrl('assets/icons/icon-star.svg')} alt="" className="level-pill__icon" />
            <span>Niv. {globalLevel}</span>
          </div>

          <button type="button" className="wallet-compact" onClick={() => { playTapSound(); navigate('/shop'); }} data-testid="shell-wallet" title={t('shop')}>
            <img src={assetUrl('assets/icons/icon-gem.svg')} alt="" className="wallet-compact__icon" />
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
            title="Personnaliser mon monde"
          >
            <img src={assetUrl('assets/icons/icon-settings.svg')} alt="" className="icon-link__icon" />
            <span>Personnaliser</span>
          </button>
        </div>
      </header>

      <CustomizerDrawer isOpen={customizerOpen} onClose={() => setCustomizerOpen(false)} />

      {/* Bottom nav — mobile only (CSS hides on tablet+) */}
      <nav className="app-bottom-nav" aria-label="Navigation principale">
        {navItems.map((item) => (
          item.isHome ? (
            <NavLink
              key={item.to}
              className={() => `app-bottom-nav__item app-bottom-nav__item--home${item.isActive(location.pathname) ? ' is-active' : ''}`}
              to={item.to}
              onClick={playTapSound}
              data-testid="nav-bottom-home"
              aria-label={item.label}
            >
              <span className="app-bottom-nav__icon app-bottom-nav__home-icon" aria-hidden="true">🏠</span>
              <span className="app-bottom-nav__label">{item.label}</span>
            </NavLink>
          ) : (
            <NavLink
              key={item.to}
              className={() => `app-bottom-nav__item${item.isActive(location.pathname) ? ' is-active' : ''}`}
              to={item.to}
              onClick={playTapSound}
              data-testid={`nav-bottom-${item.to.replace('/', '') || 'home'}`}
            >
              <span className="app-bottom-nav__icon" aria-hidden="true"><item.Icon size={28} /></span>
              <span className="app-bottom-nav__label">{item.label}</span>
            </NavLink>
          )
        ))}
      </nav>

      <main className="app-main app-main--game">
        <Outlet />
      </main>

      <PetMascot />

      {limitBlocked && (
        <ParentalLimitOverlay locale={locale} onUnlock={() => setLimitBlocked(false)} />
      )}

      {logoutConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setLogoutConfirm(false)}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '2rem 2.5rem', maxWidth: 320, width: '90%', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,.25)' }} onClick={e => e.stopPropagation()}>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1.5rem' }}>
              {locale === 'nl' ? 'Wil je uitloggen?' : locale === 'en' ? 'Log out?' : locale === 'es' ? '¿Salir de la sesión?' : 'Quitter la session ?'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button type="button" onClick={() => setLogoutConfirm(false)} style={{ padding: '.6rem 1.4rem', borderRadius: 12, border: '2px solid #ddd', background: '#f5f5f5', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>
                {locale === 'nl' ? 'Annuleren' : locale === 'en' ? 'Cancel' : locale === 'es' ? 'Cancelar' : 'Annuler'}
              </button>
              <button type="button" onClick={confirmLogout} style={{ padding: '.6rem 1.4rem', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#ff6b6b,#e03c3c)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
                {locale === 'nl' ? 'Uitloggen' : locale === 'en' ? 'Log out' : locale === 'es' ? 'Salir' : 'Quitter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
