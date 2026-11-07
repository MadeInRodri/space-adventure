// Centraliza el contrato de eventos entre la interfaz y la escena de Phaser.
export const GAME_EVENTS = Object.freeze({
  START_GAME: "start-game",
  SELECT_DIFFICULTY: "select-difficulty",
  PAUSE_GAME: "pause-game",
  RESUME_GAME: "resume-game",
  RESTART_GAME: "restart-game",
  TOUCH_DIRECTION: "touch-direction",
  CLEAR_TOUCH_DIRECTIONS: "clear-touch-directions",
  MUSIC_CHANGED: "music-changed",
  GAME_STARTED: "game-started",
  DIFFICULTY_CHANGED: "difficulty-changed",
  GAME_PAUSED: "game-paused",
  GAME_RESUMED: "game-resumed",
  GAME_OVER: "game-over",
});
