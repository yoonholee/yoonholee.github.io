/**
 * Loading skeleton screen management
 * Shows skeleton placeholders until content is fully loaded
 */

(function() {
  'use strict';

  // Mark content as loaded when DOM is ready
  function markContentLoaded() {
    document.body.classList.add('content-loaded');
  }

  // Initialize lazy-loaded images with skeleton placeholders
  function initImageSkeletons() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    images.forEach(img => {
      // If image is not yet loaded, show skeleton
      if (!img.complete) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton skeleton-image';
        skeleton.style.width = img.offsetWidth + 'px';
        skeleton.style.height = img.offsetHeight + 'px';

        // Insert skeleton before image
        img.parentNode.insertBefore(skeleton, img);
        img.style.display = 'none';

        // Remove skeleton when image loads
        img.addEventListener('load', function() {
          skeleton.remove();
          img.style.display = '';
        });

        // Also remove skeleton on error
        img.addEventListener('error', function() {
          skeleton.remove();
          img.style.display = '';
        });
      }
    });
  }

  // Add skeleton screens for dynamically loaded content
  function addSkeletonForDynamicContent() {
    // This can be extended for AJAX-loaded content
    // For now, we'll just mark as loaded on DOMContentLoaded
    return;
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      markContentLoaded();
      initImageSkeletons();
    });
  } else {
    markContentLoaded();
    initImageSkeletons();
  }

  // For pages with lazy-loaded content, ensure all is marked loaded after window.load
  window.addEventListener('load', function() {
    setTimeout(markContentLoaded, 100);
  });

  // Export for use in other scripts
  window.SkeletonLoader = {
    show: function(element) {
      element.classList.add('skeleton');
    },
    hide: function(element) {
      element.classList.remove('skeleton');
    },
    create: function(type) {
      const skeleton = document.createElement('div');
      skeleton.className = 'skeleton skeleton-' + type;
      return skeleton;
    }
  };
})();
