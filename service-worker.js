// Minimal development service worker stub.
// Prevents 404 errors during registration without caching logic.
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let the network handle all requests; this SW only exists to satisfy registration.
});
