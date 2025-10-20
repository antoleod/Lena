;(function(){
  'use strict';

  const LEVELS = Array.from({ length: 10 }, (_, i) => ({
    level: i + 1,
    count: 6,
    reward: { stars: 10 + i, coins: 5 + Math.floor(i / 3) }
  }));

  const MINUTE_CHOICES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  const SIMPLE_MINUTES = [0, 15, 30, 45];
  const DIGITAL_SCENES = [
    { badge: "🕒 Lecture numerique", title: "Horloge de la gare", description: "Un train part bientot. Lis l'heure affichee sur l'ecran lumineux." },
    { badge: "🕒 Lecture numerique", title: "Tableau de classe", description: "La cloche va sonner. Quelle heure est-il sur l'horloge digitale ?" },
    { badge: "🕒 Lecture numerique", title: "Réveil de Léna", description: "Le réveil de Léna sonne pour une nouvelle journée. Quelle heure est-il ?" }
  ];

  const ANALOG_SCENES = [
    { badge: "🕰️ Horloge classique", title: "Tour du village", description: "La grande horloge sonne dans le village. Quelle heure indique-t-elle ?" },
    { badge: "🕰️ Horloge classique", title: "Salon familial", description: "Chez Lena, une horloge ancienne donne l'heure du gouter." },
    { badge: "🕰️ Horloge classique", title: "Cuisine de Mamie", description: "L'horloge de la cuisine indique qu'il est l'heure de préparer le gâteau." }
  ];

  const DURATION_SCENES = [
    { badge: "⏱️ Durée d'activité", title: "Film au cinéma", description: "Le film commence maintenant. Calcule l'heure de fin pour savoir quand il se termine." },
    { badge: "⏱️ Durée d'activité", title: "Cours de musique", description: "La leçon débute et dure un certain temps. À quelle heure s'achève-t-elle ?" },
    { badge: "⏱️ Durée d'activité", title: "Trajet en train", description: "Le train part à cette heure. Calcule son heure d'arrivée." }
  ];

  const WORD_SCENES = [
    { badge: "📜 Heure en mots", title: "Invitation au bal", description: "L'invitation indique l'heure en toutes lettres. Retrouve-la sur l'horloge." },
    { badge: "📜 Heure en mots", title: "Grimoire lumineux", description: "Le grimoire écrit l'heure. Associe-la à l'horloge correspondante." },
    { badge: "📜 Heure en mots", title: "Message secret", description: "Un message secret donne l'heure en mots. Quelle horloge est la bonne ?" }
  ];

  const ELAPSED_SCENES = [
    { badge: "🔁 Temps écoulé", title: "Chrono aventure", description: "Note le temps écoulé entre le début et la fin de la mission." },
    { badge: "🔁 Temps écoulé", title: "Voyage express", description: "Combien de temps s'est écoulé entre le départ et l'arrivée ?" },
    { badge: "🔁 Temps écoulé", title: "Recette de potion", description: "La potion a mijoté. Combien de temps cela a-t-il pris ?" }
  ];

  const QUESTION_POOL = [
    { id: 'digital', minLevel: 1, weight: 3, builder: buildDigitalQuestion },
    { id: 'analog', minLevel: 1, weight: 3, builder: buildAnalogueQuestion },
    { id: 'duration', minLevel: 3, weight: 2, builder: buildDurationQuestion },
    { id: 'words', minLevel: 4, weight: 2, builder: buildWordQuestion },
    { id: 'elapsed', minLevel: 5, weight: 2, builder: buildElapsedQuestion },
    { id: 'am-pm', minLevel: 6, weight: 1, builder: buildAmPmQuestion }
  ];

  function build(level){
    const catalog = QUESTION_POOL.filter(entry => level >= entry.minLevel);
    const totalWeight = catalog.reduce((sum, entry) => sum + entry.weight, 0);
    let ticket = Math.random() * totalWeight;
    for (const entry of catalog){
      ticket -= entry.weight;
      if (ticket <= 0){
        return entry.builder(level);
      }
    }
    return catalog[catalog.length - 1].builder(level);
  }

  function buildDigitalQuestion(level){
    const hourMin = level < 4 ? 7 : 6;
    const hourMax = level > 7 ? 22 : 20;
    const hours = rand(hourMin, hourMax);
    const minutePool = level <= 3 ? SIMPLE_MINUTES : MINUTE_CHOICES;
    const minutes = minutePool[rand(0, minutePool.length - 1)] || 0;
    const display = formatTime(hours, minutes);
    const scene = DIGITAL_SCENES[rand(0, DIGITAL_SCENES.length - 1)];
    const prompt = `
      <div class="time-question time-question--digital">
        <div class="time-question__badge"><span>${scene.badge}</span></div>
        <p class="time-question__highlight">${scene.title}</p>
        <p class="time-question__detail">${scene.description}</p>
        <div class="time-question__visual">
          <span class="time-question__digital">${display}</span>
        </div>
        <p class="time-question__main">Quelle heure est indiquee ?</p>
      </div>
    `;
    const base = withOptions(prompt, display, makeTimeDistractors(hours, minutes, level), level);
    base.kind = 'digital';
    base.context = { hours, minutes };
    return base;
  }

  function buildAnalogueQuestion(level){
    const minutePool = level <= 2 ? SIMPLE_MINUTES : MINUTE_CHOICES;
    const minutes = minutePool[rand(0, minutePool.length - 1)];
    const baseHour = rand(1, 12);
    const afternoon = level > 4 && Math.random() < 0.5;
    const hour24 = (baseHour % 12) + (afternoon ? 12 : 0);
    const label = afternoon ? 'apres-midi' : 'matin';
    const scene = ANALOG_SCENES[rand(0, ANALOG_SCENES.length - 1)];
    const prompt = `
      <div class="time-question time-question--analog">
        <div class="time-question__badge"><span>${scene.badge}</span></div>
        <p class="time-question__highlight">${scene.title}</p>
        <p class="time-question__detail">${scene.description}</p>
        <div class="time-question__visual">${buildClockSVG(baseHour, minutes)}</div>
        <p class="time-question__main">Quelle heure est indiquee ?</p>
      </div>
    `;
    const answer = formatTime(hour24 % 24, minutes);
    const base = withOptions(prompt, answer, makeTimeDistractors(hour24 % 24, minutes, level), level);
    base.kind = 'analog';
    base.context = { hours: hour24 % 24, minutes };
    return base;
  }

  function buildAmPmQuestion(level) {
    const hour12 = rand(1, 11);
    const minutes = SIMPLE_MINUTES[rand(0, SIMPLE_MINUTES.length - 1)];
    const isAm = Math.random() < 0.5;
    const hour24 = isAm ? hour12 : (hour12 % 12) + 12;

    const scenarios = [
        { period: 'matin', isAm: true, activity: 'Le soleil se lève', question: 'Quelle horloge indique cette heure du matin ?' },
        { period: 'après-midi', isAm: false, activity: 'On prend le goûter', question: 'Quelle horloge indique cette heure de l\'après-midi ?' },
        { period: 'soir', isAm: false, activity: 'On regarde les étoiles', question: 'Quelle horloge indique cette heure du soir ?' }
    ];
    const scenario = scenarios.find(s => s.isAm === isAm) || scenarios[0];

    const prompt = `
      <div class="time-question time-question--ampm">
        <div class="time-question__badge"><span>${isAm ? '☀️' : '🌙'} Matin ou Soir ?</span></div>
        <p class="time-question__highlight">${scenario.activity}</p>
        <p class="time-question__detail">L'heure est <strong>${formatTime(hour12, minutes)}</strong>.</p>
        <p class="time-question__main">${scenario.question}</p>
      </div>
    `;
    const answer = formatTime(hour24, minutes);
    return withOptions(prompt, answer, makeTimeDistractors(hour24, minutes, level), level);
  }

  function buildClockSVG(hours, minutes){
    const hourAngle = (hours % 12 + minutes / 60) * 30;
    const minuteAngle = minutes * 6;
    return `
      <svg viewBox="0 0 100 100" class="clock-svg">
        <circle cx="50" cy="50" r="48" fill="#fff" stroke="#333" stroke-width="2"/>
        ${Array.from({ length: 12 }, (_, i) => {
          const angle = i * 30 * Math.PI / 180;
          const x = 50 + 40 * Math.sin(angle);
          const y = 50 - 40 * Math.cos(angle);
          return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="8">${i === 0 ? 12 : i}</text>`;
        }).join('')}
        ${Array.from({ length: 60 }, (_, i) => {
          if (i % 5 === 0) return '';
          const angle = i * 6 * Math.PI / 180;
          const x1 = 50 + 45 * Math.sin(angle);
          const y1 = 50 - 45 * Math.cos(angle);
          const x2 = 50 + 42 * Math.sin(angle);
          const y2 = 50 - 42 * Math.cos(angle);
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#999" stroke-width="0.5"/>`;
        }).join('')}
        <line x1="50" y1="50" x2="50" y2="25" stroke="#333" stroke-width="3" stroke-linecap="round" transform="rotate(${hourAngle} 50 50)"/>
        <line x1="50" y1="50" x2="50" y2="15" stroke="#555" stroke-width="2" stroke-linecap="round" transform="rotate(${minuteAngle} 50 50)"/>
        <circle cx="50" cy="50" r="2" fill="#333"/>
      </svg>`;
  }

  function buildDurationQuestion(level){
    const startHour = rand(7, 15 + Math.floor(level / 2));
    const minutePool = level <= 4 ? SIMPLE_MINUTES : MINUTE_CHOICES;
    const startMinutes = minutePool[rand(0, minutePool.length - 1)];
    const extraMinutes = level <= 4 ? [0, 15, 30] : [0, 15, 30, 45];
    const durationHours = rand(0, level > 6 ? 3 : 2);
    const durationMinutes = extraMinutes[rand(0, extraMinutes.length - 1)];
    const totalDuration = Math.max(15, durationHours * 60 + durationMinutes);
    const endingMinutesTotal = (startHour * 60 + startMinutes + totalDuration) % (24 * 60);
    const endHour = Math.floor(endingMinutesTotal / 60);
    const endMinutes = endingMinutesTotal % 60;
    const scene = DURATION_SCENES[rand(0, DURATION_SCENES.length - 1)];
    const prompt = `
      <div class="time-question time-question--timeline">
        <div class="time-question__badge"><span>${scene.badge}</span></div>
        <p class="time-question__highlight">${scene.title}</p>
        <p class="time-question__detail">${scene.description.replace("maintenant", `à <strong>${formatTime(startHour, startMinutes)}</strong>`)}</p>
        <p class="time-question__detail">Debut : <strong>${formatTime(startHour, startMinutes)}</strong></p>
        <p class="time-question__detail">Durée : ${formatDuration(totalDuration)}</p>
        <p class="time-question__main">A quelle heure se termine-t-il ?</p>
      </div>
    `;
    const answer = formatTime(endHour, endMinutes);
    const distractors = [
      formatTime((endHour + 23) % 24, endMinutes),
      formatTime(endHour, (endMinutes + 15) % 60),
      formatTime((startHour + Math.floor(totalDuration / 60)) % 24, startMinutes)
    ];
    const base = withOptions(prompt, answer, distractors, level);
    base.kind = 'duration';
    base.context = { startHour, startMinutes, endHour, endMinutes };
    return base;
  }

  function buildWordQuestion(level){
    const minutePool = level <= 5 ? SIMPLE_MINUTES : MINUTE_CHOICES;
    const hours = rand(6, level > 7 ? 22 : 20);
    const minutes = minutePool[rand(0, minutePool.length - 1)];
    const scene = WORD_SCENES[rand(0, WORD_SCENES.length - 1)];
    const phrase = timeToWords(hours, minutes);
    const prompt = `
      <div class="time-question time-question--words">
        <div class="time-question__badge"><span>${scene.badge}</span></div>
        <p class="time-question__highlight">${scene.title}</p>
        <p class="time-question__detail">${scene.description}</p>
        <div class="time-question__scroll">${phrase}</div>
        <p class="time-question__main">Quelle horloge correspond ?</p>
      </div>
    `;
    const answer = formatTime(hours, minutes);
    const base = withOptions(prompt, answer, makeTimeDistractors(hours, minutes, level), level);
    base.kind = 'words';
    base.context = { hours, minutes };
    return base;
  }

  function buildElapsedQuestion(level){
    const startHour = rand(6, 17);
    const minutePool = level <= 6 ? SIMPLE_MINUTES : MINUTE_CHOICES;
    const startMinutes = minutePool[rand(0, minutePool.length - 1)];
    const startTotal = startHour * 60 + startMinutes;
    const step = level >= 8 ? 5 : (level >= 6 ? 10 : 15);
    const minDuration = step * (level >= 7 ? 2 : 1);
    const maxDuration = Math.max(minDuration, Math.min(210, (21 * 60) - startTotal));
    const minFactor = Math.max(1, Math.ceil(minDuration / step));
    const maxFactor = Math.max(minFactor, Math.floor(maxDuration / step));
    const duration = step * rand(minFactor, maxFactor);
    const endTotal = startTotal + duration;
    const endHour = Math.floor(endTotal / 60);
    const endMinutes = endTotal % 60;
    const scene = ELAPSED_SCENES[rand(0, ELAPSED_SCENES.length - 1)];
    const prompt = `
      <div class="time-question time-question--elapsed">
        <div class="time-question__badge"><span>${scene.badge}</span></div>
        <p class="time-question__highlight">${scene.title}</p>
        <p class="time-question__detail">${scene.description.replace("Note le temps ecoule", "Calcule le temps écoulé")}</p>
        <div class="time-question__timeline">
          <span class="time-question__timeline-start">${formatTime(startHour, startMinutes)}</span>
          <span class="time-question__timeline-arrow">➜</span>
          <span class="time-question__timeline-end">${formatTime(endHour, endMinutes)}</span>
        </div>
        <p class="time-question__main">Combien de temps s'est ecoule ?</p>
      </div>
    `;
    const answerMinutes = duration;
    const distractors = [
      Math.max(step, duration - step),
      duration + step,
      duration + step * 2
    ];
    const base = withDurationOptions(prompt, answerMinutes, distractors);
    base.kind = 'elapsed';
    base.context = { startHour, startMinutes, endHour, endMinutes };
    return base;
  }

  function withOptions(prompt, answer, candidates, level){
    const targetSize = 2;
    const poolMinutes = level >= 7 ? MINUTE_CHOICES : SIMPLE_MINUTES;
    const unique = new Set([String(answer)]);

    if (Array.isArray(candidates)){
      for (const candidate of candidates){
        if (unique.size >= targetSize) break;
        const value = String(candidate);
        if (value !== String(answer)){
          unique.add(value);
        }
      }
    }

    let safety = 0;
    while (unique.size < targetSize && safety < 20){
      const randomHour = rand(level >= 7 ? 0 : 6, level >= 8 ? 23 : 21);
      const randomMinute = poolMinutes[rand(0, poolMinutes.length - 1)];
      const candidate = formatTime(randomHour, randomMinute);
      if (candidate !== String(answer)){
        unique.add(candidate);
      }
      safety++;
    }

    const options = shuffle([...unique]).slice(0, targetSize);
    return { prompt, answer, options };
  }

  function makeTimeDistractors(hours, minutes, level){
    const nextHour = (hours + 1) % 24;
    const previousHour = (hours + 23) % 24;
    const items = [
      formatTime(hours, (minutes + 5) % 60),
      formatTime(nextHour, minutes),
      formatTime(hours, (minutes + 30) % 60)
    ];
    if (level >= 6){
      items.push(formatTime(previousHour, minutes));
    }
    return items;
  }

  function withDurationOptions(prompt, answerMinutes, candidateMinutes){
    const targetSize = 2;
    const unique = new Set([answerMinutes]);
    if (Array.isArray(candidateMinutes)){
      for (const candidate of candidateMinutes){
        if (unique.size >= targetSize) break;
        if (candidate !== answerMinutes && candidate > 0){
          unique.add(candidate);
        }
      }
    }
    let safety = 0;
    while (unique.size < targetSize && safety < 20){
      const delta = rand(1, 3) * 10;
      const direction = Math.random() < 0.5 ? -1 : 1;
      const candidate = Math.max(10, answerMinutes + direction * delta);
      if (!unique.has(candidate)){
        unique.add(candidate);
      }
      safety++;
    }
    const optionsMinutes = shuffle([...unique]).slice(0, targetSize);
    const options = optionsMinutes.map(formatDuration);
    const answer = formatDuration(answerMinutes);
    return { prompt, answer, options };
  }

  function formatDuration(totalMinutes){
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0){
      return `${minutes} min`;
    }
    if (minutes === 0){
      return `${hours} h`;
    }
    return `${hours} h ${minutes} min`;
  }

  function timeToWords(hours, minutes){
    const normalized = ((hours % 24) + 24) % 24;
    const period = timePeriod(normalized);
    if (minutes === 0){
      if (normalized === 0) return 'Il est minuit pile.';
      if (normalized === 12) return 'Il est midi pile.';
      return `Il est ${hourLabel(normalized)} pile${period ? ' ' + period : ''}.`;
    }
    if (minutes === 15){
      return `Il est ${hourLabel(normalized)} et quart${period ? ' ' + period : ''}.`;
    }
    if (minutes === 30){
      return `Il est ${hourLabel(normalized)} et demie${period ? ' ' + period : ''}.`;
    }
    if (minutes === 45){
      return `Il est ${hourLabel((normalized + 1) % 24)} moins le quart${period ? ' ' + period : ''}.`;
    }
    if (minutes < 30){
      return `Il est ${hourLabel(normalized)} ${minutes} minutes${period ? ' ' + period : ''}.`;
    }
    return `Il est ${hourLabel((normalized + 1) % 24)} moins ${60 - minutes} minutes${period ? ' ' + period : ''}.`;
  }

  function hourLabel(hours){
    const normalized = ((hours % 24) + 24) % 24;
    if (normalized === 0) return 'minuit';
    if (normalized === 12) return 'midi';
    const hour12 = normalized % 12 || 12;
    const names = ['une', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze'];
    const word = names[hour12 - 1] || `${hour12}`;
    return hour12 === 1 ? 'une heure' : `${word} heures`;
  }

  function timePeriod(hours){
    if (hours === 0 || hours === 12) return '';
    if (hours >= 5 && hours < 12) return 'du matin';
    if (hours >= 12 && hours < 18) return 'de l apres-midi';
    if (hours >= 18 && hours < 22) return 'du soir';
    return 'de la nuit';
  }

  function formatTime(hours, minutes){
    return `${pad(hours % 24)}:${pad(minutes)}`;
  }

  function start(context){
    const idx = Math.max(0, Math.min(LEVELS.length, context.currentLevel) - 1);
    const levelData = LEVELS[idx];
    const questions = Array.from({ length: levelData.count }, () => build(levelData.level));
    const state = { index: 0, level: levelData, questions };
    render(context, state);
  }

  function render(context, state){
    context.content.innerHTML = '';
    const shell = div('game-shell time-mastery');
    const header = div('game-shell__header');
    header.innerHTML = `
      <span class="game-shell__icon">⏰</span>
      <div class="game-shell__titles">
        <span class="game-shell__subtitle">Temps & Horloges</span>
        <span class="game-shell__level">Niveau ${state.level.level}</span>
      </div>
    `;
    shell.appendChild(header);
    const container = div('puzzle-question-container time-question-area');
    shell.appendChild(container);
    context.content.appendChild(shell);
    context.configureBackButton('Retour aux niveaux', () => context.showLevelMenu());
    showQuestion(context, state, container);
  }

  function showQuestion(context, state, container){
    container.innerHTML = '';
    const q = state.questions[state.index];
    const progress = div('game-shell__progress', `Exercice ${state.index + 1} / ${state.questions.length}`);
    container.appendChild(progress);
    const prompt = div('puzzle-equation');
    prompt.innerHTML = q.prompt.includes('<') ? q.prompt : `${q.prompt}`;
    container.appendChild(prompt);
    const grid = div('puzzle-options time-options');
    q.options.forEach(option => {
      const value = String(option);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'puzzle-option-btn';
      button.dataset.value = value;
      const visuals = buildOptionVisual(value, q.kind, q.context);
      button.innerHTML = visuals.html;
      button.setAttribute('aria-label', visuals.label);
      button.addEventListener('click', () => answer(context, state, button, grid));
      grid.appendChild(button);
    });
    container.appendChild(grid);
  }

  function answer(context, state, button, grid){
    const q = state.questions[state.index];
    Array.from(grid.children).forEach(child => { child.disabled = true; });
    if (button.dataset.value === q.answer){
      button.classList.add('is-correct');
      context.playPositiveSound();
      context.awardReward(state.level.reward.stars, state.level.reward.coins);
      advance(context, state);
    } else {
      button.classList.add('is-wrong');
      const correct = grid.querySelector(`[data-value="${q.answer}"]`);
      if (correct){
        correct.classList.add('is-correct');
      }
      context.playNegativeSound();
      context.awardReward(0, -2);
      setTimeout(() => advance(context, state), 900);
    }
  }

  function advance(context, state){
    state.index++;
    if (state.index >= state.questions.length){
      context.markLevelCompleted();
      context.showSuccessMessage('Bravo, tu maitrises le temps !');
      context.showConfetti();
      setTimeout(() => context.showLevelMenu(), 1200);
    } else {
      const container = context.content.querySelector('.time-question-area');
      if (container){
        showQuestion(context, state, container);
      }
    }
  }

  function buildOptionVisual(option, kind, context){
    const safeOption = escapeHtml(option);
    const lowerKind = kind || 'default';
    let main = safeOption;
    let sub = '';
    let icon = '✨';
    if (safeOption.includes(':')){
      const [h, m] = safeOption.split(':').map(part => part.trim());
      const hours = Number(h);
      const minutes = Number(m);
      main = `${pad(hours)}:${pad(minutes)}`;
      const phrase = timeToWords(hours, minutes).replace(/^Il est\s*/i, '').replace(/\.$/, '');
      sub = phrase || `${hours} h ${minutes} min`;
      icon = lowerKind === 'analog' ? '🕰️' : '🕒';
    } else if (/h|min/i.test(safeOption)){
      main = safeOption;
      sub = lowerKind === 'elapsed' ? 'Durée écoulée' : 'Durée exprimée';
      icon = lowerKind === 'elapsed' ? '🔁' : '⏳';
    } else if (lowerKind === 'words'){
      main = safeOption;
      sub = 'Lecture en toutes lettres';
      icon = '📜';
    }

    const cardClass = `time-option-card time-option-card--${lowerKind}`;
    const subLine = sub ? `<span class="time-option-card__sub">${escapeHtml(sub)}</span>` : '';
    const html = `<span class="${cardClass}">
        <span class="time-option-card__icon">${icon}</span>
        <span class="time-option-card__labels">
          <span class="time-option-card__main">${main}</span>
          ${subLine}
        </span>
      </span>`;
    const label = sub ? `${option} (${sub})` : option;
    return { html, label };
  }

  function escapeHtml(text){
    return String(text).replace(/[&<>"']/g, ch => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[ch] || ch);
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
