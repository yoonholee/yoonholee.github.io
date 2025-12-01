/**
 * Table of Contents (ToC) Generator with Scrollspy
 * Generates ToC from headings and highlights active sections during scroll
 */

document.addEventListener("DOMContentLoaded", () => {
  const toc = document.getElementById("toc");
  const mainContent = document.querySelector(".post-content");

  if (!toc || !mainContent) return;

  const headings = mainContent.querySelectorAll("h1, h2");

  if (headings.length === 0) {
    toc.style.display = "none";
    return;
  }

  // Create ToC structure
  const tocTitle = document.createElement("h4");
  tocTitle.textContent = "Contents";
  toc.appendChild(tocTitle);

  const tocList = document.createElement("ul");

  // Generate ToC links
  headings.forEach((heading, index) => {
    // Ensure heading has an ID for linking
    if (!heading.id) {
      // Generate ID from heading text
      const headingText = heading.textContent.trim();
      const id = headingText
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single
        .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

      heading.id = id || `section-${index}`;
    }

    const listItem = document.createElement("li");
    const link = document.createElement("a");

    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    link.setAttribute("data-heading-id", heading.id);

    // Indent h2 headings
    if (heading.tagName === "H2") {
      listItem.classList.add("toc-h2");
    }

    listItem.appendChild(link);
    tocList.appendChild(listItem);
  });

  toc.appendChild(tocList);

  // Set up Intersection Observer for scrollspy
  const tocLinks = document.querySelectorAll("#toc a");
  const observerOptions = {
    // Trigger when heading is near the top of the viewport
    rootMargin: "-20% 0% -70% 0%",
    threshold: 0,
  };

  // Function to update reading progress indicator
  function updateReadingProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / docHeight;

    const tocElement = document.getElementById("toc");
    const tocHeight = tocElement.scrollHeight;
    const progressHeight = Math.min(scrollPercent * tocHeight, tocHeight);

    tocElement.style.setProperty("--progress-height", `${progressHeight}px`);
  }

  let currentActive = null;

  const observer = new IntersectionObserver((entries) => {
    // Find the topmost visible heading
    let topMostEntry = null;
    let topMostPosition = Infinity;

    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const rect = entry.target.getBoundingClientRect();
        if (rect.top < topMostPosition) {
          topMostPosition = rect.top;
          topMostEntry = entry;
        }
      }
    });

    // Update active link
    if (topMostEntry) {
      const id = topMostEntry.target.getAttribute("id");
      const newActiveLink = document.querySelector(`#toc a[data-heading-id="${id}"]`);

      if (newActiveLink && newActiveLink !== currentActive) {
        // Remove previous active state
        if (currentActive) {
          currentActive.classList.remove("active");
          currentActive.removeAttribute("aria-current");
        }

        // Set new active state
        newActiveLink.classList.add("active");
        newActiveLink.setAttribute("aria-current", "location");
        currentActive = newActiveLink;
      }
    }
  }, observerOptions);

  // Observe all headings
  headings.forEach((heading) => observer.observe(heading));

  // Handle click events for smooth scrolling
  tocLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("data-heading-id");
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Account for fixed header offset
        const offset = 150; // Large offset to position heading properly
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        // Add highlight effect to the target heading
        targetElement.classList.add("toc-highlight");
        setTimeout(() => {
          targetElement.classList.remove("toc-highlight");
        }, 1000); // Remove highlight after 1 second

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // Update ToC active state immediately to prevent wrong highlighting
        if (currentActive) {
          currentActive.classList.remove("active");
          currentActive.removeAttribute("aria-current");
        }
        link.classList.add("active");
        link.setAttribute("aria-current", "location");
        currentActive = link;
      }
    });
  });

  // Initialize active state for the first visible heading
  const firstHeading = headings[0];
  if (firstHeading) {
    const firstLink = document.querySelector(`#toc a[data-heading-id="${firstHeading.id}"]`);
    if (firstLink) {
      firstLink.classList.add("active");
      firstLink.setAttribute("aria-current", "location");
      currentActive = firstLink;
    }
  }

  // Add scroll listener for reading progress
  window.addEventListener("scroll", updateReadingProgress);

  // Initialize progress indicator
  updateReadingProgress();
});
