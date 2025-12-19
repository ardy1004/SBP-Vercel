// Service Worker for Salam Bumi Property PWA
const CACHE_NAME = 'salam-bumi-property-v1.0.0'
const STATIC_CACHE = 'salam-bumi-static-v1.0.0'
const DYNAMIC_CACHE = 'salam-bumi-dynamic-v1.0.0'
const API_CACHE = 'salam-bumi-api-v1.0.0'

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/properties',
  '/about',
  '/contact',
  '/portfolio',
  '/notaris',
  '/faq',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
]

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/properties',
  '/api/properties/'
]

// Install event - cache static assets with error handling
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker')
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets')
        // Cache assets one by one to handle failures gracefully
        return Promise.allSettled(
          STATIC_ASSETS.map(url =>
            cache.add(url).catch(err => {
              console.warn(`[SW] Failed to cache ${url}:`, err)
              // Continue with other assets even if one fails
              return Promise.resolve()
            })
          )
        )
      })
    ]).then(() => {
      return self.skipWaiting()
    }).catch(err => {
      console.error('[SW] Install failed:', err)
      // Still skip waiting even if caching fails
      return self.skipWaiting()
    })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== API_CACHE)
          .map((cacheName) => {
            console.log('[SW] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          })
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
})

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests
  if (API_ENDPOINTS.some(endpoint => url.pathname.startsWith(endpoint))) {
    event.respondWith(
      caches.open(API_CACHE).then((cache) => {
        return fetch(request)
          .then((response) => {
            // Cache successful GET requests
            if (request.method === 'GET' && response.status === 200) {
              cache.put(request, response.clone())
            }
            return response
          })
          .catch(() => {
            // Return cached version if available
            return cache.match(request).then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse
              }
              // Return offline fallback for properties API
              if (url.pathname.includes('/api/properties')) {
                return new Response(
                  JSON.stringify({
                    properties: [],
                    pagination: { total: 0, page: 1, totalPages: 0 },
                    offline: true,
                    message: 'Anda sedang offline. Data akan diperbarui saat koneksi tersedia.'
                  }),
                  {
                    headers: { 'Content-Type': 'application/json' }
                  }
                )
              }
              throw new Error('Network unavailable')
            })
          })
      })
    )
    return
  }

  // Handle static assets and pages
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200 && request.method === 'GET') {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Return offline fallback for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('/').then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse
              }
              return new Response(
                `
                <!DOCTYPE html>
                <html lang="id">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Salam Bumi Property - Offline</title>
                  <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
                    .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    h1 { color: #3B82F6; margin-bottom: 20px; }
                    p { color: #666; line-height: 1.6; }
                    .retry-btn { background: #3B82F6; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; margin-top: 20px; }
                    .retry-btn:hover { background: #2563EB; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <h1>🔌 Anda Sedang Offline</h1>
                    <p>Maaf, tidak dapat terhubung ke internet saat ini. Beberapa fitur mungkin tidak tersedia.</p>
                    <p>Silakan periksa koneksi internet Anda dan coba lagi.</p>
                    <button class="retry-btn" onclick="window.location.reload()">Coba Lagi</button>
                  </div>
                </body>
                </html>
                `,
                {
                  headers: { 'Content-Type': 'text/html' }
                }
              )
            })
          }

          // For other requests, show network error
          return new Response(
            JSON.stringify({
              error: 'Network unavailable',
              message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
            }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }
          )
        })
    })
  )
})

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag)

  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle any pending background tasks
      Promise.resolve()
    )
  }
})

// Push notifications (for future use with saved searches)
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received')

  if (event.data) {
    const data = event.data.json()

    const options = {
      body: data.body || 'Ada update properti baru!',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/properties'
      },
      actions: [
        {
          action: 'view',
          title: 'Lihat'
        },
        {
          action: 'dismiss',
          title: 'Tutup'
        }
      ]
    }

    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Salam Bumi Property',
        options
      )
    )
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action)

  event.notification.close()

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/properties')
    )
  }
})

// Periodic cache cleanup
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.open(cacheName).then((cache) => {
              return cache.keys().then((keys) => {
                // Remove old entries (keep last 50)
                if (keys.length > 50) {
                  const toDelete = keys.slice(0, keys.length - 50)
                  return Promise.all(
                    toDelete.map((request) => cache.delete(request))
                  )
                }
              })
            })
          })
        )
      })
    )
  }
})