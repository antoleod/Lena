import { useEffect, useMemo, useState } from 'react';
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

function StepCard({ title, subtitle, text, children }) {
  return (
    <section className="section-block onboarding-step-card" key={title}>
      <div className="section-heading">
        <div>
          <span className="eyebrow">{title}</span>
          <h3>{subtitle}</h3>
        </div>
      </div>
      <p className="section-intro">{text}</p>
      {children}
    </section>
  );
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
      setName(existing.name);
      setIdentity(existing.identity || 'child');
      setVisualTheme(existing.visualTheme || 'forest');
      setLanguage(existing.language || locale || 'fr');
    }
  }, []);

  const progressPercent = Math.round((step / 4) * 100);
  const themeChoices = useMemo(() => buildThemeChips(identity), [identity]);

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
      <section className="hero-grid onboarding-hero">
        <div className="hero-panel hero-panel--primary onboarding-hero__main">
          <span className="eyebrow">{t('onboardingWelcomeTag')}</span>
          <h2>{t('onboardingWelcomeTitle')}</h2>
          <p>{t('onboardingWelcomeText')}</p>
          <div className="hero-badges">
            <span className="pill">{t('onboardingBadgeProfile')}</span>
            <span className="pill">{t('onboardingBadgeAdventure')}</span>
            <span className="pill">{t('onboardingBadgeWorlds')}</span>
          </div>
          <div className="onboarding-progress">
            <div className="onboarding-progress__track">
              <span className="onboarding-progress__fill" style={{ width: `${progressPercent}%` }}></span>
            </div>
            <div className="onboarding-progress__steps">
              {[1, 2, 3, 4].map((value) => (
                <span
                  key={value}
                  className={`onboarding-progress__dot${value <= step ? ' is-active' : ''}${value === step ? ' is-current' : ''}`}
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="hero-panel hero-panel--stats onboarding-preview">
          <div className="stat-card">
            <span>{t('onboardingStep')}</span>
            <strong>{step} / 4</strong>
          </div>
          <div className="stat-card">
            <span>{t('uiLanguage')}</span>
            <strong>{language.toUpperCase()}</strong>
          </div>
          <div className="stat-card">
            <span>Profil</span>
            <strong>{name.trim() || t('defaultChildName')}</strong>
          </div>
          <div className="stat-card">
            <span>{t('theme')}</span>
            <strong>{visualTheme}</strong>
          </div>
        </div>
      </section>

      <div className="onboarding-stage">
        {step === 1 && (
          <StepCard
            title={t('onboardingStep1Title')}
            subtitle={t('onboardingStep1Subtitle')}
            text={t('onboardingStep1Text')}
          >
            <div className="choice-grid">
              {identityOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`choice-button choice-button--large${identity === option.id ? ' is-selected' : ''}`}
                  onClick={() => setIdentity(option.id)}
                >
                  <span aria-hidden="true" className="choice-icon">{option.icon}</span>
                  <span>{t(option.labelKey)}</span>
                </button>
              ))}
            </div>
          </StepCard>
        )}

        {step === 2 && (
          <StepCard
            title={t('onboardingStep2Title')}
            subtitle={t('onboardingStep2Subtitle')}
            text={t('onboardingStep2Text')}
          >
            <div className="form-field">
              <label htmlFor="child-name">{t('onboardingChildName')}</label>
              <input
                id="child-name"
                type="text"
                maxLength={20}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={t('onboardingChildNamePlaceholder')}
                autoFocus
              />
            </div>
          </StepCard>
        )}

        {step === 3 && (
          <StepCard
            title={t('onboardingStep3Title')}
            subtitle={t('onboardingStep3Subtitle')}
            text={t('onboardingStep3Text')}
          >
            <div className="choice-grid">
              {themeChoices.map((themeId) => (
                <button
                  key={themeId}
                  type="button"
                  className={`choice-button choice-button--theme${visualTheme === themeId ? ' is-selected' : ''}`}
                  onClick={() => setVisualTheme(themeId)}
                >
                  <span className="pill">{t('theme')}</span>
                  <span>{t(`visualTheme.${themeId}`)}</span>
                </button>
              ))}
            </div>
          </StepCard>
        )}

        {step === 4 && (
          <StepCard
            title={t('onboardingStep4Title')}
            subtitle={t('onboardingStep4Subtitle')}
            text={t('onboardingStep4Text')}
          >
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
          </StepCard>
        )}
      </div>

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
