(function () {
    'use strict';

    const GAME_LEVELS = [
        { level: 1, type: 'letters', title: 'Les lettres majuscules', items: ['I', 'J', 'L', 'T', 'F', 'E'] },
        { level: 2, type: 'words', title: 'Les prénoms magiques', items: ['Inès', 'Igor', 'Léna', 'Tom'] },
        { level: 3, type: 'sentences', title: 'Les petites phrases', items: ['Je suis là.', 'Il fait beau.'] }
    ];

    let context, state;

    function start(ctx) {
        context = ctx;
        const levelIndex = Math.max(0, Math.min(GAME_LEVELS.length - 1, context.currentLevel - 1));
        const levelData = GAME_LEVELS[levelIndex];

        state = {
            levelData,
            currentItemIndex: 0,
            canvas: null,
            ctx2d: null,
            isDrawing: false,
            lastX: 0,
            lastY: 0,
        };

        renderUI();
        loadCurrentItem();
    }

    function renderUI() {
        context.content.innerHTML = '';
        context.content.className = 'content-container ecriture-container';

        const wrapper = document.createElement('div');
        wrapper.className = 'ecriture-wrapper';

        const title = document.createElement('h2');
        title.className = 'ecriture-title';
        title.textContent = `Niveau ${state.levelData.level}: ${state.levelData.title}`;
        wrapper.appendChild(title);

        const modelWrapper = document.createElement('div');
        modelWrapper.className = 'ecriture-model-wrapper';
        const modelText = document.createElement('div');
        modelText.id = 'ecriture-model-text';
        modelText.className = 'ecriture-model-text';
        modelWrapper.appendChild(modelText);
        wrapper.appendChild(modelWrapper);

        const canvas = document.createElement('canvas');
        canvas.id = 'ecriture-canvas';
        canvas.className = 'ecriture-canvas';
        wrapper.appendChild(canvas);
        state.canvas = canvas;
        state.ctx2d = canvas.getContext('2d');

        const controls = document.createElement('div');
        controls.className = 'ecriture-controls';

        const retryBtn = document.createElement('button');
        retryBtn.id = 'ecriture-retry-btn';
        retryBtn.className = 'ecriture-btn';
        retryBtn.textContent = 'Réessayer';
        controls.appendChild(retryBtn);

        const nextBtn = document.createElement('button');
        nextBtn.id = 'ecriture-next-btn';
        nextBtn.className = 'ecriture-btn ecriture-btn--primary';
        nextBtn.textContent = 'Mot suivant';
        controls.appendChild(nextBtn);

        wrapper.appendChild(controls);
        context.content.appendChild(wrapper);

        context.configureBackButton('Retour aux niveaux', () => context.showLevelMenu());

        setupCanvas();
        setupControls();
    }

    function loadCurrentItem() {
        const modelText = document.getElementById('ecriture-model-text');
        const currentItem = state.levelData.items[state.currentItemIndex];
        if (modelText && currentItem) {
            modelText.textContent = currentItem;
            clearCanvas();
        }
    }

    function setupCanvas() {
        const canvas = state.canvas;
        const ctx = state.ctx2d;
        const rect = canvas.getBoundingClientRect();
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        ctx.strokeStyle = '#3f2c85';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        function getPos(e) {
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches ? e.touches[0] : e;
            return {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top
            };
        }

        function startDrawing(e) {
            e.preventDefault();
            state.isDrawing = true;
            const { x, y } = getPos(e);
            [state.lastX, state.lastY] = [x, y];
        }

        function draw(e) {
            if (!state.isDrawing) return;
            e.preventDefault();
            const { x, y } = getPos(e);
            ctx.beginPath();
            ctx.moveTo(state.lastX, state.lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
            [state.lastX, state.lastY] = [x, y];
        }

        function stopDrawing() {
            state.isDrawing = false;
        }

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        canvas.addEventListener('touchstart', startDrawing, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', stopDrawing);
    }

    function clearCanvas() {
        state.ctx2d.clearRect(0, 0, state.canvas.width, state.canvas.height);
    }

    function setupControls() {
        document.getElementById('ecriture-retry-btn').addEventListener('click', clearCanvas);
        document.getElementById('ecriture-next-btn').addEventListener('click', () => {
            state.currentItemIndex = (state.currentItemIndex + 1) % state.levelData.items.length;
            loadCurrentItem();
            context.playPositiveSound();
        });
    }

    window.ecritureCursiveGame = {
        start
    };
})();