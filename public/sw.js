const CACHE_NAME = "unpam-agenda-v1";
const STATIC_ASSETS = [
	"./",
	"./index.html",
	"./kalender-akademik.json",
	"./icon.png",
	"./icon-512px.png",
	"./favicon.svg",
	"./og-image.png",
	"./site.webmanifest",
	"./llms.txt",
];

// Install event: Pre-cache core shell and data
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(STATIC_ASSETS);
		}),
	);
	self.skipWaiting();
});

// Activate event: Clean up obsolete caches
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((keys) => {
			return Promise.all(
				keys.map((key) => {
					if (key !== CACHE_NAME) {
						return caches.delete(key);
					}
				}),
			);
		}),
	);
	self.clients.claim();
});

// Fetch event: Stale-While-Revalidate for dynamic data and cache-first for static assets
self.addEventListener("fetch", (event) => {
	const request = event.request;

	// Only handle GET requests
	if (request.method !== "GET") return;

	const url = new URL(request.url);

	// Handle API / kalender-akademik.json with Stale-While-Revalidate
	if (url.pathname.endsWith(".json")) {
		event.respondWith(
			caches.open(CACHE_NAME).then(async (cache) => {
				const cachedResponse = await cache.match(request);
				const networkFetch = fetch(request)
					.then((networkResponse) => {
						if (networkResponse && networkResponse.status === 200) {
							cache.put(request, networkResponse.clone());
						}
						return networkResponse;
					})
					.catch(() => cachedResponse);

				return cachedResponse || networkFetch;
			}),
		);
		return;
	}

	// For all other requests: Cache first, fallback to network
	event.respondWith(
		caches.match(request).then((cached) => {
			if (cached) return cached;

			return fetch(request)
				.then((response) => {
					if (
						!response ||
						response.status !== 200 ||
						(response.type !== "basic" && response.type !== "cors")
					) {
						return response;
					}

					const responseToCache = response.clone();
					caches.open(CACHE_NAME).then((cache) => {
						cache.put(request, responseToCache);
					});

					return response;
				})
				.catch(() => {
					// Offline fallback
					if (request.mode === "navigate") {
						return (
							caches.match("./") || caches.match("./index.html")
						);
					}
				});
		}),
	);
});
