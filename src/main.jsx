import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './shared/theme/app.css';

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(<App />);
}
