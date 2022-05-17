// Check service worker if supported

if('serviceWorker' in navigator) {
    window.addEventListener('load', function(){
        navigator.serviceWorker
        .register('/sample-project/sw_cached_pages.js')
        .then(reg => console.log('Service Worker: Registered'))
        .catch(err => console.log(`Service Worker: Error: ${err}`));
    });
}

