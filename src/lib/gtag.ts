/**
 * Google Analytics (GA4) Utility for Nexus Platform
 */

export const GA_TRACKING_ID = 'G-WGDRHPK766';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });

    // Custom engagement page_view as requested
    (window as any).gtag('event', 'page_view', {
      event_category: 'engagement',
      page_title: document.title,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value, ...rest }: {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...rest,
    });
  }
};

/**
 * Helper for conversion events
 */
export const trackConversion = (eventName: string, params: Record<string, any> = {}) => {
  event({
    action: eventName,
    ...params,
  });
};
