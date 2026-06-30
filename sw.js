const CACHE_NAME = 'smart-laundry-v2';
const urlsToCache = [
  './index.html',
  './manjur.png'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Memaksa update service worker seketika
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  // Hapus cache versi lama (v1)
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // Biarkan request API jalan normal
  if (event.request.url.includes('script.google.com')) {
    return;
  }
  
  // STRATEGI NETWORK-FIRST (Utamakan Jaringan Baru, Jatuh ke Cache Jika Offline)
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Jika online, simpan/update HTML terbaru ke dalam cache
        const clonedResponse = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clonedResponse);
        });
        return response;
      })
      .catch(() => {
        // Jika offline (tidak ada internet), tampilkan dari cache lama
        return caches.match(event.request);
      })
  );
});
