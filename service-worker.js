const CACHE_NAME = 'photofy-cache-v1'; // Cache name
const urlsToCache = [
  '/photofy.html',  // Main HTML file
  '/photofy.css',   // CSS file
  '/main.js',       // JavaScript file
  '/logo2.png',     // Logo image
  '/offline.html'   // Offline fallback page
];

// Install event - Pre-cache important files
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Opened cache and caching files');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();  // Activate the new service worker immediately
});

// Fetch event - Serve cached content or fallback to offline
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Return cached response if found, otherwise try fetching from network
      return response || fetch(event.request).catch(function() {
        // Serve offline.html if both cache and network fail
        return caches.match('/offline.html');
      });
    })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();  // Ensure new service worker controls all clients immediately
});
