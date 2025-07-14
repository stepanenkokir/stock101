import { GAME_CONFIG } from "../config/GameConfig.js";
import { getRandomElement, safeExecute } from "../utils/Utilities.js";

export class GameLogicService {
  constructor(colorManager) {
    this.colorManager = colorManager;
  }

  initBoard() {
    return safeExecute(() => {
      const board = Array(GAME_CONFIG.BOARD_SIZE)
        .fill()
        .map(() => Array(GAME_CONFIG.BOARD_SIZE).fill(null));

      for (let i = 0; i < GAME_CONFIG.BOARD_SIZE; i++) {
        for (let j = 0; j < GAME_CONFIG.BOARD_SIZE; j++) {
          const randomColor = this.colorManager.getRandomColor();
          board[i][j] = {
            value: 1,
            color: randomColor,
          };
        }
      }
      return board;
    }, "Error initializing board");
  }

  getAdjacentSameColor(board, row, col, color) {
    return safeExecute(() => {
      const adjacent = [];
      const directions = Object.values(GAME_CONFIG.DIRECTIONS);

      directions.forEach((dir) => {
        const newRow = row + dir.row;
        const newCol = col + dir.col;

        if (
          newRow >= 0 &&
          newRow < GAME_CONFIG.BOARD_SIZE &&
          newCol >= 0 &&
          newCol < GAME_CONFIG.BOARD_SIZE
        ) {
          const adjacentTile = board[newRow][newCol];
          if (adjacentTile && adjacentTile.color === color) {
            adjacent.push({
              row: newRow,
              col: newCol,
              direction: dir.name,
              value: adjacentTile.value,
            });
          }
        }
      });

      return adjacent;
    }, "Error finding adjacent tiles");
  }

  calculateShifts(centerRow, centerCol, adjacentTiles) {
    return safeExecute(() => {
      const shifts = [];

      adjacentTiles.forEach((adjacent) => {
        switch (adjacent.direction) {
          case "left":
            for (let c = adjacent.col; c >= 0; c--) {
              if (c + 1 <= centerCol) {
                shifts.push({
                  from: { row: centerRow, col: c },
                  to: { row: centerRow, col: c + 1 },
                });
              }
            }
            break;
          case "right":
            for (let c = adjacent.col; c < GAME_CONFIG.BOARD_SIZE; c++) {
              if (c - 1 >= centerCol) {
                shifts.push({
                  from: { row: centerRow, col: c },
                  to: { row: centerRow, col: c - 1 },
                });
              }
            }
            break;
          case "up":
            for (let r = adjacent.row; r >= 0; r--) {
              if (r + 1 <= centerRow) {
                shifts.push({
                  from: { row: r, col: centerCol },
                  to: { row: r + 1, col: centerCol },
                });
              }
            }
            break;
          case "down":
            for (let r = adjacent.row; r < GAME_CONFIG.BOARD_SIZE; r++) {
              if (r - 1 >= centerRow) {
                shifts.push({
                  from: { row: r, col: centerCol },
                  to: { row: r - 1, col: centerCol },
                });
              }
            }
            break;
        }
      });

      return shifts;
    }, "Error calculating shifts");
  }

  applyShifts(board, shifts) {
    return safeExecute(() => {
      const newBoard = board.map((row) => [...row]);

      shifts.forEach((shift) => {
        newBoard[shift.from.row][shift.from.col] = null;
      });

      shifts.forEach((shift) => {
        const tile = board[shift.from.row][shift.from.col];
        if (tile) {
          newBoard[shift.to.row][shift.to.col] = tile;
        }
      });

      return newBoard;
    }, "Error applying shifts");
  }

  fillEmptySpaces(board) {
    return safeExecute(() => {
      const newBoard = board.map((row) => [...row]);

      for (let i = 0; i < GAME_CONFIG.BOARD_SIZE; i++) {
        for (let j = 0; j < GAME_CONFIG.BOARD_SIZE; j++) {
          if (!newBoard[i][j]) {
            const randomColor = this.colorManager.getRandomColor();
            newBoard[i][j] = {
              value: 1,
              color: randomColor,
              new: true,
            };
          } else if (newBoard[i][j] && newBoard[i][j].new) {
            // Clear the new flag for existing tiles
            delete newBoard[i][j].new;
          }
        }
      }

      return newBoard;
    }, "Error filling empty spaces");
  }

  checkGameOver(board, heap, goal) {
    return safeExecute(() => {
      if (heap > goal) {
        return {
          isOver: true,
          reason: `Куча слишком большая!\nНужно РОВНО ${goal}`,
        };
      }

      for (let i = 0; i < GAME_CONFIG.BOARD_SIZE; i++) {
        for (let j = 0; j < GAME_CONFIG.BOARD_SIZE; j++) {
          if (!board[i][j]) continue;

          const adjacentTiles = this.getAdjacentSameColor(
            board,
            i,
            j,
            board[i][j].color
          );
          if (adjacentTiles.length > 0) {
            return { isOver: false };
          }
        }
      }

      return { isOver: true, reason: "Нет доступных ходов!" };
    }, "Error checking game over");
  }

  calculateTotalValue(centerTile, adjacentTiles) {
    let totalValue = centerTile.value;
    adjacentTiles.forEach((adjacent) => {
      totalValue += adjacent.value;
    });
    return totalValue;
  }
}
