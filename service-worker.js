const CACHE_NAME = 'rangrasika-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/assets/css/main.css',
    '/assets/css/components/hero.css',
    '/assets/css/components/navigation.css',
    '/assets/css/components/gallery.css',
    '/assets/css/components/pricing.css',
    '/assets/css/components/contact.css',
    '/assets/css/utilities/animations.css',
    '/assets/css/utilities/variables.css',
    '/assets/css/utilities/responsive.css',
    '/assets/js/main.js',
    '/assets/js/modules/navigation.js',
    '/assets/js/modules/hero-animations.js',
    '/assets/js/modules/gallery-manager.js',
    '/assets/js/modules/pricing-reveal.js',
    '/assets/js/modules/contact-manager.js',
    '/assets/js/vendors/intersection-observer-polyfill.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-brands-400.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-solid-900.woff2',
    '/assets/images/rangrasika.png',
    '/assets/images/hero/hero-bg.jpg',
    '/assets/images/services/beauty/makeup.jpg',
    '/assets/images/services/beauty/facial.jpg',
    '/assets/images/services/mehendi/bridal.jpg',
    '/assets/images/services/mehendi/party.jpg',
    '/assets/images/services/clothing/saree.jpg',
    '/assets/images/services/clothing/designer.jpg',
    '/assets/images/services/jewelry/bridal.jpg'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached response if found
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                // Make network request and cache the response
                return fetch(fetchRequest)
                    .then((response) => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        // Cache the response
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Return offline page or fallback content
                        return caches.match('/offline.html');
                    });
            })
    );
}); 