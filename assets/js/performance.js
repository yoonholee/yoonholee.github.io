// Performance optimizations
document.addEventListener("DOMContentLoaded", () => {
  // Mark document as loaded
  document.body.classList.add("loaded");

  // Lazy load images
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if ("loading" in HTMLImageElement.prototype) {
    lazyImages.forEach((img) => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const lazyLoadScript = document.createElement("script");
    lazyLoadScript.src = "/assets/js/lazysizes.min.js";
    document.body.appendChild(lazyLoadScript);
  }

  // Defer non-critical resources
  const deferredResources = document.querySelectorAll("[data-defer]");
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
});

// Add intersection observer for animations
const observeElements = document.querySelectorAll("[data-animate]");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
  }
);

observeElements.forEach((element) => observer.observe(element));
