const ANALYTICS_ENABLED = process.env.NODE_ENV === 'production';

export const analytics = {
  initialize() {
    if (!ANALYTICS_ENABLED) return;
    
    // Initialize error tracking
    window.addEventListener('error', this.trackError);
    window.addEventListener('unhandledrejection', this.trackError);
  },

  trackEvent(category: string, action: string, label?: string) {
    if (!ANALYTICS_ENABLED) return;

    chrome.runtime.sendMessage({
      type: 'TRACK_EVENT',
      data: { category, action, label }
    });
  },

  trackError(error: Error | Event) {
    if (!ANALYTICS_ENABLED) return;

    chrome.runtime.sendMessage({
      type: 'TRACK_ERROR',
      data: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      }
    });
  }
};