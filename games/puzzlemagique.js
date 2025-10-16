(function () {
    'use strict';

    const SYMBOL_MAP = { '+': '+', '-': '−', 'x': '×', '÷': '÷' };

    const PUZZLE_LEVELS = [
        { level: 1, operations: ['+'], range: [1, 5], count: 5, reward: { stars: 10, coins: 5 } },
        { level: 2, operations: ['+'], range: [3, 8], count: 5, reward: { stars: 12, coins: 6 } },
        { level: 3, operations: ['+'], range: [5, 12], count: 5, reward: { stars: 14, coins: 7 } },
        { level: 4, operations: ['+'], range: [1, 10], count: 5, unknown: true, reward: { stars: 15, coins: 8 } },
        { level: 5, operations: ['+'], range: [5, 15], count: 5, unknown: true, reward: { stars: 16, coins: 8 } },
        { level: 6, operations: ['-'], range: [5, 15], count: 5, reward: { stars: 18, coins: 9 } },
        { level: 7, operations: ['-'], range: [10, 25], count: 5, reward: { stars: 20, coins: 10 } },
        { level: 8, operations: ['-'], range: [10, 30], count: 5, unknown: true, reward: { stars: 22, coins: 11 } },
        { level: 9, operations: ['-'], range: [15, 40], count: 5, unknown: true, reward: { stars: 25, coins: 12 } },
        { level: 10, operations: ['-'], range: [20, 50], count: 5, unknown: true, reward: { stars: 30, coins: 15 } },
    ];

    function generateQuestion(levelData) {
        const op = levelData.operations[Math.floor(Math.random() * levelData.operations.length)];
        const [min, max] = levelData.range;
        let numbers = [];
        let answer;
        let questionText;

        if (op === '+') {
            // ➕ SUMAS de 3 a 5 términos
            const numTerms = randomInt(3, 5);
            do {
                numbers = Array.from({ length: numTerms }, () => randomInt(min, max));
            } while (numbers.reduce((a, b) => a + b, 0) > max * numTerms);

            const sum = numbers.reduce((a, b) => a + b, 0);

            if (levelData.unknown) {
                const unknownIndex = randomInt(0, numbers.length - 1);
                answer = numbers[unknownIndex];
                const display = numbers.map((num, idx) => idx === unknownIndex ? '?' : num).join(' + ');
                questionText = `${display} = ${sum}`;
            } else {
                answer = sum;
                questionText = `${numbers.join(' + ')} = ?`;
            }

        } else if (op === '-') {
            // ➖ RESTAS de 3 a 5 términos
            const numTerms = randomInt(3, 5);
            const subtrahends = Array.from({ length: numTerms - 1 }, () => randomInt(min, max));

            // Aseguramos que el primer número sea suficientemente grande
            const totalSubtract = subtrahends.reduce((a, b) => a + b, 0);
            const firstNumber = totalSubtract + randomInt(5, max);

            numbers = [firstNumber, ...subtrahends];
            const result = numbers.reduce((a, b) => a - b);

            if (levelData.unknown) {
                const unknownIndex = randomInt(0, numbers.length - 1);
                answer = numbers[unknownIndex];
                const display = numbers.map((num, idx) => idx === unknownIndex ? '?' : num).join(' − ');
                questionText = `${display} = ${result}`;
            } else {
                answer = result;
                questionText = `${numbers.join(' − ')} = ?`;
            }
        }

        // Opciones múltiples
        const options = new Set([answer]);
        while (options.size < 4) {
            const wrong = answer + randomInt(-10, 10);
            if (wrong !== answer && wrong >= 0) options.add(wrong);
        }

        return {
            questionText,
            options: shuffle(Array.from(options)),
            answer
        };
    }

    function start(context) {
        const levelIndex = Math.max(0, Math.min(PUZZLE_LEVELS.length, context.currentLevel) - 1);
        const levelData = PUZZLE_LEVELS[levelIndex];

        const questions = Array.from({ length: levelData.count }, () => generateQuestion(levelData));

        const state = {
            levelData,
            questions,
            currentIndex: 0,
        };

        renderScene(context, state);
    }

    function renderScene(context, state) {
        context.content.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.className = 'puzzle-wrapper';

        const title = document.createElement('div');
        title.className = 'question-prompt fx-bounce-in-down';
        title.textContent = `Niveau ${state.levelData.level} — Puzzle Magique`;
        wrapper.appendChild(title);

        const questionContainer = document.createElement('div');
        questionContainer.className = 'puzzle-question-container';
        wrapper.appendChild(questionContainer);

        context.content.appendChild(wrapper);

        context.configureBackButton('Retour aux niveaux', () => context.showLevelMenu());

        renderQuestion(context, state, questionContainer);
    }

    function renderQuestion(context, state, container) {
        container.innerHTML = '';
        const question = state.questions[state.currentIndex];

        const equation = document.createElement('div');
        equation.className = 'puzzle-equation';
        equation.innerHTML = question.questionText.replace('?', '<span class="puzzle-blank">?</span>');
        container.appendChild(equation);

        const optionsGrid = document.createElement('div');
        optionsGrid.className = 'puzzle-options';

        question.options.forEach((optionValue) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'puzzle-option-btn';
            btn.textContent = optionValue;
            btn.dataset.value = optionValue;
            btn.addEventListener('click', () => handleAnswer(context, state, btn, optionsGrid));
            optionsGrid.appendChild(btn);
        });

        container.appendChild(optionsGrid);
        context.speakText(question.questionText.replace('?', 'combien'));
    }

    function handleAnswer(context, state, button, grid) {
        const question = state.questions[state.currentIndex];
        const selectedValue = Number(button.dataset.value);

        Array.from(grid.children).forEach(btn => btn.disabled = true);

        if (selectedValue === question.answer) {
            button.classList.add('is-correct');
            context.playPositiveSound();
            context.awardReward(state.levelData.reward.stars, state.levelData.reward.coins);
            context.updateUI();
            setTimeout(() => nextQuestion(context, state), 1200);
        } else {
            button.classList.add('is-wrong');
            const correctButton = grid.querySelector(`[data-value="${question.answer}"]`);
            if (correctButton) correctButton.classList.add('is-correct');
            context.playNegativeSound();
            if (navigator.vibrate) navigator.vibrate(300);
            context.awardReward(0, -2);
            context.updateUI();
            setTimeout(() => nextQuestion(context, state), 1800);
        }
    }

    function nextQuestion(context, state) {
        state.currentIndex++;
        if (state.currentIndex >= state.questions.length) {
            finishLevel(context);
        } else {
            renderQuestion(context, state, context.content.querySelector('.puzzle-question-container'));
        }
    }

    function finishLevel(context) {
        context.markLevelCompleted();
        context.showSuccessMessage('✨ Super, tu as résolu tous les puzzles !');
        context.showConfetti();
        setTimeout(() => context.showLevelMenu(), 2000);
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    window.puzzleMagiqueGame = {
        start
    };
})();
