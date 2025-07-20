// Basic performance monitoring and error tracking

export function reportWebVitals(metric: any) {
  // Example: send to analytics endpoint or log
  console.log('Web Vitals:', metric);
}

export function setupErrorTracking() {
  window.onerror = function (message, source, lineno, colno, error) {
    // Send error to monitoring service or log
    console.error('Global error:', { message, source, lineno, colno, error });
  };
}

export function startPerformanceMonitoring() {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = window.performance.timing;
        console.log('Performance timing:', timing);
      }, 0);
    });
  }
} 