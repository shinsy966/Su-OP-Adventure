const CACHE_NAME = 'su-op-adventure-v2';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './assets/pwa-icon-192.png',
  './assets/pwa-icon-512.png',
  './assets/augment-winged-shoe.png',
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
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('./index.html')))
  );
});
