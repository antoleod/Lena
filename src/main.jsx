import { createRoot } from 'react-dom/client';
import App from './app/App.jsx';
import './shared/theme/app.css';

const container = document.getElementById('root');

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  // vite-plugin-pwa generates /sw.js at build time with full precache manifest
  import('workbox-window').then(({ Workbox }) => {
    const wb = new Workbox(`${import.meta.env.BASE_URL}sw.js`);

    wb.addEventListener('waiting', () => {
      // New version available — ask user to refresh
      const update = window.confirm(
        'Une nouvelle version de Lena est disponible. Recharger maintenant ?'
      );
      if (update) {
        wb.messageSkipWaiting();
        window.location.reload();
      }
    });

    wb.register();
  });
} else if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((r) => r.unregister());
  });
}

if (container) {
  createRoot(container).render(<App />);
}
