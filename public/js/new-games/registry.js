;(function () {
  'use strict';

  function createRng(seed) {
    let value = seed % 2147483647;
    if (value <= 0) value += 2147483646;
    return () => {
      value = (value * 16807) % 2147483647;
      return (value - 1) / 2147483646;
    };
  }

  function shuffle(list, rng) {
    const arr = list.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function range(start, end, step = 1) {
    const out = [];
    for (let i = start; i <= end; i += step) out.push(i);
    return out;
  }

  function buildOptions(correct, pool, rng, size = 4) {
    const unique = new Set([correct]);
    const options = [correct];
    while (options.length < size && pool.length) {
      const pick = pool[Math.floor(rng() * pool.length)];
      if (!unique.has(pick)) {
        unique.add(pick);
        options.push(pick);
      }
    }
    return shuffle(options, rng);
  }

  function makeLevels(levelCount, exercisesPerLevel, buildFn) {
    return Array.from({ length: levelCount }, (_, levelIndex) => {
      const level = levelIndex + 1;
      const exercises = buildFn(level, exercisesPerLevel);
      return { level, exercises };
    });
  }

  function buildNumberLevels(level, count) {
    const rng = createRng(1000 + level * 11);
    const max = level <= 2 ? 20 : level <= 4 ? 40 : level <= 6 ? 60 : level <= 8 ? 80 : 120;
    const targets = [];
    while (targets.length < count) {
      const target = Math.max(6, Math.floor(rng() * max) + 1);
      targets.push(target);
    }
    return targets.map((target, index) => ({
      id: `build-${level}-${index + 1}`,
      type: 'build',
      target,
      tutorial: level === 1 && index === 0,
      promptKey: 'buildNumberPrompt',
      hintKey: level <= 3 ? 'buildNumberHintEasy' : level <= 6 ? 'buildNumberHintMid' : 'buildNumberHintHard'
    }));
  }

  function subtractTransformLevels(level, count) {
    const rng = createRng(2000 + level * 13);
    const max = level <= 3 ? 30 : level <= 6 ? 60 : level <= 8 ? 90 : 120;
    const exercises = [];
    for (let i = 0; i < count; i++) {
      const minuend = Math.max(12, Math.floor(rng() * max) + 10);
      const sub = Math.max(2, Math.floor(rng() * Math.min(20, level * 5 + 6)) + 1);
      const target = minuend - sub;
      exercises.push({
        id: `sub-${level}-${i + 1}`,
        type: 'subtract',
        minuend,
        subtrahend: sub,
        target,
        promptKey: 'subtractTransformPrompt',
        hintKey: 'subtractTransformHint'
      });
    }
    return exercises;
  }

  function halfGameLevels(level, count) {
    const rng = createRng(3000 + level * 17);
    let max = 20;
    if (level === 2) max = 50;
    if (level === 3) max = 90;
    if (level === 4) max = 100;
    if (level >= 5) max = 120;
    const pool = range(2, max, 2);
    return Array.from({ length: count }, (_, i) => {
      const value = pool[Math.floor(rng() * pool.length)];
      const correct = value / 2;
      const options = buildOptions(correct, range(1, Math.max(10, Math.floor(max / 2) + 5)), rng, 4);
      return {
        id: `half-${level}-${i + 1}`,
        type: 'chips',
        promptKey: level >= 9 ? 'halfGamePromptStory' : 'halfGamePrompt',
        promptParams: level >= 9 ? { total: value } : { value },
        answer: correct,
        options,
        hintKey: level <= 2 ? 'halfGameHintEasy' : 'halfGameHint'
      };
    });
  }

  function placeValueLevels(level, count) {
    const rng = createRng(4000 + level * 19);
    const exercises = [];
    for (let i = 0; i < count; i++) {
      if (level <= 4 || (level % 2 === 0 && i % 2 === 0)) {
        const tens = Math.floor(rng() * (level <= 3 ? 6 : 9)) + 1;
        const ones = Math.floor(rng() * 10);
        const number = tens * 10 + ones;
        const options = buildOptions(number, range(10, 99), rng, 4);
        exercises.push({
          id: `pv-${level}-${i + 1}`,
          type: 'chips',
          promptKey: 'placeValueComposePrompt',
          promptParams: { tens, ones },
          answer: number,
          options
        });
      } else {
        const number = Math.floor(rng() * 90) + 10;
        const tens = Math.floor(number / 10);
        const ones = number % 10;
        const correct = { key: 'placeValueDecomposeOption', params: { tens, ones } };
        const options = buildOptions(
          correct,
          [
            { key: 'placeValueDecomposeOption', params: { tens: tens + 1, ones: Math.max(0, ones - 1) } },
            { key: 'placeValueDecomposeOption', params: { tens: Math.max(0, tens - 1), ones: Math.min(9, ones + 2) } },
            { key: 'placeValueDecomposeOption', params: { tens, ones: ones + 1 } }
          ],
          rng,
          4
        );
        exercises.push({
          id: `pv-${level}-${i + 1}`,
          type: 'chips',
          promptKey: 'placeValueDecomposePrompt',
          promptParams: { number },
          answer: correct,
          options
        });
      }
    }
    return exercises;
  }

  function numberLineLevels(level, count) {
    const rng = createRng(5000 + level * 23);
    const stepOptions = level <= 2 ? [1] : level <= 4 ? [1, 2] : level <= 6 ? [2, 5] : level <= 8 ? [5, 10] : [1, 2, 5, 10];
    const exercises = [];
    for (let i = 0; i < count; i++) {
      const step = stepOptions[Math.floor(rng() * stepOptions.length)];
      const jumps = Math.floor(rng() * 4) + 2;
      const start = Math.floor(rng() * 30) + 5;
      const direction = rng() > 0.35 ? 1 : -1;
      const end = start + direction * step * jumps;
      const options = buildOptions(end, range(Math.min(start, end) - 10, Math.max(start, end) + 10), rng, 4);
      exercises.push({
        id: `nl-${level}-${i + 1}`,
        type: 'number-line',
        promptKey: direction === 1 ? 'numberLinePromptAdd' : 'numberLinePromptSub',
        promptParams: { start, step, jumps },
        answer: end,
        options,
        line: { start, end, step }
      });
    }
    return exercises;
  }

  function multDivFamiliesLevels(level, count) {
    const rng = createRng(6000 + level * 29);
    const exercises = [];
    for (let i = 0; i < count; i++) {
      const a = Math.floor(rng() * (level <= 3 ? 5 : 9)) + 2;
      const b = Math.floor(rng() * (level <= 3 ? 5 : 9)) + 2;
      const product = a * b;
      const correct = [
        `${a} × ${b} = ${product}`,
        `${b} × ${a} = ${product}`,
        `${product} ÷ ${a} = ${b}`
      ];
      const wrong1 = [
        `${a} × ${b} = ${product + a}`,
        `${b} × ${a} = ${product + b}`,
        `${product + a} ÷ ${a} = ${b}`
      ];
      const wrong2 = [
        `${a + 1} × ${b} = ${(a + 1) * b}`,
        `${b} × ${a + 1} = ${(a + 1) * b}`,
        `${(a + 1) * b} ÷ ${a + 1} = ${b}`
      ];
      const wrong3 = [
        `${a} × ${b} = ${product}`,
        `${product} ÷ ${b} = ${a}`,
        `${product} ÷ ${a} = ${b + 1}`
      ];
      const options = shuffle([correct, wrong1, wrong2, wrong3], rng).map((family) => family.join(' · '));
      const formattedOptions = shuffle(options, rng);
      exercises.push({
        id: `mf-${level}-${i + 1}`,
        type: 'chips',
        promptKey: 'multDivPrompt',
        promptParams: { a, b },
        answer: correct.join(' · '),
        options: formattedOptions
      });
    }
    return exercises;
  }

  function wordProblemLevels(level, count) {
    const rng = createRng(7000 + level * 31);
    const themes = [
      { key: 'wordProblemStickers', unit: 'stickers' },
      { key: 'wordProblemCandies', unit: 'candies' },
      { key: 'wordProblemCoins', unit: 'coins' }
    ];
    const exercises = [];
    for (let i = 0; i < count; i++) {
      const theme = themes[Math.floor(rng() * themes.length)];
      const a = Math.floor(rng() * (level <= 4 ? 10 : 20)) + 3;
      const b = Math.floor(rng() * (level <= 4 ? 8 : 15)) + 2;
      const op = rng() > 0.5 ? 'add' : 'sub';
      const answer = op === 'add' ? a + b : Math.max(1, a - b);
      const options = buildOptions(answer, range(1, 40), rng, 4);
      exercises.push({
        id: `wp-${level}-${i + 1}`,
        type: 'chips',
        promptKey: op === 'add' ? 'wordProblemPromptAdd' : 'wordProblemPromptSub',
        promptParams: { a, b, itemKey: theme.key },
        answer,
        options,
        hintKey: 'wordProblemHint'
      });
    }
    return exercises;
  }

  const games = [
    {
      id: 'build-number',
      titleKey: 'gameBuildNumberTitle',
      subtitleKey: 'gameBuildNumberSubtitle',
      exercisesPerLevel: 12,
      levels: makeLevels(10, 12, buildNumberLevels)
    },
    {
      id: 'subtract-transform',
      titleKey: 'gameSubtractTransformTitle',
      subtitleKey: 'gameSubtractTransformSubtitle',
      exercisesPerLevel: 12,
      levels: makeLevels(10, 12, subtractTransformLevels)
    },
    {
      id: 'half-game',
      titleKey: 'gameHalfTitle',
      subtitleKey: 'gameHalfSubtitle',
      exercisesPerLevel: 10,
      levels: makeLevels(10, 10, halfGameLevels)
    },
    {
      id: 'place-value',
      titleKey: 'gamePlaceValueTitle',
      subtitleKey: 'gamePlaceValueSubtitle',
      exercisesPerLevel: 10,
      levels: makeLevels(10, 10, placeValueLevels)
    },
    {
      id: 'number-line',
      titleKey: 'gameNumberLineTitle',
      subtitleKey: 'gameNumberLineSubtitle',
      exercisesPerLevel: 10,
      levels: makeLevels(10, 10, numberLineLevels)
    },
    {
      id: 'mult-div-families',
      titleKey: 'gameMultDivTitle',
      subtitleKey: 'gameMultDivSubtitle',
      exercisesPerLevel: 10,
      levels: makeLevels(10, 10, multDivFamiliesLevels)
    },
    {
      id: 'word-problems',
      titleKey: 'gameWordProblemsTitle',
      subtitleKey: 'gameWordProblemsSubtitle',
      exercisesPerLevel: 10,
      levels: makeLevels(10, 10, wordProblemLevels)
    }
  ];

  function getGame(id) {
    return games.find(game => game.id === id) || null;
  }

  window.newGamesRegistry = {
    games,
    getGame
  };
})();
