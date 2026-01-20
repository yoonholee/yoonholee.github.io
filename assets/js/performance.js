/**
 * Performance optimizations
 *
 * Handles:
 * - Animation triggers via IntersectionObserver
 * - Deferred resource loading (scripts, stylesheets)
 *
 * Note: Lazy image loading is handled by skeleton.js
 */

document.addEventListener("DOMContentLoaded", () => {
  // Mark document as loaded
  document.body.classList.add("loaded");

  // Defer non-critical resources
  const deferredResources = document.querySelectorAll("[data-defer]");
  if (deferredResources.length > 0 && "requestIdleCallback" in window) {
    requestIdleCallback(() => {
      deferredResources.forEach((resource) => {
        if (resource.tagName === "SCRIPT") {
          const script = document.createElement("script");
          script.src = resource.dataset.defer;
          document.body.appendChild(script);
        } else if (resource.tagName === "LINK") {
          resource.rel = "stylesheet";
          resource.href = resource.dataset.defer;
        }
      });
    });
  }
});

// Add intersection observer for scroll-triggered animations
// Usage: add data-animate attribute to elements
const observeElements = document.querySelectorAll("[data-animate]");
if (observeElements.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  observeElements.forEach((element) => observer.observe(element));
}
