'use client';

import { useEffect } from 'react';
import { usePerformanceMonitor } from '@/hooks/use-performance';

export function PerformanceMonitor() {
  const { getPerformanceScore, logPerformanceMetrics, isLoaded } = usePerformanceMonitor();

  useEffect(() => {
    if (!isLoaded) return;

    // Log performance metrics after page load
    const timer = setTimeout(() => {
      logPerformanceMetrics();
    }, 1000);

    return () => clearTimeout(timer);
  }, [isLoaded, logPerformanceMetrics]);

  // Development-only performance display
  if (process.env.NODE_ENV === 'development') {
    const score = getPerformanceScore();

    if (!score) return null;

    return (
      <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50 max-w-xs">
        <div className="font-bold mb-2">🚀 Performance Score</div>
        <div className="space-y-1">
          <div>Overall: <span className={`font-bold ${
            score.overall >= 80 ? 'text-green-400' :
            score.overall >= 50 ? 'text-yellow-400' : 'text-red-400'
          }`}>{score.overall}/100</span></div>
          <div>FCP: {score.metrics.fcp.toFixed(0)}ms</div>
          <div>LCP: {score.metrics.lcp.toFixed(0)}ms</div>
          <div>FID: {score.metrics.fid.toFixed(0)}ms</div>
          <div>CLS: {score.metrics.cls.toFixed(3)}</div>
        </div>
      </div>
    );
  }

  return null;
}