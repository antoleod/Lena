import { useNavigate } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import CustomizerPanel, { CUSTOMIZER_LABELS } from './CustomizerPanel.jsx';

/**
 * Full page version of the customizer (replaces the old overlay drawer).
 * A real route (/personnaliser) is more stable than a floating div: proper
 * back-button, scroll, and history behaviour.
 */
export default function CustomizerPage() {
  const navigate = useNavigate();
  const { locale } = useLocale();
  const lbl = CUSTOMIZER_LABELS[locale] || CUSTOMIZER_LABELS.fr;

  return (
    <div className="customizer-page">
      <header className="customizer-page__header">
        <button
          type="button"
          className="customizer-page__back"
          onClick={() => navigate(-1)}
          aria-label="Retour"
        >
          ←
        </button>
        <div className="customizer-page__title">
          <span className="eyebrow">LÉNA 🎨</span>
          <h1>{lbl.title}</h1>
        </div>
      </header>

      <CustomizerPanel />

      {/* Parent area access — password, child secret code & parental controls
          live behind the PIN-gated /parental route. */}
      <section className="drawer-section customizer-page__parents">
        <button
          type="button"
          className="primary-action customizer-parents-btn"
          onClick={() => navigate('/parental')}
          data-testid="customizer-parental"
        >
          <span className="button-icon" aria-hidden="true">🔒</span>
          <span className="customizer-parents-btn__text">
            <strong>{lbl.parents}</strong>
            <small>{lbl.parentsHint}</small>
          </span>
        </button>
      </section>
    </div>
  );
}
