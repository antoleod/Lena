import { useEffect, useMemo, useState } from 'react';
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

const identityOptions = [
  { id: 'boy', labelKey: 'profileBoy', icon: 'Star', avatarId: 'avatar-fox' },
  { id: 'girl', labelKey: 'profileGirl', icon: 'Moon', avatarId: 'avatar-unicorn' },
  { id: 'child', labelKey: 'profileNeutral', icon: 'Sky', avatarId: 'avatar-panda' }
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
    { id: 4, title: t('onboardingAgeTitle') || 'Quel age as tu ?', text: t('onboardingAgeText') || 'Choisis ton age pour adapter les exercices.' },
    { id: 5, title: t('onboardingStep3Subtitle'), text: t('onboardingStep3Text') },
    { id: 6, title: t('onboardingWelcomeTitle'), text: t('continueStep') }
  ].find((item) => item.id === step);
}

function resolveThemeId(visualTheme) {
  if (['ocean', 'nature'].includes(visualTheme)) {
    return 'theme-ocean';
  }
  if (['adventure', 'vehicles', 'dinosaurs', 'explorers'].includes(visualTheme)) {
    return 'theme-sunset';
  }
  return 'theme-candy';
}

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const { locale, setLocale, t } = useLocale();
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
    setIdentity(existing.identity || 'child');
    setName(existing.name || '');
    setAge(existing.age || 8);
    setVisualTheme(existing.visualTheme || 'fantasy');
    setLanguage(existing.language || locale || 'fr');
  }, [existing, locale]);

  const totalSteps = 6;
  const progressPercent = Math.round((step / totalSteps) * 100);
  const themeChoices = useMemo(() => buildThemeChips(identity), [identity]);
  const previewName = name.trim() || t('defaultChildName');
  const previewThemeLabel = t(`visualTheme.${visualTheme}`);
  const previewIdentity = identityOptions.find((option) => option.id === identity) || identityOptions[2];
  const previewIdentityLabel = t(previewIdentity.labelKey);
  const stepMeta = getStepMeta(step, t);

  function goToStep(nextStep) {
    setStep(Math.max(1, Math.min(totalSteps, nextStep)));
  }

  function next() {
    goToStep(step + 1);
  }

  function back() {
    goToStep(step - 1);
  }

  function autoAdvance(callback) {
    callback();
    window.setTimeout(() => {
      setStep((current) => Math.min(totalSteps, current + 1));
    }, 180);
  }

  function handleComplete() {
    const themeId = resolveThemeId(visualTheme);
    const profile = saveProfile({
      name: previewName,
      age,
      identity,
      visualTheme,
      language,
      themeId,
      avatarId: existing.avatarId || previewIdentity.avatarId
    });

    setLocale(profile.language);
    setThemeId(themeId);
    navigate('/', { replace: true });
    window.setTimeout(() => {
      window.location.assign(import.meta.env.BASE_URL || '/');
    }, 40);
  }

  return (
    <div className="onboarding-flow">
      <section className="onboarding-modal onboarding-modal--game">
        <header className="onboarding-modal__header">
          <span className="eyebrow">{t('onboardingWelcomeTag')}</span>
          <h1>{t('onboardingWelcomeTitle')}</h1>
          <p>{t('onboardingWelcomeText')}</p>
        </header>

        <div className="onboarding-progress onboarding-progress--compact" aria-label={`${t('onboardingStep')} ${step} / ${totalSteps}`}>
          <div className="onboarding-progress__track">
            <span className="onboarding-progress__fill" style={{ width: `${progressPercent}%` }}></span>
          </div>
          <div className="onboarding-progress__steps">
            {Array.from({ length: totalSteps }, (_, index) => index + 1).map((value) => (
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
            <div className="choice-grid choice-grid--onboarding choice-grid--languages">
              {localeOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`choice-button choice-button--large${language === option.id ? ' is-selected' : ''}`}
                  onClick={() => autoAdvance(() => {
                    setLanguage(option.id);
                    setLocale(option.id);
                  })}
                >
                  <span className="choice-icon">{option.id.toUpperCase()}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="choice-grid choice-grid--onboarding choice-grid--identity">
              {identityOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`choice-button choice-button--large${identity === option.id ? ' is-selected' : ''}`}
                  onClick={() => autoAdvance(() => setIdentity(option.id))}
                >
                  <span aria-hidden="true" className="choice-icon">{option.icon}</span>
                  <span>{t(option.labelKey)}</span>
                </button>
              ))}
            </div>
          ) : null}

          {step === 3 ? (
            <form
              className="form-field"
              onSubmit={(event) => {
                event.preventDefault();
                if (name.trim()) {
                  next();
                }
              }}
            >
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
              <button type="submit" className="primary-action" disabled={!name.trim()}>
                {t('continue')}
              </button>
            </form>
          ) : null}

          {step === 4 ? (
            <div className="choice-grid choice-grid--age">
              {ageOptions.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`choice-button choice-button--chip${age === value ? ' is-selected' : ''}`}
                  onClick={() => autoAdvance(() => setAge(value))}
                >
                  {value} {t('yearsLabel') || 'ans'}
                </button>
              ))}
            </div>
          ) : null}

          {step === 5 ? (
            <div className="choice-grid choice-grid--onboarding choice-grid--themes">
              {themeChoices.slice(0, 6).map((themeId) => (
                <button
                  key={themeId}
                  type="button"
                  className={`choice-button choice-button--theme${visualTheme === themeId ? ' is-selected' : ''}`}
                  onClick={() => autoAdvance(() => setVisualTheme(themeId))}
                >
                  <span className="pill">{t('theme')}</span>
                  <span>{t(`visualTheme.${themeId}`)}</span>
                </button>
              ))}
            </div>
          ) : null}

          {step === 6 ? (
            <div className="onboarding-summary">
              <div className="onboarding-summary__hero">
                <div className={`onboarding-stage-mini__avatar onboarding-stage-mini__avatar--${identity}`}>
                  <span>{previewIdentity.icon}</span>
                </div>
                <div>
                  <strong>{previewName}</strong>
                  <p>{t('startAdventure')}</p>
                </div>
              </div>

              <div className="onboarding-summary__grid">
                <div className="onboarding-summary__item">
                  <span>{t('uiLanguage')}</span>
                  <strong>{language.toUpperCase()}</strong>
                </div>
                <div className="onboarding-summary__item">
                  <span>{t('onboardingAgeTitle')}</span>
                  <strong>{age} {t('yearsLabel') || 'ans'}</strong>
                </div>
                <div className="onboarding-summary__item">
                  <span>{t('theme')}</span>
                  <strong>{previewThemeLabel}</strong>
                </div>
                <div className="onboarding-summary__item">
                  <span>{t('onboardingStep1Subtitle')}</span>
                  <strong>{previewIdentityLabel}</strong>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <footer className="onboarding-modal__footer">
          {step > 1 ? (
            <button type="button" className="secondary-action" onClick={back}>
              {t('back')}
            </button>
          ) : <span />}

          {step < totalSteps ? (
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
