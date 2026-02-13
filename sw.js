const CACHE_NAME = 'liga-v2'; // <--- CAMBIA ESTO A v3, v4 cada vez que actualices
const assets = [
  './', 
  './index.html'
];

// 1. INSTALACIÓN: Descarga los archivos y obliga al SW a activarse
self.addEventListener('install', e => {
  self.skipWaiting(); // Obliga al SW nuevo a tomar el control de inmediato
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// 2. ACTIVACIÓN: Borra los cachés viejos (como 'liga-v1')
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Borrando caché antiguo:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// 3. FETCH: Estrategia "Network First" (Opcional pero recomendada para datos dinámicos)
// Intenta buscar en internet primero, si no hay internet, usa el caché.
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});