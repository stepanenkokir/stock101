import { GameState } from "../models/GameState.js";
import { ColorManager } from "../models/ColorManager.js";
import { GameLogicService } from "../services/GameLogicService.js";
import { AnimationService } from "../services/AnimationService.js";
import { SoundService } from "../services/SoundService.js";
import { UIManager } from "../ui/UIManager.js";
import { EventManager } from "../events/EventManager.js";
import { safeExecute } from "../utils/Utilities.js";

export class Game {
  constructor() {
    this.state = new GameState();
    this.colorManager = new ColorManager();
    this.gameLogic = new GameLogicService(this.colorManager);
    this.animationService = new AnimationService(this.state);
    this.soundService = new SoundService();
    this.uiManager = new UIManager();
    this.eventManager = new EventManager(this, this.uiManager);

    // Event system for external listeners
    this.eventListeners = {};

    this.initialize();
  }

  initialize() {
    return safeExecute(() => {
      this.state.setBoard(this.gameLogic.initBoard());
      this.updateDisplay();
      this.renderBoard();
      this.eventManager.bindEvents();
      this.uiManager.updateSoundButton(this.soundService.isSoundEnabled());
    }, "Ошибка при инициализации игры");
  }

  async handleTileClick(row, col) {
    if (this.state.isGameOver() || this.animationService.isAnimating()) return;

    if (this.state.isRepaintMode()) {
      this.repaintTile(row, col);
      return;
    }

    const tile = this.state.getBoard()[row][col];
    if (!tile) return;

    this.state.saveState();

    const adjacentTiles = this.gameLogic.getAdjacentSameColor(
      this.state.getBoard(),
      row,
      col,
      tile.color
    );

    if (adjacentTiles.length === 0) return;

    await this.processTileMerge(row, col, adjacentTiles);
  }

  async processTileMerge(centerRow, centerCol, adjacentTiles) {
    return safeExecute(async () => {
      // Get the center tile value before any shifts
      const centerTile = this.state.getBoard()[centerRow][centerCol];
      const totalValue = this.gameLogic.calculateTotalValue(
        centerTile,
        adjacentTiles
      );

      const shifts = this.gameLogic.calculateShifts(
        centerRow,
        centerCol,
        adjacentTiles
      );

      await this.animationService.animateShifts(shifts);

      const newBoard = this.gameLogic.applyShifts(
        this.state.getBoard(),
        shifts
      );
      this.state.setBoard(newBoard);

      this.state.getBoard()[centerRow][centerCol] = {
        value: totalValue,
        color: this.colorManager.getWorkingColor(),
      };

      this.state.updateScore(totalValue);
      this.state.updateHeap(totalValue);

      // Emit score changed event
      this.emit("scoreChanged", this.state.getScore());

      // Воспроизводим звук соединения плиток
      this.soundService.playSound("merge");

      if (this.state.getHeap() === this.state.getGoal()) {
        this.animationService.showGoalAchieved(this.state.getGoal());
        this.state.incrementGoal();
        // Воспроизводим звук достижения цели
        this.soundService.playSound("victory");
      }

      const filledBoard = this.gameLogic.fillEmptySpaces(this.state.getBoard());
      this.state.setBoard(filledBoard);

      this.updateDisplay();
      this.renderBoard();
      this.checkGameOver();
    }, "Ошибка при обработке слияния плиток");
  }

  repaintTile(row, col) {
    return safeExecute(() => {
      const board = this.state.getBoard();
      const tile = board[row][col];

      if (this.colorManager.repaintTile(tile)) {
        this.state.saveState();
        this.renderBoard();
        this.state.setRepaintMode(false);
        this.uiManager.updateRepaintButton(false);
      }
    }, "Ошибка при перекраске плитки");
  }

  undo() {
    return safeExecute(() => {
      this.state.setGameOver(false);
      this.uiManager.hideGameOver();

      // Hide Telegram main button when undoing move
      if (
        window.telegramIntegration &&
        window.telegramIntegration.isInTelegram()
      ) {
        window.telegramIntegration.hideMainButton();
      }

      if (this.state.restoreState()) {
        this.updateDisplay();
        this.renderBoard();
      }
    }, "Ошибка при отмене хода");
  }

  restart() {
    return safeExecute(() => {
      // Hide Telegram main button when restarting game
      if (
        window.telegramIntegration &&
        window.telegramIntegration.isInTelegram()
      ) {
        window.telegramIntegration.hideMainButton();
      }

      // Очищаем старые события перед созданием нового состояния
      if (this.eventManager) {
        this.eventManager.destroy();
      }

      this.state = new GameState();
      this.initialize();
    }, "Ошибка при перезапуске игры");
  }

  updateAvailableColors() {
    return safeExecute(() => {
      this.colorManager.updateAvailableColors();
    }, "Ошибка при обновлении доступных цветов");
  }

  checkGameOver() {
    return safeExecute(() => {
      const gameOverResult = this.gameLogic.checkGameOver(
        this.state.getBoard(),
        this.state.getHeap(),
        this.state.getGoal()
      );

      if (gameOverResult.isOver) {
        this.state.setGameOver(true);
        // Emit game over event
        this.emit("gameOver", this.state.getScore(), this.state.getGoal());
        // Воспроизводим звук проигрыша
        this.soundService.playSound("gameOver");
        // Добавляем секундную паузу перед показом диалога
        setTimeout(() => {
          this.uiManager.showGameOver(
            gameOverResult.reason,
            this.state.getScore()
          );
        }, 1000);
      }
    }, "Ошибка при проверке окончания игры");
  }

  updateDisplay() {
    return safeExecute(() => {
      this.uiManager.updateDisplay(
        this.state.getHeap(),
        this.state.getGoal(),
        this.state.getScore()
      );
    }, "Ошибка при обновлении отображения");
  }

  renderBoard() {
    return safeExecute(() => {
      this.uiManager.renderBoard(this.state.getBoard(), (row, col) => {
        this.handleTileClick(row, col);
      });
    }, "Ошибка при рендеринге доски");
  }

  // Getters for external access
  isGameOver() {
    return this.state.isGameOver();
  }

  isRepaintMode() {
    return this.state.isRepaintMode();
  }

  setRepaintMode(value) {
    this.state.setRepaintMode(value);
  }

  toggleSound() {
    return this.soundService.toggleSound();
  }

  destroy() {
    if (this.eventManager) {
      this.eventManager.destroy();
    }
    if (this.soundService) {
      this.soundService.destroy();
    }
    // Clear event listeners
    this.eventListeners = {};
  }

  // Event system methods
  on(eventName, callback) {
    if (!this.eventListeners[eventName]) {
      this.eventListeners[eventName] = [];
    }
    this.eventListeners[eventName].push(callback);
  }

  off(eventName, callback) {
    if (this.eventListeners[eventName]) {
      this.eventListeners[eventName] = this.eventListeners[eventName].filter(
        (cb) => cb !== callback
      );
    }
  }

  emit(eventName, ...args) {
    if (this.eventListeners[eventName]) {
      this.eventListeners[eventName].forEach((callback) => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in event listener for ${eventName}:`, error);
        }
      });
    }
  }
}
