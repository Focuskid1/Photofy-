const CACHE_NAME = "offline-cache-v2"; // Update the cache name when modifying the service worker
const OFFLINE_URL = "/offline.html";

// List of routes/files to pre-cache
const urlsToCache = [
  "/",
  "/blog/",
  "/blog",
  "/contact",
  "/resume",
  OFFLINE_URL // Ensure the fallback offline page is cached
];

// Install event - Preload cache
self.addEventListener("install", function(event) {
  console.log("Service Worker installing and pre-caching...");
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log("Caching important routes");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Activate the new service worker immediately
});

// Fetch event - Serve from cache or fallback
self.addEventListener("fetch", function(event) {
  event.respondWith(
    checkResponse(event.request).catch(function() {
      return returnFromCache(event.request);
    })
  );
  event.waitUntil(addToCache(event.request));
});

// Check if the response is OK (not 404 or other errors)
const checkResponse = function(request) {
  return fetch(request).then(function(response) {
    if (response.ok) {
      return response;
    } else {
      return Promise.reject('Request failed with status: ' + response.status);
    }
  }).catch(function(error) {
    console.log("Network request failed. Serving fallback.", error);
    return caches.match(OFFLINE_URL); // Serve offline.html for failed network requests
  });
};

// Add fetched requests to the cache
const addToCache = function(request) {
  return caches.open(CACHE_NAME).then(function(cache) {
    return fetch(request).then(function(response) {
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response; // Don't cache non-OK responses
      }
      console.log(response.url + " added to cache");
      return cache.put(request, response.clone()).then(() => response);
    });
  });
};

// Serve cached content or fallback to offline page
const returnFromCache = function(request) {
  return caches.open(CACHE_NAME).then(function(cache) {
    return cache.match(request).then(function(matching) {
      if (!matching) {
        return caches.match(OFFLINE_URL); // Serve offline page if request not found in cache
      }
      return matching; // Serve cached response
    });
  });
};

// Activate event - Clean up old caches
self.addEventListener("activate", function(event) {
  const cacheWhitelist = [CACHE_NAME]; // Keep the current cache
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Ensure new service worker controls all clients immediately
});
