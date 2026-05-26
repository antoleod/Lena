import { Link, useParams } from 'react-router-dom';
import FloatingBackButton from '../../shared/ui/FloatingBackButton.jsx';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getRenforcementSection } from '../../content/renforcement/sections.js';

import { renforcementActivities } from '../../content/renforcement/activities.js';
import SoftFeedback from './components/SoftFeedback.jsx';

export default function RenforcementSectionPage() {
  const { t } = useLocale();
  const params = useParams();
  const resolvedId = params.sectionId || 'formes';
  const section = getRenforcementSection(resolvedId);
  const activityId = section?.activityId;
  const activity = renforcementActivities.find((a) => a.id === activityId) || null;

  if (!section || !activity) {
    return (
      <div className="page-stack page-stack--compact" data-testid="renforcement-section-missing">
        <FloatingBackButton to="/renforcement" label={t('back') || 'Retour'} storageKey="floating-back-renforcement-section-missing" />
        <section className="panel panel--tight">
          <h2>Section introuvable</h2>
          <p style={{ color: 'var(--muted)' }}>On regarde encore ensemble.</p>
          <Link className="primary-action" to="/renforcement" style={{ marginTop: 12 }}>
            <span>Retour</span>
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack page-stack--compact" data-testid={`renforcement-section-${resolvedId}`}>
      <FloatingBackButton to="/renforcement" label={t('back') || 'Retour'} storageKey={`floating-back-renforcement-${resolvedId}`} />

      <GreetingSectionTitle section={section} />

      <section className="panel panel--tight reinforcement-panel">
        <div className="panel__header">
          <div>
            <span className="eyebrow">{section.title}</span>
            <h2 style={{ margin: '6px 0 0' }}>Commence</h2>
          </div>
        </div>
        <p className="panel__copy" style={{ marginBottom: 12, color: 'var(--muted)' }}>
          {activity.instructions || 'Une consigne à la fois. Tu peux réessayer.'}
        </p>

        <Link
          to={`/activities/${activity.id}`}
          className="primary-action"
          data-testid={`renforcement-start-${resolvedId}`}
          style={{ display: 'inline-flex' }}
        >
          <span className="button-icon" aria-hidden="true">▶</span>
          <span>Lancer l'atelier</span>
        </Link>

        <SoftFeedback message="Très bien ! On démarre quand tu veux." />
      </section>
    </div>
  );
}

function GreetingSectionTitle({ section }) {
  return (
    <section className="panel panel--tight">
      <div className="world-detail-hero">
        <span className="eyebrow">Renforcement</span>
        <h2 style={{ margin: 0 }}>{section.title}</h2>
      </div>
      <p className="panel__copy" style={{ marginTop: 6, color: 'var(--muted)' }}>{section.description}</p>
    </section>
  );
}

