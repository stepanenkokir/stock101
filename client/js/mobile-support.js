// Mobile viewport support
(function () {
  "use strict";

  // Fix for mobile viewport height issues
  function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  // Set initial viewport height
  setViewportHeight();

  // Update on resize and orientation change
  window.addEventListener("resize", setViewportHeight);
  window.addEventListener("orientationchange", () => {
    setTimeout(setViewportHeight, 100);
  });

  // Prevent zoom on double tap for mobile
  let lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    function (event) {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    false
  );

  // Ensure footer stays visible on mobile
  function ensureFooterVisibility() {
    const footer = document.querySelector(".footer");
    const gameContainer = document.querySelector(".game-container");

    if (footer && gameContainer) {
      const viewportHeight = window.innerHeight;
      const headerHeight = document.querySelector(".header").offsetHeight;
      const footerHeight = footer.offsetHeight;
      const availableHeight = viewportHeight - headerHeight - footerHeight;

      // Ensure game container doesn't exceed available space
      gameContainer.style.maxHeight = `${availableHeight}px`;
    }
  }

  // Run on load and resize
  window.addEventListener("load", ensureFooterVisibility);
  window.addEventListener("resize", ensureFooterVisibility);
  window.addEventListener("orientationchange", () => {
    setTimeout(ensureFooterVisibility, 100);
  });

  // Prevent body scroll on mobile when needed
  function preventBodyScroll() {
    const modals = document.querySelectorAll(
      ".modal.show, .settings-panel.show"
    );
    if (modals.length > 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }

  // Monitor modal visibility
  const observer = new MutationObserver(preventBodyScroll);
  observer.observe(document.body, {
    attributes: true,
    subtree: true,
    attributeFilter: ["class"],
  });
})();
