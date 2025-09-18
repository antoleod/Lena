(function () {
    'use strict';

    const STORAGE_KEY = 'mathsLenaCustomDictation';
    const KEYBOARD_CHARACTERS = ['é', 'è', 'ê', 'à', 'ù', 'ç', 'ô'];

    const GUIDED_LEVELS = [
        { level: 1, entries: ['chat', 'lune', 'sac'], reward: { stars: 25, coins: 14 } },
        { level: 2, entries: ['maman', 'robot', 'piano'], reward: { stars: 26, coins: 15 } },
        { level: 3, entries: ['renard', 'miroir', 'magie'], reward: { stars: 27, coins: 16 } },
        { level: 4, entries: ['balle', 'lapin', 'tambour'], reward: { stars: 28, coins: 17 } },
        { level: 5, entries: ['lettre', 'puzzle', 'carotte'], reward: { stars: 29, coins: 18 } },
        { level: 6, entries: ['chanson', 'ventouse', 'ballon'], reward: { stars: 30, coins: 19 } },
        { level: 7, entries: ['La souris mange du pain.', 'Le chat saute dans la neige.'], reward: { stars: 32, coins: 20 } },
        { level: 8, entries: ['La lune brille très fort.', 'Le pirate trouve un trésor.'], reward: { stars: 33, coins: 21 } },
        { level: 9, entries: ['Les enfants chantent sous la pluie.', 'Un dragon vole dans le ciel.'], reward: { stars: 34, coins: 22 } },
        { level: 10, entries: ['La petite fée prépare une potion magique.', 'La licorne traverse la forêt lumineuse.'], reward: { stars: 36, coins: 24 } }
    ];

    function showRoot(context) {
        context.content.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.className = 'dictee-wrapper';

        const title = document.createElement('div');
        title.className = 'question-prompt fx-bounce-in-down';
        title.textContent = 'Choisis ton mode de dictée';
        wrapper.appendChild(title);

        const menu = document.createElement('div');
        menu.className = 'dictee-menu';

        const guidedBtn = document.createElement('button');
        guidedBtn.textContent = '🎧 Dictée Magique';
        guidedBtn.addEventListener('click', () => {
            if (typeof context.openLevelSelection === 'function') {
                context.openLevelSelection();
            }
        });
        menu.appendChild(guidedBtn);

        const hasCustom = Boolean(loadCustomDictation());
        const customPlayBtn = document.createElement('button');
        customPlayBtn.textContent = hasCustom ? '📒 Mon dictée du jour' : '📒 Aucun dictée enregistrée';
        customPlayBtn.disabled = !hasCustom;
        customPlayBtn.addEventListener('click', () => {
            if (typeof context.startCustomPlay === 'function') {
                context.startCustomPlay();
            }
        });
        menu.appendChild(customPlayBtn);

        const parentBtn = document.createElement('button');
        parentBtn.textContent = '🎙️ Créer une dictée';
        parentBtn.addEventListener('click', () => {
            if (typeof context.openCustomEditor === 'function') {
                context.openCustomEditor();
            }
        });
        menu.appendChild(parentBtn);

        wrapper.appendChild(menu);
        context.content.appendChild(wrapper);
        context.configureBackButton('Retour aux sujets', () => context.goToTopics());
    }

    function startGuided(context, level) {
        const data = GUIDED_LEVELS.find(entry => entry.level === level) || GUIDED_LEVELS[0];
        const entries = data.entries.slice();
        let currentIndex = 0;

        context.content.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'dictee-wrapper';

        const progress = document.createElement('div');
        progress.className = 'dictee-progress';
        const progressBar = document.createElement('div');
        progressBar.className = 'dictee-progress-bar';
        progress.appendChild(progressBar);
        wrapper.appendChild(progress);

        const prompt = document.createElement('div');
        prompt.className = 'dictee-prompt';
        const fairy = document.createElement('span');
        fairy.className = 'dictee-fairy';
        fairy.textContent = '🧚‍♀️';
        prompt.appendChild(fairy);
        const promptText = document.createElement('span');
        promptText.textContent = 'Écoute bien et écris le mot magique.';
        prompt.appendChild(promptText);
        wrapper.appendChild(prompt);

        const answerContainer = document.createElement('div');
        answerContainer.className = 'dictee-answer';
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'dictee-input';
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('autocorrect', 'off');
        input.setAttribute('autocapitalize', 'none');
        input.setAttribute('spellcheck', 'false');
        answerContainer.appendChild(input);

        const listenBtn = document.createElement('button');
        listenBtn.className = 'repartis-option-btn';
        listenBtn.textContent = '🔊 Écouter';
        answerContainer.appendChild(listenBtn);

        const repeatBtn = document.createElement('button');
        repeatBtn.className = 'repartis-option-btn';
        repeatBtn.textContent = '🔁 Répéter';
        answerContainer.appendChild(repeatBtn);

        const validateBtn = document.createElement('button');
        validateBtn.className = 'repartis-action-btn';
        validateBtn.textContent = 'Valider';
        answerContainer.appendChild(validateBtn);

        wrapper.appendChild(answerContainer);

        const keypad = document.createElement('div');
        keypad.className = 'dictee-keypad';
        KEYBOARD_CHARACTERS.forEach(char => {
            const key = document.createElement('button');
            key.className = 'dictee-key';
            key.textContent = char;
            key.addEventListener('click', () => {
                input.value += char;
                input.focus();
            });
            keypad.appendChild(key);
        });
        wrapper.appendChild(keypad);

        context.content.appendChild(wrapper);
        context.configureBackButton('Retour aux niveaux', () => context.showLevelMenu());

        function speakCurrent() {
            context.speakText(entries[currentIndex]);
        }

        function updateProgress() {
            const ratio = (currentIndex / entries.length) * 100;
            progressBar.style.width = `${ratio}%`;
        }

        function sanitize(value) {
            return value.trim().replace(/\s+/g, ' ').toLowerCase();
        }

        function handleValidation() {
            const expected = sanitize(entries[currentIndex]);
            const given = sanitize(input.value);
            if (given === expected) {
                context.playPositiveSound();
                context.showSuccessMessage('Bravo !');
                input.value = '';
                currentIndex += 1;
                updateProgress();
                if (currentIndex >= entries.length) {
                    progressBar.style.width = '100%';
                    context.awardReward(data.reward.stars, data.reward.coins);
                    context.markLevelCompleted();
                    context.showConfetti();
                    context.showSuccessMessage('Dictée réussie !');
                    setTimeout(() => context.showLevelMenu(), 1600);
                } else {
                    speakCurrent();
                }
            } else {
                context.playNegativeSound();
                context.showErrorMessage('Essaie encore !', 'Répète après la fée.');
                input.classList.add('wrong');
                setTimeout(() => input.classList.remove('wrong'), 600);
            }
        }

        listenBtn.addEventListener('click', speakCurrent);
        repeatBtn.addEventListener('click', speakCurrent);
        validateBtn.addEventListener('click', handleValidation);
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleValidation();
            }
        });

        currentIndex = 0;
        updateProgress();
        speakCurrent();
        input.focus();
    }

    function showParentZone(context) {
        context.content.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.className = 'dictee-wrapper';

        const title = document.createElement('div');
        title.className = 'question-prompt fx-bounce-in-down';
        title.textContent = 'Crée ta dictée personnalisée';
        wrapper.appendChild(title);

        const note = document.createElement('p');
        note.className = 'dictee-note';
        note.textContent = 'Ajoute jusqu\'à 10 mots ou phrases. Tu peux enregistrer ta voix pour chaque entrée.';
        wrapper.appendChild(note);

        const form = document.createElement('div');
        form.className = 'dictee-control-bar';

        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.placeholder = 'Entre le mot ou la phrase';
        textInput.className = 'dictee-input';
        form.appendChild(textInput);

        const recordBtn = document.createElement('button');
        recordBtn.className = 'dictee-mic-btn';
        recordBtn.textContent = '🎙️ Enregistrer';
        form.appendChild(recordBtn);

        const addBtn = document.createElement('button');
        addBtn.className = 'repartis-action-btn';
        addBtn.textContent = 'Ajouter';
        form.appendChild(addBtn);

        wrapper.appendChild(form);

        const list = document.createElement('div');
        list.className = 'dictee-list';
        wrapper.appendChild(list);

        const actions = document.createElement('div');
        actions.className = 'dictee-control-bar';
        const saveBtn = document.createElement('button');
        saveBtn.className = 'repartis-action-btn';
        saveBtn.textContent = '💾 Sauvegarder';
        actions.appendChild(saveBtn);
        wrapper.appendChild(actions);

        context.content.appendChild(wrapper);
        context.configureBackButton('Retour à la dictée', () => {
            if (typeof context.restartMenu === 'function') {
                context.restartMenu();
            } else {
                showRoot(context);
            }
        });

        let entries = loadCustomDictation()?.entries || [];
        renderList();

        let mediaRecorder = null;
        let recordedChunks = [];

        recordBtn.addEventListener('click', async () => {
            if (recordBtn.classList.contains('recording')) {
                stopRecording();
                return;
            }
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                context.showErrorMessage('Micro indisponible', 'Ton navigateur ne permet pas cet enregistrement.');
                return;
            }
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                recordedChunks = [];
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        recordedChunks.push(event.data);
                    }
                };
                mediaRecorder.onstop = () => {
                    stream.getTracks().forEach(track => track.stop());
                };
                mediaRecorder.start();
                recordBtn.classList.add('recording');
                recordBtn.textContent = '⏹️ Stop';
            } catch (error) {
                context.showErrorMessage('Erreur micro', error.message);
            }
        });

        function stopRecording() {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
                mediaRecorder = null;
                recordBtn.classList.remove('recording');
                recordBtn.textContent = '🎙️ Enregistrer';
            }
        }

        addBtn.addEventListener('click', async () => {
            const text = textInput.value.trim();
            if (!text) {
                context.showErrorMessage('Oups !', 'Ajoute un mot avant.');
                return;
            }
            if (entries.length >= 10) {
                context.showErrorMessage('Limite atteinte', '10 entrées maximum.');
                return;
            }
            let audioData = null;
            if (recordedChunks.length) {
                const blob = new Blob(recordedChunks, { type: 'audio/webm' });
                audioData = await blobToDataURL(blob);
                recordedChunks = [];
            }
            entries.push({ id: `entry-${Date.now()}`, text, audio: audioData });
            textInput.value = '';
            renderList();
        });

        saveBtn.addEventListener('click', () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ updatedAt: Date.now(), entries }));
            context.showSuccessMessage('Dictée sauvegardée !');
        });

        function renderList() {
            list.innerHTML = '';
            if (!entries.length) {
                const info = document.createElement('p');
                info.className = 'dictee-note';
                info.textContent = 'Aucune entrée pour le moment.';
                list.appendChild(info);
                return;
            }
            entries.forEach((entry, index) => {
                const item = document.createElement('div');
                item.className = 'dictee-list-item';
                const text = document.createElement('span');
                text.textContent = `${index + 1}. ${entry.text}`;
                item.appendChild(text);

                const controls = document.createElement('div');
                controls.className = 'dictee-control-bar';

                const playBtn = document.createElement('button');
                playBtn.className = 'repartis-option-btn';
                playBtn.textContent = '🔊';
                playBtn.disabled = !entry.audio;
                playBtn.addEventListener('click', () => {
                    if (entry.audio) {
                        const audio = new Audio(entry.audio);
                        audio.play();
                    }
                });
                controls.appendChild(playBtn);

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'repartis-option-btn';
                deleteBtn.textContent = '🗑️';
                deleteBtn.addEventListener('click', () => {
                    entries = entries.filter(e => e.id !== entry.id);
                    renderList();
                });
                controls.appendChild(deleteBtn);

                item.appendChild(controls);
                list.appendChild(item);
            });
        }
    }

    function startCustom(context) {
        const saved = loadCustomDictation();
        if (!saved || !saved.entries || !saved.entries.length) {
            context.content.innerHTML = '';
            const wrapper = document.createElement('div');
            wrapper.className = 'dictee-wrapper';
            const note = document.createElement('p');
            note.className = 'dictee-note';
            note.textContent = 'Aucune dictée personnalisée pour le moment.';
            wrapper.appendChild(note);
            context.content.appendChild(wrapper);
            context.configureBackButton('Retour', () => {
                if (typeof context.restartMenu === 'function') {
                    context.restartMenu();
                }
            });
            return;
        }

        let currentIndex = 0;
        const entries = saved.entries;

        context.content.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.className = 'dictee-wrapper';

        const progress = document.createElement('div');
        progress.className = 'dictee-progress';
        const progressBar = document.createElement('div');
        progressBar.className = 'dictee-progress-bar';
        progress.appendChild(progressBar);
        wrapper.appendChild(progress);

        const prompt = document.createElement('div');
        prompt.className = 'dictee-prompt';
        const fairy = document.createElement('span');
        fairy.className = 'dictee-fairy';
        fairy.textContent = '🧚‍♀️';
        prompt.appendChild(fairy);
        const promptText = document.createElement('span');
        promptText.textContent = 'Écoute la dictée spéciale et écris-la.';
        prompt.appendChild(promptText);
        wrapper.appendChild(prompt);

        const answerContainer = document.createElement('div');
        answerContainer.className = 'dictee-answer';
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'dictee-input';
        answerContainer.appendChild(input);

        const listenBtn = document.createElement('button');
        listenBtn.className = 'repartis-option-btn';
        listenBtn.textContent = '🔊 Écouter';
        answerContainer.appendChild(listenBtn);

        const validateBtn = document.createElement('button');
        validateBtn.className = 'repartis-action-btn';
        validateBtn.textContent = 'Valider';
        answerContainer.appendChild(validateBtn);

        wrapper.appendChild(answerContainer);
        context.content.appendChild(wrapper);
        context.configureBackButton('Retour', () => {
            if (typeof context.restartMenu === 'function') {
                context.restartMenu();
            } else {
                showRoot(context);
            }
        });

        function playEntry(entry) {
            if (entry.audio) {
                const audio = new Audio(entry.audio);
                audio.play();
            } else {
                context.speakText(entry.text);
            }
        }

        function sanitize(value) {
            return value.trim().replace(/\s+/g, ' ').toLowerCase();
        }

        function updateProgress() {
            progressBar.style.width = `${(currentIndex / entries.length) * 100}%`;
        }

        function validate() {
            const entry = entries[currentIndex];
            if (sanitize(input.value) === sanitize(entry.text)) {
                context.playPositiveSound();
                context.showSuccessMessage('Super !');
                input.value = '';
                currentIndex += 1;
                updateProgress();
                if (currentIndex >= entries.length) {
                    context.awardReward(30, 18);
                    context.showConfetti();
                    context.showSuccessMessage('Dictée du jour terminée !');
                    setTimeout(() => {
                        if (typeof context.restartMenu === 'function') {
                            context.restartMenu();
                        } else {
                            showRoot(context);
                        }
                    }, 1500);
                } else {
                    playEntry(entries[currentIndex]);
                }
            } else {
                context.playNegativeSound();
                context.showErrorMessage('Essaie encore !', 'Tu peux réécouter.');
            }
        }

        listenBtn.addEventListener('click', () => playEntry(entries[currentIndex]));
        validateBtn.addEventListener('click', validate);
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                validate();
            }
        });

        currentIndex = 0;
        updateProgress();
        playEntry(entries[currentIndex]);
        input.focus();
    }

    function loadCustomDictation() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) { return null; }
        try {
            return JSON.parse(raw);
        } catch (error) {
            console.warn('Impossible de lire la dictée personnalisée', error);
            return null;
        }
    }

    function blobToDataURL(blob) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }

    window.dicteeGame = {
        showRoot,
        startGuided,
        showParentZone,
        startCustom
    };
})();
