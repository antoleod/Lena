import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfile, getProfile } from '../../services/storage/profileStore.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { useTheme } from '../../shared/theme/ThemeContext.jsx';

const localeOptions = [
  { id: 'fr', label: 'Francais' },
  { id: 'nl', label: 'Nederlands' },
  { id: 'en', label: 'English' },
  { id: 'es', label: 'Espanol' }
];

const ageOptions = [7, 8, 9, 10];
const themeOptions = [
  { id: 'fantasy', label: 'Fantasy', themeId: 'theme-candy' },
  { id: 'ocean', label: 'Ocean', themeId: 'theme-ocean' },
  { id: 'adventure', label: 'Adventure', themeId: 'theme-sunset' }
];

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const { locale, setLocale, t } = useLocale();
  const { setThemeId } = useTheme();
  const [existing] = useState(() => getProfile());
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState(existing.language || locale || 'fr');
  const [name, setName] = useState(existing.name || '');
  const [age, setAge] = useState(existing.age || 8);
  const [visualTheme, setVisualTheme] = useState(existing.visualTheme || 'fantasy');

  useEffect(() => {
    setLanguage(existing.language || locale || 'fr');
    setName(existing.name || '');
    setAge(existing.age || 8);
    setVisualTheme(existing.visualTheme || 'fantasy');
  }, [existing, locale]);

  const totalSteps = 3;
  const progressPercent = Math.round((step / totalSteps) * 100);

  function handleComplete() {
    const selectedTheme = themeOptions.find((option) => option.id === visualTheme) || themeOptions[0];
    const profile = saveProfile({
      name: name.trim() || t('defaultChildName'),
      age,
      language,
      visualTheme,
      themeId: selectedTheme.themeId,
      avatarId: existing.avatarId || 'avatar-unicorn'
    });

    setLocale(profile.language);
    setThemeId(selectedTheme.themeId);
    navigate('/', { replace: true });
  }

  return (
    <div className="onboarding-flow">
      <section className="onboarding-modal onboarding-modal--game">
        <header className="onboarding-modal__header">
          <span className="eyebrow">{t('onboardingWelcomeTag')}</span>
          <h1>{t('onboardingWelcomeTitle')}</h1>
          <p>{t('onboardingWelcomeText')}</p>
        </header>

        <div className="onboarding-progress onboarding-progress--compact">
          <div className="onboarding-progress__track">
            <span className="onboarding-progress__fill" style={{ width: `${progressPercent}%` }}></span>
          </div>
        </div>

        <section className="onboarding-question-card">
          {step === 1 ? (
            <div className="choice-grid choice-grid--onboarding choice-grid--languages">
              {localeOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`choice-button choice-button--large${language === option.id ? ' is-selected' : ''}`}
                  onClick={() => {
                    setLanguage(option.id);
                    setLocale(option.id);
                  }}
                >
                  <span className="choice-icon">{option.id.toUpperCase()}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="settings-grid">
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
              <div className="form-field">
                <label>{t('onboardingAgeTitle') || 'Age'}</label>
                <div className="choice-grid choice-grid--age">
                  {ageOptions.map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`choice-button choice-button--chip${age === value ? ' is-selected' : ''}`}
                      onClick={() => setAge(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="choice-grid choice-grid--onboarding choice-grid--themes">
              {themeOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`choice-button choice-button--theme${visualTheme === option.id ? ' is-selected' : ''}`}
                  onClick={() => setVisualTheme(option.id)}
                >
                  <span className="pill">{t('theme')}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          ) : null}
        </section>

        <footer className="onboarding-modal__footer">
          {step > 1 ? (
            <button type="button" className="secondary-action" onClick={() => setStep((value) => value - 1)}>
              <span className="button-icon" aria-hidden="true">↩</span>
              <span>{t('back')}</span>
            </button>
          ) : <span />}

          {step < totalSteps ? (
            <button
              type="button"
              className="primary-action"
              onClick={() => setStep((value) => value + 1)}
              disabled={step === 2 && !name.trim()}
            >
              <span className="button-icon" aria-hidden="true">▶</span>
              <span>{t('continue')}</span>
            </button>
          ) : (
            <button type="button" className="primary-action" onClick={handleComplete}>
              <span className="button-icon" aria-hidden="true">✨</span>
              <span>{t('onboardingFinish')}</span>
            </button>
          )}
        </footer>
      </section>
    </div>
  );
}
