import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'Nunito, sans-serif' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Página no encontrada</h1>
      <p style={{ marginBottom: '1rem' }}>
        La ruta solicitada no existe o fue eliminada durante la migración.
      </p>
      <Link to="/menu">Volver al menú</Link>
    </main>
  );
}
