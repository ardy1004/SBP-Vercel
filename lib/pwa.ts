// PWA utilities for service worker registration and management

export const registerServiceWorker = async () => {
  if (typeof window === 'undefined') return

  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      console.log('[PWA] Service worker registered:', registration.scope)

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              console.log('[PWA] New version available')
              // You could show a notification to the user here
            }
          })
        }
      })

      return registration
    } catch (error) {
      console.error('[PWA] Service worker registration failed:', error)
    }
  } else {
    console.warn('[PWA] Service workers not supported')
  }
}

export const unregisterServiceWorker = async () => {
  if (typeof window === 'undefined') return

  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready
      await registration.unregister()
      console.log('[PWA] Service worker unregistered')
    } catch (error) {
      console.error('[PWA] Service worker unregistration failed:', error)
    }
  }
}

export const updateServiceWorker = async () => {
  if (typeof window === 'undefined') return

  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready
      await registration.update()
      console.log('[PWA] Service worker updated')
    } catch (error) {
      console.error('[PWA] Service worker update failed:', error)
    }
  }
}

export const requestNotificationPermission = async () => {
  if (typeof window === 'undefined') return false

  if ('Notification' in window) {
    try {
      const permission = await Notification.requestPermission()
      console.log('[PWA] Notification permission:', permission)
      return permission === 'granted'
    } catch (error) {
      console.error('[PWA] Notification permission request failed:', error)
      return false
    }
  }

  return false
}

export const sendNotification = (title: string, options?: NotificationOptions) => {
  if (typeof window === 'undefined') return

  if ('serviceWorker' in navigator && 'Notification' in window) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        ...options
      })
    })
  }
}

export const isPWAInstalled = () => {
  if (typeof window === 'undefined') return false

  // Check if running in standalone mode
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true
}

export const isOnline = () => {
  if (typeof window === 'undefined') return true

  return navigator.onLine
}

export const cleanServiceWorkerCache = () => {
  if (typeof window === 'undefined') return

  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CLEAN_CACHE'
    })
  }
}

// Utility to check PWA capabilities
export const getPWACapabilities = () => {
  if (typeof window === 'undefined') {
    return {
      serviceWorker: false,
      notifications: false,
      installPrompt: false,
      online: false
    }
  }

  return {
    serviceWorker: 'serviceWorker' in navigator,
    notifications: 'Notification' in window,
    installPrompt: 'onbeforeinstallprompt' in window,
    online: navigator.onLine
  }
}