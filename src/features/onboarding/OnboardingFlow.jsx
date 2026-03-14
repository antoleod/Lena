import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfile, getProfile } from '../../services/storage/profileStore.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { useTheme } from '../../shared/theme/ThemeContext.jsx';
import { resolveFirstPlayableMission } from '../../content/registry/worldRegistry.js';

const localeOptions = [
  { id: 'fr', label: 'Francais', icon: 'FR' },
  { id: 'nl', label: 'Nederlands', icon: 'NL' },
  { id: 'en', label: 'English', icon: 'EN' },
  { id: 'es', label: 'Espanol', icon: 'ES' }
];

const ageOptions = [7, 8, 9, 10];
const themeOptions = [
  { id: 'fantasy', label: 'Fantasy', themeId: 'theme-candy', icon: '🦄' },
  { id: 'ocean', label: 'Ocean', themeId: 'theme-ocean', icon: '🌊' },
  { id: 'adventure', label: 'Adventure', themeId: 'theme-sunset', icon: '🧭' },
  { id: 'space', label: 'Space', themeId: 'theme-ocean', icon: '🚀' }
];

function getStartRoute() {
  const firstMission = resolveFirstPlayableMission();
  return firstMission?.route || '/';
}

function markOnboardingActive(active) {
  try {
    if (active) {
      window.sessionStorage.setItem('lena:onboarding:active', '1');
    } else {
      window.sessionStorage.removeItem('lena:onboarding:active');
    }
    window.dispatchEvent(new Event('lena-onboarding-change'));
  } catch {
    // ignore session storage failures
  }
}

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const { locale, setLocale, t } = useLocale();
  const { setThemeId } = useTheme();
  const [existing] = useState(() => getProfile());
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState(existing.language || locale || 'fr');
  const [name, setName] = useState(existing.name || '');
  const [age, setAge] = useState(existing.name ? existing.age || 8 : null);
  const [visualTheme, setVisualTheme] = useState(existing.visualTheme || 'fantasy');
  const autoAdvanceRef = useRef(null);

  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current) {
        window.clearTimeout(autoAdvanceRef.current);
      }
    };
  }, []);

  const totalSteps = 5;
  const progressPercent = Math.round((step / totalSteps) * 100);
  const startRoute = useMemo(() => getStartRoute(), []);
  const firstMission = useMemo(() => resolveFirstPlayableMission(), []);

  useEffect(() => {
    markOnboardingActive(true);
    return () => {
      markOnboardingActive(false);
    };
  }, []);

  function scheduleAdvance(nextStep) {
    if (autoAdvanceRef.current) {
      window.clearTimeout(autoAdvanceRef.current);
    }

    autoAdvanceRef.current = window.setTimeout(() => {
      setStep(nextStep);
    }, 450);
  }

  function persistDraft(patch) {
    const next = saveProfile({
      language,
      visualTheme,
      age: age || 8,
      name: name.trim() || existing.name || '',
      themeId: (themeOptions.find((option) => option.id === visualTheme) || themeOptions[0]).themeId,
      avatarId: existing.avatarId || 'avatar-unicorn',
      ...patch
    });

    setLocale(next.language);
    setThemeId(next.themeId);
  }

  function handleLanguageSelect(nextLanguage) {
    setLanguage(nextLanguage);
    setLocale(nextLanguage);
    persistDraft({ language: nextLanguage });
    scheduleAdvance(2);
  }

  function handleAgeSelect(nextAge) {
    setAge(nextAge);
    persistDraft({ age: nextAge, name: name.trim() || existing.name || '' });

    if (name.trim()) {
      scheduleAdvance(3);
    }
  }

  function handleThemeSelect(themeId) {
    const selectedTheme = themeOptions.find((option) => option.id === themeId) || themeOptions[0];
    setVisualTheme(selectedTheme.id);
    persistDraft({
      visualTheme: selectedTheme.id,
      themeId: selectedTheme.themeId
    });
    scheduleAdvance(4);
  }

  useEffect(() => {
    if (step !== 2 || !name.trim() || !age) {
      return;
    }

    persistDraft({ name: name.trim(), age });
    scheduleAdvance(3);
  }, [age, name, step]);

  function handleFinalSave() {
    const selectedTheme = themeOptions.find((option) => option.id === visualTheme) || themeOptions[0];
    const profile = saveProfile({
      name: name.trim() || t('defaultChildName'),
      age: age || 8,
      language,
      visualTheme: selectedTheme.id,
      themeId: selectedTheme.themeId,
      avatarId: existing.avatarId || 'avatar-unicorn'
    });

    setLocale(profile.language);
    setThemeId(selectedTheme.themeId);
  }

  function handleStartAdventure() {
    handleFinalSave();
    markOnboardingActive(false);
    navigate(startRoute, { replace: true });
  }

  return (
    <div className="onboarding-flow" data-testid="onboarding-page">
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
            <div className="choice-grid choice-grid--onboarding choice-grid--languages" data-testid="onboarding-step-language">
              {localeOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  data-testid={`onboarding-language-${option.id}`}
                  className={`choice-button choice-button--large${language === option.id ? ' is-selected' : ''}`}
                  onClick={() => handleLanguageSelect(option.id)}
                >
                  <span className="choice-icon">{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="settings-grid" data-testid="onboarding-step-profile">
              <div className="form-field">
                <label htmlFor="child-name">{t('onboardingChildName')}</label>
                <input
                  id="child-name"
                  data-testid="onboarding-name"
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
                      data-testid={`onboarding-age-${value}`}
                      className={`choice-button choice-button--chip${age === value ? ' is-selected' : ''}`}
                      onClick={() => handleAgeSelect(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="choice-grid choice-grid--onboarding choice-grid--themes" data-testid="onboarding-step-theme">
              {themeOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  data-testid={`onboarding-theme-${option.id}`}
                  className={`choice-button choice-button--theme${visualTheme === option.id ? ' is-selected' : ''}`}
                  onClick={() => handleThemeSelect(option.id)}
                >
                  <span className="choice-button__inner">
                    <span className="choice-button__media" aria-hidden="true">{option.icon}</span>
                    <span className="choice-button__text">
                      <strong>{option.label}</strong>
                      <small>{t('theme')}</small>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}

          {step === 4 ? (
            <div className="onboarding-summary" data-testid="onboarding-step-summary">
              <div className="onboarding-summary__hero">
                <div className="choice-button__media" aria-hidden="true">✨</div>
                <div>
                  <strong>Lena te guide pas a pas</strong>
                  <p>Petites missions, cristaux, nouveaux noeuds et progression claire.</p>
                </div>
              </div>
              <div className="onboarding-summary__grid">
                <div className="onboarding-summary__item">
                  <span>1</span>
                  <strong>Tu joues une courte lecon</strong>
                </div>
                <div className="onboarding-summary__item">
                  <span>2</span>
                  <strong>Tu gagnes des cristaux</strong>
                </div>
                <div className="onboarding-summary__item">
                  <span>3</span>
                  <strong>Tu debloques le noeud suivant</strong>
                </div>
                <div className="onboarding-summary__item">
                  <span>4</span>
                  <strong>Le tableau de bord te dit quoi faire ensuite</strong>
                </div>
              </div>
            </div>
          ) : null}

          {step === 5 ? (
            <div className="onboarding-summary" data-testid="onboarding-step-mission">
              <div className="onboarding-summary__hero">
                <div className="choice-button__media" aria-hidden="true">🗺</div>
                <div>
                  <strong>{firstMission?.world?.title || t('startAdventure')}</strong>
                  <p>{firstMission?.mission?.title || 'Premiere mission'}</p>
                </div>
              </div>
              <div className="onboarding-summary__grid">
                <div className="onboarding-summary__item">
                  <span>Lecon</span>
                  <strong>{firstMission?.level?.title || 'Premier exercice'}</strong>
                </div>
                <div className="onboarding-summary__item">
                  <span>Recompense</span>
                  <strong>+10 {t('crystals')}</strong>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <footer className="onboarding-modal__footer">
          {step > 1 ? (
            <button type="button" className="secondary-action" onClick={() => setStep((value) => Math.max(1, value - 1))} data-testid="onboarding-back">
              <span className="button-icon" aria-hidden="true">↩</span>
              <span>{t('back')}</span>
            </button>
          ) : <span />}

          {step === 4 ? (
            <button type="button" className="primary-action" onClick={() => setStep(5)} data-testid="onboarding-finish">
              <span className="button-icon" aria-hidden="true">✨</span>
              <span>{t('onboardingFinish')}</span>
            </button>
          ) : null}

          {step === 5 ? (
            <button type="button" className="primary-action" onClick={handleStartAdventure} data-testid="onboarding-start">
              <span className="button-icon" aria-hidden="true">▶</span>
              <span>{t('startAdventure')}</span>
            </button>
          ) : null}
        </footer>
      </section>
    </div>
  );
}
