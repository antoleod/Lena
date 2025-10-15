(function () {
    'use strict';

    // --- Configuration des Niveaux ---
    const GAME_LEVELS = [
        { level: 1, range: [11, 20], item: '🍓', color: '#a0e1e1' },
        { level: 2, range: [21, 30], item: '⭐', color: '#caffbf' },
        { level: 3, range: [31, 40], item: '🍄', color: '#fdffb6' },
        { level: 4, range: [41, 50], item: '💎', color: '#9bf6ff' },
        { level: 5, range: [51, 60], item: '🎈', color: '#a0c4ff' },
        { level: 6, range: [61, 70], item: '🍎', color: '#bdb2ff' },
        { level: 7, range: [71, 80], item: '🪙', color: '#ffc6ff' },
        { level: 8, range: [81, 90], item: '🌸', color: '#ffadad' },
        { level: 9, range: [91, 99], item: '☀️', color: '#ffd6a5' },
        { level: 10, range: [11, 99], item: '🦄', color: '#fde4ff' } // Niveau final, mélange
    ];
    const EXERCISES_PER_LEVEL = 6;

    let context, state;

    /**
     * Point d'entrée du jeu, appelé par juego.js
     * @param {object} ctx - Le contexte du jeu principal.
     */
    function start(ctx) {
        context = ctx;
        state = {
            currentLevel: 1,
            currentExercise: 0,
            exercises: [],
            totalCorrect: 0,
            useBlocks: true,
            iconIndex: 0,
        };
        startLevel(state.currentLevel);
    }

    /**
     * Prépare et lance un nouveau niveau.
     * @param {number} levelNumber - Le numéro du niveau à démarrer.
     */
    function startLevel(levelNumber) {
        const levelIndex = Math.max(0, Math.min(GAME_LEVELS.length - 1, levelNumber - 1));
        const levelData = GAME_LEVELS[levelIndex];

        state.currentLevel = levelNumber;
        state.currentExercise = 0;
        state.levelData = levelData;
        state.exercises = generateExercises(levelData.range, EXERCISES_PER_LEVEL);

        renderScene();
        renderExercise();
    }

    /**
     * Génère la structure principale de l'interface du jeu.
     */
    function renderScene() {
        context.content.innerHTML = '';
        context.content.className = 'content-container abaque-container';

        const wrapper = document.createElement('div');
        wrapper.className = 'abaque-wrapper fx-bounce-in-down';

        // Barre de progression
        const progress = document.createElement('div');
        progress.id = 'abaque-progress';
        progress.className = 'abaque-progress';
        wrapper.appendChild(progress);

        // Titre
        const title = document.createElement('h2');
        title.className = 'abaque-title';
        title.id = 'abaque-title';
        wrapper.appendChild(title);

        // Toolbar: mode toggle + icon select + legend
        const toolbar = document.createElement('div');
        toolbar.className = 'abaque-toolbar';
        const modeBtn = document.createElement('button');
        modeBtn.className = 'abaque-btn';
        modeBtn.type = 'button';
        modeBtn.textContent = state.useBlocks ? '🎨 Mode Emoji' : '🎨 Mode Blocs';
        modeBtn.addEventListener('click', () => {
            state.useBlocks = !state.useBlocks;
            modeBtn.textContent = state.useBlocks ? '🎨 Mode Emoji' : '🎨 Mode Blocs';
            renderExercise();
        });
        const iconSelect = document.createElement('select');
        iconSelect.className = 'abaque-select';
        ['🍄','⭐️','🍎'].forEach((icon, i) => {
            const opt = document.createElement('option');
            opt.value = String(i);
            opt.textContent = icon;
            if (i === state.iconIndex) opt.selected = true;
            iconSelect.appendChild(opt);
        });
        iconSelect.addEventListener('change', () => {
            state.iconIndex = parseInt(iconSelect.value, 10) || 0;
            if (!state.useBlocks) renderExercise();
        });
        const legend = document.createElement('div');
        legend.className = 'abaque-legend';
        legend.textContent = 'D = dizaines (blocs de 10) | U = unités (blocs individuels)';
        toolbar.append(modeBtn, iconSelect, legend);
        wrapper.appendChild(toolbar);

        // Consigne
        const prompt = document.createElement('p');
        prompt.className = 'abaque-prompt';
        prompt.textContent = `Observe les objets, puis écris le nombre de dizaines (D) et d'unités (U).`;
        wrapper.appendChild(prompt);

        // Zone des objets (manquante)
        const pool = document.createElement('div');
        pool.id = 'abaque-pool';
        pool.className = 'abaque-pool';
        wrapper.appendChild(pool);

        // Zone de réponse
        const answerArea = document.createElement('div');
        answerArea.className = 'abaque-answer-area';
        const tensInputWrapper = createInput('D', 'dizaines-input', 'Dizaines');
        const unitsInputWrapper = createInput('U', 'unites-input', 'Unités');
        answerArea.appendChild(tensInputWrapper);
        answerArea.appendChild(unitsInputWrapper);
        wrapper.appendChild(answerArea);

        // Boutons de contrôle
        const controls = document.createElement('div');
        controls.className = 'abaque-controls';
        const validateBtn = document.createElement('button');
        validateBtn.id = 'abaque-validate-btn';
        validateBtn.className = 'abaque-btn';
        validateBtn.textContent = 'Vérifier';
        validateBtn.addEventListener('click', handleValidation);
        controls.appendChild(validateBtn);

        const restartBtn = document.createElement('button');
        restartBtn.id = 'abaque-restart-btn';
        restartBtn.className = 'abaque-btn abaque-btn--secondary';
        restartBtn.textContent = '🔄 Recommencer';
        restartBtn.addEventListener('click', () => start(context));
        controls.appendChild(restartBtn);

        wrapper.appendChild(controls);

        context.content.appendChild(wrapper);
        context.configureBackButton('Retour aux jeux', () => context.goToTopics());
    }

    /**
     * Affiche un exercice spécifique.
     */
    function renderExercise() {
        const exercise = state.exercises[state.currentExercise];
        if (!exercise) return;

        // Mise à jour du fond et du titre
        document.body.style.backgroundColor = state.levelData.color;
        document.getElementById('abaque-title').textContent = `Niveau ${state.currentLevel}`;

        // Mise à jour de la barre de progression
        const progressEl = document.getElementById('abaque-progress');
        progressEl.textContent = `Exercice ${state.currentExercise + 1} / ${EXERCISES_PER_LEVEL} — Niveau ${state.currentLevel}`;

        // Affichage des objets groupés par dizaines
        const pool = document.getElementById('abaque-pool');
        pool.innerHTML = '';
        let totalItemsAnimated = 0;

        for (let i = 0; i < exercise.tens; i++) {
            const group = document.createElement('div');
            group.className = 'abaque-tens-group';
            for (let j = 0; j < 10; j++) {
                const item = document.createElement('span');
                item.className = 'abaque-item';
                item.textContent = state.levelData.item;
                item.style.animationDelay = `${totalItemsAnimated * 0.04}s`;
                group.appendChild(item);
                totalItemsAnimated++;
            }
            pool.appendChild(group);
        }

        if (exercise.units > 0) {
            const group = document.createElement('div');
            group.className = 'abaque-units-group';
            for (let i = 0; i < exercise.units; i++) {
                const item = document.createElement('span');
                item.className = 'abaque-item';
                item.textContent = state.levelData.item;
                item.style.animationDelay = `${totalItemsAnimated * 0.04}s`;
                group.appendChild(item);
                totalItemsAnimated++;
            }
            pool.appendChild(group);
        }

        // Réinitialisation des champs de saisie
        const tensInput = document.getElementById('dizaines-input');
        const unitsInput = document.getElementById('unites-input');
        tensInput.value = '';
        unitsInput.value = '';
        tensInput.classList.remove('correct', 'incorrect');
        unitsInput.classList.remove('correct', 'incorrect');
        document.getElementById('abaque-validate-btn').disabled = false;
        tensInput.focus();
    }

    /**
     * Crée un champ de saisie avec son label.
     */
    function createInput(labelText, id, ariaLabel) {
        const wrapper = document.createElement('div');
        wrapper.className = 'abaque-input-wrapper';
        const label = document.createElement('label');
        label.className = 'abaque-input-label';
        label.setAttribute('for', id);
        label.textContent = labelText;
        const input = document.createElement('input');
        input.type = 'tel'; // 'tel' pour un clavier numérique sur mobile
        input.id = id;
        input.className = 'abaque-input';
        input.setAttribute('aria-label', ariaLabel);
        input.setAttribute('pattern', '[0-9]*');
        input.setAttribute('maxlength', '1');
        wrapper.appendChild(label);
        wrapper.appendChild(input);
        return wrapper;
    }

    /**
     * Gère la validation de la réponse de l'utilisateur.
     */
    function handleValidation() {
        const tensInput = document.getElementById('dizaines-input');
        const unitsInput = document.getElementById('unites-input');
        const tensValue = parseInt(tensInput.value, 10);
        const unitsValue = parseInt(unitsInput.value, 10);

        const exercise = state.exercises[state.currentExercise];
        const isTensCorrect = tensValue === exercise.tens;
        const isUnitsCorrect = unitsValue === exercise.units;

        tensInput.classList.toggle('correct', isTensCorrect);
        tensInput.classList.toggle('incorrect', !isTensCorrect);
        unitsInput.classList.toggle('correct', isUnitsCorrect);
        unitsInput.classList.toggle('incorrect', !isUnitsCorrect);

        document.getElementById('abaque-validate-btn').disabled = true;

        if (isTensCorrect && isUnitsCorrect) {
            context.playPositiveSound();
            context.showSuccessMessage('Bravo !');
            context.awardReward(5, 3);
            context.showConfetti();
            const nextBtn = document.getElementById('abaque-next-btn');
            if (nextBtn) nextBtn.disabled = false;
        } else {
            context.playNegativeSound();
            context.showErrorMessage('Essaie encore !', 'Regroupe bien les objets par 10.');
            context.awardReward(0, -1);
            setTimeout(() => {
                document.getElementById('abaque-validate-btn').disabled = false;
            }, 1000);
        }
    }

    /**
     * Affiche l'écran de victoire final.
     */
    function showFinalVictory() {
        context.content.innerHTML = `
            <div class="abaque-wrapper fx-bounce-in-down">
                <h2 class="abaque-title">🎉 Félicitations !</h2>
                <p class="abaque-prompt" style="font-size: 1.5rem;">Tu maîtrises les nombres jusqu’à 100 !</p>
                <div class="abaque-controls">
                    <button id="abaque-restart-btn" class="abaque-btn">🔄 Recommencer</button>
                </div>
            </div>
        `;
        context.showConfetti();
        document.getElementById('abaque-restart-btn').addEventListener('click', () => start(context));
    }

    /**
     * Génère une liste d'exercices uniques pour un niveau.
     */
    function generateExercises(range, count) {
        const exercises = new Set();
        while (exercises.size < count) {
            const num = randomInt(range[0], range[1]);
            exercises.add(num);
        }
        return Array.from(exercises).map(num => ({
            number: num,
            tens: Math.floor(num / 10),
            units: num % 10
        }));
    }

    /**
     * Génère un entier aléatoire dans un intervalle.
     */
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    window.abaqueMagiqueGame = {
        start
    };
})();