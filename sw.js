/* Service Worker: macht die App offline nutzbar.
   Bei jeder Änderung an der App die Versionsnummer erhöhen, damit das Handy die neue Version lädt. */
const CACHE = 'lingua-v1.3.0';
const FILES = [
  './', './index.html', './css/style.css', './js/app.js', './lang/fr/pack.js', './lang/fr/vocab-extra.js', './lang/fr/gaps-extra.js', './lang/fr/quiz-extra.js', './lang/fr/test-extra.js',
  './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

// Zuerst aus dem Cache (offline), sonst aus dem Netz
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() => (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()));
    })
  );
});
