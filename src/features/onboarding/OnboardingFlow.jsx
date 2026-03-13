import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfile, getProfile } from '../../services/storage/profileStore.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { useTheme } from '../../shared/theme/ThemeContext.jsx';

const identityOptions = [
  { id: 'boy', labelKey: 'profileBoy', icon: 'Star' },
  { id: 'girl', labelKey: 'profileGirl', icon: 'Moon' },
  { id: 'child', labelKey: 'profileNeutral', icon: 'Sky' }
];

const ageOptions = [7, 8, 9, 10];

const boyThemes = ['astronaut', 'dinosaurs', 'robots', 'explorers', 'superpowers', 'space', 'vehicles', 'adventure'];
const girlThemes = ['animals', 'magic', 'nature', 'ocean', 'stars', 'fantasy', 'enchanted-forest', 'magic-creatures'];

function buildThemeChips(identity) {
  if (identity === 'boy') return boyThemes;
  if (identity === 'girl') return girlThemes;
  return Array.from(new Set([...boyThemes, ...girlThemes]));
}

function getStepMeta(step, t) {
  return [
    { id: 1, title: t('onboardingStep4Subtitle'), text: t('onboardingStep4Text') },
    { id: 2, title: t('onboardingStep1Subtitle'), text: t('onboardingStep1Text') },
    { id: 3, title: t('onboardingStep2Subtitle'), text: t('onboardingStep2Text') },
    { id: 4, title: t('onboardingAgeTitle') || 'Quel age as-tu ?', text: t('onboardingAgeText') || 'Choisis ton age pour adapter les exercices.' },
    { id: 5, title: t('onboardingStep3Subtitle'), text: t('onboardingStep3Text') }
  ].find((item) => item.id === step);
}

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const { locale, setLocale, t, supportedLocales = ['fr', 'nl', 'en', 'es'] } = useLocale();
  const { setThemeId } = useTheme();
  const [existing] = useState(() => getProfile());

  const [step, setStep] = useState(1);
  const [identity, setIdentity] = useState(existing.identity || 'child');
  const [name, setName] = useState(existing.name || '');
  const [age, setAge] = useState(existing.age || 8);
  const [visualTheme, setVisualTheme] = useState(existing.visualTheme || 'fantasy');
  const [language, setLanguage] = useState(existing.language || locale || 'fr');

  useEffect(() => {
    if (!existing) {
      return;
    }
    setName(existing.name || '');
    setIdentity(existing.identity || 'child');
    setAge(existing.age || 8);
    setVisualTheme(existing.visualTheme || 'fantasy');
    setLanguage(existing.language || locale || 'fr');
  }, [existing, locale]);

  const progressPercent = Math.round((step / 5) * 100);
  const themeChoices = useMemo(() => buildThemeChips(identity), [identity]);
  const previewName = name.trim() || t('defaultChildName');
  const previewThemeLabel = t(`visualTheme.${visualTheme}`);
  const previewIdentity = identityOptions.find((option) => option.id === identity) || identityOptions[2];
  const previewIdentityLabel = t(previewIdentity.labelKey);
  const stepMeta = getStepMeta(step, t);

  function next() {
    setStep((current) => Math.min(5, current + 1));
  }

  function back() {
    setStep((current) => Math.max(1, current - 1));
  }

  function handleComplete() {
    const baseAvatar = identity === 'girl' ? 'avatar-panda' : 'avatar-unicorn';
    const profile = saveProfile({
      name: previewName,
      age,
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
    <div className="onboarding-flow">
      <section className="onboarding-modal onboarding-modal--game">
        <header className="onboarding-modal__header">
          <span className="eyebrow">{t('onboardingWelcomeTag')}</span>
          <h1>{t('onboardingWelcomeTitle')}</h1>
          <p>{t('onboardingWelcomeText')}</p>
        </header>

        <div className="onboarding-progress onboarding-progress--compact" aria-label={`${t('onboardingStep')} ${step} / 5`}>
          <div className="onboarding-progress__track">
            <span className="onboarding-progress__fill" style={{ width: `${progressPercent}%` }}></span>
          </div>
          <div className="onboarding-progress__steps">
            {[1, 2, 3, 4, 5].map((value) => (
              <span
                key={value}
                className={`onboarding-progress__dot${value <= step ? ' is-active' : ''}${value === step ? ' is-current' : ''}`}
              >
                {value}
              </span>
            ))}
          </div>
        </div>

        <div className="onboarding-stage-mini">
          <div className={`onboarding-stage-mini__avatar onboarding-stage-mini__avatar--${identity}`}>
            <span>{previewIdentity.icon}</span>
          </div>
          <div className="onboarding-stage-mini__meta">
            <strong>{previewName}</strong>
            <span>{age} {t('yearsLabel') || 'ans'} · {language.toUpperCase()}</span>
            <small>{previewIdentityLabel} · {previewThemeLabel}</small>
          </div>
        </div>

        <section className="onboarding-question-card" key={step}>
          <div className="onboarding-question-card__top">
            <span className="eyebrow">{t('onboardingStep')} {step}</span>
            <h2>{stepMeta.title}</h2>
            <p>{stepMeta.text}</p>
          </div>

          {step === 1 ? (
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
          ) : null}

          {step === 2 ? (
            <div className="choice-grid choice-grid--onboarding">
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
          ) : null}

          {step === 3 ? (
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
          ) : null}

          {step === 4 ? (
            <div className="choice-grid choice-grid--age">
              {ageOptions.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`choice-button choice-button--chip${age === value ? ' is-selected' : ''}`}
                  onClick={() => setAge(value)}
                >
                  {value} {t('yearsLabel') || 'ans'}
                </button>
              ))}
            </div>
          ) : null}

          {step === 5 ? (
            <div className="choice-grid choice-grid--onboarding">
              {themeChoices.slice(0, 6).map((themeId) => (
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
          ) : null}
        </section>

        <footer className="onboarding-modal__footer">
          {step > 1 ? (
            <button type="button" className="secondary-action" onClick={back}>
              {t('back')}
            </button>
          ) : <span />}

          {step < 5 ? (
            <button
              type="button"
              className="primary-action"
              onClick={next}
              disabled={step === 3 && !name.trim()}
            >
              {t('continue')}
            </button>
          ) : (
            <button type="button" className="primary-action" onClick={handleComplete}>
              {t('onboardingFinish')}
            </button>
          )}
        </footer>
      </section>
    </div>
  );
}
