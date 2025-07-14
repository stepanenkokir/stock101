import { Game } from "./core/Game.js";
import { safeExecute } from "./utils/Utilities.js";
import TelegramIntegration from "./telegram-integration.js";

// Initialize Telegram integration
let telegramIntegration = null;

// Game instance management
let currentGame = null;

const setGame = (newGame) => {
  if (currentGame && typeof currentGame.destroy === "function") {
    currentGame.destroy();
  }
  currentGame = newGame;
};

const getGame = () => currentGame;

// Initialize game when DOM is loaded
window.addEventListener("load", () => {
  return safeExecute(() => {
    // Initialize Telegram integration
    telegramIntegration = new TelegramIntegration();

    // Make telegramIntegration globally available for UIManager
    window.telegramIntegration = telegramIntegration;

    // Start the game
    const newGame = new Game();
    setGame(newGame);
    newGame.renderBoard();

    // Set up game event listeners for Telegram integration
    const game = getGame();
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
            const shareText = `🎮 Stock 101\n\nМой результат: ${score} очков\nЦель: ${goal} очков\n\nПопробуй и ты!\nhttps://t.me/Stock101GameBot?start=from_friend`;
            if (telegramIntegration.webApp) {
              try {
                // Try to use switchInlineQuery first
                telegramIntegration.webApp.switchInlineQuery(shareText, [
                  "users",
                  "groups",
                  "channels",
                ]);
              } catch (error) {
                // Fallback: copy to clipboard and show message
                navigator.clipboard
                  .writeText(shareText)
                  .then(() => {
                    alert("Результат скопирован в буфер обмена!");
                  })
                  .catch(() => {
                    // If clipboard is not available, just show the text
                    alert(`Результат:\n${shareText}`);
                  });
              }
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
