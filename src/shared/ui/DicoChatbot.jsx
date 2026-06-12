import { useEffect, useRef, useState } from 'react';
import { useLocale } from '../i18n/LocaleContext.jsx';
import { assetUrl } from '../assets/assetUrl.js';
import { DICO_WORDS } from '../../features/dico/dicoData.js';
import './DicoChatbot.css';

const MASCOT_SRC = assetUrl('assets/characters/mascot-pair.svg');

const UI = {
  fr: {
    launch: 'Dico', title: 'Mon Dico', subtitle: 'Demande-moi un mot !',
    placeholder: 'Écris un mot…', send: 'Envoyer',
    greeting: 'Coucou ! Écris-moi un mot et je te dis ce qu’il veut dire. 📚',
    notFound: (w) => `Hmm, je ne connais pas encore « ${w} ». Essaie un autre mot ! 🤔`,
    definition: 'Définition', example: 'Exemple', synonyms: 'Synonymes', close: 'Fermer',
    hardTag: 'Ce mot est un peu difficile', simpler: 'En plus simple', tip: 'Pour t’aider', encourage: 'Tu vas y arriver ! 💪',
  },
  nl: {
    launch: 'Woord', title: 'Mijn Woordenboek', subtitle: 'Vraag me een woord!',
    placeholder: 'Typ een woord…', send: 'Versturen',
    greeting: 'Hoi! Typ een woord en ik vertel je wat het betekent. 📚',
    notFound: (w) => `Hmm, ik ken « ${w} » nog niet. Probeer een ander woord! 🤔`,
    definition: 'Definitie', example: 'Voorbeeld', synonyms: 'Synoniemen', close: 'Sluiten',
    hardTag: 'Dit woord is wat moeilijk', simpler: 'Eenvoudiger', tip: 'Om te helpen', encourage: 'Jij kunt het! 💪',
  },
  en: {
    launch: 'Dico', title: 'My Dictionary', subtitle: 'Ask me a word!',
    placeholder: 'Type a word…', send: 'Send',
    greeting: 'Hi! Type a word and I’ll tell you what it means. 📚',
    notFound: (w) => `Hmm, I don’t know “${w}” yet. Try another word! 🤔`,
    definition: 'Definition', example: 'Example', synonyms: 'Synonyms', close: 'Close',
    hardTag: 'This word is a bit tricky', simpler: 'In simpler words', tip: 'To help you', encourage: 'You can do it! 💪',
  },
  es: {
    launch: 'Dico', title: 'Mi Diccionario', subtitle: '¡Pregúntame una palabra!',
    placeholder: 'Escribe una palabra…', send: 'Enviar',
    greeting: '¡Hola! Escribe una palabra y te digo qué significa. 📚',
    notFound: (w) => `Mmm, todavía no conozco «${w}». ¡Prueba otra palabra! 🤔`,
    definition: 'Definición', example: 'Ejemplo', synonyms: 'Sinónimos', close: 'Cerrar',
    hardTag: 'Esta palabra es un poco difícil', simpler: 'Más fácil', tip: 'Para ayudarte', encourage: '¡Tú puedes! 💪',
  },
};

function normalize(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
function getWord(w, locale) { return w.i18n?.[locale]?.word || w.word; }
function getDefinition(w, locale) { return w.i18n?.[locale]?.definition || w.definition; }
function getExample(w, locale) { return w.i18n?.[locale]?.example || w.example; }

function lookup(q, locale) {
  const needle = normalize(q.trim());
  const wordOf = (w) => normalize(getWord(w, locale));
  return DICO_WORDS.find((w) => wordOf(w).startsWith(needle) || wordOf(w) === needle)
    || DICO_WORDS.find((w) => wordOf(w).includes(needle))
    || null;
}

// For words we judge a bit difficult (level ≥ 2), the bot leads with extra
// help: a simpler word the child already knows, plus a concrete tip/example.
function buildHelp(card, lang) {
  if ((card.level || 1) < 2) return null;
  // Synonyms in the data are French only — only offer one as the simpler word
  // when we're actually speaking French, otherwise it would mislead.
  const simpler = lang === 'fr'
    ? (card.synonyms?.[0] || card.family?.[0] || null)
    : null;
  const tip = getExample(card, lang) || null;
  if (!simpler && !tip) return null;
  return { simpler, tip };
}

export default function DicoChatbot() {
  const { locale } = useLocale();
  const lang = UI[locale] ? locale : 'fr';
  const ui = UI[lang];

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([{ from: 'bot', text: ui.greeting }]);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  // Reset greeting when language changes
  useEffect(() => {
    setMessages([{ from: 'bot', text: UI[lang].greeting }]);
  }, [lang]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') setOpen(false); }
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  function handleSubmit(e) {
    e.preventDefault();
    const word = query.trim();
    if (!word) return;
    const match = lookup(word, lang);
    setMessages((prev) => [
      ...prev,
      { from: 'me', text: word },
      match ? { from: 'bot', card: match } : { from: 'bot', text: ui.notFound(word) },
    ]);
    setQuery('');
  }

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        className={`dico-fab${open ? ' dico-fab--hidden' : ''}`}
        onClick={() => setOpen(true)}
        aria-label={ui.title}
      >
        <img src={MASCOT_SRC} alt="" className="dico-fab__mascot" draggable="false" />
        <span className="dico-fab__badge">📖</span>
        <span className="dico-fab__label">{ui.launch}</span>
      </button>

      {/* Chat panel */}
      {open && (
        <div className="dico-chat" role="dialog" aria-label={ui.title}>
          <header className="dico-chat__head">
            <img src={MASCOT_SRC} alt="" className="dico-chat__avatar" draggable="false" />
            <div className="dico-chat__titles">
              <strong>{ui.title}</strong>
              <small>{ui.subtitle}</small>
            </div>
            <button
              type="button"
              className="dico-chat__close"
              onClick={() => setOpen(false)}
              aria-label={ui.close}
            >✕</button>
          </header>

          <div className="dico-chat__body" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`dico-msg dico-msg--${m.from}`}>
                {m.card ? (() => {
                  const help = buildHelp(m.card, lang);
                  return (
                  <div className={`dico-msg__card${help ? ' dico-msg__card--hard' : ''}`}>
                    <div className="dico-msg__word">
                      <span className="dico-msg__emoji">{m.card.emoji}</span>
                      {getWord(m.card, lang)}
                    </div>
                    <p className="dico-msg__def">
                      <span className="dico-msg__label">{ui.definition} : </span>
                      {getDefinition(m.card, lang)}
                    </p>

                    {help ? (
                      <div className="dico-msg__help">
                        <span className="dico-msg__help-tag">💡 {ui.hardTag}</span>
                        {help.simpler && (
                          <p className="dico-msg__help-line">
                            <span className="dico-msg__label">{ui.simpler} : </span>
                            <strong>{help.simpler}</strong>
                          </p>
                        )}
                        {help.tip && (
                          <p className="dico-msg__help-line">
                            <span className="dico-msg__label">{ui.tip} : </span>
                            <em>{help.tip}</em>
                          </p>
                        )}
                        <span className="dico-msg__help-cheer">{ui.encourage}</span>
                      </div>
                    ) : (
                      <>
                        {getExample(m.card, lang) && (
                          <p className="dico-msg__ex">
                            <span className="dico-msg__label">{ui.example} : </span>
                            <em>{getExample(m.card, lang)}</em>
                          </p>
                        )}
                        {m.card.synonyms?.length > 0 && (
                          <p className="dico-msg__syn">
                            <span className="dico-msg__label">{ui.synonyms} : </span>
                            {m.card.synonyms.join(', ')}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  );
                })() : (
                  <span className="dico-msg__bubble">{m.text}</span>
                )}
              </div>
            ))}
          </div>

          <form className="dico-chat__input" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={ui.placeholder}
              autoComplete="off"
              spellCheck={false}
            />
            <button type="submit" aria-label={ui.send} disabled={!query.trim()}>➤</button>
          </form>
        </div>
      )}
    </>
  );
}
