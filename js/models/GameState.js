import { GAME_CONFIG } from "../config/GameConfig.js";

export class GameState {
  constructor() {
    this.board = [];
    this.heap = 0;
    this.goal = GAME_CONFIG.INITIAL_GOAL;
    this.score = 0;
    this.history = [];
    this.gameOver = false;
    this.repaintMode = false;
    this.animating = false;
  }

  saveState() {
    if (this.history.length >= GAME_CONFIG.MAX_HISTORY) {
      this.history.shift();
    }

    this.history.push({
      board: this.board.map((row) =>
        row.map((cell) => (cell ? { ...cell } : null))
      ),
      heap: this.heap,
      goal: this.goal,
      score: this.score,
    });
  }

  restoreState() {
    if (this.history.length > 0 && !this.gameOver) {
      const lastState = this.history.pop();
      this.board = lastState.board;
      this.heap = lastState.heap;
      this.goal = lastState.goal;
      this.score = lastState.score;
      this.gameOver = false;
      return true;
    }
    return false;
  }

  updateScore(value) {
    this.score += value;
  }

  updateHeap(value) {
    this.heap = Math.max(this.heap, value);
  }

  incrementGoal() {
    this.goal += GAME_CONFIG.GOAL_INCREMENT;
  }

  setGameOver(value) {
    this.gameOver = value;
  }

  setRepaintMode(value) {
    this.repaintMode = value;
  }

  setAnimating(value) {
    this.animating = value;
  }

  getBoard() {
    return this.board;
  }

  setBoard(board) {
    this.board = board;
  }

  getHeap() {
    return this.heap;
  }

  getGoal() {
    return this.goal;
  }

  getScore() {
    return this.score;
  }

  isGameOver() {
    return this.gameOver;
  }

  isRepaintMode() {
    return this.repaintMode;
  }

  isAnimating() {
    return this.animating;
  }
}
