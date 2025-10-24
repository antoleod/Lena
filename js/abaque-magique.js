(function () {
    'use strict';

    const LEVELS = Array.from({ length: 12 }, (_, i) => {
        const level = i + 1;
        let range;
        if (level <= 3) range = [1, 9];
        else if (level <= 6) range = [10, 39];
        else if (level <= 9) range = [40, 99];
        else range = [100, 120];
        return { level, range, questions: 7 };
    });

    let context, gameState;

    function start(ctx) {
        context = ctx;
        const savedState = context.loadProgress?.() || {};
        gameState = {
            level: context.currentLevel || 1,
            questionIndex: 0,
            questions: [],
            beads: { dizaines: 0, unites: 0 },
            targetNumber: 0,
            hintLevel: 0,
            ...savedState
        };
        loadLevel(gameState.level);
    }

    function loadLevel(level) {
        gameState.level = level;
        gameState.questionIndex = 0;
        const levelData = LEVELS[level - 1] || LEVELS[0];
        gameState.questions = Array.from({ length: levelData.questions }, () =>
            randomInt(levelData.range[0], levelData.range[1])
        );
        loadQuestion();
    }

    function saveState() {
        context.saveProgress?.(gameState);
    }

    function loadQuestion() {
        if (gameState.questionIndex >= gameState.questions.length) {
            levelComplete();
            return;
        }
        gameState.targetNumber = gameState.questions[gameState.questionIndex];
        gameState.beads = { dizaines: 0, unites: 0 };
        gameState.hintLevel = 0;
        render();
    }

    function render() {
        context.content.innerHTML = '';
        context.content.className = 'content-container abaque-container-v2';

        const wrapper = document.createElement('div');
        wrapper.className = 'abaque-v2-wrapper fx-pop';
        wrapper.innerHTML = `
            <div class="abaque-v2-header">
                <p class="abaque-v2-progress">Question ${gameState.questionIndex + 1} / ${gameState.questions.length}</p>
                <p class="abaque-v2-target">Représente le nombre : <strong>${gameState.targetNumber}</strong></p>
            </div>
            <div class="abaque-v2-hud">
                <div class="hud-item">
                    <span class="hud-label">Dizaines</span>
                    <span class="hud-icon">⭐</span>
                </div>
                <div class="hud-item">
                    <span class="hud-label">Unités</span>
                    <span class="hud-icon">🦄</span>
                </div>
                <div class="hud-item hud-item--total">
                    <span class="hud-label">Total</span>
                    <span class="hud-value" id="hud-total">0 / ${gameState.targetNumber}</span>
                </div>
                <div class="hud-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                    <div class="hud-progress-bar__fill" id="hud-progress-fill"></div>
                </div>
            </div>
            <div class="abaque-v2-main">
                ${/* Asegura que la columna de decenas se muestre si el nivel puede alcanzar 10 o más */''}
                ${(LEVELS[gameState.level - 1]?.range[1] || 0) >= 10 ? createColumnHTML('dizaines') : ''}
                ${createColumnHTML('unites')}
            </div>
            <div class="abaque-v2-controls">
                <button class="abaque-v2-btn abaque-v2-btn--hint" aria-label="Donner un indice">💡 Indice</button>
                <button class="abaque-v2-btn abaque-v2-btn--check">Vérifier</button>
            </div>
        `;
        context.content.appendChild(wrapper);
        attachEventListeners();
        updateDisplay();
    }

    function createColumnHTML(type) {
        const label = type === 'dizaines' ? 'Dizaines' : 'Unités';
        return `
            <div class="abaque-v2-column" data-type="${type}">
                <div class="abaque-v2-beads-container"></div>
                <div class="abaque-v2-rod"></div>
                <span class="abaque-v2-label">${label}</span>
                <div class="abaque-v2-col-controls">
                    <button class="col-btn col-btn--add" data-action="add" data-type="${type}" aria-label="Ajouter une ${type}">+</button>
                    <button class="col-btn col-btn--remove" data-action="remove" data-type="${type}" aria-label="Retirer une ${type}">-</button>
                </div>
            </div>
        `;
    }

    function attachEventListeners() {
        document.querySelector('.abaque-v2-btn--check').addEventListener('click', checkAnswer);
        document.querySelector('.abaque-v2-btn--hint').addEventListener('click', showHint);

        document.querySelectorAll('.col-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                animateButtonPress(btn);
                const { action, type } = btn.dataset;
                if (action === 'add') addBead(type, btn); // Corregido: llamada única
                else removeBead(type);
            });
        });

        document.addEventListener('keydown', handleKeyboard);
        context.configureBackButton('Retour aux niveaux', () => {
            document.removeEventListener('keydown', handleKeyboard);
            context.showLevelMenu('abaque-magique');
        });
    }

    function handleKeyboard(e) {
        switch (e.key) {
            case 'ArrowRight': addBead('unites'); break;
            case 'ArrowLeft': removeBead('unites'); break;
            case 'ArrowUp': addBead('dizaines'); break;
            case 'ArrowDown': removeBead('dizaines'); break;
            case 'Enter': checkAnswer(); break;
        }
    }

    function addBead(type, btn) { // Corregido: definición única de la función
        const currentTotal = (gameState.beads.dizaines * 10) + gameState.beads.unites;
        if (currentTotal >= gameState.targetNumber) return;

        
        if (type === 'unites') {
            gameState.beads.unites++;
            // Si se alcanzan 10 unidades, activa la animación de conversión
            if (gameState.beads.unites === 10) {
                animateUnitToTenConversion();
                return; // La animación se encargará de actualizar el estado
            }
        } else if (type === 'dizaines') {
            gameState.beads.dizaines++;
        }

        context.playPositiveSound?.();
        updateDisplay();
    }

    function removeBead(type) {
        if (type === 'unites' && gameState.beads.unites > 0) {
            gameState.beads.unites--;
        } else if (type === 'dizaines' && gameState.beads.dizaines > 0) {
            gameState.beads.dizaines--;
        }
        context.playNegativeSound?.();
        updateDisplay();
    }

    function animateButtonPress(button) {
        button.classList.add('is-pressed');
        setTimeout(() => button.classList.remove('is-pressed'), 200);
    }

    function animateUnitToTenConversion() {
        const unitesColumn = document.querySelector('.abaque-v2-column[data-type="unites"]');
        const dizainesColumn = document.querySelector('.abaque-v2-column[data-type="dizaines"]');

        if (!unitesColumn || !dizainesColumn) {
            // Fallback si una columna no existe, realiza la conversión directamente
            gameState.beads.unites = 0;
            gameState.beads.dizaines++;
            updateDisplay();
            return;
        }

        // Aplica clases para la animación
        unitesColumn.classList.add('is-converting');
        dizainesColumn.classList.add('is-receiving');

        setTimeout(() => {
            gameState.beads.unites = 0;
            gameState.beads.dizaines++;
            updateDisplay(); // Actualiza el estado y la UI
            dizainesColumn.classList.remove('is-receiving'); // Limpia la clase
        }, 500); // Duración de la animación
    }

    function updateDisplay() {
        const { dizaines, unites } = gameState.beads;
        const currentTotal = (dizaines * 10) + unites;

        // Update HUD
        updateHudValue('hud-total', `${currentTotal} / ${gameState.targetNumber}`);

        // Update Progress Bar
        const progressPercent = (currentTotal / gameState.targetNumber) * 100;
        const progressBarFill = document.getElementById('hud-progress-fill');
        progressBarFill.style.width = `${Math.min(100, progressPercent)}%`;
        progressBarFill.parentElement.setAttribute('aria-valuenow', Math.round(progressPercent));

        // Render Beads
        renderColumnBeads('dizaines', dizaines);
        renderColumnBeads('unites', unites);
        saveState();
    }

    function renderColumnBeads(type, count) {
        const container = document.querySelector(`.abaque-v2-column[data-type="${type}"] .abaque-v2-beads-container`);
        if (!container) return;

        // Limpia la clase de conversión de las unidades cuando se redibuja
        if (type === 'unites') {
            container.parentElement.classList.remove('is-converting');
        }
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const bead = document.createElement('div');
            bead.className = `abaque-v2-bead abaque-v2-bead--${type}`;
            bead.style.animationDelay = `${i * 0.05}s`;
            container.appendChild(bead);
        }
    }

    function updateHudValue(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (element && element.textContent !== String(newValue)) {
            element.textContent = newValue;
            element.classList.add('fx-pop-small');
            setTimeout(() => element.classList.remove('fx-pop-small'), 200);
        }
    }

    function checkAnswer() {
        const userAnswer = (gameState.beads.dizaines * 10) + gameState.beads.unites;
        const correctAnswer = gameState.targetNumber;
        const wrapper = document.querySelector('.abaque-v2-wrapper');

        if (!isNaN(userAnswer) && userAnswer === correctAnswer) {
            context.awardReward(10, 5);
            window.ui.toast('Bravo ! ✅', 'success');
            wrapper.classList.add('correct');
            gameState.questionIndex++;
            document.removeEventListener('keydown', handleKeyboard);
            // Asegurarse de que el avance automático funcione
            setTimeout(() => {
                loadQuestion();
            }, 1500);
        } else {
            context.awardReward(0, -1);
            window.ui.toast('Presque… vérifie tes dizaines et unités.', 'error');
            wrapper.classList.add('incorrect');
            setTimeout(() => wrapper.classList.remove('incorrect'), 350);
        }
    }

    function showHint() {
        gameState.hintLevel++;
        const target = gameState.targetNumber;
        const d = Math.floor(target / 10);
        const u = target % 10;

        let msg = '';
        let highlightColumn = null;

        switch (gameState.hintLevel) {
            case 1:
                msg = 'Commence par faire des dizaines (10 unités = 1 dizaine).';
                highlightColumn = 'dizaines';
                break;
            case 2:
                if (d > 0) {
                    msg = `Le nombre ${target} a ${d} dizaine(s).`;
                    highlightColumn = 'dizaines';
                } else {
                    msg = `Le nombre ${target} a ${u} unité(s).`;
                    highlightColumn = 'unites';
                }
                break;
            case 3:
                msg = `Guide : ${d > 0 ? d + ' dizaine(s) et ' : ''}${u} unité(s).`;
                highlightColumn = 'unites';
                break;
            default:
                msg = `Solution : ${target} = ${d}D et ${u}U.`;
                gameState.hintLevel = 0; // Cycle hints
                break;
        }
        window.ui.toast(msg, 'hint');

        if (highlightColumn) {
            const colEl = document.querySelector(`.abaque-v2-column[data-type="${highlightColumn}"]`);
            if (colEl) {
                colEl.classList.add('highlight');
                setTimeout(() => colEl.classList.remove('highlight'), 1200);
            }
        }
    }

    function levelComplete() {
        context.markLevelCompleted();
        window.ui.toast(`Niveau ${gameState.level} terminé !`, 'success');
        if (gameState.level < LEVELS.length) {
            loadLevel(gameState.level + 1);
        } else {
            context.showSuccessMessage('Tu as terminé tous les niveaux de l\'abaque !');
            setTimeout(() => context.showLevelMenu('abaque-magique'), 2000);
        }
    }

    function getLevelCount() {
        return LEVELS.length;
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    window.abaqueMagiqueGame = {
        start,
        getLevelCount,
    };
})();