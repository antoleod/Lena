(() => {
  'use strict';

  const APP_DATA_KEY = 'lena:app:data';
  const DEFAULT_DATA = {
    language: 'fr',
    calmMode: false,
    coins: 0,
    stars: 0,
    progressByLevel: {},
    ownedItems: [],
    history: []
  };

  const t = (key, fallback) => (window.i18n?.t ? window.i18n.t(key) : fallback);

  function readRaw() {
    try {
      const raw = localStorage.getItem(APP_DATA_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn('[appData] Failed to read app data', error);
      return null;
    }
  }

  function writeRaw(data) {
    try {
      localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('[appData] Failed to save app data', error);
    }
  }

  function applyCalmMode(enabled) {
    const active = Boolean(enabled);
    document.documentElement.classList.toggle('calm-mode', active);
    if (document.body) {
      document.body.classList.toggle('calm-mode', active);
    }
    if (window.audioManager?.setMuted) {
      window.audioManager.setMuted(active);
    }
  }

  function loadAppData() {
    const stored = readRaw() || {};
    let profile = null;
    let progress = null;
    try {
      profile = window.storage?.loadUserProfile ? window.storage.loadUserProfile() : null;
    } catch (error) {
      console.warn('[appData] Failed to load profile', error);
    }
    try {
      if (profile?.name && window.storage?.loadUserProgress) {
        progress = window.storage.loadUserProgress(profile.name);
      }
    } catch (error) {
      console.warn('[appData] Failed to load progress', error);
    }

    const merged = {
      ...DEFAULT_DATA,
      ...(stored || {})
    };

    if (progress?.userScore) {
      merged.coins = Number.isFinite(Number(progress.userScore.coins)) ? Number(progress.userScore.coins) : merged.coins;
      merged.stars = Number.isFinite(Number(progress.userScore.stars)) ? Number(progress.userScore.stars) : merged.stars;
    }
    if (progress?.answeredQuestions && typeof progress.answeredQuestions === 'object') {
      merged.progressByLevel = { ...progress.answeredQuestions };
    }
    if (Array.isArray(progress?.ownedItems)) {
      merged.ownedItems = progress.ownedItems.slice();
    }
    if (profile?.settings?.language) {
      merged.language = profile.settings.language;
    }
    if (typeof profile?.settings?.calmMode === 'boolean') {
      merged.calmMode = profile.settings.calmMode;
    }

    applyCalmMode(merged.calmMode);
    return merged;
  }

  function saveAppData(nextData = {}) {
    const current = readRaw() || {};
    const merged = {
      ...DEFAULT_DATA,
      ...current,
      ...nextData
    };

    writeRaw(merged);

    if (typeof merged.language === 'string' && window.storage?.setLanguage) {
      window.storage.setLanguage(merged.language);
    }
    if (typeof merged.calmMode === 'boolean') {
      try {
        const profile = window.storage?.loadUserProfile ? window.storage.loadUserProfile() : null;
        if (profile) {
          profile.settings = { ...(profile.settings || {}), calmMode: merged.calmMode };
          window.storage.saveUserProfile(profile);
        }
      } catch (error) {
        console.warn('[appData] Failed to sync calm mode to profile', error);
      }
      applyCalmMode(merged.calmMode);
    }
    if (Number.isFinite(merged.coins) || Number.isFinite(merged.stars)) {
      try {
        const profile = window.storage?.loadUserProfile ? window.storage.loadUserProfile() : null;
        if (profile?.name && window.storage?.loadUserProgress && window.storage?.saveUserProgress) {
          const progress = window.storage.loadUserProgress(profile.name) || {};
          progress.userScore = {
            ...(progress.userScore || {}),
            coins: Number.isFinite(merged.coins) ? merged.coins : progress.userScore?.coins || 0,
            stars: Number.isFinite(merged.stars) ? merged.stars : progress.userScore?.stars || 0
          };
          if (merged.progressByLevel) {
            progress.answeredQuestions = { ...(progress.answeredQuestions || {}), ...merged.progressByLevel };
          }
          if (Array.isArray(merged.ownedItems)) {
            progress.ownedItems = merged.ownedItems.slice();
          }
          window.storage.saveUserProgress(profile.name, progress);
        }
      } catch (error) {
        console.warn('[appData] Failed to sync progress', error);
      }
    }

    return merged;
  }

  function resetAppData() {
    const confirmation = window.prompt(t('parentResetConfirm', 'Es-tu un parent ? Tape "OK" pour confirmer.'));
    if (confirmation !== 'OK') {
      alert(t('parentResetCancel', 'Réinitialisation annulée.'));
      return false;
    }

    try {
      localStorage.removeItem(APP_DATA_KEY);
      localStorage.removeItem('mathsLenaUserProfile');
    } catch (error) {
      console.warn('[appData] Failed to clear data', error);
    }

    applyCalmMode(false);
    alert(t('parentResetSuccess', 'Les données ont été réinitialisées.'));
    return true;
  }

  window.loadAppData = loadAppData;
  window.saveAppData = saveAppData;
  window.resetAppData = resetAppData;
  window.appData = window.appData || {};
  window.appData.applyCalmMode = applyCalmMode;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadAppData();
    });
  } else {
    loadAppData();
  }
})();

