(function () {
    'use strict';

    const LEVELS = [
        { mode: 'choice', groups: 2, itemsPerGroup: 3, item: '🍎', characters: ['👧', '👦'], question: 'Deux sachets contiennent 3 pommes chacun. Combien de pommes au total ?', options: [5, 6, 8], answer: 6, reward: { stars: 18, coins: 10 } },
        { mode: 'choice', groups: 3, itemsPerGroup: 4, item: '🖍', characters: ['👦', '👧', '🐸'], question: 'Trois boites ont 4 crayons chacune. Combien de crayons ?', options: [12, 14, 9], answer: 12, reward: { stars: 20, coins: 12 } },
        { mode: 'choice', groups: 4, itemsPerGroup: 2, item: '🎒', characters: ['👧', '👦', '👧', '🐸'], question: 'Quatre sacs contiennent 2 livres. Combien de livres ?', options: [6, 8, 10], answer: 8, reward: { stars: 20, coins: 12 } },
        { mode: 'choice', division: true, total: 12, groups: 3, item: '🍬', characters: ['👧', '👦', '🐸'], question: '12 bonbons sont partagés entre 3 amis. Combien chacun ?', options: [4, 3, 6], answer: 4, reward: { stars: 22, coins: 14 } },
        { mode: 'choice', division: true, total: 15, groups: 5, item: '🍓', characters: ['👦', '👧', '🐸', '👧', '👦'], question: '15 fraises pour 5 personnes. Combien chacun ?', options: [5, 4, 3], answer: 3, reward: { stars: 22, coins: 14 } },
        { mode: 'choice', division: true, total: 18, groups: 6, item: '🧃', characters: ['👧', '👦', '🐸', '👧', '👦', '🐸'], question: '18 jus répartis en 6 paniers. Combien par panier ?', options: [2, 4, 3], answer: 3, reward: { stars: 24, coins: 16 } },
        { mode: 'drag', total: 12, groups: 3, item: '🍬', characters: ['👦', '👧', '🐸'], prompt: 'Répartis 12 bonbons équitablement entre les amis.' , reward: { stars: 28, coins: 18 } },
        { mode: 'drag', total: 16, groups: 4, item: '🍎', characters: ['👧', '👦', '👧', '🐸'], prompt: 'Place les 16 pommes pour que chacun ait la même quantité.' , reward: { stars: 30, coins: 20 } },
        { mode: 'drag', total: 18, groups: 3, item: '🖍', characters: ['👦', '👧', '🐸'], prompt: 'Distribue 18 crayons équitablement.' , reward: { stars: 32, coins: 22 } },
        { mode: 'drag', total: 20, groups: 5, item: '🎒', characters: ['👧', '👦', '🐸', '👧', '👦'], prompt: '5 aventuriers partagent 20 objets. Répartis-les !' , reward: { stars: 35, coins: 24 } }
    ];

    function start(context) {
        const index = Math.max(0, Math.min(LEVELS.length, context.currentLevel) - 1);
        const levelData = LEVELS[index];
        const totalLevels = LEVELS.length;
        const displayLevel = context.currentLevel || index + 1;

        context.content.innerHTML = '';
        context.speakText('Distribue correctement les objets pour gagner des étoiles.');

        const wrapper = document.createElement('div');
        wrapper.className = 'repartis-wrapper';

        const progress = document.createElement('div');
        progress.className = 'repartis-progress';
        const progressTrack = document.createElement('div');
        progressTrack.className = 'repartis-progress-track';
        const progressFill = document.createElement('span');
        progressFill.className = 'repartis-progress-fill';
        progressFill.style.width = `${Math.min(100, (displayLevel / totalLevels) * 100)}%`;
        progressTrack.appendChild(progressFill);
        const progressLabel = document.createElement('span');
        progressLabel.className = 'repartis-progress-label';
        progressLabel.textContent = `Niveau ${displayLevel} / ${totalLevels}`;
        progress.appendChild(progressTrack);
        progress.appendChild(progressLabel);
        wrapper.appendChild(progress);

        const question = document.createElement('div');
        question.className = 'question-prompt fx-bounce-in-down';
        question.textContent = levelData.question || levelData.prompt;
        wrapper.appendChild(question);

        const feedbackBubble = document.createElement('div');
        feedbackBubble.className = 'repartis-feedback is-hidden';
        feedbackBubble.setAttribute('role', 'status');
        feedbackBubble.setAttribute('aria-live', 'polite');

        if (levelData.mode === 'choice') {
            renderChoiceMode(wrapper, levelData, context, feedbackBubble);
        } else {
            renderDragMode(wrapper, levelData, context, feedbackBubble);
        }

        context.content.appendChild(wrapper);
        context.configureBackButton('Retour aux niveaux', () => context.showLevelMenu());
    }

    function renderChoiceMode(wrapper, levelData, context, feedbackBubble) {
        const scene = document.createElement('div');
        scene.className = 'repartis-scene fx-bounce-in-down';

        if (levelData.division) {
            const totalDisplay = document.createElement('p');
            totalDisplay.className = 'repartis-bonus-text';
            totalDisplay.textContent = `${levelData.total} objets à partager entre ${levelData.groups} amis.`;
            scene.appendChild(totalDisplay);
            const itemsPool = document.createElement('div');
            itemsPool.className = 'repartis-items';
            for (let i = 0; i < levelData.total; i++) {
                const item = document.createElement('span');
                item.className = 'repartis-item';
                item.textContent = levelData.item;
                itemsPool.appendChild(item);
            }
            scene.appendChild(itemsPool);
        } else {
            const groupsContainer = document.createElement('div');
            groupsContainer.className = 'repartis-groups';
            for (let g = 0; g < levelData.groups; g++) {
                const group = document.createElement('div');
                group.className = 'repartis-group';
                const character = document.createElement('span');
                character.className = 'repartis-character';
                character.textContent = levelData.characters[g % levelData.characters.length];
                group.appendChild(character);
                const drop = document.createElement('div');
                drop.className = 'repartis-items';
                for (let i = 0; i < levelData.itemsPerGroup; i++) {
                    const item = document.createElement('span');
                    item.className = 'repartis-item';
                    item.textContent = levelData.item;
                    drop.appendChild(item);
                }
                group.appendChild(drop);
                groupsContainer.appendChild(group);
            }
            scene.appendChild(groupsContainer);
        }

        wrapper.appendChild(scene);
        wrapper.appendChild(feedbackBubble);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'repartis-options';
        levelData.options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'repartis-option-btn fx-bounce-in-down';
            btn.textContent = `${option}`;
            btn.addEventListener('click', () => {
                handleChoiceAnswer(btn, option === levelData.answer, levelData, context, optionsContainer, feedbackBubble);
            });
            optionsContainer.appendChild(btn);
        });
        wrapper.appendChild(optionsContainer);
    }

    function handleChoiceAnswer(button, isCorrect, levelData, context, container, feedbackBubble) {
        Array.from(container.children).forEach(btn => {
            btn.disabled = true;
        });
        if (isCorrect) {
            button.classList.add('correct');
            context.playPositiveSound();
            context.awardReward(levelData.reward.stars, levelData.reward.coins);
            context.markLevelCompleted();
            context.showSuccessMessage('Bravo !');
            context.showConfetti();
            showFeedbackBubble(feedbackBubble, 'positive', '✅ Bonne réponse !');
            setTimeout(() => context.showLevelMenu(), 1300);
        } else {
            context.playNegativeSound();
            context.awardReward(0, -5);
            context.showErrorMessage('Essaie encore !', 'Observe bien les groupes.');
            button.classList.add('wrong');
            showFeedbackBubble(feedbackBubble, 'negative', '❌ Regarde combien chaque groupe contient.');
            setTimeout(() => {
                button.classList.remove('wrong');
                Array.from(container.children).forEach(btn => {
                    btn.disabled = false;
                });
                hideFeedbackBubble(feedbackBubble);
            }, 1000);
        }
    }

    function renderDragMode(wrapper, levelData, context, feedbackBubble) {
        const scene = document.createElement('div');
        scene.className = 'repartis-scene fx-bounce-in-down';

        const expectedPerGroup = levelData.total / levelData.groups;

        const pool = document.createElement('div');
        pool.className = 'repartis-items';
        pool.dataset.zone = 'pool';
        for (let i = 0; i < levelData.total; i++) {
            const token = document.createElement('span');
            token.className = 'repartis-item';
            token.textContent = levelData.item;
            token.draggable = true;
            token.dataset.id = `token-${i}-${Date.now()}`;
            token.setAttribute('aria-hidden', 'true');
            enableDrag(token);
            pool.appendChild(token);
        }
        scene.appendChild(pool);

        const groupsContainer = document.createElement('div');
        groupsContainer.className = 'repartis-groups';
        const dropzones = [];
        const counters = [];
        for (let g = 0; g < levelData.groups; g++) {
            const group = document.createElement('div');
            group.className = 'repartis-group';
            const character = document.createElement('span');
            character.className = 'repartis-character';
            character.textContent = levelData.characters[g % levelData.characters.length];
            group.appendChild(character);
            const dropzone = document.createElement('div');
            dropzone.className = 'repartis-dropzone';
            dropzone.dataset.zone = `drop-${g}`;
            group.appendChild(dropzone);
            const counter = document.createElement('span');
            counter.className = 'repartis-counter';
            counter.setAttribute('aria-live', 'polite');
            counter.textContent = `0 / ${expectedPerGroup}`;
            group.appendChild(counter);
            groupsContainer.appendChild(group);
            dropzones.push(dropzone);
            counters.push(counter);
        }
        scene.appendChild(groupsContainer);

        const allZones = [pool, ...dropzones];
        allZones.forEach(zone => enableDropZone(zone, updateDistributionFeedback));

        const controls = document.createElement('div');
        controls.className = 'repartis-options';
        const verifyBtn = document.createElement('button');
        verifyBtn.className = 'repartis-action-btn fx-bounce-in-down';
        verifyBtn.textContent = 'Vérifier';
        controls.appendChild(verifyBtn);
        scene.appendChild(controls);

        wrapper.appendChild(scene);
        wrapper.appendChild(feedbackBubble);

        verifyBtn.addEventListener('click', () => {
            const expected = levelData.total / levelData.groups;
            let correct = true;
            dropzones.forEach(zone => {
                const parent = zone.closest('.repartis-group');
                if (parent) {
                    parent.classList.remove('needs-attention');
                }
                if (zone.querySelectorAll('.repartis-item').length !== expected) {
                    correct = false;
                    if (parent) {
                        parent.classList.add('needs-attention');
                    }
                }
            });
            if (correct) {
                verifyBtn.disabled = true;
                context.playPositiveSound();
                context.awardReward(levelData.reward.stars, levelData.reward.coins);
                context.markLevelCompleted();
                context.showSuccessMessage('Distribution parfaite !');
                context.showConfetti();
                showFeedbackBubble(feedbackBubble, 'positive', '✅ Bravo ! Chaque ami a la même quantité.');
                setTimeout(() => context.showLevelMenu(), 1400);
            } else {
                context.playNegativeSound();
                context.awardReward(0, -6);
                context.showErrorMessage('Essaie encore !', `Chaque ami doit avoir ${expected} objet(s).`);
                showFeedbackBubble(feedbackBubble, 'negative', `❌ Répartis ${expected} objet(s) dans chaque groupe.`);
            }
        });

        updateDistributionFeedback();

        function updateDistributionFeedback(activeZone) {
            const expected = expectedPerGroup;
            let totalPlaced = 0;
            dropzones.forEach((zone, index) => {
                const count = zone.querySelectorAll('.repartis-item').length;
                totalPlaced += count;
                const diff = expected - count;
                zone.classList.remove('is-balanced', 'needs-more', 'has-extra');
                const counter = counters[index];
                counter.classList.remove('is-balanced', 'needs-more', 'has-extra');
                counter.textContent = `${count} / ${expected}`;
                if (count === expected) {
                    zone.classList.add('is-balanced');
                    counter.classList.add('is-balanced');
                } else if (count < expected) {
                    zone.classList.add('needs-more');
                    counter.classList.add('needs-more');
                } else {
                    zone.classList.add('has-extra');
                    counter.classList.add('has-extra');
                }

                if (activeZone && zone === activeZone && zone.dataset.zone !== 'pool') {
                    if (diff === 0) {
                        showFeedbackBubble(feedbackBubble, 'positive', '✅ Ce groupe est équilibré !');
                    } else if (diff > 0) {
                        showFeedbackBubble(feedbackBubble, 'negative', `Ajoute ${diff} objet(s) ici.`);
                    } else {
                        showFeedbackBubble(feedbackBubble, 'negative', `Retire ${Math.abs(diff)} objet(s).`);
                    }
                }
            });

            const allPlaced = totalPlaced === levelData.total && pool.querySelectorAll('.repartis-item').length === 0;
            verifyBtn.disabled = !allPlaced;
        }
    }

    function enableDrag(token) {
        token.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', token.dataset.id);
            setTimeout(() => token.classList.add('dragging'), 0);
        });
        token.addEventListener('dragend', () => {
            token.classList.remove('dragging');
        });
    }

    function enableDropZone(zone, onDrop) {
        zone.addEventListener('dragenter', (event) => {
            event.preventDefault();
            if (zone.dataset.zone !== 'pool') {
                zone.classList.add('is-target');
                const parent = zone.closest('.repartis-group');
                if (parent) {
                    parent.classList.add('dragging-over');
                }
            }
        });
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('is-target');
            const parent = zone.closest('.repartis-group');
            if (parent) {
                parent.classList.remove('dragging-over');
            }
        });
        zone.addEventListener('dragover', (event) => {
            event.preventDefault();
        });
        zone.addEventListener('drop', (event) => {
            event.preventDefault();
            zone.classList.remove('is-target');
            const parent = zone.closest('.repartis-group');
            if (parent) {
                parent.classList.remove('dragging-over');
            }
            const id = event.dataTransfer.getData('text/plain');
            const token = document.querySelector(`[data-id="${id}"]`);
            if (token) {
                zone.appendChild(token);
                token.classList.add('repartis-item-pop');
                setTimeout(() => token.classList.remove('repartis-item-pop'), 320);
                if (typeof onDrop === 'function') {
                    onDrop(zone);
                }
            }
        });
    }

    function showFeedbackBubble(bubble, type, message) {
        if (!bubble) {
            return;
        }
        clearTimeout(bubble._timerId);
        bubble.textContent = message;
        bubble.classList.remove('is-hidden', 'is-positive', 'is-negative');
        bubble.classList.add(type === 'positive' ? 'is-positive' : 'is-negative');
        bubble._timerId = setTimeout(() => {
            hideFeedbackBubble(bubble);
        }, 2400);
    }

    function hideFeedbackBubble(bubble) {
        if (!bubble) {
            return;
        }
        clearTimeout(bubble._timerId);
        bubble.textContent = '';
        bubble.classList.add('is-hidden');
        bubble.classList.remove('is-positive', 'is-negative');
    }

    window.repartisGame = {
        start
    };
})();
