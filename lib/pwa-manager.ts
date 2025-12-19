// PWA Manager for Offline Capabilities and Enhanced Mobile Experience

export interface PWACapabilities {
  isInstalled: boolean
  canInstall: boolean
  isOnline: boolean
  cacheStatus: 'empty' | 'partial' | 'full'
  storageEstimate?: {
    quota: number
    usage: number
    available: number
  }
}

export interface CachedResource {
  url: string
  type: 'page' | 'image' | 'api' | 'script' | 'style'
  timestamp: number
  size: number
  priority: 'high' | 'medium' | 'low'
}

export interface OfflineQueueItem {
  id: string
  type: 'search' | 'favorite' | 'contact' | 'share'
  data: Record<string, any>
  timestamp: Date
  retryCount: number
}

export class PWAManager {
  private static instance: PWAManager
  private deferredPrompt: any = null
  private isOnline: boolean = true
  private cacheName = 'salambumi-v1'
  private offlineQueue: OfflineQueueItem[] = []

  public static getInstance(): PWAManager {
    if (!PWAManager.instance) {
      PWAManager.instance = new PWAManager()
    }
    return PWAManager.instance
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializePWA()
      this.setupNetworkMonitoring()
      this.loadOfflineQueue()
    }
  }

  /**
   * Initialize PWA functionality
   */
  private initializePWA(): void {
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      this.deferredPrompt = e
    })

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null
      console.log('PWA installed successfully')
    })

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration)
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error)
        })
    }
  }

  /**
   * Setup network monitoring
   */
  private setupNetworkMonitoring(): void {
    // Online/offline detection
    window.addEventListener('online', () => {
      this.isOnline = true
      this.processOfflineQueue()
      this.showOnlineNotification()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      this.showOfflineNotification()
    })

    this.isOnline = navigator.onLine
  }

  /**
   * Get PWA capabilities
   */
  async getCapabilities(): Promise<PWACapabilities> {
    const isInstalled = this.isPWAINstalled()
    const canInstall = this.canInstallPWA()
    const cacheStatus = await this.getCacheStatus()
    const storageEstimate = await this.getStorageEstimate()

    return {
      isInstalled,
      canInstall,
      isOnline: this.isOnline,
      cacheStatus,
      storageEstimate
    }
  }

  /**
   * Install PWA
   */
  async installPWA(): Promise<boolean> {
    if (!this.deferredPrompt) return false

    this.deferredPrompt.prompt()
    const { outcome } = await this.deferredPrompt.userChoice

    this.deferredPrompt = null
    return outcome === 'accepted'
  }

  /**
   * Cache resources for offline use
   */
  async cacheResources(resources: CachedResource[]): Promise<void> {
    if (!('caches' in window)) return

    const cache = await caches.open(this.cacheName)

    for (const resource of resources) {
      try {
        await cache.add(resource.url)
      } catch (error) {
        console.warn(`Failed to cache ${resource.url}:`, error)
      }
    }
  }

  /**
   * Pre-cache essential resources
   */
  async precacheEssentials(): Promise<void> {
    const essentialResources: CachedResource[] = [
      { url: '/', type: 'page', timestamp: Date.now(), size: 0, priority: 'high' },
      { url: '/properties', type: 'page', timestamp: Date.now(), size: 0, priority: 'high' },
      { url: '/api/properties', type: 'api', timestamp: Date.now(), size: 0, priority: 'high' },
      // Add more essential resources as needed
    ]

    await this.cacheResources(essentialResources)
  }

  /**
   * Queue action for offline execution
   */
  queueOfflineAction(type: OfflineQueueItem['type'], data: Record<string, any>): void {
    const queueItem: OfflineQueueItem = {
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: new Date(),
      retryCount: 0
    }

    this.offlineQueue.push(queueItem)
    this.saveOfflineQueue()

    if (!this.isOnline) {
      this.showQueuedNotification(type)
    }
  }

  /**
   * Process offline queue when back online
   */
  private async processOfflineQueue(): Promise<void> {
    if (this.offlineQueue.length === 0) return

    const queueToProcess = [...this.offlineQueue]
    this.offlineQueue = []

    for (const item of queueToProcess) {
      try {
        await this.executeQueuedAction(item)
      } catch (error) {
        console.error(`Failed to execute queued action ${item.id}:`, error)
        item.retryCount++

        // Re-queue if retry count is below limit
        if (item.retryCount < 3) {
          this.offlineQueue.push(item)
        }
      }
    }

    this.saveOfflineQueue()
  }

  /**
   * Execute a queued action
   */
  private async executeQueuedAction(item: OfflineQueueItem): Promise<void> {
    switch (item.type) {
      case 'search':
        // Execute search when back online
        console.log('Executing queued search:', item.data)
        break
      case 'favorite':
        // Sync favorite status
        console.log('Executing queued favorite:', item.data)
        break
      case 'contact':
        // Send contact form
        console.log('Executing queued contact:', item.data)
        break
      case 'share':
        // Process share action
        console.log('Executing queued share:', item.data)
        break
    }
  }

  /**
   * Get cached data for offline use
   */
  async getCachedData(key: string): Promise<any> {
    if (!('caches' in window)) return null

    try {
      const cache = await caches.open(this.cacheName)
      const response = await cache.match(`/api/cache/${key}`)

      if (response) {
        return await response.json()
      }
    } catch (error) {
      console.warn('Failed to get cached data:', error)
    }

    return null
  }

  /**
   * Store data for offline use
   */
  async setCachedData(key: string, data: any): Promise<void> {
    if (!('caches' in window)) return

    try {
      const cache = await caches.open(this.cacheName)
      const response = new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      })

      await cache.put(`/api/cache/${key}`, response)
    } catch (error) {
      console.warn('Failed to cache data:', error)
    }
  }

  /**
   * Clear all cached data
   */
  async clearCache(): Promise<void> {
    if (!('caches' in window)) return

    try {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
    } catch (error) {
      console.warn('Failed to clear cache:', error)
    }
  }

  /**
   * Get push notification permission
   */
  async getNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) return 'denied'

    return Notification.permission
  }

  /**
   * Request push notification permission
   */
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) return 'denied'

    try {
      const permission = await Notification.requestPermission()
      return permission
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      return 'denied'
    }
  }

  /**
   * Show push notification
   */
  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!('Notification' in window) || Notification.permission !== 'granted') return

    try {
      const notification = new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        ...options
      })

      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000)
    } catch (error) {
      console.error('Failed to show notification:', error)
    }
  }

  /**
   * Share content using Web Share API
   */
  async shareContent(data: ShareData): Promise<boolean> {
    if (!navigator.share) return false

    try {
      await navigator.share(data)
      return true
    } catch (error) {
      console.error('Failed to share content:', error)
      return false
    }
  }

  /**
   * Get device vibration support
   */
  getVibrationSupport(): boolean {
    return 'vibrate' in navigator
  }

  /**
   * Trigger device vibration
   */
  vibrate(pattern: number | number[]): void {
    if (this.getVibrationSupport()) {
      navigator.vibrate(pattern)
    }
  }

  private isPWAINstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true
  }

  private canInstallPWA(): boolean {
    return this.deferredPrompt !== null
  }

  private async getCacheStatus(): Promise<PWACapabilities['cacheStatus']> {
    if (!('caches' in window)) return 'empty'

    try {
      const cache = await caches.open(this.cacheName)
      const keys = await cache.keys()

      if (keys.length === 0) return 'empty'
      if (keys.length < 10) return 'partial'
      return 'full'
    } catch (error) {
      return 'empty'
    }
  }

  private async getStorageEstimate(): Promise<PWACapabilities['storageEstimate']> {
    if (!('storage' in navigator && 'estimate' in navigator.storage)) return undefined

    try {
      const estimate = await navigator.storage.estimate()
      return {
        quota: estimate.quota || 0,
        usage: estimate.usage || 0,
        available: (estimate.quota || 0) - (estimate.usage || 0)
      }
    } catch (error) {
      return undefined
    }
  }

  private loadOfflineQueue(): void {
    if (typeof window !== 'undefined') {
      try {
        const queue = localStorage.getItem('offline_queue')
        if (queue) {
          this.offlineQueue = JSON.parse(queue).map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp)
          }))
        }
      } catch (error) {
        console.warn('Failed to load offline queue:', error)
      }
    }
  }

  private saveOfflineQueue(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('offline_queue', JSON.stringify(this.offlineQueue))
      } catch (error) {
        console.warn('Failed to save offline queue:', error)
      }
    }
  }

  private showOnlineNotification(): void {
    this.showNotification('Koneksi Terhubung', {
      body: 'Anda kembali online. Menyinkronkan data...',
      icon: '/icon-192x192.png'
    })
  }

  private showOfflineNotification(): void {
    this.showNotification('Mode Offline', {
      body: 'Anda sedang offline. Beberapa fitur mungkin terbatas.',
      icon: '/icon-192x192.png'
    })
  }

  private showQueuedNotification(type: OfflineQueueItem['type']): void {
    const messages = {
      search: 'Pencarian akan disimpan dan dieksekusi saat online',
      favorite: 'Status favorit akan disinkronkan saat online',
      contact: 'Pesan kontak akan dikirim saat online',
      share: 'Aksi bagikan akan diproses saat online'
    }

    this.showNotification('Aksi Disimpan', {
      body: messages[type],
      icon: '/icon-192x192.png'
    })
  }
}

// Export singleton instance
export const pwaManager = PWAManager.getInstance()