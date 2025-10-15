(function () {
    'use strict';

    const GAME_LEVELS = [
        { level: 1, title: 'Nombres jusqu\'à 30', range: [11, 30], item: '🍄' },
        { level: 2, title: 'Nombres jusqu\'à 60', range: [31, 60], item: '🎈' },
        { level: 3, title: 'Nombres jusqu\'à 99', range: [61, 99], item: '⚫' }
    ];

    let context, state;

    function start(ctx) {
        context = ctx;
        const levelIndex = Math.max(0, Math.min(GAME_LEVELS.length - 1, context.currentLevel - 1));
        const levelData = GAME_LEVELS[levelIndex];

        const numberToRepresent = randomInt(levelData.range[0], levelData.range[1]);
        const tens = Math.floor(numberToRepresent / 10);
        const units = numberToRepresent % 10;

        state = {
            levelData,
            numberToRepresent,
            tens,
            units
        };

        renderUI();
    }

    function renderUI() {
        context.content.innerHTML = '';
        context.content.className = 'content-container abaque-container';

        const wrapper = document.createElement('div');
        wrapper.className = 'abaque-wrapper fx-bounce-in-down';

        const title = document.createElement('h2');
        title.className = 'abaque-title';
        title.textContent = `Niveau ${state.levelData.level}: ${state.levelData.title}`;
        wrapper.appendChild(title);

        const prompt = document.createElement('p');
        prompt.className = 'abaque-prompt';
        prompt.textContent = `Observe les objets, puis écris le nombre de dizaines (D) et d'unités (U).`;
        wrapper.appendChild(prompt);

        const pool = document.createElement('div');
        pool.className = 'abaque-pool';
        for (let i = 0; i < state.numberToRepresent; i++) {
            const item = document.createElement('span');
            item.className = 'abaque-item';
            item.textContent = state.levelData.item;
            item.style.animationDelay = `${i * 0.02}s`;
            pool.appendChild(item);
        }
        wrapper.appendChild(pool);

        const answerArea = document.createElement('div');
        answerArea.className = 'abaque-answer-area';

        const tensInputWrapper = createInput('D', 'dizaines-input', 'Dizaines');
        const unitsInputWrapper = createInput('U', 'unites-input', 'Unités');

        answerArea.appendChild(tensInputWrapper);
        answerArea.appendChild(unitsInputWrapper);
        wrapper.appendChild(answerArea);

        const controls = document.createElement('div');
        controls.className = 'abaque-controls';
        const validateBtn = document.createElement('button');
        validateBtn.id = 'abaque-validate-btn';
        validateBtn.className = 'abaque-btn';
        validateBtn.textContent = 'Vérifier';
        controls.appendChild(validateBtn);
        wrapper.appendChild(controls);

        context.content.appendChild(wrapper);
        context.configureBackButton('Retour aux niveaux', () => context.showLevelMenu());

        validateBtn.addEventListener('click', handleValidation);
    }

    function createInput(labelText, id, ariaLabel) {
        const wrapper = document.createElement('div');
        wrapper.className = 'abaque-input-wrapper';
        const label = document.createElement('label');
        label.className = 'abaque-input-label';
        label.setAttribute('for', id);
        label.textContent = labelText;
        const input = document.createElement('input');
        input.type = 'number';
        input.id = id;
        input.className = 'abaque-input';
        input.setAttribute('aria-label', ariaLabel);
        input.setAttribute('min', '0');
        input.setAttribute('max', '9');
        wrapper.appendChild(label);
        wrapper.appendChild(input);
        return wrapper;
    }

    function handleValidation() {
        const tensInput = document.getElementById('dizaines-input');
        const unitsInput = document.getElementById('unites-input');
        const tensValue = parseInt(tensInput.value, 10);
        const unitsValue = parseInt(unitsInput.value, 10);

        const isTensCorrect = tensValue === state.tens;
        const isUnitsCorrect = unitsValue === state.units;

        tensInput.classList.toggle('correct', isTensCorrect);
        tensInput.classList.toggle('incorrect', !isTensCorrect);
        unitsInput.classList.toggle('correct', isUnitsCorrect);
        unitsInput.classList.toggle('incorrect', !isUnitsCorrect);

        if (isTensCorrect && isUnitsCorrect) {
            context.playPositiveSound();
            context.showSuccessMessage(`Bravo, c'est bien ${state.numberToRepresent} !`);
            context.awardReward(15, 8);
            context.markLevelCompleted();
            context.showConfetti();
            document.getElementById('abaque-validate-btn').disabled = true;
            setTimeout(() => {
                if (context.currentLevel < GAME_LEVELS.length) {
                    context.setCurrentLevel(context.currentLevel + 1);
                    start(context);
                } else {
                    context.showLevelMenu();
                }
            }, 1800);
        } else {
            context.playNegativeSound();
            context.showErrorMessage('Essaie encore !', `Regroupe les objets par paquets de 10.`);
            context.awardReward(0, -2);
        }
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    window.abaqueMagiqueGame = {
        start
    };

})();