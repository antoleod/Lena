;(function(){
  'use strict';

  const LEVELS = Array.from({ length: 10 }, (_, i) => ({
    level: i + 1,
    questions: 6,
    reward: { stars: 12 + i, coins: 6 + Math.floor(i / 2) }
  }));

  const UNIT_GROUPS = {
    length: [
      { unit: 'km', label: 'kilometres', toBase: 1000 },
      { unit: 'm', label: 'metres', toBase: 1 },
      { unit: 'cm', label: 'centimetres', toBase: 0.01 },
      { unit: 'mm', label: 'millimetres', toBase: 0.001 }
    ],
    mass: [
      { unit: 'kg', label: 'kilogrammes', toBase: 1000 },
      { unit: 'g', label: 'grammes', toBase: 1 }
    ],
    capacity: [
      { unit: 'L', label: 'litres', toBase: 1 },
      { unit: 'mL', label: 'millilitres', toBase: 0.001 }
    ]
  };

  const UNIT_SCENARIOS = [
    { text: 'Mesurer la longueur d un crayon', answer: 'cm', distractors: ['mm', 'm', 'kg'], minLevel: 1 },
    { text: 'Mesurer la distance entre deux villes', answer: 'km', distractors: ['m', 'cm', 'L'], minLevel: 2 },
    { text: 'Mesurer la masse d une pomme', answer: 'g', distractors: ['kg', 'cm', 'mL'], minLevel: 2 },
    { text: 'Mesurer l eau dans une gourde', answer: 'L', distractors: ['mL', 'kg', 'km'], minLevel: 3 },
    { text: 'Mesurer un medicament liquide', answer: 'mL', distractors: ['g', 'cm', 'km'], minLevel: 4 },
    { text: 'Mesurer la taille d un terrain de foot', answer: 'm', distractors: ['km', 'cm', 'L'], minLevel: 4 },
    { text: 'Mesurer la masse d une valise', answer: 'kg', distractors: ['g', 'mL', 'cm'], minLevel: 5 },
    { text: 'Mesurer l epaisseur d un livre', answer: 'mm', distractors: ['cm', 'g', 'L'], minLevel: 6 }
  ];

  const QUESTION_BUILDERS = [
    { minLevel: 1, weight: 3, builder: buildConversionQuestion },
    { minLevel: 2, weight: 2, builder: buildComparisonQuestion },
    { minLevel: 3, weight: 1, builder: buildUnitChoiceQuestion },
    { minLevel: 5, weight: 2, builder: buildAdditionQuestion }
  ];

  function build(level){
    const catalog = QUESTION_BUILDERS.filter(entry => level >= entry.minLevel);
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

  function buildConversionQuestion(level){
    const types = level <= 2 ? ['length', 'mass'] : ['length', 'mass', 'capacity'];
    const type = randomFrom(types);
    const pool = UNIT_GROUPS[type];
    const fromIndex = rand(0, pool.length - 1);
    let toIndex = rand(0, pool.length - 1);
    while (toIndex === fromIndex){
      toIndex = rand(0, pool.length - 1);
    }
    const fromUnit = pool[fromIndex];
    const toUnit = pool[toIndex];
    const step = level >= 7 ? 0.25 : level >= 4 ? 0.5 : 1;
    const maxValue = level >= 7 ? 120 : level >= 4 ? 80 : 40;
    const baseValue = rand(2, maxValue);
    const value = +(baseValue * step).toFixed(2);
    const answerValue = convertValue(value, fromUnit, toUnit);
    const prompt = `
      <div class="measure-question measure-question--convert">
        <p class="measure-question__intro">Mission conversion.</p>
        <p class="measure-question__detail">Type : ${type === 'length' ? 'longueur' : type === 'mass' ? 'masse' : 'capacite'}.</p>
        <p class="measure-question__main">Combien font ${formatValue(value, fromUnit.unit)} en ${toUnit.label} (${toUnit.unit}) ?</p>
      </div>
    `;
    const distractors = generateNumericDistractors(answerValue);
    return withNumericOptions(prompt, answerValue, toUnit.unit, distractors);
  }

  function buildComparisonQuestion(level){
    const type = randomFrom(level >= 4 ? Object.keys(UNIT_GROUPS) : ['length', 'mass']);
    const pool = UNIT_GROUPS[type];
    const unitA = pool[rand(0, pool.length - 1)];
    const unitB = pool[rand(0, pool.length - 1)];
    const baseMax = level >= 7 ? 5000 : 2000;
    const baseMin = type === 'capacity' ? 100 : 200;
    const baseValueA = rand(baseMin, baseMax);
    const baseValueB = rand(baseMin, baseMax);
    const valueA = +(baseValueA / unitA.toBase).toFixed(2);
    const valueB = +(baseValueB / unitB.toBase).toFixed(2);
    const baseA = baseValueA;
    const baseB = baseValueB;
    let mainQuestion = 'Quel est le plus grand ?';
    if (type === 'mass'){
      mainQuestion = 'Quel objet est le plus lourd ?';
    } else if (type === 'capacity'){
      mainQuestion = 'Quel volume est le plus grand ?';
    }
    const prompt = `
      <div class="measure-question measure-question--compare">
        <p class="measure-question__intro">Duel de mesures.</p>
        <p class="measure-question__detail">Option A : ${formatValue(valueA, unitA.unit)}</p>
        <p class="measure-question__detail">Option B : ${formatValue(valueB, unitB.unit)}</p>
        <p class="measure-question__main">${mainQuestion}</p>
      </div>
    `;
    let answer;
    if (Math.abs(baseA - baseB) < 0.0001){
      answer = 'Ils sont egaux';
    } else {
      answer = baseA > baseB ? 'Option A' : 'Option B';
    }
    const options = shuffle(['Option A', 'Option B', 'Ils sont egaux', 'Impossible a comparer']);
    return { prompt, answer, options };
  }

  function buildUnitChoiceQuestion(level){
    const available = UNIT_SCENARIOS.filter(item => level >= item.minLevel);
    const scenario = randomFrom(available);
    const prompt = `
      <div class="measure-question measure-question--unit">
        <p class="measure-question__intro">Choix de l unite.</p>
        <p class="measure-question__detail">${scenario.text}</p>
        <p class="measure-question__main">Quelle unite est la plus adaptee ?</p>
      </div>
    `;
    const optionsSet = new Set([scenario.answer, ...scenario.distractors]);
    const allUnits = Object.values(UNIT_GROUPS).flat().map(u => u.unit);
    while (optionsSet.size < 4){
      optionsSet.add(randomFrom(allUnits));
    }
    const options = shuffle(Array.from(optionsSet).slice(0, 4));
    return { prompt, answer: scenario.answer, options };
  }

  function buildAdditionQuestion(level){
    const type = randomFrom(level >= 7 ? Object.keys(UNIT_GROUPS) : ['length', 'capacity']);
    const pool = UNIT_GROUPS[type];
    const unitA = pool[rand(0, pool.length - 1)];
    const unitB = pool[rand(0, pool.length - 1)];
    const target = pool[rand(0, pool.length - 1)];
    const baseCap = level >= 8 ? 3000 : 1500;
    const baseValueA = rand(100, baseCap);
    const baseValueB = rand(100, baseCap);
    const valueA = +(baseValueA / unitA.toBase).toFixed(2);
    const valueB = +(baseValueB / unitB.toBase).toFixed(2);
    const totalBase = baseValueA + baseValueB;
    const answerValue = totalBase / target.toBase;
    const prompt = `
      <div class="measure-question measure-question--mix">
        <p class="measure-question__intro">Recette magique.</p>
        <p class="measure-question__detail">On combine ${formatValue(valueA, unitA.unit)} et ${formatValue(valueB, unitB.unit)}.</p>
        <p class="measure-question__main">Quel total en ${target.unit} ?</p>
      </div>
    `;
    const distractors = generateNumericDistractors(answerValue);
    return withNumericOptions(prompt, answerValue, target.unit, distractors);
  }

  function start(context){
    const idx = Math.max(0, Math.min(LEVELS.length, context.currentLevel) - 1);
    const levelData = LEVELS[idx];
    const questions = Array.from({ length: levelData.questions }, () => build(levelData.level));
    if (window.MCQEngine){
      window.MCQEngine.start(context, {
        title: `Niveau ${levelData.level} - Mesures Magiques`,
        questions,
        reward: levelData.reward
      });
      return;
    }
    const state = { index: 0, level: levelData, questions };
    render(context, state);
  }

  function render(context, state){
    context.content.innerHTML = '';
    const shell = div('game-shell metric-mastery');
    const header = div('game-shell__header');
    header.innerHTML = `
      <span class="game-shell__icon">📏</span>
      <div class="game-shell__titles">
        <span class="game-shell__subtitle">Mesures Magiques</span>
        <span class="game-shell__level">Niveau ${state.level.level}</span>
      </div>
    `;
    shell.appendChild(header);
    const container = div('puzzle-question-container measure-question-area');
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
    const grid = div('puzzle-options measure-options');
    q.options.forEach(option => {
      const button = btn(option);
      button.dataset.value = option;
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
      context.showSuccessMessage('Bravo ! Mesures maitrisees !');
      context.showConfetti();
      setTimeout(() => context.showLevelMenu(), 1200);
    } else {
      const container = context.content.querySelector('.measure-question-area');
      if (container){
        showQuestion(context, state, container);
      }
    }
  }

  function withNumericOptions(prompt, answerValue, unit, extraCandidates){
    const values = new Set([Number(answerValue), ...((extraCandidates || []).map(Number))]);
    while (values.size < 4){
      const deltaBase = Math.max(0.1, Math.abs(answerValue) * 0.25);
      const noise = (Math.random() * 0.6 + 0.2) * deltaBase;
      const direction = Math.random() < 0.5 ? -1 : 1;
      const candidate = Math.max(0.01, Number((answerValue + direction * noise).toFixed(3)));
      values.add(candidate);
    }
    const optionValues = shuffle(Array.from(values)).slice(0, 4);
    const options = optionValues.map(value => formatValue(value, unit));
    const answer = formatValue(answerValue, unit);
    return { prompt, answer, options };
  }

  function generateNumericDistractors(answer){
    const base = Math.max(1, Math.abs(answer));
    return [
      Number(Math.max(0.01, answer + base * 0.1).toFixed(3)),
      Number(Math.max(0.01, answer - base * 0.1).toFixed(3)),
      Number(Math.max(0.01, answer + base * 0.25).toFixed(3))
    ];
  }

  function formatValue(value, unit){
    return `${formatNumber(value)} ${unit}`;
  }

  function formatNumber(value){
    const rounded = Math.round(value * 1000) / 1000;
    if (Number.isInteger(rounded)){
      return `${rounded}`;
    }
    if (Math.abs(rounded) >= 10){
      return rounded.toFixed(1).replace(/\.0$/, '');
    }
    if (Math.abs(rounded) >= 1){
      return rounded.toFixed(2).replace(/0$/, '').replace(/\.0$/, '');
    }
    return rounded.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
  }

  function convertValue(value, fromUnit, toUnit){
    const inBase = value * fromUnit.toBase;
    return inBase / toUnit.toBase;
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

  function randomFrom(array){
    return array[rand(0, array.length - 1)];
  }

  window.mesuresMagiquesGame = { start, getLevelCount: () => LEVELS.length };
})();
