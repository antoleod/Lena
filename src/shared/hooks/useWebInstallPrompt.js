import { useEffect, useMemo, useState } from 'react';

function isStandaloneDisplay() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia?.('(display-mode: standalone)')?.matches || window.navigator.standalone === true;
}

export function useWebInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(() => isStandaloneDisplay());

  useEffect(() => {
    function handleBeforeInstallPrompt(event) {
      event.preventDefault();
      setDeferredPrompt(event);
    }

    function handleAppInstalled() {
      setDeferredPrompt(null);
      setIsStandalone(true);
    }

    function handleDisplayMode() {
      setIsStandalone(isStandaloneDisplay());
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.matchMedia?.('(display-mode: standalone)')?.addEventListener?.('change', handleDisplayMode);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.matchMedia?.('(display-mode: standalone)')?.removeEventListener?.('change', handleDisplayMode);
    };
  }, []);

  async function install() {
    if (!deferredPrompt) {
      return false;
    }

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice.catch(() => null);
    setDeferredPrompt(null);
    return choice?.outcome === 'accepted';
  }

  return useMemo(() => ({
    canInstall: Boolean(deferredPrompt) && !isStandalone,
    isStandalone,
    install
  }), [deferredPrompt, isStandalone]);
}
