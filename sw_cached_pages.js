const cacheName = 'v1';

const cacheAssets = [
    '/sample-project/index.html',
    '/sample-project/about.html',
    '/sample-project/css/style.css',
    '/sample-project/js/main.js',
    '/sample-project/images/banner.png',
    '/sample-project/images/red-car.png',
    '/sample-project/images/white-car.png'
];


// call install event
self.addEventListener('install', function (e){
    console.log('Service Worker: Installed');

    e.waitUntil(
        caches
        .open(cacheName)
        .then(cache => {
            console.log('Service Worker: Caching Files');
            cache.addAll(cacheAssets);
        })
        .then(() => self.skipWaiting())
    );
});


// call activate event
self.addEventListener('activate', function (e){
    console.log('Service Worker: Activated');

    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            )
        })
    );
});

// call fetch event
self.addEventListener('fetch', function(e){
    console.log('Service Worker: Fetching');
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});