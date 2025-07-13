import { Game } from "./core/Game.js";
import { safeExecute } from "./utils/Utilities.js";

// Game instance manager using IIFE pattern
const gameInstance = (() => {
  let game = null;

  return {
    getGame: () => game,
    setGame: (newGame) => {
      // Очищаем старую игру перед установкой новой
      if (game && typeof game.destroy === "function") {
        game.destroy();
      }
      game = newGame;
    },
  };
})();

// Global functions for HTML onclick handlers
window.startNewGame = () => {
  return safeExecute(() => {
    const newGame = new Game();
    gameInstance.setGame(newGame);
    newGame.renderBoard();
    newGame.uiManager.hideGameOver();
  }, "Error starting new game");
};

window.closeSettings = () => {
  return safeExecute(() => {
    const game = gameInstance.getGame();
    if (game) {
      game.uiManager.hideSettings();
    }
  }, "Error closing settings");
};

// Initialize game when DOM is loaded
window.addEventListener("load", () => {
  return safeExecute(() => {
    startNewGame();
  }, "Error loading game");
});

// Performance optimization with Intersection Observer
const createIntersectionObserver = () => {
  if ("IntersectionObserver" in window) {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.1,
      }
    );
  }
  return null;
};

// Initialize observer when DOM is loaded
window.addEventListener("load", () => {
  const observer = createIntersectionObserver();
  if (observer) {
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach((tile) => observer.observe(tile));
  }
});
