(function () {
  const STORAGE_KEY = 'mathsLenaAudioMuted';
  const boundAudios = new Set();
  const listeners = new Set();

  function loadInitialState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'true';
    } catch (error) {
      console.error('Erreur lors du chargement du statut audio', error);
      return false;
    }
  }

  function persistState(muted) {
    try {
      localStorage.setItem(STORAGE_KEY, muted ? 'true' : 'false');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du statut audio', error);
    }
  }

  function updateDocumentState(muted) {
    document.documentElement.classList.toggle('audio-muted', muted);
    boundAudios.forEach(audio => {
      if (audio) {
        audio.muted = muted;
      }
    });
  }

  const manager = {
    isMuted: loadInitialState(),
    toggle() {
      this.setMuted(!this.isMuted);
    },
    setMuted(value) {
      const muted = Boolean(value);
      if (muted === this.isMuted) { return; }
      this.isMuted = muted;
      persistState(muted);
      updateDocumentState(muted);
      listeners.forEach(listener => {
        try {
          listener(muted);
        } catch (error) {
          console.error('Erreur listener audio', error);
        }
      });
    },
    bind(audioInstance) {
      if (!audioInstance || typeof audioInstance !== 'object') { return audioInstance; }
      try {
        audioInstance.muted = this.isMuted;
        boundAudios.add(audioInstance);
      } catch (error) {
        console.error('Erreur lors de la liaison audio', error);
      }
      return audioInstance;
    },
    onChange(callback) {
      if (typeof callback !== 'function') { return () => {}; }
      listeners.add(callback);
      return () => listeners.delete(callback);
    }
  };

  window.audioManager = manager;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => updateDocumentState(manager.isMuted));
  } else {
    updateDocumentState(manager.isMuted);
  }
})();
