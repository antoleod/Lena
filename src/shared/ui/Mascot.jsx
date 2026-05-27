import { useEffect, useRef, useState } from 'react';
import { useLocale } from '../i18n/LocaleContext.jsx';

// ─── SVG assets ──────────────────────────────────────────────────────────────

const MASCOT_SRC = {
  idle:      '/assets/characters/mascot-focused.svg',
  thinking:  '/assets/characters/mascot-focused.svg',
  correct:   '/assets/characters/mascot-happy.svg',
  wrong:     '/assets/characters/mascot-sad.svg',
  completed: '/assets/characters/mascot-celebrate.svg',
};

// ─── Messages ────────────────────────────────────────────────────────────────

const MASCOT_MESSAGES = {
  es: {
    idle:      ['¡Hola! Vamos a aprender juntos 🚀', '¡Tú puedes hacerlo! 🌟', '¿Listo para jugar y aprender? ✨'],
    thinking:  ['Hmm... ¿cuál es la respuesta? 💭', 'Piensa con calma 🤔', '¡Tómate tu tiempo! ⏰'],
    correct:   ['¡Soberbio! ¡Eres genial! 🎉', '¡Excelente! ¡Qué inteligente! ⭐', '¡Woohoo! ¡Correcto! 🏆'],
    wrong:     ['¡Casi! ¡Vamos a intentarlo otra vez! 💡', '¡Cerca! Sigue intentándolo 💪', '¡De los errores aprendemos! 🌟'],
    completed: ['¡Wow! ¡Completaste la actividad! 🥳', '¡Qué gran puntaje! ¡Eres una estrella! 🌟'],
  },
  fr: {
    idle:      ['Salut ! Apprenons ensemble 🚀', 'Tu peux le faire ! 🌟', 'Prêt(e) à jouer et apprendre ? ✨'],
    thinking:  ['Hmm… quelle est la bonne réponse ? 💭', 'Prends ton temps ! 🤔', 'Pas de stress ! ⏰'],
    correct:   ['Bravo ! Tu es super ! 🎉', 'Excellent ! Très intelligent(e) ! ⭐', 'Woohoo ! Correct ! 🏆'],
    wrong:     ['Presque ! On regarde ensemble 💡', 'Tu y es presque ! Continue 💪', 'On apprend de ses erreurs ! 🌟'],
    completed: ['Wow ! Tu as terminé l\'activité ! 🥳', 'Quel score magnifique ! Tu es une étoile ! 🌟'],
  },
  en: {
    idle:      ['Hi! Let\'s learn together 🚀', 'You can do this! 🌟', 'Ready to play and learn? ✨'],
    thinking:  ['Hmm… what\'s the answer? 💭', 'Think carefully! 🤔', 'Take your time! ⏰'],
    correct:   ['Awesome! You are amazing! 🎉', 'Excellent! So smart! ⭐', 'Woohoo! Correct! 🏆'],
    wrong:     ['Almost! Let\'s try again 💡', 'So close! Keep trying 💪', 'We learn by trying! 🌟'],
    completed: ['Wow! You finished the activity! 🥳', 'What a great score! You are a star! 🌟'],
  },
  nl: {
    idle:      ['Hoi! Laten we samen leren 🚀', 'Je kunt het! 🌟', 'Klaar om te spelen en te leren? ✨'],
    thinking:  ['Hmm… wat is het antwoord? 💭', 'Denk rustig na! 🤔', 'Neem je tijd! ⏰'],
    correct:   ['Super! Je bent geweldig! 🎉', 'Uitstekend! Heel slim! ⭐', 'Woohoo! Correct! 🏆'],
    wrong:     ['Bijna! Probeer het nog eens 💡', 'Zo dichtbij! Blijf proberen 💪', 'Van proberen kun je leren! 🌟'],
    completed: ['Wauw! Je hebt het afgerond! 🥳', 'Wat een geweldige score! 🌟'],
  },
};

const CLICK_MESSAGES = {
  es: ['¡Jeje, eso me hace cosquillas! 😸', '¡Sigue adelante, lo estás haciendo genial! 🚀', '¡Me encanta estudiar contigo! 💖'],
  fr: ['Héhé, ça me chatouille ! 😸', 'Continue, tu es génial(e) ! 🚀', 'J\'adore apprendre avec toi ! 💖'],
  en: ['Hehe, that tickles! 😸', 'Keep going, you\'re doing great! 🚀', 'I love studying with you! 💖'],
  nl: ['Hehe, dat kietelt! 😸', 'Ga zo door, je doet het geweldig! 🚀', 'Ik vind het leuk om met jou te leren! 💖'],
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getMsg(status, lang) {
  const pack = MASCOT_MESSAGES[lang] || MASCOT_MESSAGES.en;
  return pickRandom(pack[status] || pack.idle);
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Mascot({ status = 'idle' }) {
  const { locale } = useLocale();
  const [bubbleText, setBubbleText] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const [wink, setWink] = useState(false);
  const winkTimer = useRef(null);

  const lang = MASCOT_MESSAGES[locale] ? locale : 'en';
  const src = MASCOT_SRC[status] || MASCOT_SRC.idle;

  useEffect(() => {
    setBubbleText(getMsg(status, lang));
  }, [status, lang]);

  function handleClick() {
    const pack = CLICK_MESSAGES[lang] || CLICK_MESSAGES.en;
    setBubbleText(pack[clickCount % pack.length]);
    setClickCount((c) => c + 1);

    if (winkTimer.current) clearTimeout(winkTimer.current);
    setWink(true);
    winkTimer.current = setTimeout(() => setWink(false), 650);
  }

  // CSS class drives the animation on .mascot-body
  let stateClass = 'mascot--idle';
  if (status === 'correct')   stateClass = 'mascot--correct mascot--bounce';
  if (status === 'wrong')     stateClass = 'mascot--wrong mascot--shake';
  if (status === 'completed') stateClass = 'mascot--completed mascot--jump';
  if (status === 'thinking')  stateClass = 'mascot--thinking';
  if (wink)                   stateClass += ' mascot--wink';

  return (
    <div className={`interactive-mascot ${stateClass}`}>
      {/* Speech bubble */}
      {bubbleText && (
        <div className="mascot-bubble" key={bubbleText}>
          <p>{bubbleText}</p>
          <span className="bubble-arrow" aria-hidden="true" />
        </div>
      )}

      {/* Mascot button */}
      <button
        type="button"
        className="mascot-character"
        onClick={handleClick}
        aria-label="Mascotte Lena"
      >
        <div className="mascot-shadow" aria-hidden="true" />
        <div className="mascot-body">
          <img
            src={src}
            alt=""
            className="mascot-img"
            draggable="false"
            aria-hidden="true"
          />
        </div>
        <span className="mascot-sparkle mascot-sparkle--a" aria-hidden="true">⭐</span>
        <span className="mascot-sparkle mascot-sparkle--b" aria-hidden="true">✨</span>
      </button>
    </div>
  );
}
