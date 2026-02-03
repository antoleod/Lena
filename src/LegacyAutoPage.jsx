import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LegacyPage from './LegacyPage.jsx';

const BASE_URL = import.meta.env.BASE_URL;

function buildCandidates(pathname) {
  if (!pathname || pathname === '/') {
    return [`${BASE_URL}legacy/login.html`];
  }

  const normalized = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const candidates = [];

  if (normalized.endsWith('.html')) {
    candidates.push(`${BASE_URL}legacy${normalized}`);
    return candidates;
  }

  candidates.push(`${BASE_URL}legacy${normalized}.html`);
  candidates.push(`${BASE_URL}legacy${normalized}/index.html`);
  return candidates;
}

export default function LegacyAutoPage() {
  const location = useLocation();
  const [legacyPath, setLegacyPath] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let active = true;
    setLegacyPath(null);
    setMissing(false);

    async function findLegacy() {
      const candidates = buildCandidates(location.pathname);
      for (const candidate of candidates) {
        try {
          const response = await fetch(candidate, { method: 'GET', cache: 'no-store' });
          if (response.ok) {
            if (!active) return;
            setLegacyPath(candidate);
            return;
          }
        } catch {
          // ignore and try next candidate
        }
      }
      if (active) {
        setMissing(true);
      }
    }

    findLegacy();

    return () => {
      active = false;
    };
  }, [location.pathname]);

  if (missing) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'Nunito, sans-serif' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Page introuvable</h1>
        <p>Impossible de trouver une page legacy pour cette route.</p>
      </div>
    );
  }

  if (!legacyPath) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'Nunito, sans-serif' }}>
        <p>Chargement...</p>
      </div>
    );
  }

  return <LegacyPage legacyPath={legacyPath} />;
}
