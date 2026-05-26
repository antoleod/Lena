import { Link } from 'react-router-dom';

export default function SectionCard({ section }) {
  const { id, title, description, icon, activityId } = section || {};
  return (
    <Link
      to={`/renforcement/${id}`}
      className="reinforcement-section-card"
      style={{
        display: 'block',
        textDecoration: 'none',
        padding: 16,
        minHeight: 72,
        borderRadius: 18,
        border: '1px solid var(--border)',
        background: 'var(--panel)',
        marginBottom: 12
      }}
      aria-label={`${title} - ${description || 'Commencer'}`}
      data-testid={`reinforcement-section-${id}`}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
        <div>
          <strong style={{ fontSize: '1.1rem' }}>{icon ? `${icon} ${title}` : title}</strong>
          <div style={{ marginTop: 6, color: 'var(--muted)' }}>{description}</div>
        </div>
        <span aria-hidden="true" style={{ fontSize: '1.5rem' }}>→</span>
      </div>
      {activityId ? (
        <small style={{ display: 'block', marginTop: 8, color: 'var(--muted)' }}>
          Pratique avec un atelier
        </small>
      ) : null}
    </Link>
  );
}

