// Service Worker — קוביאות
// Update CACHE version whenever a new app version is deployed.
const CACHE = 'cubeit-v0.23.5';

const STATIC = [
  '/',
  '/index.html',
  '/manifest.json',
  '/data/categories.js',
  '/assets/logo.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Install: cache all static assets
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first for same-origin, network-only for external (Wiktionary, Wikipedia)
self.addEventListener('fetch', e => {
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
