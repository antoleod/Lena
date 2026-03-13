import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfile, getProfile } from '../../services/storage/profileStore.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { useTheme } from '../../shared/theme/ThemeContext.jsx';

const identityOptions = [
  { id: 'boy', labelKey: 'profileBoy', icon: '🚀' },
  { id: 'girl', labelKey: 'profileGirl', icon: '✨' },
  { id: 'child', labelKey: 'profileNeutral', icon: '🌈' }
];

const boyThemes = ['astronaut', 'dinosaurs', 'robots', 'explorers', 'superpowers', 'space', 'vehicles', 'adventure'];
const girlThemes = ['animals', 'magic', 'nature', 'ocean', 'stars', 'fantasy', 'enchanted-forest', 'magic-creatures'];

function buildThemeChips(identity) {
  if (identity === 'boy') return boyThemes;
  if (identity === 'girl') return girlThemes;
  return Array.from(new Set([...boyThemes, ...girlThemes]));
}

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const { locale, setLocale, t, supportedLocales = ['fr', 'nl', 'en', 'es'] } = useLocale();
  const { setThemeId } = useTheme();
  const existing = getProfile();

  const [step, setStep] = useState(1);
  const [identity, setIdentity] = useState(existing.identity || 'child');
  const [name, setName] = useState(existing.name || '');
  const [visualTheme, setVisualTheme] = useState(existing.visualTheme || 'forest');
  const [language, setLanguage] = useState(existing.language || locale || 'fr');

  useEffect(() => {
    if (existing && existing.name) {
      // Soft re-onboarding: keep existing profile but allow quick confirmation
      setName(existing.name);
      setIdentity(existing.identity || 'child');
      setVisualTheme(existing.visualTheme || 'forest');
      setLanguage(existing.language || locale || 'fr');
    }
  }, []);

  function next() {
    setStep((current) => Math.min(4, current + 1));
  }

  function back() {
    setStep((current) => Math.max(1, current - 1));
  }

  function handleComplete() {
    const baseAvatar = identity === 'girl' ? 'avatar-panda' : 'avatar-unicorn';
    const profile = saveProfile({
      name: name.trim() || t('defaultChildName'),
      identity,
      visualTheme,
      language,
      avatarId: existing.avatarId || baseAvatar
    });
    setLocale(profile.language);
    setThemeId(profile.themeId || 'theme-candy');
    navigate('/', { replace: true });
  }

  return (
    <div className="page-stack onboarding-shell">
      <section className="hero-grid">
        <div className="hero-panel hero-panel--primary">
          <span className="eyebrow">{t('onboardingWelcomeTag')}</span>
          <h2>{t('onboardingWelcomeTitle')}</h2>
          <p>{t('onboardingWelcomeText')}</p>
          <div className="hero-badges">
            <span className="pill">{t('onboardingBadgeProfile')}</span>
            <span className="pill">{t('onboardingBadgeAdventure')}</span>
            <span className="pill">{t('onboardingBadgeWorlds')}</span>
          </div>
        </div>
        <div className="hero-panel hero-panel--stats">
          <div className="stat-card">
            <span>{t('onboardingStep')}</span>
            <strong>{step} / 4</strong>
          </div>
        </div>
      </section>

      {step === 1 && (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{t('onboardingStep1Title')}</span>
              <h3>{t('onboardingStep1Subtitle')}</h3>
            </div>
          </div>
          <p className="section-intro">{t('onboardingStep1Text')}</p>
          <div className="choice-grid">
            {identityOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`choice-button${identity === option.id ? ' is-selected' : ''}`}
                onClick={() => setIdentity(option.id)}
              >
                <span aria-hidden="true" style={{ fontSize: '1.8rem' }}>{option.icon}</span>
                <span>{t(option.labelKey)}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{t('onboardingStep2Title')}</span>
              <h3>{t('onboardingStep2Subtitle')}</h3>
            </div>
          </div>
          <p className="section-intro">{t('onboardingStep2Text')}</p>
          <div className="form-field">
            <label htmlFor="child-name">{t('onboardingChildName')}</label>
            <input
              id="child-name"
              type="text"
              maxLength={20}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t('onboardingChildNamePlaceholder')}
            />
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{t('onboardingStep3Title')}</span>
              <h3>{t('onboardingStep3Subtitle')}</h3>
            </div>
          </div>
          <p className="section-intro">{t('onboardingStep3Text')}</p>
          <div className="choice-grid">
            {buildThemeChips(identity).map((themeId) => (
              <button
                key={themeId}
                type="button"
                className={`choice-button${visualTheme === themeId ? ' is-selected' : ''}`}
                onClick={() => setVisualTheme(themeId)}
              >
                <span className="pill">{t('theme')}</span>
                <span>{t(`visualTheme.${themeId}`)}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{t('onboardingStep4Title')}</span>
              <h3>{t('onboardingStep4Subtitle')}</h3>
            </div>
          </div>
          <p className="section-intro">{t('onboardingStep4Text')}</p>
          <div className="form-field">
            <label htmlFor="ui-language">{t('uiLanguage')}</label>
            <select
              id="ui-language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              {supportedLocales.map((code) => (
                <option key={code} value={code}>{code.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </section>
      )}

      <section className="section-block onboarding-footer">
        <div className="onboarding-actions">
          {step > 1 ? (
            <button type="button" className="secondary-action" onClick={back}>
              {t('back')}
            </button>
          ) : <span />}
          {step < 4 ? (
            <button
              type="button"
              className="primary-action"
              onClick={next}
              disabled={step === 2 && !name.trim()}
            >
              {t('continue')}
            </button>
          ) : (
            <button type="button" className="primary-action" onClick={handleComplete}>
              {t('onboardingFinish')}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

