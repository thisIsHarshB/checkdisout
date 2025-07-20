// Basic analytics tracking (can be integrated with Google Analytics, Plausible, etc.)

export function trackPageView(url: string) {
  // Example: window.gtag('config', 'GA_MEASUREMENT_ID', { page_path: url });
  // Add integration code here
  console.log('Page view:', url);
}

export function trackEvent({ action, category, label, value }: { action: string; category?: string; label?: string; value?: number }) {
  // Example: window.gtag('event', action, { event_category: category, event_label: label, value });
  // Add integration code here
  console.log('Event:', { action, category, label, value });
} 