// Game configuration constants
export const GAME_CONFIG = {
  BOARD_SIZE: 4,
  INITIAL_GOAL: 101,
  GOAL_INCREMENT: 101,
  MAX_HISTORY: 10,
  ANIMATION_DURATION: 300,
  TOUCH_THRESHOLD: 300,
  TOUCH_DISTANCE_THRESHOLD: 10,
  COLORS: {
    RED: "red",
    BLUE: "blue",
    GREEN: "green",
    MAGENTA: "magenta",
    WORKING: "yellow",
  },
  DIRECTIONS: {
    UP: { row: -1, col: 0, name: "up" },
    DOWN: { row: 1, col: 0, name: "down" },
    LEFT: { row: 0, col: -1, name: "left" },
    RIGHT: { row: 0, col: 1, name: "right" },
  },
};

export const DOM_IDS = {
  HEAP: "heap",
  GOAL: "goal",
  SCORE: "score",
  GAME_BOARD: "gameBoard",
  UNDO_BTN: "undoBtn",
  UNDO_BTN2: "undoBtn2",
  REPAINT_BTN: "repaintBtn",
  RESTART_BTN: "restartBtn",
  SETTINGS_BTN: "settingsBtn",
  SOUND_BTN: "soundBtn",
  GAME_OVER_MODAL: "gameOverModal",
  GAME_OVER_TITLE: "gameOverTitle",
  GAME_OVER_TEXT: "gameOverText",
  SETTINGS_PANEL: "settingsPanel",
  COLOR_PICKER: "colorPicker",
  RESTART_CONFIRM_MODAL: "restartConfirmModal",
  RESTART_CONFIRM_TITLE: "restartConfirmTitle",
  RESTART_CONFIRM_TEXT: "restartConfirmText",
  RESTART_CONFIRM_YES: "restartConfirmYes",
  RESTART_CONFIRM_NO: "restartConfirmNo",
  NEW_GAME_BTN: "newGameBtn",
  CLOSE_SETTINGS_BTN: "closeSettingsBtn",
};

export const CSS_CLASSES = {
  TILE: "tile",
  TILE_APPEAR: "tile-appear",
  COLOR_OPTION: "color-option",
  SELECTED: "selected",
  GOAL_INDICATOR: "goal-indicator",
};
