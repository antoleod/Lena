(function () {
    'use strict';

    const THEME_CLASSES = ['puzzle-theme-forest', 'puzzle-theme-castle', 'puzzle-theme-sky'];
    const SYMBOL_MAP = { '+': '+', '-': '−', 'x': '×', '÷': '÷' };

    const PUZZLE_LEVELS = [
        { size: 2, rows: [['+'], ['+']], cols: [['+'], ['-']], solution: [[2, 3], [4, 1]] },
        { size: 2, rows: [['-'], ['+']], cols: [['-'], ['+']], solution: [[6, 2], [5, 3]] },
        { size: 2, rows: [['-'], ['+']], cols: [['+'], ['+']], solution: [[5, 1], [2, 4]] },
        { size: 3, rows: [['+', '+'], ['x', '+'], ['+', '-']], cols: [['+', '+'], ['x', '+'], ['-', '+']], solution: [[1, 2, 3], [3, 2, 1], [2, 3, 4]] },
        { size: 3, rows: [['÷', '+'], ['+', 'x'], ['x', '-']], cols: [['-', '+'], ['+', '-'], ['+', '+']], solution: [[4, 2, 1], [3, 3, 2], [2, 4, 2]] },
        { size: 3, rows: [['x', '-'], ['÷', '+'], ['+', '÷']], cols: [['+', '-'], ['-', '+'], ['+', '+']], solution: [[2, 4, 2], [6, 3, 3], [3, 6, 3]] },
        { size: 4, rows: [['÷', '+', '+'], ['÷', '+', '-'], ['÷', '+', '+'], ['÷', '+', '-']], cols: [['-', '+', '+'], ['+', '-', '+'], ['+', '-', '+'], ['+', '+', '+']], solution: [[8, 4, 2, 1], [6, 3, 3, 3], [4, 2, 2, 2], [12, 6, 3, 3]] },
        { size: 4, rows: [['÷', '+', '-'], ['÷', '+', '+'], ['÷', 'x', '-'], ['÷', '+', '-']], cols: [['-', '+', '+'], ['+', '-', '+'], ['-', '+', 'x'], ['+', '-', '+']], solution: [[9, 3, 6, 2], [8, 4, 2, 4], [6, 3, 3, 6], [12, 4, 2, 2]] },
        { size: 4, rows: [['÷', '+', '-'], ['÷', '+', '+'], ['÷', '+', '-'], ['÷', '+', '-']], cols: [['-', '+', '+'], ['+', '÷', '+'], ['+', '-', '+'], ['+', '-', '+']], solution: [[10, 5, 5, 2], [9, 3, 3, 3], [8, 4, 4, 4], [12, 6, 6, 3]] },
        { size: 4, rows: [['÷', '+', '-'], ['÷', '+', '-'], ['÷', 'x', '-'], ['÷', '+', '-']], cols: [['-', '+', '-'], ['+', '-', '+'], ['+', '+', '-'], ['+', '+', '-']], solution: [[18, 6, 3, 3], [12, 4, 4, 2], [16, 8, 4, 4], [24, 6, 3, 3]] }
    ];

    function computeTarget(values, operators) {
        let total = values[0];
        for (let i = 0; i < operators.length; i++) {
            const op = operators[i];
            const next = values[i + 1];
            if (op === '+') {
                total = total + next;
            } else if (op === '-') {
                total = total - next;
            } else if (op === 'x') {
                total = total * next;
            } else if (op === '÷') {
                total = total / next;
            }
        }
        return Math.round((total + Number.EPSILON) * 100) / 100;
    }

    function buildHintText(operators, result) {
        const blanks = operators.length + 1;
        const parts = [];
        for (let i = 0; i < blanks; i++) {
            parts.push('?');
            if (operators[i]) {
                parts.push(` ${SYMBOL_MAP[operators[i]]} `);
            }
        }
        return `${parts.join('')} = ${result}`;
    }

    function start(context) {
        const levelIndex = Math.max(0, Math.min(PUZZLE_LEVELS.length, context.currentLevel) - 1);
        const puzzle = PUZZLE_LEVELS[levelIndex];
        const themeClass = context.currentLevel <= 3 ? THEME_CLASSES[0] : (context.currentLevel <= 6 ? THEME_CLASSES[1] : THEME_CLASSES[2]);

        context.clearGameClasses(THEME_CLASSES);
        context.content.classList.add(themeClass);
        context.content.innerHTML = '';

        context.speakText("Complète la grille magique pour que les opérations soient correctes.");

        const wrapper = document.createElement('div');
        wrapper.className = 'puzzle-wrapper';

        const title = document.createElement('div');
        title.className = 'question-prompt fx-bounce-in-down';
        title.textContent = `Niveau ${context.currentLevel} — Résous le Puzzle Magique`;
        wrapper.appendChild(title);

        const tutorialText = document.createElement('p');
        tutorialText.className = 'puzzle-tutorial';
        tutorialText.textContent = 'Complète la grille avec les bons nombres pour que chaque ligne et chaque colonne donne le bon résultat.';
        wrapper.appendChild(tutorialText);

        const grid = document.createElement('div');
        grid.className = 'puzzle-grid';
        grid.style.setProperty('--puzzle-size', puzzle.size);

        const inputs = [];
        const statusIcons = [];
        const rowHintCards = [];
        const columnHintCards = [];
        let feedbackTimeout;
        for (let r = 0; r < puzzle.size; r++) {
            inputs[r] = [];
            statusIcons[r] = [];
            for (let c = 0; c < puzzle.size; c++) {
                const cell = document.createElement('div');
                cell.className = 'puzzle-cell';
                const input = document.createElement('input');
                input.type = 'number';
                input.className = 'puzzle-input';
                input.setAttribute('aria-label', `Cellule ${r + 1}-${c + 1}`);
                 input.classList.add('awaiting');
                cell.appendChild(input);
                const icon = document.createElement('span');
                icon.className = 'puzzle-status-icon';
                icon.setAttribute('aria-hidden', 'true');
                cell.appendChild(icon);
                grid.appendChild(cell);
                inputs[r][c] = input;
                statusIcons[r][c] = icon;
                input.addEventListener('input', () => handleCellInput(r, c));
                input.addEventListener('focus', () => setCellFeedback(r, c, 'pending'));
            }
        }
        wrapper.appendChild(grid);

        const rowHintsContainer = document.createElement('div');
        rowHintsContainer.className = 'puzzle-hints';
        for (let r = 0; r < puzzle.size; r++) {
            const values = puzzle.solution[r];
            const operators = puzzle.rows[r];
            const target = computeTarget(values, operators);
            const card = document.createElement('div');
            card.className = 'puzzle-hint-card';
            card.textContent = `Ligne ${r + 1}: ${buildHintText(operators, target)}`;
            rowHintsContainer.appendChild(card);
            rowHintCards[r] = card;
        }
        wrapper.appendChild(rowHintsContainer);

        const columnHintsWrapper = document.createElement('div');
        columnHintsWrapper.className = 'puzzle-hints puzzle-hints-columns';
        for (let c = 0; c < puzzle.size; c++) {
            const columnValues = [];
            for (let r = 0; r < puzzle.size; r++) {
                columnValues.push(puzzle.solution[r][c]);
            }
            const operators = puzzle.cols[c];
            const target = computeTarget(columnValues, operators);
            const card = document.createElement('div');
            card.className = 'puzzle-hint-card';
            const columnLetter = String.fromCharCode(65 + c);
            card.textContent = `Colonne ${columnLetter}: ${buildHintText(operators, target)}`;
            columnHintsWrapper.appendChild(card);
            columnHintCards[c] = card;
        }
        wrapper.appendChild(columnHintsWrapper);

        const instantFeedback = document.createElement('div');
        instantFeedback.className = 'puzzle-instant-feedback is-hidden';
        instantFeedback.setAttribute('role', 'status');
        instantFeedback.setAttribute('aria-live', 'polite');
        wrapper.appendChild(instantFeedback);

        const controls = document.createElement('div');
        controls.className = 'puzzle-controls';

        const helpBtn = document.createElement('button');
        helpBtn.className = 'puzzle-help-btn fx-bounce-in-down';
        helpBtn.textContent = '⭐ Aide magique';
        controls.appendChild(helpBtn);

        const validateBtn = document.createElement('button');
        validateBtn.className = 'submit-btn fx-bounce-in-down';
        validateBtn.textContent = 'Vérifier';
        controls.appendChild(validateBtn);

        wrapper.appendChild(controls);
        context.content.appendChild(wrapper);

        const goBack = () => {
            context.clearGameClasses(THEME_CLASSES);
            context.showLevelMenu();
        };
        context.configureBackButton('Retour aux niveaux', goBack);

        let helpUses = 0;

        helpBtn.addEventListener('click', () => {
            const nextCell = findNextEmptyOrWrong(inputs, puzzle.solution);
            if (!nextCell) {
                helpBtn.disabled = true;
                return;
            }
            const { row, col } = nextCell;
            const input = inputs[row][col];
            input.value = puzzle.solution[row][col];
            showSparkle(input.parentElement);
            handleCellInput(row, col, { silent: true });
            context.playPositiveSound();
            helpUses += 1;
            if (helpUses >= puzzle.size) {
                helpBtn.disabled = true;
            }
            showInstantFeedback('positive', '⭐ Indice magique révélé !');
        });

        validateBtn.addEventListener('click', () => {
            const result = validatePuzzle(inputs, puzzle.solution, setCellFeedback);
            refreshHintBadges();
            if (result.allCorrect) {
                validateBtn.disabled = true;
                helpBtn.disabled = true;
                context.playPositiveSound();
                context.awardReward(45, 25);
                context.markLevelCompleted();
                context.showSuccessMessage('✨ Bien joué, puzzle complété !');
                context.showConfetti();
                showInstantFeedback('positive', '🎉 Puzzle parfait !');
                setTimeout(() => {
                    goBack();
                }, 1800);
            } else {
                context.playNegativeSound();
                context.awardReward(0, -5);
                context.showErrorMessage('Essaie encore !', `Indices: ${result.remaining} cases à vérifier`);
                showInstantFeedback('negative', `❌ Il reste ${result.remaining} case(s) à vérifier.`);
            }
        });

        refreshHintBadges();
        hideInstantFeedback();

        function handleCellInput(row, col, options = {}) {
            const { silent = false } = options;
            const inputEl = inputs[row][col];
            const rawValue = inputEl.value.trim();
            if (!rawValue) {
                setCellFeedback(row, col, 'empty');
                if (!silent) {
                    hideInstantFeedback();
                }
                refreshHintBadges();
                return;
            }

            const value = Number(rawValue);
            if (!Number.isFinite(value)) {
                setCellFeedback(row, col, 'wrong');
                if (!silent) {
                    showInstantFeedback('negative', '❌ Oups, utilise des nombres.');
                }
                refreshHintBadges();
                return;
            }

            if (value === puzzle.solution[row][col]) {
                setCellFeedback(row, col, 'correct');
                if (!silent) {
                    showInstantFeedback('positive', '✅ Bravo !');
                }
            } else {
                setCellFeedback(row, col, 'wrong');
                if (!silent) {
                    showInstantFeedback('negative', '❌ Oups, vérifie cette case.');
                }
            }

            refreshHintBadges();
            if (areAllCellsCorrect()) {
                showInstantFeedback('positive', '✨ Tout est prêt ! Appuie sur Vérifier.');
            }
        }

        function setCellFeedback(row, col, status) {
            const inputEl = inputs[row][col];
            const icon = statusIcons[row][col];
            inputEl.classList.remove('correct', 'wrong');
            if (status !== 'pending' && status !== 'empty') {
                inputEl.classList.remove('awaiting');
            }
            icon.textContent = '';
            icon.classList.remove('is-correct', 'is-wrong');

            if (status === 'correct') {
                inputEl.classList.add('correct');
                icon.textContent = '✅';
                icon.classList.add('is-correct');
            } else if (status === 'wrong') {
                inputEl.classList.add('wrong');
                icon.textContent = '❌';
                icon.classList.add('is-wrong');
            } else if (status === 'pending' || status === 'empty') {
                inputEl.classList.add('awaiting');
            }
        }

        function refreshHintBadges() {
            for (let r = 0; r < puzzle.size; r++) {
                const rowComplete = puzzle.solution[r].every((expected, c) => Number(inputs[r][c].value) === expected);
                if (rowHintCards[r]) {
                    rowHintCards[r].classList.toggle('complete', rowComplete);
                }
            }
            for (let c = 0; c < puzzle.size; c++) {
                let columnComplete = true;
                for (let r = 0; r < puzzle.size; r++) {
                    if (Number(inputs[r][c].value) !== puzzle.solution[r][c]) {
                        columnComplete = false;
                        break;
                    }
                }
                if (columnHintCards[c]) {
                    columnHintCards[c].classList.toggle('complete', columnComplete);
                }
            }
        }

        function areAllCellsCorrect() {
            for (let r = 0; r < puzzle.size; r++) {
                for (let c = 0; c < puzzle.size; c++) {
                    if (Number(inputs[r][c].value) !== puzzle.solution[r][c]) {
                        return false;
                    }
                }
            }
            return true;
        }

        function showInstantFeedback(type, message) {
            clearTimeout(feedbackTimeout);
            instantFeedback.textContent = message;
            instantFeedback.classList.remove('is-hidden', 'is-positive', 'is-negative');
            instantFeedback.classList.add(type === 'positive' ? 'is-positive' : 'is-negative');
            feedbackTimeout = window.setTimeout(() => {
                hideInstantFeedback();
            }, 2600);
        }

        function hideInstantFeedback() {
            clearTimeout(feedbackTimeout);
            instantFeedback.textContent = '';
            instantFeedback.classList.add('is-hidden');
            instantFeedback.classList.remove('is-positive', 'is-negative');
        }
    }

    function validatePuzzle(inputs, solution, setFeedback) {
        let allCorrect = true;
        let remaining = 0;
        for (let r = 0; r < inputs.length; r++) {
            for (let c = 0; c < inputs[r].length; c++) {
                const input = inputs[r][c];
                const expected = solution[r][c];
                const value = Number(input.value);
                if (value === expected) {
                    if (setFeedback) {
                        setFeedback(r, c, 'correct');
                    }
                } else {
                    allCorrect = false;
                    remaining += 1;
                    if (setFeedback) {
                        if (input.value !== '') {
                            setFeedback(r, c, 'wrong');
                        } else {
                            setFeedback(r, c, 'empty');
                        }
                    }
                }
            }
        }
        return { allCorrect, remaining };
    }

    function findNextEmptyOrWrong(inputs, solution) {
        for (let r = 0; r < inputs.length; r++) {
            for (let c = 0; c < inputs[r].length; c++) {
                const input = inputs[r][c];
                const expected = solution[r][c];
                if (Number(input.value) !== expected) {
                    return { row: r, col: c };
                }
            }
        }
        return null;
    }

    function showSparkle(container) {
        const sparkle = document.createElement('span');
        sparkle.className = 'puzzle-sparkle';
        sparkle.textContent = '✨';
        container.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 900);
    }

    window.puzzleMagiqueGame = {
        start
    };
})();
