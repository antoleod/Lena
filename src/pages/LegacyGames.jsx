import { useLocation } from 'react-router-dom';
import LegacyPage from '../LegacyPage.jsx';

const BASE_URL = import.meta.env.BASE_URL;

export default function LegacyGamesPage() {
  const { search } = useLocation();
  const legacyPath = `${BASE_URL}legacy/juego-new.html${search || ''}`;
  return <LegacyPage legacyPath={legacyPath} />;
}
