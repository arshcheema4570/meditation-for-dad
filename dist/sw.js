const CACHE = 'meditation-shell-v6'; // bump on every release: the shell (index.html) is cache-first, so a stale cache would keep serving the old page (and its deleted hashed asset)
// Cache API buckets the Kokoro voice keeps its downloaded files in — never
// delete these on SW update, or the ~137 MB model would re-download every release.
const KEEP = new Set([CACHE, 'transformers-cache', 'kokoro-voices']);
const SHELL = ['./', './index.html', './manifest.json', './icons/icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => !KEEP.has(key)).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return; // Phonon weights (cross-origin) use their own Cache API store
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match('./index.html'))));
});
