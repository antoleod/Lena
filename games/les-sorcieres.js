(() => {
    const storageKey = 'les_sorcieres_magic_state_v1';

    const poemStanzas = [
        {
            id: 'nuit',
            title: 'Quand tombe la nuit',
            toneEmoji: '💙',
            toneName: 'Bleu nuit',
            color: '#0b1d4a',
            gradient: 'linear-gradient(135deg, #0b1d4a 0%, #31427a 100%)',
            sound: { key: 'wind', label: '🌙 Vent doux' },
            lines: [
                {
                    id: 'nuit-0',
                    text: 'Quand tombe la nuit,',
                    emoji: '🌙',
                    gesture: 'Descends lentement tes bras pour faire tomber la nuit autour de toi.',
                    cloze: {
                        text: 'Quand tombe la ___,',
                        answer: 'nuit',
                        options: [
                            { label: 'nuit', emoji: '🌙' },
                            { label: 'pluie', emoji: '🌧️' },
                            { label: 'soleil', emoji: '☀️' }
                        ]
                    }
                },
                {
                    id: 'nuit-1',
                    text: 'Les sorcières dansent,',
                    emoji: '🧙‍♀️',
                    gesture: 'Tourne doucement sur toi-même comme une sorcière qui tourbillonne.',
                    cloze: {
                        text: 'Les 🧙‍♀️ (___) dansent.',
                        answer: 'sorcières',
                        options: [
                            { label: 'sorcières', emoji: '🧙‍♀️' },
                            { label: 'vampires', emoji: '🧛‍♀️' },
                            { label: 'fantômes', emoji: '👻' }
                        ]
                    }
                },
                {
                    id: 'nuit-2',
                    text: 'Dans leur château, elles dansent.',
                    emoji: '🏰',
                    gesture: 'Forme un toit pointu avec tes mains au-dessus de ta tête pour dessiner le château.',
                    cloze: {
                        text: 'Dans leur ___ elles dansent.',
                        answer: 'château',
                        options: [
                            { label: 'château', emoji: '🏰' },
                            { label: 'forêt', emoji: '🌳' },
                            { label: 'caverne', emoji: '🕳️' }
                        ]
                    }
                }
            ]
        },
        {
            id: 'vol',
            title: 'Les sorcières volent',
            toneEmoji: '🟣',
            toneName: 'Violet étoilé',
            color: '#3b1961',
            gradient: 'linear-gradient(135deg, #321460 0%, #6d2daf 100%)',
            sound: { key: 'flight', label: '🧹 Souffle de balai' },
            lines: [
                {
                    id: 'vol-0',
                    text: 'Quand tombe la nuit,',
                    emoji: '🌌',
                    gesture: 'Plie doucement les genoux comme si tu te préparais à décoller.',
                    cloze: {
                        text: 'Quand tombe la ___,',
                        answer: 'nuit',
                        options: [
                            { label: 'nuit', emoji: '🌌' },
                            { label: 'neige', emoji: '❄️' },
                            { label: 'classe', emoji: '🏫' }
                        ]
                    }
                },
                {
                    id: 'vol-1',
                    text: 'Les sorcières volent,',
                    emoji: '🧹',
                    gesture: 'Tends les bras en avant comme si tu tenais un balai magique.',
                    cloze: {
                        text: 'Les sorcières ___,',
                        answer: 'volent',
                        options: [
                            { label: 'volent', emoji: '🧹' },
                            { label: 'chantent', emoji: '🎤' },
                            { label: 'cuisinent', emoji: '🍳' }
                        ]
                    }
                },
                {
                    id: 'vol-2',
                    text: 'Sur leur balai, elles volent.',
                    emoji: '🪽',
                    gesture: 'Écarte les bras comme des ailes et balance-toi doucement.',
                    cloze: {
                        text: 'Sur leur ___ elles volent.',
                        answer: 'balai',
                        options: [
                            { label: 'balai', emoji: '🧹' },
                            { label: 'dragon', emoji: '🐉' },
                            { label: 'nuage', emoji: '☁️' }
                        ]
                    }
                }
            ]
        },
        {
            id: 'chants',
            title: 'Autour du chaudron',
            toneEmoji: '💚',
            toneName: 'Vert potion',
            color: '#0b3f2b',
            gradient: 'linear-gradient(135deg, #0b3f2b 0%, #1f805f 100%)',
            sound: { key: 'bubble', label: '🔮 Bulles magiques' },
            lines: [
                {
                    id: 'chants-0',
                    text: 'Autour du chaudron,',
                    emoji: '🔮',
                    gesture: 'Trace un cercle avec tes mains comme si tu entourais un chaudron magique.',
                    cloze: {
                        text: 'Autour du ___,',
                        answer: 'chaudron',
                        options: [
                            { label: 'chaudron', emoji: '🔮' },
                            { label: 'table', emoji: '🪑' },
                            { label: 'balcon', emoji: '🏛️' }
                        ]
                    }
                },
                {
                    id: 'chants-1',
                    text: 'Elles lancent des sorts,',
                    emoji: '✨',
                    gesture: 'Agite tes doigts vers l’avant comme si tu lançais des étincelles.',
                    cloze: {
                        text: 'Elles lancent des ___,',
                        answer: 'sorts',
                        options: [
                            { label: 'sorts', emoji: '✨' },
                            { label: 'ballons', emoji: '🎈' },
                            { label: 'livres', emoji: '📚' }
                        ]
                    }
                },
                {
                    id: 'chants-2',
                    text: 'Vers le haut, vers le bas,',
                    emoji: '🔁',
                    gesture: 'Monte et descends les bras pour suivre le sort.',
                    cloze: {
                        text: 'Vers le ___, vers le ___',
                        answer: 'haut / bas',
                        options: [
                            { label: 'haut / bas', emoji: '🔁' },
                            { label: 'vin / eau', emoji: '🍷' },
                            { label: 'jour / nuit', emoji: '🌞' }
                        ]
                    }
                },
                {
                    id: 'chants-3',
                    text: 'En criant : ABRACADABRA !',
                    emoji: '🪄',
                    gesture: 'Lève vivement les bras en criant « ABRACADABRA ! »',
                    cloze: {
                        text: 'En criant : ___ !',
                        answer: 'ABRACADABRA',
                        options: [
                            { label: 'ABRACADABRA', emoji: '🪄' },
                            { label: 'BONJOUR', emoji: '👋' },
                            { label: 'MERCI', emoji: '🙏' }
                        ]
                    }
                }
            ]
        },
        {
            id: 'rire',
            title: 'La ronde des rires',
            toneEmoji: '🧡',
            toneName: 'Orange rire',
            color: '#6b2b14',
            gradient: 'linear-gradient(135deg, #6b2b14 0%, #c95d28 100%)',
            sound: { key: 'laugh', label: '😂 Rires enchantés' },
            lines: [
                {
                    id: 'rire-0',
                    text: 'Elles tournent en rond,',
                    emoji: '🔄',
                    gesture: 'Tourne en rond en tenant tes mains devant toi.',
                    cloze: {
                        text: 'Elles ___ en rond,',
                        answer: 'tournent',
                        options: [
                            { label: 'tournent', emoji: '🔄' },
                            { label: 'dorment', emoji: '🛌' },
                            { label: 'dessinent', emoji: '✏️' }
                        ]
                    }
                },
                {
                    id: 'rire-1',
                    text: 'En se tenant par la main,',
                    emoji: '🤝',
                    gesture: 'Étends tes mains comme si tu attrapais celles de tes amies.',
                    cloze: {
                        text: 'En se tenant par la ___,',
                        answer: 'main',
                        options: [
                            { label: 'main', emoji: '🤝' },
                            { label: 'jambe', emoji: '🦵' },
                            { label: 'queue', emoji: '🐕' }
                        ]
                    }
                },
                {
                    id: 'rire-2',
                    text: 'Elles frappent des pieds,',
                    emoji: '🦶',
                    gesture: 'Tape des pieds sur le sol comme un tambour.',
                    cloze: {
                        text: 'Elles ___ des pieds,',
                        answer: 'frappent',
                        options: [
                            { label: 'frappent', emoji: '🦶' },
                            { label: 'cachent', emoji: '🙈' },
                            { label: 'dopent', emoji: '🏃' }
                        ]
                    }
                },
                {
                    id: 'rire-3',
                    text: 'Et rient aux éclats...',
                    emoji: '🤣',
                    gesture: 'Ricane fort la tête en arrière.',
                    cloze: {
                        text: 'Et ___ aux éclats…',
                        answer: 'rient',
                        options: [
                            { label: 'rient', emoji: '🤣' },
                            { label: 'pleurent', emoji: '😭' },
                            { label: 'murmurent', emoji: '🤫' }
                        ]
                    }
                },
                {
                    id: 'rire-4',
                    text: 'HAHAHAHA !',
                    emoji: '😄',
                    gesture: 'Répète « HAHAHAHA ! » en frappant des mains.',
                    cloze: {
                        text: '___ !',
                        answer: 'HAHAHAHA',
                        options: [
                            { label: 'HAHAHAHA', emoji: '😄' },
                            { label: 'AU REVOIR', emoji: '👋' },
                            { label: 'ABRACADABRA', emoji: '🪄' }
                        ]
                    }
                }
            ]
        }
    ];

    const magicalCards = [
        {
            id: 'card-1',
            front: 'Quand tombe la nuit, les … dansent',
            back: { emoji: '🧙‍♀️', keyword: 'sorcières', color: 'violet lune' }
        },
        {
            id: 'card-2',
            front: 'Dans leur … elles dansent',
            back: { emoji: '🏰', keyword: 'château', color: 'bleu mystique' }
        },
        {
            id: 'card-3',
            front: 'Les sorcières … dans le ciel',
            back: { emoji: '🧹', keyword: 'volent', color: 'violet étoilé' }
        },
        {
            id: 'card-4',
            front: 'Sur leur … elles volent',
            back: { emoji: '🧹', keyword: 'balai', color: 'indigo magique' }
        },
        {
            id: 'card-5',
            front: 'Autour du … elles lancent des sorts',
            back: { emoji: '🔮', keyword: 'chaudron', color: 'vert potion' }
        },
        {
            id: 'card-6',
            front: 'Vers le …, vers le …',
            back: { emoji: '🔁', keyword: 'haut / bas', color: 'turquoise enchanté' }
        },
        {
            id: 'card-7',
            front: 'En criant : … !',
            back: { emoji: '🪄', keyword: 'ABRACADABRA', color: 'rose magenta' }
        },
        {
            id: 'card-8',
            front: 'Elles … en rond',
            back: { emoji: '🔄', keyword: 'tournent', color: 'orange braise' }
        },
        {
            id: 'card-9',
            front: 'En se tenant par la …',
            back: { emoji: '🤝', keyword: 'main', color: 'or chaleureux' }
        },
        {
            id: 'card-10',
            front: '… aux éclats !',
            back: { emoji: '😂', keyword: 'Rires', color: 'jaune sourire' }
        }
    ];

    const missionsConfig = [
        {
            id: 'listen',
            emoji: '🔈',
            title: 'Lire et danser',
            description: 'Écoute le poème en entier et mime le geste librement pendant l’écoute.',
            reward: 'rire',
            mode: null
        },
        {
            id: 'emoji',
            emoji: '🪄',
            title: 'Émoji magique',
            description: 'Associe chaque emoji au bon vers sans te tromper.',
            reward: 'etoile',
            mode: 'emoji'
        },
        {
            id: 'color',
            emoji: '🎧',
            title: 'Couleur & Son',
            description: 'Gagne un défi sonore en reconnaissant la bonne strophe.',
            reward: 'balai',
            mode: 'color'
        },
        {
            id: 'cloze',
            emoji: '🧩',
            title: 'Trou magique',
            description: 'Trouve toutes les paroles cachées avec les bons emojis.',
            reward: 'etoile',
            mode: 'cloze'
        },
        {
            id: 'gestures',
            emoji: '💃',
            title: 'Danse ensorcelée',
            description: 'Valide tous les gestes du poème devant le miroir.',
            reward: 'rire',
            mode: 'gestures'
        },
        {
            id: 'cards',
            emoji: '🃏',
            title: 'Cartes ensorcelées',
            description: 'Retourne les dix cartes et mémorise chaque mot-clé.',
            reward: 'balai',
            mode: 'cards'
        }
    ];

    const shuffle = array => {
        const copy = [...array];
        for (let i = copy.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    };

    const createSpeechEngine = () => {
        const utterances = new Set();
        const speak = (text, options = {}) => {
            if (!('speechSynthesis' in window)) {
                return null;
            }
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'fr-FR';
            utterance.rate = options.rate || 0.95;
            utterance.pitch = options.pitch || 1;
            if (options.volume !== undefined) {
                utterance.volume = options.volume;
            }
            if (typeof options.onend === 'function') {
                utterance.onend = () => options.onend();
            }
            utterances.add(utterance);
            utterance.onend = () => {
                utterances.delete(utterance);
                if (typeof options.onend === 'function') {
                    options.onend();
                }
            };
            speechSynthesis.speak(utterance);
            return utterance;
        };

        const stop = () => {
            if (!('speechSynthesis' in window)) {
                return;
            }
            speechSynthesis.cancel();
            utterances.clear();
        };

        return { speak, stop };
    };

    class SoundStudio {
        constructor() {
            this.context = null;
        }

        ensureContext() {
            if (this.context) return this.context;
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return null;
            this.context = new AudioContext();
            return this.context;
        }

        play(type) {
            const ctx = this.ensureContext();
            if (!ctx) return;
            if (ctx.state === 'suspended') {
                ctx.resume();
            }
            switch (type) {
                case 'wind':
                    this.playWind(ctx);
                    break;
                case 'flight':
                    this.playFlight(ctx);
                    break;
                case 'bubble':
                    this.playBubble(ctx);
                    break;
                case 'laugh':
                    this.playLaugh(ctx);
                    break;
                default:
                    break;
            }
        }

        playWind(ctx) {
            const duration = 3.6;
            const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < data.length; i += 1) {
                const progress = i / data.length;
                data[i] = (Math.random() * 2 - 1) * (1 - progress) * 0.6;
            }
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 800;
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.4);
            gain.gain.linearRampToValueAtTime(0.0, ctx.currentTime + duration);
            source.connect(filter).connect(gain).connect(ctx.destination);
            source.start();
        }

        playFlight(ctx) {
            const osc = ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(480, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 2.2);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.15);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.4);

            const vibrato = ctx.createOscillator();
            vibrato.type = 'sine';
            vibrato.frequency.setValueAtTime(7, ctx.currentTime);

            const vibratoGain = ctx.createGain();
            vibratoGain.gain.setValueAtTime(18, ctx.currentTime);

            vibrato.connect(vibratoGain).connect(osc.frequency);
            osc.connect(gain).connect(ctx.destination);

            osc.start();
            vibrato.start();
            osc.stop(ctx.currentTime + 2.5);
            vibrato.stop(ctx.currentTime + 2.5);
        }

        playBubble(ctx) {
            const playPlop = delay => {
                const osc = ctx.createOscillator();
                osc.type = 'sine';
                const startFreq = 320 + Math.random() * 180;
                const endFreq = startFreq * (1 + Math.random() * 1.2);
                osc.frequency.setValueAtTime(startFreq, ctx.currentTime + delay);
                osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + delay + 0.18);

                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0, ctx.currentTime + delay);
                gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + delay + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.3);

                osc.connect(gain).connect(ctx.destination);
                osc.start(ctx.currentTime + delay);
                osc.stop(ctx.currentTime + delay + 0.35);
            };
            [0, 0.18, 0.32, 0.52, 0.76].forEach(t => playPlop(t));
        }

        playLaugh(ctx) {
            const duration = 1.8;
            const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
            const data = noiseBuffer.getChannelData(0);
            for (let i = 0; i < data.length; i += 1) {
                data[i] = Math.random() * 2 - 1;
            }
            const source = ctx.createBufferSource();
            source.buffer = noiseBuffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1200, ctx.currentTime);
            filter.Q.value = 3;

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.1);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

            source.connect(filter).connect(gain).connect(ctx.destination);
            source.start();

            const osc = ctx.createOscillator();
            osc.type = 'square';
            osc.frequency.setValueAtTime(220, ctx.currentTime);
            osc.frequency.setValueAtTime(240, ctx.currentTime + 0.2);
            osc.frequency.setValueAtTime(190, ctx.currentTime + 0.4);
            const oscGain = ctx.createGain();
            oscGain.gain.setValueAtTime(0, ctx.currentTime);
            oscGain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.05);
            oscGain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
            osc.connect(oscGain).connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        }
    }

    const loadProgress = () => {
        try {
            const raw = localStorage.getItem(storageKey);
            if (!raw) {
                return null;
            }
            return JSON.parse(raw);
        } catch (error) {
            return null;
        }
    };

    const saveProgress = state => {
        try {
            const snapshot = {
                rewards: state.rewards,
                missions: state.missions
            };
            localStorage.setItem(storageKey, JSON.stringify(snapshot));
        } catch (error) {
            // Ignore storage errors silently
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        const tabsEl = document.getElementById('mode-tabs');
        const panelsEl = document.getElementById('mode-panels');
        const rewardTray = document.getElementById('reward-tray');
        const listenFullPoemBtn = document.getElementById('listen-full-poem');
        const progressPanel = document.getElementById('mode-progress');
        const resetButton = document.getElementById('reset-progress');

        if (!tabsEl || !panelsEl || !rewardTray) {
            return;
        }

        const defaultRewards = { balai: 0, etoile: 0, rire: 0 };
        const createBlankMissionState = () => Object.fromEntries(missionsConfig.map(m => [m.id, false]));

        const persisted = loadProgress();
        const initialState = {
            rewards: Object.assign({}, defaultRewards, persisted?.rewards || {}),
            missions: Object.assign(
                createBlankMissionState(),
                persisted?.missions || {}
            )
        };

        const state = {
            currentMode: null,
            rewards: initialState.rewards,
            missions: initialState.missions,
            missionRenderer: null,
            emojiCompleted: Boolean(initialState.missions.emoji),
            colorChallengeWon: Boolean(initialState.missions.color),
            clozeCompleted: Boolean(initialState.missions.cloze),
            gesturesCompleted: Boolean(initialState.missions.gestures),
            cardsCompleted: Boolean(initialState.missions.cards)
        };

        const tts = createSpeechEngine();
        const soundStudio = new SoundStudio();

        const modes = [
            { id: 'emoji', emoji: '🧚‍♀️', label: 'Émoji magique', builder: buildEmojiMode },
            { id: 'color', emoji: '🟣', label: 'Couleur & Son', builder: buildColorMode },
            { id: 'cloze', emoji: '🧠', label: 'Trou magique', builder: buildClozeMode },
            { id: 'gestures', emoji: '💃', label: 'Danse & gestes', builder: buildGesturesMode },
            { id: 'cards', emoji: '🃏', label: 'Cartes magiques', builder: buildCardsMode },
            { id: 'missions', emoji: '🌟', label: 'Missions Memofrases', builder: buildMissionsMode }
        ];

        const speakPoem = () => {
            const fullText = poemStanzas.map(stanza => stanza.lines.map(line => line.text).join(' ')).join(' ');
            tts.stop();
            tts.speak(fullText, { rate: 0.9 });
            completeMission('listen');
        };

        const awardReward = (type, amount = 1) => {
            if (!state.rewards[type]) {
                state.rewards[type] = 0;
            }
            state.rewards[type] += amount;
            updateRewardDisplay();
            saveProgress(state);
        };

        const updateRewardDisplay = () => {
            rewardTray.querySelectorAll('.reward').forEach(node => {
                const rewardId = node.getAttribute('data-reward');
                const count = state.rewards[rewardId] || 0;
                node.querySelector('.reward-count').textContent = count.toString();
                node.classList.toggle('reward-active', count > 0);
            });
        };

        const completeMission = id => {
            if (!missionsConfig.find(m => m.id === id)) return;
            if (state.missions[id]) return;
            state.missions[id] = true;
            const missionMeta = missionsConfig.find(m => m.id === id);
            if (missionMeta?.reward) {
                awardReward(missionMeta.reward, 1);
            }
            if (typeof state.missionRenderer === 'function') {
                state.missionRenderer();
            }
            saveProgress(state);
        };

        const buildTabs = () => {
            tabsEl.innerHTML = '';
            modes.forEach(mode => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'mode-tab';
                button.dataset.mode = mode.id;
                const emojiSpan = document.createElement('span');
                emojiSpan.className = 'tab-emoji';
                emojiSpan.textContent = mode.emoji;
                button.appendChild(emojiSpan);
                button.appendChild(document.createTextNode(mode.label));
                button.addEventListener('click', () => showMode(mode.id));
                tabsEl.appendChild(button);
            });
        };

        const setActiveTab = modeId => {
            tabsEl.querySelectorAll('.mode-tab').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.mode === modeId);
            });
        };

        const showMode = modeId => {
            if (state.currentMode === modeId) return;
            tts.stop();
            state.currentMode = modeId;
            setActiveTab(modeId);
            panelsEl.innerHTML = '';
            const panel = document.createElement('section');
            panel.className = `mode-panel ${modeId}-mode active`;
            panelsEl.appendChild(panel);
            const mode = modes.find(m => m.id === modeId);
            if (mode && typeof mode.builder === 'function') {
                mode.builder({
                    panel,
                    state,
                    tts,
                    soundStudio,
                    showMode,
                    completeMission,
                    awardReward
                });
            }
            updateModeProgress();
            saveProgress(state);
        };

        function updateModeProgress() {
            if (!progressPanel) return;
            const progressData = [
                { id: 'emoji', label: 'Emoji magique', emoji: '🧚‍♀️', done: state.emojiCompleted },
                { id: 'color', label: 'Couleur & Son', emoji: '🟣', done: state.colorChallengeWon },
                { id: 'cloze', label: 'Trou magique', emoji: '🧠', done: state.clozeCompleted },
                { id: 'gestures', label: 'Danse & gestes', emoji: '💃', done: state.gesturesCompleted },
                { id: 'cards', label: 'Cartes magiques', emoji: '🃏', done: state.cardsCompleted }
            ];
            const completedTotal = progressData.filter(item => item.done).length;
            const total = progressData.length;
            progressPanel.innerHTML = `
                <div class="mode-progress__header">
                    <span class="mode-progress__title">Progression magique</span>
                    <span class="mode-progress__count">${completedTotal}/${total}</span>
                </div>
                <div class="mode-progress__grid">
                    ${progressData.map(item => `
                        <button type="button" class="mode-progress__badge ${item.done ? 'is-done' : ''}" data-mode="${item.id}">
                            <span class="badge-emoji">${item.emoji}</span>
                            <span class="badge-label">${item.label}</span>
                            <span class="badge-status">${item.done ? '✓' : '…'}</span>
                        </button>
                    `).join('')}
                </div>
            `;
            progressPanel.querySelectorAll('.mode-progress__badge').forEach(btn => {
                btn.addEventListener('click', () => showMode(btn.dataset.mode));
            });
        }

        listenFullPoemBtn?.addEventListener('click', () => {
            speakPoem();
        });

        buildTabs();
        updateRewardDisplay();
        updateModeProgress();
        showMode(state.currentMode || 'emoji');

        window.lesSorcieresGame = {
            start() {
                showMode('emoji');
                listenFullPoemBtn?.focus({ preventScroll: true });
            }
        };
    });

    function buildEmojiMode(ctx) {
        const { panel, state, tts, completeMission, awardReward } = ctx;
        panel.innerHTML = `
            <p class="mode-intro">Associe chaque emoji à la bonne ligne du poème. Tu peux glisser-déposer ou cliquer pour sélectionner un emoji puis une ligne.</p>
            <div class="poem-grid"></div>
            <div class="emoji-bank" aria-label="Banque d'emojis"></div>
            <div class="emoji-actions">
                <button type="button" data-action="shuffle">🔀 Mélanger les emojis</button>
                <button type="button" data-action="reset">♻️ Recommencer</button>
                <button type="button" data-action="hint">💡 Indice</button>
                <button type="button" data-action="speak">🔈 Écouter la strophe active</button>
            </div>
            <div class="feedback" role="status" aria-live="polite"></div>
        `;

        const poemGrid = panel.querySelector('.poem-grid');
        const bank = panel.querySelector('.emoji-bank');
        const feedbackEl = panel.querySelector('.feedback');
        const actionButtons = panel.querySelectorAll('.emoji-actions button');

        const allLines = [];

        poemStanzas.forEach(stanza => {
            const stanzaBlock = document.createElement('article');
            stanzaBlock.className = 'stanza';
            stanzaBlock.style.background = `${stanza.gradient}`;

            const title = document.createElement('h3');
            title.className = 'stanza-title';
            title.innerHTML = `${stanza.toneEmoji} ${stanza.title} <span class="tone-chip">${stanza.toneName}</span>`;
            stanzaBlock.appendChild(title);

            stanza.lines.forEach(line => {
                const lineRow = document.createElement('div');
                lineRow.className = 'line';
                lineRow.dataset.lineId = line.id;
                lineRow.dataset.expectedEmoji = line.emoji;
                lineRow.innerHTML = `
                    <span class="line-text">${line.text}</span>
                    <div class="drop-zone" data-line="${line.id}" tabindex="0" aria-label="Dépose l'emoji pour: ${line.text}"></div>
                `;
                stanzaBlock.appendChild(lineRow);
                allLines.push(line);
            });

            poemGrid.appendChild(stanzaBlock);
        });

        const tokens = shuffle(allLines.map(line => ({
            id: `${line.id}-token`,
            emoji: line.emoji,
            lineId: line.id
        })));

        let selectedToken = null;
        let completedLines = new Set();
        let lastSpokenLine = null;

        const setFeedback = message => {
            feedbackEl.textContent = message;
        };

        const buildTokenElement = tokenData => {
            const token = document.createElement('button');
            token.type = 'button';
            token.className = 'emoji-token';
            token.dataset.tokenId = tokenData.id;
            token.dataset.emoji = tokenData.emoji;
            token.draggable = true;
            token.textContent = tokenData.emoji;

            token.addEventListener('dragstart', event => {
                event.dataTransfer.setData('text/plain', tokenData.id);
                bank.querySelectorAll('.emoji-token').forEach(btn => btn.classList.remove('selected'));
                token.classList.add('selected');
                selectedToken = token;
            });

            token.addEventListener('dragend', () => {
                token.classList.remove('selected');
            });

            token.addEventListener('click', () => {
                if (selectedToken === token) {
                    token.classList.remove('selected');
                    selectedToken = null;
                    return;
                }
                bank.querySelectorAll('.emoji-token').forEach(btn => btn.classList.remove('selected'));
                token.classList.add('selected');
                selectedToken = token;
            });

            return token;
        };

        const refreshBank = tokenList => {
            bank.innerHTML = '';
            tokenList.forEach(tokenData => {
                bank.appendChild(buildTokenElement(tokenData));
            });
        };

        const resetBoard = () => {
            completedLines = new Set();
            selectedToken = null;
            lastSpokenLine = null;
            panel.querySelectorAll('.drop-zone').forEach(zone => {
                zone.textContent = '';
                zone.classList.remove('correct', 'incorrect', 'over');
                zone.removeAttribute('data-token');
            });
            refreshBank(tokens);
            setFeedback('Prépare ta baguette : les emojis attendent leur vers magique ✨');
        };

        const findTokenElement = tokenId => bank.querySelector(`[data-token-id="${tokenId}"]`);

        const checkCompletion = () => {
            if (completedLines.size === allLines.length && !state.emojiCompleted) {
                setFeedback('Bravo Léna ! Chaque vers scintille avec son emoji ✨');
                awardReward('etoile', 1);
                completeMission('emoji');
                state.emojiCompleted = true;
            }
        };

        const placeToken = (zone, token) => {
            const targetEmoji = zone.closest('.line')?.dataset.expectedEmoji;
            const droppedEmoji = token.dataset.emoji;
            const lineId = zone.getAttribute('data-line');

            if (zone.classList.contains('correct')) {
                zone.textContent = droppedEmoji;
                return;
            }

            if (droppedEmoji === targetEmoji) {
                zone.textContent = droppedEmoji;
                zone.classList.remove('incorrect');
                zone.classList.add('correct');
                completedLines.add(lineId);
                token.remove();
                selectedToken = null;
                const lineData = allLines.find(line => line.id === lineId);
                if (lineData && lastSpokenLine !== lineId) {
                    tts.stop();
                    tts.speak(lineData.text, { rate: 0.95 });
                    lastSpokenLine = lineId;
                }
                setFeedback('Abracadabra ! Un vers vient de s’illuminer 🌟');
            } else {
                zone.classList.add('incorrect');
                setFeedback('Oups, cet emoji appartient à un autre vers. Essaie encore !');
                token.classList.remove('selected');
                selectedToken = null;
            }
            checkCompletion();
        };

        panel.querySelectorAll('.drop-zone').forEach(zone => {
            zone.addEventListener('dragover', event => {
                event.preventDefault();
                zone.classList.add('over');
            });
            zone.addEventListener('dragleave', () => zone.classList.remove('over'));
            zone.addEventListener('drop', event => {
                event.preventDefault();
                zone.classList.remove('over');
                const tokenId = event.dataTransfer.getData('text/plain');
                const token = findTokenElement(tokenId);
                if (token) {
                    placeToken(zone, token);
                }
            });
            zone.addEventListener('click', () => {
                if (selectedToken) {
                    placeToken(zone, selectedToken);
                }
            });
        });

        actionButtons.forEach(button => {
            const action = button.getAttribute('data-action');
            if (action === 'shuffle') {
                button.addEventListener('click', () => {
                    const currentTokens = [...bank.querySelectorAll('.emoji-token')].map(btn => ({
                        id: btn.dataset.tokenId,
                        emoji: btn.dataset.emoji
                    }));
                    refreshBank(shuffle(currentTokens));
                    setFeedback('Les emojis tourbillonnent dans le ciel nocturne ✨');
                });
            }
            if (action === 'reset') {
                button.addEventListener('click', () => {
                    resetBoard();
                });
            }
            if (action === 'speak') {
                button.addEventListener('click', () => {
                    const verses = poemStanzas.map(stanza => stanza.lines.map(line => line.text).join(' ')).join(' ');
                    tts.stop();
                    tts.speak(verses, { rate: 0.9 });
                });
            }
            if (action === 'hint') {
                button.addEventListener('click', () => {
                    const remainingTokens = [...bank.querySelectorAll('.emoji-token')];
                    if (remainingTokens.length === 0) {
                        setFeedback('Tous les emojis sont placés !');
                        return;
                    }

                    const randomToken = shuffle(remainingTokens)[0];
                    const emoji = randomToken.dataset.emoji;

                    const targetLine = allLines.find(line => line.emoji === emoji);
                    if (!targetLine) return;

                    const targetZone = panel.querySelector(`.drop-zone[data-line="${targetLine.id}"]`);
                    if (!targetZone || targetZone.classList.contains('correct')) {
                        return;
                    }

                    randomToken.classList.add('hint-shake');
                    targetZone.classList.add('hint-glow');
                    setFeedback(`Regarde bien l'emoji ${emoji}... Où pourrait-il aller ?`);
                    setTimeout(() => randomToken.classList.remove('hint-shake'), 700);
                    setTimeout(() => targetZone.classList.remove('hint-glow'), 1200);
                });
            }
        });

        resetBoard();
    }

    function buildColorMode(ctx) {
        const { panel, state, soundStudio, completeMission } = ctx;
        panel.innerHTML = `
            <p class="mode-intro">Chaque strophe a sa couleur et son souffle musical. Écoute, observe, puis devine la scène qui correspond.</p>
            <div class="sound-grid"></div>
            <div class="challenge-box">
                <div class="challenge-status" aria-live="polite">Clique sur « Défi sonore » pour lancer une mission.</div>
                <div class="sound-actions">
                    <button type="button" data-action="challenge">🔮 Défi sonore</button>
                    <button type="button" data-action="stop">⏹️ Stopper le son</button>
                </div>
            </div>
        `;

        const grid = panel.querySelector('.sound-grid');
        const challengeBox = panel.querySelector('.challenge-status');
        const buttons = panel.querySelectorAll('.sound-actions button');
        let activeChallenge = null;

        poemStanzas.forEach(stanza => {
            const card = document.createElement('article');
            card.className = 'sound-card';
            card.dataset.stanzaId = stanza.id;
            card.style.background = stanza.gradient;

            const title = document.createElement('h3');
            title.textContent = `${stanza.toneEmoji} ${stanza.title}`;

            const list = document.createElement('ul');
            list.className = 'sound-lines';
            stanza.lines.forEach(line => {
                const li = document.createElement('li');
                li.textContent = line.text;
                list.appendChild(li);
            });

            const actions = document.createElement('div');
            actions.className = 'sound-actions';
            const soundBtn = document.createElement('button');
            soundBtn.type = 'button';
            soundBtn.textContent = `${stanza.sound.label} Écouter`;
            soundBtn.addEventListener('click', () => {
                soundStudio.play(stanza.sound.key);
                challengeBox.textContent = `Tu écoutes : ${stanza.title}`;
            });

            const listenBtn = document.createElement('button');
            listenBtn.type = 'button';
            listenBtn.textContent = '🔈 Lire';
            listenBtn.addEventListener('click', () => {
                soundStudio.play(stanza.sound.key);
            });

            actions.appendChild(soundBtn);
            actions.appendChild(listenBtn);

            card.appendChild(title);
            card.appendChild(list);
            card.appendChild(actions);

            card.addEventListener('click', () => {
                if (!activeChallenge) return;
                if (activeChallenge.id === stanza.id) {
                    challengeBox.textContent = 'Bravo ! Tu as reconnu la bonne strophe sonore ✨';
                    activeChallenge = null;
                    if (!state.colorChallengeWon) {
                        completeMission('color');
                        state.colorChallengeWon = true;
                    }
                } else {
                    challengeBox.textContent = 'Essaie encore, ce n’est pas la bonne couleur sonore.';
                }
            });

            grid.appendChild(card);
        });

        buttons.forEach(button => {
            const action = button.getAttribute('data-action');
            if (action === 'challenge') {
                button.addEventListener('click', () => {
                    activeChallenge = shuffle(poemStanzas)[0];
                    challengeBox.textContent = 'Quel est ce son magique ? Clique sur la bonne strophe !';
                    soundStudio.play(activeChallenge.sound.key);
                });
            } else if (action === 'stop') {
                button.addEventListener('click', () => {
                    if (soundStudio.context) {
                        soundStudio.context.suspend();
                    }
                    challengeBox.textContent = 'Le vent retombe... Reprends quand tu veux.';
                });
            }
        });
    }

    function buildClozeMode(ctx) {
        const { panel, state, completeMission } = ctx;
        panel.innerHTML = `
            <p class="mode-intro">Chaque ligne cache un mot magique. Choisis le bon emoji-mot pour compléter le vers.</p>
            <div class="cloze-grid"></div>
        `;

        const grid = panel.querySelector('.cloze-grid');
        const entries = poemStanzas.flatMap(stanza => stanza.lines.map(line => ({
            stanzaId: stanza.id,
            lineId: line.id,
            text: line.cloze.text,
            answer: line.cloze.answer,
            options: line.cloze.options
        })));

        const solved = new Set();

        entries.forEach(entry => {
            const card = document.createElement('article');
            card.className = 'cloze-card';

            const text = document.createElement('p');
            text.className = 'cloze-text';
            text.innerHTML = entry.text.replace('___', `<span class="blank" data-line="${entry.lineId}">___</span>`);
            card.appendChild(text);

            const choices = document.createElement('div');
            choices.className = 'choices';

            shuffle(entry.options).forEach(option => {
                const choice = document.createElement('button');
                choice.type = 'button';
                choice.className = 'choice';
                choice.innerHTML = `<span aria-hidden="true">${option.emoji}</span> ${option.label}`;
                choice.addEventListener('click', () => {
                    const blank = card.querySelector('.blank');
                    if (option.label.toLowerCase() === entry.answer.toLowerCase()) {
                        blank.textContent = option.label;
                        choice.classList.add('correct');
                        solved.add(entry.lineId);
                        choices.querySelectorAll('.choice').forEach(btn => {
                            btn.disabled = true;
                            if (btn !== choice) {
                                btn.classList.add('fade');
                            }
                        });
                        if (solved.size === entries.length && !state.clozeCompleted) {
                            completeMission('cloze');
                            state.clozeCompleted = true;
                        }
                    } else {
                        choice.classList.add('incorrect');
                        setTimeout(() => choice.classList.remove('incorrect'), 400);
                    }
                });
                choices.appendChild(choice);
            });

            card.appendChild(choices);
            grid.appendChild(card);
        });
    }

    function buildGesturesMode(ctx) {
        const { panel, state, completeMission } = ctx;
        panel.innerHTML = `
            <p class="mode-intro">Apprends le poème avec ton corps ! Chaque vers a un geste. Marque « Fait » quand tu le réussis.</p>
            <div class="gesture-list"></div>
        `;

        const list = panel.querySelector('.gesture-list');
        const gestures = poemStanzas.flatMap(stanza => stanza.lines.map(line => ({
            id: line.id,
            text: line.text,
            gesture: line.gesture
        })));
        const completed = new Set();

        gestures.forEach(item => {
            const card = document.createElement('article');
            card.className = 'gesture-card';
            card.dataset.gestureId = item.id;

            const title = document.createElement('h3');
            title.className = 'gesture-title';
            title.textContent = item.text;

            const desc = document.createElement('p');
            desc.className = 'gesture-desc';
            desc.textContent = item.gesture;

            const actions = document.createElement('div');
            actions.className = 'gesture-actions';

            const done = document.createElement('button');
            done.type = 'button';
            done.textContent = '✅ Fait';
            done.addEventListener('click', () => {
                completed.add(item.id);
                card.classList.add('completed');
                if (completed.size === gestures.length && !state.gesturesCompleted) {
                    completeMission('gestures');
                    state.gesturesCompleted = true;
                }
            });

            const retry = document.createElement('button');
            retry.type = 'button';
            retry.textContent = '🔁 Répéter';
            retry.addEventListener('click', () => {
                completed.delete(item.id);
                card.classList.remove('completed');
            });

            actions.appendChild(done);
            actions.appendChild(retry);

            card.appendChild(title);
            card.appendChild(desc);
            card.appendChild(actions);

            list.appendChild(card);
        });
    }

    function buildCardsMode(ctx) {
        const { panel, state, completeMission } = ctx;
        panel.innerHTML = `
            <p class="mode-intro">Retourne chaque carte magique : une face question, une face réponse pour t’aider à réciter.</p>
            <div class="card-grid"></div>
        `;

        const grid = panel.querySelector('.card-grid');
        const flipped = new Set();

        magicalCards.forEach(cardData => {
            const wrapper = document.createElement('div');
            wrapper.className = 'magic-card';
            wrapper.dataset.cardId = cardData.id;

            const inner = document.createElement('div');
            inner.className = 'card-inner';

            const front = document.createElement('div');
            front.className = 'card-face front';
            const frontText = document.createElement('div');
            frontText.className = 'card-front-text';
            frontText.textContent = cardData.front;
            const prompt = document.createElement('span');
            prompt.textContent = 'Retourne-moi ✨';
            front.appendChild(frontText);
            front.appendChild(prompt);

            const back = document.createElement('div');
            back.className = 'card-face back';
            const emoji = document.createElement('div');
            emoji.className = 'card-back-emoji';
            emoji.textContent = cardData.back.emoji;
            const keyword = document.createElement('p');
            keyword.className = 'card-back-text';
            keyword.textContent = cardData.back.keyword;
            const color = document.createElement('div');
            color.className = 'card-back-color';
            color.textContent = cardData.back.color;

            back.appendChild(emoji);
            back.appendChild(keyword);
            back.appendChild(color);

            inner.appendChild(front);
            inner.appendChild(back);
            wrapper.appendChild(inner);

            wrapper.addEventListener('click', () => {
                wrapper.classList.toggle('flipped');
                if (wrapper.classList.contains('flipped')) {
                    flipped.add(cardData.id);
                } else {
                    flipped.delete(cardData.id);
                }
                if (flipped.size === magicalCards.length && !state.cardsCompleted) {
                    completeMission('cards');
                    state.cardsCompleted = true;
                }
            });

            grid.appendChild(wrapper);
        });
    }

    function buildMissionsMode(ctx) {
        const { panel, state, showMode, completeMission } = ctx;
        panel.innerHTML = `
            <p class="mode-intro">Chaque mission gagnée t’offre une récompense magique. Choisis, réalise, récolte tes étoiles !</p>
            <div class="mission-list"></div>
        `;

        const list = panel.querySelector('.mission-list');

        const render = () => {
            list.innerHTML = '';
            missionsConfig.forEach(mission => {
                const card = document.createElement('article');
                card.className = 'mission-card';
                if (state.missions[mission.id]) {
                    card.classList.add('completed');
                }

                const title = document.createElement('h3');
                title.className = 'mission-title';
                title.textContent = `${mission.emoji} ${mission.title}`;

                const desc = document.createElement('p');
                desc.className = 'mission-desc';
                desc.textContent = mission.description;

                const reward = document.createElement('div');
                reward.className = 'mission-status';
                reward.textContent = state.missions[mission.id]
                    ? `Récompense gagnée : ${mission.reward === 'balai' ? '🧹' : mission.reward === 'etoile' ? '🌟' : '😂'}`
                    : `Récompense : ${mission.reward === 'balai' ? '🧹 Balai magique' : mission.reward === 'etoile' ? '🌟 Étoile mémoire' : '😂 Rire de sorcière'}`;

                const actions = document.createElement('div');
                actions.className = 'mission-actions';

                if (!state.missions[mission.id]) {
                    const goBtn = document.createElement('button');
                    goBtn.type = 'button';
                    goBtn.textContent = mission.mode ? '👉 Ouvrir le mode' : '🎧 Écouter maintenant';
                    goBtn.addEventListener('click', () => {
                        if (mission.mode) {
                            showMode(mission.mode);
                        } else {
                            completeMission('listen');
                        }
                    });
                    actions.appendChild(goBtn);
                } else {
                    const redoBtn = document.createElement('button');
                    redoBtn.type = 'button';
                    redoBtn.textContent = 'Refaire pour le plaisir';
                    redoBtn.addEventListener('click', () => {
                        if (mission.mode) {
                            showMode(mission.mode);
                        }
                    });
                    actions.appendChild(redoBtn);
                }

                card.appendChild(title);
                card.appendChild(desc);
                card.appendChild(reward);
                card.appendChild(actions);

                list.appendChild(card);
            });
        };

        render();
        state.missionRenderer = render;
        missionsConfig.forEach(mission => {
            if (state.missions[mission.id]) {
                completeMission(mission.id);
            }
        });
    }
})();
