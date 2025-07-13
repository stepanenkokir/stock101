import { DOM_IDS, CSS_CLASSES, GAME_CONFIG } from "../config/GameConfig.js";
import { safeExecute } from "../utils/Utilities.js";

export class UIManager {
  constructor() {
    this.elements = {};
    this.initializeElements();
  }

  initializeElements() {
    this.elements = {
      heap: document.getElementById(DOM_IDS.HEAP),
      goal: document.getElementById(DOM_IDS.GOAL),
      score: document.getElementById(DOM_IDS.SCORE),
      gameBoard: document.getElementById(DOM_IDS.GAME_BOARD),
      undoBtn: document.getElementById(DOM_IDS.UNDO_BTN),
      undoBtn2: document.getElementById(DOM_IDS.UNDO_BTN2),
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
    };
  }

  updateDisplay(heap, goal, score) {
    return safeExecute(() => {
      if (this.elements.heap) this.elements.heap.textContent = heap;
      if (this.elements.goal) this.elements.goal.textContent = goal;
      if (this.elements.score) this.elements.score.textContent = score;
    }, "Error updating display");
  }

  renderBoard(board, onTileClick) {
    return safeExecute(() => {
      if (!this.elements.gameBoard) return;

      this.elements.gameBoard.innerHTML = "";

      for (let i = 0; i < GAME_CONFIG.BOARD_SIZE; i++) {
        for (let j = 0; j < GAME_CONFIG.BOARD_SIZE; j++) {
          const tileElement = this.createTileElement(
            i,
            j,
            board[i][j],
            onTileClick
          );
          this.elements.gameBoard.appendChild(tileElement);
        }
      }
    }, "Error rendering board");
  }

  createTileElement(row, col, tile, onTileClick) {
    const tileElement = document.createElement("div");
    tileElement.className = CSS_CLASSES.TILE;
    tileElement.setAttribute("role", "button");
    tileElement.setAttribute("tabindex", "0");
    tileElement.setAttribute("aria-label", `Плитка ${row + 1}-${col + 1}`);

    if (tile) {
      tileElement.classList.add(tile.color);
      tileElement.textContent = tile.value;
      tileElement.setAttribute(
        "aria-label",
        `Tile ${row + 1}-${col + 1}, value ${tile.value}, color ${tile.color}`
      );
      if (tile.new) {
        tileElement.classList.add(CSS_CLASSES.TILE_APPEAR);
        delete tile.new;
      }
    }

    const handleInteraction = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onTileClick(row, col);
    };

    // Mouse events
    tileElement.addEventListener("click", handleInteraction);

    // Touch events for mobile
    tileElement.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
      },
      { passive: false }
    );

    tileElement.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        onTileClick(row, col);
      },
      { passive: false }
    );

    // Keyboard events
    tileElement.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        handleInteraction(e);
      }
    });

    return tileElement;
  }

  showGameOver(reason, score) {
    return safeExecute(() => {
      if (this.elements.gameOverTitle) {
        this.elements.gameOverTitle.textContent = "Игра окончена!";
      }
      if (this.elements.gameOverText) {
        this.elements.gameOverText.textContent = `${reason}\n Финальный счет: ${score}`;
      }
      if (this.elements.gameOverModal) {
        this.elements.gameOverModal.style.display = "flex";
        this.elements.gameOverModal.removeAttribute("inert");
      }
    }, "Error showing game over");
  }

  hideGameOver() {
    return safeExecute(() => {
      if (this.elements.gameOverModal) {
        this.elements.gameOverModal.style.display = "none";
        this.elements.gameOverModal.setAttribute("inert", "");
      }
    }, "Error hiding game over modal");
  }

  showSettings() {
    return safeExecute(() => {
      if (this.elements.settingsPanel) {
        this.elements.settingsPanel.style.display = "block";
        this.elements.settingsPanel.removeAttribute("inert");
      }
    }, "Error showing settings");
  }

  hideSettings() {
    return safeExecute(() => {
      if (this.elements.settingsPanel) {
        this.elements.settingsPanel.style.display = "none";
        this.elements.settingsPanel.setAttribute("inert", "");
      }
    }, "Error hiding settings");
  }

  showRestartConfirm() {
    return safeExecute(() => {
      if (this.elements.restartConfirmModal) {
        this.elements.restartConfirmModal.style.display = "flex";
        this.elements.restartConfirmModal.removeAttribute("inert");
      }
    }, "Error showing restart confirm modal");
  }

  hideRestartConfirm() {
    return safeExecute(() => {
      if (this.elements.restartConfirmModal) {
        this.elements.restartConfirmModal.style.display = "none";
        this.elements.restartConfirmModal.setAttribute("inert", "");
      }
    }, "Error hiding restart confirm modal");
  }

  updateRepaintButton(isActive) {
    return safeExecute(() => {
      if (this.elements.repaintBtn) {
        this.elements.repaintBtn.style.background = isActive
          ? "rgba(255, 255, 0, 0.3)"
          : "rgba(255, 255, 255, 0.2)";
        this.elements.repaintBtn.setAttribute("aria-pressed", isActive);
      }
    }, "Error updating repaint button");
  }

  updateSoundButton(isEnabled) {
    return safeExecute(() => {
      if (this.elements.soundBtn) {
        this.elements.soundBtn.setAttribute("aria-pressed", isEnabled);
        const span = this.elements.soundBtn.querySelector("span");
        if (span) {
          span.textContent = isEnabled ? "🔊" : "🔇";
        }
      }
    }, "Error updating sound button");
  }

  getElement(id) {
    return this.elements[id];
  }

  getAllElements() {
    return this.elements;
  }
}
