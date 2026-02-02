import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LegacyAutoPage from './LegacyAutoPage.jsx';
import LegacyPage from './LegacyPage.jsx';
import ScrollToTop from './ScrollToTop.jsx';
import LoginPage from './pages/Login.jsx';
import MenuPage from './pages/Menu.jsx';
import CategoriesPage from './pages/Categories.jsx';
import GamesCategoryPage from './pages/GamesCategory.jsx';

const BASE_URL = import.meta.env.BASE_URL;

export default function App() {
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
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/juegos" element={<CategoriesPage />} />
        <Route path="/juegos/:category" element={<GamesCategoryPage />} />
        <Route path="/game" element={<LegacyPage legacyPath={`${BASE_URL}legacy/game.html`} />} />
        <Route path="/juego" element={<LegacyPage legacyPath={`${BASE_URL}legacy/juego.html`} />} />
        <Route path="/boutique" element={<LegacyPage legacyPath={`${BASE_URL}legacy/boutique.html`} />} />
        <Route path="/logros" element={<LegacyPage legacyPath={`${BASE_URL}legacy/logros.html`} />} />
        <Route path="/les-sorcieres" element={<LegacyPage legacyPath={`${BASE_URL}legacy/les-sorcieres.html`} />} />
        <Route path="/les-sorcieres-associe" element={<LegacyPage legacyPath={`${BASE_URL}legacy/les-sorcieres-associe.html`} />} />
        <Route path="/grande-aventure-mots" element={<LegacyPage legacyPath={`${BASE_URL}legacy/grande-aventure-mots/index.html`} />} />
        <Route path="/grande-aventure-mots/*" element={<LegacyAutoPage />} />
        <Route path="*" element={<LegacyAutoPage />} />
      </Routes>
    </BrowserRouter>
  );
}
