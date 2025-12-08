import { useEffect, useState, useCallback } from 'react';

// Performance monitoring hook
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    fcp: 0, // First Contentful Paint
    lcp: 0, // Largest Contentful Paint
    fid: 0, // First Input Delay
    cls: 0, // Cumulative Layout Shift
    ttfb: 0, // Time to First Byte
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Performance observer for LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
    });

    // Performance observer for CLS
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      setMetrics(prev => ({ ...prev, cls: clsValue }));
    });

    // Performance observer for FID
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        setMetrics(prev => ({ ...prev, fid: (entry as any).processingStart - entry.startTime }));
      });
    });

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (error) {
      console.warn('Performance monitoring not fully supported:', error);
    }

    // Get navigation timing for additional metrics
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      setMetrics(prev => ({
        ...prev,
        ttfb: navigation.responseStart - navigation.requestStart
      }));
    }

    // Get paint timing for FCP
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach((entry) => {
      if (entry.name === 'first-contentful-paint') {
        setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
      }
    });

    setIsLoaded(true);

    return () => {
      lcpObserver.disconnect();
      clsObserver.disconnect();
      fidObserver.disconnect();
    };
  }, []);

  const getPerformanceScore = useCallback(() => {
    if (!isLoaded) return null;

    // Calculate scores based on web vitals thresholds
    const fcpScore = metrics.fcp <= 1800 ? 100 : metrics.fcp <= 3000 ? 50 : 0;
    const lcpScore = metrics.lcp <= 2500 ? 100 : metrics.lcp <= 4000 ? 50 : 0;
    const fidScore = metrics.fid <= 100 ? 100 : metrics.fid <= 300 ? 50 : 0;
    const clsScore = metrics.cls <= 0.1 ? 100 : metrics.cls <= 0.25 ? 50 : 0;

    const overallScore = Math.round((fcpScore + lcpScore + fidScore + clsScore) / 4);

    return {
      overall: overallScore,
      breakdown: { fcpScore, lcpScore, fidScore, clsScore },
      metrics
    };
  }, [metrics, isLoaded]);

  const logPerformanceMetrics = useCallback(() => {
    if (typeof window === 'undefined') return;

    const score = getPerformanceScore();
    if (score) {
      console.log('🚀 Performance Metrics:', {
        score: score.overall,
        metrics: score.metrics,
        breakdown: score.breakdown,
        url: window.location.href,
        timestamp: new Date().toISOString()
      });

      // In production, send to analytics service
      if (process.env.NODE_ENV === 'production') {
        // Example: send to Google Analytics or custom analytics
        try {
          // gtag('event', 'web_vitals', {
          //   custom_map: { metric_value: score.overall },
          //   event_category: 'Web Vitals',
          //   event_label: window.location.href,
          //   value: score.overall
          // });
        } catch (error) {
          console.warn('Failed to send performance metrics:', error);
        }
      }
    }
  }, [getPerformanceScore]);

  return {
    metrics,
    isLoaded,
    getPerformanceScore,
    logPerformanceMetrics
  };
}

// Cache hook for expensive operations
export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minutes default
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const cacheKey = `cache_${key}`;
    const timestampKey = `timestamp_${key}`;

    // Check cache
    const cached = localStorage.getItem(cacheKey);
    const timestamp = localStorage.getItem(timestampKey);

    if (cached && timestamp) {
      const age = Date.now() - parseInt(timestamp);
      if (age < ttl) {
        try {
          setData(JSON.parse(cached));
          return;
        } catch (error) {
          console.warn('Failed to parse cached data:', error);
        }
      }
    }

    // Fetch fresh data
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);

      // Cache the result
      localStorage.setItem(cacheKey, JSON.stringify(result));
      localStorage.setItem(timestampKey, Date.now().toString());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const invalidateCache = useCallback(() => {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(`cache_${key}`);
    localStorage.removeItem(`timestamp_${key}`);
    fetchData();
  }, [key, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    invalidateCache
  };
}

// Image preloading hook
export function useImagePreloader(urls: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const preloadImages = useCallback(async () => {
    if (urls.length === 0) return;

    setLoading(true);
    const promises = urls.map((url) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, url]));
          resolve();
        };
        img.onerror = reject;
        img.src = url;
      });
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      console.warn('Some images failed to preload:', error);
    } finally {
      setLoading(false);
    }
  }, [urls]);

  useEffect(() => {
    preloadImages();
  }, [preloadImages]);

  return {
    loadedImages,
    loading,
    isLoaded: loadedImages.size === urls.length
  };
}

// Bundle size monitoring (requires webpack-bundle-analyzer to be installed)
export function useBundleAnalyzer() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📦 Bundle analysis available via Next.js config');
      console.log('💡 Run: npm install --save-dev webpack-bundle-analyzer');
      console.log('💡 Then: npm run build --analyze');
    }
  }, []);
}