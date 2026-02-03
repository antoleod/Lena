import { useEffect, useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import LegacyPage from '../LegacyPage.jsx';

const BASE_URL = import.meta.env.BASE_URL;

const CATEGORY_CONFIG = {
  segundo: {
    title: '2º de primaria',
    subtitle: 'Todas las materias para 2º de primaria.',
    legacyPath: `${BASE_URL}legacy/juego-2do.html?cat=segundo`
  },
  tercero: {
    title: '3º de primaria',
    subtitle: 'Retos avanzados para 3º de primaria.',
    legacyPath: `${BASE_URL}legacy/juego-3ro.html?cat=tercero`
  },
};

export default function GamesCategoryPage() {
  const { category } = useParams();
  const config = useMemo(() => CATEGORY_CONFIG[category], [category]);

  useEffect(() => {
    if (!config) return;
    document.title = `${config.title} - Juegos Lena`;
  }, [config]);

  if (!config) {
    return <Navigate to="/juegos" replace />;
  }

  return <LegacyPage legacyPath={config.legacyPath} />;
}

