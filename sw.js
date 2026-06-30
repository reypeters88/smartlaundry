const CACHE_NAME = 'smart-laundry-v1';
const urlsToCache = [
  './index.html',
  './manjur.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Hanya intercept request untuk aset statis lokal
  if (event.request.url.includes('script.google.com')) {
    // Biarkan request ke API Google Apps Script berjalan normal (selalu ambil yang terbaru)
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Return dari cache jika ada
        }
        return fetch(event.request);
      })
  );
});
