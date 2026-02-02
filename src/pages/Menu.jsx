import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HEAD_LINKS = [
  '/css/style.css',
  '/css/menu.css',
  '/css/feedback-system.css'
];

function useHeadLinks() {
  useEffect(() => {
    const added = [];
    HEAD_LINKS.forEach((href) => {
      const existing = Array.from(document.head.querySelectorAll('link[rel="stylesheet"]'))
        .find((link) => link.href.endsWith(href));
      if (existing) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
      added.push(link);
    });

    return () => {
      added.forEach((link) => link.remove());
    };
  }, []);
}

function waitForGlobal(name, timeoutMs = 2000) {
  return new Promise((resolve) => {
    const start = Date.now();
    const timer = setInterval(() => {
      if (window[name]) {
        clearInterval(timer);
        resolve(window[name]);
        return;
      }
      if (Date.now() - start > timeoutMs) {
        clearInterval(timer);
        resolve(null);
      }
    }, 50);
  });
}

function ensureScript(src) {
  return new Promise((resolve, reject) => {
    const existing = Array.from(document.scripts).find((script) => script.src.endsWith(src));
    if (existing) {
      resolve(existing);
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

export default function MenuPage() {
  useHeadLinks();
  const navigate = useNavigate();
  const starsRef = useRef(null);
  const canvasRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const avatarList = Object.values(window.AVATAR_LIBRARY || {});

  useEffect(() => {
    document.title = 'Menu Principal - MathsWebLena';
    document.documentElement.lang = 'es';
  }, []);

  useEffect(() => {
    let active = true;

    async function init() {
      try {
        await Promise.all([
          ensureScript('/js/storage.js'),
          ensureScript('/js/avatarData.js'),
          ensureScript('/js/feedbackSystem.js')
        ]);
      } catch (error) {
        console.warn('[menu] Failed to load scripts', error);
      }

      const storage = await waitForGlobal('storage');
      if (!storage || !active) return;

      const currentProfile = storage.loadUserProfile?.() || null;
      if (!currentProfile?.name) {
        navigate('/login', { replace: true });
        return;
      }

      const currentProgress = storage.loadUserProgress?.(currentProfile.name) || null;

      const library = window.AVATAR_LIBRARY || {};
      let selected = storage.loadSelectedAvatar?.() || null;
      if (!selected) {
        selected = library.licorne || {
          id: 'licorne',
          name: 'Licorne',
          iconUrl: '/assets/avatars/licorne.svg'
        };
        storage.saveSelectedAvatar?.(selected);
      }
      const resolvedAvatar = library[selected.id] || selected;

      if (currentProfile?.color) {
        document.body.style.setProperty('--primary-color', currentProfile.color);
      }

      if (!active) return;
      setProfile(currentProfile);
      setProgress(currentProgress);
      setAvatar(resolvedAvatar);
    }

    init();

    return () => {
      active = false;
    };
  }, [navigate]);

  useEffect(() => {
    const starsContainer = starsRef.current;
    if (!starsContainer) return;

    starsContainer.innerHTML = '';
    const numberOfStars = 100;
    for (let i = 0; i < numberOfStars; i += 1) {
      const star = document.createElement('div');
      star.classList.add('star');
      const size = `${Math.random() * 3}px`;
      star.style.width = size;
      star.style.height = size;
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 2}s`;
      starsContainer.appendChild(star);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId = null;
    let hue = 180;
    let particles = [];
    const mouse = { x: null, y: null };

    function onMouseMove(event) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      for (let i = 0; i < 2; i += 1) {
        particles.push(new Particle());
      }
    }

    function onResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() {
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 2.5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `hsl(${hue + Math.random() * 30 - 15}, 100%, 70%)`;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.1) this.size -= 0.04;
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function handleParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter((p) => p.size > 0.1);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      hue = (hue + 0.6) % 360;
      animationId = requestAnimationFrame(handleParticles);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);
    handleParticles();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  function handleAvatarSelect(nextAvatar) {
    if (!nextAvatar) return;
    const storage = window.storage;
    storage?.saveSelectedAvatar?.(nextAvatar);
    if (profile) {
      const updated = {
        ...profile,
        avatar: {
          id: nextAvatar.id,
          name: nextAvatar.name,
          iconUrl: nextAvatar.iconUrl
        }
      };
      storage?.saveUserProfile?.(updated);
      setProfile(updated);
    }
    setAvatar(nextAvatar);
    setModalOpen(false);
  }

  return (
    <div className="menu-root">
      <canvas
        id="particle-trail"
        ref={canvasRef}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1000 }}
      />
      <div className="sun"></div>
      <div className="moon"></div>
      <div className="stars" ref={starsRef}></div>

      <div className="menu-container">
        <header className="menu-header">
          <div id="user-greeting">{profile?.name ? `¡Hola, ${profile.name}!` : '¡Hola, aventurera!'}</div>
          <div id="user-avatar">
            {avatar && (
              <div className="menu-avatar" data-avatar-id={avatar.id} data-avatar={avatar.iconUrl} data-avatar-name={avatar.name}>
                <img src={avatar.iconUrl || '/assets/avatars/licorne.svg'} alt={avatar.name || 'Avatar'} loading="lazy" />
                <span className="menu-avatar__label">{avatar.name}</span>
              </div>
            )}
          </div>
          <button id="change-avatar-btn" className="btn-secondary" type="button" onClick={() => setModalOpen(true)}>
            Cambiar Avatar
          </button>

          {modalOpen && (
            <div id="avatar-selection-modal" className="modal" role="dialog" aria-modal="true">
              <div className="modal-content">
                <button className="close-button" type="button" onClick={() => setModalOpen(false)} aria-label="Cerrar">
                  &times;
                </button>
                <h2>Selecciona tu Avatar</h2>
                <div id="avatar-options-container">
                  {avatarList.map((item) => (
                    <button
                      key={item.id}
                      className={`avatar-option${avatar?.id === item.id ? ' selected' : ''}`}
                      type="button"
                      data-avatar-id={item.id}
                      data-avatar={item.iconUrl}
                      data-name={item.name}
                      onClick={() => handleAvatarSelect(item)}
                    >
                      <img src={item.iconUrl} alt={item.name} loading="lazy" />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </header>

        <main className="menu-options">
          <a href="/juegos" className="btn-main btn-play">¡A Jugar!</a>
          <a href="/logros" className="btn-secondary">Mis Logros</a>
          <a href="/les-sorcieres-associe" className="btn-secondary">Les Sorcières - Associe les Émojis</a>
          <button className="btn-secondary" type="button">Opciones</button>
        </main>

        <div className="progress-overview">
          <h3>Tu Progreso</h3>
          <p>Niveles completados: <span id="levels-completed">{progress?.levelsCompleted?.length || 0}</span></p>
          <p>Tiempo total de juego: <span id="time-played">{Math.floor((progress?.timePlayed || 0) / 60)}</span> minutos</p>
        </div>

        <p className="motivational-quote">“¡Un paso más cerca de tu meta!”</p>
      </div>
    </div>
  );
}
