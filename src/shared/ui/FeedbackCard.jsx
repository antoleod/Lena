const MSGS = {
  correct: {
    fr: ['Bravo !', 'Excellent !', 'Super !', 'Parfait !', 'Genial !', 'Bien joue !'],
    nl: ['Goed zo!', 'Uitstekend!', 'Super!', 'Perfect!', 'Geweldig!', 'Goed gedaan!'],
    en: ['Well done!', 'Excellent!', 'Super!', 'Perfect!', 'Great!', 'Brilliant!'],
    es: ['Bravo!', 'Excelente!', 'Super!', 'Perfecto!', 'Genial!', 'Bien hecho!'],
  },
  wrong: {
    fr: ['Pas tout a fait...', 'Presque !', 'Continue !', 'La prochaine fois !'],
    nl: ['Niet helemaal...', 'Bijna!', 'Blijf proberen!', 'Volgende keer!'],
    en: ['Not quite...', 'Almost!', 'Keep going!', 'Next time!'],
    es: ['No del todo...', 'Casi!', 'Sigue adelante!', 'La proxima vez!'],
  },
  wrongMotivational: {
    fr: [
      'Tu peux le faire, réessaie ! 💪',
      'Les champions ne lâchent pas ! 🏆',
      'Chaque erreur t\'apprend quelque chose ! 🌟',
      'Tu es plus fort(e) que tu ne le crois ! 🚀',
      'Un faux pas, et on repart ! 🔥',
      'Les grands esprits se trompent aussi ! 🧠',
      'Continue, tu vas y arriver ! ⚡',
    ],
    nl: [
      'Je kunt het! Probeer het opnieuw! 💪',
      'Kampioenen geven niet op! 🏆',
      'Elke fout leert je iets! 🌟',
      'Je bent sterker dan je denkt! 🚀',
      'Doorzetten! 🔥',
      'Ga door, je komt er! ⚡',
    ],
    en: [
      'You can do it, try again! 💪',
      'Champions never give up! 🏆',
      'Every mistake teaches you something! 🌟',
      'You\'re stronger than you think! 🚀',
      'Keep pushing! 🔥',
      'Keep going, you\'ll get it! ⚡',
    ],
    es: [
      '¡Tú puedes, inténtalo de nuevo! 💪',
      '¡Los campeones no se rinden! 🏆',
      '¡Cada error te enseña algo! 🌟',
      '¡Eres más fuerte de lo que crees! 🚀',
      '¡Sigue adelante! 🔥',
      '¡Continúa, lo lograrás! ⚡',
    ],
  },
  next: {
    fr: 'Suivant', nl: 'Volgende', en: 'Next', es: 'Siguiente',
  },
  correctAnswer: {
    fr: 'La bonne reponse etait', nl: 'Het goede antwoord was', en: 'The correct answer was', es: 'La respuesta correcta era',
  },
  repaso: {
    fr: 'Repas rapide', nl: 'Herhaling', en: 'Quick Review', es: 'Repaso rapido',
  },
};

function pickMsg(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function FeedbackCard({ isCorrect, correctAnswer, locale, onNext, explanation, onRepaso, difficulty }) {
  const loc = MSGS.correct[locale] ? locale : 'fr';
  const icon = isCorrect ? '✅' : '❌';
  const title = isCorrect
    ? pickMsg(MSGS.correct[loc])
    : pickMsg(MSGS.wrongMotivational[loc]);
  return (
    <div className="fb-overlay">
      <div className={`fb-card${isCorrect ? ' is-correct' : ' is-wrong'}`}>
        <span className="fb-card__icon">{icon}</span>
        <div className="fb-card__title">{title}</div>
        {!isCorrect && correctAnswer != null && (
          <>
            <div className="fb-card__answer-label">{MSGS.correctAnswer[loc]}</div>
            <div className="fb-card__answer">{correctAnswer}</div>
          </>
        )}
        {explanation && (
          <div className="fb-card__explanation">{explanation}</div>
        )}
        <div className="fb-card__actions">
          <button
            className="fb-card__next"
            type="button"
            onPointerDown={(e) => { e.preventDefault(); onNext(); }}
          >
            {MSGS.next[loc]} &rarr;
          </button>
          {!isCorrect && onRepaso && (
            <button
              className="fb-card__repaso"
              type="button"
              onPointerDown={(e) => { e.preventDefault(); onNext(); onRepaso(); }}
            >
              📚 {MSGS.repaso[loc]}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
