// Valores actuales de las reglas; centralizarlos no modifica el balance del juego.
export const GAMEPLAY_CONFIG = Object.freeze({
  initialLives: 3,
  player: Object.freeze({
    startX: 240,
    startY: 390,
    width: 44,
    height: 44,
    speed: 245,
    minX: 24,
    maxX: 456,
    minY: 42,
    maxY: 456,
    collisionRadius: 13,
  }),
  spawning: Object.freeze({
    asteroidDelay: 720,
    coinDelay: 1050,
    asteroidSize: Object.freeze([32, 58]),
    asteroidX: Object.freeze([28, 452]),
    asteroidSpeed: Object.freeze([125, 205]),
    asteroidSpin: Object.freeze([-1.2, 1.2]),
    coinX: Object.freeze([25, 455]),
    coinSpeed: Object.freeze([105, 155]),
    coinValues: Object.freeze([1, 1, 1, 5, 5, 10]),
  }),
  collision: Object.freeze({
    asteroidScale: 0.34,
    coinRadius: 22,
  }),
  cleanup: Object.freeze({
    removeBelowY: 510,
  }),
  difficulty: Object.freeze({
    maxBonus: 0.45,
    scoreStep: 200,
  }),
});
