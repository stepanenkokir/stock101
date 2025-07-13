// Utility functions
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const calculateDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

export const easeOut = (progress) => {
  return 1 - Math.pow(1 - progress, 3);
};

// Feature detection utilities
export const supportsTouch =
  "ontouchstart" in window || navigator.maxTouchPoints > 0;
export const supportsReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Error handling wrapper
export const safeExecute = (func, errorMessage) => {
  try {
    return func();
  } catch (error) {
    console.error(errorMessage, error);
    return null;
  }
};
