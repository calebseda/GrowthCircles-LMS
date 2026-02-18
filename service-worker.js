// service-worker.js
// GrowthCircles LMS offline-first caching

const CACHE_NAME = "growthcircles-cache-v1";
const urlsToCache = [
  "/",                        // root
  "/index.html",
  "/signup.html",
  "/completeStarterCourse.html",
  "/css/style.css",
  "/js/main.js",
  "/data/dreamertrack.json",
  "/data/course2.json",
  "/assets/images/logo.png"
  // add more assets as needed
];

// Install event: cache essential files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching essential assets");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event: cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Fetch event: serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Optional: fallback offline page
        if (event.request.destination === "document") {
          return caches.match("/index.html");
        }
      });
    })
  );
});
