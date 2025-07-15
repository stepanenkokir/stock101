import { GAME_CONFIG } from "../config/GameConfig.js";
import { getRandomElement } from "../utils/Utilities.js";

export class ColorManager {
  constructor() {
    this.colors = [
      GAME_CONFIG.COLORS.RED,
      GAME_CONFIG.COLORS.BLUE,
      GAME_CONFIG.COLORS.GREEN,
      GAME_CONFIG.COLORS.MAGENTA,
    ];
    this.availableColors = [...this.colors];
    this.workingColor = GAME_CONFIG.COLORS.WORKING;
  }

  getAvailableColors() {
    return this.availableColors;
  }

  getWorkingColor() {
    return this.workingColor;
  }

  getAllColors() {
    return this.colors;
  }

  updateAvailableColors() {
    const selected = document.querySelectorAll(".color-option.selected");
    this.availableColors = Array.from(selected).map((el) => el.dataset.color);

    if (this.availableColors.length === 0) {
      this.availableColors = [GAME_CONFIG.COLORS.RED]; // Minimum one color
      const redOption = document.querySelector('[data-color="red"]');
      if (redOption) {
        redOption.classList.add("selected");
      }
    }
  }

  getRandomColor() {
    return getRandomElement(this.availableColors);
  }

  repaintTile(tile) {
    if (!tile || tile.color === this.workingColor) return false;

    const newColor = this.getRandomColor();
    tile.color = newColor;
    return true;
  }
}
