(() => {
  'use strict';

  const results = [];
  const log = (name, ok, details = '') => {
    results.push({ name, ok, details });
    const status = ok ? '✅' : '❌';
    console.log(`${status} ${name}${details ? ` — ${details}` : ''}`);
  };

  function run() {
    try {
      log('i18n loaded', Boolean(window.i18n?.t));
      const lang = window.i18n?.getLanguage ? window.i18n.getLanguage() : null;
      log('i18n language valid', ['fr', 'nl', 'en', 'es'].includes(lang || ''));
    } catch (error) {
      log('i18n loaded', false, error.message);
    }

    try {
      const key = 'lena:smoke:test';
      localStorage.setItem(key, 'ok');
      const stored = localStorage.getItem(key);
      localStorage.removeItem(key);
      log('localStorage works', stored === 'ok');
    } catch (error) {
      log('localStorage works', false, error.message);
    }

    try {
      const machine = window.LenaStateMachine?.createStateMachine
        ? window.LenaStateMachine.createStateMachine()
        : null;
      if (!machine) {
        log('state machine available', false, 'Missing LenaStateMachine');
      } else {
        const can = machine.canTransition('PLAYING');
        machine.setState('PLAYING');
        const ok = machine.getState() === 'PLAYING' && can;
        log('state machine transitions', ok);
      }
    } catch (error) {
      log('state machine transitions', false, error.message);
    }

    try {
      const required = ['loadAppData', 'saveAppData', 'resetAppData'];
      const ok = required.every((fn) => typeof window[fn] === 'function');
      log('app data functions exist', ok, ok ? '' : 'Missing one or more functions');
    } catch (error) {
      log('app data functions exist', false, error.message);
    }

    const summary = results.reduce(
      (acc, item) => {
        item.ok ? acc.pass += 1 : acc.fail += 1;
        return acc;
      },
      { pass: 0, fail: 0 }
    );
    console.log(`Smoke tests done: ${summary.pass} passed, ${summary.fail} failed.`);
    return { results, summary };
  }

  window.smokeTests = { run };
})();

