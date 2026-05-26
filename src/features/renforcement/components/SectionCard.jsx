import { Link } from 'react-router-dom';

export default function SectionCard({ section }) {
  const { id, title, description, icon, activityId } = section || {};
  return (
    <Link
      to={`/renforcement/${id}`}
      className="renforcement-section-card"
      aria-label={`${title} - ${description || 'Commencer'}`}
      data-testid={`reinforcement-section-${id}`}
    >
      <div className="renforcement-section-card__inner">
        <div>
          <strong className="renforcement-section-card__title">
            {icon ? `${icon} ${title}` : title}
          </strong>
          {description && (
            <div className="renforcement-section-card__desc">{description}</div>
          )}
        </div>
        <span className="renforcement-section-card__arrow" aria-hidden="true">→</span>
      </div>
      {activityId ? (
        <small className="renforcement-section-card__badge">
          Pratique avec un atelier
        </small>
      ) : null}
    </Link>
  );
}

