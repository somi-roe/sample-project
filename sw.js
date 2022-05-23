const cacheStatic = 'site-static-v5';
const cacheDynamic = "site-dynamic-v5"

const cacheAssets = [
    '/sample-project/index.html',
    '/sample-project/js/main.js',
    '/sample-project/css/style.css',
    '/sample-project/fonts/MyriadProLight.woff',
    '/sample-project/fonts/MyriadProRegular.woff',
    '/sample-project/fonts/MyriadProSemiBold.woff',
    '/sample-project/fonts/MyriadProBold.woff',
    '/sample-project/fonts/LatoThin.woff2',
    '/sample-project/fonts/LatoThin.woff',
    '/sample-project/fonts/LatoLight.woff2',
    '/sample-project/fonts/LatoLight.woff',
    '/sample-project/fonts/LatoRegular.woff2',
    '/sample-project/fonts/LatoRegular.woff',
    '/sample-project/fonts/LatoBold.woff2',
    '/sample-project/fonts/LatoBold.woff',
    '/sample-project/fonts/LatoBlack.woff2',
    '/sample-project/fonts/LatoBlack.woff',
    '/sample-project/fonts/CenturyGothicBoldCenturyGothicBold.woff2',
    '/sample-project/fonts/CenturyGothicBoldCenturyGothicBold.woff',
    '/sample-project/fonts/CenturyGothicCenturyGothicRegular.woff2',
    '/sample-project/fonts/CenturyGothicCenturyGothicRegular.woff',
    '/sample-project/fonts/icomoon.eot',
    '/sample-project/fonts/icomoon.ttf',
    '/sample-project/fonts/icomoon.woff',
    '/sample-project/fonts/icomoon.svg',
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