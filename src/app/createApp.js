import { createGame } from "../game/createGame.js";
import { GAME_EVENTS } from "../game/events.js";
import { createScoreRepository } from "../scores/scoreRepository.js";
import { bindGameControls } from "../ui/controls.js";
import { GAME_MARKUP } from "../ui/markup.js";
import { createScoreBoard } from "../ui/scoreBoard.js";

// Construye y conecta las partes de la aplicación sin mezclar sus responsabilidades.
export function createApp({
  root = document.querySelector("#app"),
} = {}) {
  if (!root) {
    throw new Error('No se encontró el elemento raíz "#app".');
  }
  if (root.dataset.spaceAdventureInitialized === "true") {
    throw new Error("SpaceAdventure ya está inicializado en este elemento.");
  }

  const doc = root.ownerDocument;
  const win = doc.defaultView;
  root.innerHTML = GAME_MARKUP;
  root.dataset.spaceAdventureInitialized = "true";

  const scoreRepository = createScoreRepository();
  const scoreBoard = createScoreBoard(root);
  const initialScores = scoreRepository.load();
  scoreBoard.render(initialScores.scores);
  if (initialScores.error) {
    scoreBoard.setStatus("NO SE PUDIERON CARGAR LOS RÉCORDS GUARDADOS.");
  }

  const game = createGame(root.querySelector("#game-canvas"));
  const unbindControls = bindGameControls(game, { root, win });
  const listeners = [];
  let musicEnabled = true;
  let gameRunning = false;
  const hasCoarsePointer = win.matchMedia("(pointer: coarse)").matches;
  const menuMusic = new win.Audio("/assets/music-menu.mp3");

  menuMusic.loop = true;
  menuMusic.volume = 0.25;

  // Bloquea el desplazamiento solo en dispositivos táctiles durante la partida.
  function setPageScrollLocked(locked) {
    if (hasCoarsePointer) {
      doc.documentElement.classList.toggle("game-scroll-locked", locked);
    }
  }

  // Respeta la preferencia del jugador y los bloqueos de reproducción del navegador.
  function playMenuMusic() {
    if (!musicEnabled || gameRunning || !menuMusic.paused) return;

    menuMusic.play().catch((error) => {
      if (error.name !== "NotAllowedError") {
        console.error("No se pudo reproducir la música del menú.", error);
      }
    });
  }

  function listenToGame(eventName, handler) {
    game.events.on(eventName, handler);
    listeners.push(() => game.events.off(eventName, handler));
  }

  function listen(target, eventName, handler, options) {
    target.addEventListener(eventName, handler, options);
    listeners.push(() => target.removeEventListener(eventName, handler, options));
  }

  listenToGame(GAME_EVENTS.GAME_STARTED, () => {
    gameRunning = true;
    setPageScrollLocked(true);
    menuMusic.pause();
    game.events.emit(GAME_EVENTS.MUSIC_CHANGED, musicEnabled);
  });

  listenToGame(GAME_EVENTS.GAME_PAUSED, () => {
    setPageScrollLocked(false);
  });

  listenToGame(GAME_EVENTS.GAME_RESUMED, () => {
    setPageScrollLocked(true);
  });

  listenToGame(GAME_EVENTS.MUSIC_CHANGED, (enabled) => {
    musicEnabled = enabled;
    if (!enabled) {
      menuMusic.pause();
    } else if (!gameRunning) {
      playMenuMusic();
    }
  });

  listenToGame(GAME_EVENTS.GAME_OVER, (score) => {
    gameRunning = false;
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
  });

  // Registra los primeros gestos para cumplir las políticas de reproducción del navegador.
  listen(doc, "pointerdown", playMenuMusic, { once: true });
  listen(doc, "keydown", playMenuMusic, { once: true });
  playMenuMusic();

  return {
    game,
    destroy() {
      unbindControls();
      listeners.splice(0).forEach((removeListener) => removeListener());
      menuMusic.pause();
      game.destroy(true);
      setPageScrollLocked(false);
      root.replaceChildren();
      delete root.dataset.spaceAdventureInitialized;
    },
  };
}
