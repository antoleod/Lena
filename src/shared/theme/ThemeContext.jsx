import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { equipTheme, getRewardState } from '../../services/storage/rewardStore.js';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => getRewardState().equippedThemeId || 'theme-candy');

  useEffect(() => {
    function syncTheme() {
      setThemeId(getRewardState().equippedThemeId || 'theme-candy');
    }

    syncTheme();
    window.addEventListener('lena-rewards-change', syncTheme);
    return () => window.removeEventListener('lena-rewards-change', syncTheme);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = themeId;
  }, [themeId]);

  const value = useMemo(() => ({
    themeId,
    setTheme: (nextThemeId) => equipTheme(nextThemeId)
  }), [themeId]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
