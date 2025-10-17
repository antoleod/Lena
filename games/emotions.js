(function(){
  'use strict';

  const LEVEL_COUNT = 12;
  const EXERCISES_PER_LEVEL = 6;

  const GAME_BUILDERS = {
    'emotions-magiques': buildEmotionsMagiquesQuestion,
    'missions-jour': buildMissionsDuJourQuestion,
    'quiz-jour': buildQuizDuJourQuestion,
    'respire-repose': buildRespireReposeQuestion,
    'expression-soi': buildExpressionSoiQuestion
  };

  const GAME_TITLES = {
    'emotions-magiques': 'Émotions Magiques',
    'missions-jour': 'Missions du Jour',
    'quiz-jour': 'Quiz du Jour',
    'respire-repose': 'Respire & Repose-toi',
    'expression-soi': 'Expression de Soi / Mon Journal'
  };

  function start(gameId, context){
    context.topic = gameId;
    if (!GAME_BUILDERS[gameId]) {
      showComingSoon(context, gameId);
      return;
    }
    const level = Math.max(1, (context.currentLevel || 1));
    const questions = Array.from({ length: EXERCISES_PER_LEVEL }, () => GAME_BUILDERS[gameId](level));
    renderQuiz(context, {
      gameId,
      title: `${GAME_TITLES[gameId] || 'Atelier'} - Niveau ${level}`,
      reward: computeReward(level),
      questions,
      onComplete: () => {
        context.markLevelCompleted();
        const reward = computeReward(level);
        context.awardReward(reward.stars, reward.coins);
        context.showSuccessMessage('Bravo ! Tu as accompli ce niveau ✨');
        context.showConfetti && context.showConfetti();
        setTimeout(() => {
          if (typeof context.showLevelMenu === 'function') {
            context.showLevelMenu();
          }
        }, 1200);
      }
    });
  }

  function computeReward(level){
    return {
      stars: 12 + level,
      coins: 6 + Math.floor(level / 3)
    };
  }

  function renderQuiz(context, { gameId, title, reward, questions, onComplete }){
    let index = 0;
    const total = questions.length;

    context.content.innerHTML = '';
    context.content.classList.add('puzzle-mode');

    const heading = document.createElement('div');
    heading.className = 'question-prompt fx-bounce-in-down';
    heading.textContent = title;
    context.content.appendChild(heading);

    const intro = document.createElement('p');
    intro.className = 'question-detail logic-level-intro';
    intro.textContent = `Réponds aux ${total} activités pour gagner ${reward.stars} étoiles et ${reward.coins} pièces.`;
    context.content.appendChild(intro);

    const card = document.createElement('div');
    card.className = 'puzzle-question-container fx-bounce-in-down';
    context.content.appendChild(card);

    const progressLabel = document.createElement('div');
    progressLabel.className = 'progress-tracker__label is-visible';
    progressLabel.textContent = `Question 1 / ${total}`;
    card.appendChild(progressLabel);

    const questionHolder = document.createElement('div');
    questionHolder.className = 'puzzle-equation logic-question-block';
    card.appendChild(questionHolder);

    const optionGrid = document.createElement('div');
    optionGrid.className = 'puzzle-options logic-options-grid';
    card.appendChild(optionGrid);

    context.configureBackButton('Retour aux niveaux', () => {
      if (typeof context.showLevelMenu === 'function') {
        context.showLevelMenu();
      }
    });

    showQuestion();

    function showQuestion(){
      const current = questions[index];
      renderPrompt(questionHolder, current);
      optionGrid.innerHTML = '';
      progressLabel.textContent = `Question ${index + 1} / ${total}`;

      current.options.forEach(option => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'puzzle-option-btn';
        button.textContent = String(option);
        button.dataset.value = String(option);
        button.addEventListener('click', () => handleAnswer(button, String(current.answer)));
        optionGrid.appendChild(button);
      });
    }

    function handleAnswer(button, answer){
      Array.from(optionGrid.children).forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.value === answer) {
          btn.classList.add('is-correct');
        }
      });

      if (button.dataset.value === answer) {
        context.playPositiveSound && context.playPositiveSound();
      } else {
        button.classList.add('is-wrong');
        context.playNegativeSound && context.playNegativeSound();
      }

      setTimeout(() => {
        index += 1;
        if (index >= total) {
          onComplete && onComplete();
        } else {
          Array.from(optionGrid.children).forEach(btn => {
            btn.classList.remove('is-correct', 'is-wrong');
            btn.disabled = false;
          });
          showQuestion();
        }
      }, 650);
    }
  }

  function renderPrompt(holder, question){
    holder.innerHTML = '';
    const lines = question.promptLines || [];
    lines.forEach(line => {
      const text = typeof line.text === 'string' ? line.text : '';
      const type = line.type || 'text';
      if (!text.trim()) { return; }
      const element = document.createElement(type === 'code' ? 'pre' : 'p');
      element.className = type === 'code' ? 'logic-question-code' : 'logic-question-detail';
      element.textContent = text.trim();
      holder.appendChild(element);
    });
    if (question.questionText) {
      const main = document.createElement('p');
      main.className = 'logic-question-main';
      main.textContent = question.questionText;
      holder.appendChild(main);
    }
  }

  function showComingSoon(context, topic){
    context.content.innerHTML = '';
    const div = document.createElement('div');
    div.className = 'coming-soon-wrapper fx-bounce-in-down';
    div.innerHTML = `<h2>✨ Bientôt disponible</h2><p>${GAME_TITLES[topic] || 'Atelier bien-être'}</p>`;
    context.content.appendChild(div);
    context.configureBackButton('Retour aux sujets', context.goToTopics);
  }

  /* --- Question builders --- */

  const EMOTION_SCENARIOS = [
    { situation: 'Léna vient de recevoir un cadeau surprise.', answer: 'joyeux', options: ['joyeux', 'fâché', 'triste', 'effrayé'] },
    { situation: 'Léo a perdu son doudou préféré.', answer: 'triste', options: ['triste', 'amusé', 'enthousiaste', 'calme'] },
    { situation: 'Une grande araignée apparaît sur le mur.', answer: 'effrayé', options: ['effrayé', 'joyeux', 'fier', 'curieux'] },
    { situation: 'Maya partage un secret avec sa meilleure amie.', answer: 'confiant', options: ['confiant', 'en colère', 'jaloux', 'épuisé'] },
    { situation: 'Tom s’est disputé avec son frère.', answer: 'en colère', options: ['en colère', 'heureux', 'calme', 'ravi'] },
    { situation: 'On applaudit Zoé pour sa chorégraphie.', answer: 'fier', options: ['fier', 'timide', 'coupable', 'las'] },
    { situation: 'Noa respire profondément après le sport.', answer: 'calme', options: ['calme', 'stressé', 'gêné', 'excité'] },
    { situation: 'Lou découvre un nouveau musée plein de mystères.', answer: 'curieux', options: ['curieux', 'déçu', 'fâché', 'fatigué'] },
    { situation: 'Sami doit parler devant toute la classe.', answer: 'stressé', options: ['stressé', 'rassuré', 'chanceux', 'joyeux'] },
    { situation: 'Mina retrouve son chat après l’école.', answer: 'rassuré', options: ['rassuré', 'gêné', 'fâché', 'jaloux'] }
  ];

  const MISSION_TASKS = [
    { action: 'Dire “merci” à quelqu’un aujourd’hui.', type: 'gentillesse' },
    { action: 'Respirer profondément 5 fois avant de commencer ses devoirs.', type: 'bien-être' },
    { action: 'Aider un camarade à comprendre un exercice.', type: 'entraide' },
    { action: 'Écrire trois choses positives qui se sont passées.', type: 'gratitude' },
    { action: 'Prendre le temps de s’étirer après s’être levé.', type: 'bien-être' },
    { action: 'Dire “bravo” à quelqu’un de la famille.', type: 'gentillesse' },
    { action: 'Sourire à trois personnes pendant la journée.', type: 'gentillesse' },
    { action: 'Boire un grand verre d’eau après le goûter.', type: 'soin' },
    { action: 'Mettre de l’ordre dans sa trousse ou son bureau.', type: 'organisation' },
    { action: 'Fermer les yeux et écouter les sons pendant 30 secondes.', type: 'pleine conscience' }
  ];

  const MISSION_TASKS_SIMPLIFIEES = [
    // Gentillesse
    { action: 'Dire "bonjour" avec un grand sourire.', type: 'gentillesse' },
    { action: 'Faire un compliment à un ami.', type: 'gentillesse' },
    { action: 'Dire "merci" à quelqu\'un.', type: 'gentillesse' },
    // Bien-être
    { action: 'Boire un grand verre d\'eau.', type: 'bien-être' },
    { action: 'S\'étirer comme un chat.', type: 'bien-être' },
    { action: 'Respirer 3 fois très lentement.', type: 'bien-être' },
    // Aide
    { action: 'Aider à ranger la table.', type: 'aide' },
    { action: 'Aider un ami à faire quelque chose.', type: 'aide' },
    { action: 'Ranger un de tes jouets.', type: 'aide' }
  ];

  const QUIZ_FACTS_SIMPLIFIES = [
    { prompt: "Pour te calmer, combien de fois dois-tu respirer profondément ?", answer: "3 fois", options: ["3 fois", "1 fois", "Jamais"] },
    { prompt: "Comment remercier un ami gentiment ?", answer: "Lui dire merci", options: ["Lui dire merci", "L'ignorer", "Lui crier dessus"] },
    { prompt: "Après avoir bien travaillé, une petite pause de combien de temps est utile ?", answer: "5 minutes", options: ["5 minutes", "0 minute", "1 heure"] },
    { prompt: "Dans un journal intime, qu'est-ce qu'on peut écrire ?", answer: "Ses secrets et ses joies", options: ["Ses secrets et ses joies", "Des mots méchants", "Rien du tout"] },
    { prompt: "Pour se réconcilier, il est important de...", answer: "Parler calmement", options: ["Parler calmement", "Crier très fort", "Ne plus se parler"] },
    { prompt: "Quand tu te sens un peu énervé(e), que peux-tu faire ?", answer: "Respirer doucement", options: ["Respirer doucement", "Taper du pied", "Garder sa colère"] },
    { prompt: "Quand un ami est triste, que peux-tu faire ?", answer: "L'écouter et le consoler", options: ["L'écouter et le consoler", "Rire de lui", "L'ignorer"] },
    { prompt: "Faire un compliment, c'est pour...", answer: "Faire plaisir", options: ["Faire plaisir", "Rendre triste", "Se moquer"] },
    { prompt: "Pour bien commencer la journée, tu peux...", answer: "Sourire et t'étirer", options: ["Sourire et t'étirer", "Râler un peu", "Rester au lit"] },
    { prompt: "Pour bien dormir, il vaut mieux...", answer: "Lire une histoire", options: ["Lire une histoire", "Jouer sur une tablette", "Manger des bonbons"] }
  ];

  const RESPIRE_TIPS = [
    { focus: "Un exercice de respiration en 4 temps.", steps: ["Inspire par le nez en comptant 4.", "Bloque ta respiration pendant 2.", "Expire lentement en comptant 4.", "Répète 4 fois."] },
    { focus: "Une mini relaxation du corps.", steps: ["Assieds-toi confortablement.", "Contracte les mains puis relâche.", "Monte les épaules et laisse-les tomber.", "Respire lentement."] },
    { focus: "Pause météo intérieure.", steps: ["Ferme les yeux.", "Demande-toi comment tu te sens.", "Donne un mot à ton émotion.", "Respire profondément."] },
    { focus: "Balade imaginaire.", steps: ["Imagine un lieu calme.", "Observe les détails.", "Respire au rythme de tes pensées.", "Souris doucement."] },
    { focus: "Étirement du matin.", steps: ["Levez les bras vers le ciel.", "Étire-toi comme un chat.", "Inspire et étire, expire et relâche.", "Répète 3 fois."] },
    { focus: "Pause gratitude.", steps: ["Ferme les yeux.", "Pense à quelqu'un que tu apprécies.", "Respire en pensant à un souvenir joyeux.", "Expire en souriant."] },
    { focus: "Calmer les épaules.", steps: ["Respire profondément.", "Hausse les épaules doucement.", "Souffle en les relâchant.", "Sens la détente."] },
    { focus: "Pause du papillon.", steps: ["Croise les bras sur ta poitrine.", "Tapote doucement tes épaules en alternant.", "Respire en rythme.", "Continue pendant 20 secondes."] }
  ];

  const EXPRESSION_PROMPTS = [
    {
      question: "Quel mot te donne de la force quand tu écris dans ton journal ?",
      answer: "Je suis capable",
      options: ["Je suis capable", "Je suis nul", "Je n'y arriverai jamais", "Je dois abandonner"]
    },
    {
      question: "Quelle idée positive peux-tu écrire pour commencer ta journée ?",
      answer: "Aujourd'hui, je vais faire de mon mieux",
      options: ["Aujourd'hui, je vais faire de mon mieux", "Je ne ferai rien", "Tout est trop difficile", "Personne ne m'écoute"]
    },
    {
      question: "Quel souvenir joyeux peux-tu raconter dans ton journal ?",
      answer: "Un moment partagé avec un ami",
      options: ["Un moment partagé avec un ami", "Une dispute interminable", "Un oubli volontaire", "Rien du tout"]
    },
    {
      question: "Quelle couleur peut représenter une émotion douce ?",
      answer: "Le bleu calme",
      options: ["Le bleu calme", "Le gris orageux", "Le noir sombre", "Le rouge colère"]
    },
    {
      question: "Quel compliment peux-tu t'écrire pour te motiver ?",
      answer: "Je suis courageux et persévérant",
      options: ["Je suis courageux et persévérant", "Je ne vaux rien", "Je suis toujours trop lent", "Je suis incapable"]
    },
    {
      question: "Quel objectif bienveillant peux-tu noter pour demain ?",
      answer: "Encourager quelqu'un aujourd'hui",
      options: ["Encourager quelqu'un aujourd'hui", "Ne parler à personne", "Garder mes émotions pour moi", "Me moquer d'un camarade"]
    },
    {
      question: "Quelle phrase t'aide à exprimer ta gratitude ?",
      answer: "Je suis reconnaissant pour mes amis",
      options: ["Je suis reconnaissant pour mes amis", "Je suis seul et ignoré", "Rien ne me rend heureux", "Personne ne m'aide"]
    },
    {
      question: "Quel animal symbolise une sensation de liberté ?",
      answer: "Un papillon libre",
      options: ["Un papillon libre", "Un lion en cage", "Une tortue stressée", "Un poisson perdu"]
    }
  ];

  function buildEmotionsMagiquesQuestion(level){
    const scenario = randomChoice(EMOTION_SCENARIOS);
    return {
      promptLines: [{ text: scenario.situation }],
      questionText: 'Quelle émotion correspond à cette situation ?',
      answer: scenario.answer,
      options: shuffle(scenario.options)
    };
  }

  function buildMissionsDuJourQuestion(level){
    const task = randomChoice(MISSION_TASKS_SIMPLIFIEES);
    const allCategories = ['gentillesse', 'bien-être', 'aide'];
    const otherCategories = allCategories.filter(c => c !== task.type);
    const options = shuffle([
      task.type,
      ...shuffle(otherCategories).slice(0, 2) // Prendre 2 autres catégories pour avoir 3 options au total
    ]);
    return {
      promptLines: [{ text: task.action }],
      questionText: 'Quel type de mission est-ce ?',
      answer: capitalizeFirst(task.type),
      options: options.map(capitalizeFirst)
    };
  }

  function buildQuizDuJourQuestion(level){
    const item = randomChoice(QUIZ_FACTS_SIMPLIFIES);
    return {
      promptLines: [{ text: item.prompt }],
      questionText: 'Choisis la meilleure réponse.',
      answer: item.answer,
      options: shuffle(item.options)
    };
  }

  function buildRespireReposeQuestion(level){
    const tip = randomChoice(RESPIRE_TIPS);
    const lines = tip.steps.map(step => ({ text: step }));
    return {
      promptLines: [{ text: `Thème : ${tip.focus}` }, ...lines],
      questionText: 'Quelle est la première chose à faire ?',
      answer: tip.steps[0],
      options: shuffle(tip.steps.slice(0, 4))
    };
  }

  function buildExpressionSoiQuestion(level){
    const prompt = randomChoice(EXPRESSION_PROMPTS);
    const options = shuffle(prompt.options);
    return {
      promptLines: [{ text: prompt.question }],
      questionText: 'Choisis la réponse qui t’inspire le plus.',
      answer: prompt.answer,
      options
    };
  }

  /* --- Helpers --- */

  function randomChoice(array){
    return array[Math.floor(Math.random() * array.length)];
  }

  function shuffle(array){
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function capitalizeFirst(text){
    if (!text) { return ''; }
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  window.coeurEmotions = {
    start,
    getLevelCount: () => LEVEL_COUNT
  };
})();
