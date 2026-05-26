import { useEffect, useState } from 'react';
import { useLocale } from '../i18n/LocaleContext.jsx';

const MASCOT_MESSAGES = {
  es: {
    idle: [
      '¡Hola! Vamos a aprender juntos hoy 🚀',
      '¡Tú puedes hacerlo! 🐱',
      '¡Qué alegría verte! 🌟',
      '¿Listo para jugar y aprender? ✨'
    ],
    thinking: [
      'Hmm... ¿cuál crees que sea la respuesta? 💭',
      'Piensa con calma, ¡tú puedes! 🤔',
      '¡Tómate tu tiempo! ⏰'
    ],
    correct: [
      '¡Soberbio! ¡Eres genial! 🎉',
      '¡Excelente! ¡Qué inteligente! ⭐',
      '¡Woohoo! ¡Correcto! 🏆'
    ],
    wrong: [
      '¡Casi! No te preocupes, ¡vamos a intentarlo otra vez! 💡',
      '¡Cerca! Sigue intentándolo 💪',
      '¡De los errores aprendemos! 🌟'
    ],
    completed: [
      '¡Wow! ¡Completaste toda la actividad! 🥳',
      '¡Qué gran puntaje! ¡Eres una estrella! 🌟'
    ]
  },
  fr: {
    idle: [
      'Salut! Apprenons ensemble aujourd\'hui 🚀',
      'Tu peux le faire! 🐱',
      'Ravi de te voir! 🌟',
      'Prêt pour jouer et apprendre? ✨'
    ],
    thinking: [
      'Hmm... quelle est la bonne réponse? 💭',
      'Prends ton temps, tu peux y arriver! 🤔',
      'Pas de stress! ⏰'
    ],
    correct: [
      'Bravo ! Tu es super ! 🎉',
      'Excellent ! Très intelligent ! ⭐',
      'Woohoo ! Correct ! 🏆'
    ],
    wrong: [
      'Presque! On regarde ensemble et on réessaie 💡',
      'Tu y es presque! Continue 💪',
      'On apprend de ses erreurs! 🌟'
    ],
    completed: [
      'Wow ! Tu as terminé l\'activité ! 🥳',
      'Quel score magnifique ! Tu es une étoile ! 🌟'
    ]
  },
  en: {
    idle: [
      'Hi! Let\'s learn together today 🚀',
      'You can do this! 🐱',
      'So happy to see you! 🌟',
      'Ready to play and learn? ✨'
    ],
    thinking: [
      'Hmm... what do you think is the answer? 💭',
      'Think carefully, you got this! 🤔',
      'Take your time! ⏰'
    ],
    correct: [
      'Awesome! You are amazing! 🎉',
      'Excellent! So smart! ⭐',
      'Woohoo! Correct! 🏆'
    ],
    wrong: [
      'Almost! Don\'t worry, let\'s try again 💡',
      'So close! Keep trying 💪',
      'We learn by trying! 🌟'
    ],
    completed: [
      'Wow! You finished the activity! 🥳',
      'What a great score! You are a star! 🌟'
    ]
  },
  nl: {
    idle: [
      'Hoi! Laten we vandaag samen leren 🚀',
      'Je kunt het! 🐱',
      'Fijn om je te zien! 🌟',
      'Klaar om te spelen en te leren? ✨'
    ],
    thinking: [
      'Hmm... wat denk je dat het antwoord is? 💭',
      'Denk rustig na, je kunt het! 🤔',
      'Neem je tijd! ⏰'
    ],
    correct: [
      'Super! Je bent geweldig! 🎉',
      'Uitstekend! Heel slim! ⭐',
      'Woohoo! Correct! 🏆'
    ],
    wrong: [
      'Bijna! Geen zorgen, probeer het nog eens 💡',
      'Zo dichtbij! Blijf proberen 💪',
      'Van proberen kun je leren! 🌟'
    ],
    completed: [
      'Wauw! Je hebt de activiteit afgerond! 🥳',
      'Wat een geweldige score! Je bent een ster! 🌟'
    ]
  }
};

function getRandomMessage(status, lang) {
  const langPack = MASCOT_MESSAGES[lang] || MASCOT_MESSAGES.en;
  const list = langPack[status] || langPack.idle;
  return list[Math.floor(Math.random() * list.length)];
}

export default function Mascot({ status = 'idle' }) {
  const { locale } = useLocale();
  const [bubbleText, setBubbleText] = useState('');
  const [isWinking, setIsWinking] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const currentLocale = MASCOT_MESSAGES[locale] ? locale : 'en';

  useEffect(() => {
    // Generate new bubble text whenever status changes
    setBubbleText(getRandomMessage(status, currentLocale));
    
    // Trigger mascot reaction wink/jump
    if (status === 'correct') {
      setIsWinking(true);
      const t = setTimeout(() => setIsWinking(false), 900);
      return () => clearTimeout(t);
    }
  }, [status, currentLocale]);

  // Click handler to make mascot respond interactively to clicks!
  function handleMascotClick() {
    setClickCount((c) => c + 1);
    setIsWinking(true);
    setTimeout(() => setIsWinking(false), 700);
    
    const clickMessages = {
      es: ['¡Jeje, eso me hace cosquillas! 😸', '¡Sigue adelante, vas súper bien! 🚀', '¡Me encanta estudiar contigo! 💖'],
      fr: ['Héhé, ça me fait des chatouilles ! 😸', 'Continue comme ça, tu es génial ! 🚀', 'J\'adore étudier avec toi ! 💖'],
      en: ['Hehe, that tickles! 😸', 'Keep going, you are doing awesome! 🚀', 'I love studying with you! 💖'],
      nl: ['Hehe, dat kietelt! 😸', 'Ga zo door, je doet het geweldig! 🚀', 'Ik vind het superleuk om met jou te leren! 💖']
    };
    
    const pack = clickMessages[currentLocale] || clickMessages.en;
    setBubbleText(pack[clickCount % pack.length]);
  }

  // Determine avatar icon representation based on status
  let mascotEmoji = '🐱';
  let mascotStateClass = 'mascot--idle';

  if (status === 'correct') {
    mascotEmoji = '😸';
    mascotStateClass = 'mascot--correct mascot--bounce';
  } else if (status === 'wrong') {
    mascotEmoji = '😿';
    mascotStateClass = 'mascot--wrong mascot--shake';
  } else if (status === 'thinking') {
    mascotEmoji = '😸';
    mascotStateClass = 'mascot--thinking';
  } else if (status === 'completed') {
    mascotEmoji = '😻';
    mascotStateClass = 'mascot--completed mascot--jump';
  }

  return (
    <div className={`interactive-mascot ${mascotStateClass}`}>
      <div className="mascot-bubble">
        <p>{bubbleText}</p>
        <span className="bubble-arrow" />
      </div>
      
      <button 
        type="button" 
        className="mascot-character" 
        onClick={handleMascotClick}
        aria-label="Lena the Mascot"
      >
        <div className="mascot-shadow" />
        <div className="mascot-body">
          <span className="mascot-face" role="img" aria-hidden="true">
            {isWinking ? '😉' : mascotEmoji}
          </span>
        </div>
        <div className="mascot-sparkle mascot-sparkle--a">⭐</div>
        <div className="mascot-sparkle mascot-sparkle--b">✨</div>
      </button>
    </div>
  );
}
