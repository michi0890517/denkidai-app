const CACHE = 'denkidai-v3-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest'
];

// インストール時にキャッシュ
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});

// 更新反映＆古いキャッシュ削除
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// オンライン優先＋失敗時はキャッシュ
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(cache => cache.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
