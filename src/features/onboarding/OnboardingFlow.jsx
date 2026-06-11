import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfile, getProfile } from '../../services/storage/profileStore.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { useTheme } from '../../shared/theme/ThemeContext.jsx';
import { assetUrl } from '../../shared/assets/assetUrl.js';
import { gradeOptions, gradeFromAge, defaultCountrySystem } from '../../services/learning/gradeModel.js';

const AGE_CHOICES = [5, 6, 7, 8, 9, 10, 11];

const localeOptions = [
  { id: 'fr', label: 'Français', flag: '🇫🇷' },
  { id: 'nl', label: 'Nederlands', flag: '🇧🇪' },
  { id: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'es', label: 'Español', flag: '🇪🇸' }
];

const themeOptions = [
  { id: 'fantasy',   label: 'Fantasy',  themeId: 'theme-candy',  icon: '🦄', worldArt: 'world-forest', descKey: 'onboardingWorldDesc_fantasy',   accent: '#a855f7' },
  { id: 'ocean',     label: 'Ocean',    themeId: 'theme-ocean',  icon: '🌊', worldArt: 'world-ocean',  descKey: 'onboardingWorldDesc_ocean',      accent: '#06b6d4' },
  { id: 'adventure', label: 'Aventure', themeId: 'theme-sunset', icon: '🧭', worldArt: 'world-sunset', descKey: 'onboardingWorldDesc_adventure',  accent: '#f59e0b' },
  { id: 'space',     label: 'Espace',   themeId: 'theme-galaxy', icon: '🚀', worldArt: 'world-galaxy', descKey: 'onboardingWorldDesc_space',       accent: '#6366f1' },
];

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
  const [age, setAge] = useState(existing.age || null);
  const [schoolGrade, setSchoolGrade] = useState(existing.schoolGrade || null);
  const [visualTheme, setVisualTheme] = useState(existing.visualTheme || 'fantasy');
  const autoAdvanceRef = useRef(null);

  const countrySystem = existing.countrySystem || defaultCountrySystem(language);
  const grades = useMemo(() => gradeOptions(countrySystem), [countrySystem]);

  const detectedLocale = useMemo(() => {
    const lang = navigator.language?.slice(0, 2) || '';
    return ['fr', 'nl', 'en', 'es'].includes(lang) ? lang : null;
  }, []);

  const mascotSrc = useMemo(() => {
    if (step === 4) return assetUrl('assets/characters/mascot-celebrate.svg');
    if ((step === 2 || step === 3) && name.length > 0) return assetUrl('assets/characters/mascot-happy.svg');
    return assetUrl('assets/characters/mascot-focused.svg');
  }, [step, name]);

  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current) {
        window.clearTimeout(autoAdvanceRef.current);
      }
    };
  }, []);

  const totalSteps = 4;
  const progressPercent = Math.round((step / totalSteps) * 100);

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
    }, 200);
  }

  function persistDraft(patch) {
    const next = saveProfile({
      language,
      visualTheme,
      name: name.trim() || existing.name || '',
      themeId: (themeOptions.find((option) => option.id === visualTheme) || themeOptions[0]).themeId,
      avatarId: existing.avatarId || 'avatar-unicorn',
      countrySystem,
      ...(age != null ? { age } : {}),
      ...(schoolGrade ? { schoolGrade } : {}),
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

  function handleThemeSelect(themeId) {
    const selectedTheme = themeOptions.find((option) => option.id === themeId) || themeOptions[0];
    setVisualTheme(selectedTheme.id);
    persistDraft({
      visualTheme: selectedTheme.id,
      themeId: selectedTheme.themeId
    });
  }

  function handleSkipName() {
    persistDraft({ name: t('defaultChildName') });
    setName(t('defaultChildName'));
    scheduleAdvance(3);
  }

  function handleAgeSelect(nextAge) {
    setAge(nextAge);
    // Pre-fill grade from age if the parent hasn't picked one yet.
    const nextGrade = schoolGrade || gradeFromAge(nextAge);
    setSchoolGrade(nextGrade);
    persistDraft({ age: nextAge, schoolGrade: nextGrade });
  }

  function handleGradeSelect(gradeKey) {
    setSchoolGrade(gradeKey);
    persistDraft({ schoolGrade: gradeKey, ...(age != null ? { age } : {}) });
  }

  function handleStartAdventure() {
    const selectedTheme = themeOptions.find((option) => option.id === visualTheme) || themeOptions[0];
    saveProfile({
      name: name.trim() || t('defaultChildName'),
      language,
      countrySystem,
      ...(age != null ? { age } : {}),
      ...(schoolGrade ? { schoolGrade } : {}),
      visualTheme: selectedTheme.id,
      themeId: selectedTheme.themeId,
      avatarId: existing.avatarId || 'avatar-unicorn'
    });

    markOnboardingActive(false);
    // Go to login so the child can set their emoji PIN before entering
    navigate('/login', { replace: true });
  }

  function handleNext() {
    if (step === 2 && name.trim()) {
      persistDraft({ name: name.trim() });
      scheduleAdvance(3);
    } else if (step === 3 && age != null && schoolGrade) {
      persistDraft({ age, schoolGrade });
      scheduleAdvance(4);
    }
  }

  return (
    <div className="onboarding-flow" data-testid="onboarding-page">
      <section className="onboarding-modal onboarding-modal--game">
        {/* Hero band present on all steps */}
        <div className="ob-hero-band">
          <div className="ob-hero-band__copy">
            <span className="eyebrow">{t('onboardingHeroEyebrow')}</span>
            <h1>{t('onboardingHeroTitle')}</h1>
            <p>{t('onboardingHeroSub')}</p>
          </div>
          <img src={mascotSrc} alt="" className="ob-hero-band__mascot" aria-hidden="true" />
        </div>

        {/* Step dots */}
        <div className="ob-dots" aria-label="Progression">
          {[1, 2, 3, 4].map((n) => (
            <span key={n} className={`ob-dot${step > n ? ' is-done' : step === n ? ' is-current' : ''}`} />
          ))}
        </div>

        <section className="onboarding-question-card">
          {step === 1 ? (
            <div className="ob-lang-grid" data-testid="onboarding-step-language">
              {localeOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`ob-lang-card${language === option.id ? ' is-selected' : ''}`}
                  onClick={() => handleLanguageSelect(option.id)}
                  data-testid={`onboarding-language-${option.id}`}
                >
                  <span className="ob-lang-card__flag">{option.flag}</span>
                  <span className="ob-lang-card__label">{option.label}</span>
                </button>
              ))}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="ob-name-wrap" data-testid="onboarding-step-profile">
              <h2 className="ob-step-title">{t('onboardingStep2Question')}</h2>
              <input
                id="child-name"
                className="ob-name-input"
                type="text"
                maxLength={20}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('onboardingChildNamePlaceholder')}
                autoFocus
                data-testid="onboarding-name"
              />
              {name.trim() && <p className="ob-name-greeting">{t('onboardingGreeting').replace('{name}', name.trim())}</p>}
              <button type="button" className="ob-skip-link" onClick={handleSkipName}>
                {t('onboardingSkipName')}
              </button>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="ob-age-wrap" data-testid="onboarding-step-age">
              <h2 className="ob-step-title">{t('onboardingStep3AgeQuestion')}</h2>
              <div className="ob-age-grid">
                {AGE_CHOICES.map((a) => (
                  <button
                    key={a}
                    type="button"
                    className={`ob-age-card${age === a ? ' is-selected' : ''}`}
                    onClick={() => handleAgeSelect(a)}
                    data-testid={`onboarding-age-${a}`}
                  >
                    <span className="ob-age-card__num">{a}</span>
                    <span className="ob-age-card__unit">{t('onboardingYearsOld')}</span>
                  </button>
                ))}
              </div>

              <h2 className="ob-step-title ob-step-title--sub">{t('onboardingStep3GradeQuestion')}</h2>
              <div className="ob-grade-grid">
                {grades.map((g) => (
                  <button
                    key={g.key}
                    type="button"
                    className={`ob-grade-card${schoolGrade === g.key ? ' is-selected' : ''}`}
                    onClick={() => handleGradeSelect(g.key)}
                    data-testid={`onboarding-grade-${g.key}`}
                  >
                    <strong className="ob-grade-card__label">{g.label}</strong>
                    <span className="ob-grade-card__age">~{g.age} {t('onboardingYearsOld')}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="ob-worlds-wrap" data-testid="onboarding-step-theme">
              <h2 className="ob-step-title">
                {name.trim()
                  ? t('onboardingStep3QuestionNamed').replace('{name}', name.trim())
                  : t('onboardingStep3Question')}
              </h2>
              <p className="ob-step-sub">{t('onboardingStep3Sub')}</p>

              <div className="ob-world-grid">
                {themeOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`ob-world-card${visualTheme === option.id ? ' is-selected' : ''}`}
                    onClick={() => handleThemeSelect(option.id)}
                    data-testid={`onboarding-theme-${option.id}`}
                    style={{ '--world-accent': option.accent }}
                  >
                    <div className="ob-world-card__art">
                      <img src={assetUrl(`assets/worlds/${option.worldArt}.svg`)} alt="" />
                    </div>
                    <div className="ob-world-card__body">
                      <span className="ob-world-card__icon">{option.icon}</span>
                      <strong className="ob-world-card__name">{option.label}</strong>
                      <span className="ob-world-card__desc">{t(option.descKey)}</span>
                    </div>
                  </button>
                ))}
              </div>

              {visualTheme && (
                <div className="ob-bubble">
                  {name.trim()
                    ? t('onboardingMascotReady').replace('{name}', name.trim())
                    : t('onboardingLaunchCTA')}
                </div>
              )}
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

          {step === 2 && name.trim() ? (
            <button type="button" className="primary-action" onClick={handleNext} data-testid="onboarding-next">
              <span className="button-icon" aria-hidden="true">▶</span>
              <span>{t('startAdventure')}</span>
            </button>
          ) : null}

          {step === 3 && age != null && schoolGrade ? (
            <button type="button" className="primary-action" onClick={handleNext} data-testid="onboarding-next-age">
              <span className="button-icon" aria-hidden="true">▶</span>
              <span>{t('next')}</span>
            </button>
          ) : null}

          {step === 4 && visualTheme ? (
            <button type="button" className="primary-action" onClick={handleStartAdventure} data-testid="onboarding-start">
              <span className="button-icon" aria-hidden="true">▶</span>
              <span>{t('onboardingLaunchCTA')}</span>
            </button>
          ) : null}
        </footer>
      </section>
    </div>
  );
}
