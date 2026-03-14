const CACHE_NAME = 'lena-cache-v8';

const BASE_PATH = (() => {
  const scope = self.registration?.scope || `${self.location.origin}/`;
  const url = new URL(scope);
  return url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
})();

const CORE_ASSETS = [
  'index.html',
  'manifest.json',
  'offline.html',
  'assets/i18n/fr.json',
  'assets/i18n/es.json',
  'assets/i18n/nl.json',
  'assets/iconos/icon-512.png',
  'assets/iconos/icon-192.png',
  'assets/iconos/icon-180.png',
  'assets/iconos/icon-32.png'
];

function withBase(path) {
  return new URL(path, self.location.origin + BASE_PATH).toString();
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS.map(withBase)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin || request.headers.has('range')) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response?.ok) {
            const cacheCopy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(withBase('index.html'), cacheCopy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(withBase('index.html'));
          return cached || fetch(withBase('index.html'));
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        fetch(request).then((response) => {
          if (response?.ok && response.status !== 206) {
            const cacheCopy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, cacheCopy));
          }
        }).catch(() => {});
        return cached;
      }

      return fetch(request)
        .then((response) => {
          if (response?.ok && response.status !== 206) {
            const cacheCopy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, cacheCopy));
          }
          return response;
        })
        .catch(() => new Response('Offline', { status: 503, statusText: 'Offline' }));
    })
  );
});
