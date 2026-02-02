(function () {
  'use strict';

  function showFeedbackToast(message, type, options) {
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast-feedback toast-feedback--${type || 'info'}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', options?.ariaLive || 'polite');

    const icon = document.createElement('span');
    icon.className = 'toast-feedback__icon';
    icon.textContent = options?.icon || getIconForType(type);

    const body = document.createElement('div');
    body.className = 'toast-feedback__content';

    const text = document.createElement('p');
    text.className = 'toast-feedback__message';
    text.textContent = message;
    body.appendChild(text);

    if (Array.isArray(options?.actions) && options.actions.length) {
      const actions = document.createElement('div');
      actions.className = 'toast-feedback__actions';
      options.actions.forEach((action) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'toast-feedback__btn';
        btn.textContent = action.label || 'OK';
        btn.addEventListener('click', () => {
          if (typeof action.onClick === 'function') {
            action.onClick();
          }
          fadeToast(toast);
        });
        actions.appendChild(btn);
      });
      body.appendChild(actions);
    }

    toast.appendChild(icon);
    toast.appendChild(body);
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('is-visible'));
    const duration = options?.duration ?? 4500;
    window.setTimeout(() => fadeToast(toast), duration);
    return toast;
  }

  function getIconForType(type) {
    switch (type) {
      case 'success':
        return '\u{1F389}';
      case 'gentle':
        return '\u{1F4AC}';
      case 'bonus':
        return '\u{1F3C6}';
      case 'hint':
        return '\u{1F4A1}';
      default:
        return '\u2728'; // ✨
    }
  }

  function fadeToast(toast) {
    if (!toast) {
      return;
    }
    toast.classList.remove('is-visible');
    toast.classList.add('is-leaving');
    window.setTimeout(() => toast.remove(), 320);
  }

  let toastContainer = null;

  function ensureToastContainer() {
    if (toastContainer && document.body.contains(toastContainer)) {
      return toastContainer;
    }
    toastContainer = document.getElementById('feedback-toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'feedback-toast-container';
      toastContainer.className = 'toast-feedback__container';
      toastContainer.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastContainer);
    }
    return toastContainer;
  }

  window.ui = window.ui || {};
  window.ui.toast = showFeedbackToast;
})();