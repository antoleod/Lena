import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ScrollToTop from './ScrollToTop.jsx';
import LoginPage from './pages/Login.jsx';
import MenuPage from './pages/Menu.jsx';
import CategoriesPage from './pages/Categories.jsx';
import GamesCategoryPage from './pages/GamesCategory.jsx';
import AllGamesPage from './pages/AllGames.jsx';
import PracticesPage from './pages/Practices.jsx';
import PracticeDetailPage from './pages/PracticeDetail.jsx';
import LogrosPage from './pages/Logros.jsx';
import BoutiquePage from './pages/Boutique.jsx';
import GamePage from './pages/Game.jsx';
import LegacyGamesPage from './pages/LegacyGames.jsx';
import LegacyAutoPage from './LegacyAutoPage.jsx';
import LegacyPage from './LegacyPage.jsx';
import NotFoundPage from './pages/NotFound.jsx';

const BASE_URL = import.meta.env.BASE_URL;
const SHELL_STYLES = [`${BASE_URL}css/header-footer.css`];
const SHELL_SCRIPTS = [
  `${BASE_URL}js/storage.js`,
  `${BASE_URL}js/i18n.js`,
  `${BASE_URL}js/appShell.js`
];

function useShellAssets() {
  useEffect(() => {
    const addedLinks = [];
    const addedScripts = [];

    SHELL_STYLES.forEach((href) => {
      const exists = Array.from(document.head.querySelectorAll('link[rel="stylesheet"]'))
        .some((link) => link.href.endsWith(href));
      if (exists) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
      addedLinks.push(link);
    });

    SHELL_SCRIPTS.forEach((src) => {
      const exists = Array.from(document.scripts).some((script) => script.src.endsWith(src));
      if (exists) return;
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      document.body.appendChild(script);
      addedScripts.push(script);
    });

    return () => {
      addedLinks.forEach((link) => link.remove());
      addedScripts.forEach((script) => script.remove());
    };
  }, []);
}

export default function App() {
  useShellAssets();
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('clearCache') !== '1') return;

    const cleanUrl = new URL(url.toString());
    cleanUrl.searchParams.delete('clearCache');

    const tasks = [];
    if ('serviceWorker' in navigator) {
      tasks.push(
        navigator.serviceWorker.getRegistrations()
          .then((regs) => Promise.all(regs.map((reg) => reg.unregister())))
          .catch(() => {})
      );
    }
    if ('caches' in window) {
      tasks.push(
        caches.keys()
          .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
          .catch(() => {})
      );
    }
    Promise.all(tasks).finally(() => {
      window.location.replace(cleanUrl.toString());
    });
  }, []);

  return (
    <BrowserRouter basename={BASE_URL}>
      <header data-lena-header></header>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/practicas" element={<PracticesPage />} />
        <Route path="/practicas/:practiceId" element={<PracticeDetailPage />} />
        <Route path="/juegos" element={<CategoriesPage />} />
        <Route path="/juegos/:category" element={<GamesCategoryPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/juego" element={<AllGamesPage />} />
        <Route path="/legacy" element={<LegacyGamesPage />} />
        <Route path="/boutique" element={<BoutiquePage />} />
        <Route path="/logros" element={<LogrosPage />} />
        <Route path="/grande-aventure-mots" element={<LegacyPage legacyPath={`${BASE_URL}legacy/grande-aventure-mots/index.html`} />} />
        <Route path="/grande-aventure-mots/*" element={<LegacyAutoPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <footer data-lena-footer></footer>
    </BrowserRouter>
  );
}
