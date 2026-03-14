import { useEffect, useMemo, useRef, useState } from 'react';

const VOICE_LOCALES = {
  fr: ['fr-BE', 'fr-FR', 'fr-CA'],
  nl: ['nl-BE', 'nl-NL'],
  en: ['en-GB', 'en-US'],
  es: ['es-ES', 'es-MX']
};

function resolveSpeechLocales(language) {
  return VOICE_LOCALES[language] || VOICE_LOCALES.fr;
}

function pickVoice(voices, language) {
  const locales = resolveSpeechLocales(language);
  for (const locale of locales) {
    const exact = voices.find((voice) => voice.lang === locale);
    if (exact) {
      return exact;
    }
  }

  for (const locale of locales) {
    const root = locale.split('-')[0];
    const loose = voices.find((voice) => voice.lang?.toLowerCase().startsWith(root.toLowerCase()));
    if (loose) {
      return loose;
    }
  }

  return voices[0] || null;
}

export function useSpeechPlayer(language = 'fr') {
  const utteranceRef = useRef(null);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const [voiceList, setVoiceList] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      setSupported(false);
      return undefined;
    }

    const synth = window.speechSynthesis;
    setSupported(true);

    function syncVoices() {
      setVoiceList(synth.getVoices());
    }

    syncVoices();
    synth.addEventListener?.('voiceschanged', syncVoices);

    return () => {
      synth.cancel();
      synth.removeEventListener?.('voiceschanged', syncVoices);
    };
  }, []);

  function stop() {
    if (!supported) {
      return;
    }
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setSpeaking(false);
  }

  function speak(text) {
    if (!supported || !text) {
      return false;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = resolveSpeechLocales(language)[0];
    utterance.voice = pickVoice(voiceList, language);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    setSpeaking(true);
    synth.speak(utterance);
    return true;
  }

  return useMemo(() => ({
    supported,
    speaking,
    speak,
    stop
  }), [language, speaking, supported, voiceList]);
}
