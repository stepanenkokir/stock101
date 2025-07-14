import { DOM_IDS } from "../config/GameConfig.js";
import { safeExecute } from "../utils/Utilities.js";

export class UIManager {
  constructor() {
    this.elements = {
      heap: document.getElementById(DOM_IDS.HEAP),
      goal: document.getElementById(DOM_IDS.GOAL),
      score: document.getElementById(DOM_IDS.SCORE),
      gameBoard: document.getElementById(DOM_IDS.GAME_BOARD),
      undoBtn: document.getElementById(DOM_IDS.UNDO_BTN),
      undoBtnModal: document.getElementById(DOM_IDS.UNDO_BTN_MODAL),
      repaintBtn: document.getElementById(DOM_IDS.REPAINT_BTN),
      restartBtn: document.getElementById(DOM_IDS.RESTART_BTN),
      settingsBtn: document.getElementById(DOM_IDS.SETTINGS_BTN),
      soundBtn: document.getElementById(DOM_IDS.SOUND_BTN),
      gameOverModal: document.getElementById(DOM_IDS.GAME_OVER_MODAL),
      gameOverTitle: document.getElementById(DOM_IDS.GAME_OVER_TITLE),
      gameOverText: document.getElementById(DOM_IDS.GAME_OVER_TEXT),
      settingsPanel: document.getElementById(DOM_IDS.SETTINGS_PANEL),
      colorPicker: document.getElementById(DOM_IDS.COLOR_PICKER),
      restartConfirmModal: document.getElementById(
        DOM_IDS.RESTART_CONFIRM_MODAL
      ),
      restartConfirmTitle: document.getElementById(
        DOM_IDS.RESTART_CONFIRM_TITLE
      ),
      restartConfirmText: document.getElementById(DOM_IDS.RESTART_CONFIRM_TEXT),
      restartConfirmYes: document.getElementById(DOM_IDS.RESTART_CONFIRM_YES),
      restartConfirmNo: document.getElementById(DOM_IDS.RESTART_CONFIRM_NO),
      newGameBtn: document.getElementById(DOM_IDS.NEW_GAME_BTN),
      closeSettingsBtn: document.getElementById(DOM_IDS.CLOSE_SETTINGS_BTN),
      topResultsBtn: document.getElementById("topResultsBtn"),
      userStatsBtn: document.getElementById("userStatsBtn"),
      authModal: document.getElementById("authModal"),
      authForm: document.getElementById("authForm"),
      authUserName: document.getElementById("authUserName"),
      authSubmitBtn: document.getElementById("authSubmitBtn"),
    };
  }

  getAllElements() {
    return this.elements;
  }

  updateDisplay(heap, goal, score) {
    return safeExecute(() => {
      if (this.elements.heap) this.elements.heap.textContent = heap;
      if (this.elements.goal) this.elements.goal.textContent = goal;
      if (this.elements.score) this.elements.score.textContent = score;
    }, "Ошибка при обновлении отображения");
  }

  renderBoard(board, clickHandler) {
    return safeExecute(() => {
      if (!this.elements.gameBoard) return;

      this.elements.gameBoard.innerHTML = "";

      for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
          const tile = board[row][col];
          const tileElement = document.createElement("div");
          tileElement.className = "tile";
          tileElement.setAttribute("role", "button");
          tileElement.setAttribute("tabindex", "0");
          tileElement.setAttribute(
            "aria-label",
            `Плитка ${row + 1}-${col + 1}`
          );

          if (tile) {
            tileElement.style.backgroundColor = this.getTileColor(tile.color);
            tileElement.textContent = tile.value;
            tileElement.setAttribute("data-value", tile.value);
            tileElement.setAttribute("data-color", tile.color);

            // Add animation for new tiles
            if (tile.new) {
              tileElement.classList.add("tile-appear");
              // Remove the new flag after animation
              setTimeout(() => {
                tileElement.classList.remove("tile-appear");
              }, 300);
            }
          } else {
            tileElement.classList.add("empty");
          }

          tileElement.addEventListener("click", () => clickHandler(row, col));
          tileElement.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              clickHandler(row, col);
            }
          });

          this.elements.gameBoard.appendChild(tileElement);
        }
      }
    }, "Ошибка при рендеринге доски");
  }

  getTileColor(color) {
    const colors = {
      red: "#ff6b6b",
      blue: "#4dabf7",
      green: "#51cf66",
      magenta: "#ff8cc8",
      yellow: "#ffd43b",
    };
    return colors[color] || "#ccc";
  }

  showGameOver(reason, score) {
    return safeExecute(() => {
      if (this.elements.gameOverModal) {
        this.elements.gameOverModal.style.display = "flex";
        this.elements.gameOverModal.removeAttribute("inert");
      }

      if (this.elements.gameOverTitle) {
        this.elements.gameOverTitle.textContent = "Игра окончена!";
      }

      if (this.elements.gameOverText) {
        let text = "";

        // Check for specific reasons from GameLogicService
        if (reason.includes("Куча слишком большая")) {
          text = `Игра окончена. ${reason}\nВаш счет: ${score} очков.`;
        } else if (reason.includes("Нет доступных ходов")) {
          text = `Игра окончена. ${reason}\nВаш счет: ${score} очков.`;
        } else {
          // Fallback for other reasons
          text = `Игра окончена. ${reason}\nВаш счет: ${score} очков.`;
        }

        this.elements.gameOverText.textContent = text;
      }
    }, "Ошибка при показе диалога окончания игры");
  }

  hideGameOver() {
    return safeExecute(() => {
      if (this.elements.gameOverModal) {
        this.elements.gameOverModal.style.display = "none";
        this.elements.gameOverModal.setAttribute("inert", "");
      }

      // Hide Telegram main button when game over modal is closed
      if (
        window.telegramIntegration &&
        window.telegramIntegration.isInTelegram()
      ) {
        window.telegramIntegration.hideMainButton();
      }
    }, "Ошибка при скрытии диалога окончания игры");
  }

  showRestartConfirm() {
    return safeExecute(() => {
      if (this.elements.restartConfirmModal) {
        this.elements.restartConfirmModal.style.display = "flex";
        this.elements.restartConfirmModal.removeAttribute("inert");
      }
    }, "Ошибка при показе диалога подтверждения перезапуска");
  }

  hideRestartConfirm() {
    return safeExecute(() => {
      if (this.elements.restartConfirmModal) {
        this.elements.restartConfirmModal.style.display = "none";
        this.elements.restartConfirmModal.setAttribute("inert", "");
      }
    }, "Ошибка при скрытии диалога подтверждения перезапуска");
  }

  showSettings() {
    return safeExecute(() => {
      if (this.elements.settingsPanel) {
        this.elements.settingsPanel.style.display = "block";
        this.elements.settingsPanel.removeAttribute("inert");
      }
    }, "Ошибка при показе панели настроек");
  }

  hideSettings() {
    return safeExecute(() => {
      if (this.elements.settingsPanel) {
        this.elements.settingsPanel.style.display = "none";
        this.elements.settingsPanel.setAttribute("inert", "");
      }
    }, "Ошибка при скрытии панели настроек");
  }

  updateRepaintButton(isActive) {
    return safeExecute(() => {
      if (this.elements.repaintBtn) {
        this.elements.repaintBtn.setAttribute("aria-pressed", isActive);
        this.elements.repaintBtn.classList.toggle("active", isActive);
      }
    }, "Ошибка при обновлении кнопки перекраски");
  }

  updateSoundButton(isEnabled) {
    return safeExecute(() => {
      if (this.elements.soundBtn) {
        this.elements.soundBtn.setAttribute("aria-pressed", isEnabled);
        this.elements.soundBtn.classList.toggle("active", isEnabled);
      }
    }, "Ошибка при обновлении кнопки звука");
  }

  showTopResults(results) {
    return safeExecute(() => {
      // Create modal for top results
      const modal = document.createElement("div");
      modal.className = "modal results-modal";
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h2>🏆 Топ результатов</h2>
            <button class="close-btn" aria-label="Закрыть">&times;</button>
          </div>
          <div class="modal-body">
            <div class="results-list">
              ${results
                .map(
                  (result, index) => `
                <div class="result-item">
                  <div class="result-rank">${index + 1}</div>
                  <div class="result-info">
                    <div class="result-name">${result.user_name}</div>
                    <div class="result-source">${
                      result.user_source === "telegram"
                        ? "📱 Telegram"
                        : "🌐 Web"
                    }</div>
                  </div>
                  <div class="result-scores">
                    <div class="result-score">Счет: ${result.max_score}</div>
                    <div class="result-heap">Куча: ${result.max_heap}</div>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </div>
      `;

      // Add close functionality
      const closeBtn = modal.querySelector(".close-btn");
      closeBtn.addEventListener("click", () => {
        document.body.removeChild(modal);
      });

      // Close on outside click
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      });

      document.body.appendChild(modal);
    }, "Ошибка при показе топ результатов");
  }

  showUserStats(stats) {
    return safeExecute(() => {
      // Create modal for user stats
      const modal = document.createElement("div");
      modal.className = "modal stats-modal";
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h2>📊 Ваша статистика</h2>
            <button class="close-btn" aria-label="Закрыть">&times;</button>
          </div>
          <div class="modal-body">
            <div class="stats-list">
              <div class="stat-item">
                <div class="stat-label">Игр сыграно:</div>
                <div class="stat-value">${stats.games_played || 0}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Лучший счет:</div>
                <div class="stat-value">${stats.best_score || 0}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Лучшая куча:</div>
                <div class="stat-value">${stats.best_heap || 0}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Средний счет:</div>
                <div class="stat-value">${Math.round(
                  stats.avg_score || 0
                )}</div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Add close functionality
      const closeBtn = modal.querySelector(".close-btn");
      closeBtn.addEventListener("click", () => {
        document.body.removeChild(modal);
      });

      // Close on outside click
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      });

      document.body.appendChild(modal);
    }, "Ошибка при показе статистики пользователя");
  }

  showAuthModal() {
    if (this.elements.authModal) {
      this.elements.authModal.style.display = "flex";
      this.elements.authModal.removeAttribute("inert");
      if (this.elements.authUserName) {
        setTimeout(() => this.elements.authUserName.focus(), 100);
      }
    }
  }

  hideAuthModal() {
    if (this.elements.authModal) {
      this.elements.authModal.style.display = "none";
      this.elements.authModal.setAttribute("inert", "");
    }
  }

  showTelegramOnlyMessage() {
    return safeExecute(() => {
      // Create modal for Telegram-only message
      const modal = document.createElement("div");
      modal.className = "modal telegram-only-modal";
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h2>📱 Статистика</h2>
            <button class="close-btn" aria-label="Закрыть">&times;</button>
          </div>
          <div class="modal-body">
            <div class="telegram-only-message">
              <div class="telegram-icon">📱</div>
              <h3>Статистика доступна только в Telegram</h3>
              <p>Для просмотра вашей персональной статистики откройте игру в Telegram Mini App.</p>
              
              <div class="telegram-qr-section">
                <div class="qr-code">
                  <img src="tlgbotQR.png" alt="QR код для Telegram бота" />
                </div>
                <div class="bot-info">
                  <p><strong>Наш Telegram бот:</strong></p>
                  <a href="https://t.me/Stock101SteKirBot" target="_blank" class="bot-link">
                    @Stock101SteKirBot
                  </a>
                  <p class="bot-description">Отсканируйте QR код или нажмите на ссылку, чтобы открыть игру в Telegram</p>
                </div>
              </div>
              
              <div class="telegram-info">
                <p><strong>В Telegram вы сможете:</strong></p>
                <ul>
                  <li>📊 Видеть количество сыгранных игр</li>
                  <li>🏆 Отслеживать лучшие результаты</li>
                  <li>📈 Анализировать прогресс</li>
                  <li>🎯 Сравнивать с другими игроками</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      `;

      // Add close functionality
      const closeBtn = modal.querySelector(".close-btn");
      closeBtn.addEventListener("click", () => {
        document.body.removeChild(modal);
      });

      // Close on outside click
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      });

      document.body.appendChild(modal);

      // Принудительно показываем модальное окно
      modal.style.display = "flex";
      modal.style.position = "fixed";
      modal.style.top = "0";
      modal.style.left = "0";
      modal.style.width = "100%";
      modal.style.height = "100%";
      modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      modal.style.zIndex = "9999";
      modal.style.alignItems = "center";
      modal.style.justifyContent = "center";

      // Также стилизуем содержимое модального окна
      const modalContent = modal.querySelector(".modal-content");
      if (modalContent) {
        modalContent.style.backgroundColor = "#1a1a1a";
        modalContent.style.color = "white";
        modalContent.style.padding = "20px";
        modalContent.style.borderRadius = "10px";
        modalContent.style.maxWidth = "500px";
        modalContent.style.maxHeight = "80vh";
        modalContent.style.overflow = "auto";
        modalContent.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.5)";
      }
    }, "Ошибка при показе сообщения о Telegram");
  }

  showAuthError() {
    return safeExecute(() => {
      // Create modal for authentication error
      const modal = document.createElement("div");
      modal.className = "modal auth-error-modal";
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h2>⚠️ Ошибка авторизации</h2>
            <button class="close-btn" aria-label="Закрыть">&times;</button>
          </div>
          <div class="modal-body">
            <div class="auth-error-message">
              <div class="error-icon">⚠️</div>
              <h3>Не удалось загрузить статистику</h3>
              <p>Попробуйте перезапустить приложение в Telegram или обратитесь к администратору.</p>
            </div>
          </div>
        </div>
      `;

      // Add close functionality
      const closeBtn = modal.querySelector(".close-btn");
      closeBtn.addEventListener("click", () => {
        document.body.removeChild(modal);
      });

      // Close on outside click
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      });

      document.body.appendChild(modal);
    }, "Ошибка при показе сообщения об ошибке авторизации");
  }
}
