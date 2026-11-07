import { GAME_EVENTS } from "../game/events.js";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Crosshair,
  Eye,
  EyeOff,
  Heart,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  createIcons,
} from "lucide";

const UI_ICONS = {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Crosshair,
  Eye,
  EyeOff,
  Heart,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
};

// Conecta los controles del DOM con comandos de juego sin exponer la escena.
export function bindGameControls(
  game,
  { root = document.querySelector("#app"), win = window } = {},
) {
  const listeners = [];
  let gamePaused = false;

  const playButton = root.querySelector("#play-button");
  const playLabel = root.querySelector("#play-label");
  const pauseButton = root.querySelector("#pause-button");
  const pauseLabel = root.querySelector("#pause-label");
  const pauseIcon = root.querySelector("#pause-icon");
  const restartButton = root.querySelector("#restart-button");
  const difficultyButtons = [...root.querySelectorAll(".difficulty-button")];
  const directionButtons = [...root.querySelectorAll(".direction-button")];
  const touchControls = root.querySelector("#touch-controls");
  const touchControlsToggle = root.querySelector("#touch-controls-toggle");
  const touchToggleLabel = root.querySelector("#touch-toggle-label");
  const touchToggleIcon = root.querySelector("#touch-toggle-icon");
  const musicButton = root.querySelector("#music-button");
  const musicLabel = root.querySelector("#music-label");
  const musicIcon = root.querySelector("#music-icon");

  createIcons({
    icons: UI_ICONS,
    attrs: { class: "ui-icon", "stroke-width": 1.8 },
    root,
  });

  // Mantiene ambos SVG montados para que el estado cambie sin recrear iconos.
  function showIconState(container, state) {
    container.querySelectorAll("[data-icon-state]").forEach((iconState) => {
      iconState.hidden = iconState.dataset.iconState !== state;
    });
  }

  function listen(target, eventName, handler, options) {
    target.addEventListener(eventName, handler, options);
    listeners.push(() => target.removeEventListener(eventName, handler, options));
  }

  function listenToGame(eventName, handler) {
    game.events.on(eventName, handler);
    listeners.push(() => game.events.off(eventName, handler));
  }

  function setTouchControlsVisible(visible) {
    touchControls.classList.toggle("is-hidden", !visible);
    touchControlsToggle.setAttribute("aria-expanded", String(visible));
    touchControlsToggle.setAttribute(
      "aria-label",
      visible ? "Ocultar controles táctiles" : "Mostrar controles táctiles",
    );
    touchToggleLabel.textContent = visible
      ? "OCULTAR CONTROLES"
      : "MOSTRAR CONTROLES";
    showIconState(touchToggleIcon, visible ? "visible" : "hidden");

    if (!visible) {
      game.events.emit(GAME_EVENTS.CLEAR_TOUCH_DIRECTIONS);
      directionButtons.forEach((button) =>
        button.classList.remove("is-pressed"),
      );
    }
  }

  // El pad inicia visible solo cuando el dispositivo informa un puntero táctil.
  setTouchControlsVisible(win.matchMedia("(pointer: coarse)").matches);

  listen(touchControlsToggle, "click", () => {
    setTouchControlsVisible(touchControls.classList.contains("is-hidden"));
  });
  listen(playButton, "click", () => {
    game.events.emit(GAME_EVENTS.START_GAME);
  });
  listen(pauseButton, "click", () => {
    game.events.emit(
      gamePaused ? GAME_EVENTS.RESUME_GAME : GAME_EVENTS.PAUSE_GAME,
    );
  });
  listen(restartButton, "click", () => {
    game.events.emit(GAME_EVENTS.RESTART_GAME);
  });
  difficultyButtons.forEach((button) => {
    listen(button, "click", () => {
      game.events.emit(GAME_EVENTS.SELECT_DIFFICULTY, button.dataset.difficulty);
    });
  });

  // La captura mantiene la dirección activa aunque el puntero salga del botón.
  directionButtons.forEach((button) => {
    const direction = button.dataset.direction;

    listen(button, "pointerdown", (event) => {
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      game.events.emit(GAME_EVENTS.TOUCH_DIRECTION, direction, true);
      button.classList.add("is-pressed");
    });

    const releaseDirection = (event) => {
      if (
        event.type === "lostpointercapture" &&
        !button.classList.contains("is-pressed")
      ) {
        return;
      }

      game.events.emit(GAME_EVENTS.TOUCH_DIRECTION, direction, false);
      button.classList.remove("is-pressed");
    };

    listen(button, "pointerup", releaseDirection);
    listen(button, "pointercancel", releaseDirection);
    listen(button, "lostpointercapture", releaseDirection);
  });

  listen(win, "blur", () => {
    game.events.emit(GAME_EVENTS.CLEAR_TOUCH_DIRECTIONS);
    directionButtons.forEach((button) => button.classList.remove("is-pressed"));
  });

  listen(musicButton, "click", () => {
    const enabled = musicButton.getAttribute("aria-pressed") !== "true";
    musicButton.setAttribute("aria-pressed", String(enabled));
    musicLabel.textContent = enabled ? "APAGAR MÚSICA" : "ACTIVAR MÚSICA";
    showIconState(musicIcon, enabled ? "enabled" : "disabled");
    game.events.emit(GAME_EVENTS.MUSIC_CHANGED, enabled);
  });

  listenToGame(GAME_EVENTS.GAME_STARTED, () => {
    gamePaused = false;
    playLabel.textContent = "MISIÓN EN CURSO";
    playButton.disabled = true;
    playButton.classList.add("is-playing");
    pauseButton.disabled = false;
    restartButton.disabled = false;
    difficultyButtons.forEach((button) => {
      button.disabled = true;
    });
    pauseLabel.textContent = "PAUSAR";
    showIconState(pauseIcon, "paused");
  });

  listenToGame(GAME_EVENTS.DIFFICULTY_CHANGED, (difficulty) => {
    difficultyButtons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.difficulty === difficulty),
      );
    });
  });

  listenToGame(GAME_EVENTS.GAME_PAUSED, () => {
    gamePaused = true;
    pauseLabel.textContent = "REANUDAR";
    showIconState(pauseIcon, "resumed");
  });

  listenToGame(GAME_EVENTS.GAME_RESUMED, () => {
    gamePaused = false;
    pauseLabel.textContent = "PAUSAR";
    showIconState(pauseIcon, "paused");
  });

  listenToGame(GAME_EVENTS.GAME_OVER, () => {
    gamePaused = false;
    playLabel.textContent = "JUGAR DE NUEVO";
    playButton.disabled = false;
    playButton.classList.remove("is-playing");
    pauseButton.disabled = true;
    difficultyButtons.forEach((button) => {
      button.disabled = false;
    });
  });

  return function unbindGameControls() {
    listeners.splice(0).forEach((removeListener) => removeListener());
  };
}
