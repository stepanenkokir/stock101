import { Game } from "./core/Game.js";
import { safeExecute } from "./utils/Utilities.js";
import TelegramIntegration from "./telegram-integration.js";

// Initialize Telegram integration
let telegramIntegration = null;

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

    // Send game start data to Telegram if available
    if (telegramIntegration && telegramIntegration.isInTelegram()) {
      telegramIntegration.sendData({
        action: "game_started",
        timestamp: Date.now(),
      });
    }
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
    // Initialize Telegram integration
    telegramIntegration = new TelegramIntegration();

    // Start the game
    startNewGame();

    // Set up game event listeners for Telegram integration
    const game = gameInstance.getGame();
    if (game) {
      // Listen for game over events
      game.on("gameOver", (score, goal) => {
        if (telegramIntegration && telegramIntegration.isInTelegram()) {
          telegramIntegration.sendData({
            action: "game_over",
            score: score,
            goal: goal,
            timestamp: Date.now(),
          });

          // Show main button to share results
          telegramIntegration.showMainButton("Поделиться результатом", () => {
            const shareText = `🎮 Stock 101\n\nМой результат: ${score} очков\nЦель: ${goal} очков\n\nПопробуй и ты!`;
            if (telegramIntegration.webApp) {
              telegramIntegration.webApp.switchInlineQuery(shareText, [
                "users",
                "groups",
                "channels",
              ]);
            }
          });
        }
      });

      // Listen for score changes
      game.on("scoreChanged", (newScore) => {
        if (telegramIntegration && telegramIntegration.isInTelegram()) {
          telegramIntegration.sendData({
            action: "score_updated",
            score: newScore,
            timestamp: Date.now(),
          });
        }
      });
    }
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
