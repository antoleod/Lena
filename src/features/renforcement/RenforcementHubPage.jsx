import { Link } from 'react-router-dom';
import FloatingBackButton from '../../shared/ui/FloatingBackButton.jsx';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { renforcementSections } from '../../content/renforcement/sections.js';
import GreetingHeader from './components/GreetingHeader.jsx';
import SectionCard from './components/SectionCard.jsx';

export default function RenforcementHubPage() {
  const { t } = useLocale();

  return (
    <div className="page-stack page-stack--compact" data-testid="renforcement-hub">
      <FloatingBackButton to="/" label={t('backHome') || 'Retour'} storageKey="floating-back-renforcement-hub" />
      <div style={{ paddingBottom: 18 }}>
        <GreetingHeader />
        <section className="panel panel--tight" style={{ marginBottom: 12 }}>
          <div className="panel__header">
            <div>
              <span className="eyebrow">Aujourd’hui</span>
              <h2 style={{ margin: '6px 0 0' }}>On travaille avec douceur</h2>
            </div>
          </div>
          <p style={{ margin: 0, color: 'var(--muted)' }}>Choisis une section et commence une consigne à la fois.</p>
        </section>

        <section aria-label="Sections renforcement">
          {renforcementSections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </section>

        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <Link to="/" className="text-link">Retour à l’accueil</Link>
        </div>
      </div>
    </div>
  );
}

