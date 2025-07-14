import { DOM_IDS, GAME_CONFIG } from "../config/GameConfig.js";
import { safeExecute } from "../utils/Utilities.js";

export class EventManager {
  constructor(game, uiManager) {
    this.game = game;
    this.uiManager = uiManager;
    this.boundElements = new Map(); // Для отслеживания привязанных элементов
  }

  bindEvents() {
    return safeExecute(() => {
      this.unbindEvents(); // Сначала очищаем старые события
      this.bindButtonEvents();
      this.bindColorPickerEvents();
      this.bindGlobalEvents();
      this.bindKeyboardEvents();
    }, "Ошибка при привязке событий");
  }

  unbindEvents() {
    // Очищаем все привязанные обработчики событий
    this.boundElements.forEach((handlers, element) => {
      handlers.forEach(({ type, handler }) => {
        element.removeEventListener(type, handler);
      });
    });
    this.boundElements.clear();
  }

  addEventListener(element, type, handler) {
    if (!element) return;

    element.addEventListener(type, handler);

    // Сохраняем информацию о привязанном обработчике
    if (!this.boundElements.has(element)) {
      this.boundElements.set(element, []);
    }
    this.boundElements.get(element).push({ type, handler });
  }

  bindButtonEvents() {
    const elements = this.uiManager.getAllElements();

    // Bind undo buttons (both in footer and modal)
    const undoButtons = [elements.undoBtn, elements.undoBtnModal].filter(
      Boolean
    );
    undoButtons.forEach((button) => {
      this.addEventListener(button, "click", () => this.game.undo());
      button.setAttribute("aria-label", "Отменить ход");
    });

    if (elements.repaintBtn) {
      this.addEventListener(elements.repaintBtn, "click", () =>
        this.toggleRepaintMode()
      );
      elements.repaintBtn.setAttribute("aria-label", "Перекрасить плитку");
    }

    if (elements.restartBtn) {
      this.addEventListener(elements.restartBtn, "click", () =>
        this.handleRestart()
      );
      elements.restartBtn.setAttribute("aria-label", "Новая игра");
    }

    if (elements.settingsBtn) {
      this.addEventListener(elements.settingsBtn, "click", () =>
        this.uiManager.showSettings()
      );
      elements.settingsBtn.setAttribute("aria-label", "Настройки");
    }

    if (elements.soundBtn) {
      this.addEventListener(elements.soundBtn, "click", () =>
        this.toggleSound()
      );
      elements.soundBtn.setAttribute("aria-label", "Включить/выключить звук");
    }

    // Add handlers for restart confirmation buttons
    if (elements.restartConfirmYes) {
      this.addEventListener(elements.restartConfirmYes, "click", () =>
        this.confirmRestart()
      );
    }

    if (elements.restartConfirmNo) {
      this.addEventListener(elements.restartConfirmNo, "click", () =>
        this.cancelRestart()
      );
    }

    // Add handlers for new buttons
    if (elements.newGameBtn) {
      this.addEventListener(elements.newGameBtn, "click", () =>
        this.startNewGame()
      );
    }

    if (elements.closeSettingsBtn) {
      this.addEventListener(elements.closeSettingsBtn, "click", () =>
        this.closeSettings()
      );
    }
  }

  bindColorPickerEvents() {
    document.querySelectorAll(".color-option").forEach((option) => {
      this.addEventListener(option, "click", () =>
        this.handleColorOptionClick(option)
      );
      option.setAttribute("role", "button");
      option.setAttribute("tabindex", "0");
      this.addEventListener(option, "keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          option.click();
        }
      });
    });
  }

  bindGlobalEvents() {
    const globalClickHandler = (e) => this.handleGlobalClick(e);
    const globalKeydownHandler = (e) => this.handleKeyboardEvent(e);

    this.addEventListener(document, "click", globalClickHandler);
    this.addEventListener(document, "keydown", globalKeydownHandler);
  }

  bindKeyboardEvents() {
    // Обработчики клавиатуры уже добавлены в bindGlobalEvents
  }

  toggleRepaintMode() {
    const isActive = !this.game.isRepaintMode();
    this.game.setRepaintMode(isActive);
    this.uiManager.updateRepaintButton(isActive);
  }

  toggleSound() {
    const isEnabled = this.game.toggleSound();
    this.uiManager.updateSoundButton(isEnabled);
  }

  handleColorOptionClick(option) {
    option.classList.toggle("selected");
    const isSelected = option.classList.contains("selected");
    option.setAttribute("aria-pressed", isSelected);
    this.game.updateAvailableColors();
  }

  handleRestart() {
    this.uiManager.showRestartConfirm();
  }

  confirmRestart() {
    this.uiManager.hideRestartConfirm();
    this.game.restart();
  }

  cancelRestart() {
    this.uiManager.hideRestartConfirm();
  }

  startNewGame() {
    this.uiManager.hideGameOver();

    // Hide Telegram main button when starting new game
    if (
      window.telegramIntegration &&
      window.telegramIntegration.isInTelegram()
    ) {
      window.telegramIntegration.hideMainButton();
    }

    this.game.restart();
  }

  closeSettings() {
    this.uiManager.hideSettings();
  }

  handleGlobalClick(e) {
    const elements = this.uiManager.getAllElements();

    if (e.target === elements.gameOverModal) {
      elements.gameOverModal.style.display = "none";
      elements.gameOverModal.setAttribute("inert", "");

      // Hide Telegram main button when clicking outside modal
      if (
        window.telegramIntegration &&
        window.telegramIntegration.isInTelegram()
      ) {
        window.telegramIntegration.hideMainButton();
      }
    }
    if (e.target === elements.settingsPanel) {
      this.uiManager.hideSettings();
    }
    if (e.target === elements.restartConfirmModal) {
      this.uiManager.hideRestartConfirm();
    }
  }

  handleKeyboardEvent(e) {
    switch (e.key) {
      case "Escape":
        this.handleEscapeKey();
        break;
      case "r":
      case "R":
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          this.handleRestart();
        }
        break;
      case "z":
      case "Z":
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.game.undo();
        }
        break;
      case "p":
      case "P":
        e.preventDefault();
        this.toggleRepaintMode();
        break;
      case "s":
      case "S":
        e.preventDefault();
        this.toggleSound();
        break;
    }
  }

  handleEscapeKey() {
    const elements = this.uiManager.getAllElements();

    // Close modals in order of priority
    if (
      elements.gameOverModal &&
      elements.gameOverModal.style.display !== "none"
    ) {
      elements.gameOverModal.style.display = "none";
      elements.gameOverModal.setAttribute("inert", "");

      // Hide Telegram main button when closing modal with Escape
      if (
        window.telegramIntegration &&
        window.telegramIntegration.isInTelegram()
      ) {
        window.telegramIntegration.hideMainButton();
      }
    } else if (
      elements.settingsPanel &&
      elements.settingsPanel.style.display !== "none"
    ) {
      this.uiManager.hideSettings();
    } else if (
      elements.restartConfirmModal &&
      elements.restartConfirmModal.style.display !== "none"
    ) {
      this.uiManager.hideRestartConfirm();
    }
  }

  destroy() {
    this.unbindEvents();
  }
}
