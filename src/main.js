import "./style.css";
import { createScoreRepository } from "./scores/scoreRepository.js";
import { createScoreBoard } from "./ui/scoreBoard.js";
import { createGame } from "./game/createGame.js";
import { GAME_EVENTS } from "./game/events.js";

// INTERFAZ: estructura de la página que envuelve el canvas de Phaser y sus controles.
const gameMarkup = `
  <main class="page-shell">
    <header class="site-header">
      <p class="eyebrow"><span class="status-light"></span> MADEINRODRI // AI POWERED. 2025</p>
      <h1>SPACE<span> ADVENTURE</span></h1>
      <p class="intro">UNA MISIÓN. UN UNIVERSO. ¿CUÁNTO PUEDES SOBREVIVIR?</p>
    </header>

    <section class="game-section" aria-label="Videojuego SpaceAdventure">
      <div class="game-shell">
        <span class="corner corner-top-left" aria-hidden="true"></span>
        <span class="corner corner-top-right" aria-hidden="true"></span>
        <span class="corner corner-bottom-left" aria-hidden="true"></span>
        <span class="corner corner-bottom-right" aria-hidden="true"></span>
        <div id="game-canvas" aria-label="Juego: esquiva asteroides y recoge monedas"></div>
      </div>

      <div class="touch-controls is-hidden" id="touch-controls" role="group" aria-label="Controles táctiles de dirección">
        <button class="direction-button direction-up" type="button" data-direction="up" aria-label="Mover arriba">↑</button>
        <button class="direction-button direction-left" type="button" data-direction="left" aria-label="Mover a la izquierda">←</button>
        <span class="direction-center" aria-hidden="true">✦</span>
        <button class="direction-button direction-right" type="button" data-direction="right" aria-label="Mover a la derecha">→</button>
        <button class="direction-button direction-down" type="button" data-direction="down" aria-label="Mover abajo">↓</button>
      </div>

      <div class="game-actions" aria-label="Controles de la partida">
        <button class="play-button" id="play-button" type="button">
          <span class="play-icon" aria-hidden="true">▶</span>
          <span id="play-label">INICIAR MISIÓN</span>
        </button>
        <button class="secondary-button" id="pause-button" type="button" disabled>
          <span id="pause-icon" aria-hidden="true">Ⅱ</span>
          <span id="pause-label">PAUSAR</span>
        </button>
        <button class="secondary-button" id="restart-button" type="button" disabled>
          <span aria-hidden="true">↻</span>
          <span>REINICIAR</span>
        </button>
      </div>
      <p class="control-hint"><span>←</span> <span>↑</span> <span>↓</span> <span>→</span> PARA MOVERTE</p>

      <section class="player-stats" aria-labelledby="stats-title">
        <div class="stats-heading">
          <div>
            <p class="stats-kicker">ARCHIVO DE MISIONES</p>
            <h2 id="stats-title">TUS MEJORES PUNTUACIONES</h2>
          </div>
          <p class="personal-best">RÉCORD PERSONAL <span id="personal-best">00000</span></p>
        </div>
        <p class="stats-status" id="stats-status" aria-live="polite"></p>
        <div class="scores-table-wrap">
          <table class="scores-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">PUNTOS</th>
                <th scope="col">FECHA Y HORA</th>
              </tr>
            </thead>
            <tbody id="scores-list"></tbody>
          </table>
        </div>
      </section>
    </section>

    <button class="music-button" id="music-button" type="button" aria-pressed="true">
      <span id="music-icon" aria-hidden="true">♫</span>
      <span id="music-label">APAGAR MÚSICA</span>
    </button>
    <button
      class="touch-controls-toggle"
      id="touch-controls-toggle"
      type="button"
      aria-controls="touch-controls"
      aria-expanded="false"
    >
      <span id="touch-toggle-icon" aria-hidden="true">⌖</span>
      <span id="touch-toggle-label">MOSTRAR CONTROLES</span>
    </button>

    <footer class="site-footer">
      <div class="footer-line"></div>
      <p>CREADO CON <span class="footer-heart">♥</span> Y MUCHO CAFÉ, por MADEINRODRI</p>
      <p class="footer-credit">SPACE ADVENTURE <span>·</span> EXPLORA. ESQUIVA. SOBREVIVE.</p>
    </footer>
  </main>
`;

document.querySelector("#app").innerHTML = gameMarkup;

// Carga los récords una vez y conserva separados almacenamiento y presentación.
const scoreRepository = createScoreRepository();
const scoreBoard = createScoreBoard();
const initialScores = scoreRepository.load();
scoreBoard.render(initialScores.scores);
if (initialScores.error) {
  scoreBoard.setStatus("NO SE PUDIERON CARGAR LOS RÉCORDS GUARDADOS.");
}

// AUDIO DEL MENÚ: estas variables permiten coordinar la música web y la del juego.
let musicEnabled = true;
let gameRunning = false;
let gamePaused = false;
const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
const menuMusic = new Audio("/assets/music-menu.mp3");
menuMusic.loop = true;
menuMusic.volume = 0.25;

// Evita el scroll accidental en teléfonos mientras se juega, sin alterar escritorio.
function setPageScrollLocked(locked) {
  if (hasCoarsePointer) {
    document.documentElement.classList.toggle("game-scroll-locked", locked);
  }
}

/**
 * Reproduce la música del menú si está habilitada y no hay una partida activa.
 * Si el navegador bloquea el autoplay, se volverá a intentar tras una interacción.
 */
function playMenuMusic() {
  if (!musicEnabled || gameRunning || !menuMusic.paused) return;

  menuMusic.play().catch((error) => {
    if (error.name !== "NotAllowedError") {
      console.error("No se pudo reproducir la música del menú.", error);
    }
  });
}



const game = createGame();

// CONTROLES HTML: conectan los botones externos con los eventos y el estado de Phaser.
const playButton = document.querySelector("#play-button");
const playLabel = document.querySelector("#play-label");
const pauseButton = document.querySelector("#pause-button");
const pauseLabel = document.querySelector("#pause-label");
const pauseIcon = document.querySelector("#pause-icon");
const restartButton = document.querySelector("#restart-button");
const directionButtons = document.querySelectorAll(".direction-button");
const touchControls = document.querySelector("#touch-controls");
const touchControlsToggle = document.querySelector("#touch-controls-toggle");
const touchToggleLabel = document.querySelector("#touch-toggle-label");
const touchToggleIcon = document.querySelector("#touch-toggle-icon");
const musicButton = document.querySelector("#music-button");
const musicLabel = document.querySelector("#music-label");
const musicIcon = document.querySelector("#music-icon");

// En pantallas táctiles el pad inicia visible; en equipos de escritorio queda oculto.
const setTouchControlsVisible = (visible) => {
  touchControls.classList.toggle("is-hidden", !visible);
  touchControlsToggle.setAttribute("aria-expanded", String(visible));
  touchControlsToggle.setAttribute(
    "aria-label",
    visible ? "Ocultar controles táctiles" : "Mostrar controles táctiles",
  );
  touchToggleLabel.textContent = visible
    ? "OCULTAR CONTROLES"
    : "MOSTRAR CONTROLES";
  touchToggleIcon.textContent = visible ? "×" : "⌖";
  if (!visible) {
    game.events.emit(GAME_EVENTS.CLEAR_TOUCH_DIRECTIONS);
    directionButtons.forEach((button) => button.classList.remove("is-pressed"));
  }
};

setTouchControlsVisible(hasCoarsePointer);

touchControlsToggle.addEventListener("click", () => {
  setTouchControlsVisible(touchControls.classList.contains("is-hidden"));
});

playButton.addEventListener("click", () => {
  game.events.emit(GAME_EVENTS.START_GAME);
});

pauseButton.addEventListener("click", () => {
  game.events.emit(
    gamePaused ? GAME_EVENTS.RESUME_GAME : GAME_EVENTS.PAUSE_GAME,
  );
});

restartButton.addEventListener("click", () => {
  game.events.emit(GAME_EVENTS.RESTART_GAME);
});

// pointer capture conserva el movimiento sostenido aunque el dedo se deslice fuera del botón.
directionButtons.forEach((button) => {
  const direction = button.dataset.direction;

  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    game.events.emit(GAME_EVENTS.TOUCH_DIRECTION, direction, true);
    button.classList.add("is-pressed");
  });

  const releaseDirection = (event) => {
    if (
      event.type === "lostpointercapture" &&
      !button.classList.contains("is-pressed")
    )
      return;
    game.events.emit(GAME_EVENTS.TOUCH_DIRECTION, direction, false);
    button.classList.remove("is-pressed");
  };

  button.addEventListener("pointerup", releaseDirection);
  button.addEventListener("pointercancel", releaseDirection);
  button.addEventListener("lostpointercapture", releaseDirection);
});

window.addEventListener("blur", () => {
  game.events.emit(GAME_EVENTS.CLEAR_TOUCH_DIRECTIONS);
  directionButtons.forEach((button) => button.classList.remove("is-pressed"));
});

game.events.on(GAME_EVENTS.GAME_STARTED, () => {
  gameRunning = true;
  gamePaused = false;
  game.events.emit(GAME_EVENTS.MUSIC_CHANGED, musicEnabled);
  setPageScrollLocked(true);
  menuMusic.pause();
  playLabel.textContent = "MISIÓN EN CURSO";
  playButton.disabled = true;
  playButton.classList.add("is-playing");
  pauseButton.disabled = false;
  restartButton.disabled = false;
  pauseLabel.textContent = "PAUSAR";
  pauseIcon.textContent = "Ⅱ";
});

game.events.on(GAME_EVENTS.GAME_PAUSED, () => {
  gamePaused = true;
  setPageScrollLocked(false);
  pauseLabel.textContent = "REANUDAR";
  pauseIcon.textContent = "▶";
});

game.events.on(GAME_EVENTS.GAME_RESUMED, () => {
  gamePaused = false;
  setPageScrollLocked(true);
  pauseLabel.textContent = "PAUSAR";
  pauseIcon.textContent = "Ⅱ";
});

game.events.on(GAME_EVENTS.GAME_OVER, (score) => {
  gameRunning = false;
  gamePaused = false;
  setPageScrollLocked(false);
  playMenuMusic();
  // La escena entrega el resultado; aquí se persiste y se actualiza la interfaz.
  const result = scoreRepository.save(score);
  if (result.error) {
    scoreBoard.setStatus(
      "NO SE PUDO GUARDAR ESTA PUNTUACIÓN EN ESTE NAVEGADOR.",
    );
  } else {
    scoreBoard.setStatus("");
    scoreBoard.render(result.scores);
  }

  playLabel.textContent = "JUGAR DE NUEVO";
  playButton.disabled = false;
  playButton.classList.remove("is-playing");
  pauseButton.disabled = true;
});

// El botón de música conmuta audio de menú o de partida sin alterar su estado de juego.
musicButton.addEventListener("click", () => {
  musicEnabled = !musicEnabled;
  musicButton.setAttribute("aria-pressed", String(musicEnabled));
  musicLabel.textContent = musicEnabled ? "APAGAR MÚSICA" : "ACTIVAR MÚSICA";
  musicIcon.textContent = musicEnabled ? "♫" : "×";
  game.events.emit(GAME_EVENTS.MUSIC_CHANGED, musicEnabled);

  if (musicEnabled) {
    if (!gameRunning) playMenuMusic();
  } else {
    menuMusic.pause();
  }
});

// Los navegadores pueden exigir una acción del usuario antes de permitir reproducir audio.
document.addEventListener("pointerdown", playMenuMusic, { once: true });
document.addEventListener("keydown", playMenuMusic, { once: true });
playMenuMusic();

// PRÓXIMAS MEJORAS: agregar controles táctiles para móviles, récord local y dificultad ajustable.
