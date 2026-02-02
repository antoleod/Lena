(() => {
  'use strict';

  const STATES = Object.freeze({
    IDLE: 'IDLE',
    PLAYING: 'PLAYING',
    ANSWER_SELECTED: 'ANSWER_SELECTED',
    VALIDATED: 'VALIDATED',
    NEXT_READY: 'NEXT_READY'
  });

  const DEFAULT_TRANSITIONS = Object.freeze({
    IDLE: ['PLAYING'],
    PLAYING: ['ANSWER_SELECTED', 'VALIDATED'],
    ANSWER_SELECTED: ['VALIDATED'],
    VALIDATED: ['NEXT_READY', 'PLAYING'],
    NEXT_READY: ['PLAYING', 'IDLE']
  });

  function createStateMachine({ initial = STATES.IDLE, transitions = DEFAULT_TRANSITIONS, onRender } = {}) {
    let current = initial;
    const listeners = new Set();

    function notify() {
      const snapshot = { state: current };
      listeners.forEach((listener) => listener(snapshot));
      if (typeof onRender === 'function') {
        onRender(snapshot);
      }
    }

    function canTransition(to) {
      const allowed = transitions[current] || [];
      return allowed.includes(to);
    }

    function setState(next) {
      if (!next || next === current) {
        return current;
      }
      if (!canTransition(next)) {
        return current;
      }
      current = next;
      notify();
      return current;
    }

    function getState() {
      return current;
    }

    function subscribe(fn) {
      if (typeof fn === 'function') {
        listeners.add(fn);
      }
      return () => listeners.delete(fn);
    }

    notify();

    return {
      STATES,
      getState,
      setState,
      canTransition,
      subscribe
    };
  }

  function throttleAction(handler, delay = 350) {
    let locked = false;
    return function throttled(...args) {
      if (locked) return;
      locked = true;
      try {
        handler.apply(this, args);
      } finally {
        setTimeout(() => {
          locked = false;
        }, delay);
      }
    };
  }

  window.LenaStateMachine = {
    STATES,
    createStateMachine,
    throttleAction
  };
})();
