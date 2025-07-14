// Utility functions
export const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const easeOut = (progress) => {
  return 1 - Math.pow(1 - progress, 3);
};

// Error handling wrapper
export const safeExecute = (func, errorMessage) => {
  try {
    return func();
  } catch (error) {
    console.error(errorMessage, error);
    return null;
  }
};
