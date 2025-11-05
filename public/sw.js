self.addEventListener('install', () => {
  console.log('Custom SW installed')
  self.skipWaiting()
})

self.addEventListener('activate', () => {
  console.log('Custom SW activated')
  return self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  // No caching at all
  e.respondWith(fetch(e.request))
})
