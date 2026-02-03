import { useEffect } from 'react';

export default function LegacyIframePage({ legacyPath, title }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  return (
    <div style={{ width: '100%', height: '100vh', border: 'none' }}>
      <iframe
        src={legacyPath}
        title={title || 'Legacy'}
        style={{ width: '100%', height: '100%', border: 'none' }}
        allow="autoplay"
      />
    </div>
  );
}
