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
        this.elements.soundBtn.classList.toggle("enabled", isEnabled);
      }
    }, "Ошибка при обновлении кнопки звука");
  }
}
