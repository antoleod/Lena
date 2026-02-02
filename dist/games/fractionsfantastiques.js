;(function(){
  'use strict';

  const LEVELS = Array.from({ length: 10 }, (_, i) => ({
    level: i + 1,
    count: 6,
    reward: { stars: 11 + i, coins: 5 + Math.floor(i / 2) }
  }));

  const QUESTION_BUILDERS = [
    { minLevel: 1, weight: 3, builder: buildVisualQuestion },
    { minLevel: 2, weight: 2, builder: buildWordScenarioQuestion },
    { minLevel: 4, weight: 2, builder: buildEquivalentQuestion },
    { minLevel: 5, weight: 2, builder: buildComparisonQuestion }
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

  function buildVisualQuestion(level){
    const denominator = pickDenominator(level);
    const numerator = rand(1, denominator - 1);
    const prompt = `
      <div class="fraction-question fraction-question--visual">
        <p class="fraction-question__intro">Pizza magique.</p>
        <div class="fraction-question__visual">${buildPizzaSVG(numerator, denominator)}</div>
        <p class="fraction-question__main">Quelle fraction est coloree ?</p>
      </div>
    `;
    const options = generateFractionOptions(numerator, denominator);
    const answer = formatFraction(numerator, denominator);
    return { prompt, answer, options };
  }

  function buildEquivalentQuestion(level){
    const denominator = pickDenominator(level + 1);
    const numerator = rand(1, denominator - 1);
    const base = simplifyFraction(numerator, denominator);
    const factor = rand(2, level >= 8 ? 5 : 4);
    const equivalent = { n: base.n * factor, d: base.d * factor };
    const prompt = `
      <div class="fraction-question fraction-question--equivalent">
        <p class="fraction-question__intro">Fractions equivalentes.</p>
        <p class="fraction-question__detail">Fraction de base : ${formatFraction(base.n, base.d)}</p>
        <p class="fraction-question__main">Quelle fraction est equivalente ?</p>
      </div>
    `;
    const options = generateEquivalentOptions(base, equivalent);
    const answer = formatFraction(equivalent.n, equivalent.d);
    return { prompt, answer, options };
  }

  function buildComparisonQuestion(level){
    const fractionA = randomSimplifiedFraction(level);
    let fractionB = randomSimplifiedFraction(level);
    let tries = 0;
    while (fractionToDecimal(fractionA) === fractionToDecimal(fractionB) && tries < 5){
      fractionB = randomSimplifiedFraction(level);
      tries++;
    }
    const prompt = `
      <div class="fraction-question fraction-question--compare">
        <p class="fraction-question__intro">Duel de fractions.</p>
        <p class="fraction-question__detail">Fraction A : ${formatFraction(fractionA.n, fractionA.d)}</p>
        <p class="fraction-question__detail">Fraction B : ${formatFraction(fractionB.n, fractionB.d)}</p>
        <p class="fraction-question__main">Quelle fraction est la plus grande ?</p>
      </div>
    `;
    const valueA = fractionToDecimal(fractionA);
    const valueB = fractionToDecimal(fractionB);
    let answer;
    if (Math.abs(valueA - valueB) < 0.0001){
      answer = 'Elles sont egales';
    } else {
      answer = valueA > valueB ? 'Fraction A' : 'Fraction B';
    }
    const options = shuffle(['Fraction A', 'Fraction B', 'Elles sont egales', 'Impossible a dire']);
    return { prompt, answer, options };
  }

  function buildWordScenarioQuestion(level){
    const denominator = pickDenominator(level);
    const numerator = rand(1, denominator - 1);
    const scenario = buildScenarioText(numerator, denominator);
    const prompt = `
      <div class="fraction-question fraction-question--story">
        <p class="fraction-question__intro">Fraction du quotidien.</p>
        <p class="fraction-question__detail">${scenario}</p>
        <p class="fraction-question__main">Quelle fraction correspond ?</p>
      </div>
    `;
    const options = generateFractionOptions(numerator, denominator);
    const answer = formatFraction(numerator, denominator);
    return { prompt, answer, options };
  }

  function start(context){
    const idx = Math.max(0, Math.min(LEVELS.length, context.currentLevel) - 1);
    const levelData = LEVELS[idx];
    const questions = Array.from({ length: levelData.count }, () => build(levelData.level));
    if (window.MCQEngine){
      window.MCQEngine.start(context, {
        title: `Niveau ${levelData.level} - Fractions Fantastiques`,
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
    const shell = div('game-shell fraction-magic');
    const header = div('game-shell__header');
    header.innerHTML = `
      <span class="game-shell__icon">🍕</span>
      <div class="game-shell__titles">
        <span class="game-shell__subtitle">Fractions Fantastiques</span>
        <span class="game-shell__level">Niveau ${state.level.level}</span>
      </div>
    `;
    shell.appendChild(header);
    const container = div('puzzle-question-container fraction-question-area');
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
    const grid = div('puzzle-options fraction-options');
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
      context.showSuccessMessage('Super ! Les fractions sont domtees !');
      context.showConfetti();
      setTimeout(() => context.showLevelMenu(), 1200);
    } else {
      const container = context.content.querySelector('.fraction-question-area');
      if (container){
        showQuestion(context, state, container);
      }
    }
  }

  function buildPizzaSVG(numerator, denominator){
    const radius = 42;
    const center = 50;
    const slices = Array.from({ length: denominator }, (_, index) => {
      const startAngle = (index / denominator) * Math.PI * 2 - Math.PI / 2;
      const endAngle = ((index + 1) / denominator) * Math.PI * 2 - Math.PI / 2;
      const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
      const startPoint = polarToCartesian(center, center, radius, startAngle);
      const endPoint = polarToCartesian(center, center, radius, endAngle);
      const fill = index < numerator ? '#ffb347' : '#fff4d6';
      return `<path d="M${center} ${center} L${startPoint.x} ${startPoint.y} A${radius} ${radius} 0 ${largeArc} 1 ${endPoint.x} ${endPoint.y} Z" fill="${fill}" stroke="#f08a24" stroke-width="1"/>`;
    }).join('');
    return `
      <svg viewBox="0 0 100 100" class="fraction-pizza">
        <circle cx="50" cy="50" r="49" fill="#f8db97" stroke="#d17b32" stroke-width="2"/>
        ${slices}
        <circle cx="50" cy="50" r="12" fill="#fef5dd" stroke="#d17b32" stroke-width="1"/>
      </svg>
    `;
  }

  function polarToCartesian(cx, cy, r, angle){
    return {
      x: (cx + r * Math.cos(angle)).toFixed(2),
      y: (cy + r * Math.sin(angle)).toFixed(2)
    };
  }

  function pickDenominator(level){
    if (level <= 2) return randomFrom([2, 3, 4]);
    if (level <= 4) return randomFrom([4, 6, 8]);
    if (level <= 7) return randomFrom([6, 8, 10, 12]);
    return randomFrom([8, 10, 12, 15]);
  }

  function generateFractionOptions(numerator, denominator){
    const target = formatFraction(numerator, denominator);
    const options = new Set([target]);
    while (options.size < 4){
      let altDen = Math.max(2, denominator + rand(-2, 2));
      if (altDen === denominator){
        altDen = Math.max(2, denominator + 1);
      }
      let altNum = rand(1, altDen - 1);
      if (altDen === denominator && altNum === numerator){
        altNum = Math.max(1, (numerator + 1) % altDen);
      }
      options.add(formatFraction(altNum, altDen));
    }
    return shuffle(Array.from(options));
  }

  function generateEquivalentOptions(base, equivalent){
    const answer = formatFraction(equivalent.n, equivalent.d);
    const options = new Set([answer]);
    const factors = [equivalent.d / base.d + 1, equivalent.d / base.d - 1, equivalent.d / base.d + 2];
    factors.forEach(factor => {
      const validFactor = Math.max(2, Math.abs(Math.round(factor)));
      const n = base.n * validFactor;
      const d = base.d * validFactor;
      options.add(formatFraction(n, d));
    });
    while (options.size < 4){
      const tweak = base.n + rand(-2, 2);
      const tweakDen = base.d + rand(1, 3);
      options.add(formatFraction(Math.max(1, tweak), Math.max(2, tweakDen)));
    }
    return shuffle(Array.from(options));
  }

  function randomSimplifiedFraction(level){
    const denominator = pickDenominator(level + 1);
    let numerator = rand(1, denominator - 1);
    const simplified = simplifyFraction(numerator, denominator);
    return { n: simplified.n, d: simplified.d };
  }

  function buildScenarioText(numerator, denominator){
    const templates = [
      `Une tarte est coupee en ${denominator} parts. Lena en mange ${numerator}.`,
      `Une equipe marque ${numerator} buts sur ${denominator} tentatives.`,
      `Un sac contient ${denominator} billes et ${numerator} sont rouges.`,
      `Un jardin est divise en ${denominator} zones et ${numerator} sont fleuries.`
    ];
    return randomFrom(templates);
  }

  function simplifyFraction(numerator, denominator){
    const divisor = gcd(numerator, denominator);
    return { numerator: numerator / divisor, denominator: denominator / divisor, n: numerator / divisor, d: denominator / divisor };
  }

  function formatFraction(numerator, denominator){
    return `${numerator}/${denominator}`;
  }

  function fractionToDecimal(fraction){
    return fraction.n / fraction.d;
  }

  function gcd(a, b){
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y){
      const temp = y;
      y = x % y;
      x = temp;
    }
    return x || 1;
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

  window.fractionsFantastiquesGame = { start, getLevelCount: () => LEVELS.length };
})();
