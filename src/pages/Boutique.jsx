import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Boutique.css';

const ITEMS = [
  { id: 'wand', title: 'Varita brillante', desc: 'Añade chispas mágicas a tus partidas.', cost: 30 },
  { id: 'badge', title: 'Insignia del bosque', desc: 'Presume tu progreso con un sello especial.', cost: 45 },
  { id: 'theme', title: 'Tema pastel', desc: 'Cambia los colores de tu aventura.', cost: 60 }
];

export default function BoutiquePage() {
  useEffect(() => {
    document.body.classList.add('boutique-body');
    document.documentElement.lang = 'es';
    document.title = 'Boutique - Lena';
    return () => {
      document.body.classList.remove('boutique-body');
    };
  }, []);

  return (
    <main className="boutique-shell">
      <header className="boutique-hero">
        <div className="boutique-hero__card">
          <span className="boutique-eyebrow">Tienda mágica</span>
          <h1>Boutique</h1>
          <p>
            Usa tus monedas para desbloquear detalles y recompensas. Próximamente podrás comprar más elementos.
          </p>
          <div className="boutique-actions">
            <Link className="pill-link" to="/menu">Volver al menú</Link>
            <Link className="pill-link" to="/juegos">Ir a juegos</Link>
          </div>
        </div>
        <div className="boutique-hero__panel">
          <div className="boutique-hero__panel-title">Tu saldo</div>
          <div className="boutique-hero__panel-value">50</div>
          <p className="boutique-hero__panel-note">Monedas disponibles</p>
        </div>
      </header>

      <section className="boutique-grid">
        {ITEMS.map((item) => (
          <article key={item.id} className="boutique-card">
            <div className="boutique-card__top">
              <h2>{item.title}</h2>
              <span className="boutique-card__price">{item.cost} 🪙</span>
            </div>
            <p>{item.desc}</p>
            <button type="button" className="boutique-card__btn">Próximamente</button>
          </article>
        ))}
      </section>
    </main>
  );
}
