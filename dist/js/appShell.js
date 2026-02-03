(function () {
    'use strict';

    const EMOJI = {
        home: '\uD83C\uDFE0',
        bag: '\uD83D\uDECD',
        trophy: '\uD83C\uDFC6',
        book: '\uD83D\uDCD6',
        back: '\u21A9',
        rainbow: '\uD83C\uDF08',
        lock: '\uD83D\uDD12',
        star: '\u2B50',
        coin: '\uD83E\uDE99',
        bell: '\uD83D\uDD14',
        play: '\u25B6'
    };

    function t(key, fallback) {
        if (window.i18n?.t) {
            return window.i18n.t(key);
        }
        return fallback;
    }

    function getBasePath() {
        const path = window.location.pathname;
        const marker = '/legacy/';
        const idx = path.indexOf(marker);
        if (idx >= 0) {
            return path.slice(0, idx + 1);
        }
        const segments = path.split('/').filter(Boolean);
        if (segments.length > 0 && segments[0] !== 'login' && segments[0] !== 'menu') {
            return `/${segments[0]}/`;
        }
        return '/';
    }

    const BASE_PATH = getBasePath();

    function resolveAppPath(path) {
        if (!path) return path;
        if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) {
            return path;
        }
        if (path.startsWith('/')) {
            return `${BASE_PATH}${path.replace(/^\\//, '')}`;
        }
        return `${BASE_PATH}${path}`;
    }

    window.resolveLenaPath = resolveAppPath;

    function logout() {
        const wantsLogout = window.confirm(t('confirmLogout', 'Veux-tu vraiment te déconnecter ?'));
        if (!wantsLogout) { return; }
        try {
            window.localStorage?.removeItem('mathsLenaUserProfile');
        } catch (error) {
            console.warn('[LenaShell] Impossible de nettoyer le profil', error);
        }
        window.location.href = resolveAppPath('/login');
    }

    const FOOTER_LINKS = [
        {
            id: 'nav-home',
            icon: EMOJI.home,
            label: 'Accueil',
            labelKey: 'navHome',
            href: '/juego'
        },
        {
            id: 'nav-shop',
            icon: EMOJI.bag,
            label: 'Boutique',
            labelKey: 'navShop',
            href: '/boutique'
        },
        {
            id: 'nav-achievements',
            icon: EMOJI.trophy,
            label: 'Succ\u00e8s',
            labelKey: 'navAchievements',
            href: '/logros'
        },
        {
            id: 'nav-library',
            icon: EMOJI.book,
            label: 'Biblioth\u00e8que',
            labelKey: 'navLibrary',
            href: '/juego',
            hash: '#library'
        },
        {
            id: 'nav-back',
            icon: EMOJI.back,
            label: 'Retour',
            labelKey: 'navBack',
            action: () => {
                console.log('[Navigation] Retour (d\u00e9mo)');
                window.history.length > 1 ? window.history.back() : console.log('Aucune page pr\u00e9c\u00e9dente');
            }
        },
        {
            id: 'nav-logout',
            icon: EMOJI.lock,
            label: 'Sortir',
            labelKey: 'navLogout',
            action: () => {
                console.log('[Navigation] Logout');
                logout();
            }
        }
    ];

    const AUDIO_STATE = {
        iconOn: '\uD83D\uDD0A',
        iconOff: '\uD83D\uDD07',
        labelOn: () => t('audioOn', 'Son actif'),
        labelOff: () => t('audioOff', 'Son coupé')
    };

    let headerEl;
    let headerInner;
    let audioBtn;
    let notificationBtn;
    let logoutBtn;
    let languageSelectEl;
    let userNameEl;
    let avatarImgEl;
    let avatarFallbackEl;
    let starsValueEl;
    let coinsValueEl;
    let levelBadgeEl;
    let footerEl;

    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    function resolveAsset(path) {
        if (!path) {
            return path;
        }
        if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) {
            return path;
        }
        if (path.startsWith('/')) {
            return resolveAppPath(path);
        }
        if (path.startsWith('#')) {
            return path;
        }
        try {
            const resolved = new URL(path, `${window.location.origin}/`);
            return resolved.pathname + resolved.search + resolved.hash;
        } catch (error) {
            return path;
        }
    }

    function buildHeader(container) {
        container.className = 'lena-shell__header';
        headerInner = document.createElement('div');
        headerInner.className = 'lena-header-single';
        headerInner.innerHTML = `
            <div class="lena-avatar">
                <span class="lena-avatar__fallback" aria-hidden="true">${EMOJI.rainbow}</span>
                <img id="user-avatar-img" src="" alt="Avatar joueur">
            </div>
            <span id="user-name" class="lena-username">Gean</span>
            <button type="button" class="lena-btn-logout" id="logoutButton">
                <span aria-hidden="true">${EMOJI.lock}</span>
                <span class="lena-btn-logout__label" data-i18n="navLogout">Sortir</span>
            </button>
            <span class="lena-stat" data-stat="stars">
                <span class="lena-stat__icon" aria-hidden="true">${EMOJI.star}</span>
                <span class="lena-stat__value" id="stars">0</span>
            </span>
            <span class="lena-stat" data-stat="coins">
                <span class="lena-stat__icon" aria-hidden="true">${EMOJI.coin}</span>
                <span class="lena-stat__value" id="coins">50</span>
            </span>
            <span class="lena-level" id="level">Niveau 1</span>
            <button type="button" class="lena-icon-btn" id="audioToggleButton" aria-label="${AUDIO_STATE.labelOn()}">${AUDIO_STATE.iconOn}</button>
            <button type="button" class="lena-icon-btn" id="notificationButton" aria-label="${t('notifications', 'Notifications')}">${EMOJI.bell}</button>
            <label class="lena-lang">
                <span class="sr-only" data-i18n="languageLabel">Langue</span>
                <select id="languageSelect" class="lena-lang__select" data-language-select data-i18n-aria="languageSelectAria"></select>
            </label>
        `;

        container.appendChild(headerInner);

        userNameEl = headerInner.querySelector('#user-name');
        avatarImgEl = headerInner.querySelector('#user-avatar-img');
        avatarFallbackEl = headerInner.querySelector('.lena-avatar__fallback');
        starsValueEl = headerInner.querySelector('#stars');
        coinsValueEl = headerInner.querySelector('#coins');
        levelBadgeEl = headerInner.querySelector('#level');
        audioBtn = headerInner.querySelector('#audioToggleButton');
        notificationBtn = headerInner.querySelector('#notificationButton');
        logoutBtn = headerInner.querySelector('#logoutButton');
        languageSelectEl = headerInner.querySelector('#languageSelect');

        setupAudioButton();
        setupNotificationButton();
        setupLogoutButton();
        setupLanguageSelect();
    }

    function setupAudioButton() {
        if (!audioBtn) { return; }
        const sync = () => {
            const muted = Boolean(window.audioManager?.isMuted);
            audioBtn.classList.toggle('is-muted', muted);
            audioBtn.textContent = muted ? AUDIO_STATE.iconOff : AUDIO_STATE.iconOn;
            audioBtn.setAttribute('aria-label', muted ? AUDIO_STATE.labelOff() : AUDIO_STATE.labelOn());
        };
        audioBtn.addEventListener('click', () => {
            if (window.audioManager && typeof window.audioManager.toggle === 'function') {
                window.audioManager.toggle();
            } else {
                window.audioManager = window.audioManager || { isMuted: false };
                window.audioManager.isMuted = !window.audioManager.isMuted;
            }
            animatePress(audioBtn);
            sync();
        });

        if (window.audioManager?.onChange) {
            window.audioManager.onChange(sync);
        } else {
            document.addEventListener('audioManagerReady', sync, { once: true });
        }
        sync();
    }

    function setupNotificationButton() {
        if (!notificationBtn) { return; }
        notificationBtn.addEventListener('click', () => {
            animatePress(notificationBtn);
            console.log(`[Action] ${EMOJI.bell} Notifications (démo)`);
        });
    }

    function setupLogoutButton() {
        if (!logoutBtn) { return; }
        logoutBtn.addEventListener('click', () => {
            animatePress(logoutBtn);
            logout();
        });
    }

    function setupLanguageSelect() {
        if (!languageSelectEl) { return; }
        if (window.i18n?.bindLanguageSelect) {
            window.i18n.bindLanguageSelect(languageSelectEl);
        }
    }

    function buildFooter(container) {
        container.className = 'lena-shell__footer';
        const inner = document.createElement('div');
        inner.className = 'lena-shell__footer-inner';

        const currentPath = window.location.pathname;
        FOOTER_LINKS.forEach(item => {
            const labelText = item.labelKey ? t(item.labelKey, item.label) : item.label;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'lena-footer-btn';
            btn.id = item.id;
            btn.innerHTML = `
                <span class="lena-footer-btn__icon" aria-hidden="true">${item.icon}</span>
                <span class="lena-footer-btn__label">${labelText}</span>
            `;

            if (item.href) {
                const resolved = resolveAsset(item.href);
                const destination = item.hash ? `${resolved}${item.hash}` : resolved;
                const normalized = resolved.startsWith('http') ? new URL(resolved).pathname : resolved;
                const isCurrentPage = currentPath === normalized || currentPath.endsWith(normalized);
                const hashMatches = item.hash ? window.location.hash === item.hash : true;
                if (isCurrentPage && hashMatches) {
                    btn.classList.add('is-active');
                    btn.setAttribute('aria-current', 'page');
                }
                btn.addEventListener('click', () => {
                    console.log(`[Navigation] ${labelText} -> ${destination}`);
                    animatePress(btn);
                    setTimeout(() => {
                        if (isCurrentPage && item.hash) {
                            if (window.location.hash !== item.hash) {
                                window.location.hash = item.hash;
                            }
                        } else if (item.hash) {
                            window.location.href = destination;
                        } else {
                            window.location.href = resolved;
                        }
                    }, 120);
                });
            } else if (typeof item.action === 'function') {
                btn.addEventListener('click', () => {
                    animatePress(btn);
                    item.action();
                });
            }

            inner.appendChild(btn);
        });

        container.appendChild(inner);
    }

    function animatePress(element) {
        element.classList.add('is-pressed');
        setTimeout(() => element.classList.remove('is-pressed'), 180);
    }

    function handleScrollCompact() {
        let lastScroll = 0;
        let ticking = false;

        const update = () => {
            const current = window.scrollY || window.pageYOffset;
            const shouldCompact = current > 12;
            if (shouldCompact) {
                headerEl?.classList.add('is-compact');
            } else {
                headerEl?.classList.remove('is-compact');
            }
            lastScroll = current;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
    }

    function getStoredProfile() {
        try {
            if (window.storage?.loadUserProfile) {
                const profile = window.storage.loadUserProfile();
                if (profile) { return profile; }
            }
        } catch (error) {
            console.warn('[LenaShell] Impossible de charger le profil via storage.js', error);
        }
        try {
            const raw = window.localStorage?.getItem('mathsLenaUserProfile');
            if (!raw) { return null; }
            return JSON.parse(raw);
        } catch (error) {
            console.warn('[LenaShell] Profil introuvable dans localStorage', error);
            return null;
        }
    }

    function hydrateUserIdentity(externalProfile) {
        if (!userNameEl || !avatarFallbackEl) { return; }
        const profile = externalProfile || getStoredProfile() || {};
        const displayName = profile.name || profile.displayName || t('fallbackName', 'Ami Magique');
        userNameEl.textContent = displayName;

        const avatarInfo = profile.avatar || {};
        const avatarIcon = avatarInfo.icon || avatarInfo.iconUrl || avatarInfo.src;
        if (avatarImgEl) {
            if (avatarIcon) {
                const normalized = resolveAsset(String(avatarIcon));
                avatarImgEl.src = normalized;
                avatarImgEl.alt = avatarInfo.name || `Avatar de ${displayName}`;
                avatarImgEl.style.display = 'block';
                avatarFallbackEl.style.display = 'none';
            } else {
                avatarImgEl.removeAttribute('src');
                avatarImgEl.style.display = 'none';
                avatarFallbackEl.style.display = 'grid';
                avatarFallbackEl.textContent = avatarInfo.emoji || EMOJI.rainbow;
            }
        }

        const score = profile.userScore || profile.progress || {};
        const stars = typeof score.stars === 'number' ? score.stars : profile.stars;
        if (typeof stars === 'number') {
            [document.getElementById('scoreStars'), document.getElementById('stars'), starsValueEl]
                .filter(Boolean)
                .forEach(target => { target.textContent = stars; });
        }

        const coins = typeof score.coins === 'number' ? score.coins : profile.coins;
        if (typeof coins === 'number') {
            [document.getElementById('scoreCoins'), document.getElementById('coins'), coinsValueEl]
                .filter(Boolean)
                .forEach(target => { target.textContent = coins; });
        }

        const levelValue = profile.level ?? profile.currentLevel;
        if (levelBadgeEl && (typeof levelValue === 'number' || typeof levelValue === 'string')) {
            const numeric = Number(levelValue);
            const labelKey = t('levelLabel', 'Niveau');
            const label = Number.isFinite(numeric) ? `${labelKey} ${Math.max(1, numeric)}` : String(levelValue);
            levelBadgeEl.textContent = label;
        }
    }

    function initShell() {
        headerEl = document.querySelector('[data-lena-header]');
        if (!headerEl) {
            headerEl = document.createElement('header');
            headerEl.setAttribute('data-lena-header', '');
            document.body.insertAdjacentElement('afterbegin', headerEl);
        }

        footerEl = document.querySelector('[data-lena-footer]') || (() => {
            const created = document.createElement('footer');
            created.setAttribute('data-lena-footer', '');
            document.body.appendChild(created);
            return created;
        })();

        buildHeader(headerEl);
        buildFooter(footerEl);
        handleScrollCompact();
        hydrateUserIdentity();
        if (window.i18n?.apply) {
            window.i18n.apply(document);
        }

        document.body.classList.add('has-shell-header', 'has-shell-footer');
        window.lenaShell = window.lenaShell || {};
        window.lenaShell.updateUser = hydrateUserIdentity;
        window.lenaShell.refreshLanguage = refreshLanguage;

        if (window.feedbackSystem?.refreshHud) {
            try {
                window.feedbackSystem.refreshHud();
            } catch (error) {
                console.warn('[LenaShell] Impossible de rafraîchir le HUD', error);
            }
        }

        document.addEventListener('lena:user:update', (event) => {
            if (event?.detail) {
                hydrateUserIdentity(event.detail);
            }
        });

        document.addEventListener('lena:exercise:context', forwardExerciseContext);
        document.addEventListener('lena:exercise:answer', forwardExerciseAnswer);
        document.addEventListener('lena:exercise:hint', forwardExerciseHint);
        document.addEventListener('lena:exercise:level-complete', forwardLevelComplete);
        document.addEventListener('lena:language:change', refreshLanguage);

        function unlockAudio() {
          const silentAudio = new Audio('data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaXRyYXRlIHN1cHBsaWVkIGJ5IHRoZSBsYW1lIGxpYnJhcnkuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4s');
          silentAudio.play().catch(() => {});
          document.removeEventListener('click', unlockAudio);
          document.removeEventListener('touchstart', unlockAudio);
        }

        document.addEventListener('click', unlockAudio, { once: true });
        document.addEventListener('touchstart', unlockAudio, { once: true });
    }

    ready(initShell);

    function refreshLanguage() {
        if (!headerEl || !footerEl) { return; }
        headerEl.innerHTML = '';
        footerEl.innerHTML = '';
        buildHeader(headerEl);
        buildFooter(footerEl);
        hydrateUserIdentity();
        if (window.i18n?.apply) {
            window.i18n.apply(document);
        }
    }

    function getFeedbackSystem() {
        return window.feedbackSystem || null;
    }

    function forwardExerciseContext(event) {
        const system = getFeedbackSystem();
        if (!system?.setCurrentExercise || !event?.detail) {
            return;
        }
        try {
            system.setCurrentExercise(event.detail);
        } catch (error) {
            console.warn('[LenaShell] Impossible de d\u00E9finir le contexte exercice', error);
        }
    }

    function forwardExerciseAnswer(event) {
        const system = getFeedbackSystem();
        if (!system?.onAnswer || !event?.detail) {
            return;
        }
        try {
            system.onAnswer(event.detail);
        } catch (error) {
            console.warn('[LenaShell] Impossible d\u2019envoyer la r\u00E9ponse au feedback system', error);
        }
    }

    function forwardExerciseHint(event) {
        const system = getFeedbackSystem();
        if (!system?.showHint || !event?.detail) {
            return;
        }
        try {
            const detail = event.detail;
            system.showHint(detail.level || 1, detail);
        } catch (error) {
            console.warn('[LenaShell] Impossible d\u2019afficher l\u2019indice', error);
        }
    }

    function forwardLevelComplete(event) {
        const system = getFeedbackSystem();
        if (!system?.onLevelComplete || !event?.detail) {
            return;
        }
        try {
            system.onLevelComplete(event.detail);
        } catch (error) {
            console.warn('[LenaShell] Impossible de notifier la fin de niveau', error);
        }
    }
})();
