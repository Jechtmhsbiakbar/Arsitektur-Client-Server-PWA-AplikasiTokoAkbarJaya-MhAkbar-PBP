const CACHE_NAME = 'toko-pwa-v4';
const urlsToCache = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// ============================================================
// VERSION TRACKING (Update ini setiap kali ada perubahan code)
// ============================================================
const APP_VERSION = 'v4.0';
console.log('🔧 Service Worker Version:', APP_VERSION);

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
  
  // Claim semua clients agar SW baru immediately mengendalikan halaman
  self.clients.claim();
  
  // 🆕 KIRIM PESAN KE SEMUA CLIENTS BAHWA ADA UPDATE
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
// 3. TAHAP FETCH: Mencegat request. Jika offline, ambil dari Cache!
// ============================================================
// ============================================================
// 3. TAHAP FETCH: Mencegat request. 
// ============================================================
self.addEventListener('fetch', event => {
  // JIKA REQUEST ADALAH API (ke folder api-toko), JANGAN AMBIL DARI CACHE!
  if (event.request.url.includes('api-toko')) {
    return event.respondWith(
      fetch(event.request).catch(() => {
        // Opsi: Jika benar-benar offline, baru ambil dari cache atau berikan respon error
        return caches.match(event.request);
      })
    );
  }

  // UNTUK FILE STATIS (HTML, CSS, JS, Gambar) Tetap gunakan Cache First
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});