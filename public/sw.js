// Service Worker Lifecycle Events

const cacheName = "app-shell-rsrs";
const assets = [
    ".",
    "/"
];

// Event: Install
self.addEventListener('install', evt => {
    console.log('Service Worker: Installed');
    evt.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(assets)
                .then(() => {
                    console.log('Resources cached successfully');
                })
                .catch(error => {
                    console.error('Cache.addAll error:', error);
                });
        })
    );
});

// Event: Activate
self.addEventListener('activate', evt => {
    console.log('Service Worker: Activated');
});

// Event: Fetch
self.addEventListener('fetch', evt => {
    //console.log('Intercepting fetch request for: ' + evt.request.url);
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request);
        })
    );
});


