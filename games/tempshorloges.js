;(function(){
  'use strict';

  const LEVELS = Array.from({ length: 10 }, (_, i) => ({
    level: i + 1,
    count: 7,
    reward: { stars: 9 + i, coins: 4 + Math.floor(i / 3) }
  }));

  const MINUTE_CHOICES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  const MINUTE_DESCRIPTIONS = {
    0: 'le 12 (pile)',
    5: 'le 1 (05 minutes)',
    10: 'le 2 (10 minutes)',
    15: 'le 3 (15 minutes)',
    20: 'le 4 (20 minutes)',
    25: 'le 5 (25 minutes)',
    30: 'le 6 (30 minutes)',
    35: 'le 7 (35 minutes)',
    40: 'le 8 (40 minutes)',
    45: 'le 9 (45 minutes)',
    50: 'le 10 (50 minutes)',
    55: 'le 11 (55 minutes)'
  };
  const HOUR_DESCRIPTIONS = ['le 12', 'le 1', 'le 2', 'le 3', 'le 4', 'le 5', 'le 6', 'le 7', 'le 8', 'le 9', 'le 10', 'le 11'];

  function build(level){
    const analogChance = Math.min(0.35 + level * 0.05, 0.75);
    const roll = Math.random();
    if (roll < analogChance){
      return buildAnalogueQuestion(level);
    }
    if (roll < analogChance + 0.35){
      return buildDigitalQuestion(level);
    }
    return buildDurationQuestion(level);
  }

  function buildDigitalQuestion(level){
    const hourMin = level < 4 ? 7 : 6;
    const hourMax = level > 7 ? 21 : 19;
    const hours = rand(hourMin, hourMax);
    const minutePool = level <= 3 ? [0, 15, 30, 45] : MINUTE_CHOICES;
    const minutes = minutePool[rand(0, minutePool.length - 1)];
    const answer = formatTime(hours, minutes);
    const prompt = `Lis l'heure numérique affichée : ${answer}`;
    return withOptions(prompt, answer, makeTimeDistractors(hours, minutes));
  }

  function buildAnalogueQuestion(level){
    const minutePool = level <= 2 ? [0, 15, 30, 45] : MINUTE_CHOICES;
    const minutes = minutePool[rand(0, minutePool.length - 1)];
    const baseHour = rand(1, 12);
    const afternoon = level > 4 && Math.random() < 0.5;
    const hour24 = (baseHour % 12) + (afternoon ? 12 : 0);
    const prompt = `La petite aiguille pointe vers ${HOUR_DESCRIPTIONS[baseHour % 12]} et la grande aiguille sur ${MINUTE_DESCRIPTIONS[minutes]}. Quelle heure est-il ?`;
    const answer = formatTime(hour24 % 24, minutes);
    return withOptions(prompt, answer, makeTimeDistractors(hour24 % 24, minutes));
  }

  function buildDurationQuestion(level){
    const start = rand(7, 15 + Math.floor(level / 2));
    const duration = rand(1, 2 + Math.floor(level / 4));
    const endHour = (start + duration) % 24;
    const prompt = `Le cours commence à ${formatTime(start, 0)} et dure ${duration} h. À quelle heure se termine-t-il ?`;
    const answer = formatTime(endHour, 0);
    const distractors = [
      formatTime((endHour + 23) % 24, 0),
      formatTime((endHour + 1) % 24, 0),
      formatTime(endHour, 30)
    ];
    return withOptions(prompt, answer, distractors);
  }

  function withOptions(prompt, answer, candidates){
    const set = new Set([answer, ...candidates]);
    while (set.size < 4){
      const h = rand(6, 21);
      const m = MINUTE_CHOICES[rand(0, MINUTE_CHOICES.length - 1)];
      set.add(formatTime(h, m));
    }
    const options = shuffle([...set]).slice(0, 4);
    return { prompt, answer, options };
  }

  function makeTimeDistractors(hours, minutes){
    return [
      formatTime(hours, (minutes + 5) % 60),
      formatTime((hours + (minutes >= 55 ? 1 : 0) + 1) % 24, minutes),
      formatTime(hours, (minutes + 30) % 60)
    ];
  }

  function formatTime(hours, minutes){
    return `${pad(hours % 24)}:${pad(minutes)}`;
  }

  function start(context){
    const idx = Math.max(0, Math.min(LEVELS.length, context.currentLevel) - 1);
    const L = LEVELS[idx];
    const qs = Array.from({ length: L.count }, () => build(L.level));
    if (window.MCQEngine){
      window.MCQEngine.start(context, { title: `Niveau ${L.level} - Temps & Horloges`, questions: qs, reward: L.reward });
      return;
    }
    const s = { i: 0, L, qs };
    render(context, s);
  }
  function render(context, s){
    context.content.innerHTML = '';
    context.content.appendChild(div('question-prompt fx-bounce-in-down', `Niveau ${s.L.level} - Temps & Horloges`));
    const box = div('puzzle-question-container');
    context.content.appendChild(box);
    context.configureBackButton('Retour aux niveaux', () => context.showLevelMenu());
    showQ(context, s, box);
  }
  function showQ(context, s, box){
    box.innerHTML = '';
    const q = s.qs[s.i];
    box.appendChild(div('puzzle-equation', `${q.prompt} ?`));
    const grid = div('puzzle-options');
    q.options.forEach(o => {
      const b = btn(o);
      b.dataset.value = o;
      b.addEventListener('click', () => answer(context, s, b, grid));
      grid.appendChild(b);
    });
    box.appendChild(grid);
  }
  function answer(context, s, button, grid){
    const q = s.qs[s.i];
    Array.from(grid.children).forEach(x => { x.disabled = true; });
    if (button.dataset.value === q.answer){
      button.classList.add('is-correct');
      context.playPositiveSound();
      context.awardReward(s.L.reward.stars, s.L.reward.coins);
      advance(context, s);
    } else {
      button.classList.add('is-wrong');
      const correct = grid.querySelector(`[data-value=\"${q.answer}\"]`);
      if (correct){
        correct.classList.add('is-correct');
      }
      context.playNegativeSound();
      context.awardReward(0, -2);
      setTimeout(() => advance(context, s), 900);
    }
  }
  function advance(context, s){
    s.i++;
    if (s.i >= s.qs.length){
      context.markLevelCompleted();
      context.showSuccessMessage('Bravo, l\'heure n\'a plus de secret !');
      context.showConfetti();
      setTimeout(() => context.showLevelMenu(), 1200);
    } else {
      showQ(context, s, context.content.querySelector('.puzzle-question-container'));
    }
  }

  function div(className, text){
    const element = document.createElement('div');
    if (className){
      element.className = className;
    }
    if (text != null){
      element.textContent = text;
    }
    return element;
  }
  function btn(text){
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'puzzle-option-btn';
    button.textContent = text;
    return button;
  }
  function pad(n){
    return String(n).padStart(2, '0');
  }
  function rand(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function shuffle(array){
    for (let i = array.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  window.tempsHorlogesGame = { start, getLevelCount: () => LEVELS.length };
})();
