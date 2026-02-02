import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LegacyAutoPage from './LegacyAutoPage.jsx';
import LegacyPage from './LegacyPage.jsx';
import ScrollToTop from './ScrollToTop.jsx';
import LoginPage from './pages/Login.jsx';
import MenuPage from './pages/Menu.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/game" element={<LegacyPage legacyPath="/legacy/game.html" />} />
        <Route path="/juego" element={<LegacyPage legacyPath="/legacy/juego.html" />} />
        <Route path="/boutique" element={<LegacyPage legacyPath="/legacy/boutique.html" />} />
        <Route path="/logros" element={<LegacyPage legacyPath="/legacy/logros.html" />} />
        <Route path="/les-sorcieres" element={<LegacyPage legacyPath="/legacy/les-sorcieres.html" />} />
        <Route path="/les-sorcieres-associe" element={<LegacyPage legacyPath="/legacy/les-sorcieres-associe.html" />} />
        <Route path="/grande-aventure-mots" element={<LegacyPage legacyPath="/legacy/grande-aventure-mots/index.html" />} />
        <Route path="/grande-aventure-mots/*" element={<LegacyAutoPage />} />
        <Route path="*" element={<LegacyAutoPage />} />
      </Routes>
    </BrowserRouter>
  );
}
