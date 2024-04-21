
const CACHE_NAME = 'version-1';
const urlsToCache = [ 'index.html']

// Tapahtuu, kun Service Worker asennetaan
self.addEventListener('install', event => {
    console.log('Service Worker will be installed');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    )

});

self.addEventListener('fetch', event => {

    event.respondWith(
        
        fetch(event.request).catch(error => {
            console.error('Resource retrieval error: ', error);
            
            return caches.match(event.request);
        })
    );
});


self.addEventListener('push', event => {
    const payload = event.data ? event.data.text() : 'no payload';
    event.waitUntil(
      self.registration.showNotification('Push Notification', {
        body: payload
      })
    );
  });