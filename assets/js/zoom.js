// Initialize medium zoom (vanilla JS - jQuery removed)
document.addEventListener("DOMContentLoaded", function () {
  if (typeof mediumZoom === "undefined") return;

  const bgColor = getComputedStyle(document.documentElement).getPropertyValue("--global-bg-color").trim() || "#ffffff";

  mediumZoom("[data-zoomable]", {
    margin: 100,
    background: bgColor + "ee", // transparency
  });
});
