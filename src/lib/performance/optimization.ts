export class PerformanceOptimizer {
  static preloadCalculatorAssets(calculatorIds: string[]): void {
    if (typeof window === 'undefined') return;

    calculatorIds.forEach((id) => {
      // Preload calculator page
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = `/calculators/${id}`;
      document.head.appendChild(link);

      // Preload Open Graph image
      const imgLink = document.createElement('link');
      imgLink.rel = 'prefetch';
      imgLink.href = `/api/og/calculator/${id}`;
      document.head.appendChild(imgLink);
    });
  }

  static optimizeImageLoading(): void {
    if (typeof window === 'undefined') return;

    // Add loading="lazy" to images
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach((img) => {
      img.setAttribute('loading', 'lazy');
    });
  }

  static enableServiceWorker(): void {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }

  static measureCalculationPerformance<T>(
    operation: () => T,
    operationName: string
  ): { result: T; duration: number } {
    const startTime = performance.now();
    const result = operation();
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (process.env.NODE_ENV === 'development') {
      console.log(`${operationName} took ${duration.toFixed(2)}ms`);
    }

    return { result, duration };
  }

  static generateMetrics(): {
    loadTime: number;
    renderTime: number;
    interactiveTime: number;
  } {
    if (typeof window === 'undefined') {
      return { loadTime: 0, renderTime: 0, interactiveTime: 0 };
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      renderTime: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      interactiveTime: navigation.domInteractive - navigation.fetchStart,
    };
  }
}
