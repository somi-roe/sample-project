const cacheStatic = 'site-static-v5';
const cacheDynamic = "site-dynamic-v5"

const cacheAssets = [
    '/',
    '/index.html',
    '/js/main.js',
    '/css/style.css',
    '/fonts/MyriadProRegular.eot',
    '/fonts/MyriadProRegular.woff2',
    '/fonts/MyriadProRegular.woff',
    '/fonts/MyriadProRegular.ttf',
    '/fonts/MyriadProRegular.svg'
];


// install event
self.addEventListener('install', e => {
    console.log("Service Worker Installed");

    e.waitUntil(
        caches.open(cacheStatic)
        .then(cache => {
            console.log('Service Worker Caching Files');
            cache.addAll(cacheAssets);
        })
    );
    
});


// activate event
self.addEventListener('activate', e => {
    console.log("Service Worker Activated");
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== cacheStatic && key !== cacheDynamic)
                .map(key => caches.delete(key))
            )
        })
    );
});


// fetch event
self.addEventListener('fetch', e => {
    console.log("Service Worker Fetching");
    e.respondWith(
        caches.match(e.request)
        .then(cacheRes => {
            return cacheRes || fetch(e.request)
            .then(fetchRes => {
                return caches.open(cacheDynamic).then(cache => {
                    cache.put(e.request.url, fetchRes.clone());
                    return fetchRes;
                })
            });
        }).catch(() => caches.match("/fallback-page.html"))
    );
});