(function () {
  'use strict';

  const STORAGE_KEY = 'lang';
  const LEGACY_KEY = 'mathsLenaLanguage';
  const DEFAULT_LANGUAGE = 'fr';
  const SUPPORTED_LANGS = ['fr', 'es', 'nl'];
  const LANGUAGE_LABELS = {
    fr: 'FranÃ§ais',
    es: 'EspaÃ±ol',
    nl: 'Nederlands'
  };
  const LANGUAGE_LOCALES = {
    fr: 'fr-FR',
    es: 'es-ES',
    nl: 'nl-NL'
  };

  let strings = {};
  let currentLanguage = null;


  function getBasePath() {
    if (document.baseURI) {
      const url = new URL(document.baseURI);
      return url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
    }
    const path = window.location.pathname;
    const marker = '/legacy/';
    const idx = path.indexOf(marker);
    if (idx >= 0) {
      return path.slice(0, idx + 1);
    }
    const segments = path.split('/').filter(Boolean);
    if (segments.length > 0) {
      return `/${segments[0]}/`;
    }
    return '/';
  }

  function logDebug(...args) {
    if (window.DEBUG) {
      console.log('[i18n]', ...args);
    }
  }

  function readStoredLanguage() {
    try {
      const stored = window.localStorage?.getItem(STORAGE_KEY);
      if (stored) { return stored; }
    } catch (error) {
      console.warn('[i18n] localStorage read failed', error);
    }
    try {
      if (window.storage?.getLanguage) {
        return window.storage.getLanguage();
      }
    } catch (error) {
      console.warn('[i18n] storage.getLanguage failed', error);
    }
    try {
      return window.localStorage?.getItem(LEGACY_KEY);
    } catch (error) {
      console.warn('[i18n] legacy localStorage read failed', error);
      return null;
    }
  }

  function normalizeLanguage(lang) {
    if (!lang || typeof lang !== 'string') {
      return DEFAULT_LANGUAGE;
    }
    const trimmed = lang.trim().toLowerCase();
    return SUPPORTED_LANGS.includes(trimmed) ? trimmed : DEFAULT_LANGUAGE;
  }

  function detectLanguage() {
    const candidate = navigator.language || navigator.userLanguage || '';
    const base = String(candidate).slice(0, 2).toLowerCase();
    return SUPPORTED_LANGS.includes(base) ? base : DEFAULT_LANGUAGE;
  }

  function getLanguage() {
    const stored = readStoredLanguage();
    if (stored) {
      currentLanguage = normalizeLanguage(stored);
      return currentLanguage;
    }
    if (currentLanguage) { return currentLanguage; }
    currentLanguage = detectLanguage();
    return currentLanguage;
  }

  function getSpeechLang() {
    const lang = getLanguage();
    return LANGUAGE_LOCALES[lang] || LANGUAGE_LOCALES[DEFAULT_LANGUAGE];
  }

  function setLanguage(lang) {
    const normalized = normalizeLanguage(lang);
    currentLanguage = normalized;
    try {
      window.localStorage?.setItem(STORAGE_KEY, normalized);
    } catch (error) {
      console.warn('[i18n] localStorage set failed', error);
    }
    try {
      if (window.storage?.setLanguage) {
        window.storage.setLanguage(normalized);
      } else {
        window.localStorage?.setItem(LEGACY_KEY, normalized);
      }
    } catch (error) {
      console.warn('[i18n] Failed to save language', error);
    }
    applyDocumentLang(normalized);
    applyTranslations(document);
    initLanguageControls(document);
    document.dispatchEvent(new CustomEvent('lena:language:change', { detail: { lang: normalized } }));
  }

  function applyParams(text, params) {
    if (!params || typeof params !== 'object') {
      return text;
    }
    return Object.entries(params).reduce((result, [paramKey, value]) => {
      const token = `{{${paramKey}}}`;
      return result.split(token).join(String(value));
    }, text);
  }

  function t(key, params) {
    if (!key) { return ''; }
    const lang = getLanguage();
    const raw = strings?.[lang]?.[key] || strings?.[DEFAULT_LANGUAGE]?.[key] || '';
    return applyParams(raw, params);
  }

  function applyDocumentLang(lang = getLanguage()) {
    document.documentElement.setAttribute('lang', lang);
  }

  function parseAttrSpec(spec, fallbackKey) {
    if (!spec) return [];
    return spec
      .split('|')
      .map(part => part.trim())
      .filter(Boolean)
      .map(entry => {
        const [attr, key] = entry.split(':').map(str => str.trim());
        return { attr, key: key || fallbackKey };
      })
      .filter(item => item.attr && item.key);
  }

  function applyTranslations(root = document) {
    if (!root) { return; }
    root.querySelectorAll('[data-i18n]').forEach(node => {
      const key = node.getAttribute('data-i18n');
      if (!key) { return; }
      node.textContent = t(key);
    });

    root.querySelectorAll('[data-i18n-attr]').forEach(node => {
      const key = node.getAttribute('data-i18n') || node.getAttribute('data-i18n-key') || '';
      const attrs = parseAttrSpec(node.getAttribute('data-i18n-attr'), key);
      attrs.forEach(({ attr, key: attrKey }) => {
        node.setAttribute(attr, t(attrKey));
      });
    });

    root.querySelectorAll('[data-i18n-placeholder]').forEach(node => {
      const key = node.getAttribute('data-i18n-placeholder');
      if (!key) { return; }
      node.setAttribute('placeholder', t(key));
    });
    root.querySelectorAll('[data-i18n-aria]').forEach(node => {
      const key = node.getAttribute('data-i18n-aria');
      if (!key) { return; }
      node.setAttribute('aria-label', t(key));
    });
    root.querySelectorAll('[data-i18n-title]').forEach(node => {
      const key = node.getAttribute('data-i18n-title');
      if (!key) { return; }
      node.setAttribute('title', t(key));
    });
    root.querySelectorAll('[data-i18n-tooltip]').forEach(node => {
      const key = node.getAttribute('data-i18n-tooltip');
      if (!key) { return; }
      node.setAttribute('data-tooltip', t(key));
    });
  }

  function bindLanguageSelect(selectEl) {
    if (!selectEl) { return; }
    selectEl.innerHTML = '';
    Object.entries(LANGUAGE_LABELS).forEach(([code, label]) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = label;
      selectEl.appendChild(option);
    });
    selectEl.value = getLanguage();
    selectEl.addEventListener('change', event => {
      setLanguage(event.target.value);
    });
  }

  function initLanguageControls(root = document) {
    root.querySelectorAll('[data-language-select]').forEach(selectEl => {
      bindLanguageSelect(selectEl);
    });
  }

  async function loadStrings() {
    const langs = SUPPORTED_LANGS;
    const loaded = {};
    await Promise.all(langs.map(async (lang) => {
      try {
        const base = getBasePath();
        const url = new URL(`assets/i18n/${lang}.json`, window.location.origin + base).toString();
        const response = await fetch(url, { cache: 'no-cache' });
        if (!response.ok) { throw new Error(`HTTP ${response.status}`); }
        loaded[lang] = await response.json();
      } catch (error) {
        console.warn('[i18n] Failed to load', lang, error);
        loaded[lang] = {};
      }
    }));
    strings = loaded;
    logDebug('strings loaded', Object.keys(strings));
  }

  async function init() {
    await loadStrings();
    applyDocumentLang();
    applyTranslations(document);
    initLanguageControls(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.i18n = {
    t,
    getLanguage,
    setLanguage,
    getSpeechLang,
    apply: applyTranslations,
    bindLanguageSelect,
    scan: function scanLooseStrings(root = document) {
      const results = [];
      const skipTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE']);
      if (!root || !root.body) {
        return results;
      }
      const walker = document.createTreeWalker(root.body, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node || !node.parentElement) return NodeFilter.FILTER_REJECT;
          const text = node.nodeValue || '';
          if (!text.trim()) return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          if (skipTags.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
          if (parent.closest('[data-i18n], [data-i18n-key], [data-i18n-attr], [data-i18n-aria], [data-i18n-placeholder], [data-i18n-title], [data-i18n-tooltip]')) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      let node;
      while ((node = walker.nextNode())) {
        results.push({
          text: node.nodeValue.trim(),
          element: node.parentElement
        });
      }
      return results;
    }
  };
})();
