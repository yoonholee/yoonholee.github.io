/**
 * Common functionality for publications page
 * - Abstract/BibTeX toggle buttons
 * - More authors expansion
 * - URL hash targeting
 */

document.addEventListener("DOMContentLoaded", function () {
  // Delegated event listeners for abstract/bib toggles
  document.body.addEventListener("click", function (e) {
    // Abstract toggle
    if (e.target.matches("a.abstract.publink")) {
      e.preventDefault();
      const row = e.target.closest(".publication-row");
      if (!row) return;

      const abstractEl = row.querySelector(".abstract.hidden");
      const bibEl = row.querySelector(".bib.hidden");

      if (abstractEl) abstractEl.classList.toggle("open");
      if (bibEl) bibEl.classList.remove("open");
    }

    // Bib toggle
    if (e.target.matches("a.bib.publink")) {
      e.preventDefault();
      const row = e.target.closest(".publication-row");
      if (!row) return;

      const abstractEl = row.querySelector(".abstract.hidden");
      const bibEl = row.querySelector(".bib.hidden");

      if (abstractEl) abstractEl.classList.remove("open");
      if (bibEl) bibEl.classList.toggle("open");
    }
  });

  // Open abstract if URL has #bibkey target
  const targetRow = document.querySelector("div.row.publication-row:target");
  if (targetRow) {
    const abstractEl = targetRow.querySelector(".abstract.hidden");
    if (abstractEl) abstractEl.classList.add("open");
  }

  // More authors toggle handler
  document.body.addEventListener("click", function (e) {
    if (e.target.matches("button.more-authors")) {
      const button = e.target;
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      // Toggle ARIA state
      button.setAttribute("aria-expanded", !isExpanded);

      // Update button text
      const showText = button.getAttribute("data-toggle-text-show");
      const hideText = button.getAttribute("data-toggle-text-hide");
      button.textContent = isExpanded ? hideText : showText;

      // Update aria-label
      button.setAttribute("aria-label", isExpanded ? "Show additional authors" : "Hide additional authors");
    }
  });
});
