import { useState, useEffect, useCallback, useRef } from 'react';

export function useFullScreen() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    function onChange() {
      setIsFullScreen(!!document.fullscreenElement);
    }
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange);
    };
  }, []);

  const enter = useCallback(async () => {
    const el = elementRef.current || document.documentElement;
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
    } catch (_) {}
  }, []);

  const exit = useCallback(async () => {
    try {
      if (document.exitFullscreen) await document.exitFullscreen();
      else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
    } catch (_) {}
  }, []);

  const toggle = useCallback(() => {
    if (isFullScreen) exit(); else enter();
  }, [isFullScreen, enter, exit]);

  return { isFullScreen, enter, exit, toggle, elementRef };
}
