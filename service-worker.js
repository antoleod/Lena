const CACHE_NAME = 'lena-cache-v3';

// List of core resources to cache for offline use. Adjust as needed.
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/html/login.html',
  '/manifest.json',
  '/css/style.css',
  '/css/login.css',
  '/css/feedback-system.css',
  '/css/new-games.css',
  '/js/feedbackSystem.js',
  '/js/avatarData.js',
  '/js/storage.js',
  '/js/login.js',
  '/js/new-games/registry.js',
  '/js/new-games/engine.js',
  '/js/new-games/qa.js',
  '/games/riddleLevels.js',
  '/games/storySets.js',
  '/assets/i18n/fr.json',
  '/assets/i18n/es.json',
  '/assets/i18n/nl.json',
  '/assets/iconos/icon-1024.png',
  '/assets/iconos/icon-512.png',
  '/assets/iconos/icon-384.png',
  '/assets/iconos/icon-256.png',
  '/assets/iconos/icon-192.png',
  '/assets/iconos/icon-180.png',
  '/assets/iconos/icon-167.png',
  '/assets/iconos/icon-152.png',
  '/assets/iconos/icon-144.png',
  '/assets/iconos/icon-128.png',
  '/assets/iconos/icon-120.png',
  '/assets/iconos/icon-96.png',
  '/assets/iconos/icon-72.png',
  '/assets/iconos/icon-64.png',
  '/assets/iconos/icon-48.png',
  '/assets/iconos/icon-32.png',
  '/assets/iconos/icon-16.png',
  '/offline.html',
  '/html/game.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
        return null;
      })
    )).then(() => self.clients.claim())
  );
});

// Allow the page to trigger skipWaiting via postMessage
self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Cache-first strategy with network fallback. If network succeeds, update cache.
self.addEventListener('fetch', (event) => {
  // Only handle same-origin requests
  const request = event.request;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        // Try network in background to update cache
        fetch(request).then((response) => {
          if (response && response.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
          }
        }).catch(() => {});
        return cached;
      }
      return fetch(request).then((response) => {
        // Put a copy in cache for next time
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => {
        // Fallbacks for navigation requests
        if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
          return caches.match('/html/login.html');
        }
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      });
    })
  );
});
