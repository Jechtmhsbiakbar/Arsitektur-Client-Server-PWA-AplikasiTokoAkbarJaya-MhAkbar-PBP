const CACHE_NAME = 'toko-pwa-v1';
const urlsToCache = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// ============================================================
// 1. TAHAP INSTALL: Simpan file-file penting ke Cache Browser
// ============================================================
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Membuka cache & menyimpan file...');
        return cache.addAll(urlsToCache);
      })
  );
  // Paksa SW baru langsung aktif tanpa menunggu tab ditutup
  self.skipWaiting();
});

// ============================================================
// 2. TAHAP ACTIVATE: Bersihkan cache lama jika ada update
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
});

// ============================================================
// 3. TAHAP FETCH: Mencegat request. Jika offline, ambil dari Cache!
// ============================================================
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika file ada di cache, kembalikan file tersebut (Offline Mode)
        if (response) {
          console.log('⚡ Dari cache:', event.request.url);
          return response;
        }
        // Jika tidak ada, lanjutkan ambil dari internet (Online Mode)
        return fetch(event.request);
      })
  );
});