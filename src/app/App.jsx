import { BrowserRouter } from 'react-router-dom';
import AppProviders from './providers/AppProviders.jsx';
import AppRouter from './routing/AppRouter.jsx';

const baseName = import.meta.env.BASE_URL;

export default function App() {
  return (
    <BrowserRouter basename={baseName}>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </BrowserRouter>
  );
}
