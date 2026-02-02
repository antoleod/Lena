document.addEventListener('DOMContentLoaded', () => {
    const poem = [
        { verse: "Quand tombe la nuit,", emoji: "🌙" },
        { verse: "Les sorcières dansent,", emoji: "🧙‍♀️" },
        { verse: "Dans leur château, elles dansent.", emoji: "🏰" },
        { verse: "Quand tombe la nuit,", emoji: "🌙" },
        { verse: "Les sorcières volent,", emoji: "🧙‍♀️" },
        { verse: "Sur leur balai, elles volent.", emoji: "🧹" },
        { verse: "Autour du chaudron,", emoji: "🔮" },
        { verse: "Elles lancent des sorts,", emoji: "🪄" },
        { verse: "Vers le haut, vers le bas,", emoji: "💫" },
        { verse: "En criant : ABRACADABRA !", emoji: "✨" },
        { verse: "Elles tournent en rond,", emoji: "🔁" },
        { verse: "En se tenant par la main,", emoji: "🤝" },
        { verse: "Elles frappent des pieds,", emoji: "👣" },
        { verse: "Et rient aux éclats...", emoji: "😂" },
        { verse: "HAHAHAHA !", emoji: "😂" },
    ];

    const emojiBankSource = ['🌙', '🧙‍♀️', '🏰', '🧹', '🪄', '💫', '😂', '🔮', '✨', '💜', '👣', '🤝', '🔁', '⭐'];

    const poemContainer = document.getElementById('poem-container');
    const emojiBank = document.getElementById('emoji-bank');
    const verifyButton = document.getElementById('verify-button');
    const progressBar = document.getElementById('progress-bar');
    const progressLabel = document.getElementById('progress-label');
    const successMessage = document.getElementById('success-message');
    const restartButton = document.getElementById('restart-button');

    // Audio setup
    const correctSound = window.audioManager.bind(new Audio('../assets/sounds/correct.wav'));
    const levelUpSound = window.audioManager.bind(new Audio('../assets/sounds/level-up.wav'));
    // const smokeSound = window.audioManager.bind(new Audio('../assets/sounds/smoke.wav')); // Placeholder

    let selectedEmoji = null;
    let placedEmojis = {};
    let userProfile = null;

    function initGame() {
        userProfile = window.storage?.loadUserProfile();

        poemContainer.innerHTML = '';
        emojiBank.innerHTML = '';
        placedEmojis = {};
        selectedEmoji = null;
        updateProgress();
        successMessage.classList.add('hidden');
        verifyButton.classList.add('hidden');

        // Create poem verses
        poem.forEach((line, index) => {
            const verseDiv = document.createElement('div');
            verseDiv.className = 'verse';
            verseDiv.innerHTML = `
                <p>${line.verse}</p>
                <div class="emoji-slot" data-index="${index}" data-answer="${line.emoji}"></div>
            `;
            poemContainer.appendChild(verseDiv);
        });

        // Create emoji bank
        shuffle(emojiBankSource).forEach(emoji => {
            const emojiSpan = document.createElement('span');
            emojiSpan.className = 'emoji';
            emojiSpan.textContent = emoji;
            emojiBank.appendChild(emojiSpan);
        });

        addEventListeners();
        createStars();
    }

    function addEventListeners() {
        emojiBank.addEventListener('click', handleEmojiSelection);
        poemContainer.addEventListener('click', handleSlotSelection);
        verifyButton.addEventListener('click', checkAnswers);
        restartButton.addEventListener('click', initGame);
    }

    function handleEmojiSelection(e) {
        if (e.target.classList.contains('emoji')) {
            if (selectedEmoji) {
                selectedEmoji.classList.remove('selected');
            }
            selectedEmoji = e.target;
            selectedEmoji.classList.add('selected');
        }
    }

    function handleSlotSelection(e) {
        if (e.target.classList.contains('emoji-slot') && selectedEmoji) {
            const slot = e.target;
            const index = slot.dataset.index;

            // If slot is already filled, return emoji to bank
            if (slot.textContent !== '') {
                const bankEmoji = document.createElement('span');
                bankEmoji.className = 'emoji';
                bankEmoji.textContent = slot.textContent;
                emojiBank.appendChild(bankEmoji);
            }

            slot.textContent = selectedEmoji.textContent;
            slot.classList.add('filled');
            placedEmojis[index] = selectedEmoji.textContent;

            selectedEmoji.remove();
            selectedEmoji = null;

            if (Object.keys(placedEmojis).length === poem.length) {
                verifyButton.classList.remove('hidden');
            }
        }
    }

    function checkAnswers() {
        let correctCount = 0;
        let allCorrect = true;

        const slots = poemContainer.querySelectorAll('.emoji-slot');
        slots.forEach(slot => {
            const index = slot.dataset.index;
            const isCorrect = placedEmojis[index] === slot.dataset.answer;

            if (isCorrect) {
                slot.classList.add('correct');
                slot.classList.remove('incorrect');
                correctCount++;
            } else if (placedEmojis[index]) {
                allCorrect = false;
                slot.classList.add('incorrect');
                slot.classList.remove('correct');

                // Return incorrect emoji to bank
                const emojiSpan = document.createElement('span');
                emojiSpan.className = 'emoji';
                emojiSpan.textContent = placedEmojis[index];
                emojiBank.appendChild(emojiSpan);

                // Add smoke effect
                const smoke = document.createElement('span');
                smoke.textContent = '💨';
                smoke.className = 'smoke-puff';
                slot.appendChild(smoke);
                setTimeout(() => smoke.remove(), 700);
                // if(smokeSound) smokeSound.play();

                slot.textContent = '';
                slot.classList.remove('filled');
                delete placedEmojis[index];
            }
        });

        updateProgress(Object.values(placedEmojis).filter((v, i) => v === poem[i].emoji).length);

        if (allCorrect && Object.keys(placedEmojis).length === poem.length) {
            verifyButton.classList.add('hidden');
            setTimeout(showSuccess, 500);
        } else {
             if (correctSound) correctSound.play();
        }
    }

    function updateProgress(correctCount = 0) {
        const total = poem.length;
        const filledCount = Object.keys(placedEmojis).length;
        const percentage = total > 0 ? Math.round((filledCount / total) * 100) : 0;
        progressBar.style.width = `${percentage}%`;
        progressLabel.textContent = `${percentage}%`;
    }

    function showSuccess() {
        successMessage.classList.remove('hidden');
        playConfetti();
        if(levelUpSound) levelUpSound.play();

        if (userProfile && window.storage) {
            const progress = storage.loadUserProgress(userProfile.name);
            if (!progress.lesSorcieres) {
                progress.lesSorcieres = {};
            }
            progress.lesSorcieres.completed = true;
            progress.userScore.stars = (progress.userScore.stars || 0) + 15;
            storage.saveUserProgress(userProfile.name, progress);
        }
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // --- Animated Background ---
    function createStars() {
        const container = document.body;
        // Clean up old stars
        container.querySelectorAll('.star, .shooting-star').forEach(el => el.remove());

        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.width = `${Math.random() * 2}px`;
            star.style.height = star.style.width;
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.animationDuration = `${2 + Math.random() * 3}s`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            container.appendChild(star);
        }

        for (let i = 0; i < 3; i++) {
            const shootingStar = document.createElement('div');
            shootingStar.className = 'shooting-star';
            shootingStar.style.top = `${Math.random() * 50}%`;
            shootingStar.style.right = `0px`;
            shootingStar.style.animationDuration = `${2 + Math.random() * 3}s`;
            shootingStar.style.animationDelay = `${5 + Math.random() * 10}s`;
            container.appendChild(shootingStar);
        }
    }

    function playConfetti() {
        const confettiContainer = document.getElementById('confetti-container');
        confettiContainer.innerHTML = '';
        for (let i = 0; i < 100; i++) {
            const confetto = document.createElement('div');
            confetto.className = 'confetto';
            confetto.style.left = Math.random() * 100 + 'vw';
            confetto.style.animationDelay = Math.random() * 2 + 's';
            confetto.style.backgroundColor = `hsl(${280 + Math.random() * 40}, 100%, ${50 + Math.random() * 20}%)`; // Shades of purple and gold
            confettiContainer.appendChild(confetto);
        }
    }

    // Add confetti styles dynamically
    if (!document.getElementById('confetti-styles')) {
        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.innerHTML = `
            #confetti-container {
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                pointer-events: none; z-index: 999;
            }
            .confetto {
                position: absolute;
                width: 10px;
                height: 10px;
                background-color: var(--golden-glow);
                opacity: 0;
                animation: fall 3s linear forwards;
            }
            @keyframes fall {
                0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
                100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    initGame();
});