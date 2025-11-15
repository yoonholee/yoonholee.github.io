/**
 * Core Web Vitals tracking for Google Analytics 4
 * Tracks: LCP, INP, CLS, FCP, TTFB
 */

(function () {
  "use strict";

  // Check if Google Analytics is available
  function isGAAvailable() {
    return typeof gtag !== "undefined" || typeof ga !== "undefined";
  }

  // Send metric to Google Analytics 4
  function sendToGA4(metric) {
    if (!isGAAvailable()) {
      console.log("Web Vitals:", metric.name, metric.value);
      return;
    }

    // Send to GA4 (gtag.js)
    if (typeof gtag !== "undefined") {
      gtag("event", metric.name, {
        event_category: "Web Vitals",
        value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }
  }

  // Inline minimal web-vitals functions to avoid external dependency
  function onLCP(callback) {
    if (typeof PerformanceObserver === "undefined") return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        callback({
          name: "LCP",
          value: lastEntry.renderTime || lastEntry.loadTime,
          id: "v3-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
        });
      });

      observer.observe({ type: "largest-contentful-paint", buffered: true });
    } catch (e) {
      // Silently fail if LCP is not supported
    }
  }

  function onCLS(callback) {
    if (typeof PerformanceObserver === "undefined") return;

    let clsValue = 0;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }

        callback({
          name: "CLS",
          value: clsValue,
          id: "v3-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
        });
      });

      observer.observe({ type: "layout-shift", buffered: true });

      // Report CLS on page hide
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          callback({
            name: "CLS",
            value: clsValue,
            id: "v3-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
          });
        }
      });
    } catch (e) {
      // Silently fail if CLS is not supported
    }
  }

  function onINP(callback) {
    if (typeof PerformanceObserver === "undefined") return;

    let maxDuration = 0;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > maxDuration) {
            maxDuration = entry.duration;
          }
        }

        callback({
          name: "INP",
          value: maxDuration,
          id: "v3-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
        });
      });

      observer.observe({ type: "event", buffered: true, durationThreshold: 16 });

      // Report INP on page hide
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden" && maxDuration > 0) {
          callback({
            name: "INP",
            value: maxDuration,
            id: "v3-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
          });
        }
      });
    } catch (e) {
      // Silently fail if INP is not supported
    }
  }

  function onFCP(callback) {
    if (typeof PerformanceObserver === "undefined") return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries[0];

        callback({
          name: "FCP",
          value: fcpEntry.startTime,
          id: "v3-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
        });

        observer.disconnect();
      });

      observer.observe({ type: "paint", buffered: true });
    } catch (e) {
      // Silently fail if FCP is not supported
    }
  }

  function onTTFB(callback) {
    try {
      const navigationEntry = performance.getEntriesByType("navigation")[0];

      if (navigationEntry) {
        callback({
          name: "TTFB",
          value: navigationEntry.responseStart,
          id: "v3-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
        });
      }
    } catch (e) {
      // Silently fail if TTFB is not supported
    }
  }

  // Initialize tracking when DOM is ready
  if (document.readyState === "complete") {
    initWebVitals();
  } else {
    window.addEventListener("load", initWebVitals);
  }

  function initWebVitals() {
    onLCP(sendToGA4);
    onCLS(sendToGA4);
    onINP(sendToGA4);
    onFCP(sendToGA4);
    onTTFB(sendToGA4);
  }
})();
