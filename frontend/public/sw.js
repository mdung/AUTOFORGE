// sw.js - Service Worker for Offline Caching Support

const CACHE_NAME = 'autoforge-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Offline fallback for JSON API calls
        if (event.request.headers.get('accept').includes('application/json')) {
          return new Response(JSON.stringify({ offline: true, error: "Internet Connection Lost" }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
      });
    })
  );
});
