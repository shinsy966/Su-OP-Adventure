const CACHE_NAME = 'su-op-adventure-v40';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './assets/pwa-icon-192.png',
  './assets/pwa-icon-512.png',
  './assets/augment-icons-v2-chroma.png',
  './assets/augment-speed-boot-chroma.png',
  './assets/augment-attack-speed-winged-gun-chroma.png',
  './assets/sprites-stage2-palette-chroma.png',
  './assets/sprites-stage2-normal-contrast-chroma.png',
  './assets/sprites-stage2-normal-contrast-clean.png',
  './assets/sprites-stage2-dusk-chroma.png',
  './assets/background-snowfield-dusk.png',
  './assets/sprite-player.png',
  './assets/sprite-bat.png',
  './assets/sprite-boss-dragon.png',
  './assets/sprite-boss-golem.png',
  './assets/sprite-slime-zombie.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      }).catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('./index.html')))
  );
});
