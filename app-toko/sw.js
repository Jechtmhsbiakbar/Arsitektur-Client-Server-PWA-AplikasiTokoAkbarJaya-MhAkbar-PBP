const CACHE_NAME = 'toko-pwa-v5';
const urlsToCache = [
  '/app-toko/',
  '/app-toko/index.html',
  '/app-toko/login.html',
  '/app-toko/app.js',
  '/app-toko/manifest.json',
  '/app-toko/icons/icon-192x192.png',
  '/app-toko/icons/icon-512x512.png',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// ============================================================
// VERSION TRACKING
// ============================================================
const APP_VERSION = 'v5.0';
console.log('🔧 Service Worker Version:', APP_VERSION);

// ============================================================
// 1. INSTALL: Cache file-file penting
// ============================================================
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('📦 Membuka cache & menyimpan file...');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// ============================================================
// 2. ACTIVATE: Hapus cache lama
// ============================================================
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('🗑️ Menghapus cache lama:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();

  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'SW_UPDATED',
        version: APP_VERSION,
        cacheVersion: CACHE_NAME,
        timestamp: new Date().toISOString()
      });
    });
  });
});

// ============================================================
// 3. FETCH: API tidak di-cache, file statis pakai cache
// ============================================================
self.addEventListener('fetch', event => {
  // Jangan cache request ke api-toko (selalu ambil dari network)
  if (event.request.url.includes('/api-toko/')) {
    return event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }

  // File statis: cache first
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});