import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './shared/theme/app.css';

const container = document.getElementById('root');

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}service-worker.js`).catch(() => {
      // ignore registration failures
    });
  });
} else if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  }).catch(() => {
    // ignore cleanup failures
  });
}

if (container) {
  createRoot(container).render(<App />);
}
