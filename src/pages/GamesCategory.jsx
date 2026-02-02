import { useEffect, useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import LegacyPage from '../LegacyPage.jsx';

const CATEGORY_CONFIG = {
  novedades: {
    title: 'Novedades',
    subtitle: 'Los retos más recientes.',
    legacyPath: '/legacy/juego-new.html?cat=new'
  },
  matematicas: {
    title: 'Matemáticas',
    subtitle: 'Cálculo, series y números mágicos.',
    legacyPath: '/legacy/juego-math.html?cat=math'
  },
  logica: {
    title: 'Lógica y Razonamiento',
    subtitle: 'Secuencias, memoria y estrategia.',
    legacyPath: '/legacy/juego-logic.html?cat=logic'
  },
  lectura: {
    title: 'Lectura y Palabras',
    subtitle: 'Historias, vocabulario y comprensión.',
    legacyPath: '/legacy/juego-words.html?cat=words'
  },
  creativo: {
    title: 'Creativo y Mundo',
    subtitle: 'Arte, puzzles y exploración.',
    legacyPath: '/legacy/juego-creative.html?cat=creative'
  },
  emociones: {
    title: 'Emociones y Bienestar',
    subtitle: 'Respirar, reflexionar y hábitos sanos.',
    legacyPath: '/legacy/juego-emotions.html?cat=emotions'
  }
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
