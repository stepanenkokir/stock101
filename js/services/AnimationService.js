import { GAME_CONFIG, DOM_IDS } from "../config/GameConfig.js";
import { easeOut, safeExecute } from "../utils/Utilities.js";

export class AnimationService {
  constructor(gameState) {
    this.gameState = gameState;
  }

  setAnimating(value) {
    this.gameState.setAnimating(value);
  }

  isAnimating() {
    return this.gameState.isAnimating();
  }

  async animateShifts(shifts) {
    return new Promise((resolve) => {
      this.setAnimating(true);
      const board = document.getElementById(DOM_IDS.GAME_BOARD);

      if (!board) {
        this.setAnimating(false);
        resolve();
        return;
      }

      const tiles = board.querySelectorAll(".tile");
      let completedAnimations = 0;
      const totalAnimations = shifts.length;

      const completeAnimation = () => {
        completedAnimations++;
        if (completedAnimations >= totalAnimations) {
          this.setAnimating(false);
          resolve();
        }
      };

      if (totalAnimations === 0) {
        this.setAnimating(false);
        resolve();
        return;
      }

      shifts.forEach((shift) => {
        const fromIndex =
          shift.from.row * GAME_CONFIG.BOARD_SIZE + shift.from.col;
        const tileElement = tiles[fromIndex];

        if (tileElement) {
          this.animateTile(tileElement, shift, completeAnimation);
        } else {
          completeAnimation();
        }
      });
    });
  }

  animateTile(tileElement, shift, onComplete) {
    const deltaRow = shift.to.row - shift.from.row;
    const deltaCol = shift.to.col - shift.from.col;

    const startTime = performance.now();
    const duration = GAME_CONFIG.ANIMATION_DURATION;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOut(progress);

      const translateX = deltaCol * 100 * easedProgress;
      const translateY = deltaRow * 100 * easedProgress;

      tileElement.style.transform = `translate(${translateX}%, ${translateY}%)`;
      tileElement.style.zIndex = "-1";

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        tileElement.style.transform = "";
        tileElement.style.zIndex = "";
        onComplete();
      }
    };

    requestAnimationFrame(animate);
  }

  showGoalAchieved(goal) {
    return safeExecute(() => {
      const indicator = document.createElement("div");
      indicator.className = "goal-indicator";
      indicator.textContent = `Цель ${goal} достигнута!`;
      indicator.setAttribute("role", "alert");
      indicator.setAttribute("aria-live", "polite");
      document.body.appendChild(indicator);

      setTimeout(() => {
        if (indicator.parentNode) {
          indicator.remove();
        }
      }, 2000);
    }, "Ошибка при показе достижения цели");
  }
}
